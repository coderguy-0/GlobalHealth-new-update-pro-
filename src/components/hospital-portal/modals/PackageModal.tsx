import React, { useState, useEffect } from 'react';
import { X, Package, AlertCircle, IndianRupee, Layers } from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';
import { SurgicalPackage } from '../../../types/hospitalPortal';

export const PackageModal: React.FC = () => {
  const { activeModal, modalPayload, closeModal, addPackage, updatePackage } = useHospitalPortal();

  const isEdit = Boolean(modalPayload && modalPayload.id);

  const [packageCode, setPackageCode] = useState('');
  const [packageName, setPackageName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [packagePrice, setPackagePrice] = useState(150000);
  const [stayDays, setStayDays] = useState(4);
  const [inclusionsStr, setInclusionsStr] = useState('');
  const [exclusionsStr, setExclusionsStr] = useState('');
  const [description, setDescription] = useState('');
  const [cashlessEmpaneled, setCashlessEmpaneled] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeModal === 'package_modal') {
      if (modalPayload && modalPayload.id) {
        const p: any = modalPayload;
        setPackageCode(p.packageCode || '');
        setPackageName(p.packageName || p.name || '');
        setSpecialty(p.specialty || p.department || 'Surgery');
        setPackagePrice(p.packagePrice || 150000);
        setStayDays(p.stayDays || p.estimatedStayDays || 4);
        setInclusionsStr(Array.isArray(p.inclusions) ? p.inclusions.join(', ') : '');
        setExclusionsStr(Array.isArray(p.exclusions) ? p.exclusions.join(', ') : '');
        setDescription(p.description || '');
        setCashlessEmpaneled(p.cashlessEmpaneled !== undefined ? p.cashlessEmpaneled : true);
      } else {
        setPackageCode(`PKG-${Math.floor(1000 + Math.random() * 9000)}`);
        setPackageName('');
        setSpecialty('General & Laparoscopic Surgery');
        setPackagePrice(85000);
        setStayDays(3);
        setInclusionsStr('Surgeon Fee, OT Charges, Anesthesia, 3 Days Room Rent, Routine Labs');
        setExclusionsStr('Specialized Implants, High-End Antibiotics, Extended ICU Stay');
        setDescription('');
        setCashlessEmpaneled(true);
      }
      setError('');
    }
  }, [activeModal, modalPayload]);

  if (activeModal !== 'package_modal') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageName.trim() || !packageCode.trim() || !packagePrice) {
      setError('Package Name, Code, and Package Price are required.');
      return;
    }

    const inclusions = inclusionsStr
      ? inclusionsStr.split(',').map((s) => s.trim()).filter(Boolean)
      : ['OT Charges', 'Surgeon Fee', 'Standard Stay'];
    const exclusions = exclusionsStr
      ? exclusionsStr.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Special Implants'];

    if (isEdit) {
      updatePackage(modalPayload.id, {
        packageCode,
        name: packageName,
        department: specialty,
        packagePrice: Number(packagePrice),
        estimatedStayDays: Number(stayDays),
        inclusions,
        exclusions,
        cashlessEmpaneled,
        ...(modalPayload.packageName ? { packageName } : {}),
        ...(modalPayload.specialty ? { specialty } : {}),
        ...(modalPayload.stayDays ? { stayDays: Number(stayDays) } : {}),
        ...(description ? { description } : {})
      } as any);
    } else {
      addPackage({
        packageCode,
        name: packageName,
        department: specialty,
        packagePrice: Number(packagePrice),
        estimatedStayDays: Number(stayDays),
        inclusions,
        exclusions,
        cashlessEmpaneled,
        ...(description ? { description } : {})
      } as any);
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17221E]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-[#DCEBE4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCEBE4] bg-[#F1FAF6]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#008F68] text-white">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17221E]">
                {isEdit ? 'Edit Surgical Package' : 'Create Bundled Surgical Package'}
              </h3>
              <p className="text-xs text-[#52635C]">
                Fixed-Tariff Bundles, Inpatient Stay, Clinical Inclusions & TPA Empanelment
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
              <label className="block text-xs font-bold text-[#52635C] mb-1">Package Full Name *</label>
              <input
                type="text"
                required
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="e.g. Total Knee Replacement (TKR) Unilateral"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Package Code *</label>
              <input
                type="text"
                required
                value={packageCode}
                onChange={(e) => setPackageCode(e.target.value)}
                placeholder="e.g. PKG-ORTHO-TKR"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl font-mono text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Specialty / Department</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g. Orthopedics & Joint Replacement"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Package Price (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={packagePrice}
                onChange={(e) => setPackagePrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl font-mono text-[#17221E] font-bold focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Inpatient Stay Days</label>
              <input
                type="number"
                min="1"
                value={stayDays}
                onChange={(e) => setStayDays(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">
              Inclusions List (comma separated) *
            </label>
            <input
              type="text"
              required
              value={inclusionsStr}
              onChange={(e) => setInclusionsStr(e.target.value)}
              placeholder="e.g. Surgeon Fee, Anesthesia, 3 Days Room, Pre-Op Investigations, OT Charges"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">
              Exclusions (comma separated)
            </label>
            <input
              type="text"
              value={exclusionsStr}
              onChange={(e) => setExclusionsStr(e.target.value)}
              placeholder="e.g. Specialized High-Cost Implants, Stay Beyond Included Days, Blood Transfusions"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Clinical Overview & Pre-requisites</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Standard clinical protocol, pre-authorization guidelines..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          <label className="flex items-center gap-2 p-3 rounded-xl border border-[#DCEBE4] bg-[#F6FBF8] cursor-pointer">
            <input
              type="checkbox"
              checked={cashlessEmpaneled}
              onChange={(e) => setCashlessEmpaneled(e.target.checked)}
              className="h-4 w-4 rounded text-[#008F68] focus:ring-[#008F68]"
            />
            <div className="text-xs">
              <span className="font-bold text-[#17221E] block">TPA Cashless Empaneled Package</span>
              <span className="text-[#52635C]">Eligible for direct cashless settlement across Star Health, Medi Assist, Max Bupa</span>
            </div>
          </label>

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
              <Package className="h-4 w-4" />
              <span>{isEdit ? 'Save Package Changes' : 'Publish Surgical Package'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
