import React, { useCallback, useEffect, useState } from 'react';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  XCircle,
  Clock,
  Stethoscope,
  History,
  FileText,
  Eye,
  Ban,
  Loader2,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { apiFetch } from '../services/authClient';

type ReqStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled' | 'executed' | 'failed' | 'conflict';

interface Clarification {
  id: string;
  from: 'PATIENT' | 'DOCTOR';
  message: string;
  at: string;
}

interface ConsentRequest {
  requestId: string;
  doctorId: string;
  doctorName: string;
  organization: string;
  specialty?: string;
  verificationStatus?: string;
  kind: 'access_grant' | 'add' | 'edit' | 'remove';
  recordCategory?: string;
  recordId?: string;
  title: string;
  summary: string;
  reason: string;
  explanation?: string;
  currentValue?: string;
  proposedValue?: string;
  deletionType?: 'archive' | 'permanent';
  status: ReqStatus;
  priority: 'normal' | 'high';
  versionChanged?: boolean;
  recordGone?: boolean;
  scope?: string[];
  accessDurationDays?: number;
  attachment?: { attachmentId: string; name: string; contentType: string; sizeBytes: number };
  clarifications?: Clarification[];
  patientViewedAt?: string;
  createdAt: string;
  expiresAt: string;
  reviewedAt?: string;
  rejectReason?: string;
  versionNumber?: number;
  verificationMethod?: 'SESSION' | 'PASSWORD_REAUTH';
}

interface AccessGrant {
  accessId: string;
  doctorId: string;
  doctorName: string;
  organization: string;
  specialty: string;
  scope: string[];
  status: 'active' | 'revoked' | 'expired';
  grantedAt: string;
  expiresAt: string | null;
  revokedAt: string | null;
}

interface AuditEvent {
  auditId: string;
  eventType: string;
  actorName: string;
  actorRole: 'PATIENT' | 'DOCTOR' | 'SYSTEM';
  result: string;
  detail?: string;
  timestamp: string;
  requestId?: string;
}

const STATUS_META: Record<ReqStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  pending: { label: 'Awaiting your decision', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock className="h-3.5 w-3.5" /> },
  approved: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  executed: { label: 'Completed', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  rejected: { label: 'Rejected', cls: 'bg-rose-50 text-rose-700 border-rose-200', icon: <XCircle className="h-3.5 w-3.5" /> },
  expired: { label: 'Expired', cls: 'bg-slate-100 text-slate-500 border-slate-200', icon: <Clock className="h-3.5 w-3.5" /> },
  cancelled: { label: 'Cancelled', cls: 'bg-slate-100 text-slate-500 border-slate-200', icon: <Ban className="h-3.5 w-3.5" /> },
  failed: { label: 'Failed', cls: 'bg-rose-50 text-rose-700 border-rose-200', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  conflict: { label: 'Needs re-review', cls: 'bg-orange-50 text-orange-700 border-orange-200', icon: <AlertTriangle className="h-3.5 w-3.5" /> }
};

const KIND_LABEL: Record<ConsentRequest['kind'], string> = {
  add: 'Add to your record',
  edit: 'Update your record',
  remove: 'Remove / archive record',
  access_grant: 'Request access to your record'
};

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export const PrivacyConsentView: React.FC = () => {
  const [tab, setTab] = useState<'pending' | 'doctors' | 'history'>('pending');
  const [requests, setRequests] = useState<ConsentRequest[]>([]);
  const [grants, setGrants] = useState<AccessGrant[]>([]);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState<ConsentRequest | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ req: ConsentRequest; action: 'approve' | 'reject' } | null>(null);
  const [busy, setBusy] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('');
  const [clarifyOpen, setClarifyOpen] = useState(false);
  const [clarifyMsg, setClarifyMsg] = useState('');
  const [reauth, setReauth] = useState('');
  const [reauthErr, setReauthErr] = useState('');
  const [attachment, setAttachment] = useState<{ name: string; dataUrl: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [r, g, a] = await Promise.all([
        apiFetch<{ requests: ConsentRequest[] }>('/api/me/consent-requests'),
        apiFetch<{ access: AccessGrant[] }>('/api/me/doctor-access'),
        apiFetch<{ events: AuditEvent[] }>('/api/me/audit-history')
      ]);
      setRequests(r.requests || []);
      setGrants(g.access || []);
      setEvents(a.events || []);
    } catch (e: any) {
      setError(e.message || 'We couldn’t load your privacy settings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Deep links: #privacy?request=GH-REQ-… or #privacy?request_token=… (secure
  // email link). The token carries no health data — the full request still
  // requires this authenticated session. Processed once per hash.
  const processedHashRef = React.useRef<string | null>(null);
  useEffect(() => {
    if (loading) return;
    const hash = window.location.hash;
    if (processedHashRef.current === hash) return;
    const q = new URLSearchParams(hash.split('?')[1] || '');
    const rid = q.get('request');
    const token = q.get('request_token');
    if (!rid && !token) return;
    processedHashRef.current = hash;
    const markViewed = (id: string) => apiFetch(`/api/me/consent-requests/${id}/view`, { method: 'POST', body: {} }).catch(() => {});
    if (rid) {
      const found = requests.find((r) => r.requestId === rid);
      if (found) {
        setDetail(found);
        markViewed(rid);
      }
    } else if (token) {
      fetch(`/api/email-link/${token}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.redirect) {
            const m = d.redirect.match(/request=([^&]+)/);
            if (m) {
              const found = requests.find((r) => r.requestId === m[1]);
              if (found) {
                setDetail(found);
                markViewed(found.requestId);
              }
            }
          }
        })
        .catch(() => {});
    }
  }, [requests, loading]);

  const openDetail = (r: ConsentRequest) => {
    setDetail(r);
    setClarifyOpen(false);
    setClarifyMsg('');
    apiFetch(`/api/me/consent-requests/${r.requestId}/view`, { method: 'POST', body: {} }).catch(() => {});
  };

  const pending = requests.filter((r) => r.status === 'pending');
  const decided = requests.filter((r) => r.status !== 'pending');
  const activeDoctors = grants.filter((g) => g.status === 'active');
  const revoked = grants.filter((g) => g.status !== 'active');

  const decide = async (req: ConsentRequest, decision: 'approve' | 'reject', reason?: string, password?: string) => {
    setBusy(true);
    setReauthErr('');
    try {
      await apiFetch(`/api/me/consent-requests/${req.requestId}/decision`, {
        method: 'POST',
        body: {
          decision,
          rejectReason: reason,
          ...(decision === 'approve' && password ? { password } : {}),
          idempotencyKey: `${req.requestId}-${Date.now()}`
        }
      });
      setConfirmAction(null);
      setDetail(null);
      setReauth('');
      await load();
    } catch (e: any) {
      // High-risk approval needs password re-authentication — surface it inline.
      if (e.code === 'REAUTH_REQUIRED') {
        setReauthErr('To approve this high-risk change, please re-enter your password.');
        return;
      }
      setError(e.message || 'Your decision could not be recorded. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const sendClarify = async (req: ConsentRequest) => {
    if (clarifyMsg.trim().length < 5) return;
    setBusy(true);
    try {
      await apiFetch(`/api/me/consent-requests/${req.requestId}/clarify`, {
        method: 'POST',
        body: { message: clarifyMsg.trim() }
      });
      setClarifyMsg('');
      setClarifyOpen(false);
      await load();
    } catch (e: any) {
      setError(e.message || 'Your question could not be sent.');
    } finally {
      setBusy(false);
    }
  };

  const openAttachment = async (att: ConsentRequest['attachment']) => {
    if (!att) return;
    setBusy(true);
    try {
      const r = await apiFetch<{ attachment: { name: string; dataUrl: string } }>(`/api/me/attachments/${att.attachmentId}`);
      setAttachment(r.attachment);
    } catch (e: any) {
      setError(e.message || 'The attachment could not be opened.');
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (doctorId: string) => {
    setBusy(true);
    try {
      await apiFetch(`/api/me/doctor-access/${doctorId}/revoke`, { method: 'POST', body: {} });
      await load();
    } catch (e: any) {
      setError(e.message || 'Access could not be revoked. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (!historyFilter) return true;
    const q = historyFilter.toLowerCase();
    return (
      e.eventType.toLowerCase().includes(q) ||
      e.actorName.toLowerCase().includes(q) ||
      e.result.toLowerCase().includes(q) ||
      (e.requestId || '').toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Checking your secure access settings…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-700 to-teal-800 p-6 text-white shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold sm:text-2xl">Doctors &amp; Health Access</h1>
            <p className="text-sm text-emerald-50/90">You control who can access and request changes to your health information.</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-white/10 px-3 py-3">
            <div className="text-2xl font-extrabold">{pending.length}</div>
            <div className="text-[11px] font-medium text-emerald-50/80">Awaiting you</div>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-3">
            <div className="text-2xl font-extrabold">{activeDoctors.length}</div>
            <div className="text-[11px] font-medium text-emerald-50/80">Doctors with access</div>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-3">
            <div className="text-2xl font-extrabold">{events.length}</div>
            <div className="text-[11px] font-medium text-emerald-50/80">History events</div>
          </div>
        </div>
      </div>

      {error && (
        <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 flex gap-1 rounded-2xl border border-slate-200 bg-white p-1 text-sm font-semibold shadow-sm">
        {[
          { id: 'pending', label: `Pending ${pending.length ? `(${pending.length})` : ''}`, icon: <Clock className="h-4 w-4" /> },
          { id: 'doctors', label: 'Doctors', icon: <Stethoscope className="h-4 w-4" /> },
          { id: 'history', label: 'History', icon: <History className="h-4 w-4" /> }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              tab === t.id ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* PENDING */}
      {tab === 'pending' && (
        <div className="mt-5 space-y-3">
          {pending.length === 0 && (
            <EmptyState
              icon={<CheckCircle2 className="h-7 w-7" />}
              title="No pending requests"
              body="When a doctor asks to access or change your record, you'll review and approve it here."
            />
          )}
          {pending.map((r) => (
            <div key={r.requestId} className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${STATUS_META[r.status].cls}`}>
                      {STATUS_META[r.status].icon} {STATUS_META[r.status].label}
                    </span>
                    {r.priority === 'high' && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700">
                        <AlertTriangle className="h-3 w-3" /> High priority
                      </span>
                    )}
                    {r.attachment && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                        <FileText className="h-3 w-3" /> 1 attachment
                      </span>
                    )}
                    {r.versionChanged && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-orange-700">
                        <AlertTriangle className="h-3 w-3" /> Record changed — will need re-review
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900">{r.title}</h3>
                  <p className="text-sm text-slate-500">
                    <span className="font-semibold text-slate-700">{r.doctorName}</span>
                    {r.verificationStatus === 'VERIFIED' && <ShieldCheck className="ml-1 inline h-3.5 w-3.5 text-teal-600" aria-label="Verified healthcare professional" />}
                    {' · '}{r.organization}
                  </p>
                </div>
                <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">{KIND_LABEL[r.kind]}</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{r.summary}</p>
              <p className="mt-2 text-xs font-medium text-amber-700">This request expires on {fmt(r.expiresAt)}.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => openDetail(r)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <Eye className="h-4 w-4" /> Review details
                </button>
                <button
                  onClick={() => setConfirmAction({ req: r, action: 'approve' })}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve
                </button>
                <button
                  onClick={() => setConfirmAction({ req: r, action: 'reject' })}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                >
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              </div>
            </div>
          ))}

          {decided.length > 0 && (
            <div className="mt-8">
              <h4 className="mb-2 text-sm font-bold text-slate-500">Past requests</h4>
              <div className="space-y-2">
                {decided.map((r) => (
                  <button
                    key={r.requestId}
                    onClick={() => openDetail(r)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:bg-slate-50"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{r.title}</div>
                      <div className="text-xs text-slate-500">{r.doctorName} · {fmt(r.createdAt)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATUS_META[r.status].cls}`}>
                        {STATUS_META[r.status].label}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* DOCTORS */}
      {tab === 'doctors' && (
        <div className="mt-5 space-y-6">
          <section>
            <h3 className="mb-2 text-sm font-bold text-slate-700">Active doctor access</h3>
            {activeDoctors.length === 0 && (
              <EmptyState icon={<Stethoscope className="h-7 w-7" />} title="No active doctor access" body="Doctors you approve will appear here with view access. Modifications always need your consent." />
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {activeDoctors.map((g) => (
                <div key={g.accessId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Stethoscope className="h-4 w-4 text-emerald-600" /> {g.doctorName}
                      </div>
                      <div className="text-xs text-slate-500">{g.specialty} · {g.organization}</div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" /> View access active
                    </span>
                  </div>
                  <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    <Lock className="mr-1 inline h-3.5 w-3.5 text-amber-600" />
                    Changes to your record require your approval.
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {g.scope.slice(0, 5).map((s) => (
                      <span key={s} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium capitalize text-slate-600">{s}</span>
                    ))}
                  </div>
                  <button
                    disabled={busy}
                    onClick={() => revoke(g.doctorId)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:opacity-60"
                  >
                    <Ban className="h-3.5 w-3.5" /> Revoke access
                  </button>
                </div>
              ))}
            </div>
          </section>

          {revoked.length > 0 && (
            <section>
              <h3 className="mb-2 text-sm font-bold text-slate-700">Revoked / expired access</h3>
              <div className="space-y-2">
                {revoked.map((g) => (
                  <div key={g.accessId} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-700">{g.doctorName}</div>
                      <div className="text-xs text-slate-400">{g.organization}</div>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold capitalize text-slate-500">{g.status}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* HISTORY */}
      {tab === 'history' && (
        <div className="mt-5">
          <input
            value={historyFilter}
            onChange={(e) => setHistoryFilter(e.target.value)}
            placeholder="Search by event, doctor, status or request ID…"
            className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
          />
          {filteredEvents.length === 0 ? (
            <EmptyState icon={<History className="h-7 w-7" />} title="No history found" body="Access and consent activity will appear here." />
          ) : (
            <ol className="relative border-l-2 border-emerald-100 pl-5">
              {filteredEvents.map((e) => (
                <li key={e.auditId} className="mb-5">
                  <span className="absolute -left-[9px] mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-emerald-50">
                    <FileText className="h-2 w-2 text-white" />
                  </span>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{fmt(e.timestamp)}</div>
                  <div className="text-sm font-bold text-slate-800">{e.eventType.replace(/_/g, ' ')}</div>
                  <div className="text-sm text-slate-500">
                    {e.actorRole === 'PATIENT' ? 'You' : e.actorName} · <span className="capitalize">{e.result}</span>
                  </div>
                  {e.detail && <div className="mt-1 text-xs text-slate-500">{e.detail}</div>}
                  {e.requestId && <div className="mt-0.5 font-mono text-[10px] text-slate-400">{e.requestId} · {e.auditId}</div>}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {/* DETAIL MODAL */}
      {detail && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={() => setDetail(null)}>
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${STATUS_META[detail.status].cls}`}>
                    {STATUS_META[detail.status].icon} {STATUS_META[detail.status].label}
                  </span>
                  <h3 className="mt-2 text-lg font-extrabold text-slate-900">{detail.title}</h3>
                </div>
                <button onClick={() => setDetail(null)} aria-label="Close" className="rounded-full p-2 text-slate-400 hover:bg-slate-100">✕</button>
              </div>
            </div>
            <div className="space-y-4 p-5 text-sm">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Doctor</div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  {detail.doctorName} — {detail.organization}
                  {detail.verificationStatus === 'VERIFIED' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 ring-1 ring-teal-200">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
              <Row label="Request type" value={KIND_LABEL[detail.kind]} />
              {detail.recordCategory && <Row label="Record category" value={detail.recordCategory} />}
              {detail.kind === 'remove' && detail.deletionType && (
                <Row label="Removal type" value={detail.deletionType === 'permanent' ? 'Permanent deletion (retention copy preserved)' : 'Archive / mark inactive'} />
              )}
              {detail.kind === 'access_grant' && (
                <>
                  {detail.scope && detail.scope.length > 0 && (
                    <Row label="Requested information" value={detail.scope.map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1')).join(', ')} />
                  )}
                  {detail.accessDurationDays && <Row label="Requested duration" value={`${detail.accessDurationDays} days`} />}
                </>
              )}
              <Row label="Reason" value={detail.reason} />
              {detail.status === 'pending' && (detail.versionChanged || detail.recordGone) && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-xs text-orange-800">
                  <strong className="flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> This record has changed since the request was created.</strong>
                  <p className="mt-1">
                    {detail.recordGone
                      ? 'The affected record is no longer present, so this request can no longer be applied.'
                      : 'If you approve, the system will pause the change for re-review instead of applying it, so newer information is never silently overwritten.'}
                  </p>
                </div>
              )}
              {detail.status === 'conflict' && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-xs text-orange-800">
                  <strong className="flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Needs re-review.</strong>
                  <p className="mt-1">
                    You approved this request, but the record changed after it was created. For your protection, <strong>no change was applied</strong>.{' '}
                    {detail.doctorName} will need to submit an updated request.
                  </p>
                </div>
              )}
              {detail.explanation && (
                <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-3">
                  <div className="mb-1 text-[11px] font-bold uppercase text-sky-600">Note from your doctor</div>
                  <p className="text-slate-700">{detail.explanation}</p>
                </div>
              )}
              {detail.currentValue && (
                <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-3">
                  <div className="mb-1 text-[11px] font-bold uppercase text-rose-600">Current record</div>
                  <p className="text-slate-700">{detail.currentValue}</p>
                </div>
              )}
              {detail.proposedValue && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                  <div className="mb-1 text-[11px] font-bold uppercase text-emerald-700">{detail.kind === 'remove' ? 'After this change' : 'Proposed change'}</div>
                  <p className="text-slate-700">{detail.kind === 'remove' ? (detail.deletionType === 'permanent' ? 'This record will be permanently removed from your active EHR (an audit copy is preserved).' : 'This record will be archived and hidden from active records.') : detail.proposedValue}</p>
                </div>
              )}
              {detail.attachment && (
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs">
                    <div className="font-bold text-slate-700">Attachment: {detail.attachment.name}</div>
                    <div className="text-slate-400">{detail.attachment.contentType} · {(detail.attachment.sizeBytes / 1024).toFixed(0)} KB</div>
                  </div>
                  <button onClick={() => openAttachment(detail.attachment)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-100">
                    {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileText className="h-3 w-3" />} View
                  </button>
                </div>
              )}
              <Row label="Submitted" value={fmt(detail.createdAt)} />
              {detail.status === 'pending' ? (
                <Row label="Expires" value={`This request expires on ${fmt(detail.expiresAt)}`} />
              ) : (
                <Row label="Decided" value={fmt(detail.reviewedAt || '')} />
              )}
              {detail.versionNumber && <Row label="Record version" value={`Version ${detail.versionNumber}`} />}
              <Row label="Request ID" value={detail.requestId} mono />

              {/* Clarification thread */}
              {detail.clarifications && detail.clarifications.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                  <div className="mb-2 text-[11px] font-bold uppercase text-slate-400">Questions &amp; answers</div>
                  <div className="space-y-2">
                    {detail.clarifications.map((c) => (
                      <div key={c.id} className={`rounded-lg p-2 text-xs ${c.from === 'PATIENT' ? 'bg-white' : 'bg-emerald-50'}`}>
                        <div className="mb-0.5 text-[10px] font-bold text-slate-400">{c.from === 'PATIENT' ? 'You' : detail.doctorName} · {fmt(c.at)}</div>
                        <p className="text-slate-700">{c.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detail.status === 'pending' && (
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => setClarifyOpen(!clarifyOpen)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                  >
                    {clarifyOpen ? 'Close' : 'Ask for clarification'}
                  </button>
                  {clarifyOpen && (
                    <div className="rounded-xl border border-slate-200 p-3">
                      <textarea
                        value={clarifyMsg}
                        onChange={(e) => setClarifyMsg(e.target.value)}
                        rows={2}
                        placeholder="Ask the doctor a question about this request…"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500"
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          disabled={busy || clarifyMsg.trim().length < 5}
                          onClick={() => sendClarify(detail)}
                          className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
                        >
                          {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Send question'}
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => { setReauth(''); setConfirmAction({ req: detail, action: 'reject' }); }}
                      className="flex-1 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-100"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => { setReauth(''); setReauthErr(''); setConfirmAction({ req: detail, action: 'approve' }); }}
                      className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmAction && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-slate-950/70 p-4" role="dialog" aria-modal="true" onClick={() => !busy && setConfirmAction(null)}>
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {confirmAction.action === 'approve' ? (
              <ApproveForm
                req={confirmAction.req}
                busy={busy}
                reauth={reauth}
                setReauth={setReauth}
                reauthErr={reauthErr}
                setReauthErr={setReauthErr}
                onCancel={() => setConfirmAction(null)}
                onApprove={(password) => decide(confirmAction.req, 'approve', undefined, password)}
              />
            ) : (
              <RejectForm busy={busy} onCancel={() => setConfirmAction(null)} onReject={(reason) => decide(confirmAction.req, 'reject', reason)} />
            )}
          </div>
        </div>
      )}

      {/* ATTACHMENT VIEWER */}
      {attachment && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/70 p-4" role="dialog" aria-modal="true" onClick={() => setAttachment(null)}>
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">{attachment.name}</h3>
              <button onClick={() => setAttachment(null)} aria-label="Close" className="rounded-full p-2 text-slate-400 hover:bg-slate-100">✕</button>
            </div>
            {attachment.dataUrl.startsWith('data:image/') ? (
              <img src={attachment.dataUrl} alt={attachment.name} className="w-full rounded-xl border border-slate-200" />
            ) : (
              <iframe src={attachment.dataUrl} title={attachment.name} className="h-[60vh] w-full rounded-xl border border-slate-200" />
            )}
            <p className="mt-2 text-[11px] text-slate-400">Opening this attachment is recorded in your history.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ApproveForm: React.FC<{
  req: ConsentRequest;
  busy: boolean;
  reauth: string;
  setReauth: (v: string) => void;
  reauthErr: string;
  setReauthErr: (v: string) => void;
  onCancel: () => void;
  onApprove: (password?: string) => void;
}> = ({ req, busy, reauth, setReauth, reauthErr, setReauthErr, onCancel, onApprove }) => {
  const highRisk = req.kind === 'edit' || req.kind === 'remove';
  const actionText =
    req.kind === 'edit'
      ? `update ${req.recordCategory || 'a record'}`
      : req.kind === 'remove'
        ? req.deletionType === 'permanent'
          ? `permanently remove ${req.recordCategory || 'a record'}`
          : `archive ${req.recordCategory || 'a record'}`
        : req.kind === 'access_grant'
          ? 'grant view access to your record'
          : `add ${req.recordCategory || 'a new record'}`;

  return (
    <>
      <div className="flex items-center gap-2 text-emerald-700">
        <ShieldCheck className="h-6 w-6" />
        <h3 className="text-lg font-extrabold">{req.doctorName} wants to update your medical record</h3>
      </div>
      <p className="mt-3 text-sm text-slate-600">
        You are approving a request from <span className="font-semibold">{req.doctorName}</span> to {actionText}.
        {highRisk && ' Review the request carefully before continuing — this affects your existing medical history.'}
      </p>
      <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800 border border-emerald-100">
        I understand the information requested by this doctor and authorize GlobalHealth to apply the approved change to my EHR.
        {req.kind !== 'access_grant' && ' This will create a new, versioned record entry.'}
      </p>

      {highRisk && (
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-500">
            <Lock className="mr-1 inline h-3.5 w-3.5 text-amber-600" />
            This is a high-risk change. Re-enter your password to confirm.
          </label>
          <input
            type="password"
            value={reauth}
            onChange={(e) => { setReauth(e.target.value); setReauthErr(''); }}
            placeholder="Your GlobalHealth password"
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white"
          />
          {reauthErr && <p className="mt-1 text-xs font-semibold text-rose-600">{reauthErr}</p>}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button disabled={busy} onClick={onCancel} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-60">
          Cancel
        </button>
        <button
          disabled={busy || (highRisk && reauth.length === 0)}
          onClick={() => onApprove(highRisk ? reauth : undefined)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Confirm Approval
        </button>
      </div>
    </>
  );
};

const RejectForm: React.FC<{ busy: boolean; onCancel: () => void; onReject: (reason: string) => void }> = ({ busy, onCancel, onReject }) => {
  const [reason, setReason] = useState('The proposed information is incorrect.');
  const options = [
    'I do not recognize this request.',
    'The proposed information is incorrect.',
    'I do not want this change made.',
    'I need more information.',
    'Other'
  ];
  return (
    <>
      <div className="flex items-center gap-2 text-rose-700">
        <XCircle className="h-6 w-6" />
        <h3 className="text-lg font-extrabold">Reject this request</h3>
      </div>
      <p className="mt-2 text-sm text-slate-500">Your reason is shared with the care team without extra personal detail.</p>
      <div className="mt-3 space-y-1.5">
        {options.map((o) => (
          <label key={o} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
            <input type="radio" name="reject" checked={reason === o} onChange={() => setReason(o)} className="accent-rose-600" />
            {o}
          </label>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button disabled={busy} onClick={onCancel} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-60">Cancel</button>
        <button disabled={busy} onClick={() => onReject(reason)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-60">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Reject request
        </button>
      </div>
    </>
  );
};

const Row: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div>
    <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</div>
    <div className={`text-slate-700 ${mono ? 'font-mono text-xs' : ''}`}>{value}</div>
  </div>
);

const EmptyState: React.FC<{ icon: React.ReactNode; title: string; body: string }> = ({ icon, title, body }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">{icon}</div>
    <h4 className="font-bold text-slate-800">{title}</h4>
    <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{body}</p>
  </div>
);
