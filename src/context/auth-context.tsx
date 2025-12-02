
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { Booking, UserProfile } from '@/lib/types';
import { supabase } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isUserLoading: boolean;
  bookings: Booking[];
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updatedBooking: Booking) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // This effect runs once when the component mounts to check the initial auth state.
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // TODO: Here you would fetch the user's profile from your `profiles` table
        // and their bookings from the `bookings` table.
        // For now, we'll create a mock profile from the session data.
        const userProfile: UserProfile = {
          uid: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'User',
        };
        setUser(userProfile);
      }
      setIsUserLoading(false);
    };

    getSession();

    // This listener will update the state whenever the user logs in or out.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const userProfile: UserProfile = {
          uid: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'User',
        };
        setUser(userProfile);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    // TODO: Implement Supabase call for login
    // Example: const { error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('Login attempt with:', email);
    alert('Login functionality needs to be connected to Supabase.');
    return false;
  };

  const logout = async () => {
    // TODO: Implement Supabase call for logout
    // Example: await supabase.auth.signOut();
    setUser(null);
  };

  const register = async (name: string, email: string, pass: string) => {
    // TODO: Implement Supabase call for registration
    // Example: const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
    console.log('Register attempt for:', email);
    alert('Registration functionality needs to be connected to Supabase.');
    return false;
  };

  const addBooking = (booking: Booking) => {
    // TODO: This should make an API call to insert a row into your Supabase `bookings` table.
    setBookings(prev => [...prev, booking]);
  };
  
  const updateBooking = (bookingId: string, updatedBooking: Booking) => {
     // TODO: This should make an API call to update a row in your Supabase `bookings` table.
    setBookings(prev => prev.map(b => b.id === bookingId ? updatedBooking : b));
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!user, 
      user, 
      isUserLoading,
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
