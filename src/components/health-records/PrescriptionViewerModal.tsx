import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  Building2,
  User,
  Calendar,
  ShieldCheck,
  Clock,
  Pill,
  ExternalLink,
  CheckCircle2,
  Share2,
  Copy,
  Info
} from 'lucide-react';
import { ClinicalPrescriptionRecord } from '../../types/clinicalPrescription';

interface PrescriptionViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: ClinicalPrescriptionRecord | null;
  onStatusChange?: (id: string, status: ClinicalPrescriptionRecord['status']) => void;
}

export const PrescriptionViewerModal: React.FC<PrescriptionViewerModalProps> = ({
  isOpen,
  onClose,
  prescription,
  onStatusChange
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [activeTab, setActiveTab] = useState<'document' | 'medications' | 'details'>('document');
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen || !prescription) return null;

  const pages = prescription.pages || [];
  const currentPage = pages[currentPageIndex] || pages[0];

  const handlePrevPage = () => {
    if (currentPageIndex > 0) setCurrentPageIndex((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) setCurrentPageIndex((prev) => prev + 1);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleResetZoom = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRxSummary = () => {
    const medList = prescription.medications
      .map((m, i) => `${i + 1}. ${m.name} ${m.dosage} - ${m.frequency} (${m.timing}) - Duration: ${m.duration}`)
      .join('\n');
    const text = `PRESCRIPTION: ${prescription.title}\nDoctor: ${prescription.doctorName} (${prescription.hospitalClinic})\nDate: ${prescription.prescriptionDate} | Valid Until: ${prescription.validUntil}\nDiagnosis: ${prescription.diagnosis}\n\nMedications:\n${medList}\n\nInstructions: ${prescription.clinicalNotes}`;
    
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[90vh] my-auto">
        
        {/* Top Action Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {prescription.title}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    prescription.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : prescription.status === 'Refill Due'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {prescription.status}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Prescribed by <strong className="text-white">{prescription.doctorName}</strong> • {prescription.hospitalClinic} • {prescription.prescriptionDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyRxSummary}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
              title="Copy formatted prescription text"
            >
              {copiedSummary ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedSummary ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('document')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'document'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Scanned Document View ({pages.length} Pages)
            </button>
            <button
              onClick={() => setActiveTab('medications')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'medications'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Prescribed Medicines ({prescription.medications.length})
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === 'details'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Physician & Clinical Details
            </button>
          </div>

          {onStatusChange && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Status:</span>
              <select
                value={prescription.status}
                onChange={(e) => onStatusChange(prescription.id, e.target.value as any)}
                className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800"
              >
                <option value="Active">Active Regimen</option>
                <option value="Completed">Completed Course</option>
                <option value="Refill Due">Refill Due</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          )}
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/70">
          
          {/* TAB 1: DOCUMENT / SCANNED VIEWER */}
          {activeTab === 'document' && (
            <div className="h-full flex flex-col gap-3">
              {/* Document Zoom & Page Controls */}
              <div className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPageIndex === 0}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition cursor-pointer"
                    title="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4 text-slate-700" />
                  </button>
                  <span className="font-mono font-bold text-slate-800 px-2">
                    Page {currentPageIndex + 1} of {Math.max(pages.length, 1)}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPageIndex >= pages.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition cursor-pointer"
                    title="Next page"
                  >
                    <ChevronRight className="h-4 w-4 text-slate-700" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleZoomOut}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-4 w-4 text-slate-700" />
                  </button>
                  <span className="font-mono text-[11px] font-bold text-slate-600 px-1">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-4 w-4 text-slate-700" />
                  </button>
                  <button
                    onClick={handleRotate}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer ml-1"
                    title="Rotate 90 deg"
                  >
                    <RotateCw className="h-4 w-4 text-slate-700" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-[10px] text-slate-600 transition cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                {currentPage?.driveUrl && (
                  <a
                    href={currentPage.driveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Open in Google Drive</span>
                  </a>
                )}
              </div>

              {/* High-Resolution Document Canvas Frame */}
              <div className="flex-1 min-h-[400px] bg-slate-900/90 rounded-2xl border border-slate-300/80 overflow-hidden flex items-center justify-center p-4 relative shadow-inner">
                {currentPage ? (
                  <div
                    className="transition-transform duration-150 ease-out max-h-full flex items-center justify-center"
                    style={{
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                      transformOrigin: 'center center'
                    }}
                  >
                    <img
                      src={currentPage.previewUrl}
                      alt={currentPage.fileName}
                      className="max-h-[62vh] max-w-full rounded-lg shadow-2xl object-contain border border-slate-700"
                    />
                  </div>
                ) : (
                  <div className="text-center text-slate-400 p-8 space-y-2">
                    <FileText className="h-10 w-10 mx-auto text-slate-600" />
                    <p className="text-xs">No scanned image attached for this prescription.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRESCRIBED MEDICINES SCHEDULE */}
          {activeTab === 'medications' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-emerald-700" />
                  <span className="font-bold">
                    Itemized Drug Regimen ({prescription.medications.length} Prescribed Medications)
                  </span>
                </div>
                <span className="text-[11px] text-emerald-800">
                  Prescription Valid Until: <strong>{prescription.validUntil}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {prescription.medications.map((med, i) => (
                  <div
                    key={med.id || i}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                            {i + 1}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{med.name}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-bold text-[10px] border border-blue-100">
                            {med.form} • {med.dosage}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 pl-7">
                          Schedule: <strong>{med.frequency}</strong> ({med.timing}) • Course: <strong>{med.duration}</strong>
                        </p>
                      </div>

                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        {med.refillsRemaining} Refills Approved
                      </span>
                    </div>

                    {med.instructions && (
                      <div className="pl-7 pt-1 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="font-bold text-slate-800">Physician Advice: </span>
                        {med.instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DETAILS & CLINICAL CONTEXT */}
          {activeTab === 'details' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Prescribing Physician</span>
                  </h4>
                  <div className="space-y-1 text-slate-700">
                    <p className="text-sm font-bold text-slate-900">{prescription.doctorName}</p>
                    <p className="text-[11px] text-slate-500">Reg No: {prescription.doctorRegNo}</p>
                    <p className="text-[11px] text-slate-600">{prescription.doctorSpecialty}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Facility & Department</span>
                  </h4>
                  <div className="space-y-1 text-slate-700">
                    <p className="text-sm font-bold text-slate-900">{prescription.hospitalClinic}</p>
                    <p className="text-[11px] text-slate-600">Department: {prescription.department}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Clinical Dates & Validity</span>
                  </h4>
                  <div className="space-y-1 text-slate-700">
                    <p>Prescribed Date: <strong>{prescription.prescriptionDate}</strong></p>
                    <p>Valid Through: <strong>{prescription.validUntil}</strong></p>
                    <p>Archived to EHR: <strong>{new Date(prescription.createdAt).toLocaleDateString()}</strong></p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                    <span>Verification & Provenance</span>
                  </h4>
                  <div className="space-y-1 text-slate-700">
                    <p>Source Type: <strong>{prescription.source}</strong></p>
                    <p>Status: <strong className="text-emerald-700">Clinically Verified</strong></p>
                    <p>Signed By: <strong>{prescription.verifiedBy || prescription.doctorName}</strong></p>
                  </div>
                </div>
              </div>

              {prescription.diagnosis && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                  <h4 className="font-bold text-slate-900">Diagnosis & Clinical Indication</h4>
                  <p className="text-slate-700 leading-relaxed">{prescription.diagnosis}</p>
                </div>
              )}

              {prescription.clinicalNotes && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                  <h4 className="font-bold text-slate-900">Physician Clinical Advice & Notes</h4>
                  <p className="text-slate-700 leading-relaxed">{prescription.clinicalNotes}</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Info className="h-4 w-4 text-slate-400" />
            <span>Prescription stored in longitudinal Clinical Health Record (EHR).</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition cursor-pointer"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
