/* ============================================================================
   GlobalHealth AI — intent detection.

   Rule-assisted intent classification used to choose response mode, tool
   availability and the safest next step. It is intentionally conservative:
   when uncertain it returns `general_health` rather than guessing a higher-risk
   interpretation.
   ========================================================================== */

export type AIIntent =
  | 'symptom_concern'
  | 'medicine_info'
  | 'pharmacy_search'
  | 'doctor_search'
  | 'hospital_search'
  | 'lab_search'
  | 'imaging_search'
  | 'blood_search'
  | 'appointment_action'
  | 'prescription_action'
  | 'report_explanation'
  | 'record_navigation'
  | 'account_help'
  | 'site_navigation'
  | 'comparison_request'
  | 'pricing_query'
  | 'prevention_education'
  | 'community_help'
  | 'admin_request'
  | 'emergency_concern'
  | 'general_health';

export interface IntentResult {
  intent: AIIntent;
  /** Primary language detected by simple heuristics (English / Hindi / Hinglish). */
  language: 'en' | 'hi' | 'hinglish';
  /** Whether the request looks like an action the platform can execute. */
  wantsAction: boolean;
}

const RULES: { pattern: RegExp; intent: AIIntent; wantsAction?: boolean }[] = [
  { pattern: /(breath|breathing|cannot breathe|can't breathe|choking|chest pain|chest tight|unconscious|seizure|severe bleeding|suicid|overdose|poison)/i, intent: 'emergency_concern', wantsAction: true },
  { pattern: /(book|schedule|appointment|consult)/i, intent: 'appointment_action', wantsAction: true },
  { pattern: /(upload|prescription|rx|doctor'?s note)/i, intent: 'prescription_action', wantsAction: true },
  { pattern: /(report|lab result|blood test|cbc|lipid|hba1c|thyroid)/i, intent: 'report_explanation' },
  { pattern: /(medicine|medication|tablet|syrup|capsule|dose|side effect|parac|dolo|calpol|pcm)/i, intent: 'medicine_info' },
  { pattern: /(pharmacy|chemist|medical store|nearby medicine)/i, intent: 'pharmacy_search', wantsAction: true },
  { pattern: /(doctor|physician|specialist|cardiolog|pediatric|gynec|orthopedic)/i, intent: 'doctor_search', wantsAction: true },
  { pattern: /(hospital|nursing home|emergency department|24 hour hospital)/i, intent: 'hospital_search', wantsAction: true },
  { pattern: /(labort|pathology|diagnostic lab|blood test near)/i, intent: 'lab_search', wantsAction: true },
  { pattern: /(imaging|x-?ray|mri|ct scan|ultrasound|scan near)/i, intent: 'imaging_search', wantsAction: true },
  { pattern: /(blood bank|blood donor|donate blood|blood group)/i, intent: 'blood_search', wantsAction: true },
  { pattern: /(compare|which is better|vs|versus)/i, intent: 'comparison_request' },
  { pattern: /(price|cost|charge|fee|delivery fee)/i, intent: 'pricing_query' },
  { pattern: /(my record|my report|my health|my medication|my appointment|my history|open.*record)/i, intent: 'record_navigation', wantsAction: true },
  { pattern: /(login|logout|sign in|sign up|password|account|forgot)/i, intent: 'account_help', wantsAction: true },
  { pattern: /(symptom|fever|cough|headache|pain|nausea|vomit|diarrhea|weakness|dizzy)/i, intent: 'symptom_concern' },
  { pattern: /(prevent|vaccine|diet|exercise|screening|checkup)/i, intent: 'prevention_education' },
  { pattern: /(community|forum|discussion)/i, intent: 'community_help', wantsAction: true },
  { pattern: /(where is|take me|open|show me|go to|find)/i, intent: 'site_navigation', wantsAction: true },
];

const HINDI_TERMS = /(mujhe|chahiye|mera|meri|batao|kahan|dawai|daar|hospital|doctor|daktar|kareeb|madiq|nasbandi|पास|औषधि|दवा|अस्पताल|डॉक्टर)/i;

export function detectIntent(text: string): IntentResult {
  const cleaned = text.trim();
  const isHindi = /[\u0900-\u097F]/.test(cleaned) || HINDI_TERMS.test(cleaned);
  const language: IntentResult['language'] = isHindi ? (/[\u0900-\u097F]/.test(cleaned) || /chahiye|kahan|mujhe|meri|mera/.test(cleaned.toLowerCase()) ? (/\b(the|with|and|is|for)\b/i.test(cleaned) ? 'hinglish' : 'hi') : 'hinglish') : 'en';

  for (const rule of RULES) {
    if (rule.pattern.test(cleaned)) {
      return { intent: rule.intent, language, wantsAction: Boolean(rule.wantsAction) };
    }
  }
  return { intent: 'general_health', language, wantsAction: false };
}
