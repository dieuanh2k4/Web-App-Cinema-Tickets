// API Base URL - CHANGE THIS TO YOUR BACKEND URL
export const BASE_URL = "http://desktop-qedcej1/api";

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
    UPDATE: (id) => `/Movies/update-subject/${id}`,
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
    CREATE: "/Room/create-rooms",
    UPDATE: (id) => `/Room/update-room/${id}`,
    DELETE: (id) => `/Room/delete-room/${id}`,
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
};
