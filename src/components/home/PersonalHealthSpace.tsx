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
} from 'lucide-react';
import { NavigationTab, DashboardViewMode, UserAccount } from '../../types';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

interface PersonalHealthSpaceProps {
  onTabChange: (tab: NavigationTab, dashboardMode?: DashboardViewMode) => void;
  currentUser: UserAccount | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

const FEATURES = [
  { icon: <Bookmark className="h-4 w-4" />, label: 'Saved health information' },
  { icon: <HeartPulse className="h-4 w-4" />, label: 'Saved medicines & doctors' },
  { icon: <CalendarCheck className="h-4 w-4" />, label: 'Appointments where supported' },
  { icon: <FileHeart className="h-4 w-4" />, label: 'Health records where supported' },
];

/** Section 18 — Personal health space promotion (auth-aware). */
export const PersonalHealthSpace: React.FC<PersonalHealthSpaceProps> = ({
  onTabChange,
  currentUser,
  onOpenAuth,
}) => {
  const loggedIn = !!currentUser;

  return (
    <section className="gh-section" aria-labelledby="personal-space-title">
      <div className="gh-container">
        <div className="relative overflow-hidden rounded-3xl border border-medical-100 bg-gradient-to-br from-medical-600 via-medical-700 to-medical-900 px-6 py-12 sm:px-10 lg:px-14">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-medical-500/30 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-medical-400/20 blur-3xl" aria-hidden="true" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                id="personal-space-title"
                eyebrow="Your account"
                title={loggedIn ? `Welcome back, ${currentUser?.fullName?.split(' ')[0] || 'there'}.` : 'Your personal health space'}
                description={
                  loggedIn
                    ? 'Your dashboard, saved library and health records are ready whenever you are.'
                    : 'Registered users can access appropriate personalized features like saved information, preferences, appointments and health records — kept private to your account.'
                }
              />

              <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {FEATURES.map((f) => (
                  <li key={f.label} className="flex items-center gap-2.5 rounded-xl bg-white/10 px-3.5 py-2.5 text-[13px] font-medium text-white">
                    <span className="text-medical-200">{f.icon}</span>
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:justify-self-end">
              <div className="rounded-2xl bg-white p-6 shadow-lift sm:min-w-[300px]">
                {loggedIn ? (
                  <div className="space-y-3">
                    <Button
                      fullWidth
                      size="lg"
                      onClick={() => onTabChange('dashboard', 'dashboard')}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Open your dashboard
                    </Button>
                    <Button
                      fullWidth
                      size="lg"
                      variant="secondary"
                      onClick={() => onTabChange('dashboard', 'saved')}
                    >
                      <Bookmark className="h-4 w-4" />
                      Saved library
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      fullWidth
                      size="lg"
                      onClick={() => onOpenAuth('signup')}
                    >
                      <UserPlus className="h-4 w-4" />
                      Create Your Account
                    </Button>
                    <Button
                      fullWidth
                      size="lg"
                      variant="secondary"
                      onClick={() => onOpenAuth('login')}
                    >
                      <LogIn className="h-4 w-4" />
                      Log In
                    </Button>
                    <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
                      <ArrowRight className="h-3 w-3" />
                      Free · private · takes under a minute
                    </p>
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
