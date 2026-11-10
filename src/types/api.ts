export interface MealDbCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface MealDbMealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

// strIngredient1..20 dan strMeasure1..20 ditampung index signature di bawah
export interface MealDbMeal {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  [key: string]: string | null;
}

export interface MealDbCategoriesResponse {
  categories: MealDbCategory[];
}

export interface MealDbMealsResponse {
  meals: (MealDbMeal | MealDbMealSummary)[] | null;
}
