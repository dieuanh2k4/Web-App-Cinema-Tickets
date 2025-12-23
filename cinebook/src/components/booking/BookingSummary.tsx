import { Seat } from '../../types/booking.types';
import './BookingSummary.css';

interface BookingSummaryProps {
  movieTitle: string;
  moviePoster: string;
  date: string;
  time: string;
  hallType: string;
  theaterName: string;
  selectedSeats: Seat[];
  onContinue: () => void;
}

const BookingSummary = ({
  movieTitle,
  moviePoster,
  date,
  time,
  hallType,
  theaterName,
  selectedSeats,
  onContinue
}: BookingSummaryProps) => {
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const seatNumbers = selectedSeats.map(s => s.id).join(', ');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="booking-summary">
      <div className="summary-header">
        <h3>THÔNG TIN ĐẶT VÉ</h3>
      </div>

      <div className="summary-content">
        <div className="movie-info-summary">
          <img src={moviePoster} alt={movieTitle} className="summary-poster" />
          <div className="summary-details">
            <h4>{movieTitle}</h4>
            <p className="summary-type">{hallType}</p>
          </div>
        </div>

        <div className="summary-items">
          <div className="summary-item">
            <span className="label">🎬 Rạp:</span>
            <span className="value">{theaterName}</span>
          </div>

          <div className="summary-item">
            <span className="label">📅 Ngày:</span>
            <span className="value">{formatDate(date)}</span>
          </div>

          <div className="summary-item">
            <span className="label">⏰ Suất chiếu:</span>
            <span className="value">{time}</span>
          </div>

          <div className="summary-item">
            <span className="label">💺 Ghế:</span>
            <span className="value">{seatNumbers || 'Chưa chọn'}</span>
          </div>

          <div className="summary-item">
            <span className="label">🎫 Số lượng:</span>
            <span className="value">{selectedSeats.length} vé</span>
          </div>
        </div>

        <div className="summary-total">
          <span>TỔNG CỘNG:</span>
          <span className="total-price">{totalPrice.toLocaleString('vi-VN')}đ</span>
        </div>

        <button 
          className="btn-continue"
          onClick={onContinue}
          disabled={selectedSeats.length === 0}
        >
          {selectedSeats.length === 0 ? 'Vui lòng chọn ghế' : 'TIẾP TỤC'}
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;