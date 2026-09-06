import React from 'react';
import { ArrowRight, Bookmark, Stethoscope, Activity } from 'lucide-react';
import { HealthCondition } from '../../types';
import { plainLanguageSummary } from '../../data/diseases/diseaseIndex';

interface DiseaseCardProps {
  condition: HealthCondition;
  isSaved: boolean;
  onOpen: (id: string) => void;
  onToggleSave?: (id: string) => void;
}

/**
 * Minimalist disease card — answers "What is this?" only.
 * All deeper information lives on the detail page.
 */
export const DiseaseCard: React.FC<DiseaseCardProps> = ({ condition, isSaved, onOpen, onToggleSave }) => {
  return (
    <button
      type="button"
      onClick={() => onOpen(condition.id)}
      className="group flex h-full w-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-medical-200 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
      aria-label={`Open ${condition.title}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-medical-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-medical-700">
          <Stethoscope className="h-3 w-3" />
          {condition.category}
        </span>
        {onToggleSave && (
          <span
            role="button"
            tabIndex={0}
            aria-label={isSaved ? 'Remove from saved library' : 'Save to library'}
            aria-pressed={isSaved}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(condition.id);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onToggleSave(condition.id);
              }
            }}
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition ${
              isSaved ? 'bg-medical-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-medical-50 hover:text-medical-600'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </span>
        )}
      </div>

      <h3 className="mt-3.5 text-[15px] font-bold leading-snug text-slate-900 group-hover:text-medical-800">
        {condition.title}
      </h3>
      {condition.commonName && condition.commonName !== condition.title && (
        <p className="mt-0.5 text-[11px] font-medium text-slate-400">{condition.commonName}</p>
      )}

      <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-slate-500 line-clamp-2">
        {plainLanguageSummary(condition)}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
          {condition.bodySystem && (
            <span className="inline-flex items-center gap-1">
              <Activity className="h-3 w-3" />
              <span className="max-w-28 truncate">{condition.bodySystem.replace(' System', '')}</span>
            </span>
          )}
          <span className="text-slate-200" aria-hidden="true">|</span>
          <span className="truncate">{condition.specialist}</span>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-medical-600" />
      </div>
    </button>
  );
};

export const DiseaseGrid: React.FC<{
  conditions: HealthCondition[];
  savedIds: string[];
  onOpen: (id: string) => void;
  onToggleSave?: (id: string) => void;
  className?: string;
}> = ({ conditions, savedIds, onOpen, onToggleSave, className = '' }) => (
  <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
    {conditions.map((c) => (
      <DiseaseCard key={c.id} condition={c} isSaved={savedIds.includes(c.id)} onOpen={onOpen} onToggleSave={onToggleSave} />
    ))}
  </div>
);

/** Card used while disease lists load. */
export const DiseaseCardSkeleton: React.FC = () => (
  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
    <div className="flex items-center justify-between">
      <div className="h-5 w-24 animate-pulse rounded-full bg-slate-200/70" />
      <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200/70" />
    </div>
    <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-slate-200/70" />
    <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-slate-200/60" />
    <div className="mt-4 space-y-2">
      <div className="h-3 w-full animate-pulse rounded bg-slate-200/60" />
      <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200/60" />
    </div>
  </div>
);
