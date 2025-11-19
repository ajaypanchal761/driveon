import api from './api';
import { API_ENDPOINTS } from '../constants';

/**
 * KYC Service
 * Handles all KYC-related API calls (DigiLocker integration)
 */

export const kycService = {
  /**
   * Initiate DigiLocker OAuth
   * @returns {Promise} - Returns redirect URL
   */
  initiateDigiLockerAuth: async () => {
    const response = await api.get(API_ENDPOINTS.KYC.DIGILOCKER_AUTH);
    return response.data;
  },

  /**
   * Handle DigiLocker callback
   * @param {string} code - OAuth code from DigiLocker
   * @returns {Promise}
   */
  handleDigiLockerCallback: async (code) => {
    const response = await api.get(API_ENDPOINTS.KYC.CALLBACK, {
      params: { code },
    });
    return response.data;
  },

  /**
   * Get KYC status
   * @returns {Promise}
   */
  getKYCStatus: async () => {
    const response = await api.get(API_ENDPOINTS.KYC.STATUS);
    return response.data;
  },
};

export default kycService;

