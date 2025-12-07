import * as XLSX from 'xlsx';

const MENU_EXCEL_FILE = '/data/menu_data.xlsx';
const USERS_EXCEL_FILE = '/data/users_data.xlsx';

// Helper to read Excel file
async function readExcelFile(filePath) {
  try {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    return workbook;
  } catch (error) {
    console.error(`Error reading Excel file ${filePath}:`, error);
    return null;
  }
}

// Helper to write Excel file (client-side, downloads file)
function writeExcelFile(data, filename, sheetName = 'Sheet1') {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
}

// Read menu data from Excel
export async function readMenuFromExcel() {
  try {
    const workbook = await readExcelFile(MENU_EXCEL_FILE);
    if (!workbook) return null;
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const menuData = XLSX.utils.sheet_to_json(worksheet);
    
    // Convert Excel data to menu format
    return menuData.map((item, index) => ({
      id: item.id || item.ID || index + 1,
      name: item.name || item.Name || '',
      price: parseFloat(item.price || item.Price || 0),
      category: item.category || item.Category || '',
      subcategory: item.subcategory || item.Subcategory || '',
      imageUrl: item.imageUrl || item['Image URL'] || '',
      available: item.available !== false && item.Available !== 'No',
      isOffer: item.isOffer === true || item['Is Offer'] === 'Yes',
      isNewArrival: item.isNewArrival === true || item['Is New Arrival'] === 'Yes',
    }));
  } catch (error) {
    console.error('Error reading menu from Excel:', error);
    return null;
  }
}

// Write menu data to Excel
export function writeMenuToExcel(menuData) {
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
  
  writeExcelFile(excelData, 'menu_data.xlsx', 'Menu');
}

// Read users data from Excel
export async function readUsersFromExcel() {
  try {
    const workbook = await readExcelFile(USERS_EXCEL_FILE);
    if (!workbook) return [];
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const usersData = XLSX.utils.sheet_to_json(worksheet);
    
    return usersData.map((user, index) => ({
      id: user.id || user.ID || user['User ID'] || Date.now() + index,
      name: user.name || user.Name || '',
      email: user.email || user.Email || '',
      phone: user.phone || user.Phone || '',
      address: user.address || user.Address || '',
      whatsappOptIn: user.whatsappOptIn === true || user['WhatsApp Opt In'] === 'Yes',
      registeredAt: user.registeredAt || user['Registered At'] || new Date().toISOString(),
      lastLoginAt: user.lastLoginAt || user['Last Login'] || null,
      loginCount: parseInt(user.loginCount || user['Login Count'] || 0),
    }));
  } catch (error) {
    console.error('Error reading users from Excel:', error);
    return [];
  }
}

// Write users data to Excel
export function writeUsersToExcel(usersData) {
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
  
  writeExcelFile(excelData, 'users_data.xlsx', 'Users');
}

// Initialize Excel files if they don't exist (creates template)
export function initializeExcelFiles() {
  // This will be called to create initial Excel files
  // In a real app, you'd upload these files to the public/data folder
  const initialMenu = [
    { 'ID': 1, 'Name': 'Sample Item', 'Price': 50, 'Category': 'SNACKS & BITES', 'Subcategory': '', 'Image URL': '', 'Available': 'Yes', 'Is Offer': 'No', 'Is New Arrival': 'No' }
  ];
  
  const initialUsers = [
    { 'User ID': 1, 'Name': 'Admin', 'Email': 'admin@snackbox.com', 'Phone': '', 'Address': '', 'WhatsApp Opt In': 'No', 'Registered At': '', 'Last Login': '', 'Login Count': 0 }
  ];
  
  // Only create if files don't exist (check would be done server-side)
  // For now, we'll use localStorage as fallback
}

