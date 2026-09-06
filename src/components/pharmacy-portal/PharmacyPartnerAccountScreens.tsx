import React, { useState } from 'react';
import {
  Building2,
  Lock,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Mail,
  Hash,
  Phone,
  UserRound
} from 'lucide-react';
import { PharmacyPortalService } from '../../services/pharmacyPortalStore';
import { partnerRegister, partnerRequestReset, partnerCompleteReset } from '../../services/pharmacyInventoryClient';

// ---------------------------------------------------------------------------
// Self-service account screens for the Pharmacy Partner portal:
//  - <PharmacyPartnerSignupScreen>   → create a new partner account (sign up)
//  - <PharmacyPartnerForgotScreen>   → forgot / reset password
// Both run on the partner account store (per-browser demo persistence) and
// mirror the dark partner branding of the portal.
// ---------------------------------------------------------------------------

const inputCls =
  'w-full rounded-xl border border-slate-700 bg-slate-800/60 py-2.5 pl-10 pr-3 text-sm font-medium text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-teal-400 focus:bg-slate-800 focus:ring-2 focus:ring-teal-500/20';

const Field: React.FC<{
  label: string;
  icon: React.ReactNode;
  } & React.InputHTMLAttributes<HTMLInputElement>> = ({ label, icon, ...rest }) => (
  <div>
    <label className="mb-1.5 block text-xs font-bold text-slate-300">{label}</label>
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
      <input {...rest} className={inputCls} />
    </div>
  </div>
);

export const PharmacyPartnerSignupScreen: React.FC<{
  onBack: () => void;
  onDone: () => void;
}> = ({ onBack, onDone }) => {
  const [pharmacyName, setPharmacyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    setBusy(true);
    const res = await partnerRegister({ pharmacyName, licenseNumber, contactName, email, phone, password });
    setBusy(false);
    if (!res.ok) {
      setError(res.error || 'The registration could not be submitted.');
      return;
    }
    setRegistrationMessage(res.message || '');
    setCreated(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased py-8 px-4 sm:px-6 flex flex-col justify-center">
      <div className="max-w-lg w-full mx-auto space-y-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to partner sign-in</span>
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center font-black mx-auto shadow-lg shadow-teal-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Create Pharmacy Partner Account</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Register your licensed pharmacy to access the dispensing dashboard, prescription review desk,
              inventory and multi-branch settlements.
            </p>
          </div>

          {created ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">Registration received ✅</h2>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {registrationMessage || 'Your pharmacy is now pending verification.'} Once a GlobalHealth administrator
                  verifies your license (<span className="font-mono text-teal-300">{licenseNumber.trim()}</span>), you can
                  sign in with <span className="font-mono text-teal-300">{email.trim().toLowerCase()}</span> and the password
                  you chose.
                </p>
              </div>
              <button
                onClick={onDone}
                className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-3 text-sm font-black text-slate-950 hover:from-teal-400 hover:to-emerald-400 transition cursor-pointer"
              >
                Back to partner sign-in
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4" noValidate>
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <Field label="Pharmacy legal name *" icon={<Building2 className="w-4 h-4" />} type="text" required
                placeholder="e.g. City Care Chemists & Surgicals" value={pharmacyName}
                onChange={(e) => setPharmacyName(e.target.value)} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Pharmacy license / DL no. *" icon={<Hash className="w-4 h-4" />} type="text" required
                  placeholder="e.g. DL-GJ-20471" value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)} />
                <Field label="Contact person *" icon={<UserRound className="w-4 h-4" />} type="text" required
                  placeholder="Owner / authorised contact" value={contactName}
                  onChange={(e) => setContactName(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Registered email *" icon={<Mail className="w-4 h-4" />} type="email" required
                  placeholder="owner@pharmacy.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} />
                <Field label="Phone" icon={<Phone className="w-4 h-4" />} type="tel"
                  placeholder="+91 98110 00000" value={phone}
                  onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Password (min 8 chars) *" icon={<Lock className="w-4 h-4" />} type="password" required
                  placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Field label="Confirm password *" icon={<Lock className="w-4 h-4" />} type="password" required
                  placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-3 text-sm font-black text-slate-950 hover:from-teal-400 hover:to-emerald-400 transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {busy ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                {busy ? 'Creating your account…' : 'Create partner account'}
              </button>

              <p className="text-center text-[11px] text-slate-500 leading-relaxed">
                By creating an account you confirm your pharmacy holds a valid license. Demo environment:
                account review is simulated and credentials are stored locally in this browser.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const PharmacyPartnerForgotScreen: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState<'request' | 'reset' | 'done'>('request');
  const [message, setMessage] = useState('');
  const [demo, setDemo] = useState<{ token: string; code: string } | null>(null);
  const [token, setToken] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const request = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    const res = await partnerRequestReset(email);
    setBusy(false);
    if (!res.ok) {
      setError(res.message || res.error || 'The reset request failed.');
      return;
    }
    setMessage(res.message);
    if (res.demoToken) {
      setToken(res.demoToken);
      setDemo({ token: res.demoToken, code: '' });
    }
    setStage('reset');
  };

  const reset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (newPassword !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    setBusy(true);
    const res = await partnerCompleteReset(token, newPassword);
    setBusy(false);
    if (!res.ok) {
      setError(res.error || 'The password could not be reset.');
      return;
    }
    setStage('done');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased py-8 px-4 sm:px-6 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto space-y-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to partner sign-in</span>
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center font-black mx-auto shadow-lg shadow-teal-500/20">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {stage === 'request' ? 'Reset your password' : stage === 'reset' ? 'Choose a new password' : 'Password updated'}
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              {stage === 'request'
                ? 'Enter the registered partner email and we will send a secure reset link.'
                : stage === 'reset'
                  ? 'Enter the reset token and verification code, then choose your new password.'
                  : 'Your partner account password has been changed. You can now sign in with your new credentials.'}
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {stage === 'request' && (
            <form onSubmit={request} className="space-y-4" noValidate>
              <Field label="Registered partner email" icon={<Mail className="w-4 h-4" />} type="email" required
                placeholder="owner@pharmacy.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-3 text-sm font-black text-slate-950 hover:from-teal-400 hover:to-emerald-400 transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {busy ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" /> : <Mail className="w-4 h-4" />}
                {busy ? 'Sending reset link…' : 'Send reset link'}
              </button>
            </form>
          )}

          {stage === 'reset' && (
            <form onSubmit={reset} className="space-y-4" noValidate>
              <p className="rounded-xl bg-slate-800/60 border border-slate-700 px-3.5 py-2.5 text-[11px] text-slate-300 leading-relaxed">
                {message}
              </p>
              {demo && (
                <p className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3.5 py-2.5 text-[11px] text-amber-300 leading-relaxed">
                  <strong>Demo delivery:</strong> reset token <span className="font-mono">{demo.token}</span> (simulated
                  email channel — valid for 1 hour, single use).
                </p>
              )}
              <Field label="Reset token" icon={<KeyRound className="w-4 h-4" />} type="text" required
                placeholder="RST-PPP-…" value={token} onChange={(e) => setToken(e.target.value)} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="New password (min 8)" icon={<Lock className="w-4 h-4" />} type="password" required
                  placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <Field label="Confirm new password" icon={<Lock className="w-4 h-4" />} type="password" required
                  placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-3 text-sm font-black text-slate-950 hover:from-teal-400 hover:to-emerald-400 transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {busy ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" /> : <ShieldCheck className="w-4 h-4" />}
                {busy ? 'Updating password…' : 'Set new password'}
              </button>
            </form>
          )}

          {stage === 'done' && (
            <div className="text-center space-y-4">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <button
                onClick={onBack}
                className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-3 text-sm font-black text-slate-950 hover:from-teal-400 hover:to-emerald-400 transition cursor-pointer"
              >
                Back to partner sign-in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
