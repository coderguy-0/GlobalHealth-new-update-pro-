#!/usr/bin/env node
/**
 * GlobalHealth deployment preflight.
 *
 * Answers one question: "is this checkout/env actually safe to deploy?"
 * Run it in CI and again on the target host before promoting a release.
 *
 *   npm run deploy:check
 *   npm run deploy:check -- --production   # also enforce prod-only rules
 *
 * Exit code 0 = deployable (warnings allowed), 1 = blocking problems found.
 */

import { existsSync, readFileSync, statSync, accessSync, constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const strictProd = args.has('--production') || process.env.NODE_ENV === 'production';

const errors = [];
const warnings = [];
const notes = [];

const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const note = (m) => notes.push(m);

// ---------------------------------------------------------------- helpers ---
function readEnvFile(file) {
  if (!existsSync(file)) return {};
  const out = {};
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

const human = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

// ------------------------------------------------------- 1. Node runtime ---
note(`Node ${process.version} on ${process.platform}/${process.arch}`);

const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const requiredNode = (pkg.engines?.node || '').replace(/[^\d.]/g, '');
const major = Number(process.versions.node.split('.')[0]);
if (requiredNode && major < Number(requiredNode.split('.')[0])) {
  fail(`Node ${process.versions.node} is below the required ${pkg.engines.node}.`);
} else {
  note(`Node version satisfies engines.node (${pkg.engines?.node || 'unspecified'})`);
}

// -------------------------------------------------- 2. Lockfile is in sync ---
// A drifted lockfile is the most common cause of "works locally, fails on the
// build host" — npm ci refuses to run and the deploy aborts mid-flight.
if (!existsSync(path.join(root, 'package-lock.json'))) {
  fail('package-lock.json is missing; reproducible installs (npm ci) are impossible.');
} else {
  const lock = JSON.parse(readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
  const locked = new Set(Object.keys(lock.packages || {}).filter(Boolean));
  const missing = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
    .map((d) => `node_modules/${d}`)
    .filter((d) => !locked.has(d));
  if (missing.length) {
    fail(`package-lock.json is out of sync with package.json. Run \`npm install\`. Missing: ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? ` (+${missing.length - 8} more)` : ''}`);
  } else {
    note('package-lock.json is in sync with package.json');
  }
}

// ------------------------------------------------------- 3. Build output ---
const dist = path.join(root, 'dist');
const indexHtml = path.join(dist, 'index.html');
const serverBundle = path.join(dist, 'server.cjs');

if (!existsSync(dist)) {
  fail('dist/ not found. Run `npm run build` before deploying.');
} else {
  if (!existsSync(indexHtml)) fail('dist/index.html is missing — the SPA was not built.');
  if (!existsSync(serverBundle)) {
    fail('dist/server.cjs is missing — the server bundle was not built.');
  } else {
    const size = statSync(serverBundle).size;
    note(`dist/server.cjs is ${human(size)}`);
    if (size > 64 * 1024 * 1024) warn(`dist/server.cjs is unusually large (${human(size)}).`);
  }

  if (existsSync(indexHtml)) {
    // The built shell must reference the manifest and the module entry,
    // otherwise the pieces of the deploy are mismatched.
    const html = readFileSync(indexHtml, 'utf8');
    if (!/manifest\.webmanifest/.test(html)) warn('dist/index.html does not reference the web app manifest.');
    if (!/src="\/assets\/|crossorigin/.test(html) && !/type="module"/.test(html)) {
      warn('dist/index.html has no module script tag; the build looks incomplete.');
    }
  }

  // Ship-blockers: sourcemaps are large and leak source, and the runtime
  // directory must never be inside the published static output.
  if (existsSync(path.join(dist, 'server.cjs.map'))) {
    warn('dist/server.cjs.map is present. Use `npm run build` (not build:debug) for production to drop ~38MB.');
  }
  if (existsSync(path.join(dist, 'data'))) {
    fail('dist/data exists — runtime state is inside the published static output. Move GH_RUNTIME_DIR outside dist/.');
  }
}

// ------------------------------------------- 4. Runtime dir is writable ---
// Mirror the server's resolution exactly: GH_RUNTIME_DIR may be absolute
// (/app/data on Docker, /var/data on Render) or relative (local-dev `data`).
// path.join would concatenate an absolute value onto the repo root and check
// the wrong directory — the same bug class this preflight exists to catch.
const runtimeDir = path.resolve(root, process.env.GH_RUNTIME_DIR || 'data', 'runtime');
try {
  const fs = await import('node:fs');
  fs.mkdirSync(runtimeDir, { recursive: true });
  accessSync(runtimeDir, constants.W_OK);
  note(`Runtime state directory is writable: ${path.relative(root, runtimeDir)}`);
} catch (err) {
  fail(`Runtime state directory is not writable (${runtimeDir}): ${err.message}. /api/ready will report NOT_READY.`);
}

// -------------------------------------------------------- 5. Environment ---
// Merge the real environment over .env / .env.production so this works both
// locally and on a host where only the secret manager is populated.
const fileEnv = {
  ...readEnvFile(path.join(root, '.env')),
  ...readEnvFile(path.join(root, '.env.production')),
};
const env = (key) => (process.env[key] ?? fileEnv[key] ?? '').trim();
const usingFile = (key) => !process.env[key] && Boolean(fileEnv[key]);

const secretFilled = (key) => {
  const v = env(key);
  if (!v) return false;
  if (/^(changeme|example|test|secret|password|xxx+|<.+>)$/i.test(v)) {
    fail(`${key} still holds a placeholder value. Generate a real secret.`);
    return false;
  }
  if (v.length < 16) {
    warn(`${key} is shorter than 16 characters; use at least 32 random bytes.`);
  }
  return true;
};

if (strictProd && env('NODE_ENV') !== 'production') {
  fail(`NODE_ENV must be "production" for a production deploy (got "${env('NODE_ENV') || 'unset'}"). \`npm start\` sets this for you.`);
}

const cors = env('CORS_ORIGIN');
if (cors) {
  const origins = cors.split(',').map((s) => s.trim()).filter(Boolean);
  if (origins.includes('*')) {
    fail('CORS_ORIGIN must not contain "*" in production — the server will refuse to start.');
  }
  for (const o of origins) {
    if (!/^https?:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(o)) {
      fail(`CORS_ORIGIN entry "${o}" is not a valid origin (expected e.g. https://app.example.com).`);
    }
    if (strictProd && o.startsWith('http://') && !/^http:\/\/(localhost|127\.0\.0\.1)/.test(o)) {
      warn(`CORS_ORIGIN entry "${o}" is plain HTTP. Use HTTPS in production.`);
    }
  }
} else {
  note('CORS_ORIGIN is unset — same-origin only (correct for the bundled single-process deploy).');
}

const runtimeDirEnv = env('GH_RUNTIME_DIR');
if (runtimeDirEnv.startsWith('/tmp') || runtimeDirEnv.startsWith('/var/tmp')) {
  fail(`GH_RUNTIME_DIR points at ${runtimeDirEnv}, which is wiped on container restart. User accounts and clinical state would be lost. Use a mounted volume.`);
}

// Feature gates — these degrade a feature, they do not block a deploy.
const gates = [
  ['GEMINI_API_KEY', 'AI Assistant returns "not configured"'],
  ['MEDAUTH_REGISTRY_URL', 'clinician credential verification fails closed (NOT_VERIFIED)'],
  ['MEDAUTH_REGISTRY_SECRET', 'clinician credential verification fails closed (NOT_VERIFIED)'],
];
for (const [key, impact] of gates) {
  if (!env(key)) warn(`${key} is not set — ${impact}.`);
}

for (const key of ['PRESCRIPTION_SIGNING_SECRET', 'GH_ADMIN_KEY']) {
  if (!env(key)) {
    warn(`${key} is not set — ${key === 'GH_ADMIN_KEY' ? 'pharmacy admin verification is disabled' : 'prescriptions are HELD/UNSIGNED'}.`);
  } else {
    secretFilled(key);
  }
}
if (env('MEDAUTH_REGISTRY_SECRET')) secretFilled('MEDAUTH_REGISTRY_SECRET');
if (env('NEWS_ADMIN_BOOTSTRAP_PASSWORD')) secretFilled('NEWS_ADMIN_BOOTSTRAP_PASSWORD');

const secretsFromFile = ['GEMINI_API_KEY', 'MEDAUTH_REGISTRY_SECRET', 'PRESCRIPTION_SIGNING_SECRET', 'GH_ADMIN_KEY']
  .filter(usingFile);
if (secretsFromFile.length && strictProd) {
  warn(`Secrets are being read from a .env file (${secretsFromFile.join(', ')}). Prefer your platform's secret manager in production.`);
}

// ------------------------------------------------------------ 6. Docker ---
if (existsSync(path.join(root, 'Dockerfile'))) {
  const df = readFileSync(path.join(root, 'Dockerfile'), 'utf8');
  if (!/USER\s+\w+/.test(df)) warn('Dockerfile does not drop to a non-root USER.');
  if (!/HEALTHCHECK/.test(df)) note('Dockerfile has no HEALTHCHECK.');
  note('Dockerfile present — `npm run deploy:docker` builds an image.');
} else {
  warn('No Dockerfile found; container platforms cannot build this repo.');
}

// ------------------------------------------------------------- report ----
const line = '─'.repeat(66);
console.log(`\n${line}\n  GlobalHealth deployment preflight${strictProd ? '  (production mode)' : ''}\n${line}`);

if (notes.length) {
  console.log('\n  OK');
  for (const n of notes) console.log(`    ✓ ${n}`);
}
if (warnings.length) {
  console.log('\n  WARNINGS  (deployable, but review)');
  for (const w of warnings) console.log(`    ! ${w}`);
}
if (errors.length) {
  console.log('\n  BLOCKERS  (must fix before deploying)');
  for (const e of errors) console.log(`    ✗ ${e}`);
}

console.log('');
if (errors.length) {
  console.log(`  ${errors.length} blocker(s) found. Not deployable yet.\n`);
  process.exit(1);
}
console.log(`  No blockers.${warnings.length ? ` ${warnings.length} warning(s) to review.` : ''} Ready to deploy.\n`);
