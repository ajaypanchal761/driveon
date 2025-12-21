import GuarantorRequest from '../models/GuarantorRequest.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Car from '../models/Car.js';
import GuarantorPoints from '../models/GuarantorPoints.js';

/**
 * @desc    Get guarantor requests for logged-in user
 * @route   GET /api/user/guarantor-requests
 * @access  Private
 */
export const getMyGuarantorRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    
    console.log('📥 Get my guarantor requests - User ID:', userId.toString());
    console.log('📥 User guarantorId:', req.user.guarantorId);

    // Find all requests for this guarantor
    const requests = await GuarantorRequest.find({ guarantor: userId })
      .populate('user', 'name email phone')
      .populate('booking', 'bookingId')
      .populate({
        path: 'booking',
        populate: {
          path: 'car',
          select: 'brand model year color registrationNumber images pricePerDay',
        },
      })
      .populate('requestedBy', 'name email')
      .sort({ createdAt: -1 });

    // Debug: Log car images in requests
    if (requests.length > 0) {
      console.log('📸 Car images in requests list:', requests.map(req => ({
        requestId: req._id.toString(),
        hasCar: !!req.booking?.car,
        carImages: req.booking?.car?.images,
        imagesLength: req.booking?.car?.images?.length,
      })));
    }

    console.log('✅ Found requests:', {
      count: requests.length,
      requestIds: requests.map(r => r._id.toString()),
      statuses: requests.map(r => r.status),
    });

    // Also check if there are any requests that might have been created with guarantorId instead of userId
    const user = await User.findById(userId);
    if (user && user.guarantorId) {
      console.log('🔍 Also checking requests by guarantorId:', user.guarantorId);
      const requestsByGuarantorId = await GuarantorRequest.find({
        $or: [
          { guarantor: userId },
          // This shouldn't be needed, but let's check if requests were created incorrectly
        ]
      }).countDocuments();
      console.log('📊 Total requests found:', requestsByGuarantorId);
    }

    res.json({
      success: true,
      data: {
        requests,
        count: requests.length,
      },
    });
  } catch (error) {
    console.error('❌ Get my guarantor requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch guarantor requests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get guarantor request by ID with full details
 * @route   GET /api/user/guarantor-requests/:id
 * @access  Private
 */
export const getGuarantorRequestDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const request = await GuarantorRequest.findOne({
      _id: id,
      guarantor: userId,
    })
      .populate('user', 'name email phone age gender address profilePhoto')
      .populate({
        path: 'booking',
        populate: {
          path: 'car',
          select: 'brand model year color registrationNumber images pricePerDay owner',
        },
      })
      .populate('requestedBy', 'name email');

    // Debug: Log car images
    if (request && request.booking && request.booking.car) {
      console.log('📸 Car images in request details:', {
        carId: request.booking.car._id?.toString(),
        images: request.booking.car.images,
        imagesLength: request.booking.car.images?.length,
        imagesType: Array.isArray(request.booking.car.images),
      });
    }

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
    console.error('Get guarantor request details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch guarantor request details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Accept guarantor request
 * @route   POST /api/user/guarantor-requests/:id/accept
 * @access  Private
 */
export const acceptGuarantorRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const request = await GuarantorRequest.findOne({
      _id: id,
      guarantor: userId,
      status: 'pending',
    }).populate('booking');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Guarantor request not found or already processed',
      });
    }

    // Get booking details with pricing
    const booking = await Booking.findById(request.booking._id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if booking is cancelled (no points for cancelled bookings)
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot accept guarantor request for cancelled booking',
      });
    }

    // Update request status
    request.status = 'accepted';
    request.acceptedAt = new Date();
    await request.save();

    // Update booking with guarantor (keeping single guarantor field for backward compatibility)
    booking.guarantor = userId;
    await booking.save();

    // Calculate and allocate points
    try {
      // Get booking total amount
      const bookingAmount = booking.pricing?.finalPrice || booking.pricing?.totalPrice || 0;
      
      // Calculate 10% pool amount (exact decimal, no rounding)
      const totalPoolAmount = bookingAmount * 0.1;
      
      // Count total accepted guarantors for this booking (including this one)
      const totalAcceptedGuarantors = await GuarantorRequest.countDocuments({
        booking: booking._id,
        status: 'accepted',
      });
      
      // Calculate points per guarantor (equally divided, exact decimal, no rounding)
      const pointsPerGuarantor = totalPoolAmount / totalAcceptedGuarantors;
      
      console.log('💰 Calculating guarantor points:', {
        bookingId: booking._id.toString(),
        bookingAmount,
        totalPoolAmount,
        totalAcceptedGuarantors,
        pointsPerGuarantor,
      });

      // Check if points already allocated for this guarantor and booking
      const existingPoints = await GuarantorPoints.findOne({
        booking: booking._id,
        guarantor: userId,
        status: 'active',
      });

      if (!existingPoints && pointsPerGuarantor > 0) {
        // Create guarantor points record
        const guarantorPoints = new GuarantorPoints({
          booking: booking._id,
          guarantor: userId,
          guarantorRequest: request._id,
          bookingAmount,
          totalPoolAmount,
          totalGuarantors: totalAcceptedGuarantors,
          pointsAllocated: pointsPerGuarantor,
          status: 'active',
          bookingStatusAtAllocation: booking.status,
        });
        await guarantorPoints.save();

        // Update guarantor user's points balance
        const guarantorUser = await User.findById(userId);
        if (guarantorUser) {
          guarantorUser.points = (guarantorUser.points || 0) + pointsPerGuarantor;
          guarantorUser.totalPointsEarned = (guarantorUser.totalPointsEarned || 0) + pointsPerGuarantor;
          await guarantorUser.save();
          
          console.log('✅ Points allocated:', {
            guarantorId: userId.toString(),
            pointsAllocated: pointsPerGuarantor,
            newBalance: guarantorUser.points,
          });
        }

        // Recalculate and update points for all other accepted guarantors of this booking
        // (because points need to be divided equally among all guarantors)
        const allAcceptedRequests = await GuarantorRequest.find({
          booking: booking._id,
          status: 'accepted',
          _id: { $ne: request._id }, // Exclude current request
        });

        for (const otherRequest of allAcceptedRequests) {
          // Update existing points record for other guarantors
          const otherPoints = await GuarantorPoints.findOne({
            booking: booking._id,
            guarantor: otherRequest.guarantor,
            status: 'active',
          });

          if (otherPoints) {
            const oldPoints = otherPoints.pointsAllocated;
            const newPoints = pointsPerGuarantor;
            const difference = newPoints - oldPoints;

            if (difference !== 0) {
              otherPoints.pointsAllocated = newPoints;
              otherPoints.totalGuarantors = totalAcceptedGuarantors;
              await otherPoints.save();

              // Update other guarantor's points balance
              const otherGuarantorUser = await User.findById(otherRequest.guarantor);
              if (otherGuarantorUser) {
                otherGuarantorUser.points = (otherGuarantorUser.points || 0) + difference;
                await otherGuarantorUser.save();
                
                console.log('✅ Updated points for existing guarantor:', {
                  guarantorId: otherRequest.guarantor.toString(),
                  oldPoints,
                  newPoints,
                  difference,
                });
              }
            }
          }
        }
      }
    } catch (pointsError) {
      console.error('⚠️ Error allocating guarantor points:', pointsError);
      // Don't fail the request acceptance if points allocation fails
      // Points can be allocated later if needed
    }

    res.json({
      success: true,
      message: 'Guarantor request accepted successfully',
      data: {
        request,
      },
    });
  } catch (error) {
    console.error('Accept guarantor request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept guarantor request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Reject guarantor request
 * @route   POST /api/user/guarantor-requests/:id/reject
 * @access  Private
 */
export const rejectGuarantorRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const request = await GuarantorRequest.findOne({
      _id: id,
      guarantor: userId,
      status: 'pending',
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Guarantor request not found or already processed',
      });
    }

    // Update request status
    request.status = 'rejected';
    request.rejectionReason = reason || 'Rejected by guarantor';
    request.rejectedAt = new Date();
    await request.save();

    res.json({
      success: true,
      message: 'Guarantor request rejected',
      data: {
        request,
      },
    });
  } catch (error) {
    console.error('Reject guarantor request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject guarantor request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get guarantor points and history
 * @route   GET /api/user/guarantor-points
 * @access  Private
 */
export const getGuarantorPoints = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's current points balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get all points records for this guarantor
    const pointsRecords = await GuarantorPoints.find({
      guarantor: userId,
    })
      .populate('booking', 'bookingId status')
      .populate({
        path: 'booking',
        populate: {
          path: 'user',
          select: 'name email phone',
        },
      })
      .sort({ createdAt: -1 });

    // Format points history
    // Recalculate points from booking amount to ensure exact decimals (no rounding)
    const history = pointsRecords.map((record) => {
      // Recalculate exact points from booking amount to avoid rounding issues
      const exactTotalPool = record.bookingAmount * 0.1; // 10% of booking amount (exact)
      const exactPointsPerGuarantor = exactTotalPool / record.totalGuarantors; // Exact division
      
      return {
        id: record._id.toString(),
        bookingId: record.booking?.bookingId || 'N/A',
        userName: record.booking?.user?.name || 'Unknown User',
        userEmail: record.booking?.user?.email || '',
        bookingAmount: record.bookingAmount,
        totalPoolAmount: exactTotalPool, // Recalculated exact value
        totalGuarantors: record.totalGuarantors,
        pointsEarned: exactPointsPerGuarantor, // Recalculated exact value instead of stored rounded value
        date: record.createdAt,
        status: record.status,
        bookingStatus: record.booking?.status || 'unknown',
        reversedAt: record.reversedAt,
        reversalReason: record.reversalReason,
      };
    });

    // Calculate total active points (excluding reversed) - recalculate from booking amounts for exact decimals
    const activePoints = pointsRecords
      .filter((r) => r.status === 'active')
      .reduce((sum, r) => {
        // Recalculate exact points from booking amount to avoid rounding issues
        const exactTotalPool = r.bookingAmount * 0.1; // 10% of booking amount (exact)
        const exactPointsPerGuarantor = exactTotalPool / r.totalGuarantors; // Exact division
        return sum + exactPointsPerGuarantor;
      }, 0);

    // Use activePoints calculated from records (exact decimals) instead of user.points (might be rounded)
    // This ensures we always show the exact decimal value
    res.json({
      success: true,
      data: {
        points: activePoints, // Use calculated activePoints instead of user.points for exact decimals
        activePoints,
        totalPointsEarned: user.totalPointsEarned || 0,
        history,
      },
    });
  } catch (error) {
    console.error('Get guarantor points error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch guarantor points',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

