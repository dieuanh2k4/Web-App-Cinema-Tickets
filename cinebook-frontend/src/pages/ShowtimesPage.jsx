import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { FiMapPin, FiCalendar, FiClock, FiRefreshCw, FiZap } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { getTheaters, getAllShowtimes, getMovies, autoGenerateShowtimes } from '../services/api'

export default function ShowtimesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showStats, setShowStats] = useState(false)

  const { data: theaters } = useQuery({
    queryKey: ['theaters'],
    queryFn: getTheaters
  })

  const { data: showtimes, isLoading: isLoadingShowtimes, refetch } = useQuery({
    queryKey: ['all-showtimes', selectedDate],
    queryFn: getAllShowtimes
  })

  const { data: movies } = useQuery({
    queryKey: ['movies'],
    queryFn: getMovies
  })

  // Auto-generate mutation
  const generateMutation = useMutation({
    mutationFn: autoGenerateShowtimes,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(data.message)
        refetch()
      } else {
        toast.error(data.message || 'Tạo lịch chiếu thất bại')
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  })

  const handleAutoGenerate = () => {
    if (window.confirm('Bạn có chắc muốn tạo lịch chiếu tự động? Lịch cũ sẽ bị xóa.')) {
      generateMutation.mutate(selectedDate)
    }
  }

  // Lấy rạp đầu tiên (chỉ có 1 rạp)
  const mainTheater = theaters?.[0]

  // Filter showtimes by date
  const filteredShowtimes = showtimes?.filter(showtime => {
    const showtimeDate = new Date(showtime.startTime).toISOString().split('T')[0]
    return showtimeDate === selectedDate
  }) || []

  // Group showtimes by room and movie
  const groupedByRoom = filteredShowtimes.reduce((acc, showtime) => {
    const roomId = showtime.room?.id || 'unknown'
    const movieId = showtime.movieId
    
    if (!acc[roomId]) {
      acc[roomId] = {
        room: showtime.room,
        movies: {}
      }
    }
    
    if (!acc[roomId].movies[movieId]) {
      const movie = movies?.find(m => m.id === movieId)
      acc[roomId].movies[movieId] = {
        movie,
        showtimes: []
      }
    }
    
    acc[roomId].movies[movieId].showtimes.push(showtime)
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

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Lịch chiếu phim</h1>
              {mainTheater && (
                <div className="flex items-start space-x-2 text-gray-400">
                  <FiMapPin className="mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">{mainTheater.theaterName}</p>
                    <p className="text-sm">{mainTheater.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Auto-generate button */}
            <button
              onClick={handleAutoGenerate}
              disabled={generateMutation.isPending}
              className="bg-gradient-to-r from-purple to-purple-dark hover:from-purple-dark hover:to-purple text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-purple/50 disabled:opacity-50 flex items-center space-x-2"
            >
              {generateMutation.isPending ? (
                <>
                  <FiRefreshCw className="animate-spin" />
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <FiZap />
                  <span>Tự động tạo lịch</span>
                </>
              )}
            </button>
          </div>
          <p className="text-gray-400">
            Hệ thống AI tự động sắp xếp lịch chiếu tối ưu theo thời gian thực
          </p>
        </div>

        {/* Date selector */}
        <div className="bg-dark-light rounded-xl p-6 mb-8">
          <label className="block text-sm text-gray-400 mb-3">
            <FiCalendar className="inline mr-1" />
            Chọn ngày
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

        {/* Showtimes */}
        {isLoadingShowtimes ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
          </div>
        ) : Object.keys(groupedByRoom).length === 0 ? (
          <div className="text-center py-16 bg-dark-light rounded-xl">
            <FiCalendar size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg mb-4">Chưa có lịch chiếu cho ngày này</p>
            <button
              onClick={handleAutoGenerate}
              disabled={generateMutation.isPending}
              className="bg-purple hover:bg-purple-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 inline-flex items-center space-x-2"
            >
              <FiZap />
              <span>Tự động tạo lịch chiếu</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.values(groupedByRoom).map((roomGroup, idx) => (
              <div key={idx} className="bg-dark-light rounded-xl p-6">
                {/* Room header */}
                <div className="mb-6 pb-4 border-b border-gray-custom">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{roomGroup.room?.name}</h2>
                      <p className="text-sm text-gray-400">
                        {roomGroup.room?.type} • Sức chứa: {roomGroup.room?.capacity} ghế
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center space-x-2 bg-purple/20 px-4 py-2 rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-sm font-semibold">{roomGroup.room?.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Movies */}
                <div className="space-y-6">
                  {Object.values(roomGroup.movies).map((movieGroup, movieIdx) => (
                    <div key={movieIdx} className="flex flex-col md:flex-row gap-4 pb-6 border-b border-gray-custom/30 last:border-0">
                      {/* Movie poster & info */}
                      <Link 
                        to={`/movies/${movieGroup.movie?.id}`}
                        className="flex-shrink-0 group"
                      >
                        <div className="flex md:flex-col gap-4">
                          <img
                            src={movieGroup.movie?.thumbnail}
                            alt={movieGroup.movie?.title}
                            className="w-24 md:w-32 h-32 md:h-44 object-cover rounded-lg group-hover:scale-105 transition-transform shadow-lg"
                          />
                          <div className="md:hidden flex-1">
                            <h3 className="font-semibold text-lg group-hover:text-purple transition-colors mb-1">
                              {movieGroup.movie?.title}
                            </h3>
                            <p className="text-sm text-gray-400 mb-2">{movieGroup.movie?.genre}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span><FiClock className="inline" size={12} /> {movieGroup.movie?.duration} phút</span>
                              <span>•</span>
                              <span>{movieGroup.movie?.ageLimit}</span>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Showtimes */}
                      <div className="flex-1">
                        <div className="hidden md:block mb-3">
                          <Link to={`/movies/${movieGroup.movie?.id}`} className="group">
                            <h3 className="font-semibold text-lg group-hover:text-purple transition-colors mb-1">
                              {movieGroup.movie?.title}
                            </h3>
                            <p className="text-sm text-gray-400 mb-1">{movieGroup.movie?.genre}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span><FiClock className="inline" size={12} /> {movieGroup.movie?.duration} phút</span>
                              <span>•</span>
                              <span>{movieGroup.movie?.ageLimit}</span>
                              <span>•</span>
                              <span className="text-yellow-500">⭐ {movieGroup.movie?.rating?.toFixed(1)}</span>
                            </div>
                          </Link>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-2">
                            {movieGroup.showtimes.length} suất chiếu
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                            {movieGroup.showtimes
                              .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                              .map((showtime) => (
                                <Link
                                  key={showtime.id}
                                  to={`/booking/${showtime.id}`}
                                  className="bg-dark hover:bg-purple border border-gray-custom hover:border-purple text-center py-2.5 px-3 rounded-lg transition-all group relative overflow-hidden"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-purple/0 via-purple/10 to-purple/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                                  <div className="relative flex items-center justify-center space-x-1">
                                    <FiClock size={14} className="text-gray-400 group-hover:text-white" />
                                    <span className="text-sm font-semibold">
                                      {new Date(showtime.startTime).toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                </Link>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
