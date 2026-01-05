// API Base URL - CHANGE THIS TO YOUR BACKEND URL
export const BASE_URL = "http://localhost:5001/api";

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/Auth/login",
    ME: "/Auth/me",
  },

  // Movies
  MOVIES: {
    GET_ALL: "/Movies/get-all-movies",
    GET_BY_ID: (id) => `/Movies/get-movie-by-id/${id}`,
    CREATE: "/Movies/create-movie",
    UPDATE: (id) => `/Movies/update-movie/${id}`,
    DELETE: (id) => `/Movies/delete-movie/${id}`,
  },

  // Users (Accounts)
  USERS: {
    GET_ALL: "/User/get-all-user",
    CREATE: "/User/create-user",
    UPDATE: (id) => `/User/update-user/${id}`,
    DELETE: (id) => `/User/delete-user/${id}`,
    PROFILE: "/User/profile",
  },

  // Showtimes
  SHOWTIMES: {
    GET_ALL: "/Showtimes/get_all_showtime",
    CREATE: "/Showtimes/create-showtimes",
    UPDATE: (id) => `/Showtimes/update-showtime/${id}`,
    DELETE: (id) => `/Showtimes/delete-showtime/${id}`,
    GET_BY_MOVIE: "/Showtimes/get-showtime-by-movieId",
  },

  // Rooms
  ROOMS: {
    GET_ALL: "/Room/get-all-room",
    GET_DETAIL: (id) => `/Room/get-detail-room/${id}`,
    CREATE: "/Room/create-rooms",
    UPDATE: (id) => `/Room/update-room/${id}`,
    DELETE: (id) => `/Room/delete-room/${id}`,
    UPDATE_SEAT_LAYOUT: (id) => `/Room/${id}/seat-layout`,
  },

  // Ticket Prices
  TICKET_PRICES: {
    GET_ALL: "/TicketPrices/get-all-ticket-price",
    CREATE: "/TicketPrices/create-ticket-price",
    UPDATE: (id) => `/TicketPrices/update-ticket-price/${id}`,
    DELETE: (id) => `/TicketPrices/delete-ticket-price/${id}`,
  },

  // Theaters
  THEATERS: {
    GET_ALL: "/Theater/get-all-theater",
    GET_BY_ID: (id) => `/Theater/get-theater-by-id/${id}`,
    CREATE: "/Theater/create-theater",
    UPDATE: (id) => `/Theater/update-theater/${id}`,
    DELETE: (id) => `/Theater/delete-theater/${id}`,
  },

  // Dashboard
  DASHBOARD: {
    STATISTICS: "/Dashboard/statistics",
    REVENUE_BY_MONTH: "/Dashboard/revenue-by-month",
    TOP_MOVIES: "/Dashboard/top-movies",
  },
};
