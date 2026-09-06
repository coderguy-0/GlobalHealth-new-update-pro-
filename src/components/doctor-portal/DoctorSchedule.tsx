import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDoctorPortal, CONSULTATION_LABEL, STATUS_LABEL, FACILITIES, Appointment } from './doctorPortalData';
import { DoctorAvailability } from './DoctorAvailability';
import { useClinicalWorkspace } from './doctorClinicalData';

type CalView = 'day' | 'week' | 'month' | 'agenda' | 'rules';

function iso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }

export const DoctorSchedule: React.FC<{ onOpenAppointment?: (a: Appointment) => void }> = ({ onOpenAppointment }) => {
  const { appointments, activeFacilityId, availability, rescheduleAppointment, setAppointmentStatus } = useDoctorPortal();
  const { selectPatient } = useClinicalWorkspace();
  const [view, setView] = useState<CalView>('week');
  const [cursor, setCursor] = useState(() => new Date());
  const [picked, setPicked] = useState<Appointment | null>(null);
  const [rsDate, setRsDate] = useState('');
  const [rsStart, setRsStart] = useState('');
  const [rsEnd, setRsEnd] = useState('');
  const today = iso(new Date());
  const facility = FACILITIES.find((f) => f.id === activeFacilityId);

  const scoped = appointments.filter((a) => a.facilityId === activeFacilityId);
  const rules = availability.filter((r) => r.facilityId === activeFacilityId && r.status === 'active');

  const weekStart = useMemo(() => {
    const d = new Date(cursor);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [cursor]);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const monthCells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = addDays(first, first.getDay() === 0 ? -6 : 1 - first.getDay());
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [cursor]);

  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  const open = (a: Appointment) => {
    if (a.patientId) selectPatient(a.patientId);
    setPicked(a);
    setRsDate(a.date);
    setRsStart(a.startTime);
    setRsEnd(a.endTime);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-[#162235]">Schedule & Availability</h2>
          <p className="text-xs text-[#607086]">{facility?.name} · {rules.length} published rule{rules.length === 1 ? '' : 's'}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(['day', 'week', 'month', 'agenda', 'rules'] as CalView[]).map((v) => (
            <button key={v} type="button" onClick={() => setView(v)} className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${view === v ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'bg-white text-[#607086] ring-1 ring-[#E3E8EF]'}`}>{v === 'rules' ? 'Availability rules' : v}</button>
          ))}
        </div>
      </div>

      {view !== 'rules' && (
        <div className="flex items-center justify-between rounded-2xl border border-[#E3E8EF] bg-white px-3 py-2">
          <button type="button" onClick={() => setCursor(addDays(cursor, view === 'month' ? -30 : view === 'day' ? -1 : -7))} className="rounded-lg p-1.5 hover:bg-slate-50" aria-label="Previous"><ChevronLeft className="h-4 w-4" /></button>
          <p className="text-sm font-extrabold text-[#162235]">
            {view === 'month' ? cursor.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
              : view === 'day' ? cursor.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })
                : `${iso(days[0])} — ${iso(days[6])}`}
          </p>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setCursor(new Date())} className="rounded-lg px-2 py-1 text-[10px] font-bold text-emerald-700 hover:bg-emerald-50">Today</button>
            <button type="button" onClick={() => setCursor(addDays(cursor, view === 'month' ? 30 : view === 'day' ? 1 : 7))} className="rounded-lg p-1.5 hover:bg-slate-50" aria-label="Next"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {view === 'week' && (
        <div className="overflow-x-auto rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
          <div className="grid min-w-[840px] grid-cols-8 border-b border-[#E3E8EF] text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">
            <div className="p-2">Time</div>
            {days.map((d) => (
              <div key={iso(d)} className={`p-2 text-center ${iso(d) === today ? 'bg-emerald-50 text-emerald-800' : ''}`}>
                {d.toLocaleDateString('en-IN', { weekday: 'short' })} {d.getDate()}
              </div>
            ))}
          </div>
          {hours.map((h) => (
            <div key={h} className="grid min-w-[840px] grid-cols-8 border-b border-slate-50">
              <div className="p-2 text-[10px] font-bold text-[#8A97A8]">{h}</div>
              {days.map((d) => {
                const date = iso(d);
                const slots = scoped.filter((a) => a.date === date && a.startTime.startsWith(h.slice(0, 2)));
                return (
                  <div key={date + h} className="min-h-[44px] border-l border-slate-50 p-1">
                    {slots.map((a) => (
                      <button key={a.id} type="button" onClick={() => open(a)} className={`mb-0.5 w-full truncate rounded-md px-1.5 py-1 text-left text-[10px] font-bold ${a.status === 'cancelled' ? 'bg-rose-50 text-rose-700' : a.telemedicine ? 'bg-indigo-50 text-indigo-800' : 'bg-emerald-50 text-emerald-800'}`}>
                        {a.startTime} {a.patientName || a.patientIdentifier}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {view === 'day' && (
        <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
          {scoped.filter((a) => a.date === iso(cursor)).length === 0 ? (
            <p className="text-xs text-slate-400">No appointments on this day.</p>
          ) : scoped.filter((a) => a.date === iso(cursor)).sort((a, b) => a.startTime.localeCompare(b.startTime)).map((a) => (
            <button key={a.id} type="button" onClick={() => open(a)} className="mb-2 flex w-full items-center justify-between rounded-xl border border-[#E3E8EF] px-3 py-2 text-left hover:border-emerald-300">
              <span className="text-xs font-bold text-[#162235]">{a.startTime}–{a.endTime} · {a.patientName} · {CONSULTATION_LABEL[a.type]}</span>
              <span className="text-[10px] font-bold text-[#607086]">{STATUS_LABEL[a.status]}</span>
            </button>
          ))}
        </section>
      )}

      {view === 'month' && (
        <div className="grid grid-cols-7 overflow-hidden rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <div key={d} className="border-b border-[#E3E8EF] bg-slate-50 px-2 py-1.5 text-center text-[10px] font-bold uppercase text-[#8A97A8]">{d}</div>)}
          {monthCells.map((d) => {
            const date = iso(d);
            const items = scoped.filter((a) => a.date === date);
            const inMonth = d.getMonth() === cursor.getMonth();
            return (
              <button key={date} type="button" onClick={() => { setCursor(d); setView('day'); }} className={`min-h-[88px] border-b border-r border-slate-50 p-1.5 text-left ${iso(d) === today ? 'bg-emerald-50/60' : ''} ${inMonth ? '' : 'bg-slate-50/40 text-slate-300'}`}>
                <span className="text-[11px] font-bold">{d.getDate()}</span>
                {items.slice(0, 3).map((a) => <span key={a.id} className="mt-0.5 block truncate text-[9px] font-semibold text-emerald-800">{a.startTime} {a.patientName?.split(' ')[0]}</span>)}
                {items.length > 3 && <span className="text-[9px] text-[#8A97A8]">+{items.length - 3}</span>}
              </button>
            );
          })}
        </div>
      )}

      {view === 'agenda' && (
        <ul className="space-y-2">
          {scoped.filter((a) => a.date >= today).sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime)).slice(0, 20).map((a) => (
            <li key={a.id}>
              <button type="button" onClick={() => open(a)} className="flex w-full items-center justify-between rounded-2xl border border-[#E3E8EF] bg-white px-4 py-3 text-left shadow-soft hover:border-emerald-300">
                <span className="text-xs font-bold text-[#162235]">{a.date} {a.startTime} · {a.patientName || a.patientIdentifier} · {CONSULTATION_LABEL[a.type]}</span>
                <span className="text-[10px] font-bold text-[#607086]">{STATUS_LABEL[a.status]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {view === 'rules' && <DoctorAvailability />}

      {picked && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/40 p-4 sm:items-center" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-3xl border border-[#E3E8EF] bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-extrabold text-[#162235]">{picked.patientName || picked.patientIdentifier}</p>
                <p className="text-[11px] text-[#607086]">{CONSULTATION_LABEL[picked.type]} · {STATUS_LABEL[picked.status]} · {picked.date} {picked.startTime}–{picked.endTime}</p>
              </div>
              <button type="button" onClick={() => setPicked(null)} className="text-[#8A97A8]">✕</button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <label className="block text-[10px] font-bold uppercase text-[#8A97A8]">Date
                <input type="date" value={rsDate} onChange={(e) => setRsDate(e.target.value)} className="mt-1 w-full rounded-xl border px-2 py-1.5 text-xs font-semibold normal-case" />
              </label>
              <label className="block text-[10px] font-bold uppercase text-[#8A97A8]">Start
                <input type="time" value={rsStart} onChange={(e) => setRsStart(e.target.value)} className="mt-1 w-full rounded-xl border px-2 py-1.5 text-xs font-semibold normal-case" />
              </label>
              <label className="block text-[10px] font-bold uppercase text-[#8A97A8]">End
                <input type="time" value={rsEnd} onChange={(e) => setRsEnd(e.target.value)} className="mt-1 w-full rounded-xl border px-2 py-1.5 text-xs font-semibold normal-case" />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => { rescheduleAppointment(picked.id, rsDate, rsStart, rsEnd); setPicked(null); }} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white">Reschedule</button>
              {['confirmed', 'waiting', 'checked_in'].includes(picked.status) && (
                <button type="button" onClick={() => { setAppointmentStatus(picked.id, 'no_show'); setPicked(null); }} className="rounded-xl border px-3 py-2 text-xs font-bold">No-show</button>
              )}
              {['confirmed', 'pending', 'requested'].includes(picked.status) && (
                <button type="button" onClick={() => { setAppointmentStatus(picked.id, 'cancelled'); setPicked(null); }} className="rounded-xl border px-3 py-2 text-xs font-bold text-rose-600">Cancel</button>
              )}
              <button type="button" onClick={() => { onOpenAppointment?.(picked); setPicked(null); }} className="rounded-xl border px-3 py-2 text-xs font-bold">Open encounter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
