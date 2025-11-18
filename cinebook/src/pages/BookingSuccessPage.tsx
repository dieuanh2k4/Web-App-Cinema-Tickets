import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import './BookingSuccessPage.css';

interface CompletedBooking {
  movieTitle: string;
  moviePoster: string;
  theaterName: string;
  date: string;
  time: string;
  hallType: string;
  selectedSeats: Array<{ id: string; price: number }>;
  totalPrice: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  paymentMethod: string;
  bookingCode: string;
  bookingDate: string;
}

const BookingSuccessPage = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<CompletedBooking | null>(null);

  useEffect(() => {
    const savedBooking = localStorage.getItem('completedBooking');
    if (!savedBooking) {
      navigate('/');
      return;
    }

    setBooking(JSON.parse(savedBooking));
  }, [navigate]);

  if (!booking) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handlePrintTicket = () => {
    window.print();
  };

  const handleDownloadTicket = () => {
    // Tạo nội dung vé dạng text
    const ticketContent = `
╔═══════════════════════════════════════╗
║         🎬 CINEBOOK CINEMA 🎬        ║
║        VÉ XEM PHIM ĐIỆN TỬ            ║
╠═══════════════════════════════════════╣
║                                       ║
║  Mã đặt vé: ${booking.bookingCode}
║                                       ║
║  Phim: ${booking.movieTitle}
║  Rạp: ${booking.theaterName}
║  Phòng: ${booking.hallType}
║                                       ║
║  Ngày: ${formatDate(booking.date)}
║  Suất chiếu: ${booking.time}
║                                       ║
║  Ghế: ${booking.selectedSeats.map(s => s.id).join(', ')}
║  Số lượng: ${booking.selectedSeats.length} vé
║                                       ║
║  Khách hàng: ${booking.customerInfo.name}
║  Email: ${booking.customerInfo.email}
║  SĐT: ${booking.customerInfo.phone}
║                                       ║
║  Tổng tiền: ${booking.totalPrice.toLocaleString('vi-VN')} VNĐ
║                                       ║
║  Thanh toán: ${getPaymentName(booking.paymentMethod)}
║  Ngày đặt: ${new Date(booking.bookingDate).toLocaleString('vi-VN')}
║                                       ║
╠═══════════════════════════════════════╣
║    LƯU Ý:                            ║
║  • Vui lòng đến trước 15 phút        ║
║  • Mang theo CMND/CCCD               ║
║  • Xuất trình mã vé khi vào rạp      ║
╚═══════════════════════════════════════╝
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ve-Phim-${booking.bookingCode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getPaymentName = (methodId: string) => {
    const methods: Record<string, string> = {
      momo: 'MoMo',
      zalopay: 'ZaloPay',
      banking: 'Chuyển khoản ngân hàng',
      visa: 'Thẻ Visa/Master'
    };
    return methods[methodId] || methodId;
  };

  return (
    <div className="success-page">
      <Header />

      <div className="success-container">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="success-checkmark">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="success-message">
          <h1>🎉 Đặt Vé Thành Công!</h1>
          <p>Cảm ơn bạn đã sử dụng dịch vụ của CINEBOOK</p>
          <p className="success-note">
            Vé đã được gửi đến email: <strong>{booking.customerInfo.email}</strong>
          </p>
        </div>

        {/* Ticket Card */}
        <div className="ticket-card">
          <div className="ticket-header">
            <div className="ticket-logo">🎬 CINEBOOK</div>
            <div className="ticket-code">
              <span>MÃ ĐẶT VÉ</span>
              <strong>{booking.bookingCode}</strong>
            </div>
          </div>

          <div className="ticket-body">
            <div className="ticket-movie-info">
              <img src={booking.moviePoster} alt={booking.movieTitle} className="ticket-poster" />
              
              <div className="ticket-details">
                <h2>{booking.movieTitle}</h2>
                <div className="ticket-type-badge">{booking.hallType}</div>

                <div className="ticket-info-grid">
                  <div className="info-item">
                    <span className="info-icon">🎬</span>
                    <div>
                      <p className="info-label">Rạp chiếu</p>
                      <p className="info-value">{booking.theaterName}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon"></span>
                    <div>
                      <p className="info-label">Ngày chiếu</p>
                      <p className="info-value">{formatDate(booking.date)}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon"></span>
                    <div>
                      <p className="info-label">Suất chiếu</p>
                      <p className="info-value">{booking.time}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon"></span>
                    <div>
                      <p className="info-label">Ghế ngồi</p>
                      <p className="info-value">{booking.selectedSeats.map(s => s.id).join(', ')}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon"></span>
                    <div>
                      <p className="info-label">Số lượng vé</p>
                      <p className="info-value">{booking.selectedSeats.length} vé</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon"></span>
                    <div>
                      <p className="info-label">Tổng tiền</p>
                      <p className="info-value highlight">{booking.totalPrice.toLocaleString('vi-VN')}đ</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ticket-divider">
              <div className="divider-line"></div>
              <div className="divider-circles">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <div className="ticket-customer-info">
              <h3>THÔNG TIN KHÁCH HÀNG</h3>
              <div className="customer-details">
                <div className="customer-item">
                  <span>👤 Họ tên:</span>
                  <strong>{booking.customerInfo.name}</strong>
                </div>
                <div className="customer-item">
                  <span> Email:</span>
                  <strong>{booking.customerInfo.email}</strong>
                </div>
                <div className="customer-item">
                  <span> SĐT:</span>
                  <strong>{booking.customerInfo.phone}</strong>
                </div>
                <div className="customer-item">
                  <span> Thanh toán:</span>
                  <strong>{getPaymentName(booking.paymentMethod)}</strong>
                </div>
              </div>
            </div>

            <div className="ticket-qr">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.bookingCode}`} 
                alt="QR Code" 
              />
              <p>Quét mã QR tại quầy để nhận vé</p>
            </div>

            <div className="ticket-warning">
              <h4> LƯU Ý QUAN TRỌNG</h4>
              <ul>
                <li>Vui lòng đến trước giờ chiếu <strong>15 phút</strong></li>
                <li>Mang theo <strong>CMND/CCCD</strong> hoặc mã đặt vé</li>
                <li>Xuất trình mã QR hoặc mã đặt vé tại quầy</li>
                <li>Không hoàn tiền sau khi đã đặt vé</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="success-actions">
          <button className="btn-action btn-print" onClick={handlePrintTicket}>
             In vé
          </button>
          <button className="btn-action btn-download" onClick={handleDownloadTicket}>
             Tải vé
          </button>
          <button className="btn-action btn-home" onClick={() => navigate('/')}>
             Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;