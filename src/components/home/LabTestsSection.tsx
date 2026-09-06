import React, { useMemo, useState } from 'react';
import { FlaskConical, Search, ArrowRight, TestTube2 } from 'lucide-react';
import { NavigationTab } from '../../types';
import { loadMedicalTests } from '../../data/catalogLoaders';
import { useCatalog } from '../../lib/useCatalog';
import { LAB_CATEGORIES } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

interface LabTestsSectionProps {
  onTabChange: (tab: NavigationTab) => void;
}

/** Section 15 — laboratory test discovery preview. */
export const LabTestsSection: React.FC<LabTestsSectionProps> = ({ onTabChange }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const { items: MEDICAL_TESTS } = useCatalog(loadMedicalTests);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MEDICAL_TESTS.filter((test) => {
      const inCategory =
        category === 'All' || test.category.toLowerCase().includes(category.toLowerCase());
      if (!inCategory) return false;
      if (!q) return true;
      return test.name.toLowerCase().includes(q) || test.purpose.toLowerCase().includes(q);
    }).slice(0, 4);
  }, [query, category, MEDICAL_TESTS]);

  return (
    <section className="gh-section bg-slate-50/60" aria-labelledby="lab-tests-title">
      <div className="gh-container">
        <SectionHeading
          id="lab-tests-title"
          eyebrow="Laboratory tests"
          title="Understand your lab tests."
          description="Learn what a test evaluates, how to prepare, and what results may mean — in language that makes sense."
          action={
            <button
              type="button"
              onClick={() => onTabChange('medical-tests')}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-medical-700 transition hover:text-medical-800"
            >
              Explore Lab Tests
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          }
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          {/* Left: search + categories */}
          <div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft transition focus-within:border-medical-300 focus-within:shadow-lift">
              <Search className="ml-2 h-4.5 w-4.5 shrink-0 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a laboratory test…"
                aria-label="Search laboratory tests"
                className="w-full bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {['All', ...LAB_CATEGORIES].map((c) => (
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

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
              <p className="text-xs font-bold text-slate-800">Interpretation context</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Lab results are always interpreted by a clinician together with your history and
                symptoms. GlobalHealth explains what a test measures and typical reference ranges —
                it never gives a diagnosis.
              </p>
            </div>
          </div>

          {/* Right: test cards */}
          <div className="grid gap-3.5 sm:grid-cols-2">
            {filtered.map((test, i) => (
              <Reveal key={test.id} delay={i * 40}>
                <button
                  type="button"
                  onClick={() => onTabChange('medical-tests')}
                  className="group flex h-full w-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-medical-200 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-medical-50 text-medical-700">
                      <TestTube2 className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {test.category.split(',')[0]}
                    </span>
                  </div>
                  <h3 className="mt-3.5 text-sm font-bold text-slate-900">{test.name}</h3>
                  <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-500 line-clamp-2">
                    {test.purpose}
                  </p>
                  <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <FlaskConical className="h-3 w-3" />
                    {test.sampleType?.split(' / ')[0] || 'Laboratory'}
                  </p>
                </button>
              </Reveal>
            ))}
            {filtered.length === 0 && (
              <div className="sm:col-span-2">
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">
                  <p className="text-sm font-semibold text-slate-700">No tests found</p>
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
