import api from './api';
import { API_ENDPOINTS } from '../config/api.config';

const userService = {
  /**
   * Get all users (Admin only)
   * @returns {Promise<Array>}
   */
  async getAllUsers() {
    const response = await api.get(API_ENDPOINTS.USERS.GET_ALL);
    return response.data;
  },

  /**
   * Create new user
   * @param {Object} userData - {username, password, email, phoneNumber, userType}
   * @returns {Promise<Object>}
   */
  async createUser(userData) {
    const response = await api.post(API_ENDPOINTS.USERS.CREATE, userData);
    return response.data;
  },

  /**
   * Update user
   * @param {number} id 
   * @param {Object} userData 
   * @returns {Promise<Object>}
   */
  async updateUser(id, userData) {
    const response = await api.put(API_ENDPOINTS.USERS.UPDATE(id), userData);
    return response.data;
  },

  /**
   * Delete user
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  async deleteUser(id) {
    const response = await api.delete(API_ENDPOINTS.USERS.DELETE(id));
    return response.data;
  },
};

export default userService;
