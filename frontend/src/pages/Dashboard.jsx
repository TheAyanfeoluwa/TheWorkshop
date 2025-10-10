import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaClock, FaListAlt, FaChartBar, FaStore, FaCoins, FaTasks, FaBrain } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// import { getProgressData } from '../services/progressService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { username } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await fetch('http://localhost:8001/api/v1/users/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('accessToken');
            navigate('/login');
          }
          const errorData = await response.json();
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserEmail(data.email);
        // setProgress(getProgressData()); // integrate real progress later
      } catch (err) {
        setError(err.message || "Failed to load user data.");
        localStorage.removeItem('accessToken');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  if (loading) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Loading dashboard...</div>;
  if (error) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-16">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Welcome back, {username || userEmail}!</h1>
            <p className="text-gray-400">Here's a quick look at your workspace.</p>
          </div>
          <div className="flex items-center gap-3 bg-[#1A1A1A] px-4 py-2 rounded-lg">
            <FaCoins className="text-yellow-500 text-2xl" />
            <span className="text-2xl font-bold">0</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard icon={<FaTasks />} title="Tasks Completed" value="0" />
          <StatCard icon={<FaBrain />} title="Pomodoros" value="0" />
          <StatCard icon={<FaClock />} title="Focus Time" value="0h 0m" />
        </div>

        <h2 className="text-2xl font-bold mb-6">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10">
          <FeatureCard to="/pomodoro" icon={<FaClock />} title="Pomodoro" description="Focus timer and work sessions" />
          <FeatureCard to="/tasks" icon={<FaListAlt />} title="To-Do" description="Manage your tasks and projects" />
          <FeatureCard to="/progress" icon={<FaChartBar />} title="Progress" description="View your productivity stats" />
          <FeatureCard to="/store" icon={<FaStore />} title="Store" description="Spend your earned coins" />
        </div>

        <motion.div className="mt-8 bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-lg" whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Exciting Features Coming Soon!</h3>
              <p className="text-white/80">Check out what's in development</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <Link to="/coming-soon" className="px-6 py-3 bg-white text-black border border-transparent rounded-md font-bold hover:bg-gray-200 transition-colors">Learn More</Link>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <motion.div className="bg-[#1A1A1A] p-6 rounded-lg" whileHover={{ scale: 1.01, backgroundColor: '#242424' }} transition={{ duration: 0.2 }}>
    <div className="flex items-center gap-4">
      <div className="text-3xl text-white/50">{icon}</div>
      <div>
        <h3 className="text-gray-400 mb-1">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  </motion.div>
);

const FeatureCard = ({ to, icon, title, description }) => (
  <Link to={to}>
    <motion.div className="bg-[#1A1A1A] p-6 rounded-lg hover:bg-[#242424] transition-colors" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </motion.div>
  </Link>
);

export default Dashboard;
