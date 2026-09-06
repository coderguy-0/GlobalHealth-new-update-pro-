# GlobalHealth — Enterprise Hardening Phase 1

This document records the production hardening work completed in this phase.
It is intentionally factual: each item is implemented, built, and (where noted)
verified against the running server on port 3000.

## Implemented

### 1. AI intelligence & safety
- `src/core/ai/` — intent detection, safety triage, answer modes, and context
  orchestration.
- Server-side urgent-safety backstop on `POST /api/ai-assistant`: high-risk
  prompts return emergency guidance even when the upstream Generative AI key is
  absent or a direct API caller bypasses the UI.
- Bounded conversation history and platform understanding context are now sent
  to the model so it can maintain continuity and resolve references without
  receiving unnecessary sensitive data.

### 2. Verified knowledge / anti-hallucination layer
- `src/core/ai/aiKnowledge.ts` — RAG-style retrieval over the platform's
  reviewed medicine, disease, and lab-test catalogs.
- Matches are labelled with `GlobalHealth Verified Medicine Library`,
  `GlobalHealth Verified Disease & Condition Library`, or
  `GlobalHealth Verified Lab Test Library`.
- When no verified source matches, the model is instructed to say so instead of
  inventing availability, price, dosage, statistics, or doctors.

### 3. Unified auth hardening
- Passwords use PBKDF2-SHA256 (120,000 iterations) with self-describing salts.
- Constant-time password verification for user credentials, re-authentication,
  and high-risk consent approvals.
- Fixed a bug where password reset stored the plain-text new password.
- Per-IP rate limits added for login, signup, email verification, password
  recovery, and the AI assistant endpoint.

### 4. Chat persistence & privacy
- Disk-backed runtime persistence for AI conversations and share links
  (`data/runtime/`, git-ignored). Chat history survives process restarts.
- `client_message_id` idempotency prevents duplicate messages on retry,
  double-tap, or concurrent tabs.
- Saved / Archive / Trash / search / export / revocable share endpoints exist
  and are owner-scoped server-side.
- §78 acceptance test (`npm run accept:ai`) verifies one-account chat history
  and cross-account isolation.

### 5. EHR consent links (replaces fake client token)
- `POST /api/ehr/consent-share` creates a server-issued, expiry-bound,
  revocable access link.
- `GET /api/ehr/shared-consent/:token` verifies a non-revoked, unexpired link.
- `DELETE /api/ehr/consent-share/:token` revokes it (owner only).
- The dashboard now calls this API; it no longer manufactures a fake
  `GH-AUTH-...` token.

### 6. API & security posture
- Every API request gets an `X-Request-Id`.
- Security headers: `X-Content-Type-Options`, `Referrer-Policy`,
  `X-XSS-Protection`.
- `GET /api/ready` readiness probe.
- Centralized API error boundary that never leaks stack traces or secrets.
- CORS allows an explicit production allowlist via `CORS_ORIGIN`.
- `.env.example` documents safe runtime placeholders.

### 7. Build / tooling
- `npm run lint` now uses a higher Node heap so the full TypeScript project
  (including the large medicine/disease/test catalogs) type-checks reliably.
- `npm run build` succeeds.
- `npm run accept:ai` succeeds against the live server.

## Verification executed

- `npm run lint` — pass.
- `npm run build` — pass.
- `npm run accept:ai` — pass.
- API smoke tests:
  - `GET /api/health` returns `X-Request-Id` + a `requestId` body field.
  - `GET /api/ready` returns `READY`.
  - Login succeeds with PBKDF2-verified credentials.
  - AI conversation create/append/export/share/revoke flows work.
  - AI conversations persist across server restart.
  - Urgent `/api/ai-assistant` request returns emergency guidance (not 503).
  - EHR consent share create/verify/revoke works.

## External configuration still required (not code)

- `GEMINI_API_KEY` for generative AI replies. The AI workspace already degrades
  gracefully; urgent safety responses work without it.
- `CORS_ORIGIN` allowlist for staging/production.
- Real email / SMS provider for production delivery of verification, password
  reset, appointment and order notifications.
- Real payment provider with webhook verification for live checkout.
- Real storage / CDN provider for private medical documents.
- Legal/privacy review before making compliance claims (e.g. HIPAA, GDPR,
  DPDP).
