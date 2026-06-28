import React, { createContext, useContext, useEffect, useState } from "react";
import {
  subscribeToAuthChanges,
  loginWithGoogle as loginWithGoogleService,
  logout as logoutService,
  getUserProfile,
} from "../services/authService.js";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.uid) {
        try {
          const userProfile = await getUserProfile(currentUser.uid);
          setProfile(userProfile);
        } catch (error) {
          console.error("AuthContext: profile fetch error ->", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function loginWithGoogle() {
    const loggedInUser = await loginWithGoogleService();
    const userProfile = await getUserProfile(loggedInUser.uid);
    setProfile(userProfile);
    return loggedInUser;
  }

  async function logout() {
    await logoutService();
    setProfile(null);
  }

  async function refreshProfile() {
    if (!user?.uid) return null;
    const userProfile = await getUserProfile(user.uid);
    setProfile(userProfile);
    return userProfile;
  }

  const isAdmin = profile?.role === "admin";

  const value = {
    user,
    profile,
    isAdmin,
    loading,
    loginWithGoogle,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}