import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Movie } from '../../types/movie.types';
import { mockMovies } from '../../data/mockMovies';
import { mockTheaters } from '../../data/mockTheaters';
import { getShowtimesByDate, getShowtimesByTheater } from '../../data/mockShowtimes';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTheater, setSelectedTheater] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const foundMovie = mockMovies.find(m => m.id === Number(id));
    if (foundMovie) {
      setMovie(foundMovie);
      // Set ngày mặc định là hôm nay
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  if (!movie) return null;

  // Tạo danh sách 7 ngày
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const formatDate = (date: Date) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return {
      dayName: days[date.getDay()],
      day: date.getDate(),
      month: date.getMonth() + 1,
      fullDate: date.toISOString().split('T')[0]
    };
  };

  const showtimes = selectedDate ? getShowtimesByDate(movie.id, selectedDate) : [];
  const theaterIds = [...new Set(showtimes.map(st => st.theaterId))];
  
  const selectedTheaterShowtimes = selectedTheater 
    ? getShowtimesByTheater(movie.id, selectedDate, selectedTheater)
    : [];

  return (
    <div className="movie-detail">
      {/* Hero Section */}
      <div 
        className="movie-hero"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.4) 100%), url(${movie.thumbnail})`
        }}
      >
        <div className="movie-hero-content">
          <div className="movie-poster">
            <img src={movie.thumbnail} alt={movie.title} />
          </div>

          <div className="movie-info">
            <h1>{movie.title}</h1>
            
            <div className="movie-meta-info">
              <span className="age-badge">{movie.ageLimit}</span>
              <span>{movie.duration} phút</span>
              <span>•</span>
              <span>{movie.genre}</span>
              {movie.rating > 0 && (
                <>
                  <span>•</span>
                  <span className="rating">⭐ {movie.rating}/10</span>
                </>
              )}
            </div>

            <p className="movie-description">{movie.description}</p>

            <div className="movie-details-grid">
              <div className="detail-item">
                <strong>Đạo diễn:</strong>
                <span>{movie.director}</span>
              </div>
              <div className="detail-item">
                <strong>Diễn viên:</strong>
                <span>{movie.actors.join(', ')}</span>
              </div>
              <div className="detail-item">
                <strong>Ngôn ngữ:</strong>
                <span>{movie.language}</span>
              </div>
              <div className="detail-item">
                <strong>Khởi chiếu:</strong>
                <span>{new Date(movie.startDate).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn-book-ticket" onClick={() => {
                document.getElementById('showtime-section')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                ĐẶT VÉ NGAY
              </button>
              {movie.trailer && (
                <button className="btn-trailer" onClick={() => setShowTrailer(true)}>
                  XEM TRAILER
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Showtime Section */}
      {movie.status === 'Đang chiếu' && (
        <div id="showtime-section" className="showtime-section">
          <h2>LỊCH CHIẾU</h2>

          {/* Date Selector */}
          <div className="date-selector">
            {dates.map(date => {
              const formatted = formatDate(date);
              const isSelected = formatted.fullDate === selectedDate;
              return (
                <button
                  key={formatted.fullDate}
                  className={`date-button ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedDate(formatted.fullDate);
                    setSelectedTheater(0);
                  }}
                >
                  <span className="day-name">{formatted.dayName}</span>
                  <span className="day-number">{formatted.day}/{formatted.month}</span>
                </button>
              );
            })}
          </div>

          {/* Theater List */}
          {theaterIds.length > 0 ? (
            <div className="theaters-list">
              {theaterIds.map(theaterId => {
                const theater = mockTheaters.find(t => t.id === theaterId);
                if (!theater) return null;

                const theaterShowtimes = getShowtimesByTheater(movie.id, selectedDate, theaterId);
                const groupedByHallType = theaterShowtimes.reduce((acc, st) => {
                  if (!acc[st.hallType]) acc[st.hallType] = [];
                  acc[st.hallType].push(st);
                  return acc;
                }, {} as Record<string, typeof theaterShowtimes>);

                return (
                  <div key={theaterId} className="theater-card">
                    <div className="theater-header">
                      <div className="theater-info">
                        <h3>{theater.name}</h3>
                        <p className="theater-address">📍 {theater.address}</p>
                        <div className="theater-facilities">
                          {theater.facilities.map(f => (
                            <span key={f} className="facility-badge">{f}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="showtimes-container">
                      {Object.entries(groupedByHallType).map(([hallType, showtimes]) => (
                        <div key={hallType} className="halltype-group">
                          <div className="halltype-header">
                            <span className="halltype-name">{hallType}</span>
                            <span className="halltype-price">
                              {showtimes[0].price.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                          <div className="time-slots">
                            {showtimes[0].times.map(time => (
                              <button
                                key={time}
                                className="time-slot"
                                onClick={() => navigate(`/booking/${movie.id}?showtime=${showtimes[0].id}&time=${time}`)}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-showtime">
              <p>Không có suất chiếu trong ngày này</p>
            </div>
          )}
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && movie.trailer && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-content" onClick={e => e.stopPropagation()}>
            <button className="close-trailer" onClick={() => setShowTrailer(false)}>✕</button>
            <iframe
              width="100%"
              height="100%"
              src={movie.trailer}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;