import { useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiStar, FiClock, FiCalendar, FiMapPin, FiPlay, FiShoppingCart } from 'react-icons/fi'
import { getMovieById, getShowtimesByTheater, getTheaters } from '../services/api'
import TrailerModal from '../components/TrailerModal'

export default function MovieDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTheater, setSelectedTheater] = useState('all')
  const [showTrailer, setShowTrailer] = useState(false)

  const { data: movie, isLoading: isLoadingMovie } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieById(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const { data: theaters } = useQuery({
    queryKey: ['theaters'],
    queryFn: getTheaters,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const { data: showtimes, isLoading: isLoadingShowtimes } = useQuery({
    queryKey: ['showtimes', id, selectedTheater, selectedDate],
    queryFn: () => {
      if (selectedTheater === 'all') return []
      console.log('Fetching showtimes with:', { theaterId: selectedTheater, date: selectedDate })
      return getShowtimesByTheater(
        selectedTheater,
        selectedDate
      ).then(data => {
        console.log('Raw API Response:', data);
        console.log('Response type:', typeof data);
        console.log('Is Array:', Array.isArray(data));
        // Nếu response được wrapped trong object với 'data' field
        const actualData = Array.isArray(data) ? data : (data?.data || data?.result || []);
        console.log('Processed data:', actualData);
        // Filter by current movieId
        const filtered = actualData.filter(s => String(s.movieId) === String(id));
        console.log('Filtered by movieId:', filtered);
        return filtered;
      }).catch(error => {
        console.error('Fetch showtimes error:', error);
        return [];
      })
    },
    enabled: selectedTheater !== 'all',
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
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

  // Chuẩn hóa dữ liệu rạp từ server (server có thể trả Name/Address hoặc name/address)
  const normalizedTheaters = useMemo(() => {
    if (!theaters) return []
    return theaters
      .map((t) => ({
        id: t.id ?? t.theaterId ?? t.idTheater ?? t.Id ?? t.ID,
        name: t.Name ?? t.name ?? t.theaterName ?? 'Unknown',
        address: t.Address ?? t.address ?? t.location ?? '',
      }))
      .filter((t) => t.id)
  }, [theaters])

  const theaterAddressMap = useMemo(() => {
    const map = new Map()
    normalizedTheaters.forEach((t) => map.set(String(t.id), t.address))
    return map
  }, [normalizedTheaters])

  const selectedTheaterObj = useMemo(() => {
    return normalizedTheaters.find((t) => String(t.id) === String(selectedTheater))
  }, [normalizedTheaters, selectedTheater])

  // Chuẩn hóa showtime theo format của server
  const normalizedShowtimes = useMemo(() => {
    console.log('=== NORMALIZE SHOWTIMES ===');
    console.log('Input showtimes:', showtimes);
    console.log('Showtimes length:', showtimes?.length);
    console.log('Current movieId from URL:', id);
    
    if (!showtimes || showtimes.length === 0) {
      console.log('❌ No showtimes data');
      return [];
    }
    
    const normalized = showtimes.map((s, idx) => {
      console.log(`\n--- Showtime ${idx} raw data ---`);
      console.log('Full object:', s);
      console.log('Available fields:', Object.keys(s));
      
      // Server trả: start (lowercase), date (lowercase), không phải Start/Date (uppercase)
      let startTime = null;
      
      if (s.start && s.date) {
        // Combine start time + date into ISO format
        // start format: "HH:mm:ss", date format: "YYYY-MM-DD"
        startTime = `${s.date}T${s.start}`;
      } else if (s.Start && s.Date) {
        // Fallback for uppercase versions
        startTime = `${s.Date}T${s.Start}`;
      } else if (s.startTime) {
        startTime = s.startTime;
      }

      const normalized = {
        id: s.id ?? s.Id ?? s.showtimeId,
        movieId: s.movieId ?? s.MovieId,
        startTime: startTime,
        start: s.start,
        date: s.date,
        end: s.end,
        room: s.room || s.Room || {
          theater: {
            Name: s.theaterName ?? s.TheaterName ?? s.theater?.Name,
            Address: s.address ?? s.Address ?? s.theater?.Address,
            Id: s.theaterId ?? s.TheaterId ?? s.theater?.Id,
          },
        },
        theaterId: s.theaterId ?? s.TheaterId ?? s.room?.theaterId,
        roomNo: s.roomNo,
        roomType: s.roomType,
      };

      console.log('Normalized:', normalized);
      return normalized;
    });

    console.log('\n=== FILTERING ===');
    console.log('Before filter count:', normalized.length);
    
    const filtered = normalized.filter((s) => {
      const hasId = !!s.id;
      const hasTime = !!(s.startTime || s.start);
      const matchesMovie = String(s.movieId) === String(id);
      
      console.log(`Showtime ${s.id}: hasId=${hasId}, hasTime=${hasTime}, startTime=${s.startTime}, start=${s.start}, movieId=${s.movieId}, currentId=${id}, matches=${matchesMovie}`);
      
      return hasId && hasTime;
    });

    console.log('After filter count:', filtered.length);
    console.log('Final normalized showtimes:', filtered);
    return filtered;
  }, [showtimes, id])

  const groupShowtimesByTheater = () => {
    if (!normalizedShowtimes || normalizedShowtimes.length === 0) return []

    const grouped = {}
    normalizedShowtimes.forEach((showtime) => {
      const theaterName = showtime.room?.theater?.Name || 'Unknown'
      const address = showtime.room?.theater?.Address || theaterAddressMap.get(String(showtime.theaterId)) || ''
      if (!grouped[theaterName]) {
        grouped[theaterName] = {
          theaterName,
          address,
          showtimes: []
        }
      }
      grouped[theaterName].showtimes.push(showtime)
    })

    return Object.values(grouped)
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
                <p className="text-sm text-gray-400 mb-3">Chọn rạp</p>
                <select
                  value={selectedTheater}
                  onChange={(e) => setSelectedTheater(e.target.value)}
                  className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white"
                >
                  <option value="all">-- Chọn rạp --</option>
                  {normalizedTheaters?.map(theater => (
                    <option key={theater.id} value={theater.id}>
                      {theater.name}
                    </option>
                  ))}
                </select>
                {selectedTheaterObj && (
                  <div className="mt-3 flex items-start space-x-2 text-sm text-gray-400">
                    <FiMapPin className="mt-0.5 flex-shrink-0" size={16} />
                    <span>{selectedTheaterObj.address || 'Đang cập nhật địa chỉ'}</span>
                  </div>
                )}
              </div>

              {/* Showtimes */}
              {selectedTheater === 'all' ? (
                <div className="text-center py-8 text-gray-400">
                  Vui lòng chọn rạp để xem lịch chiếu
                </div>
              ) : isLoadingShowtimes ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
                </div>
              ) : !normalizedShowtimes || normalizedShowtimes.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  Không có suất chiếu nào (Normalized: {normalizedShowtimes?.length ?? 0})
                </div>
              ) : (
                <div className="space-y-4">
                  {groupShowtimesByTheater().map((theater, idx) => (
                    <div key={idx}>
                      <h4 className="font-semibold mb-2">{theater.theaterName}</h4>
                      <div className="flex items-start space-x-2 mb-3">
                        <FiMapPin className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                        <p className="text-sm text-gray-400">{theater.address}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {theater.showtimes.map((showtime) => {
                          // Format thời gian từ start field (HH:mm:ss)
                          let displayTime = 'N/A';
                          if (showtime.start) {
                            displayTime = showtime.start.substring(0, 5); // Lấy HH:mm
                          } else if (showtime.startTime) {
                            try {
                              displayTime = new Date(showtime.startTime).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              });
                            } catch (e) {
                              displayTime = 'N/A';
                            }
                          }

                          return (
                            <button
                              key={showtime.id}
                              onClick={() => navigate(`/booking/${showtime.id}`)}
                              className="bg-dark hover:bg-purple border border-gray-custom hover:border-purple text-sm py-2 rounded-lg transition-all"
                            >
                              {displayTime}
                            </button>
                          );
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
