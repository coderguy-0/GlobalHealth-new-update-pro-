import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useDoctorPortal } from './doctorPortalData';

/* ============================================================================
   Doctor Portal — clinical workspace data, seed data and actions.
   This powers the patient-care modules (Patients, Consultations,
   Prescriptions, Labs, Imaging, Referrals, Billing). It is intentionally
   isolated from the credential/availability portal data so the two concerns
   stay separate. A real backend can replace this provider without touching UI.
   ========================================================================== */

export type PatientStatus = 'new' | 'active' | 'follow_up' | 'critical' | 'pending_review';
export type ConsentedScope = 'basic' | 'appointments' | 'history' | 'labs' | 'imaging' | 'prescriptions' | 'documents';
export type ConsentStatus = 'not_requested' | 'pending' | 'granted' | 'denied' | 'expired';
export type LabStatus = 'ordered' | 'collected' | 'available' | 'reviewed';
export type ImagingStatus = 'ordered' | 'available' | 'reviewed';
export type PrescriptionStatus = 'draft' | 'signed' | 'sent_pharmacy';
export type ReferralStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'completed';

export interface VitalsRecord {
  id: string;
  date: string;
  time: string;
  bp: string;
  hr: number;
  temp: string;
  spo2: number;
  rr: number;
  weight: number;
  note?: string;
}
export interface ClinicalNote {
  id: string;
  date: string;
  kind: string;
  title: string;
  body: string;
  private?: boolean;
  status: 'draft' | 'signed' | 'amended';
}
export interface PrescriptionMedicine {
  id: string;
  name: string;
  strength: string;
  form: string;
  dose: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
  quantity: number;
  refills: number;
}
export interface Prescription {
  id: string;
  rxId: string;
  patientId: string;
  date: string;
  status: PrescriptionStatus;
  medicines: PrescriptionMedicine[];
  review: {
    patientVerified: boolean;
    medicineSelected: boolean;
    dosageCompleted: boolean;
    durationCompleted: boolean;
    allergyChecked: boolean;
    requiredFields: boolean;
  };
}
export interface LabValue {
  name: string;
  value: string;
  unit: string;
  ref: string;
  flag: 'normal' | 'low' | 'high';
}
export interface LabOrder {
  id: string;
  patientId: string;
  category: string;
  test: string;
  indication: string;
  priority: 'routine' | 'urgent' | 'stat';
  status: LabStatus;
  orderedDate: string;
  collectedDate?: string;
  values?: LabValue[];
  clinicalNote?: string;
}
export interface ImagingStudy {
  id: string;
  patientId: string;
  modality: 'X-ray' | 'CT' | 'MRI' | 'Ultrasound' | 'Mammography' | 'ECG' | 'Other';
  title: string;
  date: string;
  facility: string;
  status: ImagingStatus;
  findings?: string;
  impression?: string;
  clinicalNote?: string;
  reviewed?: boolean;
}
export interface PatientClinical {
  id: string;
  identifier: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: string;
  phone: string;
  email: string;
  status: PatientStatus;
  conditions: string[];
  allergies: string[];
  medications: { name: string; dose: string; frequency: string; since: string }[];
  alerts: { severity: 'critical' | 'warning' | 'info'; text: string }[];
  lastVisit: string;
  nextAppointment: string;
  consentStatus: ConsentStatus;
  consentedScopes: ConsentedScope[];
  consentReason: string;
  consentHistory: { date: string; doctor: string; action: string; result: string }[];
  vitals: VitalsRecord[];
  notes: ClinicalNote[];
  prescriptions: Prescription[];
  labs: LabOrder[];
  imaging: ImagingStudy[];
}
export interface Consultation {
  id: string;
  patientId: string;
  date: string;
  start: string;
  type: 'New Consultation' | 'Follow-up' | 'Video' | 'Telephone';
  status: 'in_progress' | 'completed';
  complaint: string;
  history: string;
  exam: string;
  assessment: string;
  plan: string;
  privateNotes: string;
}
export interface BillingTransaction {
  id: string;
  patientId: string;
  patientName: string;
  service: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'refunded';
}

/* ---------------- Seed data ---------------- */

const today = () => new Date().toISOString().slice(0, 10);

const basePatient = (p: Partial<PatientClinical> & { id: string; identifier: string; name: string }): PatientClinical => ({
  age: 0,
  sex: 'Male',
  dob: '-',
  bloodGroup: 'O+',
  phone: '-',
  email: '-',
  status: 'active',
  conditions: [],
  allergies: [],
  medications: [],
  alerts: [],
  lastVisit: '-',
  nextAppointment: '-',
  consentStatus: 'not_requested',
  consentedScopes: [],
  consentReason: '',
  consentHistory: [],
  vitals: [],
  notes: [],
  prescriptions: [],
  labs: [],
  imaging: [],
  ...p,
});

export const seedPatients: PatientClinical[] = [
  basePatient({
    id: 'pat-1083', identifier: 'P-1083', name: 'John Smith', age: 45, sex: 'Male', dob: '1981-07-12',
    bloodGroup: 'O+', phone: '+91 98100 22001', email: 'john.smith@example.com', status: 'follow_up',
    conditions: ['Hypertension', 'Type 2 Diabetes'], allergies: ['Penicillin'],
    medications: [
      { name: 'Telmisartan', dose: '40 mg', frequency: 'Once daily', since: 'Jan 2025' },
      { name: 'Metformin', dose: '500 mg', frequency: 'Twice daily', since: 'Mar 2025' },
    ],
    alerts: [{ severity: 'warning', text: 'Penicillin allergy — avoid beta-lactams.' }],
    lastVisit: '02 Sep 2026', nextAppointment: '10 Sep 2026', consentStatus: 'granted',
    consentedScopes: ['basic', 'appointments', 'history', 'labs', 'imaging', 'prescriptions'],
    consentReason: 'Cardiology follow-up established under active care.',
    consentHistory: [
      { date: '02 Sep 2026', doctor: 'Dr. Priya Nair', action: 'Requested laboratory history', result: 'Approved by patient' },
      { date: '02 Sep 2026', doctor: 'Dr. Priya Nair', action: 'Viewed cardiac investigations', result: 'Approved by patient' },
    ],
    vitals: [
      { id: 'v-1', date: today(), time: '09:15', bp: '128/82', hr: 76, temp: '98.4°F', spo2: 98, rr: 16, weight: 68 },
      { id: 'v-2', date: '2026-08-20', time: '10:30', bp: '134/88', hr: 80, temp: '98.6°F', spo2: 97, rr: 17, weight: 68 },
    ],
    notes: [
      { id: 'n-1', date: today(), kind: 'Clinical Note', title: 'Routine cardiac review', body: 'Stable on current therapy. Home BP log reviewed. Continue Telmisartan 40 mg and Metformin 500 mg.', status: 'signed' },
    ],
    prescriptions: [
      {
        id: 'rx-1', rxId: 'RX-GH-29483', patientId: 'pat-1083', date: today(), status: 'signed',
        medicines: [
          { id: 'm-1', name: 'Telmisartan', strength: '40 mg', form: 'Tablet', dose: '1 tablet', frequency: 'Once daily', duration: '30 days', route: 'Oral', instructions: 'After food', quantity: 30, refills: 1 },
        ],
        review: { patientVerified: true, medicineSelected: true, dosageCompleted: true, durationCompleted: true, allergyChecked: true, requiredFields: true },
      },
    ],
    labs: [
      { id: 'lab-1', patientId: 'pat-1083', category: 'Hematology', test: 'Complete Blood Count', indication: 'Routine annual review', priority: 'routine', status: 'available', orderedDate: '01 Sep 2026', collectedDate: '01 Sep 2026',
        values: [
          { name: 'Hemoglobin', value: '13.8', unit: 'g/dL', ref: '13.5 - 17.5', flag: 'normal' },
          { name: 'WBC', value: '7.2', unit: '×10³/µL', ref: '4.0 - 11.0', flag: 'normal' },
          { name: 'Platelets', value: '245', unit: '×10³/µL', ref: '150 - 450', flag: 'normal' },
        ] },
      { id: 'lab-2', patientId: 'pat-1083', category: 'Biochemistry', test: 'HbA1c', indication: 'Diabetic monitoring', priority: 'routine', status: 'available', orderedDate: '01 Sep 2026', collectedDate: '01 Sep 2026',
        values: [{ name: 'HbA1c', value: '7.1', unit: '%', ref: '< 7.0', flag: 'high' }] },
    ],
    imaging: [
      { id: 'img-1', patientId: 'pat-1083', modality: 'ECG', title: '12-Lead ECG', date: '01 Sep 2026', facility: 'GlobalHealth Medical Center', status: 'available',
        findings: 'Normal sinus rhythm. No acute ST-T changes.', impression: 'No acute ischemic changes.', clinicalNote: 'Repeat in 6 weeks or earlier if symptoms recur.', reviewed: false },
    ],
  }),
  basePatient({
    id: 'pat-0912', identifier: 'P-0912', name: 'Aisha Khan', age: 32, sex: 'Female', dob: '1994-03-25',
    bloodGroup: 'A+', phone: '+91 98100 33201', email: 'aisha.khan@example.com', status: 'active',
    conditions: ['Atrial Fibrillation'], allergies: [],
    medications: [{ name: 'Apixaban', dose: '5 mg', frequency: 'Twice daily', since: 'May 2026' }],
    alerts: [{ severity: 'info', text: 'No known drug allergies.' }],
    lastVisit: '30 Aug 2026', nextAppointment: '05 Sep 2026', consentStatus: 'pending',
    consentReason: 'Requested access to prior electrophysiology studies.',
    consentHistory: [{ date: '30 Aug 2026', doctor: 'Dr. Priya Nair', action: 'Requested electrophysiology history', result: 'Pending patient decision' }],
    vitals: [{ id: 'v-3', date: '2026-08-30', time: '16:20', bp: '118/76', hr: 96, temp: '98.2°F', spo2: 99, rr: 15, weight: 59 }],
    notes: [],
    prescriptions: [],
    labs: [
      { id: 'lab-3', patientId: 'pat-0912', category: 'Biochemistry', test: 'INR / PT', indication: 'Anticoagulation monitoring', priority: 'urgent', status: 'available', orderedDate: '29 Aug 2026', collectedDate: '30 Aug 2026',
        values: [{ name: 'INR', value: '2.4', unit: '', ref: '2.0 - 3.0', flag: 'normal' }] },
    ],
    imaging: [],
  }),
  basePatient({
    id: 'pat-1277', identifier: 'P-1277', name: 'Rahul Verma', age: 57, sex: 'Male', dob: '1969-11-03',
    bloodGroup: 'B+', phone: '+91 98100 44300', email: 'rahul.verma@example.com', status: 'critical',
    conditions: ['Hypertension', 'Coronary Artery Disease', 'Dyslipidemia'], allergies: ['Aspirin', 'Sulfonamides'],
    medications: [{ name: 'Atorvastatin', dose: '20 mg', frequency: 'Once at night', since: '2024' }],
    alerts: [
      { severity: 'critical', text: 'Chest pain reported 20 minutes ago.' },
      { severity: 'warning', text: 'Aspirin allergy — use alternative antiplatelet.' },
    ],
    lastVisit: '28 Aug 2026', nextAppointment: '06 Sep 2026', consentStatus: 'granted',
    consentedScopes: ['basic', 'appointments', 'history', 'labs', 'imaging'],
    consentReason: 'Active cardiology care relationship.',
    consentHistory: [{ date: '28 Aug 2026', doctor: 'Dr. Priya Nair', action: 'Requested imaging history', result: 'Approved by patient' }],
    vitals: [{ id: 'v-4', date: today(), time: '17:00', bp: '142/92', hr: 88, temp: '98.8°F', spo2: 96, rr: 18, weight: 84 }],
    notes: [],
    prescriptions: [],
    labs: [
      { id: 'lab-4', patientId: 'pat-1277', category: 'Cardiac', test: 'Troponin I', indication: 'Chest pain evaluation', priority: 'stat', status: 'available', orderedDate: today(), collectedDate: today(),
        values: [{ name: 'Troponin I', value: '0.04', unit: 'ng/mL', ref: '< 0.04', flag: 'high' }] },
      { id: 'lab-5', patientId: 'pat-1277', category: 'Biochemistry', test: 'Lipid Profile', indication: 'Follow-up', priority: 'routine', status: 'reviewed', orderedDate: '28 Aug 2026', collectedDate: '28 Aug 2026',
        values: [{ name: 'LDL', value: '132', unit: 'mg/dL', ref: '< 100', flag: 'high' }] },
    ],
    imaging: [
      { id: 'img-2', patientId: 'pat-1277', modality: 'ECG', title: '12-Lead ECG', date: today(), facility: 'GlobalHealth Medical Center', status: 'available',
        findings: 'ST depression in lateral leads.', impression: 'Possible ischemia — urgent cardiology review.', clinicalNote: '', reviewed: false },
    ],
  }),
  basePatient({
    id: 'pat-0764', identifier: 'P-0764', name: 'Meera Menon', age: 39, sex: 'Female', dob: '1987-02-18',
    bloodGroup: 'AB+', phone: '+91 98100 55401', email: 'meera.menon@example.com', status: 'new',
    conditions: [], allergies: ['Latex'], medications: [],
    alerts: [{ severity: 'info', text: 'First visit — no shared clinical history yet.' }],
    lastVisit: '-', nextAppointment: today(), consentStatus: 'not_requested',
    consentHistory: [],
    vitals: [],
    notes: [],
    prescriptions: [],
    labs: [],
    imaging: [],
  }),
  basePatient({
    id: 'pat-1150', identifier: 'P-1150', name: 'Arjun Patel', age: 68, sex: 'Male', dob: '1958-06-09',
    bloodGroup: 'O-', phone: '+91 98100 66502', email: 'arjun.patel@example.com', status: 'pending_review',
    conditions: ['Heart Failure', 'Chronic Kidney Disease'], allergies: ['Codeine'],
    medications: [
      { name: 'Furosemide', dose: '40 mg', frequency: 'Once daily', since: '2025' },
    ],
    alerts: [{ severity: 'warning', text: 'Renal function requires review before potassium-sparing therapy.' }],
    lastVisit: '25 Aug 2026', nextAppointment: '12 Sep 2026', consentStatus: 'granted',
    consentedScopes: ['basic', 'appointments', 'history', 'labs', 'imaging'],
    consentReason: 'Established heart failure care pathway.',
    consentHistory: [{ date: '25 Aug 2026', doctor: 'Dr. Priya Nair', action: 'Requested renal/laboratory history', result: 'Approved by patient' }],
    vitals: [{ id: 'v-5', date: '2026-08-25', time: '10:10', bp: '112/70', hr: 72, temp: '97.9°F', spo2: 97, rr: 16, weight: 71 }],
    notes: [],
    prescriptions: [],
    labs: [],
    imaging: [],
  }),
];

export const seedConsultations: Consultation[] = [
  {
    id: 'con-1', patientId: 'pat-1083', date: today(), start: '10:30', type: 'Follow-up', status: 'completed',
    complaint: 'No new chest pain; reports mild fatigue.',
    history: 'Hypertension and type 2 diabetes well controlled in the last 2 months. Home BP average 128/80.',
    exam: 'BP 128/82, HR 76, SpO2 98%. Lungs clear. No peripheral edema.',
    assessment: 'Stable hypertension and diabetes. Findings consistent with treated disease without acute decompensation.',
    plan: 'Continue current therapy. Review HbA1c and renal panel at next visit. Repeat ECG in 6 weeks.',
    privateNotes: 'Patient very anxious about CV risk; spent time reviewing lifestyle measures.',
  },
];

export const seedBilling: BillingTransaction[] = [
  { id: 'bill-1', patientId: 'pat-1083', patientName: 'John Smith', service: 'Cardiology Consultation', date: today(), amount: 800, status: 'paid' },
  { id: 'bill-2', patientId: 'pat-0912', patientName: 'Aisha Khan', service: 'Video Consultation', date: '2026-08-30', amount: 650, status: 'pending' },
  { id: 'bill-3', patientId: 'pat-1277', patientName: 'Rahul Verma', service: 'ECG + Cardiology Review', date: today(), amount: 1200, status: 'paid' },
  { id: 'bill-4', patientId: 'pat-1150', patientName: 'Arjun Patel', service: 'Heart Failure Review', date: '2026-08-25', amount: 900, status: 'paid' },
];

/* ---------------- Clinical store ---------------- */

interface ClinicalWorkspaceState {
  patients: PatientClinical[];
  consultations: Consultation[];
  billing: BillingTransaction[];
  selectedPatientId: string | null;
  selectPatient: (id: string | null) => void;
  requestConsent: (patientId: string, reason: string, scopes: ConsentedScope[]) => void;
  respondConsent: (patientId: string, result: 'granted' | 'denied') => void;
  addVitals: (patientId: string, v: Omit<VitalsRecord, 'id'>) => void;
  addNote: (patientId: string, n: Omit<ClinicalNote, 'id' | 'date'>) => void;
  addPrescription: (patientId: string, p: Omit<Prescription, 'id' | 'patientId'>) => void;
  updatePrescriptionStatus: (id: string, status: PrescriptionStatus) => void;
  addLabOrder: (patientId: string, l: Omit<LabOrder, 'id' | 'patientId' | 'status'>) => void;
  reviewLab: (id: string, clinicalNote: string) => void;
  addImaging: (patientId: string, i: Omit<ImagingStudy, 'id' | 'patientId' | 'status' | 'reviewed'>) => void;
  reviewImaging: (id: string, clinicalNote: string) => void;
  saveConsultation: (c: Omit<Consultation, 'id'>) => void;
  addBilling: (b: Omit<BillingTransaction, 'id'>) => void;
}

const ClinicalContext = createContext<ClinicalWorkspaceState | null>(null);

export const useClinicalWorkspace = (): ClinicalWorkspaceState => {
  const ctx = useContext(ClinicalContext);
  if (!ctx) throw new Error('useClinicalWorkspace must be used within Doctor ClinicalWorkspaceProvider');
  return ctx;
};

export const ClinicalWorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { doctor, addAuditEvent } = useDoctorPortal();
  const [patients, setPatients] = useState<PatientClinical[]>(seedPatients);
  const [consultations, setConsultations] = useState<Consultation[]>(seedConsultations);
  const [billing, setBilling] = useState<BillingTransaction[]>(seedBilling);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const audit = useCallback((action: Parameters<typeof addAuditEvent>[0]['action'], resourceId: string, patientId: string | null, detail?: string, outcome: 'success' | 'denied' | 'blocked' = 'success') => {
    addAuditEvent({ actorId: doctor.id, actorRole: 'DOCTOR', action, resourceId, resourceType: 'CLINICAL', patientId, detail, outcome });
  }, [addAuditEvent, doctor.id]);

  const patchPatient = useCallback((id: string, patch: Partial<PatientClinical> | ((p: PatientClinical) => Partial<PatientClinical>)) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...(typeof patch === 'function' ? patch(p) : patch) } : p)));
  }, []);

  const selectPatient = useCallback((id: string | null) => setSelectedPatientId(id), []);

  const requestConsent = useCallback((patientId: string, reason: string, scopes: ConsentedScope[]) => {
    patchPatient(patientId, (p) => ({
      consentStatus: 'pending',
      consentReason: reason,
      consentHistory: [{ date: today(), doctor: 'Dr. Priya Nair', action: `Requested ${scopes.join(', ')}`, result: 'Pending patient decision' }, ...p.consentHistory],
    }));
    audit('CONSENT_REQUEST', patientId, patientId, reason);
  }, [patchPatient, audit]);

  const respondConsent = useCallback((patientId: string, result: 'granted' | 'denied') => {
    patchPatient(patientId, (p) => ({
      consentStatus: result,
      consentedScopes: result === 'granted' ? ['basic', 'appointments', 'history', 'labs', 'imaging', 'prescriptions', 'documents'] : [],
      consentHistory: [{ date: today(), doctor: 'Dr. Priya Nair', action: result === 'granted' ? 'Granted record access' : 'Denied record access', result: result === 'granted' ? 'Approved by patient' : 'Denied by patient' }, ...p.consentHistory],
    }));
    audit(result === 'granted' ? 'CONSENT_APPROVED' : 'CONSENT_DENIED', patientId, patientId);
  }, [patchPatient, audit]);

  const addVitals = useCallback((patientId: string, v: Omit<VitalsRecord, 'id'>) => {
    patchPatient(patientId, (p) => ({ vitals: [{ ...v, id: `v-${Date.now()}` }, ...p.vitals] }));
    audit('VITALS_RECORDED', patientId, patientId, `${v.bp} · HR ${v.hr}`);
  }, [patchPatient, audit]);

  const addNote = useCallback((patientId: string, n: Omit<ClinicalNote, 'id' | 'date'>) => {
    patchPatient(patientId, (p) => ({ notes: [{ ...n, id: `n-${Date.now()}`, date: today() }, ...p.notes] }));
    audit('CLINICAL_NOTE_CREATED', patientId, patientId, n.title);
  }, [patchPatient, audit]);

  const addPrescription = useCallback((patientId: string, p: Omit<Prescription, 'id' | 'patientId'>) => {
    patchPatient(patientId, (p2) => ({ prescriptions: [{ ...p, id: `rx-${Date.now()}`, patientId }, ...p2.prescriptions] }));
    audit('PRESCRIPTION_CREATED', p.rxId, patientId, p.status);
  }, [patchPatient, audit]);

  const updatePrescriptionStatus = useCallback((id: string, status: PrescriptionStatus) => {
    setPatients((prev) => prev.map((p) => ({ ...p, prescriptions: p.prescriptions.map((rx) => (rx.id === id ? { ...rx, status } : rx)) })));
    audit(status === 'signed' ? 'PRESCRIPTION_SIGNED' : 'PRESCRIPTION_SENT_PHARMACY', id, null);
  }, [audit]);

  const addLabOrder = useCallback((patientId: string, l: Omit<LabOrder, 'id' | 'patientId' | 'status'>) => {
    patchPatient(patientId, (p) => ({ labs: [{ ...l, id: `lab-${Date.now()}`, patientId, status: 'ordered' }, ...p.labs] }));
    audit('LAB_ORDER_CREATED', l.test, patientId, `${l.category} · ${l.priority}`);
  }, [patchPatient, audit]);

  const reviewLab = useCallback((id: string, clinicalNote: string) => {
    setPatients((prev) => prev.map((p) => ({ ...p, labs: p.labs.map((l) => (l.id === id ? { ...l, status: 'reviewed', clinicalNote } : l)) })));
    audit('LAB_REVIEWED', id, null, clinicalNote);
  }, [audit]);

  const addImaging = useCallback((patientId: string, i: Omit<ImagingStudy, 'id' | 'patientId' | 'status' | 'reviewed'>) => {
    patchPatient(patientId, (p) => ({ imaging: [{ ...i, id: `img-${Date.now()}`, patientId, status: 'ordered', reviewed: false }, ...p.imaging] }));
    audit('IMAGING_ORDER_CREATED', i.title, patientId, `${i.modality}`);
  }, [patchPatient, audit]);

  const reviewImaging = useCallback((id: string, clinicalNote: string) => {
    setPatients((prev) => prev.map((p) => ({ ...p, imaging: p.imaging.map((i) => (i.id === id ? { ...i, status: 'reviewed', reviewed: true, clinicalNote } : i)) })));
    audit('IMAGING_REVIEWED', id, null, clinicalNote);
  }, [audit]);

  const saveConsultation = useCallback((c: Omit<Consultation, 'id'>) => {
    setConsultations((prev) => [{ ...c, id: `con-${Date.now()}` }, ...prev]);
    audit(c.status === 'completed' ? 'CONSULTATION_COMPLETED' : 'CONSULTATION_CREATED', c.patientId, c.patientId, c.complaint || c.type);
  }, [audit]);

  const addBilling = useCallback((b: Omit<BillingTransaction, 'id'>) => {
    const id = `bill-${Date.now()}`;
    setBilling((prev) => [{ ...b, id }, ...prev]);
    audit('BILLING_CHANGED', id, b.patientId, `${b.service} ₹${b.amount}`);
  }, [audit]);

  const value = useMemo<ClinicalWorkspaceState>(() => ({
    patients, consultations, billing, selectedPatientId,
    selectPatient, requestConsent, respondConsent, addVitals, addNote,
    addPrescription, updatePrescriptionStatus, addLabOrder, reviewLab,
    addImaging, reviewImaging, saveConsultation, addBilling,
  }), [patients, consultations, billing, selectedPatientId, selectPatient,
    requestConsent, respondConsent, addVitals, addNote, addPrescription,
    updatePrescriptionStatus, addLabOrder, reviewLab, addImaging, reviewImaging,
    saveConsultation, addBilling]);

  return <ClinicalContext.Provider value={value}>{children}</ClinicalContext.Provider>;
};

export const PATIENT_STATUS_LABEL: Record<PatientStatus, string> = {
  new: 'New', active: 'Active', follow_up: 'Follow-up', critical: 'Critical', pending_review: 'Pending Review',
};
export const CONSENT_LABEL: Record<ConsentStatus, string> = {
  not_requested: 'Not requested', pending: 'Awaiting patient', granted: 'Consent granted', denied: 'Denied', expired: 'Expired',
};
export const LAB_STATUS_LABEL: Record<LabStatus, string> = {
  ordered: 'Ordered', collected: 'Collected', available: 'Available', reviewed: 'Reviewed',
};
export const IMAGING_STATUS_LABEL: Record<ImagingStatus, string> = {
  ordered: 'Ordered', available: 'Available', reviewed: 'Reviewed',
};
export const RX_STATUS_LABEL: Record<PrescriptionStatus, string> = {
  draft: 'Draft', signed: 'Signed', sent_pharmacy: 'Sent to Pharmacy',
};
