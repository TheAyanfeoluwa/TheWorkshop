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

  // State flag to control the *immediate* post-login redirect.
  const [shouldRedirect, setShouldRedirect] = useState(false); 

  const navigate = useNavigate();

  // 1. UPDATED: The login function only updates state and sets the redirect flag.
  const login = useCallback((token, providedUsername) => {
    // 1a. Store data synchronously
    localStorage.setItem('accessToken', token);
    setAccessToken(token);
    
    if (providedUsername) {
      localStorage.setItem('username', providedUsername);
      setUsername(providedUsername);
    }
    
    toast.success("Login successful!");
    
    // 1b. Set flag to trigger navigation outside the function scope
    setShouldRedirect(true); 

  }, []); // Removed 'navigate' from dependencies as we're not using it directly here now

  const logout = useCallback(() => {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    setUsername(null);
    localStorage.removeItem('username');
    toast.info("You have been logged out.");
    navigate('/login');
  }, [navigate]);

  // 2. NEW: useEffect to handle the redirect based on the flag
  useEffect(() => {
    if (shouldRedirect) {
        // Reset the flag immediately to prevent infinite loops
        setShouldRedirect(false); 
        // Execute the navigation command
        navigate('/dashboard'); 
    }
  }, [shouldRedirect, navigate]); 
  
  // 3. CLEANUP/Simplification of the old useEffect
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    // Simplified logic: If the stored token exists AND we aren't currently holding it, set it.
    if (storedToken && storedToken !== accessToken) {
      setAccessToken(storedToken);
    }
    
    const storedUsername = localStorage.getItem('username');
    if (storedUsername && storedUsername !== username) {
      setUsername(storedUsername);
    }
    
    // We don't need to clear state here; the logout function handles that.
  }, []); // IMPORTANT: No dependencies here. This should only run on mount for initialization.


  const authContextValue = {
    accessToken,
    username,
    login,
    logout,
    // Add a check for authenticated state if you don't have one already
    isAuthenticated: !!accessToken,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
