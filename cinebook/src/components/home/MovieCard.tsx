import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../../types/movie.types';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-poster">
        <img src={movie.thumbnail} alt={movie.title} loading="lazy" />
        <div className="movie-overlay">
          <div className="overlay-content">
            <button className="btn-buy-ticket" onClick={(e) => {
              e.preventDefault();
              window.location.href = `/movie/${movie.id}#showtime-section`;
            }}>MUA VÉ</button>
            <button className="btn-trailer">XEM TRAILER</button>
          </div>
        </div>
        {movie.status === 'Sắp chiếu' && (
          <span className="coming-soon-badge">Sắp chiếu</span>
        )}
      </div>
      <div className="movie-info">
        <h3 className="movie-title" title={movie.title}>{movie.title}</h3>
        <div className="movie-meta">
          <span className="genre">{movie.genre.split(',')[0]}</span>
          <span className="age-limit">{movie.ageLimit}</span>
        </div>
        <div className="movie-details">
          <span className="duration">⏱ {movie.duration} phút</span>
          {movie.rating > 0 && (
            <span className="rating">⭐ {movie.rating}/10</span>
          )}
        </div>
        <div className="movie-date">
          <span>📅 {formatDate(movie.startDate)}</span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;