import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface AINovaCalloutProps {
  onDismiss: () => void;
}

/**
 * Dr. Nova — the floating assistant's branded introduction callout.
 *
 * A rounded-rectangle card that visually "comes out of" the floating avatar,
 * introducing the assistant by name. Auto-hides on a timer, is dismissible,
 * and re-appears on hover. The character is a visual persona — never a claim
 * of medical credentials.
 */
export const AINovaCallout: React.FC<AINovaCalloutProps> = ({ onDismiss }) => (
  <div
    className="gh-fade-up absolute bottom-full right-0 mb-3 w-72 max-w-[calc(100vw-2.5rem)]"
    role="status"
    aria-live="polite"
  >
    <div className="relative rounded-3xl rounded-br-lg border border-medical-100 bg-white p-4 shadow-lift">
      {/* Pointer toward the avatar */}
      <span
        aria-hidden="true"
        className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 rounded-br-[3px] border-b border-r border-medical-100 bg-white"
      />

      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-medical-500 to-medical-700 text-white shadow-sm">
          <Sparkles className="h-4 w-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold tracking-tight text-slate-900">Dr. Nova</p>
          <p className="text-[11px] font-medium italic leading-snug text-medical-700">
            Your Personal AI Health Assistant
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            &ldquo;Hi, I&rsquo;m Dr. Nova. How can I help you today?&rdquo;
          </p>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss Dr. Nova introduction"
          className="shrink-0 rounded-full p-0.5 text-slate-300 transition hover:bg-slate-100 hover:text-slate-500"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  </div>
);
