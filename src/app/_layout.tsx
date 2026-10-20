import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Halaman Home: header disembunyikan karena sudah ada header custom */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Halaman Detail Resep: menggunakan dynamic route [id] */}
      <Stack.Screen
        name="recipes/[id]"
        options={{
          title: 'Detail Resep',
          headerStyle: { backgroundColor: '#FFF8F0' },
          headerTintColor: '#FF6B35',
          headerTitleStyle: { fontWeight: 'bold', color: '#222222' },
        }}
      />
    </Stack>
  );
}
