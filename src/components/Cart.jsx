import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';

const Cart = ({ isOpen, onClose, onCheckout }) => {
  const { cart, clearCart, getTotal } = useCart();
  const total = getTotal();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
        >
          <div className="cart-header">
            <h2>Your Cart</h2>
            <button className="close-cart" onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
                <p style={{ marginTop: '1rem', color: '#666' }}>
                  Add items from the menu to get started!
                </p>
              </div>
            ) : (
              <>
                <AnimatePresence>
                  {cart.map(item => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              </>
            )}
          </div>
          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="cart-actions">
                <motion.button
                  className="cart-action-btn clear-cart-btn"
                  onClick={clearCart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Cart
                </motion.button>
                <motion.button
                  className="cart-action-btn checkout-btn"
                  onClick={onCheckout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Checkout
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Cart;

