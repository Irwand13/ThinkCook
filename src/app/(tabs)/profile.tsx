import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatCard from '../../components/StatCard';
import { cardShadow, colors, fonts } from '../../constants/styles';
import { getCategories } from '../../services/recipeService';
import { getFavorites } from '../../services/favoriteService';

export default function ProfileScreen() {
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let aktif = true;

      getFavorites().then((data) => {
        if (aktif) {
          setFavoriteCount(data.length);
        }
      });
      getCategories()
        .then((names) => {
          if (aktif) {
            setCategoryCount(names.length);
          }
        })
        .catch(() => {
        });

      return () => {
        aktif = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={profileStyles.content}
      >
        <View style={profileStyles.avatarCircle}>
          <Text style={profileStyles.avatarInitial}>P</Text>
        </View>
        <Text style={profileStyles.name}>Profil Pengguna</Text>
        <Text style={profileStyles.subtitle}>Selamat datang di ThinkCook!</Text>

        <View style={profileStyles.statRow}>
          <StatCard
            icon="heart-outline"
            label="Favorit"
            value={String(favoriteCount)}
          />
          <StatCard
            icon="restaurant-outline"
            label="Kategori API"
            value={`${categoryCount}+`}
          />
          <StatCard icon="layers-outline" label="Async & API" value="Modul 3" />
        </View>

        <View style={profileStyles.infoCard}>
          <View style={profileStyles.infoHeader}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={profileStyles.infoTitle}>Tentang Aplikasi</Text>
          </View>

          <Text style={profileStyles.label}>Nama Aplikasi</Text>
          <Text style={profileStyles.value}>ThinkCook</Text>

          <Text style={profileStyles.label}>Deskripsi</Text>
          <Text style={profileStyles.value}>
            Aplikasi berbagi resep masakan.
          </Text>

          <Text style={profileStyles.label}>Sumber Data</Text>
          <Text style={profileStyles.value}>
            TheMealDB — database resep terbuka yang diambil secara langsung
            lewat External API pada Modul 3 ini.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const profileStyles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 32,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  avatarInitial: {
    fontSize: 36,
    fontFamily: fonts.heading,
    color: colors.white,
  },
  name: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.text,
    textAlign: 'center',
    marginTop: 14,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.secondary,
    textAlign: 'center',
    marginTop: 6,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 26,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginTop: 20,
    ...cardShadow,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: fonts.headingSemi,
    color: colors.text,
    marginLeft: 8,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.bodySemi,
    color: colors.secondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.text,
    lineHeight: 21,
    marginBottom: 16,
  },
});
