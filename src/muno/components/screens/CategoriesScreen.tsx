import React, { useState, useMemo } from 'react';
import { ArrowLeft, Cast, Bell, Search, Check, X } from 'lucide-react';
import { Movie } from '../../types';
import { filterCatalog } from '../../services/catalogFilters';

interface CategoriesScreenProps {
  onBack: () => void;
  onMovieClick: (movie: Movie) => void;
  onSearchClick: () => void;
  onCastClick: () => void;
  onNotificationsClick: () => void;
  onSelectCategory: (name: string, type: 'genre' | 'veejay') => void;
  /** Live server catalog; genres and VJs with no titles are hidden. */
  catalog?: Movie[];
}

export const GENRES: string[] = [
  'Action',
  'Horror',
  'Series',
  'Adventure',
  'Love Story',
  'Comedy',
  'Crime',
  'Family',
  'Sci FI',
  'Romance',
  'Kungu Fu',
  'Drama',
  'Sport',
  'Thriller',
  'Animation',
];

export const VEEJAYS: string[] = [
  'Vj Junior',
  'Vj Emmy',
  'Vj Ice P',
  'Vj Tom',
  'Vj Ulio',
  'Vj Jingo',
  'Vj Jovan',
  'Vj Shao Khan',
  'Vj Sammy',
  'Vj Nelly',
  'Vj Soul',
  'Vj Kevo',
  'Vj Kevin',
  'Vj Kriss Sweet',
  'Vj Hd',
  'Vj Dan De',
];

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  onBack,
  onSearchClick,
  onCastClick,
  onNotificationsClick,
  onSelectCategory,
  catalog = [],
}) => {
  const [isGenreSelected, setIsGenreSelected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [filterQuery, setFilterQuery] = useState<string>('');

  const handleTabSwitch = (toGenre: boolean) => {
    if (toGenre === isGenreSelected) return;
    setIsLoading(true);
    setIsGenreSelected(toGenre);
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  };

  // Only list genres and VJs that actually have titles in the live catalog.
  // While the catalog is still loading, show the full lists.
  const availableGenres = useMemo(
    () => (catalog.length ? GENRES.filter((g) => filterCatalog(catalog, g, 'genre').length > 0) : GENRES),
    [catalog]
  );
  const availableVeejays = useMemo(
    () => (catalog.length ? VEEJAYS.filter((v) => filterCatalog(catalog, v, 'veejay').length > 0) : VEEJAYS),
    [catalog]
  );

  const filteredGenres = useMemo(() => {
    if (!filterQuery.trim()) return availableGenres;
    return availableGenres.filter((g) =>
      g.toLowerCase().includes(filterQuery.trim().toLowerCase())
    );
  }, [availableGenres, filterQuery]);

  const filteredVeejays = useMemo(() => {
    if (!filterQuery.trim()) return availableVeejays;
    return availableVeejays.filter((v) =>
      v.toLowerCase().includes(filterQuery.trim().toLowerCase())
    );
  }, [availableVeejays, filterQuery]);

  return (
    <div className="min-h-full bg-[#05051F] text-white flex flex-col pb-24 select-none animate-fadeIn">
      {/* Top Header matching exact screenshot: Title is "Genres", Back arrow, Cast, Notifications, Search */}
      <div className="h-14 px-4 flex items-center justify-between sticky top-0 bg-[#05051F] z-30 border-b border-white/[0.04]">
        <div className="flex items-center space-x-4 min-w-0">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-white hover:text-[#00D522] transition-colors focus:outline-none cursor-pointer flex-shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-white text-[19px] font-bold tracking-tight truncate">
            {isGenreSelected ? 'Genres' : 'Veejays'}
          </h1>
        </div>

        <div className="flex items-center space-x-3.5 flex-shrink-0">
          <button
            onClick={onCastClick}
            className="p-1 text-white hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Cast to TV"
          >
            <Cast className="w-[20px] h-[20px] stroke-[2]" />
          </button>
          <button
            onClick={onNotificationsClick}
            className="p-1 text-white hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-[20px] h-[20px] stroke-[2]" />
          </button>
          <button
            onClick={() => {
              if (isSearchOpen) {
                setFilterQuery('');
                setIsSearchOpen(false);
              } else {
                setIsSearchOpen(true);
              }
            }}
            className={`p-1 transition-colors cursor-pointer ${
              isSearchOpen ? 'text-[#00D522]' : 'text-white hover:text-[#00D522]'
            }`}
            aria-label="Filter categories"
          >
            <Search className="w-[20px] h-[20px] stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Optional In-Page Search Bar */}
      {isSearchOpen && (
        <div className="px-4 py-2 bg-[#0A0A2C] border-b border-white/[0.06] flex items-center space-x-2 animate-fadeIn">
          <Search className="w-4 h-4 text-[#8E8E9F] flex-shrink-0" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={`Filter ${isGenreSelected ? 'genres' : 'veejays'}...`}
            autoFocus
            className="w-full bg-transparent text-white placeholder-[#8E8E9F] text-sm focus:outline-none"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="p-1 text-[#8E8E9F] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Subtabs matching Screenshot 092617 & 092619 & Flutter categories_screen.dart:
          Horizontal Row with Icon on left and Text on right, evenly spaced */}
      <div className="py-3 flex items-center justify-around border-b border-white/[0.04]">
        {/* Genre Subtab */}
        <button
          onClick={() => handleTabSwitch(true)}
          className="flex items-center space-x-2 py-1 px-6 focus:outline-none cursor-pointer transition-colors"
        >
          {isGenreSelected ? (
            <Check className="w-5 h-5 text-[#00D522] stroke-[2.5]" />
          ) : (
            /* Material Icons.filter_list equivalent: 3 centered decreasing horizontal lines */
            <svg
              className="w-5 h-5 text-[#8E8E9F]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <line x1="5" y1="7" x2="19" y2="7" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="17" x2="13" y2="17" />
            </svg>
          )}
          <span
            className={`text-[15px] font-semibold tracking-tight ${
              isGenreSelected ? 'text-white' : 'text-[#8E8E9F]'
            }`}
          >
            Genre
          </span>
        </button>

        {/* Veejays Subtab */}
        <button
          onClick={() => handleTabSwitch(false)}
          className="flex items-center space-x-2 py-1 px-6 focus:outline-none cursor-pointer transition-colors"
        >
          {!isGenreSelected ? (
            <Check className="w-5 h-5 text-[#00D522] stroke-[2.5]" />
          ) : (
            <svg
              className="w-5 h-5 text-[#8E8E9F]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <line x1="5" y1="7" x2="19" y2="7" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="17" x2="13" y2="17" />
            </svg>
          )}
          <span
            className={`text-[15px] font-semibold tracking-tight ${
              !isGenreSelected ? 'text-white' : 'text-[#8E8E9F]'
            }`}
          >
            Veejays
          </span>
        </button>
      </div>

      {/* List Area */}
      <div className="flex-1 px-5 pt-3 pb-6">
        {isLoading ? (
          /* Shimmer Skeleton Loading State matching Screenshot_20261018_184550_Munowatch.jpg */
          <div className="space-y-4 pt-1">
            {Array.from({ length: 14 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-5 h-5 rounded-full bg-[#181836] animate-pulse" />
                <div
                  className="w-28 h-[16px] rounded-[3px] bg-gradient-to-r from-[#181836] via-[#353556] to-[#181836] animate-pulse"
                  style={{
                    animationDelay: `${index * 35}ms`,
                  }}
                />
              </div>
            ))}
          </div>
        ) : isGenreSelected ? (
          /* Genre List matching Screenshot_20261018_092617_Munowatch.jpg:
             Green water droplet icon on left, genre title in white on right */
          <div className="space-y-1">
            {filteredGenres.map((genre) => (
              <div
                key={genre}
                onClick={() => onSelectCategory(genre, 'genre')}
                className="flex items-center space-x-4 py-3 px-2 hover:bg-white/[0.04] active:bg-white/[0.08] rounded-md transition-colors cursor-pointer group"
              >
                {/* Green water droplet icon matching Material Icons water_drop */}
                <div className="w-6 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-[19px] h-[19px] text-[#00D522] fill-[#00D522]"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
                  </svg>
                </div>
                <span className="text-white text-[16px] font-medium group-hover:text-[#00D522] transition-colors flex-1">
                  {genre}
                </span>
              </div>
            ))}
            {filteredGenres.length === 0 && (
              <div className="py-12 text-center text-[#8E8E9F]">
                <p className="text-sm">No genres match "{filterQuery}"</p>
              </div>
            )}
          </div>
        ) : (
          /* Veejays List matching Screenshot_20261018_092619_Munowatch.jpg:
             Green account_circle icon on left, Veejay name in white on right */
          <div className="space-y-1">
            {filteredVeejays.map((vj) => (
              <div
                key={vj}
                onClick={() => onSelectCategory(vj, 'veejay')}
                className="flex items-center space-x-4 py-3 px-2 hover:bg-white/[0.04] active:bg-white/[0.08] rounded-md transition-colors cursor-pointer group"
              >
                {/* Green account circle icon matching Material Icons account_circle */}
                <div className="w-6 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-[20px] h-[20px] text-[#00D522] fill-[#00D522]"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z" />
                  </svg>
                </div>
                <span className="text-white text-[16px] font-medium group-hover:text-[#00D522] transition-colors flex-1">
                  {vj}
                </span>
              </div>
            ))}
            {filteredVeejays.length === 0 && (
              <div className="py-12 text-center text-[#8E8E9F]">
                <p className="text-sm">No veejays match "{filterQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
