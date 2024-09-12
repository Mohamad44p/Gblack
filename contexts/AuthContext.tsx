'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
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

    try {
      const response = await axios.get('/api/auth/verify');
      if (response.data.success) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    }

    setUser(null);
    setIsLoggedIn(false);
    setIsLoading(false);
    return false;
  };

  const login = async (username: string, password: string): Promise<User | null> => {
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      if (response.data.success) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        return response.data.user;
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