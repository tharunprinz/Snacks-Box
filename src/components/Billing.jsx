import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useCustomer } from '../context/CustomerContext';
import { storage } from '../utils/storage';
import QRCode from './QRCode';
import PrintBill from './PrintBill';
import { format } from 'date-fns';

const Billing = ({ onBack }) => {
  const { cart, getTotal, clearCart } = useCart();
  const { customer } = useCustomer();
  const [showQR, setShowQR] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [order, setOrder] = useState(null);
  const total = getTotal();

  const handlePayNow = () => {
    setShowQR(true);
  };

  const handlePlaceOrder = () => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      userId: customer?.id || null,
      userName: customer?.name || 'Guest',
      userEmail: customer?.email || '',
      userPhone: customer?.phone || '',
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: total,
      date: new Date().toISOString(),
      status: 'pending', // Changed to pending so admin can accept/decline
    };

    storage.saveOrder(newOrder);
    
    // Award loyalty points (10 points per ₹100 spent)
    if (customer?.id) {
      const pointsEarned = Math.floor(total / 100) * 10;
      if (pointsEarned > 0) {
        storage.addLoyaltyPoints(customer.id, pointsEarned, `Order ${newOrder.id}`);
      }
    }
    
    setOrder(newOrder);
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced && order) {
    return (
      <div className="billing-page">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="billing-header"
        >
          <h1>✅ Order Placed Successfully!</h1>
          <p>Order #{order.id}</p>
          <p>{format(new Date(order.date), 'PPpp')}</p>
        </motion.div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          {order.items.map((item, index) => (
            <div key={index} className="summary-item">
              <span>{item.name} x{item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>Total:</span>
            <span>₹{order.total.toFixed(2)}</span>
          </div>
        </div>

        <PrintBill order={order} />

        <div className="billing-actions">
          <motion.button
            className="billing-action-btn back-btn"
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Menu
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="billing-header"
      >
        <h1>Checkout</h1>
        <p>Review your order and proceed to payment</p>
      </motion.div>

      <div className="order-summary">
        <h2>Order Summary</h2>
        {cart.map((item) => (
          <div key={item.id} className="summary-item">
            <span>{item.name} x{item.quantity}</span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-total">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="payment-section">
        <motion.button
          className="paynow-btn"
          onClick={handlePayNow}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          💳 Pay Now
        </motion.button>
        <p style={{ marginTop: '1rem', color: '#666' }}>
          After payment, click below to confirm your order
        </p>
        <motion.button
          className="billing-action-btn print-btn"
          onClick={handlePlaceOrder}
          style={{ marginTop: '1rem' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ✅ Confirm Order
        </motion.button>
      </div>

      <div className="billing-actions">
        <motion.button
          className="billing-action-btn back-btn"
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Cart
        </motion.button>
      </div>

      <QRCode amount={total} isOpen={showQR} onClose={() => setShowQR(false)} />
    </div>
  );
};

export default Billing;

