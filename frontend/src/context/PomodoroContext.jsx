import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getProgressData, saveProgressData, logPomodoro, logBreak, getTimerState, saveTimerState, clearTimerState } from '../services/progressService';
import { toast } from 'react-toastify';

const PomodoroContext = createContext();

export const usePomodoro = () => useContext(PomodoroContext);

export const PomodoroProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      pomodoro: 30,
      shortBreak: 5,
      longBreak: 15,
      coinsPerPomodoro: 10,
      pomodorosUntilLongBreak: 4,
      autoStartPomodoros: false,
      autoStartBreaks: false,
      themeColor: 'default',
    };
  });

  const [time, setTime] = useState(settings.pomodoro * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('pomodoro');
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const handleCompletion = useCallback((isSkip = false) => {
    if (!isSkip) {
      if (mode === 'pomodoro') {
        logPomodoro(settings.pomodoro, settings.coinsPerPomodoro);
        toast.success(`🎉 Well done! You've earned ${settings.coinsPerPomodoro} coins!`);
      } else if (mode === 'shortBreak') {
        logBreak(settings.shortBreak);
        toast.info('Break finished. Time for the next session!');
      } else if (mode === 'longBreak') {
        logBreak(settings.longBreak);
        toast.info('Long break finished. Ready to focus?');
      }
    }

    setIsRunning(false);
    clearTimerState();

    let nextMode = 'pomodoro';
    let newPomodoroCount = pomodoroCount;

    if (mode === 'pomodoro') {
      if (!isSkip) {
        newPomodoroCount++;
        setPomodoroCount(newPomodoroCount);
      }
      nextMode = newPomodoroCount % settings.pomodorosUntilLongBreak === 0 ? 'longBreak' : 'shortBreak';
    } else {
      if (mode === 'longBreak') {
        setPomodoroCount(0);
        newPomodoroCount = 0;
      }
      nextMode = 'pomodoro';
    }

    setMode(nextMode);
    let newTime;
    switch (nextMode) {
      case 'pomodoro': newTime = settings.pomodoro * 60; break;
      case 'shortBreak': newTime = settings.shortBreak * 60; break;
      case 'longBreak': newTime = settings.longBreak * 60; break;
      default: newTime = settings.pomodoro * 60;
    }
    setTime(newTime);

    const shouldAutoStart = (nextMode === 'pomodoro' && settings.autoStartPomodoros) ||
                            ((nextMode === 'shortBreak' || nextMode === 'longBreak') && settings.autoStartBreaks);

    if (shouldAutoStart) {
      setIsRunning(true);
      saveTimerState({ endTime: Date.now() + newTime * 1000, mode: nextMode, pomodoroCount: newPomodoroCount });
    }
  }, [mode, pomodoroCount, settings]);

  useEffect(() => {
    const savedState = getTimerState();
    if (savedState) {
      setMode(savedState.mode);
      setPomodoroCount(savedState.pomodoroCount);

      if (savedState.endTime) {
        const remainingSeconds = Math.round((savedState.endTime - Date.now()) / 1000);
        if (remainingSeconds > 0) {
          setTime(remainingSeconds);
          setIsRunning(true);
        } else {
          handleCompletion();
        }
      } else if (savedState.remainingTime) {
        setTime(savedState.remainingTime);
        setIsRunning(false);
      }
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRunning && time > 0) {
      interval = setInterval(() => setTime(t => t - 1), 1000);
    } else if (isRunning && time <= 0) {
      handleCompletion();
    }
    return () => clearInterval(interval);
  }, [isRunning, time, handleCompletion]);

  const handleStart = () => {
    setIsRunning(true);
    saveTimerState({ endTime: Date.now() + time * 1000, mode, pomodoroCount });
  };

  const handlePause = () => {
    setIsRunning(false);
    saveTimerState({ remainingTime: time, mode, pomodoroCount });
  };

  const handleReset = () => {
    setIsRunning(false);
    clearTimerState();
    let newTime;
    switch (mode) {
      case 'pomodoro': newTime = settings.pomodoro * 60; break;
      case 'shortBreak': newTime = settings.shortBreak * 60; break;
      case 'longBreak': newTime = settings.longBreak * 60; break;
      default: newTime = settings.pomodoro * 60;
    }
    setTime(newTime);
  };

  const handleModeChange = (newMode) => {
    if (mode === newMode) return;
    setIsRunning(false);
    clearTimerState();
    setMode(newMode);
    let newTime;
    switch (newMode) {
      case 'pomodoro': newTime = settings.pomodoro * 60; break;
      case 'shortBreak': newTime = settings.shortBreak * 60; break;
      case 'longBreak': newTime = settings.longBreak * 60; break;
      default: newTime = settings.pomodoro * 60;
    }
    setTime(newTime);
  };

  const value = {
    time, mode, isRunning, settings, setSettings, pomodoroCount,
    handleStart, handlePause, handleReset, handleModeChange,
    handleSkip: () => handleCompletion(true),
  };

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
};
