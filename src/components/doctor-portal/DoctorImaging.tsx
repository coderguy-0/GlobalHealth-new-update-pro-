import React, { useMemo, useState } from 'react';
import { Plus, ScanLine, CheckCircle2, X } from 'lucide-react';
import { useClinicalWorkspace, IMAGING_STATUS_LABEL } from './doctorClinicalData';

const MODALITIES = ['X-ray', 'CT', 'MRI', 'Ultrasound', 'Mammography', 'ECG', 'Other'] as const;

export const DoctorImaging: React.FC = () => {
  const { patients, selectedPatientId, addImaging, reviewImaging } = useClinicalWorkspace();
  const [patientId, setPatientId] = useState(selectedPatientId || patients[0]?.id || '');
  const [modality, setModality] = useState<string>('X-ray');
  const [title, setTitle] = useState('');
  const [facility, setFacility] = useState('GlobalHealth Medical Center');
  const [open, setOpen] = useState(false);
  const [viewer, setViewer] = useState<string | null>(null);

  const all = useMemo(() => patients.flatMap((p) => p.imaging.map((i) => ({ ...i, patientName: p.name, patientIdentifier: p.identifier, bloodGroup: p.bloodGroup }))), [patients]);
  const selected = all.find((i) => i.id === viewer);

  const submit = () => {
    if (!patientId || !title.trim()) return;
    addImaging(patientId, { modality: modality as any, title: title.trim(), date: new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }), facility });
    setTitle(''); setOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-[#162235]">Imaging</h2>
          <p className="text-xs text-[#607086]">Radiology and diagnostic record review.</p>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1769E0] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#145bbf]"><Plus className="h-3.5 w-3.5" /> Order imaging</button>
      </div>

      {open && (
        <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between"><h3 className="text-sm font-extrabold text-[#162235]">Order imaging study</h3><button type="button" onClick={() => setOpen(false)} className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100">✕</button></div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block"><span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Patient</span><select value={patientId} onChange={(e) => setPatientId(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none">{patients.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.identifier}</option>)}</select></label>
            <label className="block"><span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Modality</span><select value={modality} onChange={(e) => setModality(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none">{MODALITIES.map((m) => <option key={m}>{m}</option>)}</select></label>
            <label className="block"><span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Study title</span><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Chest X-ray PA" className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" /></label>
            <label className="block"><span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Facility</span><input value={facility} onChange={(e) => setFacility(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" /></label>
          </div>
          <button type="button" onClick={submit} disabled={!title.trim()} className="mt-4 rounded-xl bg-[#1769E0] px-4 py-2 text-xs font-bold text-white hover:bg-[#145bbf] disabled:opacity-50">Submit order</button>
        </section>
      )}

      <section className="overflow-x-auto rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="bg-slate-50/80"><tr className="border-b border-[#E3E8EF] text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]"><th className="px-4 py-3">Study</th><th className="px-3 py-3">Patient</th><th className="px-3 py-3">Modality</th><th className="px-3 py-3">Facility</th><th className="px-3 py-3">Date</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-right">Action</th></tr></thead>
          <tbody>
            {all.map((i) => (
              <tr key={i.id} className="border-b border-slate-50">
                <td className="px-4 py-3 font-bold text-[#162235]">{i.title}</td>
                <td className="px-3 py-3">{i.patientName}</td>
                <td className="px-3 py-3 text-[#607086]">{i.modality}</td>
                <td className="px-3 py-3">{i.facility}</td>
                <td className="px-3 py-3">{i.date}</td>
                <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${i.status === 'available' ? 'bg-amber-50 text-amber-700' : i.status === 'reviewed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{IMAGING_STATUS_LABEL[i.status]}</span></td>
                <td className="px-3 py-3 text-right">
                  <button type="button" onClick={() => setViewer(i.id)} className="rounded-lg bg-[#1769E0] px-2.5 py-1.5 text-[10px] font-bold text-white">Open viewer</button>
                  {i.status === 'available' && <button type="button" onClick={() => reviewImaging(i.id, 'Reviewed — correlate clinically.')} className="ml-2 rounded-lg border border-[#E3E8EF] px-2.5 py-1.5 text-[10px] font-bold text-[#607086]">Mark reviewed</button>}
                </td>
              </tr>
            ))}
            {all.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-xs text-slate-400">No imaging studies yet.</td></tr>}
          </tbody>
        </table>
      </section>

      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-[#E3E8EF] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E3E8EF] px-5 py-3">
              <div><h3 className="text-sm font-extrabold text-[#162235]">{selected.title} <span className="ml-1 text-[10px] font-bold text-[#8A97A8]">{selected.modality}</span></h3><p className="text-[11px] text-[#607086]">{selected.patientName} · {selected.patientIdentifier} · {selected.date}</p></div>
              <button type="button" onClick={() => setViewer(null)} className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid h-[calc(100%-60px)] grid-cols-1 lg:grid-cols-3">
              <div className="border-b border-[#E3E8EF] p-5 lg:border-b-0 lg:border-r">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Patient information</p>
                <div className="mt-2 space-y-1.5 text-xs text-[#162235]"><p><span className="text-[#8A97A8]">Name:</span> {selected.patientName}</p><p><span className="text-[#8A97A8]">ID:</span> {selected.patientIdentifier}</p><p><span className="text-[#8A97A8]">Blood:</span> {selected.bloodGroup}</p></div>
              </div>
              <div className="grid place-items-center bg-slate-900 p-6 lg:col-span-1">
                <div className="text-center text-slate-400"><ScanLine className="mx-auto h-16 w-16" /><p className="mt-2 text-xs">Diagnostic image viewer</p><p className="text-[10px]">Real DICOM/imaging stream is connected at the facility level.</p></div>
              </div>
              <div className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Report</p>
                {selected.findings ? <div className="mt-2 space-y-2 text-xs"><p><span className="font-bold text-[#162235]">Findings:</span> <span className="text-[#607086]">{selected.findings}</span></p><p><span className="font-bold text-[#162235]">Impression:</span> <span className="text-[#607086]">{selected.impression}</span></p><p><span className="font-bold text-[#162235]">Clinical note:</span> <span className="text-[#607086]">{selected.clinicalNote || 'Not added yet.'}</span></p></div> : <p className="mt-2 text-xs text-slate-400">Report pending from imaging facility.</p>}
                {selected.status === 'available' && <button type="button" onClick={() => { reviewImaging(selected.id, 'Reviewed — correlate clinically.'); }} className="mt-4 rounded-xl bg-[#1769E0] px-3.5 py-2 text-xs font-bold text-white"><CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />Mark reviewed</button>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
