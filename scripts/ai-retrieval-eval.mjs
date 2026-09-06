#!/usr/bin/env node
/**
 * GlobalHealth AI — Retrieval Evaluation Harness ("did the training work?").
 *
 * The assistant is grounded, not fine-tuned: its answer quality is decided by
 * whether the right GlobalHealth record reaches the prompt. This harness runs a
 * golden set of realistic questions through the SAME retrieval path the server
 * uses (`retrievePublicKnowledge`) and measures:
 *
 *   hit@1  — the expected record is the top hit
 *   hit@3  — the expected record is in the top 3
 *   recall — the expected record appears anywhere in the retrieved context
 *   noise  — questions that must return NOTHING but returned something
 *
 * Run:  npm run ai:eval
 * Exit code is non-zero if quality drops below the thresholds at the bottom,
 * so this can be used as a regression gate in CI.
 */

import { retrievePublicKnowledge } from '../src/core/ai/knowledge/ghPublicSearch.ts';
import { INITIAL_PORTAL_DOCTORS, INITIAL_HOSPITALS, INITIAL_DEPARTMENTS } from '../src/data/hospitalInitialData.ts';
import { PHARMACY_PRODUCTS } from '../src/data/pharmacyProductsData.ts';

const CATALOG = {
  doctors: INITIAL_PORTAL_DOCTORS,
  hospitals: INITIAL_HOSPITALS,
  pharmacyProducts: PHARMACY_PRODUCTS,
  departments: INITIAL_DEPARTMENTS,
};

/**
 * Golden set. `expect` is matched against the retrieved hit names/titles.
 * `kind` (optional) additionally requires the matching hit to be of that kind.
 * `auth` marks questions asked by a signed-in user.
 */
const GOLDEN = [
  // --- verified clinical libraries -----------------------------------------
  { q: 'What happens during a heart attack?', expect: /myocardial infarction/i, kind: 'disease' },
  { q: 'Tell me about essential hypertension', expect: /essential hypertension/i, kind: 'disease' },
  { q: 'what is dengue fever', expect: /dengue/i, kind: 'disease' },
  { q: 'I keep getting migraines', expect: /migraine/i, kind: 'disease' },
  { q: 'is tuberculosis curable', expect: /tuberculosis/i, kind: 'disease' },
  { q: 'type 2 diabetes information', expect: /type 2 diabetes/i, kind: 'disease' },
  { q: 'paracetamol uses and side effects', expect: /paracetamol/i },
  { q: 'parcetamol dosage', expect: /paracetamol/i },
  { q: 'what is metformin used for', expect: /metformin/i, kind: 'medicine' },
  { q: 'amoxicillin precautions', expect: /amoxicillin/i, kind: 'medicine' },
  { q: 'cbc test meaning', expect: /complete blood count/i, kind: 'test' },
  { q: 'what does a lipid profile measure', expect: /lipid/i, kind: 'test' },
  { q: 'thyroid stimulating hormone test', expect: /thyroid|tsh/i, kind: 'test' },
  // NOTE: the lab library has no dedicated HbA1c record today; retrieval is
  // expected to fall back to the closest verified record / the HbA1c tool.
  { q: 'hba1c test explanation', expect: /hba1c|glycated|glycosylated|hemoglobin/i },

  // --- health tools ---------------------------------------------------------
  { q: 'How does the BMI calculator work?', expect: /bmi calculator/i, kind: 'HEALTH_TOOL' },
  { q: 'is there a calculator for my daily calorie needs', expect: /calorie/i, kind: 'HEALTH_TOOL' },
  { q: 'pregnancy due date calculator', expect: /due date|pregnancy/i, kind: 'HEALTH_TOOL' },
  { q: 'calculate my heart disease risk', expect: /risk/i, kind: 'HEALTH_TOOL' },

  // --- recipes / nutrition / wellness ---------------------------------------
  { q: 'give me a diabetic friendly recipe', expect: /.+/, kind: 'RECIPE' },
  { q: 'high protein vegetarian recipe ideas', expect: /.+/, kind: 'RECIPE' },
  { q: 'vitamin d deficiency symptoms', expect: /vitamin d/i },
  { q: 'what are the dietary guidelines', expect: /dietary guidelines/i, kind: 'NUTRITION' },
  { q: 'meal plan for weight loss', expect: /meal plan/i, kind: 'NUTRITION' },
  { q: 'how do I manage stress and sleep better', expect: /stress|sleep/i },
  { q: 'exercise for building strength', expect: /.+/, kind: 'EXERCISE' },

  // --- directories / map ----------------------------------------------------
  { q: 'I need a cardiologist', expect: /.+/, kind: 'doctor' },
  { q: 'show me hospitals in delhi', expect: /.+/ },
  { q: 'find a hospital near me on the map', expect: /.+/, kind: 'MAP_LOCATION' },

  // --- help / policy / navigation ------------------------------------------
  { q: 'how do I find a doctor on this website', expect: /find a doctor/i, kind: 'HELP_ARTICLE' },
  { q: 'how do I buy medicine here', expect: /buying medicines|medicine information/i },
  { q: 'what does the privacy policy say about my data', expect: /privacy policy/i, kind: 'POLICY' },
  { q: 'what are the terms and conditions', expect: /terms/i, kind: 'POLICY' },
  { q: 'what do I need an account for', expect: /signing in|sign in/i, kind: 'HELP_ARTICLE' },
  { q: 'how do I read my lab test report', expect: /lab test/i },

  // --- news / community -----------------------------------------------------
  { q: 'latest health news articles', expect: /.+/, kind: 'NEWS' },
  { q: 'community discussion about diabetes', expect: /.+/, kind: 'COMMUNITY_POST' },

  // --- signed-in account features ------------------------------------------
  { q: 'what is on my health dashboard', expect: /dashboard/i, kind: 'ACCOUNT_FEATURE', auth: true },
  { q: 'how do I reschedule my appointment', expect: /appointment/i, kind: 'ACCOUNT_FEATURE', auth: true },
  { q: 'how do I withdraw consent for doctor access', expect: /privacy|consent/i, kind: 'ACCOUNT_FEATURE', auth: true },
  { q: 'where can I see my activity history', expect: /history/i, kind: 'ACCOUNT_FEATURE', auth: true },

  // --- guest privacy boundary (must NOT surface account knowledge) ----------
  { q: 'what is on my health dashboard', expectNone: 'ACCOUNT_FEATURE' },

  // --- must return nothing (never fabricate) --------------------------------
  { q: 'zzqq xkvw totally unrelated gibberish', expectEmpty: true },
  { q: 'what is the capital of france', expectEmpty: true },
];

let hit1 = 0;
let hit3 = 0;
let recall = 0;
let scored = 0;
let noise = 0;
let noiseChecks = 0;
const failures = [];

for (const row of GOLDEN) {
  const result = retrievePublicKnowledge(row.q, { directoryCatalog: CATALOG, authenticated: row.auth === true });
  const hits = result.hits;

  if (row.expectEmpty) {
    noiseChecks += 1;
    if (hits.length) {
      noise += 1;
      failures.push(`NOISE   "${row.q}" → ${hits.slice(0, 2).map((h) => `${h.kind}:${h.name}`).join(', ')}`);
    }
    continue;
  }

  if (row.expectNone) {
    noiseChecks += 1;
    const leaked = hits.filter((h) => h.kind === row.expectNone);
    if (leaked.length) {
      noise += 1;
      failures.push(`LEAK    "${row.q}" → ${leaked.map((h) => h.name).join(', ')}`);
    }
    continue;
  }

  scored += 1;
  const match = (h) => row.expect.test(h.name) && (!row.kind || h.kind === row.kind);
  const idx = hits.findIndex(match);
  if (idx === 0) hit1 += 1;
  if (idx >= 0 && idx < 3) hit3 += 1;
  if (idx >= 0) recall += 1;
  else failures.push(`MISS    "${row.q}" → ${hits.length ? hits.slice(0, 3).map((h) => `${h.kind}:${h.name}`).join(', ') : 'nothing retrieved'}`);
}

const pct = (n, d) => (d ? `${((n / d) * 100).toFixed(1)}%` : 'n/a');

console.log('================================================================');
console.log('GLOBALHEALTH AI — RETRIEVAL EVALUATION (grounding quality)');
console.log(`Generated: ${new Date().toISOString()}`);
console.log('================================================================\n');
console.log(`Golden questions scored:      ${scored}`);
console.log(`  hit@1 (top result correct): ${hit1}/${scored}  ${pct(hit1, scored)}`);
console.log(`  hit@3                     : ${hit3}/${scored}  ${pct(hit3, scored)}`);
console.log(`  recall (found at all)     : ${recall}/${scored}  ${pct(recall, scored)}`);
console.log(`\nNegative checks (must stay silent / private): ${noiseChecks}`);
console.log(`  violations                : ${noise}`);

if (failures.length) {
  console.log('\nFailures:');
  for (const f of failures) console.log(`  ${f}`);
} else {
  console.log('\nNo failures.');
}

// Regression gate.
const MIN_RECALL = 0.9;
const MIN_HIT3 = 0.85;
const ok = recall / scored >= MIN_RECALL && hit3 / scored >= MIN_HIT3 && noise === 0;
console.log(`\nGate: recall >= ${MIN_RECALL * 100}%, hit@3 >= ${MIN_HIT3 * 100}%, violations = 0 → ${ok ? 'PASS' : 'FAIL'}`);
console.log('================================================================');
process.exit(ok ? 0 : 1);
