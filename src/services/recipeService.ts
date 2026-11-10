import {
  fetchCategoriesFromApi,
  fetchMealDetailFromApi,
  fetchMealsByCategoryFromApi,
  fetchRandomMealFromApi,
  mapMealDetail,
  mapMealSummary,
  searchMealsFromApi,
} from './api';
import { Recipe, RecipeSummary } from '../types/recipe';

function toFriendlyError(error: unknown, fallback: string): Error {
  if (error instanceof Error && error.message.length > 0) {
    return error;
  }
  return new Error(fallback);
}

export async function getCategories(): Promise<string[]> {
  try {
    const categories = await fetchCategoriesFromApi();
    return categories.map((category) => category.strCategory);
  } catch (error) {
    throw toFriendlyError(error, 'Gagal memuat kategori. Coba lagi ya.');
  }
}

export async function getRecipes(category: string): Promise<RecipeSummary[]> {
  try {
    if (category === 'Semua') {
      const meals = await searchMealsFromApi('');
      return meals.map((meal) =>
        mapMealSummary(meal, meal.strCategory ?? 'Lainnya'),
      );
    }

    const meals = await fetchMealsByCategoryFromApi(category);
    return meals.map((meal) => mapMealSummary(meal, category));
  } catch (error) {
    throw toFriendlyError(error, 'Gagal memuat daftar resep. Coba lagi ya.');
  }
}

export async function searchRecipes(query: string): Promise<RecipeSummary[]> {
  try {
    const meals = await searchMealsFromApi(query);
    return meals.map((meal) =>
      mapMealSummary(meal, meal.strCategory ?? 'Lainnya'),
    );
  } catch (error) {
    throw toFriendlyError(error, 'Gagal mencari resep. Coba lagi ya.');
  }
}

export async function getRecipeById(id: number): Promise<Recipe> {
  try {
    const meal = await fetchMealDetailFromApi(id);

    // meals null artinya ID tidak ketemu, lempar error saja
    if (!meal) {
      throw new Error('Resep tidak ditemukan');
    }

    return mapMealDetail(meal);
  } catch (error) {
    throw toFriendlyError(error, 'Gagal memuat detail resep. Coba lagi ya.');
  }
}

export function getRandomRecipe(): Promise<Recipe> {
  return fetchRandomMealFromApi()
    .then((meal) => {
      if (!meal) {
        throw new Error('Resep tidak ditemukan');
      }
      return mapMealDetail(meal);
    })
    .catch((error: unknown) => {
      throw toFriendlyError(
        error,
        'Gagal memuat resep pilihan. Coba lagi ya.',
      );
    });
}
