'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';
import type { Booking, UserProfile } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// Mock user data for a purely frontend experience
const mockUsers: UserProfile[] = [
  { uid: '1', name: 'Demo User', email: 'demo@example.com' },
];

const mockBookings: Booking[] = [
    {
        id: 'B001',
        trainId: 'T123',
        trainName: 'Mumbai Rajdhani',
        trainNumber: '12951',
        date: '2024-08-15',
        departureTime: '17:00',
        from: 'Mumbai Central, MH',
        to: 'New Delhi, DL',
        passengers: 1,
        totalPrice: 3500,
        class: '2AC',
        status: 'upcoming',
    }
];

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isUserLoading: boolean;
  bookings: Booking[];
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, pass: string) => boolean;
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updatedBooking: Booking) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const login = (email: string, pass: string) => {
    // Mock login logic
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      // Load mock bookings for the demo user
      if (foundUser.email === 'demo@example.com') {
          setBookings(mockBookings);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setBookings([]);
  };

  const register = (name: string, email: string, pass: string) => {
    // Mock register logic
    if (mockUsers.find(u => u.email === email)) {
      return false; // User already exists
    }
    const newUser: UserProfile = { uid: uuidv4(), name, email };
    mockUsers.push(newUser);
    setUser(newUser);
    setIsAuthenticated(true);
    setBookings([]); // Start with no bookings
    return true;
  };

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };
  
  const updateBooking = (bookingId: string, updatedBooking: Booking) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? updatedBooking : b));
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      isUserLoading: false, // Always false in mock setup
      bookings,
      login, 
      logout, 
      register, 
      addBooking,
      updateBooking
    }}>
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
