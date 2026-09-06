import React, { useCallback, useEffect, useState } from 'react';
import {
  Inbox, Loader2, Search, CheckCircle2, XCircle, MessageSquareWarning,
  Send, AlertTriangle, Eye, Lock
} from 'lucide-react';
import { newsFetch, NewsGovError, getAdminToken } from '../../services/newsGovernanceClient';
import { NewsAdminLoginGate } from './NewsAdminLoginGate';

interface AdminSubmission {
  submissionId: string;
  authorityId: string;
  authorityName: string;
  authorityState: string;
  headline: string;
  summary: string;
  content: string;
  category: string;
  sourceName: string;
  sourceUrl: string;
  sourceDate?: string;
  references: string[];
  highRisk: boolean;
  medicalReviewConfirmed?: boolean;
  status: string;
  correctionRequested?: { by: string; note: string; at: string };
  internalNotes: { by: string; note: string; at: string }[];
  revisions: { version: number; at: string; actor: string; note: string; changes: string[] }[];
  createdAt: string;
  submittedAt?: string;
  publishedAt?: string;
  decidedBy?: string;
  correctionNotice?: string;
}

const STATUS_CLS: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  submitted: 'bg-amber-50 text-amber-700 border-amber-200',
  under_review: 'bg-sky-50 text-sky-700 border-sky-200',
  needs_correction: 'bg-orange-50 text-orange-700 border-orange-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200'
};
const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft', submitted: 'Submitted', under_review: 'Under Review',
  needs_correction: 'Needs Correction', approved: 'Approved', published: 'Published', rejected: 'Rejected'
};

const fmt = (iso?: string | null) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return iso; }
};

export const AuthoritySubmissionsView: React.FC = () => {
  const [authed, setAuthed] = useState(!!getAdminToken());
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AdminSubmission | null>(null);
  const [action, setAction] = useState<'' | 'approve' | 'reject' | 'request_correction' | 'publish'>('');
  const [note, setNote] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [medicalConfirmed, setMedicalConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const q = statusFilter ? `?status=${statusFilter}` : '';
      const r = await newsFetch<{ submissions: AdminSubmission[] }>(`/api/news/admin/submissions${q}`, { token: getAdminToken() });
      setSubmissions(r.submissions || []);
    } catch (e: any) {
      if (e instanceof NewsGovError && e.status === 401) setAuthed(false);
      else setError(e.message || 'Could not load submissions.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { if (authed) load(); }, [authed, load]);

  if (!authed) {
    return (
      <div className="p-6">
        <h3 className="mb-1 text-base font-extrabold text-slate-900">Authority Submissions</h3>
        <p className="mb-4 text-xs text-slate-500">Review, approve, request corrections on, or publish verified-authority submissions.</p>
        <NewsAdminLoginGate onAuthenticated={() => setAuthed(true)} />
      </div>
    );
  }

  const doReview = async () => {
    if (!selected || !action) return;
    setBusy(true);
    setError('');
    try {
      await newsFetch(`/api/news/admin/submissions/${selected.submissionId}/review`, {
        method: 'POST',
        token: getAdminToken(),
        body: {
          action,
          note: note.trim() || undefined,
          internalNote: internalNote.trim() || undefined,
          medicalReviewConfirmed: medicalConfirmed || undefined
        }
      });
      setAction('');
      setNote('');
      setInternalNote('');
      setMedicalConfirmed(false);
      setSelected(null);
      await load();
    } catch (e: any) {
      if (e instanceof NewsGovError && e.code === 'MEDICAL_REVIEW_REQUIRED') {
        setError(e.message);
      } else {
        setError(e.message || 'Review action failed.');
      }
    } finally {
      setBusy(false);
    }
  };

  const filtered = submissions.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return s.headline.toLowerCase().includes(q) || s.authorityName.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
  });

  return (
    <div className="p-6">
      {authed && <NewsAdminLoginGate onAuthenticated={() => setAuthed(true)} />}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Authority Submissions</h3>
          <p className="text-xs text-slate-500">Internal notes and review metadata are visible here only — never to the submitting organization.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search headlines, orgs…" className="inp w-52 pl-8" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="inp w-44">
            <option value="">All statuses</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…</div>
      ) : (
        <div className="space-y-2">
          {filtered.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-sm text-slate-500">No submissions found.</p>
          )}
          {filtered.map((s) => (
            <div key={s.submissionId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-900">{s.headline}</span>
                  {s.highRisk && (
                    <span className="flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                      <AlertTriangle className="h-3 w-3" /> High-Risk
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {s.authorityName} ({s.authorityState}) · {s.category} · source: {s.sourceName}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-400">
                  {s.submittedAt ? `submitted ${fmt(s.submittedAt)}` : `drafted ${fmt(s.createdAt)}`}{s.decidedBy ? ` · last decision: ${s.decidedBy}` : ''}{s.publishedAt ? ` · published ${fmt(s.publishedAt)}` : ''}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATUS_CLS[s.status] || ''}`}>{STATUS_LABEL[s.status] || s.status}</span>
                <button onClick={() => { setSelected(s); setAction(''); setNote(''); setInternalNote(''); setMedicalConfirmed(false); }} className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
                  <Eye className="h-3.5 w-3.5" /> Review
                </button>
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
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATUS_CLS[selected.status] || ''}`}>{STATUS_LABEL[selected.status]}</span>
                  {selected.highRisk && <span className="flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700"><AlertTriangle className="h-3 w-3" /> High-Risk — medical review required</span>}
                </div>
                <h4 className="mt-1.5 text-lg font-extrabold text-slate-900">{selected.headline}</h4>
                <p className="text-xs text-slate-500">
                  Submitted by <strong>{selected.authorityName}</strong> ({selected.authorityState}) · {selected.category} · source: {selected.sourceName}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">✕</button>
            </div>

            {/* Source panel */}
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-2.5 text-xs">
                <div className="font-bold text-slate-400 uppercase text-[10px]">Source & References</div>
                <div className="mt-0.5 text-slate-700">{selected.sourceName}{selected.sourceDate ? ` · ${selected.sourceDate}` : ''}</div>
                {selected.sourceUrl && <a href={selected.sourceUrl} target="_blank" rel="noreferrer" className="break-all text-teal-700 hover:underline">{selected.sourceUrl}</a>}
                {selected.references.length > 0 && <ul className="mt-1 list-disc pl-4 text-slate-500">{selected.references.map((r, i) => <li key={i}>{r}</li>)}</ul>}
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 text-xs">
                <div className="font-bold text-slate-400 uppercase text-[10px]">Timeline</div>
                <div className="mt-0.5 text-slate-700">Created {fmt(selected.createdAt)}{selected.submittedAt ? ` · submitted ${fmt(selected.submittedAt)}` : ''}{selected.publishedAt ? ` · published ${fmt(selected.publishedAt)}` : ''}</div>
                {selected.correctionNotice && <div className="mt-1 font-semibold text-amber-700">Correction: {selected.correctionNotice}</div>}
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-slate-200 p-3">
              <div className="text-[11px] font-bold uppercase text-slate-400">Summary</div>
              <p className="mt-0.5 text-xs text-slate-600">{selected.summary}</p>
              <div className="mt-2 text-[11px] font-bold uppercase text-slate-400">Article</div>
              <p className="mt-0.5 max-h-56 overflow-y-auto whitespace-pre-line text-xs text-slate-600">{selected.content}</p>
            </div>

            {/* Internal notes (admin-only) */}
            <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50/50 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-violet-700"><Lock className="h-3 w-3" /> Internal notes (admin-only — never shown to the authority)</div>
              {selected.internalNotes.length === 0 ? (
                <p className="mt-1 text-xs text-slate-500">No internal notes yet.</p>
              ) : (
                <div className="mt-1 space-y-1">
                  {selected.internalNotes.map((n, i) => (
                    <p key={i} className="text-xs text-slate-600"><strong>{n.by}</strong> ({fmt(n.at)}): {n.note}</p>
                  ))}
                </div>
              )}
              <input value={internalNote} onChange={(e) => setInternalNote(e.target.value)} placeholder="Add an internal note (saved with your decision)…" className="inp mt-2" />
            </div>

            {/* Revision history */}
            <div className="mt-3 rounded-xl bg-slate-50 p-3">
              <div className="text-[11px] font-bold uppercase text-slate-400">Revision history</div>
              <div className="mt-1 space-y-1">
                {[...selected.revisions].reverse().map((r) => (
                  <div key={r.version} className="text-[11px] text-slate-600">
                    <span className="font-bold text-teal-700">v{r.version}</span> · {fmt(r.at)} · {r.actor} — {r.note}{r.changes.length ? ` (${r.changes.join(', ')})` : ''}
                  </div>
                ))}
              </div>
            </div>

            {/* Review panel */}
            <div className="mt-4 rounded-2xl border border-slate-200 p-4">
              <div className="mb-2 text-xs font-extrabold text-slate-700">Review Decision</div>
              <div className="flex flex-wrap gap-2">
                <ReviewBtn active={action === 'approve'} onClick={() => setAction('approve')} icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Approve" cls="bg-emerald-600 text-white" />
                <ReviewBtn active={action === 'publish'} onClick={() => setAction('publish')} icon={<Send className="h-3.5 w-3.5" />} label="Publish" cls="bg-teal-700 text-white" />
                <ReviewBtn active={action === 'request_correction'} onClick={() => setAction('request_correction')} icon={<MessageSquareWarning className="h-3.5 w-3.5" />} label="Request Correction" cls="bg-orange-500 text-white" />
                <ReviewBtn active={action === 'reject'} onClick={() => setAction('reject')} icon={<XCircle className="h-3.5 w-3.5" />} label="Reject" cls="bg-rose-600 text-white" />
              </div>
              {selected.highRisk && (action === 'approve' || action === 'publish') && (
                <label className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                  <input type="checkbox" checked={medicalConfirmed} onChange={(e) => setMedicalConfirmed(e.target.checked)} className="mt-0.5 accent-rose-600" />
                  <span>Medical / subject-matter review has been completed and confirmed for this high-risk article.</span>
                </label>
              )}
              <label className="mt-3 block">
                <span className="text-xs font-bold text-slate-500">{['reject', 'request_correction'].includes(action) ? 'Reason / required corrections *' : 'Note (optional — shared with the authority)'}</span>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="inp mt-1" />
              </label>
              <div className="mt-3 flex justify-end">
                <button
                  disabled={busy || !action || (['reject', 'request_correction'].includes(action) && note.trim().length < 5) || (selected.highRisk && ['approve', 'publish'].includes(action) && !medicalConfirmed)}
                  onClick={doReview}
                  className="flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800 disabled:opacity-50"
                >
                  {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />} Record Decision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewBtn: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; cls: string }> = ({ active, onClick, icon, label, cls }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition ${active ? `${cls} border-transparent` : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
  >
    {icon} {label}
  </button>
);
