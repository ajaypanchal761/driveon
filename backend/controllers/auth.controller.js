import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { generateOTP, getOTPExpiry, isOTPExpired, sendOTP } from '../utils/otp.service.js';
import { generateToken, generateRefreshToken } from '../utils/generateToken.js';

/**
 * @desc    Register new user (Send OTP)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { email, phone, referralCode } = req.body;

    // Validation
    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email and phone number are required',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      let message = 'User already exists';
      const emailExists = existingUser.email === email;
      const phoneExists = existingUser.phone === phone;
      
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

    // Generate OTP
    const otp = generateOTP().toString();
    const expiresAt = getOTPExpiry(10); // 10 minutes

    // Store OTP in database
    await OTP.create({
      identifier: phone,
      otp,
      type: 'phone',
      purpose: 'register',
      expiresAt,
      isUsed: false,
    });

    // Send OTP via SMS
    try {
      await sendOTP(phone, otp);
      console.log(`✅ OTP sent successfully to ${phone}`);
    } catch (smsError) {
      console.error('❌ SMS sending failed:', smsError.message);
      
      // In development, allow registration even if SMS fails
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚠️ SMS failed but allowing registration in development mode. OTP: ${otp}`);
      } else {
        // In production, return error if SMS fails
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP. Please try again.',
          error: 'SMS service unavailable',
        });
      }
    }

    // Create user (but not verified yet)
    const user = await User.create({
      email,
      phone,
      referredBy,
      isEmailVerified: false,
      isPhoneVerified: false,
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        email: user.email,
        phone: user.phone,
        otpSent: true,
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

    if (!emailOrPhone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required',
      });
    }

    // Determine if it's email or phone
    const isEmail = emailOrPhone.includes('@');
    const phone = isEmail ? null : emailOrPhone.replace(/\D/g, '');
    const email = isEmail ? emailOrPhone : null;

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: email || '' }, { phone: phone || '' }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email or phone number',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
      });
    }

    // Generate OTP
    const otp = generateOTP().toString();
    const expiresAt = getOTPExpiry(10); // 10 minutes

    // Store OTP in database
    const identifier = phone || email;
    await OTP.create({
      identifier,
      otp,
      type: phone ? 'phone' : 'email',
      purpose: 'login',
      expiresAt,
      isUsed: false,
    });

    // Send OTP via SMS (if phone) or Email (if email)
    try {
      if (phone) {
        await sendOTP(phone, otp);
        console.log(`✅ Login OTP sent successfully to ${phone}`);
      } else {
        // TODO: Implement email OTP sending
        console.log(`⚠️ Email OTP not implemented yet. OTP: ${otp}`);
      }
    } catch (smsError) {
      console.error('❌ SMS sending failed:', smsError.message);
      
      // In development, allow login even if SMS fails
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚠️ SMS failed but allowing login in development mode. OTP: ${otp}`);
      } else {
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP. Please try again.',
          error: 'SMS service unavailable',
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
    console.error('Send login OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login OTP send',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
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

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required',
      });
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

    // Find OTP record
    const identifier = phone || email;
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

    // Mark phone/email as verified
    if (phone) {
      user.isPhoneVerified = true;
    }
    if (email) {
      user.isEmailVerified = true;
    }
    await user.save();

    // Generate tokens
    const token = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

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
          name: user.name,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          referralCode: user.referralCode,
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

    // Generate new OTP
    const otp = generateOTP().toString();
    const expiresAt = getOTPExpiry(10); // 10 minutes

    // Store OTP in database
    const identifier = phone || email;
    await OTP.create({
      identifier,
      otp,
      type: phone ? 'phone' : 'email',
      purpose,
      expiresAt,
      isUsed: false,
    });

    // Send OTP via SMS
    try {
      if (phone) {
        await sendOTP(phone, otp);
        console.log(`✅ OTP resent successfully to ${phone}`);
      } else {
        // TODO: Implement email OTP sending
        console.log(`⚠️ Email OTP not implemented yet. OTP: ${otp}`);
      }
    } catch (smsError) {
      console.error('❌ SMS sending failed:', smsError.message);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚠️ SMS failed but allowing resend in development mode. OTP: ${otp}`);
      } else {
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP. Please try again.',
          error: 'SMS service unavailable',
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

    // TODO: Verify refresh token and generate new access token
    // For now, return a simple response
    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: generateToken('user_id'), // Placeholder
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
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

