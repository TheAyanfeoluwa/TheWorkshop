const Navbar = ({ currentView, setCurrentView }) => {
  // const location = useLocation(); 
  const navigate = useNavigate(); 

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
  const motionProps = {
    whileHover: { scale: 1.05 },
    transition: { type: 'spring', stiffness: 400, damping: 10 },
  };

  // The conditional rendering now uses the 'isLoggedIn' state
  return (
    <div className="w-full fixed top-0 left-0 z-50 bg-[#121212] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">

          {/* --- START OF REPLACEMENT FOR MAIN TITLE/NAV LINK --- */}
          {isLoggedIn ? (
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-bold text-white">Dashboard</h1> 
              
              {/* Timer Button */}
              <motion.button 
                onClick={() => setCurrentView('timer')}
                className={`px-3 py-1 rounded-md text-base font-semibold transition-colors ${
                  currentView === 'timer' ? 'bg-white text-black' : 'text-gray-300 hover:text-white'
                }`}
                {...motionProps}
              >
                Timer
              </motion.button>

              {/* Progress Button */}
              <motion.button 
                onClick={() => setCurrentView('progress')}
                className={`px-3 py-1 rounded-md text-base font-semibold transition-colors ${
                  currentView === 'progress' ? 'bg-white text-black' : 'text-gray-300 hover:text-white'
                }`}
                {...motionProps}
              >
                Progress
              </motion.button>
            </div>
          ) : ( 
            <motion.div {...motionProps}>
              <Link to={'/'} className="text-3xl font-bold">
                WorkShop
              </Link>
            </motion.div>
          )}
          {/* --- END OF REPLACEMENT --- */}

        {isLoggedIn ? ( // Use isLoggedIn here
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.button 

            onClick={() => navigate('/profile')} 
            {...motionProps}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base text-white border border-white/20 rounded-md hover:bg-white/5"
            >
              <FaUser />
              <span className="hidden sm:inline">Profile</span>
            </motion.button>
            <motion.button 
              onClick={handleLogout} // ADD: onClick handler
              {...motionProps}
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
            <motion.div {...motionProps}>
              <Link 
                to="/login" 
                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold border border-white/20 rounded-md hover:bg-white/5"
              >
                Login
              </Link>
            </motion.div>

            <motion.div {...motionProps}>
              <Link 
                to="/register" 
                className="px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold bg-white text-black border border-transparent rounded-md hover:bg-gray-200"
              >
                Register
              </Link>
            </motion.div>

            {/* Keeping Feedback link under unauthenticated for now, consistent with original */}
            <motion.div {...motionProps}>
              <Link to="/feedback" className="px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold border border-white/20 rounded-md hover:bg-white/5">
                Feedback
              </Link>
            </motion.div>
          </div>
        )}
        </nav>
      </div>
    </div>
  )
}

export default Navbar;
