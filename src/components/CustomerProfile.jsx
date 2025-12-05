import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCustomer } from '../context/CustomerContext';

const CustomerProfile = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { customer, updateCustomer, logout } = useCustomer();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
  });
  const [success, setSuccess] = useState('');

  const handleSave = () => {
    updateCustomer(formData);
    setIsEditing(false);
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleLogout = () => {
    logout();
    onClose();
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
        style={{ maxWidth: '600px' }}
      >
        <div className="cart-header">
          <h2>My Profile</h2>
          <button className="close-cart" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: '2rem' }}>
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

          {!isEditing ? (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#AD703C', marginBottom: '0.5rem' }}>Personal Information</h3>
                <p><strong>Name:</strong> {customer?.name}</p>
                <p><strong>Email:</strong> {customer?.email}</p>
                <p><strong>Phone:</strong> {customer?.phone}</p>
                <p><strong>Address:</strong> {customer?.address || 'Not provided'}</p>
              </div>

              {customer?.offersReceived && customer.offersReceived.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#AD703C', marginBottom: '0.5rem' }}>Offers Received</h3>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {customer.offersReceived.map((offer, index) => (
                      <div
                        key={index}
                        style={{
                          background: '#f5f5f5',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{offer.title}</p>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>{offer.message}</p>
                        <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.25rem' }}>
                          {new Date(offer.receivedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <motion.button
                  className="form-btn submit-btn"
                  onClick={() => setIsEditing(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Edit Profile
                </motion.button>
                <motion.button
                  className="form-btn cancel-btn"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </div>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="3"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <motion.button
                  className="form-btn submit-btn"
                  onClick={handleSave}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save Changes
                </motion.button>
                <motion.button
                  className="form-btn cancel-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: customer?.name || '',
                      email: customer?.email || '',
                      phone: customer?.phone || '',
                      address: customer?.address || '',
                    });
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomerProfile;

