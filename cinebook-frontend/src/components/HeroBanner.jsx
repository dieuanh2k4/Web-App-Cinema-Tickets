import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import { Link } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

export default function HeroBanner({ movies = [], isLoading }) {
  if (isLoading) {
    return (
      <div className="relative w-full h-[600px] bg-dark-light animate-pulse">
        <div className="container-custom h-full flex items-center">
          <div className="space-y-4 max-w-2xl">
            <div className="h-12 bg-gray-custom/30 rounded w-3/4"></div>
            <div className="h-4 bg-gray-custom/30 rounded w-full"></div>
            <div className="h-4 bg-gray-custom/30 rounded w-5/6"></div>
            <div className="h-12 bg-gray-custom/30 rounded w-40 mt-6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!movies || movies.length === 0) {
    return null
  }

  return (
    <div className="relative w-full">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="hero-swiper h-[600px]"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div className="relative w-full h-full">
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${movie.thumbnail})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <div className="container-custom relative h-full flex items-center">
                <div className="max-w-2xl space-y-6 z-10">
                  {/* Badge */}
                  <div className="inline-flex items-center space-x-2 bg-purple/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="w-2 h-2 bg-purple rounded-full animate-pulse"></span>
                    <span className="text-sm font-semibold text-purple uppercase tracking-wider">
                      {movie.status || 'Đang chiếu'}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                    {movie.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                    <span className="flex items-center space-x-2">
                      <span className="text-yellow-400">⭐</span>
                      <span>{movie.rating || 'N/A'}</span>
                    </span>
                    <span>•</span>
                    <span>{movie.duration} phút</span>
                    <span>•</span>
                    <span>{movie.genre}</span>
                    <span>•</span>
                    <span className="px-2 py-1 bg-gray-custom/50 rounded">
                      {movie.ageLimit}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 line-clamp-3 max-w-xl">
                    {movie.description}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Link
                      to={`/movies/${movie.id}`}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <span>ĐẶT VÉ NGAY</span>
                      <span>→</span>
                    </Link>
                    <Link
                      to={`/movies/${movie.id}`}
                      className="btn-secondary"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
