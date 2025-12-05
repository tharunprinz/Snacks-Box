import { useMenu } from '../context/MenuContext';
import MenuItem from './MenuItem';
import PromoCard from './PromoCard';
import ShopShowcase from './ShopShowcase';
import CustomerFeedback from './CustomerFeedback';
import { useState } from 'react';
import { motion } from 'framer-motion';

const MenuSection = () => {
  const { menu } = useMenu();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Get unique categories
  const categories = ['ALL', ...new Set(menu.map(item => item.category))];

  // Filter menu items - only show available food items for ordering
  const filteredMenu = menu.filter(item => {
    const isAvailable = item.available !== false;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return isAvailable && matchesSearch && matchesCategory;
  });

  // Group by category
  const groupedMenu = filteredMenu.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Group by subcategory within each category
  const organizeBySubcategory = (items) => {
    return items.reduce((acc, item) => {
      const subcategory = item.subcategory || 'Other';
      if (!acc[subcategory]) {
        acc[subcategory] = [];
      }
      acc[subcategory].push(item);
      return acc;
    }, {});
  };

  const categoryEmojis = {
    'BAKE TREATS': '🍰',
    'SNACKS & BITES': '🍔',
    'DRINKS & SHAKES': '🥤',
    'ICE CREAM & MORE': '🍨',
    'SPECIALS': '⭐',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <ShopShowcase />
      <PromoCard />
      
      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <motion.input
          type="text"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 text-lg border-2 border-primary-yellow rounded-xl focus:border-primary-brown focus:outline-none transition-all duration-300 mb-4 shadow-md"
          whileFocus={{ scale: 1.01 }}
        />
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full font-bold transition-all duration-300 min-h-[44px] ${
                selectedCategory === category
                  ? 'bg-primary-brown text-white shadow-lg'
                  : 'bg-primary-yellow text-primary-brown hover:bg-primary-brown hover:text-white'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Menu Items */}
      {Object.keys(groupedMenu).length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500"
        >
          <p className="text-xl">No items found. Try a different search term.</p>
        </motion.div>
      ) : (
        Object.entries(groupedMenu).map(([category, items], idx) => {
          const subcategories = organizeBySubcategory(items);
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="mb-12"
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-primary-brown mb-6 pb-2 border-b-4 border-primary-yellow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 + 0.2 }}
              >
                {categoryEmojis[category] || ''} {category}
              </motion.h2>
              
              {Object.entries(subcategories).map(([subcategory, subItems]) => (
                <div key={subcategory}>
                  {subcategory !== 'Other' && (
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xl font-bold text-primary-brown mt-6 mb-4"
                    >
                      {subcategory}
                    </motion.h3>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {subItems.map((item, itemIdx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: itemIdx * 0.05 }}
                      >
                        <MenuItem item={item} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          );
        })
      )}

      <CustomerFeedback />
    </div>
  );
};

export default MenuSection;
