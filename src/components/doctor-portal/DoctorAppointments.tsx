import React, { useMemo, useState } from 'react';
import { Search, CalendarDays, Filter, CheckCircle2, XCircle, UserX, CalendarClock } from 'lucide-react';
import { useDoctorPortal, CONSULTATION_LABEL, STATUS_LABEL, FACILITIES, AppointmentStatus } from './doctorPortalData';

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

const TAB_ACCENT: Record<Tab, string> = {
  today: 'bg-medical-50 text-medical-800',
  upcoming: 'bg-medical-50 text-medical-800',
  completed: 'bg-slate-100 text-slate-600',
  cancelled: 'bg-rose-50 text-rose-700',
  no_show: 'bg-slate-100 text-slate-600',
  pending: 'bg-amber-50 text-amber-800',
};

export const DoctorAppointments: React.FC<{ calendarMode?: boolean }> = ({ calendarMode = false }) => {
  const { doctor, activeFacilityId, appointments, setAppointmentStatus } = useDoctorPortal();
  const [tab, setTab] = useState<Tab>('today');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const today = new Date().toISOString().slice(0, 10);
  const scoped = useMemo(() => appointments.filter((a) => a.facilityId === activeFacilityId), [appointments, activeFacilityId]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scoped
      .filter((a) => TAB_FILTER[tab](a.status))
      .filter((a) => tab !== 'today' || a.date === today)
      .filter((a) => typeFilter === 'all' || a.type === typeFilter)
      .filter((a) => !q || a.patientIdentifier.toLowerCase().includes(q) || a.date.includes(q) || a.department.toLowerCase().includes(q))
      .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  }, [scoped, tab, query, typeFilter, today]);

  const statuses = useMemo(() => {
    const set = new Set(scoped.map((a) => a.status));
    return set;
  }, [scoped]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Appointments</h2>
          <p className="text-xs text-slate-500">{FACILITIES.find((f) => f.id === activeFacilityId)?.name}</p>
        </div>
        {calendarMode && (
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="cursor-pointer rounded-xl border border-medical-200 bg-white px-3 py-2 text-xs font-bold text-medical-700 hover:bg-medical-50">
            <CalendarDays className="mr-1.5 inline h-3.5 w-3.5" />Back to top
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Appointment views">
        {TABS.map((t) => {
          const count = t.key === 'today'
            ? scoped.filter((a) => a.date === today).length
            : scoped.filter((a) => TAB_FILTER[t.key](a.status)).length;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                tab === t.key ? TAB_ACCENT[t.key] + ' ring-1 ring-inset ring-slate-900/10' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {t.label} <span className="ml-1 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-0 flex-1 sm:max-w-xs">
          <span className="sr-only">Search appointments</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient, date, department…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20"
          />
        </label>
        <label className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <span className="sr-only">Filter by consultation type</span>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="cursor-pointer bg-transparent text-xs font-semibold text-slate-600 focus:outline-none">
            <option value="all">All types</option>
            {Object.keys(CONSULTATION_LABEL).map((k) => (
              <option key={k} value={k}>{CONSULTATION_LABEL[k as keyof typeof CONSULTATION_LABEL]}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Counts strip */}
      {!calendarMode && (
        <p className="text-[11px] text-slate-400">
          {statuses.has('pending') && <span className="mr-3 inline-flex items-center gap-1 font-semibold text-amber-700"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> {scoped.filter((a) => a.status === 'pending').length} awaiting confirmation</span>}
          {statuses.has('no_show') && <span className="inline-flex items-center gap-1 font-semibold text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> {scoped.filter((a) => a.status === 'no_show').length} no-show</span>}
        </p>
      )}

      {/* Appointment cards */}
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <CalendarClock className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-2 text-sm font-bold text-slate-600">No {tab.replace('_', ' ')} appointments</p>
          <p className="text-xs text-slate-400">Nothing matches this view at the selected facility.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {list.map((a) => {
            const isPast = a.date < today;
            const canReschedule = ['confirmed', 'pending'].includes(a.status) && !isPast;
            const canCancel = ['confirmed', 'pending'].includes(a.status) && !isPast;
            return (
              <li key={a.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-soft transition hover:border-medical-200 hover:shadow-lift">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-lg font-extrabold tracking-tight text-slate-900">{a.date === today ? 'Today' : a.date.slice(5)} · {a.startTime}</p>
                    <p className="text-xs font-bold text-slate-700">{CONSULTATION_LABEL[a.type]}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold ${
                    a.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700'
                    : a.status === 'completed' ? 'bg-slate-100 text-slate-500'
                    : a.status === 'cancelled' ? 'bg-rose-50 text-rose-600'
                    : a.status === 'no_show' ? 'bg-slate-100 text-slate-500'
                    : 'bg-amber-50 text-amber-700'
                  }`}>{STATUS_LABEL[a.status]}</span>
                </div>
                <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-xs">
                  <p className="font-bold text-slate-800">{a.patientIdentifier}</p>
                  <p className="text-slate-500">{a.department}</p>
                  <p className="text-slate-500">{a.facilityName}</p>
                </div>
                <div className="mt-auto flex gap-2 pt-3">
                  <button type="button" onClick={() => setAppointmentStatus(a.id, 'completed')} className="flex-1 cursor-pointer rounded-xl border border-medical-200 bg-medical-50 px-2 py-1.5 text-[11px] font-bold text-medical-700 transition hover:bg-medical-100">
                    Open
                  </button>
                  {canReschedule && (
                    <button type="button" onClick={() => setAppointmentStatus(a.id, 'pending')} className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-bold text-slate-600 transition hover:border-medical-200 hover:text-medical-700">
                      Reschedule
                    </button>
                  )}
                  {canCancel && (
                    <button type="button" onClick={() => setAppointmentStatus(a.id, 'cancelled')} className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-bold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700">
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Mini calendar for the calendar tab */}
      {calendarMode && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="mb-3 text-sm font-extrabold text-slate-900">This week at a glance</h3>
          <WeekStrip onPick={(d) => setQuery(d)} />
        </div>
      )}
    </div>
  );
};

const WeekStrip: React.FC<{ onPick: (date: string) => void }> = ({ onPick }) => {
  const { appointments, activeFacilityId } = useDoctorPortal();
  const today = new Date().toISOString().slice(0, 10);
  const days = useMemo(() => {
    const arr: { date: string; label: string; day: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const date = d.toISOString().slice(0, 10);
      arr.push({ date, label: d.toLocaleDateString('en-IN', { weekday: 'short' }), day: String(d.getDate()).padStart(2, '0') });
    }
    return arr;
  }, []);

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {days.map((d) => {
        const count = appointments.filter((a) => a.facilityId === activeFacilityId && a.date === d.date && ['confirmed', 'pending'].includes(a.status)).length;
        const isToday = d.date === today;
        return (
          <button
            key={d.date}
            type="button"
            onClick={() => onPick(d.date)}
            className={`cursor-pointer rounded-xl border p-2 text-center transition ${
              isToday ? 'border-medical-500 bg-medical-50' : 'border-slate-200 bg-white hover:border-medical-200'
            }`}
          >
            <span className={`block text-[10px] font-bold ${isToday ? 'text-medical-700' : 'text-slate-400'}`}>{d.label}</span>
            <span className={`block text-sm font-extrabold ${isToday ? 'text-medical-800' : 'text-slate-800'}`}>{d.day}</span>
            <span className={`mt-0.5 block text-[9px] font-bold ${count ? 'text-medical-600' : 'text-slate-300'}`}>{count ? `${count} apt` : '—'}</span>
          </button>
        );
      })}
    </div>
  );
};
