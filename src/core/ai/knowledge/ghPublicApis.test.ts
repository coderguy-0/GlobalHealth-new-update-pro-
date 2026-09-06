import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PUBLIC_API_INVENTORY, apiInventoryStats } from './ghPublicApis';

const SERVER_TS = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', 'server.ts'),
  'utf8'
);

test('every inventoried API path really exists in server.ts (no invented endpoints)', () => {
  for (const api of PUBLIC_API_INVENTORY) {
    assert.ok(
      SERVER_TS.includes(`'${api.path}`) || SERVER_TS.includes(`"${api.path}`),
      `API path "${api.path}" was not found in server.ts — inventory must match reality`
    );
  }
});

test('classification counts are coherent and protection is explicit', () => {
  const stats = apiInventoryStats();
  assert.equal(stats.total, PUBLIC_API_INVENTORY.length);
  assert.equal(
    stats.indexedViaCanonicalData + stats.excluded,
    stats.total,
    'every endpoint is either public-scope or explicitly excluded'
  );
  // Private user surfaces must never be public scope.
  for (const api of PUBLIC_API_INVENTORY) {
    if (api.path.startsWith('/api/me') || api.path.startsWith('/api/ai/conversations')) {
      assert.equal(api.aiScope, 'EXCLUDED_PRIVATE', `${api.path} must be excluded private`);
      assert.notEqual(api.access, 'PUBLIC');
    }
  }
  // Role surfaces must be classified to their role.
  const doctor = PUBLIC_API_INVENTORY.find((a) => a.path === '/api/doctor');
  assert.equal(doctor?.access, 'DOCTOR_ONLY');
  const hospital = PUBLIC_API_INVENTORY.find((a) => a.path === '/api/hospital-portal');
  assert.equal(hospital?.access, 'HOSPITAL_ONLY');
  const pharmacy = PUBLIC_API_INVENTORY.find((a) => a.path === '/api/pharmacy-partner');
  assert.equal(pharmacy?.access, 'PHARMACY_ONLY');
});
