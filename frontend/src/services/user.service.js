import api from './api';
import { API_ENDPOINTS } from '../constants';

/**
 * User Service
 * Handles all user-related API calls
 */

export const userService = {
  /**
   * Get user profile
   * @returns {Promise}
   */
  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.USER.PROFILE);
    return response.data;
  },

  /**
   * Update user profile
   * @param {Object} data - Profile data
   * @returns {Promise}
   */
  updateProfile: async (data) => {
    const response = await api.put(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
    return response.data;
  },

  /**
   * Get KYC status
   * @returns {Promise}
   */
  getKYCStatus: async () => {
    const response = await api.get(API_ENDPOINTS.USER.KYC_STATUS);
    return response.data;
  },

  /**
   * Upload profile photo
   * @param {FormData} formData - Form data with image
   * @returns {Promise}
   */
  uploadPhoto: async (formData) => {
    const response = await api.post(API_ENDPOINTS.USER.UPLOAD_PHOTO, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default userService;

