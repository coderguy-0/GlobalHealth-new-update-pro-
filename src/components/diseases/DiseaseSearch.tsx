import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, TrendingUp, Clock, CornerDownLeft, Mic, Stethoscope, Activity, ScanHeart, UserRound, FolderOpen, ArrowRight } from 'lucide-react';
import { searchDiseases, smartSearch, SearchSuggestion, slugify, getDiseaseBySlug, ALL_DISEASES } from '../../data/diseases/diseaseIndex';
import { SearchSkeleton } from '../ui/Skeleton';

export interface DiseaseSearchResult {
  id: string;
  title: string;
  subtitle: string;
  kind: 'disease' | 'symptom' | 'bodySystem' | 'specialty' | 'category';
}

interface DiseaseSearchProps {
  /** Called when the user picks a disease result. */
  onSelectDisease: (id: string) => void;
  /** Called when the user picks a symptom / body system / specialty suggestion. */
  onSelectSuggestion: (kind: 'symptom' | 'bodySystem' | 'specialty' | 'category', label: string) => void;
  /** Called to open the full directory (e.g. Enter with no selection). */
  onOpenDirectory?: () => void;
  placeholder?: string;
  size?: 'lg' | 'md';
  autoFocus?: boolean;
}

const EXAMPLE_QUERIES = ['Diabetes', 'Asthma', 'Migraine', 'Hypertension', 'Arthritis', 'Pneumonia', 'Influenza', 'Kidney disease'];

const SUGGESTION_ICONS: Record<SearchSuggestion['kind'], React.ReactNode> = {
  symptom: <Activity className="h-3.5 w-3.5" />,
  bodySystem: <ScanHeart className="h-3.5 w-3.5" />,
  specialty: <UserRound className="h-3.5 w-3.5" />,
  category: <FolderOpen className="h-3.5 w-3.5" />,
  disease: <Stethoscope className="h-3.5 w-3.5" />,
};

/**
 * Universal disease search with ranked results and an intelligent suggestion
 * panel (diseases, symptoms, body systems, specialties) plus keyboard support.
 */
export const DiseaseSearch: React.FC<DiseaseSearchProps> = ({
  onSelectDisease,
  onSelectSuggestion,
  onOpenDirectory,
  placeholder = 'Search a disease, condition, symptom, body system or specialty…',
  size = 'lg',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSkeleton(false), 250);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gh_disease_recent_searches');
      if (stored) setRecent(JSON.parse(stored).slice(0, 5));
    } catch {
      /* ignore */
    }
  }, []);

  const recordRecent = (term: string) => {
    if (!term.trim()) return;
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(next);
    try {
      localStorage.setItem('gh_disease_recent_searches', JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const diseaseHits = useMemo(() => searchDiseases(query, 5), [query]);
  const smartHits = useMemo(() => smartSearch(query, 4), [query]);

  const flattened: { type: 'disease' | 'smart'; item: any }[] = useMemo(() => {
    const list: { type: 'disease' | 'smart'; item: any }[] = [];
    diseaseHits.forEach((h) => list.push({ type: 'disease', item: h }));
    smartHits.forEach((s) => list.push({ type: 'smart', item: s }));
    return list;
  }, [diseaseHits, smartHits]);

  const resetActive = () => setActiveIndex(-1);

  const chooseDisease = (id: string, term?: string) => {
    if (term) recordRecent(term);
    setQuery('');
    setFocused(false);
    onSelectDisease(id);
  };

  const chooseSmart = (s: SearchSuggestion, term?: string) => {
    if (term) recordRecent(term);
    setQuery('');
    setFocused(false);
    // A disease suggestion has its own handler and opens the disease page
    // directly; only the taxonomy kinds go to onSelectSuggestion.
    if (s.kind === 'disease') {
      onSelectDisease(s.id ?? slugify(s.label));
      return;
    }
    onSelectSuggestion(s.kind, s.label);
  };

  const runVoice = () => {
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    try {
      const rec = new SR();
      rec.lang = 'en-US';
      rec.interimResults = false;
      rec.onresult = (e: any) => {
        const transcript = e.results?.[0]?.[0]?.transcript;
        if (transcript) setQuery(transcript);
      };
      rec.start();
    } catch {
      /* ignore */
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flattened.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && flattened[activeIndex]) {
        const item = flattened[activeIndex];
        if (item.type === 'disease') chooseDisease(item.item.cond.id, query);
        else chooseSmart(item.item, query);
      } else if (diseaseHits[0]) {
        chooseDisease(diseaseHits[0].cond.id, query);
      } else if (onOpenDirectory && query.trim()) {
        recordRecent(query.trim());
        onOpenDirectory();
      }
    } else if (e.key === 'Escape') {
      setFocused(false);
    }
  };

  const panelOpen = focused && (query.trim() || recent.length > 0);
  const hasResults = diseaseHits.length > 0 || smartHits.length > 0;

  return (
    <div className="relative" role="search">
      {showSkeleton ? (
        <SearchSkeleton />
      ) : (
        <div
          className={`relative flex items-center gap-2 rounded-2xl border bg-white p-2 shadow-soft transition-all duration-200 ${
            focused ? 'scale-[1.01] border-medical-300 shadow-lift' : 'border-slate-200 hover:border-slate-300'
          } ${size === 'lg' ? '' : 'max-w-2xl'}`}
        >
          <Search className={`ml-1.5 h-5 w-5 shrink-0 text-slate-400 ${focused ? 'text-medical-600' : ''}`} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            autoFocus={autoFocus}
            onChange={(e) => {
              setQuery(e.target.value);
              resetActive();
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 180)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label={placeholder}
            aria-expanded={!!panelOpen}
            className="w-full bg-transparent px-2 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
          {typeof window !== 'undefined' && 'SpeechRecognition' in window ? (
            <button type="button" onClick={runVoice} aria-label="Search by voice" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-medical-50 hover:text-medical-600">
              <Mic className="h-4.5 w-4.5" />
            </button>
          ) : null}
          {query ? (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-400 sm:inline-flex">
              <CornerDownLeft className="h-3 w-3" /> to search
            </kbd>
          )}
        </div>
      )}

      {/* Example queries */}
      {!query && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Try:</span>
          {EXAMPLE_QUERIES.map((q) => (
            <button key={q} type="button" onClick={() => setQuery(q)} className="gh-chip">
              <TrendingUp className="h-3 w-3 text-medical-500" />
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Suggestion panel */}
      {panelOpen && (
        <div className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift">
          {query.trim() ? (
            !hasResults ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm font-semibold text-slate-700">No disease found</p>
                <p className="mt-1 text-xs text-slate-500">Try another disease name, symptom, body system or category.</p>
              </div>
            ) : (
              <div className="max-h-[24rem] overflow-y-auto p-2">
                {diseaseHits.length > 0 && (
                  <div>
                    <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Diseases</p>
                    {diseaseHits.map((hit, i) => (
                      <button
                        key={hit.cond.id}
                        type="button"
                        onMouseEnter={() => setActiveIndex(i)}
                        onClick={() => chooseDisease(hit.cond.id, query)}
                        className={`group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                          activeIndex === i ? 'bg-medical-50' : ''
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          <Stethoscope className="h-4 w-4 shrink-0 text-medical-600" />
                          <span className="min-w-0">
                            <span className="block truncate text-[13px] font-semibold text-slate-800">{hit.cond.title}</span>
                            <span className="block truncate text-[11px] text-slate-500">
                              {hit.cond.category} · {hit.cond.specialist}
                            </span>
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-medical-600" />
                      </button>
                    ))}
                  </div>
                )}
                {smartHits.length > 0 && (
                  <div className="mt-1 border-t border-slate-100 pt-1">
                    <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Related topics</p>
                    {smartHits.map((s, j) => {
                      const idx = diseaseHits.length + j;
                      return (
                        <button
                          key={`${s.kind}-${s.label}`}
                          type="button"
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => chooseSmart(s, query)}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition ${
                            activeIndex === idx ? 'bg-medical-50' : ''
                          }`}
                        >
                          <span className="text-medical-500">{SUGGESTION_ICONS[s.kind]}</span>
                          <span className="min-w-0">
                            <span className="block truncate text-[13px] font-medium text-slate-700">{s.label}</span>
                            <span className="block truncate text-[10px] text-slate-400">
                              {s.sublabel ||
                                (s.kind === 'symptom' ? 'Symptom' : s.kind === 'bodySystem' ? 'Body system' : s.kind === 'specialty' ? 'Specialty' : 'Category')}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="p-3">
              {recent.length > 0 && (
                <div className="mb-2">
                  <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Recent searches</p>
                  {recent.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setQuery(r)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {r}
                    </button>
                  ))}
                </div>
              )}
              <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Popular conditions</p>
              <div className="flex flex-wrap gap-1.5 px-3 pb-2 pt-1">
                {EXAMPLE_QUERIES.map((q) => {
                  const match = getDiseaseBySlug(slugify(q)) || ALL_DISEASES.find((d) => d.title.toLowerCase().includes(q.toLowerCase()));
                  return (
                    <button
                      key={q}
                      type="button"
                      onClick={() => (match ? chooseDisease(match.id, q) : setQuery(q))}
                      className="gh-chip"
                    >
                      {q}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
