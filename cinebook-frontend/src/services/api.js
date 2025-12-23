import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============================================
// AUTH APIs
// ============================================
export const login = async (credentials) => {
  return api.post('/auth/login', credentials)
}

export const register = async (userData) => {
  return api.post('/auth/register', userData)
}

export const getCurrentUser = async () => {
  return api.get('/auth/me')
}

export const sendOTP = async (emailData) => {
  return api.post('/auth/forgot-password', emailData)
}

export const verifyOTP = async (otpData) => {
  return api.post('/auth/verify-otp', otpData)
}

export const resetPassword = async (resetData) => {
  return api.post('/auth/reset-password', resetData)
}

// ============================================
// MOVIES APIs
// ============================================
export const getMovies = async () => {
  return api.get('/movies/get-all-movies')
}

export const getMovieById = async (id) => {
  return api.get(`/movies/get-movie-by-id/${id}`)
}

export const searchMovies = async (query) => {
  return api.get(`/movies/search?q=${query}`)
}

// ============================================
// THEATERS APIs
// ============================================
export const getTheaters = async () => {
  return api.get('/theater/get-all-theater')
}

export const getTheatersByCity = async (city) => {
  return api.get(`/theater/get-theater-by-city?city=${city}`)
}

// ============================================
// SHOWTIMES APIs
// ============================================
export const getAllShowtimes = async () => {
  return api.get('/showtimes/get_all_showtime')
}

export const getShowtimesByMovie = async (theaterId, movieId, date) => {
  return api.get('/showtimes/get-showtime-by-movieId', {
    params: { theaterId, movieId, date }
  })
}

// Auto-generate showtimes
export const autoGenerateShowtimes = async (date) => {
  return api.post('/showtimes/auto-generate', null, {
    params: { date }
  })
}

export const autoGenerateShowtimesRange = async (startDate, endDate) => {
  return api.post('/showtimes/auto-generate-range', null, {
    params: { startDate, endDate }
  })
}

export const getShowtimeStatistics = async (date) => {
  return api.get('/showtimes/statistics', {
    params: { date }
  })
}

// ============================================
// SEATS APIs
// ============================================
export const getSeatsByShowtime = async (showtimeId) => {
  return api.get(`/seats/showtime/${showtimeId}`)
}

export const checkSeatAvailability = async (showtimeId, seatIds) => {
  return api.post('/seats/check-availability', {
    showtimeId,
    seatIds
  })
}

// ============================================
// BOOKING APIs
// ============================================
export const createBooking = async (bookingData) => {
  return api.post('/booking/create', bookingData)
}

export const getAvailableSeats = async (showtimeId) => {
  return api.get(`/booking/available-seats/${showtimeId}`)
}

// ============================================
// PAYMENT APIs
// ============================================
export const createVNPayPayment = async (paymentData) => {
  return api.post('/payment/vnpay/create', paymentData)
}

// ============================================
// TICKET APIs
// ============================================
export const getTicketDetails = async (ticketId) => {
  return api.get(`/ticket/${ticketId}`)
}

// ============================================
// TICKET PRICES APIs
// ============================================
export const getTicketPrices = async () => {
  return api.get('/ticketprices/get-all-ticket-price')
}

// ============================================
// USER APIs
// ============================================
export const getUserProfile = async () => {
  return api.get('/user/profile')
}

export const updateUserProfile = async (userData) => {
  return api.put('/user/profile', userData)
}

export const getUserTickets = async () => {
  return api.get('/user/tickets')
}

export default api
