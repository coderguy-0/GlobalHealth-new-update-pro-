export type PrescriptionSourceType = 'FILE_UPLOAD' | 'CAMERA_CAPTURE' | 'GOOGLE_DRIVE' | 'CLINICIAN_ENTERED';

export type PrescriptionStatus = 'Active' | 'Completed' | 'Refill Due' | 'Archived';

export interface PrescribedMedicationEntry {
  id: string;
  name: string;
  dosage: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Inhaler' | 'Injection' | 'Drops' | 'Ointment' | 'Other';
  frequency: string;
  timing: 'Before Meals' | 'After Meals' | 'With Meals' | 'At Bedtime' | 'As Needed (PRN)';
  duration: string;
  refillsRemaining: number;
  instructions: string;
}

export interface PrescriptionPageItem {
  id: string;
  pageNumber: number;
  fileName: string;
  fileSize: string;
  fileType: 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf' | 'google_doc';
  previewUrl: string;
  driveUrl?: string;
  capturedViaCamera?: boolean;
  uploadedAt: string;
}

export interface ClinicalPrescriptionRecord {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  doctorName: string;
  doctorRegNo: string;
  doctorSpecialty: string;
  hospitalClinic: string;
  department: string;
  prescriptionDate: string;
  validUntil: string;
  status: PrescriptionStatus;
  diagnosis: string;
  icdCode?: string;
  medications: PrescribedMedicationEntry[];
  clinicalNotes: string;
  source: PrescriptionSourceType;
  pages: PrescriptionPageItem[];
  driveDocId?: string;
  isVerifiedByClinician: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  tags: string[];
}
