import { useState, useEffect } from 'react';
import { getProgressData } from '../services/progressService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaCalendarAlt, FaCheckCircle, FaCoins, FaGift, FaFire, FaClock, FaCoffee } from 'react-icons/fa';
import ActivityHistory from '../components/ActivityHistory';

const Progress = () => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const data = getProgressData();
    setProgress(data);
  }, []);

  if (!progress) {
    return <div>Loading...</div>;
  }

  const today = new Date().toISOString().split('T')[0];
  const todayStats = progress.history[today] || { pomodoros: 0, focusTime: 0, tasksCompleted: 0, breakTime: 0 };

  const redeemedRewards = progress.rewards.filter(r => r.redeemed);

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Progress</h1>

          <div className="bg-[#1A1A1A] p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Today's Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#242424] p-4 rounded-lg flex flex-col items-center justify-center transition-transform hover:scale-105">
                <FaFire className="text-3xl text-red-500 mb-2" />
                <span className="text-2xl font-bold">{todayStats.pomodoros}</span>
                <span className="text-sm text-gray-400">Pomodoros</span>
              </div>
              <div className="bg-[#242424] p-4 rounded-lg flex flex-col items-center justify-center transition-transform hover:scale-105">
                <FaClock className="text-3xl text-blue-500 mb-2" />
                <span className="text-2xl font-bold">{todayStats.focusTime}</span>
                <span className="text-sm text-gray-400">Focus Mins</span>
              </div>
              <div className="bg-[#242424] p-4 rounded-lg flex flex-col items-center justify-center transition-transform hover:scale-105">
                <FaCoffee className="text-3xl text-green-500 mb-2" />
                <span className="text-2xl font-bold">{todayStats.breakTime}</span>
                <span className="text-sm text-gray-400">Break Mins</span>
              </div>
              <div className="bg-[#242424] p-4 rounded-lg flex flex-col items-center justify-center transition-transform hover:scale-105">
                <FaCheckCircle className="text-3xl text-purple-500 mb-2" />
                <span className="text-2xl font-bold">{todayStats.tasksCompleted}</span>
                <span className="text-sm text-gray-400">Tasks Done</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1A1A1A] p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Lifetime Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-lg"><FaCoins /> Total Coins</span>
                  <span className="font-bold text-2xl text-yellow-400">{progress.coins}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-lg"><FaCheckCircle /> Total Tasks</span>
                  <span className="font-bold text-2xl">{progress.tasks.filter(t => t.completed).length}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] p-6 rounded-lg md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Redeemed Rewards</h2>
              {redeemedRewards.length > 0 ? (
                <div className="space-y-4">
                  {redeemedRewards.map(reward => (
                    <div key={reward.id} className="flex items-center justify-between p-3 bg-[#242424] rounded-md">
                      <div className="flex items-center gap-3">
                        <FaGift className="text-xl" />
                        <div>
                          <p className="font-semibold">{reward.name}</p>
                          <p className="text-sm text-gray-400">Redeemed on {new Date(reward.redeemedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="font-bold text-yellow-500">-{reward.cost} coins</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No rewards redeemed yet.</p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <ActivityHistory history={progress.history} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Progress;
