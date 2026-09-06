import { Recipe } from '../../types';
import { RECIPES_1_100 } from './recipes1_100';
import { RECIPES_101_200 } from './recipes101_200';
import { RECIPES_201_300 } from './recipes201_300';
import { RECIPES_301_400 } from './recipes301_400';
import { RECIPES_401_500 } from './recipes401_500';
import { RECIPES_501_600 } from './recipes501_600';
import { RECIPES_601_700 } from './recipes601_700';
import { RECIPES_701_800 } from './recipes701_800';
import { RECIPES_801_900 } from './recipes801_900';
import { RECIPES_901_1000 } from './recipes901_1000';

// Comprehensive Master Catalog of 1,000 Healthy Homemade Recipes
export const ALL_1000_RECIPES: Recipe[] = [
  ...RECIPES_1_100,
  ...RECIPES_101_200,
  ...RECIPES_201_300,
  ...RECIPES_301_400,
  ...RECIPES_401_500,
  ...RECIPES_501_600,
  ...RECIPES_601_700,
  ...RECIPES_701_800,
  ...RECIPES_801_900,
  ...RECIPES_901_1000
];

export {
  RECIPES_1_100,
  RECIPES_101_200,
  RECIPES_201_300,
  RECIPES_301_400,
  RECIPES_401_500,
  RECIPES_501_600,
  RECIPES_601_700,
  RECIPES_701_800,
  RECIPES_801_900,
  RECIPES_901_1000
};

export const RECIPE_CATEGORY_NAMES = [
  "Healthy Breakfasts & Morning Foods",
  "Indian Vegetarian Main Meals",
  "Healthy Rice, Khichdi & Grain Meals",
  "Healthy Indian Roti, Paratha & Flatbreads",
  "Homemade Soups",
  "Healthy Salads, Sprouts & Chaat",
  "Healthy Homemade Snacks",
  "Healthy Non-Vegetarian Homemade Foods",
  "Healthy Homemade Dairy, Paneer, Tofu & Protein Foods",
  "Healthy Homemade Drinks, Desserts & Complete Bowls"
];
