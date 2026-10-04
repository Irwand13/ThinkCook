import { StyleSheet } from 'react-native';

/**
 * WARNA APLIKASI
 * Kumpulkan warna di satu tempat supaya mudah diganti saat demo.
 */
export const colors = {
  background: '#FFF8F0',
  primary: '#FF6B35',
  card: '#FFFFFF',
  text: '#222222',
  secondary: '#777777',
};

/**
 * EXTERNAL STYLING
 * Semua style utama ditulis di sini dengan StyleSheet.create(),
 * bukan ditulis langsung (inline) di dalam JSX.
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileButton: {
    padding: 4,
  },

  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0E4D8',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 15,
    color: colors.text,
  },
  clearButton: {
    padding: 2,
  },

  // Category
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoryRow: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#F0E4D8',
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Feed
  feedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 4,
  },
  feedSubtitle: {
    fontSize: 13,
    color: colors.secondary,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 15,
    color: colors.secondary,
    marginTop: 12,
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});