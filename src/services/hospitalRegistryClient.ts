// ---------------------------------------------------------------------------
// Central Hospital Registry client.
//
// The server registry is the single source of truth for every verified
// hospital's public profile. Hospital portals WRITE their own record with a
// per-hospital token (token ⇆ exactly one hospitalId); the user platform
// READS the latest published data fresh (never cached).
// ---------------------------------------------------------------------------

export type HospitalPublicationStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';

export interface CentralDepartment {
  id: string;
  name: string;
  description: string;
  type: string;
  headOfDepartment: string;
  location: string;
  timings: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface CentralDoctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  subSpecialty: string;
  department: string;
  qualifications: string;
  registrationNo: string;
  experienceYears: number;
  opdSchedule: string;
  room: string;
  consultationFee: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
}

export interface CentralNewsItem {
  id: string;
  title: string;
  body: string;
  category: string;
  publishedAt: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
}

export interface CentralHospitalRecord {
  hospitalId: string;
  version: number;
  publicationStatus: HospitalPublicationStatus;
  syncStatus: string;
  lastUpdated: string;
  updatedBy?: string;
  identity: {
    name: string; legalName: string; shortName: string; description: string;
    hospitalType: string; ownership: string; establishedYear: number;
    registrationNo: string; verificationStatus: string; traumaLevel: string;
    teachingHospital: boolean; imageUrl: string;
  };
  location: {
    streetAddress: string; area: string; city: string; state: string; country: string; postalCode: string;
    latitude: number; longitude: number; landmark: string; directions: string;
    emergencyEntrance: string; parkingInfo: string;
  };
  contact: {
    mainPhone: string; emergencyPhone: string; appointmentPhone: string; internationalPhone: string;
    receptionPhone: string; email: string; emergencyEmail: string; website: string; whatsapp: string;
    generalHours: string; emergencyHours: string; opdHours: string; visitingHours: string;
    registrationHours: string; holidayClosureInfo: string;
  };
  departments: CentralDepartment[];
  doctors: CentralDoctor[];
  bedsFacilities: {
    totalBeds: number; generalBeds: number; icuBeds: number; nicuBeds: number; picuBeds: number;
    emergencyBeds: number; isolationBeds: number; privateRooms: number; semiPrivateRooms: number; generalWards: number;
    publishLiveAvailability: boolean; availableBeds: number;
    facilities: Array<{ name: string; status: 'ACTIVE' | 'INACTIVE' }>;
    parkingAvailable: boolean; ambulanceServices: boolean;
  };
  labImaging: {
    labName: string; labTests: string[]; homeSampleCollection: boolean; labHours: string; labContact: string;
    imagingServices: Array<{ modality: string; status: 'ACTIVE' | 'INACTIVE'; hours: string }>;
  };
  pharmacyBlood: {
    pharmacyName: string; pharmacyLocation: string; pharmacyHours: string; pharmacyContact: string; emergencyPharmacy: string;
    bloodBankName: string;
    bloodBankStatus: 'ACTIVE' | 'INACTIVE'; bloodBankLocation: string; bloodComponents: string[];
    bloodBankHours: string; bloodBankContact: string;
    bloodInventory: Array<{
      id: string;
      bloodGroup: string;
      wholeBloodUnits: number;
      prbcUnits: number;
      ffpUnits: number;
      plateletUnits: number;
      cryoprecipitateUnits: number;
      criticalMinThreshold: number;
      lastRestockedAt: string;
    }>;
  };
  services: Array<{ name: string; category: string; status: 'ACTIVE' | 'INACTIVE' }>;
  pricing: Array<{ item: string; category: string; price: string; status: 'PUBLISHED' | 'DRAFT' }>;
  international: {
    coordinator: string; phone: string; email: string; visaAssistance: boolean; airportTransfer: boolean;
    accommodationSupport: boolean; languages: string; medicalTourismServices: string;
  };
  accreditation: Array<{ body: string; name: string; number: string; issueDate: string; expiryDate: string; status: 'VERIFIED' | 'PENDING' }>;
  researchEducation: Array<{ type: string; title: string; description: string; date: string }>;
  news: CentralNewsItem[];
}

export interface HospitalAuditRecord {
  id: string;
  hospitalId: string;
  hospitalName: string;
  userId: string;
  userName: string;
  userRole: string;
  section: string;
  changes: Array<{ field: string; oldValue: any; newValue: any }>;
  changedAt: string;
  publicationStatus: string;
  syncStatus: string;
  source: string;
  ip?: string;
  result: 'SUCCESS' | 'REJECTED';
  reason?: string;
}

// ---------------------------------------------------------------------------
// Portal session. Write access to the registry is authorized by a
// SERVER-ISSUED hospital portal session token (see /api/hospital-portal/auth)
// — no static secrets exist in this bundle. A session maps to exactly one
// hospitalId, enforced server-side on every write.
// ---------------------------------------------------------------------------
const SESSION_KEY = 'hospital_portal_session_token_v1';

export function getHospitalSessionToken(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function storeHospitalSession(token: string): void {
  try {
    localStorage.setItem(SESSION_KEY, token);
  } catch {}
}

export function clearHospitalSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

const authHeaders = (): Record<string, string> => {
  const token = getHospitalSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** Public (user platform): fresh list of published hospital profiles. */
export async function fetchPublicHospitals(): Promise<
  { ok: true; asOf: string; hospitals: CentralHospitalRecord[] } | { ok: false; error: string }
> {
  try {
    const res = await fetch('/api/hospital-registry/public/hospitals', { headers: { 'Cache-Control': 'no-cache' } });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return { ok: false, error: data?.error || 'Registry temporarily unavailable.' };
    }
    return { ok: true, asOf: data.asOf, hospitals: data.hospitals || [] };
  } catch {
    return { ok: false, error: 'Registry temporarily unavailable.' };
  }
}

// ---------------------------------------------------------------------------
// PUBLIC blood-bank view (hospital-specific, minimal projection). Statuses
// are derived server-side from the hospital's own thresholds.
// ---------------------------------------------------------------------------
export type BloodGroupAvailability = 'AVAILABLE' | 'LOW_AVAILABILITY' | 'NOT_AVAILABLE';

export interface PublicBloodBankGroup {
  bloodGroup: string;
  availableUnits: number;
  components: { wholeBlood: number; plasma: number; platelets: number };
  status: BloodGroupAvailability;
  updatedAt: string;
}

export interface PublicBloodBank {
  hospitalId: string;
  name: string;
  serviceListed: boolean;
  overallStatus: 'AVAILABLE' | 'LOW_AVAILABILITY' | 'NOT_AVAILABLE' | 'SERVICE_NOT_LISTED';
  operatingHours: string;
  emergencyAvailable24x7: boolean;
  emergencyContact: string;
  location: string;
  lastUpdated: string;
  possiblyStale: boolean;
  groups: PublicBloodBankGroup[];
}

export async function fetchPublicBloodBank(
  hospitalId: string
): Promise<{ ok: true; asOf: string; bloodBank: PublicBloodBank } | { ok: false; error: string }> {
  try {
    const res = await fetch(`/api/hospital-registry/public/hospitals/${encodeURIComponent(hospitalId)}/blood-bank`, {
      headers: { 'Cache-Control': 'no-cache' }
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return { ok: false, error: data?.error || 'Blood-bank information is temporarily unavailable. Please try again.' };
    }
    return { ok: true, asOf: data.asOf, bloodBank: data.bloodBank };
  } catch {
    return { ok: false, error: 'Blood-bank information is temporarily unavailable. Please try again.' };
  }
}

/** Portal: read this hospital's full registry record. */
export interface HospitalRecordResult {
  ok: boolean;
  record?: CentralHospitalRecord;
  error?: string;
}

export async function fetchHospitalRecord(hospitalId: string): Promise<HospitalRecordResult> {
  try {
    const res = await fetch(`/api/hospital-registry/${hospitalId}/record`, {
      headers: authHeaders()
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) return { ok: false, error: data?.error || 'Registry temporarily unavailable.' };
    return { ok: true, record: data.record };
  } catch {
    return { ok: false, error: 'Registry temporarily unavailable.' };
  }
}

/** Portal: save one section (validate → diff → publish → audit). */
export async function saveHospitalSection(
  hospitalId: string,
  section: string,
  data: unknown,
  actor: { userId: string; userName: string; userRole: string; comment?: string }
): Promise<{ ok: boolean; unchanged?: boolean; record?: CentralHospitalRecord; propagation?: string[]; message?: string; error?: string; problems?: string[] }> {
  try {
    const res = await fetch(`/api/hospital-registry/${hospitalId}/sections/${section}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ data, ...actor })
    });
    const payload = await res.json().catch(() => null);
    if (!res.ok || !payload?.success) {
      return { ok: false, error: payload?.error || 'The update could not be saved.', problems: payload?.problems };
    }
    return { ok: true, unchanged: payload.unchanged, record: payload.record, propagation: payload.propagation, message: payload.message };
  } catch {
    return { ok: false, error: 'The update could not be saved. Please try again.' };
  }
}

/** Portal: this hospital's audit history. */
export async function fetchHospitalAudit(hospitalId: string): Promise<{ ok: boolean; records: HospitalAuditRecord[] }> {
  try {
    const res = await fetch(`/api/hospital-registry/${hospitalId}/audit`, {
      headers: authHeaders()
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) return { ok: false, records: [] };
    return { ok: true, records: data.records || [] };
  } catch {
    return { ok: false, records: [] };
  }
}
