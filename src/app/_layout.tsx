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
import { useEffect, useState } from 'react';
import { ActivityIndicator, AppState, View } from 'react-native';
import OfflineBanner from '../components/OfflineBanner';
import { colors } from '../constants/styles';
import { supabase } from '../lib/supabase';
import {
  AuthUser,
  getSessionUser,
  onAuthChange,
} from '../services/authService';
import { setupNotifications } from '../services/notificationService';
import { refreshStaleCaches } from '../services/recipeService';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_600SemiBold_Italic,
    Fraunces_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });
  const [checking, setChecking] = useState(true);
  const segments = useSegments();
  const rootNav = useRootNavigationState();

  useEffect(() => {
    setupNotifications();
  }, []);

  useEffect(() => {
    if (!rootNav?.key) {
      return;
    }
    let aktif = true;

    const routeFor = (sessionUser: AuthUser | null): void => {
      const inLogin = segments[0] === 'login';
      if (!sessionUser && !inLogin) {
        router.replace('/login');
      } else if (sessionUser && inLogin) {
        router.replace('/(tabs)');
      }
    };

    getSessionUser()
      .then((sessionUser) => {
        if (!aktif) {
          return;
        }
        setChecking(false);
        routeFor(sessionUser);
      })
      .catch(() => {
        if (aktif) {
          setChecking(false);
        }
      });

    const unsubscribe = onAuthChange((sessionUser) => {
      if (aktif) {
        routeFor(sessionUser);
      }
    });

    return () => {
      aktif = false;
      unsubscribe();
    };
  }, [segments, rootNav?.key]);

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

  if (!fontsLoaded || checking) {
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
