import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ErrorMessage from '../../components/ErrorMessage';
import { DetailSkeleton } from '../../components/Skeleton';
import { cardShadow, colors, fonts, radius, spacing, type } from '../../constants/styles';
import { useResponsive } from '../../constants/responsive';
import { isFavorite, toggleFavorite } from '../../services/favoriteService';
import { notifyFavoriteAdded } from '../../services/notificationService';
import { getRecipeById } from '../../services/recipeService';
import { shareRecipeBySms } from '../../services/shareService';
import { Recipe } from '../../types/recipe';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { detailImageHeight, maxContentWidth } = useResponsive();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFav, setIsFav] = useState(false);
  const [smsNote, setSmsNote] = useState<string | null>(null);

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
    if (statusTerbaru) {
      void notifyFavoriteAdded(recipe.title);
    }
  };

  const handleShareSms = async (): Promise<void> => {
    if (!recipe) {
      return;
    }
    const result = await shareRecipeBySms(recipe);
    if (result === 'unavailable') {
      setSmsNote('SMS tidak tersedia di perangkat ini.');
    } else if (result === 'cancelled') {
      setSmsNote(null);
    } else {
      setSmsNote('Aplikasi SMS dibuka — tinggal pilih penerima dan kirim.');
    }
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
        <StatusBar style="dark" />
        <DetailSkeleton />
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={detailStyles.statusContainer}>
        <StatusBar style="dark" />
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

  const ingredientPct =
    recipe.ingredients.length === 0
      ? 0
      : Math.round(
          (checkedIngredients.length / recipe.ingredients.length) * 100,
        );
  const stepPct =
    steps.length === 0
      ? 0
      : Math.round((doneSteps.length / steps.length) * 100);

  return (
    <ScrollView
      style={detailStyles.container}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="light" />
      <Image
        source={{ uri: recipe.image }}
        style={[detailStyles.image, { height: detailImageHeight }]}
        accessible={false}
      />

      <View style={[detailStyles.overlayBar, { top: insets.top + 12 }]}>
        <Pressable
          style={({ pressed }) => [
            detailStyles.overlayButton,
            pressed && detailStyles.overlayPressed,
          ]}
          onPress={handleGoBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            detailStyles.overlayButton,
            pressed && detailStyles.overlayPressed,
          ]}
          onPress={handleToggleFavorite}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={
            isFav ? 'Hapus dari favorit' : 'Simpan ke favorit'
          }
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={22}
            color={colors.primary}
          />
        </Pressable>
      </View>

      <View
        style={[
          detailStyles.content,
          { maxWidth: maxContentWidth, width: '100%', alignSelf: 'center' },
        ]}
      >
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

        <Text style={detailStyles.sectionTitle}>Bahan-bahan</Text>
        <Text style={detailStyles.sectionHint}>
          Ketuk bahan untuk menandai yang sudah kamu siapkan.
        </Text>
        <View style={detailStyles.listCard}>
          <View style={detailStyles.progressBlock}>
            <View style={detailStyles.progressLabelRow}>
              <Text style={detailStyles.progressLabel}>
                {checkedIngredients.length} dari {recipe.ingredients.length} bahan siap
              </Text>
              <Text style={detailStyles.progressLabel}>{ingredientPct}%</Text>
            </View>
            <View
              style={detailStyles.progressTrack}
              accessibilityRole="progressbar"
              accessibilityLabel="Bahan siap"
              accessibilityValue={{ min: 0, max: 100, now: ingredientPct }}
            >
              <View
                style={[
                  detailStyles.progressFill,
                  { width: `${ingredientPct}%`, backgroundColor: colors.primary },
                ]}
              />
            </View>
          </View>
          {recipe.ingredients.map((ingredient, index) => {
            const checked = checkedIngredients.includes(index);
            return (
              <Pressable
                key={`${ingredient.name}-${index}`}
                style={({ pressed }) => [
                  detailStyles.ingredientRow,
                  index < recipe.ingredients.length - 1 &&
                    detailStyles.rowDivider,
                  pressed && detailStyles.rowPressed,
                ]}
                onPress={() => toggleIngredient(index)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                accessibilityLabel={`Bahan ${ingredient.name}, ${ingredient.measure}, ${checked ? 'sudah disiapkan' : 'belum disiapkan'}`}
              >
                <Ionicons
                  name={checked ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={checked ? colors.primaryDark : colors.secondary}
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

        <Pressable
          style={({ pressed }) => [
            detailStyles.cookButton,
            cookingMode && detailStyles.cookButtonActive,
            pressed && detailStyles.buttonPressed,
          ]}
          onPress={() => setCookingMode((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel={
            cookingMode ? 'Selesai Memasak' : 'Mulai Mode Masak'
          }
        >
          <Ionicons
            name={cookingMode ? 'checkmark' : 'flame'}
            size={19}
            color={colors.white}
          />
          <Text style={detailStyles.cookButtonText}>
            {cookingMode ? 'Selesai Memasak' : 'Mulai Mode Masak'}
          </Text>
        </Pressable>

        <View style={detailStyles.sectionHeaderRow}>
          <Text style={detailStyles.sectionTitle}>Cara Membuat</Text>
          <Text style={detailStyles.progressText}>
            {doneSteps.length}/{steps.length} langkah selesai
          </Text>
        </View>
        <View
          style={[detailStyles.progressTrack, detailStyles.stepsTrack]}
          accessibilityRole="progressbar"
          accessibilityLabel="Langkah selesai"
          accessibilityValue={{ min: 0, max: 100, now: stepPct }}
        >
          <View
            style={[
              detailStyles.progressFill,
              { width: `${stepPct}%`, backgroundColor: colors.sage },
            ]}
          />
        </View>

        {cookingMode && (
          <View style={detailStyles.cookingBanner}>
            <Ionicons name="flame-outline" size={19} color={colors.sageText} />
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
              style={({ pressed }) => [
                detailStyles.stepRow,
                pressed && detailStyles.rowPressed,
              ]}
              onPress={() => toggleStep(index)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: done }}
              accessibilityLabel={`Langkah ${index + 1}${done ? ', selesai' : ''}: ${step}`}
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

        {recipe.youtube ? (
          <Pressable
            style={({ pressed }) => [
              detailStyles.youtubeButton,
              pressed && detailStyles.buttonPressed,
            ]}
            onPress={() => {
              if (recipe.youtube) {
                Linking.openURL(recipe.youtube);
              }
            }}
            accessibilityRole="button"
            accessibilityLabel="Tonton di YouTube"
          >
            <Ionicons name="logo-youtube" size={20} color={colors.primaryDark} />
            <Text style={detailStyles.youtubeText}>Tonton di YouTube</Text>
          </Pressable>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            detailStyles.youtubeButton,
            pressed && detailStyles.buttonPressed,
          ]}
          onPress={() => void handleShareSms()}
          accessibilityRole="button"
          accessibilityLabel="Bagikan resep ini via SMS"
        >
          <Ionicons name="chatbox-outline" size={20} color={colors.primaryDark} />
          <Text style={detailStyles.youtubeText}>Bagikan via SMS</Text>
        </Pressable>
        {smsNote ? (
          <Text style={detailStyles.smsNote}>{smsNote}</Text>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            detailStyles.backButtonGhost,
            pressed && detailStyles.buttonPressed,
          ]}
          onPress={handleGoBack}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
        >
          <Ionicons name="arrow-back" size={18} color={colors.primaryDark} />
          <Text style={detailStyles.backButtonGhostText}>Kembali</Text>
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
    height: 300,
    backgroundColor: colors.peach,
  },
  overlayBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  overlayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  overlayPressed: {
    transform: [{ scale: 0.92 }],
  },
  content: {
    padding: spacing.xl,
  },
  title: {
    ...type.display,
    color: colors.text,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  chipPrimary: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 5,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipPrimaryText: {
    fontSize: 12,
    fontFamily: fonts.bodySemi,
    color: colors.white,
  },
  chipSage: {
    backgroundColor: colors.sage,
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 5,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipSageText: {
    fontSize: 12,
    fontFamily: fonts.bodySemi,
    color: colors.white,
  },
  chipOutline: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 5,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipOutlineText: {
    fontSize: 12,
    fontFamily: fonts.bodySemi,
    color: colors.secondary,
  },
  sectionTitle: {
    ...type.section,
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
    color: colors.sageText,
  },
  progressBlock: {
    paddingTop: 14,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontFamily: fonts.bodySemi,
    color: colors.text,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  stepsTrack: {
    marginTop: 2,
    marginBottom: 14,
  },
  listCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
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
  rowPressed: {
    opacity: 0.7,
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
    borderRadius: radius.md,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  cookingBannerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.bodySemi,
    color: colors.sageText,
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
    backgroundColor: colors.primaryDark,
    borderRadius: radius.lg,
    paddingVertical: 15,
    marginTop: 14,
  },
  cookButtonActive: {
    backgroundColor: colors.sage,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
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
    borderColor: colors.primaryDark,
    borderRadius: radius.lg,
    paddingVertical: 13,
    marginTop: 12,
  },
  youtubeText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontFamily: fonts.bodyBold,
    marginLeft: 8,
  },
  smsNote: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 17,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
    paddingVertical: 14,
    borderRadius: radius.lg,
    marginTop: 22,
    marginBottom: 30,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.bodyBold,
    marginLeft: 8,
  },
  // Tombol kembali di bawah konten: outline, bukan isi kedua. Satu layar
  // satu tombol utama — di Detail itu "Mulai Mode Masak".
  backButtonGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    paddingVertical: 14,
    borderRadius: radius.lg,
    marginTop: 22,
    marginBottom: 30,
  },
  backButtonGhostText: {
    color: colors.primaryDark,
    fontSize: 16,
    fontFamily: fonts.bodyBold,
    marginLeft: 8,
  },
});
