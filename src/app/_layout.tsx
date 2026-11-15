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
import { useFonts } from 'expo-font';
import { router, Stack, useRootNavigationState, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../constants/styles';
import { getSessionUser } from '../services/authService';

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
    if (!rootNav?.key) {
      return;
    }
    let aktif = true;

    getSessionUser()
      .then((sessionUser) => {
        if (!aktif) {
          return;
        }
        setChecking(false);

        const inLogin = segments[0] === 'login';
        if (!sessionUser && !inLogin) {
          router.replace('/login');
        } else if (sessionUser && inLogin) {
          router.replace('/(tabs)');
        }
      })
      .catch(() => {
        if (aktif) {
          setChecking(false);
        }
      });

    return () => {
      aktif = false;
    };
  }, [segments, rootNav?.key]);

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
  );
}
