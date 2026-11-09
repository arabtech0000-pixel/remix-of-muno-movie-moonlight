import type { Movie } from '../types';

export function isSeriesMovie(movie: Movie): boolean {
  return Boolean(movie.isSeries || movie.genre.split('/').some(value => /^(series|tv series)$/i.test(value.trim())));
}

/** Episode identity comes from the upstream series, never a similar title. */
export function mergeSeriesEpisodes(selected: Movie, episodes: Movie[]): Movie[] {
  const rows = new Map<string, Movie>();
  // If upstream omits the selected episode, retain it before the returned list.
  if (!episodes.some(episode => episode.id === selected.id)) rows.set(selected.id, selected);
  for (const episode of episodes) {
    const seriesCode = episode.seriesCode || selected.seriesCode;
    const hydrated: Movie = {
      ...episode,
      vj: episode.vj === 'MunoMovies' || !episode.vj ? selected.vj : episode.vj,
      description: episode.description || selected.description,
      posterUrl: episode.posterUrl || selected.posterUrl,
      isSeries: true,
      ...(seriesCode ? { seriesCode } : {}),
    };
    rows.set(episode.id, hydrated);
  }
  const list = [...rows.values()];
  // Stable sort: episodes run from the first to the last; unknown numbers keep upstream order.
  return list.map((episode, index) => ({ episode, index }))
    .sort((a, b) => (episodeOrderKey(a.episode) - episodeOrderKey(b.episode)) || a.index - b.index)
    .map(row => row.episode);
}

/** Episode number from "S01E02" in the title/stream, a trailing title number, or 1 for the base title. */
export function episodeOrderKey(movie: Pick<Movie, 'title'> & { videoUrl?: string | null }): number {
  const sources = [movie.title || '', decodeURIComponentSafe(movie.videoUrl || '')];
  for (const source of sources) {
    const match = /S(\d{1,2})\s*E(\d{1,3})/i.exec(source);
    if (match) return Number(match[1]) * 1000 + Number(match[2]);
  }
  const trailing = /(?:^|\s)(?:eps?\.?\s*)?(\d{1,3})\s*$/i.exec((movie.title || '').trim());
  return 1000 + (trailing ? Number(trailing[1]) : 1);
}

function decodeURIComponentSafe(value: string): string {
  try { return decodeURIComponent(value); } catch { return value; }
}

export function nextSeriesEpisode(movie: Movie, episodes: Movie[]): Movie | undefined {
  const index = episodes.findIndex(episode => episode.id === movie.id);
  return index < 0 ? undefined : episodes[index + 1];
}