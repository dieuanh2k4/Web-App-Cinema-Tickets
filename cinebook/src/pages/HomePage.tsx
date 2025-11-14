import Header from '../components/layout/Header';
import HeroSlider from '../components/home/HeroSlider';
import MovieSection from '../components/home/MovieSection';
import { nowShowingMovies, comingSoonMovies } from '../data/mockMovies';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <HeroSlider movies={nowShowingMovies} />
      
      <div className="content-wrapper">
        <MovieSection title="Phim Đang Chiếu" movies={nowShowingMovies} />
        <MovieSection title="Phim Sắp Chiếu" movies={comingSoonMovies} />
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 CineBook. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Chính sách bảo mật</a>
            <a href="/terms">Điều khoản sử dụng</a>
            <a href="/contact">Liên hệ</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;