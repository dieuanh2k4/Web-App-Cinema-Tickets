import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSyncAlt, FaDoorOpen, FaTimes } from 'react-icons/fa';
import roomService from '../services/roomService';
import theaterService from '../services/theaterService';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const itemsPerPage = 10;

  // Form state - BE CreateRoomDto: Name, Capacity, Status, TheaterId, Type
  // + query params: row, seatsInRow, normalSeats, coupleRowsSeats
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    status: 'Trống',
    theaterId: '',
    // Seat configuration
    row: '',
    seatsInRow: '',
    normalSeats: '',
    coupleRowsSeats: ''
  });

  const roomTypes = ['2D', '3D', 'IMAX'];
  const roomStatuses = ['Trống', 'Đang hoạt động', 'Bảo trì'];

  // Load data from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsData, theatersData] = await Promise.all([
        roomService.getAllRooms(),
        theaterService.getAllTheaters()
      ]);
      console.log('Rooms data from API:', roomsData);
      console.log('Sample room:', roomsData?.[0]);
      setRooms(roomsData || []);
      setTheaters(theatersData || []);
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
      type: '2D',
      capacity: '',
      status: 'Trống',
      theaterId: theaters.length > 0 ? theaters[0].id : '',
      row: '',
      seatsInRow: '',
      normalSeats: '',
      coupleRowsSeats: ''
    });
    setShowModal(true);
  };

  const handleEdit = (room) => {
    setModalMode('edit');
    setSelectedRoom(room);
    setFormData({
      name: room.name || '',
      type: room.type || '2D',
      capacity: room.capacity || '',
      status: room.status || 'Trống',
      theaterId: room.theaterId || '',
      row: '', // Cannot get original values, require re-input
      seatsInRow: '',
      normalSeats: '',
      coupleRowsSeats: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.type || !formData.capacity || !formData.theaterId || 
        !formData.row || !formData.seatsInRow || !formData.normalSeats || !formData.coupleRowsSeats) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setSubmitting(true);
    try {
      // BE expects JSON body + query params for seat configuration
      const roomData = {
        Name: formData.name,
        Capacity: parseInt(formData.capacity),
        Status: formData.status,
        TheaterId: parseInt(formData.theaterId),
        Type: formData.type
      };

      const seatConfig = {
        row: parseInt(formData.row),
        seatsInRow: parseInt(formData.seatsInRow),
        normalSeats: parseInt(formData.normalSeats),
        coupleRowsSeats: parseInt(formData.coupleRowsSeats)
      };

      if (modalMode === 'add') {
        await roomService.createRoom(roomData, seatConfig);
      } else {
        await roomService.updateRoom(selectedRoom.id, roomData, seatConfig);
      }

      await loadData();
      setShowModal(false);
      alert(modalMode === 'add' ? 'Thêm phòng chiếu thành công!' : 'Cập nhật phòng chiếu thành công!');
    } catch (error) {
      console.error('Error saving room:', error);
      alert(error.response?.data?.message || 'Không thể lưu phòng chiếu. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto calculate capacity when seat configuration changes
    if (name === 'row' || name === 'seatsInRow') {
      const row = name === 'row' ? parseInt(value) || 0 : parseInt(formData.row) || 0;
      const seatsInRow = name === 'seatsInRow' ? parseInt(value) || 0 : parseInt(formData.seatsInRow) || 0;
      setFormData(prev => ({
        ...prev,
        [name]: value,
        capacity: (row * seatsInRow).toString()
      }));
    }
  };

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
      '2D': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      '3D': 'bg-green-500/20 text-green-400 border-green-500/30',
      'IMAX': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    return badges[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getTheaterName = (theaterId) => {
    const theater = theaters.find(t => t.id === theaterId);
    return theater ? theater.name : 'N/A';
  };

  // Pagination
  const totalPages = Math.ceil(rooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRooms = rooms.slice(startIndex, startIndex + itemsPerPage);

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
                  Sức chứa
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rạp chiếu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentRooms.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    Không có phòng chiếu nào
                  </td>
                </tr>
              ) : (
                currentRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-primary/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-lg flex items-center justify-center">
                          <FaDoorOpen className="text-white" size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{room.name || 'N/A'}</div>
                          <div className="text-xs text-gray-400">ID: {room.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getRoomTypeBadge(room.type)}`}>
                        {room.type || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-white font-medium">{room.capacity || 0} ghế</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-300">{room.status || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-400">{getTheaterName(room.theaterId)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
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
                ))
              )}
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
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Tên phòng */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tên phòng *</label>
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

              {/* Loại phòng và Trạng thái */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Loại phòng *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                    required
                  >
                    {roomTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Trạng thái *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                    required
                  >
                    {roomStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rạp chiếu */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rạp chiếu *</label>
                <select
                  name="theaterId"
                  value={formData.theaterId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                >
                  <option value="">Chọn rạp chiếu</option>
                  {theaters.map(theater => (
                    <option key={theater.id} value={theater.id}>{theater.name}</option>
                  ))}
                </select>
              </div>

              {/* Cấu hình ghế */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Cấu hình ghế ngồi</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Số hàng *</label>
                    <input
                      type="number"
                      name="row"
                      value={formData.row}
                      onChange={handleChange}
                      placeholder="Vd: 10"
                      min="1"
                      className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Ghế mỗi hàng *</label>
                    <input
                      type="number"
                      name="seatsInRow"
                      value={formData.seatsInRow}
                      onChange={handleChange}
                      placeholder="Vd: 12"
                      min="1"
                      className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Số ghế thường *</label>
                    <input
                      type="number"
                      name="normalSeats"
                      value={formData.normalSeats}
                      onChange={handleChange}
                      placeholder="Vd: 80"
                      min="0"
                      className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Số ghế đôi *</label>
                    <input
                      type="number"
                      name="coupleRowsSeats"
                      value={formData.coupleRowsSeats}
                      onChange={handleChange}
                      placeholder="Vd: 20"
                      min="0"
                      className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Sức chứa (tự động tính) */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sức chứa (tự động)</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-400 cursor-not-allowed"
                    placeholder="Tự động = Số hàng × Ghế mỗi hàng"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl transition-all shadow-lg shadow-blue-600/25 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <span>{modalMode === 'add' ? 'Thêm' : 'Cập nhật'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
