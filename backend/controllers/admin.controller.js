import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Car from '../models/Car.js';
import { generateAdminTokenPair, verifyAdminRefreshToken } from '../utils/adminJwtUtils.js';

/**
 * @desc    Admin Signup
 * @route   POST /api/admin/signup
 * @access  Public
 */
export const adminSignup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if admin with this email already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Create admin
    const admin = await Admin.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // Will be hashed by pre-save hook
      phone: phone?.trim() || undefined,
      role: 'admin',
      isActive: true,
      permissions: [
        'users.manage',
        'users.view',
        'cars.manage',
        'cars.view',
        'bookings.manage',
        'bookings.view',
        'payments.manage',
        'payments.view',
        'kyc.manage',
        'kyc.view',
        'reports.view',
        'settings.manage',
      ],
    });

    // Generate tokens (access token with 24h expiry, refresh token with 7d expiry)
    const tokens = generateAdminTokenPair(admin._id.toString());

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
        },
      },
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin signup',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Admin Login
 * @route   POST /api/admin/login
 * @access  Public
 */
export const adminLogin = async (req, res) => {
  try {
    console.log('\n========================================');
    console.log('✅✅✅ ADMIN LOGIN CONTROLLER CALLED');
    console.log('✅✅✅ NO MIDDLEWARE APPLIED - Direct route match');
    console.log('Route:', req.method, req.originalUrl);
    console.log('Path:', req.path);
    console.log('Body:', { email: req.body?.email, hasPassword: !!req.body?.password });
    console.log('Headers:', { hasAuth: !!req.headers.authorization });
    console.log('========================================\n');
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log('❌ Validation failed: Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    console.log('🔍 Looking for admin with email:', email.toLowerCase().trim());

    // Find admin with password field
    const admin = await Admin.findOne({ 
      email: email.toLowerCase().trim()
    }).select('+password'); // Include password field

    if (!admin) {
      console.log('❌ Admin not found for email:', email.toLowerCase().trim());
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('✅ Admin found:', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      isActive: admin.isActive,
    });

    // Check if admin is active
    if (!admin.isActive) {
      console.log('❌ Admin account is deactivated');
      return res.status(401).json({
        success: false,
        message: 'Admin account is deactivated. Please contact support.'
      });
    }

    // Compare password
    console.log('🔐 Comparing password...');
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      console.log('❌ Password is invalid');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('✅ Password is valid');

    // Update last login
    const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0];
    await admin.updateLastLogin(clientIP);

    // Generate tokens (access token with 24h expiry, refresh token with 7d expiry)
    const tokens = generateAdminTokenPair(admin._id.toString());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
          lastLogin: admin.lastLogin,
        },
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Refresh Admin Token
 * @route   POST /api/admin/refresh-token
 * @access  Public
 */
export const refreshAdminToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyAdminRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Find admin
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found'
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin account is deactivated'
      });
    }

    // Generate new token pair
    const tokens = generateAdminTokenPair(admin._id.toString());

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    console.error('Admin refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during token refresh',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get Admin Profile
 * @route   GET /api/admin/profile
 * @access  Private (Admin)
 */
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
          isActive: admin.isActive,
          lastLogin: admin.lastLogin,
          profilePhoto: admin.profilePhoto,
          phone: admin.phone,
          department: admin.department,
          createdAt: admin.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching admin profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Admin Logout
 * @route   POST /api/admin/logout
 * @access  Private (Admin)
 */
export const adminLogout = async (req, res) => {
  try {
    // In a more advanced implementation, you could blacklist the token here
    // For now, we'll just return success
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get All Users (Admin)
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    console.log('\n========================================');
    console.log('✅ GET ALL USERS - Admin Controller');
    console.log('Admin:', req.user?.email);
    console.log('Query params:', req.query);
    console.log('========================================\n');

    const {
      page = 1,
      limit = 1000, // Default to get all users
      search = '',
      accountStatus,
      kycStatus,
      profileCompletion,
      userType,
    } = req.query;

    // Build query
    const query = {};
    const orConditions = [];

    // Search filter
    if (search && search !== '') {
      orConditions.push(
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      );
    }

    // Account status filter (only if not 'all')
    if (accountStatus && accountStatus !== 'all') {
      query.accountStatus = accountStatus;
    }

    // KYC status filter (based on isPhoneVerified and isEmailVerified)
    if (kycStatus && kycStatus !== 'all') {
      if (kycStatus === 'verified') {
        query.isPhoneVerified = true;
        query.isEmailVerified = true;
      } else if (kycStatus === 'pending') {
        // Use $and to ensure at least one is false
        query.$and = [
          {
            $or: [
              { isPhoneVerified: false },
              { isEmailVerified: false },
            ],
          },
        ];
      }
    }

    // User type filter (only if not 'all')
    if (userType && userType !== 'all') {
      query.role = userType;
    }

    // Combine search conditions with query
    if (orConditions.length > 0) {
      query.$or = orConditions;
    }

    console.log('🔍 Query:', JSON.stringify(query, null, 2));

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get users with pagination
    const users = await User.find(query)
      .select('-password -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    console.log(`✅ Found ${users.length} users`);

    // Get total count
    const total = await User.countDocuments(query);

    // Calculate profile completion for each user
    const usersWithCompletion = users.map(user => {
      const userObj = user.toObject();
      
      // Add id field for frontend compatibility
      userObj.id = userObj._id;
      
      // Calculate KYC status
      if (userObj.isPhoneVerified && userObj.isEmailVerified) {
        userObj.kycStatus = 'verified';
      } else {
        userObj.kycStatus = 'pending';
      }
      
      // Ensure accountStatus has a default value
      if (!userObj.accountStatus) {
        userObj.accountStatus = 'active';
      }
      
      // Calculate profile completion
      const fields = ['name', 'email', 'phone', 'age', 'gender', 'address', 'profilePhoto'];
      let completedFields = 0;
      
      fields.forEach(field => {
        if (userObj[field] !== undefined && userObj[field] !== null && userObj[field] !== '') {
          completedFields++;
        }
      });
      
      userObj.profileCompletion = Math.round((completedFields / fields.length) * 100);
      return userObj;
    });

    // Filter by profile completion if specified
    let filteredUsers = usersWithCompletion;
    if (profileCompletion && profileCompletion !== 'all') {
      const completionValue = parseInt(profileCompletion);
      filteredUsers = usersWithCompletion.filter(user => user.profileCompletion >= completionValue);
    }

    console.log(`✅ Returning ${filteredUsers.length} filtered users\n`);

    res.status(200).json({
      success: true,
      data: {
        users: filteredUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('❌ Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update Admin Profile
 * @route   PUT /api/admin/profile
 * @access  Private (Admin)
 */
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const admin = await Admin.findById(req.user._id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Update fields if provided
    if (name !== undefined) {
      admin.name = name.trim();
    }
    if (phone !== undefined) {
      admin.phone = phone?.trim() || undefined;
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          role: admin.role,
          permissions: admin.permissions,
          isActive: admin.isActive,
          lastLogin: admin.lastLogin,
          profilePhoto: admin.profilePhoto,
          department: admin.department,
        },
      },
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating admin profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Change Admin Password
 * @route   PUT /api/admin/change-password
 * @access  Private (Admin)
 */
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Find admin with password field
    const admin = await Admin.findById(req.user._id).select('+password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Verify current password
    const isPasswordValid = await admin.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password (will be hashed by pre-save hook)
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change admin password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get Dashboard Statistics
 * @route   GET /api/admin/dashboard/stats
 * @access  Private (Admin)
 */
export const getDashboardStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get total cars count
    const totalCars = await Car.countDocuments();

    // Get active cars count
    const activeCars = await Car.countDocuments({ status: 'active' });

    // Get pending KYC count (users with unverified email or phone)
    const pendingKYC = await User.countDocuments({
      $or: [
        { isPhoneVerified: false },
        { isEmailVerified: false },
      ],
    });

    // Get active bookings count (if Booking model exists, otherwise 0)
    // For now, we'll return 0 as there's no Booking model yet
    const activeBookings = 0;

    // Get today's revenue (if Payment/Booking model exists, otherwise 0)
    // For now, we'll return 0
    const todayRevenue = 0;

    // Get active trips (same as active bookings for now)
    const activeTrips = activeBookings;

    // Get additional stats
    const totalActiveUsers = await User.countDocuments({ 
      isActive: true,
      accountStatus: 'active',
    });

    const totalPendingCars = await Car.countDocuments({ status: 'pending' });

    const totalSuspendedCars = await Car.countDocuments({ status: 'suspended' });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalCars,
          activeCars,
          activeBookings,
          pendingKYC,
          todayRevenue,
          activeTrips,
          totalActiveUsers,
          totalPendingCars,
          totalSuspendedCars,
        },
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get System Settings
 * @route   GET /api/admin/settings
 * @access  Private (Admin)
 */
export const getSystemSettings = async (req, res) => {
  try {
    // For now, return default settings
    // In future, you can store these in a database
    const settings = {
      appName: process.env.APP_NAME || 'DriveOn',
      contactEmail: process.env.CONTACT_EMAIL || 'driveon721@gmail.com',
      contactPhone: process.env.CONTACT_PHONE || '+91 98765 43210',
    };

    res.status(200).json({
      success: true,
      data: {
        settings,
      },
    });
  } catch (error) {
    console.error('Get system settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching system settings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update System Settings
 * @route   PUT /api/admin/settings
 * @access  Private (Admin)
 */
export const updateSystemSettings = async (req, res) => {
  try {
    const { appName, contactEmail, contactPhone } = req.body;

    // Validation
    if (!appName || !contactEmail || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'App name, contact email, and contact phone are required'
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(contactEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // For now, we'll just return success
    // In future, you can store these in a database or environment variables
    // You could create a Settings model or use a config file
    
    res.status(200).json({
      success: true,
      message: 'System settings updated successfully',
      data: {
        settings: {
          appName: appName.trim(),
          contactEmail: contactEmail.trim().toLowerCase(),
          contactPhone: contactPhone.trim(),
        },
      },
    });
  } catch (error) {
    console.error('Update system settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating system settings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get User by ID (Admin)
 * @route   GET /api/admin/users/:userId
 * @access  Private (Admin)
 */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password -__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate profile completion
    const fields = ['name', 'email', 'phone', 'age', 'gender', 'address', 'profilePhoto'];
    let completedFields = 0;
    
    fields.forEach(field => {
      if (user[field] !== undefined && user[field] !== null && user[field] !== '') {
        completedFields++;
      }
    });
    
    const profileCompletion = Math.round((completedFields / fields.length) * 100);
    
    // Calculate KYC status
    let kycStatus = 'pending';
    if (user.isPhoneVerified && user.isEmailVerified) {
      kycStatus = 'verified';
    }

    const userObj = user.toObject();
    userObj.id = userObj._id; // Add id field for frontend compatibility
    if (!userObj.accountStatus) {
      userObj.accountStatus = 'active';
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          ...userObj,
          profileCompletion,
          kycStatus,
        },
      },
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update User Status (Admin)
 * @route   PUT /api/admin/users/:userId/status
 * @access  Private (Admin)
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body; // 'activate', 'suspend', or 'ban'

    if (!['activate', 'suspend', 'ban'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be: activate, suspend, or ban'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user status
    if (action === 'activate') {
      user.isActive = true;
      user.accountStatus = 'active';
    } else if (action === 'suspend') {
      user.isActive = false;
      user.accountStatus = 'suspended';
    } else if (action === 'ban') {
      user.isActive = false;
      user.accountStatus = 'banned';
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${action}ed successfully`,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isActive: user.isActive,
          accountStatus: user.accountStatus,
        },
      },
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

