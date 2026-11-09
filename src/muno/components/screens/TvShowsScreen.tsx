import React from 'react';
import { ArrowLeft, Cast, Bell, Search, Lock } from 'lucide-react';
import { Movie } from '../../types';

interface TvShowsScreenProps {
  onBack: () => void;
  onMovieClick: (movie: Movie) => void;
  onSearchClick: () => void;
  onCastClick: () => void;
  onNotificationsClick: () => void;
}

export const TV_SHOWS_LIST: Movie[] = [
  {
    id: '67208',
    title: 'Sardar',
    vj: 'Vj Ice P',
    genre: 'TV Series',
    duration: '45m / ep',
    episodesCount: 4,
    description: 'A spy estranged from his family meets his police son.',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/g0ng7666.jpg',
    videoUrl: 'https://yuti.b-cdn.net/kafulaano/kafulaano42/Sardar 4.mp4',
    isLocked: false,
  },
  {
    id: '67201',
    title: 'Allegiance',
    vj: 'Vj Tom',
    genre: 'TV Series',
    duration: '50m / ep',
    episodesCount: 8,
    description: 'A young intelligence officer navigates undercover betrayal.',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/7wXk6917.jpg',
    videoUrl: 'https://munotech3.b-cdn.net/gugwa/gugwa42/Allegiance.mp4',
    isLocked: false,
  },
  {
    id: '67195',
    title: 'Last Seen',
    vj: 'Vj Nelly',
    genre: 'TV Series',
    duration: '48m / ep',
    episodesCount: 6,
    description: 'A frantic search ensues through high-stakes urban sprawl.',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/4l6v2894.jpg',
    videoUrl: 'https://munotech2.b-cdn.net/kabuzi/kabuzi42/Last Seen.mp4',
    isLocked: false,
  },
  {
    id: '67110',
    title: 'Dream to You',
    vj: 'Vj Ivo',
    genre: 'TV Series / Romance',
    duration: '60m / ep',
    episodesCount: 12,
    description: 'Two aspiring musicians cross paths under rain-slicked city lights.',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/3x224802.jpg',
    videoUrl: 'https://yuti.b-cdn.net/kafulaano/kafulaano42/Dream to You.mp4',
    isLocked: false,
  },
  {
    id: '67067',
    title: 'Carrie',
    vj: 'Vj Junior',
    genre: 'TV Series / Horror',
    duration: '45m / ep',
    episodesCount: 3,
    description: 'Supernatural fury unleashed in an unrelenting high school drama.',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/QAVC1691.jpg',
    videoUrl: 'https://yuti.b-cdn.net/kafulaano/kafulaano42/Carrie (EPS 3).mp4',
    isLocked: false,
  },
  {
    id: '67158',
    title: 'Pegasus Market',
    vj: 'Vj Ivo',
    genre: 'TV Series / Comedy',
    duration: '52m / ep',
    episodesCount: 16,
    description: 'Chaos and heartwarming humor collide in a quirky suburban superstore.',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/pZce8619.jpg',
    videoUrl: 'https://nkuba.b-cdn.net/cleve48/cfr/1-Pegasus.Market.mp4',
    isLocked: false,
  },
  {
    id: '67134',
    title: 'Our Sticky Love',
    vj: 'Vj Ivo',
    genre: 'TV Series / Romance',
    duration: '48m / ep',
    episodesCount: 10,
    description: 'Unlikely sweethearts navigate cultural barriers and funny mishaps.',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/LHl36422.jpg',
    videoUrl: 'https://harvetz.b-cdn.net/hvt43/kai43/1-Our Sticky Love.mp4',
    isLocked: false,
  },
  {
    id: '66270',
    title: 'The Last Ship',
    vj: 'Vj Junior',
    genre: 'TV Series / Action',
    duration: '45m / ep',
    episodesCount: 10,
    description: 'A naval destroyer crew seeks a global cure across dangerous open waters.',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/xMGuOFwEE92204.jpg',
    videoUrl: 'https://yuti.b-cdn.net/kafulaano/kafulaano42/The Last Ship.mp4',
    isLocked: false,
  },
  {
    id: '66970',
    title: 'Mobland Season 2',
    vj: 'Vj Junior',
    genre: 'TV Series / Crime',
    duration: '50m / ep',
    episodesCount: 21,
    description: 'Underworld crime families clash in tense dockyard power plays.',
    posterUrl: 'https://apposters.b-cdn.net/laba/yo/naki/tE4G7649.jpg',
    videoUrl: 'https://yuti.b-cdn.net/kafulaano/kafulaano42/Mobland Season 2.mp4',
    isLocked: false,
  },
];

export const TvShowsScreen: React.FC<TvShowsScreenProps> = ({
  onBack,
  onMovieClick,
  onSearchClick,
  onCastClick,
  onNotificationsClick,
}) => {
  return (
    <div className="min-h-full bg-[#05051F] text-white flex flex-col pb-20 select-none">
      {/* Top Header matching Screenshot_20261018_102907_Munowatch.jpg */}
      <div className="h-14 px-4 flex items-center justify-between sticky top-0 bg-[#05051F]/95 backdrop-blur-md z-30 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-white hover:text-[#00D522] transition-colors focus:outline-none"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h2 className="text-white text-lg font-bold tracking-tight">Tv shows</h2>
        </div>

        <div className="flex items-center space-x-3.5">
          <button onClick={onCastClick} className="p-1 text-white hover:opacity-80">
            <Cast className="w-5 h-5 stroke-[2]" />
          </button>
          <button onClick={onNotificationsClick} className="p-1 text-white hover:opacity-80 relative">
            <Bell className="w-5 h-5 stroke-[2]" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#00D522] rounded-full"></span>
          </button>
          <button onClick={onSearchClick} className="p-1 text-white hover:text-[#00D522]">
            <Search className="w-5 h-5 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* 3-Column Dense Poster Grid matching Screenshot 102907 */}
      <div className="p-2 grid grid-cols-3 gap-2">
        {TV_SHOWS_LIST.map((movie) => (
          <div
            key={movie.id}
            onClick={() => onMovieClick(movie)}
            className="relative aspect-[2/3] rounded-md overflow-hidden bg-[#111128] cursor-pointer group shadow-sm transition-transform duration-200 group-hover:scale-[1.02]"
          >
            {movie.posterUrl && (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Lock icon */}
            {movie.isLocked && (
              <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs p-0.5 rounded">
                <Lock className="w-3 h-3 text-white" />
              </div>
            )}

            {/* Green EPS Badge top right matching Screenshot 102907 */}
            <div className="absolute top-1 right-1 px-1 py-0.5 rounded bg-black/40 text-[9px] font-bold text-[#00D522]">
              {movie.episodesCount ? `EPS ${movie.episodesCount}` : 'EPS'}
            </div>

            {/* Title */}
            <div className="absolute inset-x-0 bottom-0 p-1 text-center">
              <p className="text-white text-[10px] font-bold truncate leading-tight uppercase">
                {movie.title}
              </p>
              <p className="text-[#00D522] text-[9px] font-medium truncate">
                {movie.vj}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
