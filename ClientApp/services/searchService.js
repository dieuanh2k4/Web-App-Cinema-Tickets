import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";
import { movieService } from "./movieService";

export const searchService = {
  searchMovieByName: async (movieName) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.SEARCH.MOVIE_BY_NAME(movieName)
      );
      return res.data || [];
    } catch (error) {
      console.log("Backend search failed, using local search...");
      // Fallback: search locally from all movies
      try {
        const allMovies = await movieService.getAllMovies();
        const query = (movieName || "").toLowerCase();
        return allMovies.filter(
          (movie) =>
            movie.title?.toLowerCase().includes(query) ||
            movie.genre?.toLowerCase().includes(query) ||
            movie.director?.toLowerCase().includes(query)
        );
      } catch (localError) {
        console.error("Local search also failed:", localError);
        return [];
      }
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
      return []; // Return empty instead of throwing
    }
  },
};
