import GuarantorRequest from '../models/GuarantorRequest.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Car from '../models/Car.js';

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

    // Update request status
    request.status = 'accepted';
    request.acceptedAt = new Date();
    await request.save();

    // Update booking with guarantor
    const booking = await Booking.findById(request.booking._id);
    if (booking) {
      booking.guarantor = userId;
      await booking.save();
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

