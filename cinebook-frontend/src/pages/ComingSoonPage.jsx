import { useQuery } from '@tanstack/react-query';
import { FiCalendar, FiClock, FiStar, FiUser, FiUsers } from 'react-icons/fi';
import { getMovies } from '../services/api';
import MovieCard from '../components/MovieCard';

export default function ComingSoonPage() {
  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: getMovies,
  });

  const comingSoon = movies?.filter((m) => m.status === 'Sắp chiếu') || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải phim...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Sắp <span className="text-purple">Chiếu</span>
          </h1>
          <p className="text-gray-400">{comingSoon.length} phim sắp ra mắt</p>
        </div>

        {/* Movies Grid */}
        {comingSoon.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Không có phim nào sắp chiếu</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {comingSoon.map((movie) => (
              <div key={movie.id}>
                {/* Movie Card - NO Book Button for coming soon */}
                <MovieCard movie={movie} showBookButton={false} />

                {/* Additional Info Card */}
                <div className="mt-3 space-y-2 text-sm">
                  {/* Release Date - Prominent for coming soon */}
                  <div className="bg-purple/10 border border-purple/30 rounded-lg p-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="text-purple" size={16} />
                      <div>
                        <p className="text-xs text-gray-400">Ngày khởi chiếu</p>
                        <p className="text-white font-bold">
                          {new Date(movie.startDate).toLocaleDateString(
                            'vi-VN',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rating & Duration */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <FiStar size={14} fill="currentColor" />
                      <span className="font-semibold">
                        {movie.rating?.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <FiClock size={14} />
                      <span>{movie.duration} phút</span>
                    </div>
                  </div>

                  {/* Director */}
                  {movie.director && (
                    <div className="flex items-start space-x-2">
                      <FiUser className="w-4 h-4 text-purple mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Đạo diễn</p>
                        <p className="text-white font-medium truncate">
                          {movie.director}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actors */}
                  {movie.actors && movie.actors.length > 0 && (
                    <div className="flex items-start space-x-2">
                      <FiUsers className="w-4 h-4 text-purple mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Diễn viên</p>
                        <p className="text-white font-medium line-clamp-2">
                          {movie.actors.slice(0, 2).join(', ')}
                          {movie.actors.length > 2 && '...'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
