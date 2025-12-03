import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <motion.div
      className="cart-item"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <div className="cart-item-info">
        <div className="cart-item-name">{item.name}</div>
        <div className="cart-item-price">₹{item.price} each</div>
        <div className="quantity-controls">
          <motion.button
            className="quantity-btn"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            -
          </motion.button>
          <span className="quantity">{item.quantity}</span>
          <motion.button
            className="quantity-btn"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            +
          </motion.button>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 'bold', color: '#AD703C', marginBottom: '0.5rem' }}>
          ₹{(item.price * item.quantity).toFixed(2)}
        </div>
        <motion.button
          className="remove-item"
          onClick={() => removeFromCart(item.id)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          🗑️
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CartItem;

