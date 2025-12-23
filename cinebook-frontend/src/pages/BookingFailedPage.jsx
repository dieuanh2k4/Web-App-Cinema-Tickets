import { Link } from 'react-router-dom'
import { FiXCircle, FiArrowLeft } from 'react-icons/fi'

export default function BookingFailedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-dark-light to-dark flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-dark-light rounded-2xl border border-red-500/30 p-8 text-center space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center">
              <FiXCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Thanh toán thất bại!</h1>
            <p className="text-gray-400">
              Đã có lỗi xảy ra trong quá trình thanh toán
            </p>
          </div>

          {/* Error Details */}
          <div className="bg-dark rounded-xl p-6">
            <p className="text-gray-400 text-sm">
              Giao dịch của bạn không thành công. Vui lòng kiểm tra lại thông tin thanh toán và thử lại.
            </p>
          </div>

          {/* Possible Reasons */}
          <div className="text-left bg-dark rounded-xl p-6 space-y-2">
            <h3 className="font-semibold text-white mb-3">Nguyên nhân có thể:</h3>
            <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
              <li>Số dư tài khoản không đủ</li>
              <li>Thông tin thẻ không chính xác</li>
              <li>Giao dịch bị hủy</li>
              <li>Lỗi kết nối mạng</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              to="/movies"
              className="block w-full bg-purple hover:bg-purple-dark text-white font-semibold py-3 rounded-xl transition-all duration-300 text-center"
            >
              Thử đặt vé lại
            </Link>

            <Link
              to="/"
              className="block w-full bg-dark hover:bg-dark-light text-white font-semibold py-3 rounded-xl transition-all duration-300 border border-gray-custom text-center flex items-center justify-center space-x-2"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Quay về trang chủ</span>
            </Link>
          </div>

          {/* Support */}
          <div className="pt-6 border-t border-gray-custom/30">
            <p className="text-sm text-gray-500">
              Cần hỗ trợ? Liên hệ{' '}
              <a href="mailto:support@cinebook.com" className="text-purple hover:underline">
                support@cinebook.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
