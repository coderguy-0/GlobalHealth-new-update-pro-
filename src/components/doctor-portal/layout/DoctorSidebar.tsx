import React from 'react';
import {
  LayoutDashboard, CalendarClock, MessagesSquare, Bell, FolderHeart, Stethoscope,
  ClipboardList, FlaskConical, Activity, ArrowLeftRight, Video, UserRound,
  IndianRupee, Sparkles, CalendarDays, ScrollText, Settings, LogOut, BadgeCheck,
} from 'lucide-react';
import { WorkspaceView, useDoctorPortal } from '../doctorPortalData';
import { useClinicalWorkspace } from '../doctorClinicalData';

export interface NavItem {
  view: WorkspaceView;
  label: string;
  icon: React.ReactNode;
  group: string;
  live?: boolean;
  permission?: string;
}

export const DOCTOR_NAV: NavItem[] = [
  { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, group: 'Home' },
  { view: 'patients_appointments', label: 'Patients & Appointments', icon: <CalendarClock className="h-4 w-4" />, group: 'Patient & Communication' },
  { view: 'messages', label: 'Messages & Communication', icon: <MessagesSquare className="h-4 w-4" />, group: 'Patient & Communication' },
  { view: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" />, group: 'Patient & Communication' },
  { view: 'ehr', label: 'Patient Profile (EHR)', icon: <FolderHeart className="h-4 w-4" />, group: 'Clinical Care' },
  { view: 'consultations', label: 'Clinical Consultation', icon: <Stethoscope className="h-4 w-4" />, group: 'Clinical Care' },
  { view: 'prescriptions', label: 'e-Prescriptions', icon: <ClipboardList className="h-4 w-4" />, group: 'Clinical Care' },
  { view: 'labs', label: 'Lab Reports', icon: <FlaskConical className="h-4 w-4" />, group: 'Clinical Care' },
  { view: 'vitals', label: 'Vitals & Trends', icon: <Activity className="h-4 w-4" />, group: 'Clinical Care' },
  { view: 'referrals', label: 'Referrals', icon: <ArrowLeftRight className="h-4 w-4" />, group: 'Clinical Care' },
  { view: 'telemedicine', label: 'Telemedicine Suite', icon: <Video className="h-4 w-4" />, group: 'Virtual Care & Practice', live: true },
  { view: 'profile', label: 'Professional Profile', icon: <UserRound className="h-4 w-4" />, group: 'Virtual Care & Practice' },
  { view: 'billing', label: 'Billing & Earnings', icon: <IndianRupee className="h-4 w-4" />, group: 'Virtual Care & Practice' },
  { view: 'ai', label: 'AI Clinical Assistant', icon: <Sparkles className="h-4 w-4" />, group: 'Virtual Care & Practice' },
  { view: 'schedule', label: 'Schedule & Availability', icon: <CalendarDays className="h-4 w-4" />, group: 'Virtual Care & Practice' },
  { view: 'audit', label: 'Security & Audit Logs', icon: <ScrollText className="h-4 w-4" />, group: 'Security & Administration' },
  { view: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" />, group: 'Security & Administration' },
];

export const NAV_GROUPS = ['Home', 'Patient & Communication', 'Clinical Care', 'Virtual Care & Practice', 'Security & Administration'];

interface DoctorSidebarProps {
  view: WorkspaceView;
  onNavigate: (v: WorkspaceView) => void;
  onLogout: () => void;
  collapsed?: boolean;
}

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({ view, onNavigate, onLogout, collapsed = false }) => {
  const { doctor, telemedicineSessions, notifications, messages } = useDoctorPortal();
  const { selectedPatientId } = useClinicalWorkspace();
  const liveCount = telemedicineSessions.filter((s) => s.status === 'waiting' || s.status === 'live').length;
  const unreadNotif = notifications.filter((n) => !n.read).length;
  const unreadMsg = messages.filter((m) => !m.read).length;

  const badgeFor = (item: NavItem): number => {
    if (item.view === 'notifications') return unreadNotif;
    if (item.view === 'messages') return unreadMsg;
    if (item.view === 'telemedicine') return liveCount;
    return 0;
  };

  return (
    <aside className={`flex h-full flex-col border-r border-[#E3E8EF] bg-white ${collapsed ? 'w-[72px]' : 'w-[272px]'}`}>
      <div className={`${collapsed ? 'px-2' : 'px-4'} border-b border-[#E3E8EF] py-4`}>
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#0B1F3A] text-white">
            <Activity className="h-4 w-4" />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold tracking-tight text-[#162235]">GLOBALHEALTH</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">Doctor Portal</p>
            </div>
          )}
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3" aria-label="Doctor portal navigation">
        {NAV_GROUPS.map((group) => {
          const items = DOCTOR_NAV.filter((n) => n.group === group);
          if (!items.length) return null;
          return (
            <div key={group} className="mb-3">
              {!collapsed && (
                <p className="px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A97A8]">{group}</p>
              )}
              <div className="space-y-0.5">
                {items.map((item) => {
                  const active = view === item.view || (item.view === 'ehr' && view === 'ehr' && !!selectedPatientId);
                  const count = badgeFor(item);
                  return (
                    <button
                      key={item.view}
                      type="button"
                      title={item.label}
                      onClick={() => onNavigate(item.view)}
                      aria-current={active ? 'page' : undefined}
                      className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-semibold transition ${
                        active
                          ? 'bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200'
                          : 'text-[#607086] hover:bg-slate-50 hover:text-[#162235]'
                      } ${collapsed ? 'justify-center' : ''}`}
                    >
                      <span className={active ? 'text-emerald-700' : 'text-[#8A97A8]'}>{item.icon}</span>
                      {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
                      {!collapsed && item.live && liveCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
                        </span>
                      )}
                      {!collapsed && !item.live && count > 0 && (
                        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">{count}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className={`${collapsed ? 'p-2' : 'p-3'} border-t border-[#E3E8EF]`}>
        <div className={`rounded-2xl bg-emerald-600 text-white ${collapsed ? 'p-2' : 'p-3'}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-[11px] font-bold">
              {doctor.displayName.split(' ').map((x) => x[0]).slice(0, 2).join('')}
            </span>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-extrabold">{doctor.displayName}</p>
                <p className="flex items-center gap-1 text-[10px] font-semibold text-emerald-50">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-200" /> Online
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="mt-2 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold">
                <BadgeCheck className="h-3 w-3" /> Verified
              </span>
              <button type="button" onClick={onLogout} className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold text-emerald-50 hover:bg-white/10">
                <LogOut className="h-3 w-3" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
