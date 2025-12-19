import api from './api';

/**
 * Common Service
 * Handles all common API calls (banners, FAQs, promotional content, etc.)
 */

export const commonService = {
  /**
   * Get hero banners
   * @returns {Promise}
   */
  getHeroBanners: async () => {
    try {
      const response = await api.get('/common/banners/hero');
      return response.data;
    } catch (error) {
      console.error('Get hero banners error:', error);
      throw error;
    }
  },

  /**
   * Get FAQs
   * @returns {Promise}
   */
  getFAQs: async () => {
    try {
      const response = await api.get('/common/faqs');
      return response.data;
    } catch (error) {
      console.error('Get FAQs error:', error);
      throw error;
    }
  },

  /**
   * Get promotional banner
   * @returns {Promise}
   */
  getPromotionalBanner: async () => {
    try {
      const response = await api.get('/common/banners/promotional');
      return response.data;
    } catch (error) {
      console.error('Get promotional banner error:', error);
      throw error;
    }
  },

  /**
   * Get banner overlay
   * @returns {Promise}
   */
  getBannerOverlay: async () => {
    try {
      const response = await api.get('/common/banners/overlay');
      return response.data;
    } catch (error) {
      console.error('Get banner overlay error:', error);
      throw error;
    }
  },

  /**
   * Get add-on services prices
   * @returns {Promise}
   */
  getAddOnServicesPrices: async () => {
    try {
      const response = await api.get('/common/addon-services/prices');
      return response.data;
    } catch (error) {
      console.error('Get add-on services prices error:', error);
      throw error;
    }
  },
};

export default commonService;

