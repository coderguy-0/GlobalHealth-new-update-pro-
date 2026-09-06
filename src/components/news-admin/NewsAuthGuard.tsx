import React, { useEffect, useRef, useState } from 'react';
import { Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { StaffMember } from '../../types';
import { newsFetch, getAdminToken, getAdminProfile, clearAdminSession, ServerAdmin } from '../../services/newsGovernanceClient';
import { NewsManagementLogin } from '../NewsManagementLogin';

interface NewsAuthGuardProps {
  onSuccess: (staff: StaffMember) => void;
  onBackToPublic: () => void;
}

function mapServerAdminToStaff(admin: ServerAdmin): StaffMember {
  return {
    id: admin.adminId,
    name: admin.name,
    email: admin.email,
    role: admin.role as StaffMember['role'],
    status: admin.status === 'active' ? 'active' : 'suspended',
    permissions: admin.permissions as StaffMember['permissions'],
    accountCreated: admin.title || '',
    lastLogin: new Date().toISOString(),
    mfaEnabled: admin.mfaEnabled,
    notes: admin.title
  };
}

/**
 * Server-validated gate for the News Management CMS. The administrator
 * identity and permissions come from the server session (never from
 * client storage alone); a stale local mirror triggers re-validation.
 * Sign-in uses the unified News Management login (same infrastructure as
 * the public News Management entry point).
 */
export const NewsAuthGuard: React.FC<NewsAuthGuardProps> = ({ onSuccess, onBackToPublic }) => {
  const [checking, setChecking] = useState(true);
  const firedRef = useRef(false);

  useEffect(() => {
    (async () => {
      if (firedRef.current) return;
      if (getAdminToken() && getAdminProfile()) {
        try {
          const r = await newsFetch<{ admin: ServerAdmin }>('/api/news/admin/me', { token: getAdminToken() });
          if (firedRef.current) return;
          firedRef.current = true;
          setChecking(false);
          onSuccess(mapServerAdminToStaff(r.admin));
          return;
        } catch {
          clearAdminSession();
        }
      }
      if (!firedRef.current) {
        firedRef.current = true;
        setChecking(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Verifying administrator session…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <NewsManagementLogin
        standalone
        onExit={onBackToPublic}
        onAuthenticated={(result) => {
          if (result.accountType === 'admin' && result.admin) {
            onSuccess(mapServerAdminToStaff(result.admin));
          } else if (result.accountType === 'authority') {
            // A verified authority reaching the CMS is NEVER routed into the
            // administrator dashboard — always to their own dashboard.
            window.location.hash = 'news-authority';
          }
        }}
      />
      <div className="mx-auto max-w-md px-4 pb-10">
        <button
          onClick={onBackToPublic}
          className="mx-auto flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to public news
        </button>
      </div>
      <div className="sr-only" aria-live="polite">
        <ShieldCheck /> News Management access is restricted to authorized administrators and verified authorities.
      </div>
    </div>
  );
};
