// Excel-based storage that syncs with Excel files
import * as XLSX from 'xlsx';
import { storage } from './storage';

// Excel file paths (these should be in public/data folder)
const MENU_EXCEL_PATH = '/data/menu_data.xlsx';
const USERS_EXCEL_PATH = '/data/users_data.xlsx';

// Helper to download Excel file (for writing)
function downloadExcelFile(data, filename, sheetName = 'Sheet1') {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
}

// Read menu from Excel (with localStorage fallback)
export async function getMenuFromExcel() {
  try {
    const response = await fetch(MENU_EXCEL_PATH);
    if (!response.ok) {
      // Fallback to localStorage
      return storage.getMenu();
    }
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const menuData = XLSX.utils.sheet_to_json(worksheet);
    
    return menuData.map((item, index) => ({
      id: item.ID || item.id || index + 1,
      name: item.Name || item.name || '',
      price: parseFloat(item.Price || item.price || 0),
      category: item.Category || item.category || '',
      subcategory: item.Subcategory || item.subcategory || '',
      imageUrl: item['Image URL'] || item.imageUrl || '',
      available: (item.Available === 'Yes' || item.available === true),
      isOffer: (item['Is Offer'] === 'Yes' || item.isOffer === true),
      isNewArrival: (item['Is New Arrival'] === 'Yes' || item.isNewArrival === true),
    }));
  } catch (error) {
    console.error('Error reading menu Excel:', error);
    return storage.getMenu();
  }
}

// Write menu to Excel
export function saveMenuToExcel(menuData) {
  const excelData = menuData.map(item => ({
    'ID': item.id,
    'Name': item.name,
    'Price': item.price,
    'Category': item.category,
    'Subcategory': item.subcategory || '',
    'Image URL': item.imageUrl || '',
    'Available': item.available ? 'Yes' : 'No',
    'Is Offer': item.isOffer ? 'Yes' : 'No',
    'Is New Arrival': item.isNewArrival ? 'Yes' : 'No',
  }));
  
  downloadExcelFile(excelData, 'menu_data.xlsx', 'Menu');
  
  // Also save to localStorage as backup
  storage.saveMenu(menuData);
}

// Read users from Excel (with localStorage fallback)
export async function getUsersFromExcel() {
  try {
    const response = await fetch(USERS_EXCEL_PATH);
    if (!response.ok) {
      // Fallback to localStorage
      return storage.getAllCustomers();
    }
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const usersData = XLSX.utils.sheet_to_json(worksheet);
    
    return usersData.map((user) => ({
      id: user['User ID'] || user.id || Date.now(),
      name: user.Name || user.name || '',
      email: user.Email || user.email || '',
      phone: user.Phone || user.phone || '',
      address: user.Address || user.address || '',
      whatsappOptIn: (user['WhatsApp Opt In'] === 'Yes' || user.whatsappOptIn === true),
      registeredAt: user['Registered At'] || user.registeredAt || new Date().toISOString(),
      lastLoginAt: user['Last Login'] || user.lastLoginAt || null,
      loginCount: parseInt(user['Login Count'] || user.loginCount || 0),
    }));
  } catch (error) {
    console.error('Error reading users Excel:', error);
    return storage.getAllCustomers();
  }
}

// Write users to Excel
export function saveUsersToExcel(usersData) {
  const excelData = usersData.map(user => ({
    'User ID': user.id,
    'Name': user.name,
    'Email': user.email,
    'Phone': user.phone,
    'Address': user.address || '',
    'WhatsApp Opt In': user.whatsappOptIn ? 'Yes' : 'No',
    'Registered At': user.registeredAt || '',
    'Last Login': user.lastLoginAt || '',
    'Login Count': user.loginCount || 0,
  }));
  
  downloadExcelFile(excelData, 'users_data.xlsx', 'Users');
  
  // Also save to localStorage as backup
  usersData.forEach(user => storage.saveCustomer(user));
}

// Sync menu changes to Excel
export function syncMenuToExcel(menuData) {
  saveMenuToExcel(menuData);
}

// Sync user changes to Excel
export function syncUsersToExcel() {
  const users = storage.getAllCustomers();
  saveUsersToExcel(users);
}

