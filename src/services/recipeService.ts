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

/**
 * LAPISAN SERVICE APLIKASI
 *
 * Layar (screen) hanya memanggil fungsi-fungsi di file ini dan menerima
 * Object model aplikasi yang sudah rapi — layar tidak tahu menahu soal
 * URL API ataupun field mentah TheMealDB.
 *
 * Semua fungsi di sini adalah Custom Async Function: fungsi buatan sendiri
 * yang mengembalikan Promise. Sebagian besar ditulis dengan gaya
 * async/await; khusus getRandomRecipe ditulis dengan gaya .then()/.catch()
 * agar kedua gaya penulisan kode asynchronous bisa dibandingkan.
 */

/**
 * Pesan error yang ramah untuk pengguna.
 * Error teknis dari lapisan API dibungkus ulang di sini, sedangkan
 * pesan yang sudah jelas (mis. timeout) diteruskan apa adanya.
 */
function toFriendlyError(error: unknown, fallback: string): Error {
  if (error instanceof Error && error.message.length > 0) {
    return error;
  }
  return new Error(fallback);
}

/** Mengambil daftar nama kategori dari API. */
export async function getCategories(): Promise<string[]> {
  try {
    const categories = await fetchCategoriesFromApi();
    return categories.map((category) => category.strCategory);
  } catch (error) {
    // Error dilempar ulang (throw) agar layar bisa menampilkan pesan
    // kesalahan + tombol "Coba Lagi" lewat blok catch di useEffect-nya.
    throw toFriendlyError(error, 'Gagal memuat kategori. Coba lagi ya.');
  }
}

/**
 * Mengambil daftar resep untuk chip kategori di Beranda.
 * - 'Semua': memakai endpoint search dengan kata kunci kosong, yang
 *   mengembalikan daftar besar resep lengkap (ada field kategorinya).
 * - Kategori lain: memakai endpoint filter; karena hasilnya tidak
 *   membawa nama kategori, nama kategori diisi dari parameter.
 */
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

/** Mencari resep berdasarkan kata kunci nama masakan. */
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

/** Mengambil satu resep lengkap (detail) berdasarkan ID-nya. */
export async function getRecipeById(id: number): Promise<Recipe> {
  try {
    const meal = await fetchMealDetailFromApi(id);

    // API menjawab meals: null bila ID tidak ada — ini dianggap error
    // agar layar detail bisa menampilkan tampilan "tidak ditemukan".
    if (!meal) {
      throw new Error('Resep tidak ditemukan');
    }

    return mapMealDetail(meal);
  } catch (error) {
    throw toFriendlyError(error, 'Gagal memuat detail resep. Coba lagi ya.');
  }
}

/**
 * Mengambil satu resep acak untuk hero "Pilihan Hari Ini".
 *
 * Fungsi ini SENGAJA ditulis dengan gaya .then()/.catch() chaining,
 * TANPA async/await, sebagai pembanding gaya di atas:
 * - .then() menerima hasil saat Promise berstatus "fulfilled";
 * - .catch() menangkap Error saat Promise berstatus "rejected";
 * - nilai yang dikembalikan dari .then() diteruskan ke rantai berikutnya,
 *   dan fungsi ini tetap mengembalikan Promise<Recipe> ke pemanggilnya.
 *
 * Hasil akhirnya sama persis dengan gaya async/await — bedanya hanya
 * cara penulisannya: chaining menumpuk callback, async/await terbaca
 * seperti kode synchronous biasa.
 */
export function getRandomRecipe(): Promise<Recipe> {
  return fetchRandomMealFromApi()
    .then((meal) => {
      if (!meal) {
        // Melempar Error di dalam .then() sama dengan membuat Promise
        // menjadi rejected — Error ini ditangkap oleh .catch() di bawah.
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
