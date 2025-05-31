// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // For displaying toast notifications

// Create the AuthContext
const AuthContext = createContext(null);

// Custom hook to use the AuthContext easily in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component that will wrap your application
export const AuthProvider = ({ children }) => {
  // Initialize accessToken from localStorage on component mount
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('accessToken') || null;
  });
  const navigate = useNavigate(); // Hook for navigation
// frontend/src/context/AuthContext.jsx

// ... (other imports and code) ...

const login = useCallback((token) => {
  setAccessToken(token);
  localStorage.setItem('accessToken', token);
  toast.success("Login successful!");
  navigate('/dashboard'); // <-- CHANGED TO /dashboard
}, [navigate]);

// ... (rest of your code) ...
  // Function to handle user logout
  const logout = useCallback(() => {
    setAccessToken(null); // Clear state
    localStorage.removeItem('accessToken'); // Remove from local storage
    toast.info("You have been logged out."); // Show info message
    navigate('/login'); // Redirect to the login page after logout
  }, [navigate]);

  // Optional: useEffect to re-sync accessToken with localStorage if external changes occur
  // Though useState's initializer usually handles the first load, this can catch
  // direct localStorage manipulation or other edge cases.
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken && storedToken !== accessToken) {
      setAccessToken(storedToken);
    } else if (!storedToken && accessToken) {
      // If token was in state but not in storage (e.g. cleared manually)
      setAccessToken(null);
    }
  }, [accessToken]);


  // The value that will be supplied to any components that use useAuth()
  const authContextValue = {
    accessToken,
    login,
    logout,
    // You might add user information (e.g., user email) here later if fetched after login
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};