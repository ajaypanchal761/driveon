import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit phone number'],
    },
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'owner', 'guarantor', 'admin'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate referral code before saving
userSchema.pre('save', async function (next) {
  if (this.isNew && !this.referralCode) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'DRIVE';
    
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Check if code already exists
    const existingUser = await mongoose.model('User').findOne({ referralCode: code });
    if (!existingUser) {
      this.referralCode = code;
    } else {
      // If exists, generate again
      code = 'DRIVE' + Math.random().toString(36).substring(2, 8).toUpperCase();
      this.referralCode = code;
    }
  }
  
  next();
});

const User = mongoose.model('User', userSchema);

export default User;

