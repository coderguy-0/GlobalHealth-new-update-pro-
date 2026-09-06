import React from 'react';
import { ArrowRight, UserPlus, Sparkles, Bot } from 'lucide-react';
import { NavigationTab, UserAccount } from '../../types';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

interface FinalCtaSectionProps {
  onTabChange: (tab: NavigationTab) => void;
  currentUser: UserAccount | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onTabChange,
  currentUser,
  onOpenAuth,
}) => {
  return (
    <section className="gh-section bg-white pt-6 pb-20" aria-labelledby="final-cta-title">
      <div className="gh-container">
        <Reveal>
          <div className="relative overflow-hidden mx-auto max-w-4xl rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50 to-medical-50/60 p-8 text-center shadow-card sm:p-14">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-medical-50 border border-medical-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-medical-800">
              <Sparkles className="h-3.5 w-3.5 text-medical-600" />
              Connected Care Network · 2026+
            </div>

            <h2 id="final-cta-title" className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Start Exploring Verified Universal Healthcare
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Explore 500+ clinical conditions, 400+ pharmaceuticals, verified practitioners,
              diagnostic reference guides, and conversational AI assistance.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Button size="lg" variant="primary" onClick={() => onTabChange('explore')}>
                Explore Healthcare Matrix
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="secondary"
                onClick={() => onTabChange('ai-assistant')}
              >
                <Bot className="h-4.5 w-4.5 text-medical-600" />
                Ask Clinical AI
              </Button>

              {!currentUser && (
                <Button size="lg" variant="secondary" onClick={() => onOpenAuth('signup')}>
                  <UserPlus className="h-4 w-4" />
                  Create Free Account
                </Button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
