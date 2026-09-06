/* ============================================================================
   GlobalHealth AI — platform directory retrieval (spec §17-21, §46, §61).

   Retrieves REAL entities from GlobalHealth's own directories — doctors,
   hospitals and verified pharmacy partner products — so the assistant can
   answer "find a cardiologist" or "is X in stock?" from live application data
   instead of model memory.

   Hard rules:
   - The datasets are passed in by the server (already imported there); this
     module stays decoupled from the data layer.
   - Stock status is reported EXACTLY as the data says. in_stock → "IN STOCK",
     low_stock → "LOW STOCK", out_of_stock → "OUT OF STOCK", anything else →
     "UNKNOWN". Unknown is never upgraded to in stock (spec §13, §61).
   - Every hit carries a source label and entity id (spec §47, §117).
   ========================================================================== */

import { KnowledgeSource } from '../aiKnowledge';
import { aliasExpansions } from './ghAliases';
import { EngineDoc, buildRetrievalIndex, searchIndex } from './ghRetrievalEngine';

export interface DirectoryDoctor {
  id?: string;
  name: string;
  specialty?: string;
  hospitalId?: string;
  subspecialty?: string;
  departmentName?: string;
  experienceYears?: number;
  consultationFee?: number;
  opdSchedule?: string;
  status?: string;
}

export interface DirectoryHospital {
  id?: string;
  name: string;
  city?: string;
  hospitalType?: string;
  ownership?: string;
  emergencyPhone?: string;
}

export interface DirectoryProduct {
  id?: string;
  name: string;
  brandName?: string;
  genericName?: string;
  strength?: string;
  dosageForm?: string;
  price?: number;
  prescriptionRequired?: boolean;
  availability?: string;
  pharmacyPartnerName?: string;
}

export interface DirectoryDepartment {
  hospitalId?: string;
  name?: string;
}

export interface DirectoryCatalog {
  doctors?: DirectoryDoctor[];
  hospitals?: DirectoryHospital[];
  pharmacyProducts?: DirectoryProduct[];
  /** Hospital departments — enables the HOSPITAL → HAS_DEPARTMENT relation. */
  departments?: DirectoryDepartment[];
}

export type DirectoryKind = 'doctor' | 'hospital' | 'pharmacy-product';

export interface DirectoryHit extends KnowledgeSource {
  kind: DirectoryKind;
  entityId?: string;
}

const clean = (v: unknown, max = 90): string =>
  String(v ?? '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/[<>{}]/g, '')
    .trim()
    .slice(0, max);

/** Stock status is mapped 1:1 from the data — never upgraded (spec §61). */
export function stockLabel(availability: unknown): string {
  switch (String(availability ?? '').toLowerCase()) {
    case 'in_stock':
      return 'IN STOCK';
    case 'low_stock':
      return 'LOW STOCK';
    case 'out_of_stock':
      return 'OUT OF STOCK';
    default:
      return 'UNKNOWN';
  }
}

function doctorSnippet(d: DirectoryDoctor, hospitalName?: string): DirectoryHit {
  const bits = [clean(d.specialty, 80), clean(d.departmentName, 80)].filter(Boolean);
  const details = [
    hospitalName ? `Affiliated hospital (as listed): ${hospitalName}` : '',
    d.experienceYears ? `Experience: ${d.experienceYears} years` : '',
    d.consultationFee ? `Consultation fee (as listed): ${d.consultationFee}` : '',
    d.opdSchedule ? `OPD schedule (as listed): ${clean(d.opdSchedule, 80)}` : '',
  ]
    .filter(Boolean)
    .join(' · ');
  return {
    kind: 'doctor',
    entityId: d.id ? String(d.id) : undefined,
    name: clean(d.name, 100),
    source: 'GlobalHealth Doctor Directory (as listed)',
    summary: bits.length ? bits.join(' · ') : 'GlobalHealth-listed doctor',
    details,
  };
}

function hospitalSnippet(h: DirectoryHospital, departmentNames?: string[]): DirectoryHit {
  const bits = [clean(h.hospitalType, 60), clean(h.city, 60)].filter(Boolean);
  return {
    kind: 'hospital',
    entityId: h.id ? String(h.id) : undefined,
    name: clean(h.name, 120),
    source: 'GlobalHealth Hospital Directory (as listed)',
    summary: bits.length ? bits.join(' · ') : 'GlobalHealth-listed hospital',
    details: [
      h.emergencyPhone ? `Listed emergency phone: ${clean(h.emergencyPhone, 24)}` : '',
      departmentNames?.length ? `Departments (as listed): ${departmentNames.slice(0, 5).join('; ')}` : '',
    ]
      .filter(Boolean)
      .join(' · '),
  };
}

function productSnippet(p: DirectoryProduct): DirectoryHit {
  const stock = stockLabel(p.availability);
  const ident = [clean(p.brandName, 60), clean(p.genericName, 60), clean(p.strength, 30), clean(p.dosageForm, 30)]
    .filter(Boolean)
    .join(' · ');
  const details = [
    `Stock status: ${stock}`,
    typeof p.price === 'number' && p.price > 0 ? `Listed price: ${p.price}` : '',
    p.pharmacyPartnerName ? `Verified partner: ${clean(p.pharmacyPartnerName, 80)}` : '',
    p.prescriptionRequired ? 'Prescription required: yes' : '',
  ]
    .filter(Boolean)
    .join(' · ');
  return {
    kind: 'pharmacy-product',
    entityId: p.id ? String(p.id) : undefined,
    name: clean(p.name, 120),
    source: 'GlobalHealth Verified Pharmacy Partner listing (live stock as reported)',
    summary: ident || clean(p.name, 100),
    details,
  };
}

// Strong single-token identity: one distinctive word (e.g. "paracetamol",
// "cetirizine") is enough to identify a product users refer to generically.
const strongTokenMatch = (name: string, text: string): boolean =>
  nameTokens(name).some((t) => t.length >= 5 && new RegExp(`\\b${t}\\b`).test(text));

// Layman specialist names → the specialty words real directory records use
// (spec §76: query normalization, e.g. "cardiologist" → cardiology). Only
// expands the search text; it never changes what the data says.
const SPECIALTY_ALIASES: Record<string, string[]> = {
  cardiologist: ['cardiology', 'cardiothoracic', 'cardiac', 'heart'],
  'heart doctor': ['cardiology', 'cardiothoracic', 'cardiac', 'heart'],
  neurologist: ['neurology', 'neuro', 'brain', 'stroke'],
  dermatologist: ['dermatology', 'skin'],
  pediatrician: ['pediatric', 'paediatric', 'child'],
  oncologist: ['oncology', 'cancer'],
  orthopedic: ['orthopedics', 'orthopaedics', 'bone', 'joint'],
  gynecologist: ['gynecology', 'gynaecology', 'obstetric'],
  'kidney doctor': ['nephrology', 'renal', 'kidney'],
  urologist: ['urology', 'urinary'],
  'ent specialist': ['ent', 'ear', 'nose', 'throat'],
};

function expandSpecialties(text: string): string {
  let out = text;
  for (const [phrase, aliases] of Object.entries(SPECIALTY_ALIASES)) {
    if (out.includes(phrase)) out = `${out} ${aliases.join(' ')}`;
  }
  return out;
}

const matches = (haystack: string, text: string): boolean => {
  const n = haystack.trim().toLowerCase();
  return n.length >= 3 && text.includes(n);
};

// Name-identity matching: people and facilities are written with variable
// titles and suffixes ("Prof. Dr. Vikram Sethi", "…Research Center"), so a
// plain substring check is too strict. Instead, require a strong fraction of
// the entity's significant name tokens to appear in the query.
const NAME_TITLE_WORDS = new Set(['dr', 'prof', 'professor', 'mr', 'mrs', 'ms', 'shri']);
const nameTokens = (name: string): string[] =>
  String(name || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 && !NAME_TITLE_WORDS.has(t));

const nameIdentityMatch = (name: string, text: string): boolean => {
  const tokens = nameTokens(name);
  if (!tokens.length) return false;
  // Whole-word matching only — partial overlaps inside longer words do not
  // count as identity.
  const found = tokens.filter((t) => new RegExp(`\\b${t}\\b`).test(text)).length;
  return found / tokens.length >= 0.6;
};

/**
 * Finds up to maxHits directory entities whose name/specialty/city/product
 * identity appears in the (alias-expanded) query text.
 */
export function retrieveDirectoryKnowledge(
  text: string,
  maxHits = 3,
  catalog: DirectoryCatalog | null | undefined
): DirectoryHit[] {
  return retrieveDirectoryKnowledgeScored(text, maxHits, catalog).map((h) => h.hit);
}

/**
 * Same retrieval, with a relevance score per hit. Exact identity matches keep
 * their precision-first behaviour (high score); remaining slots are filled by
 * the shared BM25F engine, which adds ranking and typo tolerance
 * ("cardiologst", "apolo hospital") without loosening the identity rules.
 */
export function retrieveDirectoryKnowledgeScored(
  text: string,
  maxHits = 3,
  catalog: DirectoryCatalog | null | undefined
): { hit: DirectoryHit; score: number }[] {
  if (!catalog) return [];
  // Identity matching uses the user's own words plus SPECIALTY normalisation
  // only. Clinical alias expansion ("bmi" → "body mass index") must not leak
  // in here: a device whose name contains "Index" is not a BMI calculator.
  const textLower = expandSpecialties(String(text || '').toLowerCase());
  const hits: { hit: DirectoryHit; score: number }[] = [];
  // Exact identity matches are precise but not automatically the BEST answer:
  // "tell me about paracetamol" is a library question, "is Dolo in stock" is a
  // directory question. This score keeps exact directory hits well above weak
  // engine matches while letting a strong verified-library match lead.
  const EXACT_SCORE = 20;

  // Relationship lookups (spec PART 19): hospitalId → hospital name, and
  // hospitalId → department names. Real application links only.
  const hospitalNameById = new Map<string, string>();
  for (const h of catalog.hospitals ?? []) {
    if (h.id) hospitalNameById.set(String(h.id), clean(h.name, 120));
  }
  const departmentsByHospital = new Map<string, string[]>();
  for (const dep of catalog.departments ?? []) {
    if (!dep.hospitalId || !dep.name) continue;
    const list = departmentsByHospital.get(String(dep.hospitalId)) ?? [];
    if (list.length < 8) list.push(clean(dep.name, 60));
    departmentsByHospital.set(String(dep.hospitalId), list);
  }

  for (const d of catalog.doctors ?? []) {
    if (hits.length >= maxHits) break;
    const specialty = clean(d.specialty, 80);
    const nameHit = nameIdentityMatch(d.name, textLower);
    // Specialty matches in full or through a distinctive specialty word
    // ("cardiologist" expands to cardiology/cardiothoracic via aliases).
    const specialtyHit =
      specialty.length > 3 && (textLower.includes(specialty.toLowerCase()) || strongTokenMatch(specialty, textLower));
    if (!nameHit && !specialtyHit) continue;
    if (hits.some((h) => h.hit.name === d.name)) continue;
    hits.push({
      hit: doctorSnippet(d, d.hospitalId ? hospitalNameById.get(String(d.hospitalId)) : undefined),
      score: EXACT_SCORE,
    });
  }

  for (const h of catalog.hospitals ?? []) {
    if (hits.length >= maxHits) break;
    const nameHit = nameIdentityMatch(h.name, textLower);
    const cityHit = Boolean(h.city && matches(h.city, textLower) && textLower.includes('hospital'));
    if (!nameHit && !cityHit) continue;
    if (hits.some((x) => x.hit.name === h.name)) continue;
    hits.push({
      hit: hospitalSnippet(h, h.id ? departmentsByHospital.get(String(h.id)) : undefined),
      score: EXACT_SCORE,
    });
  }

  for (const p of catalog.pharmacyProducts ?? []) {
    if (hits.length >= maxHits) break;
    // Products are identified by any of: product name, brand, or generic —
    // full phrase, strong token overlap, or one distinctive generic word
    // (users say "paracetamol", never "Paracetamol IP 650mg Tablets").
    const identityHit =
      matches(p.name, textLower) ||
      nameIdentityMatch(p.name, textLower) ||
      matches(p.brandName || '', textLower) ||
      strongTokenMatch(p.brandName || '', textLower) ||
      matches(p.genericName || '', textLower) ||
      strongTokenMatch(p.genericName || '', textLower);
    if (!identityHit) continue;
    if (hits.some((x) => x.hit.name === p.name)) continue;
    hits.push({ hit: productSnippet(p), score: EXACT_SCORE });
  }

  // Ranked fallback: fill any remaining slots with engine matches (typo
  // tolerant, relevance ordered). Identity still has to come from the record's
  // own name/specialty/brand fields — nothing new is invented here.
  if (hits.length < maxHits) {
    const engineHits = searchIndex(buildDirectoryIndex(catalog, hospitalNameById, departmentsByHospital), String(text || ''), {
      limit: maxHits * 2,
      maxPerType: maxHits,
      minScore: 6,
      relativeCutoff: 0.35,
      expansions: aliasExpansions(String(text || '')),
      weakIdentityTerms: WEAK_DIRECTORY_TERMS,
    });
    for (const e of engineHits) {
      if (hits.length >= maxHits) break;
      if (hits.some((x) => x.hit.name === e.doc.ref.name)) continue;
      hits.push({ hit: e.doc.ref, score: e.score });
    }
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, maxHits);
}

/**
 * Category words are not identity: "Nowhere Hospital" must never match a real
 * hospital just because both contain the word "hospital".
 */
const WEAK_DIRECTORY_TERMS = new Set([
  'doctor', 'specialist', 'physician', 'hospital', 'clinic', 'center',
  'centre', 'institute', 'medical', 'medicine', 'pharmacy', 'chemist',
  'tablet', 'capsule', 'syrup', 'health', 'care', 'department', 'general',
  'dr', 'prof', 'professor', 'mr', 'mrs', 'ms', 'shri', 'product', 'partner',
  'news', 'article', 'latest', 'india', 'city', 'service', 'services',
]);

/** Engine index over the live directory records handed in by the server. */
function buildDirectoryIndex(
  catalog: DirectoryCatalog,
  hospitalNameById: Map<string, string>,
  departmentsByHospital: Map<string, string[]>
) {
  const docs: EngineDoc<DirectoryHit>[] = [];
  for (const d of catalog.doctors ?? []) {
    const hit = doctorSnippet(d, d.hospitalId ? hospitalNameById.get(String(d.hospitalId)) : undefined);
    docs.push({
      id: `doctor:${d.id ?? d.name}`,
      type: 'doctor',
      title: clean(d.name, 100),
      keywords: [clean(d.specialty, 80), clean(d.subspecialty, 80), clean(d.departmentName, 80), 'doctor', 'specialist']
        .filter(Boolean)
        .join(' '),
      summary: hit.summary,
      details: hit.details,
      ref: hit,
    });
  }
  for (const h of catalog.hospitals ?? []) {
    const departments = h.id ? departmentsByHospital.get(String(h.id)) : undefined;
    const hit = hospitalSnippet(h, departments);
    docs.push({
      id: `hospital:${h.id ?? h.name}`,
      type: 'hospital',
      title: clean(h.name, 120),
      keywords: [clean(h.city, 60), clean(h.hospitalType, 60), clean(h.ownership, 60), 'hospital', ...(departments ?? [])]
        .filter(Boolean)
        .join(' '),
      summary: hit.summary,
      details: hit.details,
      ref: hit,
    });
  }
  for (const p of catalog.pharmacyProducts ?? []) {
    const hit = productSnippet(p);
    docs.push({
      id: `product:${p.id ?? p.name}`,
      type: 'pharmacy-product',
      title: clean(p.name, 120),
      keywords: [clean(p.brandName, 60), clean(p.genericName, 60), clean(p.dosageForm, 30), 'medicine', 'pharmacy']
        .filter(Boolean)
        .join(' '),
      summary: hit.summary,
      details: hit.details,
      ref: hit,
    });
  }
  return buildRetrievalIndex(docs);
}

