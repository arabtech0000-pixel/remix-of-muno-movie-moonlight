import React from 'react';
import { Cast, Bell, Search } from 'lucide-react';

interface HeaderProps {
  onSearchClick: () => void;
  onCastClick?: () => void;
  onNotificationsClick?: () => void;
  activeScreen?: string;
  onBackClick?: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchClick,
  onCastClick,
  onNotificationsClick,
  activeScreen = 'home',
  onBackClick,
  title,
}) => {
  // If we are on a secondary screen with title (like Saved, Genres, Detail, etc.)
  if (title || (activeScreen !== 'home' && activeScreen !== 'menu')) {
    return (
      <header className="h-14 px-4 flex items-center justify-between bg-[#05051F] sticky top-0 z-30 transition-all">
        <div className="flex items-center space-x-3">
          {onBackClick && (
            <button
              onClick={onBackClick}
              className="p-1 -ml-1 text-white hover:text-[#00D522] transition-colors focus:outline-none"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
          <h1 className="text-white text-lg font-bold tracking-tight">
            {title || 'MunoWatch'}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onCastClick}
            className="text-white hover:opacity-80 transition-opacity focus:outline-none"
            aria-label="Chromecast"
          >
            <Cast className="w-[22px] h-[22px] stroke-[2]" />
          </button>
          <button
            onClick={onNotificationsClick}
            className="text-white hover:opacity-80 transition-opacity focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="w-[22px] h-[22px] stroke-[2]" />
          </button>
          <button
            onClick={onSearchClick}
            className="text-white hover:text-[#00D522] transition-colors focus:outline-none"
            aria-label="Search"
          >
            <Search className="w-[22px] h-[22px] stroke-[2]" />
          </button>
        </div>
      </header>
    );
  }

  // Primary Home Screen Top Bar directly from Screenshot 6
  return (
    <header className="h-14 px-4 pt-1 flex items-center justify-between bg-transparent relative z-30">
      {/* Left: Munno Movies MM logo as Home button */}
      <div className="flex items-center cursor-pointer select-none">
        <img
          src="/munno_movies_logo.png"
          alt="Munno Movies"
          className="h-10 w-10 object-cover rounded-xl shadow-lg border border-white/20 hover:border-[#00D522] transition-colors"
        />
      </div>

      {/* Right: Cast, Bell, Search icons - exact size and alignment as in Screenshot 6 */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onCastClick}
          className="text-white hover:opacity-80 transition-opacity focus:outline-none"
          title="Cast"
          aria-label="Chromecast"
        >
          <Cast className="w-[22px] h-[22px] stroke-[2]" />
        </button>
        <button
          onClick={onNotificationsClick}
          className="text-white hover:opacity-80 transition-opacity focus:outline-none"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-[22px] h-[22px] stroke-[2]" />
        </button>
        <button
          onClick={onSearchClick}
          className="text-white hover:text-[#00D522] transition-colors focus:outline-none"
          title="Search"
          aria-label="Search"
        >
          <Search className="w-[22px] h-[22px] stroke-[2]" />
        </button>
      </div>
    </header>
  );
};
