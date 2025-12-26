import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSyncAlt } from 'react-icons/fa';
import { formatCurrency } from '../utils/helpers';
import ticketPriceService from '../services/ticketPriceService';
import roomService from '../services/roomService';

const TicketPrices = () => {
  const [prices, setPrices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 10;

  // Load prices and room types from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pricesData, roomsData] = await Promise.all([
        ticketPriceService.getAllTicketPrices(),
        roomService.getAllRooms()
      ]);
      console.log('Prices data from API:', pricesData);
      console.log('Sample price:', pricesData?.[0]);
      console.log('Rooms data:', roomsData);
      setPrices(pricesData || []);
      setRooms(roomsData || []);
      
      // Extract unique room types from rooms
      const types = [...new Set(roomsData?.map(room => room.type).filter(Boolean))];
      console.log('Room types from API:', types);
      setRoomTypes(types.length > 0 ? types : ['2D', '3D', 'IMAX']); // Fallback to defaults if empty
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      setPrices([]);
      setRooms([]);
      setRoomTypes(['2D', '3D', 'IMAX']); // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  // Form state - BE only has: roomType, seatType, price
  const [formData, setFormData] = useState({
    roomType: '',
    seatType: '',
    price: ''
  });

  const seatTypes = ['Thường', 'Vip', 'Đôi']; // Match BE Vietnamese names

  // Pagination
  const totalPages = Math.ceil(prices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPrices = prices.slice(startIndex, startIndex + itemsPerPage);

  const handleAdd = () => {
    setModalMode('add');
    setFormData({
      roomType: roomTypes.length > 0 ? roomTypes[0] : '',
      seatType: 'Thường', // Default to first Vietnamese option
      price: ''
    });
    setShowModal(true);
  };

  const handleEdit = (price) => {
    setModalMode('edit');
    setSelectedPrice(price);
    setFormData({
      roomType: price.roomType || '',
      seatType: price.seatType || '',
      price: price.price || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giá vé này?')) {
      try {
        await ticketPriceService.deleteTicketPrice(id);
        await loadData();
        alert('Xóa giá vé thành công!');
      } catch (error) {
        console.error('Error deleting ticket price:', error);
        alert('Không thể xóa giá vé. Vui lòng thử lại sau.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.roomType || !formData.seatType || !formData.price) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const priceData = {
        roomType: formData.roomType,
        seatType: formData.seatType, // Already in Vietnamese
        price: parseInt(formData.price)
      };

      console.log('Sending price data:', priceData);

      if (modalMode === 'add') {
        await ticketPriceService.createTicketPrice(priceData);
      } else {
        await ticketPriceService.updateTicketPrice(selectedPrice.id, priceData);
      }

      await loadData();
      setShowModal(false);
      alert(modalMode === 'add' ? 'Thêm giá vé thành công!' : 'Cập nhật giá vé thành công!');
    } catch (error) {
      console.error('Error saving ticket price:', error);
      alert('Không thể lưu giá vé. Vui lòng thử lại sau.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getRoomTypeBadgeColor = (roomType) => {
    switch(roomType) {
      case '2D': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case '3D': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'IMAX': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSeatTypeBadgeColor = (seatType) => {
    const type = seatType?.toLowerCase();
    if (type === 'thường' || type === 'standard') return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    if (type === 'đôi' || type === 'couple') return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
    if (type === 'vip') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Quản lý giá vé
          </h1>
          <p className="text-gray-400 text-sm lg:text-base">Cấu hình giá vé theo loại phòng, ghế và suất chiếu</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSyncAlt className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl transition-all shadow-lg shadow-blue-600/25 font-medium"
          >
            <FaPlus />
            <span>Tạo giá vé</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-secondary via-secondary to-secondary/50 rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary/50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Loại ghế</th>
                <th className="px-8 py-5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Hình thức chiếu</th>
                <th className="px-8 py-5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Giá vé</th>
                <th className="px-8 py-5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {currentPrices.map((price) => (
                <tr key={price.id} className="hover:bg-primary/30 transition-colors group">
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 text-sm rounded-lg border ${getSeatTypeBadgeColor(price.seatType)}`}>
                      {price.seatType}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1.5 text-sm rounded-lg border ${getRoomTypeBadgeColor(price.roomType)}`}>
                      {price.roomType}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="text-white font-bold text-lg">{formatCurrency(price.price)}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(price)}
                        className="p-2 text-blue-400 hover:bg-blue-600/20 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(price.id)}
                        className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-5 border-t border-gray-700/50 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, prices.length)} trong {prices.length} giá vé
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
              >
                Trước
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === i + 1
                      ? 'bg-gradient-to-r from-accent to-purple-600 text-white shadow-lg shadow-accent/25'
                      : 'bg-primary text-white hover:bg-accent'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <h2 className="text-xl font-bold text-white">
                {modalMode === 'add' ? 'Tạo giá vé' : 'Cập nhật giá vé'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-primary/50 rounded-lg"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Loại ghế */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Loại ghế</label>
                <select
                  name="seatType"
                  value={formData.seatType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                >
                  <option value="">Select a seat type</option>
                  {seatTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Hình thức chiếu */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Hình thức chiếu</label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                >
                  <option value="">Select a graphics type</option>
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Giá tiền */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Giá tiền</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Nhập giá vé (VNĐ)"
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                  min="0"
                  step="1000"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl transition-all shadow-lg shadow-blue-600/25 font-medium"
                >
                  {modalMode === 'add' ? 'Lưu' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketPrices;
