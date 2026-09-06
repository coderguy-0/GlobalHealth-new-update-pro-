# GlobalHealth Environment Configuration

The server loads environment from `.env` (via `dotenv`) and validates it with
`src/server/config.ts` at startup. There is **no source-code production
fallback** for any operational secret: missing gates cause an explicit warning
and the affected operation fails closed.

## Required / recommended variables

| Variable | Required in production | Behavior when missing |
| --- | --- | --- |
| `NODE_ENV` | Yes (`production`) | Defaults to `development`; production security constraints off. |
| `PORT` | Recommended | Defaults to `3000`. Invalid value logs a warning and uses `3000`. |
| `APP_URL` | Recommended | Used for deep links; falls back to `http://localhost:<port>`. |
| `CORS_ORIGIN` | Yes for cross-origin UI | Production accepts only same-origin unless allowlisted. `*` rejected. |
| `GEMINI_API_KEY` | Optional (AI disabled) | AI assistant returns a "not configured" response. |
| `MEDAUTH_REGISTRY_URL` + `MEDAUTH_REGISTRY_SECRET` | Required for real verification | Credential verification stays `NOT_VERIFIED` (503/fail closed). |
| `PRESCRIPTION_SIGNING_SECRET` | Required for signed prescriptions | Prescriptions are `UNSIGNED`/`HELD_FOR_SIGNING`. |
| `GH_ADMIN_KEY` | Required for pharmacy admin verify/pending | Returns `503 ADMIN_KEY_NOT_CONFIGURED`. |
| `NEWS_ADMIN_BOOTSTRAP_EMAIL` + `NEWS_ADMIN_BOOTSTRAP_PASSWORD` | Required to enable News admin in prod | No demo admin loaded; News CMS admin fails closed. |
| `NEWS_ADMIN_BOOTSTRAP_NAME` | Optional | Defaults to `GlobalHealth News Administrator`. |
| `GH_RUNTIME_DIR` | Optional | Defaults to `data` (runtime files under `data/runtime/`). |

## Environments

- **development**: local Vite middleware, demo user/session seeds, simulated
  MFA/email delivery tokens may be returned for convenience.
- **test**: no auto-start of the listener is enabled in unit tests; config
  defaults are safe.
- **production**: `IS_PRODUCTION=true`. Demo user/session seeds are disabled,
  CORS is fail-closed, demo reset tokens are never returned, News MFA code is
  never returned in the API response.

## Configuration rules enforced at startup

- `CORS_ORIGIN=*` in production throws and aborts startup.
- Any production CORS origin that is not a full `http(s)://host[:port]` throws.
- Missing critical gates are logged through the structured logger as
  `startup configuration warning`.

## Example production `.env`

```env
NODE_ENV=production
PORT=3000
APP_URL=https://globalhealth.example
CORS_ORIGIN=https://globalhealth.example
GEMINI_API_KEY=<provider key>
MEDAUTH_REGISTRY_URL=https://registry.example/api/verify
MEDAUTH_REGISTRY_SECRET=<gateway shared secret>
PRESCRIPTION_SIGNING_SECRET=<strong random value>
GH_ADMIN_KEY=<strong random value>
NEWS_ADMIN_BOOTSTRAP_EMAIL=news-admin@globalhealth.example
NEWS_ADMIN_BOOTSTRAP_PASSWORD=<strong random value>
NEWS_ADMIN_BOOTSTRAP_NAME=GlobalHealth News Administrator
GH_RUNTIME_DIR=data
```

## Troubleshooting: "the AI assistant is not working / not trained"

Run the stack diagnosis:

```bash
npm run ai:doctor          # add --live to make one real model call
```

It checks the three independent stages and names the broken one:

| Stage | Owned by | Failure symptom |
| --- | --- | --- |
| 1. Knowledge — is the site indexed? | this repo (`src/core/ai/knowledge/*`) | assistant answers generically, misses site content |
| 2. Retrieval — does the right record reach the prompt? | this repo (`ghRetrievalEngine.ts`) | wrong or empty grounding; measure with `npm run ai:eval` |
| 3. Model provider — can the server generate? | **environment** (`GEMINI_API_KEY`) | every `/api/ai-assistant` call returns **HTTP 503** and the UI shows *"The AI service is not configured on this server yet."* |

Stage 3 is the usual cause. The key is read once at startup, so after adding it
you must restart the server:

```bash
echo "GEMINI_API_KEY=your-key-here" >> .env    # .env is git-ignored
npm run dev
npm run ai:doctor -- --live                    # confirms the key really works
```

Optional overrides: `AI_PROVIDER` (default `gemini`) and `AI_MODEL`
(default `gemini-2.5-flash`). A key that is present but rejected (invalid,
expired, billing disabled, or no access to the configured model) shows up as a
`PROVIDER_FAILED` line in `--live` mode, and as
`AI_PROVIDER_UNAVAILABLE` (HTTP 503) to users.
