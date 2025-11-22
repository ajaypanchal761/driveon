import User from '../models/User.js';
import { uploadImage, isConfigured } from '../services/cloudinary.service.js';

/**
 * Calculate profile completion percentage
 * @param {Object} user - User object
 * @returns {number} - Completion percentage (0-100)
 */
const calculateProfileComplete = (user) => {
  const fields = [
    'name',
    'email',
    'phone',
    'age',
    'gender',
    'address',
    'profilePhoto',
  ];
  
  let completedFields = 0;
  
  fields.forEach((field) => {
    if (user[field] && user[field] !== '') {
      completedFields++;
    }
  });
  
  return Math.round((completedFields / fields.length) * 100);
};

/**
 * @desc    Get user profile
 * @route   GET /api/user/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Calculate profile completion
    const profileComplete = calculateProfileComplete(user);
    
    // Update profile completion in database if changed
    if (user.profileComplete !== profileComplete) {
      user.profileComplete = profileComplete;
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          age: user.age,
          gender: user.gender,
          address: user.address,
          profilePhoto: user.profilePhoto,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          referralCode: user.referralCode,
          profileComplete: user.profileComplete,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/user/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, age, gender, address } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update allowed fields
    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = parseInt(age);
    if (gender !== undefined) user.gender = gender;
    if (address !== undefined) user.address = address;

    // Calculate and update profile completion
    user.profileComplete = calculateProfileComplete(user);
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          age: user.age,
          gender: user.gender,
          address: user.address,
          profilePhoto: user.profilePhoto,
          profileComplete: user.profileComplete,
        },
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Upload profile photo
 * @route   POST /api/user/upload-photo
 * @access  Private
 */
export const uploadPhoto = async (req, res) => {
  try {
    // Check if Cloudinary is configured
    if (!isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Image upload service not configured. Please contact administrator.',
      });
    }

    // Check if file is provided
    if (!req.files || !req.files.photo) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a photo file',
      });
    }

    const file = req.files.photo;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.',
      });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.',
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadImage(file, {
      folder: 'driveon/profile-photos',
      width: 800,
      height: 800,
      crop: 'limit',
    });

    // Update user profile photo
    const user = await User.findById(req.user._id);
    
    // Delete old photo from Cloudinary if exists
    if (user.profilePhoto) {
      try {
        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
        const urlParts = user.profilePhoto.split('/');
        const uploadIndex = urlParts.findIndex(part => part === 'upload');
        if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
          const publicIdWithVersion = urlParts.slice(uploadIndex + 2).join('/');
          const publicId = publicIdWithVersion.split('.')[0]; // Remove extension
          const { deleteImage } = await import('../services/cloudinary.service.js');
          await deleteImage(publicId);
        }
      } catch (deleteError) {
        console.error('Error deleting old photo:', deleteError);
        // Continue even if old photo deletion fails
      }
    }

    user.profilePhoto = uploadResult.secure_url;
    user.profileComplete = calculateProfileComplete(user);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully',
      data: {
        profilePhoto: uploadResult.secure_url,
        profileComplete: user.profileComplete,
      },
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading photo',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get KYC status
 * @route   GET /api/user/kyc-status
 * @access  Private
 */
export const getKYCStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // TODO: Implement KYC model and status check
    // For now, return default status
    res.status(200).json({
      success: true,
      data: {
        aadhaarVerified: false,
        panVerified: false,
        drivingLicenseVerified: false,
        kycVerified: false,
      },
    });
  } catch (error) {
    console.error('Get KYC status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching KYC status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

