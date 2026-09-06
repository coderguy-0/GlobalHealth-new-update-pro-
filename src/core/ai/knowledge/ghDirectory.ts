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
import { expandQueryWithAliases } from './ghAliases';

export interface DirectoryDoctor {
  id?: string;
  name: string;
  specialty?: string;
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

export interface DirectoryCatalog {
  doctors?: DirectoryDoctor[];
  hospitals?: DirectoryHospital[];
  pharmacyProducts?: DirectoryProduct[];
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

function doctorSnippet(d: DirectoryDoctor): DirectoryHit {
  const bits = [clean(d.specialty, 80), clean(d.departmentName, 80)].filter(Boolean);
  const details = [
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

function hospitalSnippet(h: DirectoryHospital): DirectoryHit {
  const bits = [clean(h.hospitalType, 60), clean(h.city, 60)].filter(Boolean);
  return {
    kind: 'hospital',
    entityId: h.id ? String(h.id) : undefined,
    name: clean(h.name, 120),
    source: 'GlobalHealth Hospital Directory (as listed)',
    summary: bits.length ? bits.join(' · ') : 'GlobalHealth-listed hospital',
    details: h.emergencyPhone ? `Listed emergency phone: ${clean(h.emergencyPhone, 24)}` : '',
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
  if (!catalog) return [];
  const expanded = expandSpecialties(expandQueryWithAliases(String(text || '')));
  const textLower = expanded.toLowerCase();
  const hits: DirectoryHit[] = [];

  for (const d of catalog.doctors ?? []) {
    if (hits.length >= maxHits) break;
    const specialty = clean(d.specialty, 80);
    const nameHit = nameIdentityMatch(d.name, textLower);
    // Specialty matches in full or through a distinctive specialty word
    // ("cardiologist" expands to cardiology/cardiothoracic via aliases).
    const specialtyHit =
      specialty.length > 3 && (textLower.includes(specialty.toLowerCase()) || strongTokenMatch(specialty, textLower));
    if (!nameHit && !specialtyHit) continue;
    if (hits.some((h) => h.name === d.name)) continue;
    hits.push(doctorSnippet(d));
  }

  for (const h of catalog.hospitals ?? []) {
    if (hits.length >= maxHits) break;
    const nameHit = nameIdentityMatch(h.name, textLower);
    const cityHit = Boolean(h.city && matches(h.city, textLower) && textLower.includes('hospital'));
    if (!nameHit && !cityHit) continue;
    if (hits.some((x) => x.name === h.name)) continue;
    hits.push(hospitalSnippet(h));
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
    if (hits.some((x) => x.name === p.name)) continue;
    hits.push(productSnippet(p));
  }

  return hits.slice(0, maxHits);
}

