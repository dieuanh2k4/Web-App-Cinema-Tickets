// src/pages/HomePage.jsx
import React from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import MovieSlider from '../components/MovieSlider';
import MovieGrid from '../components/MovieGrid';
import { moviesData } from '../data/moviesData';

const HomePage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(to bottom, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
        position: 'relative',
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Header />
        <SearchBar />
        <MovieSlider movies={moviesData.featured} />
        <MovieGrid movies={moviesData.nowShowing} />
      </div>
    </div>
  );
};

export default HomePage;
