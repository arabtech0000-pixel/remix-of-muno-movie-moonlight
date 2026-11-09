// @ts-nocheck -- imported app code; strict typing not yet applied
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Cast, Search, X, Loader2 } from 'lucide-react';
import { Movie } from '../../types';
import { MoviePoster } from '../common/MoviePoster';
import { searchServerCatalog } from '../../services/api';
import { Button } from '@/components/ui/button';

interface SearchScreenProps {
  onBack: () => void;
  onMovieClick: (movie: Movie) => void;
  initialQuery?: string;
  onCastClick: () => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onBack,
  onMovieClick,
  initialQuery = '',
  onCastClick,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      setError(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    setSearched(false);
    setResults([]);
    const timer = setTimeout(async () => {
      try {
        const movies = await searchServerCatalog(query, controller.signal);
        if (cancelled) return;
        setResults(movies);
        setSearched(true);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 350); // debounce

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, retry]);

  return (
    <div className="min-h-full bg-[#05051F] text-white flex flex-col pb-24 select-none animate-fadeIn">
      {/* Top Header */}
      <div className="h-14 px-3 flex items-center space-x-2 sticky top-0 bg-[#05051F]/95 backdrop-blur-md z-30 border-b border-white/5">
        <Button variant="ghost" size="icon" aria-label="Back from search"
          onClick={onBack}
          className="p-1 text-white hover:text-[#00D522] transition-colors focus:outline-none flex-shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
        </Button>

        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a movie, series, veejay..."
            autoFocus
            className="w-full bg-transparent text-white placeholder-[#9292A5] text-[14px] font-normal focus:outline-none pr-8 truncate"
          />
          {query && (
            <Button variant="ghost" size="icon" aria-label="Clear search" onClick={() => setQuery('')} className="absolute right-1 text-[#9292A5] hover:text-white p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <Button variant="ghost" size="icon" aria-label="Cast" onClick={onCastClick} className="p-1.5 text-white/90 hover:text-white flex-shrink-0 focus:outline-none cursor-pointer">
          <Cast className="w-5 h-5 stroke-[2.2]" />
        </Button>
      </div>

      {error ? <div role="alert" className="flex flex-col items-center gap-3 p-8 text-center"><p>Search is temporarily unavailable.</p><Button variant="outline" onClick={() => setRetry(value => value + 1)}>Try again</Button></div> : loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#00D522]" />
        </div>
      ) : (
        <div className="p-2.5 grid grid-cols-3 gap-2 content-start">
          {results.map((movie) => (
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
      )}

      {searched && results.length === 0 && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#9292A5] mt-12">
          <Search className="w-12 h-12 text-[#9292A5]/50 mb-3" />
          <p className="text-white text-sm font-semibold">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
};
