import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilm, FaUser, FaCouch, FaShoppingBag } from 'react-icons/fa';
import { formatDate, formatCurrency } from '../utils/helpers';
import ticketService from '../services/ticketService';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetail();
  }, [id]);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTicketById(parseInt(id));
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
        </div>
        <div className="bg-secondary rounded-xl border border-gray-700/50 p-8 text-center">
          <p className="text-white text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
        </div>
        <div className="bg-secondary rounded-xl border border-gray-700/50 p-8 text-center">
          <p className="text-white text-lg">Không tìm thấy đơn hàng</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const badges = {
      'paid': 'bg-green-500/20 text-green-400 border-green-500/30',
      'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'cancelled': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return badges[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getStatusText = (status) => {
    const text = {
      'paid': 'Đã xác nhận',
      'pending': 'Chờ xác nhận',
      'cancelled': 'Đã hủy'
    };
    return text[status] || status;
  };

  const getSeatTypeText = (type) => {
    const text = {
      'standard': 'Ghế thường',
      'Standard': 'Ghế thường',
      'vip': 'Ghế VIP',
      'VIP': 'Ghế VIP',
      'couple': 'Ghế đôi',
      'Couple': 'Ghế đôi'
    };
    return text[type] || type;
  };

  // Tính tổng tiền ghế từ API data
  const seatsTotal = order.seats?.reduce((sum, seat) => sum + (seat.price || 0), 0) || 0;
  // Services không có trong API, set = 0
  const servicesTotal = 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Chi tiết đơn hàng</h1>
            <p className="text-gray-400 mt-1">Đơn hàng #{order.id}</p>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Thông tin đơn hàng */}
        <div className="bg-secondary rounded-xl border border-gray-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaFilm className="text-accent" />
            Thông tin đơn hàng
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-start py-2 border-b border-gray-700/50">
              <span className="text-sm text-gray-400">Mã đơn hàng:</span>
              <span className="text-sm font-medium text-white">#{order.id}</span>
            </div>
            <div className="flex justify-between items-start py-2 border-b border-gray-700/50">
              <span className="text-sm text-gray-400">Phim:</span>
              <span className="text-sm font-medium text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">
                {order.movieTitle}
              </span>
            </div>
            <div className="flex justify-between items-start py-2 border-b border-gray-700/50">
              <span className="text-sm text-gray-400">Giờ chiếu:</span>
              <span className="text-sm font-medium text-white">{order.startTime?.substring(0, 5) || 'N/A'} - {order.endTime?.substring(0, 5) || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-start py-2 border-b border-gray-700/50">
              <span className="text-sm text-gray-400">Ngày chiếu:</span>
              <span className="text-sm font-medium text-white">{formatDate(order.date)}</span>
            </div>
            <div className="flex justify-between items-start py-2 border-b border-gray-700/50">
              <span className="text-sm text-gray-400">Phòng chiếu:</span>
              <span className="text-sm font-medium text-white">{order.roomName || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-start py-2 border-b border-gray-700/50">
              <span className="text-sm text-gray-400">Số lượng ghế:</span>
              <span className="text-sm font-medium text-white">{order.sumOfSeat || order.seats?.length || 0} ghế</span>
            </div>
            <div className="flex justify-between items-start py-2">
              <span className="text-sm text-gray-400">Ngày đặt:</span>
              <span className="text-sm font-medium text-white">{formatDate(order.createdAt || order.createdDate)}</span>
            </div>
          </div>
        </div>

        {/* Column 2: Thông tin khách hàng */}
        <div className="bg-secondary rounded-xl border border-gray-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaUser className="text-accent" />
            Thông tin khách hàng
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-start py-2 border-b border-gray-700/50">
              <span className="text-sm text-gray-400">Khách hàng:</span>
              <span className="text-sm font-medium text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">
                {order.customerName || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-start py-2 border-b border-gray-700/50">
              <span className="text-sm text-gray-400">Điện thoại:</span>
              <span className="text-sm font-medium text-white">{order.customerPhone || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-start py-2 border-b border-gray-700/50">
              <span className="text-sm text-gray-400">Email:</span>
              <span className="text-sm font-medium text-white">{order.customerEmail || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-start py-2">
              <span className="text-sm text-gray-400">Tổng tiền:</span>
              <span className="text-sm font-bold text-accent text-lg">{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Column 3: Ghế & Dịch vụ */}
        <div className="bg-secondary rounded-xl border border-gray-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaCouch className="text-accent" />
            Danh sách ghế
          </h2>
          
          {/* Thông tin ghế */}
          <div className="mb-6">
            <div className="space-y-2">
              {order.seats && order.seats.length > 0 ? (
                order.seats.map((seat, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{seat.seatName || seat.name || `Ghế ${index + 1}`}</span>
                      <span className="text-xs text-gray-400">({getSeatTypeText(seat.seatType || seat.type)})</span>
                    </div>
                    <span className="text-sm text-white">{formatCurrency(seat.price || 0)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">Không có thông tin ghế</p>
              )}
            </div>
          </div>

          {/* Tổng cộng */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Tổng tiền ghế:</span>
                <span className="text-sm text-white">{formatCurrency(seatsTotal)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                <span className="text-base font-bold text-white">Tổng cộng:</span>
                <span className="text-lg font-bold text-accent">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
