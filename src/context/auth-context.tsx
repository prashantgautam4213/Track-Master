'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import type { Booking, UserProfile } from '@/lib/types';
import { useFirebase, useUser } from '@/firebase/provider';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';


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
      // Note: In a real app, you'd fetch the profile from Firestore here
      // to get roles or other persistent data. For this demo, we'll
      // construct it from the auth object.
      const profile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || 'No email',
        name: firebaseUser.displayName || 'No Name',
      };
      setUserProfile(profile);
    } else {
      setUserProfile(null);
    }
  }, [firebaseUser]);

  const login = async (email: string, pass: string) => {
    // This will now throw an error if login fails, which the form can catch.
    await signInWithEmailAndPassword(auth, email, pass);
    return true;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const register = async (name: string, email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    const userRef = doc(firestore, 'users', user.uid);
    // Use `await` to ensure the document is created before returning
    await setDoc(userRef, { uid: user.uid, name, email });
    
    return true;
  };
  
  const addBooking = (booking: Booking, oldBookingId?: string) => {
    if (!userProfile) return;
    
    if (oldBookingId) {
        // If it's a reschedule, we replace the old booking document
        const bookingRef = doc(firestore, 'users', userProfile.uid, 'bookings', oldBookingId);
        setDoc(bookingRef, booking, { merge: true }).catch((serverError) => {
            const contextualError = new FirestorePermissionError({
              path: bookingRef.path,
              operation: 'update',
              requestResourceData: booking,
            });
            errorEmitter.emit('permission-error', contextualError);
        });
    } else {
        // For a new booking, add a new document
        const bookingRef = collection(firestore, 'users', userProfile.uid, 'bookings');
        addDoc(bookingRef, booking).catch((serverError) => {
            const contextualError = new FirestorePermissionError({
              path: bookingRef.path,
              operation: 'create',
              requestResourceData: booking,
            });
            errorEmitter.emit('permission-error', contextualError);
        });
    }
  };
  
  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
      if (!userProfile) return;
      const bookingRef = doc(firestore, 'users', userProfile.uid, 'bookings', bookingId);
      setDoc(bookingRef, { status }, { merge: true }).catch((serverError) => {
        const contextualError = new FirestorePermissionError({
          path: bookingRef.path,
          operation: 'update',
          requestResourceData: { status },
        });
        errorEmitter.emit('permission-error', contextualError);
      });
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
