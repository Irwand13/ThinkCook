import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatCard from '../../components/StatCard';
import { cardShadow, colors, fonts, radius, spacing } from '../../constants/styles';
import { AuthUser, getSessionUser, logout } from '../../services/authService';
import { getCategories, getRecipes } from '../../services/recipeService';
import { getFavorites } from '../../services/favoriteService';

export default function ProfileScreen() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [recipeCount, setRecipeCount] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      let aktif = true;

      getSessionUser().then((sessionUser) => {
        if (aktif) {
          setUser(sessionUser);
        }
      });
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
      getRecipes('Semua')
        .then((data) => {
          if (aktif) {
            setRecipeCount(data.length);
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
          <Text style={profileStyles.avatarInitial}>
            {(user?.name ?? 'I').charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={profileStyles.name}>{user?.name ?? 'Irwanda'}</Text>
        <Text style={profileStyles.subtitle}>
          {user?.email ?? 'Selamat datang di ThinkCook!'}
        </Text>

        <View style={profileStyles.statRow}>
          <StatCard
            icon="restaurant-outline"
            label="Resep"
            value={recipeCount === null ? '–' : String(recipeCount)}
          />
          <StatCard
            icon="grid-outline"
            label="Kategori"
            value={`${categoryCount}`}
          />
          <StatCard
            icon="heart-outline"
            label="Favorit"
            value={String(favoriteCount)}
          />
        </View>

        <View style={profileStyles.infoCard}>
          <View style={profileStyles.infoHeader}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={profileStyles.infoTitle}>Pengaturan</Text>
          </View>

          <Text style={profileStyles.description}>
            Aplikasi berbagi resep masakan.
          </Text>

          <View style={profileStyles.row}>
            <Text style={profileStyles.rowLabel}>Tentang Aplikasi</Text>
            <Text style={profileStyles.rowValue}>ThinkCook</Text>
          </View>
          <View style={[profileStyles.row, profileStyles.rowDivider]}>
            <Text style={profileStyles.rowLabel}>Sumber Data</Text>
            <Text style={profileStyles.rowValue}>TheMealDB</Text>
          </View>
          <View style={[profileStyles.row, profileStyles.rowDivider]}>
            <Text style={profileStyles.rowLabel}>Versi</Text>
            <Text style={profileStyles.rowValue}>1.0.0</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            profileStyles.logoutButton,
            pressed && profileStyles.buttonPressed,
          ]}
          onPress={() => {
            void logout().then(() => {
              router.replace('/login');
            });
          }}
          accessibilityRole="button"
          accessibilityLabel="Keluar dari akun"
        >
          <Ionicons name="log-out-outline" size={19} color={colors.primaryDark} />
          <Text style={profileStyles.logoutText}>Keluar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const profileStyles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 112,
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
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: fonts.headingSemi,
    color: colors.text,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowLabel: {
    fontSize: 14,
    fontFamily: fonts.bodySemi,
    color: colors.text,
  },
  rowValue: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.secondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderRadius: radius.lg,
    paddingVertical: 13,
    marginTop: spacing.xl,
    minHeight: 48,
  },
  logoutText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontFamily: fonts.bodyBold,
    marginLeft: 8,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
