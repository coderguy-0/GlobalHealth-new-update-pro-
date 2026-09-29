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
  Loader2,
  User,
  Stethoscope,
  Building2,
  Pill,
  Newspaper,
} from 'lucide-react';
import { useAuth, toUserAccount } from '../../context/AuthContext';
import { apiFetch } from '../../services/authClient';
import type { UserAccount } from '../../types';
import {
  RolePortalAuthPanel,
  AuthRoleKey,
  RoleAuthMode,
  TargetPortalRoute,
} from './RolePortalAuthPanel';

interface AuthGateProps {
  onAuthenticated?: (user: UserAccount) => void;
  onOpenFullSignup?: () => void;
  onOpenForgotPassword?: () => void;
  onNavigateToPortal?: (portal: TargetPortalRoute) => void;
}

const GATE_ROLES: Array<{ key: AuthRoleKey; label: string; icon: React.ReactNode }> = [
  { key: 'user', label: 'User', icon: <User className="h-3.5 w-3.5" /> },
  { key: 'doctor', label: 'Doctor', icon: <Stethoscope className="h-3.5 w-3.5" /> },
  { key: 'hospital', label: 'Hospital', icon: <Building2 className="h-3.5 w-3.5" /> },
  { key: 'pharmacy', label: 'Pharmacy', icon: <Pill className="h-3.5 w-3.5" /> },
  { key: 'news', label: 'News', icon: <Newspaper className="h-3.5 w-3.5" /> },
];

export const AuthGate: React.FC<AuthGateProps> = ({
  onAuthenticated,
  onOpenFullSignup,
  onOpenForgotPassword,
  onNavigateToPortal,
}) => {
  const { gateOpen, closeGate, gateMode, setGateMode, gateIntent, authenticate } = useAuth();
  const [selectedRole, setSelectedRole] = useState<AuthRoleKey>('user');
  const [mode, setLocalMode] = useState<'login' | 'signup'>('login');
  const [roleMode, setRoleMode] = useState<RoleAuthMode>('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const activeMode = gateMode || mode;
  const switchMode = (m: 'login' | 'signup') => {
    setLocalMode(m);
    setGateMode(m);
    setRoleMode(m);
    setError('');
  };

  if (!gateOpen) return null;

  const finish = (user: UserAccount, token: string, publicUser?: unknown) => {
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
        body: { identifier: identifier.trim(), password, rememberMe: true },
      });
      if (res?.success && res.user && res.token) {
        finish(toUserAccount(res.user), res.token, res.user);
      } else if (res?.verificationRequired) {
        setError('Please verify your email first. Open the full sign-in page to enter your verification code.');
      } else {
        setError(res?.error || 'Unable to sign in. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handlePortalNavigate = (portal: TargetPortalRoute) => {
    closeGate();
    if (onNavigateToPortal) {
      onNavigateToPortal(portal);
    } else {
      window.location.hash = portal;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-gate-title"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 my-8">
        <button
          onClick={closeGate}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/60 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="relative bg-gradient-to-br from-medical-700 via-teal-700 to-medical-800 px-6 pt-7 pb-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 id="auth-gate-title" className="text-lg font-bold leading-tight">
                Sign In, Sign Up &amp; Recover by Role
              </h2>
              <p className="text-xs text-medical-50/90">
                <ShieldCheck className="mr-1 inline h-3.5 w-3.5" />
                Each account has its own private workspace
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-medical-50/95">
            {gateIntent?.feature
              ? `Sign in or create an account to ${gateIntent.feature}.`
              : 'Select your role below to sign in, log in, sign up, or recover your account and go directly to your portal website.'}
          </p>

          {/* Role Selector Strip */}
          <div className="mt-4 grid grid-cols-5 gap-1 rounded-2xl bg-black/20 p-1">
            {GATE_ROLES.map((r) => {
              const active = selectedRole === r.key;
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setSelectedRole(r.key)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 px-1 text-[11px] font-bold transition cursor-pointer ${
                    active ? 'bg-white text-medical-800 shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {r.icon}
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode Tabs */}
        {selectedRole === 'user' ? (
          <div className="grid grid-cols-3 gap-1 border-b border-slate-100 px-6 pt-3">
            <button
              onClick={() => switchMode('login')}
              className={`flex items-center justify-center gap-1.5 rounded-t-xl border-b-2 px-2 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeMode === 'login'
                  ? 'border-medical-600 text-medical-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <LogIn className="h-3.5 w-3.5" /> Sign In / Log In
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex items-center justify-center gap-1.5 rounded-t-xl border-b-2 px-2 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeMode === 'signup'
                  ? 'border-medical-600 text-medical-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" /> Sign Up
            </button>
            <button
              onClick={() => {
                closeGate();
                onOpenForgotPassword?.();
              }}
              className="flex items-center justify-center gap-1.5 rounded-t-xl border-b-2 border-transparent px-2 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition cursor-pointer"
            >
              Recover
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 border-b border-slate-100 px-6 pt-3">
            {(['login', 'signup', 'recover'] as RoleAuthMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setRoleMode(m)}
                className={`flex items-center justify-center gap-1.5 rounded-t-xl border-b-2 px-2 py-2.5 text-xs font-bold transition cursor-pointer ${
                  roleMode === m
                    ? 'border-medical-600 text-medical-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {m === 'login' ? 'Sign In / Log In' : m === 'signup' ? 'Sign Up' : 'Recover'}
              </button>
            ))}
          </div>
        )}

        <div className="px-6 py-5 max-h-[72vh] overflow-y-auto">
          {selectedRole === 'user' ? (
            <>
              {error && (
                <div
                  role="alert"
                  className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700"
                >
                  <span className="mt-0.5">{error}</span>
                </div>
              )}

              {activeMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Email or username
                    </span>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        autoComplete="username"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-medical-500 focus:bg-white focus:ring-2 focus:ring-medical-500/30"
                        placeholder="sarah.jenkins@example.com"
                      />
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Password
                    </span>
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </label>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifier('sarah.jenkins@example.com');
                        setPassword('Password123!');
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-medical-700 cursor-pointer"
                    >
                      Fill Demo Patient
                    </button>
                    <button
                      type="button"
                      onClick={onOpenForgotPassword}
                      className="text-xs font-semibold text-medical-700 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={busy}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-medical-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-medical-700 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:ring-offset-2 disabled:opacity-60 cursor-pointer"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                    Sign In to User Portal
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    New to GlobalHealth?{' '}
                    <button
                      type="button"
                      onClick={onOpenFullSignup}
                      className="font-semibold text-medical-700 hover:underline cursor-pointer"
                    >
                      Create an account
                    </button>
                  </p>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-medical-200 bg-medical-50/70 p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-medical-900">
                      <UserPlus className="h-4 w-4" />
                      <span>Create your GlobalHealth User Portal account</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-medical-900/80">
                      Create your personal health account to unlock your isolated EHR dashboard, appointments, medication reminders, and saved medical library.
                    </p>
                    <button
                      type="button"
                      onClick={onOpenFullSignup}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-medical-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-medical-700 cursor-pointer"
                    >
                      <UserPlus className="h-4 w-4" />
                      Continue to User Sign Up
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <RolePortalAuthPanel
              key={selectedRole}
              role={selectedRole}
              mode={roleMode}
              onModeChange={setRoleMode}
              onSuccessNavigate={handlePortalNavigate}
            />
          )}
        </div>
      </div>
    </div>
  );
};
