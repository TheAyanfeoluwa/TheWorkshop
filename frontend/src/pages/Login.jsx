// frontend/src/pages/Login.jsx - CORRECTED VERSION

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
// Import useAuth hook from your AuthContext
import { useAuth } from '../context/AuthContext'; // <--- ADD THIS IMPORT

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Get the login function from your AuthContext
  const { login } = useAuth(); // <--- GET THE LOGIN FUNCTION HERE

  const handleSubmit = async (e) => {
    console.log('handleSubmit called!');
    e.preventDefault();

    setError('');
    setSuccess('');

    try {
      // Make the API call to your backend
      const response = await axios.post('http://127.0.0.1:8001/api/v1/auth/login', { // Ensure this endpoint is correct
        email,
        password,
      });

      if (response.data.access_token) {
        // Instead of manually setting localStorage and navigating,
        // call the login function from AuthContext.
        // This function will handle setting accessToken in state, localStorage,
        // displaying the toast, and navigating to /dashboard.
        await login(response.data.access_token); // <--- CALL AUTHCONTEXT'S LOGIN FUNCTION

        // The success message and navigation are now handled by AuthContext's login function
        // setSuccess('Login successful! Redirecting...'); // This line is now redundant
        // localStorage.setItem('accessToken', response.data.access_token); // This is now handled by AuthContext
        // localStorage.setItem('userEmail', email); // This is now handled by AuthContext (if it manages userEmail)
        // navigate('/dashboard'); // This is now handled by AuthContext
      } else {
          // Handle cases where token is missing from response.data (unlikely with 200 OK)
          setError('Login response missing access token.');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data.detail || 'Login failed. Please check your credentials.');
        } else if (err.request) {
          setError('No response from server. Please try again later.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } else {
        setError('An unknown error occurred.');
      }
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-[#1A1A1A] p-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-6">Welcome Back</h1>
          
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 bg-[#242424] rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full p-3 bg-[#242424] rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-white text-black border border-transparent rounded-md font-bold hover:bg-gray-200 transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="mt-4 text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-white hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;