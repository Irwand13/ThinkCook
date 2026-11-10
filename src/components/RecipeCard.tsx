import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { cardShadow, colors, fonts } from '../constants/styles';
import { isFavorite, toggleFavorite } from '../services/favoriteService';
import { RecipeSummary } from '../types/recipe';

/**
 * COMPONENT: RecipeCard
 * Menampilkan satu RecipeSummary sebagai kartu di daftar resep.
 * Karena datanya sekarang berasal dari API, kartu hanya membawa field
 * ringkas (judul, kategori, foto) — detail lengkap baru diambil saat
 * kartu ditekan dan halaman detail dibuka.
 */
export default function RecipeCard({ recipe }: { recipe: RecipeSummary }) {
  // Status favorit kartu ini, dibaca dari AsyncStorage (bukan state lokal
  // semata) agar konsisten dengan layar Favorit dan halaman Detail.
  const [isFav, setIsFav] = useState(false);

  // Saat kartu pertama kali tampil, periksa ke penyimpanan lokal apakah
  // resep ini sudah difavoritkan. isFavorite() adalah fungsi async,
  // jadi hasilnya diambil di dalam useEffect, bukan langsung di-render.
  useEffect(() => {
    let aktif = true;

    isFavorite(recipe.id).then((status) => {
      if (aktif) {
        setIsFav(status);
      }
    });

    // Cleanup: abaikan hasil bila kartu sudah tidak tampil.
    return () => {
      aktif = false;
    };
  }, [recipe.id]);

  /**
   * CUSTOM ASYNC FUNCTION
   * Membalik status favorit lewat favoriteService lalu menyinkronkan
   * ikon hati dengan status terbaru yang dikembalikan service.
   */
  const handleToggleFavorite = async (): Promise<void> => {
    const statusTerbaru = await toggleFavorite(recipe);
    setIsFav(statusTerbaru);
  };

  /**
   * Navigasi ke halaman Detail Resep (dynamic route [id]).
   * ID resep dikirim sebagai parameter rute.
   */
  const handleViewDetail = (): void => {
    router.push({
      pathname: '/recipes/[id]',
      params: { id: String(recipe.id) },
    });
  };

  return (
    <Pressable style={cardStyles.card} onPress={handleViewDetail}>
      {/* Foto resep dari URL yang diberikan API */}
      <Image source={{ uri: recipe.image }} style={cardStyles.image} />

      <View style={cardStyles.body}>
        {/* Judul + tombol favorit */}
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

        {/* Chip kategori */}
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
