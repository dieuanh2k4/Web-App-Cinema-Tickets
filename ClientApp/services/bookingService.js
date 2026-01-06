import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const bookingService = {
  // Lấy lịch sử đặt vé của customer
  getBookingHistory: async (_customerId) => {
    try {
      // Backend hiện tại không có /Booking/history. App dùng /User/tickets.
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.USER.TICKETS);
      return res.data || [];
    } catch (error) {
      console.error("Error fetching booking history:", error);
      return [];
    }
  },

  // Lấy bookings của customer
  getCustomerBookings: async (_customerId) => {
    try {
      // Backend hiện tại không có /Booking/customer/{id}. App dùng /User/tickets.
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.USER.TICKETS);
      return res.data || [];
    } catch (error) {
      console.error("Error fetching customer bookings:", error);
      return [];
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
  confirmBooking: async (holdId, _customerInfo = null) => {
    try {
      // Backend ConfirmBookingDto hiện tại chỉ nhận HoldId
      const payload = { HoldId: holdId };

      console.log("Confirm booking request:", payload);

      const res = await apiClient.post(
        API_CONFIG.ENDPOINTS.BOOKING.CONFIRM_BOOKING,
        payload
      );

      console.log("Confirm booking response:", res.data);

      const booking = res.data?.booking ?? res.data?.data ?? res.data;
      return {
        success: res.data?.success ?? true,
        booking,
        message: res.data?.message,
        ticketId:
          res.data?.ticketId ||
          booking?.ticketId ||
          booking?.ticket?.id ||
          booking?.id,
      };
    } catch (error) {
      console.error("Error confirming booking:", error);
      console.error("Error response:", error.response?.data);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Không thể xác nhận đặt vé. Vui lòng thử lại.");
    }
  },

  // Giữ ghế tạm thời
  holdSeats: async (seatIds, showtimeId) => {
    try {
      console.log("Hold seats request:", {
        ShowtimeId: showtimeId,
        SeatIds: seatIds,
      });

      const res = await apiClient.post(
        API_CONFIG.ENDPOINTS.BOOKING.HOLD_SEATS,
        {
          ShowtimeId: showtimeId,
          SeatIds: seatIds,
        }
      );

      console.log("Hold seats response:", res.data);

      return {
        success: res.data.success || true,
        holdId: res.data.holdId,
        expiresAt: res.data.expiresAt,
        ttlSeconds: res.data.ttlSeconds,
        message: res.data.message || "Giữ ghế thành công",
      };
    } catch (error) {
      console.error("❌ Error holding seats:", error);
      console.error("❌ Error response data:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Error message:", error.message);

      // Trả về thông tin lỗi chi tiết
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        JSON.stringify(error.response?.data) ||
        error.message ||
        "Không thể giữ ghế. Vui lòng thử lại.";

      throw new Error(errorMessage);
    }
  },

  // Hủy giữ ghế
  releaseSeats: async (holdId) => {
    try {
      if (!holdId) {
        return { success: true };
      }
      // Backend hiện tại không expose endpoint release-seats.
      return { success: true, message: "Release seats is not supported" };
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
      // Prefer authenticated endpoint
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.USER.TICKETS);
      return res.data || [];
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      return [];
    }
  },

  // Lấy thông tin booking theo ID
  getBookingById: async (ticketId) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.TICKETS.GET_BY_ID(ticketId)
      );
      return res.data?.data || res.data;
    } catch (error) {
      console.error("Error fetching booking by id:", error);
      throw error;
    }
  },
};
