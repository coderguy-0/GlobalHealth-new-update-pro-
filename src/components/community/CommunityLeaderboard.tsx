import React, { useState } from 'react';
import { 
  Award, 
  Crown, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  TrendingUp, 
  HelpCircle, 
  Star,
  Users
} from 'lucide-react';
import { LEADERBOARD_USERS } from './communityMockData';
import { useLocalization } from '../../context/LocalizationContext';

interface CommunityLeaderboardProps {
  onOpenUserProfile: (username: string) => void;
}

export const CommunityLeaderboard: React.FC<CommunityLeaderboardProps> = ({
  onOpenUserProfile
}) => {
  const { t, formatNumber } = useLocalization();
  const [timeRange, setTimeRange] = useState<'weekly' | 'alltime'>('alltime');

  const badgeCatalog = [
    { name: 'Verified Physician', icon: '🩺', desc: 'Licensed medical clinician credentials confirmed', points: '5,000 pts' },
    { name: 'Knowledge Sharer', icon: '🎓', desc: 'Authored 25+ evidence-based medical articles', points: '1,500 pts' },
    { name: 'Top Helpful Peer', icon: '🏅', desc: 'Received 100+ community helpful votes on answers', points: '1,000 pts' },
    { name: 'Discussion Champion', icon: '🌟', desc: 'Initiated top trending medical questions', points: '750 pts' },
    { name: 'Centurion Pacer', icon: '🏃‍♂️', desc: '100 consecutive days of mobility & cardio tracking', points: '500 pts' },
    { name: 'Trusted Member', icon: '🛡️', desc: 'Active verified account with zero safety flags', points: '250 pts' }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-violet-700 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
              <Award className="h-3.5 w-3.5 text-amber-300" />
              <span>{t('Community Recognition & Reputation')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">{t('Top Health Leaders & Clinical Contributors')}</h2>
            <p className="text-xs sm:text-sm text-slate-200">
              {t('Earn reputation points by posting peer-reviewed answers, helping members, and organizing health circles.')}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-black/20 p-1 rounded-2xl backdrop-blur-md shrink-0">
            <button
              onClick={() => setTimeRange('alltime')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                timeRange === 'alltime' ? 'bg-white text-slate-900 shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              👑 {t('All-Time')}
            </button>
            <button
              onClick={() => setTimeRange('weekly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                timeRange === 'weekly' ? 'bg-white text-slate-900 shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              🔥 {t('This Week')}
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            <span>{t('Reputation Leaderboard Rankings')}</span>
          </h3>
          <span className="text-xs text-slate-400">{t('Updated every 15 minutes')}</span>
        </div>

        <div className="space-y-3">
          {LEADERBOARD_USERS.map((user) => (
            <div
              key={user.rank}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-violet-50/60 border border-slate-200/80 transition flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                  user.rank === 1 ? 'bg-amber-400 text-slate-950 shadow-xs' :
                  user.rank === 2 ? 'bg-slate-300 text-slate-900' :
                  user.rank === 3 ? 'bg-amber-700 text-white' :
                  'bg-slate-200 text-slate-700'
                }`}>
                  {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                </div>

                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-2xs"
                />

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">{user.name}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-violet-600" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">{user.specialty} • {user.answers} {t('Contributions')}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm sm:text-base font-black text-violet-900">{formatNumber(user.points)}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">{t('Rep Points')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Catalog */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-600" />
          <span>{t('Available Community Badges & Milestones')}</span>
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badgeCatalog.map((badge, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{badge.icon}</span>
                <span className="text-[10px] font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">{badge.points}</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">{badge.name}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
