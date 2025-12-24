import { Link } from 'react-router-dom';
import {
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
} from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-dark-lighter border-t border-gray-custom/30 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              CINE<span className="text-purple">BOOK</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Nền tảng đặt vé xem phim trực tuyến hàng đầu Việt Nam. Đặt vé
              nhanh chóng, tiện lợi, an toàn.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-400 hover:text-purple transition-colors"
              >
                <FiFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple transition-colors"
              >
                <FiInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple transition-colors"
              >
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/movies"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Phim đang chiếu
                </Link>
              </li>
              <li>
                <Link
                  to="/movies?status=upcoming"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Phim sắp chiếu
                </Link>
              </li>
              <li>
                <Link
                  to="/theaters"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Rạp chiếu phim
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-gray-400">
                <FiMapPin className="mt-1 flex-shrink-0" />
                <span>Hanoi</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <FiPhone className="flex-shrink-0" />
                <span>13-666</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <FiMail className="flex-shrink-0" />
                <span>aot@cinebook.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-custom/30 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Cinebook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
