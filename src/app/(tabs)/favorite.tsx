import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../../components/RecipeCard';
import { ListSkeleton } from '../../components/Skeleton';
import { colors, spacing, styles } from '../../constants/styles';
import { useResponsive } from '../../constants/responsive';
import { getFavorites } from '../../services/favoriteService';
import { RecipeSummary } from '../../types/recipe';

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { columns, maxContentWidth } = useResponsive();

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
          key={columns === 2 ? 'grid-2' : 'list-1'}
          numColumns={columns}
          columnWrapperStyle={columns === 2 ? { gap: spacing.md } : undefined}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <RecipeCard recipe={item} variant="card" />
          )}
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
