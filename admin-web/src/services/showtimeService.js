import api from './api';
import { API_ENDPOINTS } from '../config/api.config';

const showtimeService = {
  /**
   * Get all showtimes
   * @returns {Promise<Array>}
   */
  async getAllShowtimes() {
    const response = await api.get(API_ENDPOINTS.SHOWTIMES.GET_ALL);
    return response.data;
  },

  /**
   * Create new showtime
   * @param {Object} showtimeData 
   * @param {number} roomId 
   * @returns {Promise<Object>}
   */
  async createShowtime(showtimeData, roomId) {
    const response = await api.post(
      `${API_ENDPOINTS.SHOWTIMES.CREATE}?roomId=${roomId}`,
      showtimeData
    );
    return response.data;
  },

  /**
   * Update showtime
   * @param {number} id 
   * @param {Object} showtimeData 
   * @param {number} roomId 
   * @returns {Promise<Object>}
   */
  async updateShowtime(id, showtimeData, roomId) {
    const response = await api.put(
      `${API_ENDPOINTS.SHOWTIMES.UPDATE(id)}?roomId=${roomId}`,
      showtimeData
    );
    return response.data;
  },

  /**
   * Delete showtime
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  async deleteShowtime(id) {
    const response = await api.delete(API_ENDPOINTS.SHOWTIMES.DELETE(id));
    return response.data;
  },

  /**
   * Get showtimes by movie
   * @param {number} theaterId 
   * @param {number} movieId 
   * @param {string} date - format: YYYY-MM-DD
   * @returns {Promise<Array>}
   */
  async getShowtimesByMovie(theaterId, movieId, date) {
    const response = await api.get(API_ENDPOINTS.SHOWTIMES.GET_BY_MOVIE, {
      params: { theaterId, movieId, date }
    });
    return response.data;
  },
};

export default showtimeService;
