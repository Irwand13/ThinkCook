import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';
import RecipeCard from '../../components/RecipeCard';
import { colors, styles } from '../../constants/styles';
import { searchRecipes } from '../../services/recipeService';
import { RecipeSummary } from '../../types/recipe';

export default function SearchScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();

  const [query, setQuery] = useState(q ?? '');

  const [results, setResults] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // samakan dengan param q dari Beranda kalau berubah
  const [prevQ, setPrevQ] = useState(q);
  if (q !== prevQ) {
    setPrevQ(q);
    setQuery(q ?? '');
  }

  const runSearch = async (keyword: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchRecipes(keyword);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mencari resep.');
      setResults([]);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  // debounce 300ms, biar tidak manggil API tiap huruf
  useEffect(() => {
    const keyword = query.trim();
    if (keyword.length === 0) {
      return;
    }
    const timer = setTimeout(() => {
      void runSearch(keyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const activeKeyword = query.trim();

  const renderContent = () => {
    if (loading) {
      return <Loading message={`Mencari "${activeKeyword}"...`} />;
    }
    if (error && activeKeyword.length > 0) {
      return (
        <ErrorMessage
          message={error}
          onRetry={() => runSearch(activeKeyword)}
        />
      );
    }
    if (activeKeyword.length === 0 || !hasSearched) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={46} color={colors.secondary} />
          <Text style={styles.emptyText}>Cari resep dari TheMealDB</Text>
          <Text style={styles.emptySubtext}>
            {'Ketik nama masakan dalam bahasa Inggris, misalnya "chicken", "cake", atau "pasta".'}
          </Text>
        </View>
      );
    }
    if (results.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="restaurant-outline"
            size={46}
            color={colors.secondary}
          />
          <Text style={styles.emptyText}>
            {`Tidak ada hasil untuk "${activeKeyword}"`}
          </Text>
          <Text style={styles.emptySubtext}>
            Coba kata kunci lain yang lebih umum.
          </Text>
        </View>
      );
    }
    return (
      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <Text style={styles.pageTitle}>Cari Resep</Text>
      <Text style={styles.pageSubtitle}>
        Jelajahi ribuan resep dari database TheMealDB
      </Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Ketik nama masakan..."
          placeholderTextColor={colors.secondary}
          value={query}
          onChangeText={setQuery}
          autoFocus
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable style={styles.clearButton} onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.secondary} />
          </Pressable>
        )}
      </View>

      {renderContent()}
    </SafeAreaView>
  );
}
