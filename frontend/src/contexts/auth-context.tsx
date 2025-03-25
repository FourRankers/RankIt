'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  uid: string;
  email?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const uid = localStorage.getItem('uid');
    if (uid) {
      setUser({ uid });
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('uid', userData.uid);
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