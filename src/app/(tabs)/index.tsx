import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';
import RecipeCard from '../../components/RecipeCard';
import { cardShadow, colors, fonts, styles } from '../../constants/styles';
import { getCategories, getRandomRecipe, getRecipes } from '../../services/recipeService';
import { Recipe, RecipeSummary } from '../../types/recipe';

/** Nama aplikasi — ditulis satu kali di sini, dipakai di header. */
const APP_NAME = 'ThinkCook';

/**
 * LAYAR BERANDA
 * Seluruh data layar ini sekarang berasal dari API (Modul 3):
 * kategori, hero resep acak, dan daftar resep dimuat secara asynchronous
 * saat layar dibuka. Selama menunggu, ditampilkan komponen Loading;
 * bila gagal, ErrorMessage dengan tombol coba lagi.
 */
export default function HomeScreen() {
  // State kolom pencarian (diketik di sini, dieksekusi di tab Cari)
  const [search, setSearch] = useState('');

  // State hero "Pilihan Hari Ini" (satu resep acak dari API)
  const [heroRecipe, setHeroRecipe] = useState<Recipe | null>(null);
  const [heroLoading, setHeroLoading] = useState(true);

  // State chip kategori: diawali 'Semua', sisanya diisi dari API
  const [categories, setCategories] = useState<string[]>(['Semua']);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // State daftar resep (feed) beserta status muat & error-nya
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);

  /** Mengambil satu resep acak untuk hero. */
  const loadHero = async (): Promise<void> => {
    setHeroLoading(true);
    try {
      const recipe = await getRandomRecipe();
      setHeroRecipe(recipe);
    } catch {
      // Hero gagal tidak fatal — bagian ini disembunyikan saja,
      // daftar resep di bawahnya tetap bisa dipakai.
      setHeroRecipe(null);
    } finally {
      setHeroLoading(false);
    }
  };

  /** Mengambil daftar resep untuk satu kategori. */
  const loadFeed = async (category: string): Promise<void> => {
    setFeedLoading(true);
    setFeedError(null);
    try {
      const data = await getRecipes(category);
      setRecipes(data);
    } catch (error) {
      setFeedError(
        error instanceof Error ? error.message : 'Gagal memuat resep.',
      );
    } finally {
      setFeedLoading(false);
    }
  };

  // Saat layar pertama dibuka: muat kategori dan hero.
  // Fungsi service berjalan async — hasilnya masuk state di dalam
  // callback .then()/.catch(), yaitu saat Promise selesai (fulfilled
  // atau rejected), bukan seketika. Status loading awalnya true dari
  // nilai awal useState, jadi tidak perlu diubah di sini.
  useEffect(() => {
    let aktif = true;

    getCategories()
      .then((names) => {
        if (aktif) {
          setCategories(['Semua', ...names]);
        }
      })
      .catch(() => {
        if (aktif) {
          setCategories(['Semua']);
        }
      });

    // Hero memakai getRandomRecipe() — fungsi bergaya .then() chaining.
    getRandomRecipe()
      .then((recipe) => {
        if (aktif) {
          setHeroRecipe(recipe);
        }
      })
      .catch(() => {
        if (aktif) {
          setHeroRecipe(null);
        }
      })
      .finally(() => {
        if (aktif) {
          setHeroLoading(false);
        }
      });

    // Cleanup: abaikan hasil async bila layar sudah tidak aktif.
    return () => {
      aktif = false;
    };
  }, []);

  // Setiap chip kategori berganti, feed dimuat ulang dari API.
  // Indikator loading dinyalakan dari onPress chip (event pengguna),
  // sedangkan di sini state hanya diubah di callback Promise.
  useEffect(() => {
    let aktif = true;

    getRecipes(selectedCategory)
      .then((data) => {
        if (aktif) {
          setRecipes(data);
          setFeedError(null);
          setFeedLoading(false);
        }
      })
      .catch((error: unknown) => {
        if (aktif) {
          setFeedError(
            error instanceof Error ? error.message : 'Gagal memuat resep.',
          );
          setFeedLoading(false);
        }
      });

    return () => {
      aktif = false;
    };
  }, [selectedCategory]);

  /** Submit pencarian di Beranda: pindah ke tab Cari membawa kata kunci. */
  const handleSearchSubmit = (): void => {
    router.push({ pathname: '/search', params: { q: search } });
  };

  /** Bagian atas daftar: hero + chip kategori + judul feed. */
  const renderHeader = () => (
    <View>
      {/* ============ HERO: PILIHAN HARI INI ============ */}
      <Text style={styles.feedTitle}>Pilihan Hari Ini</Text>
      {heroLoading ? (
        <Loading message="Mengambil resep pilihan..." />
      ) : heroRecipe ? (
        <Pressable
          style={homeStyles.heroCard}
          onPress={() =>
            router.push({
              pathname: '/recipes/[id]',
              params: { id: String(heroRecipe.id) },
            })
          }
        >
          <Image source={{ uri: heroRecipe.image }} style={homeStyles.heroImage} />
          <Pressable style={homeStyles.heroRefresh} onPress={loadHero} hitSlop={8}>
            <Ionicons name="reload" size={18} color={colors.white} />
          </Pressable>
          <View style={homeStyles.heroBody}>
            <Text style={homeStyles.heroTitle} numberOfLines={2}>
              {heroRecipe.title}
            </Text>
            <View style={homeStyles.chipRow}>
              <View style={homeStyles.chipPrimary}>
                <Text style={homeStyles.chipPrimaryText}>{heroRecipe.category}</Text>
              </View>
              <View style={homeStyles.chipSage}>
                <Text style={homeStyles.chipSageText}>{heroRecipe.area}</Text>
              </View>
            </View>
          </View>
        </Pressable>
      ) : null}

      {/* ============ KATEGORI ============ */}
      <View style={homeStyles.categoryBlock}>
        <Text style={styles.categoryTitle}>Kategori</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
              ]}
              onPress={() => {
                setFeedLoading(true);
                setSelectedCategory(category);
              }}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* ============ JUDUL FEED ============ */}
      <Text style={styles.feedTitle}>Resep Terbaru</Text>
      <Text style={styles.feedSubtitle}>
        Menampilkan {recipes.length} resep dari TheMealDB
      </Text>
    </View>
  );

  /** Isi daftar saat kosong: loading, error, atau memang tidak ada data. */
  const renderEmpty = () => {
    if (feedLoading) {
      return <Loading message="Memuat resep..." />;
    }
    if (feedError) {
      return (
        <ErrorMessage
          message={feedError}
          onRetry={() => loadFeed(selectedCategory)}
        />
      );
    }
    return (
      <View style={styles.emptyState}>
        <Ionicons name="restaurant-outline" size={44} color={colors.secondary} />
        <Text style={styles.emptyText}>Belum ada resep pada kategori ini</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      {/* ============ HEADER ============ */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <Ionicons name="restaurant" size={22} color={colors.white} />
          </View>
          <Text style={styles.appName}>{APP_NAME}</Text>
        </View>
      </View>

      {/* ============ SEARCH BAR (navigasi ke tab Cari) ============ */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari resep..."
          placeholderTextColor={colors.secondary}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <Pressable style={styles.clearButton} onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color={colors.secondary} />
          </Pressable>
        )}
      </View>

      {/* ============ DAFTAR RESEP ============ */}
      <FlatList
        data={recipes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const homeStyles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 20,
    ...cardShadow,
  },
  heroImage: {
    width: '100%',
    height: 190,
    backgroundColor: colors.peach,
  },
  heroRefresh: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBody: {
    padding: 15,
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: fonts.heading,
    color: colors.text,
    lineHeight: 26,
  },
  chipRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  chipPrimary: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
  },
  chipPrimaryText: {
    fontSize: 12,
    fontFamily: fonts.bodySemi,
    color: colors.primary,
  },
  chipSage: {
    backgroundColor: colors.sageLight,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipSageText: {
    fontSize: 12,
    fontFamily: fonts.bodySemi,
    color: colors.sage,
  },
  categoryBlock: {
    marginBottom: 6,
  },
});
