import React, { useMemo, useState } from 'react';
import { Search, Pill, ArrowRight, ShieldCheck } from 'lucide-react';
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

/** Section 12 — Medicines preview. Information-first, not a storefront. */
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
    <section className="gh-section" aria-labelledby="medicines-title">
      <div className="gh-container">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* Left: intro + search + categories */}
          <div>
            <SectionHeading
              id="medicines-title"
              eyebrow="Medicines"
              title="Understand medicines before you buy."
              description="Explore clear medicine information, available forms, precautions and other important details before continuing to a verified pharmacy pathway."
            />

            <div className="mt-7">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft transition focus-within:border-medical-300 focus-within:shadow-lift">
                <Search className="ml-2 h-4.5 w-4.5 shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a medicine…"
                  aria-label="Search medicines"
                  className="w-full bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {['All', ...MEDICINE_CATEGORIES].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`gh-chip ${category === c ? 'gh-chip-active' : ''}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
              <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" />
              <p className="text-xs leading-relaxed text-emerald-900">
                <span className="font-bold">Verified pharmacy pathways.</span> Information stays
                separate from purchasing — when you are ready, pharmacy partners are clearly
                identified and accessed through a separate portal.
              </p>
            </div>

            <Button className="mt-6" onClick={() => onTabChange('medicines')}>
              Explore Medicines
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Right: medicine cards */}
          <div className="grid gap-3.5 sm:grid-cols-2">
            {filtered.map((m, i) => (
              <Reveal key={m.id} delay={i * 40}>
                <button
                  type="button"
                  onClick={() => onTabChange('medicines')}
                  className="group flex h-full w-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-medical-200 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-medical-50 text-medical-700">
                      <Pill className="h-5 w-5" />
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        m.overTheCounter
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {m.overTheCounter ? 'OTC' : 'Prescription'}
                    </span>
                  </div>
                  <h3 className="mt-3.5 text-sm font-bold text-slate-900">{m.name}</h3>
                  <p className="text-[11px] font-medium text-slate-400">{m.genericName}</p>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500 line-clamp-2">
                    {m.description}
                  </p>
                  <p className="mt-3 text-[11px] font-semibold text-medical-700">{m.category}</p>
                </button>
              </Reveal>
            ))}
            {filtered.length === 0 && (
              <div className="sm:col-span-2">
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">
                  <p className="text-sm font-semibold text-slate-700">No medicines found</p>
                  <p className="mt-1 text-xs text-slate-500">Try a different name or category.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
