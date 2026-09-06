import {
  NutritionFood,
  VitaminDetail,
  MineralDetail,
  MacronutrientInfo,
  MicronutrientSynergy,
  Recipe,
  MealPlan,
  FoodInteraction,
  DietaryGuideline,
  DeficiencyDisease,
  ToxicityDisease
} from '../types';

// ==========================================
// 1. FOODS & NUTRITIONAL PROFILES (Per 100g)
// ==========================================
export const NUTRITION_FOODS: NutritionFood[] = [
  {
    id: 'food-salmon',
    name: 'Wild Atlantic Salmon',
    category: 'Proteins & Seafood',
    servingSize: '100g (3.5 oz)',
    calories: 182,
    proteinG: 25.4,
    carbsG: 0,
    fiberG: 0,
    sugarsG: 0,
    fatG: 8.1,
    saturatedFatG: 1.2,
    monounsaturatedFatG: 2.1,
    polyunsaturatedFatG: 3.8,
    glycemicIndex: 0,
    glycemicLoad: 0,
    vitamins: [
      { name: 'Vitamin D', amount: '526 IU', dvPercent: 66 },
      { name: 'Vitamin B12', amount: '3.2 µg', dvPercent: 133 },
      { name: 'Vitamin B6', amount: '0.8 mg', dvPercent: 47 },
      { name: 'Niacin (B3)', amount: '8.7 mg', dvPercent: 54 }
    ],
    minerals: [
      { name: 'Selenium', amount: '36.5 µg', dvPercent: 66 },
      { name: 'Potassium', amount: '490 mg', dvPercent: 14 },
      { name: 'Phosphorus', amount: '252 mg', dvPercent: 20 },
      { name: 'Magnesium', amount: '29 mg', dvPercent: 7 }
    ],
    keyHealthBenefits: [
      'Extremely rich in Long-Chain Omega-3 Fatty Acids (EPA & DHA) which lower arterial inflammation.',
      'Reduces serum triglycerides, stabilizes cardiac rhythm, and supports brain neuroplasticity.',
      'High-quality complete protein with all 9 essential amino acids for tissue repair and muscle preservation.'
    ],
    therapeuticSuitability: ['Heart-Healthy', 'Anti-Inflammatory', 'Diabetic-Friendly', 'Keto', 'Mediterranean'],
    allergenFlags: ['Fish'],
    bestPairings: ['Steamed Asparagus', 'Lemon-Dill Quinoa', 'Extra Virgin Olive Oil', 'Baby Spinach'],
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'food-spinach',
    name: 'Organic Baby Spinach',
    category: 'Vegetables',
    servingSize: '100g raw',
    calories: 23,
    proteinG: 2.9,
    carbsG: 3.6,
    fiberG: 2.2,
    sugarsG: 0.4,
    fatG: 0.4,
    saturatedFatG: 0.1,
    monounsaturatedFatG: 0.05,
    polyunsaturatedFatG: 0.2,
    glycemicIndex: 15,
    glycemicLoad: 1,
    vitamins: [
      { name: 'Vitamin K1', amount: '483 µg', dvPercent: 402 },
      { name: 'Vitamin A (Beta-Carotene)', amount: '469 µg RAE', dvPercent: 52 },
      { name: 'Folate (B9)', amount: '194 µg', dvPercent: 49 },
      { name: 'Vitamin C', amount: '28 mg', dvPercent: 31 }
    ],
    minerals: [
      { name: 'Iron (Non-Heme)', amount: '2.7 mg', dvPercent: 15 },
      { name: 'Magnesium', amount: '79 mg', dvPercent: 20 },
      { name: 'Calcium', amount: '99 mg', dvPercent: 10 },
      { name: 'Potassium', amount: '558 mg', dvPercent: 16 }
    ],
    keyHealthBenefits: [
      'Massive concentration of Vitamin K1 essential for osteocalcin activation and arterial elasticity.',
      'Contains lutein and zeaxanthin that shield ocular retinal macula from blue-light oxidative stress.',
      'High natural nitrates enhance endothelial nitric oxide production, gently lowering systolic blood pressure.'
    ],
    therapeuticSuitability: ['Heart-Healthy', 'Diabetic-Friendly', 'Vegan', 'Low-Sodium', 'Gluten-Free', 'Anti-Inflammatory'],
    allergenFlags: [],
    bestPairings: ['Citrus Fruits (Vitamin C boosts Iron absorption)', 'Extra Virgin Olive Oil (boosts Vitamin K absorption)'],
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'food-blueberries',
    name: 'Wild Blueberries',
    category: 'Fruits',
    servingSize: '100g fresh',
    calories: 57,
    proteinG: 0.7,
    carbsG: 14.5,
    fiberG: 2.4,
    sugarsG: 9.96,
    fatG: 0.33,
    saturatedFatG: 0.03,
    monounsaturatedFatG: 0.05,
    polyunsaturatedFatG: 0.15,
    glycemicIndex: 53,
    glycemicLoad: 5,
    vitamins: [
      { name: 'Vitamin K', amount: '19.3 µg', dvPercent: 16 },
      { name: 'Vitamin C', amount: '9.7 mg', dvPercent: 11 },
      { name: 'Vitamin B6', amount: '0.05 mg', dvPercent: 3 }
    ],
    minerals: [
      { name: 'Manganese', amount: '0.34 mg', dvPercent: 15 },
      { name: 'Copper', amount: '0.06 mg', dvPercent: 7 },
      { name: 'Potassium', amount: '77 mg', dvPercent: 2 }
    ],
    keyHealthBenefits: [
      'Packed with Anthocyanins (powerful polyphenols) that cross the blood-brain barrier to enhance memory.',
      'Promotes vascular endothelial elasticity and mitigates postprandial glycemic spikes.',
      'High ORAC (Oxygen Radical Absorbance Capacity) antioxidant score protecting cellular DNA.'
    ],
    therapeuticSuitability: ['Diabetic-Friendly', 'Heart-Healthy', 'Anti-Inflammatory', 'Vegan', 'Mediterranean'],
    allergenFlags: [],
    bestPairings: ['Greek Yogurt', 'Rolled Oats', 'Walnuts', 'Chia Seeds'],
    imageUrl: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'food-quinoa',
    name: 'Ancient Royal Quinoa',
    category: 'Whole Grains',
    servingSize: '100g cooked',
    calories: 120,
    proteinG: 4.4,
    carbsG: 21.3,
    fiberG: 2.8,
    sugarsG: 0.9,
    fatG: 1.9,
    saturatedFatG: 0.2,
    monounsaturatedFatG: 0.5,
    polyunsaturatedFatG: 1.1,
    glycemicIndex: 53,
    glycemicLoad: 11,
    vitamins: [
      { name: 'Folate (B9)', amount: '42 µg', dvPercent: 11 },
      { name: 'Thiamine (B1)', amount: '0.1 mg', dvPercent: 9 },
      { name: 'Vitamin B6', amount: '0.12 mg', dvPercent: 7 }
    ],
    minerals: [
      { name: 'Manganese', amount: '0.63 mg', dvPercent: 27 },
      { name: 'Phosphorus', amount: '152 mg', dvPercent: 12 },
      { name: 'Magnesium', amount: '64 mg', dvPercent: 15 },
      { name: 'Iron', amount: '1.5 mg', dvPercent: 8 }
    ],
    keyHealthBenefits: [
      'Naturally 100% gluten-free pseudo-cereal containing a complete amino acid profile.',
      'Rich in quercetin and kaempferol flavonoids with potent cellular anti-inflammatory properties.',
      'Low glycemic response prevents insulin surges, providing sustained complex energy release.'
    ],
    therapeuticSuitability: ['Gluten-Free', 'Heart-Healthy', 'Diabetic-Friendly', 'Vegan', 'High-Fiber'],
    allergenFlags: [],
    bestPairings: ['Roasted Chickpeas', 'Steamed Vegetables', 'Avocado', 'Tahini Dressing'],
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'food-avocado',
    name: 'Hass Avocado',
    category: 'Fats & Healthy Oils',
    servingSize: '100g fresh',
    calories: 160,
    proteinG: 2.0,
    carbsG: 8.5,
    fiberG: 6.7,
    sugarsG: 0.7,
    fatG: 14.7,
    saturatedFatG: 2.1,
    monounsaturatedFatG: 9.8,
    polyunsaturatedFatG: 1.8,
    glycemicIndex: 15,
    glycemicLoad: 1,
    vitamins: [
      { name: 'Pantothenic Acid (B5)', amount: '1.39 mg', dvPercent: 28 },
      { name: 'Vitamin K', amount: '21 µg', dvPercent: 18 },
      { name: 'Vitamin E (Alpha-Tocopherol)', amount: '2.07 mg', dvPercent: 14 },
      { name: 'Folate (B9)', amount: '81 µg', dvPercent: 20 }
    ],
    minerals: [
      { name: 'Potassium', amount: '485 mg', dvPercent: 14 },
      { name: 'Copper', amount: '0.19 mg', dvPercent: 21 },
      { name: 'Magnesium', amount: '29 mg', dvPercent: 7 }
    ],
    keyHealthBenefits: [
      'High in Oleic Acid (heart-protective monounsaturated fatty acid) that increases HDL and lowers LDL.',
      'Massive soluble and prebiotic fiber content nourishing beneficial Akkermansia muciniphila gut flora.',
      'Acts as a nutrient absorption multiplier: dramatically increases absorption of fat-soluble carotenoids in salads.'
    ],
    therapeuticSuitability: ['Keto', 'Heart-Healthy', 'Diabetic-Friendly', 'Vegan', 'Gluten-Free', 'Anti-Inflammatory'],
    allergenFlags: [],
    bestPairings: ['Tomatoes & Leafy Greens', 'Eggs', 'Lime Juice', 'Extra Virgin Olive Oil'],
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'food-lentils',
    name: 'Brown & Green Lentils',
    category: 'Legumes & Beans',
    servingSize: '100g cooked',
    calories: 116,
    proteinG: 9.0,
    carbsG: 20.1,
    fiberG: 7.9,
    sugarsG: 1.8,
    fatG: 0.4,
    saturatedFatG: 0.05,
    monounsaturatedFatG: 0.07,
    polyunsaturatedFatG: 0.2,
    glycemicIndex: 29,
    glycemicLoad: 5,
    vitamins: [
      { name: 'Folate (B9)', amount: '181 µg', dvPercent: 45 },
      { name: 'Thiamine (B1)', amount: '0.17 mg', dvPercent: 14 },
      { name: 'Vitamin B6', amount: '0.18 mg', dvPercent: 11 }
    ],
    minerals: [
      { name: 'Iron (Non-Heme)', amount: '3.3 mg', dvPercent: 18 },
      { name: 'Manganese', amount: '0.49 mg', dvPercent: 21 },
      { name: 'Phosphorus', amount: '180 mg', dvPercent: 14 },
      { name: 'Potassium', amount: '369 mg', dvPercent: 11 }
    ],
    keyHealthBenefits: [
      'Exceptionally low glycemic index legume providing slow-burning carbohydrate energy and sustained satiety.',
      'High folate levels support DNA synthesis, red blood cell maturation, and cardiovascular homocysteine recycling.',
      'High resistant starch ferments into Short-Chain Fatty Acids (SCFAs) like butyrate, reinforcing the intestinal barrier.'
    ],
    therapeuticSuitability: ['Vegan', 'Heart-Healthy', 'Diabetic-Friendly', 'High-Protein', 'Low-Sodium'],
    allergenFlags: [],
    bestPairings: ['Turmeric & Cumin', 'Garlic & Onions', 'Brown Rice', 'Lemon Slices'],
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'food-yogurt',
    name: 'Plain Greek Yogurt (0-2% Fat)',
    category: 'Dairy & Alternatives',
    servingSize: '100g',
    calories: 73,
    proteinG: 10.0,
    carbsG: 3.6,
    fiberG: 0,
    sugarsG: 3.6,
    fatG: 1.9,
    saturatedFatG: 1.2,
    monounsaturatedFatG: 0.4,
    polyunsaturatedFatG: 0.06,
    glycemicIndex: 12,
    glycemicLoad: 1,
    vitamins: [
      { name: 'Vitamin B12', amount: '0.75 µg', dvPercent: 31 },
      { name: 'Riboflavin (B2)', amount: '0.28 mg', dvPercent: 22 },
      { name: 'Pantothenic Acid', amount: '0.4 mg', dvPercent: 8 }
    ],
    minerals: [
      { name: 'Calcium', amount: '110 mg', dvPercent: 11 },
      { name: 'Phosphorus', amount: '135 mg', dvPercent: 11 },
      { name: 'Selenium', amount: '9.7 µg', dvPercent: 18 }
    ],
    keyHealthBenefits: [
      'Dense in bioavailable casein and whey proteins with live probiotic cultures (L. acidophilus, B. bifidum).',
      'Boosts bone mineral density through synergistic bioavailable calcium, phosphorus, and protein matrix.',
      'Low lactose due to straining and fermentation makes it gentler for mildly lactose-sensitive individuals.'
    ],
    therapeuticSuitability: ['High-Protein', 'Diabetic-Friendly', 'Keto', 'Gluten-Free', 'Bone-Health'],
    allergenFlags: ['Milk/Dairy'],
    bestPairings: ['Wild Blueberries', 'Raw Honey', 'Walnuts', 'Ground Flaxseeds'],
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'food-walnuts',
    name: 'Raw English Walnuts',
    category: 'Nuts & Seeds',
    servingSize: '30g (approx 1 oz)',
    calories: 196,
    proteinG: 4.6,
    carbsG: 4.1,
    fiberG: 2.0,
    sugarsG: 0.8,
    fatG: 19.5,
    saturatedFatG: 1.8,
    monounsaturatedFatG: 2.7,
    polyunsaturatedFatG: 14.1,
    glycemicIndex: 15,
    glycemicLoad: 1,
    vitamins: [
      { name: 'Vitamin E (Gamma-Tocopherol)', amount: '0.8 mg', dvPercent: 5 },
      { name: 'Vitamin B6', amount: '0.16 mg', dvPercent: 10 },
      { name: 'Folate (B9)', amount: '29 µg', dvPercent: 7 }
    ],
    minerals: [
      { name: 'Copper', amount: '0.48 mg', dvPercent: 53 },
      { name: 'Manganese', amount: '1.02 mg', dvPercent: 44 },
      { name: 'Magnesium', amount: '48 mg', dvPercent: 12 }
    ],
    keyHealthBenefits: [
      'Highest plant-based Alpha-Linolenic Acid (ALA Omega-3) of any tree nut (2.5g per 30g serving).',
      'Packed with ellagitannins converted by gut microflora into urolithins, known for anti-aging cellular mitophagy.',
      'Clinically demonstrated to improve brachial artery endothelial reactivity and reduce LDL oxidation.'
    ],
    therapeuticSuitability: ['Heart-Healthy', 'Keto', 'Vegan', 'Diabetic-Friendly', 'Brain-Health'],
    allergenFlags: ['Tree Nuts'],
    bestPairings: ['Oatmeal', 'Fresh Figs', 'Arugula Salad', 'Dark Chocolate (>85%)'],
    imageUrl: 'https://images.unsplash.com/photo-1543208541-0961a29a756b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'food-turmeric',
    name: 'Organic Turmeric Root Powder',
    category: 'Herbs & Superfoods',
    servingSize: '5g (1 tsp)',
    calories: 18,
    proteinG: 0.4,
    carbsG: 3.2,
    fiberG: 1.1,
    sugarsG: 0.15,
    fatG: 0.5,
    saturatedFatG: 0.15,
    monounsaturatedFatG: 0.08,
    polyunsaturatedFatG: 0.11,
    glycemicIndex: 5,
    glycemicLoad: 0,
    vitamins: [
      { name: 'Vitamin C', amount: '1.3 mg', dvPercent: 2 },
      { name: 'Vitamin B6', amount: '0.09 mg', dvPercent: 5 }
    ],
    minerals: [
      { name: 'Iron', amount: '2.1 mg', dvPercent: 12 },
      { name: 'Manganese', amount: '0.39 mg', dvPercent: 17 },
      { name: 'Potassium', amount: '126 mg', dvPercent: 4 }
    ],
    keyHealthBenefits: [
      'Contains Curcuminoids: blocks the master NF-kB inflammatory cascade in chronic arthritis and inflammatory bowel disease.',
      'Supports hepatic Phase II detoxification pathways and stimulates gallbladder bile secretion.',
      'Bioavailability increases by 2000% when combined with Piperine (black pepper extract).'
    ],
    therapeuticSuitability: ['Anti-Inflammatory', 'Heart-Healthy', 'Vegan', 'Gluten-Free', 'Joint-Care'],
    allergenFlags: [],
    bestPairings: ['Black Pepper', 'Warm Almond Milk / Golden Milk', 'Extra Virgin Olive Oil / Healthy Fats', 'Ginger'],
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
  }
];

// ==========================================
// 2. VITAMINS ENCYCLOPEDIA (All 14)
// ==========================================
export const VITAMINS_DATA: VitaminDetail[] = [
  {
    id: 'vit-a',
    code: 'Vit-A',
    name: 'Vitamin A (Retinol & Beta-Carotene)',
    chemicalName: 'Retinol (preformed) / Carotenoids (provitamin)',
    type: 'Fat-Soluble',
    rdaMen: '900 µg RAE (3,000 IU)',
    rdaWomen: '700 µg RAE (2,333 IU)',
    rdaPregnancy: '770 - 1,300 µg RAE',
    upperLimit: '3,000 µg preformed retinol/day',
    primaryFunctions: [
      'Rhodopsin formation for low-light photoreception and night vision.',
      'Maintains integrity and mucus secretion of epithelial skin and mucosal membranes.',
      'Regulates T-cell and B-cell differentiation for cell-mediated immunity.'
    ],
    topFoodSources: [
      { food: 'Beef Liver', amountPerServing: '6,582 µg RAE', serving: '85g cooked' },
      { food: 'Sweet Potato (Baked)', amountPerServing: '1,403 µg RAE', serving: '1 medium with skin' },
      { food: 'Carrots', amountPerServing: '835 µg RAE', serving: '1 cup raw' },
      { food: 'Baby Spinach', amountPerServing: '573 µg RAE', serving: '1 cup cooked' }
    ],
    absorptionAndBioavailability: 'Requires dietary fat and bile salts for micellar absorption in the duodenum. Cooking carrots/sweet potatoes increases beta-carotene bioavailability.',
    deficiencyDisorder: 'Night Blindness (Nyctalopia) & Xerophthalmia',
    deficiencySymptoms: [
      'Inability to see in dim light (Nyctalopia)',
      'Dry eyes and Bitot spots on conjunctiva',
      'Hyperkeratosis (rough, bumpy skin / follicular hyperkeratosis)',
      'Severe susceptibility to respiratory and diarrheal infections'
    ],
    toxicityRisk: 'High (Preformed Retinol accumulates in liver; Provitamin Beta-Carotene causes benign carotenemia, not toxicity).',
    toxicitySymptoms: [
      'Increased intracranial pressure (Pseudotumor cerebri) & Severe headaches',
      'Hepatomegaly and hepatic cirrhosis',
      'Dry peeling skin, alopecia, and bone fractures',
      'Severe teratogenicity (fetal neural crest malformations during pregnancy)'
    ],
    clinicalSignificance: 'Crucial global public health target in pediatric blindness and maternal survival programs.',
    bestTakenWith: 'Dietary healthy fats (Olive oil, Avocado, Nuts).'
  },
  {
    id: 'vit-d',
    code: 'Vit-D',
    name: 'Vitamin D (Cholecalciferol D3 & Ergocalciferol D2)',
    chemicalName: '1,25-dihydroxyvitamin D3 (Calcitriol, active hormone form)',
    type: 'Fat-Soluble',
    rdaMen: '600 - 800 IU (15-20 µg)',
    rdaWomen: '600 - 800 IU (15-20 µg)',
    rdaPregnancy: '600 IU (15 µg)',
    upperLimit: '4,000 IU/day',
    primaryFunctions: [
      'Stimulates intestinal TRPV6 calcium channels and Calbindin synthesis for calcium and phosphorus absorption.',
      'Suppresses Parathyroid Hormone (PTH) to prevent pathological osteoclastic bone resorption.',
      'Modulates innate immune cathelicidin antimicrobial peptides against pathogens.',
      'Receptor (VDR) present in over 30 human tissues regulating gene expression.'
    ],
    topFoodSources: [
      { food: 'Wild Salmon (Cooked)', amountPerServing: '526 IU', serving: '100g' },
      { food: 'Cod Liver Oil', amountPerServing: '1,360 IU', serving: '1 tablespoon (14g)' },
      { food: 'UV-Exposed Portobello Mushrooms', amountPerServing: '384 IU', serving: '1 cup diced' },
      { food: 'Fortified Milk / Plant Milk', amountPerServing: '120 IU', serving: '1 cup (240ml)' }
    ],
    absorptionAndBioavailability: 'Absorbed in small intestine with dietary lipids. Synthesized photochemically in skin via UVB rays (290-315 nm) converting 7-dehydrocholesterol to pre-vitamin D3.',
    deficiencyDisorder: 'Rickets (in growing children) & Osteomalacia (in adults)',
    deficiencySymptoms: [
      'Bowlegs, knock-knees, and rachitic rosary in infants',
      'Diffuse bone aching, proximal muscle weakness, and waddling gait',
      'Frequent respiratory infections and chronic fatigue',
      'Elevated alkaline phosphatase and secondary hyperparathyroidism'
    ],
    toxicityRisk: 'High with chronic high-dose supplements (>10,000 IU/day for months). Cannot get toxic from sunshine.',
    toxicitySymptoms: [
      'Hypercalcemia, severe nausea, vomiting, and polyuria',
      'Metastatic soft-tissue calcification in kidneys (Nephrocalcinosis) and blood vessels',
      'Irreversible renal failure and cardiac arrhythmias'
    ],
    clinicalSignificance: 'Endocrine pro-hormone fundamental for skeletal longevity and immune homeostasis.',
    bestTakenWith: 'Fatty meal, Magnesium (required for hepatic 25-hydroxylase & renal 1-alpha-hydroxylase activation), and Vitamin K2.'
  },
  {
    id: 'vit-c',
    code: 'Vit-C',
    name: 'Vitamin C (Ascorbic Acid)',
    chemicalName: 'L-Ascorbic Acid / Dehydroascorbic Acid',
    type: 'Water-Soluble',
    rdaMen: '90 mg/day (+35 mg for active smokers)',
    rdaWomen: '75 mg/day (85 mg pregnancy, 120 mg lactation)',
    upperLimit: '2,000 mg/day',
    primaryFunctions: [
      'Essential cofactor for Prolyl and Lysyl hydroxylase enzymes in Collagen triple-helix cross-linking.',
      'Primary hydrophilic free-radical scavenger protecting cell membranes from lipid peroxidation.',
      'Reduces ferric iron (Fe3+) to ferrous iron (Fe2+) in the stomach, dramatically boosting non-heme iron absorption.',
      'Required for carnitine and norepinephrine neurotransmitter biosynthesis.'
    ],
    topFoodSources: [
      { food: 'Guava (Fresh)', amountPerServing: '377 mg', serving: '1 cup' },
      { food: 'Red Bell Pepper', amountPerServing: '190 mg', serving: '1 cup chopped' },
      { food: 'Kiwi Fruit', amountPerServing: '137 mg', serving: '2 medium' },
      { food: 'Oranges / Citrus', amountPerServing: '70 mg', serving: '1 medium orange' }
    ],
    absorptionAndBioavailability: 'Active transport via SVCT1/SVCT2 sodium-dependent transporters. Bioavailability is ~80% at doses <100mg but drops to <50% at single doses >1,000mg due to transporter saturation.',
    deficiencyDisorder: 'Scurvy (Severe Ascorbic Acid Depletion)',
    deficiencySymptoms: [
      'Perifollicular hemorrhages and corkscrew body hairs',
      'Bleeding, spongy, swollen gums and loose teeth',
      'Impaired wound healing and reopening of healed scars',
      'Severe arthralgia, subperiosteal hematomas, and microcytic/normocytic anemia'
    ],
    toxicityRisk: 'Low (water-soluble, excess excreted in urine). High megadoses (>2,000mg) cause osmotic diarrhea and elevate calcium oxalate kidney stone risk.',
    toxicitySymptoms: [
      'Abdominal cramping and osmotic diarrhea',
      'Hyperoxaluria and kidney stone formation in predisposed individuals',
      'Interference with stool occult blood and urine glucose dipstick tests'
    ],
    clinicalSignificance: 'Master water-soluble antioxidant and vascular basement membrane stabilizer.',
    bestTakenWith: 'Plant-based iron foods (Spinach, Lentils, Beans) to enhance mineral uptake.'
  },
  {
    id: 'vit-b12',
    code: 'Vit-B12',
    name: 'Vitamin B12 (Cobalamin)',
    chemicalName: 'Methylcobalamin, Adenosylcobalamin, Cyanocobalamin',
    type: 'Water-Soluble',
    rdaMen: '2.4 µg/day',
    rdaWomen: '2.4 µg/day (2.6 µg pregnancy, 2.8 µg lactation)',
    upperLimit: 'No UL Established (Very safe, excess excreted)',
    primaryFunctions: [
      'Cofactor for Methionine Synthase: converts homocysteine to methionine, preventing cardiovascular vascular injury.',
      'Cofactor for L-Methylmalonyl-CoA Mutase: converts methylmalonyl-CoA to succinyl-CoA for myelin sheath lipid synthesis.',
      'Required for erythrocyte DNA synthesis in bone marrow alongside Folate.'
    ],
    topFoodSources: [
      { food: 'Steamed Clams', amountPerServing: '84 µg', serving: '85g' },
      { food: 'Cooked Beef Liver', amountPerServing: '70.7 µg', serving: '85g' },
      { food: 'Wild Salmon', amountPerServing: '3.2 µg', serving: '100g' },
      { food: 'Fortified Nutritional Yeast', amountPerServing: '17.6 µg', serving: '2 tablespoons' }
    ],
    absorptionAndBioavailability: 'Requires gastric acid & pepsin to cleave from food proteins, gastric Intrinsic Factor (IF) secreted by parietal cells, and binding to cubam receptors in terminal ileum.',
    deficiencyDisorder: 'Pernicious Anemia & Subacute Combined Degeneration of Spinal Cord',
    deficiencySymptoms: [
      'Megaloblastic / Macrocytic Anemia (MCV > 100 fL) with hypersegmented neutrophils',
      'Peripheral neuropathy (glove-and-stocking paresthesia / tingling in feet)',
      'Loss of vibration sense, proprioception, and spastic ataxia (dorsal column myelopathy)',
      'Beefy red atrophic glossitis (Hunter glossitis), depression, and memory loss'
    ],
    toxicityRisk: 'Negligible (Extremely low toxicity; safe even at 1,000µg+ daily therapeutic doses).',
    toxicitySymptoms: ['Mild transient acneiform eruptions in rare cases.'],
    clinicalSignificance: 'Mandatory lifelong supplementation for strict vegans and elderly with atrophic gastritis.',
    bestTakenWith: 'Folate (B9) and taken on an empty stomach with water or sublingually.'
  },
  {
    id: 'vit-b9',
    code: 'Vit-B9',
    name: 'Folate & Folic Acid',
    chemicalName: 'Tetrahydrofolate (THF) / Pteroylglutamic acid',
    type: 'Water-Soluble',
    rdaMen: '400 µg DFE/day',
    rdaWomen: '400 µg DFE (600 µg pregnancy to prevent neural tube defects)',
    upperLimit: '1,000 µg synthetic folic acid/day',
    primaryFunctions: [
      'One-carbon unit donor in purine and thymidylate synthesis for rapid cell division and fetal organogenesis.',
      'Converts homocysteine to methionine alongside Vitamin B12.',
      'Essential for closed neural tube development during first 28 days of embryonic conception.'
    ],
    topFoodSources: [
      { food: 'Cooked Spinach', amountPerServing: '263 µg', serving: '1 cup' },
      { food: 'Lentils (Cooked)', amountPerServing: '358 µg', serving: '1 cup' },
      { food: 'Asparagus', amountPerServing: '268 µg', serving: '1 cup' },
      { food: 'Enriched Grains / Fortified Bread', amountPerServing: '140 µg', serving: '1 slice' }
    ],
    absorptionAndBioavailability: 'Natural food folates are polyglutamates hydrolyzed to monoglutamates in jejunum; synthetic folic acid has ~85% bioavailability.',
    deficiencyDisorder: 'Megaloblastic Anemia & Fetal Neural Tube Defects (Spina Bifida, Anencephaly)',
    deficiencySymptoms: [
      'Fatigue, pallor, exertional dyspnea (Megaloblastic anemia)',
      'Glossitis, oral aphthous ulcers, diarrhea',
      'Elevated plasma homocysteine (Hyperhomocysteinemia)',
      'Severe congenital neural tube malformations in newborns'
    ],
    toxicityRisk: 'High doses of synthetic folic acid (>1,000µg) can mask the hematologic signs of Vitamin B12 deficiency while neurological damage progresses.',
    toxicitySymptoms: ['Masked B12 deficiency leading to permanent spinal cord degeneration.'],
    clinicalSignificance: 'Universal pre-conceptional supplementation reduces neural tube defect incidence by over 70%.',
    bestTakenWith: 'Vitamin B12 and Vitamin C.'
  },
  {
    id: 'vit-k',
    code: 'Vit-K',
    name: 'Vitamin K (Phylloquinone K1 & Menaquinone K2)',
    chemicalName: '2-methyl-1,4-naphthoquinone derivatives',
    type: 'Fat-Soluble',
    rdaMen: '120 µg/day',
    rdaWomen: '90 µg/day',
    upperLimit: 'No UL Established',
    primaryFunctions: [
      'Gamma-glutamyl carboxylase cofactor: activates Blood Clotting Factors II (Prothrombin), VII, IX, and X in liver.',
      'Carboxylates Osteocalcin in bones, binding circulating calcium to hydroxyapatite bone crystal lattice.',
      'Activates Matrix Gla Protein (MGP), preventing pathological arterial wall calcification and vascular stiffness.'
    ],
    topFoodSources: [
      { food: 'Natto (Fermented Soy - K2 MK-7)', amountPerServing: '850 µg', serving: '100g' },
      { food: 'Cooked Kale (K1)', amountPerServing: '531 µg', serving: '1 cup' },
      { food: 'Cooked Spinach (K1)', amountPerServing: '483 µg', serving: '1 cup' },
      { food: 'Hard Cheeses (K2 MK-4)', amountPerServing: '60 µg', serving: '50g' }
    ],
    absorptionAndBioavailability: 'K1 absorbed in ileum with dietary fat; K2 is synthesized by colonic microflora and found in fermented foods with longer half-life.',
    deficiencyDisorder: 'Vitamin K Deficiency Bleeding (VKDB in newborns) & Hemorrhagic Diathesis',
    deficiencySymptoms: [
      'Prolonged Prothrombin Time (Elevated PT / INR)',
      'Easy ecchymosis (bruising), mucosal epistaxis, hematuria, and gastrointestinal bleeding',
      'Neonatal intracranial hemorrhage (prevented by routine newborn Vitamin K injection)',
      'Accelerated osteoporosis and vascular calcification'
    ],
    toxicityRisk: 'Extremely rare with natural K1/K2. Menadione (synthetic K3) is obsolete due to hemolytic anemia risk.',
    toxicitySymptoms: ['Interference with oral anticoagulant therapy (Warfarin).'],
    clinicalSignificance: 'Key regulator of coagulation and vascular elasticity. Must maintain consistent daily intake when on Warfarin.',
    bestTakenWith: 'Vitamin D3 and dietary fats.'
  }
];

// ==========================================
// 3. MINERALS ENCYCLOPEDIA
// ==========================================
export const MINERALS_DATA: MineralDetail[] = [
  {
    id: 'min-iron',
    name: 'Iron (Heme & Non-Heme)',
    chemicalSymbol: 'Fe',
    type: 'Trace Mineral',
    rdaMen: '8 mg/day',
    rdaWomen: '18 mg/day (27 mg pregnancy, 8 mg post-menopausal)',
    upperLimit: '45 mg/day',
    primaryFunctions: [
      'Core component of Hemoglobin in erythrocytes, transporting oxygen from alveoli to peripheral tissue.',
      'Myoglobin oxygen storage in skeletal and cardiac muscle fibers.',
      'Essential electron transport chain prosthetic group in Cytochrome enzymes generating ATP.'
    ],
    topFoodSources: [
      { food: 'Steamed Oysters / Clams (Heme)', amountPerServing: '8.0 mg', serving: '85g' },
      { food: 'Lean Beef Tenderloin (Heme)', amountPerServing: '3.1 mg', serving: '100g' },
      { food: 'Cooked Lentils (Non-Heme)', amountPerServing: '6.6 mg', serving: '1 cup' },
      { food: 'Cooked Spinach (Non-Heme)', amountPerServing: '6.4 mg', serving: '1 cup' }
    ],
    absorptionFactors: 'Heme iron is absorbed intact with 15-35% efficiency. Non-heme iron is absorbed at 2-10%, enhanced by Vitamin C and animal protein; inhibited by phytates in grains, polyphenols/tannins in tea/coffee, and calcium.',
    deficiencyDisorder: 'Microcytic Hypochromic Iron-Deficiency Anemia',
    deficiencySymptoms: [
      'Profound fatigue, exertional dyspnea, and tachycardia',
      'Pallor of conjunctiva and palmar creases',
      'Koilonychia (spoon-shaped concave fingernails) and angular cheilitis',
      'Pica (craving non-food items like ice, dirt, or chalk)',
      'Restless Leg Syndrome (RLS) and impaired cognitive focus'
    ],
    toxicityRisk: 'High in Hemochromatosis or acute pediatric ingestion of iron pills.',
    toxicitySymptoms: [
      'Hemochromatosis: Bronze diabetes, hepatic cirrhosis, dilated cardiomyopathy, and testicular atrophy',
      'Acute poisoning: Necrotizing gastroenteritis, metabolic acidosis, shock, and acute liver failure'
    ],
    clinicalSignificance: 'Most widespread nutritional deficiency globally affecting over 1.6 billion people.',
  },
  {
    id: 'min-magnesium',
    name: 'Magnesium',
    chemicalSymbol: 'Mg',
    type: 'Macromineral',
    rdaMen: '400 - 420 mg/day',
    rdaWomen: '310 - 320 mg/day (350 mg pregnancy)',
    upperLimit: '350 mg supplemental/day (No UL from whole foods)',
    primaryFunctions: [
      'Required cofactor for >300 enzymatic reactions, including all ATP-dependent kinase phosphorylation steps.',
      'Natural physiological calcium channel blocker regulating cardiac conduction and vascular smooth muscle tone.',
      'Regulates NMDA receptors in brain, supporting neuromuscular calm, GABAergic activity, and sleep quality.'
    ],
    topFoodSources: [
      { food: 'Pumpkin Seeds (Pepitas)', amountPerServing: '156 mg', serving: '30g (1 oz)' },
      { food: 'Cooked Spinach', amountPerServing: '157 mg', serving: '1 cup' },
      { food: 'Dark Chocolate (85% Cocoa)', amountPerServing: '65 mg', serving: '30g' },
      { food: 'Almonds', amountPerServing: '80 mg', serving: '30g' }
    ],
    absorptionFactors: 'Absorbed in distal jejunum and ileum via TRPM6 channels; absorption decreased by high dietary phytic acid and unabsorbed free fatty acids.',
    deficiencyDisorder: 'Hypomagnesemia & Neuromuscular Tetany',
    deficiencySymptoms: [
      'Muscle fasciculations, painful nocturnal leg cramps, and carpopedal spasm (Trousseau/Chvostek signs)',
      'Cardiac ventricular arrhythmias, prolonged QT interval, and Torsades de Pointes',
      'Refractory Hypokalemia and Hypocalcemia',
      'Chronic insomnia, migraine headaches, and anxiety'
    ],
    toxicityRisk: 'Moderate from excessive supplements or magnesium-containing antacids in kidney failure.',
    toxicitySymptoms: [
      'Osmotic diarrhea and abdominal cramping',
      'Hypotension, bradycardia, diminished deep tendon reflexes, and respiratory depression in severe hypermagnesemia'
    ],
    clinicalSignificance: 'Under-consumed by >50% of Western populations eating processed refined food diets.',
  },
  {
    id: 'min-calcium',
    name: 'Calcium',
    chemicalSymbol: 'Ca',
    type: 'Macromineral',
    rdaMen: '1,000 mg (1,200 mg for age >70)',
    rdaWomen: '1,000 mg (1,200 mg for age >50)',
    upperLimit: '2,000 - 2,500 mg/day',
    primaryFunctions: [
      'Forms hydroxyapatite mineral matrix with phosphate providing mechanical strength to skeleton and teeth.',
      'Triggers troponin C in actin-myosin cross-bridge muscle contraction (skeletal and myocardial).',
      'Second messenger triggering neurotransmitter vesicle exocytosis and coagulation cascade Factor IV.'
    ],
    topFoodSources: [
      { food: 'Plain Greek Yogurt', amountPerServing: '240 mg', serving: '200g' },
      { food: 'Canned Sardines (with bones)', amountPerServing: '325 mg', serving: '85g' },
      { food: 'Fortified Plant Milk', amountPerServing: '300 mg', serving: '1 cup (240ml)' },
      { food: 'Cooked Collard Greens', amountPerServing: '268 mg', serving: '1 cup' }
    ],
    absorptionFactors: 'Requires gastric acid and Vitamin D-dependent active transport in duodenum; oxalates (in rhubarb, raw spinach) bind calcium, reducing fractional absorption.',
    deficiencyDisorder: 'Osteoporosis, Osteopenia, and Hypocalcemic Tetany',
    deficiencySymptoms: [
      'Silent bone micro-architectural deterioration leading to fragility fractures (hip, vertebra, wrist)',
      'Perioral paresthesia and numbness in fingertips',
      'Laryngospasm, carpopedal spasms, and hyperreflexia'
    ],
    toxicityRisk: 'Moderate with excess supplements (>2,000mg) taken without Vitamin K2.',
    toxicitySymptoms: [
      'Nephrolithiasis (Calcium oxalate kidney stones)',
      'Milk-Alkali syndrome (hypercalcemia, metabolic alkalosis, renal insufficiency)',
      'Constipation and impaired absorption of iron and zinc'
    ],
    clinicalSignificance: 'Tight hormonal control (PTH, Calcitriol, Calcitonin) maintains serum ionized calcium strictly at 8.5-10.2 mg/dL.',
  },
  {
    id: 'min-potassium',
    name: 'Potassium',
    chemicalSymbol: 'K',
    type: 'Macromineral',
    rdaMen: '3,400 mg/day',
    rdaWomen: '2,600 mg/day (2,900 mg pregnancy/lactation)',
    upperLimit: 'No UL for healthy kidneys (Excreted by aldosterone in renal distal tubule)',
    primaryFunctions: [
      'Maintains resting membrane potential (-70 to -90 mV) via Na+/K+ ATPase pumps across all excitable cardiac and nerve cells.',
      'Counterbalances sodium, promoting renal natriuresis and relaxing arteriolar vascular tone to lower blood pressure.',
      'Prevents hypercalciuria and reduces risk of kidney stones.'
    ],
    topFoodSources: [
      { food: 'Baked Potato (with skin)', amountPerServing: '926 mg', serving: '1 medium' },
      { food: 'Avocado', amountPerServing: '728 mg', serving: '1 whole' },
      { food: 'Cooked Spinach', amountPerServing: '839 mg', serving: '1 cup' },
      { food: 'Coconut Water', amountPerServing: '600 mg', serving: '1 cup (240ml)' },
      { food: 'Banana', amountPerServing: '422 mg', serving: '1 medium' }
    ],
    absorptionFactors: 'Passive diffusion in small intestine with >85% absorption efficiency. Renal excretion tightly regulated by Aldosterone.',
    deficiencyDisorder: 'Hypokalemia & Cardiac Arrhythmias',
    deficiencySymptoms: [
      'Severe generalized muscle weakness, hyporeflexia, and paralytic ileus',
      'ECG changes: Flattened T-waves, ST depression, and prominent U-waves',
      'Hypertension and elevated salt-sensitivity',
      'Increased risk of ventricular fibrillation'
    ],
    toxicityRisk: 'High in End-Stage Renal Disease (ESRD) or with Potassium-Sparing Diuretics (Spironolactone).',
    toxicitySymptoms: [
      'Peaked T-waves, widened QRS, PR prolongation on ECG',
      'Fatal cardiac arrest in asystole / ventricular fibrillation',
      'Ascending muscle paralysis'
    ],
    clinicalSignificance: 'Crucial DASH diet cornerstone for non-pharmacological hypertension control.',
  },
  {
    id: 'min-zinc',
    name: 'Zinc',
    chemicalSymbol: 'Zn',
    type: 'Trace Mineral',
    rdaMen: '11 mg/day',
    rdaWomen: '8 mg/day (11 mg pregnancy, 12 mg lactation)',
    upperLimit: '40 mg/day',
    primaryFunctions: [
      'Structural component of Zinc-finger transcription factors regulating gene transcription.',
      'Catalytic cofactor for Carbonic Anhydrase, Alcohol Dehydrogenase, and Superoxide Dismutase (SOD1).',
      'Essential for thymulin hormone activation, T-lymphocyte proliferation, and wound re-epithelialization.'
    ],
    topFoodSources: [
      { food: 'Cooked Oysters', amountPerServing: '74 mg (673% DV)', serving: '85g (6 medium)' },
      { food: 'Lean Beef Roast', amountPerServing: '7.0 mg', serving: '85g' },
      { food: 'Pumpkin Seeds', amountPerServing: '2.2 mg', serving: '30g' },
      { food: 'Chickpeas (Cooked)', amountPerServing: '2.5 mg', serving: '1 cup' }
    ],
    absorptionFactors: 'Absorbed in duodenum via ZIP4 transporters. Phytates in whole grains bind zinc; soaking and sprouting grains degrades phytate and boosts zinc uptake.',
    deficiencyDisorder: 'Acrodermatitis Enteropathica & Severe Immune Impairment',
    deficiencySymptoms: [
      'Acrodermatitis: Pustular, periorificial, and acral erythematous rash',
      'Impaired taste and smell (Hypogeusia / Hyposmia)',
      'Alopecia (hair loss) and delayed wound healing',
      'Growth retardation and hypogonadism in adolescent males',
      'Chronic diarrhea and frequent opportunistic infections'
    ],
    toxicityRisk: 'High with chronic supplements (>50mg/day) inducing secondary Copper deficiency.',
    toxicitySymptoms: [
      'Copper-deficiency microcytic anemia and ataxia',
      'Nausea, metallic taste, epigastric pain',
      'Suppressed HDL cholesterol'
    ],
    clinicalSignificance: 'Proven in clinical trials to reduce common cold duration and severity when taken at symptom onset.',
  }
];

// ==========================================
// 4. MACRONUTRIENTS (Proteins, Carbs, Fats)
// ==========================================
export const MACRONUTRIENTS_DATA: MacronutrientInfo[] = [
  {
    id: 'macro-protein',
    name: 'Proteins & Essential Amino Acids',
    category: 'Protein',
    caloriesPerGram: 4,
    recommendedPercentOfDailyCalories: '15% - 35% (AMDR)',
    idealDailyGramsAvg: '0.8 - 1.6g per kg of ideal body weight (up to 2.2g/kg for athletic recovery)',
    subtypes: [
      {
        name: 'Complete Proteins (High Biological Value)',
        description: 'Provide all 9 essential amino acids (Histidine, Isoleucine, Leucine, Lysine, Methionine, Phenylalanine, Threonine, Tryptophan, Valine) in optimal human ratios.',
        healthySources: ['Eggs', 'Wild Salmon', 'Poultry', 'Greek Yogurt', 'Quinoa', 'Tofu & Tempeh'],
        healthImpact: 'Maximizes Muscle Protein Synthesis (MPS) via Leucine threshold (~2.5-3g/meal).'
      },
      {
        name: 'Incomplete Plant Proteins',
        description: 'Plant proteins that have one or more limiting amino acids (e.g. grains are low in lysine; legumes are low in methionine).',
        healthySources: ['Lentils', 'Chickpeas', 'Oats', 'Chia Seeds', 'Almonds'],
        healthImpact: 'Combining complementary plant proteins throughout the day delivers all essential amino acids with zero saturated fat.'
      },
      {
        name: 'Branched-Chain Amino Acids (BCAAs)',
        description: 'Leucine, Isoleucine, and Valine metabolized directly in skeletal muscle rather than liver.',
        healthySources: ['Whey protein', 'Egg whites', 'Chicken breast', 'Soy protein'],
        healthImpact: 'Triggers mTOR anabolic pathway and accelerates exercise recovery.'
      }
    ],
    keyPhysiologicalRoles: [
      'Enzymatic catalysis of all cellular biochemical metabolic reactions.',
      'Structural scaffolding: Collagen in bone/skin, Keratin in hair/nails, Elastin in arteries.',
      'Immunoglobulin antibodies neutralizing viral and bacterial pathogens.',
      'Peptide hormones (Insulin, Glucagon, Growth Hormone) signaling systemic homeostasis.'
    ],
    optimalTimingAndIntake: 'Evenly distribute 25-40g protein across 3-4 meals every 4-5 hours to optimize 24-hour muscle protein synthesis and maximize thermic satiety.',
    healthRisksOfDeficiency: 'Sarcopenia (muscle wasting), Kwashiorkor/Marasmus, impaired wound healing, hypoalbuminemia with peripheral edema, and immune collapse.',
    healthRisksOfExcess: 'In patients with pre-existing Chronic Kidney Disease (CKD), high-protein diets accelerate glomerular hyperfiltration. No damage in healthy individuals with proper hydration.'
  },
  {
    id: 'macro-carbs',
    name: 'Carbohydrates & Dietary Fiber',
    category: 'Carbohydrate',
    caloriesPerGram: 4,
    recommendedPercentOfDailyCalories: '45% - 65% (AMDR)',
    idealDailyGramsAvg: '130g minimum for central nervous system glucose needs; 25-38g daily fiber minimum',
    subtypes: [
      {
        name: 'Complex Polysaccharides & Resistant Starch',
        description: 'Long branched glucose polymer chains providing slow, sustained enzymatic breakdown.',
        healthySources: ['Steel-Cut Oats', 'Brown Rice', 'Sweet Potatoes', 'Cooled Cooked Potatoes', 'Lentils'],
        healthImpact: 'Steadies postprandial glucose curves, lowers HbA1c, and feeds colon butyrate-producing bacteria.'
      },
      {
        name: 'Soluble Viscous Dietary Fiber',
        description: 'Dissolves in water to form a gel in the gastrointestinal tract, binding bile acids and slowing gastric emptying.',
        healthySources: ['Beta-glucan in Oats/Barley', 'Pectin in Apples/Citrus', 'Psyllium Husk', 'Beans'],
        healthImpact: 'Reduces LDL cholesterol by 5-15% and flattens glycemic spikes.'
      },
      {
        name: 'Insoluble Structural Fiber',
        description: 'Cellulose and lignin that add bulk to stool and accelerate colonic transit time.',
        healthySources: ['Wheat Bran', 'Cruciferous Vegetables', 'Nuts & Seeds', 'Fruit skins'],
        healthImpact: 'Prevents constipation, diverticulosis, and decreases colorectal cancer risk.'
      },
      {
        name: 'Refined Simple Sugars (Avoid / Minimize)',
        description: 'Rapidly absorbed sucrose, high-fructose corn syrup, and refined flour.',
        healthySources: ['Limit: sodas, candies, commercial pastries, white bread'],
        healthImpact: 'Induces rapid insulin spikes, hepatic de novo lipogenesis, visceral adiposity, and NAFLD.'
      }
    ],
    keyPhysiologicalRoles: [
      'Primary cellular ATP fuel for erythrocytes, renal medulla, and central nervous system neurons.',
      'Glycogen storage in liver (~100g) and skeletal muscle (~400-500g) for physical endurance.',
      'Protein-sparing effect: adequate carbohydrate prevents gluconeogenesis from muscle protein breakdown.'
    ],
    optimalTimingAndIntake: 'Focus on low-glycemic, unrefined complex carbs around physical activity when GLUT4 transporters are insulin-independently active.',
    healthRisksOfDeficiency: 'Ketosis, lethargy, mental fog during adaptation, reduced high-intensity anaerobic athletic performance, and constipation from low fiber.',
    healthRisksOfExcess: 'Insulin resistance, Type 2 Diabetes Mellitus, hypertriglyceridemia, central obesity, and chronic systemic low-grade inflammation.'
  },
  {
    id: 'macro-fats',
    name: 'Fats, Lipids & Essential Fatty Acids',
    category: 'Fat & Lipid',
    caloriesPerGram: 9,
    recommendedPercentOfDailyCalories: '20% - 35% (AMDR)',
    idealDailyGramsAvg: '44 - 77g for 2000 kcal diet (<10% saturated fat, 0% industrial trans fats)',
    subtypes: [
      {
        name: 'Monounsaturated Fatty Acids (MUFAs - Omega-9)',
        description: 'Single cis-double bond fatty acids highly resistant to oxidative damage.',
        healthySources: ['Extra Virgin Olive Oil', 'Avocados', 'Almonds', 'Hazelnuts'],
        healthImpact: 'Improves insulin sensitivity, increases anti-atherogenic HDL, and lowers cardiovascular mortality.'
      },
      {
        name: 'Polyunsaturated Fatty Acids (PUFAs - Omega-3 EPA/DHA/ALA)',
        description: 'Multiple double bonds synthesizing anti-inflammatory Resolvins and Protectins.',
        healthySources: ['Wild Salmon', 'Mackerel', 'Walnuts', 'Flaxseeds', 'Chia Seeds'],
        healthImpact: 'Lowers triglycerides, stabilizes myocardial membranes, and decreases sudden cardiac death risk.'
      },
      {
        name: 'Saturated Fatty Acids (SFAs - Moderate to Limit)',
        description: 'No double bonds; packed tightly in membranes. High intake downregulates hepatic LDL receptors.',
        healthySources: ['Grass-fed butter', 'Coconut oil', 'Fatty meats', 'Aged cheese'],
        healthImpact: 'Excess elevates ApoB and LDL cholesterol; keep below 7-10% of total daily calories.'
      },
      {
        name: 'Industrial Trans-Fats (Strictly Ban)',
        description: 'Partially hydrogenated vegetable oils altering membrane rigidity.',
        healthySources: ['Zero tolerance: commercial fried foods, shortening, margarines'],
        healthImpact: 'Raises atherogenic LDL while aggressively lowering protective HDL, multiplying coronary heart disease risk.'
      }
    ],
    keyPhysiologicalRoles: [
      'Phospholipid bilayer structural foundation of all human cell and mitochondrial membranes.',
      'Precursor for steroid hormones: Testosterone, Estrogen, Progesterone, Cortisol, and Vitamin D.',
      'Mandatory carrier solvent for the absorption of Fat-Soluble Vitamins (A, D, E, K).',
      'Thermal insulation, visceral organ cushioning, and concentrated long-term energy reserve.'
    ],
    optimalTimingAndIntake: 'Emphasize extra virgin olive oil and omega-3s with daily meals to optimize vitamin absorption and promote satiety.',
    healthRisksOfDeficiency: 'Essential Fatty Acid Deficiency (EFAD): dry scaly dermatosis, alopecia, poor wound healing, hormonal imbalances, and cognitive decline.',
    healthRisksOfExcess: 'Atherosclerosis, coronary artery disease, obesity, and systemic lipotoxicity when consumed in hypercaloric excess.'
  }
];

// ==========================================
// 5. MICRONUTRIENT SYNERGIES & INTERACTIONS
// ==========================================
export const MICRONUTRIENT_SYNERGIES: MicronutrientSynergy[] = [
  {
    id: 'syn-1',
    title: 'Vitamin C + Non-Heme Iron Absorption Booster',
    type: 'Synergy (Enhancing)',
    nutrientA: 'Vitamin C (Ascorbic Acid)',
    nutrientB: 'Non-Heme Iron (Plant-Based Fe3+)',
    mechanism: 'Ascorbic acid reduces insoluble ferric iron (Fe3+) into soluble ferrous iron (Fe2+) and forms a chelate in the acidic stomach that remains soluble in the alkaline duodenum.',
    clinicalAdvice: 'Always consume plant-based iron sources (Spinach, Lentils, Beans) alongside Vitamin C foods (Lemon juice, Bell peppers, Tomatoes) to increase iron absorption up to 400%.',
    mealExample: 'Warm Lentil Soup with fresh squeezed lemon juice and raw bell pepper salad.'
  },
  {
    id: 'syn-2',
    title: 'Calcium vs. Iron Competitive Inhibition',
    type: 'Antagonism (Inhibiting)',
    nutrientA: 'Calcium (from Dairy or Supplements)',
    nutrientB: 'Iron (Heme & Non-Heme)',
    mechanism: 'Calcium competitively binds the DMT-1 (Divalent Metal Transporter-1) channel on enterocytes, directly blocking iron uptake.',
    clinicalAdvice: 'Space high-calcium meals (milk, cheese, yogurt, calcium tablets) at least 2 hours apart from iron-rich meals or therapeutic iron supplements.',
    mealExample: 'Do not drink a glass of milk with an iron-rich steak or take your iron supplement with morning latte.'
  },
  {
    id: 'syn-3',
    title: 'Vitamin D3 + Vitamin K2 (MK-7) + Magnesium Bone Synergy',
    type: 'Synergy (Enhancing)',
    nutrientA: 'Vitamin D3 & Magnesium',
    nutrientB: 'Vitamin K2 (Menaquinone-7)',
    mechanism: 'Vitamin D3 increases calcium absorption from gut into blood; Vitamin K2 carboxylates Osteocalcin and Matrix Gla Protein, directing calcium strictly into bones and teeth and keeping it out of coronary arteries; Magnesium activates D3.',
    clinicalAdvice: 'When taking high-dose Vitamin D3 supplements (>2,000 IU), always co-supplement with Vitamin K2 (100 µg MK-7) and Magnesium (200-400 mg).',
    mealExample: 'Grilled wild salmon (Vitamin D) served with steamed kale (Vitamin K1/K2) and pumpkin seeds (Magnesium).'
  },
  {
    id: 'syn-4',
    title: 'Piperine (Black Pepper) + Curcumin Bioavailability Supercharger',
    type: 'Synergy (Enhancing)',
    nutrientA: 'Piperine (Alkaloid in Black Pepper)',
    nutrientB: 'Curcumin (Polyphenol in Turmeric)',
    mechanism: 'Curcumin undergoes rapid hepatic and intestinal glucuronidation, yielding low bioavailability. Piperine inhibits hepatic glucuronidation, increasing serum curcumin levels by 2,000%.',
    clinicalAdvice: 'Whenever cooking with turmeric or taking curcumin supplements, add a pinch of freshly cracked black pepper.',
    mealExample: 'Golden Milk made with warm turmeric, crushed black peppercorns, and coconut milk.'
  }
];

// ==========================================
// 6. ENHANCED RECIPES (Comprehensive Details)
// ==========================================
export const ENHANCED_RECIPES: Recipe[] = [
  {
    id: 'rec-salmon-power-bowl',
    title: 'Mediterranean Quinoa & Wild Salmon Longevity Power Bowl',
    description: 'Crispy pan-seared wild Alaskan salmon served over a bed of fluffy herbed quinoa, crisp Persian cucumbers, cherry tomatoes, Kalamata olives, and a zesty lemon-tahini garlic dressing.',
    prepTime: '15 mins',
    cookTime: '15 mins',
    calories: 495,
    protein: '38g',
    carbs: '41g',
    fats: '20g',
    netCarbs: '34g',
    fiber: '7g',
    sodiumMg: 380,
    potassiumMg: 890,
    calciumMg: 110,
    ironMg: 3.8,
    servings: 2,
    difficulty: 'Easy',
    cuisine: 'Mediterranean',
    dietTags: ['Heart-Healthy', 'Diabetic-Friendly', 'Gluten-Free', 'Low-Sodium', 'Anti-Inflammatory', 'High-Protein', 'Mediterranean'],
    ingredients: [
      '2 wild Alaskan salmon fillets (6 oz / 170g each), skin on',
      '1 cup organic white or tri-color quinoa, rinsed thoroughly',
      '2 cups low-sodium vegetable or bone broth',
      '1 cup organic cherry tomatoes, halved',
      '1 English cucumber, diced',
      '1/4 cup Kalamata olives, pitted and sliced',
      '2 cups organic baby arugula or spinach',
      '2 tbsp extra virgin olive oil (cold-pressed)',
      '2 tbsp tahini (sesame paste)',
      '2 tbsp freshly squeezed lemon juice',
      '1 clove garlic, finely minced',
      '1 tbsp fresh dill and flat-leaf parsley, finely chopped',
      '1/2 tsp sea salt and freshly cracked black pepper'
    ],
    instructions: [
      '1. Cook the Quinoa Base: In a medium saucepan, combine rinsed quinoa and vegetable broth with a pinch of salt. Bring to a rapid rolling boil, then reduce heat to low, cover with tight lid, and simmer for 15 minutes until liquid is fully absorbed. Remove from heat, let stand covered for 5 minutes, and fluff with a fork.',
      '2. Prepare the Lemon-Tahini Dressing: In a small glass bowl, whisk together the tahini, fresh lemon juice, minced garlic, 1 tbsp extra virgin olive oil, and 2 tbsp warm water until smooth, creamy, and pourable. Season with a pinch of black pepper.',
      '3. Sear the Wild Salmon: Pat the salmon fillets completely dry with paper towels (key for crispy skin). Season both sides with salt, black pepper, and chopped fresh dill. Heat 1 tbsp olive oil in a stainless steel or cast-iron skillet over medium-high heat until shimmering. Place salmon skin-side down and press gently with a spatula for 10 seconds. Sear undisturbed for 4-5 minutes until skin is golden and crispy, then flip and cook for an additional 3-4 minutes until medium (internal temp 125°F-130°F / 52°C-54°C).',
      '4. Assemble the Power Bowls: Divide the warm fluffy quinoa between two wide shallow bowls. Top with a bed of fresh baby arugula. Arrange the halved cherry tomatoes, diced cucumbers, sliced Kalamata olives, and crispy wild salmon fillet on top.',
      '5. Finish & Garnish: Generously drizzle the creamy lemon-tahini dressing over the bowl and garnish with fresh chopped dill and a wedge of lemon. Serve immediately.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    healthBenefits: [
      'Provides >2,200mg EPA & DHA Omega-3s supporting arterial health, plaque stabilization, and mood balance.',
      'Complete amino acid profile from wild salmon and quinoa enhances cellular repair without dairy or gluten.',
      'Rich in potassium and magnesium helping maintain healthy vascular endothelium and blood pressure.'
    ],
    chefTips: [
      'Pat salmon thoroughly dry with paper towels before searing — surface moisture creates steam instead of a crisp golden crust.',
      'Let cooked quinoa rest covered for 5 minutes off the heat before fluffing with a fork for maximum lightness.'
    ],
    allergenWarnings: ['Fish (Salmon)', 'Sesame (Tahini)'],
    equipmentNeeded: ['Cast Iron Skillet', 'Medium Saucepan with Lid', 'Chef Knife & Cutting Board', 'Small Whisk'],
    microsHighlight: [
      { label: 'Omega-3 EPA/DHA', amount: '2,200 mg', dv: '440%' },
      { label: 'Vitamin D', amount: '680 IU', dv: '85%' },
      { label: 'Vitamin B12', amount: '4.8 µg', dv: '200%' },
      { label: 'Selenium', amount: '52 µg', dv: '95%' }
    ],

    // Food Ingredients Breakdown
    foodIngredientsBreakdown: [
      {
        foodName: 'Wild Alaskan Salmon Fillet (170g per serving)',
        quantity: '170g',
        foodId: 'food-salmon',
        calories: 310,
        proteinG: 34,
        carbsG: 0,
        fatG: 14,
        fiberG: 0,
        highlightNutrients: ['Omega-3 (EPA/DHA) 2,200mg', 'Vitamin D 680 IU', 'Vitamin B12 4.8µg', 'Selenium 52µg']
      },
      {
        foodName: 'Cooked Royal Quinoa',
        quantity: '100g (1/2 cup)',
        foodId: 'food-quinoa',
        calories: 120,
        proteinG: 4.4,
        carbsG: 21.3,
        fatG: 1.9,
        fiberG: 2.8,
        highlightNutrients: ['Folate 42µg', 'Magnesium 64mg', 'Complete 9 Essential Amino Acids']
      },
      {
        foodName: 'Extra Virgin Olive Oil (Cold-Pressed)',
        quantity: '1 tbsp (14g)',
        calories: 119,
        proteinG: 0,
        carbsG: 0,
        fatG: 13.5,
        fiberG: 0,
        highlightNutrients: ['Oleic Acid (MUFA) 10g', 'Polyphenols', 'Vitamin E 1.9mg']
      },
      {
        foodName: 'Organic Cherry Tomatoes',
        quantity: '1/2 cup (75g)',
        calories: 14,
        proteinG: 0.7,
        carbsG: 3.0,
        fatG: 0.2,
        fiberG: 0.9,
        highlightNutrients: ['Lycopene 2.5mg', 'Vitamin C 15mg', 'Potassium 180mg']
      },
      {
        foodName: 'Organic Baby Spinach / Arugula',
        quantity: '1 cup (30g)',
        foodId: 'food-spinach',
        calories: 7,
        proteinG: 0.9,
        carbsG: 1.1,
        fatG: 0.1,
        fiberG: 0.7,
        highlightNutrients: ['Vitamin K1 145µg', 'Lutein & Zeaxanthin', 'Folate 58µg']
      },
      {
        foodName: 'Sesame Tahini Paste & Fresh Lemon',
        quantity: '1 tbsp (15g)',
        calories: 89,
        proteinG: 2.6,
        carbsG: 3.2,
        fatG: 8.0,
        fiberG: 1.4,
        highlightNutrients: ['Sesamin Lignans', 'Calcium 64mg', 'Copper 0.4mg']
      }
    ],

    // Macronutrients Analysis
    macroBreakdown: {
      protein: {
        grams: 38,
        percentKcal: 31,
        quality: 'Complete Protein (PDCAAS 1.0) with optimal Leucine threshold for muscle protein synthesis',
        leucineG: 3.1,
        keyAminoAcids: ['Leucine (3.1g)', 'Isoleucine (1.8g)', 'Valine (2.0g)', 'Lysine (3.4g)', 'Methionine (1.1g)']
      },
      carbs: {
        totalG: 41,
        netCarbsG: 34,
        fiberG: 7,
        solubleFiberG: 2.5,
        insolubleFiberG: 4.5,
        sugarsG: 2.8,
        glycemicIndex: 32,
        glycemicLoad: 11
      },
      fats: {
        totalG: 20,
        mufaG: 9.8,
        pufaG: 6.4,
        omega3Mg: 2200,
        saturatedG: 2.6,
        transG: 0,
        omega6To3Ratio: '1 : 2.5 (Extremely anti-inflammatory)'
      },
      calorieDistribution: {
        proteinPercent: 31,
        carbsPercent: 33,
        fatPercent: 36
      }
    },

    // Vitamin Directory
    vitaminDirectory: [
      {
        code: 'Vit-D3',
        name: 'Vitamin D3 (Cholecalciferol)',
        amount: '680 IU',
        dvPercent: 85,
        solubility: 'Fat-Soluble',
        role: 'Regulates calcium homeostasis, immune gene expression, and bone remodeling.',
        foodSourceInRecipe: 'Wild Alaskan Salmon'
      },
      {
        code: 'Vit-B12',
        name: 'Vitamin B12 (Cobalamin)',
        amount: '4.8 µg',
        dvPercent: 200,
        solubility: 'Water-Soluble',
        role: 'Erythrocyte DNA synthesis, homocysteine methylation, and myelin sheath maintenance.',
        foodSourceInRecipe: 'Wild Alaskan Salmon'
      },
      {
        code: 'Vit-K1',
        name: 'Vitamin K1 (Phylloquinone)',
        amount: '165 µg',
        dvPercent: 138,
        solubility: 'Fat-Soluble',
        role: 'Hepatic clotting factor gamma-carboxylation and vascular Matrix Gla Protein activation.',
        foodSourceInRecipe: 'Baby Spinach & Arugula'
      },
      {
        code: 'Vit-B6',
        name: 'Vitamin B6 (Pyridoxal-5-Phosphate)',
        amount: '1.1 mg',
        dvPercent: 65,
        solubility: 'Water-Soluble',
        role: 'Transamination of amino acids, neurotransmitter synthesis (GABA, Serotonin, Dopamine).',
        foodSourceInRecipe: 'Salmon, Quinoa & Tahini'
      },
      {
        code: 'Vit-B9',
        name: 'Folate (Tetrahydrofolate)',
        amount: '135 µg',
        dvPercent: 34,
        solubility: 'Water-Soluble',
        role: 'One-carbon metabolism, purine synthesis, and prevention of hyperhomocysteinemia.',
        foodSourceInRecipe: 'Quinoa & Leafy Greens'
      },
      {
        code: 'Vit-C',
        name: 'Vitamin C (Ascorbic Acid)',
        amount: '28 mg',
        dvPercent: 31,
        solubility: 'Water-Soluble',
        role: 'Collagen proline hydroxylation, vascular basement membrane protection, antioxidant.',
        foodSourceInRecipe: 'Cherry Tomatoes & Fresh Lemon Juice'
      },
      {
        code: 'Vit-E',
        name: 'Vitamin E (Alpha-Tocopherol)',
        amount: '3.4 mg',
        dvPercent: 23,
        solubility: 'Fat-Soluble',
        role: 'Lipid membrane antioxidant protecting polyunsaturated fatty acids from peroxidation.',
        foodSourceInRecipe: 'Extra Virgin Olive Oil & Tahini'
      }
    ],

    // Essential Minerals Profile
    essentialMinerals: [
      {
        symbol: 'Se',
        name: 'Selenium',
        amount: '52 µg',
        dvPercent: 95,
        category: 'Trace Mineral',
        role: 'Selenoprotein cofactor for Glutathione Peroxidase and iodothyronine deiodinases.',
        foodSourceInRecipe: 'Wild Alaskan Salmon',
        absorptionTip: 'Highly bioavailable organic selenomethionine form.'
      },
      {
        symbol: 'K',
        name: 'Potassium',
        amount: '890 mg',
        dvPercent: 26,
        category: 'Macromineral',
        role: 'Maintains resting membrane potential, counteracts sodium, and lowers arterial tone.',
        foodSourceInRecipe: 'Salmon, Quinoa, Cucumber & Tomatoes',
        absorptionTip: 'Enhanced when consumed with adequate hydration.'
      },
      {
        symbol: 'Mg',
        name: 'Magnesium',
        amount: '115 mg',
        dvPercent: 29,
        category: 'Macromineral',
        role: 'Cofactor in 300+ enzymatic reactions, ATP stabilization, and endothelial vasodilation.',
        foodSourceInRecipe: 'Quinoa, Spinach & Tahini'
      },
      {
        symbol: 'Fe',
        name: 'Iron (Heme & Non-Heme)',
        amount: '3.8 mg',
        dvPercent: 21,
        category: 'Trace Mineral',
        role: 'Hemoglobin and myoglobin oxygen transport, mitochondrial electron chain cytochromes.',
        foodSourceInRecipe: 'Salmon (Heme) + Quinoa/Spinach (Non-Heme)',
        absorptionTip: 'Lemon juice Vitamin C triples non-heme iron absorption from quinoa and spinach.'
      },
      {
        symbol: 'Zn',
        name: 'Zinc',
        amount: '2.4 mg',
        dvPercent: 22,
        category: 'Trace Mineral',
        role: 'Zinc finger DNA-binding proteins, immune cell proliferation, and antioxidant SOD1.',
        foodSourceInRecipe: 'Salmon & Sesame Tahini'
      },
      {
        symbol: 'Ca',
        name: 'Calcium',
        amount: '110 mg',
        dvPercent: 11,
        category: 'Macromineral',
        role: 'Neuromuscular excitation-contraction coupling and bone mineralization.',
        foodSourceInRecipe: 'Sesame Tahini & Baby Greens'
      },
      {
        symbol: 'P',
        name: 'Phosphorus',
        amount: '420 mg',
        dvPercent: 34,
        category: 'Macromineral',
        role: 'Structural component of bone hydroxyapatite, DNA phosphodiester backbone, and ATP.',
        foodSourceInRecipe: 'Salmon & Quinoa'
      }
    ],

    // Phytonutrients
    phytonutrients: [
      {
        name: 'Astaxanthin',
        chemicalClass: 'Carotenoid (Keto-Carotenoid)',
        presence: '3.2 mg',
        sources: ['Wild Alaskan Salmon (Algal Diet)'],
        mechanism: 'Crosses blood-retinal and blood-brain barriers; 6,000x more potent than Vitamin C in quenching singlet oxygen.',
        healthBenefit: 'Shields vascular endothelium, reduces arterial stiffness, and enhances mitochondrial resilience.'
      },
      {
        name: 'Lycopene',
        chemicalClass: 'Carotenoid (Tetraterpene)',
        presence: '2.5 mg',
        sources: ['Cherry Tomatoes'],
        mechanism: 'Potent lipophilic antioxidant that suppresses oxidized LDL formation and downregulates VCAM-1.',
        healthBenefit: 'Reduces cardiovascular disease risk and provides prostate and endothelial protection.'
      },
      {
        name: 'Lutein & Zeaxanthin',
        chemicalClass: 'Xanthophyll Carotenoids',
        presence: '1.8 mg',
        sources: ['Baby Spinach & Arugula'],
        mechanism: 'Accumulates specifically in macular pigment epithelium of the retina, filtering high-energy blue light.',
        healthBenefit: 'Protects against Age-Related Macular Degeneration (AMD) and ocular oxidative damage.'
      },
      {
        name: 'Oleocanthal & Hydroxytyrosol',
        chemicalClass: 'Secoiridoid Polyphenols',
        presence: '15 mg',
        sources: ['Cold-Pressed Extra Virgin Olive Oil'],
        mechanism: 'Inhibits COX-1 and COX-2 enzymes in a manner analogous to ibuprofen without gastric toxicity.',
        healthBenefit: 'Broad-spectrum anti-inflammatory, neuroprotective, and anti-atherosclerotic effects.'
      }
    ],

    // Synergies
    absorptionSynergies: [
      {
        title: 'Fat-Soluble Carotenoid + Olive Oil Bioavailability Boost',
        mechanism: 'Lycopene (tomatoes), Lutein (spinach), and Astaxanthin (salmon) require lipid micelle incorporation in the gut.',
        impact: 'Extra virgin olive oil and tahini fats increase carotenoid absorption by over 400% compared to fat-free salads.'
      },
      {
        title: 'Vitamin C + Non-Heme Iron Reduction Chelation',
        mechanism: 'Ascorbic acid from fresh lemon juice reduces insoluble Fe3+ to soluble Fe2+ in the duodenum.',
        impact: 'Triples the uptake of plant-based non-heme iron from quinoa and spinach.'
      }
    ],

    // WHAT IF WE EAT LESS (Deficiency Diseases)
    whatIfEatLess: {
      title: 'Nutritional Deficiency Risks & Diseases If You Lack These Nutrients',
      riskSummary: 'A chronic diet lacking wild fish, whole ancient grains, dark leafy greens, and cold-pressed polyphenolic oils leads to severe systemic lipid imbalances, microvascular fragility, cellular energy decline, and micronutrient anemia.',
      associatedDiseases: [
        {
          diseaseName: 'Omega-3 Fatty Acid Deficiency & Endothelial Dysfunction',
          icdOrCategory: 'E63.0 / Cardiovascular Risk',
          deficientNutrient: 'EPA & DHA Long-Chain Omega-3 Polyunsaturated Fats',
          description: 'Cell membranes become depleted of fluidity-promoting DHA and EPA, shifting arachidonic acid cascade toward pro-inflammatory leukotrienes and thromboxane A2.',
          symptoms: ['Dry follicular hyperkeratosis (rough skin bumps)', 'Brittle hair and nails', 'Poor wound healing and chronic joint stiffness', 'Elevated resting heart rate, high triglycerides, and accelerated atherosclerosis', 'Brain fog, depressive mood disorders, and accelerated cognitive decline'],
          highRiskGroups: ['Strict vegans/vegetarians without algal DHA supplementation', 'Individuals on ultra-processed high-Omega-6 seed oil diets', 'Patients with fat malabsorption disorders']
        },
        {
          diseaseName: 'Vitamin D Deficiency, Osteopenia & Secondary Hyperparathyroidism',
          icdOrCategory: 'E55.9 / Bone & Mineral Metabolic Disorder',
          deficientNutrient: 'Vitamin D3 (Cholecalciferol)',
          description: 'Inability to actively absorb dietary calcium in the duodenum triggers PTH secretion, which leaches calcium from skeletal matrix, accelerating bone density loss.',
          symptoms: ['Deep diffuse bone aching in pelvis, lumbar spine, and thighs', 'Proximal muscle weakness (difficulty standing from seated position)', 'Frequent respiratory infections due to impaired cathelicidin antimicrobial peptide synthesis', 'Increased fragility fractures'],
          highRiskGroups: ['Indoor workers with zero direct midday sunlight', 'Darkly pigmented skin residing in northern latitudes', 'Elderly with diminished epidermal 7-dehydrocholesterol synthesis']
        },
        {
          diseaseName: 'Subclinical Iron-Deficiency Anemia & Tissue Hypoxia',
          icdOrCategory: 'D50.9 / Hematologic Anemia',
          deficientNutrient: 'Iron (Fe) & Folate (B9)',
          description: 'Depleted iron stores decrease hemoglobin synthesis, leading to microcytic hypochromic red blood cells and reduced peripheral tissue oxygen delivery.',
          symptoms: ['Exertional dyspnea, extreme lethargy, and chronic fatigue', 'Conjunctival and palmar crease pallor', 'Restless legs syndrome and cold intolerance', 'Impaired work capacity and cognitive concentration'],
          highRiskGroups: ['Premenopausal females with heavy menses', 'Frequent blood donors', 'Elderly with reduced gastric acid production']
        },
        {
          diseaseName: 'Pernicious / B12-Deficiency Macrocytic Neuropathy',
          icdOrCategory: 'E53.8 / Neurological & Hematologic',
          deficientNutrient: 'Vitamin B12 (Cobalamin)',
          description: 'Failure of methionine synthase and methylmalonyl-CoA mutase causes demyelination of spinal dorsal columns and megaloblastic marrow arrest.',
          symptoms: ['Symmetrical stocking-glove numbness and tingling in feet', 'Loss of vibration sense and proprioception (unsteady walking)', 'Atrophic beefy red glossitis', 'Elevated plasma homocysteine (cardiovascular risk)'],
          highRiskGroups: ['Strict long-term vegans without B12 supplements', 'Patients on long-term Metformin or Proton Pump Inhibitors (PPIs)', 'Patients with atrophic gastritis or ileal resections']
        }
      ],
      earlyWarningSigns: [
        'Persistent daytime fatigue despite 8 hours of sleep',
        'Dry, flaky skin and cracking corners of lips (cheilitis)',
        'Brain fog, memory lapses, and depressive moods',
        'Muscle cramps, eyelid twitches, and postural dizziness'
      ]
    },

    // WHAT IF WE EAT MORE (Toxicity / Excess Risks)
    whatIfEatMore: {
      title: 'Toxicity, Overconsumption & Chronic Excess Health Warnings',
      excessSummary: 'While whole-food Mediterranean ingredients are remarkably safe, excessive consumption of high-dose isolated dietary supplements (such as mega-dose Vitamin D or Iron) or severe portion excess in specific clinical populations warrants strict clinical boundary awareness.',
      associatedRisks: [
        {
          conditionName: 'Hyperkalemia in Chronic Kidney Disease (CKD Stage 4-5)',
          excessFactor: 'Potassium Intake > 3,000-4,000 mg/day with impaired renal excretion',
          upperTolerableLimit: 'No UL for healthy individuals; CKD restricted to 2,000 mg/day',
          description: 'In advanced renal failure, impaired tubular potassium secretion can cause serum potassium to surge (>5.5 mEq/L), triggering fatal cardiac conduction delays.',
          risksAndSymptoms: ['Peaked T-waves, PR prolongation, and wide QRS complexes on ECG', 'Muscle weakness, flaccid paralysis, and ventricular fibrillation cardiac arrest'],
          precautions: ['Patients with advanced CKD must monitor portion sizes of high-potassium foods (salmon, quinoa, spinach, tomatoes) and avoid potassium-based salt substitutes.']
        },
        {
          conditionName: 'Hypervitaminosis D & Metastatic Vascular Calcification',
          excessFactor: 'Mega-dose Vitamin D Supplements (>10,000 - 50,000 IU/day for months)',
          upperTolerableLimit: '4,000 IU/day for adults',
          description: 'Massive circulating 25(OH)D drives uncontrolled intestinal calcium absorption and bone osteoclast resorption, resulting in severe hypercalcemia.',
          risksAndSymptoms: ['Polyuria, polydipsia, severe dehydration, and vomiting', 'Nephrocalcinosis and kidney stones', 'Extensive arterial and heart valve calcification'],
          precautions: ['Dietary whole salmon (680 IU) is completely safe; avoid unsupervised high-dose synthetic vitamin D megadoses.']
        },
        {
          conditionName: 'Hemochromatosis & Parenchymal Iron Overload',
          excessFactor: 'Excessive iron intake in genetic HFE homozygotes (C282Y / H63D)',
          upperTolerableLimit: '45 mg/day elemental iron',
          description: 'Continuous unregulated ferroportin iron absorption generates toxic free hydroxyl radicals via the Fenton reaction, damaging liver, pancreas, and myocardium.',
          risksAndSymptoms: ['Micronodular liver cirrhosis and hepatocellular carcinoma', 'Pancreatic bronze diabetes and dilated cardiomyopathy', 'Severe arthralgia in finger joints'],
          precautions: ['Individuals with confirmed hereditary hemochromatosis should limit heme-iron rich foods and avoid cast-iron cookware and iron-containing multivitamins.']
        }
      ],
      safeIntakeGuidance: 'Enjoy 1 to 2 balanced servings of this meal. Keep supplemental Vitamin D below 4,000 IU/day and supplemental iron under 45 mg/day unless clinically prescribed.'
    },

    // Chronic Diseases Prevented
    diseasesPrevented: [
      {
        condition: 'Coronary Artery Disease & Myocardial Infarction',
        evidenceLevel: 'Strong Clinical Evidence',
        mechanism: 'EPA and DHA omega-3s reduce serum triglycerides by 20-30%, suppress platelet thromboxane A2, stabilize vulnerable plaque, and reduce sudden cardiac arrhythmia risk.'
      },
      {
        condition: 'Type 2 Diabetes Mellitus & Metabolic Syndrome',
        evidenceLevel: 'Meta-Analysis Backed',
        mechanism: 'Low glycemic index quinoa (GI 32) and soluble fiber slow gastric emptying, while olive oil MUFAs enhance skeletal muscle GLUT4 insulin receptor sensitivity.'
      },
      {
        condition: 'Age-Related Macular Degeneration (AMD)',
        evidenceLevel: 'Meta-Analysis Backed',
        mechanism: 'Dietary lutein, zeaxanthin, and astaxanthin accumulate in the macular pigment, filtering phototoxic blue wavelengths and quenching retinal singlet oxygen.'
      },
      {
        condition: 'Systemic Low-Grade Inflammation & Rheumatoid Arthritis',
        evidenceLevel: 'Strong Clinical Evidence',
        mechanism: 'Oleocanthal and omega-3 resolvin precursors downregulate NF-kB transcription and circulating IL-6 and hs-CRP inflammatory biomarkers.'
      }
    ]
  },
  {
    id: 'rec-turmeric-lentil-stew',
    title: 'Anti-Inflammatory Golden Turmeric & Red Lentil Healing Dhal',
    description: 'A comforting, gut-restorative stew made with split red lentils, fragrant coconut milk, fresh grated turmeric and ginger root, baby spinach, and tempered mustard seeds.',
    prepTime: '10 mins',
    cookTime: '25 mins',
    calories: 360,
    protein: '18g',
    carbs: '48g',
    fats: '11g',
    netCarbs: '38g',
    fiber: '10g',
    sodiumMg: 340,
    potassiumMg: 780,
    calciumMg: 95,
    ironMg: 4.6,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Ayurvedic / South Asian',
    dietTags: ['Vegan', 'Heart-Healthy', 'Anti-Inflammatory', 'Gluten-Free', 'Diabetic-Friendly', 'High-Protein'],
    ingredients: [
      '1.5 cups organic split red lentils (masoor dhal), rinsed',
      '1 can (13.5 oz / 400ml) light unsweetened coconut milk',
      '3.5 cups low-sodium vegetable broth or filtered water',
      '1 large yellow onion, finely diced',
      '4 cloves garlic, finely grated',
      '1.5 tbsp fresh ginger root, finely grated',
      '1 tbsp organic ground turmeric powder (or 2 tbsp fresh grated turmeric root)',
      '1 tsp ground cumin and 1 tsp ground coriander',
      '1/2 tsp freshly cracked black pepper (essential for curcumin activation)',
      '3 cups fresh baby spinach leaves',
      '1 tbsp coconut oil or extra virgin olive oil',
      '1 fresh lime, cut into wedges',
      '1/4 cup fresh cilantro (coriander leaves), chopped'
    ],
    instructions: [
      '1. Sauté Aromatics: Heat coconut oil in a heavy-bottomed Dutch oven or pot over medium heat. Add diced onions and cook for 5-6 minutes until translucent and lightly golden. Add grated garlic, fresh ginger, turmeric powder, ground cumin, coriander, and black pepper. Sauté for 60 seconds until intensely aromatic.',
      '2. Simmer the Lentils: Add rinsed red lentils, vegetable broth, and coconut milk to the pot. Stir well to combine. Bring the mixture to a gentle boil, then lower the heat to medium-low. Cover partially with a lid and simmer for 20 minutes, stirring occasionally, until lentils are completely tender and creamy.',
      '3. Fold in Greens: Stir in the fresh baby spinach and cook for 2 minutes until just wilted into the golden broth. Season with a pinch of sea salt.',
      '4. Final Touch: Remove from heat and stir in fresh lime juice. Ladle into deep bowls, garnish with freshly chopped cilantro and an extra crack of black pepper. Serve with brown basmati rice or warm gluten-free naan.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    healthBenefits: [
      'High Curcumin and Gingerol content synergistically downregulates inflammatory cytokines (TNF-alpha, IL-6).',
      'Provides 10g of prebiotic soluble fiber per serving, feeding beneficial Bifidobacteria and generating gut-healing butyrate.',
      'High iron and folate support healthy erythropoiesis and tissue oxygen delivery.'
    ],
    chefTips: [
      'Do not skip the black pepper: the piperine alkaloid enhances curcumin absorption by up to 20x.',
      'Red lentils break down into a naturally rich, creamy consistency without needing dairy cream.'
    ],
    allergenWarnings: ['None (Free from Top 9 Allergens)'],
    equipmentNeeded: ['Large Heavy Dutch Oven', 'Microplane / Grater', 'Wooden Spoon'],
    microsHighlight: [
      { label: 'Folate (B9)', amount: '280 µg', dv: '70%' },
      { label: 'Iron', amount: '4.6 mg', dv: '26%' },
      { label: 'Manganese', amount: '1.2 mg', dv: '52%' }
    ],

    // Food Ingredients Breakdown
    foodIngredientsBreakdown: [
      {
        foodName: 'Split Red Lentils (Masoor Dhal)',
        quantity: '75g dry per serving',
        calories: 240,
        proteinG: 16.5,
        carbsG: 41.2,
        fatG: 1.1,
        fiberG: 8.5,
        highlightNutrients: ['Folate (B9) 260µg', 'Iron 4.2mg', 'Molybdenum', 'Zinc 2.1mg']
      },
      {
        foodName: 'Light Coconut Milk (Unsweetened)',
        quantity: '100ml',
        calories: 75,
        proteinG: 0.8,
        carbsG: 2.1,
        fatG: 7.2,
        fiberG: 0,
        highlightNutrients: ['Medium-Chain Triglycerides (Lauric Acid)', 'Manganese 0.4mg']
      },
      {
        foodName: 'Fresh Baby Spinach',
        quantity: '1 cup (30g)',
        foodId: 'food-spinach',
        calories: 7,
        proteinG: 0.9,
        carbsG: 1.1,
        fatG: 0.1,
        fiberG: 0.7,
        highlightNutrients: ['Vitamin K1 145µg', 'Folate 58µg', 'Lutein & Zeaxanthin']
      },
      {
        foodName: 'Fresh Turmeric Root & Ground Turmeric',
        quantity: '1 tsp (3g)',
        calories: 10,
        proteinG: 0.3,
        carbsG: 2.0,
        fatG: 0.3,
        fiberG: 0.7,
        highlightNutrients: ['Curcuminoids (Curcumin, Demethoxycurcumin)', 'Turmerones']
      },
      {
        foodName: 'Fresh Ginger Root & Garlic',
        quantity: '1.5 tbsp combined',
        calories: 18,
        proteinG: 0.6,
        carbsG: 3.8,
        fatG: 0.1,
        fiberG: 0.4,
        highlightNutrients: ['6-Gingerol', 'Allicin Precursors', 'Quercetin']
      }
    ],

    // Macronutrients Analysis
    macroBreakdown: {
      protein: {
        grams: 18,
        percentKcal: 20,
        quality: 'High plant-based protein with complementary amino acids when paired with whole grains',
        leucineG: 1.4,
        keyAminoAcids: ['Lysine (1.3g)', 'Leucine (1.4g)', 'Arginine (1.2g)', 'Phenylalanine (0.9g)']
      },
      carbs: {
        totalG: 48,
        netCarbsG: 38,
        fiberG: 10,
        solubleFiberG: 4.2,
        insolubleFiberG: 5.8,
        sugarsG: 3.5,
        glycemicIndex: 28,
        glycemicLoad: 10
      },
      fats: {
        totalG: 11,
        mufaG: 3.2,
        pufaG: 1.8,
        omega3Mg: 180,
        saturatedG: 5.5,
        transG: 0,
        omega6To3Ratio: '3 : 1'
      },
      calorieDistribution: {
        proteinPercent: 20,
        carbsPercent: 53,
        fatPercent: 27
      }
    },

    // Vitamin Directory
    vitaminDirectory: [
      {
        code: 'Vit-B9',
        name: 'Folate (Tetrahydrofolate)',
        amount: '280 µg',
        dvPercent: 70,
        solubility: 'Water-Soluble',
        role: 'Essential for DNA methylation, nucleotide synthesis, and prevention of neural tube defects.',
        foodSourceInRecipe: 'Split Red Lentils & Baby Spinach'
      },
      {
        code: 'Vit-K1',
        name: 'Vitamin K1 (Phylloquinone)',
        amount: '160 µg',
        dvPercent: 133,
        solubility: 'Fat-Soluble',
        role: 'Coagulation cascade factor activation and osteocalcin carboxylation in bone matrix.',
        foodSourceInRecipe: 'Baby Spinach'
      },
      {
        code: 'Vit-B1',
        name: 'Thiamine (Vitamin B1)',
        amount: '0.35 mg',
        dvPercent: 29,
        solubility: 'Water-Soluble',
        role: 'Pyruvate dehydrogenase cofactor in neuronal energy production and ATP synthesis.',
        foodSourceInRecipe: 'Split Red Lentils'
      },
      {
        code: 'Vit-B6',
        name: 'Vitamin B6 (Pyridoxine)',
        amount: '0.45 mg',
        dvPercent: 26,
        solubility: 'Water-Soluble',
        role: 'Hemoglobin synthesis and transamination of neurotransmitter amino acids.',
        foodSourceInRecipe: 'Lentils & Garlic'
      },
      {
        code: 'Vit-C',
        name: 'Vitamin C (Ascorbic Acid)',
        amount: '22 mg',
        dvPercent: 24,
        solubility: 'Water-Soluble',
        role: 'Potent antioxidant reducing non-heme iron for maximal duodenal absorption.',
        foodSourceInRecipe: 'Fresh Lime Juice & Spinach'
      }
    ],

    // Essential Minerals Profile
    essentialMinerals: [
      {
        symbol: 'Fe',
        name: 'Iron (Non-Heme Fe3+)',
        amount: '4.6 mg',
        dvPercent: 26,
        category: 'Trace Mineral',
        role: 'Erythrocyte oxygen transport and cellular respiratory chain enzyme function.',
        foodSourceInRecipe: 'Split Red Lentils & Spinach',
        absorptionTip: 'Fresh lime juice (Vitamin C) increases iron absorption by 300%.'
      },
      {
        symbol: 'Mn',
        name: 'Manganese',
        amount: '1.2 mg',
        dvPercent: 52,
        category: 'Trace Mineral',
        role: 'Mitochondrial Superoxide Dismutase (MnSOD) master antioxidant enzyme.',
        foodSourceInRecipe: 'Lentils & Coconut Milk'
      },
      {
        symbol: 'K',
        name: 'Potassium',
        amount: '780 mg',
        dvPercent: 22,
        category: 'Macromineral',
        role: 'Endothelial vasodilation, blood pressure stabilization, and intracellular fluid balance.',
        foodSourceInRecipe: 'Lentils & Spinach'
      },
      {
        symbol: 'Mg',
        name: 'Magnesium',
        amount: '98 mg',
        dvPercent: 25,
        category: 'Macromineral',
        role: 'Glucose transporter regulation, muscle relaxation, and cardiac rhythm maintenance.',
        foodSourceInRecipe: 'Lentils & Spinach'
      },
      {
        symbol: 'Zn',
        name: 'Zinc',
        amount: '2.2 mg',
        dvPercent: 20,
        category: 'Trace Mineral',
        role: 'T-lymphocyte proliferation, epithelial gut barrier integrity, and wound repair.',
        foodSourceInRecipe: 'Split Red Lentils'
      }
    ],

    // Phytonutrients
    phytonutrients: [
      {
        name: 'Curcumin (Diferuloylmethane)',
        chemicalClass: 'Polyphenol (Curcuminoid)',
        presence: '120 mg',
        sources: ['Organic Turmeric Root'],
        mechanism: 'Binds to and inhibits I-kappa-B kinase (IKK), blocking NF-kB transcription of TNF-alpha, IL-1beta, and COX-2.',
        healthBenefit: 'Potent systemic anti-inflammatory, joint pain relief, and intestinal epithelial barrier repair.'
      },
      {
        name: 'Piperine',
        chemicalClass: 'Alkaloid',
        presence: '5 mg',
        sources: ['Freshly Ground Black Peppercorns'],
        mechanism: 'Inhibits intestinal and hepatic UDP-glucuronyl transferase, preventing premature curcumin excretion.',
        healthBenefit: 'Increases serum bioavailability of Curcumin by 2,000% (20-fold).'
      },
      {
        name: '6-Gingerol & Shogaols',
        chemicalClass: 'Phenolic Gingeroids',
        presence: '25 mg',
        sources: ['Fresh Ginger Root'],
        mechanism: 'Inhibits prostaglandin and leukotriene biosynthesis; stimulates gastric motility and digestive bile output.',
        healthBenefit: 'Alleviates dyspepsia, enhances digestion, and mitigates exercise-induced muscle soreness.'
      }
    ],

    // Synergies
    absorptionSynergies: [
      {
        title: 'Piperine + Curcumin Supercharged Bioavailability',
        mechanism: 'Curcumin normally undergoes rapid glucuronidation in liver. Piperine halts glucuronidation enzymes.',
        impact: 'Boosts curcumin bioavailability by 2,000% (20x), ensuring systemic anti-inflammatory absorption.'
      },
      {
        title: 'Medium Chain Lipids + Curcumin Solubility',
        mechanism: 'Curcumin is lipophilic; coconut milk medium-chain fats form micro-micelles that carry curcumin across the intestinal mucosal brush border.',
        impact: 'Increases intestinal uptake by an additional 3-5x.'
      }
    ],

    // WHAT IF WE EAT LESS (Deficiency Diseases)
    whatIfEatLess: {
      title: 'Nutritional Deficiency Risks & Diseases If You Lack These Nutrients',
      riskSummary: 'Diets lacking legumes, dietary fiber, and plant polyphenols lead to gut microbiome dysbiosis, chronic low-grade systemic inflammation, and micronutrient blood deficiencies.',
      associatedDiseases: [
        {
          diseaseName: 'Dietary Fiber Deficiency & Dysbiosis Colopathy',
          icdOrCategory: 'K59.0 / Gastrointestinal Disorder',
          deficientNutrient: 'Prebiotic Soluble & Insoluble Dietary Fiber',
          description: 'Without fermentable lentil prebiotic fiber, colonic commensal bacteria cannot synthesize Short-Chain Fatty Acids (Butyrate, Acetate, Propionate).',
          symptoms: ['Chronic constipation and hard stools', 'Loss of intestinal barrier tight junctions ("leaky gut")', 'Elevated colonic mucosal inflammation and diverticulosis risk', 'Dysregulated blood glucose spikes and elevated LDL cholesterol'],
          highRiskGroups: ['Standard American / Western diet consumers with <10g fiber/day', 'Extreme low-carbohydrate carnivore diets without fiber']
        },
        {
          diseaseName: 'Folate Deficiency & Megaloblastic Macrocytic Anemia',
          icdOrCategory: 'D52.9 / Hematologic Anemia',
          deficientNutrient: 'Folate (Vitamin B9)',
          description: 'Inability to synthesize thymidylate for erythrocyte DNA synthesis arrests red blood cell division in bone marrow, causing large abnormal megaloblasts.',
          symptoms: ['Profound lethargy, exertion dyspnea, and lightheadedness', 'Smooth beefy sore red tongue (glossitis)', 'Elevated homocysteine (cardiovascular vascular damage)', 'Neural tube defects (Spina Bifida) in unborn fetuses of deficient mothers'],
          highRiskGroups: ['Pregnant women with increased fetal folate demands', 'Alcoholics with poor nutritional intake and impaired enterohepatic folate circulation', 'Individuals consuming zero fresh green vegetables or legumes']
        },
        {
          diseaseName: 'Microcytic Hypochromic Iron Deficiency Anemia',
          icdOrCategory: 'D50.9 / Hematologic Disorder',
          deficientNutrient: 'Elemental Iron (Fe)',
          description: 'Chronic deficiency depletes bone marrow iron stores, resulting in small, pale red blood cells unable to carry oxygen.',
          symptoms: ['Chronic exhaustion, weakness, and tachycardia', 'Koilonychia (spoon-shaped fingernails) and angular stomatitis', 'Impaired cognitive performance and memory consolidation'],
          highRiskGroups: ['Strict vegetarians/vegans who fail to co-consume Vitamin C with non-heme iron meals', 'Growing adolescents and menstruating women']
        }
      ],
      earlyWarningSigns: [
        'Sluggish digestion, bloating, and irregular bowel movements',
        'Persistent physical fatigue and poor exercise recovery',
        'Frequent colds, sore throat, and prolonged recovery from minor infections'
      ]
    },

    // WHAT IF WE EAT MORE (Toxicity / Excess Risks)
    whatIfEatMore: {
      title: 'Toxicity, Overconsumption & Chronic Excess Health Warnings',
      excessSummary: 'Natural red lentils and golden turmeric are extraordinarily safe food staples. However, excessive isolated turmeric extract supplements (>2,000mg curcumin) or abrupt massive fiber increases can cause transient gastrointestinal effects.',
      associatedRisks: [
        {
          conditionName: 'Gastrointestinal Cramping & Osmotic Flatulence',
          excessFactor: 'Abruptly increasing legume intake from zero to >60g fiber/day without adequate water',
          upperTolerableLimit: 'No strict UL for food fiber; 50-70g/day may cause distress if not adapted',
          description: 'Rapid colonic bacterial fermentation of oligosaccharides (raffinose, stachyose) generates excess hydrogen and methane gas.',
          risksAndSymptoms: ['Abdominal distension, cramping, flatulence, and loose stools'],
          precautions: ['Soak dry lentils and rinse thoroughly before cooking; increase dietary fiber gradually over 2-3 weeks while drinking 2-3 liters of water daily.']
        },
        {
          conditionName: 'Supplemental Curcumin Gallbladder Contraction & Blood Thinning Interaction',
          excessFactor: 'Mega-dose Curcumin Supplements (>2,000 - 4,000 mg/day concentrated extract)',
          upperTolerableLimit: '3 mg/kg body weight/day (EFSA recommendation for pure extracts)',
          description: 'High doses of pure curcumin stimulate cholecystokinin release causing strong gallbladder contractions, and mildly inhibit platelet aggregation.',
          risksAndSymptoms: ['Biliary colic in patients with existing active gallstones / cholelithiasis', 'Mildly increased bleeding tendency if taken with Warfarin, Clopidogrel, or high-dose Aspirin'],
          precautions: ['Culinary turmeric in food is completely safe; patients with obstructive gallstones or scheduled for major surgery should pause concentrated curcumin supplements 2 weeks prior.']
        }
      ],
      safeIntakeGuidance: 'Enjoy 1 to 2 hearty bowls (360-720 kcal) daily. Ideal for daily gut restoration and natural anti-inflammatory joint support.'
    },

    // Chronic Diseases Prevented
    diseasesPrevented: [
      {
        condition: 'Colorectal Cancer & Diverticular Disease',
        evidenceLevel: 'Strong Clinical Evidence',
        mechanism: 'Lentil prebiotic fiber accelerates intestinal transit time, reduces secondary bile acid contact, and ferments into protective butyrate.'
      },
      {
        condition: 'Osteoarthritis & Chronic Joint Pain',
        evidenceLevel: 'Meta-Analysis Backed',
        mechanism: 'Curcumin and gingerols downregulate intra-articular MMP-13 collagenase and prostaglandin E2, preserving synovial cartilage.'
      },
      {
        condition: 'Non-Alcoholic Fatty Liver Disease (NAFLD)',
        evidenceLevel: 'Strong Clinical Evidence',
        mechanism: 'Curcumin upregulates hepatic Nrf2 antioxidant pathways and activates AMPK, decreasing hepatic lipid accumulation.'
      }
    ]
  },
  {
    id: 'rec-avocado-spinach-smoothie',
    title: 'Avocado, Kale & Wild Blueberry Cellular Detox Smoothie',
    description: 'An alkaline, antioxidant-rich whole-food smoothie blending wild blueberries, ripe avocado, baby kale, organic chia seeds, and unsweetened almond milk.',
    prepTime: '5 mins',
    cookTime: '0 mins',
    calories: 285,
    protein: '9g',
    carbs: '29g',
    fats: '16g',
    netCarbs: '19g',
    fiber: '10g',
    sodiumMg: 140,
    potassiumMg: 620,
    calciumMg: 310,
    ironMg: 2.4,
    servings: 1,
    difficulty: 'Easy',
    cuisine: 'Modern Wellness',
    dietTags: ['Vegan', 'Heart-Healthy', 'Diabetic-Friendly', 'Gluten-Free', 'Anti-Inflammatory', 'Low-Sodium'],
    ingredients: [
      '1 cup frozen wild organic blueberries',
      '1/2 ripe Hass avocado',
      '1.5 cups fresh baby kale or spinach leaves, packed',
      '1 tbsp organic chia seeds',
      '1/2 inch fresh ginger root, peeled',
      '1.5 cups unsweetened almond milk or coconut water',
      '1 scoop unflavored plant-based protein powder (optional, for extra 20g protein)',
      '3 fresh mint leaves (optional, for refreshing herbal aroma)'
    ],
    instructions: [
      '1. Load Liquid First: Pour unsweetened almond milk into the high-speed blender container first to ensure smooth blending without blade pockets.',
      '2. Add Greens & Solids: Add fresh baby kale, peeled ginger root, chia seeds, and scoop of ripe avocado.',
      '3. Top with Frozen Fruit: Add the frozen wild blueberries on top.',
      '4. Blend: Secure the blender lid and blend on medium speed for 20 seconds, then increase to high for 45-60 seconds until velvety smooth and deep purple-green.',
      '5. Serve: Pour into a chilled tall glass and enjoy immediately for optimal antioxidant enzyme activity.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=800&q=80',
    healthBenefits: [
      'High Anthocyanin and Lutein antioxidant profile protects vascular endothelium and retinal tissue.',
      'Healthy monounsaturated fats from avocado maximize the absorption of fat-soluble vitamins and carotenoids in the kale.',
      '10g fiber with zero added refined sugars keeps glycemic impact exceptionally low.'
    ],
    chefTips: [
      'Use frozen blueberries rather than fresh to create a naturally thick, ice-cold frappe texture without needing ice cubes that dilute the flavor.'
    ],
    allergenWarnings: ['Tree Nuts (Almond Milk - can substitute with oat milk or coconut water)'],
    equipmentNeeded: ['High-Speed Blender (Vitamix or Ninja)'],
    microsHighlight: [
      { label: 'Vitamin K', amount: '240 µg', dv: '200%' },
      { label: 'Vitamin C', amount: '48 mg', dv: '53%' },
      { label: 'Magnesium', amount: '85 mg', dv: '21%' }
    ],

    // Food Ingredients Breakdown
    foodIngredientsBreakdown: [
      {
        foodName: 'Wild Organic Blueberries (Frozen)',
        quantity: '1 cup (140g)',
        foodId: 'food-blueberries',
        calories: 80,
        proteinG: 1.0,
        carbsG: 19.5,
        fatG: 0.5,
        fiberG: 3.6,
        highlightNutrients: ['Anthocyanins 450mg', 'Vitamin C 14mg', 'Manganese 0.5mg']
      },
      {
        foodName: 'Ripe Hass Avocado',
        quantity: '1/2 medium (100g)',
        calories: 160,
        proteinG: 2.0,
        carbsG: 8.5,
        fatG: 14.7,
        fiberG: 6.7,
        highlightNutrients: ['Oleic Acid (MUFA) 10g', 'Potassium 485mg', 'Folate 81µg', 'Vitamin E 2.1mg']
      },
      {
        foodName: 'Fresh Baby Kale & Spinach',
        quantity: '1.5 cups (45g)',
        foodId: 'food-spinach',
        calories: 15,
        proteinG: 1.5,
        carbsG: 2.2,
        fatG: 0.2,
        fiberG: 1.2,
        highlightNutrients: ['Vitamin K1 240µg', 'Lutein + Zeaxanthin 8mg', 'Vitamin A (Beta-Carotene)']
      },
      {
        foodName: 'Organic Whole Chia Seeds',
        quantity: '1 tbsp (12g)',
        calories: 58,
        proteinG: 2.0,
        carbsG: 5.0,
        fatG: 3.7,
        fiberG: 4.1,
        highlightNutrients: ['ALA Omega-3 2,100mg', 'Calcium 75mg', 'Soluble Mucilage Fiber']
      }
    ],

    // Macronutrients Analysis
    macroBreakdown: {
      protein: {
        grams: 9,
        percentKcal: 13,
        quality: 'Plant-based amino acids with complete lipid carriers; upgrade to 29g protein with 1 scoop protein powder',
        leucineG: 0.7,
        keyAminoAcids: ['Arginine (0.6g)', 'Leucine (0.7g)', 'Glutamic Acid (1.1g)']
      },
      carbs: {
        totalG: 29,
        netCarbsG: 19,
        fiberG: 10,
        solubleFiberG: 4.5,
        insolubleFiberG: 5.5,
        sugarsG: 11.2,
        glycemicIndex: 25,
        glycemicLoad: 5
      },
      fats: {
        totalG: 16,
        mufaG: 10.2,
        pufaG: 4.1,
        omega3Mg: 2100,
        saturatedG: 1.7,
        transG: 0,
        omega6To3Ratio: '1 : 2.8'
      },
      calorieDistribution: {
        proteinPercent: 13,
        carbsPercent: 41,
        fatPercent: 46
      }
    },

    // Vitamin Directory
    vitaminDirectory: [
      {
        code: 'Vit-K1',
        name: 'Vitamin K1 (Phylloquinone)',
        amount: '240 µg',
        dvPercent: 200,
        solubility: 'Fat-Soluble',
        role: 'Activates hepatic blood clotting factors and prevents arterial medial calcification.',
        foodSourceInRecipe: 'Fresh Baby Kale & Spinach'
      },
      {
        code: 'Vit-C',
        name: 'Vitamin C (Ascorbic Acid)',
        amount: '48 mg',
        dvPercent: 53,
        solubility: 'Water-Soluble',
        role: 'Master water-soluble antioxidant protecting vascular endothelial lining from ROS.',
        foodSourceInRecipe: 'Wild Blueberries, Kale & Lemon'
      },
      {
        code: 'Vit-E',
        name: 'Vitamin E (Alpha-Tocopherol)',
        amount: '2.8 mg',
        dvPercent: 19,
        solubility: 'Fat-Soluble',
        role: 'Membrane-bound antioxidant halting lipid peroxidation in neural and myocardial tissues.',
        foodSourceInRecipe: 'Hass Avocado & Chia Seeds'
      },
      {
        code: 'Vit-B9',
        name: 'Folate (Tetrahydrofolate)',
        amount: '115 µg',
        dvPercent: 29,
        solubility: 'Water-Soluble',
        role: 'DNA methylation and conversion of homocysteine into non-toxic methionine.',
        foodSourceInRecipe: 'Avocado & Baby Greens'
      },
      {
        code: 'Vit-A',
        name: 'Pro-Vitamin A (Beta-Carotene)',
        amount: '320 µg RAE',
        dvPercent: 36,
        solubility: 'Fat-Soluble',
        role: 'Maintains rhodopsin retinal function, epithelial differentiation, and immune vigilance.',
        foodSourceInRecipe: 'Baby Kale & Spinach'
      }
    ],

    // Essential Minerals Profile
    essentialMinerals: [
      {
        symbol: 'K',
        name: 'Potassium',
        amount: '620 mg',
        dvPercent: 18,
        category: 'Macromineral',
        role: 'Promotes renal sodium excretion and reduces systemic vascular resistance.',
        foodSourceInRecipe: 'Hass Avocado & Baby Kale'
      },
      {
        symbol: 'Ca',
        name: 'Calcium',
        amount: '310 mg',
        dvPercent: 31,
        category: 'Macromineral',
        role: 'Bone structure, intracellular signal transduction, and vascular contraction balance.',
        foodSourceInRecipe: 'Fortified Almond Milk, Chia Seeds & Kale'
      },
      {
        symbol: 'Mg',
        name: 'Magnesium',
        amount: '85 mg',
        dvPercent: 21,
        category: 'Macromineral',
        role: 'Cofactor for ATP generation, glucose transport, and myocardial membrane stabilization.',
        foodSourceInRecipe: 'Avocado, Chia Seeds & Greens'
      },
      {
        symbol: 'Mn',
        name: 'Manganese',
        amount: '0.8 mg',
        dvPercent: 35,
        category: 'Trace Mineral',
        role: 'Superoxide Dismutase (SOD) antioxidant defense against cellular mitochondrial damage.',
        foodSourceInRecipe: 'Wild Blueberries & Chia Seeds'
      },
      {
        symbol: 'Fe',
        name: 'Iron (Non-Heme)',
        amount: '2.4 mg',
        dvPercent: 13,
        category: 'Trace Mineral',
        role: 'Cellular respiration and myoglobin oxygen storage in skeletal muscle fibers.',
        foodSourceInRecipe: 'Kale, Spinach & Chia Seeds'
      }
    ],

    // Phytonutrients
    phytonutrients: [
      {
        name: 'Anthocyanins (Malvidin, Delphinidin, Cyanidin)',
        chemicalClass: 'Flavonoid Polyphenols',
        presence: '450 mg',
        sources: ['Wild Alaskan Blueberries'],
        mechanism: 'Crosses the blood-brain barrier, upregulates BDNF (Brain-Derived Neurotrophic Factor), and stimulates eNOS endothelial nitric oxide.',
        healthBenefit: 'Enhances cognitive memory, protects cerebral microvessels, and lowers diastolic blood pressure.'
      },
      {
        name: 'Lutein & Zeaxanthin',
        chemicalClass: 'Xanthophyll Carotenoids',
        presence: '8.2 mg',
        sources: ['Baby Kale & Spinach'],
        mechanism: 'Accumulates in the retinal fovea centralis; absorbs high-energy short-wavelength visible light.',
        healthBenefit: 'Prevents cortical cataracts and decreases progression of Age-Related Macular Degeneration (AMD).'
      },
      {
        name: 'Alpha-Linolenic Acid (ALA)',
        chemicalClass: 'Essential Polyunsaturated Fatty Acid',
        presence: '2,100 mg',
        sources: ['Organic Chia Seeds'],
        mechanism: 'Precursor to anti-inflammatory series-3 prostaglandins; decreases circulating vascular cell adhesion molecules.',
        healthBenefit: 'Reduces systemic cardiovascular event risk and lowers resting plasma triglycerides.'
      }
    ],

    // Synergies
    absorptionSynergies: [
      {
        title: 'Avocado Monounsaturated Lipids + Carotenoid Absorption',
        mechanism: 'Lutein, beta-carotene, and Vitamin K1 in kale require dietary fat to dissolve into mixed micelles.',
        impact: 'Avocado fatty acids enhance lutein and carotenoid absorption by over 500% compared to fat-free juice.'
      }
    ],

    // WHAT IF WE EAT LESS (Deficiency Diseases)
    whatIfEatLess: {
      title: 'Nutritional Deficiency Risks & Diseases If You Lack These Nutrients',
      riskSummary: 'A diet devoid of dark berries, leafy brassicas, and plant-based essential fats increases neurodegenerative vulnerability, compromises retinal defenses, and leads to vascular stiffness.',
      associatedDiseases: [
        {
          diseaseName: 'Accelerated Cognitive Decline & Neurovascular Fragility',
          icdOrCategory: 'F03.9 / Cognitive & Neurologic Health',
          deficientNutrient: 'Anthocyanins, Polyphenols & Plant Omega-3s (ALA)',
          description: 'Deprivation of polyphenolic flavonoids reduces cerebral blood flow and decreases hippocampal synaptic plasticity.',
          symptoms: ['Brain fog, short-term memory lapses, and reduced mental processing speed', 'Elevated cerebral microvascular oxidative damage and elevated neuro-inflammation'],
          highRiskGroups: ['Elderly individuals consuming zero colorful berries or antioxidant-rich whole fruits', 'Sedentary individuals on ultra-processed diets']
        },
        {
          diseaseName: 'Retinal Macular Degeneration & Phototoxicity',
          icdOrCategory: 'H35.30 / Ophthalmic Disease',
          deficientNutrient: 'Lutein & Zeaxanthin (Carotenoids)',
          description: 'Depleted macular optical pigment density (MPOD) leaves retinal photoreceptors defenseless against blue light and oxidative singlet oxygen damage.',
          symptoms: ['Blurred central vision, difficulty reading in low light', 'Distorted straight lines (metamorphopsia)', 'Accelerated progression of dry macular degeneration'],
          highRiskGroups: ['Individuals with low green leafy vegetable intake and high screen/UV light exposure']
        },
        {
          diseaseName: 'Vitamin K Deficiency & Bone Demineralization',
          icdOrCategory: 'E56.1 / Bone & Vascular Metabolism',
          deficientNutrient: 'Vitamin K1 (Phylloquinone)',
          description: 'Under-carboxylated osteocalcin cannot anchor calcium to the bone matrix, while uncarboxylated Matrix Gla Protein fails to protect arteries from calcification.',
          symptoms: ['Easy bruising and prolonged bleeding times', 'Accelerated bone mineral loss and arterial stiffness'],
          highRiskGroups: ['Individuals consuming zero leafy green vegetables or with fat malabsorption syndromes']
        }
      ],
      earlyWarningSigns: [
        'Eye strain, glare sensitivity, and dry eyes',
        'Mid-afternoon energy crashes and poor cognitive focus',
        'Digestive sluggishness from low fiber'
      ]
    },

    // WHAT IF WE EAT MORE (Toxicity / Excess Risks)
    whatIfEatMore: {
      title: 'Toxicity, Overconsumption & Chronic Excess Health Warnings',
      excessSummary: 'This whole-food green smoothie is dense in vital micronutrients. However, individuals on specific medications (such as Warfarin) or with severe kidney disorders must observe clinical precautions.',
      associatedRisks: [
        {
          conditionName: 'Warfarin / Coumadin Anticoagulant Interaction',
          excessFactor: 'Sudden erratic swings in Vitamin K intake (>500 µg/day variability)',
          upperTolerableLimit: 'No UL for Vitamin K, but requires strict daily consistency on Warfarin',
          description: 'Vitamin K directly bypasses the pharmacological blockade of Vitamin K Epoxide Reductase (VKOR) by Warfarin, decreasing INR and raising clotting risk.',
          risksAndSymptoms: ['Subtherapeutic INR (<2.0), potentially increasing the risk of deep vein thrombosis (DVT) or ischemic stroke.'],
          precautions: ['Patients on Warfarin must keep their daily intake of kale, spinach, and green smoothies consistent from day to day; do not suddenly start or stop daily green smoothies without consulting your prescribing physician.']
        },
        {
          conditionName: 'Dietary Oxalate Accumulation in Hyperoxaluria Kidney Stone Formers',
          excessFactor: 'Consuming raw high-oxalate greens (raw spinach) in massive multiple daily quantities',
          upperTolerableLimit: 'Oxalate restriction (<50-100 mg/day) in recurrent calcium oxalate stone formers',
          description: 'Excessive unbonded dietary oxalates are absorbed and excreted in urine, precipitating with calcium to form calcium oxalate renal calculi.',
          risksAndSymptoms: ['Severe unilateral flank pain (renal colic), hematuria (blood in urine), and dysuria.'],
          precautions: ['Calcium oxalate stone formers should substitute high-oxalate spinach with low-oxalate baby kale or lightly steam/blanch greens before blending.']
        }
      ],
      safeIntakeGuidance: 'Enjoy 1 freshly blended glass (12-16 oz) in the morning or post-workout. Perfect for daily cellular revitalization and sharp cognitive focus.'
    },

    // Chronic Diseases Prevented
    diseasesPrevented: [
      {
        condition: 'Vascular Endothelial Dysfunction & Hypertension',
        evidenceLevel: 'Strong Clinical Evidence',
        mechanism: 'Anthocyanins and natural dietary nitrates in kale activate endothelial nitric oxide synthase (eNOS), dilating peripheral arterioles.'
      },
      {
        condition: 'Age-Related Cognitive Decline & Alzheimer’s Disease',
        evidenceLevel: 'Meta-Analysis Backed',
        mechanism: 'Blueberry polyphenols cross the blood-brain barrier, suppress microglial neuro-inflammation, and enhance synaptic plasticity.'
      },
      {
        condition: 'Age-Related Macular Degeneration (AMD) & Cataracts',
        evidenceLevel: 'Strong Clinical Evidence',
        mechanism: 'High macular concentration of lutein and zeaxanthin protects retinal photoreceptors from high-energy blue-light oxidative stress.'
      }
    ]
  },
  {
    id: 'rec-baked-chicken-mediterranean',
    title: 'Herb-Crusted Lemon Garlic Chicken Breast with Roasted Asparagus',
    description: 'Tender free-range chicken breast marinated in extra virgin olive oil, fresh rosemary, thyme, garlic, and lemon zest, roasted alongside tender asparagus spears.',
    prepTime: '15 mins',
    cookTime: '22 mins',
    calories: 420,
    protein: '46g',
    carbs: '8g',
    fats: '22g',
    netCarbs: '5g',
    fiber: '3g',
    sodiumMg: 310,
    potassiumMg: 820,
    calciumMg: 60,
    ironMg: 2.1,
    servings: 2,
    difficulty: 'Easy',
    cuisine: 'Mediterranean',
    dietTags: ['Keto', 'Heart-Healthy', 'Diabetic-Friendly', 'Gluten-Free', 'High-Protein', 'Low-Sodium'],
    ingredients: [
      '2 organic boneless, skinless chicken breasts (approx 7-8 oz / 220g each)',
      '1 lb (450g) fresh asparagus, woody ends snapped off',
      '2.5 tbsp extra virgin olive oil',
      '3 cloves garlic, finely minced',
      '1 tbsp fresh rosemary leaves, finely chopped',
      '1 tbsp fresh thyme leaves, stripped from stems',
      'Zest and juice of 1 organic lemon',
      '1/2 tsp sea salt and freshly cracked black pepper'
    ],
    instructions: [
      '1. Preheat & Prep: Preheat oven to 400°F (200°C). Line a large rimmed baking sheet with parchment paper.',
      '2. Marinate the Chicken: Place chicken breasts between sheets of parchment paper and gently pound thicker ends to an even 3/4-inch thickness. In a small bowl, whisk olive oil, lemon juice, lemon zest, minced garlic, chopped rosemary, thyme, salt, and black pepper. Rub 2/3 of this marinade all over the chicken breasts.',
      '3. Toss Asparagus: Place trimmed asparagus on the baking sheet and toss with the remaining 1/3 of the herb-lemon marinade. Spread in a single layer, leaving space in the center.',
      '4. Roast: Place marinated chicken breasts in the center of the baking sheet. Roast in the preheated oven for 20-22 minutes, until chicken reaches an internal temperature of 165°F (74°C) on a meat thermometer and asparagus is tender-crisp with caramelized tips.',
      '5. Rest & Slice: Let chicken rest for 5 minutes before slicing against the grain to lock in natural juices. Serve immediately with roasted asparagus and lemon wedges.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
    healthBenefits: [
      'Ultra lean, high-biological-value protein supporting lean muscle preservation and post-exercise muscle protein synthesis.',
      'Asparagus is a rich natural source of Glutathione (the master cellular antioxidant) and prebiotic inulin.',
      'Zero refined carbohydrates and low sodium make it ideal for metabolic syndrome and hypertension.'
    ],
    chefTips: [
      'Pounding the chicken to an even thickness ensures the breast cooks evenly without drying out at the edges.'
    ],
    allergenWarnings: ['None'],
    equipmentNeeded: ['Baking Sheet', 'Parchment Paper', 'Meat Thermometer'],
    microsHighlight: [
      { label: 'Niacin (B3)', amount: '16.5 mg', dv: '103%' },
      { label: 'Vitamin B6', amount: '1.2 mg', dv: '71%' },
      { label: 'Phosphorus', amount: '390 mg', dv: '31%' }
    ],

    // Food Ingredients Breakdown
    foodIngredientsBreakdown: [
      {
        foodName: 'Organic Boneless Skinless Chicken Breast',
        quantity: '220g per serving',
        calories: 260,
        proteinG: 44,
        carbsG: 0,
        fatG: 5.8,
        fiberG: 0,
        highlightNutrients: ['Niacin (B3) 16.5mg (103% DV)', 'Vitamin B6 1.2mg (71% DV)', 'Phosphorus 390mg', 'Selenium 36µg']
      },
      {
        foodName: 'Fresh Roasted Asparagus Spears',
        quantity: '225g (1/2 lb)',
        calories: 45,
        proteinG: 4.5,
        carbsG: 8.0,
        fatG: 0.4,
        fiberG: 3.5,
        highlightNutrients: ['Glutathione', 'Folate (B9) 115µg', 'Vitamin K1 92µg', 'Prebiotic Inulin']
      },
      {
        foodName: 'Extra Virgin Olive Oil (Cold-Pressed)',
        quantity: '1.2 tbsp (17g)',
        calories: 145,
        proteinG: 0,
        carbsG: 0,
        fatG: 16.5,
        fiberG: 0,
        highlightNutrients: ['Oleic Acid (MUFA) 12g', 'Polyphenols', 'Vitamin E 2.4mg']
      },
      {
        foodName: 'Fresh Rosemary, Thyme, Garlic & Lemon',
        quantity: 'Aromatic Rub',
        calories: 15,
        proteinG: 0.5,
        carbsG: 3.0,
        fatG: 0.1,
        fiberG: 0.8,
        highlightNutrients: ['Rosmarinic Acid', 'Thymol', 'Allicin', 'Vitamin C 18mg']
      }
    ],

    // Macronutrients Analysis
    macroBreakdown: {
      protein: {
        grams: 46,
        percentKcal: 44,
        quality: 'Complete High Biological Value (BV 79, PDCAAS 1.0) with complete essential amino acid profile',
        leucineG: 3.8,
        keyAminoAcids: ['Leucine (3.8g)', 'Isoleucine (2.4g)', 'Valine (2.6g)', 'Lysine (4.2g)', 'Arginine (3.0g)']
      },
      carbs: {
        totalG: 8,
        netCarbsG: 5,
        fiberG: 3,
        solubleFiberG: 1.2,
        insolubleFiberG: 1.8,
        sugarsG: 2.5,
        glycemicIndex: 15,
        glycemicLoad: 1
      },
      fats: {
        totalG: 22,
        mufaG: 14.5,
        pufaG: 3.2,
        omega3Mg: 280,
        saturatedG: 3.5,
        transG: 0,
        omega6To3Ratio: '4 : 1'
      },
      calorieDistribution: {
        proteinPercent: 44,
        carbsPercent: 8,
        fatPercent: 48
      }
    },

    // Vitamin Directory
    vitaminDirectory: [
      {
        code: 'Vit-B3',
        name: 'Niacin (Vitamin B3)',
        amount: '16.5 mg',
        dvPercent: 103,
        solubility: 'Water-Soluble',
        role: 'Essential cofactor for NAD/NADP cellular energy production and mitochondrial ATP generation.',
        foodSourceInRecipe: 'Chicken Breast'
      },
      {
        code: 'Vit-B6',
        name: 'Vitamin B6 (Pyridoxine)',
        amount: '1.2 mg',
        dvPercent: 71,
        solubility: 'Water-Soluble',
        role: 'Required for muscle glycogen phosphorylase and amino acid catabolism for tissue repair.',
        foodSourceInRecipe: 'Chicken Breast & Garlic'
      },
      {
        code: 'Vit-K1',
        name: 'Vitamin K1 (Phylloquinone)',
        amount: '95 µg',
        dvPercent: 79,
        solubility: 'Fat-Soluble',
        role: 'Regulates bone osteocalcin carboxylation and vascular smooth muscle protection.',
        foodSourceInRecipe: 'Fresh Asparagus'
      },
      {
        code: 'Vit-B9',
        name: 'Folate (Tetrahydrofolate)',
        amount: '125 µg',
        dvPercent: 31,
        solubility: 'Water-Soluble',
        role: 'Nucleotide synthesis, erythrocyte maturation, and methylation cycle support.',
        foodSourceInRecipe: 'Fresh Asparagus'
      },
      {
        code: 'Vit-C',
        name: 'Vitamin C (Ascorbic Acid)',
        amount: '26 mg',
        dvPercent: 29,
        solubility: 'Water-Soluble',
        role: 'Collagen synthesis, immune defense, and free radical neutralization.',
        foodSourceInRecipe: 'Fresh Lemon Juice & Asparagus'
      },
      {
        code: 'Vit-E',
        name: 'Vitamin E (Alpha-Tocopherol)',
        amount: '2.6 mg',
        dvPercent: 17,
        solubility: 'Fat-Soluble',
        role: 'Lipid-phase antioxidant protecting cell membranes from oxidative stress.',
        foodSourceInRecipe: 'Extra Virgin Olive Oil'
      }
    ],

    // Essential Minerals Profile
    essentialMinerals: [
      {
        symbol: 'P',
        name: 'Phosphorus',
        amount: '390 mg',
        dvPercent: 31,
        category: 'Macromineral',
        role: 'High-energy ATP bonds, cell membrane phospholipids, and bone hydroxyapatite lattice.',
        foodSourceInRecipe: 'Chicken Breast'
      },
      {
        symbol: 'Se',
        name: 'Selenium',
        amount: '36 µg',
        dvPercent: 65,
        category: 'Trace Mineral',
        role: 'Antioxidant selenoproteins (GPx) protecting thyroid cells and skeletal muscle integrity.',
        foodSourceInRecipe: 'Chicken Breast'
      },
      {
        symbol: 'K',
        name: 'Potassium',
        amount: '820 mg',
        dvPercent: 24,
        category: 'Macromineral',
        role: 'Muscle contraction, counterbalances sodium, and prevents postprandial blood pressure surges.',
        foodSourceInRecipe: 'Chicken Breast & Asparagus'
      },
      {
        symbol: 'Zn',
        name: 'Zinc',
        amount: '2.1 mg',
        dvPercent: 19,
        category: 'Trace Mineral',
        role: 'Wound healing, muscle protein synthesis, and immune phagocyte activity.',
        foodSourceInRecipe: 'Chicken Breast & Garlic'
      },
      {
        symbol: 'Mg',
        name: 'Magnesium',
        amount: '68 mg',
        dvPercent: 17,
        category: 'Macromineral',
        role: 'Neuromuscular transmission, ribosomal protein translation, and smooth muscle tone.',
        foodSourceInRecipe: 'Asparagus & Chicken'
      }
    ],

    // Phytonutrients
    phytonutrients: [
      {
        name: 'Glutathione (GSH)',
        chemicalClass: 'Tripeptide Antioxidant',
        presence: '28 mg',
        sources: ['Fresh Asparagus Spears'],
        mechanism: 'Directly conjugates electrophilic toxic metabolites in Phase II hepatic detoxification.',
        healthBenefit: 'Master cellular antioxidant, protects hepatocytes, and supports immune longevity.'
      },
      {
        name: 'Rosmarinic Acid & Carnosic Acid',
        chemicalClass: 'Polyphenolic Diterpenes',
        presence: '18 mg',
        sources: ['Fresh Rosemary Leaves'],
        mechanism: 'Scavenges lipid peroxyl radicals and inhibits advanced glycation end-products (AGEs).',
        healthBenefit: 'Neuroprotective, prevents heterocyclic amine formation during poultry cooking.'
      },
      {
        name: 'Allicin & S-Allylcysteine',
        chemicalClass: 'Organosulfur Compounds',
        presence: '8 mg',
        sources: ['Crushed Fresh Garlic'],
        mechanism: 'Stimulates vascular hydrogen sulfide (H2S) signaling, relaxing arterial walls.',
        healthBenefit: 'Antimicrobial, cardioprotective, and downregulates vascular inflammation.'
      }
    ],

    // Synergies
    absorptionSynergies: [
      {
        title: 'Rosemary Carnosic Acid + High-Heat Poultry Protection',
        mechanism: 'Polyphenols in fresh rosemary inhibit the formation of carcinogenic Heterocyclic Amines (HCAs) during baking/roasting.',
        impact: 'Reduces dietary mutagens by over 70% while adding delicious Mediterranean aroma.'
      },
      {
        title: 'Extra Virgin Olive Oil + Asparagus Vitamin K & Glutathione',
        mechanism: 'Healthy monounsaturated lipids optimize the intestinal uptake of fat-soluble nutrients in asparagus.',
        impact: 'Maximizes antioxidant and vascular benefits.'
      }
    ],

    // WHAT IF WE EAT LESS (Deficiency Diseases)
    whatIfEatLess: {
      title: 'Nutritional Deficiency Risks & Diseases If You Lack These Nutrients',
      riskSummary: 'A diet lacking lean complete proteins, B-vitamins (Niacin, B6), and sulfur-containing antioxidants leads to sarcopenia, slow wound healing, and metabolic lethargy.',
      associatedDiseases: [
        {
          diseaseName: 'Sarcopenia & Muscle Protein Breakdown (Catabolism)',
          icdOrCategory: 'M62.84 / Musculoskeletal Disease',
          deficientNutrient: 'Essential Amino Acids & Dietary Leucine (<1.2g/kg/day)',
          description: 'In the absence of sufficient dietary essential amino acids, the body enters negative nitrogen balance, breaking down skeletal muscle to supply vital organs.',
          symptoms: ['Progressive loss of skeletal muscle mass and functional grip strength', 'Increased risk of falls and fractures in older adults', 'Lower basal metabolic rate and increased visceral fat accumulation', 'Delayed recovery from illness or surgical procedures'],
          highRiskGroups: ['Elderly adults with anorexia of aging', 'Patients recovering from major surgeries or severe burns', 'Severe calorie-restricted diets without adequate protein']
        },
        {
          diseaseName: 'Pellagra & NAD Energy Depletion',
          icdOrCategory: 'E52 / Metabolic Deficiency Disorder',
          deficientNutrient: 'Niacin (Vitamin B3) & Tryptophan',
          description: 'Deficiency impairs NAD and NADP coenzymes, preventing ATP production and cellular repair throughout metabolically active tissues.',
          symptoms: ['Fiery red painful glossitis and oral inflammation', 'Photosensitive symmetric dermatitis', 'Chronic diarrhea and digestive malabsorption', 'Mental confusion, depression, and cognitive deterioration'],
          highRiskGroups: ['Individuals on monotonous un-nixtamalized corn diets', 'Chronic severe alcohol dependence', 'Patients with carcinoid syndrome']
        },
        {
          diseaseName: 'Vitamin B6 Deficiency Microcytic Anemia & Neuropathy',
          icdOrCategory: 'E53.1 / Hematologic & Neurologic Disorder',
          deficientNutrient: 'Vitamin B6 (Pyridoxine)',
          description: 'Impairment of delta-aminolevulinic acid synthase prevents heme synthesis and halts neurotransmitter formation.',
          symptoms: ['Microcytic hypochromic anemia unresponsive to iron alone', 'Peripheral sensory neuropathy and irritability', 'Cheilosis and seborrheic dermatitis around eyes and nose'],
          highRiskGroups: ['Patients on Isoniazid (anti-tuberculosis) or Penicillamine therapy without B6 co-prescription', 'Severe chronic alcohol use disorder']
        }
      ],
      earlyWarningSigns: [
        'Muscle weakness, fatigue during normal daily activities',
        'Prolonged muscle soreness after exercise',
        'Frequent oral sores, cracked lips, and dry skin'
      ]
    },

    // WHAT IF WE EAT MORE (Toxicity / Excess Risks)
    whatIfEatMore: {
      title: 'Toxicity, Overconsumption & Chronic Excess Health Warnings',
      excessSummary: 'Lean roasted poultry and steamed asparagus are extremely wholesome. However, excessive isolated mega-dose supplementation of single B-vitamins or excessive protein in severe advanced kidney failure requires medical supervision.',
      associatedRisks: [
        {
          conditionName: 'Intraglomerular Hypertension in Advanced End-Stage Renal Disease (ESRD)',
          excessFactor: 'High-protein diet (>1.5 - 2.0 g/kg/day) in patients with unmanaged CKD Stage 4-5',
          upperTolerableLimit: 'CKD non-dialysis patients are restricted to 0.6 - 0.8 g protein/kg/day',
          description: 'High nitrogen loads induce renal afferent arteriolar vasodilation, increasing glomerular filtration pressure and accelerating protein leakage (proteinuria).',
          risksAndSymptoms: ['Accelerated decline in Glomerular Filtration Rate (eGFR), rising BUN/Creatinine, and uremic symptoms.'],
          precautions: ['Individuals with healthy kidneys can safely metabolize high protein; individuals with known CKD should adhere to their nephrologist\'s customized protein targets.']
        },
        {
          conditionName: 'Megadose Vitamin B6 Sensory Neuropathy',
          excessFactor: 'Chronic synthetic Pyridoxine supplement intake >200 - 500 mg/day for months',
          upperTolerableLimit: '100 mg/day for adults (Established UL)',
          description: 'Extreme supratherapeutic B6 levels accumulate in dorsal root ganglia, causing sensory axonopathy.',
          risksAndSymptoms: ['Bilateral sensory ataxia, loss of proprioception, and burning sensations in feet and hands.'],
          precautions: ['Dietary whole chicken breast provides a safe, natural 1.2 mg B6; avoid unregulated high-dose B6 supplement megadoses.']
        }
      ],
      safeIntakeGuidance: 'Enjoy 1 satisfying serving (420 kcal, 46g protein) for ideal athletic recovery, fat loss, or blood sugar stabilization.'
    },

    // Chronic Diseases Prevented
    diseasesPrevented: [
      {
        condition: 'Sarcopenia & Frailty Syndrome in Aging',
        evidenceLevel: 'Strong Clinical Evidence',
        mechanism: 'Provides 3.8g Leucine per serving, exceeding the 2.5g threshold required to trigger the mTORC1 signaling pathway for muscle protein synthesis.'
      },
      {
        condition: 'Type 2 Diabetes & Insulin Resistance',
        evidenceLevel: 'Meta-Analysis Backed',
        mechanism: 'High-protein, low-glycemic meal structure induces robust satiety hormones (GLP-1, PYY) and prevents postprandial insulin surges.'
      },
      {
        condition: 'Glutathione Depletion & Hepatic Oxidative Stress',
        evidenceLevel: 'Strong Clinical Evidence',
        mechanism: 'Asparagus provides intact dietary Glutathione and prebiotic inulin, lowering systemic oxidative biomarkers and supporting liver detoxification.'
      }
    ]
  }
];

// ==========================================
// 7. 7-DAY CLINICAL MEAL PLANS
// ==========================================
export const MEAL_PLANS_DATA: MealPlan[] = [
  {
    id: 'plan-mediterranean',
    title: '7-Day Mediterranean Longevity & Heart Health Protocol',
    targetCondition: 'Cardiovascular Longevity & Atherosclerosis Prevention',
    description: 'An evidence-based dietary plan rich in extra virgin olive oil, wild fatty fish, whole ancient grains, leafy greens, legumes, and polyphenolic berries.',
    calorieRange: '1,800 - 2,100 kcal/day',
    keyPrinciples: [
      'Unrefined extra virgin olive oil as the primary dietary fat source (3-4 tbsp/day).',
      'Minimum 2 servings of fatty fish (Salmon, Sardines, Mackerel) per week.',
      '30g+ daily dietary fiber from legumes, vegetables, fruits, and whole intact grains.',
      'Minimal ultra-processed foods, refined flours, and zero industrial trans fats.'
    ],
    idealFor: ['Coronary Artery Disease', 'Hypertension', 'High LDL / ApoB', 'Metabolic Syndrome', 'General Longevity'],
    days: [
      {
        day: 1,
        dayName: 'Monday',
        totalCalories: 1920,
        macros: { protein: '98g', carbs: '210g', fat: '78g', fiber: '36g' },
        breakfast: { name: 'Greek Yogurt with Blueberries, Walnuts & Chia', calories: 410, description: 'Plain Greek yogurt with 1/2 cup fresh wild blueberries, 25g raw walnuts, and 1 tbsp chia seeds.' },
        lunch: { name: 'Mediterranean Quinoa & Wild Salmon Power Bowl', calories: 495, description: 'Pan-seared wild salmon, quinoa, cucumber, cherry tomatoes, Kalamata olives, and tahini dressing.', recipeId: 'rec-salmon-power-bowl' },
        dinner: { name: 'Tuscan Chickpea, Kale & Roasted Vegetable Medley', calories: 580, description: 'Garlic roasted chickpeas, steamed lacinato kale, roasted zucchini, and extra virgin olive oil drizzle.' },
        snack: { name: 'Sliced Apple with 1 tbsp Raw Almond Butter', calories: 210, description: 'Crisp green apple with pure stone-ground almond butter.' }
      },
      {
        day: 2,
        dayName: 'Tuesday',
        totalCalories: 1880,
        macros: { protein: '105g', carbs: '195g', fat: '74g', fiber: '34g' },
        breakfast: { name: 'Steel-Cut Oatmeal with Cinnamon, Flax & Sliced Pear', calories: 390, description: 'Slow-cooked steel-cut oats with ground flaxseeds, Ceylon cinnamon, and diced fresh pear.' },
        lunch: { name: 'Herb-Crusted Lemon Garlic Chicken & Asparagus', calories: 420, description: 'Rosemary-lemon roasted chicken breast with tender asparagus and 1/2 cup cooked brown rice.', recipeId: 'rec-baked-chicken-mediterranean' },
        dinner: { name: 'Anti-Inflammatory Golden Turmeric & Red Lentil Dhal', calories: 460, description: 'Creamy coconut red lentils with fresh ginger, turmeric, and baby spinach served over quinoa.', recipeId: 'rec-turmeric-lentil-stew' },
        snack: { name: 'Raw Pumpkin Seeds & Sliced Bell Pepper with Hummus', calories: 230, description: '30g raw pumpkin seeds with 2 tbsp organic tahini hummus.' }
      },
      {
        day: 3,
        dayName: 'Wednesday',
        totalCalories: 1950,
        macros: { protein: '110g', carbs: '205g', fat: '80g', fiber: '38g' },
        breakfast: { name: 'Poached Free-Range Eggs over Smashed Avocado Toast', calories: 430, description: '2 pasture-raised poached eggs on 100% whole grain sourdough with sliced avocado and chili flakes.' },
        lunch: { name: 'Sardine & White Bean Mediterranean Salad', calories: 480, description: 'Canned wild sardines with cannellini beans, red onions, parsley, lemon juice, and olive oil.' },
        dinner: { name: 'Baked Mediterranean Cod with Stewed Tomatoes & Capers', calories: 520, description: 'Wild Pacific cod fillet baked with oregano, garlic, San Marzano tomatoes, and steamed broccoli.' },
        snack: { name: 'Detox Green Smoothie with Avocado & Blueberries', calories: 285, description: 'Avocado, kale, chia seeds, and wild blueberries blended with almond milk.' }
      },
      {
        day: 4,
        dayName: 'Thursday',
        totalCalories: 1890,
        macros: { protein: '102g', carbs: '198g', fat: '76g', fiber: '35g' },
        breakfast: { name: 'Chia Seed Overnight Pudding with Pomegranate Arils', calories: 380, description: 'Chia seeds soaked in almond milk, topped with toasted almonds and fresh pomegranate arils.' },
        lunch: { name: 'Quinoa Tabbouleh Bowl with Grilled Chicken Breast', calories: 470, description: 'Parsley-rich quinoa tabbouleh with diced tomatoes, mint, olive oil, and sliced grilled chicken breast.' },
        dinner: { name: 'Moroccan Spiced Lentil & Sweet Potato Tagine', calories: 510, description: 'Slow-simmered lentils with sweet potato cubes, cumin, cinnamon, apricots, and wilted spinach.' },
        snack: { name: 'Handful of Roasted Pistachios & Fresh Orange', calories: 220, description: '30g unsalted pistachios with 1 whole organic naval orange.' }
      },
      {
        day: 5,
        dayName: 'Friday',
        totalCalories: 1940,
        macros: { protein: '115g', carbs: '190g', fat: '82g', fiber: '37g' },
        breakfast: { name: 'Mediterranean Vegetable Omelet with Feta', calories: 420, description: '3-egg omelet with baby spinach, diced tomatoes, Kalamata olives, and 25g sheep milk feta.' },
        lunch: { name: 'Wild Salmon Quinoa Power Bowl (Meal Prep)', calories: 495, description: 'Crisp salmon, quinoa, cucumber, and tahini dill dressing.', recipeId: 'rec-salmon-power-bowl' },
        dinner: { name: 'Grilled Herb Trout with Lemon-Garlic Green Beans & Quinoa', calories: 530, description: 'Freshwater trout with steamed garlic green beans and extra virgin olive oil.' },
        snack: { name: 'Celery Sticks with Natural Peanut Butter', calories: 190, description: 'Crisp organic celery stalks with pure peanut butter.' }
      },
      {
        day: 6,
        dayName: 'Saturday',
        totalCalories: 2020,
        macros: { protein: '108g', carbs: '215g', fat: '85g', fiber: '39g' },
        breakfast: { name: 'Avocado Spinach Toast with Smoked Salmon', calories: 460, description: 'Whole grain rye toast topped with mashed avocado, wild smoked salmon, and fresh capers.' },
        lunch: { name: 'Golden Turmeric Red Lentil Stew with Sautéed Greens', calories: 460, description: 'Restorative turmeric lentil dhal served with steamed kale.', recipeId: 'rec-turmeric-lentil-stew' },
        dinner: { name: 'Mediterranean Stuffed Bell Peppers with Ground Turkey & Pine Nuts', calories: 580, description: 'Baked bell peppers stuffed with lean turkey, brown rice, herbs, and toasted pine nuts.' },
        snack: { name: 'Dark Chocolate (85% Cocoa) & Raw Walnuts', calories: 240, description: '2 squares 85% dark chocolate with 20g raw English walnuts.' }
      },
      {
        day: 7,
        dayName: 'Sunday',
        totalCalories: 1910,
        macros: { protein: '112g', carbs: '195g', fat: '79g', fiber: '36g' },
        breakfast: { name: 'Berry Antioxidant Greek Yogurt Bowl', calories: 410, description: 'Greek yogurt with blackberries, raspberries, raw pumpkin seeds, and a drizzle of raw honey.' },
        lunch: { name: 'Lemon Herb Roasted Chicken with Warm Farro & Roasted Carrots', calories: 490, description: 'Sliced herb chicken breast with nutty farro grain and roasted rainbow carrots.' },
        dinner: { name: 'Pan-Seared Halibut with Mediterranean Ratatouille', calories: 510, description: 'Wild halibut fillet over slow-cooked zucchini, eggplant, bell peppers, garlic, and fresh basil.' },
        snack: { name: 'Cucumber Slices with Tzatziki & Handful of Almonds', calories: 210, description: 'Homemade Greek yogurt tzatziki with cucumber rounds.' }
      }
    ],
    weeklyGroceryList: [
      { category: 'Fresh Produce', items: ['Organic Baby Spinach (3 large tubs)', 'Lacinato Kale (2 bunches)', 'Cherry Tomatoes (3 pints)', 'English Cucumbers (4)', 'Avocados (5 ripe)', 'Lemons & Limes (8 total)', 'Garlic bulbs & Fresh Ginger root', 'Asparagus (2 lbs)', 'Wild Blueberries (frozen or fresh)'] },
      { category: 'Proteins & Seafood', items: ['Wild Alaskan Salmon fillets (4x 6oz)', 'Wild Pacific Cod / Halibut (2x 6oz)', 'Organic Chicken Breasts (4 fillets)', 'Pasture-Raised Eggs (2 dozen)', 'Canned Wild Sardines in Olive Oil (3 cans)'] },
      { category: 'Pantry, Grains & Legumes', items: ['Organic Quinoa (1 lb)', 'Split Red Lentils (1 lb)', 'Steel-Cut Oats (1 canister)', 'Canned Chickpeas (3 cans)', 'Canned Cannellini Beans (2 cans)', 'Extra Virgin Olive Oil (Cold-Pressed 750ml)', 'Tahini (1 jar)', 'Kalamata Olives (1 jar)'] },
      { category: 'Nuts, Seeds & Dairy', items: ['Plain Greek Yogurt 2% (2 large tubs)', 'Raw English Walnuts (1 lb)', 'Raw Pumpkin Seeds / Pepitas (1 lb)', 'Chia Seeds (1 bag)', 'Dark Chocolate 85%+ (2 bars)'] }
    ]
  }
];

// ==========================================
// 8. FOOD-DRUG & NUTRIENT INTERACTIONS
// ==========================================
export interface SearchEntityItem {
  id: string;
  name: string;
  type: 'food' | 'drug' | 'nutrient' | 'supplement' | 'herb' | 'beverage' | 'alcohol';
  category: string;
  alternateNames: string[];
  forms?: string[];
  brandNames?: string[];
  genericName?: string;
  drugClass?: string;
  interactionCount: number;
  icon: string;
  relatedEntities: string[];
}

export const FOOD_ENTITY_DICTIONARY: SearchEntityItem[] = [
  {
    id: 'ent-grapefruit',
    name: 'Grapefruit',
    type: 'food',
    category: 'Citrus & Fresh Fruit',
    alternateNames: ['Grapefruit', 'Grape fruit', 'Pink grapefruit', 'White grapefruit', 'Ruby red grapefruit'],
    forms: ['Fresh Grapefruit', 'Grapefruit Juice', 'Grapefruit Extract', 'Grapefruit Seed Extract', 'Pomelo / Seville Orange'],
    interactionCount: 14,
    icon: '🍊',
    relatedEntities: ['Grapefruit Juice', 'Seville Oranges', 'Pomelo', 'Citrus Fruits', 'Grapes']
  },
  {
    id: 'ent-grapes',
    name: 'Grapes',
    type: 'food',
    category: 'Fresh Fruit',
    alternateNames: ['Grapes', 'Table grapes', 'Red grapes', 'Green grapes', 'Concord grapes'],
    forms: ['Fresh Grapes', 'Grape Juice', 'Grape Seed Extract', 'Raisins'],
    interactionCount: 1,
    icon: '🍇',
    relatedEntities: ['Grapefruit', 'Grape Juice', 'Wine', 'Berries']
  },
  {
    id: 'ent-vitk-greens',
    name: 'Vitamin K Dark Greens',
    type: 'nutrient',
    category: 'Dark Leafy Vegetables',
    alternateNames: ['Spinach', 'Kale', 'Collard greens', 'Swiss chard', 'Natto', 'Broccoli', 'Phylloquinone', 'Vitamin K1', 'Vitamin K2'],
    forms: ['Raw Greens', 'Cooked Greens', 'Green Smoothies', 'Natto Fermented Soy', 'Vitamin K Supplements'],
    interactionCount: 8,
    icon: '🥬',
    relatedEntities: ['Warfarin', 'Kale', 'Spinach', 'Green Tea', 'Vitamin K Supplements']
  },
  {
    id: 'ent-dairy-calcium',
    name: 'Milk & Dairy (Calcium)',
    type: 'food',
    category: 'Dairy & Calcium Fortified',
    alternateNames: ['Milk', 'Yogurt', 'Cheese', 'Cottage cheese', 'Calcium carbonate', 'Calcium citrate', 'Dairy'],
    forms: ['Cow Milk', 'Greek Yogurt', 'Hard Cheese', 'Calcium Supplements', 'Fortified Plant Milk'],
    interactionCount: 12,
    icon: '🥛',
    relatedEntities: ['Calcium Carbonate', 'Antibiotics', 'Levothyroxine', 'Iron Supplements']
  },
  {
    id: 'ent-potassium-foods',
    name: 'High-Potassium Foods & Salt Substitutes',
    type: 'nutrient',
    category: 'Electrolyte Minerals',
    alternateNames: ['Potassium', 'Bananas', 'Avocados', 'Potassium chloride', 'Salt substitutes', 'NoSalt', 'Nu-Salt', 'Coconut water'],
    forms: ['Bananas', 'Avocados', 'Dried Apricots', 'Coconut Water', 'Potassium Chloride Salt Substitutes'],
    interactionCount: 9,
    icon: '🍌',
    relatedEntities: ['ACE Inhibitors', 'ARBs', 'Spironolactone', 'Bananas', 'Potassium Chloride']
  },
  {
    id: 'ent-tyramine-aged',
    name: 'Tyramine-Rich Aged Foods',
    type: 'food',
    category: 'Fermented & Aged Proteins',
    alternateNames: ['Aged cheese', 'Cured meats', 'Salami', 'Prosciutto', 'Soy sauce', 'Miso', 'Draft beer', 'Red wine', 'Tyramine'],
    forms: ['Aged Parmesan/Cheddar', 'Cured Charcuterie', 'Fermented Soy / Tamari', 'Draft Beer on Tap', 'Aged Sourdough'],
    interactionCount: 11,
    icon: '🧀',
    relatedEntities: ['MAO Inhibitors', 'Aged Cheeses', 'Red Wine', 'Soy Sauce']
  },
  {
    id: 'ent-black-licorice',
    name: 'Natural Black Licorice',
    type: 'herb',
    category: 'Botanical Root & Glycyrrhizin',
    alternateNames: ['Black licorice', 'Licorice root', 'Glycyrrhiza glabra', 'Glycyrrhizin', 'Licorice candy'],
    forms: ['Real Licorice Root Tea', 'Traditional Black Licorice Confections', 'Glycyrrhizinic Acid Extracts'],
    interactionCount: 7,
    icon: '🪵',
    relatedEntities: ['Digoxin', 'Diuretics', 'Blood Pressure Medications', 'DGL Licorice']
  },
  {
    id: 'ent-iron-supplements',
    name: 'Iron Supplements & Non-Heme Iron',
    type: 'nutrient',
    category: 'Essential Mineral Compounds',
    alternateNames: ['Iron', 'Ferrous sulfate', 'Ferrous gluconate', 'Iron bisglycinate', 'Plant iron', 'Non-heme iron'],
    forms: ['Oral Iron Tablets', 'Liquid Iron Drops', 'Lentils / Beans', 'Spinach Iron'],
    interactionCount: 10,
    icon: '🩸',
    relatedEntities: ['Levothyroxine', 'Antibiotics', 'Coffee & Tea', 'Vitamin C']
  },
  {
    id: 'ent-st-johns-wort',
    name: "St. John's Wort",
    type: 'herb',
    category: 'Herbal Botanical Extract',
    alternateNames: ["St. John's Wort", 'Hypericum perforatum', 'Klamath weed', 'Hyperforin', 'Hypericin'],
    forms: ['Herbal Tea', 'Standardized Dry Extract Capsules', 'Liquid Tincture'],
    interactionCount: 16,
    icon: '🌿',
    relatedEntities: ['SSRIs', 'Oral Contraceptives', 'Cyclosporine', 'Warfarin']
  },
  {
    id: 'ent-alcohol-beverages',
    name: 'Alcoholic Beverages',
    type: 'alcohol',
    category: 'Ethanol & Spirits',
    alternateNames: ['Alcohol', 'Ethanol', 'Beer', 'Wine', 'Whiskey', 'Vodka', 'Cocktails', 'Liquor'],
    forms: ['Draft Beer', 'Red/White Wine', 'Distilled Spirits', 'Cider'],
    interactionCount: 15,
    icon: '🍷',
    relatedEntities: ['Acetaminophen / Paracetamol', 'Metformin', 'Sedatives / Benzodiazepines', 'NSAIDs']
  },
  {
    id: 'ent-green-tea',
    name: 'Green Tea & Matcha (EGCG)',
    type: 'beverage',
    category: 'Catechin Polyphenols',
    alternateNames: ['Green tea', 'Matcha', 'EGCG', 'Epigallocatechin gallate', 'Green tea extract'],
    forms: ['Brewed Green Tea', 'Stone-Ground Matcha', 'Green Tea Extract Dietary Pills'],
    interactionCount: 6,
    icon: '🍵',
    relatedEntities: ['Nadolol', 'Beta-Blockers', 'Warfarin', 'Iron Supplements']
  },
  {
    id: 'ent-coffee-tea',
    name: 'Coffee & Espresso (Tannins/Caffeine)',
    type: 'beverage',
    category: 'Caffeine & Polyphenols',
    alternateNames: ['Coffee', 'Espresso', 'Black tea', 'Tannins', 'Chlorogenic acid', 'Caffeine'],
    forms: ['Brewed Filter Coffee', 'Espresso', 'Iced Black Tea', 'Dark Chocolate'],
    interactionCount: 8,
    icon: '☕',
    relatedEntities: ['Iron Absorption', 'Levothyroxine', 'Sedatives', 'Calcium']
  },
  {
    id: 'ent-soluble-fiber',
    name: 'High-Soluble Fiber (Psyllium / Flax)',
    type: 'supplement',
    category: 'Mucilaginous Dietary Fiber',
    alternateNames: ['Psyllium husk', 'Metamucil', 'Flaxseed gel', 'Chia seeds', 'Glucomannan', 'Soluble fiber'],
    forms: ['Psyllium Husk Powder', 'Chia Seed Gel', 'Ground Flaxseed', 'Fiber Gummies'],
    interactionCount: 7,
    icon: '🌾',
    relatedEntities: ['Metformin', 'Digoxin', 'Thyroid Medications', 'Carbamazepine']
  }
];

export const DRUG_ENTITY_DICTIONARY: SearchEntityItem[] = [
  {
    id: 'med-atorvastatin',
    name: 'Atorvastatin (Lipitor)',
    type: 'drug',
    category: 'HMG-CoA Reductase Inhibitor (Statin)',
    genericName: 'Atorvastatin calcium',
    brandNames: ['Lipitor', 'Torvast', 'Atorva', 'Liprimar'],
    drugClass: 'Statins (Lipid-Lowering)',
    alternateNames: ['Atorvastatin', 'Lipitor', 'Statin', 'Cholesterol medication'],
    interactionCount: 11,
    icon: '💊',
    relatedEntities: ['Grapefruit', 'Green Tea Extract', 'Simvastatin', 'Rosuvastatin']
  },
  {
    id: 'med-simvastatin',
    name: 'Simvastatin (Zocor)',
    type: 'drug',
    category: 'HMG-CoA Reductase Inhibitor (Statin)',
    genericName: 'Simvastatin',
    brandNames: ['Zocor', 'Simvador', 'Denan'],
    drugClass: 'Statins (Lipid-Lowering)',
    alternateNames: ['Simvastatin', 'Zocor', 'Statin'],
    interactionCount: 13,
    icon: '💊',
    relatedEntities: ['Grapefruit', 'Atorvastatin', 'CYP3A4 Inhibitors']
  },
  {
    id: 'med-warfarin',
    name: 'Warfarin (Coumadin / Jantoven)',
    type: 'drug',
    category: 'Vitamin K Antagonist (Anticoagulant)',
    genericName: 'Warfarin sodium',
    brandNames: ['Coumadin', 'Jantoven', 'Marevan', 'Waran'],
    drugClass: 'Oral Anticoagulants (Blood Thinners)',
    alternateNames: ['Warfarin', 'Coumadin', 'Jantoven', 'Blood thinner', 'Anticoagulant'],
    interactionCount: 18,
    icon: '🩸',
    relatedEntities: ['Vitamin K Dark Greens', 'Green Tea', 'St. Johns Wort', 'Alcohol', 'Cranberry']
  },
  {
    id: 'med-lisinopril',
    name: 'Lisinopril (Zestril / Prinivil)',
    type: 'drug',
    category: 'ACE Inhibitor (Antihypertensive)',
    genericName: 'Lisinopril',
    brandNames: ['Zestril', 'Prinivil', 'Qbrelis'],
    drugClass: 'Angiotensin-Converting Enzyme (ACE) Inhibitors',
    alternateNames: ['Lisinopril', 'Zestril', 'Prinivil', 'ACE inhibitor', 'Blood pressure pill'],
    interactionCount: 9,
    icon: '🫀',
    relatedEntities: ['High-Potassium Foods & Salt Substitutes', 'Losartan', 'Spironolactone']
  },
  {
    id: 'med-losartan',
    name: 'Losartan (Cozaar)',
    type: 'drug',
    category: 'Angiotensin II Receptor Blocker (ARB)',
    genericName: 'Losartan potassium',
    brandNames: ['Cozaar', 'Hyzaar (combo)'],
    drugClass: 'ARBs (Antihypertensives)',
    alternateNames: ['Losartan', 'Cozaar', 'ARB', 'Blood pressure drug'],
    interactionCount: 8,
    icon: '🫀',
    relatedEntities: ['High-Potassium Foods & Salt Substitutes', 'Lisinopril', 'Potassium Chloride']
  },
  {
    id: 'med-levothyroxine',
    name: 'Levothyroxine (Synthroid / Euthyrox)',
    type: 'drug',
    category: 'Synthetic Thyroid Hormone (T4)',
    genericName: 'Levothyroxine sodium',
    brandNames: ['Synthroid', 'Euthyrox', 'Tirosint', 'Levoxyl', 'Unithroid'],
    drugClass: 'Thyroid Replacement Hormones',
    alternateNames: ['Levothyroxine', 'Synthroid', 'Euthyrox', 'T4', 'Thyroid pill'],
    interactionCount: 14,
    icon: '🦋',
    relatedEntities: ['Milk & Dairy (Calcium)', 'Iron Supplements', 'Coffee & Espresso', 'Soy Protein']
  },
  {
    id: 'med-ciprofloxacin',
    name: 'Ciprofloxacin & Doxycycline (Antibiotics)',
    type: 'drug',
    category: 'Fluoroquinolones & Tetracyclines',
    genericName: 'Ciprofloxacin / Doxycycline hyclate',
    brandNames: ['Cipro', 'Cipro XR', 'Vibramycin', 'Doryx', 'Monodox'],
    drugClass: 'Broad-Spectrum Antibacterial Agents',
    alternateNames: ['Ciprofloxacin', 'Cipro', 'Doxycycline', 'Tetracycline', 'Antibiotic'],
    interactionCount: 12,
    icon: '🦠',
    relatedEntities: ['Milk & Dairy (Calcium)', 'Iron Supplements', 'Antacids', 'Zinc']
  },
  {
    id: 'med-digoxin',
    name: 'Digoxin (Lanoxin)',
    type: 'drug',
    category: 'Cardiac Glycoside',
    genericName: 'Digoxin',
    brandNames: ['Lanoxin', 'Digitek', 'Cardoxin'],
    drugClass: 'Inotropic Agents (Heart Failure & AFib)',
    alternateNames: ['Digoxin', 'Lanoxin', 'Heart rhythm pill'],
    interactionCount: 10,
    icon: '💓',
    relatedEntities: ['Natural Black Licorice', 'High-Soluble Fiber', 'Furosemide', 'Potassium']
  },
  {
    id: 'med-sertraline',
    name: 'Sertraline & Fluoxetine (SSRIs)',
    type: 'drug',
    category: 'Selective Serotonin Reuptake Inhibitors (SSRIs)',
    genericName: 'Sertraline HCl / Fluoxetine HCl',
    brandNames: ['Zoloft', 'Prozac', 'Paxil', 'Lexapro', 'Celexa'],
    drugClass: 'Antidepressants (SSRIs / SNRIs)',
    alternateNames: ['Sertraline', 'Zoloft', 'Fluoxetine', 'Prozac', 'SSRI', 'Antidepressant'],
    interactionCount: 15,
    icon: '🧠',
    relatedEntities: ["St. John's Wort", 'Alcoholic Beverages', 'MAO Inhibitors', 'Tryptophan']
  },
  {
    id: 'med-acetaminophen',
    name: 'Acetaminophen / Paracetamol (Tylenol)',
    type: 'drug',
    category: 'Analgesic & Antipyretic',
    genericName: 'Acetaminophen (APAP) / Paracetamol',
    brandNames: ['Tylenol', 'Panadol', 'Calpol', 'Ofirmev'],
    drugClass: 'Non-Opioid Pain & Fever Relievers',
    alternateNames: ['Acetaminophen', 'Paracetamol', 'Tylenol', 'Panadol', 'APAP', 'Pain killer'],
    interactionCount: 8,
    icon: '🤕',
    relatedEntities: ['Alcoholic Beverages', 'Metformin', 'Warfarin', 'Liver Function']
  },
  {
    id: 'med-metformin',
    name: 'Metformin (Glucophage)',
    type: 'drug',
    category: 'Biguanide Antidiabetic',
    genericName: 'Metformin hydrochloride',
    brandNames: ['Glucophage', 'Fortamet', 'Glumetza', 'Riomet'],
    drugClass: 'Oral Hypoglycemic Agents (Type 2 Diabetes)',
    alternateNames: ['Metformin', 'Glucophage', 'Diabetes medicine', 'Blood sugar tablet'],
    interactionCount: 7,
    icon: '🩺',
    relatedEntities: ['Alcoholic Beverages', 'High-Soluble Fiber', 'Contrast Media']
  },
  {
    id: 'med-phenelzine',
    name: 'MAO Inhibitors (Phenelzine / Selegiline)',
    type: 'drug',
    category: 'Monoamine Oxidase Inhibitors (MAOIs)',
    genericName: 'Phenelzine sulfate / Tranylcypromine / Selegiline',
    brandNames: ['Nardil', 'Parnate', 'Emsam', 'Marplan'],
    drugClass: 'Irreversible MAO Inhibitors',
    alternateNames: ['Phenelzine', 'Nardil', 'MAOI', 'Tranylcypromine', 'Selegiline'],
    interactionCount: 16,
    icon: '⚠️',
    relatedEntities: ['Tyramine-Rich Aged Foods', 'Aged Cheeses', 'Draft Beer', 'Red Wine']
  },
  {
    id: 'med-oral-contraceptives',
    name: 'Oral Contraceptives (Birth Control Pills)',
    type: 'drug',
    category: 'Estrogen / Progestin Hormones',
    genericName: 'Ethinyl estradiol + Levonorgestrel / Drospirenone',
    brandNames: ['Yaz', 'Yasmin', 'Ortho Tri-Cyclen', 'Lo Loestrin Fe'],
    drugClass: 'Hormonal Contraceptives',
    alternateNames: ['Birth control', 'Oral contraceptive', 'The pill', 'Yaz', 'Yasmin'],
    interactionCount: 11,
    icon: '🌸',
    relatedEntities: ["St. John's Wort", 'Antibiotics', 'Grapefruit', 'Anticonvulsants']
  },
  {
    id: 'med-nadolol',
    name: 'Nadolol & Beta-Blockers (Corgard)',
    type: 'drug',
    category: 'Non-Selective Beta-Adrenergic Blocker',
    genericName: 'Nadolol / Atenolol / Metoprolol',
    brandNames: ['Corgard', 'Tenormin', 'Lopressor', 'Toprol XL'],
    drugClass: 'Beta-Blockers (Cardiovascular)',
    alternateNames: ['Nadolol', 'Corgard', 'Beta blocker', 'Metoprolol', 'Atenolol'],
    interactionCount: 9,
    icon: '🫀',
    relatedEntities: ['Green Tea & Matcha (EGCG)', 'Apple Juice', 'Orange Juice']
  }
];

export const FOOD_INTERACTIONS_DATA: FoodInteraction[] = [
  {
    id: 'int-grapefruit-statins',
    title: 'Grapefruit & CYP3A4 Enzyme Inactivation (Statins & CCBs)',
    category: 'Food-Drug Interaction',
    severity: 'Severe (Contraindicated)',
    actionBadge: 'Avoid Combination',
    primaryItem: 'Grapefruit, Fresh Grapefruit Juice & Seville Oranges',
    interactingWith: 'Statins (Atorvastatin, Simvastatin, Lovastatin) & CCBs (Amlodipine, Felodipine, Nifedipine)',
    mechanism: 'Furanocoumarins (bergamottin and 6,7-dihydroxybergamottin) irreversibly inhibit and destroy intestinal Cytochrome P450 3A4 (CYP3A4) enzymes, eliminating first-pass hepatic/gut metabolism and multiplying circulating drug bioavailability by 300% to 500%.',
    mechanismType: 'Metabolism (CYP450 / Transporters)',
    clinicalImpact: 'Acute toxic serum drug concentrations triggering severe Rhabdomyolysis (muscle necrosis and myoglobinuric acute renal failure), severe hepatotoxicity, profound hypotension, and fatal bradycardia.',
    actionableGuidance: 'Completely avoid grapefruit, Seville oranges, pomelos, and their juices while taking CYP3A4-metabolized medications. Timing separation DOES NOT prevent this interaction because intestinal CYP3A4 synthesis takes 48–72 hours to recover.',
    patientExplanation: 'Grapefruit turns off an essential digestive enzyme in your gut that normally breaks down your medication. Without this enzyme, your body absorbs up to 5 times more medicine than intended, creating an accidental overdose that can damage muscles and kidneys.',
    clinicalPharmacology: 'Intestinal CYP3A4 mechanism-based suicide inhibition. AUC increases by 200–500% for simvastatin/atorvastatin; pravastatin and rosuvastatin do not utilize CYP3A4 and are safe alternatives.',
    timingGuidance: '🚫 Timing separation (e.g. taking pill in the morning and grapefruit at night) DOES NOT work. Complete dietary elimination of grapefruit is required.',
    evidenceLevel: 'High (Clinical Studies / FDA Label)',
    drugClass: 'HMG-CoA Reductase Inhibitors & Dihydropyridine CCBs',
    foodCategory: 'Citrus Fruits & Juices',
    foodEntities: ['grapefruit', 'grapefruit juice', 'pomelo', 'seville orange', 'pink grapefruit'],
    drugEntities: ['atorvastatin', 'simvastatin', 'lovastatin', 'lipitor', 'zocor', 'amlodipine', 'felodipine', 'nifedipine', 'cyclosporine'],
    riskModifiers: ['Age >65 years', 'Pre-existing Hepatic/Renal Impairment', 'High Statin Dose (40-80mg)', 'Co-administration of Fibrates'],
    references: [
      { title: 'Grapefruit-medication interactions: Forbidden fruit or avoidable consequences?', source: 'Canadian Medical Association Journal (CMAJ)', year: '2013', url: 'https://www.cmaj.ca/content/185/4/309' },
      { title: 'FDA Consumer Updates: Grapefruit Juice and Some Drugs Don’t Mix', source: 'U.S. Food and Drug Administration (FDA)', year: '2021' },
      { title: 'Clinical Pharmacokinetics of Furanocoumarin-Mediated CYP3A4 Inactivation', source: 'Clinical Pharmacology & Therapeutics', year: '2018' }
    ]
  },
  {
    id: 'int-warfarin-vitk',
    title: 'Vitamin K Dark Greens & Warfarin (Coumadin) Coagulation Control',
    category: 'Food-Drug Interaction',
    severity: 'Moderate (Space 2-4 Hours)',
    actionBadge: 'Maintain Consistency',
    primaryItem: 'Dark Leafy Greens (Kale, Spinach, Collards, Natto, Brussels Sprouts)',
    interactingWith: 'Warfarin (Coumadin / Jantoven) Anticoagulant Therapy',
    mechanism: 'Warfarin inhibits Vitamin K Epoxide Reductase (VKORC1), preventing recycling of Vitamin K required for gamma-carboxylation of clotting factors II, VII, IX, and X. High dietary Vitamin K bypasses this competitive inhibition.',
    mechanismType: 'Pharmacodynamic Antagonism/Synergy',
    clinicalImpact: 'Sudden high intake of Vitamin K suppresses INR below 2.0 (subtherapeutic), causing massive risk of ischemic stroke, pulmonary embolism, or Deep Vein Thrombosis (DVT). Abrupt cessation causes INR overshoot (>4.5) with dangerous hemorrhagic bleeding.',
    actionableGuidance: 'Do NOT eliminate healthy greens! Maintain a STRICTLY CONSISTENT daily dietary intake of Vitamin K. This allows your medical provider to calibrate your steady-state Warfarin dosing accurately.',
    patientExplanation: 'Warfarin thins your blood by balancing Vitamin K. Eating a huge salad one day and zero greens the next day makes your blood thickness swing dangerously from clot-forming to internal bleeding. Keep your daily vegetable portions steady.',
    clinicalPharmacology: 'Competitive pharmacodynamic antagonism at VKORC1. Direct Oral Anticoagulants (DOACs: Apixaban, Rivaroxaban) do not interact with Vitamin K and are stable alternatives.',
    timingGuidance: '📏 Timing separation during the day does NOT matter. Maintain steady day-to-day total intake and report dietary shifts to your INR clinic.',
    evidenceLevel: 'High (Clinical Studies / FDA Label)',
    drugClass: 'Vitamin K Antagonists (Oral Anticoagulants)',
    foodCategory: 'Dark Leafy Vegetables',
    foodEntities: ['kale', 'spinach', 'collard greens', 'natto', 'swiss chard', 'broccoli', 'vitamin k'],
    drugEntities: ['warfarin', 'coumadin', 'jantoven', 'marevan'],
    riskModifiers: ['Recent Diet Changes / Cleanses', 'Antibiotic Therapy (reduces gut flora K2)', 'Active INR Instability', 'Alcohol Co-consumption'],
    references: [
      { title: 'Dietary Vitamin K and Stability of Oral Anticoagulation: A Systematic Review', source: 'Chest Journal / American College of Chest Physicians', year: '2020' },
      { title: 'Warfarin Package Insert & Prescribing Information', source: 'Bristol-Myers Squibb / FDA', year: '2022' }
    ]
  },
  {
    id: 'int-tyramine-maoi',
    title: 'Tyramine-Rich Aged Foods & MAOI Hypertensive Crisis',
    category: 'Food-Drug Interaction',
    severity: 'Severe (Contraindicated)',
    actionBadge: 'Avoid Combination',
    primaryItem: 'Aged Cheeses, Cured Meats (Salami/Prosciutto), Fermented Soy, Red Wine, Draft Beer',
    interactingWith: 'Monoamine Oxidase Inhibitors (MAOIs: Phenelzine, Tranylcypromine, Selegiline, Isocarboxazid)',
    mechanism: 'Tyramine is an indirect sympathomimetic amine normally oxidized and degraded in the gut wall by Monoamine Oxidase-A (MAO-A). MAOIs block MAO-A, allowing tyramine to enter systemic circulation and provoke massive vesicular norepinephrine discharge from adrenergic neurons.',
    mechanismType: 'Metabolism (CYP450 / Transporters)',
    clinicalImpact: 'Malignant Hypertensive Crisis (systolic blood pressure surging >220 mmHg), severe occipital headache, intracranial hemorrhage (hemorrhagic stroke), aortic dissection, and fatal myocardial infarction.',
    actionableGuidance: 'Strictly avoid all aged, fermented, cured, pickled, and spoiled foods while taking MAOIs and for at least 14 days following medication discontinuation. Fresh cheeses (mozzarella, ricotta, cream cheese) are safe.',
    patientExplanation: 'Aged foods contain a chemical called tyramine that is normally harmless. Because this antidepressant stops your body from destroying tyramine, eating aged cheese or cured meats can cause your blood pressure to spike to emergency, life-threatening levels.',
    clinicalPharmacology: 'Systemic adrenergic hyperstimulation via sympathomimetic amine accumulation. Emergency intervention: intravenous phentolamine or sublingual nifedipine.',
    timingGuidance: '🚫 Complete avoidance is necessary. Do not consume within 14 days before or after MAOI treatment.',
    evidenceLevel: 'High (Clinical Studies / FDA Label)',
    drugClass: 'Monoamine Oxidase Inhibitors (MAOIs)',
    foodCategory: 'Aged & Fermented Foods',
    foodEntities: ['aged cheese', 'cured meats', 'salami', 'prosciutto', 'soy sauce', 'miso', 'red wine', 'draft beer', 'tyramine'],
    drugEntities: ['phenelzine', 'nardil', 'tranylcypromine', 'parnate', 'selegiline', 'emsam', 'isocarboxazid'],
    riskModifiers: ['Pre-existing Essential Hypertension', 'Cerebrovascular Disease', 'Over-the-counter Sympathomimetics (Pseudoephedrine)'],
    references: [
      { title: 'The Maudsley Prescribing Guidelines in Psychiatry: Diet and MAOIs', source: 'Wiley-Blackwell', year: '2021' },
      { title: 'Dietary Restrictions with MAOIs: Clarifying the Evidence', source: 'Journal of Clinical Psychopharmacology', year: '2019' }
    ]
  },
  {
    id: 'int-calcium-antibiotics',
    title: 'Dairy & Calcium Chelation with Tetracyclines & Fluoroquinolones',
    category: 'Food-Drug Interaction',
    severity: 'Moderate (Space 2-4 Hours)',
    actionBadge: 'Separate Timing',
    primaryItem: 'Milk, Yogurt, Cheese, Calcium-Fortified Juices & Calcium Supplements',
    interactingWith: 'Tetracyclines (Doxycycline, Minocycline) & Fluoroquinolones (Ciprofloxacin, Levofloxacin)',
    mechanism: 'Multivalent cations (Ca²⁺, Mg²⁺, Al³⁺, Fe²⁺, Zn²⁺) form coordination coordinate covalent bonds with the keto-enol functional groups of antibiotics, creating insoluble non-absorbable chelate complexes in the gut lumen.',
    mechanismType: 'Absorption & Chelation',
    clinicalImpact: 'Reduces antibiotic bioavailability by 50% to 85%, dropping systemic circulating drug concentrations below Minimum Inhibitory Concentration (MIC) and precipitating clinical treatment failure of serious bacterial infections.',
    actionableGuidance: 'Take antibiotics at least 2 hours before or 4 to 6 hours after consuming milk, yogurt, calcium supplements, or antacids.',
    patientExplanation: 'Calcium in milk and yogurt acts like a magnet in your stomach, grabbing onto the antibiotic and turning it into an insoluble clump that passes through without entering your bloodstream. Your infection will not heal properly unless you space them apart.',
    clinicalPharmacology: 'Polyvalent cation-drug chelation in proximal small bowel. Doxycycline has slightly less chelation affinity than tetracycline hydrochloride but still warrants strict 2-hour spacing.',
    timingGuidance: '⏱ Separate timing strictly: take the antibiotic 2 hours before or 4–6 hours after any dairy product or calcium-containing food/pill.',
    evidenceLevel: 'High (Clinical Studies / FDA Label)',
    drugClass: 'Tetracycline & Fluoroquinolone Antimicrobials',
    foodCategory: 'Dairy & Calcium Fortified Foods',
    foodEntities: ['milk', 'yogurt', 'cheese', 'calcium', 'calcium carbonate', 'calcium citrate', 'fortified orange juice'],
    drugEntities: ['ciprofloxacin', 'cipro', 'doxycycline', 'vibramycin', 'levofloxacin', 'levaquin', 'tetracycline', 'minocycline'],
    riskModifiers: ['Severe Sepsis / Systemic Infections', 'Elderly Patients with Decreased Gastric Acidity', 'Co-intake of Mineral Supplements'],
    references: [
      { title: 'Effects of Food and Divalent Cations on Fluoroquinolone Bioavailability', source: 'Antimicrobial Agents and Chemotherapy', year: '2017' },
      { title: 'Drug-Nutrient Chelation Interactions: A Pharmacokinetic Overview', source: 'American Journal of Health-System Pharmacy', year: '2020' }
    ]
  },
  {
    id: 'int-potassium-acei',
    title: 'High-Potassium Foods / Salt Substitutes & ACE Inhibitors / ARBs',
    category: 'Food-Drug Interaction',
    severity: 'Severe (Contraindicated)',
    actionBadge: 'Avoid Combination',
    primaryItem: 'Potassium Salt Substitutes (NoSalt/Nu-Salt), Bananas, Avocados, Coconut Water',
    interactingWith: 'ACE Inhibitors (Lisinopril, Enalapril), ARBs (Losartan, Valsartan), Potassium-Sparing Diuretics (Spironolactone, Eplerenone)',
    mechanism: 'Inhibition of the Renin-Angiotensin-Aldosterone System (RAAS) blunts adrenal aldosterone synthesis, decreasing distal renal tubular potassium excretion. High dietary potassium intake or potassium chloride seasonings cause massive additive potassium accumulation.',
    mechanismType: 'Renal & Electrolyte Clearance',
    clinicalImpact: 'Life-threatening Hyperkalemia (serum K⁺ >5.5 to >6.5 mEq/L), electrocardiographic peaked T-waves, PR prolongation, flaccid neuromuscular paralysis, ventricular fibrillation, and sudden cardiac arrest.',
    actionableGuidance: 'Completely avoid potassium chloride salt substitutes (e.g. NoSalt/Nu-Salt). Moderate dietary potassium intake from high-potassium foods (bananas, avocados, dried apricots, coconut water) and monitor serum electrolytes routinely.',
    patientExplanation: 'Blood pressure medications like Lisinopril cause your kidneys to hold onto potassium. Using potassium-based salt substitutes or consuming excessive potassium supplements can raise your blood potassium to dangerous levels that can stop your heart.',
    clinicalPharmacology: 'Synergistic reduction of renal potassium clearance via decreased principal cell Na+/K+-ATPase and ROMK channel stimulation.',
    timingGuidance: '🚫 Avoid potassium chloride salt substitutes completely. Eat high-potassium whole fruits in steady, moderate single-serving portions.',
    evidenceLevel: 'High (Clinical Studies / FDA Label)',
    drugClass: 'RAAS Inhibitors (ACEIs, ARBs, MRAs)',
    foodCategory: 'High-Potassium Foods & Minerals',
    foodEntities: ['potassium', 'salt substitute', 'nosalt', 'nu-salt', 'bananas', 'avocados', 'coconut water', 'dried apricots'],
    drugEntities: ['lisinopril', 'zestril', 'enalapril', 'losartan', 'cozaar', 'valsartan', 'spironolactone', 'aldactone', 'eplerenone'],
    riskModifiers: ['Chronic Kidney Disease (eGFR <45 mL/min)', 'Diabetes Mellitus (Hyporeninemic Hypoaldosteronism)', 'Elderly Patients', 'Dehydration'],
    references: [
      { title: 'Hyperkalemia in Patients Receiving Renin-Angiotensin-Aldosterone System Inhibitors', source: 'New England Journal of Medicine (NEJM)', year: '2021' },
      { title: 'Potassium Salt Substitutes and Clinical Safety in Cardiac Patients', source: 'Circulation / AHA', year: '2022' }
    ]
  },
  {
    id: 'int-iron-levothyroxine',
    title: 'Iron / Calcium Supplements & Levothyroxine (Thyroid Hormone)',
    category: 'Food-Drug Interaction',
    severity: 'Moderate (Space 2-4 Hours)',
    actionBadge: 'Separate Timing',
    primaryItem: 'Iron Supplements (Ferrous Sulfate), Calcium Carbonate, Soy Protein & Espresso',
    interactingWith: 'Levothyroxine Sodium (Synthroid, Euthyrox, Tirosint)',
    mechanism: 'Inorganic ferrous ions (Fe²⁺) and calcium ions (Ca²⁺) bind directly to the synthetic L-thyroxine molecule in the acidic gastric and proximal duodenal lumen, creating an insoluble precipitate that cannot cross the enterocyte membrane.',
    mechanismType: 'Absorption & Chelation',
    clinicalImpact: 'Decreases Levothyroxine absorption by 40% to 60%, resulting in unmanaged hypothyroidism: surging Thyroid-Stimulating Hormone (TSH), severe lethargy, weight gain, depression, and cold intolerance.',
    actionableGuidance: 'Take Levothyroxine immediately upon waking on an empty stomach with a full glass of plain water, at least 30-60 minutes before breakfast. Space all iron, calcium supplements, antacids, and soy protein by AT LEAST 4 FULL HOURS.',
    patientExplanation: 'Thyroid pills require an empty stomach to be absorbed. Calcium pills, iron supplements, soy milk, and morning coffee stick to the thyroid hormone in your stomach, preventing your body from absorbing it and making your thyroid sluggish.',
    clinicalPharmacology: 'Physicochemical adsorption and precipitation. Tirosint (liquid/softgel) exhibits slightly lower vulnerability to pH changes but still requires separation.',
    timingGuidance: '⏱ Take Levothyroxine 30–60 min before breakfast with water; space iron/calcium supplements by 4 full hours.',
    evidenceLevel: 'High (Clinical Studies / FDA Label)',
    drugClass: 'Thyroid Replacement Hormones',
    foodCategory: 'Mineral Supplements & Soy',
    foodEntities: ['iron', 'ferrous sulfate', 'calcium carbonate', 'soy protein', 'soy milk', 'coffee', 'espresso'],
    drugEntities: ['levothyroxine', 'synthroid', 'euthyrox', 'tirosint', 'levoxyl', 'unithroid'],
    riskModifiers: ['Pregnancy (where thyroid requirement increases)', 'Atrophic Gastritis / PPI Co-therapy', 'Celiac Disease'],
    references: [
      { title: 'Guidelines for the Treatment of Hypothyroidism: Drug Interferences', source: 'American Thyroid Association (ATA)', year: '2019' },
      { title: 'Concurrent Levothyroxine and Calcium/Iron: Practical Management in Primary Care', source: 'Endocrine Practice', year: '2021' }
    ]
  },
  {
    id: 'int-stjohnswort-ssri',
    title: "St. John's Wort & SSRIs / Oral Contraceptives / Anticoagulants",
    category: 'Supplement-Drug Interaction',
    severity: 'Severe (Contraindicated)',
    actionBadge: 'Avoid Combination',
    primaryItem: "St. John's Wort (Hypericum perforatum) Herbal Tea, Capsules & Extracts",
    interactingWith: 'SSRIs (Sertraline, Fluoxetine), SNRIs, Oral Contraceptives (Birth Control), Cyclosporine, Warfarin',
    mechanism: 'Hyperforin potently activates the Pregnane X Receptor (PXR), inducing intestinal and hepatic CYP3A4, CYP2C9, and P-glycoprotein (ABCB1) efflux pumps. Concurrently, hypericin inhibits neuronal serotonin/dopamine/norepinephrine reuptake.',
    mechanismType: 'Metabolism (CYP450 / Transporters)',
    clinicalImpact: 'Fatal Serotonin Syndrome (hyperthermia, neuromuscular clonus, delirium, cardiovascular collapse) when combined with SSRIs; unplanned pregnancy via rapid clearance of ethinyl estradiol; acute organ transplant rejection via subtherapeutic cyclosporine levels.',
    actionableGuidance: "Do NOT take St. John's Wort herbal products if you take prescription antidepressants, birth control pills, blood thinners, immunosuppressants, or HIV medications.",
    patientExplanation: "St. John's Wort is a powerful herbal supplement that clears prescription medications out of your system at hyper-speed while simultaneously boosting serotonin. Taking it with antidepressants can trigger a toxic serotonin crisis, and taking it with birth control pills can cause contraceptive failure.",
    clinicalPharmacology: 'Dual pharmacology: potent PXR-mediated enzyme induction + monoamine reuptake inhibition.',
    timingGuidance: '🚫 Do NOT combine. Discontinue St. Johns Wort at least 14 days before starting prescription therapies.',
    evidenceLevel: 'High (Clinical Studies / FDA Label)',
    drugClass: 'Antidepressants, Hormonal Contraceptives & Immunosuppressants',
    foodCategory: 'Herbal Botanicals',
    foodEntities: ["st. john's wort", "st johns wort", 'hypericum perforatum', 'hyperforin'],
    drugEntities: ['sertraline', 'zoloft', 'fluoxetine', 'prozac', 'oral contraceptives', 'birth control', 'yaz', 'cyclosporine', 'warfarin'],
    riskModifiers: ['Polypharmacy with Serotonergic Agents (Triptans, Tramadol, Linezolid)', 'Transplant Recipients', 'Women on Oral Contraception'],
    references: [
      { title: "St John's wort: Interactions with medicines and clinical implications", source: 'British Medical Journal (BMJ)', year: '2020' },
      { title: 'Herbal Medicine and Drug Interactions: Evidence-Based Systematic Review', source: 'Lancet Psychiatry', year: '2019' }
    ]
  },
  {
    id: 'int-alcohol-acetaminophen',
    title: 'Alcohol & Acetaminophen (Paracetamol) / Metformin / Sedatives',
    category: 'Alcohol-Drug Interaction',
    severity: 'Severe (Contraindicated)',
    actionBadge: 'Avoid Combination',
    primaryItem: 'Alcoholic Beverages (Beer, Wine, Spirits, Cocktails)',
    interactingWith: 'Acetaminophen (Tylenol, Paracetamol), Metformin (Glucophage), Sedatives (Benzodiazepines, Zolpidem)',
    mechanism: 'Chronic ethanol consumption induces hepatic Cytochrome P450 2E1 (CYP2E1), which metabolizes acetaminophen into the highly toxic electrophile N-acetyl-p-benzoquinone imine (NAPQI), rapidly depleting hepatic glutathione pools. With metformin, ethanol inhibits hepatic lactate clearance.',
    mechanismType: 'Metabolism (CYP450 / Transporters)',
    clinicalImpact: 'Acute Fulminant Hepatic Failure (liver necrosis requiring emergency transplant) at normal therapeutic acetaminophen doses; severe Lactic Acidosis with metformin; fatal respiratory depression with sedatives.',
    actionableGuidance: 'Never consume alcohol with acetaminophen. Maintain strict 24-hour separation, limit acetaminophen to <2,000 mg/day, and avoid binge drinking on metformin.',
    patientExplanation: 'Drinking alcohol causes your liver to turn acetaminophen (Tylenol) into a toxic liver-damaging compound. Even standard doses of Tylenol taken after drinking can cause severe liver damage.',
    clinicalPharmacology: 'CYP2E1 induction with glutathione depletion. Antidote for acute overdose: N-acetylcysteine (NAC).',
    timingGuidance: '🚫 Do not consume alcohol during acute acetaminophen treatment or within 24 hours of binge intake.',
    evidenceLevel: 'High (Clinical Studies / FDA Label)',
    drugClass: 'Analgesics, Biguanides & CNS Depressants',
    foodCategory: 'Alcoholic Beverages',
    foodEntities: ['alcohol', 'beer', 'wine', 'spirits', 'whiskey', 'vodka', 'ethanol'],
    drugEntities: ['acetaminophen', 'paracetamol', 'tylenol', 'metformin', 'glucophage', 'alprazolam', 'xanax', 'diazepam', 'zolpidem'],
    riskModifiers: ['Chronic Alcoholism / Binge Drinking', 'Pre-existing Cirrhosis / NASH', 'Fasting / Malnutrition'],
    references: [
      { title: 'Acetaminophen Hepatotoxicity: Alcohol Interaction and Glutathione Depletion', source: 'Hepatology / AASLD', year: '2020' },
      { title: 'FDA Drug Safety Communication: Acetaminophen Prescription and Over-the-Counter Warnings', source: 'FDA', year: '2021' }
    ]
  },
  {
    id: 'int-licorice-digoxin',
    title: 'Natural Black Licorice & Digoxin / Loop Diuretics / Antihypertensives',
    category: 'Food-Drug Interaction',
    severity: 'Severe (Contraindicated)',
    actionBadge: 'Avoid Combination',
    primaryItem: 'Real Black Licorice Root, Glycyrrhizinic Acid Confections & Teas',
    interactingWith: 'Digoxin (Lanoxin), Loop Diuretics (Furosemide), Blood Pressure Medications',
    mechanism: 'Glycyrrhizin and its metabolite glycyrrhetinic acid inhibit 11-beta-hydroxysteroid dehydrogenase type 2 (11β-HSD2), preventing renal conversion of active cortisol to inactive cortisone. Cortisol floods mineralocorticoid receptors, triggering massive potassium wasting and sodium retention (apparent mineralocorticoid excess).',
    mechanismType: 'Renal & Electrolyte Clearance',
    clinicalImpact: 'Severe Hypokalemia (serum K⁺ <3.0 mEq/L), precipitating fatal Digoxin toxicity (ventricular tachycardia, heart block), severe hypertension, and peripheral edema.',
    actionableGuidance: 'Completely avoid natural black licorice containing real glycyrrhizin while taking Digoxin, diuretics, or blood pressure drugs. Deglycyrrhizinated licorice (DGL) is safe to use.',
    patientExplanation: 'Real black licorice contains a chemical that makes your kidneys flush out potassium and retain salt. When potassium drops, heart medications like Digoxin become dangerously toxic to the heart muscle.',
    clinicalPharmacology: 'Synergistic hypokalemic cardiac toxicity via 11β-HSD2 enzyme inhibition. DGL products have glycyrrhizin removed and do not carry this risk.',
    timingGuidance: '🚫 Avoid real black licorice completely. Check food labels for "licorice extract" or "glycyrrhizin".',
    evidenceLevel: 'High (Clinical Studies / FDA Label)',
    drugClass: 'Cardiac Glycosides & Antihypertensives',
    foodCategory: 'Herbal Botanicals',
    foodEntities: ['black licorice', 'licorice root', 'glycyrrhizin', 'licorice candy'],
    drugEntities: ['digoxin', 'lanoxin', 'furosemide', 'lasix', 'hydrochlorothiazide'],
    riskModifiers: ['Heart Failure Patients with Low Ejection Fraction', 'Baseline Hypokalemia', 'Elderly'],
    references: [
      { title: 'Licorice-Induced Hypokalemia and Cardiac Toxicity: Case Series & Review', source: 'American Journal of Medicine', year: '2020' },
      { title: 'FDA Warning: Black Licorice: Trick or Treat?', source: 'U.S. FDA', year: '2021' }
    ]
  },
  {
    id: 'int-greentea-nadolol',
    title: 'Green Tea (EGCG Catechins) & Beta-Blockers (Nadolol / Atenolol)',
    category: 'Food-Drug Interaction',
    severity: 'Moderate (Space 2-4 Hours)',
    actionBadge: 'Separate Timing',
    primaryItem: 'High-Concentration Green Tea, Matcha & EGCG Dietary Extracts',
    interactingWith: 'Nadolol (Corgard), Atenolol (Tenormin), Bortezomib (Velcade)',
    mechanism: 'Epigallocatechin gallate (EGCG) potently inhibits Organic Anion-Transporting Polypeptide 1A2 (OATP1A2) in the enterocyte apical brush border, blocking active influx and uptake of hydrophilic beta-blockers into systemic circulation.',
    mechanismType: 'Metabolism (CYP450 / Transporters)',
    clinicalImpact: 'Plummets circulating beta-blocker plasma concentrations (AUC) by up to 85%, causing breakthrough tachycardia, severe hypertension recurrence, and loss of angina/arrhythmia protection.',
    actionableGuidance: 'Avoid drinking concentrated green tea or taking green tea extract supplements within 4 hours of taking Nadolol or Atenolol.',
    patientExplanation: 'Green tea antioxidants block the cellular doorway in your intestines that allows beta-blocker blood pressure medicine to enter your blood. Drinking strong green tea alongside your pill can make the medicine almost completely ineffective.',
    clinicalPharmacology: 'Intestinal OATP1A2 uptake transporter inhibition. Lipophilic beta-blockers (e.g. Metoprolol, Carvedilol) do not rely on OATP1A2 and are largely unaffected.',
    timingGuidance: '⏱ Space green tea and matcha by at least 4 hours before or after taking Nadolol.',
    evidenceLevel: 'Moderate (Pharmacokinetic Trials)',
    drugClass: 'Hydrophilic Beta-Adrenergic Blockers',
    foodCategory: 'Tea & Catechin Polyphenols',
    foodEntities: ['green tea', 'matcha', 'egcg', 'green tea extract'],
    drugEntities: ['nadolol', 'corgard', 'atenolol', 'tenormin', 'bortezomib'],
    riskModifiers: ['Patients with Atrial Fibrillation / Angina', 'Consumption of Concentrated Matcha Powders'],
    references: [
      { title: 'Green Tea Ingestion Greatly Reduces Systemic Availability of Nadolol', source: 'Clinical Pharmacology & Therapeutics', year: '2014' },
      { title: 'Transporter-Mediated Food-Drug Interactions: OATP Influx Transporters', source: 'Pharmacological Reviews', year: '2019' }
    ]
  },
  {
    id: 'int-coffee-iron',
    title: 'Coffee & Black Tea Polyphenols vs Non-Heme Iron Absorption',
    category: 'Nutrient-Nutrient Interaction',
    severity: 'Moderate (Space 2-4 Hours)',
    actionBadge: 'Separate Timing',
    primaryItem: 'Coffee, Espresso, Black Tea, Dark Chocolate (Tannins & Chlorogenic Acid)',
    interactingWith: 'Oral Iron Supplements (Ferrous Sulfate), Plant-Based Non-Heme Iron (Lentils, Spinach, Beans)',
    mechanism: 'Polyphenols, tannins, and chlorogenic acids chelate non-heme ferric iron (Fe³⁺) in the duodenal lumen, forming large insoluble coordination complexes that cannot be transported across the apical enterocyte membrane via Divalent Metal Transporter 1 (DMT1).',
    mechanismType: 'Absorption & Chelation',
    clinicalImpact: 'Reduces non-heme iron absorption from a meal or supplement by 60% to 90%, precipitating or perpetuating microcytic hypochromic iron-deficiency anemia.',
    actionableGuidance: 'Enjoy coffee, espresso, and tea at least 1 hour before or 2 hours after iron-rich meals or iron supplements. Co-consume Vitamin C (Ascorbic Acid) to reduce ferric iron back to bioavailable ferrous iron.',
    patientExplanation: 'Tannins in coffee and tea bond tightly with iron in your stomach, preventing your body from absorbing it. If you have low iron or anemia, wait 1 to 2 hours after your iron pill or meal before drinking coffee.',
    clinicalPharmacology: 'Gastric complexation with phenolic hydroxyl groups. Vitamin C (100–250mg) overcomes this inhibition by reducing Fe³⁺ to Fe²⁺.',
    timingGuidance: '⏱ Drink coffee/tea at least 1 hour before or 2 hours after iron-rich meals or iron tablets.',
    evidenceLevel: 'High (Clinical Studies / FDA Label)',
    drugClass: 'Hematopoietic Mineral Formulations',
    foodCategory: 'Caffeine & Polyphenol Beverages',
    foodEntities: ['coffee', 'espresso', 'black tea', 'tea', 'dark chocolate', 'tannins'],
    drugEntities: ['iron', 'ferrous sulfate', 'ferrous gluconate', 'iron tablets'],
    riskModifiers: ['Pregnant Women', 'Menstruating Females with Heavy Bleeding', 'Strict Vegans/Vegetarians'],
    references: [
      { title: 'Inhibition of Food Iron Absorption by Coffee and Tea Polyphenols', source: 'American Journal of Clinical Nutrition (AJCN)', year: '2018' },
      { title: 'Iron Deficiency Anemia: Assessment, Prevention, and Clinical Guidance', source: 'World Health Organization (WHO)', year: '2020' }
    ]
  },
  {
    id: 'int-fiber-drugs',
    title: 'High-Soluble Fiber (Psyllium / Flax) & Delayed Drug Bioavailability',
    category: 'Food-Drug Interaction',
    severity: 'Moderate (Space 2-4 Hours)',
    actionBadge: 'Separate Timing',
    primaryItem: 'Psyllium Husk (Metamucil), Chia Seeds, Flaxseed Gel, High-Fiber Supplements',
    interactingWith: 'Metformin (Glucophage), Digoxin, Carbamazepine, Tricyclic Antidepressants',
    mechanism: 'High-viscosity mucilaginous soluble fiber forms a dense hydrophilic hydrogel matrix in the stomach and upper small intestine, trapping pharmaceutical drug molecules and significantly slowing gastrointestinal transit and mucosal diffusion.',
    mechanismType: 'Gastrointestinal & Motility',
    clinicalImpact: 'Significantly delays time to maximum concentration (Tmax) and lowers peak serum concentration (Cmax), causing erratic blood sugar spikes in diabetics or subtherapeutic anticonvulsant levels.',
    actionableGuidance: 'Take psyllium husk, bulk fiber laxatives, and high-fiber supplements at least 2 hours before or 2 to 3 hours after oral prescription medications.',
    patientExplanation: 'Soluble fiber forms a thick gel in your stomach. While great for digestion, it can trap your prescription pills inside the gel, delaying or reducing the amount of medication your body absorbs.',
    clinicalPharmacology: 'Hydrogel matrix entrapment and increased unstirred water layer resistance in the intestinal lumen.',
    timingGuidance: '⏱ Take bulk fiber supplements 2 hours before or 2–3 hours after prescription drugs.',
    evidenceLevel: 'Moderate (Pharmacokinetic Trials)',
    drugClass: 'Oral Hypoglycemics, Antiarrhythmics & Anticonvulsants',
    foodCategory: 'Fiber Supplements',
    foodEntities: ['psyllium husk', 'metamucil', 'flaxseed', 'chia seeds', 'soluble fiber'],
    drugEntities: ['metformin', 'glucophage', 'digoxin', 'carbamazepine', 'tegretol', 'amitriptyline'],
    riskModifiers: ['Diabetic Patients on Tight Glycemic Targets', 'Patients with Delayed Gastric Emptying (Gastroparesis)'],
    references: [
      { title: 'The Effect of Soluble Dietary Fiber on Drug Bioavailability: A Review', source: 'Clinical Pharmacokinetics', year: '2019' },
      { title: 'Psyllium Hydrophilic Mucilloid Drug Interactions Overview', source: 'Lexicomp Clinical Drug Reference', year: '2022' }
    ]
  }
];


// ==========================================
// 9. DIETARY GUIDELINES & MACRO STANDARDS
// ==========================================
export const DIETARY_GUIDELINES_DATA: DietaryGuideline[] = [
  {
    id: 'guide-who',
    authority: 'World Health Organization (WHO) & Dietary Guidelines for Americans (DGA)',
    targetGroup: 'General Adult Population (Ages 18-65)',
    dailyCaloricTarget: '2,000 kcal (Females average) / 2,500 kcal (Males average)',
    macroDistribution: {
      protein: '10% - 35% of total energy (0.8 - 1.2g/kg)',
      carbs: '45% - 65% of total energy (predominantly unrefined whole grains and fiber)',
      fats: '20% - 35% of total energy (emphasis on MUFAs and Omega-3 PUFAs)',
      fiber: 'Minimum 14g per 1,000 kcal consumed (28g - 38g daily)'
    },
    sodiumLimit: '<2,000 mg/day (WHO) / <2,300 mg/day (DGA) (approx 1 teaspoon of table salt)',
    addedSugarLimit: '<10% of total calories (ideally <5% / <25g per day for additional health perks)',
    saturatedFatLimit: '<10% of total daily energy (<7% for high cardiovascular risk individuals)',
    coreRecommendations: [
      'Fill half your plate (50%) with colorful non-starchy vegetables and fruits at every meal.',
      'Make at least half (50%+) of all consumed grains intact 100% whole grains.',
      'Vary protein routine: incorporate fish, legumes, seeds, and lean poultry; limit red meat and avoid processed meats.',
      'Choose water, herbal infusions, or unsweetened coffee/tea over sugar-sweetened beverages.'
    ],
    foodGroupServings: [
      { group: 'Vegetables', dailyServings: '2.5 - 3.5 cup equivalents', examples: 'Dark leafy greens, cruciferous broccoli, peppers, carrots' },
      { group: 'Fruits', dailyServings: '1.5 - 2 cup equivalents', examples: 'Berries, apples, citrus, whole fresh fruits' },
      { group: 'Whole Grains', dailyServings: '3 - 4 ounce equivalents', examples: 'Quinoa, brown rice, steel-cut oats, whole wheat' },
      { group: 'Protein Foods', dailyServings: '5.5 - 6.5 ounce equivalents', examples: 'Fatty fish, lentils, eggs, poultry, tofu, nuts' },
      { group: 'Healthy Oils', dailyServings: '27 grams (approx 2 tbsp)', examples: 'Extra virgin olive oil, avocado oil' }
    ]
  }
];

// ==========================================
// 10. DEFICIENCY DISEASES
// ==========================================
export const DEFICIENCY_DISEASES_DATA: DeficiencyDisease[] = [
  {
    id: 'def-scurvy',
    name: 'Scurvy (Severe Vitamin C Deficiency)',
    deficientNutrient: 'Vitamin C (L-Ascorbic Acid)',
    clinicalDescription: 'A clinical syndrome resulting from chronic failure of collagen triple-helix hydroxylation, causing widespread capillary fragility, connective tissue breakdown, and defective osteoid formation.',
    icdCode: 'E54',
    highRiskPopulations: ['Isolated elderly with "tea and toast" diets', 'Severe psychiatric eating disorders', 'Chronic alcohol dependence', 'Infants fed boiled evaporated cow milk'],
    earlySigns: ['Lethargy, malaise, and loss of appetite', 'Myalgia and arthralgia', 'Mild irritability and tachypnea'],
    advancedSymptoms: [
      'Perifollicular hyperkeratosis with corkscrew coiled hairs',
      'Extensive perifollicular petechiae and ecchymoses on lower extremities',
      'Spongy, swollen, bleeding gingiva (gums) and loose teeth',
      'Subperiosteal hematomas causing excruciating bone pain',
      'Reopening of previously healed surgical scars and non-healing ulcers'
    ],
    longTermComplications: ['Spontaneous retroperitoneal hemorrhage', 'Hemopericardium and cardiac failure', 'Secondary fatal bacterial sepsis'],
    diagnosticLaboratoryTests: ['Serum ascorbic acid level < 0.2 mg/dL (11 µmol/L)', 'Leukocyte ascorbic acid level (accurate tissue reserve test)', 'Radiography showing Pelkan spurs and Wimberger ring in pediatric long bones'],
    therapeuticDietProtocol: {
      foodGroup: 'Vitamin C Rich Foods',
      recommendations: [
        'Oral Vitamin C supplementation: 100-300 mg daily for children; 500-1,000 mg daily for adults for 1-2 weeks, then 100 mg/day.',
        'Immediate dietary integration of bell peppers, guavas, oranges, strawberries, kiwi, and steamed broccoli.'
      ]
    },
    recoveryTimeline: 'Dramatic clinical reversal: lethargy and gum bleeding improve in 24-48 hours; subcutaneous ecchymosis resolves in 1-2 weeks; bone pain resolves in 2-3 weeks.'
  },
  {
    id: 'def-rickets',
    name: 'Rickets & Osteomalacia (Vitamin D / Calcium Deficiency)',
    deficientNutrient: 'Vitamin D (Calcitriol) & Calcium',
    clinicalDescription: 'Defective mineralization of growing growth plates in children (Rickets) or unmineralized osteoid accumulation in mature remodeled adult bone (Osteomalacia).',
    icdCode: 'E55.0 / M83.9',
    highRiskPopulations: ['Exclusively breastfed infants without Vitamin D drops', 'Darkly pigmented skin living at high latitudes', 'Institutionalized elderly without sunlight exposure', 'Severe malabsorption (Celiac disease, Crohn disease, Gastric bypass)'],
    earlySigns: ['Restlessness, delayed motor milestones, hypotonia', 'Diffuse dull aching bone pain in lower spine, pelvis, and legs', 'Muscle weakness causing difficulty climbing stairs or standing from a chair'],
    advancedSymptoms: [
      'Craniotabes (soft skull bones resembling ping-pong balls)',
      'Rachitic Rosary (beading swelling at costochondral junctions)',
      'Harrison sulcus groove along lower ribs',
      'Genu varum (bowlegs) or Genu valgum (knock-knees) upon weight-bearing',
      'Pseudofractures (Looser zones) on pelvic and femoral radiographs'
    ],
    longTermComplications: ['Permanent skeletal deformities and dwarfism', 'Pelvic inlet distortion causing obstructed labor in adult females', 'Hypocalcemic seizures and tetany'],
    diagnosticLaboratoryTests: ['Serum 25-Hydroxyvitamin D [25(OH)D] < 12 ng/mL (severe deficiency)', 'Markedly elevated serum Alkaline Phosphatase (ALP)', 'Elevated Parathyroid Hormone (Secondary Hyperparathyroidism)', 'Wrist/Knee radiographs showing cupping, fraying, and splaying of metaphysis'],
    therapeuticDietProtocol: {
      foodGroup: 'Vitamin D & Calcium Rich Foods',
      recommendations: [
        'Ergocalciferol or Cholecalciferol 50,000 IU weekly for 6-8 weeks, followed by 1,000-2,000 IU daily maintenance.',
        'Elemental Calcium 1,000 mg/day (via dairy, fortified milk, or calcium citrate tablets).',
        'Daily safe sunlight exposure (15-20 mins mid-day on arms and legs).'
      ]
    },
    recoveryTimeline: 'Biochemical normalization of ALP and PTH in 6-12 weeks; radiographic metaphyseal healing visible within 3 months; skeletal deformities may require orthotic bracing.'
  },
  {
    id: 'def-anemia-iron',
    name: 'Iron-Deficiency Anemia (Microcytic Hypochromic)',
    deficientNutrient: 'Elemental Iron (Fe)',
    clinicalDescription: 'Depletion of total body iron stores preventing adequate hemoglobin synthesis, leading to small, pale red blood cells and tissue hypoxia.',
    icdCode: 'D50.9',
    highRiskPopulations: ['Menstruating females with menorrhagia', 'Pregnant women', 'Infants and toddlers fed cow milk >24 oz/day', 'Adults over 50 with occult GI bleeding (Colorectal polyp/cancer, Peptic ulcer)'],
    earlySigns: ['Chronic fatigue, exertional dyspnea, and reduced exercise tolerance', 'Headaches, dizziness, cold hands and feet', 'Difficulty concentrating and irritability'],
    advancedSymptoms: [
      'Marked pallor of palpebral conjunctiva, tongue, and nail beds',
      'Koilonychia (concave spooning of fingernails)',
      'Angular cheilitis (painful fissures at lip corners) and atrophic glossitis',
      'Pica (intense cravings for ice [pagophagia], clay, or raw starch)',
      'Tachycardia, wide pulse pressure, and systolic hemic flow murmur'
    ],
    longTermComplications: ['High-output congestive heart failure', 'Premature labor and low birth weight in pregnancy', 'Impaired neurocognitive development in children'],
    diagnosticLaboratoryTests: ['Serum Ferritin < 15 ng/mL (most specific single marker of depleted stores)', 'Complete Blood Count: Hemoglobin <12 g/dL (F) or <13 g/dL (M); MCV < 80 fL (Microcytosis); MCH < 27 pg', 'Elevated Total Iron Binding Capacity (TIBC) and Transferrin Saturation < 15%'],
    therapeuticDietProtocol: {
      foodGroup: 'Heme & Non-Heme Iron Foods',
      recommendations: [
        'Oral Ferrous Sulfate / Fumarate / Bisglycinate (60-100 mg elemental iron on alternate days with Vitamin C).',
        'Incorporate heme iron (lean red meat, oysters, sardines) and non-heme iron (lentils, spinach, quinoa).',
        'Avoid drinking black tea, coffee, or milk within 2 hours of meals.'
      ]
    },
    recoveryTimeline: 'Reticulocytosis peaks at 7-10 days; Hemoglobin increases by 1-2 g/dL every 3-4 weeks; Ferritin stores repletion requires 3-6 months of continuous therapy.'
  },
  {
    id: 'def-beriberi',
    name: 'Beriberi & Wernicke-Korsakoff (Thiamine B1 Deficiency)',
    deficientNutrient: 'Vitamin B1 (Thiamine Pyrophosphate)',
    clinicalDescription: 'Impairment of pyruvate dehydrogenase and alpha-ketoglutarate dehydrogenase enzymes in the Krebs cycle, causing ATP failure and lactic acidosis in energy-hungry neural and cardiac tissues.',
    icdCode: 'E51.1 / E51.2',
    highRiskPopulations: ['Severe chronic alcohol use disorder', 'Populations consuming exclusively polished white rice', 'Hyperemesis gravidarum in pregnancy', 'Bariatric surgery patients'],
    earlySigns: ['Anorexia, weight loss, and general muscle weakness', 'Distal extremity numbness and heaviness in legs', 'Emotional lability and mental confusion'],
    advancedSymptoms: [
      'Wet Beriberi: High-output biventricular heart failure, tachycardia, orthopnea, and severe pitting peripheral edema.',
      'Dry Beriberi: Symmetric peripheral sensorimotor neuropathy, loss of ankle reflexes, wrist/foot drop.',
      'Wernicke Encephalopathy Triad: Acute mental confusion, Ophthalmoplegia (nystagmus / abducens nerve palsy), and Gait Ataxia.',
      'Korsakoff Syndrome: Irreversible anterograde amnesia and confabulation.'
    ],
    longTermComplications: ['Irreversible dementia and permanent memory loss', 'Fatal cardiovascular collapse in fulminant Shoshin beriberi'],
    diagnosticLaboratoryTests: ['Erythrocyte Transketolase Activity Coefficient (ETKAC) showing >25% activation after TPP addition', 'Whole blood Thiamine Diphosphate (TDP) assay', 'Elevated blood pyruvate and lactic acid levels'],
    therapeuticDietProtocol: {
      foodGroup: 'Thiamine Rich Whole Foods',
      recommendations: [
        'Emergency intravenous/intramuscular Thiamine (200-500 mg IV TID for Wernicke encephalopathy BEFORE administering glucose!).',
        'Daily dietary consumption of whole grains, fortified nutritional yeast, pork, sunflower seeds, and legumes.'
      ]
    },
    recoveryTimeline: 'Cardiac edema and ocular nystagmus resolve within 24-48 hours of IV thiamine; peripheral neuropathy improves over months; Korsakoff amnesia is frequently permanent.'
  },
  {
    id: 'def-pellagra',
    name: 'Pellagra (Niacin Vitamin B3 Deficiency)',
    deficientNutrient: 'Vitamin B3 (Niacin / Nicotinic Acid / Tryptophan)',
    clinicalDescription: 'Failure of NAD and NADP coenzyme synthesis, resulting in cellular energy crisis and DNA repair failure characterized by the classic "4 Ds": Dermatitis, Diarrhea, Dementia, and Death.',
    icdCode: 'E52',
    highRiskPopulations: ['Populations consuming un-nixtamalized corn/maize as main staple', 'Chronic alcohol misuse', 'Carcinoid syndrome (tryptophan diverted to serotonin)', 'Hartnup disease (tryptophan malabsorption)'],
    earlySigns: ['Glossitis with fiery red tongue', 'Nausea, epigastric discomfort, and intermittent diarrhea', 'Insomnia, apathy, and mild depression'],
    advancedSymptoms: [
      'Photosensitive Dermatitis: Symmetrical hyperpigmented, scaly rash on sun-exposed skin resembling severe sunburn ("Casal Necklace" around neck).',
      'Gastrointestinal: Watery, intractable diarrhea with achlorhydria and malabsorption.',
      'Neurological: Tremors, peripheral neuropathy, hallucinations, severe confusion, and dementia.'
    ],
    longTermComplications: ['Intractable stupor, coma, and death if untreated'],
    diagnosticLaboratoryTests: ['Urinary N-methylnicotinamide < 0.8 mg/day', 'Plasma NAD/NADP ratio', 'Rapid clinical improvement upon therapeutic Niacin administration'],
    therapeuticDietProtocol: {
      foodGroup: 'Niacin & Tryptophan Rich Foods',
      recommendations: [
        'Nicotinamide (Niacinamide) 100-300 mg/day orally in divided doses (preferred over nicotinic acid to prevent flushing).',
        'Incorporate poultry, wild salmon, peanuts, eggs, milk, and nixtamalized corn (treated with lime/calcium hydroxide).'
      ]
    },
    recoveryTimeline: 'Appetite and diarrhea improve within 24-48 hours; skin lesions fade and heal within 1-2 weeks; mental confusion clears rapidly.'
  }
];

// ==========================================
// 11. TOXICITY & EXTRA EATING DISEASES
// ==========================================
export const TOXICITY_DISEASES_DATA: ToxicityDisease[] = [
  {
    id: 'tox-vit-a',
    name: 'Hypervitaminosis A (Vitamin A Toxicity)',
    excessNutrientOrAgent: 'Preformed Vitamin A (Retinol / Retinoids in high-dose supplements or liver)',
    pathophysiology: 'When liver stellar cell storage capacity for retinyl esters is saturated, unbound retinol circulates bound to lipoproteins, causing direct cell membrane disruption, lysosomal labilization, and cranial hypertension.',
    triggerFactors: ['Excessive dietary intake of polar bear / seal / beef liver', 'High-dose retinoid medications (Isotretinoin, Acitretin)', 'Mega-dose dietary supplements (>10,000 IU daily for months)'],
    toxicThreshold: 'Chronic intake >3,000 µg RAE (10,000 IU)/day in adults; Acute single dose >100,000 µg (300,000 IU).',
    acuteSymptoms: ['Severe nausea, projectile vomiting, intense headache (Pseudotumor cerebri)', 'Vertigo, blurred vision, and drowsiness', 'Extensive desquamation (peeling) of skin over palms and face within 24-48 hours'],
    chronicManifestations: [
      'Dry, pruritic, cracking skin and chapped lips (Cheilitis)',
      'Diffuse alopecia (hair loss) and brittle nails',
      'Hepatomegaly, hepatic fibrosis, and portal hypertension',
      'Cortical bone hyperostosis, bone demineralization, and increased hip fracture risk',
      'Severe Teratogenicity: Craniofacial, cardiac, and thymic malformations in fetuses of pregnant mothers'
    ],
    targetOrgansAffected: ['Liver', 'Brain / Central Nervous System', 'Skeletal Bones', 'Skin & Hair', 'Developing Fetus'],
    diagnosticWorkup: ['Serum Retinol > 100 µg/dL (3.5 µmol/L)', 'Elevated Serum Retinyl Esters (>10% of total circulating vitamin A)', 'Elevated liver enzymes (AST, ALT) and hypercalcemia', 'Head CT/MRI ruling out intracranial mass lesions in papilledema'],
    clinicalManagement: ['Immediate cessation of all Vitamin A supplements and retinoid medications', 'Supportive hydration, antiemetics, and liver function monitoring', 'Prognosis is excellent after withdrawal, though bone and liver changes may take months to resolve'],
    preventiveDietaryCaps: 'Do not exceed Upper Limit of 3,000 µg RAE (10,000 IU) preformed retinol per day. (Beta-carotene from carrots/spinach does not cause toxicity).'
  },
  {
    id: 'tox-vit-d',
    name: 'Hypervitaminosis D & Severe Hypercalcemia',
    excessNutrientOrAgent: 'High-Dose Supplemental Vitamin D3 (Cholecalciferol) / D2 (Ergocalciferol)',
    pathophysiology: 'Massive circulating 25(OH)D displaces 1,25(OH)2D from vitamin D-binding protein (DBP), directly binding VDR receptors and driving excessive intestinal calcium absorption and bone resorption, overriding parathyroid feedback.',
    triggerFactors: ['Mega-dose Vitamin D supplementation (>10,000 - 50,000 IU/day for months)', 'Manufacturing dosing errors in unregulated supplements', 'Granulomatous disorders (Sarcoidosis) with uncontrolled 1-alpha-hydroxylase activity'],
    toxicThreshold: 'Serum 25(OH)D > 150 ng/mL (375 nmol/L); chronic daily intake >10,000 IU.',
    acuteSymptoms: [
      'Severe nausea, recurrent vomiting, and profound anorexia',
      'Polyuria (excessive urination) and Polydipsia (extreme thirst)',
      'Dehydration, muscular weakness, and lethargy',
      'Shortened QT interval and cardiac arrhythmias on ECG'
    ],
    chronicManifestations: [
      'Nephrocalcinosis: Extensive calcium phosphate deposition in renal parenchyma leading to chronic renal failure',
      'Nephrolithiasis (Recurrent calcium oxalate/phosphate kidney stones)',
      'Extensive metastatic vascular calcification in aorta, coronary arteries, and heart valves',
      'Psychiatric disturbances: Severe confusion, depression, psychosis, and coma'
    ],
    targetOrgansAffected: ['Kidneys (Nephrocalcinosis / Renal Failure)', 'Heart & Blood Vessels', 'Gastrointestinal Tract', 'Brain'],
    diagnosticWorkup: ['Serum 25-Hydroxyvitamin D [25(OH)D] > 150 ng/mL', 'Marked Hypercalcemia (Total Calcium > 11.5 mg/dL; Ionized Calcium elevated)', 'Suppressed Parathyroid Hormone (PTH < 10 pg/mL)', 'Hypercalciuria and elevated serum Creatinine / BUN'],
    clinicalManagement: [
      'Immediate discontinuation of all Vitamin D and Calcium supplements.',
      'Aggressive intravenous normal saline (0.9% NaCl) hydration to promote renal calcium excretion.',
      'Loop diuretics (Furosemide) after volume resuscitation.',
      'Intravenous Bisphosphonates (Zoledronic acid) or Calcitonin to arrest osteoclastic bone resorption; Corticosteroids for granulomatous disease.'
    ],
    preventiveDietaryCaps: 'Adhere strictly to the established safe Upper Tolerable Limit of 4,000 IU/day for adults.'
  },
  {
    id: 'tox-hemochromatosis',
    name: 'Hemochromatosis & Chronic Iron Overload',
    excessNutrientOrAgent: 'Elemental Iron (Fe) accumulation in parenchymal tissues',
    pathophysiology: 'Mutations in the HFE gene (C282Y/H63D) impair Hepcidin production. Unregulated ferroportin continuously absorbs dietary iron, exceeding transferrin binding capacity and generating toxic non-transferrin-bound iron (NTBI) and hydroxyl free radicals via the Fenton reaction.',
    triggerFactors: ['Hereditary HFE gene homozygosity', 'Chronic excessive iron supplementation', 'Repeated blood transfusions (Secondary hemosiderosis in thalassemia)'],
    toxicThreshold: 'Transferrin Saturation > 50-60%; Serum Ferritin > 1,000 ng/mL with parenchymal organ damage.',
    acuteSymptoms: ['Chronic lethargy and severe fatigue', 'Diffuse arthralgia (particularly in 2nd and 3rd metacarpophalangeal joints)', 'Abdominal right upper quadrant discomfort'],
    chronicManifestations: [
      'Hepatic: Hepatomegaly, micronodular cirrhosis, and a 20-fold increased risk of Hepatocellular Carcinoma (liver cancer).',
      'Endocrine: Pancreatic islet beta-cell destruction causing "Bronze Diabetes", hypogonadism, and erectile dysfunction.',
      'Cardiovascular: Dilated cardiomyopathy, congestive heart failure, and refractory atrial/ventricular arrhythmias.',
      'Dermatological: Slate-grey or bronze hyperpigmentation of skin.'
    ],
    targetOrgansAffected: ['Liver (Cirrhosis & Cancer)', 'Pancreas (Diabetes)', 'Heart (Cardiomyopathy)', 'Pituitary & Gonads', 'Joints (Arthropathy)'],
    diagnosticWorkup: [
      'Fasting Transferrin Saturation > 45-50%',
      'Serum Ferritin > 300 ng/mL in males or > 200 ng/mL in females (often >1000 ng/mL)',
      'HFE genetic testing (C282Y / H63D mutation analysis)',
      'T2* MRI of Liver and Heart (quantifies exact organ iron concentration non-invasively)'
    ],
    clinicalManagement: [
      'Therapeutic Phlebotomy: Weekly removal of 500 mL of blood (approx 250 mg elemental iron) until ferritin reaches 50-100 ng/mL.',
      'Iron Chelators (Deferasirox, Deferoxamine) if phlebotomy is contraindicated (e.g. severe anemia).',
      'Dietary: Strictly avoid iron supplements, raw seafood (Vibrio vulnificus sepsis risk), and alcohol.'
    ],
    preventiveDietaryCaps: 'Do not take iron-containing multivitamins unless diagnosed with verified iron deficiency by a physician.'
  },
  {
    id: 'tox-fructose-nafld',
    name: 'Non-Alcoholic Fatty Liver Disease & Fructose Toxicity',
    excessNutrientOrAgent: 'Excess Refined Fructose, High-Fructose Corn Syrup (HFCS) & Chronic Hypercaloric Intake',
    pathophysiology: 'Unlike glucose, fructose is metabolized exclusively in the liver via Fructokinase with zero feedback inhibition. Rapid ATP depletion drives intracellular uric acid synthesis, mitochondrial oxidative stress, and rapid De Novo Lipogenesis (DNL), accumulating triglycerides in hepatocytes.',
    triggerFactors: ['Daily consumption of sugar-sweetened sodas, sweetened teas, and commercial bakery goods', 'Sedentary lifestyle and ultra-processed food reliance', 'Metabolic syndrome and abdominal visceral obesity'],
    toxicThreshold: 'Consumption of added sugars >50-100g/day, particularly liquid fructose without fiber.',
    acuteSymptoms: ['Postprandial reactive hypoglycemia and food cravings', 'Chronic sluggishness and daytime somnolence', 'Mild dull ache in right upper abdomen'],
    chronicManifestations: [
      'Hepatic Steatosis (Fatty Liver): >5% triglyceride accumulation in hepatocytes.',
      'Non-Alcoholic Steatohepatitis (NASH / MASH): Hepatocyte ballooning, lobular inflammation, and progressive perisinusoidal fibrosis.',
      'Hepatic Cirrhosis, portal hypertension, and liver failure.',
      'Atherogenic Dyslipidemia: Elevated Triglycerides, high small-dense LDL (sdLDL), and low protective HDL.'
    ],
    targetOrgansAffected: ['Liver (Steatohepatitis & Cirrhosis)', 'Cardiovascular System', 'Pancreas (Insulin Resistance)', 'Kidneys (Hyperuricemia)'],
    diagnosticWorkup: [
      'Abdominal Ultrasound or FibroScan (Transient Elastography) showing hepatic steatosis and liver stiffness',
      'Elevated ALT and AST (often ALT > AST in early steatosis)',
      'Elevated Fasting Triglycerides (>150 mg/dL) and elevated Fasting Insulin / HOMA-IR score',
      'Elevated Serum Uric Acid'
    ],
    clinicalManagement: [
      'Complete elimination of sugar-sweetened beverages and high-fructose corn syrup.',
      'Transition to Mediterranean whole-food diet rich in fiber, olive oil, and omega-3s.',
      'Sustained 7-10% body weight reduction (proven to reverse steatohepatitis and early fibrosis).',
      '150-300 minutes of weekly moderate-intensity aerobic and resistance exercise.'
    ],
    preventiveDietaryCaps: 'Limit added refined sugars to <25g/day (WHO recommended target).'
  },
  {
    id: 'tox-sodium-hypertension',
    name: 'Sodium-Induced Hypertension & Vascular Remodeling',
    excessNutrientOrAgent: 'Excess Dietary Sodium Chloride (NaCl > 5,000 mg/day)',
    pathophysiology: 'Excess sodium expands extracellular fluid volume, triggers systemic arterial vasoconstriction via sympathetic activation and asymmetric dimethylarginine (ADMA), suppresses endothelial nitric oxide synthase, and induces vascular smooth muscle cell hypertrophy.',
    triggerFactors: ['High consumption of canned soups, commercial processed meats, fast food, salted snacks, and restaurant meals', 'Low potassium intake (<2,000 mg/day) exacerbating sodium sensitivity', 'Chronic kidney disease and advancing age'],
    toxicThreshold: 'Daily sodium intake > 2,300 - 5,000 mg/day (equivalent to >6-12g of table salt).',
    acuteSymptoms: ['Fluid retention, ankle and facial puffiness', 'Morning occipital headaches', 'Transient blood pressure spikes'],
    chronicManifestations: [
      'Primary Essential Hypertension (Systolic BP ≥ 130-140 mmHg)',
      'Left Ventricular Hypertrophy (LVH) and diastolic heart failure',
      'Accelerated atherosclerosis, increased risk of Ischemic Stroke and Hemorrhagic Stroke',
      'Hypertensive Nephrosclerosis leading to chronic proteinuria and renal failure',
      'Hypercalciuria leading to secondary osteoporosis and calcium kidney stones'
    ],
    targetOrgansAffected: ['Blood Vessels & Arteries', 'Heart (LVH & Failure)', 'Brain (Stroke)', 'Kidneys (Nephrosclerosis)'],
    diagnosticWorkup: [
      '24-Hour Ambulatory Blood Pressure Monitoring (ABPM)',
      '24-Hour Urinary Sodium Excretion test',
      'Echocardiogram assessing Left Ventricular Mass Index and diastolic filling',
      'Serum Creatinine, eGFR, and Urine Albumin-to-Creatinine Ratio (UACR)'
    ],
    clinicalManagement: [
      'Adoption of the DASH (Dietary Approaches to Stop Hypertension) Diet.',
      'Strict sodium reduction to <1,500 - 2,000 mg/day.',
      'Increase dietary Potassium to 3,500 - 4,700 mg/day (via avocados, potatoes, spinach, coconut water) to promote renal natriuresis.',
      'Regular cardiovascular exercise and stress management.'
    ],
    preventiveDietaryCaps: 'Stay below 2,000 mg sodium per day (WHO standard).'
  }
];
