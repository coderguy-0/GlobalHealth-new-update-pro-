import React, { useCallback, useEffect, useState } from 'react';
import {
  Building2, ShieldCheck, Ban, XCircle, RefreshCw, Loader2, Search, KeyRound
} from 'lucide-react';
import { newsFetch, NewsGovError, getAdminToken } from '../../services/newsGovernanceClient';
import { NewsAdminLoginGate } from './NewsAdminLoginGate';

interface AuthorityRow {
  authorityId: string;
  profile: { orgName: string; orgType: string; website: string; contactName: string; contactEmail: string; representativeName: string; representativeRole: string };
  state: string;
  suspended: boolean;
  permissions: { canSubmit: boolean; canPublish: boolean; categories: string[] };
  appliedAt: string;
  verificationRecord?: { reviewer: string; reviewedAt: string; decision: string; reason: string } | null;
  suspensionRecord?: { reviewer: string; at: string; reason: string } | null;
}

const STATE_CLS: Record<string, string> = {
  VERIFIED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  VERIFIED_RESTRICTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  SUSPENDED: 'bg-rose-50 text-rose-700 border-rose-200',
  REVOKED: 'bg-rose-50 text-rose-700 border-rose-200',
  PENDING_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
  UNDER_REVIEW: 'bg-sky-50 text-sky-700 border-sky-200',
  MORE_INFO_REQUIRED: 'bg-orange-50 text-orange-700 border-orange-200',
  REJECTED: 'bg-slate-100 text-slate-500 border-slate-200'
};

const fmt = (iso?: string | null) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return iso; }
};

export const VerifiedAuthoritiesView: React.FC = () => {
  const [authed, setAuthed] = useState(!!getAdminToken());
  const [authorities, setAuthorities] = useState<AuthorityRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [action, setAction] = useState<{ auth: AuthorityRow; kind: 'suspend' | 'revoke' | 'restore' } | null>(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const r = await newsFetch<{ authorities: AuthorityRow[] }>('/api/news/admin/authorities', { token: getAdminToken() });
      setAuthorities(r.authorities || []);
    } catch (e: any) {
      if (e instanceof NewsGovError && e.status === 401) setAuthed(false);
      else setError(e.message || 'Could not load authorities.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (authed) load(); }, [authed, load]);

  if (!authed) {
    return (
      <div className="p-6">
        <h3 className="mb-1 text-base font-extrabold text-slate-900">Verified Authorities</h3>
        <p className="mb-4 text-xs text-slate-500">Manage verified organizations: suspend, revoke verification, restore.</p>
        <NewsAdminLoginGate onAuthenticated={() => setAuthed(true)} />
      </div>
    );
  }

  const doAction = async () => {
    if (!action) return;
    setBusy(true);
    setError('');
    try {
      await newsFetch(`/api/news/admin/authorities/${action.auth.authorityId}/${action.kind}`, {
        method: 'POST',
        token: getAdminToken(),
        body: { reason: reason.trim() || undefined }
      });
      setAction(null);
      setReason('');
      await load();
    } catch (e: any) {
      setError(e.message || 'Action failed.');
    } finally {
      setBusy(false);
    }
  };

  const filtered = authorities.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return a.profile.orgName.toLowerCase().includes(q) || a.profile.orgType.toLowerCase().includes(q);
  });

  const verified = filtered.filter((a) => ['VERIFIED', 'VERIFIED_RESTRICTED'].includes(a.state));
  const inactive = filtered.filter((a) => ['SUSPENDED', 'REVOKED'].includes(a.state));
  const pipeline = filtered.filter((a) => ['PENDING_REVIEW', 'UNDER_REVIEW', 'MORE_INFO_REQUIRED'].includes(a.state));

  return (
    <div className="p-6">
      {authed && <NewsAdminLoginGate onAuthenticated={() => setAuthed(true)} />}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Verified Authorities</h3>
          <p className="text-xs text-slate-500">Suspension immediately blocks submissions; published articles remain under review. Revocation removes all permissions.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="inp w-52 pl-8" />
        </div>
      </div>

      {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…</div>
      ) : (
        <div className="space-y-5">
          {verified.length > 0 && <AuthorityGroup title="Active authorities" rows={verified} onAction={setAction} />}
          {inactive.length > 0 && <AuthorityGroup title="Suspended / revoked" rows={inactive} onAction={setAction} />}
          {pipeline.length > 0 && <AuthorityGroup title="In verification pipeline" rows={pipeline} onAction={setAction} />}
          {filtered.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-sm text-slate-500">No authorities found.</p>
          )}
        </div>
      )}

      {action && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" onClick={() => !busy && setAction(null)}>
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              {action.kind === 'suspend' && <Ban className="h-5 w-5 text-rose-600" />}
              {action.kind === 'revoke' && <XCircle className="h-5 w-5 text-rose-600" />}
              {action.kind === 'restore' && <RefreshCw className="h-5 w-5 text-emerald-600" />}
              <h4 className="text-lg font-extrabold text-slate-900">
                {action.kind === 'suspend' ? 'Suspend' : action.kind === 'revoke' ? 'Revoke verification' : 'Restore'} {action.auth.profile.orgName}
              </h4>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {action.kind === 'suspend'
                ? 'The organization is immediately blocked from submitting. Existing published articles remain and stay subject to review.'
                : action.kind === 'revoke'
                  ? 'All permissions are removed and the verification record is preserved in the audit trail.'
                  : 'The account is restored to VERIFIED (restricted) status. Full verification must be re-decided if desired.'}
            </p>
            {action.kind !== 'restore' && (
              <label className="mt-3 block">
                <span className="text-xs font-bold text-slate-500">Reason * (min 10 characters)</span>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className="inp mt-1" />
              </label>
            )}
            <div className="mt-4 flex gap-2">
              <button disabled={busy} onClick={() => setAction(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
              <button
                disabled={busy || (action.kind !== 'restore' && reason.trim().length < 10)}
                onClick={doAction}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-50 ${action.kind === 'restore' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />} Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AuthorityGroup: React.FC<{ title: string; rows: AuthorityRow[]; onAction: (a: { auth: AuthorityRow; kind: 'suspend' | 'revoke' | 'restore' }) => void }> = ({ title, rows, onAction }) => (
  <section>
    <h4 className="mb-2 text-sm font-bold text-slate-700">{title}</h4>
    <div className="space-y-2">
      {rows.map((a) => (
        <div key={a.authorityId} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Building2 className="h-4 w-4 text-teal-700" />
                <span className="text-sm font-extrabold text-slate-900">{a.profile.orgName}</span>
                {(a.state === 'VERIFIED' || a.state === 'VERIFIED_RESTRICTED') && <ShieldCheck className="h-4 w-4 text-emerald-600" />}
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATE_CLS[a.state] || ''}`}>{a.state.replace('_', ' ')}</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">{a.profile.orgType} · {a.profile.representativeName} ({a.profile.representativeRole})</div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><KeyRound className="h-3 w-3" /> Submit: {a.permissions.canSubmit ? 'granted' : 'not granted'}</span>
                <span>Direct publish: {a.permissions.canPublish ? <strong className="text-rose-600">GRANTED (exceptional)</strong> : 'not granted'}</span>
                <span>Categories: {(a.permissions.categories || []).join(', ')}</span>
                {a.verificationRecord && <span>· verified by {a.verificationRecord.reviewer}</span>}
              </div>
              {a.suspensionRecord && <div className="mt-1 text-[11px] font-semibold text-rose-600">Suspended: {a.suspensionRecord.reason}</div>}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['VERIFIED', 'VERIFIED_RESTRICTED'].includes(a.state) && (
                <>
                  <button onClick={() => onAction({ auth: a, kind: 'suspend' })} className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100">
                    <Ban className="h-3 w-3" /> Suspend
                  </button>
                  <button onClick={() => onAction({ auth: a, kind: 'revoke' })} className="flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-50">
                    <XCircle className="h-3 w-3" /> Revoke
                  </button>
                </>
              )}
              {(a.state === 'SUSPENDED' || a.state === 'REVOKED') && (
                <button onClick={() => onAction({ auth: a, kind: 'restore' })} className="flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100">
                  <RefreshCw className="h-3 w-3" /> Restore
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);
