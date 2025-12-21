export interface Movie {
  id: number;
  title: string;
  thumbnail: string;
  duration: number; // phút
  genre: string;
  language: string;
  ageLimit: string; // P, T13, T16, T18
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  description: string;
  director: string;
  actors: string[];
  rating: number; // 0-10
  status: 'Đang chiếu' | 'Sắp chiếu' | 'Ngừng chiếu';
  trailer?: string;
}

export interface MovieCategory {
  category: string;
  movies: Movie[];
}