import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaUser, FaEnvelope, FaCalendar, FaTrash, FaGoogle } from 'react-icons/fa';

const Profile = () => {
  // placeholder 
  const user = {
    username: 'User',
    email: 'user@example.com',
    dob: '1990-01-01',
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-24">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold">Profile & Settings</h1>
          <p className="text-gray-400 mt-2">Manage your account details and preferences.</p>
        </header>

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
            <div className="flex items-center gap-4">
              <FaCalendar className="text-gray-400 text-xl" />
              <div>
                <p className="text-sm text-gray-400">Date of Birth</p>
                <p className="text-lg">{user.dob}</p>
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
