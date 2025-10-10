import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('accessToken') || null;
  });

  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || null;
  });

  const navigate = useNavigate();

  const login = useCallback((token, providedUsername) => {
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
    if (providedUsername) {
      setUsername(providedUsername);
      localStorage.setItem('username', providedUsername);
    }
    toast.success("Login successful!");
    navigate('/dashboard');
  }, [navigate]);

  const logout = useCallback(() => {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    setUsername(null);
    localStorage.removeItem('username');
    toast.info("You have been logged out.");
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken && storedToken !== accessToken) {
      setAccessToken(storedToken);
    } else if (!storedToken && accessToken) {
      setAccessToken(null);
    }
    const storedUsername = localStorage.getItem('username');
    if (storedUsername && storedUsername !== username) {
      setUsername(storedUsername);
    } else if (!storedUsername && username) {
      setUsername(null);
    }
  }, [accessToken, username]);

  const authContextValue = {
    accessToken,
    username,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
