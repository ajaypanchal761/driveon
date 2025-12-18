/**
 * Test Razorpay Keys Configuration
 * Run this script to verify your Razorpay API keys are correct
 * 
 * Usage: node scripts/testRazorpayKeys.js
 */

import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('\n🔍 Testing Razorpay Configuration...\n');

// Check if keys are set
const keyId = process.env.RAZORPAY_KEY_ID?.trim();
const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

console.log('📋 Environment Check:');
console.log(`   RAZORPAY_KEY_ID: ${keyId ? `✓ Set (${keyId.length} chars)` : '✗ Missing'}`);
console.log(`   RAZORPAY_KEY_SECRET: ${keySecret ? `✓ Set (${keySecret.length} chars)` : '✗ Missing'}`);

if (!keyId || !keySecret) {
  console.error('\n❌ ERROR: Razorpay keys are missing!');
  console.error('   Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file');
  process.exit(1);
}

// Validate key format
console.log('\n🔐 Key Format Validation:');
const issues = [];

if (!keyId.startsWith('rzp_')) {
  issues.push('⚠️  RAZORPAY_KEY_ID should start with "rzp_"');
  console.log('   ⚠️  Key ID format may be incorrect');
} else {
  console.log('   ✓ Key ID format looks correct');
}

if (keyId.length < 20) {
  issues.push('⚠️  RAZORPAY_KEY_ID seems too short');
  console.log('   ⚠️  Key ID seems too short');
}

if (keySecret.length < 20) {
  issues.push('⚠️  RAZORPAY_KEY_SECRET seems too short');
  console.log('   ⚠️  Key Secret seems too short');
}

if (keyId.includes(' ') || keySecret.includes(' ')) {
  issues.push('⚠️  Keys contain spaces (should be trimmed)');
  console.log('   ⚠️  Keys contain spaces');
}

// Check for hidden characters
if (keyId && /[\r\n\t]/.test(keyId)) {
  issues.push('⚠️  Key ID contains hidden characters (newlines/tabs)');
  console.log('   ⚠️  Key ID contains hidden characters');
}

if (keySecret && /[\r\n\t]/.test(keySecret)) {
  issues.push('⚠️  Key Secret contains hidden characters (newlines/tabs)');
  console.log('   ⚠️  Key Secret contains hidden characters');
}

// Show first and last few characters for verification
if (keyId && keySecret) {
  console.log('\n🔑 Key Verification (first/last chars):');
  console.log(`   Key ID: ${keyId.substring(0, 8)}...${keyId.substring(keyId.length - 4)}`);
  console.log(`   Key Secret: ${keySecret.substring(0, 6)}...${keySecret.substring(keySecret.length - 4)}`);
}

// Test Razorpay connection
console.log('\n🔌 Testing Razorpay Connection:');
try {
  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  // Try to create a test order (will fail but will verify authentication)
  console.log('   Attempting to verify authentication...');
  
  // Try to fetch account details or create a minimal test order
  const testOrder = await razorpay.orders.create({
    amount: 100, // 1 rupee in paise
    currency: 'INR',
    receipt: `test_${Date.now()}`,
    payment_capture: 1,
  });

  console.log('   ✅ Authentication successful!');
  console.log(`   ✅ Test order created: ${testOrder.id}`);
  console.log('\n✅ SUCCESS: Razorpay keys are valid and working!\n');
  
  // Cancel the test order (optional)
  // Note: Razorpay doesn't have a cancel API, but test orders are harmless
  
} catch (error) {
  console.error('\n❌ Authentication Failed!');
  console.error(`   Status Code: ${error.statusCode || 'N/A'}`);
  console.error(`   Error Code: ${error.error?.code || 'N/A'}`);
  console.error(`   Description: ${error.error?.description || error.message}`);
  
  if (error.statusCode === 401) {
    console.error('\n💡 Possible Issues:');
    console.error('   1. Keys are incorrect or expired');
    console.error('   2. Keys are from test account but using live mode (or vice versa)');
    console.error('   3. Keys have extra spaces or special characters');
    console.error('   4. Account is suspended or inactive');
    console.error('\n   Solution:');
    console.error('   - Check your Razorpay dashboard: https://dashboard.razorpay.com/');
    console.error('   - Verify you are using the correct Key ID and Key Secret');
    console.error('   - Make sure keys are from the same environment (test/live)');
    console.error('   - Remove any spaces or quotes from keys in .env file');
  }
  
  if (issues.length > 0) {
    console.error('\n⚠️  Additional Issues Found:');
    issues.forEach(issue => console.error(`   ${issue}`));
  }
  
  process.exit(1);
}

