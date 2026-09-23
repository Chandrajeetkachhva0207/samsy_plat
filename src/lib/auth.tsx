import React, { createContext, useContext, useEffect, useState } from "react";
import { api, getAuthToken, setAuthToken } from "./api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
  refreshAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshAdmin = async () => {
    const currentToken = getAuthToken();
    if (!currentToken) {
      setAdmin(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.success && res.admin) {
        setAdmin(res.admin);
        setToken(currentToken);
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAdmin();
  }, []);

  const login = (newToken: string, newAdmin: AdminUser) => {
    setAuthToken(newToken);
    setToken(newToken);
    setAdmin(newAdmin);
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        loading,
        login,
        logout,
        refreshAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
