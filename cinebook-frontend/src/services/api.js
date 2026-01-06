import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH APIs
// ============================================
export const login = async (credentials) => {
  const response = await api.post("/Auth/login", credentials);
  return response.data;
};

export const register = async (userData) => {
  const formData = new FormData();
  formData.append("Name", userData.name || "");
  formData.append("username", userData.username || "");
  formData.append("Email", userData.email || "");
  formData.append("password", userData.password || "");
  formData.append("phoneNumber", userData.phoneNumber || "");
  formData.append("Gender", userData.gender || "");
  formData.append("Birth", userData.birth || new Date().toISOString().split('T')[0]);
  formData.append("Address", userData.address || "");
  formData.append("createdDate", new Date().toISOString());
  if (userData.imageFile) {
    formData.append("imageFile", userData.imageFile);
  }

  const response = await api.post("/Auth/customer-register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/Auth/me");
  return response.data;
};

export const sendOTP = async (emailData) => {
  const response = await api.post("/Auth/forgot-password", emailData);
  return response.data;
};

export const verifyOTP = async (otpData) => {
  const response = await api.post("/Auth/verify-otp", otpData);
  return response.data;
};

export const resetPassword = async (resetData) => {
  const response = await api.post("/Auth/reset-password", resetData);
  return response.data;
};

// ============================================
// CUSTOMER APIs
// ============================================
export const getCustomerInfo = async (id) => {
  const response = await api.get(`/Customer/get-info-customer?id=${id}`);
  return response.data;
};

export const updateCustomerInfo = async (id, customerData) => {
  const formData = new FormData();
  formData.append("Name", customerData.name || "");
  formData.append("Birth", customerData.birth || "");
  formData.append("Gender", customerData.gender || "");
  formData.append("Address", customerData.address || "");
  formData.append("Phone", customerData.phone || "");
  formData.append("Email", customerData.email || "");
  if (customerData.imageFile) {
    formData.append("imageFile", customerData.imageFile);
  }

  const response = await api.put(`/Customer/update-info-customer/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const getMovies = async () => {
  const response = await api.get("/Movies/get-all-movies");
  return response.data;
};

export const getMovieById = async (id) => {
  const response = await api.get(`/Movies/get-movie-by-id/${id}`);
  return response.data;
};

export const searchMovies = async (query) => {
  const response = await api.get(`/Search/search-movie-by-name?q=${query}`);
  return response.data;
};

// ============================================
// THEATERS APIs
// ============================================
export const getTheaters = async () => {
  const response = await api.get("/Theater/get-all-theater");
  return response.data;
};

export const getTheatersByCity = async (city) => {
  const response = await api.get(`/Theater/get-theater-by-city?city=${city}`);
  return response.data;
};

export const getTheaterById = async (id) => {
  const response = await api.get(`/Theater/get-theater-by-id?id=${id}`);
  return response.data;
};

// ============================================
// ROOM APIs
// ============================================
export const getRooms = async () => {
  const response = await api.get("/Room/get-all-room");
  return response.data;
};

// ============================================
// SHOWTIMES APIs
// ============================================
export const getAllShowtimes = async (date = null, theaterId = null) => {
  const params = {};
  if (date) params.date = date;
  if (theaterId) params.theaterId = theaterId;

  const response = await api.get("/Showtimes/get_all_showtime", {
    params: Object.keys(params).length > 0 ? params : undefined,
  });
  return response.data;
};

export const getShowtimesByMovie = async (theaterId, movieId, date) => {
  const response = await api.get("/Showtimes/get-showtime-by-movieId", {
    params: { theaterId, movieId, date },
  });
  return response.data;
};

export const getShowtimesByTheater = async (theaterId, date) => {
  const response = await api.get("/Showtimes/get-showtime-by-theaterid", {
    params: { theaterId, date },
  });
  return response.data;
};

export const getShowtimesByDate = async (date) => {
  const response = await api.get("/Showtimes/get_all_showtime", {
    params: { date },
  });
  return response.data;
};

export const getShowtimeById = async (id) => {
  const response = await api.get(`/Showtimes/get-showtime-by-id?id=${id}`);
  return response.data;
};

// Auto-generate showtimes
export const autoGenerateShowtimes = async (date) => {
  const response = await api.post("/Showtimes/auto-generate", null, {
    params: { date },
  });
  return response.data;
};

export const autoGenerateShowtimesRange = async (startDate, endDate) => {
  const response = await api.post("/Showtimes/auto-generate-range", null, {
    params: { startDate, endDate },
  });
  return response.data;
};

// ============================================
// SEATS APIs
// ============================================
export const getSeatsByShowtime = async (showtimeId) => {
  try {
    const response = await api.get(`/Seats/showtime/${showtimeId}`);
    console.log('Seats Response:', {
      url: `/Seats/showtime/${showtimeId}`,
      data: response.data,
      seatCount: response.data?.seats?.length || 0,
      sampleSeat: response.data?.seats?.[0],
    });
    return response.data;
  } catch (error) {
    console.error('Seats Error:', error.response?.data);
    throw error;
  }
};

export const checkSeatAvailability = async (showtimeId, seatIds) => {
  const response = await api.post("/Seats/check-availability", {
    showtimeId,
    seatIds,
  });
  return response.data;
};

// ============================================
// BOOKING APIs
// ============================================
export const holdSeats = async (showtimeId, seatIds) => {
  console.log('🔍 holdSeats called with:');
  console.log('  showtimeId:', showtimeId, 'type:', typeof showtimeId);
  console.log('  seatIds:', seatIds, 'type:', typeof seatIds);
  
  const showtimeIdInt = parseInt(showtimeId);
  const seatIdsArray = Array.isArray(seatIds) ? seatIds : [seatIds];
  const seatIdsInts = seatIdsArray.map(s => {
    const num = parseInt(s);
    console.log('  Converting seat:', s, '→', num);
    return num;
  });
  
  const payload = {
    ShowtimeId: showtimeIdInt,
    SeatIds: seatIdsInts,
  };
  
  console.log('📤 Final payload to send:', JSON.stringify(payload));
  
  try {
    const response = await api.post("/Booking/hold-seats", payload);
    console.log('✅ Hold Seats Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Hold Seats Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const getAvailableSeats = async (showtimeId) => {
  const response = await api.get(`/Booking/available-seats/${showtimeId}`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post("/Booking/create-booking", bookingData);
  return response.data;
};

export const getBookingDetails = async (bookingId) => {
  const response = await api.get(`/Booking/${bookingId}`);
  return response.data;
};

export const confirmBooking = async (bookingId) => {
  const response = await api.post(`/Booking/${bookingId}/confirm`);
  return response.data;
};

// ============================================
// TICKET APIs
// ============================================
export const bookTicket = async (ticketData) => {
  const response = await api.post("/Ticket/book", ticketData);
  return response.data;
};

export const getTicketById = async (ticketId) => {
  const response = await api.get(`/Ticket/${ticketId}`);
  return response.data;
};

export const getAllTickets = async () => {
  const response = await api.get("/Ticket/all");
  return response.data;
};

export const getUserTickets = async () => {
  const response = await api.get("/Ticket/user-tickets");
  return response.data;
};

// ============================================
// TICKET PRICES APIs
// ============================================
export const getTicketPrices = async () => {
  try {
    const response = await api.get("/Ticketprices/get-all-ticket-price");
    console.log('Ticket Prices Response:', {
      url: "/Ticketprices/get-all-ticket-price",
      data: response.data,
      priceCount: response.data?.length || 0,
    });
    return response.data;
  } catch (error) {
    console.error('Ticket Prices Error:', error.response?.data);
    throw error;
  }
};

// ============================================
// PAYMENT APIs
// ============================================
export const createVNPayPayment = async (paymentData) => {
  const response = await api.post("/Payment/vnpay/create", paymentData);
  return response.data;
};

export const vnPayCallback = async () => {
  const response = await api.get("/Payment/vnpay/callback");
  return response.data;
};

export const getPaymentStatus = async (ticketId) => {
  const response = await api.get(`/Payment/status/${ticketId}`);
  return response.data;
};

// ============================================
// CHATBOT AI APIs
// ============================================
export const sendChatMessage = async (messageData) => {
  const response = await api.post("/Chat/send-message", messageData);
  return response.data;
};

export default api;
