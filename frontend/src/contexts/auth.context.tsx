import React, { createContext, useContext, useState, useEffect } from "react";
import { isTokenExpired } from "../utils/jwt";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const storedToken = localStorage.getItem("token");
    return !!storedToken && !isTokenExpired(storedToken);
  });

  const login = (newToken: string) => {
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        if (isTokenExpired(storedToken)) {
          logout();
        } else {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    const interval = setInterval(checkToken, 60000);
    checkToken();

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
