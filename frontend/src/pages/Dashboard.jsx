import { Link } from 'react-router-dom'
import { FaClock, FaListAlt, FaChartBar, FaStore, FaCoins } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Welcome back, User!</h1>
          <p className="text-gray-400">Let's make today productive</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Tasks Completed" value="0" />
          <StatCard title="Pomodoro Sessions" value="0" />
          <StatCard title="Total Focus Time" value="0h" />
        </div>

        <motion.div 
          className="bg-[#1A1A1A] p-6 rounded-lg mb-8"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaCoins className="text-yellow-500 text-2xl" />
              <div>
                <h3 className="text-xl font-semibold">Coins</h3>
                <p className="text-3xl font-bold">0</p>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                to="/store"
                className="px-6 py-3 bg-white text-black border border-transparent rounded-md font-bold hover:bg-gray-200 transition-colors"
              >
                Go to Store
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FeatureCard
            to="/pomodoro"
            icon={<FaClock />}
            title="Pomodoro"
            description="Focus timer and work sessions"
          />
          <FeatureCard
            to="/tasks"
            icon={<FaListAlt />}
            title="To-Do"
            description="Manage your tasks and projects"
          />
          <FeatureCard
            to="/progress"
            icon={<FaChartBar />}
            title="Progress"
            description="View your productivity stats"
          />
          <FeatureCard
            to="/store"
            icon={<FaStore />}
            title="Store"
            description="Spend your earned coins"
          />
        </div>

        <motion.div 
          className="mt-8 bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-lg"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Exciting Features Coming Soon!</h3>
              <p className="text-white/80">Check out what's in development</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <button className="px-6 py-3 bg-white text-black border border-transparent rounded-md font-bold hover:bg-gray-200 transition-colors">
              <Link
                to="/coming-soon"
                className="px-6 py-3 bg-white text-black border border-transparent rounded-md font-bold hover:bg-gray-200 transition-colors"
              >
                Learn More
              </Link>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

const StatCard = ({ title, value }) => {
  return (
    <motion.div 
      className="bg-[#1A1A1A] p-6 rounded-lg"
      whileHover={{ scale: 1.01, backgroundColor: '#242424' }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-gray-400 mb-1">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
      <div className="h-1 bg-white/10 rounded-full mt-2">
        <div className="h-full w-0 bg-white rounded-full"></div>
      </div>
    </motion.div>
  )
}

const FeatureCard = ({ to, icon, title, description }) => {
  return (
    <Link to={to}>
      <motion.div 
        className="bg-[#1A1A1A] p-6 rounded-lg hover:bg-[#242424] transition-colors"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </motion.div>
    </Link>
  )
}

export default Dashboard
