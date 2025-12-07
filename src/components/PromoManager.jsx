import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { storage } from '../utils/storage';
import { useMenu } from '../context/MenuContext';
import { getUsersFromBackend } from '../utils/backendStorage';
import { showToast } from './Toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const PromoManager = () => {
  const { menu, addMenuItem } = useMenu();
  const [promoData, setPromoData] = useState(storage.getPromo());
  const [activeTab, setActiveTab] = useState('promo'); // 'promo' | 'specials' | 'arrivals'
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [newArrivalForm, setNewArrivalForm] = useState({
    name: '',
    price: '',
    category: '',
    subcategory: '',
    imageUrl: '',
    available: true,
  });
  const [newSpecialForm, setNewSpecialForm] = useState({
    name: '',
    price: '',
    category: '',
    subcategory: '',
    imageUrl: '',
    available: true,
  });

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

  const handleSendWhatsApp = async () => {
    try {
      const specials = menu.filter(item => promoData.dailySpecials.includes(item.id));
      const arrivals = menu.filter(item => promoData.newArrivals.includes(item.id));

      if (specials.length === 0 && arrivals.length === 0) {
        showToast('Please add daily specials or new arrivals first', 'error');
        return;
      }

      // Call backend API to send WhatsApp
      const response = await fetch(`${API_BASE_URL}/whatsapp/send-specials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dailySpecials: promoData.dailySpecials,
          newArrivals: promoData.newArrivals,
          menu: menu,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to send WhatsApp messages');
      }

      // Update promo card immediately
      const updatedPromo = { ...promoData };
      storage.savePromo(updatedPromo);
      setPromoData(updatedPromo);

      showToast(`WhatsApp sent to ${result.successful} customers! 📱`, 'success');
      setWhatsappSent(true);
      setTimeout(() => setWhatsappSent(false), 3000);
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      showToast(error.message || 'Failed to send WhatsApp messages', 'error');
    }
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
          className="space-y-6"
        >
          {/* Add New Item Form */}
          <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">➕ Add New Daily Special Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={newSpecialForm.name}
                  onChange={(e) => setNewSpecialForm({ ...newSpecialForm, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none transition-all duration-300"
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newSpecialForm.price}
                  onChange={(e) => setNewSpecialForm({ ...newSpecialForm, price: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none transition-all duration-300"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={newSpecialForm.category}
                  onChange={(e) => setNewSpecialForm({ ...newSpecialForm, category: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none transition-all duration-300"
                >
                  <option value="">Select Category</option>
                  {['BAKE TREATS', 'SNACKS & BITES', 'DRINKS & SHAKES', 'ICE CREAM & MORE', 'SPECIALS'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={newSpecialForm.subcategory}
                  onChange={(e) => setNewSpecialForm({ ...newSpecialForm, subcategory: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none transition-all duration-300"
                  placeholder="e.g., Brownie, Cookies"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={newSpecialForm.imageUrl}
                  onChange={(e) => setNewSpecialForm({ ...newSpecialForm, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none transition-all duration-300"
                  placeholder="Enter image URL (optional)"
                />
                {newSpecialForm.imageUrl && (
                  <img
                    src={newSpecialForm.imageUrl}
                    alt="Preview"
                    className="mt-2 rounded-lg max-w-xs h-32 object-cover border-2 border-gray-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>
            <motion.button
              onClick={() => {
                if (newSpecialForm.name && newSpecialForm.price && newSpecialForm.category) {
                  const newItem = addMenuItem({
                    ...newSpecialForm,
                    price: parseFloat(newSpecialForm.price),
                    isOffer: true,
                  });
                  handleAddSpecial(newItem.id);
                  setNewSpecialForm({
                    name: '',
                    price: '',
                    category: '',
                    subcategory: '',
                    imageUrl: '',
                    available: true,
                  });
                  showToast(`${newItem.name} added to Daily Specials! ⭐`, 'success');
                } else {
                  showToast('Please fill all required fields', 'error');
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              ➕ Add to Daily Specials
            </motion.button>
          </div>

          {/* Select Existing Items */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Or Select Existing Items for Daily Specials
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

          {/* Current Daily Specials List */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Current Daily Specials</h3>
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
              <p className="text-gray-500 text-center py-4">No daily specials added yet</p>
            )}
          </div>
        </motion.div>
      )}

      {/* New Arrivals Tab */}
      {activeTab === 'arrivals' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Add New Item Form */}
          <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">➕ Add New Arrival Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={newArrivalForm.name}
                  onChange={(e) => setNewArrivalForm({ ...newArrivalForm, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-all duration-300"
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newArrivalForm.price}
                  onChange={(e) => setNewArrivalForm({ ...newArrivalForm, price: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-all duration-300"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={newArrivalForm.category}
                  onChange={(e) => setNewArrivalForm({ ...newArrivalForm, category: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-all duration-300"
                >
                  <option value="">Select Category</option>
                  {['BAKE TREATS', 'SNACKS & BITES', 'DRINKS & SHAKES', 'ICE CREAM & MORE', 'SPECIALS'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={newArrivalForm.subcategory}
                  onChange={(e) => setNewArrivalForm({ ...newArrivalForm, subcategory: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-all duration-300"
                  placeholder="e.g., Brownie, Cookies"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={newArrivalForm.imageUrl}
                  onChange={(e) => setNewArrivalForm({ ...newArrivalForm, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-all duration-300"
                  placeholder="Enter image URL (optional)"
                />
              </div>
            </div>
            <motion.button
              onClick={() => {
                if (newArrivalForm.name && newArrivalForm.price && newArrivalForm.category) {
                  const newItem = addMenuItem({
                    ...newArrivalForm,
                    price: parseFloat(newArrivalForm.price),
                    isNewArrival: true,
                  });
                  handleAddArrival(newItem.id);
                  setNewArrivalForm({
                    name: '',
                    price: '',
                    category: '',
                    subcategory: '',
                    imageUrl: '',
                    available: true,
                  });
                  showToast(`${newItem.name} added to New Arrivals! 🆕`, 'success');
                } else {
                  showToast('Please fill all required fields', 'error');
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              ➕ Add to New Arrivals
            </motion.button>
          </div>

          {/* Existing New Arrivals List */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Current New Arrivals</h3>
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
              <p className="text-gray-500 text-center py-4">No new arrivals added yet</p>
            )}
          </div>
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

