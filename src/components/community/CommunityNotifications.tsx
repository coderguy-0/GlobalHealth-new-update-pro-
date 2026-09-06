import React, { useState } from 'react';
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  UserPlus, 
  Calendar, 
  ShieldCheck, 
  CheckCheck, 
  Sparkles,
  Award,
  Filter
} from 'lucide-react';
import { CommunityNotificationItem } from './CommunityTypes';
import { useLocalization } from '../../context/LocalizationContext';

interface CommunityNotificationsProps {
  notifications: CommunityNotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectNotification?: (notif: CommunityNotificationItem) => void;
}

export const CommunityNotifications: React.FC<CommunityNotificationsProps> = ({
  notifications,
  onMarkAllAsRead,
  onSelectNotification
}) => {
  const { t } = useLocalization();
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = notifications.filter(n => {
    if (filterType === 'social') return n.type === 'like' || n.type === 'comment' || n.type === 'follow';
    if (filterType === 'groups') return n.type === 'group' || n.type === 'event';
    if (filterType === 'system') return n.type === 'system';
    return true;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-rose-500 fill-current" />;
      case 'comment':
        return <Award className="h-4 w-4 text-amber-500" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-violet-600" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      default:
        return <ShieldCheck className="h-4 w-4 text-emerald-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">{t('Notifications Center')}</h2>
            <p className="text-xs text-slate-500">{t('Stay informed with peer discussions, answers, and clinical events')}</p>
          </div>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
        >
          <CheckCheck className="h-4 w-4 text-violet-600" />
          <span>{t('Mark All as Read')}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {[
          { id: 'all', label: t('All Notifications') },
          { id: 'social', label: t('Social & Likes') },
          { id: 'groups', label: t('Groups & Events') },
          { id: 'system', label: t('System & Milestones') }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterType === tab.id
                ? 'bg-violet-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectNotification?.(item)}
            className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${
              item.isRead
                ? 'bg-white border-slate-200/80 hover:bg-slate-50'
                : 'bg-violet-50/50 border-violet-200 hover:bg-violet-50'
            }`}
          >
            <div className="relative shrink-0">
              <img
                src={item.actorAvatar}
                alt={item.actorName}
                className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200"
              />
              <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-xs">
                {getNotifIcon(item.type)}
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">{item.title}</span>
                <span className="text-[10px] text-slate-400 font-medium">{item.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
