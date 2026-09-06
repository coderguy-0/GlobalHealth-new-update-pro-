import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpRight,
  Receipt,
  Building,
  ShieldCheck
} from 'lucide-react';
import { BillingClaim, DoctorProfile } from '../../types/medauth';
import { sampleBillingClaims, samplePatients } from '../../data/samplePatients';

interface BillingEarningsViewProps {
  doctor: DoctorProfile;
}

export const BillingEarningsView: React.FC<BillingEarningsViewProps> = ({ doctor }) => {
  const [claims, setClaims] = useState<BillingClaim[]>(sampleBillingClaims);
  const [showAddClaim, setShowAddClaim] = useState(false);

  // Form State
  const [patientName, setPatientName] = useState(samplePatients[0].name);
  const [cptCode, setCptCode] = useState('99214');
  const [cptDescription, setCptDescription] = useState('Office/Outpatient Visit, Established Patient, Moderate Complexity');
  const [icd10Code, setIcd10Code] = useState('I10');
  const [icd10Description, setIcd10Description] = useState('Essential (primary) hypertension');
  const [feeAmount, setFeeAmount] = useState(185.00);
  const [insurancePayer, setInsurancePayer] = useState('Blue Cross Blue Shield');

  const totalBilled = claims.reduce((acc, c) => acc + c.feeAmount, 0);
  const totalPaid = claims.filter((c) => c.claimStatus === 'PAID').reduce((acc, c) => acc + c.feeAmount, 0);
  const totalPending = claims.filter((c) => c.claimStatus !== 'PAID').reduce((acc, c) => acc + c.feeAmount, 0);

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const newClaim: BillingClaim = {
      id: `CLM-${Math.floor(10000 + Math.random() * 90000)}`,
      patientName,
      mrn: 'MRN-2026-901',
      dateOfService: new Date().toISOString().split('T')[0],
      cptCode,
      cptDescription,
      icd10Code,
      icd10Description,
      feeAmount: Number(feeAmount),
      insurancePayer,
      claimStatus: 'SUBMITTED'
    };

    setClaims([newClaim, ...claims]);
    setShowAddClaim(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-1">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Revenue Cycle & Medical Coding</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Billing, Claims & Practice Earnings
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            CPT / ICD-10 electronic insurance claims submission and fee schedule ledger.
          </p>
        </div>

        <button
          onClick={() => setShowAddClaim(!showAddClaim)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Claim</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Billed Month-to-Date</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            ${totalBilled.toFixed(2)}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            <span>+14% vs last billing cycle</span>
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Reimbursed & Settled</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            ${totalPaid.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Cleared via Direct Deposit
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pending Payer Adjudication</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 font-mono">
            ${totalPending.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Awaiting EDI 835 Remittance
          </span>
        </div>
      </div>

      {/* Claim Generation Modal / Form */}
      {showAddClaim && (
        <form onSubmit={handleCreateClaim} className="bg-white rounded-2xl border-2 border-emerald-500/40 p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Create Electronic CMS-1500 Claim</h3>
            <button
              type="button"
              onClick={() => setShowAddClaim(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Patient</label>
              <select
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                {samplePatients.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} ({p.mrn})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">CPT Procedure Code</label>
              <input
                type="text"
                required
                value={cptCode}
                onChange={(e) => setCptCode(e.target.value)}
                placeholder="e.g. 99214"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">ICD-10 Diagnostic Code</label>
              <input
                type="text"
                required
                value={icd10Code}
                onChange={(e) => setIcd10Code(e.target.value)}
                placeholder="e.g. I10"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Fee Amount ($ USD)</label>
              <input
                type="number"
                step="0.01"
                required
                value={feeAmount}
                onChange={(e) => setFeeAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-800 block">Insurance Payer Network</label>
              <input
                type="text"
                required
                value={insurancePayer}
                onChange={(e) => setInsurancePayer(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition"
            >
              Submit Electronic Claim
            </button>
          </div>
        </form>
      )}

      {/* Claims Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-sm font-bold text-slate-900">
            Claims Adjudication Matrix ({claims.length})
          </h3>
          <span className="text-xs font-mono text-slate-500">
            NPI: {doctor.npiNumber}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="pb-3 px-3">Claim ID</th>
                <th className="pb-3 px-3">Patient</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">CPT Code</th>
                <th className="pb-3 px-3">ICD-10</th>
                <th className="pb-3 px-3">Payer</th>
                <th className="pb-3 px-3">Fee</th>
                <th className="pb-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {claims.map((cl) => (
                <tr key={cl.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-bold text-slate-800">{cl.id}</td>
                  <td className="py-3 px-3 font-sans font-bold text-slate-900">{cl.patientName}</td>
                  <td className="py-3 px-3 text-slate-600">{cl.dateOfService}</td>
                  <td className="py-3 px-3 text-emerald-800 font-bold">{cl.cptCode}</td>
                  <td className="py-3 px-3 text-slate-700">{cl.icd10Code}</td>
                  <td className="py-3 px-3 font-sans text-slate-600">{cl.insurancePayer}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">${cl.feeAmount.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right font-sans">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        cl.claimStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {cl.claimStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
