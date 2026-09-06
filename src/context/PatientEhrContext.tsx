import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  PatientRecord, 
  PatientVitals, 
  VitalsDataPoint, 
  LabReportItem, 
  ClinicalTimelineEvent, 
  PrescriptionItem,
  AppointmentItem,
  NotificationItem
} from '../types/medauth';

export type { AppointmentItem, NotificationItem, PatientRecord, PatientVitals, VitalsDataPoint, LabReportItem, ClinicalTimelineEvent, PrescriptionItem };
import { ClinicalPrescriptionRecord, PrescriptionStatus } from '../types/clinicalPrescription';
import { INITIAL_CLINICAL_PRESCRIPTIONS } from '../data/sampleClinicalPrescriptions';
import { samplePatients, sampleAppointments, sampleNotifications } from '../data/samplePatients';
import { UserAccount, PatientProfile } from '../types';
import { useAuth } from './AuthContext';

export type DataProvenanceSource = 
  | 'PATIENT_REPORTED' 
  | 'CLINICIAN_ENTERED' 
  | 'LABORATORY_GENERATED' 
  | 'HOSPITAL_RECORDED' 
  | 'DEVICE_CONNECTED';

export type AllergyVerificationStatus = 
  | 'PATIENT_REPORTED' 
  | 'UNDER_REVIEW' 
  | 'CLINICALLY_VERIFIED' 
  | 'REJECTED' 
  | 'RESOLVED';

export interface PatientAllergyItem {
  id: string;
  allergen: string;
  category: 'Drug' | 'Food' | 'Environmental' | 'Biological';
  reaction: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Anaphylactic';
  status: AllergyVerificationStatus;
  reportedDate: string;
  verifiedBy?: string;
  verifiedDate?: string;
  notes?: string;
}

export interface PatientSymptomItem {
  id: string;
  symptom: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  onset: string;
  duration: string;
  source: DataProvenanceSource;
  reportedBy: string;
  date: string;
  relatedEncounter?: string;
  status: 'Active' | 'Improving' | 'Resolved';
  notes?: string;
}

export interface PatientMedicationReminder {
  id: string;
  prescriptionId?: string;
  name: string;
  dosage: string;
  time: string;
  days: string[];
  notes?: string;
  takenToday: boolean;
  lastTakenTime?: string;
}

export interface AccessConsentItem {
  id: string;
  granteeName: string;
  granteeType: 'Physician' | 'Hospital' | 'Laboratory' | 'Pharmacy' | 'Insurance';
  status: 'Active' | 'Pending' | 'Revoked' | 'Expired';
  scope: ('Vitals' | 'Labs' | 'Medications' | 'Diagnoses' | 'Imaging' | 'Clinical Notes' | 'Billing')[];
  grantedDate: string;
  expiresDate?: string;
  token?: string;
}

export interface EhrAuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: 'Patient' | 'Doctor' | 'Hospital Staff' | 'Lab Technician' | 'System';
  action: string;
  details: string;
  category: 'Read' | 'Write' | 'Sign' | 'Review' | 'Share' | 'Delete';
}

export interface WellnessData {
  waterMl: number;
  waterGoalMl: number;
  weightKg: number;
  targetWeightKg: number;
  heightCm: number;
  sleepHours?: number;
  stepsCount?: number;
  dailyCalorieTarget?: number;
  activeMinutes?: number;
}

interface PatientEhrContextType {
  // Canonical Records State
  patients: PatientRecord[];
  activePatientId: string;
  activePatient: PatientRecord;
  setActivePatientId: (id: string) => void;

  // Wellness State (Personal Health Tracker Layer)
  wellness: WellnessData;
  updateWellness: (partial: Partial<WellnessData>) => void;
  logWater: (amountMl: number) => void;
  resetWaterDaily: () => void;

  // Vitals & Telemetry
  vitalsHistory: VitalsDataPoint[];
  addVitalReading: (reading: {
    sys: number;
    dia: number;
    pulse: number;
    spo2?: number;
    temp?: number;
    notes?: string;
    source?: DataProvenanceSource;
    recordedBy?: string;
  }) => void;

  // Medication Reminders (Patient Personal Schedule)
  medicationReminders: PatientMedicationReminder[];
  addMedicationReminder: (reminder: Omit<PatientMedicationReminder, 'id' | 'takenToday'>) => void;
  toggleMedicationTaken: (id: string) => void;
  deleteMedicationReminder: (id: string) => void;

  // Clinical Allergies (Two-Way Patient Reported <-> Doctor Verified)
  allergiesList: PatientAllergyItem[];
  reportAllergy: (allergy: Omit<PatientAllergyItem, 'id' | 'status' | 'reportedDate'>) => void;
  verifyAllergy: (id: string, status: AllergyVerificationStatus, clinicianName: string) => void;

  // Clinical Symptoms (Patient Reported <-> Doctor Reviewed)
  symptomsList: PatientSymptomItem[];
  reportSymptom: (symptom: Omit<PatientSymptomItem, 'id' | 'date' | 'source' | 'reportedBy'>) => void;
  updateSymptomStatus: (id: string, status: 'Active' | 'Improving' | 'Resolved') => void;

  // Doctor & Hospital Clinical Operations
  addClinicalDiagnosis: (diagnosis: {
    icd10: string;
    description: string;
    type: 'Primary' | 'Secondary' | 'Chronic';
    diagnosedDate: string;
    status: 'Active' | 'Resolved' | 'Under Investigation';
  }) => void;
  signPrescription: (prescription: {
    name: string;
    dosage: string;
    frequency: string;
    route: string;
    prescribedBy: string;
    duration?: string;
    notes?: string;
  }) => void;
  reviewLabReport: (reportId: string, doctorName: string, notes?: string) => void;
  addLabReport: (report: LabReportItem) => void;
  addTimelineSoapEvent: (event: ClinicalTimelineEvent) => void;

  // Clinical Prescriptions (Multi-Page Documents, Scans, Camera Clicks, Google Drive)
  clinicalPrescriptions: ClinicalPrescriptionRecord[];
  savePrescriptionDocument: (prescription: Omit<ClinicalPrescriptionRecord, 'id' | 'createdAt'>) => void;
  updatePrescriptionStatus: (id: string, status: PrescriptionStatus) => void;
  deletePrescriptionDocument: (id: string) => void;

  // Appointments (Shared across Patient, Doctor, Hospital)
  appointments: AppointmentItem[];
  bookAppointment: (appointment: Omit<AppointmentItem, 'id' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentItem['status']) => void;

  // Consent & Sharing
  consents: AccessConsentItem[];
  grantConsent: (consent: Omit<AccessConsentItem, 'id' | 'status' | 'grantedDate' | 'token'>, token?: string) => void;
  revokeConsent: (id: string) => void;

  // Audit Logs & Notifications
  auditLogs: EhrAuditLogItem[];
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Patient Record Updates
  updatePatientRecord: (patient: PatientRecord) => void;

  // User Profile Demographics Sync
  updatePatientDemographics: (profile: PatientProfile) => void;
}

const PatientEhrContext = createContext<PatientEhrContextType | undefined>(undefined);

// Storage keys are NAMESPACED per authenticated user so one account's EHR can
// never be read by another. 'guest' scope keeps any pre-login data separate and
// non-private. Identity is derived from the secure auth session, never from a
// client-supplied id. (v3: fresh signed-in scopes now seed a personal, EMPTY
// record instead of the synthetic demo patient's clinical data.)
const buildStorageKeys = (scope: string) => ({
  PATIENTS: `globalhealth_${scope}_canonical_patients_v3`,
  ACTIVE_PATIENT: `globalhealth_${scope}_active_patient_id_v3`,
  WELLNESS: `globalhealth_${scope}_wellness_data_v3`,
  MED_REMINDERS: `globalhealth_${scope}_med_reminders_v3`,
  ALLERGIES: `globalhealth_${scope}_allergies_v3`,
  SYMPTOMS: `globalhealth_${scope}_symptoms_v3`,
  APPOINTMENTS: `globalhealth_${scope}_appointments_v3`,
  CONSENTS: `globalhealth_${scope}_consents_v3`,
  AUDIT_LOGS: `globalhealth_${scope}_audit_logs_v3`,
  NOTIFICATIONS: `globalhealth_${scope}_ehr_notifications_v3`,
  CLINICAL_PRESCRIPTIONS: `globalhealth_${scope}_clinical_prescriptions_v4`
});

// Deterministic MRN derived from the immutable account id: stable across
// sessions, unique per person, and never shared with another account.
const deriveStableMrn = (seed: string): string => {
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) + hash + seed.charCodeAt(i)) >>> 0;
  return `MRN-${String(hash % 1000000).padStart(6, '0')}`;
};

const ageFromDob = (dob?: string): number => {
  if (!dob) return 0;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return 0;
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000)));
};

// A signed-in account's EHR is seeded from THEIR OWN profile with EMPTY
// clinical content. No labs, medications, allergies, appointments or vitals
// belonging to any other (or demo) person are ever copied into it — the record
// only fills up with data the account owner (or their authorized care team)
// adds.
const createPersonalPatientRecord = (user: UserAccount): PatientRecord => ({
  id: `PT-${user.id}`,
  name: user.fullName || 'My Health Record',
  age: user.age || ageFromDob(user.dateOfBirth),
  gender: user.gender === 'Male' || user.gender === 'Female' ? user.gender : 'Other',
  mrn: user.mrn || deriveStableMrn(user.id),
  bloodGroup: user.bloodGroup || 'Not set',
  dob: user.dateOfBirth,
  phone: user.phoneNumber,
  status: 'New Patient',
  criticalAlerts: [],
  primaryCondition: 'No conditions recorded yet',
  allergies: [],
  chronicConditions: [],
  currentMedications: [],
  recentVitals: {
    bp: '—/— mmHg',
    hr: 0,
    spo2: 0,
    temp: 0,
    weightKg: 0,
    heightCm: 0,
    bmi: 0,
    respiratoryRate: 0
  },
  vitalsHistory: [],
  labReports: [],
  clinicalTimeline: [],
  medicalHistory: [],
  symptoms: [],
  diagnoses: []
});

const createInitialAuditForAccount = (displayName: string): EhrAuditLogItem[] => [
  {
    id: 'aud-account-init',
    timestamp: new Date().toISOString(),
    actorName: displayName,
    actorRole: 'Patient',
    action: 'Personal Health Record Created',
    details: 'A private, empty EHR was initialized for this account. It only ever stores data added by this account or its authorized care team.',
    category: 'Write'
  }
];

// Initial Allergies mapped to 2-way clinical schema
const INITIAL_ALLERGIES: PatientAllergyItem[] = [
  {
    id: 'alg-1',
    allergen: 'Penicillin (Amoxicillin / Ampicillin)',
    category: 'Drug',
    reaction: 'Anaphylaxis, severe urticaria, bronchospasm',
    severity: 'Anaphylactic',
    status: 'CLINICALLY_VERIFIED',
    reportedDate: '2022-04-12',
    verifiedBy: 'Dr. Alexandra Chen, MD',
    verifiedDate: '2022-04-12',
    notes: 'Absolute contraindication for beta-lactam antibiotics.'
  },
  {
    id: 'alg-2',
    allergen: 'Sulfa Drugs (Sulfamethoxazole)',
    category: 'Drug',
    reaction: 'Maculopapular rash, pruritus',
    severity: 'Moderate',
    status: 'CLINICALLY_VERIFIED',
    reportedDate: '2024-01-18',
    verifiedBy: 'Dr. Marcus Vance, MD',
    verifiedDate: '2024-01-19',
    notes: 'Prescribe nitrofurantoin or fluoroquinolones instead.'
  },
  {
    id: 'alg-3',
    allergen: 'Dust Mites & Pollen',
    category: 'Environmental',
    reaction: 'Allergic rhinitis, sneezing, conjunctival injection',
    severity: 'Mild',
    status: 'PATIENT_REPORTED',
    reportedDate: '2026-05-10',
    notes: 'Self-managed with OTC antihistamines during spring.'
  }
];

// Initial Symptoms
const INITIAL_SYMPTOMS: PatientSymptomItem[] = [
  {
    id: 'sym-1',
    symptom: 'Intermittent Morning Occipital Tension',
    severity: 'Mild',
    onset: '2026-08-10',
    duration: '30-45 minutes',
    source: 'PATIENT_REPORTED',
    reportedBy: 'Rahul Kumar (Self-Report)',
    date: '2026-08-12',
    status: 'Improving',
    notes: 'Usually resolves after hydration and morning walk.'
  },
  {
    id: 'sym-2',
    symptom: 'Occasional Exertional Palpitations',
    severity: 'Moderate',
    onset: '2026-08-01',
    duration: '2-5 minutes',
    source: 'PATIENT_REPORTED',
    reportedBy: 'Rahul Kumar (Self-Report)',
    date: '2026-08-05',
    relatedEncounter: 'Cardiology Follow-up',
    status: 'Active',
    notes: 'Correlated with mild sinus tachycardia on 2026-08-07 visit.'
  }
];

// Initial Consents
const INITIAL_CONSENTS: AccessConsentItem[] = [
  {
    id: 'cst-1',
    granteeName: 'Dr. Alexandra Chen, MD',
    granteeType: 'Physician',
    status: 'Active',
    scope: ['Vitals', 'Labs', 'Medications', 'Diagnoses', 'Imaging', 'Clinical Notes'],
    grantedDate: '2026-01-10',
    token: 'GH-CONSENT-CHEN-9921'
  },
  {
    id: 'cst-2',
    granteeName: 'Global Diagnostics Pathology Core',
    granteeType: 'Laboratory',
    status: 'Active',
    scope: ['Labs', 'Vitals'],
    grantedDate: '2026-02-14',
    token: 'GH-CONSENT-LAB-4401'
  },
  {
    id: 'cst-3',
    granteeName: 'City Memorial Healthcare Network',
    granteeType: 'Hospital',
    status: 'Active',
    scope: ['Vitals', 'Labs', 'Medications', 'Diagnoses', 'Imaging', 'Clinical Notes', 'Billing'],
    grantedDate: '2026-03-01',
    token: 'GH-CONSENT-HOSP-1102'
  }
];

// Initial Audit Trail
const INITIAL_AUDIT_LOGS: EhrAuditLogItem[] = [
  {
    id: 'aud-1',
    timestamp: '2026-08-23T10:42:00Z',
    actorName: 'Dr. Alexandra Chen, MD',
    actorRole: 'Doctor',
    action: 'Reviewed Diagnostic Laboratory Panel',
    details: 'CBC Panel reviewed, physician clinical interpretation signed.',
    category: 'Review'
  },
  {
    id: 'aud-2',
    timestamp: '2026-08-23T08:45:00Z',
    actorName: 'Global Diagnostics Pathology Core',
    actorRole: 'Lab Technician',
    action: 'Uploaded Specimen Result (CBC)',
    details: 'CLIA Verified result loaded to canonical EHR repository.',
    category: 'Write'
  },
  {
    id: 'aud-3',
    timestamp: '2026-08-22T14:15:00Z',
    actorName: 'Rahul Kumar',
    actorRole: 'Patient',
    action: 'Logged Daily Vitals Telemetry',
    details: 'Manual BP check 120/80 mmHg, Pulse 72 BPM recorded.',
    category: 'Write'
  },
  {
    id: 'aud-4',
    timestamp: '2026-08-20T09:00:00Z',
    actorName: 'Dr. Marcus Vance, MD',
    actorRole: 'Doctor',
    action: 'Prescribed Lisinopril 10mg PO Daily',
    details: 'Digital e-Prescription signed and transmitted to Surescripts gateway.',
    category: 'Sign'
  }
];

export const PatientEhrProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Private EHR data is scoped to the authenticated account. The provider is
  // remounted per identity (see main.tsx key), and storage keys are namespaced
  // to the same scope — guaranteeing strict per-user isolation with no stale
  // data leaking across login/logout/account switches.
  const { user } = useAuth();
  const STORAGE_KEYS = React.useMemo(
    () => buildStorageKeys(user ? `user_${user.id}` : 'guest'),
    [user?.id]
  );

  // The account owner's own (empty) canonical record. Only used to seed a
  // FRESH signed-in scope — never to read across accounts.
  const personalPatient = React.useMemo(
    () => (user ? createPersonalPatientRecord(user) : null),
    [user?.id]
  );

  // 1. Canonical Patients Array
  const [patients, setPatients] = useState<PatientRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      if (stored) return JSON.parse(stored);
    } catch {}
    // Fresh signed-in accounts start with their OWN empty record — never the
    // demo patient's data. The synthetic cohort is only used pre-login (guest
    // scope, public doctor-portal showcase).
    return personalPatient ? [personalPatient] : samplePatients;
  });

  // 2. Active Patient ID (signed-in: the account owner's own record)
  const [activePatientId, setActivePatientId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_PATIENT);
      if (stored) return stored;
    } catch {}
    return personalPatient ? personalPatient.id : 'PT-2026-901';
  });

  // 3. Active Patient Object
  const activePatient = useMemo(() => {
    return (
      patients.find((p) => p.id === activePatientId) ||
      personalPatient ||
      patients[0] ||
      samplePatients[0]
    );
  }, [patients, activePatientId, personalPatient]);

  // 4. Wellness Data (Self-Tracking Layer) — starts blank for a real account
  // (the owner fills in their own numbers); demo defaults only for guests.
  const [wellness, setWellness] = useState<WellnessData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WELLNESS);
      if (stored) return JSON.parse(stored);
    } catch {}
    if (personalPatient) {
      return {
        waterMl: 0,
        waterGoalMl: 2500,
        weightKg: 0,
        targetWeightKg: 0,
        heightCm: 0,
        sleepHours: 0,
        stepsCount: 0,
        dailyCalorieTarget: 0,
        activeMinutes: 0
      };
    }
    return {
      waterMl: 1250,
      waterGoalMl: 2500,
      weightKg: 72.0,
      targetWeightKg: 70.0,
      heightCm: 175,
      sleepHours: 7.5,
      stepsCount: 8420,
      dailyCalorieTarget: 2100,
      activeMinutes: 45
    };
  });

  // Helper to deduplicate array by id and ensure non-empty unique ids
  const sanitizeListWithUniqueIds = <T extends { id: string }>(items: any[], prefix: string): T[] => {
    if (!Array.isArray(items)) return [];
    const seen = new Set<string>();
    const sanitized: T[] = [];
    items.forEach((item, index) => {
      if (!item || typeof item !== 'object') return;
      let itemId = typeof item.id === 'string' && item.id.trim().length > 0 ? item.id : `${prefix}-${Date.now()}-${index}`;
      if (seen.has(itemId)) {
        itemId = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${index}`;
      }
      seen.add(itemId);
      sanitized.push({ ...item, id: itemId });
    });
    return sanitized;
  };

  // 5. Medication Reminders (Patient personal schedule derived from prescriptions + user reminders)
  const [medicationReminders, setMedicationReminders] = useState<PatientMedicationReminder[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MED_REMINDERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return sanitizeListWithUniqueIds<PatientMedicationReminder>(parsed, 'rem');
        }
      }
    } catch {}
    return personalPatient ? [] : [
      { id: 'rem-1', name: 'Lisinopril 10mg', dosage: '10mg', time: '08:00 AM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], notes: 'Take with breakfast for blood pressure', takenToday: true, lastTakenTime: '08:15 AM' },
      { id: 'rem-2', name: 'Metoprolol Succinate 25mg', dosage: '25mg', time: '09:00 AM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], notes: 'Cardiovascular beta-blocker', takenToday: true, lastTakenTime: '09:05 AM' },
      { id: 'rem-3', name: 'Omega-3 Acid 1000mg', dosage: '1000mg', time: '08:30 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], notes: 'Lipid support after dinner', takenToday: false }
    ];
  });

  // 6. Allergies (Two-Way)
  const [allergiesList, setAllergiesList] = useState<PatientAllergyItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ALLERGIES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return sanitizeListWithUniqueIds<PatientAllergyItem>(parsed, 'alg');
      }
    } catch {}
    return personalPatient ? [] : INITIAL_ALLERGIES;
  });

  // 7. Symptoms
  const [symptomsList, setSymptomsList] = useState<PatientSymptomItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SYMPTOMS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return sanitizeListWithUniqueIds<PatientSymptomItem>(parsed, 'sym');
      }
    } catch {}
    return personalPatient ? [] : INITIAL_SYMPTOMS;
  });

  // 8. Appointments
  const [appointments, setAppointments] = useState<AppointmentItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return sanitizeListWithUniqueIds<AppointmentItem>(parsed, 'apt');
      }
    } catch {}
    return personalPatient ? [] : sampleAppointments;
  });

  // 9. Consents & Sharing
  const [consents, setConsents] = useState<AccessConsentItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONSENTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return sanitizeListWithUniqueIds<AccessConsentItem>(parsed, 'cst');
      }
    } catch {}
    return personalPatient ? [] : INITIAL_CONSENTS;
  });

  // 10. Audit Logs
  const [auditLogs, setAuditLogs] = useState<EhrAuditLogItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return sanitizeListWithUniqueIds<EhrAuditLogItem>(parsed, 'aud');
      }
    } catch {}
    return personalPatient ? createInitialAuditForAccount(personalPatient.name) : INITIAL_AUDIT_LOGS;
  });

  // 11. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return sanitizeListWithUniqueIds<NotificationItem>(parsed, 'notif');
      }
    } catch {}
    return personalPatient ? [] : sampleNotifications;
  });

  // 12. Clinical Prescriptions (Multi-page Vault & Scanner)
  const [clinicalPrescriptions, setClinicalPrescriptions] = useState<ClinicalPrescriptionRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CLINICAL_PRESCRIPTIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return sanitizeListWithUniqueIds<ClinicalPrescriptionRecord>(parsed, 'rx-vault');
      }
    } catch {}
    return personalPatient ? [] : INITIAL_CLINICAL_PRESCRIPTIONS;
  });

  // Sync state changes to localStorage
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients)); } catch {}
  }, [patients]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.ACTIVE_PATIENT, activePatientId); } catch {}
  }, [activePatientId]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.WELLNESS, JSON.stringify(wellness)); } catch {}
  }, [wellness]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.MED_REMINDERS, JSON.stringify(medicationReminders)); } catch {}
  }, [medicationReminders]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.ALLERGIES, JSON.stringify(allergiesList)); } catch {}
  }, [allergiesList]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SYMPTOMS, JSON.stringify(symptomsList)); } catch {}
  }, [symptomsList]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments)); } catch {}
  }, [appointments]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.CONSENTS, JSON.stringify(consents)); } catch {}
  }, [consents]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs)); } catch {}
  }, [auditLogs]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)); } catch {}
  }, [notifications]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.CLINICAL_PRESCRIPTIONS, JSON.stringify(clinicalPrescriptions)); } catch {}
  }, [clinicalPrescriptions]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)); } catch {}
  }, [notifications]);

  // Append Audit Log Helper
  const addAuditLog = (
    actorName: string, 
    actorRole: EhrAuditLogItem['actorRole'], 
    action: string, 
    details: string, 
    category: EhrAuditLogItem['category'] = 'Write'
  ) => {
    const entry: EhrAuditLogItem = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      actorName,
      actorRole,
      action,
      details,
      category
    };
    setAuditLogs((prev) => [entry, ...prev.slice(0, 100)]);
  };

  // Push Notification Helper
  const pushNotification = (
    title: string, 
    message: string, 
    type: NotificationItem['type'] = 'LAB_RESULT', 
    urgent: boolean = false
  ) => {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      description: message,
      message,
      timeAgo: 'Just now',
      read: false,
      unread: true,
      type,
      actionRequired: urgent
    };
    setNotifications((prev) => [notif, ...prev.filter(n => n.id !== notif.id)]);
  };

  // 1. Wellness Tracking Methods
  const updateWellness = (partial: Partial<WellnessData>) => {
    setWellness((prev) => ({ ...prev, ...partial }));
    addAuditLog(activePatient.name, 'Patient', 'Updated Wellness Metrics', `Logged personal wellness goals & parameters.`, 'Write');
  };

  const logWater = (amountMl: number) => {
    setWellness((prev) => {
      const nextMl = Math.max(0, prev.waterMl + amountMl);
      return { ...prev, waterMl: nextMl };
    });
  };

  const resetWaterDaily = () => {
    setWellness((prev) => ({ ...prev, waterMl: 0 }));
  };

  // 2. Vitals Methods
  const addVitalReading = (reading: {
    sys: number;
    dia: number;
    pulse: number;
    spo2?: number;
    temp?: number;
    notes?: string;
    source?: DataProvenanceSource;
    recordedBy?: string;
  }) => {
    const today = new Date().toISOString().split('T')[0];
    const newPoint: VitalsDataPoint = {
      date: today,
      systolic: reading.sys,
      diastolic: reading.dia,
      heartRate: reading.pulse,
      glucose: 105,
      spo2: reading.spo2 || 99
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          const updatedHistory = [...(p.vitalsHistory || []), newPoint];
          const updatedVitals: PatientVitals = {
            ...p.recentVitals,
            bp: `${reading.sys}/${reading.dia} mmHg`,
            hr: reading.pulse,
            spo2: reading.spo2 || p.recentVitals.spo2 || 99,
            temp: reading.temp || p.recentVitals.temp || 98.6,
            weightKg: wellness.weightKg || p.recentVitals.weightKg,
            heightCm: wellness.heightCm || p.recentVitals.heightCm,
            bmi: +(wellness.weightKg / Math.pow((wellness.heightCm || 175) / 100, 2)).toFixed(1)
          };
          return {
            ...p,
            recentVitals: updatedVitals,
            vitalsHistory: updatedHistory
          };
        }
        return p;
      })
    );

    const actor = reading.recordedBy || activePatient.name;
    const role = reading.source === 'CLINICIAN_ENTERED' ? 'Doctor' : 'Patient';
    addAuditLog(actor, role, 'Recorded Vitals Telemetry', `BP: ${reading.sys}/${reading.dia} mmHg, Pulse: ${reading.pulse} BPM (${reading.source || 'PATIENT_REPORTED'})`, 'Write');

    pushNotification(
      'Vitals Reading Synced',
      `Blood pressure (${reading.sys}/${reading.dia} mmHg) and Pulse (${reading.pulse} BPM) updated to EHR record.`,
      'PATIENT_UPDATE'
    );
  };

  // 3. Medication Reminders
  const addMedicationReminder = (reminder: Omit<PatientMedicationReminder, 'id' | 'takenToday'>) => {
    const item: PatientMedicationReminder = {
      ...reminder,
      id: `rem-${Date.now()}`,
      takenToday: false
    };
    setMedicationReminders((prev) => [...prev, item]);
    addAuditLog(activePatient.name, 'Patient', 'Created Medication Reminder', `Scheduled reminder for ${reminder.name} at ${reminder.time}.`, 'Write');
  };

  const toggleMedicationTaken = (id: string) => {
    setMedicationReminders((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextTaken = !m.takenToday;
          const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          if (nextTaken) {
            addAuditLog(activePatient.name, 'Patient', 'Confirmed Medication Dose', `Marked ${m.name} as taken at ${timeNow}.`, 'Write');
          }
          return { ...m, takenToday: nextTaken, lastTakenTime: nextTaken ? timeNow : undefined };
        }
        return m;
      })
    );
  };

  const deleteMedicationReminder = (id: string) => {
    setMedicationReminders((prev) => prev.filter((m) => m.id !== id));
  };

  // 4. Allergies
  const reportAllergy = (allergy: Omit<PatientAllergyItem, 'id' | 'status' | 'reportedDate'>) => {
    const today = new Date().toISOString().split('T')[0];
    const item: PatientAllergyItem = {
      ...allergy,
      id: `alg-${Date.now()}`,
      status: 'PATIENT_REPORTED',
      reportedDate: today
    };
    setAllergiesList((prev) => [item, ...prev]);

    // Also update patient record allergy strings
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          const currentAllergies = p.allergies || [];
          if (!currentAllergies.includes(allergy.allergen)) {
            return { ...p, allergies: [...currentAllergies, allergy.allergen] };
          }
        }
        return p;
      })
    );

    addAuditLog(activePatient.name, 'Patient', 'Reported Suspected Allergy', `Submitted allergy for ${allergy.allergen} (${allergy.severity}). Pending clinician verification.`, 'Write');
    pushNotification(
      'Allergy Report Logged',
      `New suspected allergy for "${allergy.allergen}" added. A clinician will review during your next visit.`,
      'CLINICAL_ALERT'
    );
  };

  const verifyAllergy = (id: string, status: AllergyVerificationStatus, clinicianName: string) => {
    const today = new Date().toISOString().split('T')[0];
    setAllergiesList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, verifiedBy: clinicianName, verifiedDate: today } : a))
    );

    const target = allergiesList.find((a) => a.id === id);
    if (target) {
      addAuditLog(clinicianName, 'Doctor', `Allergy Status Updated (${status})`, `${target.allergen} classified as ${status}.`, 'Review');
      pushNotification(
        'Allergy Clinically Verified',
        `${target.allergen} allergy status was verified by ${clinicianName}.`,
        'CLINICAL_ALERT',
        status === 'CLINICALLY_VERIFIED' && target.severity === 'Anaphylactic'
      );
    }
  };

  // 5. Symptoms
  const reportSymptom = (symptom: Omit<PatientSymptomItem, 'id' | 'date' | 'source' | 'reportedBy'>) => {
    const today = new Date().toISOString().split('T')[0];
    const item: PatientSymptomItem = {
      ...symptom,
      id: `sym-${Date.now()}`,
      date: today,
      source: 'PATIENT_REPORTED',
      reportedBy: `${activePatient.name} (Patient Portal)`,
      status: 'Active'
    };
    setSymptomsList((prev) => [item, ...prev]);

    // Also update patient object's symptoms array
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          const current = p.symptoms || [];
          return {
            ...p,
            symptoms: [
              { symptom: item.symptom, severity: item.severity, duration: item.duration, onset: item.onset },
              ...current
            ]
          };
        }
        return p;
      })
    );

    addAuditLog(activePatient.name, 'Patient', 'Reported Clinical Symptom', `${item.symptom} (${item.severity}) recorded into EHR.`, 'Write');
    pushNotification(
      'Symptom Report Recorded',
      `"${item.symptom}" was added to your longitudinal health record for your care team.`,
      'PATIENT_UPDATE'
    );
  };

  const updateSymptomStatus = (id: string, status: 'Active' | 'Improving' | 'Resolved') => {
    setSymptomsList((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  // 6. Clinical Diagnoses
  const addClinicalDiagnosis = (diag: {
    icd10: string;
    description: string;
    type: 'Primary' | 'Secondary' | 'Chronic';
    diagnosedDate: string;
    status: 'Active' | 'Resolved' | 'Under Investigation';
  }) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          const currentDiagnoses = p.diagnoses || [];
          const currentChronic = p.chronicConditions || [];
          const chronicStr = `${diag.description} (ICD-10: ${diag.icd10})`;
          return {
            ...p,
            diagnoses: [diag, ...currentDiagnoses],
            chronicConditions: currentChronic.includes(chronicStr) ? currentChronic : [chronicStr, ...currentChronic]
          };
        }
        return p;
      })
    );

    addAuditLog('Dr. Alexandra Chen, MD', 'Doctor', 'Added Clinical Diagnosis', `${diag.description} (ICD-10: ${diag.icd10})`, 'Write');
    pushNotification(
      'New Clinical Diagnosis Added',
      `${diag.description} added to your permanent medical record.`,
      'CLINICAL_ALERT'
    );
  };

  // 7. e-Prescriptions
  const signPrescription = (prescription: {
    name: string;
    dosage: string;
    frequency: string;
    route: string;
    prescribedBy: string;
    duration?: string;
    notes?: string;
  }) => {
    const today = new Date().toISOString().split('T')[0];
    const newPrescriptionEntry = {
      id: `rx-${Date.now()}`,
      name: prescription.name,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      route: prescription.route,
      prescribedDate: today,
      prescribedBy: prescription.prescribedBy,
      status: 'Active' as const,
      refillsRemaining: 3
    };

    // Auto-create a patient medication reminder
    const autoReminder: PatientMedicationReminder = {
      id: `rem-${Date.now()}`,
      prescriptionId: newPrescriptionEntry.id,
      name: `${prescription.name} ${prescription.dosage}`,
      dosage: prescription.dosage,
      time: '08:00 AM',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      notes: prescription.notes || `${prescription.frequency} via ${prescription.route}`,
      takenToday: false
    };

    setMedicationReminders((prev) => [...prev, autoReminder]);

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          const curRx = p.prescriptionsList || [];
          const curMeds = p.currentMedications || [];
          const medStr = `${prescription.name} ${prescription.dosage} ${prescription.route} ${prescription.frequency}`;
          return {
            ...p,
            prescriptionsList: [newPrescriptionEntry, ...curRx],
            currentMedications: curMeds.includes(medStr) ? curMeds : [medStr, ...curMeds]
          };
        }
        return p;
      })
    );

    addAuditLog(prescription.prescribedBy, 'Doctor', 'Signed Digital e-Prescription', `Prescribed ${prescription.name} ${prescription.dosage}.`, 'Sign');
    pushNotification(
      'New Prescription Available',
      `${prescription.prescribedBy} signed a prescription for ${prescription.name}. Scheduled daily reminder created automatically.`,
      'PRESCRIPTION_SIGNED'
    );
  };

  // 8. Lab Reports
  const reviewLabReport = (reportId: string, doctorName: string, notes?: string) => {
    const timestamp = new Date().toISOString();
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          const updatedLabs = (p.labReports || []).map((lab) => {
            if (lab.id === reportId) {
              return {
                ...lab,
                reviewStatus: 'REVIEWED' as const,
                reviewedBy: doctorName,
                reviewedAt: timestamp,
                doctorNotes: notes || lab.doctorNotes,
                physicianNoteAuthor: doctorName,
                physicianNoteTimestamp: timestamp
              };
            }
            return lab;
          });
          return { ...p, labReports: updatedLabs };
        }
        return p;
      })
    );

    const report = activePatient.labReports?.find((l) => l.id === reportId);
    addAuditLog(doctorName, 'Doctor', 'Reviewed Diagnostic Panel', `Report "${report?.testName || reportId}" marked reviewed.`, 'Review');
    pushNotification(
      'Lab Results Released & Reviewed',
      `Your "${report?.testName || 'Diagnostic'}" panel was reviewed by ${doctorName}. Clinical interpretation is now available.`,
      'LAB_RESULT'
    );
  };

  const addLabReport = (report: LabReportItem) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          const current = p.labReports || [];
          return { ...p, labReports: [report, ...current] };
        }
        return p;
      })
    );

    addAuditLog(report.performingLab?.name || 'Laboratory Core', 'Lab Technician', 'Uploaded Final Lab Result', `${report.testName} (${report.resultValue} ${report.unit})`, 'Write');
    pushNotification(
      'New Laboratory Report Uploaded',
      `${report.testName} finalized by ${report.performingLab?.name || 'Clinical Pathology'}.`,
      'LAB_RESULT'
    );
  };

  // 9. Timeline Events
  const addTimelineSoapEvent = (event: ClinicalTimelineEvent) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          const current = p.clinicalTimeline || [];
          return { ...p, clinicalTimeline: [event, ...current] };
        }
        return p;
      })
    );
    addAuditLog(event.clinician, 'Doctor', `Documented Clinical Encounter (${event.type})`, event.title, 'Write');
  };

  // 10. Appointments
  const bookAppointment = (appointment: Omit<AppointmentItem, 'id' | 'status'>) => {
    const newAppt: AppointmentItem = {
      ...appointment,
      id: `apt-${Date.now()}`,
      status: 'SCHEDULED'
    };
    setAppointments((prev) => [newAppt, ...prev]);
    addAuditLog(activePatient.name, 'Patient', 'Booked Medical Consultation', `Appointment with ${appointment.patientName || appointment.doctorName} on ${appointment.date} at ${appointment.time}.`, 'Write');
    pushNotification(
      'Appointment Confirmed',
      `Consultation with ${appointment.doctorName || 'Doctor'} scheduled for ${appointment.date} at ${appointment.time}.`,
      'APPOINTMENT_BOOKED'
    );
  };

  const updateAppointmentStatus = (id: string, status: AppointmentItem['status']) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  // 11. Consents & Sharing
  const grantConsent = (consent: Omit<AccessConsentItem, 'id' | 'status' | 'grantedDate' | 'token'>, token?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newConsent: AccessConsentItem = {
      ...consent,
      id: `cst-${Date.now()}`,
      status: 'Active',
      grantedDate: today,
      token: token || undefined
    };
    setConsents((prev) => [newConsent, ...prev]);
    addAuditLog(activePatient.name, 'Patient', 'Granted EHR Access Consent', `Shared health record with ${consent.granteeName} (${consent.scope.join(', ')}).`, 'Share');
  };

  const revokeConsent = (id: string) => {
    setConsents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Revoked' as const } : c))
    );
    const item = consents.find((c) => c.id === id);
    if (item) {
      addAuditLog(activePatient.name, 'Patient', 'Revoked Access Consent', `Access permission for ${item.granteeName} revoked.`, 'Share');
    }
  };

  // 12. Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // 13. Update Demographics
  const updatePatientDemographics = (profile: PatientProfile) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          return {
            ...p,
            name: profile.fullName,
            age: profile.age,
            gender: profile.gender === 'Prefer not to say' ? 'Other' : profile.gender,
            bloodGroup: profile.bloodGroup,
            phone: profile.phoneNumber,
            dob: profile.dateOfBirth,
            mrn: profile.mrn,
            emergencyContact: {
              name: profile.emergencyContactName,
              phone: profile.emergencyContactPhone,
              relation: profile.emergencyContactRelation
            }
          };
        }
        return p;
      })
    );

    addAuditLog(profile.fullName, 'Patient', 'Updated Demographics Profile', 'Contact, blood group, emergency contact details updated.', 'Write');
  };

  // 14. Update Patient Record (for clinicians)
  const updatePatientRecord = (updated: PatientRecord) => {
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    addAuditLog('Attending Clinician', 'Doctor', 'Updated Patient Medical Record', `Updated chart and timeline for ${updated.name}.`, 'Write');
  };

  // 15. Clinical Prescriptions Management
  const savePrescriptionDocument = (prescription: Omit<ClinicalPrescriptionRecord, 'id' | 'createdAt'>) => {
    const newId = `RX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date().toISOString();
    const newRecord: ClinicalPrescriptionRecord = {
      ...prescription,
      id: newId,
      createdAt
    };

    setClinicalPrescriptions((prev) => [newRecord, ...prev]);

    // Also update patient's current medications & timeline for longitudinal record
    if (prescription.medications && prescription.medications.length > 0) {
      setPatients((prev) =>
        prev.map((p) => {
          if (p.id === activePatient.id) {
            const currentMeds = p.currentMedications || [];
            const newMedNames = prescription.medications.map(m => `${m.name} ${m.dosage} (${m.frequency})`);
            const combinedMeds = Array.from(new Set([...newMedNames, ...currentMeds]));
            
            const curRx = p.prescriptionsList || [];
            const newRxEntries = prescription.medications.map((m, idx) => ({
              id: `${newId}-med-${idx + 1}`,
              name: m.name,
              dosage: m.dosage,
              frequency: m.frequency,
              route: m.form === 'Inhaler' ? 'Inhalation' : m.form === 'Drops' ? 'Ophthalmic' : 'Oral',
              prescribedDate: prescription.prescriptionDate,
              prescribedBy: prescription.doctorName,
              status: prescription.status === 'Active' ? ('Active' as const) : ('Completed' as const),
              refillsRemaining: m.refillsRemaining
            }));

            return {
              ...p,
              currentMedications: combinedMeds,
              prescriptionsList: [...newRxEntries, ...curRx]
            };
          }
          return p;
        })
      );
    }

    addAuditLog(
      activePatient.name,
      'Patient',
      'Saved Clinical Prescription Document',
      `Prescription from ${prescription.doctorName} (${prescription.hospitalClinic}) with ${prescription.pages.length} page(s) uploaded via ${prescription.source}.`,
      'Write'
    );

    pushNotification(
      'Prescription Saved to EHR',
      `Prescription from ${prescription.doctorName} (${prescription.title || 'Medical Rx'}) has been securely archived in your Clinical Health Record.`,
      'PRESCRIPTION_SIGNED'
    );
  };

  const updatePrescriptionStatus = (id: string, status: PrescriptionStatus) => {
    setClinicalPrescriptions((prev) =>
      prev.map((rx) => (rx.id === id ? { ...rx, status } : rx))
    );
    addAuditLog(activePatient.name, 'Patient', 'Updated Prescription Status', `Prescription ${id} status set to ${status}.`, 'Write');
  };

  const deletePrescriptionDocument = (id: string) => {
    const target = clinicalPrescriptions.find(rx => rx.id === id);
    setClinicalPrescriptions((prev) => prev.filter((rx) => rx.id !== id));
    addAuditLog(
      activePatient.name,
      'Patient',
      'Deleted Prescription Record',
      `Removed prescription "${target?.title || id}" from Clinical Health Record.`,
      'Delete'
    );
  };

  const value: PatientEhrContextType = {
    patients,
    activePatientId,
    activePatient,
    setActivePatientId,
    wellness,
    updateWellness,
    logWater,
    resetWaterDaily,
    vitalsHistory: activePatient.vitalsHistory || [],
    addVitalReading,
    medicationReminders,
    addMedicationReminder,
    toggleMedicationTaken,
    deleteMedicationReminder,
    allergiesList,
    reportAllergy,
    verifyAllergy,
    symptomsList,
    reportSymptom,
    updateSymptomStatus,
    addClinicalDiagnosis,
    signPrescription,
    reviewLabReport,
    addLabReport,
    addTimelineSoapEvent,
    clinicalPrescriptions,
    savePrescriptionDocument,
    updatePrescriptionStatus,
    deletePrescriptionDocument,
    appointments,
    bookAppointment,
    updateAppointmentStatus,
    consents,
    grantConsent,
    revokeConsent,
    auditLogs,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    updatePatientDemographics,
    updatePatientRecord
  };

  return <PatientEhrContext.Provider value={value}>{children}</PatientEhrContext.Provider>;
};

export const usePatientEhr = (): PatientEhrContextType => {
  const context = useContext(PatientEhrContext);
  if (!context) {
    throw new Error('usePatientEhr must be used within a PatientEhrProvider');
  }
  return context;
};
