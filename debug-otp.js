#!/usr/bin/env node

/**
 * Debug script to test OTP sending
 * Run: node debug-otp.js your-email@example.com
 * 
 * Note: Requires Node.js 18+ for built-in fetch, or install node-fetch
 */

import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3000';
const testEmail = process.argv[2] || process.env.TEST_EMAIL || 'test@example.com';

console.log('🔍 Testing OTP API...\n');
console.log(`API URL: ${API_URL}`);
console.log(`Test Email: ${testEmail}\n`);

// Use global fetch if available (Node 18+), otherwise show instructions
if (typeof fetch === 'undefined') {
  console.log('⚠️  This script requires Node.js 18+ or node-fetch package');
  console.log('\nAlternatively, test using curl:');
  console.log(`\n1. Health check:`);
  console.log(`   curl ${API_URL}/api/health`);
  console.log(`\n2. Test email config:`);
  console.log(`   curl ${API_URL}/api/auth/test-email`);
  console.log(`\n3. Send OTP:`);
  console.log(`   curl -X POST ${API_URL}/api/auth/send-otp \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '{"email":"${testEmail}"}'`);
  process.exit(1);
}

async function testOTP() {
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthRes = await fetch(`${API_URL}/api/health`);
    const healthData = await healthRes.json();
    console.log('   ✅ Health check:', healthData);
    console.log('   Email configured:', healthData.emailConfigured ? '✅' : '❌');
    console.log('');

    // Test 2: Email configuration test
    console.log('2. Testing email configuration...');
    try {
      const emailTestRes = await fetch(`${API_URL}/api/auth/test-email`);
      const emailTestData = await emailTestRes.json();
      if (emailTestData.success) {
        console.log('   ✅ Email service:', emailTestData.message);
      } else {
        console.log('   ❌ Email service error:', emailTestData.message);
        if (emailTestData.details) {
          console.log('   Details:', emailTestData.details);
        }
      }
    } catch (err) {
      console.log('   ❌ Cannot test email:', err.message);
    }
    console.log('');

    // Test 3: Send OTP
    console.log('3. Testing OTP send...');
    const otpRes = await fetch(`${API_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail }),
    });

    const otpData = await otpRes.json();
    
    if (otpRes.ok && otpData.success) {
      console.log('   ✅ OTP sent successfully!');
      console.log('   Message:', otpData.message);
      console.log('\n   📧 Check your email inbox for the OTP code!');
    } else {
      console.log('   ❌ Failed to send OTP');
      console.log('   Status:', otpRes.status);
      console.log('   Error:', otpData.message || otpData.error);
      if (otpData.details) {
        console.log('   Details:', otpData.details);
      }
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n   Server is not running!');
      console.error('   Start it with: npm run server');
    }
  }
}

testOTP();

