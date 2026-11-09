// @ts-nocheck -- imported app code; strict typing not yet applied
import React, { useState } from 'react';
import {
  ArrowLeft,
  Cast,
  Bell,
  Search,
  Play,
  Lock,
  Download,
  Plus,
  Check,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { Movie } from '../../types';
import { MoviePoster } from '../common/MoviePoster';
import { PosterRow } from '../home/PosterRow';
import { filterCatalog } from '../../services/catalogFilters';
import { Button } from '@/components/ui/button';
import { SeriesEpisodesList } from './SeriesEpisodesList';
import { isSeriesMovie } from '../../services/seriesEpisodes';

interface MovieDetailScreenProps {
  movie: Movie;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: (movie: Movie) => void;
  onMovieClick: (movie: Movie) => void;
  onPlayMovie: (movie: Movie, episodes?: Movie[]) => void;
  onDownloadMovie: (movie: Movie) => void;
  onSearchClick: () => void;
  onCastClick: () => void;
  onNotificationsClick: () => void;
  onShowToast?: (msg: string) => void;
  relatedMovies?: Movie[];
  catalog?: Movie[];
  onSelectCategory?: (name: string) => void;
}



export const MovieDetailScreen: React.FC<MovieDetailScreenProps> = ({
  movie,
  onBack,
  isSaved,
  onToggleSave,
  onMovieClick,
  onPlayMovie,
  onDownloadMovie,
  onSearchClick,
  onCastClick,
  onNotificationsClick,
  onShowToast,
  relatedMovies,
  catalog = [],
  onSelectCategory,
}) => {
  const [likes, setLikes] = useState(482);
  const [hasLiked, setHasLiked] = useState(false);
  const [episodes, setEpisodes] = useState<Movie[]>([]);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
      if (onShowToast) onShowToast('Liked! Added to favorites');
    }
  };

  const handleDownloadClick = () => {
    onDownloadMovie(movie);
  };

  const isSeries = isSeriesMovie(movie);
  const playCurrent = () => onPlayMovie(movie, isSeries && episodes.length ? episodes : undefined);

  return (
    <div className="muno-detail min-h-full bg-[#05051F] text-white flex flex-col pb-24 select-none animate-fadeIn">
      {/* Top Header matching Screenshots 11 & 13 */}
      <div className="h-14 px-4 flex items-center justify-between sticky top-0 bg-[#05051F]/90 backdrop-blur-md z-30 border-b border-white/[0.04]">
        <button
          onClick={onBack}
          className="p-1 -ml-1 text-white hover:text-[#00D522] transition-colors focus:outline-none cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <div className="flex items-center space-x-3.5">
          <button onClick={onCastClick} className="p-1 text-white hover:opacity-80 cursor-pointer">
            <Cast className="w-[20px] h-[20px] stroke-[2]" />
          </button>
          <button onClick={onNotificationsClick} className="p-1 text-white hover:opacity-80 cursor-pointer">
            <Bell className="w-[20px] h-[20px] stroke-[2]" />
          </button>
          <button onClick={onSearchClick} className="p-1 text-white hover:opacity-80 cursor-pointer">
            <Search className="w-[20px] h-[20px] stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Hero Visual Area with Centered Poster and Green Play Button (Screenshots 11 & 13) */}
      <div className="muno-detail-hero relative w-full pt-3 pb-4 px-4 flex flex-col items-center bg-gradient-to-b from-[#07072C] to-[#05051F]">
        {/* Poster Card with Centered Large Green Play Button */}
        <div
          onClick={playCurrent}
          className="relative w-[185px] aspect-[2/2.8] rounded-md overflow-hidden shadow-2xl bg-[#111128] cursor-pointer group"
        >
          <MoviePoster
            src={movie.posterUrl}
            alt={movie.title}
            title={movie.title}
            vj={movie.vj}
            isLocked={movie.isLocked}
            aspectRatio="aspect-[2/2.8]"
          />

          {/* Centered Large Green Play Button matching Screenshots 11 & 13 */}
          <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#00D522] group-hover:bg-[#02ec27] group-hover:scale-110 flex items-center justify-center shadow-[0_0_24px_rgba(0,213,34,0.7)] transition-all z-20">
            <Play className="w-7 h-7 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Movie Details Section */}
      <div className="muno-detail-info px-5">
        {/* Title */}
        <h1 className="text-white text-[20px] font-bold tracking-tight text-center">
          {movie.title}
        </h1>

        {/* Metadata Row: Genre: Action   Vj Junior   Duration: 01h 41m */}
        <div className="mt-2 flex items-center justify-center space-x-3 text-[13px] flex-wrap">
          <span className="text-[#D0D0D8]">
            Genre: <strong className="text-white font-semibold">{movie.genre.split('/')[0].trim()}</strong>
          </span>
          <span className="text-[#00D522] font-bold">
            {movie.vj}
          </span>
          <span className="text-[#D0D0D8]">
            Duration: <strong className="text-white font-semibold">{movie.duration}</strong>
          </span>
        </div>

        {/* Download Button: White with Lock & Green Down Arrow (Screenshots 11 & 13) */}
        <div className="mt-4">
          <Button
            onClick={handleDownloadClick}
            variant="secondary" className="muno-download h-12 w-full lg:w-auto lg:min-w-[280px] lg:gap-4 justify-between rounded px-5 font-semibold"
          >
            <div className="w-6 flex items-center justify-start text-[#9292A5]">
              <Download className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-[#05051F] font-bold text-[16px]">
              Download{movie.fileSize ? ` (${movie.fileSize})` : ''}
            </span>
            <div className="w-6 flex items-center justify-end text-[#00D522]">
              <Download className="w-5 h-5 text-[#00D522] stroke-[2.5]" />
            </div>
          </Button>
        </div>

        {/* Description */}
        <p className="mt-4 text-[#D0D0D8] text-[13px] leading-relaxed">
          {movie.description}
        </p>

        {/* 18+ Narration: English to Luganda  17 hrs ago */}
        <div className="mt-4 flex items-center space-x-2.5 text-[12px] flex-wrap">
          <span className="px-1.5 py-0.5 rounded border border-white/30 text-white font-bold text-[11px]">
            {movie.rating || '18+'}
          </span>
          <span className="text-[#D0D0D8]">
            Narration:{' '}
            <strong className="text-[#00D522] font-semibold">
              {movie.narration || 'English to Luganda'}
            </strong>
          </span>
          <span className="text-[#9292A5]">
            {movie.uploadedTimeAgo || '17 hrs ago'}
          </span>
        </div>

        {/* Action Buttons: + Add MyList | Like | Share (Screenshots 11 & 13) */}
        <div className="mt-6 py-3 px-6 flex items-center justify-around border-t border-b border-white/[0.06]">
          {/* Add MyList */}
          <button
            onClick={() => {
              onToggleSave(movie);
              if (onShowToast) {
                onShowToast(isSaved ? 'Removed from MyList' : 'Added to MyList!');
              }
            }}
            className="flex flex-col items-center space-y-1 text-white hover:text-white/80 transition-colors focus:outline-none cursor-pointer"
          >
            {isSaved ? (
              <Check className="w-5 h-5 text-[#00D522] stroke-[2.5]" />
            ) : (
              <Plus className="w-5 h-5 stroke-[2.2]" />
            )}
            <span className="text-[12px] font-medium">
              {isSaved ? 'In MyList' : 'Add MyList'}
            </span>
          </button>

          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex flex-col items-center space-y-1 transition-colors focus:outline-none cursor-pointer ${
              hasLiked ? 'text-[#00D522]' : 'text-white'
            }`}
          >
            <div className="flex items-center space-x-1">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
              </svg>
            </div>
            <span className="text-[12px] font-medium">Like ({likes})</span>
          </button>

          {/* Share */}
          <button
            onClick={() => {
              navigator.clipboard?.writeText?.(window.location.href);
              if (onShowToast) onShowToast('Link copied to clipboard!');
            }}
            className="flex flex-col items-center space-y-1 text-white hover:text-white/80 transition-colors focus:outline-none cursor-pointer"
          >
            <Share2 className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[12px] font-medium">Share</span>
          </button>
        </div>
      </div>

      {isSeries && (
        <SeriesEpisodesList key={movie.id} movie={movie} onEpisodesLoaded={setEpisodes}
          onPlayEpisode={(episode, rows) => onPlayMovie(episode, rows)} onDownloadEpisode={onDownloadMovie} />
      )}

      {/* "You may also like" Section */}
      {!isSeries && relatedMovies && relatedMovies.length > 0 && (
        <div className="mt-6">
          <div className="px-5 flex items-center justify-between">
            <h3 className="text-white text-[16px] font-bold">You may also like</h3>
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
          <div className="mt-2.5 flex overflow-x-auto scrollbar-none px-5 space-x-2.5 pb-2 touch-pan-x">
            {relatedMovies.map((m) => (
              <div
                key={m.id}
                onClick={() => onMovieClick(m)}
                className="flex-shrink-0 w-[110px] cursor-pointer"
              >
                <MoviePoster
                  src={m.posterUrl}
                  alt={m.title}
                  title={m.title}
                  vj={m.vj}
                  isLocked={m.isLocked}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {!isSeries && ['Action', 'Horror', 'Series', 'Sci Fi', 'Romance', 'Drama', 'Adventure', 'Comedy', 'Crime', 'Kung Fu', 'Thriller', 'Sport', 'Animation'].map(name => (
        <PosterRow key={name} title={name}
          movies={filterCatalog(catalog, name, 'genre').filter(item => item.id !== movie.id).slice(0, 20)}
          onArrowClick={() => onSelectCategory?.(name)} onMovieClick={onMovieClick} />
      ))}
    </div>
  );
};
