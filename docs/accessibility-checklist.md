# Accessibility Checklist — ThinkCook

Acuan: SRS v1.0 (NFR-05–NFR-08) dan WCAG 2.1 AA. Terakhir diperbarui:
14 November 2026 — sesudah perubahan aksesibilitas + responsif + autentikasi.

## 1. Kontras teks (NFR-05 — minimal 4,5:1)

Dihitung dari token warna di `src/constants/styles.ts`. Semua pasangan teks
lolos.

| Pasangan | Rasio | Status |
| --- | --- | --- |
| Ink `#2B2118` di Paper `#FAF3E7` | 14,28:1 | Lolos |
| Secondary `#6B5B4A` di Paper `#FAF3E7` | 5,91:1 | Lolos |
| Secondary `#6B5B4A` di putih | 6,52:1 | Lolos |
| Putih di primaryDark `#C7431F` (tombol, chip aktif) | 4,94:1 | Lolos |
| Putih di Sage `#647C4E` (chip hero) | 4,63:1 | Lolos |
| SageText `#4A5E37` di sageLight `#E9EEDF` | 6,03:1 | Lolos |

## 2. Area sentuh (NFR-06 — minimal 44×44 pt / 48×48 dp)

| Elemen | Ukuran | Status |
| --- | --- | --- |
| Tombol hapus pencarian (`clearButton`) | 44×44 | Lolos (diperbesar dari 36×36) |
| Tombol hati kartu resep | 40×40 + hitSlop 6 (efektif 52) | Lolos |
| Tombol acak hero, tombol overlay detail | 44×44 | Lolos |
| Chip kategori | minHeight 44 | Lolos |
| Tombol aksi empty state, tombol submit login | minHeight 44–52 | Lolos |
| Tab bar | tinggi 68 | Lolos |
| Baris bahan / langkah detail | selebar layar, tinggi ≥ 44 | Lolos |

## 3. Label pembaca layar (NFR-07)

Semua kontrol interaktif punya `accessibilityRole` + `accessibilityLabel`.
Gambar dekoratif di dalam tombol berlabel ditandai `accessible={false}`.

| Layar | Elemen berlabel |
| --- | --- |
| Beranda | Kartu hero (`Buka detail resep …`), tombol acak, chip kategori (role button + state terpilih + ikon centang), kolom cari (+ hint), tombol hapus pencarian |
| Cari | Kolom cari (+ hint), tombol hapus pencarian, tombol `Hapus Pencarian` |
| Favorit | Tombol `Jelajahi Resep`, kartu resep |
| Profil | Kartu statistik (`Resep: 25` dst.), tombol `Keluar dari akun` |
| Detail | Tombol kembali (atas + bawah), tombol favorit, baris bahan (role checkbox + state), tombol mode masak, bar progres bahan/langkah (role progressbar + nilai), baris langkah (role checkbox + state), tombol YouTube |
| Login | Input nama/email/kata sandi, tombol masuk/daftar, tombol ganti mode, kotak galat (role alert) |
| Semua | Kartu resep (role button + `Buka detail resep …`), tombol hati (label berubah ikut status favorit), tombol `Coba Lagi`, tab bar (label per tab) |
| Loading | Skeleton disembunyikan dari pembaca layar (`accessible={false}`) |

## 4. Tidak hanya dibedakan lewat warna (NFR-08)

- Chip kategori terpilih: latar gelap + ikon centang (bukan warna saja).
- Bahan sudah disiapkan: ikon berubah (lingkaran → centang) + teks dicoret.
- Langkah selesai: angka berubah jadi centang + teks dicoret.
- Favorit: ikon hati kosong vs penuh + latar tombol berubah.

## 5. Ukuran font sistem (NFR-08 — sampai 200%)

`Text` React Native mengikuti font sistem secara default
(`allowFontScaling` tidak pernah dimatikan). Judul panjang membungkus ke
baris berikut (`numberOfLines` hanya dipakai di kartu, dengan label lengkap
tersedia lewat pembaca layar). Belum diuji di perangkat pada 200% — lihat
bagian 7.

## 6. Responsif (NFR-01, NFR-02)

- `useResponsive()` (`src/constants/responsive.ts`): layar ≥ 600 dp pakai
  2 kolom (Beranda, Cari, Favorit); di bawah itu 1 kolom.
- Konten dibatasi lebar maksimal 720 dp dan rata tengah di tablet.
- Tinggi hero (220 → 260) dan foto detail (300 → 340) menyesuaikan tablet.
- Orientasi dikunci portrait di `app.json`, jadi adaptasi berbasis lebar.
- Padding bawah daftar 112 menjaga konten tidak tertutup tab bar mengambang.

## 7. Yang masih harus diuji di perangkat nyata

Perubahan ini baru diverifikasi statis (kode + hitung kontras). Sebelum
diceklis penuh, uji di HP/tablet:

1. TalkBack (Android) / VoiceOver (iOS): telusuri Beranda → Detail →
   Favorit → Profil; pastikan tiap tombol terbaca namanya dan statusnya.
2. Ukuran font sistem 200%: pastikan tidak ada teks terpotong di hero,
   kartu statistik, dan baris bahan.
3. Tablet / layar ≥ 600 dp: pastikan grid 2 kolom tampil rapi dan konten
   rata tengah.
4. Login → keluar → masuk lagi: pastikan sesi bertahan sesudah aplikasi
   ditutup dan hilang sesudah keluar.
