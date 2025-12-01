// Mock mode - No backend API calls, works offline for frontend design
const MOCK_MODE = false; // Backend is ready - using actual API calls

// Mock delay to simulate API call
const mockDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * User Service
 * Mock mode: Simulates API calls without backend
 * Production mode: Makes actual API calls
 */

export const userService = {
  /**
   * Get user profile
   * @returns {Promise}
   */
  getProfile: async () => {
    if (MOCK_MODE) {
      await mockDelay(500);
      return {
        user: {
          id: 'mock_user',
          name: '',
          email: '',
          phone: '',
          profilePhoto: null,
        },
      };
    }
    
    try {
      const api = (await import('./api')).default;
      const { API_ENDPOINTS } = await import('../constants');
      const response = await api.get(API_ENDPOINTS.USER.PROFILE);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} data - Profile data
   * @returns {Promise}
   */
  updateProfile: async (data) => {
    if (MOCK_MODE) {
      await mockDelay(800);
      return {
        user: {
          ...data,
          id: 'mock_user',
        },
        success: true,
      };
    }
    
    try {
      const api = (await import('./api')).default;
      const { API_ENDPOINTS } = await import('../constants');
      const response = await api.put(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      
      // Enhance error with user-friendly message
      if (error.isNetworkError || error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
        const enhancedError = new Error(
          error.message || 'Unable to connect to server. Please check your internet connection or try again later.'
        );
        enhancedError.code = error.code;
        enhancedError.isNetworkError = true;
        throw enhancedError;
      }
      
      throw error;
    }
  },

  /**
   * Get KYC status
   * @returns {Promise}
   */
  getKYCStatus: async () => {
    if (MOCK_MODE) {
      await mockDelay(500);
      return {
        aadhaarVerified: false,
        panVerified: false,
        drivingLicenseVerified: false,
      };
    }
    
    try {
      const api = (await import('./api')).default;
      const { API_ENDPOINTS } = await import('../constants');
      const response = await api.get(API_ENDPOINTS.USER.KYC_STATUS);
      return response.data;
    } catch (error) {
      console.error('Get KYC status error:', error);
      throw error;
    }
  },

  /**
   * Upload profile photo
   * @param {FormData} formData - Form data with image
   * @returns {Promise}
   */
  uploadPhoto: async (formData) => {
    if (MOCK_MODE) {
      await mockDelay(1000);
      // Create a mock URL from the file (data URL)
      const file = formData.get('photo') || formData.get('file') || formData.get('image');
      
      if (file instanceof File) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const mockUrl = reader.result; // This will be a data URL
            resolve({
              profilePhoto: mockUrl,
              photo: mockUrl,
              imageUrl: mockUrl,
              url: mockUrl,
              success: true,
            });
          };
          reader.readAsDataURL(file);
        });
      }
      
      // Fallback if file not found
      return {
        profilePhoto: 'mock_photo_url',
        success: true,
      };
    }
    
    try {
      // Production mode - actual API call
      const api = (await import('./api')).default;
      const { API_ENDPOINTS } = await import('../constants');
      
      // Don't set Content-Type header - let axios/browser set it with boundary
      // The API interceptor will handle adding the Authorization header
      const response = await api.post(API_ENDPOINTS.USER.UPLOAD_PHOTO, formData);
      return response.data;
    } catch (error) {
      console.error('Upload photo error:', error);
      
      // Provide user-friendly error messages
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message || 'Authentication failed. Please log in again.';
        const authError = new Error(errorMessage);
        authError.code = 'AUTH_ERROR';
        authError.status = 401;
        throw authError;
      }
      
      throw error;
    }
  },

  /**
   * Get My Guarantor Requests
   * @returns {Promise}
   */
  getMyGuarantorRequests: async () => {
    try {
      const api = (await import('./api')).default;
      const { API_ENDPOINTS } = await import('../constants');
      const response = await api.get(API_ENDPOINTS.USER.GUARANTOR_REQUESTS || '/user/guarantor-requests');
      return response.data;
    } catch (error) {
      console.error('Get guarantor requests error:', error);
      throw error;
    }
  },

  /**
   * Get Guarantor Request Details
   * @param {String} requestId - Request ID
   * @returns {Promise}
   */
  getGuarantorRequestDetails: async (requestId) => {
    try {
      const api = (await import('./api')).default;
      const { API_ENDPOINTS } = await import('../constants');
      const response = await api.get(`${API_ENDPOINTS.USER.GUARANTOR_REQUESTS || '/user/guarantor-requests'}/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Get guarantor request details error:', error);
      throw error;
    }
  },

  /**
   * Accept Guarantor Request
   * @param {String} requestId - Request ID
   * @returns {Promise}
   */
  acceptGuarantorRequest: async (requestId) => {
    try {
      const api = (await import('./api')).default;
      const { API_ENDPOINTS } = await import('../constants');
      const response = await api.post(`${API_ENDPOINTS.USER.GUARANTOR_REQUESTS || '/user/guarantor-requests'}/${requestId}/accept`);
      return response.data;
    } catch (error) {
      console.error('Accept guarantor request error:', error);
      throw error;
    }
  },

  /**
   * Reject Guarantor Request
   * @param {String} requestId - Request ID
   * @param {String} reason - Rejection reason (optional)
   * @returns {Promise}
   */
  rejectGuarantorRequest: async (requestId, reason) => {
    try {
      const api = (await import('./api')).default;
      const { API_ENDPOINTS } = await import('../constants');
      const response = await api.post(`${API_ENDPOINTS.USER.GUARANTOR_REQUESTS || '/user/guarantor-requests'}/${requestId}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error('Reject guarantor request error:', error);
      throw error;
    }
  },
};

export default userService;

