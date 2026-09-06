import React, { useMemo, useState } from 'react';
import { Plus, FlaskConical, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
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
  const { patients, selectedPatientId, addLabOrder, reviewLab } = useClinicalWorkspace();
  const [patientId, setPatientId] = useState(selectedPatientId || patients[0]?.id || '');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [test, setTest] = useState('Complete Blood Count');
  const [indication, setIndication] = useState('');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'stat'>('routine');
  const [open, setOpen] = useState(false);

  const allLabs = useMemo(() => patients.flatMap((p) => p.labs.map((l) => ({ ...l, patientName: p.name }))), [patients]);
  const needsReview = allLabs.filter((l) => l.status === 'available').length;

  const submit = () => {
    if (!patientId || !test || !indication.trim()) return;
    addLabOrder(patientId, { category, test, indication: indication.trim(), priority, orderedDate: new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) });
    setIndication(''); setOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-[#162235]">Lab & Diagnostics</h2>
          <p className="text-xs text-[#607086]">{needsReview} result{needsReview === 1 ? '' : 's'} awaiting review.</p>
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
              <select value={patientId} onChange={(e) => setPatientId(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none">{patients.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.identifier}</option>)}</select>
            </label>
            <label className="block"><span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Category</span>
              <select value={category} onChange={(e) => { setCategory(e.target.value); setTest(TESTS[e.target.value][0]); }} className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
            </label>
            <label className="block"><span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Test</span>
              <select value={test} onChange={(e) => setTest(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none">{(TESTS[category] || []).map((t) => <option key={t}>{t}</option>)}</select>
            </label>
            <label className="block"><span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Priority</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none">{[['routine', 'Routine'], ['urgent', 'Urgent'], ['stat', 'STAT']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            </label>
            <label className="block sm:col-span-2"><span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Clinical indication</span>
              <textarea value={indication} onChange={(e) => setIndication(e.target.value)} rows={2} placeholder="e.g. Chest pain evaluation" className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" />
            </label>
          </div>
          <button type="button" onClick={submit} disabled={!indication.trim()} className="mt-4 rounded-xl bg-[#1769E0] px-4 py-2 text-xs font-bold text-white hover:bg-[#145bbf] disabled:opacity-50">Submit order</button>
        </section>
      )}

      <section className="overflow-x-auto rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="bg-slate-50/80">
            <tr className="border-b border-[#E3E8EF] text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]"><th className="px-4 py-3">Test</th><th className="px-3 py-3">Patient</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Priority</th><th className="px-3 py-3">Ordered</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-right">Result</th></tr>
          </thead>
          <tbody>
            {allLabs.map((l) => {
              const abnormal = l.values?.some((v) => v.flag !== 'normal');
              return (
                <tr key={l.id} className="border-b border-slate-50 align-middle">
                  <td className="px-4 py-3 font-bold text-[#162235]">{l.test}</td>
                  <td className="px-3 py-3">{l.patientName}</td>
                  <td className="px-3 py-3 text-[#607086]">{l.category}</td>
                  <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${l.priority === 'stat' ? 'bg-rose-50 text-rose-700' : l.priority === 'urgent' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{l.priority}</span></td>
                  <td className="px-3 py-3">{l.orderedDate}</td>
                  <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${l.status === 'available' ? 'bg-amber-50 text-amber-700' : l.status === 'reviewed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{LAB_STATUS_LABEL[l.status]}</span></td>
                  <td className="px-3 py-3 text-right">
                    {l.status === 'available' && <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${abnormal ? 'text-rose-700' : 'text-emerald-700'}`}>{abnormal ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />} {abnormal ? 'Abnormal' : 'Normal'}</span>}
                    {l.status === 'available' && <button type="button" onClick={() => reviewLab(l.id, 'Reviewed — correlate with clinical picture.')} className="ml-2 rounded-lg bg-[#1769E0] px-2.5 py-1.5 text-[10px] font-bold text-white">Review</button>}
                    {l.status === 'reviewed' && <span className="text-[10px] text-[#8A97A8]"><FileText className="mr-1 inline h-3 w-3" />Reviewed</span>}
                  </td>
                </tr>
              );
            })}
            {allLabs.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-xs text-slate-400">No lab orders yet.</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
};
