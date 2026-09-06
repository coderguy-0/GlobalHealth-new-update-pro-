#!/usr/bin/env node
// GlobalHealth AI — Public Knowledge Index Report (spec §100).
//
// Prints the machine-generated completeness ledger: every public route,
// every indexed public entity type, record counts, and everything that was
// discovered but deliberately EXCLUDED — with the reason.
//
// Run:  npm run ai:report

import {
  PUBLIC_ROUTE_INVENTORY,
  indexableRoutes,
  excludedRoutes,
  routeInventoryStats,
} from '../src/core/ai/knowledge/ghPublicRoutes.ts';
import {
  publicIndexStats,
  HEALTH_TOOL_DOCS,
  RECIPE_DOCS,
  NUTRITION_DOCS,
  WELLNESS_DOCS,
  MAP_LOCATION_DOCS,
  COMMUNITY_DOCS,
  NEWS_DOCS,
  MEDICINE_FAQ_DOCS,
  HELP_POLICY_DOCS,
} from '../src/core/ai/knowledge/ghPublicIndex.ts';
import { PUBLIC_API_INVENTORY, apiInventoryStats } from '../src/core/ai/knowledge/ghPublicApis.ts';
import { ACCOUNT_DOCS, retrieveAccountKnowledge } from '../src/core/ai/knowledge/ghAccountKnowledge.ts';
import { retrieveVerifiedKnowledge } from '../src/core/ai/aiKnowledge.ts';
import { retrievePublicKnowledge } from '../src/core/ai/knowledge/ghPublicSearch.ts';
import { ALL_400_MEDICINES } from '../src/data/medicines/index.ts';
import { ALL_DISEASES } from '../src/data/diseases/diseaseIndex.ts';
import { ALL_1000_MEDICAL_TESTS } from '../src/data/medicalTests/index.ts';
import { ALL_1000_RECIPES } from '../src/data/recipes/index.ts';
import { ALL_CALCULATORS } from '../src/data/calculatorsData.ts';
import { MEDICAL_MAP_FACILITIES } from '../src/data/medicalMapData.ts';
import { FORUM_POSTS } from '../src/data/forumPosts.ts';
import { INITIAL_NEWS_ARTICLES } from '../src/data/newsManagementData.ts';
import { INITIAL_PORTAL_DOCTORS, INITIAL_HOSPITALS } from '../src/data/hospitalInitialData.ts';
import { PHARMACY_PRODUCTS } from '../src/data/pharmacyProductsData.ts';

console.log('================================================================');
console.log('GLOBALHEALTH AI — PUBLIC WEBSITE KNOWLEDGE INDEX REPORT');
console.log(`Generated: ${new Date().toISOString()}`);
console.log('================================================================\n');

// ---- 1. Routes -------------------------------------------------------------
const rs = routeInventoryStats();
console.log('1. PUBLIC ROUTE INVENTORY');
console.log(`   Total discovered routes:      ${rs.totalRoutes}`);
console.log(`   PUBLIC (AI-indexable):        ${rs.publicRoutes}`);
console.log(`   AUTHENTICATED (excluded):     ${rs.byAccess.AUTHENTICATED}`);
console.log(`   ROLE_PROTECTED (excluded):    ${rs.byAccess.ROLE_PROTECTED}`);
console.log('\n   Public routes indexed:');
for (const r of indexableRoutes()) console.log(`     ✓ /${r.route.padEnd(18)} ${r.title}`);
console.log('\n   Routes discovered but EXCLUDED from the public index:');
for (const r of excludedRoutes()) console.log(`     ✗ /${r.route.padEnd(18)} ${r.exclusionReason}`);

// ---- 2. Public entities -----------------------------------------------------
const stats = publicIndexStats();
console.log('\n2. PUBLIC CONTENT INDEX (unified public content layer)');
console.log(`   Total public documents indexed: ${stats.totalIndexed}`);
const typeRows = [
  ['HEALTH_TOOL (calculators)', HEALTH_TOOL_DOCS.length, ALL_CALCULATORS.length],
  ['RECIPE', RECIPE_DOCS.length, ALL_1000_RECIPES.length],
  ['NUTRITION (guidelines/deficiency/meal plans)', NUTRITION_DOCS.length, null],
  ['WELLNESS_ARTICLE / EXERCISE / WORKOUT', WELLNESS_DOCS.length, null],
  ['MAP_LOCATION', MAP_LOCATION_DOCS.length, MEDICAL_MAP_FACILITIES.length],
  ['COMMUNITY_POST (labeled COMMUNITY CONTENT)', COMMUNITY_DOCS.length, FORUM_POSTS.length],
  ['NEWS (published only)', NEWS_DOCS.length, INITIAL_NEWS_ARTICLES.length],
  ['FAQ (real Clinical FAQs from medicine pages)', MEDICINE_FAQ_DOCS.length, 1600],
  ['HELP_ARTICLE / POLICY', HELP_POLICY_DOCS.length, null],
];
let coverageNum = 0;
let coverageDen = 0;
for (const [label, indexed, total] of typeRows) {
  const pct = total != null ? Math.round((indexed / total) * 100) : null;
  if (pct != null) { coverageNum += indexed; coverageDen += total; }
  console.log(`   ${label.padEnd(46)} indexed: ${String(indexed).padStart(4)}${total != null ? `   / ${total}  (${pct}%)` : ''}`);
}

// ---- API inventory ----------------------------------------------------------
const apis = apiInventoryStats();
console.log('\n3. PUBLIC API INVENTORY (classified from server.ts; test-verified paths)');
console.log(`   Inventoried endpoints: ${apis.total}`);
for (const [access, count] of Object.entries(apis.byAccess)) {
  console.log(`     ${access.padEnd(18)} ${count}`);
}
console.log(`   Public-scope (indexed via canonical data): ${apis.indexedViaCanonicalData}`);
console.log(`   Explicitly excluded (private/role/internal): ${apis.excluded}`);

// ---- 4. Clinical + directory layers -----------------------------------------
console.log('\n4. VERIFIED CLINICAL LIBRARIES (indexed by aiKnowledge.ts)');
console.log(`   Medicines:   ${ALL_400_MEDICINES.length} (canonical records, public fields)`);
console.log(`   Diseases:    ${ALL_DISEASES.length}`);
console.log(`   Lab tests:   ${ALL_1000_MEDICAL_TESTS.length}`);
console.log('\n   Live relationships: doctor→affiliated hospital, hospital→departments,');
console.log('   disease→related specialty / severity / contagiousness / vaccine facts.');
console.log('\n5. LIVE PUBLIC DIRECTORIES (indexed by ghDirectory.ts)');
console.log(`   Doctors (public profiles):        ${INITIAL_PORTAL_DOCTORS.length}`);
console.log(`   Hospitals (public profiles):      ${INITIAL_HOSPITALS.length}`);
console.log(`   Pharmacy products (public stock): ${PHARMACY_PRODUCTS.length}`);

// ---- 6. Exclusions -----------------------------------------------------------
console.log('\n6. EXCLUDED FROM THE PUBLIC INDEX (fail-closed controls)');
console.log(`   News articles not PUBLISHED (drafts/review): ${stats.excluded.newsNotPublished}`);
console.log('   Authenticated personal tabs (dashboard, appointments, privacy, my-history): excluded');
console.log('   Role portals (doctor, hospital, pharmacy, medauth, news-admin/management/authority,');
console.log('     doctor-console, doctor-consent): excluded — contain private/patient/partner data');
console.log('   Private user records, EHR, messages, notifications, saved content: never indexed');
console.log('   (private fields cannot leak by construction — adapters use explicit field whitelists)');

// ---- 6b. Signed-in (account) knowledge layer ---------------------------------
console.log('\n6b. ACCOUNT FEATURE LAYER (signed-in callers only — ghAccountKnowledge.ts)');
console.log(`   Feature records: ${ACCOUNT_DOCS.length} (${ACCOUNT_DOCS.map((d) => d.route).join(', ')})`);
console.log(`   Guest retrieval returns: ${retrieveAccountKnowledge('what is on my dashboard', false).length} records (must be 0)`);
console.log(`   Signed-in retrieval returns: ${retrieveAccountKnowledge('what is on my dashboard', true).length} record(s)`);
console.log('   These records describe FEATURES only. A specific user\'s values are');
console.log('   resolved per-request from the validated session (aiUserContext.ts).');

// ---- 7. Retrieval sanity ------------------------------------------------------
const probes = ['heart attack', 'parcetamol dosage', 'bmi calculator', 'privacy policy data deletion'];
const probeCatalog = {
  doctors: INITIAL_PORTAL_DOCTORS,
  hospitals: INITIAL_HOSPITALS,
  pharmacyProducts: PHARMACY_PRODUCTS,
};
console.log('\n7. RETRIEVAL SANITY PROBES (what actually reaches the prompt)');
for (const q of probes) {
  const probe = retrievePublicKnowledge(q, { directoryCatalog: probeCatalog });
  const top = probe.hits.slice(0, 3).map((h) => `${h.kind}: ${h.name}`).join('; ');
  console.log(`   "${q}" → ${top || 'nothing retrieved (the assistant must say it does not know)'}`);
  if (probe.diagnostics.droppedLayers.length) {
    console.log(`       layers dropped as off-topic: ${probe.diagnostics.droppedLayers.join(', ')}`);
  }
}
console.log('   Full grounding quality is measured by: npm run ai:eval');

// ---- 8. Coverage score --------------------------------------------------------
const routeCoverage = Math.round((rs.publicRoutes / rs.totalRoutes) * 100);
const contentCoverage = Math.round((coverageNum / coverageDen) * 100);
console.log('\n8. PUBLIC KNOWLEDGE COVERAGE SCORE');
console.log(`   Route coverage (public / discovered):        ${rs.publicRoutes}/${rs.totalRoutes} = ${routeCoverage}% (rest excluded with reasons)`);
console.log(`   Entity/document coverage (typed datasets):   ${coverageNum}/${coverageDen} = ${contentCoverage}%`);
console.log(`   Total records indexed across all layers:     ${stats.totalIndexed + ALL_400_MEDICINES.length + ALL_DISEASES.length + ALL_1000_MEDICAL_TESTS.length + INITIAL_PORTAL_DOCTORS.length + INITIAL_HOSPITALS.length + PHARMACY_PRODUCTS.length}`);

console.log('\n================================================================');
console.log('PUBLIC KNOWLEDGE = INDEXED. PRIVATE KNOWLEDGE = NEVER.');
console.log('================================================================');
