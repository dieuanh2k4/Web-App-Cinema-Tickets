import apiClient from './apiService';

export const showtimeService = {
  getShowtimesByMovie: async (movieId) => {
    try {
      const response = await apiClient.get(`/Showtimes/by-movie/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching showtimes:', error);
      throw error;
    }
  },

  getShowtimesByMovieAndDate: async (movieId, date) => {
    try {
      const response = await apiClient.get(`/Showtimes/by-movie/${movieId}/date/${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching showtimes by date:', error);
      throw error;
    }
  },

  groupShowtimesByTheater: (showtimes) => {
    const grouped = {};

    showtimes.forEach(showtime => {
      const theaterId = showtime.theaterId;
      if (!grouped[theaterId]) {
        grouped[theaterId] = {
          id: theaterId,
          name: showtime.theaterName,
          address: showtime.theaterAddress,
          city: showtime.theaterCity,
          showtimes: []
        };
      }
      grouped[theaterId].showtimes.push(showtime);
    });

    return Object.values(grouped);
  },

  groupShowtimesByDate: (showtimes) => {
    const grouped = {};

    showtimes.forEach(showtime => {
      const date = showtime.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(showtime);
    });

    return grouped;
  }
};
