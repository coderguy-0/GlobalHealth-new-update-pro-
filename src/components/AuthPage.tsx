import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ArrowLeft,
  HelpCircle,
  Calendar,
  Bookmark,
  Shield,
  Activity,
  User,
  Stethoscope,
  Building2,
  Pill,
  Newspaper,
  ArrowRight,
} from 'lucide-react';
import { AuthSubView, PublicUserAccount } from '../types/auth';
import { LoginForm } from './auth/LoginForm';
import { SignUpForm } from './auth/SignUpForm';
import { ForgotPasswordForm } from './auth/ForgotPasswordForm';
import { ResetPasswordForm } from './auth/ResetPasswordForm';
import { VerifyEmailPhoneForm } from './auth/VerifyEmailPhoneForm';
import { AccountSecurityView } from './auth/AccountSecurityView';
import { LogoutSuccessView } from './auth/LogoutSuccessView';
import { AuthHelpModal } from './auth/AuthHelpModal';
import { DoctorAvatar, AvatarExpression } from './auth/DoctorAvatar';
import {
  RolePortalAuthPanel,
  AuthRoleKey,
  RoleAuthMode,
  TargetPortalRoute,
} from './auth/RolePortalAuthPanel';

interface AuthPageProps {
  initialView?: AuthSubView;
  initialRole?: AuthRoleKey;
  currentUser: PublicUserAccount | null;
  onLoginSuccess: (user: PublicUserAccount, token?: string) => void;
  onLogout: () => void;
  onUpdateUser: (user: PublicUserAccount) => void;
  onReturnToHome: () => void;
  onNavigateToDashboard: () => void;
  /** Route directly to the authenticated portal website for the selected role. */
  onNavigateToPortal?: (portal: TargetPortalRoute) => void;
  /** Open a full legal page (Terms / Privacy Policy). */
  onOpenLegalPage?: (tab: 'terms' | 'privacy-policy') => void;
}

interface AvatarState {
  expression: AvatarExpression;
  message: string | null | undefined;
}

const ROLE_OPTIONS: Array<{
  key: AuthRoleKey;
  label: string;
  shortLabel: string;
  portalName: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    key: 'user',
    label: 'User Portal',
    shortLabel: 'User Portal',
    portalName: 'Personal Health & EHR Portal',
    description: 'Patient health records, appointments, prescriptions, lab reports & saved library.',
    icon: <User className="h-4 w-4" />,
  },
  {
    key: 'doctor',
    label: 'Doctor Portal',
    shortLabel: 'Doctor Portal',
    portalName: 'Physician Clinical Workspace',
    description: 'Licensed physician EHR, consultations, schedule, telemedicine & e-prescriptions.',
    icon: <Stethoscope className="h-4 w-4" />,
  },
  {
    key: 'hospital',
    label: 'Hospital Portal',
    shortLabel: 'Hospital Portal',
    portalName: 'Hospital Operations & Registry',
    description: 'Hospital profile, departments, doctors, bed telemetry, blood bank & tariffs.',
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    key: 'pharmacy',
    label: 'Pharmacy Portal',
    shortLabel: 'Pharmacy Portal',
    portalName: 'Pharmacy Partner Dispensary',
    description: 'Dispensary inventory, prescription verification, multi-branch orders & settlements.',
    icon: <Pill className="h-4 w-4" />,
  },
  {
    key: 'news',
    label: 'News Management',
    shortLabel: 'News Management',
    portalName: 'Editorial CMS & Health Authority',
    description: 'Medical journalism CMS, peer review workflow & Verified Authority publishing.',
    icon: <Newspaper className="h-4 w-4" />,
  },
];

/** The avatar's default mood for each authentication sub-view. */
function avatarStateFor(view: AuthSubView): AvatarState {
  switch (view) {
    case 'signup':
      return { expression: 'signup', message: 'Let’s get your GlobalHealth account ready.' };
    case 'forgot-password':
      return { expression: 'recover', message: 'No worries. We’ll help you recover your account securely.' };
    case 'reset-password':
      return { expression: 'recover', message: 'One last step — create your new password.' };
    case 'verify-email':
    case 'verify-phone':
      return { expression: 'verifying', message: 'Almost there — let’s verify your account.' };
    case 'logout-success':
      return { expression: 'idle', message: 'You’re safely signed out. See you soon!' };
    case 'security':
      return { expression: 'idle', message: null };
    default:
      return { expression: 'login', message: null };
  }
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialView = 'login',
  initialRole = 'user',
  currentUser,
  onLoginSuccess,
  onLogout,
  onUpdateUser,
  onReturnToHome,
  onNavigateToDashboard,
  onNavigateToPortal,
  onOpenLegalPage,
}) => {
  const [selectedRole, setSelectedRole] = useState<AuthRoleKey>(() => {
    try {
      const hash = window.location.hash;
      const qIdx = hash.indexOf('?');
      if (qIdx >= 0) {
        const params = new URLSearchParams(hash.slice(qIdx + 1));
        const r = params.get('role') as AuthRoleKey | null;
        if (r && ['user', 'doctor', 'hospital', 'pharmacy', 'news'].includes(r)) {
          return r;
        }
      }
    } catch {
      // ignore
    }
    return initialRole;
  });

  const [activeSubView, setActiveSubView] = useState<AuthSubView>(initialView);
  const [roleMode, setRoleMode] = useState<RoleAuthMode>(() =>
    initialView === 'signup'
      ? 'signup'
      : initialView === 'forgot-password' || initialView === 'reset-password'
        ? 'recover'
        : 'login'
  );
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [avatarState, setAvatarState] = useState<AvatarState>(() => avatarStateFor(activeSubView));

  // Verification state handover
  const [verificationData, setVerificationData] = useState<{
    userId: string;
    contactTarget?: string;
    type: 'email' | 'phone';
    demoVerificationCode?: string;
  } | null>(null);

  // Reset password token handover
  const [recoveryToken, setRecoveryToken] = useState<string>('');

  useEffect(() => {
    if (initialView) {
      setActiveSubView(initialView);
      setRoleMode(
        initialView === 'signup'
          ? 'signup'
          : initialView === 'forgot-password' || initialView === 'reset-password'
            ? 'recover'
            : 'login'
      );
    }
  }, [initialView]);

  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  // The avatar adopts a mood per authentication page (never blocks the form).
  useEffect(() => {
    setAvatarState(avatarStateFor(activeSubView));
  }, [activeSubView]);

  const routeToPortal = (portal: TargetPortalRoute) => {
    if (onNavigateToPortal) {
      onNavigateToPortal(portal);
      return;
    }
    if (portal === 'dashboard') {
      onNavigateToDashboard();
      return;
    }
    window.location.hash = portal;
  };

  // If user is already authenticated and opens security
  if (currentUser && activeSubView === 'security') {
    return (
      <div className="min-h-screen bg-slate-50 py-6">
        <AccountSecurityView
          currentUser={currentUser}
          onUpdateUser={onUpdateUser}
          onBackToDashboard={onNavigateToDashboard}
          onOpenLegalPage={onOpenLegalPage}
          onLogout={() => {
            onLogout();
            setActiveSubView('logout-success');
          }}
        />
        <AuthHelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      </div>
    );
  }

  const switchView = (view: AuthSubView) => {
    setActiveSubView(view);
    setRoleMode(
      view === 'signup'
        ? 'signup'
        : view === 'forgot-password' || view === 'reset-password'
          ? 'recover'
          : 'login'
    );
  };

  const handleRoleModeSwitch = (mode: RoleAuthMode) => {
    setRoleMode(mode);
    if (mode === 'login') setActiveSubView('login');
    else if (mode === 'signup') setActiveSubView('signup');
    else setActiveSubView('forgot-password');
  };

  const activeRoleMeta = ROLE_OPTIONS.find((r) => r.key === selectedRole) || ROLE_OPTIONS[0];

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-b from-medical-50/70 via-white to-medical-50/50">
      {/* Subtle blue atmosphere — soft radial glows, extremely light */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-medical-200/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-medical-100/60 blur-3xl" />
      </div>

      {/* 1. Header Navigation Bar (Focused for Authentication) */}
      <header className="relative z-30 w-full border-b border-medical-100/80 bg-white/85 backdrop-blur-md px-4 lg:px-8 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            onClick={onReturnToHome}
            className="group flex cursor-pointer items-center gap-2.5 text-left focus-visible:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-medical-500 to-medical-800 text-white shadow-md shadow-medical-600/25 transition group-hover:scale-105">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-lg font-extrabold leading-tight tracking-tight text-slate-900">
                GlobalHealth
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-medical-700">
                Unified Role-Based Portal Gateway
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-medical-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-medical-300 hover:text-medical-800"
            >
              <HelpCircle className="h-3.5 w-3.5 text-medical-600" />
              <span className="hidden sm:inline">Security & Help</span>
            </button>

            <button
              type="button"
              onClick={onReturnToHome}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-medical-50 px-3.5 py-1.5 text-xs font-bold text-medical-800 transition hover:bg-medical-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to GlobalHealth</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Authentication Surface */}
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid w-full max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Column: Role Directory + Animated Doctor Avatar (desktop) */}
          <div className="hidden flex-col justify-between space-y-6 pr-2 text-left lg:col-span-5 lg:flex">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-medical-200 bg-white px-3 py-1 text-xs font-bold text-medical-800 shadow-2xs">
                <ShieldCheck className="h-3.5 w-3.5 text-medical-600" />
                <span>Every account has its own private workspace</span>
              </div>
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900">
                Sign In, Sign Up &amp; Recover by Your Role
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Choose your portal below to sign in, log in, register a new account, or recover access. You will be routed directly to your dedicated portal website and isolated private workspace.
              </p>
            </div>

            {/* Interactive Role Directory Cards on Desktop */}
            <div className="space-y-2">
              <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Select Your Portal Website ({ROLE_OPTIONS.length} Dedicated Portals)
              </span>
              {ROLE_OPTIONS.map((item) => {
                const isActive = selectedRole === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedRole(item.key)}
                    className={`w-full flex items-start gap-3 rounded-2xl border p-3 text-left transition cursor-pointer ${
                      isActive
                        ? 'border-medical-500 bg-medical-50/70 shadow-sm ring-2 ring-medical-500/15'
                        : 'border-slate-200/90 bg-white hover:border-medical-200 hover:bg-slate-50/70'
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${
                        isActive
                          ? 'border-medical-500 bg-medical-600 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-900">{item.label}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-medical-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.portalName}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-snug text-slate-500 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Animated healthcare avatar — friendly, calm, persistent */}
            <div className="flex justify-center py-1">
              <div className="gh-av-frame relative">
                <DoctorAvatar expression={avatarState.expression} message={avatarState.message} size="md" />
              </div>
            </div>

            {/* Trust pillars */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-medical-100/80 bg-white p-2.5 shadow-2xs">
                <Bookmark className="h-4 w-4 text-medical-700 mb-1" />
                <h3 className="text-[11px] font-bold text-slate-900">Private Workspace</h3>
                <p className="text-[10px] leading-snug text-slate-500">
                  Isolated per-account records &amp; settings.
                </p>
              </div>
              <div className="rounded-xl border border-medical-100/80 bg-white p-2.5 shadow-2xs">
                <Calendar className="h-4 w-4 text-medical-700 mb-1" />
                <h3 className="text-[11px] font-bold text-slate-900">Direct Routing</h3>
                <p className="text-[10px] leading-snug text-slate-500">
                  Opens your role portal immediately.
                </p>
              </div>
              <div className="rounded-xl border border-medical-100/80 bg-white p-2.5 shadow-2xs">
                <Shield className="h-4 w-4 text-medical-700 mb-1" />
                <h3 className="text-[11px] font-bold text-slate-900">Role Security</h3>
                <p className="text-[10px] leading-snug text-slate-500">
                  Strict role separation &amp; audit logs.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="flex justify-center lg:col-span-7">
            <div className="relative w-full max-w-xl rounded-3xl border border-medical-100/90 bg-white p-5 shadow-lift sm:p-8">
              {/* Soft blue accent line on the card */}
              <div
                aria-hidden="true"
                className="absolute inset-x-8 top-0 h-1 rounded-b-full bg-gradient-to-r from-medical-400 via-medical-500 to-medical-700"
              />

              {/* Step 1: Role Selector Tabs (Visible on all screen sizes) */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    1. Choose Your Role &amp; Portal Website
                  </span>
                  <span className="text-[11px] font-bold text-medical-700">
                    Active: {activeRoleMeta.label}
                  </span>
                </div>
                <div
                  className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 rounded-2xl bg-slate-100/90 p-1.5"
                  role="tablist"
                  aria-label="Select portal role"
                >
                  {ROLE_OPTIONS.map((roleOpt) => {
                    const active = selectedRole === roleOpt.key;
                    return (
                      <button
                        key={roleOpt.key}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setSelectedRole(roleOpt.key)}
                        className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-center transition cursor-pointer ${
                          active
                            ? 'bg-medical-600 text-white shadow-sm font-extrabold'
                            : 'bg-white/70 text-slate-700 hover:bg-white hover:text-slate-900 font-bold'
                        }`}
                      >
                        {roleOpt.icon}
                        <span className="text-[11px] leading-tight">{roleOpt.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Action Switcher (Sign In / Log In | Sign Up | Recover) */}
              <div className="mb-6">
                <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 text-left">
                  2. Select Action for {activeRoleMeta.label}
                </span>
                <div
                  className="flex rounded-2xl bg-medical-50/80 p-1 text-xs font-bold text-slate-600"
                  role="tablist"
                  aria-label="Authentication action"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={roleMode === 'login'}
                    onClick={() => handleRoleModeSwitch('login')}
                    className={`flex-1 cursor-pointer rounded-xl py-2.5 transition ${
                      roleMode === 'login' ? 'bg-white text-medical-800 shadow-soft font-extrabold' : 'hover:text-slate-900'
                    }`}
                  >
                    Sign In / Log In
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={roleMode === 'signup'}
                    onClick={() => handleRoleModeSwitch('signup')}
                    className={`flex-1 cursor-pointer rounded-xl py-2.5 transition ${
                      roleMode === 'signup' ? 'bg-white text-medical-800 shadow-soft font-extrabold' : 'hover:text-slate-900'
                    }`}
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={roleMode === 'recover'}
                    onClick={() => handleRoleModeSwitch('recover')}
                    className={`flex-1 cursor-pointer rounded-xl py-2.5 transition ${
                      roleMode === 'recover' ? 'bg-white text-medical-800 shadow-soft font-extrabold' : 'hover:text-slate-900'
                    }`}
                  >
                    Recover
                  </button>
                </div>
              </div>

              {/* Active Session Banner if User is already logged into User Portal */}
              {selectedRole === 'user' && currentUser && activeSubView === 'login' && (
                <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-left">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                      Active User Portal Session
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Signed in as {currentUser.fullName} ({currentUser.email})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => routeToPortal('dashboard')}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer"
                  >
                    <span>Open User Portal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* View Router — Role-Specific Sign In, Sign Up & Recover */}
              {selectedRole === 'user' ? (
                <div key={activeSubView} className="gh-auth-view">
                  {activeSubView === 'login' && (
                    <LoginForm
                      onSuccess={(user, token) => {
                        onLoginSuccess(user, token);
                        routeToPortal('dashboard');
                      }}
                      onNavigate={(view) => switchView(view)}
                      onRequestHelp={() => setShowHelpModal(true)}
                      onOpenLegal={onOpenLegalPage}
                      onAvatarInteract={(expression, message) => setAvatarState({ expression, message })}
                      onRequiresVerification={(data) => {
                        setVerificationData({
                          userId: data.userId,
                          contactTarget: data.email || data.phone || 'your registered contact',
                          type: data.type,
                          demoVerificationCode: data.demoVerificationCode,
                        });
                        setActiveSubView(data.type === 'phone' ? 'verify-phone' : 'verify-email');
                      }}
                    />
                  )}

                  {activeSubView === 'signup' && (
                    <SignUpForm
                      onSuccess={(data) => {
                        setVerificationData({
                          userId: data.userId,
                          contactTarget: data.email,
                          type: data.type,
                          demoVerificationCode: data.demoVerificationCode,
                        });
                        setActiveSubView(data.type === 'phone' ? 'verify-phone' : 'verify-email');
                      }}
                      onNavigate={(view) => switchView(view)}
                      onRequestHelp={() => setShowHelpModal(true)}
                      onOpenLegal={onOpenLegalPage}
                      onAvatarInteract={(expression, message) => setAvatarState({ expression, message })}
                    />
                  )}

                  {activeSubView === 'forgot-password' && (
                    <ForgotPasswordForm
                      onNavigate={(view) => switchView(view)}
                      onRecoveryTokenGenerated={(token) => {
                        setRecoveryToken(token);
                      }}
                      onRequestHelp={() => setShowHelpModal(true)}
                      onOpenLegal={onOpenLegalPage}
                      onAvatarInteract={(expression, message) => setAvatarState({ expression, message })}
                    />
                  )}

                  {activeSubView === 'reset-password' && (
                    <ResetPasswordForm
                      initialToken={recoveryToken}
                      onSuccess={() => switchView('login')}
                      onOpenLegal={onOpenLegalPage}
                      onNavigate={(view) => switchView(view)}
                      onRequestHelp={() => setShowHelpModal(true)}
                      onAvatarInteract={(expression, message) => setAvatarState({ expression, message })}
                    />
                  )}

                  {(activeSubView === 'verify-email' || activeSubView === 'verify-phone') && (
                    <VerifyEmailPhoneForm
                      userId={verificationData?.userId || ''}
                      contactTarget={verificationData?.contactTarget || 'your registered email/number'}
                      type={activeSubView === 'verify-phone' ? 'phone' : 'email'}
                      demoCode={verificationData?.demoVerificationCode}
                      onSuccess={(user, token) => {
                        onLoginSuccess(user, token);
                        routeToPortal('dashboard');
                      }}
                      onNavigate={(view) => switchView(view)}
                      onRequestHelp={() => setShowHelpModal(true)}
                      onOpenLegal={onOpenLegalPage}
                    />
                  )}

                  {activeSubView === 'logout-success' && (
                    <LogoutSuccessView
                      onLoginAgain={() => switchView('login')}
                      onReturnHome={onReturnToHome}
                    />
                  )}
                </div>
              ) : (
                <RolePortalAuthPanel
                  key={selectedRole}
                  role={selectedRole}
                  mode={roleMode}
                  onModeChange={handleRoleModeSwitch}
                  onSuccessNavigate={(portal) => routeToPortal(portal)}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="relative z-10 w-full border-t border-medical-100/80 bg-white/80 px-4 py-4 text-center text-xs text-slate-500 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} GlobalHealth Portal. Unified Role-Based Access — User, Doctor, Hospital, Pharmacy &amp; News Management.
          </p>
          <div className="flex items-center gap-4 font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => onOpenLegalPage?.('privacy-policy')}
              className="cursor-pointer transition hover:text-medical-700"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onOpenLegalPage?.('terms')}
              className="cursor-pointer transition hover:text-medical-700"
            >
              Terms &amp; Conditions
            </button>
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="cursor-pointer transition hover:text-medical-700"
            >
              Security Policy
            </button>
          </div>
        </div>
      </footer>

      {/* Help Modal */}
      <AuthHelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </div>
  );
};
