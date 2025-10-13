// src/components/MovieSlider.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MovieSlider = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  return (
    <div
      style={{
        position: 'relative',
        padding: '50px 80px',
        marginTop: '30px',
      }}
    >
      {/* Main Slider */}
      <div
        style={{
          position: 'relative',
          height: '450px',
          borderRadius: '20px',
          overflow: 'hidden',
        }}
      >
        <img
          src={movies[currentIndex].image}
          alt={movies[currentIndex].title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)',
          }}
        >
          {/* Movie Info */}
          <div
            style={{
              position: 'absolute',
              left: '60px',
              bottom: '60px',
              color: 'white',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                marginBottom: '15px',
                textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              {movies[currentIndex].title}
            </div>
            <div
              style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
              }}
            >
              <button
                style={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  color: 'white',
                  padding: '12px 30px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow =
                    '0 6px 20px rgba(102, 126, 234, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow =
                    '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
              >
                {movies[currentIndex].badge}
              </button>
              <span
                style={{
                  fontSize: '14px',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                Khởi chiếu: {movies[currentIndex].releaseDate}
              </span>
            </div>
          </div>
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <ChevronLeft size={30} />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <ChevronRight size={30} />
        </button>
      </div>

      {/* Title */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '30px',
          color: 'white',
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '20px',
        }}
      >
        Phim Nổi Bật Gần Đây
      </div>

      {/* Dots Indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        {movies.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: index === currentIndex ? '30px' : '10px',
              height: '10px',
              borderRadius: '5px',
              background:
                index === currentIndex ? '#667eea' : 'rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieSlider;
