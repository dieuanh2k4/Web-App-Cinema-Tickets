export interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'standard' | 'vip';
  status: 'available' | 'selected' | 'booked';
  price: number;
}

export interface BookingInfo {
  movieId: number;
  movieTitle: string;
  moviePoster: string;
  showtimeId: number;
  date: string;
  time: string;
  hallType: string;
  theaterName: string;
  selectedSeats: Seat[];
  totalPrice: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  qrCode?: string;
}