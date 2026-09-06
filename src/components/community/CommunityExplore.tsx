import React from 'react';
import { 
  TrendingUp, 
  Flame, 
  Hash, 
  Users, 
  Sparkles, 
  ArrowRight, 
  UserPlus, 
  UserCheck, 
  CheckCircle2, 
  Activity,
  Heart,
  Brain,
  Salad,
  Pill,
  Dna,
  BookOpen,
  Award
} from 'lucide-react';
import { CommunityUserProfile } from './CommunityTypes';
import { useLocalization } from '../../context/LocalizationContext';

interface CommunityExploreProps {
  recommendedUsers: CommunityUserProfile[];
  onToggleFollow: (userId: string) => void;
  onSelectTopic: (topic: string) => void;
  onSelectCategory: (category: string) => void;
  onOpenUserProfile: (username: string) => void;
}

export const CommunityExplore: React.FC<CommunityExploreProps> = ({
  recommendedUsers,
  onToggleFollow,
  onSelectTopic,
  onSelectCategory,
  onOpenUserProfile
}) => {
  const { t, formatNumber } = useLocalization();

  const trendingTopics = [
    { title: 'Apolipoprotein B (ApoB) Target Guidelines in CAD', posts: '1.4K posts', category: 'Cardiology', tag: 'ApoB' },
    { title: 'Dawn Phenomenon: Reversing Morning Glucose Spikes', posts: '980 posts', category: 'Endocrinology', tag: 'BloodSugar' },
    { title: 'Fermented Foods & 19 Cytokines Reduction Trial', posts: '850 posts', category: 'Gut Microbiome', tag: 'GutHealth' },
    { title: 'Zone 2 Lactate Threshold & Mitochondrial Density', posts: '720 posts', category: 'Exercise Physiology', tag: 'Zone2Cardio' },
    { title: 'Glymphatic Brain Waste Clearance During N3 Sleep', posts: '640 posts', category: 'Neuroscience', tag: 'SleepMedicine' },
    { title: 'NEET & USMLE Clinical Case Challenges 2026', posts: '2.1K posts', category: 'Medical Prep', tag: 'NEET' }
  ];

  const popularHashtags = [
    { tag: 'ApoB', count: '14.2K' },
    { tag: 'BloodSugarControl', count: '12.8K' },
    { tag: 'GutMicrobiome', count: '9.4K' },
    { tag: 'Zone2Cardio', count: '8.1K' },
    { tag: 'NEET', count: '18.5K' },
    { tag: 'LongevityMedicine', count: '7.9K' },
    { tag: 'MentalWellness', count: '11.3K' },
    { tag: 'PreventiveCardiology', count: '6.5K' }
  ];

  const exploreCategories = [
    { name: 'Cardiovascular & Lipidology', icon: Heart, count: '3.4K discussions', color: 'from-rose-500/10 to-rose-500/5 text-rose-700 border-rose-200' },
    { name: 'Diabetes & Metabolic Health', icon: Activity, count: '4.8K discussions', color: 'from-blue-500/10 to-blue-500/5 text-blue-700 border-blue-200' },
    { name: 'Clinical Nutrition & Dietetics', icon: Salad, count: '5.2K discussions', color: 'from-emerald-500/10 to-emerald-500/5 text-emerald-700 border-emerald-200' },
    { name: 'Neuroscience & Sleep Architecture', icon: Brain, count: '2.9K discussions', color: 'from-purple-500/10 to-purple-500/5 text-purple-700 border-purple-200' },
    { name: 'Pharmacology & Interactions', icon: Pill, count: '2.1K discussions', color: 'from-amber-500/10 to-amber-500/5 text-amber-700 border-amber-200' },
    { name: 'Medical Students & Exam Prep', icon: BookOpen, count: '6.8K discussions', color: 'from-indigo-500/10 to-indigo-500/5 text-indigo-700 border-indigo-200' },
    { name: 'Genomics & Longevity Science', icon: Dna, count: '1.8K discussions', color: 'from-cyan-500/10 to-cyan-500/5 text-cyan-700 border-cyan-200' },
    { name: 'Physical Therapy & Orthopedics', icon: Award, count: '2.4K discussions', color: 'from-violet-500/10 to-violet-500/5 text-violet-700 border-violet-200' }
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-violet-300" />
            <span>{t('Discover Community Knowledge')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{t('Explore Trending Clinical Insights')}</h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {t('Follow verified doctors, explore curated health topics, and join high-yield medical conversations.')}
          </p>
        </div>
      </div>

      {/* Top 2-Column Section: Trending Discussions & Hot Hashtags */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trending Discussions (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t('Trending Medical Discussions')}</h3>
                <p className="text-xs text-slate-500">{t('Highest activity and peer engagement in the last 24h')}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {trendingTopics.map((top, idx) => (
              <button
                key={idx}
                onClick={() => onSelectTopic(top.tag)}
                className="text-left p-4 rounded-2xl bg-slate-50 hover:bg-violet-50/60 border border-slate-200/80 hover:border-violet-300 transition cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-violet-700">#{top.tag}</span>
                  <span>{top.posts}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-violet-800 transition line-clamp-2">
                  {top.title}
                </h4>
                <div className="text-[11px] font-medium text-slate-500">
                  {t('In')} <span className="font-bold text-slate-700">{top.category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Hot Hashtags */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Hash className="h-5 w-5 text-violet-600" />
            <h3 className="text-base font-bold text-slate-900">{t('Popular Hashtags')}</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {popularHashtags.map((h, idx) => (
              <button
                key={idx}
                onClick={() => onSelectTopic(h.tag)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-violet-50 text-slate-800 hover:text-violet-800 border border-slate-200 hover:border-violet-300 transition text-xs font-bold cursor-pointer"
              >
                <span className="text-violet-600">#</span>
                <span>{h.tag}</span>
                <span className="text-[10px] text-slate-400 font-normal">({h.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Members to Follow */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t('Verified Clinicians & Peer Mentors')}</h3>
              <p className="text-xs text-slate-500">{t('Follow leading medical educators and specialized clinicians')}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommendedUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 flex flex-col justify-between space-y-4 hover:shadow-xs transition"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-violet-200"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenUserProfile(user.username)}
                        className="text-xs font-bold text-slate-900 hover:text-violet-700 transition cursor-pointer text-left line-clamp-1"
                      >
                        {user.displayName}
                      </button>
                      {user.isVerified && <CheckCircle2 className="h-3.5 w-3.5 text-violet-600 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{user.roleLabel}</div>
                    <div className="text-[10px] text-violet-700 font-bold">{user.specialty}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {user.bio}
                </p>

                <div className="text-[11px] text-slate-400 font-semibold">
                  {formatNumber(user.followersCount)} {t('followers')} • {user.postsCount} {t('posts')}
                </div>
              </div>

              <button
                onClick={() => onToggleFollow(user.id)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  user.isFollowing
                    ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                    : 'bg-violet-700 text-white hover:bg-violet-600 shadow-2xs'
                }`}
              >
                {user.isFollowing ? (
                  <>
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>{t('Following')}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>{t('Follow')}</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Explore by Category Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-600" />
          <span>{t('Explore by Medical Specialty & Category')}</span>
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {exploreCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectCategory(cat.name)}
                className={`text-left p-4 rounded-2xl bg-gradient-to-br border transition cursor-pointer hover:scale-102 duration-200 space-y-3 ${cat.color}`}
              >
                <div className="p-2.5 rounded-xl bg-white shadow-2xs inline-block">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{cat.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{cat.count}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
