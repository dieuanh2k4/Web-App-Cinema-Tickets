import api from './api';
import { API_ENDPOINTS } from '../config/api.config';

const authService = {
  /**
   * Login user
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<{username: string, role: string, token: string}>}
   */
  async login(username, password) {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      username,
      password
    });
    return response.data;
  },

  /**
   * Get current user info from token
   * @returns {Promise<{username: string, role: string, userId: number}>}
   */
  async getCurrentUser() {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },
};

export default authService;
