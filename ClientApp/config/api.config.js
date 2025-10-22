import { BASE_URL } from "@env";
export const API_CONFIG = {
  BASE_URL: BASE_URL,
  ENDPOINTS: {
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
