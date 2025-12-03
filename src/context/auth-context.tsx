
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { Booking, UserProfile } from '@/lib/types';
import { supabase } from '@/lib/supabase-client';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isUserLoading: boolean;
  bookings: Booking[];
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  addBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
  updateBooking: (bookingId: string, updatedFields: Partial<Booking>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to format Supabase user to our app's UserProfile
const formatUserProfile = (user: User | null): UserProfile | null => {
  if (!user) return null;
  return {
    uid: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || 'User',
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(formatUserProfile(session?.user ?? null));
      setIsUserLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        const currentUser = formatUserProfile(session?.user ?? null);
        setUser(currentUser);
        setIsUserLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (user) {
        const { data: userBookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.uid);

        if (bookingsError) {
          console.error("Error fetching bookings:", bookingsError);
          setBookings([]);
        } else {
          const formattedBookings = userBookings.map((b: any) => ({
            id: b.id,
            user_id: b.user_id,
            trainId: b.train_id,
            trainName: b.train_name,
            trainNumber: b.train_number,
            date: b.booking_date,
            departureTime: b.departure_time,
            from: b.from_station,
            to: b.to_station,
            passengers: b.passengers,
            totalPrice: b.total_price,
            class: b.travel_class,
            status: b.status,
          }));
          setBookings(formattedBookings);
        }
      } else {
        setBookings([]);
      }
    };
    
    if(!isUserLoading) {
      fetchUserBookings();
    }
  }, [user, isUserLoading]);


  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    return !error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const register = async (name: string, email: string, pass:string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          name: name,
        }
      }
    });

    if (error) {
        console.error('Auth registration error:', error);
        return false;
    }
    
    // The profile is now created by a database trigger, so we don't need to insert it here.
    return !!data.user;
  };

  const addBooking = async (booking: Omit<Booking, 'id'>) => {
    if (!user) throw new Error("User must be logged in to add a booking.");
    
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.uid,
        train_id: booking.trainId,
        train_name: booking.trainName,
        train_number: booking.trainNumber,
        booking_date: booking.date,
        departure_time: booking.departureTime,
        from_station: booking.from,
        to_station: booking.to,
        passengers: booking.passengers,
        total_price: booking.totalPrice,
        travel_class: booking.class,
        status: booking.status || 'upcoming'
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding booking:", error);
    } else if (data) {
      const newBooking: Booking = {
        id: data.id,
        user_id: data.user_id,
        trainId: data.train_id,
        trainName: data.train_name,
        trainNumber: data.train_number,
        date: data.booking_date,
        departureTime: data.departure_time,
        from: data.from_station,
        to: data.to_station,
        passengers: data.passengers,
        totalPrice: data.total_price,
        class: data.travel_class,
        status: data.status,
      };
      setBookings(prev => [...prev, newBooking]);
    }
  };
  
  const updateBooking = async (bookingId: string, updatedFields: Partial<Booking>) => {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: updatedFields.status })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error("Error updating booking:", error);
    } else if (data) {
      setBookings(prev => prev.map(b => (b.id === bookingId ? { ...b, ...updatedFields } : b)));
    }
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
