'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase is not configured. Please set up your environment variables.');
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase is not configured. Please set up your environment variables.');
    }

    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isConfigured: Boolean(isFirebaseConfigured),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 