// import BASE_URL from "@env";
import { API_CONFIG } from "../config/api.config";

const BASE_URL = API_CONFIG.BASE_URL;

class ApiService {
  // Lấy danh sách phim đang chiếu
  async getNowPlayingMovies() {
    try {
      const response = await fetch(`${BASE_URL}/movies/now-playing`);
      if (!response.ok) {
        throw new Error("Failed to fetch now playing movies");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching now playing movies:", error);
      throw error;
    }
  }

  // Lấy danh sách phim sắp chiếu
  async getUpcomingMovies() {
    try {
      const response = await fetch(`${BASE_URL}/movies/upcoming`);
      if (!response.ok) {
        throw new Error("Failed to fetch upcoming movies");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      throw error;
    }
  }

  // Lấy danh sách phim featured
  async getFeaturedMovies() {
    try {
      const response = await fetch(`${BASE_URL}/movies/featured`);
      if (!response.ok) {
        throw new Error("Failed to fetch featured movies");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching featured movies:", error);
      throw error;
    }
  }

  // Lấy chi tiết phim theo ID
  async getMovieById(id) {
    try {
      const response = await fetch(`${BASE_URL}/movies/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw error;
    }
  }

  // Lấy danh sách rạp chiếu
  async getCinemas() {
    try {
      const response = await fetch(`${BASE_URL}/cinemas`);
      if (!response.ok) {
        throw new Error("Failed to fetch cinemas");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching cinemas:", error);
      throw error;
    }
  }

  // Lấy suất chiếu theo phim và rạp
  async getShowtimes(movieId, cinemaId) {
    try {
      const response = await fetch(
        `${BASE_URL}/showtimes?movieId=${movieId}&cinemaId=${cinemaId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch showtimes");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching showtimes:", error);
      throw error;
    }
  }

  // Đặt vé
  async bookTicket(bookingData) {
    try {
      const response = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) {
        throw new Error("Failed to book ticket");
      }
      return await response.json();
    } catch (error) {
      console.error("Error booking ticket:", error);
      throw error;
    }
  }
}

export default new ApiService();
