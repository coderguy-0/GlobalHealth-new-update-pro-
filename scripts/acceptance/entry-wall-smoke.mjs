/**
 * Entry-wall acceptance test — mandatory visitor sign-in gate.
 *
 * Renders the real <App /> inside jsdom against the running dev server
 * (http://127.0.0.1:3000) and verifies:
 *   1. A signed-out visitor gets the full-screen sign-in wall (no site chrome).
 *   2. The wall forces a LIGHT screen even when the saved theme is dark.
 *   3. Logging in with the demo patient dismisses the wall and the site renders.
 *   4. A fresh signed-out visit to #terms shows the readable legal page with a
 *      "Back to Sign In" path — and nothing else of the site.
 *
 * Run (dev server must be up): npm run accept:entry-wall
 */
import { JSDOM } from 'jsdom';

const BASE = 'http://127.0.0.1:3000';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitFor(fn, label, timeoutMs = 15000) {
  const start = Date.now();
  let lastErr;
  while (Date.now() - start < timeoutMs) {
    try {
      const v = fn();
      if (v) return v;
    } catch (e) {
      lastErr = e;
    }
    await sleep(120);
  }
  throw new Error(`Timeout waiting for: ${label}${lastErr ? ` (last error: ${lastErr})` : ''}`);
}

function makeWindow(url) {
  return new JSDOM(
    '<!doctype html><html class="dark"><head></head><body><div id="root"></div></body></html>',
    { url, pretendToBeVisual: true, runScripts: 'outside-only' }
  );
}

function shimGlobals(dom) {
  const w = dom.window;
  const def = (k, v) => {
    try {
      Object.defineProperty(globalThis, k, { value: v, configurable: true, writable: true });
    } catch {
      globalThis[k] = v;
    }
  };
  def('window', w);
  def('document', w.document);
  def('localStorage', w.localStorage);
  def('sessionStorage', w.sessionStorage);
  try {
    Object.defineProperty(globalThis, 'navigator', { value: w.navigator, configurable: true });
  } catch {
    /* ignore */
  }
  def('MutationObserver', w.MutationObserver);
  def('Event', w.Event);
  def('CustomEvent', w.CustomEvent);
  def('HTMLElement', w.HTMLElement);
  def('Element', w.Element);
  def('Node', w.Node);

  const matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() {
      return false;
    },
  });
  w.matchMedia = matchMedia;
  def('matchMedia', matchMedia);
  w.scrollTo = () => {};
  def('scrollTo', () => {});
  class FakeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  def('ResizeObserver', FakeObserver);
  def('IntersectionObserver', FakeObserver);
  w.ResizeObserver = FakeObserver;
  w.IntersectionObserver = FakeObserver;

  const realFetch = globalThis.fetch;
  const patched = (input, init) => {
    let url =
      typeof input === 'string'
        ? input
        : input instanceof w.Request
          ? input.url
          : String(input);
    if (url.startsWith('/')) url = BASE + url;
    return realFetch(url, init);
  };
  def('fetch', patched);
  w.fetch = patched;
}

function assert(cond, msg) {
  if (!cond) throw new Error(`ASSERT FAILED: ${msg}`);
  console.log(`  ✓ ${msg}`);
}

// --- shared provider tree (mirrors src/main.tsx, minus service worker) -----
async function renderApp() {
  const React = await import('react');
  const { createRoot } = await import('react-dom/client');
  const { LocalizationProvider } = await import('../../src/context/LocalizationContext.tsx');
  const { AuthProvider, useAuth } = await import('../../src/context/AuthContext.tsx');
  const { ThemeProvider } = await import('../../src/components/enhancements/ThemeContext.tsx');
  const { ToastProvider } = await import('../../src/components/enhancements/ToastContext.tsx');
  const { PatientEhrProvider } = await import('../../src/context/PatientEhrContext.tsx');
  const { HospitalProvider } = await import('../../src/context/HospitalContext.tsx');
  const { PharmacyProvider } = await import('../../src/context/PharmacyContext.tsx');
  const { BiomedicalProvider } = await import('../../src/context/BiomedicalContext.tsx');
  const { DiagnosticProvider } = await import('../../src/context/DiagnosticContext.tsx');
  const AppMod = await import('../../src/App.tsx');
  const App = AppMod.default;

  // Mirrors IdentityScopedProviders: remounts the app when identity changes.
  function Scope({ children }) {
    const { user } = useAuth();
    return React.createElement('div', { key: user ? user.id : 'guest' }, children);
  }

  const tree = React.createElement(
    ThemeProvider,
    null,
    React.createElement(
      LocalizationProvider,
      null,
      React.createElement(
        AuthProvider,
        null,
        React.createElement(
          Scope,
          null,
          React.createElement(
            PatientEhrProvider,
            null,
            React.createElement(
              HospitalProvider,
              null,
              React.createElement(
                DiagnosticProvider,
                null,
                React.createElement(
                  PharmacyProvider,
                  null,
                  React.createElement(
                    BiomedicalProvider,
                    null,
                    React.createElement(ToastProvider, null, React.createElement(App, null))
                  )
                )
              )
            )
          )
        )
      )
    )
  );

  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(tree);
  return { root, container };
}

// ---------------------------------------------------------------------------
async function scenarioWallAndLogin() {
  console.log('\n[1] Signed-out visit → full-screen LIGHT sign-in wall');
  const dom = makeWindow(BASE + '/');
  shimGlobals(dom);
  // Saved preference is dark — the wall must still render light.
  localStorage.setItem('gh:theme-preference', 'dark');
  localStorage.removeItem('globalhealth_auth_token');
  localStorage.removeItem('globalhealth_user_session');

  await renderApp();

  const wallHead = await waitFor(
    () => document.body.textContent.includes('Welcome Back') && document.body.textContent,
    'AuthPage wall ("Welcome Back")'
  );
  assert(true, 'sign-in wall rendered');
  assert(
    wallHead.includes('Sign-in required to enter GlobalHealth'),
    'header shows "Sign-in required" marker (no way back to the site)'
  );
  assert(
    wallHead.includes('Quick-Fill Patient Accounts'),
    'demo patient quick-fill is offered on the wall'
  );
  assert(
    !document.getElementById('gh-main-content'),
    'site chrome (navbar/main) is NOT rendered for a signed-out visitor'
  );
  assert(
    !document.body.textContent.includes('Medical Disclaimer') ||
      !document.body.textContent.includes('Skip to main content'),
    'no site content behind the wall'
  );
  // Light lock: ThemeProvider wants dark (storage says dark) but the wall wins.
  await sleep(300);
  assert(
    !document.documentElement.classList.contains('dark'),
    'wall forces LIGHT theme even though saved theme is dark'
  );
  assert(document.documentElement.style.colorScheme === 'light', 'color-scheme forced to light');

  console.log('\n[2] Demo patient logs in through the wall');
  const fillBtn = await waitFor(
    () =>
      [...document.querySelectorAll('button')].find(
        (b) => b.textContent.includes('Sarah Jenkins') || b.textContent.includes('Fill Demo Patient')
      ),
    'demo patient quick-fill button'
  );
  fillBtn.click();
  await sleep(150);
  const form = document.querySelector('form');
  assert(!!form, 'login form present');
  form.dispatchEvent(
    new window.Event('submit', { bubbles: true, cancelable: true })
  );

  await waitFor(
    () => document.getElementById('gh-main-content') !== null,
    'site renders after login'
  );
  assert(true, 'wall dismissed after successful login — website rendered');
  assert(
    !document.body.textContent.includes('Welcome Back'),
    'sign-in card is gone'
  );
  assert(
    document.querySelector('[role="dialog"]') === null ||
      !document.body.textContent.includes('Sign In, Sign Up & Recover by Role'),
    'no stray auth modal after login'
  );
  // Dark preference should be restored for the signed-in experience.
  assert(
    document.documentElement.classList.contains('dark'),
    'saved dark theme restored after leaving the wall'
  );
}

// ---------------------------------------------------------------------------
async function scenarioLegalPage() {
  console.log('\n[3] Signed-out visit to #terms → readable legal page, still gated');
  const dom = makeWindow(BASE + '/#terms');
  shimGlobals(dom);
  localStorage.setItem('gh:theme-preference', 'light');
  localStorage.removeItem('globalhealth_auth_token');
  localStorage.removeItem('globalhealth_user_session');

  await renderApp();

  await waitFor(
    () => document.body.textContent.includes('Terms & Conditions'),
    'Terms page content'
  );
  assert(true, 'Terms & Conditions readable before sign-in');
  const back = [...document.querySelectorAll('button')].find((b) =>
    b.textContent.includes('Back to Sign In')
  );
  assert(!!back, '"Back to Sign In" button present');
  assert(!document.getElementById('gh-main-content'), 'site chrome still hidden on legal view');
  assert(
    [...document.querySelectorAll('button')].every(
      (b) => !b.textContent.includes('Diseases') && !b.textContent.includes('Explore')
    ),
    'no site navigation exposed pre-login'
  );
}

// ---------------------------------------------------------------------------
async function scenarioDeepLink() {
  console.log('\n[4] Signed-out deep link (#diseases) → wall → login lands on #diseases');
  const dom = makeWindow(BASE + '/#diseases');
  shimGlobals(dom);
  localStorage.setItem('gh:theme-preference', 'light');
  localStorage.removeItem('globalhealth_auth_token');
  localStorage.removeItem('globalhealth_user_session');

  await renderApp();
  await waitFor(() => document.body.textContent.includes('Welcome Back'), 'wall on deep link');

  const fillBtn = await waitFor(
    () =>
      [...document.querySelectorAll('button')].find(
        (b) => b.textContent.includes('Sarah Jenkins') || b.textContent.includes('Fill Demo Patient')
      ),
    'demo quick-fill'
  );
  fillBtn.click();
  await sleep(150);
  document.querySelector('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

  await waitFor(() => document.getElementById('gh-main-content') !== null, 'site after deep-link login');
  assert(window.location.hash === '#diseases', `deep link preserved (hash=${window.location.hash})`);
}

// ---------------------------------------------------------------------------
async function scenarioInvalidToken() {
  console.log('\n[5] Stale/invalid stored token → back to the wall (no crash)');
  const dom = makeWindow(BASE + '/');
  shimGlobals(dom);
  localStorage.setItem('gh:theme-preference', 'light');
  localStorage.setItem('globalhealth_auth_token', 'not-a-real-token');

  await renderApp();
  await waitFor(() => document.body.textContent.includes('Welcome Back'), 'wall after invalid token');
  assert(true, 'invalid session falls back to the sign-in wall');
  assert(
    localStorage.getItem('globalhealth_auth_token') === null,
    'stale token cleared by session validation'
  );
}

// ---------------------------------------------------------------------------
const only = process.argv[2];
try {
  if (only !== 'legal') await scenarioWallAndLogin();
  if (only !== 'wall') await scenarioLegalPage();
  if (!only) await scenarioDeepLink();
  if (!only) await scenarioInvalidToken();
  console.log('\nALL ENTRY-WALL SMOKE CHECKS PASSED');
  process.exit(0);
} catch (err) {
  console.error(`\nFAILED: ${err.message}`);
  process.exit(1);
}
