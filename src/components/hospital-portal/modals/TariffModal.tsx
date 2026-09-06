import React, { useState, useEffect } from 'react';
import { X, Tag, AlertCircle, IndianRupee, Layers } from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';
import { ServiceTariff } from '../../../types/hospitalPortal';

export const TariffModal: React.FC = () => {
  const { activeModal, modalPayload, closeModal, addTariff, updateTariff } = useHospitalPortal();

  const isEdit = Boolean(modalPayload && modalPayload.id);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceTariff['category']>('Consultation & OPD');
  const [standardPrice, setStandardPrice] = useState(1500);
  const [typicalDuration, setTypicalDuration] = useState('30 Mins');
  const [description, setDescription] = useState('');
  const [insuranceCovered, setInsuranceCovered] = useState(true);
  const [tpaPreAuthRequired, setTpaPreAuthRequired] = useState(false);
  const [anesthesiaRequired, setAnesthesiaRequired] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeModal === 'tariff_modal') {
      if (modalPayload && modalPayload.id) {
        const t: ServiceTariff = modalPayload;
        setCode(t.code || '');
        setName(t.name || '');
        setCategory(t.category || 'Consultation & OPD');
        setStandardPrice(t.standardPrice || (t as any).price || 1500);
        setTypicalDuration(t.typicalDuration || '30 Mins');
        setDescription(t.description || '');
        setInsuranceCovered(t.insuranceCovered !== undefined ? t.insuranceCovered : true);
        setTpaPreAuthRequired(Boolean(t.tpaPreAuthRequired));
        setAnesthesiaRequired(Boolean(t.anesthesiaRequired));
      } else {
        setCode(`CPT-${Math.floor(10000 + Math.random() * 90000)}`);
        setName('');
        setCategory('Consultation & OPD');
        setStandardPrice(1200);
        setTypicalDuration('30 Mins');
        setDescription('');
        setInsuranceCovered(true);
        setTpaPreAuthRequired(false);
        setAnesthesiaRequired(false);
      }
      setError('');
    }
  }, [activeModal, modalPayload]);

  if (activeModal !== 'tariff_modal') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !standardPrice) {
      setError('Service / Procedure Name, Code, and Standard Price are required.');
      return;
    }

    if (isEdit) {
      updateTariff(modalPayload.id, {
        code,
        name,
        category,
        standardPrice: Number(standardPrice),
        typicalDuration,
        description,
        insuranceCovered,
        tpaPreAuthRequired,
        anesthesiaRequired,
        ...(modalPayload.price ? { price: Number(standardPrice) } : {})
      } as any);
    } else {
      addTariff({
        code,
        name,
        category,
        standardPrice: Number(standardPrice),
        typicalDuration,
        description,
        insuranceCovered,
        tpaPreAuthRequired,
        anesthesiaRequired
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
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17221E]">
                {isEdit ? 'Edit Service / Procedure Tariff' : 'Add New Service Tariff'}
              </h3>
              <p className="text-xs text-[#52635C]">
                Institutional Fee Master, Insurance Eligibility & Procedure Timing
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
              <label className="block text-xs font-bold text-[#52635C] mb-1">Service / Procedure Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 3T Brain MRI with Contrast"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Tariff / CPT Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CPT-70553"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl font-mono text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Clinical Service Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                <option value="Consultation & OPD">Consultation & OPD</option>
                <option value="Radiology & Imaging">Radiology & Imaging</option>
                <option value="Pathology & Lab">Pathology & Lab</option>
                <option value="Surgical Procedures">Surgical Procedures</option>
                <option value="Critical Care & ICU">Critical Care & ICU</option>
                <option value="Nursing & Daycare">Nursing & Daycare</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Standard Institutional Price (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={standardPrice}
                onChange={(e) => setStandardPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl font-mono text-[#17221E] font-bold focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Typical Duration / Turnaround</label>
            <input
              type="text"
              value={typicalDuration}
              onChange={(e) => setTypicalDuration(e.target.value)}
              placeholder="e.g. 45 Mins (Report in 4 Hours)"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Clinical Protocol & Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Clinical preparation instructions, contrast administration, fasting required..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          {/* Flags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#DCEBE4] bg-[#F6FBF8] cursor-pointer">
              <input
                type="checkbox"
                checked={insuranceCovered}
                onChange={(e) => setInsuranceCovered(e.target.checked)}
                className="h-4 w-4 rounded text-[#008F68] focus:ring-[#008F68]"
              />
              <span className="text-xs font-semibold text-[#17221E]">Insurance Covered</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#DCEBE4] bg-[#F6FBF8] cursor-pointer">
              <input
                type="checkbox"
                checked={tpaPreAuthRequired}
                onChange={(e) => setTpaPreAuthRequired(e.target.checked)}
                className="h-4 w-4 rounded text-[#008F68] focus:ring-[#008F68]"
              />
              <span className="text-xs font-semibold text-[#17221E]">TPA Pre-Auth Req</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#DCEBE4] bg-[#F6FBF8] cursor-pointer">
              <input
                type="checkbox"
                checked={anesthesiaRequired}
                onChange={(e) => setAnesthesiaRequired(e.target.checked)}
                className="h-4 w-4 rounded text-[#008F68] focus:ring-[#008F68]"
              />
              <span className="text-xs font-semibold text-[#17221E]">Anesthesia Req</span>
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
              <Tag className="h-4 w-4" />
              <span>{isEdit ? 'Update Tariff Master' : 'Save Service Tariff'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
