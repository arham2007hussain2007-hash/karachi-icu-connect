/*
 * ============================================================
 *  THIS IS MOCK AUTHENTICATION FOR DEVELOPMENT/DEMO PURPOSES.
 *  IT IS NOT PRODUCTION-SECURE.
 *  REAL SERVER-SIDE AUTHENTICATION AND AUTHORIZATION
 *  MUST BE IMPLEMENTED BEFORE PRODUCTION.
 * ============================================================
 */

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On startup: restore session from localStorage
  useEffect(() => {
    try {
      const restored = authService.getCurrentUser();
      if (restored) setUser(restored);
    } catch {
      // Corrupted session — ignore
    }
    setLoading(false);
  }, []);

  const login = useCallback(
    async (email, password, rememberMe = false) => {
      const result = await authService.login(email, password, rememberMe);
      setUser(result.user);
      return result.user;
    },
    []
  );

  const signup = useCallback(async (data) => {
    const result = await authService.signup(data);
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) throw new Error("Not authenticated.");
    const result = await authService.updateProfile(user.id, updates);
    setUser(result.user);
    return result.user;
  }, [user]);

  const changePassword = useCallback(
    async (oldPassword, newPassword) => {
      if (!user) throw new Error("Not authenticated.");
      return authService.changePassword(user.id, oldPassword, newPassword);
    },
    [user]
  );

  const requestPasswordReset = useCallback(async (email) => {
    return authService.requestPasswordReset(email);
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    return authService.resetPassword(token, newPassword);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    isAdmin: authService.isAdmin(user),
    isHospitalStaff: authService.isHospitalStaff(user),
    isPublic: user?.role === "public",
    canAccessHospital: (hospitalId) =>
      authService.canAccessHospital(user, hospitalId),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
