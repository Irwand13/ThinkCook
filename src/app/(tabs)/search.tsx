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

/**
 * LAYAR PENCARIAN
 * Kata kunci bisa datang dari parameter rute (dikirim Beranda lewat
 * params { q }) atau diketik langsung di sini. Pencarian ke API tidak
 * dijalankan pada setiap ketikan, melainkan ditunda dengan pola
 * DEBOUNCE 300ms (sama seperti pola Modul 2): API hanya dipanggil
 * setelah pengguna berhenti mengetik sejenak, agar server tidak
 * dibanjiri permintaan dan aplikasi terasa tetap ringan.
 */
export default function SearchScreen() {
  // Parameter 'q' dari rute (bila pengguna datang dari kolom cari Beranda)
  const { q } = useLocalSearchParams<{ q?: string }>();

  const [query, setQuery] = useState(q ?? '');

  const [results, setResults] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Menandai apakah pencarian sudah pernah dijalankan (untuk keadaan awal)
  const [hasSearched, setHasSearched] = useState(false);

  // Bila Beranda mengirim kata kunci baru lewat parameter rute, sesuaikan
  // state query saat render (pola resmi React untuk "state turunan dari
  // props/parameter yang berubah"), bukan lewat useEffect.
  const [prevQ, setPrevQ] = useState(q);
  if (q !== prevQ) {
    setPrevQ(q);
    setQuery(q ?? '');
  }

  /** Menjalankan pencarian ke API untuk satu kata kunci. */
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

  // DEBOUNCE 300ms: pencarian ke API ditunda sampai pengguna berhenti
  // mengetik selama 300ms. Timer dibatalkan pada setiap ketikan baru
  // (cleanup), jadi API tidak dipanggil untuk setiap huruf.
  // Kata kunci kosong tidak dicari: layar menampilkan petunjuk awal.
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

  // Kata kunci aktif saat ini (untuk pesan status di bawah).
  const activeKeyword = query.trim();

  /** Isi layar di bawah kolom pencarian, sesuai status async saat ini. */
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
      // Keadaan awal: belum ada pencarian, tampilkan petunjuk.
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

      {/* ============ KOLOM PENCARIAN ============ */}
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
