const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

const getInitialData = () => ({
  coins: 100,
  history: {},
  rewards: [],
  tasks: [],
});

export const getProgressData = () => {
  try {
    const data = localStorage.getItem('progressData');
    if (!data) {
      const initialData = getInitialData();
      saveProgressData(initialData);
      return initialData;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse progress data:", error);
    const initialData = getInitialData();
    saveProgressData(initialData);
    return initialData;
  }
};

export const saveProgressData = (data) => {
  localStorage.setItem('progressData', JSON.stringify(data));
};

export const logPomodoro = (minutes, coinsEarned = 10) => {
  const data = getProgressData();
  const today = getToday();

  if (!data.history[today]) {
    data.history[today] = { pomodoros: 0, focusTime: 0, tasksCompleted: 0, breakTime: 0 };
  } else if (data.history[today].breakTime === undefined) {
    data.history[today].breakTime = 0;
  }

  data.history[today].pomodoros += 1;
  data.history[today].focusTime += minutes;
  data.coins += coinsEarned;

  saveProgressData(data);
  return data;
};

export const logBreak = (minutes) => {
  const data = getProgressData();
  const today = getToday();

  if (!data.history[today]) {
    data.history[today] = { pomodoros: 0, focusTime: 0, tasksCompleted: 0, breakTime: 0 };
  } else if (data.history[today].breakTime === undefined) {
    data.history[today].breakTime = 0;
  }

  data.history[today].breakTime += minutes;

  saveProgressData(data);
  return data;
};

export const logTaskCompletion = (task) => {
  const data = getProgressData();
  const today = getToday();

  if (!data.history[today]) {
    data.history[today] = { pomodoros: 0, focusTime: 0, tasksCompleted: 0, breakTime: 0 };
  } else if (data.history[today].breakTime === undefined) {
    data.history[today].breakTime = 0;
  }

  data.history[today].tasksCompleted += 1;
  data.coins += 5;

  // mark task as completed
  const updatedTasks = data.tasks.map(t => t.id === task.id ? { ...t, completed: true } : t);
  data.tasks = updatedTasks;

  saveProgressData(data);
  return data;
};

export const createTask = (task) => {
  const data = getProgressData();
  if (!data.tasks) {
    data.tasks = [];
  }
  data.tasks.push(task);
  saveProgressData(data);
  return data;
};

export const spendCoins = (amount) => {
  const data = getProgressData();
  if (data.coins >= amount) {
    data.coins -= amount;
    saveProgressData(data);
  }
  return data;
};

export const createReward = (reward) => {
  const data = getProgressData();
  data.rewards.push(reward);
  saveProgressData(data);
  return data;
};

export const redeemReward = (reward) => {
  const data = getProgressData();
  if (data.coins >= reward.cost) {
    data.coins -= reward.cost;
    const updatedRewards = data.rewards.map(r => 
      r.id === reward.id ? { ...r, redeemed: true, redeemedAt: new Date().toISOString() } : r
    );
    data.rewards = updatedRewards;
    saveProgressData(data);
  }
  return data;
};

export const saveTimerState = (state) => {
  localStorage.setItem('timerState', JSON.stringify(state));
};

export const getTimerState = () => {
  const savedState = localStorage.getItem('timerState');
  return savedState ? JSON.parse(savedState) : null;
};

export const clearTimerState = () => {
  localStorage.removeItem('timerState');
};
