import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
import RecipeCard from '../../components/RecipeCard';
import { ListSkeleton, SkeletonBlock } from '../../components/Skeleton';
import { cardShadow, colors, fonts, radius, spacing, styles } from '../../constants/styles';
import { useResponsive } from '../../constants/responsive';
import { useShake } from '../../hooks/useShake';
import { detectArea } from '../../services/locationService';
import { getCategories, getRandomRecipe, getRecipes, getRecipesByArea } from '../../services/recipeService';
import { Recipe, RecipeSummary } from '../../types/recipe';

const APP_NAME = 'ThinkCook';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const { columns, maxContentWidth, heroHeight } = useResponsive();

  const [heroRecipe, setHeroRecipe] = useState<Recipe | null>(null);
  const [heroLoading, setHeroLoading] = useState(true);

  const [categories, setCategories] = useState<string[]>(['Semua']);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);

  const [areaMode, setAreaMode] = useState<{
    city: string | null;
    country: string | null;
    area: string;
  } | null>(null);
  const [areaLoading, setAreaLoading] = useState(false);
  const [areaError, setAreaError] = useState<string | null>(null);

  const loadHero = async (): Promise<void> => {
    setHeroLoading(true);
    try {
      const recipe = await getRandomRecipe();
      setHeroRecipe(recipe);
    } catch {
      setHeroRecipe(null);
    } finally {
      setHeroLoading(false);
    }
  };

  const loadFeed = async (category: string): Promise<void> => {
    setFeedLoading(true);
    setFeedError(null);
    try {
      const data = areaMode
        ? await getRecipesByArea(areaMode.area)
        : await getRecipes(category);
      setRecipes(data);
    } catch (error) {
      setFeedError(
        error instanceof Error ? error.message : 'Gagal memuat resep.',
      );
    } finally {
      setFeedLoading(false);
    }
  };

  const handleDetectArea = async (): Promise<void> => {
    setAreaLoading(true);
    setAreaError(null);
    try {
      const detected = await detectArea();
      if (!detected.area) {
        setAreaError(
          `Kamu di ${detected.city ?? detected.country ?? 'sini'}, tapi belum ada resep khas daerah itu di TheMealDB.`,
        );
        return;
      }
      setAreaMode({
        city: detected.city,
        country: detected.country,
        area: detected.area,
      });
    } catch (error) {
      setAreaError(
        error instanceof Error ? error.message : 'Gagal mendeteksi lokasi.',
      );
    } finally {
      setAreaLoading(false);
    }
  };

  useShake(() => {
    void loadHero();
  });

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

    // abaikan hasil kalau layarnya sudah tidak aktif lagi
    return () => {
      aktif = false;
    };
  }, []);

  useEffect(() => {
    let aktif = true;

    const source = areaMode
      ? getRecipesByArea(areaMode.area)
      : getRecipes(selectedCategory);
    source
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
  }, [selectedCategory, areaMode]);

  const handleSearchSubmit = (): void => {
    router.push({ pathname: '/search', params: { q: search } });
  };

  const renderHeader = () => (
    <View>
      <Text style={styles.feedTitle}>Pilihan Hari Ini</Text>
      {heroLoading ? (
        <SkeletonBlock height={heroHeight} style={{ borderRadius: radius.xl }} />
      ) : heroRecipe ? (
        <View style={homeStyles.heroWrap}>
          <Pressable
            style={({ pressed }) => [
              homeStyles.heroCard,
              pressed && homeStyles.heroPressed,
            ]}
            onPress={() =>
              router.push({
                pathname: '/recipes/[id]',
                params: { id: String(heroRecipe.id) },
              })
            }
            accessibilityRole="button"
            accessibilityLabel={`Buka detail resep ${heroRecipe.title}`}
          >
            <Image
              source={{ uri: heroRecipe.image }}
              style={[homeStyles.heroImage, { height: heroHeight }]}
              accessible={false}
            />
            <LinearGradient
              colors={[
                'rgba(43, 33, 24, 0)',
                'rgba(43, 33, 24, 0.25)',
                'rgba(43, 33, 24, 0.82)',
              ]}
              locations={[0, 0.45, 1]}
              style={homeStyles.heroScrim}
            />
            <View style={homeStyles.heroOverlay}>
              <Text style={homeStyles.heroTitle} numberOfLines={2}>
                {heroRecipe.title}
              </Text>
              <View style={homeStyles.chipRow}>
                <View style={homeStyles.chipSolid}>
                  <Text style={homeStyles.chipSolidText}>{heroRecipe.category}</Text>
                </View>
                <View style={homeStyles.chipSolid}>
                  <Text style={homeStyles.chipSolidText}>{heroRecipe.area}</Text>
                </View>
              </View>
            </View>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              homeStyles.heroRefresh,
              pressed && homeStyles.heroRefreshPressed,
            ]}
            onPress={loadHero}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Acak resep pilihan lain"
          >
            <Ionicons name="reload" size={20} color={colors.primary} />
          </Pressable>
        </View>
      ) : null}

      <Text style={homeStyles.shakeHint}>
        Goyang HP untuk mengacak resep pilihan.
      </Text>

      <View style={homeStyles.locationCard}>
        {areaMode ? (
          <>
            <View style={homeStyles.locationTextWrap}>
              <Text style={homeStyles.locationTitle}>Resep di sekitarmu</Text>
              <Text style={homeStyles.locationText}>
                {areaMode.city ? `${areaMode.city}, ` : ''}
                {areaMode.country ?? ''} · masakan {areaMode.area}
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                homeStyles.locationClear,
                pressed && homeStyles.chipPressed,
              ]}
              onPress={() => setAreaMode(null)}
              accessibilityRole="button"
              accessibilityLabel="Tampilkan semua resep"
            >
              <Ionicons name="close" size={18} color={colors.primaryDark} />
            </Pressable>
          </>
        ) : (
          <>
            <View style={homeStyles.locationTextWrap}>
              <Text style={homeStyles.locationTitle}>Resep di sekitarmu</Text>
              <Text style={homeStyles.locationText}>
                {areaLoading
                  ? 'Mencari lokasimu...'
                  : 'Lihat masakan khas dari daerah tempat kamu berada.'}
              </Text>
              {areaError ? (
                <Text style={homeStyles.locationError}>{areaError}</Text>
              ) : null}
            </View>
            <Pressable
              style={({ pressed }) => [
                homeStyles.locationButton,
                pressed && homeStyles.chipPressed,
                areaLoading && homeStyles.locationButtonDisabled,
              ]}
              onPress={() => void handleDetectArea()}
              disabled={areaLoading}
              accessibilityRole="button"
              accessibilityLabel="Gunakan lokasiku"
            >
              <Ionicons
                name="location-outline"
                size={18}
                color={colors.white}
              />
              <Text style={homeStyles.locationButtonText}>
                {areaLoading ? 'Mencari...' : 'Lokasiku'}
              </Text>
            </Pressable>
          </>
        )}
      </View>

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
              style={({ pressed }) => [
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
                pressed && homeStyles.chipPressed,
              ]}
              onPress={() => {
                setFeedLoading(true);
                setSelectedCategory(category);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Filter kategori ${category}`}
              accessibilityState={{ selected: selectedCategory === category }}
            >
              {selectedCategory === category && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color={colors.white}
                  style={{ marginRight: 4 }}
                />
              )}
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

      <Text style={styles.feedTitle}>Resep Terbaru</Text>
      <Text style={styles.feedSubtitle}>
        {areaMode
          ? `Menampilkan ${recipes.length} resep ${areaMode.area} dari daerahmu`
          : `Menampilkan ${recipes.length} resep dari TheMealDB`}
      </Text>
    </View>
  );

  const renderEmpty = () => {
    if (feedLoading) {
      return <ListSkeleton count={3} />;
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
        <View style={styles.emptyIconCircle}>
          <Ionicons name="restaurant-outline" size={32} color={colors.primary} />
        </View>
        <Text style={styles.emptyText}>Belum ada resep pada kategori ini</Text>
        <Text style={styles.emptySubtext}>
          Coba pilih kategori lain atau kembali lagi nanti.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../../../assets/logo/icon-1024.png')} style={styles.logoImage} />
          <Text style={styles.appName}>{APP_NAME}</Text>
        </View>
      </View>

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
          accessibilityLabel="Cari resep"
          accessibilityHint="Ketik nama masakan, lalu tekan cari untuk membuka halaman pencarian"
        />
        {search.length > 0 && (
          <Pressable
            style={styles.clearButton}
            onPress={() => setSearch('')}
            accessibilityRole="button"
            accessibilityLabel="Hapus pencarian"
          >
            <Ionicons name="close-circle" size={20} color={colors.secondary} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={recipes}
        key={columns === 2 ? 'grid-2' : 'list-1'}
        numColumns={columns}
        columnWrapperStyle={columns === 2 ? { gap: spacing.md } : undefined}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <RecipeCard recipe={item} variant={columns === 2 ? 'card' : 'row'} />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          { maxWidth: maxContentWidth, width: '100%', alignSelf: 'center' },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const homeStyles = StyleSheet.create({
  // Pembungkus hero: tombol acak duduk sebagai saudara kartu hero, bukan
  // di dalamnya — dua area ketuk bersarang rawan konflik gestur.
  heroWrap: {
    marginBottom: spacing.xl,
  },
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...cardShadow,
  },
  heroPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: colors.peach,
  },
  heroScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: fonts.heading,
    color: colors.white,
    lineHeight: 28,
  },
  chipRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  chipSolid: {
    backgroundColor: colors.sage,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: spacing.sm,
  },
  chipSolidText: {
    fontSize: 12,
    fontFamily: fonts.bodySemi,
    color: colors.white,
  },
  heroRefresh: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  heroRefreshPressed: {
    transform: [{ scale: 0.92 }],
  },
  chipPressed: {
    opacity: 0.85,
  },
  shakeHint: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...cardShadow,
  },
  locationTextWrap: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontFamily: fonts.headingSemi,
    color: colors.text,
  },
  locationText: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.secondary,
    marginTop: 4,
    lineHeight: 18,
  },
  locationError: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.primaryDark,
    marginTop: 6,
    lineHeight: 17,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginLeft: spacing.md,
  },
  locationButtonDisabled: {
    opacity: 0.6,
  },
  locationButtonText: {
    fontSize: 13,
    fontFamily: fonts.bodyBold,
    color: colors.white,
    marginLeft: 6,
  },
  locationClear: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  categoryBlock: {
    marginBottom: 6,
  },
});
