'use client';

/**
 * Authentication Context
 * 
 * Provides authentication state and user data throughout the app.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, UserRole } from './types';
import { COLLECTIONS } from './constants';

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in, fetch user data from Firestore
                const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid));

                if (userDoc.exists()) {
                    const userData = userDoc.data() as User;
                    setUser(userData);
                    setFirebaseUser(firebaseUser);
                } else {
                    // User document doesn't exist
                    setUser(null);
                    setFirebaseUser(null);
                }
            } else {
                // User is signed out
                setUser(null);
                setFirebaseUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Sign in error:', error);
            setLoading(false);
            throw error;
        }
    };

    const signUp = async (email: string, password: string, name: string, role: UserRole) => {
        try {
            // Create Firebase auth user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Create user document in Firestore
            const newUser: User = {
                uid: userCredential.user.uid,
                name,
                email,
                role,
                createdAt: Timestamp.now()
            };

            await setDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid), newUser);
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    };

    const value = {
        user,
        firebaseUser,
        loading,
        signIn,
        signUp,
        signOut
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
