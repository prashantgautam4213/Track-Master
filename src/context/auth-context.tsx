'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import type { Booking } from '@/lib/types';
import { useFirebase, useUser } from '@/firebase/provider';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
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
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  addBooking: (booking: Booking, oldBookingId?: string) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, firestore } = useFirebase();
  const { user: firebaseUser, isUserLoading } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (firebaseUser) {
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

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      const userRef = doc(firestore, 'users', user.uid);
      // The second argument for options was missing, causing the function to fail.
      setDocumentNonBlocking(userRef, { uid: user.uid, name, email }, {});
      
      return true;
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            // Re-throw specific error to be caught in the form
            throw new Error('email-already-in-use');
        }
        console.error("Registration error:", error);
        return false;
    }
  };
  
  const addBooking = (booking: Booking, oldBookingId?: string) => {
    if (!userProfile) return;
    const bookingRef = collection(firestore, 'users', userProfile.uid, 'bookings');
    
    if (oldBookingId) {
        // If it's a reschedule, we replace the old booking document
        const oldBookingRef = doc(firestore, 'users', userProfile.uid, 'bookings', oldBookingId);
        setDocumentNonBlocking(oldBookingRef, booking, {});
    } else {
        // For a new booking, add a new document
        addDocumentNonBlocking(bookingRef, booking);
    }
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
