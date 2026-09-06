import React from 'react';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import { NavigationTab } from '../../types';
import { HEALTH_TOPIC_CARDS } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { Button } from '../ui/Button';

interface ExploreHealthSectionProps {
  onTabChange: (tab: NavigationTab) => void;
}

export const ExploreHealthSection: React.FC<ExploreHealthSectionProps> = ({ onTabChange }) => {
  return (
    <section className="gh-section bg-slate-50/70" aria-labelledby="explore-health-title">
      <div className="gh-container">
        <SectionHeading
          id="explore-health-title"
          eyebrow="Clinical Knowledge Base"
          title="Evidence-Informed Healthcare Guides"
          description="Structured medical literature, preventive wellness protocols, disease profiles, and dietary science."
          align="center"
        />

        {/* Symmetrical 8-Card Grid (4 cols on lg, 2 on sm) */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HEALTH_TOPIC_CARDS.map((card, i) => (
            <Reveal key={card.id} delay={(i % 4) * 40}>
              <button
                type="button"
                onClick={() => onTabChange(card.tab)}
                className="group flex h-full w-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 text-left shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-medical-300 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-medical-50/80 border border-medical-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-medical-800">
                      {card.icon}
                      {card.category}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-medical-600" />
                  </div>

                  <h3 className="mt-4 text-base font-bold leading-snug text-slate-900 group-hover:text-medical-800">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {card.readTime}
                  </span>
                  <span className="font-semibold text-medical-700 group-hover:underline">Read Guide →</span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="secondary" size="lg" onClick={() => onTabChange('explore')}>
            <BookOpen className="h-4 w-4 text-medical-600" />
            Explore Complete Health Library
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
