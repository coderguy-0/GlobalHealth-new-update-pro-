import React, { useMemo, useState } from 'react';
import { Plus, Stethoscope, Save, FileText, FlaskConical, ScanLine, ArrowRightLeft, CalendarPlus, CheckCircle2, Circle } from 'lucide-react';
import { useClinicalWorkspace, Consultation } from './doctorClinicalData';

export const DoctorConsultations: React.FC<{ onNavigate?: (v: any) => void }> = ({ onNavigate }) => {
  const { consultations, patients, selectedPatientId, saveConsultation } = useClinicalWorkspace();
  const [editing, setEditing] = useState<Consultation | null>(null);
  const [form, setForm] = useState<Omit<Consultation, 'id'>>({
    patientId: selectedPatientId || patients[0]?.id || '', date: new Date().toISOString().slice(0, 10), start: new Date().toTimeString().slice(0, 5),
    type: 'New Consultation', status: 'in_progress', complaint: '', history: '', exam: '', assessment: '', plan: '', privateNotes: '',
  });

  const patient = patients.find((p) => p.id === form.patientId) || null;
  const checks = useMemo(() => [
    { ok: !!patient, label: 'Patient verified' },
    { ok: !!form.complaint && !!form.history && !!form.exam, label: 'Clinical notes completed' },
    { ok: !!form.assessment, label: 'Assessment entered' },
    { ok: !!form.plan, label: 'Treatment plan entered' },
    { ok: !!form.privateNotes, label: 'Doctor notes considered' },
  ], [patient, form]);

  const save = (status: 'in_progress' | 'completed' = 'in_progress') => {
    if (!patient) return;
    saveConsultation({ ...form, status });
    setEditing(null);
    setForm({ ...form, complaint: '', history: '', exam: '', assessment: '', plan: '', privateNotes: '', status: 'in_progress' });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="text-lg font-extrabold tracking-tight text-[#162235]">Consultations</h2><p className="text-xs text-[#607086]">Live and completed consultations with complete clinical notes.</p></div>
        <button type="button" onClick={() => setEditing({ id: '', patientId: form.patientId, date: form.date, start: form.start, type: 'New Consultation', status: 'in_progress', complaint: '', history: '', exam: '', assessment: '', plan: '', privateNotes: '' })} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1769E0] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#145bbf]"><Plus className="h-3.5 w-3.5" /> New consultation</button>
      </div>

      {editing && (
        <section className="rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
          <div className="border-b border-[#E3E8EF] px-5 py-3.5"><h3 className="text-sm font-extrabold text-[#162235]">Consultation workspace</h3></div>
          <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-4">
            {/* Patient data */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Patient data</p>
              <select value={form.patientId} onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))} className="w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none">{patients.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.identifier}</option>)}</select>
              {patient && (
                <div className="space-y-1.5 text-xs text-[#607086]">
                  <p><span className="font-bold text-[#162235]">{patient.name}</span> · {patient.age}y · {patient.sex} · {patient.bloodGroup}</p>
                  <p className="font-bold text-[#162235]">Allergies: <span className={patient.allergies.length ? 'text-rose-700' : 'text-emerald-700'}>{patient.allergies.length ? patient.allergies.join(', ') : 'None'}</span></p>
                  <p className="font-bold text-[#162235]">Conditions: {patient.conditions.join(', ') || 'None'}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Field label="Type" value={form.type} onChange={(v) => setForm((f) => ({ ...f, type: v as any }))} type="select" options={['New Consultation', 'Follow-up', 'Video', 'Telephone']} />
                <Field label="Time" value={form.start} onChange={(v) => setForm((f) => ({ ...f, start: v }))} type="time" />
              </div>
            </div>
            {/* Clinical documentation */}
            <div className="space-y-3 lg:col-span-2">
              <textarea value={form.complaint} onChange={(e) => setForm((f) => ({ ...f, complaint: e.target.value }))} rows={2} placeholder="Chief complaint" className="w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" />
              <textarea value={form.history} onChange={(e) => setForm((f) => ({ ...f, history: e.target.value }))} rows={3} placeholder="History of present illness" className="w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" />
              <textarea value={form.exam} onChange={(e) => setForm((f) => ({ ...f, exam: e.target.value }))} rows={2} placeholder="Examination / vitals summary" className="w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" />
              <textarea value={form.assessment} onChange={(e) => setForm((f) => ({ ...f, assessment: e.target.value }))} rows={2} placeholder="Assessment" className="w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" />
              <textarea value={form.plan} onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))} rows={2} placeholder="Treatment / follow-up plan" className="w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" />
              <textarea value={form.privateNotes} onChange={(e) => setForm((f) => ({ ...f, privateNotes: e.target.value }))} rows={2} placeholder="Private doctor notes" className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" />
            </div>
            {/* Actions + checklist */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Completion checklist</p>
              <ul className="space-y-1.5 text-xs">
                {checks.map((c) => <li key={c.label} className={`flex items-center gap-2 rounded-xl px-2.5 py-2 ${c.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-[#607086]'}`}>{c.ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />} {c.label}</li>)}
              </ul>
              <div className="pt-2">
                <button type="button" onClick={() => onNavigate?.('prescriptions')} className="flex w-full items-center gap-2 rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs font-bold text-[#162235] hover:bg-slate-50"><FileText className="h-3.5 w-3.5 text-[#1769E0]" /> Prescription</button>
                <button type="button" onClick={() => onNavigate?.('labs')} className="mt-2 flex w-full items-center gap-2 rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs font-bold text-[#162235] hover:bg-slate-50"><FlaskConical className="h-3.5 w-3.5 text-[#1769E0]" /> Lab order</button>
                <button type="button" onClick={() => onNavigate?.('imaging')} className="mt-2 flex w-full items-center gap-2 rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs font-bold text-[#162235] hover:bg-slate-50"><ScanLine className="h-3.5 w-3.5 text-[#1769E0]" /> Imaging</button>
                <button type="button" onClick={() => onNavigate?.('referrals')} className="mt-2 flex w-full items-center gap-2 rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs font-bold text-[#162235] hover:bg-slate-50"><ArrowRightLeft className="h-3.5 w-3.5 text-[#1769E0]" /> Referral</button>
                <button type="button" onClick={() => onNavigate?.('appointments')} className="mt-2 flex w-full items-center gap-2 rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs font-bold text-[#162235] hover:bg-slate-50"><CalendarPlus className="h-3.5 w-3.5 text-[#1769E0]" /> Follow-up</button>
              </div>
              <div className="flex flex-col gap-2 pt-3">
                <button type="button" onClick={() => save('in_progress')} className="rounded-xl bg-[#1769E0] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#145bbf]"><Save className="mr-1 inline h-3.5 w-3.5" />Save as draft</button>
                <button type="button" onClick={() => save('completed')} className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-xs font-bold text-teal-700 hover:bg-teal-100"><CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />Complete consultation</button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="overflow-x-auto rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="bg-slate-50/80"><tr className="border-b border-[#E3E8EF] text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]"><th className="px-4 py-3">Patient</th><th className="px-3 py-3">Date</th><th className="px-3 py-3">Time</th><th className="px-3 py-3">Type</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Assessment</th><th className="px-3 py-3 text-right">Action</th></tr></thead>
          <tbody>
            {consultations.map((c) => { const p = patients.find((x) => x.id === c.patientId); return (
              <tr key={c.id} className="border-b border-slate-50">
                <td className="px-4 py-3 font-bold text-[#162235]">{p?.name || c.patientId}</td>
                <td className="px-3 py-3">{c.date}</td><td className="px-3 py-3">{c.start}</td><td className="px-3 py-3">{c.type}</td>
                <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${c.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{c.status}</span></td>
                <td className="max-w-[240px] truncate px-3 py-3 text-[#607086]">{c.assessment}</td>
                <td className="px-3 py-3 text-right"><button type="button" onClick={() => setEditing((prev) => prev && prev.id === c.id ? prev : { ...c, id: c.id })} className="rounded-lg bg-[#1769E0] px-2.5 py-1.5 text-[10px] font-bold text-white">Open</button></td>
              </tr>
            ); })}
            {consultations.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-xs text-slate-400">No consultations yet.</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string; options?: string[] }> = ({ label, value, onChange, type = 'text', options }) => (
  <label className="block">
    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">{label}</span>
    {type === 'select' ? (
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-2.5 py-2 text-xs focus:border-[#1769E0] focus:outline-none">{options?.map((o) => <option key={o}>{o}</option>)}</select>
    ) : (
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-2.5 py-2 text-xs focus:border-[#1769E0] focus:outline-none" />
    )}
  </label>
);
