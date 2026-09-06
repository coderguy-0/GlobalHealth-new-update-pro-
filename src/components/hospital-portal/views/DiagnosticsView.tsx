import React, { useState } from 'react';
import {
  FlaskConical,
  Scan,
  Activity,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Barcode,
  Eye,
  Sparkles,
  Zap,
  Tag,
  Radio,
  Layers,
  ArrowRight,
  Info,
  Calendar,
  UserCheck,
  ChevronRight,
  Download,
  Printer
} from 'lucide-react';
import { useDiagnostics } from '../../../context/DiagnosticContext';
import { useHospitalPortal } from '../../../context/HospitalContext';
import { LabCategory, ImagingModalityCode, DiagnosticOrderStatus, OrderPriority } from '../../../types/diagnostics';
import { SPECIMEN_TUBE_MATRIX } from '../../../data/diagnosticsData';
import { NewRequisitionModal } from '../modals/NewRequisitionModal';
import { AddLabTestModal } from '../modals/AddLabTestModal';
import { AddImagingModal } from '../modals/AddImagingModal';
import { SpecimenPhlebotomyModal } from '../modals/SpecimenPhlebotomyModal';
import { ReportVerificationModal } from '../modals/ReportVerificationModal';
import { DicomPacsViewerModal } from '../modals/DicomPacsViewerModal';

export const DiagnosticsView: React.FC = () => {
  const {
    labTests,
    imagingServices,
    orders,
    safetyRecords,
    stats,
    activeModal,
    selectedDicomPreset,
    openRequisitionModal,
    openAddLabModal,
    openAddImagingModal,
    openPhlebotomyModal,
    openVerificationModal,
    openDicomViewer,
    acknowledgePanicAlert,
    closeModal
  } = useDiagnostics();

  const { currentHospital } = useHospitalPortal();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'pathology' | 'radiology' | 'pipeline' | 'compliance' | 'tubematrix'>('pathology');

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabCategory, setSelectedLabCategory] = useState<string>('ALL');
  const [selectedModalityFilter, setSelectedModalityFilter] = useState<string>('ALL');
  const [selectedOrderStatusFilter, setSelectedOrderStatusFilter] = useState<string>('ALL');

  // Filtered Lab Tests
  const filteredLabTests = labTests.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.testCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.methodology.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedLabCategory === 'ALL' || t.category === selectedLabCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered Imaging Services
  const filteredImaging = imagingServices.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.modalityCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.bodyRegion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.scannerModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.aerbLicenseNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModality = selectedModalityFilter === 'ALL' || i.modalityCode === selectedModalityFilter;
    return matchesSearch && matchesModality;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.specimenBarcode && o.specimenBarcode.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      selectedOrderStatusFilter === 'ALL' ||
      (selectedOrderStatusFilter === 'ACTIVE' && o.status !== 'Report Verified') ||
      (selectedOrderStatusFilter === 'STAT' && o.priority === 'EMERGENCY STAT') ||
      (selectedOrderStatusFilter === 'PANIC' && o.status === 'Critical Panic Alert Triggered') ||
      o.status === selectedOrderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-[#17221E]">
      
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCEBE4] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17221E]">
              Laboratory & Advanced Diagnostic Imaging
            </h1>
            <span className="text-xs font-mono font-bold bg-[#008F68]/10 text-[#008F68] px-2.5 py-0.5 rounded-full border border-[#008F68]/20">
              NABL ISO-15189 & AERB
            </span>
          </div>
          <p className="text-xs text-[#52635C] mt-0.5">
            Unified Clinical Pathology Formularies, Radiographic PACS DICOM Workstation & Radiation Safety Hub
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => openRequisitionModal()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008F68] hover:bg-[#007a58] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Diagnostic Order</span>
          </button>
        </div>
      </div>

      {/* 2. Critical Panic Alert Banner (if active) */}
      {stats.panicAlertsCount > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-900 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-200/60 px-2 py-0.5 rounded">
                  Critical Panic Value Alert ({stats.panicAlertsCount})
                </span>
                <span className="text-xs font-semibold text-rose-800">
                  STAT Emergency Clinical Notification Active
                </span>
              </div>
              <p className="text-xs text-rose-700 mt-0.5">
                hs-cTnI / Blood Panic thresholds breached. Attending cardiologist & ICU team notified.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTab('pipeline');
              setSelectedOrderStatusFilter('PANIC');
            }}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-2xs whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>Review Panic Queue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Top Key Performance Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#52635C]">
            <span className="font-semibold">Pathology Tests</span>
            <FlaskConical className="w-4 h-4 text-[#008F68]" />
          </div>
          <div className="text-2xl font-black text-[#17221E]">{stats.totalLabTests}</div>
          <div className="text-[11px] text-[#008F68] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% NABL Accredited</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#52635C]">
            <span className="font-semibold">Imaging Suites</span>
            <Scan className="w-4 h-4 text-[#287EA8]" />
          </div>
          <div className="text-2xl font-black text-[#17221E]">{stats.totalImagingServices}</div>
          <div className="text-[11px] text-[#287EA8] font-medium flex items-center gap-1">
            <Radio className="w-3 h-3" />
            <span>AERB Licensed & Shielded</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#52635C]">
            <span className="font-semibold">Active Orders Queue</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-[#17221E]">
            {stats.activeOrdersCount}{' '}
            <span className="text-xs font-normal text-rose-600">({stats.statOrdersCount} STAT)</span>
          </div>
          <div className="text-[11px] text-[#52635C] font-medium">
            Avg STAT TAT: <span className="font-bold text-[#17221E]">26 Mins</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#52635C]">
            <span className="font-semibold">Radiation Exposure</span>
            <ShieldCheck className="w-4 h-4 text-[#008F68]" />
          </div>
          <div className="text-lg font-black text-[#17221E] truncate">{stats.aerbSafetyMargin.split(' ')[0]} mSv/qtr</div>
          <div className="text-[11px] text-[#008F68] font-medium">
            BARC Limit: &lt; 20 mSv/yr
          </div>
        </div>
      </div>

      {/* 4. Radiology PACS Quick Launch Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                DICOM 3.0 PACS ONLINE
              </span>
              <span className="text-xs text-slate-400">Node: APEX_PACS_GRID (10.240.12.8:104)</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
              Integrated Multi-Modality DICOM Workstation & AI CAD Engine
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Real-time radiograph, CT head, lumbar MRI, and catheter fluoroscopy viewing with window/level presets, caliper measurement, and ACR RadLex findings.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => openDicomViewer('CXR')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#008F68] hover:bg-[#007a58] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Launch Chest X-Ray</span>
            </button>
            <button
              onClick={() => openDicomViewer('CT_BRAIN')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/40 text-xs font-bold transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch CT Brain</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Launch Scan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          <div
            onClick={() => openDicomViewer('CXR')}
            className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white group-hover:text-emerald-400">Chest PA Radiograph</span>
              <span className="font-mono text-[10px] text-emerald-400">CXR</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">David K. Miller • Consolidation CAD</p>
          </div>

          <div
            onClick={() => openDicomViewer('CT_BRAIN')}
            className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-purple-500/50 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white group-hover:text-purple-300">CT Head Non-Contrast</span>
              <span className="font-mono text-[10px] text-purple-400">CT 64-Slice</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">Margaret Holloway • Acute SDH</p>
          </div>

          <div
            onClick={() => openDicomViewer('MRI_SPINE')}
            className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-teal-500/50 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white group-hover:text-teal-300">MRI Lumbar Spine 3.0T</span>
              <span className="font-mono text-[10px] text-teal-400">MR 3T</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">Sophia Sterling • L4-L5 Herniation</p>
          </div>

          <div
            onClick={() => openDicomViewer('ANGIO')}
            className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-rose-500/50 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white group-hover:text-rose-300">Cath Lab Coronary Angio</span>
              <span className="font-mono text-[10px] text-rose-400">XA Fluoro</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">Marcus Brody • LAD 85% Stenosis</p>
          </div>
        </div>
      </div>

      {/* 5. Navigation Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#DCEBE4] shadow-xs overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('pathology');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'pathology'
              ? 'bg-[#008F68] text-white shadow-2xs'
              : 'text-[#52635C] hover:text-[#17221E] hover:bg-slate-50'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Clinical Pathology Formulary ({labTests.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('radiology');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'radiology'
              ? 'bg-[#287EA8] text-white shadow-2xs'
              : 'text-[#52635C] hover:text-[#17221E] hover:bg-slate-50'
          }`}
        >
          <Scan className="w-3.5 h-3.5" />
          <span>Radiology & PACS Suites ({imagingServices.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('pipeline');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'pipeline'
              ? 'bg-[#17221E] text-white shadow-2xs'
              : 'text-[#52635C] hover:text-[#17221E] hover:bg-slate-50'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Live Orders Pipeline ({orders.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('compliance');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'compliance'
              ? 'bg-[#008F68] text-white shadow-2xs'
              : 'text-[#52635C] hover:text-[#17221E] hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AERB & NABL Safety ({safetyRecords.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('tubematrix');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'tubematrix'
              ? 'bg-purple-700 text-white shadow-2xs'
              : 'text-[#52635C] hover:text-[#17221E] hover:bg-slate-50'
          }`}
        >
          <Barcode className="w-3.5 h-3.5" />
          <span>Specimen Tube Matrix ({SPECIMEN_TUBE_MATRIX.length})</span>
        </button>
      </div>

      {/* 6. TAB 1: CLINICAL PATHOLOGY FORMULARY */}
      {activeTab === 'pathology' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#DCEBE4] shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52635C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search LOINC code, analyte name, methodology, or category..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F6FBF8] border border-[#DCEBE4] rounded-xl text-[#17221E] placeholder:text-slate-400 focus:outline-none focus:border-[#008F68]"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[#52635C] font-medium">Category:</span>
                <select
                  value={selectedLabCategory}
                  onChange={(e) => setSelectedLabCategory(e.target.value)}
                  className="px-2.5 py-1.5 bg-[#F6FBF8] border border-[#DCEBE4] rounded-xl text-xs font-semibold text-[#17221E] focus:outline-none focus:border-[#008F68]"
                >
                  <option value="ALL">All Categories ({labTests.length})</option>
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Hematology">Hematology</option>
                  <option value="Microbiology">Microbiology</option>
                  <option value="Histopathology">Histopathology</option>
                  <option value="Serology">Serology</option>
                  <option value="Molecular">Molecular</option>
                </select>
              </div>

              <button
                onClick={openAddLabModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#008F68]/10 hover:bg-[#008F68]/20 text-[#008F68] border border-[#008F68]/30 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Test</span>
              </button>
            </div>
          </div>

          {/* Pathology Table */}
          <div className="bg-white rounded-2xl border border-[#DCEBE4] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#DCEBE4] bg-[#F6FBF8] text-[#52635C] font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">LOINC / Test Name</th>
                    <th className="py-3 px-4">Category & Specimen</th>
                    <th className="py-3 px-4">Vacutainer Tube</th>
                    <th className="py-3 px-4">Turnaround TAT</th>
                    <th className="py-3 px-4">Panic Thresholds</th>
                    <th className="py-3 px-4">Tariff</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCEBE4]">
                  {filteredLabTests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#52635C]">
                        No pathology tests found matching query.
                      </td>
                    </tr>
                  ) : (
                    filteredLabTests.map((t) => (
                      <tr key={t.id} className="hover:bg-[#F6FBF8]/60 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#17221E]">{t.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] text-[#008F68] font-bold bg-[#008F68]/10 px-1.5 py-0.5 rounded">
                              {t.testCode}
                            </span>
                            {t.nablAccredited && (
                              <span className="text-[10px] text-[#52635C] flex items-center gap-0.5">
                                <ShieldCheck className="w-3 h-3 text-[#008F68]" />
                                <span>ISO-15189</span>
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {t.category}
                          </span>
                          <div className="text-[11px] text-[#52635C] mt-0.5">{t.specimenType}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{
                                backgroundColor: t.vacutainerCapColor.includes('Purple')
                                  ? '#7E22CE'
                                  : t.vacutainerCapColor.includes('Blue')
                                  ? '#0284C7'
                                  : t.vacutainerCapColor.includes('Green')
                                  ? '#16A34A'
                                  : t.vacutainerCapColor.includes('Grey')
                                  ? '#475569'
                                  : t.vacutainerCapColor.includes('Yellow')
                                  ? '#CA8A04'
                                  : '#E11D48'
                              }}
                            />
                            <span className="text-[11px] font-medium text-[#17221E]">
                              {t.vacutainerCapColor.split(' ')[0]}
                            </span>
                          </div>
                          {t.fastingRequired && (
                            <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 mt-1 inline-block">
                              Fasting Req.
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#17221E]">
                            Routine: {t.standardTurnaroundMinutes}m
                          </div>
                          <div className="text-[11px] text-rose-700 font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            <span>STAT: {t.statTurnaroundMinutes}m</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {t.criticalHighThreshold || t.criticalLowThreshold ? (
                            <div className="text-[11px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
                              {t.criticalHighThreshold ? `High: >${t.criticalHighThreshold} ${t.unitOfMeasure}` : ''}
                              {t.criticalLowThreshold ? ` Low: <${t.criticalLowThreshold} ${t.unitOfMeasure}` : ''}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">Standard Interval</span>
                          )}
                          <div className="text-[10px] text-[#52635C] truncate max-w-xs mt-0.5">
                            Ref: {t.normalRangeMale}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-bold text-[#17221E]">₹{t.price.toLocaleString()}</td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() =>
                              openRequisitionModal({
                                id: t.id,
                                name: t.name,
                                code: t.testCode,
                                type: 'LABORATORY'
                              })
                            }
                            className="px-2.5 py-1 bg-[#008F68]/10 hover:bg-[#008F68] text-[#008F68] hover:text-white rounded-lg font-bold transition text-xs cursor-pointer shadow-2xs"
                          >
                            Requisition
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB 2: RADIOLOGY & PACS SUITES */}
      {activeTab === 'radiology' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#DCEBE4] shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52635C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scanner model, body region, AERB license, or modality..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F6FBF8] border border-[#DCEBE4] rounded-xl text-[#17221E] placeholder:text-slate-400 focus:outline-none focus:border-[#287EA8]"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[#52635C] font-medium">Modality:</span>
                <select
                  value={selectedModalityFilter}
                  onChange={(e) => setSelectedModalityFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-[#F6FBF8] border border-[#DCEBE4] rounded-xl text-xs font-semibold text-[#17221E] focus:outline-none focus:border-[#287EA8]"
                >
                  <option value="ALL">All Modalities ({imagingServices.length})</option>
                  <option value="CT">CT (Computed Tomography)</option>
                  <option value="MRI">MRI (Magnetic Resonance)</option>
                  <option value="DR">DR (Digital Radiography)</option>
                  <option value="USG">USG (Ultrasound Doppler)</option>
                  <option value="MAMMO">MAMMO (Mammography)</option>
                  <option value="PET-CT">PET-CT (Nuclear)</option>
                </select>
              </div>

              <button
                onClick={openAddImagingModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#287EA8]/10 hover:bg-[#287EA8]/20 text-[#287EA8] border border-[#287EA8]/30 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Modality</span>
              </button>
            </div>
          </div>

          {/* Radiology Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImaging.map((i) => (
              <div
                key={i.id}
                className="p-5 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#287EA8]/40 transition"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#EAF6FB] text-[#287EA8] border border-[#287EA8]/20">
                      {i.modalityCode}
                    </span>
                    <span className="text-[11px] text-[#008F68] font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#008F68]" />
                      <span>Online & Active</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#17221E] leading-snug">{i.name}</h3>
                    <p className="text-[11px] text-[#52635C] mt-0.5">{i.scannerModel}</p>
                  </div>

                  <div className="p-2.5 bg-[#F6FBF8] rounded-xl border border-[#DCEBE4] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#52635C]">Location:</span>
                      <span className="font-semibold text-[#17221E]">{i.roomSuite}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#52635C]">Radiation Dose:</span>
                      <span className="font-bold text-slate-800">{i.radiationDoseEstimate}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#52635C]">BARC Shielding:</span>
                      <span className="font-mono text-[10px] text-[#008F68] font-bold truncate max-w-[150px]">
                        {i.leadShieldingThickness}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#52635C]">AERB License:</span>
                      <span className="font-mono text-[10px] text-[#287EA8] font-bold">{i.aerbLicenseNo}</span>
                    </div>
                  </div>

                  {/* Contrast Flags */}
                  <div className="flex items-center gap-2 flex-wrap text-[10px]">
                    {i.contrastRequired ? (
                      <span className="px-2 py-0.5 rounded font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        IV Contrast Required
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-600">
                        Non-Contrast Study
                      </span>
                    )}

                    {i.creatininePreCheckRequired && (
                      <span className="px-2 py-0.5 rounded font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        eGFR Pre-Screen
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#DCEBE4] flex items-center justify-between">
                  <div className="font-black text-sm text-[#17221E]">₹{i.price.toLocaleString()}</div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        openDicomViewer(
                          i.modalityCode === 'CT'
                            ? 'CT_BRAIN'
                            : i.modalityCode === 'MRI'
                            ? 'MRI_SPINE'
                            : 'CXR'
                        )
                      }
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>PACS</span>
                    </button>
                    <button
                      onClick={() =>
                        openRequisitionModal({
                          id: i.id,
                          name: i.name,
                          code: i.aerbLicenseNo,
                          type: 'IMAGING'
                        })
                      }
                      className="px-3 py-1.5 bg-[#287EA8] hover:bg-[#20698c] text-white rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer"
                    >
                      Requisition
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. TAB 3: LIVE REQUISITIONS & PATIENT REPORTS PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          {/* Pipeline Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#DCEBE4] shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52635C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient name, MRN, order ID, barcode, or procedure..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F6FBF8] border border-[#DCEBE4] rounded-xl text-[#17221E] placeholder:text-slate-400 focus:outline-none focus:border-[#17221E]"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[#52635C] font-medium">Status View:</span>
                <select
                  value={selectedOrderStatusFilter}
                  onChange={(e) => setSelectedOrderStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-[#F6FBF8] border border-[#DCEBE4] rounded-xl text-xs font-semibold text-[#17221E] focus:outline-none focus:border-[#17221E]"
                >
                  <option value="ALL">All Orders ({orders.length})</option>
                  <option value="ACTIVE">Active in Pipeline</option>
                  <option value="STAT">STAT Emergency Only</option>
                  <option value="PANIC">Critical Panic Alerts</option>
                  <option value="Requisitioned">Requisitioned</option>
                  <option value="Sample Collected">Sample Collected</option>
                  <option value="Processing on Analyzer">Processing Analyzer</option>
                  <option value="Report Verified">Report Verified</option>
                </select>
              </div>

              <button
                onClick={() => openRequisitionModal()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#008F68] hover:bg-[#007a58] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Requisition</span>
              </button>
            </div>
          </div>

          {/* Orders Pipeline List */}
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#DCEBE4] text-[#52635C] text-xs">
                No diagnostic orders matching filter criteria.
              </div>
            ) : (
              filteredOrders.map((o) => (
                <div
                  key={o.orderId}
                  className={`p-4 rounded-2xl bg-white border transition shadow-xs space-y-3 ${
                    o.status === 'Critical Panic Alert Triggered'
                      ? 'border-rose-400 bg-rose-50/20'
                      : o.priority === 'EMERGENCY STAT'
                      ? 'border-amber-300'
                      : 'border-[#DCEBE4]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCEBE4] pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          o.orderType === 'LABORATORY'
                            ? 'bg-[#008F68]/10 text-[#008F68]'
                            : 'bg-[#287EA8]/10 text-[#287EA8]'
                        }`}
                      >
                        {o.orderType === 'LABORATORY' ? <FlaskConical className="w-4 h-4" /> : <Scan className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#17221E]">{o.patientName}</span>
                          <span className="font-mono text-[11px] font-bold text-[#52635C] bg-slate-100 px-2 py-0.2 rounded">
                            {o.patientId}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              o.priority === 'EMERGENCY STAT'
                                ? 'bg-rose-100 text-rose-800 animate-pulse'
                                : o.priority === 'URGENT'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {o.priority}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#52635C] mt-0.5">
                          {o.patientAgeGender} • {o.patientLocation} • Ordered by {o.orderingDoctorName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] text-slate-400">{o.orderId}</span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                          o.status === 'Critical Panic Alert Triggered'
                            ? 'bg-rose-600 text-white'
                            : o.status === 'Report Verified'
                            ? 'bg-[#008F68] text-white'
                            : o.status === 'Processing on Analyzer'
                            ? 'bg-purple-100 text-purple-800'
                            : o.status === 'Sample Collected'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.status === 'Report Verified' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {o.status === 'Critical Panic Alert Triggered' && <ShieldAlert className="w-3.5 h-3.5" />}
                        <span>{o.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Order Details Body */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-[11px] text-[#52635C]">Service Requested:</span>
                      <div className="font-bold text-[#17221E]">{o.serviceName}</div>
                      <div className="font-mono text-[10px] text-[#008F68]">{o.serviceCode}</div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-[#52635C]">Barcode & Specimen Tracking:</span>
                      {o.specimenBarcode ? (
                        <div className="flex items-center gap-1.5 font-mono font-bold text-[#17221E]">
                          <Barcode className="w-4 h-4 text-[#008F68]" />
                          <span>{o.specimenBarcode}</span>
                        </div>
                      ) : (
                        <div className="text-slate-400">Radiology Direct PACS Stream</div>
                      )}
                      {o.vacutainerColor && (
                        <div className="text-[11px] text-[#52635C]">{o.vacutainerColor}</div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-[#52635C]">Results & Authorization:</span>
                      {o.quantitativeValue ? (
                        <div className="font-mono font-bold text-[#17221E] text-sm">
                          {o.quantitativeValue} {o.unitOfMeasure}
                        </div>
                      ) : o.findingsReport ? (
                        <div className="text-[11px] text-[#17221E] line-clamp-1 italic">
                          "{o.findingsReport}"
                        </div>
                      ) : (
                        <div className="text-slate-400">Pending Laboratory Sign-Off</div>
                      )}
                      {o.verifiedByDoctor && (
                        <div className="text-[11px] text-[#008F68] font-medium flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          <span>{o.verifiedByDoctor}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Panic alert details if triggered */}
                  {o.isPanicValue && (
                    <div className="p-3 bg-rose-100/70 border border-rose-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-rose-900 text-xs">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="font-bold">{o.panicValueNote}</span>
                      </div>
                      <button
                        onClick={() => acknowledgePanicAlert(o.orderId, 'Emergency Bedside Review Completed')}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs transition cursor-pointer shadow-2xs whitespace-nowrap"
                      >
                        Acknowledge & Clear Escalation
                      </button>
                    </div>
                  )}

                  {/* Action Handlers */}
                  <div className="pt-2 border-t border-[#DCEBE4] flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="text-[11px] text-[#52635C]">
                      Requisition Time: {new Date(o.requisitionTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    <div className="flex items-center gap-2">
                      {o.orderType === 'LABORATORY' && o.status === 'Requisitioned' && (
                        <button
                          onClick={() => openPhlebotomyModal(o)}
                          className="px-3 py-1.5 bg-[#008F68] hover:bg-[#007a58] text-white rounded-xl font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Barcode className="w-3.5 h-3.5" />
                          <span>Phlebotomy & Ingestion</span>
                        </button>
                      )}

                      {o.status !== 'Report Verified' && o.status !== 'Critical Panic Alert Triggered' && (
                        <button
                          onClick={() => openVerificationModal(o)}
                          className="px-3 py-1.5 bg-[#17221E] hover:bg-slate-800 text-white rounded-xl font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Sign-Off Report</span>
                        </button>
                      )}

                      {o.pacsPresetId && (
                        <button
                          onClick={() => openDicomViewer(o.pacsPresetId!)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded-xl font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Open DICOM PACS</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 9. TAB 4: AERB & NABL REGULATORY QUALITY AUDIT LOGS */}
      {activeTab === 'compliance' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#DCEBE4] shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-[#008F68] font-bold">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="text-base font-bold text-[#17221E]">Regulatory Safety & Radiation Protection Dossier</h2>
            </div>
            <p className="text-xs text-[#52635C]">
              Statutory documentation under AERB (Atomic Energy Regulatory Board) Radiation Safety and NABL (ISO-15189:2022) Quality Standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safetyRecords.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase text-[#287EA8] bg-[#EAF6FB] px-2.5 py-0.5 rounded-full border border-[#287EA8]/20">
                    {r.category}
                  </span>
                  <span className="text-[11px] font-bold text-[#008F68] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{r.status}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#17221E]">{r.entityName}</h3>
                  <div className="font-mono text-[11px] text-[#52635C] mt-0.5">License: {r.licenseNumber}</div>
                </div>

                <div className="p-3 bg-[#F6FBF8] rounded-xl border border-[#DCEBE4] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#52635C]">Recorded Metric / Shielding:</span>
                    <span className="font-bold text-[#17221E]">{r.recordedDoseOrMetric}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#52635C]">Inspecting Officer:</span>
                    <span className="font-semibold text-slate-800">{r.inspectorName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#52635C]">Valid Until:</span>
                    <span className="font-mono text-[#008F68] font-bold">{r.nextRenewalDate}</span>
                  </div>
                </div>

                <p className="text-xs text-[#52635C] leading-relaxed italic border-t border-[#DCEBE4] pt-2">
                  "{r.complianceNotes}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. TAB 5: SPECIMEN TUBE & ANALYZER MATRIX */}
      {activeTab === 'tubematrix' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#DCEBE4] shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-purple-700 font-bold">
              <Barcode className="w-5 h-5" />
              <h2 className="text-base font-bold text-[#17221E]">Vacutainer Phlebotomy & Automated Analyzers Matrix</h2>
            </div>
            <p className="text-xs text-[#52635C]">
              Standardized tube color protocols, additives, draw volumes, and high-throughput clinical chemistry & hematology analyzers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPECIMEN_TUBE_MATRIX.map((tube) => (
              <div
                key={tube.colorName}
                className="p-5 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-3.5 hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border-2 border-white shadow-xs"
                      style={{ backgroundColor: tube.hexColor }}
                    />
                    <h3 className="font-bold text-sm text-[#17221E]">{tube.colorName}</h3>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {tube.drawVolume}
                  </span>
                </div>

                <div className="p-3 bg-[#F6FBF8] rounded-xl border border-[#DCEBE4] space-y-1.5 text-xs">
                  <div>
                    <span className="text-[#52635C] block text-[10px] uppercase font-bold">Additive:</span>
                    <span className="font-semibold text-[#17221E]">{tube.additive}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-[#52635C] block text-[10px] uppercase font-bold">Yield:</span>
                    <span className="text-slate-800 font-medium">{tube.specimenGenerated}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-[#52635C] block text-[10px] uppercase font-bold">Protocol:</span>
                    <span className="font-mono text-[#008F68] font-bold">{tube.inversionsCount}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-[#17221E] mb-1.5">Common Diagnostic Tests:</div>
                  <div className="flex flex-wrap gap-1">
                    {tube.primaryApplications.map((app) => (
                      <span
                        key={app}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-[#52635C] font-medium"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#DCEBE4] flex items-center justify-between text-[11px]">
                  <span className="text-[#52635C]">Analyzers:</span>
                  <span className="font-semibold text-[#17221E]">{tube.sampleAnalyzers.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Modals for Diagnostics */}
      <NewRequisitionModal />
      <AddLabTestModal />
      <AddImagingModal />
      <SpecimenPhlebotomyModal />
      <ReportVerificationModal />
      <DicomPacsViewerModal
        isOpen={activeModal === 'dicom_viewer'}
        onClose={closeModal}
        initialModality={selectedDicomPreset}
      />
    </div>
  );
};
