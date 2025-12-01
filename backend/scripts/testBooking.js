import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import User from '../models/User.js';
import { connectDB } from '../config/database.js';

// Load environment variables
dotenv.config();

/**
 * Create Test Booking
 * This script creates a test booking for testing purposes
 */
const createTestBooking = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');

    // Get first available user
    const user = await User.findOne({ role: 'user' });
    if (!user) {
      console.error('❌ No user found in database. Please create a user first.');
      process.exit(1);
    }
    console.log('👤 Using user:', user.email);

    // Get first available car
    const car = await Car.findOne({ isAvailable: true, status: 'active' });
    if (!car) {
      console.error('❌ No available car found in database. Please add a car first.');
      process.exit(1);
    }
    console.log('🚗 Using car:', `${car.brand} ${car.model}`);

    // Calculate dates (tomorrow to day after tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    dayAfter.setHours(18, 0, 0, 0);

    const totalDays = Math.ceil((dayAfter - tomorrow) / (1000 * 60 * 60 * 24));

    // Calculate pricing
    const basePrice = car.pricePerDay || 1000;
    let totalPrice = basePrice * totalDays;

    // Check if weekend
    const dayOfWeek = tomorrow.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendMultiplier = isWeekend ? 0.15 : 0;

    // Apply multipliers
    totalPrice = totalPrice * (1 + weekendMultiplier);

    // Generate booking ID (similar to pre-save hook)
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    let bookingId = `BK${timestamp}${random}`;
    
    // Ensure uniqueness
    const existing = await Booking.findOne({ bookingId });
    if (existing) {
      bookingId = `BK${Date.now()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    }

    // Create booking
    const booking = new Booking({
      bookingId, // Set bookingId explicitly
      user: user._id,
      car: car._id,
      tripStart: {
        location: '123 Test Street, Test City, Test State 123456',
        coordinates: {
          latitude: 28.6139,
          longitude: 77.2090,
        },
        date: tomorrow,
        time: '10:00',
      },
      tripEnd: {
        location: '456 Test Avenue, Test City, Test State 123456',
        coordinates: {
          latitude: 28.7041,
          longitude: 77.1025,
        },
        date: dayAfter,
        time: '18:00',
      },
      totalDays,
      pricing: {
        basePrice,
        totalPrice: Math.round(totalPrice),
        advancePayment: 0,
        remainingPayment: Math.round(totalPrice),
        weekendMultiplier,
        timeOfDayMultiplier: 0,
        finalPrice: Math.round(totalPrice),
      },
      paymentOption: 'full',
      paymentStatus: 'pending',
      paidAmount: 0,
      remainingAmount: Math.round(totalPrice),
      specialRequests: 'This is a test booking created by test script',
      status: 'pending',
    });

    await booking.save();

    // Populate booking details
    await booking.populate('car', 'brand model year color images pricePerDay');
    await booking.populate('user', 'name phone email');

    console.log('\n✅ Test Booking Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Booking ID:', booking.bookingId);
    console.log('👤 User:', booking.user.name, `(${booking.user.email})`);
    console.log('🚗 Car:', `${booking.car.brand} ${booking.car.model} ${booking.car.year}`);
    console.log('📅 Start:', tomorrow.toLocaleString('en-IN'));
    console.log('📅 End:', dayAfter.toLocaleString('en-IN'));
    console.log('⏱️  Duration:', totalDays, 'day(s)');
    console.log('💰 Total Price: ₹', booking.pricing.totalPrice);
    console.log('📍 Pickup:', booking.tripStart.location);
    console.log('📍 Drop:', booking.tripEnd.location);
    console.log('📊 Status:', booking.status);
    console.log('💳 Payment Status:', booking.paymentStatus);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ Booking saved to database with ID:', booking._id);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test booking:', error);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:');
      Object.keys(error.errors).forEach(key => {
        console.error(`  - ${key}: ${error.errors[key].message}`);
      });
    }
    process.exit(1);
  }
};

// Run test booking creation
createTestBooking();

