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
  diabetes: ['diabetes mellitus', 'blood sugar', 'diabetic', 'sugar disease'],
  diabetic: ['diabetes', 'diabetes mellitus'],
  sugar: ['blood sugar', 'glucose', 'hba1c'],
  'diabetes mellitus': ['diabetes'],
  asthma: ['bronchial asthma'],
  'heart failure': ['cardiac failure', 'chf'],
  chf: ['heart failure'],

  // ---- extended layman ⇄ clinical vocabulary --------------------------------
  'sugar disease': ['diabetes', 'diabetes mellitus'],
  'sugar level': ['blood glucose', 'glucose', 'hba1c'],
  hba1c: ['glycated hemoglobin', 'blood sugar control'],
  'piles': ['hemorrhoids'],
  hemorrhoids: ['piles'],
  'loose motion': ['diarrhea', 'diarrhoea'],
  diarrhea: ['loose motion', 'diarrhoea'],
  'vomiting': ['emesis', 'nausea'],
  'throwing up': ['vomiting', 'emesis'],
  'gas problem': ['bloating', 'flatulence', 'indigestion'],
  indigestion: ['dyspepsia', 'acidity'],
  acidity: ['acid reflux', 'gastritis', 'dyspepsia'],
  'sore throat': ['pharyngitis', 'throat infection'],
  'runny nose': ['rhinitis', 'common cold'],
  'common cold': ['upper respiratory infection', 'rhinitis'],
  flu: ['influenza'],
  influenza: ['flu'],
  'chicken pox': ['varicella'],
  'measles': ['rubeola'],
  'whooping cough': ['pertussis'],
  'jaundice': ['hyperbilirubinemia', 'liver'],
  'fatty liver': ['hepatic steatosis', 'nafld'],
  'kidney stone': ['renal calculi', 'nephrolithiasis'],
  'gall stone': ['cholelithiasis', 'gallstones'],
  'thyroid problem': ['hypothyroidism', 'hyperthyroidism', 'thyroid function'],
  hypothyroidism: ['underactive thyroid', 'tsh'],
  hyperthyroidism: ['overactive thyroid', 'tsh'],
  'weak bones': ['osteoporosis', 'bone density'],
  osteoporosis: ['weak bones', 'bone density'],
  'back pain': ['lumbago', 'lower back pain'],
  'slip disc': ['herniated disc', 'disc prolapse'],
  'sleeplessness': ['insomnia', 'sleep disorder'],
  insomnia: ['sleeplessness', 'sleep'],
  'snoring': ['sleep apnea'],
  'depression': ['major depressive disorder', 'mood disorder'],
  'anxiety': ['anxiety disorder', 'panic attack'],
  'mental health': ['psychiatry', 'depression', 'anxiety', 'stress'],
  'baby fever': ['pediatric fever', 'child fever'],
  'pregnancy test': ['hcg', 'beta hcg'],
  'due date': ['estimated delivery date', 'pregnancy calculator'],
  'period': ['menstruation', 'menstrual cycle'],
  'infertility': ['fertility', 'conception'],
  'std': ['sexually transmitted infection', 'sti'],
  sti: ['sexually transmitted infection', 'std'],
  'hiv': ['human immunodeficiency virus', 'aids'],
  'piles bleeding': ['rectal bleeding', 'hemorrhoids'],
  'obesity': ['overweight', 'bmi', 'weight management'],
  'weight loss': ['obesity', 'calorie deficit', 'bmi'],
  bmi: ['body mass index', 'weight'],
  'eye problem': ['vision', 'ophthalmology'],
  'ear pain': ['otalgia', 'ear infection'],
  'dizziness': ['vertigo', 'lightheadedness'],
  vertigo: ['dizziness'],
  'numbness': ['paresthesia', 'tingling'],
  'swelling': ['edema', 'oedema'],
  edema: ['swelling'],
  'itching': ['pruritus'],
  'rash': ['skin rash', 'dermatitis'],
  'pimples': ['acne'],
  acne: ['pimples'],
  'hair fall': ['hair loss', 'alopecia'],
  'dark circles': ['periorbital hyperpigmentation'],
  'sun burn': ['sunburn', 'skin damage'],
  'food poisoning': ['foodborne illness', 'gastroenteritis'],
  'dehydration': ['fluid loss', 'ors'],
  'heat stroke': ['heat illness', 'hyperthermia'],
  'painkiller': ['analgesic', 'pain relief'],
  'antibiotic': ['antibacterial', 'antimicrobial'],
  'blood thinner': ['anticoagulant'],
  'water tablet': ['diuretic'],
  'inhaler': ['bronchodilator', 'asthma'],
  'vaccination': ['immunization', 'vaccine'],
  vaccine: ['immunization', 'vaccination'],
  'x ray': ['radiography', 'imaging'],
  'scan': ['imaging', 'ultrasound', 'ct', 'mri'],
  'sonography': ['ultrasound'],
  'ecg': ['electrocardiogram', 'ekg'],
  ekg: ['electrocardiogram', 'ecg'],
  'urine test': ['urinalysis'],
  'stool test': ['stool examination', 'fecal test'],
  'vitamin d test': ['25-hydroxy vitamin d'],
  'iron test': ['ferritin', 'serum iron'],

  heart: ['cardiac', 'cardiology'],
  cardiac: ['heart'],
  kidney: ['renal', 'nephrology'],
  liver: ['hepatic', 'hepatology'],
  lung: ['pulmonary', 'respiratory'],
  stomach: ['gastric', 'gastrointestinal'],
  bones: ['orthopedic', 'skeletal'],
  skin: ['dermatology', 'dermatological'],
  'child': ['pediatric', 'children'],
  'pregnancy': ['prenatal', 'obstetric', 'maternal'],
  'elderly': ['geriatric', 'older adults'],

  // ---- website / navigation vocabulary --------------------------------------
  'health tool': ['calculator', 'health tools'],
  calculator: ['health tool', 'calculators'],
  'find doctor': ['doctors', 'specialist', 'consultation'],
  'book appointment': ['appointment', 'booking', 'doctors'],
  'nearby hospital': ['medical map', 'hospitals', 'facility'],
  'near me': ['medical map', 'nearby', 'location'],
  'buy medicine': ['pharmacy', 'order medicine', 'stock', 'pharmacy partner'],
  'order medicine': ['buy medicine', 'pharmacy', 'stock'],
  'meal plan': ['nutrition', 'diet plan', 'recipes'],
  'diet chart': ['meal plan', 'nutrition', 'diet plan'],
  'workout plan': ['wellness', 'exercise', 'fitness'],
  'gym': ['exercise', 'workout', 'fitness'],
  'yoga': ['wellness', 'exercise', 'stretching'],
  'lab report': ['lab test', 'reference range', 'result'],
  'my records': ['dashboard', 'health record'],
  'my reports': ['dashboard', 'health record', 'lab test'],
  'sign in': ['login', 'account'],
  'log in': ['sign in', 'login', 'account'],
  'privacy': ['privacy policy', 'consent', 'data'],
  'delete my data': ['privacy', 'consent', 'data rights'],
};

/** Word-boundary aware phrase detection (so "tb" never matches "outbreak"). */
function containsPhrase(haystack: string, phrase: string): boolean {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`).test(haystack);
}

/**
 * Alias expansions for a query, as a list (deduped, original text excluded).
 * The retrieval engine scores these BELOW the user's own words.
 */
export function aliasExpansions(text: string): string[] {
  const clean = String(text || '').toLowerCase();
  if (!clean) return [];
  const out = new Set<string>();
  for (const [phrase, aliases] of Object.entries(GH_ALIASES)) {
    if (!containsPhrase(clean, phrase)) continue;
    for (const alias of aliases) out.add(alias);
  }
  return [...out];
}

/** Returns the original text plus conservative alias expansions (deduped). */
export function expandQueryWithAliases(text: string): string {
  const clean = String(text || '').toLowerCase();
  if (!clean) return '';
  const parts = new Set<string>([clean]);
  for (const [phrase, aliases] of Object.entries(GH_ALIASES)) {
    if (containsPhrase(clean, phrase)) {
      parts.add(phrase);
      for (const alias of aliases) parts.add(alias);
    }
  }
  return [...parts].join(' | ');
}
