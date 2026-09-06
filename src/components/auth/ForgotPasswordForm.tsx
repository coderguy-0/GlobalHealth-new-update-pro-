import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { forgotPassword } from '../../services/authService';
import { AvatarExpression } from './DoctorAvatar';

interface ForgotPasswordFormProps {
  onNavigate: (view: 'login' | 'signup' | 'reset-password') => void;
  onRecoveryTokenGenerated?: (token: string) => void;
  onRequestHelp?: () => void;
  onOpenLegal?: (tab: 'terms' | 'privacy-policy') => void;
  onAvatarInteract?: (expression: AvatarExpression, message?: string) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onNavigate,
  onRecoveryTokenGenerated,
  onRequestHelp,
  onOpenLegal,
  onAvatarInteract
}) => {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or mobile number.');
      return;
    }

    setIsLoading(true);
    const result = await forgotPassword(identifier.trim());
    setIsLoading(false);

    // Always transition to privacy-preserving state. The recovery token is not
    // returned by the server and is entered by the user from their email/SMS.
    setIsSubmitted(true);
    onAvatarInteract?.('recover', 'Recovery instructions have been sent.');
  };

  return (
    <div className="w-full">
      {!isSubmitted ? (
        <>
          {/* Initial Form Header */}
          <div className="mb-6 text-left">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition mb-3 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Login</span>
            </button>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
              Recover Your Account
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              We&apos;ll help you securely regain access to your GlobalHealth account.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs text-rose-800 animate-in fade-in duration-150">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-snug">
                <span className="font-semibold block mb-0.5">Notice</span>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email or Mobile Number
              </label>
              <div className="relative rounded-xl border border-slate-300 shadow-xs focus-within:border-medical-600 focus-within:ring-2 focus-within:ring-medical-600/20 transition-all bg-white">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onFocus={() => onAvatarInteract?.('recover', 'No worries. We’ll help you recover your account securely.')}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter your email or mobile number"
                  className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-medical-700 active:bg-medical-800 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </>
      ) : (
        /* Privacy-Preserving Confirmation View */
        <div className="text-left animate-in fade-in zoom-in-95 duration-200">
          <div className="h-12 w-12 rounded-2xl bg-medical-100 border border-medical-200 text-medical-700 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Recovery instructions have been sent.
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            If an eligible account matches the information provided, we'll send instructions to securely reset your password.
          </p>

          <div className="my-5 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <ShieldCheck className="h-4 w-4 text-medical-600" />
              <span>Security & Privacy Protocol</span>
            </div>
            <p className="leading-relaxed">
              To protect your privacy, we never confirm whether an account exists. Links are single-use, unpredictable, and expire automatically after 30 minutes.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('reset-password')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-medical-700 transition cursor-pointer"
            >
              <KeyRound className="h-4 w-4" />
              <span>Enter Reset Code / Create New Password</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="mt-8 pt-5 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-600">
          Remember your password?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="font-bold text-medical-700 hover:text-medical-800 hover:underline transition cursor-pointer"
          >
            Log In
          </button>
        </p>

        <p className="mt-2 text-xs text-slate-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="font-bold text-medical-700 hover:text-medical-800 hover:underline transition cursor-pointer"
          >
            Create Account
          </button>
        </p>

        <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-slate-400">
          <button type="button" onClick={() => onOpenLegal?.('privacy-policy')} className="hover:text-slate-600 transition cursor-pointer">Privacy Policy</button>
          <span>·</span>
          <button type="button" onClick={() => onOpenLegal?.('terms')} className="hover:text-slate-600 transition cursor-pointer">Terms &amp; Conditions</button>
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
