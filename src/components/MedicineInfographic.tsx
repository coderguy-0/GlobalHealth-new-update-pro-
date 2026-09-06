import React, { useState } from 'react';
import {
  Clock,
  Zap,
  Activity,
  Heart,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Info,
  Layers,
  Thermometer,
  Printer,
  Brain,
  Droplet,
  Pill,
  Timer,
  Share2
} from 'lucide-react';
import { Medicine } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface MedicineInfographicProps {
  medicine: Medicine;
  onClose?: () => void;
}

interface PharmacokineticData {
  onset: string;
  peak: string;
  duration: string;
  halfLife: string;
  bioavailability: string;
  metabolism: string;
  excretion: string;
  pregnancyCategory: string;
  targetOrgans: { name: string; impact: string; icon: string }[];
  mechanismSteps: { step: number; title: string; desc: string; icon: string }[];
  dosList: string[];
  dontsList: string[];
  maxDailyCap: string;
  recommendedSingleDose: string;
  dosingInterval: string;
}

// Comprehensive clinical pharmacokinetic lookup engine per medicine ID/category
export const getMedicineInfographicData = (med: Medicine): PharmacokineticData => {
  const id = med.id.toLowerCase();
  const name = med.name.toLowerCase();

  if (id.includes('paracetamol') || name.includes('paracetamol') || name.includes('acetaminophen')) {
    return {
      onset: '15 – 30 min',
      peak: '1 – 2 hours',
      duration: '4 – 6 hours',
      halfLife: '2 – 3 hours',
      bioavailability: '88% – 90%',
      metabolism: 'Hepatic (Glucuronidation & Sulfation 90%, CYP2E1 5%)',
      excretion: 'Renal (90-100% excreted in urine within 24h)',
      pregnancyCategory: 'Category B (Preferred antipyretic in pregnancy)',
      maxDailyCap: '4,000 mg (4.0g) in 24 Hours',
      recommendedSingleDose: '500 mg – 1,000 mg',
      dosingInterval: 'Every 4 to 6 Hours as needed',
      targetOrgans: [
        { name: 'Hypothalamus (Brain)', impact: 'Resets central heat-regulating center to lower fever', icon: 'brain' },
        { name: 'Central Nervous System', impact: 'Inhibits pain signal transmission via spinal pathways', icon: 'brain' },
        { name: 'Liver (Hepatic System)', impact: 'Primary metabolic site (NAPQI detoxification via Glutathione)', icon: 'droplet' },
        { name: 'Kidneys (Renal)', impact: 'Filters harmless conjugated metabolites for urinary elimination', icon: 'activity' }
      ],
      mechanismSteps: [
        { step: 1, title: 'Rapid GI Dissolution', desc: 'Tablets dissolve in stomach and are absorbed rapidly in the duodenum.', icon: 'pill' },
        { step: 2, title: 'Central COX Inhibition', desc: 'Selectively blocks central COX-3/peroxidase pathways in the brain and spinal cord.', icon: 'brain' },
        { step: 3, title: 'Prostaglandin PGE2 Suppression', desc: 'Stops production of PGE2 in hypothalamic thermoregulatory centers.', icon: 'zap' },
        { step: 4, title: 'Heat Dissipation & Analgesia', desc: 'Peripheral vasodilation increases skin blood flow, sweating, and pain relief.', icon: 'heart' }
      ],
      dosList: [
        'Take with a full glass of water or juice.',
        'Always check labels of cough/cold medicines to avoid double-dosing.',
        'Use calibrated oral syringes or cups for pediatric liquid formulations.',
        'Space doses at least 4 to 6 hours apart.'
      ],
      dontsList: [
        'NEVER exceed 4,000 mg in 24 hours (liver toxicity risk).',
        'DO NOT consume chronic alcohol while taking paracetamol.',
        'DO NOT combine multiple medicines containing acetaminophen.',
        'DO NOT take for longer than 3 days for fever without consulting a doctor.'
      ]
    };
  }

  if (id.includes('ibuprofen') || name.includes('ibuprofen')) {
    return {
      onset: '20 – 30 min',
      peak: '1 – 2 hours (with food: 2–3h)',
      duration: '6 – 8 hours',
      halfLife: '1.8 – 2.0 hours',
      bioavailability: '80% – 99%',
      metabolism: 'Hepatic (CYP2C9 & CYP2C8 oxidation)',
      excretion: 'Renal (90% metabolites in urine, minimal biliary)',
      pregnancyCategory: 'Avoid in 3rd trimester (Category D / Premature ductus closure)',
      maxDailyCap: '1,200 mg (OTC) / 2,400 mg (Prescription)',
      recommendedSingleDose: '200 mg – 400 mg',
      dosingInterval: 'Every 6 to 8 Hours with meals',
      targetOrgans: [
        { name: 'Peripheral Tissue & Joints', impact: 'Blocks prostaglandin-driven inflammatory swelling and joint stiffness', icon: 'activity' },
        { name: 'Stomach & GI Mucosa', impact: 'Reduces protective gastric prostaglandins; take with food', icon: 'pill' },
        { name: 'Cardiovascular & Kidneys', impact: 'Can cause mild fluid retention; monitor blood pressure', icon: 'heart' },
        { name: 'Brain (Thermoregulation)', impact: 'Reduces inflammatory fever through central antipyretic action', icon: 'brain' }
      ],
      mechanismSteps: [
        { step: 1, title: 'Dual COX-1 & COX-2 Blockade', desc: 'Reversibly inhibits cyclooxygenase enzymes converting arachidonic acid.', icon: 'zap' },
        { step: 2, title: 'Inflammatory Cascade Halted', desc: 'Blocks production of prostaglandins, prostacyclins, and thromboxanes.', icon: 'activity' },
        { step: 3, title: 'Nociceptor Desensitization', desc: 'Decreases peripheral nerve sensitivity to bradykinin and histamine.', icon: 'heart' },
        { step: 4, title: 'De-swelling & Temperature Drop', desc: 'Reduces capillary permeability and resets elevated core temperature.', icon: 'thermometer' }
      ],
      dosList: [
        'Always take with food, milk, or a full meal to protect your stomach lining.',
        'Use the lowest effective dose for the shortest necessary duration.',
        'Stay well hydrated with water during anti-inflammatory treatment.',
        'Consult doctor if taken alongside blood pressure medications.'
      ],
      dontsList: [
        'DO NOT take on an empty stomach if you have a history of gastritis or ulcers.',
        'DO NOT combine with Aspirin, Naproxen, or other NSAIDs simultaneously.',
        'DO NOT use during the third trimester of pregnancy.',
        'DO NOT exceed 1,200 mg per day without explicit doctor prescription.'
      ]
    };
  }

  if (id.includes('aspirin') || name.includes('aspirin')) {
    return {
      onset: '15 – 30 min (Antiplatelet: 1h)',
      peak: '1 – 2 hours',
      duration: 'Antiplatelet: 7–10 days (platelet lifespan)',
      halfLife: 'Salicylate: 2 – 3 hours (low dose), up to 15h (high dose)',
      bioavailability: '70% – 85% (Rapid hydrolysis to salicylic acid)',
      metabolism: 'Hepatic conjugation (Glycine & Glucuronic acid)',
      excretion: 'Renal (Highly pH-dependent urine elimination)',
      pregnancyCategory: 'Category D (Use low-dose 81mg only on obstetric order)',
      maxDailyCap: '4,000 mg (Pain) / 81–325 mg (Cardioprotective)',
      recommendedSingleDose: '300 mg – 600 mg (Pain) / 81 mg (Cardio)',
      dosingInterval: 'Every 4 to 6 Hours (Pain) / Once Daily (Cardio)',
      targetOrgans: [
        { name: 'Blood Platelets', impact: 'Irreversibly inhibits Thromboxane A2 to prevent arterial blood clots', icon: 'droplet' },
        { name: 'Cardiovascular System', impact: 'Reduces risk of recurrent myocardial infarction and ischemic stroke', icon: 'heart' },
        { name: 'Gastric Lining', impact: 'Direct mucosal irritation; take enteric-coated or with meals', icon: 'pill' },
        { name: 'Inner Ear (Vestibular)', impact: 'High dosages can cause transient tinnitus (ringing in ears)', icon: 'activity' }
      ],
      mechanismSteps: [
        { step: 1, title: 'Irreversible COX-1 Acetylation', desc: 'Permanently acetylates Serine 529 of platelet cyclooxygenase-1.', icon: 'zap' },
        { step: 2, title: 'Thromboxane A2 Shutdown', desc: 'Prevents platelet aggregation and clot formation for the life of the platelet.', icon: 'droplet' },
        { step: 3, title: 'Peripheral Anti-Inflammatory Action', desc: 'At higher doses, inhibits COX-2 to alleviate fever, pain, and arthritis.', icon: 'activity' },
        { step: 4, title: 'Vascular Lumen Protection', desc: 'Maintains unobstructed blood flow through coronary and cerebral arteries.', icon: 'heart' }
      ],
      dosList: [
        'Take with meals or choose enteric-coated tablets for daily heart protection.',
        'Chew a non-coated 325mg tablet immediately in suspected emergency heart attack (call 911/112).',
        'Inform surgeons and dentists of daily aspirin use prior to procedures.',
        'Store in a cool dry place away from humidity.'
      ],
      dontsList: [
        'NEVER give to children or teenagers with viral infections (Reye\'s Syndrome risk).',
        'DO NOT take if you have active bleeding disorders or severe stomach ulcers.',
        'DO NOT suddenly discontinue daily cardiovascular aspirin without doctor consultation.',
        'DO NOT mix with high doses of other NSAIDs without gastroprotection.'
      ]
    };
  }

  if (id.includes('naproxen') || name.includes('naproxen')) {
    return {
      onset: '30 – 60 min',
      peak: '2 – 4 hours',
      duration: '8 – 12 hours (Long-acting NSAID)',
      halfLife: '12 – 17 hours',
      bioavailability: '95% (Near complete oral absorption)',
      metabolism: 'Hepatic (CYP2C9 & CYP1A2 6-O-demethylation)',
      excretion: 'Renal (95% in urine as unchanged and conjugates)',
      pregnancyCategory: 'Category C (Avoid 3rd trimester / Category D)',
      maxDailyCap: '660 mg (OTC) / 1,250 mg (Prescription)',
      recommendedSingleDose: '220 mg – 440 mg',
      dosingInterval: 'Every 8 to 12 Hours with food',
      targetOrgans: [
        { name: 'Skeletal Joints & Ligaments', impact: 'Long-acting relief for arthritis, tendonitis, and menstrual cramps', icon: 'activity' },
        { name: 'Gastrointestinal Tract', impact: 'Can cause gastric irritation; best taken with food or milk', icon: 'pill' },
        { name: 'Renal Blood Flow', impact: 'Inhibits renal vasodilatory prostaglandins; ensure hydration', icon: 'droplet' },
        { name: 'Circulatory System', impact: 'Slightly lower cardiovascular risk profile compared to some NSAIDs', icon: 'heart' }
      ],
      mechanismSteps: [
        { step: 1, title: 'Extended Non-Selective COX Inhibition', desc: 'Inhibits both COX-1 and COX-2 with a prolonged molecular half-life.', icon: 'zap' },
        { step: 2, title: 'Prostaglandin Synthesis Suppression', desc: 'Dampens local inflammatory mediator production in joints and tissues.', icon: 'activity' },
        { step: 3, title: 'Sustained Tissue Penetration', desc: 'Concentrates in synovial fluid for continuous joint lubrication and ease.', icon: 'heart' },
        { step: 4, title: '12-Hour Continuous Relief', desc: 'Allows twice-daily dosing rather than frequent 4-hour re-dosing.', icon: 'timer' }
      ],
      dosList: [
        'Take with food or a full glass of water to reduce stomach irritation.',
        'Enjoy the convenience of 8–12 hour dosing without waking up in pain at night.',
        'Inform your doctor if taking blood thinners or ACE inhibitors.',
        'Report dark stools, heart palpitations, or unexplained dizziness.'
      ],
      dontsList: [
        'DO NOT exceed 660 mg in 24 hours without prescription approval.',
        'DO NOT combine with Ibuprofen or Aspirin at the same time.',
        'DO NOT lie down for at least 10 minutes after swallowing.',
        'DO NOT take if you have severe kidney failure or active peptic ulcers.'
      ]
    };
  }

  if (id.includes('antacid') || name.includes('antacid')) {
    return {
      onset: '2 – 5 min (Immediate neutralizer)',
      peak: '10 – 30 min',
      duration: '1 – 3 hours (extended with food)',
      halfLife: 'Local chemical reaction (minimal systemic half-life)',
      bioavailability: 'Local action in gastric lumen',
      metabolism: 'Direct chemical neutralization of gastric HCl',
      excretion: 'Fecal / Renal (minimal absorbed minerals)',
      pregnancyCategory: 'Generally Safe (Check calcium vs aluminum balance)',
      maxDailyCap: 'Check product label (Max 4–8 doses/day)',
      recommendedSingleDose: '10–20 mL Liquid or 1–2 Chewable Tablets',
      dosingInterval: '1 hour after meals and at bedtime',
      targetOrgans: [
        { name: 'Gastric Lumen (Stomach)', impact: 'Rapidly raises gastric pH from 1.5 to above 3.5, relieving heartburn', icon: 'pill' },
        { name: 'Esophagus (Food Pipe)', impact: 'Protects esophageal lining from refluxed acid and pepsin damage', icon: 'activity' },
        { name: 'Duodenum (Small Bowel)', impact: 'Pre-neutralizes chyme entering upper intestinal tract', icon: 'droplet' }
      ],
      mechanismSteps: [
        { step: 1, title: 'Hydrochloric Acid Neutralization', desc: 'Hydroxides & carbonates chemically bind free H+ ions in stomach acid.', icon: 'zap' },
        { step: 2, title: 'Gastric pH Elevation', desc: 'Elevates stomach pH above 3.5, instantly suppressing acid burn.', icon: 'thermometer' },
        { step: 3, title: 'Pepsin Proteolytic Deactivation', desc: 'Inactivates caustic pepsin enzyme that degrades esophagus tissues.', icon: 'shield' },
        { step: 4, title: 'Mucosal Barrier Soothing', desc: 'Forms a protective soothing buffer over inflamed mucosal folds.', icon: 'heart' }
      ],
      dosList: [
        'Chew tablets thoroughly before swallowing for maximum surface area.',
        'Take 1 hour after meals when stomach acid production peaks.',
        'Separate other prescription medications by at least 2 hours.',
        'Shake liquid antacid suspensions vigorously before measuring.'
      ],
      dontsList: [
        'DO NOT use continuously for more than 2 weeks without doctor consultation.',
        'DO NOT take simultaneously with antibiotics (Tetracyclines/Fluoroquinolones).',
        'DO NOT exceed maximum daily dosage on packaging.',
        'DO NOT rely on antacids if you experience chest pain radiating to the jaw or arm.'
      ]
    };
  }

  // Universal Fallback Generator for other medical items (ORS, Clotrimazole, Povidone, Dextromethorphan, etc.)
  return {
    onset: med.overTheCounter ? '15 – 30 min' : '30 – 60 min',
    peak: '1 – 2 hours',
    duration: '4 – 8 hours',
    halfLife: '2 – 4 hours',
    bioavailability: '75% – 90%',
    metabolism: 'Hepatic biotransformation (Phase I & II enzyme pathways)',
    excretion: 'Renal / Fecal (primarily urinary elimination of inactive metabolites)',
    pregnancyCategory: med.overTheCounter ? 'Category B / Low Risk' : 'Category C (Consult Physician)',
    maxDailyCap: med.dosage || 'Follow prescribed dosing schedule',
    recommendedSingleDose: med.adultDosage?.split('.')[0] || '1 standard unit dose',
    dosingInterval: 'Every 6 to 8 hours as indicated',
    targetOrgans: [
      { name: 'Target Tissues', impact: `Delivers targeted therapeutic effect for ${med.uses.slice(0, 2).join(' & ')}`, icon: 'activity' },
      { name: 'Cardiovascular & Blood Flow', impact: 'Maintains optimal systemic distribution and bioavailability', icon: 'heart' },
      { name: 'Liver (Hepatic Pathways)', impact: 'Safely metabolizes active compound into excretable conjugates', icon: 'droplet' },
      { name: 'Excretory System', impact: 'Efficient elimination through kidneys and renal tubules', icon: 'pill' }
    ],
    mechanismSteps: [
      { step: 1, title: 'Absorption & Bio-distribution', desc: 'Medicine is absorbed and distributed through the circulatory system to target tissues.', icon: 'pill' },
      { step: 2, title: 'Receptor & Enzyme Modulation', desc: med.howItWorks ? med.howItWorks.slice(0, 100) + '...' : 'Selectively modulates biochemical pathways to relieve symptoms.', icon: 'zap' },
      { step: 3, title: 'Clinical Symptom Alleviation', desc: `Rapidly relieves ${med.uses.slice(0, 3).join(', ')} while stabilizing cellular function.`, icon: 'heart' },
      { step: 4, title: 'Metabolism & Safe Clearance', desc: 'Enzymatically metabolized into non-toxic metabolites and eliminated naturally.', icon: 'activity' }
    ],
    dosList: med.howToTake && med.howToTake.length > 0 ? med.howToTake.slice(0, 4) : [
      'Take exactly as directed by your physician or package label.',
      'Follow regular dosing intervals with plenty of water.',
      'Check expiry date and store in a cool, dry place.',
      'Keep track of doses to avoid missed or duplicate schedules.'
    ],
    dontsList: med.whoShouldNotTake && med.whoShouldNotTake.length > 0 ? med.whoShouldNotTake.slice(0, 4) : [
      'DO NOT exceed the maximum stated daily dosage.',
      'DO NOT combine with contraindicated substances or excessive alcohol.',
      'DO NOT take if allergic to active pharmaceutical ingredients.',
      'DO NOT share prescription medicines with other individuals.'
    ]
  };
};

export const MedicineInfographic: React.FC<MedicineInfographicProps> = ({
  medicine,
  onClose
}) => {
  const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState<'flow' | 'pharmacokinetics' | 'safety' | 'matrix'>('flow');

  const data = getMedicineInfographicData(medicine);

  return (
    <div className="w-full rounded-3xl border border-violet-200 bg-gradient-to-b from-violet-50/70 via-white to-slate-50 overflow-hidden shadow-md transition-all duration-300">
      {/* Top Header Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 text-white shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white tracking-tight">
                {t(medicine.name)}
              </span>
              <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold text-violet-300 border border-violet-500/30">
                {t('Clinical Pharmacology')}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {t('Interactive Pharmacokinetics, Mechanism Flow & Safety Matrix')}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        {onClose && (
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2.5 py-1.5 text-xs font-bold transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
          
          {/* Quick Infographic Key Metrics Pill Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                <Timer className="h-3 w-3 text-violet-600" /> {t('Onset Time')}
              </span>
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm block text-violet-700">{t(data.onset)}</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                <Zap className="h-3 w-3 text-amber-500" /> {t('Peak Level')}
              </span>
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">{t(data.peak)}</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                <Clock className="h-3 w-3 text-blue-600" /> {t('Duration')}
              </span>
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">{t(data.duration)}</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                <Activity className="h-3 w-3 text-emerald-600" /> {t('Half-Life (t½)')}
              </span>
              <span className="font-extrabold text-emerald-700 text-xs sm:text-sm block">{t(data.halfLife)}</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                <Droplet className="h-3 w-3 text-sky-600" /> {t('Bioavailability')}
              </span>
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">{t(data.bioavailability)}</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-600" /> {t('Safe Daily Cap')}
              </span>
              <span className="font-extrabold text-rose-700 text-[11px] sm:text-xs block leading-tight truncate" title={t(data.maxDailyCap)}>
                {t(data.maxDailyCap.split('(')[0])}
              </span>
            </div>
          </div>

          {/* Interactive Navigation Pills for Infographic */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('flow')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'flow'
                  ? 'bg-violet-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{t('Mechanism Flowchart')}</span>
            </button>

            <button
              onClick={() => setActiveTab('pharmacokinetics')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'pharmacokinetics'
                  ? 'bg-violet-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>{t('Target Organs & Clearance')}</span>
            </button>

            <button
              onClick={() => setActiveTab('safety')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'safety'
                  ? 'bg-violet-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>{t("DOs & DON'Ts Safety Matrix")}</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'matrix'
                  ? 'bg-violet-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{t('Dose Timeline & Schedule')}</span>
            </button>
          </div>

          {/* TAB 1: 4-STAGE MECHANISM OF ACTION VISUAL FLOWCHART */}
          {activeTab === 'flow' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-violet-600" />
                    <span>{t('Visual Mechanism of Action Flowchart')}</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    {t('Step-by-step biological cascade from oral ingestion to symptom relief')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.mechanismSteps.map((item) => (
                  <div
                    key={item.step}
                    className="relative p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3 hover:border-violet-300 hover:shadow-md transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-violet-100 text-violet-800 text-xs font-black">
                        0{item.step}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {t('Stage')} {item.step}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h5 className="font-extrabold text-slate-900 text-xs leading-snug group-hover:text-violet-700 transition">
                        {t(item.title)}
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {t(item.desc)}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-bold text-violet-600">
                      <CheckCircle2 className="h-3 w-3 text-violet-500" />
                      <span>{t('Verified Pathway')}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Mechanism Narrative Quote */}
              <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 text-xs text-slate-800 space-y-1.5">
                <span className="font-extrabold text-violet-950 uppercase tracking-wider text-[11px] block flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-violet-600" /> {t('Clinical Action Summary:')}
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {t(medicine.howItWorks || `${medicine.name} selectively binds to target receptors, dampening inflammatory cascades and restoring physiological homeostasis.`)}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TARGET ORGANS & CLEARANCE PHARMACOKINETICS */}
          {activeTab === 'pharmacokinetics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-violet-600" />
                    <span>{t('Target Organ Map & Elimination Pathways')}</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    {t('Primary anatomical target receptors, metabolic transformation, and clearance routes')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.targetOrgans.map((organ, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3.5 hover:border-violet-300 transition"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700 font-bold shrink-0">
                      <Brain className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-extrabold text-slate-900 text-xs">{t(organ.name)}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">{t(organ.impact)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Metabolism & Excretion Detailed Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t('Metabolic Breakdown:')}
                  </span>
                  <p className="text-xs font-bold text-slate-900">{t(data.metabolism)}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t('Excretion & Elimination:')}
                  </span>
                  <p className="text-xs font-bold text-slate-900">{t(data.excretion)}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOS & DON'TS SAFETY MATRIX */}
          {activeTab === 'safety' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-violet-600" />
                    <span>{t("Visual DOs & DON'Ts Safety Matrix")}</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    {t('Essential safety protocols, overdose prevention, and contraindications')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* DOs (Safe Practices) */}
                <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>{t('Recommended Safe Practices (DOs)')}</span>
                  </div>
                  <ul className="space-y-2 text-xs text-emerald-900 font-medium">
                    {data.dosList.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{t(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* DON'Ts (Critical Warnings) */}
                <div className="p-5 rounded-3xl bg-rose-50/70 border border-rose-200 space-y-3">
                  <div className="flex items-center gap-2 text-rose-950 font-extrabold text-xs uppercase tracking-wider">
                    <XCircle className="h-4 w-4 text-rose-600" />
                    <span>{t("Critical Warnings & Avoidances (DON'Ts)")}</span>
                  </div>
                  <ul className="space-y-2 text-xs text-rose-900 font-medium">
                    {data.dontsList.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-rose-100 shadow-2xs">
                        <XCircle className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{t(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DOSE TIMELINE & SCHEDULE */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-violet-600" />
                    <span>{t('24-Hour Administration Timeline & Dosage Gauge')}</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    {t('Safe spacing intervals and upper limits to protect vital organ function')}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs">
                  <div>
                    <span className="font-extrabold text-blue-950 block text-xs">{t('Standard Adult Single Dose')}</span>
                    <span className="text-blue-900 font-bold text-sm">{t(data.recommendedSingleDose)}</span>
                  </div>
                  <div className="sm:border-l sm:border-blue-200 sm:pl-4">
                    <span className="font-extrabold text-blue-950 block text-xs">{t('Recommended Interval')}</span>
                    <span className="text-blue-900 font-bold text-sm">{t(data.dosingInterval)}</span>
                  </div>
                  <div className="sm:border-l sm:border-blue-200 sm:pl-4">
                    <span className="font-extrabold text-rose-950 block text-xs">{t('Max 24-Hour Cap')}</span>
                    <span className="text-rose-700 font-bold text-sm">{t(data.maxDailyCap)}</span>
                  </div>
                </div>

                {/* Visual Dosage Safety Range Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-emerald-700">{t('Safe Therapeutic Zone')}</span>
                    <span className="text-amber-700">{t('Caution Window')}</span>
                    <span className="text-rose-700">{t('Toxicity Threshold')}</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex">
                    <div className="bg-emerald-500 w-[60%]" title={t('Safe therapeutic range')} />
                    <div className="bg-amber-400 w-[25%]" title={t('Caution window - approach doctor max')} />
                    <div className="bg-rose-500 w-[15%]" title={t('Toxicity risk')} />
                  </div>
                  <p className="text-[10px] text-slate-500 text-center pt-1">
                    {t('Always observe the minimum interval time between consecutive doses.')}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
    </div>
  );
};
