import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSyncAlt, FaDoorOpen, FaTimes, FaCouch } from 'react-icons/fa';
import { formatDate } from '../utils/helpers';
import roomService from '../services/roomService';
import theaterService from '../services/theaterService';
import ticketPriceService from '../services/ticketPriceService';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [ticketPrices, setTicketPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editingRow, setEditingRow] = useState(null); // Track which row is being edited
  const itemsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    rows: '',
    columns: '',
    totalSeats: '',
    theaterId: ''
  });

  const roomTypes = ['Standard', 'IMAX'];
  const seatTypes = ['standard', 'vip', 'couple'];

  // Load data from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsData, theatersData, pricesData] = await Promise.all([
        roomService.getAllRooms(),
        theaterService.getAllTheaters(),
        ticketPriceService.getAllTicketPrices()
      ]);
      setRooms(roomsData || []);
      setTheaters(theatersData || []);
      setTicketPrices(pricesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      setRooms([]);
      setTheaters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handleAdd = () => {
    setModalMode('add');
    setFormData({
      name: '',
      type: '',
      rows: '',
      columns: '',
      totalSeats: '',
      theaterId: ''
    });
    setShowModal(true);
  };

  const handleEdit = (room) => {
    setModalMode('edit');
    setSelectedRoom(room);
    setFormData({
      name: room.name,
      type: room.type,
      rows: room.rows,
      columns: room.columns,
      totalSeats: room.capacity || room.maxSeats,
      theaterId: room.theaterId?.toString() || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.type || !formData.rows || !formData.columns || !formData.theaterId) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const rows = parseInt(formData.rows);
      const columns = parseInt(formData.columns);
      const capacity = rows * columns;

      // Prepare room data for BE
      const roomData = {
        name: formData.name,
        capacity: capacity,
        type: formData.type,
        theaterId: parseInt(formData.theaterId)
      };

      // Seat configuration for BE query params
      const seatConfig = {
        row: rows,
        seatsInRow: columns,
        normalSeats: Math.floor(rows * 0.8), // 80% normal seats
        coupleRowsSeats: Math.ceil(rows * 0.2) // 20% couple rows
      };

      if (modalMode === 'add') {
        await roomService.createRoom(roomData, seatConfig);
        alert('Thêm phòng chiếu thành công!');
      } else {
        await roomService.updateRoom(selectedRoom.id, roomData, seatConfig);
        alert('Cập nhật phòng chiếu thành công!');
      }

      await loadData();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving room:', error);
      alert('Không thể lưu phòng chiếu. Vui lòng thử lại sau.');
    }
  };

  const handleManageSeats = async (room) => {
    try {
      // Load room detail with seats from API
      const roomDetail = await roomService.getRoomDetail(room.id);
      
      // Format seats data into 2D array for seat layout
      // Backend seats have: name (e.g., "A1"), type ("Thường", "Vip", "Đôi"), status
      const rows = roomDetail.rows || room.rows || 10;
      const columns = roomDetail.columns || room.columns || 12;
      
      // Initialize empty seat layout
      const seatLayout = [];
      for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < columns; j++) {
          row.push({
            type: 'standard',
            enabled: true
          });
        }
        seatLayout.push(row);
      }
      
      // Map backend seats to seat layout
      if (roomDetail.seats && roomDetail.seats.length > 0) {
        roomDetail.seats.forEach(seat => {
          // Parse seat name like "A1", "B2" to get row and column
          const seatName = seat.name || '';
          const rowLetter = seatName.charAt(0); // "A", "B", "C"...
          const colNumber = parseInt(seatName.substring(1)); // 1, 2, 3...
          
          if (rowLetter && colNumber) {
            const rowIndex = rowLetter.charCodeAt(0) - 65; // A=0, B=1, C=2...
            const colIndex = colNumber - 1; // Convert to 0-based index
            
            if (rowIndex >= 0 && rowIndex < rows && colIndex >= 0 && colIndex < columns) {
              // Map backend seat type: "Standard", "VIP", "Couple"
              let seatType = 'standard';
              if (seat.type === 'Standard') seatType = 'standard';
              else if (seat.type === 'VIP') seatType = 'vip';
              else if (seat.type === 'Couple') seatType = 'couple';
              
              seatLayout[rowIndex][colIndex] = {
                type: seatType,
                enabled: true,
                id: seat.id,
                price: seat.price,
                status: seat.status // Keep original status for booking system
              };
            }
          }
        });
      }
      
      setSelectedRoom({
        ...roomDetail,
        seatLayout,
        maxSeats: rows * columns
      });
      setShowSeatModal(true);
    } catch (error) {
      console.error('Error loading room seats:', error);
      alert('Không thể tải thông tin ghế. Vui lòng thử lại sau.');
    }
  };

  // Helper function to get price based on seat type and room type
  const getPriceForSeat = (seatType, roomType) => {
    const priceEntry = ticketPrices.find(p => 
      p.seatType === seatType && p.roomType === roomType
    );
    return priceEntry ? priceEntry.price : 0;
  };

  const handleSeatClick = (rowIndex, colIndex) => {
    const updatedRoom = { ...selectedRoom };
    const seat = updatedRoom.seatLayout[rowIndex][colIndex];
    
    // Cycle through seat types: standard -> vip -> couple -> standard
    const typeOrder = ['standard', 'vip', 'couple'];
    const currentIndex = typeOrder.indexOf(seat.type);
    const nextIndex = (currentIndex + 1) % typeOrder.length;
    
    seat.type = typeOrder[nextIndex];
    
    setSelectedRoom(updatedRoom);
  };

  const handleSaveSeatLayout = async () => {
    try {
      // Convert seatLayout back to API format
      const seats = [];
      
      selectedRoom.seatLayout.forEach((row, rowIndex) => {
        row.forEach((seat, colIndex) => {
          if (seat.id) { // Only update existing seats
            // Map frontend seat type to backend type: "Standard", "VIP", "Couple"
            let backendType = 'Standard';
            if (seat.type === 'vip') backendType = 'VIP';
            else if (seat.type === 'couple') backendType = 'Couple';
            
            // Get price based on seat type and room type
            const price = getPriceForSeat(backendType, selectedRoom.type);
            
            seats.push({
              id: seat.id,
              name: seat.name || `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`,
              type: backendType,
              price: price,
              status: seat.status || 'Available' // Keep existing status, default to Available
            });
          }
        });
      });

      await roomService.updateSeatLayout(selectedRoom.id, seats);
      
      // Count total seats
      const totalSeats = selectedRoom.seatLayout.flat().length;
      
      // Update local state
      setRooms(rooms.map(r => 
        r.id === selectedRoom.id 
          ? { ...r, seatLayout: selectedRoom.seatLayout, totalSeats: totalSeats }
          : r
      ));
      
      setShowSeatModal(false);
      alert('Đã lưu sơ đồ ghế thành công!');
    } catch (error) {
      console.error('Error saving seat layout:', error);
      alert('Không thể lưu sơ đồ ghế. Vui lòng thử lại sau.');
    }
  };

  const handleRowEdit = (rowIndex, seatType) => {
    const updatedRoom = { ...selectedRoom };
    
    // Update all seats in the row
    updatedRoom.seatLayout[rowIndex].forEach(seat => {
      seat.type = seatType;
    });
    
    setSelectedRoom(updatedRoom);
    setEditingRow(null); // Close the menu after selection
  };

  const getSeatColor = (seat) => {
    switch (seat.type) {
      case 'standard': return 'bg-blue-500 hover:bg-blue-600';
      case 'vip': return 'bg-red-500 hover:bg-red-600';
      case 'couple': return 'bg-pink-500 hover:bg-pink-600';
      default: return 'bg-gray-500';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto calculate total seats when rows or columns change
    if (name === 'rows' || name === 'columns') {
      const rows = name === 'rows' ? parseInt(value) || 0 : parseInt(formData.rows) || 0;
      const columns = name === 'columns' ? parseInt(value) || 0 : parseInt(formData.columns) || 0;
      setFormData(prev => ({
        ...prev,
        [name]: value,
        totalSeats: (rows * columns).toString()
      }));
    }
  };

  // Pagination
  const totalPages = Math.ceil(rooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRooms = rooms.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng chiếu này?')) {
      try {
        await roomService.deleteRoom(id);
        await loadData();
        alert('Xóa phòng chiếu thành công!');
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('Không thể xóa phòng chiếu. Vui lòng thử lại sau.');
      }
    }
  };

  const getRoomTypeBadge = (type) => {
    const badges = {
      'Standard': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'IMAX': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    return badges[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-3">Quản lý phòng chiếu</h1>
          <p className="text-gray-400 text-sm lg:text-base">Danh sách tất cả các phòng chiếu trong rạp</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSyncAlt className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FaPlus />
            <span>Thêm phòng chiếu</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-secondary rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tên phòng
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rạp chiếu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Loại phòng
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Số ghế
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Số hàng
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Số cột
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentRooms.map((room) => (
                <tr key={room.id} className="hover:bg-primary/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-lg flex items-center justify-center">
                        <FaDoorOpen className="text-white" size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{room.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">{room.theater?.name || 'Chưa có rạp'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getRoomTypeBadge(room.type)}`}>
                      Phòng {room.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-white font-medium">{room.capacity || room.totalSeats || 0} ghế</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-300">{room.rows || 0}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-300">{room.columns || 0}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-400">{room.createdDate ? formatDate(room.createdDate) : '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleManageSeats(room)}
                        className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-all"
                        title="Quản lý ghế"
                      >
                        <FaCouch size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(room)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                        title="Chỉnh sửa"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
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
          <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, rooms.length)} trong tổng số {rooms.length} phòng
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === index + 1
                      ? 'bg-accent text-white'
                      : 'bg-primary text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                {modalMode === 'add' ? 'Thêm phòng chiếu' : 'Cập nhật phòng chiếu'}
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
              {/* Tên phòng */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tên phòng</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ví dụ: Phòng 1"
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                />
              </div>

              {/* Rạp chiếu */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rạp chiếu
                  {modalMode === 'edit' && <span className="text-xs text-gray-500 ml-2">(Không thể thay đổi)</span>}
                </label>
                <select
                  name="theaterId"
                  value={formData.theaterId}
                  onChange={handleChange}
                  disabled={modalMode === 'edit'}
                  className={`w-full px-4 py-3 border border-gray-600 rounded-xl text-white focus:outline-none transition-all ${
                    modalMode === 'edit' 
                      ? 'bg-gray-700/50 cursor-not-allowed' 
                      : 'bg-primary/80 focus:border-accent focus:ring-2 focus:ring-accent/50'
                  }`}
                  required
                >
                  <option value="">Chọn rạp chiếu</option>
                  {theaters.map(theater => (
                    <option key={theater.id} value={theater.id}>{theater.name}</option>
                  ))}
                </select>
              </div>

              {/* Loại phòng */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Loại phòng</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                >
                  <option value="">Chọn loại phòng</option>
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Số hàng */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Số hàng ghế
                  {modalMode === 'edit' && <span className="text-xs text-gray-500 ml-2">(Không thể thay đổi)</span>}
                </label>
                <input
                  type="number"
                  name="rows"
                  value={formData.rows}
                  onChange={handleChange}
                  placeholder="Ví dụ: 10"
                  min="1"
                  max="26"
                  disabled={modalMode === 'edit'}
                  className={`w-full px-4 py-3 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                    modalMode === 'edit' 
                      ? 'bg-gray-700/50 cursor-not-allowed' 
                      : 'bg-primary/80 focus:border-accent focus:ring-2 focus:ring-accent/50'
                  }`}
                  required
                />
              </div>

              {/* Số cột */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Số cột ghế
                  {modalMode === 'edit' && <span className="text-xs text-gray-500 ml-2">(Không thể thay đổi)</span>}
                </label>
                <input
                  type="number"
                  name="columns"
                  value={formData.columns}
                  onChange={handleChange}
                  placeholder="Ví dụ: 12"
                  min="1"
                  max="50"
                  disabled={modalMode === 'edit'}
                  className={`w-full px-4 py-3 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                    modalMode === 'edit' 
                      ? 'bg-gray-700/50 cursor-not-allowed' 
                      : 'bg-primary/80 focus:border-accent focus:ring-2 focus:ring-accent/50'
                  }`}
                  required
                />
              </div>

              {/* Tổng số ghế tối đa (auto calculate) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tổng số ghế tối đa</label>
                <input
                  type="number"
                  name="totalSeats"
                  value={formData.totalSeats}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-400 cursor-not-allowed"
                  placeholder="Tự động tính"
                />
                {modalMode === 'add' && (
                  <p className="text-xs text-gray-500 mt-1">Tự động tính = Số hàng × Số cột</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl transition-all shadow-lg shadow-blue-600/25 font-medium"
                >
                  {modalMode === 'add' ? 'Thêm' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Seat Layout Management Modal */}
      {showSeatModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-2xl shadow-2xl w-full max-w-7xl border border-gray-700/50 animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50 sticky top-0 bg-secondary z-10">
              <div>
                <h2 className="text-xl font-bold text-white">Quản lý sơ đồ ghế - {selectedRoom.name}</h2>
                <p className="text-sm text-gray-400 mt-1">Click vào ghế để thay đổi loại ghế</p>
              </div>
              <button
                onClick={() => setShowSeatModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-primary/50 rounded-lg"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Legend */}
              <div className="flex flex-wrap gap-4 justify-center p-4 bg-primary/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-md"></div>
                  <span className="text-sm text-white">Ghế Standard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-500 rounded-md"></div>
                  <span className="text-sm text-white">Ghế VIP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-pink-500 rounded-md"></div>
                  <span className="text-sm text-white">Ghế Couple</span>
                </div>
              </div>

              {/* Screen */}
              <div className="text-center">
                <div className="inline-block px-32 py-3 bg-gradient-to-b from-gray-600 to-gray-700 rounded-t-3xl text-white text-sm font-medium shadow-lg">
                  MÀN HÌNH
                </div>
              </div>

              {/* Seat Grid */}
              <div className="overflow-x-auto pb-4">
                <div className="flex justify-center">
                  <div className="inline-block">
                    {selectedRoom.seatLayout?.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2 mb-2 items-center">
                      {/* Row Label */}
                      <div className="w-8 text-center text-gray-400 font-medium">
                        {String.fromCharCode(65 + rowIndex)}
                      </div>
                      
                      {/* Seats */}
                      {row.map((seat, colIndex) => (
                        <button
                          key={`${rowIndex}-${colIndex}`}
                          onClick={() => handleSeatClick(rowIndex, colIndex)}
                          className={`w-10 h-10 rounded-md transition-all flex items-center justify-center text-white text-xs font-medium ${getSeatColor(seat)}`}
                          title={`Hàng ${String.fromCharCode(65 + rowIndex)}, Cột ${colIndex + 1}`}
                        >
                          {colIndex + 1}
                        </button>
                      ))}
                      
                      {/* Row Edit Button with Dropdown */}
                      <div className="relative ml-2">
                        <button
                          onClick={() => setEditingRow(editingRow === rowIndex ? null : rowIndex)}
                          className="w-10 h-10 bg-green-600 hover:bg-green-700 rounded-md transition-all flex items-center justify-center text-white"
                          title={`Chỉnh sửa hàng ${String.fromCharCode(65 + rowIndex)}`}
                        >
                          <FaEdit size={14} />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {editingRow === rowIndex && (
                          <div className="absolute right-full top-0 mr-2 bg-secondary border border-gray-600 rounded-lg shadow-xl z-20 min-w-[180px] animate-scale-in">
                            <button
                              onClick={() => handleRowEdit(rowIndex, 'standard')}
                              className="w-full px-4 py-2 text-left text-white hover:bg-blue-500/20 flex items-center gap-2 border-b border-gray-700 transition-colors"
                            >
                              <div className="w-6 h-6 bg-blue-500 rounded"></div>
                              <span>Ghế Standard</span>
                            </button>
                            <button
                              onClick={() => handleRowEdit(rowIndex, 'vip')}
                              className="w-full px-4 py-2 text-left text-white hover:bg-red-500/20 flex items-center gap-2 border-b border-gray-700 transition-colors"
                            >
                              <div className="w-6 h-6 bg-red-500 rounded"></div>
                              <span>Ghế VIP</span>
                            </button>
                            <button
                              onClick={() => handleRowEdit(rowIndex, 'couple')}
                              className="w-full px-4 py-2 text-left text-white hover:bg-pink-500/20 flex items-center gap-2 transition-colors"
                            >
                              <div className="w-6 h-6 bg-pink-500 rounded"></div>
                              <span>Ghế Couple</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-primary/50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {selectedRoom.seatLayout?.flat().filter(s => s.type === 'standard').length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Ghế Standard</div>
                </div>
                <div className="bg-primary/50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {selectedRoom.seatLayout?.flat().filter(s => s.type === 'vip').length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Ghế VIP</div>
                </div>
                <div className="bg-primary/50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-pink-400">
                    {selectedRoom.seatLayout?.flat().filter(s => s.type === 'couple').length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Ghế Couple</div>
                </div>
                <div className="bg-primary/50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-white">
                    {selectedRoom.seatLayout?.flat().length || 0}/{selectedRoom.maxSeats}
                  </div>
                  <div className="text-sm text-gray-400">Tổng ghế</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSeatModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveSeatLayout}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-xl transition-all shadow-lg shadow-purple-600/25 font-medium"
                >
                  Lưu sơ đồ ghế
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
