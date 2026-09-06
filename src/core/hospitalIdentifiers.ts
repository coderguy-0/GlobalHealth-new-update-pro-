/* ============================================================================
   Hospital Portal identifier contract.

   Shared GlobalHealth entities (patient, doctor, appointment, audit event)
   come from the core identifier module. Hospital Portal resources that exist
   only inside a hospital get their own type-prefixed identifiers so records
   can be traced back to the facility and entity type.
   ========================================================================== */

export type HospitalEntityId =
  | 'HOSPITAL' | 'DEPARTMENT' | 'STAFF' | 'PATIENT_RECORD' | 'ADMISSION' | 'BED'
  | 'AMBULANCE' | 'EMERGENCY_CASE' | 'PRICE' | 'PACKAGE' | 'PRICE_HISTORY'
  | 'PHARMACY_ITEM' | 'BLOOD_UNIT' | 'LAB_TEST' | 'IMAGING_SERVICE'
  | 'SYNC_JOB' | 'PUBLICATION' | 'INCIDENT';

export const HOSPITAL_ENTITY_PREFIX: Record<HospitalEntityId, string> = {
  HOSPITAL: 'HSP',
  DEPARTMENT: 'DEP',
  STAFF: 'STF',
  PATIENT_RECORD: 'PAT',
  ADMISSION: 'ADM',
  BED: 'BED',
  AMBULANCE: 'AMB',
  EMERGENCY_CASE: 'EMG',
  PRICE: 'PRC',
  PACKAGE: 'PKG',
  PRICE_HISTORY: 'PRH',
  PHARMACY_ITEM: 'PHM',
  BLOOD_UNIT: 'BLD',
  LAB_TEST: 'LBT',
  IMAGING_SERVICE: 'IMG',
  SYNC_JOB: 'SYN',
  PUBLICATION: 'PUB',
  INCIDENT: 'INC',
};

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomToken(length: number): string {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * ALPHABET.length);
  }
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
}

export function createHospitalEntityId(entity: HospitalEntityId, suffix?: string): string {
  const prefix = HOSPITAL_ENTITY_PREFIX[entity];
  return suffix ? `${prefix}-${suffix.toUpperCase()}` : `${prefix}-${randomToken(6)}`;
}

export function createHospitalTransactionId(entity: 'ADMISSION' | 'EMERGENCY_CASE' | 'SYNC_JOB', sequence: number): string {
  const prefix = HOSPITAL_ENTITY_PREFIX[entity];
  return `${prefix}-GH-${String(sequence).padStart(6, '0')}`;
}

export function isHospitalEntityId(value: string, entity: HospitalEntityId): boolean {
  const prefix = HOSPITAL_ENTITY_PREFIX[entity];
  if (!prefix) return false;
  return /^[A-Z0-9]{2,5}-[A-Z0-9-]{6,}$/i.test(value) && value.startsWith(`${prefix}-`);
}
