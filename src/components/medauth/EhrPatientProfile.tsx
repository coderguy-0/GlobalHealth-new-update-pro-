import React, { useState } from 'react';
import {
  User,
  AlertTriangle,
  Activity,
  FileText,
  Clock,
  Plus,
  Heart,
  Calendar,
  CheckCircle2,
  Stethoscope,
  Building,
  ChevronRight,
  Sparkles,
  Search,
  Edit3,
  Pill,
  FlaskConical,
  ShieldAlert,
  ShieldCheck,
  Phone,
  Droplets,
  Thermometer,
  Weight,
  Ruler,
  TrendingUp,
  FileCheck,
  Eye,
  Download,
  Share2,
  Syringe,
  Layers,
  FileBadge,
  UserCheck,
  ExternalLink,
  X,
  Save,
  MessageSquare
} from 'lucide-react';
import {
  PatientRecord,
  ClinicalTimelineEvent,
  VitalsDataPoint,
  LabReportItem
} from '../../types/medauth';

export type EhrSubTab =
  | 'overview'
  | 'medical-history'
  | 'symptoms'
  | 'diagnoses'
  | 'medications'
  | 'allergies'
  | 'vitals'
  | 'labs'
  | 'imaging'
  | 'prescriptions'
  | 'procedures'
  | 'immunization'
  | 'hospitalization'
  | 'consultations'
  | 'documents'
  | 'doctor-notes'
  | 'timeline';

interface EhrPatientProfileProps {
  patient: PatientRecord;
  allPatients?: PatientRecord[];
  onSelectPatient?: (patient: PatientRecord) => void;
  onStartConsult?: (patient: PatientRecord) => void;
  onIssuePrescription?: (patient: PatientRecord) => void;
  onViewVitalsChart?: () => void;
  onViewLabReports?: () => void;
  onAddTimelineNote?: (note: ClinicalTimelineEvent) => void;
  onUpdatePatient?: (updated: PatientRecord) => void;
}

export const EhrPatientProfile: React.FC<EhrPatientProfileProps> = ({
  patient,
  allPatients = [],
  onSelectPatient,
  onStartConsult,
  onIssuePrescription,
  onViewVitalsChart,
  onViewLabReports,
  onAddTimelineNote,
  onUpdatePatient
}) => {
  // Navigation & Search State
  const [activeSubTab, setActiveSubTab] = useState<EhrSubTab>('overview');
  const [patientSearch, setPatientSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All Genders' | 'Male' | 'Female' | 'Other'>('All Genders');
  
  // Edit Patient Details Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<PatientRecord>>({});

  // Add SOAP Note Modal State
  const [showAddSoap, setShowAddSoap] = useState(false);
  const [soapTitle, setSoapTitle] = useState('');
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');

  // Add Doctor Note State
  const [newDoctorNote, setNewDoctorNote] = useState('');
  const [noteCategory, setNoteCategory] = useState('Clinical Impression');

  // Filter patients list for the top dropdown / quick pills
  const filteredPatients = allPatients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.mrn.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.age.toString().includes(patientSearch);
    const matchesGender = genderFilter === 'All Genders' || p.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  const handleOpenEditModal = () => {
    setEditFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      mrn: patient.mrn,
      bloodGroup: patient.bloodGroup,
      dob: patient.dob || '1992-05-14',
      phone: patient.phone || '+1 (555) 234-5678',
      primaryCondition: patient.primaryCondition || patient.chronicConditions[0] || 'Essential Hypertension',
      emergencyContact: patient.emergencyContact || { name: 'Priya Kumar', relation: 'Spouse', phone: '+1 (555) 890-1234' }
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEditModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdatePatient) {
      onUpdatePatient({
        ...patient,
        ...editFormData,
        emergencyContact: editFormData.emergencyContact || patient.emergencyContact
      } as PatientRecord);
    }
    setIsEditModalOpen(false);
  };

  const handleSaveSoap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!soapTitle.trim()) return;

    const newEvent: ClinicalTimelineEvent = {
      id: `evt-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Consultation',
      title: soapTitle,
      clinician: 'Attending Physician',
      facility: 'Primary Clinical Outpatient Station',
      soapNotes: {
        subjective: subjective || 'Patient reports stable baseline status.',
        objective: objective || `Vitals: ${patient.recentVitals.bp}, HR ${patient.recentVitals.hr} bpm`,
        assessment: assessment || patient.chronicConditions[0] || 'Routine Follow-up',
        plan: plan || 'Continue current therapeutic regimen.'
      }
    };

    if (onAddTimelineNote) {
      onAddTimelineNote(newEvent);
    }

    setSoapTitle('');
    setSubjective('');
    setObjective('');
    setAssessment('');
    setPlan('');
    setShowAddSoap(false);
  };

  const handleAddDoctorNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctorNote.trim()) return;

    const noteItem = {
      id: `note-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: 'Attending Physician',
      authorRole: 'Doctor of Record',
      note: newDoctorNote,
      category: noteCategory
    };

    if (onUpdatePatient) {
      const existing = patient.doctorNotesList || [];
      onUpdatePatient({
        ...patient,
        doctorNotesList: [noteItem, ...existing]
      });
    }

    setNewDoctorNote('');
  };

  // Safe Fallback Data
  const initials = patient.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const timeline = patient.clinicalTimeline || [];
  const medicalHistory = patient.medicalHistory || [
    { category: 'Cardiovascular', description: patient.chronicConditions[0] || 'Essential Hypertension', diagnosedDate: '2024-03-12', status: 'Active' },
    { category: 'Surgical History', description: 'Elective Laparoscopic Appendectomy', diagnosedDate: '2019-06-18', status: 'Resolved' },
    { category: 'Family History', description: 'Father had myocardial infarction at age 58. Mother has Type 2 Diabetes.', status: 'Active' }
  ];
  const symptomsList = patient.symptoms || [
    { symptom: 'Occasional Exertional Palpitations', severity: 'Mild' as const, duration: '2 weeks', onset: 'After caffeine or high-stress work' },
    { symptom: 'Tension Headaches', severity: 'Mild' as const, duration: 'Intermittent', onset: 'Late afternoon' }
  ];
  const diagnosesList = patient.diagnoses || patient.chronicConditions.map((c, i) => ({
    icd10: i === 0 ? 'I10' : i === 1 ? 'R00.0' : 'E88.81',
    description: c,
    type: (i === 0 ? 'Primary' : 'Secondary') as 'Primary' | 'Secondary',
    diagnosedDate: '2024-03-12',
    status: 'Active' as const
  }));
  const prescriptions = patient.prescriptionsList || patient.currentMedications.map((m, i) => ({
    id: `rx-auto-${i}`,
    name: m.split(' ')[0],
    dosage: m.split(' ')[1] || 'Standard',
    frequency: 'Once Daily',
    route: 'Oral',
    prescribedDate: patient.lastVisited || '2026-08-07',
    prescribedBy: 'Attending Physician',
    status: 'Active' as const,
    refillsRemaining: 3
  }));
  const proceduresList = patient.procedures || [
    { id: 'proc-1', procedureName: '24-Hour Holter Ambulatory ECG Monitoring', date: '2026-07-28', facility: 'Outpatient Cardiac Lab', surgeon: 'Cardiology Diagnostic Tech', status: 'Completed' as const, notes: 'Sinus rhythm throughout with rare PACs.' }
  ];
  const immunizationsList = patient.immunizations || [
    { vaccineName: 'COVID-19 Bivalent Booster (mRNA)', dateAdministered: '2025-10-14', doseNumber: 'Booster 2', lotNumber: 'FL-9921-A', facility: 'Hospital Employee Clinic', status: 'Up to Date' as const },
    { vaccineName: 'Influenza Quadrivalent', dateAdministered: '2025-09-22', doseNumber: 'Annual', lotNumber: 'IN-4819-B', facility: 'Community Pharmacy', status: 'Up to Date' as const },
    { vaccineName: 'Tdap (Tetanus, Diphtheria, Pertussis)', dateAdministered: '2022-04-11', doseNumber: 'Dose 1', lotNumber: 'TD-3810-C', facility: 'Primary Care Center', status: 'Up to Date' as const }
  ];
  const hospitalizationsList = patient.hospitalizations || [
    { id: 'hosp-1', admissionDate: '2019-06-18', dischargeDate: '2019-06-19', reason: 'Acute Appendicitis', facility: 'Metro General Hospital', attendingPhysician: 'Dr. J. Miller, MD', dischargeSummary: 'Patient underwent uncomplicated laparoscopic appendectomy. Discharged in stable condition.' }
  ];
  const imagingList = patient.imagingReports || [
    { id: 'img-1', modality: 'Transthoracic Echocardiogram (TTE)', bodyPart: 'Heart / Thorax', date: '2026-06-12', findings: 'Normal left ventricular size and systolic function (LVEF 60-65%). No regional wall motion abnormalities.', impression: 'Normal resting 2D echocardiogram.', radiologist: 'Dr. H. Vance, MD', status: 'Final' as const }
  ];
  const documentsList = patient.documents || [
    { id: 'doc-1', title: 'Holter 24-Hour Final Diagnostic Report.pdf', category: 'Diagnostics', uploadedDate: '2026-07-29', fileSize: '1.4 MB', fileType: 'PDF' },
    { id: 'doc-2', title: 'Comprehensive Metabolic & Lipid Panel.pdf', category: 'Laboratory', uploadedDate: '2026-08-07', fileSize: '850 KB', fileType: 'PDF' }
  ];
  const doctorNotes = patient.doctorNotesList || [
    { id: 'note-1', date: patient.lastVisited || '2026-08-07', author: 'Attending Physician', authorRole: 'Cardiology Specialist', category: 'Clinical Impression', note: 'Patient reports feeling well with improved exercise tolerance. BP responding appropriately to current pharmacotherapy.' }
  ];

  // Critical alerts list
  const criticalAlerts = patient.criticalAlerts || [
    ...patient.allergies.map((a) => `SEVERE ${a.toUpperCase()} ALLERGY`),
    'HYPERTENSION MONITORING REQUIRED'
  ];

  // Sub-tabs list
  const subTabs: { id: EhrSubTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'medical-history', label: 'Medical History' },
    { id: 'symptoms', label: 'Symptoms' },
    { id: 'diagnoses', label: 'Diagnoses' },
    { id: 'medications', label: 'Medications' },
    { id: 'allergies', label: 'Allergies' },
    { id: 'vitals', label: 'Vitals' },
    { id: 'labs', label: 'Lab Reports' },
    { id: 'imaging', label: 'Imaging' },
    { id: 'prescriptions', label: 'Prescriptions' },
    { id: 'procedures', label: 'Procedures' },
    { id: 'immunization', label: 'Immunization' },
    { id: 'hospitalization', label: 'Hospitalization' },
    { id: 'consultations', label: 'Previous Consultations' },
    { id: 'documents', label: 'Documents' },
    { id: 'doctor-notes', label: 'Doctor Notes' },
    { id: 'timeline', label: 'Timeline' }
  ];

  return (
    <div className="space-y-4 font-sans text-slate-800">
      
      {/* ========================================================================= */}
      {/* 1. TOP PANEL: Active EHR Patient Switcher & Profile Selector             */}
      {/* ========================================================================= */}
      <div className="bg-slate-50 text-slate-900 rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
        
        {/* Header Title & Edit Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Active EHR Patient Switcher & Profile Selector
              </h3>
              <p className="text-[11px] text-slate-500">
                Select existing records or manually set Name, Age/Year, and Gender below
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenEditModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-emerald-800 border border-slate-300 text-xs font-bold transition shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Manually Select / Edit Patient Details</span>
          </button>
        </div>

        {/* Filter / Selector Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Box */}
          <div className="md:col-span-4 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              placeholder="Search Name, MRN or Year/Age..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Gender Filter Dropdown */}
          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              GENDER:
            </span>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as any)}
              className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer font-medium"
            >
              <option value="All Genders">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Patient Select Dropdown */}
          <div className="md:col-span-5 flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              PATIENT:
            </span>
            <select
              value={patient.id}
              onChange={(e) => {
                const selected = allPatients.find((p) => p.id === e.target.value);
                if (selected && onSelectPatient) onSelectPatient(selected);
              }}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-emerald-800 font-bold focus:outline-none focus:border-emerald-600 cursor-pointer truncate"
            >
              {filteredPatients.map((p) => (
                <option key={p.id} value={p.id} className="text-slate-900">
                  {p.name} • {p.age} Yrs ({p.gender}) • {p.mrn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Select Patient Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200 text-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            QUICK SELECT:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {allPatients.slice(0, 6).map((p) => {
              const isActive = p.id === patient.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPatient && onSelectPatient(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white font-bold shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-300'
                  }`}
                >
                  {p.name} ({p.age}y/{p.gender?.charAt(0) || 'U'})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO CARD: Clean Light Patient Demographics Banner                    */}
      {/* ========================================================================= */}
      <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        
        {/* Main Identity Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Avatar & Demographic Meta */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl tracking-tight shadow-xs shrink-0">
              {initials}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {patient.name}
                </h2>
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-lg">
                  {patient.mrn}
                </span>
                <span className="text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-300 px-2.5 py-0.5 rounded-full">
                  {patient.status || 'Follow-up'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                <span>Age/Gender: <strong className="text-slate-900">{patient.age} Yrs • {patient.gender}</strong></span>
                <span>•</span>
                <span>Blood Group: <strong className="text-emerald-700 font-bold">{patient.bloodGroup}</strong></span>
                <span>•</span>
                <span>DOB: <strong className="text-slate-900">{patient.dob || '1992-05-14'}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-800 font-medium">{patient.phone || '+1 (555) 234-5678'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Cluster & Emergency Contact */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            
            {/* Emergency Contact Pill Card */}
            {patient.emergencyContact && (
              <div className="bg-slate-50 border border-slate-200 p-2.5 px-3 rounded-xl text-left text-xs space-y-0.5">
                <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider block">
                  EMERGENCY CONTACT
                </span>
                <div className="font-bold text-slate-900">
                  {patient.emergencyContact.name} ({patient.emergencyContact.relation})
                </div>
                <div className="text-[11px] text-slate-600 font-mono">
                  {patient.emergencyContact.phone}
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onStartConsult && onStartConsult(patient)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Start Consultation</span>
              </button>

              <button
                onClick={() => onIssuePrescription && onIssuePrescription(patient)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                <Pill className="w-4 h-4" />
                <span>Issue Prescription</span>
              </button>
            </div>
          </div>
        </div>

        {/* Critical Clinical Alerts Red Banner */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-rose-800 font-bold uppercase tracking-wider shrink-0 text-[11px]">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>CRITICAL CLINICAL ALERTS:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {criticalAlerts.map((alert, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-md bg-white border border-rose-300 text-rose-800 font-bold text-[10px] tracking-wide shadow-2xs"
              >
                {alert}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SUB-NAVIGATION TABS (17 Clinical Sub-Modules)                         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. ACTIVE SUB-TAB VIEW CONTENT                                           */}
      {/* ========================================================================= */}

      {/* ------------------------------------------------------------------------- */}
      {/* SUB-TAB A: OVERVIEW (Default)                                            */}
      {/* ------------------------------------------------------------------------- */}
      {activeSubTab === 'overview' && (
        <div className="space-y-4">
          
          {/* 3 Overview Metric Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            
            {/* 1. Primary Condition */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                PRIMARY CONDITION
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                {patient.primaryCondition || patient.chronicConditions[0] || 'Hypertension Stage I & Mild Tachycardia'}
              </h4>
              <p className="text-[11px] text-slate-500">
                Last visited on {patient.lastVisited || '2026-08-07'}
              </p>
            </div>

            {/* 2. Documented Allergies */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                DOCUMENTED ALLERGIES ({patient.allergies.length})
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {patient.allergies.map((allergy, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Active Medications */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                ACTIVE MEDICATIONS
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                {patient.currentMedications.length} Regular RX Prescribed
              </h4>
              <p className="text-[11px] text-emerald-700 font-semibold">
                Latest: {patient.currentMedications[0] || 'Lisinopril 10mg Daily'}
              </p>
            </div>
          </div>

          {/* Latest Vitals Readings (2026-08-07) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Latest Vitals Readings ({patient.lastVisited || '2026-08-07'})</span>
              </div>
              <button
                onClick={() => (onViewVitalsChart ? onViewVitalsChart() : setActiveSubTab('vitals'))}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer"
              >
                View Full Vitals Chart
              </button>
            </div>

            {/* 8 Metric Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block">BP (mmHg)</span>
                <span className="text-sm font-black font-mono text-slate-900 block">{patient.recentVitals.bp}</span>
                <span className="text-[10px] text-amber-700 font-bold">Stage 1 HTN</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block">Heart Rate</span>
                <span className="text-sm font-black font-mono text-emerald-700 block">{patient.recentVitals.hr} bpm</span>
                <span className="text-[10px] text-slate-500 font-medium">Resting Normal</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block">SpO2</span>
                <span className="text-sm font-black font-mono text-emerald-700 block">{patient.recentVitals.spo2}%</span>
                <span className="text-[10px] text-emerald-700 font-bold">Optimal Room Air</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block">Temp</span>
                <span className="text-sm font-black font-mono text-slate-900 block">{patient.recentVitals.temp} °F</span>
                <span className="text-[10px] text-slate-500 font-medium">Afebrile</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block">Resp Rate</span>
                <span className="text-sm font-black font-mono text-slate-900 block">{patient.recentVitals.respiratoryRate} /min</span>
                <span className="text-[10px] text-slate-500 font-medium">Eupneic</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block">Weight</span>
                <span className="text-sm font-black font-mono text-slate-900 block">{patient.recentVitals.weightKg} kg</span>
                <span className="text-[10px] text-slate-500 font-medium">{(patient.recentVitals.weightKg * 2.20462).toFixed(1)} lbs</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block">Height</span>
                <span className="text-sm font-black font-mono text-slate-900 block">{patient.recentVitals.heightCm} cm</span>
                <span className="text-[10px] text-slate-500 font-medium">5' 9"</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block">BMI</span>
                <span className="text-sm font-black font-mono text-amber-700 block">{patient.recentVitals.bmi}</span>
                <span className="text-[10px] text-amber-700 font-bold">Overweight (I)</span>
              </div>
            </div>
          </div>

          {/* Recent Encounters & SOAP Quick Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Recent Clinical Encounters & Longitudinal History</span>
              </h3>
              <button
                onClick={() => setShowAddSoap(true)}
                className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Encounter Note</span>
              </button>
            </div>

            <div className="space-y-3">
              {timeline.slice(0, 3).map((evt) => (
                <div key={evt.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                        {evt.type}
                      </span>
                      <span className="font-bold text-slate-900">{evt.title}</span>
                    </div>
                    <span className="text-slate-500 font-mono">{evt.date} • {evt.clinician}</span>
                  </div>
                  {evt.soapNotes && (
                    <p className="text-slate-600">
                      <strong>Assessment & Plan:</strong> {evt.soapNotes.assessment} — {evt.soapNotes.plan}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* SUB-TAB B: MEDICAL HISTORY                                               */}
      {/* ------------------------------------------------------------------------- */}
      {activeSubTab === 'medical-history' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Longitudinal Medical & Family History</h3>
            <p className="text-xs text-slate-500">Comprehensive chronic condition timelines and hereditary risk markers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicalHistory.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded">
                    {item.category}
                  </span>
                  {item.diagnosedDate && (
                    <span className="text-slate-500 font-mono">Diagnosed: {item.diagnosedDate}</span>
                  )}
                </div>
                <p className="text-slate-800 font-medium leading-relaxed">{item.description}</p>
                <span className="inline-block text-[10px] font-bold text-slate-500 uppercase">
                  Status: {item.status || 'Active'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* SUB-TAB C: SYMPTOMS                                                      */}
      {/* ------------------------------------------------------------------------- */}
      {activeSubTab === 'symptoms' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Current Symptoms & Review of Systems (ROS)</h3>
            <p className="text-xs text-slate-500">Documented active patient complaints and onset chronology.</p>
          </div>

          <div className="space-y-3">
            {symptomsList.map((sym, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 text-sm block">{sym.symptom}</span>
                  <p className="text-slate-500">Onset trigger: {sym.onset}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-600 font-mono">Duration: {sym.duration}</span>
                  <span className={`px-2.5 py-1 rounded-lg font-bold ${
                    sym.severity === 'Severe'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : sym.severity === 'Moderate'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {sym.severity} Severity
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* SUB-TAB D: DIAGNOSES (ICD-10 Aligned)                                    */}
      {/* ------------------------------------------------------------------------- */}
      {activeSubTab === 'diagnoses' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Active ICD-10 Clinical Problem List</h3>
            <p className="text-xs text-slate-500">Standardized diagnostic codings linked to clinical encounters.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="pb-3 px-3">ICD-10 Code</th>
                  <th className="pb-3 px-3">Diagnosis Description</th>
                  <th className="pb-3 px-3">Classification</th>
                  <th className="pb-3 px-3">Date Diagnosed</th>
                  <th className="pb-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {diagnosesList.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">{d.icd10}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{d.description}</td>
                    <td className="py-3 px-3 text-slate-600">{d.type}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{d.diagnosedDate}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* SUB-TAB E: MEDICATIONS                                                   */}
      {/* ------------------------------------------------------------------------- */}
      {activeSubTab === 'medications' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Pharmaceutical Regimen</h3>
              <p className="text-xs text-slate-500">Cross-checked with active patient allergies.</p>
            </div>
            <button
              onClick={() => onIssuePrescription && onIssuePrescription(patient)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Prescribe Medication</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="pb-3 px-3">Medication</th>
                  <th className="pb-3 px-3">Dosage & Frequency</th>
                  <th className="pb-3 px-3">Route</th>
                  <th className="pb-3 px-3">Prescribed By</th>
                  <th className="pb-3 px-3">Refills</th>
                  <th className="pb-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prescriptions.map((rx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{rx.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{rx.dosage} • {rx.frequency}</td>
                    <td className="py-3 px-3 text-slate-600">{rx.route}</td>
                    <td className="py-3 px-3 text-slate-600">{rx.prescribedBy}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{rx.refillsRemaining} remaining</td>
                    <td className="py-3 px-3 text-right">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        {rx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* SUB-TAB F: ALLERGIES                                                     */}
      {/* ------------------------------------------------------------------------- */}
      {activeSubTab === 'allergies' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Documented Hypersensitivities & Allergies ({patient.allergies.length})</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              These allergies trigger automatic blocks in the e-Prescription engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {patient.allergies.map((a, i) => (
              <div key={i} className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900 text-sm">⚠️ {a}</span>
                  <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded">
                    CRITICAL
                  </span>
                </div>
                <p className="text-rose-800 text-[11px]">
                  Pharmacovigilance barrier active. Any prescription order containing this active ingredient will be hard-blocked.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* SUB-TAB G: VITALS & TRENDS                                               */}
      {/* ------------------------------------------------------------------------- */}
      {activeSubTab === 'vitals' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Longitudinal Biometric Telemetry</h3>
              <p className="text-xs text-slate-500">Multi-day systolic/diastolic curves and heart rate excursions.</p>
            </div>
            <button
              onClick={() => (onViewVitalsChart ? onViewVitalsChart() : null)}
              className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Open Interactive Charts
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Systolic BP</th>
                  <th className="pb-3 px-3">Diastolic BP</th>
                  <th className="pb-3 px-3">Heart Rate</th>
                  <th className="pb-3 px-3">Fasting Glucose</th>
                  <th className="pb-3 px-3 text-right">SpO2</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patient.vitalsHistory.map((vh, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{vh.date}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{vh.systolic} mmHg</td>
                    <td className="py-3 px-3 text-slate-700">{vh.diastolic} mmHg</td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">{vh.heartRate} bpm</td>
                    <td className="py-3 px-3 text-slate-700">{vh.glucose} mg/dL</td>
                    <td className="py-3 px-3 text-right text-emerald-700 font-bold">{vh.spo2 || 98}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* SUB-TAB H: LAB REPORTS                                                   */}
      {/* ------------------------------------------------------------------------- */}
      {activeSubTab === 'labs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Diagnostic Pathology & Lab Matrix</h3>
              <p className="text-xs text-slate-500">Automated reference interval comparison.</p>
            </div>
            <button
              onClick={() => (onViewLabReports ? onViewLabReports() : null)}
              className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Full Lab Viewer
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="pb-3 px-3">Test Name</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Result</th>
                  <th className="pb-3 px-3">Reference Range</th>
                  <th className="pb-3 px-3">Performed At</th>
                  <th className="pb-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patient.labReports.map((lab) => (
                  <tr key={lab.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{lab.testName}</td>
                    <td className="py-3 px-3 text-slate-600">{lab.category}</td>
                    <td className="py-3 px-3 font-bold font-mono text-slate-900">{lab.resultValue} {lab.unit}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{lab.referenceRange} {lab.unit}</td>
                    <td className="py-3 px-3 text-slate-500">{new Date(lab.performedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        lab.status === 'NORMAL'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : lab.status === 'HIGH'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {lab.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* SUB-TAB I: IMAGING                                                       */}
      {/* ------------------------------------------------------------------------- */}
      {activeSubTab === 'imaging' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Diagnostic Imaging & Radiology Reports</h3>
            <p className="text-xs text-slate-500">DICOM PACS studies, findings, and impressions.</p>
          </div>

          <div className="space-y-4">
            {imagingList.map((img) => (
              <div key={img.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                      {img.modality}
                    </span>
                    <span className="font-bold text-slate-900">{img.bodyPart}</span>
                  </div>
                  <span className="text-slate-500 font-mono">{img.date} • {img.radiologist}</span>
                </div>
                <p className="text-slate-700"><strong>Findings:</strong> {img.findings}</p>
                <p className="text-slate-900 font-semibold"><strong>Impression:</strong> {img.impression}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* SUB-TAB J: PRESCRIPTIONS                                                 */}
      {/* ------------------------------------------------------------------------- */}
      {activeSubTab === 'prescriptions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">e-Prescription Order History</h3>
              <p className="text-xs text-slate-500">Signed electronic pharmacy orders with DEA schedules.</p>
            </div>
            <button
              onClick={() => onIssuePrescription && onIssuePrescription(patient)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Rx</span>
            </button>
          </div>

          <div className="space-y-3">
            {prescriptions.map((p, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900 text-sm">{p.name} {p.dosage}</span>
                  </div>
                  <p className="text-slate-600">Sig: {p.frequency} • {p.route}</p>
                  <p className="text-slate-500 font-mono text-[11px]">Prescribed on {p.prescribedDate} by {p.prescribedBy}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-700 font-bold">{p.refillsRemaining} Refills Left</span>
                  <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-bold text-[10px]">
                    DISPATCHED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* SUB-TAB K: PROCEDURES                                                    */}
      {/* ------------------------------------------------------------------------- */}
      {activeSubTab === 'procedures' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Interventional & Surgical Procedures</h3>
            <p className="text-xs text-slate-500">Operative reports, diagnostic catheterizations, and endoscopy records.</p>
          </div>

          <div className="space-y-3">
            {proceduresList.map((proc) => (
              <div key={proc.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{proc.procedureName}</span>
                  <span className="text-slate-500 font-mono">{proc.date}</span>
                </div>
                <p className="text-slate-600">Facility: {proc.facility} • Operator: {proc.surgeon}</p>
                {proc.notes && <p className="text-slate-800 font-medium">Notes: {proc.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* SUB-TAB L: IMMUNIZATION                                                  */}
      {/* ------------------------------------------------------------------------- */}
      {activeSubTab === 'immunization' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Immunization Registry (CDC Aligned)</h3>
            <p className="text-xs text-slate-500">Vaccination history, lot numbers, and booster schedules.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="pb-3 px-3">Vaccine</th>
                  <th className="pb-3 px-3">Dose</th>
                  <th className="pb-3 px-3">Date Administered</th>
                  <th className="pb-3 px-3">Lot Number</th>
                  <th className="pb-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {immunizationsList.map((v, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <Syringe className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{v.vaccineName}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{v.doseNumber}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{v.dateAdministered}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{v.lotNumber}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* SUB-TAB M: HOSPITALIZATION                                               */}
      {/* ------------------------------------------------------------------------- */}
      {activeSubTab === 'hospitalization' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Inpatient Hospitalization History</h3>
            <p className="text-xs text-slate-500">Admissions, discharge summaries, and length of stay.</p>
          </div>

          <div className="space-y-4">
            {hospitalizationsList.map((h) => (
              <div key={h.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{h.reason}</span>
                  <span className="text-slate-500 font-mono">{h.admissionDate} to {h.dischargeDate}</span>
                </div>
                <p className="text-slate-600">Facility: {h.facility} • Attending: {h.attendingPhysician}</p>
                <p className="text-slate-800 font-medium">Discharge Summary: {h.dischargeSummary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* SUB-TAB N: PREVIOUS CONSULTATIONS                                        */}
      {/* ------------------------------------------------------------------------- */}
      {activeSubTab === 'consultations' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Previous Outpatient Consultations</h3>
              <p className="text-xs text-slate-500">Clinical summaries and encounter records.</p>
            </div>
            <button
              onClick={() => onStartConsult && onStartConsult(patient)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Start New Consultation</span>
            </button>
          </div>

          <div className="space-y-3">
            {timeline.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{c.title}</span>
                  <span className="text-slate-500 font-mono">{c.date} • {c.clinician}</span>
                </div>
                {c.soapNotes && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    <p className="text-slate-700"><strong>Subjective:</strong> {c.soapNotes.subjective}</p>
                    <p className="text-slate-700"><strong>Objective:</strong> {c.soapNotes.objective}</p>
                    <p className="text-slate-900 font-semibold"><strong>Plan:</strong> {c.soapNotes.plan}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* SUB-TAB O: DOCUMENTS                                                     */}
      {/* ------------------------------------------------------------------------- */}
      {activeSubTab === 'documents' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">EHR Attached Documents & PDF Reports</h3>
            <p className="text-xs text-slate-500">Stored medical records and diagnostic files.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documentsList.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{doc.title}</h4>
                    <p className="text-slate-500 text-[11px]">{doc.category} • {doc.fileSize} • {doc.uploadedDate}</p>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Simulating download for ${doc.title}`)}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* SUB-TAB P: DOCTOR NOTES                                                  */}
      {/* ------------------------------------------------------------------------- */}
      {activeSubTab === 'doctor-notes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Attending Physician Private Clinical Notes</h3>
            <p className="text-xs text-slate-500">Internal medical team communications and handover remarks.</p>
          </div>

          {/* New Note Composer */}
          <form onSubmit={handleAddDoctorNote} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Add Clinical Note</span>
              <select
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value)}
                className="px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
              >
                <option value="Clinical Impression">Clinical Impression</option>
                <option value="Handover Memo">Handover Memo</option>
                <option value="Phone Communication">Phone Communication</option>
                <option value="Care Plan Reminder">Care Plan Reminder</option>
              </select>
            </div>
            <textarea
              rows={3}
              value={newDoctorNote}
              onChange={(e) => setNewDoctorNote(e.target.value)}
              placeholder="Type confidential clinician note..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition"
              >
                Save Doctor Note
              </button>
            </div>
          </form>

          {/* Notes List */}
          <div className="space-y-3">
            {doctorNotes.map((dn) => (
              <div key={dn.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                    {dn.category}
                  </span>
                  <span className="text-slate-500 font-mono">{dn.date} • {dn.author} ({dn.authorRole})</span>
                </div>
                <p className="text-slate-800 leading-relaxed pt-1">{dn.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* SUB-TAB Q: TIMELINE (FHIR Longitudinal)                                  */}
      {/* ------------------------------------------------------------------------- */}
      {activeSubTab === 'timeline' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Chronological Longitudinal FHIR Timeline</h3>
              <p className="text-xs text-slate-500">Every encounter, diagnostic event, and clinical note in historical order.</p>
            </div>
            <button
              onClick={() => setShowAddSoap(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>

          <div className="space-y-4">
            {timeline.map((evt) => (
              <div key={evt.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                      {evt.type}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{evt.title}</span>
                  </div>
                  <span className="text-slate-500 font-mono">{evt.date} • {evt.clinician}</span>
                </div>
                {evt.soapNotes && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    <p className="text-slate-600"><strong>Subjective:</strong> {evt.soapNotes.subjective}</p>
                    <p className="text-slate-600"><strong>Objective:</strong> {evt.soapNotes.objective}</p>
                    <p className="text-slate-900 font-semibold"><strong>Assessment:</strong> {evt.soapNotes.assessment}</p>
                    <p className="text-slate-900"><strong>Plan:</strong> {evt.soapNotes.plan}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: EDIT PATIENT DETAILS / MANUALLY SELECT                         */}
      {/* ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-600" />
                <span>Manually Edit Patient Profile & EHR Demographics</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditModal} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Medical Record Number (MRN)</label>
                  <input
                    type="text"
                    required
                    value={editFormData.mrn || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, mrn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Age (Years)</label>
                  <input
                    type="number"
                    required
                    value={editFormData.age || 0}
                    onChange={(e) => setEditFormData({ ...editFormData, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Biological Sex / Gender</label>
                  <select
                    value={editFormData.gender || 'Male'}
                    onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Blood Group & Rh Factor</label>
                  <input
                    type="text"
                    value={editFormData.bloodGroup || 'O+'}
                    onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Date of Birth</label>
                  <input
                    type="date"
                    value={editFormData.dob || '1992-05-14'}
                    onChange={(e) => setEditFormData({ ...editFormData, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Phone Number</label>
                  <input
                    type="text"
                    value={editFormData.phone || '+1 (555) 234-5678'}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Primary Clinical Diagnosis</label>
                  <input
                    type="text"
                    value={editFormData.primaryCondition || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, primaryCondition: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border-t border-slate-200 pt-3 space-y-2">
                <span className="font-bold text-slate-800 block">Emergency Contact</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={editFormData.emergencyContact?.name || ''}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        emergencyContact: {
                          ...editFormData.emergencyContact!,
                          name: e.target.value
                        }
                      })
                    }
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Relationship"
                    value={editFormData.emergencyContact?.relation || ''}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        emergencyContact: {
                          ...editFormData.emergencyContact!,
                          relation: e.target.value
                        }
                      })
                    }
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={editFormData.emergencyContact?.phone || ''}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        emergencyContact: {
                          ...editFormData.emergencyContact!,
                          phone: e.target.value
                        }
                      })
                    }
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: ADD SOAP PROGRESS NOTE                                         */}
      {/* ========================================================================= */}
      {showAddSoap && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>New Clinical SOAP Progress Note</span>
              </h3>
              <button
                onClick={() => setShowAddSoap(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSoap} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Encounter Title / Purpose</label>
                <input
                  type="text"
                  required
                  value={soapTitle}
                  onChange={(e) => setSoapTitle(e.target.value)}
                  placeholder="e.g. Hypertension & Cardiology Follow-up"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">S - Subjective Symptoms</label>
                  <textarea
                    rows={2}
                    value={subjective}
                    onChange={(e) => setSubjective(e.target.value)}
                    placeholder="Patient reports stable status..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">O - Objective Findings</label>
                  <textarea
                    rows={2}
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="Vitals: BP 138/86 mmHg, HR 82 bpm..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">A - Clinical Assessment</label>
                  <textarea
                    rows={2}
                    value={assessment}
                    onChange={(e) => setAssessment(e.target.value)}
                    placeholder="Essential Hypertension Stage 1..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">P - Care Plan & Rx</label>
                  <textarea
                    rows={2}
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    placeholder="Continue Lisinopril 10mg PO Daily..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddSoap(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Save SOAP Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
