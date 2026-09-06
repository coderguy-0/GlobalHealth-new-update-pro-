/* ============================================================================
   GlobalHealth AI — local verified knowledge retrieval.

   This is a small RAG-style lookup over the platform's existing, reviewed
   clinical content (medicines, diseases, medical tests). It lets the model
   anchor answers in source metadata instead of hallucinating facts.

   It is intentionally conservative:
   - Only exact name/generic-name matches are returned.
   - Never invents availability, price, dosage for a patient, or a diagnosis.
   - Each hit carries a `source` label so the answer can be labelled
     "verified GlobalHealth platform data".
   ========================================================================== */

import { ALL_400_MEDICINES } from '../../data/medicines/index';
import { ALL_DISEASES } from '../../data/diseases/diseaseIndex';
import { ALL_1000_MEDICAL_TESTS } from '../../data/medicalTests/index';
import { aliasExpansions } from './knowledge/ghAliases';
import { EngineDoc, lazyIndex, searchIndex } from './knowledge/ghRetrievalEngine';

export interface KnowledgeSource {
  kind: 'medicine' | 'disease' | 'test' | 'doctor' | 'hospital' | 'pharmacy-product';
  name: string;
  source: string;
  summary: string;
  details: string;
}

export interface KnowledgeResult {
  hits: KnowledgeSource[];
  /** Bounded prompt fragment describing verified data, or empty. */
  context: string;
}

const MAX_HITS = 3;

/* --------------------------------------------------------------------------
   Ranked clinical index (BM25F over the verified libraries).

   Names, generic names, abbreviations and alternative names are the identity
   fields; descriptions/symptoms add recall but can never pull in a record on
   their own (the engine's identity gate). This replaces the old first-match
   scan, so "heart attack" returns the myocardial-infarction record FIRST
   instead of whichever record happened to appear earlier in the array.
   -------------------------------------------------------------------------- */

type ClinicalRef =
  | { kind: 'medicine'; item: (typeof ALL_400_MEDICINES)[number] }
  | { kind: 'disease'; item: (typeof ALL_DISEASES)[number] }
  | { kind: 'test'; item: (typeof ALL_1000_MEDICAL_TESTS)[number] };

const join = (...parts: unknown[]): string =>
  parts
    .flat()
    .map((p) => String(p ?? '').trim())
    .filter(Boolean)
    .join(' ');

const clinicalIndex = lazyIndex<ClinicalRef>(() => {
  const docs: EngineDoc<ClinicalRef>[] = [];

  for (const m of ALL_400_MEDICINES) {
    docs.push({
      id: `medicine:${m.id ?? m.name}`,
      type: 'medicine',
      title: m.name,
      keywords: join(m.genericName, m.therapeuticGroup, (m as any).category, (m as any).alternatives),
      summary: join(m.description || m.whatIs),
      details: join((m as any).uses, (m as any).dosageForms),
      ref: { kind: 'medicine', item: m },
    });
  }

  for (const d of ALL_DISEASES) {
    const name = d.title || (d as any).medicalName || (d as any).commonName || '';
    if (!name) continue;
    docs.push({
      id: `disease:${(d as any).id ?? name}`,
      type: 'disease',
      title: name,
      keywords: join((d as any).medicalName, (d as any).commonName, (d as any).category, (d as any).specialist, (d as any).bodySystem, (d as any).diseaseType),
      summary: join(d.summary),
      details: join((d as any).earlySymptoms, (d as any).commonSymptoms, (d as any).symptoms, (d as any).causes),
      ref: { kind: 'disease', item: d },
    });
  }

  for (const t of ALL_1000_MEDICAL_TESTS) {
    if (!t.name) continue;
    docs.push({
      id: `test:${(t as any).id ?? t.name}`,
      type: 'test',
      title: t.name,
      keywords: join((t as any).commonName, (t as any).abbreviation, (t as any).alternativeNames, (t as any).category, (t as any).subcategory),
      summary: join((t as any).clinicalPurpose || t.purpose || (t as any).description),
      details: join((t as any).whatItMeasures, (t as any).whyOrdered, (t as any).specimenType || t.sampleType),
      ref: { kind: 'test', item: t },
    });
  }

  return docs;
});

function medicineSnippet(m: (typeof ALL_400_MEDICINES)[number]): KnowledgeSource {
  const details = [
    m.description || m.whatIs || '',
    m.uses?.length ? `Common uses: ${m.uses.slice(0, 4).join('; ')}` : '',
    m.therapeuticGroup ? `Therapeutic group: ${m.therapeuticGroup}` : '',
    m.prescriptionStatus ? `Prescription status: ${m.prescriptionStatus}` : '',
    m.warnings ? `Safety note: ${m.warnings}` : '',
    // Publicly listed common side effects (spec PART 21) — capped, verbatim.
    (m as any).commonSideEffects?.length
      ? `Common side effects (as listed): ${(m as any).commonSideEffects.slice(0, 4).join('; ')}`
      : (m as any).sideEffects?.length
        ? `Side effects (as listed): ${(m as any).sideEffects.slice(0, 4).join('; ')}`
        : '',
    (m as any).faqs?.length ? `${(m as any).faqs.length} clinical FAQs on its GlobalHealth page` : '',
  ]
    .filter(Boolean)
    .join(' ');
  return {
    kind: 'medicine',
    name: m.name,
    source: 'GlobalHealth Verified Medicine Library',
    summary: m.description || m.whatIs || m.name,
    details,
  };
}

function diseaseSnippet(d: (typeof ALL_DISEASES)[number]): KnowledgeSource {
  // Relationship graph (spec PART 19/20): the specialty that manages this
  // condition and the key public facts shown on the disease page are placed
  // FIRST so long symptom lists can never crowd them out of the bounded block.
  const relations = [
    (d as any).specialist ? `Related specialty (as listed): ${(d as any).specialist}` : '',
    (d as any).severity ? `Severity (as listed): ${(d as any).severity}` : '',
    d.contagious !== undefined && d.contagious !== null ? `Contagious (as listed): ${d.contagious}` : '',
    typeof (d as any).vaccineAvailable === 'boolean' ? `Vaccine available: ${(d as any).vaccineAvailable ? 'yes' : 'no'}` : '',
  ].filter(Boolean);
  const details = [
    d.summary || '',
    ...relations,
    d.symptoms?.length ? `Common associated symptoms: ${d.symptoms.slice(0, 6).join('; ')}` : '',
    d.whenToSeeDoctor ? `When to see a doctor: ${d.whenToSeeDoctor}` : '',
    d.whenToSeekEmergencyCare ? `Emergency signs: ${d.whenToSeekEmergencyCare}` : '',
  ]
    .filter(Boolean)
    .join(' ');
  return {
    kind: 'disease',
    name: d.title || d.medicalName || d.commonName || 'Condition',
    source: 'GlobalHealth Verified Disease & Condition Library',
    summary: d.summary || '',
    details: String(details).slice(0, 1200),
  };
}

function testSnippet(t: (typeof ALL_1000_MEDICAL_TESTS)[number]): KnowledgeSource {
  const cap = (v: unknown, n: number): string => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
  const details = [
    t.purpose || t.description || t.overview || '',
    t.normalRange ? `Reference range: ${t.normalRange}` : '',
    t.preparation ? `Preparation: ${t.preparation}` : '',
    t.sampleType ? `Sample type: ${t.sampleType}` : '',
    (t as any).timeToResults ? `Turnaround (as listed): ${cap((t as any).timeToResults, 40)}` : '',
    // Interpretation education from the page (spec PART 22) — capped, verbatim.
    (t as any).highInterpretation ? `High results (as listed): ${cap((t as any).highInterpretation, 160)}` : '',
    (t as any).lowInterpretation ? `Low results (as listed): ${cap((t as any).lowInterpretation, 160)}` : '',
    t.whenNotInterpretedAlone?.length ? `Not to be interpreted alone: ${t.whenNotInterpretedAlone.slice(0, 3).join('; ')}` : '',
  ]
    .filter(Boolean)
    .join(' ');
  return {
    kind: 'test',
    name: t.name,
    source: 'GlobalHealth Verified Lab Test Library',
    summary: t.purpose || t.description || t.name,
    details,
  };
}

export interface VerifiedRetrievalOptions {
  /** Minimum BM25F score a record must reach (precision dial). */
  minScore?: number;
  /** Max records of one kind (medicine/disease/test). */
  maxPerKind?: number;
}

/**
 * Platform vocabulary. A clinical record that matched ONLY these words is a
 * coincidence ("hospitals near me" must not return hospital-acquired
 * pneumonia), so such hits are dropped.
 */
const WEAK_CLINICAL_TERMS = new Set([
  'blood', 'test', 'level', 'profile', 'panel', 'function', 'general',
  'complete', 'disease', 'disorder', 'infection', 'syndrome', 'screening',
  'index', 'ratio', 'total', 'high', 'low', 'normal', 'acute', 'chronic',
  'serum', 'urine', 'body', 'health', 'medicine', 'medication', 'drug',
  'tablet', 'dose', 'result', 'report', 'range', 'value', 'assay', 'study',
]);

const PLATFORM_ONLY_TERMS = new Set([
  'hospital', 'doctor', 'clinic', 'appointment', 'book', 'booking', 'page',
  'section', 'website', 'site', 'app', 'near', 'nearby', 'stock', 'price',
  'cost', 'fee', 'buy', 'order', 'account', 'login', 'signin', 'map',
  'news', 'recipe', 'calculator', 'tool', 'community', 'profile', 'search',
  'find', 'open', 'use', 'available', 'availability',
]);

/**
 * Real words that belong to the product, not to medicine. They are never
 * "repaired" into a clinical term (so "consent" can never become "content").
 */
const NON_CLINICAL_TERMS = new Set([
  'consent', 'privacy', 'policy', 'terms', 'account', 'password', 'login',
  'signin', 'signup', 'profile', 'settings', 'dashboard', 'appointment',
  'booking', 'notification', 'message', 'upload', 'download', 'delete',
  'website', 'section', 'page', 'button', 'filter', 'search', 'history',
  'recipe', 'calculator', 'community', 'partner', 'order', 'cart', 'price',
  'refund', 'support', 'contact', 'article', 'news',
]);

/** Ranked hits with their scores (used by composition + the eval harness). */
export function rankVerifiedKnowledge(
  text: string,
  maxHits = MAX_HITS,
  options: VerifiedRetrievalOptions = {}
): { hit: KnowledgeSource; score: number }[] {
  const query = String(text || '');
  if (!query.trim()) return [];
  // Alias-aware retrieval (spec §96): layman phrases ("heart attack") are
  // expanded with their clinical terms ("myocardial infarction") before
  // ranking. Expansions score below the user's own words.
  const scored = searchIndex(clinicalIndex(), query, {
    limit: maxHits * 2,
    maxPerType: options.maxPerKind ?? 2,
    minScore: options.minScore ?? 6,
    relativeCutoff: 0.3,
    expansions: aliasExpansions(query),
    weakIdentityTerms: WEAK_CLINICAL_TERMS,
    protectedTerms: NON_CLINICAL_TERMS,
  });

  const out: { hit: KnowledgeSource; score: number }[] = [];
  const seen = new Set<string>();
  for (const s of scored) {
    if (out.length >= maxHits) break;
    if (s.matched.every((t) => PLATFORM_ONLY_TERMS.has(t))) continue;
    const ref = s.doc.ref;
    const hit =
      ref.kind === 'medicine'
        ? medicineSnippet(ref.item)
        : ref.kind === 'disease'
          ? diseaseSnippet(ref.item)
          : testSnippet(ref.item);
    const key = `${hit.kind}:${hit.name.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ hit, score: s.score });
  }
  return out;
}

export function retrieveVerifiedKnowledge(
  text: string,
  maxHits = MAX_HITS,
  options: VerifiedRetrievalOptions = {}
): KnowledgeResult {
  const hits = rankVerifiedKnowledge(text, maxHits, options).map((r) => r.hit);

  const limited = hits.slice(0, maxHits);
  const retrievedAt = new Date().toISOString().slice(0, 10);
  const context = limited.length
    ? `\nVERIFIED GLOBALHEALTH PLATFORM DATA FOUND (retrieved ${retrievedAt}):\n${limited
        .map((h, i) => `${i + 1}. [${h.source}] ${h.name} — ${h.summary} ${h.details}`.trim())
        .join('\n')}\nOnly use the details above for verified claims, and attribute them ("GlobalHealth currently shows…"). If the user asks about availability, price, dosage for their body, or anything not in this verified block, clearly state that you do not have verified information.`
    : 'No verified GlobalHealth clinical record was matched for this query. If asked for specific medicine availability, price, doctor/hospital availability or personal results, explicitly state that you do not have verified information instead of inventing it.';

  return { hits: limited, context };
}
