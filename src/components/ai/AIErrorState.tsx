import React from 'react';
import { RefreshCw, CloudOff, ShieldAlert } from 'lucide-react';

export type AIErrorKind = 'network' | 'unavailable' | 'auth' | 'message';

interface AIErrorStateProps {
  kind?: AIErrorKind;
  /** Shown in a compact inline form (e.g. under a failed message). */
  compact?: boolean;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onSignIn?: () => void;
}

const FALLBACKS: Record<AIErrorKind, { title: string; message: string }> = {
  network: {
    title: 'Connection lost',
    message: 'We could not reach the AI service. Please check your connection and try again.',
  },
  unavailable: {
    title: 'AI Assistant is temporarily unavailable',
    message: 'The service is busy right now. Please try again in a moment.',
  },
  auth: {
    title: 'Your session has expired',
    message: 'Please sign in again to keep using your saved AI conversations.',
  },
  message: {
    title: 'This message could not be sent',
    message: 'Something went wrong while sending your message. You can retry without losing your conversation.',
  },
};

/** Friendly error state — never raw server errors. */
export const AIErrorState: React.FC<AIErrorStateProps> = ({
  kind = 'network',
  compact = false,
  title,
  message,
  onRetry,
  onSignIn,
}) => {
  const copy = FALLBACKS[kind];
  const heading = title || copy.title;
  const body = message || copy.message;

  if (compact) {
    return (
      <div
        className="flex flex-wrap items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-900"
        role="alert"
      >
        <ShieldAlert className="h-4 w-4 shrink-0 text-rose-500" aria-hidden="true" />
        <span className="min-w-0 flex-1">{body}</span>
        {kind === 'auth' && onSignIn ? (
          <button type="button" onClick={onSignIn} className="rounded-lg bg-slate-900 px-2.5 py-1.5 font-semibold text-white transition hover:bg-slate-700">
            Sign in again
          </button>
        ) : (
          onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-2.5 py-1.5 font-semibold text-white transition hover:bg-rose-700"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Retry
            </button>
          )
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center" role="alert">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
        <CloudOff className="h-7 w-7" aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-base font-bold text-slate-800">{heading}</h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{body}</p>
      </div>
      {kind === 'auth' && onSignIn ? (
        <button
          type="button"
          onClick={onSignIn}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Sign in again
        </button>
      ) : (
        onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-medical-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-medical-700"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Retry
          </button>
        )
      )}
    </div>
  );
};
