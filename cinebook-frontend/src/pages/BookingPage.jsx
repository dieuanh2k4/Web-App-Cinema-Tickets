import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { FiClock, FiMapPin, FiFilm, FiCalendar, FiUser, FiMail, FiPhone, FiCreditCard, FiCheck, FiAlertCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import SeatMap from '../components/SeatMap'
import { getSeatsByShowtime, holdSeats, createVNPayPayment, getShowtimeById, getTicketPrices } from '../services/api'
import { useAuthStore } from '../store/authStore'

export default function BookingPage() {
  const { showtimeId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  
  const [selectedSeats, setSelectedSeats] = useState([])
  const [holdId, setHoldId] = useState(null)
  const [customerInfo, setCustomerInfo] = useState({
    customerName: user?.username || '',
    phoneNumber: '',
    email: user?.email || ''
  })
  const [paymentMethod, setPaymentMethod] = useState('VNPay')
  const [timeLeft, setTimeLeft] = useState(10 * 60) // 10 minutes in seconds
  const [hasStartedTimer, setHasStartedTimer] = useState(false)

  // Fetch showtime details
  const { data: showtimeData } = useQuery({
    queryKey: ['showtime', showtimeId],
    queryFn: () => getShowtimeById(showtimeId),
    enabled: !!showtimeId,
  })

  // Fetch seats
  const { data: seatData, isLoading, refetch: refetchSeats } = useQuery({
    queryKey: ['seats', showtimeId],
    queryFn: () => getSeatsByShowtime(showtimeId),
    enabled: !!showtimeId,
    staleTime: 10 * 1000,
    refetchInterval: 15000, // Auto-refresh every 15s for real-time seat availability
  })

  // Fetch ticket prices
  const { data: ticketPrices } = useQuery({
    queryKey: ['ticket-prices'],
    queryFn: getTicketPrices,
    staleTime: 60 * 60 * 1000,
  })

  // Hold seats mutation
  const holdSeatsMutation = useMutation({
    mutationFn: (seatsToHold) => {
      console.log('=== HOLD SEATS MUTATION ===');
      console.log('seatsToHold param:', seatsToHold);
      console.log('showtimeId from params:', showtimeId);
      console.log('seatsToHold type:', Array.isArray(seatsToHold) ? 'array' : typeof seatsToHold);
      console.log('seatsToHold length:', seatsToHold?.length);
      
      if (!seatsToHold || seatsToHold.length === 0) {
        throw new Error('No seats to hold');
      }
      
      return holdSeats(showtimeId, seatsToHold);
    },
    onSuccess: (data) => {
      console.log('✅ Hold success:', data);
      setHoldId(data.holdId)
      setHasStartedTimer(true)
      toast.success(`Đã giữ ${selectedSeats.length} ghế thành công!`)
    },
    onError: (error) => {
      console.error('❌ Hold error:', error);
      toast.error(error.response?.data?.message || error.message || 'Lỗi khi giữ ghế')
      setSelectedSeats([])
    }
  })

  // Countdown timer
  useEffect(() => {
    if (!hasStartedTimer || !holdId) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          toast.error('Hết thời gian giữ ghế! Vui lòng chọn lại.')
          setSelectedSeats([])
          setHoldId(null)
          setHasStartedTimer(false)
          refetchSeats()
          return 10 * 60
        }
        
        if (prev === 60) {
          toast.warning('Còn 1 phút! Vui lòng hoàn tất thanh toán.', {
            duration: 5000,
            icon: '⏰'
          })
        }
        
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [hasStartedTimer, holdId, refetchSeats])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: async () => {
      const seatTotal = calculateTotal()
      return createVNPayPayment({
        ticketId: `TMP_${holdId}`, // Tạm thời sử dụng holdId
        amount: seatTotal,
        orderInfo: `Đặt vé xem phim - Suất ${showtimeId}`
      })
    },
    onSuccess: (data) => {
      if (data.paymentUrl) {
        // Redirect to VNPay
        window.location.href = data.paymentUrl
      } else {
        toast.error('Lỗi tạo link thanh toán')
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Lỗi thanh toán')
    }
  })

  const handleSeatSelect = (seatId) => {
    setSelectedSeats(prev => {
      const newSeats = prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
      
      console.log('Seat selected:', seatId);
      console.log('Updated seats:', newSeats);
      
      // Start hold process when first seat is selected
      if (newSeats.length > 0 && !holdId) {
        // Hold seats first - pass newSeats directly to mutation
        console.log('Calling holdSeatsMutation with newSeats:', newSeats);
        holdSeatsMutation.mutate(newSeats);
      }
      
      // Clear if all seats deselected
      if (newSeats.length === 0) {
        setHoldId(null)
        setHasStartedTimer(false)
        setTimeLeft(10 * 60)
      }
      
      return newSeats
    })
  }

  const calculateTotal = () => {
    if (!seatData?.seats) return 0
    
    // Map seatType to price: Normal=100k, VIP=150k
    const priceMap = {
      'Normal': 100000,
      'normal': 100000,
      'VIP': 150000,
      'vip': 150000,
      'Standard': 100000,
      'Premium': 150000,
    }
    
    return selectedSeats.reduce((total, seatId) => {
      const seat = seatData.seats.find(s => s.seatId === seatId || s.Id === seatId)
      if (!seat) return total
      
      console.log('Calculating price for seat:', {
        seatId,
        seatObject: seat,
        seatType: seat.seatType || seat.Type || 'Unknown',
        price: seat.price || seat.Price,
      })
      
      // Try multiple field names for price
      let price = seat.Price || seat.price
      
      // If no price field, use seatType
      if (!price && (seat.seatType || seat.Type)) {
        const type = seat.seatType || seat.Type
        price = priceMap[type] || 100000
      }
      
      // Fallback
      if (!price) price = 100000
      
      console.log('Final price for seat:', seatId, price)
      return total + price
    }, 0)
  }

  const handleBooking = () => {
    if (!holdId) {
      toast.error('Vui lòng chọn ghế trước!')
      return
    }

    if (selectedSeats.length === 0) {
      toast.error('Vui lòng chọn ghế!')
      return
    }

    if (!customerInfo.customerName || !customerInfo.phoneNumber) {
      toast.error('Vui lòng điền đầy đủ thông tin!')
      return
    }

    // Redirect to payment
    createPaymentMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  const bookedSeatIds = seatData?.seats?.filter(s => !s.isAvailable).map(s => s.seatId) || []
  const totalAmount = calculateTotal()

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-dark-light to-dark py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Đặt vé xem phim</h1>
          <p className="text-gray-400">Chọn ghế và hoàn tất thanh toán</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Seat Selection - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-dark-light rounded-2xl border border-gray-custom/30 p-6">
              <h2 className="text-xl font-bold mb-6">Chọn ghế ngồi</h2>
              
              {seatData?.seats && (
                <SeatMap
                  seats={seatData.seats}
                  selectedSeats={selectedSeats}
                  onSeatSelect={handleSeatSelect}
                  bookedSeats={bookedSeatIds}
                />
              )}

              {/* Seat Count Info */}
              <div className="mt-6 pt-6 border-t border-gray-custom/30">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Tổng số ghế:</span>
                  <span className="text-white font-semibold">{seatData?.totalSeats || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-400">Ghế khả dụng:</span>
                  <span className="text-green-400 font-semibold">{seatData?.availableSeats || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-400">Ghế đã đặt:</span>
                  <span className="text-red-400 font-semibold">{seatData?.bookedSeats || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-dark-light rounded-2xl border border-purple/30 p-6 sticky top-24 space-y-6">
              {/* Timer Warning */}
              {hasStartedTimer && selectedSeats.length > 0 && (
                <div className={`p-4 rounded-xl border-2 ${
                  timeLeft <= 60 ? 'bg-red-500/10 border-red-500' : 'bg-purple/10 border-purple'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FiClock className={`w-5 h-5 ${timeLeft <= 60 ? 'text-red-500' : 'text-purple'}`} />
                      <span className="text-sm text-gray-300">Thời gian giữ ghế</span>
                    </div>
                    <span className={`text-2xl font-bold ${
                      timeLeft <= 60 ? 'text-red-500 animate-pulse' : 'text-purple'
                    }`}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {timeLeft <= 60 ? '⚠️ Vui lòng hoàn tất đặt vé ngay!' : 'Ghế sẽ được tự động hủy sau khi hết thời gian'}
                  </p>
                </div>
              )}

              {/* Movie Info */}
              <div>
                <h3 className="text-lg font-bold mb-4">Thông tin suất chiếu</h3>
                <div className="space-y-3">
                  {/* Movie Title */}
                  {seatData?.movieTitle && (
                    <div className="flex items-start space-x-3 text-sm">
                      <FiFilm className="w-5 h-5 text-purple mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-gray-400">Phim</p>
                        <p className="text-white font-semibold text-base">{seatData.movieTitle}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Theater Info */}
                  {seatData?.theaterName && (
                    <div className="flex items-start space-x-3 text-sm">
                      <FiMapPin className="w-5 h-5 text-purple mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-gray-400">Rạp chiếu</p>
                        <p className="text-white font-semibold">{seatData.theaterName}</p>
                        {seatData?.theaterAddress && (
                          <p className="text-gray-500 text-xs mt-1">{seatData.theaterAddress}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Room */}
                  <div className="flex items-start space-x-3 text-sm">
                    <FiFilm className="w-5 h-5 text-purple mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-gray-400">Phòng chiếu</p>
                      <p className="text-white font-semibold">{seatData?.roomName || 'Đang tải...'}</p>
                    </div>
                  </div>
                  
                  {/* Date & Time */}
                  {seatData?.showtimeDate && seatData?.showtimeTime && (
                    <div className="flex items-start space-x-3 text-sm">
                      <FiCalendar className="w-5 h-5 text-purple mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-gray-400">Lịch chiếu</p>
                        <p className="text-white font-semibold">
                          {new Date(seatData.showtimeDate).toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-purple font-bold text-lg mt-1">
                          <FiClock className="inline mr-1" size={16} />
                          {seatData.showtimeTime}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Seats */}
              <div className="pt-6 border-t border-gray-custom/30">
                <h4 className="font-semibold mb-3 text-purple">Ghế đã chọn ({selectedSeats.length})</h4>
                {selectedSeats.length > 0 ? (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedSeats.map(seatId => {
                        const seat = seatData?.seats.find(s => s.seatId === seatId)
                        const isVip = seat?.seatType?.toLowerCase().includes('vip')
                        return (
                          <div key={seatId} className="flex items-center space-x-2 px-3 py-2 bg-dark rounded-lg border border-gray-custom">
                            <span className={`font-bold ${isVip ? 'text-orange-400' : 'text-gray-300'}`}>
                              {seat?.seatNumber}
                            </span>
                            <span className="text-xs text-gray-500">
                              {isVip ? '(VIP)' : '(Thường)'}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    {/* Price breakdown */}
                    <div className="space-y-2 text-sm">
                      {selectedSeats.map(seatId => {
                        const seat = seatData?.seats.find(s => s.seatId === seatId)
                        const isVip = seat?.seatType?.toLowerCase().includes('vip')
                        const price = isVip ? 100000 : 70000
                        return (
                          <div key={seatId} className="flex justify-between text-gray-400">
                            <span>{seat?.seatNumber} - {isVip ? 'VIP' : 'Thường'}</span>
                            <span className="font-semibold">{price.toLocaleString('vi-VN')}₫</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">Chưa chọn ghế nào</p>
                )}
              </div>

              {/* Customer Info */}
              <div className="pt-6 border-t border-gray-custom/30 space-y-3">
                <h4 className="font-semibold mb-3">Thông tin khách hàng</h4>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    <FiUser className="inline w-4 h-4 mr-2" />
                    Họ tên
                  </label>
                  <input
                    type="text"
                    value={customerInfo.customerName}
                    onChange={(e) => setCustomerInfo({...customerInfo, customerName: e.target.value})}
                    className="w-full bg-dark text-white px-4 py-2 rounded-lg border border-gray-custom focus:outline-none focus:ring-2 focus:ring-purple/50"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    <FiPhone className="inline w-4 h-4 mr-2" />
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phoneNumber}
                    onChange={(e) => setCustomerInfo({...customerInfo, phoneNumber: e.target.value})}
                    className="w-full bg-dark text-white px-4 py-2 rounded-lg border border-gray-custom focus:outline-none focus:ring-2 focus:ring-purple/50"
                    placeholder="0912345678"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    <FiMail className="inline w-4 h-4 mr-2" />
                    Email (tùy chọn)
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="w-full bg-dark text-white px-4 py-2 rounded-lg border border-gray-custom focus:outline-none focus:ring-2 focus:ring-purple/50"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-6 border-t border-gray-custom/30">
                <h4 className="font-semibold mb-3 flex items-center">
                  <FiCreditCard className="mr-2" />
                  Phương thức thanh toán
                </h4>
                <div className="space-y-2">
                  {['VNPay', 'Momo', 'Banking'].map(method => (
                    <label key={method} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-custom hover:border-purple/50 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-purple"
                      />
                      <span className="text-white">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Total & Confirm */}
              <div className="pt-6 border-t border-purple/30 space-y-4">
                <div className="bg-dark rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Số ghế đã chọn</span>
                    <span className="text-white font-bold">{selectedSeats.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-lg">Tổng tiền</span>
                    <span className="text-3xl font-bold text-purple">
                      {totalAmount.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={selectedSeats.length === 0 || createPaymentMutation.isPending || holdSeatsMutation.isPending}
                  className="w-full bg-purple hover:bg-purple-dark text-white font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple/50 flex items-center justify-center space-x-2 text-lg"
                >
                  {createPaymentMutation.isPending || holdSeatsMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-6 h-6" />
                      <span>Thanh toán ({totalAmount.toLocaleString('vi-VN')}₫)</span>
                    </>
                  )}
                </button>

                <div className="flex items-start space-x-2 text-xs text-gray-500 bg-dark/50 p-3 rounded-lg">
                  <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple" />
                  <p>Vé sẽ được gửi qua email sau khi thanh toán thành công. Ghế đã chọn sẽ được giữ trong 10 phút.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
