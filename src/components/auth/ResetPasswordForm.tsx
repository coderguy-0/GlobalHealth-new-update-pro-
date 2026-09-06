import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { resetPassword, calculatePasswordStrength } from '../../services/authService';
import { AvatarExpression } from './DoctorAvatar';

interface ResetPasswordFormProps {
  initialToken?: string;
  onSuccess: () => void;
  onNavigate: (view: 'login' | 'forgot-password') => void;
  onRequestHelp?: () => void;
  onOpenLegal?: (tab: 'terms' | 'privacy-policy') => void;
  onAvatarInteract?: (expression: AvatarExpression, message?: string) => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  initialToken = '',
  onSuccess,
  onNavigate,
  onRequestHelp,
  onOpenLegal,
  onAvatarInteract
}) => {
  const [resetToken, setResetToken] = useState(initialToken || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const passwordStrength = calculatePasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!resetToken.trim()) {
      setErrorMessage('Please enter your recovery token or code.');
      return;
    }
    if (!newPassword) {
      setErrorMessage('Please enter your new password.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(resetToken.trim(), newPassword, confirmPassword);
    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      onAvatarInteract?.('success', 'Your password has been updated successfully.');
    } else {
      setErrorMessage(result.error || 'Invalid or expired reset token. Please request a new recovery link.');
    }
  };

  return (
    <div className="w-full">
      {!isSuccess ? (
        <>
          {/* Header */}
          <div className="mb-6 text-left">
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
              Create a New Password
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              Choose a strong new password for your GlobalHealth account.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs text-rose-800 animate-in fade-in duration-150">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-snug">
                <span className="font-semibold block mb-0.5">Reset Issue</span>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Recovery Token / Authorization Code
              </label>
              <div className="relative rounded-xl border border-slate-300 shadow-xs focus-within:border-medical-600 focus-within:ring-2 focus-within:ring-medical-600/20 transition-all bg-white">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Paste your reset token from email/SMS"
                  className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                New Password
              </label>
              <div className="relative rounded-xl border border-slate-300 shadow-xs focus-within:border-medical-600 focus-within:ring-2 focus-within:ring-medical-600/20 transition-all bg-white">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={newPassword}
                  onFocus={() => onAvatarInteract?.('password', 'Your password stays private.')}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full rounded-xl py-2.5 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative rounded-xl border border-slate-300 shadow-xs focus-within:border-medical-600 focus-within:ring-2 focus-within:ring-medical-600/20 transition-all bg-white">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="w-full rounded-xl py-2.5 px-3.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Password Strength Meter */}
            {newPassword && (
              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs text-left">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-600">Password Strength:</span>
                  <span className="font-bold text-slate-800">{passwordStrength.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
                  <div className={`h-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'}`} />
                  <div className={`h-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'}`} />
                  <div className={`h-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'}`} />
                  <div className={`h-full ${passwordStrength.score >= 4 ? passwordStrength.color : 'bg-transparent'}`} />
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <p className="text-[11px] text-slate-500">
                    Recommendations: {passwordStrength.feedback.join(' · ')}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-medical-700 active:bg-medical-800 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating your password...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </>
      ) : (
        /* Password Reset Successfully */
        <div className="text-left animate-in fade-in zoom-in-95 duration-200">
          <div className="h-12 w-12 rounded-2xl bg-medical-100 border border-medical-200 text-medical-700 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Your password has been updated successfully.
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            You can now log in using your new password.
          </p>

          <div className="my-5 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <ShieldCheck className="h-4 w-4 text-medical-600" />
              <span>Active Sessions Revoked</span>
            </div>
            <p className="leading-relaxed">
              All other active device sessions have been automatically invalidated for your account security.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-medical-700 transition cursor-pointer"
          >
            <span>Continue to Log In</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Footer */}
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
