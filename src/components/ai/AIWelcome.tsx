import React from 'react';
import {
  Activity,
  FlaskConical,
  HeartPulse,
  Pill,
  Stethoscope,
  Globe2,
  StickyNote,
  type LucideIcon,
} from 'lucide-react';
import { AIAvatar } from './AIAvatar';
import { SUGGESTED_PROMPTS, type SuggestedPrompt } from './aiUtils';

const PROMPT_ICONS: Record<SuggestedPrompt['icon'], LucideIcon> = {
  disease: Activity,
  symptom: HeartPulse,
  medicine: Pill,
  lab: FlaskConical,
  service: Stethoscope,
  platform: Globe2,
};

interface AIWelcomeProps {
  onPrompt: (prompt: string) => void;
  signedIn: boolean;
  displayName: string;
}

/** Empty-state welcome screen for the AI workspace. */
export const AIWelcome: React.FC<AIWelcomeProps> = ({ onPrompt, signedIn, displayName }) => {
  const firstName = displayName.split(' ')[0] || 'there';
  return (
    <div className="gh-fade-up flex h-full flex-col items-center justify-center gap-6 px-5 py-10">
      <div className="flex flex-col items-center text-center">
        <AIAvatar size={72} showStatus />
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Meet Your GlobalHealth AI
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          {signedIn
            ? `Hi ${firstName} — I can answer general health questions, navigate you across GlobalHealth, and read back the labs, vitals, medications and appointments on your own record when you ask.`
            : 'I can answer general health and wellness questions and help you find your way around GlobalHealth. Sign in to ask about your own private health record.'}
        </p>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SUGGESTED_PROMPTS.map((p) => {
          const Icon = PROMPT_ICONS[p.icon];
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPrompt(p.prompt)}
              className="group flex flex-col items-start gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-medical-300 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-medical-50 text-medical-600 transition group-hover:bg-medical-100">
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <span className="text-[13px] font-bold leading-snug text-slate-800">{p.title}</span>
              <span className="text-[11px] leading-snug text-slate-500">{p.prompt}</span>
            </button>
          );
        })}
      </div>

      <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
        <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
        I’m an AI information assistant — educational guidance only, never a replacement for professional medical care.
      </p>
    </div>
  );
};
