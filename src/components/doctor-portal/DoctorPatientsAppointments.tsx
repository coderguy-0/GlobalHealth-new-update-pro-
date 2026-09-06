import React, { useMemo, useState } from 'react';
import {
  Search, Filter, UserRound, Stethoscope, FolderHeart, MessageSquare, Video,
  CalendarClock, Ban, UserX, ChevronRight, BellRing, CheckCircle2,
} from 'lucide-react';
import {
  useDoctorPortal, WorkspaceView, CONSULTATION_LABEL, STATUS_LABEL, FACILITIES,
  Appointment, AppointmentStatus, AppointmentPriority,
} from './doctorPortalData';
import { useClinicalWorkspace } from './doctorClinicalData';

interface Props {
  onNavigate: (v: WorkspaceView) => void;
}

const STATUS_TONE: Record<string, string> = {
  requested: 'bg-slate-100 text-slate-600',
  pending: 'bg-amber-50 text-amber-800',
  confirmed: 'bg-sky-50 text-sky-800',
  checked_in: 'bg-indigo-50 text-indigo-800',
  waiting: 'bg-amber-50 text-amber-800',
  in_consultation: 'bg-emerald-50 text-emerald-800',
  completed: 'bg-slate-100 text-slate-500',
  cancelled: 'bg-rose-50 text-rose-700',
  rescheduled: 'bg-violet-50 text-violet-800',
  no_show: 'bg-slate-100 text-slate-500',
  rejected: 'bg-rose-50 text-rose-700',
  expired: 'bg-slate-100 text-slate-400',
};

const PRIORITY_TONE: Record<AppointmentPriority, string> = {
  routine: 'bg-slate-100 text-slate-600',
  urgent: 'bg-amber-50 text-amber-800',
  stat: 'bg-rose-50 text-rose-700',
};

export const DoctorPatientsAppointments: React.FC<Props> = ({ onNavigate }) => {
  const { appointments, activeFacilityId, setAppointmentStatus, callNextPatient, addAuditEvent, doctor } = useDoctorPortal();
  const { patients, selectPatient, startEncounter } = useClinicalWorkspace();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | AppointmentPriority>('all');
  const [called, setCalled] = useState<Appointment | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const scoped = useMemo(
    () => appointments.filter((a) => a.facilityId === activeFacilityId).sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime)),
    [appointments, activeFacilityId],
  );
  const todays = scoped.filter((a) => a.date === today);

  const cards = [
    { label: "Today's Appointments", value: todays.length, sub: 'scheduled visits' },
    { label: 'Waiting', value: todays.filter((a) => a.status === 'waiting' || a.status === 'checked_in').length, sub: 'in queue' },
    { label: 'In Consultation', value: todays.filter((a) => a.status === 'in_consultation').length, sub: 'being seen' },
    { label: 'Completed', value: todays.filter((a) => a.status === 'completed').length, sub: 'today' },
    { label: 'No Show', value: todays.filter((a) => a.status === 'no_show').length, sub: 'missed' },
    { label: 'Urgent', value: todays.filter((a) => a.priority === 'urgent' || a.priority === 'stat').length, sub: 'flagged' },
  ];

  const queue = todays
    .filter((a) => a.status === 'waiting' || a.status === 'checked_in' || a.status === 'in_consultation')
    .sort((a, b) => (a.token || 99) - (b.token || 99));

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scoped.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (typeFilter !== 'all' && a.type !== typeFilter) return false;
      if (priorityFilter !== 'all' && a.priority !== priorityFilter) return false;
      if (!q) return true;
      return [a.patientName, a.patientIdentifier, a.id, a.reason, a.department, a.date]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [scoped, query, statusFilter, typeFilter, priorityFilter]);

  const openPatient = (a: Appointment, next: WorkspaceView) => {
    const pid = a.patientId || patients.find((p) => p.identifier === a.patientIdentifier)?.id || null;
    if (pid) {
      selectPatient(pid);
      if (next === 'consultations' || next === 'ehr') startEncounter(pid, a.id);
    }
    onNavigate(next);
  };

  const onCallNext = () => {
    const next = callNextPatient();
    setCalled(next);
    if (next) {
      addAuditEvent({ actorId: doctor.id, actorRole: 'DOCTOR', action: 'QUEUE_CALLED', resourceId: next.id, patientId: next.patientId || null, detail: `Token ${next.token || '—'} ${next.patientIdentifier}` });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-[#162235]">Patients & Appointments</h2>
          <p className="text-xs text-[#607086]">{FACILITIES.find((f) => f.id === activeFacilityId)?.name} · operational starting point for the clinical day</p>
        </div>
        <button
          type="button"
          onClick={onCallNext}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <BellRing className="h-3.5 w-3.5" /> Call Next Patient
        </button>
      </div>

      {called && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-xs font-bold text-emerald-900">
            Token {called.token || '—'} — {called.patientName || called.patientIdentifier} called to {called.room || 'consultation'}. Queue notification sent.
          </p>
          <button type="button" onClick={() => openPatient(called, 'consultations')} className="cursor-pointer rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white">Start Consultation</button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-[#E3E8EF] bg-white p-4 shadow-soft">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">{c.label}</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#162235]">{c.value}</p>
            <p className="text-[10px] font-semibold text-[#607086]">{c.sub}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#162235]">Patient queue</h3>
          <p className="text-[11px] text-[#8A97A8]">{queue.length === 0 ? 'No patients waiting.' : `${queue.length} in flow`}</p>
        </div>
        {queue.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No upcoming appointments in the waiting queue today.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
            {queue.map((a) => (
              <li key={a.id} className="flex items-center justify-between rounded-xl border border-[#E3E8EF] bg-slate-50/70 px-3 py-2.5">
                <div>
                  <p className="text-xs font-extrabold text-[#162235]">Token {a.token || '—'} — {STATUS_LABEL[a.status]}{a.room ? ` — ${a.room}` : ''}</p>
                  <p className="text-[11px] text-[#607086]">{a.patientName} · {a.startTime} · {CONSULTATION_LABEL[a.type]}</p>
                </div>
                <button type="button" onClick={() => { setAppointmentStatus(a.id, 'in_consultation'); openPatient(a, 'consultations'); }} className="cursor-pointer rounded-lg bg-[#0B1F3A] px-2.5 py-1.5 text-[10px] font-bold text-white">See</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A97A8]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, patient ID, phone, appointment ID…" className="w-full rounded-xl border border-[#E3E8EF] bg-white py-2 pl-9 pr-3 text-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
        </label>
        <FilterChip label="Status" value={statusFilter} onChange={(v) => setStatusFilter(v as typeof statusFilter)} options={['all', 'requested', 'confirmed', 'waiting', 'in_consultation', 'completed', 'cancelled', 'no_show']} />
        <label className="inline-flex items-center gap-1.5 rounded-xl border border-[#E3E8EF] bg-white px-3 py-2 text-xs font-semibold text-[#607086]">
          <Filter className="h-3.5 w-3.5" />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-transparent focus:outline-none">
            <option value="all">All types</option>
            {Object.entries(CONSULTATION_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
        <label className="inline-flex items-center gap-1.5 rounded-xl border border-[#E3E8EF] bg-white px-3 py-2 text-xs font-semibold text-[#607086]">
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as typeof priorityFilter)} className="bg-transparent focus:outline-none">
            <option value="all">All priority</option>
            <option value="routine">Routine</option>
            <option value="urgent">Urgent</option>
            <option value="stat">STAT</option>
          </select>
        </label>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E3E8EF] bg-white p-10 text-center">
          <CalendarClock className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-2 text-sm font-bold text-[#607086]">No upcoming appointments today.</p>
          <p className="text-xs text-slate-400">Nothing matches this search at the selected facility.</p>
        </div>
      ) : (
        <section className="overflow-x-auto rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
          <table className="w-full min-w-[1100px] text-left text-xs">
            <thead className="bg-slate-50/80">
              <tr className="border-b border-[#E3E8EF] text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">
                <th className="px-4 py-3">Patient</th>
                <th className="px-3 py-3">When</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Reason</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Consent</th>
                <th className="px-3 py-3">Pay</th>
                <th className="px-3 py-3">Priority</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#0B1F3A] text-[10px] font-bold text-white">
                        {(a.patientName || a.patientIdentifier).split(' ').map((x) => x[0]).slice(0, 2).join('')}
                      </span>
                      <div>
                        <p className="font-bold text-[#162235]">{a.patientName || a.patientIdentifier}</p>
                        <p className="text-[10px] text-[#8A97A8]">{a.patientIdentifier} · {a.patientAge || '—'}{a.patientSex ? ` · ${a.patientSex}` : ''}{a.telemedicine ? ' · Tele' : ''}{a.token ? ` · Token ${a.token}` : ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-bold text-[#162235]">{a.date === today ? 'Today' : a.date.slice(5)} · {a.startTime}</p>
                    <p className="text-[10px] text-[#8A97A8]">{a.department}{a.room ? ` · ${a.room}` : ''}</p>
                  </td>
                  <td className="px-3 py-3">{CONSULTATION_LABEL[a.type]}</td>
                  <td className="max-w-[180px] truncate px-3 py-3 text-[#607086]">{a.reason || a.notes || '—'}</td>
                  <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${STATUS_TONE[a.status]}`}>{STATUS_LABEL[a.status]}</span></td>
                  <td className="px-3 py-3 capitalize text-[#607086]">{a.consentStatus?.replace('_', ' ') || '—'}</td>
                  <td className="px-3 py-3 capitalize text-[#607086]">{a.paymentStatus || '—'}</td>
                  <td className="px-3 py-3">{a.priority && <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${PRIORITY_TONE[a.priority]}`}>{a.priority}</span>}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap justify-end gap-1">
                      <IconBtn label="Open patient" onClick={() => openPatient(a, 'ehr')}><UserRound className="h-3.5 w-3.5" /></IconBtn>
                      <IconBtn label="Start consultation" onClick={() => { setAppointmentStatus(a.id, 'in_consultation'); openPatient(a, 'consultations'); }}><Stethoscope className="h-3.5 w-3.5" /></IconBtn>
                      <IconBtn label="View EHR" onClick={() => openPatient(a, 'ehr')}><FolderHeart className="h-3.5 w-3.5" /></IconBtn>
                      <IconBtn label="Message" onClick={() => openPatient(a, 'messages')}><MessageSquare className="h-3.5 w-3.5" /></IconBtn>
                      {a.telemedicine && <IconBtn label="Start telemedicine" onClick={() => openPatient(a, 'telemedicine')}><Video className="h-3.5 w-3.5" /></IconBtn>}
                      {['confirmed', 'pending', 'requested'].includes(a.status) && <IconBtn label="Cancel" onClick={() => setAppointmentStatus(a.id, 'cancelled')}><Ban className="h-3.5 w-3.5" /></IconBtn>}
                      {['confirmed', 'waiting', 'checked_in'].includes(a.status) && <IconBtn label="Mark no show" onClick={() => setAppointmentStatus(a.id, 'no_show')}><UserX className="h-3.5 w-3.5" /></IconBtn>}
                      {a.status === 'in_consultation' && <IconBtn label="Complete" onClick={() => setAppointmentStatus(a.id, 'completed')}><CheckCircle2 className="h-3.5 w-3.5" /></IconBtn>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

const IconBtn: React.FC<{ label: string; onClick: () => void; children: React.ReactNode }> = ({ label, onClick, children }) => (
  <button type="button" title={label} onClick={onClick} className="cursor-pointer rounded-lg border border-[#E3E8EF] bg-white p-1.5 text-[#607086] transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800">
    {children}
  </button>
);

const FilterChip: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: string[] }> = ({ label, value, onChange, options }) => (
  <label className="inline-flex items-center gap-1.5 rounded-xl border border-[#E3E8EF] bg-white px-3 py-2 text-xs font-semibold text-[#607086]">
    <span className="sr-only">{label}</span>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent capitalize focus:outline-none">
      {options.map((o) => <option key={o} value={o}>{o === 'all' ? `All ${label.toLowerCase()}` : o.replace('_', ' ')}</option>)}
    </select>
  </label>
);

export const OpenPatientHint: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button type="button" onClick={onClick} className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:underline">
    Open <ChevronRight className="h-3 w-3" />
  </button>
);
