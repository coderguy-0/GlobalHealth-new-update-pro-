import React, { useState } from 'react';
import { 
  Scale, 
  Flame, 
  Layers, 
  Apple, 
  ShieldCheck, 
  Sparkles, 
  ArrowRightLeft, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  X, 
  Award,
  Zap,
  Info
} from 'lucide-react';
import { NUTRITION_FOODS } from '../data/nutritionData';
import { NutritionFood } from '../types';

interface FoodComparisonLabViewProps {
  initialFoodAId?: string;
  initialFoodBId?: string;
  onSelectFood?: (food: NutritionFood) => void;
}

export const FoodComparisonLabView: React.FC<FoodComparisonLabViewProps> = ({
  initialFoodAId = 'food-salmon',
  initialFoodBId = 'food-lentils',
  onSelectFood
}) => {
  const [foodAId, setFoodAId] = useState<string>(initialFoodAId);
  const [foodBId, setFoodBId] = useState<string>(initialFoodBId);

  const foodA = NUTRITION_FOODS.find((f) => f.id === foodAId) || NUTRITION_FOODS[0];
  const foodB = NUTRITION_FOODS.find((f) => f.id === foodBId) || NUTRITION_FOODS[1];

  const handleSwap = () => {
    const temp = foodAId;
    setFoodAId(foodBId);
    setFoodBId(temp);
  };

  // Helper to extract or estimate sodium per 100g
  const getSodium = (food: NutritionFood): number => {
    if (food.sodiumMg !== undefined) return food.sodiumMg;
    // Standard empirical estimates per 100g whole foods if not explicitly stored
    if (food.category === 'Dairy & Alternatives') return 36;
    if (food.category === 'Proteins & Seafood') return 60;
    if (food.category === 'Whole Grains') return 5;
    if (food.category === 'Legumes & Beans') return 2;
    if (food.category === 'Vegetables') return 28;
    if (food.category === 'Nuts & Seeds') return 12;
    return 10;
  };

  // Derive "Best For" summary tags for each food
  const getBestForSummary = (food: NutritionFood): string[] => {
    const best: string[] = [];
    if (food.proteinG >= 15) best.push('High Protein & Muscle Synthesis');
    else if (food.proteinG >= 8) best.push('Moderate Plant Protein');

    if (food.calories <= 60) best.push('Low-Calorie Energy Deficit');
    else if (food.calories >= 200) best.push('Calorie-Dense Healthy Satiety');

    if (food.fiberG >= 5) best.push('High Prebiotic Fiber & Gut Microbiome');

    if (food.sugarsG <= 2) best.push('Low Sugar & Glycemic Stability');

    if (food.glycemicIndex <= 30) best.push('Diabetic-Friendly Low GI');

    if (food.monounsaturatedFatG >= 5 || food.polyunsaturatedFatG >= 3) {
      best.push('Heart-Protective Healthy Lipids');
    }

    if (food.therapeuticSuitability && food.therapeuticSuitability.length > 0) {
      food.therapeuticSuitability.slice(0, 2).forEach(t => {
        if (!best.includes(t)) best.push(t);
      });
    }

    return best.slice(0, 4);
  };

  const foodASodium = getSodium(foodA);
  const foodBSodium = getSodium(foodB);

  const foodABestFor = getBestForSummary(foodA);
  const foodBBestFor = getBestForSummary(foodB);

  // Quick compare presets
  const presets = [
    { a: 'food-salmon', b: 'food-lentils', label: 'Wild Salmon vs Brown Lentils' },
    { a: 'food-avocado', b: 'food-yogurt', label: 'Hass Avocado vs Greek Yogurt' },
    { a: 'food-quinoa', b: 'food-oats', label: 'Quinoa vs Rolled Oats' },
    { a: 'food-spinach', b: 'food-broccoli', label: 'Spinach vs Broccoli' },
    { a: 'food-walnuts', b: 'food-chia', label: 'Walnuts vs Chia Seeds' }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200">
                <Scale className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                Side-by-Side Food Comparison Lab
              </h2>
            </div>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Compare whole foods side-by-side strictly ordered by clinical nutritional priority: 
              <strong className="text-slate-800"> Calories → Protein → Fiber → Sugar → Carbs → Fat → Sodium → Vitamins → Minerals → Ingredients/Allergens → Best For</strong>.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 self-start sm:self-auto text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Presets:</span>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setFoodAId(preset.a);
                  setFoodBId(preset.b);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                  foodAId === preset.a && foodBId === preset.b
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* FOOD SELECTORS & VISUAL HEROES */}
        <div className="grid md:grid-cols-11 gap-4 items-center pt-2">
          {/* FOOD A SELECTOR & CARD */}
          <div className="md:col-span-5 p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-600 text-white text-[10px]">A</span>
                Select Primary Food:
              </label>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                {foodA.category}
              </span>
            </div>

            <select
              value={foodAId}
              onChange={(e) => setFoodAId(e.target.value)}
              aria-label="Select Primary Food"
              className="w-full rounded-2xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:outline-hidden shadow-2xs cursor-pointer"
            >
              {NUTRITION_FOODS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.category})
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200/80">
              <img 
                src={foodA.imageUrl} 
                alt={foodA.name} 
                className="h-16 w-16 rounded-xl object-cover border border-slate-100 shrink-0" 
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-extrabold text-slate-900 truncate">{foodA.name}</h4>
                <p className="text-[11px] text-slate-500">Standard Base: 100g ({foodA.servingSize})</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-600 font-semibold mt-1">
                  <span className="text-emerald-700 font-bold">{foodA.calories} kcal</span>
                  <span>•</span>
                  <span>{foodA.proteinG}g Pro</span>
                  <span>•</span>
                  <span>{foodA.carbsG}g Carb</span>
                  <span>•</span>
                  <span>{foodA.fatG}g Fat</span>
                </div>
              </div>
            </div>
          </div>

          {/* SWAP CONTROLLER */}
          <div className="md:col-span-1 flex justify-center">
            <button
              onClick={handleSwap}
              title="Swap Food A & Food B"
              className="h-10 w-10 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-emerald-700 shadow-2xs flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
          </div>

          {/* FOOD B SELECTOR & CARD */}
          <div className="md:col-span-5 p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-white text-[10px]">B</span>
                Select Secondary Food:
              </label>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">
                {foodB.category}
              </span>
            </div>

            <select
              value={foodBId}
              onChange={(e) => setFoodBId(e.target.value)}
              aria-label="Select Secondary Food"
              className="w-full rounded-2xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-bold focus:border-blue-500 focus:outline-hidden shadow-2xs cursor-pointer"
            >
              {NUTRITION_FOODS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.category})
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200/80">
              <img 
                src={foodB.imageUrl} 
                alt={foodB.name} 
                className="h-16 w-16 rounded-xl object-cover border border-slate-100 shrink-0" 
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-extrabold text-slate-900 truncate">{foodB.name}</h4>
                <p className="text-[11px] text-slate-500">Standard Base: 100g ({foodB.servingSize})</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-600 font-semibold mt-1">
                  <span className="text-blue-700 font-bold">{foodB.calories} kcal</span>
                  <span>•</span>
                  <span>{foodB.proteinG}g Pro</span>
                  <span>•</span>
                  <span>{foodB.carbsG}g Carb</span>
                  <span>•</span>
                  <span>{foodB.fatG}g Fat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STRUCTURED PRIORITY COMPARISON TABLE */}
      {/* ORDER: Calories → Protein → Fiber → Sugar → Carbs → Fat → Sodium → Vitamins → Minerals → Ingredients/Allergens → Best For */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Table Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-400 block">
              Direct Clinical Comparison Matrix
            </span>
            <h3 className="text-sm sm:text-base font-extrabold">
              {foodA.name} vs. {foodB.name} (Per 100g Serving)
            </h3>
          </div>
          <span className="text-xs text-slate-300 font-medium bg-slate-800 px-3 py-1 rounded-full border border-slate-700 hidden sm:inline-block">
            Strict Priority Order 1 → 11
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-extrabold tracking-wider">
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4 w-48">Parameter</th>
                <th className="py-3 px-4 w-1/4 bg-emerald-50/60 text-emerald-950 font-black border-x border-slate-200">
                  {foodA.name}
                </th>
                <th className="py-3 px-4 w-1/4 bg-blue-50/60 text-blue-950 font-black border-r border-slate-200">
                  {foodB.name}
                </th>
                <th className="py-3 px-4">Why It Matters & Clinical Advantage</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">

              {/* 🥇 1. CALORIES */}
              <tr className="hover:bg-slate-50/70 transition">
                <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                  <span className="inline-block bg-amber-100 text-amber-900 font-black px-1.5 py-0.5 rounded text-[11px]">🥇 1</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-extrabold text-slate-900 block text-xs">Calories</span>
                  <span className="text-[10px] text-slate-400 font-normal">Total Metabolic Energy</span>
                </td>
                <td className={`py-3.5 px-4 font-bold border-x border-slate-100 ${foodA.calories <= foodB.calories ? 'text-emerald-800 bg-emerald-50/20' : 'text-slate-800'}`}>
                  <span className="text-sm font-black">{foodA.calories}</span> kcal
                  {foodA.calories < foodB.calories && (
                    <span className="ml-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      -{foodB.calories - foodA.calories} kcal (Lighter)
                    </span>
                  )}
                </td>
                <td className={`py-3.5 px-4 font-bold border-r border-slate-100 ${foodB.calories <= foodA.calories ? 'text-blue-800 bg-blue-50/20' : 'text-slate-800'}`}>
                  <span className="text-sm font-black">{foodB.calories}</span> kcal
                  {foodB.calories < foodA.calories && (
                    <span className="ml-1.5 text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                      -{foodA.calories - foodB.calories} kcal (Lighter)
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-slate-600 leading-snug">
                  <strong className="text-slate-800">Energy Intake:</strong> Determines caloric balance for weight management and daily energetic expenditure.
                </td>
              </tr>

              {/* 🥇 2. PROTEIN */}
              <tr className="hover:bg-slate-50/70 transition bg-slate-50/30">
                <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                  <span className="inline-block bg-amber-100 text-amber-900 font-black px-1.5 py-0.5 rounded text-[11px]">🥇 2</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-extrabold text-slate-900 block text-xs">Protein</span>
                  <span className="text-[10px] text-slate-400 font-normal">Essential Amino Acids</span>
                </td>
                <td className={`py-3.5 px-4 font-bold border-x border-slate-100 ${foodA.proteinG >= foodB.proteinG ? 'text-emerald-900 bg-emerald-50/30' : 'text-slate-700'}`}>
                  <span className="text-sm font-black">{foodA.proteinG}g</span>
                  {foodA.proteinG > foodB.proteinG && (
                    <span className="ml-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      +{(foodA.proteinG - foodB.proteinG).toFixed(1)}g Winner
                    </span>
                  )}
                </td>
                <td className={`py-3.5 px-4 font-bold border-r border-slate-100 ${foodB.proteinG >= foodA.proteinG ? 'text-blue-900 bg-blue-50/30' : 'text-slate-700'}`}>
                  <span className="text-sm font-black">{foodB.proteinG}g</span>
                  {foodB.proteinG > foodA.proteinG && (
                    <span className="ml-1.5 text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                      +{(foodB.proteinG - foodA.proteinG).toFixed(1)}g Winner
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-slate-600 leading-snug">
                  <strong className="text-slate-800">Muscle & Satiety:</strong> Stimulates muscle protein synthesis (mTOR), elevates peptide YY (PYY), and prevents sarcopenia.
                </td>
              </tr>

              {/* 🥇 3. FIBER */}
              <tr className="hover:bg-slate-50/70 transition">
                <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                  <span className="inline-block bg-amber-100 text-amber-900 font-black px-1.5 py-0.5 rounded text-[11px]">🥇 3</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-extrabold text-slate-900 block text-xs">Fiber</span>
                  <span className="text-[10px] text-slate-400 font-normal">Prebiotic & Soluble Fiber</span>
                </td>
                <td className={`py-3.5 px-4 font-bold border-x border-slate-100 ${foodA.fiberG >= foodB.fiberG ? 'text-emerald-900 bg-emerald-50/30' : 'text-slate-700'}`}>
                  <span className="text-sm font-black">{foodA.fiberG}g</span>
                  {foodA.fiberG > foodB.fiberG && (
                    <span className="ml-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      +{(foodA.fiberG - foodB.fiberG).toFixed(1)}g Winner
                    </span>
                  )}
                </td>
                <td className={`py-3.5 px-4 font-bold border-r border-slate-100 ${foodB.fiberG >= foodA.fiberG ? 'text-blue-900 bg-blue-50/30' : 'text-slate-700'}`}>
                  <span className="text-sm font-black">{foodB.fiberG}g</span>
                  {foodB.fiberG > foodA.fiberG && (
                    <span className="ml-1.5 text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                      +{(foodB.fiberG - foodA.fiberG).toFixed(1)}g Winner
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-slate-600 leading-snug">
                  <strong className="text-slate-800">Digestion & Fullness:</strong> Slows gastric emptying, creates short-chain fatty acids (butyrate), and enhances gut microbiome ecology.
                </td>
              </tr>

              {/* 🥇 4. SUGAR */}
              <tr className="hover:bg-slate-50/70 transition bg-slate-50/30">
                <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                  <span className="inline-block bg-amber-100 text-amber-900 font-black px-1.5 py-0.5 rounded text-[11px]">🥇 4</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-extrabold text-slate-900 block text-xs">Sugar</span>
                  <span className="text-[10px] text-slate-400 font-normal">Simple Carbohydrates</span>
                </td>
                <td className={`py-3.5 px-4 font-bold border-x border-slate-100 ${foodA.sugarsG <= foodB.sugarsG ? 'text-emerald-900 bg-emerald-50/30' : 'text-slate-700'}`}>
                  <span className="text-sm font-black">{foodA.sugarsG}g</span>
                  {foodA.sugarsG < foodB.sugarsG && (
                    <span className="ml-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Lower Sugar
                    </span>
                  )}
                </td>
                <td className={`py-3.5 px-4 font-bold border-r border-slate-100 ${foodB.sugarsG <= foodA.sugarsG ? 'text-blue-900 bg-blue-50/30' : 'text-slate-700'}`}>
                  <span className="text-sm font-black">{foodB.sugarsG}g</span>
                  {foodB.sugarsG < foodA.sugarsG && (
                    <span className="ml-1.5 text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                      Lower Sugar
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-slate-600 leading-snug">
                  <strong className="text-slate-800">Better Sugar Control:</strong> Low simple sugar prevents rapid insulin spikes, reactive hypoglycemia, and hepatic de novo lipogenesis.
                </td>
              </tr>

              {/* 🥇 5. CARBS */}
              <tr className="hover:bg-slate-50/70 transition">
                <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                  <span className="inline-block bg-amber-100 text-amber-900 font-black px-1.5 py-0.5 rounded text-[11px]">🥇 5</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-extrabold text-slate-900 block text-xs">Carbs</span>
                  <span className="text-[10px] text-slate-400 font-normal">Total & Net Glycemic Load</span>
                </td>
                <td className="py-3.5 px-4 font-bold border-x border-slate-100">
                  <span className="text-sm font-black">{foodA.carbsG}g</span>
                  <span className="text-[10px] text-slate-500 block">
                    Net: {Math.max(0, parseFloat((foodA.carbsG - foodA.fiberG).toFixed(1)))}g (GI: {foodA.glycemicIndex})
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold border-r border-slate-100">
                  <span className="text-sm font-black">{foodB.carbsG}g</span>
                  <span className="text-[10px] text-slate-500 block">
                    Net: {Math.max(0, parseFloat((foodB.carbsG - foodB.fiberG).toFixed(1)))}g (GI: {foodB.glycemicIndex})
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600 leading-snug">
                  <strong className="text-slate-800">Main Energy Source:</strong> Supplies cellular glucose for muscular glycogen replenishment and central nervous system energetics.
                </td>
              </tr>

              {/* 🥇 6. FAT */}
              <tr className="hover:bg-slate-50/70 transition bg-slate-50/30">
                <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                  <span className="inline-block bg-amber-100 text-amber-900 font-black px-1.5 py-0.5 rounded text-[11px]">🥇 6</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-extrabold text-slate-900 block text-xs">Fat</span>
                  <span className="text-[10px] text-slate-400 font-normal">MUFA, PUFA & Saturated</span>
                </td>
                <td className="py-3.5 px-4 font-bold border-x border-slate-100">
                  <span className="text-sm font-black">{foodA.fatG}g</span>
                  <span className="text-[10px] text-slate-500 block">
                    MUFA: {foodA.monounsaturatedFatG}g • PUFA: {foodA.polyunsaturatedFatG}g
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold border-r border-slate-100">
                  <span className="text-sm font-black">{foodB.fatG}g</span>
                  <span className="text-[10px] text-slate-500 block">
                    MUFA: {foodB.monounsaturatedFatG}g • PUFA: {foodB.polyunsaturatedFatG}g
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600 leading-snug">
                  <strong className="text-slate-800">Energy & Fat Quality:</strong> Essential fatty acids (Omega-3/6) maintain lipid membranes, steroid hormone synthesis, and fat-soluble vitamin absorption.
                </td>
              </tr>

              {/* 🥈 7. SODIUM */}
              <tr className="hover:bg-slate-50/70 transition">
                <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                  <span className="inline-block bg-slate-200 text-slate-800 font-black px-1.5 py-0.5 rounded text-[11px]">🥈 7</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-extrabold text-slate-900 block text-xs">Sodium</span>
                  <span className="text-[10px] text-slate-400 font-normal">Electrolyte & Fluid Balance</span>
                </td>
                <td className={`py-3.5 px-4 font-bold border-x border-slate-100 ${foodASodium <= foodBSodium ? 'text-emerald-900 bg-emerald-50/20' : 'text-slate-700'}`}>
                  <span className="text-sm font-black">{foodASodium}</span> mg
                  <span className="text-[10px] text-slate-500 block">
                    {foodASodium <= 140 ? 'Low Sodium Protocol' : 'Moderate Sodium'}
                  </span>
                </td>
                <td className={`py-3.5 px-4 font-bold border-r border-slate-100 ${foodBSodium <= foodASodium ? 'text-blue-900 bg-blue-50/20' : 'text-slate-700'}`}>
                  <span className="text-sm font-black">{foodBSodium}</span> mg
                  <span className="text-[10px] text-slate-500 block">
                    {foodBSodium <= 140 ? 'Low Sodium Protocol' : 'Moderate Sodium'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600 leading-snug">
                  <strong className="text-slate-800">Salt Intake:</strong> Critical for blood pressure regulation, renal renin-angiotensin calibration, and extracellular osmotic equilibrium.
                </td>
              </tr>

              {/* 🥈 8. VITAMINS */}
              <tr className="hover:bg-slate-50/70 transition bg-slate-50/30">
                <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                  <span className="inline-block bg-slate-200 text-slate-800 font-black px-1.5 py-0.5 rounded text-[11px]">🥈 8</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-extrabold text-slate-900 block text-xs">Vitamins</span>
                  <span className="text-[10px] text-slate-400 font-normal">Key Micronutrients</span>
                </td>
                <td className="py-3.5 px-4 border-x border-slate-100">
                  <div className="space-y-1">
                    {foodA.vitamins.map((v, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-slate-800">{v.name}:</span>
                        <span className="font-bold text-emerald-800">{v.amount} ({v.dvPercent}%)</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-4 border-r border-slate-100">
                  <div className="space-y-1">
                    {foodB.vitamins.map((v, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-slate-800">{v.name}:</span>
                        <span className="font-bold text-blue-800">{v.amount} ({v.dvPercent}%)</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-600 leading-snug">
                  <strong className="text-slate-800">Micronutrient Value:</strong> Essential enzymatic cofactors for DNA methylation, immune cell proliferation, and antioxidant defense.
                </td>
              </tr>

              {/* 🥈 9. MINERALS */}
              <tr className="hover:bg-slate-50/70 transition">
                <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                  <span className="inline-block bg-slate-200 text-slate-800 font-black px-1.5 py-0.5 rounded text-[11px]">🥈 9</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-extrabold text-slate-900 block text-xs">Minerals</span>
                  <span className="text-[10px] text-slate-400 font-normal">Macro & Trace Elements</span>
                </td>
                <td className="py-3.5 px-4 border-x border-slate-100">
                  <div className="space-y-1">
                    {foodA.minerals.map((m, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-slate-800">{m.name}:</span>
                        <span className="font-bold text-emerald-800">{m.amount} ({m.dvPercent}%)</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-4 border-r border-slate-100">
                  <div className="space-y-1">
                    {foodB.minerals.map((m, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-slate-800">{m.name}:</span>
                        <span className="font-bold text-blue-800">{m.amount} ({m.dvPercent}%)</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-600 leading-snug">
                  <strong className="text-slate-800">Essential Nutrients:</strong> Structural bone mineral density (Calcium, Phosphorus) and ATP catalytic activity (Magnesium, Potassium).
                </td>
              </tr>

              {/* 🥉 10. INGREDIENTS / ALLERGENS */}
              <tr className="hover:bg-slate-50/70 transition bg-slate-50/30">
                <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                  <span className="inline-block bg-amber-800/10 text-amber-900 font-black px-1.5 py-0.5 rounded text-[11px]">🥉 10</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-extrabold text-slate-900 block text-xs">Ingredients / Allergens</span>
                  <span className="text-[10px] text-slate-400 font-normal">Food Purity & Sensitivity</span>
                </td>
                <td className="py-3.5 px-4 border-x border-slate-100">
                  {foodA.allergenFlags && foodA.allergenFlags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {foodA.allergenFlags.map((all, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                          ⚠️ {all}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-800 font-bold text-[11px]">
                      <Check className="h-3.5 w-3.5 text-emerald-600" /> Whole Food / No Top Allergens
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 block mt-1">Single-ingredient unrefined food matrix</span>
                </td>
                <td className="py-3.5 px-4 border-r border-slate-100">
                  {foodB.allergenFlags && foodB.allergenFlags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {foodB.allergenFlags.map((all, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                          ⚠️ {all}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-800 font-bold text-[11px]">
                      <Check className="h-3.5 w-3.5 text-emerald-600" /> Whole Food / No Top Allergens
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 block mt-1">Single-ingredient unrefined food matrix</span>
                </td>
                <td className="py-3.5 px-4 text-slate-600 leading-snug">
                  <strong className="text-slate-800">Safety & Quality:</strong> Identifies IgE-mediated allergenic risks (fish, nuts, dairy, gluten) and food cleanliness.
                </td>
              </tr>

              {/* ⭐ 11. BEST FOR */}
              <tr className="hover:bg-slate-50/70 transition bg-emerald-50/20">
                <td className="py-4 px-4 text-center font-bold text-slate-500">
                  <span className="inline-block bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded text-[11px]">⭐ 11</span>
                </td>
                <td className="py-4 px-4">
                  <span className="font-extrabold text-slate-900 block text-xs">Best For</span>
                  <span className="text-[10px] text-slate-400 font-normal">Primary Dietary Goals</span>
                </td>
                <td className="py-4 px-4 border-x border-slate-100">
                  <div className="space-y-1">
                    {foodABestFor.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-950">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4 border-r border-slate-100">
                  <div className="space-y-1">
                    {foodBBestFor.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] font-bold text-blue-950">
                        <CheckCircle2 className="h-3 w-3 text-blue-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-700 leading-snug">
                  <strong className="text-slate-900">Clinical Recommendation:</strong> Helps target exact metabolic protocols (Muscle Growth, Low-Calorie Cut, Gut Healing, Blood Sugar Balance).
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* BOTTOM CLINICAL SUMMARY */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-1.5">
            <span className="font-extrabold text-emerald-950 block text-sm">
              🏆 {foodA.name} Clinical Strengths:
            </span>
            <p className="text-slate-700 leading-relaxed font-medium">
              {foodA.keyHealthBenefits[0]}
            </p>
            <div className="text-[10px] text-emerald-800 font-bold pt-1">
              Top Pairing: {foodA.bestPairings ? foodA.bestPairings.slice(0, 3).join(', ') : 'Fresh Greens & Olive Oil'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-blue-200 space-y-1.5">
            <span className="font-extrabold text-blue-950 block text-sm">
              🏆 {foodB.name} Clinical Strengths:
            </span>
            <p className="text-slate-700 leading-relaxed font-medium">
              {foodB.keyHealthBenefits[0]}
            </p>
            <div className="text-[10px] text-blue-800 font-bold pt-1">
              Top Pairing: {foodB.bestPairings ? foodB.bestPairings.slice(0, 3).join(', ') : 'Fresh Greens & Olive Oil'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
