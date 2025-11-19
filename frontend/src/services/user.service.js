// Mock mode - No backend API calls, works offline for frontend design
const MOCK_MODE = true; // Set to false when backend is ready

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
    
    const api = (await import('./api')).default;
    const { API_ENDPOINTS } = await import('../constants');
    const response = await api.get(API_ENDPOINTS.USER.PROFILE);
    return response.data;
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
    
    const api = (await import('./api')).default;
    const { API_ENDPOINTS } = await import('../constants');
    const response = await api.put(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
    return response.data;
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
    
    const api = (await import('./api')).default;
    const { API_ENDPOINTS } = await import('../constants');
    const response = await api.get(API_ENDPOINTS.USER.KYC_STATUS);
    return response.data;
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
    
    // Production mode - actual API call
    const api = (await import('./api')).default;
    const { API_ENDPOINTS } = await import('../constants');
    const response = await api.post(API_ENDPOINTS.USER.UPLOAD_PHOTO, formData);
    return response.data;
  },
};

export default userService;

