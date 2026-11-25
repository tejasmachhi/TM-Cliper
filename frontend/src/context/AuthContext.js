'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/utils/api';

const defaultAuthValue = {
  user: null,
  token: null,
  loading: false,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: async () => {},
};

const AuthContext = createContext(defaultAuthValue);

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('clipgenius_token');
    const savedUser = localStorage.getItem('clipgenius_user');

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {}
      }

      // Verify token with backend
      api.getMe()
        .then(res => {
          if (res && res.id) {
            setUser(res);
            localStorage.setItem('clipgenius_user', JSON.stringify(res));
          }
        })
        .catch(() => {
          // Token invalid or expired
          logout(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('clipgenius_token', res.token);
      localStorage.setItem('clipgenius_user', JSON.stringify(res.user));
      
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      router.push(redirectUrl);
      return res.user;
    }
    throw new Error('Login failed');
  };

  const register = async (name, email, password) => {
    const res = await api.register({ name, email, password });
    if (res && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('clipgenius_token', res.token);
      localStorage.setItem('clipgenius_user', JSON.stringify(res.user));
      
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      router.push(redirectUrl);
      return res.user;
    }
    throw new Error('Registration failed');
  };

  const logout = (redirect = true) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('clipgenius_token');
    localStorage.removeItem('clipgenius_user');
    if (redirect) {
      router.push('/login');
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res && res.id) {
        setUser(res);
        localStorage.setItem('clipgenius_user', JSON.stringify(res));
      }
    } catch (e) {}
  };

  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context || defaultAuthValue;
}
