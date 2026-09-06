import React from 'react';
import {
  LayoutDashboard,
  Bookmark,
  HeartPulse,
  CalendarCheck,
  FileHeart,
  ArrowRight,
  LogIn,
  UserPlus,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { NavigationTab, DashboardViewMode, UserAccount } from '../../types';
import { Button } from '../ui/Button';

interface PersonalHealthSpaceProps {
  onTabChange: (tab: NavigationTab, dashboardMode?: DashboardViewMode) => void;
  currentUser: UserAccount | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

const FEATURES = [
  { icon: <Bookmark className="h-4 w-4" />, label: 'Saved clinical library' },
  { icon: <HeartPulse className="h-4 w-4" />, label: 'Saved medicines & doctors' },
  { icon: <CalendarCheck className="h-4 w-4" />, label: 'Appointment scheduling' },
  { icon: <FileHeart className="h-4 w-4" />, label: 'FHIR R4 digital health records' },
];

export const PersonalHealthSpace: React.FC<PersonalHealthSpaceProps> = ({
  onTabChange,
  currentUser,
  onOpenAuth,
}) => {
  const loggedIn = !!currentUser;

  return (
    <section className="gh-section bg-slate-50/70" aria-labelledby="personal-space-title">
      <div className="gh-container">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-medical-950 to-slate-950 p-8 sm:p-12 lg:p-16 shadow-2xl text-white">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" aria-hidden="true" />

          <div className="relative grid items-center gap-10 lg:grid-cols-12">
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1 text-xs font-bold text-cyan-300">
                <Lock className="h-3.5 w-3.5" />
                MedAuth Zero-Knowledge Patient Vault
              </div>

              <h2 id="personal-space-title" className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {loggedIn
                  ? `Welcome back, ${currentUser?.fullName?.split(' ')[0] || 'Member'}.`
                  : 'Your Private Personal Health Space & Records'}
              </h2>

              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                {loggedIn
                  ? 'Your clinical dashboard, active doctor consents, prescription tokens, and saved medical articles are secure and ready.'
                  : 'Maintain complete ownership over your medical history, diagnostic reports, physician consents, and book care effortlessly.'}
              </p>

              <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-xl">
                {FEATURES.map((f) => (
                  <li
                    key={f.label}
                    className="flex items-center gap-2.5 rounded-2xl bg-white/10 border border-white/10 p-3 text-xs font-semibold text-slate-100 backdrop-blur-sm"
                  >
                    <span className="text-cyan-400">{f.icon}</span>
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Symmetrical Action Card (5 cols) */}
            <div className="lg:col-span-5 lg:justify-self-end w-full max-w-md">
              <div className="rounded-3xl bg-white p-6 sm:p-8 text-slate-900 shadow-2xl border border-slate-100">
                {loggedIn ? (
                  <div className="space-y-3.5">
                    <div className="border-b border-slate-100 pb-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Signed In As</p>
                      <p className="text-base font-extrabold text-slate-900">{currentUser.fullName}</p>
                    </div>

                    <Button
                      fullWidth
                      size="lg"
                      variant="primary"
                      onClick={() => onTabChange('dashboard', 'dashboard')}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Open Patient Dashboard
                    </Button>
                    <Button
                      fullWidth
                      size="lg"
                      variant="secondary"
                      onClick={() => onTabChange('dashboard', 'ehr')}
                    >
                      <FileHeart className="h-4 w-4 text-emerald-600" />
                      View Health Records (EHR)
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="border-b border-slate-100 pb-3">
                      <p className="text-base font-extrabold text-slate-900">Access Your Records</p>
                      <p className="text-xs text-slate-500 mt-0.5">Free, secure, and private.</p>
                    </div>

                    <Button
                      fullWidth
                      size="lg"
                      variant="primary"
                      onClick={() => onOpenAuth('signup')}
                    >
                      <UserPlus className="h-4 w-4" />
                      Create Free Patient Account
                    </Button>
                    <Button
                      fullWidth
                      size="lg"
                      variant="secondary"
                      onClick={() => onOpenAuth('login')}
                    >
                      <LogIn className="h-4 w-4" />
                      Sign In to Account
                    </Button>
                    <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400 pt-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Zero personal data sold · HIPAA aligned</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
