import { Ionicons } from '@expo/vector-icons';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../constants/styles';
import { Recipe } from '../types/recipe';

/**
 * CUSTOM FUNCTION
 * Mengubah angka menit menjadi teks yang enak dibaca,
 * contoh: 25 -> "25 menit"
 */
export const formatTime = (minutes: number): string => {
  return `${minutes} menit`;
};

/**
 * CUSTOM FUNCTION
 * Menampilkan informasi lengkap resep ketika tombol ditekan.
 */
export const showRecipeDetail = (recipe: Recipe): void => {
  Alert.alert(
    recipe.title,
    `${recipe.description}\n\nKategori: ${recipe.category}\nWaktu: ${formatTime(
      recipe.cookTime
    )}\nTingkat kesulitan: ${recipe.difficulty}\nDimuat oleh: ${
      recipe.author
    }`,
    [{ text: 'Tutup', style: 'cancel' }]
  );
};

/**
 * CUSTOM FUNCTION
 * Menangani aksi Like pada sebuah resep.
 */
export const handleLike = (recipeTitle: string): void => {
  Alert.alert('Berhasil', `Kamu menyukai ${recipeTitle}. Resep ditambahkan ke favorit.`);
};

/**
 * COMPONENT: RecipeCard
 * Menampilkan satu resep sebagai kartu (card).
 * Data resep dikirim lewat props `recipe`.
 */
export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <View style={cardStyles.card}>
      {/* Author */}
      <View style={cardStyles.authorRow}>
        <Ionicons name="person-circle" size={28} color={colors.primary} />
        <Text style={cardStyles.author}>{recipe.author}</Text>
        <Ionicons
          name="bookmark-outline"
          size={20}
          color={colors.secondary}
          style={cardStyles.bookmarkIcon}
        />
      </View>

      {/* Food Image */}
      <Image source={{ uri: recipe.image }} style={cardStyles.image} />

      {/* Judul + Deskripsi */}
      <Text style={cardStyles.title}>{recipe.title}</Text>
      <Text style={cardStyles.description} numberOfLines={2}>
        {recipe.description}
      </Text>

      {/* Category, Cook Time, Difficulty */}
      <View style={cardStyles.metaRow}>
        <View style={cardStyles.metaItem}>
          <Ionicons name="restaurant" size={14} color={colors.secondary} />
          <Text style={cardStyles.metaText}>{recipe.category}</Text>
        </View>

        <View style={cardStyles.metaItem}>
          <Ionicons name="time" size={14} color={colors.secondary} />
          <Text style={cardStyles.metaText}>{formatTime(recipe.cookTime)}</Text>
        </View>

        {/*
          INLINE STYLING
          Warna difficulty berubah sesuai kondisi data:
          Mudah -> hijau, selain itu -> oranye.
        */}
        <Text
          style={{
            color: recipe.difficulty === 'Mudah' ? 'green' : 'orange',
            fontSize: 12,
            fontWeight: 'bold',
          }}
        >
          {recipe.difficulty}
        </Text>
      </View>

      {/* Action: Like + Lihat Resep */}
      <View style={cardStyles.actionRow}>
        <Pressable
          style={cardStyles.likeButton}
          onPress={() => handleLike(recipe.title)}
        >
          <Ionicons name="heart" size={18} color={colors.primary} />
          <Text style={cardStyles.likeText}>{recipe.likes}</Text>
        </Pressable>

        <Pressable
          style={cardStyles.detailButton}
          onPress={() => showRecipeDetail(recipe)}
        >
          <Text style={cardStyles.detailButtonText}>Lihat Resep</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * EXTERNAL STYLING untuk RecipeCard
 */
const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 15,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  author: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  bookmarkIcon: {
    marginLeft: 'auto',
  },
  image: {
    width: '100%',
    height: 170,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#F0E4D8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.secondary,
    marginTop: 4,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  metaText: {
    fontSize: 12,
    color: colors.secondary,
    marginLeft: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  likeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 6,
  },
  detailButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});