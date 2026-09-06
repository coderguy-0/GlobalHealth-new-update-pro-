import React, { useCallback, useEffect, useState } from 'react';
import { Flag, Loader2, CheckCircle2, Clock, User, Inbox } from 'lucide-react';
import { newsFetch, NewsGovError, getAdminToken } from '../../services/newsGovernanceClient';
import { NewsAdminLoginGate } from './NewsAdminLoginGate';

interface Report {
  reportId: string;
  articleRef: string;
  articleTitle: string;
  reason: string;
  detail: string;
  reporterUserId: string;
  reporterName: string;
  status: 'OPEN' | 'REVIEWED' | 'RESOLVED';
  resolution?: string;
  createdAt: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

const REASON_LABEL: Record<string, string> = {
  incorrect_information: 'Incorrect information',
  outdated_information: 'Outdated information',
  misleading_information: 'Misleading information',
  suspicious_source: 'Suspicious source',
  fake_authority: 'Fake authority',
  incorrect_medical_claim: 'Incorrect medical claim',
  broken_source: 'Broken source',
  duplicate_article: 'Duplicate article',
  inappropriate_content: 'Inappropriate content'
};

const STATUS_CLS: Record<string, string> = {
  OPEN: 'bg-amber-50 text-amber-700 border-amber-200',
  REVIEWED: 'bg-sky-50 text-sky-700 border-sky-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

const fmt = (iso?: string | null) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return iso; }
};

export const ReportedNewsView: React.FC = () => {
  const [authed, setAuthed] = useState(!!getAdminToken());
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<Report | null>(null);
  const [resolution, setResolution] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const r = await newsFetch<{ reports: Report[] }>('/api/news/admin/reports', { token: getAdminToken() });
      setReports(r.reports || []);
    } catch (e: any) {
      if (e instanceof NewsGovError && e.status === 401) setAuthed(false);
      else setError(e.message || 'Could not load reports.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (authed) load(); }, [authed, load]);

  if (!authed) {
    return (
      <div className="p-6">
        <h3 className="mb-1 text-base font-extrabold text-slate-900">Reported News</h3>
        <p className="mb-4 text-xs text-slate-500">Review user reports on news articles. Reports never auto-delete content — editorial review decides.</p>
        <NewsAdminLoginGate onAuthenticated={() => setAuthed(true)} />
      </div>
    );
  }

  const resolve = async () => {
    if (!selected) return;
    setBusy(true);
    setError('');
    try {
      await newsFetch(`/api/news/admin/reports/${selected.reportId}/resolve`, {
        method: 'POST',
        token: getAdminToken(),
        body: { resolution: resolution.trim() }
      });
      setSelected(null);
      setResolution('');
      await load();
    } catch (e: any) {
      setError(e.message || 'Could not resolve the report.');
    } finally {
      setBusy(false);
    }
  };

  const filtered = reports.filter((r) => !statusFilter || r.status === statusFilter);
  const openCount = reports.filter((r) => r.status === 'OPEN').length;

  return (
    <div className="p-6">
      {authed && <NewsAdminLoginGate onAuthenticated={() => setAuthed(true)} />}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Reported News {openCount > 0 && <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">{openCount} open</span>}</h3>
          <p className="text-xs text-slate-500">User-submitted reports. Resolving a report is a manual editorial decision — never automatic deletion.</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="inp w-40">
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…</div>
      ) : (
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
              <Inbox className="mx-auto mb-2 h-6 w-6 text-slate-300" />
              <p className="text-sm text-slate-500">No reports found.</p>
            </div>
          )}
          {filtered.map((r) => (
            <div key={r.reportId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Flag className="h-4 w-4 text-rose-500" />
                  <span className="text-sm font-extrabold text-slate-900">“{r.articleTitle}”</span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600">{REASON_LABEL[r.reason] || r.reason}</span>
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  <User className="mr-1 inline h-3 w-3" /> {r.reporterName} · {fmt(r.createdAt)}
                </div>
                {r.detail && <p className="mt-0.5 text-xs text-slate-500">{r.detail}</p>}
                {r.resolution && <p className="mt-0.5 text-xs font-semibold text-emerald-700">Resolved by {r.resolvedBy}: {r.resolution}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATUS_CLS[r.status]}`}>
                  {r.status === 'OPEN' ? <Clock className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />} {r.status}
                </span>
                {r.status !== 'RESOLVED' && (
                  <button onClick={() => { setSelected(r); setResolution(''); }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" onClick={() => !busy && setSelected(null)}>
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-lg font-extrabold text-slate-900">Resolve Report</h4>
            <p className="mt-1 text-xs text-slate-500">“{selected.articleTitle}” — {REASON_LABEL[selected.reason] || selected.reason}</p>
            <label className="mt-3 block">
              <span className="text-xs font-bold text-slate-500">Resolution note * (min 5 characters)</span>
              <textarea value={resolution} onChange={(e) => setResolution(e.target.value)} rows={3} className="inp mt-1" placeholder="e.g. Verified against source; no action needed. / Article corrected (v2). / Article unpublished pending review." />
            </label>
            <div className="mt-4 flex gap-2">
              <button disabled={busy} onClick={() => setSelected(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
              <button
                disabled={busy || resolution.trim().length < 5}
                onClick={resolve}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
