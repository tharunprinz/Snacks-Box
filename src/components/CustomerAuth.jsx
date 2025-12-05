import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCustomer } from '../context/CustomerContext';

const CustomerAuth = ({ isOpen, onClose, isLogin = false }) => {
  if (!isOpen) return null;
  const { loginWithEmail } = useCustomer();
  const [step, setStep] = useState(isLogin ? 'otp' : 'email');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    whatsappOptIn: true,
  });
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (step === 'email') {
      // Basic validation
      if (!formData.name || !formData.email) {
        setError('Please enter your name and email');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Generate demo OTP (in real app, request from backend + email)
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(otp);
      setStep('otp');
      setSuccess(`OTP sent to your email. (Demo OTP: ${otp})`);
      return;
    }

    if (step === 'otp') {
      if (!enteredOtp) {
        setError('Please enter the OTP you received');
        return;
      }
      if (enteredOtp !== generatedOtp) {
        setError('Invalid OTP. Please try again.');
        return;
      }

      loginWithEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        whatsappOptIn: formData.whatsappOptIn,
      });

      setSuccess('Login successful! Welcome to SNACK BOX 🎉');
      setTimeout(() => {
        onClose();
      }, 1200);
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

          <form onSubmit={handleSubmit}>
            {step === 'email' && (
              <>
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
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number (optional)"
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Delivery address (optional)"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.whatsappOptIn}
                      onChange={(e) =>
                        setFormData({ ...formData, whatsappOptIn: e.target.checked })
                      }
                    />{' '}
                    Receive daily specials & new arrivals on WhatsApp
                  </label>
                </div>
              </>
            )}

            {step === 'otp' && (
              <>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Enter OTP *</label>
                  <input
                    type="tel"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="4-digit OTP"
                    required
                  />
                </div>
              </>
            )}

            <motion.button
              type="submit"
              className="form-btn submit-btn"
              style={{ width: '100%', marginTop: '1rem' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {step === 'email' ? 'Send OTP' : 'Verify & Login'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomerAuth;

