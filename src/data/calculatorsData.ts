import { CALCULATORS_GROUP_2 } from './calculatorsGroup2';
import { CALCULATORS_GROUP_3 } from './calculatorsGroup3';
import { CALCULATORS_GROUP_4 } from './calculatorsGroup4';

export interface CalculatorInput {
  id: string;
  label: string;
  type: 'number' | 'select' | 'boolean';
  defaultValue: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { label: string; value: string | number }[];
}

export interface CalculatorItem {
  id: string;
  number: number;
  title: string;
  category: 'Body & Composition' | 'Nutrition & Macros' | 'Cardiovascular & Heart' | 'Clinical & Labs' | 'Kidney & Renal' | 'Pregnancy & Pediatrics' | 'Sports & Performance' | 'Lifestyle & Wellness';
  description: string;
  inputs: CalculatorInput[];
  calculate: (inputs: Record<string, any>) => {
    primaryResult: string;
    primaryLabel: string;
    status?: string;
    statusColor?: string;
    details?: { label: string; value: string }[];
    explanation?: string;
  };
}

export const CALCULATOR_CATEGORIES = [
  'All',
  'Body & Composition',
  'Nutrition & Macros',
  'Cardiovascular & Heart',
  'Clinical & Labs',
  'Kidney & Renal',
  'Pregnancy & Pediatrics',
  'Sports & Performance',
  'Lifestyle & Wellness'
] as const;

export const CALCULATORS_GROUP_1: CalculatorItem[] = [
  // 1. BMI Calculator
  {
    id: 'bmi',
    number: 1,
    title: 'BMI Calculator',
    category: 'Body & Composition',
    description: 'Calculate Body Mass Index to evaluate body weight relative to height.',
    inputs: [
      { id: 'height', label: 'Height', type: 'number', defaultValue: 175, min: 100, max: 230, unit: 'cm' },
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 70, min: 30, max: 200, unit: 'kg' }
    ],
    calculate: (v) => {
      const hM = v.height / 100;
      const bmi = hM > 0 ? (v.weight / (hM * hM)) : 0;
      let status = 'Normal weight';
      let color = 'emerald';
      if (bmi < 18.5) { status = 'Underweight'; color = 'amber'; }
      else if (bmi >= 25 && bmi < 29.9) { status = 'Overweight'; color = 'amber'; }
      else if (bmi >= 30) { status = 'Obesity Class'; color = 'red'; }
      return {
        primaryResult: bmi.toFixed(1),
        primaryLabel: 'Body Mass Index (kg/m²)',
        status,
        statusColor: color,
        details: [
          { label: 'Normal Weight Range', value: `${(18.5 * hM * hM).toFixed(1)} - ${(24.9 * hM * hM).toFixed(1)} kg` },
          { label: 'Prime BMI Target', value: '22.0 kg/m²' }
        ],
        explanation: 'BMI is a screening tool used to categorize weight relative to height.'
      };
    }
  },
  // 2. BMR Calculator
  {
    id: 'bmr',
    number: 2,
    title: 'BMR Calculator',
    category: 'Body & Composition',
    description: 'Estimate Basal Metabolic Rate calories burned at complete rest using Mifflin-St Jeor equation.',
    inputs: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
      { id: 'age', label: 'Age', type: 'number', defaultValue: 30, min: 15, max: 100, unit: 'years' },
      { id: 'height', label: 'Height', type: 'number', defaultValue: 175, min: 100, max: 230, unit: 'cm' },
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 70, min: 30, max: 200, unit: 'kg' }
    ],
    calculate: (v) => {
      let bmr = 10 * v.weight + 6.25 * v.height - 5 * v.age;
      bmr = v.gender === 'male' ? bmr + 5 : bmr - 161;
      return {
        primaryResult: `${Math.round(bmr)} kcal/day`,
        primaryLabel: 'Basal Metabolic Rate',
        status: 'Base Metabolism',
        statusColor: 'emerald',
        details: [
          { label: 'Hourly Metabolism', value: `${Math.round(bmr / 24)} kcal/hr` },
          { label: 'Sedentary Burn', value: `${Math.round(bmr * 1.2)} kcal/day` }
        ],
        explanation: 'BMR represents the energy needed for basic life-sustaining metabolic functions.'
      };
    }
  },
  // 3. TDEE Calculator
  {
    id: 'tdee',
    number: 3,
    title: 'TDEE Calculator',
    category: 'Body & Composition',
    description: 'Calculate Total Daily Energy Expenditure based on daily activity level.',
    inputs: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
      { id: 'age', label: 'Age', type: 'number', defaultValue: 30, min: 15, max: 100, unit: 'years' },
      { id: 'height', label: 'Height', type: 'number', defaultValue: 175, min: 100, max: 230, unit: 'cm' },
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 70, min: 30, max: 200, unit: 'kg' },
      { id: 'activity', label: 'Activity Level', type: 'select', defaultValue: 1.375, options: [
        { label: 'Sedentary (office job)', value: 1.2 },
        { label: 'Light Exercise (1-3 days/wk)', value: 1.375 },
        { label: 'Moderate Exercise (3-5 days/wk)', value: 1.55 },
        { label: 'Heavy Exercise (6-7 days/wk)', value: 1.725 }
      ]}
    ],
    calculate: (v) => {
      let bmr = 10 * v.weight + 6.25 * v.height - 5 * v.age;
      bmr = v.gender === 'male' ? bmr + 5 : bmr - 161;
      const tdee = Math.round(bmr * Number(v.activity));
      return {
        primaryResult: `${tdee} kcal/day`,
        primaryLabel: 'Total Daily Energy Expenditure',
        status: 'Maintenance Calories',
        statusColor: 'emerald',
        details: [
          { label: 'Fat Loss Target (-500 kcal)', value: `${tdee - 500} kcal/day` },
          { label: 'Muscle Gain Target (+300 kcal)', value: `${tdee + 300} kcal/day` }
        ],
        explanation: 'TDEE is the total calories burned including physical activity and digestion.'
      };
    }
  },
  // 4. Body Fat Calculator
  {
    id: 'body-fat',
    number: 4,
    title: 'Body Fat Calculator',
    category: 'Body & Composition',
    description: 'Estimate body fat percentage using US Navy circumference measurements.',
    inputs: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
      { id: 'waist', label: 'Waist Circumference', type: 'number', defaultValue: 82, min: 50, max: 160, unit: 'cm' },
      { id: 'neck', label: 'Neck Circumference', type: 'number', defaultValue: 38, min: 25, max: 60, unit: 'cm' },
      { id: 'hip', label: 'Hip Circumference (Women)', type: 'number', defaultValue: 95, min: 60, max: 160, unit: 'cm' },
      { id: 'height', label: 'Height', type: 'number', defaultValue: 175, min: 100, max: 230, unit: 'cm' }
    ],
    calculate: (v) => {
      let bf = 0;
      if (v.gender === 'male') {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(v.waist - v.neck) + 0.15456 * Math.log10(v.height)) - 450;
      } else {
        bf = 495 / (1.29579 - 0.35004 * Math.log10(v.waist + v.hip - v.neck) + 0.22100 * Math.log10(v.height)) - 450;
      }
      bf = Math.max(3, Math.min(60, bf));
      let status = 'Fitness / Average';
      if (bf < 10) status = 'Essential / Lean';
      else if (bf > 25) status = 'Above Average / Higher Risk';
      return {
        primaryResult: `${bf.toFixed(1)}%`,
        primaryLabel: 'Estimated Body Fat',
        status,
        statusColor: bf <= 24 ? 'emerald' : 'amber',
        details: [
          { label: 'Fat Mass (70kg ref)', value: `${((bf/100) * 70).toFixed(1)} kg` },
          { label: 'Lean Mass (70kg ref)', value: `${(70 - (bf/100) * 70).toFixed(1)} kg` }
        ]
      };
    }
  },
  // 5. Ideal Weight Calculator
  {
    id: 'ideal-weight',
    number: 5,
    title: 'Ideal Weight Calculator',
    category: 'Body & Composition',
    description: 'Calculate ideal body weight ranges using Devine, Robinson, and Hamwi formulas.',
    inputs: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
      { id: 'height', label: 'Height', type: 'number', defaultValue: 175, min: 140, max: 220, unit: 'cm' }
    ],
    calculate: (v) => {
      const inchesOver5ft = Math.max(0, (v.height / 2.54) - 60);
      let devine = v.gender === 'male' ? 50 + 2.3 * inchesOver5ft : 45.5 + 2.3 * inchesOver5ft;
      let robinson = v.gender === 'male' ? 52 + 1.9 * inchesOver5ft : 49 + 1.7 * inchesOver5ft;
      return {
        primaryResult: `${devine.toFixed(1)} kg`,
        primaryLabel: 'Ideal Body Weight (Devine Formula)',
        status: 'Healthy Medical Target',
        statusColor: 'emerald',
        details: [
          { label: 'Robinson Formula Target', value: `${robinson.toFixed(1)} kg` },
          { label: 'BMI 22 Target', value: `${(22 * Math.pow(v.height/100, 2)).toFixed(1)} kg` }
        ]
      };
    }
  },
  // 6. Lean Body Mass Calculator
  {
    id: 'lean-mass',
    number: 6,
    title: 'Lean Body Mass Calculator',
    category: 'Body & Composition',
    description: 'Calculate Lean Body Mass (LBM) using Boer and James formulas.',
    inputs: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 75, min: 30, max: 200, unit: 'kg' },
      { id: 'height', label: 'Height', type: 'number', defaultValue: 178, min: 100, max: 230, unit: 'cm' }
    ],
    calculate: (v) => {
      let lbm = 0;
      if (v.gender === 'male') {
        lbm = 0.407 * v.weight + 0.267 * v.height - 19.2;
      } else {
        lbm = 0.252 * v.weight + 0.473 * v.height - 48.3;
      }
      return {
        primaryResult: `${lbm.toFixed(1)} kg`,
        primaryLabel: 'Lean Body Mass',
        status: `${((lbm/v.weight)*100).toFixed(0)}% Muscle/Bone/Organ Mass`,
        statusColor: 'emerald',
        details: [
          { label: 'Fat Mass', value: `${(v.weight - lbm).toFixed(1)} kg` }
        ]
      };
    }
  },
  // 7. Heart Rate Calculator
  {
    id: 'heart-rate',
    number: 7,
    title: 'Heart Rate Calculator',
    category: 'Cardiovascular & Heart',
    description: 'Calculate maximum heart rate and cardiovascular training thresholds.',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', defaultValue: 35, min: 10, max: 100, unit: 'years' },
      { id: 'restingHr', label: 'Resting Heart Rate', type: 'number', defaultValue: 65, min: 40, max: 120, unit: 'bpm' }
    ],
    calculate: (v) => {
      const maxHr = 220 - v.age;
      const hrr = maxHr - v.restingHr;
      return {
        primaryResult: `${maxHr} bpm`,
        primaryLabel: 'Maximum Heart Rate (220 - Age)',
        status: 'Cardiovascular Peak',
        statusColor: 'emerald',
        details: [
          { label: 'Fat Burn Zone (50-60%)', value: `${Math.round(v.restingHr + hrr*0.5)} - ${Math.round(v.restingHr + hrr*0.6)} bpm` },
          { label: 'Aerobic Zone (70-80%)', value: `${Math.round(v.restingHr + hrr*0.7)} - ${Math.round(v.restingHr + hrr*0.8)} bpm` }
        ]
      };
    }
  },
  // 8. Calories Burned Calculator
  {
    id: 'calories-burned',
    number: 8,
    title: 'Calories Burned Calculator',
    category: 'Sports & Performance',
    description: 'Estimate calories burned during physical activities using MET values.',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 70, min: 30, max: 200, unit: 'kg' },
      { id: 'duration', label: 'Activity Duration', type: 'number', defaultValue: 45, min: 5, max: 300, unit: 'mins' },
      { id: 'met', label: 'Activity Intensity', type: 'select', defaultValue: 7.5, options: [
        { label: 'Walking (3.5 mph / 5.6 km/h) [3.8 MET]', value: 3.8 },
        { label: 'Jogging (5 mph / 8 km/h) [7.0 MET]', value: 7.0 },
        { label: 'Running (7.5 mph / 12 km/h) [11.5 MET]', value: 11.5 },
        { label: 'Bicycling (Moderate) [7.5 MET]', value: 7.5 },
        { label: 'Swimming Laps (Freestyle) [8.0 MET]', value: 8.0 },
        { label: 'Weight Training (Intense) [6.0 MET]', value: 6.0 }
      ]}
    ],
    calculate: (v) => {
      const mins = v.duration;
      const met = Number(v.met);
      const burned = Math.round((met * 3.5 * v.weight / 200) * mins);
      return {
        primaryResult: `${burned} kcal`,
        primaryLabel: 'Estimated Energy Expended',
        status: 'Exercise Energy Burn',
        statusColor: 'emerald',
        details: [
          { label: 'Burn Rate', value: `${(burned / mins).toFixed(1)} kcal/min` }
        ]
      };
    }
  },
  // 9. Daily Calorie Needs Calculator
  {
    id: 'daily-calories',
    number: 9,
    title: 'Daily Calorie Needs Calculator',
    category: 'Nutrition & Macros',
    description: 'Comprehensive daily energy requirement calculator for maintenance, deficit, or surplus.',
    inputs: [
      { id: 'bmr', label: 'BMR Calories', type: 'number', defaultValue: 1650, min: 800, max: 3500, unit: 'kcal' },
      { id: 'goal', label: 'Health Goal', type: 'select', defaultValue: 'maintain', options: [
        { label: 'Maintain Weight', value: 'maintain' },
        { label: 'Mild Weight Loss (-0.25 kg/wk)', value: 'mild_loss' },
        { label: 'Weight Loss (-0.5 kg/wk)', value: 'loss' },
        { label: 'Muscle Gain (+0.25 kg/wk)', value: 'gain' }
      ]}
    ],
    calculate: (v) => {
      const base = v.bmr * 1.375;
      let target = base;
      if (v.goal === 'mild_loss') target -= 250;
      else if (v.goal === 'loss') target -= 500;
      else if (v.goal === 'gain') target += 300;
      return {
        primaryResult: `${Math.round(target)} kcal/day`,
        primaryLabel: 'Target Calorie Intake',
        status: 'Nutritional Plan',
        statusColor: 'emerald'
      };
    }
  },
  // 10. Pregnancy Due Date Calculator
  {
    id: 'pregnancy-due-date',
    number: 10,
    title: 'Pregnancy Due Date Calculator',
    category: 'Pregnancy & Pediatrics',
    description: "Calculate Naegele's rule estimated date of delivery (EDD) from last menstrual period.",
    inputs: [
      { id: 'lmpDaysAgo', label: 'Days since Last Menstrual Period (LMP)', type: 'number', defaultValue: 60, min: 1, max: 280, unit: 'days' }
    ],
    calculate: (v) => {
      const eddDaysRemaining = 280 - v.lmpDaysAgo;
      const weeksGestational = Math.floor(v.lmpDaysAgo / 7);
      const daysGestational = v.lmpDaysAgo % 7;
      return {
        primaryResult: `${eddDaysRemaining} days remaining`,
        primaryLabel: 'Estimated Time to Delivery',
        status: `Gestational Age: ${weeksGestational} weeks, ${daysGestational} days`,
        statusColor: 'emerald',
        details: [
          { label: 'Trimester', value: weeksGestational < 13 ? '1st Trimester' : weeksGestational < 27 ? '2nd Trimester' : '3rd Trimester' }
        ]
      };
    }
  }
];

export const ALL_CALCULATORS: CalculatorItem[] = [
  ...CALCULATORS_GROUP_1,
  ...CALCULATORS_GROUP_2,
  ...CALCULATORS_GROUP_3,
  ...CALCULATORS_GROUP_4
];

export const CALCULATORS = ALL_CALCULATORS;

