import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userEmail: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (storedEmail) {
        const userData = await authService.verifyUser(storedEmail);
        setUser(userData);
        setUserEmail(storedEmail);
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
      await AsyncStorage.removeItem('userEmail');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string) => {
    const userData = await authService.verifyUser(email);
    setUser(userData);
    setUserEmail(email);
    await AsyncStorage.setItem('userEmail', email);
  };

  const logout = async () => {
    setUser(null);
    setUserEmail(null);
    await AsyncStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userEmail,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
