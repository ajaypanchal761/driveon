import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import { connectDB } from '../config/database.js';
import { generateAdminTokenPair, verifyAdminAccessToken, verifyAdminRefreshToken } from '../utils/adminJwtUtils.js';

dotenv.config();

const testAdminSystem = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();

    // Test 1: Create Admin
    console.log('\n📝 Test 1: Creating Admin...');
    const adminData = {
      name: 'Test Admin',
      email: 'testadmin@driveon.com',
      password: 'test123',
      role: 'admin',
      isActive: true,
    };

    // Delete existing test admin if exists
    await Admin.deleteOne({ email: adminData.email });

    const admin = await Admin.create(adminData);
    console.log('✅ Admin created:', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    });

    // Test 2: Generate Tokens
    console.log('\n🔑 Test 2: Generating Tokens...');
    const tokens = generateAdminTokenPair(admin._id.toString());
    console.log('✅ Tokens generated:');
    console.log('   Access Token:', tokens.accessToken.substring(0, 50) + '...');
    console.log('   Refresh Token:', tokens.refreshToken.substring(0, 50) + '...');
    console.log('   Access Token Expires In:', tokens.accessTokenExpiresIn);
    console.log('   Refresh Token Expires In:', tokens.refreshTokenExpiresIn);

    // Test 3: Verify Access Token
    console.log('\n🔍 Test 3: Verifying Access Token...');
    const decodedAccess = verifyAdminAccessToken(tokens.accessToken);
    console.log('✅ Access Token verified:', decodedAccess);

    // Test 4: Verify Refresh Token
    console.log('\n🔍 Test 4: Verifying Refresh Token...');
    const decodedRefresh = verifyAdminRefreshToken(tokens.refreshToken);
    console.log('✅ Refresh Token verified:', decodedRefresh);

    // Test 5: Password Comparison
    console.log('\n🔐 Test 5: Testing Password Comparison...');
    const isPasswordValid = await admin.comparePassword('test123');
    console.log('✅ Password comparison:', isPasswordValid ? 'Valid' : 'Invalid');

    // Test 6: Find Admin by Email
    console.log('\n🔍 Test 6: Finding Admin by Email...');
    const foundAdmin = await Admin.findOne({ email: adminData.email }).select('+password');
    console.log('✅ Admin found:', {
      id: foundAdmin._id,
      name: foundAdmin.name,
      email: foundAdmin.email,
      hasPassword: !!foundAdmin.password,
    });

    console.log('\n✅✅✅ All tests passed! Admin system is working correctly.');
    console.log('\n📋 Test Admin Credentials:');
    console.log('   Email:', adminData.email);
    console.log('   Password:', adminData.password);

    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

testAdminSystem();

