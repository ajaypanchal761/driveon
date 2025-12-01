import Booking from '../models/Booking.js';
import User from '../models/User.js';
import phonepeService from '../services/phonepe.service.js';
import razorpayService from '../services/razorpay.service.js';

/**
 * @desc    Create payment request
 * @route   POST /api/payments/create
 * @access  Private
 */
export const createPayment = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    const userId = req.user._id;

    if (!bookingId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID and amount are required',
      });
    }

    // Get booking
    const booking = await Booking.findById(bookingId)
      .populate('user', 'name phone email');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check permissions
    if (booking.user._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Check if booking is already paid
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already paid',
      });
    }

    // Generate transaction ID
    const transactionId = phonepeService.generateTransactionId('TXN');

    // Create payment request
    const paymentData = {
      transactionId,
      amount: parseFloat(amount),
      userId: userId.toString(),
      userPhone: booking.user.phone,
      userEmail: booking.user.email,
      bookingId: booking.bookingId,
    };

    const paymentResponse = await phonepeService.createPayment(paymentData);

    // Add transaction to booking
    booking.transactions.push({
      transactionId,
      phonePeTransactionId: paymentResponse.phonePeTransactionId,
      amount: parseFloat(amount),
      status: 'pending',
      paymentMethod: 'phonepe',
    });

    await booking.save();

    res.json({
      success: true,
      message: 'Payment request created',
      data: {
        redirectUrl: paymentResponse.redirectUrl,
        transactionId,
        phonePeTransactionId: paymentResponse.phonePeTransactionId,
        bookingId: booking.bookingId,
      },
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    PhonePe payment callback
 * @route   POST /api/payments/phonepe/callback
 * @access  Public (PhonePe webhook)
 */
export const phonepeCallback = async (req, res) => {
  try {
    const { response } = req.body;
    
    if (!response) {
      return res.status(400).json({
        success: false,
        message: 'Invalid callback data',
      });
    }

    // Decode base64 response
    const decodedResponse = JSON.parse(
      Buffer.from(response, 'base64').toString('utf-8')
    );

    const {
      merchantTransactionId,
      transactionId: phonePeTransactionId,
      state,
      amount,
    } = decodedResponse;

    // Find booking by transaction ID
    const booking = await Booking.findOne({
      'transactions.transactionId': merchantTransactionId,
    });

    if (!booking) {
      console.error('Booking not found for transaction:', merchantTransactionId);
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Find the transaction
    const transaction = booking.transactions.find(
      (t) => t.transactionId === merchantTransactionId
    );

    if (!transaction) {
      console.error('Transaction not found:', merchantTransactionId);
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Update transaction status
    if (state === 'COMPLETED') {
      transaction.status = 'success';
      transaction.paymentDate = new Date();
      transaction.phonePeTransactionId = phonePeTransactionId;

      // Update booking payment status
      booking.paidAmount += transaction.amount;
      booking.remainingAmount = booking.pricing.finalPrice - booking.paidAmount;

      if (booking.paymentOption === 'full' && booking.paidAmount >= booking.pricing.finalPrice) {
        booking.paymentStatus = 'paid';
      } else if (booking.paymentOption === 'advance' && booking.paidAmount >= booking.pricing.advancePayment) {
        booking.paymentStatus = 'partial';
        booking.remainingAmount = booking.pricing.remainingPayment;
      }

      // Auto-confirm booking after successful payment
      if (booking.status === 'pending') {
        booking.status = 'confirmed';
        booking.confirmedAt = new Date();
      }
    } else if (state === 'FAILED') {
      transaction.status = 'failed';
      booking.paymentStatus = 'failed';
    }

    await booking.save();

    // Return success response to PhonePe
    res.status(200).json({
      success: true,
      code: 'PAYMENT_SUCCESS',
      message: 'Payment processed',
    });
  } catch (error) {
    console.error('PhonePe callback error:', error);
    res.status(500).json({
      success: false,
      code: 'PAYMENT_ERROR',
      message: 'Payment processing failed',
    });
  }
};

/**
 * @desc    Check payment status
 * @route   GET /api/payments/status/:transactionId
 * @access  Private
 */
export const checkPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user._id;

    // Find booking by transaction ID
    const booking = await Booking.findOne({
      'transactions.transactionId': transactionId,
    }).populate('user', 'name phone email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Check permissions
    if (booking.user._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Check payment status from PhonePe
    const paymentStatus = await phonepeService.checkPaymentStatus(transactionId);

    // Update booking if payment is successful
    if (paymentStatus.status === 'success') {
      const transaction = booking.transactions.find(
        (t) => t.transactionId === transactionId
      );

      if (transaction && transaction.status !== 'success') {
        transaction.status = 'success';
        transaction.paymentDate = new Date();
        transaction.phonePeTransactionId = paymentStatus.phonePeTransactionId;

        booking.paidAmount += transaction.amount;
        booking.remainingAmount = booking.pricing.finalPrice - booking.paidAmount;

        if (booking.paymentOption === 'full' && booking.paidAmount >= booking.pricing.finalPrice) {
          booking.paymentStatus = 'paid';
        } else if (booking.paymentOption === 'advance' && booking.paidAmount >= booking.pricing.advancePayment) {
          booking.paymentStatus = 'partial';
        }

        if (booking.status === 'pending') {
          booking.status = 'confirmed';
          booking.confirmedAt = new Date();
        }

        await booking.save();
      }
    }

    res.json({
      success: true,
      data: {
        paymentStatus: paymentStatus.status,
        transactionId,
        amount: paymentStatus.amount,
        booking: {
          id: booking._id,
          bookingId: booking.bookingId,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          paidAmount: booking.paidAmount,
          remainingAmount: booking.remainingAmount,
        },
      },
    });
  } catch (error) {
    console.error('Check payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check payment status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Create Razorpay order for booking
 * @route   POST /api/payments/razorpay/create-order
 * @access  Private
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    const userId = req.user._id;

    if (!bookingId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID and amount are required',
      });
    }

    // Validate bookingId format
    if (typeof bookingId !== 'string' && typeof bookingId !== 'object') {
      console.error('❌ Invalid bookingId format:', { bookingId, type: typeof bookingId });
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format',
      });
    }

    // Get booking
    let booking;
    try {
      booking = await Booking.findById(bookingId)
        .populate('user', 'name phone email');
    } catch (dbError) {
      console.error('❌ Database error fetching booking:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Database error while fetching booking',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined,
      });
    }
    
    if (!booking) {
      console.error('❌ Booking not found:', bookingId);
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }
    
    console.log('✅ Booking found:', {
      bookingId: booking.bookingId,
      _id: booking._id?.toString(),
      userId: booking.user?._id?.toString(),
      requestUserId: userId.toString(),
      paymentStatus: booking.paymentStatus,
    });

    // Check permissions
    if (!booking.user || !booking.user._id) {
      console.error('❌ Booking user not populated');
      return res.status(500).json({
        success: false,
        message: 'Booking user data not available',
      });
    }
    
    if (booking.user._id.toString() !== userId.toString()) {
      console.error('❌ Access denied:', {
        bookingUserId: booking.user._id.toString(),
        requestUserId: userId.toString(),
      });
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Check if booking is already paid
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already paid',
      });
    }

    // Check if Razorpay is configured
    if (!razorpayService.isConfigured()) {
      console.error('❌ Razorpay not configured - missing environment variables');
      return res.status(500).json({
        success: false,
        message: 'Payment service not configured. Please contact support.',
        error: 'RAZORPAY_NOT_CONFIGURED',
      });
    }

    // Generate transaction ID
    const transactionId = razorpayService.generateTransactionId('TXN');

    // Create Razorpay order
    let order;
    try {
      order = await razorpayService.createOrder({
        amount: parseFloat(amount),
        receipt: `booking_${booking.bookingId}_${Date.now()}`,
        notes: {
          booking_id: booking._id.toString(),
          bookingId: booking.bookingId,
          user_id: userId.toString(),
          transaction_id: transactionId,
          payment_type: 'booking_payment',
        },
      });
    } catch (razorpayError) {
      console.error('❌ Razorpay order creation error:', razorpayError);
      console.error('Error details:', {
        message: razorpayError.message,
        code: razorpayError.code,
        error: razorpayError.error,
      });
      
      // Check if it's a configuration error
      if (razorpayError.code === 'RAZORPAY_NOT_CONFIGURED' || razorpayError.message.includes('not configured')) {
        return res.status(500).json({
          success: false,
          message: 'Payment service not configured. Please contact support.',
          error: 'RAZORPAY_NOT_CONFIGURED',
        });
      }
      
      // Check if it's an API error from Razorpay
      if (razorpayError.error) {
        return res.status(500).json({
          success: false,
          message: razorpayError.error.description || 'Failed to create payment order',
          error: razorpayError.error.code || 'RAZORPAY_ERROR',
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment order. Please try again.',
        error: process.env.NODE_ENV === 'development' ? razorpayError.message : undefined,
      });
    }

    // Add transaction to booking
    booking.transactions.push({
      transactionId,
      razorpayOrderId: order.id,
      amount: parseFloat(amount),
      status: 'pending',
      paymentMethod: 'razorpay',
    });

    await booking.save();

    res.json({
      success: true,
      message: 'Razorpay order created successfully',
      data: {
        orderId: order.id,
        amount: order.amount, // in paise
        currency: order.currency,
        receipt: order.receipt,
        transactionId,
        bookingId: booking.bookingId,
      },
    });
  } catch (error) {
    console.error('❌ Create Razorpay order error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      body: req.body,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Verify Razorpay payment
 * @route   POST /api/payments/razorpay/verify
 * @access  Private
 */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    const userId = req.user._id;

    // Support both web and mobile formats
    const orderId = razorpay_order_id || req.body.orderId || req.body.order_id;
    const paymentId = razorpay_payment_id || req.body.paymentId || req.body.payment_id;
    const signature = razorpay_signature || req.body.signature;

    if (!orderId || !paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and Payment ID are required',
      });
    }

    // Find booking
    let booking;
    if (bookingId) {
      booking = await Booking.findById(bookingId)
        .populate('user', 'name phone email');
    } else {
      // Find by order ID
      booking = await Booking.findOne({
        'transactions.razorpayOrderId': orderId,
      }).populate('user', 'name phone email');
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check permissions
    if (booking.user._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Find the transaction
    const transaction = booking.transactions.find(
      (t) => t.razorpayOrderId === orderId
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Verify signature if provided
    let signatureValid = false;
    if (signature) {
      signatureValid = razorpayService.verifySignature(orderId, paymentId, signature);
    } else {
      // If signature is missing (common in WebView/APK), verify via Razorpay API
      try {
        const payment = await razorpayService.fetchPayment(paymentId);
        if (payment && payment.status === 'captured' && payment.order_id === orderId) {
          signatureValid = true;
          console.log('✅ Payment verified via Razorpay API');
        }
      } catch (apiError) {
        console.error('❌ Error verifying via API:', apiError);
        // Try to verify using order status
        try {
          const order = await razorpayService.fetchOrder(orderId);
          if (order && order.status === 'paid' && order.amount_paid >= order.amount) {
            signatureValid = true;
            console.log('✅ Payment verified via order status');
          }
        } catch (orderError) {
          console.error('❌ Error verifying via order:', orderError);
        }
      }
    }

    if (!signatureValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        error: 'INVALID_SIGNATURE',
      });
    }

    // Update transaction
    transaction.status = 'success';
    transaction.razorpayPaymentId = paymentId;
    transaction.razorpaySignature = signature || '';
    transaction.paymentDate = new Date();

    console.log('📝 Updating booking after payment verification:', {
      bookingId: booking.bookingId,
      currentStatus: booking.status,
      currentPaymentStatus: booking.paymentStatus,
      currentPaidAmount: booking.paidAmount,
      transactionAmount: transaction.amount,
      paymentOption: booking.paymentOption,
      finalPrice: booking.pricing.finalPrice,
      advancePayment: booking.pricing.advancePayment,
    });

    // Update booking payment status
    const previousPaidAmount = booking.paidAmount;
    booking.paidAmount += transaction.amount;
    booking.remainingAmount = booking.pricing.finalPrice - booking.paidAmount;

    if (booking.paymentOption === 'full' && booking.paidAmount >= booking.pricing.finalPrice) {
      booking.paymentStatus = 'paid';
      console.log('✅ Full payment completed - setting paymentStatus to paid');
    } else if (booking.paymentOption === 'advance' && booking.paidAmount >= booking.pricing.advancePayment) {
      booking.paymentStatus = 'partial';
      booking.remainingAmount = booking.pricing.remainingPayment;
      console.log('✅ Advance payment completed - setting paymentStatus to partial');
    }

    // Keep booking status as pending after payment (don't auto-confirm)
    // Booking will be confirmed manually by admin
    // if (booking.status === 'pending') {
    //   booking.status = 'confirmed';
    //   booking.confirmedAt = new Date();
    //   console.log('✅ Booking status changed from pending to confirmed');
    // }
    console.log('✅ Payment verified - booking status remains:', booking.status);

    // Save booking to database
    try {
      await booking.save();
      console.log('✅✅✅ Booking saved to database successfully after payment verification ✅✅✅');
      console.log('📊 Final booking state:', {
        bookingId: booking.bookingId,
        _id: booking._id.toString(),
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paidAmount: booking.paidAmount,
        remainingAmount: booking.remainingAmount,
        previousPaidAmount,
        transactionAmount: transaction.amount,
        confirmedAt: booking.confirmedAt,
      });
    } catch (saveError) {
      console.error('❌ Error saving booking to database:', saveError);
      throw saveError;
    }

    // Populate booking details for response
    await booking.populate('car', 'brand model year color images pricePerDay');
    await booking.populate('user', 'name phone email');

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        paymentId,
        orderId,
        booking: {
          id: booking._id,
          bookingId: booking.bookingId,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          paidAmount: booking.paidAmount,
          remainingAmount: booking.remainingAmount,
        },
      },
    });
  } catch (error) {
    console.error('Verify Razorpay payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Razorpay redirect callback handler
 * @route   ALL /api/payments/razorpay/callback
 * @access  Public
 */
export const razorpayCallback = async (req, res) => {
  try {
    console.log('🔔 Razorpay callback received:', {
      method: req.method,
      query: req.query,
      body: req.body,
    });

    const isGet = req.method === 'GET';
    const src = isGet ? req.query : req.body;

    // Extract fields from either GET query or POST body
    let razorpay_order_id = src.razorpay_order_id || src.orderId || src.order_id;
    let razorpay_payment_id = src.razorpay_payment_id || src.paymentId || src.payment_id;
    let razorpay_signature = src.razorpay_signature || src.signature;

    // Build frontend callback URL
    const frontendBase = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://driveon.com' : 'http://localhost:5173');
    const url = new URL('/booking/payment-callback', frontendBase);

    // Add payment parameters
    if (razorpay_order_id) {
      url.searchParams.set('razorpay_order_id', razorpay_order_id);
      url.searchParams.set('order_id', razorpay_order_id);
    }
    if (razorpay_payment_id) {
      url.searchParams.set('razorpay_payment_id', razorpay_payment_id);
      url.searchParams.set('payment_id', razorpay_payment_id);
    }
    if (razorpay_signature) {
      url.searchParams.set('razorpay_signature', razorpay_signature);
      url.searchParams.set('signature', razorpay_signature);
    }

    console.log('🔀 Redirecting to frontend callback:', url.toString());

    // Redirect to SPA callback route
    return res.redirect(302, url.toString());
  } catch (err) {
    console.error('❌ Error in Razorpay callback handler:', err);
    const frontendBase = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://driveon.com' : 'http://localhost:5173');
    const fallbackUrl = `${frontendBase}/booking/payment-callback`;
    res.status(200).send(`<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; URL='${fallbackUrl}'" /></head><body>Redirecting...</body></html>`);
  }
};

