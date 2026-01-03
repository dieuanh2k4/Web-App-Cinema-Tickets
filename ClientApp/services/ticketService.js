import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const ticketService = {
  bookTicket: async (bookingData) => {
    try {
      const res = await apiClient.post(
        API_CONFIG.ENDPOINTS.TICKETS.BOOK,
        bookingData
      );
      return res.data;
    } catch (error) {
      console.error("Error booking ticket:", error);
      throw error;
    }
  },

  getAllTickets: async () => {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.TICKETS.GET_ALL);
      return res.data || [];
    } catch (error) {
      console.error("Error fetching all tickets:", error);
      throw error;
    }
  },

  getTicketById: async (id) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.TICKETS.GET_BY_ID(id)
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching ticket by ID:", error);
      throw error;
    }
  },

  getTicketsByEmail: async (email) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.TICKETS.GET_BY_EMAIL(email)
      );
      return res.data || [];
    } catch (error) {
      console.error("Error fetching tickets by email:", error);
      throw error;
    }
  },

  cancelTicket: async (id) => {
    try {
      const res = await apiClient.delete(
        API_CONFIG.ENDPOINTS.TICKETS.CANCEL(id)
      );
      return res.data;
    } catch (error) {
      console.error("Error canceling ticket:", error);
      throw error;
    }
  },
};
