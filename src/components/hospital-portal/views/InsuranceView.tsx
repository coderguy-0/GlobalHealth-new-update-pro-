import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  Clock,
  Building,
  FileCheck,
  Percent
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const InsuranceView: React.FC = () => {
  const { insuranceProviders, claims } = useHospitalPortal();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInsurance = insuranceProviders.filter(
    (ins) =>
      ins.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.tpaName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCEBE4] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#17221E]">Insurance & TPA Cashless Desk</h1>
            <span className="text-xs font-mono font-bold bg-[#E8F7F1] text-[#008F68] px-2 py-0.5 rounded border border-[#BDE4D5]">
              {insuranceProviders.length} Empaneled TPAs
            </span>
          </div>
          <p className="text-xs text-[#52635C]">
            Cashless Pre-Authorization Gateway, Empanelment Agreements & Pre-Auth Claim Approvals
          </p>
        </div>
      </div>

      {/* Top Cards: Empaneled TPAs Grid */}
      <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCEBE4] pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[#008F68]" />
            <h2 className="text-base font-bold text-[#17221E]">Empaneled Insurance & TPA Network</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredInsurance.map((ins) => (
            <div
              key={ins.id}
              className="p-4 rounded-xl border border-[#DCEBE4] bg-[#F6FBF8] space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#17221E]">{ins.providerName}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8F7F1] text-[#008F68] border border-[#BDE4D5]">
                  {ins.status}
                </span>
              </div>
              <p className="text-xs text-[#52635C]">TPA: {ins.tpaName}</p>

              <div className="pt-2 border-t border-[#DCEBE4] space-y-1 text-xs">
                <div className="flex items-center justify-between text-[#52635C]">
                  <span>Settlement TAT:</span>
                  <span className="font-bold text-[#17221E]">{ins.settlementTurnaroundDays} days</span>
                </div>
                <div className="flex items-center justify-between text-[#52635C]">
                  <span>Active Pre-Auths:</span>
                  <span className="font-mono text-[#17221E]">{ins.activePreAuthCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cashless Claims Pre-Auth Table */}
      <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCEBE4] pb-3">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-[#287EA8]" />
            <h2 className="text-base font-bold text-[#17221E]">Active Cashless Pre-Auth & Claims Stream</h2>
          </div>
          <span className="text-xs font-mono font-bold text-[#008F68] bg-[#E8F7F1] px-2 py-0.5 rounded">
            {claims.length} Live Claims
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#DCEBE4] text-[#52635C] font-bold uppercase text-[10px]">
                <th className="pb-3 px-3">Claim ID</th>
                <th className="pb-3 px-3">Patient Information</th>
                <th className="pb-3 px-3">Insurance & TPA</th>
                <th className="pb-3 px-3">Claimed Amount</th>
                <th className="pb-3 px-3">Sanctioned Pre-Auth</th>
                <th className="pb-3 px-3 text-right">Adjudication Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCEBE4]">
              {claims.map((c) => (
                <tr key={c.id} className="hover:bg-[#F6FBF8]">
                  <td className="py-3 px-3 font-mono font-bold text-[#008F68]">{c.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#17221E]">{c.patientName}</div>
                    <div className="text-[10px] text-[#52635C] font-mono">{c.patientMRN}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#17221E]">{c.tpaName}</div>
                    <div className="text-[10px] text-[#52635C] font-mono">Pol: {c.policyNumber}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#17221E]">
                    ₹{c.estimatedCost.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#008F68]">
                    {c.approvedAmount ? `₹${c.approvedAmount.toLocaleString()}` : 'Pending Pre-Auth'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        c.claimStatus === 'Initial Pre-Auth Approved'
                          ? 'bg-[#E8F7F1] text-[#008F68] border border-[#BDE4D5]'
                          : 'bg-[#FFF7E6] text-[#A86E00] border border-[#FED88B]'
                      }`}
                    >
                      {c.claimStatus}
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
