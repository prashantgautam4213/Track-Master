
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { Booking, UserProfile } from '@/lib/types';
import { supabase } from '@/lib/supabase-client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

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
    // This effect runs once to get the initial user session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setUser(userProfile ? {
          uid: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
        } : null);
      }
      setIsUserLoading(false);
    };
    
    getInitialSession();

    // This listener will update the state on any auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        if (session) {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser(userProfile ? {
            uid: userProfile.id,
            name: userProfile.name,
            email: userProfile.email,
          } : null);
        } else {
          setUser(null);
        }
        setIsUserLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    return !error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const register = async (name: string, email: string, pass: string) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
      email, 
      password: pass,
      options: {
        // You can pass user metadata here, but it's better to create a profile record
      }
    });

    if (authError || !authData.user) {
      console.error('Auth registration error:', authError);
      return false;
    }

    // Insert a new record into the public.profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: authData.user.id, name, email });
    
    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Optional: you might want to delete the created user if profile creation fails
      return false;
    }
    
    // The onAuthStateChange listener will handle setting the user state
    return true;
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
