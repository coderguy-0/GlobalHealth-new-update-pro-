import React, { useCallback, useEffect, useState } from 'react';
import {
  ShieldCheck,
  Stethoscope,
  Lock,
  Eye,
  Ban,
  Clock,
  Loader2,
  ArrowRight,
  KeyRound
} from 'lucide-react';
import { apiFetch } from '../../services/authClient';

interface Grant {
  accessId: string;
  doctorId: string;
  doctorName: string;
  organization: string;
  specialty: string;
  scope: string[];
  status: string;
  derivedStatus: 'active' | 'expiring' | 'expired' | 'revoked';
  isEmergency: boolean;
  grantedAt: string;
  expiresAt: string | null;
  revokedAt: string | null;
  lastViewedAt?: string | null;
  verificationStatus: string;
  permissions: Record<string, any>;
}

interface PendingReq {
  requestId: string;
  doctorName: string;
  kind: string;
  title: string;
  recordCategory?: string;
  status: string;
  createdAt: string;
  expiresAt: string;
}

const fmt = (iso?: string | null) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
};

/**
 * Server-backed view of the real doctor-access system (the same data the
 * consent engine enforces). Replaces the old local mock consents list so the
 * dashboard and the Doctor Access & Consent section are one integrated system.
 */
export const AccessGovernancePanel: React.FC = () => {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [pending, setPending] = useState<PendingReq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [g, r] = await Promise.all([
        apiFetch<{ access: Grant[] }>('/api/me/doctor-access'),
        apiFetch<{ requests: PendingReq[] }>('/api/me/consent-requests')
      ]);
      setGrants(g.access || []);
      setPending((r.requests || []).filter((x) => x.status === 'pending'));
    } catch (e: any) {
      setError(e.message || 'Could not load access settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading your access settings…
      </div>
    );
  }

  const active = grants.filter((g) => g.status === 'active');
  const inactive = grants.filter((g) => g.status !== 'active');

  return (
    <div className="space-y-6">
      {/* The two permissions, kept visually distinct */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <Eye className="h-6 w-6 shrink-0 text-emerald-600" />
          <div>
            <div className="text-sm font-extrabold text-emerald-800">View Access: Active</div>
            <div className="text-xs text-emerald-700">Your explicitly authorized doctors can review permitted records.</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Lock className="h-6 w-6 shrink-0 text-amber-600" />
          <div>
            <div className="text-sm font-extrabold text-amber-800">Modification Access: Patient Approval Required</div>
            <div className="text-xs text-amber-700">Any add, edit or removal requires your explicit approval — always.</div>
          </div>
        </div>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {/* Pending consent requests */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-700">Pending consent requests {pending.length > 0 && <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">{pending.length}</span>}</h4>
          <a href="#privacy" className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline">
            Review in Doctor Access &amp; Consent <ArrowRight className="h-3 w-3" />
          </a>
        </div>
        {pending.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-6 text-center text-sm text-slate-500">
            No pending requests. When a doctor asks to access or change your record, you decide here.
          </div>
        ) : (
          <div className="space-y-2">
            {pending.map((r) => (
              <a
                key={r.requestId}
                href={`#privacy?request=${r.requestId}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-3 transition hover:bg-amber-50"
              >
                <div>
                  <div className="text-sm font-bold text-slate-800">{r.title}</div>
                  <div className="text-xs text-slate-500">{r.doctorName} · {r.recordCategory || 'Record'} · expires {fmt(r.expiresAt)}</div>
                </div>
                <span className="flex items-center gap-1 rounded-full border border-amber-200 bg-white px-2 py-1 text-[10px] font-bold text-amber-700">
                  <Clock className="h-3 w-3" /> Awaiting you
                </span>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Active doctor access (real grants from the consent engine) */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-700">Active doctor access</h4>
          <a href="#privacy" className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline">
            Manage access <ArrowRight className="h-3 w-3" />
          </a>
        </div>
        {active.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-6 text-center text-sm text-slate-500">
            No doctors currently have access to your record.
          </div>
        ) : (
          <div className="space-y-3">
            {active.map((g) => (
              <div key={g.accessId} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                        <Stethoscope className="h-4 w-4 text-emerald-600" /> {g.doctorName}
                      </span>
                      {g.verificationStatus === 'VERIFIED' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 ring-1 ring-teal-200">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span>
                      )}
                      {g.isEmergency && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 ring-1 ring-rose-200">
                          Emergency · view-only
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{g.specialty} · {g.organization}</p>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                      g.derivedStatus === 'expiring'
                        ? 'border-amber-200 bg-amber-50 text-amber-700'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {g.derivedStatus === 'expiring' ? 'Access expiring' : 'View access active'}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500 sm:grid-cols-4">
                  <div><span className="font-bold text-slate-400">Granted:</span> {fmt(g.grantedAt)}</div>
                  <div><span className="font-bold text-slate-400">Expires:</span> {fmt(g.expiresAt)}</div>
                  <div><span className="font-bold text-slate-400">Last viewed:</span> {g.lastViewedAt ? new Date(g.lastViewedAt).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</div>
                  <div className="flex items-center gap-1 text-amber-700">
                    <KeyRound className="h-3 w-3" /> Changes need your approval
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {g.scope.map((s) => (
                    <span key={s} className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium capitalize text-slate-600 ring-1 ring-slate-200">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Revoked / expired */}
      {inactive.length > 0 && (
        <section>
          <h4 className="mb-2 text-sm font-bold text-slate-700">Revoked / expired access</h4>
          <div className="space-y-2">
            {inactive.map((g) => (
              <div key={g.accessId} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-slate-700">{g.doctorName}</div>
                  <div className="text-xs text-slate-400">{g.organization}</div>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold capitalize text-slate-500">
                  <Ban className="h-3 w-3" /> {g.status} {g.revokedAt ? `· ${fmt(g.revokedAt)}` : ''}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        You control who can access and request changes to your health information. Revoke access any time from Doctor Access &amp; Consent — pending requests are cancelled automatically.
      </p>
    </div>
  );
};
