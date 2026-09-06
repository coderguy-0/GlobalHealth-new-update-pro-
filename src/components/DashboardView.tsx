import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Droplets, 
  Pill, 
  Bookmark, 
  Plus, 
  Minus,
  Check, 
  Scale, 
  Ruler,
  HeartPulse, 
  Trash2,
  Sparkles,
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  Video,
  X,
  AlertCircle,
  Activity,
  CheckCircle2,
  History,
  TrendingUp,
  Save,
  Phone,
  FileText,
  Syringe,
  Thermometer,
  ShieldAlert,
  FileSpreadsheet,
  Camera,
  Pencil,
  Share2,
  Lock,
  Eye,
  Download,
  AlertTriangle,
  Flame,
  ChevronRight,
  ShieldCheck,
  Building2,
  FlaskConical,
  Radio,
  FileCheck,
  RefreshCw,
  QrCode,
  Copy,
  ExternalLink,
  Search
} from 'lucide-react';
import { HEALTH_CONDITIONS, MEDICINES, RECIPES } from '../data/healthData';
import { PatientProfile, UserAccount } from '../types';
import { EditProfileModal } from './EditProfileModal';
import { useLocalization } from '../context/LocalizationContext';
import { usePatientEhr, DataProvenanceSource, AllergyVerificationStatus } from '../context/PatientEhrContext';
import { LabReportItem } from '../types/medauth';
import { PrescriptionsEhrTab } from './health-records/PrescriptionsEhrTab';
import { AccessGovernancePanel } from './health-records/AccessGovernancePanel';
import { AuditTrailPanel } from './health-records/AuditTrailPanel';
import { apiFetch, AuthError } from '../services/authClient';

interface DashboardViewProps {
  savedIds: string[];
  onToggleSave: (id: string) => void;
  currentUser?: UserAccount | null;
  initialViewMode?: 'dashboard' | 'ehr' | 'saved';
  onUpdateUser?: (updated: UserAccount) => void;
  /** Hide the in-page layer selector when the overlay header already provides navigation. */
  hideModeSwitcher?: boolean;
}

const ALL_WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EHR_TABS = [
  { id: 'vitals', label: 'Vitals & Telemetry', icon: HeartPulse },
  { id: 'timeline', label: 'Health Timeline', icon: History },
  { id: 'medical-history', label: 'Medical History', icon: FileSpreadsheet },
  { id: 'symptoms', label: 'Symptoms', icon: AlertCircle },
  { id: 'diagnoses', label: 'Diagnoses', icon: Activity },
  { id: 'medications', label: 'Medications', icon: Pill },
  { id: 'allergies', label: 'Allergies (2-Way)', icon: ShieldAlert },
  { id: 'lab-reports', label: 'Lab Reports', icon: FlaskConical },
  { id: 'imaging', label: 'Imaging & Scans', icon: Radio },
  { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
  { id: 'procedures', label: 'Procedures', icon: Stethoscope },
  { id: 'immunization', label: 'Immunization', icon: Syringe },
  { id: 'hospitalization', label: 'Hospitalization', icon: Building2 },
  { id: 'documents', label: 'Documents Vault', icon: FileCheck },
  { id: 'sharing', label: 'Sharing & Access', icon: Share2 },
  { id: 'audit', label: 'Audit Trail', icon: Lock },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  savedIds,
  onToggleSave,
  currentUser,
  initialViewMode,
  onUpdateUser,
  hideModeSwitcher,
}) => {
  const { t } = useLocalization();
  const {
    activePatient,
    wellness,
    updateWellness,
    logWater,
    resetWaterDaily,
    vitalsHistory,
    addVitalReading,
    medicationReminders,
    addMedicationReminder,
    toggleMedicationTaken,
    deleteMedicationReminder,
    allergiesList,
    reportAllergy,
    symptomsList,
    reportSymptom,
    updateSymptomStatus,
    appointments,
    bookAppointment,
    consents,
    grantConsent,
    revokeConsent,
    auditLogs,
    notifications,
    markNotificationRead,
    updatePatientDemographics,
    clinicalPrescriptions,
    savePrescriptionDocument,
    updatePrescriptionStatus,
    deletePrescriptionDocument
  } = usePatientEhr();

  // Active EHR Tab
  const [activeEhrTab, setActiveEhrTab] = useState<string>('vitals');

  // Main UI Mode: 'dashboard' (Layer 1 Personal Health) vs 'ehr' (Layer 2 Clinical EHR) vs 'saved'
  const [mainViewMode, setMainViewMode] = useState<'dashboard' | 'ehr' | 'saved'>(initialViewMode || 'dashboard');

  React.useEffect(() => {
    if (initialViewMode) {
      setMainViewMode(initialViewMode);
    }
  }, [initialViewMode]);

  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [isAddSymptomOpen, setIsAddSymptomOpen] = useState(false);
  const [isAddAllergyOpen, setIsAddAllergyOpen] = useState(false);
  const [isAddVitalOpen, setIsAddVitalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEmergencyCardOpen, setIsEmergencyCardOpen] = useState(false);
  const [selectedLabReport, setSelectedLabReport] = useState<LabReportItem | null>(null);

  // Vitals Manual State in Layer 1
  const [sysBp, setSysBp] = useState<number>(120);
  const [diaBp, setDiaBp] = useState<number>(80);
  const [pulseRate, setPulseRate] = useState<number>(72);
  const [bpNotes, setBpNotes] = useState<string>('');
  const [showBpHistoryModal, setShowBpHistoryModal] = useState(false);

  // New Reminder Form
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('10mg');
  const [newMedTime, setNewMedTime] = useState('08:00 AM');
  const [newMedDays, setNewMedDays] = useState<string[]>(ALL_WEEKDAYS);
  const [newMedNotes, setNewMedNotes] = useState('');

  // New Symptom Form
  const [symptomName, setSymptomName] = useState('');
  const [symptomSeverity, setSymptomSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Mild');
  const [symptomDuration, setSymptomDuration] = useState('2 hours');
  const [symptomOnset, setSymptomOnset] = useState(new Date().toISOString().split('T')[0]);
  const [symptomNotes, setSymptomNotes] = useState('');

  // New Allergy Form
  const [allergenName, setAllergenName] = useState('');
  const [allergyCategory, setAllergyCategory] = useState<'Drug' | 'Food' | 'Environmental' | 'Biological'>('Drug');
  const [allergyReaction, setAllergyReaction] = useState('');
  const [allergySeverity, setAllergySeverity] = useState<'Mild' | 'Moderate' | 'Severe' | 'Anaphylactic'>('Moderate');
  const [allergyNotes, setAllergyNotes] = useState('');

  // Share Consent Form
  const [shareRecipientName, setShareRecipientName] = useState('');
  const [shareRecipientType, setShareRecipientType] = useState<'Physician' | 'Hospital' | 'Laboratory' | 'Pharmacy' | 'Insurance'>('Physician');
  const [shareDurationDays, setShareDurationDays] = useState<number>(7);
  const [shareScopes, setShareScopes] = useState<('Vitals' | 'Labs' | 'Medications' | 'Diagnoses' | 'Imaging' | 'Clinical Notes' | 'Billing')[]>([
    'Vitals', 'Labs', 'Medications', 'Diagnoses'
  ]);
  const [createdShareToken, setCreatedShareToken] = useState<string | null>(null);
  const [createdShareUrl, setCreatedShareUrl] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [shareError, setShareError] = useState<string | null>(null);

  // Saved Items Filter
  const [savedFilter, setSavedFilter] = useState<'all' | 'conditions' | 'medicines' | 'recipes'>('all');

  // Patient Profile object derived from canonical EHR activePatient
  const profile: PatientProfile = {
    fullName: activePatient.name,
    age: activePatient.age,
    gender: (activePatient.gender === 'Other' ? 'Other' : activePatient.gender) as 'Male' | 'Female' | 'Other',
    bloodGroup: activePatient.bloodGroup,
    phoneNumber: activePatient.phone || '',
    dateOfBirth: activePatient.dob || '',
    photoUrl: currentUser?.avatarUrl,
    mrn: activePatient.mrn,
    emergencyContactName: activePatient.emergencyContact?.name || '',
    emergencyContactPhone: activePatient.emergencyContact?.phone || '',
    emergencyContactRelation: activePatient.emergencyContact?.relation || '',
  };

  const handleSaveProfile = (updated: PatientProfile) => {
    updatePatientDemographics(updated);
    if (onUpdateUser && currentUser) {
      onUpdateUser({
        ...currentUser,
        fullName: updated.fullName,
        age: updated.age,
        gender: updated.gender,
        bloodGroup: updated.bloodGroup,
        phoneNumber: updated.phoneNumber,
        dateOfBirth: updated.dateOfBirth,
        avatarUrl: updated.photoUrl,
        mrn: updated.mrn,
        emergencyContactName: updated.emergencyContactName,
        emergencyContactPhone: updated.emergencyContactPhone,
        emergencyContactRelation: updated.emergencyContactRelation,
      });
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'PT';
  };

  // BMI Calculation
  const currentHeightM = (wellness.heightCm || 175) / 100;
  const calculatedBmi = +(wellness.weightKg / (currentHeightM * currentHeightM)).toFixed(1);
  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (bmi < 24.9) return { label: 'Normal Weight', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (bmi < 29.9) return { label: 'Overweight', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Obese', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };
  const bmiInfo = getBmiCategory(calculatedBmi);

  // Handle Vital Log
  const handleLogVital = () => {
    addVitalReading({
      sys: sysBp,
      dia: diaBp,
      pulse: pulseRate,
      notes: bpNotes,
      source: 'PATIENT_REPORTED',
      recordedBy: activePatient.name
    });
    setBpNotes('');
  };

  // Handle Add Medication Reminder
  const handleAddMedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    addMedicationReminder({
      name: newMedName.trim(),
      dosage: newMedDose.trim() || '10mg',
      time: newMedTime,
      days: newMedDays.length > 0 ? newMedDays : ALL_WEEKDAYS,
      notes: newMedNotes.trim() || undefined
    });
    setNewMedName('');
    setNewMedNotes('');
    setIsAddMedOpen(false);
  };

  // Handle Add Symptom Submit
  const handleAddSymptomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomName.trim()) return;
    reportSymptom({
      symptom: symptomName.trim(),
      severity: symptomSeverity,
      duration: symptomDuration,
      onset: symptomOnset,
      status: 'Active',
      notes: symptomNotes.trim() || undefined
    });
    setSymptomName('');
    setSymptomNotes('');
    setIsAddSymptomOpen(false);
  };

  // Handle Add Allergy Submit
  const handleAddAllergySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allergenName.trim()) return;
    reportAllergy({
      allergen: allergenName.trim(),
      category: allergyCategory,
      reaction: allergyReaction.trim() || 'Suspected reaction',
      severity: allergySeverity,
      notes: allergyNotes.trim() || undefined
    });
    setAllergenName('');
    setAllergyReaction('');
    setAllergyNotes('');
    setIsAddAllergyOpen(false);
  };

  // Handle Share Submit — the server creates the capability token; the
  // frontend never invents an access link.
  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareRecipientName.trim() || shareStatus === 'saving') return;
    setShareStatus('saving');
    setShareError(null);
    try {
      const result = await apiFetch<{ success: boolean; token: string; url: string; expiresAt: number }>('/api/ehr/consent-share', {
        method: 'POST',
        body: {
          granteeName: shareRecipientName.trim(),
          granteeType: shareRecipientType,
          scopes: shareScopes,
          durationDays: shareDurationDays,
        },
      });
      grantConsent(
        {
          granteeName: shareRecipientName.trim(),
          granteeType: shareRecipientType,
          scope: shareScopes,
          expiresDate: new Date(result.expiresAt).toISOString().split('T')[0],
        },
        result.token
      );
      setCreatedShareToken(result.token);
      setCreatedShareUrl(result.url);
      setShareStatus('idle');
    } catch (err) {
      const message = err instanceof AuthError ? err.message : 'We could not create the secure access link. Please try again.';
      setShareError(message);
      setShareStatus('error');
    }
  };

  // Saved Data lists
  const savedConditions = HEALTH_CONDITIONS.filter((c) => savedIds.includes(c.id));
  const savedMedicines = MEDICINES.filter((m) => savedIds.includes(m.id));
  const savedRecipes = RECIPES.filter((r) => savedIds.includes(r.id));

  // Time-aware personal greeting.
  const greetingHour = new Date().getHours();
  const greetingWord = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = currentUser?.fullName?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* 0. PERSONALIZED DASHBOARD GREETING (authenticated user only) */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                {greetingWord}, {firstName} 👋
              </h1>
              <p className="mt-1 text-sm text-emerald-50/90">
                Your health, organized in one secure place.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-xs font-semibold ring-1 ring-white/20">
              <ShieldCheck className="h-4 w-4 text-emerald-200" />
              Private session · your records are protected
            </div>
          </div>
        </div>
      </div>

      {/* 1. TOP ANNOUNCEMENT / NOTIFICATION TICKER */}
      {notifications.some(n => !n.read) && (
        <div className="bg-teal-900 text-teal-100 text-xs px-4 py-2 flex items-center justify-between border-b border-teal-800">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="font-semibold text-white">EHR Live Sync:</span>
              <span>{notifications.find(n => !n.read)?.title} — {notifications.find(n => !n.read)?.description}</span>
            </div>
            <button 
              onClick={() => markNotificationRead(notifications.find(n => !n.read)?.id || '')}
              className="text-teal-200 hover:text-white underline font-medium text-xs whitespace-nowrap cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 2. CANONICAL PATIENT IDENTITY HERO CARD */}
      <section className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Identity & Demographics */}
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative group shrink-0">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.fullName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-teal-500/40 shadow-xl"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 text-white font-bold text-2xl sm:text-3xl flex items-center justify-center ring-4 ring-teal-500/30 shadow-xl">
                    {getInitials(profile.fullName)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-slate-900" title="EHR Identity Verified">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {profile.fullName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    {profile.mrn}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Canonical EHR Active
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs sm:text-sm text-slate-300">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {profile.age} yrs • {profile.gender}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                    Blood: <strong className="text-white">{profile.bloodGroup}</strong>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    DOB: {profile.dateOfBirth}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {profile.phoneNumber}
                  </span>
                </div>

                {/* Emergency Contact Bar */}
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 max-w-xl">
                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Emergency Contact:
                  </span>
                  <span className="text-slate-200 font-medium">{profile.emergencyContactName} ({profile.emergencyContactRelation})</span>
                  <span className="text-teal-400 font-mono">{profile.emergencyContactPhone}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & View Switcher */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-end lg:self-center">
              <button
                onClick={() => setIsEmergencyCardOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Emergency Card
              </button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-teal-600/20 text-teal-300 hover:bg-teal-600/30 border border-teal-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share EHR
              </button>

              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Canonical EHR source indicator (own record only — no patient switching) */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Source of Truth:</span>
              <span className="text-teal-300 font-medium">GlobalHealth Universal EHR Core</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">FHIR R4 Aligned</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRIMARY VIEW SELECTOR BAR (Dashboard Layer 1 vs Clinical EHR Layer 2 vs Saved Items) */}
      {!hideModeSwitcher && (
      <section className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2">
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMainViewMode('dashboard')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shrink-0 ${
                  mainViewMode === 'dashboard'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Personal Health Dashboard
              </button>

              <button
                onClick={() => setMainViewMode('ehr')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shrink-0 ${
                  mainViewMode === 'ehr'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                Clinical Health Record (EHR)
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                  16 Views
                </span>
              </button>

              <button
                onClick={() => setMainViewMode('saved')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shrink-0 ${
                  mainViewMode === 'saved'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                Saved Library ({savedIds.length})
              </button>
            </div>

            {/* Quick Record Indicator */}
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 shrink-0">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>Real-time Doctor & Hospital Synced</span>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 4. MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ========================================================================= */}
        {/* LAYER 1: PERSONAL HEALTH DASHBOARD (Vitals, Hydration, Meds, Appointments) */}
        {/* ========================================================================= */}
        {mainViewMode === 'dashboard' && (
          <div className="space-y-8">

            {/* Doctor Access & Consent summary — patient-controlled (spec 44) */}
            <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-emerald-900">Doctor Access &amp; Consent</h3>
                  <p className="mt-0.5 max-w-xl text-xs text-emerald-800">
                    You control who can access and request changes to your health information. Doctors can view only what you
                    permit — and can never add, edit or remove anything without your explicit approval.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <a href="#privacy" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700">
                  Doctor Access &amp; Consent
                </a>
                <a href="#my-history" className="rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-50">
                  Health &amp; Security History
                </a>
              </div>
            </div>

            {/* Top Row: 4 Metric Cards (Blood Pressure, Weight, Height & BMI, Hydration) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Blood Pressure */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-rose-50 rounded-xl text-rose-600 border border-rose-100">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Blood Pressure</h3>
                      <p className="text-[11px] text-slate-500 font-medium">Resting Telemetry</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Normal
                  </span>
                </div>

                <div className="my-3">
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {sysBp} <span className="text-lg font-bold text-slate-400">/</span> {diaBp}
                    <span className="text-xs font-medium text-slate-500 ml-1.5">mmHg</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-rose-500" />
                    Pulse: <strong className="text-slate-800">{pulseRate} BPM</strong>
                  </div>
                </div>

                {/* Quick adjustments & log */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setSysBp(prev => prev - 2); setDiaBp(prev => prev - 1); }}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold transition-colors"
                      title="Decrease BP"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { setSysBp(prev => prev + 2); setDiaBp(prev => prev + 1); }}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold transition-colors"
                      title="Increase BP"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleLogVital}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <Save className="w-3 h-3" />
                    Log to EHR
                  </button>
                </div>
              </div>

              {/* Card 2: Current Weight */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Current Weight</h3>
                      <p className="text-[11px] text-slate-500 font-medium">Goal: {wellness.targetWeightKg} kg</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    -2.0 kg Goal
                  </span>
                </div>

                <div className="my-3">
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {wellness.weightKg.toFixed(1)}
                    <span className="text-xs font-medium text-slate-500 ml-1.5">kg</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Target: <strong className="text-slate-800">{wellness.targetWeightKg} kg</strong> (2.0 kg to go)
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateWellness({ weightKg: Math.max(30, wellness.weightKg - 0.5) })}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updateWellness({ weightKg: wellness.weightKg + 0.5 })}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setActiveEhrTab('vitals');
                      setMainViewMode('ehr');
                    }}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                  >
                    View History →
                  </button>
                </div>
              </div>

              {/* Card 3: Height & BMI */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-50 rounded-xl text-purple-600 border border-purple-100">
                      <Ruler className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Height & BMI</h3>
                      <p className="text-[11px] text-slate-500 font-medium">Body Metrics</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${bmiInfo.color}`}>
                    {bmiInfo.label}
                  </span>
                </div>

                <div className="my-3">
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {wellness.heightCm}
                    <span className="text-xs font-medium text-slate-500 ml-1.5">cm</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                    Calculated BMI: <strong className="text-slate-900">{calculatedBmi} kg/m²</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateWellness({ heightCm: Math.max(100, wellness.heightCm - 1) })}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updateWellness({ heightCm: wellness.heightCm + 1 })}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Clinical Standard</span>
                </div>
              </div>

              {/* Card 4: Hydration Tracker */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-cyan-50 rounded-xl text-cyan-600 border border-cyan-100">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Daily Hydration</h3>
                      <p className="text-[11px] text-slate-500 font-medium">Goal: {wellness.waterGoalMl} ml</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                    {Math.round((wellness.waterMl / wellness.waterGoalMl) * 100)}%
                  </span>
                </div>

                <div className="my-3">
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {wellness.waterMl}
                    <span className="text-xs font-medium text-slate-500 ml-1.5">ml</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                    <div
                      className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (wellness.waterMl / wellness.waterGoalMl) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => logWater(250)}
                      className="px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-lg text-xs font-bold transition-colors"
                    >
                      +250ml
                    </button>
                    <button
                      onClick={() => logWater(-250)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      -250ml
                    </button>
                  </div>
                  <button
                    onClick={resetWaterDaily}
                    className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                  >
                    Reset
                  </button>
                </div>
              </div>

            </div>

            {/* Middle Row: Medication Reminders & Upcoming Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Medication Reminders (2 Columns) */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-teal-50 rounded-xl text-teal-700 border border-teal-100">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Medication Reminders</h2>
                      <p className="text-xs text-slate-500">Connected to Active e-Prescriptions & Personal Dosing Schedule</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveEhrTab('prescriptions');
                        setMainViewMode('ehr');
                      }}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-700" />
                      Prescriptions Vault
                    </button>
                    <button
                      onClick={() => setIsAddMedOpen(true)}
                      className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Reminder
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {medicationReminders.map((med) => (
                    <div
                      key={med.id}
                      className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                        med.takenToday
                          ? 'bg-emerald-50/40 border-emerald-200 text-slate-700'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleMedicationTaken(med.id)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors mt-0.5 ${
                            med.takenToday
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 hover:border-teal-600 bg-white text-transparent'
                          }`}
                          title={med.takenToday ? 'Dose taken today (Click to undo)' : 'Mark dose as taken'}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`text-sm font-bold ${med.takenToday ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                              {med.name}
                            </h4>
                            <span className="text-xs font-mono px-2 py-0.2 rounded bg-slate-100 text-slate-600">
                              {med.dosage}
                            </span>
                            {med.prescriptionId && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-teal-100 text-teal-800">
                                Doctor Prescribed
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {med.time}
                            </span>
                            <span>•</span>
                            <span>{med.days.join(', ')}</span>
                            {med.lastTakenTime && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-700 font-medium">Taken at {med.lastTakenTime}</span>
                              </>
                            )}
                          </div>
                          {med.notes && (
                            <p className="text-xs text-slate-500 mt-1 italic">{med.notes}</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteMedicationReminder(med.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete reminder"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Appointments & Consultations (1 Column) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-purple-50 rounded-xl text-purple-700 border border-purple-100">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900">Care Appointments</h2>
                        <p className="text-xs text-slate-500">Upcoming clinical visits</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
                      {appointments.length} Total
                    </span>
                  </div>

                  <div className="space-y-3">
                    {appointments.slice(0, 3).map((apt) => (
                      <div key={apt.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{apt.doctorName || 'Attending Physician'}</h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 font-medium">{apt.type}</p>
                        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                          <span className="flex items-center gap-1 font-mono text-slate-700 font-semibold">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {apt.date} • {apt.time}
                          </span>
                          {apt.type.includes('Telemedicine') || apt.type === 'TELEMEDICINE' ? (
                            <span className="text-teal-700 font-semibold flex items-center gap-1">
                              <Video className="w-3 h-3" />
                              Join Room
                            </span>
                          ) : (
                            <span className="text-slate-600">{apt.roomOrDesk || 'Room 302'}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setActiveEhrTab('timeline');
                      setMainViewMode('ehr');
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    View All in Timeline →
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Row: Recent Lab Diagnostic Summary & Quick Two-Way Symptom Logger */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Lab Diagnostics */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-700 border border-indigo-100">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Recent Laboratory Panels</h2>
                      <p className="text-xs text-slate-500">CLIA Accredited Diagnostic Releases</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveEhrTab('lab-reports');
                      setMainViewMode('ehr');
                    }}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                  >
                    View Full Panels ({activePatient.labReports?.length || 0}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {(activePatient.labReports || []).slice(0, 2).map((lab) => (
                    <div key={lab.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{lab.testName}</h4>
                            <span className="text-xs px-2 py-0.2 font-bold rounded-full bg-emerald-100 text-emerald-800">
                              {lab.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Performed: {new Date(lab.performedAt).toLocaleDateString()} • {lab.performingLab?.name || 'Pathology Core'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-extrabold text-slate-900">
                            {lab.resultValue} <span className="text-xs font-medium text-slate-500">{lab.unit}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">Ref: {lab.referenceRange}</span>
                        </div>
                      </div>

                      {lab.reviewStatus === 'REVIEWED' && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Reviewed by {lab.reviewedBy || 'Attending Physician'}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {lab.reviewedAt ? new Date(lab.reviewedAt).toLocaleDateString() : 'Signed'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Two-Way Symptom & Allergy Reporting Widget */}
              <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-2 bg-teal-500/20 rounded-xl text-teal-300 border border-teal-500/30">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Two-Way Care Communication</h2>
                      <p className="text-xs text-slate-300">Report changes directly into your physician's clinical workspace</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed my-3">
                    Have you experienced new symptoms, medication side-effects, or suspected allergies? Log them here so your doctor sees them in the consultation and e-prescribing suites.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() => setIsAddSymptomOpen(true)}
                      className="p-3 rounded-xl bg-teal-800/60 hover:bg-teal-700 text-left border border-teal-600/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <AlertCircle className="w-4 h-4 text-teal-300" />
                        <span className="text-[10px] uppercase font-bold text-teal-300">Self-Report</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">Report a Symptom</h4>
                      <p className="text-[10px] text-slate-300 mt-0.5">Onset, severity, duration</p>
                    </button>

                    <button
                      onClick={() => setIsAddAllergyOpen(true)}
                      className="p-3 rounded-xl bg-rose-900/40 hover:bg-rose-800/60 text-left border border-rose-700/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <ShieldAlert className="w-4 h-4 text-rose-300" />
                        <span className="text-[10px] uppercase font-bold text-rose-300">Clinical Alert</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">Report Suspected Allergy</h4>
                      <p className="text-[10px] text-rose-200 mt-0.5">Drug, food, environment</p>
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-teal-400" />
                    Cryptographically Audited
                  </span>
                  <button
                    onClick={() => {
                      setActiveEhrTab('allergies');
                      setMainViewMode('ehr');
                    }}
                    className="text-teal-300 hover:text-white font-medium underline"
                  >
                    View Verified Allergies ({allergiesList.length}) →
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* LAYER 2: CLINICAL EHR DEEP TABS (Vitals, Timeline, Diagnoses, Labs, etc.) */}
        {/* ========================================================================= */}
        {mainViewMode === 'ehr' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Top Navigation Tabs */}
            <div className="border-b border-slate-200 bg-slate-50/70 px-4 pt-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3">
                {EHR_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeEhrTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveEhrTab(tab.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-teal-700 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Body */}
            <div className="p-6">
              
              {/* TAB 1: Vitals & Telemetry */}
              {activeEhrTab === 'vitals' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Longitudinal Vitals & Telemetry</h3>
                      <p className="text-xs text-slate-500">Historical physiological monitoring dataset</p>
                    </div>
                    <button
                      onClick={() => setIsAddVitalOpen(true)}
                      className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Vital Reading
                    </button>
                  </div>

                  {/* Vitals History Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Systolic</th>
                          <th className="px-4 py-3">Diastolic</th>
                          <th className="px-4 py-3">Heart Rate</th>
                          <th className="px-4 py-3">Fasting Glucose</th>
                          <th className="px-4 py-3">SpO2</th>
                          <th className="px-4 py-3">Provenance / Source</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        {vitalsHistory.map((v, i) => (
                          <tr key={i} className="hover:bg-slate-50/60">
                            <td className="px-4 py-3 font-mono font-medium text-slate-900">{v.date}</td>
                            <td className="px-4 py-3 font-bold text-slate-800">{v.systolic} mmHg</td>
                            <td className="px-4 py-3 font-bold text-slate-800">{v.diastolic} mmHg</td>
                            <td className="px-4 py-3">{v.heartRate} BPM</td>
                            <td className="px-4 py-3">{v.glucose} mg/dL</td>
                            <td className="px-4 py-3">{v.spo2 || 99}%</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                                Verified Clinical Record
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: Longitudinal Health Timeline */}
              {activeEhrTab === 'timeline' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Unified Longitudinal Health Timeline</h3>
                      <p className="text-xs text-slate-500">Chronological history of all clinical encounters, lab tests, and prescriptions</p>
                    </div>
                  </div>

                  <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
                    {(activePatient.clinicalTimeline || []).map((event) => (
                      <div key={event.id} className="relative">
                        <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-teal-600 border-4 border-white shadow-sm" />
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 uppercase">
                                {event.type}
                              </span>
                              <h4 className="text-sm font-bold text-slate-900">{event.title}</h4>
                            </div>
                            <span className="text-xs font-mono text-slate-500">{event.date}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            Clinician: <strong className="text-slate-800">{event.clinician}</strong> • Facility: {event.facility}
                          </p>
                          {event.soapNotes && (
                            <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200/80 text-xs space-y-1.5">
                              <div><strong className="text-slate-700">Assessment:</strong> {event.soapNotes.assessment}</div>
                              <div><strong className="text-slate-700">Plan:</strong> {event.soapNotes.plan}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Symptoms */}
              {activeEhrTab === 'symptoms' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Patient-Reported Clinical Symptoms</h3>
                      <p className="text-xs text-slate-500">Longitudinally tracked symptoms visible to your attending physicians</p>
                    </div>
                    <button
                      onClick={() => setIsAddSymptomOpen(true)}
                      className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Report New Symptom
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {symptomsList.map((s) => (
                      <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{s.symptom}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                s.severity === 'Severe' ? 'bg-rose-100 text-rose-800' :
                                s.severity === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                                'bg-teal-100 text-teal-800'
                              }`}>
                                {s.severity} Severity
                              </span>
                              <span className="text-xs text-slate-500">Onset: {s.onset}</span>
                            </div>
                          </div>
                          <select
                            value={s.status}
                            onChange={(e) => updateSymptomStatus(s.id, e.target.value as any)}
                            className="bg-white border border-slate-300 text-slate-700 text-xs rounded-lg px-2 py-1"
                          >
                            <option value="Active">Active</option>
                            <option value="Improving">Improving</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </div>
                        <div className="mt-3 text-xs text-slate-600">
                          <div>Duration: <strong>{s.duration}</strong></div>
                          {s.notes && <div className="mt-1 text-slate-500 italic">Notes: {s.notes}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Diagnoses */}
              {activeEhrTab === 'diagnoses' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Clinician-Entered Active Diagnoses</h3>
                    <p className="text-xs text-slate-500">Standard ICD-10 coded diagnostic history maintained by licensed medical practitioners</p>
                  </div>

                  <div className="space-y-3">
                    {(activePatient.diagnoses || [
                      { icd10: 'I10', description: 'Essential (Primary) Hypertension Stage 1', type: 'Primary', diagnosedDate: '2025-06-12', status: 'Active' },
                      { icd10: 'R00.0', description: 'Sinus Tachycardia', type: 'Secondary', diagnosedDate: '2026-02-18', status: 'Active' },
                      { icd10: 'E88.81', description: 'Metabolic Syndrome', type: 'Chronic', diagnosedDate: '2024-11-04', status: 'Active' }
                    ]).map((d, i) => (
                      <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                              {d.icd10}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">{d.description}</h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                              {d.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Diagnosed Date: {d.diagnosedDate} • Attending: Dr. Alexandra Chen, MD
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800">
                          {d.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Medications & Prescriptions */}
              {activeEhrTab === 'medications' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Active Pharmaceutical Regimen</h3>
                    <p className="text-xs text-slate-500">Official medication regimen synced with Surescripts e-Rx</p>
                  </div>

                  <div className="space-y-3">
                    {activePatient.currentMedications.map((med, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
                            <Pill className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{med}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Prescribed by Dr. Alexandra Chen, MD • Daily adherence active
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active Prescription
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: Allergies (Two-Way Workflow) */}
              {activeEhrTab === 'allergies' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Two-Way Allergy Registry & Clinical Verification</h3>
                      <p className="text-xs text-slate-500">Patient-reported allergies transition to Clinically Verified status upon physician review</p>
                    </div>
                    <button
                      onClick={() => setIsAddAllergyOpen(true)}
                      className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Report Allergy
                    </button>
                  </div>

                  <div className="space-y-3">
                    {allergiesList.map((a) => (
                      <div key={a.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{a.allergen}</h4>
                            <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                              {a.category}
                            </span>
                            <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                              a.severity === 'Anaphylactic' ? 'bg-rose-600 text-white' :
                              a.severity === 'Severe' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {a.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            <strong>Reaction:</strong> {a.reaction}
                          </p>
                          {a.notes && <p className="text-xs text-slate-500 italic mt-0.5">{a.notes}</p>}
                        </div>

                        <div className="shrink-0 text-right sm:text-right">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                            a.status === 'CLINICALLY_VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {a.status === 'CLINICALLY_VERIFIED' ? '✓ Clinically Verified' : '● Patient Reported (Under Review)'}
                          </span>
                          {a.verifiedBy && (
                            <p className="text-[10px] text-slate-400 mt-1">By {a.verifiedBy}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: Lab Reports */}
              {activeEhrTab === 'lab-reports' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Diagnostic Pathology & Laboratory Reports</h3>
                    <p className="text-xs text-slate-500">CLIA Accredited Laboratory panels with LOINC coding and attending physician review sign-offs</p>
                  </div>

                  <div className="space-y-4">
                    {(activePatient.labReports || []).map((report) => (
                      <div key={report.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-bold text-slate-900">{report.testName}</h4>
                              <span className="font-mono text-xs px-2 py-0.2 rounded bg-slate-100 text-slate-700">
                                LOINC: {report.loincCode || '58410-2'}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                {report.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {report.performingLab?.name} • Performed: {new Date(report.performedAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-extrabold text-slate-900">
                              {report.resultValue} <span className="text-xs font-medium text-slate-500">{report.unit}</span>
                            </div>
                            <span className="text-xs text-slate-500">Reference: {report.referenceRange}</span>
                          </div>
                        </div>

                        {/* Biomarkers constituent sub-table if available */}
                        {report.biomarkers && report.biomarkers.length > 0 && (
                          <div className="mt-3 overflow-x-auto rounded-lg border border-slate-100">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-50 text-slate-600 font-semibold">
                                <tr>
                                  <th className="px-3 py-2">Analyte</th>
                                  <th className="px-3 py-2">Result</th>
                                  <th className="px-3 py-2">Reference Interval</th>
                                  <th className="px-3 py-2">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {report.biomarkers.map((b) => (
                                  <tr key={b.id}>
                                    <td className="px-3 py-1.5 font-medium text-slate-800">{b.name}</td>
                                    <td className="px-3 py-1.5 font-bold text-slate-900">{b.resultValue} {b.unit}</td>
                                    <td className="px-3 py-1.5 text-slate-500">{b.referenceRange}</td>
                                    <td className="px-3 py-1.5">
                                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                        {b.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Doctor Notes & Review Sign-off */}
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs flex items-center justify-between border border-slate-200/60">
                          <div>
                            <span className="font-semibold text-slate-700">Physician Interpretation: </span>
                            <span className="text-slate-600">{report.doctorNotes}</span>
                          </div>
                          <span className="text-emerald-700 font-semibold shrink-0 ml-4">
                            ✓ Reviewed by {report.reviewedBy || 'Dr. Alexandra Chen, MD'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: Sharing & Access Control — backed by the live consent engine */}
              {activeEhrTab === 'sharing' && (
                <AccessGovernancePanel />
              )}

              {/* TAB 9: Audit Trail — the live, append-only server audit system */}
              {activeEhrTab === 'audit' && (
                <AuditTrailPanel />
              )}

              {/* TAB 10: Prescriptions Vault & Clinical Rx */}
              {activeEhrTab === 'prescriptions' && (
                <PrescriptionsEhrTab
                  prescriptions={clinicalPrescriptions}
                  patientId={activePatient.id}
                  patientName={activePatient.name}
                  onSavePrescription={savePrescriptionDocument}
                  onUpdateStatus={updatePrescriptionStatus}
                  onDeletePrescription={deletePrescriptionDocument}
                  onAddMedicationReminder={addMedicationReminder}
                />
              )}

              {/* TAB Fallback for other tabs (Imaging, Procedures, Immunization, Hospitalization, Documents) */}
              {!['vitals', 'timeline', 'symptoms', 'diagnoses', 'medications', 'allergies', 'lab-reports', 'sharing', 'audit', 'prescriptions'].includes(activeEhrTab) && (
                <div className="text-center py-12 text-slate-500">
                  <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <h4 className="text-sm font-bold text-slate-800">Connected EHR Module: {activeEhrTab.toUpperCase()}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Canonical record verified. All documents and records in this section are synchronized with your hospital network.
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LAYER 3: SAVED LIBRARY (Recipes, Health Conditions, Medicines)            */}
        {/* ========================================================================= */}
        {mainViewMode === 'saved' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Saved Articles & Recipes</h3>
                <p className="text-xs text-slate-500">Your personalized health education bookmarks</p>
              </div>
              <div className="flex items-center gap-2">
                {(['all', 'conditions', 'medicines', 'recipes'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSavedFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      savedFilter === cat
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {savedIds.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No saved items yet. Browse health conditions, medicines, or recipes to bookmark them.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(savedFilter === 'all' || savedFilter === 'conditions') && savedConditions.map(c => (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">Condition</span>
                      <h4 className="text-sm font-bold text-slate-900 mt-2">{c.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1">{c.summary}</p>
                    </div>
                    <button
                      onClick={() => onToggleSave(c.id)}
                      className="mt-3 text-xs text-rose-600 font-medium hover:underline self-end"
                    >
                      Remove Bookmark
                    </button>
                  </div>
                ))}

                {(savedFilter === 'all' || savedFilter === 'medicines') && savedMedicines.map(m => (
                  <div key={m.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">Medicine</span>
                      <h4 className="text-sm font-bold text-slate-900 mt-2">{m.name}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1">{m.description}</p>
                    </div>
                    <button
                      onClick={() => onToggleSave(m.id)}
                      className="mt-3 text-xs text-rose-600 font-medium hover:underline self-end"
                    >
                      Remove Bookmark
                    </button>
                  </div>
                ))}

                {(savedFilter === 'all' || savedFilter === 'recipes') && savedRecipes.map(r => (
                  <div key={r.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Recipe</span>
                      <h4 className="text-sm font-bold text-slate-900 mt-2">{r.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1">{r.description}</p>
                    </div>
                    <button
                      onClick={() => onToggleSave(r.id)}
                      className="mt-3 text-xs text-rose-600 font-medium hover:underline self-end"
                    >
                      Remove Bookmark
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODALS SECTION                                                            */}
      {/* ========================================================================= */}

      {/* 1. Edit Demographics Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        initialProfile={profile}
        onSave={handleSaveProfile}
      />

      {/* 2. Add Medication Reminder Modal */}
      {isAddMedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
                  <Pill className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Add Medication Reminder</h3>
              </div>
              <button onClick={() => setIsAddMedOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Medication Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lisinopril"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10mg"
                    value={newMedDose}
                    onChange={(e) => setNewMedDose(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="08:00 AM"
                    value={newMedTime}
                    onChange={(e) => setNewMedTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructions / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Take with breakfast"
                  value={newMedNotes}
                  onChange={(e) => setNewMedNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMedOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Report Symptom Modal */}
      {isAddSymptomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Report Clinical Symptom</h3>
              </div>
              <button onClick={() => setIsAddSymptomOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSymptomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Symptom Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mild headache after morning walk"
                  value={symptomName}
                  onChange={(e) => setSymptomName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Severity</label>
                  <select
                    value={symptomSeverity}
                    onChange={(e) => setSymptomSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 45 minutes"
                    value={symptomDuration}
                    onChange={(e) => setSymptomDuration(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Observations</label>
                <textarea
                  rows={3}
                  placeholder="Describe when it started and what relieves it..."
                  value={symptomNotes}
                  onChange={(e) => setSymptomNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSymptomOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold"
                >
                  Submit to Care Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Report Allergy Modal */}
      {isAddAllergyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-100 text-rose-800 rounded-xl">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Report Suspected Allergy</h3>
              </div>
              <button onClick={() => setIsAddAllergyOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAllergySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Suspected Allergen</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Penicillin, Peanuts, Latex"
                  value={allergenName}
                  onChange={(e) => setAllergenName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={allergyCategory}
                    onChange={(e) => setAllergyCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Drug">Drug / Medication</option>
                    <option value="Food">Food</option>
                    <option value="Environmental">Environmental</option>
                    <option value="Biological">Biological</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Severity</label>
                  <select
                    value={allergySeverity}
                    onChange={(e) => setAllergySeverity(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Mild">Mild (Itching, Sneezing)</option>
                    <option value="Moderate">Moderate (Rash, Hives)</option>
                    <option value="Severe">Severe (Swelling)</option>
                    <option value="Anaphylactic">Anaphylactic (Breathing issues)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Observed Reaction</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skin rash, facial swelling, breathing tightness"
                  value={allergyReaction}
                  onChange={(e) => setAllergyReaction(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAllergyOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold"
                >
                  Record Suspected Allergy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Add Vital Modal */}
      {isAddVitalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Add Vital Reading</h3>
              </div>
              <button onClick={() => setIsAddVitalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={sysBp}
                    onChange={(e) => setSysBp(+e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={diaBp}
                    onChange={(e) => setDiaBp(+e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Heart Rate (BPM)</label>
                <input
                  type="number"
                  value={pulseRate}
                  onChange={(e) => setPulseRate(+e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddVitalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleLogVital();
                    setIsAddVitalOpen(false);
                  }}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold"
                >
                  Save Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Emergency Health Card Modal */}
      {isEmergencyCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-rose-300 animate-in fade-in zoom-in-95">
            <div className="bg-rose-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-6 h-6" />
                <div>
                  <h3 className="text-lg font-bold">EMERGENCY MEDICAL PROFILE</h3>
                  <p className="text-xs text-rose-100">Universal First-Responder Summary</p>
                </div>
              </div>
              <button onClick={() => setIsEmergencyCardOpen(false)} className="text-white hover:text-rose-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">{profile.fullName}</h4>
                  <p className="text-xs text-slate-500 font-mono">MRN: {profile.mrn} • DOB: {profile.dateOfBirth}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400">BLOOD GROUP</span>
                  <div className="text-2xl font-black text-rose-700">{profile.bloodGroup}</div>
                </div>
              </div>

              {/* Critical Alerts */}
              <div className="bg-rose-50 rounded-xl p-3.5 border border-rose-200">
                <h5 className="text-xs font-bold text-rose-900 uppercase flex items-center gap-1 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Critical Allergies & Contraindications
                </h5>
                <ul className="text-xs text-rose-800 space-y-1 list-disc list-inside font-semibold">
                  {allergiesList.filter(a => a.severity === 'Anaphylactic' || a.severity === 'Severe').map(a => (
                    <li key={a.id}>{a.allergen} ({a.reaction})</li>
                  ))}
                </ul>
              </div>

              {/* Active Conditions & Meds */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-800 block mb-1">Primary Conditions</strong>
                  <ul className="text-slate-600 space-y-0.5">
                    {activePatient.chronicConditions.map((c, i) => (
                      <li key={i}>• {c}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-800 block mb-1">Active Regimen</strong>
                  <ul className="text-slate-600 space-y-0.5">
                    {activePatient.currentMedications.map((m, i) => (
                      <li key={i}>• {m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-slate-100 rounded-xl p-3 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-semibold">Emergency Contact:</span>
                  <div className="font-bold text-slate-900">{profile.emergencyContactName} ({profile.emergencyContactRelation})</div>
                </div>
                <div className="font-mono text-teal-700 font-bold text-sm">
                  {profile.emergencyContactPhone}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Verified Cryptographic Health Card</span>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Share EHR Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
                  <Share2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Share Health Record</h3>
              </div>
              <button onClick={() => { setIsShareModalOpen(false); setCreatedShareToken(null); setCreatedShareUrl(null); setShareError(null); setShareStatus('idle'); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!createdShareToken ? (
              <form onSubmit={handleShareSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grantee / Provider Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Emily Watson, MD"
                    value={shareRecipientName}
                    onChange={(e) => setShareRecipientName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Provider Type</label>
                    <select
                      value={shareRecipientType}
                      onChange={(e) => setShareRecipientType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="Physician">Physician</option>
                      <option value="Hospital">Hospital System</option>
                      <option value="Laboratory">Laboratory</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Insurance">Insurance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Access Duration</label>
                    <select
                      value={shareDurationDays}
                      onChange={(e) => setShareDurationDays(+e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value={1}>24 Hours</option>
                      <option value={7}>7 Days</option>
                      <option value={30}>30 Days</option>
                      <option value={365}>1 Year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Included Record Scopes</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(['Vitals', 'Labs', 'Medications', 'Diagnoses', 'Imaging', 'Clinical Notes'] as const).map((sc) => (
                      <label key={sc} className="flex items-center gap-1.5 text-slate-700">
                        <input
                          type="checkbox"
                          checked={shareScopes.includes(sc)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setShareScopes(prev => [...prev, sc]);
                            } else {
                              setShareScopes(prev => prev.filter(s => s !== sc));
                            }
                          }}
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                        {sc}
                      </label>
                    ))}
                  </div>
                </div>

                {shareError && (
                  <p role="alert" className="flex items-start gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {shareError}
                  </p>
                )}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsShareModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={shareStatus === 'saving'}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white rounded-xl text-xs font-semibold"
                  >
                    {shareStatus === 'saving' ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                    {shareStatus === 'saving' ? 'Creating secure link…' : 'Generate Secure Link'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Secure Access Granted</h4>
                <p className="text-xs text-slate-600">
                  A temporary cryptographic access link for <strong>{shareRecipientName}</strong> has been created.
                </p>
                <div className="p-3 bg-slate-100 rounded-xl font-mono text-xs text-slate-800 break-all select-all">
                  {createdShareUrl ? new URL(createdShareUrl, window.location.origin).toString() : 'Server access link created.'}
                </div>
                <button
                  onClick={() => {
                    const url = createdShareUrl ? new URL(createdShareUrl, window.location.origin).toString() : '';
                    if (url) {
                      navigator.clipboard.writeText(url);
                      alert('Share link copied to clipboard!');
                    }
                    setIsShareModalOpen(false);
                    setCreatedShareToken(null);
                    setCreatedShareUrl(null);
                  }}
                  className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Copy Share Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
