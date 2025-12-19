import api from './api';

/**
 * Admin Service
 * Handles admin authentication API calls
 */
export const adminService = {
  /**
   * Admin Signup
   * @param {Object} data - Signup data (name, email, password)
   * @returns {Promise}
   */
  signup: async (data) => {
    try {
      const response = await api.post('/admin/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      return response.data;
    } catch (error) {
      console.error('Admin signup error:', error);
      throw error;
    }
  },

  /**
   * Admin Login
   * @param {Object} credentials - Login credentials (email, password)
   * @returns {Promise}
   */
  login: async (credentials) => {
    try {
      console.log('Admin login service called with:', { email: credentials.email });
      const response = await api.post('/admin/login', {
        email: credentials.email,
        password: credentials.password,
      });
      console.log('Admin login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Admin login error:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
        url: error.config?.url,
      });
      // Preserve the actual backend error message
      if (error.response?.data?.message) {
        const backendError = new Error(error.response.data.message);
        backendError.response = error.response;
        throw backendError;
      }
      throw error;
    }
  },

  /**
   * Get Admin Profile
   * @returns {Promise}
   */
  getProfile: async () => {
    try {
      const response = await api.get('/admin/profile');
      return response.data;
    } catch (error) {
      console.error('Get admin profile error:', error);
      throw error;
    }
  },

  /**
   * Refresh Admin Token
   * @param {String} refreshToken - Refresh token
   * @returns {Promise}
   */
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post('/admin/refresh-token', {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      console.error('Admin refresh token error:', error);
      throw error;
    }
  },

  /**
   * Admin Logout
   * @returns {Promise}
   */
  logout: async () => {
    try {
      const response = await api.post('/admin/logout');
      return response.data;
    } catch (error) {
      console.error('Admin logout error:', error);
      throw error;
    }
  },

  /**
   * Get All Users (Admin)
   * @param {Object} params - Query parameters (page, limit, search, filters)
   * @returns {Promise}
   */
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  },

  /**
   * Get User by ID (Admin)
   * @param {String} userId - User ID
   * @returns {Promise}
   */
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  },

  /**
   * Update User Status (Admin)
   * @param {String} userId - User ID
   * @param {String} action - Action: 'activate', 'suspend', or 'ban'
   * @returns {Promise}
   */
  updateUserStatus: async (userId, action) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, { action });
      return response.data;
    } catch (error) {
      console.error('Update user status error:', error);
      throw error;
    }
  },

  /**
   * Get All Cars (Admin)
   * @param {Object} params - Query parameters (page, limit, search, filters)
   * @returns {Promise}
   */
  getAllCars: async (params = {}) => {
    try {
      const response = await api.get('/admin/cars', { params });
      return response.data;
    } catch (error) {
      console.error('Get all cars (admin) error:', error);
      throw error;
    }
  },

  /**
   * Create New Car (Admin)
   * @param {FormData} formData - Car data with images
   * @returns {Promise}
   */
  createCar: async (formData) => {
    try {
      const response = await api.post('/admin/cars', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Create car (admin) error:', error);
      throw error;
    }
  },

  /**
   * Get Car by ID (Admin)
   * @param {String} carId - Car ID
   * @returns {Promise}
   */
  getCarById: async (carId) => {
    try {
      const response = await api.get(`/admin/cars/${carId}`);
      return response.data;
    } catch (error) {
      console.error('Get car by ID (admin) error:', error);
      throw error;
    }
  },

  /**
   * Update Car (Admin)
   * @param {String} carId - Car ID
   * @param {FormData} formData - Car data with images
   * @returns {Promise}
   */
  updateCar: async (carId, formData) => {
    try {
      const response = await api.put(`/admin/cars/${carId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Update car (admin) error:', error);
      throw error;
    }
  },

  /**
   * Update Car Status (Admin)
   * @param {String} carId - Car ID
   * @param {String} status - Status: 'pending', 'active', 'inactive', 'suspended', 'rejected'
   * @param {String} rejectionReason - Optional rejection reason
   * @returns {Promise}
   */
  updateCarStatus: async (carId, status, rejectionReason) => {
    try {
      const response = await api.put(`/admin/cars/${carId}/status`, { status, rejectionReason });
      return response.data;
    } catch (error) {
      console.error('Update car status error:', error);
      throw error;
    }
  },

  /**
   * Delete Car (Admin)
   * @param {String} carId - Car ID
   * @returns {Promise}
   */
  deleteCar: async (carId) => {
    try {
      const response = await api.delete(`/admin/cars/${carId}`);
      return response.data;
    } catch (error) {
      console.error('Delete car error:', error);
      throw error;
    }
  },

  /**
   * Toggle Car Featured Status (Admin)
   * @param {String} carId - Car ID
   * @returns {Promise}
   */
  toggleCarFeatured: async (carId) => {
    try {
      const response = await api.put(`/admin/cars/${carId}/featured`);
      return response.data;
    } catch (error) {
      console.error('Toggle car featured error:', error);
      throw error;
    }
  },

  /**
   * Toggle Car Popular Status (Admin)
   * @param {String} carId - Car ID
   * @returns {Promise}
   */
  toggleCarPopular: async (carId) => {
    try {
      const response = await api.put(`/admin/cars/${carId}/popular`);
      return response.data;
    } catch (error) {
      console.error('Toggle car popular error:', error);
      throw error;
    }
  },

  /**
   * Update Admin Profile
   * @param {Object} data - Profile data (name, phone)
   * @returns {Promise}
   */
  updateProfile: async (data) => {
    try {
      const response = await api.put('/admin/profile', data);
      return response.data;
    } catch (error) {
      console.error('Update admin profile error:', error);
      throw error;
    }
  },

  /**
   * Get All Bookings (Admin)
   * @param {Object} params - Query parameters (page, limit, status, paymentStatus, etc.)
   * @returns {Promise}
   */
  getAllBookings: async (params = {}) => {
    try {
      const response = await api.get('/admin/bookings', { params });
      return response.data;
    } catch (error) {
      console.error('Get all bookings (admin) error:', error);
      throw error;
    }
  },

  /**
   * Get Booking by ID (Admin)
   * @param {String} bookingId - Booking ID
   * @returns {Promise}
   */
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/admin/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Get booking by ID (admin) error:', error);
      throw error;
    }
  },

  /**
   * Update Booking (Admin)
   * @param {String} bookingId - Booking ID
   * @param {Object} data - Booking update data (status, adminNotes, etc.)
   * @returns {Promise}
   */
  updateBooking: async (bookingId, data) => {
    try {
      const response = await api.patch(`/admin/bookings/${bookingId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update booking (admin) error:', error);
      throw error;
    }
  },

  /**
   * Get Active Bookings with Tracking (Admin)
   * @returns {Promise}
   */
  getActiveBookingsWithTracking: async () => {
    try {
      const response = await api.get('/admin/bookings/active/tracking');
      return response.data;
    } catch (error) {
      console.error('Get active bookings with tracking error:', error);
      throw error;
    }
  },

  /**
   * Get Guarantor Points for a Booking (Admin)
   * @param {String} bookingId - Booking ID
   * @returns {Promise}
   */
  getBookingGuarantorPoints: async (bookingId) => {
    try {
      const response = await api.get(`/admin/bookings/${bookingId}/guarantor-points`);
      return response.data;
    } catch (error) {
      console.error('Get booking guarantor points error:', error);
      throw error;
    }
  },

  /**
   * Get Add-On Services Prices (Admin)
   * @returns {Promise}
   */
  getAddOnServicesPrices: async () => {
    try {
      const response = await api.get('/admin/addon-services/prices');
      return response.data;
    } catch (error) {
      console.error('Get add-on services prices error:', error);
      throw error;
    }
  },

  /**
   * Update Add-On Services Prices (Admin)
   * @param {Object} prices - Prices object { driver, bodyguard, gunmen, bouncer }
   * @returns {Promise}
   */
  updateAddOnServicesPrices: async (prices) => {
    try {
      const response = await api.put('/admin/addon-services/prices', prices);
      return response.data;
    } catch (error) {
      console.error('Update add-on services prices error:', error);
      throw error;
    }
  },

  /**
   * Get Booking Statistics (Admin)
   * @param {Object} params - Query parameters (dateFrom, dateTo)
   * @returns {Promise}
   */
  getBookingStats: async (params = {}) => {
    try {
      const response = await api.get('/admin/bookings/stats', { params });
      return response.data;
    } catch (error) {
      console.error('Get booking stats error:', error);
      throw error;
    }
  },

  /**
   * Change Admin Password
   * @param {Object} data - Password data (currentPassword, newPassword)
   * @returns {Promise}
   */
  changePassword: async (data) => {
    try {
      const response = await api.put('/admin/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Change admin password error:', error);
      throw error;
    }
  },

  /**
   * Get Dashboard Statistics
   * @returns {Promise}
   */
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  },

  /**
   * Get System Settings
   * @returns {Promise}
   */
  getSystemSettings: async () => {
    try {
      const response = await api.get('/admin/settings');
      return response.data;
    } catch (error) {
      console.error('Get system settings error:', error);
      throw error;
    }
  },

  /**
   * Update System Settings
   * @param {Object} data - Settings data (appName, contactEmail, contactPhone)
   * @returns {Promise}
   */
  updateSystemSettings: async (data) => {
    try {
      const response = await api.put('/admin/settings', data);
      return response.data;
    } catch (error) {
      console.error('Update system settings error:', error);
      throw error;
    }
  },

  /**
   * Send Guarantor Request
   * @param {Object} data - Request data (bookingId, guarantorId)
   * @returns {Promise}
   */
  sendGuarantorRequest: async (data) => {
    try {
      const response = await api.post('/admin/guarantor-requests', data);
      return response.data;
    } catch (error) {
      console.error('Send guarantor request error:', error);
      throw error;
    }
  },

  /**
   * Get All Guarantor Requests
   * @param {Object} params - Query parameters (status, bookingId)
   * @returns {Promise}
   */
  getAllGuarantorRequests: async (params = {}) => {
    try {
      const response = await api.get('/admin/guarantor-requests', { params });
      return response.data;
    } catch (error) {
      console.error('Get guarantor requests error:', error);
      throw error;
    }
  },

  /**
   * Get Guarantor Request by ID
   * @param {String} requestId - Request ID
   * @returns {Promise}
   */
  getGuarantorRequestById: async (requestId) => {
    try {
      const response = await api.get(`/admin/guarantor-requests/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Get guarantor request error:', error);
      throw error;
    }
  },

  /**
   * Delete Guarantor Request
   * @param {String} requestId - Request ID
   * @returns {Promise}
   */
  deleteGuarantorRequest: async (requestId) => {
    try {
      const response = await api.delete(`/admin/guarantor-requests/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Delete guarantor request error:', error);
      throw error;
    }
  },

  /**
   * Get Latest Locations (Admin)
   * @param {Object} params - Query parameters (userType: 'user' | 'guarantor')
   * @returns {Promise}
   */
  getLatestLocations: async (params = {}) => {
    try {
      const response = await api.get('/admin/locations/latest', { params });
      return response.data;
    } catch (error) {
      console.error('Get latest locations error:', error);
      throw error;
    }
  },

  /**
   * Get User Location History (Admin)
   * @param {String} userId - User ID
   * @param {Object} params - Query parameters (userType, limit)
   * @returns {Promise}
   */
  getUserLocationHistory: async (userId, params = {}) => {
    try {
      const response = await api.get(`/admin/locations/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Get user location history error:', error);
      throw error;
    }
  },

  /**
   * Get All Referrals (Admin)
   * @param {Object} params - Query parameters (status, dateRange, referrer, search)
   * @returns {Promise}
   */
  getAllReferrals: async (params = {}) => {
    try {
      const response = await api.get('/admin/referrals', { params });
      return response.data;
    } catch (error) {
      console.error('Get all referrals error:', error);
      throw error;
    }
  },

  /**
   * Update Referral Points (Admin)
   * @param {String} referralId - Referral ID (referred user ID)
   * @param {Number} points - Points to add (can be negative to subtract)
   * @returns {Promise}
   */
  updateReferralPoints: async (referralId, points) => {
    try {
      const response = await api.put(`/admin/referrals/${referralId}/points`, { points });
      return response.data;
    } catch (error) {
      console.error('Update referral points error:', error);
      throw error;
    }
  },
};

export default adminService;

