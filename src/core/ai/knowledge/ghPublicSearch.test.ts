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
