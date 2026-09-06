import React, { useState, useEffect } from 'react';
import { X, Building, AlertCircle, Layers, Shield } from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';
import { Wing } from '../../../types/hospitalPortal';

export const WingModal: React.FC = () => {
  const { activeModal, modalPayload, closeModal, addWing, updateWing } = useHospitalPortal();

  const isEdit = Boolean(modalPayload && modalPayload.id);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [floors, setFloors] = useState('Level 1 to 5');
  const [totalBeds, setTotalBeds] = useState(200);
  const [securityZone, setSecurityZone] = useState<Wing['securityZone']>('Semi-Sterile Inpatient');
  const [hasHelipad, setHasHelipad] = useState(false);
  const [hasDedicatedICU, setHasDedicatedICU] = useState(true);
  const [leadNurseSupervisor, setLeadNurseSupervisor] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeModal === 'wing_modal') {
      if (modalPayload && modalPayload.id) {
        const w: Wing = modalPayload;
        setName(w.name || '');
        setCode(w.code || '');
        setFloors(w.floors || (w as any).totalFloors ? `${(w as any).totalFloors} Floors` : 'Level 1 to 5');
        setTotalBeds(w.totalBeds || (w as any).totalBedsCount || 150);
        setSecurityZone(w.securityZone || 'Semi-Sterile Inpatient');
        setHasHelipad(Boolean(w.hasHelipad));
        setHasDedicatedICU(Boolean(w.hasDedicatedICU));
        setLeadNurseSupervisor(w.leadNurseSupervisor || '');
      } else {
        setName('');
        setCode(`WT-${Math.floor(10 + Math.random() * 90)}`);
        setFloors('Level 1 to 4');
        setTotalBeds(120);
        setSecurityZone('Semi-Sterile Inpatient');
        setHasHelipad(false);
        setHasDedicatedICU(true);
        setLeadNurseSupervisor('');
      }
      setError('');
    }
  }, [activeModal, modalPayload]);

  if (activeModal !== 'wing_modal') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setError('Wing name and code are required.');
      return;
    }

    if (isEdit) {
      updateWing(modalPayload.id, {
        name,
        code,
        floors,
        totalBeds: Number(totalBeds),
        securityZone,
        hasHelipad,
        hasDedicatedICU,
        leadNurseSupervisor: leadNurseSupervisor || 'Floor Nursing Station Supervisor',
        ...(modalPayload.totalFloors ? { totalFloors: Number(floors.replace(/\D/g, '')) || 4 } : {}),
        ...(modalPayload.totalBedsCount ? { totalBedsCount: Number(totalBeds) } : {})
      } as any);
    } else {
      addWing({
        name,
        code,
        floors,
        totalBeds: Number(totalBeds),
        occupiedBeds: 0,
        securityZone,
        hasHelipad,
        hasDedicatedICU,
        leadNurseSupervisor: leadNurseSupervisor || 'Floor Nursing Station Supervisor'
      });
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17221E]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-[#DCEBE4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCEBE4] bg-[#F1FAF6]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#008F68] text-white">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17221E]">
                {isEdit ? 'Edit Campus Wing' : 'Commission Campus Wing'}
              </h3>
              <p className="text-xs text-[#52635C]">
                Structural Tower Topology, Floor Span & Bed Capacity Quota
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-[#52635C] hover:bg-[#DCEBE4] transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FFF1F1] border border-[#F2CCCC] text-[#C53939] text-xs font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#52635C] mb-1">Campus Wing / Tower Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. South Tower (Surgical & Cardiac Pavilion)"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Wing Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. ST-01"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl font-mono text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Floor Span Levels</label>
              <input
                type="text"
                value={floors}
                onChange={(e) => setFloors(e.target.value)}
                placeholder="e.g. Level 1 to 6"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Target Total Beds</label>
              <input
                type="number"
                min="10"
                value={totalBeds}
                onChange={(e) => setTotalBeds(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Security & Bio-Safety Zone</label>
            <select
              value={securityZone}
              onChange={(e) => setSecurityZone(e.target.value as any)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            >
              <option value="Sterile OR Zone">Sterile OR Zone</option>
              <option value="Semi-Sterile Inpatient">Semi-Sterile Inpatient</option>
              <option value="Isolation Clean Room">Isolation Clean Room (Negative Pressure)</option>
              <option value="Emergency Access">Emergency Access (Rapid Trauma)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Lead Nurse Supervisor / Matron</label>
            <input
              type="text"
              value={leadNurseSupervisor}
              onChange={(e) => setLeadNurseSupervisor(e.target.value)}
              placeholder="e.g. Sister Rachel Adams, RN, BSN"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          {/* Amenities & Capabilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2 p-3 rounded-xl border border-[#DCEBE4] bg-[#F6FBF8] cursor-pointer">
              <input
                type="checkbox"
                checked={hasDedicatedICU}
                onChange={(e) => setHasDedicatedICU(e.target.checked)}
                className="h-4 w-4 rounded text-[#008F68] focus:ring-[#008F68]"
              />
              <div className="text-xs">
                <span className="font-bold text-[#17221E] block">Dedicated ICU Ward</span>
                <span className="text-[#52635C]">Has CCU/ICU ventilator beds</span>
              </div>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-[#DCEBE4] bg-[#F6FBF8] cursor-pointer">
              <input
                type="checkbox"
                checked={hasHelipad}
                onChange={(e) => setHasHelipad(e.target.checked)}
                className="h-4 w-4 rounded text-[#008F68] focus:ring-[#008F68]"
              />
              <div className="text-xs">
                <span className="font-bold text-[#17221E] block">Rooftop Helipad</span>
                <span className="text-[#52635C]">Rapid air ambulance airlift bay</span>
              </div>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DCEBE4]">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-xs font-bold text-[#52635C] hover:bg-[#F1FAF6] rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Building className="h-4 w-4" />
              <span>{isEdit ? 'Save Wing Details' : 'Add Campus Wing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
