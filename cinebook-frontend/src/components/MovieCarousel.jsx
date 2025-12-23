import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import MovieCard from './MovieCard'
import 'swiper/css'
import 'swiper/css/navigation'

export default function MovieCarousel({ movies = [], isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[2/3] bg-gray-custom/30 rounded-lg"></div>
            <div className="mt-3 h-4 bg-gray-custom/30 rounded w-3/4"></div>
            <div className="mt-2 h-3 bg-gray-custom/30 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        Không có phim nào
      </div>
    )
  }

  return (
    <Swiper
      slidesPerView={2}
      spaceBetween={20}
      navigation={true}
      modules={[Navigation]}
      breakpoints={{
        640: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 24,
        },
      }}
      className="movie-carousel"
    >
      {movies.map((movie) => (
        <SwiperSlide key={movie.id}>
          <MovieCard movie={movie} showBookButton={true} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
