import { test } from 'node:test';
import assert from 'node:assert/strict';
import { retrieveVerifiedKnowledge } from './aiKnowledge';

// Integration-level retrieval tests over the REAL platform libraries
// (400 medicines, 500 diseases, 1000 lab tests). These lock in the
// alias-aware, token-aware matching behaviors against live data.

test('layman phrase "heart attack" retrieves the real myocardial infarction records', () => {
  const { hits } = retrieveVerifiedKnowledge('What happens during a heart attack?', 3);
  assert.ok(hits.some((h) => h.kind === 'disease' && /myocardial infarction/i.test(h.name)));
});

test('"hypertension" retrieves Essential hypertension from the disease library', () => {
  const { hits } = retrieveVerifiedKnowledge('What is hypertension?', 3);
  assert.ok(hits.some((h) => h.kind === 'disease' && /essential hypertension/i.test(h.name)));
  // Token matching must stay precise: generic "blood" words must not drag in
  // unrelated entries like an arterial blood gas test.
  assert.ok(!hits.some((h) => /arterial blood gas/i.test(h.name)));
});

test('generic medicine names are found in the verified medicine library', () => {
  const { hits } = retrieveVerifiedKnowledge('paracetamol uses and precautions', 3);
  assert.ok(hits.some((h) => h.kind === 'medicine' && /paracetamol/i.test(h.name)));
});

test('unmatched queries honestly report that nothing verified was found', () => {
  const { hits, context } = retrieveVerifiedKnowledge('zxqv strange nonexistent thing', 3);
  assert.equal(hits.length, 0);
  assert.ok(context.includes('No verified GlobalHealth clinical record was matched'));
});

test('disease enrichment surfaces the managing specialty and public facts (PART 19/20)', () => {
  const { hits } = retrieveVerifiedKnowledge('Essential hypertension', 3);
  const dis = hits.find((h) => h.kind === 'disease');
  assert.ok(dis, 'disease hit expected');
  const joined = `${dis.summary} ${dis.details}`;
  assert.ok(/related specialty/i.test(joined), 'disease snippet should carry the related specialty');
});

test('lab test enrichment adds real fields and NEVER fabricates absent ones (PART 22, PART 20)', () => {
  const { hits } = retrieveVerifiedKnowledge('Total Bilirubin', 3);
  const tst = hits.find((h) => h.kind === 'test');
  assert.ok(tst, 'test hit expected');
  // Real enrichment: the turnaround listed on the page appears verbatim.
  assert.ok(/turnaround/i.test(tst.details), 'turnaround (a real field) should appear');
  // Anti-fabrication: no test record publishes high/low interpretation fields
  // today, so the snippet must NOT invent them.
  assert.ok(!/high results/i.test(tst.details), 'must not invent absent interpretation fields');
});

test('every hit carries a source label for attribution (spec §47, §92)', () => {
  const { hits } = retrieveVerifiedKnowledge('paracetamol', 3);
  for (const h of hits) {
    assert.ok(h.source.startsWith('GlobalHealth'), `hit ${h.name} must carry a GlobalHealth source label`);
  }
});
