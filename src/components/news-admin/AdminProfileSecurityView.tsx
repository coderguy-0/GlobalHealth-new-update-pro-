import React, { useCallback, useEffect, useState } from 'react';
import {
  UserRound, ShieldCheck, KeyRound, MonitorSmartphone, History,
  Loader2, LogOut, BadgeCheck
} from 'lucide-react';
import { useLocalization } from '../../context/LocalizationContext';
import { newsAuthService } from '../../services/newsAuthService';
import {
  newsFetch, getAdminToken, getAdminProfile, clearAdminSession, clearAuthorityToken,
  ServerAdmin
} from '../../services/newsGovernanceClient';
import { StaffMember } from '../../types';

interface SessionRow {
  sessionId: string;
  createdAt: string;
  lastActive: string;
  isCurrent: boolean;
}
interface AuditRow {
  auditId: string;
  actorId?: string;
  timestamp: string;
  action: string;
  targetTitle?: string;
  result: string;
  reason?: string;
}

const fmt = (iso?: string | null) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
};

/**
 * Administrator Profile & Security: identity, assigned permissions (from the
 * server), active sessions with terminate-all, and the administrator's own
 * recent actions from the immutable news audit trail.
 */
export const AdminProfileSecurityView: React.FC = () => {
  const { t } = useLocalization();
  const staff: StaffMember | null = newsAuthService.getCurrentStaffUser();
  const admin = getAdminProfile();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [myActions, setMyActions] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = getAdminToken();
      const [s, a] = await Promise.all([
        newsFetch<{ sessions: SessionRow[] }>('/api/news/admin/sessions', { token }),
        newsFetch<{ logs: AuditRow[] }>('/api/news/admin/audit-logs', { token }).catch(() => ({ logs: [] }))
      ]);
      setSessions(s.sessions || []);
      const mine = admin
        ? (a.logs || []).filter((l) => l.actorId === admin.adminId).slice(0, 25)
        : [];
      setMyActions(mine);
    } catch (e: any) {
      setError(e.message || 'Could not load your security information.');
    } finally {
      setLoading(false);
    }
  }, [admin]);

  useEffect(() => { load(); }, [load]);

  const signOutAllOther = async () => {
    setBusy(true);
    setError('');
    try {
      const r = await newsFetch<{ terminated: number }>('/api/news/admin/sessions/terminate-all', {
        method: 'POST',
        token: getAdminToken()
      });
      setNotice(`${r.terminated} other session(s) were signed out.`);
      load();
    } catch (e: any) {
      setError(e.message || 'Could not sign out other sessions.');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    const token = getAdminToken();
    if (token) {
      newsFetch('/api/news/logout', { method: 'POST', token }).catch(() => {});
    }
    clearAdminSession();
    clearAuthorityToken();
    newsAuthService.logout();
    window.location.hash = 'news';
  };

  const permissions = (admin?.permissions || staff?.permissions || []) as string[];
  const permGroups: { label: string; keys: string[] }[] = [
    { label: 'Content', keys: ['news.view', 'news.create', 'news.edit', 'news.delete', 'news.permanent_delete', 'news.archive', 'news.restore'] },
    { label: 'Publishing', keys: ['news.publish', 'news.unpublish', 'news.schedule', 'news.cancel_schedule'] },
    { label: 'Review & Quality', keys: ['news.review', 'news.approve', 'news.reject', 'news.request_changes', 'news.manage_comments'] },
    { label: 'Taxonomy & Media', keys: ['news.manage_categories', 'news.manage_tags', 'news.manage_authors', 'news.manage_media', 'news.manage_seo'] },
    { label: 'High-Impact', keys: ['news.manage_featured', 'news.manage_breaking_news'] },
    { label: 'Security & Analytics', keys: ['news.view_audit_logs', 'news.view_analytics', 'news.export', 'news.manage_permissions', 'news.admin_override'] }
  ];

  return (
    <div className="p-6">
      <div className="mb-1 text-base font-extrabold text-slate-900">{t('Profile & Security')}</div>
      <p className="mb-4 text-xs text-slate-500">
        Your individual administrator account, server-assigned permissions, and active sessions. Every action you
        perform is attributed to this account in the news audit trail.
      </p>

      {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
      {notice && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{notice}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Account */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-800">
              <UserRound className="h-4 w-4 text-teal-700" /> Account
            </h4>
            <div className="space-y-2 text-xs">
              <InfoRow label="Name" value={staff?.name || '—'} strong />
              <InfoRow label="Professional role" value={(admin?.title) || '—'} />
              <InfoRow label="Account email" value={staff?.email || '—'} />
              <InfoRow
                label="Role"
                value={<span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 px-2 py-0.5 text-[10px] font-bold text-teal-800"><BadgeCheck className="h-3 w-3" />{(staff?.role || '—').replace('_', ' ')}</span>}
              />
              <InfoRow label="MFA" value={admin?.mfaEnabled ? <span className="text-emerald-700 font-bold">Required — enforced at sign-in</span> : 'Not required'} />
            </div>
          </div>

          {/* Permissions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-800">
              <KeyRound className="h-4 w-4 text-teal-700" /> Assigned Permissions
            </h4>
            <p className="mb-3 text-[11px] text-slate-500">
              Granted by GlobalHealth administration and enforced server-side on every action. You cannot change
              your own role or permissions.
            </p>
            <div className="space-y-2.5">
              {permGroups.map((g) => {
                const owned = g.keys.filter((k) => permissions.includes(k));
                if (owned.length === 0) return null;
                return (
                  <div key={g.label}>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{g.label}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {owned.map((k) => (
                        <span key={k} className="rounded-md bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                          {k.replace('news.', '')}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
              {permissions.length === 0 && <p className="text-xs text-slate-500">No permissions assigned.</p>}
            </div>
          </div>

          {/* Sessions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-800">
              <MonitorSmartphone className="h-4 w-4 text-teal-700" /> Active Sessions
            </h4>
            {sessions.length === 0 ? (
              <p className="text-xs text-slate-500">No active sessions detected.</p>
            ) : (
              <div className="space-y-2">
                {sessions.map((s) => (
                  <div key={s.sessionId} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs">
                    <div>
                      <div className="font-mono text-slate-600">{s.sessionId}</div>
                      <div className="text-slate-400">Since {fmt(s.createdAt)} · active {fmt(s.lastActive)}</div>
                    </div>
                    {s.isCurrent && (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        This session
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={signOutAllOther}
                disabled={busy}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Sign Out of All Other Sessions
              </button>
              <button onClick={signOut} className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700">
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </div>
          </div>

          {/* My actions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-800">
              <History className="h-4 w-4 text-teal-700" /> Your Recent Actions
            </h4>
            <p className="mb-2 text-[11px] text-slate-500">From the immutable news audit trail — attributed to your individual account.</p>
            {myActions.length === 0 ? (
              <p className="text-xs text-slate-500">No recent actions recorded.</p>
            ) : (
              <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
                {myActions.map((l) => (
                  <div key={l.auditId} className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-600">
                    <span className="font-bold text-slate-700">{l.action.replace(/_/g, ' ')}</span>
                    {l.targetTitle ? <span> — {l.targetTitle}</span> : null}
                    <span className="text-slate-400"> · {fmt(l.timestamp)}</span>
                    <span className="capitalize"> · {l.result}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: React.ReactNode; strong?: boolean }> = ({ label, value, strong }) => (
  <div className="flex items-start justify-between gap-3">
    <span className="text-slate-400">{label}</span>
    <span className={`text-right ${strong ? 'font-bold text-slate-800' : 'text-slate-600'}`}>{value}</span>
  </div>
);
