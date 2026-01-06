import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilm, FaBuilding, FaDoorOpen, FaClock, FaCouch, FaMoneyBillWave } from 'react-icons/fa';
import { formatCurrency } from '../utils/helpers';
import movieService from '../services/movieService';
import theaterService from '../services/theaterService';
import roomService from '../services/roomService';
import showtimeService from '../services/showtimeService';
import bookingService from '../services/bookingService';
import { useAuth } from '../hooks/useAuth';

const CreateOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Step 1: Selection data
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  
  // Step 2: Selected values
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null); // Store ID only
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  
  // Step 3: Seats
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatInfo, setSeatInfo] = useState(null);

  // Load movies on mount
  useEffect(() => {
    loadMovies();
    loadTheaters();
  }, []);

  const loadMovies = async () => {
    try {
      const data = await movieService.getAllMovies();
      setMovies(data || []);
    } catch (error) {
      console.error('Error loading movies:', error);
      alert('Không thể tải danh sách phim');
    }
  };

  const loadTheaters = async () => {
    try {
      const data = await theaterService.getAllTheaters();
      setTheaters(data || []);
    } catch (error) {
      console.error('Error loading theaters:', error);
      alert('Không thể tải danh sách rạp');
    }
  };

  const loadRooms = async (theaterId) => {
    try {
      const data = await roomService.getAllRooms();
      // API trả về TheaterId (PascalCase) hoặc theaterId (camelCase)
      const filtered = data.filter(room => 
        room.theaterId === theaterId || room.TheaterId === theaterId
      );
      setRooms(filtered);
      console.log('Rooms loaded for theater:', theaterId, filtered);
    } catch (error) {
      console.error('Error loading rooms:', error);
      alert('Không thể tải danh sách phòng');
    }
  };

  const loadShowtimes = async (roomId, movieId) => {
    try {
      const data = await showtimeService.getAllShowtimes();
      console.log('=== SHOWTIME FILTERING DEBUG ===');
      console.log('All showtimes from API:', data);
      console.log('Room ID to match:', roomId, 'Type:', typeof roomId);
      console.log('Movie ID to match:', movieId, 'Type:', typeof movieId);
      
      if (data.length > 0) {
        console.log('Sample showtime:', data[0]);
      }
      
      const filtered = data.filter(st => {
        const showtimeRoomId = st.roomId || st.RoomId;
        const showtimeMovieId = st.movieId || st.MovieId;
        
        const matchMovie = showtimeMovieId === movieId;
        const matchRoom = showtimeRoomId === roomId;
        
        console.log(`Showtime ${st.id}: MovieId=${showtimeMovieId}==${movieId}? ${matchMovie}, RoomId=${showtimeRoomId}==${roomId}? ${matchRoom}`);
        return matchMovie && matchRoom;
      });
      
      console.log('Filtered showtimes count:', filtered.length);
      console.log('Filtered showtimes:', filtered);
      console.log('=== END DEBUG ===');
      setShowtimes(filtered);
    } catch (error) {
      console.error('Error loading showtimes:', error);
      alert('Không thể tải danh sách suất chiếu');
    }
  };

  const loadSeats = async (showtimeId) => {
    try {
      setLoading(true);
      const data = await bookingService.getSeatsByShowtime(showtimeId);
      setSeats(data.seats || []);
      setSeatInfo(data);
    } catch (error) {
      console.error('Error loading seats:', error);
      alert('Không thể tải sơ đồ ghế');
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleMovieChange = (e) => {
    const movie = movies.find(m => m.id === parseInt(e.target.value));
    setSelectedMovie(movie);
    setSelectedTheater(null);
    setSelectedRoomId(null);
    setSelectedShowtime(null);
    setRooms([]);
    setShowtimes([]);
    setSeats([]);
    setSelectedSeats([]);
  };

  const handleTheaterChange = (e) => {
    const theater = theaters.find(t => t.id === parseInt(e.target.value));
    setSelectedTheater(theater);
    setSelectedRoomId(null);
    setSelectedShowtime(null);
    setShowtimes([]);
    setSeats([]);
    setSelectedSeats([]);
    if (theater) {
      loadRooms(theater.id);
    }
  };

  const handleRoomChange = (e) => {
    const roomId = parseInt(e.target.value);
    console.log('Room selected - ID:', roomId);
    setSelectedRoomId(roomId);
    setSelectedShowtime(null);
    setSeats([]);
    setSelectedSeats([]);
    if (roomId && selectedMovie) {
      const movieId = selectedMovie.id || selectedMovie.Id;
      console.log('Loading showtimes for movie:', movieId, 'and room:', roomId);
      loadShowtimes(roomId, movieId);
    }
  };

  const handleShowtimeChange = (e) => {
    const showtime = showtimes.find(st => st.id === parseInt(e.target.value));
    setSelectedShowtime(showtime);
    setSelectedSeats([]);
    if (showtime) {
      loadSeats(showtime.id);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.status !== 'Available') return;
    
    console.log('Seat clicked:', seat);
    const isSelected = selectedSeats.find(s => s.seatId === seat.seatId);
    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => s.seatId !== seat.seatId));
    } else {
      console.log('Adding seat with price:', seat.price || seat.Price);
      setSelectedSeats(prev => [...prev, seat]);
    }
  };

  const getSeatClassName = (seat) => {
    const isSelected = selectedSeats.find(s => s.seatId === seat.seatId);
    
    // Base color by type
    let baseColor = 'bg-blue-500'; // Standard
    if (seat.seatType?.toLowerCase() === 'vip') baseColor = 'bg-yellow-500';
    if (seat.seatType?.toLowerCase() === 'couple') baseColor = 'bg-pink-500';
    
    // Status overlay
    if (seat.status === 'Booked') {
      return 'bg-gray-600 opacity-30 cursor-not-allowed';
    }
    if (seat.status === 'Pending') {
      return `${baseColor} opacity-60 border-2 border-orange-400 animate-pulse cursor-not-allowed`;
    }
    
    // Available
    const selectedStyle = isSelected ? 'ring-4 ring-green-400 scale-110' : '';
    return `${baseColor} opacity-100 hover:scale-110 cursor-pointer transition-all ${selectedStyle}`;
  };

  const calculateTotal = () => {
    console.log('Calculating total from seats:', selectedSeats);
    const total = selectedSeats.reduce((sum, seat) => {
      const price = seat.price || seat.Price || 0;
      console.log(`Seat ${seat.seatId || seat.SeatId}: price=${price}`);
      return sum + price;
    }, 0);
    console.log('Total calculated:', total);
    return total;
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất 1 ghế');
      return;
    }

    // Find room object from selectedRoomId
    const selectedRoom = rooms.find(r => (r.id || r.Id) === selectedRoomId);

    // Navigate to payment with state
    navigate('/orders/payment', {
      state: {
        showtime: selectedShowtime,
        movie: selectedMovie,
        theater: selectedTheater,
        room: selectedRoom,
        seats: selectedSeats,
        seatInfo,
        totalAmount: calculateTotal()
      }
    });
  };

  // Group seats by row (parse from Name like "A1", "B5")
  const groupSeatsByRow = () => {
    const rows = {};
    seats.forEach(seat => {
      const row = seat.seatNumber?.[0] || 'X'; // First character as row
      if (!rows[row]) rows[row] = [];
      rows[row].push(seat);
    });
    
    // Sort seats in each row by number
    Object.keys(rows).forEach(row => {
      rows[row].sort((a, b) => {
        const numA = parseInt(a.seatNumber?.substring(1)) || 0;
        const numB = parseInt(b.seatNumber?.substring(1)) || 0;
        return numA - numB;
      });
    });
    
    return rows;
  };

  const seatRows = groupSeatsByRow();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/orders')}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-white" size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tạo đơn hàng mới</h1>
          <p className="text-gray-400">Chọn phim, suất chiếu và ghế ngồi</p>
        </div>
      </div>

      {/* Step 1: Selection Form */}
      <div className="bg-secondary rounded-xl border border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FaFilm className="text-accent" />
          Thông tin đặt vé
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Movie Select */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Chọn phim
            </label>
            <select
              value={selectedMovie?.id || ''}
              onChange={handleMovieChange}
              className="w-full px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
            >
              <option value="">-- Chọn phim --</option>
              {movies.map(movie => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          {/* Theater Select */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Chọn rạp
            </label>
            <select
              value={selectedTheater?.id || ''}
              onChange={handleTheaterChange}
              disabled={!selectedMovie}
              className="w-full px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent disabled:opacity-50"
            >
              <option value="">-- Chọn rạp --</option>
              {theaters.map(theater => (
                <option key={theater.id} value={theater.id}>
                  {theater.name} - {theater.city}
                </option>
              ))}
            </select>
          </div>

          {/* Room Select */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Chọn phòng
            </label>
            <select
              value={selectedRoomId || ''}
              onChange={handleRoomChange}
              disabled={!selectedTheater}
              className="w-full px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent disabled:opacity-50"
            >
              <option value="">-- Chọn phòng --</option>
              {rooms.map(room => {
                const roomId = room.id || room.Id;
                const roomName = room.name || room.Name;
                const roomType = room.type || room.Type;
                return (
                  <option key={roomId} value={roomId}>
                    {roomName} ({roomType})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Showtime Select */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Chọn suất chiếu
            </label>
            <select
              value={selectedShowtime?.id || ''}
              onChange={handleShowtimeChange}
              disabled={!selectedRoomId}
              className="w-full px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent disabled:opacity-50"
            >
              <option value="">-- Chọn suất chiếu --</option>
              {showtimes.map(showtime => (
                <option key={showtime.id} value={showtime.id}>
                  {showtime.date} - {showtime.start}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Step 2: Seat Map */}
      {seats.length > 0 && (
        <div className="bg-secondary rounded-xl border border-gray-700/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaCouch className="text-accent" />
              Chọn ghế ngồi
            </h2>
            <div className="text-sm text-gray-400">
              {seatInfo?.availableSeats || 0}/{seatInfo?.totalSeats || 0} ghế trống
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-primary rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-300">Standard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-300">VIP</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pink-500 rounded"></div>
              <span className="text-sm text-gray-300">Couple</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-600 opacity-30 rounded"></div>
              <span className="text-sm text-gray-300">Đã đặt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 opacity-60 rounded animate-pulse"></div>
              <span className="text-sm text-gray-300">Đang giữ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 ring-4 ring-green-400 rounded"></div>
              <span className="text-sm text-gray-300">Đang chọn</span>
            </div>
          </div>

          {/* Screen */}
          <div className="mb-8">
            <div className="w-full h-2 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded mb-2"></div>
            <div className="text-center text-gray-400 text-sm">Màn hình</div>
          </div>

          {/* Seat Grid */}
          {loading ? (
            <div className="text-center py-8">
              <div className="text-white">Đang tải sơ đồ ghế...</div>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.keys(seatRows).sort().map(row => (
                <div key={row} className="flex items-center gap-2">
                  <div className="w-8 text-center text-gray-400 font-bold">{row}</div>
                  <div className="flex gap-2 flex-wrap">
                    {seatRows[row].map(seat => (
                      <button
                        key={seat.seatId}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.status !== 'Available'}
                        className={`w-12 h-12 rounded-lg text-white text-xs font-bold flex items-center justify-center ${getSeatClassName(seat)}`}
                        title={`${seat.seatNumber} - ${seat.seatType} - ${seat.status}`}
                      >
                        {seat.seatNumber}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Summary & Payment */}
      {selectedSeats.length > 0 && (
        <div className="bg-secondary rounded-xl border border-gray-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaMoneyBillWave className="text-accent" />
            Thông tin thanh toán
          </h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-300">
              <span>Ghế đã chọn:</span>
              <span className="font-bold text-white">
                {selectedSeats.map(s => s.seatNumber).join(', ')}
              </span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Số lượng:</span>
              <span className="font-bold text-white">{selectedSeats.length} ghế</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-white">Tổng tiền:</span>
              <span className="text-accent">{formatCurrency(calculateTotal())}</span>
            </div>
          </div>

          <button
            onClick={handleProceedToPayment}
            className="w-full py-3 bg-gradient-to-r from-accent to-purple-600 hover:from-accent/90 hover:to-purple-700 text-white rounded-lg font-bold transition-all shadow-lg"
          >
            Tiếp tục thanh toán
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateOrder;
