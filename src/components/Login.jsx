import { useState } from 'react';
import { motion } from 'framer-motion';
import { storage } from '../utils/storage';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Default admin password (in production, this should be hashed and stored securely)
  const ADMIN_PASSWORD = 'admin123'; // Change this to your desired password

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password === ADMIN_PASSWORD) {
      storage.setAdminAuth(true);
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="login-page">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-header"
      >
        <h1>SNACK BOX</h1>
        <p>Admin Login</p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        {error && (
          <motion.div
            className="login-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            required
            autoFocus
          />
        </div>

        <motion.button
          type="submit"
          className="form-btn submit-btn"
          style={{ width: '100%' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>
      </form>

      <p style={{ 
        marginTop: '1rem', 
        textAlign: 'center', 
        fontSize: '0.85rem', 
        color: '#666' 
      }}>
        Default password: admin123
      </p>
    </div>
  );
};

export default Login;

