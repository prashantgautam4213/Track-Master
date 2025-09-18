"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '@/lib/types';
import { mockUser, demoUser } from '@/lib/data';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, pass: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, pass: string) => {
    // Mock login logic
    if (email === 'alex.doe@example.com' && pass === 'password123') {
      setIsAuthenticated(true);
      setUser(mockUser);
      return true;
    }
    if (email === 'demo@example.com' && pass === 'password') {
      setIsAuthenticated(true);
      setUser(demoUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const register = (name: string, email: string, pass: string) => {
    // Mock register logic
    console.log('Registering user:', { name, email, pass });
    setIsAuthenticated(true);
    setUser({ name, email, bookings: [] });
    return true;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register }}>
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
