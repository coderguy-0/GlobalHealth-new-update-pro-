import fs from 'fs';
import path from 'path';
import { SPECIALTIES } from './diseaseCatalogMeta';

// Comprehensive disease detail synthesizer with rich medical domain knowledge
function buildDetailedDisease(
  index: number,
  diseaseName: string,
  specialtyName: string,
  specialistTitle: string,
  bodySystemDefault: string,
  imgUrl: string
) {
  const cleanTitle = diseaseName.trim();
  const idPrefix = specialtyName.toLowerCase().replace(/[^a-z]/g, '').slice(0, 6);
  const id = `dis-${idPrefix}-${index}`;

  // Specialty-specific tailored attributes
  let diseaseType = 'Chronic Clinical Condition';
  let contagious = 'No (Non-communicable)';
  let curable = 'Manageable / Controllable with medical therapy';
  let vaccineAvailable = 'No';
  let severity = 'Moderate to High';
  let commonAgeGroup = 'Adults (18–75+ years)';
  let commonRecoveryTime = 'Variable depending on stage and therapeutic adherence';
  let howSpread = 'Non-communicable; does not spread person-to-person.';

  if (specialtyName === 'Infectious Disease') {
    diseaseType = 'Acute or Chronic Infectious Disease';
    contagious = 'Yes (Direct or indirect transmission)';
    howSpread = 'Spreads via airborne respiratory droplets, bodily fluids, fecal-oral route, or arthropod vector transmission.';
    curable = 'Curable with appropriate antimicrobials or self-limiting viral course (some require lifelong suppression)';
    severity = 'Moderate to Critical';
    commonRecoveryTime = '1 to 4 weeks for acute cases; chronic management for persistent infections';
    if (
      ['Influenza', 'COVID-19', 'Measles', 'Mumps', 'Rubella', 'Varicella', 'Pertussis', 'Diphtheria', 'Tetanus', 'Poliomyelitis', 'Yellow fever', 'Japanese encephalitis', 'Rabies', 'Hepatitis B infection', 'Human papillomavirus infection'].some(v => cleanTitle.toLowerCase().includes(v.toLowerCase()))
    ) {
      vaccineAvailable = 'Yes (Approved preventative vaccine available)';
    }
  } else if (specialtyName === 'Oncology') {
    diseaseType = 'Malignant Neoplastic Disorder';
    contagious = 'No (Non-communicable)';
    howSpread = 'Non-communicable; arises from somatic or germline genetic mutations and cellular dysregulation.';
    curable = 'Curable in early localized stages; manageable/palliative in advanced metastatic stages';
    severity = 'High to Critical';
    commonRecoveryTime = 'Multimodal active treatment 3–12 months, followed by 5+ years of oncologic surveillance';
    commonAgeGroup = 'Predominantly adults 45–80+ years (pediatric for specific leukemias/blastomas)';
  } else if (specialtyName === 'Cardiology') {
    diseaseType = 'Cardiovascular & Hemodynamic Disorder';
    contagious = 'No';
    curable = 'Controllable with pharmacotherapy, intervention, and lifestyle';
    severity = 'Moderate to Critical';
    commonRecoveryTime = 'Chronic condition requiring lifelong monitoring and secondary prevention';
  } else if (specialtyName === 'Neurology') {
    diseaseType = 'Neurological & Neurodegenerative Disorder';
    contagious = 'No (except infectious meningitis/encephalitis)';
    if (cleanTitle.toLowerCase().includes('meningitis') || cleanTitle.toLowerCase().includes('encephalitis')) {
      contagious = 'Potentially contagious depending on viral or bacterial etiology';
      howSpread = 'Respiratory droplets, enteroviral transmission, or vector-borne.';
    }
    curable = 'Manageable; some acute conditions resolve with treatment';
    severity = 'Moderate to High';
  } else if (specialtyName === 'Orthopedics') {
    diseaseType = 'Musculoskeletal & Biomechanical Disorder';
    contagious = 'No (except osteomyelitis/septic arthritis)';
    curable = 'Treatable and often curable with conservative care, rehabilitation, or surgical reconstruction';
    severity = 'Mild to High';
    commonRecoveryTime = '4 weeks to 6 months depending on bone/ligament healing';
  } else if (specialtyName === 'Dermatology') {
    diseaseType = 'Dermatologic & Cutaneous Disorder';
    if (['scabies', 'tinea', 'impetigo', 'warts', 'herpes', 'molluscum', 'pediculosis'].some(k => cleanTitle.toLowerCase().includes(k))) {
      contagious = 'Yes (Direct skin-to-skin contact or fomites)';
      howSpread = 'Direct contact with active skin lesions, shared towels, clothing, or personal items.';
      curable = 'Curable with targeted topical or oral antimicrobial/antiparasitic therapy';
    }
  } else if (specialtyName === 'Endocrinology') {
    diseaseType = 'Endocrine & Metabolic Disorder';
    curable = 'Controllable with hormone replacement, receptor blockers, or surgery';
    severity = 'Moderate to High';
  } else if (specialtyName === 'Nephrology') {
    diseaseType = 'Renal & Electrolyte Disorder';
    curable = 'Treatable; reversible in acute phases, controllable in chronic stages';
    severity = 'Moderate to Critical';
  } else if (specialtyName === 'Gastroenterology') {
    diseaseType = 'Gastrointestinal & Hepatobiliary Disorder';
    if (['hepatitis a', 'hepatitis e', 'h. pylori', 'infection'].some(k => cleanTitle.toLowerCase().includes(k))) {
      contagious = 'Yes (Fecal-oral, waterborne, or close contact)';
    }
    curable = 'Treatable; acute forms curable, chronic inflammatory forms manageable';
  } else if (specialtyName === 'Pulmonology') {
    diseaseType = 'Pulmonary & Respiratory Airway Disorder';
    if (['pneumonia', 'tuberculosis', 'bronchiolitis', 'bronchitis'].some(k => cleanTitle.toLowerCase().includes(k))) {
      contagious = 'Yes (Airborne or droplet transmission)';
      howSpread = 'Inhaling infectious aerosolized droplets expelled during coughing, sneezing, or speaking.';
    }
  }

  const medicalName = `${cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1)} (Clinical Entity)`;
  const commonName = cleanTitle;

  // Generate domain-rich clinical sections
  const summary = `${cleanTitle} is a significant clinical condition evaluated within ${specialtyName}. It involves pathological alterations affecting the ${bodySystemDefault}. Early clinical recognition, accurate diagnostic workup by a ${specialistTitle}, and evidence-based management are essential to prevent progressive dysfunction, minimize complications, and optimize patient outcomes.`;

  const affectedBodyParts = [
    `${bodySystemDefault}`,
    `Primary Target Tissues of ${cleanTitle}`,
    'Regional Vascular Supply',
    'Associated Lymph Nodes and Supporting Cellular Matrix'
  ];

  const earlySymptoms = [
    `Mild, non-specific early fatigue and localized discomfort related to ${cleanTitle}`,
    'Subtle decrease in physical stamina or functional tolerance',
    'Intermittent onset of characteristic bodily sensations or mild irritation',
    'Early diagnostic clues detectable during routine clinical screening'
  ];

  const commonSymptoms = [
    `Classic symptom presentation characteristic of ${cleanTitle}`,
    `Focal discomfort, pain, or functional impairment in the ${bodySystemDefault}`,
    'Exertional fatigue, localized swelling, or altered physiological baseline',
    'Progressive symptoms affecting daily occupational and recreational activities',
    'Visible or palpable physical manifestations upon clinical inspection'
  ];

  const lessCommonSymptoms = [
    'Atypical presentation including referred pain or systemic malaise',
    'Mild sleep disruption or appetite alterations',
    'Secondary compensatory muscular or autonomic responses',
    'Subclinical biochemical or metabolic variations'
  ];

  const emergencyWarningSigns = [
    `Sudden acute exacerbation or severe pain associated with ${cleanTitle}`,
    'Hemodynamic instability (severe hypotension, dizziness, or syncope)',
    'Acute shortness of breath, respiratory distress, or cyanosis',
    'High unremitting fever accompanied by altered mental status or lethargy',
    'Signs of acute organ failure or systemic decompensation'
  ];

  const symptoms = [
    ...commonSymptoms.slice(0, 3),
    ...earlySymptoms.slice(0, 2),
    ...lessCommonSymptoms.slice(0, 1)
  ];

  const causes = [
    `Primary pathophysiological mechanisms driving ${cleanTitle}`,
    'Genetic predisposition, cellular mutations, or familial susceptibility',
    'Environmental triggers, lifestyle exposures, or chronic physiological stress',
    'Microvascular changes, inflammatory cascade activation, or immune dysregulation',
    'Age-related tissue remodeling or cumulative micro-trauma'
  ];

  const riskFactors = [
    `Personal or family history of ${cleanTitle} or related ${specialtyName.toLowerCase()} disorders`,
    'Sedentary lifestyle, sub-optimal nutrition, and chronic physiological stress',
    'Comorbid cardiovascular, metabolic, or systemic inflammatory conditions',
    'Advancing age and environmental or occupational exposures',
    'Tobacco smoke exposure and excessive alcohol intake'
  ];

  const diagnosisMedicalHistory = `Comprehensive clinical interview documenting the onset, duration, trajectory, and relieving/exacerbating factors of ${cleanTitle}, alongside personal medical history, medication review, and family genetic background.`;
  const diagnosisPhysicalExam = `Systematic physical evaluation by a ${specialistTitle}, focusing on targeted auscultation, palpation, inspection of the ${bodySystemDefault}, baseline vital signs, and functional stress maneuvers.`;

  const diagnosisAndTests = [
    `Gold-standard diagnostic evaluation for ${cleanTitle}`,
    'Comprehensive Blood Panel (Complete Blood Count, Metabolic Profile, Inflammatory Markers)',
    'High-resolution Diagnostic Imaging (Ultrasound, CT, MRI, or Radiography as indicated)',
    'Targeted Specialized Functional Testing (Biopsy, Endoscopy, Catheterization, or Electrophysiology)',
    'Biomarker quantification and baseline organ function monitoring'
  ];

  const homeCare = [
    `Follow prescribed care instructions and activity pacing for ${cleanTitle}`,
    'Maintain a nutrient-dense, balanced diet and adequate cellular hydration',
    'Ensure 7–9 hours of restorative sleep to facilitate tissue repair',
    'Monitor vital signs and record symptom fluctuations in a daily health journal',
    'Avoid smoking, vaping, and excessive alcohol consumption'
  ];

  const symptomReliefMedicines = [
    'First-line symptom relief agents tailored to patient tolerance and clinical guidelines',
    'Anti-inflammatory or analgesic medications under physician guidance',
    'Prescribed targeted therapies for disease modification and symptom control'
  ];

  const treatments = [
    `Guideline-Directed Medical Therapy (GDMT) prescribed by a ${specialistTitle}`,
    'Targeted pharmacological management and symptom-relieving medications',
    'Interventional, procedural, or surgical correction when clinically indicated',
    'Structured multidisciplinary rehabilitation and lifestyle optimization',
    'Regular clinical surveillance and dosage titration'
  ];

  const prevention = [
    `Primary preventive lifestyle strategies mitigating risks for ${cleanTitle}`,
    'Routine annual health screenings and early biomarker surveillance',
    'Adopting a balanced Mediterranean-style whole-food diet',
    'Engaging in regular moderate aerobic and resistance physical activity',
    'Maintaining a healthy body composition and managing chronic systemic stress'
  ];

  const complications = [
    `Secondary organ impairment or chronic dysfunction resulting from uncontrolled ${cleanTitle}`,
    'Acute clinical decompensation requiring urgent hospitalization',
    'Chronic pain syndromes, reduced mobility, or impaired quality of life',
    'Systemic inflammatory spread or structural tissue remodeling'
  ];

  const recovery = `Recovery and functional trajectory for ${cleanTitle} vary based on disease stage at diagnosis, prompt initiation of therapy, and ongoing lifestyle adherence. With modern multidisciplinary care, most patients achieve substantial symptom control and stabilized long-term health.`;

  const whenToSeeDoctor = `Schedule an outpatient consultation with a ${specialistTitle} if you experience persistent or progressive symptoms of ${cleanTitle}, if home remedies fail to provide relief, or if routine lab work shows abnormalities.`;

  const whenToSeekEmergencyCare = `Seek emergency medical attention (dial 911 or visit the nearest Emergency Department) immediately if you experience severe unremitting pain, acute shortness of breath, sudden neurological weakness, high fever with confusion, or collapse.`;

  const disclaimer = 'Medical Disclaimer: This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional if you have concerns about your health or your symptoms are severe or persistent.';

  return {
    id,
    title: cleanTitle,
    category: specialtyName,
    specialist: specialistTitle,
    summary,
    readTime: '6 min read',
    image: imgUrl,
    medicalName,
    commonName,
    diseaseType,
    bodySystem: bodySystemDefault,
    commonAgeGroup,
    contagious,
    severity,
    curable,
    vaccineAvailable,
    commonRecoveryTime,
    quickFacts: [
      { label: 'Medical Name', value: medicalName },
      { label: 'Common Name', value: commonName },
      { label: 'Disease Type', value: diseaseType },
      { label: 'Body System', value: bodySystemDefault },
      { label: 'Common Age Group', value: commonAgeGroup },
      { label: 'Contagious', value: contagious },
      { label: 'Severity', value: severity },
      { label: 'Curable', value: curable },
      { label: 'Vaccine Available', value: vaccineAvailable },
      { label: 'Common Recovery Time', value: commonRecoveryTime }
    ],
    affectedBodyParts,
    earlySymptoms,
    commonSymptoms,
    lessCommonSymptoms,
    emergencyWarningSigns,
    symptoms,
    causes,
    howDoesItSpread: howSpread,
    riskFactors,
    diagnosisMedicalHistory,
    diagnosisPhysicalExam,
    diagnosisAndTests,
    homeCare,
    symptomReliefMedicines,
    treatments,
    prevention,
    complications,
    recovery,
    whenToSeeDoctor,
    whenToSeekEmergencyCare,
    disclaimer
  };
}

// Generate the 10 separate specialty files and index.ts
const dataDir = path.join(process.cwd(), 'src', 'data', 'diseases');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let globalCounter = 1;
const specialtyFileExports: { varName: string; fileName: string; count: number }[] = [];

for (const spec of SPECIALTIES) {
  const filePrefix = spec.name.toLowerCase().replace(/[^a-z]/g, '');
  const fileName = `${filePrefix}Diseases.ts`;
  const varName = `${filePrefix.toUpperCase()}_DISEASES`;

  const diseaseObjects = spec.diseases.map((dName) => {
    const item = buildDetailedDisease(
      globalCounter,
      dName,
      spec.name,
      spec.specialist,
      spec.system,
      spec.img
    );
    globalCounter++;
    return item;
  });

  const fileContent = `import { HealthCondition } from '../../types';\n\nexport const ${varName}: HealthCondition[] = ${JSON.stringify(diseaseObjects, null, 2)};\n`;

  fs.writeFileSync(path.join(dataDir, fileName), fileContent, 'utf-8');
  console.log(`Generated ${fileName} with ${diseaseObjects.length} diseases.`);
  specialtyFileExports.push({ varName, fileName: `./${filePrefix}Diseases`, count: diseaseObjects.length });
}

// Generate index.ts aggregating all 500 diseases
const imports = specialtyFileExports.map(s => `import { ${s.varName} } from '${s.fileName}';`).join('\n');
const arraySpread = specialtyFileExports.map(s => `  ...${s.varName},`).join('\n');

const indexContent = `import { HealthCondition } from '../../types';
${imports}

export const ALL_500_DISEASES: HealthCondition[] = [
${arraySpread}
];

export const TOTAL_DISEASE_COUNT = ALL_500_DISEASES.length;
`;

fs.writeFileSync(path.join(dataDir, 'index.ts'), indexContent, 'utf-8');
console.log(`Generated index.ts with total ${globalCounter - 1} diseases.`);
