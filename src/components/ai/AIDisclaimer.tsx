import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { AI_DISCLAIMER_TEXT } from './aiUtils';

/** Always-visible medical disclaimer for the AI Assistant. */
export const AIDisclaimer: React.FC = () => (
  <div
    className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-[11px] leading-relaxed text-amber-950 ring-1 ring-amber-200"
    role="note"
  >
    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
    <p>
      <strong>Educational AI tool:</strong> {AI_DISCLAIMER_TEXT}
    </p>
  </div>
);
