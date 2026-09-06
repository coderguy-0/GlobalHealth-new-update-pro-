import React from 'react';
import { X, RotateCcw, Filter } from 'lucide-react';
import { BODY_SYSTEMS, CATEGORY_LIST, SPECIALTY_LIST } from '../../data/diseases/diseaseIndex';
import { DiseaseFilters as FiltersState, EMPTY_FILTERS } from './diseaseState';

interface DiseaseFiltersPanelProps {
  filters: FiltersState;
  onChange: (next: FiltersState) => void;
  onClose: () => void;
  savedOnlyAvailable: boolean;
  savedCount: number;
}

/**
 * Advanced filter panel (rendered inline on desktop, as a bottom sheet on
 * mobile). Keeps the directory interface visually clean.
 */
export const DiseaseFiltersPanel: React.FC<DiseaseFiltersPanelProps> = ({
  filters,
  onChange,
  onClose,
  savedOnlyAvailable,
  savedCount,
}) => {
  const toggleCategory = (cat: string) => {
    onChange({
      ...filters,
      categories: filters.categories.includes(cat)
        ? filters.categories.filter((c) => c !== cat)
        : [...filters.categories, cat],
    });
  };

  const reset = () => onChange({ ...EMPTY_FILTERS });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-lift">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Filter className="h-4 w-4 text-medical-600" />
          Filters
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="max-h-[26rem] space-y-5 overflow-y-auto p-5">
        {/* Categories */}
        <fieldset>
          <legend className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Disease category</legend>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_LIST.map((cat) => {
              const active = filters.categories.includes(cat.category);
              return (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => toggleCategory(cat.category)}
                  aria-pressed={active}
                  className={`gh-chip ${active ? 'gh-chip-active' : ''}`}
                >
                  {cat.category}
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${active ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Body system */}
        <fieldset>
          <legend className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Body system</legend>
          <div className="flex flex-wrap gap-1.5">
            {BODY_SYSTEMS.filter((b) => b.count > 0).map((bs) => (
              <button
                key={bs.id}
                type="button"
                onClick={() => onChange({ ...filters, bodySystemId: filters.bodySystemId === bs.id ? null : bs.id })}
                aria-pressed={filters.bodySystemId === bs.id}
                className={`gh-chip ${filters.bodySystemId === bs.id ? 'gh-chip-active' : ''}`}
              >
                {bs.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Specialty */}
        <fieldset>
          <legend className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Specialty</legend>
          <div className="flex flex-wrap gap-1.5">
            {SPECIALTY_LIST.map((sp) => (
              <button
                key={sp.category}
                type="button"
                onClick={() => onChange({ ...filters, specialty: filters.specialty === sp.category ? null : sp.category })}
                aria-pressed={filters.specialty === sp.category}
                className={`gh-chip ${filters.specialty === sp.category ? 'gh-chip-active' : ''}`}
              >
                {sp.category}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Toggles */}
        <fieldset className="space-y-2">
          <legend className="text-[11px] font-bold uppercase tracking-wider text-slate-400">More options</legend>
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-3.5 py-2.5 transition hover:bg-slate-50">
            <span className="text-[13px] font-medium text-slate-700">Contagious / communicable conditions only</span>
            <input
              type="checkbox"
              checked={filters.contagiousOnly}
              onChange={(e) => onChange({ ...filters, contagiousOnly: e.target.checked })}
              className="h-4 w-4 accent-medical-600"
            />
          </label>
          {savedOnlyAvailable && (
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-3.5 py-2.5 transition hover:bg-slate-50">
              <span className="text-[13px] font-medium text-slate-700">
                Saved only <span className="text-slate-400">({savedCount})</span>
              </span>
              <input
                type="checkbox"
                checked={filters.savedOnly}
                onChange={(e) => onChange({ ...filters, savedOnly: e.target.checked })}
                className="h-4 w-4 accent-medical-600"
              />
            </label>
          )}
        </fieldset>
      </div>
    </div>
  );
};
