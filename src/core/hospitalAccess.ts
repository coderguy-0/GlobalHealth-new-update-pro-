/* ============================================================================
   GlobalHealth Hospital Portal access foundation.

   The Hospital Portal uses staff roles (owner, administrator, department
   manager, receptionist, doctor, verification manager, read-only) and maps
   them onto the shared portal permission catalog. No page hard-codes access;
   every protected view/action asks the permission catalogue.

   Backend replacement: this module becomes a thin mapping around an identity
   service response; consuming components do not change.
   ========================================================================== */

import { HOSPITAL_ROLE_PERMISSIONS, hasAnyPermission, hasPermission, Permission, PortalRole } from './portalRoles';

export type HospitalStaffRole =
  | 'owner'
  | 'administrator'
  | 'department_manager'
  | 'receptionist'
  | 'doctor'
  | 'verification_manager'
  | 'read_only';

export const HOSPITAL_STAFF_ROLE_LABEL: Record<HospitalStaffRole, string> = {
  owner: 'Owner',
  administrator: 'Administrator',
  department_manager: 'Department Manager',
  receptionist: 'Receptionist',
  doctor: 'Doctor',
  verification_manager: 'Verification Manager',
  read_only: 'Read Only',
};

export const STAFF_ROLE_TO_PORTAL_ROLE: Record<HospitalStaffRole, PortalRole> = {
  owner: 'HOSPITAL_OWNER',
  administrator: 'HOSPITAL_ADMINISTRATOR',
  department_manager: 'HOSPITAL_DEPARTMENT_MANAGER',
  receptionist: 'HOSPITAL_RECEPTIONIST',
  doctor: 'HOSPITAL_DOCTOR',
  verification_manager: 'HOSPITAL_VERIFICATION_MANAGER',
  read_only: 'HOSPITAL_READ_ONLY',
};

export function portalRoleForStaffRole(role: HospitalStaffRole | string | null | undefined): PortalRole {
  if (!role) return 'HOSPITAL_READ_ONLY';
  return STAFF_ROLE_TO_PORTAL_ROLE[role as HospitalStaffRole] ?? 'HOSPITAL';
}

export function hospitalHasPermission(role: HospitalStaffRole | string | null | undefined, permission: Permission): boolean {
  const portalRole = portalRoleForStaffRole(role);
  return hasPermission(portalRole, permission) || hasPermission('HOSPITAL', permission);
}

export function hospitalHasAnyPermission(role: HospitalStaffRole | string | null | undefined, permissions: Permission[]): boolean {
  const portalRole = portalRoleForStaffRole(role);
  return hasAnyPermission(portalRole, permissions) || hasAnyPermission('HOSPITAL', permissions);
}

export function hospitalRolePermissions(role: HospitalStaffRole | string | null | undefined): Permission[] {
  const portalRole = portalRoleForStaffRole(role);
  const permissions = HOSPITAL_ROLE_PERMISSIONS[portalRole];
  return permissions ?? HOSPITAL_ROLE_PERMISSIONS.HOSPITAL ?? [];
}
