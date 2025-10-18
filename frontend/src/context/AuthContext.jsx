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

  // NEW STATE: Tracks only if a login just completed successfully
  const [didLogin, setDidLogin] = useState(false); 

  const navigate = useNavigate();

  // 1. LOGIN: Only updates state and sets the flag
  const login = useCallback((token, providedUsername) => {
    // 1a. Store data synchronously
    localStorage.setItem('accessToken', token);
    setAccessToken(token);
    
    if (providedUsername) {
      localStorage.setItem('username', providedUsername);
      setUsername(providedUsername);
    }
    
    // 1b. Set flag to trigger the independent redirect effect
    setDidLogin(true); 

    toast.success("Login successful!");
  }, []); 

  const logout = useCallback(() => {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    setUsername(null);
    localStorage.removeItem('username');
    
    // Ensure didLogin is always false on logout
    setDidLogin(false); 
    
    toast.info("You have been logged out.");
    navigate('/login');
  }, [navigate]);

  // 2. REDIRECT EFFECT: Runs only when didLogin is set to true
  useEffect(() => {
    if (didLogin) {
      // Clear the flag immediately
      setDidLogin(false); 
      // Execute the navigation command after state has settled
      navigate('/dashboard'); 
    }
  }, [didLogin, navigate]); 
  
  // 3. INITIALIZATION EFFECT: Runs only on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken && storedToken !== accessToken) {
      setAccessToken(storedToken);
    }
    
    const storedUsername = localStorage.getItem('username');
    if (storedUsername && storedUsername !== username) {
      setUsername(storedUsername);
    }
  }, []); 


  const authContextValue = {
    accessToken,
    username,
    login,
    logout,
    isAuthenticated: !!accessToken,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
