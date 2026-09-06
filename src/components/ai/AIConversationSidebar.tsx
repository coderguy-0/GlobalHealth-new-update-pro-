import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  Lock,
  MessageSquareText,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCircle2,
  X,
  Star,
  Archive,
  RotateCcw,
  LayoutList,
  Trash,
  FileText,
  FileJson,
  Printer,
  Share2,
  Link2,
} from 'lucide-react';
import type { AIConversationSummary, AIHistoryGroupKey, AIHistoryFilter } from './types';
import { AI_HISTORY_GROUP_LABELS } from './types';
import type { AIChatExportAction } from './aiApi';
import { AIErrorState, type AIErrorKind } from './AIErrorState';

interface AIConversationSidebarProps {
  signedIn: boolean;
  user?: { fullName: string; mrn?: string } | null;
  conversations: AIConversationSummary[];
  activeId: string | null;
  loading?: boolean;
  historyError?: { kind: AIErrorKind; message: string } | null;
  filter?: AIHistoryFilter;
  onFilterChange?: (filter: AIHistoryFilter) => void;
  onRetryHistory?: () => void;
  onSignIn?: () => void;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onRename: (id: string, title: string) => void;
  onToggleSave: (id: string) => void;
  onToggleArchive: (id: string, archived?: boolean) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onDeleteAll: () => void;
  onSaveSession: () => void;
  onExportChat?: (format: AIChatExportAction) => void;
  onShareChat?: () => void;
  shareUrl?: string | null;
  onRevokeShare?: () => void;
}

function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function groupKey(ts: number): AIHistoryGroupKey {
  const now = new Date();
  const today = dayKey(now.getTime());
  const yesterday = dayKey(now.getTime() - 86400000);
  const k = dayKey(ts);
  if (k === today) return 'today';
  if (k === yesterday) return 'yesterday';
  return 'previous';
}

function formatWhen(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  if (dayKey(ts) === dayKey(now.getTime())) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

/** Identity + "My AI Conversations" sidebar with search/rename/delete. */
export const AIConversationSidebar: React.FC<AIConversationSidebarProps> = ({
  signedIn,
  user,
  conversations,
  activeId,
  loading,
  historyError,
  filter = 'recent',
  onFilterChange,
  onRetryHistory,
  onSignIn,
  onSelect,
  onNewChat,
  onRename,
  onToggleSave,
  onToggleArchive,
  onRestore,
  onDelete,
  onPermanentDelete,
  onDeleteAll,
  onSaveSession,
  onExportChat,
  onShareChat,
  shareUrl,
  onRevokeShare,
}) => {
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [armedDelete, setArmedDelete] = useState<string | null>(null);
  const [armedDeleteAll, setArmedDeleteAll] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (editingId) editRef.current?.select();
  }, [editingId]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const arm = (id: string | null, all = false) => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    if (all) {
      setArmedDeleteAll(true);
      timers.current.push(window.setTimeout(() => setArmedDeleteAll(false), 3500));
    } else {
      setArmedDelete(id);
      if (id) timers.current.push(window.setTimeout(() => setArmedDelete(null), 3500));
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => c.title.toLowerCase().includes(q));
  }, [conversations, query]);

  const grouped = useMemo(() => {
    const g: Record<AIHistoryGroupKey, AIConversationSummary[]> = { today: [], yesterday: [], previous: [] };
    for (const c of filtered) g[groupKey(c.updatedAt)].push(c);
    return g;
  }, [filtered]);

  const visibleGroups = (['today', 'yesterday', 'previous'] as AIHistoryGroupKey[]).filter((k) => grouped[k].length > 0);

  const commitRename = (id: string) => {
    const next = draft.trim();
    if (next) onRename(id, next);
    setEditingId(null);
  };

  return (
    <aside className="flex h-full w-full flex-col bg-white" aria-label="My AI Conversations">
      {/* Identity / profile card */}
      <div className="border-b border-slate-100 p-4">
        {signedIn && user ? (
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-medical-50 text-medical-600">
              <UserCircle2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">{user.fullName}</p>
              <p className="truncate text-[11px] text-slate-500">
                {user.mrn ? `Linked record ${user.mrn}` : 'Signed in'}
                <span className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" /> Saved to account
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm font-bold text-slate-900">Chatting as a guest</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              Your conversation stays in this session only and is never stored. Sign in to keep your AI conversations
              across devices.
            </p>
            <div className="mt-3 grid gap-2">
              <button
                type="button"
                onClick={onSignIn}
                className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={onSaveSession}
                disabled={loading}
                className="rounded-xl bg-medical-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-medical-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-600 focus-visible:ring-offset-2 disabled:opacity-50"
              >
                Save this conversation to my account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New chat */}
      <div className="p-3">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-medical-200 bg-medical-50 px-3 py-2.5 text-sm font-bold text-medical-700 transition hover:bg-medical-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> New Chat
        </button>
      </div>

      {signedIn && activeId && (
        <div className="px-3 pb-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onExportChat?.('text')}
              disabled={!onExportChat}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-2 py-2 text-[11px] font-bold text-slate-600 transition hover:border-medical-200 hover:bg-medical-50 hover:text-medical-700 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" /> TXT
            </button>
            <button
              type="button"
              onClick={onShareChat}
              disabled={!onShareChat}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-2 py-2 text-[11px] font-bold text-slate-600 transition hover:border-medical-200 hover:bg-medical-50 hover:text-medical-700 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
            >
              <Share2 className="h-3.5 w-3.5" aria-hidden="true" /> Share
            </button>
            <button
              type="button"
              onClick={() => onExportChat?.('json')}
              disabled={!onExportChat}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-2 py-2 text-[11px] font-bold text-slate-600 transition hover:border-medical-200 hover:bg-medical-50 hover:text-medical-700 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
            >
              <FileJson className="h-3.5 w-3.5" aria-hidden="true" /> JSON
            </button>
            <button
              type="button"
              onClick={() => onExportChat?.('pdf')}
              disabled={!onExportChat}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-2 py-2 text-[11px] font-bold text-slate-600 transition hover:border-medical-200 hover:bg-medical-50 hover:text-medical-700 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" /> PDF
            </button>
          </div>
          {shareUrl && (
            <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
              <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                <Link2 className="h-3 w-3" aria-hidden="true" /> Revocable share link
              </div>
              <input
                readOnly
                value={shareUrl}
                onFocus={(e) => e.currentTarget.select()}
                aria-label="Shared conversation link"
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] text-slate-700 focus:outline-none"
              />
              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(shareUrl);
                      setCopiedShare(true);
                      window.setTimeout(() => setCopiedShare(false), 1800);
                    } catch {
                      /* clipboard unavailable; URL is selectable in the input */
                    }
                  }}
                  className="rounded-lg bg-medical-600 px-2 py-1.5 text-[10px] font-bold text-white transition hover:bg-medical-700"
                >
                  {copiedShare ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={onRevokeShare}
                  className="rounded-lg border border-rose-200 px-2 py-1.5 text-[10px] font-bold text-rose-600 transition hover:bg-rose-50"
                >
                  Revoke
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {signedIn && (
        <>
          {/* Search */}
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search conversations…"
                aria-label="Search AI conversations"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8.5 pr-3 text-xs text-slate-800 transition placeholder:text-slate-400 focus:border-medical-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-500/30"
              />
            </div>
          </div>

          {/* History filters */}
          <div className="grid grid-cols-4 gap-1 px-3 pb-2" role="tablist" aria-label="Conversation filters">
            {(
              [
                { id: 'recent', label: 'Recent', icon: LayoutList },
                { id: 'saved', label: 'Saved', icon: Star },
                { id: 'archived', label: 'Archive', icon: Archive },
                { id: 'trash', label: 'Trash', icon: Trash },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => onFilterChange?.(f.id)}
                className={`flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[9px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500 ${
                  filter === f.id ? 'bg-medical-50 text-medical-700 ring-1 ring-medical-200' : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <f.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {f.label}
              </button>
            ))}
          </div>

          {/* History list */}
          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
            <h3 className="px-1 pb-1.5 pt-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {filter === 'saved' ? 'Saved Conversations' : filter === 'archived' ? 'Archived Conversations' : filter === 'trash' ? 'Trash' : 'My AI Conversations'}
            </h3>

            {historyError ? (
              <AIErrorState kind={historyError.kind} compact message={historyError.message} onRetry={onRetryHistory} onSignIn={onSignIn} />
            ) : loading && conversations.length === 0 ? (
              <div className="space-y-2 px-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
                ))}
              </div>
            ) : visibleGroups.length === 0 ? (
              <p className="px-1 py-6 text-center text-xs leading-relaxed text-slate-400">
                {query
                  ? 'No conversations match your search.'
                  : filter === 'saved'
                  ? 'No saved conversations yet. Open a recent chat and tap the star to save it.'
                  : filter === 'archived'
                  ? 'No archived conversations.'
                  : filter === 'trash'
                  ? 'No deleted conversations.'
                  : 'No conversations yet. Start a new chat and it will be saved to your account automatically.'}
              </p>
            ) : (
              visibleGroups.map((g) => (
                <div key={g} className="mb-3">
                  <p className="px-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {AI_HISTORY_GROUP_LABELS[g]}
                  </p>
                  <ul className="space-y-1">
                    {grouped[g].map((c) => {
                      const active = c.id === activeId;
                      const editing = editingId === c.id;
                      const armed = armedDelete === c.id;
                      return (
                        <li key={c.id}>
                          {editing ? (
                            <div className="flex items-center gap-1 rounded-xl border border-medical-300 bg-white p-1.5">
                              <input
                                ref={editRef}
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') commitRename(c.id);
                                  if (e.key === 'Escape') setEditingId(null);
                                }}
                                maxLength={60}
                                aria-label="Conversation title"
                                className="min-w-0 flex-1 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => commitRename(c.id)}
                                aria-label="Save title"
                                className="grid h-7 w-7 place-items-center rounded-lg bg-medical-600 text-white transition hover:bg-medical-700"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                aria-label="Cancel rename"
                                className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div
                              className={`group flex items-center gap-2 rounded-xl px-2.5 py-2 transition ${
                                active ? 'bg-medical-50 ring-1 ring-medical-200' : 'hover:bg-slate-50'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => onSelect(c.id)}
                                className="flex min-w-0 flex-1 items-start gap-2 text-left focus-visible:outline-none"
                                aria-current={active ? 'true' : undefined}
                              >
                                <MessageSquareText className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${active ? 'text-medical-600' : 'text-slate-400'}`} aria-hidden="true" />
                                <span className="min-w-0">
                                  <span className={`block truncate text-xs font-semibold ${active ? 'text-medical-800' : 'text-slate-700'}`}>
                                    {c.title}
                                  </span>
                                  <span className="block text-[10px] text-slate-400">
                                    {c.messageCount} message{c.messageCount === 1 ? '' : 's'} · {formatWhen(c.updatedAt)}
                                  </span>
                                </span>
                              </button>

                              <span className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                                {filter !== 'trash' && (
                                  <button
                                    type="button"
                                    onClick={() => onToggleSave(c.id)}
                                    aria-label={c.isSaved ? `Unsave conversation: ${c.title}` : `Save conversation: ${c.title}`}
                                    title={c.isSaved ? 'Unsave' : 'Save'}
                                    className={`grid h-8 w-8 place-items-center rounded-lg transition ${c.isSaved ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-400 hover:bg-amber-50 hover:text-amber-500'}`}
                                  >
                                    <Star className={`h-3.5 w-3.5 ${c.isSaved ? 'fill-current' : ''}`} />
                                  </button>
                                )}
                                {filter !== 'trash' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingId(c.id);
                                      setDraft(c.title);
                                    }}
                                    aria-label={`Rename conversation: ${c.title}`}
                                    className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                )}
                                {filter !== 'trash' && (
                                  <button
                                    type="button"
                                    onClick={() => onToggleArchive(c.id, !c.isArchived)}
                                    aria-label={c.isArchived ? `Restore conversation from archive: ${c.title}` : `Archive conversation: ${c.title}`}
                                    title={c.isArchived ? 'Restore from archive' : 'Archive'}
                                    className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                  >
                                    <Archive className="h-3.5 w-3.5" />
                                  </button>
                                )}
                                {filter === 'trash' ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => onRestore(c.id)}
                                      aria-label={`Restore conversation: ${c.title}`}
                                      title="Restore"
                                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                                    >
                                      <RotateCcw className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => onPermanentDelete(c.id)}
                                      aria-label={`Permanently delete conversation: ${c.title}`}
                                      title="Permanently delete"
                                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => (armed ? onDelete(c.id) : arm(c.id))}
                                    aria-label={armed ? `Confirm delete: ${c.title}` : `Delete conversation: ${c.title}`}
                                    className={`grid h-8 w-8 place-items-center rounded-lg transition ${
                                      armed ? 'bg-rose-600 text-white hover:bg-rose-700' : 'text-slate-400 hover:bg-rose-50 hover:text-rose-600'
                                    }`}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </span>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>

          {/* Delete All */}
          <div className="border-t border-slate-100 p-3">
            <button
              type="button"
              onClick={() => (armedDeleteAll ? onDeleteAll() : arm(null, true))}
              disabled={conversations.length === 0}
              className={`w-full rounded-xl px-3 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                armedDeleteAll
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50 disabled:opacity-40 disabled:hover:bg-transparent'
              }`}
            >
              {armedDeleteAll ? 'Confirm — delete all AI history?' : 'Delete All AI History'}
            </button>
          </div>
        </>
      )}

      {!signedIn && (
        <div className="mt-auto border-t border-slate-100 p-3">
          <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-slate-400">
            <Lock className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
            Guest chats are session-only and are never saved to any account.
          </p>
        </div>
      )}
    </aside>
  );
};
