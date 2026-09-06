# GlobalHealth AI — Knowledge Architecture

This document maps the GlobalHealth AI knowledge/behavior specification onto the
existing repository. It follows the project's prime directive: **integrate with
the existing architecture — never rebuild the website, never duplicate systems,
never fabricate medical data.**

---

## 1. What already existed (reused, not replaced)

| Capability | Existing location | Status |
|---|---|---|
| Clinical knowledge (400 medicines, 500 diseases, 1000 lab tests) | `src/data/medicines`, `src/data/diseases`, `src/data/medicalTests` | Reused as THE approved clinical content layer |
| Server-side verified-knowledge retrieval | `src/core/ai/aiKnowledge.ts` | Extended (aliases, tokens, source dating) |
| Live platform directories (doctors, hospitals, pharmacy partner products with real stock) | `src/data/hospitalInitialData`, `src/data/pharmacyProductsData` (already imported by `server.ts`) | Now wired into AI retrieval |
| Authentication (bearer session, `requireAuth`, `authenticate`) | `server.ts`, `src/services/authClient.ts`, `src/context/AuthContext.tsx` | Untouched; AI relies on it |
| Server-side authorized personal context | `src/core/ai/aiUserContext.ts` | Untouched from previous iteration |
| Urgent-symptom safety engine | `src/core/ai/aiSafety.ts` + client/`server` short-circuits | Untouched |
| Intent detection / answer modes | `src/core/ai/aiIntent.ts`, `aiAnswerMode.ts` | Untouched |
| Conversation memory (account-owned, server-side, audited) | `/api/ai/conversations*` + `data/runtime/ai-conversations.json` | Untouched |
| Action-card navigation to REAL tabs | `src/components/ai/aiUtils.ts` (`ACTION_RULES` → `App.tsx` tabs) | Extended with more real sections |
| News admin draft→review→approval workflow (pattern for content governance) | `src/components/news-admin/*` | Referenced as the template for future AI-knowledge admin flows |
| Multilingual support | `src/context/LocalizationContext.tsx`, `locales/` | Untouched; language instruction passed per request |

## 2. What was added (this iteration)

```
src/core/ai/
├── aiKnowledge.ts                 # verified clinical retrieval (extended)
└── knowledge/
    ├── ghWebsiteKnowledge.ts      # platform overview + REAL section map + auth-state rules
    ├── ghAliases.ts               # layman ⇄ clinical synonym expansion
    ├── ghPolicies.ts              # versioned policy fragments (source policy, content
    │                              #   defense, stock truthfulness, uncertainty, style…)
    └── ghDirectory.ts             # live directory retrieval (doctors/hospitals/stock)
src/server/aiProvider.ts           # model-provider abstraction (model independence)
src/core/ai/aiUserContext.ts       # (previous iteration) authorized personal record summary
```

Key behaviors:

- **Six operating modes** (website assistant, health education, healthcare
  discovery, personal account assistant, navigation assistant, safety
  assistant) are declared in the system prompt, composed in `server.ts`.
- **Navigation answers** use `ACTION → LOCATION → NEXT STEP` format and only
  sections from `GH_NAVIGATION` — every record's `tab` key is asserted by a
  unit test to exist in `App.tsx VALID_TABS`. The AI physically cannot be
  told about a page that does not exist.
- **Retrieval pipeline** (per question, server-side):
  1. urgency safety screen (short-circuits everything),
  2. alias expansion of the query (`ghAliases`),
  3. verified clinical lookup (`aiKnowledge` over medicines/diseases/tests),
  4. live directory lookup (`ghDirectory` — doctors, hospitals, pharmacy
     products with stock status reported EXACTLY as stored),
  5. authorized personal record summary (signed-in callers only),
  6. all blocks labeled with source + retrieval date, then Gemini generates
     the answer under the policy block.
- **Model independence**: `src/server/aiProvider.ts` is the only place that
  knows about Gemini. `AI_PROVIDER` (default `gemini`) and `AI_MODEL`
  (default `gemini-2.5-flash`) are environment-configured. Provider errors are
  typed, secret-free, and map to the same user-safe 503/500 behavior.
- **Stock truthfulness**: `in_stock → IN STOCK`, `low_stock → LOW STOCK`,
  `out_of_stock → OUT OF STOCK`, anything else → `UNKNOWN`. `UNKNOWN` is
  never upgraded. Enforced by unit test.
- **Content status/versioning**: every knowledge record carries
  `version`, `status` (`DRAFT → REVIEW → APPROVED → PUBLISHED → ARCHIVED`),
  `audience`, and `updatedDate`. `publishedNavigation()` filters so drafts can
  never reach a prompt. This is the hook for a future admin UI (the existing
  News CMS is the in-repo pattern to copy).

## 3. Authentication & authorization (unchanged, load-bearing)

- The AI endpoint resolves the caller **only** from the validated session
  token (`authenticate`). Client-declared identity is ignored.
- Private context = caller's own record summary (`aiUserContext`) + optional
  self-reported dashboard snapshot, both bounded, sanitized, audited, and
  **never provided for guests**.
- Role portals (doctor/hospital/pharmacy/admin/news) are separate
  authenticated applications; the user-facing AI never crosses those
  boundaries, and frontend role labels are never treated as authorization.
- The AI never reveals system prompts, keys, or internal security details.

## 4. Medical sourcing policy

Encoded in `ghPolicies.ts` (`MEDICAL_SOURCE_POLICY`) and enforced in prompts:
WHO / national authorities / medicines regulators first, then National
Library of Medicine / MedlinePlus / DailyMed, then peer-reviewed literature,
then verified institutional information. Community and news content are
labeled as such and are never medical authority. Compact source lines appear
in answers; citations are never fabricated.

## 5. Test coverage

- `src/core/ai/aiKnowledge.test.ts` — real-library retrieval (heart attack →
  myocardial infarction; hypertension → Essential hypertension; generic-word
  precision; honest empty results; source labels).
- `src/core/ai/knowledge/ghWebsiteKnowledge.test.ts` — every AI-known section
  exists in the real app tabs; canonical overview wording; draft filtering.
- `src/core/ai/knowledge/ghDirectory.test.ts` — doctor/hospital/product
  lookup; stock status never upgraded; no fabricated entities.
- `src/core/ai/knowledge/ghAliases.test.ts` — bidirectional synonym graph.
- `src/server/aiProvider.test.ts` — normalization, fail-closed config,
  secret-free errors.
- `src/core/ai/aiUserContext.test.ts` — personal-context bounds/injection.

## 6. Honest scope notes (future work)

Deliberately **not** built in this iteration, to avoid overreach:

- **Tool-calling loop** (model invokes `SEARCH_DOCTORS` mid-conversation):
  retrieval is currently pre-generation and deterministic — safer and cheaper;
  a tool loop can be added inside `aiProvider`/`server.ts` later.
- **Vector/semantic search**: current retrieval is alias+token based over
  in-repo datasets (no embeddings infrastructure). The chunking guidance is
  already satisfied by the dataset structure (each record is small and
  sectioned).
- **Admin CMS for AI knowledge records**: the data layer (status/version)
  is ready; the editorial UI should follow the existing News CMS workflow
  (DRAFT → REVIEW → APPROVAL → PUBLISH).
- **ICD-11 coding**: schema-ready (no codes invented); authoritative WHO ICD
  integration is a data-acquisition task, not a code task.
- **Streaming responses**: provider interface returns complete text today;
  streaming slots in behind `generateText` without UI contract changes.

## 7. Public-website ingestion layer (complete public knowledge)

The AI's knowledge equals the PUBLIC website — not the database, not the
backend, not the repository (spec: PUBLIC KNOWLEDGE = YES, PRIVATE = NO).

### 7.1 Machine-readable route inventory

`src/core/ai/knowledge/ghPublicRoutes.ts` inventories EVERY route from
`App.tsx VALID_TABS`, classified by real access behavior (PROTECTED_TABS /
OVERLAY_TABS): 19 PUBLIC (indexable), 4 AUTHENTICATED and 9 ROLE_PROTECTED
(excluded with reasons). A unit test asserts the inventory covers every real
route exactly once and that classification matches the app's actual
protection — fail-closed (unknown ⇒ not indexed).

### 7.2 Unified public content index

`src/core/ai/knowledge/ghPublicIndex.ts` indexes 1,200+ public documents from
the canonical datasets the website itself renders, using explicit per-type
FIELD WHITELISTS (private fields cannot leak by construction) and a fail-closed
gate (`PUBLIC` access + `PUBLISHED` status only):

| Type | Count | Source |
|---|---|---|
| HEALTH_TOOL | 80 | calculatorsData |
| RECIPE | 1000 | recipes library |
| NUTRITION | 7 | guidelines / deficiency / meal plans |
| WELLNESS / EXERCISE / WORKOUT | 18 | wellnessFitnessData |
| MAP_LOCATION | 75 | medicalMapData |
| COMMUNITY_POST | 5 | labeled COMMUNITY CONTENT |
| NEWS | published only | drafts excluded + counted |
| HELP_ARTICLE / POLICY | 10 | real how-to + real Terms/Privacy sections |

Plus the existing layers: clinical libraries (medicines/diseases/tests via
`aiKnowledge.ts`) and live directories (doctors/hospitals/pharmacy stock via
`ghDirectory.ts`), composed by `ghPublicSearch.ts` into one labeled,
source-attributed context block with the knowledge-priority rule.

### 7.3 Page-aware assistance

The workspace sends the public section key the user came from
(`userContext.pageContext.route`). The server resolves it against the
published navigation knowledge; unknown keys are ignored. This lets the
assistant resolve "this page / this section" honestly.

### 7.4 Completeness & security reports

- `npm run ai:report` — prints the full ledger: routes, indexed counts per
  type, clinical/directory layers, and everything excluded with reasons.
- Security tests prove: private field names never appear in indexed docs,
  draft news is never indexed, unknown classifications never pass the gate,
  protected routes are never indexable, and unmatched queries produce empty
  context (never fabricated content).

## 8. Master-spec additions (final iteration)

- **Relationship graph**: doctor → affiliated hospital and hospital →
  departments (via `hospitalId` links passed through `ghDirectory`); disease →
  related specialty / severity / contagiousness / vaccine facts and medicine →
  listed side effects + FAQ count (via `aiKnowledge` snippet enrichment). All
  values verbatim from the datasets — never inferred.
- **FAQ knowledge**: the REAL "Clinical FAQs" published on all 400 medicine
  pages are indexed as 1,600 retrievable FAQ documents (`MEDICINE_FAQ_DOCS`).
  The diseases FAQ (derived at render time from each record) is documented via
  a help article rather than duplicated (dedupe rule).
- **Public API inventory** (`ghPublicApis.ts`): 25 endpoint groups classified
  PUBLIC / AUTHENTICATED / CONSENT_REQUIRED / DOCTOR_ONLY / HOSPITAL_ONLY /
  PHARMACY_ONLY / ADMIN_ONLY with explicit AI-scope decisions. A unit test
  verifies every inventoried path really exists in server.ts — the inventory
  cannot drift into fiction.
- **Response routing & capabilities**: the system prompt now carries an
  intent→behavior routing table (website / entity / availability / personal /
  clinical / emergency / unknown), an honest capability declaration, and a
  source-display + freshness rule (compact "Source:" lines, dates when shown,
  GlobalHealth vs external never merged).
- **Feedback loop** (PART 92): thumbs up/down on assistant answers →
  `POST /api/ai/feedback` (rate-limited, 201) → admin-key-gated review at
  `GET /api/ai/feedback`. Privacy-first: only rating, optional category and
  section are stored — question/answer text is never sent or stored.
- **Outage behavior** (PART 141/142): provider failures now return a clean,
  retryable `503 AI_PROVIDER_UNAVAILABLE`; the rest of the website is
  unaffected (the AI is an isolated feature).
- **Coverage scoring** (PART 148/159): `npm run ai:report` now prints
  per-type coverage percentages, the API inventory, and a coverage score
  (typed datasets: 100%; routes: every discovered route either indexed or
  excluded with a documented reason).
