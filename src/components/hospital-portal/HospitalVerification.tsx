import React, { useState } from 'react';
import { ShieldCheck, FileText, Upload, AlertTriangle, CheckCircle2, ClipboardList, ArrowRight } from 'lucide-react';
import { useHospitalPortal, VERIFICATION_LABEL, DOCUMENT_TYPES, HospitalDocument } from './hospitalPortalData';

interface HospitalVerificationProps {
  section: 'verification' | 'documents' | 'action_required';
}

const cardCls = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-soft';
const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition';
const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700';

export const HospitalVerification: React.FC<HospitalVerificationProps> = ({ section }) => {
  if (section === 'documents') return <DocumentsView />;
  if (section === 'action_required') return <ActionRequiredView />;
  return <VerificationView />;
};

/* ---------------- Verification (§11–13) ---------------- */

const FLOW_STEPS = ['Registration', 'Document Review', 'Facility Verification', 'Representative Verification', 'Approval'];

const VerificationView: React.FC = () => {
  const { organization, verification, submitVerification } = useHospitalPortal();
  const idx = verification.status === 'verified' ? FLOW_STEPS.length : verification.status === 'under_review' ? 2 : verification.status === 'pending' ? 1 : verification.status === 'additional_info_required' ? 2 : 0;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Verification</h2>
        <p className="text-xs text-slate-500">“Verified Hospital” is displayed only after the full workflow succeeds.</p>
      </div>

      <section className={cardCls} aria-labelledby="ver-status">
        <h3 id="ver-status" className="mb-4 text-sm font-extrabold text-slate-900">Verification status</h3>
        <div className="flex flex-wrap items-center gap-2">
          {FLOW_STEPS.map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <span className={`h-px w-4 ${i <= idx ? 'bg-medical-500' : 'bg-slate-200'}`} aria-hidden="true" />}
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                i === idx && verification.status !== 'verified' ? 'bg-medical-600 text-white'
                : i < idx || (verification.status === 'verified' && i < FLOW_STEPS.length) ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-400'
              }`}>
                {verification.status === 'verified' && i === FLOW_STEPS.length - 1 ? '✓ ' : ''}{s}
              </span>
            </React.Fragment>
          ))}
        </div>

        <div className={`mt-4 rounded-2xl border p-4 ${verification.status === 'verified' ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
          {verification.status === 'verified' ? (
            <>
              <p className="flex items-center gap-2 text-sm font-extrabold text-emerald-900"><ShieldCheck className="h-4 w-4" /> Verified Hospital</p>
              <p className="mt-1 text-xs text-emerald-800/90">
                Last verified: <strong>{organization.verificationDate}</strong> · Source: {organization.verificationSource}
              </p>
            </>
          ) : (
            <>
              <p className="flex items-center gap-2 text-sm font-extrabold text-amber-900">
                <AlertTriangle className="h-4 w-4" /> Verification in progress — {Math.max(0, verification.stepsTotal - verification.stepsDone)} step{verification.stepsTotal - verification.stepsDone === 1 ? '' : 's'} remaining
              </p>
              <p className="mt-1 text-xs text-amber-800/90">{verification.nextAction}</p>
              {verification.status === 'pending' && (
                <button type="button" onClick={submitVerification} className="mt-3 cursor-pointer rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700">
                  Submit verification documents
                </button>
              )}
              {verification.status === 'additional_info_required' && (
                <button type="button" onClick={submitVerification} className="mt-3 cursor-pointer rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700">
                  Submit additional information
                </button>
              )}
            </>
          )}
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-2.5"><dt className="text-[9px] font-bold uppercase text-slate-400">Submitted</dt><dd className="font-bold text-slate-700">{verification.submittedAt || '—'}</dd></div>
          <div className="rounded-lg bg-slate-50 p-2.5"><dt className="text-[9px] font-bold uppercase text-slate-400">Reviewed</dt><dd className="font-bold text-slate-700">{verification.reviewedAt || '—'}</dd></div>
          <div className="rounded-lg bg-slate-50 p-2.5"><dt className="text-[9px] font-bold uppercase text-slate-400">Reviewed by</dt><dd className="font-bold text-slate-700">{verification.reviewedBy || '—'}</dd></div>
        </dl>
      </section>

      <section className={cardCls} aria-labelledby="ver-actions">
        <h3 id="ver-actions" className="mb-2 text-sm font-extrabold text-slate-900">What to complete</h3>
        <ul className="space-y-1.5 text-xs text-slate-600">
          <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Hospital registration completed</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Required documents uploaded</li>
          <li className="flex items-center gap-2"><span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-amber-100 text-[8px] font-bold text-amber-700">2</span> Facility &amp; representative verification {verification.status === 'verified' ? 'completed' : 'in progress'}</li>
        </ul>
      </section>
    </div>
  );
};

/* ---------------- Documents (§60–61) ---------------- */

const DocumentsView: React.FC = () => {
  const { organization, documents, addDocument } = useHospitalPortal();
  const [docType, setDocType] = useState<HospitalDocument['type']>('verification');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [ok, setOk] = useState('');

  const scoped = documents.filter((d) => d.hospitalId === organization.id);

  const upload = () => {
    if (!name.trim()) return;
    addDocument({ type: docType, name: name.trim(), sizeKB: Math.floor(Math.random() * 900) + 80, expiresAt: expiry || undefined });
    setName(''); setExpiry('');
    setOk(`“${name.trim()}” uploaded — it is encrypted and pending verification.`);
    window.setTimeout(() => setOk(''), 5000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Document Center</h2>
        <p className="text-xs text-slate-500">Secure uploads · versioned · never exposed publicly.</p>
      </div>

      {ok && <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> {ok}</p>}

      <section className={`${cardCls} border-2 border-dashed border-medical-200 bg-medical-50/40`} aria-labelledby="doc-upload">
        <h3 id="doc-upload" className="flex items-center justify-center gap-2 text-sm font-extrabold text-medical-800"><Upload className="h-4 w-4" /> Secure upload (simulated)</h3>
        <p className="mt-1 text-center text-[11px] text-slate-500">PDF/JPG/PNG · max 10 MB · virus-scanned · encrypted at rest · versioned on update.</p>
        <div className="mx-auto mt-3 flex max-w-md flex-wrap items-center justify-center gap-2">
          <select value={docType} onChange={(e) => setDocType(e.target.value as HospitalDocument['type'])} className={`${inputCls} !w-36`} aria-label="Document type">
            {DOCUMENT_TYPES.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Document name" className={`${inputCls} min-w-0 flex-1`} aria-label="Document name" />
          <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className={inputCls} aria-label="Expiry date (optional)" />
          <button type="button" onClick={upload} disabled={!name.trim()} className="cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700 disabled:opacity-40">Upload</button>
        </div>
      </section>

      <section className={cardCls} aria-labelledby="doc-list">
        <h3 id="doc-list" className="mb-3 text-sm font-extrabold text-slate-900">Documents ({scoped.length})</h3>
        {scoped.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No documents yet.</p>
        ) : (
          <ul className="space-y-2">
            {scoped.map((d) => {
              const today = new Date().toISOString().slice(0, 10);
              const daysLeft = d.expiresAt ? Math.ceil((new Date(d.expiresAt).getTime() - new Date(today).getTime()) / 86400000) : null;
              const expired = daysLeft !== null && daysLeft < 0;
              const expiring = !expired && daysLeft !== null && daysLeft <= 30;
              return (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-medical-600 ring-1 ring-slate-200"><FileText className="h-4 w-4" /></span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-800">{d.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {d.type} · v{d.version} · {d.sizeKB} KB · uploaded {d.uploadedAt} by {d.uploadedBy}
                        {d.reviewedBy && ` · reviewed by ${d.reviewedBy}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                      d.status === 'verified' ? 'bg-emerald-50 text-emerald-700'
                      : d.status === 'expired' ? 'bg-rose-50 text-rose-700'
                      : d.status === 'expiring_soon' ? 'bg-amber-50 text-amber-800'
                      : 'bg-slate-100 text-slate-500'
                    }`}>
                      {d.status === 'verified' ? 'Verified' : d.status === 'expired' ? 'Expired' : d.status === 'expiring_soon' ? 'Expiring' : 'Pending verification'}
                    </span>
                    {expired && <span className="text-[10px] font-bold text-rose-700">Expired — renew</span>}
                    {expiring && <span className="text-[10px] font-bold text-amber-700">Expires in {daysLeft} days</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-3 text-[10px] text-slate-400">Expired private documents are never shown publicly. Expiry reminders are sent to administrators.</p>
      </section>
    </div>
  );
};

/* ---------------- Action required (§54, §106) ---------------- */

const ActionRequiredView: React.FC = () => {
  const { organization, doctors, documents, notifications, markNotificationRead } = useHospitalPortal();
  const today = new Date().toISOString().slice(0, 10);

  const tasks: { priority: 'high' | 'attention' | 'recommended'; label: string; detail: string; cta: string; action: () => void }[] = [];

  if (organization.verificationStatus !== 'verified') {
    tasks.push({ priority: 'high', label: 'Verification issue', detail: 'Complete hospital verification to activate the portal.', cta: 'Open verification', action: () => {} });
  }
  const expiringDoc = documents.find((d) => d.hospitalId === organization.id && d.status === 'expiring_soon');
  if (expiringDoc) tasks.push({ priority: 'attention', label: 'Upload missing document', detail: `${expiringDoc.name} expires soon — upload the renewal.`, cta: 'Open documents', action: () => {} });
  const pendingDocs = doctors.filter((d) => d.hospitalId === organization.id && d.affiliationStatus === 'pending');
  if (pendingDocs.length) tasks.push({ priority: 'attention', label: 'Confirm doctor affiliation', detail: `${pendingDocs.length} doctor(s) await confirmation.`, cta: 'Open doctors', action: () => {} });
  if (organization.missingProfileFields.length) tasks.push({ priority: 'recommended', label: 'Complete hospital profile', detail: organization.missingProfileFields[0], cta: 'Open profile', action: () => {} });
  if (organization.hours.length === 0) tasks.push({ priority: 'recommended', label: 'Set opening hours', detail: 'No general hours configured.', cta: 'Open hours', action: () => {} });

  const unread = notifications.filter((n) => !n.read);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Action Required</h2>
        <p className="text-xs text-slate-500">Prioritized tasks keep your public profile accurate — more useful than decorative metrics.</p>
      </div>

      <section className={cardCls} aria-labelledby="tasks-list">
        <h3 id="tasks-list" className="mb-3 text-sm font-extrabold text-slate-900">Tasks ({tasks.length})</h3>
        {tasks.length === 0 ? (
          <p className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> No outstanding tasks.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => (
              <li key={t.label} className={`flex items-center gap-3 rounded-xl border p-3 ${
                t.priority === 'high' ? 'border-rose-200 bg-rose-50/60' : t.priority === 'attention' ? 'border-amber-200 bg-amber-50/60' : 'border-slate-100 bg-slate-50/60'
              }`}>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                  t.priority === 'high' ? 'bg-rose-100 text-rose-700' : t.priority === 'attention' ? 'bg-amber-100 text-amber-700' : 'bg-white text-medical-600 ring-1 ring-slate-200'
                }`}>
                  {t.priority === 'high' ? <AlertTriangle className="h-4 w-4" /> : <ClipboardList className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800">
                    <span className={`mr-1.5 text-[9px] font-extrabold uppercase ${t.priority === 'high' ? 'text-rose-600' : t.priority === 'attention' ? 'text-amber-700' : 'text-medical-600'}`}>{t.priority}</span>
                    {t.label}
                  </p>
                  <p className="truncate text-[11px] text-slate-500">{t.detail}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={cardCls} aria-labelledby="notif-title">
        <h3 id="notif-title" className="mb-3 text-sm font-extrabold text-slate-900">Notifications ({unread.length} unread)</h3>
        {unread.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No unread notifications.</p>
        ) : (
          <ul className="space-y-2">
            {unread.slice(0, 6).map((n) => (
              <li key={n.id} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-medical-600" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800">{n.title}</p>
                  <p className="text-[11px] text-slate-500">{n.message}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">{n.date}</p>
                </div>
                <button type="button" onClick={() => markNotificationRead(n.id)} className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-50">Mark read</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="flex items-center gap-1.5 text-[11px] text-slate-400"><ShieldCheck className="h-3.5 w-3.5 text-medical-500" /> Task counts reflect the current portal state ({today}).</p>
    </div>
  );
};
