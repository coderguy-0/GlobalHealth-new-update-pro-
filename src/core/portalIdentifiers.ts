/* ============================================================================
   GlobalHealth core identifier contract.

   Every entity in the clinical/portal ecosystem uses a stable, type-prefixed
   identifier. IDs are generated as `PREFIX-<random>` on the client only for
   optimistic UI; the backend is authoritative and will produce the same shape.
   ========================================================================== */

export type CoreEntityId =
  | 'DOCTOR' | 'PATIENT' | 'APPOINTMENT' | 'CONSULTATION' | 'PRESCRIPTION'
  | 'LAB_ORDER' | 'LAB_RESULT' | 'IMAGING_ORDER' | 'IMAGING_RESULT' | 'REFERRAL'
  | 'CONSENT_REQUEST' | 'DOCUMENT' | 'NOTIFICATION' | 'AUDIT_EVENT' | 'HOSPITAL'
  | 'PHARMACY' | 'LABORATORY' | 'IMAGING_PROVIDER' | 'MESSAGE' | 'SESSION';

export const ENTITY_PREFIX: Record<CoreEntityId, string> = {
  DOCTOR: 'DOC', PATIENT: 'PAT', APPOINTMENT: 'APT', CONSULTATION: 'CON',
  PRESCRIPTION: 'RX', LAB_ORDER: 'LAB', LAB_RESULT: 'LABR', IMAGING_ORDER: 'IMG',
  IMAGING_RESULT: 'IMGR', REFERRAL: 'REF', CONSENT_REQUEST: 'CS', DOCUMENT: 'DOC',
  NOTIFICATION: 'NTF', AUDIT_EVENT: 'AUD', HOSPITAL: 'HSP', PHARMACY: 'PHM',
  LABORATORY: 'LBR', IMAGING_PROVIDER: 'IMGP', MESSAGE: 'MSG', SESSION: 'SES',
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

/** Create a type-prefixed id (e.g. `PAT-7K2M9Q`). */
export function createEntityId(entity: CoreEntityId): string {
  return `${ENTITY_PREFIX[entity]}-${randomToken(6)}`;
}

/** Create a human-readable code (e.g. `RX-GH-29483`) for clinical documents. */
export function createClinicalCode(entity: Prescription | LabOrder | ImagingOrder, sequence: number): string {
  const prefix = entity === 'PRESCRIPTION' ? 'RX' : entity === 'LAB_ORDER' ? 'LAB' : 'IMG';
  return `${prefix}-GH-${String(sequence).padStart(5, '0')}`;
}

type Prescription = 'PRESCRIPTION';
type LabOrder = 'LAB_ORDER';
type ImagingOrder = 'IMAGING_ORDER';

export function isEntityId(value: string, entity: CoreEntityId): boolean {
  return /^[A-Z0-9]{2,5}-[A-Z0-9]{6,}$/i.test(value) && value.startsWith(`${ENTITY_PREFIX[entity]}-`);
}
