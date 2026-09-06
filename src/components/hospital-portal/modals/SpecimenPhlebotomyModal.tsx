import React, { useState } from 'react';
import {
  X,
  Barcode,
  CheckCircle2,
  Clock,
  FlaskConical,
  AlertTriangle,
  User,
  ShieldCheck,
  Printer,
  Sparkles
} from 'lucide-react';
import { useDiagnostics } from '../../../context/DiagnosticContext';

export const SpecimenPhlebotomyModal: React.FC = () => {
  const { activeModal, selectedOrder, closeModal, collectSample, processAnalyzer } = useDiagnostics();

  const [barcodeInput, setBarcodeInput] = useState(
    selectedOrder?.specimenBarcode || `BAR-${Math.floor(10000000 + Math.random() * 90000000)}`
  );
  const [tubeInverted, setTubeInverted] = useState(true);
  const [sampleVolumeOk, setSampleVolumeOk] = useState(true);
  const [phlebotomistName, setPhlebotomistName] = useState('Senior Phlebotomist Meera Sen');

  if (activeModal !== 'phlebotomy_barcode' || !selectedOrder) return null;

  const handleCollect = () => {
    collectSample(selectedOrder.orderId, barcodeInput);
    closeModal();
  };

  const handleCollectAndDispatch = () => {
    collectSample(selectedOrder.orderId, barcodeInput);
    processAnalyzer(selectedOrder.orderId);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#DCEBE4] shadow-2xl max-w-lg w-full overflow-hidden text-[#17221E]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DCEBE4] flex items-center justify-between bg-[#F6FBF8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#008F68]/10 text-[#008F68] flex items-center justify-center">
              <Barcode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17221E]">Phlebotomy & Specimen Ingestion</h2>
              <p className="text-xs text-[#52635C]">
                Order {selectedOrder.orderId} • Barcode Validation
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
        <div className="p-6 space-y-4 text-xs">
          {/* Patient Card */}
          <div className="p-3.5 bg-[#F6FBF8] border border-[#DCEBE4] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#17221E]">{selectedOrder.patientName}</span>
              <span className="font-mono text-xs font-bold text-[#008F68] bg-[#008F68]/10 px-2 py-0.5 rounded">
                {selectedOrder.patientId}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[#52635C]">
              <div><span className="text-slate-400">Location:</span> {selectedOrder.patientLocation || 'OPD'}</div>
              <div><span className="text-slate-400">Demographics:</span> {selectedOrder.patientAgeGender}</div>
              <div><span className="text-slate-400">Test Ordered:</span> {selectedOrder.serviceName}</div>
              <div><span className="text-slate-400">Ordering Dr:</span> {selectedOrder.orderingDoctorName}</div>
            </div>
          </div>

          {/* Vacutainer Tube Specimen Check */}
          {selectedOrder.vacutainerColor && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#008F68]" />
                <div>
                  <div className="font-bold text-[#17221E]">Required Vacutainer Tube</div>
                  <div className="text-[11px] text-[#52635C]">{selectedOrder.vacutainerColor}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-white border border-slate-200 shadow-2xs">
                STANDARD INVERSION (8-10x)
              </span>
            </div>
          )}

          {/* Barcode Scanner / Input */}
          <div>
            <label className="block font-semibold text-[#17221E] mb-1">Specimen Barcode Tag</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl font-mono font-bold text-sm text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
              <button
                type="button"
                onClick={() => setBarcodeInput(`BAR-${Math.floor(10000000 + Math.random() * 90000000)}`)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition cursor-pointer"
              >
                Regenerate
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#17221E] mb-1">Phlebotomist / Technician</label>
            <input
              type="text"
              value={phlebotomistName}
              onChange={(e) => setPhlebotomistName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          {/* Quality checklist */}
          <div className="space-y-2 pt-1 border-t border-[#DCEBE4]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tubeInverted}
                onChange={(e) => setTubeInverted(e.target.checked)}
                className="rounded border-[#DCEBE4] text-[#008F68] focus:ring-[#008F68]"
              />
              <span className="font-medium text-[#17221E]">Tube inverted per protocol (No micro-clots)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sampleVolumeOk}
                onChange={(e) => setSampleVolumeOk(e.target.checked)}
                className="rounded border-[#DCEBE4] text-[#008F68] focus:ring-[#008F68]"
              />
              <span className="font-medium text-[#17221E]">Specimen volume adequate (Adequate draw line)</span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#DCEBE4]">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl border border-[#DCEBE4] text-[#52635C] font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCollect}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition cursor-pointer"
            >
              Mark Collected
            </button>
            <button
              type="button"
              onClick={handleCollectAndDispatch}
              className="px-4 py-2 rounded-xl bg-[#008F68] hover:bg-[#007a58] text-white font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Collect & Dispatch to Analyzer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
