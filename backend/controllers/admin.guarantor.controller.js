import mongoose from 'mongoose';
import GuarantorRequest from '../models/GuarantorRequest.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import GuarantorPoints from '../models/GuarantorPoints.js';

/**
 * @desc    Send guarantor request
 * @route   POST /api/admin/guarantor-requests
 * @access  Private (Admin)
 */
export const sendGuarantorRequest = async (req, res) => {
  try {
    console.log('📥 Send guarantor request - Request received:', {
      bookingId: req.body.bookingId,
      guarantorId: req.body.guarantorId ? '***' : undefined,
      adminId: req.user?._id?.toString() || req.admin?._id?.toString(),
    });

    const { bookingId, guarantorId } = req.body;
    // Admin middleware sets req.user, not req.admin
    const adminId = req.user?._id || req.admin?._id;

    if (!adminId) {
      console.error('❌ Admin ID not found in request', {
        hasUser: !!req.user,
        hasAdmin: !!req.admin,
        userKeys: req.user ? Object.keys(req.user) : [],
      });
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required',
      });
    }

    if (!bookingId || !guarantorId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID and Guarantor ID are required',
      });
    }

    // Validate bookingId format (must be valid MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      console.error('❌ Invalid booking ID format:', bookingId);
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format. Please provide a valid MongoDB ObjectId.',
      });
    }

    // Validate guarantorId is not empty
    if (typeof guarantorId !== 'string' || !guarantorId.trim()) {
      console.error('❌ Invalid guarantor ID format:', typeof guarantorId);
      return res.status(400).json({
        success: false,
        message: 'Invalid guarantor ID format',
      });
    }

    // Find booking by MongoDB _id
    let booking;
    try {
      console.log('🔍 Finding booking with ID:', bookingId);
      booking = await Booking.findById(bookingId).populate('user', 'name email phone');
      console.log('✅ Booking found:', {
        bookingId: booking?._id?.toString(),
        hasUser: !!booking?.user,
        userId: booking?.user?._id?.toString(),
      });
    } catch (dbError) {
      console.error('❌ Database error finding booking:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Database error while finding booking',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined,
      });
    }

    if (!booking) {
      console.error('❌ Booking not found:', bookingId);
      return res.status(404).json({
        success: false,
        message: 'Booking not found with the provided ID',
      });
    }

    // Check if booking has a user
    if (!booking.user || !booking.user._id) {
      console.error('❌ Booking does not have a user:', {
        bookingId: booking._id?.toString(),
        hasUser: !!booking.user,
      });
      return res.status(400).json({
        success: false,
        message: 'Booking does not have an associated user',
      });
    }

    // Find guarantor user by guarantorId
    console.log('🔍 Finding guarantor with ID:', guarantorId.trim());
    const guarantor = await User.findOne({ guarantorId: guarantorId.trim() });
    if (!guarantor) {
      console.error('❌ Guarantor not found:', guarantorId.trim());
      return res.status(404).json({
        success: false,
        message: 'Guarantor not found with this ID. Please verify the Guarantor ID is correct.',
      });
    }
    console.log('✅ Guarantor found:', {
      guarantorId: guarantor.guarantorId,
      userId: guarantor._id?.toString(),
    });

    // Check if guarantor is the same as the booking user (can't be own guarantor)
    if (guarantor._id.toString() === booking.user._id.toString()) {
      console.error('❌ User cannot be own guarantor');
      return res.status(400).json({
        success: false,
        message: 'A user cannot be their own guarantor',
      });
    }

    // Check if request already exists
    console.log('🔍 Checking for existing request...');
    const existingRequest = await GuarantorRequest.findOne({
      booking: bookingId,
      guarantor: guarantor._id,
      status: 'pending',
    });

    if (existingRequest) {
      console.error('❌ Duplicate request found');
      return res.status(400).json({
        success: false,
        message: 'A pending request already exists for this booking and guarantor',
      });
    }

    // Check maximum 5 guarantors per booking limit
    const acceptedGuarantorsCount = await GuarantorRequest.countDocuments({
      booking: bookingId,
      status: 'accepted',
    });

    if (acceptedGuarantorsCount >= 5) {
      console.error('❌ Maximum guarantors limit reached');
      return res.status(400).json({
        success: false,
        message: 'Maximum 5 guarantors can be linked to a booking. This booking already has 5 guarantors.',
      });
    }

    // Create guarantor request
    let request;
    try {
      console.log('📝 Creating guarantor request...', {
        bookingId: bookingId.toString(),
        userId: booking.user._id.toString(),
        guarantorId: guarantor._id.toString(),
        guarantorGuarantorId: guarantor.guarantorId,
        adminId: adminId.toString(),
      });
      request = await GuarantorRequest.create({
        booking: bookingId,
        user: booking.user._id,
        guarantor: guarantor._id,
        requestedBy: adminId,
        status: 'pending',
      });
      console.log('✅ Guarantor request created:', {
        requestId: request._id?.toString(),
        guarantor: request.guarantor?.toString(),
        status: request.status,
      });
    } catch (createError) {
      console.error('❌ Error creating guarantor request:', {
        message: createError.message,
        code: createError.code,
        name: createError.name,
        stack: createError.stack,
      });
      
      // Handle duplicate key error (from unique index)
      if (createError.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'A request already exists for this booking and guarantor',
        });
      }
      
      throw createError;
    }

    // Populate request data
    try {
      console.log('🔄 Populating request data...');
      await request.populate('user', 'name email phone');
      await request.populate('guarantor', 'name email phone guarantorId');
      await request.populate('booking', 'bookingId');
      console.log('✅ Request populated successfully');
    } catch (populateError) {
      console.error('⚠️ Error populating request (non-fatal):', populateError.message);
      // Continue even if populate fails - request is still created
    }

    console.log('✅ Guarantor request sent successfully');
    res.status(201).json({
      success: true,
      message: 'Guarantor request sent successfully',
      data: {
        request,
      },
    });
  } catch (error) {
    console.error('❌ Send guarantor request error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code,
    });
    res.status(500).json({
      success: false,
      message: 'Failed to send guarantor request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get all guarantor requests (Admin)
 * @route   GET /api/admin/guarantor-requests
 * @access  Private (Admin)
 */
export const getAllGuarantorRequests = async (req, res) => {
  try {
    const { status, bookingId } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (bookingId) {
      query.booking = bookingId;
    }

    const requests = await GuarantorRequest.find(query)
      .populate('user', 'name email phone')
      .populate('guarantor', 'name email phone guarantorId')
      .populate('booking', 'bookingId')
      .populate('requestedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        requests,
        count: requests.length,
      },
    });
  } catch (error) {
    console.error('Get guarantor requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch guarantor requests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get guarantor request by ID
 * @route   GET /api/admin/guarantor-requests/:id
 * @access  Private (Admin)
 */
export const getGuarantorRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await GuarantorRequest.findById(id)
      .populate('user', 'name email phone')
      .populate('guarantor', 'name email phone guarantorId')
      .populate('booking', 'bookingId')
      .populate('requestedBy', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Guarantor request not found',
      });
    }

    res.json({
      success: true,
      data: {
        request,
      },
    });
  } catch (error) {
    console.error('Get guarantor request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch guarantor request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Delete guarantor request/link
 * @route   DELETE /api/admin/guarantor-requests/:id
 * @access  Private (Admin)
 */
export const deleteGuarantorRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingId, guarantorId } = req.query; // Optional query params for booking-based deletion

    console.log('📥 Delete guarantor request - Request ID:', id, 'Query params:', { bookingId, guarantorId });

    let request = null;

    // Check if it's a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      // Try to find by request ID
      try {
        request = await GuarantorRequest.findById(id);
        console.log('🔍 Searched by request ID:', id, 'Found:', !!request);
      } catch (dbError) {
        console.error('❌ Database error finding request:', dbError);
        return res.status(500).json({
          success: false,
          message: 'Database error while finding guarantor request',
          error: process.env.NODE_ENV === 'development' ? dbError.message : undefined,
        });
      }
    }

    // If not found by ID and we have bookingId and guarantorId, try to find by those
    if (!request && bookingId && guarantorId) {
      if (mongoose.Types.ObjectId.isValid(bookingId) && mongoose.Types.ObjectId.isValid(guarantorId)) {
        try {
          request = await GuarantorRequest.findOne({
            booking: bookingId,
            guarantor: guarantorId,
          });
          console.log('🔍 Searched by booking and guarantor:', { bookingId, guarantorId }, 'Found:', !!request);
        } catch (dbError) {
          console.error('❌ Database error finding request by booking/guarantor:', dbError);
        }
      }
    }
    
    if (!request) {
      console.error('❌ Guarantor request not found:', id);
      // If we have bookingId and guarantorId, try to remove from booking directly
      if (bookingId && guarantorId && mongoose.Types.ObjectId.isValid(bookingId) && mongoose.Types.ObjectId.isValid(guarantorId)) {
        try {
          const booking = await Booking.findById(bookingId);
          if (booking && booking.guarantor) {
            const bookingGuarantorId = booking.guarantor.toString ? booking.guarantor.toString() : String(booking.guarantor);
            if (bookingGuarantorId === guarantorId) {
              booking.guarantor = null;
              await booking.save();
              console.log('✅ Removed guarantor from booking directly:', bookingId);
              return res.json({
                success: true,
                message: 'Guarantor removed from booking successfully',
              });
            }
          }
        } catch (bookingError) {
          console.error('❌ Error removing guarantor from booking:', bookingError);
        }
      }
      
      return res.status(404).json({
        success: false,
        message: 'Guarantor request not found',
      });
    }

    // Get booking and guarantor IDs from the request (they are ObjectId references)
    const requestBookingId = request.booking ? (request.booking.toString ? request.booking.toString() : String(request.booking)) : null;
    const requestGuarantorId = request.guarantor ? (request.guarantor.toString ? request.guarantor.toString() : String(request.guarantor)) : null;
    
    console.log('✅ Found guarantor request:', {
      requestId: request._id.toString(),
      bookingId: requestBookingId,
      guarantorId: requestGuarantorId,
    });

    // Remove guarantor from booking if it exists
    if (requestBookingId && mongoose.Types.ObjectId.isValid(requestBookingId)) {
      try {
        const booking = await Booking.findById(requestBookingId);
        if (booking) {
          // Check if this booking has the same guarantor
          const bookingGuarantorId = booking.guarantor ? (booking.guarantor.toString ? booking.guarantor.toString() : String(booking.guarantor)) : null;
          
          if (bookingGuarantorId && requestGuarantorId && bookingGuarantorId === requestGuarantorId) {
            booking.guarantor = null;
            await booking.save();
            console.log('✅ Removed guarantor from booking:', booking._id.toString());
          } else {
            console.log('ℹ️ Booking has different guarantor or no guarantor', {
              bookingGuarantorId,
              requestGuarantorId: requestGuarantorId,
            });
          }
        } else {
          console.log('ℹ️ Booking not found for ID:', requestBookingId);
        }
      } catch (bookingError) {
        console.error('⚠️ Error updating booking:', bookingError);
        console.error('Booking error details:', {
          message: bookingError.message,
          stack: bookingError.stack,
        });
        // Continue with request deletion even if booking update fails
      }
    } else {
      console.log('ℹ️ No valid booking ID found in request');
    }

    // Delete the guarantor request
    await GuarantorRequest.findByIdAndDelete(id);
    console.log('✅ Guarantor request deleted:', id);

    res.json({
      success: true,
      message: 'Guarantor link removed successfully',
    });
  } catch (error) {
    console.error('❌ Delete guarantor request error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(500).json({
      success: false,
      message: 'Failed to delete guarantor request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get guarantor points for a booking
 * @route   GET /api/admin/bookings/:bookingId/guarantor-points
 * @access  Private (Admin)
 */
export const getBookingGuarantorPoints = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format',
      });
    }

    // Get all points records for this booking
    const pointsRecords = await GuarantorPoints.find({
      booking: bookingId,
    })
      .populate('guarantor', 'name email phone guarantorId')
      .populate('guarantorRequest', 'status acceptedAt')
      .sort({ createdAt: -1 });

    // Get booking details
    const booking = await Booking.findById(bookingId).select('bookingId pricing.finalPrice pricing.totalPrice status');

    // Calculate totals (exact decimal, no rounding)
    const totalPoolAmount = booking ? (booking.pricing?.finalPrice || booking.pricing?.totalPrice || 0) * 0.1 : 0;
    const activePoints = pointsRecords.filter((r) => r.status === 'active');
    const reversedPoints = pointsRecords.filter((r) => r.status === 'reversed');
    const totalAllocated = activePoints.reduce((sum, r) => sum + r.pointsAllocated, 0);
    const totalReversed = reversedPoints.reduce((sum, r) => sum + r.pointsAllocated, 0);

    // Format response
    const guarantorsData = pointsRecords.map((record) => ({
      id: record._id.toString(),
      guarantorId: record.guarantor?._id?.toString(),
      guarantorName: record.guarantor?.name || 'N/A',
      guarantorEmail: record.guarantor?.email || '',
      guarantorPhone: record.guarantor?.phone || '',
      guarantorGuarantorId: record.guarantor?.guarantorId || '',
      pointsAllocated: record.pointsAllocated,
      status: record.status,
      allocatedAt: record.createdAt,
      reversedAt: record.reversedAt,
      reversalReason: record.reversalReason,
      totalGuarantors: record.totalGuarantors,
      requestStatus: record.guarantorRequest?.status,
      acceptedAt: record.guarantorRequest?.acceptedAt,
    }));

    res.json({
      success: true,
      data: {
        bookingId: booking?.bookingId || bookingId,
        bookingAmount: booking?.pricing?.finalPrice || booking?.pricing?.totalPrice || 0,
        totalPoolAmount,
        totalGuarantors: pointsRecords.length,
        activeGuarantors: activePoints.length,
        totalAllocated,
        totalReversed,
        guarantors: guarantorsData,
      },
    });
  } catch (error) {
    console.error('Get booking guarantor points error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch guarantor points',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

