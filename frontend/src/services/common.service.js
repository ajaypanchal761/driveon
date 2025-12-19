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
   * Get returning cars (cars with active bookings ending soon)
   * @returns {Promise}
   */
  getReturningCars: async () => {
    try {
      const response = await api.get('/common/returning-cars');
      return response.data;
    } catch (error) {
      console.error('Get returning cars error:', error);
      // Return dummy data for now if API fails - 3 cars returning at different times
      const now = Date.now();
      return {
        success: true,
        data: {
          cars: [
            {
              _id: 'dummy1',
              brand: 'Toyota',
              model: 'Innova',
              pricePerDay: 1200,
              images: [],
              location: { city: 'Mumbai' },
              returningIn: '2 hours',
              returningDate: new Date(now + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
            },
            {
              _id: 'dummy2',
              brand: 'Hyundai',
              model: 'Creta',
              pricePerDay: 1500,
              images: [],
              location: { city: 'Delhi' },
              returningIn: '1 hour 30 mins',
              returningDate: new Date(now + 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours from now
            },
            {
              _id: 'dummy3',
              brand: 'Maruti',
              model: 'Swift Dzire',
              pricePerDay: 800,
              images: [],
              location: { city: 'Bangalore' },
              returningIn: '3 hours',
              returningDate: new Date(now + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
            },
          ],
        },
      };
    }
  },
};

export default commonService;

