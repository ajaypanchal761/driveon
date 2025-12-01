import smsIndiaHubService from '../services/smsIndiaHubService.js';

/**
 * OTP Service
 * Handles OTP generation, storage, and sending via SMS
 */

/**
 * Test phone numbers for development/testing
 * These numbers will receive default OTP without sending SMS
 */
const TEST_PHONE_NUMBERS = {
  '9993911855': '123456', // Default test OTP
  '9685974247': '123456', // Default test OTP
  '7610416911': '110211', // Custom OTP for this number
  '6268455485': '110211', // Custom OTP for this number
  '9755262071': '110211', // Custom OTP for this number
};

/**
 * Check if a phone number is a test number
 * @param {string} phone - Phone number to check
 * @returns {boolean} - True if it's a test number
 */
export const isTestPhoneNumber = (phone) => {
  if (!phone) return false;
  // Remove all non-digit characters for comparison
  const normalizedPhone = phone.replace(/\D/g, '');
  // Check if it ends with any test number (handles cases with country code)
  return Object.keys(TEST_PHONE_NUMBERS).some(testNum => normalizedPhone.endsWith(testNum));
};

/**
 * Get test OTP for a phone number
 * @param {string} phone - Phone number
 * @returns {string|null} - Test OTP if it's a test number, null otherwise
 */
export const getTestOTP = (phone) => {
  if (!phone) return null;
  // Remove all non-digit characters for comparison
  const normalizedPhone = phone.replace(/\D/g, '');
  // Find matching test number
  for (const testNum of Object.keys(TEST_PHONE_NUMBERS)) {
    if (normalizedPhone.endsWith(testNum)) {
      return TEST_PHONE_NUMBERS[testNum];
    }
  }
  return null;
};

/**
 * Generate 6-digit OTP
 * @param {string} phone - Optional phone number (for test numbers)
 * @returns {string} - 6-digit OTP
 */
export const generateOTP = (phone = null) => {
  // If it's a test phone number, return the configured test OTP
  if (phone && isTestPhoneNumber(phone)) {
    const testOTP = getTestOTP(phone);
    if (testOTP) {
      return testOTP;
    }
    // Fallback to default test OTP
    return '123456';
  }
  
  // Generate random 6-digit OTP
  const length = 6;
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate OTP expiry time (default: 10 minutes)
 * @param {number} minutes - Expiry time in minutes
 * @returns {Date} - Expiry date
 */
export const getOTPExpiry = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

/**
 * Check if OTP is expired
 * @param {Date} expiresAt - OTP expiry date
 * @returns {boolean} - True if expired
 */
export const isOTPExpired = (expiresAt) => {
  if (!expiresAt) return true;
  return new Date() > new Date(expiresAt);
};

/**
 * Send OTP via SMS using SMSIndia Hub
 * @param {string} phone - Phone number to send SMS to
 * @param {string} otp - OTP code to send
 * @returns {Promise<Object>} - Response object
 */
export const sendOTP = async (phone, otp) => {
  try {
    // Skip SMS sending for test phone numbers
    if (isTestPhoneNumber(phone)) {
      const testOTP = getTestOTP(phone) || otp;
      console.log(`🧪 Test phone number detected: ${phone}`);
      console.log(`🧪 Skipping SMS send. OTP for testing: ${testOTP}`);
      return {
        success: true,
        messageId: `test_${Date.now()}`,
        status: 'skipped',
        to: phone,
        body: `Test OTP: ${testOTP}`,
        provider: 'Test Mode',
        isTest: true,
      };
    }
    
    console.log(`📱 Attempting to send OTP ${otp} to phone: ${phone}`);
    
    const result = await smsIndiaHubService.sendOTP(phone, otp);
    
    console.log(`✅ SMS sent successfully via SMSIndia Hub:`, result);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to send OTP via SMSIndia Hub:', error.message);
    
    // Re-throw the error to be handled by the calling function
    throw new Error(`SMS sending failed: ${error.message}`);
  }
};

/**
 * Send custom SMS message
 * @param {string} phone - Phone number to send SMS to
 * @param {string} message - Custom message to send
 * @returns {Promise<Object>} - Response object
 */
export const sendCustomSMS = async (phone, message) => {
  try {
    const result = await smsIndiaHubService.sendCustomSMS(phone, message);
    console.log(`✅ Custom SMS sent successfully:`, result);
    return result;
  } catch (error) {
    console.error('❌ Failed to send custom SMS:', error.message);
    throw new Error(`SMS sending failed: ${error.message}`);
  }
};

/**
 * Send welcome SMS to new users
 * @param {string} phone - Phone number
 * @param {string} name - User's name
 * @returns {Promise<Object>} - Response object
 */
export const sendWelcomeSMS = async (phone, name) => {
  try {
    const message = `Welcome to DriveOn, ${name || 'User'}! Your account has been successfully created. Start exploring amazing car rental options.`;
    return await smsIndiaHubService.sendCustomSMS(phone, message);
  } catch (error) {
    console.error('❌ Error sending welcome SMS:', error);
    throw error;
  }
};

/**
 * Send booking confirmation SMS
 * @param {string} phone - Phone number
 * @param {string} bookingId - Booking ID
 * @param {string} carName - Car name
 * @returns {Promise<Object>} - Response object
 */
export const sendBookingConfirmationSMS = async (phone, bookingId, carName) => {
  try {
    const message = `Your DriveOn booking #${bookingId} for ${carName} has been confirmed. Enjoy your ride!`;
    return await smsIndiaHubService.sendCustomSMS(phone, message);
  } catch (error) {
    console.error('❌ Error sending booking confirmation SMS:', error);
    throw error;
  }
};

/**
 * Send password reset OTP SMS
 * @param {string} phone - Phone number
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} - Response object
 */
export const sendPasswordResetOTP = async (phone, otp) => {
  try {
    const message = `Your DriveOn password reset OTP is ${otp}. This OTP is valid for 10 minutes. Do not share it with anyone.`;
    return await smsIndiaHubService.sendCustomSMS(phone, message);
  } catch (error) {
    console.error('❌ Error sending password reset OTP SMS:', error);
    throw error;
  }
};

/**
 * Get SMSIndia Hub account balance
 * @returns {Promise<Object>} - Balance information
 */
export const getSMSBalance = async () => {
  try {
    return await smsIndiaHubService.getBalance();
  } catch (error) {
    console.error('❌ Error fetching SMS balance:', error);
    throw error;
  }
};

/**
 * Test SMSIndia Hub connection
 * @returns {Promise<Object>} - Test result
 */
export const testSMSConnection = async () => {
  try {
    return await smsIndiaHubService.testConnection();
  } catch (error) {
    console.error('❌ Error testing SMS connection:', error);
    throw error;
  }
};

