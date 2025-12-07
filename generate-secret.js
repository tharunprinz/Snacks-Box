#!/usr/bin/env node

/**
 * Generate a secure random secret for JWT
 * Run: node generate-secret.js
 */

import crypto from 'crypto';

const secret = crypto.randomBytes(32).toString('hex');

console.log('\n🔐 Generated JWT Secret:\n');
console.log(secret);
console.log('\n📋 Copy this to your Render environment variables as JWT_SECRET\n');

