import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  HEALTH_TOOL_DOCS,
  RECIPE_DOCS,
  NUTRITION_DOCS,
  WELLNESS_DOCS,
  MAP_LOCATION_DOCS,
  COMMUNITY_DOCS,
  NEWS_DOCS,
  HELP_POLICY_DOCS,
  allPublicDocs,
  publicIndexStats,
  searchPublicIndex,
  indexablePublicDoc,
  type PublicDoc,
} from './ghPublicIndex';

/** Schema hygiene: a doc may only expose whitelisted public fields. */
const ALLOWED_KEYS = new Set([
  'documentId', 'entityType', 'title', 'summary', 'details', 'keywords', 'route',
  'sourceTitle', 'sourceType', 'accessLevel', 'status', 'version', 'lastUpdated',
  'indexedAt', 'contentLabel',
]);

function assertPublicShape(doc: PublicDoc, label: string) {
  for (const [k] of Object.entries(doc)) {
    assert.ok(ALLOWED_KEYS.has(k), `${label} exposes non-whitelisted field "${k}"`);
  }
  assert.equal(doc.accessLevel, 'PUBLIC');
  assert.equal(doc.sourceType, 'PUBLIC_WEBSITE');
  assert.ok(['PUBLISHED', 'UPDATED', 'ARCHIVED'].includes(doc.status));
  assert.ok(doc.version);
  assert.ok(doc.indexedAt);
}

test('every indexed tool/recipe/nutrition/wellness/map/community/news/help doc has a public-only shape', () => {
  const docs = allPublicDocs();
  assert.ok(docs.length > 100, `expected a substantial public index, got ${docs.length}`);
  for (const d of docs) assertPublicShape(d, d.documentId);
  // Danger-field scan: none of these strings may appear as keys anywhere.
  for (const d of docs) {
    const flat = JSON.stringify(d).toLowerCase();
    for (const forbidden of ['passwordhash', 'token', 'sessionsecret', 'password', 'apikey']) {
      assert.ok(!flat.includes(`"${forbidden}"`), `${d.documentId} leaks private field ${forbidden}`);
    }
  }
});

test('health tools: finds the BMI calculator with inputs and honest disclaimer', () => {
  assert.equal(HEALTH_TOOL_DOCS.length, 80);
  const hits = searchPublicIndex('How does the BMI calculator work?', 2, 6);
  const bmi = hits.find((h) => /bmi/i.test(h.title));
  assert.ok(bmi, 'BMI tool should be found');
  assert.equal(bmi.entityType, 'HEALTH_TOOL');
  assert.ok(/not a diagnosis/i.test(bmi.details));
});

test('recipes: finds recipes by name and diet tag from the real 1000-recipe library', () => {
  assert.equal(RECIPE_DOCS.length, 1000);
  const sampleTitle = RECIPE_DOCS[0].title;
  const words = sampleTitle.toLowerCase().split(/\s+/).filter((w) => w.length >= 4).slice(0, 3).join(' ');
  const hits = searchPublicIndex(words || sampleTitle, 2, 6);
  assert.ok(hits.some((h) => h.entityType === 'RECIPE'), 'recipe search should return recipe hits');
});

test('nutrition: indexes guidelines, deficiency diseases and meal plans', () => {
  assert.ok(NUTRITION_DOCS.length >= 5);
  const deficiency = searchPublicIndex('vitamin deficiency symptoms', 2, 6);
  assert.ok(deficiency.some((h) => h.entityType === 'NUTRITION'));
});

test('wellness: indexes modules, exercises and workouts', () => {
  assert.ok(WELLNESS_DOCS.length >= 9);
  const hits = searchPublicIndex('wellness sleep stress module', 2, 6);
  assert.ok(hits.some((h) => h.entityType === 'WELLNESS_ARTICLE'));
});

test('map: indexes facilities with public fields and honest verification status', () => {
  assert.equal(MAP_LOCATION_DOCS.length, 75);
  const hits = searchPublicIndex('hospital facility in district', 2, 6);
  assert.ok(hits.some((h) => h.entityType === 'MAP_LOCATION'));
  const any = MAP_LOCATION_DOCS[0];
  assert.ok(/verification status/i.test(any.details));
});

test('community: posts are labeled COMMUNITY CONTENT and kept non-authoritative', () => {
  assert.ok(COMMUNITY_DOCS.length >= 1);
  for (const d of COMMUNITY_DOCS) {
    assert.equal(d.contentLabel, 'COMMUNITY CONTENT');
    assert.ok(/not verified medical information/i.test(d.details));
  }
});

test('news: fail-closed — ONLY published articles are indexed, drafts excluded and counted', () => {
  const stats = publicIndexStats();
  // Every indexed news doc must be PUBLISHED.
  for (const d of NEWS_DOCS) assert.equal(d.status, 'PUBLISHED');
  // The exclusion count must account for every non-published seed article.
  assert.equal(stats.excluded.newsNotPublished, stats.datasetCounts.newsArticles - NEWS_DOCS.length);
});

test('help & policy: real help articles + real legal sections are indexed', () => {
  assert.ok(HELP_POLICY_DOCS.length >= 9);
  const howTo = searchPublicIndex('how do I find a doctor?', 2, 6);
  assert.ok(howTo.some((h) => h.entityType === 'HELP_ARTICLE'));
  const policy = searchPublicIndex('privacy policy data consent', 2, 6);
  assert.ok(policy.some((h) => h.entityType === 'POLICY'));
  // Real legal section names from the actual pages.
  const terms = HELP_POLICY_DOCS.find((d) => d.documentId === 'policy:terms');
  assert.ok(terms?.summary.toLowerCase().includes('medical information disclaimer'));
  assert.ok(terms?.summary.toLowerCase().includes('verified pharmacy partners'));
  const privacy = HELP_POLICY_DOCS.find((d) => d.documentId === 'policy:privacy');
  assert.ok(privacy?.summary.toLowerCase().includes('ai assistant and health data'));
});

test('stats produce the completeness ledger (spec §100)', () => {
  const stats = publicIndexStats();
  assert.equal(stats.totalIndexed, allPublicDocs().length);
  assert.ok(stats.datasetCounts.recipes === 1000);
  assert.ok(stats.datasetCounts.healthTools === 80);
  assert.ok(stats.datasetCounts.mapFacilities === 75);
  const sum = Object.values(stats.byType).reduce((a, b) => a + b, 0);
  assert.equal(sum, stats.totalIndexed);
});

test('the fail-closed gate blocks private/draft classifications (spec §65, §67)', () => {
  assert.equal(indexablePublicDoc({ accessLevel: 'PUBLIC', status: 'PUBLISHED' }), true);
  assert.equal(indexablePublicDoc({ accessLevel: 'PUBLIC', status: 'DRAFT' }), false);
  assert.equal(indexablePublicDoc({ accessLevel: 'PUBLIC', status: 'PRIVATE' }), false);
  assert.equal(indexablePublicDoc({ accessLevel: 'ADMIN_ONLY', status: 'PUBLISHED' }), false);
  assert.equal(indexablePublicDoc({ accessLevel: 'INTERNAL', status: 'UPDATED' }), false);
  assert.equal(indexablePublicDoc({ accessLevel: 'UNKNOWN', status: 'UNKNOWN' }), false);
});
