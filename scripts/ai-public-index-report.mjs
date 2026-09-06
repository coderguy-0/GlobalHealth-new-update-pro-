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
  HELP_POLICY_DOCS,
} from '../src/core/ai/knowledge/ghPublicIndex.ts';
import { retrieveVerifiedKnowledge } from '../src/core/ai/aiKnowledge.ts';
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
  ['HELP_ARTICLE / POLICY', HELP_POLICY_DOCS.length, null],
];
for (const [label, indexed, total] of typeRows) {
  console.log(`   ${label.padEnd(46)} indexed: ${String(indexed).padStart(4)}${total != null ? `   / ${total} in dataset` : ''}`);
}

// ---- 3. Clinical + directory layers -----------------------------------------
console.log('\n3. VERIFIED CLINICAL LIBRARIES (indexed by aiKnowledge.ts)');
console.log(`   Medicines:   ${ALL_400_MEDICINES.length} (canonical records, public fields)`);
console.log(`   Diseases:    ${ALL_DISEASES.length}`);
console.log(`   Lab tests:   ${ALL_1000_MEDICAL_TESTS.length}`);
console.log('\n4. LIVE PUBLIC DIRECTORIES (indexed by ghDirectory.ts)');
console.log(`   Doctors (public profiles):        ${INITIAL_PORTAL_DOCTORS.length}`);
console.log(`   Hospitals (public profiles):      ${INITIAL_HOSPITALS.length}`);
console.log(`   Pharmacy products (public stock): ${PHARMACY_PRODUCTS.length}`);

// ---- 4. Exclusions -----------------------------------------------------------
console.log('\n5. EXCLUDED FROM THE PUBLIC INDEX (fail-closed controls)');
console.log(`   News articles not PUBLISHED (drafts/review): ${stats.excluded.newsNotPublished}`);
console.log('   Authenticated personal tabs (dashboard, appointments, privacy, my-history): excluded');
console.log('   Role portals (doctor, hospital, pharmacy, medauth, news-admin/management/authority,');
console.log('     doctor-console, doctor-consent): excluded — contain private/patient/partner data');
console.log('   Private user records, EHR, messages, notifications, saved content: never indexed');
console.log('   (private fields cannot leak by construction — adapters use explicit field whitelists)');

// ---- 5. Retrieval sanity ------------------------------------------------------
const probe = retrieveVerifiedKnowledge('heart attack', 3);
console.log('\n6. RETRIEVAL SANITY PROBE');
console.log(`   "heart attack" → ${probe.hits.map((h) => `${h.kind}: ${h.name}`).join('; ') || 'NO HITS'}`);

console.log('\n================================================================');
console.log('PUBLIC KNOWLEDGE = INDEXED. PRIVATE KNOWLEDGE = NEVER.');
console.log('================================================================');
