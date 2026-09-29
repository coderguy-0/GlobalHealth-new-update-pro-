# GlobalHealth Production Deployment

## Deployment shape

GlobalHealth is a **single full-stack process**: the Express server serves both
the built SPA (`dist/`) and `/api/*`. A static-only host (Netlify without an
API backend) cannot run this platform; the client fails loudly with
`DEPLOYMENT_API_MISMATCH` when `/api/*` returns HTML.

## Supported topologies

1. Express + `dist/` behind one domain (recommended, and what the bundled
   `Dockerfile` and platform blueprints produce).
2. UI on one origin with a reverse proxy forwarding `/api/*` to Express, with
   `CORS_ORIGIN` set to the UI origin.

## Build and run

```sh
npm ci --include=dev          # dev deps are BUILD deps (vite, esbuild, tsc)
npm run build                 # → dist/server.cjs + dist/assets/*
npm run deploy:check          # preflight: refuses to bless a broken deploy
npm start                     # → production server on $PORT
```

`npm start` runs `scripts/start.mjs`, which pins `NODE_ENV=production` and
fails with an actionable message if `dist/` is missing. It is cross-platform —
the old `NODE_ENV=production node dist/server.cjs` form silently ran in
*development* mode on hosts that invoked `node dist/server.cjs` directly, which
booted the Vite dev middleware instead of the built SPA.

The server binds `0.0.0.0:${PORT}` so it works behind Cloud Run, a container
runtime, or a reverse proxy.

### Build vs. runtime dependencies

Vite, esbuild, TypeScript and Tailwind are **build-time only** and live in
`devDependencies`. The server loads Vite dynamically inside its dev-only
branch, so a production install needs none of them:

```sh
npm ci --omit=dev     # ~99 MB, 132 packages
```

The `Dockerfile` handles this split automatically across its build and runtime
stages.

## Platform blueprints

| Platform | File | How to deploy |
| --- | --- | --- |
| Any container host | `Dockerfile` | `docker build -t globalhealth . && docker run -p 3000:3000 -v gh-data:/app/data globalhealth` |
| Docker Compose | `docker-compose.yml` | `docker compose up --build` |
| Render | `render.yaml` | New → Blueprint → select repo. Provisions the service, a 1 GB disk and `/healthz`. |
| Fly.io | `fly.toml` | `fly launch --copy-config`, `fly volumes create globalhealth_data --size 1`, `fly deploy` |
| Heroku / Railway / Dokku | `Procfile` | Build runs `heroku-postbuild` (`build` + preflight), then `web: npm start` |

## Environment

Set the variables in `docs/ENVIRONMENT.md`; start from
`.env.production.example`. There are no source-code fallback secrets. The
server starts even when high-value gates are absent, but the affected features
fail closed — this is intentional and reported at startup through
`startup configuration warning`.

### Do not set `NODE_ENV` in `.env`

`npm start` and `npm run dev` each pin their own mode before the server loads
`dotenv`. A `NODE_ENV` value in `.env` overrides both, which makes
`npm run dev` boot in production mode — serving a stale `dist/` bundle with no
hot reload and no error explaining why. Let the host inject `NODE_ENV`.

### Persisted state

`GH_RUNTIME_DIR/runtime` holds account, consent and domain state. It **must**
be a durable volume, never a container-local or `/tmp` path — the preflight
rejects `/tmp` explicitly. It is not a production relational database yet; see
`docs/migration-plan.md` Phase 3.

## Health probes

| Path | Purpose | Use for |
| --- | --- | --- |
| `GET /healthz` | Liveness | Orchestrator liveness probe |
| `GET /readyz` | Readiness: runtime dir writable | Orchestrator readiness probe |
| `GET /api/health` | Detailed health, memory, uptime | Ops dashboards |
| `GET /api/ready` | Readiness (application alias) | App-side checks |

Root-level aliases exist because most orchestrators default to `/healthz` and
`/readyz`. None of them expose secrets or internal architecture.

## Caching and compression

The server sets these headers itself, so a CDN in front must not override them:

- `assets/*-[hash].js|css` → `public, max-age=31536000, immutable`
- `index.html`, `sw.js`, `manifest.webmanifest` → `no-cache, must-revalidate`
  (a stale `sw.js` would pin visitors to an old release; a stale `index.html`
  would reference hashed bundles that no longer exist)
- un-hashed brand assets → `public, max-age=3600, must-revalidate`
- `sw.js` also gets `Service-Worker-Allowed: /`
- Responses are gzip/brotli compressed (the nutrition library is 10.6 MB raw,
  ~419 KB gzipped)

If you put a CDN in front, ensure it honours `Vary: Accept-Encoding` and does
not strip `Cache-Control`.

## Reverse proxy / TLS

- Terminate TLS at the proxy/load balancer.
- Forward `X-Forwarded-Proto` so same-origin CORS and link generation see
  `https`.
- Pass through or rewrite `/api/*` to the Express process; do **not** let the
  SPA fallback serve `index.html` for `/api/*` (the server's own `/api` 404
  boundary already prevents this).
- Configure HSTS at the proxy and ensure `CORS_ORIGIN` matches the public
  origin.

## CI

The workflow is committed at `docs/ci/github-actions-ci.yml`. Activate it once:

```sh
mkdir -p .github/workflows && cp docs/ci/github-actions-ci.yml .github/workflows/ci.yml
```

It runs on every push and PR:

1. **verify** — typecheck → tests → build → `deploy:check` → boots the real
   production server and asserts `/healthz`, `/readyz`, the SPA shell, the
   `sw.js` cache header and gzip negotiation.
2. **docker** — builds the image and smoke-tests the running container.

If CI is green, `npm start` on the target host will boot.

## Operational notes

- Rotate `GH_ADMIN_KEY`, `PRESCRIPTION_SIGNING_SECRET` and the registry/AI keys
  through your secret manager.
- The AI assistant uses `GEMINI_API_KEY` server-side only; it is never exposed
  to the browser.
- Back up `data/runtime/` (or the mounted volume) on the same schedule as your
  database.

## Scaling

Run a **single instance** until the database migration lands. Session handling,
rate-limit windows and the runtime persistence layer are all per-instance;
multiple replicas require shared storage plus a shared session/rate-limit
store, and will otherwise diverge. Scale vertically instead.
