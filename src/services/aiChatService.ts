// Central GlobalHealth AI chat service.
//
// Every AI-conversation operation in the app goes through THIS module (or the
// functions re-exported from it). It is the single client-side chat service so
// the AI workspace, history sidebar, share/export actions, and any future chat
// surface all behave identically and never fork their own half-working copies.
//
// The service is intentionally thin: auth is the shared `AuthContext` /
// `authClient` session, and every operation calls the server where the user id
// is ALWAYS derived from the authenticated session (never from the browser).

import {
  appendMessage,
  createConversation,
  createConversationShare,
  deleteAllConversations,
  deleteConversation,
  downloadChatExport,
  exportConversation,
  getConversation,
  listConversations,
  openChatPdf,
  permanentlyDeleteConversation,
  renameConversation,
  requestAssistantResponse,
  restoreConversation,
  revokeConversationShare,
  setConversationArchived,
  setConversationSaved,
  type AIChatExportAction,
  type AIExportFormat,
  type AIExportResult,
  type AIShareLink,
  type AssistantRequestContext,
  type CreateConversationInput,
} from '../components/ai/aiApi';

export type {
  AIChatExportAction,
  AIExportFormat,
  AIExportResult,
  AIShareLink,
  AssistantRequestContext,
  CreateConversationInput,
};

export const aiChat = {
  appendMessage,
  createConversation,
  createConversationShare,
  deleteAllConversations,
  deleteConversation,
  downloadChatExport,
  exportConversation,
  getConversation,
  listConversations,
  openChatPdf,
  permanentlyDeleteConversation,
  renameConversation,
  requestAssistantResponse,
  restoreConversation,
  revokeConversationShare,
  setConversationArchived,
  setConversationSaved,
};

/** Creates a stable per-message idempotency key. The same physical user
 * message keeps the same key across a retry so the server never stores a
 * duplicate. */
export function createAiMessageId(role: 'user' | 'assistant', prefix = 'ai-msg'): string {
  return `${role.startsWith('user') ? 'usr' : 'bot'}-${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

export default aiChat;
