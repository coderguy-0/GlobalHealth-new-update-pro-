import React, { useState } from 'react';
import {
  ChefHat,
  X,
  Sparkles,
  Salad,
  Scale,
  AlertTriangle,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import {
  NUTRITION_FOODS,
  ENHANCED_RECIPES,
  FOOD_INTERACTIONS_DATA
} from '../data/nutritionData';
import { NutritionFood, NavigationTab } from '../types';
import { AIMealPlannerView } from './AIMealPlannerView';
import { FoodDrugInteractionView } from './FoodDrugInteractionView';
import { FoodComparisonLabView } from './FoodComparisonLabView';
import { RecipesView } from './RecipesView';

interface NutritionLibraryViewProps {
  /** Section to open on mount. /recipes and /nutrition both land on Recipes. */
  initialSection?: NutritionSection;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onRequestAuth?: () => void;
  onNavigate?: (tab: NavigationTab) => void;
  onAskAI?: (prompt: string) => void;
}

type NutritionSection =
  | 'recipes'
  | 'nutrients'
  | 'mealplans'
  | 'interactions'
  | 'comparison';

export const NutritionLibraryView: React.FC<NutritionLibraryViewProps> = ({
  initialSection = 'recipes',
  savedIds,
  onToggleSave,
  onRequestAuth,
  onNavigate,
  onAskAI
}) => {
  const [activeSection, setActiveSection] = useState<NutritionSection>(initialSection);

  // Comparison State
  const [compareFoodA, setCompareFoodA] = useState<string>(NUTRITION_FOODS[0]?.id || '');
  const [compareFoodB, setCompareFoodB] = useState<string>(NUTRITION_FOODS[1]?.id || '');
  // Food detail modal is driven by the Food Comparison Lab.
  const [activeFoodModal, setActiveFoodModal] = useState<NutritionFood | null>(null);

  // A recipe selected from the Nutrients index that should open on Recipes.
  const [pendingRecipeId, setPendingRecipeId] = useState<string | undefined>(undefined);

  const sectionsNav = [
    { id: 'recipes', label: 'Recipes', icon: <ChefHat className="h-4 w-4" />, count: ENHANCED_RECIPES.length },
    { id: 'nutrients', label: 'Nutrients', icon: <Salad className="h-4 w-4 text-emerald-600" /> },
    { id: 'mealplans', label: 'AI Meal Planner', icon: <Sparkles className="h-4 w-4 text-emerald-500" /> },
    { id: 'interactions', label: 'Food & Drug Interactions', icon: <AlertTriangle className="h-4 w-4" />, count: FOOD_INTERACTIONS_DATA.length },
    { id: 'comparison', label: 'Food Comparison Lab', icon: <Scale className="h-4 w-4" /> }
  ];

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-8">
        
        {/* Main Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1.5">
              <Salad className="h-4 w-4" /> Evidence-Based Clinical Nutrition & Dietary Library
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Nutrition, Culinary Medicine & Human Metabolism
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Explore nutrient-dense recipes with full nutrition profiles, meal planning, food-drug interaction checks, and food comparison tools.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('recipes')}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
            >
              <ChefHat className="h-4 w-4" />
              <span>Explore Recipes</span>
            </button>
            <button
              onClick={() => setActiveSection('comparison')}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
            >
              <Scale className="h-4 w-4 text-emerald-600" />
              <span>Compare Foods</span>
            </button>
          </div>
        </div>

        {/* Top Horizontal Section Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200/80">
          {sectionsNav.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as NutritionSection)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {sec.icon}
                <span>{sec.label}</span>
                {sec.count !== undefined && (
                  <span className={`grid h-4.5 min-w-4.5 place-items-center rounded-full px-1 text-[10px] font-extrabold ${
                    isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {sec.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 1. HEALTHY RECIPES SECTION (ENHANCED IN DETAIL WITH MULTIPLE FILTER SELECTION) */}
        {/* ========================================================================= */}
        {activeSection === 'recipes' && (
          <RecipesView 
            savedIds={savedIds} 
            onToggleSave={onToggleSave}
            hideHeader={true}
            onNavigate={onNavigate}
            onAskAI={onAskAI}
            initialRecipeId={pendingRecipeId}
          />
        )}

        {/* "Nutrients" is intentionally a recipe-led index only. Standalone
            vitamin/mineral/macronutrient/encyclopedia cards are removed from
            the top level; every recipe's own detail page keeps its complete
            nutrition, vitamin, mineral, macro, synergy and safety data. */}
        {activeSection === 'nutrients' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Salad className="h-5 w-5 text-emerald-600" />
                Nutrients in Every Recipe
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Nutritional information is embedded inside each recipe&apos;s own detail page — ingredients, preparation,
                vitamins, minerals, macronutrients, nutrient synergies, dietary notes and relevant safety information.
                Choose a recipe below to open its complete nutrition profile.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ENHANCED_RECIPES.map((recipe) => (
                <button
                  key={recipe.id}
                  type="button"
                  onClick={() => {
                    setPendingRecipeId(recipe.id);
                    setActiveSection('recipes');
                  }}
                  className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-2xs transition hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">{recipe.title}</h4>
                    <ChevronRight className="h-4 w-4 shrink-0 text-emerald-600" />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-xl bg-slate-50 p-2">
                      <span className="block text-[10px] font-bold uppercase text-slate-400">Calories</span>
                      <span className="font-extrabold text-slate-800">{recipe.calories ?? '—'}</span>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-2">
                      <span className="block text-[10px] font-bold uppercase text-emerald-700">Protein</span>
                      <span className="font-extrabold text-emerald-800">{String(recipe.protein ?? '—').replace('g', '')}g</span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2">
                      <span className="block text-[10px] font-bold uppercase text-slate-400">Carbs</span>
                      <span className="font-extrabold text-slate-800">{String(recipe.carbs ?? '—').replace('g', '')}g</span>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] font-semibold text-slate-500">
                    View full recipe &amp; nutrition details
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. AI MEAL PLANNER & SMART GROCERY HUB */}
        {/* ========================================================================= */}
        {activeSection === 'mealplans' && (
          <AIMealPlannerView onRequestAuth={onRequestAuth} />
        )}

        {/* ========================================================================= */}
        {/* 8. FOOD-DRUG INTERACTIONS */}
        {/* ========================================================================= */}
        {activeSection === 'interactions' && (
          <FoodDrugInteractionView />
        )}

        {/* ========================================================================= */}
        {/* 12. FOOD COMPARISON LAB */}
        {/* ========================================================================= */}
        {activeSection === 'comparison' && (
          <FoodComparisonLabView 
            initialFoodAId={compareFoodA}
            initialFoodBId={compareFoodB}
            onSelectFood={(food) => setActiveFoodModal(food)}
          />
        )}

        {/* ========================================================================= */}
        {/* FOOD DETAIL MODAL */}
        {/* ========================================================================= */}
        {activeFoodModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 text-slate-800 space-y-6 my-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="rounded-md bg-emerald-100 text-emerald-900 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                    {activeFoodModal.category}
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{activeFoodModal.name}</h3>
                  <span className="text-xs text-slate-500 font-medium">Standard Serving: {activeFoodModal.servingSize}</span>
                </div>

                <button
                  onClick={() => setActiveFoodModal(null)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Macros Box */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Calories</span>
                  <span className="text-base font-extrabold text-slate-900">{activeFoodModal.calories}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Protein</span>
                  <span className="text-base font-extrabold text-emerald-700">{activeFoodModal.proteinG}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Carbs</span>
                  <span className="text-base font-extrabold text-slate-900">{activeFoodModal.carbsG}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Fat</span>
                  <span className="text-base font-extrabold text-slate-900">{activeFoodModal.fatG}g</span>
                </div>
              </div>

              {/* Health Benefits */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Evidence-Based Health Perks</h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {activeFoodModal.keyHealthBenefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vitamins & Minerals Tables */}
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Vitamins Profile</span>
                  <div className="space-y-1.5">
                    {activeFoodModal.vitamins.map((v, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-800">{v.name}</span>
                        <span className="font-mono text-emerald-700">{v.amount} ({v.dvPercent}% DV)</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Minerals Profile</span>
                  <div className="space-y-1.5">
                    {activeFoodModal.minerals.map((m, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-800">{m.name}</span>
                        <span className="font-mono text-emerald-700">{m.amount} ({m.dvPercent}% DV)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {activeFoodModal.bestPairings && (
                <div className="p-3 rounded-xl bg-emerald-50 text-xs text-emerald-950">
                  <span className="font-bold block text-[10px] uppercase text-emerald-800">Synergistic Food Pairings:</span>
                  <span>{activeFoodModal.bestPairings.join(' • ')}</span>
                </div>
              )}

              <div className="text-right pt-2 border-t border-slate-100">
                <button
                  onClick={() => setActiveFoodModal(null)}
                  className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
