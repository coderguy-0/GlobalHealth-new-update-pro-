import React, { useState } from 'react';
import {
  Search,
  Shield,
  Lock,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Users,
  FlaskConical,
  Pill,
  Menu,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  Activity,
  FileText,
  Server,
  Sparkles
} from 'lucide-react';
import {
  DoctorProfile,
  PatientRecord,
  ClinicalTimelineEvent,
  VitalsDataPoint,
  LabReportItem,
  AppointmentItem
} from '../../types/medauth';
import { initialDoctors } from '../../data/sampleDoctors';
import { usePatientEhr } from '../../context/PatientEhrContext';
import { DoctorPortalSidebar, DoctorPortalTab } from './DoctorPortalSidebar';
import { PatientsAndAppointmentsHub } from './PatientsAndAppointmentsHub';
import { EhrPatientProfile } from './EhrPatientProfile';
import { EPrescriptionBuilder } from './EPrescriptionBuilder';
import { VitalsTrendsView } from './VitalsTrendsView';
import { LabReportsView } from './LabReportsView';
import { ReferralManager } from './ReferralManager';
import { ClinicalConsultationView } from './ClinicalConsultationView';
import { TelemedicineSuiteView } from './TelemedicineSuiteView';
import { MessagesCommView } from './MessagesCommView';
import { BillingEarningsView } from './BillingEarningsView';
import { AiClinicalAssistantView } from './AiClinicalAssistantView';
import { ScheduleAvailabilityView } from './ScheduleAvailabilityView';
import { NotificationsView } from './NotificationsView';
import { SecurityAuditLogsView } from './SecurityAuditLogsView';
import { ProfessionalProfileView } from './ProfessionalProfileView';
import { SettingsView } from './SettingsView';
import { DoctorVerificationModal } from './modals/DoctorVerificationModal';
import { ConnectedSystemsModal } from './modals/ConnectedSystemsModal';
import { LockSessionModal } from './modals/LockSessionModal';
import { UniversalSearchModal } from './modals/UniversalSearchModal';

interface ProfessionalDashboardProps {
  doctor: DoctorProfile;
  allDoctors: DoctorProfile[];
  onUpdateDoctor?: (doc: DoctorProfile) => void;
  onLockSession: () => void;
}

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({
  doctor,
  allDoctors,
  onUpdateDoctor,
  onLockSession
}) => {
  const {
    patients,
    activePatientId,
    setActivePatientId,
    activePatient,
    appointments,
    addTimelineSoapEvent,
    addVitalReading,
    addLabReport,
    reviewLabReport,
    updatePatientRecord
  } = usePatientEhr();

  const [activeTab, setActiveTab] = useState<DoctorPortalTab>('hub'); // Start on Patients & Appointments Hub
  const [copiedToken, setCopiedToken] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Modals state
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isConnectedSystemsModalOpen, setIsConnectedSystemsModalOpen] = useState(false);
  const [isLockSessionModalOpen, setIsLockSessionModalOpen] = useState(false);
  const [isUniversalSearchOpen, setIsUniversalSearchOpen] = useState(false);

  // Copy integration token handler
  const handleCopyToken = () => {
    navigator.clipboard.writeText(doctor.integrationToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Add new clinical timeline SOAP note
  const handleAddTimelineNote = (note: ClinicalTimelineEvent) => {
    addTimelineSoapEvent(note);
  };

  // Add new vitals point
  const handleAddVitalsPoint = (point: VitalsDataPoint) => {
    addVitalReading({
      sys: point.systolic,
      dia: point.diastolic,
      pulse: point.heartRate,
      spo2: point.spo2,
      source: 'CLINICIAN_ENTERED',
      recordedBy: doctor.fullName
    });
  };

  // Add new lab report
  const handleAddLabReport = (report: LabReportItem) => {
    addLabReport(report);
  };

  // Update existing lab report (e.g. note or review status)
  const handleUpdateLabReport = (report: LabReportItem) => {
    reviewLabReport(report.id, doctor.fullName, report.doctorNotes);
  };

  // Start consult from hub or appointment
  const handleStartConsult = (patient: PatientRecord, apt?: AppointmentItem) => {
    setActivePatientId(patient.id);
    if (apt?.type.includes('Telemedicine')) {
      setActiveTab('telemedicine');
    } else {
      setActiveTab('consult');
    }
  };

  // View EHR from hub
  const handleViewEhr = (patient: PatientRecord) => {
    setActivePatientId(patient.id);
    setActiveTab('ehr');
  };

  const getTabBreadcrumb = () => {
    switch (activeTab) {
      case 'hub':
        return 'Patients & Appointments';
      case 'ehr':
        return 'Patient Profile (EHR)';
      case 'consult':
        return 'Clinical Consultation';
      case 'rx':
        return 'e-Prescriptions';
      case 'labs':
        return 'Lab Reports';
      case 'vitals':
        return 'Vitals & Trends';
      case 'referrals':
        return 'Referrals';
      case 'messages':
        return 'Messages & Comm';
      case 'telemedicine':
        return 'Telemedicine Suite';
      case 'profile':
        return 'Professional Profile';
      case 'billing':
        return 'Billing & Earnings';
      case 'ai':
        return 'AI Clinical Assistant';
      case 'schedule':
        return 'Schedule & Availability';
      case 'notifications':
        return 'Notifications';
      case 'security':
        return 'Security & Audit Logs';
      case 'settings':
        return 'Settings';
      default:
        return 'Doctor Workspace';
    }
  };

  // Count unreviewed reports across active patient
  const pendingLabsCount = (activePatient.labReports || []).filter(
    (r) => r.reviewStatus !== 'REVIEWED'
  ).length;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      
      {/* 1. Left Sidebar Navigation */}
      <DoctorPortalSidebar
        doctor={doctor}
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        onLockSession={() => setIsLockSessionModalOpen(true)}
        onOpenVerification={() => setIsVerificationModalOpen(true)}
        onOpenConnectedSystems={() => setIsConnectedSystemsModalOpen(true)}
        patientCount={patients.length}
        unreadNotificationsCount={2}
        unreadMessagesCount={2}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Scrollable Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Application Bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-4 shadow-2xs">
          
          {/* Left Title & Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium font-mono">
                <span>Doctor Portal</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-900 font-bold">{getTabBreadcrumb()}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <h1 className="text-base sm:text-lg font-black text-slate-900 truncate">
                  {getTabBreadcrumb()}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                  {doctor.speciality}
                </span>
              </div>
            </div>
          </div>

          {/* Right Search, Badge ID & Lock Session */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Global Search Bar */}
            <div
              onClick={() => setIsUniversalSearchOpen(true)}
              className="relative hidden md:flex items-center w-52 lg:w-72 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-400 cursor-pointer transition"
            >
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <span className="truncate">Search EHR, Patients, MRN...</span>
              <kbd className="hidden lg:inline-block ml-auto text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">
                ⌘K
              </kbd>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => setIsUniversalSearchOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Badge ID Button */}
            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold font-mono transition shadow-2xs cursor-pointer"
              title="Click to view verified credential token"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Badge ID:</span>
              <span>{doctor.verificationBadgeId}</span>
            </button>

            {/* Lock Session Button */}
            <button
              onClick={() => setIsLockSessionModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
              title="Lock Practitioner Session"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Lock Session</span>
            </button>
          </div>
        </header>

        {/* Inner Content Container */}
        <main className="p-4 sm:p-6 lg:p-7 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Welcome Doctor Context Banner */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-4">
              <div
                onClick={() => setIsVerificationModalOpen(true)}
                className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer hover:scale-105 transition-transform"
                title="View Doctor Credentials"
              >
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Good Day, {doctor.fullName}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  {appointments.length} Scheduled Appointments • {patients.length} Registered Patients • {pendingLabsCount} Reports to Review
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                onClick={() => setIsConnectedSystemsModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl transition shadow-2xs cursor-pointer"
              >
                <Server className="w-3.5 h-3.5 text-emerald-700" />
                <span>Integration</span>
              </button>

              <button
                onClick={handleCopyToken}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-2xs cursor-pointer"
              >
                {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedToken ? 'Token Copied!' : 'Copy Integration Token'}</span>
              </button>
            </div>
          </div>

          {/* 4 Interactive KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1: Scheduled Appointments */}
            <div
              onClick={() => setActiveTab('hub')}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                  Appointments
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {appointments.length}
              </div>
              <p className="text-[11px] text-emerald-700 font-bold">
                Today &amp; Upcoming Queue
              </p>
            </div>

            {/* KPI 2: Registered Patients */}
            <div
              onClick={() => setActiveTab('hub')}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                  Registered Patients
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {patients.length} <span className="text-xs font-normal text-slate-500 font-sans">Patients</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-bold">
                Active EHR Records
              </p>
            </div>

            {/* KPI 3: Lab Reports Review */}
            <div
              onClick={() => setActiveTab('labs')}
              className={`rounded-3xl border p-5 shadow-xs hover:shadow-md transition cursor-pointer space-y-2 group ${
                activeTab === 'labs'
                  ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/20'
                  : 'bg-white border-slate-200 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                  Lab Reports Review
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FlaskConical className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {pendingLabsCount} <span className="text-xs font-normal text-slate-500 font-sans">Reports</span>
              </div>
              <p className="text-[11px] text-amber-800 font-bold">
                1 Abnormal Result Flagged
              </p>
            </div>

            {/* KPI 4: e-Prescriptions Pending */}
            <div
              onClick={() => setActiveTab('rx')}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-purple-500 hover:shadow-md transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                  e-Prescriptions
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Pill className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                4 <span className="text-xs font-normal text-slate-500 font-sans">RX Orders</span>
              </div>
              <p className="text-[11px] text-purple-700 font-bold">
                Awaiting Digital Sign
              </p>
            </div>
          </div>

          {/* Dynamic Active Clinical Module */}
          <div className="pt-2">
            {activeTab === 'labs' && (
              <LabReportsView
                patient={activePatient}
                allPatients={patients}
                doctor={doctor}
                onAddLabReport={handleAddLabReport}
                onUpdateLabReport={handleUpdateLabReport}
                onSelectPatient={(pid) => setActivePatientId(pid)}
                onNavigateTab={(tab) => setActiveTab(tab as any)}
              />
            )}

            {activeTab === 'hub' && (
              <PatientsAndAppointmentsHub
                doctor={doctor}
                patients={patients}
                appointments={appointments}
                onSelectPatient={(p) => setActivePatientId(p.id)}
                onStartConsult={handleStartConsult}
                onViewEhr={handleViewEhr}
              />
            )}

            {activeTab === 'ehr' && (
              <EhrPatientProfile
                patient={activePatient}
                allPatients={patients}
                onSelectPatient={(p) => setActivePatientId(p.id)}
                onStartConsult={(p) => handleStartConsult(p)}
                onIssuePrescription={(p) => {
                  setActivePatientId(p.id);
                  setActiveTab('rx');
                }}
                onViewVitalsChart={() => setActiveTab('vitals')}
                onViewLabReports={() => setActiveTab('labs')}
                onAddTimelineNote={handleAddTimelineNote}
                onUpdatePatient={(updated) => {
                  updatePatientRecord(updated);
                }}
              />
            )}

            {activeTab === 'consult' && (
              <ClinicalConsultationView
                patient={activePatient}
                doctor={doctor}
                onSaveNote={handleAddTimelineNote}
                onOpenPrescriptionBuilder={() => setActiveTab('rx')}
              />
            )}

            {activeTab === 'rx' && (
              <EPrescriptionBuilder
                patient={activePatient}
                doctor={doctor}
              />
            )}

            {activeTab === 'vitals' && (
              <VitalsTrendsView
                patient={activePatient}
                onAddVitalsPoint={handleAddVitalsPoint}
              />
            )}

            {activeTab === 'referrals' && (
              <ReferralManager
                patient={activePatient}
                doctor={doctor}
              />
            )}

            {activeTab === 'messages' && (
              <MessagesCommView
                doctor={doctor}
              />
            )}

            {activeTab === 'telemedicine' && (
              <TelemedicineSuiteView
                patient={activePatient}
                doctor={doctor}
                onOpenRx={() => setActiveTab('rx')}
                onOpenConsultNotes={() => setActiveTab('consult')}
              />
            )}

            {activeTab === 'profile' && (
              <ProfessionalProfileView
                doctor={doctor}
              />
            )}

            {activeTab === 'billing' && (
              <BillingEarningsView
                doctor={doctor}
              />
            )}

            {activeTab === 'ai' && (
              <AiClinicalAssistantView
                doctor={doctor}
                activePatient={activePatient}
              />
            )}

            {activeTab === 'schedule' && (
              <ScheduleAvailabilityView
                doctor={doctor}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationsView
                doctor={doctor}
              />
            )}

            {activeTab === 'security' && (
              <SecurityAuditLogsView
                doctor={doctor}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                doctor={doctor}
                onUpdateDoctor={onUpdateDoctor}
              />
            )}
          </div>
        </main>
      </div>

      {/* Doctor Professional Verification Modal */}
      <DoctorVerificationModal
        doctor={doctor}
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />

      {/* Connected Systems & Integrations Modal */}
      <ConnectedSystemsModal
        doctor={doctor}
        isOpen={isConnectedSystemsModalOpen}
        onClose={() => setIsConnectedSystemsModalOpen(false)}
      />

      {/* Lock Session Screen Modal */}
      <LockSessionModal
        doctor={doctor}
        isOpen={isLockSessionModalOpen}
        onUnlock={() => setIsLockSessionModalOpen(false)}
        onFullLogout={() => {
          setIsLockSessionModalOpen(false);
          onLockSession();
        }}
      />

      {/* Universal Search Modal */}
      <UniversalSearchModal
        isOpen={isUniversalSearchOpen}
        onClose={() => setIsUniversalSearchOpen(false)}
        patients={patients}
        appointments={appointments}
        onSelectPatient={(pid, targetTab = 'ehr') => {
          setActivePatientId(pid);
          setActiveTab(targetTab as DoctorPortalTab);
        }}
        onSelectLabReport={(pid) => {
          setActivePatientId(pid);
          setActiveTab('labs');
        }}
      />

    </div>
  );
};
