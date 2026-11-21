# ThinkCook — Modul 3: Async & API Call

Dokumen pendamping demo praktikum Pemrograman Mobile Modul 3.
Pada modul ini ThinkCook berubah dari data lokal (hardcoded) menjadi
aplikasi yang mengambil data resep sungguhan dari **External API
TheMealDB** secara asynchronous, dengan favorit yang disimpan lokal
memakai AsyncStorage.

## Cara Menjalankan

```bash
npm install        # hanya bila node_modules belum ada
npx expo start     # jalankan dev server
```

- Di aplikasi **Expo Go** (HP): pindai QR code yang muncul.
- Di browser: tekan `w` setelah server jalan (atau `npx expo start --web`).
- Syarat: perangkat terhubung internet, karena semua data resep
  diambil langsung dari API TheMealDB.

## Pemetaan Konsep Modul ke Kode

| Konsep | File | Fungsi / Bukti |
| --- | --- | --- |
| External API + Interface | `src/types/api.ts`, `src/services/api.ts` | JSON TheMealDB dituang ke Interface `MealDbCategory`, `MealDbMeal`, `MealDbMealSummary` (field mentah `str*`) |
| Interface model aplikasi | `src/types/recipe.ts` | `RecipeSummary`, `Recipe extends RecipeSummary`, `Ingredient` — hasil mapping yang dipakai semua layar |
| Mapping API → Object | `src/services/api.ts` | `mapMealSummary()`, `mapMealDetail()` (bahan dibaca dari `strIngredient1..20` + `strMeasure1..20`) |
| Custom Async Function | `src/services/recipeService.ts`, `src/utils/delay.ts` | `getCategories()`, `getRecipes()`, `searchRecipes()`, `getRecipeById()` — fungsi buatan sendiri dengan `async`/`await` |
| Pre-built Async Function | `src/services/api.ts`, `src/services/favoriteService.ts` | `fetch()` dan method AsyncStorage (`getItem`/`setItem`) |
| `.then()` / `.catch()` chaining | `src/services/recipeService.ts` | `getRandomRecipe()` — sengaja tanpa async/await, bandingkan dengan fungsi lain |
| `resolve()` | `src/utils/delay.ts` | `delay(ms)` membuat `new Promise` dan memanggil `resolve()` setelah waktu tunda selesai |
| `reject()` + Promise.race | `src/services/api.ts` | `fetchWithTimeout()` — Promise timeout memanggil `reject()` bila permintaan > 10 detik, dilombakan dengan `fetch()` lewat `Promise.race` |
| Loading & Error state | `src/components/Loading.tsx`, `src/components/ErrorMessage.tsx` | Ditampilkan layar selama Promise pending dan saat Promise rejected (ada tombol Coba Lagi) |
| AsyncStorage (favorit) | `src/services/favoriteService.ts` | Key `thinkcook:favorites`; `getFavorites`, `addFavorite`, `removeFavorite`, `isFavorite`, `toggleFavorite` |
| Debounce pencarian | `src/app/(tabs)/search.tsx` | Pencarian ditunda 300ms setelah ketikan terakhir (pola dari Modul 2) |
| Dynamic route | `src/app/recipes/[id].tsx` | ID dari `useLocalSearchParams`, lalu detail diambil via `getRecipeById(id)` |

## Endpoint TheMealDB yang Dipakai

Base URL: `https://www.themealdb.com/api/json/v1/1` (gratis, tanpa API key)

| Endpoint | Dipakai untuk |
| --- | --- |
| `GET /categories.php` | Chip kategori di Beranda + hitungan kategori di Profil |
| `GET /search.php?s=<kata>` | Feed "Semua" di Beranda + pencarian di tab Cari (`s` kosong = daftar besar) |
| `GET /filter.php?c=<kategori>` | Feed per kategori (hasilnya ringkasan: id, nama, foto) |
| `GET /lookup.php?i=<id>` | Detail resep lengkap (bahan, instruksi, area, tags, YouTube) |
| `GET /random.php` | Hero "Pilihan Hari Ini" di Beranda |

## Antisipasi Tanya-Jawab Demo

1. **Apa beda synchronous dan asynchronous?**
   Synchronous menjalankan kode baris demi baris dan menunggu tiap baris
   selesai. Asynchronous (mis. memanggil API) berjalan di latar belakang —
   UI tidak membeku — dan hasilnya diambil saat proses selesai.

2. **Apa itu Promise dan apa saja statusnya?**
   Promise adalah Object yang mewakili hasil sebuah proses asynchronous.
   Tiga statusnya: `pending` (sedang berjalan), `fulfilled` (berhasil,
   ada nilai hasil), dan `rejected` (gagal, ada Error).

3. **Apa beda async/await dan .then()?**
   Keduanya mengonsumsi Promise yang sama. `.then()`/`.catch()` memakai
   rantai callback; `async`/`await` membuat kode asynchronous terbaca
   seperti kode biasa dari atas ke bawah. Di aplikasi ini
   `getRandomRecipe()` memakai `.then()`, fungsi service lain memakai
   async/await — hasilnya setara.

4. **Kenapa data API perlu Interface?**
   JSON dari API tidak bertipe dan field-nya bisa `null` (contoh:
   `meals: null` bila resep tidak ada). Interface mendefinisikan kontrak
   bentuk Object-nya, sehingga TypeScript bisa memeriksa pemakaian field
   dan kesalahan ketik nama field langsung ketahuan sebelum aplikasi jalan.

5. **Apa yang terjadi bila API gagal / internet mati?**
   `fetchWithTimeout()` memberi batas 10 detik (Promise.race + reject).
   Error ditangkap `catch` di service, dibungkus jadi pesan yang ramah,
   lalu layar menampilkan `ErrorMessage` dengan tombol **Coba Lagi** —
   aplikasi tidak crash.

6. **Kenapa pencarian memakai debounce?**
   Tanpa debounce, setiap huruf yang diketik memicu satu panggilan API.
   Dengan debounce 300ms, API hanya dipanggil setelah pengguna berhenti
   mengetik — hemat kuota, hemat baterai, dan UI terasa ringan.

7. **Bagaimana favorit disimpan?**
   Dengan AsyncStorage (penyimpanan key-value lokal perangkat) di key
   `thinkcook:favorites`, berisi string JSON array `RecipeSummary`.
   Method-nya (`getItem`/`setItem`) adalah pre-built async function.
   Karena lokal, favorit tetap ada setelah aplikasi ditutup, dan layar
   Favorit memuat ulang datanya setiap kali tab-nya fokus.

8. **Apa itu dynamic route `[id]`?**
   File `src/app/recipes/[id].tsx` adalah rute yang segmen `[id]`-nya
   dinamis: URL `/recipes/52772` membuka layar yang sama dengan
   parameter berbeda. ID dibaca dengan `useLocalSearchParams`, lalu
   dipakai untuk mengambil detail dari `/lookup.php?i=<id>`.

9. **Kenapa ada dua lapisan, `api.ts` dan `recipeService.ts`?**
   `api.ts` adalah satu-satunya tempat yang tahu URL dan bentuk mentah
   TheMealDB; `recipeService.ts` memberi fungsi yang siap pakai layar
   dengan data yang sudah di-mapping dan pesan error yang ramah. Kalau
   suatu hari API berganti, yang diubah cukup lapisan `api.ts`.

10. **Dari mana aplikasi tahu sebuah resep sudah difavoritkan?**
    `favoriteService.isFavorite(id)` membaca AsyncStorage dan memeriksa
    apakah ID itu ada di array favorit. Tombol hati di kartu, halaman
    detail, dan tab Favorit semuanya membaca sumber yang sama, jadi
    statusnya selalu konsisten.

## Ide Modifikasi Live (dan Tempat Mengubahnya)

| Permintaan yang mungkin muncul | Ubah di |
| --- | --- |
| Ganti batas timeout API (mis. jadi 5 detik) | Konstanta `TIMEOUT_MS` di `src/services/api.ts` |
| Tambah field di kartu resep (mis. tampilkan area) | `src/components/RecipeCard.tsx` + pastikan field ada di `RecipeSummary` |
| Pakai endpoint kategori untuk layar lain / ganti endpoint | Fungsi endpoint di `src/services/api.ts` (`fetchCategoriesFromApi`, dst.) |
| Ubah key penyimpanan favorit / reset favorit | Konstanta `FAVORITES_KEY` di `src/services/favoriteService.ts` |
| Ganti warna utama / font | Token `colors` dan `fonts` di `src/constants/styles.ts` |
| Ubah durasi debounce pencarian | Angka `300` pada `setTimeout` di `src/app/(tabs)/search.tsx` |
| Tambah tab baru | Tambah file di `src/app/(tabs)/` + satu `Tabs.Screen` di `src/app/(tabs)/_layout.tsx` |
