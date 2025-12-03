import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const Header = ({ onCartClick, onAdminClick, isAdmin }) => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <img src="/logo.png" alt="SNACK BOX Logo" className="logo" onError={(e) => {
            e.target.style.display = 'none';
          }} />
          <h1 className="logo-text">SNACK BOX</h1>
        </div>
        <nav className="nav">
          {!isAdmin && (
            <motion.button
              className="nav-button cart-button"
              onClick={onCartClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🛒 Cart
              {itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
              )}
            </motion.button>
          )}
          <motion.button
            className="nav-button"
            onClick={onAdminClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isAdmin ? '🏠 Home' : '⚙️ Admin'}
          </motion.button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

