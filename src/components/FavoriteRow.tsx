import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../constants/styles';
import { RecipeSummary } from '../types/recipe';

// Satu baris daftar favorit: thumbnail kecil, nama + kategori, tombol hati
// untuk menghapus dari daftar. Ketuk barisnya membuka detail resep.
export default function FavoriteRow({
  recipe,
  onRemove,
}: {
  recipe: RecipeSummary;
  onRemove: (id: number) => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        rowStyles.row,
        pressed && rowStyles.rowPressed,
      ]}
      onPress={() =>
        router.push({
          pathname: '/recipes/[id]',
          params: { id: String(recipe.id) },
        })
      }
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
        <Text style={rowStyles.subtitle} numberOfLines={1}>
          {recipe.category}
        </Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          rowStyles.heartButton,
          pressed && rowStyles.heartPressed,
        ]}
        onPress={() => onRemove(recipe.id)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Hapus ${recipe.title} dari favorit`}
      >
        <Ionicons name="heart" size={22} color={colors.primary} />
      </Pressable>
    </Pressable>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  rowPressed: {
    opacity: 0.7,
  },
  image: {
    width: 64,
    height: 64,
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
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.secondary,
    marginTop: 2,
  },
  heartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  heartPressed: {
    transform: [{ scale: 0.9 }],
  },
});
