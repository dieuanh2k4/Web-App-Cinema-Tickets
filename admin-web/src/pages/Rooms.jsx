import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSyncAlt, FaDoorOpen, FaTimes } from 'react-icons/fa';
import { rooms as initialRooms } from '../data/mockData';
import { formatDate } from '../utils/helpers';

const Rooms = () => {
  const [rooms, setRooms] = useState(initialRooms);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedRoom, setSelectedRoom] = useState(null);
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
      totalSeats: room.totalSeats
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.type || !formData.rows || !formData.columns) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const roomData = {
      ...formData,
      rows: parseInt(formData.rows),
      columns: parseInt(formData.columns),
      totalSeats: parseInt(formData.rows) * parseInt(formData.columns),
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
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                />
              </div>

              {/* Tổng số ghế (auto calculate) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tổng số ghế</label>
                <input
                  type="number"
                  name="totalSeats"
                  value={formData.totalSeats}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-400 cursor-not-allowed"
                  placeholder="Tự động tính"
                />
                <p className="text-xs text-gray-500 mt-1">Tự động tính = Số hàng × Số cột</p>
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
    </div>
  );
};

export default Rooms;
