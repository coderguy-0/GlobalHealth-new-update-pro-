import React, { useState } from 'react';
import {
  X,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  Building2,
  Printer,
  FileDown,
  TrendingUp,
  Activity,
  Check,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { LabReportItem, PatientRecord } from '../../../types/medauth';

interface LabPanelDetailModalProps {
  report: LabReportItem | null;
  patient: PatientRecord;
  isOpen: boolean;
  onClose: () => void;
  onMarkReviewed?: (reportId: string) => void;
  onUpdateNote?: (reportId: string, note: string) => void;
  onOpenTrend?: (report: LabReportItem) => void;
  onPrint?: (report: LabReportItem) => void;
}

export const LabPanelDetailModal: React.FC<LabPanelDetailModalProps> = ({
  report,
  patient,
  isOpen,
  onClose,
  onMarkReviewed,
  onUpdateNote,
  onOpenTrend,
  onPrint
}) => {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(report?.doctorNotes || '');

  if (!isOpen || !report) return null;

  const isAbnormal = report.status !== 'NORMAL';

  const handleSaveNote = () => {
    if (onUpdateNote) {
      onUpdateNote(report.id, noteText);
    }
    setIsEditingNote(false);
  };

  const handleReviewToggle = () => {
    if (onMarkReviewed) {
      onMarkReviewed(report.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase font-mono">
              {report.category}
            </span>
            {report.loincCode && (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                LOINC: {report.loincCode}
              </span>
            )}
            <span
              className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full ${
                report.status === 'NORMAL'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : report.status === 'CRITICAL'
                  ? 'bg-rose-500 text-white'
                  : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
              }`}
            >
              {report.status}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {report.testName}
          </h2>

          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-300">
            <span>Patient: <strong className="text-white">{patient.name}</strong> ({patient.mrn})</span>
            <span>•</span>
            <span>Collected: {new Date(report.performedAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>Lab: {report.performingLab?.name || 'Global Diagnostics Clinical Core'}</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Primary Measured Analyte Summary Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Primary Diagnostic Finding
              </span>
              <div className="text-3xl font-black font-mono text-slate-900 mt-1">
                {report.resultValue} <span className="text-base font-medium text-slate-500">{report.unit}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Laboratory Reference Interval: <strong className="text-slate-900 font-mono">{report.referenceRange} {report.unit}</strong>
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
                  report.reviewStatus === 'REVIEWED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                {report.reviewStatus === 'REVIEWED' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Reviewed by {report.reviewedBy || 'Dr. Alexandra Chen'}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Awaiting Physician Review</span>
                  </>
                )}
              </span>

              <button
                onClick={handleReviewToggle}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer shadow-2xs"
              >
                {report.reviewStatus === 'REVIEWED' ? 'Mark as Unreviewed' : 'Mark as Reviewed ✓'}
              </button>
            </div>
          </div>

          {/* Sub-Analyte Multi-Biomarker Table (If panel contains multiple constituents) */}
          {report.biomarkers && report.biomarkers.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-tight">
                  Panel Biomarkers & Quantitative Breakdown ({report.biomarkers.length} Analyzed)
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">Automated Range Calibration</span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 border-b border-slate-200 text-[11px] text-slate-600 font-bold uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Biomarker</th>
                      <th className="py-2.5 px-4">Result</th>
                      <th className="py-2.5 px-4">Reference Interval</th>
                      <th className="py-2.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {report.biomarkers.map((bm) => (
                      <tr key={bm.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                          <div>{bm.name}</div>
                          {bm.loincCode && (
                            <span className="text-[10px] text-slate-400 font-mono">LOINC: {bm.loincCode}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {bm.resultValue} <span className="text-[11px] text-slate-500 font-normal">{bm.unit}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {bm.referenceRange} {bm.unit}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              bm.status === 'NORMAL'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : bm.status === 'CRITICAL'
                                ? 'bg-rose-600 text-white font-bold'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {bm.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Historical Trend Snapshot (If available) */}
          {report.historicalTrends && report.historicalTrends.length > 0 && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-extrabold text-slate-900">
                    3-Point Longitudinal Historical Progression
                  </span>
                </div>
                {onOpenTrend && (
                  <button
                    onClick={() => onOpenTrend(report)}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Interactive Trend Chart</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {report.historicalTrends.map((pt, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {new Date(pt.date).toLocaleDateString()}
                    </span>
                    <div className="text-base font-extrabold font-mono text-slate-900 mt-0.5">
                      {pt.displayValue} <span className="text-xs font-normal text-slate-500">{pt.unit}</span>
                    </div>
                    <span
                      className={`inline-block mt-1 px-2 py-0.2 rounded-full text-[9px] font-bold ${
                        pt.status === 'NORMAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {pt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attending Physician Clinical Note Section */}
          <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Physician Clinical Interpretation</span>
              </div>
              <button
                onClick={() => setIsEditingNote(!isEditingNote)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditingNote ? 'Cancel' : 'Edit Note'}</span>
              </button>
            </div>

            {isEditingNote ? (
              <div className="space-y-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Save Clinical Note
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {report.doctorNotes}
                </p>
                <div className="mt-2 text-[10px] text-slate-400 font-mono">
                  Documented by: {report.physicianNoteAuthor || 'Dr. Alexandra Chen, MD'} • {report.physicianNoteTimestamp ? new Date(report.physicianNoteTimestamp).toLocaleString() : 'Active Chart'}
                </div>
              </div>
            )}
          </div>

          {/* Specimen & Laboratory Accreditation Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">Specimen Details</span>
              <p className="text-slate-800 font-semibold">{report.specimen?.type || 'Venous Blood Sample'}</p>
              <p className="text-[11px] text-slate-500">Fasting Status: {report.specimen?.fastingStatus || 'Fasting (12 hrs)'}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">Performing Laboratory</span>
              <p className="text-slate-800 font-semibold">{report.performingLab?.name || 'Global Diagnostics Pathology Core'}</p>
              <p className="text-[11px] text-slate-500">CLIA ID: {report.performingLab?.cliaNumber || '05D9823194'} • {report.performingLab?.accreditation || 'CAP Accredited'}</p>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onPrint && (
              <button
                onClick={() => onPrint(report)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Diagnostic Report</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
