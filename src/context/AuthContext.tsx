import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  AuthError,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "../config/firebaseConfig";

// Initialize Firebase
let app: any;
let auth: any;
let db: any;

try {
  if (
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "YOUR_API_KEY"
  ) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.log("Firebase not configured:", error);
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  photoURL?: string;
  email: string;
  uid: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  saveUserProfile: (profile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check auth state on mount
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load user profile from Firestore
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          }
        } catch (err) {
          console.error("Error loading profile:", err);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const registerWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      if (!auth) throw new Error("Firebase not configured");
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);
    } catch (err: any) {
      const message = (err as AuthError).message || "Registration failed";
      setError(message);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      if (!auth) throw new Error("Firebase not configured");
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
    } catch (err: any) {
      const message = (err as AuthError).message || "Login failed";
      setError(message);
      throw err;
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      setError(null);
      // In a real app, you would verify the ID token on the backend
      // For now, we'll log a message about implementation
      console.log("Google Sign-In token received:", idToken);
      setError("Google Sign-In requires backend implementation");
      throw new Error(
        "Google Sign-In requires setting up OAuth on Firebase console"
      );
    } catch (err: any) {
      setError(err.message || "Google login failed");
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      if (!auth) throw new Error("Firebase not configured");
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err: any) {
      setError(err.message || "Logout failed");
      throw err;
    }
  };

  const saveUserProfile = async (profile: UserProfile) => {
    try {
      setError(null);
      if (!db || !user) throw new Error("Firebase not configured");
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, profile, { merge: true });
      setUserProfile(profile);
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        registerWithEmail,
        loginWithEmail,
        loginWithGoogle,
        logout,
        saveUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
