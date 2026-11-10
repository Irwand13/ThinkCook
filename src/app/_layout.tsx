import {
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../constants/styles';

/**
 * ROOT LAYOUT
 * Titik masuk navigasi aplikasi (Stack utama) sekaligus tempat memuat
 * font kustom. useFonts() adalah fungsi async bawaan expo-font: font
 * dimuat di latar belakang, dan selama belum siap kita tampilkan
 * indikator loading sederhana agar teks tidak berkedip/fallback.
 */
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  if (!fontsLoaded) {
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
      {/* Grup tab utama: header-nya diatur sendiri di (tabs)/_layout.tsx */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Halaman Detail Resep: menggunakan dynamic route [id] */}
      <Stack.Screen
        name="recipes/[id]"
        options={{
          title: 'Detail Resep',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontFamily: 'PlusJakartaSans_700Bold',
            color: colors.text,
          },
        }}
      />
    </Stack>
  );
}
