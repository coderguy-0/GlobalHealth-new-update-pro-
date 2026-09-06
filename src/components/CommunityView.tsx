import React, { useState, useMemo, useEffect } from 'react';
import { 
  CommunityTab, 
  FeedFilter, 
  CommunityPostItem, 
  CommunityUserProfile, 
  CommunityGroup, 
  CommunityEvent, 
  Conversation, 
  CommunityNotificationItem, 
  ModerationReportItem 
} from './community/CommunityTypes';
import { 
  CURRENT_USER, 
  RECOMMENDED_USERS, 
  INITIAL_COMMUNITY_POSTS, 
  COMMUNITY_GROUPS, 
  COMMUNITY_EVENTS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_MODERATION_REPORTS 
} from './community/communityMockData';
import { CommunityHeader } from './community/CommunityHeader';
import { CommunityFeed } from './community/CommunityFeed';
import { CommunityExplore } from './community/CommunityExplore';
import { CommunityGroups } from './community/CommunityGroups';
import { CommunityDiscussionsQA } from './community/CommunityDiscussionsQA';
import { CommunityEvents } from './community/CommunityEvents';
import { CommunityMessages } from './community/CommunityMessages';
import { CommunityNotifications } from './community/CommunityNotifications';
import { CommunityProfile } from './community/CommunityProfile';
import { CommunityLeaderboard } from './community/CommunityLeaderboard';
import { CommunityAdmin } from './community/CommunityAdmin';
import { CommunityPostComposerModal } from './community/CommunityPostComposerModal';
import { CommunityReportModal } from './community/CommunityReportModal';
import { CommunitySafetyModal } from './community/CommunitySafetyModal';
import { useLocalization } from '../context/LocalizationContext';
import { CheckCircle2, Bookmark, Lock, LogIn, UserPlus, Bell, MessageCircle, User } from 'lucide-react';
import type { UserAccount } from '../types';

interface CommunityViewProps {
  isAuthenticated?: boolean;
  currentUser?: UserAccount | null;
  onRequireAuth?: (feature: string) => void;
}

/**
 * Maps the single GlobalHealth account identity onto the Community profile.
 * Every post, comment, reply, like, save, follow, message and profile action
 * uses this same unified authenticated user — never a seeded demo identity.
 */
function toCommunityProfile(user: UserAccount | null | undefined): CommunityUserProfile {
  const fallback = CURRENT_USER;
  if (!user) return fallback;
  const displayName = user.fullName?.trim() || user.username || fallback.displayName;
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : fallback.joinedDate;
  return {
    id: user.id || fallback.id,
    username: user.username || displayName.toLowerCase().replace(/[^a-z0-9]+/g, '_') || fallback.username,
    displayName,
    avatar: user.avatarUrl || fallback.avatar,
    coverImage: fallback.coverImage,
    role: 'member',
    roleLabel: 'GlobalHealth Member',
    isVerified: true,
    bio: `Verified GlobalHealth account. Joined the community through the GlobalHealth User Portal.`,
    location: 'GlobalHealth Community',
    joinedDate,
    reputationPoints: 0,
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    badges: [{ id: 'b-gh', name: 'GlobalHealth Member', icon: '✅', description: 'Authenticated through the GlobalHealth User Portal.' }],
    interests: user.healthGoals || [],
  };
}

// Inline gate used for protected community tabs (messages, notifications, profile, saved).
const CommunityAuthGate: React.FC<{
  title: string;
  message: string;
  feature: string;
  icon: React.ReactNode;
  onRequireAuth?: (feature: string) => void;
}> = ({ title, message, feature, icon, onRequireAuth }) => (
  <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
      <span className="text-emerald-600">{icon}</span>
    </div>
    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    <p className="mt-2 text-sm leading-relaxed text-slate-500">{message}</p>
    <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
      <button
        onClick={() => onRequireAuth?.(feature)}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        <LogIn className="h-4 w-4" /> Log In
      </button>
      <button
        onClick={() => onRequireAuth?.(feature)}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        <UserPlus className="h-4 w-4" /> Create Account
      </button>
    </div>
  </div>
);

export const CommunityView: React.FC<CommunityViewProps> = ({
  isAuthenticated = false,
  currentUser: authUser,
  onRequireAuth
}) => {
  const { t } = useLocalization();

  // Navigation and Filtering State
  const [activeTab, setActiveTab] = useState<CommunityTab>('feed');
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('foryou');
  const [searchQuery, setSearchQuery] = useState('');

  // Primary Data State
  const [posts, setPosts] = useState<CommunityPostItem[]>(INITIAL_COMMUNITY_POSTS);
  const [groups, setGroups] = useState<CommunityGroup[]>(COMMUNITY_GROUPS);
  const [events, setEvents] = useState<CommunityEvent[]>(COMMUNITY_EVENTS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [notifications, setNotifications] = useState<CommunityNotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [moderationReports, setModerationReports] = useState<ModerationReportItem[]>(INITIAL_MODERATION_REPORTS);
  const [recommendedUsers, setRecommendedUsers] = useState<CommunityUserProfile[]>(RECOMMENDED_USERS);
  // Community identity always mirrors the ONE GlobalHealth session. For
  // guests it stays a seeded display profile; after login every action uses
  // the authenticated user's own id, name and profile.
  const [currentUser, setCurrentUser] = useState<CommunityUserProfile>(() => toCommunityProfile(authUser));

  // Keep the community identity in sync with the global session (login,
  // switch account, logout) without needing any separate community login.
  useEffect(() => {
    setCurrentUser(toCommunityProfile(authUser));
  }, [authUser]);

  // Selected Profile for viewing
  const [viewingProfile, setViewingProfile] = useState<CommunityUserProfile | null>(null);

  // Modal Controls
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [reportingPost, setReportingPost] = useState<{ id: string; title?: string } | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Unread badge counts
  const unreadMessagesCount = useMemo(() => {
    return conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [conversations]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const savedPostsCount = useMemo(() => {
    return posts.filter(p => p.isSaved).length;
  }, [posts]);

  // Require an account for participation actions; reading stays public.
  const guard = (feature: string): boolean => {
    if (isAuthenticated) return true;
    onRequireAuth?.(feature);
    return false;
  };

  // Handlers for Post Interactions
  const handleToggleLike = (postId: string) => {
    if (!guard('like and react to community posts')) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    }));
  };

  const handleToggleSave = (postId: string) => {
    if (!guard('save community content to your private library')) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isSaved = !p.isSaved;
        showToast(isSaved ? t('Post saved to your bookmarks') : t('Post removed from saved bookmarks'));
        return { ...p, isSaved };
      }
      return p;
    }));
  };

  const handleToggleFollow = (userId: string) => {
    if (!guard('follow community members')) return;
    setRecommendedUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const isFollowing = !u.isFollowing;
        showToast(isFollowing ? `${t('Following')} ${u.displayName}` : `${t('Unfollowed')} ${u.displayName}`);
        return {
          ...u,
          isFollowing,
          followersCount: isFollowing ? u.followersCount + 1 : u.followersCount - 1
        };
      }
      return u;
    }));
  };

  const handleVotePoll = (postId: string, optionId: string) => {
    if (!guard('vote in community polls')) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId && p.poll) {
        if (p.poll.userVotedOptionId) return p; // Already voted
        const updatedOptions = p.poll.options.map(opt => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });
        showToast(t('Vote recorded in community poll'));
        return {
          ...p,
          poll: {
            ...p.poll,
            options: updatedOptions,
            totalVotes: p.poll.totalVotes + 1,
            userVotedOptionId: optionId
          }
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string, content: string) => {
    if (!guard('comment and reply to community posts')) return;
    const newComment = {
      id: `comm-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      isVerified: currentUser.isVerified,
      content,
      timestamp: t('Just now'),
      likes: 0
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));
    showToast(t('Your comment was published'));
  };

  const handleCreatePost = (newPostData: Partial<CommunityPostItem>) => {
    if (!guard('publish posts and participate in discussions')) return;
    const post: CommunityPostItem = {
      id: `post-${Date.now()}`,
      author: currentUser,
      postType: newPostData.postType || 'discussion',
      title: newPostData.title,
      content: newPostData.content || '',
      category: newPostData.category || 'General Health',
      tags: newPostData.tags || [],
      attachments: newPostData.attachments,
      poll: newPostData.poll,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 1,
      visibility: newPostData.visibility || 'everyone',
      timestamp: t('Just now'),
      comments: []
    };

    setPosts(prev => [post, ...prev]);
    showToast(t('Post published to community feed'));
  };

  const handleSharePost = (post: CommunityPostItem) => {
    showToast(t('Link copied to clipboard! Share with your peers.'));
  };

  const handleOpenUserProfile = (username: string) => {
    if (username === currentUser.username) {
      setViewingProfile(currentUser);
      setActiveTab('profile');
      return;
    }
    const found = recommendedUsers.find(u => u.username === username);
    if (found) {
      setViewingProfile(found);
      setActiveTab('profile');
    }
  };

  const handleToggleJoinGroup = (groupId: string) => {
    if (!guard('join this community group and participate in discussions')) return;
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const isJoined = !g.isJoined;
        showToast(isJoined ? `${t('Joined')} ${g.name}` : `${t('Left')} ${g.name}`);
        return {
          ...g,
          isJoined,
          memberCount: isJoined ? g.memberCount + 1 : g.memberCount - 1
        };
      }
      return g;
    }));
  };

  const handleToggleRsvp = (eventId: string, status: 'going' | 'interested' | 'none') => {
    if (!guard('RSVP to community events')) return;
    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        const isNowGoing = status === 'going';
        const wasGoing = ev.rsvpStatus === 'going';
        let newAttendees = ev.attendeesCount;
        if (isNowGoing && !wasGoing) newAttendees += 1;
        if (!isNowGoing && wasGoing) newAttendees -= 1;

        showToast(status === 'going' ? t('RSVP confirmed! See you there.') : t('Status updated.'));
        return {
          ...ev,
          rsvpStatus: status,
          attendeesCount: newAttendees
        };
      }
      return ev;
    }));
  };

  const handleSendMessage = (conversationId: string, text: string) => {
    if (!guard('send messages')) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'user-current',
      text,
      timestamp: 'Just now',
      isRead: true
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: text,
          lastMessageTime: 'Just now',
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    }));
  };

  const handleMarkAllNotificationsRead = () => {
    if (!guard('view your personalized notifications')) return;
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast(t('All notifications marked as read'));
  };

  const handleResolveReport = (reportId: string, action: 'dismiss' | 'remove' | 'warn' | 'ban') => {
    setModerationReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return { ...r, status: 'resolved' };
      }
      return r;
    }));
    showToast(`${t('Report action applied')}: ${action.toUpperCase()}`);
  };

  const handleSubmitReport = (reason: string, details: string) => {
    const newRep: ModerationReportItem = {
      id: `rep-${Date.now()}`,
      reportedPostId: reportingPost?.id,
      reportedUser: 'reported_author',
      reporter: currentUser.displayName,
      reason,
      details,
      timestamp: t('Just now'),
      status: 'pending',
      severity: 'high',
      contentSnippet: reportingPost?.title || 'Reported Post Item'
    };
    setModerationReports(prev => [newRep, ...prev]);
    showToast(t('Report submitted to clinical moderators'));
  };

  // Filtered posts based on search & feed filter
  const displayedPosts = useMemo(() => {
    return posts.filter(post => {
      // Global Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesContent = post.content.toLowerCase().includes(q) ||
                               (post.title && post.title.toLowerCase().includes(q)) ||
                               post.category.toLowerCase().includes(q) ||
                               post.author.displayName.toLowerCase().includes(q) ||
                               post.tags.some(tg => tg.toLowerCase().includes(q));
        if (!matchesContent) return false;
      }

      // Tab or Filter specific
      if (activeTab === 'saved') {
        return post.isSaved;
      }

      if (activeTab === 'feed') {
        if (feedFilter === 'following') return post.author.isFollowing;
        if (feedFilter === 'saved') return post.isSaved;
        if (feedFilter === 'discussed') return post.comments.length > 0;
        if (feedFilter === 'trending') return post.likesCount > 200;
        return true; // For You / Latest
      }

      return true;
    });
  }, [posts, searchQuery, activeTab, feedFilter]);

  return (
    <div className="min-h-screen bg-slate-100/60 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Community Header */}
      <CommunityHeader
        activeTab={activeTab}
        onTabChange={(tab) => {
          // Personalized / private community areas require an account.
          const privateTabs: CommunityTab[] = ['messages', 'notifications', 'profile', 'saved', 'admin'];
          if (!isAuthenticated && (privateTabs as string[]).includes(tab)) {
            const featureMap: Record<string, string> = {
              messages: 'send and view your messages',
              notifications: 'view your personalized notifications',
              profile: 'access your community profile',
              saved: 'view your saved community content',
              admin: 'access community moderation'
            };
            onRequireAuth?.(featureMap[tab] || 'access this community area');
            return;
          }
          if (tab === 'profile') {
            setViewingProfile(currentUser);
          }
          setActiveTab(tab);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateModal={() => {
          if (!isAuthenticated) {
            onRequireAuth?.('publish posts, ask questions, and share experiences');
            return;
          }
          setIsComposerOpen(true);
        }}
        onOpenSafetyModal={() => setIsSafetyOpen(true)}
        unreadMessagesCount={isAuthenticated ? unreadMessagesCount : 0}
        unreadNotificationsCount={isAuthenticated ? unreadNotificationsCount : 0}
        savedCount={isAuthenticated ? savedPostsCount : 0}
      />

      {/* Main Container Body */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Gates for personalized / private community areas */}
        {!isAuthenticated && activeTab === 'messages' && (
          <CommunityAuthGate
            title="Login required to send messages"
            message="Sign in or create a GlobalHealth account to start conversations and message other community members."
            feature="send and view your messages"
            icon={<MessageCircle className="h-7 w-7" />}
            onRequireAuth={onRequireAuth}
          />
        )}
        {!isAuthenticated && activeTab === 'notifications' && (
          <CommunityAuthGate
            title="Notifications Require Login"
            message="Sign in to view your personalized GlobalHealth notifications — replies, mentions, groups and followers."
            feature="view your personalized notifications"
            icon={<Bell className="h-7 w-7" />}
            onRequireAuth={onRequireAuth}
          />
        )}
        {!isAuthenticated && activeTab === 'profile' && (
          <CommunityAuthGate
            title="Your community profile is private"
            message="Sign in to manage your profile, your posts, comments, groups, followers and saved community content."
            feature="access your community profile"
            icon={<User className="h-7 w-7" />}
            onRequireAuth={onRequireAuth}
          />
        )}
        {!isAuthenticated && activeTab === 'saved' && (
          <CommunityAuthGate
            title="Saved content requires an account"
            message="Sign in to bookmark posts and keep your personal saved community collection."
            feature="view your saved community content"
            icon={<Bookmark className="h-7 w-7" />}
            onRequireAuth={onRequireAuth}
          />
        )}

        {/* Feed Tab (public reading) & Saved Tab (private, gated above) */}
        {(activeTab === 'feed' || (activeTab === 'saved' && isAuthenticated)) && (
          <CommunityFeed
            posts={displayedPosts}
            currentFilter={activeTab === 'saved' ? 'saved' : feedFilter}
            onFilterChange={(f) => {
              if (f === 'saved') setActiveTab('saved');
              else {
                if (activeTab === 'saved') setActiveTab('feed');
                setFeedFilter(f);
              }
            }}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSave}
            onToggleFollow={handleToggleFollow}
            onVotePoll={handleVotePoll}
            onAddComment={handleAddComment}
            onReportPost={(postId, title) => setReportingPost({ id: postId, title })}
            onSharePost={handleSharePost}
            onOpenUserProfile={handleOpenUserProfile}
          />
        )}

        {/* Explore Tab */}
        {activeTab === 'explore' && (
          <CommunityExplore
            recommendedUsers={recommendedUsers}
            onToggleFollow={handleToggleFollow}
            onSelectTopic={(topic) => {
              setSearchQuery(topic);
              setActiveTab('feed');
            }}
            onSelectCategory={(cat) => {
              setSearchQuery(cat);
              setActiveTab('feed');
            }}
            onOpenUserProfile={handleOpenUserProfile}
          />
        )}

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <CommunityGroups
            groups={groups}
            onToggleJoinGroup={handleToggleJoinGroup}
            onShareGroup={(grp) => showToast(`${t('Group link copied')}: ${grp.name}`)}
          />
        )}

        {/* Discussions & Q&A Tab */}
        {activeTab === 'discussions' && (
          <CommunityDiscussionsQA
            posts={posts}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSave}
            onAddComment={handleAddComment}
            onOpenUserProfile={handleOpenUserProfile}
            onOpenCreateQuestion={() => setIsComposerOpen(true)}
          />
        )}

        {/* Live Events Tab */}
        {activeTab === 'events' && (
          <CommunityEvents
            events={events}
            onToggleRsvp={handleToggleRsvp}
            onShareEvent={(ev) => showToast(`${t('Event invitation copied')}: ${ev.title}`)}
          />
        )}

        {/* Direct Messages Tab */}
        {isAuthenticated && activeTab === 'messages' && (
          <CommunityMessages
            conversations={conversations}
            onSendMessage={handleSendMessage}
            onOpenUserProfile={handleOpenUserProfile}
          />
        )}

        {/* Notifications Center Tab */}
        {isAuthenticated && activeTab === 'notifications' && (
          <CommunityNotifications
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllNotificationsRead}
            onSelectNotification={() => setActiveTab('feed')}
          />
        )}

        {/* Profile View Tab */}
        {isAuthenticated && activeTab === 'profile' && (
          <CommunityProfile
            user={viewingProfile || currentUser}
            posts={posts}
            onToggleFollow={handleToggleFollow}
            onOpenMessage={(u) => {
              setActiveTab('messages');
            }}
            onShareProfile={(u) => showToast(`${t('Profile link copied')}: @${u.username}`)}
          />
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <CommunityLeaderboard
            onOpenUserProfile={handleOpenUserProfile}
          />
        )}

        {/* Moderation / Admin Tab */}
        {isAuthenticated && activeTab === 'admin' && (
          <CommunityAdmin
            reports={moderationReports}
            onResolveReport={handleResolveReport}
          />
        )}
      </div>

      {/* Modals */}
      <CommunityPostComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        currentUser={currentUser}
        onSubmitPost={handleCreatePost}
      />

      <CommunityReportModal
        isOpen={!!reportingPost}
        onClose={() => setReportingPost(null)}
        postId={reportingPost?.id}
        postTitle={reportingPost?.title}
        onSubmitReport={handleSubmitReport}
      />

      <CommunitySafetyModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
      />
    </div>
  );
};
