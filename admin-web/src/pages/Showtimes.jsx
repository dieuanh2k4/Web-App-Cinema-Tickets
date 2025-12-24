import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSyncAlt, FaClock, FaTimes, FaFilm } from 'react-icons/fa';
import { showtimesSchedules as initialSchedules, movies } from '../data/mockData';
import { formatDate } from '../utils/helpers';

const Showtimes = () => {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const itemsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState({
    movieId: '',
    startDate: '',
    endDate: ''
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    // TODO: Load data from DB
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('Showtimes schedules data refreshed');
    }, 1000);
  };

  const handleAdd = () => {
    setModalMode('add');
    setFormData({
      movieId: '',
      startDate: '',
      endDate: ''
    });
    setShowModal(true);
  };

  const handleEdit = (schedule) => {
    setModalMode('edit');
    setSelectedSchedule(schedule);
    setFormData({
      movieId: schedule.movieId,
      startDate: schedule.startDate,
      endDate: schedule.endDate
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.movieId || !formData.startDate || !formData.endDate) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Validate dates
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('Ngày bắt đầu phải trước ngày kết thúc!');
      return;
    }

    const movie = movies.find(m => m.id === parseInt(formData.movieId));
    const today = new Date().toISOString().split('T')[0];
    let status = 'upcoming';
    
    if (formData.startDate <= today && formData.endDate >= today) {
      status = 'active';
    } else if (formData.endDate < today) {
      status = 'ended';
    }

    const scheduleData = {
      movieId: parseInt(formData.movieId),
      movieTitle: movie.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status,
      createdDate: modalMode === 'add' ? new Date().toISOString().split('T')[0] : selectedSchedule.createdDate
    };

    if (modalMode === 'add') {
      const newSchedule = {
        id: schedules.length > 0 ? Math.max(...schedules.map(s => s.id)) + 1 : 1,
        ...scheduleData
      };
      setSchedules([...schedules, newSchedule]);
    } else {
      setSchedules(schedules.map(s => 
        s.id === selectedSchedule.id 
          ? { ...s, ...scheduleData }
          : s
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
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch chiếu này?')) {
      setSchedules(schedules.filter(s => s.id !== id));
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'active': 'bg-green-500/20 text-green-400 border-green-500/30',
      'upcoming': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'ended': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return badges[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getStatusText = (status) => {
    const text = {
      'active': 'Đang chiếu',
      'upcoming': 'Sắp chiếu',
      'ended': 'Đã kết thúc'
    };
    return text[status] || 'Không xác định';
  };

  // Pagination
  const totalPages = Math.ceil(schedules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSchedules = schedules.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý lịch chiếu</h1>
          <p className="text-gray-400">Quản lý thời gian chiếu phim</p>
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
            <span>Thêm lịch chiếu</span>
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
                  Thời gian chiếu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tình trạng
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentSchedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-primary/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-lg flex items-center justify-center">
                        <FaFilm className="text-white" size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{schedule.movieTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-white">
                      {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(schedule.status)}`}>
                      {getStatusText(schedule.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                        title="Cập nhật"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
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
              Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, schedules.length)} trong tổng số {schedules.length} lịch chiếu
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
                {modalMode === 'add' ? 'Thêm lịch chiếu' : 'Cập nhật lịch chiếu'}
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
                  {movies.filter(m => m.status === 'showing').map(movie => (
                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                  ))}
                </select>
              </div>

              {/* Ngày bắt đầu */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ngày bắt đầu</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                />
              </div>

              {/* Ngày kết thúc */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ngày kết thúc</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                />
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
