import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PUBLIC_ROUTE_INVENTORY,
  indexableRoutes,
  excludedRoutes,
  routeInventoryStats,
  isIndexablePublicRoute,
} from './ghPublicRoutes';

// The REAL route keys from src/App.tsx VALID_TABS (verbatim).
const REAL_APP_TABS = [
  'home', 'explore', 'diseases', 'medicines', 'medical-tests', 'nutrition', 'recipes', 'wellness',
  'calculators', 'ai-assistant', 'hospitals', 'doctors', 'appointments', 'medical-map', 'community',
  'news', 'news-admin', 'dashboard', 'hospital-portal', 'doctor-portal', 'medauth',
  'pharmacy-portal', 'privacy', 'doctor-consent', 'doctor-console', 'my-history', 'news-authority',
  'news-management', 'auth', 'terms', 'privacy-policy',
];

test('the inventory covers EVERY real app route exactly once (completeness §101)', () => {
  const inventoryRoutes = PUBLIC_ROUTE_INVENTORY.filter((r) => !r.route.includes('/:')).map((r) => r.route);
  for (const tab of REAL_APP_TABS) {
    assert.ok(inventoryRoutes.includes(tab), `route "${tab}" is missing from the inventory`);
  }
  for (const r of inventoryRoutes) {
    assert.ok(REAL_APP_TABS.includes(r), `inventory route "${r}" does not exist in the app`);
  }
  assert.equal(new Set(inventoryRoutes).size, inventoryRoutes.length, 'duplicate route entries');
  // Plus the documented deep-link pattern.
  assert.ok(PUBLIC_ROUTE_INVENTORY.some((r) => r.route === 'news/:articleId'));
});

test('access classification matches the app\'s REAL protection (spec §66)', () => {
  // App.tsx PROTECTED_TABS — must be AUTHENTICATED in the inventory.
  for (const tab of ['dashboard', 'appointments', 'privacy', 'my-history']) {
    const rec = PUBLIC_ROUTE_INVENTORY.find((r) => r.route === tab);
    assert.equal(rec?.access, 'AUTHENTICATED', `${tab} must be AUTHENTICATED`);
    assert.equal(rec?.indexable, false);
    assert.ok(rec?.exclusionReason);
  }
  // Role portals — must be ROLE_PROTECTED and excluded.
  for (const tab of ['hospital-portal', 'doctor-portal', 'medauth', 'pharmacy-portal', 'news-admin', 'news-management', 'news-authority', 'doctor-console', 'doctor-consent']) {
    const rec = PUBLIC_ROUTE_INVENTORY.find((r) => r.route === tab);
    assert.equal(rec?.access, 'ROLE_PROTECTED', `${tab} must be ROLE_PROTECTED`);
    assert.equal(rec?.indexable, false);
    assert.ok(rec?.exclusionReason);
  }
});

test('only PUBLIC routes are indexable (fail-closed §64-65)', () => {
  for (const r of indexableRoutes()) {
    assert.equal(r.access, 'PUBLIC');
    assert.equal(r.indexable, true);
  }
  assert.equal(indexableRoutes().length + excludedRoutes().length, PUBLIC_ROUTE_INVENTORY.length);
  const stats = routeInventoryStats();
  assert.equal(stats.publicRoutes + stats.excludedRoutes, stats.totalRoutes);
  assert.ok(stats.byAccess.PUBLIC >= 19);
  assert.ok(stats.byAccess.AUTHENTICATED === 4);
  assert.ok(stats.byAccess.ROLE_PROTECTED === 9);
});

test('fail-closed gate rejects unknown classifications', () => {
  assert.equal(isIndexablePublicRoute({ access: 'PUBLIC', indexable: true } as any, ), true);
  assert.equal(isIndexablePublicRoute({ access: 'UNKNOWN' as any, indexable: true } as any), false);
  assert.equal(isIndexablePublicRoute({ access: 'ADMIN_ONLY' as any, indexable: true } as any), false);
});
