import { CalculatorItem } from './calculatorsData';

export const CALCULATORS_GROUP_2: CalculatorItem[] = [
  // 11. Ovulation Calculator
  {
    id: 'ovulation',
    number: 11,
    title: 'Ovulation Calculator',
    category: 'Pregnancy & Pediatrics',
    description: 'Estimate fertile window and ovulation day based on average menstrual cycle length.',
    inputs: [
      { id: 'cycleLength', label: 'Average Cycle Length', type: 'number', defaultValue: 28, min: 20, max: 45, unit: 'days' },
      { id: 'lmpDaysAgo', label: 'Days since last period started', type: 'number', defaultValue: 10, min: 1, max: 35, unit: 'days' }
    ],
    calculate: (v) => {
      const ovulationDayInCycle = v.cycleLength - 14;
      const daysUntilOvulation = ovulationDayInCycle - v.lmpDaysAgo;
      return {
        primaryResult: daysUntilOvulation >= 0 ? `In ${daysUntilOvulation} days` : `Passed ${Math.abs(daysUntilOvulation)} days ago`,
        primaryLabel: 'Estimated Ovulation Day',
        status: 'Peak Fertility Window: Days ' + (ovulationDayInCycle - 3) + ' to ' + (ovulationDayInCycle + 1) + ' of cycle',
        statusColor: 'emerald'
      };
    }
  },
  // 12. Water Intake Calculator
  {
    id: 'water-intake',
    number: 12,
    title: 'Water Intake Calculator',
    category: 'Nutrition & Macros',
    description: 'Calculate daily fluid requirements adjusting for body weight, activity, and climate.',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 70, min: 30, max: 200, unit: 'kg' },
      { id: 'activityMins', label: 'Exercise Duration', type: 'number', defaultValue: 30, min: 0, max: 180, unit: 'mins' },
      { id: 'climate', label: 'Climate Environment', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Moderate', value: 'moderate' },
        { label: 'Hot / Humid (+0.5 L)', value: 'hot' }
      ]}
    ],
    calculate: (v) => {
      let liters = (v.weight * 0.033) + (v.activityMins / 30) * 0.35;
      if (v.climate === 'hot') liters += 0.5;
      const glasses = Math.round(liters * 4);
      return {
        primaryResult: `${liters.toFixed(2)} Liters/day`,
        primaryLabel: 'Hydration Requirement',
        status: `Approximately ${glasses} glasses (250ml each)`,
        statusColor: 'emerald'
      };
    }
  },
  // 13. Protein Intake Calculator
  {
    id: 'protein-intake',
    number: 13,
    title: 'Protein Intake Calculator',
    category: 'Nutrition & Macros',
    description: 'Calculate target daily protein intake tailored for sedentariness, fitness, or hypertrophy.',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 70, min: 30, max: 200, unit: 'kg' },
      { id: 'goal', label: 'Physical Activity & Goal', type: 'select', defaultValue: '1.6', options: [
        { label: 'Sedentary Health (0.8 g/kg)', value: '0.8' },
        { label: 'Active / Endurance (1.4 g/kg)', value: '1.4' },
        { label: 'Strength / Muscle Hypertrophy (1.8 g/kg)', value: '1.8' },
        { label: 'Aggressive Fat Loss Preservation (2.2 g/kg)', value: '2.2' }
      ]}
    ],
    calculate: (v) => {
      const gPerKg = Number(v.goal);
      const targetGrams = Math.round(v.weight * gPerKg);
      return {
        primaryResult: `${targetGrams} grams/day`,
        primaryLabel: 'Daily Dietary Protein Target',
        status: `${(targetGrams * 4)} kcal from protein`,
        statusColor: 'emerald'
      };
    }
  },
  // 14. Carbohydrate Intake Calculator
  {
    id: 'carbohydrate-intake',
    number: 14,
    title: 'Carbohydrate Intake Calculator',
    category: 'Nutrition & Macros',
    description: 'Calculate daily carbohydrate needs based on total daily calorie target and diet strategy.',
    inputs: [
      { id: 'calories', label: 'Daily Calorie Target', type: 'number', defaultValue: 2000, min: 1000, max: 5000, unit: 'kcal' },
      { id: 'dietType', label: 'Dietary Strategy', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Low Carb (20% calories)', value: '0.20' },
        { label: 'Moderate Carb (45% calories)', value: '0.45' },
        { label: 'High Carb / Endurance (60% calories)', value: '0.60' }
      ]}
    ],
    calculate: (v) => {
      const carbCalories = v.calories * Number(v.dietType);
      const carbGrams = Math.round(carbCalories / 4);
      return {
        primaryResult: `${carbGrams} grams/day`,
        primaryLabel: 'Target Carbohydrate Intake',
        status: `${Math.round(carbCalories)} kcal from carbs`,
        statusColor: 'emerald'
      };
    }
  },
  // 15. Fat Intake Calculator
  {
    id: 'fat-intake',
    number: 15,
    title: 'Fat Intake Calculator',
    category: 'Nutrition & Macros',
    description: 'Calculate healthy daily dietary fat targets (essential fatty acids and lipophilic absorption).',
    inputs: [
      { id: 'calories', label: 'Daily Calorie Target', type: 'number', defaultValue: 2000, min: 1000, max: 5000, unit: 'kcal' },
      { id: 'fatPercent', label: 'Fat Percentage of Calories', type: 'number', defaultValue: 30, min: 15, max: 50, unit: '%' }
    ],
    calculate: (v) => {
      const fatCal = v.calories * (v.fatPercent / 100);
      const fatGrams = Math.round(fatCal / 9);
      return {
        primaryResult: `${fatGrams} grams/day`,
        primaryLabel: 'Target Dietary Fat Intake',
        status: `${Math.round(fatCal)} kcal from dietary fat`,
        statusColor: 'emerald'
      };
    }
  },
  // 16. Blood Pressure Interpretation Calculator
  {
    id: 'bp-interpretation',
    number: 16,
    title: 'Blood Pressure Interpretation Calculator',
    category: 'Cardiovascular & Heart',
    description: 'Classify blood pressure readings according to AHA/ACC guidelines.',
    inputs: [
      { id: 'systolic', label: 'Systolic (Top number)', type: 'number', defaultValue: 124, min: 70, max: 240, unit: 'mmHg' },
      { id: 'diastolic', label: 'Diastolic (Bottom number)', type: 'number', defaultValue: 82, min: 40, max: 140, unit: 'mmHg' }
    ],
    calculate: (v) => {
      const s = v.systolic;
      const d = v.diastolic;
      let stage = 'Normal';
      let color = 'emerald';
      if (s >= 180 || d >= 120) { stage = 'Hypertensive Crisis (Emergency)'; color = 'red'; }
      else if (s >= 140 || d >= 90) { stage = 'Stage 2 Hypertension'; color = 'red'; }
      else if ((s >= 130 && s <= 139) || (d >= 80 && d <= 89)) { stage = 'Stage 1 Hypertension'; color = 'amber'; }
      else if (s >= 120 && s <= 129 && d < 80) { stage = 'Elevated Blood Pressure'; color = 'amber'; }
      return {
        primaryResult: `${s}/${d} mmHg`,
        primaryLabel: 'Blood Pressure Reading',
        status: stage,
        statusColor: color,
        details: [
          { label: 'Pulse Pressure', value: `${s - d} mmHg` },
          { label: 'Mean Arterial Pressure (MAP)', value: `${Math.round(d + (s - d)/3)} mmHg` }
        ]
      };
    }
  },
  // 17. Diabetes Risk Calculator
  {
    id: 'diabetes-risk',
    number: 17,
    title: 'Diabetes Risk Calculator',
    category: 'Clinical & Labs',
    description: 'Evaluate ADA type 2 prediabetes and diabetes risk score.',
    inputs: [
      { id: 'age', label: 'Age Group', type: 'select', defaultValue: '0', options: [
        { label: 'Under 40 years (0 pts)', value: 0 },
        { label: '40–49 years (1 pt)', value: 1 },
        { label: '50–59 years (2 pts)', value: 2 },
        { label: '60+ years (3 pts)', value: 3 }
      ]},
      { id: 'bmiHigh', label: 'BMI >= 25', type: 'boolean', defaultValue: true },
      { id: 'familyHistory', label: 'Family History of Diabetes', type: 'boolean', defaultValue: false },
      { id: 'highBP', label: 'Diagnosed High Blood Pressure', type: 'boolean', defaultValue: true },
      { id: 'active', label: 'Physically Active Regularly', type: 'boolean', defaultValue: false }
    ],
    calculate: (v) => {
      let score = Number(v.age);
      if (v.bmiHigh) score += 2;
      if (v.familyHistory) score += 1;
      if (v.highBP) score += 1;
      if (!v.active) score += 1;
      const highRisk = score >= 5;
      return {
        primaryResult: `${score} / 10 Points`,
        primaryLabel: 'Type 2 Diabetes Risk Score',
        status: highRisk ? 'Increased Risk of Prediabetes/Diabetes' : 'Low to Moderate Risk',
        statusColor: highRisk ? 'red' : 'emerald',
        explanation: highRisk ? 'A score of 5 or higher indicates high risk for prediabetes or type 2 diabetes. Clinical screening (HbA1c) is recommended.' : 'Low risk score based on current parameters.'
      };
    }
  },
  // 18. Kidney Function (eGFR) Calculator
  {
    id: 'egfr-kidney',
    number: 18,
    title: 'Kidney Function (eGFR) Calculator',
    category: 'Kidney & Renal',
    description: 'Calculate Estimated Glomerular Filtration Rate using CKD-EPI formula.',
    inputs: [
      { id: 'creatinine', label: 'Serum Creatinine', type: 'number', defaultValue: 1.0, min: 0.2, max: 15.0, step: 0.1, unit: 'mg/dL' },
      { id: 'age', label: 'Age', type: 'number', defaultValue: 55, min: 18, max: 100, unit: 'years' },
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] }
    ],
    calculate: (v) => {
      const cr = v.creatinine;
      const k = v.gender === 'female' ? 0.7 : 0.9;
      const alpha = v.gender === 'female' ? -0.241 : -0.302;
      const genderMult = v.gender === 'female' ? 1.012 : 1.0;
      const egfr = 142 * Math.pow(Math.min(cr / k, 1), alpha) * Math.pow(Math.max(cr / k, 1), -1.200) * Math.pow(0.9938, v.age) * genderMult;
      let stage = 'G1: Normal or High (>=90)';
      let color = 'emerald';
      if (egfr < 15) { stage = 'G5: Kidney Failure (<15)'; color = 'red'; }
      else if (egfr < 30) { stage = 'G4: Severely Decreased (15-29)'; color = 'red'; }
      else if (egfr < 60) { stage = 'G3: Moderately Decreased (30-59)'; color = 'amber'; }
      else if (egfr < 90) { stage = 'G2: Mildly Decreased (60-89)'; color = 'emerald'; }
      return {
        primaryResult: `${Math.round(egfr)} mL/min/1.73m²`,
        primaryLabel: 'Estimated GFR (CKD-EPI)',
        status: stage,
        statusColor: color
      };
    }
  },
  // 19. Waist-to-Hip Ratio Calculator
  {
    id: 'waist-hip-ratio',
    number: 19,
    title: 'Waist-to-Hip Ratio Calculator',
    category: 'Body & Composition',
    description: 'Assess body fat distribution and cardiovascular risk using Waist-to-Hip ratio.',
    inputs: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
      { id: 'waist', label: 'Waist Circumference', type: 'number', defaultValue: 88, min: 50, max: 180, unit: 'cm' },
      { id: 'hip', label: 'Hip Circumference', type: 'number', defaultValue: 98, min: 50, max: 180, unit: 'cm' }
    ],
    calculate: (v) => {
      const whr = v.waist / v.hip;
      let highRisk = v.gender === 'male' ? whr >= 0.90 : whr >= 0.85;
      return {
        primaryResult: whr.toFixed(2),
        primaryLabel: 'Waist-to-Hip Ratio',
        status: highRisk ? 'Higher Cardiometabolic Risk' : 'Low / Healthy Metabolic Risk',
        statusColor: highRisk ? 'amber' : 'emerald'
      };
    }
  },
  // 20. Waist-to-Height Ratio Calculator
  {
    id: 'waist-height-ratio',
    number: 20,
    title: 'Waist-to-Height Ratio Calculator',
    category: 'Body & Composition',
    description: 'Evaluate central obesity risk using simple "Keep waist to less than half height" rule.',
    inputs: [
      { id: 'waist', label: 'Waist Circumference', type: 'number', defaultValue: 82, min: 40, max: 180, unit: 'cm' },
      { id: 'height', label: 'Height', type: 'number', defaultValue: 175, min: 100, max: 230, unit: 'cm' }
    ],
    calculate: (v) => {
      const wtr = v.waist / v.height;
      const healthy = wtr <= 0.50;
      return {
        primaryResult: wtr.toFixed(2),
        primaryLabel: 'Waist-to-Height Ratio',
        status: healthy ? 'Healthy Waist (<0.50)' : 'Increased Abdominal Obesity Risk (>0.50)',
        statusColor: healthy ? 'emerald' : 'amber'
      };
    }
  },
  // 21. Body Surface Area (BSA) Calculator
  {
    id: 'bsa',
    number: 21,
    title: 'Body Surface Area (BSA) Calculator',
    category: 'Clinical & Labs',
    description: 'Calculate Body Surface Area using Mosteller formula for clinical drug dosing.',
    inputs: [
      { id: 'height', label: 'Height', type: 'number', defaultValue: 175, min: 50, max: 240, unit: 'cm' },
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 70, min: 5, max: 250, unit: 'kg' }
    ],
    calculate: (v) => {
      const bsa = Math.sqrt((v.height * v.weight) / 3600);
      return {
        primaryResult: `${bsa.toFixed(2)} m²`,
        primaryLabel: 'Body Surface Area (Mosteller)',
        status: 'Clinical Dose Calculation Standard',
        statusColor: 'emerald'
      };
    }
  },
  // 22. Blood Alcohol Content (BAC) Calculator
  {
    id: 'bac',
    number: 22,
    title: 'Blood Alcohol Content (BAC) Calculator',
    category: 'Lifestyle & Wellness',
    description: 'Estimate Blood Alcohol Concentration using Widmark formula.',
    inputs: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 70, min: 40, max: 180, unit: 'kg' },
      { id: 'drinks', label: 'Standard Drinks Consumed', type: 'number', defaultValue: 2, min: 0, max: 20, unit: 'drinks' },
      { id: 'hours', label: 'Hours Since First Drink', type: 'number', defaultValue: 2, min: 0, max: 24, unit: 'hours' }
    ],
    calculate: (v) => {
      const alcoholGrams = v.drinks * 14; // 14g alcohol per standard drink
      const r = v.gender === 'male' ? 0.68 : 0.55;
      let bac = (alcoholGrams / (v.weight * 1000 * r)) * 100;
      bac = Math.max(0, bac - (v.hours * 0.015));
      const illegalDrive = bac >= 0.08;
      return {
        primaryResult: `${bac.toFixed(3)}%`,
        primaryLabel: 'Estimated BAC',
        status: illegalDrive ? 'Above Legal Driving Limit (0.08%)' : 'Below 0.08% Limit',
        statusColor: illegalDrive ? 'red' : 'emerald'
      };
    }
  },
  // 23. Smoking Cost Calculator
  {
    id: 'smoking-cost',
    number: 23,
    title: 'Smoking Cost Calculator',
    category: 'Lifestyle & Wellness',
    description: 'Calculate total financial expense and life hours lost from cigarette smoking.',
    inputs: [
      { id: 'packsPerDay', label: 'Packs per day', type: 'number', defaultValue: 1, min: 0.1, max: 5, step: 0.1, unit: 'packs' },
      { id: 'costPerPack', label: 'Cost per pack', type: 'number', defaultValue: 10, min: 1, max: 50, unit: '$' },
      { id: 'years', label: 'Years smoked', type: 'number', defaultValue: 5, min: 1, max: 60, unit: 'years' }
    ],
    calculate: (v) => {
      const dailyCost = v.packsPerDay * v.costPerPack;
      const yearlyCost = dailyCost * 365;
      const totalCost = yearlyCost * v.years;
      return {
        primaryResult: `$${Math.round(totalCost).toLocaleString()}`,
        primaryLabel: 'Total Spent on Smoking',
        status: `$${Math.round(yearlyCost).toLocaleString()} spent per year`,
        statusColor: 'amber'
      };
    }
  },
  // 24. Sleep Calculator
  {
    id: 'sleep-calc',
    number: 24,
    title: 'Sleep Calculator',
    category: 'Lifestyle & Wellness',
    description: 'Calculate optimal wake/sleep times based on 90-minute REM sleep cycles.',
    inputs: [
      { id: 'cycles', label: 'Desired Sleep Cycles', type: 'number', defaultValue: 5, min: 3, max: 7, unit: 'cycles' }
    ],
    calculate: (v) => {
      const sleepMinutes = v.cycles * 90 + 15; // 15 mins to fall asleep
      const hours = Math.floor(sleepMinutes / 60);
      const mins = sleepMinutes % 60;
      return {
        primaryResult: `${hours} hrs ${mins} mins`,
        primaryLabel: 'Target Sleep Duration',
        status: `${v.cycles} Complete 90-Min REM Cycles`,
        statusColor: 'emerald'
      };
    }
  },
  // 25. Target Heart Rate Calculator
  {
    id: 'target-hr',
    number: 25,
    title: 'Target Heart Rate Calculator',
    category: 'Cardiovascular & Heart',
    description: 'Calculate Karvonen formula target exercise heart rate zones.',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', defaultValue: 30, min: 15, max: 90, unit: 'years' },
      { id: 'resting', label: 'Resting HR', type: 'number', defaultValue: 60, min: 40, max: 100, unit: 'bpm' },
      { id: 'intensity', label: 'Target Intensity', type: 'number', defaultValue: 70, min: 50, max: 90, unit: '%' }
    ],
    calculate: (v) => {
      const max = 220 - v.age;
      const target = Math.round(((max - v.resting) * (v.intensity / 100)) + v.resting);
      return {
        primaryResult: `${target} bpm`,
        primaryLabel: 'Target Exercise Heart Rate',
        status: `${v.intensity}% Training Intensity`,
        statusColor: 'emerald'
      };
    }
  },
  // 26. Pace Calculator
  {
    id: 'pace-calculator',
    number: 26,
    title: 'Pace Calculator',
    category: 'Sports & Performance',
    description: 'Calculate running pace per kilometer or mile from total distance and time.',
    inputs: [
      { id: 'distKm', label: 'Distance', type: 'number', defaultValue: 10, min: 1, max: 100, unit: 'km' },
      { id: 'timeMins', label: 'Total Time', type: 'number', defaultValue: 50, min: 1, max: 600, unit: 'mins' }
    ],
    calculate: (v) => {
      const paceSec = (v.timeMins * 60) / v.distKm;
      const paceMins = Math.floor(paceSec / 60);
      const remSec = Math.round(paceSec % 60);
      return {
        primaryResult: `${paceMins}:${remSec < 10 ? '0' : ''}${remSec} min/km`,
        primaryLabel: 'Average Running Pace',
        status: `Speed: ${(v.distKm / (v.timeMins / 60)).toFixed(2)} km/h`,
        statusColor: 'emerald'
      };
    }
  },
  // 27. One-Rep Max (1RM) Calculator
  {
    id: 'one-rep-max',
    number: 27,
    title: 'One-Rep Max (1RM) Calculator',
    category: 'Sports & Performance',
    description: 'Calculate 1RM maximum strength using Epley formula.',
    inputs: [
      { id: 'weight', label: 'Weight Lifted', type: 'number', defaultValue: 100, min: 10, max: 500, unit: 'kg' },
      { id: 'reps', label: 'Repetitions', type: 'number', defaultValue: 5, min: 1, max: 15, unit: 'reps' }
    ],
    calculate: (v) => {
      const oneRm = Math.round(v.weight * (1 + v.reps / 30));
      return {
        primaryResult: `${oneRm} kg`,
        primaryLabel: 'Estimated 1-Rep Max (1RM)',
        status: 'Maximum Single Rep Capability',
        statusColor: 'emerald',
        details: [
          { label: '85% 1RM (5-rep working set)', value: `${Math.round(oneRm * 0.85)} kg` },
          { label: '70% 1RM (10-rep hypertrophy)', value: `${Math.round(oneRm * 0.70)} kg` }
        ]
      };
    }
  },
  // 28. Macronutrient Calculator
  {
    id: 'macro-calculator',
    number: 28,
    title: 'Macronutrient Calculator',
    category: 'Nutrition & Macros',
    description: 'Calculate complete daily Protein, Carb, and Fat grams tailored to health goals.',
    inputs: [
      { id: 'calories', label: 'Target Calories', type: 'number', defaultValue: 2200, min: 1200, max: 4500, unit: 'kcal' },
      { id: 'ratio', label: 'Macro Split Strategy', type: 'select', defaultValue: 'balanced', options: [
        { label: 'Balanced (30P / 40C / 30F)', value: 'balanced' },
        { label: 'High Protein (40P / 35C / 25F)', value: 'highP' },
        { label: 'Low Carb / Ketogenic (30P / 10C / 60F)', value: 'keto' }
      ]}
    ],
    calculate: (v) => {
      let p = 0.3, c = 0.4, f = 0.3;
      if (v.ratio === 'highP') { p = 0.4; c = 0.35; f = 0.25; }
      else if (v.ratio === 'keto') { p = 0.3; c = 0.1; f = 0.6; }
      const pG = Math.round((v.calories * p) / 4);
      const cG = Math.round((v.calories * c) / 4);
      const fG = Math.round((v.calories * f) / 9);
      return {
        primaryResult: `${pG}g Protein / ${cG}g Carbs / ${fG}g Fat`,
        primaryLabel: 'Daily Macronutrient Distribution',
        status: 'Optimal Macro Ratio',
        statusColor: 'emerald'
      };
    }
  },
  // 29. Healthy Weight Gain/Loss Calculator
  {
    id: 'weight-gain-loss',
    number: 29,
    title: 'Healthy Weight Gain/Loss Calculator',
    category: 'Nutrition & Macros',
    description: 'Calculate required timeline and safe weekly caloric deficit/surplus.',
    inputs: [
      { id: 'currentWeight', label: 'Current Weight', type: 'number', defaultValue: 85, min: 40, max: 200, unit: 'kg' },
      { id: 'targetWeight', label: 'Target Weight', type: 'number', defaultValue: 75, min: 40, max: 200, unit: 'kg' },
      { id: 'rateKgPerWeek', label: 'Weekly Rate', type: 'number', defaultValue: 0.5, min: 0.25, max: 1.0, step: 0.25, unit: 'kg/wk' }
    ],
    calculate: (v) => {
      const diff = Math.abs(v.currentWeight - v.targetWeight);
      const weeks = Math.round(diff / v.rateKgPerWeek);
      const dailyCalorieAdjustment = Math.round((v.rateKgPerWeek * 7700) / 7);
      return {
        primaryResult: `${weeks} Weeks`,
        primaryLabel: 'Estimated Timeline',
        status: `Daily Caloric ${v.targetWeight < v.currentWeight ? 'Deficit' : 'Surplus'}: ${dailyCalorieAdjustment} kcal`,
        statusColor: 'emerald'
      };
    }
  },
  // 30. Life Expectancy & Health Age Calculator
  {
    id: 'health-age',
    number: 30,
    title: 'Life Expectancy & Health Age Calculator',
    category: 'Lifestyle & Wellness',
    description: 'Estimate biological health age based on cardiovascular and lifestyle risk factors.',
    inputs: [
      { id: 'chronologicalAge', label: 'Actual Age', type: 'number', defaultValue: 45, min: 18, max: 90, unit: 'years' },
      { id: 'smoker', label: 'Tobacco Smoker', type: 'boolean', defaultValue: false },
      { id: 'exerciseDays', label: 'Exercise Days/Week', type: 'number', defaultValue: 4, min: 0, max: 7, unit: 'days' },
      { id: 'healthyDiet', label: 'Follow Heart-Healthy Diet', type: 'boolean', defaultValue: true }
    ],
    calculate: (v) => {
      let adj = 0;
      if (v.smoker) adj += 6;
      if (v.exerciseDays >= 3) adj -= 3;
      if (v.healthyDiet) adj -= 2;
      const bioAge = v.chronologicalAge + adj;
      return {
        primaryResult: `${bioAge} years`,
        primaryLabel: 'Estimated Biological Health Age',
        status: bioAge <= v.chronologicalAge ? 'Favorable Lifestyle Impact' : 'Elevated Health Age Risk',
        statusColor: bioAge <= v.chronologicalAge ? 'emerald' : 'amber'
      };
    }
  }
];
