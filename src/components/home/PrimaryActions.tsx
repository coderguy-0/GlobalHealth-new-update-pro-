import React from 'react';
import { ArrowRight } from 'lucide-react';
import { NavigationTab } from '../../types';
import { HOME_ACTIONS } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

interface PrimaryActionsProps {
  onTabChange: (tab: NavigationTab) => void;
}

/** Section 4 — "What can we help you with?" compact action grid. */
export const PrimaryActions: React.FC<PrimaryActionsProps> = ({ onTabChange }) => {
  return (
    <section className="gh-section pt-4 lg:pt-8" aria-labelledby="home-actions-title">
      <div className="gh-container">
        <SectionHeading
          id="home-actions-title"
          eyebrow="Quick access"
          title="What can we help you with?"
          align="center"
        />

        <div className="mt-10 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_ACTIONS.map((item, i) => (
            <Reveal key={item.id} delay={i * 40}>
              <button
                type="button"
                onClick={() => onTabChange(item.tab)}
                className="group flex h-full w-full items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-medical-200 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-medical-50 text-medical-700 transition duration-200 group-hover:bg-medical-600 group-hover:text-white">
                  {item.icon}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900">{item.title}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-medical-600" />
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-500">{item.description}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
