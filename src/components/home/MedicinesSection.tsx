import React, { useMemo, useState } from 'react';
import { Search, Pill, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { NavigationTab } from '../../types';
import { loadMedicines } from '../../data/catalogLoaders';
import { useCatalog } from '../../lib/useCatalog';
import { MEDICINE_CATEGORIES } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

interface MedicinesSectionProps {
  onTabChange: (tab: NavigationTab) => void;
}

export const MedicinesSection: React.FC<MedicinesSectionProps> = ({ onTabChange }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const { items: MEDICINES } = useCatalog(loadMedicines);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MEDICINES.filter((m) => {
      const inCategory = category === 'All' || m.category === category;
      if (!inCategory) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    }).slice(0, 4);
  }, [query, category, MEDICINES]);

  return (
    <section className="gh-section bg-slate-50/70" aria-labelledby="medicines-title">
      <div className="gh-container">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left: Intro + Live Filter Search (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <SectionHeading
                id="medicines-title"
                eyebrow="Pharmaceutical Reference"
                title="Understand Medicines, Dosages &amp; Interactions"
                description="Explore verified indications, pharmacokinetics, contraindications, and verified partner delivery channels."
              />

              <div className="mt-6">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-soft transition focus-within:border-medical-500 focus-within:shadow-card">
                  <Search className="ml-2 h-4.5 w-4.5 shrink-0 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search medicine by brand or generic name…"
                    aria-label="Search medicines"
                    className="w-full bg-transparent px-2 py-1 text-sm outline-none placeholder:text-slate-400 font-medium"
                  />
                </div>

                <div className="mt-3.5 flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                  {['All', ...MEDICINE_CATEGORIES.slice(0, 5)].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={`gh-chip text-xs py-1 px-3 ${category === c ? 'gh-chip-active' : ''}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-xs leading-relaxed text-emerald-950">
                  <span className="font-bold">Verified Pharmacy Pathways.</span> Medical information
                  is decoupled from purchasing. Licensed partner pharmacies require valid digital prescription tokens.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button size="lg" onClick={() => onTabChange('medicines')}>
                <Pill className="h-4.5 w-4.5" />
                Explore 400+ Medicines
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right: Symmetrical Medicine Cards (7 cols) */}
          <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
            {filtered.map((m, i) => (
              <Reveal key={m.id} delay={i * 40}>
                <button
                  type="button"
                  onClick={() => onTabChange('medicines')}
                  className="group flex h-full w-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 text-left shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-medical-300 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-medical-50 text-medical-700 group-hover:bg-medical-600 group-hover:text-white transition">
                        <Pill className="h-5 w-5" />
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                          m.overTheCounter
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {m.overTheCounter ? 'OTC Available' : 'Prescription Only'}
                      </span>
                    </div>

                    <h3 className="mt-4 text-[15px] font-bold text-slate-900 group-hover:text-medical-800">
                      {m.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">{m.genericName}</p>
                    <p className="mt-2.5 text-xs leading-relaxed text-slate-500 line-clamp-2">
                      {m.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="font-semibold text-medical-700">{m.category}</span>
                    <span className="font-bold text-slate-400 group-hover:text-medical-700 flex items-center gap-1">
                      Details <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}

            {filtered.length === 0 && (
              <div className="sm:col-span-2">
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center">
                  <p className="text-sm font-semibold text-slate-700">No matching pharmaceutical records</p>
                  <p className="mt-1 text-xs text-slate-500">Try searching a different generic term or category.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
