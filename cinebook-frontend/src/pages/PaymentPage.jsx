import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { FiArrowLeft, FiClock } from 'react-icons/fi'
import { confirmBooking, cancelBooking } from '../services/api'
import { toast } from 'react-hot-toast'
import { QRCodeSVG } from 'qrcode.react'

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const bookingData = location.state
  
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes
  const [isPaid, setIsPaid] = useState(false)

  // Log booking data
  useEffect(() => {
    console.log('=== PAYMENT PAGE ===')
    console.log('bookingData received:', bookingData)
    console.log('totalPrice:', bookingData?.totalPrice)
    console.log('seats:', bookingData?.seats)
  }, [bookingData])

  // Countdown timer
  useEffect(() => {
    if (isPaid) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          toast.error('Hết thời gian thanh toán!')
          navigate('/showtimes')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPaid, navigate])

  // Format time mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}s`
  }

  // Confirm booking mutation
  const confirmBookingMutation = useMutation({
    mutationFn: confirmBooking,
    onSuccess: (data) => {
      console.log('✅ Confirm booking SUCCESS - Full response:', data)
      
      setIsPaid(true)
      toast.success('Thanh toán thành công!', {
        icon: '🎉',
        duration: 3000
      })
      
      // Extract ticket ID safely with fallback
      const ticketId = data?.booking?.ticket?.id || data?.ticketId || data?.booking?.ticketId
      
      if (!ticketId) {
        console.error('❌ No ticketId found in response:', data)
        toast.error('Không tìm thấy mã vé. Vui lòng kiểm tra lại trong Profile.')
        setTimeout(() => {
          navigate('/profile')
        }, 2000)
        return
      }
      
      console.log('📝 Ticket ID:', ticketId)
      console.log('📦 Booking data to pass:', bookingData)
      
      // Navigate to success page with ticket info
      setTimeout(() => {
        navigate(`/booking/success/${ticketId}`, {
          state: { 
            bookingData: {
              // From API response (backend returns these fields)
              ticketId: ticketId,
              bookingCode: data?.booking?.ticket?.bookingCode || data?.booking?.bookingCode,
              movieTitle: data?.booking?.movieTitle || bookingData?.movieTitle,
              theaterName: data?.booking?.theaterName || bookingData?.theaterName,
              roomName: data?.booking?.roomName || bookingData?.roomName,
              seatNumbers: data?.booking?.seatNumbers || data?.booking?.seats || bookingData?.seats,
              seats: data?.booking?.seatNumbers || data?.booking?.seats || bookingData?.seats,
              
              // Date and time from API
              showtimeDate: data?.booking?.showtime?.date || bookingData?.showtimeDate,
              showtimeStart: data?.booking?.showtime?.start || bookingData?.showtimeStart,
              
              // Movie poster from original booking data
              moviePoster: bookingData?.moviePoster,
              
              // Price
              totalPrice: data?.booking?.ticket?.totalPrice || bookingData?.totalPrice,
              
              // Payment info
              paymentMethod: data?.booking?.paymentMethod || bookingData?.paymentMethod,
              paymentStatus: data?.booking?.paymentStatus || 'Đã thanh toán'
            }
          }
        })
      }, 1500)
    },
    onError: (error) => {
      console.error('❌ Confirm booking ERROR:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error message:', error.message)
      
      const errorMessage = error.response?.data?.message || error.message || 'Thanh toán thất bại!'
      toast.error(errorMessage, {
        duration: 5000
      })
    }
  })

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: (data) => {
      console.log('✅ Cancel booking SUCCESS:', data)
      toast.success('Đã hủy đặt vé thành công! Vé đã được lưu trong hồ sơ của bạn.', {
        icon: '✅',
        duration: 3000
      })
      setTimeout(() => {
        navigate('/profile', {
          state: { showCancelledTickets: true }
        })
      }, 1500)
    },
    onError: (error) => {
      console.error('❌ Cancel booking ERROR:', error)
      console.error('Error response:', error.response?.data)
      const errorMsg = error.response?.data?.message || error.message || 'Hủy vé thất bại!'
      toast.error(errorMsg, {
        duration: 4000
      })
    }
  })

  const handleConfirmPayment = () => {
    if (!bookingData?.holdId) {
      toast.error('Thông tin đặt vé không hợp lệ!', {
        duration: 4000
      })
      console.error('❌ Missing holdId in bookingData:', bookingData)
      return
    }

    console.log('=== CONFIRM PAYMENT ===')
    console.log('holdId:', bookingData.holdId)
    console.log('Full bookingData:', bookingData)
    console.log('Calling confirmBooking API...')

    try {
      confirmBookingMutation.mutate({
        HoldId: bookingData.holdId
      })
    } catch (err) {
      console.error('❌ Exception in handleConfirmPayment:', err)
      toast.error('Có lỗi xảy ra khi xác nhận thanh toán!')
    }
  }

  const handleCancelBooking = () => {
    if (!bookingData?.holdId) {
      toast.error('Thông tin đặt vé không hợp lệ!')
      return
    }

    if (window.confirm('Bạn có chắc muốn hủy đặt vé?\n\nVé sẽ được lưu với trạng thái "Đã hủy" trong hồ sơ của bạn.')) {
      console.log('=== CANCEL BOOKING ===')  
      console.log('holdId:', bookingData.holdId)
      cancelBookingMutation.mutate(bookingData.holdId)
    }
  }

  if (!bookingData) {
    console.error('❌ PaymentPage: No bookingData received')
    console.log('Location state:', location.state)
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <FiArrowLeft className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Không có thông tin đặt vé</h2>
            <p className="text-gray-400 mb-6">
              Vui lòng thực hiện đặt vé từ đầu để tiếp tục thanh toán
            </p>
          </div>
          <button
            onClick={() => navigate('/showtimes')}
            className="bg-purple hover:bg-purple-light text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Quay về trang lịch chiếu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-dark-light to-dark py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-2xl font-bold">Mã QR</h1>
        </div>

        {/* QR Code Section */}
        <div className="bg-dark-light rounded-2xl border border-purple/30 p-6 text-center mb-6">
          <p className="text-gray-400 mb-4">
            Vui lòng quét mã QR<br />để tiến hành thanh toán
          </p>

          {/* QR Code (Fake) */}
          <div className="bg-white p-6 rounded-xl inline-block mb-4">
            <QRCodeSVG
              value={`CINEBOOK-ORDER-${bookingData.holdId}-${bookingData.totalPrice}VND`}
              size={220}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center space-x-2 text-yellow-500 mb-4">
            <FiClock size={18} />
            <span className="font-mono text-lg">
              (Thời hạn thanh toán: {formatTime(timeLeft)})
            </span>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-dark-light rounded-2xl border border-gray-custom/30 p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Thông tin đơn hàng</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Mã đơn hàng</span>
              <span className="text-white font-mono">{bookingData.orderId || bookingData.holdId?.slice(0, 8).toUpperCase()}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Số tiền thanh toán</span>
              <span className="text-white font-bold text-lg">
                {bookingData.totalPrice?.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirmPayment}
          disabled={isPaid || confirmBookingMutation.isPending}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all mb-3 ${
            isPaid || confirmBookingMutation.isPending
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-purple hover:bg-purple-light shadow-lg shadow-purple/50'
          }`}
        >
          {confirmBookingMutation.isPending ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang xử lý...</span>
            </div>
          ) : isPaid ? (
            'Đã xác nhận ✓'
          ) : (
            'Xác nhận'
          )}
        </button>

        {/* Show error message if mutation failed */}
        {confirmBookingMutation.isError && (
          <div className="mb-3 p-4 bg-red-500/10 border border-red-500 rounded-xl text-center">
            <p className="text-red-500 font-semibold">
              {confirmBookingMutation.error?.response?.data?.message || 'Có lỗi xảy ra khi xác nhận thanh toán'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Vui lòng thử lại hoặc liên hệ hỗ trợ
            </p>
          </div>
        )}

        {/* Cancel Button */}
        <button
          onClick={handleCancelBooking}
          disabled={isPaid || confirmBookingMutation.isPending || cancelBookingMutation.isPending}
          className="w-full py-4 rounded-xl font-bold text-lg transition-all border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelBookingMutation.isPending ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Đang hủy...</span>
            </div>
          ) : (
            'Hủy đặt vé'
          )}
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          * Đây là mã QR demo. Trong thực tế sẽ tích hợp VNPay QR
        </p>
      </div>
    </div>
  )
}
