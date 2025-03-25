'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: { uid: string } | null;
  login: (uid: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ uid: string } | null>(null);

  useEffect(() => {
    const uid = localStorage.getItem('uid');
    if (uid) {
      setUser({ uid });
    }
  }, []);

  const login = (uid: string) => {
    setUser({ uid });
    localStorage.setItem('uid', uid);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('uid');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 