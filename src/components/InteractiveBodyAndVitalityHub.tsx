import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Brain, 
  HeartPulse, 
  Wind, 
  Stethoscope, 
  Droplets,
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Bot, 
  Calculator, 
  Award, 
  Zap,
  CalendarCheck
} from 'lucide-react';
import { NavigationTab } from '../types';
import { HomeNewsQuestionSpotlight } from './HomeNewsQuestionSpotlight';
import { useLocalization } from '../context/LocalizationContext';

interface InteractiveBodyAndVitalityHubProps {
  onTabChange: (tab: NavigationTab) => void;
  onOpenNewsArticle?: (articleId: string) => void;
}

export const InteractiveBodyAndVitalityHub: React.FC<InteractiveBodyAndVitalityHubProps> = ({ onTabChange, onOpenNewsArticle }) => {
  const { t, formatNumber, isRTL } = useLocalization();

  // 1. Organ Systems & Body Map State
  const [selectedOrgan, setSelectedOrgan] = useState<string>('heart');

  const organSystems = [
    {
      id: 'heart',
      nameKey: 'bodyExplorer.heart',
      nameFallback: 'Cardiovascular & Heart',
      icon: <HeartPulse className="h-5 w-5 text-red-600" />,
      symptoms: ['Chest pressure or tightness', 'Palpitations & skipped beats', 'Shortness of breath on exertion', 'Leg swelling (Edema)', 'Unexplained fatigue'],
      tests: ['Lipid Panel (Cholesterol)', 'ECG / Electrocardiogram', 'High-Sensitivity CRP', 'Troponin I Biomarker'],
      specialist: 'Cardiologist',
      advice: 'Regular 150 min/week aerobic exercise, sodium reduction (<2000mg/day), and blood pressure monitoring significantly safeguard arterial health.'
    },
    {
      id: 'brain',
      nameKey: 'bodyExplorer.brain',
      nameFallback: 'Brain & Nervous System',
      icon: <Brain className="h-5 w-5 text-purple-600" />,
      symptoms: ['Persistent headaches', 'Cognitive fog & memory slips', 'Dizziness or Vertigo', 'Numbness or tingling in extremities', 'Sleep disturbances'],
      tests: ['Brain MRI / CT Scan', 'Vitamin B12 Blood Level', 'Thyroid Stimulating Hormone (TSH)', 'EEG Wave Analysis'],
      specialist: 'Neurologist',
      advice: '7-8 hours of restful sleep promotes glymphatic clearance of brain metabolic waste. Engage in daily cognitive challenges.'
    },
    {
      id: 'lungs',
      nameKey: 'bodyExplorer.lungs',
      nameFallback: 'Lungs & Respiratory',
      icon: <Wind className="h-5 w-5 text-cyan-600" />,
      symptoms: ['Chronic lingering cough', 'Wheezing during breathing', 'Shortness of breath', 'Chest tightness', 'Frequent respiratory infections'],
      tests: ['Spirometry / Lung Function Test', 'Chest X-Ray / Low-Dose CT', 'Arterial Blood Gas (ABG)', 'Pulse Oximetry Oxygen Saturation'],
      specialist: 'Pulmonologist',
      advice: 'Avoid tobacco smoke and fine particulate exposure. Diaphragmatic deep breathing exercises enhance vital lung capacity.'
    },
    {
      id: 'gut',
      nameKey: 'bodyExplorer.gut',
      nameFallback: 'Digestive & Metabolism',
      icon: <Stethoscope className="h-5 w-5 text-amber-600" />,
      symptoms: ['Acid reflux & heartburn', 'Abdominal bloating & pain', 'Irregular bowel habits', 'Unexplained weight changes', 'Frequent nausea'],
      tests: ['Comprehensive Metabolic Panel (CMP)', 'HbA1c Blood Glucose', 'Endoscopy / Colonoscopy', 'Liver Function Panel (LFT)'],
      specialist: 'Gastroenterologist',
      advice: 'Consume 25-30g of dietary fiber daily and include fermented probiotic foods to support a diverse gut microbiome.'
    },
    {
      id: 'muscles',
      nameKey: 'bodyExplorer.muscles',
      nameFallback: 'Joints, Bones & Spine',
      icon: <Activity className="h-5 w-5 text-emerald-600" />,
      symptoms: ['Morning joint stiffness', 'Lower back ache', 'Reduced joint flexibility', 'Muscle spasms & cramps', 'Bone density loss'],
      tests: ['DEXA Bone Mineral Density Scan', 'Serum Uric Acid Level', 'Vitamin D (25-OH)', 'Rheumatoid Factor (RF)'],
      specialist: 'Orthopedist / Rheumatologist',
      advice: 'Combine resistance training 2-3x weekly with optimal Vitamin D3 and Calcium intake for musculoskeletal longevity.'
    },
    {
      id: 'kidneys',
      nameKey: 'bodyExplorer.kidneys',
      nameFallback: 'Kidneys & Renal Health',
      icon: <Droplets className="h-5 w-5 text-blue-600" />,
      symptoms: ['Foamy or bubbly urine', 'Swelling in ankles, feet, or face (Edema)', 'Unexplained fatigue & weakness', 'Nocturia (frequent urination at night)', 'Flank / lower back kidney ache'],
      tests: ['eGFR (Glomerular Filtration Rate)', 'Serum Creatinine & BUN', 'Urine Albumin-to-Creatinine Ratio (uACR)', 'Renal Ultrasound Imaging'],
      specialist: 'Nephrologist',
      advice: 'Maintain consistent hydration (2-3L daily), keep blood pressure tightly below 120/80 mmHg, strictly limit chronic NSAID painkillers, and monitor annual microalbuminuria.'
    }
  ];

  const currentOrganInfo = organSystems.find(o => o.id === selectedOrgan) || organSystems[0];

  // 2. Interactive Biological Age & Health Score Simulator State
  const [chronoAge, setChronoAge] = useState<number>(38);
  const [exerciseMins, setExerciseMins] = useState<number>(40); // mins per day
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [dietQuality, setDietQuality] = useState<number>(8); // 1 to 10
  const [stressLevel, setStressLevel] = useState<string>('moderate'); // low, moderate, high

  const vitalityMetrics = useMemo(() => {
    let ageModifier = 0;
    let score = 70;

    // Exercise effect
    if (exerciseMins >= 45) { ageModifier -= 3.5; score += 12; }
    else if (exerciseMins >= 20) { ageModifier -= 1.5; score += 6; }
    else { ageModifier += 2.5; score -= 8; }

    // Sleep effect
    if (sleepHours >= 7 && sleepHours <= 9) { ageModifier -= 2.0; score += 10; }
    else if (sleepHours < 6) { ageModifier += 3.0; score -= 12; }

    // Diet effect
    if (dietQuality >= 8) { ageModifier -= 2.5; score += 10; }
    else if (dietQuality <= 4) { ageModifier += 2.0; score -= 10; }

    // Stress effect
    if (stressLevel === 'low') { ageModifier -= 1.5; score += 8; }
    else if (stressLevel === 'high') { ageModifier += 3.0; score -= 10; }

    const bioAge = Math.max(18, Math.round((chronoAge + ageModifier) * 10) / 10);
    const clampedScore = Math.min(100, Math.max(20, score));

    return {
      bioAge,
      diff: Math.round((chronoAge - bioAge) * 10) / 10,
      score: clampedScore,
      riskLevel: clampedScore >= 80 ? 'Optimal' : clampedScore >= 60 ? 'Moderate' : 'Elevated Risk'
    };
  }, [chronoAge, exerciseMins, sleepHours, dietQuality, stressLevel]);

  // 4. Age Screening Timeline State
  const [activeAgeGroup, setActiveAgeGroup] = useState<string>('30s');
  const ageScreenings: Record<string, { title: string; checks: string[] }> = {
    '20s': {
      title: 'Foundation & Baseline Screening (Ages 20-29)',
      checks: [
        'Annual Blood Pressure & Resting Heart Rate check',
        'Baseline Lipid Profile (Cholesterol & Triglycerides)',
        'Fasting Blood Glucose or HbA1c test',
        'Skin Cancer & Mole Examination',
        'Cervical Cancer Screening (Pap smear every 3 yrs for women)'
      ]
    },
    '30s': {
      title: 'Cardioprotective & Metabolic Monitoring (Ages 30-39)',
      checks: [
        'Comprehensive Metabolic Panel (Kidney & Liver Markers)',
        'Thyroid Panel (TSH, Free T4)',
        'Vitamin D3 & B12 Micronutrient blood check',
        'Annual Eye / Intraocular Pressure exam',
        'Cardiovascular Risk Assessment & Blood Pressure tracking'
      ]
    },
    '40s': {
      title: 'Early Detection & Organ Wellness (Ages 40-49)',
      checks: [
        'Mammogram Screening for Breast Health (Women)',
        'Prostate-Specific Antigen (PSA) baseline (Men)',
        'Cardiac Calcium Scoring / Advanced Lipid Subfractions',
        'Diabetes & HbA1c screening every 2-3 years',
        'Ophthalmology Glaucoma & Vision check'
      ]
    },
    '50s+': {
      title: 'Comprehensive Longevity & Cancer Screening (Ages 50+)',
      checks: [
        'Colorectal Cancer Screening (Colonoscopy or Cologuard)',
        'DEXA Bone Mineral Density Scan (Osteoporosis risk)',
        'Annual Shingles & Pneumococcal Vaccinations',
        'Hearing & Cognitive Wellness evaluations',
        'Comprehensive Vascular & Arterial Stiffness screening'
      ]
    }
  };

  return (
    <div className="bg-gradient-to-b from-emerald-50/40 via-sky-50/30 to-slate-50 py-12 lg:py-20 text-slate-900 relative">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-16">

        {/* SECTION 1: Interactive Organ Systems & Symptom Triage Hub */}
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>{t('bodyExplorer.badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {t('bodyExplorer.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {t('bodyExplorer.subtitle')}
            </p>
          </div>

          {/* Organ Selector Buttons */}
          <div className="gh-sym-grid gh-sym-grid-6">
            {organSystems.map((organ) => {
              const isActive = selectedOrgan === organ.id;
              const localizedName = t(organ.nameKey);
              return (
                <button
                  key={organ.id}
                  onClick={() => setSelectedOrgan(organ.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                    isActive
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/30'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
                    {organ.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold block leading-tight">{localizedName}</span>
                    <span className={`text-[10px] block mt-0.5 ${isActive ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {organ.specialist}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Organ Information Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Symptoms */}
            <div className="space-y-3 bg-rose-50/60 p-5 rounded-2xl border border-rose-100">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                <ShieldAlert className="h-4 w-4 text-rose-600" /> {t('bodyExplorer.warningSymptoms')}
              </div>
              <h3 className="text-base font-bold text-slate-900">{t(currentOrganInfo.nameKey)} {t('bodyExplorer.signals')}</h3>
              <ul className="space-y-2">
                {currentOrganInfo.symptoms.map((sym, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-slate-800 bg-white/90 p-2.5 rounded-xl border border-rose-200/60 shadow-2xs">
                    <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                    <span className="font-medium">{t(sym)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Middle Col: Key Lab Tests & Specialist */}
            <div className="space-y-3 bg-cyan-50/60 p-5 rounded-2xl border border-cyan-100">
              <div className="flex items-center gap-2 text-cyan-900 font-bold text-xs uppercase tracking-wider">
                <Activity className="h-4 w-4 text-cyan-600" /> {t('bodyExplorer.recommendedTests')}
              </div>
              <h3 className="text-base font-bold text-slate-900">{t('bodyExplorer.diagnosticScreening')}</h3>
              <ul className="space-y-2">
                {currentOrganInfo.tests.map((test, idx) => (
                  <li key={idx} className="flex items-center justify-between text-xs text-slate-800 bg-white/90 p-2.5 rounded-xl border border-cyan-200/60 shadow-2xs">
                    <span className="font-semibold text-slate-900">{t(test)}</span>
                    <CheckCircle2 className="h-4 w-4 text-cyan-600 shrink-0" />
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Col: Preventive Strategy & Quick Action */}
            <div className="space-y-4 bg-amber-50/60 p-5 rounded-2xl border border-amber-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-2">
                  <Zap className="h-4 w-4 text-amber-600" /> {t('bodyExplorer.clinicalGuidance')}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {t(currentOrganInfo.advice)}
                </p>
                <div className="mt-4 pt-3 border-t border-amber-200/60 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-900">{t('bodyExplorer.recommendedSpecialist')}:</span> {t(currentOrganInfo.specialist)}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={() => onTabChange('ai-assistant')}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs"
                >
                  <Bot className="h-4 w-4" /> {t('bodyExplorer.askAICoach')}
                </button>
                <button
                  onClick={() => onTabChange('calculators')}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white border border-amber-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 hover:bg-amber-100/50 transition shadow-2xs"
                >
                  <Calculator className="h-4 w-4 text-amber-600" /> {t('bodyExplorer.calculatorsBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Interactive Biological Age & Longevity Score Simulator */}
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/40 p-6 sm:p-10 shadow-md relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Controls (mirrored half) */}
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
                  <Award className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{t('vitality.badge')}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {t('vitality.title')}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {t('vitality.subtitle')}
                </p>
              </div>

              <div className="space-y-4 bg-white/90 p-5 rounded-2xl border border-emerald-100 shadow-2xs text-xs">
                {/* Chronological Age */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{t('vitality.chronoAge')}</span>
                    <span className="text-emerald-700 font-extrabold">{formatNumber(chronoAge)} {t('vitality.yearsOld')}</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="85"
                    value={chronoAge}
                    onChange={(e) => setChronoAge(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* Daily Exercise */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{t('vitality.exercise')}</span>
                    <span className="text-emerald-700 font-extrabold">{formatNumber(exerciseMins)} {t('vitality.minsPerDay')}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="5"
                    value={exerciseMins}
                    onChange={(e) => setExerciseMins(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* Sleep Hours */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{t('vitality.sleep')}</span>
                    <span className="text-emerald-700 font-extrabold">{formatNumber(sleepHours)} {t('vitality.hours')}</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="10"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* Diet Quality */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{t('vitality.diet')}</span>
                    <span className="text-emerald-700 font-extrabold">{formatNumber(dietQuality)} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={dietQuality}
                    onChange={(e) => setDietQuality(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* Stress Level Selector */}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-slate-800">{t('vitality.stress')}</span>
                  <div className="flex items-center gap-1.5">
                    {['low', 'moderate', 'high'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setStressLevel(level)}
                        className={`capitalize px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                          stressLevel === level
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        {t(`vitality.${level}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Display Gauge Box (mirrored half) */}
            <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-md text-center space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">
                  {t('vitality.estimatedBioAge')}
                </span>
                <span className="text-5xl font-black text-slate-900 tracking-tight block">
                  {formatNumber(vitalityMetrics.bioAge)} <span className="text-sm font-semibold text-slate-500">{t('vitality.yearsOld')}</span>
                </span>
                <p className="text-xs font-semibold text-slate-700 mt-1">
                  {vitalityMetrics.diff > 0 ? (
                    <span className="text-emerald-700 font-bold">
                      🎉 {formatNumber(vitalityMetrics.diff)} {t('vitality.yearsYounger')}
                    </span>
                  ) : vitalityMetrics.diff === 0 ? (
                    <span className="text-slate-600 font-semibold">
                      {t('vitality.matchesAge')}
                    </span>
                  ) : (
                    <span className="text-amber-700 font-bold">
                      ⚠️ {formatNumber(Math.abs(vitalityMetrics.diff))} {t('vitality.yearsOlder')}
                    </span>
                  )}
                </p>
              </div>

              {/* Health Score Progress Ring/Bar */}
              <div className="space-y-2 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700">{t('vitality.overallScore')}</span>
                  <span className="text-emerald-800 font-extrabold">{formatNumber(vitalityMetrics.score)} / 100</span>
                </div>
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                    style={{ width: `${vitalityMetrics.score}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-600 block pt-1">
                  {t('vitality.riskTier')}: <span className="text-slate-900 font-bold">{vitalityMetrics.riskLevel}</span>
                </span>
              </div>

              <button
                onClick={() => onTabChange('calculators')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 py-3 text-xs font-bold text-white shadow-md hover:from-emerald-800 hover:to-teal-800 transition"
              >
                <span>{t('vitality.accessCalculators')}</span>
                <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: Age-Based Preventive Health Screening Roadmap */}
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 border border-cyan-200 px-3 py-1 text-xs font-bold text-cyan-800 uppercase tracking-wider mb-2">
                <CalendarCheck className="h-3.5 w-3.5 text-cyan-600" />
                <span>{t('screenings.badge')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {t('screenings.title')}
              </h2>
            </div>

            {/* Age Tabs (centered, symmetric) */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-none">
              {['20s', '30s', '40s', '50s+'].map((group) => (
                <button
                  key={group}
                  onClick={() => setActiveAgeGroup(group)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                    activeAgeGroup === group
                      ? 'bg-cyan-700 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t('Ages {group}', { group })}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-center text-lg font-bold text-cyan-900">
              {t(ageScreenings[activeAgeGroup].title)}
            </h3>
            <div className="gh-sym-grid gh-sym-grid-3">
              {ageScreenings[activeAgeGroup].checks.map((check, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span className="text-slate-800 font-medium leading-relaxed">{t(check)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 4: Live Health News Question & Knowledge Spotlight */}
        <div id="home-news-question-section">
          <HomeNewsQuestionSpotlight onTabChange={onTabChange} onOpenNewsArticle={onOpenNewsArticle} />
        </div>

      </div>
    </div>
  );
};
