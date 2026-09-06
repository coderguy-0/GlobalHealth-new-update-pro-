// GlobalHealth Enterprise - Extended Pharmacy & Formulary Subsystem Types

export type FormularyStatus =
  | 'Formulary Approved'
  | 'Restricted / Prior Auth'
  | 'Specialist Only'
  | 'Department Restricted'
  | 'Emergency Use Only'
  | 'Non-Formulary'
  | 'Under Review'
  | 'Quarantined / Suspended'
  | 'Recalled';

export type TherapeuticClass =
  | 'Antimicrobial / Antibiotic Stewardship'
  | 'Cardiovascular & Antithrombotic'
  | 'Critical Care & Vasopressors'
  | 'Analgesics & Controlled Narcotics (Schedule X/H1)'
  | 'Anesthesia & Neuromuscular Blockers'
  | 'Oncology & Chemotherapy (BCOP Protocol)'
  | 'Endocrine & Metabolic'
  | 'Gastrointestinal & Antiulcer'
  | 'Respiratory & Bronchodilators'
  | 'IV Fluids & Total Parenteral Nutrition (TPN)'
  | 'Emergency Antidotes & Toxicology';

export type PharmacyLocation =
  | 'Central Pharmacy Vault'
  | 'ICU Satellite Pharmacy'
  | 'Emergency Trauma Bay Pharmacy'
  | 'Operating Theatre (OT) Satellite'
  | 'Oncology Cleanroom / Infusion'
  | 'Inpatient Ward Stock (Floors 1-5)'
  | 'Cold-Chain Biologicals Storage (2-8°C)'
  | 'Quarantine & Disposal Holding';

export type DispensingStatus =
  | 'Received / Queued'
  | 'Under Clinical Verification'
  | 'Preparing / Compounding'
  | 'Ready for Dispensing'
  | 'Dispensed / Administered'
  | 'On Hold / Clarification Needed'
  | 'Cancelled';

export type OrderPriority = 'STAT / Emergency (<15m)' | 'Urgent (<1h)' | 'Priority (<3h)' | 'Routine Inpatient';

export type BatchStatus = 'Available' | 'Reserved' | 'Quarantined' | 'Expiring Soon' | 'Expired' | 'Recalled' | 'Disposed';

export interface MedicationBatch {
  id: string;
  drugId: string;
  batchNumber: string;
  barcode: string;
  manufacturer: string;
  supplierName: string;
  purchaseOrderId?: string;
  mfgDate: string;
  expiryDate: string;
  receivedDate: string;
  quantityReceived: number;
  quantityAvailable: number;
  quantityReserved: number;
  quantityDispensed: number;
  currentLocation: PharmacyLocation;
  storageCondition: 'Room Temp (15-25°C)' | 'Refrigerated Cold-Chain (2-8°C)' | 'Controlled Lockbox (Double Lock)' | 'Deep Freeze (-20°C)';
  unitCost: number;
  status: BatchStatus;
  fefoRank: number; // Priority index for First Expiry First Out
}

export interface EnterpriseMedication {
  id: string;
  hospitalId: string;
  drugCode: string; // "DRG-HEP-5000"
  brandName: string; // "Heparin Sodium Injection IP"
  genericName: string; // "Heparin Sodium 5,000 IU/ml"
  atcClassification: string; // "B01AB01"
  therapeuticClass: TherapeuticClass;
  dosageForm: 'Vial' | 'Ampoule' | 'Tablet' | 'Capsule' | 'IV Infusion Bag' | 'Syrup' | 'Prefilled Syringe' | 'Nebulizer Solution';
  strength: string; // "5,000 IU / mL"
  packSize: string; // "10 x 5mL Vials"
  route: 'Intravenous (IV)' | 'Subcutaneous (SC)' | 'Intramuscular (IM)' | 'Oral' | 'Inhalation' | 'Topical' | 'Intrathecal';
  manufacturer: string;
  distributor: string;
  formularyStatus: FormularyStatus;
  formularyCategory: 'Standard' | 'Restricted' | 'Specialty' | 'Reserve / Stewardship';
  isHighAlert: boolean; // ISMP High-Alert Flag
  isLookAlikeSoundAlike?: boolean; // LASA Flag
  isControlledSubstance: boolean;
  /** True when the drug may only be dispensed against a prescription. */
  isPrescriptionRequired?: boolean; // Schedule X / Narcotic
  isAntibioticStewardship: boolean;
  requiresColdChain: boolean;
  idealTempRange?: string; // "2°C - 8°C"
  currentStock: number;
  reorderLevel: number;
  safetyStock: number;
  maxStockLevel: number;
  unitPrice: number;
  acquisitionCost: number;
  locationsStock: Record<PharmacyLocation, number>;
  batches: MedicationBatch[];
  approvedIndications: string[];
  restrictedDepartments?: string[];
  authorizedPrescribersRole?: string[];
  formularyReviewedAt: string;
  formularyNextReview: string;
  substitutesAvailable?: string[]; // IDs of approved alternate generic SKUs
}

export interface DispensingOrder {
  id: string; // "DSP-2026-0814"
  hospitalId: string;
  patientMRN: string;
  patientName: string;
  bedOrLocation: string; // "ICU-A-04" or "Trauma Bay 2"
  orderingDoctor: string;
  doctorSpecialty: string;
  priority: OrderPriority;
  orderedAt: string;
  department: string;
  status: DispensingStatus;
  items: {
    medicationId: string;
    brandName: string;
    genericName: string;
    doseOrdered: string;
    route: string;
    frequency: string; // "q8h IV", "STAT", "Continuous Infusion"
    quantityOrdered: number;
    allocatedBatchId?: string;
    allocatedBatchNumber?: string;
    dispensedQuantity: number;
    unitPrice: number;
  }[];
  clinicalNotes?: string;
  verifiedByPharmacist?: string;
  dispensedAt?: string;
  totalCost: number;
  requiresDoubleVerification: boolean; // For high-alert / narcotics
  secondVerifier?: string;
}

export interface PurchaseRequest {
  id: string; // "PR-2026-041"
  hospitalId: string;
  medicationId: string;
  brandName: string;
  genericName: string;
  currentStock: number;
  requestedQuantity: number;
  estimatedCost: number;
  urgency: 'STAT Emergency Shortage' | 'Scheduled Buffer Reorder' | 'New Formulary Stocking';
  preferredSupplier: string;
  justification: string;
  requestedBy: string;
  requestedAt: string;
  status: 'Pending HOD Approval' | 'Approved by Medical Director' | 'Converted to PO' | 'Rejected';
  purchaseOrderId?: string;
}

export interface PharmacyPurchaseOrder {
  id: string; // "PO-2026-0199"
  hospitalId: string;
  supplierName: string;
  supplierContact: string;
  createdAt: string;
  deliveryExpectedDate: string;
  totalItemsCount: number;
  totalAmount: number;
  paymentTerms: '30 Days Net' | '45 Days Institutional Credit' | 'Immediate Settlement';
  status: 'Draft' | 'Sent to Supplier' | 'Confirmed / In Transit' | 'Partially Received' | 'Goods Received & Inspected' | 'Cancelled';
  lineItems: {
    medicationId: string;
    brandName: string;
    strength: string;
    quantityOrdered: number;
    quantityReceived: number;
    unitCost: number;
    batchNumberCaptured?: string;
    expiryCaptured?: string;
  }[];
  inspectedByPharmacist?: string;
}

export interface FormularyProposal {
  id: string; // "FML-PROP-009"
  hospitalId: string;
  proposedGenericName: string;
  proposedBrandName: string;
  strength: string;
  dosageForm: string;
  therapeuticClass: TherapeuticClass;
  requestingPhysician: string;
  requestingDepartment: string;
  clinicalJustification: string;
  existingAlternativesEvaluated: string;
  estimatedMonthlyUsage: number;
  estimatedAnnualCost: number;
  status: 'Submitted / Clinical Review' | 'Pharmacy & Safety Review' | 'P&T Committee Scheduled' | 'Approved for Formulary' | 'Approved with Restrictions' | 'Rejected';
  decisionNotes?: string;
  meetingDate?: string;
  submittedAt: string;
}

export interface MedicationRecall {
  id: string; // "RCL-2026-002"
  hospitalId: string;
  recallNumber: string; // "CDSCO-REC-2026-441"
  brandName: string;
  genericName: string;
  batchNumber: string;
  manufacturer: string;
  severity: 'Class I (High Risk / Potentially Fatal)' | 'Class II (Moderate Risk / Reversible)' | 'Class III (Technical Non-Compliance)';
  reason: string;
  affectedLocations: { location: PharmacyLocation; quantityQuarantined: number }[];
  totalUnitsFrozen: number;
  initiatedAt: string;
  status: 'Active Isolation' | 'Batch Reconciled' | 'Dispatched to OEM / Disposed' | 'Closed';
  officerInCharge: string;
}

export interface StockMovementRecord {
  id: string;
  hospitalId: string;
  timestamp: string;
  movementType: 'Receipt' | 'Dispensing' | 'Inter-Ward Transfer' | 'Quarantine' | 'Return to Main' | 'Disposal / Scrap' | 'Discrepancy Correction';
  medicationName: string;
  batchNumber: string;
  sourceLocation: PharmacyLocation;
  destinationLocation?: PharmacyLocation;
  quantityChanged: number;
  resultingQuantity: number;
  performedBy: string;
  referenceId: string; // Order #, PO #, Transfer #
  reason: string;
  immutableHash: string;
}
