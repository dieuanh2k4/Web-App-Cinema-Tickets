import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiMapPin, FiCalendar, FiClock, FiChevronDown } from 'react-icons/fi'
import { getTheaters, getAllShowtimes, getMovies } from '../services/api'

export default function ShowtimesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTheaterId, setSelectedTheaterId] = useState('all')

  const { data: theaters } = useQuery({
    queryKey: ['theaters'],
    queryFn: getTheaters
  })

  const { data: showtimes, isLoading: isLoadingShowtimes } = useQuery({
    queryKey: ['all-showtimes', selectedDate],
    queryFn: getAllShowtimes
  })

  const { data: movies } = useQuery({
    queryKey: ['movies'],
    queryFn: getMovies
  })

  // Filter showtimes by date and theater
  const filteredShowtimes = showtimes?.filter(showtime => {
    const showtimeDate = new Date(showtime.startTime).toISOString().split('T')[0]
    const matchDate = showtimeDate === selectedDate
    const matchTheater = selectedTheaterId === 'all' || showtime.room?.theaterId === parseInt(selectedTheaterId)
    return matchDate && matchTheater
  }) || []

  // Group showtimes by movie
  const groupedByMovie = filteredShowtimes.reduce((acc, showtime) => {
    const movieId = showtime.movieId
    
    if (!acc[movieId]) {
      const movie = movies?.find(m => m.id === movieId)
      acc[movieId] = {
        movie,
        showtimes: []
      }
    }
    
    acc[movieId].showtimes.push(showtime)
    return acc
  }, {})

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date
  })

  const formatDate = (date) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: date.getMonth() + 1,
      fullDate: date.toISOString().split('T')[0],
      isToday: date.toDateString() === new Date().toDateString()
    }
  }

  const selectedTheater = theaters?.find(t => t.id === parseInt(selectedTheaterId))

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Lịch chiếu phim</h1>
          <p className="text-gray-400 mb-4">
            Hệ thống AI tự động sắp xếp lịch chiếu tối ưu
          </p>
        </div>

        {/* Theater & Date Selection */}
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
                <option value="all">Tất cả các rạp ({theaters?.length || 0})</option>
                {theaters?.map(theater => (
                  <option key={theater.id} value={theater.id}>
                    {theater.theaterName} - {theater.address}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Selected Theater Info */}
            {selectedTheater && selectedTheaterId !== 'all' && (
              <div className="mt-4 p-4 bg-dark rounded-lg border border-purple/30">
                <div className="flex items-start space-x-3">
                  <FiMapPin className="text-purple mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold text-white text-lg">{selectedTheater.theaterName}</p>
                    <p className="text-gray-400 text-sm mt-1">{selectedTheater.address}</p>
                    <p className="text-purple text-sm mt-1">📍 {selectedTheater.city}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date selector */}
          <div>
            <label className="block text-sm text-gray-400 mb-3 flex items-center space-x-2">
              <FiCalendar size={16} />
              <span>Chọn ngày</span>
            </label>
            <div className="grid grid-cols-7 gap-2">
              {dates.map((date) => {
                const formatted = formatDate(date)
                const isSelected = formatted.fullDate === selectedDate
                return (
                  <button
                    key={formatted.fullDate}
                    onClick={() => setSelectedDate(formatted.fullDate)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      isSelected
                        ? 'bg-purple text-white shadow-lg shadow-purple/30'
                        : 'bg-dark hover:bg-dark-lighter text-gray-400'
                    }`}
                  >
                    <div className="text-xs mb-1">{formatted.day}</div>
                    <div className="font-bold text-lg">{formatted.date}</div>
                    <div className="text-xs">{formatted.month}/{new Date().getFullYear()}</div>
                    {formatted.isToday && (
                      <div className="text-xs text-purple mt-1">Hôm nay</div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Showtimes */}
        {isLoadingShowtimes ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
          </div>
        ) : Object.keys(groupedByMovie).length === 0 ? (
          <div className="text-center py-16 bg-dark-light rounded-xl">
            <FiCalendar size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg mb-2">Chưa có lịch chiếu cho ngày này</p>
            <p className="text-gray-500 text-sm">Vui lòng chọn ngày khác hoặc quay lại sau</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.values(groupedByMovie).map((movieGroup, idx) => (
              <div key={idx} className="bg-dark-light rounded-xl overflow-hidden border border-gray-custom/30 hover:border-purple/30 transition-all">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* Movie poster & info */}
                  <Link 
                    to={`/movies/${movieGroup.movie?.id}`}
                    className="flex-shrink-0 group"
                  >
                    <img
                      src={movieGroup.movie?.thumbnail}
                      alt={movieGroup.movie?.title}
                      className="w-full md:w-48 h-64 object-cover rounded-lg group-hover:scale-105 transition-transform shadow-lg"
                    />
                  </Link>

                  {/* Showtimes */}
                  <div className="flex-1">
                    <Link to={`/movies/${movieGroup.movie?.id}`} className="group">
                      <h3 className="font-bold text-2xl group-hover:text-purple transition-colors mb-2">
                        {movieGroup.movie?.title}
                      </h3>
                    </Link>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-400">
                      <span className="flex items-center space-x-1">
                        <FiClock size={14} />
                        <span>{movieGroup.movie?.duration} phút</span>
                      </span>
                      <span>•</span>
                      <span>{movieGroup.movie?.genre}</span>
                      <span>•</span>
                      <span className="px-2 py-1 bg-purple/20 text-purple rounded">
                        {movieGroup.movie?.ageLimit}
                      </span>
                      <span>•</span>
                      <span className="text-yellow-500 flex items-center">
                        ⭐ {movieGroup.movie?.rating?.toFixed(1)}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {movieGroup.movie?.description}
                      </p>
                    </div>

                    {/* Showtimes Grid */}
                    <div>
                      <p className="text-sm text-gray-400 mb-3 font-semibold">
                        🎬 {movieGroup.showtimes.length} suất chiếu khả dụng
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {movieGroup.showtimes
                          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                          .map((showtime) => {
                            const theater = theaters?.find(t => t.id === showtime.room?.theaterId)
                            return (
                              <Link
                                key={showtime.id}
                                to={`/booking/${showtime.id}`}
                                className="group relative"
                              >
                                <div className="bg-dark hover:bg-purple border border-gray-custom hover:border-purple rounded-lg p-3 transition-all">
                                  <div className="flex items-center justify-center space-x-2 mb-2">
                                    <FiClock size={16} className="text-purple group-hover:text-white" />
                                    <span className="text-lg font-bold">
                                      {new Date(showtime.startTime).toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-400 text-center mb-2">
                                    {showtime.room?.name}
                                  </div>
                                  {selectedTheaterId === 'all' && theater && (
                                    <div className="text-xs text-purple text-center truncate">
                                      {theater.theaterName}
                                    </div>
                                  )}
                                  <div className="mt-2 pt-2 border-t border-gray-custom/30">
                                    <button className="w-full bg-purple/20 group-hover:bg-purple text-purple group-hover:text-white text-xs font-semibold py-1.5 rounded transition-all">
                                      Mua vé
                                    </button>
                                  </div>
                                </div>
                              </Link>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
