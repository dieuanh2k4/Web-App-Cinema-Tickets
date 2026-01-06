import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiCheckCircle, FiMail, FiDownload, FiCalendar, FiMapPin, FiClock } from 'react-icons/fi'
import { getTicketById } from '../services/api'

export default function BookingSuccessPage() {
  const { ticketId } = useParams()

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => getTicketById(ticketId),
    enabled: !!ticketId
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải thông tin vé...</p>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-b from-dark via-dark-light to-dark flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-dark-light rounded-2xl border border-green-500/30 p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
              <FiCheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Đặt vé thành công!</h1>
            <p className="text-gray-400">
              Cảm ơn bạn đã đặt vé tại CineBook
            </p>
          </div>

          {/* Ticket Info */}
          <div className="bg-dark rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Mã vé</p>
                <p className="text-white font-bold text-xl">#{ticket.bookingCode}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Phim</p>
                <p className="text-white font-bold">{ticket.movieTitle}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Phòng chiếu</p>
                <p className="text-white font-semibold">{ticket.roomName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Suất chiếu</p>
                <p className="text-white font-semibold">
                  {new Date(ticket.showtime).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-custom/30 pt-4">
              <p className="text-gray-400 text-sm mb-2">Ghế ngồi</p>
              <div className="flex flex-wrap gap-2">
                {ticket.seats?.map((seat, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple/20 text-purple rounded-full text-sm font-semibold">
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-custom/30 pt-4 flex items-center justify-between">
              <span className="text-gray-400">Tổng tiền</span>
              <span className="text-2xl font-bold text-purple">
                {ticket.totalPrice?.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-xl p-8">
            <h3 className="text-gray-800 font-bold text-center mb-4">Mã QR Check-in</h3>
            {ticket.qrCodeBase64 ? (
              <div className="flex justify-center">
                <img 
                  src={`data:image/png;base64,${ticket.qrCodeBase64}`}
                  alt="QR Code" 
                  className="w-64 h-64 border-4 border-purple rounded-lg"
                />
              </div>
            ) : (
              <div className="w-64 h-64 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">📱</div>
                  <p className="text-gray-600 text-sm">QR Code</p>
                </div>
              </div>
            )}
            <p className="text-gray-600 text-sm text-center mt-4">
              Vui lòng xuất trình mã này tại quầy để check-in
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full bg-purple hover:bg-purple-dark text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2">
              <FiDownload className="w-5 h-5" />
              <span>Tải vé về</span>
            </button>

            <button className="w-full bg-dark hover:bg-dark-light text-white font-semibold py-3 rounded-xl transition-all duration-300 border border-gray-custom flex items-center justify-center space-x-2">
              <FiMail className="w-5 h-5" />
              <span>Gửi lại email</span>
            </button>
          </div>

          {/* Back to Home */}
          <div className="pt-6 border-t border-gray-custom/30">
            <Link
              to="/"
              className="text-purple hover:text-purple-dark transition-colors font-medium"
            >
              ← Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
