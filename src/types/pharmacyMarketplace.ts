export interface PharmacyPartner {
  id: string;
  name: string;
  shortName: string;
  licenseNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  rating: number;
  reviewsCount: number;
  deliveryCoverage: string;
  avgFulfillmentTime: string;
  operatingHours: string;
  verifiedStatus: 'Verified' | 'Apex Partner' | 'Hospital Dispensary';
  pharmacistInCharge: string;
  coldChainAvailable: boolean;
  activeProductsCount: number;
  badge: string;
}

export interface GenericEquivalent {
  genericName: string;
  genericBrand: string;
  genericPrice: number;
  brandPrice: number;
  savingsAmount: number;
  savingsPercent: number;
  composition: string;
  regulatoryNote: string;
}

export interface PartnerAvailabilityOption {
  partnerId: string;
  partnerName: string;
  shortName: string;
  licenseNumber: string;
  area: string;
  city: string;
  state: string;
  distanceKm: number;
  isOpenNow: boolean;
  operatingHours: string;
  stockStatus: 'In Stock' | 'Limited Stock' | 'Currently Unavailable';
  stockCount: number;
  price: number;
  mrp: number;
  discountPercent: number;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  estimatedFulfillment: string;
  rating: number;
  reviewsCount: number;
  badge: string;
  pharmacistInCharge: string;
  coldChainAvailable: boolean;
}

export interface MedicineFAQ {
  question: string;
  answer: string;
}

export interface PharmacyProduct {
  id: string;
  name: string;
  brandName: string;
  genericName: string;
  category: 'Prescription' | 'OTC' | 'Generic' | 'Vitamins & Nutrition' | 'Medical Devices' | 'First Aid' | 'Personal Care' | 'Prescription Medicines' | 'Over-the-Counter' | 'Generic Medicines';
  subCategory: string;
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Topical Gel' | 'Drops' | 'Sachet / Powder' | 'Liquid Solution' | 'Medical Device' | 'Kit / Pack' | 'Cream' | 'Ointment' | 'Inhaler';
  strength: string;
  packSize: string;
  mrp: number;
  price: number;
  discountPercent: number;
  prescriptionRequired: boolean;
  rxSchedule: 'Schedule H' | 'Schedule H1' | 'Schedule X' | 'OTC / Non-Scheduled' | 'Device Class B' | 'General Supplement';
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockQuantity: number;
  pharmacyPartnerId: string;
  pharmacyPartnerName: string;
  imageUrl: string;
  imageType?: 'tablet' | 'capsule' | 'syrup' | 'gel' | 'liquid' | 'ors' | 'cream' | 'antacid' | 'device' | 'drops' | 'kit';
  description: string;
  uses: string[];
  composition: string;
  manufacturer: string;
  countryOfOrigin: string;
  storage: string;
  warnings: string;
  dosageInstructions: string;
  sideEffects: string[];
  precautions?: string[];
  contraindications?: string[];
  faqs?: MedicineFAQ[];
  genericEquivalent?: GenericEquivalent;
  isPopular?: boolean;
  isBestseller?: boolean;
  lastReviewedDate?: string;
  therapeuticClass?: string;
}

export interface CartItem {
  product: PharmacyProduct;
  quantity: number;
  selectedPharmacyId: string;
}

export interface UploadedPrescription {
  id: string;
  patientName: string;
  doctorName: string;
  hospitalName?: string;
  prescriptionDate: string;
  fileName: string;
  fileSize: string;
  fileUrl?: string;
  uploadedAt: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Requires Clarification' | 'Rejected';
  notes?: string;
  verifiedByPharmacist?: string;
}

export interface PharmacyOrder {
  id: string;
  date: string;
  items: {
    productId: string;
    productName: string;
    brandName: string;
    strength: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    prescriptionRequired: boolean;
  }[];
  deliveryAddress: {
    fullName: string;
    phone: string;
    email: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    pincode: string;
    deliveryType: 'standard' | 'express';
  };
  pricing: {
    subtotalMRP: number;
    totalDiscount: number;
    itemsSubtotal: number;
    deliveryFee: number;
    tax: number;
    grandTotal: number;
  };
  prescriptionId?: string;
  paymentMethod: 'UPI' | 'Credit / Debit Card' | 'Net Banking' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending on Delivery';
  status: 'Order Placed' | 'Prescription Verified' | 'Dispensing & Packed' | 'Dispatched' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  estimatedDelivery: string;
  trackingSteps: {
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
    current?: boolean;
  }[];
  fulfillingPharmacy: {
    name: string;
    license: string;
    phone: string;
  };
}
