import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

const defaultPriceForType = (type) => {
  if (!type) return 70000;
  const t = type.toLowerCase();
  if (t.includes("vip")) return 100000;
  if (t.includes("couple") || t.includes("đôi") || t.includes("doi"))
    return 75000;
  return 70000;
};

export const seatService = {
  // Lấy danh sách ghế theo showtime và map về định dạng client cần
  getSeatsByShowtime: async (showtimeId) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.SEATS.GET_BY_SHOWTIME(showtimeId)
      );
      const seatsDto = res.data?.seats || [];
      return seatsDto.map((s) => ({
        id: s.seatId,
        name: s.seatNumber,
        type: s.seatType,
        status: s.isAvailable ? "Trống" : "Đã đặt",
        price: s.price || defaultPriceForType(s.seatType),
      }));
    } catch (error) {
      console.error("Error fetching seats by showtime:", error);
      return [];
    }
  },

  // Lấy ghế còn trống cho 1 suất chiếu
  getAvailableSeats: async (showtimeId, roomId) => {
    try {
      const allSeats = await seatService.getSeatsByShowtime(showtimeId);
      return allSeats;
    } catch (error) {
      console.error("Error fetching available seats:", error);
      return [];
    }
  },

  // Kiểm tra ghế có khả dụng không
  checkAvailability: async (showtimeId, seatIds) => {
    try {
      const res = await apiClient.post(
        API_CONFIG.ENDPOINTS.SEATS.CHECK_AVAILABILITY,
        { ShowtimeId: showtimeId, SeatIds: seatIds }
      );
      return res.data;
    } catch (error) {
      console.error("Error checking seat availability:", error);
      return {
        isAvailable: false,
        error: error?.response?.data || error.message,
      };
    }
  },

  // Giữ ghế tạm thời (hold) - Phase 2 với Distributed Lock
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

  // Release ghế đang hold
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
      // Không throw error vì release seats là cleanup operation
      return { success: false };
    }
  },
};

export const bookingService = {
  // Xác nhận booking sau khi thanh toán thành công
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

  // Tạo booking mới
  createBooking: async (bookingData) => {
    try {
      // bookingData should include: showtimeId, seatIds, customerName, phoneNumber, email?, paymentMethod
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
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error creating booking:", error);
      return { success: false, error: error?.response?.data || error.message };
    }
  },

  // Lấy danh sách ghế khả dụng cho suất chiếu (từ BookingController)
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

  // Lấy tất cả vé của user theo email
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

  // Lấy tất cả vé (admin)
  getAllTickets: async () => {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.TICKETS.GET_ALL);
      return res.data?.data || [];
    } catch (error) {
      console.error("Error fetching all tickets:", error);
      return [];
    }
  },

  // Hủy vé theo ID
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
};

export default {
  seatService,
  bookingService,
};
