import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiMapPin, FiCalendar, FiClock, FiChevronDown } from 'react-icons/fi';
import { getTheaters, getAllShowtimes, getMovies } from '../services/api';

export default function ShowtimesPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTheaterId, setSelectedTheaterId] = useState('all');

  const {
    data: theaters,
    isLoading: isLoadingTheaters,
    error: theatersError,
  } = useQuery({
    queryKey: ['theaters'],
    queryFn: getTheaters,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
  });

  const {
    data: showtimes,
    isLoading: isLoadingShowtimes,
    error: showtimesError,
  } = useQuery({
    queryKey: ['all-showtimes', selectedDate],
    queryFn: getAllShowtimes,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const {
    data: movies,
    isLoading: isLoadingMovies,
    error: moviesError,
  } = useQuery({
    queryKey: ['movies'],
    queryFn: getMovies,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Debug logs
  console.log('=== SHOWTIMES PAGE DEBUG ===');
  console.log('Theaters:', theaters);
  console.log('Showtimes raw:', showtimes);
  console.log('Movies:', movies);
  console.log('Selected Date:', selectedDate);

  // Filter showtimes by date and theater
  const filteredShowtimes =
    showtimes?.filter((showtime) => {
      // Backend returns {date: "2024-12-24", start: "19:00:00"}
      const showtimeDate = showtime.date; // Already in YYYY-MM-DD format
      const matchDate = showtimeDate === selectedDate;
      
      // Match by theater name since API returns theaterName in showtime
      if (selectedTheaterId === 'all') {
        return matchDate;
      }
      
      const selectedTheaterObj = theaters?.find(t => t.id === parseInt(selectedTheaterId));
      const matchTheater = selectedTheaterObj && 
                          showtime.theaterName === selectedTheaterObj.Name;
      
      console.log('Showtime:', showtime.theaterName, 'vs Selected:', selectedTheaterObj?.Name, '=', matchTheater);
      
      return matchDate && matchTheater;
    }) || [];

  console.log('Filtered Showtimes:', filteredShowtimes);

  // Group showtimes by movie
  const groupedByMovie = filteredShowtimes.reduce((acc, showtime) => {
    const movieId = showtime.movieId;

    if (!acc[movieId]) {
      const movie = movies?.find((m) => m.id === movieId);
      acc[movieId] = {
        movie,
        showtimes: [],
      };
    }

    acc[movieId].showtimes.push(showtime);
    return acc;
  }, {});

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const formatDate = (date) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: date.getMonth() + 1,
      fullDate: date.toISOString().split('T')[0],
      isToday: date.toDateString() === new Date().toDateString(),
    };
  };

  const selectedTheater = theaters?.find(
    (t) => t.id === parseInt(selectedTheaterId)
  );

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Lịch chiếu phim</h1>

          {/* Debug Info */}
          {(theatersError || showtimesError || moviesError) && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-4">
              <p className="text-red-500 font-semibold mb-2">
                ⚠️ Lỗi tải dữ liệu:
              </p>
              {theatersError && (
                <p className="text-sm text-red-400">
                  - Theaters: {theatersError.message}
                </p>
              )}
              {showtimesError && (
                <p className="text-sm text-red-400">
                  - Showtimes: {showtimesError.message}
                </p>
              )}
              {moviesError && (
                <p className="text-sm text-red-400">
                  - Movies: {moviesError.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Loading States */}
        {(isLoadingTheaters || isLoadingMovies) && (
          <div className="bg-dark-light rounded-xl p-6 mb-8 border border-gray-custom/30">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple mr-3"></div>
              <span className="text-gray-400">
                Đang tải dữ liệu rạp chiếu và phim...
              </span>
            </div>
          </div>
        )}

        {/* Theater & Date Selection */}
        {!isLoadingTheaters && !isLoadingMovies && (
          <div className="bg-dark-light rounded-xl p-6 mb-8 border border-gray-custom/30">
            {/* Theater Filter */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-3 flex items-center space-x-2">
                <FiMapPin size={16} />
                <span>Chọn rạp chiếu</span>
              </label>
              <div className="relative">
                <select
                  value={selectedTheaterId}
                  onChange={(e) => setSelectedTheaterId(e.target.value)}
                  className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white appearance-none cursor-pointer"
                >
                  <option value="all">
                    Tất cả các rạp ({theaters?.length || 0})
                  </option>
                  {theaters?.map((theater) => (
                    <option key={theater.id} value={theater.id}>
                      {theater.Name} - {theater.Address}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Selected Theater Info */}
              {selectedTheater && selectedTheaterId !== 'all' && (
                <div className="mt-4 p-4 bg-dark rounded-lg border border-purple/30">
                  <div className="flex items-start space-x-3">
                    <FiMapPin
                      className="text-purple mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div>
                      <p className="font-semibold text-white text-lg">
                        {selectedTheater.Name}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {selectedTheater.Address}
                      </p>
                      <p className="text-purple text-sm mt-1">
                        📍 {selectedTheater.City}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Date selector - Tab style like image */}
            <div>
              <label className="block text-sm text-gray-400 mb-3 flex items-center space-x-2">
                <FiCalendar size={16} />
                <span>Chọn ngày chiếu</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {dates.map((date) => {
                  const formatted = formatDate(date);
                  const isSelected = formatted.fullDate === selectedDate;
                  return (
                    <button
                      key={formatted.fullDate}
                      onClick={() => setSelectedDate(formatted.fullDate)}
                      className={`px-4 py-2.5 rounded-lg text-center transition-all border ${
                        isSelected
                          ? 'bg-purple text-white border-purple shadow-lg shadow-purple/30'
                          : 'bg-dark-lighter hover:bg-dark text-gray-300 border-gray-custom hover:border-purple/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium">{formatted.day}</span>
                        <span className="font-bold text-base">{formatted.date}/{formatted.month}</span>
                      </div>
                      {formatted.isToday && (
                        <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-white' : 'text-purple'}`}>
                          Hôm nay
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Showtimes */}
        {isLoadingShowtimes ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
          </div>
        ) : Object.keys(groupedByMovie).length === 0 ? (
          <div className="text-center py-16 bg-dark-light rounded-xl">
            <FiCalendar size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg mb-2">
              Chưa có lịch chiếu cho ngày này
            </p>
            <p className="text-gray-500 text-sm">
              Vui lòng chọn ngày khác hoặc quay lại sau
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.values(groupedByMovie).map((movieGroup, idx) => (
              <div
                key={idx}
                className="bg-dark-light rounded-xl overflow-hidden border border-gray-custom/30 hover:border-purple/50 transition-all shadow-lg"
              >
                <div className="flex flex-col lg:flex-row gap-6 p-6">
                  {/* Movie poster & info */}
                  <Link
                    to={`/movies/${movieGroup.movie?.id}`}
                    className="flex-shrink-0 group relative"
                  >
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={movieGroup.movie?.thumbnail}
                        alt={movieGroup.movie?.title}
                        className="w-full lg:w-56 h-80 object-cover group-hover:scale-110 transition-transform duration-500 shadow-2xl"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Rating badge */}
                      <div className="absolute top-3 right-3 bg-yellow-500 text-black px-2 py-1 rounded-lg font-bold text-sm flex items-center space-x-1">
                        <span>⭐</span>
                        <span>{movieGroup.movie?.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                  </Link>

                  {/* Showtimes */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/movies/${movieGroup.movie?.id}`}
                      className="group inline-block"
                    >
                      <h3 className="font-bold text-2xl lg:text-3xl group-hover:text-purple transition-colors mb-3">
                        {movieGroup.movie?.title}
                      </h3>
                    </Link>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-purple/20 text-purple rounded-full text-xs font-semibold border border-purple/30">
                        {movieGroup.movie?.ageLimit}
                      </span>
                      <span className="flex items-center space-x-1 text-sm text-gray-400">
                        <FiClock size={14} />
                        <span>{movieGroup.movie?.duration} phút</span>
                      </span>
                      <span className="text-gray-600">•</span>
                      <span className="text-sm text-gray-400">{movieGroup.movie?.genre}</span>
                    </div>

                    <div className="mb-5">
                      <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                        {movieGroup.movie?.description}
                      </p>
                    </div>

                    {/* Showtimes Grid - Clean time slots */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-400 font-semibold">
                          Thời gian chiếu:
                        </p>
                        <p className="text-xs text-gray-500">
                          {movieGroup.showtimes.length} suất
                        </p>
                      </div>
                      
                      {/* Time slots in clean button style */}
                      <div className="flex flex-wrap gap-2">
                        {movieGroup.showtimes
                          .sort((a, b) => a.start.localeCompare(b.start))
                          .map((showtime) => {
                            // Format time to HH:MM
                            const timeStr = showtime.start.substring(0, 5);
                            
                            return (
                              <Link
                                key={showtime.id}
                                to={`/booking/${showtime.id}`}
                                className="group"
                              >
                                <div className="relative">
                                  {/* Time button */}
                                  <button className="min-w-[70px] px-4 py-2.5 bg-dark-lighter hover:bg-purple border border-gray-custom hover:border-purple rounded-lg transition-all group-hover:scale-105">
                                    <span className="text-base font-bold text-white group-hover:text-white">
                                      {timeStr}
                                    </span>
                                  </button>
                                  
                                  {/* Tooltip on hover */}
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                    <div className="bg-dark-light border border-purple/30 rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                                      <p className="text-purple font-semibold">{showtime.rooomName}</p>
                                      {selectedTheaterId === 'all' && (
                                        <p className="text-gray-400 text-[10px] mt-1">
                                          {showtime.theaterName}
                                        </p>
                                      )}
                                    </div>
                                    {/* Arrow */}
                                    <div className="w-2 h-2 bg-dark-light border-r border-b border-purple/30 absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                      </div>
                      
                      {/* Room info below */}
                      {selectedTheaterId !== 'all' && (
                        <div className="mt-3 text-xs text-gray-500">
                          <p>Phòng chiếu: {movieGroup.showtimes.map(s => s.rooomName).filter((v, i, a) => a.indexOf(v) === i).join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
