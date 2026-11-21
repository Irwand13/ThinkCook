import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius, spacing, styles } from '../constants/styles';
import { isSupabaseConfigured } from '../lib/supabase';
import { login, register, signInWithGoogle } from '../services/authService';

export default function LoginScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const submit = async (): Promise<void> => {
    setError(null);
    setBusy(true);
    try {
      if (mode === 'register') {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async (): Promise<void> => {
    setError(null);
    setGoogleBusy(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        router.replace('/(tabs)');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setGoogleBusy(false);
    }
  };

  const switchMode = (): void => {
    setError(null);
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={loginStyles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={loginStyles.logoWrap}>
            <Image
              source={require('../../assets/logo/icon-1024.png')}
              style={loginStyles.logo}
              accessible={false}
            />
            <Text style={loginStyles.appName}>ThinkCook</Text>
            <Text style={loginStyles.tagline}>
              {mode === 'login'
                ? 'Masuk untuk melanjutkan memasak.'
                : 'Buat akun untuk menyimpan favoritmu.'}
            </Text>
          </View>

          {!isSupabaseConfigured ? (
            <View style={loginStyles.errorBox} accessibilityRole="alert">
              <Ionicons name="warning-outline" size={18} color={colors.primaryDark} />
              <Text style={loginStyles.errorText}>
                Supabase belum dikonfigurasi (.env). Masuk dan daftar belum bisa
                dipakai.
              </Text>
            </View>
          ) : null}

          {mode === 'register' && (
            <View style={loginStyles.field}>
              <Text style={loginStyles.label}>Nama</Text>
              <TextInput
                style={loginStyles.input}
                placeholder="Nama kamu"
                placeholderTextColor={colors.secondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
                accessibilityLabel="Nama"
              />
            </View>
          )}

          <View style={loginStyles.field}>
            <Text style={loginStyles.label}>Email</Text>
            <TextInput
              style={loginStyles.input}
              placeholder="nama@email.com"
              placeholderTextColor={colors.secondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="next"
              accessibilityLabel="Email"
            />
          </View>

          <View style={loginStyles.field}>
            <Text style={loginStyles.label}>Kata sandi</Text>
            <TextInput
              style={loginStyles.input}
              placeholder="Minimal 6 karakter"
              placeholderTextColor={colors.secondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={() => void submit()}
              accessibilityLabel="Kata sandi"
            />
          </View>

          {error ? (
            <View style={loginStyles.errorBox} accessibilityRole="alert">
              <Ionicons name="alert-circle-outline" size={18} color={colors.primaryDark} />
              <Text style={loginStyles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              loginStyles.submit,
              pressed && loginStyles.pressed,
              busy && loginStyles.disabled,
            ]}
            onPress={() => void submit()}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel={mode === 'login' ? 'Masuk' : 'Daftar'}
            accessibilityState={{ disabled: busy }}
          >
            <Text style={loginStyles.submitText}>
              {busy ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}
            </Text>
          </Pressable>

          <View style={loginStyles.dividerRow}>
            <View style={loginStyles.dividerLine} />
            <Text style={loginStyles.dividerText}>atau</Text>
            <View style={loginStyles.dividerLine} />
          </View>

          <Pressable
            style={({ pressed }) => [
              loginStyles.googleButton,
              pressed && loginStyles.pressed,
              googleBusy && loginStyles.disabled,
            ]}
            onPress={() => void handleGoogle()}
            disabled={googleBusy}
            accessibilityRole="button"
            accessibilityLabel="Masuk dengan Google"
            accessibilityState={{ disabled: googleBusy }}
          >
            <Ionicons name="logo-google" size={19} color={colors.primaryDark} />
            <Text style={loginStyles.googleText}>
              {googleBusy ? 'Membuka Google...' : 'Masuk dengan Google'}
            </Text>
          </Pressable>

          <Pressable
            style={loginStyles.switchRow}
            onPress={() => void switchMode()}
            accessibilityRole="button"
            accessibilityLabel={
              mode === 'login'
                ? 'Pindah ke halaman daftar'
                : 'Pindah ke halaman masuk'
            }
          >
            <Text style={loginStyles.switchText}>
              {mode === 'login'
                ? 'Belum punya akun? Daftar'
                : 'Sudah punya akun? Masuk'}
            </Text>
          </Pressable>

          <Text style={loginStyles.note}>
            Akun tersimpan aman di server. Kata sandi tidak pernah disimpan
            mentah.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const loginStyles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
  },
  appName: {
    fontSize: 28,
    fontFamily: fonts.heading,
    color: colors.text,
  },
  tagline: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.secondary,
    marginTop: 6,
    textAlign: 'center',
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.bodySemi,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    minHeight: 52,
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.text,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: spacing.lg,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.bodySemi,
    color: colors.primaryDark,
    marginLeft: spacing.sm,
    lineHeight: 18,
  },
  submit: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.lg,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: 16,
    fontFamily: fonts.bodyBold,
    color: colors.white,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.secondary,
    marginHorizontal: spacing.md,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderRadius: radius.lg,
    minHeight: 52,
    marginTop: spacing.lg,
  },
  googleText: {
    fontSize: 15,
    fontFamily: fonts.bodyBold,
    color: colors.primaryDark,
    marginLeft: spacing.sm,
  },
  switchRow: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    minHeight: 44,
    justifyContent: 'center',
  },
  switchText: {
    fontSize: 14,
    fontFamily: fonts.bodySemi,
    color: colors.primaryDark,
  },
  note: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.secondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing.lg,
  },
});
