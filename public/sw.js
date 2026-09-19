/* =============================================================================
 * GlobalHealth service worker
 *
 * Deliberately conservative caching policy:
 *
 *   • Navigations (HTML)      → network-first, offline falls back to cache.
 *                               Updates always land; a stale shell is only
 *                               served when the network is genuinely down.
 *   • Hashed build assets     → cache-first (filenames change on every build,
 *                               so they are immutable by construction).
 *   • Icons / manifest        → stale-while-revalidate.
 *   • /api/* and everything
 *     else                    → never cached. Patient data, consent tokens and
 *                               clinical records must never be written to a
 *                               shared on-disk HTTP cache.
 *
 * Bump CACHE_VERSION to invalidate every cached entry after a deployment.
 * ========================================================================== */

const CACHE_VERSION = 'gh-v1';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;

/** Precache the offline shell + brand assets. */
const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
];

/** Extensions safe to serve cache-first (content-hashed by Vite). */
const IMMUTABLE_DEST = new Set(['script', 'style', 'worker', 'font']);

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // Individual failures must not abort the whole install.
      await Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(new Request(url, { cache: 'reload' }))));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k))
      );
      if (self.registration.navigationPreload) {
        try {
          await self.registration.navigationPreload.disable();
        } catch {
          /* not supported */
        }
      }
      await self.clients.claim();
    })()
  );
});

/** Requests that must never touch a cache. */
function isUncacheable(url) {
  return (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/.well-known/') ||
    url.searchParams.has('token') ||
    url.searchParams.has('consent')
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only GETs are cacheable, and only same-origin traffic is managed here.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (isUncacheable(url)) return;

  // ---- Navigations: network-first with an offline fallback to the shell ----
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(SHELL_CACHE);
          cache.put('/', fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(SHELL_CACHE);
          return (
            (await cache.match(request)) ||
            (await cache.match('/')) ||
            new Response(
              '<!doctype html><meta charset="utf-8"><title>Offline</title><body style="font-family:system-ui;padding:2rem;text-align:center"><h1>You are offline</h1><p>GlobalHealth needs a connection for this page. Reconnect and try again.</p></body>',
              { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 503 }
            )
          );
        }
      })()
    );
    return;
  }

  // ---- Brand assets: stale-while-revalidate ----
  if (/^\/(icon-|apple-touch-icon|favicon)/.test(url.pathname) || url.pathname === '/manifest.webmanifest') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((res) => {
            if (res && res.ok) cache.put(request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })()
    );
    return;
  }

  // ---- Hashed bundles and stylesheets: cache-first ----
  if (IMMUTABLE_DEST.has(request.destination) || /\.(?:css|js|woff2?|ttf|otf)$/.test(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(ASSET_CACHE);
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const res = await fetch(request);
          if (res && res.ok) cache.put(request, res.clone());
          return res;
        } catch (err) {
          const fallback = await cache.match(request);
          if (fallback) return fallback;
          throw err;
        }
      })()
    );
  }
});

/** Allow the page to trigger an immediate update. */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
