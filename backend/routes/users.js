import express from 'express';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to users Excel file (in backend/data directory)
const USERS_EXCEL_PATH = path.join(__dirname, '../data/users_data.xlsx');
const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Read users from Excel
router.get('/users', (req, res) => {
  try {
    if (!fs.existsSync(USERS_EXCEL_PATH)) {
      return res.json([]);
    }

    const workbook = XLSX.readFile(USERS_EXCEL_PATH);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const usersData = XLSX.utils.sheet_to_json(worksheet);

    const users = usersData.map((user) => ({
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

    res.json(users);
  } catch (error) {
    console.error('Error reading users Excel:', error);
    res.status(500).json({ success: false, message: 'Failed to read users data' });
  }
});

// Save users to Excel
router.post('/users', (req, res) => {
  try {
    const { users } = req.body;

    if (!Array.isArray(users)) {
      return res.status(400).json({ success: false, message: 'Users must be an array' });
    }

    const excelData = users.map(user => ({
      'User ID': user.id,
      'Name': user.name || '',
      'Email': user.email || '',
      'Phone': user.phone || '',
      'Address': user.address || '',
      'WhatsApp Opt In': user.whatsappOptIn ? 'Yes' : 'No',
      'Registered At': user.registeredAt || '',
      'Last Login': user.lastLoginAt || '',
      'Login Count': user.loginCount || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, USERS_EXCEL_PATH);

    console.log(`✅ Saved ${users.length} users to Excel: ${USERS_EXCEL_PATH}`);

    res.json({ 
      success: true, 
      message: `Successfully saved ${users.length} users to Excel`,
      count: users.length 
    });
  } catch (error) {
    console.error('Error saving users Excel:', error);
    res.status(500).json({ success: false, message: 'Failed to save users data' });
  }
});

export default router;

