import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { cardShadow, colors, fonts, radius, spacing } from '../constants/styles';
import { isFavorite, toggleFavorite } from '../services/favoriteService';
import { RecipeSummary } from '../types/recipe';

export default function RecipeCard({
  recipe,
  variant = 'card',
}: {
  recipe: RecipeSummary;
  variant?: 'card' | 'row';
}) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    let aktif = true;

    isFavorite(recipe.id).then((status) => {
      if (aktif) {
        setIsFav(status);
      }
    });

    return () => {
      aktif = false;
    };
  }, [recipe.id]);

  const handleToggleFavorite = async (): Promise<void> => {
    const statusTerbaru = await toggleFavorite(recipe);
    setIsFav(statusTerbaru);
  };

  const handleViewDetail = (): void => {
    router.push({
      pathname: '/recipes/[id]',
      params: { id: String(recipe.id) },
    });
  };

  const heartButton = (
    <Pressable
      style={({ pressed }) => [
        cardStyles.heartButton,
        isFav && cardStyles.heartButtonActive,
        pressed && cardStyles.heartPressed,
      ]}
      onPress={handleToggleFavorite}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={
        isFav ? 'Hapus dari favorit' : 'Simpan ke favorit'
      }
      accessibilityState={{ selected: isFav }}
    >
      <Ionicons
        name={isFav ? 'heart' : 'heart-outline'}
        size={21}
        color={colors.primary}
      />
    </Pressable>
  );

  if (variant === 'row') {
    return (
      <Pressable
        style={({ pressed }) => [
          rowStyles.card,
          pressed && rowStyles.cardPressed,
        ]}
        onPress={handleViewDetail}
        accessibilityRole="button"
        accessibilityLabel={`Buka detail resep ${recipe.title}`}
      >
        <Image
          source={{ uri: recipe.image }}
          style={rowStyles.image}
          accessible={false}
        />
        <View style={rowStyles.body}>
          <Text style={rowStyles.title} numberOfLines={2}>
            {recipe.title}
          </Text>
          <View style={rowStyles.chip}>
            <Ionicons name="restaurant-outline" size={12} color={colors.sageText} />
            <Text style={rowStyles.chipText}>{recipe.category}</Text>
          </View>
        </View>
        {heartButton}
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        cardStyles.card,
        pressed && cardStyles.cardPressed,
      ]}
      onPress={handleViewDetail}
      accessibilityRole="button"
      accessibilityLabel={`Buka detail resep ${recipe.title}`}
    >
      <Image
        source={{ uri: recipe.image }}
        style={cardStyles.image}
        accessible={false}
      />

      <View style={cardStyles.body}>
        <View style={cardStyles.titleRow}>
          <Text style={cardStyles.title} numberOfLines={2}>
            {recipe.title}
          </Text>
          {heartButton}
        </View>

        <View style={cardStyles.metaRow}>
          <View style={cardStyles.chip}>
            <Ionicons name="restaurant-outline" size={13} color={colors.sageText} />
            <Text style={cardStyles.chipText}>{recipe.category}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...cardShadow,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: colors.peach,
  },
  body: {
    padding: 15,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontFamily: fonts.headingSemi,
    color: colors.text,
    lineHeight: 24,
    paddingTop: 3,
  },
  heartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heartButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },
  heartPressed: {
    transform: [{ scale: 0.9 }],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.sageLight,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipText: {
    fontSize: 12,
    fontFamily: fonts.bodySemi,
    color: colors.sageText,
    marginLeft: 5,
  },
});

const rowStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    padding: spacing.md,
    ...cardShadow,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
    backgroundColor: colors.peach,
  },
  body: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.headingSemi,
    color: colors.text,
    lineHeight: 22,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.sageLight,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: spacing.sm,
  },
  chipText: {
    fontSize: 12,
    fontFamily: fonts.bodySemi,
    color: colors.sageText,
    marginLeft: 5,
  },
});
