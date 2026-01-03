import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const userService = {
  getProfile: async () => {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.USER.PROFILE);
      return res.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  getMyTickets: async () => {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.USER.TICKETS);
      return res.data;
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      throw error;
    }
  },
};
