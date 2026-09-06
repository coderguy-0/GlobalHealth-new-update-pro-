import React, { useState } from 'react';
import {
  Droplets,
  Plus,
  Minus,
  AlertCircle,
  Clock,
  ShieldCheck,
  Activity,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sparkles
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const BloodBankView: React.FC = () => {
  const { bloodBank, updateBloodStock, transfusions, createTransfusionRequest, currentHospital } = useHospitalPortal();

  const [showReqForm, setShowReqForm] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientMRN, setPatientMRN] = useState('');
  const [bloodGroup, setBloodGroup] = useState<any>('O-Positive (O+)');
  const [component, setComponent] = useState<any>('PRBC (Packed Red Blood Cells)');
  const [unitsRequested, setUnitsRequested] = useState(2);
  const [urgency, setUrgency] = useState<any>('STAT Emergency (Crossmatch ASAP)');
  const [clinicalIndication, setClinicalIndication] = useState('');

  // Interactive ABO/Rh Cross-Matching Matrix State
  const [recipientType, setRecipientType] = useState('A-Positive (A+)');

  // Compatibility Rules Map (PRBC Red Cells)
  const PRBC_COMPATIBILITY_MAP: Record<string, string[]> = {
    'O-Negative (O-)': ['O-Negative (O-)'],
    'O-Positive (O+)': ['O-Positive (O+)', 'O-Negative (O-)'],
    'A-Negative (A-)': ['A-Negative (A-)', 'O-Negative (O-)'],
    'A-Positive (A+)': ['A-Positive (A+)', 'A-Negative (A-)', 'O-Positive (O+)', 'O-Negative (O-)'],
    'B-Negative (B-)': ['B-Negative (B-)', 'O-Negative (O-)'],
    'B-Positive (B+)': ['B-Positive (B+)', 'B-Negative (B-)', 'O-Positive (O+)', 'O-Negative (O-)'],
    'AB-Negative (AB-)': ['AB-Negative (AB-)', 'A-Negative (A-)', 'B-Negative (B-)', 'O-Negative (O-)'],
    'AB-Positive (AB+)': ['AB-Positive (AB+)', 'AB-Negative (AB-)', 'A-Positive (A+)', 'A-Negative (A-)', 'B-Positive (B+)', 'B-Negative (B-)', 'O-Positive (O+)', 'O-Negative (O-)']
  };

  const compatibleDonors = PRBC_COMPATIBILITY_MAP[recipientType] || [];

  const handleCreateReq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;
    createTransfusionRequest({
      patientName,
      patientMRN: patientMRN || `MRN-${Math.floor(1000 + Math.random() * 9000)}`,
      bloodGroup,
      component,
      unitsRequested: unitsRequested || 1,
      urgency,
      orderingDoctor: 'Dr. Trauma Resuscitation Lead',
      department: 'Emergency & Trauma',
      clinicalIndication: clinicalIndication || 'Emergency Hemorrhage Resuscitation'
    });
    setPatientName('');
    setShowReqForm(false);
  };

  const handleTriggerMtp = () => {
    createTransfusionRequest({
      patientName: 'TRAUMA MASS CASUALTY PATIENT',
      patientMRN: `STAT-MTP-${Math.floor(100 + Math.random() * 900)}`,
      bloodGroup: 'O-Negative (O-)' as any,
      component: 'PRBC (Packed Red Blood Cells)' as any,
      unitsRequested: 4,
      urgency: 'STAT Emergency (Crossmatch ASAP)' as any,
      orderingDoctor: 'Dr. Marcus Brody (Trauma Attending)',
      department: 'Emergency & Trauma',
      clinicalIndication: 'Massive Transfusion Protocol (MTP 1:1:1 Package - 4 PRBC + 4 FFP + 1 Platelet Pack)'
    });
  };

  const totalPRBC = bloodBank.reduce((acc, curr) => acc + curr.prbcUnits, 0);
  const totalFFP = bloodBank.reduce((acc, curr) => acc + curr.ffpUnits, 0);
  const totalPlatelets = bloodBank.reduce((acc, curr) => acc + curr.plateletUnits, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Blood Bank Inventory & Transfusion Center</h1>
            <span className="text-xs font-mono font-bold bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-300">
              NABH Blood Center Licensed
            </span>
          </div>
          <p className="text-xs text-slate-600">
            All 8 Major ABO/Rh Blood Groups, Component Fractionation & STAT Massive Transfusion Protocol
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleTriggerMtp}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Zap className="h-4 w-4" />
            <span>Launch STAT MTP Pack (1:1:1)</span>
          </button>
          <button
            onClick={() => setShowReqForm(!showReqForm)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Droplets className="h-4 w-4" />
            <span>New Requisition</span>
          </button>
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-rose-700 block">Total PRBC Units</span>
          <div className="text-2xl font-bold text-rose-800 font-mono mt-1">{totalPRBC} Bags</div>
          <span className="text-[10px] text-slate-500">Packed Red Blood Cells (2-6°C Cold Chain)</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-teal-700 block">Total Fresh Frozen Plasma (FFP)</span>
          <div className="text-2xl font-bold text-teal-800 font-mono mt-1">{totalFFP} Units</div>
          <span className="text-[10px] text-slate-500">Coagulation Support (-30°C Cryo Vault)</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-amber-700 block">Random Donor Platelets (RDP/SDP)</span>
          <div className="text-2xl font-bold text-amber-800 font-mono mt-1">{totalPlatelets} Units</div>
          <span className="text-[10px] text-slate-500">Agitator Maintained (20-24°C)</span>
        </div>
      </div>

      {/* Interactive ABO/Rh Crossmatch Matrix */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>ABO / Rh (D) Red Cell Cross-Matching Matrix</span>
            </h3>
            <p className="text-xs text-slate-500">Select patient blood group to identify verified compatible donor types</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">RECIPIENT:</span>
            <select
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
            >
              {Object.keys(PRBC_COMPATIBILITY_MAP).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {Object.keys(PRBC_COMPATIBILITY_MAP).map((donorType) => {
            const isCompatible = compatibleDonors.includes(donorType);
            return (
              <div
                key={donorType}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  isCompatible
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <span>{donorType}</span>
                {isCompatible ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <span className="text-[10px] font-mono text-slate-400">Incompatible</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Request Form Drawer */}
      {showReqForm && (
        <form onSubmit={handleCreateReq} className="p-5 rounded-2xl bg-white border border-rose-300 shadow-md space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            <span>STAT Blood Transfusion Requisition</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Patient Full Name</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. David K. Miller"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Patient MRN</label>
              <input
                type="text"
                value={patientMRN}
                onChange={(e) => setPatientMRN(e.target.value)}
                placeholder="e.g. MRN-78401-09"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
              >
                <option value="O-Positive (O+)">O-Positive (O+)</option>
                <option value="O-Negative (O-)">O-Negative (O-) [Universal]</option>
                <option value="A-Positive (A+)">A-Positive (A+)</option>
                <option value="A-Negative (A-)">A-Negative (A-)</option>
                <option value="B-Positive (B+)">B-Positive (B+)</option>
                <option value="B-Negative (B-)">B-Negative (B-)</option>
                <option value="AB-Positive (AB+)">AB-Positive (AB+)</option>
                <option value="AB-Negative (AB-)">AB-Negative (AB-)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowReqForm(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Issue Crossmatch Order
            </button>
          </div>
        </form>
      )}

      {/* Blood Bank Reserves Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {bloodBank.map((item) => {
          const isCritical = item.prbcUnits < item.criticalMinThreshold;
          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl bg-white border transition shadow-xs space-y-3 ${
                isCritical ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">{item.bloodGroup}</h3>
                  <span className="text-[10px] text-slate-500 font-mono">Stock Rack: 04-A</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isCritical
                      ? 'bg-rose-100 text-rose-800 animate-pulse'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isCritical ? 'CRITICAL DEFICIT' : 'OPTIMAL'}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">PRBC Units:</span>
                  <span className="font-mono font-bold text-slate-900">{item.prbcUnits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">FFP Bags:</span>
                  <span className="font-mono font-bold text-slate-900">{item.ffpUnits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Platelets:</span>
                  <span className="font-mono font-bold text-slate-900">{item.plateletUnits}</span>
                </div>
              </div>

              {/* Stock Modification Actions */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => updateBloodStock(item.id, 'prbcUnits', 1)}
                  className="flex-1 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
                >
                  + PRBC
                </button>
                <button
                  onClick={() => updateBloodStock(item.id, 'prbcUnits', -1)}
                  disabled={item.prbcUnits <= 0}
                  className="flex-1 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs disabled:opacity-40 cursor-pointer"
                >
                  - PRBC
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
