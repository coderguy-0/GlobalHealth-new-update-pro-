import React from 'react';
import { AIAvatar } from './AIAvatar';

/** Assistant "thinking" indicator — three subtle dots + exact copy. */
export const AILoadingState: React.FC = () => (
  <div className="flex items-start gap-3" role="status" aria-live="polite" aria-label="GlobalHealth AI is thinking">
    <AIAvatar size={30} className="rounded-full" />
    <div className="flex items-center gap-2.5 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <span className="gh-typing-dots flex items-center gap-1" aria-hidden="true">
        <span className="gh-typing-dot" />
        <span className="gh-typing-dot" />
        <span className="gh-typing-dot" />
      </span>
      <span className="text-xs font-medium text-slate-500">GlobalHealth AI is thinking…</span>
    </div>
  </div>
);
