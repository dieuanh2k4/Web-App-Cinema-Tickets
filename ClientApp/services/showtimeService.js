import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";
import {
  mockShowtimes,
  mockRooms,
  mockTheaters,
  getShowtimesByMovieTheaterDate,
} from "../constants/mockDataBackend";

export const showtimeService = {
  getAllShowtimes: async () => {
    try {
      // Sử dụng mock data
      console.log("Using mock showtimes data");
      return mockShowtimes;
    } catch (error) {
      console.error("Error fetching all showtimes:", error);
      return [];
    }
  },

  getShowtimesByMovie: async (theaterId, movieId, date) => {
    try {
      // Sử dụng mock data
      const formattedDate = showtimeService.formatDateForBackend(date);
      const showtimes = getShowtimesByMovieTheaterDate(
        movieId,
        theaterId,
        formattedDate
      );

      // Enrich với thông tin room và theater
      return showtimes.map((showtime) => {
        const room = mockRooms.find((r) => r.id === showtime.roomId);
        const theater = mockTheaters.find((t) => t.id === room?.theaterId);
        return {
          ...showtime,
          rooms: room,
          theater: theater,
        };
      });
    } catch (error) {
      console.error("Error fetching showtimes by movie:", error);
      return [];
    }
  },

  // Helper để format date sang DateOnly format mà backend expect
  formatDateForBackend: (date) => {
    if (!date) {
      const today = new Date();
      return today.toISOString().split("T")[0];
    }
    if (typeof date === "string") return date;
    return date.toISOString().split("T")[0];
  },

  groupShowtimesByTheater: (showtimes) => {
    const grouped = {};

    showtimes.forEach((showtime) => {
      const theaterId = showtime.rooms?.theaterId || showtime.theaterId;
      const theaterName = showtime.rooms?.theater?.name || showtime.theaterName;

      if (!grouped[theaterId]) {
        grouped[theaterId] = {
          id: theaterId,
          name: theaterName,
          address: showtime.rooms?.theater?.address || showtime.theaterAddress,
          city: showtime.rooms?.theater?.city || showtime.theaterCity,
          showtimes: [],
        };
      }
      grouped[theaterId].showtimes.push(showtime);
    });

    return Object.values(grouped);
  },

  groupShowtimesByDate: (showtimes) => {
    const grouped = {};

    showtimes.forEach((showtime) => {
      const date = showtime.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(showtime);
    });

    return grouped;
  },
};
