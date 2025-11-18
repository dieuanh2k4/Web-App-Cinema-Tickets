import React from 'react';
import { Movie } from '../../types/movie.types';
import MovieCard from './MovieCard';
import './MovieSection.css';

interface MovieSectionProps {
  title: string;
  movies: Movie[];
}

const MovieSection: React.FC<MovieSectionProps> = ({ title, movies }) => {
  return (
    <section className="movie-section">
      <div className="section-header">
        <h2>{title}</h2>
        <div className="section-line"></div>
      </div>
      <div className="movies-grid">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default MovieSection;