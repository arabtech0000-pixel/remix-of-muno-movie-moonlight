import React from 'react';
import { ArrowLeft, Cast, Bell, Search } from 'lucide-react';
import { Movie } from '../../types';
import { MoviePoster } from '../common/MoviePoster';

interface ShowsScreenProps {
  onBack: () => void;
  onMovieClick: (movie: Movie) => void;
  onSearchClick: () => void;
  onCastClick: () => void;
  onNotificationsClick: () => void;
}

export const TV_SHOWS_LIST: Array<{
  id: string;
  title: string;
  vj: string;
  eps: string;
  posterUrl: string;
  isLocked: boolean;
}> = [
  {
    id: '67208',
    title: 'Sardar',
    vj: 'Vj Ice P',
    eps: 'EPS 4',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/g0ng7666.jpg',
    isLocked: false,
  },
  {
    id: '67201',
    title: 'Allegiance',
    vj: 'Vj Tom',
    eps: 'EPS 8',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/7wXk6917.jpg',
    isLocked: false,
  },
  {
    id: '67195',
    title: 'Last Seen',
    vj: 'Vj Nelly',
    eps: 'EPS 6',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/4l6v2894.jpg',
    isLocked: false,
  },
  {
    id: '67110',
    title: 'Dream to You',
    vj: 'Vj Ivo',
    eps: 'EPS 12',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/3x224802.jpg',
    isLocked: false,
  },
  {
    id: '67067',
    title: 'Carrie',
    vj: 'Vj Junior',
    eps: 'EPS 3',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/QAVC1691.jpg',
    isLocked: false,
  },
  {
    id: '67158',
    title: 'Pegasus Market',
    vj: 'Vj Ivo',
    eps: 'EPS 16',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/pZce8619.jpg',
    isLocked: false,
  },
  {
    id: '67134',
    title: 'Our Sticky Love',
    vj: 'Vj Ivo',
    eps: 'EPS 10',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/LHl36422.jpg',
    isLocked: false,
  },
  {
    id: '66270',
    title: 'The Last Ship',
    vj: 'Vj Junior',
    eps: 'EPS 10',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/xMGuOFwEE92204.jpg',
    isLocked: false,
  },
  {
    id: '66970',
    title: 'Mobland Season 2',
    vj: 'Vj Junior',
    eps: 'EPS 21',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/tE4G7649.jpg',
    isLocked: false,
  },
];

export const ShowsScreen: React.FC<ShowsScreenProps> = ({
  onBack,
  onMovieClick,
  onSearchClick,
  onCastClick,
  onNotificationsClick,
}) => {
  return (
    <div className="min-h-full bg-[#05051F] text-white flex flex-col pb-24 select-none animate-fadeIn">
      {/* Top Header matching Screenshot 15 */}
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
            Tv shows
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

      {/* 3-Column Dense Poster Grid matching Screenshot 15 */}
      <div className="p-3 grid grid-cols-3 gap-2.5 flex-1">
        {TV_SHOWS_LIST.map((show) => (
          <div
            key={show.id}
            onClick={() =>
              onMovieClick({
                id: show.id,
                title: show.title,
                vj: show.vj,
                genre: 'Series',
                duration: '45m / ep',
                description: `${show.title} episodic TV show streaming exclusively on MunoWatch with full translation.`,
                posterUrl: show.posterUrl,
                isLocked: show.isLocked,
              })
            }
            className="cursor-pointer group flex flex-col"
          >
            <MoviePoster
              src={show.posterUrl}
              alt={show.title}
              title={show.title}
              vj={show.vj}
              isLocked={show.isLocked}
              episodesCount={show.eps}
              showOverlayText
            />
          </div>
        ))}
      </div>
    </div>
  );
};
