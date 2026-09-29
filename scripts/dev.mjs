#!/usr/bin/env node
/**
 * Development entrypoint for GlobalHealth.
 *
 * Why this exists instead of `tsx server.ts`:
 *
 * `server.ts` loads `dotenv/config`, which reads `.env`. Production templates
 * (and therefore most developers' local `.env`, copied from
 * `.env.production.example`) set `NODE_ENV=production`. dotenv does not
 * override variables that are already set, so the fix is to establish
 * NODE_ENV *before* spawning the server.
 *
 * Without this, `npm run dev` silently booted in production mode: it served a
 * stale `dist/` bundle instead of the Vite dev middleware, so edits did not
 * appear and there was no hot reload — with no error message to explain why.
 *
 * This wrapper pins development mode, cross-platform, then hands off to tsx.
 */

import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');

// Establish before the child reads .env, so dotenv leaves it alone.
process.env.NODE_ENV = 'development';

// Resolve tsx through Node's resolver so this works with any package manager
// layout (npm, pnpm, yarn) instead of assuming node_modules/.bin.
const require = createRequire(import.meta.url);
let tsxBin;
try {
  tsxBin = require.resolve('tsx/cli');
} catch {
  console.error(
    '\n  GlobalHealth dev server could not start: the "tsx" package is missing.\n' +
      '  Run `npm install` (including devDependencies) and try again.\n'
  );
  process.exit(1);
}

const child = spawn(process.execPath, [tsxBin, path.join(root, 'server.ts')], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
});

// Forward termination signals so Ctrl+C stops the server cleanly.
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
