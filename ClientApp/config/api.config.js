export const BASE_URL = "http://localhost:8081/api";

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
      NOW_PLAYING: "/Movies/get-all-movies",
      UPCOMING: "/Movies/upcoming",
      DETAIL: (id) => `/Movies/get-all-movie-by-id/${id}`,
    },
    THEATERS: "/Theaters",
    SHOWTIMES: "/Showtimes",
  },
  HEADERS: {
    "Content-Type": "application/json",
  },
};
