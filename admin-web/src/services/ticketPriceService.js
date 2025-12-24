import api from './api';
import { API_ENDPOINTS } from '../config/api.config';

const ticketPriceService = {
  /**
   * Get all ticket prices
   * @returns {Promise<Array>}
   */
  async getAllTicketPrices() {
    const response = await api.get(API_ENDPOINTS.TICKET_PRICES.GET_ALL);
    return response.data;
  },

  /**
   * Create new ticket price
   * @param {Object} priceData - {price, roomType, seatType}
   * @returns {Promise<Object>}
   */
  async createTicketPrice(priceData) {
    const response = await api.post(API_ENDPOINTS.TICKET_PRICES.CREATE, priceData);
    return response.data;
  },

  /**
   * Update ticket price
   * @param {number} id 
   * @param {Object} priceData 
   * @returns {Promise<Object>}
   */
  async updateTicketPrice(id, priceData) {
    const response = await api.put(API_ENDPOINTS.TICKET_PRICES.UPDATE(id), priceData);
    return response.data;
  },

  /**
   * Delete ticket price
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  async deleteTicketPrice(id) {
    const response = await api.delete(API_ENDPOINTS.TICKET_PRICES.DELETE(id));
    return response.data;
  },
};

export default ticketPriceService;
