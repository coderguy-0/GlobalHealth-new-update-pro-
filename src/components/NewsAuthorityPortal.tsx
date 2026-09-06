import React, { useCallback, useEffect, useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  LogIn,
  LogOut,
  Bell,
  FilePlus2,
  Send,
  Inbox,
  KeyRound,
  Info,
  ChevronDown,
  ExternalLink,
  History,
  MonitorSmartphone,
  UserRound
} from 'lucide-react';
import {
  newsFetch,
  NewsGovError,
  getAuthorityToken,
  storeAuthorityToken,
  clearAuthorityToken
} from '../services/newsGovernanceClient';
import type { NewsMfaState } from '../services/newsGovernanceClient';

// ---------------------------------------------------------------- types ---
interface AuthorityProfile {
  orgName: string;
  orgType: string;
  website: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  representativeName: string;
  representativeRole: string;
  credentials?: string;
  description: string;
  verificationReason: string;
  requestedPermissions: string[];
}
interface AuthorityView {
  authorityId: string;
  profile: AuthorityProfile;
  state: string;
  suspended: boolean;
  permissions: { canSubmit: boolean; canPublish: boolean; categories: string[] };
  appliedAt: string;
  verificationRecord?: { reviewer: string; reviewedAt: string; decision: string; reason: string } | null;
  suspensionRecord?: { reviewer: string; at: string; reason: string } | null;
}
interface GovNotification {
  id: string;
  kind: string;
  title: string;
  body: string;
  read: boolean;
  at: string;
}
interface Submission {
  submissionId: string;
  authorityId: string;
  headline: string;
  summary: string;
  content: string;
  category: string;
  sourceName: string;
  sourceUrl: string;
  sourceDate?: string;
  references: string[];
  highRisk: boolean;
  status: string;
  correctionRequested?: { by: string; note: string; at: string };
  correctionResponse?: { by: string; note: string; at: string };
  revisions: { version: number; at: string; actor: string; note: string; changes: string[] }[];
  createdAt: string;
  submittedAt?: string;
  publishedAt?: string;
  decidedAt?: string;
  correctionNotice?: string;
}

const STATE_META: Record<string, { label: string; cls: string; icon: React.ReactNode; hint: string }> = {
  PENDING_REVIEW: { label: 'Pending Verification', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock className="h-3.5 w-3.5" />, hint: 'Your application is waiting for administrator review.' },
  UNDER_REVIEW: { label: 'Under Review', cls: 'bg-sky-50 text-sky-700 border-sky-200', icon: <Clock className="h-3.5 w-3.5" />, hint: 'An administrator is actively reviewing your application.' },
  MORE_INFO_REQUIRED: { label: 'Additional Information Required', cls: 'bg-orange-50 text-orange-700 border-orange-200', icon: <AlertTriangle className="h-3.5 w-3.5" />, hint: 'The review team needs more information. Check your notifications.' },
  VERIFIED: { label: 'Verified Authority', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <ShieldCheck className="h-3.5 w-3.5" />, hint: 'Your organization is verified by GlobalHealth administrators.' },
  VERIFIED_RESTRICTED: { label: 'Verified with Restrictions', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <ShieldCheck className="h-3.5 w-3.5" />, hint: 'Verified with administrator-assigned restrictions.' },
  SUSPENDED: { label: 'Suspended', cls: 'bg-rose-50 text-rose-700 border-rose-200', icon: <XCircle className="h-3.5 w-3.5" />, hint: 'Submissions are currently blocked.' },
  REVOKED: { label: 'Verification Revoked', cls: 'bg-rose-50 text-rose-700 border-rose-200', icon: <XCircle className="h-3.5 w-3.5" />, hint: 'Your verification has been revoked.' },
  REJECTED: { label: 'Rejected', cls: 'bg-rose-50 text-rose-700 border-rose-200', icon: <XCircle className="h-3.5 w-3.5" />, hint: 'Your application was not approved.' }
};
const SUB_STATUS_META: Record<string, { label: string; cls: string }> = {
  draft: { label: 'Draft', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
  submitted: { label: 'Submitted — awaiting review', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  under_review: { label: 'Under Review', cls: 'bg-sky-50 text-sky-700 border-sky-200' },
  needs_correction: { label: 'Needs Correction', cls: 'bg-orange-50 text-orange-700 border-orange-200' },
  approved: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  published: { label: 'Published', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', cls: 'bg-rose-50 text-rose-700 border-rose-200' }
};

const ORG_TYPES = [
  'Government Health Authority',
  'Hospital / Healthcare Institution',
  'Medical / Professional Body',
  'University / Research Institution',
  'Public Health Organization',
  'Non-Governmental Health Organization',
  'Regulatory Authority',
  'Other Legitimate Health Authority'
];
const REQUESTED_PERM_OPTIONS = [
  { id: 'submit_news', label: 'Submit news articles for review' },
  { id: 'submit_announcements', label: 'Submit official announcements' },
  { id: 'submit_corrections', label: 'Submit corrections to own articles' }
];
const CATEGORIES = [
  'Health News', 'Public Health', 'Medical Research', 'Hospitals & Healthcare',
  'Government Health Updates', 'Disease & Prevention', 'Medicines', 'Vaccines',
  'Medical Technology', 'Mental Health', 'Nutrition', 'Children’s Health',
  'Women’s Health', 'Emergency Health Alerts', 'Healthcare Policy', 'Global Health',
  'Health Education', 'Medical Innovation'
];

const fmt = (iso?: string | null) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
};

// ------------------------------------------------------------- portal -----
export const NewsAuthorityPortal: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [authority, setAuthority] = useState<AuthorityView | null>(null);
  const [token, setToken] = useState<string | null>(getAuthorityToken());
  const [mode, setMode] = useState<'login' | 'register' | 'mfa'>('login');
  const [mfaChallenge, setMfaChallenge] = useState<NewsMfaState | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [portalTab, setPortalTab] = useState<'dashboard' | 'organization' | 'security'>('dashboard');
  const [sessions, setSessions] = useState<{ sessionId: string; createdAt: string; lastActive: string; isCurrent: boolean }[]>([]);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [notifications, setNotifications] = useState<GovNotification[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const [reg, setReg] = useState({
    orgName: '', orgType: ORG_TYPES[0], website: '', contactName: '', contactEmail: '',
    contactPhone: '', address: '', representativeName: '', representativeRole: '',
    credentials: '', description: '', verificationReason: '', requestedPermissions: ['submit_news', 'submit_announcements'], password: ''
  });
  const [regProblems, setRegProblems] = useState<string[]>([]);

  // Composer state
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState({ headline: '', summary: '', content: '', category: CATEGORIES[0], sourceName: '', sourceUrl: '', sourceDate: '', references: '' });
  const [correctNote, setCorrectNote] = useState('');
  const [detail, setDetail] = useState<Submission | null>(null);

  const headers = useCallback(() => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}` }), [token]);

  const loadMe = useCallback(async (tok: string | null) => {
    try {
      const r = await newsFetch<{ authority: AuthorityView; notifications: GovNotification[]; submissions: Submission[] }>('/api/news/authority/me', { token: tok });
      setAuthority(r.authority);
      setNotifications(r.notifications || []);
      setSubmissions(r.submissions || []);
    } catch (e: any) {
      clearAuthorityToken();
      setAuthority(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    if (token) loadMe(token);
  }, [token, loadMe]);

  const completeAuthorityLogin = (r: { token: string; authority?: AuthorityView }) => {
    storeAuthorityToken(r.token);
    setToken(r.token);
  };

  const verifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaChallenge) return;
    setBusy(true);
    setError('');
    try {
      const r = await newsFetch<{ token: string; authority?: AuthorityView; accountType: string }>('/api/news/mfa/verify', {
        method: 'POST',
        body: { challengeId: mfaChallenge.challengeId, code: mfaCode.trim() },
        token: null
      });
      if (r.accountType !== 'authority') {
        setError('This sign-in is for a News Management administrator account. Use the News Management login for administrators.');
        return;
      }
      completeAuthorityLogin(r);
      setMfaChallenge(null);
      setMode('login');
    } catch (e: any) {
      setError(e.message || 'Invalid verification code.');
    } finally {
      setBusy(false);
    }
  };

  // Unified News Management login: the server determines account type.
  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const r = await newsFetch<any>('/api/news/login', {
        method: 'POST',
        body: { identifier: identifier.trim(), password },
        token: null
      });
      if (r.stage === 'mfa') {
        if (r.accountType === 'admin') {
          setError('This account is a GlobalHealth administrator account. Sign in via News Management to reach the administrator dashboard.');
          return;
        }
        setMfaChallenge({ challengeId: r.challengeId, accountType: 'authority', demoDelivery: r.demoDelivery });
        setMfaCode('');
        setMode('mfa');
        return;
      }
      if (r.accountType === 'admin') {
        setError('This account is a GlobalHealth administrator account. Sign in via News Management to reach the administrator dashboard.');
        return;
      }
      completeAuthorityLogin(r);
    } catch (e: any) {
      setError(e.message || 'The sign-in information could not be verified.');
    } finally {
      setBusy(false);
    }
  };

  const loadSessions = useCallback(async (tok: string | null) => {
    try {
      const r = await newsFetch<{ sessions: { sessionId: string; createdAt: string; lastActive: string; isCurrent: boolean }[] }>(
        '/api/news/authority/sessions', { token: tok });
      setSessions(r.sessions || []);
    } catch {
      setSessions([]);
    }
  }, []);

  useEffect(() => {
    if (token) loadSessions(token);
  }, [token, loadSessions]);

  const logout = () => {
    const tok = token;
    if (tok) newsFetch('/api/news/logout', { method: 'POST', token: tok }).catch(() => {});
    clearAuthorityToken();
    setAuthority(null);
    setToken(null);
    setSubmissions([]);
    setNotifications([]);
    setSessions([]);
    setPortalTab('dashboard');
    setError('');
  };

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setRegProblems([]);
    try {
      const r = await newsFetch<{ authority: AuthorityView }>('/api/news/authority/register', {
        method: 'POST',
        body: { ...reg, requestedPermissions: reg.requestedPermissions },
        token: null
      });
      setNotice(`Application submitted for ${r.authority.profile.orgName}. A GlobalHealth administrator will review it. You can sign in to track status.`);
      setMode('login');
    } catch (e: any) {
      if (e instanceof NewsGovError && e.problems) setRegProblems(e.problems);
      else setError(e.message || 'Registration failed.');
    } finally {
      setBusy(false);
    }
  };

  const markNotifsRead = async () => {
    if (!token) return;
    try { await newsFetch('/api/news/authority/notifications/read', { method: 'POST', token }); } catch { /* ignore */ }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const createDraft = async () => {
    setBusy(true);
    setError('');
    try {
      const r = await newsFetch<{ submission: Submission }>('/api/news/authority/submissions', {
        method: 'POST',
        token,
        body: {
          ...draft,
          references: draft.references ? draft.references.split('\n').map((s) => s.trim()).filter(Boolean) : []
        }
      });
      setComposerOpen(false);
      setDraft({ headline: '', summary: '', content: '', category: CATEGORIES[0], sourceName: '', sourceUrl: '', sourceDate: '', references: '' });
      setNotice('Draft created. You can submit it for administrator review.');
      await loadMe(token);
    } catch (e: any) {
      if (e instanceof NewsGovError && e.code === 'POTENTIAL_DUPLICATE') {
        setError(`A similar article already exists: ${(e.similar || []).join(' · ')}. Review it before proceeding.`);
      } else if (e instanceof NewsGovError && e.problems) {
        setRegProblems(e.problems);
      } else {
        setError(e.message || 'Could not create the draft.');
      }
    } finally {
      setBusy(false);
    }
  };

  const submitForReview = async (sub: Submission) => {
    setBusy(true);
    setError('');
    try {
      await newsFetch(`/api/news/authority/submissions/${sub.submissionId}/submit`, { method: 'POST', token, body: {} });
      setNotice(`“${sub.headline}” submitted for administrator review.`);
      setDetail(null);
      await loadMe(token);
    } catch (e: any) {
      if (e instanceof NewsGovError && e.code === 'POTENTIAL_DUPLICATE') {
        setError(`A similar article already exists: ${(e.similar || []).join(' · ')}. Review it before proceeding.`);
      } else {
        setError(e.message || 'Could not submit.');
      }
    } finally {
      setBusy(false);
    }
  };

  const respondCorrection = async (sub: Submission) => {
    setBusy(true);
    setError('');
    try {
      await newsFetch(`/api/news/authority/submissions/${sub.submissionId}/correct`, {
        method: 'POST',
        token,
        body: { note: correctNote.trim() }
      });
      setCorrectNote('');
      setNotice('Correction recorded. Resubmit the article for review when ready.');
      await loadMe(token);
    } catch (e: any) {
      setError(e.message || 'Could not record the correction.');
    } finally {
      setBusy(false);
    }
  };

  const unread = notifications.filter((n) => !n.read).length;
  const canSubmit = !!authority && ['VERIFIED', 'VERIFIED_RESTRICTED'].includes(authority.state) && authority.permissions.canSubmit;

  // ---------------- LOGIN / REGISTER SCREEN ----------------
  if (!authority) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                <Building2 className="h-7 w-7" />
              </div>
              <h1 className="text-xl font-extrabold text-slate-900">GlobalHealth — Verified Authority Portal</h1>
              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                For hospitals, public-health bodies, research institutions and official health authorities that submit news for GlobalHealth administrator review.
              </p>
            </div>

            {mode !== 'mfa' && (
              <div className="mb-5 flex gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 text-sm font-semibold">
                {(['login', 'register'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(''); setRegProblems([]); }}
                    className={`flex-1 rounded-xl px-3 py-2 transition ${mode === m ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {m === 'login' ? 'Sign In' : 'Apply for Verification'}
                  </button>
                ))}
              </div>
            )}

            {error && <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
            {notice && <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</div>}
            {regProblems.length > 0 && (
              <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <div className="font-bold">Please fix the following:</div>
                <ul className="mt-1 list-disc pl-4">{regProblems.map((p, i) => <li key={i}>{p}</li>)}</ul>
              </div>
            )}

            {mode === 'mfa' && mfaChallenge ? (
              <form onSubmit={verifyMfa} className="space-y-3">
                <div className="flex items-start gap-2.5 rounded-xl bg-teal-50 border border-teal-200 px-3 py-2.5 text-xs text-teal-800">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Identity verified. Enter the 6-digit security code sent to{' '}
                    <strong>{mfaChallenge.demoDelivery.recipientEmail}</strong> (your account holds publishing
                    permissions, so MFA is required).
                  </span>
                </div>
                <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-800">
                  <span className="font-bold">Simulated email delivery</span> (demo environment): your code is{' '}
                  <span className="font-mono text-sm font-bold tracking-widest">{mfaChallenge.demoDelivery.code}</span>
                </div>
                <input
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit code"
                  inputMode="numeric"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-center font-mono text-lg tracking-[0.5em] outline-none focus:border-teal-500 focus:bg-white"
                />
                <button
                  disabled={busy || mfaCode.length !== 6}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-3 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-50"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Verify &amp; Continue
                </button>
                <button type="button" onClick={() => { setMode('login'); setMfaChallenge(null); setError(''); }} className="w-full text-xs text-slate-500 hover:text-slate-700">
                  ← Use different credentials
                </button>
              </form>
            ) : mode === 'login' ? (
              <form onSubmit={login} className="space-y-3">
                <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Contact email or organization name" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:bg-white" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:bg-white" />
                <button disabled={busy || !identifier.trim() || !password} className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-3 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-50">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />} Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={register} className="space-y-3">
                <p className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
                  Registering does NOT grant any trust or permission. A GlobalHealth administrator reviews every application before verification.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Organization name *"><input required value={reg.orgName} onChange={(e) => setReg({ ...reg, orgName: e.target.value })} className="inp" /></Field>
                  <Field label="Organization type *">
                    <select value={reg.orgType} onChange={(e) => setReg({ ...reg, orgType: e.target.value })} className="inp">
                      {ORG_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Official website *"><input required type="url" placeholder="https://…" value={reg.website} onChange={(e) => setReg({ ...reg, website: e.target.value })} className="inp" /></Field>
                  <Field label="Official contact *"><input required value={reg.contactName} onChange={(e) => setReg({ ...reg, contactName: e.target.value })} className="inp" /></Field>
                  <Field label="Official contact email *"><input required type="email" value={reg.contactEmail} onChange={(e) => setReg({ ...reg, contactEmail: e.target.value })} className="inp" /></Field>
                  <Field label="Contact phone"><input value={reg.contactPhone} onChange={(e) => setReg({ ...reg, contactPhone: e.target.value })} className="inp" /></Field>
                  <Field label="Authorized representative *"><input required value={reg.representativeName} onChange={(e) => setReg({ ...reg, representativeName: e.target.value })} className="inp" /></Field>
                  <Field label="Role / designation *"><input required value={reg.representativeRole} onChange={(e) => setReg({ ...reg, representativeRole: e.target.value })} className="inp" /></Field>
                </div>
                <Field label="Address"><input value={reg.address} onChange={(e) => setReg({ ...reg, address: e.target.value })} className="inp" /></Field>
                <Field label="Professional / institutional credentials"><textarea rows={2} value={reg.credentials} onChange={(e) => setReg({ ...reg, credentials: e.target.value })} className="inp" /></Field>
                <Field label="Organization description * (min 30 characters)"><textarea required rows={3} value={reg.description} onChange={(e) => setReg({ ...reg, description: e.target.value })} className="inp" /></Field>
                <Field label="Why you are applying for verification * (min 20 characters)"><textarea required rows={2} value={reg.verificationReason} onChange={(e) => setReg({ ...reg, verificationReason: e.target.value })} className="inp" /></Field>
                <div>
                  <span className="mb-1.5 block text-xs font-bold text-slate-500">Requested publishing permissions</span>
                  <div className="grid gap-1.5 sm:grid-cols-3">
                    {REQUESTED_PERM_OPTIONS.map((p) => (
                      <label key={p.id} className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-medium ${reg.requestedPermissions.includes(p.id) ? 'border-teal-300 bg-teal-50 text-teal-800' : 'border-slate-200 text-slate-600'}`}>
                        <input
                          type="checkbox"
                          className="accent-teal-600"
                          checked={reg.requestedPermissions.includes(p.id)}
                          onChange={() => setReg({ ...reg, requestedPermissions: reg.requestedPermissions.includes(p.id) ? reg.requestedPermissions.filter((x) => x !== p.id) : [...reg.requestedPermissions, p.id] })}
                        />
                        {p.label}
                      </label>
                    ))}
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400">Final permissions are assigned by the administrator. Direct publishing is never granted automatically.</p>
                </div>
                <Field label="Account password * (min 8 characters)"><input required type="password" minLength={8} value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} className="inp" /></Field>
                <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-3 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-50">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Submit Verification Application
                </button>
              </form>
            )}
            <button onClick={onExit} className="mt-4 w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-700">← Back to GlobalHealth</button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- DASHBOARD ----------------
  const stateMeta = STATE_META[authority.state] || STATE_META.PENDING_REVIEW;
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-teal-950/20 bg-teal-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"><Building2 className="h-5 w-5" /></div>
            <div>
              <div className="flex flex-wrap items-center gap-2 font-bold">
                {authority.profile.orgName}
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${authority.state === 'VERIFIED' || authority.state === 'VERIFIED_RESTRICTED' ? 'bg-teal-500/30 text-teal-50 ring-teal-300/40' : 'bg-white/10 text-teal-100 ring-white/20'}`}>
                  {authority.state === 'VERIFIED' || authority.state === 'VERIFIED_RESTRICTED' ? <ShieldCheck className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {stateMeta.label}
                </span>
              </div>
              <div className="text-xs text-teal-100/80">{authority.profile.orgType} · {authority.profile.website}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markNotifsRead(); }}
                className="relative rounded-xl border border-white/20 p-2 hover:bg-white/10"
                aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
              >
                <Bell className="h-4 w-4" />
                {unread > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold">{unread}</span>}
              </button>
              {notifOpen && (
                <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 text-slate-800 shadow-xl">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-extrabold">Notifications</span>
                    <button onClick={() => setNotifOpen(false)} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
                  </div>
                  <div className="max-h-72 space-y-2 overflow-y-auto">
                    {notifications.length === 0 && <p className="text-xs text-slate-400">No notifications yet.</p>}
                    {notifications.map((n) => (
                      <div key={n.id} className={`rounded-xl border p-2.5 text-xs ${n.read ? 'border-slate-100 bg-slate-50/50' : 'border-teal-200 bg-teal-50/50'}`}>
                        <div className="font-bold">{n.title}</div>
                        <p className="mt-0.5 text-slate-500">{n.body}</p>
                        <div className="mt-1 text-[10px] text-slate-400">{fmt(n.at)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={onExit} className="hidden rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold hover:bg-white/10 sm:block">GlobalHealth</button>
            <button onClick={logout} className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/20"><LogOut className="h-3.5 w-3.5" /> Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {error && (
          <div className="mb-4 flex items-start justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-rose-400 hover:text-rose-600">✕</button>
          </div>
        )}
        {notice && (
          <div className="mb-4 flex items-start justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span>{notice}</span>
            <button onClick={() => setNotice('')} className="text-emerald-400 hover:text-emerald-600">✕</button>
          </div>
        )}

        {/* Portal section tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1 text-sm font-semibold shadow-sm">
          {([
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'organization', label: 'My Organization' },
            { id: 'security', label: 'Profile & Security' }
          ] as const).map((tb) => (
            <button
              key={tb.id}
              onClick={() => setPortalTab(tb.id)}
              className={`shrink-0 rounded-xl px-3.5 py-2 transition ${portalTab === tb.id ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {/* Status & permissions */}
        <div className={`mb-6 grid gap-3 lg:grid-cols-3 ${portalTab !== 'dashboard' ? 'hidden' : ''}`}>
          <div className={`rounded-2xl border p-4 ${stateMeta.cls}`}>
            <div className="flex items-center gap-2 text-sm font-extrabold">{stateMeta.icon} {stateMeta.label}</div>
            <p className="mt-1 text-xs opacity-90">{stateMeta.hint}</p>
            {authority.verificationRecord && (
              <p className="mt-2 text-[11px] opacity-90">
                Reviewed by {authority.verificationRecord.reviewer} on {fmt(authority.verificationRecord.reviewedAt)}.
              </p>
            )}
            {authority.suspensionRecord && (
              <p className="mt-2 text-[11px] font-bold">
                Reason: {authority.suspensionRecord.reason}
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800"><KeyRound className="h-4 w-4 text-teal-700" /> Assigned Permissions</div>
            <div className="mt-2 space-y-1 text-xs">
              <PermRow ok={authority.permissions.canSubmit} label="Submit news for review" />
              <PermRow ok={authority.permissions.canPublish} label="Direct publishing (exceptional)" dimmed={!authority.permissions.canPublish} />
              <div className="text-slate-500">Categories: <span className="font-semibold text-slate-700">{(authority.permissions.categories || []).join(', ') || '—'}</span></div>
            </div>
            {!authority.permissions.canPublish && (
              <p className="mt-2 rounded-lg bg-slate-50 px-2 py-1.5 text-[10px] text-slate-500">
                By default, verified authorities submit — a GlobalHealth administrator reviews and publishes.
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800"><Inbox className="h-4 w-4 text-teal-700" /> My Submissions</div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
              <StatBox label="Total" value={submissions.length} />
              <StatBox label="Pending" value={submissions.filter((s) => ['draft', 'submitted', 'needs_correction'].includes(s.status)).length} />
              <StatBox label="Published" value={submissions.filter((s) => s.status === 'published').length} />
            </div>
            {canSubmit ? (
              <button onClick={() => setComposerOpen(true)} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-teal-700 py-2 text-xs font-bold text-white hover:bg-teal-800">
                <FilePlus2 className="h-3.5 w-3.5" /> Create News Draft
              </button>
            ) : (
              <p className="mt-3 rounded-lg bg-amber-50 px-2 py-1.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                Submission is not currently available for your account.
              </p>
            )}
          </div>
        </div>

        {/* Submissions list */}
        <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${portalTab !== 'dashboard' ? 'hidden' : ''}`}>
          <h3 className="mb-3 flex items-center gap-2 font-extrabold text-slate-900"><History className="h-4 w-4 text-teal-700" /> My Submissions <span className="text-[10px] font-semibold text-slate-400">— you can only ever see your organization's own submissions</span></h3>
          {submissions.length === 0 && (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No submissions yet. Once verified with submission permission, create your first draft.</p>
          )}
          <div className="space-y-2">
            {submissions.map((s) => {
              const meta = SUB_STATUS_META[s.status] || SUB_STATUS_META.draft;
              return (
                <div key={s.submissionId} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button onClick={() => setDetail(s)} className="min-w-0 text-left">
                      <div className="truncate text-sm font-bold text-slate-800 hover:text-teal-700">{s.headline}</div>
                      <div className="text-[11px] text-slate-400">{s.category} · created {fmt(s.createdAt)}{s.publishedAt ? ` · published ${fmt(s.publishedAt)}` : ''}</div>
                    </button>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${meta.cls}`}>{meta.label}{s.highRisk ? ' · High-Risk' : ''}</span>
                  </div>
                  {s.status === 'needs_correction' && s.correctionRequested && (
                    <div className="mt-2 rounded-xl border border-orange-200 bg-orange-50 p-3 text-xs text-orange-800">
                      <div className="font-bold">Corrections requested by {s.correctionRequested.by} ({fmt(s.correctionRequested.at)}):</div>
                      <p className="mt-1">{s.correctionRequested.note}</p>
                      <textarea
                        value={correctNote}
                        onChange={(e) => setCorrectNote(e.target.value)}
                        rows={2}
                        placeholder="Describe your correction (then resubmit for review)…"
                        className="mt-2 w-full rounded-lg border border-orange-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-teal-500"
                      />
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          disabled={busy || correctNote.trim().length < 5}
                          onClick={() => respondCorrection(s)}
                          className="rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
                        >
                          {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Record Correction'}
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => submitForReview(s)}
                          className="rounded-lg border border-teal-300 bg-white px-3 py-1.5 text-xs font-bold text-teal-800 hover:bg-teal-50 disabled:opacity-50"
                        >
                          <Send className="mr-1 inline h-3 w-3" /> Resubmit for Review
                        </button>
                      </div>
                    </div>
                  )}
                  {(s.status === 'draft' || s.status === 'needs_correction') && (
                    <div className="mt-2 flex justify-end">
                      {s.status === 'draft' && (
                        <button disabled={busy} onClick={() => submitForReview(s)} className="flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-800 disabled:opacity-50">
                          <Send className="h-3 w-3" /> Submit for Review
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

        {/* My Organization */}
        {portalTab === 'organization' && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 font-extrabold text-slate-900">
                  <Building2 className="h-4 w-4 text-teal-700" /> {authority.profile.orgName}
                </h3>
                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${stateMeta.cls}`}>{stateMeta.label}</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <OrgRow label="Organization type" value={authority.profile.orgType} />
                <OrgRow label="Official website" value={authority.profile.website} />
                <OrgRow label="Organization contact" value={`${authority.profile.contactName} · ${authority.profile.contactEmail}${authority.profile.contactPhone ? ` · ${authority.profile.contactPhone}` : ''}`} />
                {authority.profile.address && <OrgRow label="Address" value={authority.profile.address} />}
                <OrgRow label="Authorized representative" value={`${authority.profile.representativeName} — ${authority.profile.representativeRole}`} />
                {authority.profile.credentials && <OrgRow label="Credentials" value={authority.profile.credentials} />}
              </div>
              <div className="mt-4 rounded-xl bg-slate-50 p-3">
                <div className="text-[11px] font-bold uppercase text-slate-400">About this organization</div>
                <p className="mt-0.5 text-xs text-slate-600">{authority.profile.description}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Verification information
              </h4>
              {authority.verificationRecord ? (
                <div className="space-y-2 text-xs text-slate-600">
                  <p><strong>Status:</strong> {authority.verificationRecord.decision}</p>
                  <p><strong>Reviewed by:</strong> {authority.verificationRecord.reviewer} (GlobalHealth administrator)</p>
                  <p><strong>Review date:</strong> {fmt(authority.verificationRecord.reviewedAt)}</p>
                  <p><strong>Decision reason:</strong> {authority.verificationRecord.reason}</p>
                  <p className="rounded-lg bg-slate-50 px-2.5 py-2 text-slate-500">
                    Verification confirms this organization's identity. It does not mean GlobalHealth
                    independently endorses every individual claim made by the organization.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Your verification is currently <strong>{stateMeta.label.toLowerCase()}</strong>. A GlobalHealth
                  administrator reviews every application before verification — check your notifications for updates.
                </p>
              )}
              {authority.suspensionRecord && (
                <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                  Suspension reason: {authority.suspensionRecord.reason}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Profile & Security */}
        {portalTab === 'security' && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 font-extrabold text-slate-900">
                <UserRound className="h-4 w-4 text-teal-700" /> Account
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <OrgRow label="Account holder" value={authority.profile.representativeName} />
                <OrgRow label="Role in organization" value={authority.profile.representativeRole} />
                <OrgRow label="Account email" value={authority.profile.contactEmail} />
                <OrgRow label="Organization" value={authority.profile.orgName} />
              </div>
              <p className="mt-3 rounded-lg bg-slate-50 px-2.5 py-2 text-[11px] text-slate-500">
                This is an individual account belonging to {authority.profile.orgName}. You cannot change the
                organization's verification status or permissions — those are managed by GlobalHealth administrators.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Verification status &amp; assigned permissions
              </h4>
              <div className="mb-2 flex items-center gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${stateMeta.cls}`}>{stateMeta.label}</span>
              </div>
              <div className="space-y-1 text-xs">
                <PermRow ok={authority.permissions.canSubmit} label="Submit news articles for review" />
                <PermRow ok={authority.permissions.canPublish} label="Direct publishing (exceptional permission)" dimmed={!authority.permissions.canPublish} />
                <div className="text-slate-500">Categories: <span className="font-semibold text-slate-700">{(authority.permissions.categories || []).join(', ') || '—'}</span></div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <MonitorSmartphone className="h-4 w-4 text-teal-700" /> Active sessions
              </h4>
              {sessions.length === 0 ? (
                <p className="text-xs text-slate-500">No active sessions detected.</p>
              ) : (
                <div className="space-y-2">
                  {sessions.map((s) => (
                    <div key={s.sessionId} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs">
                      <div>
                        <div className="font-mono text-slate-600">{s.sessionId}</div>
                        <div className="text-slate-400">Active since {fmt(s.createdAt)} · last active {fmt(s.lastActive)}</div>
                      </div>
                      {s.isCurrent ? (
                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">This session</span>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={async () => {
                    try {
                      const r = await newsFetch('/api/news/authority/sessions/terminate-all', { method: 'POST', token });
                      setNotice(`${r.terminated} other session(s) signed out.`);
                      loadSessions(token);
                    } catch (e: any) { setError(e.message || 'Could not sign out other sessions.'); }
                  }}
                  className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Sign Out of All Other Sessions
                </button>
                <button onClick={logout} className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700">
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Draft composer */}
      {composerOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" onClick={() => !busy && setComposerOpen(false)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-2">
              <FilePlus2 className="h-5 w-5 text-teal-700" />
              <h3 className="text-lg font-extrabold text-slate-900">Create News Draft</h3>
            </div>
            <p className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-700">
              Drafts are private to your organization. Nothing is published — a GlobalHealth administrator reviews and decides.
            </p>
            <div className="space-y-3 text-sm">
              <Field label="Headline * (min 10 characters)"><input value={draft.headline} onChange={(e) => setDraft({ ...draft, headline: e.target.value })} className="inp" /></Field>
              <Field label="Summary * (min 30 characters)"><textarea rows={2} value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} className="inp" /></Field>
              <Field label="Full article * (min 100 characters)"><textarea rows={7} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} className="inp" /></Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Category *">
                  <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="inp">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Source name *"><input value={draft.sourceName} onChange={(e) => setDraft({ ...draft, sourceName: e.target.value })} className="inp" /></Field>
                <Field label="Source URL"><input type="url" value={draft.sourceUrl} onChange={(e) => setDraft({ ...draft, sourceUrl: e.target.value })} className="inp" /></Field>
                <Field label="Source date"><input value={draft.sourceDate} onChange={(e) => setDraft({ ...draft, sourceDate: e.target.value })} placeholder="e.g. 2026-08-20" className="inp" /></Field>
              </div>
              <Field label="Supporting references (one per line)"><textarea rows={2} value={draft.references} onChange={(e) => setDraft({ ...draft, references: e.target.value })} className="inp" /></Field>
              {CATEGORIES.indexOf(draft.category) >= 0 && (['Emergency Health Alerts', 'Vaccines', 'Medicines'].includes(draft.category)) && (
                <p className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  This category is classified <strong>high-risk</strong>. Publication requires an explicit medical/subject-matter review confirmation by the editorial team.
                </p>
              )}
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setComposerOpen(false)} disabled={busy} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
              <button
                disabled={busy || draft.headline.trim().length < 10 || draft.summary.trim().length < 30 || draft.content.trim().length < 100 || !draft.sourceName.trim()}
                onClick={createDraft}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-700 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FilePlus2 className="h-4 w-4" />} Save Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission detail */}
      {detail && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" onClick={() => setDetail(null)}>
          <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${(SUB_STATUS_META[detail.status] || SUB_STATUS_META.draft).cls}`}>
                  {(SUB_STATUS_META[detail.status] || SUB_STATUS_META.draft).label}
                </span>
                <h3 className="mt-2 text-base font-extrabold text-slate-900">{detail.headline}</h3>
                <div className="text-[11px] text-slate-400">{detail.submissionId}</div>
              </div>
              <button onClick={() => setDetail(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">✕</button>
            </div>
            <div className="space-y-2.5 text-sm">
              <DetailRow label="Category" value={detail.category} />
              <DetailRow label="Source" value={`${detail.sourceName}${detail.sourceUrl ? ` — ${detail.sourceUrl}` : ''}`} />
              {detail.sourceDate && <DetailRow label="Source date" value={detail.sourceDate} />}
              <DetailRow label="Summary" value={detail.summary} />
              <div>
                <div className="text-[11px] font-bold uppercase text-slate-400">Article</div>
                <p className="mt-0.5 whitespace-pre-line text-slate-700">{detail.content}</p>
              </div>
              {detail.highRisk && (
                <p className="flex items-center gap-1.5 rounded-lg bg-rose-50 px-2 py-1.5 text-[11px] font-bold text-rose-700 border border-rose-200">
                  <AlertTriangle className="h-3.5 w-3.5" /> High-risk content — medical review required before publication.
                </p>
              )}
              {detail.correctionNotice && (
                <p className="rounded-lg bg-amber-50 px-2 py-1.5 text-[11px] font-semibold text-amber-800 border border-amber-200">Correction: {detail.correctionNotice}</p>
              )}
              <div>
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase text-slate-400"><ChevronDown className="h-3 w-3" /> Revision history</div>
                <div className="space-y-1.5">
                  {[...detail.revisions].reverse().map((r) => (
                    <div key={r.version} className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-600">
                      <span className="font-bold text-teal-700">v{r.version}</span> · {fmt(r.at)} · {r.actor} — {r.note}{r.changes.length ? ` (${r.changes.join(', ')})` : ''}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block">
    <span className="mb-1 block text-xs font-bold text-slate-500">{label}</span>
    {children}
  </label>
);
const OrgRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-2.5">
    <div className="text-[10px] font-bold uppercase text-slate-400">{label}</div>
    <div className="mt-0.5 break-words text-xs text-slate-700">{value}</div>
  </div>
);
const PermRow: React.FC<{ ok: boolean; label: string; dimmed?: boolean }> = ({ ok, label, dimmed }) => (
  <div className={`flex items-center gap-1.5 ${ok ? 'text-emerald-700' : dimmed ? 'text-slate-400' : 'text-rose-600'}`}>
    {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
    <span className={ok ? 'font-semibold' : ''}>{label}</span>
  </div>
);
const StatBox: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="rounded-xl bg-slate-50 py-2">
    <div className="text-lg font-extrabold text-slate-800">{value}</div>
    <div className="text-[10px] text-slate-400">{label}</div>
  </div>
);
const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-[11px] font-bold uppercase text-slate-400">{label}</div>
    <div className="text-slate-700">{value}</div>
  </div>
);
