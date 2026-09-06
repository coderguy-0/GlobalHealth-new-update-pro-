import React from 'react';
import { X } from 'lucide-react';

interface AIGreetingBubbleProps {
  text: string;
  onDismiss: () => void;
}

/** The speech bubble that points at the floating avatar. */
export const AIGreetingBubble: React.FC<AIGreetingBubbleProps> = ({ text, onDismiss }) => (
  <div className="gh-fade-up absolute bottom-full right-0 mb-3 w-max max-w-[16rem]" role="status" aria-live="polite">
    <div className="relative rounded-2xl rounded-br-md border border-slate-200 bg-white p-3 pr-2 shadow-lift">
      {/* Pointer toward the avatar */}
      <span aria-hidden="true" className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 rounded-br-[3px] border-b border-r border-slate-200 bg-white" />
      <div className="flex items-start gap-2">
        <p className="text-xs font-semibold leading-relaxed text-slate-700">{text}</p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss assistant message"
          className="shrink-0 rounded-full p-0.5 text-slate-300 transition hover:bg-slate-100 hover:text-slate-500"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  </div>
);
