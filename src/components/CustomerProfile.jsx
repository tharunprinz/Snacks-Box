import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCustomer } from '../context/CustomerContext';
import { storage } from '../utils/storage';
import { format } from 'date-fns';
import LoyaltyProgram from './LoyaltyProgram';

const CustomerProfile = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { customer, updateCustomer, logout } = useCustomer();
  const [isEditing, setIsEditing] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
  });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (customer) {
      const allOrders = storage.getOrders();
      const userOrders = allOrders.filter(order => 
        order.userId === customer.id || 
        (order.userEmail && order.userEmail === customer.email) ||
        (order.userPhone && order.userPhone === customer.phone)
      );
      setMyOrders(userOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
  }, [customer, isOpen]);

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
        style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}
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
              {/* Loyalty Program */}
              <div style={{ marginBottom: '1.5rem' }}>
                <LoyaltyProgram />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#AD703C', marginBottom: '0.5rem' }}>Personal Information</h3>
                <p><strong>Name:</strong> {customer?.name}</p>
                <p><strong>Email:</strong> {customer?.email}</p>
                <p><strong>Phone:</strong> {customer?.phone}</p>
                <p><strong>Address:</strong> {customer?.address || 'Not provided'}</p>
              </div>

              {/* My Orders Section */}
              {myOrders.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#AD703C', marginBottom: '0.5rem' }}>My Orders</h3>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {myOrders.map((order) => {
                      const getStatusColor = (status) => {
                        switch (status) {
                          case 'pending': return { bg: '#fff3cd', text: '#856404', icon: '⏳' };
                          case 'accepted': return { bg: '#d1ecf1', text: '#0c5460', icon: '✅' };
                          case 'declined': return { bg: '#f8d7da', text: '#721c24', icon: '❌' };
                          case 'delivered': return { bg: '#d4edda', text: '#155724', icon: '🚚' };
                          default: return { bg: '#e2e3e5', text: '#383d41', icon: '📦' };
                        }
                      };
                      const statusStyle = getStatusColor(order.status);
                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            background: statusStyle.bg,
                            color: statusStyle.text,
                            padding: '0.75rem',
                            borderRadius: '8px',
                            marginBottom: '0.5rem',
                            border: `2px solid ${statusStyle.text}40`,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <p style={{ fontWeight: 'bold', margin: 0 }}>{statusStyle.icon} Order #{order.id}</p>
                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                              {order.status === 'pending' && 'Pending'}
                              {order.status === 'accepted' && 'Accepted'}
                              {order.status === 'declined' && 'Declined'}
                              {order.status === 'delivered' && 'Delivered'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                            {order.items.map((item, idx) => (
                              <span key={idx}>
                                {item.name} × {item.quantity}{idx < order.items.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                            <span>Total: ₹{order.total.toFixed(2)}</span>
                            <span>{format(new Date(order.date), 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

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

