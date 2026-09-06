/* ============================================================================
   GlobalHealth Pharmacy Partner Portal access foundation.

   Maps pharmacy staff roles onto the shared PortalRole permission catalogue.
   Every protected tab/action asks these permissions instead of hard-coding its
   own access check.
   ========================================================================== */

import { hasAnyPermission, hasPermission, Permission, PortalRole, ROLE_PERMISSIONS, PHARMACY_ROLE_PERMISSIONS } from './portalRoles';

export type PharmacyStaffRole =
  | 'Pharmacy Owner'
  | 'Pharmacy Administrator'
  | 'Pharmacist'
  | 'Inventory Manager'
  | 'Order Manager'
  | 'Finance Manager'
  | 'Delivery Coordinator';

export const PHARMACY_STAFF_ROLE_LABEL: Record<PharmacyStaffRole, string> = {
  'Pharmacy Owner': 'Owner',
  'Pharmacy Administrator': 'Administrator',
  'Pharmacist': 'Pharmacist',
  'Inventory Manager': 'Inventory Manager',
  'Order Manager': 'Order Manager',
  'Finance Manager': 'Finance Manager',
  'Delivery Coordinator': 'Delivery Coordinator',
};

export const PHARMACY_STAFF_ROLE_TO_PORTAL_ROLE: Record<PharmacyStaffRole, PortalRole> = {
  'Pharmacy Owner': 'PHARMACY_OWNER',
  'Pharmacy Administrator': 'PHARMACY_ADMINISTRATOR',
  'Pharmacist': 'PHARMACY_PHARMACIST',
  'Inventory Manager': 'PHARMACY_INVENTORY_STAFF',
  'Order Manager': 'PHARMACY_MANAGER',
  'Finance Manager': 'PHARMACY_ACCOUNTANT',
  'Delivery Coordinator': 'PHARMACY_DELIVERY',
};

export function pharmacyPortalRole(role: PharmacyStaffRole | string | null | undefined): PortalRole {
  if (!role) return 'PHARMACY_PARTNER';
  return PHARMACY_STAFF_ROLE_TO_PORTAL_ROLE[role as PharmacyStaffRole] ?? 'PHARMACY_PARTNER';
}

function isPortalRole(role: string | null | undefined): role is PortalRole {
  return typeof role === 'string' && role in ROLE_PERMISSIONS;
}

export function pharmacyHasPermission(role: PharmacyStaffRole | string | null | undefined, permission: Permission): boolean {
  const portalRole = isPortalRole(role) ? role : pharmacyPortalRole(role);
  return hasPermission(portalRole, permission) || hasPermission('PHARMACY_PARTNER', permission);
}

export function pharmacyHasAnyPermission(role: PharmacyStaffRole | string | null | undefined, permissions: Permission[]): boolean {
  const portalRole = isPortalRole(role) ? role : pharmacyPortalRole(role);
  return hasAnyPermission(portalRole, permissions) || hasAnyPermission('PHARMACY_PARTNER', permissions);
}

export function pharmacyRolePermissions(role: PharmacyStaffRole | string | null | undefined): Permission[] {
  const portalRole = isPortalRole(role) ? role : pharmacyPortalRole(role);
  return PHARMACY_ROLE_PERMISSIONS[portalRole] ?? PHARMACY_ROLE_PERMISSIONS.PHARMACY_PARTNER ?? [];
}
