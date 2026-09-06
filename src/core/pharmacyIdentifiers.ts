/* ============================================================================
   Pharmacy Partner Portal identifier contract.

   Pharmacy-specific entities get stable type-prefixed IDs. Shared entities
   (patient, doctor, prescription, order, payment, notification, audit) use the
   core identifier module so the marketplace stays cross-portal traceable.
   ========================================================================== */

export type PharmacyEntityId =
  | 'PHARMACY' | 'PHARMACY_BRANCH' | 'PHARMACY_STAFF' | 'PHARMACY_DOCUMENT'
  | 'MEDICINE' | 'MEDICINE_BATCH' | 'INVENTORY' | 'SUPPLIER' | 'PURCHASE_ORDER'
  | 'PRICE' | 'PRICE_HISTORY' | 'COUPON' | 'OFFER' | 'DELIVERY_ZONE'
  | 'PAYOUT' | 'SYNC_JOB' | 'INTEGRATION' | 'REGULATORY_RECORD';

export const PHARMACY_ENTITY_PREFIX: Record<PharmacyEntityId, string> = {
  PHARMACY: 'PHM',
  PHARMACY_BRANCH: 'PBR',
  PHARMACY_STAFF: 'PST',
  PHARMACY_DOCUMENT: 'PDC',
  MEDICINE: 'MED',
  MEDICINE_BATCH: 'BAT',
  INVENTORY: 'INV',
  SUPPLIER: 'SUP',
  PURCHASE_ORDER: 'PO',
  PRICE: 'PRC',
  PRICE_HISTORY: 'PRH',
  COUPON: 'CPN',
  OFFER: 'OFF',
  DELIVERY_ZONE: 'DZN',
  PAYOUT: 'POUT',
  SYNC_JOB: 'SYN',
  INTEGRATION: 'INT',
  REGULATORY_RECORD: 'REG',
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

export function createPharmacyEntityId(entity: PharmacyEntityId, suffix?: string): string {
  const prefix = PHARMACY_ENTITY_PREFIX[entity];
  return suffix ? `${prefix}-${suffix.toUpperCase()}` : `${prefix}-${randomToken(6)}`;
}

export function createCommerceSequenceId(entity: 'ORDER' | 'INVOICE' | 'PAYMENT' | 'REFUND' | 'PAYOUT' | 'PURCHASE_ORDER', sequence: number): string {
  const map = { ORDER: 'GH', INVOICE: 'INV', PAYMENT: 'PAY', REFUND: 'REF', PAYOUT: 'POUT', PURCHASE_ORDER: 'PO' } as const;
  return `${map[entity]}-GH-${String(sequence).padStart(6, '0')}`;
}

export function isPharmacyEntityId(value: string, entity: PharmacyEntityId): boolean {
  const prefix = PHARMACY_ENTITY_PREFIX[entity];
  if (!prefix) return false;
  return /^[A-Z0-9]{2,5}-[A-Z0-9-]{6,}$/i.test(value) && value.startsWith(`${prefix}-`);
}
