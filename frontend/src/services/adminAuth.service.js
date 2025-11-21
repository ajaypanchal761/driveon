// Mock mode - No backend API calls, works offline for frontend design
const MOCK_MODE = true; // Set to false when backend is ready

/**
 * Admin Auth Service
 * Mock mode: Simulates API calls without backend
 * Production mode: Makes actual API calls
 */

// Mock delay to simulate API call
const mockDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export const adminAuthService = {
  /**
   * Admin Login
   * @param {Object} credentials - Login credentials (emailOrPhone, password, rememberMe)
   * @returns {Promise}
   */
  login: async (credentials) => {
    if (MOCK_MODE) {
      await mockDelay(1000);
      
      // Mock validation - accept any credentials for testing
      // In production, this would be validated against backend
      const mockToken = 'admin_mock_token_' + Date.now();
      const mockRefreshToken = 'admin_mock_refresh_token_' + Date.now();
      
      // Store admin auth in localStorage
      localStorage.setItem('adminAuthToken', mockToken);
      localStorage.setItem('adminRefreshToken', mockRefreshToken);
      localStorage.setItem('adminUser', JSON.stringify({
        id: 'admin_' + Date.now(),
        email: credentials.emailOrPhone.includes('@') ? credentials.emailOrPhone : '',
        phone: !credentials.emailOrPhone.includes('@') ? credentials.emailOrPhone : '',
        role: 'admin',
        name: 'Admin User',
      }));
      
      // Store remember me preference
      if (credentials.rememberMe) {
        localStorage.setItem('adminRememberMe', 'true');
      }
      
      return {
        token: mockToken,
        refreshToken: mockRefreshToken,
        user: {
          id: 'admin_' + Date.now(),
          email: credentials.emailOrPhone.includes('@') ? credentials.emailOrPhone : '',
          phone: !credentials.emailOrPhone.includes('@') ? credentials.emailOrPhone : '',
          role: 'admin',
          name: 'Admin User',
        },
      };
    }
    
    // Production mode - actual API call
    const api = (await import('./api')).default;
    const { API_ENDPOINTS } = await import('../constants');
    const response = await api.post(API_ENDPOINTS.ADMIN_AUTH?.LOGIN || '/api/admin/auth/login', credentials);
    return response.data;
  },

  /**
   * Admin Signup
   * @param {Object} data - Signup data (invitationCode, name, email, phone, password, role)
   * @returns {Promise}
   */
  signup: async (data) => {
    if (MOCK_MODE) {
      await mockDelay(1200);
      
      // Mock validation - check invitation code
      const validInvitationCodes = ['ADMIN2024', 'SUPERADMIN2024'];
      if (!validInvitationCodes.includes(data.invitationCode)) {
        throw new Error('Invalid invitation code');
      }
      
      return {
        success: true,
        message: 'Admin account created successfully. Please verify your email.',
      };
    }
    
    // Production mode - actual API call
    const api = (await import('./api')).default;
    const { API_ENDPOINTS } = await import('../constants');
    const response = await api.post(API_ENDPOINTS.ADMIN_AUTH?.SIGNUP || '/api/admin/auth/signup', data);
    return response.data;
  },

  /**
   * Admin Logout
   * @returns {Promise}
   */
  logout: async () => {
    if (MOCK_MODE) {
      await mockDelay(300);
      localStorage.removeItem('adminAuthToken');
      localStorage.removeItem('adminRefreshToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminRememberMe');
      return { success: true };
    }
    
    const api = (await import('./api')).default;
    const { API_ENDPOINTS } = await import('../constants');
    const response = await api.post(API_ENDPOINTS.ADMIN_AUTH?.LOGOUT || '/api/admin/auth/logout');
    return response.data;
  },

  /**
   * Refresh admin access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise}
   */
  refreshToken: async (refreshToken) => {
    if (MOCK_MODE) {
      await mockDelay(500);
      return {
        token: 'admin_mock_token_' + Date.now(),
      };
    }
    
    const api = (await import('./api')).default;
    const { API_ENDPOINTS } = await import('../constants');
    const response = await api.post(API_ENDPOINTS.ADMIN_AUTH?.REFRESH_TOKEN || '/api/admin/auth/refresh-token', {
      refreshToken,
    });
    return response.data;
  },

  /**
   * Get admin profile
   * @returns {Promise}
   */
  getProfile: async () => {
    if (MOCK_MODE) {
      await mockDelay(500);
      const adminUser = localStorage.getItem('adminUser');
      if (adminUser) {
        return JSON.parse(adminUser);
      }
      throw new Error('Not authenticated');
    }
    
    const api = (await import('./api')).default;
    const { API_ENDPOINTS } = await import('../constants');
    const response = await api.get(API_ENDPOINTS.ADMIN_AUTH?.PROFILE || '/api/admin/auth/profile');
    return response.data;
  },

  /**
   * Forgot Password
   * @param {Object} data - Forgot password data (emailOrPhone)
   * @returns {Promise}
   */
  forgotPassword: async (data) => {
    if (MOCK_MODE) {
      await mockDelay(800);
      return {
        success: true,
        message: 'Password reset link sent to your email/phone',
      };
    }
    
    const api = (await import('./api')).default;
    const { API_ENDPOINTS } = await import('../constants');
    const response = await api.post(API_ENDPOINTS.ADMIN_AUTH?.FORGOT_PASSWORD || '/api/admin/auth/forgot-password', data);
    return response.data;
  },
};

export default adminAuthService;

