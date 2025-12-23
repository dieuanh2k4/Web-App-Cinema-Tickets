import { useQuery } from '@tanstack/react-query'
import { FiFilm, FiCreditCard, FiSmartphone } from 'react-icons/fi'
import HeroBanner from '../components/HeroBanner'
import MovieCarousel from '../components/MovieCarousel'
import { getMovies } from '../services/api'

export default function HomePage() {
  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: getMovies,
  })

  const nowShowing = movies?.filter(m => m.status === 'Đang chiếu') || []
  const comingSoon = movies?.filter(m => m.status === 'Sắp chiếu') || []

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <HeroBanner movies={nowShowing.slice(0, 5)} isLoading={isLoading} />

      {/* Phim Đang Chiếu */}
      <section className="container-custom py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">
            Phim <span className="text-white">Đang Chiếu</span>
          </h2>
          <a href="/movies?status=now-showing" className="text-gray-400 hover:text-white transition-colors">
            Xem tất cả →
          </a>
        </div>
        <MovieCarousel movies={nowShowing} isLoading={isLoading} />
      </section>

      {/* Now Showing */}
      <section className="container-custom py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">
            Phim Nổi Bật <span className="text-white">Gần Đây</span>
          </h2>
          <a href="/movies?status=now-showing" className="text-gray-400 hover:text-white transition-colors">
            Xem tất cả →
          </a>
        </div>
        <MovieCarousel movies={nowShowing} isLoading={isLoading} />
      </section>

      {/* Coming Soon */}
      <section className="container-custom py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">
            Sắp <span className="text-white">Chiếu</span>
          </h2>
          <a href="/movies?status=coming-soon" className="text-gray-400 hover:text-white transition-colors">
            Xem tất cả →
          </a>
        </div>
        <MovieCarousel movies={comingSoon} isLoading={isLoading} />
      </section>

      {/* Features */}
      <section className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-dark-light p-8 rounded-xl text-center hover:bg-dark-lighter transition-colors">
            <div className="w-16 h-16 bg-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiFilm className="text-purple text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Đặt vé dễ dàng</h3>
            <p className="text-gray-400 text-sm">
              Chọn phim, chọn ghế và thanh toán chỉ trong vài phút
            </p>
          </div>

          <div className="bg-dark-light p-8 rounded-xl text-center hover:bg-dark-lighter transition-colors">
            <div className="w-16 h-16 bg-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCreditCard className="text-purple text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Thanh toán an toàn</h3>
            <p className="text-gray-400 text-sm">
              Hỗ trợ đa dạng phương thức thanh toán an toàn, bảo mật
            </p>
          </div>

          <div className="bg-dark-light p-8 rounded-xl text-center hover:bg-dark-lighter transition-colors">
            <div className="w-16 h-16 bg-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSmartphone className="text-purple text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Vé điện tử QR</h3>
            <p className="text-gray-400 text-sm">
              Nhận vé điện tử ngay lập tức, check-in nhanh chóng
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
