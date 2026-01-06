import axios from "axios";

// Use environment variable, fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

console.log('🔗 API Base URL:', API_BASE_URL);

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
  (response) => response.data,
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
  return api.post("/Auth/login", credentials);
};

export const register = async (formData) => {
  // FormData for file upload (avatar)
  return api.post("/Auth/customer-register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCurrentUser = async () => {
  return api.get("/Auth/me");
};

export const getCustomerInfo = async (customerId) => {
  return api.get(`/Customer/get-info-customer?id=${customerId}`);
};

export const getCustomerByUserId = async (userId) => {
  return api.get(`/Customer/get-by-user-id/${userId}`);
};

export const updateCustomerInfo = async (customerId, formData) => {
  return api.put(`/Customer/update-info-customer/${customerId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const sendOTP = async (emailData) => {
  return api.post("/Auth/forgot-password", emailData);
};

export const verifyOTP = async (otpData) => {
  return api.post("/Auth/verify-otp", otpData);
};

export const resetPassword = async (resetData) => {
  return api.post("/Auth/reset-password", resetData);
};

// ============================================
// MOVIES APIs
// ============================================
export const getMovies = async () => {
  return api.get("/Movies/get-all-movies");
};

export const getMovieById = async (id) => {
  return api.get(`/Movies/get-movie-by-id/${id}`);
};

export const searchMovies = async (query) => {
  return api.get(`/Search/search-movie-by-name?q=${query}`);
};

// ============================================
// THEATERS APIs
// ============================================
export const getTheaters = async () => {
  return api.get("/Theater/get-all-theater");
};

export const getTheatersByCity = async (city) => {
  return api.get(`/Theater/get-theater-by-city?city=${city}`);
};

// ============================================
// SHOWTIMES APIs
// ============================================
export const getAllShowtimes = async (date = null, theaterId = null) => {
  const params = {};
  if (date) params.date = date;
  if (theaterId) params.theaterId = theaterId;

  return api.get("/Showtimes/get_all_showtime", {
    params: Object.keys(params).length > 0 ? params : undefined,
  });
};

export const getShowtimesByMovie = async (theaterId, movieId, date) => {
  return api.get("/Showtimes/get-showtime-by-movieId", {
    params: { theaterId, movieId, date },
  });
};

export const getShowtimesByTheater = async (theaterId, date) => {
  console.log("📡 Calling getShowtimesByTheater with:", { theaterId, date });
  try {
    const response = await api.get("/Showtimes/get-showtime-by-theaterid", {
      params: { theaterId, date },
    });
    console.log("getShowtimesByTheater response:", response);
    return response;
  } catch (error) {
    console.error("getShowtimesByTheater error:", error.response || error);
    throw error;
  }
};

export const getShowtimesByDate = async (date) => {
  return api.get("/Showtimes/get_all_showtime", {
    params: { date },
  });
};

// export const getShowtimesByTheater = async (theaterId, date = null) => {
//   const params = { theaterId };
//   if (date) params.date = date;

//   return api.get("/Showtimes/get_all_showtime", {
//     params,
//   });
// };

// Auto-generate showtimes
export const autoGenerateShowtimes = async (date) => {
  return api.post("/Showtimes/auto-generate", null, {
    params: { date },
  });
};

export const autoGenerateShowtimesRange = async (startDate, endDate) => {
  return api.post("/Showtimes/auto-generate-range", null, {
    params: { startDate, endDate },
  });
};

export const getShowtimeStatistics = async (date) => {
  return api.get("/Showtimes/statistics", {
    params: { date },
  });
};

// ============================================
// SEATS APIs
// ============================================
export const getSeatsByShowtime = async (showtimeId) => {
  return api.get(`/Seats/showtime/${showtimeId}`);
};

export const checkSeatAvailability = async (showtimeId, seatIds) => {
  return api.post("/Seats/check-availability", {
    showtimeId,
    seatIds,
  });
};

// ============================================
// BOOKING APIs - 2-Step Flow
// ============================================
// Step 1: Hold seats for 10 minutes
export const holdSeats = async (data) => {
  return api.post("/Booking/hold-seats", data);
};

// Step 2: Confirm booking after payment
export const confirmBooking = async (data) => {
  return api.post("/Booking/confirm-booking", data);
};

// Cancel booking - Release ghế và đánh dấu hủy
export const cancelBooking = async (holdId) => {
  console.log('🚫 cancelBooking API called with holdId:', holdId)
  return api.post("/Booking/cancel-booking", { HoldId: holdId });
};

// Release seats if user cancels
export const releaseSeats = async (holdId) => {
  return api.post("/Booking/release-seats", { holdId });
};

// Get available seats for showtime
export const getAvailableSeats = async (showtimeId) => {
  return api.get(`/Booking/available-seats/${showtimeId}`);
};

// DEPRECATED - Old API (keep for backward compatibility)
export const createBooking = async (bookingData) => {
  return api.post("/Booking/create", bookingData);
};

// ============================================
// CHATBOT AI APIs
// ============================================
export const sendChatMessage = async (messageData) => {
  return api.post("/Chat/send-message", messageData);
};

// ============================================
// PAYMENT APIs
// ============================================
export const createVNPayPayment = async (paymentData) => {
  return api.post("/Payment/vnpay/create", paymentData);
};

// ============================================
// TICKET APIs
// ============================================
export const getTicketDetails = async (ticketId) => {
  return api.get(`/Ticket/${ticketId}`);
};

// ============================================
// TICKET PRICES APIs
// ============================================
export const getTicketPrices = async () => {
  return api.get("/Ticketprices/get-all-ticket-price");
};

// ============================================
// USER/PROFILE APIs
// ============================================
export const getUserProfile = async () => {
  return api.get("/User/profile");
};

export const updateUserProfile = async (userData) => {
  return api.put("/Customer/update-profile", userData);
};

export const getUserTickets = async (email) => {
  return api.get(`/Ticket/customer/${email}`);
};

// ============================================
// CUSTOMER APIs
// ============================================
export const getCustomerProfile = async () => {
  return api.get("/Customer/profile");
};

export const updateCustomerProfile = async (customerId, data) => {
  return api.put(`/Customer/update-customer/${customerId}`, data);
};

export default api;
