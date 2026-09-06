import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, ChevronLeft, SlidersHorizontal, ArrowUpDown, X, RotateCcw, LayoutGrid, Rows3 } from 'lucide-react';
import { NavigationTab } from '../../types';
import { ALL_DISEASES, specialtyForSymptom } from '../../data/diseases/diseaseIndex';
import { DiseaseCard, DiseaseGrid, DiseaseCardSkeleton } from './DiseaseCard';
import { BodySystemExplorer } from './BodySystemExplorer';
import { CategorySelector } from './CategorySelector';
import { DiseaseAlphabet } from './DiseaseAlphabet';
import { DiseaseSearch } from './DiseaseSearch';
import { DiseaseFiltersPanel } from './DiseaseFilters';
import {
  DiseaseFilters,
  EMPTY_FILTERS,
  DiseaseSort,
  filterDiseases,
  countActiveFilters,
  bodySystemLabel,
} from './diseaseState';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/States';

interface DiseaseDirectoryPageProps {
  initialFilters?: Partial<DiseaseFilters>;
  /** Increment to force the directory to reset with new initial filters. */
  resetKey: number;
  onOpenDisease: (id: string) => void;
  onBack: () => void;
  onNavigate: (tab: NavigationTab) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

type DirectoryView = 'all' | 'popular' | 'categories' | 'systems' | 'az';

const PER_PAGE = 12;

export const DiseaseDirectoryPage: React.FC<DiseaseDirectoryPageProps> = ({
  initialFilters,
  resetKey,
  onOpenDisease,
  onBack,
  onNavigate,
  savedIds,
  onToggleSave,
}) => {
  const [view, setView] = useState<DirectoryView>('all');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<DiseaseFilters>({ ...EMPTY_FILTERS, ...initialFilters });
  const [sort, setSort] = useState<DiseaseSort>('relevance');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gridView, setGridView] = useState<'grid' | 'list'>('grid');

  // Reset whenever a new prefilter arrives from the landing page.
  useEffect(() => {
    setFilters({ ...EMPTY_FILTERS, ...initialFilters });
    setSearch('');
    setSort('relevance');
    setPage(1);
  }, [resetKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Simulated async load so skeleton states are visible (and future API wiring is trivial).
  useEffect(() => {
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 280);
    return () => window.clearTimeout(t);
  }, [view, page, filters, search, sort]);

  const { items, total, availableLetters } = useMemo(
    () => filterDiseases(search, filters, sort, savedIds, page, PER_PAGE),
    [search, filters, sort, savedIds, page]
  );

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const activeCount = countActiveFilters(filters, !!search.trim());
  const popularIds = useMemo(() => ['dis-endocr-302', 'dis-cardio-1', 'dis-pulmon-101', 'dis-neurol-70', 'dis-orthop-201', 'dis-nephro-252', 'dis-pulmon-107', 'dis-endocr-310'], []);

  const goPage = (p: number) => {
    setPage(Math.min(totalPages, Math.max(1, p)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetAll = () => {
    setFilters({ ...EMPTY_FILTERS });
    setSearch('');
    setSort('relevance');
    setPage(1);
  };

  const visibleList = view === 'popular' ? ALL_DISEASES.filter((d) => popularIds.includes(d.id)) : items;
  const showDirectoryGrid = view === 'all' || view === 'popular';

  return (
    <div className="bg-slate-50/40">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white">
        <div className="gh-container flex items-center gap-1.5 py-3 text-xs text-slate-500">
          <button type="button" onClick={() => onNavigate('home')} className="font-semibold text-slate-600 transition hover:text-medical-700">
            Home
          </button>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <button type="button" onClick={onBack} className="font-semibold text-slate-600 transition hover:text-medical-700">
            Diseases
          </button>
          {filters.categories.length === 1 && (
            <>
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <span className="font-medium text-slate-800">{filters.categories[0]}</span>
            </>
          )}
        </div>
      </div>

      <section className="gh-section" aria-labelledby="directory-title">
        <div className="gh-container">
          {/* Heading */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="gh-eyebrow">Disease directory</span>
              <h1 id="directory-title" className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Explore Diseases
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {ALL_DISEASES.length} structured condition guides · search, filter, and browse by category, body system or specialty.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={onBack}>
              Back to overview
            </Button>
          </div>

          {/* Search */}
          <div className="mt-7">
            <DiseaseSearch
              onSelectDisease={onOpenDisease}
              onSelectSuggestion={(kind, label) => {
                if (kind === 'bodySystem') {
                  const bs = ['brain-nervous', 'heart-circulatory', 'lungs-respiratory', 'digestive', 'liver', 'kidneys-urinary', 'endocrine', 'bones-joints', 'skin', 'immune', 'reproductive', 'cancer'].find((id) => {
                    const map: Record<string, string> = {
                      'brain-nervous': 'Brain & Nervous System',
                      'heart-circulatory': 'Heart & Circulatory System',
                      'lungs-respiratory': 'Lungs & Respiratory System',
                      digestive: 'Digestive System',
                      liver: 'Liver & Biliary',
                      'kidneys-urinary': 'Kidneys & Urinary System',
                      endocrine: 'Endocrine System',
                      'bones-joints': 'Bones & Joints',
                      skin: 'Skin',
                      immune: 'Immune System',
                      reproductive: 'Reproductive System',
                      cancer: 'Cellular & Neoplastic (Cancer)',
                    };
                    return map[id] === label;
                  });
                  setFilters((f) => ({ ...f, bodySystemId: bs || f.bodySystemId }));
                  setView('systems');
                } else if (kind === 'specialty') {
                  setFilters((f) => ({ ...f, specialty: label }));
                  setView('all');
                } else if (kind === 'symptom') {
                  // Symptom → specialty navigation aid (never a diagnosis).
                  setFilters((f) => ({ ...f, specialty: specialtyForSymptom(label) || null }));
                  setView('all');
                } else {
                  setSearch(label);
                  setView('all');
                }
                setPage(1);
              }}
              onOpenDirectory={() => {
                setView('all');
                setPage(1);
              }}
              size="md"
            />
          </div>

          {/* View tabs */}
          <div className="mt-6 flex flex-wrap items-center gap-2" role="tablist" aria-label="Directory views">
            {(
              [
                ['all', 'All'],
                ['popular', 'Popular'],
                ['categories', 'Categories'],
                ['systems', 'Body systems'],
                ['az', 'A–Z'],
              ] as [DirectoryView, string][]
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={view === v}
                onClick={() => {
                  setView(v);
                  setPage(1);
                }}
                className={`gh-chip ${view === v ? 'gh-chip-active' : ''}`}
              >
                {label}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2">
              {/* Sort */}
              <div className="relative">
                <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as DiseaseSort);
                    setPage(1);
                  }}
                  aria-label="Sort diseases"
                  className="rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-8 text-xs font-semibold text-slate-700 shadow-soft focus:outline-none focus:ring-2 focus:ring-medical-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="title-asc">A → Z</option>
                  <option value="title-desc">Z → A</option>
                </select>
              </div>

              {/* Grid / list toggle */}
              <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
                <button
                  type="button"
                  onClick={() => setGridView('grid')}
                  aria-label="Grid view"
                  aria-pressed={gridView === 'grid'}
                  className={`grid h-9 w-9 place-items-center transition ${gridView === 'grid' ? 'bg-medical-50 text-medical-700' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setGridView('list')}
                  aria-label="List view"
                  aria-pressed={gridView === 'list'}
                  className={`grid h-9 w-9 place-items-center border-l border-slate-200 transition ${gridView === 'list' ? 'bg-medical-50 text-medical-700' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Rows3 className="h-4 w-4" />
                </button>
              </div>

              {/* Filters */}
              <button
                type="button"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                  activeCount > 0 || filtersOpen
                    ? 'border-medical-600 bg-medical-600 text-white'
                    : 'border-slate-200 bg-white text-slate-700 shadow-soft hover:border-medical-200'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeCount > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] font-black text-medical-700">
                    {activeCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filters panel */}
          {filtersOpen && (
            <div className="mt-4">
              <DiseaseFiltersPanel
                filters={filters}
                onChange={(f) => {
                  setFilters(f);
                  setPage(1);
                }}
                onClose={() => setFiltersOpen(false)}
                savedOnlyAvailable={savedIds.length > 0}
                savedCount={savedIds.length}
              />
            </div>
          )}

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-medical-100 bg-medical-50/60 px-4 py-3 text-xs">
              <span className="font-bold text-medical-800">Active:</span>
              {filters.categories.map((c) => (
                <span key={c} className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 font-semibold text-slate-700 shadow-sm">
                  {c}
                  <button type="button" onClick={() => setFilters({ ...filters, categories: filters.categories.filter((x) => x !== c) })} aria-label={`Remove ${c}`}>
                    <X className="h-3 w-3 text-slate-400 hover:text-rose-500" />
                  </button>
                </span>
              ))}
              {filters.bodySystemId && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 font-semibold text-slate-700 shadow-sm">
                  {bodySystemLabel(filters.bodySystemId)}
                  <button type="button" onClick={() => setFilters({ ...filters, bodySystemId: null })} aria-label="Remove body system">
                    <X className="h-3 w-3 text-slate-400 hover:text-rose-500" />
                  </button>
                </span>
              )}
              {filters.specialty && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 font-semibold text-slate-700 shadow-sm">
                  {filters.specialty}
                  <button type="button" onClick={() => setFilters({ ...filters, specialty: null })} aria-label="Remove specialty">
                    <X className="h-3 w-3 text-slate-400 hover:text-rose-500" />
                  </button>
                </span>
              )}
              {filters.contagiousOnly && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 font-semibold text-slate-700 shadow-sm">
                  Contagious only
                  <button type="button" onClick={() => setFilters({ ...filters, contagiousOnly: false })} aria-label="Remove contagious filter">
                    <X className="h-3 w-3 text-slate-400 hover:text-rose-500" />
                  </button>
                </span>
              )}
              <button type="button" onClick={resetAll} className="ml-auto inline-flex items-center gap-1 font-bold text-medical-700 hover:text-medical-900">
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>
          )}

          {/* View-specific content */}
          <div className="mt-8">
            {view === 'categories' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                <h2 className="mb-4 text-sm font-bold text-slate-900">Browse by category</h2>
                <CategorySelector
                  selected={filters.categories}
                  onToggle={(cat) => {
                    setFilters((f) => ({
                      ...f,
                      categories: f.categories.includes(cat) ? f.categories.filter((c) => c !== cat) : [...f.categories, cat],
                    }));
                    setPage(1);
                  }}
                  onClear={() => setFilters((f) => ({ ...f, categories: [] }))}
                  initialVisible={12}
                />
              </div>
            )}

            {view === 'systems' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                <h2 className="mb-4 text-sm font-bold text-slate-900">Browse by body system</h2>
                <BodySystemExplorer
                  selectedId={filters.bodySystemId}
                  onSelect={(id) => {
                    setFilters((f) => ({ ...f, bodySystemId: f.bodySystemId === id ? null : id }));
                    setPage(1);
                  }}
                />
              </div>
            )}

            {view === 'az' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                <h2 className="mb-4 text-sm font-bold text-slate-900">Browse A–Z</h2>
                <DiseaseAlphabet
                  activeLetter={filters.letter}
                  onSelect={(letter) => {
                    setFilters((f) => ({ ...f, letter }));
                    setPage(1);
                  }}
                  availableLetters={availableLetters}
                />
              </div>
            )}

            {(view === 'all' || view === 'popular') && (
              <>
                {loading ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <DiseaseCardSkeleton key={i} />
                    ))}
                  </div>
                ) : visibleList.length === 0 ? (
                  <EmptyState
                    title="No disease found"
                    description="Try another disease name, symptom, body system or category."
                    action={
                      <Button variant="secondary" size="sm" onClick={resetAll}>
                        Clear search &amp; filters
                      </Button>
                    }
                  />
                ) : gridView === 'grid' ? (
                  <>
                    <DiseaseGrid conditions={visibleList} savedIds={savedIds} onOpen={onOpenDisease} onToggleSave={onToggleSave} />
                    {view === 'all' && (
                      <div className="mt-8 flex items-center justify-center gap-3">
                        <button
                          type="button"
                          disabled={page <= 1}
                          onClick={() => goPage(page - 1)}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-soft transition hover:border-medical-200 disabled:opacity-40"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                          Previous
                        </button>
                        <span className="text-xs font-semibold text-slate-500">
                          Page {page} of {totalPages} · {total} conditions
                        </span>
                        <button
                          type="button"
                          disabled={page >= totalPages}
                          onClick={() => goPage(page + 1)}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-soft transition hover:border-medical-200 disabled:opacity-40"
                        >
                          Next
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-3">
                    {visibleList.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => onOpenDisease(c.id)}
                        className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 text-left shadow-soft transition hover:border-medical-200 hover:shadow-lift"
                      >
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                          <p className="mt-0.5 truncate text-xs text-slate-500">{c.summary}</p>
                          <p className="mt-1.5 text-[11px] text-slate-400">
                            {c.category} · {c.specialist}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
