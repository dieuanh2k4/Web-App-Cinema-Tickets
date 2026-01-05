import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const bookingService = {
  // Lấy lịch sử đặt vé của customer
  getBookingHistory: async (customerId) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.BOOKING.GET_HISTORY(customerId)
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching booking history:", error);
      throw error;
    }
  },

  // Lấy bookings của customer
  getCustomerBookings: async (customerId) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.BOOKING.GET_BY_CUSTOMER(customerId)
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching customer bookings:", error);
      throw error;
    }
  },

  // Tạo booking mới
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

  // Xác nhận booking
  confirmBooking: async (holdId, customerInfo) => {
    try {
      const payload = {
        HoldId: holdId,
        CustomerName: customerInfo.name,
        CustomerPhone: customerInfo.phone,
        CustomerEmail: customerInfo.email || null,
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

  // Giữ ghế tạm thời
  holdSeats: async (seatIds, showtimeId, userId = null) => {
    try {
      const res = await apiClient.post(
        API_CONFIG.ENDPOINTS.BOOKING.HOLD_SEATS,
        {
          ShowtimeId: showtimeId,
          SeatIds: seatIds,
          UserId: userId,
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

  // Hủy giữ ghế
  releaseSeats: async (holdId) => {
    try {
      if (!holdId) {
        return { success: true };
      }

      const res = await apiClient.post(
        API_CONFIG.ENDPOINTS.BOOKING.RELEASE_SEATS,
        { HoldId: holdId }
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

  // Lấy ghế còn trống
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

  // Lấy thông tin vé theo ID
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

  // Lấy danh sách vé theo email
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

  // Lấy tất cả vé
  getAllTickets: async () => {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.TICKETS.GET_ALL);
      return res.data?.data || [];
    } catch (error) {
      console.error("Error fetching all tickets:", error);
      return [];
    }
  },

  // Hủy vé
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

  // Lấy danh sách booking của user
  getUserBookings: async () => {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.TICKETS.GET_ALL);
      return res.data || [];
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      return [];
    }
  },
};
