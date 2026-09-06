import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  CheckCircle2, 
  Award, 
  BarChart2, 
  Send, 
  FileText, 
  ShieldAlert, 
  Flame, 
  Clock, 
  TrendingUp, 
  UserPlus, 
  UserCheck, 
  Sparkles,
  Pin,
  ExternalLink,
  HelpCircle,
  Megaphone,
  Check
} from 'lucide-react';
import { CommunityPostItem, FeedFilter, CommunityComment } from './CommunityTypes';
import { useLocalization } from '../../context/LocalizationContext';

interface CommunityFeedProps {
  posts: CommunityPostItem[];
  currentFilter: FeedFilter;
  onFilterChange: (filter: FeedFilter) => void;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onToggleFollow: (userId: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onReportPost: (postId: string, title?: string) => void;
  onSharePost: (post: CommunityPostItem) => void;
  onOpenUserProfile: (username: string) => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  posts,
  currentFilter,
  onFilterChange,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
  onVotePoll,
  onAddComment,
  onReportPost,
  onSharePost,
  onOpenUserProfile
}) => {
  const { t, formatNumber } = useLocalization();
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const filters = [
    { id: 'foryou' as FeedFilter, label: t('For You'), icon: Sparkles },
    { id: 'following' as FeedFilter, label: t('Following'), icon: UserCheck },
    { id: 'latest' as FeedFilter, label: t('Latest'), icon: Clock },
    { id: 'trending' as FeedFilter, label: t('Trending'), icon: Flame },
    { id: 'discussed' as FeedFilter, label: t('Most Discussed'), icon: MessageSquare },
    { id: 'saved' as FeedFilter, label: t('Saved Posts'), icon: Bookmark }
  ];

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const getPostTypeBadge = (postType: string) => {
    switch (postType) {
      case 'question':
        return { label: t('Medical Question'), color: 'bg-amber-50 text-amber-800 border-amber-200', icon: HelpCircle };
      case 'poll':
        return { label: t('Community Poll'), color: 'bg-blue-50 text-blue-800 border-blue-200', icon: BarChart2 };
      case 'announcement':
        return { label: t('Clinical Announcement'), color: 'bg-purple-50 text-purple-800 border-purple-200', icon: Megaphone };
      case 'achievement':
        return { label: t('Health Milestone'), color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: Award };
      case 'document':
        return { label: t('Clinical Guide'), color: 'bg-rose-50 text-rose-800 border-rose-200', icon: FileText };
      default:
        return { label: t('Discussion'), color: 'bg-slate-50 text-slate-700 border-slate-200', icon: MessageSquare };
    }
  };

  return (
    <div className="space-y-6">
      {/* Feed Filters Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          {filters.map((f) => {
            const Icon = f.icon;
            const isActive = currentFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onFilterChange(f.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-violet-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 font-semibold px-2 hidden sm:block">
          {posts.length} {t('posts found')}
        </div>
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-xs">
          <MessageSquare className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">{t('No posts found in this feed')}</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {t('Try changing your feed filter or be the first to start a conversation in our health community!')}
          </p>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => {
          const typeBadge = getPostTypeBadge(post.postType);
          const TypeIcon = typeBadge.icon;
          const isCommentsOpen = openCommentsPostId === post.id;
          const isMenuOpen = activeMenuPostId === post.id;

          return (
            <div 
              key={post.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Pinned Post Indicator */}
              {post.isPinned && (
                <div className="bg-violet-50/80 px-6 py-2 border-b border-violet-100 flex items-center gap-2 text-violet-800 text-xs font-bold">
                  <Pin className="h-3.5 w-3.5 text-violet-600" />
                  <span>{t('Pinned Community Clinical Spotlight')}</span>
                </div>
              )}

              <div className="p-6 space-y-4">
                {/* Post Top Header: Author info & 3-dots menu */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onOpenUserProfile(post.author.username)}
                      className="relative shrink-0 group cursor-pointer"
                    >
                      <img
                        src={post.author.avatar}
                        alt={post.author.displayName}
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-violet-400 transition"
                      />
                      {post.author.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-violet-600 rounded-full p-0.5 text-white shadow-xs">
                          <CheckCircle2 className="h-3 w-3 fill-current" />
                        </div>
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => onOpenUserProfile(post.author.username)}
                          className="text-sm font-bold text-slate-900 hover:text-violet-700 transition cursor-pointer text-left"
                        >
                          {post.author.displayName}
                        </button>
                        
                        <span className="text-xs text-slate-400">@{post.author.username}</span>

                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                          post.author.role === 'verified_doctor'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : post.author.role === 'health_educator'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {post.author.roleLabel || t('Member')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{post.timestamp}</span>
                        <span>•</span>
                        <span className="text-slate-600 font-medium">{post.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Right: Follow button & 3-dots Menu */}
                  <div className="flex items-center gap-2 relative">
                    <button
                      onClick={() => onToggleFollow(post.author.id)}
                      className={`hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        post.author.isFollowing
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200/60'
                      }`}
                    >
                      {post.author.isFollowing ? (
                        <>
                          <UserCheck className="h-3.5 w-3.5 text-slate-600" />
                          <span>{t('Following')}</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-3.5 w-3.5 text-violet-600" />
                          <span>{t('Follow')}</span>
                        </>
                      )}
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuPostId(isMenuOpen ? null : post.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        title={t('Post Options')}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                          <button
                            onClick={() => {
                              onSharePost(post);
                              setActiveMenuPostId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Share2 className="h-3.5 w-3.5 text-slate-500" />
                            <span>{t('Share Post Link')}</span>
                          </button>
                          <button
                            onClick={() => {
                              onToggleSave(post.id);
                              setActiveMenuPostId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Bookmark className="h-3.5 w-3.5 text-slate-500" />
                            <span>{post.isSaved ? t('Remove from Saved') : t('Save Post')}</span>
                          </button>
                          <button
                            onClick={() => {
                              onReportPost(post.id, post.title);
                              setActiveMenuPostId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer border-t border-slate-100"
                          >
                            <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                            <span>{t('Report Misinformation')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Post Type Badge */}
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${typeBadge.color}`}>
                    <TypeIcon className="h-3.5 w-3.5" />
                    <span>{typeBadge.label}</span>
                  </span>
                </div>

                {/* Post Title */}
                {post.title && (
                  <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-snug">
                    {post.title}
                  </h2>
                )}

                {/* Post Text Content */}
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </div>

                {/* Attached Image Media */}
                {post.attachments?.map((att, idx) => {
                  if (att.type === 'image') {
                    return (
                      <div key={idx} className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 mt-3 max-h-96">
                        <img
                          src={att.url}
                          alt={att.title || 'Attached Medical Visual'}
                          className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                        />
                        {att.title && (
                          <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-lg">
                            {att.title}
                          </div>
                        )}
                      </div>
                    );
                  }
                  if (att.type === 'document') {
                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 mt-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{att.title}</div>
                            <div className="text-[11px] text-slate-500">{att.fileSize || 'PDF Resource Document'}</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => alert(t('Downloading clinical resource document...'))}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                        >
                          {t('Download PDF')}
                        </button>
                      </div>
                    );
                  }
                  return null;
                })}

                {/* Interactive Poll System */}
                {post.poll && (
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3 mt-3">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-950">
                      <span>📊 {post.poll.question}</span>
                      <span className="text-[11px] text-blue-700 font-medium">{post.poll.endsIn}</span>
                    </div>

                    <div className="space-y-2">
                      {post.poll.options.map((opt) => {
                        const total = post.poll?.totalVotes || 1;
                        const percent = Math.round((opt.votes / total) * 100);
                        const isVoted = post.poll?.userVotedOptionId === opt.id;

                        return (
                          <button
                            key={opt.id}
                            onClick={() => onVotePoll(post.id, opt.id)}
                            className={`w-full text-left relative p-3 rounded-xl border transition cursor-pointer overflow-hidden ${
                              isVoted
                                ? 'border-blue-500 bg-blue-100/70 font-bold'
                                : 'border-slate-200 bg-white hover:bg-slate-50'
                            }`}
                          >
                            <div 
                              className="absolute top-0 bottom-0 left-0 bg-blue-200/50 transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                            <div className="relative flex items-center justify-between text-xs text-slate-900">
                              <span className="flex items-center gap-2">
                                {isVoted && <Check className="h-3.5 w-3.5 text-blue-700 shrink-0" />}
                                {opt.text}
                              </span>
                              <span className="font-extrabold text-blue-950 ml-2">{percent}% ({opt.votes})</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-[11px] text-blue-800 font-medium text-right">
                      {formatNumber(post.poll.totalVotes)} {t('total community votes')}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tg, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold text-violet-700 bg-violet-50/80 px-2.5 py-0.5 rounded-lg hover:bg-violet-100 transition cursor-pointer"
                      >
                        #{tg}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Card Action Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-slate-600">
                  <div className="flex items-center gap-2 sm:gap-4">
                    {/* Like / Heart */}
                    <button
                      onClick={() => onToggleLike(post.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                        post.isLiked
                          ? 'text-rose-600 bg-rose-50 font-extrabold'
                          : 'hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current text-rose-600' : ''}`} />
                      <span>{formatNumber(post.likesCount)}</span>
                    </button>

                    {/* Comments Toggle */}
                    <button
                      onClick={() => setOpenCommentsPostId(isCommentsOpen ? null : post.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                        isCommentsOpen
                          ? 'text-violet-700 bg-violet-50 font-extrabold'
                          : 'hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{formatNumber(post.commentsCount || post.comments.length)}</span>
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => onSharePost(post)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="hidden sm:inline">{t('Share')}</span>
                    </button>
                  </div>

                  {/* Bookmark Save */}
                  <button
                    onClick={() => onToggleSave(post.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                      post.isSaved
                        ? 'text-violet-700 bg-violet-50 font-extrabold'
                        : 'hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${post.isSaved ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">{post.isSaved ? t('Saved') : t('Save')}</span>
                  </button>
                </div>

                {/* Comment Thread Drawer */}
                {isCommentsOpen && (
                  <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in duration-200">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {t('Discussion & Verified Peer Responses')} ({post.comments.length})
                    </h3>

                    {/* Comments List */}
                    <div className="space-y-3">
                      {post.comments.map((comm) => (
                        <div 
                          key={comm.id}
                          className={`p-3.5 rounded-2xl border space-y-2 ${
                            comm.isBestAnswer
                              ? 'bg-amber-50/40 border-amber-200'
                              : 'bg-slate-50/70 border-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={comm.authorAvatar}
                                alt={comm.authorName}
                                className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200"
                              />
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-bold text-slate-900">{comm.authorName}</span>
                                  {comm.isVerified && <CheckCircle2 className="h-3 w-3 text-violet-600" />}
                                  {comm.authorSpecialty && (
                                    <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.2 rounded">
                                      {comm.authorSpecialty}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400">{comm.timestamp}</span>
                              </div>
                            </div>

                            {comm.isBestAnswer && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold shadow-2xs">
                                <Award className="h-3 w-3" />
                                <span>{t('Best Answer')}</span>
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-700 leading-relaxed pl-9">
                            {comm.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Inline Reply Input */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCommentSubmit(post.id);
                        }}
                        placeholder={t('Write an evidence-informed reply or clinical insight...')}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        className="p-2.5 rounded-xl bg-violet-700 hover:bg-violet-600 text-white transition cursor-pointer shrink-0 shadow-2xs"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
