export type ModalityCategory =
  | 'Radiology & Radiation Oncology'
  | 'Critical Care & Life Support'
  | 'Surgical & OT Workstations'
  | 'Cardiology & Hybrid Cath Lab'
  | 'Dialysis & Renal Care'
  | 'Pathology & Central Diagnostics'
  | 'Endoscopy & Minimally Invasive'
  | 'Neonatal & Maternal Care'
  | 'General Biomedical & Infusion';

export type CriticalityTier =
  | 'Tier 1: Life Support (Immediate Danger if Down)'
  | 'Tier 2: Critical Diagnostic & Surgical'
  | 'Tier 3: Supportive Clinical Device';

export type AssetOperationalStatus =
  | 'Operational & Calibrated'
  | 'PPM Due / Scheduled'
  | 'Under Breakdown Maintenance'
  | 'Calibration Expired'
  | 'Standby / Redundant Backup'
  | 'Decommissioned / Quarantined';

export type MaintenanceContractType =
  | 'Comprehensive AMC (CAMC)'
  | 'Non-Comprehensive AMC'
  | 'CMC (Parts & Labor Inclusive)'
  | 'OEM Direct Warranty'
  | 'In-House Biomedical Engineering';

export interface AerbRadiationRecord {
  licenseNo: string;
  eloraRegistrationId: string;
  validUntil: string;
  qaSurveyPassed: boolean;
  lastSurveyDate: string;
  leadApronTested: boolean;
  maxDoseRateMicroSvHr: number;
}

export interface ElectricalSafetyRecord {
  standard: 'IEC 62353' | 'IEC 60601-1';
  earthResistanceOhms: number; // Max 0.2-0.3 Ohms
  earthLeakageCurrentMicroAmps: number; // Max 500 uA
  enclosureLeakageCurrentMicroAmps: number; // Max 100 uA
  patientLeakageCurrentMicroAmps?: number; // Max 10-50 uA for CF
  testDate: string;
  testedBy: string;
  passed: boolean;
}

export interface CalibrationParameter {
  parameterName: string;
  nominalValue: string;
  measuredValue: string;
  tolerance: string;
  unit: string;
  status: 'Pass' | 'Fail' | 'Marginal';
}

export interface BiomedicalAsset {
  id: string;
  hospitalId: string;
  assetTag: string; // e.g., "BME-RAD-001"
  barcode: string;
  assetName: string;
  modalityCategory: ModalityCategory;
  criticalityTier: CriticalityTier;
  manufacturer: string;
  model: string;
  serialNumber: string;
  
  // Location
  departmentId: string;
  departmentName: string;
  roomLocation: string;
  floorWing: string;

  // Lifecycle & Financials
  commissioningDate: string;
  purchaseCost: number;
  currentBookValue: number;
  expectedLifespanYears: number;

  // Status & Telemetry
  operationalStatus: AssetOperationalStatus;
  uptimePercentage: number; // e.g. 99.7%
  riskScore: number; // 1 to 100
  cryogenHeliumLevelPercent?: number; // For MRI (e.g. 88%)
  tubeUsageSecondsOrScans?: number; // For CT/Cath Lab

  // Maintenance & Governance
  contractType: MaintenanceContractType;
  vendorName: string;
  vendorContactPhone: string;
  vendorEmail: string;
  contractExpiryDate: string;

  // PPM
  ppmFrequency: 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual';
  lastPpmDate: string;
  nextPpmDate: string;
  assignedBioEngineer: string;

  // Safety & Compliance
  aerbRadiationCompliance?: AerbRadiationRecord;
  electricalSafetyTesting?: ElectricalSafetyRecord;
  calibrationTraceabilityCert?: string;
}

export interface PpmChecklistItem {
  id: string;
  title: string;
  category: 'Visual & Mechanical' | 'Electrical Safety' | 'Calibration & Output' | 'Consumables & Filters' | 'Alarm & Safety Cutoff';
  passed: boolean;
  notes?: string;
}

export interface PpmScheduleRecord {
  id: string; // e.g. "PPM-2026-081"
  hospitalId: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  department: string;
  location: string;
  scheduledDate: string;
  dueMonth: string;
  frequency: 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual';
  status: 'Scheduled' | 'Due Today' | 'Overdue' | 'In Progress' | 'Completed - Passed' | 'Completed - Conditional Pass' | 'Failed - Out of Service';
  assignedTechnician: string;
  checklist: PpmChecklistItem[];
  completedDate?: string;
  engineerNotes?: string;
  partsReplaced?: string[];
  calibrationValues?: CalibrationParameter[];
  digitalSignOff?: {
    engineerName: string;
    signTimestamp: string;
    certificateId: string;
  };
}

export interface BreakdownWorkOrder {
  id: string; // e.g. "WO-BD-2026-019"
  hospitalId: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  department: string;
  location: string;
  reportedBy: string;
  reportedAt: string;
  priority:
    | 'Code Red - STAT (Life Support Failure)'
    | 'High Priority (OR / Diagnostic Interrupted)'
    | 'Medium Priority (Backup Unit Available)'
    | 'Low / Routine';
  symptomDescription: string;
  errorCode?: string;
  status:
    | 'Open - Awaiting Triage'
    | 'BME Dispatched'
    | 'Diagnosis In Progress'
    | 'Awaiting OEM Spare Part'
    | 'Testing & Calibration'
    | 'Resolved & Restored'
    | 'Closed';
  assignedEngineer: string;
  slaTargetMinutes: number;
  slaBreached: boolean;
  rootCause?: string;
  actionTaken?: string;
  downtimeMinutes: number;
  totalCostIncurred: number;
  resolvedAt?: string;
}

export interface BiomedicalSparePart {
  id: string;
  partNumber: string;
  partName: string;
  compatibleModality: ModalityCategory;
  compatibleModels: string[];
  stockQuantity: number;
  reorderLevel: number;
  unitCost: number;
  storageBin: string;
  supplier: string;
  leadTimeDays: number;
}

export interface RadiationSafetyLog {
  id: string;
  roomName: string;
  modality: string;
  aerbLicenseNo: string;
  leadGlassShieldingMm: number;
  ambientRadiationDoseMicroSvHr: number;
  leakageSurveyStatus: 'Compliant' | 'Inspection Due' | 'Exceeds Safety Threshold';
  leadApronAuditDate: string;
  totalApronsTested: number;
  apronsDefective: number;
  officerInCharge: string;
}
