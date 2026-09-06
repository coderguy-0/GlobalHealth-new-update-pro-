import React, { useMemo, useState } from 'react';
import { Plus, Trash2, AlertTriangle, CheckCircle2, Clock3, CalendarOff, Save } from 'lucide-react';
import {
  useDoctorPortal, APPOINTMENT_DURATIONS, CONSULTATION_LABEL, ConsultationType,
  AvailabilityRule, AvailabilityException, FACILITIES
} from './doctorPortalData';

const DAYS = [
  { key: 'monday', label: 'Mon' }, { key: 'tuesday', label: 'Tue' }, { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' }, { key: 'friday', label: 'Fri' }, { key: 'saturday', label: 'Sat' }, { key: 'sunday', label: 'Sun' },
] as const;

const inputCls = 'rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-800 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20';

export const DoctorAvailability: React.FC = () => {
  const { doctor, activeFacilityId, availability, exceptions, addAvailabilityRule, removeAvailabilityRule, addAvailabilityException, removeAvailabilityException } = useDoctorPortal();
  const facility = FACILITIES.find((f) => f.id === activeFacilityId)!;

  const facilityRules = availability.filter((r) => r.facilityId === activeFacilityId);
  const facilityExceptions = exceptions.filter((e) => e.facilityId === activeFacilityId);

  // New rule form
  const [days, setDays] = useState<string[]>(['monday']);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:00');
  const [duration, setDuration] = useState(30);
  const [modes, setModes] = useState<ConsultationType[]>(['in_person']);
  const [breakStart, setBreakStart] = useState('');
  const [breakEnd, setBreakEnd] = useState('');
  const [formError, setFormError] = useState('');
  const [publishError, setPublishError] = useState('');
  const [published, setPublished] = useState(false);

  const toggleDay = (d: string) => setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  const toggleMode = (c: ConsultationType) => setModes((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const conflicts = useMemo(() => {
    const out: string[] = [];
    if (end <= start) out.push('End time must be after start time.');
    if (breakStart && breakEnd && breakEnd <= breakStart) out.push('Break end must be after break start.');
    if (breakStart && breakEnd && (breakStart < start || breakEnd > end)) out.push('Break must fall inside working hours.');
    if (duration > 60) out.push('Duration must be 15–60 minutes.');
    if (days.length === 0) out.push('Select at least one working day.');
    if (modes.length === 0) out.push('Select at least one consultation mode.');
    return out;
  }, [days, start, end, duration, modes, breakStart, breakEnd]);

  const addRule = () => {
    if (conflicts.length) { setFormError(conflicts[0]); return; }
    const rule: AvailabilityRule = {
      id: `rule-${Date.now()}`,
      doctorId: doctor.id,
      facilityId: activeFacilityId,
      days: days as AvailabilityRule['days'],
      startTime: start,
      endTime: end,
      slotDurationMin: duration,
      consultationModes: modes,
      breakStart: breakStart || undefined,
      breakEnd: breakEnd || undefined,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addAvailabilityRule(rule);
    setFormError('');
    setPublished(false);
  };

  const publish = () => {
    const draftRules = facilityRules.filter((r) => r.status === 'draft');
    const errs: string[] = [];
    for (const r of draftRules) {
      if (r.endTime <= r.startTime) errs.push(`${r.days.map((d) => d).join(', ')}: end after start.`);
      if (r.breakStart && r.breakEnd && (r.breakStart < r.startTime || r.breakEnd > r.endTime)) errs.push(`${r.days.join(', ')}: break outside hours.`);
    }
    if (errs.length) { setPublishError(errs[0]); return; }
    setPublishError('');
    setPublished(true);
    window.setTimeout(() => setPublished(false), 4000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Availability</h2>
        <p className="text-xs text-slate-500">Reusable schedule rules for {facility.name}. Conflicts are detected before publishing.</p>
      </div>

      {/* New rule */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="new-rule-title">
        <h3 id="new-rule-title" className="mb-4 flex items-center gap-2 text-sm font-extrabold text-slate-900"><Plus className="h-4 w-4 text-medical-600" /> New schedule rule</h3>

        {formError && (
          <p role="alert" className="mb-3 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs font-semibold text-rose-800">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" /> {formError}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Working days</p>
            <div className="flex flex-wrap gap-1.5">
              {DAYS.map((d) => (
                <button key={d.key} type="button" onClick={() => toggleDay(d.key)}
                  className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition ${
                    days.includes(d.key) ? 'border-medical-500 bg-medical-50 text-medical-800' : 'border-slate-200 bg-white text-slate-500 hover:border-medical-200'
                  }`}>
                  {d.label}
                </button>
              ))}
            </div>
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
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Slot</span>
              <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={`${inputCls} w-full`}>
                {APPOINTMENT_DURATIONS.map((d) => <option key={d} value={d}>{d} min</option>)}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
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

        <button type="button" onClick={addRule} className="mt-4 cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-medical-700">
          Add as draft
        </button>
        <p className="mt-1.5 text-[10px] text-slate-400">Draft rules are validated again when you publish. No slot list is generated — patients book into reusable rules.</p>
      </section>

      {/* Existing rules */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="rules-title">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 id="rules-title" className="text-sm font-extrabold text-slate-900">Schedule rules · {facility.name}</h3>
          {facilityRules.filter((r) => r.status === 'draft').length > 0 && (
            <button type="button" onClick={publish} className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-medical-700">
              <Save className="h-3.5 w-3.5" /> Publish {facilityRules.filter((r) => r.status === 'draft').length} draft{facilityRules.filter((r) => r.status === 'draft').length > 1 ? 's' : ''}
            </button>
          )}
        </div>

        {publishError && (
          <p role="alert" className="mb-3 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs font-semibold text-rose-800">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" /> {publishError}
          </p>
        )}
        {published && (
          <p role="status" className="mb-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> Schedule published — no conflicts detected.
          </p>
        )}

        {facilityRules.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No schedule rules for this facility yet.</p>
        ) : (
          <ul className="space-y-2">
            {facilityRules.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-slate-800">
                    {r.days.map((d) => d.charAt(0).toUpperCase() + d.slice(1, 3)).join(' · ')}
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
                    <Clock3 className="h-3 w-3 text-medical-500" /> {r.startTime}–{r.endTime} · {r.slotDurationMin} min
                    {r.breakStart && <span>· break {r.breakStart}–{r.breakEnd}</span>}
                    <span>· {r.consultationModes.map((m) => CONSULTATION_LABEL[m]).join(', ')}</span>
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${r.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {r.status === 'active' ? 'Published' : 'Draft'}
                </span>
                <button type="button" onClick={() => removeAvailabilityRule(r.id)} className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete rule for ${r.days.join(', ')}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Holidays / leave / exceptions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="exceptions-title">
        <h3 id="exceptions-title" className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900"><CalendarOff className="h-4 w-4 text-medical-600" /> Leave, holidays &amp; exceptions</h3>
        <AddExceptionForm
          onAdd={(e) => { addAvailabilityException(e); }}
          doctorId={doctor.id}
          facilityId={activeFacilityId}
        />
        {facilityExceptions.length === 0 ? (
          <p className="mt-2 rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-400">No exceptions for this facility.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {facilityExceptions.map((e) => (
              <li key={e.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-slate-800">{e.date} — {e.reason}</p>
                  <p className="text-[11px] text-slate-500">{e.type === 'leave' ? 'Full-day unavailability' : 'Time-block exception'}{e.startTime && ` · ${e.startTime}–${e.endTime}`}</p>
                </div>
                <button type="button" onClick={() => removeAvailabilityException(e.id)} className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Remove exception">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const AddExceptionForm: React.FC<{ onAdd: (e: AvailabilityException) => void; doctorId: string; facilityId: string }> = ({ onAdd, doctorId, facilityId }) => {
  const [date, setDate] = useState('');
  const [type, setType] = useState<'leave' | 'custom'>('leave');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [reason, setReason] = useState('');
  const [err, setErr] = useState('');

  const submit = () => {
    if (!date) { setErr('Choose a date.'); return; }
    if (type === 'custom' && (!start || !end)) { setErr('Set the exception time window.'); return; }
    if (type === 'custom' && end <= start) { setErr('End must be after start.'); return; }
    onAdd({
      id: `exc-${Date.now()}`,
      doctorId,
      facilityId,
      date,
      type,
      startTime: type === 'custom' ? start : undefined,
      endTime: type === 'custom' ? end : undefined,
      reason: reason || (type === 'leave' ? 'Leave' : 'Time-block exception'),
    });
    setDate(''); setStart(''); setEnd(''); setReason(''); setErr('');
  };

  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-3">
      {err && <p role="alert" className="mb-2 text-xs font-semibold text-rose-700">{err}</p>}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} aria-label="Exception date" />
        <select value={type} onChange={(e) => setType(e.target.value as 'leave' | 'custom')} className={inputCls} aria-label="Exception type">
          <option value="leave">Full-day leave</option>
          <option value="custom">Time block</option>
        </select>
        <div className="flex gap-1.5">
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)} disabled={type === 'leave'} className={`${inputCls} w-full disabled:opacity-40`} aria-label="Exception start" />
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} disabled={type === 'leave'} className={`${inputCls} w-full disabled:opacity-40`} aria-label="Exception end" />
        </div>
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (e.g. CME conference)" className={inputCls} aria-label="Exception reason" />
      </div>
      <button type="button" onClick={submit} className="mt-2 cursor-pointer rounded-xl border border-medical-200 bg-white px-3 py-1.5 text-[11px] font-bold text-medical-700 transition hover:bg-medical-50">
        + Add exception
      </button>
    </div>
  );
};
