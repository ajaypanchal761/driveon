/**
 * Test Script: Send OTP to a specific phone number via SMSIndia Hub
 * Usage: node scripts/sendTestOTP.js <phone_number> [otp]
 * Example: node scripts/sendTestOTP.js 7610416911
 * Example: node scripts/sendTestOTP.js 7610416911 123456
 */

import dotenv from 'dotenv';
import smsIndiaHubService from '../services/smsIndiaHubService.js';

// Load environment variables
dotenv.config();

const phoneNumber = process.argv[2];
const customOTP = process.argv[3];

if (!phoneNumber) {
  console.error('❌ Error: Phone number is required');
  console.log('\nUsage: node scripts/sendTestOTP.js <phone_number> [otp]');
  console.log('Example: node scripts/sendTestOTP.js 7610416911');
  console.log('Example: node scripts/sendTestOTP.js 7610416911 123456');
  process.exit(1);
}

// Generate OTP if not provided
const otp = customOTP || Math.floor(100000 + Math.random() * 900000).toString();

async function sendTestOTP() {
  try {
    console.log('\n📱 SMSIndia Hub OTP Test');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Phone Number: ${phoneNumber}`);
    console.log(`OTP: ${otp}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check if SMSIndia Hub is configured
    if (!smsIndiaHubService.isConfigured()) {
      console.error('❌ SMSIndia Hub is not configured!');
      console.error('Please check your .env file for:');
      console.error('  - SMSINDIAHUB_API_KEY');
      console.error('  - SMSINDIAHUB_SENDER_ID');
      process.exit(1);
    }

    console.log('📤 Sending OTP via SMSIndia Hub...\n');

    // Send OTP
    const result = await smsIndiaHubService.sendOTP(phoneNumber, otp, 'register');

    console.log('\n✅ OTP Sent Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Response Details:');
    console.log(`  Status: ${result.status}`);
    console.log(`  Message ID: ${result.messageId}`);
    console.log(`  Provider: ${result.provider}`);
    console.log(`  To: ${result.to}`);
    console.log(`  Message: ${result.body}`);
    if (result.jobId) {
      console.log(`  Job ID: ${result.jobId}`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log(`✅ OTP ${otp} has been sent to ${phoneNumber}`);
    console.log('Please check the phone for the SMS.\n');

  } catch (error) {
    console.error('\n❌ Failed to send OTP');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`Error: ${error.message}`);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    if (error.message.includes('Template')) {
      console.log('💡 Tip: You may need to:');
      console.log('   1. Register a DLT template in SMSIndia Hub dashboard');
      console.log('   2. Add SMSINDIAHUB_TEMPLATE_ID to your .env file');
      console.log('   3. Or use promotional SMS (not recommended): SMSINDIAHUB_USE_PROMOTIONAL=true\n');
    }
    
    process.exit(1);
  }
}

// Run the test
sendTestOTP();

