import { StyleSheet } from 'react-native';

/**
 * TOKEN DESAIN — satu sumber kebenaran untuk warna & font.
 * Semua layar dan komponen WAJIB mengambil warna/font dari sini,
 * jangan menulis kode warna hex langsung di file lain.
 */

export const colors = {
  background: '#FAF3E7', // Paper — latar utama aplikasi
  primary: '#E4572E', // Terracotta — warna aksi utama
  primaryLight: '#FBE7DD', // turunan terang Terracotta (chip, latar ikon)
  sage: '#647C4E', // Sage — aksen sekunder
  sageLight: '#E9EEDF', // turunan terang Sage (chip kategori)
  peach: '#F6C89F', // Peach — aksen hangat
  card: '#FFFFFF', // kartu putih di atas Paper
  text: '#2B2118', // Ink — teks utama
  secondary: '#8A7B6B', // teks pendukung/redup
  border: '#EFE3D3', // garis tepi kartu & tab bar
  white: '#FFFFFF',
};

/**
 * Nama font persis seperti yang dimuat useFonts di _layout.tsx:
 * Fraunces untuk judul (serif hangat), Plus Jakarta Sans untuk isi UI.
 */
export const fonts = {
  heading: 'Fraunces_700Bold',
  headingSemi: 'Fraunces_600SemiBold',
  body: 'PlusJakartaSans_400Regular',
  bodySemi: 'PlusJakartaSans_600SemiBold',
  bodyBold: 'PlusJakartaSans_700Bold',
};

/** Bayangan hangat & lembut yang dipakai konsisten pada kartu. */
export const cardShadow = {
  elevation: 3,
  shadowColor: '#7A4A21',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
};

/**
 * STYLE BERSAMA antar-layar: kerangka halaman, header, kolom pencarian,
 * dan chip kategori dipakai ulang oleh Beranda & Pencarian.
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header custom (logo + nama aplikasi)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  appName: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.text,
  },
  pageTitle: {
    fontSize: 26,
    fontFamily: fonts.heading,
    color: colors.text,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.secondary,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },

  // Kolom pencarian
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 13,
    marginLeft: 8,
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.text,
  },
  clearButton: {
    padding: 2,
  },

  // Chip kategori
  categorySection: {
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: fonts.headingSemi,
    color: colors.text,
    marginBottom: 10,
  },
  categoryRow: {
    paddingBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: fonts.bodySemi,
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.white,
  },

  // Daftar (feed) & keadaan kosong
  feedTitle: {
    fontSize: 17,
    fontFamily: fonts.headingSemi,
    color: colors.text,
    marginTop: 10,
    marginBottom: 4,
  },
  feedSubtitle: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.secondary,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: fonts.bodySemi,
    color: colors.secondary,
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.secondary,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 19,
  },
});
