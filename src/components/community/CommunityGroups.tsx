import React, { useState } from 'react';
import { 
  Users, 
  Lock, 
  Globe, 
  Sparkles, 
  ArrowLeft, 
  ShieldCheck, 
  PlusCircle, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Info, 
  CheckCircle2, 
  Share2, 
  Settings, 
  Activity,
  Flame,
  Search,
  Check
} from 'lucide-react';
import { CommunityGroup, CommunityPostItem } from './CommunityTypes';
import { useLocalization } from '../../context/LocalizationContext';

interface CommunityGroupsProps {
  groups: CommunityGroup[];
  onToggleJoinGroup: (groupId: string) => void;
  onOpenCreateGroupPost?: (group: CommunityGroup) => void;
  onShareGroup?: (group: CommunityGroup) => void;
}

export const CommunityGroups: React.FC<CommunityGroupsProps> = ({
  groups,
  onToggleJoinGroup,
  onOpenCreateGroupPost,
  onShareGroup
}) => {
  const { t, formatNumber } = useLocalization();
  const [selectedGroup, setSelectedGroup] = useState<CommunityGroup | null>(null);
  const [groupTab, setGroupTab] = useState<'discussions' | 'posts' | 'members' | 'events' | 'files' | 'about'>('discussions');
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [filterPrivacy, setFilterPrivacy] = useState<'all' | 'public' | 'joined'>('all');

  const filteredGroups = groups.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
                          g.description.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
                          g.category.toLowerCase().includes(groupSearchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterPrivacy === 'joined') return g.isJoined;
    if (filterPrivacy === 'public') return g.privacy === 'public';
    return true;
  });

  // Individual Group Detail View
  if (selectedGroup) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedGroup(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-violet-700 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('Back to All Health Groups')}</span>
        </button>

        {/* Group Hero Banner Header */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="relative h-48 sm:h-64 w-full bg-slate-900 overflow-hidden">
            <img
              src={selectedGroup.coverImage}
              alt={selectedGroup.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
                selectedGroup.privacy === 'public'
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-amber-500/90 text-white'
              }`}>
                {selectedGroup.privacy === 'public' ? t('Public Group') : t('Private Group')}
              </span>
            </div>

            {/* Bottom Header Info */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div className="flex items-center gap-3">
                <div className="text-4xl sm:text-5xl p-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shrink-0">
                  {selectedGroup.icon}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">{selectedGroup.name}</h1>
                  <p className="text-xs text-slate-200">@{selectedGroup.handle} • {selectedGroup.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleJoinGroup(selectedGroup.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    selectedGroup.isJoined
                      ? 'bg-white text-slate-900 hover:bg-slate-100 shadow-sm'
                      : 'bg-violet-600 hover:bg-violet-500 text-white shadow-md'
                  }`}
                >
                  {selectedGroup.isJoined ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{t('Joined Member')}</span>
                    </>
                  ) : (
                    <>
                      <Users className="h-3.5 w-3.5" />
                      <span>{t('Join Group')}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onShareGroup?.(selectedGroup)}
                  className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition cursor-pointer"
                  title={t('Share Group')}
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Group Stats Bar */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm font-black text-slate-900">{formatNumber(selectedGroup.memberCount)}</div>
              <div className="text-[11px] text-slate-500 font-medium">{t('Active Members')}</div>
            </div>
            <div>
              <div className="text-sm font-black text-slate-900">{formatNumber(selectedGroup.postsCount)}</div>
              <div className="text-[11px] text-slate-500 font-medium">{t('Total Discussions')}</div>
            </div>
            <div>
              <div className="text-sm font-black text-emerald-700">{selectedGroup.activityLevel}</div>
              <div className="text-[11px] text-slate-500 font-medium">{t('Activity Level')}</div>
            </div>
            <div>
              <div className="text-sm font-black text-slate-900">{selectedGroup.moderators.length} {t('Clinicians')}</div>
              <div className="text-[11px] text-slate-500 font-medium">{t('Moderator Team')}</div>
            </div>
          </div>

          {/* Group Sub-Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto p-2 border-t border-slate-200">
            {[
              { id: 'discussions', label: t('Discussions'), icon: MessageSquare },
              { id: 'members', label: t('Members'), icon: Users },
              { id: 'events', label: t('Events'), icon: Calendar },
              { id: 'files', label: t('Clinical Resources'), icon: FileText },
              { id: 'about', label: t('About & Rules'), icon: Info }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = groupTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setGroupTab(tab.id as any)}
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

        {/* Group Tab Contents */}
        {groupTab === 'discussions' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">{t('Recent Clinical Topics in this Group')}</h3>
              <div className="space-y-2">
                {selectedGroup.recentTopics.map((top, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{top}</span>
                    <button className="text-violet-700 hover:underline font-semibold cursor-pointer">
                      {t('Join Thread')} →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {groupTab === 'about' && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Info className="h-4 w-4 text-violet-600" />
                <span>{t('About this Circle')}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {selectedGroup.description}
              </p>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">{t('Verified Group Moderators')}</h4>
                <div className="space-y-2">
                  {selectedGroup.moderators.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
                      <img src={m.avatar} alt={m.name} className="h-8 w-8 rounded-full object-cover" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{m.name}</div>
                        <div className="text-[10px] text-violet-700 font-semibold">{m.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>{t('Group Safety & Conduct Rules')}</span>
              </h3>
              <ul className="space-y-2.5">
                {selectedGroup.rules.map((rule, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {groupTab === 'members' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">{t('Group Members')} ({formatNumber(selectedGroup.memberCount)})</h3>
            <p className="text-xs text-slate-500">{t('Connect with peer patients, caregivers, and medical practitioners.')}</p>
          </div>
        )}

        {groupTab === 'files' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">{t('Clinical Resources & Shared Guides')}</h3>
            <p className="text-xs text-slate-500">{t('Download verified charts, dietary templates, and pharmacological reference sheets.')}</p>
          </div>
        )}

        {groupTab === 'events' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">{t('Group Webinars & Live Study Sessions')}</h3>
            <p className="text-xs text-slate-500">{t('Stay informed with upcoming events hosted by this group.')}</p>
          </div>
        )}
      </div>
    );
  }

  // Groups Directory List View
  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={groupSearchQuery}
            onChange={(e) => setGroupSearchQuery(e.target.value)}
            placeholder={t('Search health groups by disease, specialty or habit...')}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: t('All Groups') },
            { id: 'joined', label: t('My Joined Groups') },
            { id: 'public', label: t('Public Only') }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterPrivacy(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterPrivacy === f.id
                  ? 'bg-violet-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.map((grp) => (
          <div
            key={grp.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Cover Image */}
              <div className="relative h-36 w-full bg-slate-900">
                <img
                  src={grp.coverImage}
                  alt={grp.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                <div className="absolute top-3 left-3 text-2xl p-1.5 rounded-xl bg-white/20 backdrop-blur-md">
                  {grp.icon}
                </div>

                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md ${
                    grp.privacy === 'public' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'
                  }`}>
                    {grp.privacy === 'public' ? t('Public') : t('Private')}
                  </span>
                </div>

                <div className="absolute bottom-2 left-3 right-3 text-white">
                  <span className="text-[10px] font-semibold text-slate-300">{grp.category}</span>
                  <h3 className="text-base font-extrabold tracking-tight line-clamp-1">{grp.name}</h3>
                </div>
              </div>

              {/* Group Body */}
              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {grp.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800">{formatNumber(grp.memberCount)} {t('Members')}</span>
                  <span className="text-emerald-700 font-semibold">{grp.activityLevel}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setSelectedGroup(grp)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-violet-700 bg-white hover:bg-slate-100 border border-slate-200 transition cursor-pointer text-center"
              >
                {t('View Group')}
              </button>

              <button
                onClick={() => onToggleJoinGroup(grp.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  grp.isJoined
                    ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                    : 'bg-violet-700 hover:bg-violet-600 text-white shadow-2xs'
                }`}
              >
                {grp.isJoined ? t('Joined') : t('Join')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
