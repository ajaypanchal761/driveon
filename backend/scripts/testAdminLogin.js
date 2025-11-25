import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import { connectDB } from '../config/database.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const testAdminLogin = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();

    const email = 'panchalajay717@gmail.com';
    const password = '110211';

    console.log('\n📝 Testing Admin Login...');
    console.log('Email:', email);
    console.log('Password:', password);

    // Find admin
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

    if (!admin) {
      console.log('\n❌ Admin not found!');
      console.log('Creating admin account...');
      
      const newAdmin = await Admin.create({
        name: 'Ajay Panchal',
        email: email.toLowerCase(),
        password: password,
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

      console.log('✅ Admin created:', {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        isActive: newAdmin.isActive,
      });
      
      // Test password
      const isValid = await newAdmin.comparePassword(password);
      console.log('✅ Password comparison:', isValid ? 'Valid' : 'Invalid');
      
      process.exit(0);
    }

    console.log('\n✅ Admin found:', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      isActive: admin.isActive,
      hasPassword: !!admin.password,
    });

    // Test password
    const isValid = await admin.comparePassword(password);
    console.log('\n🔐 Password comparison:', isValid ? '✅ Valid' : '❌ Invalid');

    if (!isValid) {
      console.log('\n⚠️ Password is incorrect. Resetting password...');
      admin.password = password;
      await admin.save();
      console.log('✅ Password reset successfully');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testAdminLogin();
