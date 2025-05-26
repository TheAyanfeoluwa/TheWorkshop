import { Link } from 'react-router-dom'
import { FaRegClock, FaRegListAlt, FaChartLine, FaStore } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20">
        <motion.h1 
          className="text-5xl md:text-6xl font-bold mb-6"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Elevate Your Productivity
        </motion.h1>
        <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl">
          WorkShop is your all-in-one productivity platform designed to help you focus, track tasks, build habits, and achieve your goals.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link 
            to="/register" 
            className="px-8 py-3 bg-white text-black border border-transparent rounded-md font-bold hover:bg-gray-200"
          >
            Get Started
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-20">
          <FeatureCard
            icon={<FaRegClock className="text-4xl" />}
            title="Pomodoro Timer"
            description="Stay focused and manage your work sessions effectively"
          />
          <FeatureCard
            icon={<FaRegListAlt className="text-4xl" />}
            title="Task Management"
            description="Organize and track your tasks with ease"
          />
          <FeatureCard
            icon={<FaChartLine className="text-4xl" />}
            title="Progress Tracking"
            description="Monitor your productivity and achievements"
          />
          <FeatureCard
            icon={<FaStore className="text-4xl" />}
            title="Rewards Store"
            description="Earn coins and unlock rewards"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      className="p-6 bg-[#1A1A1A] rounded-lg text-center hover:bg-[#242424] transition-colors"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}

export default Landing
