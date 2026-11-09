// @ts-nocheck -- imported app code; strict typing not yet applied
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Cast, Bell, Search, Download, ChevronRight, LayoutGrid, List, Loader2, AlertCircle } from 'lucide-react';
import { Movie } from '../../types';
import { MoviePoster } from '../common/MoviePoster';
import { fetchDashboardData } from '../../services/api';

interface NewUploadsScreenProps {
  onBack: () => void;
  onMovieClick: (movie: Movie) => void;
  onSearchClick: () => void;
  onCastClick: () => void;
  onNotificationsClick: () => void;
}

export const NewUploadsScreen: React.FC<NewUploadsScreenProps> = ({
  onBack,
  onMovieClick,
  onSearchClick,
  onCastClick,
  onNotificationsClick,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchDashboardData().then(data => {
      if (data) {
        setMovies(data.latestMovies);
        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-full bg-[#05051F] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00D522]" />
      </div>
    );
  }

  if (error || !movies) {
    return (
      <div className="min-h-full bg-[#05051F] text-white flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Unable to load movies</h2>
        <p className="text-[#8E8E9F]">Please check your connection and try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#05051F] text-white flex flex-col pb-24 select-none animate-fadeIn">
      {/* Top Header */}
      <div className="h-14 px-4 flex items-center justify-between sticky top-0 bg-[#05051F] z-30 border-b border-white/[0.04]">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-white hover:text-[#00D522] transition-colors focus:outline-none cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-white text-[18px] font-bold tracking-tight">
            New uploads
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={onCastClick} className="p-1 text-white hover:opacity-80 transition-opacity cursor-pointer">
            <Cast className="w-[20px] h-[20px] stroke-[2]" />
          </button>
          <button onClick={onNotificationsClick} className="p-1 text-white hover:opacity-80 transition-opacity cursor-pointer">
            <Bell className="w-[20px] h-[20px] stroke-[2]" />
          </button>
          <button
            onClick={() => setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'))}
            className="p-1 text-white hover:text-[#00D522] transition-colors cursor-pointer"
          >
            {viewMode === 'grid' ? (
              <List className="w-[20px] h-[20px] stroke-[2]" />
            ) : (
              <LayoutGrid className="w-[20px] h-[20px] stroke-[2]" />
            )}
          </button>
          <button onClick={onSearchClick} className="p-1 text-white hover:opacity-80 transition-opacity cursor-pointer">
            <Search className="w-[20px] h-[20px] stroke-[2]" />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="p-2.5 grid grid-cols-3 gap-2 flex-1">
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onMovieClick(movie)}
              className="cursor-pointer group flex flex-col"
            >
              <MoviePoster
                src={movie.posterUrl}
                alt={movie.title}
                title={movie.title}
                vj={movie.vj}
                isLocked={movie.isLocked}
                episodesCount={movie.episodesCount}
                showOverlayText
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {movies.map((movie, idx) => (
            <div
              key={movie.id}
              onClick={() => onMovieClick(movie)}
              className="px-4 py-3 flex items-start space-x-3.5 hover:bg-white/[0.02] cursor-pointer group"
            >
              <div className="relative w-[78px] h-[78px] flex-shrink-0 rounded-[4px] overflow-hidden bg-[#111128]">
                <MoviePoster
                  src={movie.posterUrl}
                  alt={movie.title}
                  title={movie.title}
                  isLocked={movie.isLocked}
                  aspectRatio="aspect-square"
                />
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <h3 className="text-white text-[14px] font-bold truncate leading-tight group-hover:text-[#00D522] transition-colors">
                  {movie.title}
                </h3>
                <p className="text-[#8E8E9F] text-[11px] line-clamp-2 mt-1 leading-snug">
                  {movie.description}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  {movie.fileSize && (
                    <span className="text-[#00D522] font-semibold text-[12px]">
                      {movie.fileSize}
                    </span>
                  )}
                  <span className="text-white text-[12px] font-normal">
                    {movie.duration}
                  </span>
                </div>
              </div>

              <div className="self-center pl-1 text-white flex-shrink-0">
                {idx < 3 ? (
                  <button onClick={(e) => e.stopPropagation()} className="p-1 text-white hover:text-[#00D522] transition-colors focus:outline-none">
                    <Download className="w-5 h-5 stroke-[2]" />
                  </button>
                ) : (
                  <div className="p-1 text-white">
                    <ChevronRight className="w-5 h-5 stroke-[2]" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
