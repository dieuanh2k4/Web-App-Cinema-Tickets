export interface Theater {
  id: number;
  name: string;
  address: string;
  district: string;
  facilities: string[];
}

export interface Showtime {
  id: number;
  movieId: number;
  theaterId: number;
  date: string; // YYYY-MM-DD
  times: string[]; // ["10:00", "13:30", "16:45", "19:00"]
  hallType: 'Standard' | '3D' | 'IMAX' | '4DX';
  price: number;
  availableSeats: number;
}

export interface Ticket {
  id: number;
  movieId: number;
  movieTitle: string;
  theaterId: number;
  theaterName: string;
  showtime: string;
  date: string;
  seats: string[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}