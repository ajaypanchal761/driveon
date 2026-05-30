import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';

// Load env variables
dotenv.config();

// Define backend URL
const BACKEND_URL = 'http://localhost:5000/api';

// Imports models
import User from './models/User.js';
import Booking from './models/Booking.js';
import Admin from './models/Admin.js';
import { processReferralTripCompletion, processReferralSignup } from './controllers/referral.controller.js';

// Assert helper
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ ASSERTION PASSED: ${message}`);
}

async function runTest() {
  console.log('🏁 Starting End-to-End Referral Flow Integration Test...\n');

  // 1. Connect to MongoDB
  console.log('🔌 Connecting to MongoDB...');
  assert(process.env.MONGODB_URI, 'MONGODB_URI exists in env');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(' Connected successfully to MongoDB.\n');

  // 2. Cleanup existing test data
  console.log('🧹 Cleaning up any existing test data...');
  await User.deleteMany({ phone: { $in: ['8883911855', '7773911855'] } });
  console.log(' Cleaned up test users.\n');

  // 3. Register Alice (Referrer)
  console.log('👥 1. Registering Alice (Referrer)...');
  const aliceRegisterRes = await axios.post(`${BACKEND_URL}/auth/register`, {
    email: 'alice@test.com',
    phone: '8883911855',
    fullName: 'Alice Test',
  });
  assert(aliceRegisterRes.data.success, 'Alice registration request succeeded');

  // 4. Verify Alice's OTP
  console.log('🔑 2. Verifying Alice\'s OTP...');
  const aliceVerifyRes = await axios.post(`${BACKEND_URL}/auth/verify-otp`, {
    phone: '8883911855',
    otp: '123456', // Test OTP
  });
  assert(aliceVerifyRes.data.success, 'Alice OTP verification succeeded');
  const aliceToken = aliceVerifyRes.data.data.token;
  assert(aliceToken, 'Acquired Alice\'s auth token');

  // 5. Find Alice's Referral Code in Database
  const aliceUser = await User.findOne({ phone: '8883911855' });
  assert(aliceUser, 'Found Alice in the database');
  assert(aliceUser.referralCode, `Alice's referral code is: ${aliceUser.referralCode}`);
  const aliceRefCode = aliceUser.referralCode;

  // 6. Register Bob (Referred User) passing Alice's Referral Code
  console.log('\n👥 3. Registering Bob (Referred User) with Alice\'s referral code...');
  const bobRegisterRes = await axios.post(`${BACKEND_URL}/auth/register`, {
    email: 'bob@test.com',
    phone: '7773911855',
    fullName: 'Bob Test',
    referralCode: aliceRefCode,
  });
  assert(bobRegisterRes.data.success, 'Bob registration request succeeded');

  // 7. Verify Bob's OTP (This automatically triggers processReferralSignup in backend)
  console.log('🔑 4. Verifying Bob\'s OTP to complete signup...');
  const bobVerifyRes = await axios.post(`${BACKEND_URL}/auth/verify-otp`, {
    phone: '7773911855',
    otp: '123456',
  });
  assert(bobVerifyRes.data.success, 'Bob OTP verification succeeded');
  const bobId = bobVerifyRes.data.data.user.id;
  assert(bobId, `Acquired Bob's User ID: ${bobId}`);

  // Wait a short time for async referral processing to finish
  console.log('⏳ Waiting for background referral signup processing...');
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 8. Verify Alice's Referral Dashboard
  console.log('\n📊 5. Verifying Alice\'s Referral Dashboard (Signup points)...');
  const aliceDashboardRes = await axios.get(`${BACKEND_URL}/referrals/dashboard`, {
    headers: { Authorization: `Bearer ${aliceToken}` },
  });
  assert(aliceDashboardRes.data.success, 'Alice dashboard fetch succeeded');
  const dashboardData = aliceDashboardRes.data.data;
  console.log(`   - Alice's total points: ${dashboardData.points}`);
  console.log(`   - Total referrals listed: ${dashboardData.referrals.length}`);
  
  assert(dashboardData.points === 50, 'Alice has exactly 50 points (Signup bonus)');
  assert(dashboardData.referrals.length === 1, 'Alice has exactly 1 referral entry');
  assert(dashboardData.referrals[0].status === 'pending', 'Bob\'s referral status is "pending"');

  // 9. Test Signup Duplicate Protection
  console.log('\n🛡️ 6. Testing duplicate signup points prevention...');
  // Find Bob's record
  const bobUserBefore = await User.findById(bobId);
  assert(bobUserBefore.referralSignupPointsAwarded === true, 'Bob is marked as signup-points-awarded');
  
  // Directly simulate running signup processing again
  const beforePoints = (await User.findOne({ phone: '8883911855' })).points;
  
  await processReferralSignup(bobId);
  
  const afterPoints = (await User.findOne({ phone: '8883911855' })).points;
  assert(beforePoints === afterPoints, 'Referrer points did not change on duplicate signup processing');

  // 10. Simulate Bob completing a trip
  console.log('\n🚗 7. Simulating Bob\'s first completed trip...');
  const bookingId = `BK-${Date.now().toString().slice(-6)}`;
  const testBooking = new Booking({
    bookingId,
    user: bobId,
    car: new mongoose.Types.ObjectId(), // Dummy car ID
    tripStart: {
      location: 'Pickup Location',
      date: new Date(),
      time: '10:00',
    },
    tripEnd: {
      location: 'Drop Location',
      date: new Date(),
      time: '18:00',
    },
    totalDays: 1,
    pricing: {
      basePrice: 500,
      totalPrice: 500,
      finalPrice: 500,
    },
    paymentOption: 'full',
    status: 'completed',
    paymentStatus: 'paid',
  });
  await testBooking.save();
  console.log(`   Saved a completed booking ${bookingId} for Bob.`);

  // 11. Trigger trip completion referral processing
  console.log('🔄 Triggering processReferralTripCompletion...');
  await processReferralTripCompletion(bobId);

  // 12. Verify Alice's Referral Dashboard (Trip completion points)
  console.log('\n📊 8. Verifying Alice\'s Referral Dashboard (Signup + Trip completion points)...');
  const aliceDashboardTripRes = await axios.get(`${BACKEND_URL}/referrals/dashboard`, {
    headers: { Authorization: `Bearer ${aliceToken}` },
  });
  const tripDashboardData = aliceDashboardTripRes.data.data;
  console.log(`   - Alice's total points: ${tripDashboardData.points}`);
  console.log(`   - Bob's status: ${tripDashboardData.referrals[0].status}`);
  console.log(`   - Bob's points earned: ${tripDashboardData.referrals[0].pointsEarned}`);
  
  assert(tripDashboardData.points === 100, 'Alice has exactly 100 points (Signup + Trip completion bonus)');
  assert(tripDashboardData.referrals[0].status === 'active', 'Bob\'s status is now "active"');
  assert(tripDashboardData.referrals[0].pointsEarned === 100, 'Bob\'s referral entry earned 100 points');

  // 13. Test Trip Completion Duplicate Protection
  console.log('\n🛡️ 9. Testing duplicate trip completion points prevention...');
  const bobUserAfter = await User.findById(bobId);
  assert(bobUserAfter.referralTripPointsAwarded === true, 'Bob is marked as trip-points-awarded');

  const beforeTripPoints = (await User.findOne({ phone: '8883911855' })).points;
  await processReferralTripCompletion(bobId);
  const afterTripPoints = (await User.findOne({ phone: '8883911855' })).points;
  assert(beforeTripPoints === afterTripPoints, 'Referrer points did not change on duplicate trip completion processing');

  // 14. Admin Adjusts Points
  console.log('\n👑 10. Simulating Admin Points Adjustment (+20 points for Bob\'s referral)...');
  
  // Find or create an admin user
  let adminUser = await Admin.findOne({ role: 'admin' });
  if (!adminUser) {
    adminUser = new Admin({
      name: 'System Admin',
      email: 'admin@driveon.com',
      password: 'password123',
      role: 'admin',
      isActive: true,
    });
    await adminUser.save();
  }
  
  // Sign a JWT token for the admin
  const adminToken = jwt.sign(
    { id: adminUser._id.toString(), type: 'access' },
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    { expiresIn: '24h', algorithm: 'HS256' }
  );

  // Call admin adjust endpoint
  const adminAdjustRes = await axios.put(
    `${BACKEND_URL}/admin/referrals/${bobId}/points`,
    { points: 20 },
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  assert(adminAdjustRes.data.success, 'Admin adjust points API returned success');

  // 15. Verify Adjustment in Database and Alice's Dashboard
  console.log('\n📊 11. Verifying Alice\'s Referral Dashboard after Admin Adjustment (+20 points)...');
  const bobUserFinal = await User.findById(bobId);
  assert(bobUserFinal.referralPointsAdjustment === 20, 'Bob\'s referralPointsAdjustment is exactly 20 in the database');

  const aliceDashboardFinalRes = await axios.get(`${BACKEND_URL}/referrals/dashboard`, {
    headers: { Authorization: `Bearer ${aliceToken}` },
  });
  const finalDashboardData = aliceDashboardFinalRes.data.data;
  console.log(`   - Alice's total points: ${finalDashboardData.points}`);
  console.log(`   - Bob's points earned: ${finalDashboardData.referrals[0].pointsEarned}`);
  
  assert(finalDashboardData.points === 120, 'Alice\'s dashboard correctly reflects adjusted 120 points');
  assert(finalDashboardData.referrals[0].pointsEarned === 120, 'Bob\'s referral entry correctly shows 120 points earned');

  // Verify Alice's cached points in User schema
  const aliceFinalUser = await User.findOne({ phone: '8883911855' });
  assert(aliceFinalUser.points === 120, 'Alice\'s cached points in database are exactly 120');

  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! The Referral Flow is 100% Correct and End-to-End verified.');

  // Clean up
  await User.deleteMany({ phone: { $in: ['8883911855', '7773911855'] } });
  await Booking.deleteOne({ bookingId });
  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB. Exit.');
  process.exit(0);
}

runTest().catch((err) => {
  console.error('\n❌ Test failed with error:', err.message);
  if (err.response) {
    console.error('Response details:', err.response.data);
  }
  process.exit(1);
});
