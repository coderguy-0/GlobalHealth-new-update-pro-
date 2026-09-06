import React, { useEffect, useRef, useState } from 'react';
import { Send, Square, Eraser } from 'lucide-react';

interface AIInputProps {
  onSend: (text: string) => void;
  onStop: () => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  /** External prompt to pre-fill (e.g. from a disease page). */
  inject?: string | null;
  onInjected?: () => void;
}

const MAX_LENGTH = 4000;

/** Sticky chat input — Enter sends, Shift+Enter inserts a newline. */
export const AIInput: React.FC<AIInputProps> = ({ onSend, onStop, disabled, loading, placeholder, inject, onInjected }) => {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);
  const injectedRef = useRef<string | null>(null);

  useEffect(() => {
    if (inject && inject !== injectedRef.current) {
      injectedRef.current = inject;
      setValue(inject);
      autoGrow();
      ref.current?.focus();
      onInjected?.();
    }
  }, [inject, onInjected]);

  const submit = () => {
    const text = value.trim();
    if (!text || loading || disabled) return;
    onSend(text);
    setValue('');
    if (ref.current) ref.current.style.height = 'auto';
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const autoGrow = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  return (
    <div className="border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur sm:px-4">
      <div className="mx-auto flex w-full max-w-3xl items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= MAX_LENGTH) setValue(e.target.value);
              autoGrow();
            }}
            onKeyDown={onKeyDown}
            rows={1}
            maxLength={MAX_LENGTH}
            disabled={disabled}
            placeholder={placeholder || 'Ask GlobalHealth AI…'}
            aria-label={placeholder || 'Ask GlobalHealth AI'}
            className="max-h-[140px] w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-2.5 pr-12 text-sm text-slate-800 transition placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/30 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => {
              setValue('');
              if (ref.current) ref.current.style.height = 'auto';
              ref.current?.focus();
            }}
            disabled={!value.trim() || loading}
            aria-label="Clear message draft"
            title="Clear message draft"
            className="absolute bottom-2 right-2.5 grid h-8 w-8 place-items-center rounded-full text-slate-300 transition hover:bg-slate-100 hover:text-slate-500 disabled:opacity-40"
          >
            <Eraser className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-800 text-white transition hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-2"
          >
            <Square className="h-4 w-4 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!value.trim() || disabled}
            aria-label="Send message"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-medical-600 text-white shadow-sm transition hover:bg-medical-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-600 focus-visible:ring-offset-2 disabled:opacity-50"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        )}
      </div>
      <p className="mx-auto mt-1.5 max-w-3xl text-[10px] text-slate-400">
        Enter to send · Shift+Enter for a new line · Educational information only
      </p>
    </div>
  );
};
