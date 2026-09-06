import React, { useState } from 'react';
import {
  Newspaper,
  Lock,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Mail,
  Hash,
  UserRound,
  Building2,
  Briefcase,
  FileText,
  Globe2
} from 'lucide-react';
import { newsAuthorityRegister } from '../../services/newsGovernanceClient';

// ---------------------------------------------------------------------------
// Self-service account screens for the News Management workspace:
//  - <NewsStaffSignupScreen>  → apply for an editorial account (admin approval)
//  (forgot/reset lives in the server login — single-use token + emailed code)
// Styled to match the editorial sign-in gate (slate-950 / violet accents).
// ---------------------------------------------------------------------------

const inputCls =
  'w-full rounded-xl border border-slate-700 bg-slate-800/60 py-2.5 pl-10 pr-3 text-sm font-medium text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-purple-400 focus:bg-slate-800 focus:ring-2 focus:ring-purple-500/20';

const Field: React.FC<{
  label: string;
  icon: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement> & { textarea?: boolean; rows?: number }> = ({
  label,
  icon,
  textarea,
  rows = 3,
  ...rest
}) => (
  <div>
    <label className="mb-1.5 block text-xs font-bold text-slate-300">{label}</label>
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-3 text-slate-500">{icon}</span>
      {textarea ? (
        <textarea
          {...(rest as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          rows={rows}
          className={`${inputCls} pl-10 py-2.5 resize-none`}
        />
      ) : (
        <input {...rest} className={inputCls} />
      )}
    </div>
  </div>
);

export const NewsStaffSignupScreen: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [website, setWebsite] = useState('');
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      const res = await newsAuthorityRegister({
        orgName: organization || `${fullName} Health News Desk`,
        orgType: jobTitle ? `Editorial — ${jobTitle}` : 'Health News Organization',
        website: website.trim(),
        contactName: fullName,
        contactEmail: email.trim().toLowerCase(),
        representativeName: fullName,
        representativeRole: jobTitle || 'Editorial Representative',
        description: `${organization ? organization + '. ' : ''}${reason || 'Editorial news coverage of verified clinical and public-health information.'}`.slice(0, 2000),
        verificationReason: reason || `Application for a Verified Authority account by ${fullName}.`,
        password
      });
      setBusy(false);
      setSubmitted(true);
    } catch (err: any) {
      setBusy(false);
      const problems: string[] = err?.problems || [];
      setError(problems.length ? problems.join(' ') : err?.message || 'The application could not be submitted.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased py-8 px-4 sm:px-6 flex flex-col justify-center">
      <div className="max-w-lg w-full mx-auto space-y-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to editorial sign-in</span>
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 to-purple-600 text-white flex items-center justify-center font-black mx-auto shadow-lg shadow-purple-500/20">
              <Newspaper className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Apply for a News Management Account</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Editorial accounts are provisioned by GlobalHealth administrators. Submit your details and an
              administrator will review and activate your account.
            </p>
          </div>

          {submitted ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">Application submitted</h2>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Your editorial account application for{' '}
                  <span className="font-mono text-purple-300">{email.trim().toLowerCase()}</span> is now{' '}
                  <strong className="text-amber-300">Pending Approval</strong>. Once an administrator activates it,
                  you can sign in with the password you chose (two-factor code is emailed at sign-in).
                </p>
              </div>
              <button
                onClick={onBack}
                className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-3 text-sm font-black text-white transition cursor-pointer"
              >
                Back to editorial sign-in
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name *" icon={<UserRound className="w-4 h-4" />} type="text" required
                  placeholder="e.g. Sarah Matthews" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <Field label="Work email *" icon={<Mail className="w-4 h-4" />} type="email" required
                  placeholder="sarah@healthnews.org" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Job title" icon={<Briefcase className="w-4 h-4" />} type="text"
                  placeholder="e.g. Senior Health Editor" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                <Field label="Organization / publication" icon={<Building2 className="w-4 h-4" />} type="text"
                  placeholder="e.g. Global Health Wire" value={organization} onChange={(e) => setOrganization(e.target.value)} />
              </div>

              <Field label="Official website *" icon={<Globe2 className="w-4 h-4" />} type="url" required
                placeholder="https://your-organization.org" value={website} onChange={(e) => setWebsite(e.target.value)} />

              <Field label="Why do you need editorial access?" icon={<FileText className="w-4 h-4" />} type="text" textarea
                placeholder="Briefly describe your editorial role and the content you plan to manage…" value={reason}
                onChange={(e) => setReason(e.target.value)} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Password (min 8 chars) *" icon={<Lock className="w-4 h-4" />} type="password" required
                  placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Field label="Confirm password *" icon={<Lock className="w-4 h-4" />} type="password" required
                  placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-3 text-sm font-black text-white transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {busy ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                {busy ? 'Submitting application…' : 'Submit account application'}
              </button>

              <p className="text-center text-[11px] text-slate-500 leading-relaxed">
                Accounts start with editor-level permissions pending approval. Demo environment: approval is
                performed by an administrator from the staff management console.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
