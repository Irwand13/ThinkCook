import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../components/RecipeCard';
import { colors, styles } from '../constants/styles';
import { recipes } from '../data/recipes';
import { Recipe } from '../types/recipe';
import { router } from 'expo-router';

/**
 * NAMA APLIKASI
 * Hanya ditulis di satu tempat, yaitu konstanta di file ini.
 * Ubah baris ini untuk mengganti nama aplikasi saat demo.
 */
const APP_NAME = 'ThinkCook';

/**
 * DAFTAR KATEGORI
 * Menambah kategori baru cukup dengan menambah satu teks di sini.
 */
const categories: string[] = [
  'Semua',
  'Makanan',
  'Minuman',
  'Dessert',
  'Snack',
];

export default function HomeScreen() {
  // STATE: kata kunci yang diketik pengguna di Search Bar
  const [search, setSearch] = useState('');

  // STATE: kata kunci pencarian yang sudah di-debounce (ditunda 300ms)
  // Digunakan untuk menyaring resep agar tidak filter setiap huruf yang diketik
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // STATE: kategori yang sedang dipilih
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    // Cleanup: batalkan timer sebelumnya ketika search berubah lagi
    return () => clearTimeout(timer);
  }, [search]);

  const getFilteredRecipes = (): Recipe[] => {
    return recipes.filter((recipe: Recipe) => {
      const cocokSearching = recipe.title
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

      const cocokKategori =
        selectedCategory === 'Semua' || recipe.category === selectedCategory;

      return cocokSearching && cocokKategori;
    });
  };

  // BUTTON
  const handleAddRecipe = (): void => {
    router.push('/')
  };

  const handleProfile = (): void => {
    router.push('/');
  };

  const filteredRecipes = getFilteredRecipes();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      {/* ============ HEADER ============ */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <Ionicons name="restaurant" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.appName}>{APP_NAME}</Text>
        </View>

        <Pressable style={styles.profileButton} onPress={handleProfile}>
          <Ionicons name="person-circle" size={30} color={colors.primary} />
        </Pressable>
      </View>

      {/* ============ SEARCH BAR ============ */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari resep..."
          placeholderTextColor={colors.secondary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable style={styles.clearButton} onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color={colors.secondary} />
          </Pressable>
        )}
      </View>

      {/* ============ KATEGORI (sticky, tidak ikut scroll) ============ */}
      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>Kategori</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {categories.map((category: string) => (
            <Pressable
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* ============ RECIPE FEED ============ */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        <Text style={styles.feedTitle}>Resep Terbaru</Text>
        <Text style={styles.feedSubtitle}>
          Menampilkan {filteredRecipes.length} resep
        </Text>

        {/* LOOP: map() untuk menampilkan semua resep secara dinamis */}
        {filteredRecipes.map((recipe: Recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}

        {filteredRecipes.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant" size={40} color={colors.secondary} />
            <Text style={styles.emptyText}>Resep tidak ditemukan</Text>
          </View>
        )}
      </ScrollView>

      {/* ============ FLOATING ADD BUTTON ============ */}
      <Pressable style={styles.fab} onPress={handleAddRecipe}>
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}