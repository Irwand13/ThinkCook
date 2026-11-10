import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecipeSummary } from '../types/recipe';

/**
 * SERVICE FAVORIT — penyimpanan lokal dengan AsyncStorage
 *
 * Method-method AsyncStorage (getItem, setItem) adalah contoh PRE-BUILT
 * ASYNC FUNCTION: fungsi asynchronous yang sudah disediakan library.
 * Keduanya mengembalikan Promise karena membaca/menulis ke penyimpanan
 * perangkat butuh waktu — hasilnya tidak tersedia seketika.
 *
 * Favorit disimpan sebagai satu string JSON berisi array RecipeSummary
 * di bawah satu key tetap. Karena datanya lokal di perangkat, favorit
 * tetap ada walaupun aplikasi ditutup (berbeda dengan state React).
 */

const FAVORITES_KEY = 'thinkcook:favorites';

/**
 * Membaca seluruh resep favorit.
 * Bila penyimpanan kosong atau isinya rusak, dikembalikan array kosong
 * (bukan Error) supaya layar Favorit tidak pernah crash.
 */
export async function getFavorites(): Promise<RecipeSummary[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as RecipeSummary[];
  } catch {
    return [];
  }
}

/** Menulis ulang seluruh daftar favorit ke penyimpanan. */
async function saveFavorites(favorites: RecipeSummary[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

/** Menambah satu resep ke favorit (tidak dobel bila sudah ada). */
export async function addFavorite(recipe: RecipeSummary): Promise<void> {
  try {
    const favorites = await getFavorites();
    if (!favorites.some((fav) => fav.id === recipe.id)) {
      await saveFavorites([...favorites, recipe]);
    }
  } catch {
    // Gagal menyimpan favorit tidak boleh membuat aplikasi crash.
  }
}

/** Menghapus satu resep dari favorit berdasarkan ID-nya. */
export async function removeFavorite(id: number): Promise<void> {
  try {
    const favorites = await getFavorites();
    await saveFavorites(favorites.filter((fav) => fav.id !== id));
  } catch {
    // Diamkan: status di layar akan tersinkron pada pemuatan berikutnya.
  }
}

/** Memeriksa apakah satu resep sudah ada di favorit. */
export async function isFavorite(id: number): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.some((fav) => fav.id === id);
}

/**
 * Membalik status favorit satu resep: ditambah bila belum favorit,
 * dihapus bila sudah. Mengembalikan status favorit TERBARU agar
 * pemanggil (tombol hati) bisa langsung memperbarui tampilannya.
 */
export async function toggleFavorite(recipe: RecipeSummary): Promise<boolean> {
  const favorites = await getFavorites();

  if (favorites.some((fav) => fav.id === recipe.id)) {
    await saveFavorites(favorites.filter((fav) => fav.id !== recipe.id));
    return false;
  }

  await saveFavorites([...favorites, recipe]);
  return true;
}
