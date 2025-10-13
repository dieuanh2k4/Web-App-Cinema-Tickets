// src/components/MovieGrid.jsx
import React from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies }) => {
  return (
    <div style={{ padding: '0 80px 80px 80px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '30px',
        }}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;
