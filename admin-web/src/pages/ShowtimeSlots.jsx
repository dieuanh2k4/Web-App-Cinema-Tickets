import { useState, useEffect } from 'react';
import { FaPlus, FaSyncAlt, FaTimes, FaFilm, FaClock } from 'react-icons/fa';
import { formatDate } from '../utils/helpers';
import showtimeService from '../services/showtimeService';
import movieService from '../services/movieService';

const ShowtimeSlots = () => {
  const [slots, setSlots] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;

  // Form state - BE ShowtimeDto has: id, start (TimeOnly), end (TimeOnly), movieTitle, roomType, roomName, theaterName, date (DateOnly), movieId, roomId
  const [formData, setFormData] = useState({
    movieId: '',
    roomId: '',
    date: '',
    time: ''
  });

  // Load data from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [showtimesData, moviesData] = await Promise.all([
        showtimeService.getAllShowtimes(),
        movieService.getAllMovies()
      ]);
      setSlots(showtimesData || []);
      setMovies(moviesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      setSlots([]);
      setMovies([]);
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
    setFormData({
      movieId: '',
      roomId: '',
      date: '',
      time: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.movieId || !formData.roomId || !formData.date || !formData.time) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      // BE expects CreateShowtimeDto with Start (TimeOnly), Date (DateOnly)
      const showtimeData = {
        movieId: parseInt(formData.movieId),
        start: formData.time, // TimeOnly format HH:mm
        date: formData.date // DateOnly format YYYY-MM-DD
      };

      await showtimeService.createShowtime(showtimeData, parseInt(formData.roomId));
      await loadData();
      setShowModal(false);
      alert('Thêm suất chiếu thành công!');
    } catch (error) {
      console.error('Error creating showtime:', error);
      alert('Không thể tạo suất chiếu. Vui lòng thử lại sau.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (slot) => {
    // Determine status based on date and time
    const today = new Date();
    const slotDate = new Date(slot.date);
    
    if (slotDate < today) {
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    } else if (slotDate.toDateString() === today.toDateString()) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    } else {
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusText = (slot) => {
    const today = new Date();
    const slotDate = new Date(slot.date);
    
    if (slotDate < today) {
      return 'Đã chiếu';
    } else if (slotDate.toDateString() === today.toDateString()) {
      return 'Đang chiếu';
    } else {
      return 'Sắp chiếu';
    }
  };

  const parseTimeOnly = (timeOnlyStr) => {
    // TimeOnly from BE might be "14:30:00" or "14:30"
    if (!timeOnlyStr) return '';
    return timeOnlyStr.substring(0, 5); // Get HH:mm
  };

  const getEndTime = (startTime, endTime) => {
    // If BE provides end time, use it
    if (endTime) {
      return parseTimeOnly(endTime);
    }
    return '';
  };

  // Pagination
  const totalPages = Math.ceil(slots.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSlots = slots.slice(startIndex, startIndex + itemsPerPage);

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
                  Rạp
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentSlots.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    Không có suất chiếu nào
                  </td>
                </tr>
              ) : (
                currentSlots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-primary/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-lg flex items-center justify-center">
                          <FaFilm className="text-white" size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{slot.movieTitle || 'N/A'}</div>
                          <div className="text-xs text-gray-400">{slot.theaterName || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div>
                        <span className="text-sm text-white">{slot.rooomName || slot.roomName || 'N/A'}</span>
                        {slot.roomType && (
                          <div className="text-xs text-gray-400 mt-1">{slot.roomType}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-white">
                        <div>{slot.date ? formatDate(new Date(slot.date)) : 'N/A'}</div>
                        <div className="text-gray-400 text-xs mt-1">
                          {parseTimeOnly(slot.start)}
                          {slot.end && ` - ${parseTimeOnly(slot.end)}`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full border bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {slot.roomType || '2D'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-400">-</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(slot)}`}>
                        {getStatusText(slot)}
                      </span>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Chọn phim *</label>
                <select
                  name="movieId"
                  value={formData.movieId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                >
                  <option value="">Chọn phim</option>
                  {movies.map(movie => (
                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                  ))}
                </select>
              </div>

              {/* Chọn phòng chiếu */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mã phòng chiếu *</label>
                <input
                  type="number"
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleChange}
                  placeholder="Nhập ID phòng chiếu (vd: 1, 2, 3...)"
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Lưu ý: Nhập ID phòng chiếu từ database</p>
              </div>

              {/* Ngày và Giờ */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ngày chiếu *</label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Giờ chiếu *</label>
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
