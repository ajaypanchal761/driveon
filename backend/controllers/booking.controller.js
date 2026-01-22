import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import AddOnServices from '../models/AddOnServices.js';
import { processReferralTripCompletion } from './referral.controller.js';
import { reverseGuarantorPoints } from '../utils/guarantorPoints.js';
import { sendPushNotification, sendAdminNotification } from '../services/firebase.service.js';

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = async (req, res) => {
  try {
    const {
      carId,
      tripStart,
      tripEnd,
      paymentOption,
      specialRequests,
      couponCode,
      addOnServices, // Optional: { driver: 0, bodyguard: 0, gunmen: 0, bouncer: 0 }
    } = req.body;

    const userId = req.user._id;

    // Log incoming request for debugging
    console.log('📥 Create booking request:', {
      carId,
      tripStart: tripStart ? {
        location: tripStart.location,
        date: tripStart.date,
        time: tripStart.time,
        hasCoordinates: !!tripStart.coordinates,
      } : null,
      tripEnd: tripEnd ? {
        location: tripEnd.location,
        date: tripEnd.date,
        time: tripEnd.time,
        hasCoordinates: !!tripEnd.coordinates,
      } : null,
      paymentOption,
      userId: userId.toString(),
    });

    // Validate required fields
    if (!carId || !tripStart || !tripEnd) {
      console.error('❌ Missing required fields:', { carId: !!carId, tripStart: !!tripStart, tripEnd: !!tripEnd });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: carId, tripStart, tripEnd',
      });
    }

    // Validate tripStart and tripEnd structure
    if (!tripStart.date || !tripStart.time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields in tripStart: date, time',
        details: {
          date: tripStart.date || 'missing',
          time: tripStart.time || 'missing',
        },
      });
    }

    if (!tripEnd.date || !tripEnd.time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields in tripEnd: date, time',
        details: {
          date: tripEnd.date || 'missing',
          time: tripEnd.time || 'missing',
        },
      });
    }

    // Set default location if not provided
    const pickupLocation = tripStart.location && tripStart.location.trim() !== ''
      ? tripStart.location.trim()
      : 'Location to be confirmed';
    const dropLocation = tripEnd.location && tripEnd.location.trim() !== ''
      ? tripEnd.location.trim()
      : 'Location to be confirmed';

    // Validate trip dates - combine date and time for accurate comparison
    let startDate = new Date(tripStart.date);
    let endDate = new Date(tripEnd.date);

    // Validate date objects
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trip start date format',
        received: tripStart.date,
      });
    }

    if (isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trip end date format',
        received: tripEnd.date,
      });
    }

    // If time is provided, combine date and time
    if (tripStart.time) {
      const timeParts = tripStart.time.split(':');
      if (timeParts.length >= 2) {
        const hours = parseInt(timeParts[0], 10) || 0;
        const minutes = parseInt(timeParts[1], 10) || 0;
        startDate.setHours(hours, minutes, 0, 0);
      } else {
        startDate.setHours(0, 0, 0, 0);
      }
    } else {
      startDate.setHours(0, 0, 0, 0);
    }

    if (tripEnd.time) {
      const timeParts = tripEnd.time.split(':');
      if (timeParts.length >= 2) {
        const hours = parseInt(timeParts[0], 10) || 0;
        const minutes = parseInt(timeParts[1], 10) || 0;
        endDate.setHours(hours, minutes, 0, 0);
      } else {
        endDate.setHours(23, 59, 59, 999);
      }
    } else {
      endDate.setHours(23, 59, 59, 999); // Set to end of day if no time provided
    }

    const now = new Date();
    now.setSeconds(0, 0); // Remove seconds for comparison

    // Check if start date is in the past (allow same day if time is in future)
    if (startDate < now) {
      return res.status(400).json({
        success: false,
        message: 'Trip start date and time cannot be in the past',
      });
    }

    // Check if end date is after start date (must be at least 1 hour later)
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'Trip end date and time must be after start date and time',
      });
    }

    // Calculate total days
    const diffTime = Math.abs(endDate - startDate);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Get car details
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    // Check if car is available
    if (!car.isAvailable || car.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Car is not available for booking',
      });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      car: carId,
      status: { $in: ['pending', 'confirmed', 'active'] },
      $or: [
        {
          'tripStart.date': { $lte: endDate },
          'tripEnd.date': { $gte: startDate },
        },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Car is already booked for the selected dates',
      });
    }

    // Calculate pricing
    const basePrice = car.pricePerDay || 0;
    let totalPrice = basePrice * totalDays;

    // Apply dynamic pricing multipliers
    const pickupDate = new Date(tripStart.date);
    const dayOfWeek = pickupDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendMultiplier = isWeekend ? 0.15 : 0; // 15% weekend surcharge

    // No peak hour surcharge applied

    // Apply multipliers
    totalPrice = totalPrice * (1 + weekendMultiplier);

    // Calculate add-on services total
    let addOnServicesTotal = 0;
    let addOnServicesData = {
      driver: 0,
      bodyguard: 0,
      gunmen: 0,
      bouncer: 0,
    };

    if (addOnServices && typeof addOnServices === 'object') {
      try {
        // Get current prices from database
        const prices = await AddOnServices.getPrices();

        // Validate and calculate add-on services
        const quantities = {
          driver: Math.max(0, parseInt(addOnServices.driver) || 0),
          bodyguard: Math.max(0, parseInt(addOnServices.bodyguard) || 0),
          gunmen: Math.max(0, parseInt(addOnServices.gunmen) || 0),
          bouncer: Math.max(0, parseInt(addOnServices.bouncer) || 0),
        };

        // Calculate total for add-on services
        addOnServicesTotal =
          (quantities.driver * prices.driver) +
          (quantities.bodyguard * prices.bodyguard) +
          (quantities.gunmen * prices.gunmen) +
          (quantities.bouncer * prices.bouncer);

        addOnServicesData = quantities;

        console.log('✅ Add-on services calculated:', {
          quantities,
          prices: {
            driver: prices.driver,
            bodyguard: prices.bodyguard,
            gunmen: prices.gunmen,
            bouncer: prices.bouncer,
          },
          total: addOnServicesTotal,
        });
      } catch (addOnError) {
        console.error('❌ Error calculating add-on services:', addOnError);
        // Continue without add-on services if there's an error
      }
    }

    // Add add-on services to total price
    totalPrice = totalPrice + addOnServicesTotal;

    // Handle coupon discount if provided
    let couponDiscount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      try {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (coupon) {
          // Get car details for coupon validation
          const carType = car.carType;

          // Check if coupon can be applied
          const canApply = coupon.canBeApplied(totalPrice, carId, userId, carType);
          if (canApply.valid) {
            // Calculate discount
            couponDiscount = coupon.calculateDiscount(totalPrice);
            appliedCoupon = coupon;

            // Apply discount to total price
            totalPrice = Math.max(0, totalPrice - couponDiscount);

            console.log('✅ Coupon applied:', {
              code: coupon.code,
              discount: couponDiscount,
              newTotal: totalPrice,
            });
          } else {
            console.warn('⚠️ Coupon cannot be applied:', canApply.message);
            return res.status(400).json({
              success: false,
              message: canApply.message,
            });
          }
        } else {
          return res.status(404).json({
            success: false,
            message: 'Invalid coupon code',
          });
        }
      } catch (couponError) {
        console.error('❌ Coupon validation error:', couponError);
        return res.status(400).json({
          success: false,
          message: 'Error validating coupon',
          error: process.env.NODE_ENV === 'development' ? couponError.message : undefined,
        });
      }
    }

    // Calculate advance payment (35% for advance option)
    const advancePayment = paymentOption === 'advance' ? (totalPrice * 0.35) : 0;
    const remainingPayment = totalPrice - advancePayment;
    const finalPrice = paymentOption === 'full' ? totalPrice : advancePayment;

    // Prepare coordinates structure
    const startCoordinates = tripStart.coordinates || {};
    const endCoordinates = tripEnd.coordinates || {};

    // Ensure coordinates have proper structure (latitude/longitude as numbers or omit if not provided)
    // Mongoose will handle undefined values, but we need to make sure we don't send empty objects
    const formattedStartCoordinates = {};
    if (typeof startCoordinates.latitude === 'number' && !isNaN(startCoordinates.latitude)) {
      formattedStartCoordinates.latitude = startCoordinates.latitude;
    }
    if (typeof startCoordinates.longitude === 'number' && !isNaN(startCoordinates.longitude)) {
      formattedStartCoordinates.longitude = startCoordinates.longitude;
    }

    const formattedEndCoordinates = {};
    if (typeof endCoordinates.latitude === 'number' && !isNaN(endCoordinates.latitude)) {
      formattedEndCoordinates.latitude = endCoordinates.latitude;
    }
    if (typeof endCoordinates.longitude === 'number' && !isNaN(endCoordinates.longitude)) {
      formattedEndCoordinates.longitude = endCoordinates.longitude;
    }

    console.log('📍 Coordinates formatted:', {
      start: formattedStartCoordinates,
      end: formattedEndCoordinates,
    });

    // Create booking
    const booking = new Booking({
      user: userId,
      car: carId,
      tripStart: {
        location: pickupLocation,
        coordinates: formattedStartCoordinates,
        date: startDate,
        time: tripStart.time || '10:00',
      },
      tripEnd: {
        location: dropLocation,
        coordinates: formattedEndCoordinates,
        date: endDate,
        time: tripEnd.time || '18:00',
      },
      totalDays,
      pricing: {
        basePrice,
        totalPrice: totalPrice + couponDiscount, // Original total before discount
        advancePayment,
        remainingPayment,
        weekendMultiplier,
        timeOfDayMultiplier: 0,
        discount: couponDiscount,
        finalPrice,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        addOnServicesTotal,
      },
      addOnServices: addOnServicesData,
      paymentOption: paymentOption || 'full',
      paymentStatus: 'pending',
      paidAmount: 0,
      remainingAmount: remainingPayment,
      specialRequests: specialRequests || '',
      status: 'pending',
    });

    // Log booking object before saving
    console.log('📝 Booking object to save:', {
      user: booking.user?.toString(),
      car: booking.car?.toString(),
      tripStart: {
        location: booking.tripStart?.location,
        date: booking.tripStart?.date,
        time: booking.tripStart?.time,
      },
      tripEnd: {
        location: booking.tripEnd?.location,
        date: booking.tripEnd?.date,
        time: booking.tripEnd?.time,
      },
      totalDays: booking.totalDays,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    });

    try {
      await booking.save();
      console.log('✅ Booking saved successfully:', booking.bookingId);

      // Send Admin Notification
      sendAdminNotification(
        'New Booking Alert 🚗',
        `New booking #${booking.bookingId || booking._id} created by ${req.user.name || 'User'}.`,
        {
          type: 'new_booking',
          bookingId: (booking.bookingId || booking._id).toString(),
          click_action: 'FLUTTER_NOTIFICATION_CLICK'
        }
      ).catch(err => console.error('Failed to send admin booking notification:', err));

      // Increment coupon usage count if coupon was applied
      if (appliedCoupon) {
        await appliedCoupon.incrementUsage();
        console.log('✅ Coupon usage incremented:', appliedCoupon.code);
      }
    } catch (saveError) {
      console.error('❌ Booking save error:', saveError);
      console.error('Save error name:', saveError.name);
      console.error('Save error message:', saveError.message);

      if (saveError.name === 'ValidationError') {
        const validationErrors = Object.keys(saveError.errors || {}).map(key => {
          const err = saveError.errors[key];
          return {
            field: key,
            message: err.message,
            value: err.value,
            kind: err.kind,
          };
        });

        console.error('Validation errors:', validationErrors);

        return res.status(400).json({
          success: false,
          message: 'Validation error while creating booking',
          errors: validationErrors,
          error: process.env.NODE_ENV === 'development' ? saveError.message : undefined,
        });
      }
      throw saveError; // Re-throw if not a validation error
    }

    // Populate car and user details
    await booking.populate('car', 'brand model year color images pricePerDay');
    await booking.populate('user', 'name phone email');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking,
      },
    });
  } catch (error) {
    console.error('❌ Create booking error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      body: req.body,
    });

    // Handle specific error types
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors || {}).map(key => ({
        field: key,
        message: error.errors[key].message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation error while creating booking',
        errors: validationErrors,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }

    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID already exists. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get user bookings
 * @route   GET /api/bookings
 * @access  Private
 */
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    console.log('📥 Get User Bookings Request:', {
      userId: userId?.toString(),
      userEmail: req.user?.email,
      status,
      page,
      limit,
    });

    const query = { user: userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    console.log('🔍 Booking Query:', JSON.stringify(query, null, 2));

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // First, check total bookings for this user
    const totalBookings = await Booking.countDocuments({ user: userId });
    console.log(`📊 Total bookings for user ${userId}: ${totalBookings}`);

    // Debug: Check all bookings in database to see user IDs
    if (totalBookings === 0) {
      const allBookings = await Booking.find({}).select('user bookingId').limit(5);
      console.log('🔍 Sample bookings in database (for debugging):');
      allBookings.forEach((b, idx) => {
        console.log(`  Booking ${idx + 1}: user=${b.user?.toString() || b.user}, bookingId=${b.bookingId}`);
      });
    }

    const bookings = await Booking.find(query)
      .populate('car', 'brand model year color images pricePerDay')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    console.log(`✅ Found ${bookings.length} bookings for user ${userId}`);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('❌ Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private
 */
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(id)
      .populate('car', 'brand model year color images pricePerDay location owner')
      .populate('user', 'name phone email')
      .populate('guarantor', 'name phone email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user has access to this booking
    if (booking.user._id.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: {
        booking,
      },
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update booking status
 * @route   PATCH /api/bookings/:id/status
 * @access  Private
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;
    const userId = req.user._id;

    const booking = await Booking.findById(id).populate('user');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check permissions
    const bookingUserId = booking.user._id ? booking.user._id.toString() : booking.user.toString();
    if (bookingUserId !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Update status
    booking.status = status;
    let notificationTitle = "";
    let notificationBody = "";

    if (status === 'cancelled') {
      booking.cancelledBy = req.user.role === 'admin' ? 'admin' : 'user';
      booking.cancelledAt = new Date();
      booking.cancellationReason = cancellationReason || '';
      booking.isTrackingActive = false;
      booking.tripStatus = 'cancelled';

      notificationTitle = "Booking Cancelled";
      notificationBody = "Booking Cancelled. Refund initiated.";

      // Reverse guarantor points for cancelled booking
      try {
        await reverseGuarantorPoints(booking._id.toString(), cancellationReason || 'Booking cancelled');
      } catch (pointsError) {
        console.error('Error reversing guarantor points:', pointsError);
        // Don't fail booking cancellation if points reversal fails
      }
    } else if (status === 'confirmed') {
      booking.confirmedAt = new Date();
      notificationTitle = "Booking Confirmed";
      notificationBody = `Yay! Your ride #${booking.bookingId || id} is confirmed!`;
    } else if (status === 'completed') {
      booking.completedAt = new Date();
      booking.tripStatus = 'completed';
      booking.isTrackingActive = false;
      notificationTitle = "Trip Completed";
      notificationBody = "Trip Completed. Invoice generated.";

      // Process referral trip completion
      try {
        await processReferralTripCompletion(booking.user._id.toString());
      } catch (referralError) {
        console.error('Error processing referral trip completion:', referralError);
        // Don't fail status update if referral processing fails
      }
    }

    await booking.save();

    // Send Notification
    if (notificationTitle && booking.user) {
      const uId = booking.user._id || booking.user;
      // Send to Web
      sendPushNotification(uId, notificationTitle, notificationBody, { bookingId: booking.bookingId || id }, false);
      // Send to Mobile
      sendPushNotification(uId, notificationTitle, notificationBody, { bookingId: booking.bookingId || id }, true);
    }

    res.json({
      success: true,
      message: 'Booking status updated',
      data: {
        booking,
      },
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Start trip (enable tracking)
 * @route   POST /api/bookings/:id/start
 * @access  Private
 */
export const startTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(id).populate('user');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check permissions
    const bookingUserId = booking.user._id ? booking.user._id.toString() : booking.user.toString();
    if (bookingUserId !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Validate booking status
    if (booking.status !== 'confirmed' && booking.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Booking must be confirmed to start trip',
      });
    }

    // Check payment status
    if (booking.paymentStatus === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Payment must be completed before starting trip',
      });
    }

    // Update booking
    booking.status = 'active';
    booking.tripStatus = 'started';
    booking.isTrackingActive = true;
    booking.trackingStartedAt = new Date();
    booking.tripStartedAt = new Date();

    await booking.save();

    // Send Notification
    if (booking.user) {
      const uId = booking.user._id || booking.user;
      const title = "Trip Started";
      const body = "Your trip has started. Enjoy the ride!";
      // Send to Web
      sendPushNotification(uId, title, body, { bookingId: booking.bookingId || id }, false);
      // Send to Mobile
      sendPushNotification(uId, title, body, { bookingId: booking.bookingId || id }, true);
    }

    res.json({
      success: true,
      message: 'Trip started successfully',
      data: {
        booking,
      },
    });
  } catch (error) {
    console.error('Start trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start trip',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    End trip (disable tracking)
 * @route   POST /api/bookings/:id/end
 * @access  Private
 */
export const endTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(id).populate('user');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check permissions
    const bookingUserId = booking.user._id ? booking.user._id.toString() : booking.user.toString();
    if (bookingUserId !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Update booking
    booking.tripStatus = 'completed';
    booking.isTrackingActive = false;
    booking.trackingEndedAt = new Date();
    booking.tripEndedAt = new Date();
    booking.status = 'completed';
    booking.completedAt = new Date();

    await booking.save();

    // Send Notification
    if (booking.user) {
      const uId = booking.user._id || booking.user;
      const title = "Trip Completed";
      const body = "Trip Completed. Invoice generated.";
      // Send to Web
      sendPushNotification(uId, title, body, { bookingId: booking.bookingId || id }, false);
      // Send to Mobile
      sendPushNotification(uId, title, body, { bookingId: booking.bookingId || id }, true);
    }

    // Process referral trip completion
    try {
      await processReferralTripCompletion(booking.user._id.toString());
    } catch (referralError) {
      console.error('Error processing referral trip completion:', referralError);
      // Don't fail booking completion if referral processing fails
    }

    res.json({
      success: true,
      message: 'Trip ended successfully',
      data: {
        booking,
      },
    });
  } catch (error) {
    console.error('End trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end trip',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};


/**
 * @desc    Update user location for active booking
 * @route   POST /api/bookings/:id/location
 * @access  Private
 */
export const updateBookingLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude, address } = req.body;
    const userId = req.user._id;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check permissions
    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Check if tracking is active
    if (!booking.isTrackingActive) {
      return res.status(400).json({
        success: false,
        message: 'Tracking is not active for this booking',
      });
    }

    // Update location
    booking.currentLocation = {
      latitude,
      longitude,
      address: address || '',
      updatedAt: new Date(),
    };
    booking.lastLocationUpdate = new Date();

    await booking.save();

    res.json({
      success: true,
      message: 'Location updated',
      data: {
        location: booking.currentLocation,
      },
    });
  } catch (error) {
    console.error('Update booking location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

