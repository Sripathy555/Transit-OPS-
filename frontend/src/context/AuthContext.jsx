import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const normalizeRole = (role) => {
  if (!role) return 'Fleet Manager';
  const normalizedRole = String(role).trim().toLowerCase();
  const roleMap = {
    manager: 'Fleet Manager',
    admin: 'Fleet Manager',
    dispatcher: 'Dispatcher',
    analyst: 'Financial Analyst',
    'financial analyst': 'Financial Analyst',
    'safety officer': 'Safety Officer',
    'fleet manager': 'Fleet Manager',
  };

  return roleMap[normalizedRole] || role;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password }).catch(async (error) => {
        if (error.response?.status === 404) {
          return api.post('/login', { email, password });
        }
        throw error;
      });
      const { token, user: userData } = response.data;
      const normalizedUser = {
        ...userData,
        role: normalizeRole(userData?.role),
        name: userData?.name || userData?.email || email,
      };
      localStorage.setItem('token', token);
      setUser(normalizedUser);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to login'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
