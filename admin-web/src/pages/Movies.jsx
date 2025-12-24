import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaSyncAlt } from 'react-icons/fa';
import { movies as initialMovies } from '../data/mockData';
import { formatDate } from '../utils/helpers';

const Movies = () => {
  const [movies, setMovies] = useState(initialMovies);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const handleRefresh = () => {
    setIsRefreshing(true);
    // TODO: Load data from DB
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('Movies data refreshed');
    }, 1000);
  };

  // Get unique years and genres for filters
  const years = [...new Set(movies.map(m => m.releaseYear))].sort((a, b) => b - a);
  const allGenres = [...new Set(movies.flatMap(m => m.genre))].sort();

  // Filter movies
  const filteredMovies = movies.filter(movie => {
    const matchSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       movie.originalTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       movie.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchYear = !filterYear || movie.releaseYear.toString() === filterYear;
    const matchGenre = !filterGenre || movie.genre.includes(filterGenre);
    const matchStatus = !filterStatus || movie.status === filterStatus;
    
    return matchSearch && matchYear && matchGenre && matchStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMovies = filteredMovies.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      setMovies(movies.filter(m => m.id !== id));
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterYear('');
    setFilterGenre('');
    setFilterStatus('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-3">Quản lý phim</h1>
          <p className="text-gray-400 text-sm lg:text-base">Danh sách tất cả các phim trong hệ thống</p>
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
          <Link
            to="/movies/add"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FaPlus />
            <span>Tạo phim</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-secondary rounded-lg p-8 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên phim, đạo diễn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
            >
              <option value="">Năm phát hành</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Genre Filter */}
          <div>
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="w-full px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
            >
              <option value="">Thể loại</option>
              {allGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
          >
            <option value="">Trạng thái</option>
            <option value="showing">Đang chiếu</option>
            <option value="coming-soon">Sắp chiếu</option>
          </select>

          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-secondary rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-medium text-gray-400 uppercase">Tên phim</th>
                <th className="px-8 py-4 text-center text-xs font-medium text-gray-400 uppercase">Năm</th>
                <th className="px-8 py-4 text-center text-xs font-medium text-gray-400 uppercase">Thể loại</th>
                <th className="px-8 py-4 text-center text-xs font-medium text-gray-400 uppercase">Thời lượng</th>
                <th className="px-8 py-4 text-center text-xs font-medium text-gray-400 uppercase">Lịch chiếu</th>
                <th className="px-8 py-4 text-center text-xs font-medium text-gray-400 uppercase">Trạng thái</th>
                <th className="px-8 py-4 text-center text-xs font-medium text-gray-400 uppercase">Ngày tạo</th>
                <th className="px-8 py-4 text-center text-xs font-medium text-gray-400 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentMovies.map((movie) => (
                <tr key={movie.id} className="hover:bg-primary/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                        {movie.poster ? (
                          <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <FaEye />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{movie.title}</p>
                        <p className="text-sm text-gray-400">{movie.originalTitle}</p>
                        <p className="text-xs text-gray-500">{movie.director}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center text-white">{movie.releaseYear}</td>
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {movie.genre.slice(0, 2).map((g, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded">
                          {g}
                        </span>
                      ))}
                      {movie.genre.length > 2 && (
                        <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
                          +{movie.genre.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center text-white">{movie.duration} phút</td>
                  <td className="px-8 py-5 text-center">
                    <span className="px-3 py-1 bg-orange-600/20 text-orange-400 text-sm rounded-full">
                      Xem lịch
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      movie.status === 'showing' 
                        ? 'bg-green-600/20 text-green-400' 
                        : 'bg-yellow-600/20 text-yellow-400'
                    }`}>
                      {movie.status === 'showing' ? 'Đang chiếu' : 'Sắp chiếu'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center text-gray-400 text-sm">
                    {formatDate(new Date())}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/movies/edit/${movie.id}`)}
                        className="p-2 text-blue-400 hover:bg-blue-600/20 rounded transition-colors"
                        title="Sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="p-2 text-red-400 hover:bg-red-600/20 rounded transition-colors"
                        title="Xóa"
                      >
                        <FaTrash />
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
          <div className="px-8 py-5 border-t border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredMovies.length)} trong {filteredMovies.length} phim
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
              >
                Trước
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? 'bg-accent text-white'
                      : 'bg-primary text-white hover:bg-accent'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
