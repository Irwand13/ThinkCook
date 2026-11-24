import {
  Fraunces_600SemiBold,
  Fraunces_600SemiBold_Italic,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import NetInfo from '@react-native-community/netinfo';
import { useFonts } from 'expo-font';
import { router, Stack, useRootNavigationState, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, AppState, View } from 'react-native';
import OfflineBanner from '../components/OfflineBanner';
import { colors } from '../constants/styles';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { setupNotifications } from '../services/notificationService';
import { refreshStaleCaches } from '../services/recipeService';

function AppShell() {
  const { user, loading } = useAuth();
  const [fontsLoaded] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_600SemiBold_Italic,
    Fraunces_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });
  const segments = useSegments();
  const rootNav = useRootNavigationState();

  useEffect(() => {
    setupNotifications();
  }, []);

  useEffect(() => {
    if (!rootNav?.key) {
      return;
    }
    const inLogin = segments[0] === 'login';
    if (!user && !inLogin) {
      router.replace('/login');
    } else if (user && inLogin) {
      router.replace('/(tabs)');
    }
  }, [segments, rootNav?.key, user]);

  // Kembali ke foreground: segarkan sesi Supabase, lalu segarkan cache
  // yang sudah basi kalau sedang online.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        return;
      }
      void (async () => {
        await supabase.auth.getSession();
        const net = await NetInfo.fetch();
        if (net.isConnected) {
          await refreshStaleCaches();
        }
      })();
    });
    return () => subscription.remove();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <OfflineBanner />
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="recipes/[id]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
