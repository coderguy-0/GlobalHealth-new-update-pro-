import React, { useMemo, useState } from 'react';
import { Plus, Trash2, AlertTriangle, CheckCircle2, Clock3, CalendarOff, Save, Info } from 'lucide-react';
import {
  useHospitalPortal, DAY_KEYS, DAY_LABEL, CONSULTATION_LABEL, ConsultationType,
  ScheduleRule, ScheduleException, DoctorAffiliationStatus,
} from './hospitalPortalData';

interface HospitalSchedulesProps {
  section: 'schedules' | 'availability';
}

const inputCls = 'rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-800 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20';

export const HospitalSchedules: React.FC<HospitalSchedulesProps> = ({ section }) => {
  if (section === 'availability') return <AvailabilityView />;
  return <SchedulesView />;
};

/* ---------------- Schedules (§32) ---------------- */

const SchedulesView: React.FC = () => {
  const { organization, doctors, scheduleRules, scheduleExceptions, addScheduleRule, removeScheduleRule, addScheduleException, removeScheduleException } = useHospitalPortal();
  const [doctorId, setDoctorId] = useState('');
  const [days, setDays] = useState<string[]>(['monday']);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:00');
  const [duration, setDuration] = useState(30);
  const [modes, setModes] = useState<ConsultationType[]>(['in_person']);
  const [breakStart, setBreakStart] = useState('');
  const [breakEnd, setBreakEnd] = useState('');
  const [formErr, setFormErr] = useState('');
  const [ok, setOk] = useState('');

  const [excDoctorId, setExcDoctorId] = useState('');
  const [excDate, setExcDate] = useState('');
  const [excType, setExcType] = useState<'leave' | 'holiday' | 'unavailable'>('leave');
  const [excReason, setExcReason] = useState('');

  const scopedDocs = doctors.filter((d) => d.hospitalId === organization.id && d.affiliationStatus !== 'removed');
  const scopedRules = scheduleRules.filter((r) => r.hospitalId === organization.id);
  const scopedExceptions = scheduleExceptions.filter((e) => e.hospitalId === organization.id);

  const toggleDay = (d: string) => setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  const toggleMode = (c: ConsultationType) => setModes((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const validate = (): string[] => {
    const out: string[] = [];
    if (!doctorId) out.push('Select a doctor.');
    if (end <= start) out.push('End time must be after start time.');
    if (breakStart && breakEnd && breakEnd <= breakStart) out.push('Break end must be after break start.');
    if (breakStart && breakEnd && (breakStart < start || breakEnd > end)) out.push('Break must fall inside working hours.');
    if (days.length === 0) out.push('Select at least one working day.');
    if (modes.length === 0) out.push('Select at least one consultation mode.');
    return out;
  };

  const addRule = () => {
    const errs = validate();
    if (errs.length) { setFormErr(errs[0]); return; }
    addScheduleRule({
      id: `sched-${Date.now()}`,
      hospitalId: organization.id,
      doctorId,
      days: days as ScheduleRule['days'],
      startTime: start,
      endTime: end,
      slotDurationMin: duration,
      consultationModes: modes,
      breakStart: breakStart || undefined,
      breakEnd: breakEnd || undefined,
      status: 'draft',
    });
    setFormErr(''); setOk('Schedule rule saved as draft — it becomes active on publish.');
    window.setTimeout(() => setOk(''), 4000);
  };

  const addException = () => {
    if (!excDoctorId || !excDate) { setFormErr('Choose a doctor and date for the exception.'); return; }
    addScheduleException({ id: `sex-${Date.now()}`, hospitalId: organization.id, doctorId: excDoctorId, date: excDate, type: excType, reason: excReason || (excType === 'leave' ? 'Leave' : excType === 'holiday' ? 'Holiday' : 'Unavailable') });
    setExcDoctorId(''); setExcDate(''); setExcReason(''); setFormErr(''); setOk('Exception added — the doctor is treated as unavailable on that date.');
    window.setTimeout(() => setOk(''), 4000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Schedules</h2>
        <p className="text-xs text-slate-500">Reusable scheduling rules per doctor — availability is derived from these rules, never manually claimed.</p>
      </div>

      {formErr && <p role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs font-semibold text-rose-800"><AlertTriangle className="h-4 w-4 shrink-0" /> {formErr}</p>}
      {ok && <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4 shrink-0" /> {ok}</p>}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="sched-new">
        <h3 id="sched-new" className="mb-4 flex items-center gap-2 text-sm font-extrabold text-slate-900"><Plus className="h-4 w-4 text-medical-600" /> New schedule rule</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="sched-doc">Doctor</label>
            <select id="sched-doc" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className={`${inputCls} w-full`}>
              <option value="">Select doctor…</option>
              {scopedDocs.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Working days</p>
            <div className="flex flex-wrap gap-1.5">
              {DAY_KEYS.map((d) => (
                <button key={d} type="button" onClick={() => toggleDay(d)}
                  className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition ${
                    days.includes(d) ? 'border-medical-500 bg-medical-50 text-medical-800' : 'border-slate-200 bg-white text-slate-500 hover:border-medical-200'
                  }`}>
                  {DAY_LABEL[d]}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Start</span>
              <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className={inputCls} />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">End</span>
              <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className={inputCls} />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</span>
              <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={`${inputCls} w-full`}>
                {[15, 20, 30, 45, 60].map((d) => <option key={d} value={d}>{d} min</option>)}
              </select>
            </label>
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Consultation modes</p>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(CONSULTATION_LABEL) as ConsultationType[]).map((c) => (
                <button key={c} type="button" onClick={() => toggleMode(c)}
                  className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition ${
                    modes.includes(c) ? 'border-medical-500 bg-medical-50 text-medical-800' : 'border-slate-200 bg-white text-slate-500 hover:border-medical-200'
                  }`}>
                  {CONSULTATION_LABEL[c]}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:col-span-2">
            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Break start <span className="normal-case text-slate-300">(optional)</span></span>
              <input type="time" value={breakStart} onChange={(e) => setBreakStart(e.target.value)} className={inputCls} />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Break end</span>
              <input type="time" value={breakEnd} onChange={(e) => setBreakEnd(e.target.value)} className={inputCls} />
            </label>
          </div>
        </div>
        <button type="button" onClick={addRule} className="mt-4 cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">Save rule (draft)</button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="sched-list">
        <h3 id="sched-list" className="mb-3 text-sm font-extrabold text-slate-900">Schedule rules ({scopedRules.length})</h3>
        {scopedRules.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No schedule rules yet.</p>
        ) : (
          <ul className="space-y-2">
            {scopedRules.map((r) => {
              const doc = doctors.find((d) => d.id === r.doctorId);
              return (
                <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-slate-800">{doc?.name || 'Doctor'} — {r.days.map((d) => DAY_LABEL[d]).join(' · ')}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
                      <Clock3 className="h-3 w-3 text-medical-500" /> {r.startTime}–{r.endTime} · {r.slotDurationMin} min
                      {r.breakStart && <span>· break {r.breakStart}–{r.breakEnd}</span>}
                      <span>· {r.consultationModes.map((m) => CONSULTATION_LABEL[m]).join(', ')}</span>
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${r.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {r.status === 'active' ? 'Active' : 'Draft'}
                  </span>
                  <button type="button" onClick={() => removeScheduleRule(r.id)} className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Delete schedule rule">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Exceptions / leave / holidays */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="sched-exc">
        <h3 id="sched-exc" className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900"><CalendarOff className="h-4 w-4 text-medical-600" /> Leave, holidays &amp; unavailable periods</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <select value={excDoctorId} onChange={(e) => setExcDoctorId(e.target.value)} className={`${inputCls} sm:col-span-2`} aria-label="Doctor">
            <option value="">Doctor…</option>
            {scopedDocs.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <input type="date" value={excDate} onChange={(e) => setExcDate(e.target.value)} className={inputCls} aria-label="Date" />
          <select value={excType} onChange={(e) => setExcType(e.target.value as 'leave' | 'holiday' | 'unavailable')} className={inputCls} aria-label="Exception type">
            <option value="leave">Leave</option>
            <option value="holiday">Holiday</option>
            <option value="unavailable">Unavailable</option>
          </select>
          <button type="button" onClick={addException} className="cursor-pointer rounded-xl bg-medical-600 px-3 py-2 text-xs font-bold text-white hover:bg-medical-700">Add</button>
        </div>
        {scopedExceptions.length > 0 && (
          <ul className="mt-3 space-y-2">
            {scopedExceptions.map((e: ScheduleException) => {
              const doc = doctors.find((d) => d.id === e.doctorId);
              return (
                <li key={e.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-slate-800">{doc?.name || 'Doctor'} — {e.date} · {e.type}</p>
                    <p className="text-[11px] text-slate-500">{e.reason}{e.startTime && ` · ${e.startTime}–${e.endTime}`}</p>
                  </div>
                  <button type="button" onClick={() => removeScheduleException(e.id)} className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Remove exception">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

/* ---------------- Availability (§33) ---------------- */

const AvailabilityView: React.FC = () => {
  const { organization, doctors, scheduleRules, scheduleExceptions } = useHospitalPortal();

  const scopedDocs = doctors.filter((d) => d.hospitalId === organization.id && d.affiliationStatus !== 'removed');

  const derive = (doctorId: string): { level: 'available' | 'limited' | 'unavailable'; detail: string } => {
    const rules = scheduleRules.filter((r) => r.hospitalId === organization.id && r.doctorId === doctorId && r.status === 'active');
    if (rules.length === 0) return { level: 'unavailable', detail: 'No active schedule rules' };
    const totalSlots = rules.reduce((sum, r) => sum + r.days.length, 0);
    const limited = totalSlots <= 2 || rules.some((r) => r.days.length === 1);
    return { level: limited ? 'limited' : 'available', detail: `${totalSlots} working day${totalSlots === 1 ? '' : 's'} per week across ${rules.length} rule${rules.length === 1 ? '' : 's'}` };
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Availability</h2>
        <p className="text-xs text-slate-500">Generated from active schedule rules and exceptions — the portal never manually claims a doctor is available.</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="av-list">
        <h3 id="av-list" className="mb-3 text-sm font-extrabold text-slate-900">Doctor availability</h3>
        {scopedDocs.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No doctors at this hospital.</p>
        ) : (
          <ul className="space-y-2">
            {scopedDocs.map((d) => {
              const { level, detail } = derive(d.id);
              const exceptions = scheduleExceptions.filter((e) => e.hospitalId === organization.id && e.doctorId === d.id);
              const today = new Date().toISOString().slice(0, 10);
              const todayException = exceptions.find((e) => e.date === today);
              return (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-800">{d.name} <span className={`ml-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${d.affiliationStatus === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{d.affiliationStatus}</span></p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{detail}</p>
                    {todayException && <p className="mt-0.5 text-[11px] font-semibold text-amber-700">Today: {todayException.type} — {todayException.reason}</p>}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ${
                    level === 'available' ? 'bg-emerald-50 text-emerald-800'
                    : level === 'limited' ? 'bg-amber-50 text-amber-800'
                    : 'bg-slate-100 text-slate-500'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${level === 'available' ? 'bg-emerald-500' : level === 'limited' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                    {level === 'available' ? 'Available' : level === 'limited' ? 'Limited' : 'Unavailable'}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400"><Info className="h-3.5 w-3.5 text-medical-500" /> Availability is derived from schedule rules and exceptions only.</p>
      </section>
    </div>
  );
};
