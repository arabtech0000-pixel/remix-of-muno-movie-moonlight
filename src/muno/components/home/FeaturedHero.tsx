// @ts-nocheck -- imported app code; strict typing not yet applied
import React, { useState, useEffect } from 'react';
import { Cast, Bell, Search, Play } from 'lucide-react';
import { Movie } from '../../types';

import munnoLogo from '../../assets/munno_movies_logo.png';

interface FeaturedHeroProps {
  movies: Movie[];
  onHomeClick?: () => void;
  onSearchClick: () => void;
  onCastClick: () => void;
  onNotificationsClick: () => void;
  onWatchNowClick: (movie: Movie) => void;
  onMovieClick: (movie: Movie) => void;
}

export const FeaturedHero: React.FC<FeaturedHeroProps> = ({
  movies,
  onHomeClick,
  onSearchClick,
  onCastClick,
  onNotificationsClick,
  onWatchNowClick,
  onMovieClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!movies || movies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 10000); // 10 seconds auto-switch
    return () => clearInterval(interval);
  }, [movies?.length]);

  if (!movies || movies.length === 0) return null;
  const currentMovie = movies[currentIndex] || movies[0];

  const bannerUrl =
    currentMovie.heroBannerUrl ||
    currentMovie.posterUrl ||
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="relative w-full overflow-hidden select-none bg-[#05051F]">
      {/* Hero Container */}
      <div
        onClick={() => onMovieClick(currentMovie)}
        className="relative w-full h-[470px] sm:h-[520px] flex flex-col justify-between cursor-pointer group"
      >
        {/* Background Banner Image - Highly optimized single element */}
        <div className="absolute inset-0 z-0 bg-[#080824] overflow-hidden">
          <img
            key={currentMovie.id || currentIndex}
            src={bannerUrl}
            alt={currentMovie.title}
            className="w-full h-full object-cover object-top sm:object-center opacity-90 transition-opacity duration-700 ease-out"
          />

          {/* Top subtle vignette for icon clarity */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />

          {/* Deep bottom fade that seamlessly blends with the dark background */}
          <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#05051F] via-[#05051F]/80 to-transparent pointer-events-none z-10" />
        </div>

        {/* Top Header Bar - Uploaded MM icon used as Home button */}
        <div className="relative z-20 h-16 px-4 pt-3 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onHomeClick) {
                onHomeClick();
              }
            }}
            className="flex items-center cursor-pointer select-none focus:outline-none group/icon active:scale-95 transition-transform"
            aria-label="Home"
            title="Munno Movies - Home"
          >
            <img
              src={munnoLogo}
              alt="Munno Movies"
              className="h-10 w-10 sm:h-11 sm:w-11 object-cover rounded-xl opacity-80 hover:opacity-100 transition-opacity duration-200"
            />
          </button>

          {/* Right Action Icons: Cast, Bell, Search */}
          <div className="flex items-center space-x-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onCastClick}
              className="text-white/90 hover:text-white transition-opacity focus:outline-none cursor-pointer p-1"
              aria-label="Cast screen"
            >
              <Cast className="w-[22px] h-[22px] stroke-[2]" />
            </button>
            <button
              onClick={onNotificationsClick}
              className="text-white/90 hover:text-white transition-opacity focus:outline-none cursor-pointer p-1"
              aria-label="Notifications"
            >
              <Bell className="w-[22px] h-[22px] stroke-[2]" />
            </button>
            <button
              onClick={onSearchClick}
              className="text-white/90 hover:text-[#00D522] transition-colors focus:outline-none cursor-pointer p-1"
              aria-label="Search movies"
            >
              <Search className="w-[22px] h-[22px] stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Bottom Hero Metadata & Play Action */}
        <div className="relative z-20 px-4 pb-6 pt-10 mt-auto flex flex-col justify-end">
          {/* Movie Title and VJ tag */}
          <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg tracking-tight flex items-baseline flex-wrap gap-2">
            <span>{currentMovie.title || `Movie ${currentMovie.id}`}</span>
            <span className="text-[#00D522] text-sm sm:text-base font-bold">
              : {currentMovie.vj || 'Vj Emmy'}
            </span>
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-[13px] text-neutral-200 line-clamp-2 max-w-md drop-shadow mt-1 leading-relaxed">
            {currentMovie.description}
          </p>

          {/* Play Button & Watch Now row */}
          <div className="flex items-center justify-between mt-4">
            <div
              className="flex items-center space-x-3 group/btn cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onWatchNowClick(currentMovie);
              }}
            >
              <div className="w-12 h-12 rounded-full bg-[#00D522] hover:bg-[#00c21e] flex items-center justify-center text-black shadow-lg shadow-[#00D522]/30 group-hover/btn:scale-105 transition-transform active:scale-95">
                <Play className="w-6 h-6 fill-black text-black ml-0.5" />
              </div>
              <span className="text-white text-[15px] font-bold drop-shadow tracking-wide group-hover/btn:text-[#00D522] transition-colors">
                Watch Now
              </span>
            </div>

            {/* Dots indicator for banner carousel */}
            <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
              {movies.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    dotIdx === currentIndex
                      ? 'w-6 bg-[#00D522]'
                      : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
