import Razorpay from 'razorpay';
import crypto from 'crypto';

/**
 * Razorpay Service
 * Handles all Razorpay payment operations
 */
class RazorpayService {
  constructor() {
    // Initialize Razorpay with error handling
    try {
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error('⚠️  RAZORPAY ENVIRONMENT VARIABLES NOT CONFIGURED!');
        console.error('Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file');
        this.razorpay = null;
      } else {
        this.razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        console.log('✅ Razorpay service initialized successfully');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Razorpay service:', error.message);
      this.razorpay = null;
    }
  }

  /**
   * Generate unique transaction ID
   */
  generateTransactionId(prefix = 'TXN') {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Create Razorpay order
   * @param {Object} orderData - Order details
   * @param {number} orderData.amount - Amount in rupees
   * @param {string} orderData.receipt - Receipt ID
   * @param {Object} orderData.notes - Additional notes
   * @returns {Promise<Object>} Razorpay order object
   */
  async createOrder(orderData) {
    try {
      if (!this.razorpay) {
        const error = new Error('Razorpay service not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
        error.code = 'RAZORPAY_NOT_CONFIGURED';
        throw error;
      }

      const { amount, receipt, notes = {} } = orderData;

      if (!amount || amount <= 0) {
        throw new Error('Invalid amount');
      }

      // Convert rupees to paise (1 INR = 100 paise)
      const amountInPaise = Math.round(parseFloat(amount) * 100);
      
      if (amountInPaise < 100) {
        throw new Error('Minimum amount is ₹1 (100 paise)');
      }

      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt || `receipt_${Date.now()}`,
        notes: notes || {},
        payment_capture: 1, // Auto capture payment
      };

      const order = await this.razorpay.orders.create(options);
      console.log('✅ Razorpay order created successfully:', order.id);

      return {
        id: order.id,
        amount: order.amount, // in paise
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        createdAt: order.created_at,
      };
    } catch (error) {
      console.error('❌ Error creating Razorpay order:', error);
      throw error;
    }
  }

  /**
   * Verify payment signature
   * @param {string} razorpay_order_id - Order ID
   * @param {string} razorpay_payment_id - Payment ID
   * @param {string} razorpay_signature - Payment signature
   * @returns {boolean} True if signature is valid
   */
  verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
    try {
      if (!process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('RAZORPAY_KEY_SECRET not configured');
      }

      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      return expectedSignature === razorpay_signature;
    } catch (error) {
      console.error('❌ Error verifying signature:', error);
      return false;
    }
  }

  /**
   * Fetch payment details from Razorpay
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Object>} Payment details
   */
  async fetchPayment(paymentId) {
    try {
      if (!this.razorpay) {
        throw new Error('Razorpay service not configured');
      }

      const payment = await this.razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error('❌ Error fetching payment:', error);
      throw error;
    }
  }

  /**
   * Fetch order details from Razorpay
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order details
   */
  async fetchOrder(orderId) {
    try {
      if (!this.razorpay) {
        throw new Error('Razorpay service not configured');
      }

      const order = await this.razorpay.orders.fetch(orderId);
      return order;
    } catch (error) {
      console.error('❌ Error fetching order:', error);
      throw error;
    }
  }
}

// Export singleton instance
const razorpayService = new RazorpayService();

// Add a method to check if Razorpay is configured
razorpayService.isConfigured = function() {
  return this.razorpay !== null;
};

export default razorpayService;

