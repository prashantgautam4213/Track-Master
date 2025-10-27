"use client";

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import type { Booking } from '@/lib/types';
import { useFirebase, useUser } from '@/firebase/provider';
import { 
  initiateEmailSignIn, 
  initiateEmailSignUp 
} from '@/firebase/non-blocking-login';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

// Extended user profile stored in Firestore
export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  bookings?: Booking[]; // Bookings might be a subcollection
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isUserLoading: boolean;
  login: (email: string, pass: string) => void;
  logout: () => void;
  register: (name: string, email: string, pass: string) => void;
  addBooking: (booking: Booking, oldBookingId?: string) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, firestore } = useFirebase();
  const { user: firebaseUser, isUserLoading } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // When Firebase user changes, we can fetch their profile from Firestore
  // This is a placeholder as we don't have a profile collection yet.
  useEffect(() => {
    if (firebaseUser) {
      // Here you would fetch the user profile from Firestore
      // For now, we'll create a mock profile from the auth user
      const profile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || 'No email',
        name: firebaseUser.displayName || 'No Name',
        bookings: userProfile?.bookings || [], // Preserve bookings across auth changes
      };
      setUserProfile(profile);
    } else {
      setUserProfile(null);
    }
  }, [firebaseUser, userProfile?.bookings]);

  const login = (email: string, pass: string) => {
    initiateEmailSignIn(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const register = (name: string, email: string, pass: string) => {
    // This is a simplified version. A real app would handle the result of this.
    initiateEmailSignUp(auth, email, pass);
    // We should ideally create the user profile doc *after* successful creation,
    // using onAuthStateChanged listener to trigger it only once.
    // For now, we are creating it optimistically.
    // In a real app, you might use a Cloud Function trigger `onUserCreate`.
    const userRef = doc(firestore, 'users', email); // Using email as ID for simplicity, UID is better
    setDocumentNonBlocking(userRef, { name, email }, { merge: true });
  };
  
  const addBooking = (booking: Booking, oldBookingId?: string) => {
    if (!userProfile) return;
    const bookingRef = collection(firestore, 'users', userProfile.uid, 'bookings');
    addDocumentNonBlocking(bookingRef, booking);
  };
  
  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
      if (!userProfile) return;
      const bookingRef = doc(firestore, 'users', userProfile.uid, 'bookings', bookingId);
      setDocumentNonBlocking(bookingRef, { status }, { merge: true });
  };


  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!firebaseUser, 
      user: userProfile, 
      isUserLoading,
      login, 
      logout, 
      register, 
      addBooking, 
      updateBookingStatus 
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
