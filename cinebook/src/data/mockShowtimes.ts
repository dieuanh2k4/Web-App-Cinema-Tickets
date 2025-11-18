import { Showtime } from '../types/showtime.types';

// Tạo showtimes cho 7 ngày tới
const generateShowtimes = (): Showtime[] => {
  const showtimes: Showtime[] = [];
  const today = new Date();
  let id = 1;

  // Lấy tất cả phim đang chiếu
  const movieIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    const dateStr = date.toISOString().split('T')[0];

    movieIds.forEach(movieId => {
      // Chỉ có 1 rạp (theaterId = 1)
      const theaterId = 1;
      
      // Standard 2D
      showtimes.push({
        id: id++,
        movieId,
        theaterId,
        date: dateStr,
        times: ["10:00", "13:30", "16:45", "19:00", "21:30"],
        hallType: 'Standard',
        price: 80000,
        availableSeats: Math.floor(Math.random() * 50) + 50
      });

      // 3D
      showtimes.push({
        id: id++,
        movieId,
        theaterId,
        date: dateStr,
        times: ["12:00", "15:15", "18:30", "21:45"],
        hallType: '3D',
        price: 120000,
        availableSeats: Math.floor(Math.random() * 40) + 40
      });

      // IMAX
      showtimes.push({
        id: id++,
        movieId,
        theaterId,
        date: dateStr,
        times: ["11:00", "14:30", "17:45", "20:30"],
        hallType: 'IMAX',
        price: 150000,
        availableSeats: Math.floor(Math.random() * 30) + 30
      });

      // 4DX
      showtimes.push({
        id: id++,
        movieId,
        theaterId,
        date: dateStr,
        times: ["13:00", "16:00", "19:15", "22:00"],
        hallType: '4DX',
        price: 180000,
        availableSeats: Math.floor(Math.random() * 25) + 25
      });
    });
  }

  return showtimes;
};

export const mockShowtimes = generateShowtimes();

// Helper functions
export const getShowtimesByMovie = (movieId: number) => {
  return mockShowtimes.filter(st => st.movieId === movieId);
};

export const getShowtimesByDate = (movieId: number, date: string) => {
  return mockShowtimes.filter(st => st.movieId === movieId && st.date === date);
};

export const getShowtimesByTheater = (movieId: number, date: string, theaterId: number) => {
  return mockShowtimes.filter(
    st => st.movieId === movieId && st.date === date && st.theaterId === theaterId
  );
};