export type DoctorApplicationStatus =
  | 'PENDING_REVIEW'
  | 'UNDER_REVIEW'
  | 'ADDITIONAL_INFO_REQUIRED'
  | 'APPROVED_NOT_ACTIVATED'
  | 'ACTIVATION_SENT'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'REJECTED'
  | 'DEACTIVATED';

export interface DoctorApplicationDocument {
  id: string;
  category:
    | 'Medical Registration Certificate'
    | 'Degree & Specialization Certificate'
    | 'State Medical Board License'
    | 'Hospital Appointment Letter'
    | 'National Identity Document'
    | 'DEA / Controlled Substances Registration'
    | 'Other Supporting Credential';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  verified: boolean;
  fileHash: string;
  previewUrl?: string;
}

export interface DoctorApplication {
  id: string; // e.g. "DOC-REQ-2026-0814"
  // Personal Information
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  photoUrl?: string;

  // Professional Information
  medicalRegistrationNumber: string; // e.g. "MB-CA-948271" or "NMC-849201"
  medicalCouncil: string; // e.g. "Medical Board of California", "National Medical Commission"
  qualification: string; // e.g. "MBBS, MD (Cardiology), DM, FSCAI"
  primarySpecialization: string; // e.g. "Interventional Cardiology"
  subSpecialization?: string; // e.g. "Structural Heart Disease"
  yearsOfExperience: number;
  designation: string; // e.g. "Chief Consultant Cardiologist"
  department: string; // e.g. "Cardiovascular & Thoracic Sciences"
  employmentType: 'Full-Time' | 'Visiting Consultant' | 'Honorary' | 'Clinical Fellow' | 'Resident';

  // Contact Information
  officialEmail: string; // e.g. "a.chen@hopkinshealth.org"
  professionalPhone: string;
  emergencyContact?: string;

  // Hospital Affiliation
  hospitalId: string; // e.g. "hosp-apex-01"
  hospitalName: string; // e.g. "Apex Institute of Medical Sciences"
  hospitalBranchLocation: string; // e.g. "Central Medical Campus, Sector 4"
  joiningDate: string;

  // Documents
  documents: DoctorApplicationDocument[];

  // Applicant Declaration
  declarationCertified: boolean;
  declarationDate: string;

  // Status & Review Workflow
  status: DoctorApplicationStatus;
  submissionDate: string;
  assignedReviewer?: string;
  reviewerRole?: string;
  reviewerNotes?: string;
  reviewedAt?: string;
  approvalTimestamp?: string;
  rejectionReason?: string;
  additionalInfoRequiredNotes?: string;

  // Activation Info
  activationToken?: string;
  activationTokenExpiresAt?: string;
  createdUsername?: string;
}

export interface DoctorAccount {
  id: string; // "doc-acc-101"
  doctorId: string; // "doc-alexandra-chen"
  applicationId: string; // "DOC-REQ-2026-0001"
  username: string; // e.g. "doc_alex_chen" (unique)
  fullName: string;
  role: 'Doctor' | 'Senior Doctor' | 'Consultant' | 'Specialist' | 'Department Head' | 'Medical Administrator';
  speciality: string;
  hospitalId: string;
  hospitalName: string;
  department: string;
  officialEmail: string;
  passwordHash: string; // Simulated SHA-256 hash
  passwordSalt: string;
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  lastLogin?: string;
  failedLoginAttempts: number;
  lockoutUntil?: string | null;
  twoFactorEnabled: boolean;
  createdTimestamp: string;
  updatedTimestamp: string;
}

export interface DoctorActivationToken {
  token: string; // e.g. "ACT-DOC-2026-CHEN-88F9"
  applicationId: string;
  doctorName: string;
  hospitalName: string;
  officialEmail: string;
  issuedAt: string;
  expiresAt: string;
  isUsed: boolean;
  usedAt?: string | null;
  isRevoked: boolean;
}

export interface DoctorPasswordResetToken {
  token: string; // e.g. "RST-DOC-98231-774B"
  username: string;
  officialEmail: string;
  issuedAt: string;
  expiresAt: string;
  isUsed: boolean;
  usedAt?: string | null;
  isRevoked: boolean;
}

export interface DoctorAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  targetDoctorId?: string;
  targetDoctorName?: string;
  targetHospitalName?: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  ipAddress: string;
  details: string;
}

export interface DoctorAuthSession {
  token: string;
  account: DoctorAccount;
  doctorProfileId: string;
  loginTime: string;
  expiresAt: string;
}
