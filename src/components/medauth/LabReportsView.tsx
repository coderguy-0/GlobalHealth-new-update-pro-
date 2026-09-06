import React, { useState, useMemo } from 'react';
import {
  FlaskConical,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Filter,
  FileText,
  Calendar,
  Layers,
  Search,
  Printer,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ChevronRight,
  Eye,
  Check,
  Edit3,
  ExternalLink,
  Users,
  ShieldCheck,
  Building2,
  Clock,
  MoreVertical,
  Pill,
  Share2,
  MessageSquare
} from 'lucide-react';
import { LabReportItem, PatientRecord, DoctorProfile } from '../../types/medauth';
import { LabPanelDetailModal } from './modals/LabPanelDetailModal';
import { LabTrendModal } from './modals/LabTrendModal';
import { LabIntakeModal } from './modals/LabIntakeModal';
import { LabReportPrintModal } from './modals/LabReportPrintModal';

interface LabReportsViewProps {
  patient: PatientRecord;
  allPatients?: PatientRecord[];
  doctor?: DoctorProfile;
  onAddLabReport?: (report: LabReportItem) => void;
  onUpdateLabReport?: (report: LabReportItem) => void;
  onSelectPatient?: (patientId: string) => void;
  onNavigateTab?: (tab: 'ehr' | 'consult' | 'rx' | 'referrals' | 'messages') => void;
}

export const LabReportsView: React.FC<LabReportsViewProps> = ({
  patient,
  allPatients = [patient],
  doctor = {
    id: 'doc-alexandra-chen',
    fullName: 'Dr. Alexandra Chen, MD',
    post: 'Chief of Interventional Cardiology',
    npiNumber: '1982736410',
    medicalCouncilNumber: 'MB-CA-948271',
    licenseNumber: 'C158942-CA',
    speciality: 'Interventional Cardiology',
    hospitalAffiliation: 'Johns Hopkins Hospital & Heart Institute',
    email: 'a.chen@medauth.org',
    phone: '+1 (410) 555-0194',
    yearsOfPractice: 14,
    boardCertifications: ['ABIM Internal Medicine', 'ABIM Cardiovascular Disease'],
    status: 'VERIFIED',
    confidenceScore: 99,
    verifiedAt: '2026-01-15T08:30:00Z',
    verificationBadgeId: 'MEDAUTH-88231-CHEN',
    aiAuditSummary: 'Verified against Medical Board of California & NPI Registry.',
    mismatches: [],
    securityHash: 'sha256_active',
    integrationToken: 'mat_live_token',
    embeddedViewsCount: 1420,
    lastVerifiedCheck: '2026-08-20T08:00:00Z'
  },
  onAddLabReport,
  onUpdateLabReport,
  onSelectPatient,
  onNavigateTab
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ABNORMAL' | 'PENDING_REVIEW' | 'NORMAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [labReports, setLabReports] = useState<LabReportItem[]>(patient.labReports || []);

  // Modals state
  const [activeDetailReport, setActiveDetailReport] = useState<LabReportItem | null>(null);
  const [activeTrendReport, setActiveTrendReport] = useState<LabReportItem | null>(null);
  const [activePrintReport, setActivePrintReport] = useState<LabReportItem | null>(null);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [quickReviewMode, setQuickReviewMode] = useState(false);
  const [reviewQueueIndex, setReviewQueueIndex] = useState(0);

  // Sync state if patient changes
  React.useEffect(() => {
    setLabReports(patient.labReports || []);
  }, [patient]);

  const categories = [
    'All',
    'Metabolic',
    'Lipid',
    'Cardiology',
    'Hematology',
    'Urinalysis',
    'Endocrine',
    'Renal'
  ];

  // Derived filtered reports
  const filteredReports = useMemo(() => {
    return labReports.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (statusFilter === 'ABNORMAL' && item.status === 'NORMAL') {
        return false;
      }
      if (statusFilter === 'PENDING_REVIEW' && item.reviewStatus === 'REVIEWED') {
        return false;
      }
      if (statusFilter === 'NORMAL' && item.status !== 'NORMAL') {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.testName.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        const matchesNotes = item.doctorNotes.toLowerCase().includes(q);
        const matchesBiomarkers = (item.biomarkers || []).some((bm) =>
          bm.name.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesCat && !matchesNotes && !matchesBiomarkers) {
          return false;
        }
      }
      return true;
    });
  }, [labReports, selectedCategory, statusFilter, searchQuery]);

  // Operational metrics
  const totalVerified = labReports.length;
  const pendingReviewList = labReports.filter((r) => r.reviewStatus !== 'REVIEWED');
  const pendingReviewCount = pendingReviewList.length;
  const abnormalCount = labReports.filter((r) => r.status !== 'NORMAL').length;
  const criticalCount = labReports.filter((r) => r.status === 'CRITICAL').length;

  // Handlers
  const handleAddReport = (newReport: LabReportItem) => {
    const updated = [newReport, ...labReports];
    setLabReports(updated);
    if (onAddLabReport) {
      onAddLabReport(newReport);
    }
  };

  const handleMarkReviewed = (reportId: string) => {
    const updated = labReports.map((r) => {
      if (r.id === reportId) {
        const isAlreadyReviewed = r.reviewStatus === 'REVIEWED';
        const newStatus = isAlreadyReviewed ? 'PENDING_REVIEW' : ('REVIEWED' as const);
        const updatedItem: LabReportItem = {
          ...r,
          reviewStatus: newStatus,
          reviewedBy: isAlreadyReviewed ? undefined : doctor.fullName,
          reviewedAt: isAlreadyReviewed ? undefined : new Date().toISOString()
        };
        if (onUpdateLabReport) onUpdateLabReport(updatedItem);
        return updatedItem;
      }
      return r;
    });
    setLabReports(updated);

    if (activeDetailReport && activeDetailReport.id === reportId) {
      const match = updated.find((r) => r.id === reportId);
      if (match) setActiveDetailReport(match);
    }
  };

  const handleUpdateNote = (reportId: string, newNote: string) => {
    const updated = labReports.map((r) => {
      if (r.id === reportId) {
        const updatedItem: LabReportItem = {
          ...r,
          doctorNotes: newNote,
          physicianNoteAuthor: doctor.fullName,
          physicianNoteTimestamp: new Date().toISOString()
        };
        if (onUpdateLabReport) onUpdateLabReport(updatedItem);
        return updatedItem;
      }
      return r;
    });
    setLabReports(updated);

    if (activeDetailReport && activeDetailReport.id === reportId) {
      const match = updated.find((r) => r.id === reportId);
      if (match) setActiveDetailReport(match);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Main Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs uppercase tracking-wider">
            <FlaskConical className="w-4 h-4" />
            <span>Pathology &amp; Diagnostic Diagnostics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Laboratory Panels &amp; Biomarker Metrics
          </h2>
          <p className="text-xs text-slate-600">
            Attending Physician: <strong className="text-slate-900">{doctor.fullName}</strong> • NPI: {doctor.npiNumber}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setQuickReviewMode(!quickReviewMode)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
              quickReviewMode
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Review Queue ({pendingReviewCount})</span>
          </button>

          <button
            onClick={() => setIsIntakeModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Upload / Log Lab Report</span>
          </button>
        </div>
      </div>

      {/* 2. Patient Context Safety Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <Users className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Active Patient Context
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-full">
                MRN: {patient.mrn}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {allPatients.length > 1 && onSelectPatient ? (
                <select
                  value={patient.id}
                  onChange={(e) => onSelectPatient(e.target.value)}
                  className="text-lg sm:text-xl font-black text-white bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {allPatients.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.name} ({p.mrn}) — Age {p.age}
                    </option>
                  ))}
                </select>
              ) : (
                <h3 className="text-lg sm:text-xl font-black text-white">{patient.name}</h3>
              )}
            </div>

            <p className="text-xs text-slate-300">
              Age {patient.age} • {patient.gender} • Blood Group: <strong className="text-white">{patient.bloodGroup}</strong> • Primary: {patient.primaryCondition}
            </p>
          </div>
        </div>

        {/* Safety Metrics & Fast Jumps */}
        <div className="flex flex-wrap items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-700">
            <span className="text-xs font-mono font-bold text-emerald-400">{totalVerified}</span>
            <span className="text-[11px] text-slate-300">Verified Panels</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-700">
            <span className="text-xs font-mono font-bold text-amber-400">{abnormalCount}</span>
            <span className="text-[11px] text-slate-300">Abnormal</span>
          </div>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('ehr')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>View Full EHR</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Review Queue Interactive Drawer Mode */}
      {quickReviewMode && pendingReviewList.length > 0 && (
        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase tracking-tight">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>
                Rapid Review Queue ({reviewQueueIndex + 1} of {pendingReviewList.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setReviewQueueIndex((prev) => Math.max(0, prev - 1))}
                disabled={reviewQueueIndex === 0}
                className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-xs font-bold text-slate-700 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => setReviewQueueIndex((prev) => Math.min(pendingReviewList.length - 1, prev + 1))}
                disabled={reviewQueueIndex >= pendingReviewList.length - 1}
                className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-xs font-bold text-slate-700 disabled:opacity-40 cursor-pointer"
              >
                Next Report
              </button>
            </div>
          </div>

          {pendingReviewList[reviewQueueIndex] && (
            <div className="bg-white rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {pendingReviewList[reviewQueueIndex].category}
                  </span>
                  <strong className="text-sm font-bold text-slate-900">
                    {pendingReviewList[reviewQueueIndex].testName}
                  </strong>
                </div>
                <div className="text-xs text-slate-600">
                  Measured: <strong className="text-slate-900 font-mono">{pendingReviewList[reviewQueueIndex].resultValue} {pendingReviewList[reviewQueueIndex].unit}</strong> • Ref: {pendingReviewList[reviewQueueIndex].referenceRange} {pendingReviewList[reviewQueueIndex].unit}
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  &ldquo;{pendingReviewList[reviewQueueIndex].doctorNotes}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveDetailReport(pendingReviewList[reviewQueueIndex])}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleMarkReviewed(pendingReviewList[reviewQueueIndex].id)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-2xs cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark as Reviewed ✓</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. AI Clinical Assistant Laboratory Insights Banner */}
      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-3xl p-5 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-extrabold uppercase tracking-tight text-emerald-950">
              AI Clinical Biomarker Correlation
            </h4>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full">
              4 Panels Synthesized
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Patient exhibits upward 3-month trajectory in Fasting LDL (<span className="font-mono font-bold text-slate-900">108 → 115 → 124 mg/dL</span>) with concurrent normal CBC indices and preserved glomerular filtration (<span className="font-mono font-bold text-slate-900">eGFR &gt; 90 mL/min</span>). Consider initiating dietary titration or low-dose statin therapy (Atorvastatin 10mg) with repeat fasting panel in 8 weeks.
          </p>
        </div>
      </div>

      {/* 5. Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search and Status Dropdowns */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search test, biomarker..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 w-44 sm:w-56"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ABNORMAL">Abnormal Only</option>
            <option value="PENDING_REVIEW">Needs Review</option>
            <option value="NORMAL">Normal Only</option>
          </select>
        </div>
      </div>

      {/* 6. Diagnostic Cards Grid */}
      {filteredReports.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <FlaskConical className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-800">No laboratory reports matching criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your category tabs or search query, or upload a new laboratory panel.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setStatusFilter('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReports.map((report) => {
            const isAbnormal = report.status !== 'NORMAL';
            const isReviewed = report.reviewStatus === 'REVIEWED';

            return (
              <div
                key={report.id}
                className={`p-6 rounded-3xl border transition shadow-xs flex flex-col justify-between space-y-4 ${
                  report.status === 'CRITICAL'
                    ? 'bg-rose-50/60 border-rose-300'
                    : isAbnormal
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  
                  {/* Top Metadata Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                          {report.category}
                        </span>
                        {report.loincCode && (
                          <span className="text-[10px] font-mono text-slate-400">
                            • LOINC: {report.loincCode}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug mt-0.5">
                        {report.testName}
                      </h3>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-[10px] font-bold font-mono px-3 py-1 rounded-full ${
                          report.status === 'NORMAL'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : report.status === 'CRITICAL'
                            ? 'bg-rose-600 text-white font-bold animate-pulse'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {report.status}
                      </span>

                      <span className="text-[10px] text-slate-400 font-mono">
                        {isReviewed ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                            <Check className="w-3 h-3" />
                            <span>Reviewed</span>
                          </span>
                        ) : (
                          <span className="text-amber-700 font-semibold">
                            Pending Review
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Quantitative Measurement Visual Box */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-tight">
                        Measured Result
                      </span>
                      <div className="text-2xl font-black font-mono text-slate-900 mt-0.5">
                        {report.resultValue}{' '}
                        <span className="text-xs font-semibold text-slate-500">{report.unit}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-tight">
                        Reference Interval
                      </span>
                      <div className="text-xs font-mono font-bold text-slate-700 mt-0.5">
                        {report.referenceRange} {report.unit}
                      </div>
                    </div>
                  </div>

                  {/* Longitudinal 3-Point Trend Preview (If present) */}
                  {report.historicalTrends && report.historicalTrends.length > 0 && (
                    <div
                      onClick={() => setActiveTrendReport(report)}
                      className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-between hover:bg-slate-100 transition cursor-pointer"
                      title="Click to expand historical trend chart"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-bold text-slate-700">3-Month Trend:</span>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
                          {report.historicalTrends.map((t, idx) => (
                            <React.Fragment key={idx}>
                              <span className={idx === report.historicalTrends!.length - 1 ? 'font-bold text-slate-900' : ''}>
                                {t.displayValue}
                              </span>
                              {idx < report.historicalTrends!.length - 1 && <span className="text-slate-400">→</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  )}

                  {/* Dedicated Physician Note Box */}
                  <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-800 text-[10px] uppercase tracking-wider font-extrabold flex items-center gap-1">
                        <FileText className="w-3 h-3 text-emerald-600" />
                        <span>Physician Note:</span>
                      </strong>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {report.physicianNoteAuthor || 'Dr. Alexandra Chen'}
                      </span>
                    </div>
                    <p className="mt-0.5 leading-relaxed text-slate-600 font-medium">
                      {report.doctorNotes}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveDetailReport(report)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Panel</span>
                    </button>

                    <button
                      onClick={() => handleMarkReviewed(report.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs ${
                        isReviewed
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isReviewed ? 'Reviewed' : 'Review'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActivePrintReport(report)}
                      title="Print Clinical Sheet"
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    {onNavigateTab && (
                      <button
                        onClick={() => onNavigateTab('rx')}
                        title="Prescribe Rx for finding"
                        className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition cursor-pointer"
                      >
                        <Pill className="w-3.5 h-3.5 text-purple-600" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {activeDetailReport && (
        <LabPanelDetailModal
          report={activeDetailReport}
          patient={patient}
          isOpen={!!activeDetailReport}
          onClose={() => setActiveDetailReport(null)}
          onMarkReviewed={handleMarkReviewed}
          onUpdateNote={handleUpdateNote}
          onOpenTrend={(rep) => {
            setActiveDetailReport(null);
            setActiveTrendReport(rep);
          }}
          onPrint={(rep) => {
            setActiveDetailReport(null);
            setActivePrintReport(rep);
          }}
        />
      )}

      {/* Trend Modal */}
      {activeTrendReport && (
        <LabTrendModal
          report={activeTrendReport}
          patient={patient}
          isOpen={!!activeTrendReport}
          onClose={() => setActiveTrendReport(null)}
        />
      )}

      {/* Intake & Upload Modal */}
      {isIntakeModalOpen && (
        <LabIntakeModal
          patient={patient}
          allPatients={allPatients}
          isOpen={isIntakeModalOpen}
          onClose={() => setIsIntakeModalOpen(false)}
          onSubmit={handleAddReport}
        />
      )}

      {/* Printable Sheet Modal */}
      {activePrintReport && (
        <LabReportPrintModal
          report={activePrintReport}
          patient={patient}
          doctor={doctor}
          isOpen={!!activePrintReport}
          onClose={() => setActivePrintReport(null)}
        />
      )}

    </div>
  );
};
