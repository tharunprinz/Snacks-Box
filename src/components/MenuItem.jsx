import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { getFoodImage } from '../utils/imageMap';

const MenuItem = ({ item }) => {
  const { addToCart } = useCart();
  const isAvailable = item.available !== false;
  
  // Only food items can be added to cart (not chat items)
  const isFoodItem = item.category !== 'CHATS' && item.category !== 'CHAT ITEMS';
  const canAddToCart = isAvailable && isFoodItem;

  const handleAddToCart = () => {
    if (canAddToCart) {
      addToCart(item);
    }
  };

  // Prefer custom image set by admin, fall back to mapped food image
  const imageUrl = item.imageUrl || getFoodImage(item.name);

  return (
    <motion.div
      className={`relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
        !isAvailable ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      }`}
      whileHover={{ y: -8, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isAvailable && (
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
          Not Available
        </div>
      )}
      
      <div className="relative overflow-hidden">
        <motion.img
          src={imageUrl}
          alt={item.name}
          className="w-full h-48 object-cover"
          loading="lazy"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
          }}
        />
        {(item.isOffer || item.isNewArrival) && (
          <div className="absolute top-2 left-2 flex gap-1">
            {item.isOffer && (
              <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded shadow-lg">
                ⭐ Offer
              </span>
            )}
            {item.isNewArrival && (
              <span className="px-2 py-1 bg-green-400 text-green-900 text-xs font-bold rounded shadow-lg">
                🆕 New
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 flex-1">{item.name}</h3>
          <span className="text-xl font-bold text-primary-brown ml-2">₹{item.price}</span>
        </div>
        
        {item.subcategory && (
          <span className="inline-block px-2 py-1 bg-yellow-50 text-primary-brown text-xs font-semibold rounded mb-3">
            {item.subcategory}
          </span>
        )}
        
        {isFoodItem ? (
          <motion.button
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            whileHover={canAddToCart ? { scale: 1.05 } : {}}
            whileTap={canAddToCart ? { scale: 0.95 } : {}}
            className={`w-full py-2 px-4 rounded-lg font-bold transition-all duration-300 ${
              canAddToCart
                ? 'bg-gradient-to-r from-primary-yellow to-primary-brown text-white hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canAddToCart ? 'Add to Cart' : 'Not Available'}
          </motion.button>
        ) : (
          <div className="py-2 text-center text-gray-500 italic text-sm">
            Display Only
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MenuItem;
