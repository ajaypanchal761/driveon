import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import GuarantorPoints from '../models/GuarantorPoints.js';
import Booking from '../models/Booking.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const debugUser = async () => {
  try {
    await connectDB();

    const email = 'suhanipathak2192@gmail.com';
    const user = await User.findOne({ $or: [{ email }, { phone: '9343365100' }] });

    if (!user) {
      console.log(`❌ User not found with email ${email}`);
      process.exit(1);
    }

    console.log('👤 USER DETAILS:');
    console.log(' - Name:', user.name);
    console.log(' - Points (user.points):', user.points);
    console.log(' - totalPointsEarned:', user.totalPointsEarned);
    console.log(' - totalPointsUsed:', user.totalPointsUsed);
    console.log(' - guarantorId:', user.guarantorId);

    console.log('\n📊 GUARANTOR POINTS RECORDS IN DB:');
    const pointsRecords = await GuarantorPoints.find({ guarantor: user._id });
    console.log(`Found ${pointsRecords.length} records:`);
    pointsRecords.forEach((r, idx) => {
      console.log(`\nRecord #${idx + 1}:`);
      console.log(' - ID:', r._id);
      console.log(' - booking:', r.booking);
      console.log(' - pointsAllocated:', r.pointsAllocated);
      console.log(' - status:', r.status);
      console.log(' - isAdjustment:', r.isAdjustment);
      console.log(' - reason:', r.reason);
    });

    console.log('\n🚗 BOOKINGS WHERE USER APPLIED POINTS:');
    const bookings = await Booking.find({ user: user._id, 'pricing.pointsUsed': { $gt: 0 } });
    console.log(`Found ${bookings.length} bookings:`);
    bookings.forEach((b, idx) => {
      console.log(`\nBooking #${idx + 1}:`);
      console.log(' - bookingId:', b.bookingId);
      console.log(' - status:', b.status);
      console.log(' - pointsUsed:', b.pricing?.pointsUsed);
      console.log(' - pointsDiscount:', b.pricing?.pointsDiscount);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugUser();
