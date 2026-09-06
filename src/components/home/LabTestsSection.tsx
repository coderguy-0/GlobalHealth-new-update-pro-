import React, { useMemo, useState } from 'react';
import { FlaskConical, Search, ArrowRight, TestTube2, CheckCircle2 } from 'lucide-react';
import { NavigationTab } from '../../types';
import { loadMedicalTests } from '../../data/catalogLoaders';
import { useCatalog } from '../../lib/useCatalog';
import { LAB_CATEGORIES } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

interface LabTestsSectionProps {
  onTabChange: (tab: NavigationTab) => void;
}

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
    <section className="gh-section bg-white" aria-labelledby="lab-tests-title">
      <div className="gh-container">
        <SectionHeading
          id="lab-tests-title"
          eyebrow="Diagnostic Investigations"
          title="Laboratory Test Directory &amp; Interpretation Reference"
          description="Understand what tests evaluate, fasting and preparation requirements, specimen collection, and clinical reference ranges."
          align="center"
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left: Search + Category Chips + Context Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-soft transition focus-within:border-medical-500 focus-within:shadow-card">
                <Search className="ml-2 h-4.5 w-4.5 shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 1,000+ laboratory tests…"
                  aria-label="Search laboratory tests"
                  className="w-full bg-transparent px-2 py-1 text-sm outline-none placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {['All', ...LAB_CATEGORIES.slice(0, 6)].map((c) => (
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

              <div className="mt-6 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-soft">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Clinical Interpretation Context
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Laboratory results are evaluated in the context of your complete medical history and physical examination.
                  GlobalHealth provides educational reference ranges and preparation guidelines.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button size="lg" onClick={() => onTabChange('medical-tests')}>
                <FlaskConical className="h-4.5 w-4.5" />
                Explore 1,000+ Diagnostic Tests
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right: Symmetrical Diagnostic Test Cards (7 cols) */}
          <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
            {filtered.map((test, i) => (
              <Reveal key={test.id} delay={i * 40}>
                <button
                  type="button"
                  onClick={() => onTabChange('medical-tests')}
                  className="group flex h-full w-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 text-left shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-medical-300 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-medical-50 text-medical-700 group-hover:bg-medical-600 group-hover:text-white transition">
                        <TestTube2 className="h-5 w-5" />
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                        {test.category.split(',')[0]}
                      </span>
                    </div>

                    <h3 className="mt-4 text-[15px] font-bold text-slate-900 group-hover:text-medical-800">
                      {test.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
                      {test.purpose}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                      <FlaskConical className="h-3.5 w-3.5" />
                      {test.sampleType?.split(' / ')[0] || 'Specimen'}
                    </span>
                    <span className="font-bold text-medical-700 group-hover:underline flex items-center gap-1">
                      Details <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}

            {filtered.length === 0 && (
              <div className="sm:col-span-2">
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
                  <p className="text-sm font-semibold text-slate-700">No matching laboratory investigations found</p>
                  <p className="mt-1 text-xs text-slate-500">Try searching a different test name or specimen type.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
