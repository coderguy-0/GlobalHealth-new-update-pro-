/* ============================================================================
   GlobalHealth portal RBAC foundation.

   Phase 0 contract:
   - Access is controlled by role + permission grants, never by hard-coding
     which page a user can open.
   - Every protected resource is also checked against patient authorization
     (consent / clinical relationship) at the point of access.
   - The same permission catalog is used by Doctor, Hospital, Pharmacy,
     Laboratory, Imaging, Patient and Admin portals.

   Replace the in-memory grants with a backend permission service later without
   changing consuming components.
   ========================================================================== */

export type PortalRole =
  | 'DOCTOR'
  | 'PATIENT'
  | 'HOSPITAL'
  | 'HOSPITAL_OWNER'
  | 'HOSPITAL_ADMINISTRATOR'
  | 'HOSPITAL_DEPARTMENT_MANAGER'
  | 'HOSPITAL_RECEPTIONIST'
  | 'HOSPITAL_DOCTOR'
  | 'HOSPITAL_VERIFICATION_MANAGER'
  | 'HOSPITAL_READ_ONLY'
  | 'PHARMACY_PARTNER'
  | 'PHARMACY_OWNER'
  | 'PHARMACY_ADMINISTRATOR'
  | 'PHARMACY_PHARMACIST'
  | 'PHARMACY_MANAGER'
  | 'PHARMACY_INVENTORY_STAFF'
  | 'PHARMACY_ACCOUNTANT'
  | 'PHARMACY_SUPPORT'
  | 'PHARMACY_DELIVERY'
  | 'LABORATORY'
  | 'IMAGING_PROVIDER'
  | 'ADMIN';

export type Permission =
  | 'portal.access'
  | 'portal.audit.read'
  | 'doctor.dashboard.view'
  | 'doctor.patient.search'
  | 'doctor.patient.read'
  | 'doctor.patient.manage'
  | 'doctor.patient.consent_request'
  | 'doctor.patient.consent_revoke'
  | 'doctor.ehr.read'
  | 'doctor.ehr.write'
  | 'doctor.appointment.manage'
  | 'doctor.schedule.manage'
  | 'doctor.consultation.create'
  | 'doctor.consultation.complete'
  | 'doctor.prescription.create'
  | 'doctor.prescription.sign'
  | 'doctor.prescription.send_pharmacy'
  | 'doctor.lab.order'
  | 'doctor.lab.review'
  | 'doctor.imaging.order'
  | 'doctor.imaging.review'
  | 'doctor.referral.create'
  | 'doctor.referral.update'
  | 'doctor.messaging.send'
  | 'doctor.document.read'
  | 'doctor.document.upload'
  | 'doctor.notifications.read'
  | 'doctor.billing.read'
  | 'doctor.profile.manage'
  | 'doctor.security.manage'
  | 'doctor.audit.read'
  | 'doctor.analytics.view'
  | 'doctor.ai.use'
  | 'patient.profile.read'
  | 'patient.consent.grant'
  | 'hospital.patient.link'
  | 'hospital.dashboard.view'
  | 'hospital.profile.view'
  | 'hospital.profile.manage'
  | 'hospital.departments.manage'
  | 'hospital.doctors.manage'
  | 'hospital.staff.manage'
  | 'hospital.services.manage'
  | 'hospital.specialties.manage'
  | 'hospital.appointments.manage'
  | 'hospital.schedule.manage'
  | 'hospital.patient.read'
  | 'hospital.patient.manage'
  | 'hospital.admissions.manage'
  | 'hospital.beds.manage'
  | 'hospital.emergency.manage'
  | 'hospital.billing.manage'
  | 'hospital.pricing.manage'
  | 'hospital.insurance.manage'
  | 'hospital.lab.manage'
  | 'hospital.imaging.manage'
  | 'hospital.pharmacy.manage'
  | 'hospital.blood.manage'
  | 'hospital.ambulance.manage'
  | 'hospital.reports.view'
  | 'hospital.audit.read'
  | 'hospital.security.manage'
  | 'hospital.settings.manage'
  | 'hospital.documents.manage'
  | 'hospital.verification.manage'
  | 'hospital.notifications.manage'
  | 'hospital.sync.manage'
  | 'hospital.preview.manage'
  | 'hospital.publication.manage'
  | 'hospital.ai.use'
  | 'pharmacy.prescription.receive'
  | 'pharmacy.dashboard.view'
  | 'pharmacy.profile.view'
  | 'pharmacy.profile.manage'
  | 'pharmacy.verification.view'
  | 'pharmacy.verification.manage'
  | 'pharmacy.catalog.manage'
  | 'pharmacy.pricing.manage'
  | 'pharmacy.fees.manage'
  | 'pharmacy.inventory.manage'
  | 'pharmacy.batch.manage'
  | 'pharmacy.orders.manage'
  | 'pharmacy.prescriptions.manage'
  | 'pharmacy.customers.view'
  | 'pharmacy.customers.manage'
  | 'pharmacy.delivery.manage'
  | 'pharmacy.finance.view'
  | 'pharmacy.finance.manage'
  | 'pharmacy.billing.manage'
  | 'pharmacy.suppliers.manage'
  | 'pharmacy.purchaseOrders.manage'
  | 'pharmacy.offers.manage'
  | 'pharmacy.reports.view'
  | 'pharmacy.analytics.view'
  | 'pharmacy.staff.manage'
  | 'pharmacy.audit.read'
  | 'pharmacy.security.manage'
  | 'pharmacy.settings.manage'
  | 'pharmacy.integrations.manage'
  | 'pharmacy.notifications.manage'
  | 'pharmacy.compliance.manage'
  | 'pharmacy.branches.manage'
  | 'pharmacy.sync.manage'
  | 'pharmacy.ai.use'
  | 'lab.order.receive'
  | 'lab.result.upload'
  | 'imaging.order.receive'
  | 'imaging.result.upload'
  | 'admin.doctor.verify'
  | 'admin.doctor.suspend'
  | 'admin.audit.read'
  | 'admin.support.review';

export const ROLE_LABEL: Record<PortalRole, string> = {
  DOCTOR: 'Doctor',
  PATIENT: 'Patient',
  HOSPITAL: 'Hospital',
  HOSPITAL_OWNER: 'Hospital Owner',
  HOSPITAL_ADMINISTRATOR: 'Hospital Administrator',
  HOSPITAL_DEPARTMENT_MANAGER: 'Department Manager',
  HOSPITAL_RECEPTIONIST: 'Receptionist',
  HOSPITAL_DOCTOR: 'Hospital Doctor',
  HOSPITAL_VERIFICATION_MANAGER: 'Verification Manager',
  HOSPITAL_READ_ONLY: 'Read Only',
  PHARMACY_PARTNER: 'Pharmacy Partner',
  PHARMACY_OWNER: 'Pharmacy Owner',
  PHARMACY_ADMINISTRATOR: 'Pharmacy Administrator',
  PHARMACY_PHARMACIST: 'Pharmacist',
  PHARMACY_MANAGER: 'Pharmacist Manager',
  PHARMACY_INVENTORY_STAFF: 'Inventory Staff',
  PHARMACY_ACCOUNTANT: 'Accountant',
  PHARMACY_SUPPORT: 'Support Staff',
  PHARMACY_DELIVERY: 'Delivery Staff',
  LABORATORY: 'Laboratory',
  IMAGING_PROVIDER: 'Imaging Provider',
  ADMIN: 'Administrator',
};

export const DOCTOR_PERMISSIONS: Permission[] = [
  'portal.access',
  'doctor.dashboard.view',
  'doctor.patient.search',
  'doctor.patient.read',
  'doctor.patient.manage',
  'doctor.patient.consent_request',
  'doctor.patient.consent_revoke',
  'doctor.ehr.read',
  'doctor.ehr.write',
  'doctor.appointment.manage',
  'doctor.schedule.manage',
  'doctor.consultation.create',
  'doctor.consultation.complete',
  'doctor.prescription.create',
  'doctor.prescription.sign',
  'doctor.prescription.send_pharmacy',
  'doctor.lab.order',
  'doctor.lab.review',
  'doctor.imaging.order',
  'doctor.imaging.review',
  'doctor.referral.create',
  'doctor.referral.update',
  'doctor.messaging.send',
  'doctor.document.read',
  'doctor.document.upload',
  'doctor.notifications.read',
  'doctor.billing.read',
  'doctor.profile.manage',
  'doctor.security.manage',
  'doctor.audit.read',
  'doctor.analytics.view',
  'doctor.ai.use',
];

export const PATIENT_PERMISSIONS: Permission[] = [
  'portal.access',
  'patient.profile.read',
  'patient.consent.grant',
];

export const HOSPITAL_PERMISSIONS: Permission[] = [
  'portal.access',
  'hospital.patient.link',
  'doctor.appointment.manage',
  'doctor.notifications.read',
  'doctor.analytics.view',
];

export const PHARMACY_PERMISSIONS: Permission[] = [
  'portal.access',
  'pharmacy.prescription.receive',
  'doctor.notifications.read',
];

export const LAB_PERMISSIONS: Permission[] = [
  'portal.access',
  'lab.order.receive',
  'lab.result.upload',
  'doctor.notifications.read',
];

export const IMAGING_PERMISSIONS: Permission[] = [
  'portal.access',
  'imaging.order.receive',
  'imaging.result.upload',
  'doctor.notifications.read',
];

export const ADMIN_PERMISSIONS: Permission[] = [
  'portal.access',
  'portal.audit.read',
  'admin.doctor.verify',
  'admin.doctor.suspend',
  'admin.audit.read',
  'admin.support.review',
  'doctor.notifications.read',
];

const HOSPITAL_VIEW: Permission[] = ['portal.access', 'hospital.dashboard.view', 'hospital.profile.view', 'hospital.reports.view'];

export const HOSPITAL_OWNER_PERMISSIONS: Permission[] = [
  ...HOSPITAL_VIEW,
  'hospital.profile.manage', 'hospital.departments.manage', 'hospital.doctors.manage', 'hospital.staff.manage',
  'hospital.services.manage', 'hospital.specialties.manage', 'hospital.appointments.manage', 'hospital.schedule.manage',
  'hospital.patient.read', 'hospital.patient.manage', 'hospital.admissions.manage', 'hospital.beds.manage',
  'hospital.emergency.manage', 'hospital.billing.manage', 'hospital.pricing.manage', 'hospital.insurance.manage',
  'hospital.lab.manage', 'hospital.imaging.manage', 'hospital.pharmacy.manage', 'hospital.blood.manage',
  'hospital.ambulance.manage', 'hospital.audit.read', 'hospital.security.manage', 'hospital.settings.manage',
  'hospital.documents.manage', 'hospital.verification.manage', 'hospital.notifications.manage',
  'hospital.sync.manage', 'hospital.preview.manage', 'hospital.publication.manage', 'hospital.ai.use',
];

export const HOSPITAL_ADMINISTRATOR_PERMISSIONS: Permission[] = [
  ...HOSPITAL_OWNER_PERMISSIONS,
];

export const HOSPITAL_DEPARTMENT_MANAGER_PERMISSIONS: Permission[] = [
  ...HOSPITAL_VIEW,
  'hospital.departments.manage', 'hospital.services.manage', 'hospital.specialties.manage',
  'hospital.appointments.manage', 'hospital.schedule.manage', 'hospital.patient.read',
  'hospital.admissions.manage', 'hospital.beds.manage', 'hospital.lab.manage', 'hospital.imaging.manage',
  'hospital.pharmacy.manage', 'hospital.blood.manage', 'hospital.emergency.manage',
];

export const HOSPITAL_RECEPTIONIST_PERMISSIONS: Permission[] = [
  ...HOSPITAL_VIEW,
  'hospital.appointments.manage', 'hospital.patient.read', 'hospital.patient.manage', 'hospital.billing.manage',
  'hospital.admissions.manage', 'hospital.beds.manage', 'hospital.pharmacy.manage',
];

export const HOSPITAL_DOCTOR_PERMISSIONS: Permission[] = [
  ...HOSPITAL_VIEW,
  'hospital.patient.read', 'hospital.patient.manage', 'hospital.appointments.manage',
  'hospital.schedule.manage', 'hospital.lab.manage', 'hospital.imaging.manage',
  'hospital.pharmacy.manage', 'hospital.emergency.manage', 'hospital.ai.use',
];

export const HOSPITAL_VERIFICATION_MANAGER_PERMISSIONS: Permission[] = [
  ...HOSPITAL_VIEW,
  'hospital.verification.manage', 'hospital.documents.manage', 'hospital.reports.view', 'hospital.sync.manage',
];

export const HOSPITAL_READ_ONLY_PERMISSIONS: Permission[] = [
  ...HOSPITAL_VIEW,
  'hospital.audit.read', 'hospital.patient.read',
];

const PHARMACY_VIEW: Permission[] = ['portal.access', 'pharmacy.dashboard.view', 'pharmacy.profile.view'];

export const PHARMACY_OWNER_PERMISSIONS: Permission[] = [
  ...PHARMACY_VIEW,
  'pharmacy.profile.manage', 'pharmacy.verification.view', 'pharmacy.verification.manage',
  'pharmacy.catalog.manage', 'pharmacy.pricing.manage', 'pharmacy.fees.manage',
  'pharmacy.inventory.manage', 'pharmacy.batch.manage', 'pharmacy.orders.manage',
  'pharmacy.prescriptions.manage', 'pharmacy.customers.view', 'pharmacy.customers.manage',
  'pharmacy.delivery.manage', 'pharmacy.finance.view', 'pharmacy.finance.manage',
  'pharmacy.billing.manage', 'pharmacy.suppliers.manage', 'pharmacy.purchaseOrders.manage',
  'pharmacy.offers.manage', 'pharmacy.reports.view', 'pharmacy.analytics.view',
  'pharmacy.staff.manage', 'pharmacy.audit.read', 'pharmacy.security.manage',
  'pharmacy.settings.manage', 'pharmacy.integrations.manage', 'pharmacy.notifications.manage',
  'pharmacy.compliance.manage', 'pharmacy.branches.manage', 'pharmacy.sync.manage', 'pharmacy.ai.use',
];

export const PHARMACY_ADMINISTRATOR_PERMISSIONS: Permission[] = [
  ...PHARMACY_OWNER_PERMISSIONS,
];

export const PHARMACY_PHARMACIST_PERMISSIONS: Permission[] = [
  ...PHARMACY_VIEW,
  'pharmacy.catalog.manage', 'pharmacy.inventory.manage', 'pharmacy.batch.manage',
  'pharmacy.orders.manage', 'pharmacy.prescriptions.manage', 'pharmacy.customers.view',
  'pharmacy.delivery.manage', 'pharmacy.offers.manage', 'pharmacy.ai.use',
];

export const PHARMACY_MANAGER_PERMISSIONS: Permission[] = [
  ...PHARMACY_VIEW,
  'pharmacy.catalog.manage', 'pharmacy.pricing.manage', 'pharmacy.inventory.manage',
  'pharmacy.batch.manage', 'pharmacy.orders.manage', 'pharmacy.prescriptions.manage',
  'pharmacy.customers.view', 'pharmacy.delivery.manage', 'pharmacy.finance.view',
  'pharmacy.suppliers.manage', 'pharmacy.purchaseOrders.manage', 'pharmacy.offers.manage',
  'pharmacy.analytics.view', 'pharmacy.reports.view', 'pharmacy.branches.manage',
  'pharmacy.notifications.manage', 'pharmacy.ai.use',
];

export const PHARMACY_INVENTORY_STAFF_PERMISSIONS: Permission[] = [
  ...PHARMACY_VIEW,
  'pharmacy.catalog.manage', 'pharmacy.inventory.manage', 'pharmacy.batch.manage',
  'pharmacy.customers.view', 'pharmacy.notifications.manage',
];

export const PHARMACY_ACCOUNTANT_PERMISSIONS: Permission[] = [
  ...PHARMACY_VIEW,
  'pharmacy.finance.view', 'pharmacy.billing.manage', 'pharmacy.reports.view',
  'pharmacy.analytics.view', 'pharmacy.audit.read', 'pharmacy.notifications.manage',
];

export const PHARMACY_SUPPORT_PERMISSIONS: Permission[] = [
  ...PHARMACY_VIEW,
  'pharmacy.orders.manage', 'pharmacy.customers.view', 'pharmacy.notifications.manage',
];

export const PHARMACY_DELIVERY_PERMISSIONS: Permission[] = [
  ...PHARMACY_VIEW,
  'pharmacy.orders.manage', 'pharmacy.delivery.manage', 'pharmacy.customers.view',
  'pharmacy.notifications.manage',
];

export const PHARMACY_ROLE_PERMISSIONS: Partial<Record<PortalRole, Permission[]>> = {
  PHARMACY_PARTNER: PHARMACY_OWNER_PERMISSIONS,
  PHARMACY_OWNER: PHARMACY_OWNER_PERMISSIONS,
  PHARMACY_ADMINISTRATOR: PHARMACY_ADMINISTRATOR_PERMISSIONS,
  PHARMACY_PHARMACIST: PHARMACY_PHARMACIST_PERMISSIONS,
  PHARMACY_MANAGER: PHARMACY_MANAGER_PERMISSIONS,
  PHARMACY_INVENTORY_STAFF: PHARMACY_INVENTORY_STAFF_PERMISSIONS,
  PHARMACY_ACCOUNTANT: PHARMACY_ACCOUNTANT_PERMISSIONS,
  PHARMACY_SUPPORT: PHARMACY_SUPPORT_PERMISSIONS,
  PHARMACY_DELIVERY: PHARMACY_DELIVERY_PERMISSIONS,
};

export const HOSPITAL_ROLE_PERMISSIONS: Partial<Record<PortalRole, Permission[]>> = {
  HOSPITAL: HOSPITAL_OWNER_PERMISSIONS,
  HOSPITAL_OWNER: HOSPITAL_OWNER_PERMISSIONS,
  HOSPITAL_ADMINISTRATOR: HOSPITAL_ADMINISTRATOR_PERMISSIONS,
  HOSPITAL_DEPARTMENT_MANAGER: HOSPITAL_DEPARTMENT_MANAGER_PERMISSIONS,
  HOSPITAL_RECEPTIONIST: HOSPITAL_RECEPTIONIST_PERMISSIONS,
  HOSPITAL_DOCTOR: HOSPITAL_DOCTOR_PERMISSIONS,
  HOSPITAL_VERIFICATION_MANAGER: HOSPITAL_VERIFICATION_MANAGER_PERMISSIONS,
  HOSPITAL_READ_ONLY: HOSPITAL_READ_ONLY_PERMISSIONS,
};

export const ROLE_PERMISSIONS: Record<PortalRole, Permission[]> = {
  DOCTOR: DOCTOR_PERMISSIONS,
  PATIENT: PATIENT_PERMISSIONS,
  HOSPITAL: HOSPITAL_OWNER_PERMISSIONS,
  HOSPITAL_OWNER: HOSPITAL_OWNER_PERMISSIONS,
  HOSPITAL_ADMINISTRATOR: HOSPITAL_ADMINISTRATOR_PERMISSIONS,
  HOSPITAL_DEPARTMENT_MANAGER: HOSPITAL_DEPARTMENT_MANAGER_PERMISSIONS,
  HOSPITAL_RECEPTIONIST: HOSPITAL_RECEPTIONIST_PERMISSIONS,
  HOSPITAL_DOCTOR: HOSPITAL_DOCTOR_PERMISSIONS,
  HOSPITAL_VERIFICATION_MANAGER: HOSPITAL_VERIFICATION_MANAGER_PERMISSIONS,
  HOSPITAL_READ_ONLY: HOSPITAL_READ_ONLY_PERMISSIONS,
  PHARMACY_PARTNER: PHARMACY_OWNER_PERMISSIONS,
  PHARMACY_OWNER: PHARMACY_OWNER_PERMISSIONS,
  PHARMACY_ADMINISTRATOR: PHARMACY_ADMINISTRATOR_PERMISSIONS,
  PHARMACY_PHARMACIST: PHARMACY_PHARMACIST_PERMISSIONS,
  PHARMACY_MANAGER: PHARMACY_MANAGER_PERMISSIONS,
  PHARMACY_INVENTORY_STAFF: PHARMACY_INVENTORY_STAFF_PERMISSIONS,
  PHARMACY_ACCOUNTANT: PHARMACY_ACCOUNTANT_PERMISSIONS,
  PHARMACY_SUPPORT: PHARMACY_SUPPORT_PERMISSIONS,
  PHARMACY_DELIVERY: PHARMACY_DELIVERY_PERMISSIONS,
  LABORATORY: LAB_PERMISSIONS,
  IMAGING_PROVIDER: IMAGING_PERMISSIONS,
  ADMIN: ADMIN_PERMISSIONS,
};

export function hasPermission(role: PortalRole | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: PortalRole | null | undefined, permissions: Permission[]): boolean {
  if (!role) return false;
  return permissions.some((p) => hasPermission(role, p));
}

export function assertPermission(role: PortalRole | null | undefined, permission: Permission): boolean {
  return hasPermission(role, permission);
}

/**
 * Patient-level authorization gate. A physician can access a patient record
 * only when a clinical relationship exists AND consent is granted for the
 * requested scope — or an explicit urgent/critical safety path is required.
 */
export interface PatientAuthorization {
  role: PortalRole | null;
  relationship: 'none' | 'own_patient' | 'consulting' | 'emergency';
  consentStatus: 'not_requested' | 'pending' | 'granted' | 'denied' | 'expired';
  scope: 'basic' | 'history' | 'labs' | 'imaging' | 'prescriptions' | 'documents';
}

export function canAccessPatientData(auth: PatientAuthorization): boolean {
  if (!auth.role) return false;
  if (auth.role === 'ADMIN') return hasPermission('ADMIN', 'admin.audit.read');
  if (auth.role !== 'DOCTOR') return false;
  if (auth.relationship === 'emergency') return true; // limited safety-only access, audited separately
  if (auth.relationship === 'none') return false;
  if (auth.consentStatus === 'denied' || auth.consentStatus === 'expired') return false;
  if (auth.consentStatus === 'not_requested' && auth.scope !== 'basic') return false;
  if (auth.consentStatus === 'pending' && auth.scope !== 'basic') return false;
  return true;
}
