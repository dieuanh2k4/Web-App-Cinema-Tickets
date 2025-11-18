import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUpload, FaTimes } from 'react-icons/fa';
import { generateId } from '../utils/helpers';

const AddMovie = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    originalTitle: '',
    director: '',
    genre: [],
    duration: '',
    releaseYear: new Date().getFullYear(),
    imdbRating: '',
    description: '',
    poster: '',
    trailer: '',
    status: 'coming-soon'
  });
  const [genreInput, setGenreInput] = useState('');
  const [errors, setErrors] = useState({});

  const availableGenres = ['Animation', 'Adventure', 'Drama', 'Fantasy', 'Romance', 'Family', 'Action', 'Comedy', 'Thriller', 'Horror', 'Sci-Fi', 'War'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
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

    // Save to localStorage (in real app, this would be an API call)
    const newMovie = {
      id: generateId('MOVIE'),
      ...formData,
      duration: parseInt(formData.duration),
      releaseYear: parseInt(formData.releaseYear),
      imdbRating: parseFloat(formData.imdbRating) || 0
    };

    // This is just for demo - in real app, update via API
    console.log('New movie:', newMovie);
    alert('Phim đã được tạo thành công!');
    navigate('/movies');
  };

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
          <h1 className="text-3xl font-bold text-white mb-3">Tạo phim mới</h1>
          <p className="text-gray-400 text-sm lg:text-base">Nhập thông tin phim để thêm vào hệ thống</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-secondary rounded-lg p-8 border border-gray-700 space-y-5">
            <h2 className="text-xl font-bold text-white mb-5">Thông tin cơ bản</h2>
            
            {/* Title */}
            <div>
              <label className="block text-white font-medium mb-2.5">
                Tên phim <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Nhập tên phim"
                className={`w-full px-4 py-2.5 bg-primary border ${errors.title ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
            </div>

            {/* Original Title */}
            <div>
              <label className="block text-white font-medium mb-2.5">
                Tên phim (tiếng anh) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="originalTitle"
                value={formData.originalTitle}
                onChange={handleChange}
                placeholder="Enter original title"
                className={`w-full px-4 py-2.5 bg-primary border ${errors.originalTitle ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors`}
              />
              {errors.originalTitle && <p className="text-red-500 text-sm mt-2">{errors.originalTitle}</p>}
            </div>

            {/* Director */}
            <div>
              <label className="block text-white font-medium mb-2.5">
                Đạo diễn <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="director"
                value={formData.director}
                onChange={handleChange}
                placeholder="Nhập tên đạo diễn"
                className={`w-full px-4 py-2.5 bg-primary border ${errors.director ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors`}
              />
              {errors.director && <p className="text-red-500 text-sm mt-2">{errors.director}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-medium mb-2.5">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả phim"
                rows="5"
                className={`w-full px-4 py-2.5 bg-primary border ${errors.description ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors resize-none`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
            </div>
          </div>

          {/* Details */}
          <div className="bg-secondary rounded-lg p-8 border border-gray-700 space-y-5">
            <h2 className="text-xl font-bold text-white mb-5">Chi tiết</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Duration */}
              <div>
                <label className="block text-white font-medium mb-2.5">
                  Thời lượng (phút) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="100"
                  min="1"
                  className={`w-full px-4 py-2.5 bg-primary border ${errors.duration ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors`}
                />
                {errors.duration && <p className="text-red-500 text-sm mt-2">{errors.duration}</p>}
              </div>

              {/* Release Year */}
              <div>
                <label className="block text-white font-medium mb-2.5">
                  Năm phát hành <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  className={`w-full px-4 py-2.5 bg-primary border ${errors.releaseYear ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-accent transition-colors`}
                />
                {errors.releaseYear && <p className="text-red-500 text-sm mt-2">{errors.releaseYear}</p>}
              </div>

              {/* IMDB Rating */}
              <div>
                <label className="block text-white font-medium mb-2.5">IMDB Rating</label>
                <input
                  type="number"
                  name="imdbRating"
                  value={formData.imdbRating}
                  onChange={handleChange}
                  placeholder="8.5"
                  min="0"
                  max="10"
                  step="0.1"
                  className="w-full px-4 py-2.5 bg-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-white font-medium mb-2.5">Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                >
                  <option value="coming-soon">Sắp chiếu</option>
                  <option value="showing">Đang chiếu</option>
                </select>
              </div>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-white font-medium mb-2.5">
                Thể loại <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.genre.map((g, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-600 text-white rounded-full flex items-center gap-2">
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
                  className="flex-1 px-4 py-2.5 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
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
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Thêm
                </button>
              </div>
              {errors.genre && <p className="text-red-500 text-sm mt-2">{errors.genre}</p>}
            </div>

            {/* Trailer URL */}
            <div>
              <label className="block text-white font-medium mb-2.5">Trailer URL</label>
              <input
                type="url"
                name="trailer"
                value={formData.trailer}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
                className="w-full px-4 py-2.5 bg-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Poster Upload & Actions */}
        <div className="space-y-6">
          {/* Poster */}
          <div className="bg-secondary rounded-lg p-8 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-5">Poster</h2>
            <div className="space-y-4">
              <div className="aspect-[2/3] bg-primary rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden">
                {formData.poster ? (
                  <img src={formData.poster} alt="Poster preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400">
                    <FaUpload size={48} className="mx-auto mb-2" />
                    <p>Chưa có poster</p>
                  </div>
                )}
              </div>
              <input
                type="url"
                name="poster"
                value={formData.poster}
                onChange={handleChange}
                placeholder="URL poster (https://...)"
                className="w-full px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-accent"
              />
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-gray-700 border border-gray-600 text-white rounded-lg transition-colors"
              >
                <FaUpload />
                <span>Tải ảnh lên</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-secondary rounded-lg p-8 border border-gray-700 space-y-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FaSave />
              <span>Lưu phim</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/movies')}
              className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddMovie;
