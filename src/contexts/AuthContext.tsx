import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  AuthUser,
  getSessionUser,
  logout,
  onAuthChange,
} from '../services/authService';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let aktif = true;
    getSessionUser()
      .then((sessionUser) => {
        if (aktif) {
          setUser(sessionUser);
          setLoading(false);
        }
      })
      .catch(() => {
        if (aktif) {
          setLoading(false);
        }
      });
    const unsubscribe = onAuthChange((sessionUser) => {
      if (aktif) {
        setUser(sessionUser);
      }
    });
    return () => {
      aktif = false;
      unsubscribe();
    };
  }, []);

  const signOut = async (): Promise<void> => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider.');
  }
  return value;
}
