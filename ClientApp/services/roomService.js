import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const roomService = {
  getAllRooms: async () => {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.ROOMS.GET_ALL);
      return res.data || [];
    } catch (error) {
      console.error("Error fetching all rooms:", error);
      throw error;
    }
  },

  createRoom: async (
    roomData,
    row,
    seatsInRow,
    normalSeats,
    coupleRowsSeats
  ) => {
    try {
      const res = await apiClient.post(
        `${API_CONFIG.ENDPOINTS.ROOMS.CREATE}?row=${row}&seatsInRow=${seatsInRow}&normalSeats=${normalSeats}&coupleRowsSeats=${coupleRowsSeats}`,
        roomData
      );
      return res.data;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  },

  updateRoom: async (
    id,
    roomData,
    row,
    seatsInRow,
    normalSeats,
    coupleRowsSeats
  ) => {
    try {
      const res = await apiClient.put(
        `${API_CONFIG.ENDPOINTS.ROOMS.UPDATE(
          id
        )}?row=${row}&seatsInRow=${seatsInRow}&normalSeats=${normalSeats}&coupleRowsSeats=${coupleRowsSeats}`,
        roomData
      );
      return res.data;
    } catch (error) {
      console.error("Error updating room:", error);
      throw error;
    }
  },

  deleteRoom: async (id) => {
    try {
      const res = await apiClient.delete(API_CONFIG.ENDPOINTS.ROOMS.DELETE(id));
      return res.data;
    } catch (error) {
      console.error("Error deleting room:", error);
      throw error;
    }
  },
};
