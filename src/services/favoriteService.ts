import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecipeSummary } from '../types/recipe';

const FAVORITES_KEY = 'thinkcook:favorites';

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

async function saveFavorites(favorites: RecipeSummary[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export async function addFavorite(recipe: RecipeSummary): Promise<void> {
  try {
    const favorites = await getFavorites();
    if (!favorites.some((fav) => fav.id === recipe.id)) {
      await saveFavorites([...favorites, recipe]);
    }
  } catch {
    // gagal simpan favorit tidak usah bikin crash
  }
}

export async function removeFavorite(id: number): Promise<void> {
  try {
    const favorites = await getFavorites();
    await saveFavorites(favorites.filter((fav) => fav.id !== id));
  } catch {
  }
}

export async function isFavorite(id: number): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.some((fav) => fav.id === id);
}

export async function toggleFavorite(recipe: RecipeSummary): Promise<boolean> {
  const favorites = await getFavorites();

  if (favorites.some((fav) => fav.id === recipe.id)) {
    await saveFavorites(favorites.filter((fav) => fav.id !== recipe.id));
    return false;
  }

  await saveFavorites([...favorites, recipe]);
  return true;
}
