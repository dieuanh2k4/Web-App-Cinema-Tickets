export const BASE_URL = "http://192.168.102.7:5001/api";

export const API_CONFIG = {
  BASE_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/Auth/login",
      ME: "/Auth/me",
    },
    MOVIES: {
      GET_ALL: "/Movies/get-all-movies",
      GET_BY_ID: (id) => `/Movies/get-movie-by-id/${id}`,
      CREATE: "/Movies/create-movie",
      UPDATE: (id) => `/Movies/update-subject/${id}`,
      DELETE: (id) => `/Movies/delete-movie/${id}`,
    },
    THEATERS: {
      GET_ALL: "/Theater/get-all-theater",
      GET_BY_ID: (id) => `/Theater/get-theater-by-id/${id}`,
      CREATE: "/Theater/create-theater",
      UPDATE: (id) => `/Theater/update-theater/${id}`,
      DELETE: (id) => `/Theater/delete-theater/${id}`,
    },
    ROOMS: {
      GET_ALL: "/Room/get-all-room",
      CREATE: "/Room/create-rooms",
      UPDATE: (id) => `/Room/update-room/${id}`,
      DELETE: (id) => `/Room/delete-room/${id}`,
    },
    SHOWTIMES: {
      GET_ALL: "/Showtimes/get_all_showtime",
      GET_BY_MOVIE: (theaterId, movieId, date) =>
        `/Showtimes/get-showtime-by-movieId?theaterId=${theaterId}&movieId=${movieId}&date=${date}`,
      CREATE: "/Showtimes/create-showtimes",
      UPDATE: (id) => `/Showtimes/update-showtime/${id}`,
      DELETE: (id) => `/Showtimes/delete-showtime/${id}`,
    },
    SEATS: {
      GET_BY_SHOWTIME: (showtimeId) => `/Seats/showtime/${showtimeId}`,
    },
    BOOKING: {
      CREATE: "/Booking/create",
      CREATE_BY_STAFF: "/Booking/create-by-staff",
      AVAILABLE_SEATS: (showtimeId) => `/Booking/available-seats/${showtimeId}`,
      HOLD_SEATS: "/Booking/hold-seats",
      CONFIRM_BOOKING: "/Booking/confirm-booking",
      RELEASE_SEATS: "/Booking/release-seats",
    },
    TICKETS: {
      BOOK: "/Ticket/book",
      GET_ALL: "/Ticket/all",
      GET_BY_ID: (id) => `/Ticket/${id}`,
      GET_BY_EMAIL: (email) => `/Ticket/customer/${email}`,
      CANCEL: (id) => `/Ticket/cancel/${id}`,
    },
  },
  HEADERS: {
    "Content-Type": "application/json",
  },
};
