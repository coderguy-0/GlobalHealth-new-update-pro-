# GlobalHealth Dependency-Aware Migration Plan

Every phase below is scoped so a failed phase does not silently disable a working
feature. The guiding rule: **server is authoritative, fail closed, never fake.**

Phases are ordered by dependency. Work is committed to `arena/01a066de-globalhealth-premium`.

---

## Phase 0 — Audit and baseline
- [x] Map repository, API groups, auth model, persistence, build, deploy.
- [x] Write `docs/audit.md`.
- [ ] Preserve a working `dist/` + `data/` baseline before refactor.
- [ ] Capture runtime fixture by exporting current `data/runtime/*` into a migration sample.

## Phase 1 — Modular architecture shell
- [x] Add `src/server/` with `config.ts`, `logger.ts`, `errors.ts`, `security.ts`.
- [x] Make `server.ts` import the shell instead of re-defining equivalents (security, config, logger, error envelope).
- [x] Keep runtime behavior compatible while tests cover the extracted code.

## Phase 2 — Security module (unit-testable)
- [x] Extract password hashing/verification + token generator + TOTP into `src/server/security.ts`.
- [x] Fail closed on malformed stored hashes.
- [x] Unit-test scrypt, legacy PBKDF2, `secureToken`, TOTP (14 tests).
- [x] Replace remaining low-entropy doctor/pharmacy/hospital reset tokens and session/share tokens with `secureToken`.
- [x] Gate `demoResetToken` / `demoToken` responses behind `!IS_PRODUCTION`.

## Phase 3 — Persistence layer
- [ ] Define persistent interfaces: `userRepo`, `sessionRepo`, `ehrRepo`, `consentRepo`, `orderRepo`, `inventoryRepo`, `hospitalRepo`, `newsRepo`, `auditRepo`.
- [ ] Implement `JsonFileRepo` (compatible migration of current JSON state).
- [ ] Implement `SqliteRepo` with migrations (single-node production) and schema constraints.
- [ ] Move critical in-process `Map`s behind repos.
- [ ] Add `npm run db:migrate` and `npm run db:status`.

## Phase 4 — Config + startup validation
- [ ] Parse/env-validate `PORT`, `NODE_ENV`, `CORS_ORIGIN`, `APP_URL`, `GH_ADMIN_KEY`, `MEDAUTH_*`, `PRESCRIPTION_SIGNING_SECRET`, `NEWS_ADMIN_BOOTSTRAP_*`, `DATABASE_URL`, AI key.
- [ ] Fail startup in production when required gates are missing (with clear names; never fallbacks).

## Phase 5 — Authentication hardening
- [ ] Move reset-token creation/verify to repo; hash-at-rest + single-use + expiry.
- [ ] Session rotation/expiry/revocation centralized.
- [ ] Rate-limit login/signup/verify/reset/2FA via repo-backed window.

## Phase 6 — Authorization + route matrix
- [ ] Central `requireAuth`, `requireRole`, `requirePermission`, `requireOwnership`, `requireConsent`.
- [ ] Publish route security matrix in `docs/API.md`.
- [ ] Run IDOR checks for orders, EHR, hospital, pharmacy, news.

## Phase 7 — Input validation + errors + logging
- [ ] Zod schemas per route group.
- [ ] Central error envelope with `code`, `message`, `requestId`.
- [ ] Structured JSON logger with redaction of password/token/2FA/PII.

## Phase 8 — Portfolio domains
- [ ] Marketplace/orders/inventory to repo + transaction boundaries.
- [ ] Hospital/publish gating to repo.
- [ ] News editorial state machine to repo.
- [ ] AI gateway with auth, rate limit, provider abstraction, no PII prompt leaks.

## Phase 9 — Observability
- [ ] `/api/health/live`, `/api/health/ready`, `/api/health/dependencies`.
- [ ] Error tracking/structured logs; no secrets.

## Phase 10 — Testing
- [ ] Node 22 built-in test runner (`node --test`) with `tsx` loader.
- [ ] Unit tests for security, pricing, authorization, state transitions.
- [ ] Integration tests booting Express on ephemeral port with ephemeral repo.
- [ ] Security tests: IDOR, 2FA bypass, token replay, role escalation.
- [ ] Add `npm run test`, `npm run test:unit`, `npm run test:integration`, `npm run test:security`.

## Phase 11 — Deployment + operations
- [ ] Document Postgres + object storage + email + reverse proxy in `docs/DEPLOYMENT.md`.
- [ ] CI: typecheck -> lint -> unit -> integration -> security -> build -> smoke.
- [ ] Backup/recovery doc.

## Phase 12 — Final verification
- [ ] Re-run full smoke suite; report only verified statuses.
- [ ] Remove obsolete prototype paths only after proving consumers migrated.
