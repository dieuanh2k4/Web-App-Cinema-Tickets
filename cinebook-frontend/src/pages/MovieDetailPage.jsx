import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiStar, FiClock, FiCalendar, FiMapPin, FiPlay, FiShoppingCart } from 'react-icons/fi'
import { getMovieById, getShowtimesByMovie, getTheaters } from '../services/api'
import TrailerModal from '../components/TrailerModal'

export default function MovieDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  // Use current date
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [selectedTheater, setSelectedTheater] = useState('all')
  const [showTrailer, setShowTrailer] = useState(false)

  const { data: movie, isLoading: isLoadingMovie } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieById(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const { data: theaters, isLoading: isLoadingTheaters, error: theatersError } = useQuery({
    queryKey: ['theaters'],
    queryFn: async () => {
      console.log('🎭 Fetching theaters from API...')
      try {
        const data = await getTheaters()
        console.log('🎭 Theaters API response:', data)
        console.log('🎭 Theaters type:', typeof data, 'Is array:', Array.isArray(data))
        if (data && Array.isArray(data)) {
          console.log('🎭 Total theaters:', data.length)
          if (data.length > 0) {
            console.log('🎭 First theater sample:', data[0])
            console.log('🎭 Theater fields:', Object.keys(data[0]))
            // Log chi tiết từng field
            console.log('🎭 Theater details:', {
              id: data[0].id || data[0].Id,
              name: data[0].name || data[0].Name,
              address: data[0].address || data[0].Address,
              city: data[0].city || data[0].City
            })
          } else {
            console.warn('⚠️ Theaters array is EMPTY')
          }
          return data
        } else {
          console.error('❌ Theaters response is not an array:', data)
          return []
        }
      } catch (error) {
        console.error('❌ Failed to fetch theaters:', error)
        throw error
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  })

  const { data: showtimes, isLoading: isLoadingShowtimes } = useQuery({
    queryKey: ['showtimes', id, selectedTheater, selectedDate],
    queryFn: async () => {
      if (selectedTheater === 'all') return []
      
      console.log('📡 API Call - Fetching showtimes:', {
        theaterId: selectedTheater,
        movieId: id,
        date: selectedDate,
        url: `/Showtimes/get-showtime-by-movieId?theaterId=${selectedTheater}&movieId=${id}&date=${selectedDate}`
      })
      
      try {
        const data = await getShowtimesByMovie(selectedTheater, id, selectedDate)
        console.log('✅ API Response - Showtimes:', data)
        console.log('📄 Response type:', typeof data, 'Is array:', Array.isArray(data))
        
        if (data && Array.isArray(data)) {
          console.log('🎬 Total showtimes found:', data.length)
          if (data.length > 0) {
            console.log('🔍 First showtime sample:', data[0])
          }
          return data
        }
        
        return []
      } catch (error) {
        console.error('❌ API Error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })
        // Trả về array rỗng thay vì throw error
        return []
      }
    },
    enabled: selectedTheater !== 'all',
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  })

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
      fullDate: date.toISOString().split('T')[0]
    }
  }

  const extractYouTubeId = (url) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/)
    return match ? match[1] : null
  }

  const groupShowtimesByTheater = () => {
    if (!showtimes || showtimes.length === 0) return []
    
    const theater = theaters?.find(t => {
      const theaterId = t.id || t.Id
      return theaterId === parseInt(selectedTheater)
    })
    
    if (!theater) {
      console.warn('⚠️ Theater not found for selectedTheater:', selectedTheater)
      return []
    }
    
    // Use lowercase fields from server
    return [{
      theaterId: theater.id || theater.Id,
      theaterName: theater.name || theater.Name,
      address: theater.address || theater.Address,
      city: theater.city || theater.City || 'Chưa cập nhật',
      distance: '2.0 km',
      showtimes: showtimes
    }]
  }

  if (isLoadingMovie) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy phim</h2>
          <Link to="/movies" className="text-purple hover:text-purple-light">
            Quay lại danh sách phim
          </Link>
        </div>
      </div>
    )
  }

  const youtubeId = extractYouTubeId(movie.trailer)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={movie.thumbnail}
            alt={movie.title}
            className="w-full h-full object-cover opacity-30 blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent"></div>
        </div>

        <div className="relative max-w-[1400px] mx-auto px-4 h-full flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="w-48 md:w-64 rounded-lg shadow-2xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="inline-flex items-center space-x-2 bg-purple/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <span className="w-2 h-2 bg-purple rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-purple">{movie.status}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <FiStar className="text-yellow-500" fill="currentColor" />
                  <span className="font-semibold">{movie.rating.toFixed(1)}/10</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiClock className="text-gray-400" />
                  <span>{movie.duration} phút</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCalendar className="text-gray-400" />
                  <span>{new Date(movie.startDate).getFullYear()}</span>
                </div>
                <div className="bg-purple/20 px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold">{movie.ageLimit}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre?.split(',').map((g, i) => (
                  <span key={i} className="bg-dark-light px-3 py-1 rounded-full text-sm">
                    {g.trim()}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {youtubeId && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="bg-dark-light hover:bg-dark-lighter text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 inline-flex items-center space-x-2 border border-gray-custom hover:border-purple"
                  >
                    <FiPlay />
                    <span>Xem Trailer</span>
                  </button>
                )}
                
                <button
                  onClick={() => {
                    const showtimesSection = document.getElementById('showtimes-section')
                    if (showtimesSection) {
                      showtimesSection.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="bg-purple hover:bg-purple-dark text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-purple/50 inline-flex items-center space-x-2"
                >
                  <FiShoppingCart />
                  <span>Đặt vé ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Movie Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Nội dung phim</h2>
              <p className="text-gray-300 leading-relaxed">{movie.description}</p>
            </div>

            {/* Cast & Crew */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-3">Đạo diễn</h3>
                <p className="text-gray-300">{movie.director}</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Diễn viên</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.actors?.map((actor, i) => (
                    <span key={i} className="bg-dark-light px-3 py-1 rounded-full text-sm text-gray-300">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-dark-light rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Thông tin chi tiết</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Ngôn ngữ</p>
                  <p className="font-semibold">{movie.language}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Ngày khởi chiếu</p>
                  <p className="font-semibold">{new Date(movie.startDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Ngày kết thúc</p>
                  <p className="font-semibold">{new Date(movie.endDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Giới hạn độ tuổi</p>
                  <p className="font-semibold">{movie.ageLimit}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Showtimes */}
          <div className="space-y-6" id="showtimes-section">
            <div className="bg-dark-light rounded-xl p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Lịch chiếu</h2>

              {/* Date selector */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Chọn ngày</p>
                <div className="grid grid-cols-7 gap-2">
                  {dates.map((date) => {
                    const formatted = formatDate(date)
                    const isSelected = formatted.fullDate === selectedDate
                    return (
                      <button
                        key={formatted.fullDate}
                        onClick={() => setSelectedDate(formatted.fullDate)}
                        className={`p-2 rounded-lg text-center transition-all ${
                          isSelected
                            ? 'bg-purple text-white'
                            : 'bg-dark hover:bg-dark-lighter text-gray-400'
                        }`}
                      >
                        <div className="text-xs">{formatted.day}</div>
                        <div className="font-bold">{formatted.date}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Theater selector */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Chọn rạp chiếu</p>
                {isLoadingTheaters ? (
                  <div className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple mr-2"></div>
                    <span className="text-gray-400 text-sm">Đang tải rạp...</span>
                  </div>
                ) : theatersError ? (
                  <div className="w-full px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    ❌ Lỗi tải danh sách rạp
                  </div>
                ) : !theaters || theaters.length === 0 ? (
                  <div className="w-full px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
                    ⚠️ Không có rạp nào
                  </div>
                ) : (
                  <select
                    value={selectedTheater}
                    onChange={(e) => {
                      const value = e.target.value
                      console.log('🎭 Theater selected:', value)
                      setSelectedTheater(value)
                    }}
                    className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white text-sm"
                  >
                    <option value="all">-- Chọn rạp ({theaters?.length || 0} rạp) --</option>
                    {theaters && Array.isArray(theaters) && theaters.map((theater) => {
                      // Server trả về lowercase fields: id, name, address, city
                      const theaterId = theater.id || theater.Id
                      const theaterName = theater.name || theater.Name
                      const theaterAddress = theater.address || theater.Address
                      
                      if (!theaterId || !theaterName) {
                        console.warn('⚠️ Theater missing required fields:', theater)
                        return null
                      }
                      
                      return (
                        <option key={theaterId} value={theaterId}>
                          {theaterName} - {theaterAddress}
                        </option>
                      )
                    })}
                  </select>
                )}
              </div>

              {/* Showtimes by Theater */}
              {selectedTheater === 'all' ? (
                <div className="text-center py-8 text-gray-400">
                  <FiMapPin className="mx-auto mb-3" size={32} />
                  <p>Vui lòng chọn rạp để xem lịch chiếu</p>
                </div>
              ) : isLoadingShowtimes ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
                </div>
              ) : groupShowtimesByTheater().length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <FiCalendar className="mx-auto mb-4" size={40} />
                  <p className="text-lg font-semibold mb-2">Không có suất chiếu nào</p>
                  <p className="text-sm mb-4">Rạp chưa có lịch chiếu cho phim này vào ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}</p>
                  <div className="bg-dark rounded-lg p-4 max-w-sm mx-auto">
                    <p className="text-xs text-gray-500 mb-2">💡 Gợi ý:</p>
                    <ul className="text-xs text-left space-y-1">
                      <li>• Thử chọn ngày khác</li>
                      <li>• Chọn rạp khác</li>
                      <li>• Liên hệ rạp để biết lịch chiếu mới nhất</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {groupShowtimesByTheater().map((theater) => (
                    <div key={theater.theaterId} className="bg-dark rounded-xl p-4 border border-gray-custom/30 hover:border-purple/50 transition-all">
                      {/* Theater header */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-lg">{theater.theaterName}</h4>
                          <span className="text-xs bg-purple/20 text-purple px-2 py-1 rounded-full">2D SUB</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <FiMapPin className="flex-shrink-0" size={14} />
                          <span className="line-clamp-1">{theater.address}</span>
                        </div>
                      </div>
                      
                      {/* Showtimes */}
                      <div className="grid grid-cols-3 gap-2">
                        {theater.showtimes.map((showtime) => {
                          // Server trả về Start (TimeOnly format: "HH:mm:ss")
                          const timeStr = showtime.start || showtime.Start || '00:00:00'
                          const [hours, minutes] = timeStr.split(':')
                          const displayTime = `${hours}:${minutes}`
                          
                          return (
                            <button
                              key={showtime.id || showtime.Id}
                              onClick={() => {
                                const showtimeId = showtime.id || showtime.Id
                                console.log('🎬 Navigating to booking with showtimeId:', showtimeId)
                                navigate(`/booking/${showtimeId}`)
                              }}
                              className="bg-dark-light hover:bg-purple border border-gray-custom hover:border-purple text-sm font-semibold py-2.5 rounded-lg transition-all hover:scale-105"
                            >
                              {displayTime}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && youtubeId && (
        <TrailerModal
          youtubeId={youtubeId}
          title={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  )
}
