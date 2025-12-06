import { useState } from 'react';
import { motion } from 'framer-motion';
import { storage } from '../utils/storage';

const Login = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const credentials = storage.getAdminCredentials();
    
    if (userId === credentials.userId && password === credentials.password) {
      storage.setAdminAuth(true);
      onLogin();
    } else {
      setError('Invalid User ID or Password. Please try again.');
      setUserId('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-yellow to-primary-brown bg-clip-text text-transparent mb-2">
            SNACK BOX
          </h1>
          <p className="text-gray-600">Admin Login</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <motion.div
              className="bg-red-100 text-red-800 px-4 py-3 rounded-lg mb-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              User ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID"
              required
              autoFocus
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-yellow focus:outline-none transition-all duration-300"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-yellow focus:outline-none transition-all duration-300"
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-primary-yellow to-primary-brown text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Login
          </motion.button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          Default: User ID: <strong>admin</strong> | Password: <strong>admin123</strong>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
