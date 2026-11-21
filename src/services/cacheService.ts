import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'thinkcook:cache:';

interface CacheEntry<T> {
  value: T;
  savedAt: number;
}

export function cacheKey(...parts: string[]): string {
  return PREFIX + parts.join(':');
}

export async function readCacheEntry<T>(key: string): Promise<CacheEntry<T> | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as CacheEntry<T>;
  } catch {
    return null;
  }
}

export async function readCache<T>(key: string): Promise<T | null> {
  const entry = await readCacheEntry<T>(key);
  return entry ? entry.value : null;
}

export async function writeCache<T>(key: string, value: T): Promise<void> {
  try {
    const entry: CacheEntry<T> = { value, savedAt: Date.now() };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // cache gagal tidak boleh mengganggu jalannya aplikasi
  }
}

export async function listCacheKeys(): Promise<string[]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys.filter((key) => key.startsWith(PREFIX));
  } catch {
    return [];
  }
}

export function stripCachePrefix(key: string): string {
  return key.startsWith(PREFIX) ? key.slice(PREFIX.length) : key;
}

// Data segar langsung dipakai, data basi tetap ditampilkan sambil penyegaran
// jalan di belakang, tanpa cache ambil baru (dan lempar error kalau gagal).
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number,
): Promise<T> {
  const entry = await readCacheEntry<T>(key);
  if (entry && Date.now() - entry.savedAt < ttlMs) {
    return entry.value;
  }
  if (entry) {
    void fetcher()
      .then((value) => writeCache(key, value))
      .catch(() => {});
    return entry.value;
  }
  const value = await fetcher();
  await writeCache(key, value);
  return value;
}
