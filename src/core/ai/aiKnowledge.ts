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

export interface KnowledgeSource {
  kind: 'medicine' | 'disease' | 'test';
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

function nameMatches(name: string, text: string): boolean {
  const n = name.trim().toLowerCase();
  if (!n || n.length < 3) return false;
  return text.includes(n);
}

function medicineSnippet(m: (typeof ALL_400_MEDICINES)[number]): KnowledgeSource {
  const details = [
    m.description || m.whatIs || '',
    m.uses?.length ? `Common uses: ${m.uses.slice(0, 4).join('; ')}` : '',
    m.therapeuticGroup ? `Therapeutic group: ${m.therapeuticGroup}` : '',
    m.prescriptionStatus ? `Prescription status: ${m.prescriptionStatus}` : '',
    m.warnings ? `Safety note: ${m.warnings}` : '',
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
  const details = [
    d.summary || '',
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
    details,
  };
}

function testSnippet(t: (typeof ALL_1000_MEDICAL_TESTS)[number]): KnowledgeSource {
  const details = [
    t.purpose || t.description || t.overview || '',
    t.normalRange ? `Reference range: ${t.normalRange}` : '',
    t.preparation ? `Preparation: ${t.preparation}` : '',
    t.sampleType ? `Sample type: ${t.sampleType}` : '',
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

export function retrieveVerifiedKnowledge(text: string, maxHits = MAX_HITS): KnowledgeResult {
  const clean = String(text || '').toLowerCase();
  const hits: KnowledgeSource[] = [];
  const seen = new Set<string>();

  for (const m of ALL_400_MEDICINES) {
    if (hits.filter((h) => h.kind === 'medicine').length >= 2) break;
    if (!nameMatches(m.name, clean) && !nameMatches(m.genericName || '', clean)) continue;
    const key = `med:${m.name.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    hits.push(medicineSnippet(m));
  }

  for (const d of ALL_DISEASES) {
    if (hits.filter((h) => h.kind === 'disease').length >= Math.min(2, maxHits)) break;
    const name = d.title || d.medicalName || d.commonName || '';
    if (!nameMatches(name, clean) && !nameMatches(d.medicalName || '', clean)) continue;
    const key = `dis:${name.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    hits.push(diseaseSnippet(d));
  }

  for (const t of ALL_1000_MEDICAL_TESTS) {
    if (hits.filter((h) => h.kind === 'test').length >= Math.min(2, maxHits)) break;
    if (!nameMatches(t.name, clean)) continue;
    const key = `test:${t.name.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    hits.push(testSnippet(t));
  }

  const limited = hits.slice(0, maxHits);
  const context = limited.length
    ? `\nVERIFIED GLOBALHEALTH PLATFORM DATA FOUND:\n${limited
        .map((h, i) => `${i + 1}. [${h.source}] ${h.name} — ${h.summary} ${h.details}`.trim())
        .join('\n')}\nOnly use the details above for verified claims. If the user asks about availability, price, dosage for their body, or anything not in this verified block, clearly state that you do not have verified information.`
    : 'No verified GlobalHealth clinical record was matched for this query. If asked for specific medicine availability, price, doctor/hospital availability or personal results, explicitly state that you do not have verified information instead of inventing it.';

  return { hits: limited, context };
}
