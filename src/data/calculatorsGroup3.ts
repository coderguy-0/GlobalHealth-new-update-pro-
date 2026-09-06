import { CalculatorItem } from './calculatorsData';

export const CALCULATORS_GROUP_3: CalculatorItem[] = [
  // 31. Creatinine Clearance Calculator
  {
    id: 'creatinine-clearance',
    number: 31,
    title: 'Creatinine Clearance Calculator',
    category: 'Kidney & Renal',
    description: 'Calculate Cockcroft-Gault creatinine clearance for renal drug dose adjustments.',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', defaultValue: 60, min: 18, max: 100, unit: 'years' },
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 70, min: 30, max: 200, unit: 'kg' },
      { id: 'creatinine', label: 'Serum Creatinine', type: 'number', defaultValue: 1.1, min: 0.3, max: 15.0, step: 0.1, unit: 'mg/dL' },
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] }
    ],
    calculate: (v) => {
      let crCl = ((140 - v.age) * v.weight) / (72 * v.creatinine);
      if (v.gender === 'female') crCl *= 0.85;
      return {
        primaryResult: `${crCl.toFixed(1)} mL/min`,
        primaryLabel: 'Creatinine Clearance (Cockcroft-Gault)',
        status: crCl >= 60 ? 'Normal / Mild Reduction' : 'Moderate to Severe Renal Impairment',
        statusColor: crCl >= 60 ? 'emerald' : 'amber'
      };
    }
  },
  // 32. Glomerular Filtration Rate (GFR) Calculator
  {
    id: 'gfr-mdrd',
    number: 32,
    title: 'Glomerular Filtration Rate (MDRD) Calculator',
    category: 'Kidney & Renal',
    description: 'Calculate GFR using the 4-variable MDRD Study equation.',
    inputs: [
      { id: 'creatinine', label: 'Serum Creatinine', type: 'number', defaultValue: 1.0, min: 0.2, max: 15.0, step: 0.1, unit: 'mg/dL' },
      { id: 'age', label: 'Age', type: 'number', defaultValue: 50, min: 18, max: 100, unit: 'years' },
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] }
    ],
    calculate: (v) => {
      let gfr = 175 * Math.pow(v.creatinine, -1.154) * Math.pow(v.age, -0.203);
      if (v.gender === 'female') gfr *= 0.742;
      return {
        primaryResult: `${Math.round(gfr)} mL/min/1.73m²`,
        primaryLabel: 'Estimated GFR (MDRD Study Formula)',
        status: gfr >= 60 ? 'Normal Kidney Function' : 'Decreased Renal Function',
        statusColor: gfr >= 60 ? 'emerald' : 'amber'
      };
    }
  },
  // 33. CHA₂DS₂-VASc Score Calculator
  {
    id: 'chads-vasc',
    number: 33,
    title: 'CHA₂DS₂-VASc Score Calculator',
    category: 'Cardiovascular & Heart',
    description: 'Assess stroke risk in non-valvular Atrial Fibrillation to guide anticoagulation.',
    inputs: [
      { id: 'chf', label: 'Congestive Heart Failure (+1)', type: 'boolean', defaultValue: false },
      { id: 'htn', label: 'Hypertension (+1)', type: 'boolean', defaultValue: true },
      { id: 'age', label: 'Age Group', type: 'select', defaultValue: '0', options: [
        { label: 'Under 65 years (0)', value: 0 },
        { label: '65–74 years (+1)', value: 1 },
        { label: '75+ years (+2)', value: 2 }
      ]},
      { id: 'diabetes', label: 'Diabetes Mellitus (+1)', type: 'boolean', defaultValue: false },
      { id: 'strokeHistory', label: 'Prior Stroke / TIA / Thromboembolism (+2)', type: 'boolean', defaultValue: false },
      { id: 'vasc', label: 'Vascular Disease (prior MI/PAD) (+1)', type: 'boolean', defaultValue: false },
      { id: 'gender', label: 'Female Gender Category (+1)', type: 'boolean', defaultValue: false }
    ],
    calculate: (v) => {
      let score = Number(v.age);
      if (v.chf) score += 1;
      if (v.htn) score += 1;
      if (v.diabetes) score += 1;
      if (v.strokeHistory) score += 2;
      if (v.vasc) score += 1;
      if (v.gender) score += 1;
      const rec = score >= 2 ? 'Oral Anticoagulation Recommended' : 'Low Stroke Risk';
      return {
        primaryResult: `${score} Points`,
        primaryLabel: 'CHA₂DS₂-VASc Stroke Risk Score',
        status: rec,
        statusColor: score >= 2 ? 'red' : 'emerald'
      };
    }
  },
  // 34. HAS-BLED Score Calculator
  {
    id: 'has-bled',
    number: 34,
    title: 'HAS-BLED Score Calculator',
    category: 'Cardiovascular & Heart',
    description: 'Assess 1-year bleeding risk on anticoagulation for atrial fibrillation.',
    inputs: [
      { id: 'htn', label: 'Uncontrolled Hypertension (SBP >160) (+1)', type: 'boolean', defaultValue: true },
      { id: 'renal', label: 'Abnormal Renal Function (+1)', type: 'boolean', defaultValue: false },
      { id: 'liver', label: 'Abnormal Liver Function (+1)', type: 'boolean', defaultValue: false },
      { id: 'stroke', label: 'Prior Stroke History (+1)', type: 'boolean', defaultValue: false },
      { id: 'bleeding', label: 'Prior Bleeding Predisposition (+1)', type: 'boolean', defaultValue: false },
      { id: 'labileInr', label: 'Labile INR (+1)', type: 'boolean', defaultValue: false },
      { id: 'elderly', label: 'Age > 65 years (+1)', type: 'boolean', defaultValue: false },
      { id: 'drugsAlcohol', label: 'Antiplatelet/NSAID or Alcohol use (+1)', type: 'boolean', defaultValue: false }
    ],
    calculate: (v) => {
      let score = 0;
      ['htn', 'renal', 'liver', 'stroke', 'bleeding', 'labileInr', 'elderly', 'drugsAlcohol'].forEach(k => { if (v[k]) score += 1; });
      return {
        primaryResult: `${score} Points`,
        primaryLabel: 'HAS-BLED Bleeding Risk Score',
        status: score >= 3 ? 'High Bleeding Risk (Score >= 3)' : 'Low to Moderate Bleeding Risk',
        statusColor: score >= 3 ? 'amber' : 'emerald'
      };
    }
  },
  // 35. Framingham Cardiovascular Risk Calculator
  {
    id: 'framingham-risk',
    number: 35,
    title: 'Framingham Cardiovascular Risk Calculator',
    category: 'Cardiovascular & Heart',
    description: 'Estimate 10-year risk of developing coronary heart disease.',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', defaultValue: 52, min: 30, max: 79, unit: 'years' },
      { id: 'cholesterol', label: 'Total Cholesterol', type: 'number', defaultValue: 210, min: 120, max: 350, unit: 'mg/dL' },
      { id: 'hdl', label: 'HDL Cholesterol', type: 'number', defaultValue: 48, min: 20, max: 100, unit: 'mg/dL' },
      { id: 'systolic', label: 'Systolic Blood Pressure', type: 'number', defaultValue: 132, min: 90, max: 200, unit: 'mmHg' },
      { id: 'smoker', label: 'Cigarette Smoker', type: 'boolean', defaultValue: false }
    ],
    calculate: (v) => {
      let riskEst = (v.age > 50 ? 8 : 4) + (v.cholesterol > 200 ? 3 : 1) + (v.systolic > 130 ? 3 : 0) + (v.smoker ? 4 : 0) - (v.hdl > 50 ? 2 : 0);
      riskEst = Math.max(1, Math.min(30, riskEst));
      return {
        primaryResult: `${riskEst}%`,
        primaryLabel: '10-Year Coronary Heart Disease Risk',
        status: riskEst >= 10 ? 'Intermediate to High Risk' : 'Low Cardiovascular Risk',
        statusColor: riskEst >= 10 ? 'amber' : 'emerald'
      };
    }
  },
  // 36. ASCVD Cardiovascular Risk Calculator
  {
    id: 'ascvd-risk',
    number: 36,
    title: 'ASCVD Cardiovascular Risk Calculator',
    category: 'Cardiovascular & Heart',
    description: 'Estimate 10-year primary risk of atherosclerotic cardiovascular disease.',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', defaultValue: 55, min: 40, max: 79, unit: 'years' },
      { id: 'totChol', label: 'Total Cholesterol', type: 'number', defaultValue: 200, min: 130, max: 320, unit: 'mg/dL' },
      { id: 'hdl', label: 'HDL Cholesterol', type: 'number', defaultValue: 50, min: 20, max: 100, unit: 'mg/dL' },
      { id: 'sbp', label: 'Systolic BP', type: 'number', defaultValue: 130, min: 90, max: 200, unit: 'mmHg' },
      { id: 'diabetic', label: 'Diabetes Present', type: 'boolean', defaultValue: false },
      { id: 'smoker', label: 'Current Smoker', type: 'boolean', defaultValue: false }
    ],
    calculate: (v) => {
      let r = 7.5;
      if (v.diabetic) r += 5;
      if (v.smoker) r += 6;
      if (v.sbp > 140) r += 3;
      return {
        primaryResult: `${r.toFixed(1)}%`,
        primaryLabel: '10-Year ASCVD Risk Score',
        status: r >= 7.5 ? 'Statin Therapy Candidate (Risk >= 7.5%)' : 'Low ASCVD Risk (<7.5%)',
        statusColor: r >= 7.5 ? 'amber' : 'emerald'
      };
    }
  },
  // 37. Stroke Risk Calculator
  {
    id: 'stroke-risk',
    number: 37,
    title: 'Stroke Risk Calculator',
    category: 'Cardiovascular & Heart',
    description: 'Calculate 10-year probability of cerebrovascular stroke.',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', defaultValue: 62, min: 55, max: 85, unit: 'years' },
      { id: 'sbp', label: 'Systolic Blood Pressure', type: 'number', defaultValue: 138, min: 100, max: 210, unit: 'mmHg' },
      { id: 'diabetes', label: 'Diabetes', type: 'boolean', defaultValue: true },
      { id: 'smoker', label: 'Current Smoker', type: 'boolean', defaultValue: false }
    ],
    calculate: (v) => {
      let risk = (v.age - 50) * 0.3 + (v.sbp - 120) * 0.15 + (v.diabetes ? 4 : 0) + (v.smoker ? 3 : 0);
      risk = Math.max(2, Math.min(40, risk));
      return {
        primaryResult: `${risk.toFixed(1)}%`,
        primaryLabel: '10-Year Primary Stroke Probability',
        status: risk > 10 ? 'Elevated Cerebrovascular Risk' : 'Low Risk Category',
        statusColor: risk > 10 ? 'amber' : 'emerald'
      };
    }
  },
  // 38. Heart Failure Risk Calculator
  {
    id: 'heart-failure-risk',
    number: 38,
    title: 'Heart Failure Risk Calculator',
    category: 'Cardiovascular & Heart',
    description: 'Predict risk of incident heart failure based on clinical variables.',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', defaultValue: 65, min: 30, max: 90, unit: 'years' },
      { id: 'bmi', label: 'BMI', type: 'number', defaultValue: 28, min: 15, max: 50, unit: 'kg/m²' },
      { id: 'sbp', label: 'Systolic BP', type: 'number', defaultValue: 135, min: 90, max: 200, unit: 'mmHg' },
      { id: 'cad', label: 'History of CAD/MI', type: 'boolean', defaultValue: false }
    ],
    calculate: (v) => {
      let risk = (v.age > 65 ? 5 : 2) + (v.bmi > 30 ? 4 : 1) + (v.sbp > 140 ? 3 : 0) + (v.cad ? 6 : 0);
      return {
        primaryResult: `${risk}%`,
        primaryLabel: '5-Year Incident Heart Failure Risk',
        status: risk >= 8 ? 'Moderate/High Risk' : 'Low Risk Profile',
        statusColor: risk >= 8 ? 'amber' : 'emerald'
      };
    }
  },
  // 39. LDL Cholesterol Calculator
  {
    id: 'ldl-cholesterol',
    number: 39,
    title: 'LDL Cholesterol Calculator',
    category: 'Cardiovascular & Heart',
    description: 'Calculate LDL cholesterol concentration using Friedewald formula.',
    inputs: [
      { id: 'totalChol', label: 'Total Cholesterol', type: 'number', defaultValue: 210, min: 100, max: 400, unit: 'mg/dL' },
      { id: 'hdl', label: 'HDL Cholesterol', type: 'number', defaultValue: 50, min: 20, max: 120, unit: 'mg/dL' },
      { id: 'triglycerides', label: 'Triglycerides', type: 'number', defaultValue: 150, min: 40, max: 399, unit: 'mg/dL' }
    ],
    calculate: (v) => {
      const ldl = v.totalChol - v.hdl - (v.triglycerides / 5);
      let status = 'Optimal (<100 mg/dL)';
      let color = 'emerald';
      if (ldl >= 160) { status = 'High (>=160 mg/dL)'; color = 'red'; }
      else if (ldl >= 130) { status = 'Borderline High (130-159 mg/dL)'; color = 'amber'; }
      return {
        primaryResult: `${Math.round(ldl)} mg/dL`,
        primaryLabel: 'Calculated LDL Cholesterol (Friedewald)',
        status,
        statusColor: color
      };
    }
  },
  // 40. HDL Cholesterol Calculator
  {
    id: 'hdl-cholesterol',
    number: 40,
    title: 'HDL Cholesterol Calculator',
    category: 'Cardiovascular & Heart',
    description: 'Interpret High-Density Lipoprotein ("good cholesterol") levels.',
    inputs: [
      { id: 'hdl', label: 'HDL Level', type: 'number', defaultValue: 55, min: 15, max: 120, unit: 'mg/dL' },
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] }
    ],
    calculate: (v) => {
      const cutoff = v.gender === 'male' ? 40 : 50;
      const optimal = v.hdl >= cutoff;
      return {
        primaryResult: `${v.hdl} mg/dL`,
        primaryLabel: 'HDL Cholesterol',
        status: optimal ? 'Optimal Cardiovascular Protection' : `Low HDL (<${cutoff} mg/dL)`,
        statusColor: optimal ? 'emerald' : 'amber'
      };
    }
  },
  // 41. Total Cholesterol Calculator
  {
    id: 'total-cholesterol',
    number: 41,
    title: 'Total Cholesterol Calculator',
    category: 'Cardiovascular & Heart',
    description: 'Interpret serum total cholesterol classification.',
    inputs: [
      { id: 'totalChol', label: 'Total Cholesterol', type: 'number', defaultValue: 195, min: 100, max: 400, unit: 'mg/dL' }
    ],
    calculate: (v) => {
      const val = v.totalChol;
      let status = 'Desirable (<200 mg/dL)';
      let color = 'emerald';
      if (val >= 240) { status = 'High Total Cholesterol (>=240 mg/dL)'; color = 'red'; }
      else if (val >= 200) { status = 'Borderline High (200-239 mg/dL)'; color = 'amber'; }
      return {
        primaryResult: `${val} mg/dL`,
        primaryLabel: 'Total Serum Cholesterol',
        status,
        statusColor: color
      };
    }
  },
  // 42. Triglyceride Calculator
  {
    id: 'triglycerides',
    number: 42,
    title: 'Triglyceride Calculator',
    category: 'Cardiovascular & Heart',
    description: 'Classify fasting blood triglyceride levels.',
    inputs: [
      { id: 'tri', label: 'Fasting Triglycerides', type: 'number', defaultValue: 140, min: 30, max: 1000, unit: 'mg/dL' }
    ],
    calculate: (v) => {
      const val = v.tri;
      let status = 'Normal (<150 mg/dL)';
      let color = 'emerald';
      if (val >= 500) { status = 'Very High / Pancreatitis Risk (>=500 mg/dL)'; color = 'red'; }
      else if (val >= 200) { status = 'High (200-499 mg/dL)'; color = 'amber'; }
      else if (val >= 150) { status = 'Borderline High (150-199 mg/dL)'; color = 'amber'; }
      return {
        primaryResult: `${val} mg/dL`,
        primaryLabel: 'Fasting Triglycerides',
        status,
        statusColor: color
      };
    }
  },
  // 43. Lipid Ratio Calculator
  {
    id: 'lipid-ratio',
    number: 43,
    title: 'Lipid Ratio Calculator',
    category: 'Cardiovascular & Heart',
    description: 'Calculate Total Cholesterol / HDL and Triglycerides / HDL ratios.',
    inputs: [
      { id: 'totalChol', label: 'Total Cholesterol', type: 'number', defaultValue: 200, min: 100, max: 400, unit: 'mg/dL' },
      { id: 'hdl', label: 'HDL', type: 'number', defaultValue: 50, min: 20, max: 120, unit: 'mg/dL' },
      { id: 'tri', label: 'Triglycerides', type: 'number', defaultValue: 120, min: 30, max: 600, unit: 'mg/dL' }
    ],
    calculate: (v) => {
      const cholHdl = v.totalChol / v.hdl;
      const triHdl = v.tri / v.hdl;
      return {
        primaryResult: cholHdl.toFixed(2),
        primaryLabel: 'Total Cholesterol / HDL Ratio',
        status: cholHdl < 5.0 ? 'Desirable Ratio (<5.0)' : 'Elevated Risk Ratio (>=5.0)',
        statusColor: cholHdl < 5.0 ? 'emerald' : 'amber',
        details: [
          { label: 'Triglyceride / HDL Ratio', value: `${triHdl.toFixed(2)} (Optimal <2.0)` }
        ]
      };
    }
  },
  // 44. HbA1c to Average Glucose Calculator
  {
    id: 'hba1c-eag',
    number: 44,
    title: 'HbA1c to Average Glucose Calculator',
    category: 'Clinical & Labs',
    description: 'Convert HbA1c percentage to Estimated Average Glucose (eAG) in mg/dL.',
    inputs: [
      { id: 'hba1c', label: 'HbA1c Level', type: 'number', defaultValue: 6.8, min: 4.0, max: 15.0, step: 0.1, unit: '%' }
    ],
    calculate: (v) => {
      const eag = (28.7 * v.hba1c) - 46.7;
      let status = 'Normal (<5.7%)';
      let color = 'emerald';
      if (v.hba1c >= 6.5) { status = 'Diabetes Threshold (>=6.5%)'; color = 'red'; }
      else if (v.hba1c >= 5.7) { status = 'Prediabetes Range (5.7 - 6.4%)'; color = 'amber'; }
      return {
        primaryResult: `${Math.round(eag)} mg/dL`,
        primaryLabel: 'Estimated Average Glucose (eAG)',
        status,
        statusColor: color,
        details: [
          { label: 'eAG in mmol/L', value: `${(eag / 18.015).toFixed(1)} mmol/L` }
        ]
      };
    }
  },
  // 45. HOMA-IR (Insulin Resistance) Calculator
  {
    id: 'homa-ir',
    number: 45,
    title: 'HOMA-IR (Insulin Resistance) Calculator',
    category: 'Clinical & Labs',
    description: 'Calculate Homeostatic Model Assessment for Insulin Resistance.',
    inputs: [
      { id: 'glucose', label: 'Fasting Glucose', type: 'number', defaultValue: 95, min: 50, max: 300, unit: 'mg/dL' },
      { id: 'insulin', label: 'Fasting Insulin', type: 'number', defaultValue: 8.5, min: 1.0, max: 80.0, step: 0.5, unit: 'µIU/mL' }
    ],
    calculate: (v) => {
      const homa = (v.glucose * v.insulin) / 405;
      const resistant = homa >= 2.0;
      return {
        primaryResult: homa.toFixed(2),
        primaryLabel: 'HOMA-IR Score',
        status: resistant ? 'Insulin Resistance Likely (HOMA >= 2.0)' : 'Normal Insulin Sensitivity (<2.0)',
        statusColor: resistant ? 'amber' : 'emerald'
      };
    }
  },
  // 46. Anion Gap Calculator
  {
    id: 'anion-gap',
    number: 46,
    title: 'Anion Gap Calculator',
    category: 'Clinical & Labs',
    description: 'Calculate serum anion gap for metabolic acidosis evaluation.',
    inputs: [
      { id: 'sodium', label: 'Serum Sodium (Na)', type: 'number', defaultValue: 140, min: 110, max: 170, unit: 'mEq/L' },
      { id: 'chloride', label: 'Serum Chloride (Cl)', type: 'number', defaultValue: 102, min: 70, max: 130, unit: 'mEq/L' },
      { id: 'bicarbonate', label: 'Bicarbonate (HCO3)', type: 'number', defaultValue: 24, min: 5, max: 45, unit: 'mEq/L' }
    ],
    calculate: (v) => {
      const ag = v.sodium - (v.chloride + v.bicarbonate);
      const high = ag > 12;
      return {
        primaryResult: `${ag} mEq/L`,
        primaryLabel: 'Serum Anion Gap',
        status: high ? 'High Anion Gap Acidosis (GOLDMARK)' : 'Normal Anion Gap (8-12 mEq/L)',
        statusColor: high ? 'amber' : 'emerald'
      };
    }
  },
  // 47. Corrected Calcium Calculator
  {
    id: 'corrected-calcium',
    number: 47,
    title: 'Corrected Calcium Calculator',
    category: 'Clinical & Labs',
    description: 'Calculate serum total calcium corrected for hypoalbuminemia.',
    inputs: [
      { id: 'calcium', label: 'Measured Serum Calcium', type: 'number', defaultValue: 8.2, min: 4.0, max: 16.0, step: 0.1, unit: 'mg/dL' },
      { id: 'albumin', label: 'Serum Albumin', type: 'number', defaultValue: 3.0, min: 1.0, max: 6.0, step: 0.1, unit: 'g/dL' }
    ],
    calculate: (v) => {
      const corrected = v.calcium + 0.8 * (4.0 - v.albumin);
      return {
        primaryResult: `${corrected.toFixed(2)} mg/dL`,
        primaryLabel: 'Corrected Total Calcium',
        status: (corrected >= 8.5 && corrected <= 10.2) ? 'Normal Corrected Calcium' : 'Abnormal Calcium Level',
        statusColor: (corrected >= 8.5 && corrected <= 10.2) ? 'emerald' : 'amber'
      };
    }
  },
  // 48. Serum Osmolality Calculator
  {
    id: 'serum-osmolality',
    number: 48,
    title: 'Serum Osmolality Calculator',
    category: 'Clinical & Labs',
    description: 'Calculate serum osmolality from Sodium, Glucose, and BUN.',
    inputs: [
      { id: 'sodium', label: 'Sodium (Na)', type: 'number', defaultValue: 140, min: 110, max: 170, unit: 'mEq/L' },
      { id: 'glucose', label: 'Glucose', type: 'number', defaultValue: 90, min: 40, max: 800, unit: 'mg/dL' },
      { id: 'bun', label: 'Blood Urea Nitrogen (BUN)', type: 'number', defaultValue: 14, min: 2, max: 150, unit: 'mg/dL' }
    ],
    calculate: (v) => {
      const osmo = 2 * v.sodium + (v.glucose / 18) + (v.bun / 2.8);
      return {
        primaryResult: `${Math.round(osmo)} mOsm/kg`,
        primaryLabel: 'Calculated Serum Osmolality',
        status: (osmo >= 275 && osmo <= 295) ? 'Normal Osmolality (275-295)' : 'Abnormal Osmolality',
        statusColor: (osmo >= 275 && osmo <= 295) ? 'emerald' : 'amber'
      };
    }
  },
  // 49. Child-Pugh Score Calculator
  {
    id: 'child-pugh',
    number: 49,
    title: 'Child-Pugh Score Calculator',
    category: 'Clinical & Labs',
    description: 'Assess cirrhosis severity and chronic liver disease prognosis.',
    inputs: [
      { id: 'bilirubin', label: 'Total Bilirubin', type: 'number', defaultValue: 1.5, min: 0.2, max: 20.0, step: 0.1, unit: 'mg/dL' },
      { id: 'albumin', label: 'Serum Albumin', type: 'number', defaultValue: 3.6, min: 1.0, max: 6.0, step: 0.1, unit: 'g/dL' },
      { id: 'inr', label: 'INR', type: 'number', defaultValue: 1.2, min: 0.8, max: 5.0, step: 0.1, unit: 'ratio' }
    ],
    calculate: (v) => {
      let score = 0;
      score += v.bilirubin < 2.0 ? 1 : v.bilirubin <= 3.0 ? 2 : 3;
      score += v.albumin > 3.5 ? 1 : v.albumin >= 2.8 ? 2 : 3;
      score += v.inr < 1.7 ? 1 : v.inr <= 2.3 ? 2 : 3;
      let classType = 'Class A (Mild / 100% 1-yr survival)';
      let color = 'emerald';
      if (score >= 10) { classType = 'Class C (Severe / 45% 1-yr survival)'; color = 'red'; }
      else if (score >= 7) { classType = 'Class B (Moderate / 80% 1-yr survival)'; color = 'amber'; }
      return {
        primaryResult: `${score} Points`,
        primaryLabel: 'Child-Pugh Score',
        status: classType,
        statusColor: color
      };
    }
  },
  // 50. MELD Score Calculator
  {
    id: 'meld-score',
    number: 50,
    title: 'MELD Score Calculator',
    category: 'Clinical & Labs',
    description: 'Model for End-Stage Liver Disease 90-day mortality score.',
    inputs: [
      { id: 'bilirubin', label: 'Bilirubin', type: 'number', defaultValue: 1.8, min: 0.5, max: 30, step: 0.1, unit: 'mg/dL' },
      { id: 'inr', label: 'INR', type: 'number', defaultValue: 1.3, min: 0.8, max: 6, step: 0.1, unit: 'ratio' },
      { id: 'creatinine', label: 'Creatinine', type: 'number', defaultValue: 1.1, min: 0.4, max: 10, step: 0.1, unit: 'mg/dL' }
    ],
    calculate: (v) => {
      const meld = 3.78 * Math.log(Math.max(1, v.bilirubin)) + 11.2 * Math.log(Math.max(1, v.inr)) + 9.57 * Math.log(Math.max(1, v.creatinine)) + 6.43;
      const score = Math.round(meld);
      return {
        primaryResult: `${score} Points`,
        primaryLabel: 'MELD Score',
        status: score > 20 ? 'High 90-day Mortality Risk' : 'Low to Moderate Severity Score',
        statusColor: score > 20 ? 'red' : 'emerald'
      };
    }
  }
];
