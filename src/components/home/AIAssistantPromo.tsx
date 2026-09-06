import React from 'react';
import { Bot, ArrowRight, Sparkles, ShieldCheck, Zap, MessageSquare } from 'lucide-react';
import { NavigationTab } from '../../types';
import { AI_EXAMPLE_PROMPTS } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

interface AIAssistantPromoProps {
  onTabChange: (tab: NavigationTab) => void;
}

const AIAvatar: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <div
    className="relative grid place-items-center rounded-3xl bg-gradient-to-br from-medical-500 via-medical-600 to-medical-800 text-white shadow-lift border border-white/20 p-4"
    style={{ width: size, height: size }}
    role="img"
    aria-label="GlobalHealth AI Assistant avatar"
  >
    <Bot className="h-16 w-16 text-white" />
    <span className="absolute -top-1 -right-1 flex h-4 w-4">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
    </span>
  </div>
);

export const AIAssistantPromo: React.FC<AIAssistantPromoProps> = ({ onTabChange }) => {
  return (
    <section className="gh-section bg-white" aria-labelledby="ai-promo-title">
      <div className="gh-container">
        <div className="relative overflow-hidden rounded-3xl border border-medical-200/80 bg-gradient-to-br from-medical-50/80 via-white to-teal-50/50 p-8 sm:p-12 shadow-card">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-medical-200/40 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" aria-hidden="true" />

          <div className="relative grid items-center gap-10 lg:grid-cols-12">
            {/* Left: Avatar & Live Status (3 cols) */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center text-center">
              <Reveal>
                <div className="gh-float">
                  <AIAvatar />
                </div>
              </Reveal>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-800 border border-slate-200 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Gemini 2.5 Engine
              </span>
            </div>

            {/* Middle: Headline, Description & Prompt Chips (6 cols) */}
            <div className="lg:col-span-6">
              <SectionHeading
                id="ai-promo-title"
                eyebrow="Conversational AI Intelligence"
                title="Meet your GlobalHealth AI Assistant"
                description="Instant clinical triage support, lab test interpretation guidance, pharmaceutical queries, and healthcare navigation."
              />

              <div className="mt-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Sample Clinical Inquiries:
                </span>
                <ul className="flex flex-wrap gap-2">
                  {AI_EXAMPLE_PROMPTS.map((p) => (
                    <li key={p}>
                      <button
                        type="button"
                        onClick={() => onTabChange('ai-assistant')}
                        className="gh-chip text-xs bg-white/90 hover:bg-white"
                      >
                        <Sparkles className="h-3 w-3 text-medical-600" />
                        “{p}”
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: CTA & Safety Footnote (3 cols) */}
            <div className="lg:col-span-3 flex flex-col items-center lg:items-end text-center lg:text-right">
              <Button
                size="lg"
                variant="primary"
                className="shadow-md hover:shadow-lg w-full sm:w-auto"
                onClick={() => onTabChange('ai-assistant')}
              >
                <Bot className="h-4.5 w-4.5" />
                Start AI Session
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="mt-4 flex items-start gap-1.5 text-[11px] text-slate-500 max-w-xs text-left lg:text-right">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Educational triage only. AI guidance does not replace a licensed medical physician.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
