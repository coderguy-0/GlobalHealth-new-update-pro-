# GlobalHealth

A unified healthcare platform: verified medical knowledge, medicine monographs,
lab-test references, provider and facility discovery, live medical mapping,
health calculators, healthcare news, and patient-controlled health records.

The whole product ships as **one full-stack process** — an Express server that
serves both the built SPA and `/api/*`.

---

## Quick start

```sh
npm install          # Node 20+ required (.nvmrc pins 22)
npm run dev          # http://localhost:3000 — Vite dev server + HMR
```

`npm run dev` runs in development mode with hot reload. It works with an
**empty environment**: features whose secrets are missing degrade safely rather
than crashing (see [Configuration](#configuration)).

### Verify before you ship

```sh
npm run verify       # typecheck → tests → production build
npm run deploy:check # deployment preflight (see below)
```

---

## Deploy

### One-command local production rehearsal

```sh
docker compose up --build     # http://localhost:3000
```

This builds and runs the exact image that goes to production.

### Docker

```sh
docker build -t globalhealth .
docker run -p 3000:3000 \
  --env-file .env \
  -v globalhealth-data:/app/data \
  globalhealth
```

> The `/app/data` volume is **required**. It holds account, consent and domain
> state written by the runtime persistence layer. Without it, that state is
> lost every time the container is replaced.

### Platform blueprints

| Platform | File | Notes |
| --- | --- | --- |
| Docker / any container host | `Dockerfile`, `.dockerignore` | Multi-stage, non-root, healthcheck built in |
| Render | `render.yaml` | Blueprint provisions service, disk and probes |
| Fly.io | `fly.toml` | Single machine + volume (see *Scaling* below) |
| Heroku / Railway / Dokku | `Procfile` | Build via `heroku-postbuild` |

### The deployment preflight

`npm run deploy:check` answers one question: *is this checkout actually safe to
deploy?* It is wired into the Render build command and the CI workflow, so a
broken deploy fails at build time instead of at 3am on the live host.

It verifies:

- Node version satisfies `engines.node`
- `package-lock.json` is in sync with `package.json` (the most common cause of
  "works locally, fails on the build host")
- `dist/index.html` and `dist/server.cjs` both exist
- the runtime state directory is actually writable (`/api/ready` depends on it)
- `GH_RUNTIME_DIR` is not pointed at `/tmp`, which is wiped on container restart
- `CORS_ORIGIN` has no `*` and every entry is a valid origin
- secrets loaded from a file are not still placeholders
- no sourcemap is shipped (drops ~38 MB)

```sh
npm run deploy:check                # allow warnings
npm run deploy:check -- --production # also enforce prod-only rules
```

Exit code `0` = deployable. `1` = blockers listed, deploy nothing.

---

## Configuration

All configuration is environment-based. Copy the template and fill it in:

```sh
cp .env.production.example .env
```

The server starts with an **empty** environment and fails *closed* per feature.
Nothing is "required to boot", but the following degrade a capability when
absent — the preflight prints exactly which are missing:

| Variable | Without it |
| --- | --- |
| `GEMINI_API_KEY` | AI Assistant returns "not configured" |
| `MEDAUTH_REGISTRY_URL` / `_SECRET` | Clinician verification stays `NOT_VERIFIED` (fail closed) |
| `PRESCRIPTION_SIGNING_SECRET` | Prescriptions are held `UNSIGNED` |
| `GH_ADMIN_KEY` | Pharmacy admin verification disabled |
| `CORS_ORIGIN` | Same-origin only — **correct** for the single-process deploy |

Generate secrets with:

```sh
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

> **Do not set `NODE_ENV` in `.env`.** `npm start` and `npm run dev` each pin
> the mode they are named for; a value in `.env` overrides both and would make
> `npm run dev` boot in production mode with no hot reload.

See `docs/ENVIRONMENT.md` for the complete reference.

---

## Health probes

| Path | Purpose |
| --- | --- |
| `GET /healthz` | Liveness — process is up |
| `GET /readyz` | Readiness — runtime state directory is writable |
| `GET /api/health` | Detailed health + memory + uptime |
| `GET /api/ready` | Readiness (application-facing alias) |

The root-level `/healthz` and `/readyz` aliases exist because most
orchestrators default to those paths; `/api/*` is for application clients.

---

## Architecture notes

- **Static assets.** Vite emits content-hashed filenames, served
  `immutable, max-age=31536000`. `index.html`, `sw.js` and the manifest are
  served `no-cache` so a deploy is picked up immediately — a stale `sw.js`
  would otherwise pin visitors to an old release.
- **Compression.** Responses are gzipped/brotli'd. The clinical datasets are
  large (the nutrition library is 10.6 MB raw, ~419 KB gzipped), so this is not
  optional in production.
- **Service worker.** Network-first for navigations, cache-first only for
  hashed assets, and it **never** caches `/api/*` or token-bearing URLs — no
  patient data in a shared disk cache. Registered in production builds only.
- **Runtime state.** `GH_RUNTIME_DIR/runtime` holds account and domain state on
  the filesystem. It is not a relational database yet; see
  `docs/migration-plan.md` Phase 3.

### Scaling

Run **one instance** until the database migration lands. Session handling, rate
limiting and the runtime persistence layer are per-instance; multiple replicas
need shared storage and a shared session/rate-limit store. Scale vertically.

---

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR (pins development mode) |
| `npm run build` | Production build → `dist/` (no sourcemap) |
| `npm run build:debug` | Same, with sourcemaps (diagnostics only) |
| `npm start` | Production server (pins production mode) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Test suite |
| `npm run verify` | typecheck → test → build |
| `npm run deploy:check` | Deployment preflight |
| `npm run clean` | Remove build output |

---

## Documentation

`docs/` contains the deeper material: `ARCHITECTURE.md`, `API.md`,
`DEPLOYMENT.md`, `ENVIRONMENT.md`, `SECURITY.md`, `TESTING.md`, and the portal
phase plans under `docs/{doctor,hospital,pharmacy}-portal/`.

### Continuous integration

The GitHub Actions workflow is committed at `docs/ci/github-actions-ci.yml`.
Activate it once with:

```sh
mkdir -p .github/workflows && cp docs/ci/github-actions-ci.yml .github/workflows/ci.yml
```

It gates every push and PR on typecheck → tests → build → `deploy:check`, then
boots the real production server and asserts `/healthz`, `/readyz`, the SPA
shell, the `sw.js` cache header and gzip negotiation, plus a Docker build and
container smoke test.

---

## Medical disclaimer

GlobalHealth provides educational healthcare discovery and care-coordination
tools. It does not provide medical advice, diagnosis, or treatment, and is not a
substitute for a licensed clinician or emergency services.
