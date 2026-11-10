import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';
import StatCard from '../../components/StatCard';
import { cardShadow, colors, fonts } from '../../constants/styles';
import { isFavorite, toggleFavorite } from '../../services/favoriteService';
import { getRecipeById } from '../../services/recipeService';
import { Recipe } from '../../types/recipe';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFav, setIsFav] = useState(false);

  const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);
  const [cookingMode, setCookingMode] = useState(false);

  const loadRecipe = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecipeById(Number(id));
      setRecipe(data);
      setIsFav(await isFavorite(data.id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Gagal memuat detail resep.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let aktif = true;

    (async () => {
      try {
        const data = await getRecipeById(Number(id));
        if (!aktif) {
          return;
        }
        setRecipe(data);
        setIsFav(await isFavorite(data.id));
        setCheckedIngredients([]);
        setDoneSteps([]);
        setCookingMode(false);
        setError(null);
      } catch (err) {
        if (aktif) {
          setError(
            err instanceof Error ? err.message : 'Gagal memuat detail resep.',
          );
        }
      } finally {
        if (aktif) {
          setLoading(false);
        }
      }
    })();

    return () => {
      aktif = false;
    };
  }, [id]);

  const handleGoBack = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleToggleFavorite = async (): Promise<void> => {
    if (!recipe) {
      return;
    }
    const statusTerbaru = await toggleFavorite({
      id: recipe.id,
      title: recipe.title,
      category: recipe.category,
      image: recipe.image,
    });
    setIsFav(statusTerbaru);
  };

  const toggleIngredient = (index: number): void => {
    setCheckedIngredients((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index],
    );
  };

  const toggleStep = (index: number): void => {
    setDoneSteps((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index],
    );
  };

  if (loading) {
    return (
      <View style={detailStyles.statusContainer}>
        <Loading message="Memuat detail resep..." />
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={detailStyles.statusContainer}>
        <ErrorMessage
          message={error ?? 'Resep tidak ditemukan'}
          onRetry={loadRecipe}
        />
        <Pressable style={detailStyles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={18} color={colors.white} />
          <Text style={detailStyles.backButtonText}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  // instruksi dari API masih satu teks panjang, pecah per baris di sini
  const steps = recipe.instructions
    .split(/\r?\n+/)
    .map((step) => step.replace(/^\s*(STEP\s*)?\d+[.)]?\s*/i, '').trim())
    .filter((step) => step.length > 3 && !/^step\s*\d+$/i.test(step));

  return (
    <ScrollView
      style={detailStyles.container}
      showsVerticalScrollIndicator={false}
    >
      <Image source={{ uri: recipe.image }} style={detailStyles.image} />

      <View style={detailStyles.content}>
        <Text style={detailStyles.title}>{recipe.title}</Text>

        <View style={detailStyles.chipRow}>
          <View style={detailStyles.chipPrimary}>
            <Text style={detailStyles.chipPrimaryText}>{recipe.category}</Text>
          </View>
          <View style={detailStyles.chipSage}>
            <Text style={detailStyles.chipSageText}>{recipe.area}</Text>
          </View>
          {recipe.tags.map((tag) => (
            <View key={tag} style={detailStyles.chipOutline}>
              <Text style={detailStyles.chipOutlineText}>{tag}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={detailStyles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={21}
            color={colors.primary}
          />
          <Text style={detailStyles.favoriteText}>
            {isFav ? 'Tersimpan di Favorit' : 'Simpan ke Favorit'}
          </Text>
        </Pressable>

        <View style={detailStyles.statRow}>
          <StatCard
            icon="restaurant-outline"
            label="Kategori"
            value={recipe.category}
          />
          <StatCard icon="location-outline" label="Asal" value={recipe.area} />
          <StatCard
            icon="list-outline"
            label="Bahan"
            value={`${recipe.ingredients.length} item`}
          />
        </View>

        <Text style={detailStyles.sectionTitle}>Bahan-bahan</Text>
        <Text style={detailStyles.sectionHint}>
          Ketuk bahan untuk menandai yang sudah kamu siapkan.
        </Text>
        <View style={detailStyles.listCard}>
          {recipe.ingredients.map((ingredient, index) => {
            const checked = checkedIngredients.includes(index);
            return (
              <Pressable
                key={`${ingredient.name}-${index}`}
                style={[
                  detailStyles.ingredientRow,
                  index < recipe.ingredients.length - 1 &&
                    detailStyles.rowDivider,
                ]}
                onPress={() => toggleIngredient(index)}
              >
                <Ionicons
                  name={checked ? 'checkbox' : 'square-outline'}
                  size={22}
                  color={checked ? colors.sage : colors.secondary}
                />
                <Text
                  style={[
                    detailStyles.ingredientName,
                    checked && detailStyles.textDone,
                  ]}
                >
                  {ingredient.name}
                </Text>
                <Text style={detailStyles.ingredientMeasure}>
                  {ingredient.measure}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={detailStyles.sectionHeaderRow}>
          <Text style={detailStyles.sectionTitle}>Cara Membuat</Text>
          <Text style={detailStyles.progressText}>
            {doneSteps.length}/{steps.length} langkah selesai
          </Text>
        </View>

        {cookingMode && (
          <View style={detailStyles.cookingBanner}>
            <Ionicons name="flame-outline" size={19} color={colors.sage} />
            <Text style={detailStyles.cookingBannerText}>
              Mode masak aktif — tandai langkah yang sudah selesai.
            </Text>
          </View>
        )}

        {steps.map((step, index) => {
          const done = doneSteps.includes(index);
          return (
            <Pressable
              key={index}
              style={detailStyles.stepRow}
              onPress={() => toggleStep(index)}
            >
              <View
                style={[
                  detailStyles.stepNumber,
                  done && detailStyles.stepNumberDone,
                ]}
              >
                {done ? (
                  <Ionicons name="checkmark" size={15} color={colors.white} />
                ) : (
                  <Text style={detailStyles.stepNumberText}>{index + 1}</Text>
                )}
              </View>
              <Text
                style={[
                  detailStyles.stepText,
                  done && detailStyles.textDone,
                ]}
              >
                {step}
              </Text>
            </Pressable>
          );
        })}

        {!cookingMode && (
          <Pressable
            style={detailStyles.cookButton}
            onPress={() => setCookingMode(true)}
          >
            <Ionicons name="flame" size={19} color={colors.white} />
            <Text style={detailStyles.cookButtonText}>Mulai Masak</Text>
          </Pressable>
        )}

        {recipe.youtube ? (
          <Pressable
            style={detailStyles.youtubeButton}
            onPress={() => {
              if (recipe.youtube) {
                Linking.openURL(recipe.youtube);
              }
            }}
          >
            <Ionicons name="logo-youtube" size={20} color={colors.primary} />
            <Text style={detailStyles.youtubeText}>Tonton di YouTube</Text>
          </Pressable>
        ) : null}

        <Pressable style={detailStyles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={18} color={colors.white} />
          <Text style={detailStyles.backButtonText}>Kembali</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statusContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 260,
    backgroundColor: colors.peach,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.heading,
    color: colors.text,
    lineHeight: 33,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  chipPrimary: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  chipPrimaryText: {
    fontSize: 12,
    fontFamily: fonts.bodySemi,
    color: colors.primary,
  },
  chipSage: {
    backgroundColor: colors.sageLight,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSageText: {
    fontSize: 12,
    fontFamily: fonts.bodySemi,
    color: colors.sage,
  },
  chipOutline: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  chipOutlineText: {
    fontSize: 12,
    fontFamily: fonts.bodySemi,
    color: colors.secondary,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginTop: 6,
  },
  favoriteText: {
    fontSize: 14,
    fontFamily: fonts.bodySemi,
    color: colors.text,
    marginLeft: 8,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 19,
    fontFamily: fonts.headingSemi,
    color: colors.text,
    marginTop: 22,
    marginBottom: 6,
  },
  sectionHint: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.secondary,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 13,
    fontFamily: fonts.bodySemi,
    color: colors.sage,
  },
  listCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    ...cardShadow,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ingredientName: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.text,
    marginLeft: 10,
  },
  ingredientMeasure: {
    fontSize: 13,
    fontFamily: fonts.bodySemi,
    color: colors.secondary,
    marginLeft: 10,
  },
  textDone: {
    color: colors.secondary,
    textDecorationLine: 'line-through',
    opacity: 0.65,
  },
  cookingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sageLight,
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  cookingBannerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.bodySemi,
    color: colors.sage,
    marginLeft: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  stepNumber: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  stepNumberDone: {
    backgroundColor: colors.sage,
  },
  stepNumberText: {
    fontSize: 13,
    fontFamily: fonts.bodyBold,
    color: colors.white,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.text,
    lineHeight: 22,
  },
  cookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: 10,
  },
  cookButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.bodyBold,
    marginLeft: 8,
  },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 13,
    marginTop: 12,
  },
  youtubeText: {
    color: colors.primary,
    fontSize: 15,
    fontFamily: fonts.bodyBold,
    marginLeft: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 22,
    marginBottom: 30,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.bodyBold,
    marginLeft: 8,
  },
});
