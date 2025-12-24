import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSyncAlt, FaShoppingCart, FaEye } from 'react-icons/fa';
import { orders as initialOrders } from '../data/mockData';
import { formatDate, formatCurrency } from '../utils/helpers';

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  const handleRefresh = () => {
    setIsRefreshing(true);
    // TODO: Load data from DB
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('Orders data refreshed');
    }, 1000);
  };

  const handleViewDetail = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

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
      'paid': 'Đã thanh toán',
      'pending': 'Chờ thanh toán',
      'cancelled': 'Đã hủy'
    };
    return text[status] || status;
  };

  // Pagination
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

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
                        <div className="text-sm font-medium text-white">{order.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">{order.movieTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      {order.showtime}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm text-white">{order.roomName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-medium text-white">{formatCurrency(order.finalAmount)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-300">{formatDate(order.createdDate)}</span>
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
