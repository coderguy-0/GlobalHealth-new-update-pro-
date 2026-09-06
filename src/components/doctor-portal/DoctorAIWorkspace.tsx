import React, { useMemo, useState } from 'react';
import { Sparkles, FileText, FlaskConical, CalendarPlus, ArrowLeftRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useClinicalWorkspace } from './doctorClinicalData';
import { WorkspaceView, useDoctorPortal } from './doctorPortalData';

interface Props { onNavigate: (v: WorkspaceView) => void }

type Draft = { id: string; title: string; body: string; kind: string; status: 'draft' | 'approved' };

export const DoctorAIWorkspace: React.FC<Props> = ({ onNavigate }) => {
  const { patients, selectedPatientId } = useClinicalWorkspace();
  const { doctor } = useDoctorPortal();
  const patient = patients.find((p) => p.id === selectedPatientId) || null;
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [pending, setPending] = useState<Draft | null>(null);

  const context = useMemo(() => {
    if (!patient) return 'No patient selected. AI can only use authorized records.';
    return `${patient.name} (${patient.identifier}) · ${patient.age}y ${patient.sex} · conditions: ${patient.conditions.join(', ') || 'none'} · allergies: ${patient.allergies.join(', ') || 'NKDA'} · consent: ${patient.consentStatus}`;
  }, [patient]);

  const run = (prompt: string) => {
    const q = prompt.trim();
    if (!q) return;
    if (!patient || patient.consentStatus !== 'granted') {
      setOutput('AI cannot access this record. Patient consent and a clinical relationship are required. The assistant never bypasses authorization.');
      return;
    }
    const lower = q.toLowerCase();
    let body = '';
    let kind = 'summary';
    if (lower.includes('hba1c') || lower.includes('trend')) {
      kind = 'lab-trend';
      const hba = patient.labs.find((l) => l.test.toLowerCase().includes('hba1c'));
      body = hba
        ? `Authorized HbA1c for ${patient.name}: ${hba.values?.map((v) => `${v.value}${v.unit} (${v.flag})`).join(', ') || 'result on file'} on ${hba.orderedDate}. Correlate with home glucose and current Metformin therapy. This is an AI-generated draft.`
        : `No HbA1c result is present in the authorized record for ${patient.name}.`;
    } else if (lower.includes('referral')) {
      kind = 'referral';
      body = `Draft referral summary for ${patient.name}: known ${patient.conditions.join(', ') || 'problems'}. Reason for specialist opinion to be confirmed by the attending physician. AI-generated draft — do not send without review.`;
    } else if (lower.includes('follow')) {
      kind = 'follow-up';
      body = `Suggested follow-up for ${patient.name}: review in 4–6 weeks with repeat vitals and labs as clinically indicated. AI-generated draft.`;
    } else {
      body = `AI-generated draft clinical summary for ${patient.name}:\n\nActive problems: ${patient.conditions.join(', ') || 'none listed'}.\nAllergies: ${patient.allergies.join(', ') || 'NKDA'}.\nMedications: ${patient.medications.map((m) => `${m.name} ${m.dose}`).join('; ') || 'none'}.\n\nThe attending physician must review, edit and approve before this is filed.`;
    }
    const d: Draft = { id: `ai-${Date.now()}`, title: q.slice(0, 60), body, kind, status: 'draft' };
    setPending(d);
    setOutput(body);
    setInput('');
  };

  const approve = () => {
    if (!pending) return;
    setDrafts((prev) => [{ ...pending, status: 'approved' }, ...prev]);
    setPending(null);
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Patient context</p>
        <p className="mt-2 text-xs leading-relaxed text-[#162235]">{context}</p>
        <p className="mt-3 rounded-xl bg-amber-50 p-2.5 text-[10px] leading-relaxed text-amber-800 ring-1 ring-amber-200">
          AI is a clinical productivity assistant, not an autonomous doctor. It cannot diagnose, prescribe, modify records, send referrals, message patients or complete encounters without human authorization.
        </p>
        <div className="mt-4 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Suggested actions</p>
          <Suggest icon={<FlaskConical className="h-3.5 w-3.5" />} label="Show recent HbA1c trend" onClick={() => run('Show the patient\'s recent HbA1c trend.')} />
          <Suggest icon={<FileText className="h-3.5 w-3.5" />} label="Draft encounter summary" onClick={() => run('Draft a clinical summary')} />
          <Suggest icon={<ArrowLeftRight className="h-3.5 w-3.5" />} label="Draft referral summary" onClick={() => run('Generate a draft referral summary')} />
          <Suggest icon={<CalendarPlus className="h-3.5 w-3.5" />} label="Prepare follow-up" onClick={() => { run('Prepare a follow-up appointment.'); onNavigate('schedule'); }} />
        </div>
      </section>

      <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft xl:col-span-2">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><Sparkles className="h-4 w-4" /></span>
          <div>
            <h2 className="text-sm font-extrabold text-[#162235]">AI Clinical Assistant</h2>
            <p className="text-[10px] text-[#8A97A8]">Review → Edit → Approve → Execute · {doctor.displayName} remains responsible</p>
          </div>
        </div>
        {output && (
          <div className="mb-3 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">AI-generated draft</p>
            <textarea value={pending?.body ?? output} onChange={(e) => pending && setPending({ ...pending, body: e.target.value })} rows={8} className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs leading-relaxed" />
            {pending && (
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={approve} className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-[11px] font-bold text-white"><CheckCircle2 className="h-3.5 w-3.5" /> Approve</button>
                <button type="button" onClick={() => setPending(null)} className="rounded-xl border px-3 py-2 text-[11px] font-bold text-[#607086]">Discard</button>
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-700"><AlertTriangle className="h-3.5 w-3.5" /> Not executed until you approve</span>
              </div>
            )}
          </div>
        )}
        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') run(input); }} placeholder="Ask within the authorized patient record…" className="flex-1 rounded-xl border border-[#E3E8EF] px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none" />
          <button type="button" onClick={() => run(input)} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white">Ask</button>
        </div>
        <div className="mt-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Recent outputs</p>
          {drafts.length === 0 ? <p className="text-xs text-slate-400">No approved drafts yet.</p> : (
            <ul className="space-y-2">{drafts.map((d) => (
              <li key={d.id} className="rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs">
                <span className="font-bold text-[#162235]">{d.title}</span>
                <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-800">{d.status}</span>
              </li>
            ))}</ul>
          )}
        </div>
      </section>
    </div>
  );
};

const Suggest: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button type="button" onClick={onClick} className="flex w-full items-center gap-2 rounded-xl border border-[#E3E8EF] px-3 py-2 text-left text-xs font-bold text-[#162235] hover:bg-emerald-50">{icon} {label}</button>
);
