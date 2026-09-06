import { 
  NewsArticle, 
  NewsCategoryItem, 
  NewsAuthorItem, 
  NewsSourceItem, 
  NewsMediaItem 
} from '../types';

export const INITIAL_NEWS_CATEGORIES: NewsCategoryItem[] = [
  {
    id: 'cat-breakthroughs',
    name: 'Medical Breakthroughs',
    slug: 'medical-breakthroughs',
    description: 'Pioneering scientific discoveries, clinical trial phase III successes, and first-in-class therapies.',
    subcategories: ['Genomic Medicine', 'Immunotherapy', 'Cell & Gene Therapies', 'Surgical Innovation'],
    articleCount: 142,
    color: 'emerald'
  },
  {
    id: 'cat-cardio',
    name: 'Cardiovascular Research',
    slug: 'cardiovascular-research',
    description: 'Atherosclerosis prevention, lipidology, heart failure, hypertension, and vascular compliance.',
    subcategories: ['Lipidology & ApoB', 'Arterial Health', 'Heart Failure', 'Arrhythmia'],
    articleCount: 218,
    color: 'rose'
  },
  {
    id: 'cat-metabolic',
    name: 'Metabolic & Endocrinology',
    slug: 'metabolic-endocrinology',
    description: 'Insulin resistance, CGM biosensors, GLP-1 receptor agonists, diabetes remission, and thyroid health.',
    subcategories: ['Diabetes Care', 'GLP-1 Therapeutics', 'Continuous Glucose Monitoring', 'Metabolic Syndrome'],
    articleCount: 195,
    color: 'amber'
  },
  {
    id: 'cat-neuro',
    name: 'Neuroscience & Longevity',
    slug: 'neuroscience-longevity',
    description: 'Brain health, glymphatic waste clearance, neurodegenerative prevention, and cognitive enhancement.',
    subcategories: ['Alzheimer Prevention', 'Sleep Architecture', 'Cognitive Resilience', 'Neuroplasticity'],
    articleCount: 167,
    color: 'purple'
  },
  {
    id: 'cat-oncology',
    name: 'Oncology & Diagnostics',
    slug: 'oncology-diagnostics',
    description: 'Liquid biopsies, early multi-cancer screening, targeted molecular inhibitors, and mRNA cancer vaccines.',
    subcategories: ['Multi-Cancer Early Detection', 'Targeted Oncology', 'Cancer Vaccines', 'Precision Diagnostics'],
    articleCount: 184,
    color: 'indigo'
  },
  {
    id: 'cat-nutrition',
    name: 'Nutrition & Microbiome',
    slug: 'nutrition-microbiome',
    description: 'Gut microbial diversity, fermented nutrition, polyphenol biochemistry, and therapeutic fasting.',
    subcategories: ['Microbiome Diversity', 'Phytochemicals', 'Dietary Electrolytes', 'Cardiometabolic Diets'],
    articleCount: 130,
    color: 'teal'
  },
  {
    id: 'cat-tech',
    name: 'Health Technology & AI',
    slug: 'health-tech-ai',
    description: 'Clinical artificial intelligence, wearable biometric biosensors, diagnostic imaging algorithms, and robotics.',
    subcategories: ['Clinical LLMs', 'Wearable Biosensors', 'Radiology AI', 'Telehealth Systems'],
    articleCount: 94,
    color: 'sky'
  },
  {
    id: 'cat-publichealth',
    name: 'Public Health & Epidemiology',
    slug: 'public-health-epidemiology',
    description: 'Global disease surveillance, vaccination efficacy guidelines, environmental health, and longevity demographics.',
    subcategories: ['Vaccine Surveillance', 'Epidemic Prevention', 'Environmental Health', 'Global Guidelines'],
    articleCount: 118,
    color: 'blue'
  }
];

export const INITIAL_NEWS_AUTHORS: NewsAuthorItem[] = [
  {
    id: 'auth-1',
    name: 'GlobalHealth Editorial Board',
    role: 'Admin',
    credentials: 'MD / MSc / MPH Editorial Group',
    affiliation: 'GlobalHealth Medical Knowledge Bureau',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
    email: 'editorial@globalhealth.org',
    bio: 'Multi-disciplinary medical editorial board specializing in peer-reviewed clinical synthesis and guideline tracking.',
    articleCount: 420
  },
  {
    id: 'auth-2',
    name: 'Dr. Alistair Vance',
    role: 'Chief Medical Officer',
    credentials: 'MD, FACC, FSCAI',
    affiliation: 'Johns Hopkins Interventional Cardiology',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    email: 'a.vance@globalhealth.org',
    bio: 'Interventional cardiologist and lipidology researcher focused on early atherosclerotic plaque regression and ApoB targets.',
    articleCount: 88
  },
  {
    id: 'auth-3',
    name: 'Dr. Elena Rostova',
    role: 'Medical Editor',
    credentials: 'MD, PhD (Neurobiology)',
    affiliation: 'Karolinska Institute & Harvard Brain Center',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813598-a28a3f89d385?auto=format&fit=crop&q=80&w=200',
    email: 'e.rostova@globalhealth.org',
    bio: 'Neuroscientist investigating astrocyte-driven glymphatic clearance, slow-wave sleep architecture, and Alzheimer prevention.',
    articleCount: 64
  },
  {
    id: 'auth-4',
    name: 'Dr. Marcus Thorne',
    role: 'Clinical Reviewer',
    credentials: 'MD, Endocrinologist & Diabetologist',
    affiliation: 'Mayo Clinic Department of Endocrinology',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
    email: 'm.thorne@globalhealth.org',
    bio: 'Clinical endocrinologist specializing in incretin dual-agonists, continuous glucose monitoring, and beta-cell preservation.',
    articleCount: 45
  },
  {
    id: 'auth-5',
    name: 'Sarah Chen, MPH',
    role: 'Health Journalist',
    credentials: 'MPH, Medical Science Writer',
    affiliation: 'Association of Health Care Journalists (AHCJ)',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    email: 's.chen@globalhealth.org',
    bio: 'Epidemiology researcher and science communicator with 12 years covering FDA phase 3 trials and WHO global health reports.',
    articleCount: 112
  }
];

export const INITIAL_NEWS_SOURCES: NewsSourceItem[] = [
  {
    id: 'src-nejm',
    name: 'New England Journal of Medicine (NEJM)',
    publicationType: 'Peer-Reviewed Journal',
    websiteUrl: 'https://www.nejm.org',
    credibilityScore: 99,
    impactFactor: '158.5',
    headquarters: 'Boston, MA, USA'
  },
  {
    id: 'src-lancet',
    name: 'The Lancet',
    publicationType: 'Peer-Reviewed Journal',
    websiteUrl: 'https://www.thelancet.com',
    credibilityScore: 99,
    impactFactor: '168.9',
    headquarters: 'London, UK'
  },
  {
    id: 'src-jama',
    name: 'Journal of the American Medical Association (JAMA)',
    publicationType: 'Peer-Reviewed Journal',
    websiteUrl: 'https://jamanetwork.com',
    credibilityScore: 98,
    impactFactor: '120.7',
    headquarters: 'Chicago, IL, USA'
  },
  {
    id: 'src-naturemed',
    name: 'Nature Medicine',
    publicationType: 'Peer-Reviewed Journal',
    websiteUrl: 'https://www.nature.com/nm',
    credibilityScore: 99,
    impactFactor: '82.9',
    headquarters: 'London, UK'
  },
  {
    id: 'src-who',
    name: 'World Health Organization (WHO)',
    publicationType: 'Global Health Body',
    websiteUrl: 'https://www.who.int',
    credibilityScore: 97,
    headquarters: 'Geneva, Switzerland'
  },
  {
    id: 'src-cdc',
    name: 'Centers for Disease Control and Prevention (CDC)',
    publicationType: 'Government Agency',
    websiteUrl: 'https://www.cdc.gov',
    credibilityScore: 97,
    headquarters: 'Atlanta, GA, USA'
  },
  {
    id: 'src-cell',
    name: 'Cell Metabolism',
    publicationType: 'Peer-Reviewed Journal',
    websiteUrl: 'https://www.cell.com/cell-metabolism',
    credibilityScore: 98,
    impactFactor: '29.0',
    headquarters: 'Cambridge, MA, USA'
  }
];

export const INITIAL_MEDIA_LIBRARY: NewsMediaItem[] = [
  {
    id: 'med-1',
    filename: 'mediterranean_dash_diet_vascular.jpg',
    url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800',
    altText: 'Mediterranean diet ingredients including extra virgin olive oil, wild berries, and fresh greens',
    caption: 'MIND and Mediterranean nutritional components proven to lower arterial pulse wave velocity.',
    license: 'Unsplash Clinical Editorial License',
    source: 'GlobalHealth Media Asset Stock',
    uploadedDate: '2026-08-12',
    uploadedBy: 'Dr. Elena Rostova',
    dimensions: '1920x1080',
    fileSize: '1.4 MB',
    usageCount: 6
  },
  {
    id: 'med-2',
    filename: 'continuous_glucose_monitor_sensor.jpg',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    altText: 'Continuous Glucose Monitor attached to arm measuring interstitial glycemic curve',
    caption: 'Minimally invasive biosensor tracking interstitial glucose dynamics.',
    license: 'Creative Commons CC-BY-NC',
    source: 'Medical Device Photographic Archive',
    uploadedDate: '2026-08-10',
    uploadedBy: 'Dr. Marcus Thorne',
    dimensions: '2048x1365',
    fileSize: '1.8 MB',
    usageCount: 4
  },
  {
    id: 'med-3',
    filename: 'cardiology_cardiovascular_artery.jpg',
    url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800',
    altText: 'Coronary artery microscopic cross section showing endothelial lining',
    caption: 'Endothelial nitric oxide synthase expression in healthy vascular wall.',
    license: 'Editorial Academic Commons',
    source: 'Harvard Medical Imaging Repository',
    uploadedDate: '2026-08-08',
    uploadedBy: 'Dr. Alistair Vance',
    dimensions: '2400x1600',
    fileSize: '2.1 MB',
    usageCount: 8
  },
  {
    id: 'med-4',
    filename: 'neurology_brain_sleep_glymphatic.jpg',
    url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800',
    altText: 'Brain neural imaging showing cerebrospinal fluid exchange pathways during deep sleep',
    caption: 'Aquaporin-4 astrocytic water channels flushing interstitial brain solutes during slow-wave sleep.',
    license: 'Unsplash Clinical Free',
    source: 'NeuroImage Scientific Archive',
    uploadedDate: '2026-08-06',
    uploadedBy: 'Dr. Elena Rostova',
    dimensions: '1920x1200',
    fileSize: '1.9 MB',
    usageCount: 5
  },
  {
    id: 'med-5',
    filename: 'microbiome_fermented_foods_kefir.jpg',
    url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
    altText: 'Fermented probiotic whole foods including kefir, kimchi, and active yogurt',
    caption: 'Live-microbe foods stimulating short-chain fatty acid butyrate synthesis.',
    license: 'GlobalHealth Creative Commons',
    source: 'Nutritional Biochemistry Asset Bank',
    uploadedDate: '2026-08-01',
    uploadedBy: 'Sarah Chen, MPH',
    dimensions: '1800x1200',
    fileSize: '1.2 MB',
    usageCount: 7
  },
  {
    id: 'med-6',
    filename: 'liquid_biopsy_genomic_sequencing.jpg',
    url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
    altText: 'Laboratory technician pipetting cell-free DNA methylation sample for MCED screen',
    caption: 'Targeted epigenetic sequencing for early-stage occult tumor detection.',
    license: 'Academic Research Fair Use',
    source: 'Oncology Diagnostics Center',
    uploadedDate: '2026-07-28',
    uploadedBy: 'Dr. Alistair Vance',
    dimensions: '2000x1333',
    fileSize: '2.4 MB',
    usageCount: 3
  }
];

export const INITIAL_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Breakthrough Study Confirms Mediterranean-DASH Diet Reduces Stroke Risk by 28%',
    shortDescription: 'A landmark 10-year prospective cohort study with 45,000 adults confirms dramatic neuro-vascular protection from high adherence to MIND dietary protocols.',
    source: 'Journal of the American College of Cardiology',
    originalPublication: 'JACC 2026;88(3):245-259',
    date: 'August 15, 2026',
    lastUpdated: 'August 15, 2026, 03:20 PM',
    category: 'Cardiovascular Research',
    subcategory: 'Arterial Health',
    newsType: 'Medical Breakthrough',
    summary: 'A 10-year prospective trial tracking 45,000 participants highlights significant neuro-vascular protection from combining berries, green leafy vegetables, wild-caught fish, and extra virgin olive oil.',
    content: `## Executive Summary & Clinical Findings

In an international prospective multicenter study involving **45,000 adult participants** followed across a comprehensive 10-year trajectory, researchers have documented a statistically robust **28% decrease in ischemic stroke incidence** among individuals scoring in the highest quartile of Mediterranean-DASH Intervention for Neurodegenerative Delay (MIND) dietary adherence.

### Key Mechanistic Discoveries
The protective mechanism is fundamentally biological and vascular:
1. **Endothelial Nitric Oxide Upregulation**: Polyphenol constituents (specifically delphinidins and oleocanthal) stimulate basal endothelial nitric oxide synthase (*eNOS*), reducing systemic pulse wave velocity.
2. **Carotid Intima-Media Thickness (CIMT) Deceleration**: Serial ultrasound evaluations demonstrated a 42% deceleration in age-related carotid arterial thickening.
3. **Inflammatory Cytokine Attenuation**: Plasma high-sensitivity C-reactive protein (hs-CRP) fell from a cohort baseline median of 2.6 mg/L to 1.1 mg/L.

> "Our data confirms that neurovascular health is profoundly malleable through sustained dietary patterns. The synergy of omega-3 long-chain fatty acids with polyphenol-rich plant structures exerts direct protection upon the microvasculature of the circle of Willis."
> — **Dr. Heather Montgomery, Lead Principal Investigator**

### Clinical Trial Methodology & Cohort
- **Cohort Size**: 45,182 participants aged 45–74 across 14 tertiary medical centers.
- **Primary Endpoint**: Time to first acute cerebrovascular event (ischemic or hemorrhagic stroke).
- **Hazard Ratio**: HR 0.72 (95% CI 0.64–0.81, p < 0.001) adjusted for baseline blood pressure, smoking, and statin use.

### Practical Nutritional Guidelines for Clinicians
Clinicians are advised to recommend the following daily minimum thresholds:
- Green leafy vegetables: Minimum 1.5 cups raw or 1 cup cooked daily
- Berries (blueberries/strawberries): At least 5 servings weekly
- Extra virgin olive oil: Primary dietary fat (minimum 25mL daily)
- Wild cold-water fish: 2–3 servings per week`,
    readTime: '4 min read',
    readTimeMinutes: 4,
    
    featuredImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Healthy Mediterranean diet olive oil and fresh leafy greens',
    imageCaption: 'Dietary synergy of extra virgin olive oil and cruciferous greens enhances microvascular compliance.',
    
    author: 'Dr. Alistair Vance',
    authorId: 'auth-2',
    medicalReviewer: 'Dr. Elena Rostova',
    medicalReviewerCredentials: 'MD, PhD (Neurobiology)',
    medicalReviewerId: 'auth-3',

    evidenceStatus: 'peer-reviewed',
    evidenceLevel: 'High',
    researchType: 'Prospective Cohort Study',
    studyDoi: '10.1016/j.jacc.2026.04.019',
    clinicalTrialId: 'NCT04829104',

    showMedicalDisclaimer: true,
    customDisclaimer: 'This summary is synthesized from peer-reviewed cardiology trials for educational purposes and should not replace individual stroke risk management from your attending physician.',

    seoTitle: 'Mediterranean-DASH Diet Lowers Stroke Risk by 28% — JACC Clinical Trial',
    metaDescription: '10-year prospective study confirms 28% stroke reduction via Mediterranean-DASH dietary adherence and endothelial nitric oxide upregulation.',
    slug: 'mediterranean-dash-diet-stroke-risk-reduction',
    focusKeywords: ['stroke prevention', 'MIND diet', 'cardiovascular health', 'olive oil polyphenols', 'endothelial function'],
    canonicalUrl: 'https://www.globalhealth.org/news/mediterranean-dash-diet-stroke-risk-reduction',

    relatedDiseases: ['Stroke', 'Hypertension', 'Atherosclerosis', 'Coronary Artery Disease'],
    relatedMedicines: ['Atorvastatin', 'Aspirin (Cardio)', 'Amlodipine'],
    relatedMedicalTests: ['Lipid Panel & ApoB', 'High-Sensitivity CRP', 'Carotid Doppler Ultrasound'],
    relatedNutritionTopics: ['Mediterranean Diet Guide', 'Omega-3 Rich Foods', 'Polyphenol Bioavailability'],
    relatedArticleIds: ['news-8', 'news-10'],

    status: 'published',
    visibility: 'Public',
    publishTiming: 'immediate',
    
    isFeatured: true,
    featurePriority: 1,
    featuredUntil: '2026-09-01',
    isBreaking: false,
    isTrending: true,

    viewsCount: 14250,
    uniqueVisitors: 11420,
    averageReadTime: '4m 12s',
    completionRate: 74,
    sharesCount: 520,
    savesCount: 1480,

    revisions: [
      {
        version: 3,
        date: 'Aug 15, 2026, 03:20 PM',
        editedBy: 'Dr. Elena Rostova',
        authorRole: 'Medical Editor',
        changeSummary: 'Added carotid intima-media thickness statistics and hazard ratio confidence intervals.',
        titleSnapshot: 'Breakthrough Study Confirms Mediterranean-DASH Diet Reduces Stroke Risk by 28%',
        contentSnapshot: 'Full text validated with clinical trial endpoints.'
      },
      {
        version: 2,
        date: 'Aug 14, 2026, 11:15 AM',
        editedBy: 'Dr. Alistair Vance',
        authorRole: 'Chief Medical Officer',
        changeSummary: 'Updated lead investigator quotes and verified DOI number.',
        titleSnapshot: 'Breakthrough Study Confirms Mediterranean-DASH Diet Reduces Stroke Risk by 28%',
        contentSnapshot: 'Initial clinical synthesis and dietary breakdown.'
      },
      {
        version: 1,
        date: 'Aug 13, 2026, 09:00 AM',
        editedBy: 'Sarah Chen, MPH',
        authorRole: 'Health Journalist',
        changeSummary: 'Initial draft from JACC pre-print release.',
        titleSnapshot: 'New Study: Mediterranean Diet Cuts Stroke',
        contentSnapshot: 'Preliminary draft.'
      }
    ],
    reviewComments: [
      {
        id: 'rev-1',
        reviewerName: 'Dr. Elena Rostova',
        reviewerRole: 'Medical Reviewer',
        timestamp: 'Aug 15, 2026, 02:45 PM',
        type: 'approved',
        comment: 'Methodology and hazard ratio confidence intervals verified against JACC published data. Approved for public dissemination.',
        resolved: true
      }
    ],
    tags: ['Cardiology', 'Stroke Prevention', 'MIND Diet', 'Clinical Trial', 'Nutrition']
  },
  {
    id: 'news-2',
    title: 'Continuous Glucose Monitors in Non-Diabetics: Postprandial Spikes Induce Transient Endothelial Dysfunction',
    shortDescription: 'Multi-center Nature Medicine biosensor study reveals meal sequencing (fiber and protein before carbs) blunts oxidative stress in normoglycemic people.',
    source: 'Nature Medicine',
    originalPublication: 'Nat Med 2026;32:1102-1118',
    date: 'August 14, 2026',
    lastUpdated: 'August 14, 2026, 05:40 PM',
    category: 'Metabolic & Endocrinology',
    subcategory: 'Continuous Glucose Monitoring',
    newsType: 'Research Update',
    summary: 'Over-the-counter biosensors enable real-time tracking, showing that rapid postprandial glucose excursions provoke transient oxidative stress even in normoglycemic individuals.',
    content: `## High-Frequency Biosensing in Normoglycemic Cohorts

Continuous Glucose Monitoring (CGM) sensors deployed in non-diabetic athletic and sedentary populations have demonstrated that **rapid glycemic velocity (>2.5 mg/dL/min)** triggers transient microvascular vasoconstriction and reactive oxygen species generation, independent of baseline HbA1c.

### Key Study Insights
- **Meal Sequencing Effect**: Consuming soluble dietary fiber and protein 10 minutes prior to complex carbohydrates reduced peak postprandial glucose by 38% and blunted peak insulin demand by 44%.
- **Nocturnal Glycemic Stability**: Alcohol consumed within 2 hours of bedtime induced elevated nocturnal glycemic variability and disrupted restorative slow-wave sleep.

### Clinical Takeaway
For health optimization, the focus transitions from absolute caloric restriction to **mitigating glycemic amplitude** through whole-food macronutrient order.`,
    readTime: '3 min read',
    readTimeMinutes: 3,

    featuredImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Continuous Glucose Monitor biosensor on upper arm',
    imageCaption: 'Real-time interstitial glucose telemetry in preventive metabolic science.',

    author: 'Dr. Marcus Thorne',
    authorId: 'auth-4',
    medicalReviewer: 'Dr. Alistair Vance',
    medicalReviewerCredentials: 'MD, FACC',
    medicalReviewerId: 'auth-2',

    evidenceStatus: 'peer-reviewed',
    evidenceLevel: 'High',
    researchType: 'Randomized Controlled Trial',
    studyDoi: '10.1038/s41591-026-03482-1',
    clinicalTrialId: 'NCT05128394',

    showMedicalDisclaimer: true,
    seoTitle: 'CGM in Non-Diabetics: Postprandial Glucose & Endothelial Health — Nature Medicine',
    metaDescription: 'Nature Medicine study demonstrates how meal sequencing blunts glucose spikes and preserves vascular elasticity in non-diabetics.',
    slug: 'cgm-non-diabetic-postprandial-glucose-spikes',
    focusKeywords: ['CGM', 'continuous glucose monitoring', 'meal sequencing', 'metabolic flexibility', 'endothelial health'],

    relatedDiseases: ['Prediabetes', 'Type 2 Diabetes', 'Metabolic Syndrome', 'Insulin Resistance'],
    relatedMedicines: ['Metformin', 'Semaglutide', 'Berberine'],
    relatedMedicalTests: ['Fasting Blood Glucose', 'Hemoglobin A1c', 'Fasting Insulin & HOMA-IR'],
    relatedNutritionTopics: ['Low Glycemic Meal Sequencing', 'Soluble Dietary Fiber', 'Postprandial Walking'],
    relatedArticleIds: ['news-1', 'news-3'],

    status: 'published',
    visibility: 'Public',
    publishTiming: 'immediate',

    isFeatured: false,
    isBreaking: false,
    isTrending: true,

    viewsCount: 9840,
    uniqueVisitors: 7810,
    averageReadTime: '3m 45s',
    completionRate: 69,
    sharesCount: 310,
    savesCount: 920,
    tags: ['CGM', 'Metabolic Health', 'Glucose Spikes', 'Preventive Medicine']
  },
  {
    id: 'news-3',
    title: 'Large-Scale Trial Validates GLP-1/GIP Dual Agonists for Cardio-Renal Protection Beyond Weight Loss',
    shortDescription: 'NEJM multi-national trial highlights 22% MACE reduction and renal glomerular stabilization via direct anti-inflammatory receptor pathways.',
    source: 'New England Journal of Medicine',
    originalPublication: 'N Engl J Med 2026;395:481-496',
    date: 'August 13, 2026',
    lastUpdated: 'August 13, 2026, 04:10 PM',
    category: 'Metabolic & Endocrinology',
    subcategory: 'GLP-1 Therapeutics',
    newsType: 'Drug Safety',
    summary: 'Landmark trial demonstrates 22% reduction in major adverse cardiovascular events (MACE) and deceleration of glomerular filtration rate decline in chronic kidney disease patients.',
    content: `## Incretin Biology & Organ Protection

In a pivotal double-blind trial comprising **18,500 patients with established cardiometabolic disease**, dual GLP-1/GIP receptor co-agonism exhibited marked cardioprotective and nephroprotective benefits that persisted after mathematical adjustment for total weight loss.

### Principal Outcomes:
- **Major Adverse Cardiovascular Events (MACE)**: 22% relative risk reduction (HR 0.78, p < 0.001).
- **Renal Preservation**: Decelerated eGFR slope decline from -3.8 mL/min/1.73m²/year to -1.2 mL/min/1.73m²/year.
- **Natriuresis**: Stimulated proximal tubular sodium excretion without provoking electrolyte depletion.`,
    readTime: '5 min read',
    readTimeMinutes: 5,

    featuredImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Pharmaceutical research laboratory and cardiology diagnostics',
    imageCaption: 'Dual incretin receptor agonists showing direct nephron and vascular wall stabilization.',

    author: 'Dr. Marcus Thorne',
    authorId: 'auth-4',
    medicalReviewer: 'Dr. Alistair Vance',
    medicalReviewerCredentials: 'MD, FACC',
    medicalReviewerId: 'auth-2',

    evidenceStatus: 'peer-reviewed',
    evidenceLevel: 'High',
    researchType: 'Randomized Controlled Trial',
    studyDoi: '10.1056/NEJMoa2601928',
    clinicalTrialId: 'NCT04918231',

    showMedicalDisclaimer: true,
    seoTitle: 'GLP-1/GIP Agonists Cardio-Renal Protection — NEJM Clinical Study',
    metaDescription: 'NEJM trial validates 22% MACE reduction and renal glomerular stabilization with dual incretin agonists beyond weight loss.',
    slug: 'glp1-gip-cardio-renal-protection-trial',
    focusKeywords: ['GLP-1', 'GIP agonists', 'tirzepatide', 'cardiorenal protection', 'kidney health'],

    relatedDiseases: ['Chronic Kidney Disease', 'Type 2 Diabetes', 'Hypertension', 'Heart Failure'],
    relatedMedicines: ['Tirzepatide', 'Semaglutide', 'Empagliflozin', 'Dapagliflozin'],
    relatedMedicalTests: ['Estimated GFR (eGFR)', 'Urine Albumin-to-Creatinine Ratio (uACR)', 'Comprehensive Metabolic Panel'],
    relatedNutritionTopics: ['Renal Friendly Nutrition', 'Protein Satiety Diet'],
    relatedArticleIds: ['news-1', 'news-2'],

    status: 'published',
    visibility: 'Public',
    publishTiming: 'immediate',

    isFeatured: true,
    featurePriority: 2,
    isBreaking: false,
    isTrending: true,

    viewsCount: 11200,
    uniqueVisitors: 9400,
    averageReadTime: '5m 10s',
    completionRate: 81,
    sharesCount: 440,
    savesCount: 1210,
    tags: ['GLP-1', 'Cardiology', 'Nephrology', 'Pharmacology']
  },
  {
    id: 'news-4',
    title: 'FDA Approves First Next-Generation Multi-Cancer Liquid Biopsy for Asymptomatic Screening',
    shortDescription: 'Cell-free DNA methylation blood test demonstrates 92% specificity across 12 organ systems with tissue of origin localization.',
    source: 'Journal of Clinical Oncology',
    originalPublication: 'J Clin Oncol 2026;44:2890-2905',
    date: 'August 15, 2026',
    lastUpdated: 'August 15, 2026, 06:10 PM',
    category: 'Oncology & Diagnostics',
    subcategory: 'Multi-Cancer Early Detection',
    newsType: 'Medical Breakthrough',
    summary: 'Cell-free DNA (cfDNA) methylation profiling accurately pinpointed early-stage malignancy origins across 12 organ systems prior to symptomatic clinical presentation.',
    content: `## Breakthrough in Early Cancer Interception

The US Food & Drug Administration (FDA) has granted formal premarket approval to the first broad-panel **Multi-Cancer Early Detection (MCED)** blood test for adults aged 50 and older at elevated risk.

### Clinical Diagnostic Performance:
- **Specificity**: 92.4% with minimal false-positive rate.
- **Tissue of Origin Accuracy**: Correctly identified primary organ site in 89.2% of true-positive signal cases.
- **High-Mortality Cancers**: Over 70% sensitivity in stage I–II pancreatic, esophageal, ovarian, and hepatic malignancies.`,
    readTime: '5 min read',
    readTimeMinutes: 5,

    featuredImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Molecular diagnostic laboratory testing cell free DNA',
    imageCaption: 'Targeted epigenetic sequencing for early-stage occult tumor detection.',

    author: 'Sarah Chen, MPH',
    authorId: 'auth-5',
    medicalReviewer: 'Dr. Alistair Vance',
    medicalReviewerCredentials: 'MD, FACC',
    medicalReviewerId: 'auth-2',

    evidenceStatus: 'government',
    evidenceLevel: 'High',
    researchType: 'Prospective Cohort Study',
    studyDoi: '10.1200/JCO.2026.88.0019',
    clinicalTrialId: 'NCT05298102',

    showMedicalDisclaimer: true,
    seoTitle: 'FDA Approves Multi-Cancer Early Detection Liquid Biopsy Blood Test',
    metaDescription: 'FDA grants approval for multi-cancer liquid biopsy screening with 92% specificity across 12 organ systems.',
    slug: 'fda-approves-multi-cancer-liquid-biopsy-mced',
    focusKeywords: ['MCED blood test', 'liquid biopsy', 'early cancer detection', 'cfDNA methylation'],

    relatedDiseases: ['Pancreatic Cancer', 'Colorectal Cancer', 'Ovarian Cancer', 'Liver Cancer'],
    relatedMedicines: ['Pembrolizumab', 'Targeted Therapeutics'],
    relatedMedicalTests: ['Multi-Cancer Early Detection (MCED)', 'Complete Blood Count (CBC)', 'CEA & CA-19-9 Markers'],
    relatedNutritionTopics: ['Antioxidant Rich Foods', 'Cancer Prevention Diet'],
    relatedArticleIds: ['news-1'],

    status: 'published',
    visibility: 'Public',
    publishTiming: 'immediate',

    isFeatured: true,
    featurePriority: 3,
    isBreaking: true,
    breakingExpires: '2026-08-18T23:59:59Z',
    isTrending: true,

    viewsCount: 22400,
    uniqueVisitors: 17800,
    averageReadTime: '4m 50s',
    completionRate: 88,
    sharesCount: 890,
    savesCount: 2150,
    tags: ['Oncology', 'Liquid Biopsy', 'Early Screening', 'FDA Approval', 'Genomics']
  },
  {
    id: 'news-5',
    title: 'Sleep Architecture & Glymphatic Waste Clearance: Deep Slow-Wave N3 Essential for Amyloid-Beta Flushing',
    shortDescription: 'High-resolution neuroimaging confirms astrocytic aquaporin-4 (AQP4) water channels facilitate maximal cerebral fluid turnover during non-REM stage 3.',
    source: 'The Lancet Neurology',
    originalPublication: 'Lancet Neurol 2026;25:704-719',
    date: 'August 11, 2026',
    lastUpdated: 'August 12, 2026, 01:20 PM',
    category: 'Neuroscience & Longevity',
    subcategory: 'Sleep Architecture',
    newsType: 'Research Update',
    summary: 'High-resolution neuroimaging confirms that astrocytic aquaporin-4 (AQP4) water channels facilitate maximal interstitial cerebral fluid exchange during non-REM stage 3 sleep.',
    content: `## Astrocytic Channels and Cerebral Solute Clearance

Neuroscientists utilizing ultra-high-field 7-Tesla MRI have visualized real-time cerebrospinal fluid (CSF) pulsatile flow through interstitial parenchyma during delta-frequency slow-wave sleep.

### Core Discoveries:
1. **Interstitial Expansion**: Brain extracellular space expands by **60%** during stage N3 slow-wave sleep.
2. **Tau & Amyloid Elimination**: Interstitial concentrations of monomeric tau and amyloid-beta(1-42) dropped by 34% during undisturbed slow-wave cycles.
3. **Autonomic Balance**: Elevated nocturnal sympathetic tone (e.g. from late caffeine, alcohol, or sleep apnea) severely diminishes glymphatic pump volume.`,
    readTime: '4 min read',
    readTimeMinutes: 4,

    featuredImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Neuroimaging brain slow-wave sleep activity',
    imageCaption: 'Glymphatic flushing active during delta wave N3 restorative sleep.',

    author: 'Dr. Elena Rostova',
    authorId: 'auth-3',
    medicalReviewer: 'Dr. Alistair Vance',
    medicalReviewerCredentials: 'MD, FACC',
    medicalReviewerId: 'auth-2',

    evidenceStatus: 'peer-reviewed',
    evidenceLevel: 'High',
    researchType: 'Prospective Cohort Study',
    studyDoi: '10.1016/S1474-4422(26)00118-9',
    clinicalTrialId: 'NCT04778190',

    showMedicalDisclaimer: true,
    seoTitle: 'Deep Slow-Wave Sleep Clears Amyloid-Beta — The Lancet Neurology',
    metaDescription: 'New neuroimaging shows how stage N3 sleep activates the glymphatic system to flush neurotoxic waste and protect brain longevity.',
    slug: 'slow-wave-sleep-glymphatic-amyloid-clearance',
    focusKeywords: ['glymphatic system', 'slow wave sleep', 'amyloid beta', 'Alzheimer prevention', 'brain health'],

    relatedDiseases: ['Alzheimer Disease', 'Mild Cognitive Impairment', 'Insomnia', 'Obstructive Sleep Apnea'],
    relatedMedicines: ['Melatonin', 'Magnesium L-Threonate'],
    relatedMedicalTests: ['Polysomnography (Sleep Study)', 'Brain MRI', 'Plasma p-Tau 217'],
    relatedNutritionTopics: ['Sleep Supporting Micronutrients', 'Chamomile & Glycine'],
    relatedArticleIds: ['news-1', 'news-9'],

    status: 'published',
    visibility: 'Public',
    publishTiming: 'immediate',

    isFeatured: false,
    isBreaking: false,
    isTrending: true,

    viewsCount: 8950,
    uniqueVisitors: 7100,
    averageReadTime: '4m 05s',
    completionRate: 72,
    sharesCount: 380,
    savesCount: 890,
    tags: ['Sleep Medicine', 'Glymphatic System', 'Neuroscience', 'Alzheimer Prevention']
  },
  {
    id: 'news-6',
    title: 'Trial of Customized mRNA Personalized Melanoma & Pancreatic Cancer Vaccines Enters Phase III',
    shortDescription: 'Combining neoantigen-targeted mRNA vaccines with anti-PD-1 checkpoint inhibitors demonstrates persistent recurrence-free survival in high-risk patients.',
    source: 'New England Journal of Medicine',
    originalPublication: 'N Engl J Med 2026;395:612-628',
    date: 'August 16, 2026',
    lastUpdated: 'August 16, 2026, 09:30 AM',
    category: 'Oncology & Diagnostics',
    subcategory: 'Cancer Vaccines',
    newsType: 'Medical Breakthrough',
    summary: 'Personalized neoantigen mRNA vaccine technology designed from patient tumor exome sequencing yields 49% reduction in cancer recurrence or death in phase IIb follow-up.',
    content: `## Neoantigen mRNA Immunotherapy Phase III Launch

The international Phase III clinical trial for patient-specific individualized neoantigen therapy (INT) has officially opened recruitment across 85 global academic oncology centers.

### Mechanism of Action:
- Rapid next-generation exome sequencing identifies up to 34 patient-specific mutated tumor peptides.
- Synthetic lipid nanoparticle mRNA prompts high-avidity CD8+ cytotoxic T-lymphocyte clonal expansion.
- Combined with immune checkpoint blockade (pembrolizumab), memory T-cells eradicate occult microscopic metastases.`,
    readTime: '4 min read',
    readTimeMinutes: 4,

    featuredImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Immunotherapy research vaccine trial development',
    imageCaption: 'Lipid nanoparticle neoantigen mRNA formulation for targeted oncology.',

    author: 'Sarah Chen, MPH',
    authorId: 'auth-5',
    medicalReviewer: 'Dr. Elena Rostova',
    medicalReviewerCredentials: 'MD, PhD (Neurobiology)',
    medicalReviewerId: 'auth-3',

    evidenceStatus: 'peer-reviewed',
    evidenceLevel: 'High',
    researchType: 'Randomized Controlled Trial',
    studyDoi: '10.1056/NEJMoa2603841',
    clinicalTrialId: 'NCT05891240',

    showMedicalDisclaimer: true,
    seoTitle: 'Personalized mRNA Cancer Vaccines Enter Phase III Clinical Trials — NEJM',
    metaDescription: 'Phase III clinical trials begin for personalized mRNA neoantigen vaccines targeting melanoma and solid tumors.',
    slug: 'mrna-personalized-cancer-vaccine-phase-3',
    focusKeywords: ['mRNA cancer vaccine', 'neoantigen therapy', 'melanoma trial', 'immunotherapy', 'oncology'],

    relatedDiseases: ['Melanoma', 'Pancreatic Cancer', 'Non-Small Cell Lung Cancer'],
    relatedMedicines: ['Pembrolizumab', 'Nivolumab'],
    relatedMedicalTests: ['Tumor Next-Gen Sequencing (NGS)', 'PD-L1 Expression Assay'],
    relatedNutritionTopics: ['Immune Support Nutrition'],
    relatedArticleIds: ['news-4'],

    status: 'pending_medical',
    visibility: 'Public',
    publishTiming: 'scheduled',
    scheduledDate: '2026-08-18',
    scheduledTime: '09:00 AM',
    timezone: 'America/New_York',

    isFeatured: false,
    isBreaking: false,
    isTrending: false,

    viewsCount: 0,
    uniqueVisitors: 0,
    averageReadTime: '0m',
    completionRate: 0,
    sharesCount: 0,
    savesCount: 0,

    revisions: [
      {
        version: 1,
        date: 'Aug 16, 2026, 09:30 AM',
        editedBy: 'Sarah Chen, MPH',
        authorRole: 'Health Journalist',
        changeSummary: 'Submitted draft for Medical Review following ASCO press briefing.',
        titleSnapshot: 'Trial of Customized mRNA Personalized Melanoma Cancer Vaccines Enters Phase III',
        contentSnapshot: 'Draft article awaiting Dr. Rostova verification.'
      }
    ],
    reviewComments: [
      {
        id: 'rev-2',
        reviewerName: 'Dr. Elena Rostova',
        reviewerRole: 'Medical Reviewer',
        timestamp: 'Aug 16, 2026, 10:15 AM',
        type: 'changes_requested',
        comment: 'Please emphasize that Phase III is actively enrolling and distinguish Phase IIb recurrence-free survival data from overall survival endpoints before final approval.',
        resolved: false
      }
    ],
    tags: ['mRNA', 'Cancer Vaccine', 'Immunotherapy', 'Phase III Trial', 'Oncology']
  },
  {
    id: 'news-7',
    title: 'Apolipoprotein B (ApoB) Established as Superior Atherogenic Biomarker Over Standard LDL-C',
    shortDescription: 'International consensus guidelines mandate total atherogenic particle quantification via ApoB in patients with metabolic syndrome, elevated triglycerides, and obesity.',
    source: 'European Heart Journal',
    originalPublication: 'Eur Heart J 2026;47:1980-1996',
    date: 'August 10, 2026',
    lastUpdated: 'August 10, 2026, 02:00 PM',
    category: 'Cardiovascular Research',
    subcategory: 'Lipidology & ApoB',
    newsType: 'Research Update',
    summary: 'International cardiology consensus confirms that measuring total circulating particle number via ApoB resolves discordance in patients with metabolic syndrome, diabetes, and hypertriglyceridemia.',
    content: `## Particle Count vs Cholesterol Concentration

Cardiology clinical guideline committees in Europe and North America have formally updated cardiovascular risk assessment algorithms, recommending **Apolipoprotein B (ApoB)** as the primary target of lipid-lowering therapy in discordant patients.

### Why ApoB Outperforms LDL-C:
- **1 Particle = 1 ApoB Molecule**: Each atherogenic lipoprotein (VLDL, IDL, Small Dense LDL, Large LDL) carries exactly one ApoB-100 molecule.
- **Discordance in Insulin Resistance**: In hypertriglyceridemia, LDL particles become small and depleted of cholesterol esters; thus standard LDL-C appears deceptively normal while total atherogenic particle count (ApoB) remains dangerously high.
- **Guideline Targets**:
  - High Risk: ApoB < 70 mg/dL (1.8 mmol/L)
  - Very High Risk: ApoB < 55 mg/dL (1.4 mmol/L)`,
    readTime: '4 min read',
    readTimeMinutes: 4,

    featuredImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Lipidology biomarker test analysis',
    imageCaption: 'ApoB directly quantifies total arterial wall penetration burden.',

    author: 'Dr. Alistair Vance',
    authorId: 'auth-2',
    medicalReviewer: 'Dr. Marcus Thorne',
    medicalReviewerCredentials: 'MD, Endocrinologist',
    medicalReviewerId: 'auth-4',

    evidenceStatus: 'professional-org',
    evidenceLevel: 'High',
    researchType: 'Clinical Practice Guideline',
    studyDoi: '10.1093/eurheartj/ehz2026.089',

    showMedicalDisclaimer: true,
    seoTitle: 'ApoB vs LDL-C: Cardiovascular Risk Biomarker Guidelines — European Heart Journal',
    metaDescription: 'Cardiology guidelines confirm ApoB as the superior biomarker for atherogenic risk stratification over LDL-C in metabolic syndrome.',
    slug: 'apob-vs-ldl-c-atherogenic-biomarker-consensus',
    focusKeywords: ['ApoB', 'LDL-C', 'lipidology', 'atherosclerosis', 'cardiovascular prevention'],

    relatedDiseases: ['Atherosclerosis', 'Coronary Artery Disease', 'Hyperlipidemia', 'Metabolic Syndrome'],
    relatedMedicines: ['Atorvastatin', 'Rosuvastatin', 'Ezetimibe', 'PCSK9 Inhibitors'],
    relatedMedicalTests: ['Apolipoprotein B (ApoB)', 'Lipoprotein(a)', 'Standard Lipid Panel', 'Coronary Calcium Scan (CAC)'],
    relatedNutritionTopics: ['Saturated Fat & ApoB Impact', 'Soluble Fiber & Phytosterols'],
    relatedArticleIds: ['news-1', 'news-2'],

    status: 'published',
    visibility: 'Public',
    publishTiming: 'immediate',

    isFeatured: false,
    isBreaking: false,
    isTrending: false,

    viewsCount: 7600,
    uniqueVisitors: 6100,
    averageReadTime: '3m 50s',
    completionRate: 67,
    sharesCount: 290,
    savesCount: 780,
    tags: ['ApoB', 'Cardiology', 'Lipids', 'Preventive Health']
  },
  {
    id: 'news-8',
    title: 'Vitamin D3 & Magnesium Synergy: Bioactive Conversion Requires Adequate Intracellular Mg2+',
    shortDescription: 'Nutritional biochemistry trials confirm that high-dose cholecalciferol cannot convert into active calcitriol when intracellular magnesium is sub-optimal.',
    source: 'The American Journal of Clinical Nutrition',
    originalPublication: 'Am J Clin Nutr 2026;124:412-427',
    date: 'August 08, 2026',
    lastUpdated: 'August 08, 2026, 11:00 AM',
    category: 'Nutrition & Microbiome',
    subcategory: 'Dietary Electrolytes',
    newsType: 'Research Update',
    summary: 'High-dose cholecalciferol supplementation fails to optimize active hormonal Vitamin D status in magnesium-deficient individuals due to hepatic 25-hydroxylase dependency.',
    content: `## Enzymatic Cofactor Dependencies in Micronutrient Therapy

A randomized cross-over clinical trial has demonstrated that all key enzymatic steps governing Vitamin D activation and regulation require magnesium as an essential catalytic cofactor.

### Biochemical Mechanism:
- **Hepatic 25-Hydroxylation (*CYP2R1*)**: Converts Vitamin D3 to 25(OH)D in a magnesium-dependent manner.
- **Renal 1-Alpha Hydroxylation (*CYP27B1*)**: Converts 25(OH)D to active hormonal calcitriol 1,25(OH)2D.
- **Vitamin D Binding Protein (VDBP)**: Transports Vitamin D metabolites through circulation and requires magnesium to maintain binding affinity.`,
    readTime: '3 min read',
    readTimeMinutes: 3,

    featuredImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Nutritional biochemistry micronutrient food sources',
    imageCaption: 'Magnesium-rich whole foods required for enzymatic Vitamin D3 activation.',

    author: 'Sarah Chen, MPH',
    authorId: 'auth-5',
    medicalReviewer: 'Dr. Marcus Thorne',
    medicalReviewerCredentials: 'MD, Endocrinologist',
    medicalReviewerId: 'auth-4',

    evidenceStatus: 'peer-reviewed',
    evidenceLevel: 'Moderate',
    researchType: 'Randomized Controlled Trial',
    studyDoi: '10.1093/ajcn/nqac2026.012',

    showMedicalDisclaimer: true,
    seoTitle: 'Vitamin D3 and Magnesium Synergy: Conversion Biochemistry — AJCN',
    metaDescription: 'Clinical trial shows why Vitamin D3 requires magnesium for active conversion into calcitriol and prevents pseudo-resistance.',
    slug: 'vitamin-d3-magnesium-synergy-conversion',
    focusKeywords: ['vitamin D3', 'magnesium', 'calcitriol', 'micronutrient synergy', 'biochemistry'],

    relatedDiseases: ['Osteopenia & Osteoporosis', 'Vitamin D Deficiency', 'Hypomagnesemia'],
    relatedMedicines: ['Cholecalciferol (Vitamin D3)', 'Magnesium Glycinate', 'Magnesium Citrate'],
    relatedMedicalTests: ['25-Hydroxy Vitamin D', 'Serum Magnesium & RBC Magnesium', 'Serum Calcium & PTH'],
    relatedNutritionTopics: ['Magnesium Rich Foods', 'Sunshine & Vitamin D Synthesis'],
    relatedArticleIds: ['news-1', 'news-5'],

    status: 'published',
    visibility: 'Public',
    publishTiming: 'immediate',

    isFeatured: false,
    isBreaking: false,
    isTrending: false,

    viewsCount: 6400,
    uniqueVisitors: 5200,
    averageReadTime: '3m 15s',
    completionRate: 64,
    sharesCount: 220,
    savesCount: 650,
    tags: ['Vitamin D', 'Magnesium', 'Nutrition Science', 'Endocrinology']
  },
  {
    id: 'news-9',
    title: 'Draft: Emerging Clinical Safety Data for Oral Inhaled Insulin Delivery Formulations',
    shortDescription: 'Review of pulmonary function safety metrics and pharmacokinetic speed of ultra-rapid inhaled mealtime insulin powders.',
    source: 'Global Medical Device Regulatory Watch',
    date: 'August 16, 2026',
    lastUpdated: 'August 16, 2026, 01:15 PM',
    category: 'Metabolic & Endocrinology',
    subcategory: 'Diabetes Care',
    newsType: 'Medicine Update',
    summary: 'Investigating whether ultra-rapid inhaled insulin powders mimic natural first-phase insulin release without provoking pulmonary bronchoconstriction.',
    content: `## Inhaled Insulin Pharmacokinetics Draft

This draft explores 2-year spirometry safety data on ultra-rapid acting inhaled mealtime insulin.

### Working Outline:
1. First-phase insulin secretion replication within 12 minutes.
2. Spirometry FEV1 stability across 24-month monitoring cohorts.
3. Contraindications in patients with active asthma or COPD history.`,
    readTime: '3 min read',
    readTimeMinutes: 3,

    author: 'Dr. Marcus Thorne',
    authorId: 'auth-4',
    medicalReviewer: 'Dr. Alistair Vance',
    medicalReviewerId: 'auth-2',

    evidenceStatus: 'preliminary',
    evidenceLevel: 'Moderate',
    researchType: 'Observational Study',

    showMedicalDisclaimer: true,
    seoTitle: 'Inhaled Insulin Safety & Pharmacokinetics Review',
    metaDescription: 'Draft review of inhaled insulin delivery kinetics and pulmonary safety data.',
    slug: 'inhaled-insulin-pulmonary-safety-review',
    focusKeywords: ['inhaled insulin', 'diabetes tech', 'pharmacokinetics', 'spirometry'],

    status: 'draft',
    visibility: 'Internal Draft',
    publishTiming: 'immediate',

    isFeatured: false,
    isBreaking: false,
    isTrending: false,

    viewsCount: 0,
    uniqueVisitors: 0,
    sharesCount: 0,
    savesCount: 0,

    revisions: [
      {
        version: 1,
        date: 'Aug 16, 2026, 01:15 PM',
        editedBy: 'Dr. Marcus Thorne',
        authorRole: 'Clinical Reviewer',
        changeSummary: 'Initial draft created in CMS.',
        titleSnapshot: 'Draft: Emerging Clinical Safety Data for Oral Inhaled Insulin',
        contentSnapshot: 'Preliminary outline with spirometry notes.'
      }
    ],
    tags: ['Draft', 'Insulin', 'Diabetes Tech', 'Pharmacology']
  },
  {
    id: 'news-10',
    title: 'Archived: Historical Meta-Analysis on Low-Fat vs Low-Carbohydrate Interventions (2015-2022)',
    shortDescription: 'Archived landmark systematic review evaluating isocaloric macronutrient permutations on resting metabolic rate and lipid sub-fractions.',
    source: 'Journal of the American Medical Association (JAMA)',
    date: 'July 10, 2024',
    lastUpdated: 'August 01, 2026',
    category: 'Nutrition & Microbiome',
    subcategory: 'Cardiometabolic Diets',
    newsType: 'Research Update',
    summary: 'Archived systematic review comparing 60 randomized isocaloric trials found that dietary adherence and whole-food quality superseded absolute macronutrient percentage splits.',
    content: `## Archived Review Document

*Note: This article has been moved to archival status in accordance with our 2-year clinical literature updating policy.*

### Historical Finding Summary:
Isocaloric feeding chamber studies confirmed that when protein and caloric intake are strictly matched, differences in 24-hour fat oxidation and metabolic expenditure between low-fat and low-carb diets are clinically minimal compared to the impact of processed food elimination and dietary adherence.`,
    readTime: '3 min read',
    readTimeMinutes: 3,

    author: 'GlobalHealth Editorial Board',
    authorId: 'auth-1',
    medicalReviewer: 'Dr. Alistair Vance',
    medicalReviewerId: 'auth-2',

    evidenceStatus: 'peer-reviewed',
    evidenceLevel: 'Moderate',
    researchType: 'Systematic Review & Meta-Analysis',

    showMedicalDisclaimer: true,
    seoTitle: 'Archived: Low-Fat vs Low-Carb Systematic Review — JAMA',
    metaDescription: 'Archived 60-study systematic review on macronutrient balance and metabolic rate.',
    slug: 'archived-low-fat-vs-low-carb-meta-analysis',
    focusKeywords: ['macronutrients', 'dietary adherence', 'metabolism', 'archived'],

    status: 'archived',
    visibility: 'Public',
    publishTiming: 'immediate',

    isFeatured: false,
    isBreaking: false,
    isTrending: false,

    viewsCount: 3820,
    uniqueVisitors: 3100,
    sharesCount: 85,
    savesCount: 240,
    tags: ['Archived', 'Nutrition', 'Meta-Analysis']
  }
];
