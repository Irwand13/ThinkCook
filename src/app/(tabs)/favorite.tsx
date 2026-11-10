import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from '../../components/Loading';
import RecipeCard from '../../components/RecipeCard';
import { colors, styles } from '../../constants/styles';
import { getFavorites } from '../../services/favoriteService';
import { RecipeSummary } from '../../types/recipe';

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);

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
        <Loading message="Memuat favorit..." />
      ) : favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={48} color={colors.secondary} />
          <Text style={styles.emptyText}>Belum ada resep favorit</Text>
          <Text style={styles.emptySubtext}>
            Tekan ikon hati pada resep mana pun untuk menyimpannya di sini.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <RecipeCard recipe={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
