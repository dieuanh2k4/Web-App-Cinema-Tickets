import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";
import {
  mockTheaters,
  getTheatersByCity as getMockTheatersByCity,
} from "../constants/mockDataBackend";

export const theaterService = {
  getAllTheaters: async () => {
    try {
      // Sử dụng mock data
      console.log("Using mock theaters data");
      return mockTheaters;
    } catch (error) {
      console.error("Error fetching all theaters:", error);
      return [];
    }
  },

  getTheaterById: async (id) => {
    try {
      // Sử dụng mock data
      const theater = mockTheaters.find((t) => t.id === parseInt(id));
      return theater || null;
    } catch (error) {
      console.error("Error fetching theater by id:", error);
      throw error;
    }
  },

  getTheatersByCity: async (city) => {
    try {
      // Sử dụng mock data
      return getMockTheatersByCity(city);
    } catch (error) {
      console.error("Error fetching theaters by city:", error);
      return [];
    }
  },

  getCities: async () => {
    try {
      const cities = [...new Set(mockTheaters.map((t) => t.city))].filter(
        Boolean
      );
      return cities.sort();
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  },
};
