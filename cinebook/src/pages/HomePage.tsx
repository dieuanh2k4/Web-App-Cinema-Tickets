import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { nowShowingMovies, comingSoonMovies } from '../data/mockMovies';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Lấy 5 phim đầu tiên cho hero slider
  const heroMovies = nowShowingMovies.slice(0, 5);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroMovies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentMovie = heroMovies[currentSlide];

  return (
    <div className="home-page">
      <Header />

      {/* Hero Slider */}
      <section className="hero-section">
        <div className="hero-slider">
          <div 
            className="hero-background"
            style={{
              backgroundImage: `url(${currentMovie.thumbnail})`,
            }}
          >
            <div className="hero-overlay"></div>
          </div>

          <div className="hero-content">
            <div className="hero-info">
              <h1 className="hero-title">{currentMovie.title}</h1>
              
              <div className="hero-meta">
                <span className="hero-badge age">{currentMovie.ageLimit}</span>
                <span className="hero-badge duration">⏱ {currentMovie.duration} phút</span>
                <span className="hero-badge genre">{currentMovie.genre.split(',')[0].trim()}</span>
                {currentMovie.rating > 0 && (
                  <span className="hero-badge rating">⭐ {currentMovie.rating}/10</span>
                )}
              </div>

              <p className="hero-description">
                {currentMovie.description.substring(0, 200)}...
              </p>

              <div className="hero-release">
                <strong>📅 Suất chiếu đặc biệt</strong>
                <span>{new Date(currentMovie.startDate).toLocaleDateString('vi-VN')}</span>
              </div>

              <div className="hero-actions">
                <button 
                  className="btn-hero btn-primary"
                  onClick={() => navigate(`/booking/${currentMovie.id}`)}
                >
                   ĐẶT VÉ NGAY
                </button>
                <button 
                  className="btn-hero btn-secondary"
                  onClick={() => navigate(`/movie/${currentMovie.id}`)}
                >
                   CHI TIẾT PHIM
                </button>
                {currentMovie.trailer && (
                  <button 
                    className="btn-hero btn-outline"
                    onClick={() => window.open(currentMovie.trailer, '_blank')}
                  >
                     XEM TRAILER
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Slider Controls */}
          <button className="slider-btn prev" onClick={prevSlide}>
            ‹
          </button>
          <button className="slider-btn next" onClick={nextSlide}>
            ›
          </button>

          {/* Slider Indicators */}
          <div className="slider-indicators">
            {heroMovies.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Now Showing Section */}
      <section className="movies-section">
        <div className="section-header">
          <h2 className="section-title">🎬 Phim Đang Chiếu</h2>
          <button className="btn-view-all" onClick={() => navigate('/movies')}>
            Xem tất cả →
          </button>
        </div>

        <div className="movies-grid">
          {nowShowingMovies.slice(0, 8).map((movie) => (
            <div key={movie.id} className="movie-card">
              <div 
                className="movie-poster"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <img src={movie.thumbnail} alt={movie.title} />
                <div className="movie-overlay">
                  <button 
                    className="btn-quick-book"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/booking/${movie.id}`);
                    }}
                  >
                     Đặt vé
                  </button>
                </div>
                {movie.rating > 0 && (
                  <div className="movie-rating">⭐ {movie.rating}</div>
                )}
              </div>

              <div className="movie-info">
                <h3 
                  className="movie-title"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  {movie.title}
                </h3>
                <div className="movie-meta">
                  <span className="meta-badge">{movie.ageLimit}</span>
                  <span className="meta-duration">⏱ {movie.duration}p</span>
                </div>
                <div className="movie-genre">{movie.genre.split(',')[0].trim()}</div>
                
                <div className="movie-actions">
                  {movie.trailer && (
                    <button 
                      className="btn-trailer"
                      onClick={() => window.open(movie.trailer, '_blank')}
                    >
                      ▶️ Trailer
                    </button>
                  )}
                  <button 
                    className="btn-book"
                    onClick={() => navigate(`/booking/${movie.id}`)}
                  >
                    Mua vé
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="movies-section coming-soon">
        <div className="section-header">
          <h2 className="section-title">🔜 Phim Sắp Chiếu</h2>
          <button className="btn-view-all" onClick={() => navigate('/movies?tab=coming')}>
            Xem tất cả →
          </button>
        </div>

        <div className="movies-grid">
          {comingSoonMovies.slice(0, 8).map((movie) => (
            <div key={movie.id} className="movie-card">
              <div 
                className="movie-poster"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <img src={movie.thumbnail} alt={movie.title} />
                <div className="movie-overlay">
                  <span className="coming-soon-label">Sắp chiếu</span>
                </div>
                {movie.rating > 0 && (
                  <div className="movie-rating">⭐ {movie.rating}</div>
                )}
              </div>

              <div className="movie-info">
                <h3 
                  className="movie-title"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  {movie.title}
                </h3>
                <div className="movie-meta">
                  <span className="meta-badge">{movie.ageLimit}</span>
                  <span className="meta-duration">⏱ {movie.duration}p</span>
                </div>
                <div className="movie-genre">{movie.genre.split(',')[0].trim()}</div>
                <div className="release-date">
                  📅 {new Date(movie.startDate).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomePage;