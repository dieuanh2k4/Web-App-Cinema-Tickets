export const BASE_URL = "http://192.168.1.102:5001/api";

export const API_CONFIG = {
  BASE_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/Auth/login",
      REGISTER: "/Auth/customer-register",
      ME: "/Auth/me",
      MY_TICKETS: "/Auth/my-tickets",
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
      GET_BY_ID: (id) => `/Theater/get-theater-by-id/${id}?id=${id}`,
      GET_BY_CITY: (city) => `/Theater/get-theater-by-city?city=${city}`,
      CREATE: "/Theater/create-theater",
      UPDATE: (id) => `/Theater/update-theater/${id}`,
      DELETE: (id) => `/Theater/delete-theater/${id}`,
    },

    SHOWTIMES: {
      GET_ALL: "/Showtimes/get_all_showtime",
      GET_BY_MOVIE: (theaterId, movieId, date) =>
        `/Showtimes/get-showtime-by-movieId?theaterId=${theaterId}&movieId=${movieId}&date=${date}`,
      GET_BY_THEATER: (theaterId, date) =>
        `/Showtimes/get-showtime-by-theaterid?theaterId=${theaterId}&date=${date}`,
      CREATE: "/Showtimes/create-showtimes",
      UPDATE: (id) => `/Showtimes/update-showtime/${id}`,
      DELETE: (id) => `/Showtimes/delete-showtime/${id}`,
      AUTO_GENERATE: "/Showtimes/auto-generate",
      AUTO_GENERATE_RANGE: "/Showtimes/auto-generate-range",
      STATISTICS: "/Showtimes/statistics",
    },

    SEATS: {
      GET_BY_SHOWTIME: (showtimeId) => `/Seats/showtime/${showtimeId}`,
      CHECK_AVAILABILITY: "/Seats/check-availability",
    },

    BOOKING: {
      CREATE: "/Booking/create",
      CREATE_BY_STAFF: "/Booking/create-by-staff",
      AVAILABLE_SEATS: (showtimeId) => `/Booking/available-seats/${showtimeId}`,
      HOLD_SEATS: "/Booking/hold-seats",
      RELEASE_SEATS: "/Booking/release-seats",
      CONFIRM_BOOKING: "/Booking/confirm-booking",
      GET_BY_CUSTOMER: (customerId) => `/Booking/customer/${customerId}`,
      GET_HISTORY: (customerId) => `/Booking/history/${customerId}`,
    },

    TICKETS: {
      BOOK: "/Ticket/book",
      GET_BY_ID: (id) => `/Ticket/${id}`,
      GET_BY_EMAIL: (email) => `/Ticket/customer/${email}`,
      GET_BY_CUSTOMER: (customerId) => `/Ticket/customer/${customerId}`,
      CANCEL: (id) => `/Ticket/cancel/${id}`,
      GET_ALL: "/Ticket/all",
    },

    TICKET_PRICES: {
      GET_ALL: "/TicketPrices/get-all-ticket-price",
      CREATE: "/TicketPrices/create-ticket-price",
      UPDATE: (id) => `/TicketPrices/update-ticket-price/${id}`,
      DELETE: (id) => `/TicketPrices/delete-ticket-price/${id}`,
    },

    CUSTOMER: {
      ME: "/Customer/me",
      GET_INFO: (id) => `/Customer/get-info-customer?id=${id}`,
      UPDATE_INFO: (id) => `/Customer/update-info-customer/${id}`,
    },

    ROOMS: {
      GET_ALL: "/Room/get-all-room",
      CREATE: "/Room/create-rooms",
      UPDATE: (id) => `/Room/update-room/${id}`,
      DELETE: (id) => `/Room/delete-room/${id}`,
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
      GET_ALL: "/User/get-all-user",
      CREATE: "/User/create-user",
      UPDATE: (id) => `/User/update-user/${id}`,
      DELETE: (id) => `/User/delete-user/${id}`,
      PROFILE: "/User/profile",
      TICKETS: "/User/tickets",
    },
  },

  HEADERS: {
    "Content-Type": "application/json",
  },
};
console.log("BASE URL:", BASE_URL);
