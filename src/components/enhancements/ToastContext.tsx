import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastContextValue {
  toast: (t: Omit<Toast, 'id' | 'duration'> & { duration?: number }) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
};

const VARIANT_STYLES: Record<ToastVariant, { bg: string; icon: React.ReactNode; ring: string }> = {
  success: {
    bg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    ring: 'ring-emerald-500/20',
  },
  error: {
    bg: 'bg-rose-50 text-rose-900 border-rose-200',
    icon: <AlertCircle className="h-5 w-5 text-rose-600" />,
    ring: 'ring-rose-500/20',
  },
  info: {
    bg: 'bg-sky-50 text-sky-900 border-sky-200',
    icon: <Info className="h-5 w-5 text-sky-600" />,
    ring: 'ring-sky-500/20',
  },
  warning: {
    bg: 'bg-amber-50 text-amber-900 border-amber-200',
    icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    ring: 'ring-amber-500/20',
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const timers = useRef<Map<number, number>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const t = timers.current.get(id);
    if (t) {
      window.clearTimeout(t);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback<ToastContextValue['toast']>(
    ({ duration = 3500, ...rest }) => {
      const id = ++idRef.current;
      setToasts((list) => [...list, { id, duration, ...rest }]);
      const handle = window.setTimeout(() => dismiss(id), duration);
      timers.current.set(id, handle);
    },
    [dismiss]
  );

  const api: ToastContextValue = {
    toast,
    success: (title, description) => toast({ title, description, variant: 'success' }),
    error: (title, description) => toast({ title, description, variant: 'error' }),
    info: (title, description) => toast({ title, description, variant: 'info' }),
    warning: (title, description) => toast({ title, description, variant: 'warning' }),
  };

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  // Allow non-React code (e.g. the quick actions dock) to fire toasts via window event.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { variant?: ToastVariant; title: string; description?: string };
      if (detail?.title) {
        toast({
          title: detail.title,
          description: detail.description,
          variant: detail.variant ?? 'info',
        });
      }
    };
    window.addEventListener('gh:toast-dispatch', handler);
    return () => window.removeEventListener('gh:toast-dispatch', handler);
  }, [toast]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-5 z-[80] flex w-[min(92vw,22rem)] flex-col gap-2 sm:right-6" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => {
          const v = VARIANT_STYLES[t.variant];
          return (
            <div
              key={t.id}
              role="status"
              className={`gh-toast-in pointer-events-auto flex items-start gap-3 rounded-2xl border ${v.bg} p-3.5 shadow-lift ring-1 ${v.ring}`}
            >
              <span className="mt-0.5 shrink-0">{v.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-tight">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs opacity-80">{t.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="shrink-0 rounded-lg p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes gh-toast-in {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .gh-toast-in { animation: gh-toast-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .gh-toast-in { animation: none; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
