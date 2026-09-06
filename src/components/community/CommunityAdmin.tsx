import React, { useState } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  UserX, 
  Activity, 
  FileText, 
  Search,
  Filter,
  Check
} from 'lucide-react';
import { ModerationReportItem } from './CommunityTypes';
import { useLocalization } from '../../context/LocalizationContext';

interface CommunityAdminProps {
  reports: ModerationReportItem[];
  onResolveReport: (reportId: string, action: 'dismiss' | 'remove' | 'warn' | 'ban') => void;
}

export const CommunityAdmin: React.FC<CommunityAdminProps> = ({
  reports,
  onResolveReport
}) => {
  const { t } = useLocalization();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved'>('all');

  const filteredReports = reports.filter(r => {
    if (filterStatus === 'pending') return r.status === 'pending';
    if (filterStatus === 'resolved') return r.status === 'resolved';
    return true;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold">
              <Shield className="h-3.5 w-3.5" />
              <span>{t('Community Safety & Moderation Operations')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">{t('Clinical Integrity & Audit Queue')}</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {t('Review reported misinformation, spam bots, and enforce peer safety protocols.')}
            </p>
          </div>
        </div>

        {/* Safety Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xl font-black text-white">125.4K</div>
            <div className="text-[11px] text-slate-400 font-medium">{t('Total Members')}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xl font-black text-amber-400">3 {t('Pending')}</div>
            <div className="text-[11px] text-slate-400 font-medium">{t('Flagged Reports')}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xl font-black text-emerald-400">99.8%</div>
            <div className="text-[11px] text-slate-400 font-medium">{t('Evidence Compliance')}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xl font-black text-violet-400">24/7</div>
            <div className="text-[11px] text-slate-400 font-medium">{t('Automated Screening')}</div>
          </div>
        </div>
      </div>

      {/* Reports Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-600" />
            <span>{t('Moderation Incident Review Queue')}</span>
          </h3>

          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: t('All Reports') },
              { id: 'pending', label: t('Pending Action') },
              { id: 'resolved', label: t('Resolved / Audited') }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterStatus === tab.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report Cards List */}
        <div className="space-y-4">
          {filteredReports.map((rep) => (
            <div
              key={rep.id}
              className={`p-5 rounded-2xl border space-y-3 transition ${
                rep.status === 'pending'
                  ? 'bg-rose-50/30 border-rose-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getSeverityBadge(rep.severity)}`}>
                    {rep.severity} {t('Severity')}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{rep.reason}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{rep.timestamp}</span>
              </div>

              <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[11px] text-slate-500 font-semibold">{t('Flagged Content Snippet')}:</div>
                <p className="font-mono text-rose-900 italic">"{rep.contentSnippet}"</p>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                <div>
                  {t('Reported User')}: <strong className="text-slate-800">@{rep.reportedUser}</strong> • {t('Reported by')}: <strong className="text-slate-800">{rep.reporter}</strong>
                </div>

                {rep.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onResolveReport(rep.id, 'dismiss')}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
                    >
                      {t('Dismiss')}
                    </button>
                    <button
                      onClick={() => onResolveReport(rep.id, 'warn')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition cursor-pointer"
                    >
                      {t('Warn User')}
                    </button>
                    <button
                      onClick={() => onResolveReport(rep.id, 'remove')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
                    >
                      {t('Remove Content')}
                    </button>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{t('Resolved')}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
