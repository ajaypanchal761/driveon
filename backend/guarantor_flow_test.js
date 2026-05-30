import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';

// Load env variables
dotenv.config();

// Define backend URL
const BACKEND_URL = 'http://localhost:5000/api';

// Import models
import User from './models/User.js';
import Booking from './models/Booking.js';
import Admin from './models/Admin.js';
import GuarantorRequest from './models/GuarantorRequest.js';
import GuarantorPoints from './models/GuarantorPoints.js';

// Assert helper
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`   ✅ ASSERTION PASSED: ${message}`);
}

async function runTest() {
  console.log('🏁 Starting End-to-End Guarantor Flow & Coins Breakdown Integration Test...\n');

  // 1. Connect to MongoDB
  console.log('🔌 Connecting to MongoDB...');
  assert(process.env.MONGODB_URI, 'MONGODB_URI exists in env');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('🔌 Connected successfully to MongoDB.\n');

  // 2. Cleanup existing test data
  console.log('🧹 Cleaning up any existing test data...');
  const testPhones = ['9993911855', '8883911855', '7773911855', '9993911856', '9993911857'];
  const testEmails = ['borrower@test.com', 'g1@test.com', 'g2@test.com'];
  const testUsers = await User.find({ $or: [{ phone: { $in: testPhones } }, { email: { $in: testEmails } }] });
  const testUserIds = testUsers.map(u => u._id);

  await Booking.deleteMany({ user: { $in: testUserIds } });
  await GuarantorRequest.deleteMany({ $or: [{ user: { $in: testUserIds } }, { guarantor: { $in: testUserIds } }] });
  await GuarantorPoints.deleteMany({ guarantor: { $in: testUserIds } });
  await User.deleteMany({ $or: [{ phone: { $in: testPhones } }, { email: { $in: testEmails } }] });
  console.log('🧹 Cleaned up test users, bookings, guarantor requests, and guarantor points.\n');

  // 3. Register Borrower (User A)
  console.log('👥 1. Registering Borrower...');
  const borrowerRegisterRes = await axios.post(`${BACKEND_URL}/auth/register`, {
    email: 'borrower@test.com',
    phone: '9993911855',
    fullName: 'Borrower Test',
  });
  assert(borrowerRegisterRes.data.success, 'Borrower registration request succeeded');

  // 4. Verify Borrower OTP
  console.log('🔑 2. Verifying Borrower OTP...');
  const borrowerVerifyRes = await axios.post(`${BACKEND_URL}/auth/verify-otp`, {
    phone: '9993911855',
    otp: '123456', // Test OTP bypass
  });
  assert(borrowerVerifyRes.data.success, 'Borrower OTP verification succeeded');
  const borrowerToken = borrowerVerifyRes.data.data.token;
  const borrowerId = borrowerVerifyRes.data.data.user.id;
  assert(borrowerToken, 'Acquired Borrower\'s auth token');

  // 5. Register Guarantor 1 (User B)
  console.log('\n👥 3. Registering Guarantor 1...');
  const g1RegisterRes = await axios.post(`${BACKEND_URL}/auth/register`, {
    email: 'g1@test.com',
    phone: '8883911855',
    fullName: 'Guarantor 1 Test',
  });
  assert(g1RegisterRes.data.success, 'Guarantor 1 registration request succeeded');

  // 6. Verify Guarantor 1 OTP
  console.log('🔑 4. Verifying Guarantor 1 OTP...');
  const g1VerifyRes = await axios.post(`${BACKEND_URL}/auth/verify-otp`, {
    phone: '8883911855',
    otp: '123456',
  });
  assert(g1VerifyRes.data.success, 'Guarantor 1 OTP verification succeeded');
  const g1Token = g1VerifyRes.data.data.token;
  const g1Id = g1VerifyRes.data.data.user.id;
  assert(g1Token, 'Acquired Guarantor 1 auth token');

  // Fetch Guarantor 1 DB user to get auto-generated guarantorId
  const dbG1User = await User.findById(g1Id);
  assert(dbG1User && dbG1User.guarantorId, `Guarantor 1 custom guarantorId is: ${dbG1User?.guarantorId}`);
  const g1CustomId = dbG1User.guarantorId;

  // 7. Register Guarantor 2 (User C)
  console.log('\n👥 5. Registering Guarantor 2...');
  const g2RegisterRes = await axios.post(`${BACKEND_URL}/auth/register`, {
    email: 'g2@test.com',
    phone: '7773911855',
    fullName: 'Guarantor 2 Test',
  });
  assert(g2RegisterRes.data.success, 'Guarantor 2 registration request succeeded');

  // 8. Verify Guarantor 2 OTP
  console.log('🔑 6. Verifying Guarantor 2 OTP...');
  const g2VerifyRes = await axios.post(`${BACKEND_URL}/auth/verify-otp`, {
    phone: '7773911855',
    otp: '123456',
  });
  assert(g2VerifyRes.data.success, 'Guarantor 2 OTP verification succeeded');
  const g2Token = g2VerifyRes.data.data.token;
  const g2Id = g2VerifyRes.data.data.user.id;
  assert(g2Token, 'Acquired Guarantor 2 auth token');

  // Fetch Guarantor 2 DB user to get auto-generated guarantorId
  const dbG2User = await User.findById(g2Id);
  assert(dbG2User && dbG2User.guarantorId, `Guarantor 2 custom guarantorId is: ${dbG2User?.guarantorId}`);
  const g2CustomId = dbG2User.guarantorId;

  // 9. Generate Mock Booking for Borrower
  console.log('\n🚗 7. Simulating booking creation in DB...');
  const bookingId = `BK-${Date.now().toString().slice(-6)}`;
  const testBooking = new Booking({
    bookingId,
    user: borrowerId,
    car: new mongoose.Types.ObjectId(), // Dummy car
    tripStart: {
      location: 'Pickup Address Test',
      date: new Date(),
      time: '09:00',
    },
    tripEnd: {
      location: 'Drop Address Test',
      date: new Date(),
      time: '18:00',
    },
    totalDays: 2,
    pricing: {
      basePrice: 5000,
      totalPrice: 10000,
      finalPrice: 10000, // ₹10,000 finalPrice -> Total Pool ₹1,000 (10%)
    },
    paymentOption: 'full',
    status: 'confirmed',
    paymentStatus: 'paid',
  });
  await testBooking.save();
  console.log(`   Saved a mock confirmed booking ${bookingId} for Borrower (price: ₹10,000, pool: ₹1,000).`);

  // 10. Generate Admin Authentication Token
  console.log('\n👑 8. Authenticating Admin...');
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
  
  const adminToken = jwt.sign(
    { id: adminUser._id.toString(), type: 'access' },
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    { expiresIn: '24h', algorithm: 'HS256' }
  );
  assert(adminToken, 'Admin token generated successfully.');

  // 11. Admin sends Guarantor 1 Request
  console.log('\n➕ 9. Admin sending guarantor request to Guarantor 1...');
  const g1RequestRes = await axios.post(
    `${BACKEND_URL}/admin/guarantor-requests`,
    {
      bookingId: testBooking._id.toString(),
      guarantorId: g1CustomId,
    },
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  assert(g1RequestRes.data.success, 'Admin guarantor request sent successfully to Guarantor 1');
  const g1RequestId = g1RequestRes.data.data.request._id;
  assert(g1RequestId, `Acquired Guarantor 1 request ID: ${g1RequestId}`);

  // 12. Guarantor 1 Accepts Request
  console.log('🤝 10. Guarantor 1 accepting the request...');
  const g1AcceptRes = await axios.post(
    `${BACKEND_URL}/user/guarantor-requests/${g1RequestId}/accept`,
    {},
    { headers: { Authorization: `Bearer ${g1Token}` } }
  );
  assert(g1AcceptRes.data.success, 'Guarantor 1 accepted the request');

  // Verify Points Allocated to Guarantor 1 (Should be ₹1,000 points - 100% of the pool)
  console.log('📊 11. Verifying Guarantor 1 points in DB...');
  const dbG1UserAfter = await User.findById(g1Id);
  const dbG1Points = await GuarantorPoints.findOne({ booking: testBooking._id, guarantor: g1Id, status: 'active' });
  
  assert(dbG1UserAfter.points === 1000, `Guarantor 1 points balance is exactly ₹${dbG1UserAfter.points} (expected ₹1,000)`);
  assert(dbG1Points && dbG1Points.pointsAllocated === 1000, `Guarantor 1 active points record holds ₹${dbG1Points?.pointsAllocated} (expected ₹1,000)`);

  const dbBookingAfterG1 = await Booking.findById(testBooking._id);
  assert(dbBookingAfterG1.guarantor.toString() === g1Id, 'Booking primary guarantor field correctly references Guarantor 1');

  // 13. Admin sends Guarantor 2 Request (to test redistribution)
  console.log('\n➕ 12. Admin sending guarantor request to Guarantor 2 (checking coin splitting)...');
  const g2RequestRes = await axios.post(
    `${BACKEND_URL}/admin/guarantor-requests`,
    {
      bookingId: testBooking._id.toString(),
      guarantorId: g2CustomId,
    },
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  assert(g2RequestRes.data.success, 'Admin guarantor request sent successfully to Guarantor 2');
  const g2RequestId = g2RequestRes.data.data.request._id;
  assert(g2RequestId, `Acquired Guarantor 2 request ID: ${g2RequestId}`);

  // 14. Guarantor 2 Accepts Request
  console.log('🤝 13. Guarantor 2 accepting the request...');
  const g2AcceptRes = await axios.post(
    `${BACKEND_URL}/user/guarantor-requests/${g2RequestId}/accept`,
    {},
    { headers: { Authorization: `Bearer ${g2Token}` } }
  );
  assert(g2AcceptRes.data.success, 'Guarantor 2 accepted the request');

  // Verify Redistribution: Both should have ₹500 (total pool ₹1,000 equally divided by 2)
  console.log('📊 14. Verifying both guarantors points (should be ₹500 each)...');
  const dbG1UserAfterSplit = await User.findById(g1Id);
  const dbG2UserAfterSplit = await User.findById(g2Id);
  
  const dbG1PointsAfterSplit = await GuarantorPoints.findOne({ booking: testBooking._id, guarantor: g1Id, status: 'active' });
  const dbG2PointsAfterSplit = await GuarantorPoints.findOne({ booking: testBooking._id, guarantor: g2Id, status: 'active' });

  assert(dbG1UserAfterSplit.points === 500, `Guarantor 1 points balance split: ₹${dbG1UserAfterSplit.points} (expected ₹500)`);
  assert(dbG2UserAfterSplit.points === 500, `Guarantor 2 points balance split: ₹${dbG2UserAfterSplit.points} (expected ₹500)`);
  
  assert(dbG1PointsAfterSplit && dbG1PointsAfterSplit.pointsAllocated === 500, `Guarantor 1 points record: ₹${dbG1PointsAfterSplit?.pointsAllocated} (expected ₹500)`);
  assert(dbG2PointsAfterSplit && dbG2PointsAfterSplit.pointsAllocated === 500, `Guarantor 2 points record: ₹${dbG2PointsAfterSplit?.pointsAllocated} (expected ₹500)`);
  assert(dbG1PointsAfterSplit.totalGuarantors === 2 && dbG2PointsAfterSplit.totalGuarantors === 2, 'Guarantor counts set to 2 in both records');

  // 15. Admin deletes/removes Guarantor 2 (Tests points reversal and redistribution back to Guarantor 1)
  console.log('\n🗑️ 15. Admin deleting/removing Guarantor 2 link (checking reversal & upward redistribution)...');
  const deleteG2Res = await axios.delete(
    `${BACKEND_URL}/admin/guarantor-requests/${g2RequestId}`,
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  assert(deleteG2Res.data.success, 'Admin deleted Guarantor 2 request successfully');

  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 500));

  // Verify: Guarantor 2 points should be reversed to 0. Guarantor 1 points should go back up to ₹1,000.
  console.log('📊 16. Verifying points after removing Guarantor 2...');
  const dbG1UserFinal = await User.findById(g1Id);
  const dbG2UserFinal = await User.findById(g2Id);
  
  const dbG1PointsFinal = await GuarantorPoints.findOne({ booking: testBooking._id, guarantor: g1Id, status: 'active' });
  const dbG2PointsFinal = await GuarantorPoints.findOne({ booking: testBooking._id, guarantor: g2Id }); // Can be reversed

  assert(dbG2UserFinal.points === 0, `Guarantor 2 points balance after removal: ₹${dbG2UserFinal.points} (expected ₹0 - successfully reversed!)`);
  assert(dbG2PointsFinal && dbG2PointsFinal.status === 'reversed', 'Guarantor 2 points record status is correctly "reversed"');
  
  assert(dbG1UserFinal.points === 1000, `Guarantor 1 points balance after upward redistribution: ₹${dbG1UserFinal.points} (expected ₹1,000 - successfully redistributed!)`);
  assert(dbG1PointsFinal && dbG1PointsFinal.pointsAllocated === 1000, `Guarantor 1 active points record recalculated: ₹${dbG1PointsFinal?.pointsAllocated} (expected ₹1,000)`);
  assert(dbG1PointsFinal.totalGuarantors === 1, 'Guarantor count updated back to 1 for remaining guarantor');

  const dbBookingFinal = await Booking.findById(testBooking._id);
  assert(dbBookingFinal.guarantor.toString() === g1Id, 'Booking primary guarantor field still references Guarantor 1');

  // 16. Admin cancels booking (tests complete points reversal)
  console.log('\n❌ 17. Admin cancelling booking (checking total points reversal on booking cancel)...');
  const cancelBookingRes = await axios.patch(
    `${BACKEND_URL}/admin/bookings/${testBooking._id.toString()}`,
    {
      status: 'cancelled',
      cancellationReason: 'Cancelled by test script',
    },
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  assert(cancelBookingRes.data.success, 'Booking cancelled successfully by Admin');

  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 500));

  // Verify: Guarantor 1 points should be reversed to 0
  console.log('📊 18. Verifying Guarantor 1 points after booking cancellation...');
  const dbG1UserCancelled = await User.findById(g1Id);
  const dbG1PointsCancelled = await GuarantorPoints.findOne({ booking: testBooking._id, guarantor: g1Id });

  assert(dbG1UserCancelled.points === 0, `Guarantor 1 points balance after booking cancel: ₹${dbG1UserCancelled.points} (expected ₹0 - successfully reversed!)`);
  assert(dbG1PointsCancelled && dbG1PointsCancelled.status === 'reversed', 'Guarantor 1 points record status is correctly "reversed"');

  console.log('\n🎉 ALL END-TO-END GUARANTOR FLOW AND COINS BREAKDOWN TESTS PASSED SUCCESSFULLY! The flow is robust and perfectly correct.');

  // Clean up
  console.log('🧹 Cleaning up test users and bookings...');
  await Booking.deleteMany({ user: { $in: testUserIds } });
  await GuarantorRequest.deleteMany({ $or: [{ user: { $in: testUserIds } }, { guarantor: { $in: testUserIds } }] });
  await GuarantorPoints.deleteMany({ guarantor: { $in: testUserIds } });
  await User.deleteMany({ $or: [{ phone: { $in: testPhones } }, { email: { $in: testEmails } }] });
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
