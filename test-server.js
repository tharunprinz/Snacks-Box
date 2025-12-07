#!/usr/bin/env node

/**
 * Quick test script to verify server is working
 * Run: node test-server.js
 */

const API_URL = 'http://localhost:3000/api';

async function testServer() {
  console.log('🧪 Testing SNACK BOX API Server...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthRes = await fetch(`${API_URL}/health`);
    if (healthRes.ok) {
      const healthData = await healthRes.json();
      console.log('   ✅ Server is running');
      console.log('   Email configured:', healthData.emailConfigured ? '✅' : '❌');
    } else {
      console.log('   ❌ Server returned error:', healthRes.status);
      return;
    }

    // Test 2: Send OTP
    console.log('\n2. Testing send-otp endpoint...');
    const otpRes = await fetch(`${API_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    const otpText = await otpRes.text();
    console.log('   Status:', otpRes.status);
    console.log('   Response:', otpText.substring(0, 200));

    if (otpText) {
      try {
        const otpData = JSON.parse(otpText);
        if (otpData.success) {
          console.log('   ✅ OTP sent successfully!');
        } else {
          console.log('   ❌ Error:', otpData.message);
        }
      } catch (e) {
        console.log('   ❌ Invalid JSON response:', otpText);
      }
    } else {
      console.log('   ❌ Empty response from server');
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n   Server is not running!');
      console.error('   Start it with: npm run server');
    }
  }
}

// Use global fetch if available (Node 18+)
if (typeof fetch === 'undefined') {
  console.log('⚠️  This script requires Node.js 18+ for built-in fetch');
  console.log('\nAlternatively, test using curl:');
  console.log(`\n1. Health check:`);
  console.log(`   curl ${API_URL}/health`);
  console.log(`\n2. Send OTP:`);
  console.log(`   curl -X POST ${API_URL}/auth/send-otp \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '{"email":"test@example.com"}'`);
  process.exit(1);
}

testServer();

