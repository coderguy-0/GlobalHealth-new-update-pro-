import { PatientClinical, PrescriptionMedicine } from './doctorClinicalData';

export type SafetyLevel = 'block' | 'warning' | 'info';

export interface SafetyAlert {
  level: SafetyLevel;
  title: string;
  detail: string;
}

const ALLERGY_MAP: Record<string, string[]> = {
  penicillin: ['amoxicillin', 'ampicillin', 'penicillin', 'augmentin', 'piperacillin', 'cloxacillin'],
  aspirin: ['aspirin', 'acetylsalicylic', 'asa'],
  sulfonamides: ['sulfamethoxazole', 'cotrimoxazole', 'sulfadiazine', 'furosemide'],
  codeine: ['codeine', 'tramadol'],
  latex: [],
};

const CLASS_OF: Record<string, string> = {
  telmisartan: 'ARB', losartan: 'ARB', olmesartan: 'ARB', valsartan: 'ARB',
  ramipril: 'ACEI', enalapril: 'ACEI',
  apixaban: 'DOAC', rivaroxaban: 'DOAC', dabigatran: 'DOAC',
  warfarin: 'VKA',
  atorvastatin: 'statin', rosuvastatin: 'statin', rosuvas: 'statin',
  metformin: 'biguanide',
  bisoprolol: 'beta_blocker', metoprolol: 'beta_blocker', atenolol: 'beta_blocker',
  furosemide: 'loop_diuretic', torsemide: 'loop_diuretic',
  aspirin: 'antiplatelet', clopidogrel: 'antiplatelet',
};

const INTERACTIONS: { a: string; b: string; level: SafetyLevel; detail: string }[] = [
  { a: 'apixaban', b: 'aspirin', level: 'warning', detail: 'Combined anticoagulant + antiplatelet increases bleeding risk. Confirm indication and gastroprotection.' },
  { a: 'warfarin', b: 'aspirin', level: 'block', detail: 'High bleeding risk. Do not co-prescribe without a documented exception.' },
  { a: 'apixaban', b: 'clopidogrel', level: 'warning', detail: 'Dual antithrombotic therapy — bleeding risk. Limit duration if used post-ACS/PCI.' },
  { a: 'telmisartan', b: 'ramipril', level: 'block', detail: 'Dual RAS blockade (ARB + ACEI) is not recommended.' },
  { a: 'telmisartan', b: 'furosemide', level: 'info', detail: 'Additive hypotensive / renal effect. Recheck creatinine and potassium after titration.' },
  { a: 'atorvastatin', b: 'clarithromycin', level: 'warning', detail: 'CYP3A4 interaction may raise statin exposure. Consider holding or dose-reducing.' },
  { a: 'metformin', b: 'contrast', level: 'warning', detail: 'Hold metformin around iodinated contrast if eGFR is reduced.' },
];

export const FORMULARY: Array<Pick<PrescriptionMedicine, 'name' | 'strength' | 'form' | 'dose' | 'frequency' | 'duration' | 'route' | 'instructions' | 'quantity' | 'refills'>> = [
  { name: 'Telmisartan', strength: '40 mg', form: 'Tablet', dose: '1 tablet', frequency: 'Once daily', duration: '30 days', route: 'Oral', instructions: 'After food', quantity: 30, refills: 1 },
  { name: 'Metformin', strength: '500 mg', form: 'Tablet', dose: '1 tablet', frequency: 'Twice daily', duration: '30 days', route: 'Oral', instructions: 'With meals', quantity: 60, refills: 1 },
  { name: 'Atorvastatin', strength: '20 mg', form: 'Tablet', dose: '1 tablet', frequency: 'At night', duration: '30 days', route: 'Oral', instructions: '', quantity: 30, refills: 2 },
  { name: 'Apixaban', strength: '5 mg', form: 'Tablet', dose: '1 tablet', frequency: 'Twice daily', duration: '30 days', route: 'Oral', instructions: 'Do not skip doses', quantity: 60, refills: 0 },
  { name: 'Bisoprolol', strength: '5 mg', form: 'Tablet', dose: '1 tablet', frequency: 'Once daily', duration: '30 days', route: 'Oral', instructions: '', quantity: 30, refills: 1 },
  { name: 'Furosemide', strength: '40 mg', form: 'Tablet', dose: '1 tablet', frequency: 'Once daily', duration: '14 days', route: 'Oral', instructions: 'Morning', quantity: 14, refills: 0 },
  { name: 'Aspirin', strength: '75 mg', form: 'Tablet', dose: '1 tablet', frequency: 'Once daily', duration: '30 days', route: 'Oral', instructions: 'After food', quantity: 30, refills: 1 },
];

export interface OrderSet {
  id: string;
  label: string;
  indication: string;
  plan: string;
  labs: string[];
  imaging?: string;
  meds: string[];
}

export const ORDER_SETS: OrderSet[] = [
  {
    id: 'acs',
    label: 'Chest pain / ACS',
    indication: 'Possible acute coronary syndrome',
    plan: 'Urgent ECG correlation. Troponin serials. Anti-ischemic care as indicated. Cardiology/cath opinion if high risk. Avoid aspirin if allergic.',
    labs: ['Troponin I', 'Complete Blood Count', 'Electrolytes', 'Creatinine'],
    imaging: '12-Lead ECG',
    meds: ['Atorvastatin'],
  },
  {
    id: 'htn',
    label: 'Hypertension review',
    indication: 'Blood pressure follow-up',
    plan: 'Review home BP log. Continue or titrate antihypertensives. Lifestyle counselling. Recheck electrolytes/creatinine if on RAS blockade.',
    labs: ['Electrolytes', 'Creatinine'],
    meds: ['Telmisartan'],
  },
  {
    id: 'dm',
    label: 'Diabetes review',
    indication: 'Glycaemic monitoring',
    plan: 'Review HbA1c and fasting glucose. Reinforce diet/activity. Adjust metformin if tolerated. Screen for nephropathy.',
    labs: ['HbA1c', 'Fasting Blood Sugar', 'Creatinine'],
    meds: ['Metformin'],
  },
  {
    id: 'hf',
    label: 'Heart failure review',
    indication: 'Volume status / GDMT',
    plan: 'Assess congestion, weight, renal function. Review diuretic dose. Counsel daily weights and salt restriction.',
    labs: ['Electrolytes', 'Creatinine'],
    meds: ['Furosemide'],
  },
];

function norm(s: string) {
  return s.trim().toLowerCase();
}

function classOf(name: string): string | null {
  const n = norm(name);
  for (const [k, v] of Object.entries(CLASS_OF)) {
    if (n.includes(k)) return v;
  }
  return null;
}

export function evaluateMedicationSafety(
  patient: PatientClinical | null,
  current: PrescriptionMedicine[],
  candidate?: PrescriptionMedicine,
): SafetyAlert[] {
  if (!patient) return [{ level: 'block', title: 'No patient selected', detail: 'Bind a consented patient before prescribing.' }];
  const alerts: SafetyAlert[] = [];
  const pool = candidate ? [...current, candidate] : current;
  const names = pool.map((m) => norm(m.name)).filter(Boolean);

  for (const allergy of patient.allergies) {
    const key = norm(allergy);
    const hits = ALLERGY_MAP[key] || [key];
    for (const med of names) {
      if (hits.some((h) => med.includes(h))) {
        alerts.push({
          level: 'block',
          title: `Allergy conflict — ${allergy}`,
          detail: `${pool.find((m) => norm(m.name) === med)?.name || med} overlaps the documented ${allergy} allergy.`,
        });
      }
    }
  }

  const classes = names.map((n) => classOf(n)).filter(Boolean) as string[];
  const seen = new Map<string, number>();
  classes.forEach((c) => seen.set(c, (seen.get(c) || 0) + 1));
  seen.forEach((count, cls) => {
    if (count > 1) {
      alerts.push({
        level: 'warning',
        title: `Duplicate class — ${cls.replace('_', ' ')}`,
        detail: 'Two agents from the same therapeutic class are on this prescription. Confirm this is intentional.',
      });
    }
  });

  for (const rule of INTERACTIONS) {
    const hasA = names.some((n) => n.includes(rule.a));
    const hasB = names.some((n) => n.includes(rule.b));
    if (hasA && hasB) {
      alerts.push({ level: rule.level, title: `Interaction — ${rule.a} + ${rule.b}`, detail: rule.detail });
    }
  }

  const ongoing = patient.medications.map((m) => norm(m.name));
  for (const med of names) {
    if (ongoing.some((o) => o === med || o.includes(med) || med.includes(o))) {
      alerts.push({
        level: 'info',
        title: 'Already on this therapy',
        detail: `${med} is listed as a current medication. This may be a refill rather than a new start.`,
      });
    }
  }

  if (patient.consentStatus === 'denied' || patient.consentStatus === 'revoked') {
    alerts.push({ level: 'block', title: 'Consent not granted', detail: 'Prescribing against a denied/revoked record is not permitted.' });
  }

  const uniq = new Map<string, SafetyAlert>();
  alerts.forEach((a) => uniq.set(a.title + a.detail, a));
  const rank: Record<SafetyLevel, number> = { block: 0, warning: 1, info: 2 };
  return [...uniq.values()].sort((a, b) => rank[a.level] - rank[b.level]);
}

export function hasBlockingAlert(alerts: SafetyAlert[]) {
  return alerts.some((a) => a.level === 'block');
}
