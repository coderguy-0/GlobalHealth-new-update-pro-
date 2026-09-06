import React, { useState } from 'react';
import {
  X,
  Plus,
  AlertTriangle,
  Zap,
  FlaskConical,
  Scan,
  User,
  Clock,
  ShieldAlert,
  Barcode,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useDiagnostics } from '../../../context/DiagnosticContext';
import { useHospitalPortal } from '../../../context/HospitalContext';
import { OrderPriority } from '../../../types/diagnostics';

export const NewRequisitionModal: React.FC = () => {
  const { activeModal, closeModal, createOrder, labTests, imagingServices } = useDiagnostics();
  const { doctors, appointments } = useHospitalPortal();

  const [orderType, setOrderType] = useState<'LABORATORY' | 'IMAGING'>('LABORATORY');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [patientId, setPatientId] = useState<string>('MRN-2026-9102');
  const [patientName, setPatientName] = useState<string>('Col. Jaswant Singh Rawat (Retd.)');
  const [patientAgeGender, setPatientAgeGender] = useState<string>('68Y / Male');
  const [patientLocation, setPatientLocation] = useState<string>('OPD Room 204');
  const [orderingDoctorName, setOrderingDoctorName] = useState<string>('Dr. Evelyn Martinez');
  const [priority, setPriority] = useState<OrderPriority>('ROUTINE');
  const [clinicalNotes, setClinicalNotes] = useState<string>('');

  if (activeModal !== 'new_requisition') return null;

  const selectedLab = labTests.find((t) => t.id === selectedServiceId);
  const selectedImaging = imagingServices.find((i) => i.id === selectedServiceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let serviceName = '';
    let serviceCode = '';
    let vacutainerColor = undefined;
    let pacsPresetId: 'CXR' | 'CT_BRAIN' | 'MRI_SPINE' | 'ANGIO' | undefined = undefined;

    if (orderType === 'LABORATORY') {
      const target = selectedLab || labTests[0];
      serviceName = target.name;
      serviceCode = target.testCode;
      vacutainerColor = target.vacutainerCapColor;
    } else {
      const target = selectedImaging || imagingServices[0];
      serviceName = target.name;
      serviceCode = target.aerbLicenseNo;
      if (target.modalityCode === 'CT') pacsPresetId = 'CT_BRAIN';
      else if (target.modalityCode === 'MRI') pacsPresetId = 'MRI_SPINE';
      else pacsPresetId = 'CXR';
    }

    createOrder({
      patientId: patientId.trim() || 'MRN-2026-0000',
      patientName: patientName.trim() || 'Patient Walk-In',
      patientAgeGender: patientAgeGender.trim() || '45Y / Unknown',
      patientLocation: patientLocation.trim() || 'OPD Chamber',
      orderingDoctorName: orderingDoctorName || 'Duty Medical Officer',
      priority,
      orderType,
      targetServiceId: selectedServiceId || (orderType === 'LABORATORY' ? labTests[0]?.id : imagingServices[0]?.id),
      serviceName,
      serviceCode,
      vacutainerColor,
      pacsPresetId,
      findingsReport: clinicalNotes ? `Clinical Indication: ${clinicalNotes}` : undefined
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#DCEBE4] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#17221E]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#DCEBE4] flex items-center justify-between bg-[#F6FBF8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#008F68]/10 text-[#008F68] flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17221E]">New Diagnostic Order Requisition</h2>
              <p className="text-xs text-[#52635C]">
                NABL ISO-15189 Phlebotomy Routing & AERB Radiation Safety Protocol
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Modality Stream Toggle */}
          <div>
            <label className="block font-semibold text-[#17221E] mb-2">Diagnostic Stream</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setOrderType('LABORATORY');
                  setSelectedServiceId(labTests[0]?.id || '');
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold transition text-xs cursor-pointer ${
                  orderType === 'LABORATORY'
                    ? 'border-[#008F68] bg-[#008F68]/5 text-[#008F68] shadow-xs'
                    : 'border-[#DCEBE4] bg-white text-[#52635C] hover:bg-slate-50'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                <span>🧪 Clinical Pathology / Lab ({labTests.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOrderType('IMAGING');
                  setSelectedServiceId(imagingServices[0]?.id || '');
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold transition text-xs cursor-pointer ${
                  orderType === 'IMAGING'
                    ? 'border-[#287EA8] bg-[#EAF6FB] text-[#287EA8] shadow-xs'
                    : 'border-[#DCEBE4] bg-white text-[#52635C] hover:bg-slate-50'
                }`}
              >
                <Scan className="w-4 h-4" />
                <span>🩻 Radiology & PACS Imaging ({imagingServices.length})</span>
              </button>
            </div>
          </div>

          {/* Test / Service Selector */}
          <div>
            <label className="block font-semibold text-[#17221E] mb-1.5">
              Select {orderType === 'LABORATORY' ? 'Pathology Test Formulary' : 'Radiology Modality Suite'}
            </label>
            {orderType === 'LABORATORY' ? (
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                {labTests.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.testCode} — {t.name} ({t.category}) • ₹{t.price}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#287EA8]"
              >
                {imagingServices.map((i) => (
                  <option key={i.id} value={i.id}>
                    [{i.modalityCode}] {i.name} • {i.roomSuite} • ₹{i.price}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Clinical Pre-Condition Warnings */}
          {selectedLab?.fastingRequired && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Overnight Fasting Mandatory: </span>
                This test requires 8–10 hours of fasting. Verify patient fasting status before phlebotomy.
              </div>
            </div>
          )}

          {selectedImaging?.creatininePreCheckRequired && (
            <div className="p-3 bg-[#EAF6FB] border border-[#287EA8]/30 rounded-xl flex items-start gap-2.5 text-[#287EA8] text-xs">
              <ShieldAlert className="w-4 h-4 text-[#287EA8] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Renal Function Pre-Check Mandatory: </span>
                Contrast administration requires recent serum creatinine / eGFR &gt; 60 mL/min/1.73m².
              </div>
            </div>
          )}

          {/* Priority Selection */}
          <div>
            <label className="block font-semibold text-[#17221E] mb-1.5">Triage Priority & Turnaround Commitment</label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['ROUTINE', 'URGENT', 'EMERGENCY STAT'] as OrderPriority[]).map((p) => {
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? p === 'EMERGENCY STAT'
                          ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-xs'
                          : p === 'URGENT'
                          ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-xs'
                          : 'border-[#008F68] bg-[#008F68]/10 text-[#008F68] shadow-xs'
                        : 'border-[#DCEBE4] bg-white text-[#52635C] hover:bg-slate-50'
                    }`}
                  >
                    {p === 'EMERGENCY STAT' && <Zap className="w-3.5 h-3.5 text-rose-600" />}
                    <span>{p}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Patient MRN</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="e.g. MRN-2026-9102"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Patient Full Name</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Patient Full Name"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Age / Gender</label>
              <input
                type="text"
                value={patientAgeGender}
                onChange={(e) => setPatientAgeGender(e.target.value)}
                placeholder="e.g. 58Y / Male"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Patient Location / Ward</label>
              <input
                type="text"
                value={patientLocation}
                onChange={(e) => setPatientLocation(e.target.value)}
                placeholder="e.g. ICU Bay 2 / OPD Suite 204"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                required
              />
            </div>
          </div>

          {/* Ordering Doctor & Clinical Indication */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Ordering Physician</label>
              <input
                type="text"
                value={orderingDoctorName}
                onChange={(e) => setOrderingDoctorName(e.target.value)}
                placeholder="e.g. Dr. Vikram Sethi (Cardiology)"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Clinical Indication / Diagnosis</label>
              <input
                type="text"
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="e.g. Acute chest pain, rule out STEMI"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          {/* Barcode & Specimen Info Preview */}
          <div className="p-3.5 bg-[#F6FBF8] border border-[#DCEBE4] rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Barcode className="w-4 h-4 text-[#008F68]" />
              <span className="font-medium text-[#52635C]">Automated Barcode & Tracking LIS Hook</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-[#008F68] bg-[#008F68]/10 px-2 py-0.5 rounded border border-[#008F68]/20">
              HL7 / FHIR v4 DISPATCH READY
            </span>
          </div>

          {/* Modal Footer */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#DCEBE4]">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl border border-[#DCEBE4] text-[#52635C] font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#008F68] hover:bg-[#007a58] text-white font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create Diagnostic Requisition</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
