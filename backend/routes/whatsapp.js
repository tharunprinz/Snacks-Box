import express from 'express';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to users Excel file
// Use environment variable for production, or default to local path
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../data');
const USERS_EXCEL_PATH = path.join(DATA_DIR, 'users_data.xlsx');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log(`✅ Created data directory: ${DATA_DIR}`);
}

// Read users from Excel who opted in for WhatsApp
function getWhatsAppUsers() {
  try {
    if (!fs.existsSync(USERS_EXCEL_PATH)) {
      return [];
    }

    const workbook = XLSX.readFile(USERS_EXCEL_PATH);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const usersData = XLSX.utils.sheet_to_json(worksheet);

    return usersData
      .filter(user => {
        const optedIn = user['WhatsApp Opt In'] === 'Yes' || user.whatsappOptIn === true;
        const hasPhone = user.Phone || user.phone;
        return optedIn && hasPhone;
      })
      .map(user => ({
        id: user['User ID'] || user.id,
        name: user.Name || user.name || '',
        phone: user.Phone || user.phone || '',
        email: user.Email || user.email || '',
      }));
  } catch (error) {
    console.error('Error reading WhatsApp users:', error);
    return [];
  }
}

// Send WhatsApp message to customers
router.post('/send', async (req, res) => {
  try {
    const { message, customerIds } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get customers from Excel
    const allCustomers = getWhatsAppUsers();
    
    // Filter by customerIds if provided, otherwise send to all
    const customers = customerIds && customerIds.length > 0
      ? allCustomers.filter(c => customerIds.includes(c.id))
      : allCustomers;

    if (customers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No customers with WhatsApp opt-in found'
      });
    }

    // In production, integrate with WhatsApp Business API
    // For now, log the messages (you'll need to implement actual WhatsApp sending)
    const results = [];
    
    for (const customer of customers) {
      try {
        // TODO: Replace with actual WhatsApp API call
        // Example with WhatsApp Business API:
        /*
        const response = await fetch(
          `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: customer.phone.replace(/\D/g, ''), // Remove non-digits
              type: 'text',
              text: { body: message },
            }),
          }
        );
        
        const result = await response.json();
        */
        
        // For now, just log
        console.log(`📱 WhatsApp to ${customer.name} (${customer.phone}):`);
        console.log(message);
        
        results.push({
          customerId: customer.id,
          name: customer.name,
          phone: customer.phone,
          success: true,
          message: 'Message logged (WhatsApp API not configured)'
        });
      } catch (error) {
        console.error(`Error sending to ${customer.name}:`, error);
        results.push({
          customerId: customer.id,
          name: customer.name,
          phone: customer.phone,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;

    res.json({
      success: true,
      message: `WhatsApp messages processed: ${successCount}/${customers.length}`,
      total: customers.length,
      successful: successCount,
      failed: customers.length - successCount,
      results: results
    });
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send WhatsApp messages',
      error: error.message
    });
  }
});

// Send daily specials and new arrivals
router.post('/send-specials', async (req, res) => {
  try {
    const { dailySpecials, newArrivals, menu } = req.body;

    if ((!dailySpecials || dailySpecials.length === 0) && 
        (!newArrivals || newArrivals.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'No specials or arrivals to send'
      });
    }

    // Get customers from Excel
    const customers = getWhatsAppUsers();

    if (customers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No customers with WhatsApp opt-in found'
      });
    }

    // Build message
    let message = `🎉 *SNACK BOX - Daily Specials & New Arrivals*\n\n`;
    
    if (dailySpecials && dailySpecials.length > 0) {
      const specialItems = menu.filter(item => dailySpecials.includes(item.id));
      if (specialItems.length > 0) {
        message += `⭐ *Daily Specials:*\n`;
        specialItems.forEach(item => {
          message += `• ${item.name} - ₹${item.price}\n`;
        });
        message += `\n`;
      }
    }

    if (newArrivals && newArrivals.length > 0) {
      const arrivalItems = menu.filter(item => newArrivals.includes(item.id));
      if (arrivalItems.length > 0) {
        message += `🆕 *New Arrivals:*\n`;
        arrivalItems.forEach(item => {
          message += `• ${item.name} - ₹${item.price}\n`;
        });
        message += `\n`;
      }
    }

    message += `📍 Karpagam College of Engineering\n🕐 Everyday: 9:00 AM – 9:00 PM\n📞 +91-9500633444\n\nVisit us today! 🍽️\n\nThank you for being a valued customer! 💝`;

    // Send to all customers
    const results = [];
    for (const customer of customers) {
      try {
        // TODO: Replace with actual WhatsApp API call
        console.log(`📱 WhatsApp to ${customer.name} (${customer.phone}):`);
        console.log(message);
        
        results.push({
          customerId: customer.id,
          name: customer.name,
          phone: customer.phone,
          success: true
        });
      } catch (error) {
        results.push({
          customerId: customer.id,
          name: customer.name,
          phone: customer.phone,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;

    res.json({
      success: true,
      message: `Daily specials sent to ${successCount} customers via WhatsApp`,
      total: customers.length,
      successful: successCount,
      failed: customers.length - successCount
    });
  } catch (error) {
    console.error('Error sending specials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send daily specials',
      error: error.message
    });
  }
});

export default router;

