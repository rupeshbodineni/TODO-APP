import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import apiClient, { setAuthToken, getStoredToken } from '../api/client';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-restore session on app launch
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = await getStoredToken();
        if (storedToken) {
          setToken(storedToken);
          const response = await apiClient.get('/auth/me');
          if (response.data?.user) {
            setUser(response.data.user);
          }
        }
      } catch (err) {
        console.warn('Session restoration failed or expired token');
        await setAuthToken(null);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.post('/auth/login', { email, password });
      
      const { token: newToken, user: userData } = response.data;
      await setAuthToken(newToken);
      setToken(newToken);
      setUser(userData);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials and server connectivity.';
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.post('/auth/register', { name, email, password });
      
      const { token: newToken, user: userData } = response.data;
      await setAuthToken(newToken);
      setToken(newToken);
      setUser(userData);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
