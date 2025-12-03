import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMenu } from '../context/MenuContext';

const MenuManager = () => {
  const { menu, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    subcategory: '',
    vendor: '',
    available: true,
  });

  const categories = ['BAKE TREATS', 'SNACKS & BITES', 'DRINKS & SHAKES', 'ICE CREAM & MORE', 'SPECIALS'];

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
      vendor: '',
      available: true,
    });
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      subcategory: item.subcategory || '',
      vendor: item.vendor || '',
      available: item.available !== false,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMenuItem(id);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Menu Management</h1>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: '1.5rem', color: '#AD703C' }}>
          {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h2>
        
        <div className="form-group">
          <label>Item Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Price (₹) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Subcategory</label>
          <input
            type="text"
            value={formData.subcategory}
            onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
            placeholder="e.g., Brownie, Cookies, Burgers"
          />
        </div>

        <div className="form-group">
          <label>Vendor</label>
          <input
            type="text"
            value={formData.vendor}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
            placeholder="e.g., CV, Raj"
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
            />
            {' '}Available for order
          </label>
        </div>

        <div className="form-actions">
          <motion.button
            type="submit"
            className="form-btn submit-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {editingItem ? 'Update Item' : 'Add Item'}
          </motion.button>
          {editingItem && (
            <motion.button
              type="button"
              className="form-btn cancel-btn"
              onClick={resetForm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
          )}
        </div>
      </form>

      <div className="menu-items-list">
        <h2 style={{ marginBottom: '1rem', color: '#AD703C' }}>All Menu Items ({menu.length})</h2>
        {menu.map(item => (
          <motion.div
            key={item.id}
            className="menu-item-admin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="menu-item-admin-info">
              <h3 style={{ marginBottom: '0.5rem', color: '#333' }}>{item.name}</h3>
              <p style={{ color: '#666', marginBottom: '0.25rem' }}>
                ₹{item.price} | {item.category} {item.subcategory && `| ${item.subcategory}`}
                {item.vendor && ` | Vendor: ${item.vendor}`}
              </p>
              <span style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '5px',
                fontSize: '0.85rem',
                background: item.available ? '#d4edda' : '#f8d7da',
                color: item.available ? '#155724' : '#721c24',
              }}>
                {item.available ? 'Available' : 'Not Available'}
              </span>
            </div>
            <div className="menu-item-admin-actions">
              <motion.button
                className="admin-action-btn edit-btn"
                onClick={() => handleEdit(item)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Edit
              </motion.button>
              <motion.button
                className="admin-action-btn delete-btn"
                onClick={() => handleDelete(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MenuManager;

