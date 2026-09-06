import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChefHat, 
  CalendarDays, 
  RefreshCw, 
  Check, 
  Plus, 
  Minus, 
  Printer, 
  Download, 
  Bookmark, 
  ShoppingCart, 
  ShieldAlert, 
  ShieldCheck, 
  Flame, 
  Apple, 
  Clock, 
  Users, 
  DollarSign, 
  Activity, 
  Utensils, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  Copy, 
  ChevronRight, 
  Info, 
  Filter, 
  Layers, 
  Trash2,
  X,
  Share2,
  Heart
} from 'lucide-react';
import { 
  AIMealItem, 
  AIMealCategory, 
  AIMealPlannerPreferences, 
  AIDayPlan, 
  AIFullMealPlan, 
  AIShoppingCategory 
} from '../types';
import {
  AI_MEAL_DATABASE,
  generateAIMealPlan,
  generateSmartShoppingList,
  getEligibleMeals
} from '../data/aiMealPlannerData';
import { useAuth } from '../context/AuthContext';

interface AIMealPlannerViewProps {
  onRequestAuth?: () => void;
}

const DEFAULT_PREFERENCES: AIMealPlannerPreferences = {
  ageGroup: 'Adults (31-50 yrs)',
  dietaryPattern: 'Vegetarian',
  foodPreferences: ['Balanced Nourishment', 'High Fiber & Gut Health', 'Mediterranean Style'],
  allergies: [],
  cuisinePreference: 'Mediterranean',
  numberOfPeople: 2,
  budget: 'Moderate / Everyday Balanced',
  cookingTime: 'Moderate (15-30 mins)',
  activityLevel: 'Moderately Active',
  includeMorningSnack: true,
  includeEveningSnack: true,
  includeDessert: false
};

const AGE_GROUPS: AIMealPlannerPreferences['ageGroup'][] = [
  'Toddlers (1-3 yrs)',
  'Children (4-8 yrs)',
  'Youth / Pre-teens (9-13 yrs)',
  'Teenagers (14-18 yrs)',
  'Young Adults (19-30 yrs)',
  'Adults (31-50 yrs)',
  'Mature Adults (51-70 yrs)',
  'Seniors (70+ yrs)'
];

const DIETARY_PATTERNS: AIMealPlannerPreferences['dietaryPattern'][] = [
  'Vegetarian',
  'Non-Vegetarian',
  'Vegan',
  'Pescatarian',
  'Eggetarian',
  'Plant-Forward'
];

const FOOD_PREFERENCES_OPTIONS = [
  'Balanced Nourishment',
  'High Fiber & Gut Health',
  'Mediterranean Style',
  'Heart-Smart & Low Sodium',
  'Diabetic-Friendly Glycemic Control',
  'High Protein Athletic',
  'Immune Resilience',
  'Anti-Inflammatory Whole Foods'
];

const ALLERGIES_OPTIONS = [
  'Gluten / Wheat',
  'Dairy / Lactose',
  'Peanuts',
  'Tree Nuts',
  'Shellfish',
  'Fish',
  'Soy',
  'Eggs',
  'Sesame'
];

const CUISINES: AIMealPlannerPreferences['cuisinePreference'][] = [
  'Mediterranean',
  'Indian',
  'East & Southeast Asian',
  'Mexican & Latin',
  'Continental & Western',
  'Middle Eastern',
  'Global Fusion'
];

export const AIMealPlannerView: React.FC<AIMealPlannerViewProps> = () => {
  const { user } = useAuth();
  // Saved plans are private, user-owned data. They are namespaced to the
  // authenticated account so one user never sees another's saved meal plans,
  // even on a shared device.
  const planScope = user ? `user_${user.id}` : 'guest';
  const planStorageKey = `globalhealth_${planScope}_saved_ai_mealplans`;

  const [preferences, setPreferences] = useState<AIMealPlannerPreferences>(DEFAULT_PREFERENCES);
  const [activePlan, setActivePlan] = useState<AIFullMealPlan | null>(null);
  const [activeDayTab, setActiveDayTab] = useState<number>(1);
  const [plannerViewMode, setPlannerViewMode] = useState<'schedule' | 'shopping' | 'preferences'>('schedule');
  const [shoppingSearch, setShoppingSearch] = useState('');
  const [checkedShoppingItems, setCheckedShoppingItems] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedPlans, setSavedPlans] = useState<AIFullMealPlan[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [swapModalTarget, setSwapModalTarget] = useState<{ dayNumber: number; category: AIMealCategory } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Load this user's saved plans whenever the identity changes (login,
  // logout, account switch) — never another account's plans.
  useEffect(() => {
    setSavedPlans([]);
    try {
      const storedPlans = localStorage.getItem(planStorageKey);
      if (storedPlans) {
        setSavedPlans(JSON.parse(storedPlans));
      }
    } catch {
      // ignore
    }
  }, [planStorageKey]);

  // Initialize with initial generated plan
  useEffect(() => {
    const initialPlan = generateAIMealPlan(DEFAULT_PREFERENCES);
    setActivePlan(initialPlan);
  }, []);

  // Handler to generate a new 7-day plan
  const handleGeneratePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newPlan = generateAIMealPlan(preferences);
      setActivePlan(newPlan);
      setCheckedShoppingItems({});
      setIsGenerating(false);
      setPlannerViewMode('schedule');
    }, 400);
  };

  // Toggle meal completion (Track completed meals)
  const handleToggleMealComplete = (dayNumber: number, mealKey: string) => {
    if (!activePlan) return;

    setActivePlan((prev) => {
      if (!prev) return prev;
      const updatedDays = prev.days.map((day) => {
        if (day.dayNumber !== dayNumber) return day;
        const exists = day.completedMealKeys.includes(mealKey);
        const updatedCompleted = exists
          ? day.completedMealKeys.filter((k) => k !== mealKey)
          : [...day.completedMealKeys, mealKey];
        return {
          ...day,
          completedMealKeys: updatedCompleted
        };
      });
      return {
        ...prev,
        days: updatedDays
      };
    });
  };

  // Re-roll / Regenerate a single meal
  const handleRegenerateMeal = (dayNumber: number, category: AIMealCategory) => {
    if (!activePlan) return;
    const candidates = getEligibleMeals(category, preferences);
    if (candidates.length <= 1) return;

    setActivePlan((prev) => {
      if (!prev) return prev;
      const updatedDays = prev.days.map((day) => {
        if (day.dayNumber !== dayNumber) return day;
        const currentId = day.meals[category]?.id;
        const remaining = candidates.filter((c) => c.id !== currentId);
        const nextMeal = remaining[Math.floor(Math.random() * remaining.length)] || candidates[0];

        const newMeals = { ...day.meals, [category]: nextMeal };
        const activeMealsList = Object.values(newMeals).filter(Boolean) as AIMealItem[];

        return {
          ...day,
          meals: newMeals,
          totalCalories: activeMealsList.reduce((acc, m) => acc + m.calories, 0),
          totalProteinG: activeMealsList.reduce((acc, m) => acc + m.proteinG, 0),
          totalCarbsG: activeMealsList.reduce((acc, m) => acc + m.carbsG, 0),
          totalFatG: activeMealsList.reduce((acc, m) => acc + m.fatG, 0),
          totalFiberG: activeMealsList.reduce((acc, m) => acc + m.fiberG, 0)
        };
      });

      return {
        ...prev,
        days: updatedDays,
        smartShoppingList: generateSmartShoppingList(updatedDays, preferences.numberOfPeople)
      };
    });
  };

  // Swap to a specific selected meal from modal
  const handleSelectSwapMeal = (meal: AIMealItem) => {
    if (!activePlan || !swapModalTarget) return;
    const { dayNumber, category } = swapModalTarget;

    setActivePlan((prev) => {
      if (!prev) return prev;
      const updatedDays = prev.days.map((day) => {
        if (day.dayNumber !== dayNumber) return day;
        const newMeals = { ...day.meals, [category]: meal };
        const activeMealsList = Object.values(newMeals).filter(Boolean) as AIMealItem[];

        return {
          ...day,
          meals: newMeals,
          totalCalories: activeMealsList.reduce((acc, m) => acc + m.calories, 0),
          totalProteinG: activeMealsList.reduce((acc, m) => acc + m.proteinG, 0),
          totalCarbsG: activeMealsList.reduce((acc, m) => acc + m.carbsG, 0),
          totalFatG: activeMealsList.reduce((acc, m) => acc + m.fatG, 0),
          totalFiberG: activeMealsList.reduce((acc, m) => acc + m.fiberG, 0)
        };
      });

      return {
        ...prev,
        days: updatedDays,
        smartShoppingList: generateSmartShoppingList(updatedDays, preferences.numberOfPeople)
      };
    });

    setSwapModalTarget(null);
  };

  // Save current plan (persisted under the authenticated account only)
  const handleSavePlan = () => {
    if (!activePlan) return;
    const updated = [activePlan, ...savedPlans.filter((p) => p.id !== activePlan.id)].slice(0, 10);
    setSavedPlans(updated);
    try {
      localStorage.setItem(planStorageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }
    alert('Plan successfully saved to your profile!');
  };

  // Load a saved plan
  const handleLoadSavedPlan = (plan: AIFullMealPlan) => {
    setActivePlan(plan);
    setPreferences(plan.preferences);
    setShowSavedModal(false);
    setPlannerViewMode('schedule');
  };

  // Toggle shopping item checkmark
  const handleToggleShoppingItem = (itemKey: string) => {
    setCheckedShoppingItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  // Copy shopping list to clipboard
  const handleCopyShoppingList = () => {
    if (!activePlan) return;
    const text = activePlan.smartShoppingList
      .map((cat) => {
        const itemsText = cat.items.map((i) => `  - ${i.name}: ${i.totalAmount} ${i.unit}`).join('\n');
        return `[${cat.category}]\n${itemsText}`;
      })
      .join('\n\n');

    navigator.clipboard.writeText(`Global Health AI Smart Shopping List (Scale: ${preferences.numberOfPeople} people)\n\n${text}`);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // Print plan trigger
  const handlePrint = () => {
    window.print();
  };

  // Calculate total completed meals across the entire week
  const totalWeeklyMealsCount = activePlan
    ? activePlan.days.reduce((acc, day) => {
        return acc + Object.values(day.meals).filter(Boolean).length;
      }, 0)
    : 0;

  const totalCompletedWeeklyMeals = activePlan
    ? activePlan.days.reduce((acc, day) => {
        return acc + day.completedMealKeys.length;
      }, 0)
    : 0;

  const weeklyProgressPercent = totalWeeklyMealsCount > 0
    ? Math.round((totalCompletedWeeklyMeals / totalWeeklyMealsCount) * 100)
    : 0;

  const currentActiveDay = activePlan?.days.find((d) => d.dayNumber === activeDayTab) || activePlan?.days[0];

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs uppercase tracking-wider mb-1.5">
            <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
            Adaptive Clinical Intelligence & Day-by-Day Nutrition Planner
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            AI Meal Planner & Smart Grocery Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Individualized 7-day plans calibrated by life stage, family scale, culinary heritage, and macro & micronutrient density.
          </p>
        </div>

        {/* View Mode Tabs & Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPlannerViewMode('schedule')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              plannerViewMode === 'schedule'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            <span>7-Day Schedule</span>
          </button>

          <button
            onClick={() => setPlannerViewMode('shopping')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              plannerViewMode === 'shopping'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShoppingCart className="h-4 w-4 text-emerald-600" />
            <span>Smart Shopping List</span>
          </button>

          <button
            onClick={() => setPlannerViewMode('preferences')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              plannerViewMode === 'preferences'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Filter className="h-4 w-4 text-emerald-600" />
            <span>Personalize</span>
          </button>

          <button
            onClick={handleSavePlan}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            title="Save plan to profile"
          >
            <Bookmark className="h-4 w-4" />
          </button>

          {savedPlans.length > 0 && (
            <button
              onClick={() => setShowSavedModal(true)}
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs"
            >
              Saved ({savedPlans.length})
            </button>
          )}

          <button
            onClick={handlePrint}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            title="Print 7-Day Plan"
          >
            <Printer className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. CRITICAL SAFETY FEATURE & NOURISHMENT NOTICE */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-emerald-200/80 bg-linear-to-r from-emerald-50 via-teal-50/60 to-emerald-50/40 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-start gap-3.5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-extrabold text-emerald-950">
                Safety & Growth-First Nutrition Principle
              </h4>
              <span className="rounded-md bg-emerald-200/60 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-900">
                Non-Restrictive Design
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Because nutrition needs vary significantly across the human lifespan—especially for children, teenagers, and pregnant or nursing individuals—this AI Planner avoids caloric restriction or weight-loss targets as default goals. Our models strictly optimize for <strong>balanced whole foods, micronutrient adequacy, gut diversity, developmental vitality, and healthy lifelong eating habits</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-emerald-900 font-semibold">
              <span>✓ Active Age Group: <strong>{preferences.ageGroup}</strong></span>
              <span>•</span>
              <span>✓ Scaling: <strong>{preferences.numberOfPeople} {preferences.numberOfPeople === 1 ? 'Person' : 'People'}</strong></span>
              <span>•</span>
              <span>✓ Heritage: <strong>{preferences.cuisinePreference}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. PERSONALIZATION DRAWER & CONTROLS */}
      {/* ========================================================================= */}
      {plannerViewMode === 'preferences' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Filter className="h-5 w-5 text-emerald-600" />
                Personalize Nutrition Parameters
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your age group, dietary pattern, culinary heritage, budget, and family servings.
              </p>
            </div>
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isGenerating ? 'Recalibrating Plan...' : 'Generate 7-Day Plan'}</span>
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Age Group */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                1. Age Group (Developmental Tier)
              </label>
              <select
                value={preferences.ageGroup}
                onChange={(e) => setPreferences({ ...preferences, ageGroup: e.target.value as any })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              >
                {AGE_GROUPS.map((ag) => (
                  <option key={ag} value={ag}>{ag}</option>
                ))}
              </select>
              <span className="text-[11px] text-slate-400 block">Ensures micronutrient & portion alignment</span>
            </div>

            {/* Dietary Pattern */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                2. Dietary Pattern
              </label>
              <select
                value={preferences.dietaryPattern}
                onChange={(e) => setPreferences({ ...preferences, dietaryPattern: e.target.value as any })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              >
                {DIETARY_PATTERNS.map((dp) => (
                  <option key={dp} value={dp}>{dp}</option>
                ))}
              </select>
              <span className="text-[11px] text-slate-400 block">Vegetarian, Vegan, Pescatarian, etc.</span>
            </div>

            {/* Cuisine Preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                3. Cuisine Preference
              </label>
              <select
                value={preferences.cuisinePreference}
                onChange={(e) => setPreferences({ ...preferences, cuisinePreference: e.target.value as any })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              >
                {CUISINES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <span className="text-[11px] text-slate-400 block">Infuses authentic cultural flavors & spices</span>
            </div>

            {/* Number of People (Servings Scale) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                4. Number of People (Household Scale)
              </label>
              <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setPreferences({ ...preferences, numberOfPeople: Math.max(1, preferences.numberOfPeople - 1) })}
                  className="grid h-8 w-8 place-items-center rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-emerald-50"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs font-black text-slate-900 w-12 text-center">
                  {preferences.numberOfPeople} {preferences.numberOfPeople === 1 ? 'Person' : 'People'}
                </span>
                <button
                  onClick={() => setPreferences({ ...preferences, numberOfPeople: Math.min(8, preferences.numberOfPeople + 1) })}
                  className="grid h-8 w-8 place-items-center rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-emerald-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <span className="text-[11px] text-slate-500 ml-auto pr-2">Scales shopping list</span>
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                5. Grocery Budget
              </label>
              <select
                value={preferences.budget}
                onChange={(e) => setPreferences({ ...preferences, budget: e.target.value as any })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="Economical / Budget-Friendly">Economical / Budget-Friendly</option>
                <option value="Moderate / Everyday Balanced">Moderate / Everyday Balanced</option>
                <option value="Premium / Gourmet">Premium / Gourmet</option>
              </select>
              <span className="text-[11px] text-slate-400 block">Pantry & seasonal ingredient balance</span>
            </div>

            {/* Cooking Time & Activity Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                6. Cooking Time & Activity Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={preferences.cookingTime}
                  onChange={(e) => setPreferences({ ...preferences, cookingTime: e.target.value as any })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                >
                  <option value="Quick (<15 mins)">Quick (&lt;15 min)</option>
                  <option value="Moderate (15-30 mins)">Moderate (15-30 min)</option>
                  <option value="Extended (30-45 mins)">Extended (30-45 min)</option>
                  <option value="Batch Cooking (45+ mins)">Batch (45+ min)</option>
                </select>
                <select
                  value={preferences.activityLevel}
                  onChange={(e) => setPreferences({ ...preferences, activityLevel: e.target.value as any })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                >
                  <option value="Sedentary">Sedentary</option>
                  <option value="Lightly Active">Lightly Active</option>
                  <option value="Moderately Active">Moderately Active</option>
                  <option value="Very Active">Very Active</option>
                  <option value="High-Demand Athletic">Athletic</option>
                </select>
              </div>
              <span className="text-[11px] text-slate-400 block">Pre-prep speed & metabolic demand</span>
            </div>
          </div>

          {/* Meal Categories Inclusion Toggles */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Meal Schedule Slots (Category Controls)
            </label>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-800">Breakfast (Always active)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                <input
                  type="checkbox"
                  checked={preferences.includeMorningSnack}
                  onChange={(e) => setPreferences({ ...preferences, includeMorningSnack: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-800">Morning Snack</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-800">Lunch (Always active)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                <input
                  type="checkbox"
                  checked={preferences.includeEveningSnack}
                  onChange={(e) => setPreferences({ ...preferences, includeEveningSnack: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-800">Evening Snack</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-800">Dinner (Always active)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                <input
                  type="checkbox"
                  checked={preferences.includeDessert}
                  onChange={(e) => setPreferences({ ...preferences, includeDessert: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-800">Optional Wholesome Dessert</span>
              </label>
            </div>
          </div>

          {/* Allergies & Food Preferences Pills */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Allergies Exclusion */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center justify-between">
                <span>Allergies (Strict Exclusion)</span>
                <span className="text-[10px] text-slate-400 font-normal">Tap to filter</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ALLERGIES_OPTIONS.map((alg) => {
                  const isSelected = preferences.allergies.includes(alg);
                  return (
                    <button
                      key={alg}
                      type="button"
                      onClick={() => {
                        const next = isSelected
                          ? preferences.allergies.filter((a) => a !== alg)
                          : [...preferences.allergies, alg];
                        setPreferences({ ...preferences, allergies: next });
                      }}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        isSelected
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? `✕ ${alg}` : `+ ${alg}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Food Preferences & Health Goals */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center justify-between">
                <span>Nutrition Focus Highlights</span>
                <span className="text-[10px] text-slate-400 font-normal">Multi-select</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {FOOD_PREFERENCES_OPTIONS.map((fp) => {
                  const isSelected = preferences.foodPreferences.includes(fp);
                  return (
                    <button
                      key={fp}
                      type="button"
                      onClick={() => {
                        const next = isSelected
                          ? preferences.foodPreferences.filter((p) => p !== fp)
                          : [...preferences.foodPreferences, fp];
                        setPreferences({ ...preferences, foodPreferences: next });
                      }}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? `✓ ${fp}` : `+ ${fp}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-black text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>Apply & Generate 7-Day Plan</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. WEEKLY CONTROLS & DAY SELECTOR */}
      {/* ========================================================================= */}
      {plannerViewMode === 'schedule' && activePlan && (
        <div className="space-y-6">
          {/* Controls Bar & Progress Tracker */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-black">
                {activeDayTab}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>{currentActiveDay?.dayName} Meal Schedule</span>
                  <span className="rounded-md bg-emerald-100 text-emerald-900 px-2 py-0.5 text-[10px] font-bold">
                    Day {currentActiveDay?.dayNumber} of 7
                  </span>
                </h3>
                <p className="text-xs text-emerald-800 font-medium mt-0.5">
                  Theme: {currentActiveDay?.themeFocus}
                </p>
              </div>
            </div>

            {/* Weekly Completion Progress Meter */}
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200/80">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 gap-4">
                  <span>Completed Meals:</span>
                  <span className="text-emerald-700">{totalCompletedWeeklyMeals} / {totalWeeklyMealsCount}</span>
                </div>
                <div className="h-2 w-36 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    style={{ width: `${weeklyProgressPercent}%` }}
                    className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                  />
                </div>
              </div>

              <button
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 transition shadow-2xs"
                title="Regenerate all 7 days"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate 7-Day</span>
              </button>
            </div>
          </div>

          {/* 7 Days Horizontal Tab Switcher */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {activePlan.days.map((day) => {
              const isSelected = activeDayTab === day.dayNumber;
              const completedCount = day.completedMealKeys.length;
              const totalDayMeals = Object.values(day.meals).filter(Boolean).length;
              const isAllDayComplete = completedCount === totalDayMeals && totalDayMeals > 0;

              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setActiveDayTab(day.dayNumber)}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border text-center transition ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10'
                      : isAllDayComplete
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                    {day.dayName.slice(0, 3)}
                  </span>
                  <span className="text-sm font-black mt-0.5">Day {day.dayNumber}</span>
                  <span className={`text-[10px] font-extrabold mt-1 ${isSelected ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    {day.totalCalories} kcal
                  </span>
                  {completedCount > 0 && (
                    <span className={`mt-1 flex items-center gap-0.5 text-[9px] font-bold ${
                      isSelected ? 'text-emerald-300' : 'text-emerald-700'
                    }`}>
                      <Check className="h-2.5 w-2.5" />
                      {completedCount}/{totalDayMeals}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Daily Nutrition Macro Highlights Bar */}
          {currentActiveDay && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">TOTAL CALORIES</span>
                <span className="text-base font-black text-slate-900">{currentActiveDay.totalCalories} kcal</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-2xs">
                <span className="text-[9px] text-emerald-600 font-bold uppercase block">PROTEIN</span>
                <span className="text-base font-black text-emerald-800">{currentActiveDay.totalProteinG}g</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">CARBOHYDRATES</span>
                <span className="text-base font-black text-slate-900">{currentActiveDay.totalCarbsG}g</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">HEALTHY FATS</span>
                <span className="text-base font-black text-slate-900">{currentActiveDay.totalFatG}g</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">DIETARY FIBER</span>
                <span className="text-base font-black text-slate-900">{currentActiveDay.totalFiberG}g</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2 & 3. MEAL CATEGORIES & DETAILED NUTRITION FOR EVERY MEAL */}
          {/* ========================================================================= */}
          {currentActiveDay && (
            <div className="space-y-4">
              {[
                { key: 'breakfast', label: 'Breakfast', icon: <Apple className="h-4 w-4 text-amber-500" />, meal: currentActiveDay.meals.breakfast },
                { key: 'morning_snack', label: 'Morning Snack', icon: <Clock className="h-4 w-4 text-emerald-600" />, meal: currentActiveDay.meals.morning_snack },
                { key: 'lunch', label: 'Lunch', icon: <ChefHat className="h-4 w-4 text-sky-600" />, meal: currentActiveDay.meals.lunch },
                { key: 'evening_snack', label: 'Evening Snack', icon: <Clock className="h-4 w-4 text-emerald-600" />, meal: currentActiveDay.meals.evening_snack },
                { key: 'dinner', label: 'Dinner', icon: <Utensils className="h-4 w-4 text-rose-500" />, meal: currentActiveDay.meals.dinner },
                { key: 'dessert', label: 'Optional Wholesome Dessert', icon: <Heart className="h-4 w-4 text-pink-500" />, meal: currentActiveDay.meals.dessert }
              ].map(({ key, label, icon, meal }) => {
                if (!meal) return null;
                const isCompleted = currentActiveDay.completedMealKeys.includes(key);

                return (
                  <div
                    key={key}
                    className={`rounded-3xl border transition-all duration-200 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-start justify-between gap-5 ${
                      isCompleted
                        ? 'bg-slate-50/90 border-slate-200 text-slate-600 opacity-90'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    {/* Left: Meal Category, Title, Description, Portion & Vitamins */}
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800">
                          {icon}
                          <span>{label}</span>
                        </div>
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 border border-emerald-200/60">
                          {meal.cuisine}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {meal.prepTimeMinutes} min prep
                        </span>
                      </div>

                      <div>
                        <h4 className={`text-base sm:text-lg font-black ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {meal.name}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {meal.description}
                        </p>
                      </div>

                      {/* Portion Size & Guidance */}
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700">Portion Size (Per Person):</span>
                          <span className="font-bold text-emerald-800">{meal.portionSize}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Scales to {preferences.numberOfPeople} servings for your household
                        </div>
                      </div>

                      {/* Vitamins & Minerals Chips */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="font-bold text-slate-400 uppercase">Key Vitamins:</span>
                          {meal.keyVitamins.map((vit, idx) => (
                            <span key={idx} className="rounded-md bg-amber-50 px-2 py-0.5 font-bold text-amber-900 border border-amber-200/60">
                              {vit}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="font-bold text-slate-400 uppercase">Key Minerals:</span>
                          {meal.keyMinerals.map((min, idx) => (
                            <span key={idx} className="rounded-md bg-sky-50 px-2 py-0.5 font-bold text-sky-900 border border-sky-200/60">
                              {min}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Nutrition Values Grid & Action Buttons */}
                    <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between gap-4 shrink-0">
                      {/* Macro Pillbox */}
                      <div className="grid grid-cols-4 gap-2 text-center text-xs bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 w-full sm:w-auto">
                        <div className="px-2">
                          <span className="text-[9px] text-slate-400 font-bold block">KCAL</span>
                          <span className="font-black text-slate-900">{meal.calories}</span>
                        </div>
                        <div className="px-2">
                          <span className="text-[9px] text-emerald-600 font-bold block">PRO</span>
                          <span className="font-black text-emerald-800">{meal.proteinG}g</span>
                        </div>
                        <div className="px-2">
                          <span className="text-[9px] text-slate-400 font-bold block">CARB</span>
                          <span className="font-black text-slate-900">{meal.carbsG}g</span>
                        </div>
                        <div className="px-2">
                          <span className="text-[9px] text-slate-400 font-bold block">FIBER</span>
                          <span className="font-black text-slate-900">{meal.fiberG}g</span>
                        </div>
                      </div>

                      {/* Interactive Actions (Done / Swap / Regenerate) */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleToggleMealComplete(currentActiveDay.dayNumber, key)}
                          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition shadow-2xs ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>{isCompleted ? 'Completed' : 'Mark Eaten'}</span>
                        </button>

                        <button
                          onClick={() => setSwapModalTarget({ dayNumber: currentActiveDay.dayNumber, category: key as AIMealCategory })}
                          className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition shadow-2xs"
                          title="Swap meal from library"
                        >
                          Swap
                        </button>

                        <button
                          onClick={() => handleRegenerateMeal(currentActiveDay.dayNumber, key as AIMealCategory)}
                          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 transition shadow-2xs"
                          title="Regenerate this single meal"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SMART SHOPPING LIST (COMBINING ALL 7 DAYS INTO 8 CATEGORIES) */}
      {/* ========================================================================= */}
      {plannerViewMode === 'shopping' && activePlan && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
                <ShoppingCart className="h-4 w-4" />
                Aggregated Master Weekly Pantry
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Smart Combined Grocery List
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically consolidated from all 7 days of meals, scaled for {preferences.numberOfPeople} {preferences.numberOfPeople === 1 ? 'person' : 'people'}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={shoppingSearch}
                  onChange={(e) => setShoppingSearch(e.target.value)}
                  placeholder="Search ingredients..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <button
                onClick={handleCopyShoppingList}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
              >
                <Copy className="h-3.5 w-3.5 text-emerald-600" />
                <span>{copyFeedback ? 'Copied!' : 'Copy List'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Categories Grid (Vegetables -> Fruits -> Grains -> Pulses -> Dairy -> Protein foods -> Spices -> Other) */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {activePlan.smartShoppingList.map((catGroup) => {
              const filteredItems = catGroup.items.filter((item) =>
                item.name.toLowerCase().includes(shoppingSearch.toLowerCase())
              );

              if (filteredItems.length === 0 && shoppingSearch) return null;

              const categoryIcons: Record<AIShoppingCategory, string> = {
                'Vegetables': '🥦',
                'Fruits': '🍎',
                'Grains': '🌾',
                'Pulses': '🫘',
                'Dairy': '🥛',
                'Protein foods': '🥩',
                'Spices': '🌿',
                'Other ingredients': '🥫'
              };

              return (
                <div
                  key={catGroup.category}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span>{categoryIcons[catGroup.category]}</span>
                      <span>{catGroup.category}</span>
                    </span>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      {filteredItems.length}
                    </span>
                  </div>

                  <ul className="space-y-1.5">
                    {filteredItems.map((item, idx) => {
                      const itemKey = `${catGroup.category}-${item.name}`;
                      const isChecked = checkedShoppingItems[itemKey];

                      return (
                        <li key={idx}>
                          <button
                            onClick={() => handleToggleShoppingItem(itemKey)}
                            className={`w-full flex items-start gap-2.5 p-2 rounded-xl border text-left text-xs transition ${
                              isChecked
                                ? 'bg-slate-100 border-slate-200 line-through text-slate-400'
                                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                            }`}
                          >
                            <span
                              className={`grid h-4 w-4 shrink-0 place-items-center rounded border mt-0.5 ${
                                isChecked
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-slate-300'
                              }`}
                            >
                              {isChecked && <Check className="h-3 w-3" />}
                            </span>
                            <div className="flex-1 leading-snug">
                              <span className="font-semibold block">{item.name}</span>
                              <span className="text-[10px] text-emerald-800 font-bold block">
                                {item.totalAmount} {item.unit}
                              </span>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SWAP MEAL SELECTION MODAL */}
      {/* ========================================================================= */}
      {swapModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-slate-800 space-y-5 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Swap Meal for Day {swapModalTarget.dayNumber}</span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Select Alternative {swapModalTarget.category.replace('_', ' ').toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setSwapModalTarget(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {getEligibleMeals(swapModalTarget.category, preferences).map((candidate) => (
                <div
                  key={candidate.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{candidate.name}</span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        {candidate.cuisine}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{candidate.description}</p>
                    <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-2">
                      <span>{candidate.calories} kcal</span>
                      <span>•</span>
                      <span>{candidate.proteinG}g Protein</span>
                      <span>•</span>
                      <span>{candidate.fiberG}g Fiber</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectSwapMeal(candidate)}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition shrink-0"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SAVED PLANS MODAL */}
      {/* ========================================================================= */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-slate-800 space-y-5 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-emerald-600" />
                Your Saved AI Meal Plans
              </h3>
              <button
                onClick={() => setShowSavedModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {savedPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-400 transition flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="font-extrabold text-sm text-slate-900 block">{plan.title}</span>
                    <span className="text-[11px] text-slate-500 block">
                      {plan.preferences.dietaryPattern} • {plan.preferences.ageGroup} • {plan.preferences.numberOfPeople} people
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Created {new Date(plan.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleLoadSavedPlan(plan)}
                    className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-600 transition shrink-0"
                  >
                    Load Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
