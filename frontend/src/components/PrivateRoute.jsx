// frontend/src/components/PrivateRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext

const PrivateRoute = ({ children }) => {
  const { accessToken, logout } = useAuth(); // Get accessToken and logout function from AuthContext

  // State to manage loading during token verification
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyAccessToken = async () => {
      if (!accessToken) {
        // No token, no need to verify, just set checkingAuth to false
        setCheckingAuth(false);
        return;
      }

      try {
        // Attempt to fetch user data with the token
        const response = await fetch('http://localhost:8001/api/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // If the response is not OK (e.g., 401 Unauthorized, 403 Forbidden)
          // This means the token is invalid or expired
          toast.error("Your session has expired or is invalid. Please log in again.");
          logout(); // Clear the token and state
        }
      } catch (error) {
        console.error("Failed to verify token:", error);
        toast.error("An error occurred during authentication check. Please log in again.");
        logout(); // Clear the token and state
      } finally {
        setCheckingAuth(false); // Authentication check is complete
      }
    };

    verifyAccessToken();
  }, [accessToken, logout]); // Re-run if accessToken or logout function changes

  if (checkingAuth) {
    // Show a loading indicator while the token is being verified
    return <div>Loading authentication...</div>; // Or a spinner component
  }

  // If after checking, there's no valid accessToken, redirect to login page
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // If accessToken is present and verified, render the child components (the protected content)
  return children;
};

export default PrivateRoute;