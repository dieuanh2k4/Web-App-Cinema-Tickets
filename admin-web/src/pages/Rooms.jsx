import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSyncAlt, FaDoorOpen, FaTimes, FaCouch } from 'react-icons/fa';
import { rooms as initialRooms } from '../data/mockData';
import { formatDate } from '../utils/helpers';

const Rooms = () => {
  const [rooms, setRooms] = useState(initialRooms);
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
    totalSeats: ''
  });

  const roomTypes = ['2D', '3D', 'IMAX'];
  const seatTypes = ['standard', 'vip', 'couple', 'disabled'];

  const handleRefresh = () => {
    setIsRefreshing(true);
    // TODO: Load data from DB
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('Rooms data refreshed');
    }, 1000);
  };

  const handleAdd = () => {
    setModalMode('add');
    setFormData({
      name: '',
      type: '',
      rows: '',
      columns: '',
      totalSeats: ''
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
      totalSeats: room.maxSeats // Show maxSeats in the form when editing
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.type || !formData.rows || !formData.columns) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const rows = parseInt(formData.rows);
    const columns = parseInt(formData.columns);
    const maxSeats = rows * columns;

    // Initialize seat layout if adding new room
    let seatLayout = [];
    if (modalMode === 'add') {
      // Create default seat layout (all standard seats)
      for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < columns; j++) {
          row.push({
            row: i,
            col: j,
            type: 'standard', // standard, vip, couple, disabled
            enabled: true
          });
        }
        seatLayout.push(row);
      }
    }

    const roomData = {
      ...formData,
      rows,
      columns,
      maxSeats: modalMode === 'add' ? maxSeats : selectedRoom.maxSeats, // Keep original maxSeats when editing
      totalSeats: modalMode === 'add' ? maxSeats : (selectedRoom.seatLayout?.flat().filter(s => s.enabled).length || selectedRoom.totalSeats),
      seatLayout: modalMode === 'add' ? seatLayout : selectedRoom.seatLayout,
      createdDate: modalMode === 'add' ? new Date().toISOString().split('T')[0] : selectedRoom.createdDate
    };

    if (modalMode === 'add') {
      const newRoom = {
        id: rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1,
        ...roomData
      };
      setRooms([...rooms, newRoom]);
    } else {
      setRooms(rooms.map(r => 
        r.id === selectedRoom.id 
          ? { ...r, ...roomData }
          : r
      ));
    }

    setShowModal(false);
  };

  const handleManageSeats = (room) => {
    setSelectedRoom(room);
    setShowSeatModal(true);
  };

  const handleSeatClick = (rowIndex, colIndex) => {
    const updatedRoom = { ...selectedRoom };
    const seat = updatedRoom.seatLayout[rowIndex][colIndex];
    
    // Cycle through seat types: standard -> vip -> couple -> disabled -> standard
    const typeOrder = ['standard', 'vip', 'couple', 'disabled'];
    const currentIndex = typeOrder.indexOf(seat.type);
    const nextIndex = (currentIndex + 1) % typeOrder.length;
    
    seat.type = typeOrder[nextIndex];
    seat.enabled = seat.type !== 'disabled';
    
    setSelectedRoom(updatedRoom);
  };

  const handleSaveSeatLayout = () => {
    // Count enabled seats
    const enabledSeats = selectedRoom.seatLayout.flat().filter(s => s.enabled).length;
    
    setRooms(rooms.map(r => 
      r.id === selectedRoom.id 
        ? { ...r, seatLayout: selectedRoom.seatLayout, totalSeats: enabledSeats }
        : r
    ));
    
    setShowSeatModal(false);
  };

  const handleRowEdit = (rowIndex, seatType) => {
    const updatedRoom = { ...selectedRoom };
    
    // Update all seats in the row
    updatedRoom.seatLayout[rowIndex].forEach(seat => {
      seat.type = seatType;
      seat.enabled = seatType !== 'disabled';
    });
    
    setSelectedRoom(updatedRoom);
    setEditingRow(null); // Close the menu after selection
  };

  const getSeatColor = (seat) => {
    if (!seat.enabled || seat.type === 'disabled') {
      return 'bg-gray-700 cursor-not-allowed opacity-50';
    }
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

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng chiếu này?')) {
      setRooms(rooms.filter(r => r.id !== id));
    }
  };

  const getRoomTypeBadge = (type) => {
    const badges = {
      '2D': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      '3D': 'bg-green-500/20 text-green-400 border-green-500/30',
      'IMAX': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    return badges[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

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
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getRoomTypeBadge(room.type)}`}>
                      Phòng {room.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-white font-medium">{room.totalSeats} ghế</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-300">{room.rows}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-300">{room.columns}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-400">{formatDate(room.createdDate)}</span>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Số hàng ghế</label>
                <input
                  type="number"
                  name="rows"
                  value={formData.rows}
                  onChange={handleChange}
                  placeholder="Ví dụ: 10"
                  min="1"
                  max="26"
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                />
              </div>

              {/* Số cột */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Số cột ghế</label>
                <input
                  type="number"
                  name="columns"
                  value={formData.columns}
                  onChange={handleChange}
                  placeholder="Ví dụ: 12"
                  min="1"
                  max="50"
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
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
                  <span className="text-sm text-white">Ghế thường</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-500 rounded-md"></div>
                  <span className="text-sm text-white">Ghế VIP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-pink-500 rounded-md"></div>
                  <span className="text-sm text-white">Ghế đôi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-700 opacity-50 rounded-md"></div>
                  <span className="text-sm text-white">Không khả dụng</span>
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
                              <span>Ghế thường</span>
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
                              className="w-full px-4 py-2 text-left text-white hover:bg-pink-500/20 flex items-center gap-2 border-b border-gray-700 transition-colors"
                            >
                              <div className="w-6 h-6 bg-pink-500 rounded"></div>
                              <span>Ghế đôi</span>
                            </button>
                            <button
                              onClick={() => handleRowEdit(rowIndex, 'disabled')}
                              className="w-full px-4 py-2 text-left text-white hover:bg-gray-700/50 flex items-center gap-2 transition-colors"
                            >
                              <div className="w-6 h-6 bg-gray-700 opacity-50 rounded"></div>
                              <span>Không khả dụng</span>
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
                    {selectedRoom.seatLayout?.flat().filter(s => s.type === 'standard' && s.enabled).length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Ghế thường</div>
                </div>
                <div className="bg-primary/50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {selectedRoom.seatLayout?.flat().filter(s => s.type === 'vip' && s.enabled).length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Ghế VIP</div>
                </div>
                <div className="bg-primary/50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-pink-400">
                    {selectedRoom.seatLayout?.flat().filter(s => s.type === 'couple' && s.enabled).length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Ghế đôi</div>
                </div>
                <div className="bg-primary/50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-white">
                    {selectedRoom.seatLayout?.flat().filter(s => s.enabled).length || 0}/{selectedRoom.maxSeats}
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
