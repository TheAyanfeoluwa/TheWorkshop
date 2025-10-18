// frontend/src/components/PrivateRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext
import { API_BASE_URL } from '../services/progressService';


/**
 * PrivateRoute Component
 * This version uses a simple, synchronous check of the accessToken.
 * After a successful login, the presence of the token is enough to allow routing.
 * The complex asynchronous token verification logic has been removed to prevent 
 * the race condition that was blocking navigation.
 */
const PrivateRoute = ({ children }) => {
  // Use the existence of the token as the immediate gate for routing.
  const { accessToken } = useAuth(); 

  // If accessToken is missing (null or undefined), redirect to the login page.
  if (!accessToken) {
    // 'replace' prevents the user from hitting the back button and landing on a protected page.
    return <Navigate to="/login" replace />;
  }

  // If the accessToken is present, render the protected content immediately.
  return children;
};

export default PrivateRoute;