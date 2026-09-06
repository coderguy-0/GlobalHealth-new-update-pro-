import React, { useCallback, useEffect, useState } from 'react';
import { Lock, Loader2, ArrowRight, ShieldAlert, FileText } from 'lucide-react';
import { apiFetch } from '../../services/authClient';

interface MiniEvent {
  auditId: string;
  category: string;
  eventType: string;
  title: string;
  detail: string;
  timestamp: string;
  actorName: string;
  result: string;
  requestId?: string | null;
  recordCategory?: string | null;
}

const TONE: Record<string, string> = {
  EHR: 'bg-teal-100 text-teal-700',
  ACCESS: 'bg-emerald-100 text-emerald-700',
  CONSENT: 'bg-amber-100 text-amber-700',
  SECURITY: 'bg-rose-100 text-rose-700',
  NOTIFICATION: 'bg-sky-100 text-sky-700'
};

/**
 * The immutable, server-side audit trail (simplified view). Every change to
 * the EHR goes through the same authorization + audit framework; this panel
 * shows the most recent events and links to the full searchable history.
 */
export const AuditTrailPanel: React.FC = () => {
  const [events, setEvents] = useState<MiniEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const r = await apiFetch<{ events: MiniEvent[] }>('/api/me/audit-history');
      setEvents((r.events || []).slice(0, 25));
    } catch (e: any) {
      setError(e.message || 'Could not load the audit trail.');
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
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading the audit trail…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">Immutable Audit Trail</h3>
          <p className="text-xs text-slate-500">
            Append-only, tamper-evident record of all access, consent and record changes. It cannot be edited or deleted.
          </p>
        </div>
        <a href="#my-history" className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800">
          <FileText className="h-3.5 w-3.5" /> Full Health &amp; Security History <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-8 text-center text-sm text-slate-500">
          <Lock className="mx-auto mb-2 h-6 w-6 text-slate-300" />
          No recorded events yet. Access and consent activity will appear here.
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((e) => (
            <a
              key={e.auditId}
              href={`#my-history?event=${e.auditId}`}
              className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 transition hover:border-emerald-200 hover:bg-white"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${TONE[e.category] || 'bg-slate-100 text-slate-600'}`}>{e.category}</span>
                  <span className="text-xs font-bold text-slate-800">{e.title}</span>
                </div>
                {e.detail && <p className="mt-0.5 truncate text-xs text-slate-500">{e.detail}</p>}
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[10px] font-semibold text-slate-400">
                  {new Date(e.timestamp).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-[10px] capitalize text-slate-400">{e.actorName} · {e.result}</div>
              </div>
            </a>
          ))}
        </div>
      )}

      <p className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        Every entry carries a unique event ID and an integrity code chained to the previous entry — anyone who alters a record breaks the chain.
      </p>
    </div>
  );
};
