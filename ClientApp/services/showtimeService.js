import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const showtimeService = {
  getAllShowtimes: async () => {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.SHOWTIMES.GET_ALL);
      return res.data || [];
    } catch (error) {
      console.error("Error fetching all showtimes:", error);
      return [];
    }
  },

  getShowtimesByMovie: async (theaterId, movieId, date) => {
    try {
      const formattedDate = showtimeService.formatDateForBackend(date);
      const endpoint = API_CONFIG.ENDPOINTS.SHOWTIMES.GET_BY_MOVIE(
        theaterId,
        movieId,
        formattedDate
      );
      const res = await apiClient.get(endpoint);
      return res.data || [];
    } catch (error) {
      console.error("Error fetching showtimes by movie:", error);
      return [];
    }
  },

  // Lấy showtimes theo movieId và date, group theo theater
  getShowtimesByMovieAndDate: async (movieId, date) => {
    try {
      const formattedDate = showtimeService.formatDateForBackend(date);
      // Get all showtimes first
      const allShowtimes = await showtimeService.getAllShowtimes();

      // Filter by movie and date
      const filtered = allShowtimes.filter((st) => {
        const showtimeDate = st.date?.split("T")[0] || st.date;
        return (
          st.movieId === parseInt(movieId) && showtimeDate === formattedDate
        );
      });

      // Group by theater
      const grouped = showtimeService.groupShowtimesByTheater(filtered);
      return grouped;
    } catch (error) {
      console.error("Error fetching showtimes by movie and date:", error);
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
      grouped[theaterId].showtimes.push({
        id: showtime.id,
        time: showtime.startTime || showtime.time,
        format: showtime.format || "2D SUB",
        availableSeats: showtime.availableSeats || 0,
      });
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

  // Parse seats data từ backend API /Seats/showtime/{id}
  getSeatsByShowtime: async (showtimeId) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.SEATS.GET_BY_SHOWTIME(showtimeId)
      );
      const data = res.data;

      // Backend trả về: { showtimeId, roomName, totalSeats, availableSeats, bookedSeats, seats: [{seatId, seatNumber, seatType, isAvailable, status}] }
      const seats = data.seats || [];

      // Parse sang format client cần: { rows, columns, seats: {regular, vip, couple, booked}, prices }
      const rows = [...new Set(seats.map((s) => s.seatNumber[0]))].sort();
      const columns = Math.max(
        ...seats.map((s) => parseInt(s.seatNumber.substring(1)) || 0)
      );

      const seatsByType = {
        regular: [],
        vip: [],
        couple: [],
        booked: [],
      };

      seats.forEach((seat) => {
        const seatName = seat.seatNumber;
        if (!seat.isAvailable || seat.status === "Booked") {
          seatsByType.booked.push(seatName);
        } else {
          const type = seat.seatType?.toLowerCase() || "";
          if (type.includes("vip")) {
            seatsByType.vip.push(seatName);
          } else if (type.includes("couple") || type.includes("đôi")) {
            seatsByType.couple.push(seatName);
          } else {
            seatsByType.regular.push(seatName);
          }
        }
      });

      return {
        rows,
        columns,
        seats: seatsByType,
        prices: {
          regular: 80000,
          vip: 90000,
          couple: 180000,
        },
      };
    } catch (error) {
      console.error("Error fetching seats by showtime:", error);
      return {
        rows: [],
        columns: 0,
        seats: { regular: [], vip: [], couple: [], booked: [] },
        prices: { regular: 80000, vip: 90000, couple: 180000 },
      };
    }
  },
};
