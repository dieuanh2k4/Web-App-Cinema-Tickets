import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSyncAlt, FaTimes, FaFilm } from 'react-icons/fa';
import { formatDate } from '../utils/helpers';
import showtimeService from '../services/showtimeService';
import movieService from '../services/movieService';
import roomService from '../services/roomService';

const Showtimes = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null); // Lưu phim được chọn để validate date
  const itemsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState({
    movieId: '',
    roomId: '',
    date: '',
    start: ''
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [showtimesData, moviesData, roomsData] = await Promise.all([
        showtimeService.getAllShowtimes(),
        movieService.getAllMovies(),
        roomService.getAllRooms()
      ]);
      setShowtimes(showtimesData);
      setMovies(moviesData);
      setRooms(roomsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Không thể tải dữ liệu. Vui lòng thử lại!');
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
    setSelectedMovie(null);
    setFormData({
      movieId: '',
      roomId: '',
      date: '',
      start: ''
    });
    setShowModal(true);
  };

  const handleEdit = (showtime) => {
    setModalMode('edit');
    setSelectedShowtime(showtime);
    
    // Tìm và set phim được chọn để validate date
    const movie = movies.find(m => m.id === showtime.movieId);
    setSelectedMovie(movie);
    
    // Format time từ HH:mm:ss thành HH:mm cho input type="time"
    const formatTimeForInput = (time) => {
      if (!time) return '';
      // Nếu có seconds (HH:mm:ss), loại bỏ để chỉ giữ HH:mm
      return time.length > 5 ? time.substring(0, 5) : time;
    };
    
    const editFormData = {
      movieId: String(showtime.movieId), // Ensure string type
      roomId: String(showtime.roomId),   // Ensure string type
      date: showtime.date,
      start: formatTimeForInput(showtime.start)
    };
    
    console.log('Edit showtime:', showtime);
    console.log('Edit formData:', editFormData);
    console.log('Available movies:', movies.map(m => ({ id: m.id, title: m.title })));
    console.log('Available rooms:', rooms.map(r => ({ id: r.id, name: r.name })));
    
    setFormData(editFormData);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.movieId || !formData.roomId || !formData.date || !formData.start) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Validate ngày chiếu phải nằm trong khoảng StartDate và EndDate của phim
    const movie = movies.find(m => m.id === parseInt(formData.movieId));
    if (movie) {
      const selectedDate = new Date(formData.date);
      selectedDate.setHours(0, 0, 0, 0); // Reset time để so sánh chỉ date
      
      // Backend sử dụng startDate và endDate
      const startDate = movie.startDate ? new Date(movie.startDate.split('T')[0]) : null;
      const endDate = movie.endDate ? new Date(movie.endDate.split('T')[0]) : null;
      
      if (startDate) startDate.setHours(0, 0, 0, 0);
      if (endDate) endDate.setHours(0, 0, 0, 0);
      
      if (startDate && selectedDate < startDate) {
        alert(`Ngày chiếu không được trước ngày khởi chiếu của phim (${movie.startDate.split('T')[0]})!`);
        return;
      }
      
      if (endDate && selectedDate > endDate) {
        alert(`Ngày chiếu không được sau ngày kết thúc chiếu của phim (${movie.endDate.split('T')[0]})!`);
        return;
      }
    }

    try {
      // Thêm seconds vào time format (HH:mm -> HH:mm:ss) vì Backend TimeOnly yêu cầu
      const formatTime = (time) => time.includes(':') && time.split(':').length === 2 ? `${time}:00` : time;
      
      const showtimeData = {
        movieId: parseInt(formData.movieId),
        roomId: parseInt(formData.roomId),
        date: formData.date,
        start: formatTime(formData.start),
        end: formatTime(formData.start) // Backend sẽ tự động tính lại End dựa vào Duration của phim
      };

      // Debug log để kiểm tra data
      console.log('Sending showtime data:', showtimeData);

      if (modalMode === 'add') {
        await showtimeService.createShowtime(showtimeData, parseInt(formData.roomId));
        alert('Thêm suất chiếu thành công!');
      } else {
        await showtimeService.updateShowtime(selectedShowtime.id, showtimeData, parseInt(formData.roomId));
        alert('Cập nhật suất chiếu thành công!');
      }

      setShowModal(false);
      await loadData();
    } catch (error) {
      console.error('Error saving showtime:', error);
      alert(error.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Khi chọn phim, lưu thông tin phim để validate date
    if (name === 'movieId' && value) {
      const movie = movies.find(m => m.id === parseInt(value));
      setSelectedMovie(movie);
      
      // Reset date nếu đã chọn date không hợp lệ
      if (formData.date && movie) {
        const selectedDate = new Date(formData.date);
        selectedDate.setHours(0, 0, 0, 0); // Reset time để so sánh chỉ date
        
        // Backend sử dụng startDate và endDate, không phải releaseDate
        const startDate = movie.startDate ? new Date(movie.startDate.split('T')[0]) : null;
        const endDate = movie.endDate ? new Date(movie.endDate.split('T')[0]) : null;
        
        if (startDate) startDate.setHours(0, 0, 0, 0);
        if (endDate) endDate.setHours(0, 0, 0, 0);
        
        if ((startDate && selectedDate < startDate) || (endDate && selectedDate > endDate)) {
          setFormData(prev => ({ ...prev, [name]: value, date: '' }));
          return;
        }
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa suất chiếu này?')) {
      try {
        await showtimeService.deleteShowtime(id);
        alert('Xóa suất chiếu thành công!');
        await loadData();
      } catch (error) {
        console.error('Error deleting showtime:', error);
        alert('Không thể xóa suất chiếu. Vui lòng thử lại!');
      }
    }
  };

  // Pagination
  const totalPages = Math.ceil(showtimes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentShowtimes = showtimes.slice(startIndex, startIndex + itemsPerPage);

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
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý suất chiếu</h1>
          <p className="text-gray-400">Quản lý các suất chiếu cụ thể</p>
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
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tên phim
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rạp chiếu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Phòng chiếu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ngày chiếu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Giờ chiếu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentShowtimes.map((showtime) => (
                <tr key={showtime.id} className="hover:bg-primary/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-white">#{showtime.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-lg flex items-center justify-center">
                        <FaFilm className="text-white" size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{showtime.movieTitle || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-400">{showtime.theaterName || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-white">
                      <div>{showtime.roomName || 'N/A'}</div>
                      {showtime.roomType && (
                        <div className="text-xs text-gray-400 mt-1">({showtime.roomType})</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-white">{formatDate(showtime.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-white">
                      <div>{showtime.start}</div>
                      {showtime.end && (
                        <div className="text-xs text-gray-400 mt-1">→ {showtime.end}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(showtime)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                        title="Cập nhật"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(showtime.id)}
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
              Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, showtimes.length)} trong tổng số {showtimes.length} suất chiếu
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <h2 className="text-xl font-bold text-white">
                {modalMode === 'add' ? 'Thêm suất chiếu' : 'Cập nhật suất chiếu'}
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
                  {movies.map(movie => (
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
                      {room.name} - {room.type} ({room.capacity} ghế)
                    </option>
                  ))}
                </select>
              </div>

              {/* Ngày chiếu */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ngày chiếu</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={selectedMovie?.startDate ? selectedMovie.startDate.split('T')[0] : undefined}
                  max={selectedMovie?.endDate ? selectedMovie.endDate.split('T')[0] : undefined}
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                />
                {selectedMovie && (selectedMovie.startDate || selectedMovie.endDate) && (
                  <p className="text-xs text-gray-400 mt-2">
                    {selectedMovie.startDate && `Từ: ${selectedMovie.startDate.split('T')[0]}`}
                    {selectedMovie.startDate && selectedMovie.endDate && ' | '}
                    {selectedMovie.endDate && `Đến: ${selectedMovie.endDate.split('T')[0]}`}
                  </p>
                )}
              </div>

              {/* Giờ bắt đầu */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Giờ bắt đầu</label>
                <input
                  type="time"
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                />
                <p className="text-xs text-gray-400 mt-2">
                  * Giờ kết thúc sẽ được tính tự động dựa vào thời lượng phim
                </p>
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

export default Showtimes;
