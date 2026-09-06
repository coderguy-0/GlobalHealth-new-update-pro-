#!/usr/bin/env node
/**
 * GlobalHealth AI — Doctor (end-to-end stack diagnosis).
 *
 * Answers one question: "why isn't the AI working / answering like it was
 * trained?" It checks the three independent stages of the assistant and tells
 * you exactly which one is broken:
 *
 *   STAGE 1  KNOWLEDGE   is the website indexed? (training data)
 *   STAGE 2  RETRIEVAL   does the right record reach the prompt? (grounding)
 *   STAGE 3  MODEL       is a generative provider configured and reachable?
 *
 * Stages 1 and 2 are owned by this repository. Stage 3 needs a provider API
 * key in the environment — without it every request to /api/ai-assistant
 * returns HTTP 503 and the UI says "The AI service is not configured on this
 * server yet", no matter how good the knowledge layer is.
 *
 * Run:  npm run ai:doctor            (add --live to make one real model call)
 */

import 'dotenv/config';
import { loadRuntimeConfig } from '../src/server/config.ts';
import { createAiProvider, AiProviderError } from '../src/server/aiProvider.ts';
import { retrievePublicKnowledge } from '../src/core/ai/knowledge/ghPublicSearch.ts';
import { publicIndexStats } from '../src/core/ai/knowledge/ghPublicIndex.ts';
import { ACCOUNT_DOCS } from '../src/core/ai/knowledge/ghAccountKnowledge.ts';
import { ALL_400_MEDICINES } from '../src/data/medicines/index.ts';
import { ALL_DISEASES } from '../src/data/diseases/diseaseIndex.ts';
import { ALL_1000_MEDICAL_TESTS } from '../src/data/medicalTests/index.ts';
import { INITIAL_PORTAL_DOCTORS, INITIAL_HOSPITALS, INITIAL_DEPARTMENTS } from '../src/data/hospitalInitialData.ts';
import { PHARMACY_PRODUCTS } from '../src/data/pharmacyProductsData.ts';

const LIVE = process.argv.includes('--live');
const ok = (s) => `  [ OK ]   ${s}`;
const bad = (s) => `  [FAIL]   ${s}`;
const warn = (s) => `  [WARN]   ${s}`;

console.log('================================================================');
console.log('GLOBALHEALTH AI — STACK DIAGNOSIS');
console.log(`Generated: ${new Date().toISOString()}`);
console.log('================================================================');

/* ---------------------------------------------------------------- STAGE 1 */
console.log('\nSTAGE 1 — KNOWLEDGE (is the website indexed?)');
const stats = publicIndexStats();
const clinicalTotal = ALL_400_MEDICINES.length + ALL_DISEASES.length + ALL_1000_MEDICAL_TESTS.length;
const directoryTotal = INITIAL_PORTAL_DOCTORS.length + INITIAL_HOSPITALS.length + PHARMACY_PRODUCTS.length;
console.log(ok(`Verified clinical library: ${clinicalTotal} records (medicines ${ALL_400_MEDICINES.length}, diseases ${ALL_DISEASES.length}, lab tests ${ALL_1000_MEDICAL_TESTS.length})`));
console.log(ok(`Public website content:    ${stats.totalIndexed} documents (${Object.keys(stats.byType).length} content types)`));
console.log(ok(`Live directories:          ${directoryTotal} records (doctors/hospitals/pharmacy stock)`));
console.log(ok(`Signed-in feature layer:   ${ACCOUNT_DOCS.length} records (unlocked only by a validated session)`));
const knowledgeOk = clinicalTotal > 0 && stats.totalIndexed > 0;

/* ---------------------------------------------------------------- STAGE 2 */
console.log('\nSTAGE 2 — RETRIEVAL (does the right record reach the prompt?)');
const CATALOG = {
  doctors: INITIAL_PORTAL_DOCTORS,
  hospitals: INITIAL_HOSPITALS,
  pharmacyProducts: PHARMACY_PRODUCTS,
  departments: INITIAL_DEPARTMENTS,
};
const PROBES = [
  ['What happens during a heart attack?', /myocardial infarction/i],
  ['parcetamol dosage', /paracetamol/i],
  ['How does the BMI calculator work?', /bmi calculator/i],
  ['what does the privacy policy say about my data', /privacy policy/i],
];
let retrievalOk = true;
for (const [q, expect] of PROBES) {
  const result = retrievePublicKnowledge(q, { directoryCatalog: CATALOG });
  const hit = result.hits.find((h) => expect.test(h.name));
  if (hit) console.log(ok(`"${q}" → ${hit.kind}: ${hit.name}`));
  else {
    retrievalOk = false;
    console.log(bad(`"${q}" → expected ${expect}, got ${result.hits.slice(0, 2).map((h) => h.name).join('; ') || 'nothing'}`));
  }
}
const sample = retrievePublicKnowledge('What happens during a heart attack?', { directoryCatalog: CATALOG });
console.log(`\n  Grounded context that WOULD be injected (first 600 chars of ${sample.context.length}):`);
console.log(
  sample.context
    .trim()
    .slice(0, 600)
    .split('\n')
    .map((l) => `    | ${l}`)
    .join('\n')
);
console.log('  (full grounding score: npm run ai:eval)');

/* ---------------------------------------------------------------- STAGE 3 */
console.log('\nSTAGE 3 — MODEL PROVIDER (can the server generate an answer?)');
const config = loadRuntimeConfig(process.env);
const warnings = Array.isArray(config.warnings) ? config.warnings : [];
const key = config.geminiApiKey;
console.log(`  Provider: ${config.aiProvider}   Model: ${config.aiModel}   Mode: ${config.nodeEnv}`);
let modelOk = false;
if (!key) {
  console.log(bad('GEMINI_API_KEY is EMPTY — no generative model is configured.'));
  console.log('           Consequence: POST /api/ai-assistant returns HTTP 503');
  console.log('           and the UI shows "The AI service is not configured on this');
  console.log('           server yet." The knowledge layer above is never used,');
  console.log('           because there is no model to hand it to.');
  console.log('           Fix: put GEMINI_API_KEY=<your key> in .env (git-ignored),');
  console.log('           or set it in your hosting provider\'s environment, then restart.');
} else {
  console.log(ok(`GEMINI_API_KEY present (${key.length} chars, ends "…${key.slice(-4)}")`));
  if (!LIVE) {
    console.log(warn('Skipped the live model call. Re-run with --live to verify the key really works.'));
    modelOk = true;
  } else {
    try {
      const provider = createAiProvider({ provider: config.aiProvider, model: config.aiModel, apiKey: key });
      const started = Date.now();
      const res = await provider.generateText({
        systemInstruction: 'You are a test harness. Reply with exactly: GLOBALHEALTH_OK',
        prompt: 'ping',
      });
      const text = (res.text || '').trim();
      if (text) {
        modelOk = true;
        console.log(ok(`Live call succeeded in ${Date.now() - started}ms → "${text.slice(0, 40)}"`));
      } else {
        console.log(bad('Live call returned an EMPTY response (key valid but model returned nothing).'));
      }
    } catch (err) {
      const code = err instanceof AiProviderError ? err.code : 'UNKNOWN';
      console.log(bad(`Live call failed (${code}): ${err?.message || err}`));
      console.log('           Common causes: invalid/expired key, billing not enabled,');
      console.log(`           model "${config.aiModel}" not available to this key, or blocked egress.`);
    }
  }
}
for (const w of warnings) console.log(warn(w));

/* ---------------------------------------------------------------- VERDICT */
console.log('\n----------------------------------------------------------------');
console.log('VERDICT');
console.log(`  Trained on the website (knowledge + retrieval): ${knowledgeOk && retrievalOk ? 'YES' : 'NO'}`);
console.log(`  Able to answer users right now (model configured): ${modelOk ? 'YES' : 'NO'}`);
if (knowledgeOk && retrievalOk && !modelOk) {
  console.log('\n  => The training is fine. The assistant is silent only because no');
  console.log('     generative model is configured/reachable. Set the API key and');
  console.log('     the same grounded context starts producing answers immediately.');
}
console.log('================================================================');
process.exit(knowledgeOk && retrievalOk ? 0 : 1);
