import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { generateOTP, getOTPExpiry, isOTPExpired, sendOTP } from '../utils/otp.service.js';
import { generateToken, generateRefreshToken } from '../utils/generateToken.js';
import { processReferralSignup } from './referral.controller.js';

/**
 * @desc    Register new user (Send OTP)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { email, phone, referralCode, fullName, name } = req.body;

    // Validation
    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email and phone number are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Validate and normalize phone number (10 digits, must start with 6-9 for Indian mobile)
    const cleanedPhone = phone.replace(/\D/g, ''); // Remove all non-digits
    if (!cleanedPhone || cleanedPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanedPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number. Please enter a valid 10-digit Indian mobile number (starting with 6-9).',
      });
    }
    
    // Use cleaned phone number for all operations
    const normalizedPhone = cleanedPhone;

    // Check if user already exists (use normalized phone)
    const existingUser = await User.findOne({
      $or: [{ email }, { phone: normalizedPhone }],
    });

    if (existingUser) {
      let message = 'User already exists';
      const emailExists = existingUser.email === email;
      const phoneExists = existingUser.phone === normalizedPhone;
      if (emailExists && phoneExists) {
        message = 'Email and phone number already registered';
      } else if (emailExists) {
        message = 'Email already registered';
      } else if (phoneExists) {
        message = 'Phone number already registered';
      }

      return res.status(400).json({
        success: false,
        message,
      });
    }

    // Handle referral code
    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referredBy = referrer._id;
      }
    }

    // Generate OTP (pass normalized phone for test number detection)
    const otp = generateOTP(normalizedPhone).toString();
    const expiresAt = getOTPExpiry(10); // 10 minutes

    // Store OTP in database
    await OTP.create({
      identifier: normalizedPhone,
      otp,
      type: 'phone',
      purpose: 'register',
      expiresAt,
      isUsed: false,
    });

    // Send OTP via SMS (will skip for test numbers)
    let smsSent = false;
    let smsErrorOccurred = false;
    let smsErrorMessage = null;
    
    try {
      console.log(`\n📱 ===== Registration OTP Send Attempt =====`);
      console.log(`📱 Phone: ${normalizedPhone}`);
      console.log(`📱 OTP: ${otp}`);
      console.log(`📱 Purpose: register`);
      
      const smsResult = await sendOTP(normalizedPhone, otp, 'register');
      
      if (smsResult.isTest) {
        console.log(`🧪 Test mode: OTP ${otp} generated for ${normalizedPhone} (SMS skipped)`);
        smsSent = true;
      } else {
        // Verify SMS was actually sent successfully
        if (smsResult.success === false || smsResult.status === 'failed') {
          smsErrorOccurred = true;
          smsErrorMessage = smsResult.error || 'SMS sending failed - unknown error';
          console.error(`❌ SMS Result indicates failure:`, smsResult);
        } else {
          smsSent = true;
          console.log(`✅ OTP sent successfully to ${normalizedPhone} via SMSIndia Hub`);
          console.log(`📱 SMS Details:`, {
            messageId: smsResult.messageId,
            status: smsResult.status,
            provider: smsResult.provider,
            jobId: smsResult.jobId,
          });
        }
      }
    } catch (smsError) {
      smsErrorOccurred = true;
      smsErrorMessage = smsError.message;
      console.error('\n❌ ===== SMS Sending Failed =====');
      console.error('❌ SMS Error:', smsError.message);
      console.error('❌ SMS Error Details:', {
        phone: normalizedPhone,
        otp: otp,
        error: smsError.message,
        stack: process.env.NODE_ENV === 'development' ? smsError.stack : undefined,
      });
      console.error('❌ =================================\n');
    }
    
    // Check if SMS failed and handle accordingly
    if (smsErrorOccurred || !smsSent) {
      // Check if it's a test number (only allow failure for test numbers in development)
      const isTestNumber = normalizedPhone && ['9993911855', '9685974247', '6268455485', '9755262071'].some(testNum => normalizedPhone.endsWith(testNum));
      
      if (isTestNumber && process.env.NODE_ENV === 'development') {
        console.log(`⚠️ Test number - SMS failed but allowing registration in development mode. OTP: ${otp}`);
        smsSent = true; // Mark as sent for test numbers
      } else {
        // For real numbers (like 7610416911), return error if SMS fails
        console.error(`\n❌ SMS FAILED for real number: ${normalizedPhone}`);
        console.error(`❌ This number should receive real SMS. Registration blocked.`);
        console.error(`❌ Error: ${smsErrorMessage || 'Unknown error'}\n`);
        
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP. Please check your phone number and try again.',
          error: process.env.NODE_ENV === 'development' ? (smsErrorMessage || 'SMS service unavailable') : 'SMS service unavailable',
          phone: normalizedPhone,
        });
      }
    }
    
    console.log(`📱 ===== Registration OTP Send Complete =====\n`);

    // Create user (but not verified yet)
    // Save name if provided during registration (will be updated during profile completion)
    const userName = (fullName || name || '').trim();
    console.log('📝 Registration - Name received:', { fullName, name, userName });
    
    const user = await User.create({
      email,
      phone: normalizedPhone,
      name: userName,
      referredBy,
      isEmailVerified: false,
      isPhoneVerified: false,
      profileComplete: 0, // Will be updated during profile completion
    });
    
    console.log('✅ User created with name:', user.name);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        email: user.email,
        phone: user.phone,
        otpSent: smsSent,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Send OTP for login
 * @route   POST /api/auth/send-login-otp
 * @access  Public
 */
export const sendLoginOTP = async (req, res) => {
  try {
    const { emailOrPhone } = req.body;

    console.log(`\n📱 ===== Login OTP Request =====`);
    console.log(`📱 Input: ${emailOrPhone}`);

    if (!emailOrPhone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required',
      });
    }

    // Determine if it's email or phone
    const isEmail = emailOrPhone.includes('@');
    let phone = isEmail ? null : emailOrPhone.replace(/\D/g, '');
    const email = isEmail ? emailOrPhone : null;
    
    console.log(`📱 Type: ${isEmail ? 'Email' : 'Phone'}`);
    console.log(`📱 Phone: ${phone || 'N/A'}`);
    console.log(`📱 Email: ${email || 'N/A'}`);
    
    // Validate and normalize phone number if provided (10 digits, must start with 6-9 for Indian mobile)
    let normalizedPhone = phone;
    if (phone) {
      if (phone.length !== 10 || !/^[6-9]\d{9}$/.test(phone)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone number. Please enter a valid 10-digit Indian mobile number (starting with 6-9).',
        });
      }
      normalizedPhone = phone; // Already cleaned, use as normalized
    }
    
    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format',
        });
      }
    }

    // Find user by email or phone (use normalized phone)
    console.log(`🔍 Searching for user...`);
    const user = await User.findOne({
      $or: [{ email: email || '' }, { phone: normalizedPhone || '' }],
    });

    if (!user) {
      console.log(`❌ User not found`);
      return res.status(400).json({
        success: false,
        message: 'User not found. Please signup first.',
      });
    }

    console.log(`✅ User found: ${user._id}`);

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
      });
    }

    // Generate OTP (pass normalized phone for test number detection)
    console.log(`🔐 Generating OTP...`);
    // Use normalizedPhone if available, otherwise null (for email login)
    const otpValue = generateOTP(normalizedPhone || null);
    const otp = otpValue.toString();
    const expiresAt = getOTPExpiry(10); // 10 minutes
    
    console.log(`🔐 OTP Generated: ${otp}`);
    console.log(`🔐 Expires At: ${expiresAt}`);
    console.log(`🔐 For: ${normalizedPhone ? `Phone ${normalizedPhone}` : `Email ${email}`}`);

    // Store OTP in database (use normalized phone)
    const identifier = normalizedPhone || email;
    
    // Validate identifier is not empty
    if (!identifier || identifier.trim() === '') {
      console.error(`❌ Invalid identifier: ${identifier}`);
      throw new Error('Invalid identifier: phone or email is required');
    }
    
    console.log(`💾 Storing OTP in database...`);
    console.log(`💾 Identifier: ${identifier}`);
    console.log(`💾 Type: ${normalizedPhone ? 'phone' : 'email'}`);
    
    try {
      const otpRecord = await OTP.create({
        identifier: identifier.trim(),
        otp: otp.toString(),
        type: normalizedPhone ? 'phone' : 'email',
        purpose: 'login',
        expiresAt,
        isUsed: false,
      });
      console.log(`✅ OTP stored in database with ID: ${otpRecord._id}`);
    } catch (dbError) {
      console.error(`❌ Database error storing OTP:`, dbError);
      console.error(`❌ Error details:`, {
        message: dbError.message,
        name: dbError.name,
        code: dbError.code,
        keyPattern: dbError.keyPattern,
        keyValue: dbError.keyValue,
      });
      throw new Error(`Failed to store OTP: ${dbError.message}`);
    }

    // Send OTP via SMS (if phone) or Email (if email)
    // Use same approach as register - SMSIndia Hub service handles promotional SMS automatically
    let smsSent = false;
    let smsErrorOccurred = false;
    let smsErrorMessage = null;
    
    try {
      if (normalizedPhone) {
        console.log(`\n📱 ===== Login OTP Send Attempt =====`);
        console.log(`📱 Phone: ${normalizedPhone}`);
        console.log(`📱 OTP: ${otp}`);
        console.log(`📱 Purpose: login`);
        
        const smsResult = await sendOTP(normalizedPhone, otp, 'login');
        
        if (smsResult.isTest) {
          console.log(`🧪 Test mode: Login OTP ${otp} generated for ${normalizedPhone} (SMS skipped)`);
          smsSent = true;
        } else {
          // Verify SMS was actually sent successfully
          if (smsResult.success === false || smsResult.status === 'failed') {
            smsErrorOccurred = true;
            smsErrorMessage = smsResult.error || 'SMS sending failed - unknown error';
            console.error(`❌ SMS Result indicates failure:`, smsResult);
          } else {
            smsSent = true;
            console.log(`✅ Login OTP sent successfully to ${normalizedPhone} via SMSIndia Hub`);
            console.log(`📱 SMS Details:`, {
              messageId: smsResult.messageId,
              status: smsResult.status,
              provider: smsResult.provider,
              jobId: smsResult.jobId,
            });
          }
        }
      } else {
        // TODO: Implement email OTP sending
        console.log(`⚠️ Email OTP not implemented yet. OTP: ${otp}`);
        smsSent = false; // Email OTP not sent
      }
    } catch (smsError) {
      smsErrorOccurred = true;
      smsErrorMessage = smsError.message;
      console.error('\n❌ ===== SMS Sending Failed =====');
      console.error('❌ SMS Error:', smsError.message);
      console.error('❌ SMS Error Details:', {
        phone: normalizedPhone,
        otp: otp,
        error: smsError.message,
        stack: process.env.NODE_ENV === 'development' ? smsError.stack : undefined,
      });
      console.error('❌ =================================\n');
    }
    
    // Check if SMS failed and handle accordingly (same as register)
    if (smsErrorOccurred || !smsSent) {
      // Check if it's a test number (only allow failure for test numbers in development)
      const isTestNumber = normalizedPhone && ['9993911855', '9685974247', '6268455485', '9755262071'].some(testNum => normalizedPhone.endsWith(testNum));
      
      if (isTestNumber && process.env.NODE_ENV === 'development') {
        console.log(`⚠️ Test number - SMS failed but allowing login in development mode. OTP: ${otp}`);
        smsSent = true; // Mark as sent for test numbers
      } else {
        // For real numbers, return error if SMS fails (same as register)
        console.error(`\n❌ SMS FAILED for real number: ${normalizedPhone}`);
        console.error(`❌ This number should receive real SMS. Login blocked.`);
        console.error(`❌ Error: ${smsErrorMessage || 'Unknown error'}\n`);
        
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP. Please check your phone number and try again.',
          error: process.env.NODE_ENV === 'development' ? (smsErrorMessage || 'SMS service unavailable') : 'SMS service unavailable',
          phone: normalizedPhone,
        });
      }
    }

    console.log(`✅ ===== Login OTP Send Complete =====\n`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        phone: user.phone,
        email: user.email,
        otpSent: smsSent,
      },
    });
  } catch (error) {
    console.error('\n❌ ===== Send Login OTP Error =====');
    console.error('❌ Error Name:', error.name);
    console.error('❌ Error Message:', error.message);
    console.error('❌ Error Code:', error.code);
    
    // Log more details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Full Error:', error);
      console.error('❌ Stack Trace:', error.stack);
      
      // Check for specific error types
      if (error.name === 'ValidationError') {
        console.error('❌ Validation Errors:', error.errors);
      }
      if (error.name === 'MongoServerError') {
        console.error('❌ MongoDB Error Code:', error.code);
        console.error('❌ MongoDB Error Details:', error.keyPattern, error.keyValue);
      }
    }
    console.error('❌ =================================\n');
    
    // Return detailed error in development, generic in production
    const errorResponse = {
      success: false,
      message: 'Server error during login OTP send',
    };
    
    if (process.env.NODE_ENV === 'development') {
      errorResponse.error = error.message;
      errorResponse.errorType = error.name;
      if (error.stack) {
        errorResponse.stack = error.stack.split('\n').slice(0, 5).join('\n'); // First 5 lines of stack
      }
    }
    
    res.status(500).json(errorResponse);
  }
};

/**
 * @desc    Verify OTP
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP is required',
      });
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP format. OTP must be 6 digits.',
      });
    }

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required',
      });
    }

    // Validate and normalize phone number if provided
    let normalizedPhone = phone;
    if (phone) {
      const cleanedPhone = phone.replace(/\D/g, '');
      if (cleanedPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanedPhone)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone number. Please enter a valid 10-digit Indian mobile number (starting with 6-9).',
        });
      }
      normalizedPhone = cleanedPhone;
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format',
        });
      }
    }

    // Find user
    const user = await User.findOne({
      $or: [{ email: email || '' }, { phone: phone || '' }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find OTP record (use normalized phone)
    const identifier = normalizedPhone || email;
    const otpRecord = await OTP.findOne({
      identifier,
      otp,
      isUsed: false,
    }).sort({ createdAt: -1 }); // Get latest OTP

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // Check if OTP is expired
    if (isOTPExpired(otpRecord.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Check if this is a signup verification (not login)
    const isSignupVerification = otpRecord.purpose === 'register';
    
    // Check if this is the first verification (both phone and email were unverified before)
    const wasPhoneVerified = user.isPhoneVerified;
    const wasEmailVerified = user.isEmailVerified;
    const isFirstVerification = !wasPhoneVerified && !wasEmailVerified;
    
    // Mark phone/email as verified (use normalized phone)
    if (normalizedPhone) {
      user.isPhoneVerified = true;
    }
    if (email) {
      user.isEmailVerified = true;
    }
    await user.save();

    // Process referral signup if:
    // 1. This is a signup verification (purpose: 'register')
    // 2. User was referred by someone
    // 3. This is the first verification (to prevent duplicate points)
    if (isSignupVerification && user.referredBy && isFirstVerification) {
      // Award points to referrer for signup (runs asynchronously, doesn't block response)
      processReferralSignup(user._id.toString()).catch((error) => {
        console.error('Failed to process referral signup:', error);
        // Don't fail the signup if referral processing fails
      });
    }

    // Generate tokens
    const token = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Calculate profile completion
    const calculateProfileComplete = (user) => {
      const fields = ['name', 'email', 'phone', 'age', 'gender', 'address', 'profilePhoto'];
      let completedFields = 0;
      fields.forEach((field) => {
        if (user[field] && user[field] !== '') {
          completedFields++;
        }
      });
      return Math.round((completedFields / fields.length) * 100);
    };
    
    user.profileComplete = calculateProfileComplete(user);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          name: user.name || '',
          age: user.age,
          gender: user.gender,
          address: user.address,
          profilePhoto: user.profilePhoto,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          referralCode: user.referralCode,
          profileComplete: user.profileComplete,
        },
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP verification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Resend OTP
 * @route   POST /api/auth/resend-otp
 * @access  Public
 */
export const resendOTP = async (req, res) => {
  try {
    const { email, phone, purpose = 'register' } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required',
      });
    }

    // Validate and normalize phone number if provided
    let normalizedPhone = phone;
    if (phone) {
      const cleanedPhone = phone.replace(/\D/g, '');
      if (cleanedPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanedPhone)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone number. Please enter a valid 10-digit Indian mobile number (starting with 6-9).',
        });
      }
      normalizedPhone = cleanedPhone;
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format',
        });
      }
    }

    // Find user (use normalized phone)
    const user = await User.findOne({
      $or: [{ email: email || '' }, { phone: normalizedPhone || '' }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate new OTP (pass normalized phone for test number detection)
    const otp = generateOTP(normalizedPhone).toString();
    const expiresAt = getOTPExpiry(10); // 10 minutes

    // Store OTP in database (use normalized phone)
    const identifier = normalizedPhone || email;
    await OTP.create({
      identifier,
      otp,
      type: normalizedPhone ? 'phone' : 'email',
      purpose,
      expiresAt,
      isUsed: false,
    });

    // Send OTP via SMS
    let smsSent = false;
    try {
      if (normalizedPhone) {
        console.log(`📱 Attempting to resend OTP to phone: ${normalizedPhone}`);
        const smsResult = await sendOTP(normalizedPhone, otp, purpose);
        smsSent = true;
        
        if (smsResult.isTest) {
          console.log(`🧪 Test mode: OTP ${otp} resent for ${normalizedPhone} (SMS skipped)`);
        } else {
          console.log(`✅ OTP resent successfully to ${normalizedPhone} via SMSIndia Hub`);
          console.log(`📱 SMS Details:`, {
            messageId: smsResult.messageId,
            status: smsResult.status,
            provider: smsResult.provider,
          });
        }
      } else {
        // TODO: Implement email OTP sending
        console.log(`⚠️ Email OTP not implemented yet. OTP: ${otp}`);
      }
    } catch (smsError) {
      console.error('❌ SMS sending failed:', smsError.message);
      console.error('❌ SMS Error Details:', {
        phone: normalizedPhone,
        otp: otp,
        error: smsError.message,
        stack: process.env.NODE_ENV === 'development' ? smsError.stack : undefined,
      });
      
      // Always return error if SMS fails (even in development for real numbers)
      // Only allow in development if it's a test number
      const isTestNumber = normalizedPhone && ['9993911855', '9685974247', '6268455485', '9755262071'].some(testNum => normalizedPhone.endsWith(testNum));
      
      if (isTestNumber && process.env.NODE_ENV === 'development') {
        console.log(`⚠️ Test number - SMS failed but allowing resend in development mode. OTP: ${otp}`);
      } else {
        // Return error if SMS fails for real numbers
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP. Please check your phone number and try again.',
          error: process.env.NODE_ENV === 'development' ? smsError.message : 'SMS service unavailable',
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        phone: user.phone,
        email: user.email,
        otpSent: true,
      },
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP resend',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: refreshTokenValue } = req.body;

    if (!refreshTokenValue) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshTokenValue,
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production'
    );

    // Get user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated',
      });
    }

    // Generate new access token
    const newToken = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired. Please log in again.',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during token refresh',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
  try {
    // TODO: Implement token blacklisting if needed
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

