import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const movieService = {
  getAllMovies: async () => {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.MOVIES.GET_ALL);
      return res.data || [];
    } catch (error) {
      console.error("Error fetching all movies:", error);
      return [];
    }
  },

  getMovieById: async (id) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.MOVIES.GET_BY_ID(id)
      );
      return res.data || null;
    } catch (error) {
      console.error("Error fetching movie by id:", error);
      throw error;
    }
  },

  getNowPlaying: async () => {
    try {
      const movies = await movieService.getAllMovies();
      return movies.filter((m) => m.status === "Đang chiếu");
    } catch (error) {
      console.error("Error fetching now playing movies:", error);
      return [];
    }
  },

  getUpcoming: async () => {
    try {
      const movies = await movieService.getAllMovies();
      return movies.filter((m) => m.status === "Sắp chiếu");
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      return [];
    }
  },

  searchMovies: async (query) => {
    try {
      const movies = await movieService.getAllMovies();
      const lowerQuery = (query || "").toLowerCase();
      return movies.filter(
        (movie) =>
          movie.title?.toLowerCase().includes(lowerQuery) ||
          movie.genre?.toLowerCase().includes(lowerQuery) ||
          movie.director?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error("Error searching movies:", error);
      return [];
    }
  },
};
