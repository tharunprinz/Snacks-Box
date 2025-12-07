# WhatsApp & Email OTP Implementation Guide

This guide explains how to implement WhatsApp messaging and Email OTP functionality for the SNACK BOX application.

## Email OTP System

### Current Implementation

The frontend includes a mock email OTP system that:
- Generates 6-digit OTP codes
- Stores OTPs in localStorage (for development)
- Validates OTPs with expiration (10 minutes)
- Limits attempts (max 5 attempts per OTP)

### Backend Implementation Required

For production, you need a backend API with email sending capability.

#### 1. Install Required Packages

```bash
npm install nodemailer express jsonwebtoken
```

#### 2. Backend API Endpoints

Create the following endpoints:

**POST `/api/auth/send-otp`**
```javascript
// Send OTP to email
// Request body: { email: "user@example.com" }
// Response: { success: true, message: "OTP sent" }
```

**POST `/api/auth/verify-otp`**
```javascript
// Verify OTP
// Request body: { email: "user@example.com", otp: "123456" }
// Response: { success: true, token: "jwt_token" }
```

#### 3. Example Backend Code (Node.js/Express)

```javascript
// routes/auth.js
import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const router = express.Router();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER || 'snackbox2121@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Store OTPs (in production, use Redis or database)
const otpStore = new Map();

// Generate OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email required' });
  }

  const otp = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store OTP
  otpStore.set(email, {
    otp,
    expiresAt,
    attempts: 0,
  });

  // Send email
  const mailOptions = {
    from: process.env.EMAIL_USER || 'snackbox2121@gmail.com',
    to: email,
    subject: 'SNACK BOX - Your OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #AD703C;">SNACK BOX</h2>
        <h3>Your OTP Code</h3>
        <p>Your OTP code for SNACK BOX login is:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #AD703C; font-size: 36px; margin: 0;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          SNACK BOX<br>
          Karpagam College of Engineering<br>
          📞 +91-9500633444
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP required' });
  }

  const stored = otpStore.get(email);

  if (!stored) {
    return res.status(400).json({ success: false, message: 'OTP not found' });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  if (stored.attempts >= 5) {
    otpStore.delete(email);
    return res.status(400).json({ success: false, message: 'Too many attempts' });
  }

  stored.attempts++;

  if (stored.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  // OTP verified - generate JWT token
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  otpStore.delete(email);
  
  res.json({ success: true, token });
});

export default router;
```

#### 4. Update Frontend to Use Backend API

Update `src/utils/emailOTP.js`:

```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';

export async function generateAndStoreOTP(email) {
  const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message);
  }
  
  return result;
}

export async function verifyOTP(email, otp) {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  
  const result = await response.json();
  return result;
}
```

## WhatsApp Integration

### Current Implementation

The frontend includes a mock WhatsApp sending function that:
- Reads user data from Excel (with localStorage fallback)
- Filters users who opted in for WhatsApp
- Formats messages for daily specials and new arrivals
- Logs messages to console (for development)

### Backend Implementation Required

For production, you need a WhatsApp Business API integration.

#### Option 1: WhatsApp Business Cloud API (Recommended)

1. **Setup WhatsApp Business Account**
   - Go to https://business.facebook.com/
   - Create a Meta Business Account
   - Set up WhatsApp Business API

2. **Get API Credentials**
   - Access Token
   - Phone Number ID
   - Business Account ID

3. **Backend API Endpoint**

```javascript
// routes/whatsapp.js
import express from 'express';

const router = express.Router();

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Send WhatsApp message
router.post('/send', async (req, res) => {
  const { phone, message } = req.body;

  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone,
          type: 'text',
          text: { body: message },
        }),
      }
    );

    const result = await response.json();
    
    if (result.error) {
      return res.status(400).json({ success: false, error: result.error });
    }

    res.json({ success: true, messageId: result.messages[0].id });
  } catch (error) {
    console.error('WhatsApp API error:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

// Send bulk messages
router.post('/send-bulk', async (req, res) => {
  const { customers, message } = req.body;

  const results = [];
  
  for (const customer of customers) {
    try {
      const response = await fetch(
        `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: customer.phone,
            type: 'text',
            text: { body: message },
          }),
        }
      );

      const result = await response.json();
      results.push({
        customer: customer.name,
        phone: customer.phone,
        success: !result.error,
        error: result.error,
      });
    } catch (error) {
      results.push({
        customer: customer.name,
        phone: customer.phone,
        success: false,
        error: error.message,
      });
    }
  }

  res.json({ success: true, results });
});

export default router;
```

#### Option 2: Twilio WhatsApp API

```javascript
// Install: npm install twilio

import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

router.post('/send', async (req, res) => {
  const { phone, message } = req.body;

  try {
    const result = await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio WhatsApp number
      to: `whatsapp:${phone}`,
      body: message,
    });

    res.json({ success: true, messageId: result.sid });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

#### 3. Update Frontend to Use Backend API

Update `src/components/PromoManager.jsx`:

```javascript
const handleSendWhatsApp = async () => {
  try {
    const customers = await getUsersFromExcel();
    const optedInCustomers = customers.filter(c => c.whatsappOptIn && c.phone);
    
    if (optedInCustomers.length === 0) {
      showToast('No customers with WhatsApp opt-in found', 'error');
      return;
    }

    // Format message
    let message = `🎉 *SNACK BOX - Daily Specials & New Arrivals*\n\n...`;

    // Call backend API
    const response = await fetch('http://your-backend-url/api/whatsapp/send-bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customers: optedInCustomers.map(c => ({
          id: c.id,
          phone: c.phone,
          name: c.name,
        })),
        message: message,
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      showToast(`WhatsApp sent to ${optedInCustomers.length} customers! 📱`, 'success');
    } else {
      showToast('Failed to send WhatsApp messages', 'error');
    }
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    showToast('Failed to send WhatsApp messages', 'error');
  }
};
```

## Environment Variables

Create a `.env` file in your backend:

```env
# Email Configuration
EMAIL_USER=snackbox2121@gmail.com
EMAIL_PASSWORD=your-app-password

# JWT Secret
JWT_SECRET=your-secret-key

# WhatsApp Configuration (Option 1: Meta)
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-access-token

# WhatsApp Configuration (Option 2: Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token

# API URL
API_URL=http://localhost:3000
```

## Testing

### Email OTP Testing
1. Use a test email service like Mailtrap or Ethereal Email
2. Check email inbox for OTP codes
3. Verify OTP codes work correctly

### WhatsApp Testing
1. Use WhatsApp Business API test numbers
2. Send test messages to your own WhatsApp number
3. Verify message formatting is correct

## Production Considerations

1. **Rate Limiting**: Implement rate limiting for OTP requests
2. **Error Handling**: Add comprehensive error handling
3. **Logging**: Log all OTP and WhatsApp operations
4. **Security**: Use HTTPS, validate inputs, sanitize data
5. **Monitoring**: Monitor API usage and costs
6. **Backup**: Store OTPs and messages in database for audit

## Cost Considerations

- **Email**: Free (Gmail) or low cost (SendGrid, Mailgun)
- **WhatsApp Business API**: Pay per message (varies by region)
- **Twilio**: Pay per message (check current pricing)

## Support

For issues or questions:
- Check API documentation
- Review error logs
- Test with sample data
- Contact service providers for API issues

