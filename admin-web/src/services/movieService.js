import api from './api';
import { API_ENDPOINTS } from '../config/api.config';

const movieService = {
  /**
   * Get all movies
   * @returns {Promise<Array>}
   */
  async getAllMovies() {
    const response = await api.get(API_ENDPOINTS.MOVIES.GET_ALL);
    return response.data;
  },

  /**
   * Get movie by ID
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  async getMovieById(id) {
    const response = await api.get(API_ENDPOINTS.MOVIES.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Create new movie
   * @param {Object} movieData 
   * @returns {Promise<Object>}
   */
  async createMovie(movieData) {
    // Convert to FormData because BE expects [FromForm]
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(movieData).forEach(key => {
      if (movieData[key] !== null && movieData[key] !== undefined) {
        if (Array.isArray(movieData[key])) {
          // For arrays (like actors), append each item
          movieData[key].forEach(item => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, movieData[key]);
        }
      }
    });
    
    const response = await api.post(API_ENDPOINTS.MOVIES.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  },

  /**
   * Update movie
   * @param {number} id 
   * @param {Object} movieData 
   * @returns {Promise<Object>}
   */
  async updateMovie(id, movieData) {
    // Convert to FormData because BE expects [FromForm]
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(movieData).forEach(key => {
      if (movieData[key] !== null && movieData[key] !== undefined) {
        if (Array.isArray(movieData[key])) {
          // For arrays (like actors), append each item
          movieData[key].forEach(item => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, movieData[key]);
        }
      }
    });
    
    const response = await api.put(API_ENDPOINTS.MOVIES.UPDATE(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  },

  /**
   * Delete movie
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  async deleteMovie(id) {
    const response = await api.delete(API_ENDPOINTS.MOVIES.DELETE(id));
    return response.data;
  },
};

export default movieService;
