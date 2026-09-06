import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { NavigationTab } from '../../types';
import { HOME_ACTIONS } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

interface PrimaryActionsProps {
  onTabChange: (tab: NavigationTab) => void;
}

export const PrimaryActions: React.FC<PrimaryActionsProps> = ({ onTabChange }) => {
  return (
    <section className="gh-section bg-white pt-2 pb-8 sm:pt-4 sm:pb-12" aria-labelledby="home-actions-title">
      <div className="gh-container">
        <SectionHeading
          id="home-actions-title"
          eyebrow="Rapid Access Matrix"
          title="What can we help you discover today?"
          description="Direct access to verified clinical directories, instant AI triage, medical facilities, and health tools."
          align="center"
        />

        {/* Symmetrical 8-Card Grid (4 cols on large, 2 cols on tablet, 1 on mobile) */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_ACTIONS.map((item, i) => (
            <Reveal key={item.id} delay={i * 30}>
              <button
                type="button"
                onClick={() => onTabChange(item.tab)}
                className="group flex h-full w-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 text-left shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-medical-300 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-medical-50 text-medical-700 transition duration-200 group-hover:bg-medical-600 group-hover:text-white shadow-2xs">
                      {item.icon}
                    </span>
                    <ArrowRight className="h-4.5 w-4.5 shrink-0 text-slate-300 transition duration-200 group-hover:translate-x-1 group-hover:text-medical-600" />
                  </div>

                  <h3 className="mt-4 text-[15px] font-extrabold text-slate-900 group-hover:text-medical-800">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-1 text-[11px] font-bold text-medical-700 opacity-80 group-hover:opacity-100">
                  <span>Explore Now</span>
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
