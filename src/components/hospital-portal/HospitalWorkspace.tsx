import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard, Building2, Users, CalendarClock, Clock3, Stethoscope, UserCog, DoorOpen,
  MapPin, ImageIcon, Award, FileText, CalendarDays, CalendarRange, ShieldCheck, ScrollText,
  BarChart3, History, KeyRound, Laptop, Lock, CircleHelp, LifeBuoy, Activity, ChevronDown,
  Search, Bell, LogOut, FlaskConical, ScanLine, Pill, Droplets, UserRound, ClipboardList,
} from 'lucide-react';
import { useHospitalPortal, WorkspaceView, VERIFICATION_LABEL, PUBLIC_STATUS_LABEL } from './hospitalPortalData';
import { PermissionGate, AccessDenied, usePortalRole } from '../portal/PermissionGate';
import { Permission } from '../../core/portalRoles';
import { HospitalDashboard } from './HospitalDashboard';
import { HospitalProfile } from './HospitalProfile';
import { HospitalDepartments } from './HospitalDepartments';
import { HospitalDoctors } from './HospitalDoctors';
import { HospitalStaff } from './HospitalStaff';
import { HospitalServices } from './HospitalServices';
import { HospitalAppointments } from './HospitalAppointments';
import { HospitalSchedules } from './HospitalSchedules';
import { HospitalVerification } from './HospitalVerification';
import { HospitalInsights } from './HospitalInsights';
import { HospitalSecurity } from './HospitalSecurity';
import { HospitalSupport } from './HospitalSupport';
import { HospitalPricingCenter } from './HospitalPricingCenter';

interface HospitalWorkspaceProps {
  onBackToGlobalHealth: () => void;
  onLogout: () => void;
}

interface NavItem {
  view: WorkspaceView;
  label: string;
  icon: React.ReactNode;
  group: string;
}

const NAV: NavItem[] = [
  { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, group: 'Overview' },
  { view: 'profile', label: 'Profile', icon: <Building2 className="h-4 w-4" />, group: 'Hospital' },
  { view: 'departments', label: 'Departments', icon: <DoorOpen className="h-4 w-4" />, group: 'Hospital' },
  { view: 'services', label: 'Services', icon: <ClipboardList className="h-4 w-4" />, group: 'Hospital' },
  { view: 'specialties', label: 'Specialties', icon: <Stethoscope className="h-4 w-4" />, group: 'Hospital' },
  { view: 'doctors', label: 'Doctors', icon: <UserRound className="h-4 w-4" />, group: 'Hospital' },
  { view: 'staff', label: 'Staff', icon: <UserCog className="h-4 w-4" />, group: 'Hospital' },
  { view: 'hours', label: 'Hours', icon: <Clock3 className="h-4 w-4" />, group: 'Hospital' },
  { view: 'location', label: 'Location', icon: <MapPin className="h-4 w-4" />, group: 'Hospital' },
  { view: 'photos', label: 'Photos', icon: <ImageIcon className="h-4 w-4" />, group: 'Hospital' },
  { view: 'accreditations', label: 'Accreditation', icon: <Award className="h-4 w-4" />, group: 'Hospital' },
  { view: 'appointments', label: 'Appointments', icon: <CalendarClock className="h-4 w-4" />, group: 'Operations' },
  { view: 'calendar', label: 'Calendar', icon: <CalendarDays className="h-4 w-4" />, group: 'Operations' },
  { view: 'schedules', label: 'Schedules', icon: <CalendarRange className="h-4 w-4" />, group: 'Operations' },
  { view: 'availability', label: 'Availability', icon: <ShieldCheck className="h-4 w-4" />, group: 'Operations' },
  { view: 'laboratory', label: 'Laboratory', icon: <FlaskConical className="h-4 w-4" />, group: 'Healthcare Services' },
  { view: 'imaging', label: 'Imaging', icon: <ScanLine className="h-4 w-4" />, group: 'Healthcare Services' },
  { view: 'pharmacy', label: 'Pharmacy', icon: <Pill className="h-4 w-4" />, group: 'Healthcare Services' },
  { view: 'blood_bank', label: 'Blood Bank', icon: <Droplets className="h-4 w-4" />, group: 'Healthcare Services' },
  { view: 'pricing', label: 'Pricing Center', icon: <ClipboardList className="h-4 w-4" />, group: 'Finance' },
  { view: 'verification', label: 'Verification', icon: <ShieldCheck className="h-4 w-4" />, group: 'Verification' },
  { view: 'documents', label: 'Documents', icon: <FileText className="h-4 w-4" />, group: 'Verification' },
  { view: 'action_required', label: 'Action Required', icon: <ClipboardList className="h-4 w-4" />, group: 'Verification' },
  { view: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" />, group: 'Insights' },
  { view: 'activity', label: 'Activity', icon: <History className="h-4 w-4" />, group: 'Insights' },
  { view: 'audit', label: 'Audit Log', icon: <ScrollText className="h-4 w-4" />, group: 'Insights' },
  { view: 'security', label: 'Security', icon: <Lock className="h-4 w-4" />, group: 'Security' },
  { view: 'sessions', label: 'Sessions', icon: <Laptop className="h-4 w-4" />, group: 'Security' },
  { view: 'permissions', label: 'Permissions', icon: <KeyRound className="h-4 w-4" />, group: 'Security' },
  { view: 'help', label: 'Help Center', icon: <CircleHelp className="h-4 w-4" />, group: 'Support' },
  { view: 'support', label: 'Contact Support', icon: <LifeBuoy className="h-4 w-4" />, group: 'Support' },
  { view: 'system_status', label: 'System Status', icon: <ShieldCheck className="h-4 w-4" />, group: 'Support' },
  { view: 'sync', label: 'Synchronization', icon: <Activity className="h-4 w-4" />, group: 'System' },
  { view: 'preview', label: 'Public Preview', icon: <Activity className="h-4 w-4" />, group: 'System' },
];

const NAV_PERMISSION: Record<WorkspaceView, Permission> = {
  dashboard: 'hospital.dashboard.view',
  profile: 'hospital.profile.view',
  departments: 'hospital.departments.manage',
  services: 'hospital.services.manage',
  specialties: 'hospital.specialties.manage',
  doctors: 'hospital.doctors.manage',
  staff: 'hospital.staff.manage',
  hours: 'hospital.profile.manage',
  location: 'hospital.profile.manage',
  photos: 'hospital.profile.manage',
  accreditations: 'hospital.profile.manage',
  insurance: 'hospital.insurance.manage',
  appointments: 'hospital.appointments.manage',
  calendar: 'hospital.appointments.manage',
  schedules: 'hospital.schedule.manage',
  availability: 'hospital.schedule.manage',
  laboratory: 'hospital.lab.manage',
  imaging: 'hospital.imaging.manage',
  pharmacy: 'hospital.pharmacy.manage',
  blood_bank: 'hospital.blood.manage',
  pricing: 'hospital.pricing.manage',
  sync: 'hospital.sync.manage',
  preview: 'hospital.preview.manage',
  verification: 'hospital.verification.manage',
  documents: 'hospital.documents.manage',
  action_required: 'hospital.verification.manage',
  analytics: 'hospital.reports.view',
  activity: 'hospital.reports.view',
  audit: 'hospital.audit.read',
  security: 'hospital.security.manage',
  sessions: 'hospital.security.manage',
  permissions: 'hospital.security.manage',
  help: 'hospital.profile.view',
  support: 'hospital.profile.view',
  system_status: 'hospital.profile.view',
};

const GROUPS = ['Overview', 'Hospital', 'Operations', 'Healthcare Services', 'Finance', 'Verification', 'Insights', 'Security', 'Support', 'System'];

const MOBILE_NAV: { view: WorkspaceView; label: string; icon: React.ReactNode }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { view: 'appointments', label: 'Appointments', icon: <CalendarClock className="h-4 w-4" /> },
  { view: 'doctors', label: 'Doctors', icon: <UserRound className="h-4 w-4" /> },
  { view: 'profile', label: 'Hospital', icon: <Building2 className="h-4 w-4" /> },
  { view: 'support', label: 'More', icon: <ChevronDown className="h-4 w-4" /> },
];

export const HospitalWorkspace: React.FC<HospitalWorkspaceProps> = ({ onBackToGlobalHealth, onLogout }) => {
  const { organization, organizations, setActiveHospital, notifications, activeStaffRole } = useHospitalPortal();
  const { can } = usePortalRole();
  const [view, setView] = useState<WorkspaceView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [facilityOpen, setFacilityOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const go = (v: WorkspaceView) => { setView(v); setSidebarOpen(false); window.scrollTo({ top: 0 }); };

  // Ctrl/Cmd+K command palette (optional shortcut — never mandatory).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen((s) => !s); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const activeLabel = NAV.find((n) => n.view === view)?.label || 'Dashboard';

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Top header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <button onClick={() => setSidebarOpen(true)} className="cursor-pointer rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Open navigation">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" /></svg>
          </button>
          <button onClick={onBackToGlobalHealth} className="flex cursor-pointer items-center gap-2 text-left">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-medical-500 to-medical-800 text-white">
              <Activity className="h-4 w-4" />
            </span>
            <span className="hidden sm:block">
              <span className="block text-sm font-extrabold leading-tight tracking-tight text-slate-900">GlobalHealth</span>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-medical-700">Hospital Portal</span>
            </span>
          </button>

          <span className="mx-1 hidden h-5 w-px bg-slate-200 md:block" aria-hidden="true" />
          <h1 className="hidden text-sm font-bold text-slate-700 md:block">{activeLabel}</h1>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-medical-200 hover:text-medical-800"
              aria-label="Search your portal (Ctrl+K)"
            >
              <Search className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Search portal…</span>
              <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-1.5 text-[9px] font-bold text-slate-400 md:inline">⌘K</kbd>
            </button>
            <button
              type="button"
              onClick={() => go('action_required')}
              className="relative cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-medical-200 hover:text-medical-800"
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-medical-600 text-[9px] font-bold text-white">{unreadCount}</span>}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Organization switcher — active facility always visible (§117) */}
        <div className="border-t border-slate-100 px-4 py-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setFacilityOpen(!facilityOpen)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-medical-50 px-2.5 py-1 text-xs font-bold text-medical-800 transition hover:bg-medical-100"
                aria-expanded={facilityOpen}
              >
                <Building2 className="h-3.5 w-3.5 text-medical-600" />
                {organization.displayName || 'Unnamed hospital'}
                <ChevronDown className="h-3 w-3" />
              </button>
              {facilityOpen && (
                <div className="absolute left-0 top-full z-40 mt-1 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-lift">
                  <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Your hospitals ({organizations.length})</p>
                  {organizations.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => { setActiveHospital(o.id); setFacilityOpen(false); }}
                      className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-2 py-2 text-left text-xs font-semibold transition ${
                        o.id === organization.id ? 'bg-medical-50 text-medical-800' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>
                        <span className="block">{o.displayName || 'Unnamed hospital'}</span>
                        <span className="block text-[10px] font-normal text-slate-400">{o.city || '—'} · {VERIFICATION_LABEL[o.verificationStatus]}</span>
                      </span>
                      {o.id === organization.id && <CheckMark />}
                    </button>
                  ))}
                  <p className="mt-1 border-t border-slate-100 px-2 pt-1.5 text-[10px] text-slate-400">Changes apply only to the selected facility.</p>
                </div>
              )}
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
              organization.verificationStatus === 'verified'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-amber-200 bg-amber-50 text-amber-800'
            }`}>
              {VERIFICATION_LABEL[organization.verificationStatus]} Hospital
            </span>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
              organization.publicStatus === 'published' ? 'border-medical-200 bg-medical-50 text-medical-800' : 'border-slate-200 bg-white text-slate-500'
            }`}>
              Profile: {PUBLIC_STATUS_LABEL[organization.publicStatus]}
            </span>
          </div>
        </div>
      </header>

      {searchOpen && <PortalSearch onNavigate={go} onClose={() => setSearchOpen(false)} />}

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white lg:block">
          <nav className="sticky top-[110px] max-h-[calc(100vh-118px)] overflow-y-auto p-3" aria-label="Hospital portal navigation">
            {GROUPS.map((group) => {
              const items = NAV.filter((n) => n.group === group && can(NAV_PERMISSION[n.view]));
              if (!items.length) return null;
              return (
                <div key={group} className="mb-3">
                  <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{group}</p>
                  <div className="space-y-0.5">
                    {items.map((item) => (
                      <button
                        key={item.view}
                        type="button"
                        onClick={() => go(item.view)}
                        aria-current={view === item.view ? 'page' : undefined}
                        className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold transition ${
                          view === item.view ? 'bg-medical-600 text-white shadow-sm' : 'text-slate-600 hover:bg-medical-50 hover:text-medical-800'
                        }`}
                      >
                        {item.icon} {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="mt-3 border-t border-slate-100 pt-3">
              <button type="button" onClick={onBackToGlobalHealth} className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-slate-500 transition hover:bg-slate-50">
                <Activity className="h-4 w-4" /> Back to GlobalHealth
              </button>
            </div>
          </nav>
        </aside>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-slate-950/40" onClick={() => setSidebarOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-white p-3 shadow-lift">
              <div className="mb-3 flex items-center justify-between px-2">
                <span className="text-sm font-extrabold text-slate-900">Hospital Portal</span>
                <button type="button" onClick={() => setSidebarOpen(false)} className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label="Close navigation">✕</button>
              </div>
              {GROUPS.map((group) => {
                const items = NAV.filter((n) => n.group === group && can(NAV_PERMISSION[n.view]));
                if (!items.length) return null;
                return (
                  <div key={group} className="mb-3">
                    <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{group}</p>
                    {items.map((item) => (
                      <button key={item.view} type="button" onClick={() => go(item.view)}
                        className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold transition ${
                          view === item.view ? 'bg-medical-600 text-white' : 'text-slate-600 hover:bg-medical-50'
                        }`}>
                        {item.icon} {item.label}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <PermissionGate permission="hospital.dashboard.view" fallback={<AccessDenied title="Hospital Portal restricted" message={`Your hospital role (${activeStaffRole}) does not permit access to this area. Contact your hospital administrator.`} />}>
              {view === 'dashboard' && <HospitalDashboard onNavigate={go} />}
              <PermissionGate permission="hospital.profile.view">
                {view === 'profile' && <HospitalProfile />}
                {view === 'hours' && <HospitalProfile section="hours" />}
                {view === 'location' && <HospitalProfile section="location" />}
                {view === 'photos' && <HospitalProfile section="photos" />}
                {view === 'accreditations' && <HospitalProfile section="accreditations" />}
                {view === 'help' && <HospitalSupport section="help" />}
                {view === 'support' && <HospitalSupport section="support" />}
                {view === 'system_status' && <HospitalSupport section="system_status" />}
              </PermissionGate>
              <PermissionGate permission="hospital.departments.manage">{view === 'departments' && <HospitalDepartments />}</PermissionGate>
              <PermissionGate permission="hospital.services.manage">{view === 'services' && <HospitalServices section="services" />}</PermissionGate>
              <PermissionGate permission="hospital.specialties.manage">{view === 'specialties' && <HospitalServices section="specialties" />}</PermissionGate>
              <PermissionGate permission="hospital.doctors.manage">{view === 'doctors' && <HospitalDoctors />}</PermissionGate>
              <PermissionGate permission="hospital.staff.manage">{view === 'staff' && <HospitalStaff />}</PermissionGate>
              <PermissionGate permission="hospital.appointments.manage">
                {view === 'appointments' && <HospitalAppointments />}
                {view === 'calendar' && <HospitalAppointments calendarMode />}
              </PermissionGate>
              <PermissionGate permission="hospital.schedule.manage">
                {view === 'schedules' && <HospitalSchedules section="schedules" />}
                {view === 'availability' && <HospitalSchedules section="availability" />}
              </PermissionGate>
              <PermissionGate permission="hospital.lab.manage">{view === 'laboratory' && <HospitalServices section="laboratory" />}</PermissionGate>
              <PermissionGate permission="hospital.imaging.manage">{view === 'imaging' && <HospitalServices section="imaging" />}</PermissionGate>
              <PermissionGate permission="hospital.pharmacy.manage">{view === 'pharmacy' && <HospitalServices section="pharmacy" />}</PermissionGate>
              <PermissionGate permission="hospital.blood.manage">{view === 'blood_bank' && <HospitalServices section="blood_bank" />}</PermissionGate>
              <PermissionGate permission="hospital.verification.manage">
                {view === 'verification' && <HospitalVerification section="verification" />}
                {view === 'documents' && <HospitalVerification section="documents" />}
                {view === 'action_required' && <HospitalVerification section="action_required" />}
              </PermissionGate>
              <PermissionGate permission="hospital.reports.view">
                {view === 'analytics' && <HospitalInsights section="analytics" />}
                {view === 'activity' && <HospitalInsights section="activity" />}
              </PermissionGate>
              <PermissionGate permission="hospital.audit.read">{view === 'audit' && <HospitalInsights section="audit" />}</PermissionGate>
              <PermissionGate permission="hospital.security.manage">
                {view === 'security' && <HospitalSecurity section="security" />}
                {view === 'sessions' && <HospitalSecurity section="sessions" />}
                {view === 'permissions' && <HospitalSecurity section="permissions" />}
              </PermissionGate>
              <PermissionGate permission="hospital.pricing.manage">{view === 'pricing' && <HospitalPricingCenter />}</PermissionGate>
              {view === 'sync' && <AccessDenied title="Synchronization in foundation build" message="Hospital-controlled synchronization ships in the next phase." />}
              {view === 'preview' && <AccessDenied title="Public preview in foundation build" message="The public preview mode ships in the next phase." />}
            </PermissionGate>
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation — 5 core destinations only (§71) */}
      <nav className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-md lg:hidden" aria-label="Mobile hospital portal navigation">
        <div className="grid grid-cols-5">
          {MOBILE_NAV.map((item) => (
            <button key={item.view} type="button" onClick={() => go(item.view)}
              className={`flex cursor-pointer flex-col items-center gap-0.5 py-2 text-[10px] font-bold transition ${
                view === item.view ? 'text-medical-700' : 'text-slate-400 hover:text-slate-600'
              }`}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

const CheckMark: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-medical-600">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Authorized-resource search — never returns unauthorized records. */
const PortalSearch: React.FC<{ onNavigate: (v: WorkspaceView) => void; onClose: () => void }> = ({ onNavigate, onClose }) => {
  const { organization, departments, doctors, services, appointments } = useHospitalPortal();
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const scopedAppointments = appointments.filter((a) => a.hospitalId === organization.id);

  const results = query
    ? {
        doctors: doctors.filter((d) => d.hospitalId === organization.id && d.name.toLowerCase().includes(query)).slice(0, 4),
        departments: departments.filter((d) => d.hospitalId === organization.id && d.name.toLowerCase().includes(query)).slice(0, 4),
        services: services.filter((s) => s.hospitalId === organization.id && s.name.toLowerCase().includes(query)).slice(0, 4),
        appointments: scopedAppointments.filter((a) => a.patientIdentifier.toLowerCase().includes(query)).slice(0, 3),
      }
    : { doctors: [], departments: [], services: [], appointments: [] };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/30 p-4 pt-16" onClick={onClose} role="dialog" aria-modal="true" aria-label="Portal search">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-lift" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search doctors, departments, services, appointments…"
          className="w-full rounded-xl border border-medical-200 bg-medical-50/40 px-3 py-2.5 text-sm focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20"
          aria-label="Search your portal"
        />
        {query && (
          <div className="mt-3 space-y-2 text-xs">
            {results.doctors.map((d) => (
              <button key={d.id} type="button" onClick={() => onNavigate('doctors')} className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left hover:border-medical-200">
                <span className="font-bold text-slate-700">{d.name}</span>
                <span className="text-[10px] font-semibold capitalize text-slate-400">{d.affiliationStatus}</span>
              </button>
            ))}
            {results.departments.map((d) => (
              <button key={d.id} type="button" onClick={() => onNavigate('departments')} className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left hover:border-medical-200">
                <span className="font-bold text-slate-700">{d.name}</span>
                <span className="text-[10px] font-semibold text-slate-400">Department</span>
              </button>
            ))}
            {results.services.map((s) => (
              <button key={s.id} type="button" onClick={() => onNavigate('services')} className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left hover:border-medical-200">
                <span className="font-bold text-slate-700">{s.name}</span>
                <span className="text-[10px] font-semibold capitalize text-slate-400">{s.availability}</span>
              </button>
            ))}
            {results.appointments.map((a) => (
              <button key={a.id} type="button" onClick={() => onNavigate('appointments')} className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left hover:border-medical-200">
                <span className="font-bold text-slate-700">{a.patientIdentifier} · {a.date} {a.time}</span>
                <span className="text-[10px] font-semibold capitalize text-slate-400">{a.status}</span>
              </button>
            ))}
            {!results.doctors.length && !results.departments.length && !results.services.length && !results.appointments.length && (
              <p className="rounded-xl bg-slate-50 p-3 text-center text-[11px] text-slate-400">No authorized records match “{q}”.</p>
            )}
          </div>
        )}
        {!query && (
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {(['Add Doctor', 'View Appointments', 'Update Profile', 'Open Verification'] as const).map((cmd) => (
              <button key={cmd} type="button"
                onClick={() => onNavigate(cmd === 'Add Doctor' ? 'doctors' : cmd === 'View Appointments' ? 'appointments' : cmd === 'Update Profile' ? 'profile' : 'verification')}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-[11px] font-bold text-slate-600 hover:border-medical-200 hover:text-medical-800">
                {cmd}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
