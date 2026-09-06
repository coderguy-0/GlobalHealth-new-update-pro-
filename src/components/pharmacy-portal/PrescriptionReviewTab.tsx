import React, { useState } from 'react';
import { 
  FileCheck2, 
  Search, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ShieldCheck, 
  User, 
  Clock, 
  Pill, 
  AlertTriangle, 
  FileText,
  Building2,
  ExternalLink
} from 'lucide-react';
import { PortalPrescriptionRecord, PrescriptionReviewStatus } from '../../types/pharmacyPortal';
import { PharmacyPortalService } from '../../services/pharmacyPortalStore';

interface PrescriptionReviewTabProps {
  prescriptions: PortalPrescriptionRecord[];
  onPrescriptionUpdated: () => void;
  selectedPrescriptionProp?: PortalPrescriptionRecord | null;
}

export const PrescriptionReviewTab: React.FC<PrescriptionReviewTabProps> = ({
  prescriptions,
  onPrescriptionUpdated,
  selectedPrescriptionProp
}) => {
  const [selectedRx, setSelectedRx] = useState<PortalPrescriptionRecord>(
    selectedPrescriptionProp || prescriptions[0] || null
  );
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [clarificationNotes, setClarificationNotes] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const filteredPrescriptions = prescriptions.filter(rx => {
    if (filterStatus === 'All') return true;
    return rx.status === filterStatus;
  });

  const handleReviewAction = (status: PrescriptionReviewStatus) => {
    if (!selectedRx) return;
    const updated = PharmacyPortalService.updatePrescriptionStatus(
      selectedRx.id,
      status,
      'Dr. S. K. Ramanathan, R.Ph (PCI-DL-184920)',
      clarificationNotes
    );
    if (updated) {
      setSelectedRx(updated);
    }
    setClarificationNotes('');
    onPrescriptionUpdated();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Statutory Pharmacist Sign-Off Required</span>
          </div>
          <h2 className="text-base font-black text-white">Registered Pharmacist Prescription Verification</h2>
          <p className="text-xs text-slate-400">
            Review uploaded doctor prescriptions, verify prescriber credentials, validate dosages, and digitally approve dispensing.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 text-xs">
          {['All', 'Awaiting Review', 'Approved', 'Clarification Required', 'Declined'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                filterStatus === st
                  ? 'bg-teal-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Col: Prescription Queue (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Inbox Queue ({filteredPrescriptions.length})
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredPrescriptions.map(rx => {
              const isSelected = selectedRx?.id === rx.id;
              return (
                <div
                  key={rx.id}
                  onClick={() => setSelectedRx(rx)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-slate-950 border-teal-500/50 shadow-md shadow-teal-500/10'
                      : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-teal-300 text-xs">{rx.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rx.status === 'Approved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : rx.status === 'Awaiting Review'
                        ? 'bg-amber-500/20 text-amber-300'
                        : rx.status === 'Clarification Required'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {rx.status}
                    </span>
                  </div>

                  <div>
                    <div className="font-bold text-white text-xs">{rx.patientName}</div>
                    <div className="text-[11px] text-slate-400 truncate">{rx.doctorName}</div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 font-mono">
                    <span>Order: {rx.orderId}</span>
                    <span>{rx.uploadedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Document & Clinical Inspection Workspace (8 cols) */}
        {selectedRx ? (
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white font-mono">{selectedRx.id}</h3>
                  <span className="text-xs text-slate-400">for Order #{selectedRx.orderId}</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Uploaded {selectedRx.uploadedAt}</div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedRx.status === 'Approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : selectedRx.status === 'Awaiting Review'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  Status: {selectedRx.status}
                </span>
              </div>
            </div>

            {/* Prescriber & Patient Metadata Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-teal-400" />
                  <span>Licensed Prescriber</span>
                </div>
                <div className="font-bold text-white">{selectedRx.doctorName}</div>
                <div className="text-teal-300 font-mono text-[11px]">Reg: {selectedRx.doctorRegNo}</div>
                <div className="text-slate-400 text-[11px]">{selectedRx.clinicHospitalName}</div>
                <div className="text-slate-500 text-[10px]">Rx Date: {selectedRx.prescriptionDate}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                  <User className="w-3 h-3 text-teal-400" />
                  <span>Patient Profile</span>
                </div>
                <div className="font-bold text-white">{selectedRx.patientName}</div>
                <div className="text-slate-300">Age: {selectedRx.patientAge} Yrs • Gender: {selectedRx.patientGender}</div>
                <div className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Digitally Signed Document</span>
                </div>
              </div>
            </div>

            {/* High-Resolution Document Inspection Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  <span>Prescription Document View</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-400">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(160, prev + 15))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="h-64 sm:h-72 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center relative group p-2">
                <img
                  src={selectedRx.documentUrl}
                  alt="Doctor Prescription Document"
                  className="max-h-full object-contain rounded-lg transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                />
              </div>
            </div>

            {/* Detected Medicines & Dosage Guidance */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                OCR Extracted Medications & Dosage Schedule
              </span>
              
              <div className="space-y-2">
                {selectedRx.detectedMedicines.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-white flex items-center gap-2">
                        <Pill className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>{m.name}</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Dosage: <span className="text-slate-200">{m.dosage}</span> • Frequency: <span className="text-slate-200">{m.frequency}</span> • Duration: <span className="text-slate-200">{m.duration}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-slate-400 text-[11px] block">Qty: {m.quantity}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        In Stock & Reserved
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pharmacist Action Console */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-teal-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Registered Pharmacist Decision Desk</span>
                </span>
                {selectedRx.reviewedByPharmacist && (
                  <span className="text-[10px] text-slate-400">
                    Signed by {selectedRx.reviewedByPharmacist} on {selectedRx.reviewedAt}
                  </span>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-slate-400 font-bold block text-[11px]">Pharmacist Clinical Remarks / Clarification Notes</label>
                <input
                  type="text"
                  value={clarificationNotes}
                  onChange={(e) => setClarificationNotes(e.target.value)}
                  placeholder="e.g. Verified with doctor clinic registry. Dosage and duration confirmed."
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
                <button
                  onClick={() => handleReviewAction('Declined')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Decline Prescription</span>
                </button>

                <button
                  onClick={() => handleReviewAction('Clarification Required')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-xs font-bold transition cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Ask Clarification</span>
                </button>

                <button
                  onClick={() => handleReviewAction('Approved')}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-teal-950/50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve & Authorize Order</span>
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-8 p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center text-slate-500">
            Select a prescription from the queue to start clinical verification.
          </div>
        )}

      </div>

    </div>
  );
};
