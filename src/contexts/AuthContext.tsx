import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { localStorageService } from '../services/localStorage';
import { authService } from '../services/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'technician' | 'client';
  company?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: User['role'], company?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
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
    // Initialize from auth service (supports backend or mock)
    const current = authService.getCurrentUser();
    if (current) setUser(current);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      setUser(res.user);
      setIsLoading(false);
      return true;
    } catch (e) {
      console.error('Login failed:', e);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    role: User['role'], 
    company?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await authService.signup(email, password, name, role, company);
      setUser(res.user);
      setIsLoading(false);
      return true;
    } catch (e) {
      console.error('Signup failed:', e);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    // Update the stored token with new user data
    const mockToken = btoa(JSON.stringify({ header: 'mock' })) + '.' + 
                     btoa(JSON.stringify(updatedUser)) + '.' + 
                     btoa('signature');
    localStorageService.setAuthToken(mockToken);
    
    setIsLoading(false);
    return true;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // In a real app, this would send a reset email
    console.log(`Password reset email sent to: ${email}`);
    
    setIsLoading(false);
    return true;
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // In a real app, this would validate the current password and update it
    if (currentPassword === 'demo123') {
      console.log('Password changed successfully');
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
    updateProfile,
    resetPassword,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};