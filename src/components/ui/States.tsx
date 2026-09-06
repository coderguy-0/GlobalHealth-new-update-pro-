import React from 'react';
import { SearchX, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

/** Friendly empty state for dynamic homepage components. */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results yet',
  description = 'Try searching another healthcare topic.',
  action,
}) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center">
    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-400 shadow-sm">
      <SearchX className="h-5 w-5" />
    </span>
    <p className="mt-4 text-sm font-bold text-slate-800">{title}</p>
    <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/** Recovery experience for API-driven sections — no raw error text shown. */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = "We couldn't load this information right now.",
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-soft">
    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600">
      <AlertTriangle className="h-5 w-5" />
    </span>
    <p className="mt-4 text-sm font-bold text-slate-800">{title}</p>
    <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">{description}</p>
    {onRetry && (
      <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);
