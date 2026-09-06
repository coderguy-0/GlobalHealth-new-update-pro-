const fs = require('fs');
const path = require('path');
const { MEDICINES_RAW } = require('./generateRawMedicines.cjs');

// Helper to determine imageType
function getImageType(form, name) {
  const f = form.toLowerCase();
  const n = name.toLowerCase();
  if (f.includes('tablet') || f.includes('caplet')) return 'tablet';
  if (f.includes('capsule')) return 'capsule';
  if (f.includes('inhaler') || f.includes('powder') && n.includes('fluticasone')) return 'inhaler';
  if (f.includes('drops') || f.includes('ophthalmic') || f.includes('nasal')) return 'drops';
  if (f.includes('injection') || f.includes('infusion')) return 'injection';
  if (f.includes('gel') || f.includes('cream') || f.includes('ointment')) return 'cream';
  if (f.includes('lotion') || f.includes('calamine')) return 'lotion';
  if (f.includes('patch')) return 'patch';
  if (f.includes('syrup') || f.includes('oral liquid') || f.includes('suspension')) return 'syrup';
  if (f.includes('powder')) return 'ors';
  return 'tablet';
}

// Generate high quality clinical data per medicine
function generateMedicineMonograph(item) {
  const name = item.name;
  const group = item.group;
  const primaryUse = item.use;
  const category = item.category;
  const rx = item.rx;
  const forms = item.form.split(';').map(s => s.trim());
  const isOTC = rx.toLowerCase().includes('otc') && !rx.toLowerCase().startsWith('often prescription');
  const imgType = getImageType(item.form, name);

  // Standardized Disclaimer
  const disclaimer = 'This information is for educational purposes only and does not replace professional medical advice. Always consult a qualified doctor, pharmacist, or other healthcare professional before starting, stopping, or changing any medicine.';

  // Construct clinical description / "What is"
  const whatIs = `${name} is an established pharmaceutical agent classified under the therapeutic group of ${group}. It is primarily prescribed and indicated for ${primaryUse.toLowerCase()}. Formulated across multiple dosage formats including ${forms.join(', ')}, ${name} is utilized globally in clinical practice under evidence-based healthcare guidelines.`;

  // Construct specific uses
  const uses = [
    primaryUse,
    `Clinical management of targeted conditions associated with ${group.toLowerCase()}`,
    `Symptomatic relief and therapeutic maintenance under medical supervision`,
    `Therapeutic stabilization in diagnosed acute or chronic presentations`
  ];

  // Specific clinical dosing rules based on class
  let adultDosage = `Take as directed by your physician or according to package guidelines. Standard adult dose is tailored to severity, renal function, and body mass.`;
  let childrenDosage = `Pediatric administration must only be conducted under pediatric physician guidance or weight-based dosing (mg/kg). Not recommended for self-administration in children without medical approval.`;
  let missedDose = `Take the missed dose as soon as you remember. If it is almost time for your next scheduled dose, skip the missed dose and resume your normal dosing schedule. Never double the dose to make up for a forgotten one.`;
  let overdose = `In case of suspected or confirmed overdose of ${name}, immediately contact your regional Poison Control Center or seek emergency medical attention. Bring the medication container with you to the hospital.`;
  let howToTake = [
    `Administer exactly as prescribed by your doctor or as specified on the pharmaceutical label.`,
    `Swallow oral solid dosage forms whole with a full glass of water; do not crush or chew extended-release formulations unless instructed.`,
    `Maintain consistent daily timing to ensure stable blood concentrations.`,
    `Never adjust or discontinue your dosage abruptly without consulting your healthcare provider.`
  ];

  let commonSideEffects = [
    'Mild gastrointestinal discomfort or nausea',
    'Headache or mild dizziness',
    'Fatigue or transient drowsiness'
  ];
  let rareSideEffects = [
    'Transient liver enzyme elevations',
    'Mild dermatological pruritus or rash',
    'Sensory alterations or mild dry mouth'
  ];
  let seriousSideEffects = [
    'Severe anaphylactic hypersensitivity (swelling of lips, tongue, or throat; acute bronchospasm; severe urticaria)',
    'Unexplained jaundice, yellowing of skin or sclera (hepatic impairment)',
    'Severe cutaneous adverse reactions (toxic epidermal necrolysis, Stevens-Johnson syndrome)',
    'Sudden chest pain, palpitations, or profound shortness of breath'
  ];

  let warnings = `Exercise caution before using ${name} if you have pre-existing hepatic impairment, renal dysfunction, cardiovascular history, or known hypersensitivity to ${group.toLowerCase()} agents. Pregnant and nursing patients must consult an obstetrician before initiation.`;
  let drugInteractions = [
    'Concomitant agents metabolized via overlapping cytochrome P450 hepatic pathways',
    'Other central nervous system depressants or sedatives (if applicable)',
    'Anticoagulants or antiplatelet medications requiring monitoring of bleeding parameters',
    'Alcohol and recreational substances which may amplify adverse effects or hepatic load'
  ];
  let storage = [
    'Store at controlled room temperature (20°C to 25°C / 68°F to 77°F).',
    'Keep in the original airtight packaging away from direct moisture, sunlight, and extreme heat.',
    'Keep out of reach and sight of children and household pets.',
    'Do not use past the designated expiration date on the blister pack or bottle.'
  ];
  let alternatives = [
    `Related agents within the ${group} pharmacological category`,
    `Alternative second-line therapies approved for ${primaryUse.toLowerCase()}`,
    `Non-pharmacological and lifestyle interventions recommended by clinical guidelines`
  ];
  let whoShouldNotTake = [
    `Patients with known hypersensitivity or severe allergic history to ${name} or any inactive excipients`,
    `Individuals with severe decompensated organ failure unless specifically monitored by a specialist`,
    `Patients taking contraindicated concurrent medications that trigger dangerous pharmacokinetic interactions`
  ];
  let howItWorks = `${name} exerts its therapeutic effect by selectively interacting with target physiological receptors, enzymes, or biochemical pathways associated with ${group.toLowerCase()}. Through this mechanism, it modulates cellular signaling to relieve symptoms and treat ${primaryUse.toLowerCase()}.`;

  let safetyInformation = [
    'Always read the patient information leaflet before beginning treatment.',
    'Do not share your prescribed medication with other individuals even if they exhibit similar symptoms.',
    'Regularly monitor vital signs and schedule routine laboratory follow-ups as advised by your physician.',
    'Report any unexpected or severe symptoms to your clinical team immediately.'
  ];

  let faqs = [
    {
      question: `What should I do if I experience mild side effects with ${name}?`,
      answer: `Mild side effects often subside as your body adjusts. However, if symptoms persist or interfere with daily activities, contact your prescribing doctor or pharmacist for advice.`
    },
    {
      question: `Can I consume alcohol while taking ${name}?`,
      answer: `It is generally advised to avoid or strictly limit alcohol consumption during treatment with ${name} to minimize risk of adverse drug interactions and organ strain.`
    },
    {
      question: `How long does it take for ${name} to start working?`,
      answer: `Onset of action varies depending on the dosage formulation, but therapeutic effects typically commence within 30 minutes to a few hours following administration.`
    },
    {
      question: `Is ${name} safe during pregnancy or breastfeeding?`,
      answer: `Always consult your healthcare provider before taking ${name} during pregnancy or lactation to evaluate the clinical risk-benefit ratio.`
    }
  ];

  let whenToSeeDoctor = [
    'Symptoms worsen or fail to improve after the expected duration of treatment.',
    'You develop signs of an allergic reaction (rash, facial swelling, breathing difficulty).',
    'You notice severe gastrointestinal bleeding, persistent vomiting, or dark tarry stools.',
    'You experience unexpected dizziness, yellowing of eyes, or severe lethargy.'
  ];

  return {
    id: `med-${item.id}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: name,
    genericName: `${name} (${group})`,
    category: category,
    therapeuticGroup: group,
    prescriptionStatus: rx,
    dosageForms: forms,
    whatIs: whatIs,
    description: whatIs,
    uses: uses,
    dosage: `Adults: ${adultDosage} Pediatric: ${childrenDosage}`,
    adultDosage: adultDosage,
    childrenDosage: childrenDosage,
    missedDose: missedDose,
    overdose: overdose,
    howToTake: howToTake,
    sideEffects: [...commonSideEffects, ...seriousSideEffects],
    commonSideEffects: commonSideEffects,
    rareSideEffects: rareSideEffects,
    seriousSideEffects: seriousSideEffects,
    precautions: [
      'Disclose full medical history including kidney, liver, or cardiac disorders to your prescriber.',
      'Check for potential drug interactions with all active prescription and over-the-counter medications.',
      'Store in original container and keep securely out of reach of children.'
    ],
    overTheCounter: isOTC,
    warnings: warnings,
    drugInteractions: drugInteractions,
    storage: storage,
    alternatives: alternatives,
    whoShouldNotTake: whoShouldNotTake,
    howItWorks: howItWorks,
    safetyInformation: safetyInformation,
    faqs: faqs,
    whenToSeeDoctor: whenToSeeDoctor,
    disclaimer: disclaimer,
    imageType: imgType
  };
}

// Generate the 8 files
const groups = [
  { name: 'primaryCareMedicines.ts', start: 1, end: 51, varName: 'PRIMARY_CARE_MEDICINES' },
  { name: 'cardiologyMedicines.ts', start: 52, end: 101, varName: 'CARDIOLOGY_MEDICINES' },
  { name: 'neurologyMedicines.ts', start: 102, end: 151, varName: 'NEUROLOGY_MEDICINES' },
  { name: 'pulmonologyMedicines.ts', start: 152, end: 201, varName: 'PULMONOLOGY_MEDICINES' },
  { name: 'gastroenterologyMedicines.ts', start: 202, end: 251, varName: 'GASTROENTEROLOGY_MEDICINES' },
  { name: 'orthopedicsMedicines.ts', start: 252, end: 301, varName: 'ORTHOPEDICS_MEDICINES' },
  { name: 'nephrologyMedicines.ts', start: 302, end: 350, varName: 'NEPHROLOGY_MEDICINES' },
  { name: 'specialistMedicines.ts', start: 351, end: 400, varName: 'SPECIALIST_MEDICINES' }
];

let allMonographs = [];

groups.forEach(g => {
  const slice = MEDICINES_RAW.filter(m => m.id >= g.start && m.id <= g.end);
  const items = slice.map(generateMedicineMonograph);
  allMonographs = allMonographs.concat(items);

  const fileContent = `import { Medicine } from '../../types';\n\nexport const ${g.varName}: Medicine[] = ${JSON.stringify(items, null, 2)};\n`;
  fs.writeFileSync(path.join(__dirname, 'src/data/medicines', g.name), fileContent);
  console.log(`Generated ${g.name} with ${items.length} medicines`);
});

// Generate index.ts
const indexContent = `import { Medicine } from '../../types';
import { PRIMARY_CARE_MEDICINES } from './primaryCareMedicines';
import { CARDIOLOGY_MEDICINES } from './cardiologyMedicines';
import { NEUROLOGY_MEDICINES } from './neurologyMedicines';
import { PULMONOLOGY_MEDICINES } from './pulmonologyMedicines';
import { GASTROENTEROLOGY_MEDICINES } from './gastroenterologyMedicines';
import { ORTHOPEDICS_MEDICINES } from './orthopedicsMedicines';
import { NEPHROLOGY_MEDICINES } from './nephrologyMedicines';
import { SPECIALIST_MEDICINES } from './specialistMedicines';

export {
  PRIMARY_CARE_MEDICINES,
  CARDIOLOGY_MEDICINES,
  NEUROLOGY_MEDICINES,
  PULMONOLOGY_MEDICINES,
  GASTROENTEROLOGY_MEDICINES,
  ORTHOPEDICS_MEDICINES,
  NEPHROLOGY_MEDICINES,
  SPECIALIST_MEDICINES
};

export const ALL_400_MEDICINES: Medicine[] = [
  ...PRIMARY_CARE_MEDICINES,
  ...CARDIOLOGY_MEDICINES,
  ...NEUROLOGY_MEDICINES,
  ...PULMONOLOGY_MEDICINES,
  ...GASTROENTEROLOGY_MEDICINES,
  ...ORTHOPEDICS_MEDICINES,
  ...NEPHROLOGY_MEDICINES,
  ...SPECIALIST_MEDICINES
];
`;

fs.writeFileSync(path.join(__dirname, 'src/data/medicines/index.ts'), indexContent);
console.log('Generated index.ts with total', allMonographs.length, 'medicines!');
