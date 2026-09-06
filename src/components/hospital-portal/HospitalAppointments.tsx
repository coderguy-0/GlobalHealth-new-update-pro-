import React, { useMemo, useState } from 'react';
import { Search, Filter, CalendarDays, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useHospitalPortal, APPOINTMENT_STATUS_LABEL, CONSULTATION_LABEL, AppointmentStatus } from './hospitalPortalData';

type Tab = 'today' | 'upcoming' | 'completed' | 'cancelled' | 'no_show' | 'pending';

const TABS: { key: Tab; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'no_show', label: 'No-show' },
  { key: 'pending', label: 'Pending Confirmation' },
];

const TAB_FILTER: Record<Tab, (s: AppointmentStatus) => boolean> = {
  today: () => true,
  upcoming: (s) => s === 'confirmed' || s === 'pending',
  completed: (s) => s === 'completed',
  cancelled: (s) => s === 'cancelled',
  no_show: (s) => s === 'no_show',
  pending: (s) => s === 'pending',
};

const PAGE_SIZE = 8;

export const HospitalAppointments: React.FC<{ calendarMode?: boolean }> = ({ calendarMode = false }) => {
  const { organization, departments, doctors, appointments, setAppointmentStatus } = useHospitalPortal();
  const [tab, setTab] = useState<Tab>('today');
  const [query, setQuery] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const today = new Date().toISOString().slice(0, 10);
  const scoped = useMemo(() => appointments.filter((a) => a.hospitalId === organization.id), [appointments, organization.id]);
  const docMap = useMemo(() => new Map(doctors.map((d) => [d.id, d])), [doctors]);
  const deptMap = useMemo(() => new Map(departments.map((d) => [d.id, d])), [departments]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = scoped
      .filter((a) => TAB_FILTER[tab](a.status))
      .filter((a) => tab !== 'today' || a.date === today)
      .filter((a) => doctorFilter === 'all' || a.doctorId === doctorFilter)
      .filter((a) => deptFilter === 'all' || a.departmentId === deptFilter)
      .filter((a) => !q || a.patientIdentifier.toLowerCase().includes(q) || (docMap.get(a.doctorId)?.name.toLowerCase().includes(q) ?? false))
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    return filtered;
  }, [scoped, tab, query, doctorFilter, deptFilter, today, docMap]);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const pageList = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const cancel = () => {
    if (!cancelTarget) return;
    setAppointmentStatus(cancelTarget, 'cancelled');
    setCancelTarget(null); setCancelReason('');
  };

  const cancelDialog = cancelTarget ? scoped.find((a) => a.id === cancelTarget) : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{calendarMode ? 'Calendar' : 'Appointments'}</h2>
          <p className="text-xs text-slate-500">{organization.displayName} · patient identifiers only — no personal health data shown</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Appointment views">
        {TABS.map((t) => {
          const count = t.key === 'today'
            ? scoped.filter((a) => a.date === today).length
            : scoped.filter((a) => TAB_FILTER[t.key](a.status)).length;
          return (
            <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => { setTab(t.key); setPage(1); }}
              className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                tab === t.key ? 'bg-medical-50 text-medical-800 ring-1 ring-inset ring-slate-900/10' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}>
              {t.label} <span className="ml-1 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-0 flex-1 sm:max-w-xs">
          <span className="sr-only">Search appointments</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search patient ID or doctor…" className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20" />
        </label>
        <label className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <span className="sr-only">Filter by doctor</span>
          <select value={doctorFilter} onChange={(e) => { setDoctorFilter(e.target.value); setPage(1); }} className="cursor-pointer bg-transparent text-xs font-semibold text-slate-600 focus:outline-none">
            <option value="all">All doctors</option>
            {doctors.filter((d) => d.hospitalId === organization.id).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
          <span className="sr-only">Filter by department</span>
          <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }} className="cursor-pointer bg-transparent text-xs font-semibold text-slate-600 focus:outline-none">
            <option value="all">All departments</option>
            {departments.filter((d) => d.hospitalId === organization.id && d.status === 'active').map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </label>
      </div>

      {cancelDialog && (
        <div role="dialog" aria-modal="true" className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm font-bold text-rose-900">Cancel appointment {cancelDialog.patientIdentifier}?</p>
          <p className="mt-1 text-xs text-rose-800">The appointment is not deleted — it stays in the record with a cancellation audit entry.</p>
          <label className="mt-3 block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-rose-700">Cancellation reason <span className="normal-case">(optional)</span></span>
            <input value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20" placeholder="e.g. Patient requested, staff shortage" />
          </label>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => setCancelTarget(null)} className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Keep appointment</button>
            <button type="button" onClick={cancel} className="cursor-pointer rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700">Cancel appointment</button>
          </div>
        </div>
      )}

      {/* Desktop table / mobile cards (§68, §110) */}
      {pageList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-2 text-sm font-bold text-slate-600">No {tab.replace('_', ' ')} appointments</p>
          <p className="text-xs text-slate-400">Nothing matches this view at the selected filters.</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th scope="col" className="px-4 py-3">Patient</th>
                    <th scope="col" className="px-4 py-3">Doctor</th>
                    <th scope="col" className="px-4 py-3">Department</th>
                    <th scope="col" className="px-4 py-3">Date &amp; time</th>
                    <th scope="col" className="px-4 py-3">Type</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pageList.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-800">{a.patientIdentifier}</p>
                        <p className="text-[9px] text-slate-400">{a.bookingSource} booking</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{docMap.get(a.doctorId)?.name || '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{deptMap.get(a.departmentId)?.name || '—'}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{a.date === today ? 'Today' : a.date.slice(5)} · {a.time}</td>
                      <td className="px-4 py-3 capitalize text-slate-500">{CONSULTATION_LABEL[a.type]}</td>
                      <td className="px-4 py-3"><StatusChip status={a.status} /></td>
                      <td className="px-4 py-3 text-right">
                        {a.status === 'confirmed' && <button type="button" onClick={() => setAppointmentStatus(a.id, 'completed')} className="cursor-pointer rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-500 hover:border-medical-200 hover:text-medical-700">Complete</button>}
                        {(a.status === 'confirmed' || a.status === 'pending') && (
                          <button type="button" onClick={() => setCancelTarget(a.id)} className="ml-1.5 cursor-pointer rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-500 hover:border-rose-200 hover:text-rose-700">Cancel</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile stacked cards */}
          <ul className="space-y-2 md:hidden">
            {pageList.map((a) => (
              <li key={a.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">{a.patientIdentifier}</p>
                    <p className="text-[11px] text-slate-500">{docMap.get(a.doctorId)?.name || '—'} · {deptMap.get(a.departmentId)?.name || '—'}</p>
                  </div>
                  <StatusChip status={a.status} />
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-700">{a.date === today ? 'Today' : a.date.slice(5)} · {a.time} · {CONSULTATION_LABEL[a.type]}</p>
                <div className="mt-2 flex gap-2">
                  {a.status === 'confirmed' && <button type="button" onClick={() => setAppointmentStatus(a.id, 'completed')} className="flex-1 cursor-pointer rounded-xl border border-medical-200 bg-medical-50 px-2 py-1.5 text-[10px] font-bold text-medical-700">Complete</button>}
                  {(a.status === 'confirmed' || a.status === 'pending') && (
                    <button type="button" onClick={() => setCancelTarget(a.id)} className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-bold text-slate-500">Cancel</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs">
          <p className="text-slate-400">Showing {pageList.length} of {list.length} · page {page} of {totalPages}</p>
          <div className="flex gap-1.5">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="cursor-pointer rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="cursor-pointer rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {calendarMode && <WeekStrip onPick={(d) => { setQuery(d); setTab('upcoming'); }} />}

      <p className="flex items-center gap-1.5 text-[11px] text-slate-400"><AlertCircle className="h-3.5 w-3.5 text-medical-500" /> Cancellations and completions are appended to the audit log — appointments are never deleted.</p>
    </div>
  );
};

const StatusChip: React.FC<{ status: AppointmentStatus }> = ({ status }) => (
  <span className={`inline-block rounded-full px-2.5 py-1 text-[9px] font-bold ${
    status === 'confirmed' ? 'bg-emerald-50 text-emerald-700'
    : status === 'pending' ? 'bg-amber-50 text-amber-800'
    : status === 'completed' ? 'bg-slate-100 text-slate-500'
    : status === 'cancelled' ? 'bg-rose-50 text-rose-700'
    : 'bg-slate-100 text-slate-500'
  }`}>{APPOINTMENT_STATUS_LABEL[status]}</span>
);

const WeekStrip: React.FC<{ onPick: (date: string) => void }> = ({ onPick }) => {
  const { organization, appointments } = useHospitalPortal();
  const today = new Date().toISOString().slice(0, 10);
  const days = useMemo(() => {
    const arr: { date: string; label: string; day: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      arr.push({ date: d.toISOString().slice(0, 10), label: d.toLocaleDateString('en-IN', { weekday: 'short' }), day: String(d.getDate()).padStart(2, '0') });
    }
    return arr;
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <h3 className="mb-3 text-sm font-extrabold text-slate-900">This week at a glance</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const count = appointments.filter((a) => a.hospitalId === organization.id && a.date === d.date && ['confirmed', 'pending'].includes(a.status)).length;
          const isToday = d.date === today;
          return (
            <button key={d.date} type="button" onClick={() => onPick(d.date)}
              className={`cursor-pointer rounded-xl border p-2 text-center transition ${isToday ? 'border-medical-500 bg-medical-50' : 'border-slate-200 bg-white hover:border-medical-200'}`}>
              <span className={`block text-[10px] font-bold ${isToday ? 'text-medical-700' : 'text-slate-400'}`}>{d.label}</span>
              <span className={`block text-sm font-extrabold ${isToday ? 'text-medical-800' : 'text-slate-800'}`}>{d.day}</span>
              <span className={`mt-0.5 block text-[9px] font-bold ${count ? 'text-medical-600' : 'text-slate-300'}`}>{count ? `${count} apt` : '—'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
