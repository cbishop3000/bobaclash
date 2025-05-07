"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN'; // Add role information
  stripeCustomerId: string | null; // Add stripeCustomerId
}

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean; // Easily check if user is an admin
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === 'ADMIN'; // Check if the user is an admin

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user); // Assuming backend sends user object with stripeCustomerId
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser(); // Fetch user data on initial load
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      await fetchUser(); // Rehydrate context with logged-in user
    } else {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' }); // Call API to log out
    setUser(null); // Clear user from state
    window.location.reload(); // Refresh the page to ensure proper logout on the frontend
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
