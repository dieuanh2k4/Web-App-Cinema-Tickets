export const BASE_URL = "http://192.168.1.102:5051/api";
// export const BASE_URL = "http://10.0.2.2:5051/api";

export const API_CONFIG = {
  BASE_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/Auth/login",
      REGISTER: "/Auth/register",
      VERIFY_EMAIL: "/Auth/verify-email",
      FORGOT_PASSWORD: "/Auth/forgot-password",
      RESET_PASSWORD: "/Auth/reset-password",
    },
    MOVIES: {
      GET_ALL: "/Movies/get-all-movies",
      GET_BY_ID: (id) => `/Movies/get-movie-by-id/${id}`,
      CREATE: "/Movies/create-movie",
      UPDATE: (id) => `/Movies/update-subject/${id}`,
      DELETE: (id) => `/Movies/delete-movies/${id}`,
    },
    THEATERS: {
      GET_ALL: "/Theater/get-all-theater",
      GET_BY_ID: (id) => `/Theater/get-theater-by-id/${id}`,
      GET_BY_CITY: (city) => `/Theater/get-theater-by-city?city=${city}`,
      CREATE: "/Theater/create-theater",
      UPDATE: (id) => `/Theater/update-theater/${id}`,
      DELETE: (id) => `/Theater/delete-theater/${id}`,
    },
    SHOWTIMES: {
      GET_ALL: "/Showtimes/get_all_showtime",
      GET_BY_MOVIE: (theaterId, movieId, date) =>
        `/Showtimes/get-showtime-by-movieId?theaterId=${theaterId}&movieId=${movieId}&date=${date}`,
      CREATE: "/Showtimes/create-showtimes",
      UPDATE: (id) => `/Showtimes/update-showtime/${id}`,
      DELETE: (id) => `/Showtimes/delete-showtime/${id}`,
    },
  },
  HEADERS: {
    "Content-Type": "application/json",
  },
};
