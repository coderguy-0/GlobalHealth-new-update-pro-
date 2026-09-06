import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  History,
  Search,
  Download,
  Mail,
  Bell,
  ShieldCheck,
  ShieldAlert,
  Stethoscope,
  FilePlus2,
  FileEdit,
  FileMinus2,
  Archive,
  Eye,
  KeyRound,
  Ban,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronDown,
  ChevronRight,
  FileText,
  Info,
  Lock,
  Siren,
  MessageCircleQuestion,
  MessageCircleReply,
  Inbox
} from 'lucide-react';
import { apiFetch, getStoredToken } from '../services/authClient';

// ---------------------------------------------------------------- types ---
interface HistoryEvent {
  auditId: string;
  category: 'EHR' | 'ACCESS' | 'CONSENT' | 'SECURITY' | 'NOTIFICATION';
  eventType: string;
  title: string;
  detail: string;
  timestamp: string;
  actorId: string;
  actorRole: 'PATIENT' | 'DOCTOR' | 'SYSTEM';
  actorName: string;
  result: string;
  requestId?: string | null;
  resourceType?: string | null;
  resourceId?: string | null;
  recordCategory?: string | null;
  previousState?: string | null;
  newState?: string | null;
  accessPermission?: string | null;
  sessionId?: string | null;
  hash?: string | null;
  prevHash?: string | null;
}

interface ConsentReqLite {
  requestId: string;
  doctorName: string;
  organization: string;
  kind: string;
  recordCategory?: string;
  title: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  reviewedAt?: string;
  executedAt?: string;
  versionNumber?: number;
  decisionBy?: string;
  verificationMethod?: string;
  reason?: string;
  scope?: string[];
  accessDurationDays?: number;
}

interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  requestId?: string;
  read: boolean;
  createdAt: string;
}

interface EmailRecord {
  emailId: string;
  to: string;
  subject: string;
  body: string;
  type: string;
  requestId?: string;
  linkToken?: string;
  sentAt: string;
  read: boolean;
}

type TabId = 'all' | 'ehr' | 'access' | 'consent' | 'changes' | 'security' | 'notifications' | 'downloads';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Activity', icon: <History className="h-4 w-4" /> },
  { id: 'ehr', label: 'EHR History', icon: <FileText className="h-4 w-4" /> },
  { id: 'access', label: 'Doctor Access', icon: <KeyRound className="h-4 w-4" /> },
  { id: 'consent', label: 'Consent', icon: <ShieldCheck className="h-4 w-4" /> },
  { id: 'changes', label: 'Record Changes', icon: <FileEdit className="h-4 w-4" /> },
  { id: 'security', label: 'Security', icon: <ShieldAlert className="h-4 w-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Inbox className="h-4 w-4" /> },
  { id: 'downloads', label: 'Downloads', icon: <Download className="h-4 w-4" /> }
];

const CHANGE_EVENTS = new Set([
  'EHR_RECORD_ADDED',
  'EHR_RECORD_VERSIONED',
  'EHR_RECORD_ARCHIVED',
  'EHR_RECORD_REMOVED',
  'EHR_CHANGE_FAILED'
]);

const EVENT_ICON = (e: HistoryEvent): React.ReactNode => {
  switch (e.eventType) {
    case 'DOCTOR_VIEWED_EHR':
      return <Eye className="h-4 w-4" />;
    case 'EHR_RECORD_ADDED':
      return <FilePlus2 className="h-4 w-4" />;
    case 'EHR_RECORD_VERSIONED':
      return <FileEdit className="h-4 w-4" />;
    case 'EHR_RECORD_ARCHIVED':
      return <Archive className="h-4 w-4" />;
    case 'EHR_RECORD_REMOVED':
      return <FileMinus2 className="h-4 w-4" />;
    case 'EHR_CHANGE_FAILED':
      return <AlertTriangle className="h-4 w-4" />;
    case 'ACCESS_REQUESTED':
    case 'DOCTOR_ACCESS_GRANTED':
      return <KeyRound className="h-4 w-4" />;
    case 'DOCTOR_ACCESS_REVOKED':
      return <Ban className="h-4 w-4" />;
    case 'DOCTOR_ACCESS_EXPIRED':
      return <Clock className="h-4 w-4" />;
    case 'CONSENT_APPROVED':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'CONSENT_REJECTED':
      return <XCircle className="h-4 w-4" />;
    case 'CONSENT_REQUEST_EXPIRED':
      return <Clock className="h-4 w-4" />;
    case 'CONSENT_REQUEST_CANCELLED':
      return <Ban className="h-4 w-4" />;
    case 'CONSENT_REQUEST_VIEWED':
      return <Eye className="h-4 w-4" />;
    case 'CLARIFICATION_REQUESTED':
      return <MessageCircleQuestion className="h-4 w-4" />;
    case 'CLARIFICATION_REPLIED':
      return <MessageCircleReply className="h-4 w-4" />;
    case 'EHR_MODIFICATION_REQUESTED':
      return <FileText className="h-4 w-4" />;
    case 'EHR_ACCESS_DENIED':
    case 'CONSENT_DECISION_DENIED':
    case 'EHR_MODIFICATION_REQUEST_DENIED':
      return <ShieldAlert className="h-4 w-4" />;
    case 'EMERGENCY_ACCESS_ACTIVATED':
    case 'EMERGENCY_ACCESS_USED':
      return <Siren className="h-4 w-4" />;
    case 'REAUTHENTICATION_SUCCESS':
    case 'REAUTHENTICATION_FAILED':
    case 'PASSWORD_CHANGED':
    case '2FA_ENABLED':
      return <Lock className="h-4 w-4" />;
    case 'EMAIL_NOTIFICATION_SENT':
      return <Mail className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const CATEGORY_TONE: Record<HistoryEvent['category'], { dot: string; chip: string }> = {
  EHR: { dot: 'bg-teal-500', chip: 'bg-teal-50 text-teal-700 border-teal-200' },
  ACCESS: { dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CONSENT: { dot: 'bg-amber-500', chip: 'bg-amber-50 text-amber-700 border-amber-200' },
  SECURITY: { dot: 'bg-rose-500', chip: 'bg-rose-50 text-rose-700 border-rose-200' },
  NOTIFICATION: { dot: 'bg-sky-500', chip: 'bg-sky-50 text-sky-700 border-sky-200' }
};

const RESULT_TONE: Record<string, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  activated: 'bg-amber-50 text-amber-700 border-amber-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  denied: 'bg-rose-50 text-rose-700 border-rose-200',
  failed: 'bg-rose-50 text-rose-700 border-rose-200',
  expired: 'bg-slate-100 text-slate-500 border-slate-200',
  cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
  sent: 'bg-sky-50 text-sky-700 border-sky-200'
};

const STATUS_FILTERS: { id: string; label: string; match: (e: HistoryEvent) => boolean }[] = [
  { id: 'all', label: 'Any status', match: () => true },
  { id: 'approved', label: 'Approved', match: (e) => e.eventType === 'CONSENT_APPROVED' || e.result === 'approved' },
  { id: 'rejected', label: 'Rejected', match: (e) => e.eventType === 'CONSENT_REJECTED' || e.result === 'rejected' },
  { id: 'pending', label: 'Pending', match: (e) => e.result === 'pending' },
  { id: 'expired', label: 'Expired', match: (e) => e.result === 'expired' || e.eventType === 'CONSENT_REQUEST_EXPIRED' },
  { id: 'revoked', label: 'Revoked', match: (e) => e.eventType === 'DOCTOR_ACCESS_REVOKED' },
  { id: 'completed', label: 'Completed', match: (e) => e.result === 'completed' },
  { id: 'denied', label: 'Denied', match: (e) => e.result === 'denied' }
];

const fmt = (iso?: string | null) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return iso;
  }
};
const fmtDay = (iso?: string | null) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
};

// ------------------------------------------------------------- component --
export const MyHistoryView: React.FC<{ initialTab?: TabId }> = ({ initialTab = 'all' }) => {
  const [tab, setTab] = useState<TabId>(initialTab);
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [requests, setRequests] = useState<ConsentReqLite[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [detail, setDetail] = useState<HistoryEvent | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [h, r, n, m] = await Promise.all([
        apiFetch<{ events: HistoryEvent[] }>('/api/me/audit-history'),
        apiFetch<{ requests: ConsentReqLite[] }>('/api/me/consent-requests'),
        apiFetch<{ notifications: AppNotification[] }>('/api/me/notifications'),
        apiFetch<{ emails: EmailRecord[] }>('/api/me/email-outbox')
      ]);
      setEvents(h.events || []);
      setRequests(r.requests || []);
      setNotifications(n.notifications || []);
      setEmails(m.emails || []);
    } catch (e: any) {
      setError(e.message || 'We couldn’t load your history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Keep the selected history section in sync when the header account menu
  // asks for a specific destination (e.g. "Notifications").
  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  // Deep links: #my-history?event=AUD-… or #my-history?request=GH-REQ-…
  useEffect(() => {
    const q = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const ev = q.get('event');
    const rq = q.get('request');
    if (ev) {
      const found = events.find((e) => e.auditId === ev);
      if (found) setDetail(found);
    } else if (rq) {
      const found = [...events].reverse().find((e) => e.requestId === rq);
      if (found) setDetail(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  const requestBy = useMemo(() => {
    const m = new Map<string, ConsentReqLite>();
    requests.forEach((r) => m.set(r.requestId, r));
    return m;
  }, [requests]);

  const tabEvents = useMemo(() => {
    return events.filter((e) => {
      if (tab === 'all') return true;
      if (tab === 'ehr') return e.category === 'EHR';
      if (tab === 'access') return e.category === 'ACCESS';
      if (tab === 'consent') return e.category === 'CONSENT';
      if (tab === 'changes') return CHANGE_EVENTS.has(e.eventType);
      if (tab === 'security') return e.category === 'SECURITY';
      if (tab === 'notifications') return e.category === 'NOTIFICATION';
      return true;
    });
  }, [events, tab]);

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    const doc = doctorFilter.trim().toLowerCase();
    const cat = categoryFilter.trim().toLowerCase();
    const status = STATUS_FILTERS.find((s) => s.id === statusFilter)?.match || (() => true);
    return tabEvents.filter((e) => {
      if (!status(e)) return false;
      if (doc && !e.actorName.toLowerCase().includes(doc)) return false;
      if (cat && !(e.recordCategory || '').toLowerCase().includes(cat)) return false;
      if (dateFrom && new Date(e.timestamp) < new Date(dateFrom)) return false;
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (new Date(e.timestamp) > end) return false;
      }
      if (q) {
        const hay = [e.title, e.detail, e.actorName, e.eventType, e.requestId, e.auditId, e.recordCategory, e.result]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [tabEvents, search, statusFilter, doctorFilter, categoryFilter, dateFrom, dateTo]);

  const download = async (format: 'csv' | 'json') => {
    try {
      const token = getStoredToken();
      const res = await fetch(`/api/me/audit-history?format=${format}`, {
        headers: { Authorization: `Bearer ${token || ''}` }
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `globalhealth-history.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('The download could not be completed. No data was lost.');
    }
  };

  const openEmailLink = async (email: EmailRecord) => {
    if (!email.linkToken) return;
    try {
      const res = await fetch(`/api/email-link/${email.linkToken}`).then((r) => r.json());
      if (res.success && res.redirect) {
        window.location.hash = res.redirect.replace(/^#/, '');
      }
    } catch {
      window.location.hash = 'privacy';
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const deniedCount = events.filter((e) => e.result === 'denied').length;
  const changeCount = events.filter((e) => CHANGE_EVENTS.has(e.eventType)).length;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading your secure history…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-emerald-950 p-6 text-white shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold sm:text-2xl">Health &amp; Security History</h1>
            <p className="text-sm text-slate-300">
              Your health information is yours. You can see who accessed it, what was requested, and every decision you made.
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
          <div className="rounded-2xl bg-white/10 px-3 py-3">
            <div className="text-2xl font-extrabold">{events.length}</div>
            <div className="text-[11px] font-medium text-slate-300">Recorded events</div>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-3">
            <div className="text-2xl font-extrabold">{changeCount}</div>
            <div className="text-[11px] font-medium text-slate-300">Record changes</div>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-3">
            <div className="text-2xl font-extrabold">{pendingCount}</div>
            <div className="text-[11px] font-medium text-slate-300">Awaiting your decision</div>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-3">
            <div className="text-2xl font-extrabold">{deniedCount}</div>
            <div className="text-[11px] font-medium text-slate-300">Blocked attempts</div>
          </div>
        </div>
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-white/5 px-4 py-3 text-xs text-slate-300 ring-1 ring-white/10">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <span>
            This history is <strong className="text-white">append-only</strong>. No one — including GlobalHealth staff — can silently edit,
            hide or delete these records. Each entry carries a tamper-evident security code.
          </span>
        </p>
      </div>

      {error && (
        <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div role="tablist" aria-label="History sections" className="mt-6 flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1 text-sm font-semibold shadow-sm">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              tab === t.id ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Search & filters */}
      {tab !== 'notifications' && tab !== 'downloads' && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by event, doctor, request ID, record…"
                aria-label="Search history"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-emerald-500"
              >
                {STATUS_FILTERS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter by record category"
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-emerald-500"
              >
                <option value="">Any record type</option>
                {[...new Set(events.map((e) => e.recordCategory).filter(Boolean) as string[])].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            <input
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              placeholder="Doctor name"
              aria-label="Filter by doctor"
              className="w-36 rounded-lg border border-slate-200 px-2.5 py-1.5 outline-none focus:border-emerald-500"
            />
            <label className="flex items-center gap-1.5 text-slate-500">
              From
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} aria-label="From date"
                className="rounded-lg border border-slate-200 px-2 py-1.5 outline-none focus:border-emerald-500" />
            </label>
            <label className="flex items-center gap-1.5 text-slate-500">
              To
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} aria-label="To date"
                className="rounded-lg border border-slate-200 px-2 py-1.5 outline-none focus:border-emerald-500" />
            </label>
            {(search || statusFilter !== 'all' || doctorFilter || categoryFilter || dateFrom || dateTo) && (
              <button
                onClick={() => { setSearch(''); setStatusFilter('all'); setDoctorFilter(''); setCategoryFilter(''); setDateFrom(''); setDateTo(''); }}
                className="font-bold text-emerald-700 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* TIMELINE */}
      {tab !== 'notifications' && tab !== 'downloads' && (
        <div className="mt-5">
          {filteredEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <History className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-slate-800">No history matches</h4>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                {events.length === 0 ? 'Activity involving your health record will appear here.' : 'Try adjusting your search or filters.'}
              </p>
            </div>
          ) : (
            <ol className="relative border-l-2 border-emerald-100 pl-6" aria-label="Event timeline">
              {filteredEvents.map((e) => {
                const tone = CATEGORY_TONE[e.category];
                const isExpanded = expanded === e.auditId;
                return (
                  <li key={e.auditId} className="mb-3">
                    <span
                      className={`absolute -left-[11px] top-3 flex h-5 w-5 items-center justify-center rounded-full text-white ring-4 ring-white ${tone.dot}`}
                      aria-hidden="true"
                    >
                      {EVENT_ICON(e)}
                    </span>
                    <div
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-200"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{fmt(e.timestamp)}</div>
                          <button
                            onClick={() => setDetail(e)}
                            className="mt-0.5 text-left text-sm font-bold text-slate-900 hover:text-emerald-700 focus:outline-none focus-visible:underline"
                          >
                            {e.title}
                          </button>
                          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${tone.chip}`}>{e.category}</span>
                            <span>
                              {e.actorRole === 'PATIENT' ? 'You' : e.actorName}
                            </span>
                            {e.recordCategory && <span>· {e.recordCategory}</span>}
                            {e.requestId && <span className="font-mono text-[10px] text-slate-400">· {e.requestId}</span>}
                          </div>
                          {e.detail && <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{e.detail}</p>}
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize ${RESULT_TONE[e.result] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            {e.result}
                          </span>
                          <button
                            onClick={() => setExpanded(isExpanded ? null : e.auditId)}
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? 'Hide details' : 'Show detailed audit information'}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-50"
                          >
                            Details {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                          </button>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="mt-3 grid gap-1.5 rounded-xl bg-slate-50 p-3 font-mono text-[10px] text-slate-500 sm:grid-cols-2">
                          <div>Event ID: {e.auditId}</div>
                          <div>Action: {e.eventType}</div>
                          <div>Actor: {e.actorRole} ({e.actorId})</div>
                          <div>Result: {e.result}</div>
                          {e.recordCategory && <div>Record: {e.recordCategory}</div>}
                          {e.resourceId && <div>Resource: {e.resourceId}</div>}
                          {e.accessPermission && <div>Permission: {e.accessPermission}</div>}
                          {e.sessionId && <div>Session: {e.sessionId}</div>}
                          {e.requestId && <div>Request: {e.requestId}</div>}
                          {e.previousState && <div className="sm:col-span-2">Previous: {String(e.previousState).slice(0, 120)}</div>}
                          {e.newState && <div className="sm:col-span-2">New: {String(e.newState).slice(0, 120)}</div>}
                          {e.hash && <div className="break-all sm:col-span-2">Integrity: {e.hash}</div>}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}

      {/* NOTIFICATIONS TAB */}
      {tab === 'notifications' && (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Bell className="h-4 w-4 text-emerald-600" /> In-app notifications
            </h3>
            <div className="mt-3 space-y-2">
              {notifications.length === 0 && <p className="text-sm text-slate-500">No notifications yet.</p>}
              {notifications.slice(0, 20).map((n) => (
                <button
                  key={n.id}
                  onClick={() => n.requestId && setDetail([...events].reverse().find((e) => e.requestId === n.requestId) || null)}
                  className={`w-full rounded-xl border p-3 text-left transition hover:border-emerald-200 ${n.read ? 'border-slate-100 bg-slate-50/50' : 'border-emerald-200 bg-emerald-50/40'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800">{n.title}</span>
                    <span className="text-[10px] text-slate-400">{fmt(n.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{n.body}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Mail className="h-4 w-4 text-sky-600" /> Verified email (Gmail)
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              GlobalHealth never treats a plain email as approval. Emails only notify you and open a secure link.
            </p>
            <div className="mt-3 space-y-2">
              {emails.length === 0 && <p className="text-sm text-slate-500">No emails sent yet.</p>}
              {emails.slice(0, 20).map((m) => (
                <div key={m.emailId} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800">{m.subject}</span>
                    <span className="shrink-0 text-[10px] text-slate-400">{fmt(m.sentAt)}</span>
                  </div>
                  <p className="mt-1 line-clamp-3 whitespace-pre-line text-xs text-slate-500">{m.body}</p>
                  {m.linkToken && (
                    <button
                      onClick={() => openEmailLink(m)}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      Open in GlobalHealth <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* DOWNLOADS TAB */}
      {tab === 'downloads' && (
        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800">Download your history</h3>
            <p className="mt-1 text-sm text-slate-500">
              Export a protected copy of your Health &amp; Security History. The export contains only your own account’s events —
              event date/time, type, actor, action, request ID, consent decision, record version and status.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => download('csv')}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <Download className="h-4 w-4" /> Download History (CSV)
              </button>
              <button
                onClick={() => download('json')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <Download className="h-4 w-4" /> Download History (JSON)
              </button>
            </div>
            <p className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Exports are generated on demand, authenticated to your session, and contain no other patient’s information.
            </p>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detail && (
        <RequestDetailModal
          event={detail}
          request={requestBy.get(detail.requestId || '')}
          onClose={() => setDetail(null)}
          onGoToRequest={() => {
            const rid = detail.requestId;
            setDetail(null);
            if (rid) window.location.hash = `privacy?request=${rid}`;
          }}
        />
      )}
    </div>
  );
};

// ------------------------------------------------------------- detail -----
const RequestDetailModal: React.FC<{
  event: HistoryEvent;
  request?: ConsentReqLite;
  onClose: () => void;
  onGoToRequest: () => void;
}> = ({ event, request, onClose, onGoToRequest }) => {
  const tone = CATEGORY_TONE[event.category];
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Event details"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 border-b border-slate-100 bg-white/95 p-5 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${tone.chip}`}>{event.category}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize ${RESULT_TONE[event.result] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  {event.result}
                </span>
              </div>
              <h3 className="mt-2 text-base font-extrabold text-slate-900">{event.title}</h3>
            </div>
            <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-slate-400 hover:bg-slate-100">✕</button>
          </div>
        </div>
        <div className="space-y-3.5 p-5 text-sm">
          <Row label="What happened" value={event.detail || event.title} />
          {request && (
            <>
              <Row label="Request" value={request.title} />
              <Row label="Doctor" value={`${request.doctorName} — ${request.organization}`} />
              <Row label="Requested action" value={request.kind === 'add' ? 'Add record' : request.kind === 'edit' ? 'Edit record' : request.kind === 'remove' ? 'Remove / archive record' : 'Access to record'} />
              {request.recordCategory && <Row label="Affected record" value={request.recordCategory} />}
              <Row label="Date submitted" value={fmt(request.createdAt)} />
              <Row label="Date reviewed" value={fmt(request.reviewedAt)} />
              <Row label="Decision" value={request.status} />
              {request.executedAt && <Row label="Execution date" value={fmt(request.executedAt)} />}
              {request.versionNumber && <Row label="Version number" value={`Version ${request.versionNumber}`} />}
              {request.verificationMethod && <Row label="Approval verification" value={request.verificationMethod === 'PASSWORD_REAUTH' ? 'Password re-authentication' : 'Authenticated session'} />}
            </>
          )}
          <Row label="Date of event" value={fmt(event.timestamp)} />
          <Row label="Actor" value={`${event.actorRole === 'PATIENT' ? 'You' : event.actorName} (${event.actorRole})`} />
          {event.recordCategory && <Row label="Record category" value={event.recordCategory} />}
          {event.previousState && (
            <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-3">
              <div className="mb-1 text-[11px] font-bold uppercase text-rose-600">Previous state</div>
              <p className="text-xs text-slate-700">{event.previousState}</p>
            </div>
          )}
          {event.newState && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
              <div className="mb-1 text-[11px] font-bold uppercase text-emerald-700">New state</div>
              <p className="text-xs text-slate-700">{event.newState}</p>
            </div>
          )}
          <Row label="Request ID" value={event.requestId || '—'} mono />
          <Row label="Event ID" value={event.auditId} mono />
          <details className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <summary className="cursor-pointer text-xs font-bold text-slate-600">Audit information (advanced)</summary>
            <div className="mt-2 grid gap-1 font-mono text-[10px] text-slate-500">
              <div>Action: {event.eventType}</div>
              {event.accessPermission && <div>Permission: {event.accessPermission}</div>}
              {event.sessionId && <div>Session: {event.sessionId}</div>}
              {event.resourceType && <div>Resource: {event.resourceType} {event.resourceId || ''}</div>}
              {event.hash && <div className="break-all">Integrity code: {event.hash}</div>}
              {event.prevHash && <div className="break-all">Linked from: {event.prevHash}</div>}
            </div>
          </details>
          {request && request.status === 'pending' && (
            <button
              onClick={onGoToRequest}
              className="mt-1 w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Review this request now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value?: string | null; mono?: boolean }> = ({ label, value, mono }) =>
  value ? (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`text-slate-700 ${mono ? 'font-mono text-xs' : ''}`}>{value}</div>
    </div>
  ) : null;
