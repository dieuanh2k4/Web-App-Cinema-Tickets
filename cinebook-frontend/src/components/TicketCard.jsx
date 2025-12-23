import { Link } from 'react-router-dom'
import { FiCalendar, FiMapPin, FiClock, FiCheck, FiX, FiEye } from 'react-icons/fi'

export default function TicketCard({ ticket }) {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'paid':
        return (
          <span className="inline-flex items-center space-x-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
            <FiCheck size={14} />
            <span>Đã thanh toán</span>
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center space-x-1 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-semibold">
            <FiX size={14} />
            <span>Đã hủy</span>
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center space-x-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">
            <FiClock size={14} />
            <span>Chờ thanh toán</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center space-x-1 bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-xs font-semibold">
            <span>{status}</span>
          </span>
        )
    }
  }

  return (
    <div className="bg-dark-light rounded-xl overflow-hidden border border-gray-custom hover:border-purple/50 transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        {/* Movie Poster */}
        <div className="md:w-32 h-48 md:h-auto flex-shrink-0">
          <img
            src={ticket.movieThumbnail}
            alt={ticket.movieTitle}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Ticket Info */}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple transition-colors">
                {ticket.movieTitle}
              </h3>
              <p className="text-sm text-gray-400">Mã vé: #{ticket.bookingCode}</p>
            </div>
            {getStatusBadge(ticket.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-start space-x-2 text-sm">
              <FiMapPin className="text-purple mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-gray-400">Rạp & Phòng</p>
                <p className="text-white font-semibold">{ticket.theaterName} - {ticket.roomName}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2 text-sm">
              <FiCalendar className="text-purple mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-gray-400">Suất chiếu</p>
                <p className="text-white font-semibold">
                  {new Date(ticket.showtime).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-custom/30">
            <div>
              <p className="text-gray-400 text-sm">Tổng tiền</p>
              <p className="text-purple text-xl font-bold">
                {ticket.totalPrice?.toLocaleString('vi-VN')}₫
              </p>
            </div>

            <Link
              to={`/booking-success/${ticket.ticketId}`}
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
