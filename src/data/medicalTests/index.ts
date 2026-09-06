import { MedicalTest } from '../../types';
import rawLabTests from './labTestsDatabase.json';

export const ALL_LAB_TESTS: MedicalTest[] = rawLabTests as unknown as MedicalTest[];

// Backward compatibility alias for existing components
export const ALL_1000_MEDICAL_TESTS: MedicalTest[] = ALL_LAB_TESTS;
export const TOTAL_MEDICAL_TESTS_COUNT = ALL_LAB_TESTS.length;

// Common Clinical Panels for multi-test interpretation
export interface ClinicalPanelItem {
  id: string;
  name: string;
  category: string;
  description: string;
  testNames: string[];
}

export const COMMON_CLINICAL_PANELS: ClinicalPanelItem[] = [
  {
    id: 'panel-cbc',
    name: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    description: 'Comprehensive screening of cellular blood elements for anemia, infection, and clotting disorders.',
    testNames: ['White Blood Cell Count', 'Red Blood Cell Count', 'Hemoglobin', 'Hematocrit', 'Platelet Count', 'Mean Corpuscular Volume', 'Absolute Neutrophil Count']
  },
  {
    id: 'panel-lft',
    name: 'Liver Function Tests (LFT / Comprehensive Hepatic)',
    category: 'Liver Function',
    description: 'Evaluates hepatocellular injury, biliary clearance, and synthetic liver capacity.',
    testNames: ['Alanine Aminotransferase', 'Aspartate Aminotransferase', 'Alkaline Phosphatase', 'Gamma-Glutamyl Transferase', 'Total Bilirubin', 'Serum Albumin']
  },
  {
    id: 'panel-kft',
    name: 'Kidney Function Panel (Renal Profile)',
    category: 'Kidney Function',
    description: 'Assesses glomerular filtration, nitrogenous waste clearance, and fluid-electrolyte equilibrium.',
    testNames: ['Serum Creatinine', 'Estimated GFR (CKD-EPI 2021)', 'Blood Urea Nitrogen', 'Serum Cystatin C', 'Serum Sodium', 'Serum Potassium']
  },
  {
    id: 'panel-lipid',
    name: 'Lipid Profile (Cardiovascular Risk)',
    category: 'Lipid Profile',
    description: 'Quantifies circulating atherogenic lipoproteins and protective cholesterol fractions.',
    testNames: ['Total Cholesterol', 'LDL Cholesterol', 'HDL Cholesterol', 'Triglycerides', 'Non-HDL Cholesterol']
  },
  {
    id: 'panel-thyroid',
    name: 'Comprehensive Thyroid Panel',
    category: 'Endocrinology',
    description: 'Evaluates pituitary-thyroid feedback axis, peripheral hormone activation, and autoimmune thyroiditis.',
    testNames: ['Thyroid Stimulating Hormone', 'Free Thyroxine', 'Free Triiodothyronine', 'Anti-Thyroid Peroxidase Antibodies']
  },
  {
    id: 'panel-iron',
    name: 'Iron & Anemia Workup Panel',
    category: 'Hematology',
    description: 'Differentiates iron deficiency, anemia of chronic disease, and iron overload states.',
    testNames: ['Serum Ferritin', 'Serum Iron', 'Total Iron-Binding Capacity', 'Transferrin Saturation %', 'Hemoglobin']
  },
  {
    id: 'panel-cmp',
    name: 'Comprehensive Metabolic Panel (CMP)',
    category: 'Clinical Chemistry',
    description: '14 essential biochemical markers covering glucose, electrolytes, kidney status, and liver enzymes.',
    testNames: ['Serum Sodium', 'Serum Potassium', 'Serum Chloride', 'Serum Carbon Dioxide / Bicarbonate', 'Serum Calcium Total', 'Serum Creatinine', 'Blood Urea Nitrogen', 'Alanine Aminotransferase', 'Aspartate Aminotransferase', 'Total Bilirubin', 'Serum Albumin']
  },
  {
    id: 'panel-diabetes',
    name: 'Diabetes & Glycemic Assessment Panel',
    category: 'Diabetes',
    description: 'Long-term and acute glycemic regulation, insulin resistance, and beta-cell secretory capacity.',
    testNames: ['Hemoglobin A1c', 'Fasting Blood Glucose', 'Serum Insulin', 'C-Peptide']
  }
];

export const POPULAR_SEARCH_TAGS = [
  'HbA1c', 'CBC', 'TSH', 'ALT', 'Creatinine', 'Ferritin',
  'Vitamin D', 'Lipid Profile', 'eGFR', 'Troponin', 'PSA', 'Uric Acid', 'Electrolytes'
];
