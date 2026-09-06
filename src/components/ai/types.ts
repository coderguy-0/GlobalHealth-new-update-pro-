// Shared types for the GlobalHealth AI Assistant workspace.

export type AIMessageRole = 'user' | 'assistant';

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  /** Epoch milliseconds. */
  createdAt: number;
  /** Optional provenance label, e.g. "Your personal EHR (MRN: GH-…)". */
  sourceContext?: string;
  /** True when this assistant turn failed and shows a Retry control. */
  failed?: boolean;
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: number;
  updatedAt: number;
  isSaved?: boolean;
  isArchived?: boolean;
  isTrashed?: boolean;
}

/** Lightweight list item used by the history sidebar. */
export interface AIConversationSummary {
  id: string;
  title: string;
  messageCount: number;
  createdAt: number;
  updatedAt: number;
  isSaved?: boolean;
  isArchived?: boolean;
  isTrashed?: boolean;
}

export type AIHistoryFilter = 'recent' | 'saved' | 'archived' | 'trash';

export type AIHistoryGroupKey = 'today' | 'yesterday' | 'previous';

export const AI_HISTORY_GROUP_LABELS: Record<AIHistoryGroupKey, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  previous: 'Previous',
};
