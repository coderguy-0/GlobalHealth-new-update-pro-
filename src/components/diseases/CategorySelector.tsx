import React, { useMemo, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { CATEGORY_LIST } from '../../data/diseases/diseaseIndex';

interface CategorySelectorProps {
  selected: string[];
  onToggle: (category: string) => void;
  onClear: () => void;
  /** Initial visible chip count before expanding. */
  initialVisible?: number;
}

/**
 * Expandable category selector. Shows a compact set of chips and expands
 * to reveal the full list — never overwhelms the initial screen.
 */
export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selected,
  onToggle,
  onClear,
  initialVisible = 6,
}) => {
  const [expanded, setExpanded] = useState(false);
  const visible = useMemo(
    () => (expanded ? CATEGORY_LIST : CATEGORY_LIST.slice(0, initialVisible)),
    [expanded]
  );
  const total = CATEGORY_LIST.length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onClear}
          className={`gh-chip ${selected.length === 0 ? 'gh-chip-active' : ''}`}
        >
          All Diseases
        </button>
        {visible.map((cat) => {
          const active = selected.includes(cat.category);
          return (
            <button
              key={cat.category}
              type="button"
              onClick={() => onToggle(cat.category)}
              aria-pressed={active}
              className={`gh-chip ${active ? 'gh-chip-active' : ''}`}
            >
              {active && <Check className="h-3 w-3" />}
              {cat.category}
              <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${active ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
        {total > initialVisible && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-medical-300 hover:text-medical-700"
            aria-expanded={expanded}
          >
            {expanded ? 'Show less' : `Show all ${total} categories`}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
};
