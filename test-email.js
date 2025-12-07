#!/usr/bin/env node

/**
 * Test script to verify email configuration
 * Run: node test-email.js
 */

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER || 'snackbox2121@gmail.com';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

console.log('🔍 Testing Email Configuration...\n');
console.log(`Email User: ${EMAIL_USER}`);
console.log(`Email Password: ${EMAIL_PASSWORD ? '✅ Set' : '❌ NOT SET'}\n`);

if (!EMAIL_PASSWORD) {
  console.error('❌ ERROR: EMAIL_PASSWORD is not set in .env file');
  console.error('\nTo fix this:');
  console.error('1. Go to: https://myaccount.google.com/security');
  console.error('2. Enable 2-Step Verification');
  console.error('3. Go to App passwords');
  console.error('4. Generate a new app password for "SNACK BOX API"');
  console.error('5. Add it to your .env file as: EMAIL_PASSWORD=your-16-char-password');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

console.log('📧 Testing email connection...\n');

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email verification failed!\n');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔧 Troubleshooting:');
      console.error('1. Make sure you\'re using a Gmail App Password, not your regular password');
      console.error('2. Verify 2-Step Verification is enabled on your Google account');
      console.error('3. Check that the App Password is correct in your .env file');
      console.error('4. Try generating a new App Password');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n🔧 Troubleshooting:');
      console.error('1. Check your internet connection');
      console.error('2. Verify Gmail service is accessible');
    }
    process.exit(1);
  } else {
    console.log('✅ Email service verified successfully!');
    console.log('✅ Your email configuration is correct.\n');
    console.log('You can now start the server with: npm run server');
    process.exit(0);
  }
});

