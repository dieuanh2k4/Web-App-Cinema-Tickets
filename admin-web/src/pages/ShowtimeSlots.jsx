import { useState } from 'react';
import { FaPlus, FaSyncAlt, FaTimes, FaFilm, FaClock } from 'react-icons/fa';
import { showtimeSlots as initialSlots, movies, rooms } from '../data/mockData';
import { formatDate } from '../utils/helpers';

const ShowtimeSlots = () => {
  const [slots, setSlots] = useState(initialSlots);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState({
    movieId: '',
    roomId: '',
    date: '',
    time: '',
    format: '',
    version: '',
    slotType: ''
  });

  const formats = ['2D', '3D', 'IMAX'];
  const versions = [
    { value: 'subtitle', label: 'Phụ đề' },
    { value: 'dubbed', label: 'Lồng tiếng' },
    { value: 'voiceover', label: 'Thuyết minh' }
  ];
  const slotTypes = [
    { value: 'scheduled', label: 'Theo lịch' },
    { value: 'special', label: 'Đặc biệt' }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    // TODO: Load data from DB
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('Showtime slots data refreshed');
    }, 1000);
  };

  const handleAdd = () => {
    setFormData({
      movieId: '',
      roomId: '',
      date: '',
      time: '',
      format: '',
      version: '',
      slotType: ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.movieId || !formData.roomId || !formData.date || !formData.time || 
        !formData.format || !formData.version || !formData.slotType) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const movie = movies.find(m => m.id === parseInt(formData.movieId));
    const room = rooms.find(r => r.id === parseInt(formData.roomId));
    const today = new Date().toISOString().split('T')[0];
    const slotDateTime = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    
    let status = 'upcoming';
    if (slotDateTime < now) {
      status = 'completed';
    } else if (formData.date === today) {
      const currentTime = now.toTimeString().slice(0, 5);
      if (formData.time <= currentTime) {
        status = 'ongoing';
      }
    }

    const newSlot = {
      id: slots.length > 0 ? Math.max(...slots.map(s => s.id)) + 1 : 1,
      movieId: parseInt(formData.movieId),
      movieTitle: movie.title,
      roomId: parseInt(formData.roomId),
      roomName: room.name,
      date: formData.date,
      time: formData.time,
      format: formData.format,
      version: formData.version,
      slotType: formData.slotType,
      status,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setSlots([...slots, newSlot]);
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getFormatBadge = (format) => {
    const badges = {
      '2D': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      '3D': 'bg-green-500/20 text-green-400 border-green-500/30',
      'IMAX': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    return badges[format] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getVersionText = (version) => {
    const text = {
      'subtitle': 'Phụ đề',
      'dubbed': 'Lồng tiếng',
      'voiceover': 'Thuyết minh'
    };
    return text[version] || version;
  };

  const getSlotTypeText = (slotType) => {
    const text = {
      'scheduled': 'Theo lịch',
      'special': 'Đặc biệt'
    };
    return text[slotType] || slotType;
  };

  const getSlotTypeBadge = (slotType) => {
    const badges = {
      'scheduled': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'special': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return badges[slotType] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getStatusText = (status) => {
    const text = {
      'upcoming': 'Sắp chiếu',
      'ongoing': 'Đang chiếu',
      'completed': 'Đã chiếu'
    };
    return text[status] || status;
  };

  const getStatusBadge = (status) => {
    const badges = {
      'upcoming': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'ongoing': 'bg-green-500/20 text-green-400 border-green-500/30',
      'completed': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return badges[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getEndTime = (startTime, movieId) => {
    const movie = movies.find(m => m.id === movieId);
    if (!movie || !movie.duration) return '';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + movie.duration;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  };

  // Pagination
  const totalPages = Math.ceil(slots.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSlots = slots.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý suất chiếu</h1>
          <p className="text-gray-400">Quản lý các suất chiếu cụ thể theo giờ</p>
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
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-accent to-purple-600 hover:from-accent/90 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg shadow-accent/25 font-medium"
          >
            <FaPlus />
            <span>Thêm suất chiếu</span>
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
                  Tên phim
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Phòng chiếu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Thời gian chiếu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Định dạng
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Phiên bản
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Loại suất chiếu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentSlots.map((slot) => (
                <tr key={slot.id} className="hover:bg-primary/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-lg flex items-center justify-center">
                        <FaFilm className="text-white" size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{slot.movieTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-white">{slot.roomName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-white">
                      <div>{formatDate(slot.date)}</div>
                      <div className="text-gray-400 text-xs mt-1">
                        {slot.time} - {getEndTime(slot.time, slot.movieId)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getFormatBadge(slot.format)}`}>
                      {slot.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-white">{getVersionText(slot.version)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getSlotTypeBadge(slot.slotType)}`}>
                      {getSlotTypeText(slot.slotType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(slot.status)}`}>
                      {getStatusText(slot.status)}
                    </span>
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
              Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, slots.length)} trong tổng số {slots.length} suất chiếu
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

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700/50 animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50 sticky top-0 bg-secondary z-10">
              <h2 className="text-xl font-bold text-white">Thêm suất chiếu</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-primary/50 rounded-lg"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Chọn phim */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Chọn phim</label>
                <select
                  name="movieId"
                  value={formData.movieId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                >
                  <option value="">Chọn phim</option>
                  {movies.filter(m => m.status === 'showing').map(movie => (
                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                  ))}
                </select>
              </div>

              {/* Chọn phòng chiếu */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Chọn phòng chiếu</label>
                <select
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                >
                  <option value="">Chọn phòng</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.name} - {room.type} ({room.totalSeats} ghế)
                    </option>
                  ))}
                </select>
              </div>

              {/* Ngày và Giờ */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ngày chiếu</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Giờ chiếu</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Định dạng */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Định dạng chiếu</label>
                <select
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                >
                  <option value="">Chọn định dạng</option>
                  {formats.map(format => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>

              {/* Phiên bản */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phiên bản</label>
                <select
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                >
                  <option value="">Chọn phiên bản</option>
                  {versions.map(version => (
                    <option key={version.value} value={version.value}>{version.label}</option>
                  ))}
                </select>
              </div>

              {/* Loại suất chiếu */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Loại suất chiếu</label>
                <select
                  name="slotType"
                  value={formData.slotType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                >
                  <option value="">Chọn loại suất chiếu</option>
                  {slotTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
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
                  Thêm suất chiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowtimeSlots;
