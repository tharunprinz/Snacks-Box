import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const MenuItem = ({ item }) => {
  const { addToCart } = useCart();
  const isAvailable = item.available !== false;

  const handleAddToCart = () => {
    if (isAvailable) {
      addToCart(item);
    }
  };

  // Generate placeholder image URL based on item name
  const imageUrl = `https://source.unsplash.com/400x300/?food,${encodeURIComponent(item.name)}`;

  return (
    <motion.div
      className={`menu-item ${!isAvailable ? 'not-available' : ''}`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isAvailable && (
        <div className="not-available-badge">Not Available</div>
      )}
      <img
        src={imageUrl}
        alt={item.name}
        className="menu-item-image"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(item.name);
        }}
      />
      <div className="menu-item-content">
        <div className="menu-item-header">
          <h3 className="menu-item-name">{item.name}</h3>
          <span className="menu-item-price">₹{item.price}</span>
        </div>
        {item.vendor && (
          <p className="menu-item-vendor">Vendor: {item.vendor}</p>
        )}
        {item.subcategory && (
          <span className="menu-item-category">{item.subcategory}</span>
        )}
        <motion.button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={!isAvailable}
          whileHover={isAvailable ? { scale: 1.05 } : {}}
          whileTap={isAvailable ? { scale: 0.95 } : {}}
        >
          {isAvailable ? 'Add to Cart' : 'Not Available'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MenuItem;

