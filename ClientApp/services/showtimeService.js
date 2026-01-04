import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const showtimeService = {
  // Lấy tất cả lịch chiếu
  getAllShowtimes: async () => {
    try {
      console.log(
        "[Showtime] Calling API:",
        API_CONFIG.ENDPOINTS.SHOWTIMES.GET_ALL
      );
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.SHOWTIMES.GET_ALL);
      console.log("[Showtime] Response data:", res.data);
      console.log("[Showtime] Total showtimes:", res.data?.length || 0);
      return res.data || [];
    } catch (error) {
      console.error("[Showtime] Error fetching all showtimes:", error);
      console.error("[Showtime] Error response:", error.response?.data);
      console.error("[Showtime] Error status:", error.response?.status);
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
      console.log("[Showtime] Getting by movie and date:", {
        movieId,
        formattedDate,
      });

      // Get all showtimes first
      const allShowtimes = await showtimeService.getAllShowtimes();
      console.log("[Showtime] All showtimes count:", allShowtimes.length);

      // Filter by movie and date
      const filtered = allShowtimes.filter((st) => {
        const showtimeDate = st.date?.split("T")[0] || st.date;
        const movieMatch = st.movieId === parseInt(movieId);
        const dateMatch = showtimeDate === formattedDate;

        if (movieMatch) {
          console.log("[Showtime] Found movie match:", {
            showtimeId: st.id,
            movieId: st.movieId,
            date: showtimeDate,
            dateMatch,
          });
        }

        return movieMatch && dateMatch;
      });

      console.log("[Showtime] Filtered showtimes:", filtered.length);
      console.log(
        "[Showtime] Filtered data:",
        JSON.stringify(filtered, null, 2)
      );

      // Group by theater - truyền theaters để enrich data
      const grouped = showtimeService.groupShowtimesByTheater(
        filtered,
        theaters
      );
      console.log("[Showtime] Grouped theaters:", grouped.length);
      console.log("[Showtime] Grouped data:", JSON.stringify(grouped, null, 2));

      return grouped;
    } catch (error) {
      console.error(
        "[Showtime] Error fetching showtimes by movie and date:",
        error
      );
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
      // Backend chỉ trả về theaterName, không có theaterId/address/city
      const theaterName = showtime.theaterName;

      // Tìm theater info từ danh sách theaters (nếu có)
      const theaterInfo = theaters.find((t) => t.name === theaterName);

      if (!grouped[theaterName]) {
        grouped[theaterName] = {
          id: theaterInfo?.id || theaterName, // Dùng theaterName làm fallback
          name: theaterName,
          address: theaterInfo?.address || "",
          city: theaterInfo?.city || "",
          showtimes: [],
        };
      }
      grouped[theaterName].showtimes.push({
        id: showtime.id,
        // Backend trả về "start" format TimeOnly "HH:mm:ss", chuyển "HH:mm"
        time: showtime.start ? showtime.start.substring(0, 5) : "00:00",
        format: showtime.roomType || "Standard",
        availableSeats: 0, // Backend không trả về
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
