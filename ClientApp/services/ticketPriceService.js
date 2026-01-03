import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const ticketPriceService = {
  getAllPrices: async () => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.TICKET_PRICES.GET_ALL
      );
      return res.data || [];
    } catch (error) {
      console.error("Error fetching all ticket prices:", error);
      throw error;
    }
  },

  createPrice: async (priceData) => {
    try {
      const res = await apiClient.post(
        API_CONFIG.ENDPOINTS.TICKET_PRICES.CREATE,
        priceData
      );
      return res.data;
    } catch (error) {
      console.error("Error creating ticket price:", error);
      throw error;
    }
  },

  updatePrice: async (id, priceData) => {
    try {
      const res = await apiClient.put(
        API_CONFIG.ENDPOINTS.TICKET_PRICES.UPDATE(id),
        priceData
      );
      return res.data;
    } catch (error) {
      console.error("Error updating ticket price:", error);
      throw error;
    }
  },

  deletePrice: async (id) => {
    try {
      const res = await apiClient.delete(
        API_CONFIG.ENDPOINTS.TICKET_PRICES.DELETE(id)
      );
      return res.data;
    } catch (error) {
      console.error("Error deleting ticket price:", error);
      throw error;
    }
  },
};
