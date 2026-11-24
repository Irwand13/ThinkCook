import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FavoriteRow from '../../components/FavoriteRow';
import { ListSkeleton } from '../../components/Skeleton';
import { colors, styles } from '../../constants/styles';
import { useResponsive } from '../../constants/responsive';
import { getFavorites, removeFavorite } from '../../services/favoriteService';
import { RecipeSummary } from '../../types/recipe';

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { maxContentWidth } = useResponsive();

  const handleRemoveFavorite = useCallback(async (id: number) => {
    await removeFavorite(id);
    setFavorites((current) => current.filter((fav) => fav.id !== id));
  }, []);

  useFocusEffect(
    useCallback(() => {
      let aktif = true;

      getFavorites().then((data) => {
        if (aktif) {
          setFavorites(data);
          setLoading(false);
        }
      });

      return () => {
        aktif = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <Text style={styles.pageTitle}>Favorit</Text>
      <Text style={styles.pageSubtitle}>
        {favorites.length} resep tersimpan di perangkat ini
      </Text>

      {loading ? (
        <ListSkeleton count={2} />
      ) : favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="heart-outline" size={32} color={colors.primary} />
          </View>
          <Text style={styles.emptyText}>Belum ada resep favorit</Text>
          <Text style={styles.emptySubtext}>
            Tekan ikon hati pada resep mana pun untuk menyimpannya di sini.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.emptyAction,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => router.push('/')}
            accessibilityRole="button"
            accessibilityLabel="Jelajahi resep"
          >
            <Text style={styles.emptyActionText}>Jelajahi Resep</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <FavoriteRow recipe={item} onRemove={handleRemoveFavorite} />
          )}
          ItemSeparatorComponent={() => <View style={separatorStyle} />}
          contentContainerStyle={[
            styles.listContent,
            { maxWidth: maxContentWidth, width: '100%', alignSelf: 'center' },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

// Garis pemisah baris, sejajar kolom teks (thumbnail 64 + jeda 12).
const separatorStyle = {
  height: 1,
  backgroundColor: colors.border,
  marginLeft: 76,
};
