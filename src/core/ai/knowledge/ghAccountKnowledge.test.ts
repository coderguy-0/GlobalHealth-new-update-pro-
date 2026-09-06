import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ACCOUNT_DOCS, retrieveAccountKnowledge } from './ghAccountKnowledge';

test('account knowledge is CLOSED for guests (no session, no records)', () => {
  for (const q of [
    'what is on my health dashboard',
    'show me my appointments',
    'my health records',
    'my activity history',
  ]) {
    assert.equal(retrieveAccountKnowledge(q, false).length, 0, `guest must get nothing for "${q}"`);
  }
});

test('signed-in callers get the matching account FEATURE record', () => {
  const dash = retrieveAccountKnowledge('what is on my health dashboard', true);
  assert.ok(dash.some((h) => /dashboard/i.test(h.doc.ref.title)));

  const appt = retrieveAccountKnowledge('how do I reschedule an appointment', true);
  assert.ok(appt.some((h) => h.doc.ref.route === 'appointments'));

  const consent = retrieveAccountKnowledge('how do I withdraw consent for doctor access', true);
  assert.ok(consent.some((h) => /consent/i.test(h.doc.ref.title)));
});

test('records describe features only — no personal data may exist in this layer', () => {
  const flat = JSON.stringify(ACCOUNT_DOCS);
  // No credential/identifier VALUES may appear (the text may of course discuss
  // the concept of a password, e.g. "never asks for passwords").
  assert.ok(!/[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(flat), 'no email addresses');
  assert.ok(!/\b[0-9a-f]{16,}\b/i.test(flat), 'no token-like hex strings');
  assert.ok(!/\b\d{6,}\b/.test(flat), 'no long numeric identifiers');
  assert.ok(!/(patient id|mrn|ssn|aadhaar)/i.test(flat), 'no identifier fields');
  for (const d of ACCOUNT_DOCS) {
    assert.equal(d.accessLevel, 'AUTHENTICATED');
    assert.equal(d.status, 'PUBLISHED');
    assert.ok(d.route, 'every record points at a real app route');
    assert.ok(d.sourceTitle.startsWith('GlobalHealth →'));
  }
});

test('every account record points at a REAL authenticated route', () => {
  const REAL_ROUTES = new Set(['dashboard', 'appointments', 'privacy', 'my-history', 'ai-assistant']);
  for (const d of ACCOUNT_DOCS) {
    assert.ok(REAL_ROUTES.has(d.route), `${d.documentId} points at unknown route "${d.route}"`);
  }
});

test('irrelevant questions return nothing even when signed in', () => {
  assert.equal(retrieveAccountKnowledge('zzqq xkvw gibberish', true).length, 0);
  assert.equal(retrieveAccountKnowledge('', true).length, 0);
});
