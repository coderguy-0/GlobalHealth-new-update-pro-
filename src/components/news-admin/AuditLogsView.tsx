import React, { useState } from 'react';
import {
  History,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Download,
  AlertTriangle,
  FileText,
  UserCheck,
  Clock,
  Eye,
  X,
  Sparkles,
  Layers,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { AuditLogEntry } from '../../types';
import { newsAuthService } from '../../services/newsAuthService';
import { useLocalization } from '../../context/LocalizationContext';

export const AuditLogsView: React.FC = () => {
  const { t, formatNumber } = useLocalization();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeModalLog, setActiveModalLog] = useState<AuditLogEntry | null>(null);

  const logs = newsAuthService.getAuditLogs();

  const filteredLogs = logs.filter((log) => {
    if (selectedSeverity !== 'all' && log.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'all' && log.status !== selectedStatus) return false;
    if (selectedType !== 'all' && log.targetType !== selectedType) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.actorName.toLowerCase().includes(q) ||
        (log.actorEmail && log.actorEmail.toLowerCase().includes(q)) ||
        (log.targetTitle && log.targetTitle.toLowerCase().includes(q)) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalLogs = logs.length;
  const criticalCount = logs.filter((l) => l.severity === 'critical').length;
  const deniedCount = logs.filter((l) => l.status === 'denied').length;
  const warningCount = logs.filter((l) => l.severity === 'warning').length;

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `globalhealth_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Actor Name', 'Actor Role', 'Action', 'Target Type', 'Target Title', 'Details', 'Severity', 'Status'];
    const rows = logs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.actorName.replace(/"/g, '""')}"`,
      `"${l.actorRole}"`,
      `"${l.action}"`,
      `"${l.targetType}"`,
      `"${(l.targetTitle || '').replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.severity}"`,
      `"${l.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `globalhealth_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider mb-1">
            <History className="h-4 w-4" /> {t('Immutable Audit Trail')}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('Audit & Security Event Logs')}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            {t('Continuous real-time cryptographic audit log of all logins, publications, permission changes, editorial decisions, and security alerts.')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>{t('Export CSV')}</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>{t('Export JSON')}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-3.5 grid-cols-2 sm:grid-cols-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>{t('Total Audit Records')}</span>
            <History className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">{formatNumber(totalLogs)}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-rose-700 text-xs font-semibold mb-1">
            <span>{t('Critical Events')}</span>
            <ShieldAlert className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-700">{formatNumber(criticalCount)}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold mb-1">
            <span>{t('Access Denied Alerts')}</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-700">{formatNumber(deniedCount)}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-teal-700 text-xs font-semibold mb-1">
            <span>{t('Warnings & Flagged')}</span>
            <ShieldCheck className="h-4 w-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-teal-800">{formatNumber(warningCount)}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('Search by action, actor, target or details...')}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700 focus:bg-white focus:border-teal-500 focus:outline-hidden"
          >
            <option value="all">{t('All Severities')}</option>
            <option value="info">{t('Info')}</option>
            <option value="warning">{t('Warning')}</option>
            <option value="critical">{t('Critical')}</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700 focus:bg-white focus:border-teal-500 focus:outline-hidden"
          >
            <option value="all">{t('All Statuses')}</option>
            <option value="success">{t('Success')}</option>
            <option value="denied">{t('Denied')}</option>
            <option value="failed">{t('Failed')}</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700 focus:bg-white focus:border-teal-500 focus:outline-hidden"
          >
            <option value="all">{t('All Target Types')}</option>
            <option value="article">{t('Articles')}</option>
            <option value="staff">{t('Staff Accounts')}</option>
            <option value="permission">{t('Permissions')}</option>
            <option value="auth">{t('Authentication')}</option>
            <option value="breaking_news">{t('Breaking News')}</option>
            <option value="system">{t('System')}</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">{t('Timestamp')}</th>
                <th className="p-4">{t('Actor & Role')}</th>
                <th className="p-4">{t('Security Action')}</th>
                <th className="p-4">{t('Target Entity')}</th>
                <th className="p-4">{t('Severity & Result')}</th>
                <th className="p-4 text-right">{t('Details')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => {
                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 text-slate-500 text-[11px] whitespace-nowrap">
                      <div className="font-mono text-slate-700">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </td>

                    <td className="p-4">
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">{log.actorName}</span>
                        <span className="text-[10px] font-bold text-teal-700 uppercase">
                          {log.actorRole.replace('_', ' ')}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {log.action}
                      </span>
                    </td>

                    <td className="p-4">
                      <div>
                        <span className="font-medium text-slate-900 text-xs line-clamp-1">
                          {log.targetTitle || t('N/A')}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          {log.targetType}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          log.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : log.severity === 'warning'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-teal-50 text-teal-800 border border-teal-200'
                        }`}>
                          {log.severity}
                        </span>

                        <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${
                          log.status === 'success'
                            ? 'text-emerald-700'
                            : log.status === 'denied'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}>
                          {log.status === 'success' && <CheckCircle2 className="h-3 w-3" />}
                          {log.status === 'denied' && <ShieldAlert className="h-3 w-3" />}
                          {log.status === 'failed' && <XCircle className="h-3 w-3" />}
                          {log.status.toUpperCase()}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setActiveModalLog(log)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                      >
                        <Eye className="h-3 w-3" />
                        <span>{t('View')}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details Modal */}
      {activeModalLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                  {t('Audit Record Detail')}
                </span>
                <h3 className="text-lg font-black text-slate-900 font-mono">
                  {activeModalLog.action}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalLog(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Event ID')}:</span>
                  <span className="font-mono text-slate-800">{activeModalLog.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Timestamp')}:</span>
                  <span className="font-mono text-slate-800">{activeModalLog.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Actor')}:</span>
                  <span className="font-semibold text-slate-900">{activeModalLog.actorName} ({activeModalLog.actorRole})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Target Type')}:</span>
                  <span className="text-slate-800 font-semibold uppercase">{activeModalLog.targetType}</span>
                </div>
                {activeModalLog.targetTitle && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('Target')}:</span>
                    <span className="text-slate-800 font-semibold">{activeModalLog.targetTitle}</span>
                  </div>
                )}
              </div>

              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">
                  {t('Event Payload & Cryptographic Note')}
                </span>
                <div className="p-3 rounded-2xl bg-slate-900 text-teal-300 font-mono text-[11px] leading-relaxed">
                  {activeModalLog.details || t('No additional metadata.')}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModalLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
              >
                {t('Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
