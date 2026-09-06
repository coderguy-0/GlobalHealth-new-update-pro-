/* ============================================================================
   GlobalHealth AI — automatic response mode.

   Chooses the most useful answer shape without asking the user to select a
   mode. Safety mode is always decided by the safety engine, not here.
   ========================================================================== */

import type { AIIntent } from './aiIntent';

export type AIAnswerMode = 'quick' | 'explanation' | 'deep' | 'action' | 'admin';

export interface AnswerModeResult {
  mode: AIAnswerMode;
  /** Optional instruction appended to the model prompt. */
  guidance: string;
}

const MODE_GUIDANCE: Record<AIAnswerMode, string> = {
  quick: 'Give a concise, accurate answer. Use a few short sentences unless the user needs more detail.',
  explanation: 'Explain clearly with simple language, short sections and safe uncertainty. Do not diagnose.',
  deep: 'Give a structured, thorough explanation with sections, bullet points and clear confidence/uncertainty labels.',
  action: 'Identify the exact platform action the user wants. If it can be done in the app, guide the user through it or perform it when authorized. Never claim completion unless confirmed.',
  admin: 'Give a direct, platform- or account-oriented answer. Keep it practical and low-jargon.',
};

export function chooseAnswerMode(intent: AIIntent, wantsAction: boolean, complexity: number): AnswerModeResult {
  if (intent === 'emergency_concern') return { mode: 'quick', guidance: MODE_GUIDANCE.quick };
  if (intent === 'symptom_concern') return { mode: wantsAction ? 'action' : 'explanation', guidance: MODE_GUIDANCE.explanation };
  if (intent === 'account_help' || intent === 'site_navigation' || intent === 'admin_request') return { mode: 'admin', guidance: MODE_GUIDANCE.admin };
  if (wantsAction || intent === 'appointment_action' || intent === 'prescription_action') return { mode: 'action', guidance: MODE_GUIDANCE.action };
  if (intent === 'report_explanation' || complexity > 2) return { mode: 'deep', guidance: MODE_GUIDANCE.deep };
  if (intent === 'comparison_request' || intent === 'pricing_query' || intent === 'prevention_education') return { mode: 'explanation', guidance: MODE_GUIDANCE.explanation };
  return { mode: 'quick', guidance: MODE_GUIDANCE.quick };
}
