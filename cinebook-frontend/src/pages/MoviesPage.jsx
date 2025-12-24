import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiSearch, FiFilter, FiStar, FiClock } from 'react-icons/fi';
import { getMovies } from '../services/api';
import MovieCard from '../components/MovieCard';

export default function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [selectedGenre, setSelectedGenre] = useState(
    searchParams.get('genre') || 'all'
  );
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get('status') || 'all'
  );
  const [sortBy, setSortBy] = useState('title');

  // Kiểm tra xem có phải từ "Xem tất cả" không (có status param trong URL)
  const isFromViewAll = searchParams.has('status');
  const statusParam = searchParams.get('status');

  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: getMovies,
  });

  // Map query params to actual status values
  useEffect(() => {
    if (statusParam === 'now-showing') {
      setSelectedStatus('Đang chiếu');
    } else if (statusParam === 'coming-soon') {
      setSelectedStatus('Sắp chiếu');
    }
  }, [statusParam]);

  // Get unique genres
  const genres = movies
    ? [
        ...new Set(
          movies.flatMap((m) => m.genre?.split(',').map((g) => g.trim()))
        ),
      ]
    : [];

  // Filter movies
  const filteredMovies =
    movies?.filter((movie) => {
      const matchSearch =
        !searchQuery ||
        movie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.director?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.actors?.some((actor) =>
          actor.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchGenre =
        selectedGenre === 'all' || movie.genre?.includes(selectedGenre);
      const matchStatus =
        selectedStatus === 'all' || movie.status === selectedStatus;

      return matchSearch && matchGenre && matchStatus;
    }) || [];

  // Sort movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'duration':
        return b.duration - a.duration;
      case 'startDate':
        return new Date(b.startDate) - new Date(a.startDate);
      default:
        return a.title.localeCompare(b.title);
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedGenre !== 'all') params.set('genre', selectedGenre);
    if (selectedStatus !== 'all') params.set('status', selectedStatus);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {isFromViewAll
              ? selectedStatus === 'Đang chiếu'
                ? 'Phim Đang Chiếu'
                : selectedStatus === 'Sắp chiếu'
                ? 'Phim Sắp Chiếu'
                : 'Danh sách phim'
              : 'Danh sách phim'}
          </h1>
          <p className="text-gray-400">
            {isFromViewAll
              ? `Khám phá các bộ phim ${selectedStatus.toLowerCase()}`
              : 'Khám phá hàng ngàn bộ phim hấp dẫn'}
          </p>
        </div>

        {/* Search & Filter - Chỉ hiển thị khi KHÔNG phải từ "Xem tất cả" */}
        {!isFromViewAll && (
          <div className="bg-dark-light rounded-xl p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search bar */}
              {/* Search bar */}
              <div className="relative">
                <FiSearch
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo tên phim, đạo diễn, diễn viên..."
                  className="w-full pl-12 pr-4 py-3 bg-dark border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Genre */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Thể loại
                  </label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full px-4 py-2 bg-dark border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white"
                  >
                    <option value="all">Tất cả</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-dark border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white"
                  >
                    <option value="all">Tất cả</option>
                    <option value="Đang chiếu">Đang chiếu</option>
                    <option value="Sắp chiếu">Sắp chiếu</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Sắp xếp theo
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 bg-dark border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white"
                  >
                    <option value="title">Tên phim</option>
                    <option value="rating">Đánh giá</option>
                    <option value="duration">Thời lượng</option>
                    <option value="startDate">Ngày khởi chiếu</option>
                  </select>
                </div>

                {/* Search button */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-purple hover:bg-purple-dark text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
                  >
                    <FiFilter className="inline mr-2" />
                    Lọc
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Tìm thấy{' '}
            <span className="text-white font-semibold">
              {sortedMovies.length}
            </span>{' '}
            phim
          </p>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
          </div>
        ) : sortedMovies.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Không tìm thấy phim nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {sortedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} showBookButton={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
