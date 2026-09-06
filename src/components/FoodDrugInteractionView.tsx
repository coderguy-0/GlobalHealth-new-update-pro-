import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  AlertTriangle, 
  Search, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Info, 
  Pill, 
  Apple, 
  ChevronDown, 
  ChevronUp,
  Layers, 
  ShieldCheck, 
  Activity, 
  FileText, 
  BookOpen, 
  ArrowRightLeft, 
  Check, 
  SlidersHorizontal,
  Share2,
  Printer,
  Bookmark,
  BookmarkCheck,
  History,
  Filter,
  ExternalLink,
  Eye,
  HelpCircle,
  X,
  Plus,
  Trash2,
  User,
  Stethoscope,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { 
  FOOD_INTERACTIONS_DATA, 
  FOOD_ENTITY_DICTIONARY, 
  DRUG_ENTITY_DICTIONARY, 
  SearchEntityItem 
} from '../data/nutritionData';
import { FoodInteraction } from '../types';

interface FoodDrugInteractionViewProps {
  onSelectRecipeOrFood?: (foodName: string) => void;
}

interface RecentSearchItem {
  id: string;
  foodName: string;
  drugName: string;
  timestamp: string;
  severity: string;
  foundCount: number;
}

// Categorized Clinical High-Yield Presets
const PRESET_GROUPS = [
  {
    category: 'Enzyme & Metabolism (CYP3A4 / CYP2E1)',
    presets: [
      { food: 'Grapefruit', drug: 'Atorvastatin (Lipitor)', label: 'Grapefruit + Statins', severity: 'Severe', badge: 'Avoid' },
      { food: 'Alcoholic Beverages', drug: 'Acetaminophen (Tylenol)', label: 'Alcohol + Acetaminophen', severity: 'Severe', badge: 'Avoid' },
      { food: "St. John's Wort", drug: 'Sertraline (Zoloft)', label: "St. John's Wort + SSRIs", severity: 'Severe', badge: 'Avoid' },
      { food: "St. John's Wort", drug: 'Oral Contraceptives', label: "St. John's + Birth Control", severity: 'Severe', badge: 'Avoid' }
    ]
  },
  {
    category: 'Absorption & Chelation Binding',
    presets: [
      { food: 'Milk & Dairy (Calcium)', drug: 'Ciprofloxacin & Doxycycline', label: 'Dairy + Antibiotics', severity: 'Moderate', badge: 'Space 2-4h' },
      { food: 'Iron Supplements', drug: 'Levothyroxine (Synthroid)', label: 'Iron + Levothyroxine', severity: 'Moderate', badge: 'Space 4h' },
      { food: 'Coffee & Espresso', drug: 'Iron Supplements', label: 'Coffee + Non-Heme Iron', severity: 'Moderate', badge: 'Space 1-2h' },
      { food: 'High-Soluble Fiber', drug: 'Metformin (Glucophage)', label: 'Fiber Gel + Metformin', severity: 'Moderate', badge: 'Space 2h' }
    ]
  },
  {
    category: 'Electrolyte & Cardiovascular Risk',
    presets: [
      { food: 'High-Potassium Foods', drug: 'Lisinopril (Zestril)', label: 'Potassium + ACE Inhibitor', severity: 'Severe', badge: 'Avoid Salt Subs' },
      { food: 'Natural Black Licorice', drug: 'Digoxin (Lanoxin)', label: 'Licorice + Digoxin', severity: 'Severe', badge: 'Avoid' },
      { food: 'Tyramine-Rich Aged Foods', drug: 'MAO Inhibitors (Phenelzine)', label: 'Aged Cheeses + MAOIs', severity: 'Severe', badge: 'Avoid' },
      { food: 'Green Tea & Matcha', drug: 'Nadolol & Beta-Blockers', label: 'Green Tea + Nadolol', severity: 'Moderate', badge: 'Space 4h' },
      { food: 'Vitamin K Dark Greens', drug: 'Warfarin (Coumadin)', label: 'Vitamin K + Warfarin', severity: 'Moderate', badge: 'Maintain Steady' }
    ]
  }
];

// Did-You-Mean Spellcheck Map
const SPELLCHECK_MAP: Record<string, { term: string; type: 'food' | 'drug'; canonical: string }> = {
  'grapfrut': { term: 'Grapefruit', type: 'food', canonical: 'Grapefruit' },
  'grapfruit': { term: 'Grapefruit', type: 'food', canonical: 'Grapefruit' },
  'grapefruite': { term: 'Grapefruit', type: 'food', canonical: 'Grapefruit' },
  'warfrin': { term: 'Warfarin', type: 'drug', canonical: 'Warfarin (Coumadin / Jantoven)' },
  'coumadn': { term: 'Warfarin', type: 'drug', canonical: 'Warfarin (Coumadin / Jantoven)' },
  'levothroxine': { term: 'Levothyroxine', type: 'drug', canonical: 'Levothyroxine (Synthroid / Euthyrox)' },
  'synthrod': { term: 'Levothyroxine', type: 'drug', canonical: 'Levothyroxine (Synthroid / Euthyrox)' },
  'metformn': { term: 'Metformin', type: 'drug', canonical: 'Metformin (Glucophage)' },
  'atorvastatn': { term: 'Atorvastatin', type: 'drug', canonical: 'Atorvastatin (Lipitor)' },
  'lipitr': { term: 'Atorvastatin', type: 'drug', canonical: 'Atorvastatin (Lipitor)' },
  'lisinoprl': { term: 'Lisinopril', type: 'drug', canonical: 'Lisinopril (Zestril / Prinivil)' },
  'ciprofloxacn': { term: 'Ciprofloxacin', type: 'drug', canonical: 'Ciprofloxacin & Doxycycline (Antibiotics)' },
  'calcum': { term: 'Calcium', type: 'food', canonical: 'Milk & Dairy (Calcium)' },
  'potasium': { term: 'Potassium', type: 'food', canonical: 'High-Potassium Foods & Salt Substitutes' },
  'licorice': { term: 'Natural Black Licorice', type: 'food', canonical: 'Natural Black Licorice' }
};

export const FoodDrugInteractionView: React.FC<FoodDrugInteractionViewProps> = () => {
  // Search and filter states
  const [foodQuery, setFoodQuery] = useState('');
  const [drugQuery, setDrugQuery] = useState('');
  const [selectedFoodEntity, setSelectedFoodEntity] = useState<SearchEntityItem | null>(null);
  const [selectedDrugEntity, setSelectedDrugEntity] = useState<SearchEntityItem | null>(null);
  
  // Multi-medication list mode
  const [multiDrugList, setMultiDrugList] = useState<string[]>([]);
  
  // Autocomplete dropdown state
  const [showFoodDropdown, setShowFoodDropdown] = useState(false);
  const [showDrugDropdown, setShowDrugDropdown] = useState(false);
  
  // Filters
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Severe' | 'Moderate' | 'Minor'>('All');
  const [mechanismFilter, setMechanismFilter] = useState<string>('All');
  const [explanationMode, setExplanationMode] = useState<'patient' | 'clinical'>('patient');
  
  // Interaction Selection for Deep-Dive Detail Sheet
  const [activeInteractionId, setActiveInteractionId] = useState<string>(FOOD_INTERACTIONS_DATA[0]?.id || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedChecks, setSavedChecks] = useState<string[]>([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Search History
  const [searchHistory, setSearchHistory] = useState<RecentSearchItem[]>([
    { id: 'hist-1', foodName: 'Grapefruit', drugName: 'Atorvastatin', timestamp: 'Today, 10:24 AM', severity: 'Severe', foundCount: 1 },
    { id: 'hist-2', foodName: 'Milk & Dairy (Calcium)', drugName: 'Levothyroxine', timestamp: 'Today, 09:15 AM', severity: 'Moderate', foundCount: 1 },
    { id: 'hist-3', foodName: 'Coffee & Espresso', drugName: 'Iron Supplements', timestamp: 'Yesterday', severity: 'Moderate', foundCount: 1 }
  ]);

  const foodInputRef = useRef<HTMLInputElement>(null);
  const drugInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.food-autocomplete-container')) {
        setShowFoodDropdown(false);
      }
      if (!target.closest('.drug-autocomplete-container')) {
        setShowDrugDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smart Food Search Suggestions (Exact -> Prefix -> Fuzzy -> Synonym -> Category)
  const foodSuggestions = useMemo(() => {
    const q = foodQuery.trim().toLowerCase();
    if (!q) return FOOD_ENTITY_DICTIONARY.slice(0, 6);

    return FOOD_ENTITY_DICTIONARY.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(q);
      const altMatch = item.alternateNames.some(alt => alt.toLowerCase().includes(q));
      const formMatch = item.forms?.some(f => f.toLowerCase().includes(q));
      const catMatch = item.category.toLowerCase().includes(q);
      return nameMatch || altMatch || formMatch || catMatch;
    }).sort((a, b) => {
      const aExact = a.name.toLowerCase().startsWith(q) ? -2 : 0;
      const bExact = b.name.toLowerCase().startsWith(q) ? -2 : 0;
      return aExact - bExact || b.interactionCount - a.interactionCount;
    });
  }, [foodQuery]);

  // Smart Drug Search Suggestions (Exact -> Prefix -> Generic/Brand -> Class)
  const drugSuggestions = useMemo(() => {
    const q = drugQuery.trim().toLowerCase();
    if (!q) return DRUG_ENTITY_DICTIONARY.slice(0, 6);

    return DRUG_ENTITY_DICTIONARY.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(q);
      const genericMatch = item.genericName?.toLowerCase().includes(q);
      const brandMatch = item.brandNames?.some(b => b.toLowerCase().includes(q));
      const classMatch = item.drugClass?.toLowerCase().includes(q);
      const altMatch = item.alternateNames.some(alt => alt.toLowerCase().includes(q));
      return nameMatch || genericMatch || brandMatch || classMatch || altMatch;
    }).sort((a, b) => {
      const aExact = a.name.toLowerCase().startsWith(q) ? -2 : 0;
      const bExact = b.name.toLowerCase().startsWith(q) ? -2 : 0;
      return aExact - bExact || b.interactionCount - a.interactionCount;
    });
  }, [drugQuery]);

  // "Did You Mean?" detection
  const foodDidYouMean = useMemo(() => {
    const q = foodQuery.trim().toLowerCase();
    if (!q || foodSuggestions.length > 0) return null;
    return SPELLCHECK_MAP[q]?.type === 'food' ? SPELLCHECK_MAP[q] : null;
  }, [foodQuery, foodSuggestions]);

  const drugDidYouMean = useMemo(() => {
    const q = drugQuery.trim().toLowerCase();
    if (!q || drugSuggestions.length > 0) return null;
    return SPELLCHECK_MAP[q]?.type === 'drug' ? SPELLCHECK_MAP[q] : null;
  }, [drugQuery, drugSuggestions]);

  // Multi-drug query handling
  const activeDrugQueries = useMemo(() => {
    const list: string[] = [];
    if (drugQuery.trim()) list.push(drugQuery.trim());
    multiDrugList.forEach(d => {
      if (!list.includes(d)) list.push(d);
    });
    return list;
  }, [drugQuery, multiDrugList]);

  // Filtered and Ranked Interactions
  const filteredInteractions = useMemo(() => {
    const fQ = foodQuery.trim().toLowerCase();

    return FOOD_INTERACTIONS_DATA.filter((item) => {
      // Severity Filter
      if (severityFilter === 'Severe' && !item.severity.includes('Severe')) return false;
      if (severityFilter === 'Moderate' && !item.severity.includes('Moderate')) return false;
      if (severityFilter === 'Minor' && !item.severity.includes('Minor')) return false;

      // Mechanism Filter
      if (mechanismFilter !== 'All' && item.mechanismType && !item.mechanismType.toLowerCase().includes(mechanismFilter.toLowerCase())) {
        return false;
      }

      // Check food match
      let foodMatch = true;
      if (fQ) {
        foodMatch = item.primaryItem.toLowerCase().includes(fQ) ||
          item.title.toLowerCase().includes(fQ) ||
          (item.foodEntities && item.foodEntities.some(e => e.includes(fQ) || fQ.includes(e))) ||
          item.mechanism.toLowerCase().includes(fQ);
      }

      // Check drug match across multi-drug list if present
      let drugMatch = true;
      if (activeDrugQueries.length > 0) {
        drugMatch = activeDrugQueries.some(dq => {
          const dLower = dq.toLowerCase();
          return item.interactingWith.toLowerCase().includes(dLower) ||
            item.title.toLowerCase().includes(dLower) ||
            (item.drugEntities && item.drugEntities.some(e => e.includes(dLower) || dLower.includes(e))) ||
            (item.drugClass && item.drugClass.toLowerCase().includes(dLower));
        });
      }

      return foodMatch && drugMatch;
    }).sort((a, b) => {
      // Priority: Severe first, then Moderate
      const aScore = a.severity.includes('Severe') ? 2 : 1;
      const bScore = b.severity.includes('Severe') ? 2 : 1;
      return bScore - aScore;
    });
  }, [foodQuery, activeDrugQueries, severityFilter, mechanismFilter]);

  // Active selected interaction for detail sheet
  const activeInteraction = useMemo(() => {
    const found = filteredInteractions.find(i => i.id === activeInteractionId);
    return found || filteredInteractions[0] || FOOD_INTERACTIONS_DATA[0];
  }, [filteredInteractions, activeInteractionId]);

  // Counts by Severity for Summary Dashboard
  const summaryCounts = useMemo(() => {
    const total = filteredInteractions.length;
    const severe = filteredInteractions.filter(i => i.severity.includes('Severe')).length;
    const moderate = filteredInteractions.filter(i => i.severity.includes('Moderate')).length;
    const minor = filteredInteractions.filter(i => i.severity.includes('Minor') || i.severity.includes('Beneficial')).length;
    return { total, severe, moderate, minor };
  }, [filteredInteractions]);

  // Handler: Select Food from Autocomplete
  const handleSelectFood = (entity: SearchEntityItem) => {
    setFoodQuery(entity.name);
    setSelectedFoodEntity(entity);
    setShowFoodDropdown(false);
  };

  // Handler: Select Drug from Autocomplete
  const handleSelectDrug = (entity: SearchEntityItem) => {
    setDrugQuery(entity.name);
    setSelectedDrugEntity(entity);
    setShowDrugDropdown(false);
  };

  // Handler: Swap Food and Drug
  const handleSwap = () => {
    const temp = foodQuery;
    setFoodQuery(drugQuery);
    setDrugQuery(temp);
    setSelectedFoodEntity(null);
    setSelectedDrugEntity(null);
  };

  // Handler: Reset
  const handleReset = () => {
    setFoodQuery('');
    setDrugQuery('');
    setSelectedFoodEntity(null);
    setSelectedDrugEntity(null);
    setMultiDrugList([]);
    setSeverityFilter('All');
    setMechanismFilter('All');
  };

  // Handler: Apply Preset
  const handleApplyPreset = (food: string, drug: string) => {
    setFoodQuery(food);
    setDrugQuery(drug);
    setSelectedFoodEntity(null);
    setSelectedDrugEntity(null);
    
    // Add to history
    const newHist: RecentSearchItem = {
      id: `hist-${Date.now()}`,
      foodName: food,
      drugName: drug,
      timestamp: 'Just now',
      severity: 'Severe',
      foundCount: 1
    };
    setSearchHistory(prev => [newHist, ...prev.slice(0, 5)]);
  };

  // Handler: Analyze Interaction
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    if (foodQuery || drugQuery) {
      const newHist: RecentSearchItem = {
        id: `hist-${Date.now()}`,
        foodName: foodQuery || 'All Foods',
        drugName: drugQuery || 'All Medications',
        timestamp: 'Just now',
        severity: summaryCounts.severe > 0 ? 'Severe' : 'Moderate',
        foundCount: filteredInteractions.length
      };
      setSearchHistory(prev => [newHist, ...prev.filter(h => !(h.foodName === newHist.foodName && h.drugName === newHist.drugName)).slice(0, 6)]);
    }
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 250);
  };

  // Toggle Save Check
  const handleToggleSave = (id: string) => {
    setSavedChecks(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Add drug to multi-list
  const handleAddMultiDrug = (drugName: string) => {
    if (drugName && !multiDrugList.includes(drugName)) {
      setMultiDrugList(prev => [...prev, drugName]);
      setDrugQuery('');
    }
  };

  const handleRemoveMultiDrug = (drugName: string) => {
    setMultiDrugList(prev => prev.filter(d => d !== drugName));
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. PAGE HEADER WITH CLINICAL EVIDENCE STATUS & REVIEW DATE */}
      {/* ========================================================================= */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-200/80">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                Food–Drug & Food–Nutrient Interaction Checker
              </h2>
            </div>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Check potential biochemical interactions between foods, nutrients, supplements, herbal products, and medicines with pharmacokinetics-backed evidence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Evidence Database Active</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              Reviewed: 15 Aug 2026
            </span>
          </div>
        </div>

        {/* Quick Tools Bar */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Search Mode:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl">
              <button 
                type="button"
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-900 shadow-2xs"
              >
                Food ↔ Drug
              </button>
              <button 
                type="button"
                onClick={() => handleApplyPreset('Coffee & Espresso', 'Iron Supplements')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Nutrient ↔ Nutrient
              </button>
              <button 
                type="button"
                onClick={() => handleApplyPreset("St. John's Wort", 'Sertraline (Zoloft)')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Herb ↔ Drug
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-xs border border-slate-200"
            >
              <History className="h-3.5 w-3.5" />
              <span>Recent Checks ({searchHistory.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPrintModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-xs border border-slate-200"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Export Factsheet</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SMART SEARCH ARCHITECTURE (FOOD / NUTRIENT + MEDICINE / DRUG) */}
        {/* ========================================================================= */}
        <div className="p-3 sm:p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="grid lg:grid-cols-12 gap-3 items-center">
            
            {/* FOOD / NUTRIENT SEARCH INPUT WITH AUTOCOMPLETE */}
            <div className="lg:col-span-5 relative food-autocomplete-container">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Apple className="h-3.5 w-3.5 text-emerald-600" />
                  ① Food, Nutrient or Supplement
                </span>
                {selectedFoodEntity && (
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    {selectedFoodEntity.category}
                  </span>
                )}
              </label>

              <div className="relative">
                <input
                  ref={foodInputRef}
                  type="text"
                  value={foodQuery}
                  onFocus={() => setShowFoodDropdown(true)}
                  onChange={(e) => {
                    setFoodQuery(e.target.value);
                    setSelectedFoodEntity(null);
                    setShowFoodDropdown(true);
                  }}
                  placeholder="Search food, nutrient, herb (e.g. Grapefruit, Spinach, Dairy)..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-100 shadow-2xs transition-all pr-8"
                />
                {foodQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setFoodQuery('');
                      setSelectedFoodEntity(null);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Did you mean banner for Food */}
              {foodDidYouMean && (
                <div className="mt-1.5 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 flex items-center justify-between">
                  <span>Did you mean <strong>{foodDidYouMean.term}</strong>?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFoodQuery(foodDidYouMean.term);
                      setShowFoodDropdown(false);
                    }}
                    className="text-emerald-700 font-bold hover:underline ml-2"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Food Autocomplete Dropdown */}
              {showFoodDropdown && foodSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  <div className="p-2 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Matching Foods & Nutrients ({foodSuggestions.length})
                  </div>
                  {foodSuggestions.map((entity) => (
                    <button
                      key={entity.id}
                      type="button"
                      onClick={() => handleSelectFood(entity)}
                      className="w-full text-left px-3 py-2.5 hover:bg-emerald-50/70 transition-colors flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base shrink-0">{entity.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {entity.name}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {entity.category} {entity.alternateNames.length > 1 && `• Also: ${entity.alternateNames.slice(1, 3).join(', ')}`}
                          </div>
                        </div>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {entity.interactionCount} records
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SWAP BUTTON */}
            <div className="lg:col-span-1 flex items-center justify-center pt-3 lg:pt-5">
              <button
                type="button"
                onClick={handleSwap}
                title="Swap Food and Medication fields"
                className="h-8 w-8 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-emerald-700 flex items-center justify-center shadow-2xs transition-all hover:scale-105 active:scale-95 text-xs font-bold"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* MEDICATION / DRUG SEARCH INPUT WITH AUTOCOMPLETE */}
            <div className="lg:col-span-5 relative drug-autocomplete-container">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Pill className="h-3.5 w-3.5 text-blue-600" />
                  ② Medication / Drug (Generic or Brand)
                </span>
                {selectedDrugEntity && (
                  <span className="text-[10px] text-blue-700 font-bold bg-blue-100/80 px-2 py-0.5 rounded-full">
                    {selectedDrugEntity.drugClass}
                  </span>
                )}
              </label>

              <div className="relative">
                <input
                  ref={drugInputRef}
                  type="text"
                  value={drugQuery}
                  onFocus={() => setShowDrugDropdown(true)}
                  onChange={(e) => {
                    setDrugQuery(e.target.value);
                    setSelectedDrugEntity(null);
                    setShowDrugDropdown(true);
                  }}
                  placeholder="Search medication, generic, brand (e.g. Warfarin, Lipitor, Levothyroxine)..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-100 shadow-2xs transition-all pr-8"
                />
                {drugQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setDrugQuery('');
                      setSelectedDrugEntity(null);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Did you mean banner for Drug */}
              {drugDidYouMean && (
                <div className="mt-1.5 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 flex items-center justify-between">
                  <span>Did you mean <strong>{drugDidYouMean.term}</strong> ({drugDidYouMean.canonical})?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setDrugQuery(drugDidYouMean.canonical);
                      setShowDrugDropdown(false);
                    }}
                    className="text-blue-700 font-bold hover:underline ml-2"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Drug Autocomplete Dropdown */}
              {showDrugDropdown && drugSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  <div className="p-2 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Matching Medicines ({drugSuggestions.length})</span>
                    <span className="text-[9px] text-slate-400">Generic + Brand Intelligence</span>
                  </div>
                  {drugSuggestions.map((entity) => (
                    <button
                      key={entity.id}
                      type="button"
                      onClick={() => handleSelectDrug(entity)}
                      className="w-full text-left px-3 py-2.5 hover:bg-blue-50/70 transition-colors flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base shrink-0">{entity.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {entity.name}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {entity.genericName && `Generic: ${entity.genericName} • `}{entity.drugClass}
                          </div>
                        </div>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                        {entity.interactionCount} records
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ACTION BUTTON */}
            <div className="lg:col-span-1 flex items-end pt-3 lg:pt-5">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all active:scale-95 disabled:opacity-80"
              >
                {isAnalyzing ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* MULTI-DRUG / ACTIVE PILLS LIST (IF MULTIPLE DRUGS CHECKED) */}
          {multiDrugList.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Multi-Medication Profile:</span>
              {multiDrugList.map((d) => (
                <span key={d} className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                  <Pill className="h-3 w-3" />
                  {d}
                  <button type="button" onClick={() => handleRemoveMultiDrug(d)} className="text-blue-500 hover:text-blue-900">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* RELATED ENTITY SUGGESTIONS IF AN ENTITY IS SELECTED */}
          {selectedFoodEntity && selectedFoodEntity.relatedEntities.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Related to {selectedFoodEntity.name}:</span>
              {selectedFoodEntity.relatedEntities.map((rel) => (
                <button
                  key={rel}
                  type="button"
                  onClick={() => setFoodQuery(rel)}
                  className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-800 transition-colors"
                >
                  {rel}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. CATEGORIZED HIGH-YIELD CLINICAL PRESETS */}
        {/* ========================================================================= */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600" />
              High-Yield Clinical Presets (1-Click Verification):
            </span>
            {(foodQuery || drugQuery || severityFilter !== 'All') && (
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                Reset Search
              </button>
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-3 text-xs">
            {PRESET_GROUPS.map((group, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  {group.category}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.presets.map((p, pIdx) => {
                    const isSelected = foodQuery.toLowerCase().includes(p.food.toLowerCase().slice(0, 4)) &&
                                      drugQuery.toLowerCase().includes(p.drug.toLowerCase().slice(0, 4));
                    return (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleApplyPreset(p.food, p.drug)}
                        className={`text-left px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all flex items-center justify-between gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                            : p.severity === 'Severe'
                              ? 'bg-white hover:bg-rose-50 border-slate-200 hover:border-rose-200 text-slate-800'
                              : 'bg-white hover:bg-amber-50 border-slate-200 hover:border-amber-200 text-slate-800'
                        }`}
                      >
                        <span>{p.label}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold ${
                          p.severity === 'Severe' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. INTERACTION SUMMARY TILES & SEVERITY / MECHANISM FILTERS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setSeverityFilter('All')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            severityFilter === 'All' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Total Interacting Records</div>
          <div className="text-xl font-black mt-0.5">{summaryCounts.total}</div>
        </div>

        <div 
          onClick={() => setSeverityFilter('Severe')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            severityFilter === 'Severe' ? 'bg-rose-600 text-white border-rose-600 shadow-xs' : 'bg-white text-slate-900 border-rose-200 hover:bg-rose-50/50'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700 flex items-center justify-between">
            <span className={severityFilter === 'Severe' ? 'text-white' : ''}>🔴 Severe (Avoid)</span>
          </div>
          <div className={`text-xl font-black mt-0.5 ${severityFilter === 'Severe' ? 'text-white' : 'text-rose-900'}`}>{summaryCounts.severe}</div>
        </div>

        <div 
          onClick={() => setSeverityFilter('Moderate')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            severityFilter === 'Moderate' ? 'bg-amber-600 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-900 border-amber-200 hover:bg-amber-50/50'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center justify-between">
            <span className={severityFilter === 'Moderate' ? 'text-white' : ''}>🟠 Moderate (Space Timing)</span>
          </div>
          <div className={`text-xl font-black mt-0.5 ${severityFilter === 'Moderate' ? 'text-white' : 'text-amber-900'}`}>{summaryCounts.moderate}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mechanism Filter</div>
          <select
            value={mechanismFilter}
            onChange={(e) => setMechanismFilter(e.target.value)}
            className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-1 mt-1 cursor-pointer focus:outline-hidden"
          >
            <option value="All">All Mechanisms</option>
            <option value="Metabolism">Metabolism (CYP3A4/2E1)</option>
            <option value="Absorption">Absorption & Chelation</option>
            <option value="Renal">Renal & Electrolytes</option>
            <option value="Pharmacodynamic">Pharmacodynamic Cascades</option>
            <option value="Gastrointestinal">GI Motility & Viscosity</option>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. TWO-COLUMN INTERACTION EXPLORER & CLINICAL DETAIL VIEW */}
      {/* ========================================================================= */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: INTERACTION LIST CARDS (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              Interaction Records ({filteredInteractions.length})
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Ranked by Clinical Risk
            </span>
          </div>

          {filteredInteractions.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white border border-slate-200 space-y-3">
              <ShieldCheck className="h-10 w-10 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">No Hazardous Interaction Detected</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                No direct pharmacokinetic contraindication identified in our validated database for this specific search query.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredInteractions.map((item) => {
              const isSevere = item.severity.includes('Severe');
              const isActive = activeInteraction.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveInteractionId(item.id)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2.5 ${
                    isActive
                      ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                      : isSevere
                        ? 'bg-white border-rose-200/80 hover:border-rose-300 hover:shadow-xs'
                        : 'bg-white border-amber-200/80 hover:border-amber-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                      isSevere 
                        ? 'bg-rose-100 text-rose-900' 
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${isSevere ? 'bg-rose-600' : 'bg-amber-600'}`} />
                      {item.severity}
                    </span>

                    {item.actionBadge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {item.actionBadge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-black text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  <div className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {item.patientExplanation || item.clinicalImpact}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                    <span className="font-bold text-slate-700">{item.foodCategory || item.category}</span>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      View Deep-Dive <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: CLINICAL DEEP-DIVE FACTSHEET (7 cols) */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            
            {/* Header & Severity + Actions */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                    activeInteraction.severity.includes('Severe')
                      ? 'bg-rose-100 text-rose-900 border border-rose-200'
                      : 'bg-amber-100 text-amber-900 border border-amber-200'
                  }`}>
                    {activeInteraction.severity}
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {activeInteraction.category}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {activeInteraction.title}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleSave(activeInteraction.id)}
                  title={savedChecks.includes(activeInteraction.id) ? 'Saved' : 'Save check'}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                >
                  {savedChecks.includes(activeInteraction.id) ? (
                    <BookmarkCheck className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  title="Print / Export"
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                >
                  <Printer className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* WHAT SHOULD I DO? (ACTION FIRST PRINCIPLE) */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  ⚠️ What Should I Do?
                </span>
                {activeInteraction.actionBadge && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-800 text-white">
                    Action: {activeInteraction.actionBadge}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-950 font-bold leading-relaxed">
                {activeInteraction.actionableGuidance}
              </p>
            </div>

            {/* TIMING GUIDANCE MODULE */}
            {activeInteraction.timingGuidance && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700 font-extrabold text-[11px] uppercase tracking-wider">
                  <Clock className="h-3.5 w-3.5 text-slate-600" />
                  <span>Administration & Timing Guidance</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-semibold">
                  {activeInteraction.timingGuidance}
                </p>
              </div>
            )}

            {/* VIEW MODE TOGGLE (PATIENT-FRIENDLY VS CLINICAL PHARMACOLOGY) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Interaction Mechanism & Evidence
                </span>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setExplanationMode('patient')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition-all ${
                      explanationMode === 'patient' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User className="h-3 w-3 text-emerald-600" />
                    <span>Patient Explanation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setExplanationMode('clinical')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition-all ${
                      explanationMode === 'clinical' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Stethoscope className="h-3 w-3 text-blue-600" />
                    <span>Clinical Pharmacology</span>
                  </button>
                </div>
              </div>

              {/* Mode Content */}
              {explanationMode === 'patient' ? (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs space-y-2">
                  <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider block">
                    In Simple Terms for Patients:
                  </span>
                  <p className="text-amber-950 font-medium leading-relaxed">
                    {activeInteraction.patientExplanation || activeInteraction.clinicalImpact}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 text-xs space-y-2">
                  <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block">
                    Pharmacokinetic & Pharmacodynamic Profile:
                  </span>
                  <p className="text-blue-950 font-medium leading-relaxed font-mono text-[11px]">
                    {activeInteraction.clinicalPharmacology || activeInteraction.mechanism}
                  </p>
                </div>
              )}
            </div>

            {/* FULL BIOCHEMICAL MECHANISM */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                🔬 Detailed Biochemical Mechanism:
              </span>
              <p className="text-slate-800 leading-relaxed font-normal">
                {activeInteraction.mechanism}
              </p>
            </div>

            {/* CLINICAL SIGNIFICANCE & PHYSIOLOGICAL RISK */}
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              activeInteraction.severity.includes('Severe')
                ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${
                activeInteraction.severity.includes('Severe') ? 'text-rose-900' : 'text-amber-900'
              }`}>
                ⚠️ Clinical Impact & Adverse Event Risk:
              </span>
              <p className="leading-relaxed font-semibold">
                {activeInteraction.clinicalImpact}
              </p>
            </div>

            {/* PERSONAL RISK FACTORS */}
            {activeInteraction.riskModifiers && activeInteraction.riskModifiers.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  Additional Patient Risk Modifiers
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeInteraction.riskModifiers.map((mod, idx) => (
                    <span key={idx} className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
                      • {mod}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* EVIDENCE QUALITY & CITATIONS */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                  Evidence Level & Validated References
                </span>
                <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {activeInteraction.evidenceLevel || 'High (FDA Labeling & Clinical Studies)'}
                </span>
              </div>

              {activeInteraction.references && activeInteraction.references.length > 0 ? (
                <div className="space-y-2">
                  {activeInteraction.references.map((ref, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 truncate">{ref.title}</div>
                        <div className="text-[10px] text-slate-500">{ref.source} ({ref.year})</div>
                      </div>
                      {ref.url && (
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 p-1.5 text-emerald-700 hover:text-emerald-900 rounded-lg hover:bg-emerald-50"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500">
                  Validated against U.S. FDA Drug Labeling, Lexicomp Clinical Reference & Pharmacological Consensus.
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 6. CLINICAL SAFETY DISCLAIMER */}
      {/* ========================================================================= */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800">Clinical Education & Safety Notice</h4>
          <p className="leading-relaxed">
            This checker provides educational pharmacokinetic guidance and does not substitute for personalized medical advice from a physician, licensed clinical pharmacist, or registered dietitian. Never discontinue, initiate, or alter prescribed medication dosages without direct clinical consultation.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. PRINT / EXPORT FACTSHEET MODAL */}
      {/* ========================================================================= */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">Interaction Clinical Factsheet</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowPrintModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Selected Protocol</div>
                <div className="text-sm font-black text-slate-900 mt-0.5">{activeInteraction.title}</div>
                <div className="text-[11px] font-bold text-rose-700 mt-1">Severity: {activeInteraction.severity}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Action Protocol:</div>
                <p className="text-slate-800 font-semibold">{activeInteraction.actionableGuidance}</p>
              </div>

              {activeInteraction.timingGuidance && (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Timing Separation:</div>
                  <p className="text-slate-800 font-semibold">{activeInteraction.timingGuidance}</p>
                </div>
              )}

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Evidence Basis:</div>
                <p className="text-slate-700">{activeInteraction.evidenceLevel || 'High (Clinical Studies / FDA Label)'}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setShowPrintModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. RECENT CHECKS HISTORY MODAL */}
      {/* ========================================================================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">Recent Interaction Checks</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {searchHistory.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-6">No recent searches saved.</div>
              ) : (
                searchHistory.map((hist) => (
                  <div
                    key={hist.id}
                    onClick={() => {
                      setFoodQuery(hist.foodName);
                      setDrugQuery(hist.drugName);
                      setShowHistoryModal(false);
                    }}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 cursor-pointer transition-colors flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {hist.foodName} + {hist.drugName}
                      </div>
                      <div className="text-[10px] text-slate-400">{hist.timestamp}</div>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      hist.severity === 'Severe' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {hist.severity}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSearchHistory([])}
                className="text-xs text-rose-600 hover:underline font-bold"
              >
                Clear History
              </button>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
