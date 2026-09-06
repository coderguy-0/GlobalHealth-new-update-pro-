import React from 'react';
import { ArrowRight, UserPlus } from 'lucide-react';
import { NavigationTab, UserAccount } from '../../types';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

interface FinalCtaSectionProps {
  onTabChange: (tab: NavigationTab) => void;
  currentUser: UserAccount | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

/** Section 35 — calm final CTA before the footer. */
export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onTabChange, currentUser, onOpenAuth }) => {
  return (
    <section className="gh-section pt-6" aria-labelledby="final-cta-title">
      <div className="gh-container">
        <Reveal>
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-soft sm:px-12">
            <span className="gh-eyebrow">Get started</span>
            <h2 id="final-cta-title" className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Your healthcare journey starts here.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Explore trusted information, discover healthcare resources and navigate GlobalHealth
              with confidence.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={() => onTabChange('explore')}>
                Explore GlobalHealth
                <ArrowRight className="h-4 w-4" />
              </Button>
              {!currentUser && (
                <Button size="lg" variant="secondary" onClick={() => onOpenAuth('signup')}>
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </Button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
