import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildRetrievalIndex,
  searchIndex,
  stemToken,
  tokenize,
  withinOneEdit,
  lazyIndex,
  type EngineDoc,
} from './ghRetrievalEngine';

const DOCS: EngineDoc<string>[] = [
  { id: '1', type: 'TOOL', title: 'BMI Calculator', keywords: 'calculator health tool body mass index', summary: 'Estimate body mass index from height and weight.', details: 'Output is an educational estimate, not a diagnosis.', ref: 'bmi' },
  { id: '2', type: 'TOOL', title: 'Calorie Needs Calculator', keywords: 'calculator nutrition macros', summary: 'Estimate daily calorie needs.', details: 'Uses activity level.', ref: 'calorie' },
  { id: '3', type: 'RECIPE', title: 'Vegetable Poha', keywords: 'recipe indian breakfast diabetic-friendly vegan', summary: 'A wholesome breakfast made with flattened rice.', details: '240 kcal, protein 8g.', ref: 'poha' },
  { id: '4', type: 'DISEASE', title: 'ST-elevation myocardial infarction', keywords: 'cardiology heart emergency', summary: 'A blockage of blood flow to the heart muscle.', details: 'Chest pain, sweating, breathlessness.', ref: 'stemi' },
  { id: '5', type: 'DISEASE', title: 'Hypertensive heart disease', keywords: 'cardiology heart', summary: 'Heart problems caused by high blood pressure.', details: 'Long-standing hypertension.', ref: 'hhd' },
  { id: '6', type: 'POLICY', title: 'Privacy Policy (overview)', keywords: 'privacy data consent rights retention', summary: 'How GlobalHealth handles personal and health information.', details: 'Includes consent withdrawal and retention.', ref: 'privacy' },
];

const index = buildRetrievalIndex(DOCS);

test('tokenizer normalises plurals, verb endings and drops stopwords', () => {
  assert.deepEqual(tokenize('What are the CALCULATORS?'), ['calculator']);
  assert.equal(stemToken('calculators'), 'calculator');
  assert.equal(stemToken('babies'), 'baby');
  assert.equal(stemToken('diagnosis'), 'diagnosis');
  assert.equal(stemToken('classes'), 'class');
  // Medical words ending in -is/-us must not lose their last letter.
  assert.equal(stemToken('tuberculosis'), 'tuberculosis');
});

test('edit distance guard accepts one edit and rejects two', () => {
  assert.equal(withinOneEdit('paracetamol', 'parcetamol'), true);
  assert.equal(withinOneEdit('paracetamol', 'paracetmol'), true);
  assert.equal(withinOneEdit('paracetamol', 'ibuprofen'), false);
  assert.equal(withinOneEdit('consent', 'content'), true);
});

test('exact title match ranks first', () => {
  const hits = searchIndex(index, 'bmi calculator');
  assert.equal(hits[0].doc.ref, 'bmi');
  assert.ok(hits[0].score > 0);
});

test('alias expansions find records the user did not name, without outranking exact words', () => {
  const hits = searchIndex(index, 'heart attack', { expansions: ['myocardial infarction'] });
  assert.equal(hits[0].doc.ref, 'stemi', 'the alias target should win over a generic "heart" record');
});

test('typo tolerance repairs an unknown term at edit distance 1', () => {
  const hits = searchIndex(index, 'calculater for calories');
  assert.ok(hits.some((h) => h.doc.ref === 'calorie'));
});

test('protected terms are never repaired into a different word', () => {
  const repaired = searchIndex(index, 'consent withdrawal');
  assert.ok(repaired.some((h) => h.doc.ref === 'privacy'));
  const protectedHits = searchIndex(index, 'consent', { protectedTerms: new Set(['consent']) });
  assert.ok(!protectedHits.some((h) => h.doc.ref === 'poha'));
});

test('identity gate: body-only word overlap never returns a record', () => {
  // "sweating" only exists in a details field, so nothing may match.
  const hits = searchIndex(index, 'sweating');
  assert.equal(hits.length, 0);
});

test('weak identity terms cannot pull in a record on their own', () => {
  const weak = new Set(['heart']);
  const hits = searchIndex(index, 'heart', { weakIdentityTerms: weak });
  assert.equal(hits.length, 0);
  const normal = searchIndex(index, 'heart');
  assert.ok(normal.length > 0);
});

test('term-coverage gate drops one-incidental-word matches', () => {
  const hits = searchIndex(index, 'myocardial infarction');
  assert.equal(hits[0].doc.ref, 'stemi');
  assert.ok(!hits.some((h) => h.doc.ref === 'hhd'), 'a record matching no query term must not appear');
});

test('type boosts express intent without inventing matches', () => {
  const plain = searchIndex(index, 'breakfast recipe');
  const boosted = searchIndex(index, 'breakfast recipe', { typeBoosts: { RECIPE: 3 } });
  assert.ok(boosted[0].doc.type === 'RECIPE');
  assert.ok(boosted[0].score > (plain[0]?.score ?? 0));
});

test('per-type caps keep results diverse', () => {
  const hits = searchIndex(index, 'calculator', { maxPerType: 1, limit: 5 });
  assert.equal(hits.filter((h) => h.doc.type === 'TOOL').length, 1);
});

test('nothing relevant returns nothing at all (no padding)', () => {
  assert.equal(searchIndex(index, 'zzqq xkvw gibberish').length, 0);
  assert.equal(searchIndex(index, '').length, 0);
});

test('lazyIndex builds once and reuses the same index', () => {
  let builds = 0;
  const get = lazyIndex<string>(() => {
    builds += 1;
    return DOCS;
  });
  get();
  get();
  assert.equal(builds, 1);
});
