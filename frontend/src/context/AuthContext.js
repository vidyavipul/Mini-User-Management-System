import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load token from localStorage and fetch current user
  useEffect(() => {
    const stored = localStorage.getItem('auth_token');
    if (stored) {
      setToken(stored);
      fetchMe(stored);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMe = async (authToken = token) => {
    if (!authToken) return;
    try {
      const data = await apiRequest('/api/auth/me', { token: authToken });
      setUser(data.user);
    } catch (err) {
      console.error(err);
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setError(null);
    const data = await apiRequest('/api/auth/signup', { method: 'POST', body: payload });
    setToken(data.token);
    localStorage.setItem('auth_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const login = async (payload) => {
    setError(null);
    const data = await apiRequest('/api/auth/login', { method: 'POST', body: payload });
    setToken(data.token);
    localStorage.setItem('auth_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const value = {
    user,
    token,
    loading,
    error,
    setError,
    signup,
    login,
    logout,
    fetchMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
