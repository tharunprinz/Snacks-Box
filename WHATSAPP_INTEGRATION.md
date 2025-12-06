# WhatsApp Integration Guide

This guide will help you connect WhatsApp Business API to send daily specials and new arrivals to your customers.

## Prerequisites

1. **WhatsApp Business Account** - You need a WhatsApp Business Account
2. **Meta Business Account** - Create a Meta Business Account at [business.facebook.com](https://business.facebook.com)
3. **WhatsApp Business API Access** - Apply for WhatsApp Business API access

## Option 1: Using Meta WhatsApp Cloud API (Recommended)

### Step 1: Create Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Select "Business" type
4. Fill in app details and create

### Step 2: Add WhatsApp Product

1. In your app dashboard, click "Add Product"
2. Find "WhatsApp" and click "Set Up"
3. Follow the setup wizard

### Step 3: Get Access Token

1. Go to WhatsApp → API Setup
2. Copy your **Temporary Access Token** (for testing)
3. For production, create a **System User** and get a permanent token

### Step 4: Get Phone Number ID

1. In WhatsApp → API Setup
2. Copy your **Phone Number ID** (starts with numbers)

### Step 5: Configure in Your Backend

Create a backend service (Node.js/Express) with the following:

```javascript
// whatsapp-service.js
import axios from 'axios';

const WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0';
const PHONE_NUMBER_ID = 'YOUR_PHONE_NUMBER_ID';
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN';

export async function sendWhatsAppMessage(toPhone, message) {
  try {
    // Format phone number (remove +, spaces, etc.)
    const formattedPhone = toPhone.replace(/[^0-9]/g, '');
    
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: {
          body: message
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('WhatsApp API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Send to multiple customers
export async function sendBulkWhatsApp(customers, message) {
  const results = [];
  for (const customer of customers) {
    if (customer.whatsappOptIn && customer.phone) {
      try {
        await sendWhatsAppMessage(customer.phone, message);
        results.push({ customer: customer.id, status: 'success' });
        // Add delay to avoid rate limits (20 messages per second)
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.push({ customer: customer.id, status: 'failed', error: error.message });
      }
    }
  }
  return results;
}
```

### Step 6: Update Frontend PromoManager

In `src/components/PromoManager.jsx`, update the `handleSendWhatsApp` function:

```javascript
const handleSendWhatsApp = async () => {
  const customers = storage.getAllCustomers().filter(c => c.whatsappOptIn);
  const specials = menu.filter(item => promoData.dailySpecials.includes(item.id));
  const arrivals = menu.filter(item => promoData.newArrivals.includes(item.id));

  let message = `🎉 *SNACK BOX - Daily Specials & New Arrivals*\n\n`;
  
  if (specials.length > 0) {
    message += `⭐ *Daily Specials:*\n`;
    specials.forEach(item => {
      message += `• ${item.name} - ₹${item.price}\n`;
    });
    message += `\n`;
  }

  if (arrivals.length > 0) {
    message += `🆕 *New Arrivals:*\n`;
    arrivals.forEach(item => {
      message += `• ${item.name} - ₹${item.price}\n`;
    });
    message += `\n`;
  }

  message += `📍 Karpagam College of Engineering\n🕐 Everyday: 9:00 AM – 9:00 PM\n📞 +91-9500633444\n\nVisit us today! 🍽️\n\nThank you for being a valued customer! 💝`;

  try {
    // Call your backend API
    const response = await fetch('http://your-backend-url/api/whatsapp/send-bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customers: customers.map(c => ({ id: c.id, phone: c.phone })),
        message: message
      })
    });

    const result = await response.json();
    console.log('WhatsApp sent:', result);
    
    // Update promo card
    const updatedPromo = { ...promoData };
    storage.savePromo(updatedPromo);
    setPromoData(updatedPromo);

    setWhatsappSent(true);
    setTimeout(() => setWhatsappSent(false), 3000);
  } catch (error) {
    console.error('Failed to send WhatsApp:', error);
    alert('Failed to send WhatsApp messages. Please try again.');
  }
};
```

## Option 2: Using Twilio WhatsApp API

### Step 1: Create Twilio Account

1. Sign up at [twilio.com](https://www.twilio.com)
2. Get your Account SID and Auth Token
3. Enable WhatsApp Sandbox for testing

### Step 2: Install Twilio SDK

```bash
npm install twilio
```

### Step 3: Backend Implementation

```javascript
// whatsapp-twilio.js
import twilio from 'twilio';

const accountSid = 'YOUR_ACCOUNT_SID';
const authToken = 'YOUR_AUTH_TOKEN';
const client = twilio(accountSid, authToken);

export async function sendWhatsAppTwilio(toPhone, message) {
  try {
    const formattedPhone = `whatsapp:${toPhone}`;
    
    const message = await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio WhatsApp number
      to: formattedPhone,
      body: message
    });
    
    return message;
  } catch (error) {
    console.error('Twilio Error:', error);
    throw error;
  }
}
```

## Option 3: Using WhatsApp Business API via Service Providers

Popular providers:
- **360dialog** - [360dialog.com](https://www.360dialog.com)
- **ChatAPI** - [chatapi.com](https://www.chatapi.com)
- **Wati** - [wati.io](https://www.wati.io)

These providers offer easier setup and management.

## Environment Variables

Create a `.env` file in your backend:

```env
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_API_VERSION=v21.0
```

## Testing

1. **Test with your own number first**
2. **Use WhatsApp Sandbox** (Meta) or **Twilio Sandbox** for testing
3. **Verify message delivery**
4. **Check rate limits** (Meta: 1000 messages/day for free tier)

## Production Considerations

1. **Rate Limits**: Meta allows 1000 messages/day on free tier, upgrade for more
2. **Message Templates**: For production, create approved message templates
3. **Error Handling**: Implement retry logic for failed messages
4. **Logging**: Log all sent messages for debugging
5. **Opt-in Management**: Ensure customers have opted in to receive messages

## Message Template Approval (Meta)

For production, you need to:
1. Create message templates in Meta Business Manager
2. Submit for approval
3. Wait for approval (usually 24-48 hours)
4. Use template ID instead of free-form text

## Security Notes

- **Never expose access tokens** in frontend code
- **Always use backend API** to send WhatsApp messages
- **Store credentials securely** using environment variables
- **Implement authentication** for your backend API

## Support

- Meta WhatsApp API Docs: [developers.facebook.com/docs/whatsapp](https://developers.facebook.com/docs/whatsapp)
- Twilio WhatsApp Docs: [twilio.com/docs/whatsapp](https://www.twilio.com/docs/whatsapp)

## Quick Start Backend Example

```javascript
// server.js (Express)
import express from 'express';
import cors from 'cors';
import { sendBulkWhatsApp } from './whatsapp-service.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/whatsapp/send-bulk', async (req, res) => {
  try {
    const { customers, message } = req.body;
    const results = await sendBulkWhatsApp(customers, message);
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Backend server running on port 3001');
});
```

Install dependencies:
```bash
npm install express cors axios
```

Then update your frontend to call `http://localhost:3001/api/whatsapp/send-bulk` instead of the console.log.

