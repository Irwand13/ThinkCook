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

const APP_NAME = 'ThinkCook';

export default function HomeScreen() {
  const [search, setSearch] = useState('');

  const [heroRecipe, setHeroRecipe] = useState<Recipe | null>(null);
  const [heroLoading, setHeroLoading] = useState(true);

  const [categories, setCategories] = useState<string[]>(['Semua']);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);

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

  const handleSearchSubmit = (): void => {
    router.push({ pathname: '/search', params: { q: search } });
  };

  const renderHeader = () => (
    <View>
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

      <Text style={styles.feedTitle}>Resep Terbaru</Text>
      <Text style={styles.feedSubtitle}>
        Menampilkan {recipes.length} resep dari TheMealDB
      </Text>
    </View>
  );

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
        />
        {search.length > 0 && (
          <Pressable style={styles.clearButton} onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color={colors.secondary} />
          </Pressable>
        )}
      </View>

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
