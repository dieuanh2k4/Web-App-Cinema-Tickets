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

  // Lấy lịch chiếu theo phim, rạp và ngày
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
  getShowtimesByMovieAndDate: async (movieId, date, theaters = []) => {
    try {
      const formattedDate = showtimeService.formatDateForBackend(date);
      const allShowtimes = await showtimeService.getAllShowtimes();

      console.log(
        "📡 API getAllShowtimes response:",
        allShowtimes?.length,
        "showtimes"
      );
      console.log("🔍 Filtering for movieId:", movieId, "date:", formattedDate);

      const filtered = allShowtimes.filter((st) => {
        const showtimeDate = st.date?.split("T")[0] || st.date;
        const matches =
          st.movieId === parseInt(movieId) && showtimeDate === formattedDate;
        if (matches) {
          console.log("✅ Match found:", st);
        }
        return matches;
      });

      console.log("🎯 Filtered showtimes:", filtered.length);

      const grouped = showtimeService.groupShowtimesByTheater(
        filtered,
        theaters
      );
      console.log("🏢 Grouped by theater:", grouped);

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

  groupShowtimesByTheater: (showtimes, theaters = []) => {
    const grouped = {};

    showtimes.forEach((showtime) => {
      const theaterName = showtime.theaterName;
      const theaterInfo = theaters.find((t) => t.name === theaterName);

      if (!grouped[theaterName]) {
        grouped[theaterName] = {
          id: theaterInfo?.id || 0,
          name: theaterName,
          address: theaterInfo?.address || "",
          city: theaterInfo?.city || "",
          showtimes: [],
        };
      }

      grouped[theaterName].showtimes.push({
        id: showtime.id,
        time: showtime.start ? showtime.start.substring(0, 5) : "00:00",
        format: showtime.roomType || "Standard",
        roomName: showtime.rooomName,
        movieTitle: showtime.movieTitle,
        date: showtime.date,
        end: showtime.end ? showtime.end.substring(0, 5) : "00:00",
        movieId: showtime.movieId,
        roomId: showtime.roomId,
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

  // Get showtime by ID
  getShowtimeById: async (showtimeId) => {
    try {
      const res = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.SHOWTIMES.GET_ALL}/${showtimeId}`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching showtime by ID:", error);
      throw error;
    }
  },

  // Get showtimes by theater ID
  getShowtimesByTheater: async (theaterId, date = null) => {
    try {
      const allShowtimes = await showtimeService.getAllShowtimes();
      const formattedDate = date
        ? showtimeService.formatDateForBackend(date)
        : null;

      const filtered = allShowtimes.filter((st) => {
        // Backend trả về theaterId trực tiếp (không có nested rooms)
        const matchesTheater = st.theaterId === parseInt(theaterId);

        if (!formattedDate) return matchesTheater;

        const showtimeDate = st.date?.split("T")[0] || st.date;
        return matchesTheater && showtimeDate === formattedDate;
      });

      return filtered;
    } catch (error) {
      console.error("Error fetching showtimes by theater:", error);
      return [];
    }
  },

  // Get upcoming showtimes for a movie
  getUpcomingShowtimes: async (movieId, days = 7) => {
    try {
      const allShowtimes = await showtimeService.getAllShowtimes();
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);

      const filtered = allShowtimes.filter((st) => {
        const showtimeDate = new Date(st.date);
        return (
          st.movieId === parseInt(movieId) &&
          showtimeDate >= today &&
          showtimeDate <= futureDate
        );
      });

      return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
      console.error("Error fetching upcoming showtimes:", error);
      return [];
    }
  },

  // Lấy thống kê lịch chiếu
  getShowtimeStatistics: async (date = null) => {
    try {
      const dateParam = date ? `?date=${date}` : "";
      const res = await apiClient.get(`/Showtimes/statistics${dateParam}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching showtime statistics:", error);
      throw error;
    }
  },

  // Get available seats count for a showtime
  getAvailableSeatsCount: async (showtimeId) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.BOOKING.AVAILABLE_SEATS(showtimeId)
      );
      return res.data?.availableSeats || 0;
    } catch (error) {
      console.error("Error fetching available seats:", error);
      return 0;
    }
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
