import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { NavigationTab } from '../../types';
import { ECOSYSTEM_MODULES } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

interface EcosystemSectionProps {
  onTabChange: (tab: NavigationTab) => void;
}

export const EcosystemSection: React.FC<EcosystemSectionProps> = ({ onTabChange }) => {
  return (
    <section className="gh-section bg-white" aria-labelledby="ecosystem-title">
      <div className="gh-container">
        <SectionHeading
          id="ecosystem-title"
          eyebrow="Integrated Platform Matrix"
          title="Six Core Pillars of Connected Healthcare"
          description="A unified clinical ecosystem bringing diseases, pharmaceuticals, providers, facilities, diagnostic testing, and patient community together."
          align="center"
        />

        {/* Symmetrical 6-Card Grid (3 cols on desktop, 2 on tablet, 1 on mobile) */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEM_MODULES.map((module, i) => (
            <Reveal key={module.id} delay={i * 40}>
              <button
                type="button"
                onClick={() => onTabChange(module.tab)}
                className="group flex h-full w-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 text-left shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-medical-300 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-medical-50 text-medical-700 transition duration-200 group-hover:bg-medical-600 group-hover:text-white shadow-2xs">
                      {module.icon}
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-medical-50 group-hover:text-medical-600 transition duration-200">
                      <ArrowUpRight className="h-4.5 w-4.5" />
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-slate-900 group-hover:text-medical-800">
                    {module.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {module.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-medical-700 opacity-80 group-hover:opacity-100">
                  <span>Enter Module</span>
                  <span aria-hidden="true">→</span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
