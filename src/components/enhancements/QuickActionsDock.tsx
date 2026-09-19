import React, { useEffect, useState } from 'react';
import { Bot, Phone, Share2 } from 'lucide-react';

interface QuickActionsDockProps {
  onOpenAI: () => void;
  onOpenEmergency: () => void;
}

/**
 * Floating bottom-center dock with emergency and AI assistant shortcuts.
 * Fades in after a short delay so it doesn't cover the fold on load.
 */
export const QuickActionsDock: React.FC<QuickActionsDockProps> = ({ onOpenAI, onOpenEmergency }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'GlobalHealth', url });
        return;
      }
      await navigator.clipboard.writeText(url);
      // The ToastProvider subscribes to this window event, which keeps the
      // dock decoupled from the toast React context.
      window.dispatchEvent(
        new CustomEvent('gh:toast-dispatch', {
          detail: {
            variant: 'success',
            title: 'Link copied',
            description: 'GlobalHealth URL copied to your clipboard.',
          },
        })
      );
    } catch {
      /* the visitor dismissed the native share sheet */
    }
  };

  return (
    <div
      className={`fixed bottom-5 left-1/2 z-40 -translate-x-1/2 transition-all duration-500 ${
        visible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <div className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/90 p-1.5 shadow-lift backdrop-blur-md sm:gap-2 sm:p-2 dark:border-slate-700/70 dark:bg-slate-900/85">
        <button
          type="button"
          onClick={onOpenEmergency}
          className="group flex items-center gap-2 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-md transition hover:shadow-lg hover:brightness-110 sm:px-4 sm:text-sm"
          title="Emergency"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">Emergency</span>
        </button>

        <button
          type="button"
          onClick={onOpenAI}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-medical-50 text-medical-700 transition hover:bg-medical-100 dark:bg-medical-900/40 dark:text-medical-200 dark:hover:bg-medical-800/60"
          title="Ask AI Assistant"
          aria-label="Ask AI Assistant"
        >
          <Bot className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Share GlobalHealth"
          aria-label="Share"
        >
          <Share2 className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
};
