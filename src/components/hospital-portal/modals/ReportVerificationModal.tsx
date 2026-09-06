import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  ShieldAlert,
  Zap,
  Activity,
  Award
} from 'lucide-react';
import { useDiagnostics } from '../../../context/DiagnosticContext';

export const ReportVerificationModal: React.FC = () => {
  const { activeModal, selectedOrder, closeModal, verifyReport } = useDiagnostics();

  const isLab = selectedOrder?.orderType === 'LABORATORY';
  
  const [quantitativeValue, setQuantitativeValue] = useState(
    selectedOrder?.quantitativeValue || (isLab ? '14.2' : '')
  );
  const [findingsReport, setFindingsReport] = useState(
    selectedOrder?.findingsReport || (isLab ? 'Specimen evaluated within validated analytical calibration range.' : 'Normal visual anatomic study without focal lesions or acute disruption.')
  );
  const [impression, setImpression] = useState(
    selectedOrder?.impression || (isLab ? 'Parameters consistent with standard physiological reference intervals.' : '1. No evidence of acute pathology.')
  );
  const [verifiedByDoctor, setVerifiedByDoctor] = useState(
    isLab ? 'Dr. Sunita Rao, MD (Pathology)' : 'Prof. Dr. Rajesh Gopinath, MD (Radiology)'
  );
  const [isPanicValue, setIsPanicValue] = useState(selectedOrder?.isPanicValue || false);
  const [panicValueNote, setPanicValueNote] = useState(
    selectedOrder?.panicValueNote || 'CRITICAL PANIC TRIGGER: Parameter exceeds immediate clinical threshold. Attending physician notified immediately.'
  );

  if (activeModal !== 'verify_report' || !selectedOrder) return null;

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();

    verifyReport(selectedOrder.orderId, {
      quantitativeValue: quantitativeValue.trim() || undefined,
      findingsReport: findingsReport.trim() || undefined,
      impression: impression.trim() || undefined,
      verifiedByDoctor: verifiedByDoctor.trim() || 'Attending Specialist',
      isPanicValue,
      panicValueNote: isPanicValue ? panicValueNote.trim() : undefined
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#DCEBE4] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#17221E]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DCEBE4] flex items-center justify-between bg-[#F6FBF8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#008F68]/10 text-[#008F68] flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17221E]">Authorize & Sign Diagnostic Report</h2>
              <p className="text-xs text-[#52635C]">
                NABL ISO-15189 Digital Sign-Off • Order {selectedOrder.orderId}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleAuthorize} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Order Details Header */}
          <div className="p-3.5 bg-[#F6FBF8] border border-[#DCEBE4] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-sm text-[#17221E]">{selectedOrder.patientName}</div>
              <div className="text-[11px] text-[#52635C]">
                {selectedOrder.patientId} • {selectedOrder.patientAgeGender} • {selectedOrder.patientLocation}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-xs text-[#17221E]">{selectedOrder.serviceName}</div>
              <div className="font-mono text-[10px] text-slate-400">Requisition: {selectedOrder.serviceCode}</div>
            </div>
          </div>

          {/* Quantitative Value for Labs */}
          {isLab && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#17221E] mb-1">
                  Quantitative Analyte Result
                </label>
                <input
                  type="text"
                  value={quantitativeValue}
                  onChange={(e) => setQuantitativeValue(e.target.value)}
                  placeholder="e.g. 0.08"
                  className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl font-mono font-bold text-sm text-[#17221E] focus:outline-none focus:border-[#008F68]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17221E] mb-1">
                  Unit & Standard Reference Interval
                </label>
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-mono">
                  {selectedOrder.unitOfMeasure || 'Standard Units'} (Ref: {selectedOrder.normalRange || 'Established Biological Limits'})
                </div>
              </div>
            </div>
          )}

          {/* Qualitative Findings */}
          <div>
            <label className="block font-semibold text-[#17221E] mb-1">
              Structured {isLab ? 'Analytical Findings & Differential' : 'Radiological Findings'}
            </label>
            <textarea
              rows={3}
              value={findingsReport}
              onChange={(e) => setFindingsReport(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68] resize-none"
              placeholder="Enter detailed morphologic / imaging description..."
            />
          </div>

          {/* Clinical Impression */}
          <div>
            <label className="block font-semibold text-[#17221E] mb-1">
              Clinical Impression / Conclusion
            </label>
            <textarea
              rows={2}
              value={impression}
              onChange={(e) => setImpression(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68] resize-none"
              placeholder="Summary clinical impression for attending physician..."
            />
          </div>

          {/* Critical Panic Value Toggle */}
          <div className={`p-4 rounded-xl border transition ${
            isPanicValue ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200'
          }`}>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isPanicValue}
                onChange={(e) => setIsPanicValue(e.target.checked)}
                className="rounded border-rose-400 text-rose-600 focus:ring-rose-500 w-4 h-4"
              />
              <div className="flex items-center gap-1.5 font-bold text-rose-700 text-xs">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Flag as Critical Panic Value (Immediate Physician Escalation)</span>
              </div>
            </label>

            {isPanicValue && (
              <div className="mt-2.5 space-y-1.5">
                <label className="block text-[11px] font-semibold text-rose-800">
                  Panic Alert Escalation Protocol Note:
                </label>
                <input
                  type="text"
                  value={panicValueNote}
                  onChange={(e) => setPanicValueNote(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-rose-300 rounded-lg text-rose-900 text-xs focus:outline-none focus:border-rose-600"
                />
              </div>
            )}
          </div>

          {/* Doctor Signature */}
          <div>
            <label className="block font-semibold text-[#17221E] mb-1">
              Authorizing Specialist / Consultant Sign-Off
            </label>
            <input
              type="text"
              value={verifiedByDoctor}
              onChange={(e) => setVerifiedByDoctor(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              required
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#DCEBE4]">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl border border-[#DCEBE4] text-[#52635C] font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-white font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
                isPanicValue
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-[#008F68] hover:bg-[#007a58]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isPanicValue ? 'Authorize & Dispatch Critical Panic' : 'Authorize & Publish Verified Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
