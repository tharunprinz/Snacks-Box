// Email OTP Service
// Calls backend API for OTP generation and verification

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Generate and send OTP via backend API
export async function generateAndStoreOTP(email) {
  try {
    console.log('📧 Sending OTP request to:', `${API_BASE_URL}/auth/send-otp`);
    console.log('📧 Email:', email);
    
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    console.log('📧 Response status:', response.status);
    console.log('📧 Response ok:', response.ok);
    console.log('📧 Response headers:', Object.fromEntries(response.headers.entries()));

    // Check if response has content
    const contentType = response.headers.get('content-type');
    const text = await response.text();
    
    console.log('📧 Response text length:', text?.length || 0);
    console.log('📧 Response text:', text?.substring(0, 200) || 'empty');
    
    // Try to parse JSON only if content-type indicates JSON or if text is not empty
    let result;
    if (!text || text.trim() === '') {
      // Check if it's a connection error
      if (!response.ok && response.status === 0) {
        throw new Error('Cannot connect to server. Please start the backend server with: npm run server');
      }
      throw new Error('Server returned empty response. Please check if the backend server is running on port 3000. Start it with: npm run server');
    }
    
    try {
      result = JSON.parse(text);
    } catch (parseError) {
      // If response is not JSON, it's likely an error
      throw new Error(`Server error: ${text || 'Invalid response format'}`);
    }

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to send OTP');
    }

    return result;
  } catch (error) {
    console.error('Error sending OTP:', error);
    
    // Handle JSON parsing errors
    if (error.message.includes('Unexpected end of JSON input') || error.message.includes('JSON')) {
      throw new Error('Server returned invalid response. Please check if the backend server is running and configured correctly.');
    }
    
    // If backend is not available, show helpful error
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.name === 'TypeError' || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please start the backend server in a terminal with: npm run server (then keep that terminal open)');
    }
    
    // Re-throw with original message if it's already a user-friendly error
    if (error.message && !error.message.includes('Failed to fetch')) {
      throw error;
    }
    
    throw new Error(error.message || 'Failed to send OTP. Please try again.');
  }
}

// Verify OTP via backend API
export async function verifyOTP(email, otp) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    // Check if response has content
    const text = await response.text();
    
    let result;
    if (!text || text.trim() === '') {
      return {
        valid: false,
        message: 'Server returned empty response. Please check if the backend server is running.',
      };
    }
    
    try {
      result = JSON.parse(text);
    } catch (parseError) {
      return {
        valid: false,
        message: `Server error: ${text || 'Invalid response format'}`,
      };
    }

    if (!response.ok) {
      return {
        valid: result.valid || false,
        message: result.message || 'OTP verification failed',
      };
    }

    return {
      valid: result.valid || true,
      message: result.message || 'OTP verified successfully!',
      token: result.token, // JWT token if provided
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    
    // Handle JSON parsing errors
    if (error.message.includes('Unexpected end of JSON input') || error.message.includes('JSON')) {
      return {
        valid: false,
        message: 'Server returned invalid response. Please check if the backend server is running.',
      };
    }
    
    // If backend is not available, show helpful error
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return {
        valid: false,
        message: 'Cannot connect to server. Please make sure the backend server is running.',
      };
    }
    
    return {
      valid: false,
      message: error.message || 'Failed to verify OTP. Please try again.',
    };
  }
}

// Backend API endpoint example (Node.js/Express):
/*
// routes/auth.js
import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configure email transporter (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'snackbox2121@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  
  // Store OTP in database with expiration
  await storeOTP(email, otp);
  
  // Send email
  const mailOptions = {
    from: process.env.EMAIL_USER || 'snackbox2121@gmail.com',
    to: email,
    subject: 'SNACK BOX - Your OTP Code',
    html: `
      <h2>Your OTP Code</h2>
      <p>Your OTP code for SNACK BOX login is:</p>
      <h1 style="color: #AD703C; font-size: 32px;">${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    `,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to send OTP' });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const isValid = await verifyOTPFromDB(email, otp);
  
  if (isValid) {
    // Generate JWT token
    const token = generateJWT({ email });
    res.json({ success: true, token });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

export default router;
*/

