// localStorage helper functions

const MENU_STORAGE_KEY = 'snackbox_menu';
const CART_STORAGE_KEY = 'snackbox_cart';
const ORDERS_STORAGE_KEY = 'snackbox_orders';
const ADMIN_AUTH_KEY = 'snackbox_admin';

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
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  },

  setAdminAuth: (isAuthenticated) => {
    if (isAuthenticated) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  },
};

