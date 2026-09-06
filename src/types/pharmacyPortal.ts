export type PrescriptionClassification = 
  | 'OTC / Non-Prescription' 
  | 'Prescription Required' 
  | 'Restricted / Special Handling';

export type PharmacyPortalNavTab = 
  | 'dashboard' 
  | 'orders' 
  | 'prescriptions' 
  | 'inventory' 
  | 'marketplace-sync'
  | 'batches' 
  | 'catalog' 
  | 'pricing' 
  | 'branches' 
  | 'staff' 
  | 'delivery' 
  | 'payments' 
  | 'analytics' 
  | 'compliance' 
  | 'support' 
  | 'audit-logs' 
  | 'profile';

export type PharmacyStaffRole = 
  | 'Pharmacy Owner'
  | 'Pharmacy Administrator'
  | 'Pharmacist'
  | 'Inventory Manager'
  | 'Order Manager'
  | 'Finance Manager'
  | 'Delivery Coordinator';

export interface PharmacyFeeConfiguration {
  id: string;
  pharmacyId: string;
  currency: 'INR';
  platformCommissionPercent: number;
  paymentProcessingPercent: number;
  paymentProcessingFixedFee: number;
  deliveryFeeMode: 'PHARMACY_PAID' | 'CUSTOMER_PAID' | 'SHARED';
  deliveryContributionPercent: number;
  standardDeliveryFee: number;
  expressDeliveryFee: number;
  freeDeliveryAbove: number;
  promotionalContributionPercent: number;
  subscriptionMonthlyFee: number;
  gstTdsPercent: number;
  updatedAt: string;
  updatedBy: string;
  effectiveFrom: string;
  description: string;
}

export type PharmacyApplicationStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Documents Required'
  | 'Verification in Progress'
  | 'Approved'
  | 'Rejected'
  | 'Suspended';

export type DocumentVerificationState = 
  | 'Not Uploaded'
  | 'Uploaded'
  | 'Under Review'
  | 'Verified'
  | 'Rejected'
  | 'Expiring Soon'
  | 'Action Required';

export type PortalOrderStatus = 
  | 'New'
  | 'Prescription Review'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Rejected'
  | 'Refund Pending';

export type PrescriptionReviewStatus = 
  | 'Awaiting Review'
  | 'Under Review'
  | 'Approved'
  | 'Declined'
  | 'Clarification Required'
  | 'Expired'
  | 'Completed';

export interface RegulatoryDocument {
  id: string;
  type: 'Drug License (Form 20B/21B)' | 'GST Registration' | 'Pharmacist Registration Certificate' | 'Business Establishment Proof' | 'Identity Proof' | 'Bank Account Verification' | 'FSSAI License' | 'Premises Fire & Safety Clearance';
  documentNumber: string;
  issuingAuthority: string;
  state: DocumentVerificationState;
  uploadedAt: string;
  verifiedAt?: string;
  expiryDate?: string;
  fileName: string;
  fileSize: string;
  rejectionReason?: string;
  reviewerNotes?: string;
}

export interface PharmacyStaffMember {
  id: string;
  name: string;
  role: PharmacyStaffRole;
  email: string;
  phone: string;
  licenseNumber?: string; // For Registered Pharmacists (R.Ph)
  status: 'Active' | 'On Leave' | 'Suspended';
  assignedBranchId: string;
  assignedBranchName: string;
  lastLogin: string;
  permissions: {
    canReviewPrescriptions: boolean;
    canDispenseMedicines: boolean;
    canManageInventory: boolean;
    canModifyPrices: boolean;
    canManageStaff: boolean;
    canViewFinancials: boolean;
    canManageBranches: boolean;
  };
}

export interface PharmacyBranchInfo {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  managerName: string;
  pharmacistInCharge: string;
  operatingHours: string;
  deliveryRadiusKm: number;
  isActive: boolean;
  is24x7: boolean;
  hasColdStorage: boolean;
  activeOrdersCount: number;
  totalMedicinesCount: number;
}

export interface PortalMedicine {
  id: string;
  name: string;
  brandName: string;
  genericName: string;
  manufacturer: string;
  composition: string;
  strength: string;
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Topical Gel' | 'Drops' | 'Sachet / Powder' | 'Liquid Solution' | 'Medical Device' | 'Kit / Pack' | 'Cream' | 'Inhaler' | 'Injection';
  packSize: string;
  unit: string;
  category: 'Pain Relief' | 'Fever & Cold' | 'Digestive Health' | 'Vitamins & Supplements' | 'Diabetes Care' | 'Heart Health' | 'Skin Care' | 'Respiratory Care' | 'Women\'s Health' | 'Baby Care' | 'First Aid' | 'Medical Devices' | 'Wellness' | 'Other';
  prescriptionClassification: 'OTC / Non-Prescription' | 'Prescription Required' | 'Restricted / Special Handling';
  rxSchedule: 'Schedule H' | 'Schedule H1' | 'Schedule X' | 'OTC / Non-Scheduled' | 'Device Class B' | 'General Supplement';
  sku: string;
  barcode: string;
  mrp: number;
  sellingPrice: number;
  purchaseCost: number;
  discountPercent: number;
  minAllowedPrice: number;
  taxRatePercent: number;
  stockQuantity: number;
  availableStock: number;
  reservedStock: number;
  damagedStock: number;
  expiredStock: number;
  minStockLevel: number;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  storageInstructions: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Quarantined / Expired';
  branchId: string;
  imageUrl?: string;
  description: string;
  requiresColdChain: boolean;
  isPopular?: boolean;
}

export interface PortalOrderItemDetail {
  id: string;
  productId: string;
  productName: string;
  brandName: string;
  strength: string;
  dosageForm: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  prescriptionRequired: boolean;
  batchNumber: string;
  expiryDate: string;
  isAvailable: boolean;
  isDispensed: boolean;
}

export interface PortalOrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  maskedPhone: string;
  patientAge?: number;
  patientGender?: string;
  deliveryType: 'Home Delivery' | 'Store Pickup';
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  items: PortalOrderItemDetail[];
  totalItemsCount: number;
  subtotalAmount: number;
  discountAmount: number;
  taxAmount: number;
  deliveryFee: number;
  grandTotal: number;
  paymentMethod: 'UPI' | 'Credit Card' | 'Net Banking' | 'Cash on Delivery';
  paymentStatus: 'Paid Online' | 'Pending on Delivery' | 'Refunded';
  orderStatus: PortalOrderStatus;
  prescriptionRequired: boolean;
  prescriptionId?: string;
  prescriptionReviewStatus?: PrescriptionReviewStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  deliveryPartnerName?: string;
  deliveryRiderPhone?: string;
  estimatedDeliveryTime?: string;
  dispensedAt?: string;
  branchId: string;
  branchName: string;
  notes?: string;
}

export interface PortalPrescriptionRecord {
  id: string;
  orderId?: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorName: string;
  doctorRegNo: string;
  clinicHospitalName: string;
  prescriptionDate: string;
  uploadedAt: string;
  status: PrescriptionReviewStatus;
  documentUrl: string;
  documentType: 'image' | 'pdf';
  detectedMedicines: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    matchedCatalogId?: string;
    isAvailableInStock: boolean;
  }[];
  reviewedByPharmacist?: string;
  reviewedAt?: string;
  clarificationNotes?: string;
  pharmacistInternalComments?: string;
  isDigitallySigned: boolean;
}

export interface PortalNotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  priority: 'Critical' | 'Important' | 'Normal';
  category: 'order' | 'prescription' | 'stock' | 'expiry' | 'compliance' | 'settlement' | 'system';
  isRead: boolean;
  actionUrl?: string;
}

export interface SupportTicketItem {
  id: string;
  ticketNumber: string;
  subject: string;
  category: 'Verification & Licensing' | 'Order Dispatch' | 'Prescription Dispute' | 'Payment & Payout' | 'Inventory Synchronization' | 'Technical Bug' | 'Other';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Waiting for Pharmacy' | 'Resolved' | 'Closed';
  createdAt: string;
  lastUpdated: string;
  messages: {
    sender: 'Pharmacy' | 'GlobalHealth Compliance Team';
    senderName: string;
    timestamp: string;
    content: string;
  }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  staffName: string;
  staffRole: string;
  module: 'Auth' | 'Orders' | 'Prescriptions' | 'Catalog' | 'Inventory' | 'Pricing' | 'Staff' | 'Compliance' | 'Branches';
  details: string;
  ipAddress: string;
  deviceInfo: string;
  result: 'Success' | 'Warning' | 'Blocked';
}

export interface PharmacyProfileDetails {
  id: string;
  legalEntityName: string;
  tradeName: string;
  licenseNumber: string;
  taxNumber: string;
  pharmacyType: 'Retail Pharmacy' | 'Hospital Pharmacy' | 'Clinic Pharmacy' | 'Specialty Pharmacy' | 'Chain Pharmacy' | 'Institutional Pharmacy';
  ownershipType: 'Private Limited' | 'Partnership' | 'Sole Proprietorship' | 'Public Limited';
  headquartersAddress: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  operatingHours: string;
  totalBranches: number;
  pharmacistInCharge: string;
  pharmacistRegNo: string;
  establishedYear: number;
  aboutText: string;
  supportedPaymentMethods: string[];
  languagesSpoken: string[];
  verificationStatus: 'Verified' | 'Verification Pending' | 'Suspended' | 'Rejected';
  verifiedSince: string;
  lastAuditedDate: string;
  rating: number;
  ratingCount: number;
  complianceScore: number;
  performanceScore: number;
  isColdChainCertified: boolean;
  isExpressDeliverySupported: boolean;
}

export interface SettlementLedgerItem {
  id: string;
  payoutId: string;
  date: string;
  grossSales: number;
  platformCommission: number;
  gstTds: number;
  deliveryCost: number;
  netPayoutAmount: number;
  payoutStatus: 'Settled' | 'Processing' | 'Pending Audit';
  bankReferenceNumber: string;
  ordersCount: number;
}
