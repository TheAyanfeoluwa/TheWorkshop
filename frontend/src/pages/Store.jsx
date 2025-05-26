import { useState } from 'react'
import { FaPlus, FaTimes, FaClock, FaCoins } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Store = () => {
  const [rewards, setRewards] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newReward, setNewReward] = useState({
    title: '',
    description: '',
    cost: '',
    duration: '',
    category: 'break'
  })
  const [coins, setCoins] = useState(100)

  const handleCreateReward = (e) => {
    e.preventDefault()
    const reward = {
      ...newReward,
      id: Date.now(),
      cost: parseInt(newReward.cost),
      duration: parseInt(newReward.duration),
      createdAt: new Date().toISOString()
    }
    setRewards([...rewards, reward])
    setShowModal(false)
    setNewReward({
      title: '',
      description: '',
      cost: '',
      duration: '',
      category: 'break'
    })
    toast.success(' New reward created!', {
      position: "top-right",
      autoClose: 3000
    })
  }

  const handleRedeemReward = (reward) => {
    if (coins >= reward.cost) {
      setCoins(coins - reward.cost)
      toast.success(' Reward redeemed! Enjoy your break!', {
        position: "top-right",
        autoClose: 3000
      })
    } else {
      toast.error(' Not enough coins!', {
        position: "top-right",
        autoClose: 3000
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />
      <ToastContainer theme="dark" />

      <div className="container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Reward Store</h1>
              <p className="text-gray-400 flex items-center gap-2">
                <FaCoins className="text-yellow-500" />
                <span>{coins} coins available</span>
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md font-bold hover:bg-gray-200"
            >
              <FaPlus />
              <span>Create Reward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map(reward => (
              <RewardCard
                key={reward.id}
                reward={reward}
                onRedeem={handleRedeemReward}
                canAfford={coins >= reward.cost}
              />
            ))}
            {rewards.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400">
                <p>No rewards available. Create your first reward!</p>
              </div>
            )}
          </div>
        </div>
      </div>



      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              className="bg-[#1A1A1A] p-6 rounded-lg w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create New Reward</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreateReward} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReward.title}
                    onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                    className="w-full p-3 bg-[#242424] rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Enter reward title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={newReward.description}
                    onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                    className="w-full p-3 bg-[#242424] rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 min-h-[100px]"
                    placeholder="Enter reward description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Cost (coins) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newReward.cost}
                      onChange={(e) => setNewReward({ ...newReward, cost: e.target.value })}
                      className="w-full p-3 bg-[#242424] rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newReward.duration}
                      onChange={(e) => setNewReward({ ...newReward, duration: e.target.value })}
                      className="w-full p-3 bg-[#242424] rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={newReward.category}
                    onChange={(e) => setNewReward({ ...newReward, category: e.target.value })}
                    className="w-full p-3 bg-[#242424] rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <option value="break">Break Time</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="self-care">Self Care</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-black rounded-md font-bold hover:bg-gray-200"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

const RewardCard = ({ reward, onRedeem, canAfford }) => {
  return (
    <motion.div
      className="bg-[#1A1A1A] p-6 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">{reward.title}</h3>
        {reward.description && (
          <p className="text-gray-400 text-sm mb-4">{reward.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <FaCoins className="text-yellow-500" />
            <span>{reward.cost}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaClock />
            <span>{reward.duration} min</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onRedeem(reward)}
        disabled={!canAfford}
        className={`w-full py-2 rounded-md font-semibold ${
          canAfford
            ? 'bg-white text-black hover:bg-gray-200'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {canAfford ? 'Redeem' : 'Not enough coins'}
      </button>
    </motion.div>
  )
}

export default Store
