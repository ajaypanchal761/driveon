import api from './api';
import { API_ENDPOINTS } from '../constants';

/**
 * Payment Service
 * Handles all payment-related API calls
 */

export const paymentService = {
  /**
   * Create payment order (Razorpay)
   * @param {Object} data - Payment data (amount, bookingId, etc.)
   * @returns {Promise}
   */
  createOrder: async (data) => {
    const response = await api.post(API_ENDPOINTS.PAYMENT.CREATE_ORDER, data);
    return response.data;
  },

  /**
   * Verify payment
   * @param {Object} data - Payment verification data
   * @returns {Promise}
   */
  verifyPayment: async (data) => {
    const response = await api.post(API_ENDPOINTS.PAYMENT.VERIFY, data);
    return response.data;
  },
};

export default paymentService;

