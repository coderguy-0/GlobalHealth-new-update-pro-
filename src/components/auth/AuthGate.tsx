import React, { useState } from 'react';
import {
  Lock,
  X,
  LogIn,
  UserPlus,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useAuth, toUserAccount } from '../../context/AuthContext';
import { apiFetch } from '../../services/authClient';
import type { UserAccount } from '../../types';

interface AuthGateProps {
  // Allows a host view to react after successful auth (e.g. resume booking).
  onAuthenticated?: (user: UserAccount) => void;
  // Registration happens on the dedicated full-page Create Account flow
  // (stepped, with explicit narrow consent) — never an inline blanket consent.
  onOpenFullSignup?: () => void;
  // Password recovery uses the same unified auth flow (full page).
  onOpenForgotPassword?: () => void;
}

// A single, consistent authentication gate used across the entire app.
// Used both as the global "this feature requires an account" modal and as the
// full-page protected-route experience.
export const AuthGate: React.FC<AuthGateProps> = ({ onAuthenticated, onOpenFullSignup, onOpenForgotPassword }) => {
  const { gateOpen, closeGate, gateMode, setGateMode, gateIntent, authenticate } = useAuth();
  const [mode, setLocalMode] = useState<'login' | 'signup'>('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  // Signup fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const activeMode = gateMode || mode;
  const switchMode = (m: 'login' | 'signup') => {
    setLocalMode(m);
    setGateMode(m);
    setError('');
  };

  if (!gateOpen) return null;

  const finish = (user: UserAccount, token: string, publicUser?: unknown) => {
    // Store the full server account too so the unified session carries the
    // complete identity (permissions, security flags) into every feature.
    authenticate(user, token, publicUser as any);
    onAuthenticated?.(user);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!identifier.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setBusy(true);
    try {
      const res = await apiFetch<{
        success: boolean;
        error?: string;
        user?: any;
        token?: string;
        verificationRequired?: boolean;
      }>('/api/auth/login', {
        method: 'POST',
        auth: false,
        body: { identifier: identifier.trim(), password, rememberMe: true }
      });
      if (res?.success && res.user && res.token) {
        finish(toUserAccount(res.user), res.token, res.user);
      } else if (res?.verificationRequired) {
        setError('Please verify your email first. A new account needs email verification.');
      } else {
        setError(res?.error || 'Unable to sign in. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-gate-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 my-8">
        <button
          onClick={closeGate}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/60"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="relative bg-gradient-to-br from-medical-700 via-teal-700 to-medical-800 px-6 pt-8 pb-6 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h2 id="auth-gate-title" className="text-lg font-bold leading-tight">
                {activeMode === 'login' ? 'Sign in to continue' : 'Create your account'}
              </h2>
              <p className="text-sm text-medical-50/90">
                <ShieldCheck className="mr-1 inline h-3.5 w-3.5" />
                Secured by GlobalHealth
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-medical-50/95">
            {gateIntent?.feature
              ? `Sign in or create an account to ${gateIntent.feature}. Your health information stays private and secure.`
              : 'Sign in or create an account to access your personal healthcare features and participate in the GlobalHealth community.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2 border-b border-slate-100 px-6 pt-4">
          <button
            onClick={() => switchMode('login')}
            className={`flex items-center justify-center gap-2 rounded-t-xl border-b-2 px-3 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-medical-500 ${
              activeMode === 'login'
                ? 'border-medical-600 text-medical-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <LogIn className="h-4 w-4" /> Log In
          </button>
          <button
            onClick={() => switchMode('signup')}
            className={`flex items-center justify-center gap-2 rounded-t-xl border-b-2 px-3 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-medical-500 ${
              activeMode === 'signup'
                ? 'border-medical-600 text-medical-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserPlus className="h-4 w-4" /> Create Account
          </button>
        </div>

        <div className="px-6 py-6">
          {error && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700"
            >
              <span className="mt-0.5">{error}</span>
            </div>
          )}

          {activeMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Email or username</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="username"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-medical-500 focus:bg-white focus:ring-2 focus:ring-medical-500/30"
                    placeholder="you@example.com"
                  />
                </div>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Password</span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-medical-500 focus:bg-white focus:ring-2 focus:ring-medical-500/30"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={onOpenForgotPassword}
                  className="text-xs font-semibold text-medical-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-medical-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-medical-700 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:ring-offset-2 disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Log In
              </button>
              <p className="text-center text-sm text-slate-500">
                New to GlobalHealth?{' '}
                <button type="button" onClick={onOpenFullSignup} className="font-semibold text-medical-700 hover:underline">
                  Create an account
                </button>
              </p>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-medical-200 bg-medical-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-medical-900">
                  <UserPlus className="h-4 w-4" />
                  <span>Create your GlobalHealth account</span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-medical-900/80">
                  Account creation is a three-step process on a dedicated page: your basic details, a secure password
                  (with a strength indicator), then a review step where you explicitly accept the GlobalHealth Terms
                  &amp; Conditions and acknowledge the Privacy Policy. Consent is specific and never pre-ticked.
                </p>
                <button
                  type="button"
                  onClick={onOpenFullSignup}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-medical-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-medical-700 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:ring-offset-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Continue to Create Account
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <p className="text-center text-sm text-slate-500">
                Already have an account?{' '}
                <button type="button" onClick={() => switchMode('login')} className="font-semibold text-medical-700 hover:underline">
                  Log in <ArrowRight className="inline h-3.5 w-3.5" />
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
