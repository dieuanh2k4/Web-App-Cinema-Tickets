import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { BookingInfo, PaymentMethod } from '../types/booking.types';
import './PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [countdown, setCountdown] = useState(600); // 10 phút

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'momo',
      name: 'MoMo',
      icon: '',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MOMO_PAYMENT'
    },
    {
      id: 'zalopay',
      name: 'ZaloPay',
      icon: '',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ZALOPAY_PAYMENT'
    },
    {
      id: 'banking',
      name: 'Chuyển khoản ngân hàng',
      icon: '',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BANK_TRANSFER'
    },
    {
      id: 'visa',
      name: 'Thẻ Visa/Master',
      icon: ''
    }
  ];

  useEffect(() => {
    const savedBooking = localStorage.getItem('currentBooking');
    if (!savedBooking) {
      navigate('/');
      return;
    }

    setBookingInfo(JSON.parse(savedBooking));

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          alert('Hết thời gian thanh toán!');
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  if (!bookingInfo) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePayment = () => {
    if (!selectedPayment) {
      alert('Vui lòng chọn phương thức thanh toán!');
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Lưu thông tin customer
    const completeBooking = {
      ...bookingInfo,
      customerInfo,
      paymentMethod: selectedPayment,
      bookingCode: `BK${Date.now()}`,
      bookingDate: new Date().toISOString()
    };

    localStorage.setItem('completedBooking', JSON.stringify(completeBooking));
    localStorage.removeItem('currentBooking');

    navigate('/booking-success');
  };

  const selectedMethod = paymentMethods.find(p => p.id === selectedPayment);

  return (
    <div className="payment-page">
      <Header />

      <div className="payment-container">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>

        <div className="payment-header">
          <h1 className="payment-title">💳 Thanh Toán</h1>
          <div className="countdown-timer">
             Thời gian còn lại: <span>{formatTime(countdown)}</span>
          </div>
        </div>

        <div className="payment-content">
          {/* Left: Booking Info */}
          <div className="payment-left">
            {/* Customer Info */}
            <div className="payment-section">
              <h3>THÔNG TIN KHÁCH HÀNG</h3>
              <div className="form-group">
                <label>Họ và tên *</label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={customerInfo.name}
                  onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={customerInfo.email}
                  onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  placeholder="0912345678"
                  value={customerInfo.phone}
                  onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-section">
              <h3>PHƯƠNG THỨC THANH TOÁN</h3>
              <div className="payment-methods">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    className={`payment-method ${selectedPayment === method.id ? 'active' : ''}`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <span className="method-icon">{method.icon}</span>
                    <span className="method-name">{method.name}</span>
                    {selectedPayment === method.id && (
                      <span className="check-icon">✓</span>
                    )}
                  </button>
                ))}
              </div>

              {/* QR Code */}
              {selectedMethod?.qrCode && (
                <div className="qr-code-section">
                  <img src={selectedMethod.qrCode} alt="QR Code" className="qr-code" />
                  <p className="qr-instruction">
                    Quét mã QR để thanh toán<br />
                    Số tiền: <strong>{bookingInfo.totalPrice.toLocaleString('vi-VN')}đ</strong>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="payment-right">
            <div className="order-summary">
              <h3>THÔNG TIN ĐẶT VÉ</h3>

              <div className="order-movie">
                <img src={bookingInfo.moviePoster} alt={bookingInfo.movieTitle} />
                <div>
                  <h4>{bookingInfo.movieTitle}</h4>
                  <p>{bookingInfo.hallType}</p>
                </div>
              </div>

              <div className="order-details">
                <div className="order-item">
                  <span>🎬 Rạp:</span>
                  <span>{bookingInfo.theaterName}</span>
                </div>
                <div className="order-item">
                  <span> Ngày:</span>
                  <span>{new Date(bookingInfo.date).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="order-item">
                  <span> Suất:</span>
                  <span>{bookingInfo.time}</span>
                </div>
                <div className="order-item">
                  <span> Ghế:</span>
                  <span>{bookingInfo.selectedSeats.map(s => s.id).join(', ')}</span>
                </div>
                <div className="order-item">
                  <span> Số lượng:</span>
                  <span>{bookingInfo.selectedSeats.length} vé</span>
                </div>
              </div>

              <div className="order-total">
                <span>TỔNG CỘNG:</span>
                <span className="total-price">{bookingInfo.totalPrice.toLocaleString('vi-VN')}đ</span>
              </div>

              <button className="btn-payment" onClick={handlePayment}>
                XÁC NHẬN THANH TOÁN
              </button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default PaymentPage;