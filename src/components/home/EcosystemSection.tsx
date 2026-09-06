import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { NavigationTab } from '../../types';
import { ECOSYSTEM_MODULES } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

interface EcosystemSectionProps {
  onTabChange: (tab: NavigationTab) => void;
}

/** Section 8 — "Explore GlobalHealth": six major platform modules. */
export const EcosystemSection: React.FC<EcosystemSectionProps> = ({ onTabChange }) => {
  return (
    <section className="gh-section bg-slate-50/60" aria-labelledby="ecosystem-title">
      <div className="gh-container">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <SectionHeading
            id="ecosystem-title"
            eyebrow="Explore GlobalHealth"
            title="Everything you need, in one place"
            description="Six connected modules that make understanding, discovering and navigating healthcare simpler."
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEM_MODULES.map((module, i) => (
            <Reveal key={module.id} delay={i * 50}>
              <button
                type="button"
                onClick={() => onTabChange(module.tab)}
                className="group flex h-full w-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-medical-200 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-medical-50 text-medical-700 transition duration-200 group-hover:bg-medical-600 group-hover:text-white">
                    {module.icon}
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-slate-300 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-medical-600" />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900">{module.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{module.description}</p>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
