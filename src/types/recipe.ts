/**
 * INTERFACE UNTUK MODEL DATA APLIKASI
 *
 * Di Modul 3 data resep tidak lagi ditulis manual (hardcoded), melainkan
 * diambil dari External API TheMealDB lalu dimasukkan ke dalam Object
 * yang bentuknya ditentukan oleh Interface di file ini.
 *
 * Interface = kontrak bentuk Object. Fungsi mapping di services/api.ts
 * mengubah JSON mentah API (field "strMeal", "idMeal", ...) menjadi
 * Object Recipe yang rapi (field "title", "id", ...) sesuai kontrak ini.
 * Keuntungannya: seluruh layar memakai nama field yang sama dan konsisten.
 */

/** Satu bahan masakan: nama bahan + takarannya, mis. { name: "Ayam", measure: "1 kg" } */
export interface Ingredient {
  name: string;
  measure: string;
}

/**
 * Ringkasan resep — data minimum untuk ditampilkan sebagai kartu daftar
 * (Beranda, Pencarian, Favorit). "id" bertipe number agar mudah dipakai
 * sebagai parameter dynamic route /recipes/[id].
 */
export interface RecipeSummary {
  id: number;
  title: string;
  category: string;
  image: string;
}

/**
 * Detail resep lengkap. Kata kunci "extends" berarti Recipe MEWARISI
 * semua field RecipeSummary lalu menambah field khusus halaman detail:
 * asal masakan, tag, link video, instruksi, dan daftar bahan.
 */
export interface Recipe extends RecipeSummary {
  area: string;
  tags: string[];
  youtube: string | null;
  instructions: string;
  ingredients: Ingredient[];
}
