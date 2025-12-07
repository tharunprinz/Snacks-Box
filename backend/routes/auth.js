import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const router = express.Router();

// In-memory OTP store (in production, use Redis or database)
const otpStore = new Map();

// Lazy transporter creation - only create when needed
let transporter = null;

function getTransporter() {
  if (!transporter) {
    const emailUser = process.env.EMAIL_USER || 'snackbox2121@gmail.com';
    const emailPassword = process.env.EMAIL_PASSWORD;
    
    if (!emailPassword) {
      throw new Error('EMAIL_PASSWORD is not set in .env file');
    }
    
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
  }
  return transporter;
}

// Verify email configuration (called after server starts)
export function verifyEmailConfig() {
  if (!process.env.EMAIL_PASSWORD) {
    console.warn('⚠️  WARNING: EMAIL_PASSWORD is not set in .env file');
    console.warn('⚠️  Email sending will fail. Please set EMAIL_PASSWORD in your .env file');
    return;
  }

  try {
    const trans = getTransporter();
    trans.verify((error, success) => {
      if (error) {
        console.error('❌ Email service verification failed:', error.message);
        if (error.code === 'EAUTH') {
          console.error('❌ Authentication failed. Please check:');
          console.error('   1. EMAIL_USER is correct in .env');
          console.error('   2. EMAIL_PASSWORD is a valid Gmail App Password (not your regular password)');
          console.error('   3. 2-Step Verification is enabled on your Google account');
        }
      } else {
        console.log('✅ Email service verified and ready');
      }
    });
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error.message);
  }
}

// Generate 6-digit OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Clean expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(email);
    }
  }
}, 60000); // Clean every minute

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  // Ensure we always send JSON responses
  res.setHeader('Content-Type', 'application/json');
  
  // Add timeout to prevent hanging requests
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Request timeout. Please try again.'
      });
    }
  }, 30000); // 30 second timeout
  
  try {
    console.log('📧 OTP request received for:', req.body?.email || 'unknown');
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check rate limiting (max 3 OTPs per email per hour)
    const existingOTP = otpStore.get(email);
    if (existingOTP && existingOTP.lastSent) {
      const timeSinceLastSent = Date.now() - existingOTP.lastSent;
      if (timeSinceLastSent < 60000) { // 1 minute cooldown
        return res.status(429).json({
          success: false,
          message: 'Please wait before requesting another OTP'
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore.set(email, {
      otp,
      expiresAt,
      attempts: 0,
      lastSent: Date.now()
    });

    // Email template
    const mailOptions = {
      from: `"SNACK BOX" <${process.env.EMAIL_USER || 'snackbox2121@gmail.com'}>`,
      to: email,
      subject: 'SNACK BOX - Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #AD703C; margin: 0;">SNACK BOX</h2>
            <p style="color: #666; margin: 5px 0;">Your OTP Code</p>
          </div>
          
          <div style="background: #f5f5f5; padding: 30px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <h1 style="color: #AD703C; font-size: 48px; margin: 0; letter-spacing: 10px; font-weight: bold;">${otp}</h1>
          </div>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Your OTP code for SNACK BOX login is shown above. This code will expire in <strong>10 minutes</strong>.
          </p>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            If you didn't request this code, please ignore this email. Your account remains secure.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <div style="text-align: center; color: #999; font-size: 12px;">
            <p style="margin: 5px 0;"><strong>SNACK BOX</strong></p>
            <p style="margin: 5px 0;">Karpagam College of Engineering</p>
            <p style="margin: 5px 0;">📞 +91-9500633444</p>
          </div>
        </div>
      `,
      text: `
        SNACK BOX - Your OTP Code
        
        Your OTP code for SNACK BOX login is: ${otp}
        
        This code will expire in 10 minutes.
        
        If you didn't request this code, please ignore this email.
        
        ---
        SNACK BOX
        Karpagam College of Engineering
        📞 +91-9500633444
      `
    };

    // Send email
    let trans;
    try {
      trans = getTransporter();
    } catch (transporterError) {
      console.error('Failed to get transporter:', transporterError);
      return res.status(500).json({
        success: false,
        message: transporterError.message || 'Email service not configured. Please set EMAIL_PASSWORD in your .env file.'
      });
    }
    
    await trans.sendMail(mailOptions);

    console.log(`✅ OTP sent to ${email}`);

    clearTimeout(timeout);
    res.json({
      success: true,
      message: 'OTP sent successfully to your email'
    });
  } catch (error) {
    clearTimeout(timeout);
    console.error('Error sending OTP email:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    
    // Provide specific error messages
    if (error.code === 'EAUTH') {
      return res.status(500).json({
        success: false,
        message: 'Email authentication failed. Please check your Gmail App Password in the .env file. Make sure you\'re using an App Password, not your regular Gmail password.'
      });
    }

    if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      return res.status(500).json({
        success: false,
        message: 'Cannot connect to email service. Please check your internet connection.'
      });
    }

    if (!process.env.EMAIL_PASSWORD) {
      return res.status(500).json({
        success: false,
        message: 'Email service not configured. Please set EMAIL_PASSWORD in your .env file.'
      });
    }

    // Ensure we always send a response, even if something goes wrong
    if (!res.headersSent) {
      console.error('❌ Sending error response for send-otp');
      res.status(500).json({
        success: false,
        message: `Failed to send OTP: ${error.message || 'Unknown error'}. Please check server logs for details.`
      });
    } else {
      console.error('⚠️  Response already sent, cannot send error response');
    }
  } finally {
    clearTimeout(timeout);
  }
});

// Test email configuration endpoint
router.get('/test-email', async (req, res) => {
  try {
    if (!process.env.EMAIL_PASSWORD) {
      return res.status(500).json({
        success: false,
        message: 'EMAIL_PASSWORD is not set in .env file'
      });
    }

    // Try to verify the transporter
    const trans = getTransporter();
    await trans.verify();
    
    res.json({
      success: true,
      message: 'Email service is configured correctly',
      emailUser: process.env.EMAIL_USER || 'snackbox2121@gmail.com'
    });
  } catch (error) {
    console.error('Email test failed:', error);
    res.status(500).json({
      success: false,
      message: `Email configuration error: ${error.message}`,
      code: error.code,
      details: error.code === 'EAUTH' 
        ? 'Please check your Gmail App Password. Make sure you\'re using an App Password, not your regular password.'
        : error.message
    });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  // Ensure we always send JSON responses
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Get stored OTP data
    const stored = otpStore.get(email);

    if (!stored) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'OTP not found. Please request a new one.'
      });
    }

    // Check expiration
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check attempts (max 5 attempts)
    if (stored.attempts >= 5) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Too many attempts. Please request a new OTP.'
      });
    }

    // Increment attempts
    stored.attempts += 1;

    // Verify OTP
    if (stored.otp !== otp) {
      otpStore.set(email, stored);
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Invalid OTP. ${5 - stored.attempts} attempts remaining.`
      });
    }

    // OTP verified successfully
    otpStore.delete(email);

    // Generate JWT token (optional, for session management)
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || 'snackbox-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    console.log(`✅ OTP verified for ${email}`);

    res.json({
      success: true,
      valid: true,
      message: 'OTP verified successfully!',
      token: token
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    // Ensure we always send a response
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        valid: false,
        message: 'Failed to verify OTP. Please try again.'
      });
    }
  }
});

export default router;

