import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, RefreshCw, KeyRound } from 'lucide-react';
import { verifyCode, resendVerificationCode } from '../../services/authService';
import { PublicUserAccount } from '../../types/auth';
import { maskPhone, maskEmail } from '../../lib/maskContact';

interface VerifyEmailPhoneFormProps {
  userId: string;
  contactTarget?: string;
  type?: 'email' | 'phone';
  onSuccess: (user: PublicUserAccount, token?: string) => void;
  onNavigate: (view: 'login' | 'signup') => void;
  onRequestHelp?: () => void;
  onOpenLegal?: (tab: 'terms' | 'privacy-policy') => void;
}

export const VerifyEmailPhoneForm: React.FC<VerifyEmailPhoneFormProps> = ({
  userId,
  contactTarget = 'your registered address',
  type = 'email',
  onSuccess,
  onNavigate,
  onRequestHelp,
  onOpenLegal
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [verifiedUser, setVerifiedUser] = useState<PublicUserAccount | null>(null);
  const [verifiedToken, setVerifiedToken] = useState<string | undefined>(undefined);
  // Limited attempts (spec): 5 tries before the code is locked and a resend is required.
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [attemptsLocked, setAttemptsLocked] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend Countdown Timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      if (pasted) {
        const nextDigits = [...digits];
        for (let i = 0; i < 6; i++) {
          nextDigits[i] = pasted[i] || '';
        }
        setDigits(nextDigits);
        const nextFocus = Math.min(pasted.length, 5);
        inputRefs.current[nextFocus]?.focus();
      }
      return;
    }

    const cleanChar = value.replace(/\D/g, '');
    const nextDigits = [...digits];
    nextDigits[index] = cleanChar;
    setDigits(nextDigits);
    setErrorMessage('');

    if (cleanChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const fullCode = digits.join('');
    if (fullCode.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    const result = await verifyCode(userId, fullCode, type as 'email' | 'phone');
    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      setVerifiedUser(result.user);
      setVerifiedToken(result.token);
    } else {
      const remaining = attemptsLeft - 1;
      setAttemptsLeft(remaining);
      if (remaining <= 0) {
        setAttemptsLocked(true);
        setErrorMessage('Too many incorrect attempts. The verification code has been locked. Please request a new code.');
      } else {
        setErrorMessage(
          result.error ||
            `The verification code entered is invalid or has expired. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
        );
      }
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setErrorMessage('');
    setIsLoading(true);

    const result = await resendVerificationCode(userId, type as 'email' | 'phone');
    setIsLoading(false);

    if (result.success) {
      setCountdown(45);
      setCanResend(false);
      setAttemptsLeft(5);
      setAttemptsLocked(false);
      setInfoMessage(result.message || 'A new 6-digit code has been dispatched.');
    } else {
      setErrorMessage(result.error || 'Failed to resend verification code.');
    }
  };

  const isComplete = digits.every(d => d !== '');

  return (
    <div className="w-full">
      {!isSuccess ? (
        <>
          {/* Header */}
          <div className="mb-6 text-left">
            <div className="h-12 w-12 rounded-2xl bg-medical-100 border border-medical-200 text-medical-700 flex items-center justify-center mb-3">
              {type === 'phone' ? <Phone className="h-6 w-6" /> : <Mail className="h-6 w-6" />}
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
              {type === 'phone' ? 'Verify Your Mobile Number' : 'Verify Your Email'}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              Enter the 6-digit verification code sent to{' '}
              <strong className="text-slate-800">{type === 'phone' ? maskPhone(contactTarget) : maskEmail(contactTarget)}</strong>. We
              never display the complete {type === 'phone' ? 'number' : 'address'}.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-medical-700 hover:text-medical-800 hover:underline transition cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              Change {type === 'phone' ? 'mobile number' : 'email address'}
            </button>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 text-medical-600" />
              {attemptsLocked
                ? 'Code locked — please request a new code.'
                : `${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining before the code locks.`}
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-800 animate-in fade-in duration-150 text-left">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-snug">
                <span className="font-semibold block mb-0.5">Verification Error</span>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Info Alert */}
          {infoMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-medical-200 bg-medical-50 p-2.5 text-xs text-medical-800 animate-in fade-in duration-150 text-left">
              <ShieldCheck className="h-4 w-4 shrink-0 text-medical-600" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* 6-Digit Verification Input Form */}
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 text-left">
                Enter 6-Digit Code
              </label>
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="h-13 w-11 sm:h-14 sm:w-13 text-center text-xl font-mono font-bold rounded-xl border border-slate-300 bg-white text-slate-900 shadow-xs focus:border-medical-600 focus:ring-2 focus:ring-medical-600/20 focus:outline-hidden transition-all"
                    disabled={isLoading}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isComplete || attemptsLocked}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-medical-700 active:bg-medical-800 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>{type === 'phone' ? 'Verify Number' : 'Verify Email'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Resend Code Section */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-slate-500">Didn't receive the code?</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading || attemptsLocked}
                  className="font-bold text-medical-700 hover:text-medical-800 hover:underline transition cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Resend Code</span>
                </button>
              ) : (
                <span className="font-medium text-slate-400">
                  Resend available in {countdown}s
                </span>
              )}
            </div>

            <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-medical-600 mt-px" />
              Never share your password or verification code with anyone. GlobalHealth will never ask for your code
              outside the sign-in flow.
            </p>
          </form>
        </>
      ) : (
        /* Verification Success Screen */
        <div className="text-left animate-in fade-in zoom-in-95 duration-200">
          <div className="h-14 w-14 rounded-2xl bg-medical-100 border border-medical-200 text-medical-700 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
            Your GlobalHealth account is ready.
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            You can now securely access the features available to your account — health preferences, appointments,
            saved facilities and more.
          </p>

          <div className="my-6 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <ShieldCheck className="h-4 w-4 text-medical-600" />
              <span>Personalized & Protected</span>
            </div>
            <p className="leading-relaxed">
              Role: <strong className="text-slate-900">Verified Public User</strong>. Your account is protected by industry-standard encryption and strict privacy boundaries.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (verifiedUser) {
                onSuccess(verifiedUser, verifiedToken);
              }
            }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-medical-700 transition cursor-pointer"
          >
            <span>Continue to GlobalHealth</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="mt-8 pt-5 border-t border-slate-100 text-center">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
        >
          Back to Login
        </button>

        <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-slate-400">
          <button type="button" onClick={() => onOpenLegal?.('privacy-policy')} className="hover:text-slate-600 transition cursor-pointer">Privacy Policy</button>
          <span>·</span>
          <button type="button" onClick={() => onOpenLegal?.('terms')} className="hover:text-slate-600 transition cursor-pointer">Terms of Service</button>
          <span>·</span>
          <button
            type="button"
            onClick={onRequestHelp}
            className="hover:text-slate-600 transition cursor-pointer"
          >
            Help
          </button>
        </div>
      </div>
    </div>
  );
};
