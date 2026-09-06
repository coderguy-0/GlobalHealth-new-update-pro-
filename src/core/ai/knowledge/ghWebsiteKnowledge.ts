/* ============================================================================
   GlobalHealth AI — Website Knowledge Layer (approved, versioned records).

   This is the AI's approved information layer about the GlobalHealth PLATFORM
   itself: what the platform is, which sections really exist (real route keys
   from src/App.tsx VALID_TABS), and what each state of authentication allows.

   Rules encoded here (spec §5, §44, §65-68, §122-124, §147-149):
   - Only REAL sections/routes are listed. The AI must never invent pages,
     buttons or labels.
   - Every record carries content status + version. Only PUBLISHED records are
     ever served into a prompt.
   - Clinical knowledge (medicines, diseases, lab tests) is NOT duplicated
     here — it already lives in the platform's verified libraries
     (src/data/medicines, src/data/diseases, src/data/medicalTests) and is
     retrieved separately by core/ai/aiKnowledge.ts.
   ========================================================================== */

/** Content lifecycle (spec §68). Only PUBLISHED content is used for answers. */
export type GHContentStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';

export function isPublished(status: GHContentStatus): boolean {
  return status === 'PUBLISHED' || status === 'APPROVED';
}

/** Who may use the section (spec §5, §132). Enforcement is ALWAYS server/app
 * side; this label only drives honest guidance and gating messages. */
export type GHAudience = 'public' | 'signed-in' | 'role';

export interface GHKnowledgeRecord {
  id: string;
  title: string;
  version: string;
  status: GHContentStatus;
  audience: GHAudience;
  /** Real route key in the app (src/App.tsx VALID_TABS) where applicable. */
  tab?: string;
  summary: string;
  keywords: string[];
  updatedDate: string;
}

/** Canonical platform overview (spec §147 — verbatim approved summary). */
export const GH_OVERVIEW =
  'GlobalHealth is a digital healthcare platform that helps users discover health information and healthcare services through sections such as diseases, medicines, laboratory tests, doctors, hospitals, medical maps, community, health news, nutrition, wellness, and health tools. Authenticated users may also access personal features such as appointments, saved information, messaging, notifications, and authorized health records.';

/**
 * The REAL GlobalHealth information architecture. Tab keys mirror
 * src/App.tsx VALID_TABS exactly; labels mirror the visible UI. Do not add a
 * row here unless the route really exists in the app.
 */
export const GH_NAVIGATION: GHKnowledgeRecord[] = [
  {
    id: 'nav-home', title: 'Home', tab: 'home', version: '1.0.0', status: 'PUBLISHED', audience: 'public',
    summary: 'The central entry point of GlobalHealth — orientation, highlights, and quick access to every major section.',
    keywords: ['start', 'begin', 'home', 'what is globalhealth', 'overview'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-explore', title: 'Explore', tab: 'explore', version: '1.0.0', status: 'PUBLISHED', audience: 'public',
    summary: 'Browse and discover content across the platform in one place.',
    keywords: ['explore', 'discover', 'browse'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-diseases', title: 'Diseases', tab: 'diseases', version: '1.0.0', status: 'PUBLISHED', audience: 'public',
    summary: 'Educational disease and health-condition reference: overview, symptoms, causes, diagnosis, treatment categories, prevention, and when to seek care.',
    keywords: ['disease', 'condition', 'illness', 'symptom', 'syndrome', 'disorder'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-medicines', title: 'Medicines', tab: 'medicines', version: '1.0.0', status: 'PUBLISHED', audience: 'public',
    summary: 'Medicine information library (uses, precautions, side effects, prescription status) plus the buy-medicine flow with verified pharmacy partners.',
    keywords: ['medicine', 'medication', 'drug', 'tablet', 'buy medicine', 'pharmacy'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-medical-tests', title: 'Lab Tests', tab: 'medical-tests', version: '1.0.0', status: 'PUBLISHED', audience: 'public',
    summary: 'Clinical laboratory test reference: purpose, sample type, preparation, reference ranges, and interpretation education.',
    keywords: ['lab test', 'blood test', 'diagnostic', 'panel', 'cbc', 'mri', 'scan', 'lab'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-doctors', title: 'Doctors', tab: 'doctors', version: '1.0.0', status: 'PUBLISHED', audience: 'public',
    summary: 'Doctor discovery: specialty, hospital affiliation, experience, fees where available, and appointment booking.',
    keywords: ['doctor', 'physician', 'specialist', 'consultation', 'find a doctor'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-hospitals', title: 'Hospitals', tab: 'hospitals', version: '1.0.0', status: 'PUBLISHED', audience: 'public',
    summary: 'Hospital and facility discovery: departments, services, capacity and verified hospital profiles.',
    keywords: ['hospital', 'clinic', 'facility', 'emergency department', 'multispecialty'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-medical-map', title: 'Medical Map', tab: 'medical-map', version: '1.0.0', status: 'PUBLISHED', audience: 'public',
    summary: 'Geographic map of healthcare facilities — hospitals, clinics, pharmacies, labs and blood banks on an interactive map.',
    keywords: ['map', 'near me', 'location', 'directions', 'nearby'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-community', title: 'Community', tab: 'community', version: '1.0.0', status: 'PUBLISHED', audience: 'public',
    summary: 'Community discussions, groups, events and peer support. Community posts are user-generated and are not authoritative medical advice.',
    keywords: ['community', 'forum', 'group', 'discussion', 'support'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-news', title: 'Health News', tab: 'news', version: '1.0.0', status: 'PUBLISHED', audience: 'public',
    summary: 'Health news and verified articles. News reports are not clinical recommendations.',
    keywords: ['news', 'article', 'health update', 'headlines'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-nutrition', title: 'Nutrition', tab: 'nutrition', version: '1.0.0', status: 'PUBLISHED', audience: 'public',
    summary: 'Nutrition education: foods, nutrients, dietary patterns and balanced-eating guidance.',
    keywords: ['nutrition', 'diet', 'food', 'vitamins', 'healthy eating'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-recipes', title: 'Recipes', tab: 'recipes', version: '1.0.0', status: 'PUBLISHED', audience: 'public',
    summary: 'Healthy recipe library with ingredients, preparation steps and nutrition information.',
    keywords: ['recipe', 'meal', 'cook', 'meal plan'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-wellness', title: 'Wellness & Fitness', tab: 'wellness', version: '1.0.0', status: 'PUBLISHED', audience: 'public',
    summary: 'Physical activity, sleep, hydration and stress-management education plus fitness guidance.',
    keywords: ['wellness', 'fitness', 'exercise', 'workout', 'sleep', 'stress', 'yoga'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-calculators', title: 'Health Tools', tab: 'calculators', version: '1.0.0', status: 'PUBLISHED', audience: 'public',
    summary: 'Health calculators and screening tools (e.g. BMI, calorie and clinical calculators). Tool outputs are estimates, not diagnoses.',
    keywords: ['calculator', 'tool', 'bmi', 'calorie', 'due date', 'risk score'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-ai-assistant', title: 'AI Assistant', tab: 'ai-assistant', version: '1.0.0', status: 'PUBLISHED', audience: 'public',
    summary: 'This assistant — website guidance, health education, discovery help, and (when signed in) authorized personal information.',
    keywords: ['ai', 'assistant', 'help', 'chat'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-appointments', title: 'Appointments', tab: 'appointments', version: '1.0.0', status: 'PUBLISHED', audience: 'signed-in',
    summary: 'The signed-in user\'s own appointment schedule: upcoming and past visits, booking and status.',
    keywords: ['appointment', 'booking', 'visit', 'schedule', 'reschedule'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-dashboard', title: 'Health Dashboard', tab: 'dashboard', version: '1.0.0', status: 'PUBLISHED', audience: 'signed-in',
    summary: 'The private personal health dashboard: health summary, records, reminders, saved content and personal tools.',
    keywords: ['dashboard', 'my health', 'health record', 'personal record', 'ehr', 'saved'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-my-history', title: 'My History', tab: 'my-history', version: '1.0.0', status: 'PUBLISHED', audience: 'signed-in',
    summary: 'The signed-in user\'s own activity and audit history on GlobalHealth.',
    keywords: ['history', 'activity', 'audit', 'my activity'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-auth', title: 'Sign In / Create Account', tab: 'auth', version: '1.0.0', status: 'PUBLISHED', audience: 'public',
    summary: 'Sign in or create a GlobalHealth account to unlock personal features (appointments, records, saved content, persistent AI history).',
    keywords: ['sign in', 'login', 'register', 'account', 'sign up'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-hospital-portal', title: 'Hospital Portal', tab: 'hospital-portal', version: '1.0.0', status: 'PUBLISHED', audience: 'role',
    summary: 'Verified hospital staff workspace for managing their facility profile, departments and services.',
    keywords: ['hospital portal', 'hospital staff'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-doctor-portal', title: 'Doctor Portal', tab: 'doctor-portal', version: '1.0.0', status: 'PUBLISHED', audience: 'role',
    summary: 'Verified doctors\' professional workspace (patients, consultations, schedule, EHR tools).',
    keywords: ['doctor portal', 'practice'],
    updatedDate: '2026-09-06',
  },
  {
    id: 'nav-pharmacy-portal', title: 'Pharmacy Partners', tab: 'pharmacy-portal', version: '1.0.0', status: 'PUBLISHED', audience: 'role',
    summary: 'Verified pharmacy partner workspace and the public directory of verified pharmacy partners.',
    keywords: ['pharmacy', 'chemist', 'drugstore', 'partner'],
    updatedDate: '2026-09-06',
  },
];

/** Authentication-state capability matrix (spec §132) — used for honest
 * answers about what is possible without signing in. */
export const AUTH_STATE_RULES = {
  guest: {
    allowed: 'public health education, public website navigation, public medicine/disease/lab-test information, doctor/hospital/map discovery',
    notAllowed: 'private health records, private dashboard, private appointments, private messages, private saved data, private notifications',
    gateMessage: 'Please sign in to access your personal health information.',
  },
  signedIn: {
    allowed: 'their OWN dashboard, appointments, saved content, records, messages and notifications — according to backend authorization',
    notAllowed: "any other user's data of any kind",
    gateMessage: '',
  },
} as const;

/** Published navigation records only (spec §68 — drafts never leak). */
export function publishedNavigation(): GHKnowledgeRecord[] {
  return GH_NAVIGATION.filter((r) => isPublished(r.status));
}

/** Compact prompt block describing the REAL sections (spec §44, §149). */
export function buildWebsiteNavigationContext(): string {
  const pub = publishedNavigation();
  const publicSec = pub.filter((r) => r.audience === 'public' && r.tab && !['auth', 'ai-assistant'].includes(r.tab));
  const signedSec = pub.filter((r) => r.audience === 'signed-in');
  const roleSec = pub.filter((r) => r.audience === 'role');
  const fmt = (rows: GHKnowledgeRecord[]) =>
    rows.map((r) => `- "${r.title}" (section: ${r.tab}) — ${r.summary}`).join('\n');
  return `REAL GLOBALHEALTH SECTIONS (the only pages you may reference — route keys in parentheses):
Public sections:
${fmt(publicSec)}
Signed-in personal sections (require the user's own account):
${fmt(signedSec)}
Professional/role workspaces (require authorized role accounts):
${fmt(roleSec)}

NAVIGATION ANSWER FORMAT: ACTION → LOCATION → NEXT STEP, e.g. "To find a doctor, open Doctors from the main navigation, enter the specialty or location, then use the available filters." Never invent buttons, labels or routes that are not listed above.`;
}
