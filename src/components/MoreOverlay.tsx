import React, { useEffect } from 'react';
import {
  X,
  Globe2,
  Ambulance,
  ArrowLeft,
  Heart,
} from 'lucide-react';
import { NavigationTab } from '../types';
import { EXPLORE_ITEMS, WORKSPACE_ITEMS, ExploreCard } from './explore/exploreData';

interface MoreOverlayProps {
  open: boolean;
  onClose: () => void;
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab, mode?: 'details' | 'dashboard' | 'ehr' | 'saved') => void;
  onEmergency: () => void;
  onLanguages: () => void;
}

/**
 * Full-viewport overlay that covers the website page when the visitor opens
 * the "More" menu. Every tab inside it navigates and closes the overlay —
 * the page underneath stays mounted so closing returns exactly where they were.
 * The same destinations are available as a dedicated page at the "Explore
 * Healthcare" entry point (ExplorePage).
 */
export const MoreOverlay: React.FC<MoreOverlayProps> = ({
  open,
  onClose,
  currentTab,
  onNavigate,
  onEmergency,
  onLanguages,
}) => {
  // Lock page scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-white animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="more-overlay-title"
    >
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-medical-500 to-medical-700 text-white shadow-sm">
            <Heart className="h-4.5 w-4.5 fill-white/20" />
          </span>
          <div className="min-w-0">
            <h2 id="more-overlay-title" className="truncate text-base font-bold tracking-tight text-slate-900">
              Explore GlobalHealth
            </h2>
            <p className="truncate text-[11px] text-slate-500">
              Every area of GlobalHealth in one place — pick a destination to continue.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          {/* Explore */}
          <section aria-labelledby="more-explore-title">
            <div className="flex items-center gap-2">
              <span className="gh-eyebrow">Explore</span>
            </div>
            <h3 id="more-explore-title" className="mt-3 text-lg font-bold tracking-tight text-slate-900">
              More areas of GlobalHealth
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {EXPLORE_ITEMS.map((item) => (
                <ExploreCard key={item.id} item={item} active={currentTab === item.tab} onNavigate={onNavigate} />
              ))}
            </div>
          </section>

          {/* Workspaces */}
          <section className="mt-10" aria-labelledby="more-workspaces-title">
            <div className="flex items-center gap-2">
              <span className="gh-eyebrow">Workspaces</span>
            </div>
            <h3 id="more-workspaces-title" className="mt-3 text-lg font-bold tracking-tight text-slate-900">
              Specialized portals
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Authorized workspaces open over the website and return you here when closed.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {WORKSPACE_ITEMS.map((item) => (
                <ExploreCard key={item.id} item={item} active={currentTab === item.tab} onNavigate={onNavigate} />
              ))}
            </div>
          </section>

          {/* Support */}
          <section className="mt-10" aria-labelledby="more-support-title">
            <div className="flex items-center gap-2">
              <span className="gh-eyebrow">Support</span>
            </div>
            <h3 id="more-support-title" className="mt-3 text-lg font-bold tracking-tight text-slate-900">
              Help &amp; preferences
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={onEmergency}
                className="group flex w-full items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-lift"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600 transition group-hover:bg-rose-600 group-hover:text-white">
                  <Ambulance className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-900">Emergency numbers</span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                    Local emergency lines for the US, EU/UK, India and mental-health crisis support.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={onLanguages}
                className="group flex w-full items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-medical-200 hover:shadow-lift"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-medical-50 text-medical-700 transition group-hover:bg-medical-600 group-hover:text-white">
                  <Globe2 className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-900">Languages</span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                    Switch GlobalHealth to one of 100 languages and scripts.
                  </span>
                </span>
              </button>
            </div>
          </section>

          {/* Back */}
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-soft transition hover:border-medical-200 hover:bg-medical-50 hover:text-medical-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
