import { ClinicalPrescriptionRecord } from '../types/clinicalPrescription';

export const INITIAL_CLINICAL_PRESCRIPTIONS: ClinicalPrescriptionRecord[] = [
  {
    id: 'RX-2026-8812',
    patientId: 'PT-100292',
    patientName: 'Rahul Kumar',
    title: 'Hypertension & Cardiovascular Maintenance Regimen',
    doctorName: 'Dr. Alexandra Chen, MD, FACC',
    doctorRegNo: 'MCI-748920-CARD',
    doctorSpecialty: 'Cardiology & Preventive Medicine',
    hospitalClinic: 'Apex Multispecialty Hospital & Heart Institute',
    department: 'Outpatient Cardiology Pavilion',
    prescriptionDate: '2026-08-07',
    validUntil: '2026-11-07',
    status: 'Active',
    diagnosis: 'Essential (Primary) Hypertension with Mild Sinus Tachycardia',
    icdCode: 'I10, R00.0',
    medications: [
      {
        id: 'med-rx-1',
        name: 'Lisinopril',
        dosage: '10mg',
        form: 'Tablet',
        frequency: 'Once Daily (Morning)',
        timing: 'After Meals',
        duration: '90 Days',
        refillsRemaining: 3,
        instructions: 'Take every morning with a glass of water. Monitor blood pressure weekly in seated position.'
      },
      {
        id: 'med-rx-2',
        name: 'Metoprolol Succinate ER',
        dosage: '25mg',
        form: 'Tablet',
        frequency: 'Once Daily (Morning)',
        timing: 'With Meals',
        duration: '90 Days',
        refillsRemaining: 3,
        instructions: 'Do not crush or chew extended-release tablet. Avoid sudden discontinuation.'
      },
      {
        id: 'med-rx-3',
        name: 'Omega-3 Acid Ethyl Esters',
        dosage: '1000mg',
        form: 'Capsule',
        frequency: 'Once Daily',
        timing: 'After Meals',
        duration: '90 Days',
        refillsRemaining: 3,
        instructions: 'Cardioprotective lipid support. Take with principal meal.'
      }
    ],
    clinicalNotes: 'Blood pressure response stable on current ACE inhibitor and beta blocker. Patient advised to maintain DASH diet, keep sodium < 2000mg/day, and repeat basic metabolic panel in 3 months.',
    source: 'FILE_UPLOAD',
    pages: [
      {
        id: 'page-1',
        pageNumber: 1,
        fileName: 'Apex_Cardiology_Prescription_Page1.pdf',
        fileSize: '480 KB',
        fileType: 'application/pdf',
        previewUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
        uploadedAt: '2026-08-07T11:20:00Z'
      }
    ],
    isVerifiedByClinician: true,
    verifiedBy: 'Dr. Alexandra Chen, MD',
    verifiedAt: '2026-08-07T11:25:00Z',
    createdAt: '2026-08-07T11:20:00Z',
    tags: ['Cardiology', 'Hypertension', 'Daily Maintenance']
  },
  {
    id: 'RX-2026-4491',
    patientId: 'PT-100292',
    patientName: 'Rahul Kumar',
    title: 'Acute Viral Pharyngitis & Respiratory Comfort Plan',
    doctorName: 'Dr. Marcus Vance, MD',
    doctorRegNo: 'MCI-559102-GEN',
    doctorSpecialty: 'Internal & Family Medicine',
    hospitalClinic: 'City Health Family Care Center',
    department: 'General Outpatient Clinic',
    prescriptionDate: '2026-05-14',
    validUntil: '2026-05-28',
    status: 'Completed',
    diagnosis: 'Acute Viral Pharyngitis & Upper Respiratory Congestion',
    icdCode: 'J02.9',
    medications: [
      {
        id: 'med-rx-4',
        name: 'Paracetamol / Acetaminophen',
        dosage: '650mg',
        form: 'Tablet',
        frequency: 'Every 6-8 Hours PRN',
        timing: 'After Meals',
        duration: '5 Days',
        refillsRemaining: 0,
        instructions: 'Take for fever or throat discomfort. Do not exceed 3000mg total per 24 hours.'
      },
      {
        id: 'med-rx-5',
        name: 'Levocetirizine HCl',
        dosage: '5mg',
        form: 'Tablet',
        frequency: 'Once Daily at Night',
        timing: 'At Bedtime',
        duration: '7 Days',
        refillsRemaining: 0,
        instructions: 'For allergic rhinitis and nasal drip. May cause mild drowsiness.'
      }
    ],
    clinicalNotes: 'Viral etiology confirmed. Warm saline gargles 3x daily. Adequate hydration (2.5L/day). Return if fever persists beyond 72 hours.',
    source: 'CAMERA_CAPTURE',
    pages: [
      {
        id: 'page-2',
        pageNumber: 1,
        fileName: 'CityHealth_Prescription_Snapshot_1.jpg',
        fileSize: '1.2 MB',
        fileType: 'image/jpeg',
        previewUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
        capturedViaCamera: true,
        uploadedAt: '2026-05-14T14:30:00Z'
      }
    ],
    isVerifiedByClinician: true,
    verifiedBy: 'Dr. Marcus Vance, MD',
    verifiedAt: '2026-05-14T14:35:00Z',
    createdAt: '2026-05-14T14:30:00Z',
    tags: ['Respiratory', 'ENT', 'Short Course']
  },
  {
    id: 'RX-2026-9920',
    patientId: 'PT-100293',
    patientName: 'Eleanor Vance',
    title: 'Comprehensive Diabetic & Renal Protection Protocol',
    doctorName: 'Dr. Sarah Jenkins, MD, FASN',
    doctorRegNo: 'MCI-882019-NEPH',
    doctorSpecialty: 'Endocrinology & Nephrology',
    hospitalClinic: 'Metro Kidney & Endocrine Institute',
    department: 'Diabetic Nephropathy Clinic',
    prescriptionDate: '2026-07-14',
    validUntil: '2026-10-14',
    status: 'Active',
    diagnosis: 'Type 2 Diabetes Mellitus with Stage 2 Hypertension',
    icdCode: 'E11.9, I10',
    medications: [
      {
        id: 'med-rx-6',
        name: 'Metformin HCl ER',
        dosage: '1000mg',
        form: 'Tablet',
        frequency: 'Twice Daily (Morning & Dinner)',
        timing: 'With Meals',
        duration: '90 Days',
        refillsRemaining: 2,
        instructions: 'Take immediately after principal meals to minimize gastrointestinal discomfort.'
      },
      {
        id: 'med-rx-7',
        name: 'Empagliflozin',
        dosage: '10mg',
        form: 'Tablet',
        frequency: 'Once Daily (Morning)',
        timing: 'Before Meals',
        duration: '90 Days',
        refillsRemaining: 2,
        instructions: 'Cardiorenal protection. Ensure adequate hydration throughout the daytime.'
      },
      {
        id: 'med-rx-8',
        name: 'Atorvastatin Calcium',
        dosage: '40mg',
        form: 'Tablet',
        frequency: 'Once Daily at Night',
        timing: 'At Bedtime',
        duration: '90 Days',
        refillsRemaining: 2,
        instructions: 'Lipid stabilization. Report any unexplained muscle soreness immediately.'
      }
    ],
    clinicalNotes: 'HbA1c target 6.8%. Fasting glucose logging daily. Avoid all penicillin class medications due to documented anaphylaxis history.',
    source: 'GOOGLE_DRIVE',
    driveDocId: 'DRIVE_DOC_882019_METRO',
    pages: [
      {
        id: 'page-3',
        pageNumber: 1,
        fileName: 'Metro_Endocrine_Prescription_Drive_Doc.pdf',
        fileSize: '620 KB',
        fileType: 'application/pdf',
        previewUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
        driveUrl: 'https://drive.google.com/file/d/1X9a8B7c6D5e4F3g2H1i/view',
        uploadedAt: '2026-07-14T09:00:00Z'
      }
    ],
    isVerifiedByClinician: true,
    verifiedBy: 'Dr. Sarah Jenkins, MD',
    verifiedAt: '2026-07-14T09:10:00Z',
    createdAt: '2026-07-14T09:00:00Z',
    tags: ['Diabetes', 'Nephrology', 'Endocrinology']
  }
];
