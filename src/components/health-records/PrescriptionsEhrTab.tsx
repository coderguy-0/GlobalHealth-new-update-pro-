import React, { useState, useMemo } from 'react';
import {
  FileText,
  Upload,
  Camera,
  HardDrive,
  Plus,
  Search,
  Filter,
  Calendar,
  Building2,
  User,
  Pill,
  ExternalLink,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Printer,
  ChevronRight,
  ShieldCheck,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ClinicalPrescriptionRecord, PrescriptionStatus } from '../../types/clinicalPrescription';
import { SavePrescriptionModal } from './SavePrescriptionModal';
import { PrescriptionViewerModal } from './PrescriptionViewerModal';

interface PrescriptionsEhrTabProps {
  prescriptions: ClinicalPrescriptionRecord[];
  patientId: string;
  patientName: string;
  onSavePrescription: (prescription: Omit<ClinicalPrescriptionRecord, 'id' | 'createdAt'>) => void;
  onUpdateStatus: (id: string, status: PrescriptionStatus) => void;
  onDeletePrescription: (id: string) => void;
  onAddMedicationReminder?: (reminder: {
    name: string;
    dosage: string;
    time: string;
    days: string[];
    notes?: string;
  }) => void;
}

export const PrescriptionsEhrTab: React.FC<PrescriptionsEhrTabProps> = ({
  prescriptions,
  patientId,
  patientName,
  onSavePrescription,
  onUpdateStatus,
  onDeletePrescription,
  onAddMedicationReminder
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | PrescriptionStatus>('ALL');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [selectedPrescriptionForView, setSelectedPrescriptionForView] = useState<ClinicalPrescriptionRecord | null>(null);

  // Filter prescriptions for current patient
  const patientPrescriptions = useMemo(() => {
    return prescriptions.filter((rx) => rx.patientId === patientId || !rx.patientId);
  }, [prescriptions, patientId]);

  // Search and status filter
  const filteredPrescriptions = useMemo(() => {
    return patientPrescriptions.filter((rx) => {
      // Status filter
      if (selectedStatusFilter !== 'ALL' && rx.status !== selectedStatusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = rx.title?.toLowerCase().includes(query);
        const matchDoctor = rx.doctorName?.toLowerCase().includes(query);
        const matchHospital = rx.hospitalClinic?.toLowerCase().includes(query);
        const matchDiagnosis = rx.diagnosis?.toLowerCase().includes(query);
        const matchMed = rx.medications?.some((m) => m.name.toLowerCase().includes(query));
        return matchTitle || matchDoctor || matchHospital || matchDiagnosis || matchMed;
      }
      return true;
    });
  }, [patientPrescriptions, selectedStatusFilter, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    const active = patientPrescriptions.filter((p) => p.status === 'Active').length;
    const refillsDue = patientPrescriptions.filter((p) => p.status === 'Refill Due').length;
    const totalPages = patientPrescriptions.reduce((acc, p) => acc + (p.pages?.length || 0), 0);
    const totalMeds = patientPrescriptions.reduce((acc, p) => acc + (p.medications?.length || 0), 0);
    return { active, refillsDue, totalPages, totalMeds };
  }, [patientPrescriptions]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-slate-900 via-slate-800 to-teal-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Clinical Health Record (EHR) • Prescriptions Vault</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Doctor Prescriptions & Medication Slips
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Save multi-page prescriptions by uploading image/PDF files, capturing photos with your camera, or importing from Google Drive.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition shadow-lg shadow-teal-950/30 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Save / Upload Prescription</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Regimens</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900">{stats.active}</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Pill className="h-4 w-4" />
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Currently active doctor courses</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Prescribed Drugs</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900">{stats.totalMeds}</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <FileText className="h-4 w-4" />
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Across active & saved slips</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Archived Pages</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900">{stats.totalPages}</span>
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Layers className="h-4 w-4" />
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Scanned & high-res documents</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Refills Remaining</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900">{stats.refillsDue > 0 ? stats.refillsDue : 'Valid'}</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Pharmacy refill approved</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search doctor, medicine, clinic or diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-hidden font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ×
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {(['ALL', 'Active', 'Refill Due', 'Completed', 'Archived'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedStatusFilter === st
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Prescriptions' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Prescriptions List Cards */}
      {filteredPrescriptions.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredPrescriptions.map((rx) => (
            <div
              key={rx.id}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-lg">
                      {rx.id}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {rx.title}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        rx.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : rx.status === 'Refill Due'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      ● {rx.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      {rx.doctorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      {rx.hospitalClinic}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-500">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Date: {rx.prescriptionDate}
                    </span>
                    <span className="flex items-center gap-1 text-amber-700 font-medium">
                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                      Valid until: {rx.validUntil}
                    </span>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedPrescriptionForView(rx)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition cursor-pointer shadow-2xs"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Slip ({rx.pages?.length || 1} Pages)</span>
                  </button>

                  <button
                    onClick={() => onDeletePrescription(rx.id)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Delete prescription"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Diagnosis and Doctor Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider block">
                    Clinical Diagnosis
                  </span>
                  <p className="font-semibold text-slate-800">{rx.diagnosis || 'Cardiovascular maintenance'}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 md:col-span-2">
                  <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider block">
                    Physician Advice & Notes
                  </span>
                  <p className="text-slate-700 line-clamp-2">{rx.clinicalNotes || 'Follow prescribed timing with meals. Maintain hydration.'}</p>
                </div>
              </div>

              {/* Prescribed Medications Chips */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Pill className="h-3.5 w-3.5 text-teal-700" />
                    <span>Prescribed Medications ({rx.medications?.length || 0})</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Source: <strong className="text-slate-700">{rx.source.replace('_', ' ')}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {rx.medications?.map((med, i) => (
                    <div
                      key={med.id || i}
                      className="p-3 rounded-2xl border border-slate-200 bg-white space-y-1 text-xs hover:border-slate-300 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{med.name}</span>
                        <span className="font-bold text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {med.dosage}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {med.frequency} • {med.timing}
                      </p>
                      {med.instructions && (
                        <p className="text-[10px] text-slate-400 italic truncate">
                          "{med.instructions}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Scanned Pages Mini Carousel */}
              {rx.pages && rx.pages.length > 0 && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {rx.pages.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPrescriptionForView(rx)}
                        className="relative w-12 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group hover:border-teal-500 transition shadow-2xs"
                        title={`Page ${p.pageNumber} - Click to view`}
                      >
                        <img
                          src={p.previewUrl}
                          alt={p.fileName}
                          className="w-full h-full object-cover group-hover:scale-110 transition"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-white text-[8px] font-mono text-center py-0.5">
                          P.{p.pageNumber}
                        </span>
                      </div>
                    ))}
                    <span className="text-xs text-slate-500 ml-1">
                      {rx.pages.length} Scanned Page{rx.pages.length > 1 ? 's' : ''} Attached
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedPrescriptionForView(rx)}
                    className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Prescription Slip</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-700 mx-auto flex items-center justify-center">
            <FileText className="h-8 w-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-black text-slate-900 text-base sm:text-lg">
              {searchQuery ? 'No matching prescriptions found' : 'No Prescriptions in EHR Vault'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {searchQuery
                ? `No prescription matches "${searchQuery}". Try clearing search filter.`
                : 'Save doctor prescription pages by uploading image/PDF files, clicking photos with your camera, or importing directly from Google Drive.'}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition cursor-pointer shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Save New Prescription</span>
            </button>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      )}

      {/* Save Prescription Modal */}
      <SavePrescriptionModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        patientId={patientId}
        patientName={patientName}
        onSave={onSavePrescription}
        onAddMedicationReminder={onAddMedicationReminder}
      />

      {/* Prescription Viewer Modal */}
      <PrescriptionViewerModal
        isOpen={!!selectedPrescriptionForView}
        onClose={() => setSelectedPrescriptionForView(null)}
        prescription={selectedPrescriptionForView}
        onStatusChange={onUpdateStatus}
      />

    </div>
  );
};
