import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const CustomerContext = createContext();

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within CustomerProvider');
  }
  return context;
};

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Load customer data from localStorage on mount
    const savedCustomer = storage.getCustomer();
    if (savedCustomer) {
      setCustomer(savedCustomer);
      setIsLoggedIn(true);
    }
  }, []);

  // Email-based login/registration (OTP flow handled in UI)
  const loginWithEmail = (customerData) => {
    const now = new Date().toISOString();
    const existing =
      (customerData.email && storage.getCustomerByEmail(customerData.email)) ||
      (customerData.phone && storage.getCustomerByPhone(customerData.phone));

    const newCustomer = existing
      ? {
          ...existing,
          ...customerData,
          lastLoginAt: now,
          loginCount: (existing.loginCount || 0) + 1,
        }
      : {
          ...customerData,
          id: Date.now(),
          registeredAt: now,
          lastLoginAt: now,
          loginCount: 1,
          offersReceived: [],
        };

    const token = Math.random().toString(36).slice(2);
    storage.setCustomerToken(token);

    storage.saveCustomer(newCustomer);
    setCustomer(newCustomer);
    setIsLoggedIn(true);
    return newCustomer;
  };

  const logout = () => {
    setCustomer(null);
    setIsLoggedIn(false);
    storage.clearCustomer();
    storage.setCustomerToken(null);
  };

  const updateCustomer = (updates) => {
    const updatedCustomer = { ...customer, ...updates };
    storage.saveCustomer(updatedCustomer);
    setCustomer(updatedCustomer);
  };

  const addOfferReceived = (offer) => {
    if (customer) {
      const updatedCustomer = {
        ...customer,
        offersReceived: [...(customer.offersReceived || []), {
          ...offer,
          receivedAt: new Date().toISOString(),
        }],
      };
      storage.saveCustomer(updatedCustomer);
      setCustomer(updatedCustomer);
    }
  };

  const value = {
    customer,
    isLoggedIn,
    loginWithEmail,
    logout,
    updateCustomer,
    addOfferReceived,
  };

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
};

