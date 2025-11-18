import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';

import { mockMovies } from '../data/mockMovies';
import { mockTheaters } from '../data/mockTheaters';
import { getShowtimesByDate, getShowtimesByTheater } from '../data/mockShowtimes';
import './SchedulePage.css';

const SchedulePage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Lấy các phim đang chiếu
  const nowShowingMovies = mockMovies.filter(m => m.status === 'Đang chiếu');

  // Generate 7 days
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

  return (
    <div className="schedule-page">
      <Header />

      <div className="schedule-container">
        {/* Header */}
        <div className="schedule-header">
          <h1 className="schedule-title">📅 Lịch Chiếu Phim</h1>
          <p className="schedule-subtitle">Chọn ngày và suất chiếu để đặt vé</p>
        </div>

        {/* Date Selector */}
        <div className="date-selector">
          {dates.map(date => {
            const formatted = formatDate(date);
            const isSelected = formatted.fullDate === selectedDate;
            return (
              <button
                key={formatted.fullDate}
                className={`date-button ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedDate(formatted.fullDate)}
              >
                <span className="date-day-name">{formatted.dayName}</span>
                <span className="date-day">{formatted.day}/{formatted.month}</span>
              </button>
            );
          })}
        </div>

        {/* Movies List */}
        <div className="schedule-movies-list">
          {nowShowingMovies.map(movie => {
            const showtimes = getShowtimesByDate(movie.id, selectedDate);
            const theaterIds = [...new Set(showtimes.map(st => st.theaterId))];

            return (
              <div key={movie.id} className="schedule-movie-card">
                {/* Movie Info */}
                <div className="schedule-movie-info">
                  <div className="schedule-movie-poster-wrapper">
                    <div 
                      className="schedule-movie-poster"
                      onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                      <img src={movie.thumbnail} alt={movie.title} />
                      {movie.rating > 0 && (
                        <div className="schedule-movie-rating">⭐ {movie.rating}</div>
                      )}
                    </div>
                    
                    {/* Nút Đặt Vé */}
                    <button 
                      className="btn-book-ticket-main"
                      onClick={() => {
                        const element = document.getElementById(`showtimes-${movie.id}`);
                        element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }}
                    >
                      🎫 ĐẶT VÉ NGAY
                    </button>
                  </div>

                  <div className="schedule-movie-details">
                    <h3 
                      className="schedule-movie-title"
                      onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                      {movie.title}
                    </h3>

                    <div className="schedule-movie-meta">
                      <span className="meta-badge age">{movie.ageLimit}</span>
                      <span className="meta-info">⏱ {movie.duration} phút</span>
                      <span className="meta-info">🎬 {movie.genre}</span>
                    </div>

                    <p className="schedule-movie-description">
                      {movie.description.substring(0, 150)}...
                    </p>

                    <div className="schedule-movie-extra">
                      <div className="extra-item">
                        <strong>Đạo diễn:</strong> {movie.director}
                      </div>
                      <div className="extra-item">
                        <strong>Diễn viên:</strong> {movie.actors.slice(0, 2).join(', ')}...
                      </div>
                    </div>
                  </div>
                </div>

                {/* Showtimes by Theater */}
                <div id={`showtimes-${movie.id}`} className="showtimes-section">
                  {theaterIds.length > 0 ? (
                    theaterIds.map(theaterId => {
                      const theater = mockTheaters.find(t => t.id === theaterId);
                      if (!theater) return null;

                      const theaterShowtimes = getShowtimesByTheater(movie.id, selectedDate, theaterId);
                      
                      // Group by hall type
                      const groupedByHallType = theaterShowtimes.reduce((acc, st) => {
                        if (!acc[st.hallType]) acc[st.hallType] = [];
                        acc[st.hallType].push(st);
                        return acc;
                      }, {} as Record<string, typeof theaterShowtimes>);

                      return (
                        <div key={theaterId} className="theater-showtime-card">
                          <div className="theater-header">
                            <h4 className="theater-name">🎬 {theater.name}</h4>
                            <p className="theater-address">📍 {theater.address}</p>
                            <div className="theater-facilities">
                              {theater.facilities.map(f => (
                                <span key={f} className="facility-badge">{f}</span>
                              ))}
                            </div>
                          </div>

                          {/* Showtimes by Hall Type */}
                          {Object.entries(groupedByHallType).map(([hallType, showtimes]) => (
                            <div key={hallType} className="halltype-group">
                              <div className="halltype-header">
                                <span className="halltype-name">{hallType}</span>
                                <span className="halltype-price">
                                  {showtimes[0].price.toLocaleString('vi-VN')}đ
                                </span>
                              </div>

                              <div className="time-slots">
                                {showtimes[0].times.map((time, index) => (
                                  <button
                                    key={time}
                                    className="time-slot-button"
                                    onClick={() => navigate(`/booking/${movie.id}?showtime=${showtimes[0].id}&time=${time}&date=${selectedDate}`)}
                                  >
                                    <span className="time-slot-time">{time}</span>
                                    <span className="time-slot-room">Phòng {index + 1}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-showtime">
                      <p>Không có suất chiếu trong ngày này</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default SchedulePage;