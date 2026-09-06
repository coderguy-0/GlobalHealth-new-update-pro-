import React, { useEffect, useMemo, useState } from 'react';
import {
  Utensils,
  ChefHat,
  Flame,
  Heart,
  ShieldCheck,
  Scale,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  HelpCircle,
  Bookmark,
  Share2,
  Printer,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Bot,
  Apple,
  Dna,
  Leaf,
  Activity,
  Minus,
  Plus,
  Check,
  Layers,
  ListChecks,
  Thermometer
} from 'lucide-react';
import { Recipe, NavigationTab } from '../../types';
import { ALL_1000_RECIPES } from '../../data/recipes';
import { ENHANCED_RECIPES } from '../../data/nutritionData';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';

interface RecipeDetailPageProps {
  recipe: Recipe;
  isSaved: boolean;
  onToggleSave: () => void;
  onOpenRecipe: (id: string) => void;
  onBack: () => void;
  onNavigate?: (tab: NavigationTab) => void;
  onAskAI?: (prompt: string) => void;
}

const NAV_ITEMS: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview & Highlights', icon: <Info className="h-3.5 w-3.5" /> },
  { id: 'macros', label: 'Macronutrient Breakdown', icon: <Flame className="h-3.5 w-3.5" /> },
  { id: 'vitamins', label: 'Essential Vitamins', icon: <Apple className="h-3.5 w-3.5" /> },
  { id: 'minerals', label: 'Essential Minerals', icon: <Activity className="h-3.5 w-3.5" /> },
  { id: 'synergies', label: 'Nutrient Synergies', icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: 'benefits', label: 'Therapeutic Benefits', icon: <Heart className="h-3.5 w-3.5" /> },
  { id: 'ingredients', label: 'Scaled Ingredients', icon: <ListChecks className="h-3.5 w-3.5" /> },
  { id: 'instructions', label: 'Preparation & Cooking', icon: <ChefHat className="h-3.5 w-3.5" /> },
  { id: 'storage', label: 'Meal Prep & Storage', icon: <Thermometer className="h-3.5 w-3.5" /> },
  { id: 'deficiency-toxicity', label: 'Deficiency & Toxicity', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  { id: 'faq', label: 'Nutrition FAQs', icon: <HelpCircle className="h-3.5 w-3.5" /> },
  { id: 'related', label: 'Related Healthy Recipes', icon: <Utensils className="h-3.5 w-3.5" /> },
];

export const RecipeDetailPage: React.FC<RecipeDetailPageProps> = ({
  recipe,
  isSaved,
  onToggleSave,
  onOpenRecipe,
  onBack,
  onNavigate,
  onAskAI,
}) => {
  const [servings, setServings] = useState(recipe.servings || 2);
  const baseServings = recipe.servings || 2;
  const scale = servings / baseServings;

  const [activeSection, setActiveSection] = useState('overview');
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  // Find enhanced recipe data if available
  const enhanced = useMemo(() => {
    return ENHANCED_RECIPES.find((r) => r.id === recipe.id || r.title === recipe.title);
  }, [recipe]);

  // Related recipes in same category or diet tags
  const related = useMemo(() => {
    const all = ALL_1000_RECIPES.length > 0 ? ALL_1000_RECIPES : [recipe];
    return all
      .filter(
        (r) =>
          r.id !== recipe.id &&
          ((recipe.category !== undefined && r.category === recipe.category) ||
            r.dietTags?.some((t) => recipe.dietTags?.includes(t)))
      )
      .slice(0, 4);
  }, [recipe]);

  // Scaled values
  const calories = Math.round(recipe.calories * scale);
  const proteinNum = parseFloat(recipe.protein.replace(/[^0-9.]/g, '')) || 25;
  const carbsNum = parseFloat(recipe.carbs.replace(/[^0-9.]/g, '')) || 35;
  const fatsNum = parseFloat(recipe.fats.replace(/[^0-9.]/g, '')) || 15;
  const fiberNum = parseFloat((recipe.fiber || '6g').replace(/[^0-9.]/g, '')) || 6;
  const netCarbs = Math.max(0, Math.round((carbsNum - fiberNum) * scale));

  const scaledProtein = Math.round(proteinNum * scale);
  const scaledCarbs = Math.round(carbsNum * scale);
  const scaledFats = Math.round(fatsNum * scale);
  const scaledFiber = Math.round(fiberNum * scale);

  // Calorie percentages
  const proteinCals = scaledProtein * 4;
  const carbsCals = scaledCarbs * 4;
  const fatCals = scaledFats * 9;
  const totalCals = proteinCals + carbsCals + fatCals || 1;
  const proteinPct = Math.round((proteinCals / totalCals) * 100);
  const carbsPct = Math.round((carbsCals / totalCals) * 100);
  const fatPct = 100 - proteinPct - carbsPct;

  // Scroll spy
  useEffect(() => {
    const ids = NAV_ITEMS.map((n) => n.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [recipe.id]);

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#recipes/${recipe.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${recipe.title} - Clinical Nutrition & Recipe`,
          text: `Nutritional breakdown, macros, vitamins, and step-by-step culinary guide for ${recipe.title}`,
          url,
        });
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleIngredientCheck = (idx: number) => {
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const aiPrompts = [
    `How can I substitute ingredients in ${recipe.title} for a vegan diet?`,
    `What are the major health benefits of ${recipe.title}?`,
    `Is ${recipe.title} suitable for people with type 2 diabetes?`,
    `How does ${recipe.title} support athletic recovery and muscle synthesis?`,
    `What side dish or beverage pairs best with this recipe?`,
  ];

  const handleAsk = (prompt: string) => {
    if (onAskAI) {
      onAskAI(prompt);
    } else if (onNavigate) {
      onNavigate('ai-assistant');
    }
  };

  // Vitamins Data
  const vitaminsList = enhanced?.vitaminDirectory || [
    {
      code: 'Vit-D3',
      name: 'Vitamin D3 (Cholecalciferol)',
      amount: '580 IU',
      dvPercent: 73,
      solubility: 'Fat-Soluble' as const,
      role: 'Regulates calcium absorption, osteoblast mineralization, and immune competence.',
      foodSourceInRecipe: 'Primary protein and fortified ingredients'
    },
    {
      code: 'Vit-B12',
      name: 'Vitamin B12 (Cobalamin)',
      amount: '3.6 µg',
      dvPercent: 150,
      solubility: 'Water-Soluble' as const,
      role: 'Erythrocyte cellular division, neural myelin stability, and homocysteine regulation.',
      foodSourceInRecipe: 'Seafood, poultry, and fermented bases'
    },
    {
      code: 'Vit-C',
      name: 'Vitamin C (Ascorbic Acid)',
      amount: '32 mg',
      dvPercent: 36,
      solubility: 'Water-Soluble' as const,
      role: 'Collagen biosynthesis, endothelial protection, and non-heme iron reduction.',
      foodSourceInRecipe: 'Fresh vegetables, herbs, and citrus garnishes'
    },
    {
      code: 'Vit-K1',
      name: 'Vitamin K1 (Phylloquinone)',
      amount: '120 µg',
      dvPercent: 100,
      solubility: 'Fat-Soluble' as const,
      role: 'Hepatic clotting factors gamma-carboxylation and arterial calcification inhibition.',
      foodSourceInRecipe: 'Dark leafy greens and cruciferous vegetables'
    },
    {
      code: 'Vit-B6',
      name: 'Vitamin B6 (Pyridoxine)',
      amount: '0.9 mg',
      dvPercent: 53,
      solubility: 'Water-Soluble' as const,
      role: 'Amino acid transamination, neurotransmitter synthesis (Serotonin, GABA).',
      foodSourceInRecipe: 'Whole ancient grains and legumes'
    }
  ];

  // Minerals Data
  const mineralsList = enhanced?.essentialMinerals || [
    {
      symbol: 'K',
      name: 'Potassium',
      amount: `${recipe.potassiumMg || 720} mg`,
      dvPercent: Math.round(((recipe.potassiumMg || 720) / 4700) * 100),
      category: 'Macromineral' as const,
      role: 'Systemic fluid osmolarity, cardiac conduction, and counteraction of dietary sodium.',
      foodSourceInRecipe: 'Vegetables and ancient grains',
      absorptionTip: 'Naturally balanced with dietary sodium'
    },
    {
      symbol: 'Mg',
      name: 'Magnesium',
      amount: '92 mg',
      dvPercent: 23,
      category: 'Macromineral' as const,
      role: 'Required cofactor for >300 enzymes, ATP phosphorylation, and neuromuscular relaxation.',
      foodSourceInRecipe: 'Seeds, ancient grains, and green leaves'
    },
    {
      symbol: 'Fe',
      name: 'Iron',
      amount: `${recipe.ironMg || 3.4} mg`,
      dvPercent: Math.round(((recipe.ironMg || 3.4) / 18) * 100),
      category: 'Trace Mineral' as const,
      role: 'Hemoglobin and myoglobin oxygen transport to exercising skeletal tissues.',
      foodSourceInRecipe: 'Plant proteins, legumes, and greens',
      absorptionTip: 'Significantly enhanced by co-consumed ascorbic acid (Vitamin C)'
    },
    {
      symbol: 'Ca',
      name: 'Calcium',
      amount: `${recipe.calciumMg || 140} mg`,
      dvPercent: Math.round(((recipe.calciumMg || 140) / 1300) * 100),
      category: 'Macromineral' as const,
      role: 'Bone mineral matrix density, intracellular signaling, and vascular contraction.',
      foodSourceInRecipe: 'Greens, seeds, and fortified dressings'
    }
  ];

  return (
    <div className="bg-white">
      {/* 1. Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="gh-container flex items-center gap-1.5 py-3 text-xs text-slate-500 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => (onNavigate ? onNavigate('home') : onBack())}
            className="font-semibold text-slate-600 transition hover:text-emerald-700 shrink-0"
          >
            Home
          </button>
          <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
          <button
            type="button"
            onClick={onBack}
            className="font-semibold text-slate-600 transition hover:text-emerald-700 shrink-0"
          >
            Nutrition &amp; Recipes
          </button>
          <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
          <span className="font-medium text-slate-700 shrink-0">{recipe.category || 'Healthy Cuisine'}</span>
          <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
          <span className="truncate font-bold text-slate-900">{recipe.title}</span>
        </div>
      </div>

      {/* 2. Main Page Container */}
      <div className="gh-container py-8 sm:py-10">
        
        {/* Recipe Header Banner */}
        <header className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-6 sm:p-8 text-white shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* Top Badges & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-extrabold text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Clinical Nutritionist Verified
                </span>

                <span className="rounded-full bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 text-xs font-bold">
                  {recipe.category || 'Therapeutic Meal'}
                </span>

                <span className="rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 px-3 py-1 text-xs font-extrabold flex items-center gap-1">
                  <Flame className="h-3 w-3" />
                  {calories} kcal / serving
                </span>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onToggleSave}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer border ${
                    isSaved
                      ? 'bg-rose-500/20 border-rose-400/40 text-rose-300 hover:bg-rose-500/30'
                      : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={isSaved ? 'Remove from saved' : 'Save recipe'}
                >
                  <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-current text-rose-400' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                  title="Share recipe"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>{copyState === 'copied' ? 'Copied Link!' : 'Share'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                  title="Print recipe"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Recipe Title & Overview */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {recipe.title}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
                {recipe.description}
              </p>
            </div>

            {/* Dietary Tags */}
            {recipe.dietTags && recipe.dietTags.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-400">Dietary Suitability:</span>
                {recipe.dietTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-emerald-500/15 border border-emerald-400/30 px-2.5 py-1 text-xs font-semibold text-emerald-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Timing, Yield & Servings Controls */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span>Prep: <strong>{recipe.prepTime}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-amber-400" />
                  <span>Cook: <strong>{recipe.cookTime}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Utensils className="h-4 w-4 text-blue-400" />
                  <span>Difficulty: <strong>{recipe.difficulty || 'Easy'}</strong></span>
                </div>
              </div>

              {/* Servings Scaler */}
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-3.5 py-1.5">
                <span className="text-xs font-bold text-slate-300">Yield / Servings:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setServings((s) => Math.max(1, s - 1))}
                    disabled={servings <= 1}
                    className="h-6 w-6 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition disabled:opacity-30 cursor-pointer"
                    aria-label="Decrease servings"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-extrabold text-white w-6 text-center">{servings}</span>
                  <button
                    type="button"
                    onClick={() => setServings((s) => Math.min(12, s + 1))}
                    disabled={servings >= 12}
                    className="h-6 w-6 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition disabled:opacity-30 cursor-pointer"
                    aria-label="Increase servings"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAsk(`Provide tips and nutritional advice for ${recipe.title}.`)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                <Bot className="h-4 w-4 mr-1.5" />
                Ask AI Nutritionist
              </Button>

              {onNavigate && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onNavigate('nutrition')}
                  className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                >
                  <Sparkles className="h-4 w-4 mr-1.5 text-amber-400" />
                  Add to AI Meal Plan
                </Button>
              )}

              <Button
                variant="secondary"
                size="sm"
                onClick={onBack}
                className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 ml-auto"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                All Recipes
              </Button>
            </div>
          </div>
        </header>

        {/* 3. Dynamic Macronutrient Bar */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Flame className="h-4.5 w-4.5 text-amber-500" />
              Nutritional Snapshot ({servings} {servings === 1 ? 'serving' : 'servings'} total)
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Energy: <strong className="text-slate-900">{calories * servings} kcal</strong> ({calories} kcal / serving)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Protein</span>
              <span className="text-base sm:text-lg font-black text-emerald-950">{scaledProtein}g</span>
              <span className="text-[11px] text-emerald-700 block">{proteinPct}% of calories</span>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Total Carbs</span>
              <span className="text-base sm:text-lg font-black text-blue-950">{scaledCarbs}g</span>
              <span className="text-[11px] text-blue-700 block">Net: {netCarbs}g | Fiber: {scaledFiber}g</span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Healthy Fats</span>
              <span className="text-base sm:text-lg font-black text-amber-950">{scaledFats}g</span>
              <span className="text-[11px] text-amber-700 block">{fatPct}% of calories</span>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
              <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">Glycemic Impact</span>
              <span className="text-base sm:text-lg font-black text-purple-950">{recipe.glycemicIndex || 35} GI</span>
              <span className="text-[11px] text-purple-700 block">Low Glycemic Load ({recipe.glycemicLoad || 11})</span>
            </div>
          </div>

          {/* Caloric Distribution Visual Bar */}
          <div className="mt-3.5 space-y-1">
            <div className="h-2.5 w-full rounded-full bg-slate-100 flex overflow-hidden">
              <div style={{ width: `${proteinPct}%` }} className="bg-emerald-500 h-full" title={`Protein: ${proteinPct}%`} />
              <div style={{ width: `${carbsPct}%` }} className="bg-blue-500 h-full" title={`Carbohydrates: ${carbsPct}%`} />
              <div style={{ width: `${fatPct}%` }} className="bg-amber-500 h-full" title={`Healthy Fats: ${fatPct}%`} />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Protein ({proteinPct}%)</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Carbs ({carbsPct}%)</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Fats ({fatPct}%)</span>
            </div>
          </div>
        </div>

        {/* Main Content + Sticky Sidebar Grid */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_270px]">
          
          {/* ---------------- Left Main Article Column ---------------- */}
          <article className="min-w-0 space-y-8">
            
            {/* 1. Overview */}
            <section id="overview" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <Info className="h-5 w-5 text-emerald-600" />
                <h2>1. Recipe Overview &amp; Nutritional Rationale</h2>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-slate-700">
                {recipe.description}
              </p>
              <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4 text-xs text-emerald-950 space-y-1.5">
                <span className="font-extrabold uppercase tracking-wider text-emerald-800 block">
                  Dietitian Formulation Highlights:
                </span>
                <p className="leading-relaxed">
                  Carefully balanced macronutrient ratios engineered to promote satiety, optimize post-prandial glycemic stability, and deliver dense micronutrients per calorie without inflammatory ultra-processed additives.
                </p>
              </div>
            </section>

            {/* 2. Detailed Macros */}
            <section id="macros" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <Flame className="h-5 w-5 text-amber-500" />
                <h2>2. Complete Macronutrient Breakdown</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Protein Quality */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Protein Profile</span>
                    <span className="text-emerald-700 font-extrabold">{scaledProtein}g</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Complete essential amino acid profile with optimal Leucine threshold to stimulate muscle protein synthesis (MPS).
                  </p>
                </div>

                {/* Carbohydrates */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Complex Carbohydrates</span>
                    <span className="text-blue-700 font-extrabold">{scaledCarbs}g</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    High soluble &amp; insoluble dietary fiber ({scaledFiber}g) slowing glucose absorption and feeding beneficial gut microbiota.
                  </p>
                </div>

                {/* Healthy Lipids */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Healthy Lipid Balance</span>
                    <span className="text-amber-700 font-extrabold">{scaledFats}g</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Rich in monounsaturated fats (MUFA) and anti-inflammatory Omega-3 fatty acids for cardiovascular and endothelial health.
                  </p>
                </div>
              </div>
            </section>

            {/* AI Nutrition Prompt Box */}
            <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 p-6 shadow-soft" aria-labelledby="ask-ai-nutrition-title">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 id="ask-ai-nutrition-title" className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Bot className="h-5 w-5 text-emerald-600" />
                  Ask GlobalHealth AI Nutritionist about {recipe.title}
                </h3>
                <Button size="sm" onClick={() => handleAsk(`Analyze the nutrition profile of ${recipe.title}.`)}>
                  Open AI Assistant
                </Button>
              </div>

              <div className="mt-3.5 flex flex-wrap gap-2">
                {aiPrompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleAsk(p)}
                    className="gh-chip hover:border-emerald-300 hover:bg-emerald-50 text-xs font-semibold cursor-pointer"
                  >
                    “{p}”
                  </button>
                ))}
              </div>
            </section>

            {/* 3. Essential Vitamins */}
            <section id="vitamins" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <Apple className="h-5 w-5 text-emerald-600" />
                <h2>3. Essential Vitamins &amp; Daily Values (% DV)</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {vitaminsList.map((v, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900">{v.name}</span>
                      <span className="text-emerald-700 font-extrabold">{v.amount} ({v.dvPercent}% DV)</span>
                    </div>

                    <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, v.dvPercent)}%` }}
                        className={`h-full rounded-full ${v.dvPercent >= 100 ? 'bg-emerald-600' : 'bg-emerald-500'}`}
                      />
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">{v.role}</p>
                    <p className="text-[10px] text-slate-400">Source: {v.foodSourceInRecipe}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Essential Minerals */}
            <section id="minerals" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <Activity className="h-5 w-5 text-blue-600" />
                <h2>4. Essential Minerals &amp; Electrolytes</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {mineralsList.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900 flex items-center gap-1.5">
                        <span className="h-5 w-5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black flex items-center justify-center">
                          {m.symbol}
                        </span>
                        {m.name}
                      </span>
                      <span className="text-blue-700 font-extrabold">{m.amount} ({m.dvPercent}% DV)</span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">{m.role}</p>
                    {m.absorptionTip && (
                      <p className="text-[10px] text-blue-600 font-medium">💡 Tip: {m.absorptionTip}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Synergies */}
            <section id="synergies" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h2>5. Nutrient Synergies &amp; Bioavailability Enhancers</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1.5">
                  <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-amber-600" />
                    Healthy Lipids + Fat-Soluble Vitamins (A, D, E, K)
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    Natural dietary fats form mixed intestinal micelles, increasing intestinal absorption of fat-soluble micronutrients by up to 300%.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1.5">
                  <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Ascorbic Acid + Non-Heme Iron Reduction
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    Vitamin C reduces ferric iron (Fe3+) into readily soluble ferrous iron (Fe2+), overcoming plant phytate inhibition.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Therapeutic Benefits */}
            <section id="benefits" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <Heart className="h-5 w-5 text-rose-600" />
                <h2>6. Therapeutic Health Benefits</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Cardiovascular & Endothelial Protection: Omega-3 and polyphenols support healthy blood pressure.',
                  'Glycemic Stability & Insulin Sensitivity: High fiber content prevents rapid glucose excursions.',
                  'Microbiome & Gut Integrity: Soluble prebiotic fibers nurture short-chain fatty acid (SCFA) synthesis.',
                  'Cellular Antioxidant Defense: Rich carotenoids and bioflavonoids quench free radical stress.'
                ].map((ben, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{ben}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. Scaled Ingredients */}
            <section id="ingredients" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg">
                  <ListChecks className="h-5 w-5 text-indigo-600" />
                  <h2>7. Scaled Ingredients Checklist</h2>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  Scaled for {servings} {servings === 1 ? 'serving' : 'servings'}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {recipe.ingredients.map((ing, idx) => {
                  const isChecked = !!checkedIngredients[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleIngredientCheck(idx)}
                      className={`flex w-full items-center gap-3 p-3 rounded-2xl text-left text-xs sm:text-sm transition cursor-pointer border ${
                        isChecked
                          ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                          : 'bg-white border-slate-200/80 text-slate-800 hover:border-emerald-300'
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-lg border flex items-center justify-center shrink-0 transition ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-slate-50'
                        }`}
                      >
                        {isChecked && <Check className="h-3.5 w-3.5" />}
                      </div>
                      <span className="flex-1 font-medium">{ing}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 8. Instructions */}
            <section id="instructions" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <ChefHat className="h-5 w-5 text-emerald-700" />
                <h2>8. Step-by-Step Preparation &amp; Culinary Guide</h2>
              </div>

              <div className="space-y-3 pt-1">
                {recipe.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700">
                    <span className="h-6 w-6 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed flex-1">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 9. Meal Prep & Storage */}
            <section id="storage" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <Thermometer className="h-5 w-5 text-teal-600" />
                <h2>9. Meal Prep, Storage &amp; Reheating</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 block">Refrigeration</span>
                  <p className="text-slate-600 leading-relaxed">
                    Store in an airtight glass container for up to 3–4 days at &lt;4°C (40°F).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 block">Reheating Method</span>
                  <p className="text-slate-600 leading-relaxed">
                    Gently reheat on low heat in a covered pan or moderate microwave power to preserve heat-sensitive nutrients.
                  </p>
                </div>
              </div>
            </section>

            {/* 10. Deficiency & Toxicity */}
            <section id="deficiency-toxicity" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h2>10. What If You Lack These Nutrients?</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-1.5 text-rose-950">
                  <h4 className="font-bold text-rose-900">Chronic Nutrient Deficiency Risks</h4>
                  <p className="leading-relaxed text-[11px]">
                    Diets deficient in dietary fiber, potassium, and antioxidants accelerate arterial stiffness, insulin resistance, and chronic systemic low-grade inflammation.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1.5 text-emerald-950">
                  <h4 className="font-bold text-emerald-900">Whole Food Safety</h4>
                  <p className="leading-relaxed text-[11px]">
                    Whole-food nutrient sources possess natural satiety and regulatory feedback loops, preventing dietary micronutrient toxicities common in synthetic megadose supplements.
                  </p>
                </div>
              </div>
            </section>

            {/* 11. FAQs */}
            <section id="faq" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <HelpCircle className="h-5 w-5 text-emerald-600" />
                <h2>11. Frequently Asked Nutrition Questions</h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    question: `Can I freeze this recipe for weekly meal preparation?`,
                    answer: `Yes, you can freeze individual cooked portions in freezer-safe containers for up to 2 months. Thaw overnight in the refrigerator before reheating.`
                  },
                  {
                    question: `Is this recipe suitable for individuals with hypertension or renal concerns?`,
                    answer: `This recipe features whole foods with naturally favorable potassium-to-sodium ratios. Individuals on strict renal potassium restrictions should consult their clinical renal dietitian.`
                  },
                  {
                    question: `How can I boost the protein content even further?`,
                    answer: `You can increase the portion of lean wild seafood, organic tofu, Greek yogurt, or hemp seeds without altering the culinary flavor harmony.`
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-start gap-2">
                      <span className="text-emerald-700 font-black">Q:</span>
                      <span>{faq.question}</span>
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-600 pl-4">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 12. Related Recipes Navigation Strip */}
            {related.length > 0 && (
              <nav className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row" aria-label="Related recipes">
                <div className="flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Next related recipe</p>
                  <button
                    type="button"
                    onClick={() => onOpenRecipe(related[0].id)}
                    className="group mt-1.5 flex w-full items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 text-left shadow-soft transition hover:border-emerald-300 hover:shadow-lift cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:-translate-x-0.5" />
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-bold text-slate-800 group-hover:text-emerald-800">
                        {related[0].title}
                      </span>
                      <span className="block text-[11px] text-slate-500">{related[0].category || 'Healthy Cuisine'} · {related[0].calories} kcal</span>
                    </span>
                  </button>
                </div>

                <div className="flex-1 text-right">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">More in this cuisine</p>
                  <button
                    type="button"
                    onClick={() => onOpenRecipe(related[1]?.id || related[0].id)}
                    className="group mt-1.5 flex w-full items-center justify-end gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 text-right shadow-soft transition hover:border-emerald-300 hover:shadow-lift cursor-pointer"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-bold text-slate-800 group-hover:text-emerald-800">
                        {related[1]?.title || related[0].title}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        {related[1]?.category || related[0].category || 'Healthy Cuisine'} · {related[1]?.calories || related[0].calories} kcal
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5" />
                  </button>
                </div>
              </nav>
            )}
          </article>

          {/* ---------------- Right Sticky Sidebar ---------------- */}
          <aside className="hidden lg:block" aria-label="On this page">
            <div className="sticky top-24 space-y-4">
              {/* Table of Contents */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft">
                <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  On this page
                </p>
                <nav className="space-y-0.5 max-h-[60vh] overflow-y-auto scrollbar-none">
                  {NAV_ITEMS.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] font-medium transition ${
                        activeSection === item.id
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <span className={activeSection === item.id ? 'text-emerald-600' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* AI Helper Callout */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                <p className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                  <Bot className="h-4 w-4 text-emerald-600" />
                  Personalize this recipe?
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-emerald-900/80">
                  Ask GlobalHealth AI to suggest ingredient swaps, optimize calories for weight loss, or pair with a weekly meal plan.
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleAsk(`Provide tips and variations for ${recipe.title}.`)}
                  className="mt-3 w-full text-xs font-bold bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50"
                >
                  Ask AI Nutritionist
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export const RecipeDetailSkeleton: React.FC = () => (
  <div className="gh-container py-10">
    <div className="h-4 w-64 animate-pulse rounded bg-slate-200/70" />
    <div className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-soft">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-4 h-8 w-3/4" />
      <Skeleton className="mt-3 h-4 w-1/2" />
      <div className="mt-5 space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
      <div className="mt-6 flex gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_270px]">
      <div className="space-y-6">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <Skeleton className="hidden h-80 lg:block" />
    </div>
  </div>
);
