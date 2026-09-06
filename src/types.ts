export type NavigationTab = 
  | 'home'
  | 'explore'
  | 'diseases'
  | 'medicines'
  | 'medical-tests'
  | 'nutrition'
  | 'recipes'
  | 'wellness'
  | 'calculators'
  | 'ai-assistant'
  | 'hospitals'
  | 'doctors'
  | 'appointments'
  | 'medical-map'
  | 'community'
  | 'news'
  | 'news-admin'
  | 'dashboard'
  | 'hospital-portal'
  | 'doctor-portal'
  | 'medauth'
  | 'pharmacy-portal'
  | 'privacy'
  | 'doctor-consent'
  | 'doctor-console'
  | 'my-history'
  | 'news-authority'
  | 'news-management'
  | 'auth'
  | 'terms'
  | 'privacy-policy';

/** Sub-view of the personal Dashboard that a navigation action can request. */
export type DashboardViewMode = 'details' | 'dashboard' | 'ehr' | 'saved';

export * from './types/auth';

export type LanguageCode = string;

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  bloodGroup?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  mrn?: string;
  dietaryPreferences: string[];
  healthGoals: string[];
  dailyCalorieTarget?: number;
  dailyWaterTargetMl?: number;
  allergies?: string[];
  savedRecipeIds?: string[];
  savedDiseaseIds?: string[];
  savedMedicineIds?: string[];
  createdAt: string;
  marketingConsent?: boolean;
  consent?: {
    termsVersion: string;
    privacyVersion: string;
    acceptedAt: string;
    jurisdiction?: string;
    method: 'signup_checkbox' | 'login_acknowledgement' | 'settings_reacceptance';
  };
  consentHistory?: {
    termsVersion: string;
    privacyVersion: string;
    acceptedAt: string;
    method: 'signup_checkbox' | 'login_acknowledgement' | 'settings_reacceptance';
  }[];
}

export interface PatientProfile {
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  bloodGroup: string;
  phoneNumber: string;
  dateOfBirth: string;
  photoUrl?: string;
  mrn: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export interface HealthCondition {
  id: string;
  title: string;
  category: string;
  summary: string;
  image?: string;
  imageType?: string;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  treatments: string[];
  whenToSeeDoctor: string;
  readTime: string;
  
  // Specific Clinical Monograph Schema
  medicalName?: string;
  commonName?: string;
  diseaseType?: string;
  bodySystem?: string;
  commonAgeGroup?: string;
  contagious?: string;
  severity?: string;
  curable?: string;
  vaccineAvailable?: string;
  commonRecoveryTime?: string;
  specialist?: string;
  
  // Detailed Symptom Staging
  earlySymptoms?: string[];
  commonSymptoms?: string[];
  lessCommonSymptoms?: string[];
  emergencyWarningSigns?: string[];
  
  // Etiology & Transmission
  howDoesItSpread?: string;
  riskFactors?: string[];
  
  // Clinical Diagnosis
  diagnosisMedicalHistory?: string;
  diagnosisPhysicalExam?: string;
  diagnosisAndTests?: string[];
  
  // Care & Therapeutics
  homeCare?: string[];
  symptomReliefMedicines?: string[];
  
  // Prognosis, Complications & Safety
  complications?: string[];
  recovery?: string;
  recoveryAndLiving?: string;
  whenToSeekEmergencyCare?: string;
  disclaimer?: string;
  
  // Extra Reference Data
  quickFacts?: { label: string; value: string }[];
  affectedBodyParts?: string[];
  typesOrStages?: { name: string; description: string }[];
  faqs?: { question: string; answer: string }[];
  relatedTopics?: string[];
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  therapeuticGroup?: string;
  prescriptionStatus?: string;
  dosageForms?: string[];
  whatIs?: string;
  description: string;
  uses: string[];
  dosage: string;
  adultDosage?: string;
  childrenDosage?: string;
  elderlyDosage?: string;
  missedDose?: string;
  overdose?: string;
  overuse?: string;
  sideEffects: string[];
  commonSideEffects?: string[];
  lessCommonSideEffects?: string[];
  rareSideEffects?: string[];
  seriousSideEffects?: string[];
  precautions: string[];
  overTheCounter: boolean;
  warnings: string;
  howToTake?: string[];
  howToUse?: string[];
  howToPrepare?: string[];
  drugInteractions?: string[];
  storage?: string[];
  alternatives?: string[];
  whoShouldNotTake?: string[];
  howItWorks?: string;
  safetyInformation?: string[];
  faqs?: { question: string; answer: string }[];
  whenToSeeDoctor?: string[];
  disclaimer?: string;
  image?: string;
  imageType?: 'tablet' | 'gel' | 'lotion' | 'liquid' | 'ors' | 'cream' | 'antacid' | 'syrup' | 'injection' | 'inhaler' | 'drops' | 'capsule' | 'patch';
}

export interface MedicalTest {
  id: string;
  name: string;
  category: string;
  purpose: string;
  normalRange: string;
  preparation: string;
  sampleType: string;
  timeToResults: string;
  description: string;
  
  // Extended Clinical Guide Details
  overview?: string;
  whatIsIt?: string;
  whyImportant?: string;
  howItWorks?: string;
  whyPerformed?: string[];
  conditionsDetected?: string[];
  whoShouldGetIt?: string[];
  whenNotInterpretedAlone?: string[];
  testPreparationChecklist?: string[];
  risksAndComplications?: string[];
  normalValuesDetails?: { title: string; range: string; interpretation: string }[];
  highInterpretation?: string[];
  lowInterpretation?: string[];
  factorsAffectingResults?: { factor: string; effect: string }[];
  advantagesAndBenefits?: string[];
  limitationsAndDisadvantages?: string[];
  postTestRecovery?: string;
  faqs?: { question: string; answer: string }[];

  // Clinical Laboratory Reference Blueprint Fields
  commonName?: string;
  abbreviation?: string;
  alternativeNames?: string[];
  subcategory?: string;
  specimenType?: string;
  collectionMethod?: string;
  department?: string;
  turnaroundTime?: string;
  units?: string;
  referenceRange?: string;
  ageSpecificRange?: string;
  sexSpecificRange?: { male?: string; female?: string };
  pregnancySpecificRange?: string;
  criticalValue?: string;
  clinicalPurpose?: string;
  whatItMeasures?: string;
  whyOrdered?: string[];
  highResultMeaning?: string;
  lowResultMeaning?: string;
  clinicalAssociations?: string[];
  preparationRequirements?: string;
  fastingRequirement?: boolean;
  medicationInterference?: string[];
  specimenHandling?: string;
  limitations?: string[];
  relatedTests?: string[];
  relatedPanels?: string[];
  interpretationRules?: {
    numeric?: {
      lowThreshold?: number;
      highThreshold?: number;
      criticalLow?: number;
      criticalHigh?: number;
      defaultUnit?: string;
      units?: string[];
      targetDirection?: 'normal_middle' | 'lower_better' | 'higher_better';
    };
    qualitative?: {
      expected?: string;
      abnormal?: string[];
      critical?: string[];
    };
  };
  patientFriendlyExplanation?: string;
  medicalDisclaimer?: string;
  popular?: boolean;
}

export interface RecipeFoodIngredient {
  foodName: string;
  quantity: string;
  foodId?: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  highlightNutrients: string[];
}

export interface RecipeMacroBreakdown {
  protein: {
    grams: number;
    percentKcal: number;
    quality: string;
    leucineG?: number;
    keyAminoAcids?: string[];
  };
  carbs: {
    totalG: number;
    netCarbsG: number;
    fiberG: number;
    solubleFiberG?: number;
    insolubleFiberG?: number;
    sugarsG?: number;
    glycemicIndex: number;
    glycemicLoad: number;
  };
  fats: {
    totalG: number;
    mufaG: number;
    pufaG: number;
    omega3Mg: number;
    saturatedG: number;
    transG: number;
    omega6To3Ratio?: string;
  };
  calorieDistribution: {
    proteinPercent: number;
    carbsPercent: number;
    fatPercent: number;
  };
}

export interface RecipeVitaminItem {
  code: string;
  name: string;
  amount: string;
  dvPercent: number;
  solubility: 'Water-Soluble' | 'Fat-Soluble';
  role: string;
  foodSourceInRecipe: string;
}

export interface RecipeMineralItem {
  symbol: string;
  name: string;
  amount: string;
  dvPercent: number;
  category: 'Macromineral' | 'Trace Mineral';
  role: string;
  foodSourceInRecipe: string;
  absorptionTip?: string;
}

export interface RecipePhytonutrientItem {
  name: string;
  chemicalClass: string;
  presence: string;
  sources: string[];
  mechanism: string;
  healthBenefit: string;
}

export interface RecipeDeficiencyRiskItem {
  diseaseName: string;
  icdOrCategory: string;
  deficientNutrient: string;
  description: string;
  symptoms: string[];
  highRiskGroups: string[];
}

export interface RecipeToxicityRiskItem {
  conditionName: string;
  excessFactor: string;
  upperTolerableLimit: string;
  description: string;
  risksAndSymptoms: string[];
  precautions: string[];
}

export interface RecipeDiseasePreventionItem {
  condition: string;
  evidenceLevel: 'Strong Clinical Evidence' | 'Meta-Analysis Backed' | 'Observational Consensus';
  mechanism: string;
}

export interface Recipe {
  /** Cuisine/menu grouping. Optional: not every seeded recipe carries one. */
  category?: string;
  /** Glycemic index of a standard serving, when clinically assessed. */
  glycemicIndex?: number;
  /** Glycemic load of a standard serving, when clinically assessed. */
  glycemicLoad?: number;
  id: string;
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  calories: number;
  protein: string;
  carbs: string;
  fats: string;
  netCarbs?: string;
  fiber?: string;
  sodiumMg?: number;
  potassiumMg?: number;
  calciumMg?: number;
  ironMg?: number;
  servings?: number;
  difficulty?: 'Easy' | 'Intermediate' | 'Advanced';
  cuisine?: string;
  dietTags: ('Heart-Healthy' | 'Diabetic-Friendly' | 'Keto' | 'Vegan' | 'Low-Sodium' | 'Gluten-Free' | 'Anti-Inflammatory' | 'High-Protein' | 'Renal-Safe' | 'Low-FODMAP' | 'Mediterranean')[];
  ingredients: string[];
  instructions: string[];
  imageUrl: string;
  healthBenefits?: string[];
  chefTips?: string[];
  allergenWarnings?: string[];
  equipmentNeeded?: string[];
  microsHighlight?: { label: string; amount: string; dv: string }[];
  
  // Extended Clinical & Comprehensive Nutritional Facts
  foodIngredientsBreakdown?: RecipeFoodIngredient[];
  macroBreakdown?: RecipeMacroBreakdown;
  vitaminDirectory?: RecipeVitaminItem[];
  essentialMinerals?: RecipeMineralItem[];
  phytonutrients?: RecipePhytonutrientItem[];
  absorptionSynergies?: { title: string; mechanism: string; impact: string }[];
  whatIfEatLess?: {
    title: string;
    riskSummary: string;
    associatedDiseases: RecipeDeficiencyRiskItem[];
    earlyWarningSigns: string[];
  };
  whatIfEatMore?: {
    title: string;
    excessSummary: string;
    associatedRisks: RecipeToxicityRiskItem[];
    safeIntakeGuidance: string;
  };
  diseasesPrevented?: RecipeDiseasePreventionItem[];
}

export interface NutritionFood {
  id: string;
  name: string;
  category: 'Vegetables' | 'Fruits' | 'Whole Grains' | 'Proteins & Seafood' | 'Legumes & Beans' | 'Dairy & Alternatives' | 'Nuts & Seeds' | 'Fats & Healthy Oils' | 'Herbs & Superfoods';
  servingSize: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fiberG: number;
  sugarsG: number;
  fatG: number;
  saturatedFatG: number;
  monounsaturatedFatG: number;
  polyunsaturatedFatG: number;
  glycemicIndex: number;
  glycemicLoad: number;
  sodiumMg?: number;
  vitamins: { name: string; amount: string; dvPercent: number }[];
  minerals: { name: string; amount: string; dvPercent: number }[];
  keyHealthBenefits: string[];
  therapeuticSuitability: string[];
  allergenFlags?: string[];
  bestPairings?: string[];
  imageUrl: string;
}

export interface VitaminDetail {
  id: string;
  code: string;
  name: string;
  chemicalName: string;
  type: 'Fat-Soluble' | 'Water-Soluble';
  rdaMen: string;
  rdaWomen: string;
  rdaPregnancy?: string;
  upperLimit: string;
  primaryFunctions: string[];
  topFoodSources: { food: string; amountPerServing: string; serving: string }[];
  absorptionAndBioavailability: string;
  deficiencyDisorder: string;
  deficiencySymptoms: string[];
  toxicityRisk: string;
  toxicitySymptoms: string[];
  clinicalSignificance: string;
  bestTakenWith: string;
}

export interface MineralDetail {
  id: string;
  name: string;
  chemicalSymbol: string;
  type: 'Macromineral' | 'Trace Mineral';
  rdaMen: string;
  rdaWomen: string;
  upperLimit: string;
  primaryFunctions: string[];
  topFoodSources: { food: string; amountPerServing: string; serving: string }[];
  absorptionFactors: string;
  deficiencyDisorder: string;
  deficiencySymptoms: string[];
  toxicityRisk: string;
  toxicitySymptoms: string[];
  clinicalSignificance: string;
}

export interface MacronutrientInfo {
  id: string;
  name: string;
  category: 'Protein' | 'Carbohydrate' | 'Fat & Lipid' | 'Water & Hydration';
  caloriesPerGram: number;
  recommendedPercentOfDailyCalories: string;
  idealDailyGramsAvg: string;
  subtypes: { name: string; description: string; healthySources: string[]; healthImpact: string }[];
  keyPhysiologicalRoles: string[];
  optimalTimingAndIntake: string;
  healthRisksOfDeficiency: string;
  healthRisksOfExcess: string;
}

export interface MicronutrientSynergy {
  id: string;
  title: string;
  type: 'Synergy (Enhancing)' | 'Antagonism (Inhibiting)';
  nutrientA: string;
  nutrientB: string;
  mechanism: string;
  clinicalAdvice: string;
  mealExample: string;
}

export interface MealPlanDay {
  day: number;
  dayName: string;
  totalCalories: number;
  macros: { protein: string; carbs: string; fat: string; fiber: string };
  breakfast: { name: string; calories: number; description: string; recipeId?: string };
  lunch: { name: string; calories: number; description: string; recipeId?: string };
  dinner: { name: string; calories: number; description: string; recipeId?: string };
  snack: { name: string; calories: number; description: string };
}

export type AIMealCategory = 'breakfast' | 'morning_snack' | 'lunch' | 'evening_snack' | 'dinner' | 'dessert';

export type AIShoppingCategory = 
  | 'Vegetables' 
  | 'Fruits' 
  | 'Grains' 
  | 'Pulses' 
  | 'Dairy' 
  | 'Protein foods' 
  | 'Spices' 
  | 'Other ingredients';

export interface AIMealIngredient {
  name: string;
  amount: number;
  unit: string;
  category: AIShoppingCategory;
}

export interface AIMealItem {
  id: string;
  category: AIMealCategory;
  name: string;
  description: string;
  portionSize: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  keyVitamins: string[];
  keyMinerals: string[];
  ingredients: AIMealIngredient[];
  prepTimeMinutes: number;
  dietaryPattern: ('Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Pescatarian' | 'Eggetarian' | 'Plant-Forward')[];
  cuisine: string;
  allergens: string[];
  recipeId?: string;
}

export interface AIDayPlan {
  dayNumber: number;
  dayName: string;
  themeFocus: string;
  meals: {
    breakfast: AIMealItem;
    morning_snack?: AIMealItem;
    lunch: AIMealItem;
    evening_snack?: AIMealItem;
    dinner: AIMealItem;
    dessert?: AIMealItem;
  };
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  totalFiberG: number;
  completedMealKeys: string[];
}

export interface AIMealPlannerPreferences {
  ageGroup: 'Toddlers (1-3 yrs)' | 'Children (4-8 yrs)' | 'Youth / Pre-teens (9-13 yrs)' | 'Teenagers (14-18 yrs)' | 'Young Adults (19-30 yrs)' | 'Adults (31-50 yrs)' | 'Mature Adults (51-70 yrs)' | 'Seniors (70+ yrs)';
  dietaryPattern: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Pescatarian' | 'Eggetarian' | 'Plant-Forward';
  foodPreferences: string[];
  allergies: string[];
  cuisinePreference: 'Mediterranean' | 'Indian' | 'East & Southeast Asian' | 'Mexican & Latin' | 'Continental & Western' | 'Middle Eastern' | 'Global Fusion';
  numberOfPeople: number;
  budget: 'Economical / Budget-Friendly' | 'Moderate / Everyday Balanced' | 'Premium / Gourmet';
  cookingTime: 'Quick (<15 mins)' | 'Moderate (15-30 mins)' | 'Extended (30-45 mins)' | 'Batch Cooking (45+ mins)';
  activityLevel: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active' | 'High-Demand Athletic';
  includeMorningSnack: boolean;
  includeEveningSnack: boolean;
  includeDessert: boolean;
}

export interface AIFullMealPlan {
  id: string;
  createdAt: string;
  title: string;
  preferences: AIMealPlannerPreferences;
  days: AIDayPlan[];
  safetyGuidance: string[];
  smartShoppingList: {
    category: AIShoppingCategory;
    items: { name: string; totalAmount: number; unit: string; checked: boolean }[];
  }[];
}

export interface MealPlan {
  id: string;
  title: string;
  targetCondition: string;
  description: string;
  calorieRange: string;
  keyPrinciples: string[];
  idealFor: string[];
  days: MealPlanDay[];
  weeklyGroceryList: { category: string; items: string[] }[];
}

export interface FoodInteraction {
  id: string;
  title: string;
  category: 'Food-Drug Interaction' | 'Nutrient-Nutrient Interaction' | 'Condition-Food Warning' | 'Supplement-Drug Interaction' | 'Alcohol-Drug Interaction';
  severity: 'Severe (Contraindicated)' | 'Moderate (Space 2-4 Hours)' | 'Beneficial (Synergistic)' | 'Minor / Monitoring' | 'Informational';
  actionBadge?: 'Avoid Combination' | 'Separate Timing' | 'Maintain Consistency' | 'Monitor & Adjust' | 'Ask Clinician' | 'Informational';
  primaryItem: string;
  interactingWith: string;
  mechanism: string;
  mechanismType?: 'Metabolism (CYP450 / Transporters)' | 'Absorption & Chelation' | 'Pharmacodynamic Antagonism/Synergy' | 'Renal & Electrolyte Clearance' | 'Gastrointestinal & Motility';
  clinicalImpact: string;
  actionableGuidance: string;
  patientExplanation?: string;
  clinicalPharmacology?: string;
  timingGuidance?: string;
  evidenceLevel?: 'High (Clinical Studies / FDA Label)' | 'Moderate (Pharmacokinetic Trials)' | 'Limited / Observational';
  drugClass?: string;
  foodCategory?: string;
  foodEntities?: string[];
  drugEntities?: string[];
  references?: { title: string; source: string; year: string; url?: string }[];
  riskModifiers?: string[];
}

export interface DietaryGuideline {
  id: string;
  authority: string;
  targetGroup: string;
  dailyCaloricTarget: string;
  macroDistribution: { protein: string; carbs: string; fats: string; fiber: string };
  sodiumLimit: string;
  addedSugarLimit: string;
  saturatedFatLimit: string;
  coreRecommendations: string[];
  foodGroupServings: { group: string; dailyServings: string; examples: string }[];
}

export interface DeficiencyDisease {
  id: string;
  name: string;
  deficientNutrient: string;
  clinicalDescription: string;
  icdCode?: string;
  highRiskPopulations: string[];
  earlySigns: string[];
  advancedSymptoms: string[];
  longTermComplications: string[];
  diagnosticLaboratoryTests: string[];
  therapeuticDietProtocol: { foodGroup: string; recommendations: string[] };
  recoveryTimeline: string;
}

export interface ToxicityDisease {
  id: string;
  name: string;
  excessNutrientOrAgent: string;
  pathophysiology: string;
  triggerFactors: string[];
  toxicThreshold: string;
  acuteSymptoms: string[];
  chronicManifestations: string[];
  targetOrgansAffected: string[];
  diagnosticWorkup: string[];
  clinicalManagement: string[];
  preventiveDietaryCaps: string;
}

export interface Hospital {
  id: string;
  globalHealthId: string;
  name: string;
  country: string;
  city: string;
  location: string;
  type: 'Multi-Specialty Hospital' | 'Super-Specialty Hospital' | 'Teaching Hospital' | 'University Hospital';
  traumaLevel: 'Level I' | 'Level II' | 'Level III';
  verified: boolean;
  rating: number;
  totalBeds: number;
  icuBeds: number;
  surgeriesPerYear: string;
  specialties: string[];
  emergencyServices: boolean;
  contact: string;
  address: string;
  imageUrl: string;
  description: string;
  officialLegalName?: string;
  yearEstablished?: number;
  ownership?: string;
  hospitalNetwork?: string;
  coordinates?: { lat: string; lng: string };
  emergencyHotline?: string;
  mainHotline?: { phone: string; email: string; hours: string; languages: string };
  internationalCare?: { phone: string; email: string; hours: string; languages: string };
  operatingHours?: { hospitalEmergency: string; clinics: string; radiologyLabs: string };
  accreditations?: string[];
  insurancePartners?: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  rating: number;
  experienceYears: number;
  availability: string;
  consultationFee: string;
  bio: string;
  title?: string;
  degree?: string;
  /** Qualifications summary, e.g. 'MBBS, MD'. Populated from portal rosters. */
  education?: string;
  fellowships?: string[];
  licenseNumber?: string;
  languages?: string[];
  nextAvailableSlot?: string;
  availableSlots?: string[];
  telehealthAvailable?: boolean;
  inPersonAvailable?: boolean;
  totalPatientsTreated?: string;
  satisfactionRate?: number;
  imageUrl?: string;
}

export type CommunityPostType = 'discussion' | 'question' | 'experience' | 'poll';

export interface CommunityReply {
  id: string;
  author: string;
  authorRole: 'member' | 'verified_professional' | 'caregiver' | 'moderator';
  authorSpecialty?: string;
  content: string;
  timestamp: string;
  upvotes: number;
  isHelpful?: boolean;
}

export interface CommunityPollOption {
  id: string;
  text: string;
  votes: number;
}

export interface CommunityPoll {
  question: string;
  options: CommunityPollOption[];
  totalVotes: number;
  hasVoted?: boolean;
  userSelectedOption?: string;
}

export interface ForumPost {
  id: string;
  title: string;
  author: string;
  authorRole?: 'member' | 'verified_professional' | 'caregiver' | 'moderator';
  authorAvatar?: string;
  category: string;
  content: string;
  postType?: CommunityPostType;
  tags?: string[];
  upvotes: number;
  repliesCount: number;
  viewsCount?: number;
  isSaved?: boolean;
  isFollowed?: boolean;
  isAnswered?: boolean;
  timestamp: string;
  poll?: CommunityPoll;
  replies: CommunityReply[];
}

export type NewsStatus = 
  | 'draft'
  | 'pending_editor'
  | 'pending_medical'
  | 'changes_requested'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'archived'
  | 'rejected'
  | 'trash';

export type StaffRole = 
  | 'SUPER_ADMIN'
  | 'NEWS_ADMIN'
  | 'EDITOR'
  | 'REVIEWER'
  | 'PUBLISHER'
  | 'AUTHOR';

export type StaffPermission =
  | 'news.view'
  | 'news.create'
  | 'news.edit'
  | 'news.delete'
  | 'news.permanent_delete'
  | 'news.archive'
  | 'news.restore'
  | 'news.publish'
  | 'news.unpublish'
  | 'news.schedule'
  | 'news.cancel_schedule'
  | 'news.review'
  | 'news.approve'
  | 'news.reject'
  | 'news.request_changes'
  | 'news.manage_categories'
  | 'news.manage_tags'
  | 'news.manage_authors'
  | 'news.manage_featured'
  | 'news.manage_breaking_news'
  | 'news.manage_media'
  | 'news.manage_seo'
  | 'news.manage_comments'
  | 'news.view_analytics'
  | 'news.view_audit_logs'
  | 'news.export'
  | 'news.manage_permissions'
  | 'news.admin_override';

export type StaffAccountStatus = 'active' | 'pending_approval' | 'suspended' | 'disabled' | 'expired';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: StaffRole;
  status: StaffAccountStatus;
  permissions: StaffPermission[];
  assignedCategories?: string[];
  assignedArticleIds?: string[];
  accountCreated: string;
  lastLogin?: string;
  accessExpiry?: string;
  mfaEnabled?: boolean;
  failedLoginAttempts?: number;
  lockoutUntil?: string;
  avatarUrl?: string;
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  actorEmail?: string;
  action: string;
  targetType: 'article' | 'staff' | 'permission' | 'system' | 'breaking_news' | 'category' | 'auth' | 'settings' | 'security';
  targetId?: string;
  targetTitle?: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
  status: 'success' | 'denied' | 'failed';
  ipAddress?: string;
}

export interface InternalNote {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  timestamp: string;
  message: string;
  resolved?: boolean;
}

export type NewsEvidenceStatus = 
  | 'peer-reviewed'
  | 'clinical-trial'
  | 'phase-3-trial'
  | 'meta-analysis'
  | 'systematic-review'
  | 'government'
  | 'professional-org'
  | 'institutional'
  | 'preliminary'
  | 'news-report'
  | 'other';

export type NewsEvidenceLevel = 'High' | 'Moderate' | 'Preliminary';

export type NewsType = 
  | 'Medical Breakthrough'
  | 'Research Update'
  | 'Disease News'
  | 'Medicine Update'
  | 'Drug Safety'
  | 'Nutrition News'
  | 'Public Health'
  | 'Health Technology'
  | 'Medical Device'
  | 'Vaccination'
  | 'Wellness'
  | 'Global Health'
  | 'Healthcare Policy';

export interface NewsCategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  subcategories: string[];
  articleCount?: number;
  color?: string;
}

export interface NewsAuthorItem {
  id: string;
  name: string;
  role: 'Medical Editor' | 'Chief Medical Officer' | 'Clinical Reviewer' | 'Health Journalist' | 'Admin';
  credentials?: string;
  affiliation?: string;
  avatarUrl?: string;
  email?: string;
  bio?: string;
  articleCount?: number;
}

export interface NewsSourceItem {
  id: string;
  name: string;
  publicationType: 'Peer-Reviewed Journal' | 'Government Agency' | 'Global Health Body' | 'Academic Institution' | 'Medical Press';
  websiteUrl: string;
  credibilityScore: number; // e.g. 98%
  impactFactor?: string;
  headquarters?: string;
}

export interface NewsMediaItem {
  id: string;
  filename: string;
  url: string;
  altText: string;
  caption: string;
  license: string;
  source: string;
  uploadedDate: string;
  uploadedBy: string;
  dimensions?: string;
  fileSize?: string;
  usageCount: number;
}

export interface NewsArticleRevision {
  version: number;
  date: string;
  editedBy: string;
  authorRole: string;
  changeSummary: string;
  titleSnapshot: string;
  contentSnapshot: string;
}

export interface NewsReviewComment {
  id: string;
  reviewerName: string;
  reviewerRole: string;
  reviewerAvatar?: string;
  timestamp: string;
  type: 'changes_requested' | 'approved' | 'editorial_note';
  comment: string;
  resolved?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  shortDescription?: string;
  source: string;
  originalPublication?: string;
  date: string;
  lastUpdated?: string;
  category: string;
  subcategory?: string;
  newsType?: NewsType;
  summary: string;
  content: string;
  readTime: string;
  readTimeMinutes?: number;
  
  // Visual Media
  featuredImage?: string;
  imageAlt?: string;
  imageCaption?: string;

  // Editorial & Medical Review
  author: string;
  authorId?: string;
  medicalReviewer?: string;
  medicalReviewerCredentials?: string;
  medicalReviewerId?: string;
  
  // Evidence & Scientific Validation
  evidenceStatus?: NewsEvidenceStatus;
  evidenceLevel?: NewsEvidenceLevel;
  researchType?: string;
  studyDoi?: string;
  clinicalTrialId?: string;
  
  // Medical Disclaimer
  showMedicalDisclaimer?: boolean;
  customDisclaimer?: string;

  // SEO
  seoTitle?: string;
  metaDescription?: string;
  slug?: string;
  focusKeywords?: string[];
  canonicalUrl?: string;

  // Connected Ecosystem
  relatedDiseases?: string[];
  relatedMedicines?: string[];
  relatedMedicalTests?: string[];
  relatedNutritionTopics?: string[];
  relatedArticleIds?: string[];

  // Publishing & Placement
  status: NewsStatus;
  visibility: 'Public' | 'public' | 'Medical Professionals Only' | 'Internal Draft';
  publishTiming?: 'immediate' | 'scheduled';
  scheduledDate?: string;
  scheduledTime?: string;
  timezone?: string;
  
  // High Priority Placements
  isFeatured?: boolean;
  featurePriority?: number;
  featuredUntil?: string;
  isBreaking?: boolean;
  breakingExpires?: string;
  isTrending?: boolean;

  // Analytics Metrics
  viewsCount?: number;
  uniqueVisitors?: number;
  averageReadTime?: string;
  completionRate?: number;
  sharesCount?: number;
  savesCount?: number;

  // Audit & Workflow
  revisions?: NewsArticleRevision[];
  reviewComments?: NewsReviewComment[];
  internalNotes?: InternalNote[];
  rejectionReason?: string;
  assignedReviewerId?: string;
  assignedReviewerName?: string;
  assignedReviewerRole?: string;
  assignedEditorId?: string;
  deletedAt?: string;
  deletedBy?: string;
  previousStatusBeforeTrash?: NewsStatus;
  archivedAt?: string;
  archivedBy?: string;
  archiveReason?: string;
  tags?: string[];
}

export type ResearchQuestionFormat = 
  | 'mcq' 
  | 'clinical_scenario' 
  | 'best_answer' 
  | 'true_false' 
  | 'choose_two' 
  | 'research_insight' 
  | 'key_finding' 
  | 'what_changed';

export type ResearchDifficulty = 'Easy' | 'Moderate' | 'Advanced' | 'Expert';

export interface ResearchOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface ResearchEvidenceSummary {
  populationAndSample?: string;
  interventionOrExposure?: string;
  comparator?: string;
  primaryOutcome?: string;
  mainFinding: string;
  clinicalSignificance: string;
  limitations?: string;
  evidenceLevel: 'Level I (RCT / Meta-Analysis)' | 'Level II (Cohort / Controlled)' | 'Level III (Observational / Series)' | 'Regulatory / Guideline';
  studyDoi?: string;
  journalName: string;
  publishedDate: string;
  authorsList?: string;
}

export interface HealthNewsQuestion {
  id: string;
  articleId: string;
  articleTitle: string;
  articleSource: string;
  articleUrl?: string;
  articleImageUrl?: string;
  articleDate: string;
  articleSummary?: string;
  specialty: string;
  topic: string;
  studyType: string;
  format: ResearchQuestionFormat;
  difficulty: ResearchDifficulty;
  questionText: string;
  scenarioContext?: string;
  options: ResearchOption[];
  correctOptionIds: string[]; // Supports single or multiple correct options (e.g. choose_two)
  explanation: string;
  evidenceSummary: ResearchEvidenceSummary;
  qualityScore: number;
  status: 'active' | 'pending_review' | 'archived' | 'disabled';
  aiGenerated: boolean;
  generatedAt: string;
  validatedAt: string;
  version: number;
  viewsCount: number;
  attemptsCount: number;
  correctAttemptsCount: number;
}

export interface QuestionViewRecord {
  id: string;
  sessionId: string;
  questionId: string;
  visitNumber: number;
  viewedAt: string;
  answeredAt?: string;
  selectedOptionIds?: string[];
  isCorrect?: boolean;
  timeSpentSeconds?: number;
}

export interface MedicalLiteracyChallenge {
  id: string;
  newsArticleId?: string;
  newsHeadline: string;
  newsSource: string;
  newsDate: string;
  category: string;
  questionType: 'Clinical Trial Finding' | 'Mechanistic Physiology' | 'Preventive Guideline' | 'Pharmacology & Safety' | 'Metabolic Science' | 'Longevity & Cellular Health' | 'Biomarkers & Diagnostics';
  difficulty: 'Standard' | 'Clinical' | 'Expert';
  question: string;
  options: [string, string, string, string];
  correctIdx: number;
  explanation: string;
  clinicalInsight: string;
  tags: string[];
}

export interface UserHealthMetrics {
  waterDrankMl: number;
  waterGoalMl: number;
  weightKg: number;
  systolicBp: number;
  diastolicBp: number;
  savedItemIds: string[];
  loggedMedications: { id: string; name: string; time: string; taken: boolean }[];
}

// Wellness & Fitness Domain Types
export interface WellnessModule {
  id: string;
  title: string;
  category: 'wellness' | 'fitness';
  subCategory: string;
  icon: string;
  summary: string;
  keyBenefits: string[];
  readTime: string;
  practicalSteps: string[];
  scientificBacking: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: 'Bodyweight' | 'Dumbbells' | 'Barbell' | 'Cable/Machine' | 'Kettlebell' | 'Resistance Bands' | 'Mat';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Upper Body' | 'Lower Body' | 'Core' | 'Cardio & HIIT' | 'Full Body';
  instructions: string[];
  formCues: string[];
  commonMistakes: string[];
  tempo: string;
  targetSetsReps: string;
  imageUrl?: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  frequency: string;
  durationWeeks: number;
  sessionDurationMin: number;
  goal: string;
  description: string;
  overview: string[];
  schedule: {
    day: string;
    focus: string;
    exercises: { exerciseName: string; sets: string; reps: string; restSec: number; notes?: string }[];
  }[];
}

export interface YogaPose {
  id: string;
  englishName: string;
  sanskritName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Standing' | 'Seated' | 'Backbend' | 'Inversion' | 'Restorative' | 'Core';
  benefits: string[];
  alignmentCues: string[];
  breathingTip: string;
  contraindications: string[];
  imageUrl: string;
}

export interface MuscleGroupInfo {
  id: string;
  name: string;
  region: 'Upper Body' | 'Core' | 'Lower Body';
  anatomicalFunction: string;
  primaryExercises: string[];
  isolationExercises: string[];
  stretchTechnique: string;
  injuryPreventionTip: string;
}

