import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { initialMenuData } from '../data/menuData';

const MenuContext = createContext();

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within MenuProvider');
  }
  return context;
};

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    // Load menu from localStorage or use initial data
    const savedMenu = storage.getMenu();
    if (savedMenu && savedMenu.length > 0) {
      setMenu(savedMenu);
    } else {
      setMenu(initialMenuData);
      storage.saveMenu(initialMenuData);
    }
  }, []);

  const addMenuItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now(), // Simple ID generation
      available: item.available !== undefined ? item.available : true,
    };
    
    setMenu(prevMenu => {
      const newMenu = [...prevMenu, newItem];
      storage.saveMenu(newMenu);
      return newMenu;
    });
    
    return newItem;
  };

  const updateMenuItem = (id, updates) => {
    setMenu(prevMenu => {
      const newMenu = prevMenu.map(item =>
        item.id === id ? { ...item, ...updates } : item
      );
      storage.saveMenu(newMenu);
      return newMenu;
    });
  };

  const deleteMenuItem = (id) => {
    setMenu(prevMenu => {
      const newMenu = prevMenu.filter(item => item.id !== id);
      storage.saveMenu(newMenu);
      return newMenu;
    });
  };

  const getMenuByCategory = (category) => {
    return menu.filter(item => item.category === category);
  };

  const getAvailableItems = () => {
    return menu.filter(item => item.available);
  };

  const value = {
    menu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getMenuByCategory,
    getAvailableItems,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

