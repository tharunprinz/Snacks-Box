// localStorage helper functions

const MENU_STORAGE_KEY = 'snackbox_menu';
const CART_STORAGE_KEY = 'snackbox_cart';
const ORDERS_STORAGE_KEY = 'snackbox_orders';
const ADMIN_AUTH_KEY = 'snackbox_admin';
const CUSTOMER_STORAGE_KEY = 'snackbox_customer';
const CUSTOMERS_STORAGE_KEY = 'snackbox_customers';
const FEEDBACK_STORAGE_KEY = 'snackbox_feedback';
const CUSTOMER_TOKEN_KEY = 'snackbox_customer_token';
const ADMIN_TOKEN_KEY = 'snackbox_admin_token';
const PROMO_STORAGE_KEY = 'snackbox_promo';

export const storage = {
  // Menu operations
  getMenu: () => {
    const stored = localStorage.getItem(MENU_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  saveMenu: (menu) => {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menu));
  },

  // Cart operations
  getCart: () => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveCart: (cart) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  },

  clearCart: () => {
    localStorage.removeItem(CART_STORAGE_KEY);
  },

  // Orders operations
  getOrders: () => {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveOrder: (order) => {
    const orders = storage.getOrders();
    orders.push(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  },

  // Admin auth
  isAdminAuthenticated: () => {
    return !!localStorage.getItem(ADMIN_TOKEN_KEY);
  },

  setAdminAuth: (isAuthenticated) => {
    if (isAuthenticated) {
      const token = Math.random().toString(36).slice(2);
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_AUTH_KEY);
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  },

  // Customer operations
  getCustomer: () => {
    const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  saveCustomer: (customer) => {
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
    // Also save to customers list for lookup
    const customers = storage.getAllCustomers();
    const existingIndex = customers.findIndex((c) => {
      if (customer.phone && c.phone === customer.phone) return true;
      if (customer.email && c.email === customer.email) return true;
      return false;
    });
    if (existingIndex >= 0) {
      customers[existingIndex] = customer;
    } else {
      customers.push(customer);
    }
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  },

  getAllCustomers: () => {
    const stored = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getCustomerByEmail: (email) => {
    const customers = storage.getAllCustomers();
    return customers.find(c => c.email === email) || null;
  },

  getCustomerByPhone: (phone) => {
    const customers = storage.getAllCustomers();
    return customers.find((c) => c.phone === phone) || null;
  },

  clearCustomer: () => {
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
  },

  // Feedback operations
  getAllFeedback: () => {
    const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  addFeedback: (entry) => {
    const list = storage.getAllFeedback();
    const updated = [...list, entry];
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  updateFeedback: (id, updates) => {
    const list = storage.getAllFeedback();
    const updated = list.map((fb) =>
      fb.id === id ? { ...fb, ...updates } : fb
    );
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  // Customer token (for backend integration later)
  getCustomerToken: () => {
    return localStorage.getItem(CUSTOMER_TOKEN_KEY);
  },

  setCustomerToken: (token) => {
    if (token) {
      localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    }
  },

  // Promo/Offers operations
  getPromo: () => {
    const stored = localStorage.getItem(PROMO_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      title: '🎉 Special Offers & New Arrivals!',
      message: 'Discover our latest delicious treats and exclusive deals. Fresh flavors, amazing prices!',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
      dailySpecials: [],
      newArrivals: [],
      lastUpdated: null,
    };
  },

  savePromo: (promo) => {
    localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify({
      ...promo,
      lastUpdated: new Date().toISOString(),
    }));
  },
};

