import React, { useMemo, useState } from 'react';
import {
  Search, Plus, UserRound, Phone, Mail, FlaskConical, FilePlus2,
  Stethoscope, ScanLine, ArrowRightLeft, CalendarPlus,
  ShieldAlert, Lock, LockOpen, Save, FileText,
  AlertTriangle, Clock3, BadgeCheck, ShieldCheck
} from 'lucide-react';
import {
  useClinicalWorkspace, PatientClinical, PATIENT_STATUS_LABEL, CONSENT_LABEL,
  VitalsRecord, LabOrder, ConsentedScope
} from './doctorClinicalData';
import { WorkspaceView, useDoctorPortal } from './doctorPortalData';

/* ============================================================================
   Doctor Patients — patient directory and full patient clinical workspace.
   The doctor can remain inside the patient context for review, consent,
   vitals, notes, prescriptions, labs, imaging and referrals.
   ========================================================================== */

type PatientTab = 'overview' | 'history' | 'vitals' | 'notes' | 'prescriptions' | 'labs' | 'imaging';

interface PatientWorkspaceProps {
  patientId: string;
  onNavigate: (v: WorkspaceView) => void;
  initialTab?: PatientTab;
}

/** Shared clinical workspace used by Patients, Consultations, etc. */
export const PatientWorkspace: React.FC<PatientWorkspaceProps> = ({ patientId, onNavigate, initialTab = 'overview' }) => {
  const { patients, requestConsent, addVitals, addNote, updatePrescriptionStatus, reviewLab, reviewImaging } = useClinicalWorkspace();
  const { doctor } = useDoctorPortal();
  const patient = patients.find((p) => p.id === patientId);
  const [tab, setTab] = useState<PatientTab>(initialTab);
  const [consentOpen, setConsentOpen] = useState(false);
  const [consentReason, setConsentReason] = useState('');
  const [consentScopes, setConsentScopes] = useState<ConsentedScope[]>([]);
  const [vitalsForm, setVitalsForm] = useState<Omit<VitalsRecord, 'id'>>({ date: new Date().toISOString().slice(0, 10), time: new Date().toTimeString().slice(0, 5), bp: '', hr: 0, temp: '', spo2: 0, rr: 0, weight: 0 });
  const [noteForm, setNoteForm] = useState({ kind: 'Clinical Note', title: '', body: '', private: false });

  if (!patient) {
    return <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Patient not found.</p>;
  }

  const currentConsent = patient.consentStatus;
  const canAccessProtected = currentConsent === 'granted';
  const toggleScope = (s: ConsentedScope) => setConsentScopes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const submitConsent = () => {
    if (!consentReason.trim() || consentScopes.length === 0) return;
    requestConsent(patient.id, consentReason.trim(), consentScopes);
    setConsentOpen(false);
    setConsentReason('');
    setConsentScopes([]);
  };

  const submitVitals = () => {
    addVitals(patient.id, {
      ...vitalsForm,
      hr: Number(vitalsForm.hr) || 0,
      spo2: Number(vitalsForm.spo2) || 0,
      rr: Number(vitalsForm.rr) || 0,
      weight: Number(vitalsForm.weight) || 0,
    });
    setVitalsForm({ date: new Date().toISOString().slice(0, 10), time: new Date().toTimeString().slice(0, 5), bp: '', hr: 0, temp: '', spo2: 0, rr: 0, weight: 0 });
  };

  const submitNote = () => {
    if (!noteForm.title.trim() || !noteForm.body.trim()) return;
    addNote(patient.id, { kind: noteForm.kind, title: noteForm.title.trim(), body: noteForm.body.trim(), private: noteForm.private, status: 'draft' as const });
    setNoteForm({ kind: 'Clinical Note', title: '', body: '', private: false });
  };

  const requestTabLabel: Record<PatientTab, string> = {
    overview: 'Overview', history: 'Medical Record', vitals: 'Vitals', notes: 'Clinical Notes',
    prescriptions: 'Prescriptions', labs: 'Labs & Diagnostics', imaging: 'Imaging',
  };

  return (
    <div className="space-y-5">
      {/* Consent gate banner */}
      {currentConsent === 'pending' && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-700" />
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">Consent request awaiting patient decision</p>
            <p className="text-xs text-amber-800/90">Sensitive sections remain locked until the patient approves this request.</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold text-amber-800 ring-1 ring-amber-200"><Clock3 className="h-3 w-3" /> Pending</span>
        </div>
      )}
      {currentConsent === 'denied' && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <ShieldAlert className="h-5 w-5 shrink-0 text-rose-700" />
          <div className="flex-1">
            <p className="text-sm font-bold text-rose-900">Patient denied this request</p>
            <p className="text-xs text-rose-800/90">Do not attempt to bypass access controls. You may request again with a clear clinical reason.</p>
          </div>
          <button type="button" onClick={() => setConsentOpen(true)} className="cursor-pointer rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700">Request consent</button>
        </div>
      )}

      {/* Patient identity + actions */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3.5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#0B1F3A] text-white">
              <UserRound className="h-6 w-6" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-tight text-[#162235]">{patient.name}</h2>
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 ring-1 ring-teal-200">Patient ID · {patient.identifier}</span>
              </div>
              <p className="mt-0.5 text-xs text-[#607086]">{patient.age} years · {patient.sex} · Blood Group {patient.bloodGroup}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-[#607086]">
                <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {patient.phone}</span>
                <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {patient.email}</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold ${patient.status === 'critical' ? 'bg-rose-50 text-rose-700' : patient.status === 'pending_review' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  <BadgeCheck className="h-3 w-3" /> {PATIENT_STATUS_LABEL[patient.status]}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => onNavigate('consultations')} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1769E0] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#145bbf]">
              <Stethoscope className="h-3.5 w-3.5" /> Start Consultation
            </button>
            <button type="button" onClick={() => setTab('prescriptions')} className="inline-flex items-center gap-1.5 rounded-xl border border-[#E3E8EF] bg-white px-3.5 py-2 text-xs font-bold text-[#162235] hover:bg-slate-50">
              <FileText className="h-3.5 w-3.5" /> Write Prescription
            </button>
            <button type="button" onClick={() => setTab('labs')} className="inline-flex items-center gap-1.5 rounded-xl border border-[#E3E8EF] bg-white px-3.5 py-2 text-xs font-bold text-[#162235] hover:bg-slate-50">
              <FlaskConical className="h-3.5 w-3.5" /> Order Lab
            </button>
            <button type="button" onClick={() => setTab('imaging')} className="inline-flex items-center gap-1.5 rounded-xl border border-[#E3E8EF] bg-white px-3.5 py-2 text-xs font-bold text-[#162235] hover:bg-slate-50">
              <ScanLine className="h-3.5 w-3.5" /> Imaging
            </button>
            <button type="button" onClick={() => setTab('notes')} className="inline-flex items-center gap-1.5 rounded-xl border border-[#E3E8EF] bg-white px-3.5 py-2 text-xs font-bold text-[#162235] hover:bg-slate-50">
              <FilePlus2 className="h-3.5 w-3.5" /> Add Note
            </button>
            <button type="button" onClick={() => onNavigate('referrals')} className="inline-flex items-center gap-1.5 rounded-xl border border-[#E3E8EF] bg-white px-3.5 py-2 text-xs font-bold text-[#162235] hover:bg-slate-50">
              <ArrowRightLeft className="h-3.5 w-3.5" /> Refer
            </button>
          </div>
        </div>

        {/* Key alerts */}
        <div className="grid grid-cols-1 gap-2 border-t border-[#E3E8EF] px-5 py-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Current conditions</p>
            <p className="mt-1 text-xs font-bold text-[#162235]">{patient.conditions.length ? patient.conditions.join(' · ') : 'No active conditions listed'}</p>
          </div>
          <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Allergies</p>
            <p className="mt-1 text-xs font-bold text-rose-800">{patient.allergies.length ? patient.allergies.join(' · ') : 'No known allergies'}</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Consent</p>
            <p className="mt-1 text-xs font-bold text-amber-900">{CONSENT_LABEL[currentConsent]}</p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-2xl border border-[#E3E8EF] bg-white p-1.5 shadow-soft">
        {(Object.keys(requestTabLabel) as PatientTab[]).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`rounded-xl px-3 py-2 text-xs font-bold transition ${tab === t ? 'bg-[#1769E0] text-white' : 'text-[#607086] hover:bg-slate-50'}`}>
            {requestTabLabel[t]}
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab patient={patient} onNavigate={onNavigate} onConsent={() => setConsentOpen(true)} />}
      {tab === 'history' && <HistoryTab patient={patient} canAccess={canAccessProtected} onConsent={() => setConsentOpen(true)} />}
      {tab === 'vitals' && <VitalsTab patient={patient} form={vitalsForm} setForm={setVitalsForm} onSave={submitVitals} />}
      {tab === 'notes' && <NotesTab patient={patient} form={noteForm} setForm={setNoteForm} onSave={submitNote} />}
      {tab === 'prescriptions' && <PrescriptionsTab patient={patient} onUpdateStatus={updatePrescriptionStatus} onNavigate={onNavigate} />}
      {tab === 'labs' && <LabsTab patient={patient} onReview={reviewLab} onNavigate={onNavigate} />}
      {tab === 'imaging' && <ImagingTab patient={patient} onReview={reviewImaging} onNavigate={onNavigate} />}

      {docUserNote(doctor.fullName)}

      {/* Consent modal */}
      {consentOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-3xl border border-[#E3E8EF] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-[#162235]">Request patient consent</h3>
                <p className="mt-1 text-xs text-[#607086]">Patient {patient.name} ({patient.identifier}) decides how this information may be accessed.</p>
              </div>
              <button type="button" onClick={() => setConsentOpen(false)} className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label="Close">✕</button>
            </div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Reason for access</label>
            <textarea value={consentReason} onChange={(e) => setConsentReason(e.target.value)} rows={3} placeholder="e.g. Review previous cardiac investigations" className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2.5 text-sm focus:border-[#1769E0] focus:outline-none focus:ring-2 focus:ring-[#1769E0]/20" />
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-500">Requested scopes</p>
            <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(['basic', 'appointments', 'history', 'labs', 'imaging', 'prescriptions'] as ConsentedScope[]).map((s) => (
                <button key={s} type="button" onClick={() => toggleScope(s)}
                  className={`rounded-xl border px-3 py-2 text-xs font-bold capitalize transition ${consentScopes.includes(s) ? 'border-[#1769E0] bg-[#1769E0]/5 text-[#1769E0]' : 'border-[#E3E8EF] text-[#607086] hover:bg-slate-50'}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setConsentOpen(false)} className="rounded-xl border border-[#E3E8EF] px-4 py-2 text-xs font-bold text-[#607086] hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={submitConsent} disabled={!consentReason.trim() || consentScopes.length === 0}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1769E0] px-4 py-2 text-xs font-bold text-white hover:bg-[#145bbf] disabled:opacity-50">
                <LockOpen className="h-3.5 w-3.5" /> Send consent request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function docUserNote(name: string) {
  return (
    <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
      <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
      Clinical access is role + consent + relationship governed. All views are recorded in the immutable audit log. Requested by {name} · GlobalHealth Doctor Workspace.
    </p>
  );
}

/* ---------------- Tabs ---------------- */

const OverviewTab: React.FC<{ patient: PatientClinical; onNavigate: (v: WorkspaceView) => void; onConsent: () => void }> = ({ patient, onNavigate, onConsent }) => (
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
    <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft lg:col-span-2">
      <h3 className="mb-3 text-sm font-extrabold text-[#162235]">Clinical summary</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Active conditions</p>
          <p className="mt-1 text-sm font-bold text-[#162235]">{patient.conditions.length ? patient.conditions.join(', ') : 'None'}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Allergies</p>
          <p className="mt-1 text-sm font-bold text-rose-700">{patient.allergies.length ? patient.allergies.join(', ') : 'None documented'}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Current medications</p>
          <ul className="mt-1 space-y-1">
            {patient.medications.map((m, i) => <li key={i} className="text-xs text-[#162235]">{m.name} {m.dose} · {m.frequency}</li>)}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Visit summary</p>
          <p className="mt-1 text-sm font-bold text-[#162235]">Last visit {patient.lastVisit}</p>
          <p className="text-xs text-[#607086]">Next appointment {patient.nextAppointment}</p>
        </div>
      </div>
      <div className="mt-4 border-t border-[#E3E8EF] pt-3">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Important alerts</p>
        {patient.alerts.length === 0 ? <p className="text-xs text-slate-400">No clinical alerts.</p> : (
          <ul className="space-y-1.5">
            {patient.alerts.map((a, i) => (
              <li key={i} className={`flex items-start gap-2 rounded-xl px-3 py-2 text-xs ${a.severity === 'critical' ? 'bg-rose-50 text-rose-800 ring-1 ring-rose-200' : a.severity === 'warning' ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-200' : 'bg-slate-50 text-slate-600'}`}>
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {a.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
    <div className="space-y-4">
      <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
        <h3 className="mb-3 text-sm font-extrabold text-[#162235]">Patient actions</h3>
        <div className="space-y-2">
          <ActionButton icon={<Stethoscope className="h-4 w-4" />} label="Start consultation" onClick={() => onNavigate('consultations')} />
          <ActionButton icon={<FileText className="h-4 w-4" />} label="Write prescription" onClick={() => onNavigate('prescriptions')} />
          <ActionButton icon={<FlaskConical className="h-4 w-4" />} label="Order laboratory test" onClick={() => onNavigate('labs')} />
          <ActionButton icon={<ScanLine className="h-4 w-4" />} label="Order imaging" onClick={() => onNavigate('imaging')} />
          <ActionButton icon={<ArrowRightLeft className="h-4 w-4" />} label="Create referral" onClick={() => onNavigate('referrals')} />
          <ActionButton icon={<CalendarPlus className="h-4 w-4" />} label="Schedule follow-up" onClick={() => onNavigate('appointments')} />
        </div>
      </section>
      <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#162235]">Consent</h3>
          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${patient.consentStatus === 'granted' ? 'bg-emerald-50 text-emerald-700' : patient.consentStatus === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{CONSENT_LABEL[patient.consentStatus]}</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[#607086]">{patient.consentStatus === 'granted' ? patient.consentReason || 'Consent established for active care.' : patient.consentReason || 'No protected record access has been established.'}</p>
        <button type="button" onClick={onConsent} className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-[#1769E0] px-3 py-2 text-xs font-bold text-[#1769E0] hover:bg-[#1769E0]/5">
          {patient.consentStatus === 'granted' ? <LockOpen className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />} {patient.consentStatus === 'granted' ? 'Manage consent' : 'Request consent'}
        </button>
      </section>
    </div>
  </div>
);

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button type="button" onClick={onClick} className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-[#E3E8EF] bg-white px-3 py-2.5 text-left text-xs font-bold text-[#162235] transition hover:border-[#1769E0]/40 hover:bg-[#1769E0]/5">
    <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-[#1769E0]">{icon}</span>
    {label}
  </button>
);

const HistoryTab: React.FC<{ patient: PatientClinical; canAccess: boolean; onConsent: () => void }> = ({ patient, canAccess, onConsent }) => {
  if (!canAccess) {
    return <ProtectedAccessBlock patient={patient} onRequest={onConsent} />;
  }
  const tabs = ['Overview', 'Medical History', 'Conditions', 'Medications', 'Allergies', 'Vitals', 'Clinical Notes', 'Prescriptions', 'Lab Reports', 'Imaging', 'Documents'];
  return (
    <section className="rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
      <div className="border-b border-[#E3E8EF] px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Electronic Health Record</p>
      </div>
      <div className="flex flex-wrap gap-1 border-b border-[#E3E8EF] px-3 py-2">
        {tabs.map((t, i) => <button key={t} type="button" className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${i === 0 ? 'bg-[#1769E0] text-white' : 'text-[#607086] hover:bg-slate-50'}`}>{t}</button>)}
      </div>
      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3">
        <EhrField label="Medical history" value="Essential hypertension (2021), Type 2 diabetes (2023). No prior cardiac event." />
        <EhrField label="Conditions" value={patient.conditions.join(', ') || 'None'} />
        <EhrField label="Medications" value={patient.medications.map((m) => `${m.name} ${m.dose} — ${m.frequency}`).join('; ') || 'None'} />
        <EhrField label="Allergies" value={patient.allergies.join(', ') || 'None'} />
        <EhrField label="Family history" value="Father — hypertension; Mother — type 2 diabetes." />
        <EhrField label="Social history" value="Non-smoker. Occasional alcohol. Sedentary lifestyle." />
      </div>
    </section>
  );
};

const ProtectedAccessBlock: React.FC<{ patient: PatientClinical; onRequest: () => void }> = ({ patient, onRequest }) => (
  <div className="rounded-2xl border border-[#1769E0]/20 bg-white p-8 text-center shadow-soft">
    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#1769E0]/5 text-[#1769E0] ring-1 ring-[#1769E0]/20"><Lock className="h-7 w-7" /></div>
    <h3 className="mt-4 text-lg font-extrabold text-[#162235]">Patient record access requires consent</h3>
    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#607086]">
      This section contains protected clinical information for {patient.name}. Request consent before viewing or acting on it.
    </p>
    <button type="button" onClick={onRequest} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1769E0] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#145bbf]">
      <LockOpen className="h-4 w-4" /> Request consent
    </button>
  </div>
);

const EhrField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-xl border border-[#E3E8EF] bg-slate-50/50 p-3">
    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">{label}</p>
    <p className="mt-1 text-xs leading-relaxed text-[#162235]">{value}</p>
  </div>
);

const VitalsTab: React.FC<{ patient: PatientClinical; form: Omit<VitalsRecord, 'id'>; setForm: React.Dispatch<React.SetStateAction<Omit<VitalsRecord, 'id'>>>; onSave: () => void }> = ({ patient, form, setForm, onSave }) => (
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
    <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
      <h3 className="mb-2 text-sm font-extrabold text-[#162235]">Add vitals</h3>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Date" type="date" value={form.date} onChange={(v) => setForm((f) => ({ ...f, date: v }))} />
        <Field label="Time" type="time" value={form.time} onChange={(v) => setForm((f) => ({ ...f, time: v }))} />
        <Field label="Blood pressure" value={form.bp} onChange={(v) => setForm((f) => ({ ...f, bp: v }))} placeholder="128/82" />
        <Field label="Heart rate (bpm)" type="number" value={String(form.hr || '')} onChange={(v) => setForm((f) => ({ ...f, hr: Number(v) }))} />
        <Field label="Temperature" value={form.temp} onChange={(v) => setForm((f) => ({ ...f, temp: v }))} placeholder="98.4°F" />
        <Field label="SpO₂ (%)" type="number" value={String(form.spo2 || '')} onChange={(v) => setForm((f) => ({ ...f, spo2: Number(v) }))} />
        <Field label="Resp. rate (min)" type="number" value={String(form.rr || '')} onChange={(v) => setForm((f) => ({ ...f, rr: Number(v) }))} />
        <Field label="Weight (kg)" type="number" value={String(form.weight || '')} onChange={(v) => setForm((f) => ({ ...f, weight: Number(v) }))} />
      </div>
      <button type="button" onClick={onSave} className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#1769E0] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#145bbf]"><Save className="h-3.5 w-3.5" /> Save vitals</button>
    </section>
    <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft lg:col-span-2">
      <h3 className="mb-3 text-sm font-extrabold text-[#162235]">Vitals history</h3>
      {patient.vitals.length === 0 ? <p className="text-xs text-slate-400">No vitals recorded yet.</p> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead><tr className="border-b border-[#E3E8EF] text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]"><th className="py-2 pr-3">Date</th><th className="pr-3">BP</th><th className="pr-3">HR</th><th className="pr-3">Temp</th><th className="pr-3">SpO₂</th><th className="pr-3">RR</th><th>Weight</th></tr></thead>
            <tbody>
              {patient.vitals.map((v) => (
                <tr key={v.id} className="border-b border-slate-50 text-[#162235]">
                  <td className="py-2 pr-3 font-bold">{v.date} {v.time}</td>
                  <td className="pr-3">{v.bp}</td><td className="pr-3">{v.hr}</td><td className="pr-3">{v.temp}</td><td className="pr-3">{v.spo2}%</td><td className="pr-3">{v.rr}/min</td><td>{v.weight} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  </div>
);

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }> = ({ label, value, onChange, type = 'text', placeholder }) => (
  <label className="block">
    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">{label}</span>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-2.5 py-2 text-xs focus:border-[#1769E0] focus:outline-none focus:ring-2 focus:ring-[#1769E0]/20" />
  </label>
);

const NotesTab: React.FC<{ patient: PatientClinical; form: { kind: string; title: string; body: string; private: boolean }; setForm: React.Dispatch<React.SetStateAction<{ kind: string; title: string; body: string; private: boolean }>>; onSave: () => void }> = ({ patient, form, setForm, onSave }) => (
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
    <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
      <h3 className="mb-2 text-sm font-extrabold text-[#162235]">Add clinical note</h3>
      <Field label="Note type" value={form.kind} onChange={(v) => setForm((f) => ({ ...f, kind: v }))} />
      <div className="mt-2.5"><Field label="Title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} placeholder="e.g. Hypertension review" /></div>
      <label className="mt-2.5 block">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Note</span>
        <textarea value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} rows={5} className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none focus:ring-2 focus:ring-[#1769E0]/20" />
      </label>
      <label className="mt-2 flex items-center gap-2 text-xs text-[#607086]"><input type="checkbox" checked={form.private} onChange={(e) => setForm((f) => ({ ...f, private: e.target.checked }))} className="h-4 w-4 rounded border-[#E3E8EF]" /> Private physician note</label>
      <button type="button" onClick={onSave} className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#1769E0] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#145bbf]"><Save className="h-3.5 w-3.5" /> Save note</button>
    </section>
    <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft lg:col-span-2">
      <h3 className="mb-3 text-sm font-extrabold text-[#162235]">Notes</h3>
      {patient.notes.length === 0 ? <p className="text-xs text-slate-400">No notes yet.</p> : (
        <ul className="space-y-2">
          {patient.notes.map((n) => (
            <li key={n.id} className="rounded-xl border border-[#E3E8EF] bg-slate-50/50 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#162235]">{n.title}</p>
                <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-[#607086] ring-1 ring-[#E3E8EF]">{n.status}</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-[#607086]">{n.body}</p>
              <p className="mt-1 text-[10px] text-[#8A97A8]">{n.kind} · {n.date}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  </div>
);

/* ---------------- Prescriptions ---------------- */

const PrescriptionsTab: React.FC<{ patient: PatientClinical; onUpdateStatus: (id: string, status: 'draft' | 'signed' | 'sent_pharmacy') => void; onNavigate: (v: WorkspaceView) => void }> = ({ patient, onUpdateStatus, onNavigate }) => (
  <section className="rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
    <div className="flex items-center justify-between border-b border-[#E3E8EF] px-5 py-3.5">
      <div>
        <h3 className="text-sm font-extrabold text-[#162235]">Prescriptions</h3>
        <p className="text-[11px] text-[#607086]">Digital prescriptions for {patient.name}.</p>
      </div>
      <button type="button" onClick={() => onNavigate('prescriptions')} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1769E0] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#145bbf]"><Plus className="h-3.5 w-3.5" /> New prescription</button>
    </div>
    {patient.prescriptions.length === 0 ? <Empty label="No prescriptions yet." /> : (
      <ul className="divide-y divide-[#E3E8EF]">
        {patient.prescriptions.map((rx) => (
          <li key={rx.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-extrabold text-[#162235]">{rx.rxId} <span className="ml-1 rounded-full bg-[#1769E0]/10 px-2 py-0.5 text-[9px] font-bold text-[#1769E0]">{rx.date}</span></p>
              <p className="mt-0.5 text-[11px] text-[#607086]">{rx.medicines.map((m) => m.name).join(', ')}</p>
              <p className="mt-1 text-[10px] text-[#8A97A8]">Safety review complete · allergy checked · patient verified</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${rx.status === 'signed' ? 'bg-emerald-50 text-emerald-700' : rx.status === 'sent_pharmacy' ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-500'}`}>{rx.status === 'sent_pharmacy' ? 'Sent to Pharmacy' : rx.status === 'signed' ? 'Signed' : 'Draft'}</span>
              {rx.status === 'draft' && <button type="button" onClick={() => onUpdateStatus(rx.id, 'signed')} className="rounded-lg bg-[#1769E0] px-2.5 py-1.5 text-[10px] font-bold text-white">Sign</button>}
              {rx.status === 'signed' && <button type="button" onClick={() => onUpdateStatus(rx.id, 'sent_pharmacy')} className="rounded-lg border border-[#E3E8EF] px-2.5 py-1.5 text-[10px] font-bold text-[#607086]">Send to pharmacy</button>}
              <button type="button" onClick={() => onNavigate('prescriptions')} className="rounded-lg border border-[#E3E8EF] px-2.5 py-1.5 text-[10px] font-bold text-[#607086]">Open</button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>
);

/* ---------------- Labs ---------------- */

const LabsTab: React.FC<{ patient: PatientClinical; onReview: (id: string, note: string) => void; onNavigate: (v: WorkspaceView) => void }> = ({ patient, onReview, onNavigate }) => (
  <section className="rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
    <div className="flex items-center justify-between border-b border-[#E3E8EF] px-5 py-3.5">
      <div>
        <h3 className="text-sm font-extrabold text-[#162235]">Lab & Diagnostics</h3>
        <p className="text-[11px] text-[#607086]">Ordered tests and available results.</p>
      </div>
      <button type="button" onClick={() => onNavigate('labs')} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1769E0] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#145bbf]"><Plus className="h-3.5 w-3.5" /> Order test</button>
    </div>
    {patient.labs.length === 0 ? <Empty label="No lab orders yet." /> : (
      <>{patient.labs.map((l) => <LabRow key={l.id} lab={l} onReview={onReview} />)}</>
    )}
  </section>
);

const LabRow: React.FC<{ lab: LabOrder; onReview: (id: string, note: string) => void }> = ({ lab, onReview }) => {
  const [note, setNote] = useState('');
  const abnormal = lab.values?.some((v) => v.flag !== 'normal');
  return (
    <div className="border-b border-[#E3E8EF] p-4 last:border-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-extrabold text-[#162235]">{lab.test} <span className={`ml-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${abnormal ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>{abnormal ? 'Action needed' : 'Normal'}</span></p>
          <p className="text-[11px] text-[#607086]">{lab.category} · {lab.priority} · {lab.orderedDate}</p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${lab.status === 'available' ? 'bg-amber-50 text-amber-700' : lab.status === 'reviewed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{lab.status}</span>
      </div>
      {lab.values && (
        <div className="overflow-x-auto">
          <table className="mt-2 w-full min-w-[480px] text-left text-xs">
            <thead><tr className="border-b border-[#E3E8EF] text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]"><th className="py-1.5 pr-3">Test</th><th className="pr-3">Value</th><th className="pr-3">Unit</th><th className="pr-3">Reference</th><th>Status</th></tr></thead>
            <tbody>{lab.values.map((v, i) => (
              <tr key={i} className="border-b border-slate-50"><td className="py-1.5 pr-3 font-bold text-[#162235]">{v.name}</td><td className="pr-3">{v.value}</td><td className="pr-3">{v.unit}</td><td className="pr-3">{v.ref}</td><td className={v.flag === 'high' ? 'font-bold text-rose-700' : v.flag === 'low' ? 'font-bold text-amber-700' : 'text-emerald-700'}>{v.flag === 'high' ? 'HIGH' : v.flag === 'low' ? 'LOW' : 'Normal'}</td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {lab.status === 'available' && (
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add clinical note…" className="flex-1 rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" />
          <button type="button" onClick={() => onReview(lab.id, note)} className="rounded-xl bg-[#1769E0] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#145bbf]">Mark reviewed</button>
        </div>
      )}
    </div>
  );
};

/* ---------------- Imaging ---------------- */

const ImagingTab: React.FC<{ patient: PatientClinical; onReview: (id: string, note: string) => void; onNavigate: (v: WorkspaceView) => void }> = ({ patient, onReview, onNavigate }) => (
  <section className="rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
    <div className="flex items-center justify-between border-b border-[#E3E8EF] px-5 py-3.5">
      <div>
        <h3 className="text-sm font-extrabold text-[#162235]">Imaging</h3>
        <p className="text-[11px] text-[#607086]">Radiology and diagnostic imaging records.</p>
      </div>
      <button type="button" onClick={() => onNavigate('imaging')} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1769E0] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#145bbf]"><Plus className="h-3.5 w-3.5" /> Order imaging</button>
    </div>
    {patient.imaging.length === 0 ? <Empty label="No imaging studies yet." /> : (
      <ul className="divide-y divide-[#E3E8EF]">
        {patient.imaging.map((img) => (
          <li key={img.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-50 text-[#1769E0]"><ScanLine className="h-4 w-4" /></span>
              <div>
                <p className="text-xs font-extrabold text-[#162235]">{img.title} <span className="ml-1 text-[10px] font-bold text-[#8A97A8]">{img.modality}</span></p>
                <p className="text-[11px] text-[#607086]">{img.facility} · {img.date}</p>
                {img.impression && <p className="mt-1 text-[11px] text-[#162235]">Impression: {img.impression}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${img.status === 'available' ? 'bg-amber-50 text-amber-700' : img.status === 'reviewed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{img.status}</span>
              {img.status === 'available' && <button type="button" onClick={() => onReview(img.id, 'Reviewed — correlate clinically.')} className="rounded-lg bg-[#1769E0] px-2.5 py-1.5 text-[10px] font-bold text-white">Mark reviewed</button>}
              <button type="button" onClick={() => onNavigate('imaging')} className="rounded-lg border border-[#E3E8EF] px-2.5 py-1.5 text-[10px] font-bold text-[#607086]">View</button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>
);

const Empty: React.FC<{ label: string }> = ({ label }) => <p className="px-5 py-8 text-center text-xs text-slate-400">{label}</p>;

/* ---------------- DoctorPatients page ---------------- */

export const DoctorPatients: React.FC<{ onNavigate: (v: WorkspaceView) => void }> = ({ onNavigate }) => {
  const { patients, selectedPatientId, selectPatient } = useClinicalWorkspace();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'critical' | 'follow_up' | 'pending_review'>('all');

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.identifier.toLowerCase().includes(q) || p.phone.includes(q);
      const matchF = filter === 'all' || p.status === filter;
      return matchQ && matchF;
    });
  }, [patients, search, filter]);

  const active = selectedPatientId ? patients.find((p) => p.id === selectedPatientId) : null;

  if (active) {
    return (
      <div className="space-y-4">
        <button type="button" onClick={() => selectPatient(null)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#E3E8EF] bg-white px-3 py-2 text-xs font-bold text-[#607086] hover:bg-slate-50">
          ← Back to patient directory
        </button>
        <PatientWorkspace patientId={active.id} onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-[#162235]">My Patients</h2>
          <p className="text-xs text-[#607086]">Patient directory — search, review and open a patient workspace.</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {(['all', 'active', 'critical', 'follow_up', 'pending_review'] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${filter === f ? 'bg-[#1769E0] text-white' : 'text-[#607086] hover:bg-slate-50'}`}>
              {f === 'pending_review' ? 'Pending Review' : f === 'follow_up' ? 'Follow-up' : f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A97A8]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient name, ID, phone…" className="w-full rounded-2xl border border-[#E3E8EF] bg-white py-2.5 pl-9 pr-3 text-sm focus:border-[#1769E0] focus:outline-none focus:ring-2 focus:ring-[#1769E0]/20" />
      </div>

      <section className="overflow-x-auto rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="bg-slate-50/80">
            <tr className="border-b border-[#E3E8EF] text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">
              <th className="px-4 py-3">Patient</th><th className="px-3 py-3">Patient ID</th><th className="px-3 py-3">Age</th><th className="px-3 py-3">Last visit</th><th className="px-3 py-3">Next appointment</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-slate-50 transition hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#0B1F3A] text-[10px] font-bold text-white">{p.name.split(' ').map((x) => x[0]).slice(0, 2).join('')}</span>
                    <div><p className="font-bold text-[#162235]">{p.name}</p><p className="text-[10px] text-[#8A97A8]">{p.allergies.length ? `⚠ ${p.allergies[0]}` : 'No allergies'}</p></div>
                  </div>
                </td>
                <td className="px-3 py-3 font-mono text-[#607086]">{p.identifier}</td>
                <td className="px-3 py-3">{p.age}</td>
                <td className="px-3 py-3">{p.lastVisit}</td>
                <td className="px-3 py-3">{p.nextAppointment}</td>
                <td className="px-3 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${p.status === 'critical' ? 'bg-rose-50 text-rose-700' : p.status === 'pending_review' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{PATIENT_STATUS_LABEL[p.status]}</span>
                </td>
                <td className="px-3 py-3 text-right">
                  <button type="button" onClick={() => selectPatient(p.id)} className="rounded-xl bg-[#1769E0] px-3 py-1.5 text-[10px] font-bold text-white hover:bg-[#145bbf]">Open record</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-xs text-slate-400">No patients match this search.</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
};
