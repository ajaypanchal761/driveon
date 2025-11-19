import api from './api';
import { API_ENDPOINTS } from '../constants';

/**
 * Auth Service
 * Handles all authentication-related API calls
 */

export const authService = {
  /**
   * Register new user
   * @param {Object} data - Registration data (email, phone, referralCode)
   * @returns {Promise}
   */
  register: async (data) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials (email/phone, password)
   * @returns {Promise}
   */
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  /**
   * Verify OTP
   * @param {Object} data - OTP data (email/phone, otp)
   * @returns {Promise}
   */
  verifyOTP: async (data) => {
    const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
    return response.data;
  },

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise}
   */
  refreshToken: async (refreshToken) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refreshToken,
    });
    return response.data;
  },

  /**
   * Logout user
   * @returns {Promise}
   */
  logout: async () => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },
};

export default authService;

