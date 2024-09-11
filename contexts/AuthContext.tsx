'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User | null>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthStatus = async (): Promise<boolean> => {
    if (!isLoading && isLoggedIn) return true;
    setIsLoading(true);
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
      setIsLoading(false);
      return true;
    }

    setUser(null);
    setIsLoggedIn(false);
    setIsLoading(false);
    return false;
  };

  const login = async (username: string, password: string): Promise<User | null> => {
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const { success, user } = response.data;

      if (success && user) {
        const userData: User = {
          id: 0,
          user_email: user.user_email,
          user_nicename: user.user_nicename,
          user_display_name: user.user_display_name
        };

        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        setIsLoggedIn(true);
        return userData;
      } else {
        throw new Error('Login failed: Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'An error occurred during login');
    }
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    try {
      await axios.post('/api/auth/register', { username, email, password });
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'An error occurred during registration');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post('/api/auth/logout');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsLoggedIn(false);
    } catch (error: any) {
      console.error('Logout error:', error.response?.data || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, register, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};