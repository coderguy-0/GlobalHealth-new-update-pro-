import React from 'react';
import { 
  Users, 
  Search, 
  PlusCircle, 
  Sparkles, 
  TrendingUp, 
  Compass, 
  MessageSquare, 
  Calendar, 
  Mail, 
  Bell, 
  User, 
  Shield, 
  Bookmark, 
  Flame, 
  Award,
  Layers
} from 'lucide-react';
import { CommunityTab } from './CommunityTypes';
import { useLocalization } from '../../context/LocalizationContext';

interface CommunityHeaderProps {
  activeTab: CommunityTab;
  onTabChange: (tab: CommunityTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreateModal: () => void;
  onOpenSafetyModal: () => void;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  savedCount: number;
}

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  onOpenSafetyModal,
  unreadMessagesCount,
  unreadNotificationsCount,
  savedCount
}) => {
  const { t, formatNumber } = useLocalization();

  const stats = [
    { label: t('Total Members'), value: formatNumber(125420), icon: Users, color: 'text-violet-600' },
    { label: t('Active Today'), value: formatNumber(18430), icon: Sparkles, color: 'text-emerald-600' },
    { label: t('Posts Today'), value: formatNumber(4821), icon: Flame, color: 'text-amber-600' },
    { label: t('Discussions'), value: formatNumber(1240), icon: MessageSquare, color: 'text-blue-600' },
    { label: t('Groups'), value: formatNumber(742), icon: Layers, color: 'text-indigo-600' },
    { label: t('Live Events'), value: formatNumber(19), icon: Calendar, color: 'text-rose-600' }
  ];

  const navItems = [
    { id: 'feed' as CommunityTab, label: t('Feed'), icon: Layers },
    { id: 'explore' as CommunityTab, label: t('Explore'), icon: Compass },
    { id: 'groups' as CommunityTab, label: t('Groups'), icon: Users },
    { id: 'discussions' as CommunityTab, label: t('Discussions & Q&A'), icon: MessageSquare },
    { id: 'events' as CommunityTab, label: t('Events'), icon: Calendar },
    { id: 'messages' as CommunityTab, label: t('Messages'), icon: Mail, badge: unreadMessagesCount },
    { id: 'notifications' as CommunityTab, label: t('Notifications'), icon: Bell, badge: unreadNotificationsCount },
    { id: 'profile' as CommunityTab, label: t('Profile'), icon: User },
    { id: 'leaderboard' as CommunityTab, label: t('Leaderboard'), icon: Award },
    { id: 'saved' as CommunityTab, label: t('Saved'), icon: Bookmark, badge: savedCount },
    { id: 'admin' as CommunityTab, label: t('Moderation'), icon: Shield }
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-8 sm:py-12">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                <span>{t('Global Health & Clinical Knowledge Network')}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {t('Connect. Share. Learn. Grow Together.')}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {t('A safe, evidence-informed medical community where patients, caregivers, students, and healthcare professionals collaborate to share insights and improve vitality.')}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenCreateModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-violet-900/30 hover:shadow-xl transition-all cursor-pointer transform active:scale-95"
              >
                <PlusCircle className="h-4 w-4" />
                <span>{t('Create Post')}</span>
              </button>
              
              <button
                onClick={() => onTabChange('explore')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-bold backdrop-blur-md transition cursor-pointer"
              >
                <Compass className="h-4 w-4 text-violet-300" />
                <span>{t('Explore Community')}</span>
              </button>

              <button
                onClick={onOpenSafetyModal}
                className="inline-flex items-center gap-1.5 px-3 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-200 text-xs font-bold transition cursor-pointer"
                title={t('Medical Safety & Guidelines')}
              >
                <Shield className="h-4 w-4 text-emerald-400" />
                <span className="hidden sm:inline">{t('Safety')}</span>
              </button>
            </div>
          </div>

          {/* Live Statistics Counter Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-3"
                >
                  <div className="p-2 rounded-xl bg-white/10">
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-white tracking-tight">{stat.value}</div>
                    <div className="text-[11px] text-slate-300 font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Global Community Search & Tab Navigation Bar */}
      <div className="mx-auto max-w-7xl px-4 py-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('Search discussions, clinical topics, health questions, groups, peers or events...')}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded-lg transition"
            >
              {t('Clear')}
            </button>
          )}
        </div>

        {/* Scrollable Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-violet-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-white text-violet-800' : 'bg-rose-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
