import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // In a real app, check for stored auth token and validate it
      setIsLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Demo users for testing
      const demoUsers: Record<string, User> = {
        'admin@msp.com': {
          id: '1',
          email: 'admin@msp.com',
          name: 'Admin User',
          role: 'admin',
          company: 'TechFlow MSP'
        },
        'tech@msp.com': {
          id: '2',
          email: 'tech@msp.com',
          name: 'John Technician',
          role: 'technician',
          company: 'TechFlow MSP'
        },
        'client@company.com': {
          id: '3',
          email: 'client@company.com',
          name: 'Jane Client',
          role: 'client',
          company: 'Client Corp'
        }
      };

      const foundUser = demoUsers[email];
      if (foundUser && password === 'demo123') {
        setUser(foundUser);
        // In a real app, store the auth token securely
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      // In a real app, clear stored auth token
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};