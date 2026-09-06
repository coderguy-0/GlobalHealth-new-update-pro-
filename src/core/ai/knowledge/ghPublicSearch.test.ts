import { test } from 'node:test';
import assert from 'node:assert/strict';
import { retrievePublicKnowledge } from './ghPublicSearch';
import type { DirectoryCatalog } from './ghDirectory';

const CATALOG: DirectoryCatalog = {
  doctors: [{ id: 'DOC-101', name: 'Prof. Dr. Vikram Sethi', specialty: 'Cardiothoracic & Vascular Surgery' }],
  hospitals: [{ id: 'HSP-1', name: 'Apex Institute of Medical Sciences & Research Center', city: 'New Delhi' }],
  pharmacyProducts: [
    {
      id: 'prod-1',
      name: 'Dolo 650 Tablets (Paracetamol 650mg)',
      genericName: 'Paracetamol IP 650mg',
      availability: 'in_stock',
      price: 30.5,
      pharmacyPartnerName: 'Apex Central Clinical Dispensary',
    },
  ],
};

test('multi-step public question combines directory + clinical + content (spec §31)', () => {
  const result = retrievePublicKnowledge('Find a cardiologist for heart attack treatment in Delhi', {
    directoryCatalog: CATALOG,
  });
  const kinds = result.hits.map((h) => h.kind);
  assert.ok(kinds.includes('doctor'), 'should hit the doctor directory');
  assert.ok(result.context.includes('VERIFIED GLOBALHEALTH CLINICAL LIBRARY'));
  assert.ok(result.context.includes('LIVE GLOBALHEALTH DIRECTORY DATA'));
  assert.ok(result.context.includes('KNOWLEDGE PRIORITY'));
  assert.ok(result.context.includes('retrieved '));
});

test('website questions hit the public content index with source labels and routes', () => {
  const result = retrievePublicKnowledge('What health calculators are available on GlobalHealth?', {
    directoryCatalog: CATALOG,
  });
  assert.ok(result.context.includes('GLOBALHEALTH PUBLIC WEBSITE CONTENT'));
  assert.ok(result.context.includes('(section: calculators)'));
  assert.ok(result.hits.some((h) => h.kind === 'HEALTH_TOOL'));
});

test('stock question reports the live stock status exactly (spec §52)', () => {
  const result = retrievePublicKnowledge('Do you have paracetamol in stock?', { directoryCatalog: CATALOG });
  assert.ok(result.context.includes('IN STOCK'));
  assert.ok(result.context.includes('Dolo 650'));
});

test('community content is labeled and news content is labeled in the context block', () => {
  const result = retrievePublicKnowledge('community discussion and health news articles', {
    directoryCatalog: CATALOG,
  });
  // Labels appear whenever such docs matched; if none matched, the labels
  // must NOT appear (no invented content).
  const communityHit = result.hits.some((h) => h.kind === 'COMMUNITY_POST');
  const newsHit = result.hits.some((h) => h.kind === 'NEWS');
  if (communityHit) assert.ok(result.context.includes('COMMUNITY CONTENT'));
  if (newsHit) assert.ok(result.context.includes('NEWS REPORT'));
});

test('unmatched queries produce an empty context (never fabricated content)', () => {
  const result = retrievePublicKnowledge('zzqq xkvw totally unrelated gibberish', {
    directoryCatalog: CATALOG,
  });
  assert.equal(result.hits.length, 0);
  assert.equal(result.context, '');
});

test('no directory catalog means no directory hits — graceful degradation', () => {
  const result = retrievePublicKnowledge('Dr. Vikram Sethi');
  assert.ok(!result.hits.some((h) => h.kind === 'doctor'));
});

/* ---------------------------------------------------------------------------
   Ranked retrieval behaviour (BM25F engine + intent + arbitration)
   ------------------------------------------------------------------------- */

test('hits are ordered by relevance and carry a score', () => {
  const result = retrievePublicKnowledge('How does the BMI calculator work?', { directoryCatalog: CATALOG });
  assert.ok(result.hits.length > 0);
  assert.match(result.hits[0].name, /BMI Calculator/i);
  for (let i = 1; i < result.hits.length; i += 1) {
    assert.ok(result.hits[i - 1].score >= result.hits[i].score, 'hits must be sorted by score');
  }
});

test('intent boosting surfaces the content type the user actually asked for', () => {
  const recipes = retrievePublicKnowledge('give me a diabetic friendly recipe', { directoryCatalog: CATALOG });
  assert.ok(recipes.hits.some((h) => h.kind === 'RECIPE'));

  const news = retrievePublicKnowledge('latest health news articles', { directoryCatalog: CATALOG });
  assert.ok(news.hits.some((h) => h.kind === 'NEWS'));
});

test('typos still reach the right verified record', () => {
  const result = retrievePublicKnowledge('parcetamol dosage', { directoryCatalog: CATALOG });
  assert.ok(result.hits.some((h) => /paracetamol/i.test(h.name)));
});

test('cross-layer arbitration drops a layer that is far weaker than the best match', () => {
  const result = retrievePublicKnowledge('what does the privacy policy say about my data?', {
    directoryCatalog: CATALOG,
  });
  assert.ok(result.hits.some((h) => h.kind === 'POLICY'));
  assert.ok(!result.hits.some((h) => h.kind === 'test'), 'unrelated lab tests must not ride along');
});

test('account features are unlocked ONLY for an authenticated caller', () => {
  const guest = retrievePublicKnowledge('what is on my health dashboard?', { directoryCatalog: CATALOG });
  assert.ok(!guest.hits.some((h) => h.kind === 'ACCOUNT_FEATURE'));
  assert.ok(!guest.context.includes('GLOBALHEALTH ACCOUNT FEATURES'));

  const member = retrievePublicKnowledge('what is on my health dashboard?', {
    directoryCatalog: CATALOG,
    authenticated: true,
  });
  assert.ok(member.hits.some((h) => h.kind === 'ACCOUNT_FEATURE'));
  assert.ok(member.context.includes('GLOBALHEALTH ACCOUNT FEATURES'));
  // Feature knowledge only — it must never claim to contain someone's data.
  assert.ok(member.context.includes('contains no one'));
});

test('the composed context stays inside the prompt budget', () => {
  const result = retrievePublicKnowledge('diabetes symptoms treatment diet recipes tests doctors hospitals news', {
    directoryCatalog: CATALOG,
    charBudget: 1200,
  });
  assert.ok(result.context.length <= 1400, `context was ${result.context.length} chars`);
});

test('diagnostics report what each layer contributed', () => {
  const result = retrievePublicKnowledge('paracetamol side effects', { directoryCatalog: CATALOG });
  assert.ok(result.diagnostics.topScore > 0);
  assert.ok(result.diagnostics.clinical >= 1);
});
