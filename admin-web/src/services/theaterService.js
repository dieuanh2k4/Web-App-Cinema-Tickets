import api from './api';
import { API_ENDPOINTS } from '../config/api.config';

const theaterService = {
  /**
   * Get all theaters
   * @returns {Promise<Array>}
   */
  async getAllTheaters() {
    const response = await api.get(API_ENDPOINTS.THEATERS.GET_ALL);
    return response.data;
  },

  /**
   * Get theater by ID
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  async getTheaterById(id) {
    const response = await api.get(API_ENDPOINTS.THEATERS.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Create new theater
   * @param {Object} theaterData - { name, address, city }
   * @returns {Promise<Object>}
   */
  async createTheater(theaterData) {
    const response = await api.post(API_ENDPOINTS.THEATERS.CREATE, theaterData);
    return response.data;
  },

  /**
   * Update theater
   * @param {number} id 
   * @param {Object} theaterData - { name, address, city }
   * @returns {Promise<Object>}
   */
  async updateTheater(id, theaterData) {
    const response = await api.put(API_ENDPOINTS.THEATERS.UPDATE(id), theaterData);
    return response.data;
  },

  /**
   * Delete theater
   * @param {number} id 
   * @returns {Promise<void>}
   */
  async deleteTheater(id) {
    const response = await api.delete(API_ENDPOINTS.THEATERS.DELETE(id));
    return response.data;
  },
};

export default theaterService;
