import { useCart } from '../context/CartContext';
import { useCustomer } from '../context/CustomerContext';
import { motion } from 'framer-motion';

const Header = ({ onCartClick, onLoginClick, onProfileClick }) => {
  const { getItemCount } = useCart();
  const { isLoggedIn, customer } = useCustomer();
  const itemCount = getItemCount();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-gradient-to-r from-primary-yellow via-primary-brown to-primary-yellow shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <motion.img
              src="/logo.png"
              alt="SNACK BOX Logo"
              className="h-12 md:h-16 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
              whileHover={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            />
            <motion.h1
              className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              SNACK BOX
            </motion.h1>
          </motion.div>
          
          <nav className="flex items-center gap-3 md:gap-4">
            {isLoggedIn ? (
              <motion.button
                onClick={onProfileClick}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 md:px-6 py-2 bg-white text-primary-brown font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <span className="text-xl">👤</span>
                <span className="hidden md:inline">{customer?.name?.split(' ')[0] || 'Profile'}</span>
                <span className="md:hidden">Profile</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={onLoginClick}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 md:px-6 py-2 bg-white text-primary-brown font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <span className="text-xl">🔐</span>
                <span className="hidden md:inline">Login / Register</span>
                <span className="md:hidden">Login</span>
              </motion.button>
            )}
            <motion.button
              onClick={onCartClick}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-4 md:px-6 py-2 bg-white text-primary-brown font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <span className="text-xl">🛒</span>
              <span>Cart</span>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                >
                  {itemCount}
                </motion.span>
              )}
            </motion.button>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
