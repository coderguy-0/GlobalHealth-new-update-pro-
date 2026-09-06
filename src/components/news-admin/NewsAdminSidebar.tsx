import React from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Clock,
  CheckCircle2,
  Archive,
  FolderTree,
  Users,
  Globe2,
  Image as ImageIcon,
  BarChart3,
  History,
  Settings,
  AlertCircle,
  Flame,
  Radio,
  Trash2,
  Shield,
  XCircle,
  LogOut,
  UserCheck,
  RotateCcw,
  Building2,
  BadgeCheck,
  Flag,
  Inbox
} from 'lucide-react';
import { StaffMember } from '../../types';
import { newsAuthService } from '../../services/newsAuthService';
import { useLocalization } from '../../context/LocalizationContext';

export type NewsAdminTab = 
  | 'dashboard'
  | 'all-news'
  | 'add-news'
  | 'drafts'
  | 'pending-review'
  | 'scheduled'
  | 'published'
  | 'archived'
  | 'rejected'
  | 'trash'
  | 'staff'
  | 'audit-logs'
  | 'categories'
  | 'authors'
  | 'sources'
  | 'media'
  | 'analytics'
  | 'settings'
  | 'authority-submissions'
  | 'authority-verification'
  | 'verified-authorities'
  | 'reported-news'
  | 'profile-security';

interface NewsAdminSidebarProps {
  currentTab: NewsAdminTab;
  onSelectTab: (tab: NewsAdminTab) => void;
  counts: {
    total: number;
    drafts: number;
    pendingReview: number;
    scheduled: number;
    published: number;
    archived: number;
    rejected?: number;
    trash?: number;
  };
  onAddNew: () => void;
  currentStaff: StaffMember | null;
  onLogout: () => void;
}

export const NewsAdminSidebar: React.FC<NewsAdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  counts,
  onAddNew,
  currentStaff,
  onLogout,
}) => {
  const { t, formatNumber } = useLocalization();

  const canCreate = newsAuthService.hasPermission('news.create');
  const canReview = newsAuthService.hasPermission('news.review');
  const canManageStaff = newsAuthService.hasPermission('news.manage_permissions');
  const canViewAuditLogs = newsAuthService.hasPermission('news.view_audit_logs');
  const canManageCategories = newsAuthService.hasPermission('news.manage_categories');
  const canManageMedia = newsAuthService.hasPermission('news.manage_media');
  const canViewAnalytics = newsAuthService.hasPermission('news.view_analytics');

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand & Section Title */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-black text-sm">
              GH
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                {t('Editorial CMS')}
              </div>
              <div className="text-sm font-extrabold text-white tracking-tight">
                {t('News Management')}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Add Button if permitted */}
        {canCreate && (
          <button
            onClick={onAddNew}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white py-2 px-3 text-xs font-bold transition shadow-lg shadow-teal-900/40 cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{t('Add New Article')}</span>
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 text-xs font-medium custom-scrollbar">
        {/* Core News Navigation */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            {t('News Pipeline')}
          </div>
          
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="h-4 w-4" />
              <span>{t('Overview')}</span>
            </div>
          </button>

          <button
            onClick={() => onSelectTab('all-news')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              currentTab === 'all-news'
                ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4" />
              <span>{t('All News')}</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-bold">
              {formatNumber(counts.total)}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('drafts')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              currentTab === 'drafts'
                ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4" />
              <span>{t('Drafts')}</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-bold">
              {formatNumber(counts.drafts)}
            </span>
          </button>

          {canReview && (
            <button
              onClick={() => onSelectTab('pending-review')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
                currentTab === 'pending-review'
                  ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                <span>{t('Review Queue')}</span>
              </div>
              {counts.pendingReview > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  {formatNumber(counts.pendingReview)}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => onSelectTab('scheduled')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              currentTab === 'scheduled'
                ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-sky-400" />
              <span>{t('Scheduled')}</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-bold">
              {formatNumber(counts.scheduled)}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('published')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              currentTab === 'published'
                ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{t('Published')}</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold">
              {formatNumber(counts.published)}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('archived')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              currentTab === 'archived'
                ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Archive className="h-4 w-4" />
              <span>{t('Archived')}</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-bold">
              {formatNumber(counts.archived)}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('rejected')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              currentTab === 'rejected'
                ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <XCircle className="h-4 w-4 text-rose-400" />
              <span>{t('Rejected')}</span>
            </div>
            {counts.rejected !== undefined && counts.rejected > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                {formatNumber(counts.rejected)}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('trash')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              currentTab === 'trash'
                ? 'bg-rose-900/30 text-rose-300 font-bold border border-rose-500/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Trash2 className="h-4 w-4 text-slate-400" />
              <span>{t('Trash Bin')}</span>
            </div>
            {counts.trash !== undefined && counts.trash > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                {formatNumber(counts.trash)}
              </span>
            )}
          </button>
        </div>

        {/* Administration & Security Section */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            {t('Admin & Security')}
          </div>

          {canManageStaff && (
            <button
              onClick={() => onSelectTab('staff')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
                currentTab === 'staff'
                  ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shield className="h-4 w-4 text-rose-400" />
                <span>{t('Staff & Permissions')}</span>
              </div>
            </button>
          )}

          {canViewAuditLogs && (
            <button
              onClick={() => onSelectTab('audit-logs')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
                currentTab === 'audit-logs'
                  ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <History className="h-4 w-4 text-teal-400" />
                <span>{t('Audit & Security Logs')}</span>
              </div>
            </button>
          )}

          {canViewAnalytics && (
            <button
              onClick={() => onSelectTab('analytics')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
                currentTab === 'analytics'
                  ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="h-4 w-4" />
                <span>{t('Readership Analytics')}</span>
              </div>
            </button>
          )}
        </div>

        {/* Verified Authority Governance (server-enforced) */}
        {canReview && (
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Authority Governance
            </div>

            <button
              onClick={() => onSelectTab('authority-submissions')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
                currentTab === 'authority-submissions'
                  ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="h-4 w-4 text-teal-400" />
                <span>Authority Submissions</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTab('authority-verification')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
                currentTab === 'authority-verification'
                  ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BadgeCheck className="h-4 w-4 text-amber-400" />
                <span>Verify Authorities</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTab('verified-authorities')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
                currentTab === 'verified-authorities'
                  ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="h-4 w-4 text-emerald-400" />
                <span>Verified Authorities</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTab('profile-security')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
                currentTab === 'profile-security'
                  ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="h-4 w-4 text-teal-400" />
                <span>Profile &amp; Security</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTab('reported-news')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
                currentTab === 'reported-news'
                  ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Flag className="h-4 w-4 text-rose-400" />
                <span>Reported News</span>
              </div>
            </button>
          </div>
        )}

        {/* Content Structure */}
        {(canManageCategories || canManageMedia) && (
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {t('Taxonomy & Assets')}
            </div>

            {canManageCategories && (
              <button
                onClick={() => onSelectTab('categories')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
                  currentTab === 'categories'
                    ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderTree className="h-4 w-4" />
                  <span>{t('Categories')}</span>
                </div>
              </button>
            )}

            {canManageMedia && (
              <button
                onClick={() => onSelectTab('media')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
                  currentTab === 'media'
                    ? 'bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ImageIcon className="h-4 w-4" />
                  <span>{t('Media Library')}</span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Staff Account Footer Card */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        {currentStaff ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStaff.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
                alt={currentStaff.name}
                className="h-8 w-8 rounded-lg object-cover border border-slate-700 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">{currentStaff.name}</div>
                <div className="text-[10px] font-extrabold uppercase text-teal-400 tracking-wider">
                  {currentStaff.role.replace('_', ' ')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onLogout}
                className="w-full rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 py-2 px-3 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                title={t('Secure Logout')}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{t('Sign Out')}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-slate-400 text-center">
            {t('Unauthenticated Session')}
          </div>
        )}
      </div>
    </aside>
  );
};
