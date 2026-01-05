import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUpload, FaTimes } from 'react-icons/fa';
import movieService from '../services/movieService';

const AddMovie = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    genre: [],
    duration: '',
    language: '',
    ageLimit: '',
    releaseYear: new Date().getFullYear(),
    startDate: '',
    endDate: '',
    description: '',
    actors: [],
    rating: '',
    thumbnail: '',
    trailer: ''
  });
  const [genreInput, setGenreInput] = useState('');
  const [actorInput, setActorInput] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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

  const handleAddActor = (actor) => {
    if (actor && !formData.actors.includes(actor)) {
      setFormData(prev => ({
        ...prev,
        actors: [...prev.actors, actor]
      }));
      setActorInput('');
    }
  };

  const handleRemoveActor = (actorToRemove) => {
    setFormData(prev => ({
      ...prev,
      actors: prev.actors.filter(a => a !== actorToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Vui lòng nhập tên phim';
    if (!formData.director.trim()) newErrors.director = 'Vui lòng nhập đạo diễn';
    if (formData.genre.length === 0) newErrors.genre = 'Vui lòng chọn ít nhất 1 thể loại';
    if (!formData.duration || formData.duration <= 0) newErrors.duration = 'Vui lòng nhập thời lượng hợp lệ';
    if (!formData.language.trim()) newErrors.language = 'Vui lòng nhập ngôn ngữ';
    if (!formData.ageLimit) newErrors.ageLimit = 'Vui lòng chọn độ tuổi';
    if (!formData.releaseYear || formData.releaseYear < 1900) newErrors.releaseYear = 'Năm phát hành không hợp lệ';
    if (!formData.startDate) newErrors.startDate = 'Vui lòng chọn ngày khởi chiếu';
    if (!formData.endDate) newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    if (!formData.description.trim()) newErrors.description = 'Vui lòng nhập mô tả';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare movie data
      const newMovie = {
        title: formData.title,
        thumbnail: formData.thumbnail,
        duration: parseInt(formData.duration),
        genre: formData.genre.join(', '),
        language: formData.language,
        ageLimit: formData.ageLimit,
        releaseYear: parseInt(formData.releaseYear),
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        director: formData.director,
        actors: formData.actors,
        rating: parseFloat(formData.rating) || 0,
        trailer: formData.trailer || ''
      };

      // Call API to create movie
      await movieService.createMovie(newMovie);
      
      alert('Phim đã được tạo thành công!');
      navigate('/movies');
    } catch (error) {
      console.error('Error creating movie:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi tạo phim!');
    } finally {
      setSubmitting(false);
    }
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

              {/* Language */}
              <div>
                <label className="block text-white font-medium mb-2.5">
                  Ngôn ngữ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="Tiếng Việt, English..."
                  className={`w-full px-4 py-2.5 bg-primary border ${errors.language ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors`}
                />
                {errors.language && <p className="text-red-500 text-sm mt-2">{errors.language}</p>}
              </div>

              {/* Age Limit */}
              <div>
                <label className="block text-white font-medium mb-2.5">
                  Độ tuổi xem phim <span className="text-red-500">*</span>
                </label>
                <select
                  name="ageLimit"
                  value={formData.ageLimit}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-primary border ${errors.ageLimit ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-accent transition-colors`}
                >
                  <option value="">Chọn độ tuổi</option>
                  <option value="P">P - Phổ biến</option>
                  <option value="T13">T13 - Trên 13 tuổi</option>
                  <option value="T16">T16 - Trên 16 tuổi</option>
                  <option value="T18">T18 - Trên 18 tuổi</option>
                </select>
                {errors.ageLimit && <p className="text-red-500 text-sm mt-2">{errors.ageLimit}</p>}
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

              {/* Rating */}
              <div>
                <label className="block text-white font-medium mb-2.5">Đánh giá (0-10)</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="8.5"
                  min="0"
                  max="10"
                  step="0.1"
                  className="w-full px-4 py-2.5 bg-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-white font-medium mb-2.5">
                  Ngày khởi chiếu <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-primary border ${errors.startDate ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-accent transition-colors`}
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-2">{errors.startDate}</p>}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-white font-medium mb-2.5">
                  Ngày kết thúc <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-primary border ${errors.endDate ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-accent transition-colors`}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-2">{errors.endDate}</p>}
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

            {/* Actors */}
            <div>
              <label className="block text-white font-medium mb-2.5">Diễn viên</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.actors.map((actor, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-600 text-white rounded-full flex items-center gap-2">
                    {actor}
                    <button
                      type="button"
                      onClick={() => handleRemoveActor(actor)}
                      className="hover:text-red-300"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={actorInput}
                  onChange={(e) => setActorInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddActor(actorInput);
                    }
                  }}
                  placeholder="Nhập tên diễn viên"
                  className="flex-1 px-4 py-2.5 bg-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => handleAddActor(actorInput)}
                  disabled={!actorInput}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Poster Upload & Actions */}
        <div className="space-y-6">
          {/* Thumbnail */}
          <div className="bg-secondary rounded-lg p-8 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-5">Thumbnail</h2>
            <div className="space-y-4">
              <div className="aspect-[2/3] bg-primary rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden">
                {formData.thumbnail ? (
                  <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400">
                    <FaUpload size={48} className="mx-auto mb-2" />
                    <p>Chưa có thumbnail</p>
                  </div>
                )}
              </div>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="URL thumbnail (https://...)"
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
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave />
              <span>{submitting ? 'Đang lưu...' : 'Lưu phim'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/movies')}
              disabled={submitting}
              className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
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
