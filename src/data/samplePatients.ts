import { PatientRecord, AppointmentItem, ClinicalMessage, BillingClaim, NotificationItem } from '../types/medauth';

export const samplePatients: PatientRecord[] = [
  // 1. Rahul Kumar
  {
    id: 'PT-2026-901',
    name: 'Rahul Kumar',
    age: 34,
    gender: 'Male',
    mrn: 'MRN-2026-901',
    bloodGroup: 'O+',
    dob: '1992-05-14',
    phone: '+1 (555) 234-5678',
    emergencyContact: {
      name: 'Priya Kumar',
      relation: 'Spouse',
      phone: '+1 (555) 890-1234'
    },
    status: 'Follow-up',
    criticalAlerts: [
      'SEVERE PENICILLIN ALLERGY',
      'HYPERTENSION MONITORING REQUIRED'
    ],
    primaryCondition: 'Hypertension Stage I & Mild Tachycardia',
    lastVisited: '2026-08-07',
    allergies: ['Penicillin', 'Sulfa Drugs', 'Dust Mites'],
    chronicConditions: [
      'Stage 1 Essential Hypertension (ICD-10: I10)',
      'Sinus Tachycardia (ICD-10: R00.0)',
      'Metabolic Syndrome (ICD-10: E88.81)'
    ],
    currentMedications: [
      'Lisinopril 10mg PO Daily',
      'Metoprolol Succinate 25mg PO Daily',
      'Omega-3 Acid 1000mg PO Daily'
    ],
    recentVitals: {
      bp: '138/86 mmHg',
      hr: 82,
      spo2: 99,
      temp: 98.6,
      weightKg: 78.5,
      heightCm: 175,
      bmi: 25.6,
      respiratoryRate: 16
    },
    vitalsHistory: [
      { date: '2026-03-15', systolic: 148, diastolic: 94, heartRate: 96, glucose: 118, spo2: 98 },
      { date: '2026-05-10', systolic: 142, diastolic: 90, heartRate: 92, glucose: 112, spo2: 99 },
      { date: '2026-07-04', systolic: 138, diastolic: 88, heartRate: 86, glucose: 106, spo2: 99 },
      { date: '2026-08-07', systolic: 138, diastolic: 86, heartRate: 82, glucose: 104, spo2: 99 }
    ],
    labReports: [
      {
        id: 'lab-rk-01',
        testName: 'Complete Blood Count (CBC)',
        category: 'Hematology',
        resultValue: '14.8',
        unit: 'g/dL',
        referenceRange: '13.5 - 17.5',
        status: 'NORMAL',
        performedAt: '2026-08-23T09:15:00Z',
        reportedAt: '2026-08-23T10:30:00Z',
        doctorNotes: 'Normocytic, normochromic RBC indices. Platelet and leukocyte counts within standard physiological limits.',
        physicianNoteAuthor: 'Dr. Alexandra Chen, MD',
        physicianNoteTimestamp: '2026-08-23T10:42:00Z',
        reviewStatus: 'REVIEWED',
        reviewedBy: 'Dr. Alexandra Chen, MD',
        reviewedAt: '2026-08-23T10:42:00Z',
        loincCode: '58410-2',
        performingLab: {
          name: 'Global Diagnostics Pathology Core',
          facilityId: 'LAB-CLIA-05D98231',
          cliaNumber: '05D9823194',
          accreditation: 'CAP & CLIA Accredited',
          director: 'Dr. Marcus Vance, MD, FCAP'
        },
        specimen: {
          type: 'Venous Whole Blood (K2-EDTA)',
          collectedAt: '2026-08-23T08:45:00Z',
          fastingStatus: 'Fasting (12 hrs)'
        },
        biomarkers: [
          { id: 'bm-1', name: 'Hemoglobin', loincCode: '718-7', resultValue: '14.8', unit: 'g/dL', referenceRange: '13.5 - 17.5', status: 'NORMAL', referenceLow: 13.5, referenceHigh: 17.5 },
          { id: 'bm-2', name: 'White Blood Cell (WBC)', loincCode: '6690-2', resultValue: '7.2', unit: '×10⁹/L', referenceRange: '4.0 - 11.0', status: 'NORMAL', referenceLow: 4.0, referenceHigh: 11.0 },
          { id: 'bm-3', name: 'Platelets', loincCode: '777-3', resultValue: '245', unit: '×10⁹/L', referenceRange: '150 - 450', status: 'NORMAL', referenceLow: 150, referenceHigh: 450 },
          { id: 'bm-4', name: 'Hematocrit', loincCode: '4544-3', resultValue: '44.2', unit: '%', referenceRange: '41.0 - 53.0', status: 'NORMAL', referenceLow: 41.0, referenceHigh: 53.0 },
          { id: 'bm-5', name: 'Mean Corpuscular Volume (MCV)', loincCode: '787-2', resultValue: '88.6', unit: 'fL', referenceRange: '80.0 - 100.0', status: 'NORMAL', referenceLow: 80.0, referenceHigh: 100.0 },
          { id: 'bm-6', name: 'Red Blood Cells (RBC)', loincCode: '789-8', resultValue: '4.95', unit: '×10¹²/L', referenceRange: '4.30 - 5.90', status: 'NORMAL', referenceLow: 4.3, referenceHigh: 5.9 }
        ],
        historicalTrends: [
          { date: '2026-04-10', value: 14.5, displayValue: '14.5', unit: 'g/dL', status: 'NORMAL', notes: 'Baseline wellness screening' },
          { date: '2026-06-15', value: 14.6, displayValue: '14.6', unit: 'g/dL', status: 'NORMAL', notes: 'Hypertension checkup' },
          { date: '2026-08-23', value: 14.8, displayValue: '14.8', unit: 'g/dL', status: 'NORMAL', notes: 'Current verified panel' }
        ],
        sourceDocument: {
          filename: 'CBC_Report_Kumar_Rahul_20260823.pdf',
          filesize: '348 KB',
          mimeType: 'application/pdf',
          verifiedHash: 'sha256:7f9b8c10e529...'
        }
      },
      {
        id: 'lab-rk-02',
        testName: 'Fasting Lipid Panel: LDL',
        category: 'Lipid',
        resultValue: '124',
        unit: 'mg/dL',
        referenceRange: '< 100',
        status: 'HIGH',
        performedAt: '2026-08-23T09:15:00Z',
        reportedAt: '2026-08-23T10:35:00Z',
        doctorNotes: 'Borderline elevated LDL cholesterol. Upward 3-month trajectory noted (+16 mg/dL since June). Re-evaluate cardiovascular risk profile and consider low-dose statin.',
        physicianNoteAuthor: 'Dr. Alexandra Chen, MD',
        physicianNoteTimestamp: '2026-08-23T10:47:00Z',
        reviewStatus: 'PENDING_REVIEW',
        loincCode: '2089-1',
        performingLab: {
          name: 'Global Diagnostics Clinical Chemistry',
          facilityId: 'LAB-CLIA-05D98231',
          cliaNumber: '05D9823194',
          accreditation: 'CAP Accredited',
          director: 'Dr. Marcus Vance, MD, FCAP'
        },
        specimen: {
          type: 'Serum Separator Tube (SST)',
          collectedAt: '2026-08-23T08:45:00Z',
          fastingStatus: 'Fasting (12 hrs)'
        },
        biomarkers: [
          { id: 'bm-l1', name: 'Direct LDL Cholesterol', loincCode: '2089-1', resultValue: '124', unit: 'mg/dL', referenceRange: '< 100', status: 'HIGH', referenceHigh: 100, critical: false },
          { id: 'bm-l2', name: 'Total Cholesterol', loincCode: '2093-3', resultValue: '212', unit: 'mg/dL', referenceRange: '< 200', status: 'HIGH', referenceHigh: 200 },
          { id: 'bm-l3', name: 'HDL Cholesterol', loincCode: '2085-9', resultValue: '48', unit: 'mg/dL', referenceRange: '> 40', status: 'NORMAL', referenceLow: 40 },
          { id: 'bm-l4', name: 'Triglycerides', loincCode: '2571-8', resultValue: '168', unit: 'mg/dL', referenceRange: '< 150', status: 'HIGH', referenceHigh: 150 },
          { id: 'bm-l5', name: 'Non-HDL Cholesterol', loincCode: '43396-1', resultValue: '164', unit: 'mg/dL', referenceRange: '< 130', status: 'HIGH', referenceHigh: 130 }
        ],
        historicalTrends: [
          { date: '2026-04-10', value: 108, displayValue: '108', unit: 'mg/dL', status: 'NORMAL', notes: 'Initial baseline' },
          { date: '2026-06-15', value: 115, displayValue: '115', unit: 'mg/dL', status: 'HIGH', notes: 'Dietary shift reported' },
          { date: '2026-08-23', value: 124, displayValue: '124', unit: 'mg/dL', status: 'HIGH', notes: 'Current elevated panel (+9 mg/dL delta)' }
        ],
        sourceDocument: {
          filename: 'Lipid_Panel_DirectLDL_Kumar_20260823.pdf',
          filesize: '412 KB',
          mimeType: 'application/pdf',
          verifiedHash: 'sha256:4a8c91d8e031...'
        }
      },
      {
        id: 'lab-rk-03',
        testName: 'Comprehensive Metabolic: Creatinine & eGFR',
        category: 'Metabolic',
        resultValue: '0.9',
        unit: 'mg/dL',
        referenceRange: '0.7 - 1.3',
        status: 'NORMAL',
        performedAt: '2026-08-23T09:15:00Z',
        reportedAt: '2026-08-23T10:35:00Z',
        doctorNotes: 'eGFR > 90 mL/min/1.73m². Intact renal excretory clearance, normal blood urea nitrogen (BUN) and electrolyte balance.',
        physicianNoteAuthor: 'Dr. Alexandra Chen, MD',
        physicianNoteTimestamp: '2026-08-23T10:49:00Z',
        reviewStatus: 'PENDING_REVIEW',
        loincCode: '2160-0',
        performingLab: {
          name: 'Global Diagnostics Clinical Chemistry',
          facilityId: 'LAB-CLIA-05D98231',
          accreditation: 'CAP & CLIA Accredited'
        },
        specimen: {
          type: 'Serum Separator Tube (SST)',
          collectedAt: '2026-08-23T08:45:00Z',
          fastingStatus: 'Fasting (12 hrs)'
        },
        biomarkers: [
          { id: 'bm-m1', name: 'Serum Creatinine', loincCode: '2160-0', resultValue: '0.9', unit: 'mg/dL', referenceRange: '0.7 - 1.3', status: 'NORMAL', referenceLow: 0.7, referenceHigh: 1.3 },
          { id: 'bm-m2', name: 'eGFR (CKD-EPI 2021)', loincCode: '98979-8', resultValue: '> 90', unit: 'mL/min/1.73m²', referenceRange: '> 60', status: 'NORMAL', referenceLow: 60 },
          { id: 'bm-m3', name: 'Blood Urea Nitrogen (BUN)', loincCode: '3094-0', resultValue: '14', unit: 'mg/dL', referenceRange: '7 - 20', status: 'NORMAL', referenceLow: 7, referenceHigh: 20 },
          { id: 'bm-m4', name: 'Serum Sodium', loincCode: '2951-2', resultValue: '140', unit: 'mmol/L', referenceRange: '136 - 145', status: 'NORMAL', referenceLow: 136, referenceHigh: 145 },
          { id: 'bm-m5', name: 'Serum Potassium', loincCode: '2823-3', resultValue: '4.2', unit: 'mmol/L', referenceRange: '3.5 - 5.1', status: 'NORMAL', referenceLow: 3.5, referenceHigh: 5.1 }
        ],
        historicalTrends: [
          { date: '2026-04-10', value: 0.92, displayValue: '0.92', unit: 'mg/dL', status: 'NORMAL' },
          { date: '2026-06-15', value: 0.88, displayValue: '0.88', unit: 'mg/dL', status: 'NORMAL' },
          { date: '2026-08-23', value: 0.90, displayValue: '0.90', unit: 'mg/dL', status: 'NORMAL' }
        ]
      },
      {
        id: 'lab-rk-04',
        testName: 'High-Sensitivity C-Reactive Protein (hs-CRP)',
        category: 'Cardiology',
        resultValue: '1.2',
        unit: 'mg/L',
        referenceRange: '< 3.0',
        status: 'NORMAL',
        performedAt: '2026-08-23T09:15:00Z',
        reportedAt: '2026-08-23T10:40:00Z',
        doctorNotes: 'Low systemic cardiovascular inflammatory risk category (< 2.0 mg/L).',
        physicianNoteAuthor: 'Dr. Alexandra Chen, MD',
        physicianNoteTimestamp: '2026-08-23T10:50:00Z',
        reviewStatus: 'REVIEWED',
        reviewedBy: 'Dr. Alexandra Chen, MD',
        reviewedAt: '2026-08-23T10:50:00Z',
        loincCode: '30522-7',
        performingLab: {
          name: 'Heart Institute Diagnostic Immunology',
          facilityId: 'LAB-CLIA-05D98231'
        },
        specimen: {
          type: 'Serum',
          collectedAt: '2026-08-23T08:45:00Z'
        },
        biomarkers: [
          { id: 'bm-c1', name: 'hs-CRP (Cardiac Risk)', loincCode: '30522-7', resultValue: '1.2', unit: 'mg/L', referenceRange: '< 3.0', status: 'NORMAL', referenceHigh: 3.0 }
        ],
        historicalTrends: [
          { date: '2026-04-10', value: 1.4, displayValue: '1.4', unit: 'mg/L', status: 'NORMAL' },
          { date: '2026-08-23', value: 1.2, displayValue: '1.2', unit: 'mg/L', status: 'NORMAL' }
        ]
      }
    ],
    clinicalTimeline: [
      {
        id: 'evt-rk-1',
        date: '2026-08-07',
        type: 'Consultation',
        title: 'Hypertension Management & Holter Follow-up',
        clinician: 'Attending Physician',
        facility: 'Cardiovascular Outpatient Suite',
        soapNotes: {
          subjective: 'Patient reports improved exercise tolerance after beginning low-dose beta-blocker. Occasional afternoon headaches if dehydrated.',
          objective: 'BP 138/86 mmHg, HR 82 bpm regular. Normal S1/S2 heart sounds, no carotid bruits, lungs clear to auscultation.',
          assessment: 'Stage 1 Essential Hypertension with mild sinus tachycardia, showing steady therapeutic response.',
          plan: 'Continue Lisinopril 10mg and Metoprolol 25mg daily. Emphasize low-sodium diet and 30 mins aerobic walking.'
        }
      }
    ],
    medicalHistory: [
      { category: 'Cardiovascular', description: 'Essential Hypertension diagnosed 2024. Well-controlled on monotherapy, recent combination step-up.', diagnosedDate: '2024-03-12', status: 'Active' },
      { category: 'Surgical History', description: 'Elective Laparoscopic Appendectomy without perioperative complications.', diagnosedDate: '2019-06-18', status: 'Resolved' },
      { category: 'Family History', description: 'Father had myocardial infarction at age 58. Mother has Type 2 Diabetes.', status: 'Active' },
      { category: 'Social History', description: 'Non-smoker, drinks alcohol socially (1-2 drinks/week), works as software engineer with sedentary desk hours.', status: 'Active' }
    ],
    symptoms: [
      { symptom: 'Occasional Exertional Palpitations', severity: 'Mild', duration: '2 weeks', onset: 'After caffeine or high-stress work' },
      { symptom: 'Tension Headaches', severity: 'Mild', duration: 'Intermittent', onset: 'Late afternoon' }
    ],
    diagnoses: [
      { icd10: 'I10', description: 'Essential (primary) hypertension', type: 'Primary', diagnosedDate: '2024-03-12', status: 'Active' },
      { icd10: 'R00.0', description: 'Tachycardia, unspecified', type: 'Secondary', diagnosedDate: '2025-01-20', status: 'Active' },
      { icd10: 'E88.81', description: 'Metabolic syndrome', type: 'Secondary', diagnosedDate: '2025-06-11', status: 'Active' }
    ],
    prescriptionsList: [
      { id: 'rx-rk-1', name: 'Lisinopril', dosage: '10mg', frequency: 'PO Once Daily (Morning)', route: 'Oral', prescribedDate: '2026-08-07', prescribedBy: 'Dr. Alexandra Chen, MD', status: 'Active', refillsRemaining: 3 },
      { id: 'rx-rk-2', name: 'Metoprolol Succinate ER', dosage: '25mg', frequency: 'PO Once Daily', route: 'Oral', prescribedDate: '2026-08-07', prescribedBy: 'Dr. Alexandra Chen, MD', status: 'Active', refillsRemaining: 3 },
      { id: 'rx-rk-3', name: 'Omega-3 Acid Ethyl Esters', dosage: '1000mg', frequency: 'PO Once Daily', route: 'Oral', prescribedDate: '2026-06-15', prescribedBy: 'Dr. Alexandra Chen, MD', status: 'Active', refillsRemaining: 5 }
    ],
    procedures: [
      { id: 'proc-rk-1', procedureName: '24-Hour Holter Ambulatory ECG Monitoring', date: '2026-07-28', facility: 'Outpatient Cardiac Lab', surgeon: 'Cardiology Diagnostic Tech', status: 'Completed', notes: 'Sinus rhythm throughout with rare premature atrial complexes (<0.1%).' },
      { id: 'proc-rk-2', procedureName: 'Laparoscopic Appendectomy', date: '2019-06-18', facility: 'General Surgical Pavilion', surgeon: 'Dr. J. Miller, MD, FACS', status: 'Completed', notes: 'Uncomplicated laparoscopic removal. Histology confirmed acute appendicitis without perforation.' }
    ],
    immunizations: [
      { vaccineName: 'COVID-19 Bivalent Booster (mRNA)', dateAdministered: '2025-10-14', doseNumber: 'Booster 2', lotNumber: 'FL-9921-A', facility: 'Hospital Employee Clinic', status: 'Up to Date' },
      { vaccineName: 'Influenza Quadrivalent', dateAdministered: '2025-09-22', doseNumber: 'Annual', lotNumber: 'IN-4819-B', facility: 'Community Pharmacy', status: 'Up to Date' },
      { vaccineName: 'Tdap (Tetanus, Diphtheria, Pertussis)', dateAdministered: '2022-04-11', doseNumber: 'Dose 1', lotNumber: 'TD-3810-C', facility: 'Primary Care Center', status: 'Up to Date' }
    ],
    hospitalizations: [
      { id: 'hosp-rk-1', admissionDate: '2019-06-18', dischargeDate: '2019-06-19', reason: 'Acute Appendicitis (RLQ Abdominal Pain)', facility: 'Metro General Hospital', attendingPhysician: 'Dr. J. Miller, MD', dischargeSummary: 'Patient underwent uncomplicated laparoscopic appendectomy. Tolerated oral diet and discharged in stable condition.' }
    ],
    imagingReports: [
      { id: 'img-rk-1', modality: 'Transthoracic Echocardiogram (TTE)', bodyPart: 'Heart / Thorax', date: '2026-06-12', findings: 'Normal left ventricular size and systolic function (LVEF 60-65%). No regional wall motion abnormalities. Normal diastolic filling parameters.', impression: 'Normal resting 2D echocardiogram. No hypertensive structural remodeling.', radiologist: 'Dr. H. Vance, MD', status: 'Final' }
    ],
    documents: [
      { id: 'doc-rk-1', title: 'Holter 24-Hour Final Diagnostic Report.pdf', category: 'Diagnostics', uploadedDate: '2026-07-29', fileSize: '1.4 MB', fileType: 'PDF' },
      { id: 'doc-rk-2', title: 'Comprehensive Metabolic & Lipid Panel.pdf', category: 'Laboratory', uploadedDate: '2026-08-07', fileSize: '850 KB', fileType: 'PDF' },
      { id: 'doc-rk-3', title: 'Cardiology Referral Intake Consultation.pdf', category: 'Consultation', uploadedDate: '2026-06-10', fileSize: '1.8 MB', fileType: 'PDF' }
    ],
    doctorNotesList: [
      { id: 'note-rk-1', date: '2026-08-07', author: 'Dr. Alexandra Chen, MD', authorRole: 'Attending Cardiologist', category: 'Clinical Follow-up', note: 'Patient reports feeling much calmer at work with beta blocker. BP is moving in the right direction (138/86 vs 148/94 in March). Instructed on DASH diet.' },
      { id: 'note-rk-2', date: '2026-06-10', author: 'Dr. Alexandra Chen, MD', authorRole: 'Attending Cardiologist', category: 'Initial Evaluation', note: 'Initial consultation for borderline tachycardia and stage 1 hypertension. Normal baseline echo.' }
    ]
  },

  // 2. Eleanor Vance (Cardiovascular & Metabolic Focus)
  {
    id: 'PT-100293',
    name: 'Eleanor Vance',
    age: 64,
    gender: 'Female',
    mrn: 'MRN-8849201',
    bloodGroup: 'O+',
    dob: '1962-09-18',
    phone: '+1 (555) 438-9921',
    emergencyContact: {
      name: 'Thomas Vance',
      relation: 'Son',
      phone: '+1 (555) 321-7788'
    },
    status: 'High-Priority',
    criticalAlerts: [
      'SEVERE PENICILLIN ANAPHYLAXIS',
      'SULFA DRUGS SEVERE RASH',
      'TYPE 2 DIABETES & HTN STAGE 2'
    ],
    primaryCondition: 'Stage 2 Essential Hypertension & Type 2 Diabetes Mellitus',
    lastVisited: '2026-07-14',
    allergies: ['Penicillin (Severe Anaphylaxis)', 'Sulfa Drugs (Stevens-Johnson Risk)'],
    chronicConditions: [
      'Stage 2 Essential Hypertension (ICD-10: I10)',
      'Type 2 Diabetes Mellitus without complications (ICD-10: E11.9)',
      'Mixed Hyperlipidemia (ICD-10: E78.2)'
    ],
    currentMedications: [
      'Lisinopril 20mg PO Daily',
      'Metformin 1000mg PO BID',
      'Atorvastatin 40mg PO QHS'
    ],
    recentVitals: {
      bp: '132/84 mmHg',
      hr: 72,
      spo2: 98,
      temp: 98.4,
      weightKg: 68.5,
      heightCm: 168,
      bmi: 25.4,
      respiratoryRate: 16
    },
    vitalsHistory: [
      { date: '2026-01-10', systolic: 154, diastolic: 96, heartRate: 80, glucose: 158, spo2: 97 },
      { date: '2026-04-10', systolic: 144, diastolic: 90, heartRate: 76, glucose: 134, spo2: 98 },
      { date: '2026-07-14', systolic: 132, diastolic: 84, heartRate: 72, glucose: 118, spo2: 98 }
    ],
    labReports: [
      {
        id: 'lab-ev-01',
        testName: 'Hemoglobin A1c (HbA1c)',
        category: 'Metabolic',
        resultValue: '5.8',
        unit: '%',
        referenceRange: '4.0 - 5.6',
        status: 'HIGH',
        performedAt: '2026-07-14T09:00:00Z',
        doctorNotes: 'HbA1c improved from 6.8% to 5.8% on Metformin 1000mg BID regimen.'
      },
      {
        id: 'lab-ev-02',
        testName: 'Estimated GFR (eGFR CKD-EPI)',
        category: 'Metabolic',
        resultValue: '88',
        unit: 'mL/min/1.73m²',
        referenceRange: '> 60',
        status: 'NORMAL',
        performedAt: '2026-07-14T09:00:00Z',
        doctorNotes: 'Preserved renal function.'
      },
      {
        id: 'lab-ev-03',
        testName: 'Direct LDL-C',
        category: 'Lipid',
        resultValue: '68',
        unit: 'mg/dL',
        referenceRange: '< 70',
        status: 'NORMAL',
        performedAt: '2026-07-14T09:00:00Z',
        doctorNotes: 'Goal LDL achieved on Atorvastatin 40mg.'
      }
    ],
    clinicalTimeline: [
      {
        id: 'evt-ev-1',
        date: '2026-07-14',
        type: 'Consultation',
        title: 'Routine Cardiology & Glycemic Follow-up',
        clinician: 'Attending Physician',
        facility: 'Cardiovascular Care Center',
        soapNotes: {
          subjective: 'Patient reports adherence to medications, denies chest pain, dizziness, or hypoglycemic episodes.',
          objective: 'BP 132/84, HR 72, BMI 25.4. Lungs clear, no peripheral edema. HbA1c 5.8%.',
          assessment: 'Hypertension and T2D well-controlled on current pharmacotherapy.',
          plan: 'Continue Lisinopril 20mg, Metformin 1000mg BID, and Atorvastatin 40mg. Recheck CMP and microalbumin in 6 months.'
        }
      },
      {
        id: 'evt-ev-2',
        date: '2026-04-10',
        type: 'Diagnostic',
        title: 'Annual Comprehensive Metabolic & Microalbumin Screen',
        clinician: 'Diagnostic Center Staff',
        facility: 'Central Laboratory',
        soapNotes: {
          subjective: 'Fasting blood draw.',
          objective: 'HbA1c 6.2%, eGFR 88 mL/min, Urine Microalbumin negative.',
          assessment: 'Metabolic markers trending positive.',
          plan: 'Maintain diet and exercise regimen.'
        }
      }
    ],
    medicalHistory: [
      { category: 'Cardiovascular', description: 'Hypertension Stage 2 diagnosed in 2018.', diagnosedDate: '2018-05-10', status: 'Active' },
      { category: 'Endocrine', description: 'Type 2 Diabetes Mellitus diagnosed in 2020.', diagnosedDate: '2020-09-14', status: 'Active' },
      { category: 'Surgical History', description: 'Total Abdominal Hysterectomy for benign fibroids.', diagnosedDate: '2012-11-04', status: 'Resolved' },
      { category: 'Family History', description: 'Mother had stroke at age 72. Maternal grandmother had Diabetes.', status: 'Active' }
    ],
    symptoms: [
      { symptom: 'Mild Exertional Fatigue', severity: 'Mild', duration: '1 month', onset: 'Gradual' }
    ],
    diagnoses: [
      { icd10: 'I10', description: 'Essential (primary) hypertension', type: 'Primary', diagnosedDate: '2018-05-10', status: 'Active' },
      { icd10: 'E11.9', description: 'Type 2 diabetes mellitus without complications', type: 'Primary', diagnosedDate: '2020-09-14', status: 'Active' },
      { icd10: 'E78.2', description: 'Mixed hyperlipidemia', type: 'Secondary', diagnosedDate: '2021-02-18', status: 'Active' }
    ],
    prescriptionsList: [
      { id: 'rx-ev-1', name: 'Lisinopril', dosage: '20mg', frequency: 'PO Once Daily', route: 'Oral', prescribedDate: '2026-07-14', prescribedBy: 'Dr. Alexandra Chen, MD', status: 'Active', refillsRemaining: 4 },
      { id: 'rx-ev-2', name: 'Metformin HCl', dosage: '1000mg', frequency: 'PO Twice Daily with Meals', route: 'Oral', prescribedDate: '2026-07-14', prescribedBy: 'Dr. Alexandra Chen, MD', status: 'Active', refillsRemaining: 4 },
      { id: 'rx-ev-3', name: 'Atorvastatin Calcium', dosage: '40mg', frequency: 'PO Once Daily at Bedtime', route: 'Oral', prescribedDate: '2026-07-14', prescribedBy: 'Dr. Alexandra Chen, MD', status: 'Active', refillsRemaining: 4 }
    ],
    procedures: [
      { id: 'proc-ev-1', procedureName: 'Total Abdominal Hysterectomy', date: '2012-11-04', facility: 'Women’s Surgical Hospital', surgeon: 'Dr. M. Jenkins, MD', status: 'Completed' }
    ],
    immunizations: [
      { vaccineName: 'Shingrix (Zoster Recombinant)', dateAdministered: '2025-04-12', doseNumber: 'Dose 2', lotNumber: 'SH-8812', facility: 'Public Health Clinic', status: 'Up to Date' },
      { vaccineName: 'Pneumococcal Conjugate (PCV20)', dateAdministered: '2024-11-05', doseNumber: 'Dose 1', lotNumber: 'PN-2910', facility: 'Primary Care Center', status: 'Up to Date' }
    ],
    hospitalizations: [],
    imagingReports: [
      { id: 'img-ev-1', modality: 'Chest Radiography (PA & Lateral)', bodyPart: 'Chest', date: '2025-11-02', findings: 'Clear lung fields bilaterally. Normal cardiac silhouette. No acute infiltrates.', impression: 'Negative for acute cardiopulmonary disease.', radiologist: 'Dr. P. Ramos, MD', status: 'Final' }
    ],
    documents: [
      { id: 'doc-ev-1', title: 'Comprehensive Metabolic Panel & Lipid Profile.pdf', category: 'Laboratory', uploadedDate: '2026-07-14', fileSize: '920 KB', fileType: 'PDF' },
      { id: 'doc-ev-2', title: 'Annual Retinal Diabetic Examination.pdf', category: 'Diagnostics', uploadedDate: '2026-03-20', fileSize: '2.1 MB', fileType: 'PDF' }
    ],
    doctorNotesList: [
      { id: 'note-ev-1', date: '2026-07-14', author: 'Dr. Alexandra Chen, MD', authorRole: 'Attending Cardiologist', category: 'Progress Note', note: 'Significant improvement in glycemic metrics. Patient motivated and walking 4x weekly.' }
    ]
  },

  // 3. David K. Miller (Respiratory & Allergic Focus)
  {
    id: 'PT-100482',
    name: 'David K. Miller',
    age: 42,
    gender: 'Male',
    mrn: 'MRN-9201472',
    bloodGroup: 'A+',
    dob: '1984-11-22',
    phone: '+1 (555) 773-1029',
    emergencyContact: {
      name: 'Sarah Miller',
      relation: 'Spouse',
      phone: '+1 (555) 773-8899'
    },
    status: 'Active',
    criticalAlerts: [
      'SEVERE ASPIRIN / NSAID BRONCHOSPASM',
      'CODEINE SEVERE HYPERSENSITIVITY'
    ],
    primaryCondition: 'Moderate Persistent Asthma & Allergic Rhinitis',
    lastVisited: '2026-08-01',
    allergies: ['Aspirin / NSAIDs (Worsens Bronchospasm)', 'Codeine (Severe Nausea / Hypersensitivity)'],
    chronicConditions: [
      'Moderate Persistent Asthma without exacerbation (ICD-10: J45.40)',
      'Allergic Rhinitis, unspecified (ICD-10: J30.9)'
    ],
    currentMedications: [
      'Fluticasone/Salmeterol 250/50mcg Inhalation BID',
      'Albuterol HFA 90mcg Inhalation PRN',
      'Montelukast 10mg PO QHS'
    ],
    recentVitals: {
      bp: '118/76 mmHg',
      hr: 68,
      spo2: 99,
      temp: 98.6,
      weightKg: 74.0,
      heightCm: 180,
      bmi: 22.8,
      respiratoryRate: 14
    },
    vitalsHistory: [
      { date: '2026-02-14', systolic: 122, diastolic: 78, heartRate: 72, glucose: 95, spo2: 98 },
      { date: '2026-05-18', systolic: 120, diastolic: 76, heartRate: 70, glucose: 92, spo2: 99 },
      { date: '2026-08-01', systolic: 118, diastolic: 76, heartRate: 68, glucose: 94, spo2: 99 }
    ],
    labReports: [
      {
        id: 'lab-dm-01',
        testName: 'Total Serum IgE & Eosinophil Count',
        category: 'Hematology',
        resultValue: '210',
        unit: 'IU/mL',
        referenceRange: '< 100',
        status: 'HIGH',
        performedAt: '2026-08-01T10:00:00Z',
        doctorNotes: 'Elevated IgE consistent with atopic allergic phenotype.'
      }
    ],
    clinicalTimeline: [
      {
        id: 'evt-dm-1',
        date: '2026-08-01',
        type: 'Consultation',
        title: 'Pulmonary & Asthma Control Test (ACT) Review',
        clinician: 'Attending Pulmonologist',
        facility: 'Respiratory Medicine Suite',
        soapNotes: {
          subjective: 'ACT Score 23/25. Patient uses rescue albuterol less than once weekly. No nocturnal awakenings.',
          objective: 'Lungs clear bilaterally with good air movement. No expiratory wheezing.',
          assessment: 'Moderate persistent asthma well controlled on medium-dose ICS/LABA and Montelukast.',
          plan: 'Continue current inhaler regimen. Strict avoidance of Aspirin and NSAIDs.'
        }
      }
    ],
    medicalHistory: [
      { category: 'Respiratory', description: 'Asthma diagnosed in childhood (age 8).', diagnosedDate: '1990-06-10', status: 'Active' },
      { category: 'Allergy/Immunology', description: 'Severe seasonal allergic rhinitis.', status: 'Active' }
    ],
    symptoms: [
      { symptom: 'Mild nasal congestion', severity: 'Mild', duration: 'Intermittent', onset: 'Seasonal' }
    ],
    diagnoses: [
      { icd10: 'J45.40', description: 'Moderate persistent asthma, uncomplicated', type: 'Primary', diagnosedDate: '1990-06-10', status: 'Active' },
      { icd10: 'J30.9', description: 'Allergic rhinitis, unspecified', type: 'Secondary', diagnosedDate: '2002-04-14', status: 'Active' }
    ],
    prescriptionsList: [
      { id: 'rx-dm-1', name: 'Fluticasone/Salmeterol 250/50mcg Diskus', dosage: '1 Inhalation', frequency: 'Twice Daily (Morning and Evening)', route: 'Inhalation', prescribedDate: '2026-08-01', prescribedBy: 'Dr. Alexandra Chen, MD', status: 'Active', refillsRemaining: 5 },
      { id: 'rx-dm-2', name: 'Albuterol HFA 90mcg Inhaler', dosage: '2 Puffs', frequency: 'Every 4-6 Hours PRN Wheeze/Dyspnea', route: 'Inhalation', prescribedDate: '2026-08-01', prescribedBy: 'Dr. Alexandra Chen, MD', status: 'Active', refillsRemaining: 3 },
      { id: 'rx-dm-3', name: 'Montelukast Sodium', dosage: '10mg', frequency: 'PO Once Daily at Bedtime', route: 'Oral', prescribedDate: '2026-08-01', prescribedBy: 'Dr. Alexandra Chen, MD', status: 'Active', refillsRemaining: 5 }
    ],
    procedures: [
      { id: 'proc-dm-1', procedureName: 'Spirometry with Pre/Post Bronchodilator', date: '2026-05-18', facility: 'Pulmonary Function Lab', surgeon: 'Pulmonary Tech', status: 'Completed', notes: 'FEV1 88% predicted, FEV1/FVC 78%. Reversible airway obstruction documented.' }
    ],
    immunizations: [
      { vaccineName: 'Influenza Annual Vaccine', dateAdministered: '2025-10-01', doseNumber: 'Annual', lotNumber: 'INF-2025', facility: 'Outpatient Clinic', status: 'Up to Date' }
    ],
    hospitalizations: [],
    imagingReports: [],
    documents: [
      { id: 'doc-dm-1', title: 'Pulmonary Function Test (PFT) Complete Graph.pdf', category: 'Diagnostics', uploadedDate: '2026-05-18', fileSize: '1.2 MB', fileType: 'PDF' }
    ],
    doctorNotesList: []
  },

  // 4. Margaret Holloway (Renal & Geriatric Cardiology Focus)
  {
    id: 'PT-100719',
    name: 'Margaret Holloway',
    age: 78,
    gender: 'Female',
    mrn: 'MRN-4190823',
    bloodGroup: 'B-',
    dob: '1948-03-29',
    phone: '+1 (555) 881-2940',
    emergencyContact: {
      name: 'Robert Holloway',
      relation: 'Son',
      phone: '+1 (555) 881-3311'
    },
    status: 'High-Priority',
    criticalAlerts: [
      'IODINATED RADIOCONTRAST SEVERE CONTRAINDICATION',
      'MORPHINE HYPERSENSITIVITY',
      'CKD STAGE 3A & CHRONIC ATRIAL FIBRILLATION'
    ],
    primaryCondition: 'Chronic Kidney Disease Stage 3a & Chronic Atrial Fibrillation',
    lastVisited: '2026-08-11',
    allergies: ['Iodinated Radiocontrast Media (Severe Contrast-Induced Nephropathy)', 'Morphine (Severe Anaphylactoid Reaction)'],
    chronicConditions: [
      'Chronic Kidney Disease Stage 3a (ICD-10: N18.31)',
      'Chronic Atrial Fibrillation (ICD-10: I48.20)',
      'Hypertensive Heart Disease with Heart Failure (ICD-10: I11.0)'
    ],
    currentMedications: [
      'Apixaban (Eliquis) 2.5mg PO BID (Renally Adjusted)',
      'Metoprolol Succinate 50mg PO Daily',
      'Furosemide 20mg PO Daily'
    ],
    recentVitals: {
      bp: '144/88 mmHg',
      hr: 84,
      spo2: 96,
      temp: 97.9,
      weightKg: 66.0,
      heightCm: 156,
      bmi: 27.1,
      respiratoryRate: 17
    },
    vitalsHistory: [
      { date: '2026-01-20', systolic: 156, diastolic: 92, heartRate: 94, glucose: 108, spo2: 95 },
      { date: '2026-05-14', systolic: 148, diastolic: 90, heartRate: 88, glucose: 102, spo2: 96 },
      { date: '2026-08-11', systolic: 144, diastolic: 88, heartRate: 84, glucose: 99, spo2: 96 }
    ],
    labReports: [
      {
        id: 'lab-mh-01',
        testName: 'Serum Creatinine & eGFR',
        category: 'Metabolic',
        resultValue: '1.4',
        unit: 'mg/dL',
        referenceRange: '0.6 - 1.1',
        status: 'HIGH',
        performedAt: '2026-08-11T09:00:00Z',
        doctorNotes: 'eGFR 48 mL/min/1.73m2. Stage 3a CKD stable.'
      },
      {
        id: 'lab-mh-02',
        testName: 'NT-proBNP (N-Terminal Pro-B-Type Natriuretic Peptide)',
        category: 'Cardiology',
        resultValue: '480',
        unit: 'pg/mL',
        referenceRange: '< 450',
        status: 'HIGH',
        performedAt: '2026-08-11T09:00:00Z',
        doctorNotes: 'Mild elevation consistent with chronic AFib and stage 3a CKD. Clinically euvolemic.'
      }
    ],
    clinicalTimeline: [
      {
        id: 'evt-mh-1',
        date: '2026-08-11',
        type: 'Consultation',
        title: 'Geriatric Cardio-Renal Co-Management Consultation',
        clinician: 'Attending Cardiologist',
        facility: 'Cardio-Renal Clinic',
        soapNotes: {
          subjective: 'Patient reports trace bilateral ankle edema in evenings, resolved upon elevation. No orthopnea or PND.',
          objective: 'Irregularly irregular heart rhythm with rate ~84 bpm. JVP normal. Lungs clear.',
          assessment: 'Chronic AFib on reduced-dose Apixaban for CKD. Moderate blood pressure elevation.',
          plan: 'Continue Apixaban 2.5mg BID, Metoprolol 50mg, Furosemide 20mg. Strict avoidance of contrast studies and NSAIDs.'
        }
      }
    ],
    medicalHistory: [
      { category: 'Cardiovascular', description: 'Chronic Atrial Fibrillation diagnosed 2019. CHA2DS2-VASc = 4.', diagnosedDate: '2019-02-11', status: 'Active' },
      { category: 'Renal', description: 'CKD Stage 3a secondary to hypertensive nephrosclerosis.', diagnosedDate: '2021-08-20', status: 'Active' }
    ],
    symptoms: [
      { symptom: 'Occasional mild dependent ankle edema', severity: 'Mild', duration: 'Intermittent', onset: 'Evenings' }
    ],
    diagnoses: [
      { icd10: 'N18.31', description: 'Chronic kidney disease, stage 3a', type: 'Primary', diagnosedDate: '2021-08-20', status: 'Active' },
      { icd10: 'I48.20', description: 'Chronic atrial fibrillation, unspecified', type: 'Primary', diagnosedDate: '2019-02-11', status: 'Active' },
      { icd10: 'I11.0', description: 'Hypertensive heart disease with heart failure', type: 'Secondary', diagnosedDate: '2022-01-15', status: 'Active' }
    ],
    prescriptionsList: [
      { id: 'rx-mh-1', name: 'Apixaban (Eliquis)', dosage: '2.5mg', frequency: 'PO Twice Daily', route: 'Oral', prescribedDate: '2026-08-11', prescribedBy: 'Dr. Alexandra Chen, MD', status: 'Active', refillsRemaining: 3 },
      { id: 'rx-mh-2', name: 'Metoprolol Succinate ER', dosage: '50mg', frequency: 'PO Once Daily', route: 'Oral', prescribedDate: '2026-08-11', prescribedBy: 'Dr. Alexandra Chen, MD', status: 'Active', refillsRemaining: 3 },
      { id: 'rx-mh-3', name: 'Furosemide', dosage: '20mg', frequency: 'PO Once Daily in Morning', route: 'Oral', prescribedDate: '2026-08-11', prescribedBy: 'Dr. Alexandra Chen, MD', status: 'Active', refillsRemaining: 3 }
    ],
    procedures: [
      { id: 'proc-mh-1', procedureName: '12-Lead Electrocardiogram', date: '2026-08-11', facility: 'Cardiology Clinic', surgeon: 'Cardiology Tech', status: 'Completed', notes: 'Atrial fibrillation with controlled ventricular response (~82 bpm).' }
    ],
    immunizations: [
      { vaccineName: 'Pneumococcal Polysaccharide (PPSV23)', dateAdministered: '2023-09-12', doseNumber: 'Dose 1', lotNumber: 'PP-4920', facility: 'Primary Care Center', status: 'Up to Date' }
    ],
    hospitalizations: [],
    imagingReports: [],
    documents: [],
    doctorNotesList: []
  },

  // 5. Sophia Sterling (Cardiovascular Focus)
  {
    id: 'PT-2026-903',
    name: 'Sophia Sterling',
    age: 52,
    gender: 'Female',
    mrn: 'MRN-2026-903',
    bloodGroup: 'A-',
    dob: '1974-06-19',
    phone: '+1 (555) 912-4401',
    emergencyContact: {
      name: 'Arthur Sterling',
      relation: 'Brother',
      phone: '+1 (555) 912-8877'
    },
    status: 'Active',
    criticalAlerts: [
      'SEVERE LATEX HYPERSENSITIVITY',
      'AMOXICILLIN RASH ALERT',
      'CODEINE SEVERE NAUSEA'
    ],
    primaryCondition: 'Paroxysmal Atrial Fibrillation & Mitral Valve Prolapse',
    lastVisited: '2026-08-19',
    allergies: ['Latex (Severe Contact Dermatitis / Anaphylaxis)', 'Amoxicillin', 'Codeine'],
    chronicConditions: [
      'Paroxysmal Atrial Fibrillation (ICD-10: I48.0)',
      'Nonrheumatic Mitral Valve Prolapse (ICD-10: I34.1)',
      'Primary Hypercholesterolemia (ICD-10: E78.00)'
    ],
    currentMedications: [
      'Apixaban 5mg PO BID',
      'Diltiazem CD 180mg PO Daily',
      'Losartan Potassium 50mg PO Daily'
    ],
    recentVitals: {
      bp: '124/80 mmHg',
      hr: 70,
      spo2: 98,
      temp: 98.2,
      weightKg: 62.5,
      heightCm: 168,
      bmi: 24.1,
      respiratoryRate: 14
    },
    vitalsHistory: [
      { date: '2026-02-18', systolic: 136, diastolic: 88, heartRate: 104, glucose: 98, spo2: 98 },
      { date: '2026-05-24', systolic: 128, diastolic: 82, heartRate: 82, glucose: 95, spo2: 99 },
      { date: '2026-08-19', systolic: 124, diastolic: 80, heartRate: 70, glucose: 92, spo2: 98 }
    ],
    labReports: [
      {
        id: 'lab-ss-01',
        testName: 'NT-proBNP',
        category: 'Cardiology',
        resultValue: '96',
        unit: 'pg/mL',
        referenceRange: '< 125',
        status: 'NORMAL',
        performedAt: '2026-08-16T11:00:00Z',
        doctorNotes: 'No ventricular stretch or congestive decompensation.'
      },
      {
        id: 'lab-ss-02',
        testName: 'Serum Potassium & Magnesium',
        category: 'Metabolic',
        resultValue: '4.4',
        unit: 'mEq/L',
        referenceRange: '3.5 - 5.0',
        status: 'NORMAL',
        performedAt: '2026-08-16T11:00:00Z',
        doctorNotes: 'Electrolytes within therapeutic range for rhythm control.'
      }
    ],
    clinicalTimeline: [
      {
        id: 'evt-ss-1',
        date: '2026-08-19',
        type: 'Consultation',
        title: 'Arrhythmia Tele-consultation & Holter Review',
        clinician: 'Attending Cardiologist',
        facility: 'Telemedicine Cardiology Suite',
        soapNotes: {
          subjective: 'Reviewed 14-day continuous patch monitor. Patient had one mild 2-minute palpitation episode.',
          objective: 'Normal sinus rhythm on 12-lead ECG. Low AF burden (0.4%).',
          assessment: 'Paroxysmal AF with excellent rate control.',
          plan: 'Continue Apixaban 5mg BID and Diltiazem CD 180mg daily.'
        }
      }
    ],
    medicalHistory: [
      { category: 'Cardiovascular', description: 'Mitral Valve Prolapse diagnosed 2015. Paroxysmal AFib diagnosed 2023.', status: 'Active' }
    ],
    symptoms: [
      { symptom: 'Occasional brief heart flutter', severity: 'Mild', duration: '< 2 mins', onset: 'Episodic' }
    ],
    diagnoses: [
      { icd10: 'I48.0', description: 'Paroxysmal atrial fibrillation', type: 'Primary', diagnosedDate: '2023-04-10', status: 'Active' },
      { icd10: 'I34.1', description: 'Nonrheumatic mitral valve prolapse', type: 'Secondary', diagnosedDate: '2015-08-12', status: 'Active' }
    ],
    prescriptionsList: [
      { id: 'rx-ss-1', name: 'Apixaban', dosage: '5mg', frequency: 'PO Twice Daily', route: 'Oral', prescribedDate: '2026-08-19', prescribedBy: 'Dr. Alexandra Chen, MD', status: 'Active', refillsRemaining: 5 },
      { id: 'rx-ss-2', name: 'Diltiazem CD', dosage: '180mg', frequency: 'PO Once Daily in Morning', route: 'Oral', prescribedDate: '2026-08-19', prescribedBy: 'Dr. Alexandra Chen, MD', status: 'Active', refillsRemaining: 5 }
    ],
    procedures: [],
    immunizations: [],
    hospitalizations: [],
    imagingReports: [],
    documents: [],
    doctorNotesList: []
  },

  // 6. Marcus Brody (Post-PCI & CAD Focus)
  {
    id: 'PT-2026-904',
    name: 'Marcus Brody',
    age: 61,
    gender: 'Male',
    mrn: 'MRN-2026-904',
    bloodGroup: 'AB+',
    dob: '1965-01-30',
    phone: '+1 (555) 602-9912',
    emergencyContact: {
      name: 'Helen Brody',
      relation: 'Spouse',
      phone: '+1 (555) 602-1144'
    },
    status: 'Follow-up',
    criticalAlerts: [
      'SHELLFISH / IODINE HYPERSENSITIVITY',
      'CIPROFLOXACIN TENDONITIS RISK'
    ],
    primaryCondition: 'Post-PCI Coronary Artery Disease & Dyslipidemia',
    lastVisited: '2026-08-12',
    allergies: ['Ciprofloxacin', 'Shellfish / Iodine'],
    chronicConditions: [
      'Atherosclerotic Heart Disease of Native Coronary Artery (ICD-10: I25.10)',
      'Pure Hypercholesterolemia (ICD-10: E78.00)',
      'Left Ventricular Hypertrophy (ICD-10: I51.7)'
    ],
    currentMedications: [
      'Rosuvastatin 20mg PO QHS',
      'Ezetimibe 10mg PO Daily',
      'Carvedilol 12.5mg PO BID',
      'Ramipril 5mg PO Daily'
    ],
    recentVitals: {
      bp: '126/78 mmHg',
      hr: 64,
      spo2: 98,
      temp: 98.4,
      weightKg: 84.0,
      heightCm: 180,
      bmi: 26.2,
      respiratoryRate: 16
    },
    vitalsHistory: [
      { date: '2026-01-14', systolic: 144, diastolic: 92, heartRate: 86, glucose: 110, spo2: 97 },
      { date: '2026-04-20', systolic: 138, diastolic: 86, heartRate: 78, glucose: 104, spo2: 98 },
      { date: '2026-08-12', systolic: 126, diastolic: 78, heartRate: 64, glucose: 98, spo2: 98 }
    ],
    labReports: [
      {
        id: 'lab-mb-01',
        testName: 'Lipid Panel: Triglycerides',
        category: 'Lipid',
        resultValue: '142',
        unit: 'mg/dL',
        referenceRange: '< 150',
        status: 'NORMAL',
        performedAt: '2026-08-10T09:15:00Z',
        doctorNotes: 'Triglycerides normalized.'
      },
      {
        id: 'lab-mb-02',
        testName: 'Comprehensive Metabolic Panel (CMP)',
        category: 'Metabolic',
        resultValue: '1.0',
        unit: 'mg/dL',
        referenceRange: '0.7 - 1.3',
        status: 'NORMAL',
        performedAt: '2026-08-10T09:15:00Z',
        doctorNotes: 'Liver transaminases (ALT/AST) normal on statin.'
      }
    ],
    clinicalTimeline: [
      {
        id: 'evt-mb-1',
        date: '2026-08-12',
        type: 'Consultation',
        title: 'Preventive Cardiology & Lipid Evaluation',
        clinician: 'Attending Cardiologist',
        facility: 'Cardiovascular Care Suite',
        soapNotes: {
          subjective: 'Patient walking 45 minutes daily without angina. Blood pressure well tolerated.',
          objective: 'BP 126/78, HR 64 regular. No murmurs or gallops.',
          assessment: 'Stable CAD with optimized lipid targets.',
          plan: 'Continue Rosuvastatin, Ezetimibe, Carvedilol, and Ramipril.'
        }
      }
    ],
    medicalHistory: [
      { category: 'Cardiovascular', description: 'Drug-Eluting Stent placed to proximal LAD in 2024.', diagnosedDate: '2024-05-18', status: 'Active' }
    ],
    symptoms: [],
    diagnoses: [
      { icd10: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery', type: 'Primary', diagnosedDate: '2024-05-18', status: 'Active' }
    ],
    prescriptionsList: [
      { id: 'rx-mb-1', name: 'Rosuvastatin Calcium', dosage: '20mg', frequency: 'PO Once Daily at Bedtime', route: 'Oral', prescribedDate: '2026-08-12', prescribedBy: 'Dr. Alexandra Chen, MD', status: 'Active', refillsRemaining: 5 },
      { id: 'rx-mb-2', name: 'Ezetimibe', dosage: '10mg', frequency: 'PO Once Daily', route: 'Oral', prescribedDate: '2026-08-12', prescribedBy: 'Dr. Alexandra Chen, MD', status: 'Active', refillsRemaining: 5 }
    ],
    procedures: [
      { id: 'proc-mb-1', procedureName: 'Percutaneous Coronary Intervention (PCI) with DES to LAD', date: '2024-05-18', facility: 'Cath Lab Suite 2', surgeon: 'Dr. Alexandra Chen, MD', status: 'Completed' }
    ],
    immunizations: [],
    hospitalizations: [],
    imagingReports: [],
    documents: [],
    doctorNotesList: []
  }
];

export const sampleAppointments: AppointmentItem[] = [
  {
    id: 'apt-101',
    time: '09:30 AM',
    date: 'Today',
    patientId: 'PT-2026-901',
    patientName: 'Rahul Kumar',
    mrn: 'MRN-2026-901',
    age: 34,
    gender: 'Male',
    reason: 'Follow-up for Blood Pressure & Routine Lab Review',
    type: 'Clinic (In-Person)',
    status: 'Waiting',
    priority: 'Follow-up',
    notes: 'Patient checked in at reception 10 minutes ago. Vitals recorded.',
    vitalsSummary: '138/86 mmHg • HR 82 bpm'
  },
  {
    id: 'apt-102',
    time: '10:30 AM',
    date: 'Today',
    patientId: 'PT-2026-903',
    patientName: 'Sophia Sterling',
    mrn: 'MRN-2026-903',
    age: 52,
    gender: 'Female',
    reason: 'Arrhythmia Tele-consultation & ECG Review',
    type: 'Video Call (Telemedicine)',
    status: 'In-Progress',
    priority: 'Routine',
    notes: 'Secure Telehealth encrypted room active. Patient online in waiting room.',
    vitalsSummary: '124/80 mmHg • HR 70 bpm'
  },
  {
    id: 'apt-103',
    time: '02:00 PM',
    date: 'Today',
    patientId: 'PT-2026-904',
    patientName: 'Marcus Brody',
    mrn: 'MRN-2026-904',
    age: 61,
    gender: 'Male',
    reason: 'Post-Stent Implantation & Angiography Follow-up',
    type: 'Clinic (In-Person)',
    status: 'Confirmed',
    priority: 'Follow-up',
    notes: 'Routine 6-month angiogram review.',
    vitalsSummary: '126/78 mmHg • HR 64 bpm'
  },
  {
    id: 'apt-104',
    time: '03:45 PM',
    date: 'Today',
    patientId: 'PT-100293',
    patientName: 'Eleanor Vance',
    mrn: 'MRN-8849201',
    age: 64,
    gender: 'Female',
    reason: 'Cardiovascular & Diabetes Metabolic Evaluation',
    type: 'Clinic (In-Person)',
    status: 'Confirmed',
    priority: 'High-Priority',
    notes: 'Comprehensive glycemic and renal screening checkpoint.',
    vitalsSummary: '132/84 mmHg • HR 72 bpm'
  },
  {
    id: 'apt-105',
    time: '04:30 PM',
    date: 'Today',
    patientId: 'PT-100482',
    patientName: 'David K. Miller',
    mrn: 'MRN-9201472',
    age: 42,
    gender: 'Male',
    reason: 'Asthma Management & Spirometry Review',
    type: 'Video Call (Telemedicine)',
    status: 'Confirmed',
    priority: 'Routine',
    notes: 'Review asthma control test and inhaler technique.',
    vitalsSummary: '118/76 mmHg • HR 68 bpm'
  }
];

export const sampleMessages: ClinicalMessage[] = [
  {
    id: 'msg-01',
    senderName: 'CVS Pharmacy #4928 (Rx Refills)',
    senderRole: 'Pharmacist',
    patientName: 'Rahul Kumar',
    subject: 'Refill Authorization: Lisinopril 10mg',
    message: 'Patient is requesting 90-day refill for Lisinopril 10mg. Please sign authorization digitally.',
    timestamp: '20 mins ago',
    unread: true,
    tag: 'Prescription Refill'
  },
  {
    id: 'msg-02',
    senderName: 'Dr. Robert Harrison (Orthopedic Surgery)',
    senderRole: 'Specialist',
    patientName: 'Eleanor Vance',
    subject: 'Cardiac Clearance for Elective Knee Arthroscopy',
    message: 'Requesting formal cardiology clearance and DAPT management recommendations prior to procedure.',
    timestamp: '1 hour ago',
    unread: true,
    tag: 'Urgent'
  },
  {
    id: 'msg-03',
    senderName: 'Sophia Sterling',
    senderRole: 'Patient',
    patientName: 'Sophia Sterling',
    subject: 'Question on Apixaban timing with morning coffee',
    message: 'Dr. Chen, is it acceptable to take my morning dose with coffee or should I wait 30 minutes after breakfast?',
    timestamp: '3 hours ago',
    unread: false,
    tag: 'General'
  }
];

export const sampleBillingClaims: BillingClaim[] = [
  {
    id: 'CLM-88910',
    patientName: 'Rahul Kumar',
    mrn: 'MRN-2026-901',
    dateOfService: '2026-08-07',
    cptCode: '99214',
    cptDescription: 'Office/Outpatient Visit, Established Patient, Moderate Complexity',
    icd10Code: 'I10',
    icd10Description: 'Essential (primary) hypertension',
    feeAmount: 185.00,
    insurancePayer: 'Blue Cross Blue Shield',
    claimStatus: 'SUBMITTED'
  },
  {
    id: 'CLM-88911',
    patientName: 'Eleanor Vance',
    mrn: 'MRN-8849201',
    dateOfService: '2026-07-14',
    cptCode: '93000',
    cptDescription: 'Electrocardiogram, Routine ECG with at least 12 leads',
    icd10Code: 'I10',
    icd10Description: 'Essential hypertension & Type 2 Diabetes',
    feeAmount: 195.00,
    insurancePayer: 'Aetna Commercial PPO',
    claimStatus: 'PAID'
  },
  {
    id: 'CLM-88912',
    patientName: 'Sophia Sterling',
    mrn: 'MRN-2026-903',
    dateOfService: '2026-08-19',
    cptCode: '99442',
    cptDescription: 'Telephone / Telehealth Medical Evaluation 11-20 mins',
    icd10Code: 'I48.0',
    icd10Description: 'Paroxysmal atrial fibrillation',
    feeAmount: 145.00,
    insurancePayer: 'UnitedHealthcare',
    claimStatus: 'PAID'
  },
  {
    id: 'CLM-88913',
    patientName: 'Marcus Brody',
    mrn: 'MRN-2026-904',
    dateOfService: '2026-08-12',
    cptCode: '99213',
    cptDescription: 'Office/Outpatient Visit, Established Patient, Low-Moderate',
    icd10Code: 'I25.10',
    icd10Description: 'Atherosclerotic heart disease of native coronary artery',
    feeAmount: 130.00,
    insurancePayer: 'Medicare Part B',
    claimStatus: 'SUBMITTED'
  }
];

export const sampleNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Flagged Lab Result: Rahul Kumar',
    description: 'Elevated Fasting Lipid Panel (LDL 124 mg/dL) requires clinical review.',
    type: 'CRITICAL_LAB',
    timeAgo: '15m ago',
    read: false,
    actionRequired: true
  },
  {
    id: 'notif-2',
    title: 'Prescription Refill Request',
    description: 'CVS Pharmacy submitted digital refill request for Lisinopril 10mg.',
    type: 'PHARMACY',
    timeAgo: '45m ago',
    read: false,
    actionRequired: true
  },
  {
    id: 'notif-3',
    title: 'State Medical Board Sync Succeeded',
    description: 'NPI 1982736410 verified in active standing with California Medical Board.',
    type: 'BOARD_AUDIT',
    timeAgo: '2h ago',
    read: true,
    actionRequired: false
  }
];
