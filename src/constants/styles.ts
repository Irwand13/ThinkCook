import { StyleSheet } from 'react-native';

export const colors = {
  background: '#FAF3E7', // Paper — latar utama aplikasi
  primary: '#E4572E', // Terracotta — warna aksi utama
  primaryDark: '#C7431F', // Terracotta gelap — teks & tombol berisi (kontras 4.94:1 dengan putih)
  primaryLight: '#FBE7DD', // turunan terang Terracotta (chip, latar ikon)
  sage: '#647C4E', // Sage — aksen sekunder (ikon & grafis)
  sageText: '#4A5E37', // Sage gelap — teks kecil di atas latar terang
  sageLight: '#E9EEDF', // turunan terang Sage (chip kategori)
  peach: '#F6C89F', // Peach — aksen hangat
  card: '#FFFFFF', // kartu putih di atas Paper
  text: '#2B2118', // Ink — teks utama
  secondary: '#6B5B4A', // teks pendukung (kontras 5.91:1 di atas Paper)
  border: '#EFE3D3', // garis tepi kartu & tab bar
  white: '#FFFFFF',
  scrim: 'rgba(43, 33, 24, 0.55)',
  scrimSoft: 'rgba(43, 33, 24, 0.32)',
};

export const fonts = {
  heading: 'Fraunces_700Bold',
  headingSemi: 'Fraunces_600SemiBold',
  headingSemiItalic: 'Fraunces_600SemiBold_Italic',
  body: 'PlusJakartaSans_400Regular',
  bodySemi: 'PlusJakartaSans_600SemiBold',
  bodyBold: 'PlusJakartaSans_700Bold',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const shadows = {
  soft: {
    elevation: 2,
    shadowColor: '#7A4A21',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  card: {
    elevation: 3,
    shadowColor: '#7A4A21',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  floating: {
    elevation: 8,
    shadowColor: '#7A4A21',
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
};

export const cardShadow = shadows.card;

// Skala tipografi: judul serif editorial, isi sans. Ukuran dari skala ini,
// bukan angka bebas di tiap layar, supaya hierarki konsisten.
export const type = {
  display: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: fonts.heading,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontFamily: fonts.heading,
  },
  section: {
    fontSize: 19,
    lineHeight: 25,
    fontFamily: fonts.headingSemi,
  },
  sectionItalic: {
    fontSize: 19,
    lineHeight: 25,
    fontFamily: fonts.headingSemiItalic,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.body,
  },
  bodySm: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: fonts.body,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.bodySemi,
  },
};

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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    marginRight: spacing.md,
  },
  appName: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.text,
    lineHeight: 29,
  },
  appTagline: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.secondary,
    marginTop: 1,
  },
  pageTitle: {
    ...type.display,
    color: colors.text,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  pageSubtitle: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.secondary,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },

  // Kolom pencarian
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 52,
    ...shadows.soft,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 13,
    marginLeft: spacing.sm,
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.text,
  },
  clearButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Chip kategori
  categorySection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 6,
  },
  categoryTitle: {
    ...type.sectionItalic,
    color: colors.text,
    marginBottom: 10,
  },
  categoryRow: {
    paddingBottom: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 11,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
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
    ...type.sectionItalic,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  feedSubtitle: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.secondary,
    marginBottom: spacing.md,
  },
  resultCount: {
    fontSize: 13,
    fontFamily: fonts.bodySemi,
    color: colors.secondary,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 112,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: spacing.xxl,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.bodySemi,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.secondary,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  emptyAction: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.md,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  emptyActionText: {
    fontSize: 14,
    fontFamily: fonts.bodyBold,
    color: colors.white,
  },
});
