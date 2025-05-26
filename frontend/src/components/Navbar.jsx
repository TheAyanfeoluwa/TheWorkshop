import { Link, useLocation } from 'react-router-dom'
import { FaSignOutAlt, FaUser } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Navbar = () => {
  const location = useLocation()
  const isAuthenticated = !['/login', '/register', '/'].includes(location.pathname)

  return (
    <nav className="w-full py-2 border-b border-white/10 bg-[#121212] fixed top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="flex-shrink-0"
        >
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="text-3xl font-bold">
            WorkShop
          </Link>
        </motion.div>

        {isAuthenticated ? (
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
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold border border-white/20 rounded-md hover:bg-white/5"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Sign Out</span>
            </motion.button>
            <Link to="/feedback" className="px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold border border-white/20 rounded-md hover:bg-white/5">
              Feedback
            </Link>
          </div>
        ) : (
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
