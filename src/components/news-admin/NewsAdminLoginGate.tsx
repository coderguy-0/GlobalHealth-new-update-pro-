import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { newsFetch, getAdminToken, getAdminProfile, clearAdminSession, ServerAdmin } from '../../services/newsGovernanceClient';
import { NewsManagementLogin } from '../NewsManagementLogin';

/**
 * Compact gate for the server-backed governance pages. Reuses the unified
 * News Management login; the administrator identity is validated against
 * the server on mount (stale local mirrors trigger re-validation).
 */
export const NewsAdminLoginGate: React.FC<{ onAuthenticated: () => void }> = ({ onAuthenticated }) => {
  const [admin, setAdmin] = useState<ServerAdmin | null>(() => getAdminProfile());
  const [checking, setChecking] = useState(!!getAdminToken());
  const firedRef = useRef(false);

  useEffect(() => {
    (async () => {
      if (firedRef.current) return;
      if (getAdminToken()) {
        try {
          const r = await newsFetch<{ admin: ServerAdmin }>('/api/news/admin/me', { token: getAdminToken() });
          if (firedRef.current) return;
          firedRef.current = true;
          setAdmin(r.admin);
          setChecking(false);
          onAuthenticated();
          return;
        } catch {
          clearAdminSession();
          setAdmin(null);
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
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Verifying administrator session…
      </div>
    );
  }

  if (admin) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
        <ShieldCheck className="h-4 w-4" />
        {admin.name} ({admin.role.replace('_', ' ')}) — {admin.title}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-teal-700" />
        <h4 className="text-sm font-extrabold text-slate-800">News Management Access</h4>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">Administrator only</span>
      </div>
      <p className="mb-2 text-xs text-slate-500">
        Authorization is enforced server-side on every action. Verified authorities are routed to their own dashboard.
      </p>
      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-2">
        <NewsManagementLogin
          standalone={false}
          onAuthenticated={(result) => {
            if (result.accountType === 'admin' && result.admin) {
              setAdmin(result.admin);
              onAuthenticated();
            } else if (result.accountType === 'authority') {
              // Never route an authority into the admin area.
              window.location.hash = 'news-authority';
            }
          }}
        />
      </div>
    </div>
  );
};
