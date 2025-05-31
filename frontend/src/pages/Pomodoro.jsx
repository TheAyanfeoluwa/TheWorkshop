// frontend/src/pages/Pomodoro.jsx
import { useState, useEffect, useRef } from 'react'; // ADD useRef for interval management
import { FaPlay, FaForward, FaRedo, FaCog } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Pomodoro = () => {
  const [time, setTime] = useState(30 * 60); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('pomodoro'); // 'pomodoro', 'shortBreak', 'longBreak'
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    pomodoro: 25, // Changed default to 25 to match common pomodoro settings
    shortBreak: 5,
    longBreak: 15
  });

  // useRef to hold the interval ID, ensuring it persists across renders
  // and can be cleared effectively
  const intervalRef = useRef(null);

  useEffect(() => {
    // Clear any existing interval to prevent multiple timers running
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      // Timer has reached 0, so stop it
      setIsRunning(false);
      clearInterval(intervalRef.current); // Ensure interval is cleared

      // ---- ADDED LOGIC FOR AUTO-SWITCHING MODES AND ALERTS ----
      if (mode === 'pomodoro') {
        alert("Pomodoro session finished! Time for a short break.");
        handleModeChange('shortBreak', true); // Pass true to auto-start break
      } else if (mode === 'shortBreak') {
        alert("Short break finished! Time to focus again.");
        handleModeChange('pomodoro', true); // Pass true to auto-start work
      } else if (mode === 'longBreak') {
        alert("Long break finished! Time to focus again.");
        handleModeChange('pomodoro', true); // Pass true to auto-start work
      }
      // --------------------------------------------------------
    }

    // Cleanup function: clear interval when component unmounts or dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time, mode]); // Added 'mode' to dependencies for auto-switch logic

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Modified handleModeChange to optionally auto-start the next timer
  const handleModeChange = (newMode, autoStart = false) => {
    setMode(newMode);
    setIsRunning(autoStart); // Set running based on autoStart parameter
    
    // Clear any existing interval when changing mode
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null; // Ensure it's null after clearing
    }

    // Set time based on settings for the new mode
    switch (newMode) {
      case 'pomodoro':
        setTime(settings.pomodoro * 60);
        break;
      case 'shortBreak':
        setTime(settings.shortBreak * 60);
        break;
      case 'longBreak':
        setTime(settings.longBreak * 60);
        break;
      default:
        setTime(settings.pomodoro * 60); // Fallback
    }
  };

  const handleStartPause = () => { // Combined Start/Pause into one handler
    setIsRunning(prev => !prev);
  };

  const handleSkip = () => {
    // Determine the next mode based on the current mode
    let nextMode;
    if (mode === 'pomodoro') {
      nextMode = 'shortBreak'; // After pomodoro, typically short break
    } else {
      nextMode = 'pomodoro'; // After any break, go back to pomodoro
    }
    // Call handleModeChange with the next mode, and auto-start it
    handleModeChange(nextMode, true); 
  };

  const handleReset = () => {
    setIsRunning(false); // Stop the timer
    handleModeChange(mode); // Reset to the current mode's initial time
  };

  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings);
    setShowSettings(false);
    // After saving, reset the current mode's timer with new settings
    handleModeChange(mode); 
  };

  // Determine the primary button text and action
  const primaryButtonText = isRunning ? 'Pause' : 'Start';
  const primaryButtonIcon = isRunning ? null : <FaPlay />; // No specific pause icon in original, but could add FaPause
  const primaryButtonClass = isRunning ? "bg-red-600 hover:bg-red-700" : "bg-white text-black hover:bg-gray-200";

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />

      <div className="container mx-auto px-4 py-32">
        <div className="max-w-2xl mx-auto bg-[#1A1A1A] p-12 rounded-lg">
          <div className="flex justify-between items-center mb-12">
            <div className="flex gap-4">
              <button
                className={`px-4 py-2 rounded-md ${
                  mode === 'pomodoro' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => handleModeChange('pomodoro')}
              >
                Pomodoro
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  mode === 'shortBreak' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => handleModeChange('shortBreak')}
              >
                Short Break
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  mode === 'longBreak' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => handleModeChange('longBreak')}
              >
                Long Break
              </button>
            </div>

            <button
              className="text-gray-400 hover:text-white text-xl"
              onClick={() => setShowSettings(true)}
            >
              <FaCog />
            </button>
          </div>

          {/* Timer */}
          <div className="text-center mb-12">
            <h1 className="text-8xl font-bold mb-6">{formatTime(time)}</h1>
            <p className="text-xl text-gray-400">
              {mode === 'pomodoro' ? 'Time to focus!' : 'Time for a break!'}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-bold ${primaryButtonClass}`}
              onClick={handleStartPause} // Use combined handler
              // disabled={isRunning} // Removed as button toggles start/pause
            >
              {primaryButtonIcon}
              <span>{primaryButtonText}</span>
            </button>
            <button
              className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-md font-bold hover:bg-white/5"
              onClick={handleSkip}
            >
              <FaForward />
              <span>Skip</span>
            </button>
            <button
              className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-md font-bold hover:bg-white/5"
              onClick={handleReset}
            >
              <FaRedo />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            className="bg-[#1A1A1A] p-6 rounded-lg w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-2xl font-bold mb-6">Timer Settings</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Pomodoro (minutes)
                </label>
                <input
                  type="number"
                  value={settings.pomodoro}
                  onChange={(e) => setSettings({ ...settings, pomodoro: parseInt(e.target.value) })}
                  className="w-full p-2 bg-[#242424] rounded-md"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  value={settings.shortBreak}
                  onChange={(e) => setSettings({ ...settings, shortBreak: parseInt(e.target.value) })}
                  className="w-full p-2 bg-[#242424] rounded-md"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  value={settings.longBreak}
                  onChange={(e) => setSettings({ ...settings, longBreak: parseInt(e.target.value) })}
                  className="w-full p-2 bg-[#242424] rounded-md"
                  min="1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-gray-400 hover:text-white"
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-white text-black rounded-md font-bold hover:bg-gray-200"
                onClick={() => handleSettingsSave(settings)}
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Pomodoro;