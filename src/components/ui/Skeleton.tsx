import React from 'react';

interface SkeletonProps {
  className?: string;
}

/** Base skeleton block with shimmer-free soft pulse. */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div aria-hidden="true" className={`animate-pulse rounded-xl bg-slate-200/70 ${className}`} />
);

/** Reusable card skeleton (used while async homepage sections load). */
export const CardSkeleton: React.FC = () => (
  <div className="gh-card-surface p-5">
    <div className="flex items-center gap-3">
      <Skeleton className="h-11 w-11 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  </div>
);

/** Skeleton used for the hero search while it prepares suggestions. */
export const SearchSkeleton: React.FC = () => (
  <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
    <Skeleton className="h-5 w-5 rounded-full" />
    <Skeleton className="h-4 flex-1" />
    <Skeleton className="hidden h-8 w-24 rounded-xl sm:block" />
  </div>
);
