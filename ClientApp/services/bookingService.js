import {
  mockSeats,
  mockTickets,
  getSeatsByRoom,
  updateSeatStatus,
  createBooking as createMockBooking,
  getFullTicketInfo,
} from "../constants/mockDataBackend";

export const seatService = {
  // Lấy tất cả ghế của 1 phòng
  getSeatsByRoom: async (roomId) => {
    try {
      console.log("Using mock seats data for room:", roomId);
      return getSeatsByRoom(roomId);
    } catch (error) {
      console.error("Error fetching seats by room:", error);
      return [];
    }
  },

  // Lấy ghế còn trống cho 1 suất chiếu
  getAvailableSeats: async (showtimeId, roomId) => {
    try {
      const allSeats = getSeatsByRoom(roomId);

      // Tìm các ghế đã đặt cho suất chiếu này
      const bookedSeatIds = mockTickets
        .filter((t) => t.showtimeId === showtimeId)
        .map((t) => t.seatId);

      // Filter ra ghế còn trống
      return allSeats.map((seat) => ({
        ...seat,
        status: bookedSeatIds.includes(seat.id) ? "Đã đặt" : "Trống",
      }));
    } catch (error) {
      console.error("Error fetching available seats:", error);
      return [];
    }
  },

  // Giữ ghế tạm thời (hold)
  holdSeats: async (seatIds, showtimeId) => {
    try {
      seatIds.forEach((seatId) => {
        updateSeatStatus(seatId, "Đang giữ");
      });

      // Tự động release sau 10 phút
      setTimeout(() => {
        seatIds.forEach((seatId) => {
          const seat = mockSeats.find((s) => s.id === seatId);
          if (seat && seat.status === "Đang giữ") {
            updateSeatStatus(seatId, "Trống");
          }
        });
      }, 10 * 60 * 1000); // 10 minutes

      return { success: true, message: "Ghế đã được giữ" };
    } catch (error) {
      console.error("Error holding seats:", error);
      throw error;
    }
  },

  // Release ghế đang hold
  releaseSeats: async (seatIds) => {
    try {
      seatIds.forEach((seatId) => {
        const seat = mockSeats.find((s) => s.id === seatId);
        if (seat && seat.status === "Đang giữ") {
          updateSeatStatus(seatId, "Trống");
        }
      });
      return { success: true, message: "Đã hủy giữ ghế" };
    } catch (error) {
      console.error("Error releasing seats:", error);
      throw error;
    }
  },
};

export const bookingService = {
  // Tạo booking mới
  createBooking: async (bookingData) => {
    try {
      console.log("Creating mock booking:", bookingData);

      const {
        showtimeId,
        customerId,
        seatIds,
        roomId,
        movieId,
        date,
        totalPrice,
      } = bookingData;

      // Tạo booking cho từng ghế (backend có thể yêu cầu 1 ticket = 1 seat)
      const tickets = [];

      for (const seatId of seatIds) {
        const ticket = createMockBooking({
          showtimeId,
          customerId,
          seatId,
          roomId,
          movieId,
          sumOfSeat: seatIds.length,
          date,
          totalPrice: totalPrice / seatIds.length, // Chia đều cho mỗi ghế
          seatIds, // Để track tất cả ghế trong booking
        });
        tickets.push(ticket);
      }

      return {
        success: true,
        data: {
          bookingCode: tickets[0].bookingCode,
          tickets,
          totalPrice,
        },
      };
    } catch (error) {
      console.error("Error creating booking:", error);
      return {
        success: false,
        error: "Có lỗi xảy ra khi tạo booking",
      };
    }
  },

  // Lấy thông tin booking theo code
  getBookingByCode: async (bookingCode) => {
    try {
      const tickets = mockTickets.filter((t) => t.bookingCode === bookingCode);

      if (tickets.length === 0) {
        return null;
      }

      // Get full info for first ticket
      const fullInfo = getFullTicketInfo(tickets[0].id);

      return {
        bookingCode,
        tickets,
        ...fullInfo,
      };
    } catch (error) {
      console.error("Error fetching booking:", error);
      throw error;
    }
  },

  // Lấy tất cả bookings của user
  getUserBookings: async (customerId) => {
    try {
      const userTickets = mockTickets.filter(
        (t) => t.customerId === customerId
      );

      // Group by bookingCode
      const bookings = {};
      userTickets.forEach((ticket) => {
        if (!bookings[ticket.bookingCode]) {
          bookings[ticket.bookingCode] = {
            bookingCode: ticket.bookingCode,
            tickets: [],
            ...getFullTicketInfo(ticket.id),
          };
        }
        bookings[ticket.bookingCode].tickets.push(ticket);
      });

      return Object.values(bookings);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      return [];
    }
  },

  // Hủy booking
  cancelBooking: async (bookingCode) => {
    try {
      const tickets = mockTickets.filter((t) => t.bookingCode === bookingCode);

      // Update status
      tickets.forEach((ticket) => {
        ticket.status = "Đã hủy";
        updateSeatStatus(ticket.seatId, "Trống");
      });

      return {
        success: true,
        message: "Hủy booking thành công",
      };
    } catch (error) {
      console.error("Error canceling booking:", error);
      return {
        success: false,
        error: "Có lỗi xảy ra khi hủy booking",
      };
    }
  },

  // Thanh toán booking
  payBooking: async (bookingCode, paymentMethod) => {
    try {
      const tickets = mockTickets.filter((t) => t.bookingCode === bookingCode);

      // Update status
      tickets.forEach((ticket) => {
        ticket.status = "Đã thanh toán";
        ticket.paymentMethod = paymentMethod;
        ticket.paidAt = new Date().toISOString();
        updateSeatStatus(ticket.seatId, "Đã đặt");
      });

      return {
        success: true,
        message: "Thanh toán thành công",
        data: {
          bookingCode,
          paidAt: tickets[0].paidAt,
        },
      };
    } catch (error) {
      console.error("Error paying booking:", error);
      return {
        success: false,
        error: "Có lỗi xảy ra khi thanh toán",
      };
    }
  },
};

export default {
  seatService,
  bookingService,
};
