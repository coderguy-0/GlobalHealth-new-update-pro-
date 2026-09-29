#!/usr/bin/env node
/**
 * Production entrypoint for GlobalHealth.
 *
 * `npm start` used to be `NODE_ENV=production node dist/server.cjs`, which:
 *   1. is not valid on Windows shells (env assignment is not a command
 *      prefix there), and
 *   2. silently ran in DEVELOPMENT mode whenever a host invoked
 *      `node dist/server.cjs` directly — booting the Vite dev middleware
 *      instead of serving the built SPA.
 *
 * This wrapper pins production mode regardless of platform or caller, fails
 * with an actionable message when the build is missing, and forwards through
 * to the bundled server.
 */

import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const serverBundle = path.join(here, '..', 'dist', 'server.cjs');

if (!existsSync(serverBundle)) {
  console.error(
    [
      '',
      '  GlobalHealth could not start: no production build found.',
      '',
      `  Expected: ${serverBundle}`,
      '',
      '  Build it first:',
      '      npm run build',
      '',
      '  Then start:',
      '      npm start',
      '',
    ].join('\n')
  );
  process.exit(1);
}

// Default to production; an explicit NODE_ENV (e.g. 'test') still wins.
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// The bundle is CommonJS, so load it through require even from this ESM shim.
createRequire(import.meta.url)(serverBundle);
