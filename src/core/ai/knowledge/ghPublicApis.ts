/* ============================================================================
   GlobalHealth AI — Public API Inventory (spec PART 14, PART 147).

   Classifies the backend's API surface by REAL access requirement, exactly as
   enforced in server.ts middleware. Public AI retrieval never proxies these
   endpoints directly — it reads the same canonical datasets/services the
   public pages use — but the inventory documents what is public, what is
   protected, and WHY (spec PART 2: "exists" ≠ "public").

   A unit test verifies that every inventoried path prefix actually exists in
   server.ts, so this inventory cannot drift into fiction.
   ========================================================================== */

export type ApiAccess =
  | 'PUBLIC'
  | 'AUTHENTICATED'
  | 'CONSENT_REQUIRED'
  | 'DOCTOR_ONLY'
  | 'HOSPITAL_ONLY'
  | 'PHARMACY_ONLY'
  | 'ADMIN_ONLY'
  | 'INTERNAL';

export interface ApiRecord {
  /** Path prefix as registered in server.ts. */
  path: string;
  methods: string[];
  access: ApiAccess;
  description: string;
  /** Why this is (or is not) part of the public AI knowledge scope. */
  aiScope: 'INDEXED_VIA_CANONICAL_DATA' | 'EXCLUDED_PRIVATE' | 'EXCLUDED_ROLE_DATA' | 'EXCLUDED_INTERNAL';
  source: string;
}

export const PUBLIC_API_INVENTORY: ApiRecord[] = [
  // ---- Public / open endpoints ----
  { path: '/api/auth/signup', methods: ['POST'], access: 'PUBLIC', description: 'Account registration (returns verification requirement, never secrets).', aiScope: 'EXCLUDED_PRIVATE', source: 'server.ts' },
  { path: '/api/auth/login', methods: ['POST'], access: 'PUBLIC', description: 'Login — issues the bearer session token.', aiScope: 'EXCLUDED_PRIVATE', source: 'server.ts' },
  { path: '/api/auth/verify-code', methods: ['POST'], access: 'PUBLIC', description: 'Email/phone verification code check.', aiScope: 'EXCLUDED_PRIVATE', source: 'server.ts' },
  { path: '/api/auth/me', methods: ['GET'], access: 'AUTHENTICATED', description: 'Session validation — returns the caller\'s own public profile.', aiScope: 'EXCLUDED_PRIVATE', source: 'server.ts' },
  { path: '/api/ai-assistant', methods: ['POST'], access: 'PUBLIC', description: 'The AI assistant endpoint (optional auth; private context only for the validated session).', aiScope: 'INDEXED_VIA_CANONICAL_DATA', source: 'server.ts' },
  { path: '/api/pharmacy-marketplace', methods: ['GET'], access: 'PUBLIC', description: 'Public pharmacy marketplace reads: verified partners, product availability, stock status, listed prices.', aiScope: 'INDEXED_VIA_CANONICAL_DATA', source: 'server.ts' },
  { path: '/api/hospital-registry', methods: ['GET'], access: 'PUBLIC', description: 'Public hospital directory reads (management sub-endpoints are role-protected).', aiScope: 'INDEXED_VIA_CANONICAL_DATA', source: 'server.ts' },
  // ---- Authenticated user endpoints ----
  { path: '/api/ai/conversations', methods: ['GET', 'POST', 'PUT', 'DELETE'], access: 'AUTHENTICATED', description: 'The signed-in user\'s own AI conversation history (ownership enforced per request).', aiScope: 'EXCLUDED_PRIVATE', source: 'server.ts' },
  { path: '/api/me/dashboard', methods: ['GET'], access: 'AUTHENTICATED', description: 'Caller\'s own dashboard summary.', aiScope: 'EXCLUDED_PRIVATE', source: 'server.ts' },
  { path: '/api/me/ehr', methods: ['GET'], access: 'AUTHENTICATED', description: 'Caller\'s own EHR (strictly owner-only).', aiScope: 'EXCLUDED_PRIVATE', source: 'server.ts' },
  { path: '/api/me/health-records', methods: ['GET'], access: 'AUTHENTICATED', description: 'Caller\'s own health records.', aiScope: 'EXCLUDED_PRIVATE', source: 'server.ts' },
  { path: '/api/me/appointments', methods: ['GET', 'POST'], access: 'AUTHENTICATED', description: 'Caller\'s own appointments (read/book).', aiScope: 'EXCLUDED_PRIVATE', source: 'server.ts' },
  { path: '/api/me/orders', methods: ['GET', 'POST'], access: 'AUTHENTICATED', description: 'Caller\'s own pharmacy orders.', aiScope: 'EXCLUDED_PRIVATE', source: 'server.ts' },
  { path: '/api/me/notifications', methods: ['GET'], access: 'AUTHENTICATED', description: 'Caller\'s own notifications.', aiScope: 'EXCLUDED_PRIVATE', source: 'server.ts' },
  { path: '/api/me/messages', methods: ['GET'], access: 'AUTHENTICATED', description: 'Caller\'s own messages.', aiScope: 'EXCLUDED_PRIVATE', source: 'server.ts' },
  { path: '/api/me/consent', methods: ['GET'], access: 'AUTHENTICATED', description: 'Caller\'s own consent state.', aiScope: 'EXCLUDED_PRIVATE', source: 'server.ts' },
  { path: '/api/me/audit-history', methods: ['GET'], access: 'AUTHENTICATED', description: 'Caller\'s own curated audit history.', aiScope: 'EXCLUDED_PRIVATE', source: 'server.ts' },
  { path: '/api/me/consent-requests', methods: ['GET', 'POST'], access: 'CONSENT_REQUIRED', description: 'Doctor-access consent requests on the patient\'s record — decided only by the patient.', aiScope: 'EXCLUDED_PRIVATE', source: 'server.ts' },
  { path: '/api/ehr/consent-share', methods: ['POST', 'DELETE'], access: 'AUTHENTICATED', description: 'Owner-created EHR share tokens (capability, consent-controlled).', aiScope: 'EXCLUDED_PRIVATE', source: 'server.ts' },
  { path: '/api/community', methods: ['POST'], access: 'AUTHENTICATED', description: 'Creating community content requires sign-in (public reads come from the public dataset).', aiScope: 'EXCLUDED_PRIVATE', source: 'server.ts' },
  // ---- Role-protected endpoints ----
  { path: '/api/doctor', methods: ['GET', 'POST'], access: 'DOCTOR_ONLY', description: 'Doctor portal: patients, consultations, EHR tools — doctor session required.', aiScope: 'EXCLUDED_ROLE_DATA', source: 'server.ts' },
  { path: '/api/hospital-portal', methods: ['GET', 'POST', 'PUT'], access: 'HOSPITAL_ONLY', description: 'Hospital portal management — hospital token required.', aiScope: 'EXCLUDED_ROLE_DATA', source: 'server.ts' },
  { path: '/api/pharmacy-partner', methods: ['GET', 'POST'], access: 'PHARMACY_ONLY', description: 'Pharmacy partner workspace — partner session required.', aiScope: 'EXCLUDED_ROLE_DATA', source: 'server.ts' },
  { path: '/api/news/admin', methods: ['GET', 'POST', 'PUT'], access: 'ADMIN_ONLY', description: 'News administration including drafts — staff session required; drafts never public.', aiScope: 'EXCLUDED_ROLE_DATA', source: 'server.ts' },
  { path: '/api/news/authority', methods: ['GET', 'POST'], access: 'ADMIN_ONLY', description: 'Authority verification workspace — authority session required.', aiScope: 'EXCLUDED_ROLE_DATA', source: 'server.ts' },
];

export function apiInventoryStats() {
  const byAccess: Record<string, number> = {};
  for (const api of PUBLIC_API_INVENTORY) byAccess[api.access] = (byAccess[api.access] ?? 0) + 1;
  return {
    total: PUBLIC_API_INVENTORY.length,
    byAccess,
    indexedViaCanonicalData: PUBLIC_API_INVENTORY.filter((a) => a.aiScope === 'INDEXED_VIA_CANONICAL_DATA').length,
    excluded: PUBLIC_API_INVENTORY.filter((a) => a.aiScope !== 'INDEXED_VIA_CANONICAL_DATA').length,
  };
}
