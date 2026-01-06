import api from './api';

const bookingService = {
  // Lấy danh sách ghế theo suất chiếu
  getSeatsByShowtime: async (showtimeId) => {
    try {
      const response = await api.get(`/Seats/showtime/${showtimeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seats:', error);
      throw error;
    }
  },

  // Giữ ghế (hold seats) - chuyển status sang Pending
  holdSeats: async (showtimeId, seatIds) => {
    try {
      const response = await api.post('/Booking/hold-seats', {
        showtimeId,
        seatIds
      });
      return response.data;
    } catch (error) {
      console.error('Error holding seats:', error);
      throw error;
    }
  },

  // Xác nhận thanh toán - chuyển status sang Booked
  confirmBooking: async (holdId) => {
    try {
      const response = await api.post('/Booking/confirm-booking', {
        holdId
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming booking:', error);
      throw error;
    }
  },

  // Lấy danh sách ghế khả dụng
  getAvailableSeats: async (showtimeId) => {
    try {
      const response = await api.get(`/Booking/available-seats/${showtimeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available seats:', error);
      throw error;
    }
  }
};

export default bookingService;
