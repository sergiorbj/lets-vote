import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  userEmail: string | null;
  setUser: (user: User | null) => void;
  setUserEmail: (email: string | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

const USER_STORAGE_KEY = 'lets-vote-user';
const EMAIL_STORAGE_KEY = 'lets-vote-email';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUserState] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [userEmail, setUserEmailState] = useState<string | null>(() => {
    return localStorage.getItem(EMAIL_STORAGE_KEY);
  });

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const setUserEmail = (email: string | null) => {
    setUserEmailState(email);
    if (email) {
      localStorage.setItem(EMAIL_STORAGE_KEY, email);
    } else {
      localStorage.removeItem(EMAIL_STORAGE_KEY);
    }
  };

  const logout = () => {
    setUser(null);
    setUserEmail(null);
  };

  const isAuthenticated = !!user && !!userEmail;

  const value: AuthContextType = {
    user,
    userEmail,
    setUser,
    setUserEmail,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
