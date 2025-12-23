import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiUser,
  FiMenu,
  FiX,
  FiClock,
  FiStar,
  FiFilm,
  FiUsers,
} from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { getMovies } from '../services/api';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const searchRef = useRef(null);

  const { data: movies } = useQuery({
    queryKey: ['movies'],
    queryFn: getMovies,
  });

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Phim', path: '/movies' },
    { name: 'Lịch chiếu', path: '/showtimes' },
    { name: 'Dịch vụ & Tiện ích', path: '/services' },
  ];

  // Filter movies based on search - tìm kiếm theo tên, thể loại, diễn viên, đạo diễn
  const filteredMovies = searchQuery.trim()
    ? movies
        ?.filter((movie) => {
          const query = searchQuery.toLowerCase();
          return (
            movie.title?.toLowerCase().includes(query) ||
            movie.genre?.toLowerCase().includes(query) ||
            movie.director?.toLowerCase().includes(query) ||
            movie.actors?.some((actor) => actor.toLowerCase().includes(query))
          );
        })
        .slice(0, 6)
    : [];

  // Highlight search term in text
  const highlightText = (text, query) => {
    if (!text || !query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="bg-purple/30 text-purple font-semibold">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Không redirect đến trang movies nữa, chỉ hiển thị suggestions
    // User phải click vào phim trong dropdown để xem chi tiết
    if (searchQuery.trim() && filteredMovies && filteredMovies.length > 0) {
      // Nếu chỉ có 1 kết quả, tự động mở phim đó
      if (filteredMovies.length === 1) {
        handleMovieClick(filteredMovies[0].id);
      }
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  return (
    <header className="bg-dark/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-custom/30">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group flex-shrink-0"
          >
            <div className="w-12 h-12 bg-purple rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-2xl font-bold">C</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">
              CINE<span className="text-purple">BOOK</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-300 hover:text-white text-[15px] font-medium transition-colors relative group whitespace-nowrap"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Search & Auth */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="bg-dark-light text-white pl-10 pr-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple/50 transition-all"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </form>

              {/* Search Suggestions Dropdown - Enhanced with detailed info */}
              {showSuggestions && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-dark-light border border-purple/30 rounded-xl shadow-2xl shadow-purple/20 z-50 max-h-[600px] overflow-y-auto">
                  {filteredMovies && filteredMovies.length > 0 ? (
                    <>
                      <div className="p-3 border-b border-gray-custom/50">
                        <p className="text-xs text-gray-400">
                          Tìm thấy {filteredMovies.length} kết quả
                        </p>
                      </div>
                      {filteredMovies.map((movie) => (
                        <button
                          key={movie.id}
                          onClick={() => handleMovieClick(movie.id)}
                          className="w-full p-4 hover:bg-dark/80 transition-all duration-200 text-left border-b border-gray-custom/30 last:border-0 group"
                        >
                          <div className="flex space-x-4">
                            {/* Thumbnail */}
                            <div className="flex-shrink-0 relative overflow-hidden rounded-lg">
                              <img
                                src={movie.thumbnail}
                                alt={movie.title}
                                className="w-20 h-28 object-cover transform group-hover:scale-110 transition-transform duration-300"
                              />
                              {/* Rating Badge */}
                              {movie.rating > 0 && (
                                <div className="absolute top-1 right-1 bg-purple/90 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center space-x-1">
                                  <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                  <span className="text-xs font-bold text-white">
                                    {movie.rating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Movie Info */}
                            <div className="flex-1 min-w-0 space-y-2">
                              {/* Title */}
                              <h4 className="text-white font-bold text-base leading-tight group-hover:text-purple transition-colors">
                                {highlightText(movie.title, searchQuery)}
                              </h4>

                              {/* Genres & Status */}
                              <div className="flex items-center space-x-2 flex-wrap">
                                <div className="flex items-center space-x-1 text-xs">
                                  <FiFilm className="w-3 h-3 text-purple" />
                                  <span className="text-gray-300">
                                    {highlightText(movie.genre, searchQuery)}
                                  </span>
                                </div>
                                <span className="text-gray-600">•</span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    movie.status === 'Đang chiếu'
                                      ? 'bg-green-500/20 text-green-400'
                                      : movie.status === 'Sắp chiếu'
                                      ? 'bg-yellow-500/20 text-yellow-400'
                                      : 'bg-gray-500/20 text-gray-400'
                                  }`}
                                >
                                  {movie.status}
                                </span>
                              </div>

                              {/* Director */}
                              {movie.director && (
                                <div className="flex items-start space-x-2 text-xs">
                                  <FiUser className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-400">
                                    <span className="text-gray-500">
                                      Đạo diễn:
                                    </span>{' '}
                                    {highlightText(movie.director, searchQuery)}
                                  </span>
                                </div>
                              )}

                              {/* Actors */}
                              {movie.actors && movie.actors.length > 0 && (
                                <div className="flex items-start space-x-2 text-xs">
                                  <FiUsers className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-400 line-clamp-1">
                                    <span className="text-gray-500">
                                      Diễn viên:
                                    </span>{' '}
                                    {movie.actors
                                      .slice(0, 3)
                                      .map((actor, idx) => (
                                        <span key={idx}>
                                          {idx > 0 && ', '}
                                          {highlightText(actor, searchQuery)}
                                        </span>
                                      ))}
                                    {movie.actors.length > 3 && (
                                      <span className="text-gray-500">...</span>
                                    )}
                                  </span>
                                </div>
                              )}

                              {/* Duration & Description */}
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1 text-xs text-gray-400">
                                  <FiClock className="w-3 h-3" />
                                  <span>{movie.duration} phút</span>
                                  {movie.ageLimit && (
                                    <>
                                      <span className="text-gray-600">•</span>
                                      <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded">
                                        {movie.ageLimit}
                                      </span>
                                    </>
                                  )}
                                </div>
                                {movie.description && (
                                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                    {movie.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={handleSearch}
                        className="w-full p-3 text-center text-purple hover:bg-purple/10 transition-colors border-t border-purple/20 font-medium text-sm"
                      >
                        Xem tất cả {filteredMovies.length} kết quả →
                      </button>
                    </>
                  ) : (
                    <div className="p-8 text-center">
                      <FiSearch className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 font-medium">
                        Không tìm thấy kết quả
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Thử tìm kiếm với từ khóa khác
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {user ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 bg-purple/10 hover:bg-purple text-white px-4 py-2 rounded-lg transition-all duration-300 border border-purple/30 hover:border-purple font-semibold"
              >
                <FiUser className="w-5 h-5" />
                <span>{user.username}</span>
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/register"
                  className="text-gray-300 hover:text-white font-semibold py-2.5 px-7 rounded-lg transition-all duration-300 border-2 border-transparent hover:border-purple hover:shadow-lg hover:shadow-purple/40"
                >
                  Đăng ký
                </Link>
                <Link
                  to="/login"
                  className="text-white font-semibold py-2.5 px-7 rounded-lg transition-all duration-300 border-2 border-transparent hover:border-purple hover:shadow-lg hover:shadow-purple/40 bg-transparent hover:bg-purple/10"
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white p-2"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-custom/30">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:text-white font-medium transition-colors py-2"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-custom/30 space-y-3">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="block text-gray-300 hover:text-white py-2"
                    >
                      Tài khoản
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block text-gray-300 hover:text-white py-2"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/register"
                      className="block text-center text-gray-300 hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 border-2 border-transparent hover:border-purple hover:shadow-lg hover:shadow-purple/40"
                    >
                      Đăng ký
                    </Link>
                    <Link
                      to="/login"
                      className="block text-center text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 border-2 border-transparent hover:border-purple hover:shadow-lg hover:shadow-purple/40 bg-transparent hover:bg-purple/10"
                    >
                      Đăng nhập
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
