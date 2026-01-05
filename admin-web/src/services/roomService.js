import api from './api';
import { API_ENDPOINTS } from '../config/api.config';

const roomService = {
  /**
   * Get all rooms
   * @returns {Promise<Array>}
   */
  async getAllRooms() {
    const response = await api.get(API_ENDPOINTS.ROOMS.GET_ALL);
    return response.data;
  },

  /**
   * Create new room
   * BE expects: [FromBody] CreateRoomDto + query params (row, seatsInRow, normalSeats, coupleRowsSeats)
   * @param {Object} roomData - {name, capacity, status, theaterId, type}
   * @param {Object} seatConfig - {row, seatsInRow, normalSeats, coupleRowsSeats}
   * @returns {Promise<Object>}
   */
  async createRoom(roomData, seatConfig) {
    const { row, seatsInRow, normalSeats, coupleRowsSeats } = seatConfig;
    const response = await api.post(
      `${API_ENDPOINTS.ROOMS.CREATE}?row=${row}&seatsInRow=${seatsInRow}&normalSeats=${normalSeats}&coupleRowsSeats=${coupleRowsSeats}`,
      roomData
    );
    return response.data;
  },

  /**
   * Update room
   * @param {number} id 
   * @param {Object} roomData 
   * @param {Object} seatConfig 
   * @returns {Promise<Object>}
   */
  async updateRoom(id, roomData, seatConfig) {
    const { row, seatsInRow, normalSeats, coupleRowsSeats } = seatConfig;
    const response = await api.put(
      `${API_ENDPOINTS.ROOMS.UPDATE(id)}?row=${row}&seatsInRow=${seatsInRow}&normalSeats=${normalSeats}&coupleRowsSeats=${coupleRowsSeats}`,
      roomData
    );
    return response.data;
  },

  /**
   * Delete room
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  async deleteRoom(id) {
    const response = await api.delete(API_ENDPOINTS.ROOMS.DELETE(id));
    return response.data;
  },

  /**
   * Get room detail with seats
   * @param {number} id 
   * @returns {Promise<Object>} Room with seats array
   */
  async getRoomDetail(id) {
    const response = await api.get(API_ENDPOINTS.ROOMS.GET_DETAIL(id));
    return response.data;
  },

  /**
   * Update seat layout for a room
   * @param {number} roomId 
   * @param {Array} seats - Array of seat objects with id, name, type, price, status
   * @returns {Promise<Object>}
   */
  async updateSeatLayout(roomId, seats) {
    const response = await api.put(API_ENDPOINTS.ROOMS.UPDATE_SEAT_LAYOUT(roomId), {
      seats: seats
    });
    return response.data;
  },
};

export default roomService;
