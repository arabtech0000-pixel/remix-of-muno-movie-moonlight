// @ts-nocheck -- imported app code; strict typing not yet applied
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Cast, Bell, Search, X } from 'lucide-react';
import { Movie } from '../../types';
import { MoviePoster } from '../common/MoviePoster';

interface CategoryDetailScreenProps {
  categoryTitle: string;
  categoryType?: 'genre' | 'veejay';
  movies: Movie[];
  onBack: () => void;
  onMovieClick: (movie: Movie) => void;
  onSearchClick: () => void;
  onCastClick: () => void;
  onNotificationsClick: () => void;
}

export const CategoryDetailScreen: React.FC<CategoryDetailScreenProps> = ({
  categoryTitle,
  categoryType = 'genre',
  movies,
  onBack,
  onMovieClick,
  onSearchClick: _onGlobalSearchClick,
  onCastClick,
  onNotificationsClick,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) return movies;
    const q = searchQuery.toLowerCase().trim();
    return movies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.vj.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q) ||
        (m.secondaryLabel && m.secondaryLabel.toLowerCase().includes(q))
    );
  }, [movies, searchQuery]);

  return (
    <div className="min-h-full bg-[#05051F] text-white flex flex-col pb-24 select-none animate-fadeIn">
      {/* Top Header matching Screenshots 201123 & 201136:
          Back arrow, dynamic Title (e.g. "Vj Junior" or "Action"), Cast, Bell, Search */}
      <div className="h-14 px-4 flex items-center justify-between sticky top-0 bg-[#05051F] z-30 border-b border-white/[0.04]">
        <div className="flex items-center space-x-3.5 min-w-0">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-white hover:text-[#00D522] transition-colors focus:outline-none cursor-pointer flex-shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <div className="min-w-0">
            <h1 className="text-white text-[19px] font-bold tracking-tight truncate">
              {categoryTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3.5 flex-shrink-0">
          <button
            onClick={onCastClick}
            className="text-white hover:opacity-80 transition-opacity focus:outline-none cursor-pointer"
            aria-label="Cast to TV"
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
            onClick={() => {
              if (isSearchOpen) {
                setSearchQuery('');
                setIsSearchOpen(false);
              } else {
                setIsSearchOpen(true);
              }
            }}
            className={`p-1 transition-colors focus:outline-none cursor-pointer ${
              isSearchOpen ? 'text-[#00D522]' : 'text-white hover:text-[#00D522]'
            }`}
            aria-label="Search within category"
          >
            <Search className="w-[20px] h-[20px] stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Expandable in-screen search bar */}
      {isSearchOpen && (
        <div className="px-3.5 py-2 bg-[#0A0A2C] border-b border-white/[0.06] flex items-center space-x-2 animate-fadeIn">
          <Search className="w-4 h-4 text-[#8E8E9F] flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${categoryTitle}...`}
            autoFocus
            className="w-full bg-transparent text-white placeholder-[#8E8E9F] text-sm focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-[#8E8E9F] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* 3-Column Dense Poster Grid directly beneath the app bar matching Screenshots 201123 & 201136 */}
      <div className="p-2.5 grid grid-cols-3 gap-2 content-start">
        {filteredMovies.map((movie) => (
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
              isLocked={movie.isLocked ?? true}
              episodesCount={movie.episodesCount}
              isPlaceholder={!movie.posterUrl || movie.posterUrl === 'placeholder'}
            />
          </div>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#8E8E9F] mt-12">
          <Search className="w-10 h-10 text-[#8E8E9F]/40 mb-3" />
          <p className="text-white text-sm font-semibold">
            {searchQuery ? `No movies found for "${searchQuery}"` : `No ${categoryType === 'veejay' ? categoryTitle + ' movies' : categoryTitle + ' titles'} available in the current catalog.`}
          </p>
          {searchQuery && <button
            onClick={() => setSearchQuery('')}
            className="mt-4 px-4 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            Clear Filter
          </button>}
        </div>
      )}
    </div>
  );
};
