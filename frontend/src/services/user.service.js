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
      const response = await api.post(API_ENDPOINTS.USER.UPLOAD_PHOTO, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload photo error:', error);
      throw error;
    }
  },
};

export default userService;

