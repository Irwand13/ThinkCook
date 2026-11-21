import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

WebBrowser.maybeCompleteAuthSession();

export interface AuthUser {
  name: string;
  email: string;
}

function requireConfig(): void {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase belum dikonfigurasi. Isi file .env dulu, lalu jalankan ulang aplikasinya.',
    );
  }
}

function toAuthUser(user: User): AuthUser {
  const email = user.email ?? '';
  const meta = (user.user_metadata ?? {}) as { name?: unknown };
  const name =
    typeof meta.name === 'string' && meta.name.trim().length > 0
      ? meta.name.trim()
      : email.split('@')[0] || 'Pengguna';
  return { name, email };
}

function friendlyError(error: unknown): Error {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('Invalid login credentials')) {
    return new Error('Email atau kata sandi salah.');
  }
  if (message.includes('User already registered')) {
    return new Error('Email ini sudah terdaftar. Coba masuk.');
  }
  if (message.includes('Password should be at least')) {
    return new Error('Kata sandi minimal 6 karakter.');
  }
  if (message.includes('Unable to validate email address')) {
    return new Error('Format email tidak valid.');
  }
  if (message.includes('Email not confirmed')) {
    return new Error('Email belum diverifikasi. Cek kotak masuk kamu.');
  }
  if (
    message.includes('Failed to fetch') ||
    message.includes('fetch failed') ||
    message.includes('Network request failed')
  ) {
    return new Error('Tidak ada koneksi internet. Coba lagi nanti.');
  }
  if (message.length > 0) {
    return new Error(message);
  }
  return new Error('Terjadi kesalahan. Coba lagi.');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthUser> {
  requireConfig();
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  if (cleanName.length < 2) {
    throw new Error('Nama minimal 2 huruf.');
  }
  if (!isValidEmail(cleanEmail)) {
    throw new Error('Format email tidak valid.');
  }
  if (password.length < 6) {
    throw new Error('Kata sandi minimal 6 karakter.');
  }

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: { data: { name: cleanName } },
  });
  if (error) {
    throw friendlyError(error);
  }
  if (!data.session || !data.user) {
    throw new Error(
      'Akun dibuat. Cek email kamu untuk verifikasi, lalu masuk.',
    );
  }
  return toAuthUser(data.user);
}

export async function login(email: string, password: string): Promise<AuthUser> {
  requireConfig();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) {
    throw friendlyError(error);
  }
  if (!data.user) {
    throw new Error('Email atau kata sandi salah.');
  }
  return toAuthUser(data.user);
}

export async function signInWithGoogle(): Promise<AuthUser | null> {
  requireConfig();
  const redirectTo = Linking.createURL('auth/callback');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
  if (error || !data.url) {
    throw friendlyError(error ?? new Error('Gagal memulai masuk dengan Google.'));
  }
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success') {
    return null;
  }
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ? toAuthUser(session.user) : null;
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut({ scope: 'local' });
}

export async function getSessionUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured) {
    return null;
  }
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ? toAuthUser(session.user) : null;
}

export function onAuthChange(
  callback: (user: AuthUser | null) => void,
): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ? toAuthUser(session.user) : null);
  });
  return () => subscription.unsubscribe();
}
