import { CommunityPostType } from '../../types';

export type CommunityTab = 
  | 'feed' 
  | 'explore' 
  | 'groups' 
  | 'discussions' 
  | 'events' 
  | 'messages' 
  | 'notifications' 
  | 'profile' 
  | 'leaderboard'
  | 'admin'
  | 'saved';

export type FeedFilter = 'foryou' | 'following' | 'latest' | 'trending' | 'discussed' | 'saved';

export type UserRoleType = 'member' | 'verified_doctor' | 'health_educator' | 'moderator' | 'admin' | 'caregiver';

export interface CommunityUserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  coverImage: string;
  role: UserRoleType;
  roleLabel: string;
  isVerified: boolean;
  specialty?: string;
  bio: string;
  location: string;
  joinedDate: string;
  reputationPoints: number;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  badges: {
    id: string;
    name: string;
    icon: string;
    description: string;
  }[];
  interests: string[];
}

export interface PostAttachment {
  type: 'image' | 'video' | 'document' | 'link';
  url: string;
  title?: string;
  previewUrl?: string;
  fileSize?: string;
}

export interface CommunityComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRoleType;
  authorSpecialty?: string;
  isVerified?: boolean;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  isBestAnswer?: boolean;
  replies?: CommunityComment[];
}

export interface CommunityPostItem {
  id: string;
  author: CommunityUserProfile;
  postType: CommunityPostType | 'announcement' | 'achievement' | 'event' | 'document' | 'video';
  title?: string;
  content: string;
  category: string;
  tags: string[];
  attachments?: PostAttachment[];
  poll?: {
    question: string;
    options: { id: string; text: string; votes: number }[];
    totalVotes: number;
    userVotedOptionId?: string;
    endsIn?: string;
  };
  eventDetails?: {
    date: string;
    time: string;
    location: string;
    attendeesCount: number;
    isAttending?: boolean;
  };
  achievementDetails?: {
    badgeName: string;
    icon: string;
    milestone: string;
  };
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowed?: boolean;
  isPinned?: boolean;
  visibility: 'everyone' | 'members' | 'followers' | 'private';
  timestamp: string;
  comments: CommunityComment[];
}

export interface CommunityGroup {
  id: string;
  name: string;
  handle: string;
  category: string;
  description: string;
  coverImage: string;
  icon: string;
  memberCount: number;
  postsCount: number;
  privacy: 'public' | 'private' | 'invite_only';
  activityLevel: 'Very Active' | 'Active' | 'Moderate';
  isJoined?: boolean;
  rules: string[];
  moderators: { name: string; avatar: string; role: string }[];
  recentTopics: string[];
}

export interface CommunityEvent {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  hostSpecialty: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  type: 'Online Webinar' | 'Live Q&A' | 'Workshop' | 'Peer Circle';
  description: string;
  coverImage: string;
  attendeesCount: number;
  rsvpStatus: 'going' | 'interested' | 'none';
  linkUrl?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachment?: { type: 'image' | 'file'; name: string; url: string };
}

export interface Conversation {
  id: string;
  participant: CommunityUserProfile;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: DirectMessage[];
}

export interface CommunityNotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'group' | 'system' | 'event';
  actorName: string;
  actorAvatar: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  targetId?: string;
}

export interface ModerationReportItem {
  id: string;
  reportedPostId?: string;
  reportedUser: string;
  reporter: string;
  reason: string;
  details: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  contentSnippet: string;
}
