import { useMenu } from '../context/MenuContext';
import MenuItem from './MenuItem';
import { useState } from 'react';

const MenuSection = () => {
  const { menu } = useMenu();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Get unique categories
  const categories = ['ALL', ...new Set(menu.map(item => item.category))];

  // Filter menu items
  const filteredMenu = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

  return (
    <div className="main-content">
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1rem',
            border: '2px solid #EDC94F',
            borderRadius: '10px',
            marginBottom: '1rem',
          }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '20px',
                background: selectedCategory === category ? '#AD703C' : '#EDC94F',
                color: selectedCategory === category ? 'white' : '#AD703C',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {Object.keys(groupedMenu).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <p>No items found. Try a different search term.</p>
        </div>
      ) : (
        Object.entries(groupedMenu).map(([category, items]) => {
          const subcategories = organizeBySubcategory(items);
          return (
            <div key={category} className="menu-section">
              <h2 className="section-title">
                {category === 'BAKE TREATS' && '🍰'}
                {category === 'SNACKS & BITES' && '🍔'}
                {category === 'DRINKS & SHAKES' && '🥤'}
                {category === 'ICE CREAM & MORE' && '🍨'}
                {category === 'SPECIALS' && '⭐'}
                {' '}
                {category}
              </h2>
              {Object.entries(subcategories).map(([subcategory, subItems]) => (
                <div key={subcategory}>
                  {subcategory !== 'Other' && (
                    <h3 style={{ 
                      color: '#AD703C', 
                      marginTop: '1.5rem', 
                      marginBottom: '1rem',
                      fontSize: '1.25rem',
                      fontWeight: 'bold'
                    }}>
                      {subcategory}
                    </h3>
                  )}
                  <div className="menu-grid">
                    {subItems.map(item => (
                      <MenuItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MenuSection;

