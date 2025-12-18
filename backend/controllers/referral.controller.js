import User from '../models/User.js';
import Booking from '../models/Booking.js';

/**
 * Process referral signup completion
 * Awards points to the referrer when a referred user completes signup (verifies OTP)
 * 
 * @param {string} userId - The ID of the user who completed signup
 * @returns {Promise<void>}
 */
export const processReferralSignup = async (userId) => {
  try {
    if (!userId) {
      console.log('⚠️ No userId provided for referral signup');
      return;
    }

    // Find the user who completed signup
    const user = await User.findById(userId);
    if (!user) {
      console.log(`⚠️ User not found: ${userId}`);
      return;
    }

    // Check if user was referred by someone
    if (!user.referredBy) {
      console.log(`ℹ️ User ${userId} was not referred, skipping referral signup processing`);
      return;
    }

    // Find the referrer
    const referrer = await User.findById(user.referredBy);
    if (!referrer) {
      console.log(`⚠️ Referrer not found: ${user.referredBy}`);
      return;
    }

    // Award points for signup (50 points as per frontend expectations)
    const pointsForSignup = 50;
    referrer.points = (referrer.points || 0) + pointsForSignup;
    referrer.totalPointsEarned = (referrer.totalPointsEarned || 0) + pointsForSignup;
    await referrer.save();

    console.log(`✅ Referral signup processed:`);
    console.log(`   - User: ${user.name || user.email} (${userId})`);
    console.log(`   - Referrer: ${referrer.name || referrer.email} (${user.referredBy})`);
    console.log(`   - Points awarded: ${pointsForSignup}`);
    console.log(`   - Referrer total points: ${referrer.points}`);
  } catch (error) {
    console.error('❌ Error processing referral signup:', error);
    // Don't throw error - we don't want to fail the signup if referral processing fails
    // Just log the error and return
  }
};

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

/**
 * @desc    Get user's referral dashboard data
 * @route   GET /api/referrals/dashboard
 * @access  Private
 */
export const getReferralDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's referral code and points
    const user = await User.findById(userId).select('referralCode points totalPointsEarned totalPointsUsed');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get all users referred by this user
    const referredUsers = await User.find({ referredBy: userId })
      .select('name email createdAt')
      .sort({ createdAt: -1 });

    // Calculate statistics for each referred user
    const referrals = await Promise.all(
      referredUsers.map(async (referredUser) => {
        // Count completed trips
        const tripsCompleted = await Booking.countDocuments({
          user: referredUser._id,
          status: 'completed',
        });

        // Calculate points earned from this referral
        // 50 points for signup + 50 points for first completed trip
        let pointsEarned = 50; // Signup points
        if (tripsCompleted > 0) {
          pointsEarned += 50; // First trip completion points
        }

        // Determine status: active if has completed trips, pending otherwise
        const status = tripsCompleted > 0 ? 'active' : 'pending';

        return {
          id: referredUser._id,
          name: referredUser.name || referredUser.email.split('@')[0],
          email: referredUser.email,
          signupDate: referredUser.createdAt,
          tripsCompleted,
          pointsEarned,
          status,
        };
      })
    );

    // Calculate total statistics
    const totalReferrals = referrals.length;
    const activeReferrals = referrals.filter(r => r.status === 'active').length;
    const totalPointsFromReferrals = referrals.reduce((sum, r) => sum + r.pointsEarned, 0);

    res.status(200).json({
      success: true,
      data: {
        referralCode: user.referralCode || '',
        points: user.points || 0,
        totalPointsEarned: user.totalPointsEarned || 0,
        totalPointsUsed: user.totalPointsUsed || 0,
        referrals,
        statistics: {
          totalReferrals,
          activeReferrals,
          totalPointsFromReferrals,
        },
      },
    });
  } catch (error) {
    console.error('Get referral dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching referral dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get user's referrals list
 * @route   GET /api/referrals
 * @access  Private
 */
export const getMyReferrals = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all users referred by this user
    const referredUsers = await User.find({ referredBy: userId })
      .select('name email createdAt')
      .sort({ createdAt: -1 });

    // Calculate statistics for each referred user
    const referrals = await Promise.all(
      referredUsers.map(async (referredUser) => {
        // Count completed trips
        const tripsCompleted = await Booking.countDocuments({
          user: referredUser._id,
          status: 'completed',
        });

        // Calculate points earned from this referral
        let pointsEarned = 50; // Signup points
        if (tripsCompleted > 0) {
          pointsEarned += 50; // First trip completion points
        }

        // Determine status
        const status = tripsCompleted > 0 ? 'active' : 'pending';

        return {
          id: referredUser._id,
          name: referredUser.name || referredUser.email.split('@')[0],
          email: referredUser.email,
          signupDate: referredUser.createdAt,
          tripsCompleted,
          pointsEarned,
          status,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        referrals,
      },
    });
  } catch (error) {
    console.error('Get my referrals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching referrals',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

