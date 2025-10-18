import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    setError(''); 
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('API_BASE_URL/api/v1/auth/register', {
        email,
        password,
      });

      if (response.status === 201) { 
        try {
          const mapRaw = localStorage.getItem('usernameEmailMap') || '{}';
          const map = JSON.parse(mapRaw);
          map[username] = email;
          localStorage.setItem('usernameEmailMap', JSON.stringify(map));
        } catch {}
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500); 
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data.detail || 'Registration failed. Please try again.');
        } else if (err.request) {
          setError('No response from server. Please try again later.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } else {
        setError('An unknown error occurred.');
      }
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-[#1A1A1A] p-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-6">Create Account</h1>
          
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full p-3 bg-[#242424] rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

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
                  placeholder="Create a password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="w-full p-3 bg-[#242424] rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-white text-black border border-transparent rounded-md font-bold hover:bg-gray-200 transition-colors"
            >
              Create Account
            </button>
          </form>

          <p className="mt-4 text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
