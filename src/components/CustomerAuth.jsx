import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCustomer } from '../context/CustomerContext';
import { generateAndStoreOTP, verifyOTP } from '../utils/emailOTP';
import { showToast } from './Toast';

const CustomerAuth = ({ isOpen, onClose, isLogin = false }) => {
  if (!isOpen) return null;
  const { loginWithEmail } = useCustomer();
  const [step, setStep] = useState('email');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    whatsappOptIn: true,
  });
  const [enteredOtp, setEnteredOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email) {
      setError('Please enter your name and email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await generateAndStoreOTP(formData.email);
      setStep('otp');
      setSuccess('OTP sent to your email! Please check your inbox.');
      showToast('OTP sent to your email!', 'success');
    } catch (error) {
      const errorMessage = error.message || 'Failed to send OTP. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('OTP send error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!enteredOtp) {
      setError('Please enter the OTP you received');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOTP(formData.email, enteredOtp);
      
      if (result.valid) {
        loginWithEmail({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          whatsappOptIn: formData.whatsappOptIn,
        });

        setSuccess('Login successful! Welcome to SNACK BOX 🎉');
        showToast('Login successful! Welcome! 🎉', 'success');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(result.message);
        showToast(result.message, 'error');
      }
    } catch (error) {
      setError(error.message || 'Failed to verify OTP. Please try again.');
      showToast(error.message || 'Failed to verify OTP', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await generateAndStoreOTP(formData.email);
      setEnteredOtp('');
      setSuccess('New OTP sent to your email!');
      showToast('New OTP sent!', 'success');
    } catch (error) {
      const errorMessage = error.message || 'Failed to resend OTP. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('OTP resend error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="cart-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="cart-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '500px' }}
      >
        <div className="cart-header">
          <h2>{step === 'email' ? 'Login with Email' : 'Verify OTP'}</h2>
          <button className="close-cart" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: '2rem' }}>
          {error && (
            <motion.div
              className="login-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              style={{
                background: '#d4edda',
                color: '#155724',
                padding: '1rem',
                borderRadius: '10px',
                marginBottom: '1rem',
                textAlign: 'center',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {success}
            </motion.div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter your delivery address"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.whatsappOptIn}
                    onChange={(e) => setFormData({ ...formData, whatsappOptIn: e.target.checked })}
                  />
                  {' '}Receive WhatsApp updates for daily specials and new arrivals
                </label>
              </div>

              <motion.button
                type="submit"
                className="form-btn submit-btn"
                style={{ width: '100%', marginTop: '1rem' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit}>
              <div className="form-group">
                <label>Enter OTP *</label>
                <input
                  type="text"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                  autoFocus
                  style={{ fontSize: '1.5rem', letterSpacing: '0.5rem', textAlign: 'center' }}
                />
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem', textAlign: 'center' }}>
                  Check your email for the OTP code
                </p>
              </div>

              <motion.button
                type="submit"
                className="form-btn submit-btn"
                style={{ width: '100%', marginTop: '1rem' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </motion.button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#AD703C',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '0.9rem',
                  }}
                >
                  {isLoading ? 'Sending...' : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomerAuth;
