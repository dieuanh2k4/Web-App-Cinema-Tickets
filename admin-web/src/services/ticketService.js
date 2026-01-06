import api from './api';

const ticketService = {
  // Lấy tất cả vé (đơn hàng)
  getAllTickets: async () => {
    try {
      const response = await api.get('/Ticket/all');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  // Lấy thông tin vé theo ID
  getTicketById: async (id) => {
    try {
      const response = await api.get(`/Ticket/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  },

  // Lấy vé theo email khách hàng
  getTicketsByCustomerEmail: async (email) => {
    try {
      const response = await api.get(`/Ticket/customer/${email}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching customer tickets:', error);
      throw error;
    }
  },

  // Đặt vé (tạo đơn hàng mới)
  bookTicket: async (ticketData) => {
    try {
      const response = await api.post('/Ticket/book', ticketData);
      return response.data.data;
    } catch (error) {
      console.error('Error booking ticket:', error);
      throw error;
    }
  },

  // Hủy vé
  cancelTicket: async (id) => {
    try {
      const response = await api.delete(`/Ticket/cancel/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error canceling ticket:', error);
      throw error;
    }
  }
};

export default ticketService;
