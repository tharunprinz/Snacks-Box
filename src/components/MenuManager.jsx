import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMenu } from '../context/MenuContext';

const MenuManager = () => {
  const { menu, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();
  const [editingItem, setEditingItem] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageSource, setImageSource] = useState('url'); // 'url' or 'file'
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    subcategory: '',
    imageUrl: '',
    isOffer: false,
    isNewArrival: false,
    available: true,
  });

  const categories = ['BAKE TREATS', 'SNACKS & BITES', 'DRINKS & SHAKES', 'ICE CREAM & MORE', 'SPECIALS'];

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData({ ...formData, imageUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url) => {
    setFormData({ ...formData, imageUrl: url });
    setImagePreview(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const itemData = {
      ...formData,
      price: parseFloat(formData.price),
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, itemData);
    } else {
      addMenuItem(itemData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      subcategory: '',
      imageUrl: '',
      isOffer: false,
      isNewArrival: false,
      available: true,
    });
    setEditingItem(null);
    setImagePreview('');
    setImageSource('url');
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      subcategory: item.subcategory || '',
      imageUrl: item.imageUrl || '',
      isOffer: !!item.isOffer,
      isNewArrival: !!item.isNewArrival,
      available: item.available !== false,
    });
    setImagePreview(item.imageUrl || '');
    setImageSource(item.imageUrl?.startsWith('data:') ? 'file' : 'url');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMenuItem(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-primary-yellow">
        <h1 className="text-3xl font-bold text-primary-brown">Menu Management</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-primary-brown mb-6">
          {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-yellow focus:outline-none transition-all duration-300"
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
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-yellow focus:outline-none transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-yellow focus:outline-none transition-all duration-300"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
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
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              placeholder="e.g., Brownie, Cookies, Burgers"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-yellow focus:outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Item Image
          </label>
          
          {/* Toggle between URL and File upload */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setImageSource('url')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                imageSource === 'url'
                  ? 'bg-primary-yellow text-primary-brown'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Image URL
            </button>
            <button
              type="button"
              onClick={() => setImageSource('file')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                imageSource === 'file'
                  ? 'bg-primary-yellow text-primary-brown'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Upload from Device
            </button>
          </div>

          {imageSource === 'url' ? (
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              placeholder="Paste image URL (optional)"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-yellow focus:outline-none transition-all duration-300"
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-yellow focus:outline-none transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-yellow file:text-primary-brown hover:file:bg-primary-brown hover:file:text-white"
            />
          )}

          {imagePreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3"
            >
              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-lg max-w-xs h-32 object-cover border-2 border-gray-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </motion.div>
          )}
        </div>

        {/* Checkboxes */}
        <div className="mt-4 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="w-5 h-5 text-primary-yellow border-gray-300 rounded focus:ring-primary-yellow"
            />
            <span className="text-gray-700 font-medium">Available for order</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isOffer}
              onChange={(e) => setFormData({ ...formData, isOffer: e.target.checked })}
              className="w-5 h-5 text-primary-yellow border-gray-300 rounded focus:ring-primary-yellow"
            />
            <span className="text-gray-700 font-medium">Mark as Special Offer</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isNewArrival}
              onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
              className="w-5 h-5 text-primary-yellow border-gray-300 rounded focus:ring-primary-yellow"
            />
            <span className="text-gray-700 font-medium">Mark as New Arrival</span>
          </label>
        </div>

        <div className="flex gap-3 mt-6">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-primary-yellow to-primary-brown text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {editingItem ? 'Update Item' : 'Add Item'}
          </motion.button>
          {editingItem && (
            <motion.button
              type="button"
              onClick={resetForm}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition-all duration-300"
            >
              Cancel
            </motion.button>
          )}
        </div>
      </form>

      <div>
        <h2 className="text-xl font-bold text-primary-brown mb-4">
          All Menu Items ({menu.length})
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {menu.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-yellow transition-all duration-300"
            >
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  ₹{item.price} | {item.category} {item.subcategory && `| ${item.subcategory}`}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {(item.isOffer || item.isNewArrival) && (
                    <>
                      {item.isOffer && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                          ⭐ Offer
                        </span>
                      )}
                      {item.isNewArrival && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                          🆕 New Arrival
                        </span>
                      )}
                    </>
                  )}
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    item.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <motion.button
                  onClick={() => handleEdit(item)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-primary-yellow text-primary-brown font-semibold rounded-lg hover:bg-primary-brown hover:text-white transition-all duration-300"
                >
                  Edit
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MenuManager;
