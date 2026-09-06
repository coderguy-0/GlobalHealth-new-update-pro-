import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChefHat, 
  Search, 
  Clock, 
  Flame, 
  Bookmark, 
  Sparkles, 
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
  Filter,
  Check,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Utensils,
  Salad,
  Apple,
  Globe,
  Heart,
  Scale
} from 'lucide-react';
import { ENHANCED_RECIPES } from '../data/nutritionData';
import { RECIPES } from '../data/healthData';
import { ALL_1000_RECIPES, RECIPE_CATEGORY_NAMES } from '../data/recipes';
import { Recipe, NavigationTab } from '../types';
import { RecipeDetailsModal } from './RecipeDetailsModal';
import { RecipeDetailPage } from './recipes/RecipeDetailPage';

interface RecipesViewProps {
  savedIds: string[];
  onToggleSave: (id: string) => void;
  hideHeader?: boolean;
  onNavigate?: (tab: NavigationTab) => void;
  onAskAI?: (prompt: string) => void;
  /** Optional recipe id to open automatically (used by the Nutrients index). */
  initialRecipeId?: string;
}

type TagMatchMode = 'any' | 'all';
type SortOption = 'relevance' | 'protein-desc' | 'calories-asc' | 'calories-desc' | 'fiber-desc' | 'time-asc' | 'title-asc';

export const RecipesView: React.FC<RecipesViewProps> = ({ 
  savedIds, 
  onToggleSave,
  hideHeader = false,
  onNavigate,
  onAskAI,
  initialRecipeId
}) => {
  // Search & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 24;

  // Multiple Selection Filter States
  const [selectedDietTags, setSelectedDietTags] = useState<string[]>([]);
  const [tagMatchMode, setTagMatchMode] = useState<TagMatchMode>('any');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedCalorieRanges, setSelectedCalorieRanges] = useState<string[]>([]);
  const [selectedTimeRanges, setSelectedTimeRanges] = useState<string[]>([]);
  
  // Nutrient Criteria Toggles
  const [highProteinOnly, setHighProteinOnly] = useState<boolean>(false);
  const [lowCarbOnly, setLowCarbOnly] = useState<boolean>(false);
  const [highFiberOnly, setHighFiberOnly] = useState<boolean>(false);
  const [lowSodiumOnly, setLowSodiumOnly] = useState<boolean>(false);
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [clinicalVerifiedOnly, setClinicalVerifiedOnly] = useState<boolean>(false);

  // UI State
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState<boolean>(false);
  const [activeModalRecipe, setActiveModalRecipe] = useState<Recipe | null>(null);

  // Merge ALL_1000_RECIPES with enhanced recipes and RECIPES to ensure complete catalog
  const allRecipes: Recipe[] = useMemo(() => {
    const list: Recipe[] = [...ALL_1000_RECIPES];
    ENHANCED_RECIPES.forEach((rec) => {
      const exists = list.some((r) => r.id === rec.id || r.title.toLowerCase() === rec.title.toLowerCase());
      if (!exists) {
        list.push(rec);
      }
    });
    RECIPES.forEach((rec) => {
      const exists = list.some((r) => r.id === rec.id || r.title.toLowerCase() === rec.title.toLowerCase());
      if (!exists) {
        list.push(rec);
      }
    });
    return list;
  }, []);

  // Hash listener for deep links like #recipes/recipe-1-mediterranean-bowl or #recipes/rec-1
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash.startsWith('recipes/')) {
        const id = hash.replace('recipes/', '').trim();
        const found = allRecipes.find((r) => r.id === id || r.title.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase());
        if (found) {
          setActiveModalRecipe(found);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [allRecipes]);

  // Open the recipe requested by the "Nutrients" index without losing the
  // recipe's full detail page (which keeps its own nutrition, vitamin,
  // mineral, macro and safety sections).
  useEffect(() => {
    if (!initialRecipeId) return;
    const found = allRecipes.find((r) => r.id === initialRecipeId || r.title.toLowerCase().replace(/\s+/g, '-') === initialRecipeId.toLowerCase());
    if (found) {
      setActiveModalRecipe(found);
      window.location.hash = `#recipes/${found.id}`;
    }
  }, [initialRecipeId, allRecipes]);

  const openRecipe = (recipe: Recipe) => {
    setActiveModalRecipe(recipe);
    if (window.location.hash.replace(/^#\/?/, '') !== `recipes/${recipe.id}`) {
      window.location.hash = `#recipes/${recipe.id}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeRecipe = () => {
    setActiveModalRecipe(null);
    if (window.location.hash.includes('recipes/')) {
      window.location.hash = '#recipes';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allRecipes.length };
    RECIPE_CATEGORY_NAMES.forEach((cat) => {
      counts[cat] = 0;
    });

    allRecipes.forEach((r) => {
      // Determine group by id prefix or cuisine
      const match = r.id.match(/^rec-1000-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        const groupIdx = Math.min(9, Math.floor((num - 1) / 100));
        const catName = RECIPE_CATEGORY_NAMES[groupIdx];
        if (catName) {
          counts[catName] = (counts[catName] || 0) + 1;
        }
      } else {
        // Fallback matching by tag or cuisine
        const catName = RECIPE_CATEGORY_NAMES[0];
        counts[catName] = (counts[catName] || 0) + 1;
      }
    });
    return counts;
  }, [allRecipes]);

  // Dynamic Diet Tags with recipe counts
  const dietTagStats = useMemo(() => {
    const map = new Map<string, number>();
    allRecipes.forEach((r) => {
      r.dietTags.forEach((t) => {
        const trimmed = t.trim();
        map.set(trimmed, (map.get(trimmed) || 0) + 1);
      });
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag, count]) => ({ tag, count }));
  }, [allRecipes]);

  // Dynamic Cuisines with recipe counts
  const cuisineStats = useMemo(() => {
    const map = new Map<string, number>();
    allRecipes.forEach((r) => {
      if (r.cuisine) {
        const trimmed = r.cuisine.trim();
        map.set(trimmed, (map.get(trimmed) || 0) + 1);
      }
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([cuisine, count]) => ({ cuisine, count }));
  }, [allRecipes]);

  // Tag Multi-Select Handlers
  const toggleDietTag = (tag: string) => {
    setSelectedDietTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const selectAllDietTags = () => {
    setSelectedDietTags(dietTagStats.map((d) => d.tag));
  };

  const clearDietTags = () => {
    setSelectedDietTags([]);
  };

  // Cuisine Multi-Select Handlers
  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };

  // Calorie Range Toggle
  const toggleCalorieRange = (rangeKey: string) => {
    setSelectedCalorieRanges((prev) =>
      prev.includes(rangeKey) ? prev.filter((r) => r !== rangeKey) : [...prev, rangeKey]
    );
  };

  // Time Range Toggle
  const toggleTimeRange = (timeKey: string) => {
    setSelectedTimeRanges((prev) =>
      prev.includes(timeKey) ? prev.filter((t) => t !== timeKey) : [...prev, timeKey]
    );
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedDietTags([]);
    setTagMatchMode('any');
    setSelectedCuisines([]);
    setSelectedCalorieRanges([]);
    setSelectedTimeRanges([]);
    setHighProteinOnly(false);
    setLowCarbOnly(false);
    setHighFiberOnly(false);
    setLowSodiumOnly(false);
    setShowSavedOnly(false);
    setClinicalVerifiedOnly(false);
    setSearchTerm('');
    setSortBy('relevance');
    setCurrentPage(1);
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count += 1;
    count += selectedDietTags.length;
    count += selectedCuisines.length;
    count += selectedCalorieRanges.length;
    count += selectedTimeRanges.length;
    if (highProteinOnly) count += 1;
    if (lowCarbOnly) count += 1;
    if (highFiberOnly) count += 1;
    if (lowSodiumOnly) count += 1;
    if (showSavedOnly) count += 1;
    if (clinicalVerifiedOnly) count += 1;
    if (searchTerm.trim()) count += 1;
    return count;
  }, [
    selectedCategory,
    selectedDietTags.length,
    selectedCuisines.length,
    selectedCalorieRanges.length,
    selectedTimeRanges.length,
    highProteinOnly,
    lowCarbOnly,
    highFiberOnly,
    lowSodiumOnly,
    showSavedOnly,
    clinicalVerifiedOnly,
    searchTerm
  ]);

  // Helper to parse numbers from strings like "25g", "340 kcal", "15 mins"
  const parseNum = (val: string | number | undefined): number => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const match = val.toString().match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : 0;
  };

  // Total prep + cook minutes
  const getTotalTimeMins = (recipe: Recipe): number => {
    const prep = parseNum(recipe.prepTime);
    const cook = parseNum(recipe.cookTime);
    return prep + cook;
  };

  // Filtering & Sorting Execution
  const filteredAndSortedRecipes = useMemo(() => {
    const results = allRecipes.filter((recipe) => {
      // 0. Category Group Filter
      if (selectedCategory !== 'All') {
        const match = recipe.id.match(/^rec-1000-(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          const groupIdx = Math.min(9, Math.floor((num - 1) / 100));
          const catName = RECIPE_CATEGORY_NAMES[groupIdx];
          if (catName !== selectedCategory) return false;
        } else {
          // For non-1000 ID recipes, match against category name or cuisine
          const catLower = selectedCategory.toLowerCase();
          const matches = recipe.cuisine?.toLowerCase().includes(catLower) ||
            recipe.dietTags.some((t) => t.toLowerCase().includes(catLower));
          if (!matches && selectedCategory !== RECIPE_CATEGORY_NAMES[0]) return false;
        }
      }

      // 1. Dietary Tags Multi-Selection Filter
      if (selectedDietTags.length > 0) {
        const recipeTagsLower = recipe.dietTags.map((t) => t.toLowerCase());
        if (tagMatchMode === 'all') {
          const hasAll = selectedDietTags.every((selTag) =>
            recipeTagsLower.some((rt) => rt.includes(selTag.toLowerCase()) || selTag.toLowerCase().includes(rt))
          );
          if (!hasAll) return false;
        } else {
          const hasAny = selectedDietTags.some((selTag) =>
            recipeTagsLower.some((rt) => rt.includes(selTag.toLowerCase()) || selTag.toLowerCase().includes(rt))
          );
          if (!hasAny) return false;
        }
      }

      // 2. Cuisine Multi-Selection Filter
      if (selectedCuisines.length > 0) {
        if (!recipe.cuisine) return false;
        const matchesCuisine = selectedCuisines.some((c) =>
          recipe.cuisine?.toLowerCase().includes(c.toLowerCase())
        );
        if (!matchesCuisine) return false;
      }

      // 3. Calorie Ranges Filter
      if (selectedCalorieRanges.length > 0) {
        const cals = recipe.calories;
        const matchesCalorie = selectedCalorieRanges.some((range) => {
          if (range === 'light') return cals < 300;
          if (range === 'moderate') return cals >= 300 && cals <= 450;
          if (range === 'substantial') return cals > 450;
          return true;
        });
        if (!matchesCalorie) return false;
      }

      // 4. Total Preparation/Cooking Time Filter
      if (selectedTimeRanges.length > 0) {
        const totalTime = getTotalTimeMins(recipe);
        const matchesTime = selectedTimeRanges.some((range) => {
          if (range === 'quick') return totalTime <= 20;
          if (range === 'medium') return totalTime > 20 && totalTime <= 40;
          if (range === 'slow') return totalTime > 40;
          return true;
        });
        if (!matchesTime) return false;
      }

      // 5. High Protein Target (≥ 25g)
      if (highProteinOnly) {
        const proteinNum = parseNum(recipe.protein);
        if (proteinNum < 25) return false;
      }

      // 6. Low Net Carbs (≤ 20g)
      if (lowCarbOnly) {
        const carbsNum = parseNum(recipe.carbs);
        if (carbsNum > 20) return false;
      }

      // 7. High Fiber Target (≥ 7g)
      if (highFiberOnly) {
        const fiberNum = parseNum(recipe.fiber || '0');
        if (fiberNum < 7) return false;
      }

      // 8. Low Sodium Target (≤ 400mg)
      if (lowSodiumOnly) {
        if (recipe.sodiumMg !== undefined && recipe.sodiumMg > 400) {
          return false;
        }
      }

      // 9. Bookmarked / Saved Only
      if (showSavedOnly) {
        if (!savedIds.includes(recipe.id)) return false;
      }

      // 10. Clinical Prevention & Facts Only
      if (clinicalVerifiedOnly) {
        if (!recipe.diseasesPrevented || recipe.diseasesPrevented.length === 0) {
          return false;
        }
      }

      // 11. Keyword Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = recipe.title.toLowerCase().includes(q);
        const matchesDesc = recipe.description.toLowerCase().includes(q);
        const matchesCuisine = recipe.cuisine?.toLowerCase().includes(q) || false;
        const matchesIng = recipe.ingredients.some((ing) => ing.toLowerCase().includes(q));
        const matchesTags = recipe.dietTags.some((tag) => tag.toLowerCase().includes(q));
        const matchesBenefits = recipe.diseasesPrevented?.some((d) => d.condition.toLowerCase().includes(q)) || false;

        if (!matchesTitle && !matchesDesc && !matchesCuisine && !matchesIng && !matchesTags && !matchesBenefits) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    return results.sort((a, b) => {
      if (sortBy === 'protein-desc') {
        return parseNum(b.protein) - parseNum(a.protein);
      }
      if (sortBy === 'calories-asc') {
        return a.calories - b.calories;
      }
      if (sortBy === 'calories-desc') {
        return b.calories - a.calories;
      }
      if (sortBy === 'fiber-desc') {
        return parseNum(b.fiber || '0') - parseNum(a.fiber || '0');
      }
      if (sortBy === 'time-asc') {
        return getTotalTimeMins(a) - getTotalTimeMins(b);
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      
      // Default: Relevance (Matches more selected diet tags first)
      if (selectedDietTags.length > 0) {
        const countMatched = (rec: Recipe) => {
          const lower = rec.dietTags.map((t) => t.toLowerCase());
          return selectedDietTags.filter((sel) => lower.some((t) => t.includes(sel.toLowerCase()))).length;
        };
        return countMatched(b) - countMatched(a);
      }
      return 0;
    });
  }, [
    allRecipes,
    selectedCategory,
    selectedDietTags,
    tagMatchMode,
    selectedCuisines,
    selectedCalorieRanges,
    selectedTimeRanges,
    highProteinOnly,
    lowCarbOnly,
    highFiberOnly,
    lowSodiumOnly,
    showSavedOnly,
    clinicalVerifiedOnly,
    searchTerm,
    sortBy,
    savedIds
  ]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedRecipes.length / itemsPerPage));
  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedRecipes.slice(start, start + itemsPerPage);
  }, [filteredAndSortedRecipes, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  // If a recipe is selected, render the dedicated full-page RecipeDetailPage
  if (activeModalRecipe) {
    return (
      <RecipeDetailPage
        recipe={activeModalRecipe}
        isSaved={savedIds.includes(activeModalRecipe.id)}
        onToggleSave={() => onToggleSave(activeModalRecipe.id)}
        onOpenRecipe={(id) => {
          const next = allRecipes.find((r) => r.id === id);
          if (next) openRecipe(next);
        }}
        onBack={closeRecipe}
        onNavigate={onNavigate}
        onAskAI={onAskAI}
      />
    );
  }

  return (
    <div className={`${hideHeader ? '' : 'py-8 bg-slate-50 min-h-screen'}`}>
      <div className={`${hideHeader ? 'space-y-6' : 'mx-auto max-w-7xl px-4 lg:px-8 space-y-6'}`}>
        
        {/* Header Title Bar */}
        {!hideHeader && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-900 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
                <ChefHat className="h-3.5 w-3.5 text-emerald-700" />
                <span>Evidence-Based Nutrition & Culinary Medicine</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Healthy Recipes Directory
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Nutrient-dense, dietitian-formulated recipes complete with multi-criteria dietary filters, macro targets, and clinical prevention factsheets.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold">
                {allRecipes.length}
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Dietitian Recipes</span>
                <span className="text-slate-500">{dietTagStats.length} Dietary Protocols</span>
              </div>
            </div>
          </div>
        )}

        {/* Primary Search Bar & Multi-Filter Control Strip */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search recipe by name, ingredients (salmon, spinach, lentils), or cuisine..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-10 pr-10 py-2.5 text-xs sm:text-sm placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <ArrowUpDown className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort recipes directory"
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 pl-8 pr-8 py-2.5 text-xs font-bold text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none transition"
                >
                  <option value="relevance">Sort: Most Relevant</option>
                  <option value="protein-desc">Highest Protein (g)</option>
                  <option value="calories-asc">Lowest Calories (kcal)</option>
                  <option value="calories-desc">Highest Calories (kcal)</option>
                  <option value="fiber-desc">Highest Fiber (g)</option>
                  <option value="time-asc">Fastest Prep Time</option>
                  <option value="title-asc">Alphabetical: A to Z</option>
                </select>
              </div>

              {/* Advanced Multi-Filters Toggle Button */}
              <button
                onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition shadow-2xs shrink-0 ${
                  isAdvancedFiltersOpen || activeFiltersCount > 0
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-600/20'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Multiple Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-white text-emerald-800 text-[10px] font-black flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
                {isAdvancedFiltersOpen ? <ChevronUp className="h-3.5 w-3.5 ml-0.5" /> : <ChevronDown className="h-3.5 w-3.5 ml-0.5" />}
              </button>
            </div>
          </div>

          {/* Quick Dietary Tags Multi-Select Strip */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Dietary Protocols ({selectedDietTags.length === 0 ? 'All' : `${selectedDietTags.length} selected`}):</span>
                </span>

                {/* Match Mode Switcher (Any vs All) */}
                {selectedDietTags.length > 1 && (
                  <div className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-[10px] font-extrabold">
                    <button
                      onClick={() => setTagMatchMode('any')}
                      className={`px-2 py-0.5 rounded-lg transition ${
                        tagMatchMode === 'any' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      Match Any
                    </button>
                    <button
                      onClick={() => setTagMatchMode('all')}
                      className={`px-2 py-0.5 rounded-lg transition ${
                        tagMatchMode === 'all' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      Match All
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedDietTags.length > 0 && (
                  <button
                    onClick={clearDietTags}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 underline underline-offset-2"
                  >
                    Clear Tags
                  </button>
                )}
                <button
                  onClick={selectedDietTags.length === dietTagStats.length ? clearDietTags : selectAllDietTags}
                  className="text-[11px] font-bold text-slate-500 hover:text-slate-900"
                >
                  {selectedDietTags.length === dietTagStats.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {/* "All" button */}
              <button
                onClick={clearDietTags}
                className={`rounded-2xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedDietTags.length === 0
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>All Diets</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedDietTags.length === 0 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {allRecipes.length}
                </span>
              </button>

              {/* Individual Multi-Select Tags */}
              {dietTagStats.map(({ tag, count }) => {
                const isSelected = selectedDietTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleDietTag(tag)}
                    className={`rounded-2xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/20'
                        : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                    <span>{tag}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expandable Advanced Multiple-Selection Filter Panel */}
        {isAdvancedFiltersOpen && (
          <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-md space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Comprehensive Multiple Filter Selection
                  </h3>
                  <p className="text-xs text-slate-500">
                    Combine dietary regimes, global cuisines, calorie budgets, macronutrient targets, and cooking speeds.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetAllFilters}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset All</span>
                </button>
                <button
                  onClick={() => setIsAdvancedFiltersOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Grid of Multiple Filter Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Section 1: Cuisines Multi-Picker */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Cuisines & Origins</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {selectedCuisines.length} selected
                  </span>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-1 pr-1 text-xs">
                  {cuisineStats.map(({ cuisine, count }) => {
                    const isSelected = selectedCuisines.includes(cuisine);
                    return (
                      <button
                        key={cuisine}
                        onClick={() => toggleCuisine(cuisine)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                          isSelected
                            ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-white text-emerald-600 border-white' : 'border-slate-300 bg-slate-50'
                          }`}>
                            {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <span className="truncate">{cuisine}</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-md shrink-0 ml-1 ${
                          isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Caloric Range & Preparation Speed */}
              <div className="space-y-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                {/* Calorie Range */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-amber-500" />
                    <span>Calorie Density</span>
                  </span>
                  <div className="space-y-1 text-xs">
                    {[
                      { id: 'light', label: '< 300 kcal', desc: 'Light meals & smoothies' },
                      { id: 'moderate', label: '300 - 450 kcal', desc: 'Balanced lunch & dinners' },
                      { id: 'substantial', label: '> 450 kcal', desc: 'High energy & recovery' }
                    ].map((item) => {
                      const isSelected = selectedCalorieRanges.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleCalorieRange(item.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                            isSelected
                              ? 'bg-amber-600 text-white font-bold shadow-2xs'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-white text-amber-600 border-white' : 'border-slate-300 bg-slate-50'
                            }`}>
                              {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                            </div>
                            <span className="font-bold">{item.label}</span>
                          </div>
                          <span className={`text-[10px] ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                            {item.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Total Time */}
                <div className="space-y-2 pt-2 border-t border-slate-200/60">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Prep + Cook Time</span>
                  </span>
                  <div className="grid grid-cols-3 gap-1 text-[11px] font-bold">
                    {[
                      { id: 'quick', label: '≤ 20 min' },
                      { id: 'medium', label: '20-40 min' },
                      { id: 'slow', label: '40+ min' }
                    ].map((item) => {
                      const isSelected = selectedTimeRanges.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleTimeRange(item.id)}
                          className={`py-1.5 rounded-lg text-center transition ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 3: Macronutrient Target Filters */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Macronutrient Targets</span>
                </span>

                <div className="space-y-2 text-xs">
                  {/* High Protein */}
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/70 cursor-pointer hover:bg-slate-50 transition">
                    <div>
                      <span className="font-bold text-slate-900 block leading-snug">High Protein Focus</span>
                      <span className="text-[10px] text-slate-500">≥ 25g protein per serving</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={highProteinOnly}
                      onChange={(e) => setHighProteinOnly(e.target.checked)}
                      className="h-4 w-4 rounded-md text-emerald-600 focus:ring-emerald-500 border-slate-300 accent-emerald-600"
                    />
                  </label>

                  {/* Low Carb / Keto */}
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/70 cursor-pointer hover:bg-slate-50 transition">
                    <div>
                      <span className="font-bold text-slate-900 block leading-snug">Low Carbohydrate</span>
                      <span className="text-[10px] text-slate-500">≤ 20g net carbs per serving</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={lowCarbOnly}
                      onChange={(e) => setLowCarbOnly(e.target.checked)}
                      className="h-4 w-4 rounded-md text-emerald-600 focus:ring-emerald-500 border-slate-300 accent-emerald-600"
                    />
                  </label>

                  {/* High Fiber */}
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/70 cursor-pointer hover:bg-slate-50 transition">
                    <div>
                      <span className="font-bold text-slate-900 block leading-snug">High Dietary Fiber</span>
                      <span className="text-[10px] text-slate-500">≥ 7g prebiotic fiber</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={highFiberOnly}
                      onChange={(e) => setHighFiberOnly(e.target.checked)}
                      className="h-4 w-4 rounded-md text-emerald-600 focus:ring-emerald-500 border-slate-300 accent-emerald-600"
                    />
                  </label>

                  {/* Low Sodium */}
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/70 cursor-pointer hover:bg-slate-50 transition">
                    <div>
                      <span className="font-bold text-slate-900 block leading-snug">Low Sodium (Hypertension)</span>
                      <span className="text-[10px] text-slate-500">≤ 400mg sodium per serving</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={lowSodiumOnly}
                      onChange={(e) => setLowSodiumOnly(e.target.checked)}
                      className="h-4 w-4 rounded-md text-emerald-600 focus:ring-emerald-500 border-slate-300 accent-emerald-600"
                    />
                  </label>
                </div>
              </div>

              {/* Section 4: Clinical & Personal Toggles */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Clinical & Bookmarks</span>
                </span>

                <div className="space-y-2 text-xs">
                  {/* Saved / Bookmarked Only */}
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/70 cursor-pointer hover:bg-slate-50 transition">
                    <div className="flex items-center gap-2">
                      <Bookmark className="h-4 w-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-slate-900 block leading-snug">Saved Recipes Only</span>
                        <span className="text-[10px] text-slate-500">View your saved culinary favorites ({savedIds.length})</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={showSavedOnly}
                      onChange={(e) => setShowSavedOnly(e.target.checked)}
                      className="h-4 w-4 rounded-md text-emerald-600 focus:ring-emerald-500 border-slate-300 accent-emerald-600"
                    />
                  </label>

                  {/* Clinical Prevention & Factsheet Only */}
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/70 cursor-pointer hover:bg-slate-50 transition">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-teal-600" />
                      <div>
                        <span className="font-bold text-slate-900 block leading-snug">Chronic Disease Prevention</span>
                        <span className="text-[10px] text-slate-500">Recipes with medical mechanism briefs</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={clinicalVerifiedOnly}
                      onChange={(e) => setClinicalVerifiedOnly(e.target.checked)}
                      className="h-4 w-4 rounded-md text-emerald-600 focus:ring-emerald-500 border-slate-300 accent-emerald-600"
                    />
                  </label>
                </div>
              </div>

            </div>
          </div>
        )}



        {/* 1,000 Recipes Category Groups Horizontal Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
            <span className="flex items-center gap-1.5 text-slate-900">
              <Layers className="h-4 w-4 text-emerald-600" />
              <span>1,000 Healthy Food Collections (10 Groups):</span>
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              Showing Group: <strong className="text-emerald-700 font-semibold">{selectedCategory}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setCurrentPage(1);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition shrink-0 flex items-center gap-1.5 ${
                selectedCategory === 'All'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>All 1,000 Recipes</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${selectedCategory === 'All' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {categoryCounts['All'] || allRecipes.length}
              </span>
            </button>

            {RECIPE_CATEGORY_NAMES.map((cat, idx) => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-emerald-600/20 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter Summary Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 px-1">
          <div>
            Showing <strong className="text-slate-900 font-bold">{Math.min(filteredAndSortedRecipes.length, (currentPage - 1) * itemsPerPage + 1)}–{Math.min(filteredAndSortedRecipes.length, currentPage * itemsPerPage)}</strong> of{' '}
            <strong className="text-slate-900 font-bold">{filteredAndSortedRecipes.length}</strong> recipes
            {selectedCategory !== 'All' && <span> in <strong className="text-emerald-700">{selectedCategory}</strong></span>}
            {activeFiltersCount > 0 && <span> (filtered)</span>}
          </div>

          {totalPages > 1 && (
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          )}
        </div>

        {/* Recipe Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {paginatedRecipes.map((recipe) => {
            const isSaved = savedIds.includes(recipe.id);

            return (
              <div
                key={recipe.id}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative h-52 sm:h-56 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105 opacity-90"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Top Controls */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(recipe.id);
                        }}
                        className={`rounded-xl p-2 backdrop-blur-md shadow-md transition ${
                          isSaved 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-950/60 text-white hover:bg-slate-950/80'
                        }`}
                        title={isSaved ? 'Remove from Saved' : 'Save Recipe'}
                      >
                        <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Top Left Cuisine Badge */}
                    {recipe.cuisine && (
                      <div className="absolute top-3 left-3">
                        <span className="rounded-lg bg-emerald-500/95 backdrop-blur-xs px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-xs">
                          {recipe.cuisine}
                        </span>
                      </div>
                    )}

                    {/* Diet Tags in Image Footer */}
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                      {recipe.dietTags.slice(0, 4).map((tag, i) => {
                        const isHighlighted = selectedDietTags.some(
                          (sel) => tag.toLowerCase().includes(sel.toLowerCase()) || sel.toLowerCase().includes(tag.toLowerCase())
                        );
                        return (
                          <span
                            key={i}
                            className={`rounded-lg backdrop-blur-xs border px-2 py-0.5 text-[10px] font-semibold transition ${
                              isHighlighted
                                ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                                : 'bg-slate-900/80 border-white/20 text-emerald-200'
                            }`}
                          >
                            {tag}
                          </span>
                        );
                      })}
                      {recipe.dietTags.length > 4 && (
                        <span className="rounded-lg bg-slate-900/80 backdrop-blur-xs border border-white/20 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300">
                          +{recipe.dietTags.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-emerald-600" /> Prep {recipe.prepTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="h-3.5 w-3.5 text-amber-500" /> Cook {recipe.cookTime}
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800 border border-emerald-200">
                        {recipe.calories} kcal
                      </span>
                    </div>

                    <h3 
                      onClick={() => openRecipe(recipe)}
                      className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug cursor-pointer"
                    >
                      {recipe.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {recipe.description}
                    </p>

                    {/* Macronutrients Grid Bar */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-4 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase">PROTEIN</span>
                        <span className="font-extrabold text-emerald-800">{recipe.protein}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase">CARBS</span>
                        <span className="font-extrabold text-slate-800">{recipe.carbs}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase">FATS</span>
                        <span className="font-extrabold text-slate-800">{recipe.fats}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase">FIBER</span>
                        <span className="font-extrabold text-emerald-700">{recipe.fiber || '6g'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-6 pt-0 flex items-center justify-end gap-3 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => openRecipe(recipe)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition mt-3 cursor-pointer"
                  >
                    <span>View More</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentPage === 1
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-emerald-600'
              }`}
            >
              Previous
            </button>

            <div className="flex items-center gap-1.5 overflow-x-auto max-w-md no-scrollbar py-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 7) return true;
                  if (p === 1 || p === totalPages) return true;
                  if (Math.abs(p - currentPage) <= 2) return true;
                  return false;
                })
                .map((page, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && page - prev > 1;

                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className="px-1 text-slate-400 text-xs font-bold">...</span>}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`h-8 w-8 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                          currentPage === page
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentPage === totalPages
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-emerald-600'
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredAndSortedRecipes.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <ChefHat className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No recipes matched your multiple filter criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your dietary tags, changing your match mode to "Match Any", or resetting selected criteria.
            </p>
            <button
              onClick={resetAllFilters}
              className="mt-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
