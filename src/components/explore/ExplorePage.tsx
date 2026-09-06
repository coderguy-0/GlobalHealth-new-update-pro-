import React, { useState } from 'react';
import { Ambulance, ChevronRight, Globe2, Heart, Home as HomeIcon, Sparkles } from 'lucide-react';
import { NavigationTab } from '../../types';
import { EXPLORE_ITEMS, WORKSPACE_ITEMS, ExploreCard } from './exploreData';
import { EmergencyModal } from '../EmergencyModal';
import { useLocalization } from '../../context/LocalizationContext';

interface ExplorePageProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab, mode?: 'details' | 'dashboard' | 'ehr' | 'saved') => void;
  onHome: () => void;
}

/**
 * Dedicated "Explore GlobalHealth" page — opened from the hero's
 * "Explore Healthcare" button. Shows every area of GlobalHealth as
 * destination cards (Explore / Workspaces / Support), the same content
 * the "More" overlay presents, as a full, linkable page.
 */
export const ExplorePage: React.FC<ExplorePageProps> = ({ currentTab, onNavigate, onHome }) => {
  const { setIsLanguageModalOpen } = useLocalization();
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  return (
    <div className="bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <button
            type="button"
            onClick={onHome}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 transition hover:bg-slate-100 hover:text-medical-700"
          >
            <HomeIcon className="h-3.5 w-3.5" /> Home
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />
          <span className="rounded-lg px-2 py-1 font-semibold text-slate-700" aria-current="page">
            Explore
          </span>
        </nav>

        {/* Page header */}
        <header className="mt-6">
          <span className="gh-eyebrow inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Explore GlobalHealth
          </span>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            More areas of GlobalHealth
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Diseases, medicines, lab tests, doctors, hospitals, nutrition, wellness, health tools and more —
            every area of GlobalHealth in one place. Pick a destination to continue.
          </p>
        </header>

        {/* Explore */}
        <section className="mt-8" aria-labelledby="explore-page-areas-title">
          <div className="flex items-center gap-2">
            <span className="gh-eyebrow">Explore</span>
          </div>
          <h2 id="explore-page-areas-title" className="mt-2 text-lg font-bold tracking-tight text-slate-900">
            Health information &amp; discovery
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {EXPLORE_ITEMS.map((item) => (
              <ExploreCard key={item.id} item={item} active={currentTab === item.tab} onNavigate={onNavigate} />
            ))}
          </div>
        </section>

        {/* Workspaces */}
        <section className="mt-10" aria-labelledby="explore-page-workspaces-title">
          <div className="flex items-center gap-2">
            <span className="gh-eyebrow">Workspaces</span>
          </div>
          <h2 id="explore-page-workspaces-title" className="mt-2 text-lg font-bold tracking-tight text-slate-900">
            Specialized portals
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Authorized workspaces open over the website and return you here when closed.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {WORKSPACE_ITEMS.map((item) => (
              <ExploreCard key={item.id} item={item} active={currentTab === item.tab} onNavigate={onNavigate} />
            ))}
          </div>
        </section>

        {/* Support */}
        <section className="mt-10" aria-labelledby="explore-page-support-title">
          <div className="flex items-center gap-2">
            <span className="gh-eyebrow">Support</span>
          </div>
          <h2 id="explore-page-support-title" className="mt-2 text-lg font-bold tracking-tight text-slate-900">
            Help &amp; preferences
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setEmergencyOpen(true)}
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
              onClick={() => setIsLanguageModalOpen(true)}
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

        {/* Bottom marker */}
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-medical-500 to-medical-700 text-white shadow-sm">
            <Heart className="h-5 w-5 fill-white/20" />
          </span>
          <p className="max-w-md text-xs leading-relaxed text-slate-400">
            Educational platform. GlobalHealth helps you understand health information — it does not replace
            professional medical advice, diagnosis or emergency care.
          </p>
        </div>
      </div>

      <EmergencyModal open={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </div>
  );
};

export default ExplorePage;
