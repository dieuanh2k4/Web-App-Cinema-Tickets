import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const theaterService = {
  getAllTheaters: async () => {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.THEATERS.GET_ALL);
      return res.data || [];
    } catch (error) {
      console.error("Error fetching all theaters:", error);
      return [];
    }
  },

  getTheaterById: async (id) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.THEATERS.GET_BY_ID(id)
      );
      return res.data || null;
    } catch (error) {
      console.error("Error fetching theater by id:", error);
      throw error;
    }
  },

  getTheatersByCity: async (city) => {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.THEATERS.GET_BY_CITY(city);
      const res = await apiClient.get(endpoint);
      return res.data || [];
    } catch (error) {
      console.error("Error fetching theaters by city:", error);
      return [];
    }
  },

  getCities: async () => {
    try {
      const theaters = await theaterService.getAllTheaters();
      const cities = [...new Set(theaters.map((t) => t.city))].filter(Boolean);
      return cities.sort();
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  },
};
