import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  api,
  getAuthToken,
  setAuthToken,
} from "./api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: AuthUser | null;

  // Kept for compatibility with existing admin pages
  admin: AuthUser | null;

  token: string | null;
  loading: boolean;

  login: (
    token: string,
    user: AuthUser
  ) => void;

  logout: () => void;

  refreshUser: () => Promise<void>;

  // Kept for compatibility with existing code
  refreshAdmin: () => Promise<void>;

  isAdmin: boolean;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const refreshUser = async () => {
    const currentToken = getAuthToken();

    if (!currentToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.getMe();

      if (res.success && res.user) {
        setUser(res.user);
        setToken(currentToken);
      } else {
        setAuthToken(null);
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error(
        "Unable to refresh user:",
        error
      );

      setAuthToken(null);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (
    newToken: string,
    newUser: AuthUser
  ) => {
    setAuthToken(newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const isAdmin =
    user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,

        // Admin compatibility
        admin:
          user?.role === "admin"
            ? user
            : null,

        token,
        loading,

        login,
        logout,

        refreshUser,

        // Compatibility with existing admin code
        refreshAdmin: refreshUser,

        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}