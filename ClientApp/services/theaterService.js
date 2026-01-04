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

  getCities: async () => {
    try {
      const theaters = await theaterService.getAllTheaters();
      const cities = [...new Set(theaters.map((t) => t.city).filter(Boolean))];
      return cities.sort();
    } catch (error) {
      console.error("Error getting cities:", error);
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

  getTheaterByCity: async (city) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.THEATERS.GET_BY_CITY(city)
      );
      return res.data || [];
    } catch (error) {
      console.error("Error fetching theaters by city:", error);
      return [];
    }
  },

  createTheater: async (theaterData) => {
    try {
      const res = await apiClient.post(
        API_CONFIG.ENDPOINTS.THEATERS.CREATE,
        theaterData
      );
      return res.data;
    } catch (error) {
      console.error("Error creating theater:", error);
      throw error;
    }
  },

  updateTheater: async (id, theaterData) => {
    try {
      const res = await apiClient.put(
        API_CONFIG.ENDPOINTS.THEATERS.UPDATE(id),
        theaterData
      );
      return res.data;
    } catch (error) {
      console.error("Error updating theater:", error);
      throw error;
    }
  },

  deleteTheater: async (id) => {
    try {
      const res = await apiClient.delete(
        API_CONFIG.ENDPOINTS.THEATERS.DELETE(id)
      );
      return res.data;
    } catch (error) {
      console.error("Error deleting theater:", error);
      throw error;
    }
  },
};
