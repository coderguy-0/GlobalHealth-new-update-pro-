import React, { useState } from 'react';
import { X, BedDouble, AlertCircle, ShieldCheck } from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const BedModal: React.FC = () => {
  const { activeModal, closeModal, addBed, wings } = useHospitalPortal();

  const [bedNumber, setBedNumber] = useState('');
  const [wingId, setWingId] = useState(wings[0]?.id || 'WING-SOUTH');
  const [floor, setFloor] = useState('Level 3');
  const [wardType, setWardType] = useState<'General Ward' | 'Semi-Private' | 'Private Deluxe' | 'ICU' | 'CCU' | 'NICU' | 'Isolation / Negative Pressure'>('ICU');
  const [dailyTariff, setDailyTariff] = useState(12500);
  const [oxygenSupported, setOxygenSupported] = useState(true);
  const [ventilatorAttached, setVentilatorAttached] = useState(true);
  const [multiparaMonitorAttached, setMultiparaMonitorAttached] = useState(true);
  const [error, setError] = useState('');

  if (activeModal !== 'add_bed') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bedNumber) {
      setError('Bed identifier / room number is required.');
      return;
    }

    const wing = wings.find((w) => w.id === wingId);

    addBed({
      bedNumber,
      wingId,
      wingName: wing?.name || 'Inpatient Wing',
      floor,
      wardType,
      dailyTariff: dailyTariff || 5000,
      status: 'Available',
      oxygenSupported,
      ventilatorAttached,
      multiparaMonitorAttached,
      lastSanitizedAt: new Date().toISOString()
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17221E]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#FFFFFF] rounded-2xl border border-[#DCEBE4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCEBE4] bg-[#F1FAF6]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#008F68] text-white">
              <BedDouble className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17221E]">Commission Inpatient / ICU Bed</h3>
              <p className="text-xs text-[#52635C]">Ward Allocation, Telemetry & Critical Life Support</p>
            </div>
          </div>
          <button onClick={closeModal} className="p-1.5 rounded-lg text-[#52635C] hover:bg-[#DCEBE4] transition cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FFF1F1] border border-[#F2CCCC] text-[#C53939] text-xs font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Bed Number / Code *</label>
              <input
                type="text"
                required
                value={bedNumber}
                onChange={(e) => setBedNumber(e.target.value)}
                placeholder="e.g. ICU-B-08"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] font-mono focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Floor Level</label>
              <input
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="Level 3"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Campus Wing</label>
              <select
                value={wingId}
                onChange={(e) => setWingId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                {wings.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Ward Classification</label>
              <select
                value={wardType}
                onChange={(e) => setWardType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                <option value="ICU">Intensive Care Unit (ICU)</option>
                <option value="CCU">Coronary Care Unit (CCU)</option>
                <option value="NICU">Neonatal ICU (NICU)</option>
                <option value="Isolation / Negative Pressure">Isolation / Negative Pressure</option>
                <option value="Private Deluxe">Private Deluxe Suite</option>
                <option value="Semi-Private">Semi-Private Room</option>
                <option value="General Ward">General Inpatient Ward</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Standard Daily Room Tariff (₹)</label>
            <input
              type="number"
              value={dailyTariff}
              onChange={(e) => setDailyTariff(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] font-bold focus:outline-none focus:border-[#008F68]"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#F1FAF6] border border-[#DCEBE4] space-y-3">
            <span className="text-xs font-bold text-[#17221E] block">On-Board Life Support Telemetry:</span>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={oxygenSupported}
                onChange={(e) => setOxygenSupported(e.target.checked)}
                className="h-4 w-4 rounded text-[#008F68] focus:ring-[#008F68]"
              />
              <span className="text-xs font-medium text-[#17221E]">Central Pipeline Oxygen Support (High Flow)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={ventilatorAttached}
                onChange={(e) => setVentilatorAttached(e.target.checked)}
                className="h-4 w-4 rounded text-[#008F68] focus:ring-[#008F68]"
              />
              <span className="text-xs font-medium text-[#17221E]">Dedicated Servo / Hamilton Mechanical Ventilator</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={multiparaMonitorAttached}
                onChange={(e) => setMultiparaMonitorAttached(e.target.checked)}
                className="h-4 w-4 rounded text-[#008F68] focus:ring-[#008F68]"
              />
              <span className="text-xs font-medium text-[#17221E]">7-Lead Multipara Vital Telemetry Monitor (ECG, SpO2, NIBP)</span>
            </label>
          </div>

          <div className="pt-4 border-t border-[#DCEBE4] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-xs font-bold text-[#52635C] hover:bg-[#F1FAF6] rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#008F68] hover:bg-[#007A59] rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Commission Bed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
