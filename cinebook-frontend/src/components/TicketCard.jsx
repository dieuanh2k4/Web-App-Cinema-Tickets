import { Link } from 'react-router-dom'
import { FiCalendar, FiMapPin, FiClock, FiCheck, FiX, FiEye, FiFilm } from 'react-icons/fi'

export default function TicketCard({ ticket }) {
  console.log('TicketCard received:', ticket)
  
  // Parse seat names from seats array
  const seatNames = ticket.seats?.map(s => s.seatName || s.SeatName || s.name).filter(Boolean) || []
  
  // Get payment status from multiple sources
  const paymentStatus = ticket.paymentStatus || ticket.PaymentStatus || ticket.payment?.status || ticket.status
  
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || ''
    if (statusLower.includes('đã thanh toán') || statusLower === 'confirmed' || statusLower === 'paid') {
      return (
        <span className="inline-flex items-center space-x-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
          <FiCheck size={14} />
          <span>Đã thanh toán</span>
        </span>
      )
    }
    if (statusLower.includes('thất bại') || statusLower.includes('đã hủy') || statusLower === 'cancelled') {
      return (
        <span className="inline-flex items-center space-x-1 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-semibold">
          <FiX size={14} />
          <span>Đã hủy</span>
        </span>
      )
    }
    if (statusLower === 'pending' || statusLower.includes('chưa')) {
      return (
        <span className="inline-flex items-center space-x-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">
          <FiClock size={14} />
          <span>Chờ thanh toán</span>
        </span>
      )
    }
    // Nếu không có status thì không hiển thị badge
    if (!status) return null
    
    return (
      <span className="inline-flex items-center space-x-1 bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-xs font-semibold">
        <span>{status}</span>
      </span>
    )
  }

  return (
    <div className="bg-dark-light rounded-xl overflow-hidden border border-gray-custom hover:border-purple/50 transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        {/* Movie Poster */}
        <div className="md:w-32 h-48 md:h-auto flex-shrink-0 bg-dark">
          {(ticket.movieThumbnail || ticket.MovieThumbnail || ticket.thumbnail) ? (
            <img
              src={ticket.movieThumbnail || ticket.MovieThumbnail || ticket.thumbnail}
              alt={ticket.movieTitle || ticket.MovieTitle}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiFilm size={40} className="text-gray-600" />
            </div>
          )}
        </div>

        {/* Ticket Info */}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple transition-colors">
                {ticket.movieTitle || ticket.MovieTitle || 'Phim'}
              </h3>
              <p className="text-sm text-gray-400">Mã vé: #{ticket.id || ticket.ticketId || 'N/A'}</p>
            </div>
            {getStatusBadge(paymentStatus)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-start space-x-2 text-sm">
              <FiMapPin className="text-purple mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-gray-400">Rạp & Phòng</p>
                <p className="text-white font-semibold">
                  {ticket.theaterName || ticket.TheaterName || 'Rạp'} - {ticket.roomName || ticket.RoomName || 'Phòng'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2 text-sm">
              <FiCalendar className="text-purple mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-gray-400">Suất chiếu</p>
                <p className="text-white font-semibold">
                  {ticket.date || ticket.Date 
                    ? new Date(ticket.date || ticket.Date).toLocaleDateString('vi-VN') 
                    : 'N/A'}
                  {' '}
                  {ticket.startTime 
                    ? typeof ticket.startTime === 'string' ? ticket.startTime.slice(0, 5) : new Date(ticket.startTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})
                    : ticket.StartTime
                    ? typeof ticket.StartTime === 'string' ? ticket.StartTime.slice(0, 5) : new Date(ticket.StartTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})
                    : ''}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2 text-sm col-span-1 md:col-span-2">
              <FiClock className="text-purple mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-gray-400">Ghế</p>
                <p className="text-white font-semibold">
                  {seatNames.length > 0 ? seatNames.join(', ') : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-custom/30">
            <div>
              <p className="text-gray-400 text-sm">Tổng tiền</p>
              <p className="text-purple text-xl font-bold">
                {(ticket.totalPrice || ticket.TotalPrice || 0).toLocaleString('vi-VN')}₫
              </p>
            </div>

            <Link
              to={`/booking/success/${ticket.id}`}
              className="bg-purple hover:bg-purple-dark text-white px-6 py-2 rounded-lg transition-all duration-300 inline-flex items-center space-x-2 text-sm font-semibold shadow-lg shadow-purple/30"
            >
              <FiEye size={16} />
              <span>Chi tiết</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
