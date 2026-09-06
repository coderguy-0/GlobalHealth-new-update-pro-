import React, { useEffect, useRef } from 'react';
import { AIMessage as AIMessageView } from './AIMessage';
import { AILoadingState } from './AILoadingState';
import { AIErrorState } from './AIErrorState';
import { AIWelcome } from './AIWelcome';
import { detectUrgentSymptom } from './aiUtils';
import type { AIMessage as AIMessageType } from './types';

interface AIChatProps {
  messages: AIMessageType[];
  loading?: boolean;
  /** Index of the last assistant turn that failed (for Retry). */
  failedMessageId?: string | null;
  onRetryMessage?: () => void;
  onPrompt: (prompt: string) => void;
  onNavigate?: (tab: string) => void;
  signedIn: boolean;
  displayName: string;
  /** True while the history/sidebar is still loading (keeps welcome hidden). */
  initializing?: boolean;
  historyError?: { kind: 'network' | 'unavailable' | 'auth' | 'message'; message: string } | null;
  onRetryHistory?: () => void;
  onSignIn?: () => void;
  /** A whole send failed (e.g. persistence) — shown above the input. */
  sendError?: { kind: 'network' | 'unavailable' | 'auth' | 'message'; message: string } | null;
  onRetrySend?: () => void;
}

/** Scrollable conversation area: welcome screen or message thread. */
export const AIChat: React.FC<AIChatProps> = ({
  messages,
  loading,
  failedMessageId,
  onRetryMessage,
  onPrompt,
  onNavigate,
  signedIn,
  displayName,
  initializing,
  historyError,
  onRetryHistory,
  onSignIn,
  sendError,
  onRetrySend,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, loading]);

  // Pair each assistant message with the user prompt that produced it.
  // Urgency is derived deterministically from the user's wording so the
  // safety card also survives a conversation reload from the server.
  const pairs: { msg: AIMessageType; prompt?: string; urgent?: boolean }[] = [];
  messages.forEach((m, idx) => {
    if (m.role === 'assistant') {
      // Find the most recent user message before this one.
      let prompt: string | undefined;
      let urgent = false;
      for (let j = idx - 1; j >= 0; j -= 1) {
        const prev = messages[j];
        if (prev.role === 'user') {
          prompt = prev.content;
          urgent = detectUrgentSymptom(prev.content);
          break;
        }
      }
      pairs.push({ msg: m, prompt, urgent });
    } else {
      pairs.push({ msg: m });
    }
  });

  const empty = messages.length === 0;

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-50/80" role="log" aria-live="polite" aria-label="AI conversation">
      <div className="flex-1">
        {empty ? (
          initializing ? (
            <div className="flex h-full items-center justify-center px-6 py-16 text-sm text-slate-400">Loading your conversations…</div>
          ) : (
            <AIWelcome onPrompt={onPrompt} signedIn={signedIn} displayName={displayName} />
          )
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-4 px-3 py-5 sm:px-4">
            {historyError && (
              <AIErrorState kind={historyError.kind} message={historyError.message} onRetry={onRetryHistory} onSignIn={onSignIn} />
            )}
            {pairs.map(({ msg, prompt, urgent }) => (
              <AIMessageView
                key={msg.id}
                message={msg}
                userPrompt={prompt}
                urgent={urgent}
                onNavigate={onNavigate}
                footer={
                  failedMessageId === msg.id ? (
                    <div className="flex items-center gap-2">
                      <AIErrorState
                        kind="message"
                        compact
                        message="The AI reply could not be generated."
                        onRetry={onRetryMessage}
                      />
                    </div>
                  ) : undefined
                }
              />
            ))}
            {loading && <AILoadingState />}
            {sendError && (
              <AIErrorState kind={sendError.kind} compact message={sendError.message} onRetry={onRetrySend} />
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
};
