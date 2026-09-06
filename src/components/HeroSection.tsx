import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  Mic,
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
  CornerDownLeft,
  X,
  Bot,
} from 'lucide-react';
import { NavigationTab } from '../types';
import { RECIPES, DOCTORS, HOSPITALS } from '../data/directorySeed';
import { loadDiseases, loadMedicines, loadMedicalTests } from '../data/catalogLoaders';
import { useCatalog } from '../lib/useCatalog';
import { Button } from './ui/Button';
import { SearchSkeleton } from './ui/Skeleton';

interface HeroSectionProps {
  onTabChange: (tab: NavigationTab) => void;
}

interface SearchHit {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  tab: NavigationTab;
}

const RECENT_KEY = 'gh_home_recent_searches_v1';

const SUGGESTIONS = ['Diabetes', 'Blood Pressure', 'Complete Blood Count', 'Paracetamol', 'Cardiologist', 'Hospitals near me'];

/**
 * Homepage hero: two-column layout with eyebrow, headline, supporting copy,
 * primary/secondary CTAs and a unified global healthcare search experience.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ onTabChange }) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [supportSpeech, setSupportSpeech] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSkeleton(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  // Load recent searches once.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) setRecent(JSON.parse(stored).slice(0, 5));
    } catch {
      /* ignore */
    }
  }, []);

  // Allow the global header "Search" button to focus this field.
  useEffect(() => {
    const focusSearch = () => {
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    window.addEventListener('gh:focus-search', focusSearch);
    return () => window.removeEventListener('gh:focus-search', focusSearch);
  }, []);

  useEffect(() => {
    const w = window as any;
    setSupportSpeech(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  const recordRecent = (term: string) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  // The three large catalogs are fetched only once the visitor actually starts
  // searching, so the landing page itself never downloads them.
  const searchActive = query.trim().length > 0;
  const { items: HEALTH_CONDITIONS } = useCatalog(loadDiseases, searchActive);
  const { items: MEDICINES } = useCatalog(loadMedicines, searchActive);
  const { items: MEDICAL_TESTS } = useCatalog(loadMedicalTests, searchActive);

  const hits = useMemo<SearchHit[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const matches = (text?: string) => (text ? text.toLowerCase().includes(q) : false);

    const conditions = HEALTH_CONDITIONS.filter(
      (c) => matches(c.title) || matches(c.category) || c.symptoms?.some((s) => matches(s))
    )
      .slice(0, 3)
      .map((c) => ({ id: c.id, type: 'Disease', title: c.title, subtitle: c.category, tab: 'diseases' as NavigationTab }));

    const medicines = MEDICINES.filter((m) => matches(m.name) || matches(m.genericName) || matches(m.category))
      .slice(0, 3)
      .map((m) => ({ id: m.id, type: 'Medicine', title: m.name, subtitle: m.genericName, tab: 'medicines' as NavigationTab }));

    const tests = MEDICAL_TESTS.filter((x) => matches(x.name) || matches(x.category))
      .slice(0, 3)
      .map((x) => ({ id: x.id, type: 'Lab test', title: x.name, subtitle: x.category, tab: 'medical-tests' as NavigationTab }));

    const doctors = DOCTORS.filter((d) => matches(d.name) || matches(d.specialty) || matches(d.location))
      .slice(0, 3)
      .map((d) => ({ id: d.id, type: 'Doctor', title: d.name, subtitle: `${d.specialty} · ${d.location}`, tab: 'doctors' as NavigationTab }));

    const hospitals = HOSPITALS.filter((h) => matches(h.name) || matches(h.city) || matches(h.location))
      .slice(0, 3)
      .map((h) => ({ id: h.id, type: 'Hospital', title: h.name, subtitle: `${h.city} · ${h.type}`, tab: 'hospitals' as NavigationTab }));

    const recipes = RECIPES.filter((r) => matches(r.title) || r.dietTags?.some((tag) => matches(tag)))
      .slice(0, 2)
      .map((r) => ({ id: r.id, type: 'Recipe', title: r.title, subtitle: `${r.calories} kcal`, tab: 'recipes' as NavigationTab }));

    return [...conditions, ...medicines, ...tests, ...doctors, ...hospitals, ...recipes];
  }, [query, HEALTH_CONDITIONS, MEDICINES, MEDICAL_TESTS]);

  const grouped = useMemo(() => {
    const order = ['Disease', 'Medicine', 'Lab test', 'Doctor', 'Hospital', 'Recipe'];
    const map = new Map<string, SearchHit[]>();
    hits.forEach((h) => {
      const list = map.get(h.type) || [];
      list.push(h);
      map.set(h.type, list);
    });
    return order.map((type) => ({ type, items: map.get(type) || [] })).filter((g) => g.items.length > 0);
  }, [hits]);

  const openResult = (hit: SearchHit) => {
    recordRecent(query.trim());
    setQuery('');
    setFocused(false);
    onTabChange(hit.tab);
  };

  const openSuggestion = (s: string) => {
    setQuery(s);
    setFocused(true);
  };

  const clear = () => {
    setQuery('');
    setFocused(true);
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
        if (transcript) {
          setQuery(transcript);
          setFocused(true);
        }
      };
      rec.start();
    } catch {
      /* unsupported */
    }
  };

  const panelOpen = focused && (query.trim() || recent.length > 0);

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Soft top light wash — calm, not saturated */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-gradient-to-b from-medical-50/80 via-medical-50/30 to-transparent" aria-hidden="true" />

      <div className="gh-container relative">
        <div className="gh-sym-section flex flex-col items-center text-center">
          {/* ---------------- Centered eyebrow ---------------- */}
          <span className="gh-eyebrow">
            <Sparkles className="h-3.5 w-3.5" />
            YOUR HEALTH. CONNECTED.
          </span>

          {/* ---------------- Centered headline ---------------- */}
          <h1 className="mt-6 max-w-3xl text-[1.85rem] font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
            Healthcare information, discovery and guidance — all in one place.
          </h1>

          {/* ---------------- Centered supporting copy ---------------- */}
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
            GlobalHealth brings trusted health information, medicines, healthcare professionals,
            medical facilities, laboratory resources, and intelligent assistance together in one
            simple platform.
          </p>

          {/* ---------------- Symmetric CTA pair ---------------- */}
          <div className="gh-sym-actions mt-8">
            <Button size="lg" onClick={() => onTabChange('explore')}>
              Explore Healthcare
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => onTabChange('ai-assistant')}>
              <Bot className="h-4 w-4 text-medical-600" />
              Ask AI Assistant
            </Button>
          </div>

          {/* ---------------- Global search (centered, symmetric) ---------------- */}
          <div className="relative mx-auto mt-10 w-full max-w-2xl" id="gh-home-search">
            {showSkeleton ? (
              <SearchSkeleton />
            ) : (
              <div
                className={`relative flex items-center gap-2 rounded-2xl border bg-white p-2 shadow-soft transition-all duration-200 ${
                  focused
                    ? 'scale-[1.01] border-medical-300 shadow-lift'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Search className={`h-5 w-5 shrink-0 text-slate-400 ${focused ? 'text-medical-600' : ''}`} aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => window.setTimeout(() => setFocused(false), 180)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && grouped.length > 0) {
                      openResult(grouped[0].items[0]);
                    }
                    if (e.key === 'Escape') setFocused(false);
                  }}
                  placeholder="Search diseases, medicines, symptoms, lab tests, doctors, hospitals and more…"
                  aria-label="Search diseases, medicines, symptoms, lab tests, doctors, hospitals and more"
                  className="w-full bg-transparent px-2 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
                {supportSpeech && (
                  <button
                    type="button"
                    onClick={runVoice}
                    aria-label="Search by voice"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-medical-50 hover:text-medical-600"
                  >
                    <Mic className="h-4.5 w-4.5" />
                  </button>
                )}
                {query ? (
                  <button
                    type="button"
                    onClick={clear}
                    aria-label="Clear search"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <kbd className="hidden shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-400 sm:inline-flex">
                    <CornerDownLeft className="h-3 w-3" /> to search
                  </kbd>
                )}
              </div>
            )}

            {/* Popular categories — centered below the search field */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Popular:
              </span>
              {SUGGESTIONS.slice(0, 4).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => openSuggestion(s)}
                  className="gh-chip"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* ---------------- Search panel ---------------- */}
            {panelOpen && (
              <div className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift">
                {query.trim() ? (
                  grouped.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                      <p className="text-sm font-semibold text-slate-700">No results for “{query.trim()}”</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Try searching another healthcare topic — a disease, medicine, test or doctor.
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-[26rem] overflow-y-auto p-2">
                      {grouped.map((g) => (
                        <div key={g.type} className="mb-1">
                          <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {g.type}s · {g.items.length}
                          </p>
                          {g.items.map((hit) => (
                            <button
                              key={`${hit.type}-${hit.id}`}
                              type="button"
                              onClick={() => openResult(hit)}
                              className="group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-medical-50"
                            >
                              <div className="min-w-0">
                                <p className="truncate text-[13px] font-semibold text-slate-800 group-hover:text-medical-800">
                                  {hit.title}
                                </p>
                                {hit.subtitle && (
                                  <p className="truncate text-[11px] text-slate-500">{hit.subtitle}</p>
                                )}
                              </div>
                              <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-medical-600" />
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="p-3">
                    {recent.length > 0 && (
                      <div className="mb-2">
                        <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Recent searches
                        </p>
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
                    <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Trending topics
                    </p>
                    <div className="flex flex-wrap justify-center gap-1.5 px-3 pb-2 pt-1">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => openSuggestion(s)}
                          className="gh-chip"
                        >
                          <TrendingUp className="h-3 w-3 text-medical-500" />
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---------------- Symmetric trust stats (4 equal cards) ---------------- */}
          <div className="mt-16 w-full">
            <div className="gh-sym-grid gh-sym-grid-4">
              {[
                ['500+ health conditions', 'Clear, sourced disease guides'],
                ['400+ medicines', 'Safety, forms and precautions'],
                ['1,000 lab tests', 'Preparation and interpretation context'],
                ['Verified facility map', 'Hospitals, clinics and urgent care'],
              ].map(([stat, label]) => (
                <div key={stat} className="gh-sym-card">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-medical-50 text-medical-600">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-sm font-bold text-slate-900">{stat}</p>
                  <p className="mt-1 text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            {/* Educational disclaimer — centered footnote */}
            <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-medical-50/70 p-4 text-center">
              <p className="text-xs leading-relaxed text-medical-800">
                <span className="font-bold">Educational platform.</span> GlobalHealth helps you
                understand health information — it does not replace professional medical advice,
                diagnosis or emergency care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
