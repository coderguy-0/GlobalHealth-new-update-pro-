import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  Terminal
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useHospitalPortal();
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.hash.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCEBE4] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#17221E]">Cryptographic SHA-256 Immutable Audit Ledger</h1>
            <span className="text-xs font-mono font-bold bg-[#E8F7F1] text-[#008F68] px-2 py-0.5 rounded border border-[#BDE4D5]">
              {auditLogs.length} Verified Blocks
            </span>
          </div>
          <p className="text-xs text-[#52635C]">
            Tamper-Evident Blockchain-Grade Transaction Chain for Clinical Mutations & Administrative Changes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-bold text-[#008F68] bg-[#E8F7F1] px-3 py-1.5 rounded-xl border border-[#BDE4D5]">
            <ShieldCheck className="h-4 w-4" />
            <span>Chain Integrity Valid</span>
          </span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52635C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by action, details, user persona, or block hash..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] placeholder-[#8A9993] focus:outline-none focus:border-[#008F68]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-[#52635C] shrink-0" />
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68] cursor-pointer"
          >
            <option value="ALL">All Clinical & Security Modules</option>
            <option value="Security & Access">Security & Access</option>
            <option value="Hospital Profile">Hospital Profile</option>
            <option value="Emergency & Trauma">Emergency & Trauma</option>
            <option value="Capacity & Beds">Capacity & Beds</option>
            <option value="Specialists Master">Specialists Master</option>
            <option value="Blood Bank">Blood Bank</option>
            <option value="Fleet Logistics">Fleet Logistics</option>
            <option value="Pricing & Tariffs">Pricing & Tariffs</option>
            <option value="Change Governance">Change Governance</option>
          </select>
        </div>
      </div>

      {/* Audit Blocks Table */}
      <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#DCEBE4] text-[#52635C] font-bold uppercase text-[10px]">
                <th className="pb-3 px-3">Block ID & Timestamp</th>
                <th className="pb-3 px-3">System Module</th>
                <th className="pb-3 px-3">Executed Action</th>
                <th className="pb-3 px-3">Personnel Signature</th>
                <th className="pb-3 px-3">Audit Details & IP</th>
                <th className="pb-3 px-3 font-mono text-right">Cryptographic SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCEBE4]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F6FBF8]">
                  <td className="py-3 px-3 font-mono">
                    <div className="font-bold text-[#17221E]">{log.id}</div>
                    <div className="text-[10px] text-[#52635C]">{new Date(log.timestamp).toLocaleString()}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F1FAF6] text-[#52635C] border border-[#DCEBE4]">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-[#17221E]">{log.action}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#17221E]">{log.userName}</div>
                    <div className="text-[10px] text-[#008F68] font-semibold">{log.userRole}</div>
                  </td>
                  <td className="py-3 px-3 text-[#52635C] max-w-xs">
                    <div>{log.details}</div>
                    <div className="text-[10px] text-[#687971] font-mono">{log.ipAddress}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[10px] text-[#008F68] select-all truncate max-w-[120px]">
                    {log.hash}
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
