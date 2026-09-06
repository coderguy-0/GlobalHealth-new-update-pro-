import React from 'react';
import {
  Lock,
  ShieldCheck,
  Key,
  FileCode,
  CheckCircle2,
  RefreshCw,
  Terminal,
  FileCheck
} from 'lucide-react';
import { DoctorProfile } from '../../types/medauth';

interface SecurityAuditLogsViewProps {
  doctor: DoctorProfile;
}

export const SecurityAuditLogsView: React.FC<SecurityAuditLogsViewProps> = ({ doctor }) => {
  const auditLogs = [
    {
      id: 'LOG-99201',
      timestamp: '2026-08-22T14:32:00Z',
      action: 'SOAP_ENCOUNTER_SIGNED',
      operator: doctor.fullName,
      mrn: 'MRN-2026-901',
      ip: '172.56.21.90 (Hospital Secure VPN)',
      status: 'VERIFIED_SHA256'
    },
    {
      id: 'LOG-99200',
      timestamp: '2026-08-22T13:45:10Z',
      action: 'E_PRESCRIPTION_DISPATCHED',
      operator: doctor.fullName,
      mrn: 'MRN-2026-903',
      ip: '172.56.21.90 (Hospital Secure VPN)',
      status: 'VERIFIED_SHA256'
    },
    {
      id: 'LOG-99199',
      timestamp: '2026-08-22T11:15:30Z',
      action: 'STATE_MEDICAL_BOARD_SYNC',
      operator: 'SYSTEM_AUTOSYNC',
      mrn: 'N/A',
      ip: '10.0.4.12 (MedAuth Registry Gateway)',
      status: 'SUCCESS_CONFIRMED'
    },
    {
      id: 'LOG-99198',
      timestamp: '2026-08-22T09:30:14Z',
      action: 'PRACTITIONER_LOGIN_AUTHENTICATED',
      operator: doctor.fullName,
      mrn: 'N/A',
      ip: '172.56.21.90 (Hospital Secure VPN)',
      status: 'PASS_MFA_OK'
    }
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>HIPAA Security & Audit Log Ledger</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Security, Integrity & Audit Logs
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Immutable audit trail of all electronic health record views, prescription signings, and credential syncs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SOC2 / HIPAA Compliant</span>
          </span>
        </div>
      </div>

      {/* Cryptographic Key Verification Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[10px] uppercase tracking-wider">Provider Cryptographic Checksum</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>INTEGRITY VERIFIED</span>
          </span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 break-all text-[11px]">
          SHA-256: {doctor.securityHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Badge ID: <strong className="text-white">{doctor.verificationBadgeId}</strong></span>
          <span>NPI: <strong className="text-white">{doctor.npiNumber}</strong></span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Electronic Audit Trail Records
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="pb-3 px-3">Event ID</th>
                <th className="pb-3 px-3">Timestamp (UTC)</th>
                <th className="pb-3 px-3">Action Type</th>
                <th className="pb-3 px-3">Operator</th>
                <th className="pb-3 px-3">MRN Target</th>
                <th className="pb-3 px-3">IP / Subnet</th>
                <th className="pb-3 px-3 text-right">Integrity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-bold text-slate-800">{log.id}</td>
                  <td className="py-3 px-3 text-slate-600">{log.timestamp}</td>
                  <td className="py-3 px-3 font-bold text-emerald-800">{log.action}</td>
                  <td className="py-3 px-3 text-slate-700">{log.operator}</td>
                  <td className="py-3 px-3 text-slate-600">{log.mrn}</td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">{log.ip}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                      {log.status}
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
