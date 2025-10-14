import api from "../constants/api";
export const movieService = {
  getNowPlaying: () => api.get("/Movies/now-playing"),
  getUpcoming: () => api.get("/Movies/upcoming"),
  getMovieById: (id) => api.get(`/Movies/${id}`),
  searchMovies: (query) => api.get(`/Movies/search?query=${query}`),
};
