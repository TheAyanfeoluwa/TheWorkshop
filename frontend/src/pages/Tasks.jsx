import { useState } from 'react'
import { FaPlus, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  })

  const handleCreateTask = (e) => {
    e.preventDefault()
    const task = {
      ...newTask,
      id: Date.now(),
      completed: false,
      createdAt: new Date().toISOString()
    }
    setTasks([...tasks, task])
    setShowModal(false)
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    })
  }

  const handleTaskComplete = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (!task.completed) {
          toast.success('🎉 Congratulations! Task completed!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
        }
        return { ...task, completed: !task.completed }
      }
      return task
    }))
  }

  const pendingTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />
      <ToastContainer theme="dark" />

      <div className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">My Tasks</h1>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md font-bold hover:bg-gray-200"
            >
              <FaPlus />
              <span>Add Task</span>
            </button>
          </div>
          <div className="space-y-8">

            <div>
              <h2 className="text-xl font-semibold mb-4">Pending Tasks</h2>
              <div className="space-y-4">
                {pendingTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={handleTaskComplete}
                  />
                ))}
                {pendingTasks.length === 0 && (
                  <p className="text-gray-400">No pending tasks</p>
                )}
              </div>
            </div>

            {/* Completed Tasks */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Completed Tasks</h2>
              <div className="space-y-4">
                {completedTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={handleTaskComplete}
                  />
                ))}
                {completedTasks.length === 0 && (
                  <p className="text-gray-400">No completed tasks</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
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
                <h2 className="text-2xl font-bold">Create New Task</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full p-3 bg-[#242424] rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full p-3 bg-[#242424] rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 min-h-[100px]"
                    placeholder="Enter task description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full p-3 bg-[#242424] rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Due Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="w-full p-3 bg-[#242424] rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                      <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
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

const TaskCard = ({ task, onComplete }) => {
  const priorityColors = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  }

  return (
    <motion.div
      className={`bg-[#1A1A1A] p-4 rounded-lg ${task.completed ? 'opacity-75' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onComplete(task.id)}
          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            task.completed
              ? 'bg-white border-white'
              : 'border-gray-400 hover:border-white'
          }`}
        >
          {task.completed && <FaCheck className="text-black text-xs" />}
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </h3>
            <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-400 mb-2">{task.description}</p>
          )}
          
          {task.dueDate && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FaCalendarAlt />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Tasks
