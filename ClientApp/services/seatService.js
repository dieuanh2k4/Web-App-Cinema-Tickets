import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const seatService = {
  getSeatsByShowtime: async (showtimeId) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.SEATS.GET_BY_SHOWTIME(showtimeId)
      );
      const data = res.data || {};
      const seatsDto = data.seats || [];

      return seatsDto.map((s) => ({
        id: s.seatId,
        name: s.seatNumber,
        type: s.seatType,
        status: s.status,
        isAvailable: s.isAvailable,
        row: s.row,
        column: s.column,
      }));
    } catch (error) {
      console.error("Error fetching seats by showtime:", error);
      return [];
    }
  },

  checkAvailability: async (showtimeId, seatIds) => {
    try {
      const res = await apiClient.post(
        API_CONFIG.ENDPOINTS.SEATS.CHECK_AVAILABILITY,
        {
          ShowtimeId: showtimeId,
          SeatIds: seatIds,
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error checking seat availability:", error);
      throw error;
    }
  },
};
