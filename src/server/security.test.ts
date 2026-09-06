import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pbkdf2Sync } from 'node:crypto';
import {
  hashSecret,
  verifySecret,
  verifyScrypt,
  verifyLegacyPbkdf2,
  derivedSaltFor,
  secureToken,
  generateTotpSecret,
  totpTokenFor,
  verifyTotp
} from './security';

test('hashSecret produces an opaque self-describing scrypt value', () => {
  const hash = hashSecret('user-1', 'CorrectHorseBatteryStaple!');
  assert.match(hash, /^scrypt\$16384\$8\$1\$[0-9a-f]{32}\$[0-9a-f]{128}$/);
});

test('verifySecret accepts the right password and rejects the wrong one', () => {
  const hash = hashSecret('user-1', 'CorrectHorseBatteryStaple!');
  assert.equal(verifySecret('user-1', 'CorrectHorseBatteryStaple!', hash), true);
  assert.equal(verifySecret('user-1', 'wrong', hash), false);
});

test('verifySecret fails closed on malformed stored values', () => {
  assert.equal(verifySecret('u', 'anything', ''), false);
  assert.equal(verifySecret('u', 'anything', 'plaintext'), false);
  assert.equal(verifySecret('u', 'anything', 'scrypt$bad'), false);
});

test('legacy pbkdf2-sha256 hashes verify through verifySecret and verifyLegacyPbkdf2', () => {
  const saltHex = derivedSaltFor('legacy-user');
  const derived = pbkdf2Sync('legacy-pass', saltHex, 120000, 32, 'sha256').toString('hex');
  const legacyHash = `pbkdf2-sha256$120000$${saltHex}$${derived}`;
  assert.equal(verifySecret('legacy-user', 'legacy-pass', legacyHash), true);
  assert.equal(verifySecret('legacy-user', 'wrong', legacyHash), false);
  assert.equal(verifyLegacyPbkdf2('legacy-user', 'legacy-pass', legacyHash.split('$')), true);
});

test('legacy hashes with malformed parts fail closed', () => {
  const legacyHash = 'pbkdf2-sha256$120000$not-a-hex-salt$not-a-hex-digest';
  assert.equal(verifySecret('legacy-user', 'legacy-pass', legacyHash), false);
});

test('verifyScrypt rejects tampered hashes', () => {
  const hash = hashSecret('u', 'secret');
  const parts = hash.split('$');
  parts[5] = '0'.repeat(128);
  assert.equal(verifyScrypt('secret', parts), false);
});

test('secureToken is 256-bit random with a prefix', () => {
  const a = secureToken('sess');
  const b = secureToken('sess');
  assert.match(a, /^sess-[0-9a-f]{64}$/);
  assert.notEqual(a, b);
});

test('TOTP generates a real 6-digit code that verifyTotp accepts', () => {
  const secret = generateTotpSecret();
  assert.match(secret, /^[A-Z2-7]{32}$/);
  const at = Date.now();
  const code = totpTokenFor(secret, at);
  assert.match(code || '', /^\d{6}$/);
  assert.equal(verifyTotp(secret, code || '', at), true);
});

test('TOTP rejects wrong length and wrong code', () => {
  const secret = generateTotpSecret();
  assert.equal(verifyTotp(secret, '12345'), false);
  assert.equal(verifyTotp(secret, '123456'), false);
});
