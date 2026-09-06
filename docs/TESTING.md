# GlobalHealth Testing

## Current status

- **Unit tests**: PASS (14 tests). Covers `src/server/security.ts` (scrypt,
  PBKDF2 legacy, opaque tokens, TOTP) and `src/server/config.ts` (env parsing,
  production fail-closed rules).
- **Integration tests**: NOT_IMPLEMENTED. The Express app is not yet exposed as
  an importable factory; this is the next testing milestone.
- **E2E tests**: NOT_IMPLEMENTED.
- **Security tests (penetration/IDOR)**: NOT_IMPLEMENTED as automated suite;
  manual smoke checks have been run for CORS, credential verification, prescribe
  auth, reset-token production gating.

## Running tests

```sh
npm install
npm run test:unit    # node --import tsx --test src/server/*.test.ts
```

The test runner is Node's built-in `node:test` with `tsx` for TS import, so no
additional test framework is required. Unit tests never start the HTTP server
and never touch production `data/`.

## Test coverage targets (next)

### Security module
- [x] Hash format self-describing scrypt.
- [x] Correct password accepted / wrong rejected.
- [x] Malformed stored hash fails closed.
- [x] Legacy PBKDF2 migration verified.
- [x] Secure token 256-bit unique.
- [x] TOTP generation + acceptance + rejection.

### Config module
- [x] Safe development defaults.
- [x] Production parse + origin allowlist.
- [x] Missing production gates produce warnings.
- [x] Wildcard CORS rejected.
- [x] Invalid port fallback.

### Integration (planned)
- Signup -> verify -> login -> dashboard.
- Login with 2FA -> challenge -> TOTP -> session.
- EHR consent / doctor access ownership.
- Marketplace order stock reservation.
- Hospital portal ownership + publish gating.
- News editorial state machine.

### Security (planned)
- Cross-user EHR/order ID access denial.
- Pharmacy cross-organization inventory denial.
- Reset-token replay/single-use.
- 2FA bypass attempt.
- Client-supplied role escalation.
- `DEPLOYMENT_API_MISMATCH` for `/api/*` returning HTML.
