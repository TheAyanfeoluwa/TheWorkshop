// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Import ToastContainer and its CSS for notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import all your pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Pomodoro from './pages/Pomodoro';
import Tasks from './pages/Tasks';
import Store from './pages/Store';
import Login from './pages/Login';
import Register from './pages/Register';
import ComingSoon from './pages/ComingSoon';
import Feedback from './pages/Feedback';

// Import your PrivateRoute and AuthProvider
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext'; // <--- IMPORTANT: Ensure this path is correct

import './App.css'; // Ensure this is still imported

function App() {
  return (
    <Router>
      {/* Wrap your entire application (or at least your Routes) with AuthProvider */}
      <AuthProvider>
        <div className="min-h-screen bg-[#121212] text-white">
          <Routes>
            <Route path="/" element={<Landing />} />

            {/* Public Routes - Accessible without login */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/store" element={<Store />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/feedback" element={<Feedback />} />

            {/* Protected Routes - Require Authentication via PrivateRoute */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/pomodoro"
              element={
                <PrivateRoute>
                  <Pomodoro />
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks" // <--- THIS ROUTE IS NOW PROTECTED
              element={
                <PrivateRoute>
                  <Tasks />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider> {/* Close AuthProvider */}
      {/* ToastContainer for notifications - typically placed outside AuthProvider but within Router */}
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </Router>
  );
}

export default App;