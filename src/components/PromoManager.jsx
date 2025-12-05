import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { storage } from '../utils/storage';
import { useMenu } from '../context/MenuContext';

const PromoManager = () => {
  const { menu } = useMenu();
  const [promoData, setPromoData] = useState(storage.getPromo());
  const [activeTab, setActiveTab] = useState('promo'); // 'promo' | 'specials' | 'arrivals'
  const [whatsappSent, setWhatsappSent] = useState(false);

  useEffect(() => {
    setPromoData(storage.getPromo());
  }, []);

  const handlePromoUpdate = (field, value) => {
    const updated = { ...promoData, [field]: value };
    setPromoData(updated);
    storage.savePromo(updated);
  };

  const handleAddSpecial = (itemId) => {
    if (!promoData.dailySpecials.includes(itemId)) {
      const updated = {
        ...promoData,
        dailySpecials: [...promoData.dailySpecials, itemId],
      };
      setPromoData(updated);
      storage.savePromo(updated);
    }
  };

  const handleRemoveSpecial = (itemId) => {
    const updated = {
      ...promoData,
      dailySpecials: promoData.dailySpecials.filter(id => id !== itemId),
    };
    setPromoData(updated);
    storage.savePromo(updated);
  };

  const handleAddArrival = (itemId) => {
    if (!promoData.newArrivals.includes(itemId)) {
      const updated = {
        ...promoData,
        newArrivals: [...promoData.newArrivals, itemId],
      };
      setPromoData(updated);
      storage.savePromo(updated);
    }
  };

  const handleRemoveArrival = (itemId) => {
    const updated = {
      ...promoData,
      newArrivals: promoData.newArrivals.filter(id => id !== itemId),
    };
    setPromoData(updated);
    storage.savePromo(updated);
  };

  const handleSendWhatsApp = () => {
    const customers = storage.getAllCustomers().filter(c => c.whatsappOptIn);
    const specials = menu.filter(item => promoData.dailySpecials.includes(item.id));
    const arrivals = menu.filter(item => promoData.newArrivals.includes(item.id));

    let message = `🎉 *SNACK BOX - Daily Specials & New Arrivals*\n\n`;
    
    if (specials.length > 0) {
      message += `⭐ *Daily Specials:*\n`;
      specials.forEach(item => {
        message += `• ${item.name} - ₹${item.price}\n`;
      });
      message += `\n`;
    }

    if (arrivals.length > 0) {
      message += `🆕 *New Arrivals:*\n`;
      arrivals.forEach(item => {
        message += `• ${item.name} - ₹${item.price}\n`;
      });
      message += `\n`;
    }

    message += `Visit us today! 🍽️\n\nThank you for being a valued customer! 💝`;

    // Simulate WhatsApp send (in production, this would call WhatsApp API)
    console.log(`Sending WhatsApp to ${customers.length} customers:`);
    console.log(message);
    
    // In production, you would call your WhatsApp API here
    // Example: await sendWhatsAppMessage(customer.phone, message);

    setWhatsappSent(true);
    setTimeout(() => setWhatsappSent(false), 3000);
  };

  const availableItems = menu.filter(item => item.available);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-primary-yellow">
        <h2 className="text-2xl font-bold text-primary-brown">Promo & Offers Management</h2>
        {whatsappSent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold"
          >
            ✅ WhatsApp sent successfully!
          </motion.div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {['promo', 'specials', 'arrivals'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold transition-all duration-300 ${
              activeTab === tab
                ? 'text-primary-brown border-b-2 border-primary-brown'
                : 'text-gray-600 hover:text-primary-brown'
            }`}
          >
            {tab === 'promo' ? 'Promo Card' : tab === 'specials' ? 'Daily Specials' : 'New Arrivals'}
          </button>
        ))}
      </div>

      {/* Promo Card Tab */}
      {activeTab === 'promo' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Promo Title
            </label>
            <input
              type="text"
              value={promoData.title}
              onChange={(e) => handlePromoUpdate('title', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-yellow focus:outline-none transition-all duration-300"
              placeholder="Enter promo title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Promo Message
            </label>
            <textarea
              value={promoData.message}
              onChange={(e) => handlePromoUpdate('message', e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-yellow focus:outline-none transition-all duration-300"
              placeholder="Enter promo message"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Promo Image URL
            </label>
            <input
              type="text"
              value={promoData.imageUrl}
              onChange={(e) => handlePromoUpdate('imageUrl', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-yellow focus:outline-none transition-all duration-300"
              placeholder="Enter image URL"
            />
            {promoData.imageUrl && (
              <img
                src={promoData.imageUrl}
                alt="Promo preview"
                className="mt-2 rounded-lg max-w-xs h-32 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Daily Specials Tab */}
      {activeTab === 'specials' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Items for Daily Specials
            </label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddSpecial(parseInt(e.target.value));
                  e.target.value = '';
                }
              }}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-yellow focus:outline-none transition-all duration-300"
            >
              <option value="">Choose an item...</option>
              {availableItems
                .filter(item => !promoData.dailySpecials.includes(item.id))
                .map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} - ₹{item.price}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {promoData.dailySpecials.map(itemId => {
              const item = menu.find(m => m.id === itemId);
              if (!item) return null;
              return (
                <motion.div
                  key={itemId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-primary-yellow"
                >
                  <span className="font-medium text-gray-800">{item.name} - ₹{item.price}</span>
                  <button
                    onClick={() => handleRemoveSpecial(itemId)}
                    className="text-red-600 hover:text-red-800 font-bold text-lg transition-colors"
                  >
                    ×
                  </button>
                </motion.div>
              );
            })}
          </div>

          {promoData.dailySpecials.length === 0 && (
            <p className="text-gray-500 text-center py-4">No daily specials selected</p>
          )}
        </motion.div>
      )}

      {/* New Arrivals Tab */}
      {activeTab === 'arrivals' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Items for New Arrivals
            </label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddArrival(parseInt(e.target.value));
                  e.target.value = '';
                }
              }}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-yellow focus:outline-none transition-all duration-300"
            >
              <option value="">Choose an item...</option>
              {availableItems
                .filter(item => !promoData.newArrivals.includes(item.id))
                .map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} - ₹{item.price}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {promoData.newArrivals.map(itemId => {
              const item = menu.find(m => m.id === itemId);
              if (!item) return null;
              return (
                <motion.div
                  key={itemId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-300"
                >
                  <span className="font-medium text-gray-800">{item.name} - ₹{item.price}</span>
                  <button
                    onClick={() => handleRemoveArrival(itemId)}
                    className="text-red-600 hover:text-red-800 font-bold text-lg transition-colors"
                  >
                    ×
                  </button>
                </motion.div>
              );
            })}
          </div>

          {promoData.newArrivals.length === 0 && (
            <p className="text-gray-500 text-center py-4">No new arrivals selected</p>
          )}
        </motion.div>
      )}

      {/* Send WhatsApp Button */}
      {(promoData.dailySpecials.length > 0 || promoData.newArrivals.length > 0) && (
        <motion.button
          onClick={handleSendWhatsApp}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          📱 Send Daily Specials & New Arrivals via WhatsApp
        </motion.button>
      )}
    </motion.div>
  );
};

export default PromoManager;

