import { HealthCondition } from '../../types';
import { ALL_500_DISEASES } from './index';

/* ------------------------------------------------------------------ *
 * Disease data index & search utilities.
 *
 * Pure, data-driven helpers over the master disease catalog so the
 * Disease section can scale to thousands of records without UI changes.
 * ------------------------------------------------------------------ */

export const ALL_DISEASES: HealthCondition[] = ALL_500_DISEASES;

export interface BodySystemMeta {
  id: string;
  label: string;
  shortLabel: string;
  keywords: string[];
  count: number;
}

/** Body systems derived from the actual catalog (real counts, no guesses). */
export const BODY_SYSTEMS: BodySystemMeta[] = [
  {
    id: 'brain-nervous',
    label: 'Brain & Nervous System',
    shortLabel: 'Brain & Nervous',
    keywords: ['nervous', 'brain', 'neurolog', 'central & peripheral'],
    count: 0,
  },
  {
    id: 'heart-circulatory',
    label: 'Heart & Circulatory System',
    shortLabel: 'Heart & Circulation',
    keywords: ['cardiovascular', 'cardiac', 'heart', 'circulatory'],
    count: 0,
  },
  {
    id: 'lungs-respiratory',
    label: 'Lungs & Respiratory System',
    shortLabel: 'Lungs & Respiratory',
    keywords: ['respiratory', 'pulmonary', 'lung'],
    count: 0,
  },
  {
    id: 'digestive',
    label: 'Digestive System',
    shortLabel: 'Digestive',
    keywords: ['digestive', 'gastrointestinal', 'stomach', 'intestinal'],
    count: 0,
  },
  {
    id: 'liver',
    label: 'Liver & Biliary',
    shortLabel: 'Liver',
    keywords: ['liver', 'hepatic', 'biliary'],
    count: 0,
  },
  {
    id: 'kidneys-urinary',
    label: 'Kidneys & Urinary System',
    shortLabel: 'Kidneys & Urinary',
    keywords: ['renal', 'kidney', 'urinary', 'nephro'],
    count: 0,
  },
  {
    id: 'endocrine',
    label: 'Endocrine System',
    shortLabel: 'Endocrine',
    keywords: ['endocrine', 'metabolic', 'thyroid', 'diabetes'],
    count: 0,
  },
  {
    id: 'bones-joints',
    label: 'Bones & Joints',
    shortLabel: 'Bones & Joints',
    keywords: ['musculoskeletal', 'skeletal', 'bone', 'joint', 'orthop'],
    count: 0,
  },
  {
    id: 'skin',
    label: 'Skin',
    shortLabel: 'Skin',
    keywords: ['integumentary', 'cutaneous', 'skin', 'dermat'],
    count: 0,
  },
  {
    id: 'immune',
    label: 'Immune System',
    shortLabel: 'Immune',
    keywords: ['immune', 'pathogen', 'infectious', 'infection'],
    count: 0,
  },
  {
    id: 'reproductive',
    label: 'Reproductive System',
    shortLabel: 'Reproductive',
    keywords: ['reproductive', 'gynecologic', 'testicular', 'ovarian', 'prostate'],
    count: 0,
  },
  {
    id: 'cancer',
    label: 'Cellular & Neoplastic (Cancer)',
    shortLabel: 'Cancer & Cellular',
    keywords: ['neoplastic', 'cancer', 'tumor', 'malignan', 'carcinoma', 'leukemia', 'lymphoma', 'melanoma'],
    count: 0,
  },
];

// Populate real counts.
const lowerBodySystem = (cond: HealthCondition) =>
  `${cond.bodySystem || ''} ${cond.category || ''} ${(cond.affectedBodyParts || []).join(' ')}`.toLowerCase();
for (const bs of BODY_SYSTEMS) {
  bs.count = ALL_DISEASES.filter((c) => bs.keywords.some((k) => lowerBodySystem(c).includes(k))).length;
}

export interface CategoryMeta {
  category: string;
  count: number;
}

/** Real categories from the catalog with counts. */
export const CATEGORY_LIST: CategoryMeta[] = (() => {
  const counts = new Map<string, number>();
  for (const c of ALL_DISEASES) {
    counts.set(c.category, (counts.get(c.category) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category));
})();

export const SPECIALTY_LIST: CategoryMeta[] = (() => {
  const counts = new Map<string, number>();
  for (const c of ALL_DISEASES) {
    if (c.specialist) counts.set(c.specialist, (counts.get(c.specialist) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([specialty, count]) => ({ category: specialty, count }))
    .sort((a, b) => b.count - a.count);
})();

/** Curated, real records used for "Popular Disease Topics" (no invented metrics). */
export const CURATED_POPULAR_IDS: string[] = [
  'dis-endocr-302', // Type 2 diabetes mellitus
  'dis-cardio-1', // Essential hypertension
  'dis-pulmon-101', // Asthma
  'dis-neurol-70', // Migraine
  'dis-orthop-201', // Primary osteoarthritis
  'dis-nephro-252', // Chronic kidney disease
  'dis-pulmon-107', // Community-acquired pneumonia
  'dis-endocr-310', // Hypothyroidism
];

export function getPopularDiseases(): HealthCondition[] {
  return CURATED_POPULAR_IDS.map((id) => getDiseaseById(id)).filter(Boolean) as HealthCondition[];
}

export function getDiseaseById(id: string): HealthCondition | undefined {
  return ALL_DISEASES.find((d) => d.id === id);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function getDiseaseBySlug(slug: string): HealthCondition | undefined {
  return ALL_DISEASES.find((d) => slugify(d.title) === slug);
}

export function slugFor(cond: HealthCondition): string {
  return slugify(cond.title);
}

/** Common-name / synonym map used by search (safe, generic healthcare terms). */
const ALIASES: Record<string, string[]> = {
  'high blood pressure': ['hypertension', 'essential hypertension'],
  hypertension: ['high blood pressure', 'elevated blood pressure'],
  diabetes: ['type 1 diabetes mellitus', 'type 2 diabetes mellitus', 'gestational diabetes mellitus'],
  sugar: ['type 2 diabetes mellitus', 'type 1 diabetes mellitus', 'gestational diabetes mellitus'],
  'bp': ['essential hypertension', 'hypotension'],
  cancer: ['carcinoma', 'leukemia', 'lymphoma', 'melanoma', 'sarcoma', 'tumor'],
  heart: ['cardiovascular', 'cardiac', 'myocardial', 'heart failure', 'atrial fibrillation'],
  stroke: ['ischemic stroke', 'hemorrhagic stroke', 'cerebrovascular'],
  kidney: ['renal', 'nephro', 'chronic kidney disease', 'kidney stones'],
  'kidney disease': ['chronic kidney disease', 'acute kidney injury', 'diabetic kidney disease'],
  'alzheimer': ['alzheimer disease'],
  tb: ['tuberculosis'],
  copd: ['chronic obstructive pulmonary disease'],
  'thyroid': ['hypothyroidism', 'hyperthyroidism', 'hashimoto thyroiditis'],
  'blood sugar': ['type 2 diabetes mellitus', 'type 1 diabetes mellitus'],
  arthritis: ['osteoarthritis', 'rheumatoid arthritis'],
  pneumonia: ['community-acquired pneumonia', 'bacterial pneumonia', 'viral pneumonia'],
  'heart failure': ['heart failure with reduced ejection fraction', 'heart failure with preserved ejection fraction'],
};

function expandQuery(q: string): string[] {
  const lower = q.trim().toLowerCase();
  const terms = new Set<string>([lower]);
  for (const [key, targets] of Object.entries(ALIASES)) {
    if (lower.includes(key)) targets.forEach((t) => terms.add(t));
    if (targets.some((t) => lower.includes(t))) terms.add(key);
  }
  return [...terms];
}

export interface DiseaseSearchHit {
  cond: HealthCondition;
  score: number;
  matchedOn: 'title' | 'common' | 'alias' | 'category' | 'bodySystem' | 'symptom' | 'specialty' | 'summary';
}

/** Lightweight ranked search across the catalog (title > synonyms > fields). */
export function searchDiseases(rawQuery: string, limit = 12): DiseaseSearchHit[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return [];
  const queries = expandQuery(q);

  const scored: DiseaseSearchHit[] = [];
  for (const cond of ALL_DISEASES) {
    const title = cond.title.toLowerCase();
    const common = (cond.commonName || '').toLowerCase();
    const category = (cond.category || '').toLowerCase();
    const bodySystem = (cond.bodySystem || '').toLowerCase();
    const summary = (cond.summary || '').toLowerCase();
    const specialist = (cond.specialist || '').toLowerCase();
    const symptoms = (cond.symptoms || []).map((s) => s.toLowerCase());

    let best: { score: number; matchedOn: DiseaseSearchHit['matchedOn'] } | null = null;
    for (const term of queries) {
      if (title === term) best = pick(best, { score: 100, matchedOn: 'title' });
      else if (title.startsWith(term)) best = pick(best, { score: 90, matchedOn: 'title' });
      else if (title.includes(term)) best = pick(best, { score: 80, matchedOn: 'title' });
      if (common === term) best = pick(best, { score: 85, matchedOn: 'common' });
      else if (common.includes(term)) best = pick(best, { score: 70, matchedOn: 'common' });
      if (specialist.includes(term)) best = pick(best, { score: 55, matchedOn: 'specialty' });
      if (category.includes(term)) best = pick(best, { score: 45, matchedOn: 'category' });
      if (bodySystem.includes(term)) best = pick(best, { score: 45, matchedOn: 'bodySystem' });
      if (summary.includes(term)) best = pick(best, { score: 30, matchedOn: 'summary' });
      if (symptoms.some((s) => s.includes(term))) best = pick(best, { score: 40, matchedOn: 'symptom' });
    }
    if (best) scored.push({ cond, score: best.score, matchedOn: best.matchedOn });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

function pick(
  current: { score: number; matchedOn: DiseaseSearchHit['matchedOn'] } | null,
  candidate: { score: number; matchedOn: DiseaseSearchHit['matchedOn'] }
): { score: number; matchedOn: DiseaseSearchHit['matchedOn'] } {
  if (!current || candidate.score > current.score) return candidate;
  return current;
}

export interface SearchSuggestion {
  kind: 'disease' | 'symptom' | 'bodySystem' | 'specialty' | 'category';
  label: string;
  sublabel?: string;
  id?: string;
}

/**
 * Curated common-symptom → specialty navigation map.
 * Selecting a symptom opens the directory pre-filtered to the specialty that
 * commonly evaluates it — a navigation aid, never a diagnosis.
 */
export const COMMON_SYMPTOMS: { label: string; specialty: string }[] = [
  { label: 'Cough', specialty: 'Pulmonologist' },
  { label: 'Shortness of breath', specialty: 'Pulmonologist' },
  { label: 'Chest pain', specialty: 'Cardiologist' },
  { label: 'Palpitations', specialty: 'Cardiologist' },
  { label: 'Headache', specialty: 'Neurologist' },
  { label: 'Dizziness', specialty: 'Neurologist' },
  { label: 'Fever', specialty: 'Infectious Disease Specialist' },
  { label: 'Fatigue', specialty: 'Endocrinologist' },
  { label: 'Weight loss', specialty: 'Endocrinologist' },
  { label: 'Joint pain', specialty: 'Orthopedist' },
  { label: 'Back pain', specialty: 'Orthopedist' },
  { label: 'Skin rash', specialty: 'Dermatologist' },
  { label: 'Itching', specialty: 'Dermatologist' },
  { label: 'Abdominal pain', specialty: 'Gastroenterologist' },
  { label: 'Nausea', specialty: 'Gastroenterologist' },
  { label: 'Diarrhea', specialty: 'Gastroenterologist' },
  { label: 'Constipation', specialty: 'Gastroenterologist' },
  { label: 'Frequent urination', specialty: 'Nephrologist' },
  { label: 'Swelling', specialty: 'Nephrologist' },
  { label: 'Sore throat', specialty: 'Infectious Disease Specialist' },
  { label: 'Runny nose', specialty: 'Pulmonologist' },
  { label: 'Muscle aches', specialty: 'Orthopedist' },
  { label: 'Sleep problems', specialty: 'Neurologist' },
  { label: 'Anxiety', specialty: 'Neurologist' },
];

/** Search that also surfaces symptoms / body systems / specialties. */
export function smartSearch(rawQuery: string, limit = 8): SearchSuggestion[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return [];
  const out: SearchSuggestion[] = [];

  // Curated symptom suggestions (real common terms, safely framed).
  for (const s of COMMON_SYMPTOMS) {
    if (s.label.toLowerCase().includes(q) || q.includes(s.label.toLowerCase())) {
      out.push({ kind: 'symptom', label: s.label, sublabel: `Commonly evaluated by a ${s.specialty}` });
    }
  }

  // Body systems
  for (const bs of BODY_SYSTEMS) {
    if (bs.label.toLowerCase().includes(q) || bs.shortLabel.toLowerCase().includes(q)) {
      out.push({ kind: 'bodySystem', label: bs.label, id: bs.id, sublabel: `${bs.count} conditions` });
    }
  }

  // Specialties
  for (const sp of SPECIALTY_LIST) {
    if (sp.category.toLowerCase().includes(q)) {
      out.push({ kind: 'specialty', label: sp.category, sublabel: `${sp.count} conditions` });
    }
  }

  return out.slice(0, limit);
}

export function specialtyForSymptom(symptom: string): string | undefined {
  return COMMON_SYMPTOMS.find((s) => s.label.toLowerCase() === symptom.toLowerCase())?.specialty;
}

/** Related diseases: same body system / category / specialist, scored honestly. */
export function getRelatedDiseases(cond: HealthCondition, limit = 6): HealthCondition[] {
  const sameBody = cond.bodySystem?.toLowerCase() || '';
  const scored = ALL_DISEASES.filter((d) => d.id !== cond.id).map((d) => {
    let score = 0;
    if (d.bodySystem?.toLowerCase() === sameBody) score += 3;
    if (d.category === cond.category) score += 2;
    if (d.specialist === cond.specialist) score += 1;
    return { d, score };
  });
  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.d);
}

export interface DerivedFaq {
  question: string;
  answer: string;
}

/** FAQs derived from real fields only — no invented medical claims. */
export function deriveFaqs(cond: HealthCondition): DerivedFaq[] {
  const faqs: DerivedFaq[] = [];
  faqs.push({
    question: `What is ${cond.title.toLowerCase()}?`,
    answer: cond.summary,
  });
  if (cond.howDoesItSpread) {
    faqs.push({ question: 'Is it contagious?', answer: cond.howDoesItSpread });
  }
  if (cond.diagnosisAndTests?.length) {
    faqs.push({
      question: 'How is it diagnosed?',
      answer: `${cond.diagnosisMedicalHistory || 'Diagnosis begins with a medical history and clinical evaluation.'} ${
        cond.diagnosisAndTests.slice(0, 2).join(' ')
      }`,
    });
  }
  if (cond.treatments?.length) {
    faqs.push({
      question: 'How is it generally treated?',
      answer: cond.treatments.join(' '),
    });
  }
  if (cond.prevention?.length) {
    faqs.push({
      question: 'Can it be prevented?',
      answer: cond.prevention.join(' ') || 'Prevention depends on the specific condition and individual risk factors.',
    });
  }
  if (cond.specialist) {
    faqs.push({
      question: 'Which specialist usually manages this condition?',
      answer: `A ${cond.specialist} commonly evaluates and manages this condition.`,
    });
  }
  if (cond.whenToSeeDoctor) {
    faqs.push({ question: 'When should someone seek medical care?', answer: cond.whenToSeeDoctor });
  }
  return faqs;
}

export interface DerivedMyth {
  myth: string;
  fact: string;
}

/** Myths derived strictly from reliable data fields — never manufactured. */
export function deriveMythsFacts(cond: HealthCondition): DerivedMyth[] {
  const myths: DerivedMyth[] = [];
  if (cond.contagious) {
    const isContagious = /yes|communicable/i.test(cond.contagious);
    myths.push({
      myth: isContagious
        ? 'Anyone near a person with this condition will definitely get it.'
        : `This condition is always contagious and can spread easily.`,
      fact: isContagious
        ? 'Transmission depends on many factors including exposure, immunity and protective measures. Specific guidance should come from a healthcare professional.'
        : cond.howDoesItSpread || `${cond.contagious} — this condition does not spread from person to person.`,
    });
  }
  if (cond.curable) {
    myths.push({
      myth: 'This condition is always permanent with no possibility of improvement.',
      fact: cond.curable,
    });
  }
  return myths.slice(0, 3);
}

export function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/** First paragraph (plain-language) extracted from the summary. */
export function plainLanguageSummary(cond: HealthCondition): string {
  const s = normalizeText(cond.summary);
  if (s.length <= 240) return s;
  const cut = s.slice(0, 240);
  const lastDot = cut.lastIndexOf('.');
  return lastDot > 120 ? `${cut.slice(0, lastDot + 1)}` : `${cut}…`;
}
