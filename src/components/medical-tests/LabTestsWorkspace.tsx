import React, { useState, useMemo, useEffect } from 'react';
import {
  FlaskConical,
  Search,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Filter,
  Layers,
  Upload,
  Scale,
  Bookmark,
  Clock,
  Activity,
  CheckCircle2,
  Stethoscope,
  Info,
  SlidersHorizontal,
  ArrowUpDown,
  FileText
} from 'lucide-react';
import { MedicalTest, NavigationTab } from '../../types';
import { ALL_LAB_TESTS, POPULAR_SEARCH_TAGS } from '../../data/medicalTests';
import { useLocalization } from '../../context/LocalizationContext';
import { SingleTestInterpretationModal } from './SingleTestInterpretationModal';
import { PanelInterpretationModal } from './PanelInterpretationModal';
import { ReportUploadModal } from './ReportUploadModal';
import { CompareTestsModal } from './CompareTestsModal';
import { MyLabHistoryDrawer, SavedLabRecord } from './MyLabHistoryDrawer';
import { MedicalTestDetailPage } from './MedicalTestDetailPage';

interface LabTestsWorkspaceProps {
  onNavigate?: (tab: NavigationTab) => void;
  onAskAI?: (prompt: string) => void;
  currentUser?: any;
}

const ITEMS_PER_PAGE = 24;

const CATEGORIES = [
  'All',
  'Hematology',
  'Clinical Chemistry',
  'Liver Function',
  'Kidney Function',
  'Endocrinology',
  'Diabetes',
  'Lipid Profile',
  'Cardiac',
  'Inflammation',
  'Immunology',
  'Infectious Disease',
  'Urinalysis',
  'Microbiology',
  'Vitamins & Nutrition',
  'Tumor Markers',
  'Genetic / Molecular',
  'Toxicology'
];

export const LabTestsWorkspace: React.FC<LabTestsWorkspaceProps> = ({
  onNavigate,
  onAskAI,
  currentUser
}) => {
  const { t, formatNumber } = useLocalization();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSpecimen, setSelectedSpecimen] = useState<string>('All');
  const [fastingFilter, setFastingFilter] = useState<'all' | 'fasting' | 'non-fasting'>('all');
  const [onlyPopular, setOnlyPopular] = useState(false);
  const [sortBy, setSortBy] = useState<'relevant' | 'az' | 'za' | 'category'>('relevant');
  const [isDoctorMode, setIsDoctorMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Active views / modals
  const [selectedTestForDetail, setSelectedTestForDetail] = useState<MedicalTest | null>(null);
  const [interpretingTest, setInterpretingTest] = useState<MedicalTest | null>(null);
  const [isPanelModalOpen, setIsPanelModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // Persistence State (Local Storage)
  const [savedTestIds, setSavedTestIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('globalhealth_saved_lab_tests');
      return saved ? JSON.parse(saved) : ['test-lab-1', 'test-lab-2'];
    } catch {
      return ['test-lab-1', 'test-lab-2'];
    }
  });

  const [historyRecords, setHistoryRecords] = useState<SavedLabRecord[]>(() => {
    try {
      const saved = localStorage.getItem('globalhealth_lab_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [compareTests, setCompareTests] = useState<MedicalTest[]>([]);

  // Hash-based deep link listener (#medical-tests/<id>)
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
      if (hash.startsWith('medical-tests/')) {
        const id = hash.replace('medical-tests/', '').trim();
        const found = ALL_LAB_TESTS.find(m => m.id === id);
        if (found) {
          setSelectedTestForDetail(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (hash === 'medical-tests') {
        setSelectedTestForDetail(null);
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const openDetail = (test: MedicalTest) => {
    setSelectedTestForDetail(test);
    if (window.location.hash.replace(/^#\/?/, '').split('?')[0] !== `medical-tests/${test.id}`) {
      window.location.hash = `#medical-tests/${test.id}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToCatalog = () => {
    setSelectedTestForDetail(null);
    if (window.location.hash.includes('medical-tests/')) {
      window.location.hash = '#medical-tests';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSaveTest = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedTestIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('globalhealth_saved_lab_tests', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleSaveToHistory = (record: {
    testId: string;
    testName: string;
    value: string;
    unit: string;
    status: string;
    date: string;
  }) => {
    const newRec: SavedLabRecord = {
      ...record,
      id: `hist-${Date.now()}`
    };
    setHistoryRecords(prev => {
      const next = [newRec, ...prev];
      try {
        localStorage.setItem('globalhealth_lab_history', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleToggleCompare = (test: MedicalTest, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompareTests(prev => {
      const exists = prev.some(t => t.id === test.id);
      if (exists) {
        return prev.filter(t => t.id !== test.id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare a maximum of 3 laboratory tests simultaneously.');
          return prev;
        }
        return [...prev, test];
      }
    });
  };

  // Comprehensive Filtering & Search Engine
  const filteredTests = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return ALL_LAB_TESTS.filter(t => {
      // 1. Search Query Match
      if (q) {
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesAbbrev = t.abbreviation ? t.abbreviation.toLowerCase().includes(q) : false;
        const matchesCommon = t.commonName ? t.commonName.toLowerCase().includes(q) : false;
        const matchesCategory = t.category.toLowerCase().includes(q);
        const matchesSub = t.subcategory ? t.subcategory.toLowerCase().includes(q) : false;
        const matchesPurpose = (t.clinicalPurpose || t.purpose || '').toLowerCase().includes(q);
        const matchesSpecimen = (t.specimenType || t.sampleType || '').toLowerCase().includes(q);
        const matchesAlt = t.alternativeNames ? t.alternativeNames.some(a => a.toLowerCase().includes(q)) : false;

        if (!(matchesName || matchesAbbrev || matchesCommon || matchesCategory || matchesSub || matchesPurpose || matchesSpecimen || matchesAlt)) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'All' && t.category !== selectedCategory) {
        return false;
      }

      // 3. Specimen Filter
      if (selectedSpecimen !== 'All') {
        const spec = (t.specimenType || t.sampleType || '').toLowerCase();
        if (!spec.includes(selectedSpecimen.toLowerCase())) {
          return false;
        }
      }

      // 4. Fasting Filter
      if (fastingFilter === 'fasting' && !t.fastingRequirement) return false;
      if (fastingFilter === 'non-fasting' && t.fastingRequirement) return false;

      // 5. Popular Filter
      if (onlyPopular && !t.popular) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'az') return a.name.localeCompare(b.name);
      if (sortBy === 'za') return b.name.localeCompare(a.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      // 'relevant' sorts popular first then alphabetically
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [searchTerm, selectedCategory, selectedSpecimen, fastingFilter, onlyPopular, sortBy]);

  // Reset page when filters change
  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredTests.length / ITEMS_PER_PAGE) || 1;
  const paginatedTests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTests, currentPage]);

  // If a test detail page is active, display it
  if (selectedTestForDetail) {
    return (
      <MedicalTestDetailPage
        test={selectedTestForDetail}
        onBack={backToCatalog}
        onNavigate={onNavigate}
        onAskAI={onAskAI}
        onOpenTest={(id) => {
          const next = ALL_LAB_TESTS.find(m => m.id === id);
          if (next) openDetail(next);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-6">

        {/* Global Action Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-md">
              <FlaskConical className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-700 font-bold text-xs uppercase tracking-wider">
                  GlobalHealth Reference
                </span>
                <span className="rounded-full bg-cyan-100 text-cyan-800 px-2 py-0.5 text-[10px] font-bold">
                  2,050+ Tests
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Clinical Laboratory Reference Workspace
              </h1>
            </div>
          </div>

          {/* Quick Utility Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDoctorMode(prev => !prev)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold border transition ${
                isDoctorMode
                  ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Stethoscope className="h-3.5 w-3.5" />
              {isDoctorMode ? 'Doctor Mode: ON' : 'Doctor Mode'}
            </button>

            <button
              type="button"
              onClick={() => setIsPanelModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <Layers className="h-3.5 w-3.5 text-indigo-600" />
              Interpret Panel
            </button>

            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <Upload className="h-3.5 w-3.5 text-teal-600" />
              Upload Report
            </button>

            <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs relative"
            >
              <Scale className="h-3.5 w-3.5 text-purple-600" />
              Compare
              {compareTests.length > 0 && (
                <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white">
                  {compareTests.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsHistoryDrawerOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-cyan-800 transition shadow-xs"
            >
              <Bookmark className="h-3.5 w-3.5" />
              My History
              {savedTestIds.length > 0 && (
                <span className="ml-1 rounded-full bg-cyan-900 px-1.5 py-0.2 text-[10px]">
                  {savedTestIds.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Hero Area */}
        <div className="rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-cyan-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-block rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-bold text-cyan-300 backdrop-blur-xs">
              Clinical Laboratory Reference + Automatic Interpretation
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Search and understand 2,000+ laboratory tests
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore verified reference intervals, specimen guidelines, physiological significance, and run automated interpretations tailored to your specific laboratory report bounds.
            </p>

            {/* Large Search Bar */}
            <div className="pt-2">
              <div className="relative w-full">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search test name, abbreviation (e.g. HbA1c, CBC, TSH, ALT, Creatinine, Ferritin)..."
                  className="w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md pl-12 pr-4 py-3 text-sm text-white placeholder:text-slate-400 focus:bg-white focus:text-slate-900 focus:outline-hidden shadow-inner transition"
                />
              </div>

              {/* Example Search Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <span className="text-[11px] text-slate-400 font-medium">Popular Searches:</span>
                {POPULAR_SEARCH_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSearchChange(tag)}
                    className="rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1 text-xs text-cyan-200 transition font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Most Important Clinical Rule Alert Banner */}
        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-950 shadow-2xs">
          <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-amber-950">Laboratory Analysis Principle:</span> Never assume that one reference interval fits every laboratory or analyzer manufacturer. The GlobalHealth interpreter prioritizes your printed report’s exact numerical limits, falling back to demographic adjustments (age, sex, pregnancy) and validated baseline reference data.
          </div>
        </div>

        {/* Main Content Layout: Filters Sidebar + Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Category Filter */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-cyan-600" /> Categories ({CATEGORIES.length - 1})
                </span>
                {selectedCategory !== 'All' && (
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('All')}
                    className="text-[10px] text-cyan-700 font-bold hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-1.5 text-xs text-left transition ${
                      selectedCategory === cat
                        ? 'bg-cyan-50 font-bold text-cyan-800'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    {selectedCategory === cat && <ChevronRight className="h-3.5 w-3.5 text-cyan-700 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Specimen & Fasting Attributes */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-100 pb-2">
                Specimen & Preparation
              </span>

              {/* Specimen Selector */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Specimen Type</label>
                <select
                  value={selectedSpecimen}
                  onChange={(e) => { setSelectedSpecimen(e.target.value); setCurrentPage(1); }}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800 bg-white"
                >
                  <option value="All">All Specimens</option>
                  <option value="Blood">Blood (Serum / Plasma / Whole)</option>
                  <option value="Urine">Urine</option>
                  <option value="Stool">Stool</option>
                  <option value="Swab">Swab / Culture</option>
                  <option value="Saliva">Saliva</option>
                </select>
              </div>

              {/* Fasting Toggle */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Fasting Requirement</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => { setFastingFilter('all'); setCurrentPage(1); }}
                    className={`py-1 text-center rounded-lg font-semibold transition ${
                      fastingFilter === 'all' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFastingFilter('fasting'); setCurrentPage(1); }}
                    className={`py-1 text-center rounded-lg font-semibold transition ${
                      fastingFilter === 'fasting' ? 'bg-white shadow-2xs text-cyan-800' : 'text-slate-500'
                    }`}
                  >
                    Fasting
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFastingFilter('non-fasting'); setCurrentPage(1); }}
                    className={`py-1 text-center rounded-lg font-semibold transition ${
                      fastingFilter === 'non-fasting' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    None
                  </button>
                </div>
              </div>

              {/* Popular Tests Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="popFilter"
                  checked={onlyPopular}
                  onChange={(e) => { setOnlyPopular(e.target.checked); setCurrentPage(1); }}
                  className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor="popFilter" className="text-xs font-medium text-slate-700 cursor-pointer">
                  High-Frequency Tests Only ⭐
                </label>
              </div>
            </div>

          </div>

          {/* Right Results Column */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Controls Bar: Counts, Sorting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-600">
                Showing <strong className="text-slate-900 font-bold">{paginatedTests.length}</strong> of{' '}
                <strong className="text-slate-900 font-bold">{filteredTests.length}</strong> clinical tests
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <ArrowUpDown className="h-3 w-3" /> Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-xl border border-slate-200 px-2.5 py-1 text-xs text-slate-800 bg-white focus:outline-hidden"
                >
                  <option value="relevant">Most Relevant</option>
                  <option value="az">A to Z</option>
                  <option value="za">Z to A</option>
                  <option value="category">By Category</option>
                </select>
              </div>
            </div>

            {/* Test Cards Grid */}
            {paginatedTests.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center space-y-3">
                <Search className="h-10 w-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No laboratory tests found</h3>
                <p className="text-xs text-slate-500">
                  Try broadening your search term or selecting "All" categories.
                </p>
                <button
                  type="button"
                  onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedSpecimen('All'); }}
                  className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-700 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedTests.map(test => {
                  const isSaved = savedTestIds.includes(test.id);
                  const isCompared = compareTests.some(t => t.id === test.id);

                  return (
                    <div
                      key={test.id}
                      onClick={() => openDetail(test)}
                      className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 hover:border-cyan-400 hover:shadow-md transition cursor-pointer relative"
                    >
                      {/* Top Badges */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="rounded-lg bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-800 border border-cyan-100">
                            {test.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => handleToggleCompare(test, e)}
                              className={`p-1 rounded-lg transition ${
                                isCompared ? 'text-purple-600 bg-purple-50' : 'text-slate-300 hover:text-slate-600'
                              }`}
                              title={isCompared ? 'Remove from compare' : 'Add to compare'}
                            >
                              <Scale className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => toggleSaveTest(test.id, e)}
                              className={`p-1 rounded-lg transition ${
                                isSaved ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-600'
                              }`}
                              title={isSaved ? 'Remove bookmark' : 'Bookmark test'}
                            >
                              <Bookmark className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Title & Abbreviation */}
                        <div>
                          <div className="flex items-baseline gap-2">
                            <h3 className="text-sm font-black text-slate-900 group-hover:text-cyan-700 transition">
                              {test.name}
                            </h3>
                            {test.abbreviation && (
                              <span className="text-[10px] font-bold text-cyan-600 uppercase font-mono">
                                ({test.abbreviation})
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                            {test.clinicalPurpose || test.purpose}
                          </p>
                        </div>
                      </div>

                      {/* Middle Reference Pill */}
                      <div className="my-3 rounded-xl bg-slate-50 p-2 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-slate-500">Standard Interval:</span>
                          <span className="font-mono font-bold text-cyan-800 truncate max-w-[150px]">
                            {test.referenceRange || test.normalRange}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>Specimen: {test.specimenType || test.sampleType}</span>
                          <span>⏱️ {test.turnaroundTime || test.timeToResults}</span>
                        </div>
                      </div>

                      {/* Bottom Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInterpretingTest(test);
                          }}
                          className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-cyan-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-cyan-700 transition shadow-2xs"
                        >
                          <Activity className="h-3.5 w-3.5" />
                          Interpret Result
                        </button>
                        <button
                          type="button"
                          onClick={() => openDetail(test)}
                          className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          Details →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 bg-white p-4 rounded-2xl shadow-2xs mt-6">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                <div className="text-xs text-slate-600">
                  Page <strong className="text-slate-900">{currentPage}</strong> of{' '}
                  <strong className="text-slate-900">{totalPages}</strong>
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Single Test Automatic Interpretation Modal */}
      {interpretingTest && (
        <SingleTestInterpretationModal
          test={interpretingTest}
          isOpen={!!interpretingTest}
          onClose={() => setInterpretingTest(null)}
          onSaveToHistory={handleSaveToHistory}
          onAskAI={onAskAI}
        />
      )}

      {/* Multi-Test Panel Interpretation Modal */}
      <PanelInterpretationModal
        isOpen={isPanelModalOpen}
        onClose={() => setIsPanelModalOpen(false)}
        onAskAI={onAskAI}
      />

      {/* Lab Report Upload Modal */}
      <ReportUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        availableTests={ALL_LAB_TESTS}
        onAskAI={onAskAI}
      />

      {/* Test Comparison Modal */}
      <CompareTestsModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        tests={compareTests}
        onRemoveTest={(id) => setCompareTests(prev => prev.filter(t => t.id !== id))}
        onSelectTest={(test) => openDetail(test)}
      />

      {/* My Saved Tests & History Drawer */}
      <MyLabHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        savedTestIds={savedTestIds}
        historyRecords={historyRecords}
        allTests={ALL_LAB_TESTS}
        onOpenTest={(t) => openDetail(t)}
        onRemoveSavedTest={(id) => toggleSaveTest(id)}
        onClearHistory={() => {
          setHistoryRecords([]);
          try { localStorage.removeItem('globalhealth_lab_history'); } catch {}
        }}
        onAskAI={onAskAI}
      />

    </div>
  );
};
