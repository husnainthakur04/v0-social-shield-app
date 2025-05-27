'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie'; // For client-side interaction if needed, though primarily for server-side cookie handling

interface User {
  userId: string;
  email: string;
  registrationDate?: string; // Make optional as it might not always be needed on client
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (emailInput: string, passwordInput: string) => Promise<void>;
  register: (emailInput: string, passwordInput: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      setLoading(true);
      try {
        // The session_token cookie is HttpOnly, so we can't access it directly from JS.
        // This /api/auth/me call relies on the browser sending the cookie automatically.
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
            setIsAuthenticated(true);
          } else {
            // No valid session or error from /me endpoint
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // Response not OK (e.g., 401 if no token or invalid token)
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to fetch user status:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  const login = async (emailInput: string, passwordInput: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput, password: passwordInput }),
    });
    const data = await response.json();
    if (response.ok && data.success) {
      setUser(data.user);
      setIsAuthenticated(true);
    } else {
      throw new Error(data.error || 'Login failed');
    }
  };

  const register = async (emailInput: string, passwordInput: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput, password: passwordInput }),
    });
    const data = await response.json();
    if (response.ok && data.success) {
      // Optionally log in the user directly after registration or prompt them to log in
      // For now, just registration success. User can login separately.
      console.log('Registration successful:', data.message);
    } else {
      throw new Error(data.error || 'Registration failed');
    }
  };

  const logout = async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (response.ok) {
      setUser(null);
      setIsAuthenticated(false);
      // Cookies.remove('session_token'); // Not needed if HttpOnly and path=/
    } else {
      const data = await response.json();
      throw new Error(data.error || 'Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
