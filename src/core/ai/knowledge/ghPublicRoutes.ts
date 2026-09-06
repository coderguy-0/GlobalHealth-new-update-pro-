/* ============================================================================
   GlobalHealth AI — Public Route Inventory (spec §5, §35, §66).

   A machine-readable inventory of EVERY route in the app (src/App.tsx
   VALID_TABS), classified by REAL access behavior — not by file location:

   - PUBLIC           an ordinary unauthenticated visitor can open it
   - AUTHENTICATED    requires the visitor's own signed-in account
                        (App.tsx PROTECTED_TABS)
   - ROLE_PROTECTED   professional/administrative portal workspaces
                        (App.tsx OVERLAY_TABS with their own auth gates)

   ONLY PUBLIC routes are indexable by the public AI knowledge layer
   (fail-closed, spec §64-65). This inventory is also the completeness
   ledger for the automated public-index report.
   ========================================================================== */

export type RouteAccess = 'PUBLIC' | 'AUTHENTICATED' | 'ROLE_PROTECTED';

export type PageType =
  | 'home'
  | 'directory'
  | 'detail'
  | 'tools'
  | 'content'
  | 'legal'
  | 'auth'
  | 'workspace'
  | 'portal'
  | 'personal';

export interface PublicRouteRecord {
  /** Real route key from src/App.tsx VALID_TABS (or a documented pattern). */
  route: string;
  title: string;
  access: RouteAccess;
  pageType: PageType;
  description: string;
  entities: string[];
  searchable: boolean;
  /** True only when the route is PUBLIC (fail-closed, spec §64). */
  indexable: boolean;
  source: string;
  /** Why a route is excluded from the public index (spec §100 report). */
  exclusionReason?: string;
  updatedDate: string;
}

const UPDATED = '2026-09-06';

export const PUBLIC_ROUTE_INVENTORY: PublicRouteRecord[] = [
  // ---------------------------------------------------------------- PUBLIC
  { route: 'home', title: 'Home', access: 'PUBLIC', pageType: 'home', description: 'Central entry point: platform orientation, featured services and quick access to every public section.', entities: ['platform'], searchable: true, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },
  { route: 'explore', title: 'Explore', access: 'PUBLIC', pageType: 'directory', description: 'Browse and discover content across the platform in one place.', entities: ['category'], searchable: true, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },
  { route: 'diseases', title: 'Diseases', access: 'PUBLIC', pageType: 'directory', description: 'Disease and health-condition reference library (500 records) with overview, symptoms, causes, diagnosis, treatment, FAQs and related entities.', entities: ['disease', 'symptom', 'test', 'medicine', 'specialty'], searchable: true, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },
  { route: 'medicines', title: 'Medicines', access: 'PUBLIC', pageType: 'directory', description: 'Medicine information library (400 records: uses, precautions, side effects, prescription status) plus the buy-medicine flow with verified pharmacy partners.', entities: ['medicine', 'pharmacy'], searchable: true, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },
  { route: 'medical-tests', title: 'Lab Tests', access: 'PUBLIC', pageType: 'directory', description: 'Clinical laboratory test reference (1000 tests: purpose, sample type, preparation, reference ranges, interpretation education).', entities: ['lab_test'], searchable: true, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },
  { route: 'nutrition', title: 'Nutrition', access: 'PUBLIC', pageType: 'content', description: 'Nutrition education: dietary guidelines, deficiency diseases, food dictionary, meal plans and macronutrient information.', entities: ['nutrition', 'food', 'guideline'], searchable: true, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },
  { route: 'recipes', title: 'Recipes', access: 'PUBLIC', pageType: 'directory', description: 'Recipe library (1000 recipes) with ingredients, preparation, nutrition facts, cuisine and dietary labels.', entities: ['recipe'], searchable: true, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },
  { route: 'wellness', title: 'Wellness & Fitness', access: 'PUBLIC', pageType: 'content', description: 'Wellness modules, exercise database, workout plans, yoga and healthy-lifestyle education.', entities: ['wellness_article', 'exercise', 'workout'], searchable: true, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },
  { route: 'calculators', title: 'Health Tools', access: 'PUBLIC', pageType: 'tools', description: 'Health calculators and screening tools (80 tools across 8 categories) with inputs, outputs and educational explanations.', entities: ['health_tool'], searchable: true, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },
  { route: 'ai-assistant', title: 'AI Assistant', access: 'PUBLIC', pageType: 'workspace', description: 'This AI assistant: website guidance, health education, discovery help, and authorized personal information when signed in.', entities: ['platform'], searchable: false, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },
  { route: 'hospitals', title: 'Hospitals', access: 'PUBLIC', pageType: 'directory', description: 'Hospital and facility discovery: departments, services, capacity and verified hospital profiles.', entities: ['hospital'], searchable: true, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },
  { route: 'doctors', title: 'Doctors', access: 'PUBLIC', pageType: 'directory', description: 'Doctor discovery: specialty, hospital affiliation, experience, fees where listed, and appointment booking.', entities: ['doctor'], searchable: true, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },
  { route: 'medical-map', title: 'Medical Map', access: 'PUBLIC', pageType: 'directory', description: 'Interactive map of healthcare facilities (75 mapped facilities) with type, district, beds and verification status.', entities: ['map_location'], searchable: true, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },
  { route: 'community', title: 'Community', access: 'PUBLIC', pageType: 'content', description: 'Public community discussions, groups and peer support. Posts are user-generated content, not medical authority.', entities: ['community_post'], searchable: true, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },
  { route: 'news', title: 'Health News', access: 'PUBLIC', pageType: 'content', description: 'Published health news articles and updates. Deep links use /news/<article-id>.', entities: ['news'], searchable: true, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },
  { route: 'news/:articleId', title: 'Health News Article', access: 'PUBLIC', pageType: 'detail', description: 'A single published news article (public deep-link pattern /news/<article-id>).', entities: ['news'], searchable: false, indexable: true, source: 'src/App.tsx parseHash pathname handling', updatedDate: UPDATED },
  { route: 'terms', title: 'Terms & Conditions', access: 'PUBLIC', pageType: 'legal', description: 'Public Terms & Conditions: acceptance, eligibility, account registration and security, services, personal health information and more.', entities: ['policy'], searchable: true, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },
  { route: 'privacy-policy', title: 'Privacy Policy', access: 'PUBLIC', pageType: 'legal', description: 'Public Privacy Policy describing how GlobalHealth handles personal and health information.', entities: ['policy'], searchable: true, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },
  { route: 'auth', title: 'Sign In / Create Account', access: 'PUBLIC', pageType: 'auth', description: 'Sign in or create a GlobalHealth account to unlock personal features.', entities: ['account'], searchable: false, indexable: true, source: 'src/App.tsx VALID_TABS', updatedDate: UPDATED },

  // -------------------------------------------------------- AUTHENTICATED
  { route: 'dashboard', title: 'Health Dashboard', access: 'AUTHENTICATED', pageType: 'personal', description: 'The signed-in user\'s private health dashboard.', entities: ['personal'], searchable: false, indexable: false, source: 'src/App.tsx PROTECTED_TABS', exclusionReason: 'AUTHENTICATED — private user data (spec §3)', updatedDate: UPDATED },
  { route: 'appointments', title: 'Appointments', access: 'AUTHENTICATED', pageType: 'personal', description: 'The signed-in user\'s own appointment schedule.', entities: ['personal'], searchable: false, indexable: false, source: 'src/App.tsx PROTECTED_TABS', exclusionReason: 'AUTHENTICATED — private user data (spec §3)', updatedDate: UPDATED },
  { route: 'privacy', title: 'Privacy & Consent Center', access: 'AUTHENTICATED', pageType: 'personal', description: 'The signed-in user\'s privacy and consent controls.', entities: ['personal'], searchable: false, indexable: false, source: 'src/App.tsx PROTECTED_TABS', exclusionReason: 'AUTHENTICATED — private user data (spec §3)', updatedDate: UPDATED },
  { route: 'my-history', title: 'My History', access: 'AUTHENTICATED', pageType: 'personal', description: 'The signed-in user\'s own activity and audit history.', entities: ['personal'], searchable: false, indexable: false, source: 'src/App.tsx PROTECTED_TABS', exclusionReason: 'AUTHENTICATED — private user data (spec §3)', updatedDate: UPDATED },

  // ------------------------------------------------------- ROLE_PROTECTED
  { route: 'hospital-portal', title: 'Hospital Portal', access: 'ROLE_PROTECTED', pageType: 'portal', description: 'Verified hospital staff workspace.', entities: ['internal'], searchable: false, indexable: false, source: 'src/App.tsx OVERLAY_TABS', exclusionReason: 'ROLE_PROTECTED — hospital staff only (spec §3)', updatedDate: UPDATED },
  { route: 'doctor-portal', title: 'Doctor Portal', access: 'ROLE_PROTECTED', pageType: 'portal', description: 'Verified doctors\' professional workspace (patients, EHR tools).', entities: ['internal'], searchable: false, indexable: false, source: 'src/App.tsx OVERLAY_TABS', exclusionReason: 'ROLE_PROTECTED — doctors only; contains patient records (spec §3)', updatedDate: UPDATED },
  { route: 'medauth', title: 'MedAuth Clinical Workspace', access: 'ROLE_PROTECTED', pageType: 'portal', description: 'Clinical professional workspace with patient records.', entities: ['internal'], searchable: false, indexable: false, source: 'src/App.tsx OVERLAY_TABS', exclusionReason: 'ROLE_PROTECTED — clinical staff only; contains patient records (spec §3)', updatedDate: UPDATED },
  { route: 'pharmacy-portal', title: 'Pharmacy Partner Portal', access: 'ROLE_PROTECTED', pageType: 'portal', description: 'Pharmacy partner workspace (inventory, orders, compliance).', entities: ['internal'], searchable: false, indexable: false, source: 'src/App.tsx OVERLAY_TABS', exclusionReason: 'ROLE_PROTECTED — partner-only business data (spec §3)', updatedDate: UPDATED },
  { route: 'news-admin', title: 'News Admin Workspace', access: 'ROLE_PROTECTED', pageType: 'portal', description: 'News administration workspace, including drafts and moderation.', entities: ['internal'], searchable: false, indexable: false, source: 'src/App.tsx OVERLAY_TABS', exclusionReason: 'ROLE_PROTECTED — includes DRAFT/unpublished content (spec §21, §37)', updatedDate: UPDATED },
  { route: 'news-management', title: 'News Management', access: 'ROLE_PROTECTED', pageType: 'portal', description: 'News management login and editorial tooling.', entities: ['internal'], searchable: false, indexable: false, source: 'src/App.tsx OVERLAY_TABS', exclusionReason: 'ROLE_PROTECTED — editorial staff only (spec §3)', updatedDate: UPDATED },
  { route: 'news-authority', title: 'News Authority Workspace', access: 'ROLE_PROTECTED', pageType: 'portal', description: 'Verified authority verification/submission workspace.', entities: ['internal'], searchable: false, indexable: false, source: 'src/App.tsx OVERLAY_TABS', exclusionReason: 'ROLE_PROTECTED — authority staff only (spec §3)', updatedDate: UPDATED },
  { route: 'doctor-console', title: 'Doctor Consent Console', access: 'ROLE_PROTECTED', pageType: 'portal', description: 'Doctor-side consent management console.', entities: ['internal'], searchable: false, indexable: false, source: 'src/App.tsx OVERLAY_TABS', exclusionReason: 'ROLE_PROTECTED — doctor-only consent data (spec §3)', updatedDate: UPDATED },
  { route: 'doctor-consent', title: 'Doctor Access Consent', access: 'ROLE_PROTECTED', pageType: 'portal', description: 'Patient consent flow for doctor record access.', entities: ['internal'], searchable: false, indexable: false, source: 'src/App.tsx OVERLAY_TABS', exclusionReason: 'ROLE_PROTECTED — consent-controlled personal data (spec §3, §30)', updatedDate: UPDATED },
];

/** The machine gate every document must pass (spec §64-65, fail-closed). */
export function isIndexablePublicRoute(record: PublicRouteRecord): boolean {
  return record.access === 'PUBLIC' && record.indexable;
}

/** Only the PUBLIC routes (the ones the AI may know). */
export function indexableRoutes(): PublicRouteRecord[] {
  return PUBLIC_ROUTE_INVENTORY.filter(isIndexablePublicRoute);
}

/** Excluded routes with reasons — for the completeness report (spec §100). */
export function excludedRoutes(): PublicRouteRecord[] {
  return PUBLIC_ROUTE_INVENTORY.filter((r) => !isIndexablePublicRoute(r));
}

export function routeInventoryStats() {
  return {
    totalRoutes: PUBLIC_ROUTE_INVENTORY.length,
    publicRoutes: indexableRoutes().length,
    excludedRoutes: excludedRoutes().length,
    byAccess: {
      PUBLIC: PUBLIC_ROUTE_INVENTORY.filter((r) => r.access === 'PUBLIC').length,
      AUTHENTICATED: PUBLIC_ROUTE_INVENTORY.filter((r) => r.access === 'AUTHENTICATED').length,
      ROLE_PROTECTED: PUBLIC_ROUTE_INVENTORY.filter((r) => r.access === 'ROLE_PROTECTED').length,
    },
  };
}
