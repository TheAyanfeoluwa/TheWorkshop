// frontend/src/pages/Tasks.jsx
import React, { useState, useEffect } from 'react'; // ADD useEffect
import { FaPlus, FaCalendarAlt, FaCheck, FaTimes, FaTrashAlt, FaSpinner } from 'react-icons/fa'; // ADD FaTrashAlt, FaSpinner
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });
  const [loading, setLoading] = useState(true); // ADD: Loading state
  const [error, setError] = useState(null);     // ADD: Error state

  // --- Helper function to fetch tasks ---
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8001/api/v1/tasks/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err.message);
      toast.error(`Error: ${err.message}`, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  // --- useEffect to fetch tasks on component mount ---
  useEffect(() => {
    fetchTasks();
  }, []); // Empty dependency array means this runs once on mount

  // --- Modified handleCreateTask to interact with backend ---
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('accessToken');

    const taskData = {
      title: newTask.title,
      description: newTask.description || null, // Ensure empty string is null
      priority: newTask.priority,
      // Format dueDate to ISO string if provided, else null
      due_date: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null,
      completed: false, // Always false on creation
    };

    try {
      const response = await fetch('http://localhost:8001/api/v1/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create task');
      }

      toast.success('Task created successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setShowModal(false);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: ''
      });
      fetchTasks(); // Re-fetch tasks to update the list
    } catch (err) {
      console.error("Error creating task:", err);
      setError(err.message);
      toast.error(`Error creating task: ${err.message}`, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  // --- Modified handleTaskComplete to interact with backend (PUT) ---
  const handleTaskComplete = async (taskId, currentCompletedStatus) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://localhost:8001/api/v1/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !currentCompletedStatus }) // Toggle status
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update task');
      }

      if (!currentCompletedStatus) { // If task was pending and now completed
        toast.success('🎉 Congratulations! Task completed!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.info('Task marked as pending.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      fetchTasks(); // Re-fetch tasks to update the list
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err.message);
      toast.error(`Error updating task: ${err.message}`, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  // --- ADDED: handleDeleteTask to interact with backend (DELETE) ---
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setLoading(true);
    setError(null);
    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://localhost:8001/api/v1/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete task');
      }

      toast.success('Task deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchTasks(); // Re-fetch tasks to update the list
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(err.message);
      toast.error(`Error deleting task: ${err.message}`, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

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

          {/* Loading, Error, No Tasks States */}
          {loading && (
            <div className="text-center text-gray-400 text-lg flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" /> Loading tasks...
            </div>
          )}
          {error && !loading && (
            <div className="text-center text-red-500 text-lg">
              Error: {error}. Please try again later or ensure you are logged in.
            </div>
          )}
          {!loading && !error && tasks.length === 0 && (
             <p className="text-center text-gray-400 text-lg">No tasks found. Click "Add Task" to create your first one!</p>
          )}


          {/* Task Lists (only show if not loading and no major error) */}
          {!loading && !error && tasks.length > 0 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Pending Tasks</h2>
                <div className="space-y-4">
                  {pendingTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={handleTaskComplete}
                      onDelete={handleDeleteTask} // PASS: handleDeleteTask prop
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
                      onDelete={handleDeleteTask} // PASS: handleDeleteTask prop
                    />
                  ))}
                  {completedTasks.length === 0 && (
                    <p className="text-gray-400">No completed tasks</p>
                  )}
                </div>
              </div>
            </div>
          )}
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
  );
};

// --- TaskCard Component (Modified to include Delete Button) ---
const TaskCard = ({ task, onComplete, onDelete }) => { // ADD onDelete prop
  const priorityColors = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  };

  return (
    <motion.div
      className={`bg-[#1A1A1A] p-4 rounded-lg flex items-start justify-between gap-4 ${task.completed ? 'opacity-75' : ''}`} // Added flex properties
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-4 flex-grow"> {/* Added flex-grow */}
        <button
          onClick={() => onComplete(task.id, task.completed)} // Pass current completed status
          className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${ // Added flex-shrink-0
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

          {task.due_date && ( // Changed to task.due_date from task.dueDate to match backend model
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FaCalendarAlt />
              {/* Format date only if due_date exists and is valid */}
              <span>{new Date(task.due_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* ADDED: Delete Button */}
      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
        title="Delete Task"
      >
        <FaTrashAlt />
      </button>
    </motion.div>
  );
};

export default Tasks;