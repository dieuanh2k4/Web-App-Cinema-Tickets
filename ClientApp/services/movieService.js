import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";
import { mockMovies, getMoviesByStatus } from "../constants/mockDataBackend";

export const movieService = {
  getAllMovies: async () => {
    try {
      // Sử dụng mock data
      console.log("Using mock movies data");
      return mockMovies;
    } catch (error) {
      console.error("Error fetching all movies:", error);
      return [];
    }
  },

  getMovieById: async (id) => {
    try {
      // Sử dụng mock data
      const movie = mockMovies.find((m) => m.id === parseInt(id));
      return movie || null;
    } catch (error) {
      console.error("Error fetching movie by id:", error);
      throw error;
    }
  },

  // Helper để filter movies theo status từ backend
  getNowPlaying: async () => {
    try {
      return getMoviesByStatus("Đang chiếu");
    } catch (error) {
      console.error("Error fetching now playing movies:", error);
      return [];
    }
  },

  getUpcoming: async () => {
    try {
      return getMoviesByStatus("Sắp chiếu");
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      return [];
    }
  },

  searchMovies: async (query) => {
    try {
      const movies = await movieService.getAllMovies();
      const lowerQuery = query.toLowerCase();
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
