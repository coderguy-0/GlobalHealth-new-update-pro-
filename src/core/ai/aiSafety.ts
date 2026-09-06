/* ============================================================================
   GlobalHealth AI — safety engine.

   Safety runs BEFORE normal conversation. When a likely urgent warning is
   present, the assistant prioritizes immediate emergency guidance and does not
   continue with a long educational answer.

   This is a heuristic triage layer, not a diagnosis or emergency dispatch
   system. Critical symptoms still require contact with emergency services.
   ========================================================================== */

export type SafetyRisk = 'none' | 'urgent' | 'warning';

export interface SafetyResult {
  risk: SafetyRisk;
  category?: string;
  /** Short human-facing emergency instruction; only populated for urgent risk. */
  emergencyMessage?: string;
  /** True when the assistant should skip the normal knowledge pipeline. */
  blockNormalReply: boolean;
}

const URGENT_PATTERNS: { pattern: RegExp; category: string; message: string }[] = [
  {
    pattern: /(can'?t breathe|cannot breathe|severe breathing|difficulty breathing|choking)/i,
    category: 'Breathing difficulty',
    message: 'If you are having severe difficulty breathing or feel like you are choking, this may be a medical emergency. Please call your local emergency number (112 in India) or the nearest emergency department now. Do not wait for an online reply.',
  },
  {
    pattern: /(chest pain|crushing chest|chest tightness|severe chest|heart attack)/i,
    category: 'Severe chest symptoms',
    message: 'Severe or crushing chest pain can be a sign of a heart emergency. Please contact your local emergency services (112 in India) or go to the nearest emergency department immediately.',
  },
  {
    pattern: /(unconscious|fainted|passed out|seizure|convuls|face drooping|slurred speech|sudden weakness on one side)/i,
    category: 'Major neurological warning',
    message: 'Loss of consciousness, seizures, or sudden weakness/face drooping/speech difficulty may need urgent medical care. Please call your local emergency number or go to the nearest emergency department now.',
  },
  {
    pattern: /(severe allergic|anaphyla|tongue swelling|throat swelling|airway swelling)/i,
    category: 'Severe allergic reaction',
    message: 'Swelling of the tongue/throat or trouble breathing after possible exposure to an allergen may be anaphylaxis. Use your emergency medical plan if available and contact emergency services immediately.',
  },
  {
    pattern: /(severe bleeding|uncontrolled bleed|heavy bleeding|cannot stop bleeding)/i,
    category: 'Severe bleeding',
    message: 'Severe or uncontrolled bleeding needs immediate care. Apply direct pressure if possible and call your local emergency services or go to the nearest emergency department now.',
  },
  {
    pattern: /(poison|overdose|took too many|swallowed.*tablets|suicid|self[- ]harm)/i,
    category: 'Poisoning / overdose / self-harm',
    message: 'This may be a serious emergency. If someone has taken a harmful overdose, ingested poison, or is at immediate risk of self-harm, please call your local emergency number (112 in India), a poison control helpline, or go to the nearest emergency department now. Do not rely on this chat for treatment.',
  },
];

const WARNING_PATTERNS = [
  /(high fever|very high fever|severe headache|stiff neck|confusion|extreme fatigue|severe vomiting|blood in stool|blood in urine|blackout)/i,
];

export function detectSafetyRisk(text: string, context = ''): SafetyResult {
  const full = `${text} ${context}`;
  for (const item of URGENT_PATTERNS) {
    if (item.pattern.test(full)) {
      return {
        risk: 'urgent',
        category: item.category,
        emergencyMessage: item.message,
        blockNormalReply: true,
      };
    }
  }
  if (WARNING_PATTERNS.some((p) => p.test(full))) {
    return { risk: 'warning', category: 'Warning signs', blockNormalReply: false };
  }
  return { risk: 'none', blockNormalReply: false };
}
