import React, { Suspense, lazy, useLayoutEffect } from 'react';
import { Activity, ArrowLeft, Lock } from 'lucide-react';
import type { PublicUserAccount } from '../../types/auth';
import { readStoredTheme } from '../enhancements/ThemeContext';
import { TermsPage } from '../legal/TermsPage';
import { PrivacyPolicyPage } from '../legal/PrivacyPolicyPage';
import type { TargetPortalRoute } from './RolePortalAuthPanel';

// AuthPage stays code-split: the chunk only downloads when a visitor actually
// reaches the wall (or the signed-in #auth security screen).
const AuthPage = lazy(() =>
  import('../AuthPage').then((m) => ({ default: m.AuthPage }))
);

/**
 * Forces the entry experience to stay LIGHT even when the visitor's saved or
 * system theme is dark. The `.dark` class is stripped from <html> while the
 * wall is mounted — a MutationObserver re-strips it if a theme effect
 * re-applies it during mount — and the visitor's saved theme is restored when
 * the wall unmounts. This is what keeps the sign-in screen from ever being a
 * dark screen.
 */
function useLightThemeLock() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const wasDarkAtMount = root.classList.contains('dark');
    let lastSeenColorScheme = root.style.colorScheme;

    const enforce = () => {
      if (root.classList.contains('dark')) root.classList.remove('dark');
      if (root.style.colorScheme !== 'light') root.style.colorScheme = 'light';
    };
    enforce();

    // ThemeProvider (an ancestor effect) may (re)apply the dark class after
    // this layout effect runs — keep enforcing while the wall is mounted.
    const observer =
      typeof window !== 'undefined' && window.MutationObserver
        ? new window.MutationObserver(() => {
            if (root.style.colorScheme && root.style.colorScheme !== 'light') {
              lastSeenColorScheme = root.style.colorScheme;
            }
            enforce();
          })
        : null;
    observer?.observe(root, { attributes: true, attributeFilter: ['class', 'style'] });

    return () => {
      observer?.disconnect();
      // Restore the visitor's saved preference (single source of truth in
      // ThemeProvider); fall back to what was on <html> at mount time.
      const stored = readStoredTheme();
      const backToDark = stored ? stored === 'dark' : wasDarkAtMount;
      root.classList.toggle('dark', backToDark);
      root.style.colorScheme = backToDark ? 'dark' : lastSeenColorScheme || (backToDark ? 'dark' : 'light');
    };
  }, []);
}

interface EntrySplashProps {
  message?: string;
  direction?: string;
}

/** Light, branded splash shown while the stored session is being verified
 *  or the secure sign-in chunk loads. Never a dark screen. */
export const EntrySplash: React.FC<EntrySplashProps> = ({
  message = 'Verifying your session…',
  direction,
}) => {
  useLightThemeLock();
  return (
    <div
      className="gh-entry-wall flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-medical-50 via-white to-medical-50 px-4 text-center text-slate-900"
      dir={direction}
      style={{ colorScheme: 'light' }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-medical-500 to-medical-700 text-white shadow-lg shadow-medical-600/25">
        <Activity className="h-7 w-7" />
      </div>
      <h1 className="mt-4 text-xl font-extrabold tracking-tight text-slate-900">
        GlobalHealth
      </h1>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-medical-700">
        Unified Role-Based Portal Gateway
      </p>
      <div
        className="mt-6 h-8 w-8 animate-spin rounded-full border-[3px] border-medical-100 border-t-medical-600"
        role="status"
        aria-label={message}
      />
      <p className="mt-3 text-sm font-medium text-slate-600">{message}</p>
      <p className="mt-1 text-xs text-slate-400">
        Every visitor signs in with their own account.
      </p>
    </div>
  );
};

interface VisitorLoginWallProps {
  /** When set, the wall shows this legal page instead of the sign-in card
   *  (Terms / Privacy stay readable before sign-in). */
  legalPage: 'terms' | 'privacy-policy' | null;
  /** Shown as a light banner when the previous session expired. */
  sessionExpired: boolean;
  direction?: string;
  onLoginSuccess: (user: PublicUserAccount, token?: string) => void;
  onNavigateToPortal: (portal: TargetPortalRoute) => void;
  /** From a legal page back to the sign-in card. */
  onReturnToSignIn: () => void;
  /** Open Terms / Privacy Policy from links inside the sign-in experience. */
  onOpenLegalPage: (tab: 'terms' | 'privacy-policy') => void;
}

/**
 * The mandatory visitor entry wall: a full-screen, LIGHT-themed sign-in page
 * shown to every visitor before the website renders. There is no skip or
 * close affordance — each individual signs in with their own account (User
 * Portal, Doctor, Hospital, Pharmacy or News workspace).
 */
export const VisitorLoginWall: React.FC<VisitorLoginWallProps> = ({
  legalPage,
  sessionExpired,
  direction,
  onLoginSuccess,
  onNavigateToPortal,
  onReturnToSignIn,
  onOpenLegalPage,
}) => {
  useLightThemeLock();

  // ---- Legal documents: readable before sign-in, with an obvious way back --
  if (legalPage) {
    return (
      <div
        className="gh-entry-wall min-h-screen bg-slate-50 text-slate-900"
        dir={direction}
        style={{ colorScheme: 'light' }}
      >
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-medical-500 to-medical-800 text-white shadow-md shadow-medical-600/25">
                <Activity className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <span className="block text-base font-extrabold tracking-tight text-slate-900">
                  GlobalHealth
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-medical-700">
                  Public legal document
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onReturnToSignIn}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-medical-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-medical-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Sign In
            </button>
          </div>
        </header>

        <div className="mx-auto w-full max-w-4xl px-4 pt-5">
          <p
            role="note"
            className="flex items-start gap-2 rounded-xl border border-medical-200 bg-medical-50 px-3.5 py-2.5 text-xs leading-relaxed text-medical-900"
          >
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-medical-600" />
            You can review this document now — sign in with your own account to
            enter GlobalHealth.
          </p>
        </div>

        <main className="pb-10">
          {legalPage === 'terms' ? (
            <TermsPage onNavigate={onReturnToSignIn} />
          ) : (
            <PrivacyPolicyPage onNavigate={onReturnToSignIn} />
          )}
        </main>
      </div>
    );
  }

  // ---- Default: the full sign-in experience (light-themed, no way around) --
  return (
    <div
      className="gh-entry-wall min-h-screen bg-gradient-to-b from-medical-50/70 via-white to-medical-50/50 text-slate-900"
      dir={direction}
      style={{ colorScheme: 'light' }}
    >
      <Suspense fallback={<EntrySplash message="Preparing the secure sign-in page…" direction={direction} />}>
        <AuthPage
          entryWall
          entryNotice={
            sessionExpired
              ? 'Your session has expired. Please sign in again to continue.'
              : undefined
          }
          initialView="login"
          currentUser={null}
          onLoginSuccess={onLoginSuccess}
          onLogout={async () => {
            /* Signed out already — nothing to do on the wall. */
          }}
          onUpdateUser={() => {
            /* Account security edits are only available after sign-in. */
          }}
          onReturnToHome={onReturnToSignIn}
          onNavigateToDashboard={onReturnToSignIn}
          onNavigateToPortal={onNavigateToPortal}
          onOpenLegalPage={onOpenLegalPage}
        />
      </Suspense>
    </div>
  );
};
