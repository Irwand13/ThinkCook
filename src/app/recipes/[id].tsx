import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/styles';
import { recipes } from '../../data/recipes';
import { formatTime } from '../../components/RecipeCard';

export default function RecipeDetailScreen() {
  // Mengambil parameter 'id' dari dynamic route menggunakan useLocalSearchParams
  const { id } = useLocalSearchParams<{ id: string }>();

  // Mencari data resep berdasarkan ID yang diterima dari parameter navigasi
  const recipe = recipes.find((r) => r.id === Number(id));

  const handleGoBack = (): void => {
    if (router.canGoBack()) {
      // Ada riwayat navigasi, kembali ke halaman sebelumnya
      router.back();
    } else {
      // Tidak ada riwayat navigasi, arahkan ke halaman Home
      router.replace('/');
    }
  };

  // Jika resep tidak ditemukan, tampilkan pesan error
  if (!recipe) {
    return (
      <View style={detailStyles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color={colors.secondary} />
        <Text style={detailStyles.errorText}>Resep tidak ditemukan</Text>
        <Text style={detailStyles.errorSubtext}>
          Resep dengan ID {`"${id}"`} tidak tersedia.
        </Text>
        <Pressable style={detailStyles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
          <Text style={detailStyles.backButtonText}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={detailStyles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Gambar Resep */}
      <Image source={{ uri: recipe.image }} style={detailStyles.image} />

      {/* Konten Detail */}
      <View style={detailStyles.content}>
        {/* Judul Resep */}
        <Text style={detailStyles.title}>{recipe.title}</Text>

        {/* Informasi Pembuat */}
        <View style={detailStyles.authorRow}>
          <Ionicons name="person-circle" size={24} color={colors.primary} />
          <Text style={detailStyles.authorText}>oleh {recipe.author}</Text>
        </View>

        {/* Informasi Meta: Kategori, Waktu, Kesulitan */}
        <View style={detailStyles.metaContainer}>
          <View style={detailStyles.metaItem}>
            <Ionicons name="restaurant" size={20} color={colors.primary} />
            <Text style={detailStyles.metaLabel}>Kategori</Text>
            <Text style={detailStyles.metaValue}>{recipe.category}</Text>
          </View>

          <View style={detailStyles.metaItem}>
            <Ionicons name="time" size={20} color={colors.primary} />
            <Text style={detailStyles.metaLabel}>Waktu</Text>
            <Text style={detailStyles.metaValue}>{formatTime(recipe.cookTime)}</Text>
          </View>

          <View style={detailStyles.metaItem}>
            <Ionicons name="speedometer" size={20} color={colors.primary} />
            <Text style={detailStyles.metaLabel}>Kesulitan</Text>
            <Text
              style={[
                detailStyles.metaValue,
                {
                  color: recipe.difficulty === 'Mudah' ? 'green' : 'orange',
                  fontWeight: 'bold',
                },
              ]}
            >
              {recipe.difficulty}
            </Text>
          </View>
        </View>

        {/* Deskripsi Resep */}
        <View style={detailStyles.section}>
          <Text style={detailStyles.sectionTitle}>Deskripsi</Text>
          <Text style={detailStyles.description}>{recipe.description}</Text>
        </View>

        {/* Info Like */}
        <View style={detailStyles.likeRow}>
          <Ionicons name="heart" size={20} color={colors.primary} />
          <Text style={detailStyles.likeText}>{recipe.likes} suka</Text>
        </View>

        {/* Tombol Kembali */}
        <Pressable style={detailStyles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
          <Text style={detailStyles.backButtonText}>Kembali</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

/**
 * EXTERNAL STYLING untuk halaman Detail Resep
 */
const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#F0E4D8',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorText: {
    fontSize: 15,
    color: colors.secondary,
    marginLeft: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  metaItem: {
    alignItems: 'center',
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: colors.secondary,
    marginTop: 4,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: colors.secondary,
    lineHeight: 22,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  likeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 30,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.secondary,
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
});
