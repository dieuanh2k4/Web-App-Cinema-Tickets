import { useState, useEffect } from 'react';
import { Movie } from '../../types/movie.types';
import './HeroSlider.css';

interface HeroSliderProps {
  movies: Movie[];
}

const HeroSlider = ({ movies }: HeroSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredMovies = movies.slice(0, 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? featuredMovies.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (featuredMovies.length === 0) return null;

  return (
    <div className="hero-slider">
      <button className="slider-btn prev" onClick={goToPrevious} aria-label="Previous slide">
        ‹
      </button>

      <div className="slider-content">
        {featuredMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%), url(${movie.thumbnail})`
            }}
          >
            <div className="slide-overlay">
              <div className="slide-content-left">
                <h2 className="slide-title">{movie.title}</h2>
                <div className="slide-meta">
                  <span className="meta-item">{movie.genre}</span>
                  <span className="meta-separator">•</span>
                  <span className="meta-item">{movie.duration} phút</span>
                  <span className="meta-separator">•</span>
                  <span className="meta-item age-badge">{movie.ageLimit}</span>
                </div>
                <p className="slide-description">{movie.description}</p>
              </div>
              
              <div className="slide-info">
                <span className="release-badge">
                  Suất chiếu đặc biệt<br />
                  {new Date(movie.startDate).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </span>
                <button className="btn-book-now">ĐẶT VÉ NGAY</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="slider-btn next" onClick={goToNext} aria-label="Next slide">
        ›
      </button>

      <div className="slider-title-bottom">
        <h2>{featuredMovies[currentIndex]?.title}</h2>
      </div>

      <div className="slider-dots">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;