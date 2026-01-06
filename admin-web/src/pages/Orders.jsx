import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSyncAlt, FaShoppingCart, FaEye, FaPlus } from 'react-icons/fa';
import { formatDate, formatCurrency } from '../utils/helpers';
import ticketService from '../services/ticketService';
import { useAuth } from '../hooks/useAuth';

const Orders = () => {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  // Load tickets from API
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getAllTickets();
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
      alert('Không thể tải danh sách đơn hàng. Vui lòng thử lại!');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadOrders();
    setIsRefreshing(false);
  };

  const handleViewDetail = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  // Pagination
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý đơn hàng</h1>
          <p className="text-gray-400">Quản lý thông tin đơn đặt vé</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSyncAlt className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          {(isAdmin || user?.role?.toLowerCase() === 'staff') && (
            <button
              onClick={() => navigate('/orders/create')}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-accent to-purple-600 hover:from-accent/90 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg shadow-accent/25 font-medium"
            >
              <FaPlus />
              <span>Tạo đơn hàng mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-secondary rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tên phim
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Suất chiếu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Phòng chiếu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-primary/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-lg flex items-center justify-center">
                        <FaShoppingCart className="text-white" size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">#{order.id}</div>
                        <div className="text-xs text-gray-400">{order.customerName || order.customerEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">{order.movieTitle || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm">
                      <div className="text-gray-300">{formatDate(order.date)}</div>
                      <div className="text-xs text-orange-400">{order.startTime?.substring(0, 5) || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm text-white">{order.roomName || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full border bg-green-500/20 text-green-400 border-green-500/30">
                      Đã thanh toán
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-medium text-white">{formatCurrency(order.totalPrice)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-300">{formatDate(order.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleViewDetail(order.id)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                      title="Xem chi tiết"
                    >
                      <FaEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, orders.length)} trong tổng số {orders.length} đơn hàng
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-accent text-white'
                      : 'bg-primary text-white hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
