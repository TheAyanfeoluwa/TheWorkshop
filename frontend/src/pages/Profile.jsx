import React, { useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaUser, FaEnvelope, FaCalendar, FaTrash, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { username } = useAuth();
  const email = useMemo(() => {
    return localStorage.getItem('userEmail') || 'user@example.com';
  }, []);
  const user = {
    username: username || 'User',
    email,
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-24">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold">Profile & Settings</h1>
          <p className="text-gray-400 mt-2">Manage your account details and preferences.</p>
        </header>

        <div className="max-w-2xl mx-auto bg-[#1A1A1A] p-8 rounded-lg shadow-lg mb-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
              <FaUser className="text-3xl text-white/80" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-[#1A1A1A] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <FaUser className="text-gray-400 text-xl" />
              <div>
                <p className="text-sm text-gray-400">Username</p>
                <p className="text-lg">{user.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-gray-400 text-xl" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-lg">{user.email}</p>
              </div>
            </div>
          </div>
          <button className="mt-8 w-full py-3 bg-white text-black rounded-md font-bold hover:bg-gray-200 transition-colors">
            Edit Profile
          </button>
        </div>

        <div className="max-w-2xl mx-auto bg-[#1A1A1A] p-8 rounded-lg shadow-lg mt-8">
          <h2 className="text-2xl font-bold mb-6">Account Actions</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-center gap-3 py-3 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 transition-colors">
              <FaGoogle />
              <span>Sync with Google</span>
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-3 bg-red-600 text-white rounded-md font-bold hover:bg-red-700 transition-colors mt-4">
              <FaTrash />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
