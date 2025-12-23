import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay } from 'react-icons/fi';
import TrailerModal from './TrailerModal';

export default function MovieCard({ movie, showBookButton = false }) {
  const [showTrailer, setShowTrailer] = useState(false);

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/
    );
    return match ? match[1] : null;
  };

  const youtubeId = extractYouTubeId(movie.trailer);

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (youtubeId) {
      setShowTrailer(true);
    }
  };

  return (
    <>
      <div className="movie-card group">
        <Link to={`/movies/${movie.id}`} className="block">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
            <img
              src={movie.thumbnail}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Play Button - Shows on hover */}
            {youtubeId && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={handlePlayClick}
                  className="bg-purple hover:bg-purple-dark text-white p-4 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg shadow-purple/50"
                >
                  <FiPlay size={32} className="ml-1" />
                </button>
              </div>
            )}

            {/* Overlay on hover with Book button */}
            {showBookButton && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <Link
                    to={`/movies/${movie.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="block w-full bg-white hover:bg-gray-200 text-dark py-2 rounded-lg font-semibold text-sm text-center transition-colors"
                  >
                    Đặt vé
                  </Link>
                </div>
              </div>
            )}

            {/* Rating badge */}
            {movie.rating && (
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
                <span className="text-yellow-400 text-sm">⭐</span>
                <span className="text-white text-sm font-semibold">
                  {movie.rating}
                </span>
              </div>
            )}

            {/* Age limit badge */}
            {movie.ageLimit && (
              <div className="absolute top-3 left-3 bg-purple/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">
                {movie.ageLimit}
              </div>
            )}

            {/* Status badge */}
            {movie.status && (
              <div className="absolute bottom-3 left-3 bg-purple/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold">
                {movie.status}
              </div>
            )}
          </div>

          <div className="mt-3">
            <h3 className="font-semibold text-white line-clamp-2 group-hover:text-purple transition-colors min-h-[3rem]">
              {movie.title}
            </h3>
            <p className="text-sm text-gray-400 mt-1 line-clamp-1">
              {movie.genre}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                {movie.duration} phút
              </span>
              {movie.startDate && (
                <span className="text-xs text-gray-400 font-medium">
                  {new Date(movie.startDate).toLocaleDateString('vi-VN')}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Trailer Modal */}
      {showTrailer && youtubeId && (
        <TrailerModal
          youtubeId={youtubeId}
          title={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </>
  );
}
