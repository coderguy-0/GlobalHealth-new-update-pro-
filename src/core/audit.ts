/* ============================================================================
   GlobalHealth audit event contract.

   Every sensitive action (record access, consent, prescription signing, lab
   review, referral, messaging, auth, profile/permission change) is recorded as
   an immutable-ish audit event. The UI should never be the only audit source;
   a backend store will replace this module's in-memory sink.
   ========================================================================== */

export type AuditOutcome = 'success' | 'denied' | 'blocked';

export type AuditAction =
  | 'LOGIN' | 'LOGOUT' | 'SIGNUP' | 'PASSWORD_RESET' | '2FA_CHANGED'
  | 'PATIENT_RECORD_VIEW' | 'PATIENT_RECORD_ACCESS_DENIED'
  | 'CONSENT_REQUEST' | 'CONSENT_APPROVED' | 'CONSENT_DENIED' | 'CONSENT_REVOKED'
  | 'PRESCRIPTION_CREATED' | 'PRESCRIPTION_SIGNED' | 'PRESCRIPTION_SENT_PHARMACY'
  | 'LAB_ORDER_CREATED' | 'LAB_REVIEWED'
  | 'IMAGING_ORDER_CREATED' | 'IMAGING_REVIEWED'
  | 'REFERRAL_CREATED' | 'REFERRAL_UPDATED'
  | 'MESSAGE_SENT' | 'PROFILE_CHANGED' | 'PERMISSION_CHANGED'
  | 'APPOINTMENT_CHANGED' | 'SCHEDULE_CHANGED' | 'DOCUMENT_UPLOADED'
  | 'VITALS_RECORDED' | 'CLINICAL_NOTE_CREATED'
  | 'CONSULTATION_CREATED' | 'CONSULTATION_COMPLETED' | 'BILLING_CHANGED'
  | 'HOSPITAL_PROFILE_CHANGED' | 'HOSPITAL_DEPARTMENT_CHANGED' | 'HOSPITAL_DOCTOR_CHANGED'
  | 'HOSPITAL_STAFF_CHANGED' | 'HOSPITAL_SERVICE_CHANGED' | 'HOSPITAL_SCHEDULE_CHANGED'
  | 'HOSPITAL_APPOINTMENT_CHANGED' | 'HOSPITAL_ADMISSION_CHANGED' | 'HOSPITAL_BED_CHANGED'
  | 'HOSPITAL_EMERGENCY_CHANGED' | 'HOSPITAL_PRICE_CHANGED' | 'HOSPITAL_PRICE_PUBLISHED'
  | 'HOSPITAL_INSURANCE_CHANGED' | 'HOSPITAL_PHARMACY_CHANGED' | 'HOSPITAL_LAB_CHANGED'
  | 'HOSPITAL_IMAGING_CHANGED' | 'HOSPITAL_BLOOD_CHANGED' | 'HOSPITAL_AMBULANCE_CHANGED'
  | 'HOSPITAL_DOCUMENT_CHANGED' | 'HOSPITAL_VERIFICATION_CHANGED' | 'HOSPITAL_PERMISSION_CHANGED'
  | 'HOSPITAL_SYNC_STARTED' | 'HOSPITAL_SYNC_COMPLETED' | 'HOSPITAL_PUBLICATION_CHANGED'
  | 'HOSPITAL_ACCESS_DENIED'
  | 'PHARMACY_PROFILE_CHANGED' | 'PHARMACY_VERIFICATION_CHANGED' | 'PHARMACY_DOCUMENT_CHANGED'
  | 'PHARMACY_MEDICINE_ADDED' | 'PHARMACY_MEDICINE_UPDATED' | 'PHARMACY_MEDICINE_DELETED'
  | 'PHARMACY_PRICE_CHANGED' | 'PHARMACY_PRICE_PUBLISHED' | 'PHARMACY_FEE_CONFIG_CHANGED'
  | 'PHARMACY_INVENTORY_CHANGED' | 'PHARMACY_BATCH_CHANGED' | 'PHARMACY_ORDER_CHANGED'
  | 'PHARMACY_PRESCRIPTION_REVIEWED' | 'PHARMACY_SUPPLIER_CHANGED'
  | 'PHARMACY_PURCHASE_ORDER_CHANGED' | 'PHARMACY_REFUND_CHANGED' | 'PHARMACY_PAYMENT_CHANGED'
  | 'PHARMACY_PAYOUT_CHANGED' | 'PHARMACY_OFFER_CHANGED' | 'PHARMACY_STAFF_CHANGED'
  | 'PHARMACY_PERMISSION_CHANGED' | 'PHARMACY_SECURITY_CHANGED'
  | 'PHARMACY_SYNC_STARTED' | 'PHARMACY_SYNC_COMPLETED' | 'PHARMACY_ACCESS_DENIED';

export interface AuditEventInput {
  actorId: string;
  actorRole: string;
  action: AuditAction;
  resourceId?: string;
  resourceType?: string;
  patientId?: string | null;
  detail?: string;
  outcome?: AuditOutcome;
  ip?: string;
  location?: string;
  timestamp?: string;
}

export interface AuditEvent extends AuditEventInput {
  id: string;
  timestamp: string;
}

let counter = 0;

export function createAuditEvent(input: AuditEventInput): AuditEvent {
  counter += 1;
  return {
    id: `AUD-${Date.now()}-${counter}`,
    timestamp: new Date().toISOString(),
    outcome: 'success',
    ...input,
    detail: input.detail || input.action.replace(/_/g, ' ').toLowerCase(),
  };
}
