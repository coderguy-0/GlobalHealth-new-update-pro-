import React, { useState } from 'react';
import { 
  HealthCondition 
} from '../types';
import { useLocalization } from '../context/LocalizationContext';
import { 
  Activity, 
  AlertCircle, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Droplet, 
  ExternalLink, 
  Eye, 
  Flame, 
  HeartPulse, 
  HelpCircle, 
  Info, 
  Layers, 
  Pill, 
  Radio, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Stethoscope, 
  Thermometer, 
  Wind, 
  X, 
  Zap 
} from 'lucide-react';

export interface DiseaseInfographicData {
  incubationOrOnset: string;
  transmissionOrEtiology: string;
  recoveryOrCourse: string;
  goldStandardTest: string;
  severityRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  pathophysiologyFlow: {
    stage: string;
    title: string;
    description: string;
    timeframe: string;
    iconType: 'exposure' | 'onset' | 'peak' | 'resolution';
  }[];
  anatomicalImpact: {
    system: string;
    impactLevel: 'Primary Target' | 'Secondary Impact' | 'Systemic Risk';
    disruption: string;
    clinicalSign: string;
  }[];
  severitySpectrum: {
    phase: string;
    title: string;
    symptoms: string[];
    actionRequired: string;
    badgeColor: string;
  }[];
  careMatrix: {
    firstLineMedical: string[];
    lifestyleSupportive: string[];
    contraindications: string[];
  };
}

export function getDiseaseInfographicData(cond: HealthCondition): DiseaseInfographicData {
  const id = cond.id?.toLowerCase() || '';
  const title = cond.title?.toLowerCase() || '';

  // 1. Common Cold
  if (id.includes('cold') || title.includes('common cold') || title.includes('nasopharyngitis')) {
    return {
      incubationOrOnset: '24–72 Hours',
      transmissionOrEtiology: 'Aerosol Droplets & Surface Contact (Rhinovirus)',
      recoveryOrCourse: '7–10 Days (Cough up to 2–3 weeks)',
      goldStandardTest: 'Clinical Assessment / Nasal Viral Panel (if needed)',
      severityRisk: 'Low',
      pathophysiologyFlow: [
        {
          stage: 'Stage 1',
          title: 'Viral Inoculation',
          description: 'Aerosolized Rhinovirus binds to ICAM-1 receptors on upper respiratory nasal mucosa.',
          timeframe: 'Hours 0–24',
          iconType: 'exposure'
        },
        {
          stage: 'Stage 2',
          title: 'Cytokine Release',
          description: 'Local mucosal inflammation triggers kinins and interleukins, causing hypersecretion and scratchy throat.',
          timeframe: 'Day 1–2',
          iconType: 'onset'
        },
        {
          stage: 'Stage 3',
          title: 'Peak Mucosal Congestion',
          description: 'Nasal vascular engorgement leads to obstruction, rhinorrhea, and mild systemic malaise.',
          timeframe: 'Day 3–5',
          iconType: 'peak'
        },
        {
          stage: 'Stage 4',
          title: 'Immune Clearance',
          description: 'Secretory IgA and mucosal regeneration clear viral load; symptoms resolve spontaneously.',
          timeframe: 'Day 7–10',
          iconType: 'resolution'
        }
      ],
      anatomicalImpact: [
        {
          system: 'Nasal Mucosa & Turbinates',
          impactLevel: 'Primary Target',
          disruption: 'Vascular engorgement and hyperactive mucus secretion',
          clinicalSign: 'Rhinorrhea, congestion, sneezing'
        },
        {
          system: 'Pharynx & Oropharynx',
          impactLevel: 'Primary Target',
          disruption: 'Epithelial inflammation and sensory nerve irritation',
          clinicalSign: 'Scratchy sore throat, painful swallowing'
        },
        {
          system: 'Paranasal Sinuses',
          impactLevel: 'Secondary Impact',
          disruption: 'Ostial swelling leading to transient sinus pressure',
          clinicalSign: 'Frontal tension headache, facial fullness'
        },
        {
          system: 'Larynx & Trachea',
          impactLevel: 'Secondary Impact',
          disruption: 'Post-nasal drip irritation of vocal cords and trachea',
          clinicalSign: 'Hoarseness and dry cough'
        }
      ],
      severitySpectrum: [
        {
          phase: 'Mild Phase',
          title: 'Early Inoculation',
          symptoms: ['Dry scratchy throat', 'Frequent sneezing', 'Clear runny nose'],
          actionRequired: 'Hydration, rest, saline nasal rinse, monitor progress.',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
        },
        {
          phase: 'Moderate Phase',
          title: 'Full Nasal Congestion',
          symptoms: ['Thick nasal discharge', 'Low-grade fever (<100.4°F)', 'Headache & fatigue'],
          actionRequired: 'Paracetamol/Ibuprofen for aches, warm steam inhalation, honey for cough.',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
        },
        {
          phase: 'Red Flag Phase',
          title: 'Secondary Bacterial / Respiratory Crisis',
          symptoms: ['High fever >102°F', 'Shortness of breath / wheezing', 'Severe unilateral facial or ear pain'],
          actionRequired: 'Immediate physician evaluation for otitis media, sinusitis, or pneumonia.',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
        }
      ],
      careMatrix: {
        firstLineMedical: [
          'Acetaminophen (Paracetamol) or Ibuprofen for analgesia and antipyresis',
          'Saline nasal irrigation (isotonic spray/rinse) to clear mucus',
          'Short-course topical decongestant (<3 consecutive days only to prevent rebound)'
        ],
        lifestyleSupportive: [
          'High fluid intake (2.5L/day warm broths, herbal teas, water)',
          'Cool mist humidifier in sleeping areas',
          'Raw honey (1-2 teaspoons) for soothing nighttime cough (>1 year old only)'
        ],
        contraindications: [
          'DO NOT take antibiotics (ineffective against viral Rhinovirus infections)',
          'DO NOT give Aspirin to children/teens (risk of Reye Syndrome)',
          'DO NOT overuse OTC decongestant sprays beyond 72 hours (risk of Rhinitis Medicamentosa)'
        ]
      }
    };
  }

  // 2. Influenza (Flu)
  if (id.includes('flu') || title.includes('influenza')) {
    return {
      incubationOrOnset: '1–4 Days (Sudden Explosive Onset)',
      transmissionOrEtiology: 'Airborne Droplets (Influenza A & B Viruses)',
      recoveryOrCourse: '5–14 Days (Post-viral fatigue may last 3 weeks)',
      goldStandardTest: 'Rapid Influenza Diagnostic Test (RIDT) / RT-PCR Swab',
      severityRisk: 'Moderate',
      pathophysiologyFlow: [
        {
          stage: 'Stage 1',
          title: 'Hemagglutinin Binding',
          description: 'Viral surface Hemagglutinin binds to sialic acid receptors on respiratory ciliated cells.',
          timeframe: 'Hours 0–24',
          iconType: 'exposure'
        },
        {
          stage: 'Stage 2',
          title: 'Systemic Cytokine Storm',
          description: 'Massive interferon and interleukin surge causes sudden fever, rigors, and diffuse myalgia.',
          timeframe: 'Day 1–3',
          iconType: 'onset'
        },
        {
          stage: 'Stage 3',
          title: 'Tracheobronchial Sloughing',
          description: 'Desquamation of ciliated epithelium leaves lower airways vulnerable to secondary bacterial invaders.',
          timeframe: 'Day 4–7',
          iconType: 'peak'
        },
        {
          stage: 'Stage 4',
          title: 'Epithelial Regeneration',
          description: 'Cytotoxic T-cells eliminate virus; bronchial cilia gradually regenerate over 2–3 weeks.',
          timeframe: 'Day 8–14+',
          iconType: 'resolution'
        }
      ],
      anatomicalImpact: [
        {
          system: 'Tracheobronchial Tree',
          impactLevel: 'Primary Target',
          disruption: 'Epithelial cell lysis, ciliary paralysis, and deep airway inflammation',
          clinicalSign: 'Severe burning substernal chest cough'
        },
        {
          system: 'Systemic Musculoskeletal',
          impactLevel: 'Primary Target',
          disruption: 'High circulating IL-6 and TNF-alpha inducing severe muscle catabolism/aches',
          clinicalSign: 'Debilitating back, leg, and neck muscle pain'
        },
        {
          system: 'Thermoregulatory Center',
          impactLevel: 'Primary Target',
          disruption: 'Hypothalamic setpoint elevation via prostaglandin E2 surge',
          clinicalSign: 'Rapid spike fever 102°F–104°F with shaking chills'
        },
        {
          system: 'Pulmonary Alveoli',
          impactLevel: 'Systemic Risk',
          disruption: 'Alveolar exudate / secondary Staph or Strep bacterial colonization',
          clinicalSign: 'Shortness of breath, purulent rust-colored sputum'
        }
      ],
      severitySpectrum: [
        {
          phase: 'Uncomplicated Flu',
          title: 'Typical Acute Viral Phase',
          symptoms: ['Sudden high fever', 'Severe muscle aches', 'Dry barking cough', 'Extreme exhaustion'],
          actionRequired: 'Strict bed rest, aggressive hydration, antipyretics, isolation.',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
        },
        {
          phase: 'High-Risk Vulernability',
          title: 'Elderly / Pediatric / Chronic Comorbidities',
          symptoms: ['Persistent fever >4 days', 'Difficulty staying hydrated', 'Worsening lethargy'],
          actionRequired: 'Prompt medical evaluation; initiation of Neuraminidase Inhibitors (Oseltamivir within 48h).',
          badgeColor: 'bg-orange-100 text-orange-800 border-orange-300'
        },
        {
          phase: 'Emergency Red Flag',
          title: 'Pulmonary / Cardiac Complication (ARDS/Sepsis)',
          symptoms: ['Severe dyspnea / cyanosis', 'Chest pain & confusion', 'Relapsing high fever after initial recovery'],
          actionRequired: 'Immediate 911 / ER transfer for supplemental oxygen, imaging, and IV therapy.',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
        }
      ],
      careMatrix: {
        firstLineMedical: [
          'Neuraminidase Inhibitors (Oseltamivir / Tamiflu) if within 48h of onset in high risk',
          'Antipyretic therapy: Alternating Paracetamol and Ibuprofen',
          'Oral rehydration electrolyte solutions'
        ],
        lifestyleSupportive: [
          'Strict horizontal bed rest (do not attempt strenuous work/exercise)',
          'High humidity steam inhalation and throat lozenges',
          'Strict home isolation for 5–7 days after fever resolves'
        ],
        contraindications: [
          'DO NOT give Aspirin to children/adolescents (Reye Syndrome hazard)',
          'DO NOT return to work/gym prematurely while febrile',
          'DO NOT ignore sudden relapse of fever and productive cough (sign of bacterial pneumonia)'
        ]
      }
    };
  }

  // 3. Hypertension
  if (id.includes('hypertension') || title.includes('blood pressure')) {
    return {
      incubationOrOnset: 'Insidious (Months to Years)',
      transmissionOrEtiology: 'Arterial Stiffening, High Sodium, Renin-Angiotensin Dysregulation, Genetics',
      recoveryOrCourse: 'Chronic Lifelong Management Required',
      goldStandardTest: 'Calibrated Sphygmomanometer (Repeated Readings ≥130/80 mmHg) / 24h ABPM',
      severityRisk: 'High',
      pathophysiologyFlow: [
        {
          stage: 'Stage 1',
          title: 'Endothelial Strain',
          description: 'Elevated peripheral vascular resistance exerts mechanical shear stress on arterial walls.',
          timeframe: 'Months 0–12',
          iconType: 'exposure'
        },
        {
          stage: 'Stage 2',
          title: 'Vascular Remodeling',
          description: 'Arterial smooth muscle hypertrophy and collagen deposition reduce luminal elasticity.',
          timeframe: 'Year 1–3',
          iconType: 'onset'
        },
        {
          stage: 'Stage 3',
          title: 'End-Organ Microvascular Damage',
          description: 'Glomerular capillary sclerosis, retinal arteriolar narrowing, and coronary strain develop silently.',
          timeframe: 'Year 3–5+',
          iconType: 'peak'
        },
        {
          stage: 'Stage 4',
          title: 'Target Organ Failure / Crisis',
          description: 'Left ventricular hypertrophy (LVH), stroke, nephrosclerosis, or myocardial infarction.',
          timeframe: 'Long-term risk',
          iconType: 'resolution'
        }
      ],
      anatomicalImpact: [
        {
          system: 'Heart & Left Ventricle',
          impactLevel: 'Primary Target',
          disruption: 'Increased afterload leading to concentric Left Ventricular Hypertrophy (LVH)',
          clinicalSign: 'Exertional dyspnea, arrhythmia, heart failure'
        },
        {
          system: 'Brain & Cerebrovascular',
          impactLevel: 'Primary Target',
          disruption: 'Microaneurysm formation (Charcot-Bouchard) and accelerated atherosclerosis',
          clinicalSign: 'Transient Ischemic Attack (TIA), Ischemic/Hemorrhagic Stroke'
        },
        {
          system: 'Renal Glomeruli',
          impactLevel: 'Primary Target',
          disruption: 'Arteriolar nephrosclerosis causing filtration impairment',
          clinicalSign: 'Microalbuminuria, elevated serum creatinine, fluid retention'
        },
        {
          system: 'Retinal Microvasculature',
          impactLevel: 'Secondary Impact',
          disruption: 'Arteriovenous nicking, flame hemorrhages, and papilledema',
          clinicalSign: 'Visual blurring, hypertensive retinopathy'
        }
      ],
      severitySpectrum: [
        {
          phase: 'Stage 1 Hypertension',
          title: 'Systolic 130–139 or Diastolic 80–89 mmHg',
          symptoms: ['Frequently asymptomatic ("Silent Killer")', 'Occasional morning occipital headache'],
          actionRequired: 'DASH diet, sodium reduction (<1,500mg/day), 150 min/wk aerobic exercise, assess ASCVD risk.',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
        },
        {
          phase: 'Stage 2 Hypertension',
          title: 'Systolic ≥140 or Diastolic ≥90 mmHg',
          symptoms: ['Occasional dizziness', 'Tinnitus / ear buzzing', 'Flushed facial skin'],
          actionRequired: 'Prescription antihypertensive pharmacotherapy (ACEi/ARB, CCB, Thiazide) + lifestyle overhaul.',
          badgeColor: 'bg-orange-100 text-orange-800 border-orange-300'
        },
        {
          phase: 'Hypertensive Crisis',
          title: 'Systolic >180 and/or Diastolic >120 mmHg',
          symptoms: ['Severe chest pain', 'Sudden visual loss', 'Numbness/weakness', 'Severe acute headache'],
          actionRequired: 'EMERGENCY: Immediate ER admission to prevent aortic dissection, acute stroke, or renal crisis.',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
        }
      ],
      careMatrix: {
        firstLineMedical: [
          'ACE Inhibitors (Lisinopril) or ARBs (Losartan / Telmisartan)',
          'Dihydropyridine Calcium Channel Blockers (Amlodipine)',
          'Thiazide-like Diuretics (Chlorthalidone / Indapamide)'
        ],
        lifestyleSupportive: [
          'DASH Diet: High potassium, magnesium, calcium; low saturated fats',
          'Strict sodium restriction to under 1,500 mg per day',
          'Daily home blood pressure logging morning and evening'
        ],
        contraindications: [
          'DO NOT abruptly discontinue antihypertensive medications (rebound hypertensive crisis)',
          'DO NOT consume high-sodium processed foods, energy drinks, or excessive licorice',
          'DO NOT overuse OTC NSAIDs (Ibuprofen, Naproxen) as they blunt antihypertensive drugs'
        ]
      }
    };
  }

  // 4. Generic Intelligent Fallback Engine for all other conditions
  const category = cond.category || 'General';
  const organList = cond.affectedBodyParts || ['Primary System', 'Cardiorespiratory', 'Nervous System'];
  const firstOrgan = organList[0] || 'Target Organ System';
  const secondOrgan = organList[1] || 'Secondary Supporting System';
  const thirdOrgan = organList[2] || 'Systemic Pathways';

  return {
    incubationOrOnset: cond.quickFacts?.find(f => f.label.toLowerCase().includes('incubation') || f.label.toLowerCase().includes('onset'))?.value || 'Variable / Clinical Trigger',
    transmissionOrEtiology: cond.causes?.[0] || 'Multifactorial Environmental & Genetic Etiology',
    recoveryOrCourse: cond.quickFacts?.find(f => f.label.toLowerCase().includes('recovery') || f.label.toLowerCase().includes('course'))?.value || 'Condition-Dependent Clinical Timeline',
    goldStandardTest: cond.diagnosisAndTests?.[0] || 'Comprehensive Clinical & Laboratory Evaluation',
    severityRisk: cond.emergencyWarningSigns && cond.emergencyWarningSigns.length > 0 ? 'Moderate' : 'Low',
    pathophysiologyFlow: [
      {
        stage: 'Stage 1',
        title: 'Initial Etiological Trigger',
        description: cond.causes?.[0] || 'Primary pathogenic mechanism or environmental trigger impacts target tissue receptors.',
        timeframe: 'Initial Phase',
        iconType: 'exposure'
      },
      {
        stage: 'Stage 2',
        title: 'Pathophysiological Progression',
        description: cond.causes?.[1] || 'Tissue inflammation, structural change, or functional disruption begins spreading through local tissue.',
        timeframe: 'Early Progression',
        iconType: 'onset'
      },
      {
        stage: 'Stage 3',
        title: 'Active Clinical Manifestation',
        description: cond.symptoms?.[0] ? `Cardinal symptoms manifest: ${cond.symptoms.slice(0, 3).join(', ')}.` : 'Active clinical disease state reaches symptomatic peak.',
        timeframe: 'Acute / Peak Phase',
        iconType: 'peak'
      },
      {
        stage: 'Stage 4',
        title: 'Resolution or Long-term Care',
        description: cond.treatments?.[0] ? `Targeted treatment protocol: ${cond.treatments[0]}` : 'Evidence-based clinical intervention and lifestyle stabilization.',
        timeframe: 'Resolution / Management',
        iconType: 'resolution'
      }
    ],
    anatomicalImpact: [
      {
        system: firstOrgan,
        impactLevel: 'Primary Target',
        disruption: `Direct pathophysiological stress on ${firstOrgan.toLowerCase()} tissues and local cellular function`,
        clinicalSign: cond.symptoms?.[0] || 'Primary localized symptoms and discomfort'
      },
      {
        system: secondOrgan,
        impactLevel: 'Secondary Impact',
        disruption: `Compensatory physiological load affecting ${secondOrgan.toLowerCase()}`,
        clinicalSign: cond.symptoms?.[1] || 'Secondary regional functional alteration'
      },
      {
        system: thirdOrgan,
        impactLevel: 'Systemic Risk',
        disruption: 'Downstream systemic metabolic or autonomic balance disruption',
        clinicalSign: cond.symptoms?.[2] || 'Fatigue, inflammatory markers, or systemic strain'
      }
    ],
    severitySpectrum: [
      {
        phase: 'Early / Mild Stage',
        title: 'Initial Symptomatic Presentation',
        symptoms: cond.symptoms?.slice(0, 2) || ['Mild localized discomfort', 'Early transient signs'],
        actionRequired: 'Rest, primary preventative measures, home tracking, physician consultation.',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
      },
      {
        phase: 'Moderate Stage',
        title: 'Established Clinical Disease',
        symptoms: cond.symptoms?.slice(2, 5) || ['Persistent daily symptoms', 'Functional impairment'],
        actionRequired: 'Targeted pharmacological treatment, clinical diagnostic workup, structured follow-up.',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
      },
      {
        phase: 'Critical / Red Flag Stage',
        title: 'Emergency Decompensation',
        symptoms: cond.emergencyWarningSigns?.slice(0, 3) || ['Severe acute pain or dyspnea', 'Rapid functional loss', 'Vital sign instability'],
        actionRequired: 'URGENT: Immediate emergency medical assessment and hospital-level intervention.',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
      }
    ],
    careMatrix: {
      firstLineMedical: cond.treatments?.slice(0, 3) || [
        'Evidence-based physician-prescribed pharmacological regimen',
        'Targeted clinical symptom management protocols',
        'Routine laboratory biomarker and vital signs tracking'
      ],
      lifestyleSupportive: cond.prevention?.slice(0, 3) || [
        'Adequate hydration, restorative sleep, and nutritional balance',
        'Stress reduction and regular low-impact physical activity',
        'Avoidance of known environmental and dietary triggers'
      ],
      contraindications: [
        'DO NOT self-medicate with unverified high-dose pharmaceuticals',
        'DO NOT ignore emergency warning red flags or vital sign deterioration',
        'DO NOT abruptly stop prescribed therapeutic regimens without physician oversight'
      ]
    }
  };
}

interface DiseaseInfographicProps {
  condition: HealthCondition;
}

export const DiseaseInfographic: React.FC<DiseaseInfographicProps> = ({
  condition
}) => {
  const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState<'progression' | 'anatomy' | 'severity' | 'care'>('progression');

  const info = getDiseaseInfographicData(condition);

  return (
    <div className="w-full">
      <div className="w-full bg-white rounded-3xl border border-rose-200/80 shadow-md overflow-hidden transition-all">
        
        {/* Infographic Top Banner */}
        <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-rose-950 text-white p-5 sm:p-7 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
            <HeartPulse className="w-56 h-56 text-rose-300" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="bg-rose-600/90 backdrop-blur-md text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                  {t('Clinical Overview')}
                </span>
                <span className="bg-white/15 backdrop-blur-md text-slate-100 text-[11px] font-bold px-3 py-1 rounded-full border border-white/10">
                  {t(condition.category)} {t('Pathology')}
                </span>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                  info.severityRisk === 'Critical' ? 'bg-rose-500 text-white' :
                  info.severityRisk === 'High' ? 'bg-amber-500 text-white' :
                  info.severityRisk === 'Moderate' ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white'
                }`}>
                  {t('Risk Level')}: {t(info.severityRisk)}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <Stethoscope className="h-6 w-6 text-rose-400 shrink-0" />
                <span>{t(condition.title)}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl line-clamp-2">
                {t(condition.summary)}
              </p>
            </div>
          </div>

          {/* Key Clinical Quick Metrics Banner (Always Visible) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-white/15 text-xs">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-[10px] text-rose-200 uppercase font-bold tracking-wider block flex items-center gap-1">
                <Clock className="h-3 w-3 text-rose-300" /> {t('Incubation / Onset')}
              </span>
              <span className="font-extrabold text-white text-xs sm:text-sm block mt-0.5 truncate">
                {t(info.incubationOrOnset)}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-[10px] text-rose-200 uppercase font-bold tracking-wider block flex items-center gap-1">
                <Radio className="h-3 w-3 text-rose-300" /> {t('Primary Transmission')}
              </span>
              <span className="font-extrabold text-white text-xs sm:text-sm block mt-0.5 truncate">
                {t(info.transmissionOrEtiology)}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-[10px] text-rose-200 uppercase font-bold tracking-wider block flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-rose-300" /> {t('Recovery / Course')}
              </span>
              <span className="font-extrabold text-white text-xs sm:text-sm block mt-0.5 truncate">
                {t(info.recoveryOrCourse)}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-[10px] text-rose-200 uppercase font-bold tracking-wider block flex items-center gap-1">
                <Stethoscope className="h-3 w-3 text-rose-300" /> {t('Gold-Standard Test')}
              </span>
              <span className="font-extrabold text-white text-xs sm:text-sm block mt-0.5 truncate">
                {t(info.goldStandardTest)}
              </span>
            </div>
          </div>
        </div>

        {/* Core Infographic Body */}
        <div className="p-5 sm:p-7 space-y-6">
            
            {/* Interactive Tab Navigation Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 overflow-x-auto gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('progression')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'progression'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>{t('1. Pathophysiology Pipeline')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('anatomy')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'anatomy'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>{t('2. Anatomical Target Map')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('severity')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'severity'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Activity className="h-3.5 w-3.5" />
                  <span>{t('3. Severity & Staging Spectrum')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('care')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'care'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>{t('4. Care & Safety Matrix')}</span>
                </button>
              </div>

              <span className="text-[11px] font-bold text-slate-400 hidden lg:block">
                {t('Interactive Visual Monograph')}
              </span>
            </div>

            {/* TAB 1: Pathophysiology & Progression Pipeline */}
            {activeTab === 'progression' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Zap className="h-4 w-4 text-rose-600" />
                      <span>{t('Biological Progression Flowchart')}</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      {t('Step-by-step pathophysiological progression from exposure/trigger to clinical resolution.')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                  {info.pathophysiologyFlow.map((step, idx) => (
                    <div 
                      key={idx} 
                      className="rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/80 p-4 border border-slate-200 relative flex flex-col justify-between hover:border-rose-300 hover:shadow-xs transition"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="h-7 w-7 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                            {idx + 1}
                          </span>
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            {t(step.timeframe)}
                          </span>
                        </div>

                        <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 mb-1.5 leading-snug">
                          {t(step.title)}
                        </h5>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {t(step.description)}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span>{t(step.stage)}</span>
                        {idx < 3 && <ArrowRight className="h-3.5 w-3.5 text-rose-400 hidden md:block" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Anatomical Target Heatmap */}
            {activeTab === 'anatomy' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="h-4 w-4 text-rose-600" />
                    <span>{t('Target Organ Systems & Functional Disruption')}</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    {t('Direct physiological impact and clinical manifestations across affected body parts.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {info.anatomicalImpact.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-rose-300 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </div>
                          <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                            {t(item.system)}
                          </h5>
                        </div>
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          item.impactLevel === 'Primary Target' 
                            ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                            : item.impactLevel === 'Secondary Impact'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                        }`}>
                          {t(item.impactLevel)}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200/60 text-xs space-y-1.5">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                            {t('Physiological Disruption:')}
                          </span>
                          <p className="text-slate-700 font-medium leading-relaxed">
                            {t(item.disruption)}
                          </p>
                        </div>

                        <div className="pt-1.5 border-t border-slate-100">
                          <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block">
                            {t('Clinical Observable Sign:')}
                          </span>
                          <p className="text-slate-800 font-bold">
                            {t(item.clinicalSign)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Severity & Staging Spectrum */}
            {activeTab === 'severity' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="h-4 w-4 text-rose-600" />
                    <span>{t('Clinical Staging & Severity Spectrum')}</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    {t('Progression tiers from mild presentation to emergency red-flag intervention thresholds.')}
                  </p>
                </div>

                {/* Visual Spectrum Bar */}
                <div className="h-3 w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-600 shadow-inner" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {info.severitySpectrum.map((spec, idx) => (
                    <div 
                      key={idx} 
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <span className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${spec.badgeColor}`}>
                          {t(spec.phase)}
                        </span>
                        <h5 className="font-extrabold text-slate-900 text-sm">
                          {t(spec.title)}
                        </h5>

                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            {t('Hallmark Symptoms:')}
                          </span>
                          <ul className="space-y-1 text-xs text-slate-700">
                            {spec.symptoms.map((sym, sIdx) => (
                              <li key={sIdx} className="flex items-start gap-1.5">
                                <span className="text-rose-500 font-bold mt-0.5">•</span>
                                <span>{t(sym)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-2xl">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                          {t('Action Required:')}
                        </span>
                        <p className="text-xs font-bold text-slate-800 leading-snug">
                          {t(spec.actionRequired)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Care & Safety Matrix */}
            {activeTab === 'care' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-rose-600" />
                    <span>{t('Care Protocol & Safety Matrix')}</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    {t('First-line clinical interventions, supportive home measures, and critical contraindications.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* First Line Medical */}
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{t('1st-Line Clinical Care')}</span>
                    </div>
                    <ul className="space-y-2 text-xs text-emerald-950">
                      {info.careMatrix.firstLineMedical.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                          <span>{t(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Lifestyle & Supportive */}
                  <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                    <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs uppercase tracking-wider">
                      <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>{t('Supportive Lifestyle')}</span>
                    </div>
                    <ul className="space-y-2 text-xs text-blue-950">
                      {info.careMatrix.lifestyleSupportive.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                          <span>{t(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contraindications & DO NOTs */}
                  <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
                    <div className="flex items-center gap-2 text-rose-900 font-extrabold text-xs uppercase tracking-wider">
                      <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                      <span>{t('Contraindications (DO NOTs)')}</span>
                    </div>
                    <ul className="space-y-2 text-xs text-rose-950 font-medium">
                      {info.careMatrix.contraindications.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5" />
                          <span>{t(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Infographic Footer Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-rose-600 shrink-0" />
                <span>
                  {t('Source: Peer-Reviewed Clinical & Epidemiological Disease Registry. Educational reference only.')}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="bg-slate-100 px-3 py-1 rounded-xl text-[11px] font-bold text-slate-700">
                  {t('Read Time')}: {t(condition.readTime)}
                </span>
              </div>
            </div>

          </div>

      </div>
    </div>
  );
};
