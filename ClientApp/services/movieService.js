import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const movieService = {
  getAllMovies: async () => {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.MOVIES.GET_ALL);
      const movies = res.data || [];
      // Map backend fields (PascalCase) to frontend expected fields (camelCase)
      return movies.map((movie) => {
        // Decode URL-encoded characters in thumbnail URLs
        let thumbnail = movie.Thumbnail || movie.thumbnail;
        if (thumbnail && thumbnail.includes("%")) {
          thumbnail = decodeURIComponent(thumbnail);
        }

        return {
          id: movie.Id || movie.id,
          title: movie.Title || movie.title,
          thumbnail: thumbnail,
          duration: movie.Duration || movie.duration,
          genre: movie.Genre || movie.genre,
          language: movie.Language || movie.language,
          ageLimit: movie.AgeLimit || movie.ageLimit,
          startDate: movie.StartDate || movie.startDate,
          endDate: movie.EndDate || movie.endDate,
          description: movie.Description || movie.description,
          director: movie.Director || movie.director,
          actors: movie.Actors || movie.actors,
          rating: movie.Rating || movie.rating,
          trailer: movie.Trailer || movie.trailer,
          status: movie.Status || movie.status,
        };
      });
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
      const movie = res.data || null;
      if (!movie) return null;

      // Decode thumbnail URL
      let thumbnail = movie.Thumbnail || movie.thumbnail;
      if (thumbnail && thumbnail.includes("%")) {
        thumbnail = decodeURIComponent(thumbnail);
      }

      // Map backend fields (PascalCase) to frontend expected fields (camelCase)
      return {
        id: movie.Id || movie.id,
        title: movie.Title || movie.title,
        thumbnail: thumbnail,
        duration: movie.Duration || movie.duration,
        genre: movie.Genre || movie.genre,
        language: movie.Language || movie.language,
        ageLimit: movie.AgeLimit || movie.ageLimit,
        startDate: movie.StartDate || movie.startDate,
        endDate: movie.EndDate || movie.endDate,
        description: movie.Description || movie.description,
        director: movie.Director || movie.director,
        actors: movie.Actors || movie.actors,
        rating: movie.Rating || movie.rating,
        trailer: movie.Trailer || movie.trailer,
        status: movie.Status || movie.status,
      };
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

