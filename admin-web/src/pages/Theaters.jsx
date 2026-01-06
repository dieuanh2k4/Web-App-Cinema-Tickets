import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSyncAlt, FaEye } from 'react-icons/fa';
import theaterService from '../services/theaterService';
import { useAuth } from '../hooks/useAuth';

const Theaters = () => {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 10;

  // Load theaters from API
  useEffect(() => {
    loadTheaters();
  }, []);

  const loadTheaters = async () => {
    try {
      setLoading(true);
      const data = await theaterService.getAllTheaters();
      setTheaters(data || []);
    } catch (error) {
      console.error('Error loading theaters:', error);
      alert('Không thể tải danh sách rạp chiếu. Vui lòng thử lại sau.');
      setTheaters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTheaters();
    setIsRefreshing(false);
  };

  // Form state - BE has: name, address, city
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: ''
  });

  // Pagination
  const totalPages = Math.ceil(theaters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTheaters = theaters.slice(startIndex, startIndex + itemsPerPage);

  const handleAdd = () => {
    setModalMode('add');
    setFormData({
      name: '',
      address: '',
      city: ''
    });
    setShowModal(true);
  };

  const handleEdit = (theater) => {
    setModalMode('edit');
    setSelectedTheater(theater);
    setFormData({
      name: theater.name || '',
      address: theater.address || '',
      city: theater.city || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa rạp chiếu này?')) {
      try {
        await theaterService.deleteTheater(id);
        await loadTheaters();
        alert('Xóa rạp chiếu thành công!');
      } catch (error) {
        console.error('Error deleting theater:', error);
        alert('Không thể xóa rạp chiếu. Vui lòng thử lại sau.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.city) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const theaterData = {
        name: formData.name,
        address: formData.address,
        city: formData.city
      };

      console.log('Saving theater:', modalMode, theaterData);

      if (modalMode === 'add') {
        const result = await theaterService.createTheater(theaterData);
        console.log('Theater created:', result);
      } else {
        console.log('Updating theater ID:', selectedTheater.id);
        const result = await theaterService.updateTheater(selectedTheater.id, theaterData);
        console.log('Theater updated:', result);
      }

      await loadTheaters();
      setShowModal(false);
      alert(modalMode === 'add' ? 'Thêm rạp chiếu thành công!' : 'Cập nhật rạp chiếu thành công!');
    } catch (error) {
      console.error('Error saving theater:', error);
      console.error('Error details:', error.message, error.status);
      alert('Không thể lưu rạp chiếu. Vui lòng thử lại sau.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý rạp chiếu</h1>
          <p className="text-gray-400">Quản lý thông tin các rạp chiếu</p>
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
          {isAdmin && (
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FaPlus />
              <span>Tạo rạp chiếu</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-secondary via-secondary to-secondary/50 rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary/50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tên rạp</th>
                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Địa chỉ</th>
                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Thành phố</th>
                <th className="px-8 py-5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {currentTheaters.map((theater) => (
                <tr key={theater.id} className="hover:bg-primary/30 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-white font-medium">{theater.name}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-gray-300">{theater.address}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-gray-300">{theater.city}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2">
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleEdit(theater)}
                            className="p-2 text-blue-400 hover:bg-blue-600/20 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(theater.id)}
                            className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <FaTrash size={18} />
                          </button>
                        </>
                      )}
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
              Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, theaters.length)} trong {theaters.length} rạp
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
                {modalMode === 'add' ? 'Tạo rạp chiếu' : 'Cập nhật rạp chiếu'}
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
              {/* Tên rạp */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tên rạp</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên rạp"
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                />
              </div>

              {/* Địa chỉ */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ"
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                />
              </div>

              {/* Thành phố */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Thành phố</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Nhập thành phố"
                  className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  required
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

export default Theaters;
