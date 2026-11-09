// @ts-nocheck -- imported app code; strict typing not yet applied
import React from 'react';
import { ArrowLeft, Cast, Bell, Search, Download, ChevronRight, Lock } from 'lucide-react';
import { Movie } from '../../types';
import { MoviePoster } from '../common/MoviePoster';

interface RecentlyWatchedScreenProps {
  onBack: () => void;
  onMovieClick: (movie: Movie) => void;
  onSearchClick: () => void;
  onCastClick: () => void;
  onNotificationsClick: () => void;
}

export const RECENTLY_WATCHED_ITEMS: Array<{
  id: string;
  title: string;
  description: string;
  size: string;
  duration: string;
  posterUrl: string;
  hasDownload: boolean;
}> = [
  {
    id: '67110',
    title: 'Dream to You | Vj Ivo',
    description: 'Two aspiring musicians cross paths under rain-slicked city lights and strive to overcome musical rivalries.',
    size: '870.31 MB',
    duration: '01h 38m',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/3x224802.jpg',
    hasDownload: true,
  },
  {
    id: '67201',
    title: 'Allegiance | Vj Tom',
    description: 'A young intelligence officer discovers dangerous covert operations in modern urban espionage.',
    size: '750.24 MB',
    duration: '01h 45m',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/7wXk6917.jpg',
    hasDownload: false,
  },
  {
    id: '67067',
    title: 'Carrie | Vj Junior',
    description: 'Supernatural fury unleashed in an unrelenting high school drama as telekinetic power awakens.',
    size: '950.50 MB',
    duration: '01h 45m',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/QAVC1691.jpg',
    hasDownload: true,
  },
  {
    id: '66970',
    title: 'Mobland Season 2 | Vj Junior',
    description: 'Underworld crime syndicates clash in dockyard territory battles and high-stakes law enforcement raids.',
    size: '890.15 MB',
    duration: '01h 50m',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/tE4G7649.jpg',
    hasDownload: true,
  },
  {
    id: '67228',
    title: 'The Florist | Vj Emmy',
    description: 'An undercover botanist with a lethal covert past gets pulled back into contract espionage.',
    size: '1.25 GB',
    duration: '01h 42m',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/NTyd3253.jpg',
    hasDownload: false,
  },
  {
    id: '67222',
    title: 'Masterplan | Vj Junior',
    description: 'A master thief enlists two strangers for an audacious museum heist targeting high-value royal artifacts.',
    size: '1.50 GB',
    duration: '01h 41m',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/eRNL9536.jpg',
    hasDownload: true,
  },
];

export const RecentlyWatchedScreen: React.FC<RecentlyWatchedScreenProps> = ({
  onBack,
  onMovieClick,
  onSearchClick,
  onCastClick,
  onNotificationsClick,
}) => {
  return (
    <div className="min-h-full bg-[#05051F] text-white flex flex-col pb-24 select-none animate-fadeIn">
      {/* Top Header matching Screenshot 16 */}
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
            You recently watch...
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

      {/* List items matching Screenshot 16 */}
      <div className="divide-y divide-white/[0.03]">
        {RECENTLY_WATCHED_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() =>
              onMovieClick({
                id: item.id,
                title: item.title.split(' | ')[0],
                vj: item.title.split(' | ')[1] || 'Vj Junior',
                genre: 'Series',
                duration: item.duration,
                description: item.description,
                posterUrl: item.posterUrl,
                isLocked: true,
                fileSize: item.size,
              })
            }
            className="px-4 py-3 flex items-start space-x-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            {/* Square Poster with Lock Badge */}
            <div className="relative w-20 h-20 rounded-md overflow-hidden bg-[#111128] flex-shrink-0">
              <MoviePoster
                src={item.posterUrl}
                alt={item.title}
                title={item.title}
                isLocked
                aspectRatio="aspect-square"
              />
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0 pr-1">
              <h3 className="text-white text-[14px] font-semibold leading-snug truncate">
                {item.title}
              </h3>
              <p className="text-[#8E8E9F] text-[11px] leading-relaxed line-clamp-2 mt-1">
                {item.description}
              </p>
              <div className="mt-2 flex items-center space-x-3">
                <span className="text-[#00D522] font-semibold text-[11px]">
                  {item.size}
                </span>
                <span className="text-[#8E8E9F] text-[11px]">
                  {item.duration}
                </span>
              </div>
            </div>

            {/* Right Action: Download or Chevron icon */}
            <div className="self-center pl-1 text-white">
              {item.hasDownload ? (
                <Download className="w-5 h-5 text-white stroke-[2]" />
              ) : (
                <ChevronRight className="w-5 h-5 text-white stroke-[2]" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
