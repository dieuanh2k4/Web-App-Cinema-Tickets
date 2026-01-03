import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const searchService = {
  searchMovieByName: async (movieName) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.SEARCH.MOVIE_BY_NAME(movieName)
      );
      return res.data || [];
    } catch (error) {
      console.error("Error searching movies:", error);
      throw error;
    }
  },

  searchTheaterByName: async (theaterName) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.SEARCH.THEATER_BY_NAME(theaterName)
      );
      return res.data || [];
    } catch (error) {
      console.error("Error searching theaters:", error);
      throw error;
    }
  },
};
