/* ============================================================================
   GlobalHealth AI — search aliases / synonyms (spec §96).

   Layman phrases are expanded into clinical terms before knowledge retrieval
   so "heart attack" can match "myocardial infarction" in the verified
   libraries. Expansion is conservative: aliases are added to the query, they
   never replace or override the user's own words.
   ========================================================================== */

export const GH_ALIASES: Record<string, string[]> = {
  'heart attack': ['myocardial infarction', 'cardiac arrest'],
  'cardiac arrest': ['heart attack'],
  'high blood pressure': ['hypertension'],
  hypertension: ['high blood pressure'],
  'low blood pressure': ['hypotension'],
  hypotension: ['low blood pressure'],
  'blood sugar': ['glucose', 'blood glucose'],
  glucose: ['blood sugar'],
  'sugar test': ['glucose', 'blood glucose', 'hba1c'],
  'kidney function test': ['renal function', 'creatinine', 'urea'],
  'renal function panel': ['kidney function test', 'creatinine'],
  'liver function test': ['lft', 'hepatic function'],
  lft: ['liver function test'],
  'thyroid test': ['tsh', 'thyroid function'],
  tsh: ['thyroid stimulating hormone', 'thyroid function'],
  'full blood count': ['complete blood count', 'cbc'],
  cbc: ['complete blood count', 'full blood count'],
  'complete blood count': ['cbc', 'full blood count'],
  'water infection': ['urinary tract infection', 'uti'],
  uti: ['urinary tract infection'],
  'stomach flu': ['gastroenteritis'],
  gastroenteritis: ['stomach flu'],
  'high cholesterol': ['hyperlipidemia', 'dyslipidemia', 'cholesterol'],
  cholesterol: ['lipid profile', 'hyperlipidemia'],
  'lipid profile': ['cholesterol test', 'hyperlipidemia'],
  'panic attack': ['anxiety', 'anxiety disorder'],
  'fits': ['seizure', 'convulsion'],
  seizure: ['convulsion'],
  'breathlessness': ['dyspnea', 'shortness of breath'],
  'shortness of breath': ['dyspnea', 'breathlessness'],
  'acid reflux': ['gerd', 'gastroesophageal reflux'],
  gerd: ['acid reflux', 'gastroesophageal reflux'],
  'joints pain': ['arthralgia', 'arthritis'],
  'joint pain': ['arthralgia', 'arthritis'],
  arthritis: ['joint pain'],
  'skin allergy': ['allergic dermatitis', 'urticaria', 'hives'],
  hives: ['urticaria'],
  'period problem': ['menstrual disorder', 'irregular periods'],
  'irregular periods': ['menstrual irregularity'],
  'blood in urine': ['hematuria'],
  hematuria: ['blood in urine'],
  'blood in stool': ['melena', 'rectal bleeding'],
  'headache': ['cephalgia'],
  migraine: ['headache'],
  'brain stroke': ['stroke', 'cerebrovascular accident'],
  stroke: ['cerebrovascular accident', 'brain stroke'],
  'chest infection': ['respiratory infection', 'pneumonia', 'bronchitis'],
  'tb': ['tuberculosis'],
  tuberculosis: ['tb'],
  'covid': ['covid-19', 'coronavirus disease'],
  'low hemoglobin': ['anemia'],
  anemia: ['low hemoglobin', 'haemoglobin'],
  dengue: ['dengue fever'],
  malaria: ['malaria fever'],
  diabetes: ['diabetes mellitus', 'blood sugar'],
  'diabetes mellitus': ['diabetes'],
  asthma: ['bronchial asthma'],
  'heart failure': ['cardiac failure', 'chf'],
  chf: ['heart failure'],
};

/** Returns the original text plus conservative alias expansions (deduped). */
export function expandQueryWithAliases(text: string): string {
  const clean = String(text || '').toLowerCase();
  if (!clean) return '';
  const parts = new Set<string>([clean]);
  for (const [phrase, aliases] of Object.entries(GH_ALIASES)) {
    if (clean.includes(phrase)) {
      parts.add(phrase);
      for (const alias of aliases) parts.add(alias);
    }
  }
  return [...parts].join(' | ');
}
