import React, { useEffect, useMemo, useState } from 'react';
import { Plus, CheckCircle2, AlertTriangle, FileText, TrendingUp } from 'lucide-react';
import { useClinicalWorkspace, LAB_STATUS_LABEL } from './doctorClinicalData';

const CATEGORIES = ['Hematology', 'Biochemistry', 'Immunology', 'Microbiology', 'Pathology', 'Hormonal', 'Molecular', 'Preventive Screening'];
const TESTS: Record<string, string[]> = {
  Hematology: ['Complete Blood Count', 'ESR', 'Peripheral Smear'],
  Biochemistry: ['Fasting Blood Sugar', 'HbA1c', 'Lipid Profile', 'Creatinine', 'Electrolytes', 'LFT'],
  Immunology: ['CRP', 'ANA', 'Immunoglobulin Panel'],
  Microbiology: ['Urine Culture', 'Blood Culture', 'Sputum Culture'],
  Pathology: ['Histopathology', 'FNAC'],
  Hormonal: ['Thyroid Panel', 'Cortisol'],
  Molecular: ['PCR', 'Genetic Panel'],
  'Preventive Screening': ['Annual Health Package', 'Cardiac Risk Panel'],
};

export const DoctorLabs: React.FC = () => {
  const { patients, selectedPatientId, addLabOrder, reviewLab, selectPatient } = useClinicalWorkspace();
  const [patientId, setPatientId] = useState(selectedPatientId || patients[0]?.id || '');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [test, setTest] = useState('Complete Blood Count');
  const [indication, setIndication] = useState('');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'stat'>('routine');
  const [open, setOpen] = useState(false);
  const [dash, setDash] = useState<'orders' | 'pending' | 'completed' | 'critical' | 'historical'>('orders');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (selectedPatientId) setPatientId(selectedPatientId);
  }, [selectedPatientId]);

  const allLabs = useMemo(() => patients.flatMap((p) => p.labs.map((l) => ({ ...l, patientName: p.name, patientIdentifier: p.identifier }))), [patients]);
  const needsReview = allLabs.filter((l) => l.status === 'available').length;
  const visible = allLabs.filter((l) => {
    if (dash === 'pending') return l.status === 'ordered' || l.status === 'collected' || l.status === 'available';
    if (dash === 'completed') return l.status === 'reviewed';
    if (dash === 'critical') return l.priority === 'stat' || l.values?.some((v) => v.flag === 'high' || v.flag === 'low');
    if (dash === 'historical') return l.status === 'reviewed' || l.status === 'available';
    return true;
  });
  const active = allLabs.find((l) => l.id === activeId) || null;
  const prior = active
    ? allLabs.filter((l) => l.patientId === active.patientId && l.test === active.test && l.id !== active.id && l.values?.length)
    : [];

  const submit = () => {
    if (!patientId || !test || !indication.trim()) return;
    addLabOrder(patientId, { category, test, indication: indication.trim(), priority, orderedDate: new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) });
    selectPatient(patientId);
    setIndication(''); setOpen(false);
  };

  const acknowledge = () => {
    if (!active) return;
    reviewLab(active.id, note.trim() || 'Reviewed — correlate with clinical picture.');
    setNote('');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-[#162235]">Lab Reports</h2>
          <p className="text-xs text-[#607086]">Order, trend and sign-off · {needsReview} result{needsReview === 1 ? '' : 's'} awaiting review.</p>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1769E0] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#145bbf]"><Plus className="h-3.5 w-3.5" /> Order lab test</button>
      </div>

      {open && (
        <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#162235]">Order laboratory investigation</h3>
            <button type="button" onClick={() => setOpen(false)} className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100">✕</button>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block"><span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Patient</span>
              <select value={patientId} onChange={(e) => { setPatientId(e.target.value); selectPatient(e.target.value); }} className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none">{patients.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.identifier}</option>)}</select>
            </label>
            <label className="block"><span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Category</span>
              <select value={category} onChange={(e) => { setCategory(e.target.value); setTest(TESTS[e.target.value][0]); }} className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
            </label>
            <label className="block"><span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Test</span>
              <select value={test} onChange={(e) => setTest(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none">{(TESTS[category] || []).map((t) => <option key={t}>{t}</option>)}</select>
            </label>
            <label className="block"><span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Priority</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)} className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none">{[['routine', 'Routine'], ['urgent', 'Urgent'], ['stat', 'STAT']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            </label>
            <label className="block sm:col-span-2"><span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Clinical indication</span>
              <textarea value={indication} onChange={(e) => setIndication(e.target.value)} rows={2} placeholder="e.g. Chest pain evaluation" className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" />
            </label>
          </div>
          <button type="button" onClick={submit} disabled={!indication.trim()} className="mt-4 rounded-xl bg-[#1769E0] px-4 py-2 text-xs font-bold text-white hover:bg-[#145bbf] disabled:opacity-50">Submit order</button>
        </section>
      )}

      <div className="flex flex-wrap gap-1.5">
        {([
          ['orders', 'Orders'],
          ['pending', 'Pending Results'],
          ['completed', 'Completed Results'],
          ['critical', 'Critical Results'],
          ['historical', 'Historical Reports'],
        ] as const).map(([k, l]) => (
          <button key={k} type="button" onClick={() => setDash(k)} className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${dash === k ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'bg-white text-[#607086] ring-1 ring-[#E3E8EF]'}`}>{l}</button>
        ))}
      </div>

      <div className={`grid grid-cols-1 gap-4 ${active ? 'xl:grid-cols-[1fr_360px]' : ''}`}>
        <section className="overflow-x-auto rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="bg-slate-50/80">
              <tr className="border-b border-[#E3E8EF] text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]"><th className="px-4 py-3">Test</th><th className="px-3 py-3">Patient</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Priority</th><th className="px-3 py-3">Ordered</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-right">Result</th></tr>
            </thead>
            <tbody>
              {visible.map((l) => {
                const abnormal = l.values?.some((v) => v.flag !== 'normal');
                return (
                  <tr key={l.id} className={`border-b border-slate-50 align-middle ${activeId === l.id ? 'bg-emerald-50/50' : ''}`}>
                    <td className="px-4 py-3 font-bold text-[#162235]">{l.test}</td>
                    <td className="px-3 py-3">{l.patientName}</td>
                    <td className="px-3 py-3 text-[#607086]">{l.category}</td>
                    <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${l.priority === 'stat' ? 'bg-rose-50 text-rose-700' : l.priority === 'urgent' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{l.priority}</span></td>
                    <td className="px-3 py-3">{l.orderedDate}</td>
                    <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${l.status === 'available' ? 'bg-amber-50 text-amber-700' : l.status === 'reviewed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{LAB_STATUS_LABEL[l.status]}</span></td>
                    <td className="px-3 py-3 text-right">
                      {l.status === 'available' && <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${abnormal ? 'text-rose-700' : 'text-emerald-700'}`}>{abnormal ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />} {abnormal ? 'Abnormal' : 'Normal'}</span>}
                      <button type="button" onClick={() => { setActiveId(l.id); selectPatient(l.patientId); }} className="ml-2 rounded-lg bg-[#1769E0] px-2.5 py-1.5 text-[10px] font-bold text-white">Open</button>
                    </td>
                  </tr>
                );
              })}
              {visible.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-xs text-slate-400">No laboratory reports in this view.</td></tr>}
            </tbody>
          </table>
        </section>

        {active && (
          <aside className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-extrabold text-[#162235]">{active.test}</p>
                <p className="text-[11px] text-[#607086]">{active.patientName} · {active.patientIdentifier} · {active.priority.toUpperCase()}</p>
              </div>
              <button type="button" onClick={() => setActiveId(null)} className="text-[#8A97A8]">✕</button>
            </div>
            <p className="mt-2 text-[11px] text-[#607086]">Indication: {active.indication}</p>
            {active.values && active.values.length > 0 ? (
              <table className="mt-3 w-full text-left text-xs">
                <thead><tr className="text-[10px] font-bold uppercase text-[#8A97A8]"><th className="py-1">Analyte</th><th>Value</th><th>Ref</th></tr></thead>
                <tbody>
                  {active.values.map((v) => (
                    <tr key={v.name} className="border-t border-slate-50">
                      <td className="py-1.5 font-bold">{v.name}</td>
                      <td className={v.flag !== 'normal' ? 'font-extrabold text-rose-700' : ''}>{v.value} {v.unit} {v.flag !== 'normal' ? `· ${v.flag}` : ''}</td>
                      <td className="text-[#8A97A8]">{v.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="mt-3 text-xs text-slate-400">Result not yet available.</p>}

            {prior.length > 0 && (
              <div className="mt-4">
                <p className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]"><TrendingUp className="h-3 w-3" /> Prior {active.test}</p>
                {prior.slice(0, 3).map((p) => (
                  <p key={p.id} className="text-[11px] text-[#607086]">{p.orderedDate}: {p.values?.map((v) => `${v.name} ${v.value}`).join(', ')}</p>
                ))}
              </div>
            )}

            {active.clinicalNote && <p className="mt-3 rounded-lg bg-emerald-50 px-2.5 py-2 text-[11px] text-emerald-800"><FileText className="mr-1 inline h-3 w-3" />{active.clinicalNote}</p>}

            {active.status === 'available' && (
              <div className="mt-4 space-y-2">
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Clinical interpretation / action" className="w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs" />
                <button type="button" onClick={acknowledge} className="w-full rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white">Sign off review</button>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
};
