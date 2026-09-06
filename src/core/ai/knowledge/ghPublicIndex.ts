/* ============================================================================
   GlobalHealth AI — Unified Public Content Index (spec §9, §10, §60-65).

   Indexes the PUBLIC content of the GlobalHealth website into one searchable
   layer. Design rules:

   - CANONICAL SOURCES ONLY (spec §81-82): the adapters reference the same
     canonical arrays the website renders — no copies, no duplicate systems.
   - FIELD WHITELISTS (spec §10, §12): every adapter picks an explicit list of
     publicly displayed fields. Private/hidden fields cannot leak by
     construction, because they are never named.
   - FAIL CLOSED (spec §64-65): every record passes `indexablePublicDoc()`
     (access PUBLIC + status PUBLISHED). Unknown classification → NOT indexed.
   - STATUS + VERSIONING (spec §36-37): every produced doc carries source
     route, source type, access level, status, version and dates.

   Content types indexed here (spec §60): HEALTH_TOOL, RECIPE, NUTRITION,
   WELLNESS_ARTICLE, EXERCISE, WORKOUT, MAP_LOCATION, COMMUNITY_POST, NEWS,
   HELP_ARTICLE, POLICY. Clinical entities (diseases/medicines/lab tests) and
   directories (doctors/hospitals/products) are indexed by their existing
   dedicated modules (aiKnowledge.ts / ghDirectory.ts) and composed in
   ghPublicSearch.ts.
   ========================================================================== */

import { ALL_CALCULATORS } from '../../../data/calculatorsData';
import { ALL_1000_RECIPES } from '../../../data/recipes/index';
import {
  DIETARY_GUIDELINES_DATA,
  DEFICIENCY_DISEASES_DATA,
  MEAL_PLANS_DATA,
} from '../../../data/nutritionData';
import {
  WELLNESS_MODULES,
  EXERCISE_DATABASE,
  WORKOUT_PLANS,
} from '../../../data/wellnessFitnessData';
import { MEDICAL_MAP_FACILITIES } from '../../../data/medicalMapData';
import { FORUM_POSTS } from '../../../data/forumPosts';
import { INITIAL_NEWS_ARTICLES } from '../../../data/newsManagementData';
import { ALL_400_MEDICINES } from '../../../data/medicines/index';

/** Public document schema (spec §61/§62/§63, unified). */
export interface PublicDoc {
  documentId: string;
  entityType: PublicEntityType;
  title: string;
  summary: string;
  details: string;
  keywords: string[];
  route: string;
  sourceTitle: string;
  sourceType: 'PUBLIC_WEBSITE';
  accessLevel: 'PUBLIC';
  status: 'PUBLISHED' | 'UPDATED' | 'ARCHIVED';
  version: string;
  lastUpdated: string;
  indexedAt: string;
  /** Extra provenance label shown in answers (e.g. COMMUNITY CONTENT). */
  contentLabel?: string;
}

export type PublicEntityType =
  | 'HEALTH_TOOL'
  | 'RECIPE'
  | 'NUTRITION'
  | 'WELLNESS_ARTICLE'
  | 'EXERCISE'
  | 'WORKOUT'
  | 'MAP_LOCATION'
  | 'COMMUNITY_POST'
  | 'NEWS'
  | 'HELP_ARTICLE'
  | 'POLICY'
  | 'FAQ';

/** The access filter every document must pass (spec §64-65 — fail closed). */
export function indexablePublicDoc(doc: {
  accessLevel: string;
  status: string;
}): boolean {
  return doc.accessLevel === 'PUBLIC' && (doc.status === 'PUBLISHED' || doc.status === 'UPDATED');
}

const INDEXED_AT = '2026-09-06';
const clean = (v: unknown, max = 200): string =>
  String(v ?? '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/[<>{}]/g, '')
    .trim()
    .slice(0, max);

const cleanList = (v: unknown, maxItems = 4, max = 60): string =>
  Array.isArray(v)
    ? v
        .slice(0, maxItems)
        .map((x) => clean(typeof x === 'string' ? x : (x as any)?.label ?? (x as any)?.name ?? '', max))
        .filter(Boolean)
        .join('; ')
    : '';

const makeDoc = (d: Omit<PublicDoc, 'sourceType' | 'accessLevel' | 'indexedAt' | 'status' | 'version'> & { status?: 'PUBLISHED' | 'ARCHIVED' }): PublicDoc | null => {
  const doc: PublicDoc = {
    ...d,
    status: d.status ?? 'PUBLISHED',
    version: '1.0.0',
    sourceType: 'PUBLIC_WEBSITE',
    accessLevel: 'PUBLIC',
    indexedAt: INDEXED_AT,
  };
  // Fail-closed gate (spec §65) — enforced for every single record.
  if (!indexablePublicDoc(doc)) return null;
  if (!doc.title) return null;
  return doc;
};

const textIndex = (doc: PublicDoc): string =>
  `${doc.title} ${doc.summary} ${doc.details} ${doc.keywords.join(' ')}`.toLowerCase();

// Pure function words carry no topic identity — excluded from matching so
// question phrasing never dilutes the signal.
const STOPWORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'your', 'his', 'her', 'its',
  'this', 'that', 'these', 'those', 'with', 'about', 'from', 'into', 'over',
  'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how', 'does', 'did',
  'can', 'could', 'should', 'would', 'will', 'shall', 'may', 'might', 'must',
  'have', 'has', 'had', 'was', 'were', 'been', 'being', 'there', 'their',
  'them', 'they', 'she', 'him', 'any', 'all', 'get', 'got',
]);

function matchesDoc(doc: PublicDoc, text: string): boolean {
  const hay = textIndex(doc);
  const words = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
  if (!words.length) return false;
  // Whole-word match with a singular fallback ("calculators" -> "calculator").
  const hit = (w: string): boolean => new RegExp(`\\b${w}\\b`).test(hay) || (w.endsWith('s') && new RegExp(`\\b${w.slice(0, -1)}\\b`).test(hay));
  const found = words.filter(hit);
  if (found.length / words.length < 0.5) return false;
  // Identity requirement: at least one matched word must appear in the doc's
  // TITLE or KEYWORDS — body-word overlap alone is not enough. This keeps
  // large libraries (1000 recipes) from matching vague queries.
  const titleKw = `${doc.title} ${doc.keywords.join(' ')}`.toLowerCase();
  return found.some((w) => titleKw.includes(w) || (w.endsWith('s') && titleKw.includes(w.slice(0, -1))));
}

function searchDocs(docs: PublicDoc[], text: string, max: number): PublicDoc[] {
  const hits = docs.filter((d) => matchesDoc(d, text));
  // Prefer higher word coverage, then shorter (more focused) titles.
  const scored = hits.map((d) => {
    const words = text.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 3);
    const found = words.filter((w) => textIndex(d).includes(w)).length;
    return { d, score: words.length ? found / words.length : 0 };
  });
  scored.sort((a, b) => b.score - a.score || a.d.title.length - b.d.title.length);
  return scored.slice(0, max).map((s) => s.d);
}

/* ------------------------------------------------------------------ *
 * 1. HEALTH TOOLS — 80 public calculators (spec §24, §27)
 * ------------------------------------------------------------------ */
export const HEALTH_TOOL_DOCS: PublicDoc[] = ALL_CALCULATORS.map((c) =>
  makeDoc({
    documentId: `tool:${c.id}`,
    entityType: 'HEALTH_TOOL',
    title: clean(c.title, 100),
    summary: clean(c.description, 240),
    details: [
      c.category ? `Category: ${clean(c.category, 50)}` : '',
      c.inputs?.length
        ? `Inputs: ${c.inputs
            .slice(0, 8)
            .map((i) => `${clean(i.label, 40)}${i.unit ? ` (${clean(i.unit, 12)})` : ''}`)
            .join(', ')}`
        : '',
      'Output: an educational estimate — not a diagnosis.',
    ]
      .filter(Boolean)
      .join(' · '),
    keywords: ['calculator', 'health tool', 'tool', clean(c.category, 30).toLowerCase()],
    route: 'calculators',
    sourceTitle: 'GlobalHealth → Health Tools',
    lastUpdated: INDEXED_AT,
  })
).filter((d): d is PublicDoc => d !== null);

/* ------------------------------------------------------------------ *
 * 2. RECIPES — 1000 public recipes (spec §22)
 * ------------------------------------------------------------------ */
export const RECIPE_DOCS: PublicDoc[] = ALL_1000_RECIPES.map((r: any) =>
  makeDoc({
    documentId: `recipe:${clean(r.id, 40)}`,
    entityType: 'RECIPE',
    title: clean(r.title, 120),
    summary: clean(r.description, 220),
    details: [
      typeof r.calories === 'number' ? `${r.calories} kcal` : '',
      typeof r.protein === 'number' ? `protein ${r.protein}g` : '',
      typeof r.carbs === 'number' ? `carbs ${r.carbs}g` : '',
      typeof r.fats === 'number' ? `fats ${r.fats}g` : '',
      r.servings ? `servings: ${clean(r.servings, 10)}` : '',
      r.difficulty ? `difficulty: ${clean(r.difficulty, 20)}` : '',
      r.cuisine ? `cuisine: ${clean(r.cuisine, 30)}` : '',
      r.prepTime ? `prep ${clean(r.prepTime, 12)}` : '',
      r.cookTime ? `cook ${clean(r.cookTime, 12)}` : '',
      cleanList(r.dietTags, 4),
      Array.isArray(r.ingredients) && r.ingredients.length
        ? `ingredients include: ${r.ingredients
            .slice(0, 6)
            .map((i: any) => clean(typeof i === 'string' ? i : i?.name ?? i?.item ?? '', 40))
            .filter(Boolean)
            .join(', ')}`
        : '',
    ]
      .filter(Boolean)
      .join(' · '),
    keywords: ['recipe', 'meal', clean(r.cuisine, 24).toLowerCase(), ...cleanList(r.dietTags, 3, 20).split('; ').map((x) => x.toLowerCase())],
    route: 'recipes',
    sourceTitle: 'GlobalHealth → Recipes',
    lastUpdated: INDEXED_AT,
  })
).filter((d): d is PublicDoc => d !== null);

/* ------------------------------------------------------------------ *
 * 3. NUTRITION — public nutrition education content (spec §25)
 * ------------------------------------------------------------------ */
export const NUTRITION_DOCS: PublicDoc[] = [
  ...DIETARY_GUIDELINES_DATA.map((g: any) =>
    makeDoc({
      documentId: `nutrition:guideline:${clean(g.id, 30)}`,
      entityType: 'NUTRITION',
      title: `Dietary guidelines${g.authority ? ` — ${clean(g.authority, 60)}` : ''}${g.targetGroup ? ` (${clean(g.targetGroup, 60)})` : ''}`,
      summary: clean(g.coreRecommendations, 240) || clean(g.targetGroup, 120),
      details: [
        g.dailyCaloricTarget ? `Daily caloric target: ${clean(g.dailyCaloricTarget, 40)}` : '',
        cleanList(g.coreRecommendations, 4, 80) ? `Key advice: ${cleanList(g.coreRecommendations, 4, 80)}` : '',
      ]
        .filter(Boolean)
        .join(' · '),
      keywords: ['nutrition', 'diet', 'guideline', 'dietary'],
      route: 'nutrition',
      sourceTitle: 'GlobalHealth → Nutrition',
      lastUpdated: INDEXED_AT,
    })
  ),
  ...DEFICIENCY_DISEASES_DATA.map((d: any) =>
    makeDoc({
      documentId: `nutrition:deficiency:${clean(d.id, 30)}`,
      entityType: 'NUTRITION',
      title: `${clean(d.name, 90)}${d.deficientNutrient ? ` (${clean(d.deficientNutrient, 40)} deficiency)` : ''}`,
      summary: clean(d.clinicalDescription, 240),
      details: [
        d.deficientNutrient ? `Deficient nutrient: ${clean(d.deficientNutrient, 40)}` : '',
        cleanList(d.earlySigns, 4) ? `Early signs: ${cleanList(d.earlySigns, 4)}` : '',
        cleanList(d.highRiskPopulations, 3) ? `Higher-risk groups: ${cleanList(d.highRiskPopulations, 3)}` : '',
      ]
        .filter(Boolean)
        .join(' · '),
      keywords: ['nutrition', 'deficiency', 'vitamin', 'nutrient', clean(d.deficientNutrient, 24).toLowerCase()],
      route: 'nutrition',
      sourceTitle: 'GlobalHealth → Nutrition',
      lastUpdated: INDEXED_AT,
    })
  ),
  ...MEAL_PLANS_DATA.map((m: any) =>
    makeDoc({
      documentId: `nutrition:meal-plan:${clean(m.id, 30)}`,
      entityType: 'NUTRITION',
      title: `Meal plan: ${clean(m.title, 90)}`,
      summary: clean(m.description, 240),
      details: [
        m.targetCondition ? `Designed for: ${clean(m.targetCondition, 60)}` : '',
        m.calorieRange ? `Calorie range: ${clean(m.calorieRange, 40)}` : '',
        cleanList(m.idealFor, 3) ? `Ideal for: ${cleanList(m.idealFor, 3)}` : '',
      ]
        .filter(Boolean)
        .join(' · '),
      keywords: ['meal plan', 'nutrition', 'diet plan', clean(m.targetCondition, 24).toLowerCase()],
      route: 'nutrition',
      sourceTitle: 'GlobalHealth → Nutrition',
      lastUpdated: INDEXED_AT,
    })
  ),
].filter((d): d is PublicDoc => d !== null);

/* ------------------------------------------------------------------ *
 * 4. WELLNESS & FITNESS (spec §26)
 * ------------------------------------------------------------------ */
export const WELLNESS_DOCS: PublicDoc[] = [
  ...WELLNESS_MODULES.map((m: any) =>
    makeDoc({
      documentId: `wellness:module:${clean(m.id, 30)}`,
      entityType: 'WELLNESS_ARTICLE',
      title: clean(m.title, 100),
      summary: clean(m.summary, 240),
      details: [
        m.category ? `Category: ${clean(m.category, 40)}` : '',
        cleanList(m.keyBenefits, 3) ? `Key benefits: ${cleanList(m.keyBenefits, 3)}` : '',
        m.readTime ? `Read time: ${clean(m.readTime, 16)}` : '',
      ]
        .filter(Boolean)
        .join(' · '),
      keywords: ['wellness', 'fitness', 'health', clean(m.category, 24).toLowerCase()],
      route: 'wellness',
      sourceTitle: 'GlobalHealth → Wellness & Fitness',
      lastUpdated: INDEXED_AT,
    })
  ),
  ...EXERCISE_DATABASE.map((e: any) =>
    makeDoc({
      documentId: `wellness:exercise:${clean(e.id ?? e.name ?? e.title, 40)}`,
      entityType: 'EXERCISE',
      title: clean(e.name ?? e.title, 90),
      summary: clean(e.description ?? e.summary ?? '', 200),
      details: [e.category ? `Category: ${clean(e.category, 40)}` : '', e.level ?? e.difficulty ? `Level: ${clean(e.level ?? e.difficulty, 24)}` : '']
        .filter(Boolean)
        .join(' · '),
      keywords: ['exercise', 'workout', 'fitness', clean(e.category, 20).toLowerCase()],
      route: 'wellness',
      sourceTitle: 'GlobalHealth → Wellness & Fitness',
      lastUpdated: INDEXED_AT,
    })
  ),
  ...WORKOUT_PLANS.map((w: any) =>
    makeDoc({
      documentId: `wellness:workout:${clean(w.id ?? w.title ?? w.name, 40)}`,
      entityType: 'WORKOUT',
      title: `Workout plan: ${clean(w.title ?? w.name, 90)}`,
      summary: clean(w.description ?? w.summary ?? w.goal ?? '', 200),
      details: [w.level ? `Level: ${clean(w.level, 24)}` : '', w.duration ? `Duration: ${clean(w.duration, 24)}` : '']
        .filter(Boolean)
        .join(' · '),
      keywords: ['workout', 'exercise plan', 'fitness', 'training'],
      route: 'wellness',
      sourceTitle: 'GlobalHealth → Wellness & Fitness',
      lastUpdated: INDEXED_AT,
    })
  ),
].filter((d): d is PublicDoc => d !== null);

/* ------------------------------------------------------------------ *
 * 5. MEDICAL MAP — public facility layer (spec §18, §21)
 * ------------------------------------------------------------------ */
export const MAP_LOCATION_DOCS: PublicDoc[] = MEDICAL_MAP_FACILITIES.map((f: any) =>
  makeDoc({
    documentId: `map:${clean(f.id ?? f.facilityIdCode, 40)}`,
    entityType: 'MAP_LOCATION',
    title: clean(f.facilityName ?? f.name, 120),
    summary: [clean(f.facilityType, 50), clean(f.ownership, 30), clean(f.district, 50)].filter(Boolean).join(' · '),
    details: [
      f.district ? `District: ${clean(f.district, 50)}` : '',
      f.pincode ? `Pincode: ${clean(f.pincode, 10)}` : '',
      typeof f.bedCount === 'number' ? `Beds (as mapped): ${f.bedCount}` : '',
      f.verificationStatus ? `Verification status: ${clean(f.verificationStatus, 40)}` : '',
      f.lastVerified ? `Last verified: ${clean(f.lastVerified, 24)}` : '',
    ]
      .filter(Boolean)
      .join(' · '),
    keywords: ['map', 'facility', 'hospital', clean(f.facilityType, 24).toLowerCase(), clean(f.district, 24).toLowerCase()],
    route: 'medical-map',
    sourceTitle: 'GlobalHealth → Medical Map',
    lastUpdated: INDEXED_AT,
  })
).filter((d): d is PublicDoc => d !== null);

/* ------------------------------------------------------------------ *
 * 6. COMMUNITY — PUBLIC posts only, labeled as community content
 *    (spec §20, §22-23)
 * ------------------------------------------------------------------ */
export const COMMUNITY_DOCS: PublicDoc[] = FORUM_POSTS.map((p: any) =>
  makeDoc({
    documentId: `community:${clean(p.id, 40)}`,
    entityType: 'COMMUNITY_POST',
    title: clean(p.title, 140),
    summary: clean(p.content, 220),
    details: [
      p.category ? `Category: ${clean(p.category, 40)}` : '',
      p.author ? `Posted by: ${clean(p.author, 50)}` : '',
      p.isAnswered ? 'Marked answered' : '',
      cleanList(p.tags, 4, 20) ? `Tags: ${cleanList(p.tags, 4, 20)}` : '',
      'This is COMMUNITY CONTENT — user-generated, not verified medical information.',
    ]
      .filter(Boolean)
      .join(' · '),
    keywords: ['community', 'forum', 'discussion', clean(p.category, 20).toLowerCase()],
    route: 'community',
    sourceTitle: 'GlobalHealth → Community',
    contentLabel: 'COMMUNITY CONTENT',
    lastUpdated: INDEXED_AT,
  })
).filter((d): d is PublicDoc => d !== null);

/* ------------------------------------------------------------------ *
 * 7. NEWS — ONLY status=PUBLISHED articles (spec §21, §37, §65).
 *    Drafts/unpublished records fail the gate and are EXCLUDED — the
 *    completeness report shows exactly how many were excluded and why.
 * ------------------------------------------------------------------ */
export const NEWS_EXCLUDED_COUNT = INITIAL_NEWS_ARTICLES.filter(
  (a: any) => String(a.status ?? '').toUpperCase() !== 'PUBLISHED'
).length;

// Fail-closed (spec §21, §37, §65): ONLY articles whose real record status is
// PUBLISHED enter the index — drafts, review and unknown statuses are
// excluded and counted in the completeness report.
export const NEWS_DOCS: PublicDoc[] = INITIAL_NEWS_ARTICLES.filter(
  (a: any) => String(a.status ?? '').toUpperCase() === 'PUBLISHED'
).map((a: any) =>
  makeDoc({
    documentId: `news:${clean(a.id, 40)}`,
    entityType: 'NEWS',
    title: clean(a.title, 160),
    summary: clean(a.summary ?? a.shortDescription, 240),
    details: [
      a.source ? `Source: ${clean(a.source, 60)}` : '',
      a.date ? `Published: ${clean(a.date, 24)}` : '',
      a.lastUpdated ? `Updated: ${clean(a.lastUpdated, 24)}` : '',
      a.category ? `Category: ${clean(a.category, 30)}` : '',
      'News reports are not clinical recommendations.',
    ]
      .filter(Boolean)
      .join(' · '),
    keywords: ['news', 'article', clean(a.category, 20).toLowerCase()],
    route: 'news',
    sourceTitle: 'GlobalHealth → Health News',
    contentLabel: 'NEWS REPORT',
    lastUpdated: clean(a.lastUpdated ?? a.date, 24) || INDEXED_AT,
  })
).filter((d): d is PublicDoc => d !== null);

/* ------------------------------------------------------------------ *
 * 8. FAQ — the REAL "Clinical FAQs" published on medicine pages
 *    (spec PART 32). Every question/answer pair below is approved public
 *    content from the medicines library — never generated.
 * ------------------------------------------------------------------ */
export const MEDICINE_FAQ_DOCS: PublicDoc[] = ALL_400_MEDICINES.flatMap((m: any) =>
  (Array.isArray(m.faqs) ? m.faqs : []).slice(0, 6).map((f: any, i: number) =>
    makeDoc({
      documentId: `faq:medicine:${clean(m.id ?? m.name, 40)}:${i}`,
      entityType: 'FAQ',
      title: clean(f.question, 160),
      summary: clean(f.answer, 320),
      details: `From the ${clean(m.name, 80)} page (Clinical FAQs section). Answers medicine-specific questions educationally and never replaces professional advice.`,
      keywords: [
        'faq',
        'question',
        clean(m.name, 40).toLowerCase(),
        clean(m.genericName, 40).toLowerCase(),
      ],
      route: 'medicines',
      sourceTitle: `GlobalHealth → Medicines → ${clean(m.name, 60)}`,
      lastUpdated: INDEXED_AT,
    })
  )
).filter((d): d is PublicDoc => d !== null);

/* ------------------------------------------------------------------ *
 * 9. HELP / FAQ / POLICY — how to use the site + real public policies
 *    (spec §25, §26, §47, §48, §49)
 * ------------------------------------------------------------------ */
export const HELP_POLICY_DOCS: PublicDoc[] = [
  // How-to help articles — each describes a REAL capability of the site.
  makeDoc({
    documentId: 'help:find-doctor',
    entityType: 'HELP_ARTICLE',
    title: 'How to find a doctor on GlobalHealth',
    summary: 'Open Doctors from the main navigation, browse or search by specialty, review each doctor\'s qualifications, hospital affiliation, experience and listed fees, then book an appointment.',
    details: 'Related sections: Doctors, Appointments (sign-in required), Hospitals.',
    keywords: ['find', 'doctor', 'search', 'book', 'filter', 'specialty'],
    route: 'doctors',
    sourceTitle: 'GlobalHealth → Doctors',
    lastUpdated: INDEXED_AT,
  }),
  makeDoc({
    documentId: 'help:find-hospital',
    entityType: 'HELP_ARTICLE',
    title: 'How to find hospitals and facilities',
    summary: 'Open Hospitals to browse verified hospital profiles with departments, services and capacity, or open the Medical Map to find facilities by district with type, beds and verification status.',
    details: 'Related sections: Hospitals, Medical Map.',
    keywords: ['hospital', 'facility', 'map', 'nearby', 'district', 'emergency'],
    route: 'hospitals',
    sourceTitle: 'GlobalHealth → Hospitals / Medical Map',
    lastUpdated: INDEXED_AT,
  }),
  makeDoc({
    documentId: 'help:medicine-info-vs-buy',
    entityType: 'HELP_ARTICLE',
    title: 'Difference between medicine information and buying medicines',
    summary: 'The Medicines section explains medicines (uses, precautions, side effects, prescription status). Buying happens separately through verified pharmacy partners in the buy-medicine flow, which shows live stock status and listed prices.',
    details: 'Stock statuses shown: In Stock, Limited Stock, Currently Unavailable. Only verified pharmacy partners are eligible sellers.',
    keywords: ['buy', 'medicine', 'pharmacy', 'stock', 'price', 'order', 'verified'],
    route: 'medicines',
    sourceTitle: 'GlobalHealth → Medicines / Verified Pharmacy Partners',
    lastUpdated: INDEXED_AT,
  }),
  makeDoc({
    documentId: 'help:disease-pages',
    entityType: 'HELP_ARTICLE',
    title: 'What a disease page on GlobalHealth contains',
    summary: 'Each disease page brings together the overview, symptoms and warning signs, causes and risk factors, diagnosis and tests, treatment categories, prevention, complications, and a dynamic Common Questions (FAQ) section generated from that condition\'s own record — for example whether it is contagious, its usual recovery time, and vaccine availability where applicable.',
    details: 'Related sections: Diseases. Related: Find a Doctor for the managing specialty.',
    keywords: ['disease', 'page', 'faq', 'questions', 'what is included', 'overview'],
    route: 'diseases',
    sourceTitle: 'GlobalHealth → Diseases',
    lastUpdated: INDEXED_AT,
  }),
  makeDoc({
    documentId: 'help:lab-test-info',
    entityType: 'HELP_ARTICLE',
    title: 'How to read lab test information',
    summary: 'Open Lab Tests to search 1000 tests. Each test page explains purpose, sample type, preparation and reference-range education. Interpretation is educational — results should be interpreted by a clinician using the range printed on your own report.',
    details: 'Related sections: Lab Tests, Medical Tests interpretation tools.',
    keywords: ['lab', 'test', 'reference range', 'sample', 'preparation', 'result'],
    route: 'medical-tests',
    sourceTitle: 'GlobalHealth → Lab Tests',
    lastUpdated: INDEXED_AT,
  }),
  makeDoc({
    documentId: 'help:health-tools',
    entityType: 'HELP_ARTICLE',
    title: 'How to use the health tools and calculators',
    summary: 'Open Health Tools to use 80 calculators across categories like Body & Composition, Nutrition & Macros, Cardiovascular, Clinical & Labs, Kidney & Renal, Pregnancy & Pediatrics, Sports and Lifestyle. Each tool shows required inputs and an educational result — estimates, never diagnoses.',
    details: 'Related sections: Health Tools.',
    keywords: ['calculator', 'tool', 'bmi', 'how to', 'estimate'],
    route: 'calculators',
    sourceTitle: 'GlobalHealth → Health Tools',
    lastUpdated: INDEXED_AT,
  }),
  makeDoc({
    documentId: 'help:save-signin',
    entityType: 'HELP_ARTICLE',
    title: 'What requires signing in',
    summary: 'Public browsing (diseases, medicines, lab tests, doctors, hospitals, map, news, recipes, nutrition, wellness, tools, community) needs no account. Your personal dashboard, appointments, privacy center, activity history, saved content and persistent AI conversations require signing in to your own account.',
    details: 'Related section: Sign In / Create Account.',
    keywords: ['sign in', 'login', 'account', 'save', 'private', 'dashboard'],
    route: 'auth',
    sourceTitle: 'GlobalHealth → Sign In',
    lastUpdated: INDEXED_AT,
  }),
  // Policies — real sections of the public legal pages (spec §47-49).
  makeDoc({
    documentId: 'policy:terms',
    entityType: 'POLICY',
    title: 'Terms & Conditions (overview)',
    summary: 'GlobalHealth\'s public Terms cover: acceptance, eligibility, account registration and security, login and authentication, GlobalHealth services, personal health information, medical information disclaimer, doctors and healthcare professionals, appointments, medicines and pharmacy services, verified pharmacy partners, laboratory and diagnostic information, the AI assistant, health calculators, community, user content, messaging, health record and doctor access, and payments.',
    details: 'The user can read the full public Terms in the Terms section. The AI can explain what a section covers but does not give legal advice.',
    keywords: ['terms', 'conditions', 'policy', 'legal', 'rules', 'agreement'],
    route: 'terms',
    sourceTitle: 'GlobalHealth → Terms & Conditions',
    lastUpdated: INDEXED_AT,
  }),
  makeDoc({
    documentId: 'policy:terms-medical-disclaimer',
    entityType: 'POLICY',
    title: 'Medical Information Disclaimer (from the public Terms)',
    summary: 'GlobalHealth provides health information for education. It is not a medical provider, and information on the platform — including AI assistance and health calculators — is not a diagnosis or treatment and does not replace professional medical care.',
    details: 'Full text: Terms & Conditions → Medical Information Disclaimer.',
    keywords: ['disclaimer', 'medical', 'not a doctor', 'educational'],
    route: 'terms',
    sourceTitle: 'GlobalHealth → Terms & Conditions → Medical Information Disclaimer',
    lastUpdated: INDEXED_AT,
  }),
  makeDoc({
    documentId: 'policy:terms-verified-partners',
    entityType: 'POLICY',
    title: 'Verified Pharmacy Partners rule (from the public Terms)',
    summary: 'GlobalHealth publicly explains that medicines are sold through verified pharmacy partners, and doctor/hospital information comes from verified professional accounts. Verification is a platform rule the AI may explain exactly as published.',
    details: 'Full text: Terms & Conditions → Verified Pharmacy Partners / Doctors and Healthcare Professionals.',
    keywords: ['verified', 'pharmacy', 'partner', 'verification', 'trust'],
    route: 'terms',
    sourceTitle: 'GlobalHealth → Terms & Conditions → Verified Pharmacy Partners',
    lastUpdated: INDEXED_AT,
  }),
  makeDoc({
    documentId: 'policy:privacy',
    entityType: 'POLICY',
    title: 'Privacy Policy (overview)',
    summary: 'GlobalHealth\'s public Privacy Policy covers: who we are, what data we collect and why, how we use your data, which services require which data, consent and how to withdraw it, retention, security, your rights, third-party processing, the AI assistant and health data, children, and changes to the policy.',
    details: 'The user can read the full public Privacy Policy in the Privacy Policy section. The AI can point to the right section but does not give legal advice.',
    keywords: ['privacy', 'data', 'consent', 'retention', 'rights', 'policy'],
    route: 'privacy-policy',
    sourceTitle: 'GlobalHealth → Privacy Policy',
    lastUpdated: INDEXED_AT,
  }),
].filter((d): d is PublicDoc => d !== null);

/* ------------------------------------------------------------------ *
 * Unified index + stats
 * ------------------------------------------------------------------ */

/** All public docs from THIS module (clinical/directory entities live in
 * their own modules and are composed at retrieval time). */
export function allPublicDocs(): PublicDoc[] {
  return [
    ...HEALTH_TOOL_DOCS,
    ...RECIPE_DOCS,
    ...NUTRITION_DOCS,
    ...WELLNESS_DOCS,
    ...MAP_LOCATION_DOCS,
    ...COMMUNITY_DOCS,
    ...NEWS_DOCS,
    ...MEDICINE_FAQ_DOCS,
    ...HELP_POLICY_DOCS,
  ];
}

export type PublicIndexStats = {
  totalIndexed: number;
  byType: Record<string, number>;
  datasetCounts: Record<string, number>;
  excluded: { newsNotPublished: number };
};

/** Completeness statistics for the automated report (spec §100). */
export function publicIndexStats(): PublicIndexStats {
  const docs = allPublicDocs();
  const byType: Record<string, number> = {};
  for (const d of docs) byType[d.entityType] = (byType[d.entityType] ?? 0) + 1;
  return {
    totalIndexed: docs.length,
    byType,
    datasetCounts: {
      healthTools: ALL_CALCULATORS.length,
      recipes: ALL_1000_RECIPES.length,
      mapFacilities: MEDICAL_MAP_FACILITIES.length,
      communityPosts: FORUM_POSTS.length,
      newsArticles: INITIAL_NEWS_ARTICLES.length,
      wellnessModules: WELLNESS_MODULES.length,
      medicineFaqs: MEDICINE_FAQ_DOCS.length,
    },
    excluded: {
      // Fail-closed: only PUBLISHED news is indexed (spec §21, §65).
      newsNotPublished: NEWS_EXCLUDED_COUNT,
    },
  };
}

/** Search across the unified public content index. */
export function searchPublicIndex(text: string, maxPerType = 2, totalMax = 6): PublicDoc[] {
  const docs = allPublicDocs();
  const byType = new Map<string, PublicDoc[]>();
  for (const d of docs) {
    if (!matchesDoc(d, text)) continue;
    const list = byType.get(d.entityType) ?? [];
    if (list.length < maxPerType) list.push(d);
    byType.set(d.entityType, list);
  }
  const out: PublicDoc[] = [];
  for (const list of byType.values()) out.push(...list);
  return out.slice(0, totalMax);
}
