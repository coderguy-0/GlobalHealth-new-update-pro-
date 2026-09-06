import React, { useEffect } from 'react';
import { ArrowLeft, Heart, X } from 'lucide-react';

interface WorkspaceOverlayProps {
  title: string;
  subtitle?: string;
  badge?: string;
  theme?: 'light' | 'dark';
  /**
   * 'framed'    — padded card over a dimmed backdrop (health-records workspaces).
   * 'fullscreen — edge-to-edge workspace for the specialized portals; their own
   *               chrome (navbars, sidebars) fills the viewport.
   */
  layout?: 'framed' | 'fullscreen';
  onClose: () => void;
  children: React.ReactNode;
  /** Extra chrome rendered in the overlay header (e.g. health-records sub-nav). */
  headerExtra?: React.ReactNode;
}

/**
 * Full-viewport workspace that *overlaps* the public GlobalHealth website.
 * The current page stays mounted underneath so closing the overlay returns
 * the visitor exactly where they were.
 */
export const WorkspaceOverlay: React.FC<WorkspaceOverlayProps> = ({
  title,
  subtitle,
  badge,
  theme = 'light',
  layout = 'framed',
  onClose,
  children,
  headerExtra,
}) => {
  const isFullscreen = layout === 'fullscreen';

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const isDark = theme === 'dark';

  if (isFullscreen) {
    return (
      <div
        className="fixed inset-0 z-[70] flex flex-col bg-white animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workspace-overlay-title"
      >
        <h2 id="workspace-overlay-title" className="sr-only">
          {title}
        </h2>

        {/* Compact floating return control — portals ship their own headers */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 bottom-4 z-[80] inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white/95 px-3.5 py-2 text-[11px] font-bold text-slate-700 shadow-lg backdrop-blur transition hover:bg-white cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to website
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-stretch justify-center p-1.5 sm:p-3 md:p-4 bg-slate-950/55 backdrop-blur-[3px] animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="workspace-overlay-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`relative flex h-full w-full min-h-0 flex-col overflow-hidden rounded-2xl sm:rounded-3xl border shadow-2xl isolate transform-gpu ${
          isDark
            ? 'border-slate-700 bg-slate-950 text-slate-100'
            : 'border-slate-200 bg-white text-slate-900'
        }`}
      >
        <header
          className={`flex shrink-0 flex-col border-b ${
            isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white/95'
          }`}
        >
          <div className="flex items-center justify-between gap-3 px-3 py-2 sm:px-5 sm:py-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
                <Heart className="h-3.5 w-3.5 fill-white/20" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h2
                    id="workspace-overlay-title"
                    className={`truncate text-sm font-extrabold tracking-tight sm:text-base ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {title}
                  </h2>
                  {badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                        isDark
                          ? 'border border-indigo-500/40 bg-indigo-500/15 text-indigo-300'
                          : 'border border-teal-200 bg-teal-50 text-teal-800'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </div>
                {subtitle && (
                  <p className={`truncate text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                  isDark
                    ? 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Return to website</span>
                <span className="sm:hidden">Back</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close workspace"
                className={`rounded-full p-1.5 transition cursor-pointer ${
                  isDark
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
          {headerExtra}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
};
