/* ============================================================================
   GlobalHealth AI — lightweight orchestration helper.

   Runs the understanding → safety → permission → answer-mode pipeline on the
   client before contacting the model, so urgent situations are handled first
   and the model receives safe, labelled context.
   ========================================================================== */

import { detectIntent, IntentResult } from './aiIntent';
import { detectSafetyRisk, SafetyResult } from './aiSafety';
import { AnswerModeResult, chooseAnswerMode } from './aiAnswerMode';

export interface AssistantContext {
  intent: IntentResult;
  safety: SafetyResult;
  mode: AnswerModeResult;
  /** True when the pipeline short-circuits before calling the model. */
  directSafetyResponse: boolean;
  /** Prompt enrichment to send only when the model path is used. */
  systemContext: string;
}

export interface AssistantContextOptions {
  authenticated: boolean;
  displayName?: string;
  mrn?: string;
  language: string;
  recentTopics?: string[];
}

const TRANSPARENCY_GUIDE =
  'Always distinguish: (a) verified GlobalHealth platform data, (b) general healthcare information, (c) user-provided claims, and (d) uncertainty. ' +
  'Never fabricate doctors, hospitals, medicines, prices, availability, studies, statistics or certifications. ' +
  'If verified data is unavailable, say so clearly. Never diagnose. The final answer must be labeled as general/AI-generated.\n';

export function buildAssistantContext(text: string, opts: AssistantContextOptions): AssistantContext {
  const intent = detectIntent(text);
  const safety = detectSafetyRisk(text);
  const mode = chooseAnswerMode(intent.intent, intent.wantsAction, 1);

  if (safety.risk === 'urgent') {
    return {
      intent,
      safety,
      mode,
      directSafetyResponse: true,
      systemContext: '',
    };
  }

  const pieces: string[] = [TRANSPARENCY_GUIDE];
  pieces.push(`Answer mode: ${mode.mode}. ${mode.guidance}`);
  pieces.push(`User language: ${opts.language || intent.language}. Respond in the same natural language the user used.`);
  pieces.push(`Authentication: ${opts.authenticated ? 'signed in' : 'guest'}. Do not claim access to private records unless authenticated and authorized.`);
  if (opts.authenticated && opts.displayName) pieces.push(`Signed-in user display name: ${opts.displayName}. Use it only for natural, non-intrusive personalization.`);
  if (opts.recentTopics?.length) pieces.push(`Current conversation topics: ${opts.recentTopics.slice(-4).join('; ')}.`);
  pieces.push('Resolve references such as "that medicine", "that doctor", "the second one" from the current conversation when the context is clear.');

  return {
    intent,
    safety,
    mode,
    directSafetyResponse: false,
    systemContext: pieces.join('\n'),
  };
}
