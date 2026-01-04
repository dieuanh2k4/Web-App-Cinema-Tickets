import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const payload = {
        ShowtimeId: bookingData.showtimeId,
        SeatIds: bookingData.seatIds,
        CustomerName: bookingData.customerName || bookingData.name || "Guest",
        PhoneNumber: bookingData.phoneNumber || bookingData.phone || "",
        Email: bookingData.email || null,
        PaymentMethod: bookingData.paymentMethod || "Cash",
      };

      const res = await apiClient.post(
        API_CONFIG.ENDPOINTS.BOOKING.CREATE,
        payload
      );
      return res.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

  confirmBooking: async (holdId, customerInfo) => {
    try {
      const payload = {
        holdId,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email || null,
      };

      const res = await apiClient.post(
        API_CONFIG.ENDPOINTS.BOOKING.CONFIRM_BOOKING,
        payload
      );

      return {
        success: res.data.success,
        booking: res.data.booking,
        message: res.data.message,
      };
    } catch (error) {
      console.error("Error confirming booking:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Không thể xác nhận đặt vé. Vui lòng thử lại.");
    }
  },

  holdSeats: async (seatIds, showtimeId, userId = null) => {
    try {
      const res = await apiClient.post(
        API_CONFIG.ENDPOINTS.BOOKING.HOLD_SEATS,
        {
          showtimeId,
          seatIds,
          userId,
        }
      );

      return {
        success: res.data.success,
        holdId: res.data.holdId,
        expiresAt: res.data.expiresAt,
        ttlSeconds: res.data.ttlSeconds,
        message: res.data.message,
      };
    } catch (error) {
      console.error("Error holding seats:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Không thể giữ ghế. Vui lòng thử lại.");
    }
  },

  releaseSeats: async (holdId) => {
    try {
      if (!holdId) {
        return { success: true };
      }

      const res = await apiClient.post(
        API_CONFIG.ENDPOINTS.BOOKING.RELEASE_SEATS,
        {
          holdId,
        }
      );

      return {
        success: res.data.success,
        message: res.data.message,
      };
    } catch (error) {
      console.error("Error releasing seats:", error);
      return { success: false };
    }
  },

  getAvailableSeatsForShowtime: async (showtimeId) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.BOOKING.AVAILABLE_SEATS(showtimeId)
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching available seats:", error);
      return { availableSeatIds: [], count: 0 };
    }
  },

  getTicketById: async (ticketId) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.TICKETS.GET_BY_ID(ticketId)
      );
      return res.data?.data || res.data;
    } catch (error) {
      console.error("Error fetching ticket by id:", error);
      return null;
    }
  },

  getTicketsByEmail: async (email) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.TICKETS.GET_BY_EMAIL(email)
      );
      return res.data?.data || [];
    } catch (error) {
      console.error("Error fetching tickets by email:", error);
      return [];
    }
  },

  getAllTickets: async () => {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.TICKETS.GET_ALL);
      return res.data?.data || [];
    } catch (error) {
      console.error("Error fetching all tickets:", error);
      return [];
    }
  },

  cancelTicket: async (ticketId) => {
    try {
      const res = await apiClient.delete(
        API_CONFIG.ENDPOINTS.TICKETS.CANCEL(ticketId)
      );
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error canceling ticket:", error);
      return { success: false, error: error?.response?.data || error.message };
    }
  },

  getUserBookings: async () => {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.TICKETS.GET_ALL);
      const tickets = res.data?.data || [];

      return tickets.map((ticket) => ({
        id: ticket.id,
        movieTitle: ticket.showtime?.movie?.title || "Unknown Movie",
        theater: ticket.showtime?.rooms?.theater?.name || "Unknown Theater",
        room: ticket.showtime?.rooms?.name || "Unknown Room",
        date: ticket.showtime?.date || new Date().toISOString().split("T")[0],
        time: ticket.showtime?.startTime || "00:00",
        seats: ticket.seatNumbers?.split(",") || [],
        totalAmount: ticket.totalPrice || 0,
        status:
          ticket.status === "Confirmed"
            ? "upcoming"
            : ticket.status === "Used"
            ? "used"
            : "cancelled",
        bookingCode: ticket.bookingCode || `CINE${ticket.id}`,
        poster: ticket.showtime?.movie?.thumbnail || "",
      }));
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      return [];
    }
  },
};
