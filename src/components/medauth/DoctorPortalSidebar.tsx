import React from 'react';
import {
  Stethoscope,
  Users,
  FileText,
  MessageSquareHeart,
  Pill,
  FlaskConical,
  Activity,
  Share2,
  MessageSquare,
  Video,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Calendar,
  Bell,
  Lock,
  Settings,
  LogOut,
  CheckCircle2,
  Copy,
  Check,
  X
} from 'lucide-react';
import { DoctorProfile } from '../../types/medauth';

export type DoctorPortalTab =
  | 'hub'
  | 'ehr'
  | 'consult'
  | 'rx'
  | 'labs'
  | 'vitals'
  | 'referrals'
  | 'messages'
  | 'telemedicine'
  | 'profile'
  | 'billing'
  | 'ai'
  | 'schedule'
  | 'notifications'
  | 'security'
  | 'settings';

interface DoctorPortalSidebarProps {
  doctor: DoctorProfile;
  currentTab: DoctorPortalTab;
  onSelectTab: (tab: DoctorPortalTab) => void;
  onLockSession: () => void;
  onOpenVerification?: () => void;
  onOpenConnectedSystems?: () => void;
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
  patientCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const DoctorPortalSidebar: React.FC<DoctorPortalSidebarProps> = ({
  doctor,
  currentTab,
  onSelectTab,
  onLockSession,
  onOpenVerification,
  onOpenConnectedSystems,
  unreadNotificationsCount = 2,
  unreadMessagesCount = 2,
  patientCount = 4,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const [copiedToken, setCopiedToken] = React.useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(doctor.integrationToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const navItems: {
    id: DoctorPortalTab;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeType?: 'emerald' | 'rose' | 'amber' | 'live';
  }[] = [
    {
      id: 'hub',
      label: 'Patients & Appointments',
      icon: <Users className="w-4 h-4 shrink-0" />,
      badge: `${patientCount} Patients`,
      badgeType: 'emerald'
    },
    {
      id: 'ehr',
      label: 'Patient Profile (EHR)',
      icon: <FileText className="w-4 h-4 shrink-0" />
    },
    {
      id: 'consult',
      label: 'Clinical Consultation',
      icon: <Stethoscope className="w-4 h-4 shrink-0" />
    },
    {
      id: 'rx',
      label: 'e-Prescriptions',
      icon: <Pill className="w-4 h-4 shrink-0" />
    },
    {
      id: 'labs',
      label: 'Lab Reports',
      icon: <FlaskConical className="w-4 h-4 shrink-0" />
    },
    {
      id: 'vitals',
      label: 'Vitals & Trends',
      icon: <Activity className="w-4 h-4 shrink-0" />
    },
    {
      id: 'referrals',
      label: 'Referrals',
      icon: <Share2 className="w-4 h-4 shrink-0" />
    },
    {
      id: 'messages',
      label: 'Messages & Comm',
      icon: <MessageSquare className="w-4 h-4 shrink-0" />,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      badgeType: 'amber'
    },
    {
      id: 'telemedicine',
      label: 'Telemedicine Suite',
      icon: <Video className="w-4 h-4 shrink-0" />,
      badge: 'Live',
      badgeType: 'live'
    },
    {
      id: 'profile',
      label: 'Professional Profile',
      icon: <ShieldCheck className="w-4 h-4 shrink-0" />
    },
    {
      id: 'billing',
      label: 'Billing & Earnings',
      icon: <CreditCard className="w-4 h-4 shrink-0" />
    },
    {
      id: 'ai',
      label: 'AI Clinical Assistant',
      icon: <Sparkles className="w-4 h-4 shrink-0" />
    },
    {
      id: 'schedule',
      label: 'Schedule & Availability',
      icon: <Calendar className="w-4 h-4 shrink-0" />
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4 shrink-0" />,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
      badgeType: 'rose'
    },
    {
      id: 'security',
      label: 'Security & Audit Logs',
      icon: <Lock className="w-4 h-4 shrink-0" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4 shrink-0" />
    }
  ];

  const content = (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden select-none">
      {/* Top Profile Card */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div
          onClick={onOpenVerification}
          className="flex items-start gap-3 cursor-pointer group hover:bg-slate-50 -m-2 p-2 rounded-2xl transition"
          title="Click to view Medical Board Credentials"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-extrabold text-slate-900 truncate leading-tight group-hover:text-emerald-800">
              {doctor.fullName}
            </h3>
            <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
              {doctor.post}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[10px] font-mono">
          <span className="text-slate-500">
            NPI: <strong className="text-slate-700">{doctor.npiNumber}</strong>
          </span>
          <button
            type="button"
            onClick={onOpenVerification}
            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold transition cursor-pointer"
            title="Click to inspect credentials"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>VERIFIED</span>
          </button>
        </div>
      </div>

      {/* Navigation Menu List */}
      <div className="flex-1 overflow-y-auto py-2 px-2.5 space-y-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className={isActive ? 'text-white' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ml-1.5 ${
                    isActive
                      ? 'bg-emerald-900 text-emerald-100'
                      : item.badgeType === 'live'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200 animate-pulse'
                      : item.badgeType === 'rose'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : item.badgeType === 'amber'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <button
            onClick={handleCopyToken}
            className="flex items-center gap-1 hover:text-emerald-700 transition cursor-pointer truncate"
            title="Click to copy API Token"
          >
            <span>Token: {doctor.integrationToken.substring(0, 10)}...</span>
            {copiedToken ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          </button>
          <span className="text-emerald-700 font-bold flex items-center gap-0.5">
            <Lock className="w-3 h-3" />
            <span>Private EHR</span>
          </span>
        </div>

        <button
          onClick={onLockSession}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Lock & Switch Doctor</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0 h-screen sticky top-0">
        {content}
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-10">
            <div className="absolute top-2 right-2 z-20">
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
};
