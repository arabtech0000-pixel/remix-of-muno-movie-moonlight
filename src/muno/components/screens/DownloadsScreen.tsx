// @ts-nocheck -- imported app code; strict typing not yet applied
import React from 'react';
import { ArrowLeft, Cast, Bell, Search, Trash2, Download } from 'lucide-react';
import { Movie } from '../../types';
import { MoviePoster } from '../common/MoviePoster';

interface DownloadsScreenProps {
  onBack: () => void;
  onMovieClick: (movie: Movie) => void;
  onPlayMovie?: (movie: Movie) => void;
  onSearchClick: () => void;
  onCastClick: () => void;
  onNotificationsClick: () => void;
  downloadedMovies: Movie[];
  onDeleteDownload: (id: string) => void;
  onExploreClick: () => void;
}

export const DownloadsScreen: React.FC<DownloadsScreenProps> = ({
  onBack,
  onMovieClick,
  onPlayMovie,
  onSearchClick,
  onCastClick,
  onNotificationsClick,
  downloadedMovies = [],
  onDeleteDownload,
  onExploreClick,
}) => {
  return (
    <div className="min-h-full bg-[#05051F] text-white flex flex-col pb-24 select-none animate-fadeIn">
      {/* Top Header matching Screenshot 4 */}
      <div className="h-14 px-4 flex items-center justify-between sticky top-0 bg-[#05051F]/95 backdrop-blur-md z-30 border-b border-white/[0.04]">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-white hover:text-[#00D522] transition-colors focus:outline-none cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-white text-[18px] font-bold tracking-tight">
            Download history
          </h1>
        </div>

        <div className="flex items-center space-x-3.5">
          <button
            onClick={onCastClick}
            className="text-white hover:opacity-80 transition-opacity focus:outline-none cursor-pointer"
            aria-label="Cast"
          >
            <Cast className="w-[20px] h-[20px] stroke-[2]" />
          </button>
          <button
            onClick={onNotificationsClick}
            className="text-white hover:opacity-80 transition-opacity focus:outline-none cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-[20px] h-[20px] stroke-[2]" />
          </button>
          <button
            onClick={onSearchClick}
            className="text-white hover:text-[#00D522] transition-colors focus:outline-none cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-[20px] h-[20px] stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Body: Matching Screenshot 4 (Centered cloud icon and exact text) */}
      {downloadedMovies.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center min-h-[65vh]">
          {/* Cloud icon with down arrow matching Screenshot 4 */}
          <div className="mb-4 text-white">
            <svg
              className="w-16 h-16 mx-auto text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
            </svg>
          </div>

          <p className="text-white text-[13.5px] leading-relaxed max-w-[280px]">
            No download requests yet,<br />
            Find Something to Download.
          </p>

          <button
            onClick={onExploreClick}
            className="mt-6 px-5 py-2.5 rounded-full bg-[#00D522] hover:bg-[#02ec27] text-[#05051F] font-bold text-xs transition-colors cursor-pointer"
          >
            Find Movies to Download
          </button>
        </div>
      ) : (
        <div className="px-4 py-3 space-y-3 flex-1">
          <div className="flex items-center justify-between text-xs text-[#9292A5] px-1 pb-1">
            <span>{downloadedMovies.length} download requests</span>
            <span>Browser downloads</span>
          </div>

          {downloadedMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => (onPlayMovie ? onPlayMovie(movie) : onMovieClick(movie))}
              className="flex items-center space-x-3 bg-white/[0.03] hover:bg-white/[0.06] p-2.5 rounded-xl cursor-pointer border border-white/[0.04] transition-colors group"
            >
              <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
                <MoviePoster
                  src={movie.posterUrl}
                  alt={movie.title}
                  title={movie.title}
                  aspectRatio="aspect-[4/5]"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Download className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate group-hover:text-[#00D522] transition-colors">
                  {movie.title}
                </p>
                <p className="text-[#00D522] text-xs mt-0.5 font-medium">{movie.vj}</p>
                <p className="text-[#9292A5] text-[11px] mt-0.5">
                  {movie.fileSize ? `${movie.fileSize} • ` : ''}Download again
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDownload(movie.id);
                }}
                className="p-2 text-[#9292A5] hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                title="Remove from download history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
