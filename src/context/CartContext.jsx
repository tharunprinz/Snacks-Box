import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { showToast } from '../components/Toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCart = storage.getCart();
    setCart(savedCart);
  }, []);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      let newCart;
      
      if (existingItem) {
        newCart = prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        showToast(`${item.name} quantity updated!`, 'success');
      } else {
        newCart = [...prevCart, { ...item, quantity: 1 }];
        showToast(`${item.name} added to cart! 🛒`, 'success');
      }
      
      storage.saveCart(newCart);
      return newCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.id === itemId);
      const newCart = prevCart.filter(i => i.id !== itemId);
      storage.saveCart(newCart);
      if (item) {
        showToast(`${item.name} removed from cart`, 'info');
      }
      return newCart;
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      storage.saveCart(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    storage.clearCart();
    showToast('Cart cleared', 'info');
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

