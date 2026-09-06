import React, { useCallback, useEffect, useState } from 'react';
import {
  Building2, ShieldCheck, Clock, CheckCircle2, XCircle, AlertTriangle,
  Loader2, Eye, MessageSquareWarning, RefreshCw, Search, ExternalLink
} from 'lucide-react';
import { newsFetch, NewsGovError, getAdminToken } from '../../services/newsGovernanceClient';
import { NewsAdminLoginGate } from './NewsAdminLoginGate';

interface Application {
  authorityId: string;
  profile: {
    orgName: string; orgType: string; website: string; contactName: string;
    contactEmail: string; contactPhone?: string; address?: string;
    representativeName: string; representativeRole: string; credentials?: string;
    description: string; verificationReason: string; requestedPermissions: string[];
  };
  state: string;
  suspended: boolean;
  permissions: { canSubmit: boolean; canPublish: boolean; categories: string[] };
  appliedAt: string;
  verificationRecord?: { reviewer: string; reviewedAt: string; decision: string; reason: string } | null;
  suspensionRecord?: { reviewer: string; at: string; reason: string } | null;
}

const STATE_FILTERS = [
  { id: '', label: 'All states' },
  { id: 'PENDING_REVIEW', label: 'Pending Verification' },
  { id: 'UNDER_REVIEW', label: 'Under Review' },
  { id: 'MORE_INFO_REQUIRED', label: 'Additional Info Required' },
  { id: 'VERIFIED', label: 'Verified' },
  { id: 'VERIFIED_RESTRICTED', label: 'Verified (Restricted)' },
  { id: 'SUSPENDED', label: 'Suspended' },
  { id: 'REVOKED', label: 'Revoked' },
  { id: 'REJECTED', label: 'Rejected' }
];

const STATE_CLS: Record<string, string> = {
  PENDING_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
  UNDER_REVIEW: 'bg-sky-50 text-sky-700 border-sky-200',
  MORE_INFO_REQUIRED: 'bg-orange-50 text-orange-700 border-orange-200',
  VERIFIED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  VERIFIED_RESTRICTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  SUSPENDED: 'bg-rose-50 text-rose-700 border-rose-200',
  REVOKED: 'bg-rose-50 text-rose-700 border-rose-200',
  REJECTED: 'bg-slate-100 text-slate-500 border-slate-200'
};

const fmt = (iso?: string | null) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return iso; }
};

export const AuthorityVerificationView: React.FC = () => {
  const [authed, setAuthed] = useState(!!getAdminToken());
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Application | null>(null);
  const [busy, setBusy] = useState(false);
  const [decision, setDecision] = useState<'' | 'approve' | 'approve_restricted' | 'reject' | 'request_info' | 'under_review'>('');
  const [note, setNote] = useState('');
  const [canSubmitPerm, setCanSubmitPerm] = useState(true);
  const [canPublishPerm, setCanPublishPerm] = useState(false);
  const [categories, setCategories] = useState('All Categories');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const q = stateFilter ? `?state=${stateFilter}` : '';
      const r = await newsFetch<{ applications: Application[] }>(`/api/news/admin/applications${q}`, { token: getAdminToken() });
      setApplications(r.applications || []);
    } catch (e: any) {
      if (e instanceof NewsGovError && e.status === 401) setAuthed(false);
      else setError(e.message || 'Could not load applications.');
    } finally {
      setLoading(false);
    }
  }, [stateFilter]);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  if (!authed) {
    return (
      <div className="p-6">
        <h3 className="mb-1 text-base font-extrabold text-slate-900">Authority Verification</h3>
        <p className="mb-4 text-xs text-slate-500">Review and decide on Verified Authority applications.</p>
        <NewsAdminLoginGate onAuthenticated={() => setAuthed(true)} />
      </div>
    );
  }

  const decide = async () => {
    if (!selected || !decision) return;
    setBusy(true);
    setError('');
    try {
      await newsFetch(`/api/news/admin/applications/${selected.authorityId}/decision`, {
        method: 'POST',
        token: getAdminToken(),
        body: {
          decision,
          note: note.trim() || undefined,
          canSubmit: canSubmitPerm,
          canPublish: canPublishPerm,
          categories: categories === 'All Categories' ? ['All Categories'] : categories.split(',').map((s) => s.trim()).filter(Boolean)
        }
      });
      setDecision('');
      setNote('');
      setSelected(null);
      await load();
    } catch (e: any) {
      setError(e.message || 'Decision could not be recorded.');
    } finally {
      setBusy(false);
    }
  };

  const filtered = applications.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.profile.orgName.toLowerCase().includes(q) ||
      a.profile.orgType.toLowerCase().includes(q) ||
      a.profile.contactName.toLowerCase().includes(q)
    );
  });

  const isDecidable = selected && ['PENDING_REVIEW', 'UNDER_REVIEW', 'MORE_INFO_REQUIRED'].includes(selected.state);
  const needsNote = decision === 'approve' || decision === 'reject' || decision === 'approve_restricted';

  return (
    <div className="p-6">
      {authed && <NewsAdminLoginGate onAuthenticated={() => setAuthed(true)} />}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Authority Verification Queue</h3>
          <p className="text-xs text-slate-500">Every application is reviewed by a GlobalHealth administrator before any trust or permission is granted.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search organizations…" className="inp w-52 pl-8" />
          </div>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="inp w-48">
            {STATE_FILTERS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…</div>
      ) : (
        <div className="space-y-2">
          {filtered.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-sm text-slate-500">No applications match this filter.</p>
          )}
          {filtered.map((a) => (
            <div key={a.authorityId} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Building2 className="h-4 w-4 text-teal-700" />
                    <span className="text-sm font-extrabold text-slate-900">{a.profile.orgName}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATE_CLS[a.state] || STATE_CLS.PENDING_REVIEW}`}>
                      {STATE_FILTERS.find((f) => f.id === a.state)?.label || a.state}
                    </span>
                    {(a.state === 'VERIFIED' || a.state === 'VERIFIED_RESTRICTED') && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                        <ShieldCheck className="h-3 w-3" /> Verified Authority
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {a.profile.orgType} · {a.profile.contactName} ({a.profile.contactEmail}) · applied {fmt(a.appliedAt)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Requested: {a.profile.requestedPermissions.join(', ') || '—'}
                    {a.verificationRecord && <> · decided by {a.verificationRecord.reviewer} on {fmt(a.verificationRecord.reviewedAt)}</>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelected(a)} className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
                    <Eye className="h-3.5 w-3.5" /> Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review modal */}
      {selected && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" onClick={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-lg font-extrabold text-slate-900">{selected.profile.orgName}</h4>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATE_CLS[selected.state] || ''}`}>{selected.state}</span>
                </div>
                <p className="text-xs text-slate-500">{selected.profile.orgType} · applied {fmt(selected.appliedAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">✕</button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="Website" value={selected.profile.website} link />
              <InfoRow label="Contact" value={`${selected.profile.contactName} · ${selected.profile.contactEmail}${selected.profile.contactPhone ? ` · ${selected.profile.contactPhone}` : ''}`} />
              <InfoRow label="Representative" value={`${selected.profile.representativeName} — ${selected.profile.representativeRole}`} />
              {selected.profile.address && <InfoRow label="Address" value={selected.profile.address} />}
              {selected.profile.credentials && <InfoRow label="Credentials" value={selected.profile.credentials} />}
              <InfoRow label="Requested permissions" value={selected.profile.requestedPermissions.join(', ') || '—'} />
            </div>
            <div className="mt-3 rounded-xl bg-slate-50 p-3">
              <div className="text-[11px] font-bold uppercase text-slate-400">Description</div>
              <p className="mt-0.5 text-xs text-slate-600">{selected.profile.description}</p>
              <div className="mt-2 text-[11px] font-bold uppercase text-slate-400">Verification reason</div>
              <p className="mt-0.5 text-xs text-slate-600">{selected.profile.verificationReason}</p>
            </div>
            {selected.suspensionRecord && (
              <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                Suspension reason: {selected.suspensionRecord.reason}
              </p>
            )}

            {isDecidable ? (
              <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                <div className="mb-2 text-xs font-extrabold text-slate-700">Verification Decision</div>
                <div className="flex flex-wrap gap-2">
                  <DecisionBtn active={decision === 'approve'} onClick={() => setDecision('approve')} icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Approve (Full Verification)" cls="bg-emerald-600 text-white" />
                  <DecisionBtn active={decision === 'approve_restricted'} onClick={() => setDecision('approve_restricted')} icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Approve with Restrictions" cls="bg-teal-600 text-white" />
                  <DecisionBtn active={decision === 'under_review'} onClick={() => setDecision('under_review')} icon={<Clock className="h-3.5 w-3.5" />} label="Place Under Review" cls="bg-sky-600 text-white" />
                  <DecisionBtn active={decision === 'request_info'} onClick={() => setDecision('request_info')} icon={<MessageSquareWarning className="h-3.5 w-3.5" />} label="Request More Info" cls="bg-orange-500 text-white" />
                  <DecisionBtn active={decision === 'reject'} onClick={() => setDecision('reject')} icon={<XCircle className="h-3.5 w-3.5" />} label="Reject" cls="bg-rose-600 text-white" />
                </div>
                {(decision === 'approve' || decision === 'approve_restricted') && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <label className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-700">
                      <input type="checkbox" className="accent-teal-600" checked={canSubmitPerm} onChange={(e) => setCanSubmitPerm(e.target.checked)} />
                      May submit news
                    </label>
                    <label className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/50 px-2.5 py-2 text-xs font-semibold text-rose-700" title="Exceptional — requires careful review">
                      <input type="checkbox" className="accent-rose-600" checked={canPublishPerm} onChange={(e) => setCanPublishPerm(e.target.checked)} />
                      Direct publishing (exceptional)
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-400">Categories</span>
                      <input value={categories} onChange={(e) => setCategories(e.target.value)} className="inp" />
                    </label>
                  </div>
                )}
                <label className="mt-3 block">
                  <span className="text-xs font-bold text-slate-500">{needsNote ? 'Decision reason * (required, min 10 characters)' : 'Note (optional)'}</span>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="inp mt-1" placeholder={needsNote ? 'State the basis of this verification decision.' : 'Add a note…'} />
                </label>
                <div className="mt-3 flex justify-end">
                  <button
                    disabled={busy || !decision || (needsNote && note.trim().length < 10)}
                    onClick={decide}
                    className="flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800 disabled:opacity-50"
                  >
                    {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />} Record Decision
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                This application has already been decided. Use the <strong>Verified Authorities</strong> page to suspend, revoke or restore this organization.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string; link?: boolean }> = ({ label, value, link }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-2.5">
    <div className="text-[10px] font-bold uppercase text-slate-400">{label}</div>
    {link ? (
      <a href={value} target="_blank" rel="noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline break-all">
        {value} <ExternalLink className="h-3 w-3 shrink-0" />
      </a>
    ) : (
      <div className="mt-0.5 text-xs text-slate-700">{value}</div>
    )}
  </div>
);

const DecisionBtn: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; cls: string }> = ({ active, onClick, icon, label, cls }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition ${active ? `${cls} border-transparent` : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
  >
    {icon} {label}
  </button>
);
