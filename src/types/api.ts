/**
 * INTERFACE UNTUK DATA MENTAH DARI EXTERNAL API (TheMealDB)
 *
 * Interface adalah "kontrak" bentuk Object di TypeScript: ia mendefinisikan
 * field apa saja yang ada pada sebuah Object beserta tipe datanya.
 * JSON yang datang dari API bersifat dinamis (tidak bertipe), jadi kita
 * tuangkan dulu ke Interface ini agar pemakaian datanya aman dan terbaca
 * jelas oleh TypeScript (kesalahan nama field langsung terdeteksi).
 *
 * Nama field di sini mengikuti persis nama field asli TheMealDB
 * (diawali "str", "id", dsb) karena ini data mentah SEBELUM di-mapping
 * menjadi model aplikasi di types/recipe.ts.
 */

/** Satu kategori pada respons GET /categories.php */
export interface MealDbCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

/**
 * Ringkasan satu resep pada respons GET /filter.php?c=<kategori>.
 * Endpoint filter hanya memberi 3 field ini (tanpa kategori & detail),
 * berbeda dengan endpoint search yang memberi Object resep lengkap.
 */
export interface MealDbMealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

/**
 * Satu resep lengkap pada respons /search.php, /lookup.php, dan /random.php.
 *
 * Field bahan tidak ditulis satu-satu (strIngredient1..strIngredient20 dan
 * strMeasure1..strMeasure20) melainkan ditampung dengan INDEX SIGNATURE
 * `[key: string]: string | null`, supaya kita bisa mengaksesnya secara
 * dinamis dalam loop: meal[`strIngredient${i}`].
 */
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

/** Bentuk Object respons GET /categories.php */
export interface MealDbCategoriesResponse {
  categories: MealDbCategory[];
}

/**
 * Bentuk Object respons endpoint-endpoint resep.
 * "meals" bisa bernilai null bila tidak ada hasil (bukan array kosong) —
 * inilah salah satu alasan data API wajib diperiksa sebelum dipakai.
 */
export interface MealDbMealsResponse {
  meals: (MealDbMeal | MealDbMealSummary)[] | null;
}
