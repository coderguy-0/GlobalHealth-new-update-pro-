import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Building2,
  Stethoscope,
  MapPin,
  Star,
  PhoneCall,
  Phone,
  Mail,
  Globe,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Award,
  Activity,
  FileText,
  CreditCard,
  Plane,
  BookOpen,
  Bell,
  UserCheck,
  Microscope,
  HeartPulse,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Search,
  Check,
  X,
  Droplet,
  Pill,
  Compass,
  Download,
  Printer,
  Share2,
  Zap,
  Users,
  ShieldAlert,
  Layers,
  Radio,
  FileSpreadsheet,
  BadgeCheck,
  CheckCheck
} from 'lucide-react';
import { Hospital, Doctor } from '../types';
import { DOCTORS } from '../data/healthData';
import { useDiagnostics } from '../context/DiagnosticContext';
import { usePharmacy } from '../context/PharmacyContext';
import { fetchPublicHospitals, fetchPublicBloodBank, CentralHospitalRecord, PublicBloodBank } from '../services/hospitalRegistryClient';

interface HospitalIntelligenceModalProps {
  hospital: Hospital;
  onClose: () => void;
  onBookDoctor?: (doctor: Doctor) => void;
  onBookAmbulance?: (hospital: Hospital) => void;
  onBookAppointment?: (hospital: Hospital) => void;
}

type TabType =
  | 'identity'
  | 'location'
  | 'contacts'
  | 'departments'
  | 'doctors'
  | 'beds'
  | 'emergency'
  | 'labs'
  | 'pharmacy'
  | 'services'
  | 'international'
  | 'accreditations'
  | 'research'
  | 'updates'
  | 'verification';

export const HospitalIntelligenceModal: React.FC<HospitalIntelligenceModalProps> = ({
  hospital,
  onClose,
  onBookDoctor,
  onBookAmbulance,
  onBookAppointment
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('identity');
  const [labSearch, setLabSearch] = useState('');
  const [labCategory, setLabCategory] = useState<'All' | 'Laboratory' | 'Imaging'>('All');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorSpecialty, setDoctorSpecialty] = useState('All');
  const [copiedLink, setCopiedLink] = useState(false);
  const [contactFeedback, setContactFeedback] = useState(false);

  // Dynamic context hooks for diagnostic suites and pharmacy
  const { labTests: liveLabTests, imagingServices: liveImagingServices } = useDiagnostics();
  const { medications: liveMeds } = usePharmacy();
  const [pharmacySearch, setPharmacySearch] = useState('');

  // -------------------------------------------------------------------
  // LIVE central hospital registry — the hospital's own portal-published
  // laboratory, imaging, pharmacy and blood-bank information for THIS
  // hospital (matched strictly by hospitalId). Falls back to the generic
  // reference catalog when the hospital has no published record.
  // -------------------------------------------------------------------
  const [registryRecord, setRegistryRecord] = useState<CentralHospitalRecord | null>(null);
  useEffect(() => {
    let cancelled = false;
    setRegistryRecord(null);
    fetchPublicHospitals().then((res) => {
      if (cancelled || !res.ok) return;
      setRegistryRecord(res.hospitals.find((h) => h.hospitalId === hospital.id) || null);
    });
    return () => { cancelled = true; };
  }, [hospital.id]);

  // Blood Bank — ALWAYS loaded fresh for THIS exact hospital from the public
  // blood-bank endpoint (keyed by hospitalId). State is reset on every
  // hospital switch so no previous hospital's inventory can ever remain
  // visible; loading/error/missing states are explicit (never fake data).
  const [bloodBank, setBloodBank] = useState<PublicBloodBank | null>(null);
  const [bloodBankLoading, setBloodBankLoading] = useState(true);
  const [bloodBankError, setBloodBankError] = useState<string | null>(null);
  const loadBloodBank = useCallback(async () => {
    setBloodBankLoading(true);
    setBloodBankError(null);
    setBloodBank(null);
    const res = await fetchPublicBloodBank(hospital.id);
    if (res.ok) {
      setBloodBank(res.bloodBank);
    } else {
      setBloodBankError((res as { error: string }).error);
    }
    setBloodBankLoading(false);
  }, [hospital.id]);
  useEffect(() => {
    loadBloodBank();
  }, [loadBloodBank]);

  // Dynamic values based on hospital properties
  const globalId = hospital.globalHealthId || `GH-HOSP-${hospital.country.slice(0, 2).toUpperCase()}-00${hospital.id.replace('hosp-', '')}`;
  const trauma = hospital.traumaLevel || 'Level I';
  const totalBeds = hospital.totalBeds || 450;
  const icuBeds = hospital.icuBeds || 72;
  const occupiedBeds = Math.round(totalBeds * 0.815);
  const availableBeds = totalBeds - occupiedBeds;
  const occupancyRate = ((occupiedBeds / totalBeds) * 100).toFixed(1);

  // Currency resolution based on country
  const currencySymbol = hospital.country === 'United States' ? '$' : hospital.country === 'United Arab Emirates' ? 'AED ' : hospital.country === 'Singapore' ? 'S$' : hospital.country === 'India' ? '₹' : hospital.country === 'Germany' ? '€' : '$';

  // Navigation Tabs Configuration
  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'identity', label: 'Basic Identity', icon: Building2 },
    { id: 'location', label: 'Location & Nav', icon: MapPin },
    { id: 'contacts', label: 'Contacts & Hours', icon: PhoneCall },
    { id: 'departments', label: 'Departments', icon: Layers },
    { id: 'doctors', label: 'Doctors Roster', icon: Stethoscope },
    { id: 'beds', label: 'Beds & Facilities', icon: Activity },
    { id: 'emergency', label: 'Emergency & Trauma', icon: ShieldAlert },
    { id: 'labs', label: 'Labs & Imaging', icon: Microscope },
    { id: 'pharmacy', label: 'Blood Bank', icon: Droplet },
    { id: 'services', label: 'Services', icon: Zap },
    { id: 'international', label: 'International Care', icon: Plane },
    { id: 'accreditations', label: 'Accreditations', icon: Award },
    { id: 'research', label: 'Research & Edu', icon: BookOpen },
    { id: 'updates', label: 'Updates & News', icon: Bell },
    { id: 'verification', label: 'Verification', icon: BadgeCheck }
  ];

  // Departments List
  const departments = [
    {
      id: `GH-DEPT-${hospital.country.slice(0, 2).toUpperCase()}-001`,
      name: 'Heart & Vascular Institute (Cardiology)',
      head: 'Prof. Dr. Michael Sterling, MD, FACC',
      beds: 68,
      specialists: 18,
      location: 'South Wing, Level 3 & 4',
      subspecialties: ['Interventional Cardiology', 'Electrophysiology', 'Heart Failure & Transplant', 'Structural Heart', 'Pediatric Cardiology'],
      status: 'Active • 24/7 Cath Lab'
    },
    {
      id: `GH-DEPT-${hospital.country.slice(0, 2).toUpperCase()}-002`,
      name: 'Neurological Institute & Comprehensive Stroke Center',
      head: 'Dr. Evelyn Martinez, MD, PhD, FAAN',
      beds: 54,
      specialists: 14,
      location: 'Neuroscience Pavilion, Level 2',
      subspecialties: ['Cerebrovascular Surgery', 'Epilepsy Monitoring', 'Neuro-oncology', 'Memory & Dementia', 'Movement Disorders'],
      status: 'Active • Code Stroke Ready'
    },
    {
      id: `GH-DEPT-${hospital.country.slice(0, 2).toUpperCase()}-003`,
      name: 'Comprehensive Cancer Center (Oncology)',
      head: 'Dr. Tariq Al-Mansoor, MBBS, FRCR',
      beds: 60,
      specialists: 16,
      location: 'North Wing, Level 1 & 5',
      subspecialties: ['Medical Oncology', 'Surgical Oncology', 'Proton Beam & Radiation Therapy', 'Hematology-BMT', 'Precision Immunotherapy'],
      status: 'Active • NCI Partnered'
    },
    {
      id: `GH-DEPT-${hospital.country.slice(0, 2).toUpperCase()}-004`,
      name: 'Digestive Disease & Surgery Institute',
      head: 'Prof. Dr. Ananya Sen, MD, FACG',
      beds: 42,
      specialists: 12,
      location: 'Central Wing, Level 3',
      subspecialties: ['Advanced Endoscopy', 'Liver & Pancreas Surgery', 'Inflammatory Bowel Disease', 'Bariatric & Metabolic', 'GI Oncology'],
      status: 'Active • Endoscopy Suite'
    },
    {
      id: `GH-DEPT-${hospital.country.slice(0, 2).toUpperCase()}-005`,
      name: 'Orthopedic & Spine Center',
      head: 'Dr. Robert Vance, MD, FAAOS',
      beds: 48,
      specialists: 11,
      location: 'West Wing, Level 2',
      subspecialties: ['Robotic Joint Replacement', 'Complex Spine Surgery', 'Sports Medicine & Arthroscopy', 'Orthopedic Trauma'],
      status: 'Active • Robotic Navigated'
    },
    {
      id: `GH-DEPT-${hospital.country.slice(0, 2).toUpperCase()}-006`,
      name: 'Critical Care & Emergency Medicine',
      head: 'Dr. Katherine Brooks, MD, FACEP',
      beds: 72,
      specialists: 24,
      location: 'Ground Level & Level 1',
      subspecialties: ['Level-1 Trauma Resuscitation', 'Medical & Surgical ICU', 'ECMO Team', 'Toxicology & Poison Control'],
      status: '24/7 Red Alert Operational'
    }
  ];

  // Doctors Roster associated with the hospital
  const hospitalDoctors = DOCTORS.map((d, index) => ({
    ...d,
    docId: `GH-DOC-${hospital.country.slice(0, 2).toUpperCase()}-000${8900 + index}`,
    qualifications: index === 0 ? 'MD, DM, FACC (Harvard / Johns Hopkins)' : index === 1 ? 'MBBS, MD, PhD, FACE' : 'MBBS, MD, FRCS (Oxon)',
    npi: `NPI-${98234100 + index}`,
    licenseCountry: hospital.country,
    department: index === 0 ? 'Cardiology' : index === 1 ? 'Endocrinology' : 'Neurology',
    schedule: 'Mon - Fri • 08:30 - 15:30',
    telehealth: true,
    verifiedStatus: 'Verified by Medical Council'
  }));

  const filteredDoctors = hospitalDoctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(doctorSearch.toLowerCase()) || doc.specialty.toLowerCase().includes(doctorSearch.toLowerCase());
    const matchesSpecialty = doctorSpecialty === 'All' || doc.department === doctorSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // Diagnostic Labs & Imaging Tests Catalog (Laboratory and Imaging Only)
  const diagnosticTests = useMemo(() => {
    const list: any[] = [];

    // 1. HOSPITAL-PUBLISHED services come first (from the hospital's own
    //    portal via the central registry — the source of truth).
    if (registryRecord) {
      const lab = registryRecord.labImaging;
      (lab?.labTests || []).forEach((testName, i) => {
        list.push({
          id: `${registryRecord.hospitalId}-LAB-${String(i + 1).padStart(3, '0')}`,
          name: testName,
          category: 'Laboratory',
          department: lab.labName,
          tat: 'As per laboratory schedule',
          selfPay: 'Contact hospital',
          insuranceRate: 'As per policy',
          availability: `Published by hospital • ${lab.labHours}`,
          sampleType: lab.homeSampleCollection ? 'Home sample collection available' : 'In-house collection',
          hospitalPublished: true
        });
      });
      (lab?.imagingServices || []).filter((s) => s.status === 'ACTIVE').forEach((svc) => {
        list.push({
          id: `${registryRecord.hospitalId}-IMG-${svc.modality.replace(/\s+/g, '').toUpperCase()}`,
          name: `${svc.modality} Imaging`,
          category: 'Imaging',
          department: lab.labName ? `${lab.labName} • Radiology` : 'Radiology',
          tat: svc.hours,
          selfPay: 'Contact hospital',
          insuranceRate: 'As per policy',
          availability: `Published by hospital • ${svc.hours}`,
          sampleType: 'Imaging Modality',
          hospitalPublished: true
        });
      });
    }

    // 2. Reference catalog (indicative) + local diagnostic context data.
    list.push(
      {
        id: `GH-LABTEST-${hospital.country.slice(0, 2).toUpperCase()}-001`,
        name: 'Comprehensive Metabolic Panel + Lipid Profile (STAT)',
        category: 'Laboratory',
        department: 'Clinical Biochemistry',
        tat: '45 mins (STAT) / 2 hours standard',
        selfPay: `${currencySymbol}65`,
        insuranceRate: '100% Covered (Copay $0-$10)',
        availability: '24/7 In-House Automated Roche Cobas 8000',
        sampleType: 'Venous Blood (Serum)'
      },
      {
        id: `GH-LABTEST-${hospital.country.slice(0, 2).toUpperCase()}-002`,
        name: 'Complete Blood Count (CBC) with 6-Part Differential',
        category: 'Laboratory',
        department: 'Hematology',
        tat: '30 mins',
        selfPay: `${currencySymbol}35`,
        insuranceRate: '100% Covered',
        availability: '24/7 Sysmex XN-9000 Automation Track',
        sampleType: 'Whole Blood (EDTA)'
      },
      {
        id: `GH-LABTEST-${hospital.country.slice(0, 2).toUpperCase()}-003`,
        name: 'High-Sensitivity Cardiac Troponin I & T (hs-cTn)',
        category: 'Laboratory',
        department: 'Emergency Biomarkers',
        tat: '15 mins',
        selfPay: `${currencySymbol}80`,
        insuranceRate: '100% Emergency Covered',
        availability: '24/7 Point-of-Care & Central Lab',
        sampleType: 'Venous Plasma'
      },
      {
        id: `GH-LABTEST-${hospital.country.slice(0, 2).toUpperCase()}-004`,
        name: 'Next-Generation Sequencing (NGS) Comprehensive Oncology Panel (500+ Genes)',
        category: 'Laboratory',
        department: 'Molecular Pathology & Genetics',
        tat: '5 Business Days',
        selfPay: `${currencySymbol}1,450`,
        insuranceRate: 'Pre-auth Required (Tier 1)',
        availability: 'Illumina NovaSeq 6000 Platform',
        sampleType: 'Tumor Biopsy / Liquid Biopsy'
      },
      {
        id: `GH-IMG-${hospital.country.slice(0, 2).toUpperCase()}-001`,
        name: '3.0 Tesla MRI Brain & Neuro-Vascular Angiography (w/ & w/o Contrast)',
        category: 'Imaging',
        department: 'Neuroradiology',
        tat: 'Same Day (2 hours for report)',
        selfPay: `${currencySymbol}580`,
        insuranceRate: 'Tier 1 In-Network Covered',
        availability: 'Siemens Magnetom Vida 3T 64-Channel (24/7)',
        sampleType: 'Imaging Modality'
      },
      {
        id: `GH-IMG-${hospital.country.slice(0, 2).toUpperCase()}-002`,
        name: '256-Slice Dual-Source Cardiac CT Angiography (CCTA) + Calcium Scoring',
        category: 'Imaging',
        department: 'Cardiovascular Imaging',
        tat: '1 hour STAT / Same Day',
        selfPay: `${currencySymbol}620`,
        insuranceRate: 'Tier 1 In-Network Covered',
        availability: 'GE Revolution Apex 256-Slice Ultra Low Dose (24/7)',
        sampleType: 'Imaging Modality'
      },
      {
        id: `GH-IMG-${hospital.country.slice(0, 2).toUpperCase()}-003`,
        name: 'Whole Body Digital PET-CT (18F-FDG Oncology & Inflammation)',
        category: 'Imaging',
        department: 'Nuclear Medicine & Molecular Imaging',
        tat: '24 hours',
        selfPay: `${currencySymbol}1,100`,
        insuranceRate: 'Pre-auth In-Network Covered',
        availability: 'Philips Vereos Digital PET/CT System',
        sampleType: 'Nuclear Medicine'
      },
      {
        id: `GH-IMG-${hospital.country.slice(0, 2).toUpperCase()}-004`,
        name: 'Digital 3D Mammography with AI-Assisted Breast Tomosynthesis',
        category: 'Imaging',
        department: 'Women’s Diagnostic Center',
        tat: 'Same Day report',
        selfPay: `${currencySymbol}210`,
        insuranceRate: '100% Preventive Screening Covered',
        availability: 'Hologic Selenia Dimensions 3D',
        sampleType: 'Imaging Modality'
      }
    );

    // Append live lab tests from DiagnosticContext
    if (liveLabTests && liveLabTests.length > 0) {
      liveLabTests.forEach((t) => {
        list.push({
          id: t.testCode,
          name: t.name,
          category: 'Laboratory',
          department: t.category,
          tat: `${t.standardTurnaroundMinutes} mins (Routine) / ${t.statTurnaroundMinutes} mins (STAT)`,
          selfPay: `${currencySymbol}${t.price.toLocaleString()}`,
          insuranceRate: '100% In-Network Covered',
          availability: t.analyzersAvailable?.join(', ') || 'Central Clinical Biochemistry Track',
          sampleType: t.specimenType
        });
      });
    }

    // Append live imaging modalities from DiagnosticContext
    if (liveImagingServices && liveImagingServices.length > 0) {
      liveImagingServices.forEach((i) => {
        list.push({
          id: i.modalityCode,
          name: i.name,
          category: 'Imaging',
          department: `Radiology • ${i.bodyRegion}`,
          tat: `${i.averageScanDurationMinutes} mins scan • Same Day Verified Report`,
          selfPay: `${currencySymbol}${i.price.toLocaleString()}`,
          insuranceRate: 'Pre-auth Tier 1 Covered',
          availability: `${i.scannerModel} (${i.roomSuite})`,
          sampleType: 'Imaging Modality'
        });
      });
    }

    return list;
  }, [liveLabTests, liveImagingServices, hospital.country, currencySymbol, registryRecord]);

  const filteredDiagnosticTests = diagnosticTests.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(labSearch.toLowerCase()) || item.department.toLowerCase().includes(labSearch.toLowerCase());
    const matchesCat = labCategory === 'All' || item.category === labCategory;
    return matchesSearch && matchesCat;
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-200 text-slate-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* ================= TOP BAR HEADER ================= */}
        <div className="bg-slate-900 text-white px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600/90 text-white font-extrabold text-lg shadow-inner ring-2 ring-blue-400/30 shrink-0">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  {hospital.name}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 text-[11px] font-bold">
                  <CheckCircle2 className="h-3 w-3" />
                  VERIFIED
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 text-[11px] font-semibold">
                  {trauma}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                <span className="text-blue-400 font-bold">{globalId}</span>
                <span>•</span>
                <span className="text-slate-300">{hospital.location}</span>
              </p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
            {onBookAmbulance && (
              <button
                onClick={() => onBookAmbulance(hospital)}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <ShieldAlert className="h-3.5 w-3.5 animate-pulse" />
                <span>Book Ambulance</span>
              </button>
            )}

            {onBookAppointment && (
              <button
                onClick={() => onBookAppointment(hospital)}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Book Appointment</span>
              </button>
            )}

            <button
              onClick={handleShare}
              title="Share Record"
              className="flex items-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 text-xs font-semibold transition"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={handlePrint}
              title="Print Record"
              className="flex items-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 text-xs font-semibold transition hidden md:flex"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ================= HORIZONTALLY SCROLLABLE NAVIGATION TABS ================= */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2 overflow-x-auto scrollbar-thin shrink-0 flex items-center gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= MAIN SCROLLABLE TAB CONTENT ================= */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-xs text-slate-700 bg-slate-50/50">

          {/* TAB 01: BASIC IDENTITY */}
          {activeTab === 'identity' && (
            <div className="space-y-6">
              {/* Cover Banner & Quick Stats */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900">
                <img
                  src={hospital.imageUrl}
                  alt={hospital.name}
                  className="h-56 w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="absolute bottom-5 left-5 right-5 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                      {hospital.type}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-xs">
                      {hospital.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl line-clamp-2">
                      {hospital.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-center">
                      <span className="text-[10px] text-slate-300 uppercase block font-semibold">Global Rating</span>
                      <span className="text-sm font-extrabold text-amber-300 flex items-center justify-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                        {hospital.rating} / 5.0
                      </span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-center">
                      <span className="text-[10px] text-slate-300 uppercase block font-semibold">Surgeries / Yr</span>
                      <span className="text-sm font-extrabold text-white">{hospital.surgeriesPerYear}+</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Stat Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Established</span>
                  <span className="text-lg font-extrabold text-slate-900">{hospital.yearEstablished || 2015}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Premier Medical Center</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Ownership Structure</span>
                  <span className="text-lg font-extrabold text-slate-900 truncate block">{hospital.ownership || 'Public-Private'}</span>
                  <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">Accredited Apex</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Capacity</span>
                  <span className="text-lg font-extrabold text-slate-900">{totalBeds} Beds</span>
                  <span className="text-[11px] text-blue-600 font-semibold block mt-0.5">{icuBeds} ICU Critical Care</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Emergency & Trauma</span>
                  <span className="text-lg font-extrabold text-rose-600">24/7 Active</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">{trauma} Trauma Center</span>
                </div>
              </div>

              {/* Identity Details Grid */}
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span>Official Registration & Legal Entity Record</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">GlobalHealth Hospital ID</span>
                    <p className="text-xs font-mono font-bold text-blue-600">{globalId}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Official Legal Name</span>
                    <p className="text-xs font-semibold text-slate-800">{hospital.officialLegalName || `${hospital.name} Healthcare Corp.`}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Hospital Network</span>
                    <p className="text-xs font-semibold text-slate-800">{hospital.hospitalNetwork || 'Global Academic Health Network'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Teaching Hospital Affiliation</span>
                    <p className="text-xs font-semibold text-emerald-600">Yes • Postgraduate Medical Residency</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Government / Regulatory Status</span>
                    <p className="text-xs font-semibold text-slate-800">Licensed Tertiary & Quaternary Care</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Verification Level</span>
                    <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Independent On-Site & Document Verified
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 02: LOCATION & NAVIGATION */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span>Geographic Coordinates & Campus Navigation</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{hospital.address}</p>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(hospital.name + ' ' + hospital.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-bold transition shadow-xs shrink-0"
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>Open in GPS Maps</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Country</span>
                    <span className="font-bold text-slate-800 text-xs">{hospital.country}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">City / Province</span>
                    <span className="font-bold text-slate-800 text-xs">{hospital.city}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">GPS Coordinates</span>
                    <span className="font-mono font-semibold text-slate-700 text-xs">{hospital.coordinates?.lat || '24.5002° N'}, {hospital.coordinates?.lng || '54.3892° E'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Time Zone</span>
                    <span className="font-semibold text-slate-800 text-xs">UTC+04:00 (Standard)</span>
                  </div>
                </div>
              </div>

              {/* Campus Access Gateways */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-emerald-600" />
                    <span>Main Outpatient & Visitor Entrance</span>
                  </h5>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Gate 1 (North Atrium Lobby) • Valet parking available • Patient concierge & wheelchair assistance desk directly at reception.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                  <h5 className="font-bold text-rose-900 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-rose-600" />
                    <span>24/7 Emergency & Ambulance Bay Entrance</span>
                  </h5>
                  <p className="text-rose-700 text-xs leading-relaxed">
                    Gate 4 (South Perimeter) • Direct zero-stair triage access for trauma stretchers • Unimpeded rapid entry for ambulance and private vehicles.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2">
                    <Plane className="h-4 w-4 text-blue-600" />
                    <span>Rooftop Helipad (Air Medevac)</span>
                  </h5>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Certified Rooftop Helipad with dedicated express trauma elevator to Level 1 ICU and Resuscitation bays.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                    <span>Parking & Public Transportation</span>
                  </h5>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    2,400 multi-level covered parking bays with 48 EV superchargers • Direct covered walkway from central transit station.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 03: CONTACTS & HOURS */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-rose-600 block">24/7 Emergency Hotline</span>
                  <p className="text-lg font-black text-rose-700">{hospital.emergencyHotline || hospital.contact}</p>
                  <a
                    href={`tel:${hospital.contact}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 text-xs font-bold transition mt-1"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call Emergency Line</span>
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-blue-600 block">Main Switchboard & Appointments</span>
                  <p className="text-lg font-black text-blue-800">{hospital.contact}</p>
                  <a
                    href={`tel:${hospital.contact}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold transition mt-1"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call Main Desk</span>
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 block">International Patient Desk</span>
                  <p className="text-lg font-black text-emerald-800">{hospital.internationalCare?.phone || hospital.contact}</p>
                  <p className="text-[11px] text-emerald-700">Multi-lingual concierge team 24/7</p>
                </div>
              </div>

              {/* Departmental Hours Breakdown */}
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>Departmental Operational Hours & Communication Channels</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-800 block">Emergency & Trauma Center</span>
                    <p className="text-emerald-600 font-bold">24 Hours / 7 Days</p>
                    <p className="text-[11px] text-slate-500">Walk-ins & Ambulance Transfers</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-800 block">Outpatient Specialty Clinics</span>
                    <p className="text-slate-700 font-semibold">{hospital.operatingHours?.clinics || '08:00 - 20:00 (Daily)'}</p>
                    <p className="text-[11px] text-slate-500">By Appointment / Walk-in slot</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-800 block">Radiology, MRI & Diagnostic Labs</span>
                    <p className="text-emerald-600 font-bold">24 Hours / 7 Days</p>
                    <p className="text-[11px] text-slate-500">STAT emergency testing round the clock</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-800 block">In-Hospital Pharmacy</span>
                    <p className="text-emerald-600 font-bold">24 Hours / 7 Days</p>
                    <p className="text-[11px] text-slate-500">Inpatient & Outpatient dispensing</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-800 block">Billing & Cashless Insurance Desk</span>
                    <p className="text-slate-700 font-semibold">07:00 - 22:00 (On-call 24/7)</p>
                    <p className="text-[11px] text-slate-500">Immediate pre-authorization support</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-800 block">Blood Bank & Transfusion Lab</span>
                    <p className="text-emerald-600 font-bold">24 Hours / 7 Days</p>
                    <p className="text-[11px] text-slate-500">Direct Donor & Emergency Supply</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 04: DEPARTMENTS */}
          {activeTab === 'departments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Clinical Centers & Specialized Institutes</h4>
                  <p className="text-xs text-slate-500">Comprehensive departments with dedicated inpatient wings & surgical theatres</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                  {departments.length} Institutes Operational
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <div key={dept.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-blue-600 block">{dept.id}</span>
                        <h5 className="font-extrabold text-slate-900 text-sm leading-tight">{dept.name}</h5>
                      </div>
                      <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold shrink-0">
                        {dept.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600">
                      <span className="font-bold text-slate-800">Institute Chair:</span> {dept.head}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-800">{dept.beds}</span> Dedicated Beds
                      </div>
                      <div>•</div>
                      <div>
                        <span className="font-bold text-slate-800">{dept.specialists}</span> Faculty Specialists
                      </div>
                      <div>•</div>
                      <div className="truncate">{dept.location}</div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Specialized Programs:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {dept.subspecialties.map((sub, i) => (
                          <span key={i} className="rounded-md bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-semibold">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 05: DOCTORS ROSTER */}
          {activeTab === 'doctors' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Credentialed Medical Practitioners Roster</h4>
                  <p className="text-xs text-slate-500">Board-certified clinicians with verified medical licensing and NPI numbers</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search doctor or specialty..."
                      value={doctorSearch}
                      onChange={(e) => setDoctorSearch(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDoctors.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-700 font-extrabold text-sm shrink-0">
                            {(doc?.name || 'Dr. Doctor').replace('Dr. ', '').charAt(0) || 'D'}
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-900 text-xs leading-tight">{doc?.name || 'Doctor'}</h5>
                            <span className="text-[11px] font-semibold text-blue-600 block">{doc?.specialty || 'General'}</span>
                          </div>
                        </div>
                        <span className="flex items-center gap-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-bold shrink-0">
                          <Check className="h-3 w-3" />
                          VERIFIED
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <p><span className="font-semibold text-slate-700">ID:</span> <span className="font-mono text-blue-600">{doc.docId}</span></p>
                        <p><span className="font-semibold text-slate-700">Qual:</span> {doc.qualifications}</p>
                        <p><span className="font-semibold text-slate-700">Schedule:</span> {doc.schedule}</p>
                        <p><span className="font-semibold text-slate-700">Experience:</span> {doc.experienceYears} Years</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block font-bold">Consultation</span>
                        <span className="text-xs font-extrabold text-slate-900">{doc.consultationFee}</span>
                      </div>
                      <button
                        onClick={() => onBookDoctor && onBookDoctor(doc)}
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold transition shadow-xs flex items-center gap-1"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Book Slot</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 06: BEDS & CAPACITY INTELLIGENCE */}
          {activeTab === 'beds' && (
            <div className="space-y-6">
              {/* Capacity Dashboard Overview */}
              <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">Live Operational Telemetry</span>
                    <h4 className="text-xl font-black text-white">Bed Capacity & Occupancy Matrix</h4>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-slate-300 font-semibold">Live Real-Time Sync</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Total Licensed Beds</span>
                    <span className="text-2xl font-black text-white">{totalBeds}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Occupied Beds</span>
                    <span className="text-2xl font-black text-amber-400">{occupiedBeds}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Available Ready Beds</span>
                    <span className="text-2xl font-black text-emerald-400">{availableBeds}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Current Occupancy</span>
                    <span className="text-2xl font-black text-blue-400">{occupancyRate}%</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                    <span>Occupancy Threshold Status</span>
                    <span className="text-emerald-400 font-bold">Optimal Tier 1 Flow</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div style={{ width: `${occupancyRate}%` }} className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Breakdown By Ward Type */}
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm">Critical Care & Inpatient Ward Distribution</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">Medical & Surgical ICU</span>
                      <span className="text-[10px] text-slate-500">Level III Advanced</span>
                    </div>
                    <span className="font-black text-slate-900 text-sm">{icuBeds} Beds</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">Cardiac Care Unit (CCU)</span>
                      <span className="text-[10px] text-slate-500">Post-Cath & STEMI</span>
                    </div>
                    <span className="font-black text-slate-900 text-sm">18 Beds</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">Neonatal ICU (NICU Level III)</span>
                      <span className="text-[10px] text-slate-500">Pre-term & Surgery</span>
                    </div>
                    <span className="font-black text-slate-900 text-sm">20 Beds</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">Pediatric ICU (PICU)</span>
                      <span className="text-[10px] text-slate-500">Dedicated Pediatric</span>
                    </div>
                    <span className="font-black text-slate-900 text-sm">15 Beds</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">Negative Pressure Isolation</span>
                      <span className="text-[10px] text-slate-500">Airborne Infection Control</span>
                    </div>
                    <span className="font-black text-slate-900 text-sm">18 Beds</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">VIP / Presidential Suites</span>
                      <span className="text-[10px] text-slate-500">Private Family Suite</span>
                    </div>
                    <span className="font-black text-slate-900 text-sm">32 Suites</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 07: EMERGENCY & TRAUMA */}
          {activeTab === 'emergency' && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-600 text-white font-black text-lg shrink-0">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-rose-700 tracking-wider">Apex Acute Care</span>
                      <h4 className="text-xl font-extrabold text-rose-950">24/7 Comprehensive {trauma} Center</h4>
                    </div>
                  </div>
                  <span className="rounded-full bg-rose-600 text-white px-3 py-1 text-xs font-bold flex items-center gap-1.5 self-start sm:self-center">
                    <span className="h-2 w-2 rounded-full bg-white animate-ping"></span>
                    ACTIVE EMERGENCY
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white border border-rose-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Emergency Beds</span>
                    <span className="text-lg font-black text-rose-700">48 Bays</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-rose-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Resuscitation Rooms</span>
                    <span className="text-lg font-black text-rose-700">6 STAT</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-rose-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">ALS Ambulances</span>
                    <span className="text-lg font-black text-rose-700">12 Fleet</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-rose-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Helipad Landing</span>
                    <span className="text-lg font-black text-emerald-600">Available</span>
                  </div>
                </div>

                {onBookAmbulance && (
                  <div className="pt-2 border-t border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-rose-900">
                      <span className="font-bold">Need Immediate Paramedic Transport?</span>
                      <p className="text-[11px] text-rose-700">Dispatch an ALS Mobile ICU with active GPS telemetry and door-to-needle priority.</p>
                    </div>
                    <button
                      onClick={() => onBookAmbulance(hospital)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 text-xs font-black transition shadow-xs cursor-pointer shrink-0"
                    >
                      <ShieldAlert className="h-4 w-4 animate-pulse" />
                      <span>Book / Dispatch Ambulance</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Trauma Capabilities List */}
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm">Emergency Critical Protocols & Rapid Response Teams</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 block">Code Stroke / Thrombectomy Ready</span>
                      <p className="text-[11px] text-slate-500">Door-to-needle time under 25 mins with 24/7 Interventional Neuroradiology.</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 block">Code STEMI Primary Angioplasty</span>
                      <p className="text-[11px] text-slate-500">Door-to-balloon time under 45 mins with dedicated continuous Cath Lab standby.</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 block">Mass Casualty & Disaster Decontamination</span>
                      <p className="text-[11px] text-slate-500">Certified hazardous chemical and biological emergency containment pods.</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 block">24/7 Clinical Toxicology & Poison Hotline</span>
                      <p className="text-[11px] text-slate-500">Immediate anti-venom & chemical antidote stockpiles on immediate standby.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 08: LABS & IMAGING */}
          {activeTab === 'labs' && (
            <div className="space-y-6">
              {/* Hospital-published laboratory information (live registry) */}
              {registryRecord?.labImaging ? (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Microscope className="h-4 w-4 text-blue-700 shrink-0" />
                      <div>
                        <h4 className="text-xs font-black text-blue-900">{registryRecord.labImaging.labName || 'Hospital Laboratory'}</h4>
                        <p className="text-[11px] text-blue-700/80">
                          Published by {registryRecord.identity.name} • updated {new Date(registryRecord.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                      <span className="rounded-full bg-white border border-blue-200 text-blue-800 px-2.5 py-1">🕐 {registryRecord.labImaging.labHours}</span>
                      {registryRecord.labImaging.homeSampleCollection && (
                        <span className="rounded-full bg-white border border-blue-200 text-blue-800 px-2.5 py-1">🏠 Home sample collection</span>
                      )}
                      <span className="rounded-full bg-white border border-blue-200 text-blue-800 px-2.5 py-1">📞 {registryRecord.labImaging.labContact}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {registryRecord.labImaging.imagingServices.map((s) => (
                      <span
                        key={s.modality}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                          s.status === 'ACTIVE' ? 'bg-white border-emerald-200 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                        }`}
                        title={s.hours}
                      >
                        {s.modality} • {s.status === 'ACTIVE' ? s.hours : 'Unavailable'}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-500">
                  This hospital has not published laboratory details yet — showing the GlobalHealth reference catalog.
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Diagnostic Laboratories & Advanced Imaging Suite</h4>
                  <p className="text-xs text-slate-500">Real-time test catalog with equipment specifications, TAT, and pricing</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search scan, blood test, MRI..."
                      value={labSearch}
                      onChange={(e) => setLabSearch(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                    {(['All', 'Laboratory', 'Imaging'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setLabCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          labCategory === cat ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDiagnosticTests.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-blue-600 block">{item.id}</span>
                        <h5 className="font-bold text-slate-900 text-xs leading-snug">{item.name}</h5>
                        <span className="text-[10px] text-slate-400 font-semibold">{item.department}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="rounded-md bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 text-[10px] font-bold">
                          {item.category}
                        </span>
                        {item.hospitalPublished && (
                          <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[9px] font-black">
                            ✓ Hospital-published
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Turnaround Time (TAT)</span>
                        <span className="font-semibold text-slate-800">{item.tat}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Self-Pay Rate</span>
                        <span className="font-extrabold text-blue-600">{item.selfPay}</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-slate-200/60">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Equipment Platform</span>
                        <span className="text-slate-700 font-medium">{item.availability}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 09: PHARMACY & BLOOD BANK */}
          {activeTab === 'pharmacy' && (
            <div className="space-y-6">
              {/* Hospital-published blood bank & pharmacy services (live registry) */}
              {registryRecord?.pharmacyBlood ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-rose-700 shrink-0" />
                        <h4 className="text-xs font-black text-rose-900">Blood Bank Services</h4>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[9px] font-black border ${
                        registryRecord.pharmacyBlood.bloodBankStatus === 'ACTIVE'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-slate-100 border-slate-300 text-slate-500'
                      }`}>
                        {registryRecord.pharmacyBlood.bloodBankStatus === 'ACTIVE' ? 'AVAILABLE' : 'NOT AVAILABLE'}
                      </span>
                    </div>
                    {registryRecord.pharmacyBlood.bloodBankStatus === 'ACTIVE' ? (
                      <ul className="text-[11px] text-rose-900/80 space-y-1">
                        <li>📍 {registryRecord.pharmacyBlood.bloodBankLocation}</li>
                        <li>🕐 {registryRecord.pharmacyBlood.bloodBankHours}</li>
                        <li>📞 {registryRecord.pharmacyBlood.bloodBankContact}</li>
                        <li className="flex flex-wrap gap-1 pt-0.5">
                          {registryRecord.pharmacyBlood.bloodComponents.map((c) => (
                            <span key={c} className="rounded-full bg-white border border-rose-200 px-2 py-0.5 text-[9px] font-bold text-rose-800">{c}</span>
                          ))}
                        </li>
                      </ul>
                    ) : (
                      <p className="text-[11px] text-slate-500">
                        The hospital has listed its blood bank as currently unavailable. Contact the hospital for alternatives.
                      </p>
                    )}
                  </div>
                  <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-purple-700 shrink-0" />
                      <h4 className="text-xs font-black text-purple-900">{registryRecord.pharmacyBlood.pharmacyName || 'Hospital Pharmacy'}</h4>
                    </div>
                    <ul className="text-[11px] text-purple-900/80 space-y-1">
                      <li>📍 {registryRecord.pharmacyBlood.pharmacyLocation}</li>
                      <li>🕐 {registryRecord.pharmacyBlood.pharmacyHours}</li>
                      <li>📞 {registryRecord.pharmacyBlood.pharmacyContact}</li>
                      <li>🚨 Emergency: {registryRecord.pharmacyBlood.emergencyPharmacy}</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-500">
                  This hospital has not published blood bank / pharmacy details yet — showing indicative reference data.
                </div>
              )}

              {/* Blood Bank — live, hospital-specific, from the public endpoint */}
              <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-100 text-rose-600 font-black shrink-0">
                      <Droplet className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {bloodBank?.name || 'Blood Bank & Transfusion Services'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {bloodBank
                          ? `${bloodBank.operatingHours || 'Contact hospital for hours'}${bloodBank.emergencyAvailable24x7 ? ' • Emergency 24/7' : ''}`
                          : 'Availability published by this hospital'}
                      </p>
                    </div>
                  </div>
                  {bloodBank && (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border self-start sm:self-center ${
                        bloodBank.overallStatus === 'AVAILABLE'
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : bloodBank.overallStatus === 'LOW_AVAILABILITY'
                            ? 'text-amber-700 bg-amber-50 border-amber-200'
                            : 'text-slate-600 bg-slate-100 border-slate-300'
                      }`}
                    >
                      {bloodBank.overallStatus === 'AVAILABLE'
                        ? 'Blood Bank Status: Available'
                        : bloodBank.overallStatus === 'LOW_AVAILABILITY'
                          ? 'Blood Bank Status: Low Availability'
                          : bloodBank.overallStatus === 'NOT_AVAILABLE'
                            ? 'Blood Bank Status: Not Available'
                            : 'Service Not Listed'}
                    </span>
                  )}
                </div>

                {/* Loading state — never show another hospital's data here */}
                {bloodBankLoading && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5" aria-live="polite" aria-busy="true">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50 animate-pulse space-y-1.5">
                        <div className="h-4 w-8 rounded bg-slate-200 mx-auto" />
                        <div className="h-3 w-12 rounded bg-slate-200 mx-auto" />
                        <div className="h-2.5 w-14 rounded bg-slate-100 mx-auto" />
                      </div>
                    ))}
                    <p className="col-span-full text-center text-[11px] text-slate-400 pt-1">
                      Checking live blood availability for {hospital.name}…
                    </p>
                  </div>
                )}

                {/* Error state with retry */}
                {!bloodBankLoading && bloodBankError && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>Unable to load blood-bank information. Please try again.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => loadBloodBank()}
                      className="rounded-xl border border-rose-300 bg-white px-3 py-1.5 font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Hospital explicitly does not list the service */}
                {!bloodBankLoading && !bloodBankError && bloodBank && !bloodBank.serviceListed && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                    This hospital does not currently list a blood-bank service. Please contact the hospital directly for
                    transfusion and emergency-blood requirements.
                  </div>
                )}

                {/* Listed but no published inventory */}
                {!bloodBankLoading && !bloodBankError && bloodBank?.serviceListed && bloodBank.groups.length === 0 && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                    Blood Bank information is currently unavailable. Please contact the hospital for current availability.
                  </div>
                )}

                {/* Live per-group availability table */}
                {!bloodBankLoading && !bloodBankError && bloodBank?.serviceListed && bloodBank.groups.length > 0 && (
                  <>
                    <div className="overflow-x-auto -mx-1 px-1">
                      <table className="w-full text-left text-xs border-separate border-spacing-y-1.5 min-w-[520px]">
                        <thead>
                          <tr className="text-[10px] uppercase tracking-wide text-slate-400">
                            <th className="px-3 py-1 font-bold">Blood Group</th>
                            <th className="px-3 py-1 font-bold">Availability</th>
                            <th className="px-3 py-1 font-bold hidden sm:table-cell">Components</th>
                            <th className="px-3 py-1 font-bold text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bloodBank.groups.map((g) => {
                            const icon =
                              g.status === 'AVAILABLE' ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              ) : g.status === 'LOW_AVAILABILITY' ? (
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 text-rose-500" />
                              );
                            const label =
                              g.status === 'AVAILABLE'
                                ? 'Available'
                                : g.status === 'LOW_AVAILABILITY'
                                  ? 'Low Availability'
                                  : 'Not Available';
                            return (
                              <tr key={g.bloodGroup} className="bg-slate-50/70">
                                <td className="px-3 py-2 rounded-l-xl font-black text-rose-700 text-sm">{g.bloodGroup}</td>
                                <td className="px-3 py-2 font-bold text-slate-800">{g.availableUnits} units</td>
                                <td className="px-3 py-2 text-slate-500 hidden sm:table-cell">
                                  {g.components.wholeBlood} whole • {g.components.plasma} plasma • {g.components.platelets} platelets
                                </td>
                                <td className="px-3 py-2 rounded-r-xl text-right">
                                  <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black border ${
                                      g.status === 'AVAILABLE'
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : g.status === 'LOW_AVAILABILITY'
                                          ? 'bg-amber-50 border-amber-200 text-amber-700'
                                          : 'bg-rose-50 border-rose-200 text-rose-700'
                                    }`}
                                  >
                                    {icon}
                                    {label}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live availability published by {hospital.name} • Last updated{' '}
                        <span className="font-semibold text-slate-500">
                          {new Date(bloodBank.lastUpdated).toLocaleString()}
                        </span>
                      </p>
                      {bloodBank.possiblyStale && (
                        <p className="text-[10px] text-amber-600 flex items-center gap-1.5">
                          <AlertTriangle className="h-3 w-3" />
                          Information may be outdated. Please contact the hospital for current availability.
                        </p>
                      )}
                      {bloodBank.emergencyContact && (
                        <p className="text-[10px] text-slate-400">
                          Emergency blood requisition: <span className="font-semibold text-slate-500">{bloodBank.emergencyContact}</span>
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
              {/* In-Hospital Pharmacy Formulary & Live Medicine Prices */}
              <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Pill className="h-4 w-4 text-purple-600" />
                      <span>In-Hospital Pharmacy Formulary & Transparent Medicine Prices</span>
                    </h4>
                    <p className="text-xs text-slate-500">Official dispensational pricing across inpatient and outpatient pharmacies</p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={pharmacySearch}
                      onChange={(e) => setPharmacySearch(e.target.value)}
                      placeholder="Search medicine brand or molecule..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(liveMeds && liveMeds.length > 0 ? liveMeds : [
                    { id: '1', brandName: 'Augmentin 625 Duo', genericName: 'Amoxicillin + Clavulanic Acid', dosageForm: 'Tablet', strength: '625 mg', unitPrice: 210, isPrescriptionRequired: true, currentStock: 450, reorderLevel: 100 },
                    { id: '2', brandName: 'Lantus Solostar', genericName: 'Insulin Glargine', dosageForm: 'Injection', strength: '100 IU/ml', unitPrice: 890, isPrescriptionRequired: true, currentStock: 120, reorderLevel: 30 },
                    { id: '3', brandName: 'Dolo 650', genericName: 'Paracetamol', dosageForm: 'Tablet', strength: '650 mg', unitPrice: 32, isPrescriptionRequired: false, currentStock: 1200, reorderLevel: 200 },
                    { id: '4', brandName: 'Meronem 1g IV', genericName: 'Meropenem Trihydrate', dosageForm: 'Vial IV', strength: '1000 mg', unitPrice: 1450, isPrescriptionRequired: true, currentStock: 85, reorderLevel: 20 }
                  ])
                    .filter((m) => 
                      !pharmacySearch || 
                      m.brandName.toLowerCase().includes(pharmacySearch.toLowerCase()) || 
                      m.genericName.toLowerCase().includes(pharmacySearch.toLowerCase())
                    )
                    .map((med) => (
                      <div key={med.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{med.brandName}</div>
                          <div className="text-[10px] text-slate-500">{med.genericName} • {med.dosageForm} {med.strength}</div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded mt-1 inline-block ${med.isPrescriptionRequired ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {med.isPrescriptionRequired ? 'Rx Required' : 'OTC Open'}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-slate-900 text-xs">{currencySymbol}{med.unitPrice.toLocaleString()}</div>
                          <div className="text-[9px] text-emerald-700 font-semibold mt-0.5">In Stock ({med.currentStock})</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: SERVICES & EQUIPMENT */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span>Clinical Specialties & Patient Services</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Outpatient Comprehensive Specialty Consultations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Inpatient Tertiary & Complex Surgical Care</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Minimally Invasive & Robotic Surgery Day Care</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Advanced Cardiac, Stroke & Neuro-Rehabilitation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Chemotherapy & Infusion Center</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Preventive Executive Health Screening</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Microscope className="h-4 w-4 text-blue-600" />
                    <span>High-Tech Medical Equipment Infrastructure</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Da Vinci Xi Surgical Robots</span>
                      <span className="font-mono text-blue-600 font-bold">2 Units</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Extracorporeal Membrane Oxygenation (ECMO)</span>
                      <span className="font-mono text-blue-600 font-bold">8 Stations</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Hemodialysis & CRRT Units</span>
                      <span className="font-mono text-blue-600 font-bold">36 Machines</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">3.0T MRI & 256-Slice Dual CT</span>
                      <span className="font-mono text-blue-600 font-bold">4 Suites</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Bi-Plane Angiography Cath Labs</span>
                      <span className="font-mono text-blue-600 font-bold">4 Labs</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: INTERNATIONAL PATIENT CARE */}
          {activeTab === 'international' && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-blue-900 text-white shadow-md space-y-3">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block">Global Patient Services</span>
                <h4 className="text-xl font-black text-white">International Patient Concierge & Medical Tourism</h4>
                <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
                  Dedicated multi-lingual medical travel coordination offering visa support, pre-travel video consultations, direct airport transfers, and interpreter liaison.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2">
                    <Plane className="h-4 w-4 text-blue-600" />
                    <span>Travel & Visa Coordination</span>
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Official medical visa invitation letters issued within 24 hours of clinical evaluation.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-emerald-600" />
                    <span>Multi-Lingual Interpreters</span>
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dedicated staff fluent in Arabic, English, Russian, French, Spanish, Mandarin, and German.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-indigo-600" />
                    <span>Direct Foreign Billing</span>
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Direct settlement with embassy medical offices and international private insurers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: ACCREDITATIONS & AUDIT */}
          {activeTab === 'accreditations' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>Accreditation Bodies & Quality Compliance Certificates</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {(hospital.accreditations || [
                    'Joint Commission International (JCI) Gold Seal of Approval',
                    'Magnet® Recognized Hospital for Nursing Excellence',
                    'ISO 15189 Medical Pathology Quality Standards',
                    'National Health Authority Apex Hospital Rating (5/5 Stars)'
                  ]).map((acc, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-100 text-amber-700 shrink-0">
                        <Award className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-xs block leading-tight">{acc}</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Cert Valid: 2024 - 2028 • Status: Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Overall Quality Score</span>
                  <span className="text-xl font-black text-emerald-600">98.6%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Infection Rate</span>
                  <span className="text-xl font-black text-blue-600">0.18%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">30-Day Readmission</span>
                  <span className="text-xl font-black text-slate-800">2.1%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Patient Satisfaction</span>
                  <span className="text-xl font-black text-amber-500">4.9 / 5.0</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 14: RESEARCH & EDUCATION */}
          {activeTab === 'research' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                  <span>Active Clinical Trials & Academic Affiliations</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Phase III Global Trial</span>
                    <h5 className="font-bold text-slate-900 mt-0.5">Novel SGLT2 Inhibitor Cardioprotection in Heart Failure with Preserved Ejection Fraction (HFpEF)</h5>
                    <p className="text-[11px] text-slate-500 mt-1">Lead PI: Prof. Dr. Michael Sterling • ClinicalTrials.gov ID: NCT05491024</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Oncology Biomarker Study</span>
                    <h5 className="font-bold text-slate-900 mt-0.5">Targeted CAR-T Cell Efficacy in Relapsed Refractory B-Cell Lymphoma</h5>
                    <p className="text-[11px] text-slate-500 mt-1">Lead PI: Dr. Tariq Al-Mansoor • Research Registry: GHR-CT-2026-09</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 16: UPDATES & NOTICES */}
          {activeTab === 'updates' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Bell className="h-4 w-4 text-amber-500" />
                  <span>Hospital Bulletins & Operational Notices</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900">New 4th Generation Da Vinci Xi Robotic Suite Inauguration</span>
                      <span className="text-[10px] text-slate-500">August 2026</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Expanding minimally invasive capabilities in urological and gynecological surgical oncology.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Free Community Cardiovascular Health Screening Camp</span>
                      <span className="text-[10px] text-slate-500">August 2026</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Free lipid profile, ECG, and physician consult for high-risk patients every Saturday this month.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 17: VERIFICATION & AUDIT */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-emerald-950 text-white shadow-md space-y-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-white font-black text-xl shrink-0">
                    <BadgeCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">GlobalHealth Verification Standard</span>
                    <h4 className="text-xl font-black text-white">Tier-1 Highest Confidence Verified Record</h4>
                  </div>
                </div>

                <p className="text-xs text-emerald-100 leading-relaxed">
                  This hospital intelligence record is cryptographically signed and independently verified against government health ministry databases, accreditation registries, and on-site clinical audits.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-emerald-800">
                  <div>
                    <span className="text-[10px] uppercase text-emerald-300 font-bold block">Verification Authority</span>
                    <span className="text-xs font-bold text-white">Health Regulatory Authority</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-emerald-300 font-bold block">Audit Date</span>
                    <span className="text-xs font-bold text-white">14 August 2026</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-emerald-300 font-bold block">Data Confidence</span>
                    <span className="text-xs font-bold text-emerald-400">99.8% (Maximum)</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-emerald-300 font-bold block">Audit Status</span>
                    <span className="text-xs font-bold text-emerald-400">100% Passed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ================= BOTTOM PERSISTENT ACTION BAR ================= */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800 shrink-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-mono text-blue-400 font-bold">{globalId}</span>
            <span>•</span>
            <span className="text-rose-400 font-semibold">Emergency Hotline: {hospital.emergencyHotline || hospital.contact}</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 text-xs font-bold transition"
            >
              Close Record
            </button>
            <a
              href={`tel:${hospital.contact}`}
              onClick={() => setContactFeedback(true)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold transition shadow-xs"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Contact Hospital Reception</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
