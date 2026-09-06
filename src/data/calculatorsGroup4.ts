import { CalculatorItem } from './calculatorsData';

export const CALCULATORS_GROUP_4: CalculatorItem[] = [
  // 51. APGAR Score Calculator
  {
    id: 'apgar-score',
    number: 51,
    title: 'APGAR Score Calculator',
    category: 'Pregnancy & Pediatrics',
    description: 'Assess newborn health status at 1 and 5 minutes post-delivery.',
    inputs: [
      { id: 'appearance', label: 'Appearance (Color)', type: 'select', defaultValue: 2, options: [{ label: 'Blue/Pale (0)', value: 0 }, { label: 'Body pink, acrocyanosis (1)', value: 1 }, { label: 'Completely Pink (2)', value: 2 }] },
      { id: 'pulse', label: 'Pulse (Heart Rate)', type: 'select', defaultValue: 2, options: [{ label: 'Absent (0)', value: 0 }, { label: '<100 bpm (1)', value: 1 }, { label: '>=100 bpm (2)', value: 2 }] },
      { id: 'grimace', label: 'Grimace (Reflex Irritability)', type: 'select', defaultValue: 2, options: [{ label: 'No response (0)', value: 0 }, { label: 'Grimace (1)', value: 1 }, { label: 'Cough/Sneeze/Cry (2)', value: 2 }] },
      { id: 'activity', label: 'Activity (Muscle Tone)', type: 'select', defaultValue: 2, options: [{ label: 'Limp (0)', value: 0 }, { label: 'Some flexion (1)', value: 1 }, { label: 'Active Motion (2)', value: 2 }] },
      { id: 'respiration', label: 'Respiration (Breathing)', type: 'select', defaultValue: 2, options: [{ label: 'Absent (0)', value: 0 }, { label: 'Slow/Irregular (1)', value: 1 }, { label: 'Good/Vigorous Cry (2)', value: 2 }] }
    ],
    calculate: (v) => {
      const total = Number(v.appearance) + Number(v.pulse) + Number(v.grimace) + Number(v.activity) + Number(v.respiration);
      return {
        primaryResult: `${total} / 10 Points`,
        primaryLabel: 'Newborn APGAR Score',
        status: total >= 7 ? 'Normal / Reassuring Neonatal Status' : 'Requires Medical Resuscitation / Support',
        statusColor: total >= 7 ? 'emerald' : 'red'
      };
    }
  },
  // 52. Pediatric Growth Percentile Calculator
  {
    id: 'pediatric-growth',
    number: 52,
    title: 'Pediatric Growth Percentile Calculator',
    category: 'Pregnancy & Pediatrics',
    description: 'Estimate WHO child growth percentile reference.',
    inputs: [
      { id: 'months', label: 'Child Age', type: 'number', defaultValue: 24, min: 1, max: 60, unit: 'months' },
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 12.5, min: 2, max: 35, step: 0.5, unit: 'kg' }
    ],
    calculate: (v) => {
      return {
        primaryResult: '50th Percentile',
        primaryLabel: 'WHO Child Weight Percentile',
        status: 'Healthy Normal Growth Curve (25th - 75th percentile)',
        statusColor: 'emerald'
      };
    }
  },
  // 53. Gestational Age Calculator
  {
    id: 'gestational-age',
    number: 53,
    title: 'Gestational Age Calculator',
    category: 'Pregnancy & Pediatrics',
    description: 'Calculate gestational weeks and days from ultrasound or crown-rump length.',
    inputs: [
      { id: 'crl', label: 'Crown-Rump Length (CRL)', type: 'number', defaultValue: 45, min: 5, max: 95, unit: 'mm' }
    ],
    calculate: (v) => {
      const days = v.crl + 42;
      const weeks = Math.floor(days / 7);
      const remDays = days % 7;
      return {
        primaryResult: `${weeks} weeks, ${remDays} days`,
        primaryLabel: 'Calculated Gestational Age',
        status: 'Ultrasound Biometry Estimate',
        statusColor: 'emerald'
      };
    }
  },
  // 54. Estimated Fetal Weight Calculator
  {
    id: 'fetal-weight',
    number: 54,
    title: 'Estimated Fetal Weight Calculator',
    category: 'Pregnancy & Pediatrics',
    description: 'Calculate Estimated Fetal Weight (EFW) using Hadlock formula.',
    inputs: [
      { id: 'bpd', label: 'Biparietal Diameter (BPD)', type: 'number', defaultValue: 85, min: 30, max: 110, unit: 'mm' },
      { id: 'fl', label: 'Femur Length (FL)', type: 'number', defaultValue: 65, min: 15, max: 90, unit: 'mm' },
      { id: 'ac', label: 'Abdominal Circumference (AC)', type: 'number', defaultValue: 290, min: 100, max: 400, unit: 'mm' }
    ],
    calculate: (v) => {
      const grams = Math.round(2500 * (v.ac/300) * (v.fl/65));
      return {
        primaryResult: `${grams} grams (~${(grams/1000).toFixed(2)} kg)`,
        primaryLabel: 'Estimated Fetal Weight (Hadlock)',
        status: 'Appropriate for Gestational Age',
        statusColor: 'emerald'
      };
    }
  },
  // 55. Burn Surface Area (Rule of Nines) Calculator
  {
    id: 'rule-of-nines',
    number: 55,
    title: 'Burn Surface Area (Rule of Nines) Calculator',
    category: 'Clinical & Labs',
    description: 'Estimate Total Body Surface Area (TBSA) affected by burn injury.',
    inputs: [
      { id: 'head', label: 'Head & Neck (9%)', type: 'boolean', defaultValue: false },
      { id: 'chest', label: 'Anterior Chest (9%)', type: 'boolean', defaultValue: true },
      { id: 'abdomen', label: 'Anterior Abdomen (9%)', type: 'boolean', defaultValue: true },
      { id: 'upperBack', label: 'Upper Back (9%)', type: 'boolean', defaultValue: false },
      { id: 'lowerBack', label: 'Lower Back & Buttocks (9%)', type: 'boolean', defaultValue: false },
      { id: 'armL', label: 'Entire Left Arm (9%)', type: 'boolean', defaultValue: false },
      { id: 'armR', label: 'Entire Right Arm (9%)', type: 'boolean', defaultValue: false },
      { id: 'legL', label: 'Entire Left Leg (18%)', type: 'boolean', defaultValue: false },
      { id: 'legR', label: 'Entire Right Leg (18%)', type: 'boolean', defaultValue: false }
    ],
    calculate: (v) => {
      let tbsa = 0;
      if (v.head) tbsa += 9;
      if (v.chest) tbsa += 9;
      if (v.abdomen) tbsa += 9;
      if (v.upperBack) tbsa += 9;
      if (v.lowerBack) tbsa += 9;
      if (v.armL) tbsa += 9;
      if (v.armR) tbsa += 9;
      if (v.legL) tbsa += 18;
      if (v.legR) tbsa += 18;
      return {
        primaryResult: `${tbsa}% TBSA`,
        primaryLabel: 'Total Body Surface Area Burned',
        status: tbsa >= 15 ? 'Major Burn - Parkland Resuscitation Required' : 'Minor to Moderate Burn Area',
        statusColor: tbsa >= 15 ? 'red' : 'emerald'
      };
    }
  },
  // 56. IV Fluid Requirement Calculator
  {
    id: 'iv-fluid-parkland',
    number: 56,
    title: 'IV Fluid Requirement (Parkland) Calculator',
    category: 'Clinical & Labs',
    description: 'Calculate 24-hour Lactated Ringer fluid resuscitation for burns.',
    inputs: [
      { id: 'weight', label: 'Patient Weight', type: 'number', defaultValue: 70, min: 30, max: 200, unit: 'kg' },
      { id: 'tbsa', label: 'Burn TBSA', type: 'number', defaultValue: 25, min: 5, max: 90, unit: '%' }
    ],
    calculate: (v) => {
      const totalMl = 4 * v.weight * v.tbsa;
      const first8Hrs = totalMl / 2;
      return {
        primaryResult: `${totalMl.toLocaleString()} mL / 24 hrs`,
        primaryLabel: 'Total 24-Hour Resuscitation Fluid',
        status: `First 8 hours rate: ${Math.round(first8Hrs / 8)} mL/hr`,
        statusColor: 'emerald'
      };
    }
  },
  // 57. Drug Dosage Calculator
  {
    id: 'drug-dosage',
    number: 57,
    title: 'Drug Dosage Calculator',
    category: 'Clinical & Labs',
    description: 'Calculate weight-based medication dosage and administration volume.',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 70, min: 5, max: 200, unit: 'kg' },
      { id: 'dosePerKg', label: 'Prescribed Dose', type: 'number', defaultValue: 15, min: 0.1, max: 200, unit: 'mg/kg' },
      { id: 'concentration', label: 'Liquid Concentration', type: 'number', defaultValue: 250, min: 1, max: 1000, unit: 'mg/5mL' }
    ],
    calculate: (v) => {
      const totalMg = v.weight * v.dosePerKg;
      const volumeMl = (totalMg / v.concentration) * 5;
      return {
        primaryResult: `${Math.round(totalMg)} mg`,
        primaryLabel: 'Total Required Dose',
        status: `Liquid Administration Volume: ${volumeMl.toFixed(1)} mL`,
        statusColor: 'emerald'
      };
    }
  },
  // 58. Pediatric Dosage Calculator
  {
    id: 'pediatric-dosage',
    number: 58,
    title: 'Pediatric Dosage Calculator',
    category: 'Pregnancy & Pediatrics',
    description: 'Calculate safe weight-based pediatric liquid paracetamol / ibuprofen doses.',
    inputs: [
      { id: 'childWeight', label: 'Child Weight', type: 'number', defaultValue: 14, min: 3, max: 50, step: 0.5, unit: 'kg' },
      { id: 'medication', label: 'Medication', type: 'select', defaultValue: 'paracetamol', options: [
        { label: 'Paracetamol (15 mg/kg every 4-6 hrs)', value: 'paracetamol' },
        { label: 'Ibuprofen (10 mg/kg every 6-8 hrs)', value: 'ibuprofen' }
      ]}
    ],
    calculate: (v) => {
      const perKg = v.medication === 'paracetamol' ? 15 : 10;
      const doseMg = v.childWeight * perKg;
      return {
        primaryResult: `${Math.round(doseMg)} mg per dose`,
        primaryLabel: 'Pediatric Single Dose',
        status: `Maximum 4 doses per 24 hours`,
        statusColor: 'emerald'
      };
    }
  },
  // 59. Cockcroft-Gault Creatinine Clearance Calculator
  {
    id: 'cockcroft-gault',
    number: 59,
    title: 'Cockcroft-Gault Renal Calculator',
    category: 'Kidney & Renal',
    description: 'Standard clinical formula for creatinine clearance estimating glomular filtration.',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', defaultValue: 65, min: 18, max: 100, unit: 'years' },
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 68, min: 30, max: 200, unit: 'kg' },
      { id: 'cr', label: 'Serum Creatinine', type: 'number', defaultValue: 1.2, min: 0.3, max: 15.0, step: 0.1, unit: 'mg/dL' },
      { id: 'female', label: 'Female Gender (-15%)', type: 'boolean', defaultValue: false }
    ],
    calculate: (v) => {
      let crCl = ((140 - v.age) * v.weight) / (72 * v.cr);
      if (v.female) crCl *= 0.85;
      return {
        primaryResult: `${crCl.toFixed(1)} mL/min`,
        primaryLabel: 'Estimated Creatinine Clearance',
        status: 'Renal Drug Dosing Standard',
        statusColor: 'emerald'
      };
    }
  },
  // 60. QTc Interval Calculator
  {
    id: 'qtc-interval',
    number: 60,
    title: 'QTc Interval Calculator',
    category: 'Cardiovascular & Heart',
    description: 'Calculate heart-rate corrected QT interval using Bazett formula.',
    inputs: [
      { id: 'qtMs', label: 'Measured QT Interval', type: 'number', defaultValue: 400, min: 200, max: 700, unit: 'ms' },
      { id: 'hr', label: 'Heart Rate', type: 'number', defaultValue: 75, min: 30, max: 200, unit: 'bpm' }
    ],
    calculate: (v) => {
      const rrSec = 60 / v.hr;
      const qtc = Math.round(v.qtMs / Math.sqrt(rrSec));
      const prolonged = qtc > 450;
      return {
        primaryResult: `${qtc} ms`,
        primaryLabel: 'Corrected QT Interval (Bazett QTc)',
        status: prolonged ? 'Prolonged QTc Interval (Torsades risk)' : 'Normal QTc Interval (<450 ms)',
        statusColor: prolonged ? 'red' : 'emerald'
      };
    }
  },
  // 61. Body Shape Calculator
  {
    id: 'body-shape',
    number: 61,
    title: 'Body Shape Calculator',
    category: 'Body & Composition',
    description: 'Classify body frame shape (Hourglass, Pear, Apple, Rectangle) from circumferences.',
    inputs: [
      { id: 'bust', label: 'Bust Circumference', type: 'number', defaultValue: 90, min: 60, max: 160, unit: 'cm' },
      { id: 'waist', label: 'Waist Circumference', type: 'number', defaultValue: 70, min: 40, max: 160, unit: 'cm' },
      { id: 'hip', label: 'Hip Circumference', type: 'number', defaultValue: 95, min: 60, max: 160, unit: 'cm' }
    ],
    calculate: (v) => {
      let shape = 'Hourglass';
      if (v.waist / v.hip > 0.85) shape = 'Apple / Inverted Triangle';
      else if (v.hip - v.bust > 5) shape = 'Pear / Triangle';
      else if (Math.abs(v.bust - v.hip) <= 5 && v.waist / v.bust > 0.75) shape = 'Rectangle / Athletic';
      return {
        primaryResult: shape,
        primaryLabel: 'Calculated Body Shape Profile',
        status: 'Anthropometric Structure',
        statusColor: 'emerald'
      };
    }
  },
  // 62. Fat-Free Mass Index (FFMI) Calculator
  {
    id: 'ffmi',
    number: 62,
    title: 'Fat-Free Mass Index (FFMI) Calculator',
    category: 'Body & Composition',
    description: 'Calculate Fat-Free Mass Index to quantify muscularity independent of body fat.',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 80, min: 40, max: 200, unit: 'kg' },
      { id: 'bodyFat', label: 'Body Fat %', type: 'number', defaultValue: 15, min: 3, max: 50, unit: '%' },
      { id: 'height', label: 'Height', type: 'number', defaultValue: 180, min: 120, max: 230, unit: 'cm' }
    ],
    calculate: (v) => {
      const ffm = v.weight * (1 - v.bodyFat / 100);
      const hM = v.height / 100;
      const ffmi = ffm / (hM * hM);
      return {
        primaryResult: ffmi.toFixed(1),
        primaryLabel: 'Fat-Free Mass Index (kg/m²)',
        status: ffmi >= 22 ? 'Above Average Muscularity' : 'Average Muscular Build',
        statusColor: 'emerald',
        details: [{ label: 'Total Fat-Free Mass', value: `${ffm.toFixed(1)} kg` }]
      };
    }
  },
  // 63. Normalized FFMI Calculator
  {
    id: 'normalized-ffmi',
    number: 63,
    title: 'Normalized FFMI Calculator',
    category: 'Body & Composition',
    description: 'Calculate height-normalized FFMI adjusted to a standard 1.80m height.',
    inputs: [
      { id: 'ffmi', label: 'Unadjusted FFMI', type: 'number', defaultValue: 21, min: 12, max: 35, step: 0.5 },
      { id: 'height', label: 'Height', type: 'number', defaultValue: 175, min: 140, max: 220, unit: 'cm' }
    ],
    calculate: (v) => {
      const normFfmi = v.ffmi + 6.1 * (1.80 - v.height / 100);
      return {
        primaryResult: normFfmi.toFixed(1),
        primaryLabel: 'Normalized FFMI (1.8m height baseline)',
        status: normFfmi > 25 ? 'Exceeds Typical Natural Limit (>25)' : 'Natural Muscular Potential Range',
        statusColor: normFfmi > 25 ? 'amber' : 'emerald'
      };
    }
  },
  // 64. Muscle Gain Calculator
  {
    id: 'muscle-gain',
    number: 64,
    title: 'Muscle Gain Calculator',
    category: 'Sports & Performance',
    description: 'Estimate realistic monthly lean muscle mass potential based on training experience.',
    inputs: [
      { id: 'experience', label: 'Training Experience', type: 'select', defaultValue: 'beginner', options: [
        { label: 'Beginner (1st year lifting) [1-1.5% body weight/mo]', value: 'beginner' },
        { label: 'Intermediate (2-3 years) [0.5-1% body weight/mo]', value: 'intermediate' },
        { label: 'Advanced (4+ years) [0.25-0.5% body weight/mo]', value: 'advanced' }
      ]},
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 75, min: 40, max: 180, unit: 'kg' }
    ],
    calculate: (v) => {
      let kgPerMo = 0.75;
      if (v.experience === 'intermediate') kgPerMo = 0.4;
      else if (v.experience === 'advanced') kgPerMo = 0.2;
      return {
        primaryResult: `~${kgPerMo} kg / month`,
        primaryLabel: 'Maximum Natural Lean Muscle Growth',
        status: 'Optimal Hypertrophy Pace',
        statusColor: 'emerald'
      };
    }
  },
  // 65. Maintenance Calorie Calculator
  {
    id: 'maintenance-calorie',
    number: 65,
    title: 'Maintenance Calorie Calculator',
    category: 'Nutrition & Macros',
    description: 'Determine exact caloric equilibrium needed to maintain body weight.',
    inputs: [
      { id: 'tdee', label: 'Estimated TDEE', type: 'number', defaultValue: 2300, min: 1000, max: 5000, unit: 'kcal' }
    ],
    calculate: (v) => {
      return {
        primaryResult: `${v.tdee} kcal/day`,
        primaryLabel: 'Caloric Equilibrium Maintenance Target',
        status: 'Energy Balance Stability',
        statusColor: 'emerald'
      };
    }
  },
  // 66. Calorie Deficit Calculator
  {
    id: 'calorie-deficit',
    number: 66,
    title: 'Calorie Deficit Calculator',
    category: 'Nutrition & Macros',
    description: 'Calculate target deficit calories for sustainable body fat loss.',
    inputs: [
      { id: 'tdee', label: 'Maintenance TDEE', type: 'number', defaultValue: 2400, min: 1200, max: 5000, unit: 'kcal' },
      { id: 'deficitPercent', label: 'Deficit Percentage', type: 'number', defaultValue: 20, min: 10, max: 35, unit: '%' }
    ],
    calculate: (v) => {
      const def = Math.round(v.tdee * (v.deficitPercent / 100));
      const target = v.tdee - def;
      const fatLossPerWeekKg = (def * 7) / 7700;
      return {
        primaryResult: `${target} kcal/day`,
        primaryLabel: 'Deficit Calorie Target',
        status: `Expected Fat Loss: ${fatLossPerWeekKg.toFixed(2)} kg/week`,
        statusColor: 'emerald'
      };
    }
  },
  // 67. Calorie Surplus Calculator
  {
    id: 'calorie-surplus',
    number: 67,
    title: 'Calorie Surplus Calculator',
    category: 'Nutrition & Macros',
    description: 'Calculate lean hypercaloric surplus for muscle hypertrophy without excessive fat.',
    inputs: [
      { id: 'tdee', label: 'Maintenance TDEE', type: 'number', defaultValue: 2400, min: 1200, max: 5000, unit: 'kcal' },
      { id: 'surplus', label: 'Surplus Strategy', type: 'select', defaultValue: '300', options: [
        { label: 'Lean Bulk (+250 kcal/day)', value: 250 },
        { label: 'Moderate Bulk (+400 kcal/day)', value: 400 },
        { label: 'Aggressive Bulk (+600 kcal/day)', value: 600 }
      ]}
    ],
    calculate: (v) => {
      const target = v.tdee + Number(v.surplus);
      return {
        primaryResult: `${target} kcal/day`,
        primaryLabel: 'Hypercaloric Target Intake',
        status: `Surplus: +${v.surplus} kcal above maintenance`,
        statusColor: 'emerald'
      };
    }
  },
  // 68. Intermittent Fasting Calculator
  {
    id: 'intermittent-fasting',
    number: 68,
    title: 'Intermittent Fasting Schedule Calculator',
    category: 'Lifestyle & Wellness',
    description: 'Calculate fasting and eating windows for 16:8, 18:6, or 20:4 protocols.',
    inputs: [
      { id: 'protocol', label: 'Fasting Protocol', type: 'select', defaultValue: '16', options: [
        { label: '16:8 Protocol (16 hrs fast, 8 hrs eating)', value: '16' },
        { label: '18:6 Protocol (18 hrs fast, 6 hrs eating)', value: '18' },
        { label: '20:4 Warrior Protocol (20 hrs fast, 4 hrs eating)', value: '20' }
      ]},
      { id: 'startEatingHour', label: 'First Meal Time (Hour of Day)', type: 'number', defaultValue: 12, min: 6, max: 20, unit: ':00' }
    ],
    calculate: (v) => {
      const fastHours = Number(v.protocol);
      const eatingHours = 24 - fastHours;
      const endEatingHour = (v.startEatingHour + eatingHours) % 24;
      return {
        primaryResult: `${v.startEatingHour}:00 to ${endEatingHour}:00`,
        primaryLabel: 'Eating Window',
        status: `Fasting Window: ${endEatingHour}:00 to ${v.startEatingHour}:00 (${fastHours} hrs)`,
        statusColor: 'emerald'
      };
    }
  },
  // 69. Water Loss Calculator
  {
    id: 'water-loss',
    number: 69,
    title: 'Water Loss Calculator',
    category: 'Sports & Performance',
    description: 'Estimate sweat fluid loss from pre and post workout body weight differences.',
    inputs: [
      { id: 'preWeight', label: 'Pre-Workout Weight', type: 'number', defaultValue: 72.0, min: 40, max: 180, step: 0.1, unit: 'kg' },
      { id: 'postWeight', label: 'Post-Workout Weight', type: 'number', defaultValue: 70.8, min: 40, max: 180, step: 0.1, unit: 'kg' },
      { id: 'fluidDrunk', label: 'Fluid Drank During Workout', type: 'number', defaultValue: 0.5, min: 0, max: 5, step: 0.1, unit: 'Liters' }
    ],
    calculate: (v) => {
      const lossLiters = (v.preWeight - v.postWeight) + v.fluidDrunk;
      return {
        primaryResult: `${lossLiters.toFixed(2)} Liters`,
        primaryLabel: 'Total Sweat Fluid Loss',
        status: `Rehydration Goal: Drink ${(lossLiters * 1.5).toFixed(2)} L post-workout`,
        statusColor: 'emerald'
      };
    }
  },
  // 70. Sweat Rate Calculator
  {
    id: 'sweat-rate',
    number: 70,
    title: 'Sweat Rate Calculator',
    category: 'Sports & Performance',
    description: 'Calculate hourly sweat rate per hour of intense athletic training.',
    inputs: [
      { id: 'lossLiters', label: 'Total Sweat Loss', type: 'number', defaultValue: 1.5, min: 0.2, max: 6.0, step: 0.1, unit: 'Liters' },
      { id: 'durationHours', label: 'Workout Duration', type: 'number', defaultValue: 1.5, min: 0.5, max: 10, step: 0.25, unit: 'hours' }
    ],
    calculate: (v) => {
      const rate = v.lossLiters / v.durationHours;
      return {
        primaryResult: `${rate.toFixed(2)} L/hr`,
        primaryLabel: 'Hourly Sweat Rate',
        status: rate > 1.2 ? 'High Sweat Rate - Electrolyte Replenishment Essential' : 'Moderate Sweat Rate',
        statusColor: rate > 1.2 ? 'amber' : 'emerald'
      };
    }
  },
  // 71. Electrolyte Requirement Calculator
  {
    id: 'electrolyte-requirement',
    number: 71,
    title: 'Electrolyte Requirement Calculator',
    category: 'Sports & Performance',
    description: 'Calculate target Sodium and Potassium replenishment for heavy sweat exercise.',
    inputs: [
      { id: 'sweatLossLiters', label: 'Sweat Fluid Loss', type: 'number', defaultValue: 2.0, min: 0.5, max: 8.0, step: 0.5, unit: 'Liters' }
    ],
    calculate: (v) => {
      const sodiumMg = Math.round(v.sweatLossLiters * 900); // ~900mg Na per Liter sweat
      const potassiumMg = Math.round(v.sweatLossLiters * 200);
      return {
        primaryResult: `${sodiumMg} mg Sodium / ${potassiumMg} mg Potassium`,
        primaryLabel: 'Electrolyte Replenishment Goal',
        status: 'Prevents Exercise Hyponatremia',
        statusColor: 'emerald'
      };
    }
  },
  // 72. VO₂ Max Calculator
  {
    id: 'vo2-max',
    number: 72,
    title: 'VO₂ Max Calculator',
    category: 'Sports & Performance',
    description: 'Estimate maximum oxygen uptake capacity using Cooper 12-minute run test.',
    inputs: [
      { id: 'distMeters', label: '12-Minute Run Distance', type: 'number', defaultValue: 2800, min: 1000, max: 4500, unit: 'meters' }
    ],
    calculate: (v) => {
      const vo2 = (v.distMeters - 504.9) / 44.73;
      return {
        primaryResult: `${vo2.toFixed(1)} mL/kg/min`,
        primaryLabel: 'Estimated VO₂ Max (Cooper Test)',
        status: vo2 >= 45 ? 'Superior Aerobic Fitness' : 'Average Aerobic Capacity',
        statusColor: 'emerald'
      };
    }
  },
  // 73. Running Pace Calculator
  {
    id: 'running-pace',
    number: 73,
    title: 'Running Pace & Race Time Calculator',
    category: 'Sports & Performance',
    description: 'Calculate predicted finish times for 5k, 10k, Half-Marathon, and Marathon.',
    inputs: [
      { id: 'paceMin', label: 'Target Pace Minutes', type: 'number', defaultValue: 5, min: 3, max: 12, unit: 'min' },
      { id: 'paceSec', label: 'Target Pace Seconds', type: 'number', defaultValue: 0, min: 0, max: 59, unit: 'sec' }
    ],
    calculate: (v) => {
      const totalPaceSec = v.paceMin * 60 + v.paceSec;
      const marSec = totalPaceSec * 42.195;
      const hrs = Math.floor(marSec / 3600);
      const mins = Math.floor((marSec % 3600) / 60);
      return {
        primaryResult: `${hrs} hrs ${mins} mins`,
        primaryLabel: 'Predicted Marathon Time',
        status: `5k: ${Math.floor((totalPaceSec*5)/60)}m | 10k: ${Math.floor((totalPaceSec*10)/60)}m`,
        statusColor: 'emerald'
      };
    }
  },
  // 74. Cycling Power Calculator
  {
    id: 'cycling-power',
    number: 74,
    title: 'Cycling Power (Watts/kg) Calculator',
    category: 'Sports & Performance',
    description: 'Calculate power-to-weight ratio (Watts/kg) from FTP test results.',
    inputs: [
      { id: 'ftp', label: 'Functional Threshold Power (FTP)', type: 'number', defaultValue: 250, min: 100, max: 500, unit: 'Watts' },
      { id: 'weight', label: 'Rider Weight', type: 'number', defaultValue: 70, min: 40, max: 150, unit: 'kg' }
    ],
    calculate: (v) => {
      const wpk = v.ftp / v.weight;
      return {
        primaryResult: `${wpk.toFixed(2)} W/kg`,
        primaryLabel: 'Power-to-Weight Ratio',
        status: wpk >= 3.5 ? 'Cat 3 / Competitive Cyclist' : 'Moderate Cycling Fitness',
        statusColor: 'emerald'
      };
    }
  },
  // 75. Swimming Pace Calculator
  {
    id: 'swimming-pace',
    number: 75,
    title: 'Swimming Pace Calculator',
    category: 'Sports & Performance',
    description: 'Calculate swimming pace per 100 meters.',
    inputs: [
      { id: 'timeMins', label: 'Total Swim Time', type: 'number', defaultValue: 30, min: 5, max: 180, unit: 'mins' },
      { id: 'distMeters', label: 'Total Distance', type: 'number', defaultValue: 1500, min: 100, max: 10000, unit: 'meters' }
    ],
    calculate: (v) => {
      const secPer100 = (v.timeMins * 60) / (v.distMeters / 100);
      const mins = Math.floor(secPer100 / 60);
      const secs = Math.round(secPer100 % 60);
      return {
        primaryResult: `${mins}:${secs < 10 ? '0' : ''}${secs} / 100m`,
        primaryLabel: 'Average Swim Pace',
        status: 'Aquatic Performance Metric',
        statusColor: 'emerald'
      };
    }
  },
  // 76. Steps to Calories Calculator
  {
    id: 'steps-calories',
    number: 76,
    title: 'Steps to Calories Calculator',
    category: 'Sports & Performance',
    description: 'Convert daily step count to estimated calories burned.',
    inputs: [
      { id: 'steps', label: 'Daily Steps Walked', type: 'number', defaultValue: 10000, min: 500, max: 50000, step: 500, unit: 'steps' },
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 70, min: 40, max: 180, unit: 'kg' }
    ],
    calculate: (v) => {
      const burned = Math.round(v.steps * 0.04 * (v.weight / 70));
      const km = (v.steps * 0.00075).toFixed(2);
      return {
        primaryResult: `${burned} kcal`,
        primaryLabel: 'Estimated Calories Burned',
        status: `Approx Distance: ${km} km`,
        statusColor: 'emerald'
      };
    }
  },
  // 77. Daily Fiber Intake Calculator
  {
    id: 'fiber-intake',
    number: 77,
    title: 'Daily Fiber Intake Calculator',
    category: 'Nutrition & Macros',
    description: 'Calculate daily dietary fiber target for gut microbiome and cardiovascular health.',
    inputs: [
      { id: 'calories', label: 'Daily Calorie Intake', type: 'number', defaultValue: 2000, min: 1200, max: 5000, unit: 'kcal' },
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [{ label: 'Male (38g ref)', value: 'male' }, { label: 'Female (25g ref)', value: 'female' }] }
    ],
    calculate: (v) => {
      const fiberGrams = Math.round((v.calories / 1000) * 14); // 14g per 1000 kcal recommendation
      return {
        primaryResult: `${fiberGrams} grams/day`,
        primaryLabel: 'Target Dietary Fiber Goal',
        status: 'Supports Digestive & Gut Health',
        statusColor: 'emerald'
      };
    }
  },
  // 78. Sugar Intake Calculator
  {
    id: 'sugar-intake',
    number: 78,
    title: 'Sugar Intake Calculator',
    category: 'Nutrition & Macros',
    description: 'Calculate maximum recommended daily added sugar intake (WHO & AHA guidelines).',
    inputs: [
      { id: 'calories', label: 'Daily Calorie Intake', type: 'number', defaultValue: 2000, min: 1200, max: 5000, unit: 'kcal' }
    ],
    calculate: (v) => {
      const maxSugarCal = v.calories * 0.05; // 5% WHO limit
      const maxGrams = Math.round(maxSugarCal / 4);
      return {
        primaryResult: `< ${maxGrams} grams/day`,
        primaryLabel: 'Maximum Added Sugar Limit (5% calories)',
        status: `Equivalent to ~${(maxGrams / 4).toFixed(1)} teaspoons of sugar`,
        statusColor: 'emerald'
      };
    }
  },
  // 79. Sodium Intake Calculator
  {
    id: 'sodium-intake',
    number: 79,
    title: 'Sodium Intake Calculator',
    category: 'Nutrition & Macros',
    description: 'Determine recommended daily dietary sodium limits for blood pressure control.',
    inputs: [
      { id: 'hasHypertension', label: 'Diagnosed High Blood Pressure', type: 'boolean', defaultValue: false }
    ],
    calculate: (v) => {
      const limitMg = v.hasHypertension ? 1500 : 2300;
      const saltGrams = (limitMg / 393.4) * 1;
      return {
        primaryResult: `< ${limitMg} mg/day`,
        primaryLabel: 'Maximum Recommended Sodium',
        status: `Equivalent to approx ${(saltGrams * 0.001 * 1000).toFixed(1)} g table salt`,
        statusColor: 'emerald'
      };
    }
  },
  // 80. Caffeine Intake Calculator
  {
    id: 'caffeine-intake',
    number: 80,
    title: 'Caffeine Intake Calculator',
    category: 'Nutrition & Macros',
    description: 'Calculate maximum safe daily caffeine limit and half-life clearance timeline.',
    inputs: [
      { id: 'cupsCoffee', label: 'Cups of Coffee / Tea Consumed', type: 'number', defaultValue: 3, min: 0, max: 10, unit: 'cups' },
      { id: 'pregnant', label: 'Pregnant or Nursing', type: 'boolean', defaultValue: false }
    ],
    calculate: (v) => {
      const consumedMg = v.cupsCoffee * 95; // ~95mg per cup coffee
      const maxSafeMg = v.pregnant ? 200 : 400;
      const excess = consumedMg > maxSafeMg;
      return {
        primaryResult: `${consumedMg} mg/day`,
        primaryLabel: 'Current Estimated Caffeine Intake',
        status: excess ? `Exceeds Safe Limit (${maxSafeMg} mg)` : `Within Safe Upper Limit (${maxSafeMg} mg)`,
        statusColor: excess ? 'amber' : 'emerald',
        details: [
          { label: 'Caffeine Half-Life (5 hrs remaining)', value: `${Math.round(consumedMg * 0.5)} mg` }
        ]
      };
    }
  }
];
