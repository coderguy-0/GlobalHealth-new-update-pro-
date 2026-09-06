# GlobalHealth Security

This document describes implemented controls. It is not a claim of regulatory
compliance; jurisdiction-specific legal review remains the customer's
responsibility.

## Authentication

- Public users: signup -> email verification -> login -> session.
- Passwords: `scrypt` (`scrypt$16384$8$1$<salt>$<hash>`), random 16-byte salt.
  Legacy PBKDF2 is verified and migrated on successful login.
- No universal verification code. Each code is account-specific, time-limited,
  and consumed on success.
- 2FA: RFC 6238 TOTP. Setup generates a unique base32 secret; a second-factor
  challenge is required before a session is issued when 2FA is enabled.
- Reset flows: opaque 256-bit tokens, same-origin delivery, no token returned in
  the browser response in production, existing sessions revoked after reset.

## Session handling

- Bearer tokens map to exactly one account/org. Ownership for every protected
  route is derived server-side from the token.
- Sliding expiry for public/doctor/hospital/pharmacy/news sessions.
- Logout destroys the server session.
- `authenticate`, `requireDoctor`, `requireHospitalToken`,
  `requireMarketPartner`, `requireNewsAdmin`, and `requireAuthority` reject
  expired/revoked/foreign sessions.

## Authorization

- Public user: owner-only access to `/api/me/*`.
- Doctor: only patients with an active access grant; EHR edits require patient
  consent; emergency access is view-only, time-limited, audited.
- Pharmacy: a partner can only read/update its own inventory; cross-pharmacy
  edits are rejected and audited.
- Hospital: a portal session maps to one hospital; cross-hospital writes are
  rejected and audited.
- News: admin/authority roles gate editorial workflows server-side.

## CORS / headers

- Production fail-closed: unknown origins return `403 CORS_ORIGIN_DENIED`.
- `CORS_ORIGIN=*` is rejected at startup in production.
- Security headers set per request: `X-Content-Type-Options: nosniff`,
  `Referrer-Policy`, `X-Request-Id`.

## Secrets / logging

- No production fallback secrets. Missing `GH_ADMIN_KEY`,
  `PRESCRIPTION_SIGNING_SECRET`, registry gateways cause the affected feature to
  fail closed.
- Structured logger redacts passwords, tokens, 2FA, verification codes, API keys.
- API error boundary never returns stack traces or internal details.

## Credential verification

- `/api/verify-credential` only asserts `VERIFIED` when a configured registry
  confirms it. No registry => `NOT_VERIFIED`, no fabricated confidence score.

## Known gaps

- Auth tokens are bearer tokens stored by the client; HttpOnly cookies + CSRF
  protection are not yet implemented.
- State is JSON-file backed, not relational DB (see migration plan).
- No automated IDOR/security test suite yet (unit tests only at this point).
