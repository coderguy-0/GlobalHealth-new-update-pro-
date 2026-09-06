import React, { useEffect, useRef } from 'react';
import { Lock, LogIn, UserPlus, X, BookOpenCheck } from 'lucide-react';
import { AUTH_GATE_MESSAGE, AUTH_GATE_TITLE } from './aiUtils';

interface AIAuthPromptProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  onCreateAccount: () => void;
  /** "Continue Without Saving" — keep using the assistant as a guest. */
  onContinue: () => void;
}

/**
 * Auth gate shown when a guest attempts an account-persistent feature
 * (saved history, rename, delete-all, "save this conversation").
 * Clean, non-aggressive: guests can always continue without saving.
 */
export const AIAuthPrompt: React.FC<AIAuthPromptProps> = ({
  open,
  onClose,
  onLogin,
  onCreateAccount,
  onContinue,
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const loginRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-auth-prompt-title"
      aria-describedby="ai-auth-prompt-desc"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close sign-in prompt"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-900/50 backdrop-blur-[2px]"
      />

      <div className="gh-fade-up relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10 sm:p-7">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-medical-50 text-medical-600">
          <Lock className="h-6 w-6" aria-hidden="true" />
        </span>

        <h2 id="ai-auth-prompt-title" className="mt-4 text-xl font-extrabold tracking-tight text-slate-900">
          {AUTH_GATE_TITLE}
        </h2>
        <p id="ai-auth-prompt-desc" className="mt-2 text-sm leading-relaxed text-slate-600">
          {AUTH_GATE_MESSAGE}
        </p>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
          <BookOpenCheck className="mt-0.5 h-4 w-4 shrink-0 text-medical-500" aria-hidden="true" />
          <p>
            You can keep chatting right now without signing in — this session’s conversation just won’t be saved.
          </p>
        </div>

        <div className="mt-6 grid gap-2.5">
          <button
            type="button"
            onClick={onLogin}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" /> Log In
          </button>
          <button
            type="button"
            onClick={onCreateAccount}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-medical-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-600 focus-visible:ring-offset-2"
          >
            <UserPlus className="h-4 w-4" aria-hidden="true" /> Create Account
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
          >
            Continue Without Saving
          </button>
        </div>
      </div>
    </div>
  );
};
