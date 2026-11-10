import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { cardShadow, colors, fonts } from '../constants/styles';
import { isFavorite, toggleFavorite } from '../services/favoriteService';
import { RecipeSummary } from '../types/recipe';

export default function RecipeCard({ recipe }: { recipe: RecipeSummary }) {
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

  return (
    <Pressable style={cardStyles.card} onPress={handleViewDetail}>
      <Image source={{ uri: recipe.image }} style={cardStyles.image} />

      <View style={cardStyles.body}>
        <View style={cardStyles.titleRow}>
          <Text style={cardStyles.title} numberOfLines={2}>
            {recipe.title}
          </Text>
          <Pressable
            style={cardStyles.heartButton}
            onPress={handleToggleFavorite}
            hitSlop={8}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={22}
              color={colors.primary}
            />
          </Pressable>
        </View>

        <View style={cardStyles.chip}>
          <Ionicons name="restaurant-outline" size={13} color={colors.sage} />
          <Text style={cardStyles.chipText}>{recipe.category}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
    overflow: 'hidden',
    ...cardShadow,
  },
  image: {
    width: '100%',
    height: 170,
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
    fontFamily: fonts.bodyBold,
    color: colors.text,
    lineHeight: 23,
  },
  heartButton: {
    marginLeft: 10,
    padding: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.sageLight,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
  },
  chipText: {
    fontSize: 12,
    fontFamily: fonts.bodySemi,
    color: colors.sage,
    marginLeft: 5,
  },
});
