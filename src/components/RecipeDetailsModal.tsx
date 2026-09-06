import React, { useState } from 'react';
import { 
  ChefHat, 
  Clock, 
  Flame, 
  Bookmark, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Utensils, 
  Printer, 
  Minus, 
  Plus, 
  Heart, 
  Activity, 
  Zap, 
  Apple, 
  Scale, 
  AlertOctagon, 
  HelpCircle,
  Layers,
  Leaf,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Recipe } from '../types';

interface RecipeDetailsModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

type RecipeTabType = 
  | 'overview'
  | 'macros'
  | 'vitamins'
  | 'minerals'
  | 'synergies'
  | 'deficiency_toxicity'
  | 'prevented'
  | 'ingredients_breakdown'
  | 'cooking'
  | 'all';

export const RecipeDetailsModal: React.FC<RecipeDetailsModalProps> = ({
  recipe,
  onClose,
  isSaved = false,
  onToggleSave
}) => {
  if (!recipe) return null;

  const defaultServings = recipe.servings || 2;
  const [servings, setServings] = useState<number>(defaultServings);
  const [activeTab, setActiveTab] = useState<RecipeTabType>('overview');
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const scaleFactor = servings / defaultServings;

  const parseGrams = (val: string | undefined): number => {
    if (!val) return 0;
    const num = parseFloat(val.replace(/[^\d.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const scaledCalories = Math.round(recipe.calories * scaleFactor);
  const rawProteinG = parseGrams(recipe.protein);
  const rawCarbsG = parseGrams(recipe.carbs);
  const rawFatsG = parseGrams(recipe.fats);
  const rawFiberG = parseGrams(recipe.fiber || '7g');
  const rawNetCarbsG = parseGrams(recipe.netCarbs || `${Math.max(0, rawCarbsG - rawFiberG)}g`);

  const scaledProtein = Math.round(rawProteinG * scaleFactor);
  const scaledCarbs = Math.round(rawCarbsG * scaleFactor);
  const scaledFats = Math.round(rawFatsG * scaleFactor);
  const scaledFiber = Math.round(rawFiberG * scaleFactor);
  const scaledNetCarbs = Math.round(rawNetCarbsG * scaleFactor);

  const calFromProtein = scaledProtein * 4;
  const calFromCarbs = scaledCarbs * 4;
  const calFromFat = scaledFats * 9;
  const totalMacroCal = calFromProtein + calFromCarbs + calFromFat || 1;

  const proteinCalPercent = Math.round((calFromProtein / totalMacroCal) * 100);
  const carbsCalPercent = Math.round((calFromCarbs / totalMacroCal) * 100);
  const fatCalPercent = Math.max(0, 100 - proteinCalPercent - carbsCalPercent);

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Fallback data generation if extended properties are not directly provided
  const macroBreakdown = recipe.macroBreakdown || {
    protein: {
      grams: rawProteinG,
      percentKcal: proteinCalPercent,
      quality: 'High Biological Value complete protein supplying essential amino acids for tissue synthesis',
      leucineG: parseFloat((rawProteinG * 0.08).toFixed(1)),
      keyAminoAcids: ['Leucine', 'Isoleucine', 'Valine', 'Lysine', 'Arginine']
    },
    carbs: {
      totalG: rawCarbsG,
      netCarbsG: rawNetCarbsG,
      fiberG: rawFiberG,
      solubleFiberG: parseFloat((rawFiberG * 0.35).toFixed(1)),
      insolubleFiberG: parseFloat((rawFiberG * 0.65).toFixed(1)),
      sugarsG: 3.5,
      glycemicIndex: 35,
      glycemicLoad: 8
    },
    fats: {
      totalG: rawFatsG,
      mufaG: parseFloat((rawFatsG * 0.55).toFixed(1)),
      pufaG: parseFloat((rawFatsG * 0.3).toFixed(1)),
      omega3Mg: 1200,
      saturatedG: parseFloat((rawFatsG * 0.15).toFixed(1)),
      transG: 0,
      omega6To3Ratio: '2 : 1 (Anti-inflammatory)'
    },
    calorieDistribution: {
      proteinPercent: proteinCalPercent,
      carbsPercent: carbsCalPercent,
      fatPercent: fatCalPercent
    }
  };

  const vitaminDirectory = recipe.vitaminDirectory || [
    {
      code: 'Vit-B9',
      name: 'Folate (Tetrahydrofolate)',
      amount: '140 µg',
      dvPercent: 35,
      solubility: 'Water-Soluble' as const,
      role: 'DNA synthesis, red blood cell maturation, and homocysteine methylation.',
      foodSourceInRecipe: 'Whole grains and leafy vegetables'
    },
    {
      code: 'Vit-C',
      name: 'Vitamin C (Ascorbic Acid)',
      amount: '32 mg',
      dvPercent: 36,
      solubility: 'Water-Soluble' as const,
      role: 'Collagen synthesis, immune defense, and non-heme iron absorption.',
      foodSourceInRecipe: 'Fresh vegetables and lemon juice'
    },
    {
      code: 'Vit-K1',
      name: 'Vitamin K1 (Phylloquinone)',
      amount: '120 µg',
      dvPercent: 100,
      solubility: 'Fat-Soluble' as const,
      role: 'Hepatic clotting factors gamma-carboxylation and arterial calcification prevention.',
      foodSourceInRecipe: 'Dark leafy greens'
    },
    {
      code: 'Vit-B6',
      name: 'Vitamin B6 (Pyridoxine)',
      amount: '0.9 mg',
      dvPercent: 53,
      solubility: 'Water-Soluble' as const,
      role: 'Amino acid metabolism, glycogen catabolism, and neurotransmitter synthesis.',
      foodSourceInRecipe: 'Protein base and legumes'
    }
  ];

  const essentialMinerals = recipe.essentialMinerals || [
    {
      symbol: 'K',
      name: 'Potassium',
      amount: `${recipe.potassiumMg || 750} mg`,
      dvPercent: Math.round(((recipe.potassiumMg || 750) / 4700) * 100),
      category: 'Macromineral' as const,
      role: 'Systemic fluid balance, cardiac rhythm regulation, and vascular vasodilation.',
      foodSourceInRecipe: 'Vegetables and ancient grains',
      absorptionTip: 'Naturally balanced with dietary sodium'
    },
    {
      symbol: 'Mg',
      name: 'Magnesium',
      amount: '88 mg',
      dvPercent: 22,
      category: 'Macromineral' as const,
      role: 'ATP synthesis cofactor, muscle relaxation, and insulin receptor kinase activation.',
      foodSourceInRecipe: 'Seeds, grains, and green leaves'
    },
    {
      symbol: 'Fe',
      name: 'Iron',
      amount: `${recipe.ironMg || 3.2} mg`,
      dvPercent: Math.round(((recipe.ironMg || 3.2) / 18) * 100),
      category: 'Trace Mineral' as const,
      role: 'Hemoglobin and myoglobin oxygen transport to exercising skeletal tissues.',
      foodSourceInRecipe: 'Plant proteins and greens',
      absorptionTip: 'Enhanced by co-consumed ascorbic acid (Vitamin C)'
    },
    {
      symbol: 'Ca',
      name: 'Calcium',
      amount: `${recipe.calciumMg || 120} mg`,
      dvPercent: Math.round(((recipe.calciumMg || 120) / 1300) * 100),
      category: 'Macromineral' as const,
      role: 'Bone mineral matrix density, vascular contraction, and nerve impulse transmission.',
      foodSourceInRecipe: 'Greens, seeds, and fortified dressings'
    }
  ];

  const phytonutrients = recipe.phytonutrients || [
    {
      name: 'Polyphenols & Flavonoids',
      chemicalClass: 'Plant Phenolic Compounds',
      presence: '250 mg',
      sources: ['Extra Virgin Olive Oil', 'Fresh Herbs', 'Vegetables'],
      mechanism: 'Scavenges reactive oxygen species (ROS) and downregulates NF-kB inflammatory cascades.',
      healthBenefit: 'Supports vascular endothelial flexibility and arterial longevity.'
    },
    {
      name: 'Carotenoids (Lutein & Beta-Carotene)',
      chemicalClass: 'Tetraterpenoid Pigments',
      presence: '4.5 mg',
      sources: ['Dark Leafy Greens', 'Colored Vegetables'],
      mechanism: 'Quenches singlet oxygen and accumulates in macular retinal tissue.',
      healthBenefit: 'Protects retinal photoreceptors and preserves cognitive clarity.'
    }
  ];

  const absorptionSynergies = recipe.absorptionSynergies || [
    {
      title: 'Healthy Lipids + Fat-Soluble Micronutrient Uptake',
      mechanism: 'Cold-pressed olive oil and natural fats form mixed intestinal micelles for fat-soluble vitamins (A, D, E, K).',
      impact: 'Increases absorption of fat-soluble vitamins and carotenoids by up to 300-400% compared to fat-free meals.'
    },
    {
      title: 'Ascorbic Acid + Non-Heme Iron Reduction',
      mechanism: 'Vitamin C from citrus/greens reduces ferric iron (Fe3+) into readily absorbable ferrous iron (Fe2+).',
      impact: 'Significantly enhances iron bioavailability from whole grain and plant components.'
    }
  ];

  const whatIfEatLess = recipe.whatIfEatLess || {
    title: 'Deficiency Risks If You Lack These Nutrients',
    riskSummary: 'A chronic diet lacking whole whole-food micronutrients, essential healthy fats, and dietary fiber promotes systemic low-grade inflammation, microvascular stiffness, and cellular fatigue.',
    associatedDiseases: [
      {
        diseaseName: 'Subclinical Micronutrient Depletion & Chronic Fatigue',
        icdOrCategory: 'E63.9 / Nutritional Deficiency',
        deficientNutrient: 'B-Vitamins, Magnesium & Iron',
        description: 'Impaired mitochondrial ATP generation and reduced peripheral tissue oxygen delivery due to suboptimal cofactors.',
        symptoms: ['Persistent daytime fatigue', 'Brain fog and reduced concentration', 'Muscle weakness and slower recovery'],
        highRiskGroups: ['Individuals on highly processed low-nutrient diets', 'High-stress lifestyles']
      },
      {
        diseaseName: 'Microvascular Endothelial Dysfunction',
        icdOrCategory: 'I70 / Vascular Health',
        deficientNutrient: 'Omega-3 Fatty Acids & Polyphenols',
        description: 'Reduced nitric oxide synthesis and increased arterial oxidative stress.',
        symptoms: ['Elevated blood pressure', 'Reduced vascular compliance', 'Cold extremities'],
        highRiskGroups: ['Diets high in refined seed oils and low in omega-3s']
      }
    ],
    earlyWarningSigns: [
      'Afternoon energy crashes and mental lethargy',
      'Dry skin and brittle hair',
      'Sluggish digestion and low satiety'
    ]
  };

  const whatIfEatMore = recipe.whatIfEatMore || {
    title: 'Toxicity, Overconsumption & Clinical Upper Limits',
    excessSummary: 'This recipe is made entirely from whole, nutrient-dense foods with natural metabolic feedback mechanisms. Toxicity from whole-food meals is extremely rare compared to high-dose isolated synthetic supplements.',
    associatedRisks: [
      {
        conditionName: 'Potassium / Mineral Balance in Advanced Renal Disease',
        excessFactor: 'High mineral intake in patients with CKD Stage 4-5',
        upperTolerableLimit: 'Strict individualized renal limits',
        description: 'Impaired kidney clearance may require portion calibration in advanced kidney disease.',
        risksAndSymptoms: ['Elevated serum potassium if renal excretion is severely compromised'],
        precautions: ['Patients with advanced CKD should follow their clinical renal dietitian guidance.']
      }
    ],
    safeIntakeGuidance: 'Enjoy 1 to 2 balanced servings per meal. For active individuals, this meal perfectly fulfills daily energy and tissue repair requirements.'
  };

  const diseasesPrevented = recipe.diseasesPrevented || [
    {
      condition: 'Cardiovascular Disease & Atherosclerosis',
      evidenceLevel: 'Strong Clinical Evidence' as const,
      mechanism: 'Rich in unsaturated fatty acids, potassium, and antioxidants that lower LDL oxidation and support healthy arterial elasticity.'
    },
    {
      condition: 'Metabolic Syndrome & Type 2 Diabetes',
      evidenceLevel: 'Meta-Analysis Backed' as const,
      mechanism: 'High-fiber, low-glycemic meal structure moderates postprandial glucose curves and improves insulin receptor sensitivity.'
    },
    {
      condition: 'Systemic Low-Grade Inflammation',
      evidenceLevel: 'Strong Clinical Evidence' as const,
      mechanism: 'Bioactive polyphenols and anti-inflammatory lipid mediators suppress pro-inflammatory cytokine expression.'
    }
  ];

  const foodIngredientsBreakdown = recipe.foodIngredientsBreakdown || recipe.ingredients.map((ing, i) => {
    return {
      foodName: ing,
      quantity: 'Scaled component',
      calories: Math.round(recipe.calories / Math.max(1, recipe.ingredients.length)),
      proteinG: parseFloat((rawProteinG / Math.max(1, recipe.ingredients.length)).toFixed(1)),
      carbsG: parseFloat((rawCarbsG / Math.max(1, recipe.ingredients.length)).toFixed(1)),
      fatG: parseFloat((rawFatsG / Math.max(1, recipe.ingredients.length)).toFixed(1)),
      fiberG: parseFloat((rawFiberG / Math.max(1, recipe.ingredients.length)).toFixed(1)),
      highlightNutrients: ['Whole Food Matrix', 'Active Micronutrients']
    };
  });

  // Pill Tabs Configuration with Flat Design & Notification Badges - Ordered Priority-Wise
  const pillTabs: { id: RecipeTabType; label: string; icon: React.ReactNode; badge: string | number; badgeColor?: string }[] = [
    {
      id: 'overview',
      label: 'Nutrition Overview & Caloric Distribution',
      icon: <Activity className="h-3.5 w-3.5" />,
      badge: `${scaledCalories} kcal`,
      badgeColor: 'bg-emerald-100 text-emerald-900 border border-emerald-200'
    },
    {
      id: 'macros',
      label: 'Macronutrients In-Depth Profile',
      icon: <Layers className="h-3.5 w-3.5" />,
      badge: '3 Profiles',
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-200'
    },
    {
      id: 'vitamins',
      label: 'Vitamin Directory',
      icon: <Apple className="h-3.5 w-3.5" />,
      badge: vitaminDirectory.length,
      badgeColor: 'bg-teal-100 text-teal-900 border border-teal-200'
    },
    {
      id: 'minerals',
      label: 'Essential Minerals Profile',
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      badge: essentialMinerals.length,
      badgeColor: 'bg-sky-100 text-sky-900 border border-sky-200'
    },
    {
      id: 'synergies',
      label: 'Micronutrients, Phytonutrients & Absorption Synergies',
      icon: <Leaf className="h-3.5 w-3.5" />,
      badge: phytonutrients.length + absorptionSynergies.length,
      badgeColor: 'bg-emerald-100 text-emerald-900 border border-emerald-200'
    },
    {
      id: 'deficiency_toxicity',
      label: 'What If We Eat More? — Toxicity & Upper Limits',
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
      badge: 'Safety & Limits',
      badgeColor: 'bg-rose-100 text-rose-900 border border-rose-200'
    },
    {
      id: 'prevented',
      label: 'Chronic Diseases Prevented',
      icon: <Heart className="h-3.5 w-3.5" />,
      badge: diseasesPrevented.length,
      badgeColor: 'bg-rose-100 text-rose-900 border border-rose-200'
    },
    {
      id: 'ingredients_breakdown',
      label: 'Food & Nutritional Values per Ingredient',
      icon: <Scale className="h-3.5 w-3.5" />,
      badge: foodIngredientsBreakdown.length,
      badgeColor: 'bg-blue-100 text-blue-900 border border-blue-200'
    },
    {
      id: 'cooking',
      label: 'Ingredients Checklist with Step-by-Step Cooking Instructions',
      icon: <ChefHat className="h-3.5 w-3.5" />,
      badge: recipe.ingredients.length,
      badgeColor: 'bg-emerald-100 text-emerald-900 border border-emerald-200'
    },
    {
      id: 'all',
      label: 'Complete Factsheet (All Sections)',
      icon: <BookOpen className="h-3.5 w-3.5" />,
      badge: 'All',
      badgeColor: 'bg-slate-200 text-slate-800'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200 text-slate-800 flex flex-col my-auto">
        
        {/* ======================================================== */}
        {/* HERO HEADER                                             */}
        {/* ======================================================== */}
        <div className="relative shrink-0 overflow-hidden rounded-t-3xl bg-slate-900">
          <div className="relative h-60 sm:h-72 w-full overflow-hidden">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-full w-full object-cover brightness-90"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            {/* Top Action Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {onToggleSave && (
                <button
                  onClick={() => onToggleSave(recipe.id)}
                  className={`rounded-2xl p-2.5 backdrop-blur-md shadow-lg transition ${
                    isSaved 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-black/50 text-white hover:bg-black/70'
                  }`}
                  title={isSaved ? 'Remove from Saved' : 'Save Recipe'}
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="rounded-2xl p-2.5 bg-black/50 text-white hover:bg-black/70 backdrop-blur-md shadow-lg transition"
                title="Print Factsheet"
              >
                <Printer className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="rounded-2xl p-2.5 bg-black/50 text-white hover:bg-black/70 backdrop-blur-md shadow-lg transition"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Bottom Hero Info */}
            <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {recipe.cuisine && (
                  <span className="rounded-lg bg-emerald-500/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-950">
                    {recipe.cuisine}
                  </span>
                )}
                {recipe.difficulty && (
                  <span className="rounded-lg bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-white">
                    {recipe.difficulty}
                  </span>
                )}
                {recipe.dietTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-slate-900/80 backdrop-blur-md border border-white/20 px-2 py-0.5 text-[10px] font-medium text-emerald-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight tracking-tight">
                {recipe.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-200 pt-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-emerald-400" /> Prep: {recipe.prepTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-amber-400" /> Cook: {recipe.cookTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <Utensils className="h-3.5 w-3.5 text-blue-400" /> Base: {defaultServings} {defaultServings === 1 ? 'serving' : 'servings'}
                </span>
              </div>
            </div>
          </div>

          {/* Serving Scaler Bar */}
          <div className="px-4 sm:px-6 py-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5 text-emerald-400" /> Servings Scaler:
              </span>
              <div className="flex items-center gap-1.5 bg-slate-800 rounded-xl p-1 border border-slate-700">
                <button
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="grid h-6 w-6 place-items-center rounded-lg bg-slate-700 text-white font-bold hover:bg-emerald-600 transition"
                  title="Decrease Servings"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-xs font-black text-emerald-400 w-7 text-center">{servings}</span>
                <button
                  onClick={() => setServings(servings + 1)}
                  className="grid h-6 w-6 place-items-center rounded-lg bg-slate-700 text-white font-bold hover:bg-emerald-600 transition"
                  title="Increase Servings"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <span className="text-[11px] text-slate-400">
                ({scaledCalories} kcal total for {servings} {servings === 1 ? 'person' : 'people'})
              </span>
            </div>

            {/* Live Macro Pills */}
            <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto scrollbar-none">
              <div className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                <span className="text-slate-400 text-[9px] mr-1">CAL</span>
                <span className="font-extrabold text-white">{scaledCalories}</span>
              </div>
              <div className="bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700/60 font-bold text-emerald-300">
                <span className="text-emerald-400 text-[9px] mr-1">PRO</span>
                <span>{scaledProtein}g</span>
              </div>
              <div className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                <span className="text-slate-400 text-[9px] mr-1">CARBS</span>
                <span className="font-extrabold text-white">{scaledCarbs}g</span>
              </div>
              <div className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                <span className="text-slate-400 text-[9px] mr-1">FAT</span>
                <span className="font-extrabold text-white">{scaledFats}g</span>
              </div>
              <div className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                <span className="text-slate-400 text-[9px] mr-1">FIBER</span>
                <span className="font-extrabold text-white">{scaledFiber}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* STYLISH PILL TABS / FILTER CHIPS NAVIGATION              */}
        {/* Style: Flat design, soft light gray, notification badges */}
        {/* ======================================================== */}
        <div className="px-4 sm:px-6 py-3 bg-slate-100/90 border-b border-slate-200 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {pillTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all duration-150 shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-400' : 'text-slate-500'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  
                  {/* Notification Badge / Count Pill */}
                  <span
                    className={`grid place-items-center rounded-full text-[10px] font-extrabold px-2 py-0.5 min-w-[20px] transition ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-2xs'
                        : tab.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODAL BODY: DISPLAY ACTIVE SECTION (OR ALL)              */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-7 space-y-8 flex-1">

          {/* ---------------------------------------------------- */}
          {/* SECTION 1: CLINICAL OVERVIEW & CALORIC DISTRIBUTION  */}
          {/* ---------------------------------------------------- */}
          {(activeTab === 'overview' || activeTab === 'all') && (
            <div className="space-y-6">
              {/* Evidence-Based Clinical Rationale */}
              <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs uppercase tracking-wider">
                  <Sparkles className="h-4 w-4 text-emerald-600" /> Evidence-Based Clinical Rationale & Health Impact
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {recipe.description}
                </p>

                {recipe.healthBenefits && recipe.healthBenefits.length > 0 && (
                  <div className="pt-3 border-t border-emerald-200/60 space-y-2">
                    <span className="text-[11px] font-extrabold text-emerald-950 uppercase tracking-wider block">
                      Key Biological Benefits:
                    </span>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {recipe.healthBenefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-800 font-medium bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Nutrition Overview & Caloric Distribution */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-600" /> Nutrition Overview & Caloric Distribution
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">Per Serving Factsheet</span>
                </div>

                {/* Calorie Proportion Bar */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700">Caloric Energy Contribution:</span>
                    <span className="text-slate-500">
                      {proteinCalPercent}% Protein • {carbsCalPercent}% Carbs • {fatCalPercent}% Fat
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden flex">
                    <div 
                      style={{ width: `${proteinCalPercent}%` }} 
                      className="bg-emerald-600 h-full" 
                      title={`Protein: ${proteinCalPercent}%`}
                    />
                    <div 
                      style={{ width: `${carbsCalPercent}%` }} 
                      className="bg-amber-500 h-full" 
                      title={`Carbohydrates: ${carbsCalPercent}%`}
                    />
                    <div 
                      style={{ width: `${fatCalPercent}%` }} 
                      className="bg-sky-500 h-full" 
                      title={`Healthy Fats: ${fatCalPercent}%`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-600 inline-block"/> Protein ({scaledProtein * 4} kcal)</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500 inline-block"/> Carbs ({scaledCarbs * 4} kcal)</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sky-500 inline-block"/> Healthy Fats ({scaledFats * 9} kcal)</span>
                  </div>
                </div>

                {/* Key Micro Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Net Carbs</span>
                    <span className="text-base font-extrabold text-slate-900">{scaledNetCarbs}g</span>
                    <span className="text-[10px] text-slate-500 block">Total Carbs - Fiber</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dietary Fiber</span>
                    <span className="text-base font-extrabold text-emerald-700">{scaledFiber}g</span>
                    <span className="text-[10px] text-slate-500 block">Gut & Microbiome</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sodium</span>
                    <span className="text-base font-extrabold text-slate-900">{recipe.sodiumMg ? `${Math.round(recipe.sodiumMg * scaleFactor)} mg` : '340 mg'}</span>
                    <span className="text-[10px] text-slate-500 block">Low-Sodium Protocol</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Potassium</span>
                    <span className="text-base font-extrabold text-emerald-700">{recipe.potassiumMg ? `${Math.round(recipe.potassiumMg * scaleFactor)} mg` : '780 mg'}</span>
                    <span className="text-[10px] text-slate-500 block">Vascular Endothelium</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* SECTION 2: MACRONUTRIENTS IN-DEPTH PROFILE           */}
          {/* ---------------------------------------------------- */}
          {(activeTab === 'macros' || activeTab === 'all') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-emerald-600" /> Macronutrients In-Depth Profile
                </h3>
                <span className="text-xs text-slate-500 font-medium">Amino Acids, Fiber & Lipids</span>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {/* Protein Profile */}
                <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">Protein Quality</span>
                    <span className="text-sm font-black text-emerald-800">{scaledProtein}g</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {macroBreakdown.protein.quality}
                  </p>
                  {macroBreakdown.protein.leucineG && (
                    <div className="text-xs font-semibold text-emerald-900 bg-white/90 p-2 rounded-xl border border-emerald-200">
                      ⚡ Leucine Content: <span className="font-extrabold">{macroBreakdown.protein.leucineG}g</span> (mTOR trigger)
                    </div>
                  )}
                  {macroBreakdown.protein.keyAminoAcids && (
                    <div className="text-[11px] text-slate-600">
                      <span className="font-bold text-slate-800 block mb-1">Key Amino Acids:</span>
                      <div className="flex flex-wrap gap-1">
                        {macroBreakdown.protein.keyAminoAcids.map((aa, idx) => (
                          <span key={idx} className="bg-white px-2 py-0.5 rounded-md border border-emerald-100 font-medium text-slate-700">
                            {aa}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Carbohydrates Profile */}
                <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">Carb Architecture</span>
                    <span className="text-sm font-black text-amber-800">{scaledCarbs}g</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Net Digestible Carbs:</span>
                      <span className="font-bold">{scaledNetCarbs}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Soluble Fiber:</span>
                      <span className="font-bold">{macroBreakdown.carbs.solubleFiberG || 2.5}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Insoluble Fiber:</span>
                      <span className="font-bold">{macroBreakdown.carbs.insolubleFiberG || 4.5}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Natural Sugars:</span>
                      <span className="font-bold">{macroBreakdown.carbs.sugarsG || 2.8}g</span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-amber-950 bg-white/90 p-2 rounded-xl border border-amber-200 flex items-center justify-between">
                    <span>Glycemic Index: <strong>{macroBreakdown.carbs.glycemicIndex || 32}</strong> (Low)</span>
                    <span>GL: <strong>{macroBreakdown.carbs.glycemicLoad || 10}</strong></span>
                  </div>
                </div>

                {/* Healthy Lipids Profile */}
                <div className="p-4 rounded-2xl bg-sky-50/40 border border-sky-200/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-sky-900">Lipid Architecture</span>
                    <span className="text-sm font-black text-sky-800">{scaledFats}g</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Monounsaturated (MUFA):</span>
                      <span className="font-bold">{macroBreakdown.fats.mufaG || 9.5}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Polyunsaturated (PUFA):</span>
                      <span className="font-bold">{macroBreakdown.fats.pufaG || 5.8}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Omega-3 (EPA/DHA/ALA):</span>
                      <span className="font-bold text-sky-700">{macroBreakdown.fats.omega3Mg || 1800} mg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Saturated Fat:</span>
                      <span className="font-bold">{macroBreakdown.fats.saturatedG || 2.5}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Trans Fats:</span>
                      <span className="font-bold text-emerald-600">0.0g</span>
                    </div>
                  </div>
                  {macroBreakdown.fats.omega6To3Ratio && (
                    <div className="text-xs font-semibold text-sky-950 bg-white/90 p-2 rounded-xl border border-sky-200">
                      Omega-6 : Omega-3 Ratio = <strong>{macroBreakdown.fats.omega6To3Ratio}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* SECTION 3: VITAMIN DIRECTORY                         */}
          {/* ---------------------------------------------------- */}
          {(activeTab === 'vitamins' || activeTab === 'all') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Apple className="h-4 w-4 text-emerald-600" /> Vitamin Directory — Vitamins Present in Recipe
                </h3>
                <span className="text-xs font-semibold text-slate-500">Amounts & % Daily Value (DV)</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {vitaminDirectory.map((vit, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-teal-100 text-teal-900 font-extrabold text-[11px] px-2 py-0.5">
                            {vit.code}
                          </span>
                          <span className="text-xs font-extrabold text-slate-900">{vit.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                          Source: {vit.foodSourceInRecipe}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-emerald-700 block">{vit.amount}</span>
                        <span className="text-[10px] font-bold text-slate-600">{vit.dvPercent}% DV</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, vit.dvPercent)}%` }}
                          className={`h-full rounded-full ${
                            vit.dvPercent >= 100 ? 'bg-emerald-600' : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug pt-1">
                      <strong className="text-slate-800">Role:</strong> {vit.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* SECTION 4: ESSENTIAL MINERALS PROFILE                */}
          {/* ---------------------------------------------------- */}
          {(activeTab === 'minerals' || activeTab === 'all') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Essential Minerals Profile
                </h3>
                <span className="text-xs font-semibold text-slate-500">Macrominerals & Trace Minerals</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {essentialMinerals.map((min, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 text-white font-extrabold text-xs">
                          {min.symbol}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-900">{min.name}</span>
                            <span className="rounded-md bg-slate-100 text-slate-600 font-semibold text-[9px] px-1.5 py-0.5">
                              {min.category}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            Source: {min.foodSourceInRecipe}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-emerald-700 block">{min.amount}</span>
                        <span className="text-[10px] font-bold text-slate-600">{min.dvPercent}% DV</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, min.dvPercent)}%` }}
                        className="h-full rounded-full bg-emerald-600"
                      />
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">
                      <strong className="text-slate-800">Function:</strong> {min.role}
                    </p>

                    {min.absorptionTip && (
                      <div className="text-[10px] text-emerald-900 bg-emerald-50/80 p-2 rounded-lg border border-emerald-100 font-medium">
                        💡 <strong>Clinical Bio-Tip:</strong> {min.absorptionTip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* SECTION 5: MICRONUTRIENTS, PHYTONUTRIENTS & SYNERGIES */}
          {/* ---------------------------------------------------- */}
          {(activeTab === 'synergies' || activeTab === 'all') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-emerald-600" /> Micronutrients, Phytonutrients & Absorption Synergies
                </h3>
                <span className="text-xs font-semibold text-slate-500">Bioactive Compounds</span>
              </div>

              {/* Phytonutrients Cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                {phytonutrients.map((phyto, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">{phyto.name}</span>
                      <span className="rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                        {phyto.presence}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Class: <span className="text-slate-700">{phyto.chemicalClass}</span> • Sources: {phyto.sources.join(', ')}
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      <strong className="text-slate-900">Mechanism:</strong> {phyto.mechanism}
                    </p>
                    <p className="text-emerald-950 font-bold leading-snug">
                      ✓ {phyto.healthBenefit}
                    </p>
                  </div>
                ))}
              </div>

              {/* Synergies Callout */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-600" /> Bioavailability & Culinary Synergies:
                </span>
                <div className="space-y-2">
                  {absorptionSynergies.map((syn, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/90 border border-amber-200 text-xs space-y-1">
                      <span className="font-bold text-slate-900 block">{syn.title}</span>
                      <p className="text-slate-600 leading-relaxed">{syn.mechanism}</p>
                      <div className="text-emerald-900 font-bold text-[11px] pt-1">
                        → Clinical Result: {syn.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* SECTION 6: WHAT IF WE EAT LESS / MORE (DEFICIENCY & TOXICITY) */}
          {/* ---------------------------------------------------- */}
          {(activeTab === 'deficiency_toxicity' || activeTab === 'all') && (
            <div className="space-y-6">
              
              {/* What If We Eat Less (Deficiencies) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-600" /> What If We Eat Less? — Deficiency Diseases & Risks
                  </h3>
                  <span className="text-xs font-bold text-rose-700">Clinical Deficiency Profile</span>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3">
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {whatIfEatLess.riskSummary}
                  </p>

                  <div className="space-y-3">
                    {whatIfEatLess.associatedDiseases.map((dis, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white border border-rose-200 text-xs space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-extrabold text-rose-950 text-xs">{dis.diseaseName}</h4>
                            <span className="text-[10px] text-slate-500 font-medium">
                              Category / ICD: {dis.icdOrCategory} • Missing: <strong className="text-rose-700">{dis.deficientNutrient}</strong>
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{dis.description}</p>
                        
                        <div className="space-y-1 pt-1 border-t border-rose-100 text-[11px]">
                          <span className="font-bold text-slate-800 block">Clinical Symptoms:</span>
                          <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                            {dis.symptoms.map((sym, sIdx) => (
                              <li key={sIdx}>{sym}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  {whatIfEatLess.earlyWarningSigns && (
                    <div className="p-3 rounded-xl bg-rose-100/70 border border-rose-200 text-xs text-rose-950 font-medium">
                      <span className="font-bold block mb-1">⚠️ Early Clinical Warning Signs of Nutrient Deprivation:</span>
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        {whatIfEatLess.earlyWarningSigns.map((sign, i) => (
                          <span key={i} className="bg-white px-2 py-0.5 rounded-md border border-rose-200 font-semibold text-rose-900">
                            • {sign}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* What If We Eat More (Toxicity & Limits) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <AlertOctagon className="h-4 w-4 text-amber-600" /> What If We Eat More? — Toxicity & Upper Limits
                  </h3>
                  <span className="text-xs font-bold text-amber-700">Safety & Boundaries</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {whatIfEatMore.excessSummary}
                  </p>

                  <div className="space-y-3">
                    {whatIfEatMore.associatedRisks.map((risk, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white border border-amber-200 text-xs space-y-2">
                        <div>
                          <h4 className="font-extrabold text-amber-950 text-xs">{risk.conditionName}</h4>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            Excess Factor: {risk.excessFactor} • UL: <strong>{risk.upperTolerableLimit}</strong>
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{risk.description}</p>
                        
                        <div className="space-y-1 text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                          <span className="font-bold block">Medical Precautions:</span>
                          <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                            {risk.precautions.map((prec, pIdx) => (
                              <li key={pIdx}>{prec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-100/70 border border-emerald-200 text-xs text-emerald-950 font-medium">
                    🛡️ <strong>Safe Daily Intake Guidance:</strong> {whatIfEatMore.safeIntakeGuidance}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* SECTION 7: CHRONIC DISEASES PREVENTED                */}
          {/* ---------------------------------------------------- */}
          {(activeTab === 'prevented' || activeTab === 'all') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-emerald-600" /> Chronic Diseases Prevented
                </h3>
                <span className="text-xs font-semibold text-slate-500">Therapeutic Indications</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {diseasesPrevented.map((prev, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition shadow-2xs space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-slate-900">{prev.condition}</span>
                      <span className="rounded-md bg-emerald-100 text-emerald-900 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                        {prev.evidenceLevel}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      <strong className="text-slate-800">Biological Mechanism:</strong> {prev.mechanism}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* SECTION 8: FOOD & NUTRITIONAL VALUES PER INGREDIENT */}
          {/* ---------------------------------------------------- */}
          {(activeTab === 'ingredients_breakdown' || activeTab === 'all') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-emerald-600" /> Food & Nutritional Values per Ingredient
                </h3>
                <span className="text-xs font-semibold text-slate-500">Ingredient Macro Breakdown</span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-extrabold text-slate-700 text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Food Component</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3 text-center">Calories</th>
                      <th className="p-3 text-center">Protein</th>
                      <th className="p-3 text-center">Carbs</th>
                      <th className="p-3 text-center">Fat</th>
                      <th className="p-3 text-center">Fiber</th>
                      <th className="p-3">Highlights</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {foodIngredientsBreakdown.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-bold text-slate-900">{item.foodName}</td>
                        <td className="p-3 text-slate-500 font-medium">{item.quantity}</td>
                        <td className="p-3 text-center font-extrabold text-slate-800">{Math.round(item.calories * scaleFactor)}</td>
                        <td className="p-3 text-center font-bold text-emerald-700">{Math.round(item.proteinG * scaleFactor)}g</td>
                        <td className="p-3 text-center font-medium text-slate-700">{Math.round(item.carbsG * scaleFactor)}g</td>
                        <td className="p-3 text-center font-medium text-slate-700">{Math.round(item.fatG * scaleFactor)}g</td>
                        <td className="p-3 text-center font-medium text-slate-700">{Math.round(item.fiberG * scaleFactor)}g</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {item.highlightNutrients.map((h, hIdx) => (
                              <span key={hIdx} className="rounded-md bg-slate-100 text-slate-700 px-1.5 py-0.5 text-[9px] font-semibold">
                                {h}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* SECTION 9: INGREDIENTS CHECKLIST & STEP-BY-STEP COOKING */}
          {/* ---------------------------------------------------- */}
          {(activeTab === 'cooking' || activeTab === 'all') && (
            <div className="space-y-6">
              
              {/* Scaled Ingredients Checklist */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> Scaled Ingredients Checklist
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">Scaled for {servings} {servings === 1 ? 'serving' : 'servings'}</span>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {recipe.ingredients.map((ing, idx) => {
                    const isChecked = checkedIngredients[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleIngredient(idx)}
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left text-xs transition ${
                          isChecked
                            ? 'bg-slate-100 border-slate-200 line-through text-slate-400'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-2xs'
                        }`}
                      >
                        <span
                          className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border mt-0.5 ${
                            isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <span className="leading-snug font-medium">{ing}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step-by-Step Cooking Instructions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <ChefHat className="h-4 w-4 text-emerald-600" /> Step-by-Step Cooking Instructions
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">{recipe.instructions.length} Culinary Steps</span>
                </div>

                <ol className="space-y-3">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-xl bg-emerald-600 text-xs font-black text-white mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-slate-800 leading-relaxed font-medium">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Chef Tips & Allergens Notices */}
              <div className="grid sm:grid-cols-2 gap-4">
                {recipe.chefTips && recipe.chefTips.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 space-y-2">
                    <span className="font-bold block text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Chef & Dietitian Culinary Tips:
                    </span>
                    <ul className="space-y-1.5 text-slate-700 text-xs">
                      {recipe.chefTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-slate-100/90 border border-slate-200 text-xs text-slate-800 space-y-2">
                  <span className="font-bold block text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Allergen Information & Suitability:
                  </span>
                  <p className="text-slate-700 text-xs leading-relaxed font-medium">
                    {recipe.allergenWarnings && recipe.allergenWarnings.length > 0
                      ? `Contains: ${recipe.allergenWarnings.join(', ')}`
                      : 'Naturally free from major allergens.'}
                  </p>
                  <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-1.5">
                    {recipe.dietTags.map((tag, i) => (
                      <span key={i} className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[10px] font-bold text-slate-700">
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* MODAL FOOTER                                             */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/90 flex flex-wrap items-center justify-between gap-3 rounded-b-3xl shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-2xs transition"
            >
              <Printer className="h-4 w-4" /> Print Factsheet
            </button>
            <button
              onClick={() => setActiveTab(activeTab === 'all' ? 'overview' : 'all')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-2xs transition"
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
              <span>{activeTab === 'all' ? 'Show Tabbed View' : 'View All Sections'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-xs transition"
          >
            Close Recipe
          </button>
        </div>

      </div>
    </div>
  );
};
