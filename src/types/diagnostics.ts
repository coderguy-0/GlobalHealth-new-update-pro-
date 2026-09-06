// ==========================================================
// ENTERPRISE LABORATORY & ADVANCED IMAGING SUBSYSTEM TYPES
// NABL ISO-15189 & AERB COMPLIANT
// ==========================================================

export type LabCategory =
  | 'Biochemistry'
  | 'Hematology'
  | 'Microbiology'
  | 'Histopathology'
  | 'Serology'
  | 'Molecular';

export type SpecimenType =
  | 'Serum'
  | 'Whole Blood (EDTA)'
  | 'Plasma (Citrate)'
  | 'Plasma (Heparin)'
  | 'Plasma (Fluoride)'
  | 'Urine (Spot/24hr)'
  | 'CSF'
  | 'Biopsy Tissue'
  | 'Swab / Exudate'
  | 'Synovial / Serous Fluid';

export type VacutainerCapColor =
  | 'Purple / Lavender (K2-EDTA)'
  | 'Light Blue (Sodium Citrate)'
  | 'Red / Gold (Clot + Gel)'
  | 'Green (Lithium Heparin)'
  | 'Grey (Sodium Fluoride)'
  | 'Yellow (ACD Solution)'
  | 'Royal Blue (Trace Elements)';

export type ImagingModalityCode =
  | 'MRI'
  | 'CT'
  | 'DR'
  | 'USG'
  | 'MAMMO'
  | 'DEXA'
  | 'PET-CT'
  | 'FLUORO';

export type BodyRegion =
  | 'Head & Neck'
  | 'Thorax / Chest'
  | 'Abdomen & Pelvis'
  | 'Musculoskeletal'
  | 'Spine'
  | 'Cardiac'
  | 'Whole Body';

export type OrderPriority = 'ROUTINE' | 'URGENT' | 'EMERGENCY STAT';

export type DiagnosticOrderStatus =
  | 'Requisitioned'
  | 'Sample Collected'
  | 'Processing on Analyzer'
  | 'Report Verified'
  | 'Critical Panic Alert Triggered';

// ==========================================================
// 1. PATHOLOGY LABORATORY TEST FORMULARY
// ==========================================================
export interface LabTestMaster {
  id: string;                         // e.g. "LAB-BIO-001"
  hospitalId: string;                 // FK -> HospitalFacility.id
  testCode: string;                   // CPT / LOINC Code: "LOINC-2951-2"
  name: string;                       // "High-Sensitivity Cardiac Troponin-I (hs-cTnI)"
  category: LabCategory;
  specimenType: SpecimenType;
  vacutainerCapColor: VacutainerCapColor;
  standardTurnaroundMinutes: number;  // Routine TAT: 120 mins
  statTurnaroundMinutes: number;      // Emergency STAT TAT: 30 mins
  nablAccredited: boolean;            // ISO 15189 certified
  price: number;                      // Direct Patient Tariff (INR)
  criticalLowThreshold?: number;      // Panic Value Low Trigger
  criticalHighThreshold?: number;     // Panic Value High Trigger: e.g. >0.04 ng/mL for Troponin
  normalRangeMale: string;            // "< 0.014 ng/mL"
  normalRangeFemale: string;          // "< 0.014 ng/mL"
  unitOfMeasure: string;              // "ng/mL", "mg/dL", "mmol/L"
  methodology: string;                // "Chemiluminescence Immunoassay (CLIA)"
  analyzersAvailable: string[];       // ["Roche Cobas e411", "Abbott Architect i2000SR"]
  fastingRequired?: boolean;
  instructions?: string;
  activeTodayCount?: number;
}

// ==========================================================
// 2. ADVANCED RADIOLOGY & IMAGING SERVICE MASTER
// ==========================================================
export interface ImagingServiceMaster {
  id: string;                         // e.g. "IMG-RAD-004"
  hospitalId: string;                 // FK -> HospitalFacility.id
  modalityCode: ImagingModalityCode;
  name: string;                       // "128-Slice Contrast-Enhanced CT Brain & Angiogram"
  bodyRegion: BodyRegion;
  aerbLicenseNo: string;              // Atomic Energy Regulatory Board: "AERB/DR/2024/9912"
  contrastRequired: boolean;          // Requires IV Iodinated / Gadolinium Contrast
  creatininePreCheckRequired: boolean;// Mandatory Renal Function Test prior to contrast
  radiationDoseEstimate: string;      // "2.1 mSv (Low-Dose Iterative Reconstruction)"
  averageScanDurationMinutes: number; // 15 mins
  price: number;                      // Direct Tariff (INR)
  scannerModel: string;               // "Siemens SOMATOM Definition Edge 128"
  roomSuite: string;                  // "Radiology Suite R-02 (Ground Floor)"
  leadShieldingThickness: string;     // "2.0 mm Pb Equivalent (BARC Approved)"
  pacsStoragePath: string;            // DICOM Server node / AE Title: "APEX_CT_NODE1"
  sliceProtocols?: string[];          // ["Axial 0.6mm", "Coronal MIP", "Sagittal MPR", "3D Volume Render"]
  todayScheduledCount?: number;
  operationalStatus?: 'Online & Operational' | 'Calibration / Maintenance' | 'Offline';
}

// ==========================================================
// 3. DIAGNOSTIC REQUISITION & PATIENT REPORT
// ==========================================================
export interface DiagnosticOrder {
  orderId: string;                    // PK: e.g. "ORD-2026-99021"
  hospitalId: string;
  patientId: string;                  // MRN: "MRN-2026-1189"
  patientName: string;
  patientAgeGender: string;           // "54Y / Male"
  patientLocation?: string;           // "ICU-Bed-04" | "OPD Room 204" | "ER Trauma Bay 2"
  orderingDoctorName: string;         // "Dr. Vikram Sethi (Cardiology)"
  priority: OrderPriority;
  orderType: 'LABORATORY' | 'IMAGING';
  targetServiceId: string;            // FK -> LabTestMaster or ImagingServiceMaster
  serviceName: string;
  serviceCode: string;
  specimenBarcode?: string;           // "BAR-88910023"
  vacutainerColor?: VacutainerCapColor;
  requisitionTimestamp: string;
  sampleCollectedTimestamp?: string;
  resultGeneratedTimestamp?: string;
  verifiedByDoctor?: string;          // Pathologist / Radiologist Sign-Off
  status: DiagnosticOrderStatus;
  quantitativeValue?: string;
  unitOfMeasure?: string;
  normalRange?: string;
  isPanicValue?: boolean;
  panicValueNote?: string;
  radiologyDicomStudyUid?: string;    // "1.2.840.113619.2.55.3.2831164.8812"
  pacsPresetId?: 'CXR' | 'CT_BRAIN' | 'MRI_SPINE' | 'ANGIO';
  findingsReport?: string;
  impression?: string;
  tatRemainingMinutes?: number;
}

// ==========================================================
// 4. SPECIMEN CONTAINER & ANALYZER REFERENCE
// ==========================================================
export interface SpecimenTubeSpec {
  colorName: string;
  hexColor: string;
  capRingColor: string;
  additive: string;
  specimenGenerated: string;
  primaryApplications: string[];
  drawVolume: string;
  inversionsCount: string;
  sampleAnalyzers: string[];
}

// ==========================================================
// 5. REGULATORY RADIATION & QUALITY AUDIT LOG
// ==========================================================
export interface RegulatorySafetyRecord {
  id: string;
  hospitalId: string;
  entityName: string;                 // "Suite R-01 (Siemens SOMATOM 128 CT)"
  category: 'AERB Radiation Safety' | 'BARC Lead Shielding' | 'NABL ISO-15189 Calibration' | 'Staff Dosimeter TLD';
  licenseNumber: string;
  inspectorName: string;
  lastAuditDate: string;
  nextRenewalDate: string;
  status: 'Compliant & Valid' | 'Renewal Window' | 'Pending Verification';
  recordedDoseOrMetric: string;       // "0.18 mSv/quarter (Limit < 20 mSv/yr)" or "2.0 mm Pb Eq."
  complianceNotes: string;
}
