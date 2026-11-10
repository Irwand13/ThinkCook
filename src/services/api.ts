import {
  MealDbCategoriesResponse,
  MealDbCategory,
  MealDbMeal,
  MealDbMealSummary,
  MealDbMealsResponse,
} from '../types/api';
import { Ingredient, Recipe, RecipeSummary } from '../types/recipe';

/**
 * LAPISAN API MENTAH — External API TheMealDB
 *
 * File ini satu-satunya tempat yang tahu alamat & bentuk JSON TheMealDB.
 * Alurnya: fetch() mengambil JSON -> JSON dituang ke Interface types/api.ts
 * -> fungsi mapping mengubahnya menjadi Object model aplikasi
 * (types/recipe.ts). Layar tidak pernah menyentuh field mentah "str*".
 */

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

/** Batas waktu tunggu satu permintaan API: 10 detik. */
const TIMEOUT_MS = 10000;

/**
 * PRE-BUILT ASYNC FUNCTION + PROMISE.RACE + REJECT
 *
 * fetch() adalah fungsi async bawaan (pre-built): ia langsung mengembalikan
 * Promise dan berjalan di latar belakang tanpa memblokir UI.
 *
 * Masalahnya, fetch() bisa menggantung lama bila jaringan buruk. Di sini
 * fetch "dilombakan" dengan sebuah Promise timeout memakai Promise.race:
 * Promise mana pun yang selesai duluan yang dipakai. Bila 10 detik lewat,
 * Promise timeout memanggil `reject(...)` sehingga statusnya menjadi
 * "rejected" dan pemanggil menerima Error — bukan menunggu selamanya.
 */
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

  // Promise.race: hasil diambil dari Promise yang paling cepat selesai.
  return Promise.race([fetch(url), timeoutPromise]);
}

/**
 * CUSTOM ASYNC FUNCTION (async/await)
 *
 * Mengambil JSON dari satu URL lalu mengembalikannya sebagai Object
 * bertipe T (generic). Kata kunci `async` membuat fungsi ini selalu
 * mengembalikan Promise; `await` menunda baris berikutnya sampai
 * Promise selesai, tanpa memblokir tampilan.
 */
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new Error(`Server menjawab dengan status ${response.status}.`);
  }

  // response.json() juga async — hasilnya dituang ke Interface T.
  const data = (await response.json()) as T;
  return data;
}

/* ==================================================================
 * FUNGSI ENDPOINT — mengembalikan data mentah sesuai Interface API
 * ================================================================== */

/** GET /categories.php — daftar kategori masakan. */
export async function fetchCategoriesFromApi(): Promise<MealDbCategory[]> {
  const data = await fetchJson<MealDbCategoriesResponse>(
    `${BASE_URL}/categories.php`,
  );
  return data.categories ?? [];
}

/** GET /filter.php?c=... — ringkasan resep dalam satu kategori. */
export async function fetchMealsByCategoryFromApi(
  category: string,
): Promise<MealDbMealSummary[]> {
  const data = await fetchJson<MealDbMealsResponse>(
    `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`,
  );
  // API menjawab null bila kategori kosong — samakan menjadi array kosong.
  return (data.meals ?? []) as MealDbMealSummary[];
}

/** GET /search.php?s=... — pencarian resep lengkap berdasarkan nama. */
export async function searchMealsFromApi(query: string): Promise<MealDbMeal[]> {
  const data = await fetchJson<MealDbMealsResponse>(
    `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`,
  );
  return (data.meals ?? []) as MealDbMeal[];
}

/** GET /lookup.php?i=... — satu resep lengkap berdasarkan ID. */
export async function fetchMealDetailFromApi(
  id: number,
): Promise<MealDbMeal | null> {
  const data = await fetchJson<MealDbMealsResponse>(
    `${BASE_URL}/lookup.php?i=${id}`,
  );
  const meals = (data.meals ?? []) as MealDbMeal[];
  return meals.length > 0 ? meals[0] : null;
}

/** GET /random.php — satu resep lengkap yang dipilih acak oleh server. */
export async function fetchRandomMealFromApi(): Promise<MealDbMeal | null> {
  const data = await fetchJson<MealDbMealsResponse>(`${BASE_URL}/random.php`);
  const meals = (data.meals ?? []) as MealDbMeal[];
  return meals.length > 0 ? meals[0] : null;
}

/* ==================================================================
 * FUNGSI MAPPING — Object mentah API -> Object model aplikasi
 * ================================================================== */

/**
 * Mengubah ringkasan mentah API menjadi RecipeSummary.
 * Kategori diteruskan sebagai parameter karena endpoint /filter.php
 * tidak menyertakan nama kategori di dalam Object hasilnya.
 */
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

/**
 * Mengubah resep lengkap mentah API menjadi Recipe:
 * - bahan dibaca dari field dinamis strIngredient1..20 + strMeasure1..20,
 *   yang kosong dilewati;
 * - tag yang semula satu string dipisah koma menjadi array;
 * - field lain tinggal disalin dengan nama yang rapi.
 */
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
