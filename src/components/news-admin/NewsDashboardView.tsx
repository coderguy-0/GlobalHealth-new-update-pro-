import React from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  Calendar,
  Eye,
  TrendingUp,
  AlertTriangle,
  Plus,
  Upload,
  Search,
  ArrowUpRight,
  Sparkles,
  ShieldAlert,
  Flame,
  Award,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  History,
  Trash2,
  XCircle,
  Users
} from 'lucide-react';
import { NewsArticle } from '../../types';
import { NewsAdminTab } from './NewsAdminSidebar';
import { newsAuthService } from '../../services/newsAuthService';
import { useLocalization } from '../../context/LocalizationContext';

interface NewsDashboardViewProps {
  articles: NewsArticle[];
  analytics: {
    totalArticles: number;
    published: number;
    drafts: number;
    scheduled: number;
    pendingReview: number;
    archived: number;
    rejected?: number;
    totalViews: number;
    totalVisitors: number;
    todayViews: number;
    weekViews: number;
    mostRead?: NewsArticle;
  };
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onNavigateTab: (tab: NewsAdminTab) => void;
  onAddNew: () => void;
  onEditArticle: (article: NewsArticle) => void;
  onPreviewArticle: (article: NewsArticle) => void;
  onResetData: () => void;
  onImportDemo: () => void;
}

export const NewsDashboardView: React.FC<NewsDashboardViewProps> = ({
  articles,
  analytics,
  searchTerm,
  onSearchChange,
  onNavigateTab,
  onAddNew,
  onEditArticle,
  onPreviewArticle,
  onResetData,
  onImportDemo
}) => {
  const { t, formatNumber } = useLocalization();
  const currentStaff = newsAuthService.getCurrentStaffUser();
  const recentAuditLogs = newsAuthService.getAuditLogs().slice(0, 4);

  const pendingArticles = articles.filter(
    (a) => a.status === 'pending_medical' || a.status === 'pending_editor' || a.status === 'changes_requested'
  );

  const breakingArticles = articles.filter((a) => a.isBreaking && a.status !== 'trash');
  const featuredArticles = articles.filter((a) => a.isFeatured && a.status !== 'trash');
  const trashCount = articles.filter((a) => a.status === 'trash').length;
  const recentArticles = articles.filter((a) => a.status !== 'trash').slice(0, 5);

  const canCreate = newsAuthService.hasPermission('news.create');
  const canManageStaff = newsAuthService.hasPermission('news.manage_permissions');

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4" /> {t('GlobalHealth Editorial Command Center')}
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('News Management Dashboard')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('Oversee clinical journalism, peer-reviewed study intake, medical verification pipeline, and publication metrics.')}
          </p>
        </div>

        {/* Action Controls & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('Search news headline, author, DOI...')}
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          {canCreate && (
            <button
              onClick={onAddNew}
              className="rounded-xl bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{t('New Article')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Staff Session Status Banner */}
      {currentStaff && (
        <div className="p-4 rounded-3xl bg-slate-900 text-slate-200 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <img
              src={currentStaff.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
              alt={currentStaff.name}
              className="h-10 w-10 rounded-xl object-cover border border-slate-700 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{currentStaff.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                  currentStaff.role === 'SUPER_ADMIN'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : currentStaff.role === 'NEWS_ADMIN'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                }`}>
                  {currentStaff.role.replace('_', ' ')}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {t('Active Session')}: {currentStaff.permissions.length} {t('granted permissions')} • {t('Zero-Trust Guard active')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canManageStaff && (
              <button
                onClick={() => onNavigateTab('staff')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 cursor-pointer"
              >
                {t('Manage Staff Permissions')}
              </button>
            )}
            <button
              onClick={() => onNavigateTab('audit-logs')}
              className="px-3 py-1.5 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 text-xs font-semibold transition border border-teal-500/30 cursor-pointer"
            >
              {t('Audit Trail')}
            </button>
          </div>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <button
          onClick={() => onNavigateTab('all-news')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-left transition shadow-2xs cursor-pointer"
        >
          <div className="text-slate-400 text-xs font-semibold">{t('Total Pipeline')}</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatNumber(analytics.totalArticles)}</div>
        </button>

        <button
          onClick={() => onNavigateTab('published')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 text-left transition shadow-2xs cursor-pointer"
        >
          <div className="text-emerald-700 text-xs font-semibold">{t('Live Published')}</div>
          <div className="text-2xl font-black text-emerald-800 mt-1">{formatNumber(analytics.published)}</div>
        </button>

        <button
          onClick={() => onNavigateTab('drafts')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-left transition shadow-2xs cursor-pointer"
        >
          <div className="text-slate-500 text-xs font-semibold">{t('Drafts')}</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{formatNumber(analytics.drafts)}</div>
        </button>

        <button
          onClick={() => onNavigateTab('pending-review')}
          className="p-4 rounded-2xl bg-white border border-amber-200 hover:border-amber-300 text-left transition shadow-2xs cursor-pointer"
        >
          <div className="text-amber-700 text-xs font-semibold">{t('In Review')}</div>
          <div className="text-2xl font-black text-amber-800 mt-1">{formatNumber(analytics.pendingReview)}</div>
        </button>

        <button
          onClick={() => onNavigateTab('scheduled')}
          className="p-4 rounded-2xl bg-white border border-sky-200 hover:border-sky-300 text-left transition shadow-2xs cursor-pointer"
        >
          <div className="text-sky-700 text-xs font-semibold">{t('Scheduled')}</div>
          <div className="text-2xl font-black text-sky-800 mt-1">{formatNumber(analytics.scheduled)}</div>
        </button>

        <button
          onClick={() => onNavigateTab('trash')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 text-left transition shadow-2xs cursor-pointer"
        >
          <div className="text-rose-700 text-xs font-semibold">{t('Trash Bin')}</div>
          <div className="text-2xl font-black text-rose-800 mt-1">{formatNumber(trashCount)}</div>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Articles & Action Required (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Action Required: Pending Medical Review */}
          {pendingArticles.length > 0 && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50/40 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>{t('Action Required: Articles Awaiting Clinical Review')}</span>
                </div>
                <button
                  onClick={() => onNavigateTab('pending-review')}
                  className="text-xs font-bold text-amber-800 hover:underline cursor-pointer"
                >
                  {t('Open Review Queue')} →
                </button>
              </div>

              <div className="space-y-2.5">
                {pendingArticles.slice(0, 3).map((art) => (
                  <div
                    key={art.id}
                    className="p-3.5 rounded-2xl bg-white border border-amber-200/80 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                          {art.category}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                          {art.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate">{art.title}</h4>
                      <span className="text-[11px] text-slate-500 block">{t('Author')}: {art.author}</span>
                    </div>

                    <button
                      onClick={() => onPreviewArticle(art)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shrink-0 cursor-pointer"
                    >
                      {t('Evaluate')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Articles Stream */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">{t('Recent Editorial Submissions')}</h3>
              <button
                onClick={() => onNavigateTab('all-news')}
                className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
              >
                {t('View All Articles')} →
              </button>
            </div>

            <div className="space-y-3">
              {recentArticles.map((art) => (
                <div
                  key={art.id}
                  className="p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4 transition"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-teal-700 uppercase">{art.category}</span>
                      <span className="text-[10px] text-slate-400">•</span>
                      <span className="text-[10px] text-slate-500">{art.date}</span>
                    </div>
                    <h4
                      onClick={() => onPreviewArticle(art)}
                      className="text-xs font-bold text-slate-900 hover:text-teal-700 cursor-pointer truncate"
                    >
                      {art.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => onEditArticle(art)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-xs font-semibold transition shrink-0 cursor-pointer"
                  >
                    {t('Edit')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Security Stream & Quick Insights (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Security & Audit Events Widget */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                <History className="h-4 w-4 text-teal-600" />
                <span>{t('Recent Security Log')}</span>
              </div>
              <button
                onClick={() => onNavigateTab('audit-logs')}
                className="text-[11px] font-bold text-teal-700 hover:underline cursor-pointer"
              >
                {t('All Logs')} →
              </button>
            </div>

            <div className="space-y-2.5">
              {recentAuditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono font-bold text-slate-800">{log.action}</span>
                    <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 line-clamp-1">{log.details}</div>
                  <div className="text-[10px] text-teal-700 font-semibold">{t('Actor')}: {log.actorName}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Breaking & Featured Status */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              {t('High-Impact Placements')}
            </h3>

            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-1">
              <div className="flex items-center justify-between text-rose-800 font-bold">
                <span className="flex items-center gap-1.5"><Flame className="h-4 w-4" /> {t('Active Breaking Alerts')}</span>
                <span>{formatNumber(breakingArticles.length)}</span>
              </div>
              <p className="text-[11px] text-rose-700">
                {t('Displayed in red emergency ticker across the entire public GlobalHealth portal.')}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
              <div className="flex items-center justify-between text-amber-800 font-bold">
                <span className="flex items-center gap-1.5"><Award className="h-4 w-4" /> {t('Hero Featured Stories')}</span>
                <span>{formatNumber(featuredArticles.length)}</span>
              </div>
              <p className="text-[11px] text-amber-700">
                {t('Pinned as top lead articles in the public Health News section.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
