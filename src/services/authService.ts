import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const ACCOUNT_KEY = 'thinkcook:account';
const SESSION_KEY = 'thinkcook:session';

export interface AuthUser {
  name: string;
  email: string;
}

interface StoredAccount extends AuthUser {
  salt: string;
  passwordHash: string;
  createdAt: string;
}

interface StoredSession {
  token: string;
  email: string;
  createdAt: string;
}

// Akun lokal satu perangkat, tanpa server. Kata sandi tidak pernah disimpan
// mentah: yang tersimpan hanya hash SHA-256 dengan salt acak. Ini cukup untuk
// demo praktikum; akun produksi butuh server dengan bcrypt/argon2.
function randomBase64(byteCount: number): string {
  const bytes = Crypto.getRandomBytes(byteCount);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

async function hashPassword(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`,
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function readAccount(): Promise<StoredAccount | null> {
  try {
    const raw = await SecureStore.getItemAsync(ACCOUNT_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as StoredAccount;
  } catch {
    return null;
  }
}

export async function hasAccount(): Promise<boolean> {
  return (await readAccount()) !== null;
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthUser> {
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

  if (await readAccount()) {
    throw new Error('Perangkat ini sudah punya akun. Masuk dengan akun itu.');
  }

  const salt = randomBase64(16);
  const passwordHash = await hashPassword(password, salt);
  const account: StoredAccount = {
    name: cleanName,
    email: cleanEmail,
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  const session: StoredSession = {
    token: randomBase64(32),
    email: cleanEmail,
    createdAt: new Date().toISOString(),
  };

  await SecureStore.setItemAsync(ACCOUNT_KEY, JSON.stringify(account));
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));

  return { name: cleanName, email: cleanEmail };
}

export async function login(
  email: string,
  password: string,
): Promise<AuthUser> {
  const cleanEmail = email.trim().toLowerCase();

  const account = await readAccount();
  if (!account) {
    throw new Error('Belum ada akun di perangkat ini. Daftar dulu.');
  }
  if (account.email !== cleanEmail) {
    throw new Error('Email atau kata sandi salah.');
  }

  const passwordHash = await hashPassword(password, account.salt);
  if (passwordHash !== account.passwordHash) {
    throw new Error('Email atau kata sandi salah.');
  }

  const session: StoredSession = {
    token: randomBase64(32),
    email: account.email,
    createdAt: new Date().toISOString(),
  };
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));

  return { name: account.name, email: account.email };
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

export async function getSessionUser(): Promise<AuthUser | null> {
  try {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    if (!raw) {
      return null;
    }
    const session = JSON.parse(raw) as StoredSession;
    const account = await readAccount();
    if (!account || account.email !== session.email) {
      return null;
    }
    return { name: account.name, email: account.email };
  } catch {
    return null;
  }
}
