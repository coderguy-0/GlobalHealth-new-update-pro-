import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { NavigationTab } from '../../types';
import { HEALTH_TOPIC_CARDS } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

interface ExploreHealthSectionProps {
  onTabChange: (tab: NavigationTab) => void;
}

/** Section 11 — "Explore Health": a small set of high-quality content cards. */
export const ExploreHealthSection: React.FC<ExploreHealthSectionProps> = ({ onTabChange }) => {
  return (
    <section className="gh-section bg-slate-50/60" aria-labelledby="explore-health-title">
      <div className="gh-container">
        <SectionHeading
          id="explore-health-title"
          eyebrow="Health library"
          title="Explore Health"
          description="A focused selection of health topics — understand more, one clear article at a time."
          action={
            <button
              type="button"
              onClick={() => onTabChange('explore')}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-medical-700 transition hover:text-medical-800"
            >
              Explore all health topics
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          }
        />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HEALTH_TOPIC_CARDS.map((card, i) => (
            <Reveal key={card.id} delay={(i % 4) * 50}>
              <button
                type="button"
                onClick={() => onTabChange(card.tab)}
                className="group flex h-full w-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-medical-200 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                    {card.icon}
                    {card.category}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-medical-600" />
                </div>
                <h3 className="mt-4 text-[15px] font-bold leading-snug text-slate-900">{card.title}</h3>
                <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-slate-500">{card.description}</p>
                <p className="mt-3 flex items-center gap-1 text-[11px] font-medium text-slate-400">
                  <Clock className="h-3 w-3" />
                  {card.readTime}
                </p>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
