import { MedicalTest } from '../../types';

export type InterpretationStatus = 'NORMAL' | 'BORDERLINE' | 'HIGH' | 'LOW' | 'CRITICAL';

export interface InterpretationInput {
  testId: string;
  testName: string;
  value: string; // numeric string or qualitative ("Positive", "Negative", etc.)
  unit?: string;
  customRangeLower?: string;
  customRangeUpper?: string;
  age?: number;
  sex?: 'male' | 'female' | 'other';
  isPregnant?: boolean;
  collectionDate?: string;
  patientNotes?: string;
}

export interface InterpretationResult {
  status: InterpretationStatus;
  statusLabel: string;
  badgeColor: string;
  gaugePosition: number; // 0 to 100%
  isCritical: boolean;
  urgentReviewNotice?: string;
  effectiveRangeText: string;
  rangeSource: 'report_printed' | 'demographic_adjusted' | 'clinical_baseline';
  
  // Three-Tier Explanation
  clinicalInterpretation: string;
  simpleExplanation: string;
  possibleAssociations: string[];
  
  // Recommendations
  recommendations: string[];
  disclaimer: string;
}

export interface PanelTestInput {
  testName: string;
  value: string;
  unit: string;
  customRange?: string;
}

export interface PanelInterpretationResult {
  panelName: string;
  totalTests: number;
  normalCount: number;
  borderlineCount: number;
  highCount: number;
  lowCount: number;
  criticalCount: number;
  hasCritical: boolean;
  tests: {
    name: string;
    value: string;
    unit: string;
    status: InterpretationStatus;
    summary: string;
  }[];
  patternSummary: string;
  differentialContext: string[];
  doctorGuidance: string;
}

/**
 * Parses numeric limits from various laboratory range strings:
 * e.g., "3.5 - 5.0", "< 200", "> 60", "0.6 to 1.3", "Male: 13.8 - 17.2 | Female: 12.1 - 15.1"
 */
export function parseRangeLimits(
  rangeStr: string,
  sex?: 'male' | 'female' | 'other',
  age?: number,
  isPregnant?: boolean
): { min: number | null; max: number | null; label: string } {
  if (!rangeStr) return { min: null, max: null, label: 'Unspecified' };

  let targetStr = rangeStr;

  // Handle sex specific splits
  if (sex === 'male' && rangeStr.toLowerCase().includes('male:')) {
    const parts = rangeStr.split('|');
    const malePart = parts.find(p => p.toLowerCase().includes('male:') && !p.toLowerCase().includes('female:'));
    if (malePart) targetStr = malePart;
  } else if (sex === 'female' && rangeStr.toLowerCase().includes('female:')) {
    const parts = rangeStr.split('|');
    const femalePart = parts.find(p => p.toLowerCase().includes('female:'));
    if (femalePart) targetStr = femalePart;
  }

  // Check < X format
  const lessThanMatch = targetStr.match(/<\s*([0-9.]+)/);
  if (lessThanMatch && !targetStr.includes('-')) {
    const maxVal = parseFloat(lessThanMatch[1]);
    return { min: 0, max: isNaN(maxVal) ? null : maxVal, label: `< ${maxVal}` };
  }

  // Check > X format
  const greaterThanMatch = targetStr.match(/>\s*([0-9.]+)/);
  if (greaterThanMatch && !targetStr.includes('-')) {
    const minVal = parseFloat(greaterThanMatch[1]);
    return { min: isNaN(minVal) ? null : minVal, max: null, label: `> ${minVal}` };
  }

  // Check X - Y or X to Y format
  const rangeMatch = targetStr.match(/([0-9.]+)\s*(?:-|to)\s*([0-9.]+)/);
  if (rangeMatch) {
    const minVal = parseFloat(rangeMatch[1]);
    const maxVal = parseFloat(rangeMatch[2]);
    return {
      min: isNaN(minVal) ? null : minVal,
      max: isNaN(maxVal) ? null : maxVal,
      label: `${minVal} - ${maxVal}`
    };
  }

  return { min: null, max: null, label: targetStr };
}

/**
 * Evaluates a single test result based strictly on the priority rule:
 * 1. User's printed report reference range
 * 2. Demographic-adjusted reference range
 * 3. General baseline reference
 */
export function interpretTestResult(
  test: MedicalTest | undefined,
  input: InterpretationInput
): InterpretationResult {
  const DISCLAIMER = 'This automated interpretation is generated for informational support and should NEVER replace direct clinical judgment by your licensed physician or healthcare team. Analytical reference ranges depend on the individual laboratory analyzer.';

  const valNum = parseFloat(input.value);
  const isNumeric = !isNaN(valNum);

  // 1. Determine Effective Reference Range
  let min: number | null = null;
  let max: number | null = null;
  let rangeSource: 'report_printed' | 'demographic_adjusted' | 'clinical_baseline' = 'clinical_baseline';
  let effectiveRangeText = '';

  const userLow = input.customRangeLower ? parseFloat(input.customRangeLower) : null;
  const userHigh = input.customRangeUpper ? parseFloat(input.customRangeUpper) : null;

  if (userLow !== null || userHigh !== null) {
    rangeSource = 'report_printed';
    min = userLow;
    max = userHigh;
    effectiveRangeText = `${min !== null ? min : '—'} - ${max !== null ? max : '—'} ${input.unit || test?.units || ''}`.trim();
  } else if (test) {
    // Check demographic adjustments
    const sexRange = input.sex === 'male' ? test.sexSpecificRange?.male : input.sex === 'female' ? test.sexSpecificRange?.female : null;
    const baseStr = sexRange || test.referenceRange || test.normalRange || '';
    const parsed = parseRangeLimits(baseStr, input.sex, input.age, input.isPregnant);
    min = parsed.min;
    max = parsed.max;
    effectiveRangeText = parsed.label;
    rangeSource = (sexRange || input.age) ? 'demographic_adjusted' : 'clinical_baseline';
  }

  // Fallback to interpretationRules thresholds if not parsed
  if (min === null && test?.interpretationRules?.numeric?.lowThreshold !== undefined) {
    min = test.interpretationRules.numeric.lowThreshold;
  }
  if (max === null && test?.interpretationRules?.numeric?.highThreshold !== undefined) {
    max = test.interpretationRules.numeric.highThreshold;
  }

  // Check critical thresholds
  const critLow = test?.interpretationRules?.numeric?.criticalLow ?? null;
  const critHigh = test?.interpretationRules?.numeric?.criticalHigh ?? null;

  let status: InterpretationStatus = 'NORMAL';
  let isCritical = false;
  let gaugePosition = 50;

  if (isNumeric) {
    // Check Critical Values First
    if (critLow !== null && valNum <= critLow) {
      status = 'CRITICAL';
      isCritical = true;
      gaugePosition = 5;
    } else if (critHigh !== null && valNum >= critHigh) {
      status = 'CRITICAL';
      isCritical = true;
      gaugePosition = 95;
    } else if (min !== null && max !== null) {
      const span = max - min;
      const borderBuffer = span > 0 ? span * 0.08 : 0; // 8% border band

      if (valNum < min) {
        status = 'LOW';
        const dist = min - valNum;
        gaugePosition = Math.max(8, 25 - (dist / (span || 1)) * 20);
      } else if (valNum > max) {
        status = 'HIGH';
        const dist = valNum - max;
        gaugePosition = Math.min(90, 75 + (dist / (span || 1)) * 15);
      } else {
        // Within range - check if borderline
        if (valNum <= min + borderBuffer || valNum >= max - borderBuffer) {
          status = 'BORDERLINE';
          gaugePosition = valNum >= max - borderBuffer ? 68 : 32;
        } else {
          status = 'NORMAL';
          gaugePosition = 35 + ((valNum - min) / (span || 1)) * 30; // 35% to 65%
        }
      }
    } else if (max !== null) {
      // Upper limit only (e.g. < 200, < 10)
      if (valNum > max) {
        status = 'HIGH';
        gaugePosition = 82;
      } else if (valNum >= max * 0.90) {
        status = 'BORDERLINE';
        gaugePosition = 65;
      } else {
        status = 'NORMAL';
        gaugePosition = 45;
      }
    } else if (min !== null) {
      // Lower limit only (e.g. > 60 for eGFR)
      if (valNum < min) {
        status = 'LOW';
        gaugePosition = 15;
      } else if (valNum <= min * 1.10) {
        status = 'BORDERLINE';
        gaugePosition = 35;
      } else {
        status = 'NORMAL';
        gaugePosition = 60;
      }
    }
  } else {
    // Qualitative evaluation
    const valLower = input.value.trim().toLowerCase();
    if (valLower.includes('critical') || valLower.includes('urgent') || valLower.includes('panic')) {
      status = 'CRITICAL';
      isCritical = true;
      gaugePosition = 95;
    } else if (valLower.includes('positive') || valLower.includes('reactive') || valLower.includes('detected') || valLower.includes('abnormal')) {
      status = 'HIGH';
      gaugePosition = 85;
    } else if (valLower.includes('indeterminate') || valLower.includes('borderline') || valLower.includes('equivocal')) {
      status = 'BORDERLINE';
      gaugePosition = 60;
    } else {
      status = 'NORMAL';
      gaugePosition = 45;
    }
  }

  // Generate 3-Tier Explanations
  const testName = input.testName || test?.name || 'Laboratory Test';
  let clinicalInterpretation = '';
  let simpleExplanation = '';
  let possibleAssociations: string[] = [];
  let urgentReviewNotice: string | undefined;

  const unitStr = input.unit || test?.units || '';

  if (isCritical) {
    urgentReviewNotice = `CRITICAL ALERT: Result of ${input.value} ${unitStr} reaches a recognized clinical emergency panic value (${test?.criticalValue || 'acute deviation'}). Prompt medical contact is strongly advised.`;
    clinicalInterpretation = `Patient result of ${input.value} ${unitStr} deviates into critical physiological territory. This level carries risk of acute decompensation, metabolic instability, or active organ failure. Requires immediate clinical correlation and emergency physician notification.`;
    simpleExplanation = `Your result is significantly outside the safe reference limits. Because sudden large changes in this marker can impact your body quickly, you should speak to a doctor or seek medical attention right away.`;
    possibleAssociations = [
      'Acute physiological stress or severe electrolyte / metabolic imbalance',
      'Acute organ dysfunction requiring inpatient evaluation',
      'Immediate medication toxicity or unexpected drug interaction'
    ];
  } else if (status === 'HIGH') {
    clinicalInterpretation = `The observed concentration (${input.value} ${unitStr}) exceeds the upper boundary of the effective reference interval (${effectiveRangeText}). ${test?.highResultMeaning || 'Elevated levels may reflect active tissue injury, metabolic hyperactivity, or reduced organ clearance.'}`;
    simpleExplanation = `Your result is higher than the usual target range for healthy individuals. This is not a diagnosis on its own, but it tells your doctor to look closer at what might be causing the increase.`;
    possibleAssociations = test?.clinicalAssociations || [
      'Active inflammatory or metabolic state',
      'Acute or chronic health condition under evaluation',
      'Medication, dietary, or physiological factors'
    ];
  } else if (status === 'LOW') {
    clinicalInterpretation = `The result (${input.value} ${unitStr}) falls below the physiological reference threshold (${effectiveRangeText}). ${test?.lowResultMeaning || 'Decreased values commonly indicate reduced biosynthetic reserve, dietary deficiency, or rapid metabolic consumption.'}`;
    simpleExplanation = `Your result is lower than the expected healthy range. This often means your body is running low on this substance or that an organ is producing less of it than usual.`;
    possibleAssociations = [
      'Nutritional deficiency or reduced intake',
      'Decreased organ production or clearance alteration',
      'Physiological dilution or therapy response'
    ];
  } else if (status === 'BORDERLINE') {
    clinicalInterpretation = `Result of ${input.value} ${unitStr} lies directly adjacent to the reference cutoff boundary (${effectiveRangeText}). While not overtly pathological, borderline findings frequently represent transitional metabolic states, subclinical changes, or transient physiological fluctuations.`;
    simpleExplanation = `Your result is right on the borderline between normal and elevated/low. It does not mean you have a disease, but it may be worth monitoring again in the future.`;
    possibleAssociations = [
      'Early or subclinical metabolic variation',
      'Recent dietary, hydration, or stress fluctuation',
      'Natural biological day-to-day variance'
    ];
  } else {
    clinicalInterpretation = `The value (${input.value} ${unitStr}) falls squarely within the established physiological reference interval (${effectiveRangeText}). No abnormal deviations detected. ${test?.clinicalPurpose || ''}`;
    simpleExplanation = `Great news: Your test result is in the healthy, expected range. Your body is maintaining normal levels for this marker.`;
    possibleAssociations = [
      'Normal physiological homeostasis',
      'Expected baseline organ function',
      'Stable clinical status'
    ];
  }

  // Recommendations
  const recommendations: string[] = [];
  if (isCritical) {
    recommendations.push('Contact your attending physician or present to an urgent medical evaluation center immediately.');
    recommendations.push('Do not make sudden changes to prescription medications without clinical supervision.');
  } else if (status === 'HIGH' || status === 'LOW') {
    recommendations.push('Schedule a follow-up appointment with your doctor to review this result in your full clinical context.');
    recommendations.push('Bring your original printed laboratory report with exact analyzer reference intervals.');
    recommendations.push('Discuss whether repeat testing or complementary confirmatory tests are recommended.');
  } else if (status === 'BORDERLINE') {
    recommendations.push('Discuss lifestyle, dietary, and hydration habits with your healthcare provider.');
    recommendations.push('Consider scheduled repeat testing in 4 to 12 weeks to monitor trends over time.');
  } else {
    recommendations.push('Continue maintaining your healthy lifestyle and routine wellness checkups.');
    recommendations.push('Keep a record of your lab history to track your baseline over the coming years.');
  }

  const badgeColor = 
    status === 'CRITICAL' ? 'bg-rose-600 text-white' :
    status === 'HIGH' ? 'bg-red-500 text-white' :
    status === 'LOW' ? 'bg-amber-500 text-white' :
    status === 'BORDERLINE' ? 'bg-yellow-400 text-slate-900' :
    'bg-emerald-600 text-white';

  const statusLabel =
    status === 'CRITICAL' ? 'Critical Alert' :
    status === 'HIGH' ? 'High / Elevated' :
    status === 'LOW' ? 'Low / Decreased' :
    status === 'BORDERLINE' ? 'Borderline Range' :
    'Normal / Target Range';

  return {
    status,
    statusLabel,
    badgeColor,
    gaugePosition,
    isCritical,
    urgentReviewNotice,
    effectiveRangeText,
    rangeSource,
    clinicalInterpretation,
    simpleExplanation,
    possibleAssociations,
    recommendations,
    disclaimer: DISCLAIMER
  };
}

/**
 * Multiple-Test Panel Interpretation Engine
 * Synthesizes patterns across CBC, LFT, KFT, Lipids, Thyroid, CMP, etc.
 */
export function interpretClinicalPanel(
  panelName: string,
  tests: PanelTestInput[]
): PanelInterpretationResult {
  let normalCount = 0;
  let borderlineCount = 0;
  let highCount = 0;
  let lowCount = 0;
  let criticalCount = 0;

  const interpretedTests = tests.map(t => {
    const val = parseFloat(t.value);
    const parsed = parseRangeLimits(t.customRange || '');
    let status: InterpretationStatus = 'NORMAL';
    let summary = 'Within expected baseline.';

    if (!isNaN(val) && parsed.min !== null && parsed.max !== null) {
      if (val < parsed.min) {
        status = val < parsed.min * 0.7 ? 'LOW' : 'BORDERLINE';
        summary = 'Below reference interval.';
      } else if (val > parsed.max) {
        status = val > parsed.max * 1.5 ? 'HIGH' : 'BORDERLINE';
        summary = 'Above reference interval.';
      }
    } else if (t.value.toLowerCase().includes('positive') || t.value.toLowerCase().includes('high')) {
      status = 'HIGH';
      summary = 'Positive / Elevated marker detected.';
    }

    if (status === 'NORMAL') normalCount++;
    else if (status === 'BORDERLINE') borderlineCount++;
    else if (status === 'HIGH') highCount++;
    else if (status === 'LOW') lowCount++;
    else if (status === 'CRITICAL') criticalCount++;

    return {
      name: t.testName,
      value: t.value,
      unit: t.unit,
      status,
      summary
    };
  });

  const hasCritical = criticalCount > 0;

  // Pattern detection heuristics
  let patternSummary = 'Individual markers are largely balanced across the panel.';
  const differentialContext: string[] = [];

  const lowerPanel = panelName.toLowerCase();

  if (lowerPanel.includes('liver') || lowerPanel.includes('lft')) {
    if (highCount >= 2) {
      patternSummary = 'Hepatobiliary enzyme pattern detected with concurrent elevation of multiple liver markers.';
      differentialContext.push('Hepatocellular inflammation (Viral, Toxic, Drug-induced, or Metabolic NASH)');
      differentialContext.push('Biliary stasis or cholestatic injury pattern');
      differentialContext.push('Alcohol-related or medication-induced hepatic reaction');
    } else {
      patternSummary = 'Hepatic synthetic function and transaminases are largely within target equilibrium.';
      differentialContext.push('Stable hepatic baseline with no evident acute hepatocellular disruption.');
    }
  } else if (lowerPanel.includes('blood count') || lowerPanel.includes('cbc')) {
    const hasLowHb = tests.some(t => t.testName.toLowerCase().includes('hemo') && parseFloat(t.value) < 12);
    const hasHighWBC = tests.some(t => t.testName.toLowerCase().includes('white') && parseFloat(t.value) > 11);
    if (hasLowHb && lowCount >= 2) {
      patternSummary = 'Anemic profile indicated by reduced red cell indices and hemoglobin content.';
      differentialContext.push('Microcytic vs Normocytic anemia workup (Iron studies, B12/Folate correlation)');
      differentialContext.push('Chronic inflammatory suppression or occult blood loss investigation');
    } else if (hasHighWBC) {
      patternSummary = 'Leukocytosis pattern detected, commonly associated with physiological or infectious response.';
      differentialContext.push('Active bacterial, viral, or tissue inflammatory response');
      differentialContext.push('Acute stress, corticosteroid therapy, or reactive leukocytosis');
    }
  } else if (lowerPanel.includes('kidney') || lowerPanel.includes('renal') || lowerPanel.includes('kft')) {
    const hasHighCr = tests.some(t => t.testName.toLowerCase().includes('creat') && parseFloat(t.value) > 1.3);
    const hasLowGFR = tests.some(t => t.testName.toLowerCase().includes('gfr') && parseFloat(t.value) < 60);
    if (hasHighCr || hasLowGFR) {
      patternSummary = 'Renal filtration reduction indicated by elevated serum creatinine and compromised eGFR.';
      differentialContext.push('Acute kidney injury (pre-renal, intrinsic, or post-renal etiology)');
      differentialContext.push('Chronic kidney disease staging and nephroprotective management');
      differentialContext.push('Dehydration, high dietary protein intake, or medication impact (NSAIDs, ACEi/ARBs)');
    }
  } else if (lowerPanel.includes('lipid')) {
    if (highCount >= 1) {
      patternSummary = 'Dyslipidemic pattern with elevation in atherogenic lipid fractions.';
      differentialContext.push('Atherosclerotic cardiovascular disease (ASCVD) risk estimation');
      differentialContext.push('Primary vs secondary hyperlipidemia (dietary, genetic, thyroid, metabolic syndrome)');
    }
  }

  const doctorGuidance = 'Synthesized panel findings should be clinically correlated with patient symptoms, physical exam, current pharmacological regimen, and sequential longitudinal lab records.';

  return {
    panelName,
    totalTests: tests.length,
    normalCount,
    borderlineCount,
    highCount,
    lowCount,
    criticalCount,
    hasCritical,
    tests: interpretedTests,
    patternSummary,
    differentialContext: differentialContext.length > 0 ? differentialContext : ['General baseline metabolic screening in healthy parameters.'],
    doctorGuidance
  };
}
