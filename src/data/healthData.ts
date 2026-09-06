import { 
  HealthCondition, 
  Medicine, 
  MedicalTest, 
  Recipe, 
  Hospital, 
  Doctor, 
  ForumPost, 
  NewsArticle, 
  MedicalLiteracyChallenge,
  LanguageOption 
} from '../types';
import { ALL_500_DISEASES } from './diseases';
import { ALL_400_MEDICINES } from './medicines';
import { ALL_1000_MEDICAL_TESTS } from './medicalTests';

export * from './diseases';
export * from './medicines';
export * from './medicalTests';

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
];

export const HEALTH_CONDITIONS: HealthCondition[] = ALL_500_DISEASES;

export const MEDICINES: Medicine[] = ALL_400_MEDICINES;

export const MEDICAL_TESTS: MedicalTest[] = ALL_1000_MEDICAL_TESTS;

export { RECIPES, HOSPITALS, DOCTORS } from './directorySeed';

export { FORUM_POSTS } from './forumPosts';

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Breakthrough Study Confirms Mediterranean-DASH Diet Reduces Stroke Risk by 28%',
    slug: 'mediterranean-dash-diet-stroke-risk-reduction',
    source: 'Journal of the American College of Cardiology',
    author: 'Dr. Elena Rostova, MD, FACC',
    date: 'August 12, 2026',
    category: 'Cardiovascular Research',
    status: 'published',
    visibility: 'public',
    summary: 'A 10-year prospective trial tracking 45,000 participants highlights significant neuro-vascular protection from combining berries, green leafy vegetables, wild-caught fish, and extra virgin olive oil.',
    shortDescription: '10-year prospective multi-center study validates endothelial protection and arterial compliance from Mediterranean-DASH synergy.',
    content: 'Researchers observed that high adherence to MIND dietary guidelines slowed cognitive decline and significantly reduced micro-vascular arterial stiffness through endothelial nitric oxide upregulation.',
    readTime: '4 min read',
    evidenceStatus: 'peer-reviewed',
    isFeatured: true,
    viewsCount: 24500,
    sharesCount: 1240
  },
  {
    id: 'news-2',
    title: 'Continuous Glucose Monitors (CGMs) in Non-Diabetics Reveal Glycemic Variability Impacts Endothelial Function',
    slug: 'cgms-in-non-diabetics-glycemic-variability-endothelium',
    source: 'Nature Medicine',
    author: 'Dr. Julian Croft, PhD',
    date: 'August 10, 2026',
    category: 'Metabolic Science',
    status: 'published',
    visibility: 'public',
    summary: 'Over-the-counter biosensors enable real-time tracking, showing that rapid postprandial glucose excursions provoke transient oxidative stress even in normoglycemic individuals.',
    shortDescription: 'Postprandial glycemic excursions provoke oxidative stress and transient arterial stiffness in healthy adults.',
    content: 'The multi-center study demonstrates that mitigating sharp postprandial glucose spikes via meal sequencing (fiber and protein before carbohydrates) significantly preserves microvascular elasticity.',
    readTime: '3 min read',
    evidenceStatus: 'clinical-trial',
    viewsCount: 18900,
    sharesCount: 920
  },
  {
    id: 'news-3',
    title: 'Large-Scale Trial Validates GLP-1/GIP Dual Agonists for Cardio-Renal Protection Beyond Weight Loss',
    slug: 'glp1-gip-dual-agonists-cardio-renal-protection',
    source: 'New England Journal of Medicine',
    author: 'Dr. Sarah Jenkins, MD',
    date: 'August 8, 2026',
    category: 'Pharmacology & Therapeutics',
    status: 'published',
    visibility: 'public',
    summary: 'Landmark trial demonstrates 22% reduction in major adverse cardiovascular events (MACE) and deceleration of glomerular filtration rate decline in chronic kidney disease patients.',
    shortDescription: 'Landmark Phase 3 trial demonstrates direct natriuretic and anti-inflammatory renal benefits.',
    content: 'The trial indicates that GLP-1 receptor pathways exert direct anti-inflammatory and natriuretic actions within renal proximal tubular cells independent of total adipose reduction.',
    readTime: '5 min read',
    evidenceStatus: 'phase-3-trial',
    viewsCount: 31200,
    sharesCount: 1840
  },
  {
    id: 'news-4',
    title: 'Sleep Architecture & Glymphatic System: Deep Slow-Wave N3 Sleep Essential for Amyloid-Beta Clearance',
    slug: 'sleep-architecture-glymphatic-amyloid-clearance',
    source: 'The Lancet Neurology',
    author: 'Dr. Marcus Vance, MD, PhD',
    date: 'August 6, 2026',
    category: 'Neuroscience & Longevity',
    status: 'published',
    visibility: 'public',
    summary: 'High-resolution neuroimaging confirms that astrocytic aquaporin-4 (AQP4) water channels facilitate maximal interstitial cerebral fluid exchange during non-REM stage 3 sleep.',
    shortDescription: 'Slow-wave N3 non-REM sleep drives glymphatic cerebrospinal fluid pulse flushing of neurotoxic waste.',
    content: 'Disruption of slow-wave sleep was directly correlated with acute elevations in tau phosphorylation and impaired daytime memory consolidation, emphasizing sleep consistency over total time.',
    readTime: '4 min read',
    evidenceStatus: 'peer-reviewed',
    viewsCount: 15400,
    sharesCount: 780
  },
  {
    id: 'news-5',
    title: 'Zone 2 Exercise & Mitochondrial Biogenesis: 150 Mins/Week Low-Intensity Cardio Outperforms Pure High Intensity for Metabolic Flexibility',
    slug: 'zone-2-exercise-mitochondrial-biogenesis',
    source: 'Cell Metabolism',
    author: 'Dr. Hiroshi Tanaka, PhD',
    date: 'August 4, 2026',
    category: 'Exercise Physiology',
    status: 'published',
    visibility: 'public',
    summary: 'Exercising at blood lactate levels between 1.5–2.0 mmol/L stimulates PGC-1alpha transcription and maximizes fatty acid beta-oxidation capacity without causing excessive autonomic fatigue.',
    shortDescription: 'Exercising at 1.5–2.0 mmol/L blood lactate upregulates PGC-1α without sympathetic exhaustion.',
    content: 'Clinical physiologists found that athletes and sedentary adults building an aerobic base with Zone 2 training exhibited significantly higher mitochondrial volume density and lower baseline fasting insulin.',
    readTime: '4 min read',
    evidenceStatus: 'peer-reviewed',
    viewsCount: 22100,
    sharesCount: 1100
  },
  {
    id: 'news-6',
    title: 'Microbiome Diversity Trial: 6 Daily Servings of Fermented Foods Reduce 19 Inflammatory Cytokines',
    slug: 'microbiome-fermented-foods-cytokine-reduction',
    source: 'Cell Host & Microbe',
    author: 'Dr. Elena Rostova, MD',
    date: 'August 1, 2026',
    category: 'Immunology & Nutrition',
    status: 'published',
    visibility: 'public',
    summary: 'A randomized controlled dietary intervention of fermented foods (kefir, kimchi, yogurt, kombucha) increased microbial species richness and dampened systemic IL-6, IL-1beta, and TNF-alpha.',
    shortDescription: 'Live-microbe foods produce rapid shifts in short-chain fatty acid signaling and mucosal immunity.',
    content: 'Unlike high-fiber diets alone which require weeks for microbiota adaptation, fermented live-microbe foods produced rapid shifts in short-chain fatty acid (SCFA) signaling and mucosal integrity.',
    readTime: '4 min read',
    evidenceStatus: 'clinical-trial',
    viewsCount: 14200,
    sharesCount: 650
  },
  {
    id: 'news-7',
    title: 'Liquid Biopsy Multi-Cancer Early Detection (MCED) Blood Tests Demonstrate 92% Specificity in Population Cohort',
    slug: 'liquid-biopsy-mced-early-cancer-detection',
    source: 'Journal of Clinical Oncology',
    author: 'Dr. Sarah Jenkins, MD',
    date: 'July 28, 2026',
    category: 'Oncology & Diagnostics',
    status: 'published',
    visibility: 'public',
    summary: 'Cell-free DNA (cfDNA) methylation profiling accurately pinpointed early-stage malignancy origins across 12 organ systems prior to symptomatic clinical presentation.',
    shortDescription: 'cfDNA methylation sequencing identifies tissue-of-origin for early localized malignancies.',
    content: 'The multi-center prospective validation study highlights that combining epigenetic methylation patterns with targeted circulating protein biomarkers minimizes false-positive interventions.',
    readTime: '5 min read',
    evidenceStatus: 'phase-3-trial',
    viewsCount: 29800,
    sharesCount: 1650
  },
  {
    id: 'news-8',
    title: 'Apolipoprotein B (ApoB) and Non-HDL Established as Superior Atherogenic Biomarkers Over Standard LDL-C',
    slug: 'apob-non-hdl-superior-atherogenic-biomarkers',
    source: 'European Heart Journal',
    author: 'Dr. Julian Croft, PhD',
    date: 'July 24, 2026',
    category: 'Preventive Cardiology',
    status: 'published',
    visibility: 'public',
    summary: 'International cardiology consensus confirms that measuring total circulating particle number via ApoB resolves discordance in patients with metabolic syndrome, diabetes, and hypertriglyceridemia.',
    shortDescription: 'Circulating atherogenic particle count via ApoB-100 resolves discordance in cardiometabolic risk.',
    content: 'Every atherogenic particle (VLDL, IDL, LDL) carries exactly one ApoB-100 molecule; therefore ApoB directly reflects arterial wall penetration potential more accurately than cholesterol mass.',
    readTime: '4 min read',
    evidenceStatus: 'meta-analysis',
    viewsCount: 19400,
    sharesCount: 980
  },
  {
    id: 'news-9',
    title: 'Vitamin D3 & Magnesium Synergy: Trial Shows Active 1,25-OH Conversion Requires Adequate Intracellular Mg2+',
    slug: 'vitamin-d3-magnesium-synergy-calcitriol',
    source: 'The American Journal of Clinical Nutrition',
    author: 'Dr. Marcus Vance, MD',
    date: 'July 20, 2026',
    category: 'Micronutrient Science',
    status: 'published',
    visibility: 'public',
    summary: 'High-dose cholecalciferol supplementation fails to optimize active hormonal Vitamin D status in magnesium-deficient individuals due to hepatic 25-hydroxylase dependency.',
    shortDescription: 'Hepatic and renal CYP hydroxylase enzymes require magnesium as an essential cofactor.',
    content: 'Enzymes synthesizing and metabolizing Vitamin D (CYP2R1 and CYP27B1) require magnesium as an essential cofactor; co-administration restored optimal calcitriol balance without hypercalcemia.',
    readTime: '3 min read',
    evidenceStatus: 'peer-reviewed',
    viewsCount: 16700,
    sharesCount: 810
  },
  {
    id: 'news-10',
    title: 'Sodium-to-Potassium Ratio Identified as Superior Predictor of Stroke and All-Cause Mortality Than Sodium Alone',
    slug: 'sodium-potassium-ratio-superior-stroke-predictor',
    source: 'The Lancet Global Health',
    author: 'Dr. Hiroshi Tanaka, PhD',
    date: 'July 15, 2026',
    category: 'Public Health & Epidemiology',
    status: 'published',
    visibility: 'public',
    summary: 'A global cohort analysis across 60 countries reveals that increasing potassium-rich whole foods (targeting >3,500mg/day) counteracts high-sodium arterial stiffness more effectively than severe sodium restriction.',
    shortDescription: 'Targeting >3,500mg/day potassium promotes endothelial hyperpolarization and natriuresis.',
    content: 'Potassium promotes natriuresis and endothelium-dependent vasodilation through hyperpolarization of vascular smooth muscle cells, lowering systolic blood pressure by up to 6.8 mmHg.',
    readTime: '4 min read',
    evidenceStatus: 'systematic-review',
    viewsCount: 13800,
    sharesCount: 620
  }
];

export const MEDICAL_LITERACY_CHALLENGES: MedicalLiteracyChallenge[] = [
  {
    id: 'mcq-1',
    newsArticleId: 'news-1',
    newsHeadline: 'Mediterranean-DASH Diet Reduces Stroke Risk by 28%',
    newsSource: 'Journal of the American College of Cardiology',
    newsDate: 'August 12, 2026',
    category: 'Cardiovascular Research',
    questionType: 'Clinical Trial Finding',
    difficulty: 'Standard',
    question: 'According to the 10-year prospective trial on the Mediterranean-DASH diet, which dietary combination was shown to reduce stroke incidence by 28%?',
    options: [
      'Zero carbohydrate intake with high saturated animal fats',
      'Berries, green leafy vegetables, wild-caught fish, and extra virgin olive oil',
      'Processed red meat with high refined grain intake',
      'Exclusive fruit juices and liquid detox cleanses'
    ],
    correctIdx: 1,
    explanation: 'The trial confirmed that combining polyphenol-rich berries, Vitamin K-rich leafy greens, omega-3 fatty acids from wild fish, and monounsaturated fats from olive oil exerts potent endothelial protection and arterial compliance.',
    clinicalInsight: 'High adherence to MIND dietary patterns reduces micro-vascular arterial stiffness through upregulation of endothelial nitric oxide synthase (eNOS).',
    tags: ['Stroke Prevention', 'MIND Diet', 'Omega-3', 'Endothelial Health']
  },
  {
    id: 'mcq-2',
    newsArticleId: 'news-2',
    newsHeadline: 'Continuous Glucose Monitors (CGMs) in Non-Diabetics Reveal Glycemic Variability Impacts Endothelial Function',
    newsSource: 'Nature Medicine',
    newsDate: 'August 10, 2026',
    category: 'Metabolic Science',
    questionType: 'Mechanistic Physiology',
    difficulty: 'Clinical',
    question: 'Recent biosensor research indicates that in non-diabetic individuals, what strategy most effectively mitigates steep postprandial glucose excursions?',
    options: [
      'Eating simple sugars and desserts on a completely empty stomach',
      'Consuming dietary fiber and protein prior to complex carbohydrates in a meal',
      'Eliminating all dietary water during meals',
      'Skipping all meals until late evening'
    ],
    correctIdx: 1,
    explanation: 'Preloading meals with dietary fiber and lean proteins delays gastric emptying and stimulates early GLP-1 secretion, blunting postprandial glucose velocity and oxidative endothelial stress.',
    clinicalInsight: 'Meal sequencing reduces postprandial glucose peaks by 30–45% without requiring total caloric reduction.',
    tags: ['Glycemic Variability', 'CGM', 'Meal Sequencing', 'Metabolic Health']
  },
  {
    id: 'mcq-3',
    newsArticleId: 'news-3',
    newsHeadline: 'GLP-1/GIP Dual Agonists for Cardio-Renal Protection Beyond Weight Loss',
    newsSource: 'New England Journal of Medicine',
    newsDate: 'August 8, 2026',
    category: 'Pharmacology & Therapeutics',
    questionType: 'Pharmacology & Safety',
    difficulty: 'Expert',
    question: 'Recent clinical trials on GLP-1 receptor agonists showed significant cardio-renal benefits primarily through which direct mechanism?',
    options: [
      'Inhibiting hepatic albumin production and increasing blood viscosity',
      'Direct anti-inflammatory signaling and natriuretic actions in renal proximal tubules',
      'Destroying intestinal gut flora and halting all digestion',
      'Increasing resting systemic heart rate to maximum capacity'
    ],
    correctIdx: 1,
    explanation: 'GLP-1 receptors in the kidney promote tubular sodium excretion (natriuresis) and downregulate renal inflammation and oxidative stress, conferring kidney and heart protection beyond simple weight reduction.',
    clinicalInsight: 'GLP-1 agonists reduce Major Adverse Cardiovascular Events (MACE) by 22% and stabilize glomerular filtration rate in CKD patients.',
    tags: ['GLP-1', 'Renal Protection', 'Cardiology', 'Pharmacology']
  },
  {
    id: 'mcq-4',
    newsArticleId: 'news-4',
    newsHeadline: 'Sleep Architecture: Deep Slow-Wave N3 Sleep Essential for Amyloid-Beta Clearance',
    newsSource: 'The Lancet Neurology',
    newsDate: 'August 6, 2026',
    category: 'Neuroscience & Longevity',
    questionType: 'Mechanistic Physiology',
    difficulty: 'Clinical',
    question: 'During which phase of the sleep cycle does the brain’s glymphatic waste clearance system operate at its peak to flush metabolic waste like amyloid-beta?',
    options: [
      'Light Stage 1 (N1) transitional sleep',
      'Deep Slow-Wave Stage 3 (N3 / Non-REM) sleep',
      'Active daytime daydreaming states',
      'Rapid eye movement (REM) dreaming sleep only'
    ],
    correctIdx: 1,
    explanation: 'During deep N3 slow-wave sleep, interstitial space expands by up to 60%, allowing cerebrospinal fluid to circulate rapidly via aquaporin-4 (AQP4) water channels on astroglial feet, flushing neurotoxic metabolites.',
    clinicalInsight: 'Chronic disruption of deep slow-wave sleep is directly correlated with elevated phosphorylated tau and higher long-term neurodegenerative risk.',
    tags: ['Sleep Medicine', 'Glymphatic System', 'Brain Longevity', 'Slow-Wave Sleep']
  },
  {
    id: 'mcq-5',
    newsArticleId: 'news-5',
    newsHeadline: 'Zone 2 Exercise & Mitochondrial Biogenesis for Metabolic Longevity',
    newsSource: 'Cell Metabolism',
    newsDate: 'August 4, 2026',
    category: 'Exercise Physiology',
    questionType: 'Longevity & Cellular Health',
    difficulty: 'Standard',
    question: 'Exercise physiology trials highlight "Zone 2 aerobic training" for metabolic health. What physiological marker defines optimal Zone 2 training?',
    options: [
      'Exercising until extreme anaerobic exhaustion with blood lactate >8 mmol/L',
      'Exercising at a pace where blood lactate remains steady between 1.5–2.0 mmol/L, maximizing fat oxidation',
      'Remaining completely motionless for 4 hours',
      'Lifting maximum 1-rep heavy weights with 10-minute rest intervals'
    ],
    correctIdx: 1,
    explanation: 'Zone 2 exercise keeps blood lactate between 1.5 and 2.0 mmol/L, recruiting Type I slow-twitch muscle fibers and upregulating PGC-1alpha for mitochondrial biogenesis without triggering anaerobic glycolytic strain.',
    clinicalInsight: 'Zone 2 training (150–180 min/week) improves baseline insulin sensitivity and increases mitochondrial density more efficiently than purely high-intensity workouts.',
    tags: ['Zone 2 Cardio', 'Mitochondria', 'Metabolic Flexibility', 'Longevity']
  },
  {
    id: 'mcq-6',
    newsArticleId: 'news-6',
    newsHeadline: 'Microbiome Diversity Trial: Fermented Foods Reduce 19 Inflammatory Cytokines',
    newsSource: 'Cell Host & Microbe',
    newsDate: 'August 1, 2026',
    category: 'Immunology & Nutrition',
    questionType: 'Clinical Trial Finding',
    difficulty: 'Standard',
    question: 'In recent immunology research on gut health, which dietary intervention produced the most rapid increase in microbial diversity and reduction in inflammatory cytokines (IL-6 & TNF-α)?',
    options: [
      'Consuming 4-6 daily servings of fermented probiotic foods (kefir, kimchi, yogurt, sauerkraut)',
      'Consuming ultra-processed refined sugar bars with artificial sweeteners',
      'Strict zero-microbe sterilized liquid meal shakes',
      'Drinking high-proof distilled alcohol daily'
    ],
    correctIdx: 0,
    explanation: 'A 10-week clinical trial showed that diverse fermented foods consistently increased microbial species richness and dampened 19 inflammatory cytokines, outperforming synthetic probiotic supplements.',
    clinicalInsight: 'Fermented whole foods provide live microbes alongside prebiotic substrates and postbiotics (organic acids) that rapidly improve intestinal barrier integrity.',
    tags: ['Gut Microbiome', 'Fermented Foods', 'Inflammation', 'IL-6 Reduction']
  },
  {
    id: 'mcq-7',
    newsArticleId: 'news-7',
    newsHeadline: 'Multi-Cancer Early Detection (MCED) Liquid Biopsy Demonstrates 92% Specificity',
    newsSource: 'Journal of Clinical Oncology',
    newsDate: 'July 28, 2026',
    category: 'Oncology & Diagnostics',
    questionType: 'Biomarkers & Diagnostics',
    difficulty: 'Expert',
    question: 'Next-generation Multi-Cancer Early Detection (MCED) liquid biopsy blood tests identify early occult tumors primarily by analyzing which molecular signature?',
    options: [
      'Circulating red blood cell counts alone',
      'Cell-free DNA (cfDNA) methylation and targeted circulating protein fragment patterns',
      'Fasting salivary pH levels',
      'Urine specific gravity'
    ],
    correctIdx: 1,
    explanation: 'MCED liquid biopsy platforms analyze tumor-derived cell-free DNA (cfDNA) methylation patterns and somatically altered genomic fragments to detect cancer signals and identify the tissue of origin with high specificity.',
    clinicalInsight: 'Epigenetic DNA methylation profiling allows non-invasive multi-organ screening, detecting aggressive cancers prior to visible radiological manifestation.',
    tags: ['Liquid Biopsy', 'MCED', 'Early Cancer Screening', 'cfDNA']
  },
  {
    id: 'mcq-8',
    newsArticleId: 'news-8',
    newsHeadline: 'Apolipoprotein B (ApoB) Established as Superior Atherogenic Biomarker Over Standard LDL-C',
    newsSource: 'European Heart Journal',
    newsDate: 'July 24, 2026',
    category: 'Preventive Cardiology',
    questionType: 'Biomarkers & Diagnostics',
    difficulty: 'Clinical',
    question: 'Why do modern preventive cardiology guidelines recommend measuring Apolipoprotein B (ApoB) over standard LDL-C in patients with metabolic syndrome?',
    options: [
      'ApoB is completely unrelated to cholesterol and measures lung capacity',
      'Each atherogenic particle (VLDL, IDL, LDL) carries exactly one ApoB molecule, accurately reflecting total particle burden',
      'ApoB is only elevated in children under age 5',
      'ApoB is measured solely through invasive bone marrow biopsy'
    ],
    correctIdx: 1,
    explanation: 'In individuals with insulin resistance or high triglycerides, LDL particles are small and dense. Standard LDL-C measures cholesterol mass, which underestimates particle count, whereas ApoB directly quantifies the exact number of atherogenic particles.',
    clinicalInsight: 'Optimal ApoB target for high-risk cardiovascular prevention is <70 mg/dL (<55 mg/dL for very high risk), providing superior risk stratification over LDL-C.',
    tags: ['ApoB', 'Cardiovascular Risk', 'Lipidology', 'Atherosclerosis']
  },
  {
    id: 'mcq-9',
    newsArticleId: 'news-9',
    newsHeadline: 'Vitamin D3 & Magnesium Synergy: Conversion Requires Adequate Intracellular Mg2+',
    newsSource: 'The American Journal of Clinical Nutrition',
    newsDate: 'July 20, 2026',
    category: 'Micronutrient Science',
    questionType: 'Mechanistic Physiology',
    difficulty: 'Standard',
    question: 'Recent nutritional biochemistry studies reveal that high-dose Vitamin D3 supplements cannot be effectively converted into active calcitriol without adequate levels of which essential mineral?',
    options: [
      'Pure Sodium chloride',
      'Magnesium (Mg²⁺)',
      'Lead',
      'Inorganic Cadmium'
    ],
    correctIdx: 1,
    explanation: 'All enzymes involved in Vitamin D metabolism — including hepatic 25-hydroxylase (CYP2R1), renal 1α-hydroxylase (CYP27B1), and Vitamin D Binding Protein (VDBP) — strictly require magnesium as an essential cofactor.',
    clinicalInsight: 'Magnesium deficiency can cause pseudo-resistance to Vitamin D therapy. Co-optimizing magnesium intake (320–420 mg/day) restores normal 25(OH)D and 1,25(OH)2D balance.',
    tags: ['Vitamin D3', 'Magnesium Synergy', 'Micronutrients', 'Biochemistry']
  },
  {
    id: 'mcq-10',
    newsArticleId: 'news-10',
    newsHeadline: 'Sodium-to-Potassium Ratio Superior Predictor of Stroke Mortality Than Sodium Alone',
    newsSource: 'The Lancet Global Health',
    newsDate: 'July 15, 2026',
    category: 'Public Health & Epidemiology',
    questionType: 'Preventive Guideline',
    difficulty: 'Standard',
    question: 'Global cardiovascular epidemiology indicates that to optimize blood pressure and reduce stroke mortality, the most effective dietary electrolyte strategy is:',
    options: [
      'Consuming zero sodium and zero potassium indefinitely',
      'Moderating sodium intake while actively increasing potassium-rich whole foods (avocados, leafy greens, legumes, salmon)',
      'Drinking salted water with zero vegetable intake',
      'Restricting all dietary minerals and consuming distilled water only'
    ],
    correctIdx: 1,
    explanation: 'Dietary potassium stimulates vascular endothelial hyperpolarization and promotes renal sodium excretion. Increasing potassium intake to >3,500 mg/day blunts the hypertensive effects of dietary sodium.',
    clinicalInsight: 'A low sodium-to-potassium molar ratio (<1.0) is associated with a 24% lower risk of stroke and significant reduction in arterial pulse wave velocity.',
    tags: ['Potassium', 'Blood Pressure', 'Hypertension', 'Electrolyte Balance']
  }
];

