import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUpload, FaTimes } from 'react-icons/fa';
import { movies as initialMovies } from '../data/mockData';

const EditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Initialize formData directly from movie lookup
  const movie = initialMovies.find(m => m.id === parseInt(id));
  const [formData, setFormData] = useState(() => {
    if (!movie) {
      return null;
    }
    return movie;
  });
  
  const [genreInput, setGenreInput] = useState('');
  const [errors, setErrors] = useState({});

  const availableGenres = ['Animation', 'Adventure', 'Drama', 'Fantasy', 'Romance', 'Family', 'Action', 'Comedy', 'Thriller', 'Horror', 'Sci-Fi', 'War'];

  useEffect(() => {
    // Redirect if movie not found
    if (!movie) {
      alert('Không tìm thấy phim!');
      navigate('/movies');
    }
  }, [movie, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddGenre = (genre) => {
    if (genre && !formData.genre.includes(genre)) {
      setFormData(prev => ({
        ...prev,
        genre: [...prev.genre, genre]
      }));
      setGenreInput('');
    }
  };

  const handleRemoveGenre = (genreToRemove) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.filter(g => g !== genreToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Vui lòng nhập tên phim';
    if (!formData.originalTitle.trim()) newErrors.originalTitle = 'Vui lòng nhập tên phim gốc';
    if (!formData.director.trim()) newErrors.director = 'Vui lòng nhập đạo diễn';
    if (formData.genre.length === 0) newErrors.genre = 'Vui lòng chọn ít nhất 1 thể loại';
    if (!formData.duration || formData.duration <= 0) newErrors.duration = 'Vui lòng nhập thời lượng hợp lệ';
    if (!formData.releaseYear || formData.releaseYear < 1900) newErrors.releaseYear = 'Năm phát hành không hợp lệ';
    if (!formData.description.trim()) newErrors.description = 'Vui lòng nhập mô tả';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Update movie (in real app, this would be an API call)
    const updatedMovie = {
      ...formData,
      duration: parseInt(formData.duration),
      releaseYear: parseInt(formData.releaseYear),
      imdbRating: parseFloat(formData.imdbRating) || 0
    };

    console.log('Updated movie:', updatedMovie);
    alert('Phim đã được cập nhật thành công!');
    navigate('/movies');
  };

  if (!formData) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/movies"
          className="p-2.5 hover:bg-secondary rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          <FaArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white mb-3">Chỉnh sửa phim</h1>
          <p className="text-gray-400 text-sm lg:text-base">Cập nhật thông tin phim: {formData.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-secondary rounded-lg border border-gray-700 overflow-hidden">
            <div className="flex border-b border-gray-700">
              <button
                type="button"
                className="px-6 py-3.5 bg-primary text-white font-medium border-b-2 border-accent"
              >
                Thông tin phim
              </button>
              <button
                type="button"
                className="px-6 py-3.5 text-gray-400 hover:text-white hover:bg-primary/50 transition-colors"
                disabled
              >
                Danh giá phim (0)
              </button>
            </div>

            <div className="p-8 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Tên phim <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-primary border ${errors.title ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-accent`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Original Title */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Tên phim (tiếng anh) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="originalTitle"
                  value={formData.originalTitle}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-primary border ${errors.originalTitle ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-accent`}
                />
                {errors.originalTitle && <p className="text-red-500 text-sm mt-1">{errors.originalTitle}</p>}
              </div>

              {/* Trailer */}
              <div>
                <label className="block text-white font-medium mb-2">Trailer</label>
                <input
                  type="url"
                  name="trailer"
                  value={formData.trailer}
                  onChange={handleChange}
                  placeholder="https://youtube.com/..."
                  className="w-full px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full px-4 py-2 bg-primary border ${errors.description ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-accent`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Grid Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Duration */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Độ tuổi xem phim <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
                  >
                    <option>Chọn độ tuổi</option>
                    <option>P - Phổ biến</option>
                    <option>T13 - Trên 13 tuổi</option>
                    <option>T16 - Trên 16 tuổi</option>
                    <option>T18 - Trên 18 tuổi</option>
                  </select>
                </div>

                {/* Release Date */}
                <div>
                  <label className="block text-white font-medium mb-2">Ngày chiếu</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Release Year */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Năm phát hành <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="releaseYear"
                    value={formData.releaseYear}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-primary border ${errors.releaseYear ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-accent`}
                  />
                  {errors.releaseYear && <p className="text-red-500 text-sm mt-1">{errors.releaseYear}</p>}
                </div>

                {/* Duration (phút) */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Thời lượng phim (phút) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-primary border ${errors.duration ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-accent`}
                  />
                  {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                </div>
              </div>

              {/* Genre */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Thể loại <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.genre.map((g, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-600 text-white rounded text-sm flex items-center gap-2">
                      {g}
                      <button
                        type="button"
                        onClick={() => handleRemoveGenre(g)}
                        className="hover:text-red-300"
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <select
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    className="flex-1 px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
                  >
                    <option value="">Chọn thể loại</option>
                    {availableGenres.filter(g => !formData.genre.includes(g)).map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleAddGenre(genreInput)}
                    disabled={!genreInput}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                  >
                    Thêm
                  </button>
                </div>
                {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre}</p>}
              </div>

              {/* Director */}
              <div>
                <label className="block text-white font-medium mb-2">Đạo diễn</label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  placeholder="Chọn đạo diễn"
                  className="w-full px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                />
              </div>

              {/* Actors (placeholder) */}
              <div>
                <label className="block text-white font-medium mb-2">Diễn viên</label>
                <input
                  type="text"
                  placeholder="Chọn diễn viên"
                  className="w-full px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-white font-medium mb-2">Quốc gia</label>
                <select className="w-full px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent">
                  <option>Chọn quốc gia</option>
                  <option>Mỹ</option>
                  <option>Nhật Bản</option>
                  <option>Hàn Quốc</option>
                  <option>Việt Nam</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Poster & Actions */}
        <div className="space-y-6">
          {/* Poster */}
          <div className="bg-secondary rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-bold text-white mb-4">Hình thực chiếu</h2>
            <div className="space-y-4">
              <div className="aspect-[2/3] bg-primary rounded-lg overflow-hidden border border-gray-600">
                {formData.poster ? (
                  <img src={formData.poster} alt="Poster" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaUpload size={48} />
                  </div>
                )}
              </div>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <FaUpload />
                <span>Thay đổi ảnh phim</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-secondary rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-bold text-white mb-4">Trạng thái</h2>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white mb-4 focus:outline-none focus:border-accent"
            >
              <option value="coming-soon">Sắp chiếu</option>
              <option value="showing">Đang chiếu</option>
            </select>
            
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <FaSave />
                <span>Cập nhật</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/movies')}
                className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
                    alert('Phim đã được xóa!');
                    navigate('/movies');
                  }
                }}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Xóa phim
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditMovie;
