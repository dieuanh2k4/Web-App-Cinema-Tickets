export const API_CONFIG = {
  BASE_URL: "http://192.168.1.102:5079/api",
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
