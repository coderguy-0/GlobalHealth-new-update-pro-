import React from 'react';
import {
  Clock3, CalendarClock, ArrowRight, FileText, Users, ClipboardList, FlaskConical, Activity,
  CheckCircle2, AlertTriangle, Video, Search, Stethoscope, BadgeCheck, ArrowLeftRight, IndianRupee,
  BellRing, ShieldAlert,
} from 'lucide-react';
import { useDoctorPortal, WorkspaceView, CONSULTATION_LABEL, STATUS_LABEL, FACILITIES } from './doctorPortalData';
import { useClinicalWorkspace } from './doctorClinicalData';

export const DoctorDashboard: React.FC<{ onNavigate: (v: WorkspaceView) => void }> = ({ onNavigate }) => {
  const { doctor, activeFacilityId, appointments, credentials, notifications, telemedicineSessions, referrals, callNextPatient, addAuditEvent } = useDoctorPortal();
  const { patients, selectPatient, startEncounter, billing, consultations } = useClinicalWorkspace();
  const today = new Date().toISOString().slice(0, 10);
  const facility = FACILITIES.find((f) => f.id === activeFacilityId);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const todays = appointments.filter((a) => a.date === today && a.facilityId === activeFacilityId).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const waiting = todays.filter((a) => a.status === 'waiting' || a.status === 'checked_in');
  const inConsult = todays.filter((a) => a.status === 'in_consultation');
  const upcoming = appointments.filter((a) => a.date > today && ['confirmed', 'pending', 'requested'].includes(a.status) && a.facilityId === activeFacilityId).sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime)).slice(0, 4);
  const criticalNotifs = notifications.filter((n) => (n.priority === 'critical' || n.priority === 'high') && !n.read);
  const pendingLabs = patients.flatMap((p) => p.labs.filter((l) => l.status === 'available').map((l) => ({ ...l, patientName: p.name, patientId: p.id })));
  const draftRx = patients.flatMap((p) => p.prescriptions.filter((r) => r.status === 'draft').map((r) => ({ ...r, patientName: p.name, patientId: p.id })));
  const liveTm = telemedicineSessions.filter((s) => s.status === 'waiting' || s.status === 'live');
  const expiring = credentials.find((c) => c.status === 'expiring_soon' || c.status === 'expired');
  const openLoops = referrals.filter((r) => ['sent', 'accepted', 'scheduled', 'in_progress'].includes(r.status));
  const pendingConsent = patients.filter((p) => p.consentStatus === 'pending');
  const unsignedNotes = consultations.filter((c) => c.status === 'in_progress' || c.status === 'draft');
  const todayRevenue = billing.filter((b) => b.date === today).reduce((s, b) => s + b.amount, 0);
  const outstanding = billing.filter((b) => b.status === 'pending').reduce((s, b) => s + b.amount, 0);

  type Task = { label: string; detail: string; action: WorkspaceView; patientId?: string; severity: 'critical' | 'high' | 'normal' };
  const tasks: Task[] = [];
  pendingLabs.filter((l) => l.priority === 'stat' || l.values?.some((v) => v.flag !== 'normal')).forEach((l) => tasks.push({ label: 'Critical lab review', detail: `${l.test} · ${l.patientName}`, action: 'labs', patientId: l.patientId, severity: 'critical' }));
  pendingLabs.filter((l) => !(l.priority === 'stat' || l.values?.some((v) => v.flag !== 'normal'))).forEach((l) => tasks.push({ label: 'Review result', detail: `${l.test} · ${l.patientName}`, action: 'labs', patientId: l.patientId, severity: 'high' }));
  liveTm.forEach((s) => tasks.push({ label: 'Join telemedicine', detail: `${s.patientName} is waiting.`, action: 'telemedicine', patientId: s.patientId, severity: 'critical' }));
  unsignedNotes.forEach((c) => {
    const p = patients.find((x) => x.id === c.patientId);
    tasks.push({ label: 'Unsigned note', detail: `${p?.name || c.patientId} · ${c.type}`, action: 'consultations', patientId: c.patientId, severity: 'high' });
  });
  draftRx.forEach((r) => tasks.push({ label: 'Sign prescription', detail: `${r.rxId} · ${r.patientName}`, action: 'prescriptions', patientId: r.patientId, severity: 'high' }));
  openLoops.slice(0, 4).forEach((r) => tasks.push({ label: `Referral ${r.status.replace('_', ' ')}`, detail: `${r.patientName || r.patientIdentifier} → ${r.specialty}`, action: 'referrals', patientId: r.patientId, severity: r.urgency === 'stat' ? 'critical' : 'normal' }));
  pendingConsent.forEach((p) => tasks.push({ label: 'Consent pending', detail: p.name, action: 'ehr', patientId: p.id, severity: 'high' }));
  if (expiring) tasks.push({ label: 'Credential expires soon', detail: expiring.title, action: 'settings', severity: 'normal' });

  const openTask = (t: Task) => {
    if (t.patientId) selectPatient(t.patientId);
    onNavigate(t.action);
  };

  const startNext = () => {
    const next = callNextPatient();
    if (next) {
      addAuditEvent({ actorId: doctor.id, actorRole: 'DOCTOR', action: 'QUEUE_CALLED', resourceId: next.id, patientId: next.patientId || null, detail: `Token ${next.token || '—'}` });
      if (next.patientId) {
        selectPatient(next.patientId);
        startEncounter(next.patientId, next.id);
      }
      onNavigate('consultations');
    } else {
      onNavigate('patients_appointments');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-[#162235] sm:text-2xl">{greeting}, {doctor.displayName}</h2>
          <p className="text-xs text-[#607086]">{doctor.professionalTitle} · {doctor.specialty} · {facility?.name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
            <BadgeCheck className="h-3.5 w-3.5" /> {doctor.verificationStatus === 'verified' ? 'Verified Professional' : 'Verification in progress'}
          </span>
          <button type="button" onClick={startNext} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700">
            <BellRing className="h-3.5 w-3.5" /> Start next encounter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        <Kpi label="Today" value={String(todays.length)} sub="scheduled" icon={<CalendarClock className="h-4 w-4" />} onClick={() => onNavigate('patients_appointments')} />
        <Kpi label="Waiting" value={String(waiting.length)} sub="in queue" icon={<Users className="h-4 w-4" />} onClick={() => onNavigate('patients_appointments')} />
        <Kpi label="In consult" value={String(inConsult.length)} sub="open encounters" icon={<Stethoscope className="h-4 w-4" />} onClick={() => onNavigate('consultations')} />
        <Kpi label="Labs to review" value={String(pendingLabs.length)} sub="results ready" icon={<FlaskConical className="h-4 w-4" />} onClick={() => onNavigate('labs')} danger={pendingLabs.some((l) => l.priority === 'stat')} />
        <Kpi label="Open referrals" value={String(openLoops.length)} sub="closed-loop" icon={<ArrowLeftRight className="h-4 w-4" />} onClick={() => onNavigate('referrals')} />
        <Kpi label="Live TM" value={String(liveTm.length)} sub="waiting / live" icon={<Video className="h-4 w-4" />} onClick={() => onNavigate('telemedicine')} danger={liveTm.length > 0} />
        <Kpi label="Today ₹" value={`₹${todayRevenue}`} sub="collected" icon={<IndianRupee className="h-4 w-4" />} onClick={() => onNavigate('billing')} />
        <Kpi label="Outstanding" value={`₹${outstanding}`} sub="pending pay" icon={<IndianRupee className="h-4 w-4" />} onClick={() => onNavigate('billing')} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#162235]"><Clock3 className="h-4 w-4 text-emerald-700" /> Today's board</h3>
            <button type="button" onClick={() => onNavigate('patients_appointments')} className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline">Open queue <ArrowRight className="h-3 w-3" /></button>
          </div>
          {todays.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-400">No upcoming appointments today at {facility?.name}.</p>
          ) : (
            <ol className="relative space-y-0 border-l border-emerald-100 pl-4">
              {todays.map((a) => (
                <li key={a.id} className="relative pb-4 last:pb-0">
                  <span className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white ${a.status === 'in_consultation' ? 'bg-amber-500' : a.status === 'completed' ? 'bg-slate-300' : a.priority === 'stat' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  <button type="button" onClick={() => { if (a.patientId) selectPatient(a.patientId); onNavigate(a.telemedicine ? 'telemedicine' : 'patients_appointments'); }} className="flex w-full flex-wrap items-center justify-between gap-2 text-left">
                    <div>
                      <p className="text-sm font-extrabold text-[#162235]">{a.startTime} · {a.patientName || a.patientIdentifier}</p>
                      <p className="text-[11px] text-[#607086]">{CONSULTATION_LABEL[a.type]} · {a.reason || a.department}{a.token ? ` · Token ${a.token}` : ''}{a.room ? ` · ${a.room}` : ''}{a.priority === 'stat' ? ' · STAT' : ''}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${a.status === 'waiting' || a.status === 'in_consultation' ? 'bg-amber-50 text-amber-800' : a.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700'}`}>{STATUS_LABEL[a.status]}</span>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
            <h3 className="mb-3 text-sm font-extrabold text-[#162235]">Patient queue</h3>
            {waiting.length === 0 ? <p className="text-xs text-slate-400">No one is waiting now.</p> : waiting.map((a) => (
              <button key={a.id} type="button" onClick={() => { if (a.patientId) { selectPatient(a.patientId); startEncounter(a.patientId, a.id); } onNavigate('consultations'); }} className="mb-2 flex w-full items-center justify-between rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-left">
                <span className="text-xs font-bold text-amber-950">Token {a.token || '—'} · {a.patientName}</span>
                <span className="text-[10px] text-amber-800">{a.room || 'See now'}</span>
              </button>
            ))}
          </section>
          <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
            <h3 className="mb-3 text-sm font-extrabold text-[#162235]">Clinical alerts</h3>
            {criticalNotifs.length === 0 && pendingLabs.filter((l) => l.priority === 'stat').length === 0 ? (
              <p className="flex items-center gap-2 text-xs text-emerald-700"><CheckCircle2 className="h-4 w-4" /> No critical alerts.</p>
            ) : (
              <ul className="space-y-2">
                {criticalNotifs.slice(0, 3).map((n) => (
                  <li key={n.id}><button type="button" onClick={() => { if (n.patientId) selectPatient(n.patientId); onNavigate(n.actionView || 'notifications'); }} className="w-full rounded-xl bg-rose-50 px-3 py-2 text-left text-xs font-bold text-rose-800">{n.title}</button></li>
                ))}
                {pendingLabs.filter((l) => l.priority === 'stat').slice(0, 2).map((l) => (
                  <li key={l.id}><button type="button" onClick={() => { selectPatient(l.patientId); onNavigate('labs'); }} className="flex w-full items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-left text-xs font-bold text-amber-800"><ShieldAlert className="h-3.5 w-3.5" /> {l.test} · {l.patientName}</button></li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#162235]">Clinical worklist</h3>
          <p className="text-[11px] text-[#8A97A8]">{tasks.length} open · selecting a task binds the patient</p>
        </div>
        {tasks.length === 0 ? (
          <p className="flex items-center gap-2 text-xs text-emerald-700"><CheckCircle2 className="h-4 w-4" /> All caught up. The next patient is ready when they arrive.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.slice(0, 12).map((t, i) => (
              <li key={i}>
                <button type="button" onClick={() => openTask(t)} className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left hover:border-emerald-300 hover:bg-emerald-50 ${t.severity === 'critical' ? 'border-rose-200 bg-rose-50/60' : t.severity === 'high' ? 'border-amber-100 bg-amber-50/40' : 'border-[#E3E8EF] bg-slate-50/70'}`}>
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-emerald-700 ring-1 ring-slate-200"><FileText className="h-4 w-4" /></span>
                  <span className="min-w-0"><span className="block text-xs font-bold text-[#162235]">{t.label}</span><span className="block truncate text-[11px] text-[#607086]">{t.detail}</span></span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Quick actions</p>
        <div className="flex flex-wrap gap-2">
          <Qa onClick={() => onNavigate('consultations')} icon={<Stethoscope className="h-3.5 w-3.5" />} label="New Consultation" />
          <Qa onClick={() => onNavigate('ehr')} icon={<Search className="h-3.5 w-3.5" />} label="Find Patient" />
          <Qa onClick={() => onNavigate('schedule')} icon={<CalendarClock className="h-3.5 w-3.5" />} label="Open Schedule" />
          <Qa onClick={() => onNavigate('prescriptions')} icon={<ClipboardList className="h-3.5 w-3.5" />} label="Create Prescription" />
          <Qa onClick={() => onNavigate('labs')} icon={<FlaskConical className="h-3.5 w-3.5" />} label="Review Labs" />
          <Qa onClick={() => onNavigate('telemedicine')} icon={<Video className="h-3.5 w-3.5" />} label="Start Telemedicine" />
          <Qa onClick={() => onNavigate('vitals')} icon={<Activity className="h-3.5 w-3.5" />} label="Vitals" />
          <Qa onClick={() => onNavigate('referrals')} icon={<ArrowLeftRight className="h-3.5 w-3.5" />} label="Referrals" />
        </div>
        {upcoming.length > 0 && (
          <p className="mt-3 text-[11px] text-[#607086]">Next visit: {upcoming[0].date} {upcoming[0].startTime} · {upcoming[0].patientName}</p>
        )}
      </section>
    </div>
  );
};

const Kpi: React.FC<{ label: string; value: string; sub: string; icon: React.ReactNode; onClick: () => void; danger?: boolean }> = ({ label, value, sub, icon, onClick, danger }) => (
  <button type="button" onClick={onClick} className={`rounded-2xl border p-4 text-left shadow-soft transition hover:border-emerald-300 ${danger ? 'border-rose-200 bg-rose-50' : 'border-[#E3E8EF] bg-white'}`}>
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">{label}</p>
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0B1F3A] text-white">{icon}</span>
    </div>
    <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#162235]">{value}</p>
    <p className="text-[10px] font-semibold text-[#607086]">{sub}</p>
  </button>
);

const Qa: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string }> = ({ onClick, icon, label }) => (
  <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 rounded-xl border border-[#E3E8EF] bg-white px-3.5 py-2 text-xs font-bold text-[#162235] hover:border-emerald-300 hover:bg-emerald-50">
    {icon} {label}
  </button>
);
