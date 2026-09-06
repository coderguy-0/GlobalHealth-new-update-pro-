import { 
  AIMealItem, 
  AIMealCategory, 
  AIMealPlannerPreferences, 
  AIDayPlan, 
  AIFullMealPlan, 
  AIShoppingCategory,
  AIMealIngredient
} from '../types';

export const AI_MEAL_DATABASE: AIMealItem[] = [
  // ==========================================
  // BREAKFASTS
  // ==========================================
  {
    id: 'bf-1',
    category: 'breakfast',
    name: 'Greek Yogurt Parfait with Walnuts & Forest Berries',
    description: 'Creamy probiotic strained yogurt layered with wild blueberries, crushed raw walnuts, chia seeds, and a touch of raw clover honey.',
    portionSize: '1 large bowl (320g) + 1 glass water with lemon',
    calories: 380,
    proteinG: 24,
    carbsG: 38,
    fatG: 14,
    fiberG: 8,
    keyVitamins: ['Vit C (18mg)', 'Vit B12 (1.4mcg)', 'Vit B2 (0.5mg)', 'Vit E (2.1mg)'],
    keyMinerals: ['Calcium (340mg)', 'Zinc (2.1mg)', 'Magnesium (85mg)', 'Potassium (410mg)'],
    prepTimeMinutes: 10,
    dietaryPattern: ['Vegetarian', 'Plant-Forward'],
    cuisine: 'Mediterranean',
    allergens: ['Dairy / Lactose', 'Tree Nuts'],
    ingredients: [
      { name: 'Greek Yogurt (Strained)', amount: 200, unit: 'g', category: 'Dairy' },
      { name: 'Wild Blueberries & Raspberries', amount: 80, unit: 'g', category: 'Fruits' },
      { name: 'Raw English Walnuts', amount: 25, unit: 'g', category: 'Protein foods' },
      { name: 'Chia Seeds', amount: 10, unit: 'g', category: 'Grains' },
      { name: 'Raw Honey / Pure Maple', amount: 10, unit: 'ml', category: 'Other ingredients' },
      { name: 'Ground Ceylon Cinnamon', amount: 2, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'bf-2',
    category: 'breakfast',
    name: 'Avocado & Pasture Egg Sourdough Toast with Microgreens',
    description: 'Artisan whole-grain sourdough topped with smashed ripe avocado, two poached pasture-raised eggs, cherry tomatoes, and broccoli sprouts.',
    portionSize: '2 open-faced artisan toasts (290g)',
    calories: 420,
    proteinG: 20,
    carbsG: 34,
    fatG: 22,
    fiberG: 9,
    keyVitamins: ['Choline (290mg)', 'Vit E (3.4mg)', 'Vit K1 (42mcg)', 'Folate (140mcg)'],
    keyMinerals: ['Iron (3.2mg)', 'Potassium (620mg)', 'Zinc (1.8mg)', 'Selenium (28mcg)'],
    prepTimeMinutes: 15,
    dietaryPattern: ['Eggetarian', 'Vegetarian', 'Plant-Forward', 'Non-Vegetarian'],
    cuisine: 'Continental & Western',
    allergens: ['Eggs', 'Gluten / Wheat'],
    ingredients: [
      { name: 'Whole Grain Sourdough Bread', amount: 2, unit: 'slices', category: 'Grains' },
      { name: 'Pasture-Raised Eggs', amount: 2, unit: 'whole', category: 'Protein foods' },
      { name: 'Ripe Hass Avocado', amount: 0.5, unit: 'medium', category: 'Fruits' },
      { name: 'Cherry Tomatoes', amount: 50, unit: 'g', category: 'Vegetables' },
      { name: 'Broccoli Microgreens', amount: 20, unit: 'g', category: 'Vegetables' },
      { name: 'Extra Virgin Olive Oil', amount: 5, unit: 'ml', category: 'Other ingredients' },
      { name: 'Black Pepper & Sea Salt', amount: 2, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'bf-3',
    category: 'breakfast',
    name: 'Steel-Cut Oats with Apple Compote & Almond Butter',
    description: 'Slow-simmered steel-cut whole groats enriched with flaxseed meal, warm cinnamon-stewed crisp apples, and creamy roasted almond butter.',
    portionSize: '1 warm bowl (350g)',
    calories: 390,
    proteinG: 13,
    carbsG: 56,
    fatG: 14,
    fiberG: 11,
    keyVitamins: ['Vit B1 Thiamine (0.6mg)', 'Vit E (4.1mg)', 'Folate (65mcg)'],
    keyMinerals: ['Magnesium (115mg)', 'Iron (2.9mg)', 'Phosphorus (280mg)', 'Zinc (2.4mg)'],
    prepTimeMinutes: 20,
    dietaryPattern: ['Vegan', 'Vegetarian', 'Plant-Forward'],
    cuisine: 'Continental & Western',
    allergens: ['Tree Nuts'],
    ingredients: [
      { name: 'Steel-Cut Whole Oats', amount: 50, unit: 'g', category: 'Grains' },
      { name: 'Crisp Red Apple (Diced)', amount: 1, unit: 'medium', category: 'Fruits' },
      { name: 'Pure Almond Butter', amount: 20, unit: 'g', category: 'Protein foods' },
      { name: 'Ground Golden Flaxseed', amount: 15, unit: 'g', category: 'Grains' },
      { name: 'Unsweetened Almond / Oat Milk', amount: 180, unit: 'ml', category: 'Dairy' },
      { name: 'Ground Cinnamon & Nutmeg', amount: 3, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'bf-4',
    category: 'breakfast',
    name: 'South Indian Vegetable Moong Dal Puda with Coconut Chutney',
    description: 'Golden savory crepes made of soaked yellow moong lentils blended with ginger, baby spinach, grated carrots, and fresh mint coconut chutney.',
    portionSize: '2 savory pancakes (280g) + 2 tbsp chutney',
    calories: 360,
    proteinG: 18,
    carbsG: 46,
    fatG: 11,
    fiberG: 9,
    keyVitamins: ['Vit A Beta-Carotene (520mcg)', 'Vit C (24mg)', 'Folate (190mcg)'],
    keyMinerals: ['Potassium (510mg)', 'Iron (3.6mg)', 'Magnesium (92mg)', 'Calcium (80mg)'],
    prepTimeMinutes: 20,
    dietaryPattern: ['Vegan', 'Vegetarian', 'Plant-Forward'],
    cuisine: 'Indian',
    allergens: [],
    ingredients: [
      { name: 'Yellow Moong Lentils (Split)', amount: 60, unit: 'g', category: 'Pulses' },
      { name: 'Baby Spinach (Finely Chopped)', amount: 40, unit: 'g', category: 'Vegetables' },
      { name: 'Grated Fresh Carrots', amount: 30, unit: 'g', category: 'Vegetables' },
      { name: 'Fresh Grated Coconut', amount: 25, unit: 'g', category: 'Fruits' },
      { name: 'Fresh Ginger & Green Chili', amount: 10, unit: 'g', category: 'Vegetables' },
      { name: 'Cumin Seeds & Turmeric', amount: 4, unit: 'g', category: 'Spices' },
      { name: 'Cold-Pressed Sesame / Mustard Oil', amount: 5, unit: 'ml', category: 'Other ingredients' }
    ]
  },
  {
    id: 'bf-5',
    category: 'breakfast',
    name: 'Mexican Breakfast Burrito with Black Beans & Pico de Gallo',
    description: 'Warm sprouted tortilla packed with fluffy scrambled eggs or seasoned tofu, tender black beans, cilantro salsa fresca, and avocado slices.',
    portionSize: '1 large wrapped wrap (310g)',
    calories: 430,
    proteinG: 22,
    carbsG: 48,
    fatG: 16,
    fiberG: 12,
    keyVitamins: ['Vit C (32mg)', 'Vit A (410mcg)', 'Vit B6 (0.6mg)', 'Folate (170mcg)'],
    keyMinerals: ['Iron (4.1mg)', 'Calcium (140mg)', 'Potassium (680mg)', 'Magnesium (95mg)'],
    prepTimeMinutes: 15,
    dietaryPattern: ['Eggetarian', 'Vegetarian', 'Plant-Forward'],
    cuisine: 'Mexican & Latin',
    allergens: ['Eggs', 'Gluten / Wheat'],
    ingredients: [
      { name: 'Sprouted Whole Grain Tortilla', amount: 1, unit: 'large', category: 'Grains' },
      { name: 'Pasture Eggs (or Scrambled Tofu)', amount: 2, unit: 'whole', category: 'Protein foods' },
      { name: 'Cooked Black Beans', amount: 70, unit: 'g', category: 'Pulses' },
      { name: 'Fresh Tomatoes & Red Onion (Pico)', amount: 50, unit: 'g', category: 'Vegetables' },
      { name: 'Fresh Cilantro & Lime', amount: 15, unit: 'g', category: 'Vegetables' },
      { name: 'Hass Avocado', amount: 0.3, unit: 'medium', category: 'Fruits' },
      { name: 'Smoked Paprika & Cumin', amount: 3, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'bf-6',
    category: 'breakfast',
    name: 'Smoked Wild Salmon & Dill Quinoa Breakfast Bowl',
    description: 'Fluffy warm tri-color quinoa paired with wild Alaskan sockeye salmon, baby arugula, soft boiled egg, capers, and lemon-tahini drizzle.',
    portionSize: '1 nourishing bowl (340g)',
    calories: 440,
    proteinG: 30,
    carbsG: 32,
    fatG: 19,
    fiberG: 6,
    keyVitamins: ['Vit D3 (580IU)', 'Vit B12 (3.8mcg)', 'Vit B3 Niacin (8.2mg)'],
    keyMinerals: ['Selenium (42mcg)', 'Potassium (690mg)', 'Iron (3.4mg)', 'Magnesium (105mg)'],
    prepTimeMinutes: 15,
    dietaryPattern: ['Pescatarian', 'Non-Vegetarian', 'Plant-Forward'],
    cuisine: 'Mediterranean',
    allergens: ['Fish', 'Eggs', 'Sesame'],
    ingredients: [
      { name: 'Wild Alaskan Salmon', amount: 80, unit: 'g', category: 'Protein foods' },
      { name: 'Cooked Quinoa', amount: 80, unit: 'g', category: 'Grains' },
      { name: 'Soft Boiled Egg', amount: 1, unit: 'whole', category: 'Protein foods' },
      { name: 'Baby Arugula', amount: 30, unit: 'g', category: 'Vegetables' },
      { name: 'Hulled Sesame Tahini', amount: 15, unit: 'g', category: 'Other ingredients' },
      { name: 'Fresh Lemon & Dill', amount: 15, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'bf-7',
    category: 'breakfast',
    name: 'Silken Tofu & Shiitake Scramble with Steamed Brown Rice',
    description: 'Golden turmeric-infused organic silken tofu stir-fried with fragrant shiitake mushrooms, baby bok choy, scallions, and warm short-grain brown rice.',
    portionSize: '1 bowl (330g)',
    calories: 370,
    proteinG: 21,
    carbsG: 45,
    fatG: 12,
    fiberG: 7,
    keyVitamins: ['Vit D2 (180IU)', 'Vit K1 (65mcg)', 'Vit B2 (0.4mg)', 'Vit C (22mg)'],
    keyMinerals: ['Calcium (280mg)', 'Iron (3.9mg)', 'Copper (0.5mg)', 'Potassium (490mg)'],
    prepTimeMinutes: 15,
    dietaryPattern: ['Vegan', 'Vegetarian', 'Plant-Forward'],
    cuisine: 'East & Southeast Asian',
    allergens: ['Soy'],
    ingredients: [
      { name: 'Organic Firm/Silken Tofu', amount: 150, unit: 'g', category: 'Protein foods' },
      { name: 'Fresh Shiitake Mushrooms', amount: 60, unit: 'g', category: 'Vegetables' },
      { name: 'Baby Bok Choy', amount: 60, unit: 'g', category: 'Vegetables' },
      { name: 'Steamed Short-Grain Brown Rice', amount: 80, unit: 'g', category: 'Grains' },
      { name: 'Toasted Sesame Oil', amount: 5, unit: 'ml', category: 'Other ingredients' },
      { name: 'Turmeric, Ginger & Tamari', amount: 8, unit: 'g', category: 'Spices' }
    ]
  },

  // ==========================================
  // MORNING SNACKS
  // ==========================================
  {
    id: 'ms-1',
    category: 'morning_snack',
    name: 'Crisp Apple Slices with Creamy Pumpkin Seed Butter',
    description: 'Crisp Honeycrisp apple wedges served with raw mineral-rich pumpkin seed butter and a dash of cinnamon.',
    portionSize: '1 medium sliced apple + 2 tbsp seed butter (160g)',
    calories: 190,
    proteinG: 6,
    carbsG: 24,
    fatG: 10,
    fiberG: 5,
    keyVitamins: ['Vit C (8.4mg)', 'Vit E (1.8mg)'],
    keyMinerals: ['Zinc (2.3mg)', 'Magnesium (74mg)', 'Potassium (280mg)'],
    prepTimeMinutes: 5,
    dietaryPattern: ['Vegan', 'Vegetarian', 'Plant-Forward'],
    cuisine: 'Continental & Western',
    allergens: [],
    ingredients: [
      { name: 'Crisp Fresh Apple', amount: 1, unit: 'medium', category: 'Fruits' },
      { name: 'Raw Pumpkin Seed Butter / Pepitas', amount: 25, unit: 'g', category: 'Protein foods' },
      { name: 'Ground Cinnamon', amount: 1, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'ms-2',
    category: 'morning_snack',
    name: 'Organic Kefir Drink with Ground Golden Flax & Orange Zest',
    description: 'Live active probiotic goat or cow milk kefir blended with cold-milled flaxseed and freshly grated organic orange zest.',
    portionSize: '1 glass (220ml)',
    calories: 160,
    proteinG: 10,
    carbsG: 14,
    fatG: 6,
    fiberG: 3.5,
    keyVitamins: ['Vit B12 (0.9mcg)', 'Vit K2 (12mcg)', 'Vit A (80mcg)'],
    keyMinerals: ['Calcium (290mg)', 'Phosphorus (210mg)', 'Potassium (320mg)'],
    prepTimeMinutes: 3,
    dietaryPattern: ['Vegetarian', 'Plant-Forward'],
    cuisine: 'Mediterranean',
    allergens: ['Dairy / Lactose'],
    ingredients: [
      { name: 'Plain Probiotic Kefir', amount: 200, unit: 'ml', category: 'Dairy' },
      { name: 'Cold-Milled Golden Flaxseed', amount: 12, unit: 'g', category: 'Grains' },
      { name: 'Fresh Orange Zest & Vanilla', amount: 3, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'ms-3',
    category: 'morning_snack',
    name: 'Steamed Edamame in Pods with Pink Flake Salt',
    description: 'Fresh organic young green soybeans gently steamed in their pods with mineral pink salt and toasted sesame seeds.',
    portionSize: '1 small bowl (150g in pods)',
    calories: 140,
    proteinG: 12,
    carbsG: 10,
    fatG: 5,
    fiberG: 6,
    keyVitamins: ['Folate (240mcg)', 'Vit K1 (36mcg)', 'Vit C (6mg)'],
    keyMinerals: ['Iron (2.5mg)', 'Magnesium (64mg)', 'Potassium (430mg)'],
    prepTimeMinutes: 6,
    dietaryPattern: ['Vegan', 'Vegetarian', 'Plant-Forward'],
    cuisine: 'East & Southeast Asian',
    allergens: ['Soy', 'Sesame'],
    ingredients: [
      { name: 'Young Edamame Soybeans in Pod', amount: 150, unit: 'g', category: 'Pulses' },
      { name: 'Toasted White Sesame Seeds', amount: 4, unit: 'g', category: 'Other ingredients' },
      { name: 'Coarse Mineral Salt', amount: 2, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'ms-4',
    category: 'morning_snack',
    name: 'Roasted Masala Chickpeas & Cucumber Rounds',
    description: 'Crunchy oven-roasted garbanzo beans tossed in cumin, chat masala, and served with cool sliced mini cucumbers.',
    portionSize: '1 cup crunchy mix (130g)',
    calories: 170,
    proteinG: 8,
    carbsG: 26,
    fatG: 4,
    fiberG: 7,
    keyVitamins: ['Vit C (12mg)', 'Vit B6 (0.3mg)', 'Folate (110mcg)'],
    keyMinerals: ['Iron (2.2mg)', 'Manganese (1.1mg)', 'Potassium (360mg)'],
    prepTimeMinutes: 5,
    dietaryPattern: ['Vegan', 'Vegetarian', 'Plant-Forward'],
    cuisine: 'Indian',
    allergens: [],
    ingredients: [
      { name: 'Dry Roasted Chickpeas', amount: 40, unit: 'g', category: 'Pulses' },
      { name: 'Crisp Mini Cucumbers', amount: 80, unit: 'g', category: 'Vegetables' },
      { name: 'Cumin, Chaat Masala & Lemon Juice', amount: 5, unit: 'g', category: 'Spices' }
    ]
  },

  // ==========================================
  // LUNCHES
  // ==========================================
  {
    id: 'lu-1',
    category: 'lunch',
    name: 'Mediterranean Salmon & Rainbow Tabbouleh Grain Bowl',
    description: 'Oven-seared wild salmon over cracked whole wheat bulgur, flat-leaf parsley, Roma tomatoes, cucumber, Kalamata olives, and EVOO vinaigrette.',
    portionSize: '1 loaded bowl (420g)',
    calories: 540,
    proteinG: 36,
    carbsG: 46,
    fatG: 22,
    fiberG: 9,
    keyVitamins: ['Vit D (620IU)', 'Vit C (48mg)', 'Vit K1 (140mcg)', 'Vit B12 (3.6mcg)'],
    keyMinerals: ['Selenium (48mcg)', 'Potassium (840mg)', 'Magnesium (110mg)', 'Iron (3.8mg)'],
    prepTimeMinutes: 25,
    dietaryPattern: ['Pescatarian', 'Non-Vegetarian', 'Plant-Forward'],
    cuisine: 'Mediterranean',
    allergens: ['Fish', 'Gluten / Wheat'],
    ingredients: [
      { name: 'Wild Coho/Sockeye Salmon Fillet', amount: 120, unit: 'g', category: 'Protein foods' },
      { name: 'Whole Wheat Bulgur / Farro', amount: 60, unit: 'g', category: 'Grains' },
      { name: 'Fresh Italian Flat Parsley', amount: 40, unit: 'g', category: 'Vegetables' },
      { name: 'Roma Tomatoes & English Cucumber', amount: 100, unit: 'g', category: 'Vegetables' },
      { name: 'Kalamata Olives', amount: 20, unit: 'g', category: 'Vegetables' },
      { name: 'Extra Virgin Olive Oil', amount: 12, unit: 'ml', category: 'Other ingredients' },
      { name: 'Fresh Lemon Juice & Garlic', amount: 15, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'lu-2',
    category: 'lunch',
    name: 'Rich Lentil & Kale Soup with Lemon Herbed Toast',
    description: 'Thick simmered brown French lentils with aromatic mirepoix, Tuscan lacinato kale, crushed garlic, and whole grain sourdough.',
    portionSize: '1 large soup bowl (400ml) + 1 toast',
    calories: 460,
    proteinG: 24,
    carbsG: 68,
    fatG: 10,
    fiberG: 16,
    keyVitamins: ['Vit A (720mcg)', 'Vit C (65mg)', 'Folate (290mcg)', 'Vit K1 (280mcg)'],
    keyMinerals: ['Iron (6.8mg)', 'Potassium (950mg)', 'Magnesium (135mg)', 'Zinc (3.4mg)'],
    prepTimeMinutes: 30,
    dietaryPattern: ['Vegan', 'Vegetarian', 'Plant-Forward'],
    cuisine: 'Mediterranean',
    allergens: ['Gluten / Wheat'],
    ingredients: [
      { name: 'Brown / Green French Lentils', amount: 80, unit: 'g', category: 'Pulses' },
      { name: 'Lacinato Dinosaur Kale', amount: 70, unit: 'g', category: 'Vegetables' },
      { name: 'Carrots, Celery & Yellow Onion', amount: 90, unit: 'g', category: 'Vegetables' },
      { name: 'Whole Grain Artisanal Bread', amount: 1, unit: 'slice', category: 'Grains' },
      { name: 'Extra Virgin Olive Oil', amount: 8, unit: 'ml', category: 'Other ingredients' },
      { name: 'Rosemary, Thyme & Crushed Garlic', amount: 6, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'lu-3',
    category: 'lunch',
    name: 'Grilled Herb Chicken with Sweet Potato & Roasted Asparagus',
    description: 'Tender rosemary-marinated chicken breast served alongside caramelized sweet potato wedges and tender steamed garlic asparagus.',
    portionSize: '1 balanced clinical plate (390g)',
    calories: 490,
    proteinG: 42,
    carbsG: 42,
    fatG: 14,
    fiberG: 8,
    keyVitamins: ['Vit A Beta-Carotene (960mcg)', 'Vit B6 (1.2mg)', 'Vit C (34mg)', 'Vit B3 (14mg)'],
    keyMinerals: ['Potassium (890mg)', 'Phosphorus (390mg)', 'Zinc (2.8mg)', 'Iron (2.4mg)'],
    prepTimeMinutes: 25,
    dietaryPattern: ['Non-Vegetarian'],
    cuisine: 'Continental & Western',
    allergens: [],
    ingredients: [
      { name: 'Skinless Chicken Breast Fillet', amount: 140, unit: 'g', category: 'Protein foods' },
      { name: 'Roasted Orange Sweet Potato', amount: 140, unit: 'g', category: 'Vegetables' },
      { name: 'Fresh Green Asparagus Spears', amount: 100, unit: 'g', category: 'Vegetables' },
      { name: 'Cold-Pressed Olive Oil', amount: 10, unit: 'ml', category: 'Other ingredients' },
      { name: 'Fresh Rosemary, Thyme & Garlic', amount: 6, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'lu-4',
    category: 'lunch',
    name: 'Indian Palak Dal Tadka with Brown Basmati & Kachumber',
    description: 'Golden split pigeon peas cooked with fresh chopped spinach, ginger garlic tadka, aromatic brown basmati rice, and diced cucumber-tomato salad.',
    portionSize: '1 full traditional thali plate (420g)',
    calories: 480,
    proteinG: 22,
    carbsG: 76,
    fatG: 11,
    fiberG: 14,
    keyVitamins: ['Vit A (640mcg)', 'Vit C (38mg)', 'Folate (260mcg)', 'Vit K (180mcg)'],
    keyMinerals: ['Iron (5.4mg)', 'Magnesium (128mg)', 'Potassium (780mg)', 'Calcium (145mg)'],
    prepTimeMinutes: 25,
    dietaryPattern: ['Vegan', 'Vegetarian', 'Plant-Forward'],
    cuisine: 'Indian',
    allergens: [],
    ingredients: [
      { name: 'Split Toor / Moong Lentils', amount: 75, unit: 'g', category: 'Pulses' },
      { name: 'Fresh Baby Spinach (Palak)', amount: 100, unit: 'g', category: 'Vegetables' },
      { name: 'Long Grain Brown Basmati Rice', amount: 70, unit: 'g', category: 'Grains' },
      { name: 'Tomatoes, Onions & Cucumbers', amount: 80, unit: 'g', category: 'Vegetables' },
      { name: 'Pure Cow Ghee or Mustard Oil', amount: 6, unit: 'g', category: 'Other ingredients' },
      { name: 'Cumin, Mustard Seeds, Asafetida & Turmeric', amount: 5, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'lu-5',
    category: 'lunch',
    name: 'Tempeh Teriyaki Nourish Bowl with Steamed Edamame & Broccoli',
    description: 'Pan-caramelized organic fermented tempeh in ginger tamari glaze over nutty red quinoa, tender broccoli florets, and shredded purple cabbage.',
    portionSize: '1 vibrant macro bowl (390g)',
    calories: 470,
    proteinG: 31,
    carbsG: 48,
    fatG: 17,
    fiberG: 12,
    keyVitamins: ['Vit C (72mg)', 'Vit K1 (160mcg)', 'Vit B2 (0.6mg)', 'Folate (180mcg)'],
    keyMinerals: ['Calcium (210mg)', 'Iron (4.8mg)', 'Magnesium (145mg)', 'Potassium (720mg)'],
    prepTimeMinutes: 20,
    dietaryPattern: ['Vegan', 'Vegetarian', 'Plant-Forward'],
    cuisine: 'East & Southeast Asian',
    allergens: ['Soy', 'Sesame'],
    ingredients: [
      { name: 'Organic Cultured Tempeh', amount: 120, unit: 'g', category: 'Protein foods' },
      { name: 'Cooked Red Quinoa / Brown Rice', amount: 80, unit: 'g', category: 'Grains' },
      { name: 'Fresh Broccoli Florets', amount: 90, unit: 'g', category: 'Vegetables' },
      { name: 'Purple Shredded Cabbage & Carrots', amount: 60, unit: 'g', category: 'Vegetables' },
      { name: 'Toasted Sesame Oil & Tamari Sauce', amount: 10, unit: 'ml', category: 'Other ingredients' },
      { name: 'Fresh Ginger, Garlic & Sesame Seeds', amount: 6, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'lu-6',
    category: 'lunch',
    name: 'Mexican Fiesta Bowl with Seasoned Black Beans & Guacamole',
    description: 'Cumin-lime roasted corn, simmered black beans, brown rice, fresh pico de gallo, shredded romaine lettuce, and fresh guacamole.',
    portionSize: '1 loaded fiesta bowl (410g)',
    calories: 490,
    proteinG: 18,
    carbsG: 72,
    fatG: 16,
    fiberG: 15,
    keyVitamins: ['Vit C (44mg)', 'Vit A (380mcg)', 'Vit E (2.9mg)', 'Folate (210mcg)'],
    keyMinerals: ['Potassium (790mg)', 'Iron (4.2mg)', 'Magnesium (118mg)', 'Zinc (2.6mg)'],
    prepTimeMinutes: 15,
    dietaryPattern: ['Vegan', 'Vegetarian', 'Plant-Forward'],
    cuisine: 'Mexican & Latin',
    allergens: [],
    ingredients: [
      { name: 'Cooked Black Turtle Beans', amount: 90, unit: 'g', category: 'Pulses' },
      { name: 'Steamed Long Grain Brown Rice', amount: 70, unit: 'g', category: 'Grains' },
      { name: 'Hass Avocado & Lime (Guacamole)', amount: 40, unit: 'g', category: 'Fruits' },
      { name: 'Sweet Corn Kernels & Roma Tomatoes', amount: 80, unit: 'g', category: 'Vegetables' },
      { name: 'Crisp Romaine Lettuce', amount: 50, unit: 'g', category: 'Vegetables' },
      { name: 'Cilantro, Lime, Cumin & Paprika', amount: 6, unit: 'g', category: 'Spices' }
    ]
  },

  // ==========================================
  // EVENING SNACKS
  // ==========================================
  {
    id: 'es-1',
    category: 'evening_snack',
    name: 'Handful of Raw California Almonds & Medjool Date',
    description: 'Crunchy raw nonpareil almonds paired with one succulent whole Medjool date for steady brain focus.',
    portionSize: '24 almonds + 1 date (45g)',
    calories: 180,
    proteinG: 6,
    carbsG: 18,
    fatG: 12,
    fiberG: 4.5,
    keyVitamins: ['Vit E (6.2mg - 41% DV)', 'Vit B2 Riboflavin (0.3mg)'],
    keyMinerals: ['Magnesium (72mg)', 'Calcium (65mg)', 'Potassium (240mg)'],
    prepTimeMinutes: 2,
    dietaryPattern: ['Vegan', 'Vegetarian', 'Plant-Forward'],
    cuisine: 'Middle Eastern',
    allergens: ['Tree Nuts'],
    ingredients: [
      { name: 'Raw Unsalted Almonds', amount: 25, unit: 'g', category: 'Protein foods' },
      { name: 'Whole Medjool Date', amount: 1, unit: 'whole', category: 'Fruits' }
    ]
  },
  {
    id: 'es-2',
    category: 'evening_snack',
    name: 'Creamy Garlic Hummus with Rainbow Carrot & Bell Pepper Dippers',
    description: 'Silky tahini chickpea hummus served alongside crisp purple, yellow, and orange carrot sticks with crunchy red bell pepper strips.',
    portionSize: '1 cup crunchy veggies + 3 tbsp hummus (180g)',
    calories: 160,
    proteinG: 6,
    carbsG: 20,
    fatG: 7,
    fiberG: 6,
    keyVitamins: ['Vit A Beta-Carotene (840mcg)', 'Vit C (95mg - 105% DV)'],
    keyMinerals: ['Potassium (410mg)', 'Iron (1.9mg)', 'Calcium (55mg)'],
    prepTimeMinutes: 5,
    dietaryPattern: ['Vegan', 'Vegetarian', 'Plant-Forward'],
    cuisine: 'Middle Eastern',
    allergens: ['Sesame'],
    ingredients: [
      { name: 'Traditional Chickpea Hummus', amount: 50, unit: 'g', category: 'Pulses' },
      { name: 'Rainbow Carrots', amount: 70, unit: 'g', category: 'Vegetables' },
      { name: 'Crisp Red Bell Pepper', amount: 60, unit: 'g', category: 'Vegetables' },
      { name: 'Paprika & Olive Oil Drizzle', amount: 2, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'es-3',
    category: 'evening_snack',
    name: 'Spiced Turmeric Golden Milk with Pure Honey',
    description: 'Warm soothing milk simmered with organic turmeric root, crushed black pepper, green cardamom, and raw honey.',
    portionSize: '1 warm mug (220ml)',
    calories: 140,
    proteinG: 8,
    carbsG: 16,
    fatG: 5,
    fiberG: 1,
    keyVitamins: ['Vit B12 (1.1mcg)', 'Vit D (100IU)', 'Vit B2 (0.4mg)'],
    keyMinerals: ['Calcium (280mg)', 'Magnesium (35mg)', 'Potassium (320mg)'],
    prepTimeMinutes: 6,
    dietaryPattern: ['Vegetarian', 'Plant-Forward'],
    cuisine: 'Indian',
    allergens: ['Dairy / Lactose'],
    ingredients: [
      { name: 'Low-Fat Milk / Fortified Plant Milk', amount: 200, unit: 'ml', category: 'Dairy' },
      { name: 'Ground Turmeric Root', amount: 3, unit: 'g', category: 'Spices' },
      { name: 'Raw Honey', amount: 8, unit: 'g', category: 'Other ingredients' },
      { name: 'Black Pepper & Cardamom', amount: 1, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'es-4',
    category: 'evening_snack',
    name: 'Chia Seed Berry Pudding Jar',
    description: 'Overnight soaked black chia seeds in coconut milk topped with crushed raspberries and raw cacao nibs.',
    portionSize: '1 glass jar (180g)',
    calories: 170,
    proteinG: 5,
    carbsG: 17,
    fatG: 9,
    fiberG: 8,
    keyVitamins: ['Vit C (14mg)', 'Vit E (1.2mg)'],
    keyMinerals: ['Calcium (190mg)', 'Magnesium (78mg)', 'Iron (2.1mg)'],
    prepTimeMinutes: 5,
    dietaryPattern: ['Vegan', 'Vegetarian', 'Plant-Forward'],
    cuisine: 'Global Fusion',
    allergens: [],
    ingredients: [
      { name: 'Black Chia Seeds', amount: 20, unit: 'g', category: 'Grains' },
      { name: 'Light Coconut / Almond Milk', amount: 120, unit: 'ml', category: 'Dairy' },
      { name: 'Fresh Raspberries', amount: 40, unit: 'g', category: 'Fruits' },
      { name: 'Raw Cacao Nibs', amount: 5, unit: 'g', category: 'Other ingredients' }
    ]
  },

  // ==========================================
  // DINNERS
  // ==========================================
  {
    id: 'dn-1',
    category: 'dinner',
    name: 'Wild Cod Fillet with Ratatouille & Quinoa',
    description: 'Pan-roasted wild Pacific cod over provencal slow-cooked eggplant, zucchini, bell peppers, tomatoes, and fluffy whole quinoa.',
    portionSize: '1 large dinner plate (430g)',
    calories: 460,
    proteinG: 38,
    carbsG: 44,
    fatG: 14,
    fiberG: 9,
    keyVitamins: ['Vit C (56mg)', 'Vit B12 (2.4mcg)', 'Vit B6 (0.8mg)', 'Vit A (240mcg)'],
    keyMinerals: ['Iodine (140mcg)', 'Selenium (39mcg)', 'Potassium (880mg)', 'Magnesium (95mg)'],
    prepTimeMinutes: 30,
    dietaryPattern: ['Pescatarian', 'Non-Vegetarian', 'Plant-Forward'],
    cuisine: 'Mediterranean',
    allergens: ['Fish'],
    ingredients: [
      { name: 'Wild Pacific Cod / Halibut Fillet', amount: 150, unit: 'g', category: 'Protein foods' },
      { name: 'Eggplant & Zucchini (Diced)', amount: 120, unit: 'g', category: 'Vegetables' },
      { name: 'Crushed San Marzano Tomatoes', amount: 90, unit: 'g', category: 'Vegetables' },
      { name: 'Cooked White Quinoa', amount: 70, unit: 'g', category: 'Grains' },
      { name: 'Extra Virgin Olive Oil', amount: 10, unit: 'ml', category: 'Other ingredients' },
      { name: 'Herbes de Provence & Fresh Garlic', amount: 6, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'dn-2',
    category: 'dinner',
    name: 'Indian Paneer (or Tofu) Tikka Masala with Cauliflower Rice & Peas',
    description: 'Grilled artisanal cottage cheese (or organic tofu) in rich tomato, cashew, and ginger gravy served with turmeric spiced peas and cauliflower rice.',
    portionSize: '1 dinner plate (410g)',
    calories: 480,
    proteinG: 26,
    carbsG: 38,
    fatG: 24,
    fiberG: 10,
    keyVitamins: ['Vit C (68mg)', 'Vit A (420mcg)', 'Vit K1 (70mcg)', 'Folate (140mcg)'],
    keyMinerals: ['Calcium (480mg)', 'Phosphorus (340mg)', 'Magnesium (98mg)', 'Potassium (740mg)'],
    prepTimeMinutes: 30,
    dietaryPattern: ['Vegetarian', 'Plant-Forward'],
    cuisine: 'Indian',
    allergens: ['Dairy / Lactose', 'Tree Nuts'],
    ingredients: [
      { name: 'Low-Fat Fresh Paneer (or Firm Tofu)', amount: 120, unit: 'g', category: 'Dairy' },
      { name: 'Riced Cauliflower & Green Peas', amount: 140, unit: 'g', category: 'Vegetables' },
      { name: 'Tomatoes & Pure Cashew Paste', amount: 80, unit: 'g', category: 'Vegetables' },
      { name: 'Raw Cashew Nuts', amount: 15, unit: 'g', category: 'Protein foods' },
      { name: 'Cold-Pressed Mustard Oil / Ghee', amount: 8, unit: 'g', category: 'Other ingredients' },
      { name: 'Garam Masala, Fenugreek Leaves & Ginger', amount: 8, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'dn-3',
    category: 'dinner',
    name: 'Moroccan Chickpea & Butternut Squash Tagine with Couscous',
    description: 'Slow-simmered chickpeas with caramelized butternut squash, dried apricots, spinach, toasted almonds, and whole wheat pearl couscous.',
    portionSize: '1 fragrant tagine bowl (440g)',
    calories: 490,
    proteinG: 19,
    carbsG: 82,
    fatG: 12,
    fiberG: 16,
    keyVitamins: ['Vit A Beta-Carotene (1150mcg - 128% DV)', 'Vit C (45mg)', 'Folate (220mcg)'],
    keyMinerals: ['Potassium (920mg)', 'Iron (5.1mg)', 'Magnesium (132mg)', 'Calcium (160mg)'],
    prepTimeMinutes: 35,
    dietaryPattern: ['Vegan', 'Vegetarian', 'Plant-Forward'],
    cuisine: 'Middle Eastern',
    allergens: ['Tree Nuts', 'Gluten / Wheat'],
    ingredients: [
      { name: 'Cooked Chickpeas (Garbanzo)', amount: 110, unit: 'g', category: 'Pulses' },
      { name: 'Cubed Butternut Squash', amount: 130, unit: 'g', category: 'Vegetables' },
      { name: 'Whole Wheat Pearl Couscous', amount: 65, unit: 'g', category: 'Grains' },
      { name: 'Fresh Baby Spinach', amount: 60, unit: 'g', category: 'Vegetables' },
      { name: 'Sliced Toasted Almonds & Dried Apricots', amount: 20, unit: 'g', category: 'Fruits' },
      { name: 'Ras El Hanout, Cinnamon & Saffron', amount: 6, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'dn-4',
    category: 'dinner',
    name: 'Grass-Fed Lean Turkey Bolognese over Zucchini & Whole Grain Pasta',
    description: 'Rich slow-cooked tomato, oregano, and lean turkey meat sauce served over a 50/50 blend of whole grain penne and tender spiralized zucchini noodles.',
    portionSize: '1 generous pasta bowl (420g)',
    calories: 490,
    proteinG: 39,
    carbsG: 48,
    fatG: 15,
    fiberG: 10,
    keyVitamins: ['Vit C (42mg)', 'Vit B6 (1.1mg)', 'Vit B12 (2.1mcg)', 'Vit A (310mcg)'],
    keyMinerals: ['Zinc (4.2mg)', 'Iron (4.4mg)', 'Potassium (860mg)', 'Magnesium (115mg)'],
    prepTimeMinutes: 30,
    dietaryPattern: ['Non-Vegetarian'],
    cuisine: 'Continental & Western',
    allergens: ['Gluten / Wheat'],
    ingredients: [
      { name: 'Extra Lean Ground Turkey (93/7)', amount: 130, unit: 'g', category: 'Protein foods' },
      { name: 'Whole Grain Durum Penne Pasta', amount: 55, unit: 'g', category: 'Grains' },
      { name: 'Spiralized Green Zucchini', amount: 120, unit: 'g', category: 'Vegetables' },
      { name: 'Italian Plum Tomatoes (Pureed)', amount: 90, unit: 'g', category: 'Vegetables' },
      { name: 'Extra Virgin Olive Oil', amount: 8, unit: 'ml', category: 'Other ingredients' },
      { name: 'Oregano, Basil, Garlic & Black Pepper', amount: 6, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'dn-5',
    category: 'dinner',
    name: 'East Asian Miso Glazed Black Tofu with Shiitake & Soba',
    description: 'Crisp organic black soybean tofu glazed in fermented red miso, served over 100% buckwheat soba noodles, steamed sugar snap peas, and scallions.',
    portionSize: '1 large noodle bowl (400g)',
    calories: 450,
    proteinG: 28,
    carbsG: 54,
    fatG: 14,
    fiberG: 11,
    keyVitamins: ['Vit K1 (85mcg)', 'Vit C (28mg)', 'Vit B1 (0.5mg)', 'Vit B2 (0.4mg)'],
    keyMinerals: ['Manganese (1.8mg)', 'Magnesium (140mg)', 'Iron (4.6mg)', 'Potassium (670mg)'],
    prepTimeMinutes: 25,
    dietaryPattern: ['Vegan', 'Vegetarian', 'Plant-Forward'],
    cuisine: 'East & Southeast Asian',
    allergens: ['Soy', 'Sesame'],
    ingredients: [
      { name: 'Organic Black/Firm Tofu', amount: 130, unit: 'g', category: 'Protein foods' },
      { name: '100% Buckwheat Soba Noodles', amount: 60, unit: 'g', category: 'Grains' },
      { name: 'Fresh Shiitake & Snap Peas', amount: 100, unit: 'g', category: 'Vegetables' },
      { name: 'Red Miso Paste', amount: 18, unit: 'g', category: 'Other ingredients' },
      { name: 'Toasted Sesame Oil & Mirin', amount: 8, unit: 'ml', category: 'Other ingredients' },
      { name: 'Ginger, Garlic & Green Onions', amount: 8, unit: 'g', category: 'Spices' }
    ]
  },

  // ==========================================
  // OPTIONAL DESSERTS
  // ==========================================
  {
    id: 'de-1',
    category: 'dessert',
    name: 'Dark Chocolate Square (85% Cacao) & Fresh Blackberries',
    description: 'Single-origin polyphenolic dark chocolate paired with sweet wild blackberries for antioxidant cellular protection.',
    portionSize: '2 dark chocolate squares + 1/2 cup blackberries (80g)',
    calories: 130,
    proteinG: 2.5,
    carbsG: 14,
    fatG: 8,
    fiberG: 5,
    keyVitamins: ['Vit C (15mg)', 'Vit K (14mcg)'],
    keyMinerals: ['Magnesium (52mg)', 'Iron (1.8mg)', 'Manganese (0.7mg)'],
    prepTimeMinutes: 2,
    dietaryPattern: ['Vegan', 'Vegetarian', 'Plant-Forward'],
    cuisine: 'Continental & Western',
    allergens: [],
    ingredients: [
      { name: '85% Extra Dark Chocolate', amount: 20, unit: 'g', category: 'Other ingredients' },
      { name: 'Fresh Wild Blackberries', amount: 60, unit: 'g', category: 'Fruits' }
    ]
  },
  {
    id: 'de-2',
    category: 'dessert',
    name: 'Baked Cinnamon Honey Apple with Toasted Walnuts',
    description: 'Tender oven-baked Honeycrisp apple halves basted in Ceylon cinnamon, raw honey, and crowned with crushed toasted walnuts.',
    portionSize: '1 baked apple half with toppings (120g)',
    calories: 145,
    proteinG: 2,
    carbsG: 26,
    fatG: 5,
    fiberG: 4.5,
    keyVitamins: ['Vit C (6mg)', 'Vit E (0.8mg)'],
    keyMinerals: ['Potassium (180mg)', 'Magnesium (24mg)'],
    prepTimeMinutes: 15,
    dietaryPattern: ['Vegetarian', 'Plant-Forward'],
    cuisine: 'Mediterranean',
    allergens: ['Tree Nuts'],
    ingredients: [
      { name: 'Honeycrisp Apple', amount: 1, unit: 'medium', category: 'Fruits' },
      { name: 'Raw Honey / Pure Maple', amount: 6, unit: 'g', category: 'Other ingredients' },
      { name: 'Toasted English Walnuts', amount: 10, unit: 'g', category: 'Protein foods' },
      { name: 'Ceylon Cinnamon & Ground Clove', amount: 2, unit: 'g', category: 'Spices' }
    ]
  },
  {
    id: 'de-3',
    category: 'dessert',
    name: 'Greek Yogurt with Passion Fruit & Pomegranate Arils',
    description: 'Silky whipped Greek yogurt topped with tropical tart passion fruit pulp and ruby-red crunchy pomegranate arils.',
    portionSize: '1 glass dessert cup (130g)',
    calories: 135,
    proteinG: 11,
    carbsG: 16,
    fatG: 2.5,
    fiberG: 3,
    keyVitamins: ['Vit C (14mg)', 'Vit B12 (0.6mcg)'],
    keyMinerals: ['Calcium (140mg)', 'Potassium (220mg)'],
    prepTimeMinutes: 5,
    dietaryPattern: ['Vegetarian', 'Plant-Forward'],
    cuisine: 'Mediterranean',
    allergens: ['Dairy / Lactose'],
    ingredients: [
      { name: 'Plain Greek Yogurt (0% or 2%)', amount: 90, unit: 'g', category: 'Dairy' },
      { name: 'Fresh Passion Fruit Pulp', amount: 25, unit: 'g', category: 'Fruits' },
      { name: 'Pomegranate Seeds (Arils)', amount: 20, unit: 'g', category: 'Fruits' }
    ]
  }
];

// Helper to filter meals based on user preferences
export function getEligibleMeals(
  category: AIMealCategory,
  preferences: AIMealPlannerPreferences
): AIMealItem[] {
  let list = AI_MEAL_DATABASE.filter(m => m.category === category);

  // Filter dietary pattern
  if (preferences.dietaryPattern === 'Vegan') {
    list = list.filter(m => m.dietaryPattern.includes('Vegan'));
  } else if (preferences.dietaryPattern === 'Vegetarian') {
    list = list.filter(m => m.dietaryPattern.includes('Vegetarian') || m.dietaryPattern.includes('Vegan'));
  } else if (preferences.dietaryPattern === 'Eggetarian') {
    list = list.filter(m => m.dietaryPattern.includes('Eggetarian') || m.dietaryPattern.includes('Vegetarian') || m.dietaryPattern.includes('Vegan'));
  } else if (preferences.dietaryPattern === 'Pescatarian') {
    list = list.filter(m => m.dietaryPattern.includes('Pescatarian') || m.dietaryPattern.includes('Vegetarian') || m.dietaryPattern.includes('Vegan'));
  }

  // Filter Allergies
  if (preferences.allergies && preferences.allergies.length > 0) {
    list = list.filter(m => {
      const hasAllergen = m.allergens.some(a => preferences.allergies.includes(a));
      return !hasAllergen;
    });
  }

  // If filtered list is empty (fallback to best match without allergen)
  if (list.length === 0) {
    list = AI_MEAL_DATABASE.filter(m => m.category === category);
    if (preferences.allergies && preferences.allergies.length > 0) {
      list = list.filter(m => !m.allergens.some(a => preferences.allergies.includes(a)));
    }
  }

  return list.length > 0 ? list : AI_MEAL_DATABASE.filter(m => m.category === category);
}

// Generate an individualized, highly structured 7-day AI Meal Plan
export function generateAIMealPlan(preferences: AIMealPlannerPreferences): AIFullMealPlan {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const themeFocuses = [
    'Cellular Energy & Anti-Inflammatory Polyphenols',
    'Gut Microbiome Diversity & Soluble Prebiotic Fiber',
    'Cognitive Clarity, Omega-3s & Brain Health',
    'Cardiovascular Vitality & Blood Pressure Optimization',
    'Musculoskeletal Strength, Bone Density & Amino Acids',
    'Metabolic Balance & Steady Glycemic Modulation',
    'Immune Resilience & Cellular Repair Protocol'
  ];

  const days: AIDayPlan[] = [];

  const breakfasts = getEligibleMeals('breakfast', preferences);
  const morningSnacks = getEligibleMeals('morning_snack', preferences);
  const lunches = getEligibleMeals('lunch', preferences);
  const eveningSnacks = getEligibleMeals('evening_snack', preferences);
  const dinners = getEligibleMeals('dinner', preferences);
  const desserts = getEligibleMeals('dessert', preferences);

  for (let i = 0; i < 7; i++) {
    const bf = breakfasts[i % breakfasts.length];
    const ms = preferences.includeMorningSnack ? morningSnacks[i % morningSnacks.length] : undefined;
    const lu = lunches[i % lunches.length];
    const es = preferences.includeEveningSnack ? eveningSnacks[i % eveningSnacks.length] : undefined;
    const dn = dinners[i % dinners.length];
    const de = preferences.includeDessert ? desserts[i % desserts.length] : undefined;

    const dayMeals = [bf, ms, lu, es, dn, de].filter(Boolean) as AIMealItem[];

    const totalCalories = dayMeals.reduce((acc, m) => acc + m.calories, 0);
    const totalProteinG = dayMeals.reduce((acc, m) => acc + m.proteinG, 0);
    const totalCarbsG = dayMeals.reduce((acc, m) => acc + m.carbsG, 0);
    const totalFatG = dayMeals.reduce((acc, m) => acc + m.fatG, 0);
    const totalFiberG = dayMeals.reduce((acc, m) => acc + m.fiberG, 0);

    days.push({
      dayNumber: i + 1,
      dayName: dayNames[i],
      themeFocus: themeFocuses[i],
      meals: {
        breakfast: bf,
        morning_snack: ms,
        lunch: lu,
        evening_snack: es,
        dinner: dn,
        dessert: de
      },
      totalCalories,
      totalProteinG,
      totalCarbsG,
      totalFatG,
      totalFiberG,
      completedMealKeys: []
    });
  }

  // Safety guidelines tailored to age and health
  const safetyGuidance: string[] = [
    'Health-First Nourishment Principle: Nutrition plans prioritize balanced macronutrients, micronutrient diversity, and natural energy rather than restrictive dieting.',
    `Age-Specific Advisory (${preferences.ageGroup}): Growing children, adolescents, and older adults require consistent fuel, adequate calcium, iron, and healthy lipids for developmental and metabolic resilience. Never restrict essential calories without a pediatrician or registered dietitian.`,
    'Hydration Balance: Pair these wholesome meals with 2.0 to 3.0 Liters of pure water daily. Mineral and water intake support optimal digestion of whole-food fibers.',
    'Individual Tolerance & Allergies: Ensure all commercial ingredient labels are checked for undeclared allergens, cross-contamination, or personal sensitivities.'
  ];

  const smartShoppingList = generateSmartShoppingList(days, preferences.numberOfPeople);

  return {
    id: `ai-plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: `7-Day Personalized ${preferences.dietaryPattern} Protocol`,
    preferences,
    days,
    safetyGuidance,
    smartShoppingList
  };
}

// Smart Shopping List Generator combining ingredients across all 7 days in the exact 8 categories
export function generateSmartShoppingList(
  days: AIDayPlan[],
  numberOfPeople: number = 1
): {
  category: AIShoppingCategory;
  items: { name: string; totalAmount: number; unit: string; checked: boolean }[];
}[] {
  const categoryOrder: AIShoppingCategory[] = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Pulses',
    'Dairy',
    'Protein foods',
    'Spices',
    'Other ingredients'
  ];

  // Aggregation Map: category -> (name -> { amount, unit })
  const map: Record<AIShoppingCategory, Record<string, { amount: number; unit: string }>> = {
    'Vegetables': {},
    'Fruits': {},
    'Grains': {},
    'Pulses': {},
    'Dairy': {},
    'Protein foods': {},
    'Spices': {},
    'Other ingredients': {}
  };

  days.forEach(day => {
    const activeMeals = [
      day.meals.breakfast,
      day.meals.morning_snack,
      day.meals.lunch,
      day.meals.evening_snack,
      day.meals.dinner,
      day.meals.dessert
    ].filter(Boolean) as AIMealItem[];

    activeMeals.forEach(meal => {
      meal.ingredients.forEach(ing => {
        const cat = ing.category || 'Other ingredients';
        if (!map[cat]) {
          map[cat] = {};
        }

        const scaledAmount = Number((ing.amount * numberOfPeople).toFixed(1));
        if (map[cat][ing.name]) {
          map[cat][ing.name].amount = Number((map[cat][ing.name].amount + scaledAmount).toFixed(1));
        } else {
          map[cat][ing.name] = {
            amount: scaledAmount,
            unit: ing.unit
          };
        }
      });
    });
  });

  return categoryOrder.map(category => {
    const itemsRecord = map[category] || {};
    const items = Object.entries(itemsRecord).map(([name, data]) => ({
      name,
      totalAmount: data.amount,
      unit: data.unit,
      checked: false
    }));

    return {
      category,
      items
    };
  });
}
