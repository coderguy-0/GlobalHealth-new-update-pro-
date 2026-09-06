import React, { useMemo, useState } from 'react';
import { Activity, Save } from 'lucide-react';
import { useClinicalWorkspace, VitalsRecord, VitalSource } from './doctorClinicalData';
import { WorkspaceView } from './doctorPortalData';

type Range = '24h' | '7d' | '30d' | '3m' | '1y' | 'all';
const RANGES: { id: Range; label: string; days: number | null }[] = [
  { id: '24h', label: '24 hours', days: 1 },
  { id: '7d', label: '7 days', days: 7 },
  { id: '30d', label: '30 days', days: 30 },
  { id: '3m', label: '3 months', days: 90 },
  { id: '1y', label: '1 year', days: 365 },
  { id: 'all', label: 'All time', days: null },
];

interface Props { onNavigate?: (v: WorkspaceView) => void }

export const DoctorVitalsTrends: React.FC<Props> = () => {
  const { patients, selectedPatientId, addVitals } = useClinicalWorkspace();
  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const [range, setRange] = useState<Range>('all');
  const [metric, setMetric] = useState<'bp' | 'hr' | 'spo2' | 'weight' | 'glucose'>('bp');
  const [form, setForm] = useState({ bp: '', hr: '', temp: '', spo2: '', rr: '', weight: '', height: '', glucose: '', source: 'doctor' as VitalSource });

  const series = useMemo(() => {
    if (!patient) return [];
    const cutoff = RANGES.find((r) => r.id === range)?.days;
    const now = Date.now();
    return [...patient.vitals]
      .filter((v) => {
        if (cutoff == null) return true;
        const t = new Date(v.date + 'T' + (v.time || '00:00')).getTime();
        return now - t <= cutoff * 86400000;
      })
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [patient, range]);

  if (!patient) {
    return <Empty label="Select a patient from Patients & Appointments to view vitals." />;
  }

  const values = series.map((v) => metricValue(v, metric));
  const max = Math.max(...values.map((n) => n ?? 0), 1);

  const save = () => {
    addVitals(patient.id, {
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
      bp: form.bp || '—',
      hr: Number(form.hr) || 0,
      temp: form.temp || '—',
      spo2: Number(form.spo2) || 0,
      rr: Number(form.rr) || 0,
      weight: Number(form.weight) || 0,
      height: Number(form.height) || undefined,
      glucose: Number(form.glucose) || undefined,
      source: form.source,
    });
    setForm({ bp: '', hr: '', temp: '', spo2: '', rr: '', weight: '', height: '', glucose: '', source: 'doctor' });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-[#162235]">Vitals & Trends</h2>
        <p className="text-xs text-[#607086]">Clinical visualization for {patient.name} · every value retains provenance.</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {RANGES.map((r) => (
          <button key={r.id} type="button" onClick={() => setRange(r.id)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${range === r.id ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'bg-white text-[#607086] ring-1 ring-[#E3E8EF]'}`}>{r.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {(['bp', 'hr', 'spo2', 'weight', 'glucose'] as const).map((m) => {
          const latest = series[series.length - 1];
          return (
            <button key={m} type="button" onClick={() => setMetric(m)} className={`rounded-2xl border p-4 text-left shadow-soft ${metric === m ? 'border-emerald-300 bg-emerald-50' : 'border-[#E3E8EF] bg-white'}`}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">{labelOf(m)}</p>
              <p className="mt-1 text-xl font-extrabold text-[#162235]">{latest ? display(latest, m) : '—'}</p>
            </button>
          );
        })}
      </div>

      <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
        <div className="mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-700" />
          <h3 className="text-sm font-extrabold text-[#162235]">{labelOf(metric)} trend</h3>
        </div>
        {series.length === 0 ? (
          <p className="text-xs text-slate-400">No vitals in this window.</p>
        ) : (
          <div className="flex h-40 items-end gap-1.5">
            {series.map((v) => {
              const n = metricValue(v, metric);
              const h = n == null ? 8 : Math.max(8, Math.round((n / max) * 140));
              const abnormal = isAbnormal(v, metric);
              return (
                <div key={v.id} className="flex min-w-0 flex-1 flex-col items-center justify-end">
                  <span className="mb-1 text-[9px] font-bold text-[#607086]">{display(v, metric)}</span>
                  <div className={`w-full max-w-8 rounded-t-md ${abnormal ? 'bg-rose-400' : 'bg-emerald-500'}`} style={{ height: h }} title={`${v.date} ${v.time}`} />
                  <span className="mt-1 truncate text-[9px] text-[#8A97A8]">{v.date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
          <h3 className="mb-3 text-sm font-extrabold text-[#162235]">Record vitals</h3>
          <div className="grid grid-cols-2 gap-2">
            {(['bp', 'hr', 'temp', 'spo2', 'rr', 'weight', 'height', 'glucose'] as const).map((k) => (
              <label key={k} className="block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">{k}</span>
                <input value={(form as any)[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-2.5 py-2 text-xs" />
              </label>
            ))}
          </div>
          <select value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value as VitalSource }))} className="mt-2 w-full rounded-xl border border-[#E3E8EF] px-2.5 py-2 text-xs">
            {['doctor', 'nurse', 'hospital', 'device', 'patient'].map((s) => <option key={s} value={s}>Source: {s}</option>)}
          </select>
          <button type="button" onClick={save} className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"><Save className="h-3.5 w-3.5" /> Save vitals</button>
        </section>
        <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft lg:col-span-2">
          <h3 className="mb-3 text-sm font-extrabold text-[#162235]">Comparison across encounters</h3>
          {series.length === 0 ? <p className="text-xs text-slate-400">No measurements yet.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead><tr className="border-b border-[#E3E8EF] text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]"><th className="py-2">Date</th><th>BP</th><th>HR</th><th>Temp</th><th>SpO₂</th><th>Weight</th><th>Glucose</th><th>Source</th></tr></thead>
                <tbody>
                  {[...series].reverse().map((v) => (
                    <tr key={v.id} className="border-b border-slate-50">
                      <td className="py-2 font-bold">{v.date} {v.time}</td>
                      <td className={isAbnormal(v, 'bp') ? 'font-bold text-rose-700' : ''}>{v.bp}</td>
                      <td>{v.hr}</td><td>{v.temp}</td><td>{v.spo2}%</td><td>{v.weight} kg</td>
                      <td>{v.glucose ?? '—'}</td>
                      <td className="capitalize text-[#8A97A8]">{v.source || 'doctor'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

function labelOf(m: string) {
  return ({ bp: 'Blood pressure', hr: 'Heart rate', spo2: 'SpO₂', weight: 'Weight', glucose: 'Blood glucose' } as Record<string, string>)[m] || m;
}
function metricValue(v: VitalsRecord, m: string): number | null {
  if (m === 'hr') return v.hr;
  if (m === 'spo2') return v.spo2;
  if (m === 'weight') return v.weight;
  if (m === 'glucose') return v.glucose ?? null;
  const sys = Number(String(v.bp).split('/')[0]);
  return Number.isFinite(sys) ? sys : null;
}
function display(v: VitalsRecord, m: string) {
  if (m === 'bp') return v.bp;
  if (m === 'hr') return `${v.hr}`;
  if (m === 'spo2') return `${v.spo2}%`;
  if (m === 'weight') return `${v.weight} kg`;
  return v.glucose != null ? `${v.glucose}` : '—';
}
function isAbnormal(v: VitalsRecord, m: string) {
  if (m === 'bp') { const s = Number(String(v.bp).split('/')[0]); return s >= 140; }
  if (m === 'hr') return v.hr >= 100 || v.hr < 50;
  if (m === 'spo2') return v.spo2 < 94;
  if (m === 'glucose') return (v.glucose || 0) >= 140;
  return false;
}
const Empty: React.FC<{ label: string }> = ({ label }) => (
  <div className="rounded-2xl border border-dashed border-[#E3E8EF] bg-white p-10 text-center text-xs text-slate-400">{label}</div>
);
