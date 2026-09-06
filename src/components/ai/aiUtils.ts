// Safety + navigation helpers for the AI Assistant workspace.

// ---------------------------------------------------------------------------
// Urgent-symptom screening — the assistant never delays urgent care guidance.
// These phrases trigger an emergency-care highlight card; the AI response is
// never allowed to downplay them.
// ---------------------------------------------------------------------------
const URGENT_PATTERNS: RegExp[] = [
  /chest pain/i,
  /chest tightness/i,
  /difficulty breathing/i,
  /can'?t breathe/i,
  /shortness of breath/i,
  /severe bleeding/i,
  /uncontrolled bleeding/i,
  /stroke/i,
  /face drooping/i,
  /slurred speech/i,
  /weakness on one side/i,
  /seizure/i,
  /convuls/i,
  /unconscious/i,
  /passed out/i,
  /fainted/i,
  /suicid/i,
  /self.?harm/i,
  /severe allergic/i,
  /anaphylax/i,
  /swelling of (the )?(face|throat|tongue|lips)/i,
  /head injury/i,
  /hit (my|the) head/i,
  /severe (abdominal|stomach) pain/i,
  /poison/i,
  /overdose/i,
  /pregnancy.*(bleeding|pain)|(bleeding|pain).*pregnancy/i,
  /high fever.*(baby|infant|child)|(baby|infant|child).*high fever/i,
];

export function detectUrgentSymptom(text: string): boolean {
  return URGENT_PATTERNS.some((re) => re.test(text));
}

export const URGENT_CARE_NOTE =
  'Your message describes symptoms that may need urgent medical attention. If you or someone near you is experiencing these symptoms right now, please call your local emergency number (or go to the nearest emergency department) immediately. This assistant cannot provide emergency care, and delaying care can be dangerous.';

// ---------------------------------------------------------------------------
// Website-aware action cards — the assistant acts as an intelligent
// navigation layer grounded in real GlobalHealth sections. Cards are only
// suggested when the conversation actually touches the topic.
// ---------------------------------------------------------------------------
export interface AIActionCard {
  id: string;
  label: string;
  tab: string;
}

interface ActionRule {
  card: AIActionCard;
  patterns: RegExp[];
}

const ACTION_RULES: ActionRule[] = [
  {
    card: { id: 'act-diseases', label: 'Explore Diseases', tab: 'diseases' },
    patterns: [/disease/i, /condition/i, /illness/i, /disorder/i, /infection/i, /symptom/i],
  },
  {
    card: { id: 'act-medicines', label: 'View Medicine Information', tab: 'medicines' },
    patterns: [/medicin/i, /drug/i, /prescri/i, /tablet/i, /dosage/i, /antibiotic/i, /painkiller/i],
  },
  {
    card: { id: 'act-tests', label: 'Explore Lab Tests', tab: 'medical-tests' },
    patterns: [/lab test/i, /blood test/i, /\bcbc\b/i, /test result/i, /panel/i, /biopsy/i, /scan/i, /x-?ray/i],
  },
  {
    card: { id: 'act-doctors', label: 'Find a Doctor', tab: 'doctors' },
    patterns: [/doctor/i, /physician/i, /specialist/i, /consult/i, /general practitioner/i, /\bgp\b/i],
  },
  {
    card: { id: 'act-map', label: 'Open Medical Map', tab: 'medical-map' },
    patterns: [/hospital/i, /medical map/i, /blood bank/i, /clinic/i, /emergency department/i, /near me/i],
  },
  {
    card: { id: 'act-pharmacy', label: 'Explore Verified Pharmacy Partners', tab: 'pharmacy-portal' },
    patterns: [/pharmacy/i, /chemist/i, /medication near/i, /buy medicine/i],
  },
  {
    card: { id: 'act-community', label: 'Open Community', tab: 'community' },
    patterns: [/community/i, /support group/i, /forum/i, /peer/i, /talk to others/i],
  },
];

/** Returns the action cards relevant to a user prompt + assistant reply. */
export function suggestActionCards(userText: string, assistantText: string): AIActionCard[] {
  const combined = `${userText} ${assistantText}`;
  const cards: AIActionCard[] = [];
  for (const rule of ACTION_RULES) {
    if (rule.patterns.some((re) => re.test(combined))) cards.push(rule.card);
  }
  return cards;
}

/** Title helper: first N chars of the first user message, cleaned up. */
export function titleFromPrompt(prompt: string, max = 48): string {
  const clean = prompt.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean || 'New conversation';
  return `${clean.slice(0, max).trimEnd()}…`;
}

// ---------------------------------------------------------------------------
// Suggested prompt cards (welcome empty state)
// ---------------------------------------------------------------------------
export interface SuggestedPrompt {
  id: string;
  title: string;
  prompt: string;
  icon: 'disease' | 'symptom' | 'medicine' | 'lab' | 'service' | 'platform';
}

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { id: 'sp-disease', title: 'Understand a disease', prompt: 'Explain a disease in simple terms and what causes it.', icon: 'disease' },
  { id: 'sp-symptom', title: 'Understand symptoms', prompt: 'What could symptoms like persistent fatigue and headaches be associated with?', icon: 'symptom' },
  { id: 'sp-medicine', title: 'Learn about medicines', prompt: 'What should I understand about a medicine before taking it?', icon: 'medicine' },
  { id: 'sp-lab', title: 'Lab tests', prompt: 'What does a complete blood count (CBC) test measure?', icon: 'lab' },
  { id: 'sp-service', title: 'Find healthcare services', prompt: 'How do I find hospitals, doctors or pharmacies near me on GlobalHealth?', icon: 'service' },
  { id: 'sp-platform', title: 'Understand GlobalHealth', prompt: 'What can I do on the GlobalHealth platform?', icon: 'platform' },
];

// ---------------------------------------------------------------------------
// Safety wordings
// ---------------------------------------------------------------------------
export const AI_DISCLAIMER_TEXT =
  'GlobalHealth AI provides general health information and website assistance. It is not a substitute for diagnosis, treatment, or professional medical advice.';

export const AUTH_GATE_TITLE = 'Sign in to save your conversations';
export const AUTH_GATE_MESSAGE =
  'Your AI conversations with GlobalHealth are saved privately to your own account. While you are signed out, your chat is kept in this session only and is never stored. Sign in to keep your conversations across devices — your data stays yours.';
