import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Terminal 
} from 'lucide-react';
import { AuditLogEntry } from '../../types/pharmacyPortal';

interface AuditLogsTabProps {
  auditLogs: AuditLogEntry[];
}

export const AuditLogsTab: React.FC<AuditLogsTabProps> = ({ auditLogs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');

  const filteredLogs = auditLogs.filter(log => {
    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.staffName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Immutable Forensic Audit Ledger</span>
            </div>
            <h2 className="text-base font-black text-white">Dispensary Operations & Prescription Sign-off Trail</h2>
            <p className="text-xs text-slate-400">
              Cryptographically timestamped audit log of all clinical approvals, inventory overrides, price modifications, and logins.
            </p>
          </div>

          <button
            onClick={() => alert('Forensic audit log package exported for drug inspector.')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-teal-300 border border-slate-800 text-xs font-bold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Regulatory Log</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-8 relative">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail by staff name, action, or medicine ID..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 font-bold focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="All">All Operations Modules</option>
              <option value="Prescriptions">Prescription Reviews</option>
              <option value="Inventory">Inventory Adjustments</option>
              <option value="Pricing">Price Modifications</option>
              <option value="Auth">Staff Logins & 2FA</option>
              <option value="Compliance">Regulatory Compliance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60 font-sans">
                <th className="p-4 font-semibold">Timestamp (UTC+5:30)</th>
                <th className="p-4 font-semibold">Action & Module</th>
                <th className="p-4 font-semibold">Staff Identity</th>
                <th className="p-4 font-semibold">Event Description</th>
                <th className="p-4 font-semibold">IP Address & Device</th>
                <th className="p-4 font-semibold text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-4 text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span className="font-bold text-teal-300 font-sans block">{log.action}</span>
                    <span className="text-[10px] text-slate-500 font-mono">[{log.module}]</span>
                  </td>

                  <td className="p-4 whitespace-nowrap font-sans">
                    <div className="font-bold text-white text-xs">{log.staffName}</div>
                    <div className="text-[10px] text-teal-400 font-mono">{log.staffRole}</div>
                  </td>

                  <td className="p-4 text-slate-300 font-sans max-w-sm">
                    {log.details}
                  </td>

                  <td className="p-4 text-slate-500 text-[10px]">
                    <div>{log.ipAddress}</div>
                    <div className="truncate max-w-[150px]">{log.deviceInfo}</div>
                  </td>

                  <td className="p-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{log.result}</span>
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
