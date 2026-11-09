import { useEffect, useState } from 'react';
import { Download, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Movie } from '../../types';
import { fetchSeriesDetails } from '../../services/api';
import { mergeSeriesEpisodes } from '../../services/seriesEpisodes';

interface Props {
  movie: Movie;
  onPlayEpisode: (episode: Movie, episodes: Movie[]) => void;
  onDownloadEpisode: (episode: Movie) => void;
  onEpisodesLoaded?: (episodes: Movie[]) => void;
}

/** Episodes of the series shown under the movie-style details, first to last. */
export function SeriesEpisodesList({ movie, onPlayEpisode, onDownloadEpisode, onEpisodesLoaded }: Props) {
  const [episodes, setEpisodes] = useState<Movie[]>([movie]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true); setFailed(false);
    // The upstream series lookup accepts an episode's movie ID.
    void fetchSeriesDetails(movie.id).then(result => {
      if (!active) return;
      const rows = mergeSeriesEpisodes(movie, result?.episodes || []);
      setEpisodes(rows);
      onEpisodesLoaded?.(rows);
      setFailed(!result);
      setLoading(false);
    });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie.id, attempt]);

  return <section className="mt-6 px-5" aria-label="Episodes">
    <h3 className="text-white text-[16px] font-bold">Episodes{loading ? '' : ` (${episodes.length})`}</h3>
    {loading && <p role="status" className="mt-2 text-[13px] text-[#9292A5]">Loading episodes…</p>}
    {failed && <p role="alert" className="mt-2 text-[13px] text-[#9292A5]">Other episodes could not be loaded.
      <Button variant="link" className="h-auto px-1 text-[#00D522]" onClick={() => setAttempt(v => v + 1)}>Try again</Button></p>}
    <ol className="mt-3 flex flex-col gap-3">
      {episodes.map((episode, index) => {
        const current = episode.id === movie.id;
        return <li key={episode.id} className={`grid grid-cols-[96px_minmax(0,1fr)_auto] items-center gap-3 rounded-md p-2 ${current ? 'bg-white/[0.06]' : ''}`}>
          <button type="button" onClick={() => onPlayEpisode(episode, episodes)} aria-label={`Play episode ${index + 1}`}
            className="relative aspect-video w-24 overflow-hidden rounded bg-[#111128] cursor-pointer">
            {episode.posterUrl && <img src={episode.posterUrl} alt="" loading="lazy" className="h-full w-full object-cover" />}
            <span className="absolute inset-0 m-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#00D522]">
              <Play className="h-4 w-4 fill-white text-white ml-0.5" />
            </span>
          </button>
          <button type="button" onClick={() => onPlayEpisode(episode, episodes)} className="min-w-0 text-left cursor-pointer">
            <p className="text-[12px] font-semibold text-[#00D522]">Episode {index + 1}</p>
            <p className="truncate text-[14px] font-semibold text-white">{episode.title}</p>
            <p className="text-[12px] text-[#9292A5]">{[episode.duration, episode.fileSize].filter(Boolean).join(' · ')}</p>
          </button>
          <Button variant="ghost" size="icon" className="text-white" aria-label={`Download episode ${index + 1}`}
            onClick={() => onDownloadEpisode(episode)}><Download /></Button>
        </li>;
      })}
    </ol>
  </section>;
}
