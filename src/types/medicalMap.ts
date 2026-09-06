export type MedicalFacilityType =
  | 'HOSPITAL'
  | 'CLINIC'
  | 'MEDICAL_CENTER'
  | 'NURSING_HOME'
  | 'URGENT_CARE'
  | 'SPECIALIZED_HEALTH_OFFICE';

export const PERMITTED_FACILITY_TYPES: MedicalFacilityType[] = [
  'HOSPITAL',
  'CLINIC',
  'MEDICAL_CENTER',
  'NURSING_HOME',
  'URGENT_CARE',
  'SPECIALIZED_HEALTH_OFFICE',
];

export const BANNED_FACILITY_TYPES = [
  'PHARMACY',
  'MEDICAL_SHOP',
  'DRUG_STORE',
  'MEDICINE_STORE',
  'LAB',
  'DIAGNOSTIC_CENTER',
  'AMBULANCE_COMPANY',
  'WELLNESS_STORE',
  'GYM',
  'RESTAURANT',
  'GENERAL_BUSINESS',
] as const;

export function isValidMedicalFacilityType(type: string): type is MedicalFacilityType {
  return PERMITTED_FACILITY_TYPES.includes(type as MedicalFacilityType);
}

export type FacilityVerificationStatus =
  | 'Verified'
  | 'Pending Verification'
  | 'Unverified'
  | 'Temporarily Closed'
  | 'Permanently Closed'
  | 'Archived';

export interface FacilityVerificationDetails {
  verifiedByAuthority: string;
  licenseNumber: string;
  auditDate: string;
  accreditation: string[];
  verificationBadge: string;
}

export interface FacilityAddress {
  street: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
}

export interface FacilityOperatingHours {
  isOpen24x7: boolean;
  openTime?: string; // e.g. "08:00"
  closeTime?: string; // e.g. "20:00"
  scheduleText: string;
  emergencyAvailable24x7?: boolean;
}

export interface FacilityAccessibility {
  wheelchairAccessible: boolean;
  emergencyRamp?: boolean;
  accessibleParking?: boolean;
  brailleAssistance?: boolean;
  hearingLoop?: boolean;
  elevatorAccess?: boolean;
}

export type FacilityOwnership = 'Government' | 'Society' | 'Private' | 'Trust';

export interface MedicalMapFacility {
  id: string;
  facilityIdCode?: string; // e.g. DEL-HOSP-0001
  facilityName: string;
  facilityType: MedicalFacilityType;
  ownership?: FacilityOwnership;
  category?: string; // e.g. Multi-Speciality, Super-Speciality, Apex Quaternary
  district?: string; // e.g. North East Delhi, South Delhi, Central Delhi, etc.
  pincode?: string; // e.g. 110095
  bedCount?: number; // Verified approved bed strength
  registrationNo?: string; // Verified DGHS / State Registration No.
  registrationValidUntil?: string; // Validity date
  source?: string; // e.g. Delhi Govt / DGHS, Delhi H&FW
  lastVerified?: string; // e.g. 2026-08-25
  ewsAvailable?: boolean; // Economically Weaker Section reserved beds/treatment
  verificationStatus: FacilityVerificationStatus;
  verificationDetails?: FacilityVerificationDetails;
  address: FacilityAddress;
  latitude: number;
  longitude: number;
  phone: string;
  emergencyPhone?: string;
  website?: string;
  operatingHours: FacilityOperatingHours;
  specialtyType?: string;
  services: string[];
  departments?: string[];
  accessibility: FacilityAccessibility;
  emergencyServices: boolean;
  emergencyLevel?: string; // e.g. "Level 1 Trauma Resuscitation", "Immediate Urgent Triage"
  estimatedWaitTimeMinutes?: number; // Only for urgent care / emergency when real operational data available
  about: string;
  hospitalProfileId?: string; // Links to existing hospital profile in GlobalHealth directory if present
  rating?: number;
  totalReviews?: number;
  imageUrl?: string;
  distanceKm?: number;
  createdAt: string;
  updatedAt: string;
}

export type MedicalMapSortOption =
  | 'recommended'
  | 'nearest'
  | 'beds_desc'
  | 'name_asc'
  | 'open_now'
  | 'recently_verified';

export interface MedicalMapFilterState {
  searchQuery: string;
  selectedCategory: MedicalFacilityType | 'ALL';
  selectedOwnership: FacilityOwnership | 'ALL';
  selectedDistrict: string | 'ALL';
  distanceRadiusKm: number | 'ALL';
  openNowOnly: boolean;
  verifiedOnly: boolean;
  emergencyOnly: boolean;
  ewsOnly: boolean;
  sortBy: MedicalMapSortOption;
}

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number; // Accuracy in meters (e.g. ±5m)
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp?: number;
  cityLabel?: string;
  exactAddress?: string;
  street?: string;
  area?: string;
  district?: string;
  postalCode?: string;
  country?: string;
  precisionLevel?: 'gps_satellite' | 'wifi_cellular' | 'coarse' | 'preset';
  isHighAccuracy?: boolean;
}
