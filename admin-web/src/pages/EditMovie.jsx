import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUpload, FaTimes } from 'react-icons/fa';
import movieService from '../services/movieService';

const EditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [genreInput, setGenreInput] = useState('');
  const [actorInput, setActorInput] = useState('');
  const [errors, setErrors] = useState({});
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const availableGenres = ['Animation', 'Adventure', 'Drama', 'Fantasy', 'Romance', 'Family', 'Action', 'Comedy', 'Thriller', 'Horror', 'Sci-Fi', 'War'];

  useEffect(() => {
    loadMovie();
  }, [id]);

  const loadMovie = async () => {
    try {
      setLoading(true);
      const movie = await movieService.getMovieById(parseInt(id));
      
      // Convert genre string to array if needed
      const genreArray = typeof movie.genre === 'string' 
        ? movie.genre.split(',').map(g => g.trim()).filter(g => g)
        : Array.isArray(movie.genre) 
          ? movie.genre 
          : [];
      
      setFormData({
        ...movie,
        genre: genreArray,
        releaseYear: movie.releaseYear || movie.year || new Date().getFullYear(),
        rating: movie.rating || 0,
        language: movie.language || '',
        ageLimit: movie.ageLimit || '',
        startDate: movie.startDate ? movie.startDate.split('T')[0] : '',
        endDate: movie.endDate ? movie.endDate.split('T')[0] : '',
        actors: Array.isArray(movie.actors) ? movie.actors : [],
        director: movie.director || ''
      });
      
      // Set thumbnail preview from existing image
      if (movie.thumbnail) {
        setThumbnailPreview(movie.thumbnail);
      }
    } catch (error) {
      console.error('Error loading movie:', error);
      alert('Không thể tải thông tin phim!');
      navigate('/movies');
    } finally {
      setLoading(false);
    }
  };

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

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh!');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB!');
        return;
      }
      
      setThumbnailFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
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
    if (!formData.releaseYear || formData.releaseYear < 1900) newErrors.releaseYear = 'Năm phát hành không hợp lệ';
    if (!formData.description.trim()) newErrors.description = 'Vui lòng nhập mô tả';
    if (!formData.language.trim()) newErrors.language = 'Vui lòng nhập ngôn ngữ';
    if (!formData.ageLimit.trim()) newErrors.ageLimit = 'Vui lòng chọn độ tuổi';
    if (!formData.startDate) newErrors.startDate = 'Vui lòng chọn ngày khởi chiếu';
    if (!formData.endDate) newErrors.endDate = 'Vui lòng chọn ngày kết thúc';

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
      
      // Prepare movie data - convert genre array to comma-separated string
      const movieData = {
        title: formData.title,
        thumbnail: formData.thumbnail,
        duration: parseInt(formData.duration),
        genre: Array.isArray(formData.genre) ? formData.genre.join(', ') : formData.genre,
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

      // Call API to update movie
      await movieService.updateMovie(parseInt(id), movieData, thumbnailFile);
      
      alert('Phim đã được cập nhật thành công!');
      navigate('/movies');
    } catch (error) {
      console.error('Error updating movie:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật phim!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Đang tải thông tin phim...</div>
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

              {/* Director */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Đạo diễn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-primary border ${errors.director ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-accent`}
                />
                {errors.director && <p className="text-red-500 text-sm mt-1">{errors.director}</p>}
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
                    Thời lượng (phút) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-4 py-2 bg-primary border ${errors.duration ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-accent`}
                  />
                  {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                </div>

                {/* Language */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Ngôn ngữ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    placeholder="Tiếng Việt, English..."
                    className={`w-full px-4 py-2 bg-primary border ${errors.language ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-accent`}
                  />
                  {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
                </div>

                {/* Age Limit */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Độ tuổi xem phim <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="ageLimit"
                    value={formData.ageLimit}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-primary border ${errors.ageLimit ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-accent`}
                  >
                    <option value="">Chọn độ tuổi</option>
                    <option value="P">P - Phổ biến</option>
                    <option value="T13">T13 - Trên 13 tuổi</option>
                    <option value="T16">T16 - Trên 16 tuổi</option>
                    <option value="T18">T18 - Trên 18 tuổi</option>
                  </select>
                  {errors.ageLimit && <p className="text-red-500 text-sm mt-1">{errors.ageLimit}</p>}
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
                    min="1900"
                    className={`w-full px-4 py-2 bg-primary border ${errors.releaseYear ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-accent`}
                  />
                  {errors.releaseYear && <p className="text-red-500 text-sm mt-1">{errors.releaseYear}</p>}
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Ngày khởi chiếu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-primary border ${errors.startDate ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-accent`}
                  />
                  {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Ngày kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-primary border ${errors.endDate ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-accent`}
                  />
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
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

              {/* Actors */}
              <div>
                <label className="block text-white font-medium mb-2">Diễn viên</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.actors && formData.actors.map((actor, i) => (
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
                    className="flex-1 px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddActor(actorInput)}
                    disabled={!actorInput}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Thêm
                  </button>
                </div>
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
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Poster" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaUpload size={48} />
                  </div>
                )}
              </div>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail || ''}
                onChange={handleChange}
                placeholder="URL thumbnail (https://...)"
                className="w-full px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-accent"
              />
              <input
                type="file"
                id="thumbnail-upload"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
              <label
                htmlFor="thumbnail-upload"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                <FaUpload />
                <span>{thumbnailFile ? 'Thay đổi ảnh khác' : 'Tải ảnh lên'}</span>
              </label>
              {thumbnailFile && (
                <p className="text-sm text-green-400 text-center">
                  ✓ Đã chọn: {thumbnailFile.name}
                </p>
              )}
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
                disabled={submitting}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaSave />
                <span>{submitting ? 'Đang cập nhật...' : 'Cập nhật'}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/movies')}
                disabled={submitting}
                className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={async () => {
                  if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
                    try {
                      await movieService.deleteMovie(parseInt(id));
                      alert('Phim đã được xóa!');
                      navigate('/movies');
                    } catch (error) {
                      alert('Có lỗi xảy ra khi xóa phim!');
                    }
                  }
                }}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
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
