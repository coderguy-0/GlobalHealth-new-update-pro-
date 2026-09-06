import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Save, FileText, FlaskConical, ScanLine, ArrowLeftRight, CalendarPlus, CheckCircle2, Circle, Stethoscope } from 'lucide-react';
import { useClinicalWorkspace, Consultation } from './doctorClinicalData';
import { WorkspaceView } from './doctorPortalData';
import { ORDER_SETS } from './clinicalDecisionSupport';

export const DoctorConsultations: React.FC<{ onNavigate?: (v: WorkspaceView) => void }> = ({ onNavigate }) => {
  const { consultations, patients, selectedPatientId, activeEncounterId, startEncounter, saveConsultation, selectPatient, addBilling } = useClinicalWorkspace();
  const [editing, setEditing] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState<Omit<Consultation, 'id'>>({
    patientId: selectedPatientId || patients[0]?.id || '',
    encounterId: activeEncounterId || '',
    date: new Date().toISOString().slice(0, 10),
    start: new Date().toTimeString().slice(0, 5),
    type: 'New Consultation',
    status: 'in_progress',
    complaint: '',
    symptoms: '',
    duration: '',
    history: '',
    exam: '',
    assessment: '',
    differentials: '',
    plan: '',
    privateNotes: '',
  });

  useEffect(() => {
    if (selectedPatientId) setForm((f) => ({ ...f, patientId: selectedPatientId, encounterId: activeEncounterId || f.encounterId }));
  }, [selectedPatientId, activeEncounterId]);

  useEffect(() => {
    if (!editing) return;
    const t = window.setTimeout(() => setSavedAt('Saved just now'), 1200);
    return () => window.clearTimeout(t);
  }, [form, editing]);

  const patient = patients.find((p) => p.id === form.patientId) || null;
  const checks = useMemo(() => [
    { ok: !!patient, label: 'Patient identity verified' },
    { ok: patient?.consentStatus === 'granted' || patient?.consentStatus === 'not_requested', label: 'Consent / access verified' },
    { ok: !!form.complaint, label: 'Chief complaint' },
    { ok: !!form.history, label: 'History of present illness' },
    { ok: !!form.exam, label: 'Objective findings' },
    { ok: !!form.assessment, label: 'Assessment / diagnosis' },
    { ok: !!form.plan, label: 'Plan' },
  ], [patient, form]);

  const begin = () => {
    const pid = form.patientId || patients[0]?.id;
    if (!pid) return;
    const enc = startEncounter(pid);
    setForm((f) => ({ ...f, patientId: pid, encounterId: enc, status: 'in_progress' }));
    setEditing(true);
    setSavedAt('Saved just now');
  };

  const save = (status: Consultation['status']) => {
    if (!patient) return;
    if (status === 'completed') { setReviewOpen(true); return; }
    saveConsultation({ ...form, status, savedAt: new Date().toISOString() });
    setSavedAt('Saved just now');
  };

  const confirmComplete = () => {
    saveConsultation({ ...form, status: 'completed', savedAt: new Date().toISOString() });
    if (patient) {
      addBilling({ patientId: patient.id, patientName: patient.name, service: `${form.type} consultation`, date: form.date, amount: form.type === 'Video' ? 650 : 800, status: 'pending' });
    }
    setReviewOpen(false);
    setEditing(false);
    setCheckout(true);
    setForm((f) => ({ ...f, complaint: '', symptoms: '', duration: '', history: '', exam: '', assessment: '', differentials: '', plan: '', privateNotes: '', status: 'in_progress' }));
  };

  const applySet = (id: string) => {
    const s = ORDER_SETS.find((x) => x.id === id);
    if (!s) return;
    setForm((f) => ({
      ...f,
      complaint: f.complaint || s.indication,
      plan: [f.plan, s.plan, s.labs.length ? `Labs: ${s.labs.join(', ')}` : '', s.imaging ? `Imaging: ${s.imaging}` : ''].filter(Boolean).join('\n'),
    }));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-[#162235]">Clinical Consultation</h2>
          <p className="text-xs text-[#607086]">SOAP documentation connected to the selected patient and encounter.</p>
        </div>
        <button type="button" onClick={begin} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700"><Plus className="h-3.5 w-3.5" /> Start Consultation</button>
      </div>

      {editing && (
        <section className="rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3E8EF] px-5 py-3.5">
            <div>
              <h3 className="text-sm font-extrabold text-[#162235]">Consultation workspace</h3>
              <p className="text-[11px] text-[#607086]">
                {patient?.name} · Encounter {form.encounterId || '—'} · {form.date} {form.start} · {form.type} · Consent {patient?.consentStatus}
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700">{savedAt}</span>
          </div>
          <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-4">
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Patient</p>
              <select value={form.patientId} onChange={(e) => { setForm((f) => ({ ...f, patientId: e.target.value })); selectPatient(e.target.value); }} className="w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs">
                {patients.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.identifier}</option>)}
              </select>
              {patient && (
                <div className="space-y-1.5 rounded-xl bg-slate-50 p-3 text-xs text-[#607086]">
                  <p className="font-bold text-[#162235]">{patient.name} · {patient.age}y · {patient.sex} · {patient.bloodGroup}</p>
                  <p className={patient.allergies.length ? 'font-bold text-rose-700' : 'text-emerald-700'}>Allergies: {patient.allergies.join(', ') || 'None'}</p>
                  <p>Conditions: {patient.conditions.join(', ') || 'None'}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <label className="block text-[10px] font-bold uppercase text-[#8A97A8]">Type
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Consultation['type'] }))} className="mt-1 w-full rounded-xl border px-2 py-2 text-xs font-semibold normal-case">
                    {['New Consultation', 'Follow-up', 'Video', 'Telephone'].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </label>
                <label className="block text-[10px] font-bold uppercase text-[#8A97A8]">Time
                  <input type="time" value={form.start} onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))} className="mt-1 w-full rounded-xl border px-2 py-2 text-xs font-semibold normal-case" />
                </label>
              </div>
            </div>

            <div className="space-y-3 lg:col-span-2">
              <Soap k="S — Subjective" hint="What the patient reports">
                <Area value={form.complaint} onChange={(v) => setForm((f) => ({ ...f, complaint: v }))} placeholder="Chief complaint" />
                <Area value={form.symptoms || ''} onChange={(v) => setForm((f) => ({ ...f, symptoms: v }))} placeholder="Symptoms" />
                <Area value={form.duration || ''} onChange={(v) => setForm((f) => ({ ...f, duration: v }))} placeholder="Duration" />
                <Area value={form.history} onChange={(v) => setForm((f) => ({ ...f, history: v }))} rows={3} placeholder="History of present illness / relevant history / concerns" />
              </Soap>
              <Soap k="O — Objective" hint="Clinical observations">
                <Area value={form.exam} onChange={(v) => setForm((f) => ({ ...f, exam: v }))} rows={3} placeholder="Vitals, physical examination, investigations, findings" />
              </Soap>
              <Soap k="A — Assessment" hint="Clinical impression">
                <Area value={form.assessment} onChange={(v) => setForm((f) => ({ ...f, assessment: v }))} placeholder="Diagnoses / clinical impressions / severity" />
                <Area value={form.differentials || ''} onChange={(v) => setForm((f) => ({ ...f, differentials: v }))} placeholder="Differential diagnoses (optional)" />
              </Soap>
              <Soap k="P — Plan" hint="Orders and follow-up">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {ORDER_SETS.map((s) => (
                    <button key={s.id} type="button" onClick={() => applySet(s.id)} className="rounded-full border border-[#E3E8EF] px-2.5 py-1 text-[10px] font-bold text-[#162235] hover:border-emerald-300 hover:bg-emerald-50">{s.label}</button>
                  ))}
                </div>
                <Area value={form.plan} onChange={(v) => setForm((f) => ({ ...f, plan: v }))} rows={3} placeholder="Medication, labs, imaging, referral, lifestyle, follow-up" />
                <textarea value={form.privateNotes} onChange={(e) => setForm((f) => ({ ...f, privateNotes: e.target.value }))} rows={2} placeholder="Private physician notes" className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2 text-xs" />
              </Soap>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Checklist</p>
              <ul className="space-y-1.5 text-xs">
                {checks.map((c) => <li key={c.label} className={`flex items-center gap-2 rounded-xl px-2.5 py-2 ${c.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-[#607086]'}`}>{c.ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />} {c.label}</li>)}
              </ul>
              <div className="space-y-2 pt-2">
                <Side onClick={() => onNavigate?.('prescriptions')} icon={<FileText className="h-3.5 w-3.5 text-emerald-700" />} label="Add Medication" />
                <Side onClick={() => onNavigate?.('labs')} icon={<FlaskConical className="h-3.5 w-3.5 text-emerald-700" />} label="Order Lab" />
                <Side onClick={() => onNavigate?.('imaging')} icon={<ScanLine className="h-3.5 w-3.5 text-emerald-700" />} label="Order Imaging" />
                <Side onClick={() => onNavigate?.('referrals')} icon={<ArrowLeftRight className="h-3.5 w-3.5 text-emerald-700" />} label="Create Referral" />
                <Side onClick={() => onNavigate?.('patients_appointments')} icon={<CalendarPlus className="h-3.5 w-3.5 text-emerald-700" />} label="Create Follow-up" />
                <Side onClick={() => onNavigate?.('ai')} icon={<Stethoscope className="h-3.5 w-3.5 text-emerald-700" />} label="Generate Clinical Summary" />
              </div>
              <button type="button" onClick={() => save('in_progress')} className="w-full rounded-xl bg-[#1769E0] px-4 py-2.5 text-xs font-bold text-white"><Save className="mr-1 inline h-3.5 w-3.5" /> Save Draft</button>
              <button type="button" onClick={() => save('completed')} className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800"><CheckCircle2 className="mr-1 inline h-3.5 w-3.5" /> Complete Encounter</button>
            </div>
          </div>
        </section>
      )}

      {reviewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-extrabold text-[#162235]">Review summary</h3>
            <p className="mt-1 text-xs text-[#607086]">Confirm before the encounter is locked and billed.</p>
            <ul className="mt-3 space-y-1 text-xs text-[#162235]">
              <li>Patient: {patient?.name} ({patient?.identifier})</li>
              <li>Encounter: {form.encounterId}</li>
              <li>Complaint: {form.complaint || '—'}</li>
              <li>Assessment: {form.assessment || '—'}</li>
              <li>Plan: {form.plan || '—'}</li>
            </ul>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setReviewOpen(false)} className="rounded-xl border px-3 py-2 text-xs font-bold">Back</button>
              <button type="button" onClick={confirmComplete} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white">Confirm — Encounter Completed</button>
            </div>
          </div>
        </div>
      )}

      <section className="overflow-x-auto rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="bg-slate-50/80"><tr className="border-b border-[#E3E8EF] text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]"><th className="px-4 py-3">Patient</th><th className="px-3 py-3">Encounter</th><th className="px-3 py-3">Date</th><th className="px-3 py-3">Type</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Assessment</th><th className="px-3 py-3 text-right">Action</th></tr></thead>
          <tbody>
            {consultations.map((c) => {
              const p = patients.find((x) => x.id === c.patientId);
              return (
                <tr key={c.id} className="border-b border-slate-50">
                  <td className="px-4 py-3 font-bold text-[#162235]">{p?.name || c.patientId}</td>
                  <td className="px-3 py-3 font-mono text-[10px]">{c.encounterId || c.id}</td>
                  <td className="px-3 py-3">{c.date} {c.start}</td>
                  <td className="px-3 py-3">{c.type}</td>
                  <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${c.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{c.status}</span></td>
                  <td className="max-w-[240px] truncate px-3 py-3 text-[#607086]">{c.assessment}</td>
                  <td className="px-3 py-3 text-right"><button type="button" onClick={() => { setForm({ ...c }); setEditing(true); selectPatient(c.patientId); }} className="rounded-lg bg-[#1769E0] px-2.5 py-1.5 text-[10px] font-bold text-white">Open</button></td>
                </tr>
              );
            })}
            {consultations.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-xs text-slate-400">No consultations yet.</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const Area: React.FC<{ value: string; onChange: (v: string) => void; placeholder: string; rows?: number }> = ({ value, onChange, placeholder, rows = 2 }) => (
  <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} className="w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none" />
);
const Soap: React.FC<{ k: string; hint: string; children: React.ReactNode }> = ({ k, hint, children }) => (
  <div className="space-y-2 rounded-xl border border-[#E3E8EF] p-3">
    <p className="text-[11px] font-extrabold text-[#162235]">{k} <span className="font-semibold text-[#8A97A8]">{hint}</span></p>
    {children}
  </div>
);
const Side: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string }> = ({ onClick, icon, label }) => (
  <button type="button" onClick={onClick} className="flex w-full items-center gap-2 rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs font-bold text-[#162235] hover:bg-slate-50">{icon} {label}</button>
);
