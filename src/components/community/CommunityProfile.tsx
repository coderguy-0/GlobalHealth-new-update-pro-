import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Mail, 
  UserPlus, 
  UserCheck, 
  Share2, 
  Sparkles, 
  MessageSquare, 
  Bookmark, 
  Heart,
  ShieldCheck,
  Flame,
  Layers
} from 'lucide-react';
import { CommunityUserProfile, CommunityPostItem } from './CommunityTypes';
import { useLocalization } from '../../context/LocalizationContext';

interface CommunityProfileProps {
  user: CommunityUserProfile;
  posts: CommunityPostItem[];
  onToggleFollow: (userId: string) => void;
  onOpenMessage: (user: CommunityUserProfile) => void;
  onShareProfile?: (user: CommunityUserProfile) => void;
}

export const CommunityProfile: React.FC<CommunityProfileProps> = ({
  user,
  posts,
  onToggleFollow,
  onOpenMessage,
  onShareProfile
}) => {
  const { t, formatNumber } = useLocalization();
  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'questions' | 'badges' | 'interests'>('posts');

  const userPosts = posts.filter(p => p.author.username === user.username);
  const userQuestions = posts.filter(p => p.author.username === user.username && p.postType === 'question');

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-900 overflow-hidden">
          <img
            src={user.coverImage}
            alt={user.displayName}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        </div>

        {/* Profile Details Container */}
        <div className="px-6 sm:px-8 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar */}
            <div className="relative inline-block">
              <img
                src={user.avatar}
                alt={user.displayName}
                className="h-28 w-28 sm:h-36 sm:w-36 rounded-full object-cover ring-4 ring-white shadow-lg bg-slate-100"
              />
              {user.isVerified && (
                <div className="absolute bottom-2 right-2 bg-violet-600 rounded-full p-1 text-white shadow-md">
                  <CheckCircle2 className="h-4 w-4 fill-current" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onToggleFollow(user.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  user.isFollowing
                    ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                    : 'bg-violet-700 hover:bg-violet-600 text-white shadow-2xs'
                }`}
              >
                {user.isFollowing ? (
                  <>
                    <UserCheck className="h-4 w-4" />
                    <span>{t('Following')}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>{t('Follow')}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onOpenMessage(user)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="h-4 w-4 text-slate-600" />
                <span>{t('Message')}</span>
              </button>

              <button
                onClick={() => onShareProfile?.(user)}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                title={t('Share Profile')}
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* User Bio & Meta */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.displayName}</h1>
                <span className="text-xs text-slate-400 font-medium">@{user.username}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-violet-50 text-violet-700 border border-violet-200">
                  {user.roleLabel}
                </span>
              </div>
              {user.specialty && (
                <div className="text-xs font-bold text-blue-700 mt-0.5">{user.specialty}</div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-3xl leading-relaxed">
              {user.bio}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{user.location}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>{t('Joined')} {user.joinedDate}</span>
              </span>
              <span className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                <Award className="h-3.5 w-3.5 text-amber-600" />
                <span>{formatNumber(user.reputationPoints)} {t('Reputation Points')}</span>
              </span>
            </div>

            {/* Counts */}
            <div className="flex items-center gap-6 pt-2 border-t border-slate-100 text-xs text-slate-600 font-bold">
              <span><strong className="text-slate-900">{formatNumber(user.followersCount)}</strong> {t('Followers')}</span>
              <span><strong className="text-slate-900">{formatNumber(user.followingCount)}</strong> {t('Following')}</span>
              <span><strong className="text-slate-900">{user.postsCount}</strong> {t('Contributions')}</span>
            </div>
          </div>

          {/* Sub-Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-slate-200 mt-6">
            {[
              { id: 'posts', label: `${t('Posts')} (${userPosts.length})`, icon: Layers },
              { id: 'questions', label: `${t('Questions')} (${userQuestions.length})`, icon: MessageSquare },
              { id: 'badges', label: `${t('Badges & Awards')} (${user.badges.length})`, icon: Award },
              { id: 'interests', label: t('Health Interests'), icon: Sparkles }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-violet-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-Tab Contents */}
      {activeSubTab === 'badges' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t('Earned Community Badges & Credentials')}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {user.badges.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
                <div className="text-3xl">{b.icon}</div>
                <div className="text-xs font-bold text-slate-900">{b.name}</div>
                <p className="text-[11px] text-slate-500 leading-snug">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'interests' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t('Followed Medical & Wellness Specialties')}</h3>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((int, idx) => (
              <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-violet-50 text-violet-700 border border-violet-200 text-xs font-bold">
                🩺 {int}
              </span>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 text-xs text-slate-500">
              {t('No public posts published yet.')}
            </div>
          ) : (
            userPosts.map(p => (
              <div key={p.id} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
                <h3 className="text-base font-bold text-slate-900">{p.title || p.content.slice(0, 80)}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{p.content}</p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                  <span>{p.timestamp}</span>
                  <span className="font-bold text-violet-700">{p.likesCount} {t('Likes')} • {p.commentsCount} {t('Replies')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
