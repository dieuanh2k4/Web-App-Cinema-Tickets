import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';

import SeatMap from '../components/booking/SeatMap';
import BookingSummary from '../components/booking/BookingSummary';
import { mockMovies } from '../data/mockMovies';
import { mockTheaters } from '../data/mockTheaters';
import { Seat } from '../types/booking.types';
import './BookingPage.css';

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  
  const showtimeId = searchParams.get('showtime');
  const time = searchParams.get('time');
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const movie = mockMovies.find(m => m.id === Number(id));
  const theater = mockTheaters[0]; // Giả sử chỉ có 1 rạp

  useEffect(() => {
    if (!movie || !showtimeId || !time) {
      navigate('/');
    }
  }, [movie, showtimeId, time, navigate]);

  if (!movie) return null;

  const handleSeatsChange = (seats: Seat[]) => {
    setSelectedSeats(seats);
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;

    // Lưu thông tin booking vào localStorage
    const bookingInfo = {
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: movie.thumbnail,
      showtimeId: Number(showtimeId),
      date,
      time,
      hallType: 'Standard', // Hoặc lấy từ showtime
      theaterName: theater.name,
      selectedSeats,
      totalPrice: selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
    };

    localStorage.setItem('currentBooking', JSON.stringify(bookingInfo));
    navigate('/payment');
  };

  return (
    <div className="booking-page">
      <Header />

      <div className="booking-container">
        {/* Back Button */}
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>

        {/* Page Title */}
        <div className="booking-header">
          <h1 className="booking-title"> Chọn Ghế Ngồi</h1>
          <p className="booking-subtitle">Vui lòng chọn ghế để tiếp tục đặt vé</p>
        </div>

        <div className="booking-content">
          {/* Seat Map */}
          <div className="booking-left">
            <div className="booking-movie-info">
              <img src={movie.thumbnail} alt={movie.title} className="booking-poster" />
              <div className="booking-details">
                <h2>{movie.title}</h2>
                <div className="booking-meta">
                  <span className="meta-badge">{movie.ageLimit}</span>
                  <span>⏱ {movie.duration} phút</span>
                  <span>🎬 {movie.genre}</span>
                </div>
                <p className="booking-theater">📍 {theater.name}</p>
                <p className="booking-datetime">
                  📅 {new Date(date).toLocaleDateString('vi-VN')} - {time}
                </p>
              </div>
            </div>

            <SeatMap onSeatsChange={handleSeatsChange} />
          </div>

          {/* Summary */}
          <div className="booking-right">
            <BookingSummary
              movieTitle={movie.title}
              moviePoster={movie.thumbnail}
              date={date}
              time={time || ''}
              hallType="Standard"
              theaterName={theater.name}
              selectedSeats={selectedSeats}
              onContinue={handleContinue}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;