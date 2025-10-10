"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User, Booking } from '@/lib/types';
import { mockUser, demoUser } from '@/lib/data';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, pass: string) => boolean;
  addBooking: (booking: Booking, oldBookingId?: string) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
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
    const newUser = { name, email, bookings: [] };
    // In a real app, you'd save this to a DB. Here we just set it in state.
    setUser(newUser);
    // Also update our mock data for session persistence on reload etc.
    // This is a hack for the prototype.
    if(typeof window !== 'undefined') {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        users[email] = newUser;
        localStorage.setItem('users', JSON.stringify(users));
      } catch (e) {
        console.error("Could not save user to local storage", e)
      }
    }
    return true;
  };
  
  const addBooking = (booking: Booking, oldBookingId?: string) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      
      let updatedBookings;
      if (oldBookingId) {
        // This is a reschedule, replace the old booking
        updatedBookings = currentUser.bookings.map(b => 
            b.id === oldBookingId ? booking : b
        );
      } else {
        // This is a new booking
        updatedBookings = [booking, ...currentUser.bookings];
      }

      const updatedUser = {
        ...currentUser,
        bookings: updatedBookings,
      };

      // Mock data update
      const updateUserBookings = (userToUpdate: User) => {
        if (oldBookingId) {
            const index = userToUpdate.bookings.findIndex(b => b.id === oldBookingId);
            if (index !== -1) {
                userToUpdate.bookings[index] = booking;
            }
        } else {
            userToUpdate.bookings.unshift(booking);
        }
      };

      if (currentUser.email === mockUser.email) {
        updateUserBookings(mockUser);
      } else if (currentUser.email === demoUser.email) {
        updateUserBookings(demoUser);
      }
      return updatedUser;
    });
  };
  
  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
      setUser(currentUser => {
          if (!currentUser) return null;
          const updatedBookings = currentUser.bookings.map(b => 
              b.id === bookingId ? { ...b, status } : b
          );
          return { ...currentUser, bookings: updatedBookings };
      });
      // Also update mock data
      const bookingToUpdateDemo = demoUser.bookings.find(b => b.id === bookingId);
      if (bookingToUpdateDemo) {
        bookingToUpdateDemo.status = status;
      }
      const bookingToUpdateMock = mockUser.bookings.find(b => b.id === bookingId);
      if (bookingToUpdateMock) {
        bookingToUpdateMock.status = status;
      }
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register, addBooking, updateBookingStatus }}>
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
