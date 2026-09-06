import React, { useState } from 'react';
import {
  X,
  Scan,
  CheckCircle2,
  ShieldCheck,
  Radio,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { useDiagnostics } from '../../../context/DiagnosticContext';
import { ImagingModalityCode, BodyRegion } from '../../../types/diagnostics';

export const AddImagingModal: React.FC = () => {
  const { activeModal, closeModal, addImagingService } = useDiagnostics();

  const [modalityCode, setModalityCode] = useState<ImagingModalityCode>('CT');
  const [name, setName] = useState('');
  const [bodyRegion, setBodyRegion] = useState<BodyRegion>('Head & Neck');
  const [aerbLicenseNo, setAerbLicenseNo] = useState('AERB/RSD/DL-CT-2026-');
  const [contrastRequired, setContrastRequired] = useState(false);
  const [creatininePreCheckRequired, setCreatininePreCheckRequired] = useState(false);
  const [radiationDoseEstimate, setRadiationDoseEstimate] = useState('1.8 mSv');
  const [averageScanDurationMinutes, setAverageScanDurationMinutes] = useState(15);
  const [price, setPrice] = useState(5500);
  const [scannerModel, setScannerModel] = useState('Siemens SOMATOM 128-Slice CT');
  const [roomSuite, setRoomSuite] = useState('Radiology Suite R-02');
  const [leadShieldingThickness, setLeadShieldingThickness] = useState('2.0 mm Pb Equivalent (BARC Approved)');
  const [pacsStoragePath, setPacsStoragePath] = useState('APEX_RAD_NODE1');

  if (activeModal !== 'add_imaging') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addImagingService({
      modalityCode,
      name: name.trim(),
      bodyRegion,
      aerbLicenseNo: aerbLicenseNo.trim() || 'AERB/PENDING/2026',
      contrastRequired,
      creatininePreCheckRequired: contrastRequired ? true : creatininePreCheckRequired,
      radiationDoseEstimate: modalityCode === 'MRI' || modalityCode === 'USG' ? '0 mSv (Non-Ionizing)' : radiationDoseEstimate.trim(),
      averageScanDurationMinutes: Number(averageScanDurationMinutes) || 15,
      price: Number(price) || 3000,
      scannerModel: scannerModel.trim() || 'High-Resolution Diagnostic Scanner',
      roomSuite: roomSuite.trim() || 'Diagnostic Imaging Suite',
      leadShieldingThickness: leadShieldingThickness.trim() || '2.0 mm Pb Equivalent',
      pacsStoragePath: pacsStoragePath.trim() || 'APEX_PACS_STORE'
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#DCEBE4] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#17221E]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DCEBE4] flex items-center justify-between bg-[#F6FBF8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#287EA8]/10 text-[#287EA8] flex items-center justify-center">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17221E]">Enroll Radiology & Imaging Suite</h2>
              <p className="text-xs text-[#52635C]">
                AERB & BARC Radiation Safety Compliant Modality Master
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Modality Code</label>
              <select
                value={modalityCode}
                onChange={(e) => {
                  const code = e.target.value as ImagingModalityCode;
                  setModalityCode(code);
                  if (code === 'MRI' || code === 'USG') {
                    setRadiationDoseEstimate('0 mSv (Non-Ionizing)');
                  } else if (code === 'CT') {
                    setRadiationDoseEstimate('2.1 mSv');
                  } else if (code === 'DR') {
                    setRadiationDoseEstimate('0.04 mSv');
                  } else if (code === 'PET-CT') {
                    setRadiationDoseEstimate('6.5 mSv');
                  }
                }}
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#287EA8]"
              >
                <option value="CT">CT (Computed Tomography)</option>
                <option value="MRI">MRI (Magnetic Resonance)</option>
                <option value="DR">DR (Digital Radiography X-Ray)</option>
                <option value="USG">USG (Ultrasound Doppler)</option>
                <option value="MAMMO">MAMMO (Mammography)</option>
                <option value="DEXA">DEXA (Bone Densitometry)</option>
                <option value="PET-CT">PET-CT (Nuclear Medicine)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#17221E] mb-1">Service & Protocol Title</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 128-Slice HRCT Chest with 3D Lung Nodules CAD"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#287EA8]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Body Anatomical Region</label>
              <select
                value={bodyRegion}
                onChange={(e) => setBodyRegion(e.target.value as BodyRegion)}
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#287EA8]"
              >
                <option value="Head & Neck">Head & Neck</option>
                <option value="Thorax / Chest">Thorax / Chest</option>
                <option value="Abdomen & Pelvis">Abdomen & Pelvis</option>
                <option value="Musculoskeletal">Musculoskeletal</option>
                <option value="Spine">Spine</option>
                <option value="Cardiac">Cardiac</option>
                <option value="Whole Body">Whole Body</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#17221E] mb-1">AERB License / e-LORA Number</label>
              <input
                type="text"
                value={aerbLicenseNo}
                onChange={(e) => setAerbLicenseNo(e.target.value)}
                placeholder="e.g. AERB/RSD/DL-CT-2026-9912"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#287EA8]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Scanner Hardware Model</label>
              <input
                type="text"
                value={scannerModel}
                onChange={(e) => setScannerModel(e.target.value)}
                placeholder="e.g. GE 128-Slice Optima"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#287EA8]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Room / Suite Location</label>
              <input
                type="text"
                value={roomSuite}
                onChange={(e) => setRoomSuite(e.target.value)}
                placeholder="e.g. Suite R-01 (Ground Floor)"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#287EA8]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Radiation Exposure (mSv)</label>
              <input
                type="text"
                value={radiationDoseEstimate}
                onChange={(e) => setRadiationDoseEstimate(e.target.value)}
                placeholder="e.g. 2.1 mSv"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#287EA8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Avg Slot Duration (mins)</label>
              <input
                type="number"
                value={averageScanDurationMinutes}
                onChange={(e) => setAverageScanDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#287EA8]"
                min="5"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Tariff Fee (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#287EA8]"
                min="0"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#17221E] mb-1">DICOM AE Node Title</label>
              <input
                type="text"
                value={pacsStoragePath}
                onChange={(e) => setPacsStoragePath(e.target.value)}
                placeholder="e.g. APEX_CT_NODE1"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#287EA8]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#17221E] mb-1">BARC Lead Shielding Verification</label>
            <input
              type="text"
              value={leadShieldingThickness}
              onChange={(e) => setLeadShieldingThickness(e.target.value)}
              placeholder="e.g. 2.0 mm Pb Equivalent Lead Glass & Wall Lining"
              className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#287EA8]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={contrastRequired}
                onChange={(e) => {
                  setContrastRequired(e.target.checked);
                  if (e.target.checked) setCreatininePreCheckRequired(true);
                }}
                className="rounded border-[#DCEBE4] text-[#287EA8] focus:ring-[#287EA8]"
              />
              <span className="font-semibold text-[#17221E]">Requires IV Contrast Injection</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={creatininePreCheckRequired}
                onChange={(e) => setCreatininePreCheckRequired(e.target.checked)}
                className="rounded border-[#DCEBE4] text-[#287EA8] focus:ring-[#287EA8]"
              />
              <span className="font-semibold text-[#17221E]">Mandatory Serum Creatinine Pre-Screen</span>
            </label>
          </div>

          {/* Footer */}
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
              className="px-5 py-2 rounded-xl bg-[#287EA8] hover:bg-[#20698c] text-white font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Register Radiology Suite</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
