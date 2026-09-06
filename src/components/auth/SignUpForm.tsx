import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, Phone, Globe, ShieldCheck, Check, AlertCircle, ArrowRight, ArrowLeft, KeyRound, PencilLine } from 'lucide-react';
import { useLocalization } from '../../context/LocalizationContext';
import { signupUser, calculatePasswordStrength } from '../../services/authService';
import { TERMS_VERSION, PRIVACY_VERSION } from '../../lib/policyVersions';
import { AvatarExpression } from './DoctorAvatar';

interface SignUpFormProps {
  onSuccess: (data: { userId: string; email: string; type: 'email' | 'phone' }) => void;
  onNavigate: (view: 'login' | 'forgot-password') => void;
  onRequestHelp?: () => void;
  onOpenLegal?: (tab: 'terms' | 'privacy-policy') => void;
  /** Lets the animated assistant react to the registration flow. */
  onAvatarInteract?: (expression: AvatarExpression, message?: string) => void;
}

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'United Arab Emirates', 'Singapore', 'Germany', 'France', 'Other'];

/** Country dial codes for the mobile field (default +91 — India). */
const DIAL_CODES: { code: string; label: string }[] = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'United States / Canada (+1)' },
  { code: '+44', label: 'United Kingdom (+44)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+65', label: 'Singapore (+65)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+33', label: 'France (+33)' },
  { code: '+7', label: 'Russia (+7)' },
  { code: '+86', label: 'China (+86)' },
  { code: '+81', label: 'Japan (+81)' },
];

/**
 * Registration is divided into logical steps (spec §58–60):
 *   1. Basic information
 *   2. Create a password (with strength indicator)
 *   3. Review + consent (narrow Terms/Privacy acknowledgement, separate
 *      optional marketing consent — never combined, never pre-ticked)
 */
export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSuccess,
  onNavigate,
  onRequestHelp,
  onOpenLegal,
  onAvatarInteract
}) => {
  const { t } = useLocalization();

  // ---- Step 1: basic information ----
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [dialCode, setDialCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('India');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // ---- Step 2: password ----
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ---- Step 3: review + consent ----
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  // ---- UI ----
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [duplicateAdvice, setDuplicateAdvice] = useState(false);

  const passwordStrength = calculatePasswordStrength(password);

  const validateStep1 = (): string | null => {
    if (!firstName.trim()) return 'Please enter your first name.';
    if (!lastName.trim()) return 'Please enter your last name.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 12) return 'Please enter a valid mobile number.';
    return null;
  };

  const validateStep2 = (): string | null => {
    if (!password) return 'Please create a secure password.';
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const goToStep = (next: 1 | 2 | 3) => {
    setErrorMessage('');
    if (next === 2) {
      const err = validateStep1();
      if (err) {
        setErrorMessage(err);
        return;
      }
    }
    if (next === 3) {
      const err = validateStep2();
      if (err) {
        setErrorMessage(err);
        return;
      }
    }
    setStep(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setDuplicateAdvice(false);

    if (!termsAccepted) {
      setErrorMessage('Please agree to the Terms & Conditions and acknowledge the Privacy Policy to create your account.');
      return;
    }

    setIsLoading(true);

    const result = await signupUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      displayName: displayName.trim() || firstName.trim(),
      email: email.trim(),
      phoneNumber: `${dialCode} ${phoneNumber.trim()}`,
      password,
      confirmPassword,
      termsAccepted,
      marketingConsent,
      country,
      dateOfBirth: dateOfBirth || undefined,
      preferredLanguage: 'English',
      termsVersion: TERMS_VERSION,
      privacyVersion: PRIVACY_VERSION,
    });

    setIsLoading(false);

    if (result.success) {
      onSuccess({
        userId: result.userId,
        email: result.email || email,
        type: result.verificationType || 'email'
      });
    } else {
      setErrorMessage(result.error || 'Failed to create account. Please check your information.');
      if (result.duplicateAccount) {
        setDuplicateAdvice(true);
      }
      onAvatarInteract?.('error', 'Let me help — check the highlighted details and try again.');
    }
  };

  const strengthMeta: Record<string, { label: string; color: string; segments: number }> = {
    Weak: { label: 'Weak', color: 'bg-rose-500', segments: 1 },
    Fair: { label: 'Fair', color: 'bg-amber-500', segments: 2 },
    Strong: { label: 'Strong', color: 'bg-medical-500', segments: 3 },
    'Very Strong': { label: 'Very Strong', color: 'bg-medical-600', segments: 4 },
  };
  const strength = strengthMeta[passwordStrength.label] || strengthMeta.Weak;

  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition disabled:opacity-60';
  const labelClass = 'block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5';

  return (
    <div className="w-full">
      {/* Form Header */}
      <div className="mb-5 text-left">
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
          Create Your GlobalHealth Account
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
          Create one secure account for your personalized GlobalHealth experience.
        </p>

        {/* Step indicator */}
        <div className="mt-4 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              {s > 1 && <span className={`h-px flex-1 ${step >= s ? 'bg-medical-500' : 'bg-slate-200'}`} aria-hidden="true" />}
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold transition ${
                  step === s
                    ? 'bg-medical-600 text-white ring-4 ring-medical-100'
                    : step > s
                      ? 'bg-medical-500 text-white'
                      : 'bg-slate-100 text-slate-500'
                }`}
                aria-current={step === s ? 'step' : undefined}
              >
                {step > s ? <Check className="h-3.5 w-3.5" /> : s}
              </span>
            </React.Fragment>
          ))}
          <span className="ml-2 text-xs font-bold text-slate-500">Step {step} of 3</span>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs text-rose-800 animate-in fade-in duration-150">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Registration Alert</span>
              {errorMessage}
            </div>
          </div>
          {duplicateAdvice && (
            <div className="mt-3 flex gap-2 pt-2 border-t border-rose-200/60">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-bold text-[11px] transition cursor-pointer"
              >
                Log In Instead
              </button>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="px-3 py-1 bg-white border border-rose-300 text-rose-800 hover:bg-rose-100 rounded-lg font-bold text-[11px] transition cursor-pointer"
              >
                Recover Password
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============ STEP 1 — BASIC INFORMATION ============ */}
      {step === 1 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToStep(2);
          }}
          className="space-y-3.5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="signup-first">First name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input id="signup-first" type="text" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="signup-last">Last name</label>
              <input id="signup-last" type="text" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition" />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="signup-display">Display name <span className="font-normal normal-case text-slate-400">(optional — shown in community areas)</span></label>
            <div className="relative">
              <PencilLine className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input id="signup-display" type="text" autoComplete="nickname" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="How you appear to others" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="signup-email">Email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input id="signup-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="signup-phone">Mobile number <span className="font-normal normal-case text-slate-400">(used for account verification)</span></label>
            <div className="flex gap-2">
              <div className="relative shrink-0">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <select
                  aria-label="Country dial code"
                  value={dialCode}
                  onChange={(e) => setDialCode(e.target.value)}
                  className="h-[42px] w-[9.5rem] appearance-none rounded-xl border border-slate-300 bg-white pl-9 pr-7 text-sm text-slate-900 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition"
                >
                  {DIAL_CODES.map((d) => (
                    <option key={d.code} value={d.code}>{d.label}</option>
                  ))}
                </select>
              </div>
              <input
                id="signup-phone"
                type="tel"
                autoComplete="tel-national"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d\s-]/g, ''))}
                placeholder="10-digit mobile number"
                className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition"
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="signup-country">Country / region</label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <select id="signup-country" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-8 text-sm text-slate-900 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition">
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="signup-dob">Date of birth <span className="font-normal normal-case text-slate-400">(optional — used only where age is legally relevant for a specific service)</span></label>
            <input
              id="signup-dob"
              type="date"
              value={dateOfBirth}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition"
            />
          </div>

          <p className="text-[11px] leading-relaxed text-slate-400">
            We collect only the information needed to create and secure your account. Each field is explained in the{' '}
            <button type="button" onClick={() => onOpenLegal?.('privacy-policy')} className="font-semibold text-medical-700 hover:underline cursor-pointer">Privacy Policy</button>.
          </p>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-medical-700 active:bg-medical-800"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <button type="button" onClick={() => onNavigate('login')} className="font-bold text-medical-700 hover:underline cursor-pointer">Log In</button>
          </p>
        </form>
      )}

      {/* ============ STEP 2 — PASSWORD ============ */}
      {step === 2 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToStep(3);
          }}
          className="space-y-4"
        >
          <div>
            <label className={labelClass} htmlFor="signup-password">Create a password</label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onFocus={() => onAvatarInteract?.('password', 'Your password stays private.')}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">At least 8 characters. We never store your password in plain text.</p>
          </div>

          {password && (
            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-600">Password strength:</span>
                <span className="font-bold text-slate-800">{strength.label}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-2" role="meter" aria-valuemin={0} aria-valuemax={4} aria-valuenow={passwordStrength.score} aria-label="Password strength">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={`h-full rounded-full transition ${i < strength.segments ? strength.color : 'bg-slate-200'}`} />
                ))}
              </div>
              <ul className="space-y-0.5">
                {passwordStrength.feedback.map((f, i) => (
                  <li key={i} className="text-[11px] text-slate-500">• {f}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="signup-confirm">Confirm password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="signup-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1.5 text-[11px] font-semibold text-rose-600">Passwords do not match.</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-medical-700 active:bg-medical-800"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {/* ============ STEP 3 — REVIEW + CONSENT ============ */}
      {step === 3 && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          onFocus={() => onAvatarInteract?.('signup', 'Your consent stays specific — never a blanket agreement.')}
        >
          <div>
            <h2 className="text-sm font-bold text-slate-900">Review your information</h2>
            <dl className="mt-2 space-y-1.5 rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 text-xs">
              {[
                ['Name', `${firstName.trim()} ${lastName.trim()}`],
                ['Display name', displayName.trim() || firstName.trim()],
                ['Email', email.trim()],
                ['Mobile', `${dialCode} ${phoneNumber.trim()}`],
                ['Country / region', country],
                ['Date of birth', dateOfBirth || 'Not provided'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-3">
                  <dt className="shrink-0 font-semibold text-slate-500">{k}</dt>
                  <dd className="text-right font-medium text-slate-800 break-all">{v}</dd>
                </div>
              ))}
            </dl>
            <button type="button" onClick={() => goToStep(1)} className="mt-1.5 text-[11px] font-bold text-medical-700 hover:underline cursor-pointer">
              ← Edit information
            </button>
          </div>

          {/* Mandatory consent — narrow, specific (never a blanket consent) */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-medical-600"
              />
              <span className="text-xs leading-relaxed text-slate-700">
                I agree to the GlobalHealth{' '}
                <button type="button" onClick={() => onOpenLegal?.('terms')} className="font-semibold text-medical-700 hover:underline cursor-pointer">Terms &amp; Conditions</button>{' '}
                and acknowledge that I have read the{' '}
                <button type="button" onClick={() => onOpenLegal?.('privacy-policy')} className="font-semibold text-medical-700 hover:underline cursor-pointer">Privacy Policy</button>.
                I understand that certain GlobalHealth services require the collection and use of personal information
                as described in the Privacy Policy, and that additional consent may be requested for specific services
                or processing activities.
              </span>
            </label>
            <p className="mt-1.5 pl-6 text-[11px] text-slate-400">Please read these documents before creating your account.</p>
          </div>

          {/* Optional marketing consent — separate, unchecked */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-medical-600"
              />
              <span className="text-xs leading-relaxed text-slate-600">
                I would like to receive optional GlobalHealth updates, health education, product news, and service
                communications by email or other selected channels. I understand that I can change this preference
                later.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !termsAccepted}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-medical-700 active:bg-medical-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating your account…</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Create Account
              </>
            )}
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button type="button" onClick={onRequestHelp} className="flex-1 text-xs font-semibold text-slate-500 hover:text-slate-700 transition cursor-pointer">
              Need help?
            </button>
          </div>
        </form>
      )}

      {/* Footer Navigation Switcher */}
      {step === 1 && (
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-slate-400">
            <button type="button" onClick={() => onOpenLegal?.('privacy-policy')} className="hover:text-slate-600 transition cursor-pointer">Privacy Policy</button>
            <span>·</span>
            <button type="button" onClick={() => onOpenLegal?.('terms')} className="hover:text-slate-600 transition cursor-pointer">Terms &amp; Conditions</button>
          </div>
        </div>
      )}
    </div>
  );
};
