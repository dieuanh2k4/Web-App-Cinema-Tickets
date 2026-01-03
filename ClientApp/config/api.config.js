export const BASE_URL = "http://192.168.102.5:5001/api";

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
    },

    THEATERS: {
      GET_ALL: "/Theater/get-all-theater",
      GET_BY_ID: (id) => `/Theater/get-theater-by-id?id=${id}`,
      GET_BY_CITY: (city) => `/Theater/get-theater-by-city?city=${city}`,
    },

    SHOWTIMES: {
      GET_ALL: "/Showtimes/get_all_showtime",
      GET_BY_MOVIE: (theaterId, movieId, date) =>
        `/Showtimes/get-showtime-by-movieId?theaterId=${theaterId}&movieId=${movieId}&date=${date}`,
      GET_BY_THEATER: (theaterId, date) =>
        `/Showtimes/get-showtime-by-theaterid?theaterId=${theaterId}&date=${date}`,
    },

    SEATS: {
      GET_BY_SHOWTIME: (showtimeId) => `/Seats/showtime/${showtimeId}`,
      CHECK_AVAILABILITY: "/Seats/check-availability",
    },

    BOOKING: {
      CREATE: "/Booking/create",
      AVAILABLE_SEATS: (showtimeId) => `/Booking/available-seats/${showtimeId}`,
      HOLD_SEATS: "/Booking/hold-seats",
      CONFIRM_BOOKING: "/Booking/confirm-booking",
    },

    TICKETS: {
      BOOK: "/Ticket/book",
      GET_BY_ID: (id) => `/Ticket/${id}`,
      GET_BY_EMAIL: (email) => `/Ticket/customer/${email}`,
      CANCEL: (id) => `/Ticket/cancel/${id}`,
    },

    TICKET_PRICES: {
      GET_ALL: "/TicketPrices/get-all-ticket-price",
    },

    PAYMENT: {
      VNPAY_CREATE: "/Payment/vnpay/create",
      VNPAY_CALLBACK: "/Payment/vnpay/callback",
    },

    CHAT: {
      SEND_MESSAGE: "/Chat/send-message",
    },

    SEARCH: {
      MOVIE_BY_NAME: (movieName) =>
        `/Search/search-movie-by-name?movieName=${movieName}`,
      THEATER_BY_NAME: (theaterName) =>
        `/Search/search-theater-by-name?theaterName=${theaterName}`,
    },

    USER: {
      PROFILE: "/User/profile",
      TICKETS: "/User/tickets",
    },
  },

  HEADERS: {
    "Content-Type": "application/json",
  },
};
