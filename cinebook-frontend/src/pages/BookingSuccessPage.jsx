import { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiCheckCircle, FiCalendar, FiMapPin, FiClock, FiFilm } from 'react-icons/fi'
import { getTicketDetails } from '../services/api'

export default function BookingSuccessPage() {
  const { ticketId } = useParams()
  const location = useLocation()
  const bookingData = location.state?.bookingData

  // Always fetch ticket data from API when ticketId is available
  const { data: ticketResponse, isLoading } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => getTicketDetails(ticketId),
    enabled: !!ticketId,
    staleTime: 30000,
  })

  // Extract ticket data from response (API returns {success: true, data: {...}})
  const apiTicket = ticketResponse?.data || ticketResponse
  
  // Prefer API data over bookingData for accuracy
  const ticketInfo = apiTicket || bookingData

  console.log('=== BOOKING SUCCESS PAGE ===')
  console.log('ticketId from params:', ticketId)
  console.log('bookingData from state:', bookingData)
  console.log('ticketResponse from API:', ticketResponse)
  console.log('apiTicket extracted:', apiTicket)
  console.log('final ticketInfo:', ticketInfo)
  
  // Debug all possible field names
  if (ticketInfo) {
    console.log('--- Field Debug ---')
    console.log('MovieTitle:', ticketInfo.MovieTitle)
    console.log('movieTitle:', ticketInfo.movieTitle)
    console.log('TheaterName:', ticketInfo.TheaterName)
    console.log('theaterName:', ticketInfo.theaterName)
    console.log('RoomName:', ticketInfo.RoomName)
    console.log('roomName:', ticketInfo.roomName)
    console.log('Date:', ticketInfo.Date)
    console.log('date:', ticketInfo.date)
    console.log('StartTime:', ticketInfo.StartTime)
    console.log('startTime:', ticketInfo.startTime)
    console.log('Seats:', ticketInfo.Seats)
    console.log('seats:', ticketInfo.seats)
    console.log('TotalPrice:', ticketInfo.TotalPrice)
    console.log('totalPrice:', ticketInfo.totalPrice)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải thông tin vé...</p>
        </div>
      </div>
    )
  }

  if (!ticketInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy vé</h2>
          <Link to="/" className="text-purple hover:text-purple-light">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-purple/20 border-4 border-purple flex items-center justify-center">
            <FiCheckCircle className="w-12 h-12 text-purple" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2">Thanh toán thành công</h1>
        <p className="text-center text-gray-400 mb-8">
          Vé của bạn đã được xác nhận
        </p>

        {/* Ticket Card - Bám sát design ảnh 1 */}
        <div className="bg-dark-lighter rounded-2xl border border-gray-custom/30 overflow-hidden mb-6">
          {/* Movie Info Section */}
          <div className="p-6 border-b border-gray-custom/30">
            <div className="flex items-start space-x-4">
              {(ticketInfo.moviePoster || ticketInfo.movieThumbnail || ticketInfo.MovieThumbnail || ticketInfo.thumbnail || ticketInfo.movies?.thumbnail) ? (
                <img
                  src={ticketInfo.moviePoster || ticketInfo.movieThumbnail || ticketInfo.MovieThumbnail || ticketInfo.thumbnail || ticketInfo.movies?.thumbnail}
                  alt={ticketInfo.movieTitle || ticketInfo.MovieTitle || ticketInfo.title}
                  className="w-24 h-36 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-24 h-36 bg-dark rounded-lg flex items-center justify-center">
                  <FiFilm size={32} className="text-gray-600" />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2 text-white">
                  {ticketInfo.movieTitle || ticketInfo.MovieTitle || ticketInfo.title || 'Phim'}
                </h2>
                
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-purple/20 text-purple rounded text-xs font-bold">
                    13+
                  </span>
                  <span className="text-gray-400 text-sm">
                    Phụ đề
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm">Phim chiếu rạp</p>
                <p className="text-gray-400 text-sm">120 phút</p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-6 space-y-3">
            {/* Mã vé */}
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400 text-sm">Mã vé</span>
              <span className="text-white font-semibold font-mono">
                #{ticketInfo.id || ticketInfo.ticketId || 'N/A'}
              </span>
            </div>

            {/* Theater & Room */}
            <div className="flex items-center justify-between py-2 border-b border-gray-custom/20">
              <span className="text-gray-400 text-sm">Rạp & Phòng</span>
              <span className="text-white font-semibold text-right">
                {ticketInfo.theaterName || ticketInfo.TheaterName || ticketInfo.rooms?.theater?.name || 'Rạp'} - {ticketInfo.roomName || ticketInfo.RoomName || ticketInfo.rooms?.name || 'Phòng'}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between py-2 border-b border-gray-custom/20">
              <span className="text-gray-400 text-sm">Ngày chiếu</span>
              <span className="text-white font-semibold">
                {ticketInfo.showtimeDate 
                  ? new Date(ticketInfo.showtimeDate).toLocaleDateString('vi-VN')
                  : ticketInfo.date 
                  ? new Date(ticketInfo.date).toLocaleDateString('vi-VN')
                  : ticketInfo.Date
                  ? new Date(ticketInfo.Date).toLocaleDateString('vi-VN')
                  : ticketInfo.showtimes?.date
                  ? new Date(ticketInfo.showtimes.date).toLocaleDateString('vi-VN')
                  : 'N/A'}
              </span>
            </div>

            {/* Time */}
            <div className="flex items-center justify-between py-2 border-b border-gray-custom/20">
              <span className="text-gray-400 text-sm">Suất chiếu</span>
              <span className="text-white font-semibold">
                {ticketInfo.showtimeStart 
                  ? typeof ticketInfo.showtimeStart === 'string' ? ticketInfo.showtimeStart.slice(0, 5) : new Date(ticketInfo.showtimeStart).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                  : ticketInfo.startTime
                  ? typeof ticketInfo.startTime === 'string' ? ticketInfo.startTime.slice(0, 5) : new Date(ticketInfo.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                  : ticketInfo.StartTime
                  ? typeof ticketInfo.StartTime === 'string' ? ticketInfo.StartTime.slice(0, 5) : new Date(ticketInfo.StartTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                  : ticketInfo.showtimes?.start
                  ? typeof ticketInfo.showtimes.start === 'string' ? ticketInfo.showtimes.start.slice(0, 5) : new Date(ticketInfo.showtimes.start).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                  : 'N/A'}
              </span>
            </div>

            {/* Seats */}
            <div className="flex items-center justify-between py-2 border-b border-gray-custom/20">
              <span className="text-gray-400 text-sm">Ghế</span>
              <span className="text-white font-semibold">
                {(() => {
                  // Try multiple ways to get seat names
                  if (Array.isArray(ticketInfo.seats)) {
                    if (ticketInfo.seats.length > 0) {
                      // If seats is array of strings
                      if (typeof ticketInfo.seats[0] === 'string') {
                        return ticketInfo.seats.join(', ')
                      }
                      // If seats is array of objects with seatName
                      if (ticketInfo.seats[0].seatName || ticketInfo.seats[0].SeatName || ticketInfo.seats[0].name) {
                        return ticketInfo.seats.map(s => s.seatName || s.SeatName || s.name).join(', ')
                      }
                    }
                  }
                  // Try Seats with capital S
                  if (Array.isArray(ticketInfo.Seats)) {
                    if (ticketInfo.Seats.length > 0) {
                      if (typeof ticketInfo.Seats[0] === 'string') {
                        return ticketInfo.Seats.join(', ')
                      }
                      if (ticketInfo.Seats[0].seatName || ticketInfo.Seats[0].SeatName || ticketInfo.Seats[0].name) {
                        return ticketInfo.Seats.map(s => s.seatName || s.SeatName || s.name).join(', ')
                      }
                    }
                  }
                  if (Array.isArray(ticketInfo.seatNumbers)) {
                    return ticketInfo.seatNumbers.join(', ')
                  }
                  return 'N/A'
                })()}
              </span>
            </div>

            {/* Total Price */}
            <div className="flex items-center justify-between py-4 border-t-2 border-purple/30 pt-4">
              <span className="text-gray-300 font-semibold text-base">Tổng tiền</span>
              <span className="text-purple font-bold text-2xl">
                {(ticketInfo.totalPrice || ticketInfo.TotalPrice || ticketInfo.ticket?.totalPrice || 0).toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Link
            to="/profile"
            className="flex-1 bg-dark-light hover:bg-dark-lighter text-white py-3 rounded-xl font-semibold transition-all border border-gray-custom text-center"
          >
            Quay về tài khoản
          </Link>
          <Link
            to="/movies"
            className="flex-1 bg-purple hover:bg-purple-dark text-white py-3 rounded-xl font-semibold transition-all text-center shadow-lg shadow-purple/30"
          >
            Đặt vé tiếp
          </Link>
        </div>
        
        <p className="text-center text-gray-400 text-sm">
          Thông tin vé đã được gửi qua email của bạn
        </p>
      </div>
    </div>
  )
}
