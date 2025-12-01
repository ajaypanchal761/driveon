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
    // Check if field exists and is not empty
    if (user[field] !== undefined && user[field] !== null && user[field] !== '') {
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
          _id: user._id,
          name: user.name || '',
          email: user.email,
          phone: user.phone,
          age: user.age,
          gender: user.gender,
          address: user.address || '',
          profilePhoto: user.profilePhoto || '',
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          referralCode: user.referralCode,
          guarantorId: user.guarantorId || '',
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
    console.log('📝 Update Profile - Received data:', { name, age, gender, address });
    
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update allowed fields (only update if provided)
    if (name !== undefined && name !== null && name !== '') {
      user.name = name.trim();
      console.log('✅ Updated name:', user.name);
    }
    
    // Handle age - can be number or string
    if (age !== undefined && age !== null && age !== '') {
      const ageNum = typeof age === 'number' ? age : parseInt(String(age), 10);
      console.log('🔍 Age processing:', { age, ageNum, isValid: !isNaN(ageNum) && ageNum >= 18 && ageNum <= 100 });
      if (!isNaN(ageNum) && ageNum >= 18 && ageNum <= 100) {
        user.age = ageNum;
        console.log('✅ Updated age:', user.age);
      } else {
        console.warn('⚠️ Invalid age value:', age, '->', ageNum, '(must be between 18-100)');
      }
    } else {
      console.log('ℹ️ Age not provided or empty');
    }
    
    // Handle gender
    if (gender !== undefined && gender !== null && gender !== '') {
      const genderLower = String(gender).toLowerCase();
      if (['male', 'female', 'other'].includes(genderLower)) {
        user.gender = genderLower;
        console.log('✅ Updated gender:', user.gender);
      } else {
        console.warn('⚠️ Invalid gender value:', gender, '(must be male, female, or other)');
      }
    } else {
      console.log('ℹ️ Gender not provided or empty');
    }
    
    // Handle address
    if (address !== undefined && address !== null && address !== '') {
      user.address = address.trim();
      console.log('✅ Updated address:', user.address);
    } else {
      console.log('ℹ️ Address not provided or empty');
    }

    // Calculate and update profile completion
    user.profileComplete = calculateProfileComplete(user);
    console.log('📊 Profile completion:', user.profileComplete + '%');
    
    await user.save();
    console.log('💾 User saved successfully');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name || '',
          email: user.email,
          phone: user.phone,
          age: user.age,
          gender: user.gender,
          address: user.address || '',
          profilePhoto: user.profilePhoto || '',
          profileComplete: user.profileComplete,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          referralCode: user.referralCode,
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

    // Check if file is provided (multer stores file in req.file)
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a photo file',
      });
    }

    const file = req.file;

    // Validate file type (already validated by multer, but double-check)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.',
      });
    }

    // Validate file size (already validated by multer, but double-check)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.',
      });
    }

    // Convert multer file to format expected by Cloudinary service
    const fileForUpload = {
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
    };

    // Upload to Cloudinary
    const uploadResult = await uploadImage(fileForUpload, {
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
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profilePhoto: uploadResult.secure_url,
          profileComplete: user.profileComplete,
        },
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

/**
 * @desc    Update user location
 * @route   POST /api/user/update-location
 * @access  Private
 */
export const updateLocation = async (req, res) => {
  try {
    const { lat, lng, address } = req.body;

    // Validate required fields
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    // Validate coordinates
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude must be numbers',
      });
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update location
    user.location = {
      latitude: lat,
      longitude: lng,
      address: address || user.location?.address || '',
      lastLocationUpdate: new Date(),
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      data: {
        location: {
          latitude: user.location.latitude,
          longitude: user.location.longitude,
          address: user.location.address,
          lastLocationUpdate: user.location.lastLocationUpdate,
        },
      },
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating location',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

