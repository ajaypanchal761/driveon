import User from '../models/User.js';
import Booking from '../models/Booking.js';

/**
 * Process referral trip completion
 * Awards points to the referrer when a referred user completes their first trip
 * 
 * @param {string} userId - The ID of the user who completed the trip
 * @returns {Promise<void>}
 */
export const processReferralTripCompletion = async (userId) => {
  try {
    if (!userId) {
      console.log('⚠️ No userId provided for referral trip completion');
      return;
    }

    // Find the user who completed the trip
    const user = await User.findById(userId);
    if (!user) {
      console.log(`⚠️ User not found: ${userId}`);
      return;
    }

    // Check if user was referred by someone
    if (!user.referredBy) {
      console.log(`ℹ️ User ${userId} was not referred, skipping referral processing`);
      return;
    }

    // Check if this is the user's first completed trip
    const completedBookings = await Booking.countDocuments({
      user: userId,
      status: 'completed',
    });

    // Only award points for the first completed trip
    if (completedBookings !== 1) {
      console.log(`ℹ️ User ${userId} has ${completedBookings} completed trips, not first trip. Skipping referral points.`);
      return;
    }

    // Find the referrer
    const referrer = await User.findById(user.referredBy);
    if (!referrer) {
      console.log(`⚠️ Referrer not found: ${user.referredBy}`);
      return;
    }

    // Award points for trip completion (50 points as per frontend expectations)
    const pointsForTrip = 50;
    referrer.points = (referrer.points || 0) + pointsForTrip;
    referrer.totalPointsEarned = (referrer.totalPointsEarned || 0) + pointsForTrip;
    await referrer.save();

    console.log(`✅ Referral trip completion processed:`);
    console.log(`   - User: ${user.name || user.email} (${userId})`);
    console.log(`   - Referrer: ${referrer.name || referrer.email} (${user.referredBy})`);
    console.log(`   - Points awarded: ${pointsForTrip}`);
    console.log(`   - Referrer total points: ${referrer.points}`);
  } catch (error) {
    console.error('❌ Error processing referral trip completion:', error);
    // Don't throw error - we don't want to fail the booking completion if referral processing fails
    // Just log the error and return
  }
};

