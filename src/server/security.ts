// Password, token, and TOTP security primitives for GlobalHealth.
//
// This module is intentionally dependency-free so it can be unit tested
// independently from Express and from server.ts. It is the single source of
// truth for:
//   - password hashing / verification (scrypt, plus legacy PBKDF2 migration)
//   - opaque cryptographically-secure token generation
//   - RFC 6238 TOTP (authenticator-app style 6-digit codes)

import {
  createHash,
  createHmac,
  pbkdf2Sync,
  randomBytes,
  scryptSync,
  timingSafeEqual
} from 'node:crypto';

// --- password hashing -------------------------------------------------------

export const PASSWORD_SCRYPT_N = 16384;
export const PASSWORD_SCRYPT_R = 8;
export const PASSWORD_SCRYPT_P = 1;
export const PASSWORD_PBKDF2_ITERATIONS = 120000;

export function hashSecret(_salt: string, value: string): string {
  const actualSalt = randomBytes(16).toString('hex');
  const derived = scryptSync(value, actualSalt, 64, {
    N: PASSWORD_SCRYPT_N,
    r: PASSWORD_SCRYPT_R,
    p: PASSWORD_SCRYPT_P
  }).toString('hex');
  return `scrypt$${PASSWORD_SCRYPT_N}$${PASSWORD_SCRYPT_R}$${PASSWORD_SCRYPT_P}$${actualSalt}$${derived}`;
}

export function verifyScrypt(value: string, parts: string[]): boolean {
  const n = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  const saltHex = parts[4] || '';
  const expectedHex = parts[5] || '';
  if (
    !n ||
    !r ||
    !p ||
    saltHex.length !== 32 ||
    !/^[0-9a-f]+$/i.test(saltHex) ||
    !/^[0-9a-f]+$/i.test(expectedHex) ||
    expectedHex.length !== 128
  ) {
    return false;
  }
  try {
    const actual = scryptSync(value, saltHex, 64, { N: n, r, p }).toString('hex');
    const a = Buffer.from(actual, 'hex');
    const b = Buffer.from(expectedHex, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function derivedSaltFor(salt: string): string {
  return createHash('sha256').update(`globalhealth::${salt}`).digest('hex').slice(0, 32);
}

export function verifyLegacyPbkdf2(salt: string, value: string, parts: string[]): boolean {
  const iterations = Number(parts[1]) || PASSWORD_PBKDF2_ITERATIONS;
  const saltHex = parts[2] || derivedSaltFor(salt);
  const expectedHex = parts[3] || '';
  if (
    !expectedHex ||
    saltHex.length !== 32 ||
    !/^[0-9a-f]+$/i.test(expectedHex) ||
    expectedHex.length !== 64
  ) {
    return false;
  }
  const actual = pbkdf2Sync(value, saltHex, iterations, 32, 'sha256').toString('hex');
  const a = Buffer.from(actual, 'hex');
  const b = Buffer.from(expectedHex, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Verify any stored secret format we recognize.
 * Returns `false` (never throws) for malformed or unsupported formats.
 */
export function verifySecret(salt: string, value: string, stored: string): boolean {
  if (!stored || !stored.includes('$')) return false;
  const parts = stored.split('$');
  if (parts[0] === 'scrypt') return verifyScrypt(value, parts);
  if (parts[0] === 'pbkdf2-sha256') return verifyLegacyPbkdf2(salt, value, parts);
  return false;
}

// --- opaque tokens ----------------------------------------------------------

/**
 * Cryptographically secure opaque token. The prefix is only for operational
 * identification in logs; the 64 hex chars (256 bits) are unguessable.
 */
export function secureToken(prefix: string): string {
  return `${prefix}-${randomBytes(32).toString('hex')}`;
}

// --- RFC 6238 TOTP ----------------------------------------------------------

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';
  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  return output;
}

function base32Decode(input: string): Buffer | null {
  const clean = String(input || '').trim().toUpperCase().replace(/=+$/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of clean) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) return null;
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

export function generateTotpSecret(): string {
  return base32Encode(randomBytes(20));
}

export function totpTokenFor(secret: string, atMs: number, stepSeconds = 30): string | null {
  const key = base32Decode(secret);
  if (!key || key.length < 10) return null;
  const counter = Math.floor(atMs / (stepSeconds * 1000));
  const counterBuf = Buffer.alloc(8);
  counterBuf.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac('sha1', key).update(counterBuf).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);
  return String(binary % 1000000).padStart(6, '0');
}

export function verifyTotp(secret: string, token: string, atMs = Date.now(), stepSeconds = 30): boolean {
  const clean = String(token || '').trim();
  if (!/^\d{6}$/.test(clean)) return false;
  for (let offset = -1; offset <= 1; offset += 1) {
    const expected = totpTokenFor(secret, atMs + offset * stepSeconds * 1000, stepSeconds);
    if (expected && expected === clean) return true;
  }
  return false;
}
