// Conversation persistence client for the GlobalHealth AI Assistant.
//
// BACKEND CONTRACT (documented in docs/ai-assistant-backend-contract.md):
//   - The server identifies the user from its own secure session (Bearer
//     token). The client NEVER sends a userId.
//   - Every persistent request validates `authenticatedUser.id ===
//     conversation.userId` before reading or mutating anything.
//   - Anonymous conversations are session-only (React state) and are never
//     sent to these endpoints unless the user explicitly chooses to save the
//     conversation to their account after signing in.
import { apiFetch, AuthError } from '../../services/authClient';
import type { AIConversation, AIConversationSummary, AIMessage, AIHistoryFilter } from './types';

export interface CreateConversationInput {
  title?: string;
  /** Explicit opt-in payload: when a guest logs in and chooses
   * "Save this conversation to my account", these session-only messages are
   * copied to a new owned conversation. */
  messages?: AIMessage[];
}

/** Wrapper so callers can distinguish expected failures (network/401) from bugs. */
export class AIConversationError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

function toError(err: unknown): AIConversationError {
  if (err instanceof AuthError) {
    if (err.code === 'AUTH_REQUIRED' || err.code === 'SESSION_EXPIRED') return new AIConversationError(err.message, 'AUTH_REQUIRED');
    return new AIConversationError(err.message, err.code);
  }
  if (err instanceof AIConversationError) return err;
  return new AIConversationError('Network connection failed. Please check your connection and try again.', 'NETWORK_ERROR');
}

export async function listConversations(filter: AIHistoryFilter = 'recent', q = ''): Promise<AIConversationSummary[]> {
  try {
    const params = new URLSearchParams({ filter, q });
    const data = await apiFetch<{ success: boolean; conversations: AIConversationSummary[] }>(`/api/ai/conversations?${params.toString()}`);
    return data.conversations || [];
  } catch (err) {
    throw toError(err);
  }
}

export async function createConversation(input: CreateConversationInput = {}): Promise<AIConversation> {
  try {
    const data = await apiFetch<{ success: boolean; conversation: AIConversation }>('/api/ai/conversations', {
      method: 'POST',
      body: { title: input.title, messages: input.messages },
    });
    return data.conversation;
  } catch (err) {
    throw toError(err);
  }
}

export async function getConversation(id: string): Promise<AIConversation> {
  try {
    const data = await apiFetch<{ success: boolean; conversation: AIConversation }>(`/api/ai/conversations/${encodeURIComponent(id)}`);
    return data.conversation;
  } catch (err) {
    throw toError(err);
  }
}

export async function renameConversation(id: string, title: string): Promise<AIConversationSummary> {
  try {
    const data = await apiFetch<{ success: boolean; conversation: AIConversationSummary }>(`/api/ai/conversations/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: { title },
    });
    return data.conversation;
  } catch (err) {
    throw toError(err);
  }
}

export async function setConversationSaved(id: string, isSaved: boolean): Promise<AIConversationSummary> {
  try {
    const data = await apiFetch<{ success: boolean; conversation: AIConversationSummary }>(`/api/ai/conversations/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: { isSaved },
    });
    return data.conversation;
  } catch (err) {
    throw toError(err);
  }
}

export async function setConversationArchived(id: string, archived: boolean): Promise<AIConversationSummary> {
  try {
    const data = await apiFetch<{ success: boolean; conversation: AIConversationSummary }>(`/api/ai/conversations/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: { archive: archived },
    });
    return data.conversation;
  } catch (err) {
    throw toError(err);
  }
}

export async function restoreConversation(id: string): Promise<AIConversationSummary> {
  try {
    const data = await apiFetch<{ success: boolean; conversation: AIConversationSummary }>(`/api/ai/conversations/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: { restore: true },
    });
    return data.conversation;
  } catch (err) {
    throw toError(err);
  }
}

export async function deleteConversation(id: string): Promise<void> {
  try {
    await apiFetch<{ success: boolean }>(`/api/ai/conversations/${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch (err) {
    throw toError(err);
  }
}

export async function permanentlyDeleteConversation(id: string): Promise<void> {
  try {
    await apiFetch<{ success: boolean }>(`/api/ai/conversations/${encodeURIComponent(id)}/permanent`, { method: 'DELETE' });
  } catch (err) {
    throw toError(err);
  }
}

export async function deleteAllConversations(): Promise<void> {
  try {
    await apiFetch<{ success: boolean }>('/api/ai/conversations', { method: 'DELETE' });
  } catch (err) {
    throw toError(err);
  }
}

export async function appendMessage(conversationId: string, message: AIMessage): Promise<AIMessage> {
  try {
    const data = await apiFetch<{ success: boolean; message: AIMessage; deduplicated?: boolean }>(
      `/api/ai/conversations/${encodeURIComponent(conversationId)}/messages`,
      {
        method: 'POST',
        body: {
          role: message.role,
          content: message.content,
          // Idempotency key: the server returns an existing message if this
          // client message was already stored (retry / double-tap / another tab).
          clientMessageId: message.id,
        },
      }
    );
    return data.message;
  } catch (err) {
    throw toError(err);
  }
}

export type AIExportFormat = 'text' | 'json';
/** UI export choices. `pdf` uses a print-ready browser view from the text
 * export and lets the user save/print it as PDF. */
export type AIChatExportAction = AIExportFormat | 'pdf';

export interface AIExportResult {
  format: AIExportFormat;
  filename: string;
  contentType: string;
  content: string;
}

export async function exportConversation(id: string, format: AIExportFormat = 'text'): Promise<AIExportResult> {
  try {
    return await apiFetch<AIExportResult>(`/api/ai/conversations/${encodeURIComponent(id)}/export?format=${format}`);
  } catch (err) {
    throw toError(err);
  }
}

export interface AIShareLink {
  token: string;
  shareId: string;
  url: string;
  expiresAt: number | null;
}

export async function createConversationShare(id: string): Promise<AIShareLink> {
  try {
    return await apiFetch<AIShareLink>(`/api/ai/conversations/${encodeURIComponent(id)}/share`, { method: 'POST' });
  } catch (err) {
    throw toError(err);
  }
}

export async function revokeConversationShare(token: string): Promise<void> {
  try {
    await apiFetch<{ success: boolean }>(`/api/ai/conversations/shared/${encodeURIComponent(token)}`, { method: 'DELETE' });
  } catch (err) {
    throw toError(err);
  }
}

/** Downloads an exported chat to the local device using the server-produced
 * file content. The server never leaks private content to a browser that is
 * not the conversation owner. */
export function downloadChatExport(result: AIExportResult): void {
  const blob = new Blob([result.content], { type: result.contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = result.filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2500);
}

/** Opens a print-ready view of the user's own chat so they can save it as PDF
 * from the browser print dialog. Content is kept local to this tab. */
export function openChatPdf(result: AIExportResult): void {
  const safe = result.content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');
  const win = window.open('', '_blank', 'noopener,noreferrer');
  if (!win) return;
  win.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>${result.filename}</title><style>
    body{font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#17212b;margin:32px;line-height:1.5}
    h1{font-size:20px} .meta{color:#5f6b76;font-size:12px;margin-bottom:20px}
    .msg{margin-bottom:16px;white-space:normal} .you{font-weight:700;color:#123b5d}
    @media print{body{margin:12mm}}</style></head><body>`);
  win.document.write(`<h1>${result.filename}</h1><div class="meta">GlobalHealth AI conversation export</div>`);
  win.document.write(`<div class="msg">${safe}</div>`);
  win.document.write('</body></html>');
  win.document.close();
  win.focus();
  window.setTimeout(() => win.print(), 350);
}

export interface AssistantRequestContext {
  displayName?: string;
  mrn?: string;
  authenticated: boolean;
  /** Client-computed transparency/intent/answer-mode guidance. The server
   * treats this as non-authoritative enhancement, not as a privileged claim. */
  systemContext?: string;
  /** Compact recent conversation history (role: content) used to resolve
   * references ("the second one"), maintain topic continuity, and avoid
   * repeating prior answers. Bounded and sanitized server-side. */
  conversationHistory?: string;
}

/** Calls the Gemini-backed assistant endpoint with the signed-in caller's own
 * basic identity only (never any other account or the demo patient's data). */
export async function requestAssistantResponse(
  prompt: string,
  language: string,
  userContext: AssistantRequestContext,
  signal?: AbortSignal
): Promise<string> {
  const controller = new AbortController();
  let timedOut = false;
  const timeout = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 45000);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);
  try {
    const res = await fetch('/api/ai-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, language, userContext }),
      signal: controller.signal,
    });
    if (!res.ok) {
      // The server reports a clean JSON error (e.g. missing API key). The
      // user-facing copy is always friendly — never a raw server error.
      let body: { error?: unknown } = {};
      try {
        body = await res.json();
      } catch {
        /* non-JSON error body */
      }
      const serverMsg = typeof body?.error === 'string' ? body.error : '';
      if ((body as any)?.code === 'RATE_LIMITED') {
        throw new AIConversationError(serverMsg || 'The AI assistant is busy. Please wait a moment and try again.', 'AI_RATE_LIMITED');
      }
      const message = serverMsg && serverMsg.includes('GEMINI_API_KEY')
        ? 'The AI service is not configured on this server yet. Please try again later.'
        : 'The AI service is temporarily unavailable. Please try again shortly.';
      throw new AIConversationError(message, 'AI_UNAVAILABLE');
    }
    const data = await res.json();
    const text = typeof data?.response === 'string' && data.response.trim() ? data.response : null;
    if (!text) throw new AIConversationError('The AI service returned an empty response. Please try again.', 'AI_EMPTY');
    return text;
  } catch (err) {
    if (timedOut) {
      throw new AIConversationError('The AI service took too long to respond. Please try again.', 'AI_TIMEOUT');
    }
    if (controller.signal.aborted || signal?.aborted) {
      throw new AIConversationError('Response stopped.', 'AI_STOPPED');
    }
    if (err instanceof AIConversationError) throw err;
    throw new AIConversationError('Network connection failed. Please check your connection and try again.', 'NETWORK_ERROR');
  } finally {
    window.clearTimeout(timeout);
    signal?.removeEventListener('abort', onAbort);
  }
}

export { AuthError };
