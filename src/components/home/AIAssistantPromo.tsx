import React from 'react';
import { Bot, ArrowRight, Sparkles } from 'lucide-react';
import { NavigationTab } from '../../types';
import { AI_EXAMPLE_PROMPTS } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

interface AIAssistantPromoProps {
  onTabChange: (tab: NavigationTab) => void;
}

/** Friendly, clearly AI (not a physician) circular avatar. */
const AIAvatar: React.FC<{ size?: number }> = ({ size = 132 }) => (
  <div
    className="relative grid place-items-center rounded-full bg-gradient-to-br from-medical-500 via-medical-600 to-medical-800 text-white shadow-lift"
    style={{ width: size, height: size }}
    role="img"
    aria-label="GlobalHealth AI Assistant avatar"
  >
    <svg viewBox="0 0 64 64" width={size * 0.56} height={size * 0.56} fill="none" aria-hidden="true">
      {/* calm abstract face — friendly, not human-physician */}
      <circle cx="26" cy="27" r="4" fill="#ffffff" opacity="0.95" />
      <circle cx="38" cy="27" r="4" fill="#ffffff" opacity="0.95" />
      <path d="M25 39c3.5 3 10.5 3 14 0" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d="M24 15c4-2 12-2 16 0" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
      {/* pulse line above the head */}
      <path d="M20 11l3 4 4-7 4 9 3-4h10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
    {/* status dot */}
    <span className="absolute bottom-1.5 right-1.5 h-4 w-4 rounded-full border-[3px] border-white bg-emerald-500" aria-hidden="true" />
  </div>
);

/** Section 10 — premium AI Assistant promotion. */
export const AIAssistantPromo: React.FC<AIAssistantPromoProps> = ({ onTabChange }) => {
  return (
    <section className="gh-section" aria-labelledby="ai-promo-title">
      <div className="gh-container">
        <div className="relative overflow-hidden rounded-3xl border border-medical-100 bg-gradient-to-br from-medical-50 via-white to-medical-50/60 px-6 py-12 sm:px-10 lg:px-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-medical-100/60 blur-2xl" aria-hidden="true" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[auto_1fr_auto]">
            <Reveal className="justify-self-center">
              <div className="gh-float">
                <AIAvatar />
              </div>
            </Reveal>

            <div>
              <SectionHeading
                id="ai-promo-title"
                eyebrow="AI Assistant"
                title="Meet your GlobalHealth AI Assistant"
                description="A conversational way to explore GlobalHealth and better understand health information."
              />
              <ul className="mt-6 flex flex-wrap gap-2">
                {AI_EXAMPLE_PROMPTS.map((p) => (
                  <li key={p}>
                    <button
                      type="button"
                      onClick={() => onTabChange('ai-assistant')}
                      className="gh-chip"
                    >
                      <Sparkles className="h-3 w-3 text-medical-500" />
                      “{p}”
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:text-right">
              <Button size="lg" onClick={() => onTabChange('ai-assistant')}>
                <Bot className="h-4 w-4" />
                Open AI Assistant
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="mt-3 max-w-[240px] text-[11px] leading-relaxed text-slate-500 lg:ml-auto">
                Educational guidance only. The assistant is not a physician and does not provide
                diagnosis or treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
