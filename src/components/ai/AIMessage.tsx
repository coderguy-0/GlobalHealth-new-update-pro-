import React from 'react';
import { ArrowRight, CheckCircle2, Siren } from 'lucide-react';
import { AIAvatar } from './AIAvatar';
import type { AIMessage as AIMessageType } from './types';
import { suggestActionCards, type AIActionCard, URGENT_CARE_NOTE } from './aiUtils';

/* --------------------------------------------------------------------------
 * Safe markdown-lite renderer — builds React nodes only (no innerHTML).
 * Supports: ## / ### headings, **bold**, - bullets, numbered lists,
 * > callouts, --- rules and paragraphs.
 * ------------------------------------------------------------------------ */

interface InlinePart {
  text: string;
  bold?: boolean;
}

function splitInline(raw: string): InlinePart[] {
  const parts = raw.split(/(\*\*[^*]+\*\*)/g);
  const out: InlinePart[] = [];
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      out.push({ text: part.slice(2, -2), bold: true });
    } else {
      out.push({ text: part });
    }
  }
  return out;
}

function renderInlineNodes(raw: string, keyBase: string): React.ReactNode[] {
  return splitInline(raw).map((part, i) =>
    part.bold ? (
      <strong key={`${keyBase}-b${i}`} className="font-bold text-slate-900">
        {part.text}
      </strong>
    ) : (
      <React.Fragment key={`${keyBase}-t${i}`}>{part.text}</React.Fragment>
    )
  );
}

function renderBlocks(lines: string[]): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let blockKey = 0;

  const flushBullets = (start: number, end: number, ordered: boolean) => {
    const items = lines.slice(start, end).map((line, idx) => (
      <li key={`li-${start}-${idx}`} className="my-1 leading-relaxed">
        {renderInlineNodes(ordered ? line.replace(/^\d+[.)]\s*/, '') : line.replace(/^[-•]\s*/, ''), `li-${start}-${idx}`)}
      </li>
    ));
    nodes.push(ordered ? <ol key={`ol-${blockKey++}`} className="list-decimal pl-5">{items}</ol> : <ul key={`ul-${blockKey++}`} className="list-disc pl-5">{items}</ul>);
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    // Heading
    const heading = /^(#{2,3})\s+(.*)$/.exec(trimmed);
    if (heading) {
      const level = heading[1].length === 2 ? 'h3' : 'h4';
      nodes.push(
        level === 'h3' ? (
          <h3 key={`h-${blockKey++}`} className="mb-1.5 mt-4 text-[15px] font-extrabold text-slate-900 first:mt-0">
            {renderInlineNodes(heading[2], `h3-${blockKey}`)}
          </h3>
        ) : (
          <h4 key={`h-${blockKey++}`} className="mb-1 mt-3 text-[13px] font-bold text-slate-800 first:mt-0">
            {renderInlineNodes(heading[2], `h4-${blockKey}`)}
          </h4>
        )
      );
      i += 1;
      continue;
    }

    // Callout
    if (trimmed.startsWith('>')) {
      nodes.push(
        <blockquote key={`q-${blockKey++}`} className="my-2 rounded-r-xl border-l-4 border-medical-300 bg-medical-50 px-3 py-2 text-[13px] leading-relaxed text-medical-900">
          {renderInlineNodes(trimmed.replace(/^>\s?/, ''), `q-${blockKey}`)}
        </blockquote>
      );
      i += 1;
      continue;
    }

    // Horizontal rule
    if (/^-{3,}$/.test(trimmed)) {
      nodes.push(<hr key={`hr-${blockKey++}`} className="my-3 border-slate-200" />);
      i += 1;
      continue;
    }

    // Bullet list (dash or numbered)
    const isDash = /^[-•]\s+/.test(trimmed);
    const isNum = /^\d+[.)]\s+/.test(trimmed);
    if (isDash || isNum) {
      let j = i;
      while (j < lines.length) {
        const t = lines[j].trim();
        if (t && (/^[-•]\s+/.test(t) || /^\d+[.)]\s+/.test(t))) j += 1;
        else break;
      }
      flushBullets(i, j, isNum);
      i = j;
      continue;
    }

    // Plain paragraph — group consecutive non-empty, non-special lines.
    let j = i;
    const paragraph: string[] = [trimmed];
    j += 1;
    while (j < lines.length) {
      const t = lines[j].trim();
      if (!t) break;
      if (/^(#{2,3})\s+/.test(t) || /^[-•]\s+/.test(t) || /^\d+[.)]\s+/.test(t) || /^-{3,}$/.test(t) || t.startsWith('>')) break;
      paragraph.push(t);
      j += 1;
    }
    nodes.push(
      <p key={`p-${blockKey++}`} className="my-1.5 text-[13px] leading-relaxed text-slate-700">
        {paragraph.map((pLine, idx) => (
          <React.Fragment key={`pl-${idx}`}>
            {idx > 0 && <br />}
            {renderInlineNodes(pLine, `p-${blockKey}-${idx}`)}
          </React.Fragment>
        ))}
      </p>
    );
    i = j;
  }

  return <>{nodes}</>;
}

/* ------------------------------------------------------------------------ */

interface AIMessageProps {
  message: AIMessageType;
  /** The user prompt that produced this assistant turn (for action cards). */
  userPrompt?: string;
  /** True when this assistant turn was preceded by an urgent-symptom screen. */
  urgent?: boolean;
  /** Extra content rendered beneath assistant messages (error/retry etc.). */
  footer?: React.ReactNode;
  onNavigate?: (tab: string) => void;
}

export const AIMessage: React.FC<AIMessageProps> = ({ message, userPrompt, urgent, footer, onNavigate }) => {
  const isAssistant = message.role === 'assistant';
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!isAssistant) {
    return (
      <div className="flex justify-end gap-3">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-medical-700 px-4 py-3 text-[13px] leading-relaxed text-white shadow-sm">
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
          <span className="mt-1.5 block text-right text-[10px] font-medium text-medical-200">{time}</span>
        </div>
      </div>
    );
  }

  const lines = message.content.split('\n');
  const cards = userPrompt ? suggestActionCards(userPrompt, message.content) : [];
  const isEmptyFailure = message.content.trim() === '' && message.failed;

  return (
    <div className="flex items-start gap-3">
      <AIAvatar size={30} className="mt-1 rounded-full" />
      <div className="min-w-0 max-w-[85%] flex-1 space-y-2">
        {urgent && (
          <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs leading-relaxed text-rose-900" role="alert">
            <Siren className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" aria-hidden="true" />
            <p>
              <strong>Please get urgent care if needed.</strong> {URGENT_CARE_NOTE}
            </p>
          </div>
        )}

        {isEmptyFailure ? (
          /* Failed AI turn — the footer carries the Retry control. */
          footer
        ) : (
        <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
          {renderBlocks(lines)}

          {message.sourceContext && (
            <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-2.5 text-[10px] font-semibold text-medical-700">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              Source: {message.sourceContext}
            </div>
          )}

          <span className="mt-2 block text-[10px] font-medium text-slate-400">{time}</span>
        </div>
        )}

        {!isEmptyFailure && cards.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {cards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => onNavigate?.(card.tab)}
                className="inline-flex items-center gap-1.5 rounded-full border border-medical-200 bg-medical-50 px-3 py-1.5 text-xs font-bold text-medical-700 transition hover:bg-medical-100 hover:text-medical-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
              >
                {card.label}
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}

        {!isEmptyFailure && footer}
      </div>
    </div>
  );
};

export type { AIActionCard };
