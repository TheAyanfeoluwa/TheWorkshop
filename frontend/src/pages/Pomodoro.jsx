import Progress from './Progress'; // Assuming Progress.jsx is in the same directory
import { useState, useEffect } from 'react';
import { usePomodoro } from '../context/PomodoroContext';
import { FaPlay, FaPause, FaForward, FaRedo, FaCog, FaCoins } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
// Define the Progress View component:
const ProgressView = () => (
  <motion.div
    key="progress-view" // Key is essential for AnimatePresence
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.3 }}
    className="max-w-2xl mx-auto p-12 rounded-xl bg-[#1A1A1A] border border-white/10 shadow-2xl mt-24"
  >
    <h2 className="text-3xl font-bold mb-4 text-green-400 text-center">Your Session History</h2>
    <div className="bg-[#242424] p-6 rounded-lg h-96 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Detailed progress charts and history will appear here!</p>
    </div>
  </motion.div>
);

const Pomodoro = () => {
  const {
    time,
    mode,
    isRunning,
    settings,
    setSettings,
    handleStart,
    handlePause,
    handleReset,
    handleSkip,
    handleModeChange,
    pomodoroCount
  } = usePomodoro();


  const [currentView, setCurrentView] = useState('timer'); // 'timer' or 'progress'
  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  const handleSettingsSave = () => {
    setSettings(tempSettings);
    localStorage.setItem('pomodoroSettings', JSON.stringify(tempSettings));
    setShowSettings(false);
    setTempSettings(null);
    toast.success('Settings saved!');
  };

  const modeColor = {
    pomodoro: 'bg-red-500',
    shortBreak: 'bg-blue-500',
    longBreak: 'bg-green-500',
  };


const SettingInput = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs text-gray-400 mb-1">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full p-2 bg-[#242424] rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
      min="1"
    />
  </div>
);

const ToggleSwitch = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-white/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
  </label>
);


  return (
    <div className={`min-h-screen bg-[#121212]`}>
      {/* MODIFIED: Pass currentView state and setter to Navbar */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} /> 
      <ToastContainer theme="dark" position="bottom-right" />

      <div className="container mx-auto px-4 py-32">
        {/* NEW: Conditional Rendering Logic */}
        <AnimatePresence mode="wait">
          {currentView === 'timer' && (
            <motion.div
              key="timer-view" // Key is essential for AnimatePresence
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className={`relative max-w-2xl mx-auto p-12 rounded-lg bg-[#1A1A1A] border border-white/10`}
            >
              
              {/* Existing Timer UI Content Starts Here */}
              <div className={`absolute top-4 right-4 h-3 w-3 rounded-full ${isRunning ? modeColor[mode] : 'bg-gray-500'}`} />

              <div className="flex justify-between items-center mb-12">
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: mode === 'pomodoro' ? '' : '#242424'}}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ${
                      mode === 'pomodoro' ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={() => handleModeChange('pomodoro')}
                  >
                    Pomodoro
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: mode === 'shortBreak' ? '' : '#242424'}}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ${
                      mode === 'shortBreak' ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={() => handleModeChange('shortBreak')}
                  >
                    Short Break
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: mode === 'longBreak' ? '' : '#242424'}}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ${
                      mode === 'longBreak' ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={() => handleModeChange('longBreak')}
                  >
                    Long Break
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-white text-xl p-2 rounded-full hover:bg-white/10 transition-all duration-300"
                  onClick={() => {
                    setTempSettings(settings);
                    setShowSettings(true);
                  }}
                >
                  <FaCog />
                </motion.button>
              </div>

              <div className="text-center mb-12">
                <h1 className="text-8xl font-bold tracking-tighter">{formatTime(time)}</h1>
                <p className="text-gray-400 mt-2">Session {pomodoroCount} of {settings.pomodorosUntilLongBreak}</p>
              </div>

              <div className="flex justify-center items-center gap-8">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: -15 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-white text-2xl p-3 rounded-full hover:bg-white/10 transition-all duration-300"
                  onClick={handleReset}
                >
                  <FaRedo />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-black text-4xl w-24 h-24 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300"
                  onClick={isRunning ? handlePause : handleStart}
                >
                  {isRunning ? <FaPause /> : <FaPlay />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-white text-2xl p-3 rounded-full hover:bg-white/10 transition-all duration-300"
                  onClick={handleSkip}
                >
                  <FaForward />
                </motion.button>
              </div>
              {/* Existing Timer UI Content Ends Here */}

            </motion.div>
          )}
          {currentView === 'progress' && (
            <ProgressView />
          )}
        </AnimatePresence>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-[#1A1A1A] p-6 rounded-lg w-full max-w-md border border-white/10"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <SettingInput label="Pomodoro" value={tempSettings?.pomodoro} onChange={val => setTempSettings({...tempSettings, pomodoro: val})} />
                <SettingInput label="Short Break" value={tempSettings?.shortBreak} onChange={val => setTempSettings({...tempSettings, shortBreak: val})} />
                <SettingInput label="Long Break" value={tempSettings?.longBreak} onChange={val => setTempSettings({...tempSettings, longBreak: val})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <SettingInput label="Coins/Pomodoro" value={tempSettings?.coinsPerPomodoro} onChange={val => setTempSettings({...tempSettings, coinsPerPomodoro: val})} />
                <SettingInput label="Sessions/Long Break" value={tempSettings?.pomodorosUntilLongBreak} onChange={val => setTempSettings({...tempSettings, pomodorosUntilLongBreak: val})} />
              </div>
              <div className="flex justify-between items-center bg-[#242424] p-3 rounded-md">
                <label className="text-sm text-gray-300">Auto-start Pomodoros</label>
                <ToggleSwitch checked={tempSettings?.autoStartPomodoros} onChange={val => setTempSettings({...tempSettings, autoStartPomodoros: val})} />
              </div>
              <div className="flex justify-between items-center bg-[#242424] p-3 rounded-md">
                <label className="text-sm text-gray-300">Auto-start Breaks</label>
                <ToggleSwitch checked={tempSettings?.autoStartBreaks} onChange={val => setTempSettings({...tempSettings, autoStartBreaks: val})} />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-md font-bold border border-white/20 hover:bg-white/10 transition-all duration-300"
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white text-black rounded-md font-bold border border-transparent hover:bg-gray-200 transition-all duration-300"
                onClick={handleSettingsSave}
              >
                Save
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}


export default Pomodoro
