import {
  fetchCategoriesFromApi,
  fetchMealDetailFromApi,
  fetchMealsByAreaFromApi,
  fetchMealsByCategoryFromApi,
  fetchRandomMealFromApi,
  mapMealDetail,
  mapMealSummary,
  searchMealsFromApi,
} from './api';
import {
  cachedFetch,
  cacheKey,
  listCacheKeys,
  readCacheEntry,
  stripCachePrefix,
  writeCache,
} from './cacheService';
import { Recipe, RecipeSummary } from '../types/recipe';

const TTL_LIST = 12 * 60 * 60 * 1000;
const TTL_DETAIL = 7 * 24 * 60 * 60 * 1000;

function toFriendlyError(error: unknown, fallback: string): Error {
  if (error instanceof Error && error.message.length > 0) {
    return error;
  }
  return new Error(fallback);
}

export async function getCategories(): Promise<string[]> {
  try {
    return await cachedFetch(
      cacheKey('categories'),
      async () => {
        const categories = await fetchCategoriesFromApi();
        return categories.map((category) => category.strCategory);
      },
      TTL_LIST,
    );
  } catch (error) {
    throw toFriendlyError(error, 'Gagal memuat kategori. Coba lagi ya.');
  }
}

export async function getRecipes(category: string): Promise<RecipeSummary[]> {
  try {
    return await cachedFetch(
      cacheKey('recipes', 'category', category),
      async () => {
        if (category === 'Semua') {
          const meals = await searchMealsFromApi('');
          return meals.map((meal) =>
            mapMealSummary(meal, meal.strCategory ?? 'Lainnya'),
          );
        }
        const meals = await fetchMealsByCategoryFromApi(category);
        return meals.map((meal) => mapMealSummary(meal, category));
      },
      TTL_LIST,
    );
  } catch (error) {
    throw toFriendlyError(error, 'Gagal memuat daftar resep. Coba lagi ya.');
  }
}

export async function getRecipesByArea(area: string): Promise<RecipeSummary[]> {
  try {
    return await cachedFetch(
      cacheKey('recipes', 'area', area),
      async () => {
        const meals = await fetchMealsByAreaFromApi(area);
        return meals.map((meal) => mapMealSummary(meal, area));
      },
      TTL_LIST,
    );
  } catch (error) {
    throw toFriendlyError(
      error,
      'Gagal memuat resep dari daerahmu. Coba lagi ya.',
    );
  }
}

export async function searchRecipes(query: string): Promise<RecipeSummary[]> {
  try {
    return await cachedFetch(
      cacheKey('recipes', 'search', query),
      async () => {
        const meals = await searchMealsFromApi(query);
        return meals.map((meal) =>
          mapMealSummary(meal, meal.strCategory ?? 'Lainnya'),
        );
      },
      TTL_LIST,
    );
  } catch (error) {
    throw toFriendlyError(error, 'Gagal mencari resep. Coba lagi ya.');
  }
}

export async function getRecipeById(id: number): Promise<Recipe> {
  try {
    return await cachedFetch(
      cacheKey('detail', String(id)),
      async () => {
        const meal = await fetchMealDetailFromApi(id);

        // meals null artinya ID tidak ketemu, lempar error saja
        if (!meal) {
          throw new Error('Resep tidak ditemukan');
        }
        return mapMealDetail(meal);
      },
      TTL_DETAIL,
    );
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

// Segarkan cache yang sudah basi di belakang layar, dipakai saat aplikasi
// kembali ke foreground. Gagal segarkan satu kunci tidak menggagalkan yang lain.
export async function refreshStaleCaches(): Promise<void> {
  const keys = await listCacheKeys();
  const now = Date.now();
  await Promise.all(
    keys.map(async (key) => {
      const rest = stripCachePrefix(key);
      const [kind, sub, ...tail] = rest.split(':');
      const arg = tail.join(':');
      try {
        if (kind === 'categories') {
          const entry = await readCacheEntry<string[]>(key);
          if (entry && now - entry.savedAt < TTL_LIST) {
            return;
          }
          const categories = await fetchCategoriesFromApi();
          await writeCache(
            key,
            categories.map((category) => category.strCategory),
          );
        } else if (kind === 'recipes' && sub === 'category') {
          const entry = await readCacheEntry<RecipeSummary[]>(key);
          if (entry && now - entry.savedAt < TTL_LIST) {
            return;
          }
          if (arg === 'Semua') {
            const meals = await searchMealsFromApi('');
            await writeCache(
              key,
              meals.map((meal) =>
                mapMealSummary(meal, meal.strCategory ?? 'Lainnya'),
              ),
            );
          } else {
            const meals = await fetchMealsByCategoryFromApi(arg);
            await writeCache(
              key,
              meals.map((meal) => mapMealSummary(meal, arg)),
            );
          }
        } else if (kind === 'recipes' && sub === 'area') {
          const entry = await readCacheEntry<RecipeSummary[]>(key);
          if (entry && now - entry.savedAt < TTL_LIST) {
            return;
          }
          const meals = await fetchMealsByAreaFromApi(arg);
          await writeCache(
            key,
            meals.map((meal) => mapMealSummary(meal, arg)),
          );
        } else if (kind === 'recipes' && sub === 'search') {
          const entry = await readCacheEntry<RecipeSummary[]>(key);
          if (entry && now - entry.savedAt < TTL_LIST) {
            return;
          }
          const meals = await searchMealsFromApi(arg);
          await writeCache(
            key,
            meals.map((meal) =>
              mapMealSummary(meal, meal.strCategory ?? 'Lainnya'),
            ),
          );
        } else if (kind === 'detail') {
          const entry = await readCacheEntry<Recipe>(key);
          if (entry && now - entry.savedAt < TTL_DETAIL) {
            return;
          }
          const meal = await fetchMealDetailFromApi(Number(arg));
          if (meal) {
            await writeCache(key, mapMealDetail(meal));
          }
        }
      } catch {
        // satu kunci gagal tidak boleh menggagalkan sisanya
      }
    }),
  );
}
