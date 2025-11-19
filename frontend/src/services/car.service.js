import api from './api';
import { API_ENDPOINTS } from '../constants';

/**
 * Car Service
 * Handles all car-related API calls
 */

export const carService = {
  /**
   * Get cars list with filters
   * @param {Object} params - Query parameters (filters, pagination, sort)
   * @returns {Promise}
   */
  getCars: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.CARS.LIST, { params });
    return response.data;
  },

  /**
   * Get car details by ID
   * @param {string} id - Car ID
   * @returns {Promise}
   */
  getCarDetails: async (id) => {
    const response = await api.get(`${API_ENDPOINTS.CARS.DETAILS}/${id}`);
    return response.data;
  },

  /**
   * Get available filters
   * @returns {Promise}
   */
  getFilters: async () => {
    const response = await api.get(API_ENDPOINTS.CARS.FILTERS);
    return response.data;
  },
};

export default carService;

