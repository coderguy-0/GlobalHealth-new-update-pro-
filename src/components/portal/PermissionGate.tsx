import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { Lock } from 'lucide-react';
import { hasPermission, Permission, PortalRole } from '../../core/portalRoles';

/* ============================================================================
   Portal permission gate and hook.

   Components ask "can the current role do X?" instead of hard-coding page
   access. The component tree stays presentational; authorization stays in one
   place.
   ========================================================================== */

interface RoleContextValue {
  role: PortalRole | null;
  can: (permission: Permission) => boolean;
  canAny: (permissions: Permission[]) => boolean;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export const PortalRoleProvider: React.FC<{ role: PortalRole | null; children: React.ReactNode }> = ({ role, children }) => {
  const can = useCallback((permission: Permission) => hasPermission(role, permission), [role]);
  const canAny = useCallback((permissions: Permission[]) => permissions.some((p) => can(p)), [can]);
  const value = useMemo(() => ({ role, can, canAny }), [role, can, canAny]);
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export function usePortalRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('usePortalRole must be used within PortalRoleProvider');
  return ctx;
}

interface PermissionGateProps {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/** Hides a protected section when the current role lacks `permission`. */
export const PermissionGate: React.FC<PermissionGateProps> = ({ permission, fallback, children }) => {
  const { can } = usePortalRole();
  if (can(permission)) return <>{children}</>;
  if (fallback) return <>{fallback}</>;
  return <AccessDenied permission={permission} />;
};

export const AccessDenied: React.FC<{ permission?: Permission; title?: string; message?: string }> = ({ permission, title = 'Access restricted', message }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-soft">
    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-500"><Lock className="h-5 w-5" /></span>
    <p className="mt-4 text-sm font-bold text-slate-800">{title}</p>
    <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
      {message || `Your role does not include the required permission${permission ? ` (${permission})` : ''} for this area.`}
    </p>
  </div>
);
