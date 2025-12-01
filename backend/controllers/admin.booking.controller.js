import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import User from '../models/User.js';

/**
 * @desc    Get all bookings (Admin)
 * @route   GET /api/admin/bookings
 * @access  Private (Admin)
 */
export const getAllBookings = async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      tripStatus,
      page = 1,
      limit = 20,
      search,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }

    if (tripStatus && tripStatus !== 'all') {
      query.tripStatus = tripStatus;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.bookingDate = {};
      if (dateFrom) {
        query.bookingDate.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.bookingDate.$lte = new Date(dateTo);
      }
    }

    // Search filter
    if (search) {
      query.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const bookings = await Booking.find(query)
      .populate('user', 'name phone email')
      .populate('car', 'brand model year registrationNumber')
      .populate('guarantor', 'name phone email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    // Calculate statistics
    const stats = {
      total,
      pending: await Booking.countDocuments({ ...query, status: 'pending' }),
      confirmed: await Booking.countDocuments({ ...query, status: 'confirmed' }),
      active: await Booking.countDocuments({ ...query, status: 'active' }),
      completed: await Booking.countDocuments({ ...query, status: 'completed' }),
      cancelled: await Booking.countDocuments({ ...query, status: 'cancelled' }),
      totalRevenue: await Booking.aggregate([
        { $match: { ...query, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$paidAmount' } } },
      ]).then(result => result[0]?.total || 0),
    };

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
        stats,
      },
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get booking by ID (Admin)
 * @route   GET /api/admin/bookings/:id
 * @access  Private (Admin)
 * @note    Supports both MongoDB ObjectId and bookingId string
 */
export const getBookingById = async (req, res) => {
  try {
    console.log('🔍 Get booking by ID - Controller called');
    console.log('📋 Request details:', {
      method: req.method,
      url: req.url,
      originalUrl: req.originalUrl,
      params: req.params,
      query: req.query,
    });

    const { id } = req.params;

    console.log('🔍 Get booking by ID request:', { id, params: req.params });

    if (!id || id.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required',
      });
    }

    const trimmedId = id.trim();
    let booking = null;

    // Check if it's a valid MongoDB ObjectId format (24 hex characters)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(trimmedId);
    console.log('📋 Booking ID format check:', { trimmedId, isValidObjectId });

    if (isValidObjectId) {
      // Try to find by MongoDB _id first
      try {
        console.log('🔎 Searching by MongoDB _id...');
        booking = await Booking.findById(trimmedId)
          .populate('user', 'name phone email age gender address profilePhoto')
          .populate('car', 'brand model year color registrationNumber images pricePerDay owner')
          .populate('guarantor', 'name phone email');
        
        if (booking) {
          console.log('✅ Booking found by _id:', booking.bookingId || booking._id);
        }
      } catch (findError) {
        // If findById fails, log and continue to search by bookingId
        console.log('⚠️ findById failed, trying bookingId search:', findError.message);
      }
    }

    // If not found by _id, try searching by bookingId string
    if (!booking) {
      try {
        console.log('🔎 Searching by bookingId string...');
        booking = await Booking.findOne({ bookingId: trimmedId })
          .populate('user', 'name phone email age gender address profilePhoto')
          .populate('car', 'brand model year color registrationNumber images pricePerDay owner')
          .populate('guarantor', 'name phone email');
        
        if (booking) {
          console.log('✅ Booking found by bookingId:', booking.bookingId);
        } else {
          console.log('❌ No booking found with bookingId:', trimmedId);
        }
      } catch (findOneError) {
        console.error('❌ Error searching by bookingId:', findOneError);
        console.error('Error details:', {
          message: findOneError.message,
          stack: findOneError.stack,
        });
        // Return error instead of 404 if there's a database error
        return res.status(500).json({
          success: false,
          message: 'Error searching for booking',
          error: process.env.NODE_ENV === 'development' ? findOneError.message : undefined,
        });
      }
    }

    if (!booking) {
      console.log('❌ Booking not found for ID:', trimmedId);
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    console.log('✅ Returning booking:', booking.bookingId || booking._id);
    res.json({
      success: true,
      data: {
        booking,
      },
    });
  } catch (error) {
    console.error('❌ Get booking error:', error);
    console.error('Error stack:', error.stack);
    console.error('Request params:', req.params);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update booking (Admin)
 * @route   PATCH /api/admin/bookings/:id
 * @access  Private (Admin)
 */
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, cancellationReason, paymentStatus, refundAmount } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Update status if provided
    if (status) {
      booking.status = status;
      if (status === 'confirmed') {
        booking.confirmedAt = new Date();
      } else if (status === 'cancelled') {
        booking.cancelledBy = 'admin';
        booking.cancelledAt = new Date();
        booking.cancellationReason = cancellationReason || '';
        booking.isTrackingActive = false;
        booking.tripStatus = 'cancelled';
      } else if (status === 'completed') {
        booking.completedAt = new Date();
        booking.tripStatus = 'completed';
        booking.isTrackingActive = false;
      }
    }

    // Update payment status if provided
    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
      // If payment status is set to "paid", update paidAmount to totalAmount
      if (paymentStatus === 'paid' && booking.paidAmount < booking.pricing?.totalPrice) {
        booking.paidAmount = booking.pricing?.totalPrice || booking.totalPrice || 0;
      }
      // If payment status is set to "refunded", set refund date
      if (paymentStatus === 'refunded') {
        booking.refundDate = new Date();
      }
    }

    // Update refund amount if provided
    if (refundAmount !== undefined) {
      booking.refundAmount = refundAmount;
    }

    // Update admin notes
    if (adminNotes !== undefined) {
      booking.adminNotes = adminNotes;
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: {
        booking,
      },
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get active bookings with tracking (Admin)
 * @route   GET /api/admin/bookings/active/tracking
 * @access  Private (Admin)
 */
export const getActiveBookingsWithTracking = async (req, res) => {
  try {
    const bookings = await Booking.find({
      isTrackingActive: true,
      status: { $in: ['confirmed', 'active'] },
      tripStatus: { $in: ['started', 'in_progress'] },
    })
      .populate('user', 'name phone email')
      .populate('car', 'brand model year color registrationNumber images')
      .select('bookingId user car tripStart tripEnd currentLocation lastLocationUpdate isTrackingActive status tripStatus createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        bookings,
        count: bookings.length,
      },
    });
  } catch (error) {
    console.error('Get active bookings with tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get booking statistics (Admin)
 * @route   GET /api/admin/bookings/stats
 * @access  Private (Admin)
 */
export const getBookingStats = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    const dateQuery = {};
    if (dateFrom || dateTo) {
      dateQuery.bookingDate = {};
      if (dateFrom) {
        dateQuery.bookingDate.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        dateQuery.bookingDate.$lte = new Date(dateTo);
      }
    }

    const [
      totalBookings,
      totalRevenue,
      activeBookings,
      completedBookings,
      cancelledBookings,
      pendingPayments,
      revenueByStatus,
    ] = await Promise.all([
      Booking.countDocuments(dateQuery),
      Booking.aggregate([
        { $match: { ...dateQuery, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$paidAmount' } } },
      ]),
      Booking.countDocuments({ ...dateQuery, status: 'active' }),
      Booking.countDocuments({ ...dateQuery, status: 'completed' }),
      Booking.countDocuments({ ...dateQuery, status: 'cancelled' }),
      Booking.countDocuments({ ...dateQuery, paymentStatus: 'pending' }),
      Booking.aggregate([
        { $match: { ...dateQuery, paymentStatus: 'paid' } },
        {
          $group: {
            _id: '$status',
            revenue: { $sum: '$paidAmount' },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        activeBookings,
        completedBookings,
        cancelledBookings,
        pendingPayments,
        revenueByStatus: revenueByStatus.reduce((acc, item) => {
          acc[item._id] = {
            revenue: item.revenue,
            count: item.count,
          };
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

