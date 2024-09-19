'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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
  const [lastChecked, setLastChecked] = useState<number>(0);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<boolean> => {
    const now = Date.now();
    if (now - lastChecked < 60000) {
      return isLoggedIn;
    }

    setIsLoading(true);

    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        const response = await axios.get('/api/auth/verify');
        if (response.data.success) {
          setUser(JSON.parse(storedUser));
          setIsLoggedIn(true);
          setLastChecked(now);
          setIsLoading(false);
          return true;
        } else {
          clearAuthData();
        }
      } else {
        clearAuthData();
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      clearAuthData();
    }

    setIsLoading(false);
    setLastChecked(now);
    return false;
  };

  const clearAuthData = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    axios.defaults.headers.common['Authorization'] = '';
    setUser(null);
    setIsLoggedIn(false);
  };

  const login = async (username: string, password: string): Promise<User | null> => {
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      if (response.data.success) {
        const { user, token } = response.data;
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.data.user.id;

        setUser({
          id: user.id,
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName
        });
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setLastChecked(Date.now());
        return user;
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
      clearAuthData();
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