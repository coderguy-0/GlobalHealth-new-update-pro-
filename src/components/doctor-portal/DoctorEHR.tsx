import React, { useMemo, useState } from 'react';
import {
  Lock, LockOpen, ShieldAlert, UserRound, Phone, Mail, AlertTriangle, History,
  FilePlus2, Stethoscope, FlaskConical, ClipboardList, ArrowLeftRight, Search,
} from 'lucide-react';
import { WorkspaceView, useDoctorPortal } from './doctorPortalData';
import {
  useClinicalWorkspace, PatientClinical, CONSENT_LABEL, PATIENT_STATUS_LABEL, ConsentedScope,
} from './doctorClinicalData';

type EhrSection =
  | 'overview' | 'personal' | 'history' | 'allergies' | 'medications' | 'diagnoses'
  | 'immunization' | 'laboratory' | 'imaging' | 'vitals' | 'consultations'
  | 'prescriptions' | 'referrals' | 'documents' | 'timeline' | 'changes';

interface Props { onNavigate: (v: WorkspaceView) => void }

export const DoctorEHR: React.FC<Props> = ({ onNavigate }) => {
  const { patients, selectedPatientId, selectPatient, requestConsent, respondConsent, emergencyAccess, requestEhrChange, respondEhrChange, consultations } = useClinicalWorkspace();
  const { doctor, referrals, addAuditEvent } = useDoctorPortal();
  const [tab, setTab] = useState<EhrSection>('overview');
  const [consentOpen, setConsentOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [scopes, setScopes] = useState<ConsentedScope[]>(['history']);
  const [emReason, setEmReason] = useState('');
  const [chg, setChg] = useState({ field: '', original: '', next: '', reason: '' });
  const [picker, setPicker] = useState('');

  const patient = patients.find((p) => p.id === selectedPatientId) || null;
  const granted = patient?.consentStatus === 'granted';

  const openRecord = (p: PatientClinical) => {
    selectPatient(p.id);
    addAuditEvent({ actorId: doctor.id, actorRole: 'DOCTOR', action: 'PATIENT_RECORD_VIEW', resourceId: p.id, patientId: p.id, detail: 'Opened EHR workspace' });
    setTab('overview');
  };

  if (!patient) {
    const q = picker.trim().toLowerCase();
    const list = patients.filter((p) => !q || p.name.toLowerCase().includes(q) || p.identifier.toLowerCase().includes(q));
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-[#162235]">Patient Profile / EHR</h2>
          <p className="text-xs text-[#607086]">Central clinical workspace. Select a patient — access is relationship + consent + role governed.</p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A97A8]" />
          <input value={picker} onChange={(e) => setPicker(e.target.value)} placeholder="Search authorized patients by name or ID…" className="w-full rounded-2xl border border-[#E3E8EF] bg-white py-2.5 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
        </div>
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {list.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => openRecord(p)} className="flex w-full items-center justify-between rounded-2xl border border-[#E3E8EF] bg-white p-4 text-left shadow-soft transition hover:border-emerald-300">
                <span className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#0B1F3A] text-[11px] font-bold text-white">{p.name.split(' ').map((x) => x[0]).slice(0, 2).join('')}</span>
                  <span>
                    <span className="block text-sm font-extrabold text-[#162235]">{p.name}</span>
                    <span className="block text-[11px] text-[#607086]">{p.identifier} · {p.age}y · {CONSENT_LABEL[p.consentStatus]}</span>
                  </span>
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${p.status === 'critical' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>{PATIENT_STATUS_LABEL[p.status]}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const TABS: { id: EhrSection; label: string; locked?: boolean }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'personal', label: 'Personal' },
    { id: 'history', label: 'History', locked: true },
    { id: 'allergies', label: 'Allergies' },
    { id: 'medications', label: 'Medications', locked: true },
    { id: 'diagnoses', label: 'Diagnoses', locked: true },
    { id: 'immunization', label: 'Immunization', locked: true },
    { id: 'laboratory', label: 'Laboratory', locked: true },
    { id: 'imaging', label: 'Imaging', locked: true },
    { id: 'vitals', label: 'Vitals' },
    { id: 'consultations', label: 'Consultations', locked: true },
    { id: 'prescriptions', label: 'Prescriptions', locked: true },
    { id: 'referrals', label: 'Referrals', locked: true },
    { id: 'documents', label: 'Documents', locked: true },
    { id: 'timeline', label: 'Timeline' },
    { id: 'changes', label: 'Change requests' },
  ];

  const needsGate = (locked?: boolean) => locked && !granted;
  const patientConsults = consultations.filter((c) => c.patientId === patient.id);
  const patientRefs = referrals.filter((r) => r.patientIdentifier === patient.identifier);

  const timeline = useMemo(() => {
    const events: { date: string; kind: string; title: string; view?: WorkspaceView }[] = [];
    patientConsults.forEach((c) => events.push({ date: c.date, kind: 'Consultation', title: c.complaint || c.type, view: 'consultations' }));
    patient.labs.forEach((l) => events.push({ date: l.orderedDate, kind: 'Lab Result', title: l.test, view: 'labs' }));
    patient.prescriptions.forEach((rx) => events.push({ date: rx.date, kind: 'Prescription', title: rx.rxId, view: 'prescriptions' }));
    patientRefs.forEach((r) => events.push({ date: r.date, kind: 'Referral', title: r.specialty, view: 'referrals' }));
    patient.vitals.forEach((v) => events.push({ date: v.date, kind: 'Vitals', title: `BP ${v.bp}`, view: 'vitals' }));
    return events.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 16);
  }, [patient, patientConsults, patientRefs]);

  return (
    <div className="space-y-5">
      {patient.consentStatus === 'pending' && (
        <Banner tone="amber" title="Patient authorization is required to access this record." body="Sensitive sections remain locked until the patient approves." action="View Authorized Record" onAction={() => setTab('overview')} />
      )}
      {patient.consentStatus !== 'granted' && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E3E8EF] bg-white p-4">
          <p className="text-xs text-[#607086]">Relationship check → Consent check → Role permission check. Every access is audited.</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setConsentOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700"><LockOpen className="h-3.5 w-3.5" /> Request Consent</button>
            <button type="button" onClick={() => setEmergencyOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"><ShieldAlert className="h-3.5 w-3.5" /> Emergency access</button>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3.5">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#0B1F3A] text-white"><UserRound className="h-7 w-7" /></span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-extrabold text-[#162235]">{patient.name}</h2>
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 ring-1 ring-teal-200">{patient.identifier}</span>
                {patient.highRisk && <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">HIGH RISK</span>}
              </div>
              <p className="mt-0.5 text-xs text-[#607086]">{patient.age} years · {patient.sex} · Blood group {patient.bloodGroup}</p>
              <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] text-[#607086]">
                <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {patient.phone}</span>
                <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {patient.email}</span>
                {patient.emergencyContact && <span>Emergency: {patient.emergencyContact}</span>}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => onNavigate('consultations')} className="rounded-xl bg-[#1769E0] px-3.5 py-2 text-xs font-bold text-white"><Stethoscope className="mr-1 inline h-3.5 w-3.5" /> Start Consultation</button>
            <button type="button" onClick={() => onNavigate('prescriptions')} className="rounded-xl border border-[#E3E8EF] px-3.5 py-2 text-xs font-bold"><ClipboardList className="mr-1 inline h-3.5 w-3.5" /> Prescribe</button>
            <button type="button" onClick={() => onNavigate('labs')} className="rounded-xl border border-[#E3E8EF] px-3.5 py-2 text-xs font-bold"><FlaskConical className="mr-1 inline h-3.5 w-3.5" /> Order Lab</button>
            <button type="button" onClick={() => onNavigate('referrals')} className="rounded-xl border border-[#E3E8EF] px-3.5 py-2 text-xs font-bold"><ArrowLeftRight className="mr-1 inline h-3.5 w-3.5" /> Refer</button>
            <button type="button" onClick={() => setChangeOpen(true)} className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800"><FilePlus2 className="mr-1 inline h-3.5 w-3.5" /> Request EHR Change</button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 border-t border-[#E3E8EF] px-5 py-4 md:grid-cols-4">
          <Mini label="Allergy alert" value={patient.allergies.join(', ') || 'NKDA'} danger={patient.allergies.length > 0} />
          <Mini label="Care team" value={(patient.careTeam || [doctor.displayName]).join(' · ')} />
          <Mini label="Consent" value={CONSENT_LABEL[patient.consentStatus]} />
          <Mini label="Current encounter" value={patientConsults.find((c) => c.status !== 'completed')?.encounterId || 'None open'} />
        </div>
      </section>

      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-[#E3E8EF] bg-white p-1.5">
        {TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`shrink-0 rounded-xl px-3 py-2 text-[11px] font-bold ${tab === t.id ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'text-[#607086] hover:bg-slate-50'}`}>
            {t.locked && !granted ? <Lock className="mr-1 inline h-3 w-3" /> : null}{t.label}
          </button>
        ))}
      </div>

      {needsGate(TABS.find((t) => t.id === tab)?.locked) ? (
        <Locked onRequest={() => setConsentOpen(true)} name={patient.name} />
      ) : (
        <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
          {tab === 'overview' && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Active conditions" value={patient.conditions.join(', ') || 'None'} />
              <Field label="Allergies" value={patient.allergies.join(', ') || 'None documented'} danger />
              <Field label="Current medications" value={patient.medications.map((m) => `${m.name} ${m.dose}`).join('; ') || 'None'} />
              <Field label="Last / next visit" value={`${patient.lastVisit} · next ${patient.nextAppointment}`} />
              {patient.alerts.map((a, i) => (
                <div key={i} className={`md:col-span-2 flex items-start gap-2 rounded-xl px-3 py-2 text-xs ${a.severity === 'critical' ? 'bg-rose-50 text-rose-800' : a.severity === 'warning' ? 'bg-amber-50 text-amber-800' : 'bg-slate-50 text-slate-600'}`}>
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5" /> {a.text}
                </div>
              ))}
            </div>
          )}
          {tab === 'personal' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Full name" value={patient.name} />
              <Field label="Date of birth" value={patient.dob} />
              <Field label="Sex" value={patient.sex} />
              <Field label="Blood group" value={patient.bloodGroup} />
              <Field label="Address" value={patient.address || '—'} />
              <Field label="Emergency contact" value={`${patient.emergencyContact || '—'} ${patient.emergencyPhone || ''}`} />
            </div>
          )}
          {tab === 'history' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Medical history" value={patient.diagnoses?.map((d) => `${d.name} (${d.since})`).join('; ') || patient.conditions.join(', ') || '—'} />
              <Field label="Surgeries" value={(patient.surgeries || []).join('; ') || 'None documented'} />
              <Field label="Hospitalizations" value={(patient.hospitalizations || []).join('; ') || 'None'} />
              <Field label="Family history" value={patient.familyHistory || '—'} />
              <Field label="Social history" value={patient.socialHistory || '—'} />
            </div>
          )}
          {tab === 'allergies' && (
            <ul className="space-y-2">
              {(patient.allergyRecords || patient.allergies.map((a) => ({ id: a, substance: a, type: 'drug' as const, reaction: 'See chart', severity: 'moderate' as const, verified: true }))).map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/50 px-3 py-2 text-xs">
                  <span className="font-bold text-rose-800">{a.substance} · {a.type} · {a.reaction}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold uppercase text-rose-700">{a.severity}{a.verified ? ' · verified' : ''}</span>
                </li>
              ))}
              {patient.allergies.length === 0 && <p className="text-xs text-slate-400">No known allergies.</p>}
            </ul>
          )}
          {tab === 'medications' && (
            <table className="w-full text-left text-xs">
              <thead><tr className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]"><th className="py-2">Medication</th><th>Dose</th><th>Frequency</th><th>Since</th></tr></thead>
              <tbody>{patient.medications.map((m, i) => <tr key={i} className="border-t border-slate-100"><td className="py-2 font-bold">{m.name}</td><td>{m.dose}</td><td>{m.frequency}</td><td>{m.since}</td></tr>)}</tbody>
            </table>
          )}
          {tab === 'diagnoses' && (
            <ul className="space-y-2">
              {(patient.diagnoses || []).map((d) => (
                <li key={d.id} className="flex items-center justify-between rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs">
                  <span className="font-bold text-[#162235]">{d.name} {d.icd && <span className="font-mono text-[#8A97A8]">{d.icd}</span>}</span>
                  <span className="capitalize text-[#607086]">{d.status} · since {d.since}</span>
                </li>
              ))}
              {(patient.diagnoses || []).length === 0 && <p className="text-xs text-slate-400">No structured diagnoses.</p>}
            </ul>
          )}
          {tab === 'immunization' && (
            <ul className="space-y-2">
              {(patient.immunizations || []).map((i) => (
                <li key={i.id} className="flex items-center justify-between rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs">
                  <span className="font-bold">{i.vaccine} · dose {i.dose}</span>
                  <span className="text-[#607086]">{i.date} · {i.status}{i.nextDue ? ` · next ${i.nextDue}` : ''}</span>
                </li>
              ))}
              {(patient.immunizations || []).length === 0 && <p className="text-xs text-slate-400">No immunizations recorded.</p>}
            </ul>
          )}
          {tab === 'laboratory' && <SimpleList items={patient.labs.map((l) => `${l.test} · ${l.status} · ${l.orderedDate}`)} empty="No laboratory reports." />}
          {tab === 'imaging' && <SimpleList items={patient.imaging.map((i) => `${i.title} (${i.modality}) · ${i.status} · ${i.date}`)} empty="No imaging studies." />}
          {tab === 'vitals' && <SimpleList items={patient.vitals.map((v) => `${v.date} ${v.time} · BP ${v.bp} · HR ${v.hr} · SpO₂ ${v.spo2}% · ${v.source || 'doctor'}`)} empty="No vitals." />}
          {tab === 'consultations' && <SimpleList items={patientConsults.map((c) => `${c.date} ${c.start} · ${c.type} · ${c.status}`)} empty="No consultations." />}
          {tab === 'prescriptions' && <SimpleList items={patient.prescriptions.map((rx) => `${rx.rxId} · ${rx.status} · ${rx.medicines.map((m) => m.name).join(', ')}`)} empty="No prescriptions." />}
          {tab === 'referrals' && <SimpleList items={patientRefs.map((r) => `${r.date} · ${r.specialty} · ${r.status}`)} empty="No referrals." />}
          {tab === 'documents' && <p className="text-xs text-slate-400">Clinical documents appear here when uploaded against this encounter.</p>}
          {tab === 'timeline' && (
            <ol className="space-y-2">
              {timeline.map((e, i) => (
                <li key={i}>
                  <button type="button" onClick={() => e.view && onNavigate(e.view)} className="flex w-full items-center justify-between rounded-xl border border-[#E3E8EF] px-3 py-2 text-left text-xs hover:border-emerald-300">
                    <span className="inline-flex items-center gap-2"><History className="h-3.5 w-3.5 text-emerald-700" /><span className="font-bold text-[#162235]">{e.date} — {e.kind}</span></span>
                    <span className="text-[#607086]">{e.title}</span>
                  </button>
                </li>
              ))}
              {timeline.length === 0 && <p className="text-xs text-slate-400">No timeline events yet.</p>}
            </ol>
          )}
          {tab === 'changes' && (
            <div className="space-y-2">
              {(patient.ehrChangeRequests || []).map((r) => (
                <div key={r.id} className="rounded-xl border border-[#E3E8EF] p-3 text-xs">
                  <p className="font-bold text-[#162235]">{r.field}</p>
                  <p className="text-[#607086]">{r.originalValue} → {r.requestedValue}</p>
                  <p className="mt-1 text-[10px] text-[#8A97A8]">{r.reason} · {r.status} · {r.date}</p>
                  {r.status === 'pending' && (
                    <div className="mt-2 flex gap-2">
                      <button type="button" onClick={() => respondEhrChange(r.id, 'approved')} className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white">Simulate patient approve</button>
                      <button type="button" onClick={() => respondEhrChange(r.id, 'rejected')} className="rounded-lg border border-rose-200 px-2.5 py-1 text-[10px] font-bold text-rose-700">Simulate reject</button>
                    </div>
                  )}
                </div>
              ))}
              {(patient.ehrChangeRequests || []).length === 0 && <p className="text-xs text-slate-400">No EHR change requests. Stored records are never silently modified.</p>}
            </div>
          )}
        </section>
      )}

      {consentOpen && (
        <Modal title="Request patient consent" onClose={() => setConsentOpen(false)}>
          <p className="text-xs text-[#607086]">Patient {patient.name} decides how this information may be accessed.</p>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Clinical reason for access" className="mt-3 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-sm" />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(['basic', 'appointments', 'history', 'labs', 'imaging', 'prescriptions'] as ConsentedScope[]).map((s) => (
              <button key={s} type="button" onClick={() => setScopes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])} className={`rounded-lg px-2.5 py-1 text-[11px] font-bold capitalize ${scopes.includes(s) ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'bg-slate-50 text-[#607086]'}`}>{s}</button>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setConsentOpen(false)} className="rounded-xl border px-3 py-2 text-xs font-bold">Cancel</button>
            <button type="button" disabled={!reason.trim()} onClick={() => { requestConsent(patient.id, reason.trim(), scopes); setConsentOpen(false); setReason(''); }} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Send request</button>
          </div>
          {patient.consentStatus === 'pending' && (
            <button type="button" onClick={() => { respondConsent(patient.id, 'granted'); setConsentOpen(false); }} className="mt-2 text-[10px] font-bold text-emerald-700">Simulate patient approval (demo)</button>
          )}
        </Modal>
      )}

      {emergencyOpen && (
        <Modal title="Emergency (break-glass) access" onClose={() => setEmergencyOpen(false)}>
          <p className="text-xs text-rose-700">Requires an explicit clinical reason. Identity, timestamp, record and this event are written to the immutable audit log for organizational review.</p>
          <textarea value={emReason} onChange={(e) => setEmReason(e.target.value)} rows={3} placeholder="e.g. Acute chest pain — immediate history required" className="mt-3 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm" />
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setEmergencyOpen(false)} className="rounded-xl border px-3 py-2 text-xs font-bold">Cancel</button>
            <button type="button" disabled={!emReason.trim()} onClick={() => { emergencyAccess(patient.id, emReason.trim()); setEmergencyOpen(false); setEmReason(''); }} className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Record emergency access</button>
          </div>
        </Modal>
      )}

      {changeOpen && (
        <Modal title="Request EHR change" onClose={() => setChangeOpen(false)}>
          <p className="text-xs text-[#607086]">Previously stored records are not silently changed. The patient must approve.</p>
          <input value={chg.field} onChange={(e) => setChg((c) => ({ ...c, field: e.target.value }))} placeholder="Field" className="mt-3 w-full rounded-xl border px-3 py-2 text-sm" />
          <input value={chg.original} onChange={(e) => setChg((c) => ({ ...c, original: e.target.value }))} placeholder="Existing information" className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
          <input value={chg.next} onChange={(e) => setChg((c) => ({ ...c, next: e.target.value }))} placeholder="Requested change" className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
          <textarea value={chg.reason} onChange={(e) => setChg((c) => ({ ...c, reason: e.target.value }))} rows={2} placeholder="Reason / supporting information" className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setChangeOpen(false)} className="rounded-xl border px-3 py-2 text-xs font-bold">Cancel</button>
            <button type="button" disabled={!chg.field || !chg.next || !chg.reason} onClick={() => { requestEhrChange(patient.id, chg.field, chg.original, chg.next, chg.reason); setChangeOpen(false); setChg({ field: '', original: '', next: '', reason: '' }); setTab('changes'); }} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Submit request</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Mini: React.FC<{ label: string; value: string; danger?: boolean }> = ({ label, value, danger }) => (
  <div className={`rounded-xl border p-3 ${danger ? 'border-rose-100 bg-rose-50/60' : 'border-slate-100 bg-slate-50/70'}`}>
    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">{label}</p>
    <p className={`mt-1 text-xs font-bold ${danger ? 'text-rose-800' : 'text-[#162235]'}`}>{value}</p>
  </div>
);
const Field: React.FC<{ label: string; value: string; danger?: boolean }> = ({ label, value, danger }) => (
  <div className="rounded-xl border border-[#E3E8EF] bg-slate-50/50 p-3">
    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">{label}</p>
    <p className={`mt-1 text-xs leading-relaxed ${danger ? 'font-bold text-rose-700' : 'text-[#162235]'}`}>{value}</p>
  </div>
);
const SimpleList: React.FC<{ items: string[]; empty: string }> = ({ items, empty }) => items.length === 0 ? <p className="text-xs text-slate-400">{empty}</p> : (
  <ul className="space-y-1.5">{items.map((t, i) => <li key={i} className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-[#162235]">{t}</li>)}</ul>
);
const Locked: React.FC<{ onRequest: () => void; name: string }> = ({ onRequest, name }) => (
  <div className="rounded-2xl border border-emerald-100 bg-white p-10 text-center shadow-soft">
    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><Lock className="h-7 w-7" /></div>
    <h3 className="mt-4 text-lg font-extrabold text-[#162235]">Patient authorization is required to access this record.</h3>
    <p className="mx-auto mt-2 max-w-md text-sm text-[#607086]">Protected clinical information for {name} is hidden until consent is granted.</p>
    <button type="button" onClick={onRequest} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white"><LockOpen className="h-4 w-4" /> Request Consent</button>
  </div>
);
const Banner: React.FC<{ tone: 'amber'; title: string; body: string; action: string; onAction: () => void }> = ({ title, body, action, onAction }) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
    <ShieldAlert className="h-5 w-5 text-amber-700" />
    <div className="flex-1"><p className="text-sm font-bold text-amber-900">{title}</p><p className="text-xs text-amber-800/90">{body}</p></div>
    <button type="button" onClick={onAction} className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-amber-800 ring-1 ring-amber-200">{action}</button>
  </div>
);
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true">
    <div className="w-full max-w-lg rounded-3xl border border-[#E3E8EF] bg-white p-6 shadow-2xl">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-lg font-extrabold text-[#162235]">{title}</h3>
        <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">✕</button>
      </div>
      {children}
    </div>
  </div>
);
