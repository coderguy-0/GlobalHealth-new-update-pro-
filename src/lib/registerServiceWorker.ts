/**
 * Registers the GlobalHealth service worker so the platform is installable and
 * recently visited reference pages remain readable offline.
 *
 * Deliberately production-only: in development a service worker would serve
 * stale bundles over the Vite dev server and make hot-reload behave
 * unpredictably for contributors.
 */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  if (!import.meta.env.PROD) return;
  // Ignore SW registration inside iframes / embedded previews where a stale
  // shell is more confusing than helpful.
  try {
    if (window.self !== window.top) return;
  } catch {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        // Check for a new deployment on every visit; the SW itself decides
        // whether anything actually changed.
        registration.update().catch(() => undefined);
      })
      .catch((err) => {
        console.warn('[GlobalHealth] Service worker registration failed', err);
      });
  });
}
