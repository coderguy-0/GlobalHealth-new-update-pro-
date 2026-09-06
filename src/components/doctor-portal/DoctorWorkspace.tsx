import React, { useEffect, useRef, useState } from 'react';
import {
  Bell, Search, ChevronDown, BadgeCheck, Building2, LogOut, ShieldCheck, MessagesSquare, Activity,
} from 'lucide-react';
import { useDoctorPortal, WorkspaceView, FACILITIES } from './doctorPortalData';
import { useClinicalWorkspace } from './doctorClinicalData';
import { DoctorDashboard } from './DoctorDashboard';
import { DoctorAppointments } from './DoctorAppointments';
import { DoctorAvailability } from './DoctorAvailability';
import { DoctorProfileView } from './DoctorProfile';
import { DoctorCredentials } from './DoctorCredentials';
import { DoctorAffiliations } from './DoctorAffiliations';
import { DoctorSecurity } from './DoctorSecurity';
import { DoctorCommunication } from './DoctorCommunication';
import { DoctorHelp } from './DoctorHelp';
import { DoctorPatients } from './DoctorPatients';
import { DoctorConsultations } from './DoctorConsultations';
import { DoctorPrescriptions } from './DoctorPrescriptions';
import { DoctorLabs } from './DoctorLabs';
import { DoctorImaging } from './DoctorImaging';
import { DoctorBilling } from './DoctorBilling';
import { DoctorAIAssistant } from './DoctorAIAssistant';
import { PermissionGate, AccessDenied } from '../portal/PermissionGate';
import { DoctorSidebar, DOCTOR_NAV } from './layout/DoctorSidebar';
import { PatientContextBar } from './layout/PatientContextBar';
import { DoctorPatientsAppointments } from './DoctorPatientsAppointments';
import { DoctorEHR } from './DoctorEHR';
import { DoctorVitalsTrends } from './DoctorVitalsTrends';
import { DoctorTelemedicine } from './DoctorTelemedicine';
import { DoctorSettings } from './DoctorSettings';
import { DoctorNotificationsCenter } from './DoctorNotificationsCenter';
import { DoctorAIWorkspace } from './DoctorAIWorkspace';
import { DoctorMessages } from './DoctorMessages';
import { DoctorReferralsLoop } from './DoctorReferralsLoop';
import { DoctorSchedule } from './DoctorSchedule';

interface DoctorWorkspaceProps {
  onBackToGlobalHealth: () => void;
  onLogout: () => void;
}

export const DoctorWorkspace: React.FC<DoctorWorkspaceProps> = ({ onBackToGlobalHealth, onLogout }) => {
  const { doctor, activeFacilityId, setActiveFacility, notifications, messages, telemedicineSessions } = useDoctorPortal();
  const { selectedPatientId } = useClinicalWorkspace();
  const [view, setView] = useState<WorkspaceView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [facilityOpen, setFacilityOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const facilityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setProfileOpen(false);
        setFacilityOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (profileRef.current && !profileRef.current.contains(t)) setProfileOpen(false);
      if (facilityRef.current && !facilityRef.current.contains(t)) setFacilityOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const activeFacility = FACILITIES.find((f) => f.id === activeFacilityId) || FACILITIES[0];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const unreadMsg = messages.filter((m) => !m.read).length;
  const liveTm = telemedicineSessions.some((s) => s.status === 'waiting' || s.status === 'live');
  const go = (v: WorkspaceView) => { setView(v); setSidebarOpen(false); window.scrollTo({ top: 0 }); };
  const activeLabel = DOCTOR_NAV.find((n) => n.view === view)?.label || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <div className="sticky top-0 hidden h-screen lg:block">
        <DoctorSidebar view={view} onNavigate={go} onLogout={onLogout} />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-950/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <DoctorSidebar view={view} onNavigate={go} onLogout={onLogout} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-[#E3E8EF] bg-white/95 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 py-2.5">
            <button onClick={() => setSidebarOpen(true)} className="cursor-pointer rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Open navigation">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" /></svg>
            </button>
            <button onClick={onBackToGlobalHealth} className="flex cursor-pointer items-center gap-2 text-left lg:hidden">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#0B1F3A] text-white"><Activity className="h-4 w-4" /></span>
            </button>
            <h1 className="hidden text-sm font-bold text-[#607086] md:block"><span className="text-[#8A97A8]">Doctor Portal / </span>{activeLabel}</h1>

            <div className="ml-auto flex items-center gap-2">
              <button type="button" onClick={() => setSearchOpen(!searchOpen)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-emerald-200 hover:text-emerald-800" aria-label="Search your portal">
                <Search className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Search patients, appointments, Rx, labs…</span>
                <kbd className="ml-1 hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-400 md:inline">⌘K</kbd>
              </button>
              <button type="button" onClick={() => go('messages')} className="relative cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:border-emerald-200 hover:text-emerald-800" aria-label="Messages">
                <MessagesSquare className="h-4 w-4" />
                {unreadMsg > 0 && <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-emerald-600 text-[9px] font-bold text-white">{unreadMsg}</span>}
              </button>
              <button type="button" onClick={() => go('notifications')} className="relative cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:border-emerald-200 hover:text-emerald-800" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}>
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-rose-600 text-[9px] font-bold text-white">{unreadCount}</span>}
              </button>
              <button type="button" onClick={() => go('audit')} className="hidden cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:border-emerald-200 hover:text-emerald-800 sm:inline-flex" aria-label="Security status">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
              </button>
              <div className="relative" ref={profileRef}>
                <button type="button" onClick={() => setProfileOpen(!profileOpen)} className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#E3E8EF] bg-white px-2 py-1.5 text-left hover:bg-slate-50" aria-expanded={profileOpen}>
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">{doctor.displayName.split(' ').map((x) => x[0]).slice(0, 2).join('')}</span>
                  <span className="hidden sm:block">
                    <span className="block text-[11px] font-extrabold leading-tight text-[#162235]">{doctor.displayName}</span>
                    <span className="block text-[9px] font-bold text-emerald-700">✓ Verified Doctor</span>
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#8A97A8]" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full z-40 mt-1 w-64 rounded-2xl border border-[#E3E8EF] bg-white p-2 shadow-lift">
                    <div className="border-b border-[#E3E8EF] px-2 pb-2">
                      <p className="text-sm font-extrabold text-[#162235]">{doctor.displayName}</p>
                      <p className="text-[11px] text-[#607086]">{doctor.professionalTitle} · {doctor.specialty}</p>
                      <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700"><BadgeCheck className="h-3 w-3" /> GlobalHealth Verified Doctor</p>
                    </div>
                    <div className="mt-1.5 space-y-0.5">
                      <button type="button" onClick={() => { go('profile'); setProfileOpen(false); }} className="w-full rounded-lg px-2 py-2 text-left text-xs font-bold text-[#162235] hover:bg-slate-50">View Profile</button>
                      <button type="button" onClick={() => { go('schedule'); setProfileOpen(false); }} className="w-full rounded-lg px-2 py-2 text-left text-xs font-bold text-[#162235] hover:bg-slate-50">Availability</button>
                      <button type="button" onClick={() => { go('settings'); setProfileOpen(false); }} className="w-full rounded-lg px-2 py-2 text-left text-xs font-bold text-[#162235] hover:bg-slate-50">Settings & Security</button>
                      <button type="button" onClick={onLogout} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50"><LogOut className="h-3.5 w-3.5" /> Logout</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-[#E3E8EF] px-4 py-1.5">
            <div className="relative inline-block" ref={facilityRef}>
              <button type="button" onClick={() => setFacilityOpen(!facilityOpen)} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100" aria-expanded={facilityOpen}>
                <Building2 className="h-3.5 w-3.5" />
                {activeFacility.name}
                <ChevronDown className="h-3 w-3" />
              </button>
              {facilityOpen && (
                <div className="absolute left-0 top-full z-40 mt-1 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-lift">
                  <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Current practice location</p>
                  {FACILITIES.map((f) => (
                    <button key={f.id} type="button" onClick={() => { setActiveFacility(f.id); setFacilityOpen(false); }} className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-2 py-2 text-left text-xs font-semibold ${f.id === activeFacilityId ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <span><span className="block">{f.name}</span><span className="block text-[10px] font-normal text-slate-400">{f.address}</span></span>
                      {f.id === activeFacilityId && <BadgeCheck className="h-4 w-4 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {liveTm && (
              <button type="button" onClick={() => go('telemedicine')} className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Telemedicine LIVE
              </button>
            )}
          </div>
        </header>

        {searchOpen && <PortalSearch onNavigate={go} onClose={() => setSearchOpen(false)} />}
        {selectedPatientId && <PatientContextBar onNavigate={go} />}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <PermissionGate permission="doctor.dashboard.view" fallback={<AccessDenied title="Doctor Workspace restricted" message="Your current role does not permit access to the Doctor Workspace." />}>
              {view === 'dashboard' && <DoctorDashboard onNavigate={go} />}
              {view === 'patients_appointments' && <PermissionGate permission="doctor.appointment.manage"><DoctorPatientsAppointments onNavigate={go} /></PermissionGate>}
              {view === 'patients' && <PermissionGate permission="doctor.patient.read"><DoctorPatients onNavigate={go} /></PermissionGate>}
              {view === 'ehr' && <PermissionGate permission="doctor.ehr.read"><DoctorEHR onNavigate={go} /></PermissionGate>}
              {view === 'consultations' && <PermissionGate permission="doctor.consultation.create"><DoctorConsultations onNavigate={go} /></PermissionGate>}
              {view === 'prescriptions' && <PermissionGate permission="doctor.prescription.create"><DoctorPrescriptions onNavigate={go} /></PermissionGate>}
              {view === 'labs' && <PermissionGate permission="doctor.lab.order"><DoctorLabs /></PermissionGate>}
              {view === 'vitals' && <PermissionGate permission="doctor.vitals.read"><DoctorVitalsTrends onNavigate={go} /></PermissionGate>}
              {view === 'imaging' && <PermissionGate permission="doctor.imaging.order"><DoctorImaging /></PermissionGate>}
              {view === 'billing' && <PermissionGate permission="doctor.billing.read"><DoctorBilling /></PermissionGate>}
              {view === 'appointments' && <PermissionGate permission="doctor.appointment.manage"><DoctorAppointments /></PermissionGate>}
              {view === 'calendar' && <PermissionGate permission="doctor.schedule.manage"><DoctorSchedule onOpenAppointment={() => go('patients_appointments')} /></PermissionGate>}
              {view === 'schedule' && <PermissionGate permission="doctor.schedule.manage"><DoctorSchedule onOpenAppointment={() => go('patients_appointments')} /></PermissionGate>}
              {view === 'availability' && <PermissionGate permission="doctor.schedule.manage"><DoctorAvailability /></PermissionGate>}
              {view === 'profile' && <PermissionGate permission="doctor.profile.manage"><DoctorProfileView /></PermissionGate>}
              {view === 'credentials' && <PermissionGate permission="doctor.profile.manage"><DoctorCredentials /></PermissionGate>}
              {view === 'affiliations' && <PermissionGate permission="doctor.profile.manage"><DoctorAffiliations /></PermissionGate>}
              {view === 'referrals' && <PermissionGate permission="doctor.referral.create"><DoctorReferralsLoop onNavigate={go} /></PermissionGate>}
              {view === 'documents' && <PermissionGate permission="doctor.document.read"><DoctorCommunication section="documents" /></PermissionGate>}
              {view === 'messages' && <PermissionGate permission="doctor.messaging.send"><DoctorMessages onNavigate={go} /></PermissionGate>}
              {view === 'notifications' && <PermissionGate permission="doctor.notifications.read"><DoctorNotificationsCenter onNavigate={go} /></PermissionGate>}
              {view === 'insights' && <PermissionGate permission="doctor.analytics.view"><DoctorCommunication section="insights" /></PermissionGate>}
              {view === 'telemedicine' && <PermissionGate permission="doctor.telemedicine.join"><DoctorTelemedicine onNavigate={go} /></PermissionGate>}
              {view === 'ai' && <PermissionGate permission="doctor.ai.use"><DoctorAIWorkspace onNavigate={go} /></PermissionGate>}
              {view === 'settings' && <PermissionGate permission="doctor.settings.manage"><DoctorSettings onNavigate={go} /></PermissionGate>}
              {view === 'security' && <PermissionGate permission="doctor.security.manage"><DoctorSecurity section="security" /></PermissionGate>}
              {view === 'sessions' && <PermissionGate permission="doctor.security.manage"><DoctorSecurity section="sessions" /></PermissionGate>}
              {view === 'delegated' && <PermissionGate permission="doctor.security.manage"><DoctorSecurity section="delegated" /></PermissionGate>}
              {view === 'audit' && <PermissionGate permission="doctor.audit.read"><DoctorSecurity section="audit" /></PermissionGate>}
              {view === 'help' && <DoctorHelp section="help" />}
              {view === 'support' && <DoctorHelp section="support" />}
            </PermissionGate>
          </div>
        </main>

        <nav className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-md lg:hidden" aria-label="Mobile portal navigation">
          <div className="grid grid-cols-5">
            {(['dashboard', 'patients_appointments', 'ehr', 'messages', 'notifications'] as WorkspaceView[]).map((v) => {
              const item = DOCTOR_NAV.find((n) => n.view === v);
              if (!item) return null;
              return (
                <button key={v} type="button" onClick={() => go(v)} className={`flex cursor-pointer flex-col items-center gap-0.5 py-2 text-[10px] font-bold ${view === v ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {item.icon} {v === 'notifications' && unreadCount > 0 ? `Alerts (${unreadCount})` : item.label.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
      <DoctorAIAssistant />
    </div>
  );
};

const PortalSearch: React.FC<{ onNavigate: (v: WorkspaceView) => void; onClose: () => void }> = ({ onNavigate, onClose }) => {
  const { appointments, referrals, documents, activeFacilityId } = useDoctorPortal();
  const { patients, selectPatient } = useClinicalWorkspace();
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const scopedAppointments = appointments.filter((a) => a.facilityId === activeFacilityId);
  const results = query
    ? {
        patients: patients.filter((p) => p.name.toLowerCase().includes(query) || p.identifier.toLowerCase().includes(query)).slice(0, 4),
        appointments: scopedAppointments.filter((a) => (a.patientName || a.patientIdentifier).toLowerCase().includes(query) || a.id.includes(query)).slice(0, 4),
        referrals: referrals.filter((r) => r.patientIdentifier.toLowerCase().includes(query) || r.specialty.toLowerCase().includes(query)).slice(0, 3),
        documents: documents.filter((d) => d.name.toLowerCase().includes(query)).slice(0, 3),
      }
    : { patients: [], appointments: [], referrals: [], documents: [] };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/30 p-4 pt-16" onClick={onClose} role="dialog" aria-modal="true" aria-label="Portal search">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-lift" onClick={(e) => e.stopPropagation()}>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Patient name / ID / appointment / prescription / lab / referral — authorized records only" className="w-full rounded-xl border border-emerald-200 bg-emerald-50/40 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
        {query && (
          <div className="mt-3 space-y-2 text-xs">
            <Group label="Patients">
              {results.patients.map((p) => (
                <button key={p.id} type="button" onClick={() => { selectPatient(p.id); onNavigate('ehr'); onClose(); }} className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left hover:border-emerald-200">
                  <span className="font-bold text-slate-700">{p.name} · {p.identifier}</span>
                  <span className="text-[10px] text-slate-400">{p.age}y</span>
                </button>
              ))}
            </Group>
            {results.appointments.map((a) => (
              <button key={a.id} type="button" onClick={() => { onNavigate('patients_appointments'); onClose(); }} className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left hover:border-emerald-200">
                <span className="font-bold text-slate-700">{a.patientName || a.patientIdentifier} — {a.date} {a.startTime}</span>
                <span className="text-[10px] text-slate-400">{a.type.replace('_', ' ')}</span>
              </button>
            ))}
            {results.referrals.map((r) => (
              <button key={r.id} type="button" onClick={() => { onNavigate('referrals'); onClose(); }} className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left hover:border-emerald-200">
                <span className="font-bold text-slate-700">Referral · {r.patientIdentifier} → {r.specialty}</span>
                <span className="text-[10px] capitalize text-slate-400">{r.status}</span>
              </button>
            ))}
            {results.documents.map((d) => (
              <button key={d.id} type="button" onClick={() => { onNavigate('documents'); onClose(); }} className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left hover:border-emerald-200">
                <span className="font-bold text-slate-700">{d.name}</span>
                <span className="text-[10px] text-slate-400">{d.sizeKB} KB</span>
              </button>
            ))}
            {!results.patients.length && !results.appointments.length && !results.referrals.length && !results.documents.length && (
              <p className="rounded-xl bg-slate-50 p-3 text-center text-[11px] text-slate-400">No authorized records match “{q}”.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Group: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => {
  const has = React.Children.count(children) > 0;
  if (!has) return null;
  return (
    <div>
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">{label}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
};
