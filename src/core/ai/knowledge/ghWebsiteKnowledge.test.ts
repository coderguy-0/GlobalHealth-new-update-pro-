import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  GH_NAVIGATION,
  GH_OVERVIEW,
  isPublished,
  publishedNavigation,
  buildWebsiteNavigationContext,
} from './ghWebsiteKnowledge';

// The REAL route keys from src/App.tsx VALID_TABS. This test fails if the
// knowledge layer ever references a section that does not exist in the app
// (anti-hallucination guard for navigation answers, spec §44/§63/§124).
const REAL_APP_TABS = new Set([
  'home', 'explore', 'diseases', 'medicines', 'medical-tests', 'nutrition', 'recipes', 'wellness',
  'calculators', 'ai-assistant', 'hospitals', 'doctors', 'appointments', 'medical-map', 'community',
  'news', 'news-admin', 'dashboard', 'hospital-portal', 'doctor-portal', 'medauth',
  'pharmacy-portal', 'privacy', 'doctor-consent', 'doctor-console', 'my-history', 'news-authority', 'news-management', 'auth', 'terms', 'privacy-policy'
]);

test('every navigation record points to a REAL app tab', () => {
  for (const record of GH_NAVIGATION) {
    assert.ok(record.tab, `${record.id} must declare a tab`);
    assert.ok(REAL_APP_TABS.has(record.tab), `${record.id} references non-existent tab "${record.tab}"`);
  }
});

test('the canonical platform overview matches the approved wording (spec §147)', () => {
  assert.ok(GH_OVERVIEW.startsWith('GlobalHealth is a digital healthcare platform'));
  assert.ok(GH_OVERVIEW.includes('diseases, medicines, laboratory tests, doctors, hospitals'));
  assert.ok(GH_OVERVIEW.includes('Authenticated users may also access personal features'));
});

test('draft/review content is filtered out of published navigation', () => {
  const all = [...GH_NAVIGATION];
  assert.ok(all.length > 10);
  // All seeded records are PUBLISHED; verify the filter respects statuses.
  for (const r of all) assert.ok(isPublished(r.status));
  assert.equal(publishedNavigation().length, all.length);
  assert.ok(!isPublished('DRAFT'));
  assert.ok(!isPublished('REVIEW'));
  assert.ok(!isPublished('ARCHIVED'));
});

test('navigation context lists only real sections with audience gating', () => {
  const ctx = buildWebsiteNavigationContext();
  assert.ok(ctx.includes('REAL GLOBALHEALTH SECTIONS'));
  assert.ok(ctx.includes('(section: diseases)'));
  assert.ok(ctx.includes('Signed-in personal sections'));
  assert.ok(ctx.includes('NAVIGATION ANSWER FORMAT'));
  // Must never leak a fake section.
  assert.ok(!ctx.includes('section: ai-meal-planner'));
  assert.ok(!ctx.includes('section: fake'));
});
