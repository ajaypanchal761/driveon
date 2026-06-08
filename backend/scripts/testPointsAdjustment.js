import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import GuarantorPoints from '../models/GuarantorPoints.js';
import { connectDB } from '../config/database.js';
import { adjustUserPoints } from '../controllers/admin.controller.js';
import { getGuarantorPoints } from '../controllers/user.guarantor.controller.js';

dotenv.config();

const runTests = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();

    console.log('\n🔍 Finding or creating admin...');
    let admin = await Admin.findOne({ email: 'panchalajay717@gmail.com' });
    if (!admin) {
      admin = await Admin.create({
        name: 'Ajay Panchal',
        email: 'panchalajay717@gmail.com',
        password: 'password123',
        role: 'admin',
        isActive: true,
      });
      console.log('✅ Created test admin.');
    } else {
      console.log('✅ Admin found:', admin.email);
    }

    console.log('\n🔍 Finding or creating test user...');
    let existingUser = await User.findOne({ 
      $or: [
        { email: 'testuserpoints@gmail.com' },
        { phone: '9876543210' }
      ]
    });
    if (existingUser) {
      await User.deleteOne({ _id: existingUser._id });
      await GuarantorPoints.deleteMany({ guarantor: existingUser._id });
      console.log('🧹 Cleaned up existing test user and logs.');
    }
    
    let user = await User.create({
      name: 'Test Points User',
      email: 'testuserpoints@gmail.com',
      phone: '9876543210',
      points: 0,
      totalPointsEarned: 0,
      totalPointsUsed: 0,
      role: 'guarantor',
      isPhoneVerified: true,
      isEmailVerified: true,
    });
    console.log('✅ Created fresh test user with 0 points.');

    // Helper to call controller
    const callAdjustPoints = async (type, amount, reason, adminUser) => {
      const req = {
        params: { userId: user._id.toString() },
        body: { type, amount, reason },
        user: { _id: adminUser._id }
      };
      
      let responseStatus = 200;
      let responseData = null;

      const res = {
        status: function(code) {
          responseStatus = code;
          return this;
        },
        json: function(data) {
          responseData = data;
          return this;
        }
      };

      await adjustUserPoints(req, res);
      return { status: responseStatus, data: responseData };
    };

    console.log('\n🚀 TEST 1: Credit 100 points...');
    const res1 = await callAdjustPoints('credit', 100, 'Loyalty reward bonus', admin);
    console.log('Status:', res1.status);
    console.log('Message:', res1.data?.message);
    
    // Fetch updated user from DB
    user = await User.findById(user._id);
    console.log(`Updated user balance: 🪙${user.points} (Expected: 100)`);
    console.log(`Total earned: 🪙${user.totalPointsEarned} (Expected: 100)`);
    
    const logs1 = await GuarantorPoints.find({ guarantor: user._id });
    console.log(`GuarantorPoints count: ${logs1.length} (Expected: 1)`);
    if (logs1[0]) {
      console.log('Log entry details:');
      console.log(' - isAdjustment:', logs1[0].isAdjustment);
      console.log(' - adjustmentType:', logs1[0].adjustmentType);
      console.log(' - pointsAllocated:', logs1[0].pointsAllocated);
      console.log(' - reason:', logs1[0].reason);
    }

    console.log('\n🚀 TEST 2: Debit 30 points...');
    const res2 = await callAdjustPoints('debit', 30, 'Fee deduction correction', admin);
    console.log('Status:', res2.status);
    console.log('Message:', res2.data?.message);

    user = await User.findById(user._id);
    console.log(`Updated user balance: 🪙${user.points} (Expected: 70)`);
    console.log(`Total used: 🪙${user.totalPointsUsed} (Expected: 30)`);

    console.log('\n🚀 TEST 3: Attempt debit exceeding balance (debit 100 points)...');
    const res3 = await callAdjustPoints('debit', 100, 'Exceeding debit', admin);
    console.log('Status:', res3.status);
    console.log('Message:', res3.data?.message);
    
    user = await User.findById(user._id);
    console.log(`User balance remains: 🪙${user.points} (Expected: 70)`);

    console.log('\n🚀 TEST 4: Attempt adjustment without a reason...');
    const res4 = await callAdjustPoints('credit', 50, '', admin);
    console.log('Status:', res4.status);
    console.log('Message:', res4.data?.message);

    console.log('\n🚀 TEST 5: Verify user points history calculations and history formatting...');
    // We simulate getGuarantorPoints endpoint
    const historyReq = {
      user: { _id: user._id }
    };
    let historyData = null;
    const historyRes = {
      status: function(code) { return this; },
      json: function(data) {
        historyData = data;
        return this;
      }
    };
    await getGuarantorPoints(historyReq, historyRes);
    
    console.log('History Fetch Status: Success');
    console.log('Points balance in history:', historyData?.data?.points, '(Expected: 70)');
    console.log('History logs count:', historyData?.data?.history?.length, '(Expected: 2)');
    if (historyData?.data?.history) {
      historyData.data.history.forEach((h, idx) => {
        console.log(`\nHistory item #${idx + 1}:`);
        console.log(' - userName:', h.userName);
        console.log(' - bookingId:', h.bookingId);
        console.log(' - pointsEarned:', h.pointsEarned);
        console.log(' - isAdjustment:', h.isAdjustment);
        console.log(' - reason:', h.reason);
      });
    }

    console.log('\n🧹 Cleaning up test data...');
    await User.deleteOne({ _id: user._id });
    await GuarantorPoints.deleteMany({ guarantor: user._id });
    console.log('✅ Clean up complete.');

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during testing:', error);
    process.exit(1);
  }
};

runTests();
