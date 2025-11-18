export const BASE_URL = "http://localhost:5000/api";

export const API_CONFIG = {
  BASE_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      VERIFY_EMAIL: "/auth/verify-email",
      FORGOT_PASSWORD: "/auth/forgot-password",
      RESET_PASSWORD: "/auth/reset-password",
    },
    MOVIES: {
      NOW_PLAYING: "/movies/now-playing",
      UPCOMING: "/movies/upcoming",
      DETAIL: (id) => `/movies/${id}`,
    },
    THEATERS: "/theaters",
    SHOWTIMES: "/showtimes",
  },
  HEADERS: {
    "Content-Type": "application/json",
  },
};
