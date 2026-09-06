import React, { useState } from 'react';
import { BadgeCheck, ShieldAlert, FileText, Upload, AlertCircle } from 'lucide-react';
import { useDoctorPortal, VERIFICATION_LABEL, Credential } from './doctorPortalData';

const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition';
const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700';

const VERIFY_ORDER = ['not_started', 'pending', 'under_review', 'additional_info_required', 'verified', 'rejected', 'suspended', 'expired'] as const;

export const DoctorCredentials: React.FC = () => {
  const { doctor, credentials, updateVerificationStatus, addCredential } = useDoctorPortal();
  const [addOpen, setAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [authority, setAuthority] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [attached, setAttached] = useState(false);
  const [err, setErr] = useState('');
  const [notice, setNotice] = useState('');

  const verifyIdx = VERIFY_ORDER.indexOf(doctor.verificationStatus);

  const addCredentialSubmit = () => {
    if (!title.trim() || !authority.trim() || !number.trim()) { setErr('Title, authority and registration number are required.'); return; }
    if (!attached) { setErr('Attach the credential document (simulated upload).'); return; }
    addCredential({
      title: title.trim(),
      authority: authority.trim(),
      registrationNumber: number.trim(),
      issuedAt: new Date().toISOString().slice(0, 10),
      expiresAt: expiry || undefined,
      documentName: `${title.trim()}.pdf`,
    });
    setAddOpen(false); setTitle(''); setAuthority(''); setNumber(''); setExpiry(''); setAttached(false); setErr('');
    setNotice('Credential submitted for review — it will appear after verification.');
    window.setTimeout(() => setNotice(''), 5000);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Credentials &amp; Licenses</h2>
          <p className="text-xs text-slate-500">Documents are private. Registration numbers are never published.</p>
        </div>
        <button type="button" onClick={() => setAddOpen(!addOpen)} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-medical-700">
          <Upload className="h-3.5 w-3.5" /> Add credential
        </button>
      </div>

      {/* Verification state — explicit, never auto-claimed */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="verif-title">
        <h3 id="verif-title" className="mb-3 text-sm font-extrabold text-slate-900">Professional verification</h3>
        <div className="flex flex-wrap items-center gap-2">
          {VERIFY_ORDER.map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <span className={`h-px w-4 ${i <= verifyIdx ? 'bg-medical-500' : 'bg-slate-200'}`} aria-hidden="true" />}
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                i === verifyIdx ? 'bg-medical-600 text-white'
                : i < verifyIdx ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-400'
              }`}>
                {VERIFICATION_LABEL[s]}
              </span>
            </React.Fragment>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-600">
          Current state: <span className="font-bold text-slate-800">{(VERIFICATION_LABEL as Record<string, string>)[doctor.verificationStatus] || doctor.verificationStatus}</span>.{' '}
          {doctor.verificationNextAction ? <span className="text-slate-500">{doctor.verificationNextAction}</span> : null}
        </p>
        {doctor.verificationStatus !== 'verified' && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] font-semibold text-amber-800">
            <ShieldAlert className="h-3.5 w-3.5" /> “Verified” is only displayed after the credential team completes verification.
          </p>
        )}
        {doctor.verificationStatus === 'verified' && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-800">
            <BadgeCheck className="h-3.5 w-3.5" /> Verified Professional — this status was granted after document review.
          </p>
        )}
        {doctor.verificationStatus === 'additional_info_required' && (
          <button type="button" onClick={() => updateVerificationStatus('under_review')} className="mt-3 cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">
            Submit additional information (simulated)
          </button>
        )}
      </section>

      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">{notice}</p>}

      {addOpen && (
        <section className="rounded-2xl border border-medical-200 bg-white p-5 shadow-soft" aria-labelledby="add-cred">
          <h3 id="add-cred" className="mb-4 text-sm font-extrabold text-slate-900">Add credential</h3>
          {err && <p role="alert" className="mb-3 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs font-semibold text-rose-800"><AlertCircle className="h-4 w-4" /> {err}</p>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="c-title">Credential title</label>
              <input id="c-title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="e.g. State Medical License" />
            </div>
            <div>
              <label className={labelCls} htmlFor="c-auth">Issuing authority</label>
              <input id="c-auth" value={authority} onChange={(e) => setAuthority(e.target.value)} className={inputCls} placeholder="e.g. Delhi Medical Council" />
            </div>
            <div>
              <label className={labelCls} htmlFor="c-num">Registration number</label>
              <input id="c-num" value={number} onChange={(e) => setNumber(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="c-exp">Expiry <span className="normal-case text-slate-400">(if any)</span></label>
              <input id="c-exp" type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className={inputCls} />
            </div>
          </div>
          <button type="button" onClick={() => setAttached(!attached)}
            className={`mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition ${
              attached ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-dashed border-slate-300 bg-white text-slate-500 hover:border-medical-300'
            }`}>
            <FileText className="h-4 w-4" /> {attached ? 'Document attached (secured)' : 'Attach document (simulated secure upload)'}
          </button>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={addCredentialSubmit} className="cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">Submit for verification</button>
            <button type="button" onClick={() => setAddOpen(false)} className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
          </div>
        </section>
      )}

      {/* Credential list */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="cred-list">
        <h3 id="cred-list" className="mb-3 text-sm font-extrabold text-slate-900">My credentials ({credentials.length})</h3>
        <ul className="space-y-3">
          {credentials.map((c) => (
            <CredentialCard key={c.id} credential={c} onUpdate={() => setNotice(`Update request for “${c.title}” opens a secure renewal workflow (simulated).`)} />
          ))}
        </ul>
      </section>
    </div>
  );
};

const CredentialCard: React.FC<{ credential: Credential; onUpdate: () => void }> = ({ credential: c, onUpdate }) => {
  const today = new Date().toISOString().slice(0, 10);
  const daysLeft = c.expiresAt ? Math.ceil((new Date(c.expiresAt).getTime() - new Date(today).getTime()) / 86400000) : null;
  const expired = daysLeft !== null && daysLeft < 0;
  const expiring = !expired && daysLeft !== null && daysLeft <= 30;

  return (
    <li className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-slate-800">{c.title}</p>
          <p className="text-xs text-slate-500">{c.authority} · Reg. {c.registrationNumber}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
          c.status === 'verified' ? 'bg-emerald-50 text-emerald-700'
          : c.status === 'pending_verification' ? 'bg-amber-50 text-amber-700'
          : c.status === 'expired' ? 'bg-rose-50 text-rose-700'
          : c.status === 'expiring_soon' ? 'bg-amber-50 text-amber-800'
          : 'bg-slate-100 text-slate-500'
        }`}>
          {c.status === 'verified' ? 'Verified' : c.status === 'pending_verification' ? 'Pending verification' : c.status === 'expired' ? 'Expired' : c.status === 'expiring_soon' ? 'Expires soon' : 'Suspended'}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
        <span>Issued {c.issuedAt}</span>
        {c.expiresAt && <span>Expires {c.expiresAt}</span>}
        {c.verifiedAt && <span className="inline-flex items-center gap-1 text-emerald-700"><BadgeCheck className="h-3 w-3" /> Verified {c.verifiedAt}</span>}
        {expired && <span className="font-bold text-rose-700">Credential expired</span>}
        {expiring && <span className="font-bold text-amber-700">Credential expires in {daysLeft} days</span>}
      </div>

      {(expired || expiring) && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button type="button" onClick={onUpdate} className="cursor-pointer rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-800 transition hover:bg-amber-100">
            Update Credential
          </button>
          <span className="text-[10px] text-slate-400">Renewal requires the same verification workflow as the original.</span>
        </div>
      )}
    </li>
  );
};
