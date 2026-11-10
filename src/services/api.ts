import {
  MealDbCategoriesResponse,
  MealDbCategory,
  MealDbMeal,
  MealDbMealSummary,
  MealDbMealsResponse,
} from '../types/api';
import { Ingredient, Recipe, RecipeSummary } from '../types/recipe';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const TIMEOUT_MS = 10000;

function fetchWithTimeout(
  url: string,
  timeoutMs: number = TIMEOUT_MS,
): Promise<Response> {
  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    setTimeout(() => {
      reject(
        new Error(
          `Permintaan ke server melebihi ${timeoutMs / 1000} detik. Periksa koneksi internet kamu.`,
        ),
      );
    }, timeoutMs);
  });

  return Promise.race([fetch(url), timeoutPromise]);
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new Error(`Server menjawab dengan status ${response.status}.`);
  }

  const data = (await response.json()) as T;
  return data;
}

export async function fetchCategoriesFromApi(): Promise<MealDbCategory[]> {
  const data = await fetchJson<MealDbCategoriesResponse>(
    `${BASE_URL}/categories.php`,
  );
  return data.categories ?? [];
}

export async function fetchMealsByCategoryFromApi(
  category: string,
): Promise<MealDbMealSummary[]> {
  const data = await fetchJson<MealDbMealsResponse>(
    `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`,
  );
  // API balas null kalau kategorinya kosong
  return (data.meals ?? []) as MealDbMealSummary[];
}

export async function searchMealsFromApi(query: string): Promise<MealDbMeal[]> {
  const data = await fetchJson<MealDbMealsResponse>(
    `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`,
  );
  return (data.meals ?? []) as MealDbMeal[];
}

export async function fetchMealDetailFromApi(
  id: number,
): Promise<MealDbMeal | null> {
  const data = await fetchJson<MealDbMealsResponse>(
    `${BASE_URL}/lookup.php?i=${id}`,
  );
  const meals = (data.meals ?? []) as MealDbMeal[];
  return meals.length > 0 ? meals[0] : null;
}

export async function fetchRandomMealFromApi(): Promise<MealDbMeal | null> {
  const data = await fetchJson<MealDbMealsResponse>(`${BASE_URL}/random.php`);
  const meals = (data.meals ?? []) as MealDbMeal[];
  return meals.length > 0 ? meals[0] : null;
}

export function mapMealSummary(
  meal: MealDbMealSummary,
  category: string,
): RecipeSummary {
  return {
    id: Number(meal.idMeal),
    title: meal.strMeal,
    category,
    image: meal.strMealThumb,
  };
}

export function mapMealDetail(meal: MealDbMeal): Recipe {
  const ingredients: Ingredient[] = [];

  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim() ?? '';

    if (name) {
      ingredients.push({ name, measure });
    }
  }

  const tags = meal.strTags
    ? meal.strTags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    : [];

  return {
    id: Number(meal.idMeal),
    title: meal.strMeal,
    category: meal.strCategory ?? 'Lainnya',
    image: meal.strMealThumb,
    area: meal.strArea ?? '-',
    tags,
    youtube: meal.strYoutube ? meal.strYoutube : null,
    instructions: meal.strInstructions ?? '',
    ingredients,
  };
}
