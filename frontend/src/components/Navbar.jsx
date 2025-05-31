// frontend/src/components/Navbar.jsx
import React, { useState, useEffect } from 'react'; // ADD: useState and useEffect
import { Link, useNavigate } from 'react-router-dom'; // MODIFY: Import useNavigate instead of useLocation
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Navbar = () => {
  // const location = useLocation(); // REMOVE: No longer needed for auth check
  const navigate = useNavigate(); // ADD: For programmatic navigation after logout

  // ADD: State to track authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ADD: Effect to check login status on mount and listen for localStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('accessToken');
      setIsLoggedIn(!!token); // Set true if token exists, false otherwise
    };

    // Initial check when component mounts
    checkLoginStatus();

    // Listen for storage events (e.g., login/logout from another tab)
    window.addEventListener('storage', checkLoginStatus);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []); // Empty dependency array means this runs once on mount

  // ADD: Logout function
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Clear the token
    setIsLoggedIn(false); // Update local state
    navigate('/login'); // Redirect to login page
  };

  // The conditional rendering now uses the 'isLoggedIn' state
  return (
    <nav className="w-full py-2 border-b border-white/10 bg-[#121212] fixed top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="flex-shrink-0"
        >
          {/* WorkShop logo link depends on login status */}
          <Link to={isLoggedIn ? '/dashboard' : '/'} className="text-3xl font-bold">
            WorkShop
          </Link>
        </motion.div>

        {isLoggedIn ? ( // Use isLoggedIn here
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base text-white border border-white/20 rounded-md hover:bg-white/5"
            >
              <FaUser />
              <span className="hidden sm:inline">Profile</span>
            </motion.button>
            <motion.button 
              onClick={handleLogout} // ADD: onClick handler
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold border border-white/20 rounded-md hover:bg-white/5"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Sign Out</span>
            </motion.button>
            {/* Keeping Feedback link under authenticated for now, consistent with original */}
            <Link to="/feedback" className="px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold border border-white/20 rounded-md hover:bg-white/5">
              Feedback
            </Link>
          </div>
        ) : ( // If not logged in
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link 
                to="/login" 
                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold border border-white/20 rounded-md hover:bg-white/5"
              >
                Login
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link 
                to="/register" 
                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold bg-white text-black border border-transparent rounded-md hover:bg-gray-200"
              >
                Register
              </Link>
            </motion.div>

            {/* Keeping Feedback link under unauthenticated for now, consistent with original */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link to="/feedback" className="px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold border border-white/20 rounded-md hover:bg-white/5">
                Feedback
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar