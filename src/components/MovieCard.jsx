// src/components/MovieCard.jsx
import React, { useState } from 'react';

const MovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '15px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s',
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 10px 30px rgba(0, 0, 0, 0.5)'
          : '0 5px 15px rgba(0, 0, 0, 0.3)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster */}
      <img
        src={movie.image}
        alt={movie.title}
        style={{
          width: '100%',
          height: '350px',
          objectFit: 'cover',
        }}
      />

      {/* Rating Badge */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: '#ef4444',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '15px',
          fontSize: '12px',
          fontWeight: '600',
        }}
      >
        {movie.rating}
      </div>

      {/* Movie Info */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 70%, transparent 100%)',
          padding: '40px 15px 15px 15px',
          color: 'white',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '5px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {movie.title}
        </div>
        <div
          style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          {movie.genre}
        </div>
      </div>

      {/* Book Now Button (on hover) */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <button
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: 'white',
              padding: '12px 30px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.6)',
              whiteSpace: 'nowrap',
            }}
          >
            Đặt vé ngay
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
