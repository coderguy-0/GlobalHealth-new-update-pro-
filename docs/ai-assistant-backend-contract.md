# GlobalHealth AI Assistant — Backend Contract

This document defines the server-side ownership, storage, and API contract for
persistent AI Assistant conversations. The production backend (not part of
this frontend repository) implements this contract; `server.ts` in this repo
contains a reference implementation of the same endpoints for the demo engine.

---

## 1. Ownership model (non-negotiable)

- The user is **always identified by the server** from the validated session
  token (`Authorization: Bearer <token>` → `authenticatedUser`). The client
  **never sends a userId**, and any client-supplied id is ignored.
- **Every** persistent request validates `authenticatedUser.id ===
  conversation.userId` before reading, renaming, appending to, or deleting a
  conversation. Conversations that do not exist **or belong to another
  account** are answered with a uniform `404` so existence is never leaked.
- Anonymous (guest) conversations are **session-only** on the client (React
  state). They are never sent to these endpoints and are never account-linked
  unless the user explicitly chooses **"Save this conversation to my account"**
  after signing in — there is **no automatic merge** of guest chats.
- AI chat content is **never an EHR**. Nothing from a conversation is copied
  into the patient profile, medical history, doctor record, or any clinical
  store unless the user performs a separate, explicit action with its own
  privacy/security flow.

## 2. Data model

### `ai_conversations`
| column       | type        | notes                                    |
|--------------|-------------|------------------------------------------|
| `id`         | uuid/text   | PK                                        |
| `userId`     | uuid/text   | FK → accounts; owner of the conversation  |
| `title`      | text(80)    | auto-titled from the first user message   |
| `isSaved`    | boolean     | from the Saved & Starred list             |
| `archivedAt` | timestamptz | null unless archived                      |
| `deletedAt`  | timestamptz | null unless soft-deleted (Trash)          |
| `createdAt`  | timestamptz | server clock                              |
| `updatedAt`  | timestamptz | bumped on every append/rename             |

### `ai_messages`
| column            | type        | notes                                     |
|-------------------|-------------|-------------------------------------------|
| `id`              | uuid/text   | PK                                        |
| `conversationId`  | uuid/text   | FK → ai_conversations (cascade delete)    |
| `role`            | enum        | `'user' \| 'assistant'`                   |
| `content`         | text(10000) | message body                              |
| `clientMessageId` | text(100)   | idempotency key, unique per (conversation, role) |
| `createdAt`       | timestamptz | server clock                              |

Rules:
- Message `id` and `createdAt` are **assigned by the server**, never the client.
- `clientMessageId` is supplied by the client and used only for
  duplicate-message prevention. Re-sending the same key returns the stored
  message (`deduplicated: true`) instead of creating a second row.
- `content` must be a non-empty string ≤ 10,000 characters.
- All endpoints are `requireAuth`; responses carry
  `Cache-Control: no-store, no-cache, must-revalidate, private`.

## 3. Endpoints

All paths are under `/api/ai`. `:id` is a conversation id.

| Method & path                                             | Description                                        | Returns |
|-----------------------------------------------------------|----------------------------------------------------|---------|
| `GET /api/ai/conversations?filter=&q=`                    | List the caller's own summaries. `filter` = `recent`, `saved`, `archived`, `trash`; `q` searches title + message content. | `{ success, conversations: Summary[] }` |
| `POST /api/ai/conversations`                              | Create a conversation. Optional `title`; optional `messages[]` **only** for the explicit "save guest conversation to my account" flow (messages copied verbatim, preserving their client ids). | `201 { success, conversation }` |
| `GET /api/ai/conversations/:id`                           | Full conversation incl. messages (owner only)      | `{ success, conversation }` |
| `PUT /api/ai/conversations/:id`                           | Rename `{ title }`, save/unsave `{ isSaved }`, archive/restore `{ archive }` or restore from Trash `{ restore: true }`. | `{ success, conversation: Summary }` |
| `DELETE /api/ai/conversations/:id`                        | Soft-delete to Trash (owner only). Recover via `PUT` with `{ restore: true }`. | `{ success, deleted: true, softDeleted: true }` |
| `DELETE /api/ai/conversations/:id/permanent`              | Permanently delete a Trashed conversation.         | `{ success, deleted: true, permanent: true }` |
| `DELETE /api/ai/conversations`                            | Soft-delete **all** of the caller's conversations   | `{ success, deleted: true, count }` |
| `POST /api/ai/conversations/:id/messages`                 | Append `{ role, content, clientMessageId }`; auto-titles from first user message; idempotent on `clientMessageId`. | `201/200 { success, message, deduplicated }` |
| `GET /api/ai/conversations/:id/export?format=text\|json`  | Export the owner's own conversation (owner only).   | `{ success, format, filename, contentType, content }` |
| `POST /api/ai/conversations/:id/share`                    | Create a revocable read-only share link.            | `201 { success, token, shareId, url }` |
| `GET /api/ai/conversations/shared/:token`                 | Read the shared, non-revoked conversation.          | `{ success, title, messages, disclaimer }` |
| `DELETE /api/ai/conversations/shared/:token`              | Revoke a share link (owner only).                   | `{ success, revoked: true }` |

### Types

```ts
interface AiMessage {
  id: string;            // server-assigned
  role: 'user' | 'assistant';
  content: string;       // 1..10000 chars
  createdAt: number;     // epoch ms (server clock)
  clientMessageId?: string;
}

interface AiConversationSummary {
  id: string;
  title: string;
  messageCount: number;
  createdAt: number;
  updatedAt: number;
  isSaved: boolean;
  isArchived: boolean;
  isTrashed: boolean;
}

interface AiConversation extends AiConversationSummary {
  messages: AiMessage[];
}

type AiHistoryFilter = 'recent' | 'saved' | 'archived' | 'trash';
```

### Errors
| status | meaning                                   |
|--------|-------------------------------------------|
| `401`  | missing/expired session (`AUTH_REQUIRED` / `SESSION_EXPIRED`) |
| `403`  | authenticated but forbidden                |
| `400`  | invalid payload (bad role, empty/oversized content, bad title) |
| `404`  | conversation missing **or** owned by another account (uniform) |

## 4. AI generation endpoint

`POST /api/ai-assistant` (existing) generates assistant replies:

```json
{
  "prompt": "string",
  "language": "string",
  "userContext": { "displayName"?: "string", "mrn"?: "string", "authenticated": boolean }
}
```

- Only the **signed-in caller's own** basic identity is included. `displayName`
  and `mrn` are sanitized server-side (no line breaks/`<>{}`, bounded length)
  to prevent instruction injection. No other account's data is ever included.
- The system prompt enforces the safety rules: the assistant is an AI
  **information assistant**, never a doctor; no diagnosis; no
  start/stop/change-medication instructions; urgent symptoms → urgent-care
  guidance; no invented statistics; educational disclaimer always included.
- The frontend additionally screens every user message for urgent-symptom
  patterns and renders an emergency-care card so guidance is never delayed.

## 5. Frontend client

`src/components/ai/aiApi.ts` implements this contract on the client using the
shared authenticated `apiFetch` (attaches the session token, normalizes
401/session-expiry into a friendly `AuthError`).

`src/services/aiChatService.ts` is the **single central chat service** used by
the AI workspace, history sidebar, export/share actions, and any future chat
surface. New chat features must call that service — never fork a second
ad-hoc fetch.

## 6. Duplicate-message prevention

`POST /api/ai/conversations/:id/messages` accepts `clientMessageId`. If the
same conversation already has a message with that key and role, the server
returns the stored message with `deduplicated: true` (HTTP 200) instead of
creating another row. The frontend reuses the same idempotency key when a
failed send is retried, so a lost network response never duplicates a user
message.

## 7. Safety & transparency

The frontend runs the shared `core/ai` intelligence pipeline before every
answer: intent detection, language detection, urgency safety screening, and
answer-mode selection. Urgent symptoms bypass normal answers and are answered
by the Safety Engine first. Every AI reply is labelled as AI-generated and
requires professional review.

## 8. Acceptance test

`npm run accept:ai` runs the §78 one-account AI chat history acceptance test
against a live server. It creates/verifies/logs in two accounts and verifies
conversation creation, 5-message persistence, refresh restoration, saved
filtering, logout invalidation, and cross-account isolation.
