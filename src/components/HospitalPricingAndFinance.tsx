import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Calculator,
  TrendingUp,
  History,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Printer,
  ChevronDown,
  ChevronRight,
  Info,
  CreditCard,
  Building2,
  Stethoscope,
  Activity,
  Microscope,
  Droplet,
  ShieldAlert,
  Layers,
  HeartPulse,
  Award,
  Plus,
  Trash2,
  RefreshCw,
  HelpCircle,
  Check
} from 'lucide-react';
import { Hospital } from '../types';

interface HospitalPricingAndFinanceProps {
  hospital: Hospital;
  currencySymbol: string;
}

export type PricingSection =
  | 'catalog'
  | 'consultation'
  | 'laboratory'
  | 'imaging'
  | 'rooms'
  | 'critical'
  | 'surgery'
  | 'emergency'
  | 'packages'
  | 'insurance'
  | 'admin'
  | 'estimator'
  | 'comparison'
  | 'history'
  | 'verification';

interface PricingItem {
  id: string;
  code: string;
  name: string;
  category: string;
  subcategory: string;
  selfPay: number;
  insuranceCover: string;
  unit: string;
  cptCode?: string;
  description?: string;
  regionalAvg: number;
}

export const HospitalPricingAndFinance: React.FC<HospitalPricingAndFinanceProps> = ({
  hospital,
  currencySymbol
}) => {
  const [activeSection, setActiveSection] = useState<PricingSection>('catalog');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Interactive Cost Estimator State
  const [selectedEstimatorItems, setSelectedEstimatorItems] = useState<Array<{ item: PricingItem; count: number }>>([]);
  const [hasInsurance, setHasInsurance] = useState<boolean>(true);
  const [insuranceTier, setInsuranceTier] = useState<'tier1' | 'tier2' | 'copay20'>('tier1');
  const [quoteCopied, setQuoteCopied] = useState<boolean>(false);

  // Raw Comprehensive Catalog Data
  const pricingItems: PricingItem[] = useMemo(() => [
    // 1. Doctor Consultation Fees
    {
      id: 'PF-DOC-01',
      code: 'CPT-99203',
      name: 'General Physician / Primary Care OPD Consultation',
      category: 'Doctor Consultations',
      subcategory: 'Doctor Consultation',
      selfPay: 45,
      insuranceCover: '100% Covered (Copay $5)',
      unit: 'Per Visit',
      description: 'Comprehensive initial medical evaluation and triage by resident physician.',
      regionalAvg: 55
    },
    {
      id: 'PF-DOC-02',
      code: 'CPT-99205',
      name: 'Senior Specialist / Department Chair Consultation',
      category: 'Doctor Consultations',
      subcategory: 'Specialist Fees',
      selfPay: 120,
      insuranceCover: '100% Covered (Copay $20)',
      unit: 'Per Visit',
      description: 'In-depth clinical consultation with Board-Certified Specialist / Professor.',
      regionalAvg: 140
    },
    {
      id: 'PF-DOC-03',
      code: 'CPT-99442',
      name: 'HD Telehealth / Video Specialist Consultation',
      category: 'Doctor Consultations',
      subcategory: 'Teleconsultation',
      selfPay: 40,
      insuranceCover: '100% Covered (Direct Billing)',
      unit: 'Per 25-min Session',
      description: 'Encrypted EHR-integrated digital audio-video teleconsultation with prescription dispatch.',
      regionalAvg: 50
    },
    {
      id: 'PF-DOC-04',
      code: 'CPT-99212',
      name: 'Post-Discharge / Routine Follow-up Consultation',
      category: 'Doctor Consultations',
      subcategory: 'Follow-up Fees',
      selfPay: 25,
      insuranceCover: '100% Covered (Copay $0)',
      unit: 'Within 14 Days',
      description: 'Post-intervention treatment response assessment and medication adjustment.',
      regionalAvg: 35
    },

    // 2. Laboratory
    {
      id: 'PF-LAB-01',
      code: 'CPT-80053',
      name: 'Comprehensive Metabolic Panel (CMP 14 Parameters)',
      category: 'Laboratory',
      subcategory: 'Blood Tests',
      selfPay: 35,
      insuranceCover: '100% Covered',
      unit: 'STAT Test',
      description: 'Kidney & liver function, glucose, electrolytes, calcium, and protein markers.',
      regionalAvg: 45
    },
    {
      id: 'PF-LAB-02',
      code: 'CPT-85025',
      name: 'Complete Blood Count (CBC) with Automated 6-Part Diff',
      category: 'Laboratory',
      subcategory: 'Blood Tests',
      selfPay: 20,
      insuranceCover: '100% Covered',
      unit: 'Per Sample',
      description: 'Hemoglobin, RBC, WBC differential count, and platelet parameters.',
      regionalAvg: 28
    },
    {
      id: 'PF-LAB-03',
      code: 'CPT-81001',
      name: 'Automated Urinalysis with Microscopic Examination',
      category: 'Laboratory',
      subcategory: 'Urine Tests',
      selfPay: 18,
      insuranceCover: '100% Covered',
      unit: 'Per Sample',
      description: 'Chemical reagent strip plus automated flow cytometry sediment analysis.',
      regionalAvg: 25
    },
    {
      id: 'PF-LAB-04',
      code: 'CPT-88305',
      name: 'Surgical Histopathology Biopsy Evaluation (Level IV)',
      category: 'Laboratory',
      subcategory: 'Pathology',
      selfPay: 180,
      insuranceCover: 'Tier 1 In-Network',
      unit: 'Per Specimen',
      description: 'Gross and microscopic diagnosis by senior clinical pathologist.',
      regionalAvg: 220
    },
    {
      id: 'PF-LAB-05',
      code: 'CPT-87070',
      name: 'Blood & Fluid Aerobic / Anaerobic Culture & Sensitivity',
      category: 'Laboratory',
      subcategory: 'Microbiology',
      selfPay: 65,
      insuranceCover: '100% Covered',
      unit: 'Per Specimen',
      description: 'Automated bio-identification & MIC antibiotic susceptibility profiling.',
      regionalAvg: 80
    },
    {
      id: 'PF-LAB-06',
      code: 'CPT-81408',
      name: 'Next-Generation Sequencing (NGS) Comprehensive Oncology Panel',
      category: 'Laboratory',
      subcategory: 'Genetics',
      selfPay: 1250,
      insuranceCover: 'Pre-auth Required',
      unit: 'Per Panel (500+ Genes)',
      description: 'Tumor somatic mutational profiling for targeted chemotherapy & immunotherapy.',
      regionalAvg: 1600
    },
    {
      id: 'PF-LAB-07',
      code: 'CPT-80061',
      name: 'Annual Preventive Wellness Biomarker Blood Bundle',
      category: 'Laboratory',
      subcategory: 'Health Packages',
      selfPay: 110,
      insuranceCover: '100% Preventive Care',
      unit: 'Bundle (12 Tests)',
      description: 'Lipid profile, HbA1c, CMP, Vitamin D, TSH, hs-CRP, and CBC.',
      regionalAvg: 150
    },

    // 3. Imaging
    {
      id: 'PF-IMG-01',
      code: 'CPT-71046',
      name: 'Digital Chest X-Ray (2 Views: PA & Lateral)',
      category: 'Imaging',
      subcategory: 'X-Ray',
      selfPay: 45,
      insuranceCover: '100% Covered',
      unit: 'Per Procedure',
      description: 'High-resolution ultra-low dose direct digital radiography.',
      regionalAvg: 60
    },
    {
      id: 'PF-IMG-02',
      code: 'CPT-74177',
      name: '256-Slice CT Abdomen & Pelvis (with IV & Oral Contrast)',
      category: 'Imaging',
      subcategory: 'CT',
      selfPay: 420,
      insuranceCover: 'Tier 1 In-Network',
      unit: 'Per Scan',
      description: 'Sub-millimeter multi-planar volumetric reconstruction with AI artifact reduction.',
      regionalAvg: 550
    },
    {
      id: 'PF-IMG-03',
      code: 'CPT-70553',
      name: '3.0T MRI Brain & Neuro-Vascular Angiography (w/ Contrast)',
      category: 'Imaging',
      subcategory: 'MRI',
      selfPay: 580,
      insuranceCover: 'Tier 1 In-Network',
      unit: 'Per Scan',
      description: 'Siemens 3T 64-channel matrix coil high-definition parenchymal & vascular sequences.',
      regionalAvg: 750
    },
    {
      id: 'PF-IMG-04',
      code: 'CPT-76700',
      name: 'Whole Abdomen & Pelvic Color Doppler Ultrasound',
      category: 'Imaging',
      subcategory: 'Ultrasound',
      selfPay: 120,
      insuranceCover: '100% Covered',
      unit: 'Per Scan',
      description: 'High-frequency harmonic probe imaging of abdominal organs and visceral vasculature.',
      regionalAvg: 160
    },
    {
      id: 'PF-IMG-05',
      code: 'CPT-78815',
      name: 'Whole-Body Digital PET-CT (18F-FDG Oncology Molecular Scan)',
      category: 'Imaging',
      subcategory: 'Other Imaging',
      selfPay: 1100,
      insuranceCover: 'Pre-auth In-Network',
      unit: 'Full Protocol',
      description: 'Digital PET scanner co-registered with high-speed diagnostic CT.',
      regionalAvg: 1400
    },

    // 4. Room & Bed Charges
    {
      id: 'PF-BED-01',
      code: 'REV-0120',
      name: 'General Multi-Bed Acute Care Inpatient Ward',
      category: 'Room & Bed Charges',
      subcategory: 'General',
      selfPay: 180,
      insuranceCover: 'Covered in Full',
      unit: 'Per 24 Hours',
      description: 'Standard 4-bed room with 24/7 dedicated nursing station, central oxygen and vitals telemetry.',
      regionalAvg: 220
    },
    {
      id: 'PF-BED-02',
      code: 'REV-0130',
      name: 'Semi-Private Dual-Occupancy Patient Room',
      category: 'Room & Bed Charges',
      subcategory: 'Semi-Private',
      selfPay: 290,
      insuranceCover: 'Covered in Full',
      unit: 'Per 24 Hours',
      description: '2-bed room with privacy partitions, attached bathroom, and patient entertainment consoles.',
      regionalAvg: 350
    },
    {
      id: 'PF-BED-03',
      code: 'REV-0110',
      name: 'Private Single En-Suite Patient Room',
      category: 'Room & Bed Charges',
      subcategory: 'Private',
      selfPay: 460,
      insuranceCover: 'Covered to Cap ($400/day)',
      unit: 'Per 24 Hours',
      description: 'Spacious private room, en-suite bathroom, sleeper couch for attendant, and personalized dietitian menu.',
      regionalAvg: 540
    },
    {
      id: 'PF-BED-04',
      code: 'REV-0111',
      name: 'Deluxe Executive Patient Room',
      category: 'Room & Bed Charges',
      subcategory: 'Deluxe',
      selfPay: 680,
      insuranceCover: 'Differential Copay',
      unit: 'Per 24 Hours',
      description: 'Large corner suite with separate attendant lounge, kitchenette, and dedicated concierge liaison.',
      regionalAvg: 850
    },
    {
      id: 'PF-BED-05',
      code: 'REV-0119',
      name: 'VIP Presidential Suite with Family Antechamber',
      category: 'Room & Bed Charges',
      subcategory: 'Suite',
      selfPay: 1250,
      insuranceCover: 'Differential Copay',
      unit: 'Per 24 Hours',
      description: 'Luxury 2-bedroom presidential suite with private meeting room, dedicated butler and nurse.',
      regionalAvg: 1600
    },

    // 5. Critical Care
    {
      id: 'PF-CC-01',
      code: 'REV-0200',
      name: 'Multi-Disciplinary Medical & Surgical ICU (Level III)',
      category: 'Critical Care',
      subcategory: 'ICU',
      selfPay: 1400,
      insuranceCover: '100% In-Network Covered',
      unit: 'Per 24 Hours',
      description: '1:1 nurse-to-patient ratio, advanced mechanical ventilation, invasive hemodynamics, and intensivist coverage.',
      regionalAvg: 1750
    },
    {
      id: 'PF-CC-02',
      code: 'REV-0174',
      name: 'Neonatal Intensive Care Unit (NICU Level III Advanced)',
      category: 'Critical Care',
      subcategory: 'NICU',
      selfPay: 1200,
      insuranceCover: '100% In-Network Covered',
      unit: 'Per 24 Hours',
      description: 'High-frequency oscillatory ventilators, Giraffe incubators, and total parenteral nutrition protocol.',
      regionalAvg: 1500
    },
    {
      id: 'PF-CC-03',
      code: 'REV-0208',
      name: 'Pediatric Intensive Care Unit (PICU Level III)',
      category: 'Critical Care',
      subcategory: 'PICU',
      selfPay: 1300,
      insuranceCover: '100% In-Network Covered',
      unit: 'Per 24 Hours',
      description: 'Dedicated pediatric intensivists, pediatric ECMO support, and specialized pediatric monitoring.',
      regionalAvg: 1600
    },
    {
      id: 'PF-CC-04',
      code: 'REV-0210',
      name: 'Coronary Care Unit (CCU / Post-Cardiac Intervention)',
      category: 'Critical Care',
      subcategory: 'CCU',
      selfPay: 1350,
      insuranceCover: '100% In-Network Covered',
      unit: 'Per 24 Hours',
      description: 'Post-STEMI, post-PCI, intra-aortic balloon pump (IABP) and telemetry arrhythmia monitoring.',
      regionalAvg: 1700
    },

    // 6. Procedures & Surgery
    {
      id: 'PF-SURG-01',
      code: 'CPT-92928',
      name: 'Percutaneous Coronary Intervention (PCI Single Stent)',
      category: 'Procedures & Surgery',
      subcategory: 'Procedures & Surgery',
      selfPay: 4800,
      insuranceCover: 'Pre-auth Cashless Package',
      unit: 'Procedure',
      description: 'Coronary angioplasty with bio-absorbable drug-eluting stent (DES) placement and IVUS guidance.',
      regionalAvg: 5800
    },
    {
      id: 'PF-SURG-02',
      code: 'REV-0360',
      name: 'Modular Major Operation Theatre (Laminar Air Flow Class 100)',
      category: 'Procedures & Surgery',
      subcategory: 'Operation Theatre',
      selfPay: 650,
      insuranceCover: '100% In-Network',
      unit: 'First 2 Hours',
      description: 'HEPA-filtered positive pressure surgical suite with integrated 4K laparoscopic imaging.',
      regionalAvg: 800
    },
    {
      id: 'PF-SURG-03',
      code: 'CPT-00100',
      name: 'General Anesthesia with Invasive Neuromonitoring (BIS)',
      category: 'Procedures & Surgery',
      subcategory: 'Anesthesia',
      selfPay: 450,
      insuranceCover: '100% In-Network',
      unit: 'Per Surgery Case',
      description: 'Senior consultant anesthesiologist with total intravenous anesthesia (TIVA) management.',
      regionalAvg: 550
    },
    {
      id: 'PF-SURG-04',
      code: 'HCPCS-C1874',
      name: 'Drug-Eluting Platinum-Chromium Coronary Stent',
      category: 'Procedures & Surgery',
      subcategory: 'Implants & Devices',
      selfPay: 950,
      insuranceCover: 'Government Capped / Cashless',
      unit: 'Per Implant',
      description: 'FDA/CE approved third-generation everolimus-eluting cobalt/platinum coronary stent.',
      regionalAvg: 1150
    },
    {
      id: 'PF-SURG-05',
      code: 'REV-0270',
      name: 'Sterile Surgical Consumables & Disposable Pack',
      category: 'Procedures & Surgery',
      subcategory: 'Consumables',
      selfPay: 180,
      insuranceCover: 'Covered within package',
      unit: 'Per Procedure',
      description: 'Single-use sterile surgical drapes, sutures, staplers, and personal protective apparel.',
      regionalAvg: 230
    },

    // 7. Emergency, Ambulance & Ancillary
    {
      id: 'PF-EMG-01',
      code: 'CPT-99285',
      name: 'Emergency Trauma Resuscitation & Triage (Level 5 STAT)',
      category: 'Emergency & Ancillary',
      subcategory: 'Emergency Charges',
      selfPay: 150,
      insuranceCover: '100% ER In-Network',
      unit: 'Initial Resuscitation',
      description: 'Immediate trauma team activation, emergency airway, STAT sonography, and stabilization.',
      regionalAvg: 190
    },
    {
      id: 'PF-EMG-02',
      code: 'HCPCS-A0427',
      name: 'Advanced Life Support (ALS) Ambulance Dispatch',
      category: 'Emergency & Ancillary',
      subcategory: 'Ambulance Charges',
      selfPay: 120,
      insuranceCover: '100% Emergency Covered',
      unit: 'Per Callout (Within 25km)',
      description: 'Mobile ICU ambulance with ventilator, defibrillator, infusion pumps, and paramedic team.',
      regionalAvg: 160
    },
    {
      id: 'PF-EMG-03',
      code: 'REV-0250',
      name: 'Inpatient Automated Dispensing Pharmacy Medications',
      category: 'Emergency & Ancillary',
      subcategory: 'Pharmacy',
      selfPay: 85,
      insuranceCover: 'Cashless Dispensed',
      unit: 'Itemized by Prescription',
      description: 'Direct computerized unit-dose Swisslog robotic dispensing at government-approved MSRP.',
      regionalAvg: 95
    },
    {
      id: 'PF-EMG-04',
      code: 'CPT-P9016',
      name: 'Leukoreduced Packed Red Blood Cells (PRBC) Transfusion',
      category: 'Emergency & Ancillary',
      subcategory: 'Blood Bank Services',
      selfPay: 95,
      insuranceCover: '100% In-Network',
      unit: 'Per Unit (350ml)',
      description: 'NAT tested, cross-matched, leukodepleted blood unit with transfusion monitoring.',
      regionalAvg: 120
    },
    {
      id: 'PF-EMG-05',
      code: 'HCPCS-G0151',
      name: 'Post-Operative Home Nursing & Wound Care Visit',
      category: 'Emergency & Ancillary',
      subcategory: 'Home Healthcare',
      selfPay: 60,
      insuranceCover: 'Covered (Post-Op Benefit)',
      unit: 'Per 60-min Home Visit',
      description: 'Certified clinical nurse home visit for sterile dressing changes, IV injections, and vitals check.',
      regionalAvg: 80
    },

    // 8. Hospital Packages
    {
      id: 'PF-PKG-01',
      code: 'PKG-CHK-01',
      name: 'Executive Comprehensive Health Check-up (50+ Parameters)',
      category: 'Hospital Packages',
      subcategory: 'Health Check-up Packages',
      selfPay: 320,
      insuranceCover: 'Preventive Health Cover',
      unit: 'Full Comprehensive Day Package',
      description: 'Includes full pathology blood panel, Echo/TMT, ultrasound abdomen, chest X-Ray, ECG, diet & doctor consults.',
      regionalAvg: 420
    },
    {
      id: 'PF-PKG-02',
      code: 'PKG-MAT-01',
      name: 'All-Inclusive Normal Delivery Maternity Package (3 Days)',
      category: 'Hospital Packages',
      subcategory: 'Maternity Packages',
      selfPay: 2200,
      insuranceCover: 'Maternity Rider Approved',
      unit: '3 Days / 2 Nights',
      description: 'Obstetrician fees, labor room, private room, pediatrician checks, neonatal immunizations, and lactation consult.',
      regionalAvg: 2800
    },
    {
      id: 'PF-PKG-03',
      code: 'PKG-SURG-01',
      name: 'Laparoscopic Cholecystectomy Surgery Package (2 Days)',
      category: 'Hospital Packages',
      subcategory: 'Surgery Packages',
      selfPay: 2600,
      insuranceCover: 'Pre-auth Cashless Approved',
      unit: '2 Days / 1 Night',
      description: 'Surgeon fees, anesthesia, OT charges, private room, pre-op tests, medications, and follow-up consultation.',
      regionalAvg: 3200
    },

    // 9. Insurance & Schemes
    {
      id: 'PF-INS-01',
      code: 'INS-CASH-01',
      name: 'Global Private Insurance Direct Cashless Settlement',
      category: 'Insurance & Schemes',
      subcategory: 'Cashless',
      selfPay: 0,
      insuranceCover: '100% Pre-Auth Direct Settlement',
      unit: 'Per Inpatient Claim',
      description: 'Zero out-of-pocket cashless processing for Bupa, Cigna, Allianz, Aetna, AXA, MetLife, and national networks.',
      regionalAvg: 0
    },
    {
      id: 'PF-INS-02',
      code: 'INS-GOV-01',
      name: 'Government Universal Health Coverage Scheme Desk',
      category: 'Insurance & Schemes',
      subcategory: 'Government Schemes',
      selfPay: 0,
      insuranceCover: '100% Subsidized / Free for Eligible Citizens',
      unit: 'Scheme Enrolled Patients',
      description: 'Dedicated government scheme facilitation desk offering zero-delay admission and expedited authorizations.',
      regionalAvg: 0
    },

    // 10. Registration & Billing Administration
    {
      id: 'PF-ADM-01',
      code: 'ADM-REG-01',
      name: 'One-Time GlobalHealth Lifetime Patient Digital Registration',
      category: 'Administrative & Billing',
      subcategory: 'Registration Charges',
      selfPay: 10,
      insuranceCover: 'Waived for Insured',
      unit: 'One-Time Lifetime',
      description: 'Digital EHR profile setup, barcoded smart health card, and patient portal access credentials.',
      regionalAvg: 15
    },
    {
      id: 'PF-ADM-02',
      code: 'ADM-DEP-01',
      name: 'Elective Inpatient Planned Admission Deposit (Refundable)',
      category: 'Administrative & Billing',
      subcategory: 'Admission Deposit',
      selfPay: 500,
      insuranceCover: '$0 with Pre-Authorized Cashless',
      unit: 'Refundable Security',
      description: 'Adjustable against final bill balance or 100% refundable upon cashless insurer payment settlement.',
      regionalAvg: 600
    },
    {
      id: 'PF-ADM-03',
      code: 'ADM-BIL-01',
      name: 'Itemized Transparent Final Bill Audit & Statement of Account',
      category: 'Administrative & Billing',
      subcategory: 'Billing',
      selfPay: 0,
      insuranceCover: 'Complimentary Free Service',
      unit: 'Per Discharge',
      description: 'Line-item breakdown of all medications, tests, procedures, and doctor visits with CPT/HCPCS codes.',
      regionalAvg: 0
    },
    {
      id: 'PF-ADM-04',
      code: 'ADM-REF-01',
      name: 'Digital Express Deposit Refund & Reconciliation Process',
      category: 'Administrative & Billing',
      subcategory: 'Refunds',
      selfPay: 0,
      insuranceCover: 'Processed within 24-48 Hours',
      unit: 'Direct Bank / Card Transfer',
      description: 'Automated digital refund mechanism directly credited to original payment source upon claim closing.',
      regionalAvg: 0
    }
  ], []);

  // Filter items based on active section, subcategory and search query
  const filteredItems = useMemo(() => {
    return pricingItems.filter((item) => {
      // Search matching
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subcategory.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Section filtering
      if (activeSection === 'catalog') return true;
      if (activeSection === 'consultation') return item.category === 'Doctor Consultations';
      if (activeSection === 'laboratory') return item.category === 'Laboratory';
      if (activeSection === 'imaging') return item.category === 'Imaging';
      if (activeSection === 'rooms') return item.category === 'Room & Bed Charges';
      if (activeSection === 'critical') return item.category === 'Critical Care';
      if (activeSection === 'surgery') return item.category === 'Procedures & Surgery';
      if (activeSection === 'emergency') return item.category === 'Emergency & Ancillary';
      if (activeSection === 'packages') return item.category === 'Hospital Packages';
      if (activeSection === 'insurance') return item.category === 'Insurance & Schemes';
      if (activeSection === 'admin') return item.category === 'Administrative & Billing';

      return true;
    }).filter((item) => {
      if (selectedSubcategory === 'All') return true;
      return item.subcategory === selectedSubcategory;
    });
  }, [pricingItems, activeSection, selectedSubcategory, searchQuery]);

  // Subcategories available for active section
  const availableSubcategories = useMemo(() => {
    if (activeSection === 'catalog') return ['All'];
    const itemsInSection = pricingItems.filter((item) => {
      if (activeSection === 'consultation') return item.category === 'Doctor Consultations';
      if (activeSection === 'laboratory') return item.category === 'Laboratory';
      if (activeSection === 'imaging') return item.category === 'Imaging';
      if (activeSection === 'rooms') return item.category === 'Room & Bed Charges';
      if (activeSection === 'critical') return item.category === 'Critical Care';
      if (activeSection === 'surgery') return item.category === 'Procedures & Surgery';
      if (activeSection === 'emergency') return item.category === 'Emergency & Ancillary';
      if (activeSection === 'packages') return item.category === 'Hospital Packages';
      if (activeSection === 'insurance') return item.category === 'Insurance & Schemes';
      if (activeSection === 'admin') return item.category === 'Administrative & Billing';
      return false;
    });
    const set = new Set<string>();
    itemsInSection.forEach((i) => set.add(i.subcategory));
    return ['All', ...Array.from(set)];
  }, [pricingItems, activeSection]);

  // Cost Estimator Calculations
  const estimatorTotals = useMemo(() => {
    const rawTotal = selectedEstimatorItems.reduce(
      (sum, { item, count }) => sum + item.selfPay * count,
      0
    );
    const regionalTotal = selectedEstimatorItems.reduce(
      (sum, { item, count }) => sum + item.regionalAvg * count,
      0
    );
    
    let estimatedInsuranceCover = 0;
    let estimatedPatientOutPocket = rawTotal;

    if (hasInsurance) {
      if (insuranceTier === 'tier1') {
        // Tier 1 covers ~90% of eligible costs
        estimatedInsuranceCover = rawTotal * 0.9;
        estimatedPatientOutPocket = rawTotal * 0.1;
      } else if (insuranceTier === 'tier2') {
        // Tier 2 covers ~80%
        estimatedInsuranceCover = rawTotal * 0.8;
        estimatedPatientOutPocket = rawTotal * 0.2;
      } else {
        // Standard 20% Co-pay
        estimatedInsuranceCover = rawTotal * 0.8;
        estimatedPatientOutPocket = rawTotal * 0.2;
      }
    }

    const estimatedSavings = regionalTotal > rawTotal ? regionalTotal - rawTotal : 0;

    return {
      rawTotal,
      regionalTotal,
      estimatedInsuranceCover,
      estimatedPatientOutPocket,
      estimatedSavings
    };
  }, [selectedEstimatorItems, hasInsurance, insuranceTier]);

  const handleAddItemToEstimator = (item: PricingItem) => {
    setSelectedEstimatorItems((prev) => {
      const existing = prev.find((p) => p.item.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.item.id === item.id ? { ...p, count: p.count + 1 } : p
        );
      }
      return [...prev, { item, count: 1 }];
    });
  };

  const handleRemoveEstimatorItem = (id: string) => {
    setSelectedEstimatorItems((prev) => prev.filter((p) => p.item.id !== id));
  };

  const handleUpdateEstimatorCount = (id: string, count: number) => {
    if (count <= 0) {
      handleRemoveEstimatorItem(id);
      return;
    }
    setSelectedEstimatorItems((prev) =>
      prev.map((p) => (p.item.id === id ? { ...p, count } : p))
    );
  };

  const handleCopyEstimate = () => {
    const textSummary = `=== GLOBALHEALTH ESTIMATED MEDICAL QUOTATION ===\nHospital: ${hospital.name}\nGlobalHealth ID: ${hospital.globalHealthId || 'GH-HOSP-VERIFIED'}\n----------------------------------------\n${selectedEstimatorItems.map(i => `${i.item.name} (x${i.count}) : ${currencySymbol}${(i.item.selfPay * i.count).toLocaleString()}`).join('\n')}\n----------------------------------------\nTotal Hospital Tariff: ${currencySymbol}${estimatorTotals.rawTotal.toLocaleString()}\nEstimated Patient Out-of-Pocket: ${currencySymbol}${Math.round(estimatorTotals.estimatedPatientOutPocket).toLocaleString()}\nEstimated Insurance Coverage: ${currencySymbol}${Math.round(estimatorTotals.estimatedInsuranceCover).toLocaleString()}\nGenerated: ${new Date().toLocaleDateString()}\nStatus: Verified Tariff Schedule`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textSummary);
      setQuoteCopied(true);
      setTimeout(() => setQuoteCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP PRICING & FINANCE HEADER WITH HIGH-LEVEL METRICS */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500 text-slate-950 font-black text-xl shadow-inner shrink-0">
              <DollarSign className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  GlobalHealth Financial Telemetry
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-bold">
                  <ShieldCheck className="h-3 w-3" />
                  100% REGULATORY VERIFIED
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Comprehensive Tariff & Financial Schedule
              </h3>
              <p className="text-xs text-slate-300">
                Transparent standardized medical fees, diagnostic pricing, cashless insurance, and real-time out-of-pocket estimator for {hospital.name}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveSection('estimator')}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2 text-xs font-extrabold transition shadow-xs"
            >
              <Calculator className="h-4 w-4 text-slate-950" />
              <span>Open Cost Estimator</span>
              {selectedEstimatorItems.length > 0 && (
                <span className="rounded-full bg-slate-900 text-white px-2 py-0.5 text-[10px] font-bold">
                  {selectedEstimatorItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 4 Financial Highlight Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/80">
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Cashless Insurance</span>
            <span className="text-base font-extrabold text-emerald-400">38+ Global TPAs</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Zero Out-Of-Pocket Pre-auth</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/80">
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Regional Tariff Index</span>
            <span className="text-base font-extrabold text-blue-400">18.4% Below Median</span>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">Cost-Effective Apex</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/80">
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Tariff Approval Authority</span>
            <span className="text-base font-extrabold text-slate-200 truncate block">Ministry of Health</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Audited Quarterly</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/80">
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Price Transparency Rating</span>
            <span className="text-base font-extrabold text-amber-300">Grade A+ (100%)</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Zero Hidden Surcharges</span>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION BAR FOR 15 DETAILED FINANCIAL MODULES */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
        {[
          { id: 'catalog', label: 'All Catalog', icon: Layers },
          { id: 'consultation', label: 'Doctor Consultations', icon: Stethoscope },
          { id: 'laboratory', label: 'Laboratory Tests', icon: Microscope },
          { id: 'imaging', label: 'Radiology & Imaging', icon: HeartPulse },
          { id: 'rooms', label: 'Room & Bed Charges', icon: Building2 },
          { id: 'critical', label: 'Critical Care (ICU)', icon: Activity },
          { id: 'surgery', label: 'Procedures & Surgery', icon: ShieldAlert },
          { id: 'emergency', label: 'Emergency & Ancillary', icon: Droplet },
          { id: 'packages', label: 'Hospital Packages', icon: Award },
          { id: 'insurance', label: 'Insurance & Cashless', icon: CreditCard },
          { id: 'admin', label: 'Admin & Billing', icon: FileSpreadsheet },
          { id: 'estimator', label: 'Cost Estimator', icon: Calculator, badge: selectedEstimatorItems.length },
          { id: 'comparison', label: 'Price Benchmark', icon: TrendingUp },
          { id: 'history', label: 'Price History', icon: History },
          { id: 'verification', label: 'Price Verification', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSection(tab.id as PricingSection);
                setSelectedSubcategory('All');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${isActive ? 'bg-white text-blue-600' : 'bg-emerald-100 text-emerald-700'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. CONDITIONAL VIEWS: ESTIMATOR, COMPARISON, HISTORY, VERIFICATION, OR CATALOG TABLE */}

      {/* VIEW A: INTERACTIVE COST ESTIMATOR */}
      {activeSection === 'estimator' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-emerald-600" />
                  <span>Real-Time Patient Medical Cost Calculator</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Select treatments, room stay duration, and diagnostic tests to calculate your out-of-pocket and insurance coverage estimate.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedEstimatorItems([])}
                  disabled={selectedEstimatorItems.length === 0}
                  className="flex items-center gap-1 text-slate-500 hover:text-rose-600 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-rose-200 transition disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={handleCopyEstimate}
                  disabled={selectedEstimatorItems.length === 0}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 text-xs font-bold transition disabled:opacity-50"
                >
                  {quoteCopied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Download className="h-3.5 w-3.5" />}
                  <span>{quoteCopied ? 'Quotation Copied!' : 'Export Quotation'}</span>
                </button>
              </div>
            </div>

            {/* Insurance Parameter Toggles */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Payment Method</span>
                <div className="flex rounded-xl bg-white p-1 border border-slate-200">
                  <button
                    onClick={() => setHasInsurance(true)}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition ${hasInsurance ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'}`}
                  >
                    Insurance / Cashless
                  </button>
                  <button
                    onClick={() => setHasInsurance(false)}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition ${!hasInsurance ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'}`}
                  >
                    Self-Pay / Cash
                  </button>
                </div>
              </div>

              {hasInsurance && (
                <div className="space-y-1.5 sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Insurance Tier / Policy Type</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setInsuranceTier('tier1')}
                      className={`p-1.5 rounded-xl border text-center text-xs font-bold transition ${insuranceTier === 'tier1' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700'}`}
                    >
                      <span>Tier-1 Comprehensive</span>
                      <span className="block text-[9px] font-normal text-slate-500">10% Copay</span>
                    </button>
                    <button
                      onClick={() => setInsuranceTier('tier2')}
                      className={`p-1.5 rounded-xl border text-center text-xs font-bold transition ${insuranceTier === 'tier2' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700'}`}
                    >
                      <span>Tier-2 Standard</span>
                      <span className="block text-[9px] font-normal text-slate-500">20% Copay</span>
                    </button>
                    <button
                      onClick={() => setInsuranceTier('copay20')}
                      className={`p-1.5 rounded-xl border text-center text-xs font-bold transition ${insuranceTier === 'copay20' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700'}`}
                    >
                      <span>Fixed Deductible</span>
                      <span className="block text-[9px] font-normal text-slate-500">Cap Applied</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Items Breakdown Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Selected Procedures, Rooms & Services:</span>
              {selectedEstimatorItems.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 space-y-2">
                  <Calculator className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700 text-xs">No items in your estimation plan yet.</p>
                  <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                    Click the <strong>"+ Add to Estimator"</strong> button next to any consultation, diagnostic test, or hospital package in the catalog below.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Service Item</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5 text-center">Qty / Days</th>
                        <th className="p-2.5">Tariff Rate</th>
                        <th className="p-2.5">Total Amount</th>
                        <th className="p-2.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {selectedEstimatorItems.map(({ item, count }) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-2.5">
                            <span className="font-bold text-slate-900 block">{item.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">{item.code} • {item.unit}</span>
                          </td>
                          <td className="p-2.5">
                            <span className="rounded bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-semibold">
                              {item.subcategory}
                            </span>
                          </td>
                          <td className="p-2.5 text-center">
                            <div className="inline-flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                              <button
                                onClick={() => handleUpdateEstimatorCount(item.id, count - 1)}
                                className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                              >
                                -
                              </button>
                              <span className="px-2 font-bold text-slate-900">{count}</span>
                              <button
                                onClick={() => handleUpdateEstimatorCount(item.id, count + 1)}
                                className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-2.5 font-bold text-slate-700">{currencySymbol}{item.selfPay.toLocaleString()}</td>
                          <td className="p-2.5 font-extrabold text-blue-600">{currencySymbol}{(item.selfPay * count).toLocaleString()}</td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => handleRemoveEstimatorItem(item.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Estimator Summary Totals Card */}
            {selectedEstimatorItems.length > 0 && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 text-white space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Estimated Financial Settlement Summary
                    </span>
                    <h5 className="text-base font-extrabold text-white">Quotation Breakdown</h5>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-0.5 text-xs font-bold">
                    Official Tariff Basis
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Total Hospital Gross Tariff</span>
                    <span className="text-xl font-black text-white">{currencySymbol}{estimatorTotals.rawTotal.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Pre-insurance full value</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] uppercase text-emerald-400 font-bold block">Estimated Insurance Coverage</span>
                    <span className="text-xl font-black text-emerald-400">
                      {hasInsurance ? `${currencySymbol}${Math.round(estimatorTotals.estimatedInsuranceCover).toLocaleString()}` : '$0 (Self-Pay)'}
                    </span>
                    <span className="text-[10px] text-emerald-300 block mt-0.5">Direct Cashless Claim</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/80">
                    <span className="text-[10px] uppercase text-emerald-300 font-bold block">Estimated Patient Out-of-Pocket</span>
                    <span className="text-2xl font-black text-white">{currencySymbol}{Math.round(estimatorTotals.estimatedPatientOutPocket).toLocaleString()}</span>
                    <span className="text-[10px] text-emerald-200 block mt-0.5">Your final payable copay</span>
                  </div>
                </div>

                {estimatorTotals.estimatedSavings > 0 && (
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-blue-900/40 border border-blue-800 text-blue-200">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                      <span>Hospital Tariff Savings vs Regional Hospital Average:</span>
                    </span>
                    <span className="font-extrabold text-emerald-400">
                      Save ~{currencySymbol}{Math.round(estimatorTotals.estimatedSavings).toLocaleString()} ({((estimatorTotals.estimatedSavings / estimatorTotals.regionalTotal) * 100).toFixed(0)}%)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW B: PRICE COMPARISON & BENCHMARK */}
      {activeSection === 'comparison' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span>Regional & National Medical Price Benchmark Analysis</span>
              </h4>
              <p className="text-xs text-slate-500">
                Audited comparison of {hospital.name} procedure rates against metropolitan hospital medians and private sector benchmarks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { procedure: 'Comprehensive Metabolic Panel (CMP)', hospitalPrice: 35, regionalPrice: 45, unit: 'STAT Test' },
                { procedure: '3.0 Tesla Brain MRI with Contrast', hospitalPrice: 580, regionalPrice: 750, unit: 'Scan' },
                { procedure: '256-Slice CT Abdomen & Pelvis', hospitalPrice: 420, regionalPrice: 550, unit: 'Scan' },
                { procedure: 'Level III ICU Critical Care Day Rate', hospitalPrice: 1400, regionalPrice: 1750, unit: 'Per 24h' },
                { procedure: 'PCI Coronary Angioplasty (Single Stent)', hospitalPrice: 4800, regionalPrice: 5800, unit: 'Procedure' },
                { procedure: 'Laparoscopic Cholecystectomy Package', hospitalPrice: 2600, regionalPrice: 3200, unit: '2 Days All-Inclusive' }
              ].map((row, idx) => {
                const diffPercent = (((row.regionalPrice - row.hospitalPrice) / row.regionalPrice) * 100).toFixed(1);
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-bold text-slate-900 text-xs">{row.procedure}</h5>
                        <span className="text-[10px] text-slate-400">{row.unit}</span>
                      </div>
                      <span className="rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-extrabold">
                        {diffPercent}% Cheaper
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">{hospital.name}</span>
                        <span className="text-sm font-black text-blue-600">{currencySymbol}{row.hospitalPrice}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Regional Average</span>
                        <span className="text-sm font-black text-slate-700">{currencySymbol}{row.regionalPrice}</span>
                      </div>
                    </div>

                    {/* Visual Comparison Bar */}
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                        <div style={{ width: `${(row.hospitalPrice / row.regionalPrice) * 100}%` }} className="bg-blue-600 h-full rounded-full"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW C: PRICE HISTORY & REVISION AUDIT */}
      {activeSection === 'history' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <History className="h-4 w-4 text-indigo-600" />
                <span>Audited Historical Price Index & Tariff Revisions</span>
              </h4>
              <p className="text-xs text-slate-500">
                Official regulatory revision ledger demonstrating annual tariff adjustments against medical inflation index.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { year: '2026 (Current Q3)', note: 'Annual Ministry Tariff Calibration: Standardized package rates adjusted -1.2% for high-volume automated diagnostics (Robotic Pharmacy & NGS).', inflation: '+1.8% Medical CPI', status: 'Active Verified' },
                { year: '2025 (Q3 Annual)', note: 'Introduction of Robotic Joint Replacement and Single-Port Laparoscopy fixed cashless insurance bundled packages.', inflation: '+2.4% Medical CPI', status: 'Archived Audit' },
                { year: '2024 (Q3 Annual)', note: 'Universal tariff revision capping emergency ICU bed rates and standardizing outpatient teleconsultation fee structure.', inflation: '+3.1% Medical CPI', status: 'Archived Audit' },
                { year: '2023 (Q3 Annual)', note: 'Comprehensive establishment baseline pricing registered with National Health Authority.', inflation: 'Baseline Register', status: 'Archived Audit' }
              ].map((hist, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{hist.year}</span>
                      <span className="rounded bg-blue-100 text-blue-800 px-2 py-0.2 text-[10px] font-bold">
                        {hist.inflation}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 max-w-xl">{hist.note}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-[10px] font-bold self-start sm:self-center shrink-0">
                    {hist.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW D: PRICE VERIFICATION CERTIFICATE */}
      {activeSection === 'verification' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-950 text-white shadow-md space-y-4 border border-emerald-900">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500 text-slate-950 font-black text-2xl shrink-0">
                <ShieldCheck className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Official Price Integrity & Accreditation Record
                </span>
                <h4 className="text-xl font-black text-white">
                  Certified Hospital Price Schedule Compliance
                </h4>
              </div>
            </div>

            <p className="text-xs text-emerald-100 leading-relaxed max-w-2xl">
              All prices, fee schedules, consultation charges, and surgical package costs presented in this portal are cryptographically validated against the official Health Authority tariff register and binding cashless insurer schedules for <strong>{hospital.name}</strong>.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-emerald-800/80">
              <div>
                <span className="text-[10px] uppercase text-emerald-300 font-bold block">Tariff Reference ID</span>
                <span className="text-xs font-mono font-bold text-white">GH-TARIFF-2026-V8</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-emerald-300 font-bold block">Audit Verification Date</span>
                <span className="text-xs font-bold text-white">14 August 2026</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-emerald-300 font-bold block">Hidden Fees Audit</span>
                <span className="text-xs font-bold text-emerald-400">0% Hidden Charges</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-emerald-300 font-bold block">Price Guarantee</span>
                <span className="text-xs font-bold text-emerald-400">100% Binding Tariff</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW E: CATALOG BROWSER & PRICE LIST TABLE (For Catalog and specific categories) */}
      {(activeSection === 'catalog' ||
        activeSection === 'consultation' ||
        activeSection === 'laboratory' ||
        activeSection === 'imaging' ||
        activeSection === 'rooms' ||
        activeSection === 'critical' ||
        activeSection === 'surgery' ||
        activeSection === 'emergency' ||
        activeSection === 'packages' ||
        activeSection === 'insurance' ||
        activeSection === 'admin') && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Subcategory Pills & Search Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {availableSubcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    selectedSubcategory === sub
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            <div className="relative shrink-0 w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search procedure, test, code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Results Count & Quick Status */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing <strong>{filteredItems.length}</strong> standardized tariff items</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Real-time In-Network Schedule
            </span>
          </div>

          {/* Interactive Pricing Items Table */}
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Service / Procedure Description</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Billing Unit</th>
                    <th className="p-3">Standard Self-Pay</th>
                    <th className="p-3">Insurance In-Network</th>
                    <th className="p-3 text-center">Cost Estimator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No pricing records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((row) => {
                      const isAdded = selectedEstimatorItems.some((i) => i.item.id === row.id);
                      return (
                        <tr key={row.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3 max-w-xs sm:max-w-md">
                            <span className="font-bold text-slate-900 block leading-tight">{row.name}</span>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                              <span className="font-mono font-bold text-blue-600">{row.code}</span>
                              {row.description && (
                                <>
                                  <span>•</span>
                                  <span className="truncate">{row.description}</span>
                                </>
                              )}
                            </div>
                          </td>

                          <td className="p-3">
                            <span className="rounded-md bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-bold">
                              {row.subcategory}
                            </span>
                          </td>

                          <td className="p-3 text-slate-500 whitespace-nowrap">{row.unit}</td>

                          <td className="p-3 whitespace-nowrap">
                            {row.selfPay === 0 ? (
                              <span className="font-bold text-emerald-600">Free / $0</span>
                            ) : (
                              <span className="font-extrabold text-blue-600 text-sm">
                                {currencySymbol}{row.selfPay.toLocaleString()}
                              </span>
                            )}
                          </td>

                          <td className="p-3 text-emerald-600 font-semibold whitespace-nowrap">
                            {row.insuranceCover}
                          </td>

                          <td className="p-3 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleAddItemToEstimator(row)}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs ${
                                isAdded
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700'
                              }`}
                            >
                              <Plus className="h-3 w-3" />
                              <span>{isAdded ? 'Add More' : 'Add to Estimator'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. ACCEPTED INSURERS & TPAS SUMMARY BAR */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-blue-600" />
            <span>Recognized Global Health Insurance & Third-Party Administrators (TPAs)</span>
          </h5>
          <span className="text-[11px] font-bold text-emerald-600">Zero-Wait Cashless Approvals</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            'Bupa Global',
            'Cigna Healthcare',
            'Allianz Partners',
            'Aetna International',
            'MetLife Worldwide',
            'AXA Global Care',
            'UnitedHealthcare Global',
            'Blue Cross Blue Shield International',
            'Government Universal Health Insurance (National Health)'
          ].map((ins, i) => (
            <span key={i} className="rounded-lg bg-blue-50 border border-blue-100 text-blue-800 px-3 py-1 text-xs font-semibold">
              {ins}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};
