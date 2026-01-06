import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaQrcode, FaCheckCircle, FaClock } from 'react-icons/fa';
import { formatCurrency } from '../utils/helpers';
import bookingService from '../services/bookingService';

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showtime, movie, theater, room, seats, seatInfo, totalAmount } = location.state || {};
  
  const [holdId, setHoldId] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (!showtime || !seats) {
      alert('Thông tin đặt vé không hợp lệ');
      navigate('/orders/create');
      return;
    }

    // Hold seats when component mounts
    holdSeats();

    // Countdown timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(timer);
      // If user navigates away without paying, seats will auto-release after TTL
    };
  }, []);

  const holdSeats = async () => {
    try {
      const seatIds = seats.map(s => s.seatId);
      const response = await bookingService.holdSeats(showtime.id, seatIds);
      setHoldId(response.holdId);
      console.log('Seats held successfully:', response);
    } catch (error) {
      console.error('Error holding seats:', error);
      alert('Không thể giữ ghế. Vui lòng thử lại.');
      navigate('/orders/create');
    }
  };

  const handleTimeout = () => {
    alert('Đã hết thời gian thanh toán. Ghế sẽ được giải phóng.');
    navigate('/orders/create');
  };

  const handleConfirmPayment = async () => {
    if (!holdId) {
      alert('Không tìm thấy thông tin giữ ghế');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await bookingService.confirmBooking(holdId);
      console.log('Booking confirmed:', response);
      setIsPaid(true);
      
      // Show success and redirect after 2 seconds
      setTimeout(() => {
        navigate('/orders', { 
          state: { 
            message: 'Đặt vé thành công!',
            bookingData: response.booking 
          } 
        });
      }, 2000);
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert(error.response?.data?.message || 'Thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    const confirmed = window.confirm('Bạn có chắc muốn hủy thanh toán? Ghế đã chọn sẽ được giải phóng.');
    if (confirmed) {
      alert('Thanh toán thất bại. Ghế sẽ được giải phóng.');
      navigate('/orders/create');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isPaid) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-secondary rounded-xl border border-gray-700/50 p-12 max-w-md">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Thanh toán thành công!</h2>
          <p className="text-gray-400 mb-6">Đơn hàng của bạn đã được xác nhận</p>
          <div className="animate-pulse text-accent">Đang chuyển hướng...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-white" size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Xác nhận thanh toán</h1>
          <p className="text-gray-400">Quét mã QR để hoàn tất thanh toán</p>
        </div>
      </div>

      {/* Timer Warning */}
      <div className="bg-orange-500/20 border border-orange-500/50 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <FaClock className="text-orange-400 text-2xl" />
          <div>
            <div className="text-orange-400 font-bold text-lg">
              Thời gian còn lại: {formatTime(timeRemaining)}
            </div>
            <div className="text-orange-300 text-sm">
              Ghế sẽ tự động được giải phóng sau khi hết thời gian
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: QR Code */}
        <div className="bg-secondary rounded-xl border border-gray-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaQrcode className="text-accent" />
            Mã QR thanh toán
          </h2>
          
          <div className="bg-white p-6 rounded-lg mb-4">
            <div className="aspect-square bg-gradient-to-br from-accent to-purple-600 rounded-lg flex items-center justify-center">
              <FaQrcode className="text-white text-9xl" />
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm mb-4">
            Quét mã QR bằng ứng dụng ngân hàng để thanh toán
          </div>

          <div className="bg-primary rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm mb-1">Số tiền thanh toán</div>
            <div className="text-accent text-3xl font-bold">{formatCurrency(totalAmount)}</div>
          </div>
        </div>

        {/* Right: Booking Details */}
        <div className="bg-secondary rounded-xl border border-gray-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Thông tin đặt vé</h2>
          
          <div className="space-y-4">
            <div>
              <div className="text-gray-400 text-sm">Phim</div>
              <div className="text-white font-bold">{movie?.title}</div>
            </div>
            
            <div>
              <div className="text-gray-400 text-sm">Rạp chiếu</div>
              <div className="text-white">{theater?.name}</div>
              <div className="text-gray-400 text-xs">{theater?.address}, {theater?.city}</div>
            </div>
            
            <div>
              <div className="text-gray-400 text-sm">Phòng chiếu</div>
              <div className="text-white">{room?.name} ({room?.type})</div>
            </div>
            
            <div>
              <div className="text-gray-400 text-sm">Suất chiếu</div>
              <div className="text-white">{showtime?.date} - {showtime?.start}</div>
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              <div className="text-gray-400 text-sm mb-2">Ghế đã chọn</div>
              <div className="flex flex-wrap gap-2">
                {seats?.map(seat => (
                  <span 
                    key={seat.seatId}
                    className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-bold"
                  >
                    {seat.seatNumber}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-white">Tổng tiền:</span>
                <span className="text-accent">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirmPayment}
            disabled={isProcessing || !holdId}
            className="w-full mt-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Đang xử lý...' : 'Xác nhận đã thanh toán'}
          </button>

          <button
            onClick={handleCancel}
            disabled={isProcessing}
            className="w-full mt-3 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy thanh toán
          </button>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <div className="text-yellow-400 text-sm">
          <strong>Lưu ý:</strong> Nếu bạn thoát khỏi trang này hoặc hết thời gian mà chưa xác nhận thanh toán, 
          ghế sẽ tự động được giải phóng và bạn cần đặt lại từ đầu.
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
