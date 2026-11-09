/**
 * MunoWatch movie API client. All calls go through this app's own /api/*
 * routes, which talk to the movie server and return clean, ready-to-use data
 * (real titles, https posters and playable stream links).
 */
import { Movie } from '../types';
import { filterCatalog } from './catalogFilters';
import { searchCatalog, mergeSearchResults } from './catalogSearch';

export interface DashboardResponse {
  heroMovies: Movie[];
  latestMovies: Movie[];
  actionMovies: Movie[];
  horrorMovies: Movie[];
  seriesMovies: Movie[];
  adventureMovies: Movie[];
  loveStoryMovies: Movie[];
  comedyMovies: Movie[];
  crimeMovies: Movie[];
  familyMovies: Movie[];
  scifiMovies: Movie[];
  romanceMovies: Movie[];
  kungfuMovies: Movie[];
  dramaMovies: Movie[];
  sportMovies: Movie[];
  thrillerMovies: Movie[];
  animationMovies: Movie[];
  vjJuniorMovies: Movie[];
  allMovies: Movie[];
}

const BATCH = 40;
const detailCache = new Map<string, Movie>();

async function getJson<T>(url: string, retries = 2): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`Request failed [${res.status}]`);
      return (await res.json()) as T;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw lastErr;
}

/** Fetch full details (title, description, stream) for many ids at once. */
export async function fetchMoviesByIds(ids: string[]): Promise<Movie[]> {
  const missing = ids.filter((id) => !detailCache.has(id));
  const chunks: string[][] = [];
  for (let i = 0; i < missing.length; i += BATCH) chunks.push(missing.slice(i, i + BATCH));
  await Promise.all(
    chunks.map(async (chunk) => {
      try {
        const list = await getJson<Movie[]>(`/api/movies?ids=${chunk.join(',')}`);
        list.forEach((m) => detailCache.set(m.id, m));
      } catch (e) {
        console.error('Failed to load movie details', e);
      }
    })
  );
  return ids.map((id) => detailCache.get(id)).filter((m): m is Movie => Boolean(m && m.title));
}

const byGenre = (list: Movie[], ...g: string[]) => list.filter((m) => g.some(genre => filterCatalog([m], genre, 'genre').length > 0));

function buildDashboard(all: Movie[]): DashboardResponse {
  const movies = all.filter((m) => !m.isSeries);
  const series = all.filter((m) => m.isSeries);
  const action = byGenre(all, 'Action');
  const horror = byGenre(all, 'Horror');
  const romance = byGenre(all, 'Romance');
  const drama = byGenre(all, 'Drama', 'Local Drama');
  const scifi = byGenre(all, 'Sci Fi');
  const thriller = byGenre(all, 'Thriller');
  const fun = byGenre(all, 'Comedy');
  const hero = (movies.length >= 5 ? movies : all).filter((m) => m.posterUrl).slice(0, 6);
  return {
    heroMovies: hero,
    latestMovies: all.slice(0, 20),
    actionMovies: action,
    horrorMovies: horror,
    seriesMovies: series,
    adventureMovies: byGenre(all, 'Adventure'),
    loveStoryMovies: romance,
    comedyMovies: fun,
    crimeMovies: byGenre(all, 'Crime'),
    familyMovies: byGenre(all, 'Family'),
    scifiMovies: scifi,
    romanceMovies: romance,
    kungfuMovies: byGenre(all, 'Kung Fu'),
    dramaMovies: drama,
    sportMovies: byGenre(all, 'Sport'),
    thrillerMovies: thriller,
    animationMovies: byGenre(all, 'Animation'),
    vjJuniorMovies: filterCatalog(all, 'Vj Junior', 'veejay'),
    allMovies: all,
  };
}

let liveMovies: Movie[] = [];
export const getLiveMovies = () => liveMovies;

let dashboardPromise: Promise<DashboardResponse | null> | null = null;

/** Loads the home catalog with real titles. Result is shared app-wide. */
export function fetchDashboardData(): Promise<DashboardResponse | null> {
  if (dashboardPromise) return dashboardPromise;
  dashboardPromise = (async () => {
    try {
      const raw = await getJson<{ movies: Movie[] }>('/api/dashboard');
      const ids = (raw.movies || []).map((m) => m.id);
      const full = await fetchMoviesByIds(ids);
      if (!full.length) throw new Error('No movies returned');
      liveMovies = full;
      return buildDashboard(full);
    } catch (e) {
      console.error('Error fetching dashboard:', e);
      dashboardPromise = null; // allow retry next time
      return null;
    }
  })();
  return dashboardPromise;
}

export async function fetchMovieDetails(movieId: string): Promise<Movie | null> {
  const [m] = await fetchMoviesByIds([movieId]);
  return m || null;
}

/** Real playable stream URL from the movie server, or null if unavailable. */
export async function getMoviePlayStream(movieId: string): Promise<string | null> {
  try {
    const data = await getJson<{ streamUrl?: string }>(`/api/play/${encodeURIComponent(movieId)}`, 1);
    return data.streamUrl || null;
  } catch {
    return null;
  }
}

export async function fetchSeriesDetails(seriesCode: string): Promise<{
  series_code: string;
  count: number;
  episodes: Movie[];
} | null> {
  try {
    return await getJson(`/api/series/${encodeURIComponent(seriesCode)}`, 1);
  } catch (e) {
    console.error('Failed to fetch series details:', e);
    return null;
  }
}

export async function searchServerCatalog(query: string, signal?: AbortSignal): Promise<Movie[]> {
  if (!query || !query.trim()) return [];
  const local = searchCatalog(liveMovies, query);
  const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, {
    signal: signal ?? null, headers: { Accept: 'application/json' },
  }).catch(error => {
    if (signal?.aborted || !local.length) throw error;
    return null;
  });
  if (!response || !response.ok) {
    if (local.length) return local;
    throw new Error('Search unavailable');
  }
  const result: Movie[] | { error: string } = await response.json();
  if (!Array.isArray(result)) {
    if (local.length) return local;
    throw new Error('Search unavailable');
  }
  return mergeSearchResults(local, result);
}
